import {add, ballKeys, clampReach, cross, ik2, limb, mul, newRig, nrm, onLoft, spline, sub, type Build, type Key, type L3} from './beast';
import {mixColor} from '../kit/painter';

// EDU-EP16 N16-16 giant dragonfly kit creature (Boss, 14 Nov 2026): body 0.42 m, wing span 0.7 m, from Film's `buildDragonfly` prototype and the user's reference (store
// `projects/edu/EDU/references/user/2026-11-14_dragonfly-ref.webp`, UT10): big dark-red eyes, a thick thorax with pale shoulder stripes, a long ringed abdomen, FOUR long wings with a dense vein net and a dark
// pterostigma near each tip, six thin dark legs hanging forward. Each wing is a thick leading-edge spar + two bracing veins + a trailing-edge rim + two translucent membranes either side of them, so it has
// thickness and edge, not a flat card. Never named on screen.
// Skeleton: thorax (root) -> head [head.joint on the front] -> eye.L/R; thorax -> abdomen [abd.base on the rear, a constant-length arc]; thorax -> wing.FL / FR / HL / HR [wing.X.root on the top of the loft];
// thorax -> legs L1..L3 / R1..R3: thigh [hip] -> shin [knee] -> foot [ankle]. Metres are real: the camera needs `near` below the 0.3 m default for a close shot.

export const DF = {abd: '#7a2c22', abdDark: '#4a1a14', thorax: '#6e3426', stripe: '#e6d6b8', eye: '#7a1e18', eyeHi: '#a8382c', wing: '#eef0ea', vein: '#4a2220', stigma: '#3a1a14', leg: '#2a1e1a', ink: '#201210'} as const;
export type DragonflyPose = {
  /** Wing beat phase 0..1 (fore and hind pairs beat in opposition) and the stroke amplitude (rad, default 0.55). */
  flap?: number; amp?: number;
  /** Mean wing angle above horizontal (rad): 0.35 = hover, 0 = glide with wings flat. */
  lift?: number;
  /** Abdomen pitch (rad, + raises the tail) and sideways curl (rad). */
  abd?: number; curl?: number;
  /** Legs 0 = tucked under, 1 = reaching forward. */
  legs?: number;
};
const WING = [{id: 'FL', g: 1, hind: false}, {id: 'FR', g: -1, hind: false}, {id: 'HL', g: 1, hind: true}, {id: 'HR', g: -1, hind: true}] as const;

export const buildDragonfly = (o: DragonflyPose = {}): Build => {
  const R = newRig(), B = R.B, fl = o.flap ?? 0, amp = o.amp ?? 0.55, lift = o.lift ?? 0.35, tw = 2 * Math.PI;
  const root = R.bone('thorax', null);
  const thorax = spline([{p: [-0.07, 0.015, 0], a: 0.03, b: 0.034}, {p: [0.0, 0.025, 0], a: 0.044, b: 0.05}, {p: [0.07, 0.022, 0], a: 0.04, b: 0.045}], 4);
  R.loft(root, {m: 12, col: (u, s) => (s > 0.3 ? DF.thorax : u > 0.35 && u < 0.62 && s < 0.2 ? DF.stripe : DF.thorax), cap: true, keys: thorax});
  // head: a capsule on the front of the thorax, two big eyes on its sides
  const hj = onLoft(thorax, 1.0), head = R.bone('head', root, 'head.joint', hj);
  R.loft(head, {m: 10, col: () => DF.thorax, keys: spline([{p: add(hj, [-0.01, 0, 0]), a: 0.036, b: 0.04}, {p: add(hj, [0.025, -0.002, 0]), a: 0.03, b: 0.034}, {p: add(hj, [0.05, -0.012, 0]), a: 0.018, b: 0.02}], 3), cap: true});
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const c = add(hj, [0.03, 0.012, g * 0.022]), eb = R.bone(`eye.${nm}`, head, `eye.${nm}.pivot`, c);
    R.loft(eb, {m: 10, col: (u, s) => (s > 0.4 ? DF.eyeHi : DF.eye), keys: ballKeys(c, 0.043, [0, 0, g]), fold: undefined});
  }
  // abdomen: ten rings, a constant-length arc pitched by `abd`, curled by `curl`
  const ab = onLoft(thorax, 0.0), abd = R.bone('abdomen', root, 'abd.base', ab), NA = 10, L = 0.4, step = L / NA;
  const pts: L3[] = [ab];
  let pitch = -0.06, yaw = 0, x = ab[0], y = ab[1], z = ab[2];
  for (let i = 1; i <= NA; i++) { pitch += (o.abd ?? 0) / NA; yaw += (o.curl ?? 0) / NA; const hx = Math.cos(pitch) * Math.cos(yaw); x -= hx * step; y += Math.sin(pitch) * step * -1 * -1; z += Math.cos(pitch) * Math.sin(yaw) * step; pts.push([x, y, z]); }
  const r = (i: number) => 0.019 - 0.011 * (i / NA) ** 0.8;
  R.loft(abd, {m: 8, col: (u) => (Math.floor(u * NA) % 2 ? DF.abd : DF.abdDark), keys: pts.map((p, i) => ({p, a: r(i) * (i === NA ? 0.55 : 1) , b: r(i) * (i === NA ? 0.55 : 1) * 1.05}) as Key)});
  // wings
  for (const w of WING) {
    const sw = w.hind ? 0.32 : 0.12, len = w.hind ? 0.31 : 0.34, ch = w.hind ? 0.125 : 0.105, ph = fl + (w.hind ? 0.5 : 0);
    const rj = onLoft(thorax, w.hind ? 0.28 : 0.55, w.g * 0.5, 0.82), alpha = lift + amp * Math.sin(ph * tw), wb = R.bone(`wing.${w.id}`, root, `wing.${w.id}.root`, rj);
    // frame: span d (out, up by alpha, swept back by sw), chord c (leading edge -> trailing edge, toward the tail), normal n
    const d = nrm([-sw, Math.sin(alpha), w.g * Math.cos(alpha)]), c0 = nrm(sub([-1, 0, 0], mul(d, -d[0]))), n = nrm(cross(d, c0)), c = nrm(cross(n, d));
    const chord = (u: number) => ch * (0.62 + 0.38 * Math.sin(Math.PI * Math.min(1, 0.18 + 0.82 * u)) ** 0.7) * (1 - 0.32 * u * u);
    const P = (u: number, v: number, off = 0): L3 => { const base = add(rj, mul(d, len * u)); return add(add(base, mul(c, chord(u) * v)), mul(n, off + 0.012 * Math.sin(Math.PI * v) * (1 - 0.6 * u))); };
    const spar = (v: number, r0: number, r1: number, n2 = 6): Key[] => Array.from({length: n2 + 1}, (_, i) => ({p: P(i / n2, v), a: r0 + (r1 - r0) * (i / n2), b: r0 + (r1 - r0) * (i / n2)}));
    R.loft(wb, {m: 5, col: () => DF.vein, keys: spar(0, 0.007, 0.0028)});         // leading-edge spar: starts exactly on the wing root joint
    R.loft(wb, {m: 4, col: () => DF.vein, keys: spar(0.22, 0.0035, 0.0016)});
    R.loft(wb, {m: 4, col: () => DF.vein, keys: spar(0.55, 0.003, 0.0014)});
    R.loft(wb, {m: 4, col: () => mixColor(DF.vein, DF.wing, 0.3), keys: spar(1, 0.0022, 0.0012)});  // trailing-edge rim
    const outline = (off: number): L3[] => [...Array.from({length: 9}, (_, i) => P(i / 8, 0, off)), ...Array.from({length: 9}, (_, i) => P(1 - i / 8, 1, off))];
    const veins: L3[][] = [0.12, 0.3, 0.45, 0.62, 0.8].map((v) => Array.from({length: 8}, (_, i) => P(i / 7, v, 0.0)));
    for (let i = 1; i < 22; i++) veins.push([P(i / 22, 0), P(i / 22 + 0.01, 0.5), P(i / 22 + 0.02, 1)]);
    for (let i = 0; i < 6; i++) veins.push(Array.from({length: 7}, (_, k) => P(0.05 + (0.9 * k) / 6, 0.08 + 0.14 * i + 0.03 * Math.sin(k + i))));
    for (const off of [0.0028, -0.0028]) R.flat(wb, {pts: outline(off), col: DF.wing, two: true, op: 140, veins: off > 0 ? veins.map((v) => v.map((q) => add(q, mul(n, off)))) : undefined, ink: DF.vein});
    R.flat(wb, {pts: [P(0.8, 0), P(0.9, 0), P(0.9, 0.2), P(0.8, 0.2)], col: DF.stigma, two: true});
  }
  // legs: three pairs on the underside of the thorax, thin, reaching forward by `legs`
  const lg = o.legs ?? 0.6;
  ([['1', 0.82], ['2', 0.5], ['3', 0.2]] as const).forEach(([k, u], i) => {
    for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
      const hip = onLoft(thorax, u, g * 0.35, -0.85), want: L3 = [hip[0] + 0.03 + 0.07 * lg + 0.02 * i, hip[1] - 0.11 + 0.05 * (1 - lg), hip[2] + g * (0.03 + 0.02 * i)];
      const foot = clampReach(hip, want, 0.06, 0.06), knee = ik2(hip, foot, 0.06, 0.06, [0.3, 0.7, g * 0.3]);
      limb(R, {id: `${nm}${k}`, parent: root, hip, knee, foot, side: g, col: () => DF.leg, r: [0.0045, 0.0032, 0.0024, 0.002]});
    }
  });
  B.shadow = {s: 0, l: 0, rs: 0, rl: 0};
  B.anchors = {head: add(hj, [0.05, 0, 0]), tail: pts[NA], thorax: [0.0, 0.025, 0], top: [0, 0.12, 0]};
  B.feet = [];
  return B;
};

export const DRAGONFLY_POSES = {
  /** Hover: wings beating at full stroke, legs half-reaching, abdomen slightly dropped. */
  hover: (t: number): DragonflyPose => ({flap: t, amp: 0.6, lift: 0.3, abd: -0.15, legs: 0.5}),
  /** Fly past: smaller, quicker stroke with the abdomen straight and legs tucked; place with a nose-down pitch and a bank. */
  flyPast: (t: number): DragonflyPose => ({flap: t, amp: 0.4, lift: 0.15, abd: 0.05, legs: 0.0}),
};
/** Attitude of the fly-past in `paintBeast` placement: nose slightly down, banked toward the camera. */
export const DRAGONFLY_FLYPAST_PLACE = {pitch: -0.12, bank: 0.35} as const;

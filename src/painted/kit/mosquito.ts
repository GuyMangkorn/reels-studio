import {hardFill, washAt} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import {add, ballKeys, clamp, ik2, limb, lerp, mul, newRig, nrm, spline, sub, type Build, type Key, type L3} from '../survival/beast';

// `new: mosquito` AS-MOSQUITO-R1 (Boss, 15 Nov 2026; EDU-EP18-BRIEF-R1 N13 / VD06, pre-W3 comp-card pass, not user-approved). Two scales of one asset:
// - macro (space M, millimetres): a lean dark mosquito, body 6 mm (head + thorax + abdomen), legs spanning ~14 mm, black with pale bands on the abdomen and the legs
//   (an Aedes-like read without naming a species), blurred wings, a cool rim light on the upper edges. Built on the creature-kit loft engine in MILLIMETRES used as
//   engine units (so a macro camera can arc and truck round it, B05-SH03), listed in BEAST_KIT as MOSQUITO. Everything sits Y0 mm up so the engine's ground darkening
//   (y < 0.6 units) never touches it; the macro has no ground.
// - room scale: `drawMosquitoDot`, a 4-6 px dark dot with a faint 2 px blur trail (the brief's dot; screen size, not projected), the same object in B02-SH03 and B05.
// Deviation from the brief's proposed method (flea.ts flat card with `len`): a flat card cannot turn under the macro arc; the loft build can. Recorded in build notes.
// Skeleton: thorax (root) -> head [head.joint] -> proboscis [prob.joint], antenna.L/R; thorax -> abdomen [abd.joint]; thorax -> wing.L/R [wing.*.root];
// thorax -> legs F/M/H L/R (limb(): femur [hip] -> tibia [knee] -> tarsus [ankle]).

export const MOSQ = {body: '#2a2624', band: '#d9d4c8', eye: '#141214', rim: '#a9c4e6', wing: '#c9d4e0', vein: '#8a96a6', leg: '#2e2a28'} as const;
/** Height (mm) of the thorax centre above the engine origin (keeps every part above the engine's 0.6-unit ground darkening). */
export const MOSQ_Y0 = 8;
export type MosquitoPose = {
  /** wing-beat phase (cycles); `blur` 0..1 = how many ghost wings fan across the stroke (1 = flying blur, 0 = one sharp wing) */
  beat?: number; blur?: number;
  /** wings folded over the abdomen (resting) instead of beating */
  folded?: boolean;
  /** body bob (mm), body pitch (rad, + nose up) */
  bob?: number; pitch?: number;
  /** leg dangle sway (rad) */
  sway?: number;
  /** rim light strength 0..1 */
  rim?: number;
};
const rotS = (p: L3, a: number): L3 => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - (p[1] - MOSQ_Y0) * s, MOSQ_Y0 + p[0] * s + (p[1] - MOSQ_Y0) * c, p[2]]; };

export const buildMosquito = (o: MosquitoPose = {}): Build => {
  const R = newRig(), B = R.B, Y = MOSQ_Y0 + (o.bob ?? 0), rimK = clamp(o.rim ?? 1);
  const lit = (base: string) => (_u: number, sd: number) => (sd > 0.7 ? mixColor(base, MOSQ.rim, 0.55 * rimK) : sd > 0.4 ? mixColor(base, MOSQ.rim, 0.22 * rimK) : base);
  const root = R.bone('thorax', null);
  const th: Key[] = spline([{p: [-0.75, Y - 0.05, 0], a: 0.42, b: 0.42}, {p: [-0.1, Y + 0.18, 0], a: 0.68, b: 0.82}, {p: [0.6, Y + 0.12, 0], a: 0.6, b: 0.66}, {p: [1.08, Y - 0.05, 0], a: 0.3, b: 0.32}], 3);
  R.loft(root, {m: 12, cap: true, col: lit(MOSQ.body), keys: th});
  // scutum pale lines (the lyre marks read as two thin pale stripes on the back)
  for (const g of [1, -1]) R.flat(root, {pts: [[-0.5, Y + 0.95, g * 0.12], [0.55, Y + 0.84, g * 0.1], [0.55, Y + 0.84, g * 0.2], [-0.5, Y + 0.95, g * 0.22]], col: MOSQ.band, two: true});
  // head: big dark compound eyes, proboscis down-forward, short palps, antennae up-forward
  const hj: L3 = [1.1, Y - 0.08, 0], head = R.bone('head', root, 'head.joint', hj);
  R.loft(head, {m: 10, col: lit(MOSQ.body), keys: ballKeys(hj, 0.22, [1, 0, 0])});
  R.loft(head, {m: 12, col: lit(MOSQ.eye), keys: ballKeys([1.45, Y - 0.12, 0], 0.44, [1, -0.2, 0])});
  const pj: L3 = [1.82, Y - 0.3, 0], prob = R.bone('proboscis', head, 'prob.joint', pj), pt: L3 = [3.55, Y - 1.25, 0];
  R.loft(prob, {m: 6, cap: true, col: lit(MOSQ.body), keys: [{p: pj, a: 0.09, b: 0.09}, {p: lerp(pj, pt, 0.5), a: 0.07, b: 0.07}, {p: lerp(pj, pt, 0.92), a: 0.05, b: 0.05}, {p: pt, a: 0.03, b: 0.03}]});
  R.loft(prob, {m: 6, col: () => MOSQ.band, keys: ballKeys(lerp(pj, pt, 0.55), 0.085, sub(pt, pj))});   // pale band mid-proboscis
  for (const g of [1, -1]) {
    R.loft(prob, {m: 6, cap: true, col: lit(MOSQ.body), keys: [{p: add(pj, [0, 0.02, g * 0.08]), a: 0.05, b: 0.05}, {p: add(pj, [0.55, -0.3, g * 0.12]), a: 0.045, b: 0.045}]});   // palp
    const ab: L3 = [1.7, Y + 0.18, g * 0.12], ant = R.bone(`antenna.${g > 0 ? 'L' : 'R'}`, head, `ant.${g > 0 ? 'L' : 'R'}.base`, ab), at: L3 = [2.55, Y + 1.1, g * 0.5];
    R.loft(ant, {m: 6, cap: true, col: lit(MOSQ.body), keys: [{p: ab, a: 0.05, b: 0.05}, {p: lerp(ab, at, 0.5), a: 0.035, b: 0.035}, {p: at, a: 0.02, b: 0.02}]});
    for (let k = 1; k < 6; k++) { const q = lerp(ab, at, k / 6); R.flat(ant, {pts: [q, add(q, [0.12, 0.08, g * 0.14]), add(q, [0.02, 0.02, g * 0.02])], col: MOSQ.body, two: true}); }   // whorl hairs
  }
  // abdomen: long, slender, drooping a little; a pale band at the base of each segment (top and sides), pale belly scales
  const aj: L3 = [-0.68, Y - 0.08, 0], abd = R.bone('abdomen', root, 'abd.joint', aj);
  const ak: Key[] = spline([{p: aj, a: 0.38, b: 0.36}, {p: [-1.6, Y - 0.22, 0], a: 0.44, b: 0.4}, {p: [-2.7, Y - 0.45, 0], a: 0.36, b: 0.32}, {p: [-3.55, Y - 0.62, 0], a: 0.2, b: 0.18}, {p: [-3.85, Y - 0.66, 0], a: 0.08, b: 0.08}], 4);
  R.loft(abd, {m: 12, cap: true, col: (u, sd) => { const seg = (u * 8) % 1; return seg < 0.22 && sd > -0.2 ? mixColor(MOSQ.band, MOSQ.rim, sd > 0.6 ? 0.3 * rimK : 0) : sd < -0.5 ? mixColor(MOSQ.body, MOSQ.band, 0.35) : lit(MOSQ.body)(u, sd); }, keys: ak});
  // wings: narrow translucent blades from the thorax shoulders; folded flat over the abdomen at rest, else a stroke fan of ghost wings (the blur)
  const blur = clamp(o.blur ?? 1), ph = o.beat ?? 0;
  for (const g of [1, -1]) {
    const nm = g > 0 ? 'L' : 'R', wr: L3 = [0.25, Y + 0.55, g * 0.42], wb = R.bone(`wing.${nm}`, root, `wing.${nm}.root`, wr);
    R.loft(wb, {m: 6, col: lit(MOSQ.body), keys: ballKeys(wr, 0.14, [0, 1, 0])});   // wing root (the bone's root part on its joint)
    const blade = (ang: number, op: number) => {
      // ang: stroke angle about the body axis (0 = flat out sideways, + up); the blade sweeps back 25 deg
      const dir = nrm([-0.45, Math.sin(ang), g * Math.cos(ang)]), side = nrm([-(dir[2] * g) * 0.0 - 1, 0, 0]), L = 3.6, W = 0.42;
      const tip = add(wr, mul(dir, L)), mid = add(wr, mul(dir, L * 0.55));
      const pts: L3[] = [wr, add(mid, mul(side, W)), add(tip, mul(side, W * 0.35)), add(tip, mul(side, -W * 0.25)), add(mid, mul(side, -W * 0.45)), add(wr, mul(side, -0.08))];
      R.flat(wb, {pts, col: MOSQ.wing, two: true, op, veins: blur < 0.5 ? [[wr, tip], [add(wr, mul(side, 0.1)), add(mid, mul(side, W * 0.6)), add(tip, mul(side, W * 0.2))]] : undefined, ink: blur < 0.5 ? MOSQ.vein : undefined});
    };
    if (o.folded) {
      const tip: L3 = [-3.4, Y + 0.5, g * 0.12], mid = lerp(wr, tip, 0.55);
      R.flat(wb, {pts: [wr, add(mid, [0, 0.05, g * 0.32]), add(tip, [0, 0, g * 0.1]), add(tip, [0, 0, -g * 0.05]), add(mid, [0, 0.08, -g * 0.08])], col: MOSQ.wing, two: true, op: 120, veins: [[wr, tip]], ink: MOSQ.vein});
    } else {
      const n = blur > 0.05 ? 4 : 1, s0 = Math.sin(ph * 2 * Math.PI) * 0.9;
      for (let k = 0; k < n; k++) blade(n === 1 ? s0 : s0 + (k / (n - 1) - 0.5) * 1.4 * blur, n === 1 ? 150 : 80);
    }
    R.loft(wb, {m: 6, col: () => MOSQ.band, keys: ballKeys(add(wr, [-0.5, -0.1, g * 0.05]), 0.09, [0, 1, 0])});   // haltere knob behind the wing root
  }
  // legs: long, thin, black with pale bands at each joint; front pair forward-down, middle out-down, hind pair raised up and back (dangling in flight)
  const sw = o.sway ?? 0;
  const LEGS = [['F', 0.55, [3.4, Y - 2.9, 2.6], 2.2, 2.4, [1, 0.8, 0.3]], ['M', 0.1, [0.5, Y - 3.4, 4.2], 2.4, 2.6, [0.1, 1, 0.6]], ['H', -0.35, [-4.6, Y - 0.2, 2.6], 2.7, 2.8, [-0.3, 1, 0.3]]] as const;   // hind pair raised behind (the Aedes-like read)
  for (const [id, s0, foot0, l1, l2, bend] of LEGS) for (const g of [1, -1]) {
    const hip: L3 = [s0, Y - 0.5, g * 0.3], ft0: L3 = [foot0[0] + sw * (id === 'H' ? -0.3 : 0.4), foot0[1] + sw * 0.3, g * foot0[2]];
    const ank = (() => { const v = sub(ft0, hip), d = Math.hypot(...v), dm = (l1 + l2) * 0.98; return d > dm ? add(hip, mul(v, dm / d)) : ft0; })();
    const knee = ik2(hip, ank, l1, l2, [bend[0], bend[1], g * bend[2]]), tdir = nrm(add(sub(ank, knee), id === 'H' ? [-0.4, 0.5, 0] : [0, -0.6, 0])), pad = add(ank, mul(tdir, id === 'H' ? 2.4 : 2.0));
    const legCol = (u: number, sd: number) => (u < 0.12 ? MOSQ.band : lit(MOSQ.leg)(u, sd));
    const lb = limb(R, {id: `${id}${g > 0 ? 'L' : 'R'}`, parent: root, hip, knee, foot: ank, side: g as 1 | -1, col: legCol, pad, padMin: 0.03, r: [0.1, 0.075, 0.06, 0.035]});
    for (const f of [0.33, 0.66]) R.loft(lb.foot, {m: 6, col: () => MOSQ.band, keys: ballKeys(lerp(ank, pad, f), 0.06, sub(pad, ank))});   // tarsal bands
  }
  B.feet = [];
  B.shadow = {s: 0, l: 0, rs: 0, rl: 0};
  B.anchors = {thorax: [0, Y, 0], head: [1.45, Y - 0.12, 0], proboscisTip: pt, abdomenTip: [-3.85, Y - 0.66, 0]};
  if (o.pitch) { const a = o.pitch; for (const q of B.parts) q.keys = q.keys.map((k) => ({...k, p: rotS(k.p, a)})); for (const fl of B.flats) { fl.pts = fl.pts.map((p) => rotS(p, a)); if (fl.veins) fl.veins = fl.veins.map((v) => v.map((p) => rotS(p, a))); } for (const j of Object.keys(B.joints)) B.joints[j] = rotS(B.joints[j], a); for (const k of Object.keys(B.anchors)) B.anchors[k] = rotS(B.anchors[k], a); }
  return B;
};

export const MOSQUITO_POSES = {
  /** hover cycle (one wing-beat on the picture clock is far faster than a frame; the blur fan stands for it): slow bob, legs sway, nose slightly down */
  hover: (t: number): MosquitoPose => ({beat: t * 3, blur: 1, bob: 0.25 * Math.sin(t * 6.283), sway: 0.15 * Math.sin(t * 6.283 + 1), pitch: -0.08}),
  /** resting pose for the turnaround: wings folded, so the body, legs and bands read */
  rest: (): MosquitoPose => ({folded: true, pitch: 0}),
};

/**
 * Room-scale mosquito (B02-SH03, B05-SH02/03 end): a dark dot of `size` px (brief 4-6) at `at`, with a faint blur trail of `trail` px toward where it came from
 * (`dir` unit vector, screen). Screen-size by design: at 0.3-1 m a 6 mm body projects to a few px anyway, and the brief fixes the read size. Pure function of its inputs.
 */
export const drawMosquitoDot = (p: Painter, seed: number, at: Pt, size = 5, dir: Pt = [-1, 0.2], trail = 2, color = MOSQ.body) => {
  const l = Math.hypot(dir[0], dir[1]) || 1, ux = dir[0] / l, uy = dir[1] / l, r = size / 2;
  if (trail > 0) { const tr = r * 0.8, e = [at[0] + ux * (trail + r * 1.2), at[1] + uy * (trail + r * 1.2)]; washAt(p, seed + 1, color, 70, [[at[0] - uy * tr, at[1] + ux * tr], [e[0], e[1]], [at[0] + uy * tr, at[1] - ux * tr]], 0.1, 0.1); }
  hardFill(p, seed, color, Array.from({length: 10}, (_, k) => [at[0] + r * Math.cos((k / 10) * 6.283), at[1] + r * 0.85 * Math.sin((k / 10) * 6.283)] as Pt));
};

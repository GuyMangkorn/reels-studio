import {add, ballKeys, clampReach, cross, ik2, lerp, limb, mul, newRig, nrm, onLoft, spline, sub, type Build, type Key, type L3} from './beast';
import {mixColor} from '../kit/painter';

// EDU-EP16 N16-07 R2 pterosaur motion set (Boss, 14 Nov 2026), a skeleton build on the shared loft engine (beast.ts) so the kit's joint, picture and root checks apply. The older painter `pterosaur.ts` stays for EP17.
// Look from the user's reference (store `projects/edu/EDU/references/user/2026-11-14_pterosaur-ref.webp`, UT10): pteranodon-like, a small light body, a long S neck, a very long pointed beak with a
// blade crest sweeping back, two long NARROW wings swept back (arm to the wrist, then one long wing finger; the membrane runs from the finger to the hind limb), thin hind legs with claws. Span 3 m (wing finger 1.0 m,
// arm 0.45 m, body 0.5 m), never named on screen.
// Skeleton (local metres, x forward, y up, z toward the animal's right wing): body (root) -> neck [neck.base, buried in the chest] -> head [head.joint] -> jaw [jaw.hinge], eye.L/R;
// body -> wing.L/R.arm [wing.X.shoulder] -> wing.X.finger [wing.X.wrist] carrying the membrane panels; body -> legs L / R: thigh [hip] -> shin [knee] -> foot [ankle] with claws (limb()).
// Every pose is rotated as one rigid piece by `pitch` / `bank` at the end, so a dive or a banked circle lives in the animation and the check views see it.

export const PTX = {skin: '#8c6444', back: '#6a4a34', belly: '#b08a62', beak: '#9a7a52', beakTip: '#5a4430', crest: '#c0663a', arm: '#5a4030', mem: '#d08a52', memDark: '#a8683c', claw: '#2a2420', eye: '#e8b040', ink: '#2e2620'} as const;
export type PteroKitPose = {
  /** Wing-beat phase (cycles) and the arm's stroke (rad); `lift` = the mean arm elevation above horizontal (rad). */
  flap?: number; amp?: number; lift?: number;
  /** Wings folded back along the body, 0..1 (0 = spread, ~0.9 = perched). */
  fold?: number;
  /** Neck elevation angle (rad above forward), its yaw to the right (rad), its bow (m), head pitch (rad, + beak up), extra head yaw (rad), jaw opening 0..1. */
  na?: number; ny?: number; bow?: number; hp?: number; hy?: number; jaw?: number;
  /** Hind-leg posture: 0 = trailed back (flight), 1 = reaching forward and down (grab), 2 = straight down (perched). */
  leg?: number;
  /** Rigid attitude of the whole animal: nose-up pitch and bank to the right-wing side (rad). */
  pitch?: number; bank?: number;
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (a: number, b: number, t: number) => { const u = clamp01((t - a) / (b - a)); return u * u * (3 - 2 * u); };
const mixN = (a: number, b: number, k: number) => a + (b - a) * k;
const TWO_PI = Math.PI * 2;
const ARM = 0.45, FINGER = 1.0, NL = 0.32, ROT = (p: L3, ps: number, bs: number): L3 => {
  const y1 = p[1] * Math.cos(bs) - p[2] * Math.sin(bs), z1 = p[1] * Math.sin(bs) + p[2] * Math.cos(bs);
  return [p[0] * Math.cos(ps) - y1 * Math.sin(ps), p[0] * Math.sin(ps) + y1 * Math.cos(ps), z1];
};

export const buildPterosaur = (o: PteroKitPose = {}): Build => {
  const R = newRig(), B = R.B, fl = o.flap ?? 0, amp = o.amp ?? 0.6, lift = o.lift ?? 0.12, fold = o.fold ?? 0;
  const root = R.bone('body', null);
  const body = spline([{p: [-0.32, 0.0, 0], a: 0.02, b: 0.02}, {p: [-0.2, 0.0, 0], a: 0.06, b: 0.062}, {p: [0.0, 0.01, 0], a: 0.082, b: 0.088}, {p: [0.17, 0.03, 0], a: 0.07, b: 0.075}, {p: [0.25, 0.04, 0], a: 0.045, b: 0.05}], 4);
  R.loft(root, {m: 12, cap: true, col: (u, sd) => (sd > 0.4 ? PTX.back : sd < -0.3 ? PTX.belly : PTX.skin), keys: body});
  // neck: a thick S from the buried base in the chest to the back of the skull; `bow` pushes the middle up
  const n0 = onLoft(body, 0.82, 0, 0.1), neck = R.bone('neck', root, 'neck.base', n0), na = o.na ?? 0.9, ny = o.ny ?? 0, bow = o.bow ?? 0.04;
  const nd: L3 = [Math.cos(na) * Math.cos(ny), Math.sin(na), Math.cos(na) * Math.sin(ny)], hj = add(n0, mul(nd, NL)), nm = add(add(n0, mul(nd, NL * 0.5)), [0, bow, 0]);
  R.loft(neck, {m: 10, col: (u, sd) => (sd > 0.3 ? PTX.back : PTX.skin), keys: spline([{p: n0, a: 0.05, b: 0.055}, {p: nm, a: 0.038, b: 0.04}, {p: hj, a: 0.034, b: 0.036}], 3)});
  // head frame: f along the beak, up, side
  const hp = o.hp ?? 0, hy = ny + (o.hy ?? 0), f: L3 = nrm([Math.cos(hp) * Math.cos(hy), Math.sin(hp), Math.cos(hp) * Math.sin(hy)]), upv: L3 = nrm([-Math.sin(hp) * Math.cos(hy), Math.cos(hp), -Math.sin(hp) * Math.sin(hy)]), sd = cross(f, upv);
  const H = (u: number, v = 0, w = 0): L3 => add(add(add(hj, mul(f, u)), mul(upv, v)), mul(sd, w));
  const head = R.bone('head', neck, 'head.joint', hj);
  R.loft(head, {m: 10, cap: true, col: (u, s) => (u > 0.55 ? PTX.beak : s > 0.3 ? PTX.back : PTX.skin), keys: spline([{p: H(-0.01), a: 0.034, b: 0.036}, {p: H(0.1, 0.004), a: 0.03, b: 0.034}, {p: H(0.26, 0.014), a: 0.016, b: 0.022}, {p: H(0.44, 0.016), a: 0.009, b: 0.013}, {p: H(0.58, 0.014), a: 0.004, b: 0.005}], 3)});
  // crest: a blade sweeping back and up from the top of the skull
  R.flat(head, {pts: [H(0.08, 0.034), H(-0.36, 0.2), H(-0.04, 0.034)], col: PTX.crest, two: true});
  R.flat(head, {pts: [H(0.08, 0.034), H(-0.36, 0.2), H(-0.34, 0.185), H(0.05, 0.03)], col: mixColor(PTX.crest, PTX.ink, 0.45), two: true});
  for (const [g, nmn] of [[1, 'L'], [-1, 'R']] as const) {
    const e = H(0.075, 0.012, g * 0.03), eb = R.bone(`eye.${nmn}`, head, `eye.${nmn}.pivot`, e), out = add(mul(sd, g), mul(f, 0.0));
    R.loft(eb, {m: 8, col: () => PTX.ink, keys: ballKeys(e, 0.016, out)});
    R.loft(eb, {m: 8, col: () => PTX.eye, keys: ballKeys(add(e, mul(out, 0.006)), 0.011, out)});
  }
  // jaw: hinged under the skull; the lower beak is slimmer and opens by up to 0.6 rad
  const ja = hp - 0.6 * (o.jaw ?? 0), jf: L3 = nrm([Math.cos(ja) * Math.cos(hy), Math.sin(ja), Math.cos(ja) * Math.sin(hy)]), ju: L3 = nrm([-Math.sin(ja) * Math.cos(hy), Math.cos(ja), -Math.sin(ja) * Math.sin(hy)]), hinge = H(0.03, -0.03);
  const J = (u: number, v = 0): L3 => add(add(hinge, mul(jf, u)), mul(ju, v)), jaw = R.bone('jaw', head, 'jaw.hinge', hinge);
  R.loft(jaw, {m: 8, cap: true, col: (u) => (u > 0.5 ? PTX.beak : PTX.belly), keys: spline([{p: J(0), a: 0.022, b: 0.018}, {p: J(0.16), a: 0.017, b: 0.014}, {p: J(0.34, 0.004), a: 0.01, b: 0.01}, {p: J(0.5, 0.006), a: 0.004, b: 0.005}], 3)});
  // wings
  for (const [g, nmw] of [[1, 'L'], [-1, 'R']] as const) {
    const ph = fl * TWO_PI, dp = lift + amp * 0.5 * Math.sin(ph), dd = lift * 0.3 + amp * 0.9 * Math.sin(ph - 0.9), sw = 0.6 + 3.2 * fold;
    const S = onLoft(body, 0.72, g * 0.8, 0.3);
    const ad = nrm([0.5 - 1.1 * fold, Math.sin(dp) + 0.7 * fold, g * Math.cos(dp) * (1 - 0.5 * fold)]), W = add(S, mul(ad, ARM));
    const fd = nrm([-sw, Math.sin(dd) + 0.5 * fold, g * (1 - 0.88 * fold) * Math.cos(dd)]), T = add(W, mul(fd, FINGER)), Hm = onLoft(body, 0.2, g * 0.9, 0.0);
    const arm = R.bone(`wing.${nmw}.arm`, root, `wing.${nmw}.shoulder`, S), fin = R.bone(`wing.${nmw}.finger`, arm, `wing.${nmw}.wrist`, W);
    R.loft(arm, {m: 6, col: () => PTX.arm, keys: spline([{p: S, a: 0.026, b: 0.026}, {p: lerp(S, W, 0.5), a: 0.021, b: 0.021}, {p: W, a: 0.016, b: 0.016}], 2)});
    R.loft(arm, {m: 8, col: () => PTX.arm, keys: ballKeys(W, 0.022, ad)});   // the wrist is a ball, so a bent wing never opens a wedge
    R.loft(fin, {m: 6, col: () => PTX.arm, keys: spline([{p: W, a: 0.016, b: 0.016}, {p: lerp(W, T, 0.5), a: 0.009, b: 0.009}, {p: T, a: 0.003, b: 0.003}], 2)});
    // membrane: arm panel S-W-hip, then panels fanned from the wing finger to a concave trailing edge that runs from the hip to the tip
    R.flat(arm, {pts: [S, W, Hm], col: mixColor(PTX.mem, PTX.ink, 0.12), two: true});
    const NP = 5, F = (s: number) => lerp(W, T, s), Tr = (s: number): L3 => { const b = lerp(Hm, T, s); return add(b, mul(sub(F(s), b), 0.22 * Math.sin(Math.PI * s))); };
    for (let i = 0; i < NP; i++) {
      const a = i / NP, b = (i + 1) / NP;
      R.flat(fin, {pts: [F(a), F(b), Tr(b), Tr(a)], col: mixColor(PTX.mem, PTX.memDark, 0.12 + 0.55 * a), two: true, veins: [[F(a), Tr(a)], [lerp(F(a), F(b), 0.5), lerp(Tr(a), Tr(b), 0.5)]], ink: PTX.memDark});
    }
  }
  // hind legs: thin, trailed back in flight, reaching forward for the grab, straight down when perched; claws on the toes
  const leg = o.leg ?? 0;
  for (const [g, nml] of [[1, 'L'], [-1, 'R']] as const) {
    const hip = onLoft(body, 0.22, g * 0.55, -0.6), tuck = [-0.17, -0.1], reach = [0.2, -0.26], perch = [0.0, -0.3], k = leg <= 1 ? leg : leg - 1;
    const a2 = leg <= 1 ? tuck : reach, b2 = leg <= 1 ? reach : perch, want: L3 = [hip[0] + mixN(a2[0], b2[0], k), hip[1] + mixN(a2[1], b2[1], k), hip[2] + g * 0.03];
    const foot = clampReach(hip, want, 0.14, 0.17), knee = ik2(hip, foot, 0.14, 0.17, [1, 0.25, g * 0.2]);
    limb(R, {id: nml, parent: root, hip, knee, foot, side: g, col: () => PTX.skin, toes: 3, toeCol: PTX.claw, toeLen: 0.09, r: [0.024, 0.017, 0.012, 0.02]});
  }
  B.shadow = {s: 0, l: 0, rs: 0, rl: 0};
  B.anchors = {head: H(0.5), body: [0, 0, 0], top: [0, 0.2, 0], feet: lerp(B.joints['L.ankle'], B.joints['R.ankle'], 0.5), perch: add(lerp(B.joints['L.ankle'], B.joints['R.ankle'], 0.5), [0.05, -0.04, 0]), tipL: B.joints['wing.L.wrist'], tipR: B.joints['wing.R.wrist']};
  B.feet = [];
  // rigid attitude
  const ps = o.pitch ?? 0, bs = o.bank ?? 0;
  if (ps || bs) {
    for (const p of B.parts) p.keys = p.keys.map((q) => ({...q, p: ROT(q.p, ps, bs)}) as Key);
    for (const q of B.flats) { q.pts = q.pts.map((p) => ROT(p, ps, bs)); if (q.veins) q.veins = q.veins.map((v) => v.map((p) => ROT(p, ps, bs))); }
    for (const k of Object.keys(B.joints)) B.joints[k] = ROT(B.joints[k], ps, bs);
    for (const k of Object.keys(B.anchors)) B.anchors[k] = ROT(B.anchors[k], ps, bs);
  }
  return B;
};

/** Perched pose parameters (wings folded back, feet straight down, neck up). */
const PERCH: PteroKitPose = {fold: 0.92, leg: 2, na: 1.0, bow: 0.05, pitch: 0.3, lift: 0.2, amp: 0, hp: -0.15};
export const PTERO_POSES = {
  stand: (): PteroKitPose => ({...PERCH}),
  /** Cruise: wings beating at full stroke, legs trailed. */
  flap: (t: number): PteroKitPose => ({flap: t, amp: 0.8, lift: 0.15, na: 0.45, hp: -0.1, leg: 0, pitch: 0.06 * Math.cos(t * TWO_PI)}),
  /** High circle (N16-07 R2): a banked soar, wings nearly flat, a slow tip flex, the head turned down to the water. */
  circle: (t: number): PteroKitPose => ({flap: t, amp: 0.14, lift: 0.1, na: 0.35, ny: 0.0, hy: 0.0, hp: -0.4, leg: 0, bank: 0.5 + 0.08 * Math.sin(t * TWO_PI), pitch: -0.04}),
  /** Dive: wings fold in, the neck stretches ahead, nose down 1.1 rad, feet begin to drop, a short pull-out at the end. */
  dive: (t: number): PteroKitPose => ({flap: 0, amp: 0.1, lift: 0.08, fold: 0.1 + 0.65 * sm(0, 0.55, t), na: 0.5 - 0.45 * sm(0, 0.5, t), hp: -0.1 - 0.2 * sm(0.3, 0.7, t), leg: 0.5 * sm(0.55, 1, t), pitch: -0.15 - 0.95 * sm(0, 0.5, t) + 0.6 * sm(0.85, 1, t), bank: 0.25 * (1 - sm(0, 0.5, t))}),
  /** Grab: pulling out of the dive, wings flare open to brake, the feet reach down to the fish and close, the head looks at it. */
  grab: (t: number): PteroKitPose => ({flap: 0.25 * sm(0.3, 1, t), amp: 0.5 * sm(0.2, 0.9, t), lift: 0.1 + 0.25 * sm(0, 0.7, t), fold: 0.7 * (1 - sm(0, 0.6, t)), na: 0.35, hp: -0.55, leg: 0.5 + 0.5 * sm(0, 0.6, t), pitch: -0.55 + 0.7 * sm(0, 0.8, t), bank: 0.15 * (1 - t)}),
  /** Climb past the lens with the fish held (feet half-reached, closed on it): two strong beats, nose up. */
  climb: (t: number): PteroKitPose => ({flap: 2 * t, amp: 0.95, lift: 0.28, na: 0.55, hp: -0.1, leg: 0.8, pitch: 0.38 + 0.06 * Math.sin(t * TWO_PI * 2)}),
  /** Land on a snag: wings fold 0 -> 0.85 while flaring at the stall, feet swing forward and down to the perch, the body rocks up to the perched attitude. */
  land: (t: number): PteroKitPose => ({flap: 0.5 * sm(0.2, 0.7, t), amp: 0.5 * Math.sin(Math.PI * sm(0.1, 0.75, t)), lift: 0.15 + 0.35 * Math.sin(Math.PI * sm(0, 0.7, t)), fold: 0.85 * sm(0.4, 1, t), na: mixN(0.5, 1.0, sm(0.5, 1, t)), hp: -0.2, leg: mixN(0.4, 2, sm(0.1, 0.8, t)), pitch: mixN(0.3, 0.3, t) + 0.5 * Math.sin(Math.PI * sm(0, 0.7, t)), bank: 0}),
  /** Gulp: head thrown back, the beak opens wide on the toss and snaps shut, the neck sinks and rises for the swallow. */
  gulp: (t: number): PteroKitPose => ({...PERCH, na: 1.0 + 0.35 * Math.sin(Math.PI * sm(0, 0.35, t)) - 0.25 * sm(0.55, 0.8, t) * (1 - sm(0.8, 1, t)), hp: -0.15 + 0.85 * Math.sin(Math.PI * sm(0, 0.5, t)) - 0.3 * sm(0.6, 0.85, t) * (1 - sm(0.85, 1, t)), jaw: Math.sin(Math.PI * sm(0.1, 0.5, t)), bow: 0.05 + 0.04 * Math.sin(Math.PI * sm(0.55, 0.95, t))}),
  /** Preen: perched, the neck curls back over the shoulder to the folded wing, the beak nibbles twice, the head comes back. */
  preen: (t: number): PteroKitPose => { const k = sm(0, 0.25, t) * (1 - sm(0.8, 1, t)); return {...PERCH, na: mixN(1.0, 0.25, k), ny: -2.2 * k, hy: -0.25 * k, hp: mixN(-0.15, -0.65, k), bow: 0.05 + 0.07 * k, jaw: 0.35 * k * Math.max(0, Math.sin(t * TWO_PI * 3)), fold: 0.92 - 0.05 * k}; },
};

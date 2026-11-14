import {add, band, ballKeys, bez3, clampReach, gaitFoot, ik2, keyAt, limb, lerp, mul, newRig, nrm, onLoft, sub, spline, cross, uOfS, type Build, type Key, type L3} from './beast';

// EDU-EP16 N16-06 R2 long-neck kit creature (Boss, 14 Nov 2026), brachiosaur-like, 22 m, shoulder 6.5 m, head 1 m: replaces the flat AS-LONGNECK card (Film's `buildLongNeck` prototype is
// the starting material). Proportions from the user's references (store `projects/edu/EDU/references/user/2026-11-14_longneck-brachiosaur-ref.jpg` + `..._longneck-herd-forest-ref.jpg`, UT10):
// blue-grey wrinkled skin, shoulders the highest point of the trunk, back sloping to short hips, long column front legs, neck rising from the withers in a gentle S to a small blunt head, long tapering tail.
// Skeleton (every part hangs on a named joint of its parent, positions computed from the parent's loft in the pose):
//   body (root) -> neck [joint neck.base on the withers loft] -> skull [skull.joint = neck tip] -> jaw [jaw.hinge in the skull], eye.L/R [eye.L/R.pivot], nostril.L/R
//   body -> tail [tail.base on the rump loft]; body -> legs FL FR HL HR: thigh [hip] -> shin [knee] -> foot [ankle]
//   The neck is a loft that starts INSIDE the withers and ends INSIDE the skull (the skull loft opens 0.1 m behind its joint), so the head can never float free of the body.

export const LN2 = {skin: '#7d8a90', back: '#56636a', belly: '#bab8a8', fold: '#2e363a', eye: '#14120e', mouth: '#3a2e28', claw: '#4a4e4c'} as const;
export type LongNeckPose = {
  /** Snout tip target in local metres (s forward, y up, l left); the neck reach is clamped to 10 m from the withers. */
  head?: L3;
  /** Walk phase (cycles) and stride (m); stride 0 = standing. */
  walk?: number; stride?: number;
  /** Jaw open 0..1. */
  jaw?: number;
  /** Tail tip sway in metres toward the left flank. */
  tail?: number;
};
export const NECK_REACH = 10.5;
const HEAD_SCALE = 1.12, L_FRONT = 3.15, L_HIND = 2.9;   // half-leg lengths: hip heights are 6.1 m (front) and 5.4 m (hind), so legs stand nearly straight

export const buildLongNeck = (o: LongNeckPose = {}): Build => {
  const R = newRig(), B = R.B;
  const skin = band(LN2.skin, LN2.back, LN2.belly);
  const ph = o.walk ?? 0, S = o.stride ?? 0, bob = S ? -0.08 * Math.cos(ph * 4 * Math.PI) : 0, sway = S ? 0.25 * Math.sin(ph * 2 * Math.PI) : 0;
  const root = R.bone('body', null);
  const body = spline([
    {p: [-5.4, 4.7 + bob, 0], a: 0.95, b: 1.05}, {p: [-5.0, 5.2 + bob, 0], a: 1.2, b: 1.35}, {p: [-2.8, 6.0 + bob, 0], a: 1.6, b: 1.75}, {p: [-0.5, 6.5 + bob, 0], a: 1.95, b: 2.15},
    {p: [1.8, 7.1 + bob, 0], a: 1.9, b: 2.2}, {p: [3.6, 7.8 + bob, 0], a: 1.4, b: 1.6}, {p: [4.6, 8.5 + bob, 0], a: 1.1, b: 1.2},
  ], 4);
  R.loft(root, {m: 18, col: skin, fold: 4, cap: true, keys: body});
  // tail (fix 14 Nov 2026, user: "the tail comes away from the body in some frames"): the root sits INSIDE the rump loft (u 0.14, ~0.7 m in from the rump end), its first radius is 0.92 x the body's there so no
  // step shows where it leaves the body, the next stations follow the body's own taper, and the sway is zero at the root (it grows with distance squared), so the root never leaves the hip.
  const tb = onLoft(body, 0.14, 0, 0), tail0 = R.bone('tail', root, 'tail.base', tb);
  const tz = (s: number) => (o.tail ?? sway) * ((tb[0] - s) / 9.5) ** 2;
  const k0 = keyAt(body, 0.14), tl = (d: number, drop: number, a: number, b: number): Key => ({p: [tb[0] - d, tb[1] - drop, tz(tb[0] - d)], a, b});
  R.loft(tail0, {m: 12, col: skin, keys: ballKeys(tb, Math.min(k0.a, k0.b) * 0.96, [-1, -0.3, 0])});   // ball at the hip joint: closes the wedge where the tail's rings (tilted down) meet the body's (tilted up)
  R.loft(tail0, {m: 12, col: skin, fold: 4, keys: spline([
    {p: tb, a: k0.a * 0.92, b: k0.b * 0.92}, tl(1.4, 0.35, k0.a * 0.9, k0.b * 0.88), tl(3.2, 0.85, 0.8, 0.85), tl(5.4, 1.4, 0.46, 0.5), tl(7.6, 2.0, 0.24, 0.27), tl(10.2, 2.9, 0.03, 0.03),
  ], 4)});
  // neck: cubic from the withers (inside the body loft) to the back of the skull; the head target is clamped to the neck reach
  const nb = onLoft(body, 0.93), nk = keyAt(body, 0.93), neck0 = R.bone('neck', root, 'neck.base', nb);
  let H: L3 = o.head ?? [7.6, 14.0, 0];
  const dv = sub(H, nb), dl = Math.hypot(...dv); if (dl > NECK_REACH) H = add(nb, mul(dv, NECK_REACH / dl));
  const dx = H[0] - nb[0], dy = H[1] - nb[1], dz = H[2] - nb[2];
  const c1: L3 = [nb[0] + 0.25 * Math.max(0, dx) + 0.6, nb[1] + 0.55 * dy + (dy < 0 ? 0 : 0.8), nb[2] + 0.3 * dz];
  const c2: L3 = [H[0] - (0.15 * Math.max(0, dx) + 0.9) * (dy > 0 ? 1 : 0.2), H[1] - 0.35 * dy - (dy < 0 ? 0 : 0.5), H[2] - 0.3 * dz];
  const tan0 = nrm(sub(H, c2)), fwd: L3 = nrm([Math.max(0.35, Math.hypot(tan0[0], tan0[2])), 0, tan0[2] * 0.3]);
  const hd = nrm(add(mul(fwd, 0.7), [0, dy > 0 ? -0.35 : -0.42, 0]));
  const skull: L3 = sub(H, mul(hd, 0.95 * HEAD_SCALE));
  const curve = (t: number): L3 => { const m = 1 - t; return add(add(mul(nb, m * m * m), mul(c1, 3 * m * m * t)), add(mul(c2, 3 * m * t * t), mul(skull, t * t * t))); };
  const N = 14, ra = 0.33, rb = 0.35;
  R.loft(neck0, {m: 12, col: skin, fold: 1, keys: Array.from({length: N + 1}, (_, i) => { const t = i / N, w = (1 - t) ** 1.5; return {p: curve(t), a: ra + (nk.a - ra) * w, b: rb + (nk.b - rb) * w} as Key; })});
  // head frame and skull
  const side = nrm(cross(hd, [0, 1, 0])), hup = nrm(cross(side, hd)), hs = HEAD_SCALE;
  const at = (u: number, up: number): L3 => add(add(skull, mul(hd, u)), mul(hup, up));
  const skullB = R.bone('skull', neck0, 'skull.joint', skull);
  R.loft(skullB, {m: 10, col: () => LN2.skin, keys: ballKeys(skull, 0.37, hd)});   // occiput ball: closes the wedge where the neck bends into the skull
  R.loft(skullB, {m: 14, col: (u, sd) => (sd > 0.55 ? LN2.back : sd < -0.4 ? LN2.belly : LN2.skin), cap: true, keys: spline([
    {p: at(-0.1 * hs, 0.0), a: 0.31 * hs, b: 0.34 * hs}, {p: at(0.12 * hs, 0.1 * hs), a: 0.32 * hs, b: 0.4 * hs}, {p: at(0.34 * hs, 0.15 * hs), a: 0.27 * hs, b: 0.38 * hs},
    {p: at(0.58 * hs, 0.02 * hs), a: 0.21 * hs, b: 0.25 * hs}, {p: at(0.82 * hs, -0.04 * hs), a: 0.18 * hs, b: 0.19 * hs}, {p: at(0.98 * hs, -0.06 * hs), a: 0.14 * hs, b: 0.14 * hs}], 3)});
  // lower jaw: a wedge on a hinge inside the skull, dropped by `jaw`
  const jw = o.jaw ?? 0, hinge = at(0.1 * hs, -0.12 * hs), jawB = R.bone('jaw', skullB, 'jaw.hinge', hinge);
  R.loft(jawB, {m: 10, col: () => LN2.belly, keys: spline([{p: hinge, a: 0.22 * hs, b: 0.1}, {p: at(0.3 * hs, -0.2 * hs - 0.1 * jw), a: 0.22 * hs, b: 0.08}, {p: at(0.6 * hs, -0.17 * hs - 0.16 * jw), a: 0.17 * hs, b: 0.06}, {p: at(0.94 * hs, -0.13 * hs - 0.2 * jw), a: 0.11 * hs, b: 0.04}], 2)});
  // eyes and nostrils: each a small loft rooted on a pivot inside the skull
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const e = add(at(0.3 * hs, 0.12 * hs), mul(side, g * 0.27 * hs)), eb = R.bone(`eye.${nm}`, skullB, `eye.${nm}.pivot`, e);
    R.loft(eb, {m: 8, col: () => LN2.eye, keys: [{p: add(e, mul(side, -g * 0.06)), a: 0.06, b: 0.05}, {p: add(e, mul(side, g * 0.03)), a: 0.065, b: 0.055}, {p: add(e, mul(side, g * 0.055)), a: 0.02, b: 0.02}]});
    R.loft(eb, {m: 6, col: () => '#e8e4d0', keys: [{p: add(add(e, mul(side, g * 0.055)), mul(hup, 0.02)), a: 0.018, b: 0.016}, {p: add(add(e, mul(side, g * 0.065)), mul(hup, 0.02)), a: 0.008, b: 0.008}]});
    const n0 = add(at(0.36 * hs, 0.3 * hs), mul(side, g * 0.12)), nb2 = R.bone(`nostril.${nm}`, skullB, `nostril.${nm}.pivot`, n0);
    R.loft(nb2, {m: 6, col: () => '#2a2e30', keys: [{p: sub(n0, mul(hd, 0.04)), a: 0.05, b: 0.03}, {p: add(n0, mul(hd, 0.08)), a: 0.03, b: 0.02}]});
  }
  // legs: hips on the body loft (front at the shoulder s 2.2, hind at the rump s -2.7), feet from the gait, knees from two-bone IK so segment lengths never change
  const legSpec: {id: string; s: number; side: 1 | -1; front: boolean; q: number}[] = [
    {id: 'FL', s: 2.2, side: 1, front: true, q: 0.25}, {id: 'FR', s: 2.2, side: -1, front: true, q: 0.75}, {id: 'HL', s: -2.7, side: 1, front: false, q: 0}, {id: 'HR', s: -2.7, side: -1, front: false, q: 0.5},
  ];
  for (const sp of legSpec) {
    const hip = onLoft(body, uOfS(body, sp.s), sp.side * 0.6, -0.25), [ds, lift] = S ? gaitFoot(ph + sp.q, S, 0.72, 0.5) : [0, 0];
    const want: L3 = [hip[0] + (sp.front ? 0.3 : 0.1) + ds, lift, hip[2] * 1.08];
    const L = sp.front ? L_FRONT : L_HIND, foot = clampReach(hip, want, L, L), knee = ik2(hip, foot, L, L, [1, 0, 0.1 * sp.side]);
    limb(R, {id: sp.id, parent: root, hip, knee, foot, side: sp.side, col: skin, toes: 3, toeCol: LN2.claw, toeLen: 0.5, r: sp.front ? [1.2, 0.95, 0.85, 0.92] : [1.5, 1.05, 0.9, 0.98]});
  }
  B.shadow = {s: -1.5, l: 0, rs: 9, rl: 2.6};
  B.anchors = {snout: H, eye: at(0.28, 0.2), mouth: at(0.85, -0.18), skull, top: [0, 14.5, 0], chest: [2.5, 6.3, 0], neckBase: nb};
  return B;
};

// ------------------------------------------------------------------ named poses (N16-06 R2): `t` 0..1 within the animation's cycle
export const LONGNECK_POSES = {
  /** Standing, neck in a relaxed S, head at 12.6 m. */
  stand: (): LongNeckPose => ({head: [8.8, 12.6, 0.2]}),
  /** Walk: one cycle, 2.2 m stride, head swaying low-high. */
  walk: (t: number): LongNeckPose => ({walk: t, stride: 2.2, head: [9.4, 10.6 + 0.4 * Math.sin(t * 4 * Math.PI), 0.5 * Math.sin(t * 2 * Math.PI)]}),
  /** High browse: neck stretched up to a treetop (head 15 m), jaw working slowly. */
  browseHigh: (t: number): LongNeckPose => ({head: [7.4, 16.0, 0.1], jaw: 0.25 + 0.2 * Math.sin(t * 2 * Math.PI)}),
  /** Chew and lift: head comes down to a mouthful, then rises while chewing (three chews). */
  chewLift: (t: number): LongNeckPose => ({head: [9.6, 4.6 + 9.4 * t * t * (3 - 2 * t), 0.2], jaw: 0.5 + 0.5 * Math.sin(t * 6 * Math.PI)}),
  /** Step out at a forest edge: slow walk, head carried forward at mid height, turning from left to right. */
  forestEdge: (t: number): LongNeckPose => ({walk: t, stride: 1.8, head: [10.2, 9.4, 1.6 * Math.cos(t * 2 * Math.PI)]}),
};
export type LongNeckPoseId = keyof typeof LONGNECK_POSES;

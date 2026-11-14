import {add, band, ballKeys, clampReach, gaitFoot, ik2, keyAt, limb, mul, newRig, nrm, onLoft, spline, sub, uOfS, type Build, type Key, type L3} from './beast';

// EDU-EP16 N16-15 R2 ankylosaur kit creature (Boss, 14 Nov 2026): 6.5 m, hip 1.3 m, from Film's `buildAnkylosaur` prototype and the user's reference (store
// `projects/edu/EDU/references/user/2026-11-14_ankylosaurus-ref.jpg`, UT10): olive, low wide barrel body, small wide triangular head with knobby rear horns, rows of dark oval plates over the
// back, pale cone spikes along each flank, short pillar legs, a long tapering tail ending in a round club. Poses: stand, walk, wade (walk with the waterline clipping the legs below the knee), head shake, tail club.
// Skeleton: body (root) -> head [head.joint on the front of the loft] -> eye.L/R; body -> tail [tail.base on the rump] -> club [club.joint at the tail tip], tail spikes; body -> plates.k (one bone per back station,
// rooted on the back surface) with its flank spikes; body -> legs FL FR HL HR: thigh [hip] -> shin [knee] -> foot [ankle]. Tail = constant-length arc, so a sway or whip bends it without stretching it.

export const ANK = {skin: '#7c8a40', back: '#8e9a4a', belly: '#bab27a', plate: '#4e5a2a', spike: '#d4c99c', club: '#5a6430', ink: '#14120c'} as const;
export type AnkPose = {
  walk?: number; stride?: number;
  /** Head pitch down (rad) and head yaw to the left (rad) about the head joint (head shake sweeps the yaw). */
  headDown?: number; headYaw?: number;
  /** Tail bend: total yaw of the tail tip about its base (rad, + toward the left flank) and lift of the club (m). */
  tail?: number; lift?: number;
};
const L_FRONT = 0.6, L_HIND = 0.66, TAIL_LEN = 3.4;

export const buildAnkylosaur = (o: AnkPose = {}): Build => {
  const R = newRig(), B = R.B, ph = o.walk ?? 0, S = o.stride ?? 0, bob = S ? -0.03 * Math.cos(ph * 4 * Math.PI) : 0;
  const skin = band(ANK.skin, ANK.back, ANK.belly, 0.4);
  const root = R.bone('body', null);
  const body = spline([
    {p: [-2.0, 1.27 + bob, 0], a: 0.4, b: 0.32}, {p: [-1.0, 1.55 + bob, 0], a: 0.95, b: 0.62}, {p: [0.3, 1.62 + bob, 0], a: 1.15, b: 0.68}, {p: [1.4, 1.45 + bob, 0], a: 0.95, b: 0.58}, {p: [2.1, 1.15 + bob, 0], a: 0.5, b: 0.4},
  ], 4);
  R.loft(root, {m: 16, col: skin, cap: true, keys: body});
  // tail: a constant-length arc whose heading turns by `o.tail` over its length; thick at the rump, whip-thin before the club
  const tb = onLoft(body, 0), tk = keyAt(body, 0), tail = R.bone('tail', root, 'tail.base', tb), tpts: L3[] = [tb];
  const NT = 8, ds = TAIL_LEN / NT, bend = o.tail ?? 0, lift = o.lift ?? 0;
  let phi = 0, x = tb[0], z = tb[2];
  for (let i = 1; i <= NT; i++) { phi += (bend * (2 * i - 1)) / (NT * NT) ; x -= Math.cos(phi) * ds; z += Math.sin(phi) * ds; tpts.push([x, tb[1] - 0.62 * (i / NT) + lift * (i / NT) ** 2, z]); }
  const tr = (i: number) => 0.06 + (Math.max(tk.a, tk.b) - 0.06) * (1 - i / NT) ** 1.6;
  R.loft(tail, {m: 10, col: skin, keys: tpts.map((p, i) => ({p, a: tr(i) * 1.05, b: tr(i) * 0.9}) as Key)});
  const tipDir = nrm(sub(tpts[NT], tpts[NT - 1])), tip = tpts[NT], club = R.bone('club', tail, 'club.joint', tip);
  R.loft(club, {m: 10, col: () => ANK.club, keys: [{p: tip, a: 0.1, b: 0.08}, {p: add(tip, mul(tipDir, 0.18)), a: 0.38, b: 0.2}, {p: add(tip, mul(tipDir, 0.42)), a: 0.34, b: 0.19}, {p: add(tip, mul(tipDir, 0.62)), a: 0.2, b: 0.12}, {p: add(tip, mul(tipDir, 0.7)), a: 0.04, b: 0.04}]});
  const tsp = R.bone('tail.spikes', tail, 'tail.spikes.joint', tpts[2]);
  for (let i = 2; i <= 6; i++) for (const g of [1, -1]) { const k = tr(i), b0: L3 = [tpts[i][0], tpts[i][1], tpts[i][2] + g * k * 0.9], tp = add(b0, [-0.1, 0.03, g * 0.18]); R.loft(tsp, {m: 5, col: () => ANK.spike, keys: [{p: i === 2 && g === 1 ? tpts[2] : b0, a: 0.05, b: 0.05}, {p: tp, a: 0.006, b: 0.006}]}); }
  // head: pivot at the front of the loft; pitch and yaw rotate the head about it. Wide triangular skull, knobby rear horns, small beak
  const hj = onLoft(body, 0.96), head = R.bone('head', root, 'head.joint', hj), cy = Math.cos(o.headYaw ?? 0), sy = Math.sin(o.headYaw ?? 0), cp = Math.cos(-(o.headDown ?? 0)), sp = Math.sin(-(o.headDown ?? 0));
  const H = (q: L3): L3 => { const x1 = q[0] * cp - q[1] * sp, y1 = q[0] * sp + q[1] * cp; return add(hj, [x1 * cy - q[2] * sy, y1, x1 * sy + q[2] * cy]); };
  R.loft(head, {m: 10, col: () => ANK.skin, keys: ballKeys(hj, 0.4, [1, 0, 0])});
  R.loft(head, {m: 10, col: (u) => (u > 0.8 ? ANK.spike : ANK.skin), cap: true, keys: spline([{p: H([0, 0, 0]), a: 0.42, b: 0.34}, {p: H([0.45, -0.1, 0]), a: 0.36, b: 0.27}, {p: H([0.8, -0.2, 0]), a: 0.2, b: 0.17}, {p: H([0.98, -0.26, 0]), a: 0.07, b: 0.07}], 3)});
  for (const g of [1, -1]) {   // rear horns and brow knobs, cones rooted on the skull
    const r0 = H([0.12, 0.2, g * 0.34]);
    R.loft(head, {m: 6, col: () => ANK.plate, keys: [{p: r0, a: 0.09, b: 0.09}, {p: H([-0.02, 0.28, g * 0.55]), a: 0.05, b: 0.05}, {p: H([-0.12, 0.3, g * 0.66]), a: 0.006, b: 0.006}]});
    R.loft(head, {m: 6, col: () => ANK.plate, keys: [{p: H([0.42, 0.14, g * 0.26]), a: 0.07, b: 0.06}, {p: H([0.44, 0.2, g * 0.28]), a: 0.004, b: 0.004}]});
  }
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const e = H([0.4, 0.05, g * 0.27]), eb = R.bone(`eye.${nm}`, head, `eye.${nm}.pivot`, e);
    R.loft(eb, {m: 6, col: () => ANK.ink, keys: [{p: H([0.4, 0.05, g * 0.2]), a: 0.04, b: 0.035}, {p: H([0.4, 0.05, g * 0.3]), a: 0.035, b: 0.03}, {p: H([0.4, 0.05, g * 0.33]), a: 0.012, b: 0.012}]});
  }
  // armour: one bone per back station, rooted on the back surface; four dark plates and a pale flank spike each side
  const rows = [-0.62, -0.22, 0.22, 0.62];
  for (let s = -1.6, n = 0; s <= 1.5; s += 0.42, n++) {
    const u = uOfS(body, s), k = keyAt(body, u), base = (r: number): L3 => { const ang = r * 1.5; return [k.p[0], k.p[1] + k.b * Math.cos(ang) * 0.98, k.p[2] + k.a * Math.sin(ang) * 0.98]; };
    const pb = R.bone(`plates.${n}`, root, `plates.${n}.joint`, base(rows[0]));
    for (const r of rows) { const c0 = base(r); R.loft(pb, {m: 7, col: () => ANK.plate, keys: [{p: c0, a: 0.21, b: 0.08}, {p: add(c0, [0, 0.08, 0]), a: 0.15, b: 0.05}, {p: add(c0, [0, 0.11, 0]), a: 0.02, b: 0.02}]}); }
    for (const g of [1, -1]) { const b0: L3 = [k.p[0], k.p[1] + k.b * 0.25, k.p[2] + g * k.a * 0.97], tp = add(b0, [-0.05, 0.16 + 0.08 * (1 - Math.abs(s) / 1.6), g * 0.34]); R.loft(pb, {m: 6, col: (uu) => (uu > 0.5 ? ANK.spike : ANK.plate), keys: [{p: b0, a: 0.09, b: 0.09}, {p: mul(add(b0, tp), 0.5), a: 0.05, b: 0.05}, {p: tp, a: 0.008, b: 0.008}]}); }
  }
  // legs: stout pillars, hips on the flank of the loft, diagonal-pair walk (a four-beat lateral sequence at duty 0.65)
  const spec: {id: string; s: number; side: 1 | -1; front: boolean; q: number}[] = [
    {id: 'FL', s: 1.2, side: 1, front: true, q: 0.25}, {id: 'FR', s: 1.2, side: -1, front: true, q: 0.75}, {id: 'HL', s: -1.0, side: 1, front: false, q: 0}, {id: 'HR', s: -1.0, side: -1, front: false, q: 0.5},
  ];
  for (const sp of spec) {
    const hip = onLoft(body, uOfS(body, sp.s), sp.side * 0.62, -0.5), [d, l] = S ? gaitFoot(ph + sp.q, S, 0.65, 0.22) : [0, 0], Lh = sp.front ? L_FRONT : L_HIND;
    const want: L3 = [hip[0] + 0.1 + d, l, hip[2] * 1.12], foot = clampReach(hip, want, Lh, Lh), knee = ik2(hip, foot, Lh, Lh, [1, 0, 0.12 * sp.side]);
    limb(R, {id: sp.id, parent: root, hip, knee, foot, side: sp.side, col: skin, toes: 3, toeCol: '#cfc39a', toeLen: 0.28, r: sp.front ? [0.32, 0.23, 0.2, 0.23] : [0.44, 0.29, 0.22, 0.25]});
  }
  B.shadow = {s: -0.3, l: 0, rs: 3.4, rl: 1.4};
  B.anchors = {snout: H([0.98, -0.26, 0]), eye: H([0.4, 0.05, 0.27]), club: tip, top: [0, 2.3, 0], mouth: H([0.9, -0.3, 0]), ...Object.fromEntries(B.feet.map((f, i) => [`foot${i}`, f]))};
  return B;
};

/** Spray of a head shake: droplets thrown off the snout, in creature metres, deterministic. `k` 0..1 strength; paint them in the scene with `paintBeast(...).toWorld`. Effects, not bones. */
export const ankSpray = (head: L3, yaw: number, dyaw: number, k: number, n = 18): {p: L3; r: number}[] =>
  Array.from({length: n}, (_, i) => { const t = i / n, side = Math.sign(dyaw) || 1, d = 0.5 + 1.8 * t * k; return {p: add(head, [0.3 + 0.9 * t * Math.cos(yaw), 0.15 + 0.9 * t * (1 - t) * 2 * k, side * d * (0.55 + 0.45 * Math.sin(i * 7.3))]), r: (0.045 - 0.02 * t) * (0.7 + 0.3 * Math.sin(i * 3.1)) * k + 0.01}; });

export const ANKYLO_POSES = {
  stand: (): AnkPose => ({}),
  walk: (t: number): AnkPose => ({walk: t, stride: 1.0, headDown: 0.15, tail: 0.25 * Math.sin(t * 2 * Math.PI)}),
  /** The same walk, to be placed with the waterline at 0.45 m (just under the knees): `place` in the kit entry. */
  wade: (t: number): AnkPose => ({walk: t, stride: 0.8, headDown: 0.3, tail: 0.3 * Math.sin(t * 2 * Math.PI)}),
  /** Head shake: yaw sweeps +-0.8 rad three times in the cycle with the head dropping, body still. */
  headShake: (t: number): AnkPose => ({headDown: 0.25, headYaw: 0.8 * Math.sin(t * 6 * Math.PI) * (1 - 0.35 * t)}),
  /** Tail club: wind up to the right, whip across to the left and lift, recover. */
  tailClub: (t: number): AnkPose => ({tail: -1.0 * Math.cos(t * 2 * Math.PI) + 0.15, lift: 0.5 * Math.max(0, Math.sin(t * 2 * Math.PI))}),
};
export const ANKYLO_WATERLINE = 0.45;

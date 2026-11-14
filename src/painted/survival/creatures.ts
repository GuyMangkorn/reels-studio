import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {camDepth, camPoint} from '../kit/ycam';
import {bez, cardAt, cell, cp, cps, lit, strip, type Card, type Light, type Painter, type Pt, type V3, type YCam} from './core';

// Creatures of the survival series (brief VD-S04: partial builds, never named, no film likeness). Look stills W3 (Film).
// N16-06 long-neck head/neck (CR-SAUROPOD): small blunt head 0.85 m (card x1.3 in shot 8), neck seen about 7 m, body hidden. Card-local metres, head facing +x.
// Far herd / silhouette layers (EP17 sh17, EP18 sh3/sh5): screen-space silhouettes.
// N17-02 spinosaurus-like predator (user, 14 Nov 2026), firelight only: long low crocodile-like snout with a rosette tip and conical teeth, nostrils set
//   back, small crest before the eye, S-curved neck, tall dorsal sail, robust forelimbs with a big thumb claw, a deep paddle tail; never named on screen.

export const LN = {skin: '#7b8466', dorsal: '#59624c', belly: '#b3b08c', spot: '#4d5641', ink: '#2a2e22'} as const;

/** Long-neck head and neck on a card whose origin is the mouth tip; the neck climbs to `top` (card m) and leaves the frame. `bite` 0..1 closes on a frond. */
export const paintLongNeck = (p: Painter, k: Card, L: Light, o: {top: [number, number]; chew?: number; seed?: number}) => {
  const seed = o.seed ?? 19000, [tx, ty] = o.top;
  // neck: a tapering curve from far above down to the back of the head
  const line = bez(cp(k, tx, ty), cp(k, tx * 0.35, ty * 0.75), cp(k, -0.45, 0.25), 18);
  const w = line.map((_, i) => k.u * (0.85 - 0.5 * (i / (line.length - 1))));
  const neck = strip(line, w);
  hardFill(p, seed, lit(L, LN.skin), neck);
  // darker dorsal half and paler throat
  hardFill(p, seed + 1, lit(L, LN.dorsal), strip(line.map((q, i) => [q[0] + k.s * w[i] * 0.35, q[1] - w[i] * 0.2] as Pt), w.map((x) => x * 0.55)));
  hardFill(p, seed + 2, lit(L, LN.belly), strip(line.map((q, i) => [q[0] - k.s * w[i] * 0.55, q[1] + w[i] * 0.3] as Pt), w.map((x) => x * 0.35)));
  // skin folds across the neck and mottled spots
  for (let i = 3; i < line.length - 1; i += 2) {
    const a = line[i], b = line[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    inkLine(p, seed + 10 + i, [[a[0] + nx * w[i] * 0.9, a[1] + ny * w[i] * 0.9], [a[0] - nx * w[i] * 0.2 + dx * 0.3, a[1] - ny * w[i] * 0.2 + dy * 0.3], [a[0] - nx * w[i] * 0.9, a[1] - ny * w[i] * 0.9]], {closed: false, weight: 0.45, color: lit(L, LN.ink), still: true, curve: 0.5});
    hardFill(p, seed + 40 + i, lit(L, LN.spot), cell({g: [a[0] + nx * w[i] * 0.4 * (hash(i) - 0.3), a[1] + ny * w[i] * 0.4 * (hash(i) - 0.3)], u: k.u, s: 1}, 0, 0, 0.07 + 0.05 * hash(i * 3), 0.05, 8));
  }
  inkLine(p, seed + 5, neck, {weight: 0.6, color: lit(L, LN.ink), still: true});
  // head: a blunt, horse-like box with a raised nasal bump, small eye, a soft mouth line
  const ch = o.chew ?? 0;
  const head: [number, number][] = [[-0.62, 0.22], [-0.5, 0.33], [-0.3, 0.36], [-0.18, 0.42], [-0.06, 0.38], [0.02, 0.24], [0.0, 0.08], [-0.04, -0.02 - 0.03 * ch], [-0.3, -0.06], [-0.55, 0.0], [-0.66, 0.1]];
  hardFill(p, seed + 60, lit(L, LN.skin), cps(k, head));
  hardFill(p, seed + 61, lit(L, LN.dorsal), cps(k, [[-0.62, 0.22], [-0.5, 0.33], [-0.3, 0.36], [-0.18, 0.42], [-0.06, 0.38], [-0.3, 0.27], [-0.55, 0.2]]));
  hardFill(p, seed + 62, lit(L, LN.belly), cps(k, [[-0.04, -0.02 - 0.03 * ch], [-0.3, -0.06], [-0.55, 0.0], [-0.45, 0.04], [-0.1, 0.03]]));
  inkLine(p, seed + 63, cps(k, head), {weight: 0.7, color: lit(L, LN.ink), still: true});
  inkLine(p, seed + 64, cps(k, [[-0.02, 0.06], [-0.25, 0.04 - 0.02 * ch], [-0.42, 0.07]]), {closed: false, weight: 0.6, color: lit(L, LN.ink), still: true, curve: 0.4});
  hardFill(p, seed + 65, '#1a1810', cell(k, -0.4, 0.24, 0.028, 0.024, 10));
  hardFill(p, seed + 66, '#e8e2c8', cell(k, -0.392, 0.248, 0.008, 0.008, 6));
  inkLine(p, seed + 67, cps(k, [[-0.45, 0.28], [-0.4, 0.3], [-0.34, 0.28]]), {closed: false, weight: 0.5, color: lit(L, LN.ink), still: true, curve: 0.5});
  hardFill(p, seed + 68, lit(L, LN.ink, 0.1), cell(k, -0.13, 0.36, 0.025, 0.015, 8));
};

/** Sauropod silhouettes in screen space (far herd or one against the stars): `x` centre, `base` feet y, `h` px to the head, `dir` 1 = facing right. */
export const paintSauropodSilhouette = (p: Painter, x: number, base: number, h: number, color: string, seed: number, dir = 1, neckUp = 1) => {
  const u = h / 9;   // 9 m tall to the head
  const k: Card = {g: [x, base], u, s: dir};
  const body: [number, number][] = [[-4.5, 3.2], [-2.5, 4.6], [0.5, 5.0], [2.6, 4.4], [3.2, 3.2], [2.0, 2.4], [-2.4, 2.4]];
  // legs (four pillars), tail to the back, neck up and forward
  for (const [lx, w] of [[-2.2, 0.55], [-1.2, 0.5], [1.4, 0.55], [2.3, 0.5]] as const) hardFill(p, seed + Math.round(lx * 10 + 30), color, cps(k, [[lx - w, 0], [lx + w, 0], [lx + w * 0.8, 3.0], [lx - w * 0.8, 3.0]]));
  hardFill(p, seed, color, cps(k, body));
  hardFill(p, seed + 1, color, strip(bez(cp(k, -4.0, 3.5), cp(k, -7.0, 3.0), cp(k, -9.0, 1.4), 10), Array.from({length: 11}, (_, i) => u * (0.55 - 0.5 * (i / 10)))));
  const tip: [number, number] = [5.2 - 1.6 * (1 - neckUp), 9.0 * neckUp + 3.6 * (1 - neckUp)];
  hardFill(p, seed + 2, color, strip(bez(cp(k, 2.2, 4.0), cp(k, 4.4, 5.0 + 2 * neckUp), cp(k, tip[0], tip[1]), 12), Array.from({length: 13}, (_, i) => u * (0.7 - 0.45 * (i / 12)))));
  hardFill(p, seed + 3, color, cell(k, tip[0] + 0.35, tip[1] - 0.05, 0.5, 0.3, 10));
};


/**
 * Far herd layer (N18-04 `long-neck herd far`, N17-03 `long-neck far` drinking; sh3 / sh5 / sh17): `n` silhouettes between screen x `x0..x1` on the base line `base`,
 * 0.7-1.15 of `h` px tall, alternating direction; the `drink` share (0..1) have the neck down to the water. Deterministic in `seed`.
 */
export const paintLongNeckHerd = (p: Painter, o: {x0: number; x1: number; base: number; h: number; n: number; color: string; seed: number; drink?: number}) => {
  for (let i = 0; i < o.n; i++) {
    const u = (i + 0.5 * hash(o.seed + i * 3.1)) / o.n, s = 0.7 + 0.45 * hash(o.seed + i * 5.3);
    const drinking = hash(o.seed + i * 7.7) < (o.drink ?? 0);
    paintSauropodSilhouette(p, o.x0 + (o.x1 - o.x0) * u, o.base + 8 * (1 - s) * hash(o.seed + i), o.h * s, o.color, o.seed + 20 * i, i % 2 ? -1 : 1, drinking ? 0.05 : 0.2 + 0.8 * hash(o.seed + i * 9.1));
  }
};


// ------------------------------------------------------------------ N17-02 spinosaurus-like predator: volume build (R1.2, Film, 14 Nov 2026)
// User verdict on R1.1 (14 Nov 2026): "looks like a paper doll: side-on, the legs and arms look tiny, like paper". R1.1 was one side profile laid in a
// vertical world plane (flat value cards, stick legs, a 0.13 m arm, no far limbs, no turn). R1.2 builds the animal as lofted volumes in its own metres and
// projects every face through the yaw camera, so any yaw shows a true front-3/4, side or rear-3/4 view (four views squared to the lens, painted 3D camera):
// barrel body + neck + paddle tail as one loft, a long low head loft with a rosette tip, thick crouched hind legs (thigh mass, knee, shin, tarsus, three
// clawed toes), robust arms with three big hooked claws (thumb claw biggest), far-side limbs one value darker, a translucent ribbed sail on the midline.
// Faces are painted far to near (painter's order) as flat fills in banded values (the flat-fill look, painted-2d skill), with an ink contour on the lower
// silhouette edges and a cool starlight rim on the upper ones. Proportions: the user's reference (store
// `projects/edu/EDU/references/user/2026-11-14_spinosaurus-ref.png`, 300 px, measured at 0.0464 m per px for 13 m): back top 4.4 m, hip 3.3 m, sail top
// ≈ 6.4 m (peak over s 5.3), thigh 1.5-1.6 m deep at the hip, shin 0.55-0.65 m, metatarsus 0.3 m, foot 0.85 m, upper arm 0.5 m thick, hand claws 0.3-0.4 m.
// Painted in the series style, no film design, never named on screen (VD-S04).

/** Night palette: unlit skin back / flank / belly, sail red, firelight, hot core, claw/tooth ivory, starlight rim, ink. */
export const SP = {skin: '#16110e', mid: '#211915', belly: '#3a2c24', red: '#3a1a16', ribs: '#5e3026', lit: '#c07040', hot: '#ffb25a', ivory: '#e8d6ae', sky: '#5a6a9e', rim: '#8a9ad0', eye: '#060504'} as const;

type L3 = [number, number, number];   // creature-local metres: s back from the snout tip (sniff pose), y up from the ground, l toward the left flank
type Key = {p: L3; a: number; b: number};   // a: half-width across (toward l), b: half-depth in the s-y plane
const vadd = (a: L3, b: L3): L3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vsub = (a: L3, b: L3): L3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vmul = (a: L3, k: number): L3 => [a[0] * k, a[1] * k, a[2] * k];
const vdot = (a: L3, b: L3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vcross = (a: L3, b: L3): L3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vnorm = (a: L3): L3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const vlerp = (a: L3, b: L3, u: number): L3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const crs = (a: number, b: number, c: number, d: number, t: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
/** Catmull-Rom through the key stations, `n` steps per span (radii too). */
const spline = (ks: Key[], n: number): Key[] => {
  const out: Key[] = [];
  for (let i = 0; i < ks.length - 1; i++) {
    const k0 = ks[Math.max(0, i - 1)], k1 = ks[i], k2 = ks[i + 1], k3 = ks[Math.min(ks.length - 1, i + 2)];
    for (let j = 0; j < n; j++) {
      const t = j / n;
      out.push({p: [0, 1, 2].map((q) => crs(k0.p[q], k1.p[q], k2.p[q], k3.p[q], t)) as L3, a: Math.max(0.004, crs(k0.a, k1.a, k2.a, k3.a, t)), b: Math.max(0.004, crs(k0.b, k1.b, k2.b, k3.b, t))});
    }
  }
  out.push(ks[ks.length - 1]);
  return out;
};
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mixC = (a: string, b: string, u: number) => mixColor(a, b, clamp(u));

/** Pose of the predator. `head` 0 = lowered to sniff (snout tip 1.0 m up, skull 27 deg down) .. 1 = carried (snout 3.0 m, 8 deg down).
 * `legs` near (the flank facing the lens) / far: [ds, lift] = foot (ball) s offset from the hip (negative = forward) and its lift off the ground (m). `bob` body height offset (m);
 * `tail` sideways sway of the tail tip (m, + toward the left flank). */
export type SpinoPose = {head?: number; legs?: {near: [number, number]; far: [number, number]}; bob?: number; tail?: number};
/** Walk cycle proposal (untested in motion): phase 0..1 of one stride (two steps); stance 60 %, swing 40 % with a 0.6 m lift; stride `S` m per step pair. */
export const spinoStride = (ph: number, S = 2.6): {legs: {near: [number, number]; far: [number, number]}; bob: number; tail: number} => {
  const leg = (q0: number): [number, number] => { const q = ((q0 % 1) + 1) % 1; if (q < 0.6) return [-S / 2 + S * (q / 0.6), 0]; const u = (q - 0.6) / 0.4; return [S / 2 - S * u, 0.6 * Math.sin(Math.PI * u)]; };
  return {legs: {near: leg(ph), far: leg(ph + 0.5)}, bob: -0.08 * Math.cos(4 * Math.PI * ph), tail: 0.35 * Math.sin(2 * Math.PI * ph)};
};

type Part = {id: number; keys: Key[]; m: number; kind: 'skin' | 'claw'; dim: number; cap?: boolean};
const HK = 1.1;   // head scale: 2.15 m skull (reference head ≈ 2.2-2.4 m incl. the jaw angle)
// head stations along the skull axis from the snout tip: [u m, half-width, half-height, offset up]
const HEAD: [number, number, number, number][] = ([[0, 0.06, 0.06, 0], [0.07, 0.105, 0.095, 0.01], [0.2, 0.115, 0.105, 0.012], [0.36, 0.08, 0.08, 0], [0.7, 0.095, 0.1, 0.005], [1.0, 0.13, 0.14, 0.02], [1.25, 0.17, 0.2, 0.05], [1.5, 0.23, 0.26, 0.06], [1.75, 0.28, 0.31, 0.04], [1.95, 0.27, 0.32, 0]] as const).map(([u, a, b, o]) => [u * HK, a * HK, b * HK, o * HK]);
// sail height above the back line by s (m): rounded, peak 2.0 m over s 5.3
const SAIL: [number, number][] = [[3.5, 0], [3.8, 0.9], [4.3, 1.55], [4.8, 1.85], [5.3, 2.0], [5.8, 1.95], [6.3, 1.68], [6.8, 1.22], [7.2, 0.6], [7.45, 0]];
const lerpTab = (tab: [number, number][], s: number) => { for (let j = 1; j < tab.length; j++) if (s <= tab[j][0]) { const [a0, a1] = tab[j - 1], [b0, b1] = tab[j]; return a1 + (b1 - a1) * clamp((s - a0) / (b0 - a0 || 1)); } return tab[tab.length - 1][1]; };

const buildSpino = (o: SpinoPose, ns: 1 | -1) => {
  const h = o.head ?? 0, bob = o.bob ?? 0, tail = o.tail ?? 0;
  const legs = o.legs ?? {near: [-0.65, 0] as [number, number], far: [0.35, 0] as [number, number]};
  const al = ((27 - 19 * h) * Math.PI) / 180, hd: L3 = [Math.cos(al), Math.sin(al), 0], up: L3 = [-Math.sin(al), Math.cos(al), 0];
  const tip: L3 = [-0.35 * h, 1.0 + 2.0 * h + bob, 0];
  const headAt = (u: number) => { let j = 1; while (j < HEAD.length - 1 && HEAD[j][0] < u) j++; const A = HEAD[j - 1], B = HEAD[j], k = clamp((u - A[0]) / (B[0] - A[0])); const a = A[1] + (B[1] - A[1]) * k, b = A[2] + (B[2] - A[2]) * k, off = A[3] + (B[3] - A[3]) * k; return {p: vadd(tip, vadd(vmul(hd, u), vmul(up, off))), a, b}; };
  const headKeys: Key[] = HEAD.map(([u]) => headAt(u));
  const HB = headAt(1.95 * HK).p, y2 = (a: number, b: number): number => a + (b - a) * h;
  const sw = (s: number) => (s > 7.5 ? tail * ((s - 7.5) / 5.5) ** 2 : 0);
  const B = (s: number, y: number, a: number, b: number): Key => ({p: [s, y + bob, sw(s)], a, b});
  const bodyKeys: Key[] = [
    {p: vsub(HB, vmul(hd, 0.2)), a: 0.25, b: 0.29}, {p: vadd(HB, vmul(hd, 0.05)), a: 0.27, b: 0.32},
    B(y2(2.2, 2.0), y2(2.4, 3.65) - bob, 0.34, 0.42), B(2.75, y2(3.15, 3.85), 0.46, 0.56), B(3.35, 3.72, 0.64, 0.78),
    B(4.2, 3.55, 0.78, 0.92), B(5.2, 3.5, 0.8, 0.86), B(6.1, 3.55, 0.74, 0.74), B(6.9, 3.6, 0.66, 0.62), B(7.8, 3.6, 0.5, 0.56),
    B(8.9, 3.45, 0.36, 0.5), B(10.0, 3.2, 0.26, 0.44), B(11.1, 2.95, 0.18, 0.34), B(12.1, 2.75, 0.1, 0.22), B(12.7, 2.65, 0.05, 0.1), B(13.0, 2.6, 0.012, 0.02),
  ];
  const body = spline(bodyKeys, 6);
  const backAt = (s: number) => { let best = body[0]; for (const k of body) if (Math.abs(k.p[0] - s) < Math.abs(best.p[0] - s) && k.p[0] > 3) best = k; return best; };
  const parts: Part[] = [];
  const feet: L3[] = [], claws: L3[] = [];
  // hind legs: IK from the hip to the foot ball (thigh 1.6, shin 1.6, metatarsus 0.85 m), knee forward
  ([['near', ns], ['far', -ns]] as const).forEach(([side, g], si) => {
    const [ds, lift] = legs[side], dim = side === 'near' ? 0 : 0.45;
    const H: L3 = [6.65, 3.45 + bob, 0.58 * g], Bl: L3 = [6.65 + ds, 0.14 + lift, 0.86 * g];
    const ph = ((55 + 35 * clamp(lift / 0.6)) * Math.PI) / 180, A: L3 = [Bl[0] + 0.85 * Math.cos(ph), Bl[1] + 0.85 * Math.sin(ph), 0.82 * g];
    const L1 = 1.6, L2 = 1.6, d = clamp(Math.hypot(A[0] - H[0], A[1] - H[1]), 0.3, L1 + L2 - 0.02), th = Math.atan2(A[1] - H[1], A[0] - H[0]);
    const a1 = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const kA: L3 = [H[0] + L1 * Math.cos(th + a1), H[1] + L1 * Math.sin(th + a1), 0.8 * g], kB: L3 = [H[0] + L1 * Math.cos(th - a1), H[1] + L1 * Math.sin(th - a1), 0.8 * g];
    const K = kA[0] < kB[0] ? kA : kB;
    parts.push({id: 40 + si, dim, kind: 'skin', keys: spline([
      {p: vadd(H, [0.05, 0.42, -0.2 * g]), a: 0.3, b: 0.62}, {p: H, a: 0.56, b: 0.95}, {p: vlerp(H, K, 0.55), a: 0.46, b: 0.66}, {p: K, a: 0.33, b: 0.4},
      {p: vlerp(K, A, 0.35), a: 0.3, b: 0.38}, {p: vlerp(K, A, 0.75), a: 0.22, b: 0.24}, {p: A, a: 0.19, b: 0.2}, {p: vlerp(A, Bl, 0.5), a: 0.17, b: 0.17}, {p: Bl, a: 0.18, b: 0.15},
    ], 3), m: 12});
    feet.push(Bl);
    const droop = 0.35 * clamp(lift / 0.4);
    [[-24, 0.66], [0, 0.85], [24, 0.64]].forEach(([deg, len], ti) => {
      const r = (deg * Math.PI) / 180, dir: L3 = vnorm([-Math.cos(r), -0.1 - droop, Math.sin(r) * g]);
      const t0 = vadd(Bl, vmul(dir, 0.04)), t2 = vadd(vadd(Bl, vmul(dir, len)), [0, -0.06, 0]);
      parts.push({id: 50 + si * 10 + ti, dim, kind: 'skin', m: 8, keys: spline([{p: t0, a: 0.13, b: 0.12}, {p: vadd(vlerp(t0, t2, 0.5), [0, -0.02, 0]), a: 0.105, b: 0.095}, {p: t2, a: 0.085, b: 0.08}], 3)});
      const c1 = vadd(vadd(t2, vmul(dir, 0.12)), [0, -0.03, 0]), c2 = vadd(vadd(t2, vmul(dir, 0.21)), [0, -0.09, 0]);
      parts.push({id: 70 + si * 10 + ti, dim, kind: 'claw', m: 6, keys: spline([{p: t2, a: 0.07, b: 0.075}, {p: c1, a: 0.042, b: 0.046}, {p: c2, a: 0.006, b: 0.006}], 3)});
    });
  });
  // forelimbs: robust arm held under the chest, wrist forward, a big three-clawed hand (thumb claw biggest)
  ([ns, -ns] as const).forEach((g, si) => {
    const dim = g === ns ? 0 : 0.45;
    const S: L3 = [3.75, 3.1 + bob, 0.52 * g], E: L3 = [4.0, 2.4 + bob, 0.86 * g], Wr: L3 = [y2(3.35, 3.2), y2(1.95, 2.45) + bob, 0.68 * g];
    const P: L3 = vadd(Wr, [-0.2, -0.12, 0]);
    parts.push({id: 90 + si, dim, kind: 'skin', m: 10, keys: spline([{p: S, a: 0.32, b: 0.36}, {p: vlerp(S, E, 0.5), a: 0.29, b: 0.31}, {p: E, a: 0.22, b: 0.23}, {p: vlerp(E, Wr, 0.5), a: 0.21, b: 0.2}, {p: Wr, a: 0.16, b: 0.16}, {p: P, a: 0.16, b: 0.12}], 3)});
    const dn: L3 = vnorm([-0.55, -0.83, 0]);
    [[-0.11, 0.22, 0.42, 0.075], [0, 0.26, 0.34, 0.065], [0.11, 0.22, 0.3, 0.06]].forEach(([dl, fl, cl, cw], fi) => {
      const f0: L3 = vadd(P, [0, 0, dl * g]), f1 = vadd(vadd(f0, vmul(dn, fl)), [0, 0, dl * 0.4 * g]);
      parts.push({id: 100 + si * 10 + fi, dim, kind: 'skin', m: 8, keys: spline([{p: f0, a: 0.085, b: 0.08}, {p: f1, a: 0.07, b: 0.07}], 2)});
      const c1 = vadd(f1, vmul(dn, cl * 0.55)), c2 = vadd(vadd(f1, vmul(dn, cl * 0.85)), [cl * 0.45, 0, 0]);
      parts.push({id: 120 + si * 10 + fi, dim, kind: 'claw', m: 6, keys: spline([{p: f1, a: cw, b: cw * 1.1}, {p: c1, a: cw * 0.6, b: cw * 0.65}, {p: c2, a: 0.005, b: 0.005}], 3)});
      if (g === ns) claws.push(c2);
    });
  });
  parts.push({id: 1, dim: 0, kind: 'skin', m: 22, keys: body});
  parts.push({id: 2, dim: 0, kind: 'skin', m: 16, keys: spline(headKeys, 4), cap: true});
  // sail: stations along the back, base 0.15 m under the back line, scalloped top between the spines
  const sail = Array.from({length: 33}, (_, k) => { const s = 3.5 + (3.95 * k) / 32, bk = backAt(s), base: L3 = [s, bk.p[1] + bk.b - 0.15, 0]; const sc = 0.07 * Math.abs(Math.sin((Math.PI * (s - 3.6)) / 0.26)); return {base, top: [s, bk.p[1] + bk.b + Math.max(0, lerpTab(SAIL, s) - sc), 0] as L3}; });
  return {parts, sail, headAt, hd, up, tip, feet, claws};
};

export type SpinoAnchors = {snout: Pt; eye: Pt; sailPeak: Pt; claw: Pt; feet: (Pt | null)[]; top: number; bottom: number; left: number; right: number};
/** Paint the predator (`p` null = probe only: returns the picture anchors without drawing). `O` the snout-tip ground point of the sniff pose (x, z),
 * `b` the unit body axis toward the tail (x, z); `fire` the one light; `reach` its fall-off (m, default 6.5); `low` 0..1 darkens everything below 1.3 m
 * (the dark lower frame, default 0.6); `amb` the cool starlight fill and rim (default 1). Returns the anchors in picture px. */
export const paintSpino = (p: Painter | null, c: YCam, o: {O: [number, number]; b: [number, number]; fire: V3; t: number; pose?: SpinoPose; reach?: number; low?: number; amb?: number; seed?: number}): SpinoAnchors | null => {
  const seed = o.seed ?? 19500, [bx, bz] = o.b, F = o.fire, reach = o.reach ?? 6.5, low = o.low ?? 0.6, amb = o.amb ?? 1;
  const W = ([s, y, l]: L3): V3 => [o.O[0] + s * bx - l * bz, y, o.O[1] + s * bz + l * bx];
  const WN = ([s, y, l]: L3): L3 => [s * bx - l * bz, y, s * bz + l * bx];
  const cam: L3 = [c.x, c.y, c.z];
  const fk = 0.84 + 0.28 * hash(seed + Math.floor(o.t * 15) * 7);
  const ns: 1 | -1 = vdot(WN([0, 0, 1]), vsub(cam, W([6, 3, 0]) as L3)) >= 0 ? 1 : -1;   // the flank that faces the lens: its limbs are the near ones
  const S = buildSpino(o.pose ?? {}, ns);
  const items: {d: number; f: () => void}[] = [];
  const all: Pt[] = [];
  const toward = (l: L3, n: L3) => vdot(WN(n), vsub(cam, W(l) as L3)) > 0;
  // value of a surface point under the fire, the starlight and the dark ground (banded: flat fills, one cel step at a time)
  const shade = (pl: L3, nl: L3, kind: 'skin' | 'claw' | 'sail', dim: number) => {
    const P = W(pl) as L3, N = WN(nl), up = nl[1];
    let col = kind === 'claw' ? '#2e2820' : kind === 'sail' ? mixC('#2a1512', SP.red, clamp((pl[1] - 4.2) / 1.4)) : up > 0 ? mixC(SP.mid, SP.skin, up) : mixC(SP.mid, SP.belly, -up * 0.9);
    if (kind === 'skin' && pl[0] > 8.4) col = mixC(col, SP.red, Math.min(1, (pl[0] - 8.4) / 3) * 0.55 * clamp(up + 0.4));
    const Lv = vsub([F[0], F[1] + 0.5, F[2]], P), d = Math.hypot(...Lv), V = vnorm(vsub(cam, P));
    const lam = kind === 'sail' ? Math.abs(vdot(N, Lv)) / d : clamp((vdot(N, Lv) / d + 0.2) / 1.2);
    const w = lam * clamp(1 - d / reach) ** 1.5 * fk * (1 - dim * 0.7);
    const wq = w < 0.05 ? 0 : w < 0.18 ? 0.2 : w < 0.36 ? 0.4 : w < 0.56 ? 0.6 : 0.8;
    col = mixC(col, kind === 'claw' ? SP.ivory : SP.lit, wq);
    if (wq >= 0.6) col = mixC(col, SP.hot, (wq - 0.5) * 0.7);
    const g = 1 - Math.abs(vdot(N, V)), sky = Math.max(0, N[1]);
    col = mixC(col, SP.sky, amb * (sky > 0.55 ? 0.16 : sky > 0.15 ? 0.09 : 0.03) * (1 - wq));
    if (g > 0.72 && N[1] > 0.12) col = mixC(col, SP.rim, amb * 0.42 * (1 - wq));
    if (pl[1] < 1.3) col = mixC(col, '#050403', Math.round(low * (1 - pl[1] / 1.3) * 3) / 3 * (1 - wq * 0.7));
    return mixC(col, '#040303', dim);
  };
  const grow = (q: Pt[], k = 0.6): Pt[] => { const mx = q.reduce((a, v) => a + v[0], 0) / q.length, my = q.reduce((a, v) => a + v[1], 0) / q.length; return q.map(([x, y]) => { const dx = x - mx, dy = y - my, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * k, y + (dy / l) * k]; }); };
  const stroke = (id: number, a: Pt, b2: Pt, col: string, w: number) => { if (p) hardFill(p, id, col, strip([a, b2], [w, w])); };
  // one face: where its corners fall in different value bands it splits (up to 2 levels), so band edges follow the form instead of the face grid
  const quad = (q0: Painter, id: number, v: L3[], n: L3[], kind: 'skin' | 'claw', dim: number, lv: number, scr0?: Pt[]) => {
    const ctr = vmul(vadd(vadd(v[0], v[1]), vadd(v[2], v[3])), 0.25), nc = vnorm(vadd(vadd(n[0], n[1]), vadd(n[2], n[3]))), cc = shade(ctr, nc, kind, dim);
    if (lv < 3 && v.some((x, k) => shade(x, n[k], kind, dim) !== cc)) {
      const mid = (a: number, b2: number) => ({v: vlerp(v[a], v[b2], 0.5), n: vnorm(vadd(n[a], n[b2]))});
      const e01 = mid(0, 1), e12 = mid(1, 2), e23 = mid(2, 3), e30 = mid(3, 0), C = {v: ctr, n: nc};
      ([[0, e01, C, e30], [e01, 1, e12, C], [C, e12, 2, e23], [e30, C, e23, 3]] as const).forEach((sq, k) => {
        const g = sq.map((x) => (typeof x === 'number' ? {v: v[x], n: n[x]} : x));
        quad(q0, id * 4 + k + 1, g.map((x) => x.v), g.map((x) => x.n), kind, dim, lv + 1);
      });
      return;
    }
    const pts = scr0 ?? v.map((x) => camPoint(c, W(x)));
    if (pts.every(Boolean)) hardFill(q0, id, cc, grow(pts as Pt[], lv ? 0.5 : 0.6));
  };
  // ---- lofted parts: faces culled toward the lens, then sorted far to near with every other item
  for (const part of S.parts) {
    const ks = part.keys, n = ks.length, m = part.m;
    const rv: L3[][] = [], rn: L3[][] = [];
    ks.forEach((k, i) => {
      const T = vnorm(vsub(ks[Math.min(n - 1, i + 1)].p, ks[Math.max(0, i - 1)].p));
      let X = vsub([0, 0, 1], vmul(T, T[2]));
      if (Math.hypot(...X) < 0.05) X = vsub([0, 1, 0], vmul(T, T[1]));
      X = vnorm(X);
      const Y = vcross(X, T);
      rv.push([]); rn.push([]);
      for (let j = 0; j < m; j++) { const th = (j / m) * Math.PI * 2, cs = Math.cos(th), sn2 = Math.sin(th); rv[i].push(vadd(k.p, vadd(vmul(X, k.a * cs), vmul(Y, k.b * sn2)))); rn[i].push(vnorm(vadd(vmul(X, cs / k.a), vmul(Y, sn2 / k.b)))); }
    });
    const scr = rv.map((r) => r.map((v) => camPoint(c, W(v))));
    const face = (i: number, j: number) => { const j2 = (j + 1) % m; return {v: [rv[i][j], rv[i][j2], rv[i + 1][j2], rv[i + 1][j]], n: [rn[i][j], rn[i][j2], rn[i + 1][j2], rn[i + 1][j]], q: [scr[i][j], scr[i][j2], scr[i + 1][j2], scr[i + 1][j]], nl: vnorm(vadd(vadd(rn[i][j], rn[i][j2]), vadd(rn[i + 1][j], rn[i + 1][j2])))}; };
    const front: boolean[][] = [];
    for (let i = 0; i < n - 1; i++) { front.push([]); for (let j = 0; j < m; j++) { const f = face(i, j); front[i].push(toward(vmul(vadd(vadd(f.v[0], f.v[1]), vadd(f.v[2], f.v[3])), 0.25), f.nl)); } }
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < m; j++) {
      if (!front[i][j]) continue;
      const f = face(i, j);
      if (!f.q.every(Boolean)) continue;
      const q = f.q as Pt[], ctr = vmul(vadd(vadd(f.v[0], f.v[1]), vadd(f.v[2], f.v[3])), 0.25);
      all.push(...q);
      const col = shade(ctr, f.nl, part.kind, part.dim), id = seed + 1000 + part.id * 1000 + i * m + j;
      const edges: [Pt, Pt][] = [];
      if (!front[i][(j + m - 1) % m]) edges.push([q[0], q[3]]);
      if (!front[i][(j + 1) % m]) edges.push([q[1], q[2]]);
      const wn = WN(f.nl), ec = wn[1] > 0.45 && ctr[1] > 1.6 ? mixC(col, SP.rim, 0.5 * amb) : '#070605', ew = part.kind === 'claw' ? 0.8 : 1.4;
      items.push({d: camDepth(c, W(ctr)), f: () => { if (!p) return; quad(p, id, f.v, f.n, part.kind, part.dim, 0, q); edges.forEach(([a, b2], e) => stroke(id + 500000 + e, a, b2, ec, ew)); }});
    }
    if (part.cap) {   // rounded snout tip: one cap face over the first ring
      const q = scr[0], nl = vnorm(vsub(ks[0].p, ks[1].p));
      if (q.every(Boolean) && toward(ks[0].p, nl)) items.push({d: camDepth(c, W(ks[0].p)), f: () => { if (p) hardFill(p, seed + 900 + part.id, shade(ks[0].p, nl, 'skin', 0), grow(q as Pt[], 1)); }});
    }
  }
  // ---- sail: translucent red membrane on the midline (both faces seen), banded by height, spines as ribs, a cool rim on the scalloped top
  const sl = S.sail, sideN: L3 = [0, 0, toward(sl[16].base, [0, 0, 1]) ? 1 : -1];
  for (let k = 0; k < sl.length - 1; k++) for (let r = 0; r < 3; r++) {
    const v: L3[] = [vlerp(sl[k].base, sl[k].top, r / 3), vlerp(sl[k + 1].base, sl[k + 1].top, r / 3), vlerp(sl[k + 1].base, sl[k + 1].top, (r + 1) / 3), vlerp(sl[k].base, sl[k].top, (r + 1) / 3)];
    const q = v.map((x) => camPoint(c, W(x)));
    if (!q.every(Boolean)) continue;
    all.push(...(q as Pt[]));
    const ctr = vmul(vadd(vadd(v[0], v[1]), vadd(v[2], v[3])), 0.25), col = shade(ctr, sideN, 'sail', 0);
    items.push({d: camDepth(c, W(ctr)), f: () => { if (p) washAt(p, seed + 300 + k * 3 + r, col, r === 2 ? 215 : 238, grow(q as Pt[]), 0, 0); }});
  }
  for (let i = 0; i < 15; i++) {
    const s = 3.72 + i * 0.26, k = sl.reduce((bi, e, j) => (Math.abs(e.base[0] - s) < Math.abs(sl[bi].base[0] - s) ? j : bi), 0), top = vadd(sl[k].top, [0, 0.05, 0]);
    const a = camPoint(c, W(vadd(sl[k].base, [0, -0.1, 0]))), mid = camPoint(c, W(vlerp(sl[k].base, top, 0.5))), b2 = camPoint(c, W(top));
    if (!a || !mid || !b2) continue;
    const col = mixC(shade(vlerp(sl[k].base, top, 0.3), sideN, 'sail', 0), SP.ribs, 0.55);
    items.push({d: camDepth(c, W(vlerp(sl[k].base, top, 0.5))) - 0.08, f: () => { if (p) hardFill(p, seed + 360 + i, col, strip([a, mid, b2], [1.8, 1.3, 0.7])); }});
  }
  for (let k = 0; k < sl.length - 1; k++) {
    const a = camPoint(c, W(sl[k].top)), b2 = camPoint(c, W(sl[k + 1].top));
    if (a && b2) items.push({d: camDepth(c, W(sl[k].top)) - 0.1, f: () => stroke(seed + 400 + k, a, b2, mixC(SP.sky, SP.rim, 0.4), 1.5 * amb + 0.3)});
  }
  // ---- head details on the sides that face the lens: lip line with conical teeth (closed jaws, crocodile-like), nostril set far back, eye, brow
  const side = (u: number, g: number, upK: number, outK = 0.97): {pl: L3; nl: L3} => { const h = S.headAt(u * HK); return {pl: vadd(h.p, vadd([0, 0, g * h.a * outK], vmul(S.up, h.b * upK))), nl: vnorm(vadd([0, 0, g * 0.9], vmul(S.up, upK)))}; };
  ([1, -1] as const).forEach((g, gi) => {
    if (!toward(side(0.9, g, 0).pl, side(0.9, g, 0).nl)) return;
    const lip = (u: number) => -0.22 + (u > 1.2 ? (u - 1.2) * 0.5 : 0);
    for (let i = 0; i < 16; i++) {
      const u0 = 0.05 + i * 0.1, u1 = u0 + 0.1, A = side(u0, g, lip(u0)), Bq = side(u1, g, lip(u1)), a = camPoint(c, W(A.pl)), b2 = camPoint(c, W(Bq.pl));
      if (a && b2) items.push({d: camDepth(c, W(A.pl)) - 0.12, f: () => stroke(seed + 600 + gi * 40 + i, a, b2, '#070504', 1.3)});
    }
    for (let i = 0; i < 12; i++) {
      const u = 0.06 + i * 0.1, upper = i % 2 === 0, A = side(u, g, lip(u), 1.0), len = 0.075 - 0.003 * i, w = 0.022;
      const dirv = vmul(S.up, upper ? -len : len), base0 = vadd(A.pl, vmul(S.hd, -w)), base1 = vadd(A.pl, vmul(S.hd, w)), tp = vadd(vadd(A.pl, dirv), vmul(S.hd, -0.008));
      const q = [base0, base1, tp].map((x) => camPoint(c, W(x)));
      if (!q.every(Boolean)) continue;
      const col = shade(A.pl, A.nl, 'claw', 0);
      items.push({d: camDepth(c, W(A.pl)) - 0.13, f: () => { if (p) hardFill(p, seed + 700 + gi * 20 + i, col, q as Pt[]); }});
    }
    const nos = [side(0.98, g, 0.62, 0.7), side(1.1, g, 0.66, 0.72)].map((x) => camPoint(c, W(x.pl)));
    if (nos[0] && nos[1]) items.push({d: camDepth(c, W(side(1.04, g, 0.64).pl)) - 0.12, f: () => stroke(seed + 760 + gi, nos[0]!, nos[1]!, '#050403', 1.6)});
    const E = side(1.55, g, 0.42, 0.86), ring = Array.from({length: 10}, (_, j) => { const th = (j / 10) * Math.PI * 2; return camPoint(c, W(vadd(E.pl, vadd(vmul(S.hd, 0.06 * Math.cos(th)), vmul(S.up, 0.042 * Math.sin(th)))))); });
    const brow = [side(1.42, g, 0.66, 0.8), side(1.58, g, 0.72, 0.8), side(1.72, g, 0.62, 0.86)].map((x) => camPoint(c, W(x.pl)));
    if (ring.every(Boolean)) items.push({d: camDepth(c, W(E.pl)) - 0.14, f: () => {
      if (!p) return;
      hardFill(p, seed + 770 + gi, SP.eye, ring as Pt[]);
      const ek = cardAt(c, W(E.pl)); if (ek) hardFill(p, seed + 772 + gi, mixC(SP.skin, '#ffc060', 0.85 * fk), cell({g: (ring as Pt[])[2], u: ek.u, s: 1}, 0.008, 0.004, 0.014, 0.011, 6));
      if (brow.every(Boolean)) hardFill(p, seed + 774 + gi, '#0b0807', strip(brow as Pt[], [0.8, 2.2, 0.8]));
    }});
  });
  // crest: a low bony bump on the midline before the eyes
  const cr = [S.headAt(1.05 * HK), S.headAt(1.25 * HK), S.headAt(1.45 * HK)].map((h, i) => vadd(h.p, vmul(S.up, h.b + [0.0, 0.09, 0.02][i])));
  const crb = [S.headAt(1.45 * HK), S.headAt(1.05 * HK)].map((h) => vadd(h.p, vmul(S.up, h.b * 0.6)));
  const crq = [...cr, ...crb].map((x) => camPoint(c, W(x)));
  if (crq.every(Boolean)) items.push({d: camDepth(c, W(cr[1])) - 0.05, f: () => { if (p) hardFill(p, seed + 790, shade(cr[1], [0, 1, 0], 'skin', 0), crq as Pt[]); }});
  // ---- contact: a dark pad of ground under each planted foot (painted first, under everything)
  if (p) S.feet.forEach((f, i) => { if (f[1] > 0.3) return; const g = cardAt(c, W([f[0] - 0.3, 0, f[2]])); const pts = Array.from({length: 18}, (_, j) => camPoint(c, W([f[0] - 0.3 + 0.85 * Math.cos((j / 18) * 6.283), 0.004, f[2] + 0.5 * Math.sin((j / 18) * 6.283)]))); if (g && pts.every(Boolean)) washAt(p, seed + 800 + i, '#030202', 170, pts as Pt[], 0, 0); });
  items.sort((x, y) => y.d - x.d).forEach((it) => it.f());
  const pt = (l: L3) => camPoint(c, W(l));
  const peak = S.sail.reduce((a, e) => (e.top[1] > a.top[1] ? e : a));
  const snout = pt(S.tip), eye = pt(side(1.55, toward(side(1.55, 1, 0.42).pl, side(1.55, 1, 0.42).nl) ? 1 : -1, 0.42, 0.86).pl), sp = pt(peak.top), cl = pt(S.claws[0]);
  if (!snout || !eye || !sp || !cl || !all.length) return null;
  return {snout, eye, sailPeak: sp, claw: cl, feet: S.feet.map((f) => pt([f[0] - 0.3, 0, f[2]])), top: Math.min(...all.map((q) => q[1])), bottom: Math.max(...all.map((q) => q[1])), left: Math.min(...all.map((q) => q[0])), right: Math.max(...all.map((q) => q[0]))};
};

import {mixColor} from '../kit/painter';
import {add, dot, ballKeys, clampReach, cross, ik2, keyAt, limb, mul, newRig, nrm, onLoft, spline, sub, uOfS, type BeastPlace, type Build, type Key, type L3} from './beast';

// EDU-EP16 N16-22 R2 T. rex kit creature (Boss, 14 Nov 2026), from Film's `buildTRex` prototype and the user's references (store `projects/edu/EDU/references/user/2026-11-14_trex-front34-ref.webp`
// and `..._trex-side-ref.png`, UT10): massive deep skull with a roaring mouth, thick short S-neck, deep barrel chest, huge two-toed... three-toed hind legs, two-fingered small arms, long counter-balancing tail.
// EP16 uses it only as a faded apparition at 50 % opacity rising from a cloud bank (N16-22 R2); the volume is drawn in full so it holds when the layer is faded.
// Skeleton: body (root) -> neck [neck.base on the chest loft] -> skull [skull.joint = neck tip] -> jaw [jaw.hinge in the skull] (lower teeth, mouth lining, tongue), eye.L/R, brow.L/R, nostril.L/R (upper teeth on the skull);
// body -> tail [tail.base on the rump, constant-length arc]; body -> arms AL / AR (upper arm [shoulder], forearm [elbow], hand [wrist] with two claws); body -> legs LL / LR: thigh [hip] -> shin [knee] -> foot [ankle].

// SCALE (B-R15B-07, measured 14 Nov 2026): the model runs x -12.2 .. +5.6 plus the head, 17.8 to 18.2 m snout to tail, with the back 5.8 m above the ground over the hips and the hip joint at 3.5 m. The user's side reference (store
// `projects/edu/EDU/references/user/2026-11-14_trex-side-ref.png`) has length : back-height-at-the-hips of about 3.8 : 1, which for the 12 to 12.3 m a T. rex reached is a back 3.2 to 3.7 m high; the model has 3.1 : 1, so it is ~1.5x a real T. rex in every dimension
// (stockier by 20 %), not the "12 m, hip 3.6 m" this header used to claim. The size is kept because Film's 16C/16D frames assume it; shrink to ~0.66 only on Film's word (it halves the T. rex's frame height).
export const TRX = {skin: '#7a6c4c', back: '#54492f', belly: '#b9a783', mouth: '#b4646e', tongue: '#c97c84', tooth: '#efe6cc', eye: '#d9a832', claw: '#2a241c'} as const;
export type TRexPose = {
  /** Jaw open 0 (shut) .. 1 (roar, 0.7 rad). */
  jaw?: number;
  /** Head raise 0..1 (neck lifts, skull pitches up). */
  neck?: number;
  /** Tail sway: tip yaw about the base (rad, + toward the left flank). */
  tail?: number;
  /** Weight shift: body bob (m). */
  bob?: number;
  /** N16-22 R3: walk phase (cycles) and stride (m); stride 0 = standing. Feet follow `trexFoot`, left at phase 0 and right at 0.5. */
  walk?: number; stride?: number;
  /** N16-22 R3: neck-yaw of the whole head group about the neck base (rad, + toward the creature's left = +z). */
  yaw?: number;
  /** N16-22 R3: head carried low: the skull drops by `drop` m (neck bends down, snout pitches down) so a stalking or sniffing head hangs near hip height. */
  drop?: number;
  /** N16-22 R3: nostril flare 0..1 (bumps swell to 1.6x and the slits open). */
  flare?: number;
  /** B-R15B-06 turning walk: the body heading (rad, the `BeastPlace.heading` convention) as a function of the walk phase. The planted foot stays where it stands in the world while the hips yaw, so a heading change while walking does not skate the feet. Unset = a straight walk. */
  hd?: (walk: number) => number;
};
/** B-R15B-03: skin scale cells are cut to about this many screen px (1080-wide frame), so close-ups show fine scales instead of 4 x 4 squares. */
export const TEX_PX = 7;
/** B-R15B-02: the lower jaw's underside is the belly colour pulled toward the skin, so a shut jaw is never the brightest part of the head. */
const JAW_UNDER = mixColor(TRX.belly, TRX.skin, 0.5);
const L_THIGH = 2.0, L_SHIN = 1.95;
/** upper arm and forearm lengths (m) */
export const TRX_ARM = [0.75, 0.62] as const;
/** N16-22 R3 stalk gait: 0.55 cycles per second, 2.4 m stride (= 1.32 m/s ground speed). */
export const TREX_DUTY = 0.62;
/** B-R15B-06: the stance foot slides back one `stride` while the walk phase advances `TREX_DUTY`, so the planted feet stay put only if the body covers `stride / TREX_DUTY` m per phase cycle (the old `speed` 0.55 * 2.4 = 1.32 m/s skated the feet by 1.6x). */
export const TREX_STALK = {hz: 0.55, stride: 2.4, duty: TREX_DUTY, perCycle: 2.4 / TREX_DUTY, speed: (0.55 * 2.4) / TREX_DUTY} as const;
/** Metres the body travels while the walk phase advances `dph` cycles with planted feet. */
export const trexWalkDist = (dph: number, stride = TREX_STALK.stride): number => (dph * stride) / TREX_DUTY;
/** Walk phase advance for `dist` metres of body travel. */
export const trexWalkPhase = (dist: number, stride = TREX_STALK.stride): number => (dist * TREX_DUTY) / stride;
/** B-R15B-06 settle: the walk phase (>= `ph`) where both feet are down, so a walk that ends there and holds the phase (pass `walk` and `stride` to `sniff`, `turn` or `stand`) stops with both feet planted and no pop. Both feet are down for the phases [0, 0.12) and [0.5, 0.62) of each cycle. */
export const trexSettlePhase = (ph: number): number => { const f = ph - Math.floor(ph), c = Math.floor(ph); return f < TREX_DUTY - 0.5 || (f >= 0.5 && f < TREX_DUTY) ? ph : f < 0.5 ? c + 0.5 : c + 1; };
/** B-R15B-06: ankle of the foot at walk phase `ph` for a body whose heading follows `hd(phase)` (rad, the `BeastPlace.heading` convention, a function of the walk phase because the body covers `trexWalkDist` per phase). Returns local [s, lift, l].
 * Stance (`duty` share of the cycle): the foot is fixed in the WORLD, so in the body frame it slides back one `S` and turns against the body's yaw since the plant (`hd(ph) - hd(plant)`), the hips yaw while the foot stays. Swing: from where stance ended (turned into the current frame)
 * to the next plant spot (`s0 + S/2`, `l0`), lifted. `s0`, `l0` are the neutral foot's local forward and left coordinates (body origin = 0). With a constant `hd` this is the plain walk. */
export const trexFoot = (ph: number, S: number, hd: (ph: number) => number, s0: number, l0: number, lift: number): L3 => {
  const t = ((ph % 1) + 1) % 1, rot = (v: [number, number], a: number): [number, number] => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[1] * Math.cos(a) + v[0] * Math.sin(a)];
  /** foot position in the body frame at phase `pc` for the stance that began at `ps` */
  const stance = (ps: number, pc: number): [number, number] => {
    const d = hd(pc) - hd(ps), n = Math.max(1, Math.ceil(Math.abs(pc - ps) * 40)), h0 = hd(ps), step = (S / TREX_DUTY) * ((pc - ps) / n);
    let bs = 0, bl = 0;   // body displacement since the plant, in the plant frame: the path integral of its heading (midpoint rule)
    for (let i = 0; i < n; i++) { const a = hd(ps + ((i + 0.5) * (pc - ps)) / n) - h0; bs += Math.cos(a) * step; bl -= Math.sin(a) * step; }
    return rot([s0 + S / 2 - bs, l0 - bl], d);
  };
  if (t < TREX_DUTY) { const [a, b] = stance(ph - t, ph); return [a, 0, b]; }
  const pe = ph - (t - TREX_DUTY), [ea, eb] = rot(stance(pe - TREX_DUTY, pe), hd(ph) - hd(pe)), u = (t - TREX_DUTY) / (1 - TREX_DUTY), e = u * u * (3 - 2 * u), pa = s0 + S / 2, pb = l0;
  return [ea + (pa - ea) * e, lift * Math.sin(Math.PI * u), eb + (pb - eb) * e];
};

/** Turn the neck group (every bone under `neck`) by `a` rad about the vertical through `pivot` (the neck base): keys, flats and joints are rotated together, so every joint stays attached. */
const yawHead = (B: Build, a: number, pivot: L3): ((p: L3) => L3) => {
  const kids = new Set<string>(['neck']);
  for (let again = true; again;) { again = false; for (const b of B.bones) if (b.parent && kids.has(b.parent) && !kids.has(b.id)) { kids.add(b.id); again = true; } }
  const c = Math.cos(a), s = Math.sin(a), rp = (p: L3): L3 => { const x = p[0] - pivot[0], z = p[2] - pivot[2]; return [pivot[0] + x * c + z * s, p[1], pivot[2] - x * s + z * c]; };
  for (const q of B.parts) if (kids.has(q.bone)) q.keys = q.keys.map((k) => ({...k, p: rp(k.p)}));
  for (const f of B.flats) if (kids.has(f.bone)) { f.pts = f.pts.map(rp); if (f.veins) f.veins = f.veins.map((v) => v.map(rp)); }
  for (const b of B.bones) if (kids.has(b.id) && b.joint && b.id !== 'neck') B.joints[b.joint] = rp(B.joints[b.joint]);
  return rp;
};

export const buildTRex = (o: TRexPose = {}): Build => {
  const R = newRig(), B = R.B, TEX = {n: 4, amp: 0.1, scale: 0.85, warm: '#8c5a36', px: TEX_PX}, stripe = (u: number, sd: number) => (sd > 0.3 ? (Math.round(u * 24) % 3 === 0 ? '#3d3422' : TRX.back) : sd < -0.45 ? TRX.belly : TRX.skin), skin = stripe, jaw = o.jaw ?? 0, nk = o.neck ?? 0, bob = o.bob ?? 0, ph = o.walk ?? 0, S = o.stride ?? 0, fl = o.flare ?? 0, dr = o.drop ?? 0;
  const root = R.bone('body', null);
  const body = spline([
    {p: [-5.6, 3.7 + bob, 0], a: 0.4, b: 0.45}, {p: [-3.6, 3.95 + bob, 0], a: 0.8, b: 0.95}, {p: [-1.8, 4.2 + bob, 0], a: 1.2, b: 1.4}, {p: [-0.1, 4.15 + bob, 0], a: 1.4, b: 1.65}, {p: [1.3, 4.3 + bob, 0], a: 1.2, b: 1.45}, {p: [2.1, 4.8 + 0.3 * nk + bob, 0], a: 0.82, b: 0.95},
  ], 4);
  R.loft(root, {m: 16, col: skin, tex: TEX, fold: 3, cap: true, keys: body});
  // tail: constant-length arc, thick at the rump
  const tb = onLoft(body, 0), tk = keyAt(body, 0), tail = R.bone('tail', root, 'tail.base', tb), NT = 8, TL = 6.6, ds = TL / NT, tpts: L3[] = [tb];
  let phi = 0, x = tb[0], z = tb[2];
  for (let i = 1; i <= NT; i++) { phi += ((o.tail ?? 0) * (2 * i - 1)) / (NT * NT); x -= Math.cos(phi) * ds; z += Math.sin(phi) * ds; tpts.push([x, tb[1] - 0.4 * (i / NT) ** 1.5, z]); }
  R.loft(tail, {m: 12, col: skin, tex: TEX, fold: 3, keys: tpts.map((p, i) => ({p, a: 0.03 + (tk.a - 0.03) * (1 - i / NT) ** 1.5, b: 0.03 + (tk.b - 0.03) * (1 - i / NT) ** 1.5}) as Key)});
  // neck: a thick S from the chest to the back of the skull
  const nb = onLoft(body, 0.9), nbk = keyAt(body, 0.9), neck = R.bone('neck', root, 'neck.base', nb), sk: L3 = [3.1 + 0.2 * nk + 0.35 * dr, 5.7 + 1.1 * nk + bob - dr, 0];
  R.loft(neck, {m: 14, col: skin, tex: TEX, fold: 2, keys: spline([{p: nb, a: nbk.a, b: nbk.b}, {p: [2.65 + 0.15 * dr, 5.25 + 0.6 * nk + bob - 0.45 * dr, 0], a: 0.8, b: 0.95}, {p: sk, a: 0.56, b: 0.7}], 3)});
  // skull (rebuilt 14 Nov 2026, user: "polish the face, the shadow inside the mouth is missing"): stations in head units (u along the head, vt/vb top and bottom edge, wd half-width), so the lower edge `vb` IS the tooth line
  // and the mouth opens below it; the old loft hung 0.3 m below the teeth and hid the mouth. Deep box behind the eye, tapering to a rounded snout; the face (socketed eye under a heavy brow, nostril bumps, lacrimal horn,
  // two tooth rows, gum, lip line) sits on that surface; the roar shows a dark throat, a roof and cheek walls fading to black at the back, a tongue shaded toward the throat and the upper jaw's cast shadow on the lower row.
  const hp = 0.1 + 0.32 * jaw - 0.17 * dr, HS = 1.3, skull = R.bone('skull', neck, 'skull.joint', sk);
  const H = (u0: number, v0: number, w0 = 0): L3 => { const u = u0 * HS, v = v0 * HS, w = w0 * HS; return [sk[0] + u * Math.cos(hp) - v * Math.sin(hp), sk[1] + u * Math.sin(hp) + v * Math.cos(hp), w]; };
  const ST: {u: number; vt: number; vb: number; wd: number}[] = [{u: -0.05, vt: 0.62, vb: -0.4, wd: 0.55}, {u: 0.3, vt: 0.68, vb: -0.42, wd: 0.66}, {u: 0.7, vt: 0.54, vb: -0.4, wd: 0.56}, {u: 1.1, vt: 0.5, vb: -0.38, wd: 0.5}, {u: 1.5, vt: 0.42, vb: -0.36, wd: 0.42}, {u: 1.8, vt: 0.28, vb: -0.32, wd: 0.3}, {u: 1.95, vt: 0.06, vb: -0.24, wd: 0.1}];
  const stAt = (u: number) => { let i = 0; while (i < ST.length - 2 && u > ST[i + 1].u) i++; const f = clampU((u - ST[i].u) / (ST[i + 1].u - ST[i].u)), m = (k: 'vt' | 'vb' | 'wd') => ST[i][k] + (ST[i + 1][k] - ST[i][k]) * f; return {vt: m('vt'), vb: m('vb'), wd: m('wd')}; };
  const clampU = (x: number) => Math.min(1, Math.max(0, x));
  /** a point on the skull surface: `vf` -1 (jaw line) .. 1 (top), `g` side */
  const onSkull = (u: number, vf: number, g: number, out = 0): L3 => { const s0 = stAt(u), vm = (s0.vt + s0.vb) / 2, hh = (s0.vt - s0.vb) / 2; return H(u, vm + vf * hh, g * (s0.wd * Math.sqrt(Math.max(0.0, 1 - vf * vf)) + out)); };
  const dirH = (u: number, v: number, w: number): L3 => nrm(sub(H(u, v, w), H(0, 0, 0)));
  const SKIN_T = {n: 4, amp: 0.1, scale: 0.85, warm: '#8c5a36', px: TEX_PX};
  R.loft(skull, {m: 12, col: () => TRX.skin, tex: SKIN_T, keys: ballKeys(sk, 0.8, [Math.cos(hp), Math.sin(hp), 0])});   // occiput ball closing the neck-to-skull bend
  R.loft(skull, {m: 16, cap: true, fold: 2, tex: SKIN_T, col: (u, sd) => (sd > 0.5 ? TRX.back : sd < -0.55 ? TRX.belly : TRX.skin), keys: spline(ST.map((q) => ({p: H(q.u, (q.vt + q.vb) / 2), a: q.wd * HS, b: ((q.vt - q.vb) / 2) * HS}) as Key), 3)});
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const e = onSkull(0.42, 0.22, g, -0.035), eb = R.bone(`eye.${nm}`, skull, `eye.${nm}.pivot`, e), bb = R.bone(`brow.${nm}`, skull, `brow.${nm}.pivot`, onSkull(0.43, 0.66, g, 0.015)), nb2 = R.bone(`nostril.${nm}`, skull, `nostril.${nm}.pivot`, onSkull(1.7, 0.4, g, 0.0));
    const out = dirH(0.12, 0.0, g), up = dirH(0, 1, 0);
    // brow: a heavy bony ridge over the eye, running back along the top of the skull, with a dark cast-shadow band under it and the lacrimal horn in front
    R.loft(bb, {m: 8, col: () => '#5f5338', tex: {n: 2, amp: 0.25, scale: 0.5}, keys: [{p: onSkull(0.12, 0.7, g, 0.03), a: 0.05, b: 0.035}, {p: onSkull(0.27, 0.68, g, 0.02), a: 0.08, b: 0.06}, {p: onSkull(0.43, 0.66, g, 0.015), a: 0.1, b: 0.07}, {p: onSkull(0.6, 0.62, g, 0.012), a: 0.07, b: 0.05}, {p: onSkull(0.74, 0.58, g, 0.01), a: 0.04, b: 0.03}] as Key[]});
    R.loft(bb, {m: 6, col: () => '#4a3f2a', keys: [{p: onSkull(0.62, 0.5, g, 0.0), a: 0.05, b: 0.04}, {p: onSkull(0.7, 0.62, g, 0.05), a: 0.07, b: 0.1}, {p: add(onSkull(0.7, 0.62, g, 0.05), mul(up, 0.1)), a: 0.025, b: 0.02}]});
    R.loft(eb, {m: 12, col: () => '#2a2014', keys: ballKeys(add(e, mul(out, -0.02)), 0.15, out)});   // socket: a dark ring so the eye sits in a hollow under the brow
    R.loft(eb, {m: 12, col: () => TRX.eye, keys: ballKeys(add(e, mul(out, 0.03)), 0.105, out)});   // iris
    R.loft(eb, {m: 6, col: () => '#120d08', keys: [{p: add(add(e, mul(out, 0.125)), mul(up, -0.07)), a: 0.014, b: 0.014}, {p: add(add(e, mul(out, 0.135)), mul(up, 0)), a: 0.024, b: 0.024}, {p: add(add(e, mul(out, 0.125)), mul(up, 0.07)), a: 0.014, b: 0.014}]});   // vertical slit pupil
    R.loft(eb, {m: 6, col: () => '#f6efd2', keys: [{p: add(add(add(e, mul(out, 0.112)), mul(up, 0.03)), mul(dirH(1, 0, 0), 0.025)), a: 0.012, b: 0.012}, {p: add(add(add(e, mul(out, 0.118)), mul(up, 0.03)), mul(dirH(1, 0, 0), 0.025)), a: 0.005, b: 0.005}]});   // catch-light
    // nostril: a bony bump with a dark slit, and the nasal ridge behind it
    const n0 = onSkull(1.7, 0.4, g, 0.0), nd = dirH(0.3, 0.3, g);
    R.loft(nb2, {m: 8, col: () => '#6f6244', tex: {n: 2, amp: 0.2}, keys: ballKeys(n0, 0.06 * (1 + 0.6 * fl), nd)});
    R.loft(nb2, {m: 6, col: () => '#1a150e', keys: [{p: add(n0, mul(nd, 0.05)), a: 0.022 * (1 + 0.8 * fl), b: 0.034 * (1 + 0.8 * fl)}, {p: add(n0, mul(nd, 0.075 + 0.02 * fl)), a: 0.01 * (1 + fl), b: 0.016 * (1 + fl)}]});
  }
  // lower jaw: hinged under the back of the skull, dropped by `jaw` (up to 0.7 rad); its top lies on the tooth line when shut
  const ja = hp - 0.02 * Math.min(1, jaw * 4) - 0.72 * jaw, hinge = H(0.15, -0.4), jawB = R.bone('jaw', skull, 'jaw.hinge', hinge);
  // B-R15B-02 shut jaw: the open-jaw keys hang the lower jaw ~0.1 hu below the tooth line toward the snout (the upper tooth line rises to the tip), which read as a pale stick past the snout when `jaw` is 0.
  // `shut` (1 at jaw 0, gone by jaw 0.3) lifts every jaw point by the gap between the jaw's top (v 0.01) and the upper tooth line `stAt(u + 0.15).vb`, so the jaw top follows the tooth line; over the last 0.7 hu it lifts a further 0.11 hu so the jaw's underside meets the skull's lower edge at the tip (no chin stub) and the tip stays behind the snout.
  const shut = 1 - Math.min(1, jaw / 0.3), shutLift = (u0: number) => shut * Math.min(1, u0 / 0.5) * (stAt(Math.min(1.95, u0 + 0.15)).vb + 0.4 - 0.01 + 0.035 + 0.11 * clampU((u0 - 1.0) / 0.68) ** 1.5);   // fades to 0 at the hinge (u 0) so the jaw's first key stays on its joint
  const J = (u0: number, v0: number, w0 = 0): L3 => { const u = u0 * HS, v = (v0 + shutLift(u0)) * HS, w = w0 * HS; return [hinge[0] + u * Math.cos(ja) - v * Math.sin(ja), hinge[1] + u * Math.sin(ja) + v * Math.cos(ja), w]; };
  const JW = (u: number) => 0.4 - 0.15 * Math.min(1, Math.max(0, (u - 0.2) / 1.45));   // jaw half width (head units) along its length
  R.loft(jawB, {m: 14, col: (u, sd) => (sd > 0.3 ? TRX.skin : JAW_UNDER), tex: SKIN_T, cap: true, fold: 2, keys: spline([{p: J(0, 0), a: 0.4 * HS, b: 0.12 * HS}, {p: J(0.5, -0.12), a: 0.37 * HS, b: 0.13 * HS}, {p: J(1.0, -0.1), a: 0.3 * HS, b: 0.11 * HS}, {p: J(1.45, -0.07), a: 0.2 * HS, b: 0.08 * HS}, {p: J(1.68, -0.06), a: 0.1 * HS, b: 0.06 * HS}], 3)});
  const ink = (c: string, k: number) => mixColor(c, '#0a0406', k);
  const dark = '#1a0a0e', roofC = '#7a3d49', floorC = '#a8535f';
  const orient = (pts: L3[], dir: L3): L3[] => (dot(cross(sub(pts[1], pts[0]), sub(pts[pts.length - 1], pts[0])), dir) < 0 ? [...pts].reverse() : pts);
  if (jaw > 0.05) {
    const U0 = 0.22, U1 = 1.75, NS = 12, shade = (k: number, c: string) => mixColor(ink(c, 0.92), c, Math.min(1, Math.max(0, k * 1.1)) ** 1.5 * 0.95 + 0.03);   // 0 at the throat .. 1 at the front: shadow fades toward the lips
    for (let k = 0; k < NS; k++) {   // roof of the mouth and the lower floor, in strips from the throat to the lips, each strip a step brighter (the depth shadow)
      const ua = U0 + (U1 - U0) * (k / NS), ub = U0 + (U1 - U0) * ((k + 1) / NS), kk = (k + 0.5) / NS;
      const wa = Math.max(0.1, stAt(ua).wd - 0.1), wb = Math.max(0.08, stAt(ub).wd - 0.1), vA = stAt(ua).vb + 0.012, vB = stAt(ub).vb + 0.012;
      R.flat(skull, {pts: orient([H(ua, vA, wa), H(ub, vB, wb), H(ub, vB, -wb), H(ua, vA, -wa)], dirH(0, -1, 0)), col: shade(kk * 0.85, roofC), two: false});   // roof: seen from below
      R.flat(skull, {pts: orient([H(ua, vA, wa), H(ub, vB, wb), H(ub, vB, -wb), H(ua, vA, -wa)], dirH(0, 1, 0)), col: shade(kk * 0.7, roofC), two: false});
      const jwa = Math.max(0.08, JW(ua) - 0.07), jwb = Math.max(0.06, JW(ub) - 0.07);
      R.flat(jawB, {pts: orient([J(ua, 0.012, jwa), J(ub, 0.012, jwb), J(ub, 0.012, -jwb), J(ua, 0.012, -jwa)], dirH(0, 1, 0)), col: shade(kk * 0.55 + 0.1, floorC), two: true});   // gum floor: upper jaw's cast shadow darkens the rear and the middle
      if (k < NS / 2) for (const g of [1, -1]) {   // cheek walls: only the back HALF of the mouth (hinge to the middle, user 14 Nov 2026), so the tooth row and the background read through the front half; one-sided, fading to black at the back
        const ca = [H(ua, vA, g * wa), H(ub, vB, g * wb), J(ub, 0.012, g * jwb), J(ua, 0.012, g * jwa)];
        R.flat(skull, {pts: orient(ca, dirH(0, 0, -g)), col: shade(kk * 0.75, '#8a4350'), two: false});
      }
    }
    // throat: a black wall closing the back of the mouth, with a lighter ring (the pharynx) in it, and a dark mouth-corner line along each lip
    R.flat(skull, {pts: [H(U0 - 0.02, ST[1].vb + 0.01, 0.46), J(U0 - 0.02, 0.01, 0.34), J(U0 - 0.02, 0.01, -0.34), H(U0 - 0.02, ST[1].vb + 0.01, -0.46)], col: dark, two: true});
    R.flat(skull, {pts: [H(U0 - 0.01, ST[1].vb + 0.0, 0.3), J(U0 - 0.01, 0.0, 0.22), J(U0 - 0.01, 0.0, -0.22), H(U0 - 0.01, ST[1].vb + 0.0, -0.3)], col: '#2e1219', two: true});
    for (const g of [1, -1]) R.flat(skull, {pts: [H(0.22, ST[1].vb + 0.02, g * 0.5), H(1.82, stAt(1.82).vb + 0.015, g * 0.2), H(1.82, stAt(1.82).vb - 0.02, g * 0.21), H(0.22, ST[1].vb - 0.03, g * 0.52)], col: '#140a0c', two: true});   // lip line: the dark seam where the upper lip meets the jaw
    // tongue: a rounded loft on the jaw, dark at the throat and bright at the tip
    R.loft(jawB, {m: 10, col: (u) => mixColor(ink('#c9737b', 0.7), '#d98890', Math.min(1, 0.1 + u * 1.15)), keys: spline([{p: J(0.28, 0.07), a: 0.14 * HS, b: 0.08 * HS}, {p: J(0.7, 0.09), a: 0.15 * HS, b: 0.09 * HS}, {p: J(1.1, 0.09), a: 0.12 * HS, b: 0.07 * HS}, {p: J(1.42, 0.07), a: 0.07 * HS, b: 0.05 * HS}], 3)});
    // the upper jaw's cast shadow on the lower row: a dark band down the lower inner edge of each side
    for (const g of [1, -1]) R.flat(jawB, {pts: orient([J(0.3, 0.014, g * (JW(0.3) - 0.07)), J(1.55, 0.014, g * (JW(1.55) - 0.06)), J(1.55, 0.014, g * (JW(1.55) - 0.15)), J(0.3, 0.014, g * (JW(0.3) - 0.22))], dirH(0, 1, 0)), col: ink('#8a4350', 0.7), two: true});
  }
  // teeth: big, thick, curved-back cones; the upper row hangs from the tooth line (front incisors small, the middle ones largest), the lower row stands on the jaw; gum line above each
  if (jaw > 0.05) for (const g of [1, -1]) {
    for (let i = 0; i < 14; i++) {
      const u = 0.48 + i * 0.1, st = stAt(u), w = g * (st.wd - 0.02) * Math.sqrt(1 - 0.0), L = (0.1 + 0.11 * Math.sin(((i + 1) / 15) * Math.PI)) * HS, bs = H(u, st.vb + 0.01, w * 0.97), tip = add(H(u - 0.03, st.vb - L / HS, w * 0.97), [0, 0, 0]);
      R.flat(skull, {pts: [add(bs, [-0.045, 0, 0]), add(bs, [0.045, 0, 0]), tip], col: i % 3 === 1 ? '#e2d6b4' : TRX.tooth, two: true});
    }
    for (let i = 0; i < 10; i++) {
      const u = 0.62 + i * 0.1, w = g * (JW(u) - 0.045), L = (0.08 + 0.08 * Math.sin(((i + 1) / 11) * Math.PI)) * HS, bs = J(u, 0.012, w), tip = J(u + 0.03, 0.012 + L / HS, w * 0.95);
      R.flat(jawB, {pts: [add(bs, [-0.04, 0, 0]), add(bs, [0.04, 0, 0]), tip], col: i % 3 === 0 ? '#e2d6b4' : TRX.tooth, two: true});
    }
    for (let i = 0; i < 3; i++) { const u = 1.78 + i * 0.05, st = stAt(u), bs = H(u, st.vb + 0.01, g * 0.06 * (i + 0.5)); R.flat(skull, {pts: [add(bs, [-0.03, 0, 0]), add(bs, [0.03, 0, 0]), H(u, st.vb - 0.1, g * 0.06 * (i + 0.5))], col: TRX.tooth, two: true}); }
  }
  // arms: short, two clawed fingers; shoulder on the chest loft
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    // BOSS-R15-ARMS: real arm ~8% of body length (1 m on 12 m) -> ~1.5 m on this 17.8 m animal: upper arm 0.75, forearm 0.62, elbow bent ~90 deg (forearm forward-down), hand with two long claws
    const sh = onLoft(body, uOfS(body, 1.55), g * 0.7, -0.35), hd: L3 = [sh[0] + 0.62, sh[1] - 0.78, sh[2] + g * 0.2], hand = clampReach(sh, hd, TRX_ARM[0], TRX_ARM[1]), el = ik2(sh, hand, TRX_ARM[0], TRX_ARM[1], [-0.3, -1, 0]);
    limb(R, {id: `A${nm}`, parent: root, hip: sh, knee: el, foot: hand, side: g, col: skin, toes: 2, toeCol: TRX.claw, toeLen: 0.5, pad: add(hand, [0.2, -0.16, 0]), tex: TEX, r: [0.3, 0.2, 0.14, 0.11]});
  }
  // legs: digitigrade. Heavy thigh (hip on the lower flank of the loft), shin, raised ankle, long metatarsus down to the toe pad; hips on the loft, knees from IK bending forward
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const hip = onLoft(body, uOfS(body, -1.2), g * 0.62, -0.45), s0 = hip[0] - 0.55, l0 = hip[2] * 1.06, [fs, gl, fl] = S ? trexFoot(ph + (g > 0 ? 0 : 0.5), S, o.hd ? (q) => o.hd!(q - (g > 0 ? 0 : 0.5)) : () => 0, s0, l0, 0.45) : [s0, 0, l0];
    const ank: L3 = [fs, 1.15 + gl, fl], foot = clampReach(hip, ank, L_THIGH, L_SHIN), knee = ik2(hip, foot, L_THIGH, L_SHIN, [1, 0, 0.12 * g]);
    limb(R, {id: `L${nm}`, parent: root, hip, knee, foot, side: g, col: (u, sd) => (sd < -0.45 ? '#a89270' : sd > 0.3 ? '#5e4a30' : '#745e40'), tex: {...TEX, amp: 0.12, warm: '#94603c'}, toes: 3, toeCol: TRX.claw, toeLen: 0.5, pad: [foot[0] + 0.9, 0.18 + gl, foot[2]], r: [0.95, 0.52, 0.3, 0.38]});
  }
  const rp = o.yaw ? yawHead(B, o.yaw, nb) : (q: L3) => q;
  B.shadow = {s: -1, l: 0, rs: 4.5, rl: 1.5};
  // head anchors follow the neck yaw like the joints (B-R15B-05 `browTop`/`snoutTop`: the sun-slice band runs along the top of the skull between them)
  B.anchors = {snout: rp(H(1.8, -0.1)), mouth: rp(J(1.2, 0.1)), eye: rp(H(0.42, 0.28, 0.42)), browTop: rp(H(0.3, stAt(0.3).vt)), snoutTop: rp(H(1.75, stAt(1.75).vt)), chest: [1.3, 3.85, 0], top: [0, 6.5, 0]};
  return B;
};

/** B-R15B-05 sun slice: a warm light band (about 0.6 m wide) along the top of the brow and snout, for `BeastPlace.glow`. `k` 0..1 is its strength (0.6 reads as a low sun through a gap in the canopy). */
export const trexSunSlice = (B: Build, k = 0.6, col = '#f7dc96'): NonNullable<BeastPlace['glow']> => ({a: B.anchors.browTop, b: B.anchors.snoutTop, r: 0.45, col, k});

/** Smooth 0..1 ramp. */
const sm = (a: number, b: number, t: number) => { const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
/** Moments (clip fractions) at which the sniff pose puffs vapour. */
export const SNIFF_AT = [28 / 48, 40 / 48] as const;
export const TREX_POSES = {
  stand: (): TRexPose => ({}),
  /** Roar: head rises and the jaw opens over the first 40 %, holds to 70 %, then closes; the tail sways once and the body bobs a little. */
  /** N16-22 R3 stalk: slow predatory walk (`TREX_STALK`), head carried low and forward, body bobbing twice a cycle, tail counter-swaying. */
  stalk: (t: number): TRexPose => ({walk: t, stride: TREX_STALK.stride, neck: 0, drop: 1.9, bob: -0.07 * Math.cos(t * 4 * Math.PI), tail: 0.3 * Math.sin(t * 2 * Math.PI), yaw: 0.12 * Math.sin(t * 2 * Math.PI + 1)}),
  /** N16-22 R3 sniff: standing, head low-forward; two 0.15 m head lifts at `SNIFF_AT` (16C +28 and +40 of the 48 f clip, each about 6 f wide), nostrils flared at the top of each; neck yaw sways a little. `sniffAt` gives the vapour moments. */
  sniff: (t: number): TRexPose => { const k = (c: number) => Math.exp(-Math.pow((t - c) / 0.06, 2)), s = Math.max(k(SNIFF_AT[0]), k(SNIFF_AT[1])); return {neck: 0.14 * s, drop: 2.0, flare: s, yaw: 0.06 * Math.sin(t * Math.PI * 2), tail: 0.12 * Math.sin(t * 2 * Math.PI), bob: -0.02 * s}; },
  /** Neck-yaw head turn from `a0` to `a1` rad over t 0..1 (smooth), jaw shut, head up: the "lifts and turns away" beat (16D). */
  turn: (t: number, a0 = 0, a1 = -0.5): TRexPose => ({neck: 0.4 * sm(0, 0.4, t), drop: 1.6 * (1 - sm(0, 0.4, t)) + 0.2, yaw: a0 + (a1 - a0) * sm(0.2, 0.9, t)}),
  roar: (t: number): TRexPose => { const k = sm(0, 0.4, t) * (1 - sm(0.7, 1, t)); return {jaw: k, neck: k, tail: 0.35 * Math.sin(t * 2 * Math.PI), bob: 0.06 * k}; },
};

import {lerp, type Pt} from '../painter';

// WFOG-EP01-SHORT shared staging (scene-handoff index SS-R3.1, `MK-WF-ST`): WORLD-SHOP metres, the ten camera setups
// (ST-02) as one projector, and the story clocks (ST-04 ASM-PATH, ST-05 FOG-STATE, ST-06 light, ST-07 torch/door,
// ST-09 FOG-LENS) as pure functions of the composition frame G. Every plate samples these, so cuts keep continuity.

/** WORLD-SHOP metres: origin on the floor under the centre of the glass front, +x right seen from inside, +y up, +z out. */
export type V3 = [number, number, number];

export const DEG = Math.PI / 180;
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const ease = (u: number) => u * u * (3 - 2 * u);
/** Linear 0..1 progress of f over [a, b], clamped. */
export const seg = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
/** Cubic smoothstep of x over [a, b]. */
export const smoothstep = (a: number, b: number, x: number) => ease(seg(x, a, b));
/** sin(pi u) over [a, b], exactly 0 outside (held frames stay bit-identical). */
export const bump = (f: number, a: number, b: number) => {
  const u = seg(f, a, b);
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u);
};
export const mix3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
export const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale3 = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
export const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const mix2 = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/**
 * Cubic Hermite through timed keys with Catmull-Rom tangents inside and zero velocity at both ends: eased in and out,
 * no stop at the through-points.
 */
export const hermite = (keys: [number, V3][], f: number): V3 => {
  const n = keys.length;
  let i = 0;
  while (i < n - 2 && f > keys[i + 1][0]) i++;
  const [f0, p0] = keys[i], [f1, p1] = keys[i + 1];
  const tan = (k: number): V3 => (k === 0 || k === n - 1 ? [0, 0, 0] : sub3(keys[k + 1][1], keys[k - 1][1]).map((d) => (d / (keys[k + 1][0] - keys[k - 1][0])) * (f1 - f0)) as V3);
  const m0 = tan(i), m1 = tan(i + 1), u = clamp01((f - f0) / (f1 - f0));
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  return [0, 1, 2].map((j) => h00 * p0[j] + h10 * m0[j] + h01 * p1[j] + h11 * m1[j]) as V3;
};

// ------------------------------------------------------------------ ST-02 camera setups and the projector

export type SetupId =
  | 'CAM-GLASS-OUT' | 'CAM-LOW-SHELF' | 'CAM-LOW-CU' | 'CAM-INT-REV' | 'CAM-FORECOURT' | 'CAM-COUNTER-IN'
  | 'CAM-COUNTER-OUT' | 'CAM-INT-SIDE' | 'CAM-INT-2S' | 'CAM-INT-DOOR-REV';
export type Setup = {id: SetupId; pos: V3; look: '+z' | '-z' | '-x'; f: number; yh: number};

export const SETUPS: Record<SetupId, Setup> = {
  'CAM-GLASS-OUT': {id: 'CAM-GLASS-OUT', pos: [0, 1.45, -3.0], look: '+z', f: 1341, yh: 700},
  'CAM-LOW-SHELF': {id: 'CAM-LOW-SHELF', pos: [-0.9, 0.6, -2.5], look: '+z', f: 920, yh: 700},
  'CAM-LOW-CU': {id: 'CAM-LOW-CU', pos: [-0.95, 0.75, -2.4], look: '+z', f: 1100, yh: 760},
  'CAM-INT-REV': {id: 'CAM-INT-REV', pos: [-0.9, 1.35, -0.3], look: '-z', f: 1100, yh: 820},
  'CAM-FORECOURT': {id: 'CAM-FORECOURT', pos: [-0.9, 1.5, 0.8], look: '+z', f: 1341, yh: 760},
  'CAM-COUNTER-IN': {id: 'CAM-COUNTER-IN', pos: [-0.6, 1.45, -4.4], look: '+z', f: 1341, yh: 700},
  // SS-R3.3 (ST-02): eye 1.10 m and y_h 780 (was 1.45 / 700) so the counter top is a sliver and its dark front fills the caption band.
  'CAM-COUNTER-OUT': {id: 'CAM-COUNTER-OUT', pos: [-2.0, 1.10, -1.4], look: '-z', f: 1341, yh: 780},
  'CAM-INT-SIDE': {id: 'CAM-INT-SIDE', pos: [2.4, 1.45, -0.6], look: '-x', f: 1100, yh: 700},
  'CAM-INT-2S': {id: 'CAM-INT-2S', pos: [0.3, 1.45, -3.6], look: '+z', f: 1341, yh: 600},
  'CAM-INT-DOOR-REV': {id: 'CAM-INT-DOOR-REV', pos: [0.85, 1.45, -0.1], look: '-z', f: 1100, yh: 760},
};

/** Near clip depth (m) for set polygons that reach behind the camera. */
export const NEAR = 0.12;

/**
 * One projection owner per plate: WORLD-SHOP metres to PLATE px at camera scale 1 (index ST-02 formulas: x = 540 +
 * f·lateral/d, y = y_h + f·(h_eye − y)/d, with lateral = x − cx looking +z, −(x − cx) looking −z, z − cz looking −x).
 */
export type Proj = {
  P: (v: V3) => Pt;
  /** Depth along the view axis (m), clamped to NEAR. */
  depth: (v: V3) => number;
  /** Raw (unclamped) depth, for clipping. */
  rawDepth: (v: V3) => number;
  /** px per metre at the depth of v. */
  k: (v: V3) => number;
  /** World direction drawn toward screen right. */
  right: V3;
  /** Camera position (back-face tests). */
  eye: V3;
  setup?: Setup;
};

export const projector = (s: Setup): Proj => {
  const [cx, cy, cz] = s.pos;
  const rawDepth = ([x, , z]: V3) => (s.look === '+z' ? z - cz : s.look === '-z' ? cz - z : cx - x);
  const depth = (v: V3) => Math.max(NEAR, rawDepth(v));
  const lateral = ([x, , z]: V3) => (s.look === '+z' ? x - cx : s.look === '-z' ? -(x - cx) : z - cz);
  return {
    P: (v) => {
      const d = depth(v);
      return [540 + (s.f * lateral(v)) / d, s.yh + (s.f * (cy - v[1])) / d];
    },
    depth,
    rawDepth,
    k: (v) => s.f / depth(v),
    right: s.look === '+z' ? [1, 0, 0] : s.look === '-z' ? [-1, 0, 0] : [0, 0, 1],
    eye: s.pos,
    setup: s,
  };
};

export const PROJ: Record<SetupId, Proj> = Object.fromEntries(Object.values(SETUPS).map((s) => [s.id, projector(s)])) as Record<SetupId, Proj>;

/**
 * A fixed-plane card (S01-SH01 car plate): every point at one depth, `k` px per metre, world x `x0` and the floor at the
 * screen point `g`. z is ignored (front view).
 */
export const cardProjector = (g: Pt, k: number, x0: number): Proj => ({
  P: ([x, y]) => [g[0] + (x - x0) * k, g[1] - y * k],
  depth: () => 1,
  rawDepth: () => 1,
  k: () => k,
  right: [1, 0, 0],
  eye: [x0, 0, -1e3],
});

// ------------------------------------------------------------------ shot table (index timeline mapping, G ranges)

export type ShotRow = {id: string; g0: number; len: number; setup: SetupId | 'CAM-CAR' | 'CAM-PHONE'};
export const SHOT_ROWS: ShotRow[] = [
  {id: 'S01-SH01', g0: 0, len: 126, setup: 'CAM-CAR'},
  {id: 'S01-SH02', g0: 126, len: 114, setup: 'CAM-FORECOURT'},
  {id: 'S02-SH01', g0: 240, len: 114, setup: 'CAM-COUNTER-IN'},
  {id: 'S02-SH02', g0: 354, len: 90, setup: 'CAM-PHONE'},
  {id: 'S02-SH03', g0: 444, len: 96, setup: 'CAM-COUNTER-OUT'},
  {id: 'S02-SH04', g0: 540, len: 198, setup: 'CAM-GLASS-OUT'},
  {id: 'S02-SH05', g0: 738, len: 54, setup: 'CAM-LOW-SHELF'},
  {id: 'S02-SH06', g0: 792, len: 108, setup: 'CAM-INT-REV'},
  {id: 'S02-SH07', g0: 900, len: 129, setup: 'CAM-GLASS-OUT'},
  {id: 'S02-SH08', g0: 1029, len: 201, setup: 'CAM-LOW-SHELF'},
  {id: 'S02-SH09', g0: 1230, len: 180, setup: 'CAM-GLASS-OUT'},
  {id: 'S02-SH10', g0: 1410, len: 120, setup: 'CAM-LOW-CU'},
  {id: 'S03-SH01', g0: 1530, len: 126, setup: 'CAM-LOW-SHELF'},
  {id: 'S03-SH02', g0: 1656, len: 144, setup: 'CAM-INT-REV'},
  {id: 'S03-SH03', g0: 1800, len: 120, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH04', g0: 1920, len: 42, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH05', g0: 1962, len: 72, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH06', g0: 2034, len: 36, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH07', g0: 2070, len: 90, setup: 'CAM-INT-SIDE'},
  {id: 'S04-SH01', g0: 2160, len: 240, setup: 'CAM-INT-2S'},
  {id: 'S04-SH02', g0: 2400, len: 120, setup: 'CAM-INT-DOOR-REV'},
  {id: 'S04-SH03', g0: 2520, len: 90, setup: 'CAM-GLASS-OUT'},
];
export const SHOT_G0: Record<string, number> = Object.fromEntries(SHOT_ROWS.map((r) => [r.id, r.g0]));
export const TOTAL_FRAMES = 2610;

// ------------------------------------------------------------------ ST-04 ASM-PATH (story clock)

export const STOP = {xs: -0.1, zs: 0.62};
const APPROACH: [number, number, number][] = [[540, 0.3, 2.4], [738, 0.1, 1.6], [792, 0, 1.35], [900, -0.08, 0.8], [920, -0.1, 0.62]];

/** Lurch cycle (30-frame period from G540): 20 eased move frames then a 10-frame hold; returns the path clock. */
const lurchClock = (G: number) => {
  if (G <= 540) return 540;
  const c = Math.floor((G - 540) / 30), u = G - 540 - 30 * c;
  return 540 + 30 * c + 30 * (u < 20 ? ease(u / 20) : 1);
};

export type AsmState = {
  xs: number; zs: number;
  /** True on lurch / push move frames (squeak plays only then). */
  moving: boolean;
  /** Stack-top sway toward +x, radians (ST-04 / CL04 wobble). */
  sway: number;
  /** Metres the cart travelled along the path so far (caster hub rotation). */
  travel: number;
};

/** `S` (stack centre on the floor) at story frame G, with lurch, sway and the S03 pull-back / push-in. */
export const asmAt = (G: number): AsmState => {
  if (G < 920) {
    const L = Math.min(920, lurchClock(G));
    let k = 0;
    while (k < APPROACH.length - 2 && L > APPROACH[k + 1][0]) k++;
    const [g0, x0, z0] = APPROACH[k], [g1, x1, z1] = APPROACH[k + 1];
    const u = clamp01((L - g0) / (g1 - g0));
    const c = Math.floor((G - 540) / 30), m = G - 540 - 30 * c;
    const amp = (G >= 680 && G < 690 ? 5 : 3) * DEG;
    const sway = G < 540 ? 0 : amp * (m < 14 ? 0 : m < 20 ? ease((m - 14) / 6) : 1 - ease((m - 20) / 10));
    const xs = lerp(x0, x1, u), zs = lerp(z0, z1, u);
    return {xs, zs, moving: G >= 540 && m < 20, sway, travel: 2.4 - zs};
  }
  if (G < 930) {
    const m = G - 920;
    return {...STOP, moving: false, sway: 3 * DEG * (1 - ease(m / 10)), travel: 2.4 - STOP.zs};
  }
  // S03-SH06 f6-f30: pulled back 12 cm, the jammed wheel dragging; S03-SH07 f36-f89: pushed in through the door.
  const back = ease(seg(G, 2040, 2064));
  const push = ease(seg(G, 2106, 2159));
  const zs = lerp(lerp(STOP.zs, 0.74, back), -0.45, push);
  const moving = (G >= 2040 && G < 2064) || (G >= 2106 && G < 2159);
  return {xs: STOP.xs, zs, moving, sway: 0, travel: 2.4 - STOP.zs + 0.12 * back + 1.19 * push};
};

// ------------------------------------------------------------------ ST-05 FOG-STATE, ST-06 light, ST-07, ST-09

/** FOG-STATE as a continuous level: 0 FS0, 1 FS1, 2 FS2, 3 FS3 (eased transitions). */
export const fogAt = (G: number) =>
  G < 186 ? 0 : G < 240 ? ease(seg(G, 186, 240)) : G < 246 ? 1 : G < 348 ? 1 + ease(seg(G, 246, 348)) : G < 2526 ? 2 : 2 + ease(seg(G, 2526, 2598));

/** Canopy lamp level 0..1 per lamp index (0, 1 near z 7; 2, 3 far z 11): S04-SH03 dims far f6-f48, near f30-f78. */
export const lampAt = (G: number, i: number) => (i >= 2 ? 1 - ease(seg(G, 2526, 2568)) : 1 - ease(seg(G, 2550, 2598)));

/** Assembly `light` (VD04): 0 until G1806, eased to 1 by G1830. */
export const lightAt = (G: number) => ease(seg(G, 1806, 1830));

/** Torch on (ST-07): G1764-G2410. */
export const torchOnAt = (G: number) => (G >= 1764 && G < 2410 ? 1 : 0);

/** Crouch-to-stand rise on G1640-G1668 (S03-SH01 f110-f138, finished in S03-SH02 f12): 0 crouched, 1 standing. */
export const riseAt = (G: number) => ease(seg(G, 1640, 1668));

/** Door leaf open fraction (ST-07): opening G2082-G2112, closing G2172-G2196. */
export const doorAt = (G: number) => (G < 2172 ? ease(seg(G, 2082, 2112)) : 1 - ease(seg(G, 2172, 2196)));

/** VD17 fog-lens amount A (ST-09). `zs` is the current ASM-PATH depth (S02-SH04 depends on it). */
export const lensAt = (G: number, zs = asmAt(G).zs) => {
  if (G >= 1822) return 0;
  if (G >= 1802) return 1 - ease(seg(G, 1802, 1822));
  if (G >= 540 && G < 738) return 1 + 0.25 * (zs - 1.6);
  if (G >= 1248 && G < 1294) return 1 - 0.3 * (ease(seg(G, 1248, 1256)) - ease(seg(G, 1286, 1294)));
  return 1;
};

/** Pixel-space helpers shared by plates. */
export const ptLerp = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

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
  | 'CAM-COUNTER-OUT' | 'CAM-INT-SIDE' | 'CAM-INT-2S' | 'CAM-INT-DOOR-REV' | 'CAM-GLASS-SWALLOW' | 'CAM-HIGH-WIDE';
export type Setup = {id: SetupId; pos: V3; look: '+z' | '-z' | '-x'; f: number; yh: number};

export const SETUPS: Record<SetupId, Setup> = {
  // SS-R5 (ST-02, WFOG-EP01-SHORT R6): the glass swallow eye inside the glass, and the high wide over the site (level pinhole,
  // horizon shifted to the top of frame by `yh`; no pitch, so the projector below is unchanged).
  'CAM-GLASS-SWALLOW': {id: 'CAM-GLASS-SWALLOW', pos: [-0.3, 1.75, -2.0], look: '+z', f: 850, yh: 595},
  'CAM-HIGH-WIDE': {id: 'CAM-HIGH-WIDE', pos: [-3.5, 20.0, -20.0], look: '+z', f: 900, yh: 330},
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
/** SS-R5.1 (Mark, 30 Oct 2026, on the measured narration): 25 shots, 3766 frames. Lengths and starts per the index shot table. */
export const SHOT_ROWS: ShotRow[] = [
  {id: 'S01-SH01', g0: 0, len: 126, setup: 'CAM-CAR'},
  {id: 'S01-SH02', g0: 126, len: 114, setup: 'CAM-FORECOURT'},
  {id: 'S01-SH02A', g0: 240, len: 120, setup: 'CAM-HIGH-WIDE'},
  // SS-R5.1: the glass swallow 174 f, the counter shot at G534 (+24), the phone 156 f (its list holds from f114).
  {id: 'S02-SH00A', g0: 360, len: 174, setup: 'CAM-GLASS-SWALLOW'},
  {id: 'S02-SH01', g0: 534, len: 96, setup: 'CAM-COUNTER-IN'},
  {id: 'S02-SH02', g0: 630, len: 156, setup: 'CAM-PHONE'},
  {id: 'S02-SH03', g0: 786, len: 96, setup: 'CAM-COUNTER-OUT'},
  {id: 'S02-SH04', g0: 882, len: 198, setup: 'CAM-GLASS-OUT'},
  {id: 'S02-SH05', g0: 1080, len: 54, setup: 'CAM-LOW-SHELF'},
  {id: 'S02-SH06', g0: 1134, len: 108, setup: 'CAM-INT-REV'},
  {id: 'S02-SH07', g0: 1242, len: 129, setup: 'CAM-GLASS-OUT'},
  {id: 'S02-SH08', g0: 1371, len: 201, setup: 'CAM-LOW-SHELF'},
  {id: 'S02-SH09', g0: 1572, len: 180, setup: 'CAM-GLASS-OUT'},
  {id: 'S02-SH10', g0: 1752, len: 120, setup: 'CAM-LOW-CU'},
  {id: 'S03-SH01', g0: 1872, len: 126, setup: 'CAM-LOW-SHELF'},
  {id: 'S03-SH02', g0: 1998, len: 144, setup: 'CAM-INT-REV'},
  {id: 'S03-SH03', g0: 2142, len: 160, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH04', g0: 2302, len: 46, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH05', g0: 2348, len: 100, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH06', g0: 2448, len: 36, setup: 'CAM-GLASS-OUT'},
  // SS-R4 (WFOG-SCRIPT-R5): S03-SH06A is the held look at the lit window plate; SS-R5.1 holds it to 216 f.
  {id: 'S03-SH06A', g0: 2484, len: 216, setup: 'CAM-GLASS-OUT'},
  {id: 'S03-SH07', g0: 2700, len: 206, setup: 'CAM-INT-SIDE'},
  {id: 'S04-SH01', g0: 2906, len: 434, setup: 'CAM-INT-2S'},
  {id: 'S04-SH02', g0: 3340, len: 120, setup: 'CAM-INT-DOOR-REV'},
  {id: 'S04-SH03', g0: 3460, len: 306, setup: 'CAM-GLASS-OUT'},
];
export const SHOT_G0: Record<string, number> = Object.fromEntries(SHOT_ROWS.map((r) => [r.id, r.g0]));
/** Composition length (SS-R5.1): last painted frame G3765 = S04-SH03 f305, hard cut (MK-WF-DEP-07). */
export const TOTAL_FRAMES = 3766;

/**
 * RK-2 story keys (SS-R5.1; supersedes the RK-1 single +297 offset). A shot's story key at shot-local f is its start
 * minus `shift` plus `event(f)`: `event` holds or stretches the event clock where the sheets say so (S03-SH03…S03-SH07 holds,
 * the S04-SH01 talk span). Event clocks (ASM-PATH, FOG-STATE, lamps, `light`, torch, rise, door, FOG-LENS amount, pose, beam)
 * read `storyAt`; ambient motion (fog and halo drift, lens ripple, breath) reads `ambientAt`, which runs straight through holds.
 * Shots without an entry keep G = story key (S01, S02-SH00A, S02-SH02).
 */
const STORY_CLOCK: Record<string, {shift: number; event?: (f: number) => number}> = {
  'S02-SH01': {shift: 24},
  'S02-SH03': {shift: 342}, 'S02-SH04': {shift: 342}, 'S02-SH05': {shift: 342}, 'S02-SH06': {shift: 342}, 'S02-SH07': {shift: 342},
  'S02-SH08': {shift: 342}, 'S02-SH09': {shift: 342}, 'S02-SH10': {shift: 342}, 'S03-SH01': {shift: 342}, 'S03-SH02': {shift: 342},
  'S03-SH03': {shift: 342, event: (f) => Math.min(f, 119)},
  'S03-SH04': {shift: 382, event: (f) => Math.min(f, 41)},
  'S03-SH05': {shift: 386, event: (f) => Math.min(f, 71)},
  'S03-SH06': {shift: 414},
  'S03-SH06A': {shift: 414, event: (f) => Math.min(f, 119)},
  // S03-SH07: held at 2261 (f72–f127: glance, brows and occupant held), then the r9b story from 2262 (leaf f128, push f152).
  'S03-SH07': {shift: 510, event: (f) => (f < 72 ? f : f < 128 ? 71 : f - 56)},
  // S04-SH01: the talk span f138–f433 stretched over the story 2478–2670 (only the mouth windows and the push move there).
  'S04-SH01': {shift: 566, event: (f) => (f < 138 ? f : 138 + ((f - 138) * 192) / 296)},
  'S04-SH02': {shift: 670},
  'S04-SH03': {shift: 670},
};
const storyBase = (id: string) => SHOT_G0[id] - (STORY_CLOCK[id]?.shift ?? 0);
/** Event story key of shot `id` at shot-local frame f (SHOT_G0 holds composition starts). */
export const storyAt = (id: string, f: number) => storyBase(id) + (STORY_CLOCK[id]?.event ? STORY_CLOCK[id].event!(f) : f);
/** Ambient clock of shot `id` at shot-local frame f: continuous through holds (fog drift, lens ripple, breathing). */
export const ambientAt = (id: string, f: number) => storyBase(id) + f;

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
  // S03-SH06 f6-f30: pulled back 12 cm, the jammed wheel dragging; held at 0.74 through S03-SH06A; S03-SH07 f96-f149 (SS-R4):
  // pushed in through the door, G2286-G2339.
  const back = ease(seg(G, 2040, 2064));
  const push = ease(seg(G, 2286, 2339));
  const zs = lerp(lerp(STOP.zs, 0.74, back), -0.45, push);
  const moving = (G >= 2040 && G < 2064) || (G >= 2286 && G < 2339);
  return {xs: STOP.xs, zs, moving, sway: 0, travel: 2.4 - STOP.zs + 0.12 * back + 1.19 * push};
};

// ------------------------------------------------------------------ ST-05 FOG-STATE, ST-06 light, ST-07, ST-09

/**
 * Monotone cubic (PCHIP, Fritsch–Carlson interior slopes) through sorted [x, y] keys, zero slope at both ends: the value is
 * flat before the first key and after the last, and does not overshoot between keys.
 */
export const pchip = (keys: [number, number][], x: number): number => {
  const n = keys.length;
  if (x <= keys[0][0]) return keys[0][1];
  if (x >= keys[n - 1][0]) return keys[n - 1][1];
  const h = keys.slice(1).map((k, i) => k[0] - keys[i][0]);
  const d = keys.slice(1).map((k, i) => (k[1] - keys[i][1]) / h[i]);
  const m = keys.map(() => 0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  let k = 0;
  while (k < n - 2 && x > keys[k + 1][0]) k++;
  const t = (x - keys[k][0]) / h[k], t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * keys[k][1] + (t3 - 2 * t2 + t) * h[k] * m[k] + (-2 * t3 + 3 * t2) * keys[k + 1][1] + (t3 - t2) * h[k] * m[k + 1];
};

/**
 * S02-SH00A fog front keys (ST-05, SS-R5.1): F (m from the glass along +z, WORLD-SHOP) at story frame G, PCHIP through the
 * keys (flat before G390, held at 1.8 from G516). The car far face (z 6.0) goes at G454, its flank (z 4.2) at G490.
 */
const FRONT_KEYS: [number, number][] = [[390, 14.0], [420, 11.0], [434, 9.3], [446, 7.0], [454, 6.0], [490, 4.2], [510, 2.0], [516, 1.8]];
export const frontAt = (G: number) => pchip(FRONT_KEYS, G);

/**
 * FOG-STATE as a continuous level: 0 FS0, 1 FS1, 2 FS2, 3 FS3. S02-SH00A (ST-05, SS-R5.1): G360–G516 is the front, level
 * 2·(14.0 − F)/12.2 (2 once F is 1.8 at G516); FS2 from G516; FS2→FS3 G2802–G3068 (S04-SH03 f12–f278). The level drives only
 * the veil and haze of the outside plate (never a global fade).
 */
export const fogAt = (G: number) =>
  G < 360 ? 0 : G < 516 ? 2 * (14 - frontAt(G)) / 12.2 : G < 2802 ? 2 : 2 + ease(seg(G, 2802, 3068));

/**
 * Canopy lamp level 0..1 per lamp index (LAMPS in outside.ts: 0 near-left and 1 near-right at z 7; 2, 3 far at z 11).
 * S04-SH03 on the story key 2790 + f (SS-R5.1, sheet sc04): far pair dims f12–f120; near-left to nothing f100–f220;
 * near-right to 0.35 over f100–f220, held to f260, out f260–f278 (the last light, after the line ends at f254).
 */
export const lampAt = (G: number, i: number) => {
  if (i >= 2) return 1 - ease(seg(G, 2802, 2910));
  if (i === 0) return 1 - ease(seg(G, 2890, 3010));
  return (1 - 0.65 * ease(seg(G, 2890, 3010))) * (1 - ease(seg(G, 3050, 3068)));
};

/** Assembly `light` (VD04): 0 until G1806, eased to 1 by G1830. */
export const lightAt = (G: number) => ease(seg(G, 1806, 1830));

/** Torch on (ST-07): G1764-G2680 (SS-R4: off at S04-SH02 f10). */
export const torchOnAt = (G: number) => (G >= 1764 && G < 2680 ? 1 : 0);

/** Crouch-to-stand rise on G1640-G1668 (S03-SH01 f110-f138, finished in S03-SH02 f12): 0 crouched, 1 standing. */
export const riseAt = (G: number) => ease(seg(G, 1640, 1668));

/** Door leaf open fraction (ST-07, SS-R4): opening G2262-G2292 (S03-SH07 f72-f102), closing G2352-G2376 (S04-SH01 f12-f36). */
export const doorAt = (G: number) => (G < 2352 ? ease(seg(G, 2262, 2292)) : 1 - ease(seg(G, 2352, 2376)));

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

// EDU-EP18-SHORT snake and dog movement per shot (Boss W5, 16 Nov 2026; sheet EDU-EP18-SHEETS-R1.0 item B2). Selected by shot ID; every value
// is a pure function of the shot-local frame L (seek-safe). Uses the user-approved kit snake (kit/snake.ts AS-SNAKE-R1, unchanged: states lie,
// head-lift + tongue, slither) and the EP18 dog copy (dog.ts `drawDog18`, now with `lick`).
//
// Snake (set F, paddy.ts: bund top y 0.35, half width 0.45; LF02B snake centre x -0.08, heading 0 = head at +x, headYaw + turns the head to
// -z, toward her):
//   B04-SH02  lie, still: the LF02B pose (head turned toward her, neck barely raised).
//   B04-SH03  head lift 0.02 -> 0.10 m L6-20 and a further turn toward her raised foot; tongue flicks L24-30 and L54-60.
//   B04-SH04  head lowers L8-20; slither L20-60 along +x off the bund's +x edge into the rice (paddy entry: the front slides down the bund
//             side and is cut at the paddy water, `SNAKE_WATER_Y`), the tail clears the bund top by L60; ripple line L60-80 at the entry.
//             The world advance follows the kit's planted-contact rule (the path is fixed in the world), so the body does not skate.
// Dog: `DOG18_LICK(L)` (`new: lick`): tongue out L2-8 of B04-SH01 (peak L4-6), the only contact.
import {buildSnake, SNAKE, type SnakePose} from '../kit/snake';
import type {Build, L3} from '../survival/beast';
import type {V3} from '../kit/space';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a: number, b: number, t: number) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
const bump = (a: number, b: number, t: number) => Math.sin(Math.PI * clamp((t - a) / (b - a)));

/** LF02B snake placement (looks-cams.ts LF02B_SNAKE): centre (x, z), heading 0, on the bund top. */
export const SNAKE_AT: [number, number] = [-0.08, 0];
export const SNAKE_GROUND = 0.35;
/** Paddy water beside the bund (the bund side face meets it at x +-0.75, y 0.1); the diving body is cut here. */
export const SNAKE_WATER_Y = 0.1;
/** The snake leaves the bund top here (x, world) and slides down the side face (0.25 m drop over 0.3 m) into the water. */
export const SNAKE_DIVE_X = 0.7;

/** Path integral Q(tau) of the kit's slither path (s forward, l left), for the planted-contact world advance. */
const pathQ = (tau: number, amp: number) => {
  const A = SNAKE.yawAmp * amp, lam = SNAKE.lambda, n = Math.max(1, Math.ceil(tau / 0.004));
  let s = 0, l = 0;
  for (let i = 0; i < n; i++) { const t = (i + 0.5) * (tau / n), y = A * Math.sin((2 * Math.PI * t) / lam); s += Math.cos(y) * (tau / n); l += Math.sin(y) * (tau / n); }
  return [s, l];
};
/**
 * World placement for a slither of `travel` metres along the path: buildSnake re-centres the body on its midpoint, so a body point keeps its
 * world place only if the placement moves by Q(travel + L/2) - Q(L/2) (heading 0: s -> +x, l -> -z). Returns [x, z].
 */
export const slitherAt = (travel: number, amp = 1.15, at0: [number, number] = SNAKE_AT): [number, number] => {
  const h = SNAKE.len / 2, a = pathQ(travel + h, amp), b = pathQ(h, amp);
  return [at0[0] + (a[0] - b[0]), at0[1] - (a[1] - b[1])];
};

/** Lowers every point of a heading-0 build that lies beyond world x `diveX` down the bund side (and on, below the water): the paddy entry. */
export const diveBuild = (B: Build, atX: number, diveX = SNAKE_DIVE_X, slope = 0.25 / 0.3): Build => {
  const f = (q: L3): L3 => { const x = atX + q[0]; return x > diveX ? [q[0], q[1] - (x - diveX) * slope, q[2]] : q; };
  return {...B, parts: B.parts.map((pt) => ({...pt, keys: pt.keys.map((k) => ({...k, p: f(k.p)}))})), flats: B.flats.map((fl) => ({...fl, pts: fl.pts.map(f)}))};
};

export type SnakeShotState = {
  pose: SnakePose; build: Build;
  /** BeastPlace for paintSnake: at (x, z), heading, ground and (B04-SH04) the water cut */
  place: {at: [number, number]; heading: number; ground: number; waterline?: number};
  /** paddy-entry ripple rings (radius m) round `rippleAt` */
  ripples: number[]; rippleAt: V3;
  /** false once the whole body is under the water */
  visible: boolean;
};
const LIE: SnakePose = {headYaw: 0.6, lift: 0.15};
const place = (at: [number, number], waterline?: number) => ({at, heading: 0, ground: SNAKE_GROUND, ...(waterline !== undefined ? {waterline} : {})});
const still = (pose: SnakePose, at: [number, number] = SNAKE_AT): SnakeShotState => ({pose, build: buildSnake(pose), place: place(at), ripples: [], rippleAt: [SNAKE_DIVE_X + 0.3, SNAKE_WATER_Y, 0], visible: true});

/** B04-SH03 head lift and turn, with two tongue flicks (shot-local frames). */
export const snakeHeadLift = (L: number): SnakePose => {
  const k = sm(6, 20, L);
  return {lift: 0.15 + (0.6 - 0.15) * k, headYaw: 0.6 + 0.3 * k, headPitch: -0.05 * k, tongue: Math.max(bump(24, 30, L), bump(54, 60, L))};
};
/** B04-SH04 slither: speed (m/s) and travel (m) from L20 (eased in over 6 frames); the tail clears the dive point by about L60. */
export const SNAKE_SLIDE = {from: 20, ease: 6, speed: 1.2, amp: 1.15} as const;
export const snakeTravel = (L: number) => {
  const {from, ease, speed} = SNAKE_SLIDE, x = Math.max(0, L - from), v = speed / 30;
  return x <= ease ? (v * x * x) / (2 * ease) : v * (ease / 2 + (x - ease));
};
const B04_SH04 = (L: number): SnakeShotState => {
  const d = snakeTravel(L), down = sm(8, 20, L);
  const pose: SnakePose = {travel: d, amp: 1 + (SNAKE_SLIDE.amp - 1) * sm(16, 24, L), lift: 0.6 * (1 - down), headYaw: 0.9 * (1 - down), tongue: bump(30, 36, L)};
  const at = slitherAt(d, pose.amp ?? 1);
  const B = diveBuild(buildSnake(pose), at[0]);
  // world x of the tail tip: the last point to leave the bund top
  const tailX = at[0] + Math.min(...B.parts[0].keys.map((k) => k.p[0]));
  const entry = sm(56, 62, L), r0 = Math.max(0, L - 60);
  return {pose, build: B, place: place(at, SNAKE_WATER_Y), ripples: entry > 0 ? [0.05 + 0.012 * r0, 0.02 + 0.009 * r0, 0.006 * Math.max(0, r0 - 6)].filter((r) => r > 0.01 && r < 0.45) : [], rippleAt: [SNAKE_DIVE_X + 0.32, SNAKE_WATER_Y, at[1]], visible: tailX < SNAKE_DIVE_X + (SNAKE_GROUND - SNAKE_WATER_Y) / (0.25 / 0.3) + 0.05};
};
export const SNAKE_SHOTS: Record<string, (L: number) => SnakeShotState> = {
  'B04-SH02': () => still(LIE),
  'B04-SH03': (L) => still(snakeHeadLift(L)),
  'B04-SH04': B04_SH04,
};
export const SNAKE_SHOT_IDS = Object.keys(SNAKE_SHOTS);

/** `new: lick` for drawDog18 (B04-SH01): tongue out L2-8 (reaches full at L4, holds to L6, back in by L8); 0 outside. */
export const DOG18_LICK = (L: number, from = 2, to = 8) => {
  const span = to - from, a = (L - from) / span;
  return a <= 0 || a >= 1 ? 0 : Math.min(1, sm(0, 1 / 3, a) * (1 - sm(2 / 3, 1, a)) * 1.0001);
};

import {BONE, legScale, shoulderPoint, type CastDef, type FigPose} from './cast';
import {EXPRESSIONS, type ExpressionId} from './expressions';
import type {FaceState} from './head';
import {hash} from './hash';
import type {Pt} from './painter';
import {PEOPLE, type PersonId} from './people';
import {poseFor, poseMix, type AnyPoseId, type PoseFigure, type View} from './poses';
import {sitFootOffset} from './legs';
import {dress, type OutfitId} from './wardrobe';

// Motion presets for the painted kit: a motion is a PURE function of shot-local time (seconds = frame / fps) that returns a
// frame delta (body fields, arms from the pose library, a face, a root offset). A shot picks a stable `MotionId`, then layers it
// on a person, an expression and a base pose with `layerMotion`, and hands the result to `drawFigure`. Added 1 Nov 2026 (pose
// library pass 2). Reel: `KIT-MOTIONS` (one motion per timeline scene, labelled). Poses: `poses.ts` (P01-P45).
//
//   const f = layerMotion({person: 'man-parted', outfit: 'office', motion: 'walk-in-from-left', t: frame / fps, g, unit});
//   drawFigure(p, f.def, f.g, unit, f.pose, frame / fps, f.seed);
//
// Rules (they keep the motion library deterministic and cache-safe)
// - No Math.random, no Date, no module state: the same `(id, t, ctx)` always gives the same frame. Blinking stays the rig's own
//   clock (pass the shot time as `t` to drawFigure). Lip flap is a seeded syllable envelope unless the caller gives `amp`.
// - Non-looping motions hold their last frame past `duration`; looping ones are periodic in `duration` (use `t % duration`).
// - Rig limits apply: front, left and right views only, no 3/4 view. A turn is a head swap (front <-> profile head at the middle
//   of `turn-head-*`) or a cut between body views. Walks and runs are profile views the motion picks (`from-left` faces right).
// - Offsets are metres from the shot's rest point `g` (x right, y up), scaled by person height, so a walk does not skate:
//   the walk phase is the distance travelled over the person's step length (1.1 m per cycle for a 1.7 m adult) and the stride
//   amplitude (`FigPose.stride`) follows the speed, so a walk-in settles into standing without a pop.
// - Fields combine like this: `lean`, `rise`, `lift`, `headCock` and `nod` ADD to the base pose; `crouch`, `bend`, `walk`, `stride`, `sit`,
//   `floorSit`, `kneel`, `squat`, `run` and `head` REPLACE. The arms of a motion (`arms`) replace the base pose's arms, hung
//   from the body the motion makes; an arm the motion leaves alone keeps the base pose's arm, moved with the shoulder.
// - `lean` is toward the SCREEN RIGHT in every view, profile too (the rig's convention): a lean forward in a profile is `dir * lean`
//   with dir = +1 facing right, -1 facing left.

export const MOTION_IDS = [
  'idle-breathe', 'walk-in-from-left', 'walk-in-from-right', 'walk-out-to-left', 'walk-out-to-right', 'run-left-to-right', 'run-right-to-left',
  'nod', 'shake-head', 'startle-jump', 'look-around', 'turn-head-left', 'turn-head-right', 'turn-head-to-camera', 'shiver',
  'sit-down', 'stand-up', 'point-and-say', 'gasp-recoil', 'talk', 'kneel-down', 'stand-from-kneel', 'crouch-hide', 'hood-pull', 'coin-count', 'eat-chew',
  'zero-g-drift', 'pat-check', 'rail-tow',
] as const;
export type MotionId = (typeof MOTION_IDS)[number];

/** A pose id, or `'base'`: the pose the caller layers the motion on (default P01). */
export type PoseRef = AnyPoseId | 'base';

export type MotionBody = {
  /** Added to the base pose. */
  lean?: number;
  rise?: number;
  lift?: number;
  nod?: Pt;
  /** Head cock, degrees toward screen right (`FigPose.headCock`); added to the base pose's. */
  headCock?: number;
  /** Replace the base pose's value. */
  crouch?: number;
  bend?: number;
  walk?: number;
  stride?: number;
  sit?: number;
  floorSit?: number;
  kneel?: number;
  squat?: number;
  run?: number;
  head?: 'front' | 'left' | 'right';
};

/** One arm placed by hand (metres from its shoulder, screen right / up; in a profile `x` is toward the facing side, as the pose tables). `near`
 * (m): how far the glove sits toward the lens, for the glove growth (`paintEva`, capped 1.3x). */
export type Reach = {to: Pt; via: Pt; near?: number};

export type MotionFrame = {
  /** Body view the motion needs (a walk is a profile). Default: the caller's view. */
  view?: View;
  /** Root offset from the rest point, metres (x right, y up), already scaled by `ctx.k`. */
  offset?: Pt;
  body?: MotionBody;
  /** Both arms and the body fields from pose `a` blended into `b` by `u` (`poseMix`). Omitted = the base pose's arms. */
  arms?: {a: PoseRef; b?: PoseRef; u?: number};
  /** Arms authored per side, replacing the pose's arm on that side (hung from the shoulder of the body the motion makes; scaled by `armScale`). */
  reach?: {r?: Reach; l?: Reach};
  /** Whole-card roll about the hips, degrees (positive = head toward screen right) for a floating figure (`paintFigureAt` / `paintEva` `roll`). */
  roll?: number;
  /** Replaces the layered expression. */
  face?: ExpressionId | FaceState;
  /** Eye look [x, y] (screen right and up positive), over whatever face is in force. */
  look?: Pt;
  /** Mouth open 0..1 on the `talk` mouth, over whatever face is in force. */
  talk?: number;
  /** Near cheek bulge 0..1 (`FaceState.chew`): the cheek swells in profile and 3/4 views, over whatever face is in force. */
  chew?: number;
  /** Hood travelling up 0..1 (back view; `FigPose.hoodRise`, 1 = hood up). The outfit needs a hood (`gear.collar.kind` `hood`). */
  hood?: number;
};

export type MotionCtx = {
  /** The body view the shot asks for (a motion may override it with `MotionFrame.view`). */
  view: View;
  /** Person height / 1.7: scales speeds, hops and offsets. */
  k: number;
  /** Leg length / the 1.7 m adult's (`legScale`), for motions whose feet must stay put while the root moves; `k` when absent. */
  legK?: number;
  /** Seeds the syllable envelope. */
  seed: number;
  /** Travel distance in metres for walk-in/out and run (default per motion). */
  distance?: number;
  /** Mouth openness 0..1 at shot time `t` (e.g. `(t) => mouthAt(amplitude, t * fps)`); the seeded syllable envelope when absent. */
  amp?: (t: number) => number;
};

export type Motion = (t: number, c: MotionCtx) => MotionFrame;

export type MotionInfo = {
  name: string;
  description: string;
  /** Natural length in seconds (walks and runs: with the default distance). */
  duration: number;
  /** True: periodic in `duration`. False: holds the last frame. */
  loop: boolean;
  /** Body views the motion is designed for. */
  views: View[];
  /** A prop the shot has to draw with it (`drawChair` for sit-down and stand-up). */
  prop?: 'chair';
  use: string;
};

// ------------------------------------------------------------------ easing

export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
/** Smoothstep 0..1. */
export const smooth = (u: number) => u * u * (3 - 2 * u);
/** Eased 0 -> 1 between times `a` and `b`. */
export const seg = (t: number, a: number, b: number) => smooth(clamp01((t - a) / (b - a)));
/** 0 -> 1 -> 0 between `a` and `b` (a sine hump). */
export const hump = (t: number, a: number, b: number) => Math.sin(Math.PI * clamp01((t - a) / (b - a)));
/** Piecewise-smooth value through `[time, value]` keys (held before the first and after the last). */
export const keys = (t: number, ks: readonly (readonly [number, number])[]): number => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) return ks[i - 1][1] + (ks[i][1] - ks[i - 1][1]) * smooth((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0]));
  }
  return ks[ks.length - 1][1];
};

/**
 * Mouth openness 0..1 of a seeded speech-like syllable envelope: about 5 syllables a second in words of 4, a pause after some
 * words, a level per syllable. Deterministic in `(t, seed)`.
 */
export const syllableOpen = (t: number, seed: number): number => {
  if (t < 0) return 0;
  const SL = 0.2, i = Math.floor(t / SL), f = t / SL - i;
  if (i % 4 === 3 && hash(seed + Math.floor(i / 4) * 31 + 7) < 0.3) return 0; // a pause after some words
  const level = 0.35 + 0.65 * hash(seed * 3 + i * 13.7);
  return Math.pow(Math.sin(Math.PI * f), 0.6) * level;
};

// ------------------------------------------------------------------ travel

const WALK_SPEED = 1.2, WALK_STEP = 1.1, WALK_BRAKE = 0.5, WALK_ACCEL = 0.4; // m/s, m per cycle (1.7 m person), s, s
const RUN_SPEED = 3.4, RUN_STEP = 1.3; // m/s, m per cycle (1.7 m person)
const WALK_DISTANCE = 2.2, RUN_DISTANCE = 5;

/** Cruise, then brake linearly to rest after `L` metres: position, speed and total time. */
const brake = (t: number, L: number, v0: number, Td: number) => {
  const Tb = Math.min(Td, (2 * L) / v0), Tc = Math.max(0, L / v0 - Tb / 2), tt = Math.max(0, Math.min(t, Tc + Tb));
  if (tt <= Tc) return {p: v0 * tt, v: v0, D: Tc + Tb};
  const tau = tt - Tc;
  return {p: v0 * Tc + v0 * (tau - (tau * tau) / (2 * Tb)), v: v0 * (1 - tau / Tb), D: Tc + Tb};
};
/** Start from rest, accelerate linearly, cruise until `L` metres: position, speed and total time. */
const launch = (t: number, L: number, v0: number, Ta: number) => {
  const Tl = Math.min(Ta, (2 * L) / v0), D = L / v0 + Tl / 2, tt = Math.max(0, Math.min(t, D));
  if (tt < Tl) return {p: (v0 * tt * tt) / (2 * Tl), v: (v0 * tt) / Tl, D};
  return {p: v0 * (tt - Tl / 2), v: v0, D};
};
const walkTime = (c: Pick<MotionCtx, 'k' | 'distance'>, kind: 'in' | 'out') => {
  const L = c.distance ?? WALK_DISTANCE, v0 = WALK_SPEED * c.k;
  return kind === 'in' ? brake(0, L, v0, WALK_BRAKE).D : launch(0, L, v0, WALK_ACCEL).D;
};
const runTime = (c: Pick<MotionCtx, 'k' | 'distance'>) => (c.distance ?? RUN_DISTANCE) / (RUN_SPEED * c.k);

const walkIn = (dir: 1 | -1): Motion => (t, c) => {
  // dir 1: enters from the screen left, facing and travelling right, and stops at the rest point.
  const L = c.distance ?? WALK_DISTANCE, v0 = WALK_SPEED * c.k, {p, v} = brake(t, L, v0, WALK_BRAKE);
  return {view: dir > 0 ? 'right' : 'left', offset: [-dir * (L - p), 0], body: {walk: p / (WALK_STEP * c.k), stride: v / v0}};
};
const walkOut = (dir: 1 | -1): Motion => (t, c) => {
  // dir 1: leaves toward the screen right, from the rest point.
  const L = c.distance ?? WALK_DISTANCE, v0 = WALK_SPEED * c.k, {p, v} = launch(t, L, v0, WALK_ACCEL);
  return {view: dir > 0 ? 'right' : 'left', offset: [dir * p, 0], body: {walk: p / (WALK_STEP * c.k), stride: v / v0}};
};
const runAcross = (dir: 1 | -1): Motion => (t, c) => {
  // Centred on the rest point: starts L/2 before it and ends L/2 past it.
  const L = c.distance ?? RUN_DISTANCE, p = Math.min(L, (t * L) / runTime(c));
  return {view: dir > 0 ? 'right' : 'left', offset: [dir * (p - L / 2), 0], body: {run: p / (RUN_STEP * c.k), lean: 0.14 * dir}};
};

// ------------------------------------------------------------------ two-bone reach (zero-g motions)

const mirror = ([x, y]: Pt): Pt => [-x, y];
/** An arm to hand target `to` (metres from the shoulder, x right/forward, y up) with both bones exactly `BONE`: the hand is pulled back to
 * 0.998 of full reach when out of range. `bend` +1 puts the elbow on the counter-clockwise side of the shoulder-hand line, -1 clockwise. */
export const twoBone = (to: Pt, bend: 1 | -1, near?: number): Reach => {
  const d0 = Math.hypot(to[0], to[1]), d = Math.min(d0, 2 * BONE * 0.998) || 1e-6, s = d / (d0 || 1);
  const h: Pt = [to[0] * s, to[1] * s], half = d / 2, drop = Math.sqrt(Math.max(0, BONE * BONE - half * half));
  const n: Pt = [-h[1] / d, h[0] / d];
  const r = (v: number) => Math.round(v * 1e4) / 1e4;
  return {to: [r(h[0]), r(h[1])], via: [r(h[0] / 2 + bend * drop * n[0]), r(h[1] / 2 + bend * drop * n[1])], ...(near ? {near} : {})};
};
/** One arm from a target given for the character's RIGHT arm; the left arm is its mirror image (x of every point negated). */
const sideReach = (side: 'r' | 'l', to: Pt, bend: 1 | -1, near?: number): Reach => {
  const m = twoBone(to, bend, near);
  return side === 'r' ? m : {...m, to: mirror(m.to), via: mirror(m.via)};
};
const capLen = (v: Pt, max: number): Pt => { const L = Math.hypot(v[0], v[1]); return L > max ? [(v[0] * max) / L, (v[1] * max) / L] : v; };

/** Zero-g neutral arm numbers (= `ZG_NEUTRAL` in `eva.ts`, pose P46): elbow, hand and glove depth for the character's `side`. */
const zgArm = (side: 'r' | 'l'): Reach => { const s = side === 'r' ? -1 : 1; return {via: [s * 0.04, -0.25], to: [-s * 0.03, -0.41], near: 0.32}; };

/** Zero-g drift: period (s) of the slow loop; every term is a whole number of cycles in it. */
const ZG_PERIOD = 6;

// ------------------------------------------------------------------ the motions

const turnHead = (dir: 'left' | 'right'): Motion => (t) => {
  const g = dir === 'left' ? -1 : 1;
  // The eyes lead (0.3-0.5 s), the head swaps to the profile at 0.55 s and stays.
  return {look: [g * 0.9 * seg(t, 0.3, 0.5) * (t < 0.55 ? 1 : 0), 0], body: {head: t < 0.55 ? 'front' : dir, nod: [t < 0.55 ? g * 0.05 * seg(t, 0.3, 0.55) : 0, 0]}};
};

// Filed from EDU-EP04 (KIT-P01): the hand dips from the purse to the counter once every 7 frames (0.233 s), one coin per dip.
const coinCount: Motion = (t) => {
  const f = t * 30, dip = smooth(Math.max(0, 1 - Math.abs(((((f - 1) % 7) + 7) % 7) - 3.5) / 3.5));
  return {arms: {a: 'P01', b: 'P25', u: 1}, body: {rise: 0.01 * dip}};
};

// EDU-EP08 B4-B6 (kit intake, Boss pass A, 8 Nov 2026): weightless figures. They pair with `paintEva` / `paintFigureAt` (`roll`, no shadow).

const zeroGDrift: Motion = (t) => {
  const w = (2 * Math.PI * t) / ZG_PERIOD, w2 = 2 * w, w3 = 3 * w;
  const drift = (side: 'r' | 'l', ph: number): Reach => {
    const z = zgArm(side), sgn = side === 'r' ? 1 : -1;
    const to = capLen([z.to[0] + sgn * 0.022 * Math.sin(w + ph) + 0.01 * Math.sin(w3 + ph), z.to[1] + 0.025 * Math.sin(w2 + ph + 1) ], 0.46);
    const via = capLen([z.via[0] + 0.012 * Math.sin(w + ph + 2), z.via[1] + 0.014 * Math.sin(w2 + ph)], 0.255);
    return {to, via, near: z.near};
  };
  return {
    offset: [0.012 * Math.sin(w + 0.6), 0.03 * Math.sin(w)],
    roll: 2.6 * Math.sin(w + 1.1) + 0.8 * Math.sin(w3),
    reach: {r: drift('r', 0), l: drift('l', 2.1)},
    body: {crouch: 0.22 + 0.035 * Math.sin(w2 + 0.4), lean: 0.012 * Math.sin(w + 2.2), rise: 0.004 * (1 - Math.cos(w2)), nod: [0.01 * Math.sin(w + 0.5), 0.015 * Math.sin(w2 - 0.6)], headCock: 1.2 * Math.sin(w + 0.2)},
  };
};

// The self-check (storyboard S01-B02-SH01): both gloves pat the chest at 0.4 and 0.8 s, the right glove goes to the left upper arm at 1.4 s and
// the left glove to the right upper arm at 1.9 s (two taps each), the shoulders drop 0.02 m on the breath out at 2.4 s. Hands are authored from
// the shoulders (chest centre 0.176 m toward the body line for the EVA shoulder; the near depth tucks the elbows), two-bone exact.
const PAT_CHEST: Pt = [0.17, -0.19], PAT_ARM: Pt = [0.4, -0.1];
const patPulse = (t: number, at: number) => Math.exp(-(((t - at) / 0.09) ** 2)); // a tap: the hand is in contact at `at`, 0.14 s wide
const patCheck: Motion = (t) => {
  const chest = seg(t, 0.05, 0.3) * (1 - seg(t, 1.0, 1.25)), tap = patPulse(t, 0.4) + patPulse(t, 0.8);
  const arm = (side: 'r' | 'l', tOn: number, tOff: number, taps: number[]): Reach => {
    const z = zgArm(side), u = chest, v = seg(t, tOn - 0.3, tOn) * (1 - seg(t, tOff, tOff + 0.3));
    const dip = taps.reduce((a, at) => a + patPulse(t, at), 0);
    const toC: Pt = [PAT_CHEST[0] + 0.045 * (1 - tap * 0.9) * u - 0.02 * tap, PAT_CHEST[1] + 0.02 * (1 - tap)];
    const toA: Pt = [PAT_ARM[0] + 0.05 * (1 - dip), PAT_ARM[1] + 0.025 * (1 - dip)];
    const rest: Reach = {via: z.via, to: z.to, near: z.near}, c = sideReach(side, toC, -1, 0.1), a = sideReach(side, toA, -1, 0.16);
    const mix = (p: Reach, q: Reach, k: number): Reach => ({to: [p.to[0] + (q.to[0] - p.to[0]) * k, p.to[1] + (q.to[1] - p.to[1]) * k], via: [p.via[0] + (q.via[0] - p.via[0]) * k, p.via[1] + (q.via[1] - p.via[1]) * k], near: (p.near ?? 0) + ((q.near ?? 0) - (p.near ?? 0)) * k});
    return mix(mix(rest, c, u), a, v);
  };
  // the chest taps come first; each arm then leaves the chest for the opposite upper arm (the glove crosses the body)
  return {
    reach: {r: arm('r', 1.4, 1.95, [1.55, 1.8]), l: arm('l', 1.9, 2.45, [2.05, 2.3])},
    face: t < 1.5 ? 'worried' : 'neutral',
    body: {crouch: 0.22, rise: -0.02 * hump(t, 2.2, 2.9), nod: [0, -0.04 * hump(t, 2.2, 2.9)]},
    roll: 1.2 * Math.sin(t * 2.1),
  };
};

// Hand-over-hand tow along a handrail (storyboard S01-B05-SH01). The figure travels in the direction it faces (view right = screen right).
// The near hand holds a target wrist behind the body (the caller places the towed person's wrist at this glove's anchor, so the lock is exact);
// the far hand works the rail: one grip stays planted in the world while the body slides toward it (pull), then the hand lets go and re-grips
// one stroke ahead (release). Constants are for a 1.7 m person and scale with `k`.
const TOW_PERIOD = 0.7, TOW_STROKE = 0.34, TOW_PULL = 0.62, TOW_REACH = 0.44;
export const TOW_GRAB_SEC = 0.2; // the wrist-hand closes on the target at 6 frames (30 fps)
const railTow = (dir: 1 | -1): Motion => (t, c) => {
  const k = c.k, A = TOW_STROKE * k, n = Math.floor(t / TOW_PERIOD), ph = (t - n * TOW_PERIOD) / TOW_PERIOD;
  const prog = n * A + A * (0.88 * seg(ph, 0, TOW_PULL) + 0.12 * seg(ph, TOW_PULL, 1)); // body advance, metres: slides to the planted grip, coasts in the release
  const gripX = n * A + TOW_REACH * k; // the planted grip (world x from the rest point, metres) until the release re-grips one stroke ahead
  const rel = gripX - prog + (ph < TOW_PULL ? 0 : A * seg(ph, TOW_PULL, 1)); // grip relative to the shoulder, toward the facing side
  const rail = twoBone([rel, -0.14 + 0.05 * hump(ph, TOW_PULL, 1)], 1, 0.05); // the rail is at chest height (under the helmet ring); the hand rises off it a little while it travels
  const to0: Pt = [-0.5 * k, -0.2 * k], to1: Pt = [-0.46 * k, -0.12 * k], w0 = twoBone(to0, -1, 0.2), w1 = twoBone(to1, -1, 0.2), g = seg(t, 0, TOW_GRAB_SEC);
  const lerp2 = (p: Pt, q: Pt): Pt => [p[0] + (q[0] - p[0]) * g, p[1] + (q[1] - p[1]) * g];
  const hold: Reach = {to: lerp2(w0.to, w1.to), via: lerp2(w0.via, w1.via), near: 0.2}; // reaches back to the wrist and closes on it at 6 frames
  return {
    view: dir > 0 ? 'right' : 'left',
    offset: [dir * prog, 0],
    reach: dir > 0 ? {r: hold, l: rail} : {l: hold, r: rail}, // the near arm (r facing right, l facing left) holds the wrist, the far arm works the rail
    roll: 3 * dir, // constant: a roll that changed would move a planted grip
    body: {crouch: 0.22, lean: 0.1 * dir, nod: [0, 0.02]},
  };
};

export const MOTIONS: Record<MotionId, Motion> = {
  'zero-g-drift': zeroGDrift,
  'pat-check': patCheck,
  'rail-tow': (t, c) => railTow(c.view === 'left' ? -1 : 1)(t, c),
  'coin-count': coinCount,
  'idle-breathe': (t) => {
    const w = (2 * Math.PI * t) / 3;
    return {body: {rise: 0.004 * (1 - Math.cos(w)), lean: 0.006 * Math.sin(w + 1.1), nod: [0, 0.012 * Math.sin(w - 0.6)]}};
  },
  'walk-in-from-left': walkIn(1),
  'walk-in-from-right': walkIn(-1),
  'walk-out-to-left': walkOut(-1),
  'walk-out-to-right': walkOut(1),
  'run-left-to-right': runAcross(1),
  'run-right-to-left': runAcross(-1),
  nod: (t) => ({body: {nod: [0, 0.2 * (hump(t, 0.1, 0.5) + 0.75 * hump(t, 0.55, 0.95))], rise: 0.004 * hump(t, 0.1, 0.95)}}),
  'shake-head': (t) => {
    const env = seg(t, 0, 0.15) * (1 - seg(t, 1.0, 1.25)), s = Math.sin(2 * Math.PI * 2.4 * t) * env;
    return {look: [0.4 * s, 0], body: {nod: [0.18 * s, 0]}};
  },
  'startle-jump': (t, c) => {
    const tau = clamp01((t - 0.15) / 0.45), face: ExpressionId | undefined = t < 0.12 ? undefined : t < 0.8 ? 'shock' : 'scared';
    return {
      face,
      arms: {a: 'base', b: 'P12', u: seg(t, 0.12, 0.35)},
      body: {lift: 0.14 * c.k * 4 * tau * (1 - tau), crouch: 0.2 * hump(t, 0.6, 0.9), rise: 0.02 * hump(t, 0.1, 0.4), nod: [0, -0.1 * hump(t, 0.12, 0.5)]},
    };
  },
  'look-around': (t) => {
    // Eyes glance, then the head swaps: left 0.6-1.3 s, front, right 1.85-2.65 s. Profile eyes sit at the front of the head: look stays 0.
    const head = t >= 0.6 && t < 1.3 ? 'left' : t >= 1.85 && t < 2.65 ? 'right' : 'front';
    const gx = -0.9 * (seg(t, 0.4, 0.55) - seg(t, 1.15, 1.3)) + 0.9 * (seg(t, 1.65, 1.8) - seg(t, 2.5, 2.65));
    return {look: head === 'front' ? [gx, 0] : [0, 0], body: {head, nod: [0, -0.03 * hump(t, 0.4, 2.7)]}};
  },
  'turn-head-left': turnHead('left'),
  'turn-head-right': turnHead('right'),
  'turn-head-to-camera': (t) => ({look: [0, 0], body: {head: t < 0.55 ? undefined : 'front', nod: [0, 0]}}),
  shiver: (t) => {
    const env = seg(t, 0, 0.3), f1 = 2 * Math.PI * 6.25 * t, f2 = 2 * Math.PI * 9.375 * t;
    return {
      face: 'worried',
      arms: {a: 'base', b: 'P42', u: seg(t, 0, 0.4)},
      body: {crouch: 0.05 * env, lean: 0.012 * Math.sin(f1) * env, rise: 0.004 * Math.sin(f2 + 1) * env, nod: [0.03 * Math.sin(f2) * env, 0.02 * Math.sin(f1 + 0.5) * env]},
    };
  },
  'sit-down': (t, c) => {
    // The chair stands at the rest point; the figure starts in front of it (feet at the seat's front edge) and the pelvis travels back
    // onto the seat while the feet stay on one ground point (`sitFootOffset` moves the root by exactly what the rig's ankles move).
    const profile = c.view !== 'front', sit = seg(t, 0.2, 1.4), dir = c.view === 'left' ? -1 : 1;
    return {
      offset: profile ? [dir * sitFootOffset(sit, c.legK ?? c.k), 0] : undefined,
      arms: {a: 'base', b: 'P31', u: seg(t, 0.9, 1.6)},
      body: {sit, bend: profile ? 0.3 * hump(t, 0.1, 1.25) : 0, nod: [0, 0.04 * hump(t, 0.3, 1.2)]},
    };
  },
  'stand-up': (t, c) => {
    const profile = c.view !== 'front', sit = 1 - seg(t, 0.35, 1.3), dir = c.view === 'left' ? -1 : 1;
    return {
      offset: profile ? [dir * sitFootOffset(sit, c.legK ?? c.k), 0] : undefined,
      arms: {a: 'P31', b: 'base', u: seg(t, 0.1, 0.6)},
      body: {sit, bend: profile ? 0.4 * hump(t, 0.2, 1.0) : 0, nod: [0, 0.04 * hump(t, 0.2, 1.0)]},
    };
  },
  'point-and-say': (t, c) => {
    const open = c.amp ? c.amp(t) : syllableOpen(t - 0.3, c.seed), speaking = t > 0.3 && t < 2.0;
    return {
      arms: {a: 'base', b: 'P05', u: seg(t, 0.1, 0.5) * (1 - seg(t, 1.8, 2.3))},
      talk: speaking ? open : undefined,
      body: {nod: [0, 0.1 * hump(t, 0.5, 0.75)], rise: 0.004 * hump(t, 0.1, 0.5)},
    };
  },
  'gasp-recoil': (t, c) => {
    const back = seg(t, 0.1, 0.3) * (1 - 0.6 * seg(t, 0.9, 1.6)), profile = c.view !== 'front';
    return {
      face: t < 0.1 ? undefined : t < 0.8 ? 'shock' : 'scared',
      arms: {a: 'base', b: 'P15', u: seg(t, 0.1, 0.4) * (1 - seg(t, 1.2, 1.6))},
      body: {lean: profile ? -0.2 * back * (c.view === 'left' ? -1 : 1) : 0, lift: 0.03 * c.k * hump(t, 0.1, 0.35), crouch: profile ? 0 : 0.06 * back, rise: 0.012 * back, nod: [0, -0.12 * hump(t, 0.1, 1.0)]},
    };
  },
  talk: (t, c) => {
    const open = c.amp ? c.amp(t) : syllableOpen(t, c.seed), w = (2 * Math.PI * t) / 2.4;
    return {talk: open, body: {rise: 0.004 * (1 - Math.cos(w)), nod: [0, 0.03 * Math.sin(w * 2 + c.seed)]}};
  },
  'eat-chew': (t) => {
    // About 1.5 chews a second (2 s = 3 chews, looping): the jaw opens a little (`talk` open up to 0.4: the profile and 3/4 jaw drops about 0.1
    // head units, never a talk shape) and closes, the near cheek swells a beat later while the jaw closes, and the head dips a hair with each chew.
    // No hand-to-mouth bite (the arms stay on the base pose).
    const w = 2 * Math.PI * 1.5 * t, v = 0.5 - 0.5 * Math.cos(w);
    return {talk: 0.4 * v, chew: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(w - 0.6)), body: {nod: [0, 0.02 * v], rise: 0.002 * (1 - Math.cos(w))}};
  },
  'kneel-down': (t, c) => {
    // One foot steps forward and stays, the other knee goes down, then the second knee, then the hips settle back and down to P34
    // (the stages are in `kneelSolution`); the torso stays upright with a slight forward lean while the knees go down.
    const profile = c.view !== 'front';
    return {
      arms: {a: 'base', b: 'P34', u: seg(t, 1.05, 1.8)},
      body: {kneel: seg(t, 0.1, 1.7), bend: profile ? 0.12 * hump(t, 0.1, 1.7) : 0},
    };
  },
  'stand-from-kneel': (t, c) => {
    // The reverse of kneel-down (the same staged legs run backwards): hips lift, the second knee comes up, the figure stands.
    const profile = c.view !== 'front';
    return {
      arms: {a: 'P34', b: 'base', u: seg(t, 0.1, 0.8)},
      body: {kneel: 1 - seg(t, 0.2, 1.8), bend: profile ? 0.12 * hump(t, 0.2, 1.8) : 0},
    };
  },
  'hood-pull': (t) => {
    // One arm path hang (P01) -> hands above the head (P08): the hands reach the hood at the sides of the neck (u 0.58 = jaw height, P12's
    // level) by 0.45 s, grip, then carry it up over the head to u 0.9 (just above the crown) by 1.05 s while the hood rim travels with
    // them (`hood` = the lift), and drop straight back to the hang by 1.5 s. The hood stays up.
    const u = keys(t, [[0, 0], [0.45, 0.58], [0.55, 0.58], [1.05, 0.9], [1.1, 0.9], [1.5, 0]]);
    return {view: 'back', arms: {a: 'P01', b: 'P08', u}, hood: seg(t, 0.55, 1.05)};
  },
  'crouch-hide': (t, c) => {
    const u = seg(t, 0.15, 0.95), profile = c.view !== 'front';
    return {
      face: t < 0.4 ? undefined : 'scared',
      arms: {a: 'base', b: 'P35', u: seg(t, 0.4, 1.1)},
      body: profile ? {squat: u, bend: 0.35 * u} : {crouch: 0.9 * u},
    };
  },
};

export const MOTION_INFO: Record<MotionId, MotionInfo> = {
  'zero-g-drift': {name: 'Zero-g drift', description: 'Weightless idle (EDU-EP08 B4): arms float on the zero-g neutral numbers (P46) with a slow drift, knees breathe, ambient bob 3 cm and whole-card roll of about 3 deg on a 6 s loop. Draw with `paintEva` / `paintFigureAt` (`shadow: false`, `roll: frame.roll`).', duration: 6, loop: true, views: ['front'], use: 'Any floating figure that is held still: orbit shots, cards with a floating person.'},
  'pat-check': {name: 'Pat check', description: 'Self-check (EDU-EP08 B5): both gloves pat the chest at 0.4 and 0.8 s, the right glove crosses to the left upper arm at 1.4 s and the left to the right upper arm at 1.9 s (two taps each), shoulders drop 0.02 m at 2.4 s, worried then neutral. Elbows tucked, depth arms (`near`). Front body, 3.1 s.', duration: 3.1, loop: false, views: ['front'], use: 'Checking oneself after a scare; safe beat, no puff.'},
  'rail-tow': {name: 'Rail tow', description: 'Hand-over-hand along a handrail (EDU-EP08 B6), floating: the far hand grips the rail (planted in the world), the body slides to it, the hand re-grips one stroke ahead (0.7 s cycle, 0.34 m per stroke); the near hand closes on a target wrist behind the body at 0.2 s and holds. The figure travels toward the side it faces (view right = screen right). Place the towed person at this figure`s glove anchor each frame.', duration: 1.3, loop: false, views: ['left', 'right'], use: 'Towing or being pulled along a rail in zero-g.'},
  'idle-breathe': {name: 'Idle breathe', description: 'Chest rise, a tiny weight shift and a head bob on a 3 s period.', duration: 3, loop: true, views: ['front', 'left', 'right'], use: 'Any held figure: put it under a still pose so nothing is frozen.'},
  'walk-in-from-left': {name: 'Walk in from the left', description: 'Enters from the screen left in profile facing right at 1.2 m/s, brakes and settles into standing at the rest point. Steps match the ground speed.', duration: 2.1, loop: false, views: ['right'], use: 'A person arrives into frame; `distance` = metres from the off-screen start to the rest point.'},
  'walk-in-from-right': {name: 'Walk in from the right', description: 'Mirror of walk-in-from-left: enters from the screen right facing left.', duration: 2.1, loop: false, views: ['left'], use: 'A person arrives from the right.'},
  'walk-out-to-left': {name: 'Walk out to the left', description: 'Starts standing at the rest point, accelerates over 0.4 s and walks off the screen left in profile facing left.', duration: 2.05, loop: false, views: ['left'], use: 'A person leaves; cut from the front idle to the profile at the first frame.'},
  'walk-out-to-right': {name: 'Walk out to the right', description: 'Mirror of walk-out-to-left: walks off to the screen right facing right.', duration: 2.05, loop: false, views: ['right'], use: 'A person leaves toward the right.'},
  'run-left-to-right': {name: 'Run across, left to right', description: 'A profile run cycle (poses P38) at 3.4 m/s, centred on the rest point (starts half the distance before it, ends half past it); the rig pumps the arms.', duration: 1.5, loop: false, views: ['right'], use: 'Fleeing, chasing, late for something; `distance` default 5 m, cut across the frame.'},
  'run-right-to-left': {name: 'Run across, right to left', description: 'Mirror of run-left-to-right.', duration: 1.5, loop: false, views: ['left'], use: 'The same run toward the screen left.'},
  nod: {name: 'Nod', description: 'Two head dips (yes, I see) with a small breath, 1.2 s.', duration: 1.2, loop: false, views: ['front', 'left', 'right'], use: 'Agreement, acknowledging, listening beat.'},
  'shake-head': {name: 'Shake head', description: 'Three head swings with the eyes following, 1.25 s.', duration: 1.25, loop: false, views: ['front', 'left', 'right'], use: 'No, disbelief, disapproval.'},
  'startle-jump': {name: 'Startle jump', description: 'A reflex hop (0.14 m for 1.7 m), hands to the mouth (P12), shock then scared face, a landing dip, 1.3 s.', duration: 1.3, loop: false, views: ['front', 'left', 'right'], use: 'A sudden noise or sight; the beat before a reveal.'},
  'look-around': {name: 'Look around', description: 'Front, head to the screen left, front, head to the screen right, front over 3.2 s; the eyes glance before each swap. Front body.', duration: 3.2, loop: false, views: ['front'], use: 'Checking for someone, searching, nervous scan.'},
  'turn-head-left': {name: 'Turn head to the left', description: 'Eyes glance left, the head swaps front -> left profile at 0.55 s and stays. Front body.', duration: 1.6, loop: false, views: ['front'], use: 'Looking at something off-screen left: a reveal cut or a reaction.'},
  'turn-head-right': {name: 'Turn head to the right', description: 'Mirror of turn-head-left.', duration: 1.6, loop: false, views: ['front'], use: 'Looking at something off-screen right.'},
  'turn-head-to-camera': {name: 'Turn head to the camera', description: 'A profile body swaps its head to the front at 0.55 s: looks at the viewer.', duration: 1.6, loop: false, views: ['left', 'right'], use: 'A walker or sitter notices the camera.'},
  shiver: {name: 'Shiver', description: 'Arms come in to hug the body (P42), worried face, hunched, fast small tremor on 6.25 and 9.4 Hz (10 and 15 cycles in 1.6 s), 2 s.', duration: 2, loop: false, views: ['front', 'left', 'right'], use: 'Cold, fear, dread. Hold longer by layering it again on pose P42 from t = 0.4.'},
  'sit-down': {name: 'Sit down', description: 'Starts in front of the chair at the rest point (profile), leans forward and lowers onto it with the feet planted, hands settle on the lap (P31), 1.8 s. Draw the chair at the rest point with `drawChair` (same g, view).', duration: 1.8, loop: false, views: ['front', 'left', 'right'], prop: 'chair', use: 'Taking a seat at a table or a desk.'},
  'stand-up': {name: 'Stand up', description: 'The reverse: leans forward and rises from the chair to stand in front of it, feet planted, hands drop to the hang, 1.6 s. Draw the chair at the rest point.', duration: 1.6, loop: false, views: ['front', 'left', 'right'], prop: 'chair', use: 'Rising to leave or to react.'},
  'point-and-say': {name: 'Point and say', description: 'Raises an arm to point (P05), the mouth talks, a nod on the emphasis, lowers it again, 2.4 s.', duration: 2.4, loop: false, views: ['front', 'left', 'right'], use: 'Calling something out: "there!", directing attention.'},
  'gasp-recoil': {name: 'Gasp and recoil', description: 'A hop and a lean back (profile) or a duck (front), palms up (P15), shock then scared face, 1.6 s.', duration: 1.6, loop: false, views: ['front', 'left', 'right'], use: 'Something frightening appears in front of the person.'},
  'eat-chew': {name: 'Eat / chew', description: 'Chewing, 1.5 chews a second (2 s loop = 3 chews): the jaw opens a little and closes (talk open up to 0.4, the profile and 3/4 jaw drops with it, no wide talk shapes), the near cheek swells in profile and 3/4 (`FaceState.chew`), a tiny head dip with each chew. No hand-to-mouth bite; layer it on a pose that holds the food.', duration: 2, loop: true, views: ['front', 'left', 'right'], use: 'Eating, munching, a mouth full of food; the jaw and cheek read best in profile or 3/4.'},
  talk: {name: 'Talk', description: 'The talk mouth driven by `amp` (mouthAt on the narration) or a seeded syllable envelope, with a breath and a small head bob; the rig blinks.', duration: 2.4, loop: true, views: ['front', 'left', 'right'], use: 'A person speaking on screen; pass `amp` for lip-sync to an actual line.'},
  'kneel-down': {name: 'Kneel down', description: 'Steps one foot forward and lowers onto the other knee, brings the second knee down, then the hips settle back to the upright kneel of P34 with a slight forward lean, hands to the thighs, 2 s. Feet that are on the ground do not slide.', duration: 2, loop: false, views: ['front', 'left', 'right'], use: 'Begging, searching the floor, a scene of grief.'},
  'stand-from-kneel': {name: 'Stand from kneel', description: 'The reverse of kneel-down: hips lift off the heels, one knee comes up and the foot plants, the figure stands, hands drop to the hang, 2 s.', duration: 2, loop: false, views: ['front', 'left', 'right'], use: 'Getting up after a plea or a search.'},
  'hood-pull': {name: 'Pull the hood up', description: 'Back view: both hands reach the hood at the neck, carry it up over the head (the hood rim travels with the hands, hair above it until it covers), the hands stop just above the crown, then drop to the hang with the hood up, 1.5 s. Needs an outfit with a hood (hoodie, coral hoodie).', duration: 1.5, loop: false, views: ['back'], use: 'A person pulls the hood up against the cold or to hide: the hands carry the hood, no swap.'},
  'coin-count': {name: 'Count coins', description: 'Arm held out in the counting pose (P25) with a tiny body rise, a hand dip every 7 frames (0.233 s, one coin per dip), 0.7 s loop. Pair with `paintCoinPurse` in the hand and `paintCoins` on the counter (`groceries.ts`).', duration: 0.7, loop: true, views: ['front', 'left', 'right'], use: 'A silent counting-out gag at a counter: change, tips, a toll.'},
  'crouch-hide': {name: 'Crouch and hide', description: 'Ducks into a crouch (front) or a deep knee bend (profile), arms cover the head (P35), scared face, 1.4 s.', duration: 1.4, loop: false, views: ['front', 'left', 'right'], use: 'Hiding behind cover, taking shelter.'},
};

// ------------------------------------------------------------------ layering

/** Seconds a motion lasts for these options (walks and runs depend on `distance` and person height). */
export const motionDuration = (id: MotionId, o: {distance?: number; height?: number} = {}): number => {
  const c = {k: (o.height ?? 1.7) / 1.7, distance: o.distance};
  if (id === 'walk-in-from-left' || id === 'walk-in-from-right') return walkTime(c, 'in');
  if (id === 'walk-out-to-left' || id === 'walk-out-to-right') return walkTime(c, 'out');
  if (id === 'run-left-to-right' || id === 'run-right-to-left') return runTime(c);
  return MOTION_INFO[id].duration;
};

/** One motion frame at shot time `t` (seconds). Non-looping motions hold their last frame; `loop` ones are NOT wrapped here. */
export const motionFrame = (id: MotionId, t: number, c: MotionCtx): MotionFrame => MOTIONS[id](Math.max(0, t), c);

export type LayerArgs = {
  /** A `PEOPLE` id or any CastDef. */
  person: PersonId | CastDef;
  /** A wardrobe outfit put on the person (`wardrobe.ts`). */
  outfit?: OutfitId;
  /** A catalog id, or a `Motion` function an episode authored with these helpers (EDU-EP14 N13, intake proposed): used as it is, no catalog entry. */
  motion: MotionId | Motion;
  /** Shot-local time in seconds (frame / fps). */
  t: number;
  /** Rest ground point in plate px and px per metre, as drawFigure takes them. */
  g: Pt;
  unit: number;
  /** Body view (default front); a walk or run overrides it with the profile it needs. */
  view?: View;
  /** The pose the motion layers on (default P01). A pose that lacks `view` falls back to P01 for that view. */
  pose?: AnyPoseId;
  /** The face under the motion (default neutral). */
  expression?: ExpressionId | FaceState;
  distance?: number;
  amp?: (t: number) => number;
  /** Overrides the figure seed (default: the person's seed). */
  seed?: number;
};
export type Layered = {
  def: CastDef;
  /** The ground point to draw at: the rest point plus the motion's offset. */
  g: Pt;
  pose: FigPose;
  seed: number;
  /** The body view in force (a walk may have changed it): draw a chair with the same view. */
  view: View;
  frame: MotionFrame;
  /** Whole-card roll about the hips in degrees (0 when the motion has none): pass to `paintFigureAt` / `paintEva` `roll`. */
  roll: number;
  /** Glove depth per side in metres from `MotionFrame.reach.near` (the glove growth); absent = flat. */
  near: {r?: number; l?: number};
};

const asFace = (f: ExpressionId | FaceState): FaceState => (typeof f === 'string' ? EXPRESSIONS[f] : f);
const ADD = ['lean', 'rise', 'lift', 'headCock'] as const;
const SET = ['crouch', 'bend', 'walk', 'stride', 'sit', 'floorSit', 'kneel', 'squat', 'run', 'head'] as const;

/**
 * Layer a motion on a person, an expression and a base pose: returns what to hand to `drawFigure(p, def, g, unit, pose, t, seed)`.
 * Pure in its arguments (no clock, no random).
 */
export const layerMotion = (a: LayerArgs): Layered => {
  const base = typeof a.person === 'string' ? PEOPLE[a.person] : a.person;
  const def = a.outfit ? dress(base, a.outfit) : base;
  const seed = a.seed ?? def.seed;
  const ctx: MotionCtx = {view: a.view ?? 'front', k: def.height / 1.7, legK: legScale(def), seed, distance: a.distance, amp: a.amp};
  const frame = typeof a.motion === 'function' ? a.motion(Math.max(0, a.t), ctx) : motionFrame(a.motion, a.t, ctx);
  const view = frame.view ?? ctx.view;
  const pv: View = view === 'back' ? 'front' : view; // the pose library has no back targets: arms are the front-view ones, mirrored by the back figure
  const off = frame.offset ?? [0, 0];
  const g: Pt = [a.g[0] + off[0] * a.unit, a.g[1] - off[1] * a.unit];
  const basePose: AnyPoseId = a.pose ?? 'P01';
  const ref = (r: PoseRef): AnyPoseId => (r === 'base' ? basePose : r);
  // Body and arms from the pose library: the motion's blend, or the base pose.
  const src: PoseFigure = frame.arms ? poseMix(ref(frame.arms.a), ref(frame.arms.b ?? frame.arms.a), frame.arms.u ?? 0, def, g, a.unit, pv) : poseFor(basePose, def, g, a.unit, pv);
  // The motion's body fields.
  const body: Record<string, unknown> = {...src};
  const mb = frame.body ?? {};
  for (const f of ADD) if (mb[f] !== undefined) body[f] = (((src as Partial<FigPose>)[f] as number | undefined) ?? 0) + mb[f]!;
  for (const f of SET) if (mb[f] !== undefined) body[f] = mb[f];
  if (mb.nod) body.nod = [(src.nod?.[0] ?? 0) + mb.nod[0], (src.nod?.[1] ?? 0) + mb.nod[1]] as Pt;
  const pose = body as PoseFigure & Partial<FigPose>;
  // Arms hung from the pose body stay with the shoulders of the body the motion makes (rigid shift).
  const shift = (side: 'r' | 'l', arm: FigPose['rArm']): FigPose['rArm'] => {
    if (!arm) return arm;
    const s0 = shoulderPoint(def, g, a.unit, {...src, view: pv}, side), s1 = shoulderPoint(def, g, a.unit, {...pose, view: pv}, side);
    const d: Pt = [s1[0] - s0[0], s1[1] - s0[1]];
    return {...arm, to: [arm.to[0] + d[0], arm.to[1] + d[1]], via: arm.via && [arm.via[0] + d[0], arm.via[1] + d[1]]};
  };
  pose.rArm = shift('r', src.rArm);
  pose.lArm = shift('l', src.lArm);
  // Arms authored by hand (`reach`), from the shoulders of the body the motion makes (a profile `x` runs toward the facing side).
  const near: {r?: number; l?: number} = {}, kA = def.armScale ?? 1, dirV = pv === 'front' ? 1 : pv === 'left' ? -1 : 1;
  for (const side of ['r', 'l'] as const) {
    const rc = frame.reach?.[side];
    if (!rc) continue;
    const sh = shoulderPoint(def, g, a.unit, {...pose, view: pv}, side);
    const px = (q: Pt): Pt => [sh[0] + dirV * q[0] * kA * a.unit, sh[1] - q[1] * kA * a.unit];
    const arm = {to: px(rc.to), via: px(rc.via)};
    if (side === 'r') pose.rArm = arm; else pose.lArm = arm;
    if (rc.near) near[side] = rc.near;
  }
  let face = asFace(frame.face ?? a.expression ?? 'neutral');
  if (frame.look) face = {...face, look: frame.look};
  if (frame.talk !== undefined) face = {...face, mouth: 'talk', open: frame.talk};
  if (frame.chew !== undefined) face = {...face, chew: frame.chew};
  const hood = frame.hood === undefined ? {} : frame.hood >= 1 ? {hoodUp: true} : {hoodRise: frame.hood};
  return {def, g, pose: {...pose, ...hood, view, face} as FigPose, seed, view, frame, roll: frame.roll ?? 0, near};
};

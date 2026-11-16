import {animalCycleLength, animalGaitPeriod, type AnimalGait} from '../kit/animals';
import {bodyFrame, shoulderPoint, type Arm, type CastDef, type FigPose} from '../kit/cast';
import {INK, inkLine, solid} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {DOG, GIRL, MUM} from './cast';

// EDU-EP19-SHORT movement owned by Boss (W5.3, 2026-11-15; boss-asset-workflow#boss-owns-movement). Episode code, not kit: the shared kit is
// frozen after the look lock (v6, user 2026-11-15), so the new poses and clocks live here and are marked `new:` for kit intake at delivery:
//   new: girl-run-noslide (`girlRunPhase`: the profile run phase from the distance run, so the stance foot holds; kit P38 has no ground clock)
//   new: one-finger-idea (`oneFingerArms` + `paintIdeaFinger`, B02-SH01; the user found P27 reads as two fists, W2.4)
//   new: crouch-sniff (`crouchSniff`, B02-SH04: kneel + bend 1, hands planted, nose over the print)
//   new: kneel-rise (`kneelRise`, B02-SH04 fix round 1: up from the kneel through the kit kneel in reverse, hands off the thighs)
//   new: crouch-swap-mats (`matCarry`, B03-SH04: MUM squat-bent, both hands on a mat held at knee height)
//   new: stopwatch-press / stopwatch-read (`watchPress`, `watchRead`, B02-SH02 / B02-SH06: MUM's left wrist raised, right index on it)
// Dog motions use the kit's `animalMotion` (sniff-track, look-left-right, head-tilt, lick, sit-down, happy-wag) plus `dogClock` for a
// travelled distance (the kit's private gait clock, so the planted paws hold at any speed).

/** Nose reach ahead of the dog's ground point in sniff-track, right profile (m, measured from the kit anchors at sniff 0.85; W3.1). */
export const NOSE_AHEAD = 0.62;
/** The kit gait clock for a distance `s` m (seconds of gait): drives `AnimalPose.walk` so the planted paws hold still while `g` moves s. */
export const dogClock = (s: number, gait: AnimalGait = 'walk') => (s / animalCycleLength(DOG, gait)) * animalGaitPeriod(DOG, gait);
/** easeInOut (smoothstep) of a clamped fraction, and a clamped linear fraction of [a, b]. */
export const ease = (u: number) => { const k = Math.min(1, Math.max(0, u)); return k * k * (3 - 2 * k); };
export const frac = (L: number, a: number, b: number) => Math.min(1, Math.max(0, (L - a) / (b - a)));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];

// ------------------------------------------------------------------------------------------------ new: girl-run-noslide
/** Stance ankle (lowest) of a profile run at phase `cyc` (cycles): x along the facing (m from the ground point) and which leg. */
export const runStance = (def: CastDef, cyc: number): {x: number; far: boolean} => {
  const legs = bodyFrame(def, {view: 'right', run: cyc}).mode!.legs;
  const low = legs.reduce((a, b) => (b.ankle[1] < a.ankle[1] ? b : a));
  return {x: low.ankle[0], far: low.far};
};
const TABLES = new Map<CastDef, {d: number[]; C: number}>();
const STEPS = 720;
/** Cumulative ground distance over one run cycle: the backward travel of the stance foot (it must equal the body's forward travel). */
const runTable = (def: CastDef) => {
  let t = TABLES.get(def);
  if (t) return t;
  const d = [0];
  let prev = runStance(def, 0);
  for (let i = 1; i <= STEPS; i++) {
    const cur = runStance(def, i / STEPS);
    d.push(d[i - 1] + (cur.far === prev.far ? Math.max(0, prev.x - cur.x) : 0));
    prev = cur;
  }
  t = {d, C: d[STEPS]};
  TABLES.set(def, t);
  return t;
};
/** Run phase (cycles) after running `s` m: the inverse of the stance-foot table, so the stance foot holds on the ground while the body moves. */
export const girlRunPhase = (s: number, def: CastDef = GIRL): number => {
  const {d, C} = runTable(def), n = Math.floor(s / C), r = s - n * C;
  let lo = 0, hi = STEPS;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (d[m] <= r) lo = m; else hi = m; }
  const span = d[hi] - d[lo], k = span > 1e-9 ? (r - d[lo]) / span : 0;
  return n + (lo + k) / STEPS;
};
/** Metres per run cycle of `def` (one stride pair). */
export const runCycleLength = (def: CastDef = GIRL) => runTable(def).C;

// ------------------------------------------------------------------------------------------------ arm helpers (picture px)
type Body = Partial<FigPose> & {view: FigPose['view']};
const sh = (def: CastDef, c: YCam, at: V3, body: Body, side: 'r' | 'l') => {
  const g = camPoint(c, at), u = camUnit(c, at);
  return g ? {s: shoulderPoint(def, g as Pt, u, body, side), g: g as Pt, u} : null;
};

/** new: one-finger-idea. Front view, the character's LEFT arm (screen right): elbow down by the ribs, forearm up, the hand beside the cheek;
 *  `paintIdeaFinger` adds the raised index finger. `k` 0..1 raises it from the hanging arm. */
export const oneFingerArms = (c: YCam, at: V3, body: Body, k: number, def: CastDef = GIRL): Pick<FigPose, 'lArm'> => {
  const q = sh(def, c, at, body, 'l');
  if (!q) return {};
  const {s, u} = q, a = def.armScale ?? 1, e = ease(k);
  const hang: Pt = [s[0] + 0.03 * u * a, s[1] + 0.48 * u * a], up: Pt = [s[0] + 0.07 * u * a, s[1] - 0.17 * u * a];
  const elbow: Pt = [s[0] + 0.1 * u * a, s[1] + (0.24 - 0.02 * e) * u * a];
  return {lArm: {to: [lerp(hang[0], up[0], e), lerp(hang[1], up[1], e)], via: e > 0.05 ? elbow : undefined, out: 1}};
};
/** The raised index finger of `oneFingerArms`: a skin capsule up from the hand, inked (painted after the figure from its anchors). */
export const paintIdeaFinger = (p: Painter, hand: Pt, u: number, k: number, def: CastDef = GIRL) => {
  if (k < 0.6) return;
  const len = 0.07 * u * (def.armScale ?? 1) * ease((k - 0.6) / 0.4), w = Math.max(2, 0.018 * u), x = hand[0] + 0.004 * u, y0 = hand[1] - 0.025 * u;
  const pts: Pt[] = [[x - w / 2, y0], [x - w / 2, y0 - len], [x - w * 0.3, y0 - len - w * 0.35], [x + w * 0.3, y0 - len - w * 0.35], [x + w / 2, y0 - len], [x + w / 2, y0]];
  solid(p, 9890, def.head.skin, pts, 4, 0.02, 0.05);
  inkLine(p, 9891, pts.slice(0, 5).concat([pts[5]]), {closed: false, weight: 0.7, color: mixColor(def.head.skin, INK, 0.55), curve: 0.2});
};

/** new: crouch-sniff. Profile (`view` left/right): on hands and knees, torso pitched forward, head down to the print; `up` 0..1 sits back up
 *  to kneeling. Body fields plus both hands planted on the grass ahead of the knees (px targets). */
export const crouchSniff = (c: YCam, at: V3, view: 'left' | 'right', up: number, def: CastDef = GIRL): Partial<FigPose> => {
  const e = ease(up), body: Body = {view, kneel: 1, bend: lerp(1, 0, e), nod: [lerp(0.25, 0, e), lerp(-0.3, 0, e)]};
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return body;
  const dir = view === 'left' ? -1 : 1, a = def.armScale ?? 1;
  const arm = (side: 'r' | 'l', ahead: number): Arm => {
    const s = shoulderPoint(def, g as Pt, u, body, side);
    const plant: Pt = [s[0] + dir * ahead * u * a, g[1] - 0.02 * u], thigh: Pt = [g[0] + dir * 0.12 * u, g[1] - 0.3 * u];
    return {to: [lerp(plant[0], thigh[0], e), lerp(plant[1], thigh[1], e)], out: dir};
  };
  return {...body, rArm: arm('r', 0.05), lArm: arm('l', 0.1), farArmUnder: true};
};

/** new: kneel-rise (fix round 1, B02-SH04). Profile: up from the crouch-sniff end pose (kneeling upright, hands on the thighs) through the kit
 *  kneel in reverse, `r` 0..1 (kneel 1 -> 0: hips up over the knees, the far foot steps up, standing), leaning into the push; the hands leave the
 *  thighs and hang by `r` 0.5, so the first frame matches `crouchSniff(.., up 1)` and the last a plain standing figure. */
export const kneelRise = (c: YCam, at: V3, view: 'left' | 'right', r: number, def: CastDef = GIRL): Partial<FigPose> => {
  const body: Body = {view, kneel: 1 - r, bend: 0.3 * Math.sin(Math.PI * Math.min(1, r / 0.8))};
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g || r >= 1) return body;
  const dir = view === 'left' ? -1 : 1, a = def.armScale ?? 1, h = ease(r / 0.5);
  const arm = (side: 'r' | 'l'): Arm => {
    const s = shoulderPoint(def, g as Pt, u, body, side), thigh: Pt = [g[0] + dir * 0.12 * u, g[1] - 0.3 * u], hang: Pt = [s[0] + dir * 0.02 * u * a, s[1] + 0.5 * u * a];
    return {to: [lerp(thigh[0], hang[0], h), lerp(thigh[1], hang[1], h)], out: dir};
  };
  return {...body, rArm: arm('r'), lArm: arm('l'), farArmUnder: true};
};

/** new: crouch-swap-mats. MUM in profile, squat-bent, both hands forward on a mat held at knee height (`hold` px, the mat's near edge). */
export const matCarry = (c: YCam, at: V3, view: 'left' | 'right', hold: Pt | null, crouch: number): Partial<FigPose> => {
  const body: Body = {view, squat: crouch, bend: 0.55 * crouch};
  if (!hold) return body;
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return body;
  const dir = view === 'left' ? -1 : 1;
  return {...body, rArm: {to: [hold[0] - dir * 0.03 * u, hold[1]], out: dir}, lArm: {to: [hold[0] + dir * 0.03 * u, hold[1] - 0.01 * u], out: dir}, farArmUnder: true};
};

/** new: stopwatch-press. MUM front view: the left wrist raised in front of the chest (watch face up), the right index finger on it (`k` 0..1). */
export const watchPress = (c: YCam, at: V3, k: number): Pick<FigPose, 'lArm' | 'rArm'> => {
  const body: Body = {view: 'front'}, l = sh(MUM, c, at, body, 'l'), r = sh(MUM, c, at, body, 'r');
  if (!l || !r) return {};
  const {u} = l, e = ease(k), wrist: Pt = [l.s[0] - 0.13 * u, l.s[1] + 0.2 * u];
  const lHang: Pt = [l.s[0] + 0.045 * u, l.s[1] + 0.52 * u], rHang: Pt = [r.s[0] - 0.045 * u, r.s[1] + 0.52 * u];
  return {
    lArm: {to: [lerp(lHang[0], wrist[0], e), lerp(lHang[1], wrist[1], e)], via: e > 0.05 ? [l.s[0] + 0.05 * u, l.s[1] + 0.25 * u] : undefined},
    rArm: {to: [lerp(rHang[0], wrist[0] - 0.05 * u, e), lerp(rHang[1], wrist[1] - 0.03 * u, e)], via: e > 0.05 ? [r.s[0] - 0.04 * u, r.s[1] + 0.26 * u] : undefined},
  };
};
/** new: stopwatch-read. MUM front view: the left wrist raised to eye level in front of the face (`k` 0..1); the right arm hangs. */
export const watchRead = (c: YCam, at: V3, k: number): Pick<FigPose, 'lArm'> => {
  const l = sh(MUM, c, at, {view: 'front'}, 'l');
  if (!l) return {};
  const {s, u} = l, e = ease(k), hang: Pt = [s[0] + 0.045 * u, s[1] + 0.52 * u], read: Pt = [s[0] - 0.12 * u, s[1] - 0.04 * u];
  return {lArm: {to: [lerp(hang[0], read[0], e), lerp(hang[1], read[1], e)], via: e > 0.05 ? [s[0] + 0.07 * u, s[1] + 0.22 * u] : undefined}};
};

// Filed from EDU-EP19-SHORT (KIT-P01, W8.4, 16 Nov 2026; a copy: the episode keeps src/painted/edu19/motion19.ts, stage.ts and
// shots/B01-SH07.ts unchanged, so its pinned scenes keep their cache keys). Shot-local pose helpers for the kit cast rig placed in a yaw-camera
// set: each returns `FigPose` body fields and/or picture-px arm targets for `paintFigureAt` / `drawFigure`. The episode versions default the
// person to its GIRL / MUM; here the `CastDef` is always passed. Casting-line names (README catalog):
//   girl-run-noslide    `noSlideRunPhase`, `runCycleLength`, `runStance`  profile P38 run phase from the distance run (stance foot holds)
//   one-finger-idea     `oneFingerArms` + `paintIdeaFinger`                 front, left arm up by the cheek, one index finger raised
//   crouch-sniff        `crouchSniff`                                       profile, hands and knees, nose to the ground; `up` sits back to kneeling
//   kneel-rise          `kneelRise`                                         profile, up from the crouch-sniff end pose through the kit kneel in reverse
//   crouch-swap-mats    `matCarry`                                          profile squat-bend, both hands on a flat object held at knee height
//   stopwatch-press     `watchPress`                                        front, left wrist raised before the chest, right index on it
//   stopwatch-read      `watchRead`                                         front, left wrist raised to eye level
//   wrist watch place   `wristWatchAt`                                      watch centre + forearm angle on the left forearm (pair with props.ts `paintStopwatch`)
//   sit_floor_lean_back `leanBackArms`                                      P33 side body leaning back, both hands planted behind the hips
//   animal travel clock `animalTravelClock`                                 gait seconds for a travelled distance, so planted paws hold at any speed
import {animalCycleLength, animalGaitPeriod, type AnimalDef, type AnimalGait} from './animals';
import {BONE, bodyFrame, shoulderPoint, type Arm, type CastDef, type FigAnchors, type FigPose} from './cast';
import {INK, inkLine, solid} from './draw';
import {hipAnchor} from './figure-at';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

const ease = (u: number) => { const k = Math.min(1, Math.max(0, u)); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** `dogClock` of EP19 for any animal: the kit gait clock for a distance `s` m (seconds of gait). Drive `AnimalPose.walk` with it while the
 *  ground point moves `s`, so the planted paws hold still at any speed. */
export const animalTravelClock = (def: AnimalDef, s: number, gait: AnimalGait = 'walk') => (s / animalCycleLength(def, gait)) * animalGaitPeriod(def, gait);

// ------------------------------------------------------------------------------------------------ girl-run-noslide
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
/** `girl-run-noslide`: run phase (cycles, for `FigPose.run`) after running `s` m in profile: the inverse of the stance-foot table, so the stance
 *  foot holds on the ground while the body moves `s`. Kit P38 has no ground clock. */
export const noSlideRunPhase = (def: CastDef, s: number): number => {
  const {d, C} = runTable(def), n = Math.floor(s / C), r = s - n * C;
  let lo = 0, hi = STEPS;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (d[m] <= r) lo = m; else hi = m; }
  const span = d[hi] - d[lo], k = span > 1e-9 ? (r - d[lo]) / span : 0;
  return n + (lo + k) / STEPS;
};
/** Metres per run cycle of `def` (one stride pair). */
export const runCycleLength = (def: CastDef) => runTable(def).C;

// ------------------------------------------------------------------------------------------------ arm helpers (picture px)
type Body = Partial<FigPose> & {view: FigPose['view']};
const sh = (def: CastDef, c: YCam, at: V3, body: Body, side: 'r' | 'l') => {
  const g = camPoint(c, at), u = camUnit(c, at);
  return g ? {s: shoulderPoint(def, g as Pt, u, body, side), g: g as Pt, u} : null;
};

/** `one-finger-idea`. Front view, the character's LEFT arm (screen right): elbow down by the ribs, forearm up, the hand beside the cheek;
 *  `paintIdeaFinger` adds the raised index finger. `k` 0..1 raises it from the hanging arm. */
export const oneFingerArms = (def: CastDef, c: YCam, at: V3, body: Body, k: number): Pick<FigPose, 'lArm'> => {
  const q = sh(def, c, at, body, 'l');
  if (!q) return {};
  const {s, u} = q, a = def.armScale ?? 1, e = ease(k);
  const hang: Pt = [s[0] + 0.03 * u * a, s[1] + 0.48 * u * a], up: Pt = [s[0] + 0.07 * u * a, s[1] - 0.17 * u * a];
  const elbow: Pt = [s[0] + 0.1 * u * a, s[1] + (0.24 - 0.02 * e) * u * a];
  return {lArm: {to: [lerp(hang[0], up[0], e), lerp(hang[1], up[1], e)], via: e > 0.05 ? elbow : undefined, out: 1}};
};
/** The raised index finger of `oneFingerArms`: a skin capsule up from the hand (`FigAnchors.lHand`), inked; paint after the figure. */
export const paintIdeaFinger = (p: Painter, def: CastDef, hand: Pt, u: number, k: number) => {
  if (k < 0.6) return;
  const len = 0.07 * u * (def.armScale ?? 1) * ease((k - 0.6) / 0.4), w = Math.max(2, 0.018 * u), x = hand[0] + 0.004 * u, y0 = hand[1] - 0.025 * u;
  const pts: Pt[] = [[x - w / 2, y0], [x - w / 2, y0 - len], [x - w * 0.3, y0 - len - w * 0.35], [x + w * 0.3, y0 - len - w * 0.35], [x + w / 2, y0 - len], [x + w / 2, y0]];
  solid(p, 9890, def.head.skin, pts, 4, 0.02, 0.05);
  inkLine(p, 9891, pts.slice(0, 5).concat([pts[5]]), {closed: false, weight: 0.7, color: mixColor(def.head.skin, INK, 0.55), curve: 0.2});
};

/** `crouch-sniff`. Profile (`view` left/right): on hands and knees, torso pitched forward, head down to the ground; `up` 0..1 sits back up
 *  to kneeling. Body fields plus both hands planted on the ground ahead of the knees (px targets). */
export const crouchSniff = (def: CastDef, c: YCam, at: V3, view: 'left' | 'right', up: number): Partial<FigPose> => {
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

/** `kneel-rise`. Profile: up from the crouch-sniff end pose (kneeling upright, hands on the thighs) through the kit kneel in reverse, `r` 0..1
 *  (kneel 1 -> 0, leaning into the push); the hands leave the thighs and hang by `r` 0.5, so the first frame matches `crouchSniff(.., up 1)` and
 *  the last a plain standing figure. */
export const kneelRise = (def: CastDef, c: YCam, at: V3, view: 'left' | 'right', r: number): Partial<FigPose> => {
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

/** `crouch-swap-mats`. Profile, squat-bent by `crouch`, both hands forward on a flat object held at knee height (`hold` px, its near edge;
 *  null = the body alone). */
export const matCarry = (c: YCam, at: V3, view: 'left' | 'right', hold: Pt | null, crouch: number): Partial<FigPose> => {
  const body: Body = {view, squat: crouch, bend: 0.55 * crouch};
  if (!hold) return body;
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return body;
  const dir = view === 'left' ? -1 : 1;
  return {...body, rArm: {to: [hold[0] - dir * 0.03 * u, hold[1]], out: dir}, lArm: {to: [hold[0] + dir * 0.03 * u, hold[1] - 0.01 * u], out: dir}, farArmUnder: true};
};

/** `stopwatch-press`. Front view: the left wrist raised in front of the chest (watch face up), the right index finger on it (`k` 0..1). */
export const watchPress = (def: CastDef, c: YCam, at: V3, k: number): Pick<FigPose, 'lArm' | 'rArm'> => {
  const body: Body = {view: 'front'}, l = sh(def, c, at, body, 'l'), r = sh(def, c, at, body, 'r');
  if (!l || !r) return {};
  const {u} = l, e = ease(k), wrist: Pt = [l.s[0] - 0.13 * u, l.s[1] + 0.2 * u];
  const lHang: Pt = [l.s[0] + 0.045 * u, l.s[1] + 0.52 * u], rHang: Pt = [r.s[0] - 0.045 * u, r.s[1] + 0.52 * u];
  return {
    lArm: {to: [lerp(lHang[0], wrist[0], e), lerp(lHang[1], wrist[1], e)], via: e > 0.05 ? [l.s[0] + 0.05 * u, l.s[1] + 0.25 * u] : undefined},
    rArm: {to: [lerp(rHang[0], wrist[0] - 0.05 * u, e), lerp(rHang[1], wrist[1] - 0.03 * u, e)], via: e > 0.05 ? [r.s[0] - 0.04 * u, r.s[1] + 0.26 * u] : undefined},
  };
};
/** `stopwatch-read`. Front view: the left wrist raised to eye level in front of the face (`k` 0..1); the right arm hangs. */
export const watchRead = (def: CastDef, c: YCam, at: V3, k: number): Pick<FigPose, 'lArm'> => {
  const l = sh(def, c, at, {view: 'front'}, 'l');
  if (!l) return {};
  const {s, u} = l, e = ease(k), hang: Pt = [s[0] + 0.045 * u, s[1] + 0.52 * u], read: Pt = [s[0] - 0.12 * u, s[1] - 0.04 * u];
  return {lArm: {to: [lerp(hang[0], read[0], e), lerp(hang[1], read[1], e)], via: e > 0.05 ? [s[0] + 0.07 * u, s[1] + 0.22 * u] : undefined}};
};

/** A wrist watch on the LEFT forearm (EP19 `mumWatchAt`): 0.07 m up the forearm from the hand (elbow = the upper-arm midpoint mirrored past
 *  the shoulder); a foreshortened forearm (< 0.06 m on screen) falls back to the hanging direction. Pass `c` and `angle` to `paintStopwatch`
 *  (props.ts) with `wrist` about max(2.4 r, 0.06 u), so the strap crosses the forearm. */
export const wristWatchAt = (a: FigAnchors, u: number): {c: Pt; angle: number} => {
  const e: Pt = [2 * a.lUpper[0] - a.lShoulder[0], 2 * a.lUpper[1] - a.lShoulder[1]];
  const dx = a.lHand[0] - e[0], dy = a.lHand[1] - e[1], L = Math.hypot(dx, dy);
  const [ux, uy] = L > 0.06 * u ? [dx / L, dy / L] : [0, 1];
  return {c: [a.lHand[0] - ux * 0.07 * u, a.lHand[1] - uy * 0.07 * u], angle: Math.atan2(uy, ux)};
};

/** `sit_floor_lean_back`: arms for the P33 side body (`floorSit` 1) leaning back `lean` rad: both hands planted on the ground behind the hips,
 *  arms nearly straight (two-bone, elbow bent backward). `body` is the pose's body fields (floorSit, lean, ...). EP19 B01-SH07. */
export const leanBackArms = (def: CastDef, c: YCam, at: V3, view: 'left' | 'right', body: Partial<FigPose>): Pick<FigPose, 'lArm' | 'rArm'> => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return {};
  const dir = view === 'left' ? -1 : 1, L = BONE * (def.armScale ?? 1) * u;
  const s0 = shoulderPoint(def, g as Pt, u, {view, ...body}, 'l'), hip = hipAnchor(def, g as Pt, u, {view, ...body});
  const plant = (back: number): Arm => {
    let to: Pt = [hip[0] - dir * back * u, g[1] - 0.01 * u];
    const dx = to[0] - s0[0], dy = to[1] - s0[1], d = Math.hypot(dx, dy), reach = 2 * L * 0.995;
    if (d > reach) to = [s0[0] + (dx / d) * reach, s0[1] + (dy / d) * reach];
    const dd = Math.min(Math.hypot(to[0] - s0[0], to[1] - s0[1]), reach), h = Math.sqrt(Math.max(0, L * L - (dd / 2) ** 2));
    const mx = (s0[0] + to[0]) / 2, my = (s0[1] + to[1]) / 2, nx = -(to[1] - s0[1]) / dd, ny = (to[0] - s0[0]) / dd;
    const sg = Math.sign(nx * -dir || 1);
    return {via: [mx + sg * nx * h, my + sg * ny * h], to};
  };
  const near = plant(0.3), far = plant(0.24);
  return view === 'left' ? {lArm: near, rArm: far} : {rArm: near, lArm: far};
};

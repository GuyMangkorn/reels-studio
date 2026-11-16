import {camMove, camOf, type CamMove} from '../kit/cam-moves';
import {drawAnimal, type AnimalAnchors, type AnimalPose} from '../kit/animals';
import type {FigAnchors} from '../kit/cast';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import {tintPainter, type Painter, type Pt} from '../kit/painter';
import {LONG_LINE, paintLongLine, paintStopwatch} from '../kit/props';
import type {V3} from '../kit/space';
import {paintSorted, type Item} from '../kit/world';
import {washAt} from '../kit/draw';
import {makePainter, mixColor} from '../kit/painter';
import type {Brush} from '../BrushCanvas';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {DOG, GIRL, HARNESS, MUM, STOPWATCH_R} from './cast';
import {F, fieldItems, groundShadow, paintFieldBack, sunOf, type SunRef} from './field';
import type {GlowSpot} from './glow';
import {matRowItems, matStackItem, paintMatW, type MatColor} from './mats';
import {paintTrailW, type Print} from './trail';

// EDU-EP19 field shot painter (W3 look frames, reused by the W5 shot files): SET-FIELD19 back pass, then the depth-sorted set items, mats and
// cast, then the long line from MUM's left hand (or an off-frame point) to the harness ring, re-solved every frame from both anchors
// (brief technical handoff: sag 0.25 m at 3 m span). Shots select states; the art lives in field.ts, trail.ts, mats.ts and the kit.

export type DogState = {at: V3; pose: AnimalPose; /** Draw order bias, m (negative = nearer). */ bias?: number};
/** QA out-parameter: picture anchors of the cast for the lead-height and zone measures. */
export type FieldProbe = {dog?: AnimalAnchors & {g?: Pt; top?: Pt}; girl?: FigAnchors | null; mum?: FigAnchors | null};
export type FieldShot = {
  sun: SunRef; t: number;
  prints?: Print[];
  mats?: {order: MatColor[]; prints?: number};
  stack?: boolean;
  dog?: DogState;
  mum?: Omit<FigureAtOpts, 't'>;
  girl?: Omit<FigureAtOpts, 't'> & {bias?: number};
  /** Long line to the harness ring: from MUM's left hand (`'mum'`) or a world point (MUM off frame). */
  line?: 'mum' | V3;
  /** FQ1 (user, 2026-11-15): picture y (px) below which the near lawn is painted as near shade, one value step under the lit lawn, so the
   *  strip under a nose-down action floor reads as ground in shade (stroke captions read on it), not as bright empty lawn. */
  nearShade?: number;
  /** Draw the long line UNDER the dog (VD17, B03-SH05 front view: it leaves the ring behind the withers and rises behind the back). */
  lineUnder?: boolean;
  /** W5: the mat stack's top mat moved by this offset (m) in B03-SH02 (the girl drags it off); absent = in place. */
  stackTop?: V3;
  /** W5: mats placed one by one (slap-down, lift-swap) instead of the straight `mats` row: centre, colour, footprint 0..1, height, yaw. */
  matList?: MatPlace[];
  /** W5: extra depth-sorted items of a shot (hands, props) and a pass painted after the sorted set and the line (foreground). */
  items?: (p: Painter, c: YCam) => Item[];
  after?: (p: Painter, c: YCam, probe: FieldProbe) => void;
  probe?: FieldProbe;
};
export type MatPlace = {at: V3; color: MatColor; print?: number; y?: number; yaw?: number};

/** Warm rim on the black coat (brief: the low sun from behind-left is the only light): a tinted copy offset toward the light, under the dog. */
const RIM_OFF: Pt = [-0.7, -1];
/** Horizontal direction toward the sun in space F (set plan: (-0.62, 0.47, -0.62)), the same azimuth in every round. */
const SUN_XZ: [number, number] = [-Math.SQRT1_2, -Math.SQRT1_2];
/** VD16 (R2): rim strength for a camera = clamp(dot(camera forward, sun direction), 0.25, 1), both horizontal; still one-sided (RIM_OFF). */
export const rimStrength = (c: YCam) => Math.max(0.25, Math.min(1, Math.sin(c.yaw) * SUN_XZ[0] - Math.cos(c.yaw) * SUN_XZ[1]));
const dogItem = (p: Painter, c: YCam, st: FieldShot, d: DogState, out: AnimalAnchors & {g?: Pt}): Item => ({at: d.at, bias: d.bias, draw: () => {
  const g = camPoint(c, d.at), u = camUnit(c, d.at);
  if (!g) return;
  groundShadow(p, c, 9700, st.sun, d.at, 0.4, 0.2, 0.6, 85);
  const pose: AnimalPose = {...d.pose, harness: HARNESS}, rim = rimStrength(c), o = Math.max(1.6, 0.012 * u) * rim;
  if (st.lineUnder && st.line && st.line !== 'mum') {
    // Ring anchor from a dry run (no marks), then the line before the dog so the body covers it.
    const dry: AnimalAnchors = {};
    drawAnimal(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0}), DOG.seed, DOG, g, u, pose, st.t, dry);
    const from = camPoint(c, st.line);
    if (from && dry.ring) paintLongLine(p, 9800, from, dry.ring, {sag: 0.25 * u, width: Math.max(1.6, 0.008 * u * 1.4), color: LONG_LINE});
  }
  drawAnimal(tintPainter(p, sunOf(st.sun).warm, 0.5 + 0.3 * rim, {brush: true}), DOG.seed, DOG, [g[0] + RIM_OFF[0] * o, g[1] + RIM_OFF[1] * o], u, pose, st.t);
  drawAnimal(p, DOG.seed, DOG, g, u, pose, st.t, out);
  out.g = g;
}});

/** FQ1 near shade: a soft-edged wash from picture y `y0` to the frame bottom, the lawn one value step darker (feathered over ~60 px). */
const paintNearShade = (p: Painter, sun: SunRef, y0: number) => {
  const S = sunOf(sun), col = mixColor(S.lit, S.shade, 0.6), edge = (dy: number, amp: number): Pt[] => [
    ...Array.from({length: 23}, (_, i): Pt => [-40 + i * 52, y0 + dy + amp * Math.sin(i * 1.7) + amp * 0.6 * Math.sin(i * 0.63 + 1)]),
    [1100, 1960], [-40, 1960]];
  washAt(p, 9600, col, 90, edge(-30, 10), 0.1, 0.25);
  washAt(p, 9601, col, 170, edge(10, 14), 0.1, 0.25);
  washAt(p, 9602, mixColor(col, S.shade, 0.5), 110, edge(220, 18), 0.1, 0.25);
};

/** MUM's stopwatch on her left wrist (draft fix round 1, B02-SH06 "the watch does not follow the wrist"): 0.07 m up the forearm from the hand
 *  (elbow = the upper-arm midpoint mirrored past the shoulder), the strap across the forearm; a foreshortened forearm (< 0.06 m on screen) falls
 *  back to the hanging direction. */
export const mumWatchAt = (a: FigAnchors, u: number): {c: Pt; angle: number} => {
  const e: Pt = [2 * a.lUpper[0] - a.lShoulder[0], 2 * a.lUpper[1] - a.lShoulder[1]];
  const dx = a.lHand[0] - e[0], dy = a.lHand[1] - e[1], L = Math.hypot(dx, dy);
  const [ux, uy] = L > 0.06 * u ? [dx / L, dy / L] : [0, 1];
  return {c: [a.lHand[0] - ux * 0.07 * u, a.lHand[1] - uy * 0.07 * u], angle: Math.atan2(uy, ux)};
};
const paintMumWatch = (q: Painter, a: FigAnchors, u: number) => {
  const w = mumWatchAt(a, u), r = Math.max(1.5, STOPWATCH_R * u);
  paintStopwatch(q, 9760, w.c, r, {angle: w.angle, wrist: Math.max(r * 2.4, 0.06 * u)});
};

export const paintFieldShot = (p: Painter, c: YCam, st: FieldShot) => {
  paintFieldBack(p, c, st.sun);
  if (st.prints) paintTrailW(p, c, st.prints, {grass: sunOf(st.sun).lit});
  if (st.nearShade !== undefined) paintNearShade(p, st.sun, st.nearShade);
  const dogA: AnimalAnchors & {g?: Pt} = {}, items: Item[] = [];
  let mumA: FigAnchors | null = null, girlA: FigAnchors | null = null;
  if (st.stack !== false) items.push(matStackItem(p, c, F.ST, {top: st.stackTop}));
  if (st.mats) items.push(...matRowItems(p, c, st.mats.order, {prints: st.mats.prints}));
  if (st.matList) st.matList.forEach((m, i) => items.push({at: [m.at[0], 0, m.at[2]], bias: (m.y ?? 0) > 0.05 ? -0.2 : 0.6, draw: () => paintMatW(p, c, 9500 + i * 50, m.at, m.color, {print: m.print, yaw: m.yaw, y: m.y})}));
  if (st.items) items.push(...st.items(p, c));
  if (st.dog) items.push(dogItem(p, c, st, st.dog, dogA));
  if (st.mum) {
    const o = st.mum;
    items.push({at: o.at, draw: () => {
      groundShadow(p, c, 9750, st.sun, o.at, 0.25, 0.18, 1.64, 100);
      mumA = paintFigureAt(p, c, MUM, {...o, t: st.t, shadow: false, held: (q, a, u) => { paintMumWatch(q, a, u); o.held?.(q, a, u); }});
    }});
  }
  if (st.girl) {
    const {bias, ...o} = st.girl;
    items.push({at: o.at, bias, draw: () => {
      groundShadow(p, c, 9780, st.sun, o.at, 0.2, 0.14, 1.34, 100);
      girlA = paintFigureAt(p, c, GIRL, {...o, t: st.t, shadow: false});
    }});
  }
  paintSorted(p, c, fieldItems(p, c, st.sun, items));
  if (st.dog && st.line && dogA.ring && !st.lineUnder) {
    const from = st.line === 'mum' ? (mumA as FigAnchors | null)?.lHand ?? null : camPoint(c, st.line);
    if (from) {
      const mid: V3 = st.line === 'mum' && st.mum ? [(st.mum.at[0] + st.dog.at[0]) / 2, 0.6, (st.mum.at[2] + st.dog.at[2]) / 2] : st.dog.at;
      const u = camUnit(c, mid);
      paintLongLine(p, 9800, from, dogA.ring, {sag: 0.25 * u, width: Math.max(1.6, 0.008 * u * 1.4), color: LONG_LINE});
    }
  }
  if (st.probe) { st.probe.dog = dogA; st.probe.girl = girlA; st.probe.mum = mumA; }
  st.after?.(p, c, {dog: dogA, girl: girlA, mum: mumA});
};

// ------------------------------------------------------------------------------------------------ sheet cameras
/** Sheet camera line -> kit camera: the sheets write `camMove(at, yaw, r, eye, {f, hy, pitch})` with camera = at + r(-sin yaw, 0, cos yaw),
 * yaw + toward +x (brief projection contract); the kit `camMove` takes the azimuth (camera = at + r(sin az, 0, cos az)), so az = -yaw. */
export const sheetMove = (at: V3 | [V3, V3], yaw: [number, number], r: [number, number] | number, eye: [number, number] | number, o: {f: number; hy: number; pitch?: [number, number]}) =>
  camMove(at, [-yaw[0], -yaw[1]], r, eye, o);
/** easeInOutSine of a shot fraction. */
export const sine01 = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));
/** The sheet camera at shot-local frame L of N (easeInOutSine over the shot). */
export const sheetCam = (m: CamMove, L: number, N: number): YCam => camOf(m, sine01(L / N));

/** A field shot from the sheets: length N (frames), camera and state at shot-local frame L, and the glow spots (SVG layer, VD04). */
export type FieldShotDef = {
  id: string; N: number; cam: (L: number) => YCam; state: (L: number) => FieldShot; glow?: (L: number) => GlowSpot[];
  /** W5 plates: a whole custom paint (insert, iris) instead of `paintFieldShot(cam, state)`, and SVG/DOM layers over the glow (digits, ghost row, ring). */
  paint?: (p: Painter, L: number) => void;
  overlay?: (L: number) => import('react').ReactNode;
};

/** One look-frame / plate still: the shot, composition frame G, shot frame L, the canvas paint, and the SVG layers above it. */
export type LookFrame = {shot: string; G: number; L: number; paint: (p: Painter, probe?: FieldProbe) => void; cam?: YCam; glow?: GlowSpot[]; overlay?: import('react').ReactNode};

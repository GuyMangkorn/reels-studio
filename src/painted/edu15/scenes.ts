import type {FigAnchors} from '../kit/cast';
import {washAt} from '../kit/draw';
import {wp} from '../kit/world';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintManHang, paintWomanPhone} from './cast';
import {paintMacroCarpet, paintPadUnderside} from './macro';
import {paintMicroContact} from './micro';
import {C, CEIL, lookCam, RIG_H, RIG_Z, T0, W0_FEET} from './palette';
import {paintBackWall, paintCeiling, paintLamp, paintMoth, paintShell, paintSlippers, paintSofaSide, paintTable} from './room';
import {ceilingFrame, hangFrame, hangLegs, paintTokay, paintTokayShadow, restLegs, type FootId, type Frame, type TokayMeasure, type TokayPose} from './tokay';

// EDU-EP15-SHORT look frames (W3; brief EDU-EP15-BRIEF-R1.1 "Look frames", rows EDU-EP15-ROWS-R1.1) and the tokay look-check stills (SP1).
// Pure paint functions; cameras are the brief's `pos -> look-at` lines at the named frame, tuned where marked "W3" (recorded in task.md).
// LF01 SET-LR15 real night (S01-B01-SH01 @ +20), LF02 ceiling grazing close (S01-B01-SH03 @ +60), LF03 toe macro T (S01-B03-SH01 @ +80),
// LF04 micro U (S01-B03-SH06 @ +45), LF05A imagined hang wide (S01-B01-SH02 @ +36), LF05B the curl (S01-B05-SH01 @ +26).

export const LF_IDS = ['LF01', 'LF02', 'LF03', 'LF04', 'LF05A', 'LF05B', 'TK1', 'TK2', 'TK4', 'TK5', 'TK6', 'TK7', 'TK8'] as const;
export type LfId = (typeof LF_IDS)[number];
export type Measure = {lead?: {top: number; bottom: number}; extra?: Record<string, number | string>; cam?: YCam};
export const MEASURE: Record<string, Measure> = {};
const T = 0.4;

// ---- shared pieces
const restPose = (o: Partial<TokayPose> = {}): TokayPose => ({legs: restLegs(), tips: {hl: 0.6, hr: 0.6, fl: 0.15, fr: 0.15}, ...o});
const T0F = ceilingFrame(T0.at, T0.heading);
const roomBack = (p: Painter, c: YCam, o: {focus?: V3; stippleR?: number; stippleStep?: number; halo?: number} = {}) => {
  paintShell(p, c);
  paintCeiling(p, c, {focus: o.focus, stippleR: o.stippleR, stippleStep: o.stippleStep});
  paintLamp(p, c, {halo: o.halo ?? 1, t: T});
  paintBackWall(p, c);
};
const tok = (p: Painter, c: YCam, f: Frame, pose: TokayPose, shadow = true): TokayMeasure => {
  if (shadow) paintTokayShadow(p, c, f, 61990, [0.004, 0.006]);
  return paintTokay(p, c, f, pose, {t: T});
};
const mFig = (a: FigAnchors | null) => (a ? {top: a.top, bottom: a.bottom} : undefined);
const tkExtra = (m: TokayMeasure, pre = 'tk'): Record<string, number> => ({[`${pre}Len`]: m.lengthPx, [`${pre}Top`]: m.box[1], [`${pre}Bottom`]: m.box[3], [`${pre}Left`]: m.box[0], [`${pre}Right`]: m.box[2], [`${pre}PxPerM`]: m.pxPerM,
  ...Object.fromEntries((['fl', 'fr', 'hl', 'hr'] as FootId[]).flatMap((k) => [[`${pre}Foot_${k}`, m.footPx[k]], [`${pre}FootY_${k}`, Math.round(m.feet[k]?.[1] ?? -1)]]))});

// ---- LF01: S01-B01-SH01 @ +20 (hold +0-+40 at the start camera). Brief camera; W3: hy 960 -> 860 lifts the frame so the phone and her chest clear
// the caption band (her lap and the sofa seat sit in it) and the lamp stays in frame.
export const camLF01 = lookCam([0.1, 0.7, 1.5], [0.0, 1.3, -0.75], 950, {hy: 860});
export const paintLF01 = (p: Painter) => {
  const c = camLF01;
  roomBack(p, c);
  const m = tok(p, c, T0F, restPose());
  paintMoth(p, c, [-0.32, 2.56, 0.16], 0.3);
  paintSofaSide(p, c);
  const a = paintWomanPhone(p, c, {at: W0_FEET, face: 'neutral', faceState: {look: [0, 0.6]}, t: T, glow: 1, tint: 0.05});
  paintSlippers(p, c);
  paintTable(p, c);
  const lamp = camPoint(c, [0, 2.665, 0]);
  MEASURE.LF01 = {lead: mFig(a), cam: c, extra: {faceY: Math.round(a?.head[1] ?? 0), feetY: Math.round(a?.feet[1] ?? 0), pxPerM: Math.round(camUnit(c, [-0.35, 0.98, -0.8])), lampY: Math.round(lamp?.[1] ?? 0), lampX: Math.round(lamp?.[0] ?? 0), ...tkExtra(m)}};
};

// ---- LF02: S01-B01-SH03 @ +60 (end framing). W3 camera change: the brief's camera (0.33, 2.63, -0.02) sits on the tokay's RIGHT side, so the hero
// front-left foot is the far foot behind the neck and belly; mirrored to the sofa side (z -0.315, looking +z) the front-left foot is the near foot, the
// body and head sit behind it, the lamp spill comes from the screen right. Same distance class (~6100 px/m at the foot), near 0.01.
const FL_PALM: V3 = [0.32, CEIL, -0.18];
// W3 v3: eye lifted to body height, 33 mm under the plaster (2.635 -> 2.667), so the ceiling reads edge-on (brief: "rough plaster edge-on"), the body
// hangs below it showing its spotted flank (not the pale belly) and the legs reach up to the contact line; hy 860 keeps the wall out of the top half.
export const camLF02 = lookCam([0.305, 2.667, -0.315], [0.315, 2.671, -0.18], 1000, {hy: 860, near: 0.01});
const grazing = (p: Painter, c: YCam, pose: TokayPose, key: string) => {
  roomBack(p, c, {focus: FL_PALM, stippleR: 0.28, stippleStep: 0.0075, halo: 0.6});
  const m = tok(p, c, T0F, pose);
  const ft = camPoint(c, FL_PALM, 0.01);
  MEASURE[key] = {cam: c, extra: {...tkExtra(m), contactY: Math.round(ft?.[1] ?? 0), pxPerMFoot: Math.round(camUnit(c, FL_PALM, 0.01))}};
};
export const paintLF02 = (p: Painter) => grazing(p, camLF02, restPose(), 'LF02');
/** TK4: the same foot mid-roll 0.5 (S01-B04-SH02 @ +30). */
export const paintTK4 = (p: Painter) => grazing(p, camLF02, restPose({roll: {fl: 0.5}}), 'TK4');

// ---- LF05: the imagined hang on rig H (no woman, sofa empty). Tail painted first (behind his head), then MAN, then the tokay body and feet.
// W3.1 (Q-F6): the rig and its three cameras (LF05A, LF05B, TK7) moved +0.5 m in z together, so the framings keep their distances.
const HANG_VENT: V3 = [0.33, 2.53, RIG_Z];
const DZ = 0.5;
const hangPose = (o: Partial<TokayPose> = {}): TokayPose => ({legs: hangLegs(), headPitch: -22, tail: [0, 0.03], legsOver: true, roll: {hl: 0.75, hr: 0.75}, ...o});
const hangShot = (p: Painter, c: YCam, key: string, pose: TokayPose) => {
  roomBack(p, c);
  paintSofaSide(p, c);
  // his shadow straight under the lamp onto the floor in front of the sofa (the floor-gap cue; W3)
  const sh = wp(c, Array.from({length: 18}, (_, i): V3 => [0.42 + 0.2 * Math.cos((i / 18) * Math.PI * 2), 0.002, RIG_Z - 0.04 + 0.12 * Math.sin((i / 18) * Math.PI * 2)]));
  if (sh.length > 2) washAt(p, 61980, '#1f1a15', 120, sh, 0.25, 0.2);
  paintTable(p, c);
  const f = hangFrame(HANG_VENT);
  paintTokay(p, c, f, pose, {t: T, part: 'tail'});
  const a = paintManHang(p, c, {wrists: RIG_H.wrists, face: 'scared', faceState: {look: [0, -0.7]}, t: T});
  const m = paintTokay(p, c, f, pose, {t: T, part: 'body'});
  const floor = camPoint(c, [0.33, 0, RIG_Z]);
  MEASURE[key] = {lead: mFig(a), cam: c, extra: {...tkExtra(m), manTop: Math.round(a?.top ?? 0), manFeetY: Math.round(a?.feet[1] ?? 0), floorY: Math.round(floor?.[1] ?? 0),
    floorGapPx: Math.round((floor?.[1] ?? 0) - (a?.feet[1] ?? 0)), wristY: Math.round(((a?.rHand[1] ?? 0) + (a?.lHand[1] ?? 0)) / 2), eyesY: Math.round(a?.head[1] ?? 0), feetM: a ? a.feetM[1].toFixed(2) : ''}};
};
/** S01-B01-SH02 @ +36 (end of the pull-back): `ycam pos (0.30, 1.10, 2.00), look-at (0.33, 1.30, -0.12), f 900`. */
// W3: eye 1.10 -> 1.35 m so his hanging feet clear the sofa back (at 1.10 they sat on it and read as standing on the sofa).
// W3.1 (Q-F6): with the rig moved alone (camera (0.3, 1.35, 2.5) -> (0.33, 1.45, 0.38)) his feet (0.70 m, kit MAN) still projected onto the sofa
// seat: the sofa back (0.72 m) is level with his feet, so no eye height on the front axis separates them. The camera swings to the room's left
// front (yaw about 40 deg), eye 1.0 looking up, so the sofa sits screen left of his legs and his feet hang over open floor against the wall.
// The fan stand (x 1.6) stays behind his legs; its base is hidden by the table.
export const camLF05A = lookCam([-1.5, 1.0, 2.2], [0.33, 1.5, 0.38], 1000);
export const paintLF05A = (p: Painter) => hangShot(p, camLF05A, 'LF05A', hangPose());
/** S01-B05-SH01 @ +26 (push end): `pos (0.33, 2.36, 0.40), look-at (0.33, 2.52, -0.12), f 1100`; the front-right foot (screen left) half curled. */
// W3: pushed in (z 0.40 -> 0.18, f 1100 -> 1450, look-at y 2.52 -> 2.57, hy 800) so each front foot reads >= 40 px (the half-curled one included)
// with the wrists above y 1160; same axis.
export const camLF05B = lookCam([0.33, 2.4, 0.18 + DZ], [0.33, 2.57, -0.12 + DZ], 1450, {hy: 800, near: 0.02});
export const paintLF05B = (p: Painter) => hangShot(p, camLF05B, 'LF05B', hangPose({roll: {fr: 0.45, hl: 0.75, hr: 0.75}}));

// ---- LF03 / LF04: macro (T, mm) and micro (U, um); see macro.ts and micro.ts
export const paintLF03 = (p: Painter) => { MEASURE.LF03 = {extra: paintMacroCarpet(p, {t: T})}; };
export const paintLF04 = (p: Painter) => { MEASURE.LF04 = {extra: paintMicroContact(p, {t: T, glints: 0.45})}; };

// ---- tokay look-check stills (SP1). A body-length bar (0.29 m, check only) lies on the plaster beside the ceiling stills.
const bar = (p: Painter, c: YCam, a: V3, b: V3) => {
  const qa = camPoint(c, a, c.near ?? 0.01), qb = camPoint(c, b, c.near ?? 0.01);
  if (qa && qb) { p.inkStill(61900, 'pen', C.ink, 3); p.brush.line(qa[0], qa[1], qb[0], qb[1]); }
};
/** TK1 dorsal rest on the ceiling with K02 tips (from below, whole animal). */
export const camTK1 = lookCam([0.44, 2.2, 0.12], [0.4, 2.7, -0.13], 1000, {hy: 900, near: 0.02});
export const paintTK1 = (p: Painter) => {
  const c = camTK1;
  roomBack(p, c, {focus: T0.at, stippleR: 0.3, stippleStep: 0.012});
  const m = tok(p, c, T0F, restPose());
  bar(p, c, [0.57, CEIL - 0.001, -0.26], [0.28, CEIL - 0.001, -0.26]);
  MEASURE.TK1 = {cam: c, extra: tkExtra(m)};
};
/** TK2 left profile on the ceiling (grazing, from the sofa side). */
export const camTK2 = lookCam([0.4, 2.645, -0.56], [0.4, 2.675, -0.12], 1000, {hy: 820, near: 0.01});
export const paintTK2 = (p: Painter) => {
  const c = camTK2;
  roomBack(p, c, {focus: [0.42, CEIL, -0.2], stippleR: 0.3, stippleStep: 0.01, halo: 0.7});
  const m = tok(p, c, T0F, restPose());
  MEASURE.TK2 = {cam: c, extra: tkExtra(m)};
};
/** TK5 the lifted foot's pad with ridges (S01-B03-SH01 +0), room scale. */
export const paintTK5 = (p: Painter) => { MEASURE.TK5 = {extra: paintPadUnderside(p, {t: T})}; };
/** TK6 front, head raised off the plaster, jaw open (the call, S01-B05-SH04 V03); at T3. */
const T3F = ceilingFrame([0.2, CEIL, -0.18], 180);
export const camTK6 = lookCam([-0.06, 2.56, -0.46], [0.12, 2.67, -0.18], 1100, {hy: 900, near: 0.02}); // W3: three-quarter front from below (the straight-on view read as a cone)
export const paintTK6 = (p: Painter) => {
  const c = camTK6;
  roomBack(p, c, {focus: [0.08, CEIL, -0.18], stippleR: 0.2, stippleStep: 0.01});
  const m = tok(p, c, T3F, restPose({headPitch: 40, jaw: 0.8}));
  MEASURE.TK6 = {cam: c, extra: tkExtra(m)};
};
/** TK8 the catch: the moth held whole across the jaws (S01-B05-SH03 +20..+31). */
export const paintTK8 = (p: Painter) => {
  const c = camTK6;
  roomBack(p, c, {focus: [0.08, CEIL, -0.18], stippleR: 0.2, stippleStep: 0.01});
  const m = tok(p, c, T3F, restPose({headPitch: 34, jaw: 0.3, moth: 0.034}));
  MEASURE.TK8 = {cam: c, extra: tkExtra(m)};
};
/** TK7 hang-front close (imagined): belly to the lens, front feet flat on the plaster, hind feet on his wrists. */
export const camTK7 = lookCam([0.33, 2.47, 0.17 + DZ], [0.33, 2.585, -0.12 + DZ], 1000, {hy: 900, near: 0.02});
export const paintTK7 = (p: Painter) => hangShot(p, camTK7, 'TK7', hangPose());

import {drawFigure, type Arm, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {tintPainter, type Painter, type Pt} from '../kit/painter';
import {layerMotion, type MotionId} from '../kit/motions';
import {PEOPLE} from '../kit/people';
import {poseFor, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam, type View4} from '../kit/views';
import {dress} from '../kit/wardrobe';
import {camPoint, camUnit, viewAngle, type YCam} from '../kit/ycam';

// EDU-EP07-SHORT cast (brief EDU-EP07-BRIEF-R1 VD02/VD03). VEN = `woman-ponytail + vendor`, CUS = `man-crop` (kit outfit). Both are flat
// cards at their ground point, held square to the lens (`squareToCam`); arm targets that touch world props come from the yaw camera.

/** VEN: the kit person in the kit `vendor` outfit (cream shirt, teal apron). */
export const VEN: CastDef = dress(PEOPLE['woman-ponytail'], 'vendor');
/** CUS: the kit `man-crop` (grey-blue short-sleeve work shirt). */
export const CUS: CastDef = PEOPLE['man-crop'];

export type PersonOpts = {
  at: V3; view: View4; pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; fig?: Partial<FigPose>; t: number;
  /** Cool/warm grade over the rig colours: [toward, u, mul?]. */
  grade?: [string, number, [number, number, number]?];
  /** Hand targets in world metres (override the pose's arms): the camera projects them. */
  hands?: {r?: {to: V3; via?: V3; out?: -1 | 1}; l?: {to: V3; via?: V3; out?: -1 | 1}};
  /** A kit motion layered on `pose` (`layerMotion`), at motion time `t` seconds: the seated look-around, talk, point. */
  motion?: {id: MotionId; t: number};
};

const armAt = (c: YCam, h: {to: V3; via?: V3; out?: -1 | 1}, mirrorAbout?: number): Arm | undefined => {
  const to = camPoint(c, h.to), via = h.via ? camPoint(c, h.via) : undefined;
  const m = (q: Pt): Pt => (mirrorAbout === undefined ? q : [2 * mirrorAbout - q[0], q[1]]); // the back view mirrors front-view arm targets about the centre line
  return to ? {to: m(to as Pt), ...(via ? {via: m(via as Pt)} : {}), out: h.out} : undefined;
};

/** One person through the yaw camera: a flat card at the ground point, view held square to `cam`. */
export const paintPerson = (p: Painter, c: YCam, def: CastDef, o: PersonOpts): FigAnchors | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const facing = squareToCam(c, o.at, o.view);
  const a = viewAngle(c, o.at, facing), view: FigPose['view'] = Math.abs(a) <= 45 ? 'front' : Math.abs(a) >= 135 ? 'back' : a > 0 ? 'right' : 'left';
  const pose = poseFor(o.pose ?? 'P01', def, g, u, view === 'back' ? 'front' : view);
  const face = {...EXPRESSIONS[o.face ?? 'neutral'], ...(o.faceState ?? {})} as FaceState;
  const arms: Partial<FigPose> = {};
  const mir = view === 'back' ? g[0] : undefined;
  if (o.hands?.r) { const a2 = armAt(c, o.hands.r, mir); if (a2) arms.rArm = a2; }
  if (o.hands?.l) { const a2 = armAt(c, o.hands.l, mir); if (a2) arms.lArm = a2; }
  const q = o.grade ? tintPainter(p, o.grade[0], o.grade[1], {brush: true, ...(o.grade[2] ? {mul: o.grade[2]} : {})}) : p;
  if (o.motion && view !== 'back') {
    const l = layerMotion({person: def, motion: o.motion.id, t: o.motion.t, g, unit: u, view, pose: o.pose ?? 'P01', expression: face});
    return drawFigure(q, l.def, l.g, u, {...l.pose, ...arms, ...o.fig}, o.t, l.seed);
  }
  return drawFigure(q, def, g, u, {...pose, view, face, ...arms, ...o.fig}, o.t);
};

/** A world point beside a figure in the camera's frame: `right` m toward the lens-right, `up` m, `toward` m toward the camera (for a hand in front of the face). */
export const nearCam = (c: YCam, at: V3, right: number, up: number, toward: number): V3 => {
  const dx = c.x - at[0], dz = c.z - at[2], n = Math.hypot(dx, dz) || 1, tx = dx / n, tz = dz / n;
  const rx = tz, rz = -tx; // camera right on the ground plane (camera looks along -toward)
  return [at[0] + rx * right + tx * toward, at[1] + up, at[2] + rz * right + tz * toward];
};

import {drawFigure, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {tintPainter, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';
import {poseFor, poseMix, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam, type View4} from '../kit/views';
import {camPoint, camUnit, viewAngle, type YCam} from '../kit/ycam';
import {layerMotion, type MotionId} from '../kit/motions';
import {ANIMALS, drawAnimal, type AnimalPose} from '../kit/animals';

// EDU-EP13-SHORT cast (brief EDU-EP13-BRIEF-R1 VD02/VD03). MAN = `man-parted + home-lounge (outfit override: cardigan off)`: the kit outfit's
// rose T-shirt, grey lounge trousers and cream socks with the cardigan taken off (hot Thai afternoon, story first). Override only, as outfit data.
const parted = PEOPLE['man-parted'];
const lounge = dress(parted, 'home-lounge');
export const MAN: CastDef = {...lounge, outfit: {...lounge.outfit, jacket: undefined, longSleeves: false, sleeve: lounge.outfit.shirt}};
export const MAN_H = parted.height;

export type ManOpts = {
  at: V3; view: View4; pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; fig?: Partial<FigPose>; t: number; warm?: number;
  /** Pose `a` blended into `b` by `u` (W5.2: crouch and jump tracks); replaces `pose`. */
  mix?: {a: AnyPoseId; b: AnyPoseId; u: number};
  /** Root lift above the ground point (m): the standing jump. */
  lift?: number;
};

/** MAN through the yaw camera: flat card at the ground point (feet), view held square to `cam` (EP06 `paintOwn` method). */
export const paintMan = (p: Painter, c: YCam, o: ManOpts): FigAnchors | null => {
  const g0 = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g0) return null;
  const g: Pt = [g0[0], g0[1] - (o.lift ?? 0) * u];
  const facing = squareToCam(c, o.at, o.view);
  const a = viewAngle(c, o.at, facing), view: FigPose['view'] = Math.abs(a) <= 45 ? 'front' : Math.abs(a) >= 135 ? 'back' : a > 0 ? 'right' : 'left';
  const pv = view === 'back' ? 'front' : view;
  const pose = o.mix ? poseMix(o.mix.a, o.mix.b, o.mix.u, MAN, g, u, pv) : poseFor(o.pose ?? 'P31', MAN, g, u, pv);
  const face = {...EXPRESSIONS[o.face ?? 'neutral'], ...(o.faceState ?? {})} as FaceState;
  const q = o.warm ? tintPainter(p, '#ffcf8a', o.warm, {brush: true}) : p;
  return drawFigure(q, MAN, g, u, {...pose, view, face, ...o.fig}, o.t);
};

/** The dog (`dog-golden`) at the paw plane `at` (K8: `g` is the surface height). */
export const paintDog = (p: Painter, c: YCam, at: V3, pose: AnimalPose, t: number, warm = 0.06) => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  drawAnimal(tintPainter(p, '#ffcf8a', warm, {brush: true}), 8000, ANIMALS['dog-golden'], g, u, {contact: 1, polish: true, ...pose}, t);
};

/** MAN through a kit motion at motion time `mt` (s), drawn square to the camera like `paintMan`; `patch` overrides FigPose fields (head turn, face) after the motion. */
export const paintManMotion = (p: Painter, c: YCam, o: {at: V3; motion: MotionId; mt: number; pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; patch?: Partial<FigPose>; t: number; warm?: number}): FigAnchors | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const L = layerMotion({person: MAN, motion: o.motion, t: o.mt, g, unit: u, view: 'front', pose: o.pose ?? 'P01', expression: o.face ?? 'neutral'});
  const face = {...L.pose.face, ...(o.faceState ?? {})} as FaceState;
  const q = o.warm ? tintPainter(p, '#ffcf8a', o.warm, {brush: true}) : p;
  return drawFigure(q, MAN, L.g, u, {...L.pose, ...o.patch, face}, o.t, L.seed);
};

import {drawFigure, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {tintPainter, type Painter} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';
import {poseFor, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam, type View4} from '../kit/views';
import {camPoint, camUnit, viewAngle, type YCam} from '../kit/ycam';
import {ANIMALS, drawAnimal, type AnimalPose} from '../kit/animals';

// EDU-EP13-SHORT cast (brief EDU-EP13-BRIEF-R1 VD02/VD03). MAN = `man-parted + home-lounge (outfit override: cardigan off)`: the kit outfit's
// rose T-shirt, grey lounge trousers and cream socks with the cardigan taken off (hot Thai afternoon, story first). Override only, as outfit data.
const parted = PEOPLE['man-parted'];
const lounge = dress(parted, 'home-lounge');
export const MAN: CastDef = {...lounge, outfit: {...lounge.outfit, jacket: undefined, longSleeves: false, sleeve: lounge.outfit.shirt}};
export const MAN_H = parted.height;

export type ManOpts = {
  at: V3; view: View4; pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; fig?: Partial<FigPose>; t: number; warm?: number;
};

/** MAN through the yaw camera: flat card at the ground point (feet), view held square to `cam` (EP06 `paintOwn` method). */
export const paintMan = (p: Painter, c: YCam, o: ManOpts): FigAnchors | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const facing = squareToCam(c, o.at, o.view);
  const a = viewAngle(c, o.at, facing), view: FigPose['view'] = Math.abs(a) <= 45 ? 'front' : Math.abs(a) >= 135 ? 'back' : a > 0 ? 'right' : 'left';
  const pose = poseFor(o.pose ?? 'P31', MAN, g, u, view === 'back' ? 'front' : view);
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

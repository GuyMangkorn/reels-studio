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

// EDU-EP06-SHORT cast (brief EDU-EP06-BRIEF-R1.1 VD02). OWN = `woman-curly + new: home-lounge` (the EP02 cook, outfit changed).
// Outfit filed into the kit wardrobe by Boss at W5.2 (brief N7).

const curly = PEOPLE['woman-curly'];
/** OWN = `woman-curly` in the kit wardrobe outfit `home-lounge` (promoted from this file's W3 look-frame copy, W5.2). */
export const OWN: CastDef = dress(curly, 'home-lounge');

export type OwnOpts = {
  at: V3; view: View4; pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; fig?: Partial<FigPose>; t: number;
  /** Warm lamp tint (0..1) on the rig's colours. */
  warm?: number;
};

/** OWN through the yaw camera: flat card at the ground point (feet), view held square to `cam`. */
export const paintOwn = (p: Painter, c: YCam, o: OwnOpts): FigAnchors | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const facing = squareToCam(c, o.at, o.view);
  const a = viewAngle(c, o.at, facing), view: FigPose['view'] = Math.abs(a) <= 45 ? 'front' : Math.abs(a) >= 135 ? 'back' : a > 0 ? 'right' : 'left';
  const pose = poseFor(o.pose ?? 'P31', OWN, g, u, view === 'back' ? 'front' : view);
  const face = {...EXPRESSIONS[o.face ?? 'neutral'], ...(o.faceState ?? {})} as FaceState;
  const q = o.warm ? tintPainter(p, '#ffcf8a', o.warm, {brush: true}) : p;
  return drawFigure(q, OWN, g, u, {...pose, view, face, ...o.fig}, o.t);
};

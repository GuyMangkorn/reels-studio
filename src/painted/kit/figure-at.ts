import {drawFigure, type CastDef, type FigAnchors, type FigPose} from './cast';
import {ell, washAt} from './draw';
import {EXPRESSIONS, type ExpressionId} from './expressions';
import type {FaceState} from './head';
import {tintPainter, type Painter, type Pt} from './painter';
import {poseFor, type AnyPoseId} from './poses';
import type {V3} from './space';
import {figureView, figureView4, squareToCam, viewFields, type View4, type ViewFields, type ViewName} from './views';
import {camPoint, camUnit, type YCam} from './ycam';
import type {Item} from './world';

// Place a kit figure (`CastDef`) in a world-metre set seen through the yaw camera (painted 3D camera): the feet at a ground point,
// the size from the lens, the view either held square to the camera (`view`, the four-view default) or followed from a fixed world
// facing (`facing`, six views), a pose from the pose sheet, a named expression, a soft contact shadow, an optional tint and props
// drawn from the anchors. Copied from the four EDU copies (`edu05/cast.ts` paintTiny, `edu06/cast.ts` paintOwn,
// `edu04/checkout.ts` whoItem, `edu03/park.ts` ownerItem; 7 Nov 2026). A placement tool: which person, pose and face is the
// scene sheet's casting line.

export type FigureAtOpts = {
  /** Ground point under the feet (metres). */
  at: V3;
  /** Four-view figure squared to the lens: 'front' faces the camera, 'back' faces away, 'left'/'right' side-on (default 'front'). */
  view?: View4;
  /** Fixed world facing [x, z] instead of `view`: the view follows the camera through the six views (kit `figureView`). */
  facing?: [number, number];
  /** With `facing`: the previous view and a hysteresis in degrees, so a slow orbit does not flicker between views. */
  prevView?: ViewName; hysteresis?: number;
  /** Pose sheet id (default P01). A pose missing a side view falls back to P01 (kit `poseFor`). */
  pose?: AnyPoseId;
  face?: ExpressionId; faceState?: Partial<FaceState>;
  /** Any other `FigPose` fields (lean, headCock, hand targets, warm ...), applied last. */
  fig?: Partial<FigPose>;
  t: number;
  /** Shade the rig's colours toward `to` by `u` (kit `tintPainter`, brush fills included). */
  tint?: {to: string; u: number; mul?: [number, number, number]};
  /** Contact shadow under the feet: colour and opacity (default '#3b3226', 60), or false for none (airborne). */
  shadow?: {color?: string; op?: number} | false;
  /** Size factor on the lens scale (a child of the same rig, a shrink pop). */
  scale?: number;
  /** Props drawn after the figure from its anchors (`u` px per metre). */
  held?: (p: Painter, a: FigAnchors, u: number) => void;
  seed?: number;
};

/** The view fields a placement resolves to for this camera (four-view squared to the lens, or six-view from a world facing). */
export const viewAtCam = (c: YCam, o: Pick<FigureAtOpts, 'at' | 'view' | 'facing' | 'prevView' | 'hysteresis'>): ViewFields =>
  o.facing
    ? viewFields(figureView(c, o.at, o.facing, {prev: o.prevView, hysteresis: o.hysteresis}))
    : {view: figureView4(c, o.at, squareToCam(c, o.at, o.view ?? 'front'))};

/** Paint `def` standing at `o.at` through camera `c`. Returns the figure's picture anchors, or null when the feet are behind the lens. */
export const paintFigureAt = (p: Painter, c: YCam, def: CastDef, o: FigureAtOpts): FigAnchors | null => {
  const g = camPoint(c, o.at);
  if (!g) return null;
  const u = camUnit(c, o.at) * (o.scale ?? 1);
  const vf = viewAtCam(c, o);
  if (o.shadow !== false) washAt(p, (o.seed ?? def.seed) + 5101, o.shadow?.color ?? '#3b3226', o.shadow?.op ?? 60, ell(g[0], g[1], 0.32 * u, 0.06 * u, 16), 0.15, 0.2);
  const pose = poseFor(o.pose ?? 'P01', def, g as Pt, u, vf.view === 'back' ? 'front' : vf.view);
  const face = {...EXPRESSIONS[o.face ?? 'neutral'], ...(o.faceState ?? {})} as FaceState;
  const q = o.tint ? tintPainter(p, o.tint.to, o.tint.u, {mul: o.tint.mul, brush: true}) : p;
  const a = drawFigure(q, def, g, u, {...pose, ...vf, face, ...(o.shadow === false ? {noShadow: true} : {}), ...o.fig}, o.t, o.seed ?? def.seed);
  o.held?.(q, a, u);
  return a;
};

/** The placement as a depth-sorted set item (kit `paintSorted`); `out.a` receives the anchors when it is painted. */
export const figureItem = (def: CastDef, o: FigureAtOpts, extra: {bias?: number; out?: {a?: FigAnchors | null}} = {}): Item => ({
  at: o.at,
  bias: extra.bias,
  draw: (p, c) => { const a = paintFigureAt(p, c, def, o); if (extra.out) extra.out.a = a; },
});

import {bodyFrame, drawFigure, type CastDef, type FigAnchors, type FigPose} from './cast';
import {ell, washAt} from './draw';
import {EXPRESSIONS, type ExpressionId} from './expressions';
import type {FaceState} from './head';
import {tintPainter, type Painter, type Pt} from './painter';
import {poseFor, type AnyPoseId} from './poses';
import type {V3} from './space';
import {figureView, figureView4, squareToCam, viewFields, type View4, type ViewFields, type ViewName} from './views';
import {camPoint, camUnit, viewAngle, type YCam} from './ycam';
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
  /**
   * With `facing` (KIT-VIEW-AUDIT VA04, opt-in): a three-quarter view turns by the real camera angle (`quarterDeg` = the angle off the
   * front, held to 15..60) instead of the fixed 45, so an orbit turns the figure step by step through the quarter sector. Default true (13 Nov 2026); false = the fixed 45.
   */
  quarterFollow?: boolean;
  /** With `facing` (VA02): eight views, adding the back three-quarter views between the profiles and the back (`VIEW_SECTORS8`). Default true (13 Nov 2026); false = six. */
  backQuarter?: boolean;
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
  /** Whole-card roll in degrees about the hips (B1, floating figures; positive = the head tips toward screen right, as `headCock`). The body,
   * head, arms and `held` props rotate together and the returned anchors are the rotated ones. Use with `shadow: false`. Default 0 = as before. */
  roll?: number;
  /**
   * High and low cameras (KIT-VIEW-AUDIT VA03, opt-in): the head takes its perspective size (larger from above, smaller from below,
   * `headPerspective`), the card is squashed vertically to the height the camera really sees between
   * the feet and the head top when seen from above, and the face shifts on the head sphere by the elevation at the head (`FigPose.headPitch`; an 8 deg dead
   * zone keeps eye-level shots as they are). Default true (13 Nov 2026); false = the flat card as before.
   */
  pitchCue?: boolean;
  /** Size factor on the lens scale (a child of the same rig, a shrink pop). */
  scale?: number;
  /** Props drawn after the figure from its anchors (`u` px per metre). */
  held?: (p: Painter, a: FigAnchors, u: number) => void;
  seed?: number;
};

/** Hip joint of a figure in picture px (the roll pivot): `g` the ground point, `u` px per metre, `fig` the body fields (crouch, lift ...). */
export const hipAnchor = (def: CastDef, g: Pt, u: number, fig: Partial<FigPose> & {view: FigPose['view']}): Pt => {
  const f = bodyFrame(def, fig);
  return [g[0] + (fig.view === 'front' ? 0 : fig.view === 'left' ? -1 : 1) * f.hipU * u, g[1] - (f.hipV + f.lift) * u];
};
/** Rotate a picture point about `c` by `deg` (positive = clockwise on screen, y down: the top moves toward screen right). */
export const rollPt = (q: Pt, c: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a), x = q[0] - c[0], y = q[1] - c[1];
  return [c[0] + x * co - y * si, c[1] + x * si + y * co];
};
/** Run `draw` with the brush rotated by `deg` about `c` (no-op at 0). */
export const withRoll = (p: Painter, c: Pt, deg: number, draw: () => void) => {
  if (!deg) { draw(); return; }
  p.brush.push();
  p.brush.translate(c[0], c[1]);
  p.brush.rotate((deg * Math.PI) / 180);
  p.brush.translate(-c[0], -c[1]);
  draw();
  p.brush.pop();
};
/** Run `draw` with the brush squashed vertically by `sy` about the ground point `g` (no-op at 1). */
export const withSquash = (p: Painter, g: Pt, sy: number, draw: () => void) => {
  if (sy === 1) { draw(); return; }
  p.brush.push();
  p.brush.translate(g[0], g[1]);
  p.brush.scale(1, sy);
  p.brush.translate(-g[0], -g[1]);
  draw();
  p.brush.pop();
};
/** Anchors squashed vertically by `sy` about `g`. */
export const squashAnchors = <T extends FigAnchors>(a: T, g: Pt, sy: number): T => {
  if (sy === 1) return a;
  const Y = (y: number) => g[1] + (y - g[1]) * sy, P = (q: Pt): Pt => [q[0], Y(q[1])];
  return {...a, head: P(a.head), headTop: Y(a.headTop), chin: Y(a.chin), feet: P(a.feet), rHand: P(a.rHand), lHand: P(a.lHand), rShoulder: P(a.rShoulder), lShoulder: P(a.lShoulder),
    rUpper: P(a.rUpper), lUpper: P(a.lUpper), lens: a.lens && P(a.lens), top: Y(a.top), bottom: Y(a.bottom)};
};
/** The anchors of a figure rolled by `deg` about `c`: points rotate, `top` and `bottom` become the rotated extremes, `lensDir` turns. */
export const rollAnchors = <T extends FigAnchors>(a: T, c: Pt, deg: number): T => {
  if (!deg) return a;
  const R = (q: Pt) => rollPt(q, c, deg), head = R(a.head), feet = R(a.feet);
  const headTopPt = R([a.head[0], a.headTop]), chinPt = R([a.head[0], a.chin]);
  return {
    ...a, head, headTop: headTopPt[1], chin: chinPt[1], feet, rHand: R(a.rHand), lHand: R(a.lHand), rShoulder: R(a.rShoulder), lShoulder: R(a.lShoulder),
    rUpper: R(a.rUpper), lUpper: R(a.lUpper), lens: a.lens && R(a.lens), lensDir: a.lensDir === undefined ? undefined : a.lensDir + (deg * Math.PI) / 180,
    top: Math.min(headTopPt[1], feet[1]), bottom: Math.max(headTopPt[1], feet[1]),
  };
};

/** Elevation (radians, + = camera above) at which camera `c` sees the head of a figure `height` m tall standing at `at`. */
export const headElevation = (c: YCam, at: V3, height: number): number => Math.atan2(c.y - (at[1] + height - 0.2), Math.max(0.01, Math.hypot(at[0] - c.x, at[2] - c.z)));
/** The face shift a placement with `pitchCue` uses: the elevation past an 8 deg dead zone, capped at 35 deg. */
export const headPitchOf = (e: number): number => {
  const dz = (8 * Math.PI) / 180, cap = (35 * Math.PI) / 180;
  return Math.sign(e) * Math.min(cap, Math.max(0, Math.abs(e) - dz));
};
/**
 * Vertical squash of the card seen from above: the projected feet-to-head-top height over the drawn one, never below 0.75. Seen from
 * level or below it is 1: a flat card squashed from below reads stumpy, not tall (VA03 check, 13 Nov 2026).
 */
export const cardSquash = (c: YCam, at: V3, height: number, g: Pt, u: number): number => {
  if (c.y <= at[1] + height) return 1;
  const top = camPoint(c, [at[0], at[1] + height, at[2]]);
  return top ? Math.max(0.75, Math.min(1, (g[1] - top[1]) / (height * u))) : 1;
};
/** Perspective head size: px per metre at the head over px per metre at the feet, 0.85..1.25 (>1 seen from above: the head is nearer). */
export const headPerspective = (c: YCam, at: V3, height: number): number => {
  const uf = camUnit(c, at), uh = camUnit(c, [at[0], at[1] + height - 0.2, at[2]]);
  return Math.max(0.85, Math.min(1.25, uh / uf));
};
/** All view cues off (`pitchCue`, `quarterFollow`, `backQuarter`): the drawing before they became the default on 13 Nov 2026. Spread it into
 *  the options of episodes made before then (edu11, edu14, edu15), so a re-render matches what was delivered. */
export const VIEW_CUES_OFF = {pitchCue: false, quarterFollow: false, backQuarter: false} as const;
/** The view fields a placement resolves to for this camera (four-view squared to the lens, or six-view from a world facing). */
export const viewAtCam = (c: YCam, o: Pick<FigureAtOpts, 'at' | 'view' | 'facing' | 'prevView' | 'hysteresis' | 'quarterFollow' | 'backQuarter'>): ViewFields => {
  if (!o.facing) return {view: figureView4(c, o.at, squareToCam(c, o.at, o.view ?? 'front'))};
  const name = figureView(c, o.at, o.facing, {prev: o.prevView, hysteresis: o.hysteresis, eight: o.backQuarter ?? true});
  const a = viewAngle(c, o.at, o.facing);
  // A back three-quarter turns away from the back (180), a front one away from the front (0).
  return viewFields(name, (o.quarterFollow ?? true) ? quarterDegAt(name.startsWith('back-') ? a + 180 : a) : 45);
};
/** VA04: the three-quarter turn for a view angle (degrees, `viewAngle`): its distance from the front, held to the valid 15..60. */
export const quarterDegAt = (deg: number): number => {
  const d = ((deg % 360) + 360) % 360, off = d > 180 ? 360 - d : d;
  return Math.min(60, Math.max(15, off));
};

/** Paint `def` standing at `o.at` through camera `c`. Returns the figure's picture anchors, or null when the feet are behind the lens. */
export const paintFigureAt = (p: Painter, c: YCam, def: CastDef, o: FigureAtOpts): FigAnchors | null => {
  const g = camPoint(c, o.at);
  if (!g) return null;
  const u = camUnit(c, o.at) * (o.scale ?? 1);
  const vf = viewAtCam(c, o);
  if (o.shadow !== false) washAt(p, (o.seed ?? def.seed) + 5101, o.shadow?.color ?? '#3b3226', o.shadow?.op ?? 60, ell(g[0], g[1], 0.32 * u, 0.06 * u, 16), 0.15, 0.2);
  // pitchCue (VA03): the head takes its own perspective size (`headPerspective`), the body keeps the height; the rig shares it out.
  const pose = poseFor(o.pose ?? 'P01', def, g as Pt, u, vf.view === 'back' ? 'front' : vf.view);
  const face = {...EXPRESSIONS[o.face ?? 'neutral'], ...(o.faceState ?? {})} as FaceState;
  const q = o.tint ? tintPainter(p, o.tint.to, o.tint.u, {mul: o.tint.mul, brush: true}) : p;
  const cue = o.pitchCue ?? true;
  const pitch = cue ? headPitchOf(headElevation(c, o.at, def.height * (o.scale ?? 1))) : 0;
  const fp = {...pose, ...vf, face, ...(o.shadow === false ? {noShadow: true} : {}), ...(pitch ? {headPitch: pitch} : {}), ...(cue ? {headSize: headPerspective(c, o.at, def.height * (o.scale ?? 1))} : {}), ...o.fig} as FigPose;
  const pivot = o.roll ? hipAnchor(def, g as Pt, u, fp) : (g as Pt);
  const sy = cue ? cardSquash(c, o.at, def.height * (o.scale ?? 1), g as Pt, u) : 1;
  let a!: FigAnchors;
  withSquash(p, g as Pt, sy, () => withRoll(p, pivot, o.roll ?? 0, () => {
    a = drawFigure(q, def, g, u, fp, o.t, o.seed ?? def.seed);
    o.held?.(q, a, u);
  }));
  return squashAnchors(rollAnchors(a, pivot, o.roll ?? 0), g as Pt, sy);
};

/** The placement as a depth-sorted set item (kit `paintSorted`); `out.a` receives the anchors when it is painted. */
export const figureItem = (def: CastDef, o: FigureAtOpts, extra: {bias?: number; out?: {a?: FigAnchors | null}} = {}): Item => ({
  at: o.at,
  bias: extra.bias,
  draw: (p, c) => { const a = paintFigureAt(p, c, def, o); if (extra.out) extra.out.a = a; },
});

import type {FigPose} from './cast';
import {viewAngle, type YCam} from './ycam';
import type {V3} from './space';

// Figure view from the camera angle (kit, 4 Nov 2026). Painted characters use front, back, left and right as the default; the front
// three-quarter views (front-right, front-left: `FigPose.quarter` with `view: 'front'`) are an optional extra. There are no back
// three-quarter views (user, 4 Nov 2026: they barely read, the hair covers the turn); depth from behind comes from camera moves in the
// set (`ycam.ts`). `figureView` picks one of the six from the angle at which the camera sees the figure; there is no cross-fade.

export type ViewName = 'front' | 'front-right' | 'right' | 'back' | 'left' | 'front-left';
export const VIEW_NAMES: ViewName[] = ['front', 'front-right', 'right', 'back', 'left', 'front-left'];
/**
 * Angle sector of each view in degrees, `from` inclusive to `to` exclusive, on 0..360 (0 = facing the camera, 90 = facing the screen
 * right, see `viewAngle`). The front half keeps 45 degree steps (front 337.5-22.5, front-right 22.5-67.5, front-left 292.5-337.5); the
 * back half has no diagonal, so the profiles take up to 135 / from 225 and the back covers 135-225.
 */
export const VIEW_SECTORS: Record<ViewName, [number, number]> = {
  'front': [337.5, 22.5],
  'front-right': [22.5, 67.5],
  'right': [67.5, 135],
  'back': [135, 225],
  'left': [225, 292.5],
  'front-left': [292.5, 337.5],
};
/** The `FigPose` fields that select a view. Spread them over a pose: `{...pose, ...viewFields(name)}`. */
export type ViewFields = Pick<FigPose, 'view' | 'quarter' | 'quarterDeg'>;

/** `FigPose` view fields of a named view (`front-left` = front body turned to face the screen left, and so on). */
export const viewFields = (name: ViewName, quarterDeg = 45): ViewFields => {
  switch (name) {
    case 'front-left': return {view: 'front', quarter: 'left', quarterDeg};
    case 'front-right': return {view: 'front', quarter: 'right', quarterDeg};
    default: return {view: name};
  }
};
const norm = (deg: number) => ((deg % 360) + 360) % 360;
/** Signed distance in degrees from `deg` into the sector (positive inside, negative outside; the margin to the nearer edge). */
const sectorMargin = (name: ViewName, deg: number) => {
  const [a, b] = VIEW_SECTORS[name], w = norm(b - a), x = norm(deg - a);
  return x < w ? Math.min(x, w - x) : -Math.min(x - w, 360 - x);
};
/** View of the sector holding an angle in degrees (0 = facing the camera, +90 = facing the screen right, see `viewAngle`). */
export const viewNameAt = (deg: number): ViewName => {
  const d = norm(deg);
  return VIEW_NAMES.find((n) => {
    const [a, b] = VIEW_SECTORS[n];
    return a < b ? d >= a && d < b : d >= a || d < b;
  })!;
};
/**
 * The view of a figure at `at` facing `facing` ([x, z] horizontal world direction) as seen by camera `cam`. `hysteresis` (degrees,
 * default 0) with `prev` keeps the previous view until the angle has left its sector by that much (no flicker on a slow orbit).
 */
export const figureView = (cam: YCam, at: V3, facing: [number, number], opts: {prev?: ViewName; hysteresis?: number} = {}): ViewName => {
  const a = viewAngle(cam, at, facing), next = viewNameAt(a);
  if (opts.prev && opts.hysteresis && next !== opts.prev && sectorMargin(opts.prev, a) > -opts.hysteresis) return opts.prev;
  return next;
};

// --- four views only (user, 4 Nov 2026: "only 4 angles, play with the set at 45 degrees") ------------------------------------
// The default for painted characters: front, right, back, left and nothing between. Depth comes from the set and the camera
// (`ycam.ts`): stand the camera at an angle to the set and square the figure up with the lens (`squareToCam`), so the figure reads
// in a plain view while the set runs diagonally through the frame. Example: spike `SET45-*` in the kit test set TESTSET-CROSSROADS.
export type View4 = 'front' | 'right' | 'back' | 'left';
export const VIEW4_NAMES: View4[] = ['front', 'right', 'back', 'left'];
/** Nearest of the four views for an angle in degrees (90 degree steps; 0 = facing the camera, +90 = facing the screen right). */
export const view4At = (deg: number): View4 => VIEW4_NAMES[((Math.round(deg / 90) % 4) + 4) % 4];
/** `figureView` limited to the four views. */
export const figureView4 = (cam: YCam, at: V3, facing: [number, number]): View4 => view4At(viewAngle(cam, at, facing));
/**
 * The facing ([x, z] horizontal world direction) that shows a figure at `at` in `view` to a camera standing at (`cam.x`, `cam.z`):
 * `front` faces the lens, `back` faces away, `right` / `left` stand side-on facing the screen right / left. Fix it for a shot from
 * the mid-shot camera; a camera arc of up to about +-40 degrees then keeps the same view.
 */
export const squareToCam = (cam: Pick<YCam, 'x' | 'z'>, at: V3, view: View4): [number, number] => {
  const dx = cam.x - at[0], dz = cam.z - at[2], n = Math.hypot(dx, dz) || 1, tx = dx / n, tz = dz / n;
  switch (view) {
    case 'front': return [tx, tz];
    case 'back': return [-tx, -tz];
    case 'right': return [tz, -tx];
    case 'left': return [-tz, tx];
  }
};

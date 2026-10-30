import type {PaintContext} from '../BrushCanvas';
import {ell, INK} from './ctx';
import {CREAM, dim, flatKit} from './sets';
import {mixColor} from '../painter';
import {persp} from './space';
import {drawFig, figCast, figFront, figSide, MITTEN_6H, TEX_B} from './body6';
import {castTone, KEY_B10} from './light';
import {YOU_DAY3, ZC_FACES} from './cast';

// ZCPAINT B10-SH01 interior (`PERSP-2D` medium F 1844, 55 deg): camera at (Y 3.25, d 0.52), eye 1.58 m, VP (540, 525),
// looking toward the plain door through the P1 doorway. Day-three overcast: values lowered. The turn (brief pf):
// back view to 107, profile 109-115 (screen-right), front decal from 117 (the lens). Blink on, once in the window.
// Pass 8 (S-P13): the 6-head figure (BODY-ZCP-6H, day-three overlay) with its floor cast from KEY-B10 (LT-03), projected by the
// same perspective and clipped to the entry and bathroom floor; the cast is painted after the floor, before the cabinet and door.

export const B10_PERSP = persp(1844, 1.58, {Y: 3.25, d: 0.52}, [540, 525]);
const OVERCAST = 0.78;
/** His feet: the ground point at Y 0.92, d 0.2 (`B10_PERSP`), drawn at the feet line y 1775 (2.33 m, 791 px/m). */
const FEET = {Y: 0.92, d: 0.2} as const;

/** The head pose of him at plate frame pf: 'back' | 'side' | 'front' (the brief's turn keys). */
export const b10View = (pf: number): 'back' | 'side' | 'front' => (pf < 108 ? 'back' : pf < 116 ? 'side' : 'front');

export const paintInterior = (ctx: PaintContext, pf: number) => {
  const P = B10_PERSP;
  const f = flatKit(ctx, 7000);
  const L = (c: string) => dim(c, OVERCAST);
  const back = 3.2;
  // Him: the figure for this view, its place on the feet line, and its floor cast clipped to the entry and bathroom floor.
  const view = b10View(pf);
  const fig = view === 'back' ? figFront(YOU_DAY3, {back: true, overlay: 'day3', mitten: MITTEN_6H}) : view === 'side' ? figSide(YOU_DAY3, {overlay: 'day3', mitten: MITTEN_6H}) : figFront(YOU_DAY3, {face: ZC_FACES.neutral, overlay: 'day3', mitten: MITTEN_6H});
  const g = P(FEET.Y, 0, FEET.d);
  const place = {gx: g[0], gy: 1775, k: (1844 / (3.25 - FEET.Y)) / 447, dir: 1 as const};
  // The entry floor (Y 0.18-1.5): the camera is at Y 3.25, so the floor quad stays in front of it (the bathroom is not clipped to).
  const floorQuad = [P(0.18, 0, 0), P(1.5, 0, 0), P(1.5, 0, back), P(0.18, 0, back)];
  const cast = figCast(fig, P, {Y: FEET.Y, d: FEET.d, dir: 1, lat: 'd'}, floorQuad, KEY_B10);
  // Shell: floor and ceiling of the entry and bathroom, the side walls at d 0 and d 3.2.
  f.fill(L(CREAM.tile), [P(0.18, 0, 0), P(3.3, 0, 0), P(3.3, 0, back), P(0.18, 0, back)]);
  for (const poly of cast) f.fill(castTone(L(CREAM.tile)), poly);
  f.fill(L(CREAM.ceiling), [P(0.18, 2.6, 0), P(3.3, 2.6, 0), P(3.3, 2.6, back), P(0.18, 2.6, back)]);
  f.fill(L(CREAM.wallShade), [P(0.18, 2.6, 0), P(3.3, 2.6, 0), P(3.3, 0, 0), P(0.18, 0, 0)]);
  f.fill(L(CREAM.wall), [P(0.18, 2.6, back), P(3.3, 2.6, back), P(3.3, 0, back), P(0.18, 0, back)]);
  // Door wall (Y 0.18): the plain door, closed and bolted, no peephole; the latch gap is dark.
  f.fill(L(CREAM.wallShade), [P(0.18, 2.6, 0.2), P(0.18, 2.6, 1.3), P(0.18, 0, 1.3), P(0.18, 0, 0.2)]);
  f.fill(L('#b4a383'), [P(0.18, 2.1, 0.3), P(0.18, 2.1, 1.2), P(0.18, 0, 1.2), P(0.18, 0, 0.3)]);
  f.line([P(0.18, 2.1, 0.3), P(0.18, 2.1, 1.2), P(0.18, 0, 1.2), P(0.18, 0, 0.3)], 1.1);
  f.fill('#14110e', [P(0.18, 2.1, 1.2), P(0.18, 2.1, 1.25), P(0.18, 0, 1.25), P(0.18, 0, 1.2)], 2); // latch edge
  // Detail pass (b): wood grain on the upper leaf and a hinge knuckle at the hinge side (above the cabinet).
  for (const z of [1.35, 1.6, 1.85]) f.line([P(0.18, z, 0.36), P(0.18, z + 0.02, 0.7), P(0.18, z, 1.14)], 0.45, mixColor('#b4a383', INK, 0.3), false);
  f.fill('#5b5650', [P(0.18, 1.92, 0.3), P(0.18, 1.92, 0.36), P(0.18, 1.78, 0.36), P(0.18, 1.78, 0.3)]);
  const tt = P(0.18, 1.05, 1.1);
  f.fill(L('#6f665a'), ell(tt[0], tt[1], 7, 9, 10));
  // Cabinet flush against the door, front face Y 0.58 and top z 1.2.
  f.fill(L('#cdb48c'), [P(0.58, 1.2, 0.35), P(0.58, 1.2, 1.15), P(0.58, 0, 1.15), P(0.58, 0, 0.35)]);
  f.fill(L('#e2cfa8'), [P(0.18, 1.2, 0.35), P(0.58, 1.2, 0.35), P(0.58, 1.2, 1.15), P(0.18, 1.2, 1.15)]);
  f.line([P(0.58, 1.2, 0.35), P(0.58, 1.2, 1.15), P(0.58, 0, 1.15), P(0.58, 0, 0.35)], 1.1);
  // Him, drawn on the feet line: the contact patches only (the cast is above, in the floor pass).
  drawFig(ctx, 10000, fig, place, {floor: L(CREAM.tile), screenCast: [], tex: TEX_B});
  // P1 partition: the wall face on the bathroom side d 0.9-3.2 and the lintel over the doorway; the jamb at d 0.9.
  f.fill(L(CREAM.partition), [P(1.6, 2.6, 0.9), P(1.6, 2.6, back), P(1.6, 0, back), P(1.6, 0, 0.9)]);
  f.fill(L(CREAM.partition), [P(1.6, 2.6, 0), P(1.6, 2.6, 0.9), P(1.6, 2.05, 0.9), P(1.6, 2.05, 0)]);
  f.fill(L(CREAM.wall), [P(1.5, 2.6, 0.9), P(1.6, 2.6, 0.9), P(1.6, 0, 0.9), P(1.5, 0, 0.9)]);
};
export const B10_FRAME_TURN = {back: 107, profile: 109, front: 117};

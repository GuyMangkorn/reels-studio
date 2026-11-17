import {STILL_CAMERA} from '../kit/camera';
import type {ExpressionId} from '../kit/expressions';
import type {Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {TASTER} from './cast';
import {blendHands, LIGHT_DAY, spoonBowlToward} from './crew';
import {LT_BOWLS, paintHall} from './hall';
import {HALL_PAPER} from './shot';
import {add3, paintPerson} from './motion22';
import {BOWL_A01, childItems, lifterItems, sheetMove, shotCam, T_MARK} from './stage';
import {paintSpoonHeld} from './tableware';

// EDU-EP22-SHORT-PIC-COVERS cover-only plates (Film, 2026-11-17; cover-design skill pick 1, docs/cover-principles.md CV07).
// Reason for new plates: the film's hall frames hold the taster at medium size in profile (B03-SH09) and the long table at a three-quarter
// distance (B01-SH01, B03-SH12); at 120 px the spoon, the lids and the child's face read as small marks. These plates reuse the locked hall,
// cast and tableware (paintHall, paintPerson, childItems, lifterItems; same palette and seeds) with a cover camera only. Every event is in the
// film: the taster's spoon at his mouth beside the covered long table (B03-SH09 l 26), the child's suspicious look toward the long table
// (B02-SH04 l 0-19, B05-SH18 l 32+), the covered long table of 28 bowls with the child seated beside it (B01-SH01). Faces and poses are the
// film's; only framing and lens are pushed. Never shown (CV04): the darkened silver, the egg, Puyi's verdict "for show", the empty-handed
// emperor eating his own spread (B05). Kept in its own inventory (src/painted/shots/edu22-covers.tsx) so the episode's shot inventory does
// not import it; shot files are not imported (one-shot-one-file), so the SH09 taste pose is copied below.

type Cover22 = {id: string; serves: string; cam: YCam; paint: Parameters<typeof paintHall>[2]};
const make = (o: Cover22): PaintedShot => ({
  id: o.id, serves: [o.serves], paper: HALL_PAPER, camera: () => STILL_CAMERA,
  paint: (p) => { paintHall(p, o.cam, o.paint); },
  Overlay: ({opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Grain opacity={0.04} /></div>,
});
const cam = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number, pitch = 0): YCam =>
  shotCam(sheetMove(at, [yaw, yaw], [r, r], eye, {f, hy, pitch: [pitch, pitch]}), 1, 0);

/** B03-SH09 at l 15: the spoon dipped in A01 (cover resting on the runner, the tag standing in the food), the taster facing the table. Copied
 *  pose, frozen; left profile as in the film. */
const FOOD: V3 = [LT_BOWLS[BOWL_A01].at[0] + 0.02, 0.875, LT_BOWLS[BOWL_A01].at[2]];
const tasteItems = (L: number) => {
  const t = L / 30, at = T_MARK;
  const base = {at, t, view: 'left' as const, seed: TASTER.seed};
  const hand: V3 = add3(FOOD, [0.09, 0.05, 0.0]);
  return [{at, bias: 0, draw: (q: Parameters<typeof paintPerson>[0], cc: YCam) => {
    const hp = blendHands(cc, TASTER, base, {r: [hand, 1]});
    paintSpoonHeld(q, cc, 26620, hand, spoonBowlToward(hand, FOOD));
    paintPerson(q, cc, TASTER, {...base, handsPx: hp});
  }}];
};
const tasteCover = (id: string, c: YCam) => make({id, serves: 'B03-SH09', cam: c, paint: {
  light: LIGHT_DAY, longTable: {covers: 'on', coverOf: (i) => (i === BOWL_A01 ? 'off' : 'on'), detailPx: 200}, items: [...lifterItems(0.5), ...tasteItems(15)],
}});
const CHILD_LOOK: Pt = [-1.35, 0.1];
const childCover = (id: string, face: ExpressionId, c: YCam) => make({id, serves: 'B02-SH04', cam: c, paint: {
  light: {...LIGHT_DAY, warm: 0.65}, longTable: {covers: 'on'},
  items: [...childItems({t: 0.3, face, look: CHILD_LOOK}), ...lifterItems(0.3)],
}});

export const edu22CoverShots: PaintedShot[] = [
  tasteCover('EDU22-COVER-TASTE', cam([-3.18, 1.1, 1.7], 30, 0.9, 1.3, 1000, 1180, -16)),
  childCover('EDU22-COVER-CHILD', 'suspicious', cam([-0.15, 1.0, -0.72], 70, 0.85, 1.0, 1150, 1050)),
  make({id: 'EDU22-COVER-TOP', serves: 'B01-SH01', cam: cam([-1.7, 0.7, -0.3], 0, 0.8, 4.0, 700, 960, -78), paint: {
    light: LIGHT_DAY, longTable: {covers: 'on'}, items: [...childItems({t: 0, face: 'suspicious', look: CHILD_LOOK}), ...lifterItems(0)]}}),
];

import type {Painter} from '../painter';
import {mixColor} from '../painter';
import {makePaint} from '../spike/SideSheet';
import {ZC_FACES, YOU_DAY3} from './cast';
import {ctxOf, INK, placeAt} from './ctx';
import {bodyDetail, contactShadow, toeLines} from './figdetail';
import {paintSeatedFloor} from './figure';
import {paintUnit} from './rooms';
import {box, CREAM, flatKit, paintCaps, type Flat, type Lights} from './sets';
import {section, SEC_2D_LL_B09, type Section} from './space';

// ZCPAINT B09 section plates (S-P03/S-P04 b, Boss pass 5): `SEC-2D-LL` 565 px/m, floor 1020, VP (540, 700) (`MK-ZCP-F2`).
// Day three: overcast values, the entry cabinet, two buckets, four cans and the phone on the floor, him seated on the
// floor. B09-SH01 holds him hugging his knees, facing the door (`Q-MK-ZCP-2`); B09-SH03 is the held frame after the knock
// with his head lifted toward the door. The trash bag is not painted (it projects inside the cabinet outline, `MK-ZC-ST-07`).

export const B09_LIGHT: Lights = {entry: 0.6, bath: 0.55, kitchen: 0.55, living: 0.55, neighbours: 0.4};
const SHADOW = mixColor(CREAM.tile, INK, 0.55);
const BUCKET = {front: '#3e7f8a', top: '#5d9aa4', side: '#2d6068'};
const LID = {front: '#d8d3c6', top: '#ebe7dc', side: '#b9b4a6'};
const CAN = {front: '#b8c0c4', top: '#dfe4e6', side: '#8f989d'};
const PHONE = {front: '#2a2c30', top: '#3a3d42', side: '#1d1f22'};

/** Entry-cabinet props and the floor items of the day-3 counter (B09-SH01 and SH03 share them). */
const props = (f: Flat, S: Section) => {
  box(f, S, [0.30, 0.58], [0.02, 0.30], [0, 0.42], BUCKET); // bucket B against the cabinet front
  box(f, S, [0.30, 0.58], [0.02, 0.30], [0.42, 0.46], LID);
  box(f, S, [0.62, 0.90], [0.12, 0.40], [0, 0.42], BUCKET); // bucket A in front of his feet
  box(f, S, [0.62, 0.90], [0.12, 0.40], [0.42, 0.46], LID);
  box(f, S, [0.92, 0.96], [0.10, 0.22], [0, 0.20], PHONE); // phone leaning on bucket A
  for (const d of [0.02, 0.14]) {
    box(f, S, [1.25, 1.46], [d, d + 0.10], [0, 0.11], CAN);
    box(f, S, [1.25, 1.46], [d, d + 0.10], [0.11, 0.22], CAN);
  }
};

/** Him seated on the floor at the section (hips at Y `yHip`, d 0.75), profile, mirrored to face screen-left (the door). */
const seated = (p: Painter, S: Section, o: {yHip: number; pitch: number; face: typeof ZC_FACES.tired; blink: boolean}, base: number) => {
  const c = ctxOf(p);
  const [gx, gy] = S.P(o.yHip, 0, 0.75);
  const k = S.pxPerM(0.75) / 447;
  placeAt(c.brush, gx, gy, k, -1, () => {
    contactShadow(flatKit(c, base + 90), 0, 0, 0.62 * 190, 0.07 * 190, SHADOW);
    const s = paintSeatedFloor(makePaint(c, base), YOU_DAY3, 0, 0, {face: o.face, pitch: o.pitch, blink: o.blink});
    bodyDetail(makePaint(c, base + 300), {shoulder: s.shoulder, hip: s.hip, head: s.head, w: 0.6 * 190}, '#1d3b3d', {folds: true, hair: true});
    toeLines(makePaint(c, base + 400), s.foot[0], 0, 190);
  });
};

/** B09-SH01 (per-language plates, one paint): the seated day-3 hold; the counter board on the back wall for the icon row. */
export const paintB09Sh01 = (p: Painter) => {
  const c = ctxOf(p), S = section(SEC_2D_LL_B09, 0.885);
  const f = flatKit(c, 14000);
  paintUnit(c, S, B09_LIGHT);
  props(f, S);
  // Counter board on the back wall above him (painted; the icons and numerals sit on it, `ZC-TEXT`).
  f.fill('#e9e4d6', [[410, 350], [890, 350], [890, 470], [410, 470]]);
  f.line([[410, 350], [890, 350], [890, 470], [410, 470]], 1.0);
  seated(p, S, {yHip: 1.20, pitch: 0.35, face: ZC_FACES.tired, blink: true}, 15100);
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

/** B09-SH03 (shared held plate): the cabinet, buckets and phone as SH01; him seated at screen right, head lifted 15°
 *  toward the door (listening: look toward the door, eyes dot, blink off). Corridor cap left, door wall beside it. */
export const paintB09Sh03 = (p: Painter) => {
  const c = ctxOf(p), S = section(SEC_2D_LL_B09, 0.65);
  paintUnit(c, S, B09_LIGHT);
  props(flatKit(c, 14000), S);
  seated(p, S, {yHip: 1.20, pitch: -0.26, face: {...ZC_FACES.listening, look: [1, -0.2]}, blink: false}, 15600);
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

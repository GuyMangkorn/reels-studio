import type {Painter} from '../painter';
import {drawFig, figSeatFloor, sectionCast} from './body6';
import {ZC_FACES, YOU_DAY3} from './cast';
import {ctxOf} from './ctx';
import {keyFaces, type Caster} from './light';
import {paintUnit} from './rooms';
import {box, CREAM, dim, flatKit, paintCaps, type Flat, type Lights} from './sets';
import {section, SEC_2D_LL_B09, type Section} from './space';

// ZCPAINT B09 section plates (S-P03/S-P04 b, Boss pass 5; pass 8 S-P13): `SEC-2D-LL` 565 px/m, floor 1020, VP (540, 700) (`MK-ZCP-F2`).
// Day three: overcast values, the entry cabinet, two buckets, four cans and the phone on the floor, him seated on the floor. B09-SH01
// holds him hugging his knees, facing the door (`Q-MK-ZCP-2`); B09-SH03 is the held frame after the knock with his head lifted toward
// the door. The trash bag is not painted (it projects inside the cabinet outline, `MK-ZC-ST-07`).
// Pass 8: the 6-head seated figure (`figSeatFloor`, BODY-ZCP-6H) with its section cast (LT-03); the props take the day-three cel step
// (`LT-02`, half) and cast their own floor shadows, painted before the boxes and the figure. The figure's cast is in the same pass.

export const B09_LIGHT: Lights = {entry: 0.6, bath: 0.55, kitchen: 0.55, living: 0.55, neighbours: 0.4};
/** Day-three faces (KEY-SEC-D3): the cel step is half (`LT-02`); no room multiplier, as before. */
const d3 = (col: string, top: string) => keyFaces(col, (c) => c, 0.5, top);
const BUCKET = d3('#3e7f8a', '#5d9aa4');
const LID = d3('#d8d3c6', '#ebe7dc');
const CAN = d3('#b8c0c4', '#dfe4e6');
const PHONE = d3('#2a2c30', '#3a3d42');
/** Floor casters of the props (LT-03): bucket B and its lid, bucket A and its lid, the phone, the two can stacks. */
export const PROP_CASTERS: Caster[] = [
  {y: [0.3, 0.58], d: [0.02, 0.3], z: [0, 0.46]},
  {y: [0.62, 0.9], d: [0.12, 0.4], z: [0, 0.46]},
  {y: [0.92, 0.96], d: [0.1, 0.22], z: [0, 0.2]},
  {y: [1.25, 1.46], d: [0.02, 0.12], z: [0, 0.22]},
  {y: [1.25, 1.46], d: [0.14, 0.24], z: [0, 0.22]},
];

/** Entry-cabinet props and the floor items of the day-3 counter (B09-SH01 and SH03 share them); their shadows are in `paintUnit`. */
const props = (f: Flat, S: Section) => {
  box(f, S, [0.3, 0.58], [0.02, 0.3], [0, 0.42], BUCKET); // bucket B against the cabinet front
  box(f, S, [0.3, 0.58], [0.02, 0.3], [0.42, 0.46], LID);
  box(f, S, [0.62, 0.9], [0.12, 0.4], [0, 0.42], BUCKET); // bucket A in front of his feet
  box(f, S, [0.62, 0.9], [0.12, 0.4], [0.42, 0.46], LID);
  box(f, S, [0.92, 0.96], [0.1, 0.22], [0, 0.2], PHONE); // phone leaning on bucket A
  for (const d of [0.02, 0.14]) {
    box(f, S, [1.25, 1.46], [d, d + 0.1], [0, 0.11], CAN);
    box(f, S, [1.25, 1.46], [d, d + 0.1], [0.11, 0.22], CAN);
  }
};

/** Him at depth d 0.60 m (pass 8, RK-28): the seated lead at a 20 deg pitch is 484 px artwork (d 0.75 gave 474 px, under the 480 px rule). */
export const SEAT_D = 0.6;

/** Him seated on the floor at the section (hips at Y `yHip`, d `SEAT_D`), profile, mirrored to face screen-left (the door): the figure,
 *  its place and its section floor cast (`sectionCast`, clipped to the entry floor). */
const seatedFigure = (S: Section, o: {yHip: number; pitch: number; face: typeof ZC_FACES.tired; blink: boolean}) => {
  const fig = figSeatFloor(YOU_DAY3, {face: o.face, pitch: o.pitch, blink: o.blink, overlay: 'day3'});
  const [gx, gy] = S.P(o.yHip, 0, SEAT_D);
  return {
    fig,
    place: {gx, gy, k: S.pxPerM(SEAT_D) / 447, dir: -1 as const},
    cast: sectionCast(fig, S, {Y: o.yHip, d: SEAT_D, dir: -1}, [0.18, 1.5]),
  };
};
const FLOOR_B09 = dim(CREAM.tile, B09_LIGHT.entry);

/** B09-SH01 (per-language plates, one paint): the seated day-3 hold; the counter board on the back wall for the icon row. */
export const paintB09Sh01 = (p: Painter) => {
  const c = ctxOf(p), S = section(SEC_2D_LL_B09, 0.885);
  const f = flatKit(c, 14000);
  const sit = seatedFigure(S, {yHip: 1.2, pitch: 0.35, face: ZC_FACES.tired, blink: true});
  paintUnit(c, S, B09_LIGHT, 1000, {casters: PROP_CASTERS, casts: [{polys: sit.cast, floor: FLOOR_B09}]});
  props(f, S);
  // Counter board on the back wall above him (painted; the icons and numerals sit on it, `ZC-TEXT`).
  f.fill('#e9e4d6', [[410, 350], [890, 350], [890, 470], [410, 470]]);
  f.line([[410, 350], [890, 350], [890, 470], [410, 470]], 1.0);
  drawFig(c, 15100, sit.fig, sit.place, {floor: FLOOR_B09, screenCast: []}); // contact patches only; the cast is in the unit pass
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

/** B09-SH03 (shared held plate): the cabinet, buckets and phone as SH01; him seated at screen right, head lifted 15°
 *  toward the door (listening: look toward the door, eyes dot, blink off). Corridor cap left, door wall beside it. */
export const paintB09Sh03 = (p: Painter) => {
  const c = ctxOf(p), S = section(SEC_2D_LL_B09, 0.65);
  const sit = seatedFigure(S, {yHip: 1.2, pitch: -0.26, face: {...ZC_FACES.listening, look: [1, -0.2]}, blink: false});
  paintUnit(c, S, B09_LIGHT, 1000, {casters: PROP_CASTERS, casts: [{polys: sit.cast, floor: FLOOR_B09}]});
  props(flatKit(c, 14000), S);
  drawFig(c, 15600, sit.fig, sit.place, {floor: FLOOR_B09, screenCast: []});
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

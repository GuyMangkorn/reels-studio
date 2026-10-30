import type {Brush} from '../BrushCanvas';
import {pushCamera, STILL_CAMERA, type Camera} from '../kit/camera';
import type {Painter, Pt} from '../kit/painter';
import type {PaintedShot} from '../shot';
import {CHIN, HEAD_SPAN, type Face} from './FaceSheet';
import {bustFig, keyTravel} from '../zcpaint/bust';
import {drawFig, K6, sectionCast, type Fig} from '../zcpaint/body6';
import {placeHead} from '../zcpaint/closeups';
import {YOU, YOU_DAY3, ZC_FACES} from '../zcpaint/cast';
import {ctxOf} from '../zcpaint/ctx';
import {keyFaces} from '../zcpaint/light';
import {B09_LIGHT, PROP_CASTERS, SEAT_D} from '../zcpaint/b09';
import {b09Sh01Overlay, screenOnly} from '../zcpaint/overlays';
import {paintCabinetR25, type CabinetR25} from '../zcpaint/pov';
import {paintBathTap, paintUnit} from '../zcpaint/rooms';
import {box, CREAM, dim, flatKit, LIT_DAY, paintCaps, type Flat, type Lights} from '../zcpaint/sets';
import {section, SEC_2D, SEC_2D_LL_B09, truckYcHold, type Section} from '../zcpaint/space';
import {
  BUILD_6, BUILD_C, bustFrontV, clothSet, COSTUME, COSTUME_DAY3, drawFigV, seatFloorV, sideWalkV, TEX_B, type Build, type Costume, type Tex,
} from './ZcSpk06Figs';

// Film look spike SPK-ZCP-06 (30 Oct 2026): the three comparison frames (B04-SH01 section walk, B09-SH01 seated hug, B02-SH03 face close)
// rebuilt as spike plates so the figure can be swapped: `P10` the production plate as pass 10 ships it, `P10W` (B02-SH03 only) the pass 10
// bust at the waist/chest close framing of the stopped pass 11, `A` costume, `B` costume + brush texture, `C` costume + texture on a
// 5.5-head build. Sets, light, cameras and overlays are the production ones (copied staging, unchanged values). Spike entry only
// (zcpaint-spk06-index.ts); no production plate imports this file.

export type Variant = 'P10' | 'P10W' | 'A' | 'B' | 'C';
const FPS = 30;
const pfOf = (tl: number) => Math.round(tl * FPS);
const look = (v: Variant): {b: Build; tex?: Tex} => (v === 'C' ? {b: BUILD_C, tex: TEX_B} : v === 'B' ? {b: BUILD_6, tex: TEX_B} : {b: BUILD_6});

// ---------------------------------------------------------------- B04-SH01 (shots/zcpaint.tsx b04 + truck, copied)

const UNIT_LIGHT: Lights = {...LIT_DAY, entry: 0.75, bath: 0.9, kitchen: 1.0, living: 1.0, neighbours: 0.5};
const b04 = (v: Variant) => (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  const yc = truckYcHold(pf, 1.3, 2.4, 14, 57);
  const Y = 0.7 + (2.4 - 0.7) * Math.min(1, pf / 75);
  const {b, tex} = look(v);
  const fig = sideWalkV(YOU, COSTUME, b);
  const room: readonly [number, number] = Y <= 1.5 ? [0.18, 1.5] : [1.6, 3.3];
  const floor = dim(CREAM.tile, Y <= 1.5 ? UNIT_LIGHT.entry : UNIT_LIGHT.bath);
  const c = ctxOf(p);
  const S = section(SEC_2D, yc);
  paintUnit(c, S, UNIT_LIGHT, 1000, {casts: [{polys: sectionCast(fig, S, {Y, d: 0.75, dir: 1}, room), floor}]});
  paintBathTap(c, S, UNIT_LIGHT);
  const [gx, gy] = S.P(Y, 0, 0.75);
  drawFigV(c, 2100, fig, {gx, gy, k: S.pxPerM(0.75) / 447, dir: 1}, {floor, screenCast: true, cloth: clothSet(COSTUME), tex});
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

// ---------------------------------------------------------------- B09-SH01 (zcpaint/b09.ts paintB09Sh01, copied)

const d3 = (col: string, top: string) => keyFaces(col, (x) => x, 0.5, top);
const BUCKET = d3('#3e7f8a', '#5d9aa4'), LID = d3('#d8d3c6', '#ebe7dc'), CAN = d3('#b8c0c4', '#dfe4e6'), PHONE = d3('#2a2c30', '#3a3d42');
const props = (f: Flat, S: Section) => {
  box(f, S, [0.3, 0.58], [0.02, 0.3], [0, 0.42], BUCKET);
  box(f, S, [0.3, 0.58], [0.02, 0.3], [0.42, 0.46], LID);
  box(f, S, [0.62, 0.9], [0.12, 0.4], [0, 0.42], BUCKET);
  box(f, S, [0.62, 0.9], [0.12, 0.4], [0.42, 0.46], LID);
  box(f, S, [0.92, 0.96], [0.1, 0.22], [0, 0.2], PHONE);
  for (const d of [0.02, 0.14]) {
    box(f, S, [1.25, 1.46], [d, d + 0.1], [0, 0.11], CAN);
    box(f, S, [1.25, 1.46], [d, d + 0.1], [0.11, 0.22], CAN);
  }
};
const FLOOR_B09 = dim(CREAM.tile, B09_LIGHT.entry);
const b09 = (v: Variant) => (p: Painter) => {
  const c = ctxOf(p), S = section(SEC_2D_LL_B09, 0.885);
  const f = flatKit(c, 14000);
  const {b, tex} = look(v);
  const fig = seatFloorV(YOU_DAY3, COSTUME_DAY3, b, {face: ZC_FACES.tired, pitch: 0.35, blink: true});
  const [gx, gy] = S.P(1.2, 0, SEAT_D);
  const cast = sectionCast(fig, S, {Y: 1.2, d: SEAT_D, dir: -1}, [0.18, 1.5]);
  paintUnit(c, S, B09_LIGHT, 1000, {casters: PROP_CASTERS, casts: [{polys: cast, floor: FLOOR_B09}]});
  props(f, S);
  f.fill('#e9e4d6', [[410, 350], [890, 350], [890, 470], [410, 470]]);
  f.line([[410, 350], [890, 350], [890, 470], [410, 470]], 1.0);
  drawFigV(c, 15100, fig, {gx, gy, k: S.pxPerM(SEAT_D) / 447, dir: -1}, {floor: FLOOR_B09, screenCast: true, cloth: clothSet(COSTUME_DAY3), tex});
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

// ---------------------------------------------------------------- B02-SH03 (zcpaint/closeups.ts paintB02Sh03, copied; pass 11 framing)

const HEAVE: Face = {name: 'heave', brow: 'flat', eyes: 'dot', look: [-0.6, 0], mouth: 'wavy'};
const SCARED: Face = {name: 'scared', brow: 'worry', eyes: 'wide', look: [-0.8, -0.3], mouth: 'flat'};
const FREEZE_PF = 39, CLOSE_K = 142;
const CAB: CabinetR25 = {far: 850, near: 872, lip: 22, fx0: 150, fx1: 930, x0: 150, x1: 930, knobY: 1150};
const KEY_ENT = keyTravel(1, [0, 1]);
/** Stopped pass 11 close framing (Boss patch, not applied): head 587 px, chin on y 1002, one lens about his head; frame bottom at the waist. */
const HEAD_PX = 587, CHIN_Y = 1002;
const ZOOM = HEAD_PX / (CLOSE_K * HEAD_SPAN);
const CENTRE_Y = CHIN_Y - CHIN * (HEAD_PX / HEAD_SPAN);
const zoomAt = (brush: Brush, from: Pt, to: Pt, s: number, draw: () => void) => {
  brush.push();
  brush.translate(to[0], to[1]);
  brush.scale(s);
  brush.translate(-from[0], -from[1]);
  draw();
  brush.pop();
};
const b02 = (v: Variant) => (p: Painter, tl: number) => {
  const ctx = ctxOf(p), pf = pfOf(tl);
  zoomAt(ctx.brush, [515, 440], [515, CENTRE_Y], ZOOM, () => {
    const f: Flat = flatKit(ctx, 23000);
    f.fill('#d9ccb0', [[-100, -100], [1200, -100], [1200, 850], [-100, 850]]);
    paintCabinetR25(f, CAB);
    const frozen = pf >= FREEZE_PF;
    const breath = frozen ? 0 : 6 * Math.sin(2 * Math.PI * 1.2 * (pf / FPS));
    const face = frozen ? SCARED : {...HEAVE, look: (Math.floor(pf / 12) % 2 === 0 ? [-0.6, 0] : [-0.2, -0.2]) as [number, number]};
    if (v === 'P10W') {
      const fig = bustFig(YOU, {view: 'front', face, blink: false, legs: false});
      drawFig(ctx, 23400, fig, placeHead(fig, 515, 440 + breath, CLOSE_K / K6, 1), {light: KEY_ENT});
      return;
    }
    const {b, tex} = look(v);
    const fig: Fig = bustFrontV(YOU, COSTUME, b, {face});
    drawFigV(ctx, 23400, fig, placeHead(fig, 515, 440 + breath, CLOSE_K / K6, 1), {light: KEY_ENT, cloth: clothSet(COSTUME as Costume), tex, zoom: ZOOM});
  });
};

// ---------------------------------------------------------------- plates

const camB02 = (tl: number): Camera => pushCamera(tl, 84 / FPS, {s0: 1, s1: 1.02, fx: 515, fy: 430});
const camB09 = (tl: number): Camera => pushCamera(tl, 156 / FPS, {s0: 1, s1: 1.015, fx: 648, fy: 590});
const STILL = (): Camera => STILL_CAMERA;
const plate = (id: string, serves: string, camera: (tl: number) => Camera, paint: (p: Painter, tl: number) => void, Overlay: PaintedShot['Overlay']): PaintedShot => ({
  id, serves: [serves], paper: '#d9ccb0', camera, Overlay, paint: (p, ctx) => paint(p, ctx.tl),
});
export const spk06Shot = (shot: 'B04' | 'B09' | 'B02', v: Variant): PaintedShot =>
  shot === 'B04' ? plate(`SPK06-B04-${v}`, 'B04-SH01', STILL, b04(v), screenOnly())
    : shot === 'B09' ? plate(`SPK06-B09-${v}`, 'B09-SH01', camB09, b09(v), b09Sh01Overlay('TH'))
      : plate(`SPK06-B02-${v}`, 'B02-SH03', camB02, b02(v), screenOnly());

import type {ReactNode} from 'react';
import {easeOver, pushCamera, STILL_CAMERA, type Camera} from '../camera';
import type {Painter} from '../painter';
import type {PaintedShot, ShotContext} from '../shot';
import {ctxOf} from '../zcpaint/ctx';
import {CREAM, dim, flatKit, paintCaps, LIT_DAY, type Lights} from '../zcpaint/sets';
import {paintBathTap, paintUnit} from '../zcpaint/rooms';
import {NIGHT, paintBalcony} from '../zcpaint/balcony';
import {paintInterior} from '../zcpaint/interior';
import {DIAGRAM_PAPER, paintDiagram} from '../zcpaint/diagram';
import {drawFig, figFront, figSeatSofa, figSide, gaitPhase, H6, MITTEN_6H, sectionCast, TEX_B, type Fig, type HU} from '../zcpaint/body6';
import {ramp} from '../painter';
import {YOU} from '../zcpaint/cast';
import {section, SEC_2D, SEC_2D_LL_B07, truckYc, truckYcHold} from '../zcpaint/space';
import {paintB02Sh01, paintB02Sh02, paintB03Sh01, paintB09Sh02b} from '../zcpaint/povshots';
import {paintB01Sh01, paintB01Sh02} from '../zcpaint/corridor';
import {paintB02Sh03, paintB07Sh01, paintB09Sh02} from '../zcpaint/closeups';
import {paintB05Sh01} from '../zcpaint/bathroom';
import {paintB06Sh02} from '../zcpaint/fridge';
import {paintB04Sh03a, paintB04Sh03b, paintB04Sh03c, paintB04Sh04, paintB05Sh02, paintB05Sh03, paintB05Sh03Bowl, paintB05Sh03Part3, paintB06Sh03} from '../zcpaint/inserts';
import {paintB09Sh01, paintB09Sh03} from '../zcpaint/b09';
import {b02Sh01Overlay, b03Overlay, b08Overlay, b09Sh01Overlay, screenOnly} from '../zcpaint/overlays';

// ZCPAINT episode plates (S-P05, Boss): the plate IDs the Editor's timeline selects (`scene.painted.shots[].shot`).
// Each plate is a pure function of its own clock (plate frame = tl x 30). `drawPlate` applies the plate camera, so no
// paint function here transforms the picture. Per-language keys are separate plate IDs over one paint function
// (`-TH` / `-EN`); the fromSec conform is the timeline's (Editor). Sets live in src/painted/zcpaint/.
// Status: pass 5 (30 Oct 2026); pass 8 (S-P11/S-P13): section figures are the 6-head body (`BODY-ZCP-6H`) with cast shadows from
// the key (`LT-03`), and the room light follows `LT-06`. Plates are look-check drafts until the user approves the look; no Editor
// integration yet. B08 (`ZCP-B08-SH01`) is the production port of Film's key art (pass 6: balcony.ts, overlays.tsx `b08Overlay`).
// Pass 9 (30 Oct 2026): no ZC plate carries `ZC-CAPSHADE` (Grade and Grain only). New plates: B01-SH01 and B01-SH02 (`corridor.ts`), B02-SH03
// (`closeups.ts`); B03 View B relight and dressing, B09-SH02B door veil, B04-SH02 Grade and Grain, RM-06 caps (`sets.ts`), the B02-SH01 hand removed.
// Not built in pass 9: B04-SH03, B04-SH04, B05-SH01..03, B06-SH02..03, B07-SH01, B09-SH02 (see build-notes "Boss pass 9").

const FPS = 30;
const pfOf = (tl: number) => Math.round(tl * FPS);
/** Room light multipliers (`LT-06`): entry 0.75, bath 0.9, kitchenette and living room 1.0; the neighbour bands stay dark. */
const UNIT_LIGHT: Lights = {...LIT_DAY, entry: 0.75, bath: 0.9, kitchen: 1.0, living: 1.0, neighbours: 0.5};

/**
 * A figure on a section plate (`BODY-ZCP-6H`): the body, its place (Y along the section, depth d, facing `dir`), the room and floor it
 * stands on, and its draw id. The cast is painted in the unit's shadow pass (`LT-03`), before every box, clipped to the figure's room
 * (`RK-26`: floor-only fallback, partitions are not receivers).
 */
type FigSpec = {fig: Fig; Y: number; d: number; dir: 1 | -1; room: readonly [number, number]; floor: string; base: number};
const ROOMS: [readonly [number, number], (L: Lights) => number][] = [
  [[0.18, 1.5], (L) => L.entry],
  [[1.6, 3.3], (L) => L.bath],
  [[3.4, 5.7], (L) => L.kitchen],
  [[5.7, 9.2], (L) => L.living],
];
/** A figure spec at section coordinate Y in the room that holds Y (the entry room for Y on its partition's near side). */
const figIn = (fig: Fig, L: Lights, Y: number, d: number, dir: 1 | -1, base: number): FigSpec => {
  const [room, light] = ROOMS.find(([r]) => Y >= r[0] && Y <= r[1]) ?? ROOMS[0];
  return {fig, Y, d, dir, base, room, floor: dim(CREAM.tile, light(L))};
};

/** The shared truck frame: the unit strip (with its shadow pass), the figures' contact and body, then the caps (opaque, last). */
const truck = (p: Painter, yc: number, sec: typeof SEC_2D, L: Lights, figs: FigSpec[] = [], extra?: (c: ReturnType<typeof ctxOf>, S: ReturnType<typeof section>) => void) => {
  const c = ctxOf(p);
  const S = section(sec, yc);
  paintUnit(c, S, L, 1000, {casts: figs.map((g) => ({polys: sectionCast(g.fig, S, g, g.room), floor: g.floor}))});
  extra?.(c, S);
  for (const g of figs) {
    const [gx, gy] = S.P(g.Y, 0, g.d);
    drawFig(c, g.base, g.fig, {gx, gy, k: S.pxPerM(g.d) / 447, dir: g.dir}, {floor: g.floor, screenCast: [], tex: TEX_B});
  }
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

/** Walk (Boss pass 19, user: "เท้าไม่ขยับเลย"): world metres per head unit of the 6-head figure (`H6` px at 447 px/m). The gait phase follows the
 *  distance walked, so a planted foot stays fixed in the world; `blend` is the first and the closing step (0 stands, 1 walks). */
const M_PER_HU = H6 / 447;
const walkFig = (dist: number, phase0: number, blend: number) => figSide(YOU, {stride: 1, mitten: MITTEN_6H, gait: gaitPhase(dist / M_PER_HU) + phase0, gaitBlend: blend});
/** Distance walked (m) at plate frame `pf`: constant speed `v` to frame `end - ease`, then a linear slow-down to a stop at `end`. */
const walkDist = (pf: number, v: number, end: number, ease: number) => {
  const c = Math.min(Math.max(pf, 0), end), t = Math.max(0, c - (end - ease));
  return v * (Math.min(c, end - ease) + t - (t * t) / (2 * ease));
};
/** Turn on the spot: a front stand for a few frames between the two profile facings (feet apart, arms down, the body's own turn). */
const turnFig = () => figFront(YOU, {mitten: MITTEN_6H});

/** B04-SH01: section truck into the bathroom, tap running; Yc holds 1.30 to pf 14, to 2.40 by pf 57; him walks Y 0.70 -> 2.40.
 *  Boss pass 19: he stands facing the door (pf 0-5), turns (pf 5-10), then walks from pf 10 with a real gait (first step pf 10-18, closing step pf 67-75). */
const B04_TURN = [5, 10] as const, B04_WALK = [10, 75] as const;
const b04 = (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  // Brief R2.3 (30 Oct 2026): Yc holds 1.30 for pf 0-14, then trucks to 2.40 by pf 57; him walks on to 2.40 by pf 75.
  const yc = truckYcHold(pf, 1.3, 2.4, 14, 57);
  const D = 2.4 - 0.7, ease = 8, len = B04_WALK[1] - B04_WALK[0];
  const v = D / (len - ease / 2);
  const Y = 0.7 + walkDist(pf - B04_WALK[0], v, len, ease);
  const blend = Math.min(ramp(pf, B04_WALK[0], B04_WALK[0] + 8), 1 - ramp(pf, B04_WALK[1] - 8, B04_WALK[1]));
  const walking = pf >= B04_TURN[1] && pf < B04_WALK[1];
  const fig = pf < B04_TURN[0] ? figSide(YOU, {stride: 0, mitten: MITTEN_6H}) : pf < B04_TURN[1] ? turnFig() : walking ? walkFig(Y - 0.7, 0.65, blend) : figSide(YOU, {stride: 0, mitten: MITTEN_6H});
  truck(p, yc, SEC_2D, UNIT_LIGHT, [figIn(fig, UNIT_LIGHT, Y, 0.75, pf < B04_TURN[0] ? -1 : 1, 2100)], (c, S) => paintBathTap(c, S, UNIT_LIGHT));
};

/** B06-SH01 hover grip (head units, facing the fridge): 5 cm short of the handle, screen (517, 851) on the sheet (his right hand, the far arm). */
const B06_HOVER_GRIP: HU = [1.13, 3.56];
const smooth = (t: number) => t * t * (3 - 2 * t);
/** The hover blend: rises pf 100-110, withdraws pf 177-190 (sheet `B06-SH01`, right hand row). */
const b06HoverEase = (pf: number) => smooth(ramp(pf, 100, 110)) - smooth(ramp(pf, 177, 190));

/** B06-SH01: truck from the bathroom into the kitchenette; Yc 2.80 -> 4.20 by pf 80; him walks to Y 4.45, turns to the fridge.
 *  Boss pass 19: a real gait to pf 75 (slowing over the last 8 frames), a front-stand turn pf 75-80, then the profile facing the fridge. */
const b06 = (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  const yc = truckYc(pf, 2.8, 4.2, 80);
  const D = 4.45 - 2.7, ease = 8, end = 75;
  const v = D / (end - ease / 2);
  const Y = 2.7 + walkDist(pf, v, end, ease);
  const hover = {grip: B06_HOVER_GRIP, e: b06HoverEase(pf)};
  const blend = 1 - ramp(pf, end - 8, end);
  const fig = pf < end ? walkFig(Y - 2.7, 0.1, blend) : pf < 80 ? turnFig() : figSide(YOU, {stride: 0, mitten: MITTEN_6H, hover});
  truck(p, yc, SEC_2D, UNIT_LIGHT, [figIn(fig, UNIT_LIGHT, Y, 0.75, pf < 80 ? 1 : -1, 2200)]);
};

/** B07-SH02: truck to the living room; Yc 5.40 -> 8.20 by pf 89; seated on the sofa (SEC-2D-LL B07: 480 px/m, floor 1230). */
const b07 = (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  const yc = truckYc(pf, 5.4, 8.2, 89);
  truck(p, yc, SEC_2D_LL_B07, UNIT_LIGHT, [figIn(figSeatSofa(YOU, {mitten: MITTEN_6H, hold: 'bread'}), UNIT_LIGHT, 7.65, 0.75, 1, 2300)]);
};

/** B10-SH01: interior from the bathroom (camera at Y 3.25), the turn on pf 108-116; still camera. */
const b10 = (p: Painter, tl: number) => paintInterior(ctxOf(p), pfOf(tl));

/** B08-SH01: the over-the-shoulder hero plate (`VD-ZC-08`, composed `B08-OTS`): six layers; the bloom and embers are its Overlay. */
const b08 = (p: Painter, tl: number) => paintBalcony(ctxOf(p), pfOf(tl));

/** B04-SH02: schematic diagram, per-language keys (TH and EN plates). */
const diagram = (lang: 'TH' | 'EN') => (p: Painter, tl: number) => paintDiagram(ctxOf(p), pfOf(tl), lang);

/** S-P10 POV plates: the painter takes the plate frame and the plate context. */
const pov = (paint: (c: ReturnType<typeof ctxOf>, pf: number) => void) => (p: Painter, tl: number) => paint(ctxOf(p), pfOf(tl));

const plate = (id: string, serves: string[], paper: string, camera: (tl: number) => Camera, paint: (p: Painter, tl: number) => void, Overlay?: (props: ShotContext & {camera: Camera; opacity: number}) => ReactNode): PaintedShot => ({
  id, serves, paper, camera, Overlay,
  paint: (p: Painter, ctx: ShotContext) => paint(p, ctx.tl),
});

const CAM_STILL = (): Camera => STILL_CAMERA;
/** A slow push about (fx, fy) over `len` seconds (the sheet's insert and medium pushes, Boss pass 10). */
const CAM_PUSH = (len: number, fx: number, fy: number, s1 = 1.02) => (tl: number) => pushCamera(tl, len, {s0: 1, s1, fx, fy});
const CAM_DIAGRAM = (tl: number) => pushCamera(tl, 6.8, {s0: 1, s1: 1.01, fx: 500, fy: 580});
const CAM_B10 = (tl: number) => pushCamera(tl, 4.3, {s0: 1, s1: 1.015, fx: 420, fy: 560});
/** B02-SH01: the push toward the bolt (s 1.00 -> 1.03 about (800, 680)) over the shot. */
const camB02Sh01 = (len: number) => (tl: number) => pushCamera(tl, len, {s0: 1, s1: 1.03, fx: 800, fy: 680});
/** B02-SH02 (R2.5): a 1.5 % lurch about (540, 760) over pf 0-6, easing back to rest by pf 20 (the flush and its wobble). No drag. */
const CAM_B02_SH02 = (tl: number): Camera => {
  const pf = tl * FPS;
  const lurch = pf <= 6 ? pf / 6 : Math.max(0, 1 - (pf - 6) / 14);
  return {s: 1 + 0.015 * lurch, fx: 540, fy: 760, dx: 0, dy: 0};
};
/** B01-SH01: the OTS push (s 1.000 -> 1.035 about (640, 690)) over 3.5 s, the plate's own camera (`PERSP-2D`). */
const camB01Sh01 = (tl: number) => pushCamera(tl, 3.5, {s0: 1, s1: 1.035, fx: 640, fy: 690});
/** B01-SH02: the long-lens push (s 1.00 -> 1.02 about (540, 560)) over the 48-frame shot. */
const camB01Sh02 = (tl: number) => pushCamera(tl, 48 / FPS, {s0: 1, s1: 1.02, fx: 540, fy: 560});
/** B02-SH03: the close push (s 1.00 -> 1.02 about his eyes (515, 690), R1.4) over the 84-frame plate. */
const camB02Sh03 = (tl: number) => pushCamera(tl, 84 / FPS, {s0: 1, s1: 1.02, fx: 515, fy: 690});
/** B07-SH01: the push about his eye (560, 430; s 1.00 -> 1.02, R1.4) over the 141-frame plate. */
const camB07Sh01 = (tl: number) => pushCamera(tl, 141 / FPS, {s0: 1, s1: 1.02, fx: 560, fy: 430});
/** B09-SH02: the push about his eye (R1.4, about (470, 690); s 1.00 -> 1.02) over the 45-frame shot. */
const camB09Sh02 = (tl: number) => pushCamera(tl, 45 / FPS, {s0: 1, s1: 1.02, fx: 470, fy: 690});
/** B09-SH01: the held plate's slow push about his head (s 1.000 -> 1.015). */
const camB09Sh01 = (len: number) => (tl: number) => pushCamera(tl, len, {s0: 1, s1: 1.015, fx: 648, fy: 590});
/** B09-SH02B: the tilt (dy -1100 -> 0 over 18 f, eased): from the knees up to the still door. */
export const CAM_B09_SH02B = (tl: number): Camera => ({s: 1, fx: 540, fy: 960, dx: 0, dy: -1100 * (1 - easeOver(tl, 0.6))});
/** B09-SH03: linear slow push s 1.00 -> 1.04 about (450, 600) over the 84-frame shot. */
const CAM_B09_SH03 = (tl: number): Camera => ({s: 1 + 0.04 * Math.min(1, tl / 2.8), fx: 450, fy: 600, dx: 0, dy: 0});

export const zcpaintShots: PaintedShot[] = [
  plate('ZCP-B01-SH01', ['B01-SH01'], '#b9b19b', camB01Sh01, pov((c, pf) => paintB01Sh01(c, pf)), screenOnly()),
  plate('ZCP-B01-SH02', ['B01-SH02'], '#b9b19b', camB01Sh02, pov((c, pf) => paintB01Sh02(c, pf)), screenOnly()),
  plate('ZCP-B02-SH01-TH', ['B02-SH01'], '#d9ccb0', camB02Sh01(45 / FPS), pov((c, pf) => paintB02Sh01(c, pf, 'TH')), b02Sh01Overlay('TH')),
  plate('ZCP-B02-SH01-EN', ['B02-SH01'], '#d9ccb0', camB02Sh01(57 / FPS), pov((c, pf) => paintB02Sh01(c, pf, 'EN')), b02Sh01Overlay('EN')),
  plate('ZCP-B02-SH02-TH', ['B02-SH02'], '#d9ccb0', CAM_B02_SH02, pov((c, pf) => paintB02Sh02(c, pf, 'TH')), screenOnly()),
  plate('ZCP-B02-SH02-EN', ['B02-SH02'], '#d9ccb0', CAM_B02_SH02, pov((c, pf) => paintB02Sh02(c, pf, 'EN')), screenOnly()),
  plate('ZCP-B02-SH03', ['B02-SH03'], '#d9ccb0', camB02Sh03, pov((c, pf) => paintB02Sh03(c, pf)), screenOnly()),
  plate('ZCP-B03-SH01-TH', ['B03-SH01'], '#1d1915', CAM_STILL, pov((c, pf) => paintB03Sh01(c, pf, 'TH')), b03Overlay('TH')),
  plate('ZCP-B03-SH01-EN', ['B03-SH01'], '#1d1915', CAM_STILL, pov((c, pf) => paintB03Sh01(c, pf, 'EN')), b03Overlay('EN')),
  plate('ZCP-B04-SH01', ['B04-SH01'], '#d9ccb0', CAM_STILL, b04, screenOnly()),
  plate('ZCP-B04-SH02-TH', ['B04-SH02'], DIAGRAM_PAPER, CAM_DIAGRAM, diagram('TH'), screenOnly()),
  plate('ZCP-B04-SH02-EN', ['B04-SH02'], DIAGRAM_PAPER, CAM_DIAGRAM, diagram('EN'), screenOnly()),
  plate('ZCP-B06-SH01', ['B06-SH01'], '#d9ccb0', CAM_STILL, b06, screenOnly()),
  plate('ZCP-B07-SH02', ['B07-SH02'], '#d9ccb0', CAM_STILL, b07, screenOnly()),
  plate('ZCP-B07-SH01', ['B07-SH01'], '#d9ccb0', camB07Sh01, pov((c, pf) => paintB07Sh01(c, pf)), screenOnly()),
  plate('ZCP-B08-SH01', ['B08-SH01'], NIGHT, CAM_STILL, b08, b08Overlay),
  plate('ZCP-B09-SH01-TH', ['B09-SH01'], '#d9ccb0', camB09Sh01(156 / FPS), (p) => paintB09Sh01(p), b09Sh01Overlay('TH')),
  plate('ZCP-B09-SH01-EN', ['B09-SH01'], '#d9ccb0', camB09Sh01(102 / FPS), (p) => paintB09Sh01(p), b09Sh01Overlay('EN')),
  plate('ZCP-B09-SH02B', ['B09-SH02B'], '#d9ccb0', CAM_B09_SH02B, pov((c) => paintB09Sh02b(c)), screenOnly()),
  plate('ZCP-B09-SH02', ['B09-SH02'], '#d9ccb0', camB09Sh02, (p) => paintB09Sh02(ctxOf(p)), screenOnly()),
  plate('ZCP-B09-SH03', ['B09-SH03'], '#d9ccb0', CAM_B09_SH03, (p) => paintB09Sh03(p), screenOnly()),
  plate('ZCP-B10-SH01', ['B10-SH01'], '#c9bfa6', CAM_B10, b10, screenOnly()),
  // Pass 10 (Part B): the inserts, the bathroom medium and the fridge, per the sheets' keys (SS-R1.3).
  plate('ZCP-B04-SH03a', ['B04-SH03'], '#bfd9d4', CAM_PUSH(39 / FPS, 540, 700), pov((c, pf) => paintB04Sh03a(c, pf)), screenOnly()),
  plate('ZCP-B04-SH03b', ['B04-SH03'], '#bfd9d4', CAM_PUSH(12 / FPS, 540, 700), pov((c, pf) => paintB04Sh03b(c, pf)), screenOnly()),
  plate('ZCP-B04-SH03c-TH', ['B04-SH03'], '#bfd9d4', CAM_PUSH(12 / FPS, 540, 700), pov((c, pf) => paintB04Sh03c(c, pf, 12)), screenOnly()),
  plate('ZCP-B04-SH03c-EN', ['B04-SH03'], '#bfd9d4', CAM_PUSH(15 / FPS, 540, 700), pov((c, pf) => paintB04Sh03c(c, pf, 15)), screenOnly()),
  plate('ZCP-B04-SH04-TH', ['B04-SH04'], '#bfd9d4', CAM_PUSH(12 / FPS, 540, 600), pov((c, pf) => paintB04Sh04(c, pf, 'TH')), screenOnly()),
  plate('ZCP-B04-SH04-EN', ['B04-SH04'], '#bfd9d4', CAM_PUSH(33 / FPS, 540, 600), pov((c, pf) => paintB04Sh04(c, pf, 'EN')), screenOnly()),
  plate('ZCP-B05-SH01-TH', ['B05-SH01'], '#d9ccb0', CAM_PUSH(51 / FPS, 700, 600, 1.03), pov((c, pf) => paintB05Sh01(c, pf, 'TH')), screenOnly()),
  plate('ZCP-B05-SH01-EN', ['B05-SH01'], '#d9ccb0', CAM_PUSH(48 / FPS, 700, 600, 1.03), pov((c, pf) => paintB05Sh01(c, pf, 'EN')), screenOnly()),
  plate('ZCP-B05-SH02', ['B05-SH02'], '#e6e3da', CAM_PUSH(3, 540, 640, 1.01), pov((c, pf) => paintB05Sh02(c, pf)), screenOnly()),
  plate('ZCP-B05-SH03', ['B05-SH03'], '#e6e3da', CAM_PUSH(3.2, 540, 640), pov((c, pf) => paintB05Sh03(c, pf)), screenOnly()),
  plate('ZCP-B05-SH03-BOWL', ['B05-SH03'], '#e6e3da', CAM_STILL, pov((c, pf) => paintB05Sh03Bowl(c, pf)), screenOnly()),
  plate('ZCP-B05-SH03-TH', ['B05-SH03'], '#e6e3da', CAM_STILL, pov((c, pf) => paintB05Sh03Part3(c, pf, 'TH')), screenOnly()),
  plate('ZCP-B05-SH03-EN', ['B05-SH03'], '#e6e3da', CAM_STILL, pov((c, pf) => paintB05Sh03Part3(c, pf, 'EN')), screenOnly()),
  plate('ZCP-B06-SH02', ['B06-SH02'], '#d9ccb0', CAM_PUSH(63 / FPS, 540, 560, 1.01), pov((c, pf) => paintB06Sh02(c, pf)), screenOnly()),
  plate('ZCP-B06-SH03', ['B06-SH03'], '#b99c72', CAM_STILL, pov((c, pf) => paintB06Sh03(c, pf)), screenOnly()),
];

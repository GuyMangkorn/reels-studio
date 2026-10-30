import type {ReactNode} from 'react';
import {easeOver, pushCamera, STILL_CAMERA, type Camera} from '../camera';
import {mixColor} from '../painter';
import type {Painter} from '../painter';
import type {PaintedShot, ShotContext} from '../shot';
import {ctxOf, INK, placeAt} from '../zcpaint/ctx';
import {flatKit, paintCaps, LIT_DAY, type Lights} from '../zcpaint/sets';
import {paintBathTap, paintUnit} from '../zcpaint/rooms';
import {NIGHT, paintBalcony} from '../zcpaint/balcony';
import {paintInterior} from '../zcpaint/interior';
import {DIAGRAM_PAPER, paintDiagram} from '../zcpaint/diagram';
import {makePaint, paintBodySide} from '../spike/SideSheet';
import {paintSeatedSofa} from '../zcpaint/figure';
import {YOU} from '../zcpaint/cast';
import {bodyDetail, contactShadow, standingSideAnchors, toeLines} from '../zcpaint/figdetail';
import {section, SEC_2D, SEC_2D_LL_B07, truckYc, truckYcHold} from '../zcpaint/space';
import {paintB02Sh01, paintB02Sh02, paintB03Sh01, paintB09Sh02b} from '../zcpaint/povshots';
import {paintB09Sh01, paintB09Sh03} from '../zcpaint/b09';
import {b02Sh01Overlay, b02Sh02Overlay, b03Overlay, b08Overlay, b09Sh01Overlay, screenOnly} from '../zcpaint/overlays';

// ZCPAINT episode plates (S-P05, Boss): the plate IDs the Editor's timeline selects (`scene.painted.shots[].shot`).
// Each plate is a pure function of its own clock (plate frame = tl x 30). `drawPlate` applies the plate camera, so no
// paint function here transforms the picture. Per-language keys are separate plate IDs over one paint function
// (`-TH` / `-EN`); the fromSec conform is the timeline's (Editor). Sets live in src/painted/zcpaint/.
// Status: pass 5 (30 Oct 2026). Plates are look-check drafts until the user approves the look; no Editor integration yet.
// B08 (`ZCP-B08-SH01`) is the production port of Film's key art (pass 6: balcony.ts, overlays.tsx `b08Overlay`).

const FPS = 30;
const pfOf = (tl: number) => Math.round(tl * FPS);
const cue = (from: number, to: number) => [from / FPS, to / FPS] as const;
const UNIT_LIGHT: Lights = {...LIT_DAY, entry: 0.8, bath: 0.8, kitchen: 0.8, living: 0.8, neighbours: 0.5};
/** Shadow under a figure: the tile tone of the room at light `L` mixed toward the ink. */
const shadowOn = (light: number) => mixColor(mixColor('#14110e', '#7d6c58', 0.1 + 0.9 * light), INK, 0.45);
const SHIRT_FOLD = mixColor(YOU.outfit.shirt, INK, 0.5);

/** The shared truck frame: the unit strip, then the caps (opaque, last), with the figures drawn in between. */
const truck = (p: Painter, yc: number, sec: typeof SEC_2D, L: Lights, extra?: (c: ReturnType<typeof ctxOf>, S: ReturnType<typeof section>) => void, figures?: (c: ReturnType<typeof ctxOf>, S: ReturnType<typeof section>) => void) => {
  const c = ctxOf(p);
  const S = section(sec, yc);
  paintUnit(c, S, L);
  extra?.(c, S);
  figures?.(c, S);
  paintCaps(flatKit(c, 3000), S, [[1.5, 1.6], [3.3, 3.4]]);
};

/** A standing figure at (Y, d) on the section, mirrored for dir -1, scale from the depth (447 px/m calibration), with the
 *  ZC detail pass: contact shadow under the feet, shirt collar and folds, hair strands, toes (`figdetail.ts`). */
const stand = (p: Painter, S: ReturnType<typeof section>, Y: number, d: number, dir: 1 | -1, id: number, light: number) => {
  const [gx, gy] = S.P(Y, 0, d);
  const c = ctxOf(p);
  placeAt(p.brush, gx, gy, S.pxPerM(d) / 447, dir, () => {
    contactShadow(flatKit(c, id + 60), 0.06 * 190, 0, 0.42 * 190, 0.06 * 190, shadowOn(light));
    paintBodySide(makePaint(c, id), YOU, 0, 0);
    bodyDetail(makePaint(c, id + 300), standingSideAnchors(YOU.outfit.shoulder), SHIRT_FOLD);
    toeLines(makePaint(c, id + 400), 0, 0, 190);
  });
};

/** B04-SH01: section truck into the bathroom, tap running; Yc holds 1.30 to pf 14, to 2.40 by pf 57; him walks Y 0.70 -> 2.40. */
const b04 = (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  // Brief R2.3 (30 Oct 2026): Yc holds 1.30 for pf 0-14, then trucks to 2.40 by pf 57; him walks on to 2.40 by pf 75.
  const yc = truckYcHold(pf, 1.3, 2.4, 14, 57);
  const L = {...UNIT_LIGHT, entry: 0.7, bath: 0.7};
  truck(p, yc, SEC_2D, L, (c, S) => paintBathTap(c, S, {...UNIT_LIGHT, bath: 0.7}), (_c, S) => {
    stand(p, S, 0.70 + (2.40 - 0.70) * Math.min(1, pf / 75), 0.75, 1, 2100, 0.7);
  });
};

/** B06-SH01: truck from the bathroom into the kitchenette; Yc 2.80 -> 4.20 by pf 80; him walks to Y 4.45, turns to the fridge. */
const b06 = (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  const yc = truckYc(pf, 2.8, 4.2, 80);
  truck(p, yc, SEC_2D, UNIT_LIGHT, undefined, (_c, S) => stand(p, S, 2.70 + (4.45 - 2.70) * Math.min(1, pf / 75), 0.75, pf < 77 ? 1 : -1, 2200, 0.8));
};

/** B07-SH02: truck to the living room; Yc 5.40 -> 8.20 by pf 89; seated on the sofa (SEC-2D-LL B07: 480 px/m, floor 1230). */
const b07 = (p: Painter, tl: number) => {
  const pf = pfOf(tl);
  const yc = truckYc(pf, 5.4, 8.2, 89);
  const sec = SEC_2D_LL_B07;
  truck(p, yc, sec, {...UNIT_LIGHT, living: 0.9}, undefined, (c, S) => {
    const [gx, gy] = S.P(7.65, 0, 0.75);
    placeAt(p.brush, gx, gy, S.pxPerM(0.75) / 447, 1, () => {
      contactShadow(flatKit(c, 2600), 120, 0, 110, 13, shadowOn(0.9)); // hips to the bare feet (ankle near x 164)
      const s = paintSeatedSofa(makePaint(c, 2300), YOU, 0, 0, {face: undefined});
      bodyDetail(makePaint(c, 2400), {shoulder: s.shoulder, hip: s.hip, head: s.head, w: 0.6 * 190}, SHIRT_FOLD);
    });
  });
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
const CAM_DIAGRAM = (tl: number) => pushCamera(tl, 6.8, {s0: 1, s1: 1.01, fx: 500, fy: 580});
const CAM_B10 = (tl: number) => pushCamera(tl, 4.3, {s0: 1, s1: 1.015, fx: 420, fy: 560});
/** B02-SH01: the push toward the bolt (s 1.00 -> 1.03 about (800, 680)) over the shot. */
const camB02Sh01 = (len: number) => (tl: number) => pushCamera(tl, len, {s0: 1, s1: 1.03, fx: 800, fy: 680});
/** B02-SH02: the push over the drag (s 1.00 -> 1.02 about (540, 800)), then held. */
const CAM_B02_SH02 = (tl: number) => pushCamera(tl, 39 / FPS, {s0: 1, s1: 1.02, fx: 540, fy: 800});
/** B09-SH01: the held plate's slow push about his head (s 1.000 -> 1.015). */
const camB09Sh01 = (len: number) => (tl: number) => pushCamera(tl, len, {s0: 1, s1: 1.015, fx: 648, fy: 590});
/** B09-SH02B: the tilt (dy -1100 -> 0 over 18 f, eased): from the knees up to the still door. */
export const CAM_B09_SH02B = (tl: number): Camera => ({s: 1, fx: 540, fy: 960, dx: 0, dy: -1100 * (1 - easeOver(tl, 0.6))});
/** B09-SH03: linear slow push s 1.00 -> 1.04 about (450, 600) over the 84-frame shot. */
const CAM_B09_SH03 = (tl: number): Camera => ({s: 1 + 0.04 * Math.min(1, tl / 2.8), fx: 450, fy: 600, dx: 0, dy: 0});

/** Caption cue windows (plate clock, seconds) for the cue-gated shade. Shared B04 uses the union of the two languages. */
const CUE_B02_SH01 = {TH: [cue(0, 45)], EN: [cue(0, 57)]} as const;
const CUE_B02_SH02 = {TH: [cue(3, 93)], EN: [cue(0, 120)]} as const;
const CUE_B03 = {TH: [cue(0, 36)], EN: [cue(0, 45)]} as const;
const CUE_B04 = [cue(0, 57)] as const;

export const zcpaintShots: PaintedShot[] = [
  plate('ZCP-B02-SH01-TH', ['B02-SH01'], '#d9ccb0', camB02Sh01(45 / FPS), pov((c, pf) => paintB02Sh01(c, pf, 'TH')), b02Sh01Overlay('TH', CUE_B02_SH01.TH)),
  plate('ZCP-B02-SH01-EN', ['B02-SH01'], '#d9ccb0', camB02Sh01(57 / FPS), pov((c, pf) => paintB02Sh01(c, pf, 'EN')), b02Sh01Overlay('EN', CUE_B02_SH01.EN)),
  plate('ZCP-B02-SH02-TH', ['B02-SH02'], '#d9ccb0', CAM_B02_SH02, pov((c, pf) => paintB02Sh02(c, pf, 'TH')), b02Sh02Overlay('TH', CUE_B02_SH02.TH)),
  plate('ZCP-B02-SH02-EN', ['B02-SH02'], '#d9ccb0', CAM_B02_SH02, pov((c, pf) => paintB02Sh02(c, pf, 'EN')), b02Sh02Overlay('EN', CUE_B02_SH02.EN)),
  plate('ZCP-B03-SH01-TH', ['B03-SH01'], '#1d1915', CAM_STILL, pov((c, pf) => paintB03Sh01(c, pf, 'TH')), b03Overlay('TH', CUE_B03.TH)),
  plate('ZCP-B03-SH01-EN', ['B03-SH01'], '#1d1915', CAM_STILL, pov((c, pf) => paintB03Sh01(c, pf, 'EN')), b03Overlay('EN', CUE_B03.EN)),
  plate('ZCP-B04-SH01', ['B04-SH01'], '#d9ccb0', CAM_STILL, b04, screenOnly(CUE_B04, 'band')),
  plate('ZCP-B04-SH02-TH', ['B04-SH02'], DIAGRAM_PAPER, CAM_DIAGRAM, diagram('TH')),
  plate('ZCP-B04-SH02-EN', ['B04-SH02'], DIAGRAM_PAPER, CAM_DIAGRAM, diagram('EN')),
  plate('ZCP-B06-SH01', ['B06-SH01'], '#d9ccb0', CAM_STILL, b06, screenOnly()),
  plate('ZCP-B07-SH02', ['B07-SH02'], '#d9ccb0', CAM_STILL, b07, screenOnly()),
  plate('ZCP-B08-SH01', ['B08-SH01'], NIGHT, CAM_STILL, b08, b08Overlay),
  plate('ZCP-B09-SH01-TH', ['B09-SH01'], '#d9ccb0', camB09Sh01(156 / FPS), (p) => paintB09Sh01(p), b09Sh01Overlay('TH')),
  plate('ZCP-B09-SH01-EN', ['B09-SH01'], '#d9ccb0', camB09Sh01(102 / FPS), (p) => paintB09Sh01(p), b09Sh01Overlay('EN')),
  plate('ZCP-B09-SH02B', ['B09-SH02B'], '#d9ccb0', CAM_B09_SH02B, pov((c) => paintB09Sh02b(c)), screenOnly()),
  plate('ZCP-B09-SH03', ['B09-SH03'], '#d9ccb0', CAM_B09_SH03, (p) => paintB09Sh03(p), screenOnly()),
  plate('ZCP-B10-SH01', ['B10-SH01'], '#c9bfa6', CAM_B10, b10, screenOnly()),
];

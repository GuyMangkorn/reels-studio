// ZCPAINT geometry measures for a plate group (Boss pass 12 G1 → pass 13 G2). Run: node --import tsx scripts/zombie-condo-paint/g-measure.ts
// Prints one JSON line per row: close busts (chin, visible neck, lead, waist cut), section figures (lead at the sheet's scale) and the
// mitten extents against BODY-ZCP-6H (0.26 across, 0.40 long). Geometry only: the rendered frames are checked with the QA sheets.
import {bustFig, placeClose, visibleNeckHU, waistCutHeads} from '../../src/painted/zcpaint/bust';
import {INFECTED, YOU, YOU_DAY3} from '../../src/painted/zcpaint/cast';
import {figFront, figSeatSofa, figSide, H6, handParts, MITTEN_6H, skullTopPx, topPx, type HU} from '../../src/painted/zcpaint/body6';
import {section, SEC_2D, SEC_2D_LL_B07} from '../../src/painted/zcpaint/space';
import {figSeatFloor, figFront as figFrontG} from '../../src/painted/zcpaint/body6';
import {SEAT_D} from '../../src/painted/zcpaint/b09';
import {toScreen, type Camera} from '../../src/painted/kit/camera';

const FRAME_BOTTOM = 1920;
const cam = (s: number, fx: number, fy: number): Camera => ({s, fx, fy, dx: 0, dy: 0});

type CloseRow = {id: string; fig: ReturnType<typeof bustFig>; cx: number; headPx: number; chinY: number; dir: 1 | -1; layer?: number; lpx?: [number, number]; cam: Camera};
const closes: CloseRow[] = [
  {id: 'B01-SH01 pf0', fig: bustFig(YOU, {view: 'back', inserts: []}), cx: 230, headPx: 600, chinY: 1000, dir: 1, cam: cam(1, 640, 690)},
  {id: 'B01-SH02 pf0 silhouette', fig: bustFig(INFECTED, {view: 'side', slump: 1}), cx: 540, headPx: 600, chinY: 860, dir: -1, cam: cam(1, 540, 560)},
  {id: 'B01-SH02 pf23 rage', fig: bustFig(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true, dirt: true}), cx: 540, headPx: 600, chinY: 860, dir: 1, cam: cam(1, 540, 560)},
  {id: 'B01-SH02 pf47 charge', fig: bustFig(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true, dirt: true}), cx: 540, headPx: 600, chinY: 860, dir: 1, layer: 1.12, lpx: [540, 560], cam: cam(1.02, 540, 560)},
  {id: 'B02-SH03 pf0', fig: bustFig(YOU, {view: 'front'}), cx: 515, headPx: 587, chinY: 1002, dir: 1, cam: cam(1, 515, 690)},
  {id: 'B06-SH02 pf0', fig: bustFig(YOU, {view: 'back'}), cx: 135, headPx: 560, chinY: 900, dir: 1, cam: cam(1, 540, 560)},
  {id: 'B07-SH01 pf0', fig: bustFig(YOU, {view: 'side'}), cx: 750, headPx: 600, chinY: 760, dir: -1, cam: cam(1, 560, 430)},
];

for (const r of closes) {
  const p = placeClose(r.fig, r.cx, r.headPx, r.chinY, r.dir);
  const chin = p.gy + p.k * (r.fig.head.y + 1.22 * 55.8);
  const top = p.gy - p.k * topPx(r.fig);
  const skull = p.gy - p.k * skullTopPx(r.fig);
  const layer = (y: number) => (r.layer && r.lpx ? r.lpx[1] + (y - r.lpx[1]) * r.layer : y);
  const xf = (y: number) => toScreen(r.cam, [r.cx, layer(y)])[1];
  const sChin = xf(chin), sTop = xf(top), sSkull = xf(skull);
  console.log(JSON.stringify({
    kind: 'close', id: r.id, headPx: +(p.k * H6).toFixed(1), chinScreen: +sChin.toFixed(1), skullCrownScreen: +sSkull.toFixed(1),
    leadPx: +(FRAME_BOTTOM - sTop).toFixed(0), cutHeads: +waistCutHeads(sChin, p.k * H6 * (r.layer ?? 1)).toFixed(3),
    visibleNeckHU: +visibleNeckHU(r.fig).toFixed(3),
  }));
}

// Section figures: the lead is the figure's full height (top to floor) at the sheet's scale for its depth d (projected, composition px).
const sections = [
  {id: 'B04-SH01 walk (SEC-2D, d 0.75)', sec: SEC_2D, yc: 1.3, fig: figSide(YOU, {stride: 1, mitten: MITTEN_6H}), d: 0.75},
  {id: 'B06-SH01 walk and hover (SEC-2D, d 0.75)', sec: SEC_2D, yc: 2.8, fig: figSide(YOU, {stride: 1, mitten: MITTEN_6H}), d: 0.75},
  {id: 'B07-SH02 sofa (SEC-2D-LL, d 0.75)', sec: SEC_2D_LL_B07, yc: 5.4, fig: figSeatSofa(YOU, {mitten: MITTEN_6H, hold: 'bread'}), d: 0.75},
];
for (const s of sections) {
  const S = section(s.sec, s.yc);
  const k = S.pxPerM(s.d) / 447;
  console.log(JSON.stringify({kind: 'section', id: s.id, k: +k.toFixed(4), leadPx: +(topPx(s.fig) * k).toFixed(0), headPx: +(H6 * k).toFixed(1)}));
}
// B05-SH01 medium: the plate's fixed scale (186 px per 6-head figure height is the head box, `k = 186 / H6`).
{
  const k = 186 / H6;
  const fig = figFront(YOU, {arms: 'bucket', mitten: MITTEN_6H});
  console.log(JSON.stringify({kind: 'section', id: 'B05-SH01 bucket lift (medium, 186 px head)', k: +k.toFixed(4), leadPx: +(topPx(fig) * k).toFixed(0)}));
}

// Mitten extents in the hand's own frame (dir +x): length from the wrist cap to the fingertips, width across the palm and thumb lobe.
const extents = (size?: Partial<typeof MITTEN_6H>) => {
  const parts = handParts({kind: 'mitten', w: [0, 0] as HU, dir: [1, 0] as HU, thumb: 1, ...size}, '#000');
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of parts) for (const [x, y] of p.pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return {longHU: +((x1 - x0) / H6).toFixed(3), acrossHU: +((y1 - y0) / H6).toFixed(3)};
};
console.log(JSON.stringify({kind: 'mitten', id: 'shared default', ...extents()}));
console.log(JSON.stringify({kind: 'mitten', id: 'BODY-ZCP-6H (G2 plates)', ...extents(MITTEN_6H)}));

// Boss pass 15 (G3): the seated B09 figures at SEAT_D (sheet R1.5 d 0.55; SH01 pitch 20 deg, SH03 pitch -15 deg) and the standing B10 figure
// (back view, 6H mitten) at its plate scale (feet y 1775, 2.33 m; 1844 px focal). Lead = full figure height at the plate scale, px.
{
  const PX_M_B09 = 565 / (1 + SEAT_D / 6);
  const seated = (pitch: number) => +((topPx(figSeatFloor(YOU_DAY3, {pitch, overlay: 'day3'})) / 447) * PX_M_B09).toFixed(0);
  console.log(JSON.stringify({kind: 'seated', id: 'B09-SH01 seated (SEC-2D-LL, d SEAT_D, pitch 20 deg)', d: SEAT_D, leadPx: seated(0.3491), sheet: 491}));
  console.log(JSON.stringify({kind: 'seated', id: 'B09-SH03 seated (SEC-2D-LL, d SEAT_D, pitch -15 deg)', d: SEAT_D, leadPx: seated(-0.2618), sheet: 496}));
  const kB10 = (1844 / (3.25 - 0.92)) / 447;
  const b10 = figFrontG(YOU_DAY3, {back: true, overlay: 'day3', mitten: MITTEN_6H});
  console.log(JSON.stringify({kind: 'standing', id: 'B10-SH01 back view (PERSP-2D F 1844, feet y 1775)', k: +kB10.toFixed(4), leadPx: +(topPx(b10) * kB10).toFixed(0), sheet: 1345}));
}

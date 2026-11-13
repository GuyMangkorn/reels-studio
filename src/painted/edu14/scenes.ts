// EDU-EP14-SHORT look frames (brief EDU-EP14-BRIEF-R1, rows EDU-EP14-ROWS-R1.0, workflow W3). LOOK-FRAME CODE: pure paint functions.
// LF01 SET-BUSSTOP real (B01-SH01 @ +48), LF02 the no-air grade (B01-SH03 @ +20), LF03 SET-COLUMN (B01-SH05 @ +30), LF04 SET-CITY-TOPDOWN (B01-SH07 @ +70),
// LF05 SET-FALL real condo (B02-SH02 @ +120). Cameras are the brief's lines with the lens and horizon tuned here; the W5.1 sheets take them over.
import {hash} from '../kit/hash';
import {camMove, camOf} from '../kit/cam-moves';
import {paintFall} from '../kit/fall';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import {poseArms} from '../kit/poses';
import type {FigAnchors} from '../kit/cast';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {camPoint, camUnit} from '../kit/ycam';
import {paintBusStop, paintLipDrips, type World} from './busstop';
import {GIRL, GIRL_AT} from './palette';
import {columnCam, columnMeasure, paintColumn} from './column';
import {fallCam, paintFallFacade, FACADE_Z, STOREY} from './facade';
import {paintCityTopdown, topdownCam} from './topdown';
import {mixColor} from '../kit/painter';
import {ell, hardFill} from '../kit/draw';

export const LF_FRAMES = {LF01: 1, LF02: 1, LF02U: 1, LF03: 1, LF04: 1, LF05: 1} as const;
export type Measure = {lead?: {top: number; bottom: number}; extra?: Record<string, number>; cam?: YCam};
export const MEASURE: Record<string, Measure> = {};
export const CAPTION_BAND: [number, number] = [1176, 1344];

// ---- LF01: B01-SH01 @ +48. brief `target (0.25, 1.20, 0.05), yaw 12, r 3.00, eye 1.20, f 1200, hy 670`.
export const camLF01 = camOf(camMove([0.25, 1.2, 0.05], [12, 12], 3.0, 1.2, {f: 1200, hy: 670}), 1);

const rain = (p: Painter, w: World, t: number, count = 260) => {
  if (w === 'real') paintFall(p, 'rain', {width: 1080, height: 1920, t, captionBand: [...CAPTION_BAND], style: {count}});
};

/** The bus-stop shot: set, GIRL on her mark (P30, front), lip drops, rain. `face` = expression. */
export const paintBusShot = (p: Painter, c: YCam, w: World, key: string, face: 'tired' | 'neutral') => {
  const o = {world: w, t: 0.4};
  paintBusStop(p, c, o);
  // P30's hand (the kit table is for the 1.66 m adult) lands on the child's eye: raise the visor hand to the brow (`lArm`, 0.05 m up) so it shades the eyes instead of rubbing one
  const g = camPoint(c, GIRL_AT), u = camUnit(c, GIRL_AT), base = g ? poseArms('P30', GIRL, g, u, 'front') : null;
  const lArm = base?.lArm ? {...base.lArm, to: [base.lArm.to[0] + 0.012 * u, base.lArm.to[1] - 0.055 * u] as [number, number], via: base.lArm.via ? [base.lArm.via[0], base.lArm.via[1] - 0.02 * u] as [number, number] : undefined} : undefined;
  const a: FigAnchors | null = paintFigureAt(p, c, GIRL, {...VIEW_CUES_OFF, at: GIRL_AT, view: 'front', pose: 'P30', face, faceState: {look: [0.0, -0.8]}, fig: lArm ? {lArm} : undefined, t: 0.4, shadow: {op: 70}});
  paintLipDrips(p, c, o);
  rain(p, w, o.t);
  if (a) MEASURE[key] = {lead: {top: a.top, bottom: a.bottom}, cam: c, extra: {feetY: Math.round(a.feet[1]), headTop: Math.round(a.headTop), pxPerM: Math.round(camUnit(c, GIRL_AT)), lipY: Math.round(camPoint(c, [0.25, 2.4, 0.1])?.[1] ?? 0)}};
};
export const paintLF01 = (p: Painter) => paintBusShot(p, camLF01, 'real', 'LF01', 'tired');

// ---- LF02: B01-SH03 @ +20 of 86 (crane just starting). brief `target (0.25, 1.20 -> 7.0, 0.05), yaw 12->10, r 3.0->3.4, eye 1.20 -> 3.60, pitch 0 -> +62 (ease in-out), f 1200, hy 670->760`.
export const moveSH03 = camMove([[0.25, 1.2, 0.05], [0.25, 7.0, 0.05]], [12, 10], [3.0, 3.4], [1.2, 3.6], {pitch: [0, 62], f: 1200, hy: 670, ease: [0, 1]});
export const camLF02 = camOf(moveSH03, 20 / 86);
export const paintLF02 = (p: Painter) => paintBusShot(p, camLF02, 'noair', 'LF02', 'neutral');
/** Measure companion: the same frame in real colour (grade u 0, no rain either way) to read the grade's saturation ratio. Not a look frame. */
export const paintLF02U = (p: Painter) => paintBusShot(p, camLF02, 'noair', 'LF02U', 'neutral');

// ---- LF03: B01-SH05 @ +30. brief `target (0, 1000, 0), yaw 0, r 8200, eye 1000, f 3600, hy 690`.
export const camLF03 = columnCam(8200, 1000);
export const columnLF03 = columnMeasure(camLF03);
export const paintLF03 = (p: Painter) => { paintColumn(p, camLF03); MEASURE.LF03 = {cam: camLF03, extra: {baseY: Math.round(columnLF03.baseY), groundY: Math.round(columnLF03.groundY), pxPerMx1000: Math.round(columnLF03.pxPerM * 1000)}}; };

// ---- LF04: B01-SH07 @ +70 (h ~ 30 m). brief `ycam (0.25, 30, 0.20), pitch -89, f 1100, hy 960`.
export const camLF04 = topdownCam(30);
export const paintLF04 = (p: Painter) => {
  paintCityTopdown(p, camLF04, {world: 'noair', t: 0.4});
  const a = camPoint(camLF04, [-2, 2.65, -1.7]), b = camPoint(camLF04, [2, 2.4, 0.1]);
  if (a && b) MEASURE.LF04 = {cam: camLF04, extra: {roofLeft: Math.round(a[0]), roofRight: Math.round(b[0]), roofTop: Math.round(a[1]), roofBottom: Math.round(b[1])}};
};

// ---- LF05: B02-SH02 @ +120. brief `follow r 0.15 m, f 1200, hy 700`: the drop at the origin, the facade 6.0 m beyond.
export const camLF05 = fallCam(0.15);
export const DROP_AT = camPoint(camLF05, [0, 0, 0]) as [number, number];
/** PLACEHOLDER drop (5 mm = 40 px sphere: cyan edge, white rim top, darker bottom); Film's `drop.ts` (SP1) replaces it. */
const placeholderDrop = (p: Painter, x: number, y: number, r: number) => {
  hardFill(p, 50100, '#dff4fa', ell(x, y, r + 3, r + 3, 22));
  hardFill(p, 50101, '#6fb4cf', ell(x, y, r, r, 22));
  hardFill(p, 50102, '#a9cfe0', ell(x, y - r * 0.18, r * 0.84, r * 0.74, 20));
  hardFill(p, 50103, '#ffffff', ell(x - r * 0.3, y - r * 0.42, r * 0.28, r * 0.18, 10));
};
export const paintLF05 = (p: Painter) => {
  paintFallFacade(p, camLF05, 0.9);
  // speed streaks and rain round the drop (relative to the falling camera everything rises)
  p.inkStill(50050, 'pen', '#e9eef0', 1.3);
  for (let i = 0; i < 46; i++) { const x = (i * 97 + Math.round(hash(50060 + i) * 90)) % 1080, y0 = hash(50200 + i) * 1900, L = 140 + hash(50300 + i) * 360; p.brush.line(x, y0, x + 2, y0 - L); }
  paintFall(p, 'rain', {width: 1080, height: 1920, t: 0.3, captionBand: [...CAPTION_BAND], style: {count: 36, fall: [-900, -500], drift: [-10, 10], len: [120, 240], color: '#dfe9ee', weight: 1.4}});
  placeholderDrop(p, DROP_AT[0], DROP_AT[1], 20);
  const slabs = [-1, 0, 1].map((k) => camPoint(camLF05, [0, 0.9 + 3 * k - 0.0, FACADE_Z])?.[1] ?? 0);
  MEASURE.LF05 = {cam: camLF05, extra: {storeyPx: Math.round(slabs[0] - slabs[1]), storeyPxExpected: Math.round(camUnit(camLF05, [0, 0, FACADE_Z]) * STOREY), dropX: Math.round(DROP_AT[0]), dropY: Math.round(DROP_AT[1])}};
  void mixColor;
};

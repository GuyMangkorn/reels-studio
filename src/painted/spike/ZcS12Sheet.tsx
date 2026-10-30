import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {INFECTED, INFECTED_SCALE, YOU, YOU_DAY3, ZC_FACES} from '../zcpaint/cast';
import {
  capHU, drawFig, ellHU, figFront, figSeatFloor, figSeatSofa, figSide, figSlack, H6, handParts, type Fig, type Hand, type HandKind, type Part,
  paintPart, SIL, toPx, washPaint,
} from '../zcpaint/body6';
import {castTone, localTravel} from '../zcpaint/light';
import {placeAt} from '../zcpaint/ctx';
import {FACES, type Face} from './FaceSheet';
import {paintBodyFront} from './CastSheet';

// ZCPAINT model sheet S-P12 (Boss pass 7, BODY-ZCP-6H; pass 7b after the user's look check of 30 Oct 2026): the 6-head `zc-you`
// and `zc-infected` for the user's look check. Spike entry only (zcpaint-s-p12-index.ts); serves no shot and is not a production
// plate. Pages: A calibration (447 px/m, head ticks, the WORLD FOG 4-head figure beside it), B infected (left to gravity, muted
// clothes) and third-person hands, C seated (B09-SH01 at head pitch 20°, B09-SH03, B07 sofa stand-in). The measure compositions
// M1-M9 hold one bare figure each (no floor, no shadow), so `bbox.py` reads the artwork height only.

const PAPER = '#efe6d2', FLOOR = '#d9ccb0', GUIDE = '#9fb3c4', INKC = '#2b211c', LABEL = '#5d6b78';
/** Floor band: from a back line behind the figures (where the cast shadows fall) to a front edge below the feet. */
const FLOOR_BACK = 260, FLOOR_FRONT = 40;
const SOFA = '#a79574', SOFA_BACK = '#8a7a5f', BUCKET = '#7aa0be', BUCKET_CEL = '#5e7d96', BAR = '#7d8a93', LID = '#c9c3b4';
const SKIN_HAND = '#e2b084';
/** Seated head pitch (rad): B09-SH01 head pitched down 20° (the sheet row, accepted by the user at the look check), SH03 lifted 15°. */
const PITCH_20 = 0.3491, LIFT_15 = -0.2618;
/** Section scales: B09 `SEC-2D-LL` (U 565 px/m, d 0.55) = 517.6 px/m; B07 (U 480, d 0.75) = 426.7 px/m; `SEC-2D` (U 380, d 0.75) = 337.8 px/m. */
const K_B09 = (565 / (1 + 0.55 / 6)) / 447;
const K_B07 = (480 / (1 + 0.75 / 6)) / 447;
const K_SEC = (380 / (1 + 0.75 / 6)) / 447;
/** B09 listening look (brief `VB-ZCPAINT-SHORT-R2.5` B09-SH03: look [1, -0.2] in profile, eyes dot). */
const LISTEN: Face = {name: 'listening', brow: 'flat', eyes: 'dot', look: [1, -0.2], mouth: 'flat'};

/** Row grounds: page A rows, page B infected row and the hand-kit wrists, page C seated rows. */
const A1 = 870, A2 = 1790, B1 = 960, HAND_W = 1400, C1 = 880, C2 = 1640;

/** Floor band with a back line: the surface the cast shadows fall on (LT-03). */
const floorBand = (ctx: PaintContext, id: number, ground: number) => {
  washPaint(ctx, id).part(FLOOR, [[-10, ground - FLOOR_BACK], [1090, ground - FLOOR_BACK], [1090, ground + FLOOR_FRONT], [-10, ground + FLOOR_FRONT]], false);
  ctx.still(id + 1);
  ctx.brush.set('HB', GUIDE, 1.0);
  ctx.brush.line(-10, ground - FLOOR_BACK, 1090, ground - FLOOR_BACK);
  ctx.still(id + 2);
  ctx.brush.set('rotring', INKC, 1.0);
  ctx.brush.line(-10, ground, 1090, ground);
};

/** Head-tick guides for one row: a line per head from the floor to 6 heads (the calibration). */
const headGuides = (ctx: PaintContext, id: number, ground: number) => {
  for (let i = 0; i <= 6; i++) {
    const y = ground - i * H6;
    ctx.still(id + i);
    ctx.brush.set('HB', i === 0 ? INKC : GUIDE, i === 0 ? 1.4 : 0.8);
    ctx.brush.line(20, y, 1060, y);
  }
};

/** The B05-SH01 bucket, lifted in front of the body: body, cel edge on the far side, the rim and the handle the hands grip. */
const bucketInsert = (): Part[] => [{
  col: '', pts: [], cel: 0,
  draw: (p) => {
    p.part(BUCKET, toPx([[-0.5, 3.55], [0.5, 3.55], [0.42, 2.6], [-0.42, 2.6]]), true);
    p.part(BUCKET_CEL, toPx([[-0.5, 3.55], [-0.36, 3.55], [-0.3, 2.6], [-0.42, 2.6]]), false);
    p.ink(toPx([[-0.5, 3.55], [0.5, 3.55]]), 0.9, 0);
    p.ink(toPx([[-0.5, 3.55], [-0.36, 3.85], [-0.1, 4.02], [0.1, 4.02], [0.36, 3.85], [0.5, 3.55]]), 1.6, 0.4);
  },
}];

/** B07 sofa stand-in, profile facing right: back and seat block at 0.45 m (1.59 heads), and the buttock's contact patch on the seat top
 *  (the seat is not a receiver in S-P11 yet; the figure's floor cast starts at its feet). Colours only; not a props plate. */
const drawSofa = (ctx: PaintContext, base: number, gx: number, gy: number, k: number) => {
  placeAt(ctx.brush, gx, gy, k, 1, () => {
    const p = washPaint(ctx, base);
    p.part(SOFA_BACK, toPx([[-0.95, 0], [-0.6, 0], [-0.6, 3.0], [-0.95, 3.0]]), true);
    p.part(SOFA, toPx([[-0.6, 0], [1.6, 0], [1.6, 1.59], [-0.6, 1.59]]), true);
    p.ink(toPx([[-0.6, 1.59], [1.6, 1.59]]), 1.2, 0);
    p.part(castTone(SOFA), toPx(ellHU(0, 1.59, 0.5, 0.06, 14)), false);
  });
};

/** Hand kit: one hand with its wrist at (gx, gy), drawn at 2.2 x with a forearm stub and an optional prop behind the hand. */
const handKit = (ctx: PaintContext, base: number, gx: number, gy: number, kind: HandKind, prop: 'bar' | 'lid' | 'none') => {
  placeAt(ctx.brush, gx, gy, 2.2, 1, () => {
    const p = washPaint(ctx, base);
    const hand: Hand = {kind, w: [0, 0], dir: [0, -1], thumb: 1};
    if (prop === 'bar') p.part(BAR, toPx(capHU([-0.6, -0.22], [0.6, -0.22], 0.12, 0.12)), true);
    if (prop === 'lid') p.part(LID, toPx(capHU([0.09, -0.45], [0.09, -1.25], 0.1, 0.1, 4)), true);
    p.part(SKIN_HAND, toPx(capHU([0, 0.35], [0, -0.02], 0.27, 0.21)), true);
    const light = localTravel(1);
    for (const part of handParts(hand, SKIN_HAND)) paintPart(p, part, light);
  });
};

/** Label under a figure or hand. */
const Lbl = ({x, y, w = 330, children, small}: {x: number; y: number; w?: number; children: ReactNode; small?: boolean}) => (
  <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, textAlign: 'center', fontSize: small ? 20 : 24, lineHeight: 1.2, color: INKC}}>{children}</div>
);

const Page = ({paint, children, title}: {paint: (ctx: PaintContext) => void; children: ReactNode; title: string}) => (
  <AbsoluteFill style={{backgroundColor: PAPER}}>
    <BrushCanvas paint={paint} paper={PAPER} />
    <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INKC}}>
      <div style={{position: 'absolute', left: 30, top: 22, fontSize: 30}}>{title}</div>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ page A: calibration and standing views

const paintA = (ctx: PaintContext) => {
  floorBand(ctx, 100, A1);
  headGuides(ctx, 200, A1);
  floorBand(ctx, 300, A2);
  placeAt(ctx.brush, 180, A1, 1, 1, () => paintBodyFront(ctx, YOU, 0, 0, 0, {blink: false}));
  drawFig(ctx, 1000, figFront(YOU, {face: FACES[0]}), {gx: 540, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 2000, figSide(YOU, {face: FACES[0]}), {gx: 900, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 3000, figFront(YOU, {back: true}), {gx: 180, gy: A2, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 4000, figSide(YOU, {stride: 1, face: FACES[0]}), {gx: 540, gy: A2, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 5000, figFront(YOU, {arms: 'bucket', inserts: bucketInsert()}), {gx: 900, gy: A2, k: 1, dir: 1}, {floor: FLOOR});
};

export const ZcS12A = () => (
  <Page paint={paintA} title="S-P12 · A calibration · 447 px/m · 1 head = 126.65 px · zc-you 1.70 m = 6 heads">
    {[6, 5, 4, 3, 2, 1].map((n) => (
      <div key={n} style={{position: 'absolute', left: 4, top: A1 - n * H6 - 14, fontSize: 20, color: LABEL}}>{n}</div>
    ))}
    <Lbl x={180} y={A1 + 66}><b>WORLD FOG 4-head</b> front (reference, unchanged)</Lbl>
    <Lbl x={540} y={A1 + 66}><b>zc-you 6-head</b> front, mitten hands, cel 2 tones</Lbl>
    <Lbl x={900} y={A1 + 66}><b>zc-you 6-head</b> profile, facing right</Lbl>
    <Lbl x={180} y={A2 + 66}><b>zc-you 6-head</b> back view (B01, B06-SH02, B10)</Lbl>
    <Lbl x={540} y={A2 + 66}><b>zc-you 6-head</b> walk, facing right (B04-SH01)</Lbl>
    <Lbl x={900} y={A2 + 66}><b>zc-you 6-head</b> bucket lift (B05-SH01)</Lbl>
  </Page>
);

// ------------------------------------------------------------------ page B: infected (left to gravity) and third-person hands

const paintB = (ctx: PaintContext) => {
  floorBand(ctx, 100, B1);
  drawFig(ctx, 1000, figSlack(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true, dirt: true}), {gx: 200, gy: B1, k: INFECTED_SCALE, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 2000, figSlack(INFECTED, {view: 'side', slump: 1, overlay: 'infected', dirt: true}), {gx: 540, gy: B1, k: INFECTED_SCALE, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 3000, figSlack(INFECTED, {view: 'side', slump: 1}), {gx: 880, gy: B1, k: INFECTED_SCALE, dir: -1}, {floor: FLOOR, sil: SIL});
  handKit(ctx, 5000, 150, HAND_W, 'mitten', 'none');
  handKit(ctx, 5100, 420, HAND_W, 'mitten', 'bar');
  handKit(ctx, 5200, 690, HAND_W, 'pinch', 'lid');
  handKit(ctx, 5300, 960, HAND_W, 'fist', 'none');
};

export const ZcS12B = () => (
  <Page paint={paintB} title="S-P12 · B infected 1.62 m (0.95 x) · left to gravity · third-person hands at 2.2 x">
    <Lbl x={200} y={B1 + 66}><b>infected</b> front: rage decal, hair lock over one eye, blood, slack shoulders and arms</Lbl>
    <Lbl x={540} y={B1 + 66}><b>infected</b> profile, lit: head drops, weight sags, blood at the mouth</Lbl>
    <Lbl x={880} y={B1 + 66}><b>infected</b> silhouette (B01 K1, facing left)</Lbl>
    <Lbl x={150} y={HAND_W + 360} w={250} small>mitten (HD-03): no finger articulation</Lbl>
    <Lbl x={420} y={HAND_W + 360} w={250} small>mitten on the bucket bar</Lbl>
    <Lbl x={690} y={HAND_W + 360} w={250} small>pinch: visible gap, index to thumb (B05-SH03, B07-SH01)</Lbl>
    <Lbl x={940} y={HAND_W + 360} w={250} small>closed fist (HD-04): knuckles out</Lbl>
  </Page>
);

// ------------------------------------------------------------------ page C: seated

const paintC = (ctx: PaintContext) => {
  floorBand(ctx, 100, C1);
  floorBand(ctx, 200, C2);
  drawFig(ctx, 1000, figSeatFloor(YOU_DAY3, {face: ZC_FACES.neutral, pitch: PITCH_20, overlay: 'day3'}), {gx: 330, gy: C1, k: 1, dir: -1}, {floor: FLOOR});
  drawFig(ctx, 3000, figSeatFloor(YOU_DAY3, {face: LISTEN, pitch: LIFT_15, overlay: 'day3'}), {gx: 800, gy: C1, k: 1, dir: -1}, {floor: FLOOR});
  drawSofa(ctx, 4000, 540, C2, 1);
  drawFig(ctx, 5000, figSeatSofa(YOU, {face: ZC_FACES.neutral}), {gx: 540, gy: C2, k: 1, dir: 1}, {floor: FLOOR});
};

export const ZcS12C = () => (
  <Page paint={paintC} title="S-P12 · C seated · B09 floor (day 3, fists, head pitch 20°) · B07 sofa · 447 px/m">
    <Lbl x={330} y={C1 + 66} w={380}><b>B09-SH01</b> floor, day 3, head pitched down 20° (sheet row)</Lbl>
    <Lbl x={800} y={C1 + 66} w={380}><b>B09-SH03</b> listening, head lifted 15°</Lbl>
    <Lbl x={540} y={C2 + 66} w={460}><b>B07-SH02</b> sofa, bread in both mitten hands (sofa: stand-in)</Lbl>
  </Page>
);

// ------------------------------------------------------------------ measure compositions: one bare figure each

/** A composition that paints one figure with no floor, no shadow and no labels, for `bbox.py` (artwork height only). */
const measure = (fig: Fig, k: number, dir: 1 | -1, gy: number) => {
  const paint = (ctx: PaintContext) => drawFig(ctx, 9000, fig, {gx: 540, gy, k, dir});
  return () => (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
    </AbsoluteFill>
  );
};

/** M1-M9 ground at y 1500 (the figure's feet); see build notes "Boss pass 7" and "Boss pass 7b" for the measured values. */
export const ZcS12M1 = measure(figFront(YOU), 1, 1, 1500);
export const ZcS12M2 = measure(figSlack(INFECTED, {view: 'front', slump: 1, overlay: 'rage'}), INFECTED_SCALE, 1, 1500);
export const ZcS12M3 = measure(figSide(YOU, {stride: 1}), 1, 1, 1500);
export const ZcS12M4 = measure(figSeatFloor(YOU_DAY3, {face: ZC_FACES.neutral, pitch: PITCH_20}), K_B09, -1, 1500);
export const ZcS12M5 = measure(figSeatFloor(YOU_DAY3, {face: ZC_FACES.neutral, pitch: 0.2094}), K_B09, -1, 1500);
export const ZcS12M6 = measure(figSeatFloor(YOU_DAY3, {face: LISTEN, pitch: LIFT_15}), K_B09, -1, 1500);
export const ZcS12M7 = measure(figSeatSofa(YOU, {face: ZC_FACES.neutral}), K_B07, 1, 1500);
export const ZcS12M8 = measure(figFront(YOU), K_SEC, 1, 1500);
export const ZcS12M9 = measure(figSlack(INFECTED, {view: 'front', slump: 0, overlay: 'rage'}), INFECTED_SCALE, 1, 1500);

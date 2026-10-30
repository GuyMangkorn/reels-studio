import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {INFECTED, INFECTED_SCALE, YOU, YOU_DAY3, ZC_FACES} from '../zcpaint/cast';
import {drawFig, figFront, figSeatFloor, figSeatSofa, figSide, figSlack, H6, SIL, TEX_B, washPaint} from '../zcpaint/body6';
import {bustFig, placeClose} from '../zcpaint/bust';
import {castTone} from '../zcpaint/light';
import {placeAt} from '../zcpaint/ctx';
import {FACES, type Face} from './FaceSheet';
import {ellipse} from './ProportionSheet';

// ZCPAINT model sheet R2.6 (Boss pass 11, `CS-ZCP-R26` costume, `TX-ZCP-CLOTH` texture, `BODY-ZCP-6H` arms by CP-P, `FR-ZCP-CLOSE` closes;
// request B7). Spike entry only (zcpaint-r26-index.ts): serves no shot and is not a production plate. Pages: A standing and walk (CP-P rows
// named per pose), B infected, C seated and sofa, D the cloth texture off and on, E busts at 6 heads, F and G the two bust closes cut at the
// waist (the frame bottom cuts `waistCutHeads`). Values in the labels are measured from the geometry (`scripts/zombie-condo-paint/r26-sheet.sh`).

const PAPER = '#efe6d2', FLOOR = '#d9ccb0', GUIDE = '#9fb3c4', INKC = '#2b211c', LABEL = '#5d6b78';
const SOFA = '#a79574', SOFA_BACK = '#8a7a5f';
const FLOOR_BACK = 260, FLOOR_FRONT = 40;
/** Row grounds: pages A, D, E (two rows); page B infected; page C seated rows. */
const A1 = 870, A2 = 1790, B1 = 960, C1 = 880, C2 = 1640;
/** Seated head pitch (rad): B09-SH01 pitched down 20 degrees, B09-SH03 lifted 15 degrees. */
const PITCH_20 = 0.3491, LIFT_15 = -0.2618;
/** B09 listening look (brief `VB-ZCPAINT-SHORT-R2.5` B09-SH03). */
const LISTEN: Face = {name: 'listening', brow: 'flat', eyes: 'dot', look: [1, -0.2], mouth: 'flat'};
/** B02-SH03 heave face (closeups.ts). */
const HEAVE: Face = {name: 'heave', brow: 'flat', eyes: 'dot', look: [-0.6, 0], mouth: 'wavy'};

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

/** Label under a figure. */
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

/** Sofa stand-in (B07): back and seat block at 0.45 m (1.59 heads), colours only. */
const drawSofa = (ctx: PaintContext, base: number, gx: number, gy: number, k: number) => {
  placeAt(ctx.brush, gx, gy, k, 1, () => {
    const p = washPaint(ctx, base);
    p.part(SOFA_BACK, [[-0.95 * H6, 0], [-0.6 * H6, 0], [-0.6 * H6, -3.0 * H6], [-0.95 * H6, -3.0 * H6]], true);
    p.part(SOFA, [[-0.6 * H6, 0], [1.6 * H6, 0], [1.6 * H6, -1.59 * H6], [-0.6 * H6, -1.59 * H6]], true);
    p.ink([[-0.6 * H6, -1.59 * H6], [1.6 * H6, -1.59 * H6]], 1.2, 0);
    p.part(castTone(SOFA), ellipse(0, -1.59 * H6, 0.5 * H6, 0.06 * H6, 14), false);
  });
};

// ------------------------------------------------------------------ page A: standing, walk and the CP-P arm rows

const paintA = (ctx: PaintContext) => {
  floorBand(ctx, 100, A1);
  floorBand(ctx, 300, A2);
  drawFig(ctx, 1000, figFront(YOU, {face: FACES[0]}), {gx: 180, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 2000, figFront(YOU, {back: true}), {gx: 540, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 3000, figSide(YOU, {face: FACES[0]}), {gx: 900, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 4000, figSide(YOU, {stride: 1, face: FACES[0]}), {gx: 180, gy: A2, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 5000, figFront(YOU, {arms: 'bucket'}), {gx: 540, gy: A2, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 6000, figFront(YOU_DAY3, {face: FACES[0], overlay: 'day3'}), {gx: 900, gy: A2, k: 1, dir: 1}, {floor: FLOOR});
};

export const ZcR26A = () => (
  <Page paint={paintA} title="R2.6 model sheet · A standing and walk · zc-you costume CS-ZCP-R26 · 447 px/m · 1 head = 126.65 px">
    <Lbl x={180} y={A1 + 66}><b>front</b>, hang, CP-P05; overshirt open over the tee</Lbl>
    <Lbl x={540} y={A1 + 66}><b>back</b>, hang; collar stand covers the nape</Lbl>
    <Lbl x={900} y={A1 + 66}><b>profile</b>, standing, CP-P05</Lbl>
    <Lbl x={180} y={A2 + 66}><b>walk</b>, CP-P03: near arm back, far arm forward</Lbl>
    <Lbl x={540} y={A2 + 66}><b>bucket grip</b>, CP-P02: elbows back, upper arms behind</Lbl>
    <Lbl x={900} y={A2 + 66}><b>day 3</b> front (COSTUME_DAY3)</Lbl>
  </Page>
);

// ------------------------------------------------------------------ page B: infected (khaki 7b, sleeves to the wrist, trousers to the ankle)

const paintB = (ctx: PaintContext) => {
  floorBand(ctx, 100, B1);
  drawFig(ctx, 1000, figSlack(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true, dirt: true}), {gx: 200, gy: B1, k: INFECTED_SCALE, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 2000, figSlack(INFECTED, {view: 'side', slump: 1, overlay: 'infected', dirt: true}), {gx: 540, gy: B1, k: INFECTED_SCALE, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 3000, figSlack(INFECTED, {view: 'side', slump: 1}), {gx: 880, gy: B1, k: INFECTED_SCALE, dir: -1}, {floor: FLOOR, sil: SIL});
};

export const ZcR26B = () => (
  <Page paint={paintB} title="R2.6 model sheet · B infected 1.62 m (0.95 x) · khaki 7b shirt, sleeves to the wrist, grey-green trousers to the ankle">
    <Lbl x={200} y={B1 + 66}><b>infected</b> front, slump 1: rage decal, blood, sleeves to the wrist</Lbl>
    <Lbl x={540} y={B1 + 66}><b>infected</b> profile, lit, slump 1</Lbl>
    <Lbl x={880} y={B1 + 66}><b>infected</b> silhouette (B01, facing left)</Lbl>
  </Page>
);

// ------------------------------------------------------------------ page C: seated on the floor, on the sofa

const paintC = (ctx: PaintContext) => {
  floorBand(ctx, 100, C1);
  floorBand(ctx, 200, C2);
  drawFig(ctx, 1000, figSeatFloor(YOU_DAY3, {face: ZC_FACES.neutral, pitch: PITCH_20, overlay: 'day3'}), {gx: 330, gy: C1, k: 1, dir: -1}, {floor: FLOOR});
  drawFig(ctx, 3000, figSeatFloor(YOU_DAY3, {face: LISTEN, pitch: LIFT_15, overlay: 'day3'}), {gx: 800, gy: C1, k: 1, dir: -1}, {floor: FLOOR});
  drawSofa(ctx, 4000, 540, C2, 1);
  drawFig(ctx, 5000, figSeatSofa(YOU, {face: ZC_FACES.neutral}), {gx: 540, gy: C2, k: 1, dir: 1}, {floor: FLOOR});
};

export const ZcR26C = () => (
  <Page paint={paintC} title="R2.6 model sheet · C seated · B09 floor (day 3, fists, head 20 deg down) · B07 sofa · 447 px/m">
    <Lbl x={330} y={C1 + 66} w={380}><b>B09-SH01</b> floor, day 3, sleeves to the fists, trousers to the ankle</Lbl>
    <Lbl x={800} y={C1 + 66} w={380}><b>B09-SH03</b> listening, head lifted 15 deg</Lbl>
    <Lbl x={540} y={C2 + 66} w={460}><b>B07-SH02</b> sofa, bread in both sleeved mitten hands (sofa: stand-in)</Lbl>
  </Page>
);

// ------------------------------------------------------------------ page D: the cloth texture off (flat) and on (TX-ZCP-CLOTH)

const paintD = (ctx: PaintContext) => {
  floorBand(ctx, 100, A1);
  floorBand(ctx, 300, A2);
  drawFig(ctx, 1000, figFront(YOU), {gx: 180, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 2000, figSide(YOU, {stride: 1}), {gx: 540, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 3000, figSeatFloor(YOU_DAY3, {pitch: PITCH_20, overlay: 'day3'}), {gx: 830, gy: A1, k: 1, dir: -1}, {floor: FLOOR});
  drawFig(ctx, 4000, figFront(YOU), {gx: 180, gy: A2, k: 1, dir: 1}, {floor: FLOOR, tex: TEX_B});
  drawFig(ctx, 5000, figSide(YOU, {stride: 1}), {gx: 540, gy: A2, k: 1, dir: 1}, {floor: FLOOR, tex: TEX_B});
  drawFig(ctx, 6000, figSeatFloor(YOU_DAY3, {pitch: PITCH_20, overlay: 'day3'}), {gx: 830, gy: A2, k: 1, dir: -1}, {floor: FLOOR, tex: TEX_B});
};

export const ZcR26D = () => (
  <Page paint={paintD} title="R2.6 model sheet · D cloth texture · top: washPaint off (flat, the fallback) · bottom: TX-ZCP-CLOTH on (glaze + hatch, cloth only)">
    <Lbl x={180} y={A1 + 66}><b>front</b>, flat</Lbl>
    <Lbl x={540} y={A1 + 66}><b>walk</b>, flat</Lbl>
    <Lbl x={830} y={A1 + 66}><b>B09 floor</b>, flat</Lbl>
    <Lbl x={180} y={A2 + 66}><b>front</b>, texture on</Lbl>
    <Lbl x={540} y={A2 + 66}><b>walk</b>, texture on</Lbl>
    <Lbl x={830} y={A2 + 66}><b>B09 floor</b>, texture on</Lbl>
  </Page>
);

// ------------------------------------------------------------------ page E: busts at 6 heads (legs in frame)

const paintE = (ctx: PaintContext) => {
  floorBand(ctx, 100, A1);
  floorBand(ctx, 300, A2);
  drawFig(ctx, 1000, bustFig(YOU, {view: 'front'}), {gx: 180, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 2000, bustFig(YOU, {view: 'back'}), {gx: 540, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 3000, bustFig(YOU, {view: 'side'}), {gx: 900, gy: A1, k: 1, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 4000, bustFig(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true}), {gx: 180, gy: A2, k: INFECTED_SCALE, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 5000, bustFig(INFECTED, {view: 'side', slump: 1}), {gx: 540, gy: A2, k: INFECTED_SCALE, dir: 1}, {floor: FLOOR});
  drawFig(ctx, 6000, bustFig(YOU_DAY3, {view: 'side', seated: true, pitch: 0, overlay: 'day3', face: ZC_FACES.tired}), {gx: 830, gy: A2, k: 1, dir: -1}, {floor: FLOOR});
};

export const ZcR26E = () => (
  <Page paint={paintE} title="R2.6 model sheet · E close bust at 6 heads (legs drawn) · front, back, profile, infected, seated">
    <Lbl x={180} y={A1 + 66}><b>bust front</b>, collar stand, tee strip, bare neck 0.09 head</Lbl>
    <Lbl x={540} y={A1 + 66}><b>bust back</b>, collar stand covers the nape</Lbl>
    <Lbl x={900} y={A1 + 66}><b>bust profile</b>, standing</Lbl>
    <Lbl x={180} y={A2 + 66}><b>infected bust front</b>, slump 1, band collar</Lbl>
    <Lbl x={520} y={A2 + 66} w={280}><b>infected bust profile</b>, slump 1</Lbl>
    <Lbl x={880} y={A2 + 66} w={200}><b>B09-SH02</b> seated, day 3</Lbl>
  </Page>
);

// ------------------------------------------------------------------ pages F and G: the closes cut at the waist (FR-ZCP-CLOSE)

/** B02-SH03 front close, the stopped pass 11 framing: head 587 px, chin on y 1002, frame bottom cuts at the waist. */
const paintF = (ctx: PaintContext) => {
  const fig = bustFig(YOU, {view: 'front', legs: false, face: HEAVE});
  drawFig(ctx, 1000, fig, placeClose(fig, 515, 587, 1002, 1));
};
export const ZcR26F = () => (
  <Page paint={paintF} title="R2.6 close · F B02-SH03 front bust, waist cut · head 587 px · chin y 1002 · frame bottom cuts at 3.44 heads">
    <div style={{position: 'absolute', left: 30, top: 150, fontSize: 22, color: LABEL}}>model sheet, not a plate: staging of the close only; the caption band (y 1060-1248) is not drawn</div>
  </Page>
);

/** B01-SH01 back close (OTS), waist cut: head 600 px, crown y 400, chin y 1000 at the centre x 230. */
const paintG = (ctx: PaintContext) => {
  const fig = bustFig(YOU, {view: 'back', legs: false});
  drawFig(ctx, 1000, fig, placeClose(fig, 230, 600, 1000, 1));
};
export const ZcR26G = () => (
  <Page paint={paintG} title="R2.6 close · G B01-SH01 back bust, waist cut · head 600 px · crown y 400 · chin y 1000 · frame bottom cuts at 3.47 heads">
    <div style={{position: 'absolute', left: 30, top: 150, fontSize: 22, color: LABEL}}>model sheet, not a plate: the bag and the room are not drawn</div>
  </Page>
);

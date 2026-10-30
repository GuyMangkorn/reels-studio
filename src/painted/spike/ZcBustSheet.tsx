import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {bustFig} from '../zcpaint/bust';
import {capHU, drawFig, H6, handParts, paintPart, SIL, toPx, washPaint, type Fig, type Hand, type HandKind} from '../zcpaint/body6';
import {INFECTED, INFECTED_SCALE, YOU, YOU_DAY3, ZC_FACES} from '../zcpaint/cast';
import {placeAt} from '../zcpaint/ctx';
import {localTravel} from '../zcpaint/light';
import {FACES} from './FaceSheet';

// ZCPAINT bust model sheet (Boss pass 10, user 30 Oct 2026: "วาดตัวช็อตใกล้แยก"): the half-body bust for the close shots, drawn as a model
// sheet before any plate. Spike entry only (zcpaint-p10-bust-index.ts): serves no shot itself. Pages: A standing front and back (with head
// ticks: six heads), B standing profile and the infected front (slack, rage face, blood, dirty khaki), C infected profile and its
// silhouette (the B01-SH02 turn), D the seated profile (B09-SH02, day 3) and the reach profile (B07-SH01, pinch on the case), E the hand kit.
// Every standing figure is drawn at one head size (HEAD px) so the pages compare; the plates use the sheet's own head sizes.

const PAPER = '#efe6d2', FLOOR = '#d9ccb0', INKC = '#2b211c', LABEL = '#5d6b78';
/** Floor back line and front edge (the cast shadows fall between them). */
const FLOOR_BACK = 220, FLOOR_FRONT = 36;
/** Model head size (px) for pages A-D: the six-head figure is 6 x this tall. */
const HEAD = 236;
/** Ground line of the standing and seated figures. */
const G = 1790;

const floorBand = (ctx: PaintContext, id: number, ground: number) => {
  washPaint(ctx, id).part(FLOOR, [[0, ground - FLOOR_BACK], [1080, ground - FLOOR_BACK], [1080, ground + FLOOR_FRONT], [0, ground + FLOOR_FRONT]], false);
  ctx.still(id + 1);
  ctx.brush.set('rotring', INKC, 1.0);
  ctx.brush.line(0, ground, 1080, ground);
};

/** Place a figure so its head centre lands on column `cx` at ground `ground`, scale `k`, facing `dir`. */
const put = (fig: Fig, cx: number, ground: number, k: number, dir: 1 | -1 = 1) => ({gx: cx - dir * k * fig.head.x, gy: ground, k, dir});
/** Place a figure by its hip (the origin): a seated figure leans forward, so its head is not the anchor. */
const putHip = (cx: number, ground: number, k: number, dir: 1 | -1 = 1) => ({gx: cx, gy: ground, k, dir});

/** Head ticks at the left of a standing figure: one per head, 0 to 6 (the calibration, B1). */
const HeadTicks = ({ground}: {ground: number}) => (
  <>
    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} style={{position: 'absolute', left: 6, top: ground - n * HEAD - 14, width: 24, fontSize: 20, color: LABEL}}>{n}</div>
    ))}
  </>
);

const Lbl = ({x, y, w = 460, children}: {x: number; y: number; w?: number; children: ReactNode}) => (
  <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, textAlign: 'center', fontSize: 24, lineHeight: 1.25, color: INKC}}>{children}</div>
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

const K_HEAD = HEAD / H6;

// The figures are built once per module load; the pages only paint them.
const YOU_FRONT = bustFig(YOU, {view: 'front', face: FACES[0], blink: false});
const YOU_BACK = bustFig(YOU, {view: 'back', face: FACES[0]});
const YOU_SIDE = bustFig(YOU, {view: 'side', face: FACES[0], blink: false});
const INF_FRONT = bustFig(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true, dirt: true, face: ZC_FACES.rage, blink: false});
const INF_SIDE = bustFig(INFECTED, {view: 'side', slump: 1, face: FACES[0], blink: false});
const SEAT_DAY3 = bustFig(YOU_DAY3, {view: 'side', seated: true, pitch: 0.3491, overlay: 'day3', face: ZC_FACES.tired, blink: false});
const REACH_SIDE = bustFig(YOU_DAY3, {view: 'side', overlay: 'day3', face: FACES[3], blink: false, arms: {R: {kind: 'reach', to: [1.42, 4.02], hand: 'pinch'}}});

const paintA = (ctx: PaintContext) => {
  floorBand(ctx, 100, G);
  drawFig(ctx, 1000, YOU_FRONT, put(YOU_FRONT, 300, G, K_HEAD), {floor: FLOOR});
  drawFig(ctx, 2000, YOU_BACK, put(YOU_BACK, 780, G, K_HEAD), {floor: FLOOR});
};
const paintB = (ctx: PaintContext) => {
  floorBand(ctx, 200, G);
  drawFig(ctx, 3000, YOU_SIDE, put(YOU_SIDE, 300, G, K_HEAD), {floor: FLOOR});
  drawFig(ctx, 4000, INF_FRONT, put(INF_FRONT, 780, G, K_HEAD * INFECTED_SCALE), {floor: FLOOR});
};
const paintC = (ctx: PaintContext) => {
  floorBand(ctx, 300, G);
  drawFig(ctx, 5000, INF_SIDE, put(INF_SIDE, 300, G, K_HEAD * INFECTED_SCALE), {floor: FLOOR});
  drawFig(ctx, 6000, INF_SIDE, put(INF_SIDE, 780, G, K_HEAD * INFECTED_SCALE), {sil: SIL});
};
const paintD = (ctx: PaintContext) => {
  floorBand(ctx, 400, G);
  drawFig(ctx, 7000, SEAT_DAY3, putHip(300, G, K_HEAD), {floor: FLOOR});
  drawFig(ctx, 8000, REACH_SIDE, put(REACH_SIDE, 800, G, K_HEAD, -1), {floor: FLOOR});
};

/** One hand at 2.2 x, its wrist at (gx, gy), fingers up, with a short forearm stub (as the plates' hands). */
const handKit = (ctx: PaintContext, base: number, gx: number, gy: number, kind: HandKind) => {
  placeAt(ctx.brush, gx, gy, 2.2, 1, () => {
    const p = washPaint(ctx, base);
    const hand: Hand = {kind, w: [0, 0], dir: [0, -1], thumb: 1};
    const sk = YOU.head.skin;
    p.part(sk, toPx(capHU([0, 0.35], [0, -0.02], 0.27, 0.21)), true);
    const light = localTravel(1);
    for (const part of handParts(hand, sk)) paintPart(p, part, light);
  });
};
const paintE = (ctx: PaintContext) => {
  floorBand(ctx, 500, 1140);
  handKit(ctx, 9000, 180, 900, 'mitten');
  handKit(ctx, 9100, 540, 900, 'fist');
  handKit(ctx, 9200, 900, 900, 'pinch');
};

export const ZcBustA = () => (
  <Page paint={paintA} title="BUST model sheet · A standing front and back · six heads (head 236 px on this sheet)">
    <HeadTicks ground={G} />
    <Lbl x={300} y={G + 52}><b>front</b> zc-you: mitten hands, cel 2 tones, decal face (WORLD FOG, scaled)</Lbl>
    <Lbl x={780} y={G + 52}><b>back</b> zc-you (OTS plates B01-SH01, B06-SH02)</Lbl>
  </Page>
);
export const ZcBustB = () => (
  <Page paint={paintB} title="BUST model sheet · B standing profile and the infected front">
    <HeadTicks ground={G} />
    <Lbl x={300} y={G + 52}><b>profile</b> zc-you facing right (B07-SH01 standing profile)</Lbl>
    <Lbl x={780} y={G + 52}><b>zc-infected front</b>: slack shoulders, head a little higher, rage face, blood, dirty khaki (B01-SH02)</Lbl>
  </Page>
);
export const ZcBustC = () => (
  <Page paint={paintC} title="BUST model sheet · C infected profile and its silhouette (the B01-SH02 turn)">
    <HeadTicks ground={G} />
    <Lbl x={300} y={G + 52}><b>infected profile</b>: slack, bob hair, dirty shirt, cel 2 tones</Lbl>
    <Lbl x={780} y={G + 52}><b>silhouette</b> (B01-SH02 f 0-22, one colour, no ink)</Lbl>
  </Page>
);
export const ZcBustD = () => (
  <Page paint={paintD} title="BUST model sheet · D seated profile (B09-SH02, day 3) and reach profile (B07-SH01)">
    <HeadTicks ground={G} />
    <Lbl x={300} y={G + 52}><b>seated on the floor</b>, profile, hugging the knees, head pitched 20 deg (day 3)</Lbl>
    <Lbl x={780} y={G + 52}><b>reach</b>: pinch on the case clasp (B07-SH01)</Lbl>
  </Page>
);
export const ZcBustE = () => (
  <Page paint={paintE} title="BUST model sheet · E hand kit (2.2 x): mitten, fist, pinch">
    <Lbl x={180} y={1000} w={330}><b>mitten</b> (HD-03): WORLD FOG mitten with a thumb lobe</Lbl>
    <Lbl x={540} y={1000} w={330}><b>fist</b> (HD-04): knuckles and curled fingers</Lbl>
    <Lbl x={900} y={1000} w={330}><b>pinch</b>: index and thumb with a visible gap</Lbl>
  </Page>
);

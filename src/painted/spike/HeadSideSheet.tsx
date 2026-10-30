import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {CAST, type Cast} from './CastSheet';
import {FACES, INK, paintHead, type Face, type HeadStyle} from './FaceSheet';
import {makePaint, paintBodySide, paintHeadSide} from './SideSheet';
import {YOU} from './ZcPaint';

// HEAD-SIDE-R2 review sheet (Boss, 29 Oct 2026): the rebuilt profile decal head after the user's side-view reference,
// beside the unchanged WORLD FOG front decal head at the same K, with the shared guide lines; profile expressions and
// hair cuts; the WORLD FOG side cast and the ZCPAINT lead "you" at the B02-SH02 section scale. Serves no specific shot.

const K_BIG = 150, CY = 390, FRONT_X = 280, SIDE_X = 760;
const GUIDES: [string, number][] = [['crown', -1.05], ['brow', -0.24], ['eye', 0.05], ['nose', 0.33], ['mouth', 0.6], ['chin', 1.22]];
const EXPR: Face[] = [FACES[0], FACES[1], FACES[2], FACES[4], FACES[5], FACES[6], {...FACES[0], name: 'shut', eyes: 'shut'}];
const EXPR_Y = 860, EXPR_K = 52, EXPR_DX = 154;
const INFECTED_HEAD: HeadStyle = {skin: '#b9b4a8', hair: '#141213', cut: 'bob'};
const CUTS: [string, HeadStyle, 1 | -1][] = [
  ['short', CAST[0].head, 1], ['tied', CAST[2].head, 1], ['bob + lines', CAST[3].head, 1], ['hood', CAST[1].head, 1],
  ['bob (zc-infected)', INFECTED_HEAD, 1], ['short, mirrored', YOU.head, -1],
];
const CUT_Y = 1110, CUT_K = 52, CUT_DX = 180;
// Bottom row at the B02-SH02 section scale: U 340 px/m x sd(0.75 m) = 302 px/m (SideSheet: 447 px/m at scale 1).
const GROUND = 1840, SEC_PX_PER_M = 340 / (1 + 0.75 / 6), SEC_K = SEC_PX_PER_M / 447;
const ROW: [Cast, number][] = [[CAST[0], 150], [CAST[2], 390], [CAST[3], 630], [YOU, 900]];

const paint = (ctx: PaintContext) => {
  const {brush, still} = ctx;
  GUIDES.forEach(([, v], i) => {
    still(19000 + i);
    brush.set('HB', '#9fb3c4', 0.8);
    brush.line(40, CY + v * K_BIG, 1040, CY + v * K_BIG);
  });
  paintHead(ctx, 900, FRONT_X, CY, K_BIG, FACES[0], CAST[0].head);
  paintHeadSide(makePaint(ctx, 30000), SIDE_X, CY, K_BIG, FACES[0], CAST[0].head);
  EXPR.forEach((f, i) => paintHeadSide(makePaint(ctx, 31000 + i * 200), 77 + i * EXPR_DX - 6, EXPR_Y, EXPR_K, f, CAST[0].head));
  CUTS.forEach(([, style, dir], i) => {
    const x = 90 + i * CUT_DX - 6 * dir;
    brush.push();
    brush.translate(x, CUT_Y);
    brush.scale(dir === 1 ? 1 : -1, 1);
    paintHeadSide(makePaint(ctx, 33000 + i * 200), 0, 0, CUT_K, FACES[0], style);
    brush.pop();
  });
  still(19100);
  brush.set('HB', INK, 1.2);
  brush.line(40, GROUND, 1040, GROUND);
  ROW.forEach(([c, x], i) => {
    brush.push();
    brush.translate(x, GROUND);
    brush.scale(SEC_K);
    paintBodySide(makePaint(ctx, 36000 + i * 3000), c, 0, 0);
    brush.pop();
  });
};

const T = ({x, y, w, s = 24, children, align = 'center'}: {x: number; y: number; w: number; s?: number; children: ReactNode; align?: 'center' | 'left'}) => (
  <div style={{position: 'absolute', left: align === 'center' ? x - w / 2 : x, width: w, top: y, textAlign: align, fontSize: s, lineHeight: 1.15}}>{children}</div>
);

export const HeadSideSheet = () => (
  <AbsoluteFill style={{backgroundColor: '#f3ecdc'}}>
    <BrushCanvas paint={paint} paper="#f3ecdc" />
    <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INK}}>
      <T x={40} y={28} w={1000} s={34} align="left">HEAD-SIDE-R2 · profile decal head · review, serves no shot</T>
      <T x={40} y={72} w={1000} s={20} align="left">front = WORLD FOG paintHead (unchanged) · profile = paintHeadSide · same K {K_BIG} px</T>
      {GUIDES.map(([n, v]) => <T key={n} x={958} y={CY + v * K_BIG - 26} w={100} s={20} align="left">{n}</T>)}
      <T x={FRONT_X} y={CY + 1.3 * K_BIG} w={380}>front</T>
      <T x={SIDE_X} y={CY + 1.3 * K_BIG} w={380}>profile</T>
      {EXPR.map((f, i) => <T key={f.name} x={77 + i * EXPR_DX} y={EXPR_Y + 72} w={EXPR_DX}>{f.name}</T>)}
      {CUTS.map(([n], i) => <T key={n} x={90 + i * CUT_DX} y={CUT_Y + 72} w={CUT_DX} s={20}>{n}</T>)}
      {ROW.map(([c, x]) => <T key={c.role} x={x} y={GROUND + 8} w={240} s={22}><b>{c.name}</b> <span style={{fontSize: 17, color: '#5d6b78'}}>{c.role}</span></T>)}
      <T x={40} y={GROUND - 560} w={1000} s={20} align="left">side cast + zc-you at B02-SH02 section scale ({Math.round(SEC_PX_PER_M)} px/m, 1.7 m figure)</T>
    </AbsoluteFill>
  </AbsoluteFill>
);

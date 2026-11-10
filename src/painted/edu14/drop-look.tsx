import {loadFont} from '@remotion/fonts';
import type React from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';
import {ell, inkLine, rectPts, washAt} from '../kit/draw';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import {dropOutline, bounds, dropStateFor, paintDrop14, REFRACT_NOAIR, REFRACT_REAL, type DropState} from './drop';

// EDU-EP14-SHORT SP1 drop look stills (Film, W3; brief EDU-EP14-BRIEF-R1 SP1). Look-check stills only: a minimal painted backdrop
// per shot family (the sets are Boss's), the drop at the storyboard's px/mm, a 5 mm check bar beside it at the drop's plane, the
// caption band (y 1176-1344) with the shot's line as a sample caption. Render (one Chrome):
//   printf 'EDU14-DROP-PENDANT 0 out/edu14/sp1/v1/pendant.png\n' | node scripts/stills.mjs src/painted/edu14/drop-look-index.ts

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const FPS = 30;
type Backdrop = 'lip' | 'noair' | 'bokeh';
export type DropStill = {shot: string; local: number; u: number; at: Pt; back: Backdrop; caption: string; tag: string; ruler?: 'beside' | 'under'; st?: DropState};

/** The SP1 list: px/mm from the storyboard cameras (f 1200 / r mm); the pendant is enlarged for the look check (shot +0 is ~12 px/mm). */
export const SP1: Record<string, DropStill> = {
  PENDANT: {shot: 'S01-B01-SH01', local: 0, u: 40, at: [540, 560], back: 'lip', caption: 'สมมติว่าฝนตกโดยไม่มีอากาศ…', tag: 'pendant (teardrop) B01-SH01 +0, 40 px/mm (enlarged)'},
  SPHERE: {shot: 'S01-B01-SH06', local: 30, u: 30, at: [540, 760], back: 'noair', caption: 'ไม่มีอะไรขวาง มันเร่งไม่หยุด', tag: 'no-air sphere 5 mm B01-SH06 +30, 30 px/mm'},
  SMALL: {shot: 'S01-B03-SH01', local: 20, u: 100, at: [540, 760], back: 'bokeh', caption: 'เม็ดฝนไม่ได้เป็นหยดน้ำตานะ', tag: 'small round 2 mm B03-SH01 +20, 100 px/mm'},
  BUN: {shot: 'S01-B03-SH03', local: 60, u: 1200 / (12 + (2 * 60) / 108), at: [540, 760], back: 'bokeh', caption: 'อากาศดันเม็ดใหญ่จนก้นแบน', tag: 'bun 4 mm B03-SH03 +60, 91.6 px/mm'},
  BAG: {shot: 'S01-B04-SH02', local: 70, u: 75, at: [540, 760], back: 'bokeh', caption: 'ยิ่งใหญ่ อากาศยิ่งดันก้นบุ๋มเหมือนถุงคว่ำ', tag: 'bag (upside down) B04-SH02 +70, 75 px/mm'},
  BURST: {shot: 'S01-B04-SH03', local: 46, u: 1200 / (24 + (3 * 46) / 91), at: [540, 700], back: 'bokeh', caption: 'พอใหญ่ราวครึ่งเซน ก็แตกเป็นเม็ดเล็ก ๆ', tag: 'burst B04-SH03 +46, 47.2 px/mm', ruler: 'under'},
  RULER: {shot: 'S01-B04-SH03', local: 22, u: 1200 / (24 + (3 * 22) / 91), at: [540, 700], back: 'bokeh', caption: 'พอใหญ่ราวครึ่งเซน ก็แตกเป็นเม็ดเล็ก ๆ', tag: 'ruler check B04-SH03 +22, 48.5 px/mm', ruler: 'under'},
};

// ---- backdrops (look-check context only) -------------------------------------------------------------------------------------
const W = 1080, H = 1920;
const rain = (p: Painter, seed: number, color: string, n: number, len: [number, number], wgt: number) => {
  for (let i = 0; i < n; i++) {
    const x = hash(seed + i * 3) * (W + 200) - 100, y = hash(seed + i * 3 + 1) * H, l = len[0] + hash(seed + i * 3 + 2) * (len[1] - len[0]);
    inkLine(p, seed + i, [[x, y], [x - l * 0.08, y + l]], {weight: wgt, color, closed: false, still: true});
  }
};
const lipBack = (p: Painter) => {
  // soft street beyond (out of focus): sky haze, shophouse colour blocks, wet road with warm reflections
  washAt(p, 1, '#9aa6ab', 255, rectPts(0, 0, W, H), 0, 0);
  [['#c49a5a', -60, 360], ['#4f7f80', 300, 640], ['#d9cdb4', 640, 1000], ['#c49a5a', 1000, 1200]].forEach(([c, x0, x1], i) =>
    washAt(p, 10 + i, mixColor(c as string, '#9aa6ab', 0.45), 255, rectPts(x0 as number, 820, x1 as number, 1240), 0, 0));
  washAt(p, 20, '#3f4448', 255, rectPts(0, 1240, W, H), 0, 0);
  [[200, 1380], [720, 1460], [930, 1330]].forEach(([x, y], i) => washAt(p, 21 + i, '#e8b765', 90, ell(x, y, 60, 160, 16), 0, 0));
  rain(p, 300, '#b4c2cc', 50, [90, 220], 0.8);
  // roof underside and the wet fascia lip (the drop hangs from its bottom edge, y 560)
  washAt(p, 30, '#6e6a64', 255, rectPts(0, 0, W, 430), 0, 0);
  [80, 230, 380].forEach((y, i) => washAt(p, 31 + i, '#8a6a52', 200, rectPts(0, y, W, y + 40), 0, 0));
  washAt(p, 35, '#4d6b5a', 255, rectPts(0, 430, W, 560), 0, 0);
  washAt(p, 36, '#33493e', 255, rectPts(0, 520, W, 560), 0, 0);
  washAt(p, 37, '#e9f1f3', 210, rectPts(0, 548, W, 556), 0, 0);
};
const noairBack = (p: Painter) => {
  // grey void graded (saturation ~8 %, blacks lifted): the cloud base above, frozen mist shreds, the city in haze far below
  washAt(p, 1, '#7f8789', 255, rectPts(0, 0, W, H), 0, 0);
  washAt(p, 2, '#a9b2b5', 255, rectPts(0, 0, W, 260), 0, 0);
  washAt(p, 3, '#959ea1', 200, rectPts(0, 240, W, 420), 0, 0);
  [[230, 470, 170, 26], [860, 1040, 210, 30], [400, 1450, 260, 34]].forEach(([x, y, rx, ry], i) => washAt(p, 4 + i, '#a3abae', 150, ell(x, y, rx, ry, 18), 0, 0));
  washAt(p, 10, '#6c7375', 255, rectPts(0, 1600, W, H), 0, 0);
  for (let i = 0; i < 14; i++) washAt(p, 11 + i, i % 2 ? '#5e6567' : '#757c7e', 255, rectPts(i * 80, 1600 - 20 - hash(i + 7) * 60, i * 80 + 70, 1640), 0, 0);
};
const bokehBack = (p: Painter) => {
  // the bus stop out of focus behind the macro: dark wet street, green posts, white blouse, lightbox glow, warm shop light, streaks
  washAt(p, 1, '#59646a', 255, rectPts(0, 0, W, H), 0, 0);
  washAt(p, 2, '#3f4448', 255, rectPts(0, 1300, W, H), 0, 0);
  washAt(p, 3, mixColor('#4d6b5a', '#59646a', 0.3), 255, rectPts(80, 0, 230, H), 0, 0);
  washAt(p, 4, mixColor('#4d6b5a', '#59646a', 0.4), 255, rectPts(860, 0, 960, H), 0, 0);
  washAt(p, 5, '#dfe8ea', 110, ell(760, 360, 260, 170, 20), 0, 0);
  washAt(p, 6, '#f4f1ea', 150, ell(330, 1120, 200, 280, 20), 0, 0);
  washAt(p, 7, '#232b3e', 140, ell(330, 1480, 170, 160, 18), 0, 0);
  [[140, 260, 70], [980, 640, 90], [640, 1560, 80], [200, 1700, 60], [930, 1380, 55]].forEach(([x, y, r], i) => washAt(p, 8 + i, '#e8b765', 120, ell(x, y, r, r, 18), 0, 0));
  rain(p, 500, '#b4c2cc', 40, [120, 300], 1.0);
};

/** The 5 mm check bar: white with an ink edge and end ticks, `L` px long, centred at c (horizontal). */
const bar = (p: Painter, c: Pt, L: number, seed: number) => {
  const [x, y] = c, x0 = x - L / 2, x1 = x + L / 2;
  washAt(p, seed, '#ffffff', 255, rectPts(x0, y - 4, x1, y + 4), 0, 0);
  inkLine(p, seed + 1, rectPts(x0, y - 4, x1, y + 4), {weight: 1, color: '#2b211c', curve: 0, still: true});
  [x0, x1].forEach((tx, i) => { washAt(p, seed + 2 + i, '#ffffff', 255, rectPts(tx - 3, y - 18, tx + 3, y + 18), 0, 0); inkLine(p, seed + 4 + i, rectPts(tx - 3, y - 18, tx + 3, y + 18), {weight: 1, color: '#2b211c', curve: 0, still: true}); });
};

export const barPlace = (s: DropStill) => {
  const st = s.st ?? dropStateFor(s.shot, s.local)!;
  if (s.ruler === 'under') return {c: [s.at[0], s.at[1] + 5 * s.u * 0.62 + 70] as Pt, L: 5 * s.u};
  // the check bar sits centred under the drop at its plane (pass 1 beside it ran off frame at 100 px/mm)
  const b = bounds(dropOutline(st));
  return {c: [s.at[0], s.at[1] - b.y0 * s.u + 70] as Pt, L: 5 * s.u};
};

export const paintStill = (s: DropStill) => (p: Painter) => {
  ({lip: lipBack, noair: noairBack, bokeh: bokehBack})[s.back](p);
  const st = s.st ?? dropStateFor(s.shot, s.local)!;
  paintDrop14(p, s.at, s.u, st, {refract: s.back === 'noair' ? REFRACT_NOAIR : REFRACT_REAL});
  const {c, L} = barPlace(s);
  bar(p, c, L, 900);
};

const Still = ({s}: {s: DropStill}) => {
  const paint = paintStill(s);
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: '#8a9498'})), [paint]);
  const {c, L} = barPlace(s);
  return (
    <AbsoluteFill style={{background: '#8a9498'}}>
      <BrushCanvas paint={fn} paper="#8a9498" />
      <Grain opacity={0.08} />
      <div style={{position: 'absolute', left: c[0] - Math.max(L, 420) / 2 - 40, width: Math.max(L, 420) + 80, top: c[1] + 26, textAlign: 'center', font: '600 30px "Noto Sans Thai"', color: '#fff', WebkitTextStroke: '6px #2b211c', paintOrder: 'stroke fill'}}>
        {s.ruler === 'under' ? 'ส่วนใหญ่ไม่เกินราวครึ่งเซน' : '5 mm'}
      </div>
      {/* caption band y 1176-1344 with the shot's line as a sample caption (edu stroke, no overlay band) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1210, textAlign: 'center', font: '700 60px "Noto Sans Thai"', color: '#fff', WebkitTextStroke: '12px #1d1916', paintOrder: 'stroke fill'}}>{s.caption}</div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 1830, font: '500 30px monospace', color: '#fff', textShadow: '0 0 6px #000'}}>SP1 {s.tag}</div>
    </AbsoluteFill>
  );
};

export const DROP_STILLS = Object.fromEntries(Object.entries(SP1).map(([k, s]) => [k, () => <Still s={s} />])) as Record<keyof typeof SP1, () => React.ReactElement>;

import {loadFont} from '@remotion/fonts';
import {useCallback} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';
import {Spot, Vignette} from '../kit/glow';
import {paintPovHand, type HandTone} from '../kit/hands';
import {solid, hardFill, washAt, rectPts} from '../kit/draw';
import {makePainter, range, type Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import {PaintedLabel} from '../Label';

loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// Film look stills for HANAKO-SHORT (brief HANAKO-SHORT-FILM-R2, VD02/VD03/VD07/VD09; 31 Oct 2026).
// LF01 restroom door 3 (RR-KNOCK, B01 f0 / B09 last frame), LF02 storybook legend panel (B04), LF03 map + date card
// (B06 / B07). Look-defining: written in the episode owner module; Boss hardens after user approval.
// Look stills only: no timeline, no camera move, no VO. The full shots are NOT built.

const W = 1080, H = 1920;
export const HK = {
  tile: '#6f8f8c', tileDark: '#37504f', door: '#7d8f82', ink: '#1d2a2c', amber: '#e0a95a', red: '#c8403f', paper: '#1d2a2c',
};
/** Neutral grey cardigan sleeve (VD04); skin stays the WORLD FOG family so the POV hand matches the cast. */
export const HANAKO_HAND: HandTone = {skin: '#e9c2a2', shade: '#d0a283', deep: '#c0957a', nail: '#f4dccd', crease: '#9c6f52', sleeve: '#5b6666', sleeveShade: '#454f50'};

// ------------------------------------------------------------------ LF01 restroom door 3 (RR-KNOCK)
export const makeDoorPaint = (withHand: boolean) => ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame, fade: HK.ink});
  const bg = rectPts(-20, -20, W + 20, H + 20);
  // base door slab, then value strata: light from the fluorescent above, dark lower third for the captions.
  solid(p, 1, '#2c3d3e', bg, 3);
  const strata: [number, number, string][] = [[-20, 300, '#93a89a'], [280, 560, '#84998c'], [540, 760, '#738b80'], [740, 880, '#4e645d'], [860, 1280, '#26383a'], [1260, 1940, '#1b2828']];
  strata.forEach(([y0, y1, c], i) => hardFill(p, 10 + i, c, rectPts(-20, y0, W + 20, y1)));
  // soft value blends between strata keep the light falling off without a mottled wet fill
  [300, 560, 760, 880, 1270].forEach((y, i) => washAt(p, 20 + i, '#5d7468', 70, rectPts(-20, y - 40, W + 20, y + 40), 0.2, 0.1));
  // post shadows: hinge side (left) and latch side (right) seams with the neighbouring stalls (door 3 fills the width)
  solid(p, 30, '#14201f', rectPts(-10, -20, 16, H + 20), 3);
  solid(p, 31, '#14201f', rectPts(1066, -20, W + 10, H + 20), 3);
  washAt(p, 32, '#52665e', 140, rectPts(16, -20, 34, H + 20), 0.1, 0.2);
  // recessed panel (flat stall door: one pressed panel top, one louvre band bottom)
  const panel = rectPts(96, 130, 984, 840);
  hardFill(p, 40, '#6e8478', panel);
  hardFill(p, 41, '#455a53', rectPts(96, 830, 984, 844));
  hardFill(p, 42, '#a6baad', rectPts(96, 130, 984, 142));
  p.inkStill(50, 'pen', '#243531', 1.4); brush.spline([...panel, panel[0]], 0.05);
  // louvre slats low (dark, quiet under the captions)
  for (let i = 0; i < 9; i++) {
    const y = 930 + i * 62;
    hardFill(p, 300 + i, '#142020', rectPts(96, y, 984, y + 24));
    hardFill(p, 320 + i, '#33463f', rectPts(96, y - 6, 984, y));
  }
  // number plate (digit is SVG, crisp), brass-grey, centred (540, 476)
  const plate = rectPts(480, 416, 600, 536);
  solid(p, 100, '#2b3a3a', rectPts(486, 424, 606, 544), 3);
  solid(p, 101, '#c3cfc6', plate, 4);
  washAt(p, 102, '#8fa097', 160, rectPts(480, 500, 600, 536), 0.05, 0.1);
  p.inkStill(103, 'pen', HK.ink, 1.3); brush.spline([...plate, plate[0]], 0.05);
  // latch: slide bolt with an indicator slot, at hand height
  solid(p, 110, '#2b3a3a', rectPts(852, 960, 948, 1060), 3);
  solid(p, 111, '#566660', rectPts(846, 954, 942, 1054), 4);
  solid(p, 112, '#1a2626', rectPts(868, 990, 920, 1018), 3);
  p.inkStill(113, 'pen', HK.ink, 1.2); brush.spline([[846, 954], [942, 954], [942, 1054], [846, 1054], [846, 954]], 0.05);
  // wear: a few vertical scuffs, hash lanes
  p.inkStill(120, 'cpencil', '#31443f', 0.9);
  for (let i = 0; i < 14; i++) {
    const x = 130 + hash(i * 3 + 1) * 820, y = 200 + hash(i * 3 + 2) * 760, l = 40 + hash(i * 3 + 3) * 90;
    brush.line(x, y, x + (hash(i) - 0.5) * 6, y + l);
  }
  // shadow of the raised hand/forearm cast on the door, then the POV right hand: fist raised, about to knock
  if (!withHand) return;
  washAt(p, 130, '#14201f', 70, [[640, 560], [900, 600], [960, 900], [660, 860]] as Pt[], 0.3, 0.2);
  paintPovHand(p, {side: 1, base: 200, wrist: [790, 740], dir: -2.0, size: 0.98, curl: 1, thumb: [95, 70], elbow: [1120, 800], sleeveFrom: [1280, 830], tone: HANAKO_HAND});
};

const paintDoor = makeDoorPaint(true);

export const Cool = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <Spot x={540} y={140} r={900} level={0.22} color="#dff3ee" />
    <Vignette x={540} y={600} r={1250} strength={0.7} />
  </svg>
);

export const LF01 = ({jp = true}: {jp?: boolean}) => {
  const paint = useCallback(paintDoor, []);
  return (
    <AbsoluteFill style={{background: HK.ink}}>
      <BrushCanvas paint={paint} paper={HK.ink} />
      <Cool />
      <Grade />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <text x={540} y={514} textAnchor="middle" fontFamily="Noto Sans Thai, sans-serif" fontWeight={800} fontSize={92} fill="#1d2a2c">3</text>
        {jp && (
          <text x={540} y={330} textAnchor="middle" fontFamily="Hiragino Sans, Noto Sans JP, sans-serif" fontWeight={600} fontSize={34} fill="#eef3ee" stroke="#1d2129" strokeWidth={6} paintOrder="stroke">花子さん、いらっしゃいますか</text>
        )}
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ LF02 storybook legend panel (B04 panel A, B peeking)
const tornRect = (x0: number, y0: number, x1: number, y1: number, seed: number, amp = 9): Pt[] => {
  const pts: Pt[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number) => {
    const n = Math.max(6, Math.round(Math.hypot(bx - ax, by - ay) / 28));
    for (let i = 0; i < n; i++) {
      const u = i / n;
      pts.push([ax + (bx - ax) * u + (hash(seed + pts.length * 2) - 0.5) * amp, ay + (by - ay) * u + (hash(seed + pts.length * 2 + 1) - 0.5) * amp]);
    }
  };
  edge(x0, y0, x1, y0); edge(x1, y0, x1, y1); edge(x1, y1, x0, y1); edge(x0, y1, x0, y0);
  return pts;
};

const paintStory = ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame, fade: '#1b2326'});
  solid(p, 1, '#1b2326', rectPts(-20, -20, W + 20, H + 20), 3);              // dark table paper (quiet under the captions)
  washAt(p, 2, '#243036', 120, rectPts(-20, 860, W + 20, H + 20), 0.1, 0.6);
  // panel A: cut paper, slightly rotated feel via torn edge, drop shadow first
  const A = tornRect(104, 388, 976, 846, 500, 10);
  washAt(p, 10, '#0c1214', 200, A.map(([x, y]) => [x + 12, y + 14] as Pt), 0.3, 0.2);
  solid(p, 11, '#e2d6b8', A.map(([x, y]) => [x - 6 * Math.sign(x - 540), y - 6 * Math.sign(y - 617)] as Pt), 3);  // pale paper rim
  const sky = tornRect(122, 404, 958, 830, 520, 4);
  solid(p, 12, '#22304a', sky, 3);
  // crayon sky: layered bands of scribble in dusk blues and a dull violet (no red)
  [[404, 520, '#2c3d5c'], [520, 640, '#34466a'], [640, 740, '#3d4f6e'], [740, 830, '#46566f']].forEach(([y0, y1, c], i) =>
    washAt(p, 20 + i, c as string, 190, rectPts(124, y0 as number, 956, y1 as number), 0.15, 0.8));
  p.inkStill(30, 'charcoal', '#53668b', 1.2);
  for (let i = 0; i < 22; i++) {
    const y = 420 + i * 19, x0 = 130 + hash(i + 3) * 40;
    brush.spline(range(6, (u) => [x0 + u * 780, y + Math.sin(u * 6 + i) * 4] as Pt), 0.5);
  }
  // falling shapes: pale ochre shards and streaks, abstract (no bombs, no figures)
  const shards = 15;
  for (let i = 0; i < shards; i++) {
    const cx = 170 + hash(i * 5 + 1) * 720, cy = 440 + hash(i * 5 + 2) * 250, s = 16 + hash(i * 5 + 3) * 24, a = hash(i * 5 + 4) * 3;
    const tail: Pt = [cx - 30 + hash(i) * 10, cy - 70 - hash(i + 9) * 60];
    const poly: Pt[] = [[cx, cy - s], [cx + s * 0.7, cy + s * 0.4], [cx - s * 0.2, cy + s], [cx - s * 0.8, cy + s * 0.1]].map(([x, y]) => [x + Math.cos(a) * 3, y] as Pt);
    washAt(p, 40 + i, i % 3 === 0 ? '#e8d9a8' : '#c9b98f', 230, poly, 0.1, 0.5);
    p.inkStill(70 + i, 'cpencil', '#d8c995', 1.0); brush.line(tail[0], tail[1], cx, cy - s);
  }
  // ground: dark hill strip and a small house silhouette with a pale window, no person
  solid(p, 90, '#10171d', [[122, 760], [300, 735], [520, 750], [760, 728], [958, 748], [958, 830], [122, 830]] as Pt[], 4);
  const house: Pt[] = [[460, 748], [460, 690], [510, 650], [560, 690], [560, 748]];
  solid(p, 91, '#080d11', house, 5);
  washAt(p, 92, '#e8d9a8', 220, rectPts(500, 705, 522, 730), 0.1, 0.3);
  p.ink(93, 'cpencil', '#5b6e92', 1.0); brush.spline([...house, house[0]], 0.1);
  // panel B peeking under the band: torn edge, a stall door ajar (dark), no person
  const B = tornRect(104, 1330, 976, 1900, 560, 10);
  washAt(p, 100, '#0c1214', 200, B.map(([x, y]) => [x + 12, y + 14] as Pt), 0.3, 0.2);
  solid(p, 101, '#cfc4a8', B, 3);
  solid(p, 102, '#33484b', tornRect(122, 1348, 958, 1890, 580, 4), 3);
  solid(p, 103, '#4a625b', [[420, 1400], [640, 1400], [640, 1880], [420, 1880]] as Pt[], 3);
  solid(p, 104, '#05090b', [[560, 1410], [640, 1400], [640, 1870], [560, 1880]] as Pt[], 3);
};

export const LF02 = () => {
  const paint = useCallback(paintStory, []);
  return (
    <AbsoluteFill style={{background: '#1b2326'}}>
      <BrushCanvas paint={paint} paper="#1b2326" />
      <Grade />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <g transform="rotate(-2 220 360)">
          <rect x={112} y={346} width={236} height={58} rx={6} fill="#e2d6b8" stroke="#1d2129" strokeWidth={3} />
          <text x={230} y={388} textAnchor="middle" fontFamily="Noto Sans Thai" fontWeight={700} fontSize={38} fill="#2a2420">เรื่องเล่า</text>
        </g>
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ LF03 map + date card (B06 / B07)
const ll = ([lon, lat]: Pt): Pt => [640 + (lon - 138) * 31.6, 280 + (45.6 - lat) * 40];
const JP: Pt[][] = [
  [[140.9, 41.5], [141.5, 40.6], [142.0, 39.6], [141.5, 38.3], [141.0, 37.0], [140.85, 35.7], [140.3, 35.2], [139.85, 34.9], [139.8, 35.3], [139.6, 35.2], [139.1, 34.7], [138.2, 34.6], [137.0, 34.6], [136.8, 34.3], [136.3, 33.5], [135.8, 33.45], [135.1, 34.2], [135.2, 34.7], [134.5, 34.6], [133.5, 34.4], [132.5, 34.2], [131.0, 33.95], [131.0, 34.4], [132.2, 35.3], [133.5, 35.5], [135.3, 35.7], [136.0, 36.0], [136.7, 36.8], [137.3, 37.5], [137.0, 36.8], [138.2, 37.2], [138.9, 37.9], [139.9, 38.8], [139.7, 39.9], [140.0, 40.5], [140.3, 41.2]],
  [[130.9, 33.9], [131.7, 33.5], [131.9, 32.7], [131.4, 31.4], [130.6, 31.0], [130.2, 31.2], [130.2, 32.4], [129.7, 33.2], [130.4, 33.6]],
  [[134.5, 34.2], [134.7, 33.8], [134.1, 33.3], [133.0, 32.8], [132.5, 33.3], [132.9, 34.0], [133.8, 34.3]],
  [[140.1, 41.5], [141.2, 41.8], [141.6, 42.6], [143.2, 42.0], [145.3, 43.3], [144.3, 44.2], [143.3, 44.9], [142.0, 45.5], [141.7, 44.3], [141.0, 43.2], [140.3, 43.3], [139.9, 42.5]],
];
const inside = (pt: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const IWATE = ll([141.15, 39.7]);

const paintMap = (spread: boolean) => ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame, fade: HK.ink});
  solid(p, 1, '#1d2a2c', rectPts(-20, -20, W + 20, H + 20), 3);
  [[-20, 500, '#2a3f41'], [480, 1000, '#243638'], [980, 1940, '#1d2a2c']].forEach(([y0, y1, c], i) => washAt(p, 2 + i, c as string, 230, rectPts(-20, y0 as number, W + 20, y1 as number), 0.1, 0.5));
  // sea contour lines (paper-map rhythm), quiet
  p.inkStill(8, 'cpencil', '#35504f', 0.9);
  for (let k = 1; k <= 3; k++) JP.forEach((poly) => brush.spline([...poly.map(([lo, la]) => { const [x, y] = ll([lo, la]); return [IWATE[0] + (x - IWATE[0]) * (1 + 0.05 * k), 560 + (y - 560) * (1 + 0.035 * k)] as Pt; })], 0.3));
  JP.forEach((poly, i) => {
    const px = poly.map(ll);
    washAt(p, 20 + i, '#0f1818', 160, px.map(([x, y]) => [x + 6, y + 8] as Pt), 0.2, 0.3);
    solid(p, 30 + i, '#6f8f8c', px, 4);
    washAt(p, 40 + i, '#8cabA7'.toLowerCase(), 110, px.map(([x, y]) => [x - 4, y - 4] as Pt).slice(0), 0.3, 0.7);
    p.ink(50 + i, 'rotring', '#1d2a2c', 1.1); brush.spline([...px, px[0]], 0.2);
  });
  if (!spread) {
    // pin: amber teardrop on Iwate, thin ink, small halo
    const [x, y] = IWATE;
    washAt(p, 60, '#e0a95a', 90, (range(14, (u) => [x + 38 * Math.cos(u * 6.283), y + 38 * Math.sin(u * 6.283)] as Pt)), 0.5, 0.2);
    solid(p, 61, '#e0a95a', [[x, y + 6], [x - 16, y - 26], [x - 8, y - 42], [x + 8, y - 42], [x + 16, y - 26]] as Pt[], 4);
    p.ink(62, 'rotring', HK.ink, 1.0); brush.spline([[x, y + 6], [x - 16, y - 26], [x - 8, y - 42], [x + 8, y - 42], [x + 16, y - 26], [x, y + 6]] as Pt[], 0.3);
    solid(p, 63, '#1d2a2c', range(10, (u) => [x + 5 * Math.cos(u * 6.283), y - 27 + 5 * Math.sin(u * 6.283)] as Pt), 3);
  } else {
    // B07-SH02: pin dimmed to 50%, 40 dots scattered by seeded rejection inside the land (not radial)
    const [x, y] = IWATE;
    washAt(p, 60, '#8a7048', 255, range(12, (u) => [x + 9 * Math.cos(u * 6.283), y + 9 * Math.sin(u * 6.283)] as Pt), 0.2, 0.1);
    let n = 0;
    for (let i = 0; n < 40 && i < 800; i++) {
      const q: Pt = [330 + hash(i * 2 + 100) * 640, 280 + hash(i * 2 + 101) * 585];
      if (!JP.some((poly) => inside(q, poly.map(ll)))) continue;
      solid(p, 200 + n, '#e0a95a', range(8, (u) => [q[0] + 7 * Math.cos(u * 6.283), q[1] + 7 * Math.sin(u * 6.283)] as Pt), 3);
      n++;
    }
  }
};

export const LF03 = ({spread = false}: {spread?: boolean}) => {
  const paint = useCallback(paintMap(spread), [spread]);
  const [x, y] = IWATE;
  return (
    <AbsoluteFill style={{background: HK.ink}}>
      <BrushCanvas paint={paint} paper={HK.ink} />
      <Grade />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        {!spread && <line x1={x + 18} y1={y - 36} x2={820} y2={y - 90} stroke="#eef3ee" strokeWidth={3} />}
        {/* date card (DATE box x 120-420, y 430-500) */}
        <g>
          <rect x={120} y={430} width={300} height={70} rx={8} fill="#e6e1d0" stroke="#1d2129" strokeWidth={4} />
          <text x={270} y={480} textAnchor="middle" fontFamily="Noto Sans Thai" fontWeight={800} fontSize={44} fill="#1d2a2c">{spread ? 'ปี 1990' : 'ราวปี 1948'}</text>
        </g>
        {spread && (
          <g>
            <rect x={600} y={330} width={300} height={190} rx={6} fill="#cfc7b0" stroke="#1d2129" strokeWidth={4} />
            <rect x={620} y={350} width={260} height={150} fill="#37504f" />
            <text x={750} y={440} textAnchor="middle" fontFamily="Hiragino Sans, Noto Sans JP, sans-serif" fontWeight={800} fontSize={40} fill="#e6e1d0">学校の怪談</text>
          </g>
        )}
      </svg>
      {!spread && <PaintedLabel text="อิวาเตะ, ญี่ปุ่น · ราวปี 1948" slot={0} />}
      <Grain />
    </AbsoluteFill>
  );
};

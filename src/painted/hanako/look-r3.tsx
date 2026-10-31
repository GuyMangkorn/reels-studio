import {loadFont} from '@remotion/fonts';
import {useCallback} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';
import {solid, hardFill, washAt, rectPts} from '../kit/draw';
import {makePainter, range, type Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import {PaintedLabel} from '../Label';
import japan from './japan.json';
import {HK} from './look';

loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// Film look stills for HANAKO-SHORT, brief HANAKO-SHORT-FILM-R3 (31 Oct 2026, VD17-VD19).
// LF04 B05-SH02 dead stop (third blank page, s 1.18, vignette 0.5); LF05 B06-SH01 enlarged real-coastline map
// (japan.json from Natural Earth 1:50m land, NOTICE beside it): start / pin-drop pulse / end of the 1.00 -> 1.30 push.
// Look stills only: no timeline, no real camera, no VO. The full shots are NOT built.

const W = 1080, H = 1920;
const CAM = ({s, fx, fy, dy = 0, children}: {s: number; fx: number; fy: number; dy?: number; children: React.ReactNode}) => (
  <AbsoluteFill style={{transform: `translateY(${dy}px) scale(${s})`, transformOrigin: `${fx}px ${fy}px`}}>{children}</AbsoluteFill>
);

// ------------------------------------------------------------------ LF04 B05-SH02: blank folder pages, dead stop
const paintFolder = ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame, fade: HK.ink});
  solid(p, 1, '#18242a', rectPts(-400, -400, W + 400, H + 400), 3);
  // desk: dark cold wood, bands only (wash-flat, no mottle)
  [[-400, 500, '#223034'], [480, 1100, '#1d2a2e'], [1080, 2300, '#162024']].forEach(([y0, y1, c], i) => hardFill(p, 2 + i, c as string, rectPts(-400, y0 as number, W + 400, y1 as number)));
  // folder: cold grey-green manila, a little larger than the page; blank tab on top (as in B05-SH01)
  washAt(p, 10, '#0c1416', 150, rectPts(206, 336, 884, 872), 0.2, 0.2);
  solid(p, 11, '#8a9a8c', rectPts(196, 330, 876, 850), 4);
  solid(p, 12, '#8a9a8c', rectPts(300, 304, 430, 340), 4);          // blank tab
  p.ink(13, 'rotring', HK.ink, 1.2); brush.spline([[196, 330], [300, 330], [300, 304], [430, 304], [430, 330], [876, 330], [876, 850], [196, 850], [196, 330]] as Pt[], 0.1);
  // pages already turned: sliver edges stacked at the hinge side
  [214, 221, 228, 234].forEach((x, i) => hardFill(p, 20 + i, i % 2 ? '#b9c3b8' : '#a3afa6', rectPts(x, 352, x + 8, 836)));
  // the third page, pale and cold: the brightest value of B01-B05
  solid(p, 30, '#cfd8cb', rectPts(240, 356, 846, 826), 3, 0.02, 0.1);
  hardFill(p, 31, '#c3ccbf', rectPts(240, 356, 270, 826));            // hinge gutter
  // stack thickness on the right and bottom edges (flipped pages beneath)
  hardFill(p, 34, '#aab6ac', rectPts(846, 360, 853, 830));
  hardFill(p, 35, '#8e9b92', rectPts(244, 826, 853, 834));
  // faint ruled lines only: paper, never a record (no columns, no heading, no marks)
  p.inkStill(40, 'cpencil', '#a9b6ae', 0.8);
  for (let y = 420; y <= 790; y += 38) brush.line(272, y, 826, y + (hash(y) - 0.5) * 1.2);
};

export const LF04 = () => {
  const paint = useCallback(paintFolder, []);
  return (
    <AbsoluteFill style={{background: HK.ink}}>
      <CAM s={1.18} fx={540} fy={590} dy={-70}><BrushCanvas paint={paint} paper={HK.ink} /></CAM>
      <Grade />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="vig" gradientUnits="userSpaceOnUse" cx={540} cy={520} r={950}>
            <stop offset="0" stopColor="#050a0c" stopOpacity={0} />
            <stop offset="0.35" stopColor="#050a0c" stopOpacity={0.06} />
            <stop offset="0.7" stopColor="#050a0c" stopOpacity={0.45} />
            <stop offset="1" stopColor="#050a0c" stopOpacity={0.85} />
          </radialGradient>
        </defs>
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#vig)" />
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ LF05 B06-SH01: enlarged map, real coastline
const RINGS: Pt[][] = (japan.rings as number[][]).map((r) => {
  const pts = Array.from({length: r.length / 2}, (_, i) => [r[2 * i], r[2 * i + 1]] as Pt);
  const out = pts.filter((q, i) => i === 0 || Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) > 0.5);
  while (out.length > 3 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < 0.5) out.pop();
  return out;
});
export const PIN: Pt = japan.iwatePin as Pt;
const SEA = '#1d2a2c';

const paintMapR3 = (pin: boolean) => ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame, fade: HK.ink});
  solid(p, 1, SEA, rectPts(-400, -400, W + 400, H + 400), 3);
  solid(p, 2, '#243638', rectPts(-400, -400, W + 400, 1000), 3, 0.02, 0.1);
  // graticule (paper-map rhythm), 5 degrees, no numbers: lon x = 170 + (lon-129.5)*42.8, lat y = 150 + (45.6-lat)*54
  p.inkStill(8, 'cpencil', '#35504f', 0.8);
  for (let lon = 130; lon <= 145; lon += 5) { const x = 170 + (lon - 129.5) * 42.84; brush.line(x, -300, x, 2200); }
  for (let lat = 30; lat <= 45; lat += 5) { const y = 150 + (45.6 - lat) * 54; brush.line(-300, y, 1400, y); }
  RINGS.forEach((px, i) => {
    washAt(p, 20 + i, '#3d5c5b', 110, px, 0.7, 0.4);                                    // shallow shelf halo
    washAt(p, 30 + i, '#0f1818', 160, px.map(([x, y]) => [x + 6, y + 8] as Pt), 0.2, 0.3);
    solid(p, 40 + i, '#7a9a96', px, 4);
    washAt(p, 50 + i, '#8cabA7'.toLowerCase(), 110, px.map(([x, y]) => [x - 4, y - 4] as Pt), 0.3, 0.7);
    p.ink(60 + i, 'rotring', '#1d2a2c', 1.1); if (px.length >= 40) brush.spline([...px, px[0]], 0.1);
    else for (let k = 0; k < px.length; k++) { const a = px[k], b = px[(k + 1) % px.length]; brush.line(a[0], a[1], b[0], b[1]); }
  });
  // an inland wash of value so the island reads as a form, light from the north-west
  RINGS.slice(0, 1).forEach((px) => washAt(p, 80, '#4f6f6c', 90, px.map(([x, y]) => [x + 18, y + 14] as Pt), 0.4, 0.6));
  if (!pin) return;
  const [x, y] = PIN;
  washAt(p, 90, '#e0a95a', 90, range(14, (u) => [x + 38 * Math.cos(u * 6.283), y - 20 + 38 * Math.sin(u * 6.283)] as Pt), 0.5, 0.2);
  solid(p, 91, '#e0a95a', [[x, y], [x - 16, y - 32], [x - 8, y - 48], [x + 8, y - 48], [x + 16, y - 32]] as Pt[], 4);
  p.ink(92, 'rotring', HK.ink, 1.0); brush.spline([[x, y], [x - 16, y - 32], [x - 8, y - 48], [x + 8, y - 48], [x + 16, y - 32], [x, y]] as Pt[], 0.3);
  solid(p, 93, '#1d2a2c', range(10, (u) => [x + 5 * Math.cos(u * 6.283), y - 33 + 5 * Math.sin(u * 6.283)] as Pt), 3);
};

/** `stage`: 'start' = empty map s 1.00 (F1146); 'pulse' = pin landed + ring ~F1254 (s 1.04 + a bit); 'end' = s 1.30 callout + date (F1349). */
export const LF05 = ({stage = 'end'}: {stage?: 'start' | 'pulse' | 'end'}) => {
  const paintMapCb = useCallback(paintMapR3(stage !== 'start'), [stage]);
  const s = stage === 'start' ? 1.0 : stage === 'pulse' ? 1.07 : 1.3;
  const [x, y] = PIN;
  // ring (screen space, radius 60 px max, stroke 3, opacity 0.8 -> 0): shown here at radius ~34 px, opacity ~0.45
  const sx = x, sy = y - 0; // focus = pin tip, so the pin tip is fixed on screen at every s
  return (
    <AbsoluteFill style={{background: HK.ink}}>
      <CAM s={s} fx={x} fy={y}>
        <BrushCanvas paint={paintMapCb} paper={HK.ink} />
      </CAM>
      <Grade />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="seadim" x1="0" y1="780" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={SEA} stopOpacity={0} />
            <stop offset="1" stopColor={SEA} stopOpacity={0.94} />
          </linearGradient>
        </defs>
        <rect x={0} y={780} width={W} height={H - 780} fill="url(#seadim)" />
        {stage === 'pulse' && <circle cx={sx} cy={sy - 24} r={34} fill="none" stroke="#e0a95a" strokeWidth={3} opacity={0.5} />}
        {stage === 'end' && (
          <>
            <line x1={x + 18} y1={y - 40} x2={600} y2={y - 110} stroke="#eef3ee" strokeWidth={3} />
            <g>
              <rect x={120} y={430} width={300} height={70} rx={8} fill="#e6e1d0" stroke="#1d2129" strokeWidth={4} />
              <text x={270} y={480} textAnchor="middle" fontFamily="Noto Sans Thai" fontWeight={800} fontSize={44} fill="#1d2a2c">ราวปี 1948</text>
            </g>
          </>
        )}
      </svg>
      {stage === 'end' && <PaintedLabel text="อิวาเตะ, ญี่ปุ่น · ราวปี 1948" slot={0} />}
      <Grain />
    </AbsoluteFill>
  );
};

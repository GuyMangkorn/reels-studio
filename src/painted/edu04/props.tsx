import type {CSSProperties} from 'react';
import {ell, hardFill, inkLine, INK, solid} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {LANE} from './cast';

// `new: tally doodle`, `new: stamp text` (ซวยตลอด) and `new: title strip` (brief EDU-BRIEF-R1.1 VD11, VD12, VD16). Screen space.
// Tally: red chalk strokes drawn over MAN's head, one per lane-3 shopper who passes (never digits, no counter UI). Stamp: red
// rubber-stamp Thai type with a stamp texture, slight rotation, `crack` 0..1 splits it on "อาจไม่ใช่". Title strip: ink on a
// cream strip with a lane-colour underline, y 220-520 over MAN's close on L02 only.

const font: CSSProperties = {fontFamily: 'Noto Sans Thai', position: 'absolute', textAlign: 'center'};

/** Red chalk strokes: `n` strokes (1-4 upright, the 5th would be the diagonal) as a hand tally at (x, y), `u` px per stroke gap. */
export const paintTally = (p: Painter, n: number, x: number, y: number, u = 34, seed = 8100, part = 1) => {
  for (let i = 0; i < Math.min(4, n); i++) {
    const sx = x + i * u + (i % 2 ? 1.5 : -1.5), k = i === n - 1 ? Math.max(0.05, part) : 1; // the newest stroke draws on top-down (`part` 0..1)
    inkLine(p, seed + i, [[sx, y - 70], [sx + (i % 2 ? 3 : -2) * k, y - 70 + 140 * k]], {closed: false, weight: 6.2, color: '#d2342a', curve: 0.1});
    inkLine(p, seed + 20 + i, [[sx + 5, y - 66], [sx + 5 + 3 * k, y - 66 + 128 * k]], {closed: false, weight: 2.4, color: '#e8695e', curve: 0.1});
  }
  if (n >= 5) inkLine(p, seed + 9, [[x - 18, y + 52], [x + 3.5 * u, y - 52]], {closed: false, weight: 3.4, color: '#d2342a', curve: 0.1});
};

const CRACK = '246,-10 290,50 258,82 316,118 282,172';
/**
 * `new: stamp text`. `crack` 0..1 draws the cream crack line down through the stamp (stroke draw-on); `split` px offsets the two halves
 * across the crack (left half up-left, right half down-right, `split` total) once the crack is drawn; `op` is the pop-in opacity.
 */
export const StampText = ({x = 540, y = 1010, crack = 0, rot = -6, scale = 1, split = 0, op = 1}: {x?: number; y?: number; crack?: number; rot?: number; scale?: number; split?: number; op?: number}) => {
  const body = (
    <g filter="url(#stampGrain)" fill="none" stroke="#c42a22" strokeWidth="7">
      <rect x="8" y="10" width="644" height="140" rx="16" />
      <rect x="20" y="22" width="620" height="116" rx="10" strokeWidth="2.5" />
      <text x="330" y="106" textAnchor="middle" fontFamily="Noto Sans Thai" fontWeight="800" fontSize="92" fill="#c42a22" stroke="none">ซวยตลอด</text>
    </g>
  );
  const half = split > 0 && crack >= 1;
  return (
    <div lang="th" style={{...font, left: x - 330, top: y - 80, width: 660, height: 160, opacity: op, transform: `rotate(${rot}deg) scale(${scale})`}}>
      <svg width="660" height="160" viewBox="0 0 660 160" style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="stampGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" /><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.5" result="m" /><feComposite in="SourceGraphic" in2="m" operator="in" /></filter>
          <clipPath id="stampL"><polygon points={`-20,-20 ${CRACK} -20,180`} /></clipPath>
          <clipPath id="stampR"><polygon points={`680,-20 ${CRACK} 680,180`} /></clipPath>
        </defs>
        {half ? (
          <>
            <g clipPath="url(#stampL)" transform={`translate(${-split / 2} ${-split / 5}) rotate(-2 280 80)`}>{body}</g>
            <g clipPath="url(#stampR)" transform={`translate(${split / 2} ${split / 5}) rotate(2 280 80)`}>{body}</g>
          </>
        ) : body}
        {crack > 0 && (
          <>
            <polyline points={CRACK} pathLength={1} strokeDasharray={`${crack} 1`} stroke="#f3ead6" strokeWidth={split > 0 ? split + 8 : 9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points={CRACK} pathLength={1} strokeDasharray={`${crack} 1`} stroke="#3a120c" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {crack >= 1 && (
              <g stroke="#3a120c" strokeWidth={6} strokeLinecap="round" fill="none">
                <polyline points="290,50 322,38 340,52" />
                <polyline points="262,82 232,90 216,78" />
                <polyline points="312,118 342,126 352,114" />
                <polyline points="262,82 250,104" />
              </g>
            )}
            {crack >= 1 && split > 0 && (
              <g fill="#c42a22" stroke="#4a1c14" strokeWidth={1.5}>
                <polygon points="336,22 350,18 344,32" /><polygon points="214,128 226,122 224,138" /><polygon points="348,140 362,146 350,152" /><polygon points="228,40 238,34 240,46" />
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
};

export const TitleStrip = ({text = 'ทำไมแถวข้าง ๆ เร็วกว่าเสมอ', wipe = 1}: {text?: string; wipe?: number}) => (
  <div lang="th" style={{...font, left: 90, top: 300, width: 900, height: 190, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>
    <div style={{position: 'absolute', inset: 0, background: '#f6eed8', border: '4px solid #2b211c', borderRadius: 14, boxShadow: '0 6px 0 rgba(43,33,28,.25)'}} />
    <div style={{...font, left: 0, right: 0, top: 32, fontSize: 70, fontWeight: 800, color: '#2b211c', lineHeight: 1.15}}>{text}</div>
    {([1, 2, 3] as const).map((n) => <div key={n} style={{position: 'absolute', left: 60 + (n - 1) * 262, width: 238, height: 12, bottom: 24, background: LANE[n], borderRadius: 6}} />)}
  </div>
);

// ---- W5.2 props (S01-B02-SH02, SH03): `new: pineapple`, `new: coin purse + coins` (world metres through the camera, screen helpers for the hand-held ones).

/** `new: pineapple`: the unpriced fruit CSH1 lifts off the belt. `at` = centre of the body (px), `u` px per metre, body 0.2 m wide, 0.26 m tall, crown 0.14 m. */
export const paintPineapple = (p: Painter, at: Pt, u: number, seed = 8300) => {
  const [x, y] = at, rx = 0.1 * u, ry = 0.13 * u;
  const crown = ['#3f7a3a', '#4f9a4c', '#3f7a3a'];
  [-1, 0, 1].forEach((k, i) => solid(p, seed + i, crown[i], [[x + k * 0.025 * u, y - ry * 0.85], [x + k * 0.08 * u - 0.025 * u, y - ry - 0.13 * u], [x + k * 0.1 * u, y - ry - 0.05 * u], [x + k * 0.04 * u + 0.03 * u, y - ry * 0.85]], 2, 0.05, 0.1));
  solid(p, seed + 4, '#e3a52a', ell(x, y, rx, ry, 18), 3, 0.06, 0.1);
  inkLine(p, seed + 5, ell(x, y, rx, ry, 18), {weight: 1.2, color: mixColor('#e3a52a', INK, 0.65)});
  for (let i = -2; i <= 2; i++) {
    inkLine(p, seed + 6 + i + 2, [[x + i * 0.04 * u - 0.05 * u, y - ry * 0.75], [x + i * 0.04 * u + 0.05 * u, y + ry * 0.75]], {closed: false, weight: 0.6, color: '#a66f1c'});
    inkLine(p, seed + 12 + i + 2, [[x + i * 0.04 * u + 0.05 * u, y - ry * 0.75], [x + i * 0.04 * u - 0.05 * u, y + ry * 0.75]], {closed: false, weight: 0.6, color: '#a66f1c'});
  }
};

/** `new: coin purse`: a drawstring pouch in the hand (`hand` = grip px). */
export const paintCoinPurse = (p: Painter, hand: Pt, u: number, seed = 8350) => {
  const [x, y] = hand, w = 0.09 * u, h = 0.1 * u;
  solid(p, seed, '#7a4b2f', [[x - w, y - h * 0.4], [x + w, y - h * 0.4], [x + w * 1.15, y + h * 0.4], [x, y + h * 0.7], [x - w * 1.15, y + h * 0.4]], 3, 0.06, 0.1);
  inkLine(p, seed + 1, [[x - w, y - h * 0.4], [x + w, y - h * 0.4], [x + w * 1.15, y + h * 0.4], [x, y + h * 0.7], [x - w * 1.15, y + h * 0.4]], {weight: 1.1, color: INK});
  inkLine(p, seed + 2, [[x - w * 0.9, y - h * 0.4], [x - w * 0.3, y - h * 0.62], [x + w * 0.3, y - h * 0.62], [x + w * 0.9, y - h * 0.4]], {closed: false, weight: 1.1, color: '#4b2d1c', curve: 0.3});
};

/** `new: coin stack` on a counter: `n` coins (diameter `d` m, 0.012 m thick; exaggerated for the 270 px read) stacked at `base`, plus one tilted loose coin. */
export const paintCoins = (p: Painter, c: YCam, base: V3, n: number, d = 0.07, seed = 8400) => {
  const u = camUnit(c, base), th = 0.012;
  for (let i = 0; i < n; i++) {
    const g = camPoint(c, [base[0], base[1] + i * th, base[2]]);
    if (!g) continue;
    const rx = (d / 2) * u, ry = rx * 0.4, off = (i % 2 ? 0.012 : -0.012) * u, tone = i % 2 ? '#e8c04a' : '#d9ab33';
    hardFill(p, seed + i * 4, mixColor(tone, INK, 0.35), ell(g[0] + off, g[1] + th * u * 0.5, rx, ry, 14));
    hardFill(p, seed + i * 4 + 1, tone, ell(g[0] + off, g[1], rx, ry, 14));
    inkLine(p, seed + i * 4 + 2, ell(g[0] + off, g[1], rx, ry, 14), {weight: 0.9, color: INK});
    inkLine(p, seed + i * 4 + 3, ell(g[0] + off, g[1], rx * 0.62, ry * 0.62, 12), {weight: 0.5, color: '#a47a1c'});
  }
};

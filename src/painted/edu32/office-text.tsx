import type {CSSProperties, ReactNode} from 'react';
import {useId} from 'react';
import {quadMatrix3d, type Quad} from '../../scenes/quadText';
import {STAMP} from '../kit/stamp';
import type {Pt} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import {MEMO, MEMO_STAMP, catHole, memoPt} from './office';

// EDU-EP32-SHORT memo MM text and stamp as camera-mapped DOM (VD32-12; QuadText homography `src/scenes/quadText.ts`, EDU-EP24 board-text
// precedent). The whole page is one quad laid out at K px per model metre, so every line sits on the painted sheet under the shot's YCam.
// Only the real SRC001 text: the subject line with navy redaction bars, two body fragments, bars for the rest, pencil "3-67" top corner;
// no date, letterhead or "TOP SECRET". The stamp (kit STAMP red and rotation, two lines) lies on the page at MEMO_STAMP. Boss W3 gate LF04, 2026-11-21.

const K = 1000;
const TYPE = "'Courier New', Courier, monospace";
const INK = '#2a2622', BAR = '#1f2a3a';

const pageQuad = (c: YCam): Quad | null => {
  const W = MEMO.w / 2, H = MEMO.h / 2, y = MEMO.y + 0.002;
  const q = [memoPt(-W, -H, y), memoPt(W, -H, y), memoPt(W, H, y), memoPt(-W, H, y)].map((v) => camPoint(c, v));
  return q.every(Boolean) ? (q as Pt[] as unknown as Quad) : null;
};

/** Page-local box (model m, x from the left edge, z from the top edge) -> absolute CSS in page px. */
const at = (x: number, z: number, w?: number): CSSProperties => ({position: 'absolute', left: x * K, top: z * K, ...(w ? {width: w * K} : {})});
const Bar = ({w}: {w: number}) => <span style={{display: 'inline-block', width: w * K, height: 0.07 * K, background: BAR, verticalAlign: '-0.08em', margin: '0 0.03em'}} />;

/** Cap height 0.06 (body) / 0.09 (subject) model m per the set plan; Courier caps are about 0.57 em. */
const BODY: CSSProperties = {fontFamily: TYPE, fontSize: (0.06 / 0.57) * K, lineHeight: `${0.11 * K}px`, color: INK, fontWeight: 600, whiteSpace: 'normal'};

/** `fit` (G7 B06-SH02/SH03, Boss W5.2, 2026-11-21; opt-in): the body block starts higher (z 0.76) on a tighter line (0.098) and the subject at z 0.30
 *  (G6 `MEMO_FIT_SUBJECT`, its three lines end above the body), so the body's last wrapped line
 *  "not be practical." clears the stamp's top border; the default layout runs "…it would" into "WOULD NOT BE", unreadable in the B06-SH03 insert. */
export const MemoText = ({c, stamp = true, fit = false}: {c: YCam; stamp?: boolean; fit?: boolean}) => {
  const q = pageQuad(c);
  if (!q) return null;
  const w = Math.round(MEMO.w * K), h = Math.round(MEMO.h * K), L = 0.2;
  // body ends about page-local z +0.1 (set plan), i.e. 1.585 from the top edge
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: quadMatrix3d(w, h, q), overflow: 'hidden'}}>
      <span style={{...at(1.62, 0.12), fontFamily: "'Bradley Hand', 'Segoe Print', cursive", fontSize: 0.13 * K, color: '#6a6660', transform: 'rotate(-4deg)', display: 'inline-block'}}>3-67</span>
      <div style={{...at(L, fit ? 0.3 : 0.42, MEMO.w - 2 * L), ...BODY, fontSize: (0.09 / 0.57) * K, lineHeight: `${0.15 * K}px`}}>
        SUBJECT: Views on Trained Cats <Bar w={0.32} /> for <Bar w={0.26} /> Use
      </div>
      <div style={{...at(L, fit ? 0.76 : 0.86, MEMO.w - 2 * L), ...BODY, ...(fit ? {lineHeight: `${0.098 * K}px`} : {})}}>
        <Bar w={1.5} /><br /><Bar w={1.1} /> This is in itself a remarkable scientific achievement. <Bar w={0.5} /><br /><Bar w={1.6} /><br /><Bar w={0.9} /> …it would not be practical.
      </div>
      {stamp && <PageStamp />}
    </div>
  );
};

/** The L12 stamp imprint on the page: kit STAMP red, double rule, "WOULD NOT BE / PRACTICAL", ink dropouts and a rough edge (seeded, fixed). */
const PageStamp = () => {
  const id = useId().replace(/:/g, '');
  const sw = MEMO_STAMP.w * K, sh = MEMO_STAMP.h * K, b = sh * 0.05;
  const cx = (MEMO_STAMP.x + MEMO.w / 2) * K, cy = (MEMO_STAMP.z + MEMO.h / 2) * K;
  const txt = (y: number, s: string): ReactNode => (
    <text x={0} y={y} textAnchor="middle" fill={STAMP.red} stroke={STAMP.red} strokeWidth={sh * 0.012} fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={sh * 0.3} textLength={sw * 0.82} lengthAdjust="spacingAndGlyphs" style={{paintOrder: 'stroke'}}>{s}</text>
  );
  return (
    <svg width={MEMO.w * K} height={MEMO.h * K} style={{position: 'absolute', left: 0, top: 0, opacity: 0.88, mixBlendMode: 'multiply'}}>
      <defs>
        <filter id={`${id}r`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={11} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={6} />
        </filter>
        <filter id={`${id}k`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves={2} seed={5} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.4" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
      <g transform={`translate(${cx} ${cy}) rotate(${MEMO_STAMP.rot})`} filter={`url(#${id}k)`}>
        <g filter={`url(#${id}r)`} fill="none" stroke={STAMP.red} strokeLinejoin="round">
          <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={sh * 0.1} strokeWidth={b} />
          <rect x={-sw / 2 + b * 1.8} y={-sh / 2 + b * 1.8} width={sw - b * 3.6} height={sh - b * 3.6} rx={sh * 0.05} strokeWidth={b * 0.4} />
          {txt(-sh * 0.04, 'WOULD NOT BE')}
          {txt(sh * 0.3, 'PRACTICAL')}
        </g>
      </g>
    </svg>
  );
};

/** Screen-space wrapper that hides its children inside `hole` (picture px): the cat lying on the page occludes the DOM text under it. */
const CutOut = ({hole, children}: {hole: Pt[] | null; children: ReactNode}) => {
  if (!hole) return <>{children}</>;
  const pts = ['0px 0px', '1080px 0px', '1080px 1920px', '0px 1920px', '0px 0px', ...hole.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`), `${hole[0][0].toFixed(1)}px ${hole[0][1].toFixed(1)}px`];
  return <div style={{position: 'absolute', inset: 0, clipPath: `polygon(evenodd, ${pts.join(', ')})`}}>{children}</div>;
};

/** DOM overlays per look id (drawn over the BrushCanvas, under Grade and Grain). */
export const OFFICE_OVERLAYS: Record<string, (c: YCam) => ReactNode> = {
  LF04: (c) => <CutOut hole={catHole(c)}><MemoText c={c} /></CutOut>,
};

/** G6 (Boss W5.2, 2026-11-21; additive): the memo layout parts for the type-on page (memo-type.tsx), so its finished state is MemoText's layout. */
export {K as MEMO_K, TYPE as MEMO_TYPE, BODY as MEMO_BODY, Bar as MemoBar, PageStamp, CutOut, at as memoAt, pageQuad as memoPageQuad};

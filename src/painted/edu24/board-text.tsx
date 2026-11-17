import type {CSSProperties, ReactNode} from 'react';
import {quadMatrix3d, type Quad} from '../../scenes/quadText';
import type {Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {PAL} from './palette';
import {BOARD, boardQuad, CARD_LINES} from './room';

// EDU-EP24-SHORT VD03: board digits, the "คุณ"/"เขา" labels (user Q1), the "รวม" tally and the rule-card lines as camera-mapped DOM text
// (QuadText homography, `src/scenes/quadText.ts`; EDU-EP16 logbook precedent). Each quad's four world corners go through the shot's single
// `YCam`, so the text sticks to the painted board. `ink` maps every colour (identity, or the B04 `sepia`), so the grade reaches the text.

export type BoardState = {you?: number; rival?: number; sum: number; lit?: boolean};
const FONT = "'Noto Sans Thai', sans-serif";

/** Picture quad of four world corners (TL, TR, BR, BL), or null when any is behind the lens. */
export const picQuad = (c: YCam, w: V3[]): Quad | null => {
  const q = w.map((v) => camPoint(c, v));
  return q.every(Boolean) ? (q as Pt[] as unknown as Quad) : null;
};

const OnQuad = ({c, world, w, h, children, style}: {c: YCam; world: V3[]; w: number; h: number; children: ReactNode; style?: CSSProperties}) => {
  const q = picQuad(c, world);
  if (!q) return null;
  return <div lang="th" style={{position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'hidden', transformOrigin: '0 0', transform: quadMatrix3d(w, h, q), display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>{children}</div>;
};

/** Box px per board metre (the text is laid out at 1000 px per metre, then mapped). */
const K = 1000;
type R4 = readonly [number, number, number, number];
const dims = (r: R4) => ({w: Math.round((r[1] - r[0]) * K), h: Math.round((r[3] - r[2]) * K)});

export const BoardText = ({c, s, ink = (x) => x}: {c: YCam; s: BoardState; ink?: (c: string) => string}) => {
  const B = BOARD;
  const label = (r: R4, text: string) => {
    const {w, h} = dims(r);
    return <OnQuad c={c} world={boardQuad(r, 0.012)} w={w} h={h}><span style={{fontFamily: FONT, fontWeight: 700, fontSize: 1.0 * h, lineHeight: 1, color: ink(PAL.label), transform: 'translateY(-15%)'}}>{text}</span></OnQuad>;
  };
  const digits = (r: R4, v?: number) => {
    const {w, h} = dims(r);
    return <OnQuad c={c} world={boardQuad(r, 0.012)} w={w} h={h}><span style={{fontFamily: FONT, fontWeight: 700, fontSize: 0.86 * h, lineHeight: 1, letterSpacing: '0.02em', color: ink(PAL.digit)}}>{v === undefined ? '–' : String(v)}</span></OnQuad>;
  };
  const sum = (() => {
    const r = B.sum as unknown as R4, {w, h} = dims(r), col = ink(PAL.sumInk);
    return <OnQuad c={c} world={boardQuad(r, 0.012)} w={w} h={h} style={{justifyContent: 'space-between', padding: `0 ${Math.round(0.08 * w)}px`, boxSizing: 'border-box'}}>
      <span style={{fontFamily: FONT, fontWeight: 600, fontSize: 0.62 * h, lineHeight: 1, color: col, opacity: s.lit ? 1 : 0.8}}>รวม</span>
      <span style={{fontFamily: FONT, fontWeight: 700, fontSize: 0.78 * h, lineHeight: 1, color: col, opacity: s.lit ? 1 : 0.8}}>{s.sum}</span>
    </OnQuad>;
  })();
  return <>
    {label(B.tabYou as unknown as R4, 'คุณ')}
    {label(B.tabRival as unknown as R4, 'เขา')}
    {digits(B.winYou as unknown as R4, s.you)}
    {digits(B.winRival as unknown as R4, s.rival)}
    {sum}
  </>;
};

/** CARD24 text: line 1 always; line 2 only once the flap is down (L05 on), so it can never show through the painted flap. */
export const CardText = ({c, flapDown, ink = (x) => x}: {c: YCam; flapDown: boolean; ink?: (c: string) => string}) => {
  const line = (world: V3[], text: string) => (
    <OnQuad c={c} world={world} w={1000} h={280}><span style={{fontFamily: FONT, fontWeight: 600, fontSize: 96, lineHeight: 1, whiteSpace: 'nowrap', color: ink(PAL.cardInk)}}>{text}</span></OnQuad>
  );
  return <>
    {line(CARD_LINES.line1, 'ใครเสนอสูงสุด ได้แบงก์')}
    {flapDown && line(CARD_LINES.line2, 'ที่สองก็ต้องจ่าย')}
  </>;
};

/** Picture-space bounds of the board text quads (for the occlusion and size measures). */
export const boardTextBoxes = (c: YCam) => Object.fromEntries((['tabYou', 'tabRival', 'winYou', 'winRival', 'sum'] as const).map((k) => {
  const q = picQuad(c, boardQuad(BOARD[k] as unknown as R4, 0.012));
  if (!q) return [k, null];
  const xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
  return [k, [Math.round(Math.min(...xs)), Math.round(Math.min(...ys)), Math.round(Math.max(...xs)), Math.round(Math.max(...ys))]];
}));

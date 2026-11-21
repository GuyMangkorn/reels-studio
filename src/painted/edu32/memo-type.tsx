import type {CSSProperties, ReactNode} from 'react';
import {quadMatrix3d} from '../../scenes/quadText';
import type {Pt} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import type {Quad} from '../../scenes/quadText';
import {MEMO, MEMO_STAMP, memoPt} from './office';
import {MEMO_BODY as BODY, MEMO_K as K, MemoBar as Bar, PageStamp, memoAt as at} from './office-text';
import {TYPE_A, TYPE_B, UNDERLINE_N, type MemoState} from './b05-memo';

// EDU-EP32-SHORT memo MM with type-on, pencil underline and the stamp slam (Boss G6, 2026-11-21; timing in b05-memo.ts). Same markup and styles
// as office-text.tsx `MemoText` (LF04, the page G7 shows), so wrapping is identical: unrevealed characters are `visibility: hidden` and keep
// their space, the underline is a background on the same characters, the stamp is `PageStamp` scaled about its centre. MEMO_FINAL = MemoText
// plus the red underline (B06-SH02/SH03 should show MEMO_FINAL so the underline does not vanish; reported to G7). `fit` (default on) = G7's
// 'B06-FIT' body layout (z 0.76, line 0.098) that B06-SH02/SH03 show, so the page is the same across the B05 -> B06 cuts.

const PENCIL = '#b8322a';
/** Subject top in the `fit` layout (G6): the subject wraps to three lines (0.15 each at cap 0.09), so at 0.42 its third line "for [bar] Use" sits
 *  on the fit body's first line (z 0.76) and the 1.5 m bar covers it. At 0.30 it ends above the body; "3-67" (z 0.12-0.25) stays clear. G7's
 *  MemoText `fit` needs the same value for the B05 -> B06 page to match (reported). */
export const MEMO_FIT_SUBJECT = 0.3;

/** The page quad, cropped at the bottom when the near part of the sheet is behind the lens (B05-SH02/SH03 stand over the page): the largest
 *  page-local bottom z (0.01 m steps) whose corners project. Returns the quad and the cropped page height in page px (content keeps its place). */
export const memoQuadCropped = (c: YCam): {q: Quad; h: number} | null => {
  const W = MEMO.w / 2, H = MEMO.h / 2, y = MEMO.y + 0.002;
  const top = [memoPt(-W, -H, y), memoPt(W, -H, y)].map((v) => camPoint(c, v));
  if (!top.every(Boolean)) return null;
  for (let z = H; z > -H + 0.3; z -= 0.01) {
    const bot = [memoPt(W, z, y), memoPt(-W, z, y)].map((v) => camPoint(c, v));
    if (bot.every(Boolean)) return {q: [...top, ...bot] as Pt[] as unknown as Quad, h: Math.round((z + H) * K)};
  }
  return null;
};
const hidden: CSSProperties = {visibility: 'hidden'};

/** `text` with the first `n` characters shown; characters [u0, u1) carry the pencil underline (its own per-character progress). */
const Typed = ({text, n, ul = 0, ulFrom = 0}: {text: string; n: number; ul?: number; ulFrom?: number}) => {
  if (ul <= 0) return <>{text.slice(0, n)}<span style={hidden}>{text.slice(n)}</span></>;
  // underline: one span per character so a wrapped phrase underlines line by line, left to right
  return (
    <>
      {[...text].map((ch, i) => {
        // pencil underline per character (text-decoration sits just under the baseline, clear of the tight next line); on at half cover
        const k = i - ulFrom, on = k >= 0 && k < UNDERLINE_N && ul * UNDERLINE_N - k >= 0.5;
        const style: CSSProperties = {...(i >= n ? hidden : {}), ...(on ? {textDecorationLine: 'underline', textDecorationColor: PENCIL, textDecorationThickness: 0.011 * K, textUnderlineOffset: 0.012 * K, textDecorationSkipInk: 'none'} : {})};
        return <span key={i} style={style}>{ch}</span>;
      })}
    </>
  );
};

export const MemoTyped = ({c, state, fit = true}: {c: YCam; state: MemoState; fit?: boolean}) => {
  const qc = memoQuadCropped(c);
  if (!qc) return null;
  const {q, h} = qc, w = Math.round(MEMO.w * K), L = 0.2;
  const s = state.stamp, cx = (MEMO_STAMP.x + MEMO.w / 2) * K, cy = (MEMO_STAMP.z + MEMO.h / 2) * K;
  const last: ReactNode = '…it would not be practical.';
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: quadMatrix3d(w, h, q), overflow: 'hidden'}}>
      <span style={{...at(1.62, 0.12), fontFamily: "'Bradley Hand', 'Segoe Print', cursive", fontSize: 0.13 * K, color: '#6a6660', transform: 'rotate(-4deg)', display: 'inline-block'}}>3-67</span>
      <div style={{...at(L, fit ? MEMO_FIT_SUBJECT : 0.42, MEMO.w - 2 * L), ...BODY, fontSize: (0.09 / 0.57) * K, lineHeight: `${0.15 * K}px`}}>
        SUBJECT: Views on Trained Cats <Bar w={0.32} /> for <Bar w={0.26} /> Use
      </div>
      <div style={{...at(L, fit ? 0.76 : 0.86, MEMO.w - 2 * L), ...BODY, ...(fit ? {lineHeight: `${0.098 * K}px`} : {})}}>
        <Bar w={1.5} /><br /><Bar w={1.1} /> <Typed text={TYPE_A} n={state.a} /> <Typed text={TYPE_B} n={state.b} ul={state.underline} /> <Bar w={0.5} /><br /><Bar w={1.6} /><br /><Bar w={0.9} /> {state.last ? last : <span style={hidden}>{last}</span>}
      </div>
      {s && s.opacity > 0 && (
        <div style={{position: 'absolute', inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s.scale})`, opacity: s.opacity}}>
          <PageStamp />
        </div>
      )}
    </div>
  );
};

/** Lamp falloff grade (screen layer over the canvas and the DOM pages, under Grade + Grain): the near page falls into the navy room below `y0`,
 *  reaching opacity `a` at `y1` and holding to the bottom, so the caption band y 1230-1344 sits on dark paper (caption-zone.py, defaults 0.25 /
 *  0.40) instead of the lamp-lit cream (measured 0.83 without it). */
export const BandShade = ({y0, y1, a}: {y0: number; y1: number; a: number}) => {
  if (a <= 0) return null;
  // smoothstep ramp in 8 stops, so the falloff reads as light, not as an edge
  const stops = Array.from({length: 9}, (_, i) => { const u = i / 8, k = u * u * (3 - 2 * u); return `rgba(15,21,34,${(a * k).toFixed(3)}) ${(y0 + (y1 - y0) * u).toFixed(0)}px`; });
  return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(to bottom, ${stops.join(', ')}, rgba(15,21,34,${a.toFixed(3)}) 1920px)`}} />;
};

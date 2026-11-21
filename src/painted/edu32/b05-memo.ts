import {stampState} from '../kit/stamp';
import {clamp01} from './field-cat';

// EDU-EP32-SHORT memo MM state through G6 (timed sheet EDU-EP32-SHEET-R1 B05-SH01..B06-SH01; VD32-12; Boss G6, 2026-11-21). Pure functions of the
// shot frame, so every character, the underline and the stamp seek. The DOM page is memo-type.tsx `MemoTyped`, which lays out exactly as
// office-text.tsx `MemoText` (LF04): unrevealed characters keep their space, so the finished page is the LF04 page, line for line.
//   B05-SH02 type-on (W anchors): "This is in itself a" L4-L37, pause L38-L47, "remarkable scientific achievement." L48-L90 (34 chars, 0.8 per
//   frame), red pencil underline under "remarkable scientific achievement" L92-L106. B05-SH03 stamp: kit `stampState` from 1.3, slam L37-L41,
//   impact L41 (G1368). The last line "…it would not be practical." is on the page throughout (a real document; hiding it until B05-SH03 made
//   it pop in on the SH02|SH03 cut, which shares one framing); in B05-SH01/SH02 it sits low in the lamp falloff (`BandShade`). Open item for Film.

export const TYPE_A = 'This is in itself a';
export const TYPE_B = 'remarkable scientific achievement.';
/** Underlined span: TYPE_B without the full stop. */
export const UNDERLINE_N = TYPE_B.length - 1;
export const B05SH02_TYPE = {a: [4, 37], b: [48, 90], underline: [92, 106]} as const;
export const B05SH03_STAMP = {land: 37, slam: 4, impact: 41} as const;

export type MemoState = {
  /** Characters of TYPE_A / TYPE_B revealed. */
  a: number; b: number;
  /** Underline progress 0..1 over UNDERLINE_N characters. */
  underline: number;
  /** The last line "…it would not be practical." shown. */
  last: boolean;
  /** Page stamp: scale about its centre and opacity (null = no stamp). */
  stamp: {scale: number; opacity: number} | null;
};

export const MEMO_BLANK: MemoState = {a: 0, b: 0, underline: 0, last: true, stamp: null};
export const MEMO_FINAL: MemoState = {a: TYPE_A.length, b: TYPE_B.length, underline: 1, last: true, stamp: {scale: 1, opacity: 1}};

/** Characters typed by frame L over the inclusive window [s, e]: the first character lands on s, the last on e. */
export const typedChars = (L: number, [s, e]: readonly [number, number], n: number) =>
  L < s ? 0 : Math.min(n, 1 + Math.floor(((L - s) * (n - 1)) / (e - s)));

export const b05sh02Memo = (L: number): MemoState => {
  const T = B05SH02_TYPE, [u0, u1] = T.underline;
  return {a: typedChars(L, T.a, TYPE_A.length), b: typedChars(L, T.b, TYPE_B.length), underline: clamp01((L - u0 + 1) / (u1 - u0 + 1)), last: true, stamp: null};
};

export const b05sh03Memo = (L: number): MemoState => {
  const s = stampState(L, {land: B05SH03_STAMP.land, slam: B05SH03_STAMP.slam});
  return {...MEMO_FINAL, stamp: s.visible ? {scale: s.scale, opacity: s.opacity} : null};
};

/** Band shade per shot (memo-type.tsx `BandShade`): ramp rows and opacity at shot frame L. B05-SH01 brings it in as the memo enters the band. */
export const G6_SHADE = {sh01: {y0: 820, y1: 1235, a: 0.8, from: 30, to: 56}, page: {y0: 820, y1: 1235, a: 0.8}, printout: {y0: 1010, y1: 1235, a: 0.8}} as const;
export const b05sh01Shade = (L: number) => {
  const s = G6_SHADE.sh01;
  return {y0: s.y0, y1: s.y1, a: s.a * clamp01((L - s.from) / (s.to - s.from))};
};

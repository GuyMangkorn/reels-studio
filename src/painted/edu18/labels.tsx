import type {CSSProperties} from 'react';
import {FPS} from './clock';

// N13 label slots (screen layers, Remotion DOM above the painted canvas; DF-20261030-painted-label-slots): OT01 "ภาพจำลอง" in LBL (816-1020 x 148-204);
// OT02 "เม็ดใหญ่สุด หนักได้ถึง 50 เท่าของยุง" in LBL-W (300-1020 x 236-330, two lines allowed); OT03 "20 เท่าความยาวตัว" world-anchored to the ruler's 20th
// mark with a 1 px leader. Visibility windows are GLOBAL frames from the timed scene sheet (ROWS-R2.0 "On-screen text"); R01: OT01 f38..f1182, none before the
// shrink or from W-BACK on. Pure functions of the frame; the stroke is the edu caption stroke.
const FONT = "'Noto Sans Thai', sans-serif";
export const INK_EDGE = '#1d2129';
const edu = (size: number, color = '#ffffff', stroke = 7): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.05, WebkitTextStroke: `${stroke}px ${INK_EDGE}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', textAlign: 'center'});
export const LBL = {x: 816, y: 148, w: 204, h: 56} as const;
export const LBL_W = {x: 300, y: 236, w: 720, h: 94} as const;
export const OT = {
  OT01: {text: 'ภาพจำลอง', range: [38, 1183] as const},
  OT02: {text: 'เม็ดใหญ่สุด หนักได้ถึง 50 เท่าของยุง', range: [72, 136] as const},
  OT03: {text: '20 เท่าความยาวตัว', range: [812, 866] as const},
};
export type OtId = keyof typeof OT;
/** Half-open visibility of a label at a global frame. */
export const otVisible = (id: OtId, f: number) => f >= OT[id].range[0] && f < OT[id].range[1];
export const visibleAt = (f: number): OtId[] => (Object.keys(OT) as OtId[]).filter((k) => otVisible(k, f));
const pop = (f: number, a: number) => Math.min(1, Math.max(0, (f - a) / 6));

export const Ot01 = ({f}: {f: number}) => !otVisible('OT01', f) ? null : (
  <div lang="th" style={{position: 'absolute', left: LBL.x, top: LBL.y, width: LBL.w, height: LBL.h, display: 'flex', alignItems: 'center', justifyContent: 'center', ...edu(40, '#ffffff', 6)}}>{OT.OT01.text}</div>
);
export const Ot02 = ({f}: {f: number}) => !otVisible('OT02', f) ? null : (
  <div lang="th" style={{position: 'absolute', left: LBL_W.x, top: LBL_W.y, width: LBL_W.w, height: LBL_W.h, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', opacity: pop(f, OT.OT02.range[0]), ...edu(40, '#ffffff', 6), whiteSpace: 'normal', textAlign: 'right'}}>{OT.OT02.text}</div>
);
/** OT03 anchored at the pixel `at` (the ruler's 20 mark): text to the left of the mark, a 1 px leader from the text's edge to the mark. */
export const Ot03 = ({f, at}: {f: number; at: [number, number] | null}) => {
  if (!otVisible('OT03', f) || !at) return null;
  const k = pop(f, OT.OT03.range[0]), w = 360, x1 = at[0] - 30, tx = x1 - w;
  return (
    <>
      <div lang="th" style={{position: 'absolute', left: tx, top: at[1] - 64, width: w, opacity: k, ...edu(40, '#ffd34a', 6), textAlign: 'right'}}>{OT.OT03.text}</div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: k, pointerEvents: 'none'}}><line x1={x1 + 4} y1={at[1] - 20} x2={at[0] - 6} y2={at[1]} stroke="#ffffff" strokeWidth={1} /></svg>
    </>
  );
};
export const fromSec = (s: number) => Math.round(s * FPS);

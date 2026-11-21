import type {ReactNode} from 'react';
import {quadMatrix3d, type Quad} from '../../scenes/quadText';
import type {Pt} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import {LF05_AJAR, SIGN, SIGN_REST, signClipCss, signCorners} from './corridor';

// EDU-EP32-SHORT Space C sign text as camera-mapped DOM (VD32-22: "ห้ามรบกวน" on the card on the knob, the script's visible prop text; QuadText
// homography, the memo precedent in office-text.tsx). The card itself is painted (corridor.ts); this lays the two inked lines on it (two lines give taller glyphs than one on this card). Boss W3 gate LF05.
// G5 (2026-11-21): follows the card's `swing` and `lift`, and clips (CSS clip-path in card space) at the latch-side jamb line like the painted card.

const K = 1000;

export const SignText = ({c, ajar, swing = SIGN_REST, lift = 0}: {c: YCam; ajar: number; swing?: number; lift?: number}) => {
  const q = signCorners(ajar, swing, lift).map((v) => camPoint(c, v));
  if (!q.every(Boolean)) return null;
  const w = Math.round(SIGN.w * K), h = Math.round(SIGN.h * K), clip = signClipCss(c, ajar, swing, lift, K);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: quadMatrix3d(w, h, q as Pt[] as unknown as Quad), ...(clip ? {clipPath: clip} : {})}}>
      <div style={{position: 'absolute', left: 0.014 * K, right: 0.014 * K, top: 0.014 * K, bottom: 0.014 * K, border: `${0.005 * K}px solid #a8342a`, borderRadius: 0.008 * K, opacity: 0.85}} />
      <div lang="th" style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 800, fontSize: 0.078 * K, lineHeight: 0.98, color: '#2a1d18', whiteSpace: 'nowrap', paddingTop: 0.012 * K}}>
        <span>ห้าม</span><span>รบกวน</span>
      </div>
    </div>
  );
};

/** DOM overlays per look id (drawn over the BrushCanvas, under Grade and Grain). */
export const CORRIDOR_OVERLAYS: Record<string, (c: YCam) => ReactNode> = {
  LF05: (c) => <SignText c={c} ajar={LF05_AJAR} />,
  'LF05-BOWL': (c) => <SignText c={c} ajar={0} />,
};

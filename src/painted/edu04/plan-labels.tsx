import type {CSSProperties} from 'react';
import {LANE} from './cast';

// Screen-space text of the PLAN shots (VD08): Thai type is rendered by Remotion, never painted. "แบบจำลอง" appears on every
// fraction (sub-label directly under it) and as the eyebrow top-right; "คุณ" tags MAN's dot. Fraction slot y 870-1050, sub-label
// y 1065-1125, both above the caption band (1176).
const font: CSSProperties = {fontFamily: 'Noto Sans Thai', fontWeight: 800, textAlign: 'center', position: 'absolute', lineHeight: 1};

export const ModelEyebrow = () => (
  <div lang="th" style={{...font, right: 56, top: 120, fontSize: 40, fontWeight: 700, color: '#3a2f22', padding: '10px 22px', border: '3px solid #3a2f22', borderRadius: 14, background: '#fff6e0'}}>แบบจำลอง</div>
);

export const FractionLockup = ({frac, color = '#2b211c', x = 540}: {frac: string; color?: string; x?: number}) => (
  <>
    <div style={{...font, left: x - 330, width: 660, top: 860, height: 190, fontSize: 200, color, letterSpacing: 4, WebkitTextStroke: '2px #2b211c'}}>{frac}</div>
    <div lang="th" style={{...font, left: x - 330, width: 660, top: 1066, height: 60, fontSize: 56, fontWeight: 700, color: '#3a2f22'}}>แบบจำลอง</div>
  </>
);

/** Tag over MAN's dot (lane 2, S3): z -2.2 -> y 586 on the 130 px/m plan. */
export const YouTag = ({x, y}: {x: number; y: number}) => (
  <div lang="th" style={{...font, left: x - 150, top: y - 26, width: 140, height: 52, fontSize: 38, fontWeight: 800, color: '#fff', background: '#1f3a5f', borderRadius: 26, paddingTop: 7, boxSizing: 'border-box', border: '3px solid #fff', boxShadow: '0 3px 0 rgba(0,0,0,.25)'}}>คุณ</div>
);
export const LANE_COLOR = LANE;

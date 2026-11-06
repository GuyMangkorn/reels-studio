import {useVideoConfig} from 'remotion';
import type {PaintedItem} from '../scenes/types';

/**
 * Screen-space reconstruction label (VD04: "ภาพจำลอง"): white Thai text with a dark outline, inside the caption-safe
 * box and above the caption band. Short: x 120, text box y 300-350. Rendered by Remotion, never painted, and outside
 * every camera transform. The Thai text itself is authored in the timeline (`painted.shots[].label`).
 */
export const LABEL_BOX = {short: {left: 120, top: 300, height: 50}, long: {left: 144, top: 120, height: 44}};

/**
 * `slot` 0 is the first label slot; slot 1 stacks one box (height + 10 px) below it (DEP03: Short y 360-410). `top`
 * replaces the box top of slot 0 (timeline cue `labelTop`); slot 1 still stacks below it.
 */
export const PaintedLabel = ({text, slot = 0, top: top0}: {text: string; slot?: number; top?: number}) => {
  const {width, height} = useVideoConfig();
  const box = height > width ? LABEL_BOX.short : LABEL_BOX.long;
  const top = (top0 ?? box.top) + slot * (box.height + 10);
  return (
    <div lang="th" style={{position: 'absolute', left: box.left, top, height: box.height, display: 'flex', alignItems: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: box.height * 0.76, lineHeight: 1, color: '#ffffff', letterSpacing: 1, pointerEvents: 'none'}}>
      <span style={{WebkitTextStroke: '6px #1d2129', paintOrder: 'stroke fill', textShadow: '0 3px 0 #1d2129'}}>{text}</span>
    </div>
  );
};

const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));
const seg = (l: number, a: number, b: number) => Math.min(1, Math.max(0, b > a ? (l - a) / (b - a) : l >= a ? 1 : 0));

/**
 * Positioned screen item of a painted cue (`painted.shots[].items`): a pop-in outlined label or a paper card with a red strike,
 * centred at (x, y) px, timed in the plate's shot frames `l`. Pure of `l`; Remotion DOM, outside every camera transform.
 */
export const PaintedItemView = ({item, l}: {item: PaintedItem; l: number}) => {
  const k = seg(l, item.atFrame, item.atFrame + (item.popFrames ?? 6));
  if (k <= 0 || (item.untilFrame !== undefined && l >= item.untilFrame)) return null;
  if (item.kind === 'label') {
    return (
      <div lang="th" style={{position: 'absolute', left: item.x, top: item.y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * ease(k)})`, opacity: Math.min(1, k * 2), fontFamily: 'Noto Sans Thai', fontWeight: 700, color: '#fff', WebkitTextStroke: '6px #1d2129', paintOrder: 'stroke fill', textShadow: '0 3px 0 #1d2129', fontSize: 52, lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none'}}>{item.text}</div>
    );
  }
  const w = item.w ?? 220, h = item.h ?? 90;
  const strike = item.strikeAtFrame === undefined ? 0 : seg(l, item.strikeAtFrame, item.strikeAtFrame + (item.strikeFrames ?? 10));
  return (
    <div style={{position: 'absolute', left: item.x - w / 2, top: item.y - h / 2, width: w, height: h, transform: `scale(${0.8 + 0.2 * ease(k)})`, opacity: Math.min(1, k * 3), pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: '#f7f4ec', border: '4px solid #1d2129', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span lang="th" style={{fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 56, color: '#1d2129', lineHeight: 1}}>{item.text}</span>
      </div>
      <svg width={w + 80} height={h + 80} style={{position: 'absolute', left: -40, top: -40}}>
        {strike > 0 && <line x1={30} y1={h + 56} x2={30 + (w + 20) * strike} y2={h + 56 - (h + 32) * strike} stroke="#e61b1b" strokeWidth={12} strokeLinecap="round" />}
      </svg>
    </div>
  );
};

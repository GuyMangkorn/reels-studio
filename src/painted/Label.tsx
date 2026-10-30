import {useVideoConfig} from 'remotion';

/**
 * Screen-space reconstruction label (VD04: "ภาพจำลอง"): white Thai text with a dark outline, inside the caption-safe
 * box and above the caption band. Short: x 120, text box y 300-350. Rendered by Remotion, never painted, and outside
 * every camera transform. The Thai text itself is authored in the timeline (`painted.shots[].label`).
 */
export const LABEL_BOX = {short: {left: 120, top: 300, height: 50}, long: {left: 144, top: 120, height: 44}};

/** `slot` 0 is the first label slot; slot 1 stacks one box (height + 10 px) below it (DEP03: Short y 360-410). */
export const PaintedLabel = ({text, slot = 0}: {text: string; slot?: number}) => {
  const {width, height} = useVideoConfig();
  const box = height > width ? LABEL_BOX.short : LABEL_BOX.long;
  const top = box.top + slot * (box.height + 10);
  return (
    <div lang="th" style={{position: 'absolute', left: box.left, top, height: box.height, display: 'flex', alignItems: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: box.height * 0.76, lineHeight: 1, color: '#ffffff', letterSpacing: 1, pointerEvents: 'none'}}>
      <span style={{WebkitTextStroke: '6px #1d2129', paintOrder: 'stroke fill', textShadow: '0 3px 0 #1d2129'}}>{text}</span>
    </div>
  );
};

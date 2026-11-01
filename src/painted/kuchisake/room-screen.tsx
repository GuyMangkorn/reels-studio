import {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {PICTURE_H, PICTURE_W} from './rooms';

// Screen-space layers for the interior looks (LF04, LF05). `LowerFalloff` is the look.tsx `Falloff` (the approved LF01-LF03
// lamp falloff, brief VD02/VD13), copied rather than imported because look.tsx is frozen for the episode. `ColdGrade` is the
// LF05 cold grade (brief VD10, "cold, near-black").

/** Lower-frame darkening in plate px: a dark gradient from `from` (0) to `to` (peak opacity). Keeps the caption band quiet. */
export const LowerFalloff = ({from = 760, to = PICTURE_H, peak = 0.62, color = '#070b10'}: {from?: number; to?: number; peak?: number; color?: string}) => {
  const id = useId();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${PICTURE_W} ${PICTURE_H}`}>
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={from} x2={0} y2={to}>
            <stop offset="0" stopColor={color} stopOpacity={0} />
            <stop offset="1" stopColor={color} stopOpacity={peak} />
          </linearGradient>
        </defs>
        <rect width={PICTURE_W} height={PICTURE_H} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Cold grade (LF05): a blue-grey screen wash that lifts the blacks toward the blind-stripe colour, without touching the figure's ink. */
export const ColdGrade = ({color = '#1c3350', opacity = 0.22}: {color?: string; opacity?: number}) => (
  <AbsoluteFill style={{background: color, mixBlendMode: 'screen', opacity, pointerEvents: 'none'}} />
);

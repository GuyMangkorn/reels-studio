import {useId} from 'react';
import {AbsoluteFill} from 'remotion';

// Shared screen-space layers of the painted episodes (S-P06 Grade/Grain, S-P08 ZC-CAPSHADE). They sit outside the
// picture camera: a plate's `Overlay` (src/painted/shot.ts) renders them, in the order Grade -> Grain -> CaptionShade.
// Moved unchanged from the WORLD FOG spike (src/painted/spike/WfogShop.tsx, which re-exports Grade and Grain).

/** Screen-space grade: cool, darker corners (vignette) so the eye stays on the door. */
export const Grade = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 60% at 52% 40%, rgba(8,12,14,0) 55%, rgba(8,12,14,0.38) 100%)'}} />
);

/** Paper grain over the whole picture so painted and SVG layers share one surface. */
export const Grain = ({opacity = 0.09}: {opacity?: number}) => {
  const id = useId();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Caption cue window in shot-local seconds (`tl`), the span a caption is on screen. */
export type CaptionCue = readonly [from: number, to: number];

/** Frames the shade lingers after the last cue ends (`MK-ZC-ST-09`: off 6 f after the last cue). */
export const SHADE_TAIL_FRAMES = 6;
/** Fade ramp (frames) at each end of the gated span: a shade that pops reads as a flash. */
export const SHADE_RAMP_FRAMES = 4;

/**
 * Shade strength factor 0..1 at shot-local `tl` for caption `cues`: 1 from the first cue start to `SHADE_TAIL_FRAMES`
 * after the last cue end, easing in over `SHADE_RAMP_FRAMES` ending at the first cue and out starting after the tail.
 * No cues -> 0 for the whole shot (a caption-free hold shows no shade). A pure function of `tl`, so it is seek-safe.
 */
export const shadeGate = (tl: number, cues: readonly CaptionCue[], fps = 30): number => {
  if (cues.length === 0) return 0;
  const start = Math.min(...cues.map(([a]) => a)), end = Math.max(...cues.map(([, b]) => b)) + SHADE_TAIL_FRAMES / fps;
  const r = SHADE_RAMP_FRAMES / fps;
  const up = Math.max(0, Math.min(1, (tl - (start - r)) / r)), down = Math.max(0, Math.min(1, (end + r - tl) / r));
  const e = (x: number) => x * x * (3 - 2 * x);
  return e(up) * e(down);
};

/**
 * `ZC-CAPSHADE` (S-P08): soft darkening behind the low caption block (bottom edge y 1248), cue-gated by `shadeGate`.
 * `band` is the horizontal CSS gradient y 990-1330 (peak 0.62) for light section/close shots; `soft` the 560 x 190 px
 * ellipse at (540, 1170) (peak 0.5) for full-frame POV. Colour is a warm near-black so the cream sets keep their hue.
 */
export const CaptionShade = ({tl, cues, mode = 'band', strength, fps = 30}: {tl: number; cues: readonly CaptionCue[]; mode?: 'band' | 'soft'; strength?: number; fps?: number}) => {
  const g = shadeGate(tl, cues, fps);
  if (g <= 0) return null;
  const peak = (strength ?? (mode === 'band' ? 0.62 : 0.5)) * g;
  const background = mode === 'band'
    ? `linear-gradient(to bottom, rgba(20,16,12,0) 990px, rgba(20,16,12,${peak}) 1080px, rgba(20,16,12,${peak}) 1250px, rgba(20,16,12,0) 1330px)`
    : `radial-gradient(ellipse 560px 190px at 540px 1170px, rgba(20,16,12,${peak}) 0%, rgba(20,16,12,${peak * 0.7}) 55%, rgba(20,16,12,0) 100%)`;
  return <AbsoluteFill style={{pointerEvents: 'none', background}} />;
};

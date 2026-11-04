import {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {DEFAULT_SHADE_CENTRE_Y, shadeBandStops} from '../../scenes/captionLayout';

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

/** Caption cue window in shot-local seconds (`tl`) and the cue's line count (default 2), so the shade fits the lines on screen. */
export type CaptionCue = readonly [from: number, to: number, lines?: number];

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
 * Ink rows of a caption block as `Subtitles` draws it in portrait (Noto Sans Thai 700, 51 px x `scale`, line-height 1.65):
 * the last line's ink runs from about 74 to 28 px above the block's bottom edge and lines are 84 px apart. The top is the
 * mean of a line with upper vowels only (68 px, WFOG-EP01-SHORT f20/f2760) and one with a tone mark (80 px, ZCPAINT-SET-
 * CAPTION-BACKDROP f45), 4 Nov 2026, so the centre is within 6 px of the glyphs either way. The line box is not the ink: centring on it leaves the glyphs off-centre.
 * `lines` may be fractional while the shade eases between cues. Rule: production-requirements#caption-backdrop.
 */
export const captionInk = (bottomEdgeY: number, lines: number, scale = 1) => {
  const bottom = bottomEdgeY - 28 * scale, top = bottom - 46 * scale - (lines - 1) * 51 * 1.65 * scale;
  return {top, bottom, center: (top + bottom) / 2};
};

/**
 * Line count the shade fits at `tl`: the latest cue that has started (the first cue before it). Between back-to-back cues
 * (gap within the shade tail, so the shade stays up) the height eases from the previous count over `SHADE_RAMP_FRAMES`.
 */
export const shadeLines = (tl: number, cues: readonly CaptionCue[], fps = 30): number => {
  const sorted = [...cues].sort((a, b) => a[0] - b[0]);
  const n = (c: CaptionCue) => c[2] ?? 2;
  let i = 0;
  while (i + 1 < sorted.length && sorted[i + 1][0] <= tl) i++;
  const cur = sorted[i], prev = sorted[i - 1];
  if (!cur) return 2;
  if (!prev || cur[0] - prev[1] > SHADE_TAIL_FRAMES / fps) return n(cur);
  const x = Math.max(0, Math.min(1, (tl - cur[0]) / (SHADE_RAMP_FRAMES / fps)));
  return n(prev) + (n(cur) - n(prev)) * x * x * (3 - 2 * x);
};

/** Shade core margin above and below the ink, and the feather beyond it (px at scale 1). */
export const SHADE_PAD = 24;
export const SHADE_FEATHER = 80;

/**
 * `ZC-CAPSHADE` (S-P08): soft darkening behind the caption block, cue-gated by `shadeGate` and sized by `shadeLines`:
 * its centre is the glyphs' centre (`captionInk`), its height the lines on screen. `bottomEdgeY` is the caption block's
 * bottom edge (default 1248, ZC TH). `band` is a horizontal CSS gradient (core = ink +/- `SHADE_PAD`, `SHADE_FEATHER`
 * feather, peak 0.62) for light section/close shots; `soft` a 560 px wide ellipse (peak 0.5) for full-frame POV.
 * Colour is a warm near-black so the cream sets keep their hue. Rule: production-requirements#caption-backdrop.
 */
export const CaptionShade = ({tl, cues, mode = 'band', strength, fps = 30, bottomEdgeY = 1248, scale = 1}: {tl: number; cues: readonly CaptionCue[]; mode?: 'band' | 'soft'; strength?: number; fps?: number; bottomEdgeY?: number; scale?: number}) => {
  const g = shadeGate(tl, cues, fps);
  if (g <= 0) return null;
  const peak = (strength ?? (mode === 'band' ? 0.62 : 0.5)) * g;
  const ink = captionInk(bottomEdgeY, shadeLines(tl, cues, fps), scale);
  const pad = SHADE_PAD * scale, feather = SHADE_FEATHER * scale, c = `rgba(20,16,12,${peak})`, clear = 'rgba(20,16,12,0)';
  const background = mode === 'band'
    ? `linear-gradient(to bottom, ${clear} ${ink.top - pad - feather}px, ${c} ${ink.top - pad}px, ${c} ${ink.bottom + pad}px, ${clear} ${ink.bottom + pad + feather}px)`
    : `radial-gradient(ellipse 560px ${(ink.bottom - ink.top) / 2 + pad + feather + 24 * scale}px at 540px ${ink.center}px, ${c} 0%, rgba(20,16,12,${peak * 0.7}) 55%, ${clear} 100%)`;
  return <AbsoluteFill style={{pointerEvents: 'none', background}} />;
};

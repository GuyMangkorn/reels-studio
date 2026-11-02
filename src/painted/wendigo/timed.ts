import {clamp01, ramp} from '../kit/painter';

// WDG-EP01-SHORT timed shots (scene sheets WDG-SS-R2.3, scene-index.md shot index). Pure data and clocks: no React, no canvas.

export const WDG_FPS = 30;
/** Composition length in frames (WDG-SS-R2, 95.37 s). */
export const WDG_FRAMES = 2861;

/**
 * Shot table: composition-global start `g` and length `n` in frames, half-open `[g, g + n)`. The ambient clock of each
 * plate is built from `g`, so every timeline that uses these plates must place each shot at this start. The proof
 * composition `WDG-PROOF` (src/videos/wendigo/index.ts) is built from this table.
 */
export const WDG_SHOTS = {
  'S01-B01-SH01': {g: 0, n: 60},
  'S01-B01-SH02': {g: 60, n: 132},
  'S01-B02-SH01': {g: 192, n: 99},
  'S01-B02-SH02': {g: 291, n: 115},
  'S01-B02-SH03': {g: 406, n: 40},
  'S01-B02-SH04': {g: 446, n: 154},
  'S01-B03-SH01': {g: 600, n: 113},
  'S01-B03-SH02': {g: 713, n: 82},
  'S01-B03-SH03': {g: 795, n: 192},
  'S01-B03-SH04': {g: 987, n: 113},
  'S01-B03-SH05': {g: 1100, n: 150},
  'S02-B01-SH01': {g: 1250, n: 144},
  'S02-B02-SH01': {g: 1394, n: 248},
  'S02-B03-SH01': {g: 1642, n: 258},
  'S02-B03-SH02': {g: 1900, n: 208},
  'S03-B01-SH01': {g: 2108, n: 257},
  'S03-B01-SH02': {g: 2365, n: 97},
  'S03-B01-SH03': {g: 2462, n: 74},
  'S03-B02-SH01': {g: 2536, n: 166},
  'S03-B02-SH02': {g: 2702, n: 159},
} as const;
export type WdgShotId = keyof typeof WDG_SHOTS;

/** Shot length in seconds (the plate's own clock runs `0 .. n / fps`). */
export const shotSec = (shot: WdgShotId) => WDG_SHOTS[shot].n / WDG_FPS;

/**
 * Ambient clock in seconds for a plate at shot-local `tl`: composition-global `(g + L) / fps` (wind bow, lantern flicker,
 * snow, breath). `reverse` runs it backwards, `(WDG_FRAMES - G) / fps`, so the last frame of S03-B02-SH02 is one frame
 * from frame 0 of S01-B01-SH01 (VD12; decision in scene-S03.md). Pure function of the frame: seek-safe.
 */
export const wdgAmbientAt = (shot: WdgShotId, tl: number, reverse = false) => {
  const G = WDG_SHOTS[shot].g / WDG_FPS + tl;
  return reverse ? WDG_FRAMES / WDG_FPS - G : G;
};

/** Smoothstep 0..1 over shot-local seconds `a..b` (clamped). */
export const wdgRamp = (tl: number, a: number, b: number) => ramp(tl, a, b);

/** Linear 0..1 over shot-local seconds `a..b` (clamped), for the piecewise staging rules of the sheets. */
export const wdgLin = (tl: number, a: number, b: number) => clamp01((tl - a) / (b - a));

/**
 * Lantern "nearly out" (sheet: glow peak <= 0.2, flickering): a deterministic flicker in `[lo, 1]` of the peak, a sum of
 * two sines of the ambient clock (no random per render). Returns the composite glow peak in 0..peak.
 */
export const lanternPeak = (t: number, peak: number, lo = 0.55) => {
  const f = 0.5 + 0.25 * Math.sin(t * 7.3) + 0.25 * Math.sin(t * 2.9 + 1.3);
  return peak * (lo + (1 - lo) * clamp01(f));
};

import {hash} from '../hash';

// B02 pound jolts (MK-ZCP-B2, S-P10): one seeded list per language, continuing across B02-SH01 and B02-SH02, read by
// the plates (door leaf kick, shudder strokes, hand squeeze) and exported for Editor, who places one pound hit per
// jolt frame so the picture leads the sound. Ranges are the sheets' (ZCPAINT-SHORT-SS-R1, composition frames at 30 fps).

export type Lang = 'TH' | 'EN';
export const POUND_SEED = 4201;
/** Spacing between regular blows: 0.30-0.55 s (sheet), from the seeded hash. */
export const POUND_MIN_SEC = 0.3, POUND_MAX_SEC = 0.55;

export type B02Timing = {
  /** Composition frame range of B02-SH01 and B02-SH02 (end exclusive) and SH02's `fromSec` in frames. */
  sh01: [number, number]; sh02: [number, number]; sh02FromFrames: number;
  /** Slam (first blow) and first regular blow, shot-local frames of SH01. */
  slam: number; firstRegular: number;
};
export const B02_TIMING: Record<Lang, B02Timing> = {
  TH: {sh01: [153, 198], sh02: [198, 288], sh02FromFrames: 3, slam: 2, firstRegular: 12},
  EN: {sh01: [141, 198], sh02: [198, 318], sh02FromFrames: 0, slam: 2, firstRegular: 39},
};

/** Composition frames of every pound jolt of B02 (slam, then the seeded rhythm to the end of SH02). */
export const poundJoltFrames = (lang: Lang): number[] => {
  const t = B02_TIMING[lang];
  const out = [t.sh01[0] + t.slam];
  let f = t.sh01[0] + t.firstRegular;
  for (let i = 0; f < t.sh02[1]; i++) {
    out.push(f);
    f += Math.round(30 * (POUND_MIN_SEC + (POUND_MAX_SEC - POUND_MIN_SEC) * hash(POUND_SEED + i)));
  }
  return out;
};

/**
 * Jolt frames in the plate clock of one shot (what the plate paint reads): SH01 plate frame = shot-local frame;
 * SH02 plate frame = shot-local frame + `fromSec` frames (`MK-ZC-ST-06`).
 */
export const poundJoltPlateFrames = (lang: Lang, shot: 'SH01' | 'SH02'): number[] => {
  const t = B02_TIMING[lang];
  const [a, b] = shot === 'SH01' ? t.sh01 : t.sh02;
  const shift = shot === 'SH02' ? t.sh02FromFrames : 0;
  return poundJoltFrames(lang).filter((f) => f >= a && f < b).map((f) => f - a + shift);
};

/** Jolt state at plate frame `pf`: frames since the last blow (null before the first) and the kick sign and size in px. */
export const joltAt = (frames: readonly number[], pf: number) => {
  let last = -1, idx = -1;
  frames.forEach((f, i) => { if (f <= pf) { last = f; idx = i; } });
  if (idx < 0) return null;
  const age = pf - last;
  const amp = 6 + 6 * hash(idx + 3), sign = hash(idx + 11) > 0.5 ? 1 : -1;
  // The leaf kicks on the blow frame and settles over ~5 frames; shudder strokes show for 5 frames.
  return {age, kick: age < 8 ? sign * amp * Math.exp(-age * 0.55) : 0, shudder: age < 5};
};

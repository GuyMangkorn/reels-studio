import envelopeJson from './bloop-envelope.json';

// DEP05: 30 fps RMS envelope of the NOAA bloop.wav (scripts/the-bloop/bake-envelope.py; NOTICE beside the JSON).
// Frame i is clip-local (clip frame 0 is the first frame of the clip's in-point). Peak-normalised 0..1.

export const CLIP_ENVELOPE: readonly number[] = envelopeJson.frames;

/** Envelope value at clip-local frame `c`; 0 outside the clip. */
export const envAt = (c: number) => (c < 0 || c >= CLIP_ENVELOPE.length ? 0 : CLIP_ENVELOPE[Math.floor(c)]);

/**
 * Spawn frames on a rising cross of `threshold` (the sheet's FX-RING rule, SH01): a spawn when the envelope rises
 * through the threshold, at least `minGap` frames after the previous spawn. Returns clip-local frames.
 */
export const risingCrosses = (threshold: number, minGap: number): number[] => {
  const out: number[] = [];
  for (let i = 1; i < CLIP_ENVELOPE.length; i++) {
    const rising = CLIP_ENVELOPE[i] >= threshold && CLIP_ENVELOPE[i - 1] < threshold;
    if (rising && (out.length === 0 || i - out[out.length - 1] >= minGap)) out.push(i);
  }
  return out;
};

// Voice-envelope lip-sync for a painted talk mouth, filed from EDU-EP31-SHORT (KIT-P01 intake, W8.4, 21 Nov 2026; second use after
// EDU-EP26's talk26.ts, TL01). A copy of `speechOpen` in src/painted/edu31/speech31.ts, which the episode keeps unchanged; the envelopes
// themselves (`ANCHOR_ENV`, `WHEELER_ENV`) are episode data and stay there. `envMouth` is a copy of `mouthAt` in src/rig/drivers.ts so the
// kit does not import the legacy rig.
//
// Envelope: one value per shot frame from the speaker's first frame, the per-frame RMS of the locked voice (30 fps, mono 48 kHz), normalised to
// the window's 95th percentile and clipped at 1. Use: `faceState: {open: speechOpen(ENV, L)}` with the `talk` mouth, only for an on-screen
// speaker whose mouth is visible. tests/edu31-kit.test.ts checks parity with the episode.

/** Mouth opening 0..1 at `frame` of an amplitude envelope: a two-frame smoothing, closed under 0.12, gain 1.2 (as the rig's `mouthAt`). */
export const envMouth = (amplitude: readonly number[], frame: number, startFrame = 0): number => {
  const index = Math.floor(frame - startFrame);
  if (index < 0 || index >= amplitude.length) return 0;
  const value = (amplitude[index] + (amplitude[index - 1] ?? 0) * 0.5) / 1.5;
  return value < 0.12 ? 0 : Math.min(1, value * 1.2);
};

/** Talk-mouth `open` 0..1 at shot frame L: `envMouth` on the envelope (closed between words and in pauses), scaled to `max`, the rise slewed
 *  to `rise` per frame so a syllable never snaps wide; closing follows the envelope. Frame-pure: folds from frame 0. */
export const speechOpen = (env: readonly number[], L: number, max = 0.75, rise = 0.25): number => {
  let o = 0;
  for (let l = 0; l <= Math.floor(L); l++) { const t = Math.min(max, envMouth(env, l) * max); o = t > o ? Math.min(t, o + rise) : t; }
  return o;
};

import {mouthAt} from '../../rig/drivers';

// EDU-EP31 lip-sync (fix round 2026-11-21, user's Draft note on B06-SH02: "the character speaks but the mouth does not move"). Per-frame RMS
// envelopes of the locked voice (EDU-EP31-VOICE-R1, public/narration/EDU-EP31-SHORT-narration-v1.wav = store
// projects/edu/EDU/narration/ep31-voice-r1-1/preview.wav, timeline offset 0), one value per shot frame from the shot's first frame, normalised
// to the window's 95th percentile and clipped at 1. Only on-screen speakers with a visible mouth: ANCHOR L11 (B05-SH02, G1240-1304) and WHEELER
// L14 (B06-SH02, G1416-1519; L2-5 is his first word "แต่", which the word aligner missed). POLICE L13 (B06-SH01) is a back view and the
// narrator is off screen: no mouth moves for them. Rebuild after a voice change by re-measuring the same windows (envelope script: 30 fps
// frames, mono 48 kHz RMS, p95 normalisation).

/** ANCHOR L11 "ใครจำชายคนนี้ได้…", B05-SH02 L0-64 (G1240-1304). */
export const ANCHOR_ENV = [0, 0, 0.2, 0.27, 0.58, 1, 1, 0.81, 0.55, 0.1, 0.11, 0.91, 0.89, 0.44, 0.24, 0.17, 0.19, 0.25, 0.83, 1, 0.43, 0.19, 0.45, 0.37,
  0.39, 0.43, 0.47, 0.11, 1, 0.93, 0.93, 0.87, 0.86, 0.65, 0.34, 0.06, 0.01, 0, 0, 0.14, 0.92, 1, 0.77, 0.37, 0.28, 0.02, 0.9, 0.49, 0.22, 0.14,
  0.66, 0.88, 0.89, 0.27, 0.18, 0.58, 0.27, 0.05, 0.23, 0.92, 1, 0.19, 0, 0, 0];

/** WHEELER L14 "แต่ ผมทาน้ำมะนาวแล้ว…", B06-SH02 L0-103 (G1416-1519). */
export const WHEELER_ENV = [0, 0, 0.15, 1, 0.93, 0.4, 0.02, 0, 0, 0, 0, 0, 0, 0.01, 0.01, 0, 0, 0, 0.12, 0.06, 0.08, 0.15, 0.52, 0.34, 0.46, 0.29, 0.07,
  0.27, 0.24, 0.24, 0.6, 0.58, 0.75, 0.35, 0.55, 0.89, 0.77, 0.49, 0.5, 1, 0.82, 0.53, 0.8, 0.88, 0.81, 0.76, 0.77, 0.79, 0.7, 0.85, 0.94, 0.62, 0.62,
  1, 0.88, 0.92, 0.79, 0.7, 0.48, 0.2, 0.03, 0.01, 0.01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.04, 0.27, 0.66, 0.49, 0.21, 0.45, 0.69, 0.85, 0.75, 1, 0.85,
  0.58, 1, 0.6, 0.65, 1, 0.83, 0.84, 0.99, 0.87, 1, 0.97, 0.9, 0.91, 1, 0.92, 0.67, 0.31, 0, 0, 0, 0];

/** Talk-mouth `open` 0..1 at shot frame L: `mouthAt` on the envelope (closed under its 0.12 floor, so between words and in pauses), scaled to
 *  `max`, the rise slewed to `rise` per frame so a syllable never snaps wide; closing follows the envelope. Frame-pure: folds from frame 0. */
export const speechOpen = (env: readonly number[], L: number, max = 0.75, rise = 0.25): number => {
  let o = 0;
  for (let l = 0; l <= Math.floor(L); l++) { const t = Math.min(max, mouthAt(env, l) * max); o = t > o ? Math.min(t, o + rise) : t; }
  return o;
};

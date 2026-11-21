import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {CAM_B04_SH02, CAM_B04_SH02_END, LF05_AJAR, SIGN_REST, corridorSpans, paintCorridor} from './corridor';
import {clamp01, easeInOut} from './field-cat';

// EDU-EP32-SHORT B04-SH02 "the door closes" (timed sheet EDU-EP32-SHEET-R1, G [993, 1072), 79 f; VD32-22, R3 keys VD32-28; Boss G5, 2026-11-21).
// One plate EDU32-B04-SH02, Space C. The camera stands down the corridor looking back along the door wall (eased L0 -> L78). The leaf stands ajar
// (`LF05_AJAR`) onto the flat dark gap L0-L3, swings shut L4-L20 (on "ทีมเลย", latch at L20 = G1013, arriving with a little speed for the click);
// the "ห้ามรบกวน" card lifts off the leaf as the door starts, slaps back at the latch, flaps twice (taps at L22 and L30, sound C20), and swings in the
// leaf plane (first peak +14 deg) to settle by L50. Shot-local frame L = round(tl * 30). Sign text: corridor-text.tsx `SignText` on the same camera.

export const B04SH02_N = 79;
export const SH02D = {close: [4, 20], latch: 20, taps: [22, 30], swing: {amp: 14, period: 20, tau: 8, settle: [44, 50]}} as const;

export const b04sh02Cam = (L: number): YCam => mixYCam(CAM_B04_SH02, CAM_B04_SH02_END, easeInOut(L / (B04SH02_N - 1)));

/** Close curve 0..1 over u 0..1: starts from rest, arrives at the average speed (f'(1) = 1) so the latch is a click, not a soft stop. */
const closeCurve = (u: number) => { const x = clamp01(u); return x * x * (2 - x); };

/** Door and card state at shot frame L: `ajar` (rad), in-plane `swing` (deg), `lift` (m, card bottom off the leaf). */
export const b04sh02Door = (L: number): {ajar: number; swing: number; lift: number} => {
  const [c0, c1] = SH02D.close, [t1, t2] = SH02D.taps, S = SH02D.swing;
  if (L < c0) return {ajar: LF05_AJAR, swing: SIGN_REST, lift: 0};
  if (L < c1) {
    const u = (L - c0) / (c1 - c0);
    // the card lags as the leaf accelerates away (its bottom lifts toward the corridor) and drifts a little toward the free edge
    return {ajar: LF05_AJAR * (1 - closeCurve(u)), swing: SIGN_REST - 4 * Math.sin(Math.PI * u), lift: 0.03 * Math.sin(Math.PI * u)};
  }
  const t = L - SH02D.latch;
  // two flaps off the wood after the latch slap: the bottom edge comes back to the leaf at L22 and at L30 (the two taps)
  const lift = L < t1 ? 0.014 * Math.sin((Math.PI * (L - c1)) / (t1 - c1)) : L < t2 ? 0.008 * Math.sin((Math.PI * (L - t1)) / (t2 - t1)) : 0;
  // in-plane swing from the latch jolt (the card hangs off-centre of the knob): damped, first peak +amp at a quarter period, faded out by L50
  const A = S.amp * Math.exp(S.period / 4 / S.tau), fade = 1 - clamp01((L - S.settle[0]) / (S.settle[1] - S.settle[0]));
  return {ajar: 0, swing: SIGN_REST + A * Math.exp(-t / S.tau) * Math.sin((2 * Math.PI * t) / S.period) * fade, lift};
};

/** Spans at shot frame L (door, visible sign, latch-side gap px). */
export const b04sh02Spans = (L: number) => { const d = b04sh02Door(L); return corridorSpans(b04sh02Cam(L), d.ajar, d.swing, d.lift); };

/** Caption band y 1230-1344 (timed sheet: lino at the door foot): the plate is graded in `paintB04SH02`; no screen shade by default. */
export const paintB04SH02 = (p: Painter, L: number) => {
  const d = b04sh02Door(L);
  paintCorridor(p, b04sh02Cam(L), d);
};

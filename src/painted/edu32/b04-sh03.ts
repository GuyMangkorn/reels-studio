import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {mixYCam, type YCam} from '../kit/ycam';
import {BOWL_AT, BOWL_FROM, CAM_B04_SH03, CAM_B04_SH03_START, SIGN_REST, kibbleSpot, paintCorridor} from './corridor';
import {clamp01, easeInOut, lerpV} from './field-cat';

// EDU-EP32-SHORT B04-SH03 "a bowl would have done" (timed sheet EDU-EP32-SHEET-R1, G [1072, 1131), 59 f; VD32-22, R3 keys VD32-28; Boss G5,
// 2026-11-21). One plate EDU32-B04-SH03, Space C, low on the lino in front of the shut door (eased L0 -> L58). The steel bowl slides in from
// screen-right (pushed: full speed in, friction to a stop) L6-L20 (on "ทั้งที่จริง ๆ…"), a small wobble L20-L24; 12 kibble pieces fall from above
// frame and land in the bowl L23-L35 (first landing on "ให้ข้าว" W1095 = L23, sound C22). The card hangs at rest, its lower edge at the top of frame.

export const B04SH03_N = 59;
export const SH03D = {slide: [6, 20], wobble: [20, 24], land: [23, 35], pieces: 12, v0: 3.5} as const;

export const b04sh03Cam = (L: number): YCam => mixYCam(CAM_B04_SH03_START, CAM_B04_SH03, easeInOut(L / (B04SH03_N - 1)));

/** Bowl floor point at shot frame L: decelerating slide (x = 1 - (1 - u)^2), then a damped side-to-side wobble. */
export const b04sh03Bowl = (L: number): V3 => {
  const [s0, s1] = SH03D.slide, [w0, w1] = SH03D.wobble, u = clamp01((L - s0) / (s1 - s0));
  const at = lerpV(BOWL_FROM, BOWL_AT, 1 - (1 - u) * (1 - u));
  if (L <= w0 || L >= w1) return at;
  const t = (L - w0) / (w1 - w0);
  return [at[0] - 0.006 * Math.sin(2 * Math.PI * t) * (1 - t), 0, at[2]];
};

/** Landing frame of kibble piece k (0..pieces-1), evenly over SH03D.land. */
export const kibbleLand = (k: number) => SH03D.land[0] + ((SH03D.land[1] - SH03D.land[0]) * k) / (SH03D.pieces - 1);

/** Kibble at shot frame L: the landed count and the pieces still falling (world point above their landing spot, speed m/s). */
export const b04sh03Kibble = (L: number) => {
  let landed = 0;
  const falling: {at: V3; v: number; k: number}[] = [];
  for (let k = 0; k < SH03D.pieces; k++) {
    const tau = (kibbleLand(k) - L) / 30; // seconds until it lands
    if (tau <= 0) { landed++; continue; }
    const o = kibbleSpot(k), drop = SH03D.v0 * tau + 4.9 * tau * tau, v = SH03D.v0 + 9.8 * tau;
    if (drop > 1.6) continue; // still in the hand, far above frame
    if (drop < 0.05) continue; // below the rim: hidden inside the bowl until it counts as landed
    falling.push({at: [BOWL_AT[0] + o[0], o[1] + drop, BOWL_AT[2] + o[2]], v, k});
  }
  return {landed, falling};
};

export const paintB04SH03 = (p: Painter, L: number) => {
  const c = b04sh03Cam(L), kib = b04sh03Kibble(L);
  return paintCorridor(p, c, {ajar: 0, swing: SIGN_REST, bowl: {at: b04sh03Bowl(L), kibble: kib.landed / 34}, falling: kib.falling});
};

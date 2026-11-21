import type {AnimalPose} from '../kit/animals';
import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {bandRamp, clamp01, easeInOut, paintPageP, paintPageShade} from './b02-page';

// EDU-EP32-SHORT B02-SH03 "ก็จริง…" the cat yawns (timed sheet EDU-EP32-SHEET-R1, G [500, 574), 74 f; storyboard R3 key hy 740; Boss G2,
// 2026-11-21). One plate EDU32-B02-SH03, Space D, paper: close on the diorama cat card (x1.6, front) on the seat between the two paper men, who are
// cropped at the frame edges and keep talking. The cat looks at the FOREIGN AGENT (screen left) on "ก็จริง" (L4), at the HANDLER (screen right) at
// L14, back to front, then yawns wide on "ไม่ทำงานให้ใคร" L36-L58 (mouth peak L44 = G544), eyes squeezed and ears back with the yawn; exit mouth
// closed, looking front (the state of the bridge's PA plate at F0 after the hard cut). Kit cat `catLook` / `yawn` (front view, opt-in, EDU-EP32).
// Shot-local frame L = round(tl * 30).

export const B02SH03_N = 74;
const DEG = Math.PI / 180;
/** Head turn keys [from, to] frames and the yawn's open / peak / close frames. */
export const B02SH03 = {lookL: [2, 6], lookR: [12, 17], lookFront: [28, 33], yawn: {open: 36, peak: 44, hold: 50, close: 58}} as const;
export const B02SH03_CAM0: YCam = {x: 0.1, y: 0.62, z: 1.25, yaw: -2 * DEG, pitch: 0, f: 950, hy: 740};
/** End key: the sheet's eye and lens with hy 740 -> 830 (Boss G2: at hy 740 the FOREIGN AGENT's head entered the mark clearance box x 100-260,
 *  y 110-180 from about L50 to L73, and still at hy 800 at L73 (box luma max 193 vs 49 empty); the lens shift moves the picture down 90 px by the
 *  cut, the cat stays above y 1200). */
export const B02SH03_CAM1: YCam = {x: 0.1, y: 0.62, z: 1.05, yaw: -2 * DEG, pitch: 0, f: 950, hy: 830};
export const b02sh03Cam = (L: number): YCam => mixYCam(B02SH03_CAM0, B02SH03_CAM1, easeInOut(L / (B02SH03_N - 1)));
/** Caption-band shade on the near lawn sheet in front of the bench: [picture row, opacity]. */
export const B02SH03_SHADE = {color: '#1c1820', steps: bandRamp(1110, 1320, 16, 18, 46)};

const seg = (L: number, [a, b]: readonly [number, number]) => easeInOut((L - a) / (b - a));
/** The paper cat's acting at L: head turn (-1 left .. +1 right), yawn 0..1, lids and ears that follow the yawn. */
export const b02sh03Cat = (L: number): Partial<AnimalPose> => {
  const S = B02SH03, Y = S.yawn;
  const look = -seg(L, S.lookL) + 2 * seg(L, S.lookR) - seg(L, S.lookFront);
  const yawn = L < Y.peak ? easeInOut((L - Y.open) / (Y.peak - Y.open)) : L < Y.hold ? 1 : 1 - easeInOut((L - Y.hold) / (Y.close - Y.hold));
  const pose: Partial<AnimalPose> = {view: 'front', state: 'sit', catLook: look};
  if (yawn > 0.02) Object.assign(pose, {yawn, lid: clamp01(yawn * 1.6), ears: 0.12 * yawn}); // ears only a little back: the ear-mic sits in the ear hollow
  return pose;
};

/** The B02-SH03 plate at shot frame L. */
export const paintB02SH03 = (p: Painter, L: number, id = 'B02-SH03') => {
  const c = b02sh03Cam(L), t = 4.0 + L / 30;
  paintPageP(p, c, id, t, {catPose: b02sh03Cat(L), hdTalk: true});
  paintPageShade(p, c, 37600, B02SH03_SHADE.color, B02SH03_SHADE.steps);
};

import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {clamp01} from './field-cat';
import {aimCam, paintOfficeG6} from './b05-set';
import {memoPt} from './office';
import {b05sh02Memo} from './b05-memo';

// EDU-EP32-SHORT B05-SH02 "ความสำเร็จทางวิทยาศาสตร์ที่น่าทึ่ง" (timed sheet EDU-EP32-SHEET-R1, G [1210, 1327), 117 f; VD32-12; Boss G6, 2026-11-21).
// One plate EDU32-B05-SH02 on the B05 office set. Close on the memo: after the redaction bar the real sentence types on (b05-memo.ts timing) and a
// red pencil underline lands on "น่าทึ่ง". Camera: a truck with eased ends L0 -> L110, then hold (sheet: "linear truck following the typing").
export const B05SH02_N = 117;
export const B05SH02 = {move: [0, 110], ramp: 14} as const;
/** G6 feasibility change (reported to Film): the sheet's eye (-0.2, 0.55, +0.9) pitch -35 grazes the page (type cap 14-16 px, and the sentence
 *  wraps over three lines, so a truck to +0.3 crops their left ends). Aimed at the typed block (lines 2-4, page-local x -0.85..+0.76, z about
 *  -0.45) from 1.6 m at pitch -60, f 950, hy 960, yaw +8 (square to the memo, so the wrapped lines read level): the block fits the width and the cap reads ~30 px; the truck runs from the block's right (where
 *  "This is" types) 0.2 m toward its centre as lines 3-4 type. */
export const CAM_B05_SH02_A: YCam = aimCam(memoPt(0.06, -0.46, 0.03), 1.6, 8, -60, 950, 960);
export const CAM_B05_SH02_B: YCam = aimCam(memoPt(-0.05, -0.43, 0.03), 1.6, 8, -60, 950, 960);
/** Constant speed between eased ramps of `r` frames at each end (trapezoid velocity), 0..1 over [s, e]. */
export const truck = (L: number, [s, e]: readonly [number, number], r: number) => {
  const n = e - s, t = Math.max(0, Math.min(n, L - s)), v = 1 / (n - r);
  if (t < r) return (v * t * t) / (2 * r);
  if (t > n - r) return 1 - (v * (n - t) * (n - t)) / (2 * r);
  return v * (t - r / 2);
};
export const b05sh02Cam = (L: number): YCam => mixYCam(CAM_B05_SH02_A, CAM_B05_SH02_B, clamp01(truck(L, B05SH02.move, B05SH02.ramp)));
export {b05sh02Memo};

export const paintB05SH02 = (p: Painter, L: number) => paintOfficeG6(p, b05sh02Cam(L));

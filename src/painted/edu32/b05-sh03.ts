import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {easeInOut} from './field-cat';
import {aimCam, paintOfficeG6} from './b05-set';
import {memoPt} from './office';
import {CAM_B05_SH02_B} from './b05-sh02';
import {B05SH03_STAMP, b05sh03Memo} from './b05-memo';

// EDU-EP32-SHORT B05-SH03 "แต่สรุปว่า… ใช้งานจริงไม่ได้" (timed sheet EDU-EP32-SHEET-R1, G [1327, 1411), 84 f; VD32-12; Boss G6, 2026-11-21).
// One plate EDU32-B05-SH03 on the B05 office set. Tilt down the memo to its last real line "…it would not be practical."; the stamp
// "WOULD NOT BE / PRACTICAL" slams onto the page at MEMO_STAMP L37-L41, impact L41 = G1368 (2 f before "ใช้งานจริงไม่ได้"). Camera eased L0 -> L40,
// hold; a 3 f jolt on the impact (pitch dips 0.35 deg and recovers), so the hit has weight on picture as well as on the thud.
export const B05SH03_N = 84;
const DEG = Math.PI / 180;
export const B05SH03 = {move: 40, jolt: 0.35} as const;
/** Starts on B05-SH02's end key (as the sheet: SH03 L0 = SH02 end) and tilts down to the last line and the stamp (G6 feasibility change from
 *  the sheet's grazing (+0.3, 0.5, +0.8) pitch -45, reported to Film): aimed between "not be practical." and the stamp at pitch -64 from 1.75 m, yaw +8. */
export const CAM_B05_SH03_A: YCam = CAM_B05_SH02_B;
export const CAM_B05_SH03_B: YCam = aimCam(memoPt(0.03, 0.15, 0.03), 1.75, 8, -64, 950, 900);
export const b05sh03Cam = (L: number): YCam => {
  const c = mixYCam(CAM_B05_SH03_A, CAM_B05_SH03_B, easeInOut(L / B05SH03.move));
  const k = L - B05SH03_STAMP.impact, jolt = k >= 0 && k < 3 ? [1, 0.5, 0.15][k] * B05SH03.jolt * DEG : 0;
  return {...c, pitch: (c.pitch ?? 0) - jolt};
};
export {b05sh03Memo};

export const paintB05SH03 = (p: Painter, L: number) => paintOfficeG6(p, b05sh03Cam(L));

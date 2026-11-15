import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {lookAtCam, sheetCam} from './palette';
import {cableAt} from './sea';

// EDU-EP17-SHORT W3 look-frame cameras (Film, 2026-11-15): the picks' cameras with the Q8 changes the user accepted (brief change log). Shared by
// looks.tsx (the stills) and measure.ts (pinhole lead numbers).

// LF01 SET-YARD17: T1A = the sheet end camera of B01-SH01 (OTS behind him, phone left, bay)
export const cLF01 = sheetCam([-0.30, 1.10, -0.55], 3, 1.95, 1.68, {f: 1000, hy: 640});
// LF01R B01-SH05 reverse: from his front-left beyond the wall, house behind. W3 change: longer lens from further back (sheet r 1.91 f 1000 ->
// r 4.2 f 2500, eye 1.85, pitch -8) so the wall reads as a calm band under him instead of a diagonal filling the frame
export const cLF01R = sheetCam([0.05, 1.2, 0], 124, 4.2, 1.85, {f: 2500, hy: 720, pitch: -8});
// LF02 SET-SEA17: T2B, mid-descent at the shelf edge
export const cLF02 = lookAtCam([1.6, -6.0, -96], cableAt(-140), 900, 560, -30, 0.2);
// LF04 bubble: T4B family, camera raised so his head sits above the caption band (head over 1176 is the LF04 band fix)
export const cLF04 = sheetCam([-0.1, 1.5, -3], 6, 4.1, 1.85, {f: 760, hy: 740});
// LF05 Red Sea: T5B broadside
export const cLF05 = sheetCam([-4, 6, 0], 12, 200, 3, {f: 1300, hy: 900});
// LF06 flashback seabed: T6A = the sheet camera of B05-SH02
export const cLF06 = sheetCam([0, 0.2, 0], 25, 6, 1.4, {f: 1000, hy: 820});
// LF07 cutaway: T7B end camera; the strip runs an 8 deg yaw arc and a 15 % pull-out about the same target (start closer, yawed back)
const T7_AT: V3 = [0.2, -2.6, 0], T7_POS: V3 = [4.6, 7.5, 11.5];
export const cutCam = (u: number): YCam => {
  const dx = T7_POS[0] - T7_AT[0], dy = T7_POS[1] - T7_AT[1], dz = T7_POS[2] - T7_AT[2];
  const r = Math.hypot(dx, dz), az = Math.atan2(dx, dz) - ((1 - u) * 8 * Math.PI) / 180, k = 1 / (1 + 0.15 * (1 - u)) ** 1;
  const ku = (1 / 1.15) + (1 - 1 / 1.15) * u; void k;
  return lookAtCam([T7_AT[0] + Math.sin(az) * r * ku, T7_AT[1] + dy * ku, T7_AT[2] + Math.cos(az) * r * ku], T7_AT, 1150, 560, -28);
};


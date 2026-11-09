import type {Painter} from '../kit/painter';
import {paintShaft, trackCam, yCarAt} from './shaft';

// SP2: CAM-SHAFT-TRACK at three drop speeds (f286 B02-SH01, f600 B03-SH02 end region, f790 B03-SH04 end). Yaw 0 (camera exactly in line); the
// parallax drift 0 -> 3 degrees (VD06) is a separate still pair ("SP2-F600-YAW").
export const SP2_FRAMES = {F286: 286, F600: 600, F790: 790} as const;
export const paintSP2 = (f: number, inside: 'crouch' | 'float', yaw = 0) => (p: Painter) => {
  const yc = yCarAt(f), cam = trackCam(yc, yaw);
  paintShaft(p, cam, yc, {streak: Math.min(1, (f - 100) / 700), inside, t: f / 30, roll: 160});
};
/** Closer variant (finding: the crouched WOMAN is 293 px at r 8.5): r 5.0, hy 770 puts the car floor at y 1160 and crops the roof, her lead 484 px. */
export const paintSP2Close = (f: number) => (p: Painter) => {
  const yc = yCarAt(f), cam = trackCam(yc, 0, 770, 5.0);
  paintShaft(p, cam, yc, {streak: Math.min(1, (f - 100) / 700), inside: 'crouch', t: f / 30});
};

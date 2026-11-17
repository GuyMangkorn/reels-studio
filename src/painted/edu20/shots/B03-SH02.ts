import {CAM, LOOK_BALLOON, LOOK_WINDOW, accelLean, accelU, camMove, ease, lookMix} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B03-SH02 · G704-845 (141 f) · L08 "แต่ถ้าตอนนี้รถยังวิ่งเร็วอยู่ ... ไปตลอดไหม?". Paired view, camera A -> D-R over local 0-140; same forward
// u +0.20 and rear-supported lean -0.07, neutral. Gaze to the window (scenery still flowing rearward) over local 15-36, back to the balloon
// over local 75-100; the body does not chase it. No pressure graphic.
const N = 141;
export const B03_SH02: CabinShotDef = {
  id: 'B03-SH02', N,
  cam: (L) => camMove(CAM.A, CAM.DR, L, 0, 140),
  state: (L, G) => ({lean: accelLean(G), u: accelU(G), face: 'neutral',
    faceState: {look: lookMix(lookMix(LOOK_BALLOON, LOOK_WINDOW, ease(L, 15, 36)), LOOK_BALLOON, ease(L, 75, 100))}}),
};
export const shot = makeShot(B03_SH02);

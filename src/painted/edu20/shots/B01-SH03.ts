import {CAM, LOOK_BALLOON, accelLean, accelU, camMove} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B01-SH03 · G187-352 (165 f) · L03 "พอรถเร่งไปข้างหน้า ... ใช่ไหม?". Close passenger, camera CLOSE0 -> CLOSE1 over local 0-164 (balloon kept
// beyond the right edge). Shoulder eases rearward to -0.07 over local 0-18 (accelLean, G187-205), held; confident gaze front/right.
// The balloon stays u 0 (accelU is 0 before G355): no false rearward result is animated.
const N = 165;
export const B01_SH03: CabinShotDef = {
  id: 'B01-SH03', N,
  cam: (L) => camMove(CAM.CLOSE0, CAM.CLOSE1, L, 0, 164),
  state: (_L, G) => ({lean: accelLean(G), u: accelU(G), face: 'neutral', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B01_SH03);

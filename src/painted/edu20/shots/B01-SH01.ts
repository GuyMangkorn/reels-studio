import {CAM, LOOK_BALLOON, LOOK_FRONT, accelLean, accelU, camMove, ease, lookMix} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B01-SH01 · G0-71 (71 f) · L01 "รถเร่ง... ลูกโป่งจะเอนไปทางไหน?" (EDU-EP20-SS-R3). Casting man-crop + hoodie, P31, neutral / right.
// Paired view, camera A -> D over local 0-70; balloon upright u 0, passenger neutral, eyes front -> balloon over local 12-24.
const N = 71;
export const B01_SH01: CabinShotDef = {
  id: 'B01-SH01', N,
  cam: (L) => camMove(CAM.A, CAM.D, L, 0, 70),
  state: (L, G) => ({lean: accelLean(G), u: accelU(G), face: 'neutral', faceState: {look: lookMix(LOOK_FRONT, LOOK_BALLOON, ease(L, 12, 24))}}),
};
export const shot = makeShot(B01_SH01);

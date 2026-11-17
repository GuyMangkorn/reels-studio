import {CAM, LOOK_BALLOON, accelLean, accelU, camMove} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B02-SH01 · G352-496 (144 f) · L04 "ผิด! มันกลับเอนไปข้างหน้า", L05 "แต่ไม่มีใครจับมันดัน แล้วอะไรดัน?". Paired view, camera A -> D-R over
// local 0-143. Local 0-3 keeps the guess beat (u 0); balloon u 0 -> +0.20 from local 3 (G355) to local 21 (G373), held. Passenger held
// rearward -0.07, surprised eyes open over local 8-20 (face switches at local 8), hands on lap.
const N = 144;
export const B02_SH01: CabinShotDef = {
  id: 'B02-SH01', N,
  cam: (L) => camMove(CAM.A, CAM.DR, L, 0, 143),
  state: (L, G) => ({lean: accelLean(G), u: accelU(G), face: L >= 8 ? 'surprised' : 'neutral', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B02_SH01);

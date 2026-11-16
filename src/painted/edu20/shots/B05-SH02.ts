import {CAM, LOOK_BALLOON, brakeLean, brakeU, camMove} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B05-SH02 · G1273-1332 (59 f) · L12 "ส่วนลูกโป่งกลับเอนไปท้ายรถ!". Paired view, camera A -> D over local 0-35, held to 58. Enters u 0; from
// local 1 (G1274) u eases 0 -> -0.20 through local 19 (G1292), held. Passenger forward +0.07, surprised, hands on lap.
const N = 59;
export const B05_SH02: CabinShotDef = {
  id: 'B05-SH02', N,
  cam: (L) => camMove(CAM.A, CAM.D, L, 0, 35),
  state: (_L, G) => ({lean: brakeLean(G), u: brakeU(G), face: 'surprised', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B05_SH02);

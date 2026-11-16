import {CAM, LOOK_BALLOON, accelLean, accelU, camMove} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B01-SH02 · G71-187 (116 f) · L02 "เอาลูกโป่งฮีเลียมที่ลอยได้ ผูกเชือกไว้กับพื้นรถ แล้วปิดกระจก". Low tether insert, camera LOW0 -> LOW1 over
// local 0-115, rising along the one neck/string/ring chain; u 0, passenger contextual and seated, hands on lap.
const N = 116;
export const B01_SH02: CabinShotDef = {
  id: 'B01-SH02', N,
  cam: (L) => camMove(CAM.LOW0, CAM.LOW1, L, 0, 115),
  state: (_L, G) => ({lean: accelLean(G), u: accelU(G), face: 'neutral', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B01_SH02);

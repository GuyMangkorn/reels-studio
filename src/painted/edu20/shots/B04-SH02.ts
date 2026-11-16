import {CAM, LOOK_BALLOON, camMove} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B04-SH02 · G995-1094 (99 f) · L10 "ตัวที่ทำให้เอน คือการเร่ง ไม่ใช่ความเร็ว". Paired view, camera A -> D over local 0-98; settled u 0,
// neutral P31; scenery keeps flowing at the steady rate. No arrow, oscillation or braking preview.
const N = 99;
export const B04_SH02: CabinShotDef = {
  id: 'B04-SH02', N,
  cam: (L) => camMove(CAM.A, CAM.D, L, 0, 98),
  state: () => ({lean: 0, u: 0, face: 'neutral', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B04_SH02);

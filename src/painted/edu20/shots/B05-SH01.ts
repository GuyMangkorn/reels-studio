import {CAM, LOOK_FRONT, brakeLean, brakeU, camMove, ease} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B05-SH01 · G1094-1273 (179 f) · L11 "ทีนี้ทายอีกรอบ ... คราวนี้คุณเอนไปหน้า...". Close passenger, camera CLOSE0 -> CLOSE1 over local 0-178
// (balloon beyond the right edge). Neutral until local 115; shoulder eases forward to +0.07 over local 115-149 (brakeLean, G1209-1243),
// held; expectant face (brows up from the lean). Balloon u 0 (brakeU is 0 before G1274): no rearward result here.
const N = 179;
export const B05_SH01: CabinShotDef = {
  id: 'B05-SH01', N,
  cam: (L) => camMove(CAM.CLOSE0, CAM.CLOSE1, L, 0, 178),
  state: (L, G) => ({lean: brakeLean(G), u: brakeU(G), face: 'neutral', faceState: {look: LOOK_FRONT, ...(ease(L, 115, 149) > 0.5 ? {brow: 'up' as const} : {})}}),
};
export const shot = makeShot(B05_SH01);

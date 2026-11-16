import {CAM, LOOK_BALLOON, accelLean, accelU, camMove} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B03-SH01 · G496-704 (208 f) · L06 "อากาศในรถไง", L07 "ตอนรถเร่ง แรงดันอากาศด้านหลัง ... ไปทางหน้ารถ". Paired view, camera A -> D-R over
// local 0-207; held u +0.20 and lean -0.07, surprised. The pressure inset (rear > front, arrow right) is the episode overlay from G520
// (src/videos/edu-ep20/chrome.tsx), screen space above the canvas.
const N = 208;
export const B03_SH01: CabinShotDef = {
  id: 'B03-SH01', N,
  cam: (L) => camMove(CAM.A, CAM.DR, L, 0, 207),
  state: (_L, G) => ({lean: accelLean(G), u: accelU(G), face: 'surprised', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B03_SH01);

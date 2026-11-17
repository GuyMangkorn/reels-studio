import {CAM, LOOK_BALLOON, accelLean, residualSwing} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B04-SH01 · G845-995 (150 f) · L09 "ลองวิ่งตรงด้วยความเร็วคงที่ รอให้ลูกโป่งหยุดแกว่ง มันกลับมาตั้งตรง". Camera A held for the whole shot
// (the unchanged anchor is the comparison). Two plates on one canvas: `shot` = the residual state (small diminishing swing u +0.20 ->
// +0.14 over local 0-69, lean -0.07); `settled` = u 0, neutral upright passenger. The timeline dissolves settled over residual at local
// 70-95 (G915-940) as the labelled story-time ellipsis (ภาพข้ามช่วงรอ, overlay G905-955): no snap, no countdown, no two solid balloons.
const N = 150;
export const B04_SH01: CabinShotDef = {
  id: 'B04-SH01', N,
  cam: () => CAM.A,
  state: (L, G) => ({lean: accelLean(G), u: residualSwing(L), face: 'neutral', faceState: {look: LOOK_BALLOON}}),
};
export const B04_SH01_SETTLED: CabinShotDef = {...B04_SH01, state: () => ({lean: 0, u: 0, face: 'neutral', faceState: {look: LOOK_BALLOON}})};
export const shot = makeShot(B04_SH01);
// The settled plate comes in as a picture crossfade (Boss, SS-R4 Draft round 1: mark-over-mark dissolve showed settled ink at G915 and
// washed the frame pale at G927; `PaintedShot.crossfade`).
export const settled = {...makeShot(B04_SH01_SETTLED, '-SETTLED'), crossfade: true};

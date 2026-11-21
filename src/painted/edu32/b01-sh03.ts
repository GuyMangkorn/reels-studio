import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {paintB01Band, paintB01Desk, paintHeroCat, smooth, type HeroAct} from './b01-set';
import {easeInOut} from './field-cat';
import {CAM_B01_KEY} from './office';

// EDU-EP32-SHORT B01-SH03 "the cat ignores us" (CL01 template; timed sheet EDU-EP32-SHEET-R1, G [229, 328), 99 f; VD32-24, VD32-28; Boss G1,
// 2026-11-21). One plate EDU32-B01-SH03 on page BP. The hero cat, profile facing -x: `sit` -> `new: cat-yawn` L9-L45 (widest L28) -> kit `lie-down`
// from sit into the loaf L52-L67 -> settled `lie` -> ear flick L68-L76 (kit `ears` pulsed to 0.5, the `new: ear-flick` stand-in). Camera: R3 start
// key held L0-L51, eased push L52-L77 to the unchanged end key `CAM_B01_KEY` (office.ts; the B06-SH02 mirror reference), held to the cut.

export const B01_SH03_N = 99;
const DEG = Math.PI / 180;
export const B01_SH03_CAM0: YCam = {x: 0.3, y: 0.6, z: 2.0, yaw: 0, pitch: -2 * DEG, f: 900, hy: 580};
export const B01_SH03 = {yawn: [9, 28, 45], lie: [52, 67], push: [52, 77], flick: [68, 76]} as const;
export const b01Sh03Cam = (L: number): YCam => mixYCam(B01_SH03_CAM0, CAM_B01_KEY, easeInOut((L - B01_SH03.push[0]) / (B01_SH03.push[1] - B01_SH03.push[0])));
export const b01Sh03Act = (L: number): HeroAct => {
  const [y0, y1, y2] = B01_SH03.yawn;
  const yawn = L <= y0 || L >= y2 ? 0 : L <= y1 ? smooth((L - y0) / (y1 - y0)) : 1 - smooth((L - y1) / (y2 - y1));
  if (L < B01_SH03.lie[0]) return {state: 'sit', yawn};
  const [f0, f1] = B01_SH03.flick, ears = L > f0 && L < f1 ? 0.5 * Math.sin((Math.PI * (L - f0)) / (f1 - f0)) : 0;
  return {state: 'lie', blend: Math.min(1, (L - B01_SH03.lie[0]) / (B01_SH03.lie[1] - B01_SH03.lie[0])), ears};
};

/** The B01-SH03 plate at shot frame L. */
export const paintB01SH03 = (p: Painter, L: number, id = 'B01-SH03') => {
  const c = b01Sh03Cam(L);
  paintB01Desk(p, c);
  paintB01Band(p, c);
  paintHeroCat(p, c, id, 7.7 + L / 30, b01Sh03Act(L));
};

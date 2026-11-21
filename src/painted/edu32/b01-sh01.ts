import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {blinkAt, paintB01Band, paintB01Desk, paintB01Near, paintHeroCat} from './b01-set';
import {easeInOut} from './field-cat';

// EDU-EP32-SHORT B01-SH01 "the hook glide to the wired paper cat" (timed sheet EDU-EP32-SHEET-R1, G [0, 81), 81 f; VD32-03, VD32-04, VD32-06,
// VD32-28; Boss G1, 2026-11-21). One plate EDU32-B01-SH01, Space D, page BP (b01-set.ts). Spy-movie glide low over the night desk to the blueprint
// in the lamp pool; frame 0 already shows the hero paper cat (hook proof). Near layer: the pencil passes screen-left and the stamp on its pad leaves
// screen-right (its set-plan spot (+3.0, 0, +1.8) is right of the lens path, so it cannot pass left at these keys). Cat static, blink at L40.
// Camera R3 keys (storyboard #r3-camera-keys), ease-in-out over L0-L80. Shot-local frame L = round(tl * 30).

export const B01_SH01_N = 81;
const DEG = Math.PI / 180;
export const B01_SH01_CAM0: YCam = {x: 3.8, y: 0.9, z: 3.6, yaw: -46 * DEG, pitch: -12 * DEG, f: 900, hy: 760};
export const B01_SH01_CAM1: YCam = {x: 1.3, y: 0.75, z: 1.7, yaw: -35 * DEG, pitch: -12 * DEG, f: 900, hy: 760};
export const b01Sh01Cam = (L: number): YCam => mixYCam(B01_SH01_CAM0, B01_SH01_CAM1, easeInOut(L / (B01_SH01_N - 1)));
export const B01_SH01_BLINK = 40;

/** The B01-SH01 plate at shot frame L. */
export const paintB01SH01 = (p: Painter, L: number, id = 'B01-SH01') => {
  const c = b01Sh01Cam(L), t = L / 30;
  paintB01Desk(p, c);
  paintB01Band(p, c);
  paintHeroCat(p, c, id, t, {state: 'sit', lid: blinkAt(L, B01_SH01_BLINK)});
  paintB01Near(p, c);
};

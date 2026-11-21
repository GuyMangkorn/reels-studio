import type {Painter} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {clamp01} from './field-cat';
import {aimCam, paintOfficeG6} from './b05-set';
import {memoPt} from './office';
import {MEMO_BLANK, type MemoState} from './b05-memo';

// EDU-EP32-SHORT B05-SH01 "back to the desk at full scale: the memo" (timed sheet EDU-EP32-SHEET-R1, G [1131, 1210), 79 f; VD32-12, VD32-23;
// Boss G6, 2026-11-21). One plate EDU32-B05-SH01, Space D real (b05-set.ts `paintOfficeG6`). One eased move from a seated person's view of the
// night office down into the lamp pool to the memo: eye (+2.6, 4.5, +9.0) yaw -14 pitch -20 hy 960 -> the end key `CAM_B05_SH01_B` (yaw +6 pitch -55, f 900, hy 900),
// L0 -> L76 with the first third slow (L26 covers 15 % of the path), arriving L76 and holding to the cut. Memo text: camera-mapped DOM in its
// blank state (subject, bars, pencil "3-67"; the sentence types on in B05-SH02, the last line shows from B05-SH03). Shot-local L = round(tl * 30).

export const B05SH01_N = 79;
const DEG = Math.PI / 180;
export const B05SH01 = {arrive: 76, ease: 2.5} as const;
export const CAM_B05_SH01_A: YCam = {x: 2.6, y: 4.5, z: 9.0, yaw: -14 * DEG, pitch: -20 * DEG, f: 900, hy: 960};
/** End key (G6 feasibility change, reported to Film): the sheet's (-0.2, 0.9, +1.9) pitch -30 grazes the page (subject cap 8-10 px, illegible at
 *  540); aimed at the memo between the subject and the body from 2.5 m at pitch -55 the subject cap reads ~28 px. Yaw +6 as the sheet. */
export const CAM_B05_SH01_B: YCam = aimCam(memoPt(0, -0.45, 0.03), 2.5, 6, -55, 900, 900);
/** Ease-in-out with a slow first third: u^k / (u^k + (1-u)^k), k 2.5 gives e(1/3) = 0.15 (the sheet's 15 % by L26). */
export const slowThird = (u: number, k: number = B05SH01.ease) => { const x = clamp01(u); return x ** k / (x ** k + (1 - x) ** k); };
export const b05sh01Cam = (L: number): YCam => mixYCam(CAM_B05_SH01_A, CAM_B05_SH01_B, slowThird(L / B05SH01.arrive));
export const b05sh01Memo = (_L: number): MemoState => MEMO_BLANK;

export const paintB05SH01 = (p: Painter, L: number) => paintOfficeG6(p, b05sh01Cam(L));

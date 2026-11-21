import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {mixYCam, type YCam} from '../kit/ycam';
import {clamp01, easeInOut} from './field-cat';
import {aimCam, paintOfficeG6} from './b05-set';
import {LAMP} from './desk';
import {MEMO} from './office';
import {MEMO_FINAL, type MemoState} from './b05-memo';

// EDU-EP32-SHORT B06-SH01 "the CIA page agrees" (timed sheet EDU-EP32-SHEET-R1, G [1411, 1583), 172 f; VD32-13; Boss G6, 2026-11-21).
// One plate EDU32-B06-SH01 on the B05 office set; the memo in its final state (typed, underlined, stamped). A white modern printout W (2.10 x 2.97,
// yaw -5 deg at rest) drops from above frame L0-L20 with a damped air drift (yaw and tilt within 4 deg), touches down at L20 and slides 0.06 m to
// rest by L24; it settles over the memo's upper part so the last line and the red stamp stay visible below its lower-right corner. The page is
// camera-mapped DOM (printout-text.tsx: generic browser frame, greeked lines, the two real SRC004 fragments) with two yellow highlighter sweeps:
// "…had a mind of its own…" L59-L89 and "…something all cat owners are quite familiar with…" L140-L161. Camera slow ease L0 -> L171.
export const B06SH01_N = 172;
const DEG = Math.PI / 180;
export const PRINTOUT = {w: 2.1, h: 2.97, yaw: -5 * DEG, at: [0.0, -1.6] as [number, number], y: MEMO.y + 0.008} as const;
export const B06SH01 = {fall: [0, 20], slide: [20, 24], drop: {h: 2.4, dx: -0.3, dz: -1.0, slide: 0.06}, drift: 4, hl1: [59, 89], hl2: [140, 161]} as const;
/** G6 feasibility change (reported to Film): the sheet's eye (+0.2, 0.8, +1.5) pitch -32 looks at the memo's near half and squeezes the printout
 *  into a 250 px band at the top (fragment cap under 10 px). Aimed between the fragments and the stamp at pitch -60, yaw -6 as the sheet, hy 640, a
 *  slow push from 1.72 to 1.6 m; the printout rests over the memo's upper part (subject and typed sentence covered), the last line and the stamp
 *  below its lower edge. */
export const CAM_B06_SH01_A: YCam = aimCam([0.11, 0.03, -0.32], 1.72, -6, -60, 900, 640);
export const CAM_B06_SH01_B: YCam = aimCam([0.12, 0.03, -0.3], 1.6, -6, -60, 900, 640);
export const b06sh01Cam = (L: number): YCam => mixYCam(CAM_B06_SH01_A, CAM_B06_SH01_B, easeInOut(L / (B06SH01_N - 1)));
export const b06sh01Memo = (_L: number): MemoState => MEMO_FINAL;

/** Printout pose at L: centre (world), height above the desk, yaw and the two small tilts (rad) of the air drift. */
export type PrintoutPose = {x: number; y: number; z: number; yaw: number; tiltX: number; tiltZ: number};
export const printoutPose = (L: number): PrintoutPose => {
  const [f0, f1] = B06SH01.fall, [s0, s1] = B06SH01.slide, D = B06SH01.drop, d = B06SH01.drift * DEG;
  const [rx, rz] = PRINTOUT.at;
  if (L >= f1) {
    const u = easeInOut((L - s0) / (s1 - s0));
    return {x: rx, y: PRINTOUT.y, z: rz - D.slide * (1 - u), yaw: PRINTOUT.yaw, tiltX: 0, tiltZ: 0};
  }
  const u = clamp01((L - f0) / (f1 - f0)), left = 1 - u;
  // air drag: a fast first drop, then a near-constant sink that still arrives with speed (the pat at L20); the drift damps as it falls
  return {
    x: rx + D.dx * left ** 1.3, y: PRINTOUT.y + D.h * left ** 1.5, z: rz - D.slide + D.dz * left ** 1.2,
    yaw: PRINTOUT.yaw + d * Math.sin(2.4 * Math.PI * u) * left, tiltX: 0.8 * d * Math.sin(2 * Math.PI * u + 0.7) * left, tiltZ: d * Math.sin(1.6 * Math.PI * u + 1.9) * left,
  };
};

/** World point of printout-local (x right, z down the page, from the centre) at pose `o`. */
export const printoutPt = (o: PrintoutPose, x: number, z: number): V3 => {
  // tilt about the page's local x axis (front edge up/down) then its local z axis (side up/down), then yaw
  const y1 = z * Math.sin(o.tiltX), z1 = z * Math.cos(o.tiltX);
  const y2 = y1 + x * Math.sin(o.tiltZ), x2 = x * Math.cos(o.tiltZ);
  const cs = Math.cos(o.yaw), sn = Math.sin(o.yaw);
  return [o.x + x2 * cs - z1 * sn, o.y + y2, o.z + z1 * cs + x2 * sn];
};
export const printoutCorners = (o: PrintoutPose): V3[] => {
  const W = PRINTOUT.w / 2, H = PRINTOUT.h / 2;
  return [printoutPt(o, -W, -H), printoutPt(o, W, -H), printoutPt(o, W, H), printoutPt(o, -W, H)];
};
/** The printout's shadow on the memo/desk plane: each corner projected from the lamp; `lift` = mean height above the paper (model m). */
export const printoutShadow = (o: PrintoutPose): {pts: V3[]; lift: number} => {
  const y0 = MEMO.y + 0.004, pts = printoutCorners(o).map(([x, y, z]): V3 => {
    const k = (LAMP[1] - y0) / Math.max(0.01, LAMP[1] - y);
    return [LAMP[0] + (x - LAMP[0]) * k, y0, LAMP[2] + (z - LAMP[2]) * k];
  });
  return {pts, lift: Math.max(0, o.y - PRINTOUT.y)};
};

export const paintB06SH01 = (p: Painter, L: number) => paintOfficeG6(p, b06sh01Cam(L));

/** Highlighter progress 0..1 per fragment at L (inclusive windows: the sweep completes on the window's last frame). */
export const b06sh01Highlights = (L: number) => {
  const sweep = ([s, e]: readonly [number, number]) => clamp01((L - s + 1) / (e - s + 1));
  return {hl1: sweep(B06SH01.hl1), hl2: sweep(B06SH01.hl2)};
};

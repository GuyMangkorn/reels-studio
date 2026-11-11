// EDU-EP15-SHORT clocks (storyboard EDU-EP15-ROWS-R2.3, 30 fps, 1793 f). Pure functions of the shot-local frame `L` (= global f - shot start); no state, no random,
// so every shot is direct-seekable. Ambient clocks (fan, moth, breath) read the global frame `g`.
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {lookCam} from './palette';

export const FPS = 30;
export const TOTAL_FRAMES = 1793;
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 140], ['S01-B01-SH02', 140, 64], ['S01-B01-SH03', 204, 73], ['S01-B01-SH04', 277, 40],
  ['S01-B02-SH01', 317, 97], ['S01-B02-SH02', 414, 108],
  ['S01-B03-SH01', 522, 162], ['S01-B03-SH02', 684, 91], ['S01-B03-SH03', 775, 62], ['S01-B03-SH04', 837, 91], ['S01-B03-SH05', 928, 81], ['S01-B03-SH06', 1009, 146], ['S01-B03-SH07', 1155, 61],
  ['S01-B04-SH01', 1216, 77], ['S01-B04-SH02', 1293, 83], ['S01-B04-SH03', 1376, 78],
  ['S01-B05-SH01', 1454, 36], ['S01-B05-SH02', 1490, 60], ['S01-B05-SH03', 1550, 38], ['S01-B05-SH04', 1588, 205],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotStart = (id: ShotId) => SHOT_TABLE.find(([i]) => i === id)![1];

export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const smooth = (u: number) => u * u * (3 - 2 * u);
/** Smoothstep (ease in-out) of `L` between frames a and b. */
export const sm = (a: number, b: number, L: number) => smooth(clamp01((L - a) / (b - a)));
/** Linear 0..1 between frames a and b. */
export const lin = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));
/** Ease-out (fast start) 0..1 between a and b. */
export const eo = (a: number, b: number, L: number) => { const k = 1 - lin(a, b, L); return 1 - k * k * k; };
export const mix = (a: number, b: number, e: number) => a + (b - a) * e;

/** A camera key in the brief's terms: position, look-at, focal length, horizon line. */
export type CamKey = {pos: V3; at: V3; f: number; hy?: number; near?: number};
const mv = (a: V3, b: V3, e: number): V3 => [mix(a[0], b[0], e), mix(a[1], b[1], e), mix(a[2], b[2], e)];
/** Camera between two keys at eased `e` 0..1; `arc` bows the path (metres, added to the position by sin(pi e)). */
export const camBetween = (a: CamKey, b: CamKey, e: number, arc: V3 = [0, 0, 0]): YCam => {
  const s = Math.sin(Math.PI * e), p = mv(a.pos, b.pos, e);
  return lookCam([p[0] + arc[0] * s, p[1] + arc[1] * s, p[2] + arc[2] * s], mv(a.at, b.at, e), mix(a.f, b.f, e), {hy: mix(a.hy ?? 960, b.hy ?? 960, e), near: b.near !== undefined ? mix(a.near ?? b.near, b.near, e) : a.near});
};
export const camKey = (k: CamKey): YCam => lookCam(k.pos, k.at, k.f, {hy: k.hy, near: k.near});

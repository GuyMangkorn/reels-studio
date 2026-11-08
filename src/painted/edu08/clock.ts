import type {V3} from '../kit/space';
import {ringStory} from '../kit/timer-ring';

// EDU-EP08-SHORT clocks (scene sheets EDU-EP08-SHEETS-R2 (atempo 0.95) "Placement", "Story clock", "Helmet path"). Pure functions of the composition frame G or of the
// shot-local frame L = G - start; ranges are half-open [start, end). Integer frames from scripts/edu-series/ep08/timeline.json (W4 voice lock re-measured at tempo 0.95).
export const FPS = 30;
export const SHOT_RANGES = [
  ['S01-B01-SH01', 0, 55], ['S01-B01-SH02', 55, 101], ['S01-B01-SH03', 101, 233], ['S01-B01-SH04', 233, 272], ['S01-B01-SH05', 272, 293],
  ['S01-B02-SH01', 293, 371], ['S01-B02-SH02', 371, 416], ['S01-B02-SH03', 416, 503],
  ['S01-B03-SH01', 503, 610], ['S01-B03-SH02', 610, 728], ['S01-B03-SH03', 728, 907], ['S01-B03-SH04', 907, 1047], ['S01-B03-SH05', 1047, 1127],
  ['S01-B04-SH01', 1127, 1206], ['S01-B04-SH02', 1206, 1340], ['S01-B04-SH03', 1340, 1412],
  ['S01-B05-SH01', 1412, 1453], ['S01-B05-SH02', 1453, 1511], ['S01-B05-SH03', 1511, 1610], ['S01-B05-SH04', 1610, 1679], ['S01-B05-SH05', 1679, 1745],
] as const;
export type ShotId = (typeof SHOT_RANGES)[number][0];
export const TOTAL = 1745;
export const startOf = (id: ShotId): number => SHOT_RANGES.find(([k]) => k === id)![1];
export const lenOf = (id: ShotId): number => { const r = SHOT_RANGES.find(([k]) => k === id)!; return r[2] - r[1]; };

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const ramp = (x: number, a: number, b: number): number => clamp01((x - a) / (b - a));
/** Cosine-free smoothstep over [a, b]. */
export const ease = (x: number, a: number, b: number): number => { const u = ramp(x, a, b); return u * u * (3 - 2 * u); };
export const mix = (a: number, b: number, k: number): number => a + (b - a) * k;
/** Piecewise-linear value through (x, y) knots, held outside. */
export const pw = (x: number, k: readonly (readonly [number, number])[]): number => {
  if (x <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (x <= k[i][0]) return mix(k[i - 1][1], k[i][1], (x - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};

// ---- helmet path (SET-ORBIT, built metres)
export const HELMET_HEAD: V3 = [0.0, 1.66, 0.55];            // on the head: AST head + 0.02
const H0: V3 = [0.0, 1.71, 0.55], HC: V3 = [0.09, 2.30, 0.73]; // L0 and the clear frame L40 (G95) of S01-B01-SH02 (R1: L38); SHEETS-R2.1 +0.11 m (R2 y 2.19)
export const HELMET_L46: V3 = [0.104, 2.376, 0.758]; // SHEETS-R2.1 +0.11 m (R2 y 2.266)
const lerp3 = (a: V3, b: V3, k: number): V3 => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
/** S01-B01-SH02 shot-local L (0..46): linear to the clear point at L40 (G95), then linear to HELMET_L46 at L46. */
export const helmetSH02 = (L: number): V3 => (L <= 40 ? lerp3(H0, HC, L / 40) : lerp3(HC, HELMET_L46, (L - 40) / 6));
/** From G101 on: linear drift (0.12, 0.38, 0.14) m/s, spin 18 deg/s (it never returns). */
export const helmetAt = (G: number): V3 => { const s = (G - 101) / 30; return [HELMET_L46[0] + 0.12 * s, HELMET_L46[1] + 0.38 * s, HELMET_L46[2] + 0.14 * s]; };
export const helmetSpin = (G: number): number => (G < 101 ? 25 * Math.max(0, G - 55) / 46 : 25 + 18 * (G - 101) / 30);

// ---- timer ring (story seconds), per shot: linear over the shot frames; `null` = hidden
export type RingSpec = {from: number; to: number; frames?: number; paused?: boolean} | null;
const live = (from: number, to: number): RingSpec => ({from, to});
export const RING_SPEC: Record<ShotId, RingSpec> = {
  'S01-B01-SH01': null, 'S01-B01-SH02': live(0, 0), 'S01-B01-SH03': live(0, 1), 'S01-B01-SH04': live(1, 1.2), 'S01-B01-SH05': live(1.2, 1.4),
  'S01-B02-SH01': live(1.4, 2.0), 'S01-B02-SH02': live(2.0, 2.3), 'S01-B02-SH03': live(2.3, 2.9),
  'S01-B03-SH01': live(2.9, 3.7), 'S01-B03-SH02': live(3.7, 4.3), 'S01-B03-SH03': {from: 4.3, to: 4.3, paused: true}, 'S01-B03-SH04': {from: 4.3, to: 4.3, paused: true},
  'S01-B03-SH05': {from: 4.3, to: 4.3, paused: true},
  'S01-B04-SH01': live(4.3, 5.4), 'S01-B04-SH02': live(5.4, 6.6), 'S01-B04-SH03': live(6.6, 7.5),
  'S01-B05-SH01': live(7.5, 8.1), 'S01-B05-SH02': {from: 8.1, to: 9.0, frames: 43}, 'S01-B05-SH03': null, 'S01-B05-SH04': null, 'S01-B05-SH05': null,
};
/** Ring value at shot-local L of shot `id`. */
export const ringAt = (id: ShotId, L: number): number => {
  const s = RING_SPEC[id]!, n = s.frames ?? lenOf(id);
  return ringStory(L / FPS, {from: s.from, to: s.to, dur: n / FPS});
};
/** Frames (G) on which the story clock first reaches an integer (the tick SFX), from the table; used by the sound mixer and the QA check. */
export const TICK_G = [233, 371, 517, 669, 1178, 1273, 1372, 1447, 1496] as const;

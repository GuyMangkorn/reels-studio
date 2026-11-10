// EDU-EP16-SHORT clocks (W5.3 Draft, Editor): the shot table of EDU-EP16-ROWS-R2.0 (scripts/edu-series/ep16/storyboard.md "Shot map"), 30 fps, 1632 f (54.40 s).
// A shot is a pure function of the shot-local frame L = global f - start.
export const FPS = 30;
export const TOTAL_FRAMES = 1632;
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 80], ['S01-B01-SH02', 80, 70], ['S01-B01-SH03', 150, 85], ['S01-B01-SH04', 235, 43], ['S01-B01-SH05', 278, 61], ['S01-B01-SH06', 339, 69], ['S01-B01-SH07', 408, 40],
  ['S01-B02-SH01', 448, 60], ['S01-B02-SH02', 508, 38], ['S01-B02-SH03', 546, 66], ['S01-B03-SH01', 612, 76], ['S01-B03-SH02', 688, 45], ['S01-B03-SH03', 733, 105],
  ['S01-B04-SH01', 838, 90], ['S01-B04-SH02', 928, 61], ['S01-B04-SH03', 989, 61], ['S01-B05-SH01', 1050, 98], ['S01-B05-SH02', 1148, 102], ['S01-B05-SH03', 1250, 144], ['S01-B05-SH04', 1394, 238],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotAt = (f: number): {id: ShotId; L: number; len: number; start: number; no: number} | undefined => {
  const i = SHOT_TABLE.findIndex(([, a, n]) => f >= a && f < a + n);
  return i < 0 ? undefined : {id: SHOT_TABLE[i][0], L: f - SHOT_TABLE[i][1], len: SHOT_TABLE[i][2], start: SHOT_TABLE[i][1], no: i + 1};
};
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const smooth = (u: number) => u * u * (3 - 2 * u);
/** Smoothstep of `L` between frames a and b. */
export const sm = (a: number, b: number, L: number) => smooth(clamp01((L - a) / (b - a)));
/** Linear 0..1 between frames a and b. */
export const lin = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

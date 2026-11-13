// EDU-EP17-SHORT clocks (W5.3 Draft, Editor): the shot map of EDU-EP17-ROWS-R2.4 (scripts/edu-series/ep17/storyboard.md "Shot map"), 30 fps, 1561 f (52.03 s), one scene S01, hard cuts.
// A shot is a pure function of the shot-local frame L = global f - start.
export const FPS = 30;
export const TOTAL_FRAMES = 1561;
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 69], ['S01-B01-SH02', 69, 43], ['S01-B01-SH03', 112, 78], ['S01-B01-SH04', 190, 67], ['S01-B01-SH05', 257, 55],
  ['S01-B02-SH01', 312, 85], ['S01-B02-SH02', 397, 80], ['S01-B02-SH03', 477, 82],
  ['S01-B03-SH01', 559, 55], ['S01-B03-SH02', 614, 41], ['S01-B03-SH03', 655, 45], ['S01-B03-SH04', 700, 36], ['S01-B03-SH05', 736, 93], ['S01-B03-SH06', 829, 90], ['S01-B03-SH07', 919, 87],
  ['S01-B04-SH01', 1006, 48], ['S01-B04-SH02', 1054, 47], ['S01-B04-SH03', 1101, 53], ['S01-B04-SH04', 1154, 46], ['S01-B04-SH05', 1200, 59], ['S01-B04-SH06', 1259, 83],
  ['S01-B05-SH01', 1342, 219],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotAt = (f: number): {id: ShotId; L: number; len: number; start: number; no: number} | undefined => {
  const i = SHOT_TABLE.findIndex(([, a, n]) => f >= a && f < a + n);
  return i < 0 ? undefined : {id: SHOT_TABLE[i][0], L: f - SHOT_TABLE[i][1], len: SHOT_TABLE[i][2], start: SHOT_TABLE[i][1], no: i + 1};
};
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
/** Linear 0..1 between frames a and b. */
export const lin = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));

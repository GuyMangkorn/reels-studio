// EDU-EP09-SHORT clocks (scene sheets EDU-EP09-SHEETS-R2 "Shot map"): composition frame G, shot-local L = G - start, ranges half-open [start, end). 18 shots, 1606 f at 30 fps (53.53 s).
export const FPS = 30;
export const SHOT_RANGES = [
  ['S01-B01-SH01', 0, 155], ['S01-B01-SH02', 155, 203], ['S01-B01-SH03', 203, 283], ['S01-B01-SH04', 283, 351],
  ['S01-B02-SH01', 351, 440], ['S01-B02-SH02', 440, 511], ['S01-B02-SH03', 511, 622],
  ['S01-B03-SH01', 622, 727], ['S01-B03-SH07', 727, 768], ['S01-B03-SH02', 768, 859], ['S01-B03-SH08', 859, 905], ['S01-B03-SH03', 905, 1043],
  ['S01-B03-SH09', 1043, 1080], ['S01-B03-SH04', 1080, 1214], ['S01-B04-SH01', 1214, 1355],
  ['S01-B05-SH01', 1355, 1415], ['S01-B05-SH02', 1415, 1531], ['S01-B05-SH03', 1531, 1606],
] as const;
export type ShotId = (typeof SHOT_RANGES)[number][0];
export const TOTAL = 1606;
export const startOf = (id: ShotId): number => SHOT_RANGES.find(([k]) => k === id)![1];
export const lenOf = (id: ShotId): number => { const r = SHOT_RANGES.find(([k]) => k === id)!; return r[2] - r[1]; };

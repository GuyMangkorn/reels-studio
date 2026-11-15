// EDU-EP17-SHORT shot clock (scene sheets EDU-EP17-SHEETS-R1.2 v2 retime, 1709 f; Boss W5, R1.2 retime). G = composition frame, L = G - shot start, half-open ranges.
// Every value below is a pure function of L (seek-safe).

export const FPS = 30;
/** [shot id (review rows, `S01-` prefix), start G, length]. */
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 102], ['S01-B01-SH02', 102, 30], ['S01-B01-SH03', 132, 32], ['S01-B01-SH04', 164, 65], ['S01-B01-SH05', 229, 59],
  ['S01-B02-SH01', 288, 65], ['S01-B02-SH02', 353, 27], ['S01-B02-SH03', 380, 161],
  ['S01-B03-SH01', 541, 66], ['S01-B03-SH02', 607, 53], ['S01-B03-SH03', 660, 42],
  ['S01-B04-SH01', 702, 27], ['S01-B04-SH02', 729, 124], ['S01-B04-SH03', 853, 28], ['S01-B04-SH04', 881, 112], ['S01-B04-SH05', 993, 71],
  ['S01-B05-SH01', 1064, 98], ['S01-B05-SH02', 1162, 45], ['S01-B05-SH03', 1207, 45], ['S01-B05-SH04', 1252, 112], ['S01-B05-SH05', 1364, 24],
  ['S01-B06-SH01', 1388, 103], ['S01-B06-SH02', 1491, 88], ['S01-B06-SH03', 1579, 39], ['S01-B06-SH04', 1618, 91],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
const row = (id: ShotId) => SHOT_TABLE.find((r) => r[0] === id)!;
export const startOf = (id: ShotId) => row(id)[1];
export const lenOf = (id: ShotId) => row(id)[2];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Linear 0..1 over [a, b]. */
export const lin = (L: number, a: number, b: number) => clamp01((L - a) / (b - a));
/** easeInOutSine over [a, b] (the sheet's default move ease). */
export const sine = (L: number, a: number, b: number) => 0.5 - 0.5 * Math.cos(Math.PI * lin(L, a, b));
/** easeOutCubic over [a, b] (the sheet's arrivals). */
export const outCubic = (L: number, a: number, b: number) => 1 - (1 - lin(L, a, b)) ** 3;
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;
export const mix3 = (a: readonly number[], b: readonly number[], u: number): [number, number, number] => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];

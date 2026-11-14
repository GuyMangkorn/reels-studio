// EDU-EP16-SHORT clocks (storyboard EDU-EP16-SHEET-R1.1, 30 fps, 2100 f = 70.00 s (EDU-EP16-SHEET-R1.5b: 26 shots, play order 15 -> 16A -> 16B -> 16C -> 16D -> 16 -> 17)). Shot start frames are global composition frames; `L` is the shot-local frame.
export const FPS = 30;
export const TOTAL_FRAMES = 2100;
/** [shot id, start, length] tiling [0, 1839). */
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 92], ['S01-B01-SH02', 92, 125],
  ['S01-B02-SH03', 217, 69], ['S01-B02-SH04', 286, 91], ['S01-B02-SH05', 377, 66],
  ['S01-B03-SH06', 443, 74], ['S01-B03-SH07', 517, 120], ['S01-B03-SH08', 637, 144], ['S01-B03-SH09', 781, 62], ['S01-B03-SH10', 843, 86],
  ['S01-B04-SH11', 929, 95], ['S01-B04-SH12', 1024, 102], ['S01-B04-SH13', 1126, 76], ['S01-B04-SH14', 1202, 81], ['S01-B04-SH15', 1283, 67],
  ['S01-B05-SH16A', 1350, 40], ['S01-B05-SH16B', 1390, 22], ['S01-B05-SH16C', 1412, 48], ['S01-B05-SH16D', 1460, 44], ['S01-B05-SH16', 1504, 120],
  ['S01-B05-SH17', 1624, 129],
  ['S01-B06-SH18', 1753, 36], ['S01-B06-SH19', 1789, 29], ['S01-B06-SH20', 1818, 56], ['S01-B06-SH21', 1874, 55], ['S01-B06-SH22', 1929, 171],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotIndex = (id: string) => SHOT_TABLE.findIndex(([i]) => i === id) + 1;
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const smooth = (u: number) => u * u * (3 - 2 * u);
/** Smoothstep 0..1 of `L` between frames a and b. */
export const sm = (a: number, b: number, L: number) => smooth(clamp01((L - a) / (b - a)));
export const lin = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));
export const mix = (a: number, b: number, e: number) => a + (b - a) * e;
export const mix3 = (a: [number, number, number], b: [number, number, number], e: number): [number, number, number] => [mix(a[0], b[0], e), mix(a[1], b[1], e), mix(a[2], b[2], e)];
let sum = 0;
for (const [id, start, len] of SHOT_TABLE) { if (start !== sum) throw new Error(`EDU-EP16 clock: ${id} starts at ${start}, the previous shot ends at ${sum}`); sum += len; }
if (sum !== TOTAL_FRAMES) throw new Error(`EDU-EP16 clock: shots sum to ${sum}, the sheet says ${TOTAL_FRAMES}`);

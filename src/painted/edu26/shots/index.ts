// EDU-EP26-SHORT shot index (Boss W5.2, 2026-11-18) from the timed scene sheets EDU-EP26-SHEET-R1 (timed-sheet-a.md shot map + timed-sheet-b.md;
// 1894 f = 63.13 s at 30 fps, one story scene S01 at offset 0). For the Editor's timeline: one painted plate per shot, registry ID `EDU26-<shot id>`
// (src/painted/shots/edu26.tsx lists the shot files), placed at composition frame `start` for `len` frames. `pre` frames of pre-roll run before
// `start` under an in-canvas dissolve: B04-SH01's cue sits at G1037 = start - 5 with `dissolveSec` 10/30 (the time-passing dissolve
// G [1037, 1047)); the plate's own clock is shifted so the sheet's L0 stays G1042. B03-SH06 holds its last frame under the dissolve (frames
// past `len` clamp). Every other cut is a hard cut (B05-SH01 -> B06-SH01 is the coin push / coin flip drawn inside the two plates). `keys` are
// the shot-local frames Boss checks as stills (start, sheet acceptance frames, end). Timing only: imports no shot file (per-shot render cache).

export const FPS = 30;
export const DURATION = 1894;
export type ShotRow = {id: string; start: number; len: number; pre?: number; keys: number[]};

export const EDU26_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH04', start: 0, len: 140, keys: [0, 78, 139]},
  {id: 'B01-SH05', start: 140, len: 102, keys: [0, 7, 61, 101]},
  {id: 'B01-SH06', start: 242, len: 118, keys: [0, 20, 76, 117]},
  {id: 'B02-SH01', start: 360, len: 63, keys: [0, 32, 62]},
  {id: 'B02-SH02', start: 423, len: 93, keys: [0, 15, 32, 52, 92]},
  {id: 'B02-SH04', start: 516, len: 104, keys: [0, 6, 34, 103]},
  {id: 'B02-SH03', start: 620, len: 75, keys: [0, 20, 47, 74]},
  {id: 'B02-SH05', start: 695, len: 72, keys: [0, 48, 54, 60, 71]},
  {id: 'B03-SH04', start: 767, len: 83, keys: [0, 34, 35, 64, 82]},
  {id: 'B03-SH02', start: 850, len: 76, keys: [0, 18, 75]},
  {id: 'B03-SH06', start: 926, len: 116, keys: [0, 40, 110, 115]},
  {id: 'B04-SH01', start: 1042, len: 83, pre: 5, keys: [0, 14, 34, 40, 46, 60, 82]},
  {id: 'B04-SH03', start: 1125, len: 62, keys: [0, 22, 34, 61]},
  {id: 'B04-SH05', start: 1187, len: 80, keys: [0, 10, 28, 34, 79]},
  {id: 'B05-SH01', start: 1267, len: 179, keys: [0, 22, 76, 90, 120, 144, 161, 170, 178]},
  {id: 'B06-SH01', start: 1446, len: 104, keys: [0, 4, 9, 14, 20, 70, 103]},
  {id: 'B06-SH02', start: 1550, len: 98, keys: [0, 16, 22, 40, 79, 97]},
  {id: 'B06-SH03', start: 1648, len: 105, keys: [0, 10, 78, 82, 100, 104]},
  {id: 'B06-SH04', start: 1753, len: 47, keys: [0, 12, 46]},
  {id: 'B06-SH05', start: 1800, len: 94, keys: [0, 14, 22, 26, 30, 34, 60, 93]},
];

export const plateId = (id: string) => `EDU26-${id}`;
export const rowOf = (id: string): ShotRow => {
  const r = EDU26_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU26: unknown shot ${id}`);
  return r;
};
export const lenOf = (id: string) => rowOf(id).len;
/** The shot and its local frame at composition frame G (direct seek: no state carried between frames). */
export const shotAt = (G: number): {row: ShotRow; L: number} => {
  const row = EDU26_SHOTS.find((s) => G >= s.start && G < s.start + s.len) ?? EDU26_SHOTS[EDU26_SHOTS.length - 1];
  return {row, L: Math.max(0, Math.min(row.len - 1, G - row.start))};
};

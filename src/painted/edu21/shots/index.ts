// EDU-EP21-SHORT shot index (Boss W5.2, 2026-11-16) from the timed scene sheets EDU-EP21-SHEETS-R1 (1320 f = 44.00 s, 30 fps, contiguous,
// hard cuts). For the Editor's timeline: one painted plate per shot, registry ID `EDU21-<shot id>` (src/painted/shots/edu21.tsx lists the shot
// files), placed at composition frame `start` for `len` frames. `keys` are the shot-local frames Boss checks as stills (start, events, end).
// Timing only: this file imports no shot file, so the one-shot-one-file render cache stays per shot (scripts/render-inputs.ts). All 13 rows
// are filled from the sheet's shot map so the BG2-BG4 groups add only their shot files; every row's `keys` are now set (BG1 SH01-SH03,
// BG2 SH04, SH05, SH09, SH12, BG3 SH06, SH10, SH13 and BG4 SH07, SH08, SH11).

export const FPS = 30;
export const DURATION = 1320;
export type ShotRow = {id: string; start: number; len: number; keys: number[]};

export const EDU21_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH01', start: 0, len: 29, keys: [0, 7, 12, 13, 14, 16, 20, 28]},
  {id: 'B01-SH02', start: 29, len: 71, keys: [0, 8, 24, 40, 54, 66, 70]},
  {id: 'B01-SH03', start: 100, len: 123, keys: [0, 20, 56, 60, 74, 95, 122]},
  {id: 'B01-SH04', start: 223, len: 92, keys: [0, 30, 67, 70, 76, 80, 91]},
  {id: 'B02-SH05', start: 315, len: 93, keys: [0, 5, 9, 15, 20, 30, 34, 45, 50, 60, 92]},
  {id: 'B02-SH06', start: 408, len: 140, keys: [0, 6, 12, 28, 44, 62, 74, 81, 109, 115, 139]},
  {id: 'B03-SH07', start: 548, len: 88, keys: [0, 4, 10, 14, 18, 30, 44, 47, 50, 60, 64, 70, 74, 82, 87]},
  {id: 'B03-SH08', start: 636, len: 129, keys: [0, 10, 20, 40, 44, 60, 74, 100, 128]},
  {id: 'B04-SH09', start: 765, len: 57, keys: [0, 5, 9, 20, 28, 29, 32, 34, 35, 36, 39, 40, 48, 56]},
  {id: 'B04-SH10', start: 822, len: 108, keys: [0, 10, 18, 27, 30, 51, 60, 61, 63, 67, 69, 78, 90, 102, 107]},
  {id: 'B05-SH11', start: 930, len: 81, keys: [0, 29, 30, 31, 40, 60, 80]},
  {id: 'B05-SH12', start: 1011, len: 94, keys: [0, 40, 43, 46, 47, 70, 93]},
  {id: 'B05-SH13', start: 1105, len: 215, keys: [0, 5, 40, 73, 76, 90, 110, 125, 135, 170, 214]},
];

export const plateId = (id: string) => `EDU21-${id}`;
export const rowOf = (id: string): ShotRow => {
  const r = EDU21_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU21: unknown shot ${id}`);
  return r;
};
export const startOf = (id: string) => rowOf(id).start;
export const lenOf = (id: string) => rowOf(id).len;
/** The shot and its local frame at composition frame G (direct seek: no state carried between frames). */
export const shotAt = (G: number): {row: ShotRow; L: number} => {
  const row = EDU21_SHOTS.find((s) => G >= s.start && G < s.start + s.len) ?? EDU21_SHOTS[EDU21_SHOTS.length - 1];
  return {row, L: Math.max(0, Math.min(row.len - 1, G - row.start))};
};

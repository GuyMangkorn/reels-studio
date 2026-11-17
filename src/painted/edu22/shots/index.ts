// EDU-EP22-SHORT shot index (Boss W5.1, 2026-11-16) from the timed scene sheets EDU-EP22-SCENES-R1 (1717 f = 57.24 s, 30 fps, contiguous, one
// story scene S01 at offset 0, every cut a hard cut). For the Editor's timeline: one painted plate per shot, registry ID `EDU22-<shot id>`
// (src/painted/shots/edu22.tsx lists the shot files), placed at composition frame `start` for `len` frames. `keys` are the shot-local frames Boss
// checks as stills (start, events, end). This file holds timing only: it imports no shot file, so the one-shot-one-file render cache stays per
// shot (scripts/render-inputs.ts).

export const FPS = 30;
export const DURATION = 1717;
export type ShotRow = {id: string; start: number; len: number; keys: number[]};

export const EDU22_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH01', start: 0, len: 37, keys: [0, 18, 36]},
  {id: 'B01-SH02', start: 37, len: 103, keys: [0, 10, 52, 66, 81, 102]},
  {id: 'B01-SH03', start: 140, len: 104, keys: [0, 30, 46, 96, 103]},
  {id: 'B02-SH04', start: 244, len: 30, keys: [0, 10, 22, 29]},
  {id: 'B02-SH05', start: 274, len: 126, keys: [0, 40, 64, 92, 106, 125]},
  {id: 'B02-SH06', start: 400, len: 56, keys: [0, 15, 28, 55]},
  {id: 'B03-SH07', start: 456, len: 106, keys: [0, 20, 46, 65, 84, 105]},
  {id: 'B03-SH08', start: 562, len: 112, keys: [0, 12, 26, 40, 111]},
  {id: 'B03-SH09', start: 674, len: 66, keys: [0, 15, 24, 40, 50, 65]},
  {id: 'B03-SH10', start: 740, len: 60, keys: [0, 30, 46, 59]},
  {id: 'B03-SH11', start: 800, len: 46, keys: [0, 8, 16, 24, 32, 45]},
  {id: 'B03-SH12', start: 846, len: 40, keys: [0, 8, 18, 39]},
  {id: 'B04-SH13', start: 886, len: 86, keys: [0, 28, 50, 85]},
  {id: 'B04-SH14', start: 972, len: 54, keys: [0, 6, 33, 53]},
  {id: 'B04-SH15', start: 1026, len: 118, keys: [0, 30, 60, 117]},
  {id: 'B04-SH16', start: 1144, len: 76, keys: [0, 12, 40, 75]},
  {id: 'B04-SH17', start: 1220, len: 72, keys: [0, 11, 18, 24, 71]},
  {id: 'B05-SH18', start: 1292, len: 88, keys: [0, 14, 40, 87]},
  {id: 'B05-SH19', start: 1380, len: 80, keys: [0, 40, 79]},
  {id: 'B05-SH20', start: 1460, len: 257, keys: [0, 82, 113, 144, 170, 256]},
];

export const plateId = (id: string) => `EDU22-${id}`;
export const rowOf = (id: string): ShotRow => {
  const r = EDU22_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU22: unknown shot ${id}`);
  return r;
};
export const startOf = (id: string) => rowOf(id).start;
export const lenOf = (id: string) => rowOf(id).len;
/** The shot and its local frame at composition frame G (direct seek: no state carried between frames). */
export const shotAt = (G: number): {row: ShotRow; L: number} => {
  const row = EDU22_SHOTS.find((s) => G >= s.start && G < s.start + s.len) ?? EDU22_SHOTS[EDU22_SHOTS.length - 1];
  return {row, L: Math.max(0, Math.min(row.len - 1, G - row.start))};
};

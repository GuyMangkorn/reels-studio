// EDU-EP19-SHORT shot index (Boss W5.3, 2026-11-15) from the timed scene sheets EDU-EP19-SHEETS-R3 (1704 f = 56.8 s, 30 fps, contiguous).
// For the Editor's timeline: one painted plate per shot, registry ID `EDU19-<shot id>` (src/painted/shots/edu19.tsx lists the shot files), placed at
// composition frame `start` for `len` frames with hard cuts (the B01-SH04 -> SH05 -> SH06 irises are painted inside the plates, so no dissolve is
// needed). `keys` are the shot-local frames Boss checks as stills (start, events, end). This file holds timing only: it imports no shot file, so the
// one-shot-one-file render cache stays per shot (scripts/render-inputs.ts).

export const FPS = 30;
export const DURATION = 1704;
export type ShotRow = {id: string; start: number; len: number; keys: number[]};

export const EDU19_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH01', start: 0, len: 48, keys: [0, 24, 34, 47]},
  {id: 'B01-SH02', start: 48, len: 114, keys: [0, 48, 96, 113]},
  {id: 'B01-SH03', start: 162, len: 90, keys: [0, 40, 64, 89]},
  {id: 'B01-SH04', start: 252, len: 80, keys: [0, 44, 66, 76]},
  {id: 'B01-SH05', start: 332, len: 67, keys: [0, 30, 56, 62]},
  {id: 'B01-SH06', start: 399, len: 47, keys: [0, 20, 30, 46]},
  {id: 'B01-SH07', start: 446, len: 62, keys: [0, 16, 36, 48, 61]},
  {id: 'B02-SH01', start: 508, len: 83, keys: [0, 30, 58, 82]},
  {id: 'B02-SH02', start: 591, len: 85, keys: [0, 21, 50, 84]},
  {id: 'B02-SH03', start: 676, len: 45, keys: [0, 22, 44]},
  {id: 'B02-SH04', start: 721, len: 76, keys: [0, 20, 42, 66]},
  {id: 'B02-SH05', start: 797, len: 143, keys: [0, 24, 62, 100, 130, 142]},
  {id: 'B02-SH06', start: 940, len: 51, keys: [0, 12, 30, 50]},
  {id: 'B02-SH07', start: 991, len: 46, keys: [0, 12, 21, 45]},
  {id: 'B03-SH01', start: 1037, len: 63, keys: [0, 40, 50, 62]},
  {id: 'B03-SH02', start: 1100, len: 63, keys: [0, 26, 50, 62]},
  {id: 'B03-SH03', start: 1163, len: 42, keys: [0, 10, 18, 30, 41]},
  {id: 'B03-SH04', start: 1205, len: 30, keys: [0, 8, 14, 29]},
  {id: 'B03-SH05', start: 1235, len: 72, keys: [0, 24, 38, 46, 71]},
  {id: 'B03-SH06', start: 1307, len: 90, keys: [0, 45, 56, 72, 89]},
  {id: 'B03-SH07', start: 1397, len: 60, keys: [0, 10, 46, 59]},
  {id: 'B04-SH01', start: 1457, len: 33, keys: [0, 8, 24, 32]},
  {id: 'B04-SH02', start: 1490, len: 214, keys: [0, 72, 150, 213]},
];

export const plateId = (id: string) => `EDU19-${id}`;
export const rowOf = (id: string): ShotRow => {
  const r = EDU19_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU19: unknown shot ${id}`);
  return r;
};
export const startOf = (id: string) => rowOf(id).start;
export const lenOf = (id: string) => rowOf(id).len;
/** The shot and its local frame at composition frame G (direct seek: no state carried between frames). */
export const shotAt = (G: number): {row: ShotRow; L: number} => {
  const row = EDU19_SHOTS.find((s) => G >= s.start && G < s.start + s.len) ?? EDU19_SHOTS[EDU19_SHOTS.length - 1];
  return {row, L: Math.max(0, Math.min(row.len - 1, G - row.start))};
};

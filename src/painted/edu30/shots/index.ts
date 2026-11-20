// EDU-EP30-SHORT shot index (Boss T03, 2026-11-19) from the timed scene sheets EDU-EP30-SCENE-R2 (index shot map; 28 shots, 1977 f = 65.90 s at
// 30 fps, one story scene at offset 0, play order). For the Editor's timeline: one painted plate per shot, registry ID `EDU30-<shot id>`
// (src/painted/shots/edu30.tsx lists the shot files), placed at composition frame `start` for `N` frames; every cut is a hard cut and no plate
// has pre-roll. Retired IDs B02-SH05 and B03-SH04 never appear. Q7 and Q8 (user, 19 Nov 2026): the B04-SH06 / B04-SH05 boundary (1086) and the
// B03-SH05 / B03-SH01 boundary (688) stay as the sheet wrote them. Timing only: imports no shot file (per-shot render cache).

export const FPS = 30;
export const DURATION = 1977;
export type ShotRow = {id: string; start: number; N: number};

export const EDU30_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH01', start: 0, N: 90}, {id: 'B01-SH02', start: 90, N: 59}, {id: 'B01-SH03', start: 149, N: 51},
  {id: 'B02-SH01', start: 200, N: 155}, {id: 'B02-SH02', start: 355, N: 85}, {id: 'B02-SH03', start: 440, N: 54}, {id: 'B02-SH04', start: 494, N: 98}, {id: 'B02-SH06', start: 592, N: 75},
  {id: 'B03-SH05', start: 667, N: 21}, {id: 'B03-SH01', start: 688, N: 72}, {id: 'B03-SH02', start: 760, N: 51}, {id: 'B03-SH03', start: 811, N: 57},
  {id: 'B04-SH01', start: 868, N: 56}, {id: 'B04-SH02', start: 924, N: 69}, {id: 'B04-SH03', start: 993, N: 47}, {id: 'B04-SH04', start: 1040, N: 22}, {id: 'B04-SH06', start: 1062, N: 24}, {id: 'B04-SH05', start: 1086, N: 64},
  {id: 'B05-SH01', start: 1150, N: 60}, {id: 'B05-SH02', start: 1210, N: 84}, {id: 'B05-SH03', start: 1294, N: 94}, {id: 'B05-SH04', start: 1388, N: 46},
  {id: 'B06-SH01', start: 1434, N: 110}, {id: 'B06-SH02', start: 1544, N: 36}, {id: 'B06-SH03', start: 1580, N: 99}, {id: 'B06-SH04', start: 1679, N: 58},
  {id: 'B07-SH01', start: 1737, N: 118}, {id: 'B07-SH02', start: 1855, N: 122},
];

// contiguous play order summing to DURATION, asserted at module load
const total = EDU30_SHOTS.reduce((at, s) => {
  if (s.start !== at) throw new Error(`EDU30 shot table: ${s.id} starts at ${s.start}, expected ${at}`);
  return at + s.N;
}, 0);
if (total !== DURATION) throw new Error(`EDU30 shot table: total length ${total} != ${DURATION}`);

export const plateId = (id: string) => `EDU30-${id}`;
export const rowOf = (id: string): ShotRow => {
  const r = EDU30_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU30: unknown shot ${id}`);
  return r;
};
export const lenOf = (id: string) => rowOf(id).N;
/** The shot and its local frame at composition frame G (direct seek: no state carried between frames). */
export const shotAt = (G: number): {row: ShotRow; L: number} => {
  const row = EDU30_SHOTS.find((s) => G >= s.start && G < s.start + s.N) ?? EDU30_SHOTS[EDU30_SHOTS.length - 1];
  return {row, L: Math.max(0, Math.min(row.N - 1, G - row.start))};
};

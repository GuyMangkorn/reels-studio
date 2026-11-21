// EDU-EP31-SHORT shot index (Boss W5.2 batch 1, 2026-11-21) from the timed scene sheets EDU-EP31-SCENE-R1, B01-SH01..03 retimed to SCENE-R2 (index shot map; 24 shots, 1795 f =
// 59.82 s at 30 fps, one story scene at offset 0, play order). For the Editor's timeline: one painted plate per shot, registry ID `EDU31-<shot id>`
// (src/painted/shots/edu31.tsx lists the built shot files), placed at composition frame `start` for `N` frames; every cut is a hard cut and no
// plate has pre-roll. Timing only: imports no shot file (per-shot render cache).

export const FPS = 30;
export const DURATION = 1795;
export type ShotRow = {id: string; start: number; N: number};

export const EDU31_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH01', start: 0, N: 83}, {id: 'B01-SH02', start: 83, N: 86}, {id: 'B01-SH03', start: 169, N: 64}, {id: 'B01-SH04', start: 233, N: 99},
  {id: 'B02-SH01', start: 332, N: 69}, {id: 'B02-SH02', start: 401, N: 102}, {id: 'B02-SH03', start: 503, N: 99},
  {id: 'B03-SH01', start: 602, N: 69}, {id: 'B03-SH02', start: 671, N: 69}, {id: 'B03-SH03', start: 740, N: 63}, {id: 'B03-SH04', start: 803, N: 54}, {id: 'B03-SH05', start: 857, N: 43},
  {id: 'B04-SH01', start: 900, N: 59}, {id: 'B04-SH02', start: 959, N: 67}, {id: 'B04-SH03', start: 1026, N: 125},
  {id: 'B05-SH01', start: 1151, N: 89}, {id: 'B05-SH02', start: 1240, N: 65}, {id: 'B05-SH03', start: 1305, N: 29}, {id: 'B05-SH04', start: 1334, N: 40},
  {id: 'B06-SH01', start: 1374, N: 42}, {id: 'B06-SH02', start: 1416, N: 104},
  {id: 'B07-SH01', start: 1520, N: 56}, {id: 'B07-SH02', start: 1576, N: 100}, {id: 'B07-SH03', start: 1676, N: 119},
];

// contiguous play order summing to DURATION, asserted at module load
const total = EDU31_SHOTS.reduce((at, s) => {
  if (s.start !== at) throw new Error(`EDU31 shot table: ${s.id} starts at ${s.start}, expected ${at}`);
  return at + s.N;
}, 0);
if (total !== DURATION) throw new Error(`EDU31 shot table: total length ${total} != ${DURATION}`);

export const plateId = (id: string) => `EDU31-${id}`;
export const rowOf = (id: string): ShotRow => {
  const r = EDU31_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU31: unknown shot ${id}`);
  return r;
};
export const lenOf = (id: string) => rowOf(id).N;
/** The shot and its local frame at composition frame G (direct seek: no state carried between frames). */
export const shotAt = (G: number): {row: ShotRow; L: number} => {
  const row = EDU31_SHOTS.find((s) => G >= s.start && G < s.start + s.N) ?? EDU31_SHOTS[EDU31_SHOTS.length - 1];
  return {row, L: Math.max(0, Math.min(row.N - 1, G - row.start))};
};

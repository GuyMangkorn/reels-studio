// EDU-EP20-SHORT shot index (Editor W5.3, 2026-11-16) from the timed scene sheet EDU-EP20-SS-R3 (storyboards/edu-ep20/short/scene-sheet.md
// shot map; SS-R5 END20: 1619 f = 53.967 s at 30 fps, B05-SH03 [1332,1619); contiguous, composition offset 0, so G = start + L). One painted plate per shot, registry ID
// `EDU20-<shot id>` (src/painted/shots/edu20.tsx lists the shot files); B04-SH01 adds the settled plate `EDU20-B04-SH01-SETTLED` for its
// in-canvas story-time dissolve. `keys` are the shot-local frames checked as stills (entry, events, exit). Timing only: this file imports
// no shot file, so the one-shot-one-file render cache stays per shot (scripts/render-inputs.ts).

export const FPS = 30;
export const DURATION = 1619;
export type ShotRow = {id: string; start: number; len: number; keys: number[]};

export const EDU20_SHOTS: readonly ShotRow[] = [
  {id: 'B01-SH01', start: 0, len: 71, keys: [0, 18, 35, 70]},
  {id: 'B01-SH02', start: 71, len: 116, keys: [0, 58, 115]},
  {id: 'B01-SH03', start: 187, len: 165, keys: [0, 9, 18, 82, 164]},
  {id: 'B02-SH01', start: 352, len: 144, keys: [0, 3, 12, 21, 62, 143]},
  {id: 'B03-SH01', start: 496, len: 208, keys: [0, 24, 32, 104, 207]},
  {id: 'B03-SH02', start: 704, len: 141, keys: [0, 25, 60, 90, 140]},
  {id: 'B04-SH01', start: 845, len: 150, keys: [0, 20, 60, 70, 82, 95, 149]},
  {id: 'B04-SH02', start: 995, len: 99, keys: [0, 49, 98]},
  {id: 'B05-SH01', start: 1094, len: 179, keys: [0, 114, 132, 149, 178]},
  {id: 'B05-SH02', start: 1273, len: 59, keys: [0, 1, 10, 19, 35, 58]},
  {id: 'B05-SH03', start: 1332, len: 287, keys: [0, 16, 39, 68, 108, 133, 169, 205, 253, 286]},
];

export const plateId = (id: string) => `EDU20-${id}`;
const row = (id: string) => {
  const r = EDU20_SHOTS.find((s) => s.id === id);
  if (!r) throw new Error(`EDU20: no shot ${id} in the index`);
  return r;
};
export const lenOf = (id: string) => row(id).len;
export const startOf = (id: string) => row(id).start;

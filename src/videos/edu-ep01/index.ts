import {edu1PlateId} from '../../painted/shots/edu01';
import {EDU1_SHOTS, EDU1_TOTAL} from '../../painted/edu01/plates';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP01-SHORT picture draft (W5.2, Boss, 4 Nov 2026): the hypnic-jerk short (C2 dream-fall), scene sheets EDU-SHEETS-R1.1
 * (scripts/edu-series/short/scene-sheets.md), 23 shots = 23 timeline scenes, 1860 f at 30 fps (62.00 s). Each scene mounts the
 * registry plate `EDU1-<shot id>` (src/painted/shots/edu01.tsx over src/painted/edu01/plates.tsx). Picture only: no narration,
 * captions, tag, name card or sound until W5.3 (Editor). `C_seamless` with `loopBlendFrames` 15 per brief VD02.
 * Review stills: `node scripts/render.mjs EDU-EP01-SHORT --stills --frames=...` (never a whole-timeline render).
 */
const FPS = 30;
if (EDU1_TOTAL !== 1860) throw new Error(`EDU-EP01-SHORT: shots sum to ${EDU1_TOTAL}, scene sheets say 1860`);
const starts = EDU1_SHOTS.map((_, i) => EDU1_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
const cuts = EDU1_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu1PlateId(cut.id)}})),
  captions: cuts.map((cut) => ({at: cut.start, text: ''})),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep01',
  videos: [{
    id: 'EDU-EP01-SHORT', format: 'short', timeline, ending: 'C_seamless', loopBlendFrames: 15,
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

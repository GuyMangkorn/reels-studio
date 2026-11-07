import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {edu6PlateId} from '../../painted/shots/edu06';
import type {EpisodeVideos} from '../types';
import {EDU6_CUTS, EDU6_FPS, EDU6_TOTAL, edu6CaptionEvents} from './shots';

/**
 * EDU-EP06-SHORT (C8 "กะพริบตาช้า ๆ ใส่แมว") W5.3 Draft (Editor, 7 Nov 2026): scene sheets EDU-EP06-SHEETS-R1.1 (scripts/edu-series/ep06/scene-sheets.md),
 * script R1.3, voice lock W4 (NAR Revision E + OWN Leda L03/L03b). 19 shots = 19 scenes, 1685 f at 30 fps (56.17 s), hard cuts except the 6 f fade
 * into S01-B04-SH04. Ending `A_fade`, live (endHoldSec 0), fade 0.8 s, no loop. Plates `EDU6-<shot id>` = src/painted/shots/edu06.tsx over
 * src/painted/edu06/plates.tsx. Narration = scripts/edu-series/ep06/narration-place.py -> public/narration/EDU-EP06-SHORT.wav; sound stem =
 * scripts/edu-series/ep06/sound-mix.py (see build-notes there: NG-S3-S8 foley are placeholders, not generated). Captions: edu stroke (CAPTION_OUTLINE, no band),
 * bottom edge y 1344, none over S01-B05-SH04/SH05. Channel mark @TamMaiLa (chrome default).
 */
if (EDU6_CUTS.at(-1)!.end !== 1685 || EDU6_TOTAL !== 1685) throw new Error(`EDU-EP06-SHORT: shots sum to ${EDU6_CUTS.at(-1)!.end}, scene sheets say 1685`);

const timeline = assemblePaintedTimeline({
  clockRate: EDU6_FPS, precision: 4, cuts: EDU6_CUTS,
  shots: EDU6_CUTS.map((cut) => ({at: cut.start, cue: {shot: edu6PlateId(cut.id), ...(cut.id === 'S01-B04-SH04' ? {dissolveSec: 0.2} : {})}})), // day cutaway: 6 f in-canvas dissolve (sheet)
  captions: edu6CaptionEvents(),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep06',
  videos: [{
    id: 'EDU-EP06-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0.8,
    narration: {src: 'narration/EDU-EP06-SHORT.wav', amplitude: [], fps: EDU6_FPS},
    audio: [{src: 'audio/edu/EDU-EP06-SHORT-review-stem-v2.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

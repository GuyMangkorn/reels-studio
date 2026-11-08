import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_RANGES, TOTAL} from '../../painted/edu07/clock';
import {edu7PlateId} from '../../painted/edu07/shot';
import type {EpisodeVideos} from '../types';
import {edu7CaptionEvents} from './cues';

/**
 * EDU-EP07-SHORT (C15 "ถ้าดวงอาทิตย์หายไปตอนนี้") W5.2 Boss plates, blockout + W5.3 Draft (Editor, 8 Nov 2026): scene sheets EDU-EP07-SHEETS-R1.1 (scripts/edu-series/ep07/scene-sheets.md),
 * 18 shots = 18 scenes, 1798 f at 30 fps (59.93 s), hard cuts. One plate per shot, ID `EDU7-<shot id>` (src/painted/edu07/shots/<shot id>.tsx, listed by
 * src/painted/shots/edu07.tsx). Narration = scripts/edu-series/ep07/narration-place.py -> public/narration/EDU-EP07-SHORT.wav; sound stem = scripts/edu-series/ep07/sound-mix.py; captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Ending `B_loop`, endHoldSec 0 (the last frame G1797
 * equals G0). Channel mark @TamMaiLa (chrome default).
 */
const cuts = SHOT_RANGES.map(([id, start, end]) => ({id, start, end}));
if (cuts.at(-1)!.end !== TOTAL || TOTAL !== 1798) throw new Error(`EDU-EP07-SHORT: shots sum to ${cuts.at(-1)!.end}, scene sheets say 1798`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu7PlateId(cut.id)}})),
  captions: edu7CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep07',
  videos: [{
    id: 'EDU-EP07-SHORT', format: 'short', timeline, ending: 'B_loop', endHoldSec: 0,
    narration: {src: 'narration/EDU-EP07-SHORT.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP07-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

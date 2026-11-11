import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from '../../painted/edu15/clock';
import {edu15PlateId} from '../../painted/shots/edu15';
import type {EpisodeVideos} from '../types';
import {edu15CaptionEvents} from './cues';

/**
 * EDU-EP15-SHORT (C43 tokay adhesion) W5.3 Draft (Editor, 10 Nov 2026): timed scene sheet EDU-EP15-ROWS-R2.3 (scripts/edu-series/ep15/storyboard.md), script R2, voice lock (W4).
 * 20 shots = 20 scenes, 1793 f at 30 fps (59.77 s), hard cuts. Plates `EDU15-<shot id>` (src/painted/shots/edu15.tsx) mount Boss's `ShotFrame`.
 * Narration = scripts/edu-series/ep15/narration-place.py -> public/narration/EDU-EP15-SHORT-narration-v1.wav (C1 Kore read in 6 segments + V01 Despina + V02 Algenib, no gain);
 * sound stem = scripts/edu-series/ep15/sound-mix.py (the 58 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed, the 60 f hold after V03 is inside the last shot; no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1793) throw new Error(`EDU-EP15-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1793`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu15PlateId(cut.id)}})),
  captions: edu15CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep15',
  videos: [{
    id: 'EDU-EP15-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP15-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP15-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from '../../painted/edu14/clock';
import {edu14PlateId} from '../../painted/shots/edu14';
import type {EpisodeVideos} from '../types';
import {edu14CaptionEvents} from './cues';

/**
 * EDU-EP14-SHORT (C37 rain without air) W5.3 Draft (Editor, 9 Nov 2026): timed scene sheet EDU-EP14-ROWS-R4.1 (scripts/edu-series/ep14/storyboard.md), script R4, voice lock (measure.json `lock`).
 * 21 shots = 21 scenes, 1815 f at 30 fps (60.50 s), hard cuts (the f55 grade hit and the f686 colour cut live inside shots 1 and 10). Plates `EDU14-<shot id>` (src/painted/shots/edu14.tsx) mount Boss's `ShotFrame`.
 * Narration = scripts/edu-series/ep14/narration-place.py -> public/narration/EDU-EP14-SHORT-narration-v1.wav (locked R4 Kore read + girl takes V01/V02, no gain);
 * sound stem = scripts/edu-series/ep14/sound-mix.py (the 46 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed, the 55 f hold after V02 is inside the last shot; no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1815) throw new Error(`EDU-EP14-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1815`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu14PlateId(cut.id)}})),
  captions: edu14CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep14',
  videos: [{
    id: 'EDU-EP14-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP14-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP14-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

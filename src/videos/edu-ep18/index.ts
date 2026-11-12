import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from '../../painted/edu18/clock';
import {edu18PlateId} from '../../painted/shots/edu18';
import type {EpisodeVideos} from '../types';
import {edu18CaptionEvents} from './cues';

/**
 * EDU-EP18-SHORT (mosquito rides a raindrop) W5.2 Boss blockout: timed sheet EDU-EP18-ROWS-R2.0 (scripts/edu-series/ep18/storyboard.md), 21 shots, 1468 f at 30 fps (48.93 s), hard cuts.
 * Plates `EDU18-<shot id>` (src/painted/shots/edu18.tsx). W5.3 Draft (Editor, 12 Nov 2026): narration = scripts/edu-series/ep18/narration-place.py (nine segments of the locked Kore read);
 * sound stem = scripts/edu-series/ep18/sound-mix.py (the 46 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default.
 * Ending: closed, the strings tag rings out inside the last shot (cue sheet fades it over f1452-f1467); no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1468) throw new Error(`EDU-EP18-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1468`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu18PlateId(cut.id)}})),
  captions: edu18CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep18',
  channel: 'edu',
  videos: [{id: 'EDU-EP18-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP18-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP18-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false}}],
};
export default videos;

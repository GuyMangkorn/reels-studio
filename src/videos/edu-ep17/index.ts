import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {edu17PlateId} from '../../painted/shots/edu17';
import type {EpisodeVideos} from '../types';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from './clock';
import {edu17CaptionEvents} from './cues';

/**
 * EDU-EP17-SHORT (C38 whole world in Bangkok) W5.3 Draft (Editor, 12 Nov 2026): timed scene sheet EDU-EP17-ROWS-R2.4 (scripts/edu-series/ep17/storyboard.md), BRIEF-R2.5, script R2, voice lock (measure.json).
 * 22 shots = 22 scenes, 1561 f at 30 fps (52.03 s), hard cuts. Plates `EDU17-<shot id>` (src/painted/shots/edu17.tsx) mount `ShotFrame` (./frame.tsx) in a Freeze at the shot-local frame; Boss's modules are in src/painted/edu17/.
 * Narration = scripts/edu-series/ep17/narration-place.py -> public/narration/EDU-EP17-SHORT-narration-v1.wav (the x1.08 Kore read in seven segments + V01/V02 MAN takes);
 * sound stem = scripts/edu-series/ep17/sound-mix.py (the 36 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * OpenStreetMap data is baked into src/painted/edu17/map-*.json: the credit "© OpenStreetMap contributors" goes in the video description (storyboard R08, Q-F1 = a), not on screen.
 * Ending: closed, the 62 f hold after the last word is inside the last shot; the sound stem fades to silence at the last frame; no picture fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1561) throw new Error(`EDU-EP17-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1561`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu17PlateId(cut.id)}})),
  captions: edu17CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep17',
  channel: 'edu',
  videos: [{
    id: 'EDU-EP17-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP17-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP17-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

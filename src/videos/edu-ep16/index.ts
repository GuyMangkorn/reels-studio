import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from '../../painted/edu16/clock';
import {edu16PlateId} from '../../painted/shots/edu16';
import type {EpisodeVideos} from '../types';
import {edu16CaptionEvents} from './cues';

/**
 * EDU-EP16-SHORT (C45 crows remember a face) W5.3 Draft (Editor, 10 Nov 2026): timed scene sheet EDU-EP16-ROWS-R2.1 (scripts/edu-series/ep16/storyboard.md), script R3, voice lock (measure.json `lock`).
 * 20 shots = 20 scenes, 1632 f at 30 fps (54.40 s), hard cuts. Plates `EDU16-<shot id>` (src/painted/shots/edu16.tsx) mount `ShotFrame` (src/painted/edu16/frame.tsx) in a Freeze at the shot-local frame.
 * Narration = scripts/edu-series/ep16/narration-place.py -> public/narration/EDU-EP16-SHORT-narration-v2.wav (accepted r9 Kore read placed in thirteen segments; v1 = r3 read in six segments + V01 Charon / V02 Aoede takes, no gain);
 * sound stem = scripts/edu-series/ep16/sound-mix.py (the 68 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed, the 60 f hold after the turn to the lens is inside the last shot; no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1632) throw new Error(`EDU-EP16-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1632`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu16PlateId(cut.id)}})),
  captions: edu16CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep16',
  videos: [{
    id: 'EDU-EP16-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP16-SHORT-narration-v2.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP16-SHORT-draft-stem-v2.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

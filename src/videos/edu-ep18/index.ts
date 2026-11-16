import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE, TOTAL, edu18PlateId} from '../../painted/edu18/shotkit';
import type {EpisodeVideos} from '../types';
import {edu18CaptionEvents} from './cues';

/**
 * EDU-EP18-SHORT (C69 hippo, rung ladder) W5 draft (Editor, 16 Nov 2026): timed scene sheets EDU-EP18-SHEETS-R1.0 (scripts/edu-series/ep18/short/scene-sheets.md), script R2.1 (L12 changed; narration v2).
 * 24 shots = 24 scenes, 1872 f at 30 fps (62.40 s), hard cuts only. Plates `EDU18-<shot id>` (src/painted/shots/edu18.tsx -> src/painted/edu18/shots/*), each hosting a PaintedStack in its Overlay.
 * Narration = scripts/edu-series/ep18/short/narration-place.py -> public/narration/EDU-EP18-SHORT-narration-placed-v2.wav (Kore x1.05 in segments A-F + V01-V05).
 * Sound stem = scripts/edu-series/ep18/short/sound-mix.py (the 60 placements of sound-cues.json); captions = ./cues.ts (28 cues, edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default.
 * Ending: closed, END1 at G1812 into A_fade (the 60 f hold is inside B06-SH05); no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL) throw new Error(`EDU-EP18-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says ${TOTAL}`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu18PlateId(cut.id)}})),
  captions: edu18CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep18',
  videos: [{
    id: 'EDU-EP18-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP18-SHORT-narration-placed-v2.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP18-SHORT-stem-v2.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

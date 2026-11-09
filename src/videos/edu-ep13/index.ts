import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {SHOTS} from '../../painted/edu13/shots';
import {edu13PlateId} from '../../painted/shots/edu13';
import type {EpisodeVideos} from '../types';
import {edu13CaptionEvents} from './cues';

/**
 * EDU-EP13-SHORT (C39 flea jump) W5.3 Draft (Editor, 9 Nov 2026): scene sheets EDU-EP13-SHEETS-R2.0 (scripts/edu-series/ep13/scene-sheets.md), script R4, voice lock slow6.
 * 16 shots = 16 scenes, 1390 f at 30 fps (46.33 s), hard cuts; each scene mounts Boss's shot component (src/painted/edu13/shot-layers.tsx) as plate `EDU13-<shot id>` (src/painted/shots/edu13.tsx).
 * Narration = scripts/edu-series/ep13/narration-place.py -> public/narration/EDU-EP13-SHORT-narration-v1.wav (Kore slow6 in four pieces + MAN Algenib V01/V02);
 * sound stem = scripts/edu-series/ep13/sound-mix.py (the 52 cues of scripts/edu-series/ep13/sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default.
 * Ending: closed, the 2.63 s hold is inside the last shot (room tone fades to zero at the last frame); no loop seam.
 */
const cuts = Object.entries(SHOTS).map(([key, s]) => ({id: key.replace(/_/g, '-'), start: s.start, end: s.start + s.len})).sort((a, b) => a.start - b.start);
const DURATION = cuts.at(-1)!.end;
if (DURATION !== 1390) throw new Error(`EDU-EP13-SHORT: shots sum to ${DURATION}, scene sheets say 1390`);

const timeline = assemblePaintedTimeline({
  clockRate: 30, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu13PlateId(cut.id)}})),
  captions: edu13CaptionEvents(cuts.map((c) => c.start), DURATION),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep13',
  videos: [{
    id: 'EDU-EP13-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP13-SHORT-narration-v1.wav', amplitude: [], fps: 30},
    audio: [{src: 'audio/edu/EDU-EP13-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

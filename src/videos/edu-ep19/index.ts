import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU19_SHOTS, FPS, plateId} from '../../painted/edu19/shots';
import type {EpisodeVideos} from '../types';
import {edu19CaptionEvents} from './cues';

/**
 * EDU-EP19-SHORT (C-dog tracking, หมาตามรอย) W5.4 Draft (Editor, 15 Nov 2026): timed scene sheets EDU-EP19-SHEETS-R3 (scripts/edu-series/ep19/short/scene-sheets.md), script R4, voice lock EDU-EP19-VOICE-R2,
 * look v6 (user), cue sheet EDU-EP19-SOUND-R1 without HUFF (user, 15 Nov 2026: no dog sound at the ending).
 * 23 shots = 23 scenes, 1704 f at 30 fps (56.80 s), hard cuts only (the B01-SH04 -> SH05 -> SH06 irises are painted inside the plates). Plates `EDU19-<shot id>` (src/painted/shots/edu19.tsx, timing src/painted/edu19/shots/index.ts).
 * Narration = scripts/edu-series/ep19/narration-place.py -> public/narration/EDU-EP19-SHORT-narration-v1.wav (9 Kore lines r4_t1_slow8 + 6 Gemini Leda V01-V06, one file per line at the sheet's file-start G, V06 -6 dB whisper);
 * sound stem = scripts/edu-series/ep19/sound-mix.py (the 78 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed, W-HOLD 64 f inside B04-SH02; `A_fade` over the last 24 f (endFadeSec 0.8, no freeze); A1 carries the audio fade (G1680-1704) and E1 ends G1703.
 */
const cuts = EDU19_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.len}));
const TOTAL = 1704;
if (cuts.at(-1)!.end !== TOTAL || DURATION !== TOTAL) throw new Error(`EDU-EP19-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says ${TOTAL}`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: plateId(cut.id)}})),
  captions: edu19CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep19',
  videos: [{
    id: 'EDU-EP19-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 24 / FPS,
    narration: {src: 'narration/EDU-EP19-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP19-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

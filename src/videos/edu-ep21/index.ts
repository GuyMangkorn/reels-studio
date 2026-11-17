import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU21_SHOTS, FPS, plateId} from '../../painted/edu21/shots/index';
import type {EpisodeVideos} from '../types';
import {edu21CaptionEvents} from './cues';

/**
 * EDU-EP21-SHORT (C83 lightning and an enclosed metal car, ฟ้าผ่ากับรถโลหะปิดมิดชิด) W5.3 Draft (Editor, 17 Nov 2026): timed scene sheets EDU-EP21-SHEETS-R3
 * (scripts/edu-series/ep21/short/scene-sheets.md), SCRIPT-R1, voice lock EDU-EP21-VOICE-R2 (Kore x0.9975), looks LF01-LF03, cue sheet scripts/edu-series/ep21/sound-cues.json (Ton).
 * 13 shots = 13 scenes, 1320 f at 30 fps (44.00 s), hard cuts only. Plates `EDU21-<shot id>` (src/painted/shots/edu21.tsx, timing src/painted/edu21/shots/index.ts);
 * the label chip N7 "ภาพอธิบายแบบง่าย" is painted inside SH06/SH10/SH13 (Boss), so there is no episode overlay.
 * Narration = scripts/edu-series/ep21/narration-place.py -> public/narration/EDU-EP21-SHORT-narration-v1.wav (one read cut at the L06>L07 gap, +10 f room-tone GD1);
 * sound stem = scripts/edu-series/ep21/sound-mix.py (the 15 cues of the cue sheet); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344 = the sheet's band bottom).
 * Channel mark @TamMaiLa = chrome default (top-left), `outline` look as EP20 (the ink mark can vanish on dark plates).
 * Ending: closed; B05-SH13 holds G1230-1320 with END1; `A_fade` over the last 24 f (G1296-1320, no freeze). Fade length is the Editor's choice (the sheet says only "A_fade").
 */
const cuts = EDU21_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.len}));
const TOTAL = 1320;
if (cuts.at(-1)!.end !== TOTAL || DURATION !== TOTAL) throw new Error(`EDU-EP21-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says ${TOTAL}`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: plateId(cut.id)}})),
  captions: edu21CaptionEvents(cuts.map((c) => c.start)),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep21',
  channel: 'edu',
  videos: [{
    id: 'EDU-EP21-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 24 / FPS,
    narration: {src: 'narration/EDU-EP21-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP21-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false, channelLabelStyle: 'outline'},
  }],
};
export default videos;

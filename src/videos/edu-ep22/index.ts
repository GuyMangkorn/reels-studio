import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU22_SHOTS, FPS, plateId} from '../../painted/edu22/shots';
import type {EpisodeVideos} from '../types';
import {edu22CaptionEvents} from './cues';

/**
 * EDU-EP22-SHORT (eunuch poison taster, Puyi's table) W5.1 plates timeline (Boss, 16 Nov 2026): timed scene sheets EDU-EP22-SCENES-R1
 * (scripts/edu-series/ep22/short/scene-sheets.md), 20 shots = 20 scenes, 1717 f at 30 fps (57.23 s), hard cuts only. Plates `EDU22-<shot id>`
 * (src/painted/shots/edu22.tsx, timing src/painted/edu22/shots/index.ts). Plates only: narration, captions, the mark, the sound bed and the
 * ending treatment are the Editor's assembly (no narration, audio or captions here yet); `ending: 'A_fade'` with no hold and no fade keeps the
 * last frame = LF01b until the Editor sets the series ending.
 *
 * W6.1 Draft (Editor, 17 Nov 2026): narration = the locked EP22_narration_kore_x0.9025.wav at G 0 (scripts/edu-series/ep22/short/sound-mix.py -> public/narration/EDU-EP22-SHORT-narration-v1.wav);
 * sound stem = the same script from the 35 cues of sound-cues.json (EDU-EP22-SOUND-R1, Editor mix offsets in sound-tweak.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344);
 * channel mark @TamMaiLa = chrome default (top-left). Ending: closed, the 90 f hold lives inside SH20 (G1627-1717), no picture fade, END1 + A1 fade G1697-1717 (series ending sound per UT15 = Film's END1).
 */
const cuts = EDU22_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.len}));
const TOTAL = 1717;
if (cuts.at(-1)!.end !== TOTAL || DURATION !== TOTAL) throw new Error(`EDU-EP22-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says ${TOTAL}`);
for (let i = 1; i < cuts.length; i++) if (cuts[i].start !== cuts[i - 1].end) throw new Error(`EDU-EP22-SHORT: gap before ${cuts[i].id}`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: plateId(cut.id)}})),
  captions: edu22CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep22',
  videos: [{id: 'EDU-EP22-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP22-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP22-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false}}],
};
export default videos;

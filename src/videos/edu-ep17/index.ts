import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {EpisodeVideos} from '../types';
import {FPS, PILE_DISSOLVE_SEC, PILE_STEPS_SH12, SHOT_TABLE, TOTAL_FRAMES} from './clock';
import {edu17CaptionEvents} from './cues';
import {edu17PlateId} from './plate-ids';

/**
 * EDU-EP17-SHORT (ของมีค่าที่สุดคือกองฟืน, edu channel) W5.3 Draft (Editor, 14 Nov 2026): timed scene sheet EDU-EP17-SHEET-R1.2 (scripts/edu-series/ep17/storyboard.md), script R2.2, voice lock R2.2.
 * 23 shots = 23 scenes, 1815 f at 30 fps (60.50 s), hard cuts except the woodpile's three painted shrink dissolves inside shot 12. Plates `EDU17-<shot id>` (./plates.tsx, registered in src/painted/registry.ts).
 * Narration = scripts/edu-series/ep17/narration-place.py -> public/narration/EDU-EP17-SHORT-narration-v1.wav (Kore R2.2 read cut at its pauses + five character takes + L10 whisper, no gain);
 * sound stem = scripts/edu-series/ep17/sound-mix.py (the 52 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed, the 2 s hold after the whisper is inside the last shot (E-FIRE: stinger_isan-fire-low-note_01 at f1755); no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1815) throw new Error(`EDU-EP17-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1815`);

const SH12 = 'S01-B03-SH12';
const shotCues = cuts.flatMap((cut) => {
  if (cut.id !== SH12) return [{at: cut.start, cue: {shot: edu17PlateId(cut.id)}}];
  return PILE_STEPS_SH12.map(([f, ], i) => ({at: cut.start + f, cue: i === 0 ? {shot: edu17PlateId(cut.id)} : {shot: edu17PlateId(`${cut.id}-${'bcd'[i - 1]}`), fromSec: f / FPS, dissolveSec: PILE_DISSOLVE_SEC}}));
});

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts, shots: shotCues,
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

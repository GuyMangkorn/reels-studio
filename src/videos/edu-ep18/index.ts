import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {EpisodeVideos} from '../types';
import {FPS, SHOT_TABLE, TOTAL_FRAMES, shotStart} from './clock';
import {edu18CaptionEvents} from './cues';
import {JUG_LEVELS, edu18PlateId} from './shots';

/**
 * EDU-EP18-SHORT (ยาช่วยชีวิตอยู่ในครัว / oral rehydration) W5.3 Draft (Editor, 14 Nov 2026): timed scene sheet EDU-EP18-SHEET-R1.1 (scripts/edu-series/ep18/storyboard.md), script R2.2 (locked),
 * brief R1.1, voice lock R2.2 (scripts/edu-series/ep18/measure.json). 22 shots = 22 scenes, 1737 f at 30 fps (57.90 s), hard cuts; the jug dissolves of shots 15 and 19 are in-canvas painted dissolves
 * (`painted.shots[].dissolveSec`). Plates `EDU18-<shot>` (./plates.tsx, registered in src/painted/registry.ts). Booked limitation: the recipe numbers are not yet verified on the WHO/UNICEF primary page (draft only).
 * Narration = scripts/edu-series/ep18/narration-place.py -> public/narration/EDU-EP18-SHORT-narration-v1.wav (Kore read cut at its pauses + Gacrux/Leda character takes);
 * sound stem = scripts/edu-series/ep18/sound-mix.py (the 36 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default.
 * Ending: closed, the 60 f hold after the hen cluck and series tag is inside the last shot; no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1737) throw new Error(`EDU-EP18-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1737`);

/** Dissolve starts (shot-local frames) of the jug plates: three painted dissolves of 9 f (0.3 s); the refill in shot 19 finishes by +61 (f1455 < f1464). */
const DISSOLVE_AT = {SH15: [40, 60, 75], SH19: [20, 36, 52]} as const;
const DISSOLVE_SEC = 0.3;
const shots = cuts.flatMap((cut) => {
  const id = cut.id as keyof typeof JUG_LEVELS;
  if (!(id in JUG_LEVELS)) return [{at: cut.start, cue: {shot: edu18PlateId(cut.id)}}];
  return [{at: cut.start, cue: {shot: edu18PlateId(id, 'a')}}, ...DISSOLVE_AT[id as 'SH15' | 'SH19'].map((at, i) => ({at: cut.start + at, cue: {shot: edu18PlateId(id, 'bcd'[i]), fromSec: at / FPS, dissolveSec: DISSOLVE_SEC}}))];
});

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts, shots,
  captions: edu18CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep18',
  videos: [{
    id: 'EDU-EP18-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP18-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP18-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
void shotStart;
export default videos;

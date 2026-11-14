import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {EpisodeVideos} from '../types';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from './clock';
import {ep16CaptionEvents} from './cues';
import {edu16PlateId as ep16PlateId} from '../../painted/shots/edu16';

/**
 * EDU-EP16-SHORT (survival series 1: the wormhole village, "ไก่ในเล้า คือไดโนเสาร์") W5.3 Draft (Editor, 14 Nov 2026) on EDU-EP16-SHEET-R1.1 (scripts/edu-series/ep16/storyboard.md), script R2.2, voice lock R2.2/R2.3.
 * R1.5b draft (Editor, 14 Nov 2026) on EDU-EP16-SHEET-R1.5b (ROWS-R1.5b, BRIEF-R1.5b): 26 shots = 26 scenes, 2100 f at 30 fps (70.00 s), hard cuts only (the paddy and day/night of shot 12 run inside one plate on Boss's sky-cycle).
 * Play order 15 -> 16A -> 16B -> 16C -> 16D -> 16 -> 17.
 * Plates `EP16-<n>` (src/videos/edu-ep16/shots.tsx, registered through src/painted/shots/edu16.tsx) draw the shared survival assets (src/painted/survival, read-only here).
 * Narration track = scripts/edu-series/ep16/narration-place.py -> public/narration/EDU-EP16-SHORT-narration-v1.wav (R2.2 Kore read cut at the sheet's R1.5b lines + the character takes);
 * sound stem = scripts/edu-series/ep16/sound-mix.py (the 83 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed. The series tag E-TAG (stinger_isan-series-tag_01) starts at f2065 (SH22 +136) and rings out to f2100; no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
/** Plate key of a shot id: 'S01-B05-SH16C' -> '16C', 'S01-B01-SH01' -> '1'. */
const plateKey = (id: string) => String(id.split('-SH')[1]).replace(/^0/, '');
const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: ep16PlateId(plateKey(cut.id))}})),
  captions: ep16CaptionEvents(cuts.map((c) => c.start), TOTAL_FRAMES),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep16',
  channel: 'edu',
  videos: [{
    id: 'EDU-EP16-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP16-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

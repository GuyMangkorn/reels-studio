import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_RANGES, TOTAL} from '../../painted/edu16/clock';
import type {EpisodeVideos} from '../types';
import {edu16CaptionEvents} from './cues';

/**
 * EDU-EP16-SHORT (Dark Forest, ป่าเงียบ) W5.3 Draft on R2 (Editor, 15 Nov 2026): timed scene sheet EDU-EP16-SHEETS-R2 (scripts/edu-series/ep16/storyboard.md), script R3, voice lock v2 (5 % slower read).
 * 24 shots = 24 scenes, 1800 f at 30 fps (60.00 s). Plates `EDU16-<shot id>` (src/painted/shots/edu16.tsx). Dissolves/irises are `painted.shots[].dissolveSec` (sheet "In -> out"); the label
 * "ภาพจำลอง" is the cue label on SH01-SH03 and SH06-SH21 (sheet "Label"; one continuous run [316, 1495)). SH04/SH05 and SH10/SH11 are continuous camera runs (D8): hard boundary, no visible cut.
 * Narration = scripts/edu-series/ep16/narration-place.py -> public/narration/EDU-EP16-SHORT-narration-placed-v2.wav (locked v2 read, 55.045 s, cut in 4 pieces N1-N4, no gain);
 * sound stem = scripts/edu-series/ep16/sound-mix.py (the 39 cues of sound-cues.json); captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Ending: closed, the 45 f hold is inside SH23; no end fade (END-TONE and hum carry it to the last frame).
 */
const cuts = SHOT_RANGES.map(([id, start, end]) => ({id, start, end}));
if (cuts.at(-1)!.end !== TOTAL || TOTAL !== 1800) throw new Error(`EDU-EP16-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1800`);

const LABEL = 'ภาพจำลอง';
/** Dissolve length in frames INTO each shot (sheet shot map "In"): bubble/iris dissolves; absent = hard cut. */
// SH14's 8 f "same space" dissolve is dropped (Boss W5.4): SH14 +0 repaints SH13's end state (same stage 1.12, same thCam, cards at +99), so the
// boundary is a continuous run like D8, and the translucent incoming plate glazed both opaque black monsters pale olive over f866-873.
const DISSOLVE_IN: Record<string, number> = {
  'S01-B02-SH06': 12, 'S01-B02-SH07': 8, 'S01-B02-SH08': 12, 'S01-B04-SH13': 12, 'S01-B05-SH16': 12, 'S01-B05-SH18': 14, 'S01-B05-SH19': 12,
};
const labelOn = (start: number) => start < 163 || (start >= 316 && start < 1495);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {
    shot: `EDU16-${cut.id}`,
    ...(DISSOLVE_IN[cut.id] ? {dissolveSec: DISSOLVE_IN[cut.id] / FPS} : {}),
    ...(labelOn(cut.start) ? {label: LABEL, labelTop: 148, labelSide: 'right' as const} : {}),
  }})),
  captions: edu16CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep16',
  videos: [{
    id: 'EDU-EP16-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP16-SHORT-narration-placed-v2.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP16-SHORT-draft-stem-v2.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
  }],
};
export default videos;

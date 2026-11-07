import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {BAR_LABELS} from '../../painted/edu05/effects';
import {paintedShots} from '../../painted/registry';
import type {EpisodeVideos} from '../types';
import {EDU5_CUTS, EDU5_FPS, EDU5_SHOTS, EDU5_TOTAL, edu5CaptionEvents} from './shots';

/**
 * EDU-EP05-SHORT (C6 "ถ้าคุณตัวเล็กเท่ามด") W5.3 blockout (Editor, 6 Nov 2026): scene sheets EDU-EP05-SHEETS-R1 (scripts/edu-series/ep05/scene-sheets.md),
 * script R1.3a, voice lock W4 (Kore x1.10 + Leda picks). 19 shots = 19 scenes, 1989 f at 30 fps (66.30 s), hard cuts. Ending `A_fade`, live hold (endHoldSec 0),
 * fade 0.8 s (brief VD17). Narration = scripts/edu-series/ep05/narration-place.py -> public/narration/EDU-EP05-SHORT.wav; sound = review-mix.py
 * (library-only stem, NG-* not generated). Captions: edu stroke style (CAPTION_OUTLINE, no band), bottom edge y 1344, cues from the shot blocks.
 *
 * PICTURE IS PLACEHOLDER: Boss's N1-N10/K1 art is not in the kit yet and src/painted/ has no `EDU5-<shot id>` plates. Each scene mounts the plate
 * `EDU5-<shot id>` when the painted registry has it, otherwise a stand-in plate under a full-frame placeholder card naming the shot and its missing
 * items. Swap-in needs no change here. This is a timing/audio/caption blockout, NOT a Draft.
 */
if (EDU5_CUTS.at(-1)!.end !== EDU5_TOTAL) throw new Error(`EDU-EP05-SHORT: shots sum to ${EDU5_CUTS.at(-1)!.end}, scene sheets say ${EDU5_TOTAL}`);

const STAND_IN = 'kit-people-talk';
const needs = new Map<string, string>(EDU5_SHOTS.map(([id, , n]) => [id, n]));
const plateOf = (id: string) => (paintedShots[`EDU5-${id}`] ? `EDU5-${id}` : STAND_IN);
const placeholder = (id: string) => plateOf(id) === STAND_IN
  ? [{kind: 'card' as const, text: `${id}\nPLACEHOLDER\nneeds ${needs.get(id)}`, x: 540, y: 960, w: 1080, h: 1920, atFrame: 0, popFrames: 1}]
  : undefined;
/** Cue items per shot: the placeholder card (until the plate exists), then N9 bar labels on S01-B05-SH02 (Thai text is DOM, not painted; shot-local atFrame 20 / 26). */
const itemsOf = (id: string) => {
  const items = [...(placeholder(id) ?? []), ...(id === 'S01-B05-SH02' ? BAR_LABELS : [])];
  return items.length ? {items} : {};
};

const timeline = assemblePaintedTimeline({
  clockRate: EDU5_FPS, precision: 4, cuts: EDU5_CUTS,
  shots: EDU5_CUTS.map((cut) => ({at: cut.start, cue: {shot: plateOf(cut.id), ...itemsOf(cut.id)}})),
  captions: edu5CaptionEvents(),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep05',
  videos: [{
    id: 'EDU-EP05-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0.8,
    narration: {src: 'narration/EDU-EP05-SHORT.wav', amplitude: [], fps: EDU5_FPS},
    audio: [{src: 'audio/edu/EDU-EP05-SHORT-review-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

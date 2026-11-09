import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_RANGES, TOTAL} from '../../painted/edu09/clock';
import {edu9PlateId} from '../../painted/edu09/stage';
import type {EpisodeVideos} from '../types';
import {edu9CaptionEvents} from './cues';

/**
 * EDU-EP09-SHORT (C28 "นิ้วนางยกไม่ขึ้น") W5.3 Draft (Editor, 8 Nov 2026): scene sheets EDU-EP09-SHEETS-R2 (scripts/edu-series/ep09/scene-sheets.md), brief R2.0, script R1.4, voice lock W4 (Kore A s2).
 * 19 shots = 19 scenes, 1606 f at 30 fps (53.53 s), hard cuts only. One plate per shot, ID `EDU9-<shot id>` (src/painted/edu09/shots/<shot id>.tsx, listed by src/painted/shots/edu09.tsx).
 * Narration = scripts/edu-series/ep09/narration-place.py -> public/narration/EDU-EP09-SHORT-draft.wav (the locked read in pieces A-D + V01 child-boy + V02 Algenib laugh); sound stem =
 * scripts/edu-series/ep09/sound-mix.py; captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Label "ภาพประกอบ" is a plate overlay pill (brief slot x 816-1020, y 148-204).
 * Ending `B_loop`, `endHoldSec: 0` (the 2.5 s hold is live in S01-B05-SH03; the last frame equals frame 0). Channel mark @TamMaiLa (chrome).
 */
const cuts = SHOT_RANGES.map(([id, start, end]) => ({id, start, end}));
if (cuts.at(-1)!.end !== TOTAL || TOTAL !== 1606) throw new Error(`EDU-EP09-SHORT: shots sum to ${cuts.at(-1)!.end}, scene sheets say 1606`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu9PlateId(cut.id)}})),
  captions: edu9CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep09',
  videos: [{
    id: 'EDU-EP09-SHORT', format: 'short', timeline, ending: 'B_loop', endHoldSec: 0,
    narration: {src: 'narration/EDU-EP09-SHORT-draft.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP09-SHORT-draft-stem-r4.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

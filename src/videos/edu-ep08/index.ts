import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_RANGES, TOTAL} from '../../painted/edu08/clock';
import {edu8PlateId} from '../../painted/edu08/shot';
import type {EpisodeVideos} from '../types';
import {edu8CaptionEvents} from './cues';

/**
 * EDU-EP08-SHORT (C18 "ถ้าถอดหมวกกลางอวกาศ") W5.3 Draft R2.4 (Editor, 8 Nov 2026; narration atempo 0.95): scene sheets EDU-EP08-SHEETS-R2.4 (scripts/edu-series/ep08/scene-sheets.md), script R1.3 (R1.3 voice re-lock), voice lock W4.
 * 21 shots = 21 scenes, 1745 f at 30 fps (58.17 s), hard cuts (the one grade, the chamber sepia, is in-canvas). Ending `A_fade`, live (endHoldSec 0), fade 0.8 s.
 * One plate per shot, ID `EDU8-<shot id>` (src/painted/edu08/shots/<shot id>.tsx, listed by src/painted/shots/edu08.tsx). Narration = scripts/edu-series/ep08/narration-place.py ->
 * public/narration/EDU-EP08-SHORT-narration-v3.wav (Kore A cut2 lines L01-L13 at atempo 0.95, L13 0.9 s fade, V01 Aoede B, V02 Algenib A with the radio filter after the atempo); sound stem = scripts/edu-series/ep08/sound-mix.py; captions = ./cues.ts
 * (edu stroke, no band, bottom edge y 1344). Timer ring and the "สมมติ" stamp are plate overlays. Channel mark @TamMaiLa (chrome default).
 */
const cuts = SHOT_RANGES.map(([id, start, end]) => ({id, start, end}));
if (cuts.at(-1)!.end !== TOTAL || TOTAL !== 1745) throw new Error(`EDU-EP08-SHORT: shots sum to ${cuts.at(-1)!.end}, scene sheets say 1745`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu8PlateId(cut.id)}})),
  captions: edu8CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep08',
  videos: [{
    id: 'EDU-EP08-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0.8,
    narration: {src: 'narration/EDU-EP08-SHORT-narration-v3.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP08-SHORT-draft-stem-v3.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

import amplitude from '../../../scripts/edu-series/short/EDU-EP01-SHORT.amplitude.json';
import {EDU1_CAPTION_CENTRE_Y, eduCaptionEvents} from '../../painted/edu01/captions';
import {edu1PlateId} from '../../painted/shots/edu01';
import {EDU1_SHOTS, EDU1_TOTAL} from '../../painted/edu01/plates';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP01-SHORT picture draft (W5.2, Boss, 4 Nov 2026): the hypnic-jerk short (C2 dream-fall), scene sheets EDU-SHEETS-R1.1
 * (scripts/edu-series/short/scene-sheets.md), 23 shots = 23 timeline scenes, 1860 f at 30 fps (62.00 s). Each scene mounts the
 * registry plate `EDU1-<shot id>` (src/painted/shots/edu01.tsx over src/painted/edu01/plates.tsx). Picture only: no narration,
 * captions, tag, name card or sound until W5.3. W5.3 (Editor, 4 Nov 2026): locked Kore v1 narration (public/narration/EDU-EP01-SHORT.wav, 61.97 s, offset 0),
 * script Sub captions (src/painted/edu01/captions.ts), the "ภาพจำลอง" label on B03-SH02..SH04, shade + name card in the plate overlay, and the sound stem
 * (scripts/edu-series/short/sound-mix.py: pad, clock, wind, one-shots, plucks, gasp as one 62.000 s track; digital zero f535-550). `C_seamless` with `loopBlendFrames` 15 per brief VD02.
 * Review stills: `node scripts/render.mjs EDU-EP01-SHORT --stills --frames=...` (never a whole-timeline render).
 */
const FPS = 30;
if (EDU1_TOTAL !== 1860) throw new Error(`EDU-EP01-SHORT: shots sum to ${EDU1_TOTAL}, scene sheets say 1860`);
const starts = EDU1_SHOTS.map((_, i) => EDU1_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
const cuts = EDU1_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

/** VD04: the reconstruction tag covers the imagined fall, B03-SH02 to SH04; off on the jolt (SH05). */
const TAGGED = new Set(['S01-B03-SH02', 'S01-B03-SH03', 'S01-B03-SH04']);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu1PlateId(cut.id), ...(TAGGED.has(cut.id) ? {label: 'ภาพจำลอง'} : {})}})),
  captions: eduCaptionEvents(),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep01',
  videos: [{
    id: 'EDU-EP01-SHORT', format: 'short', timeline, ending: 'C_seamless', loopBlendFrames: 15,
    narration: {src: 'narration/EDU-EP01-SHORT.wav', amplitude, fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP01-SHORT-sound-stem-v3.wav', volume: 1}],
    captionStyle: {preset: 'outline', position: 'middle', centerY: EDU1_CAPTION_CENTRE_Y, fadeOutWithLoop: true},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

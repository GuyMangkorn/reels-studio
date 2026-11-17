import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU20_SHOTS, FPS, plateId} from '../../painted/edu20/shots/index';
import type {EpisodeVideos} from '../types';
import {edu20CaptionEvents} from './cues';

/**
 * EDU-EP20-SHORT (C82 helium balloon in an accelerating car, ลูกโป่งฮีเลียมในรถ) W5.3 Draft (Editor, 16 Nov 2026): timed scene sheet
 * EDU-EP20-SS-R3, SS-R4 Draft round 1 re-cut, SS-R5 narration R2 re-cut (storyboards/edu-ep20/short/scene-sheet.md), SCRIPT-R2, voice lock VOICE-MEASURE-R3 (narration R2 = E + new L13, 48.073688 s), LOOK-R1
 * LF20-CABIN-B, cue sheet scripts/edu-series/ep20/short/sound-cues.json (Ton). 11 shots = 11 scenes, 1619 f at 30 fps (53.967 s),
 * hard cuts only. Plates `EDU20-<shot id>` (src/painted/shots/edu20.tsx, timing src/painted/edu20/shots/index.ts); B04-SH01 holds two
 * plates on one canvas: the settled plate dissolves over the residual one at local 70-95 (G915-940, the labelled story-time ellipsis).
 * Narration = the locked E file whole at G0 (no cut, no gain); sound stem = scripts/edu-series/ep20/sound-mix.py (the 7 cues of the
 * cue sheet). Captions = ./cues.ts (edu stroke, no band, bottom edge y1248 = the sheet's reserve bottom). Overlay `edu20` = ./chrome.tsx
 * (pressure insets, ellipsis label, direction aids). Channel mark @TamMaiLa = chrome default (top-left); ภาพจำลอง = overlay, under the mark.
 * Ending (SS-R5 END20): closed; B05-SH03 runs to G1619 with the settle from G1465 (balloon upright, lean 0, camera D->A); `A_fade` over
 * the last 40 f (G1579-1619, no freeze); MUS20-OUTRO G1445, SFX20-END G1560, AMB20 fades G1579-1619 (sound-mix.py, stem v3). SS-R4 Draft round 1:
 * channel mark `channelLabelStyle: 'outline'` (Boss; the ink mark was lost on the hair); B04-SH01 SETTLED plate is a picture crossfade.
 */
const cuts = EDU20_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.len}));
const TOTAL = 1619;   // SS-R5 FD20-R5-01 (SS-R4 1590, SS-R3 1504)
if (cuts.at(-1)!.end !== TOTAL || DURATION !== TOTAL) throw new Error(`EDU-EP20-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says ${TOTAL}`);

/** B04-SH01 story-time dissolve: the settled plate from local 70 over 25 f, on the shot clock (fromSec = atSec). */
const ELLIPSIS_AT = 845 + 70;
const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: [
    ...cuts.map((cut) => ({at: cut.start, cue: {shot: plateId(cut.id)}})),
    {at: ELLIPSIS_AT, cue: {shot: plateId('B04-SH01') + '-SETTLED', fromSec: 70 / FPS, dissolveSec: 25 / FPS}},
  ].sort((a, b) => a.at - b.at),
  captions: edu20CaptionEvents(cuts.map((c) => c.start)),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep20',
  channel: 'edu',
  videos: [{
    id: 'EDU-EP20-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 40 / FPS,
    narration: {src: 'narration/EDU-EP20-SHORT-narration-E.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP20-SHORT-draft-stem-v3.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1248, ...CAPTION_OUTLINE},
    chrome: {progressBar: false, channelLabelStyle: 'outline'},
    overlay: 'edu20',
  }],
};
export default videos;

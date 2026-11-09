import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, FPS, SHOTS} from '../../painted/edu11/clock';
import {edu11PlateId} from '../../painted/shots/edu11';
import type {EpisodeVideos} from '../types';
import {edu11CaptionEvents} from './cues';

/**
 * EDU-EP11-SHORT (C32 lift free-fall) W5.3 Draft (Editor, 9 Nov 2026): scene sheets EDU-EP11-SHEETS-R1.3 (scripts/edu-series/ep11/scene-sheets.md), script R3, voice lock R2/R2.1.
 * 25 shots = 25 scenes, 1788 f at 30 fps (59.60 s), hard cuts (the fade-up and the inset moves are inside the shot, Boss's `Shot`). Plates `EDU11-<shot id>` (src/painted/shots/edu11.tsx).
 * Narration = scripts/edu-series/ep11/narration-place.py -> public/narration/EDU-EP11-SHORT-narration-v2.wav (Kore A x0.92 re-gap 0.28 s + Leda V01-V04 + hold exhale, no gain);
 * sound stem = scripts/edu-series/ep11/sound-mix.py; captions = ./cues.ts (edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa is drawn by the plates (stroked, readable on sepia), so chrome.channelLabel is false. Ending: closed, 2.0 s hold is the last shot; no end fade.
 */
const cuts = SHOTS.map(([id, start, end]) => ({id, start, end}));
if (cuts.at(-1)!.end !== DURATION || DURATION !== 1788) throw new Error(`EDU-EP11-SHORT: shots sum to ${cuts.at(-1)!.end}, scene sheets say 1788`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu11PlateId(cut.id)}})),
  captions: edu11CaptionEvents(cuts.map((c) => c.start), DURATION),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep11',
  videos: [{
    id: 'EDU-EP11-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP11-SHORT-narration-v2.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP11-SHORT-draft-stem-v5.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {channelLabel: false, progressBar: false},
  }],
};
export default videos;

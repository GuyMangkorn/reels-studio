import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE} from '../../painted/edu17/clock';
import {edu17PlateId} from '../../painted/edu17/stage';
import type {EpisodeVideos} from '../types';
import {edu17CaptionEvents} from './cues';

/**
 * EDU-EP17-SHORT (C61 underwater cable) W5.3 redraft (Editor, 15 Nov 2026): timed scene sheets EDU-EP17-SHEETS-R1.2 (scripts/edu-series/ep17/scene-sheets.md), script R1.2.1, narration candidate B (user, 15 Nov 2026), V01-V03 / W-SKY slot gaps kept.
 * 25 shots = 25 scenes, 1709 f at 30 fps (56.97 s), hard cuts plus two 6 f in-canvas dissolves starting at the incoming cue, B01-SH02 -> SH03 (cut G132, G132-138) and SH03 -> SH04 (cut G164, G164-170; SD29). Plates `EDU17-<shot id>` (src/painted/shots/edu17.tsx).
 * Narration = scripts/edu-series/ep17/narration-place.py -> public/narration/EDU-EP17-SHORT-narration-v2.wav (candidate B read in 6 segments + V01-V03 Algenib + the sister laugh);
 * sound stem = scripts/edu-series/ep17/sound-mix.py (the 71 cues of sound-cues.json, re-placed by cue-remap.py); captions = ./cues.ts (37 cues, edu stroke, no band, bottom edge y 1344). Channel mark @TamMaiLa = chrome default (top-left).
 * Screen layers (reconstruction grade G1064-1207 and G1252-1364, LBL G1064-1364, CARD G1064-1207) = ./chrome.tsx (overlay `edu17`). Ending: closed, the W-HOLD (L19 end + 60.8 f) is inside the last shot; END1 G1650-1707; no end fade.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
const TOTAL = 1709; // v2 voice re-lock (EDU-EP17-SHEETS-R1.2)
if (cuts.at(-1)!.end !== TOTAL) throw new Error(`EDU-EP17-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says ${TOTAL}`);
const DISSOLVE = 6 / FPS;
const dissolves: Record<string, number> = {'S01-B01-SH03': DISSOLVE, 'S01-B01-SH04': DISSOLVE};

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu17PlateId(cut.id), ...(dissolves[cut.id] ? {dissolveSec: dissolves[cut.id]} : {})}})),
  captions: edu17CaptionEvents(cuts.map((c) => c.start), TOTAL),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep17',
  videos: [{
    id: 'EDU-EP17-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP17-SHORT-narration-v2.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP17-SHORT-draft-stem-v2.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE},
    chrome: {progressBar: false},
    overlay: 'edu17',
  }],
};
export default videos;

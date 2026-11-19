import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU26_SHOTS, FPS, plateId} from '../../painted/edu26/shots/index';
import {edu26CaptionEvents} from '../../painted/edu26/captions26';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP26-SHORT (the Roman laundry shift, Marcus and the urine tax) W5 Draft timeline (Editor, 19 Nov 2026): timed scene sheets
 * EDU-EP26-SHEET-R2 (scripts/edu-series/ep26/short/timed-sheet-a.md + timed-sheet-b.md), 20 shots = 20 scenes on G0-1893 (1894 f at 30 fps,
 * 63.13 s), script EDU-EP26-SCRIPT-R3, voice EDU-EP26-VOICE-R3. Plates `EDU26-<shot id>` (src/painted/shots/edu26.tsx, timing
 * src/painted/edu26/shots/index.ts). All cuts are hard except two the sheet names: the 10 f time-passing dissolve G1037-1047 (B03-SH06 ->
 * B04-SH01: the B04-SH01 scene starts at G1037 and its first plate cue carries `dissolveSec` 10/30; the plate runs 5 f of pre-roll so the sheet's
 * L0 stays G1042) and the coin wipe G1434-1460 drawn inside the B05-SH01 end / B06-SH01 start plates (no timeline field).
 * Narration = the locked EP26-narration-full-r3.wav padded to 1894 f; sound stem = scripts/edu-series/ep26/short/sound-mix.py from the cue sheet
 * scripts/edu-series/ep26/sound-cues.json (EDU-EP26-SOUND-R1). Captions = src/painted/edu26/captions26.ts (61 cards, drawn by overlay `edu26` = src/videos/edu-ep26/chrome.tsx at 71 px with the pop-in; edu outline
 * stroke; the timeline captions are data only, preset none; a cue-gated `CaptionShade` inside each plate, strength per shot). Story label แต่งเติมจากเรื่องจริง on every plate cue from frame 0 to the end;
 * channel mark @TamMaiLa top-left (chrome default). Ending: closed, the 2.0 s hold is the last 60 f of B06-SH05 (G1834-1893), no picture fade, no
 * series ending sound (UT15, Film's C29 droop instead).
 */
const LABEL = 'แต่งเติมจากเรื่องจริง';
const DISSOLVE = {shot: 'B04-SH01', atFrame: 1037, frames: 10};

const cuts = EDU26_SHOTS.map((s) => ({id: s.id, start: s.id === DISSOLVE.shot ? DISSOLVE.atFrame : s.start, end: 0}));
cuts.forEach((c, i) => { c.end = i + 1 < cuts.length ? cuts[i + 1].start : DURATION; });
if (DURATION !== 1894) throw new Error(`EDU-EP26-SHORT: shot index sums to ${DURATION}, the sheet says 1894`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {
    shot: plateId(cut.id), label: LABEL,
    ...(cut.id === DISSOLVE.shot ? {dissolveSec: DISSOLVE.frames / FPS} : {}),
  }})),
  captions: edu26CaptionEvents(cuts.map((c) => c.start), DURATION),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep26',
  videos: [{id: 'EDU-EP26-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP26-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP26-SHORT-draft-stem-v1.wav', volume: 1}],
    overlay: 'edu26', captionStyle: {preset: 'none'},
    chrome: {channelLabelStyle: 'outline', progressBar: false}}],
};
export default videos;

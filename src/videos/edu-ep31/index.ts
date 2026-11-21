import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU31_SHOTS, FPS, plateId} from '../../painted/edu31/shots/index';
import {edu31CaptionEvents} from '../../painted/edu31/captions31';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP31-SHORT (the lemon juice robber) W5.3 Draft timeline (Editor, 21 Nov 2026): timed scene sheets EDU-EP31-SCENE-R1
 * (scripts/edu-series/ep31/short/scene-sheets/index.md + b01-b07.md), 24 shots = 24 scenes on G0-1794 (1795 f at 30 fps, 59.82 s), script
 * EDU-EP31-SCRIPT-R2, voice EDU-EP31-VOICE-R1 (store projects/edu/EDU/narration/ep31-voice-r1-1/preview.wav = public/narration/EDU-EP31-SHORT-narration-v1.wav,
 * offset 0, Kore x1.05 + Charon/Alnilam/Algenib character lines). Plates `EDU31-<shot id>` (src/painted/shots/edu31.tsx, timing
 * src/painted/edu31/shots/index.ts); every cut is a hard cut, no pre-roll, no dissolve. Captions = src/painted/edu31/captions31.ts (57 cards at 71.4 px,
 * safe box x120-888, bottom edge y1344), drawn by overlay `edu31` = src/videos/edu-ep31/chrome.tsx with the pop-in; the timeline captions are data only
 * (preset none); a cue-gated `CaptionShade` inside each plate (strength per shot). The reconstruction label VD31-17 is drawn by the same overlay (frame 0
 * to the end); the joke label VD31-19 is the plate's (B03-SH04, B07-SH01). Mark @TamMaiLa top-left (chrome default, outline look).
 * Ending: closed, the 2.0 s hold is the last 60 f of B07-SH03 (G1735-1794), no picture fade; series ending sound = Film's END-01 (bass tag at G1740 + finger
 * snap at G1768, UT15) from the cue sheet. Sound: the stem `audio/edu/EDU-EP31-SHORT-draft-stem-v1.wav` is baked from scripts/edu-series/ep31/short/sound-cues.json
 * (76 cues) by `short/sound-mix.py` and played as the `audio` track; the narration is its own track.
 */
if (DURATION !== 1795 || EDU31_SHOTS.length !== 24) throw new Error(`EDU-EP31-SHORT: shot index has ${EDU31_SHOTS.length} shots / ${DURATION} f, the sheet says 24 / 1795`);

const cuts = EDU31_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.N}));
const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: plateId(cut.id)}})),
  captions: edu31CaptionEvents(cuts.map((c) => c.start), DURATION),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep31',
  videos: [{id: 'EDU-EP31-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP31-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP31-SHORT-draft-stem-v1.wav', volume: 1}],
    overlay: 'edu31', captionStyle: {preset: 'none'},
    chrome: {channelLabelStyle: 'outline', progressBar: false}}],
};
export default videos;

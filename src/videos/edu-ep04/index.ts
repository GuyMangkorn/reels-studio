import {assemblePaintedTimeline} from '../../scenes/assemble';
import {edu4PlateId} from '../../painted/shots/edu04';
import {EDU4_SHOTS, EDU4_TOTAL} from '../../painted/edu04/shots';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP04-SHORT picture draft (W5.2, Boss, 5 Nov 2026): C4 supermarket-queue short, scene sheets EDU-EP04-SHEETS-R1
 * (scripts/edu-series/ep04/scene-sheets.md), 20 shots = 20 timeline scenes, 1662 f at 30 fps (55.40 s). Each scene mounts the registry plate
 * `EDU4-<shot id>` (src/painted/shots/edu04.tsx over src/painted/edu04/shots.tsx). Picture only, G1 (B01-B02, B03-SH01) and G2 (`PLAN`, B03-SH02..SH05) built; G3-G4 are empty
 * paper plates until their group. No narration, captions, sound or tag yet (W5.3, Editor). Ending A_fade, live hold, fade 1.0 s (brief VD15).
 * Review stills: `node scripts/render.mjs EDU-EP04-SHORT --stills --frames=...` (never a whole-timeline render).
 */
const FPS = 30;
if (EDU4_TOTAL !== 1662) throw new Error(`EDU-EP04-SHORT: shots sum to ${EDU4_TOTAL}, scene sheets say 1662`);
const starts = EDU4_SHOTS.map((_, i) => EDU4_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
const cuts = EDU4_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

const assembled = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu4PlateId(cut.id)}})),
  captions: cuts.map((cut) => ({at: cut.start, text: ''})), // placeholders: the timeline needs one cue per scene; captions are W5.3 (Editor)
});

const timeline = assembled; // VD08: the "แบบจำลอง" eyebrow is drawn by the PLAN plates (ModelEyebrow, top-right pill of LF02), shown from the first frame

const videos: EpisodeVideos = {
  episode: 'edu-ep04',
  videos: [{
    id: 'EDU-EP04-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 1.0,
    // Rough review mix (Editor, 6 Nov 2026; scripts/edu-series/ep04/review-mix.py): narration + MAN/CSH per VL-EDIT-01, library-only stem. Not the final mix.
    narration: {src: 'narration/EDU-EP04-SHORT.wav', amplitude: [], fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP04-SHORT-review-stem-v5.wav', volume: 1}],
    captionStyle: {preset: 'outline', position: 'middle', centerY: 1164},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

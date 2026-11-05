import amplitude from '../../../scripts/edu-series/ep02/EDU-EP02-SHORT.amplitude.json';
import {EDU2_CAPTION_BOTTOM_Y, EDU2_CAPTION_SHADE, EDU2_CUTS, EDU2_TOTAL, edu2CaptionEvents} from '../../painted/edu02/captions';
import {EDU2_DISSOLVES} from '../../painted/edu02/shots';
import {edu2PlateId} from '../../painted/shots/edu02';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP02-SHORT (หัวหอมแก้แค้น, C1) Draft timeline (W5.3, Editor, 5 Nov 2026): scene sheets SS-R2 (scripts/edu-series/ep02/scenes/), script R1.1,
 * brief EDU-BRIEF-R1.5, voice = Gemini Kore fast read (store projects/EDU/narration/ep02/2026-11-05_ep02-narration-kore-fast.wav). 23 shots = 23 scenes, 1771 f at 30 fps (59.03 s).
 * Each scene mounts the registry plate `EDU2-<shot id>` (src/painted/shots/edu02.tsx over Boss's `plateOf`). Narration = the read placed as segments N1-N7 with the
 * six gaps G1..G7 (scripts/edu-series/ep02/narration-place.py -> public/narration/EDU-EP02-SHORT.wav, 1771 f). Sound stem (scripts/edu-series/ep02/sound-mix.py):
 * bed, ambience, SFX, cook vocal takes and stings as one track. Captions bottomEdgeY 1344 with an outline shade (no dark band). The `ภาพจำลอง` tag covers B03-B04 from c 333 (cue `labelAtSec`, 9 f into
 * B03-SH01's 15 f dissolve) to c 875, at y 200 (cue `labelTop`, Boss W5.3 fix 4: clears the B04-SH01 wall pan, one position for the whole tag).
 * `A_fade`: no freeze (endHoldSec 0), fade over the last 0.75 s. Review stills/clips: `node scripts/render.mjs EDU-EP02-SHORT --stills --frames=...`, `scripts/storyboard-page/clips.mjs`.
 */
const FPS = 30;
if (EDU2_TOTAL !== 1771) throw new Error(`EDU-EP02-SHORT: shots sum to ${EDU2_TOTAL}, scene sheets say 1771`);

/** VD08: the reconstruction tag covers the inside-the-onion and eye shots, B03 and B04. */
const TAGGED = new Set(EDU2_CUTS.filter(({id}) => /^S01-B0[34]-/.test(id)).map(({id}) => id));
/** Tag start (c 333, Film viewer check r1) and box top in px (default LABEL_BOX.short top 300 crosses the B04-SH01 wall pan l 0-26). */
const TAG = {text: 'ภาพจำลอง', from: 333, top: 200};
/** SS-R2 dissolve (EDU2_DISSOLVES from Boss) as `dissolveSec` on the incoming plate. */
const DISSOLVE = new Map<string, number>(EDU2_DISSOLVES.map(([, to, d]) => [to, d / FPS]));

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts: EDU2_CUTS,
  shots: EDU2_CUTS.map((cut) => ({at: cut.start, cue: {shot: edu2PlateId(cut.id), ...(DISSOLVE.has(cut.id) ? {dissolveSec: DISSOLVE.get(cut.id)} : {}), ...(TAGGED.has(cut.id) ? {label: TAG.text, labelTop: TAG.top, ...(TAG.from > cut.start ? {labelAtSec: (TAG.from - cut.start) / FPS} : {})} : {})}})),
  captions: edu2CaptionEvents(),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep02',
  videos: [{
    id: 'EDU-EP02-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0.75,
    narration: {src: 'narration/EDU-EP02-SHORT.wav', amplitude, fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP02-SHORT-sound-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: EDU2_CAPTION_BOTTOM_Y, ...EDU2_CAPTION_SHADE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

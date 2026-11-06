import amplitude from '../../../scripts/edu-series/ep03/EDU-EP03-SHORT.amplitude.json';
import {EDU3_CAPTION_BOTTOM_Y, EDU3_CAPTION_SHADE, EDU3_CUTS, EDU3_TAG, EDU3_TAGGED, EDU3_TAG_TOP, EDU3_TOTAL, edu3CaptionEvents} from '../../painted/edu03/captions';
import {edu3PlateId} from '../../painted/shots/edu03';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {PaintedItem} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP03-SHORT (ลูกบอลสีแดงที่หมามองไม่เห็น, C5) Draft timeline (W5.3, Editor, 5 Nov 2026): scene sheets SS-R3.1 (scripts/edu-series/ep03/scenes/),
 * script R1.1, brief EDU-BRIEF-R2.2, voice = Gemini Kore v1 (store projects/EDU/narration/narration-ep03-kore.wav) + owner Algenib O1/O2.
 * 15 shots = 15 scenes, 1571 f at 30 fps (52.37 s), hard cuts only. Each scene mounts the registry plate `EDU3-<shot id>` (src/painted/shots/edu03.tsx over
 * Boss's `plateOf`; dog view = backdrop-filter colour matrix in the adapter's Overlay). Narration = the read placed as segments N1-N6 with gaps G1..G5
 * (scripts/edu-series/ep03/narration-place.py -> public/narration/EDU-EP03-SHORT.wav, 1571 f). Sound stem (scripts/edu-series/ep03/sound-mix.py): bed,
 * ambience, SFX, owner lines O1/O2 as one track. Captions bottomEdgeY 1344 with the EP02 outline shade (no band). The tag `ภาพจำลอง (โดยประมาณ)` is the
 * timeline `label` on the shots whose frames carry dog-view colour (B03-B04 from the first flip frame, B06-SH02), box top y 200 (Boss W5.2).
 * Ending `B_loop` with `endHoldSec: 0`: the 3.0 s hold is live inside B07-SH01 (sheet), the last frame runs into frame 0 with no freeze.
 */
const FPS = 30;
if (EDU3_TOTAL !== 1571) throw new Error(`EDU-EP03-SHORT: shots sum to ${EDU3_TOTAL}, scene sheets say 1571`);

/** B04 positioned items (Boss PaintedItem, frames in the plate's own shot frames l; moved off the plate spec's screen layer, W5.3). */
const ITEMS: Record<string, PaintedItem[]> = {
  'S01-B04-SH01': [{kind: 'label', text: 'คน: 3 แบบ', x: 560, y: 540, atFrame: 78}, {kind: 'label', text: 'หมา: 2 แบบ', x: 830, y: 310, atFrame: 123}],
  'S01-B04-SH02': [{kind: 'card', text: 'ขาวดำ', x: 600, y: 420, w: 220, h: 90, atFrame: 40, untilFrame: 104, strikeAtFrame: 84, strikeFrames: 10}],
};

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts: EDU3_CUTS,
  shots: EDU3_CUTS.map((cut) => ({at: cut.start, cue: {shot: edu3PlateId(cut.id), ...(EDU3_TAGGED.has(cut.id) ? {label: EDU3_TAG, labelTop: EDU3_TAG_TOP} : {}), ...(ITEMS[cut.id] ? {items: ITEMS[cut.id]} : {})}})),
  captions: edu3CaptionEvents(),
});

const videos: EpisodeVideos = {
  episode: 'edu-ep03',
  videos: [{
    id: 'EDU-EP03-SHORT', format: 'short', timeline, ending: 'B_loop', endHoldSec: 0,
    narration: {src: 'narration/EDU-EP03-SHORT.wav', amplitude, fps: FPS},
    audio: [{src: 'audio/edu/EDU-EP03-SHORT-sound-stem-v1.wav', volume: 1}],
    captionStyle: {preset: 'outline', bottomEdgeY: EDU3_CAPTION_BOTTOM_Y, ...EDU3_CAPTION_SHADE},
    chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  }],
};
export default videos;

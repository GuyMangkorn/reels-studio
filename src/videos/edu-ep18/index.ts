import {assemblePaintedTimeline} from '../../scenes/assemble';
import {FPS, SHOT_TABLE, TOTAL_FRAMES} from '../../painted/edu18/clock';
import {edu18PlateId} from '../../painted/shots/edu18';
import type {EpisodeVideos} from '../types';

/**
 * EDU-EP18-SHORT (mosquito rides a raindrop) W5.2 Boss blockout: timed sheet EDU-EP18-ROWS-R2.0 (scripts/edu-series/ep18/storyboard.md), 21 shots, 1468 f at 30 fps (48.93 s), hard cuts.
 * Plates `EDU18-<shot id>` (src/painted/shots/edu18.tsx). Picture only: narration, captions, the sound stem and the end handling are Editor's (W5.3), not registered here.
 */
const cuts = SHOT_TABLE.map(([id, start, len]) => ({id, start, end: start + len}));
if (cuts.at(-1)!.end !== TOTAL_FRAMES || TOTAL_FRAMES !== 1468) throw new Error(`EDU-EP18-SHORT: shots sum to ${cuts.at(-1)!.end}, the sheet says 1468`);

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: edu18PlateId(cut.id)}})),
  captions: cuts.map((cut) => ({at: cut.start, text: ''})), // placeholder cue per scene (assemble needs one at each scene start); Editor replaces them with the script captions
});

const videos: EpisodeVideos = {
  episode: 'edu-ep18',
  channel: 'edu',
  videos: [{id: 'EDU-EP18-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {progressBar: false}}],
};
export default videos;

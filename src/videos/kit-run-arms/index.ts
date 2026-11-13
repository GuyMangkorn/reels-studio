import {RUN_ARMS_SEC} from '../../painted/shots/kit-run-arms';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-RUN-ARMS-CLIP: the P38 run cycle at camera azimuths 0, 45 and 315 deg (front and front three-quarters) on a jacketed man and a
 * woman in a skirt, one scene. A motion check for the run arm pump and the turned side of the torso (KIT-RUN-ARMS, 13 Nov 2026). Silent,
 * no captions or chrome. Not an episode. Render with `node scripts/render.mjs KIT-RUN-ARMS-CLIP --draft`.
 */
const timeline: Timeline = [{durationSec: RUN_ARMS_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-run-arms', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-run-arms',
  videos: [{id: 'KIT-RUN-ARMS-CLIP', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

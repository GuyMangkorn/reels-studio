import {RAPTOR_MOTION_SEC} from '../../painted/shots/kit-raptor-motion';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-RAPTOR-MOTION: the RAPTOR kit creature in motion, side view, one scene: WALK 3 cycles, STAND 1 s, POUNCE once, landing held 0.5 s
 * (kit test, 14 Nov 2026). Silent, no captions or chrome. Not an episode. Render with `node scripts/render.mjs KIT-RAPTOR-MOTION --draft`.
 */
const timeline: Timeline = [{durationSec: RAPTOR_MOTION_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-raptor-motion', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-raptor-motion',
  videos: [{id: 'KIT-RAPTOR-MOTION', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

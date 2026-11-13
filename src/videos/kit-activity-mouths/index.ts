import {ACTIVITY_CLIP_SEC} from '../../painted/shots/kit-activity-mouths';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-ACTIVITY-CLIP: the kit's activity mouths in motion (run pant, talk cycle, a surprise landing mid-run), front / 3/4 / profile, one
 * scene. A motion check for `activity-mouths.ts`. Silent, no captions or chrome. Not an episode.
 * Render with `node scripts/render.mjs KIT-ACTIVITY-CLIP --range=0-119`.
 */
const timeline: Timeline = [{durationSec: ACTIVITY_CLIP_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-activity-mouths', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-activity-mouths',
  videos: [{id: 'KIT-ACTIVITY-CLIP', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

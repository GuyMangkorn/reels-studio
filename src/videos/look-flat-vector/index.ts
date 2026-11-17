import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * LOOK-FLAT-NIGHTCART: a 3 s look sample of the flat vector style, not an episode. The picture is the
 * `look-flat-vector` overlay (`./scene.tsx`, plain SVG) above one empty scene; no narration, captions or chrome.
 * Still: `node scripts/render.mjs LOOK-FLAT-NIGHTCART --stills --frames=45`.
 */
const timeline: Timeline = [{durationSec: 3, bg: 'none', actors: [], subtitle: ''}];

const videos: EpisodeVideos = {
  episode: 'look-flat-vector',
  videos: [{id: 'LOOK-FLAT-NIGHTCART', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, overlay: 'look-flat-vector', chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

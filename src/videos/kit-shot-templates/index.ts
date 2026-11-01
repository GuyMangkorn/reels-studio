import {TEMPLATE_REEL, TEMPLATE_SCENE_SEC} from '../../painted/kit/template-reel';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-SHOT-TEMPLATES: the shot templates of the painted kit (`src/painted/kit/shot-templates.ts`), one template per timeline scene of
 * TEMPLATE_SCENE_SEC seconds, each labelled with its shot ID and casting lines. Not an episode; silent, no captions or chrome.
 * Render with `node scripts/render.mjs KIT-SHOT-TEMPLATES --gl=angle --timeout=180000`.
 */
const timeline: Timeline = TEMPLATE_REEL.map((e) => ({
  durationSec: TEMPLATE_SCENE_SEC, bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot: e.shot, atSec: 0}]},
}));

const videos: EpisodeVideos = {
  episode: 'kit-shot-templates',
  videos: [{id: 'KIT-SHOT-TEMPLATES', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

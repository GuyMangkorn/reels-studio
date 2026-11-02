import {ANIMAL_REEL, animalReelSceneSec, animalReelShotId} from '../../painted/kit/animal-motions';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-ANIMAL-MOTIONS: the animal motion presets of the painted kit (`src/painted/kit/animal-motions.ts`), one motion per timeline
 * scene, shown on a dog (far lane) and a cat (near lane), labelled with the stable ID. Silent, no captions or chrome. Not an episode.
 * Render with `node scripts/render.mjs KIT-ANIMAL-MOTIONS --gl=angle --timeout=180000`.
 */
const timeline: Timeline = ANIMAL_REEL.map((e) => ({
  durationSec: animalReelSceneSec(e), bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot: animalReelShotId(e.motion), atSec: 0}]},
}));

const videos: EpisodeVideos = {
  episode: 'kit-animal-motions',
  videos: [{id: 'KIT-ANIMAL-MOTIONS', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

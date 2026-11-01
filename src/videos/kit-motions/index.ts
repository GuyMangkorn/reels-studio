import {MOTION_REEL, reelSceneSec, reelShotId} from '../../painted/kit/motion-reel';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-MOTIONS: the motion presets of the painted kit (`src/painted/kit/motions.ts`), one motion per timeline scene so each is
 * rendered, cached and reviewed alone. Every scene shows the motion on an adult and a child (or a second adult), labelled with its
 * stable ID. Scene lengths come from `reelSceneSec` (motion length + 0.4 s hold). Silent, no captions or chrome. Not an episode.
 * Render with `node scripts/render.mjs KIT-MOTIONS --gl=angle --timeout=180000`.
 */
const timeline: Timeline = MOTION_REEL.map((e) => ({
  durationSec: reelSceneSec(e), bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot: reelShotId(e.motion), atSec: 0}]},
}));

const videos: EpisodeVideos = {
  episode: 'kit-motions',
  videos: [{id: 'KIT-MOTIONS', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

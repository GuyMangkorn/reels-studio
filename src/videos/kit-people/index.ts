import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-PEOPLE-TALK: a 3.5 s proof clip of the painted kit's people library (`src/painted/kit/people.ts`), not an episode: three
 * template characters (front and profile views) talk, with mouths driven by `mouthAt()` over the existing narration envelope
 * (`src/amplitude.json`) and the rig's own blink. One painted scene, no narration, captions or chrome (the clip is silent).
 * Render with `node scripts/render.mjs KIT-PEOPLE-TALK --gl=angle --timeout=180000`.
 */
const timeline: Timeline = [{
  durationSec: 3.5, bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot: 'kit-people-talk', atSec: 0}]},
}];

const videos: EpisodeVideos = {
  episode: 'kit-people',
  videos: [{id: 'KIT-PEOPLE-TALK', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

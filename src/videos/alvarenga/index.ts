import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * ALV-LOOK: look frames L1-L3 of ALV-EP01-SHORT (storyboard W3.1), three 1 s painted scenes (frame 0 of each is the look still).
 * Not the episode timeline (that waits for the voice lock). Stills: `node scripts/render.mjs ALV-LOOK --stills --frames=0,30,60 --gl=angle`.
 */
const timeline: Timeline = ['alv-look-l1', 'alv-look-l2', 'alv-look-l3'].map((shot) => ({
  durationSec: 1, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot, atSec: 0}]},
}));

const videos: EpisodeVideos = {
  episode: 'alvarenga',
  videos: [{id: 'ALV-LOOK', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

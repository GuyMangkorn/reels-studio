import {VIEW_RUN_SEC} from '../../painted/shots/kit-view-run';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-VIEW-RUN: the P38 run cycle at camera azimuths 180, 210 and 240 deg (back and back three-quarter, VA02), on a skirted and a
 * trousered person, one scene. A motion check for the kit's turned back views. Silent, no captions or chrome. Not an episode.
 * Render with `node scripts/render.mjs KIT-VIEW-RUN --draft`.
 */
const timeline: Timeline = [{durationSec: VIEW_RUN_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-view-run', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-view-run',
  videos: [{id: 'KIT-VIEW-RUN', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

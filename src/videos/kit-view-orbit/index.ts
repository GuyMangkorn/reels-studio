import {VIEW_ORBIT_SEC} from '../../painted/shots/kit-view-orbit';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-VIEW-ORBIT: one full camera orbit around a standing skirted and a trousered person with the default view cues, so the turn from
 * three-quarter to profile and back can be checked in motion. Silent, no captions or chrome. Not an episode.
 * Render with `node scripts/render.mjs KIT-VIEW-ORBIT --draft`.
 */
const timeline: Timeline = [{durationSec: VIEW_ORBIT_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-view-orbit', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-view-orbit',
  videos: [{id: 'KIT-VIEW-ORBIT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

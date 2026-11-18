import {HEAD_TALK_TURN_SEC, HEAD_TURN_SEC} from '../../painted/shots/kit-head-turn';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KIT-HEAD-TURN: a close camera swings from the front to each profile and back around two `sideDetail` heads, so head height and
 * face read can be compared front to profile. Silent, no captions or chrome. Not an episode.
 * KIT-HEAD-TALK-TURN: the same pair talking through a continuous turn (12 s).
 * Render with `node scripts/render.mjs KIT-HEAD-TURN --draft` (or KIT-HEAD-TALK-TURN).
 */
const timeline: Timeline = [{durationSec: HEAD_TURN_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-head-turn', atSec: 0}]}}];

const talkTimeline: Timeline = [{durationSec: HEAD_TALK_TURN_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-head-talk-turn', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-head-turn',
  videos: [{id: 'KIT-HEAD-TURN', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
    {id: 'KIT-HEAD-TALK-TURN', format: 'short', timeline: talkTimeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

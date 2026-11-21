import {PEOPLE_TALK_ALL_SEC} from '../../painted/shots/kit-people-talk-all';
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

/** KIT-PEOPLE-TALK-ALL (user 21 Nov 2026): all 14 PEOPLE talking through right profile, front and left profile (10 s, silent).
 * Render with `node scripts/render.mjs KIT-PEOPLE-TALK-ALL --draft`. */
const allTimeline: Timeline = [{durationSec: PEOPLE_TALK_ALL_SEC, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'kit-people-talk-all', atSec: 0}]}}];

const videos: EpisodeVideos = {
  episode: 'kit-people',
  videos: [{id: 'KIT-PEOPLE-TALK', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
    {id: 'KIT-PEOPLE-TALK-ALL', format: 'short', timeline: allTimeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

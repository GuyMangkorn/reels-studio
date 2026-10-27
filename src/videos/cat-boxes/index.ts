import catboxBlockout from '../../../scripts/cat-boxes/blockout.json';
import catboxLongBlockout from '../../../scripts/cat-boxes/blockout-long.json';
import catboxShortC01 from '../../../scripts/cat-boxes/short-c01.json';
import catboxShortC02 from '../../../scripts/cat-boxes/short-c02.json';
import catboxShortC03 from '../../../scripts/cat-boxes/short-c03.json';
import catboxShortC04 from '../../../scripts/cat-boxes/short-c04.json';
import catboxShortC05 from '../../../scripts/cat-boxes/short-c05.json';
import catboxShortC06 from '../../../scripts/cat-boxes/short-c06.json';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos, VideoDefinition} from '../types';

const short = (id: string, timeline: unknown): VideoDefinition => ({id, format: 'short', timeline: timeline as Timeline, ending: 'A_fade', loopFadeFrames: 12, sceneTransitionFrames: 12});

const catBoxes: EpisodeVideos = {
  episode: 'cat-boxes',
  videos: [
    // `Short` and `Long` are historical generic IDs kept stable; see scripts/cat-boxes/delivery.md.
    {id: 'Short', format: 'short', timeline: catboxBlockout as Timeline, ending: 'B_loop', sceneTransitionFrames: 12, loopFadeFrames: 12},
    {id: 'Long', format: 'long', timeline: catboxLongBlockout as Timeline, ending: 'B_loop'},
    short('CATBOX-C01-Short', catboxShortC01),
    short('CATBOX-C02-Short', catboxShortC02),
    short('CATBOX-C03-Short', catboxShortC03),
    short('CATBOX-C04-Short', catboxShortC04),
    short('CATBOX-C05-Short', catboxShortC05),
    short('CATBOX-C06-Short', catboxShortC06),
  ],
};
export default catBoxes;

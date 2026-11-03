import {coversVideo} from '../cover-overlay';
import type {EpisodeVideos} from '../types';
import {EG_COVER_STYLE, EG_COVERS} from './everyone-gone';
import {WDG_COVER_STYLE, WDG_COVERS} from './wendigo';

/**
 * Cover candidates per deliverable (docs/cover-principles.md), kept out of the episode modules so that editing a cover
 * never changes an episode's scene keys or pins. `scripts/render.mjs <ID>` renders `<ID>-COVERS` stills beside the MP4.
 */
const covers: EpisodeVideos = {
  episode: 'covers',
  videos: [
    coversVideo('WDG-EP01-SHORT', WDG_COVERS, WDG_COVER_STYLE),
    coversVideo('EG-EP01-SHORT', EG_COVERS, EG_COVER_STYLE),
  ],
};
export default covers;

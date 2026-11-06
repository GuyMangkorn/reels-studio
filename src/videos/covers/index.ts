import {coversVideo} from '../cover-overlay';
import type {EpisodeVideos} from '../types';
import {EDU1_COVER_STYLE, EDU1_COVERS} from './edu-ep01';
import {EDU2_COVER_STYLE, EDU2_COVERS} from './edu-ep02';
import {EDU4_COVER_STYLE, EDU4_COVERS} from './edu-ep04';
import {EG_COVER_STYLE, EG_COVERS} from './everyone-gone';
import {EG2_A_LAYOUT, EG2_A_TYPE, EG2_COVER_STYLE, EG2_COVERS} from './everyone-gone-ep02';
import {WDG_COVER_STYLE, WDG_COVERS} from './wendigo';
import {ZC2_COVER_STYLE, ZC2_COVERS} from './zombie-condo2';

/**
 * Cover candidates per deliverable (docs/cover-principles.md), kept out of the episode modules so that editing a cover
 * never changes an episode's scene keys or pins. `scripts/render.mjs <ID>` renders `<ID>-COVERS` stills beside the MP4.
 */
const covers: EpisodeVideos = {
  episode: 'covers',
  videos: [
    coversVideo('WDG-EP01-SHORT', WDG_COVERS, WDG_COVER_STYLE),
    coversVideo('EG-EP01-SHORT', EG_COVERS, EG_COVER_STYLE),
    coversVideo('ZCONDO2-SHORT-TH', ZC2_COVERS, ZC2_COVER_STYLE),
    coversVideo('EG-EP02-SHORT', EG2_COVERS, EG2_COVER_STYLE),
    coversVideo('EG-EP02-SHORT-A-TYPE', EG2_A_TYPE, EG2_COVER_STYLE),
    coversVideo('EG-EP02-SHORT-A-LAYOUT', EG2_A_LAYOUT, EG2_COVER_STYLE),
    coversVideo('EDU-EP01-SHORT', EDU1_COVERS, EDU1_COVER_STYLE),
    coversVideo('EDU-EP02-SHORT', EDU2_COVERS, EDU2_COVER_STYLE),
    coversVideo('EDU-EP04-SHORT', EDU4_COVERS, EDU4_COVER_STYLE),
  ],
};
export default covers;

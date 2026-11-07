import {coversVideo} from '../cover-overlay';
import type {EpisodeVideos} from '../types';
import {EDU1_COVER_STYLE, EDU1_COVERS, EDU1_COVERS_V2} from './edu-ep01';
import {EDU2_COVER_STYLE, EDU2_COVERS, EDU2_COVERS_V2} from './edu-ep02';
import {EDU4_COVER_STYLE, EDU4_COVERS, EDU4_COVERS_V2} from './edu-ep04';
import {EDU3_COVER_STYLE, EDU3_COVERS, EDU3_COVERS_V2} from './edu-ep03';
import {EDU5_COVER_STYLE, EDU5_COVERS} from './edu-ep05';
import {EDU6_COVER_STYLE, EDU6_COVERS, EDU6_COVERS_V2, EDU6_COVERS_V3, EDU6_PICS} from './edu-ep06';
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
    coversVideo('EDU-EP01-SHORT-V2', EDU1_COVERS_V2, EDU1_COVER_STYLE),
    coversVideo('EDU-EP02-SHORT', EDU2_COVERS, EDU2_COVER_STYLE),
    coversVideo('EDU-EP02-SHORT-V2', EDU2_COVERS_V2, EDU2_COVER_STYLE),
    coversVideo('EDU-EP04-SHORT', EDU4_COVERS, EDU4_COVER_STYLE),
    coversVideo('EDU-EP04-SHORT-V2', EDU4_COVERS_V2, EDU4_COVER_STYLE),
    coversVideo('EDU-EP03-SHORT', EDU3_COVERS, EDU3_COVER_STYLE),
    coversVideo('EDU-EP03-SHORT-V2', EDU3_COVERS_V2, EDU3_COVER_STYLE),
    coversVideo('EDU-EP05-SHORT', EDU5_COVERS, EDU5_COVER_STYLE),
    coversVideo('EDU-EP06-SHORT', EDU6_COVERS, EDU6_COVER_STYLE),
    coversVideo('EDU-EP06-SHORT-V2', EDU6_COVERS_V2, EDU6_COVER_STYLE),
    coversVideo('EDU-EP06-SHORT-PIC', EDU6_PICS, EDU6_COVER_STYLE),
    coversVideo('EDU-EP06-SHORT-V3', EDU6_COVERS_V3, EDU6_COVER_STYLE),
  ],
};
export default covers;

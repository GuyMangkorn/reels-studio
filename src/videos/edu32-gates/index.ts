import {BRIDGE, BRIDGE_CAPTION, BRIDGE_N} from '../../painted/edu32/bridge';
import {SH02_N} from '../../painted/edu32/b03-sh02';
import {SH03_N} from '../../painted/edu32/b03-sh03';
import {SH04_N} from '../../painted/edu32/b03-sh04';
import {B04_N} from '../../painted/edu32/b04-sh01';
import {B02SH01_N} from '../../painted/edu32/b02-sh01';
import {B02SH02_N} from '../../painted/edu32/b02-sh02';
import {B02SH03_N} from '../../painted/edu32/b02-sh03';
import {B01_SH01_N} from '../../painted/edu32/b01-sh01';
import {B01_SH02_N} from '../../painted/edu32/b01-sh02';
import {B01_SH03_N} from '../../painted/edu32/b01-sh03';
import {B04SH02_N} from '../../painted/edu32/b04-sh02';
import {B04SH03_N} from '../../painted/edu32/b04-sh03';
import {B06SH02_N} from '../../painted/edu32/b06-sh02';
import {B06SH03_N} from '../../painted/edu32/b06-sh03';
import {B05SH01_N} from '../../painted/edu32/b05-sh01';
import {B05SH02_N} from '../../painted/edu32/b05-sh02';
import {B05SH03_N} from '../../painted/edu32/b05-sh03';
import {B06SH01_N} from '../../painted/edu32/b06-sh01';
import {SH03_SUN} from '../../painted/shots/edu32';
import {CAPTION_OUTLINE} from '../../scenes/media';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * EDU32-LF-BR: Boss's W3 gate clip of the EDU-EP32-SHORT bridge (B03-SH01, VD32-18; LF-BR in the brief's real-look gates). One scene, the
 * two registered plates on the shot-global clock: PA at 0, PB at F 24 with `fromSec` = its own start (so its plate frame is the shot frame)
 * and a 16 f `crossfade` dissolve. Sample caption L06 at the EP26 caption scale 1.4, bottomEdgeY 1344. Silent, no chrome. Not the episode
 * timeline (Editor assembles that after the voice lock). Draft: node scripts/render.mjs EDU32-LF-BR --draft --gl=angle
 */
const fps = 30;
const timeline: Timeline = [{
  durationSec: BRIDGE_N / fps, bg: 'none', actors: [], subtitle: BRIDGE_CAPTION,
  painted: {shots: [
    {shot: 'EDU32-B03-SH01-PA', atSec: 0},
    {shot: 'EDU32-B03-SH01-PB', atSec: BRIDGE.fadeFrom / fps, fromSec: BRIDGE.fadeFrom / fps, dissolveSec: (BRIDGE.fadeTo - BRIDGE.fadeFrom) / fps},
  ]},
}];

/**
 * EDU32-G4: Boss's W5.2 QA composition of shot group G4 (B03-SH02, B03-SH03, B03-SH04, B04-SH01; timed sheet EDU-EP32-SHEET-R1, G646-G993), one
 * scene per shot, the shots' own frame counts, hard cuts. No captions and no chrome, so `caption-zone.py --band 1230 1344` measures the plate.
 * Composition frame C = G - 646. Not the episode timeline (Editor assembles it). Stills: node scripts/render.mjs EDU32-G4 --stills --frames=...
 */
const g4: Timeline = [
  {durationSec: SH02_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B03-SH02', atSec: 0}]}},
  {durationSec: SH03_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [
    {shot: 'EDU32-B03-SH03-O', atSec: 0},
    {shot: 'EDU32-B03-SH03-S', atSec: SH03_SUN.from / fps, fromSec: SH03_SUN.from / fps, dissolveSec: SH03_SUN.frames / fps},
  ]}},
  {durationSec: SH04_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B03-SH04', atSec: 0}]}},
  {durationSec: B04_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B04-SH01', atSec: 0}]}},
];

/**
 * EDU32-G2: Boss's W5.2 QA composition of shot group G2 (B02-SH01, B02-SH02, B02-SH03; timed sheet EDU-EP32-SHEET-R1, G328-G574), one scene per
 * shot, hard cuts, no captions and no chrome (caption-zone measures the plate). Composition frame C = G - 328. Not the episode timeline.
 * Stills: node scripts/render.mjs EDU32-G2 --stills --frames=...
 */
const g2: Timeline = [
  {durationSec: B02SH01_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B02-SH01', atSec: 0}]}},
  {durationSec: B02SH02_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B02-SH02', atSec: 0}]}},
  {durationSec: B02SH03_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B02-SH03', atSec: 0}]}},
];

/**
 * EDU32-G1: Boss's W5.2 QA composition of shot group G1 (B01-SH01, B01-SH02, B01-SH03; timed sheet EDU-EP32-SHEET-R1, G0-G328), one scene per
 * shot, hard cuts, no captions and no chrome (caption-zone measures the plate). Composition frame C = G. Not the episode timeline.
 * Stills: node scripts/render.mjs EDU32-G1 --stills --frames=...
 */
const g1: Timeline = [
  {durationSec: B01_SH01_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B01-SH01', atSec: 0}]}},
  {durationSec: B01_SH02_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B01-SH02', atSec: 0}]}},
  {durationSec: B01_SH03_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B01-SH03', atSec: 0}]}},
];

/**
 * EDU32-G5: Boss's W5.2 QA composition of shot group G5 (B04-SH02, B04-SH03; timed sheet EDU-EP32-SHEET-R1, G993-G1131), one scene per shot,
 * hard cuts, no captions and no chrome (caption-zone measures the plate). Composition frame C = G - 993. Not the episode timeline.
 * Stills: node scripts/render.mjs EDU32-G5 --stills --frames=...
 */
const g5: Timeline = [
  {durationSec: B04SH02_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B04-SH02', atSec: 0}]}},
  {durationSec: B04SH03_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B04-SH03', atSec: 0}]}},
];

/**
 * EDU32-G7: Boss's W5.2 QA composition of shot group G7 (B06-SH02, B06-SH03; timed sheet EDU-EP32-SHEET-R1, G1583-G1689, the clip's end), one
 * scene per shot, hard cut at G1651, no captions and no chrome (caption-zone measures the plate). Composition frame C = G - 1583; the last
 * frame C105 = G1688. Not the episode timeline. Stills: node scripts/render.mjs EDU32-G7 --stills --frames=...
 */
const g7: Timeline = [
  {durationSec: B06SH02_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B06-SH02', atSec: 0}]}},
  {durationSec: B06SH03_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B06-SH03', atSec: 0}]}},
];

/**
 * EDU32-G6: Boss's W5.2 QA composition of shot group G6 (B05-SH01, B05-SH02, B05-SH03, B06-SH01; timed sheet EDU-EP32-SHEET-R1, G1131-G1583), one
 * scene per shot, hard cuts, no captions and no chrome (caption-zone measures the plate). Composition frame C = G - 1131. Not the episode timeline.
 * Stills: node scripts/render.mjs EDU32-G6 --stills --frames=...
 */
const g6: Timeline = [
  {durationSec: B05SH01_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B05-SH01', atSec: 0}]}},
  {durationSec: B05SH02_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B05-SH02', atSec: 0}]}},
  {durationSec: B05SH03_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B05-SH03', atSec: 0}]}},
  {durationSec: B06SH01_N / fps, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'EDU32-B06-SH01', atSec: 0}]}},
];

const videos: EpisodeVideos = {
  episode: 'edu32-gates',
  videos: [{id: 'EDU32-LF-BR', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false},
    captionStyle: {preset: 'outline', bottomEdgeY: 1344, scale: 1.4, ...CAPTION_OUTLINE}},
  {id: 'EDU32-G4', format: 'short', timeline: g4, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
  {id: 'EDU32-G2', format: 'short', timeline: g2, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
  {id: 'EDU32-G1', format: 'short', timeline: g1, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
  {id: 'EDU32-G5', format: 'short', timeline: g5, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
  {id: 'EDU32-G7', format: 'short', timeline: g7, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
  {id: 'EDU32-G6', format: 'short', timeline: g6, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}],
};
export default videos;

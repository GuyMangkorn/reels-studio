import narrationAmplitude from '../../../public/narration/WDG-EP01-SHORT.amplitude.json';
import type {Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';
import {paintedShots} from '../../painted/registry';
import {WDG_FPS, WDG_SHOTS} from '../../painted/wendigo/timed';
import {EPISODE_ID, wendigoTimeline} from './episode';
import {coversTimeline} from './covers';

/**
 * WDG-LOOKS: the W3.1 look frames of WDG-EP01-SHORT (tent interior, snow exterior with footprint ring, documentary lake, North America map; SB-R2.1 adds tent r6, the wendigo shadow study flap and storm, and the 1879 era frame), one per
 * 2 s scene, painted in `src/painted/wendigo/look.ts` and registered as plates `WDG-LF-*` (`src/painted/shots/wendigo.tsx`). Silent, no
 * captions or chrome. Not the episode; WDG-EP01-SHORT registers here after the voice lock. Stills:
 * `node scripts/render.mjs WDG-LOOKS --stills --frames=40,90,150,210,270,330,390,450,510 --gl=angle`.
 */
const looks = ['WDG-LF-TENT', 'WDG-LF-SNOW', 'WDG-LF-DOC', 'WDG-LF-MAP', 'WDG-LF-TENT-R6', 'WDG-LF-WENDIGO', 'WDG-LF-WENDIGO-STORM', 'WDG-LF-ERA', 'WDG-LF-TENT-R7'];
const timeline: Timeline = looks.map((shot) => ({
  durationSec: 2, bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot, atSec: 0}]},
}));

/**
 * WDG-PROOF: the 19 timed shots of WDG-SS-R2 at their composition-global starts (src/painted/wendigo/timed.ts), one scene
 * per shot, each painted by its plate `WDG-<shot ID>`. A library proof for stills and frame checks (silent, no narration,
 * no chrome). Not the episode: Editor's assembly WDG-EP01-SHORT replaces it. Stills: `node scripts/render.mjs WDG-PROOF --stills --frames=0,59,60 --gl=angle`.
 */
const proofTimeline: Timeline = Object.keys(WDG_SHOTS).map((shot) => {
  const plate = `WDG-${shot}`;
  // A shot without a plate keeps its frames as an unpainted gap (an explicit unverified gap in the QA notes, not a placeholder).
  return {
    durationSec: WDG_SHOTS[shot as keyof typeof WDG_SHOTS].n / WDG_FPS, bg: 'none', actors: [], subtitle: '',
    ...(Object.hasOwn(paintedShots, plate) ? {painted: {shots: [{shot: plate, atSec: 0}]}} : {}),
  };
});

/** WDG-ERA-KEYS: the three era-atmosphere key-pose stills ERA-K1..K4 (scene-S03.md, option A) for the user's approval; stills only, one second each (frames 15, 45, 75, 105). */
const eraKeys: Timeline = ['WDG-ERA-K1', 'WDG-ERA-K2', 'WDG-ERA-K3', 'WDG-ERA-K4'].map((shot) => ({durationSec: 1, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot, atSec: 0}]}}));

/**
 * WDG-EP01-SHORT: the episode (Editor assembly of WDG-SS-R2.2, 2861 frames, `C_seamless`). One scene per shot; plates
 * `WDG-<shot ID>`; captions in `episode.ts`; chrome in `chrome.tsx` (`overlay`); sound stems built by
 * `scripts/wendigo/build-audio.mjs` (voice = the narration track, beds/ambience/cues = one `audio` track).
 * Stills: `node scripts/render.mjs WDG-EP01-SHORT --stills --frames=30,100 --gl=angle`.
 */
const episodeVideo = {
  id: EPISODE_ID, format: 'short' as const, timeline: wendigoTimeline(), ending: 'C_seamless' as const,
  narration: {src: 'audio/wendigo/WDG-EP01-SHORT_voice.wav', amplitude: narrationAmplitude, fps: WDG_FPS},
  audio: [{src: 'audio/wendigo/WDG-EP01-SHORT_sound.wav'}],
  captionStyle: {preset: 'outline' as const, bottomEdgeY: 1240},
  chrome: {channelLabel: '@TamMaiLa', progressBar: false},
  overlay: 'wendigo',
};

const videos: EpisodeVideos = {
  episode: 'wendigo',
  videos: [
    {id: 'WDG-LOOKS', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
    {id: 'WDG-ERA-KEYS', format: 'short', timeline: eraKeys, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
    episodeVideo,
    {id: 'WDG-COVERS', format: 'short', timeline: coversTimeline(), ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: '@TamMaiLa', progressBar: false}, overlay: 'wendigo-covers'},
    {id: 'WDG-PROOF', format: 'short', timeline: proofTimeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}},
  ],
};
export default videos;

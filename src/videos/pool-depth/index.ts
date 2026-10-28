import poolDepthAmplitude from '../../../scripts/pool-depth/short/POOLDEPTH-SHORT.amplitude.json';
import poolDepthBotnoiAmplitude from '../../../scripts/pool-depth/short/POOLDEPTH-SHORT-BOTNOI.amplitude.json';
import poolDepthBotnoiCaptions from '../../../scripts/pool-depth/short/captions-botnoi.json';
import poolDepthShort from '../../../scripts/pool-depth/short/timeline.json';
import type {AudioTrack, SceneSoundCue, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * POOLDEPTH-SHORT (script R2, brief VB-POOLDEPTH-SHORT-R2, handoff POOLDEPTH-SHORT-BOARD-R2): eight pre-rendered Blender clips
 * (`public/pool-depth/shot-01..08.mp4`, local and gitignored) bound through `Scene.media`, 1620 frames at 30 fps.
 * Ending `B_loop`: the 3 s hold lives inside scene[7] (SH08 frames 120-209), so the total stays 1620. No `loopFadeFrames` and no
 * `sceneTransitionFrames`: those would dip the picture to dark and break the SH08 -> SH01 seam. The progress bar is off because
 * eight unequal runtime scenes do not match the six story beats and its fill would differ between the last and first frame.
 * Narration: Niwat +5% from `scripts/pool-depth/short/narration-timeline.json` (six beat slots 6/10/10/12/9/7 s; B04 `leadSec` 1.0 and
 * B05 `leadSec` 0.4 line the speech up with the fixed picture events). `public/narration/POOLDEPTH-SHORT.mp3` is local and gitignored
 * (regenerate with `npm run narration -- --timeline scripts/pool-depth/short/narration-timeline.json --name POOLDEPTH-SHORT`); the
 * amplitude envelope is committed beside the timeline. Caption cues in `timeline.json` are retimed to this audio. No music, no SFX.
 */
/**
 * Trial variant `POOLDEPTH-SHORT-BOTNOI` (additive, Niwat video above untouched): same picture and 1620 frames, Botnoi per-beat files
 * assembled by `scripts/narration_files.py` from `narration-timeline-botnoi.json`; only the caption cue times of scenes 1, 3, 4, 5 differ
 * (`captions-botnoi.json`, retimed to the Botnoi audio). Botnoi voice name and terms are not verified (delivery.md).
 */
/**
 * Botnoi sound design (user request 2026-10-28, supersedes the earlier "no SFX / no music" default; levels and reasons in
 * `scripts/pool-depth/delivery.md`). Cue frames are composition-global in the comments; `atSec` is scene-local. Cues sit in speech
 * gaps measured on the Botnoi amplitude envelope. Library IDs (copied to `public/sfx`, NOTICE beside them) are in the file names.
 */
export const botnoiSfx: Record<number, SceneSoundCue[]> = {
  1: [{src: 'sfx/whoosh/whoosh_air-swish-rising_01.wav', atSec: 0.04, volume: 0.18}, // G181 ray draw, in the gap before B02 speech (G188)
    {src: 'sfx/ui/ui_pop_01.wav', atSec: 6.63, volume: 0.1}], // G379 ghost marker, inside the 4-frame gap G377-G381
  2: [{src: 'sfx/water/water_mug-pour-soft_01.wav', atSec: 5.0, volume: 0.2}, // G630 stream onset (SH03 F150)
    {src: 'sfx/reveal/reveal_glass-shimmer-soft_01.wav', atSec: 5.87, volume: 0.25}], // G656 coin rises, in the gap G656-G664
  3: [{src: 'sfx/whoosh/whoosh_fast-slide_01.wav', atSec: 9.1, volume: 0.16}], // G1053 straight-down -> oblique state change, gap G1052-G1063
  4: [{src: 'sfx/ui/ui_pop_01.wav', atSec: 0, volume: 0.1}], // G1140 sign pictogram cut, gap G1133-G1141
  5: [{src: 'sfx/water/water_pool-feet-enter-soft_01.wav', atSec: 1.4, trimStartSec: 0.4, volume: 0.11}], // file starts G1282, entry peak (file 0.7 s) at G1291 in gap G1289-G1293
};
/** Wrap-aligned beds: both files are 54.000 s = composition length, file time = composition time (build-sound-beds.py). */
export const botnoiAudio: AudioTrack[] = [
  {src: 'audio/water/water_pool-hall-bed-54s_01.wav', startSec: 0, endSec: 7, trimStartSec: 0, volume: 0.1, fadeOutSec: 1.2, duckUnderNarration: 0.6}, // pool B01
  {src: 'audio/water/water_pool-hall-bed-54s_01.wav', startSec: 41, trimStartSec: 41, volume: 0.1, fadeInSec: 1, duckUnderNarration: 0.6}, // pool B05-B06, runs to the loop point
  {src: 'audio/bed/bed_pool-curious-sparse-54s_01.wav', startSec: 0, trimStartSec: 0, volume: 0.2, duckUnderNarration: 0.4}, // music, no fades: wraps at 54 s
];

const botnoiTimeline = (poolDepthShort as Timeline).map((scene, i) => {
  const cues = (poolDepthBotnoiCaptions as Record<string, NonNullable<Timeline[number]['subtitleCues']>>)[String(i)];
  const sfx = botnoiSfx[i];
  return {...scene, ...(cues ? {subtitleCues: cues} : {}), ...(sfx ? {sfx} : {})};
});

const poolDepth: EpisodeVideos = {
  episode: 'pool-depth',
  videos: [
    {id: 'POOLDEPTH-SHORT', format: 'short', timeline: poolDepthShort as Timeline, ending: 'B_loop', chrome: {progressBar: false},
      narration: {src: 'narration/POOLDEPTH-SHORT.mp3', amplitude: poolDepthAmplitude, fps: 30}},
    {id: 'POOLDEPTH-SHORT-BOTNOI', format: 'short', timeline: botnoiTimeline, ending: 'B_loop', chrome: {progressBar: false}, audio: botnoiAudio,
      narration: {src: 'narration/POOLDEPTH-SHORT-BOTNOI.mp3', amplitude: poolDepthBotnoiAmplitude, fps: 30}},
  ],
};
export default poolDepth;

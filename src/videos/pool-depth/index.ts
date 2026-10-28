import poolDepthAmplitude from '../../../scripts/pool-depth/short/POOLDEPTH-SHORT.amplitude.json';
import poolDepthBotnoiAmplitude from '../../../scripts/pool-depth/short/POOLDEPTH-SHORT-BOTNOI.amplitude.json';
import poolDepthBotnoiCaptions from '../../../scripts/pool-depth/short/captions-botnoi.json';
import poolDepthShort from '../../../scripts/pool-depth/short/timeline.json';
import type {Timeline} from '../../scenes/types';
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
const botnoiTimeline = (poolDepthShort as Timeline).map((scene, i) => {
  const cues = (poolDepthBotnoiCaptions as Record<string, NonNullable<Timeline[number]['subtitleCues']>>)[String(i)];
  return cues ? {...scene, subtitleCues: cues} : scene;
});

const poolDepth: EpisodeVideos = {
  episode: 'pool-depth',
  videos: [
    {id: 'POOLDEPTH-SHORT', format: 'short', timeline: poolDepthShort as Timeline, ending: 'B_loop', chrome: {progressBar: false},
      narration: {src: 'narration/POOLDEPTH-SHORT.mp3', amplitude: poolDepthAmplitude, fps: 30}},
    {id: 'POOLDEPTH-SHORT-BOTNOI', format: 'short', timeline: botnoiTimeline, ending: 'B_loop', chrome: {progressBar: false},
      narration: {src: 'narration/POOLDEPTH-SHORT-BOTNOI.mp3', amplitude: poolDepthBotnoiAmplitude, fps: 30}},
  ],
};
export default poolDepth;

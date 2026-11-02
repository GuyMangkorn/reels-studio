import type {Ending} from '../scenes/endings';
import type {Narration} from '../scenes/SceneRenderer';
import type {AudioTrack, CaptionStyle, ChromeStyle, Timeline} from '../scenes/types';

/** Canvas presets from docs/production-requirements.md; a video selects one instead of repeating sizes. */
export const FORMATS = {
  short: {width: 1080, height: 1920, fps: 30},
  long: {width: 1920, height: 1080, fps: 30},
} as const;
export type VideoFormat = keyof typeof FORMATS;

/** One registered composition. Each episode owns its list in `src/videos/<episode>/index.ts`. */
export type VideoDefinition = {
  /** Remotion composition ID; must be unique across every episode. */
  id: string;
  format: VideoFormat;
  timeline: Timeline;
  ending?: Ending;
  /** `A_fade` only: seconds the final scene holds before fading (default 3; 0 = no freeze, the last scene runs to its end). */
  endHoldSec?: number;
  /** `A_fade` only: seconds of composition fade at the end (default 1; 0 = none, a plate's own black owns the fade). */
  endFadeSec?: number;
  narration?: Narration;
  sceneTransitionFrames?: number;
  loopFadeFrames?: number;
  /** C_seamless only: frames over which the last scene blends into the first frame (default 15). */
  loopBlendFrames?: number;
  /** Music/ambience on the composition clock. */
  audio?: AudioTrack[];
  captionStyle?: CaptionStyle;
  chrome?: ChromeStyle;
  /** Episode chrome above every scene on the composition clock by name in src/videos/overlays.ts. */
  overlay?: string;
};

/** Default export shape of `src/videos/<episode>/index.ts`. */
export type EpisodeVideos = {episode: string; videos: VideoDefinition[]};

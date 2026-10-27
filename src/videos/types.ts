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
  narration?: Narration;
  sceneTransitionFrames?: number;
  loopFadeFrames?: number;
  /** Music/ambience on the composition clock. */
  audio?: AudioTrack[];
  captionStyle?: CaptionStyle;
  chrome?: ChromeStyle;
};

/** Default export shape of `src/videos/<episode>/index.ts`. */
export type EpisodeVideos = {episode: string; videos: VideoDefinition[]};

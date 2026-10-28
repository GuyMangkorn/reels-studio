import type {SceneVisual} from '../assets/visuals/types';
import type {BackgroundName, TimeOfDay} from '../assets/Background';
import type {PropName, PropTone, StimulusVariant} from '../assets/Props';
import type {CharacterProps} from '../rig/Character';
import type {PoseName} from '../rig/poses';
export type PictureMoveKey = {atSec: number; x: number; y: number; scale: number};
export type BoundsMeters = {left: number; right: number; bottom: number; top: number};
export type OrthographicView = {bounds: BoundsMeters; cameraMoves?: {atSec: number; x: number; y: number; zoom?: number; cut?: boolean}[]};
export type OrthographicProjection = {
  unit: 'm';
  stage: BoundsMeters;
  views: {short: OrthographicView; long: OrthographicView};
};
export type WorldPositionKey = {atSec: number; x: number; y: number};
export type WorldActorLayout = {keys: WorldPositionKey[]};
export type WorldPropLayout = {x: number; y: number};
export type SubtitleCue = {atSec: number; text: string};
export type ScenePropSpec = {type: PropName; x?: number; y?: number; size?: number; color?: string; label?: string; detail?: string; variant?: StimulusVariant; tone?: PropTone; layer?: 'back' | 'front'; startSec?: number; endSec?: number; portrait?: {x?: number; y?: number; size?: number}; space?: 'screen' | 'world'; world?: WorldPropLayout; worldMotion?: WorldPositionKey[]};
export type ActorPortraitLayout = {from?: number; to?: number; scale?: number};
export type Actor = {
  id?: string; type: 'narrator' | 'cat' | 'dog'; pose?: PoseName;
  x?: number; y?: number; from?: number; to?: number; scale?: number; flip?: boolean; talking?: boolean;
  /** Optional portrait crop position/scale while preserving the same scene timeline and action. */
  portrait?: ActorPortraitLayout;
  /** Physical stage path in metres. Available only when the scene has an orthographic projection. */
  world?: WorldActorLayout;
  skinColor?: CharacterProps['skinColor']; shirtColor?: string; pantsColor?: string; color?: string;
  hairStyle?: CharacterProps['hairStyle']; expression?: CharacterProps['expression'];
  poses?: {atSec: number; pose: PoseName}[];
  /** Contact the room's sofa cushion while entering or leaving sit. */
  seat?: 'sofa';
  /** Optional actor-local duration for authored pose transitions, in frames. */
  poseTransitionFrames?: number;
};
/** Footage or a still image in screen space. `src` is a path under public/ or an http(s) URL. Times are scene-local. */
export type MediaClip = {
  kind: 'video' | 'image'; src: string;
  startSec?: number; endSec?: number;
  /** cover (default) fills the box and crops; contain letterboxes. */
  fit?: 'cover' | 'contain';
  /** back (default) sits under actors and moves with pictureMove; front sits over actors. */
  layer?: 'back' | 'front';
  /** Fractions of the frame; default is the full frame. */
  box?: {x: number; y: number; width: number; height: number};
  opacity?: number;
  /** Video only. Source offset, playback speed and clip audio gain (default 0 = muted). */
  trimStartSec?: number; playbackRate?: number; volume?: number;
};
/** A one-shot sound at a scene-local time. */
export type SceneSoundCue = {src: string; atSec: number; volume?: number; trimStartSec?: number; durationSec?: number};
/**
 * The incoming scene enters over the last `frames` of the previous scene, held on its own first frame.
 * Scene durations, cut frames and narration sync are unchanged.
 */
export type SceneTransition = {type: 'fade' | 'slide' | 'wipe'; frames: number; direction?: 'left' | 'right' | 'up' | 'down'};
/** Music or ambience on the composition clock. */
export type AudioTrack = {
  src: string; startSec?: number; endSec?: number; trimStartSec?: number;
  volume?: number; fadeInSec?: number; fadeOutSec?: number; loop?: boolean;
  /** Gain multiplier while narration is speaking, e.g. 0.25. Omit for no ducking. */
  duckUnderNarration?: number;
};
export type CaptionStyle = {preset?: 'outline' | 'box' | 'none'; position?: 'bottom' | 'middle' | 'top'; color?: string; scale?: number};
/** Channel label (false hides it) and the scene progress bar. */
export type ChromeStyle = {channelLabel?: string | false; progressBar?: boolean};
/**
 * Text warped onto a screen-space quadrilateral that moves per frame (e.g. a blank sign plate in a pre-rendered clip).
 * `quads[i]` is the plate's TL,TR,BR,BL in output pixels at scene-local frame `startFrame + i`; frames after the last key hold it.
 * The text is laid out in a `box` pixel rectangle (default 640x400) and mapped onto the quad with a homography.
 */
export type QuadText = {
  text: string;
  quads: [number, number][][];
  startFrame?: number; endFrame?: number;
  box?: {width: number; height: number};
  fontSize?: number; fontWeight?: number; color?: string;
};
/** Eyebrow presentation. `fade: false` shows the eyebrow from its first frame with no fade or slide. */
export type EyebrowStyle = {fade?: boolean; fontSize?: number};
export type Scene = {
  visuals?: SceneVisual[];
  /** `none` renders no illustrated background, for footage/image-led scenes. */
  durationSec: number; bg: BackgroundName | 'none'; time?: TimeOfDay; actors: Actor[]; subtitle: string;
  title?: string; eyebrow?: string;
  eyebrowStyle?: EyebrowStyle;
  quadTexts?: QuadText[];
  /** Frame-sampled movement for the complete background + props + actors stage. Values are normalized stage offsets and scale. */
  pictureMove?: PictureMoveKey[];
  /** Scene-local estimates until narration timing is approved; each cue remains until the next cue. */
  subtitleCues?: SubtitleCue[];
  props?: ScenePropSpec[];
  /** Shared orthographic metre-to-pixel projection; actors and world props retain canonical dimensions. */
  projection?: OrthographicProjection;
  media?: MediaClip[];
  sfx?: SceneSoundCue[];
  transitionIn?: SceneTransition;
};
export type Timeline = Scene[];

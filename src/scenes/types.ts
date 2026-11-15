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
/** `lower` puts the block's bottom edge at y 1240 of 1920 (production-requirements caption-safe box; MK-WF-DEP-08). */
export type CaptionStyle = {preset?: 'outline' | 'box' | 'none'; position?: 'bottom' | 'middle' | 'top' | 'lower'; /** Composition y (px from the top) of the caption block's bottom edge; overrides `position` when set. */ bottomEdgeY?: number; /** Composition y of the caption block's vertical CENTRE (a 1-, 2- or 3-line cue grows symmetrically about it); overrides `bottomEdgeY` and `position`. Pair it with `CaptionShade centerY` (src/scenes/captionLayout.ts). */ centerY?: number; color?: string; scale?: number; /** `outline` only, all optional (unset = the channel look `CAPTION_OUTLINE` in src/scenes/media.ts: 14 px #2b1a12 stroke plus a soft dark halo): stroke width in px (centred, paint-order stroke fill, so half shows), stroke colour, CSS text-shadow list (e.g. a soft dark halo). */ strokeWidth?: number; strokeColor?: string; textShadow?: string; /** C_seamless only: the final scene's captions stay on and fade out across the loop blend instead of vanishing when it opens. Default off. */ fadeOutWithLoop?: boolean};
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
  /** Optional entrance: fade 0 -> 1 with a small scale pop over this many frames from `startFrame`; absent = appears at once. */
  enterFrames?: number;
  box?: {width: number; height: number};
  fontSize?: number; fontWeight?: number; color?: string;
};
/**
 * One painted plate inside a painted scene (`src/painted/registry.ts` ID). The plate runs from `atSec` (scene-local)
 * until the next cue or the scene end, on its own shot clock starting at `fromSec`.
 * `dissolveSec` paints it over the previous plate in the same canvas, opacity ramping 0 -> 1 from `atSec` (the
 * previous plate keeps running underneath, across a scene boundary too). `label` is the screen-space
 * reconstruction label (e.g. "ภาพจำลอง") shown on every frame this plate is visible, dissolves included.
 * `labelAtSec` holds the label back until that many seconds into the cue (default 0, e.g. a tag that starts inside the
 * cue's own dissolve); `labelTop` moves label slot 0 of this cue to that composition y in px (slot 1 stacks below;
 * default the format's `LABEL_BOX` top in src/painted/Label.tsx), for a plate whose set crosses the default box.
 * `labelSide` 'right' right-aligns this cue's label slots to the format's right margin (Short x <= 1020); default 'left'.
 */
/** Fact label of a cue: one text (slot 1), or `[slot1, slot2]` (DEP03: a second label slot below the first; `null` = empty slot). */
export type PaintedLabel = string | (string | null)[];
/**
 * Positioned screen item of a cue (frame-based, in the plate's own shot frames `l`, i.e. including `fromSec`, so the numbers of a
 * plate spec carry over). `label`: pop-in outlined text centred at (`x`,`y`) px. `card`: paper card of `w` x `h` px centred at
 * (`x`,`y`) with `text`, optional red strike drawn bottom-left to top-right from `strikeAtFrame` over `strikeFrames`. The item pops in
 * over `popFrames` (default 6) from `atFrame` and is gone from `untilFrame` (default: stays while the plate is visible).
 */
export type PaintedItem = {kind: 'label' | 'card'; text: string; x: number; y: number; atFrame: number; popFrames?: number; untilFrame?: number; w?: number; h?: number; strikeAtFrame?: number; strikeFrames?: number};
export type PaintedShotCue = {shot: string; atSec: number; fromSec?: number; dissolveSec?: number; label?: PaintedLabel; labelAtSec?: number; labelTop?: number; labelSide?: 'left' | 'right'; items?: PaintedItem[]};
/** Painted 2D (p5.brush) picture for a scene: one canvas per composition, plates switched by time. */
export type PaintedScene = {shots: PaintedShotCue[]};
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
  /** Painted plates (requires `bg: 'none'`; captions, chrome, label and audio stay Remotion). */
  painted?: PaintedScene;
};
export type Timeline = Scene[];

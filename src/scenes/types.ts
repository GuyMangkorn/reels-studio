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
export type Scene = {
  visuals?: SceneVisual[];
  durationSec: number; bg: BackgroundName; time?: TimeOfDay; actors: Actor[]; subtitle: string;
  title?: string; eyebrow?: string;
  /** Frame-sampled movement for the complete background + props + actors stage. Values are normalized stage offsets and scale. */
  pictureMove?: PictureMoveKey[];
  /** Scene-local estimates until narration timing is approved; each cue remains until the next cue. */
  subtitleCues?: SubtitleCue[];
  props?: ScenePropSpec[];
  /** Shared orthographic metre-to-pixel projection; actors and world props retain canonical dimensions. */
  projection?: OrthographicProjection;
};
export type Timeline = Scene[];

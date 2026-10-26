import type {BackgroundName, TimeOfDay} from '../assets/Background';
import type {PropName, PropTone, StimulusVariant} from '../assets/Props';
import type {CharacterProps} from '../rig/Character';
import type {PoseName} from '../rig/poses';
export type PictureMoveKey = {atSec: number; x: number; y: number; scale: number};
export type SubtitleCue = {atSec: number; text: string};
export type ScenePropSpec = {type: PropName; x: number; y?: number; size?: number; color?: string; label?: string; detail?: string; variant?: StimulusVariant; tone?: PropTone; layer?: 'back' | 'front'; startSec?: number; endSec?: number; portrait?: {x?: number; y?: number; size?: number}};
export type ActorPortraitLayout = {from?: number; to?: number; scale?: number};
export type Actor = {
  id?: string; type: 'narrator' | 'cat' | 'dog'; pose?: PoseName;
  x?: number; y?: number; from?: number; to?: number; scale?: number; flip?: boolean; talking?: boolean;
  /** Optional portrait crop position/scale while preserving the same scene timeline and action. */
  portrait?: ActorPortraitLayout;
  skinColor?: CharacterProps['skinColor']; shirtColor?: string; pantsColor?: string; color?: string;
  hairStyle?: CharacterProps['hairStyle']; expression?: CharacterProps['expression'];
  poses?: {atSec: number; pose: PoseName}[];
  /** Contact the room's sofa cushion while entering or leaving sit. */
  seat?: 'sofa';
};
export type Scene = {
  durationSec: number; bg: BackgroundName; time?: TimeOfDay; actors: Actor[]; subtitle: string;
  title?: string; eyebrow?: string;
  /** Frame-sampled movement for the complete background + props + actors stage. Values are normalized stage offsets and scale. */
  pictureMove?: PictureMoveKey[];
  /** Scene-local estimates until narration timing is approved; each cue remains until the next cue. */
  subtitleCues?: SubtitleCue[];
  props?: ScenePropSpec[];
};
export type Timeline = Scene[];

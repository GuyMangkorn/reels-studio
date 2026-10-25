import type {BackgroundName, TimeOfDay} from '../assets/Background';
import type {PropName} from '../assets/Props';
import type {CharacterProps} from '../rig/Character';
import type {PoseName} from '../rig/poses';
export type Actor = {
  id?: string; type: 'narrator' | 'cat' | 'dog'; pose?: PoseName;
  x?: number; y?: number; from?: number; to?: number; scale?: number; flip?: boolean; talking?: boolean;
  skinColor?: CharacterProps['skinColor']; shirtColor?: string; pantsColor?: string; color?: string;
  hairStyle?: CharacterProps['hairStyle']; expression?: CharacterProps['expression'];
  poses?: {atSec: number; pose: PoseName}[];
};
export type Scene = {
  durationSec: number; bg: BackgroundName; time?: TimeOfDay; actors: Actor[]; subtitle: string;
  title?: string; eyebrow?: string;
  props?: {type: PropName; x: number; y?: number; size?: number; color?: string}[];
};
export type Timeline = Scene[];

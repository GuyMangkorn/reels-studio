// EDU-EP09-SHORT colours (brief EDU-EP09-BRIEF-R1.2 "Colour and value key"). Hand tones follow the user's decision of 8 Nov 2026:
// a macro hand takes its rig's skin (BOY `boy-school` #d4a073, ELDER `man-elder` #e0ae86) and derives shade, deep, crease and nail from it,
// so the macro hands match the faces in the room shots. The pianist keeps the kit generic tone (an anonymous adult).
import type {MacroTone} from '../kit/hands';
import {MACRO_TONES} from '../kit/hands';

export const BOY_TONE: MacroTone = {skin: '#d4a073', shade: '#bb8558', deep: '#a5724a', nail: '#ecc9a8', crease: '#85573a', sleeve: '#f2f0ea', sleeveShade: '#d6d3ca'};
export const ELDER_TONE: MacroTone = {skin: '#e0ae86', shade: '#c38f66', deep: '#ad7b54', nail: '#f0d3ba', crease: '#8f6044', sleeve: '#7a5a3f', sleeveShade: '#5f432b', spots: '#b88660'};
export const PIANIST_TONE: MacroTone = MACRO_TONES.generic;

export const C = {
  lamp: '#ffd08a', pool: '#ffe2ae',
  winA: '#3d5a86', winB: '#8aa3c8',
  wall: '#e9dcc4', wallShade: '#c4b296', floor: '#cdbfa8', grout: '#a9997f', skirting: '#b9a68a',
  wood: '#a86f45', grain: '#8a5634', woodShade: '#6e4529', woodLit: '#d39a63',
  lap: '#26334d', lapShade: '#1a2336',
  cord: '#fbf3e2', cordInk: '#7a5a3c', muscle: '#e88f6f', muscleLit: '#ffb84d', own: '#3fb8a8', tie: '#ff7a5c', taut: '#fff3c4',
  ink: '#2b211c',
} as const;

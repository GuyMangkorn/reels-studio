import type {ExpressionId} from './expressions';
import {MOTION_IDS, motionDuration, type MotionId} from './motions';
import {PEOPLE, type PersonId} from './people';
import type {AnyPoseId, View} from './poses';
import type {OutfitId} from './wardrobe';

// KIT-MOTIONS reel: one motion per timeline scene, labelled, shown on two people (an adult and a child or a second adult). Plain
// data (no React) so the video (`src/videos/kit-motions/index.ts`) and the plates (`src/painted/shots/kit-motions.tsx`) read the same
// scene lengths. Render: `node scripts/render.mjs KIT-MOTIONS --gl=angle --timeout=180000` (scene cache, one motion per scene).

export type ReelCast = {
  person: PersonId;
  outfit?: OutfitId;
  /** Rest point, plate px (the plate is 1080 x 1920; the ground line is `REEL_GROUND`). */
  x: number;
  view?: View;
  pose?: AnyPoseId;
  expression?: ExpressionId;
  distance?: number;
  /** Seed override: two figures of one plate must not share fills. */
  seed?: number;
  /** Mouth from the narration envelope (`src/amplitude.json`) instead of the syllable envelope. */
  narration?: boolean;
};
export type ReelEntry = {
  motion: MotionId;
  cast: ReelCast[];
  /** Draw a chair under each seated figure. */
  chair?: boolean;
};

export const REEL_FPS = 30;
export const REEL_GROUND = 1520;
export const REEL_UNIT = 540;
/** Seconds the last frame of a motion is held at the end of its scene. */
export const REEL_HOLD = 0.4;

const A = 'man-parted', B = 'woman-ponytail', K = 'boy-school';
const pair = (a: Partial<ReelCast> = {}, b: Partial<ReelCast> = {}): ReelCast[] => [
  {person: A, outfit: 'office', x: 330, ...a},
  {person: K, x: 770, expression: 'happy', ...b},
];

export const MOTION_REEL: ReelEntry[] = [
  {motion: 'idle-breathe', cast: pair({pose: 'P03'}, {pose: 'P09'})},
  {motion: 'walk-in-from-left', cast: [{person: A, outfit: 'office', x: 400}, {person: B, outfit: 'nurse', x: 860, expression: 'happy'}]},
  {motion: 'walk-in-from-right', cast: [{person: A, outfit: 'office', x: 680}, {person: B, outfit: 'nurse', x: 220, expression: 'happy'}]},
  {motion: 'walk-out-to-left', cast: [{person: A, outfit: 'office', x: 680}, {person: B, outfit: 'nurse', x: 380, expression: 'happy'}]},
  {motion: 'walk-out-to-right', cast: [{person: A, outfit: 'office', x: 400}, {person: B, outfit: 'nurse', x: 700, expression: 'happy'}]},
  {motion: 'run-left-to-right', cast: [{person: A, outfit: 'hoodie', x: 540, expression: 'scared'}]},
  {motion: 'run-right-to-left', cast: [{person: K, x: 540, expression: 'scared', distance: 3}]},
  {motion: 'nod', cast: pair({expression: 'happy'}, {expression: 'neutral'})},
  {motion: 'shake-head', cast: pair({expression: 'suspicious'}, {expression: 'sad'})},
  {motion: 'startle-jump', cast: pair({}, {expression: 'neutral'})},
  {motion: 'look-around', cast: pair({expression: 'worried'}, {expression: 'neutral'})},
  {motion: 'turn-head-left', cast: [{person: A, outfit: 'office', x: 330}, {person: B, outfit: 'nurse', x: 770}]},
  {motion: 'turn-head-right', cast: [{person: A, outfit: 'office', x: 330}, {person: B, outfit: 'nurse', x: 770}]},
  {motion: 'turn-head-to-camera', cast: pair({view: 'right'}, {view: 'left', expression: 'neutral'})},
  {motion: 'shiver', cast: pair({outfit: 'hoodie'}, {})},
  {motion: 'sit-down', cast: pair({view: 'right'}, {view: 'front'}), chair: true},
  {motion: 'stand-up', cast: pair({view: 'right'}, {view: 'front'}), chair: true},
  {motion: 'point-and-say', cast: [{person: A, outfit: 'office', x: 560}, {person: K, x: 110, view: 'right', expression: 'neutral'}]},
  {motion: 'gasp-recoil', cast: pair({view: 'right', expression: 'neutral'}, {view: 'front', expression: 'neutral'})},
  {motion: 'talk', cast: pair({narration: true, expression: 'neutral'}, {expression: 'happy'})},
  {motion: 'kneel-down', cast: pair({view: 'right', expression: 'sad'}, {view: 'front', expression: 'sad'})},
  {motion: 'stand-from-kneel', cast: pair({view: 'right', expression: 'sad'}, {view: 'front', expression: 'sad'})},
  {motion: 'crouch-hide', cast: pair({view: 'front'}, {view: 'right', expression: 'neutral'})},
  {motion: 'hood-pull', cast: [{person: A, outfit: 'hoodie', x: 330, view: 'back'}, {person: B, outfit: 'hoodie', x: 770, view: 'back'}]},
  {motion: 'coin-count', cast: pair({expression: 'neutral'}, {expression: 'neutral'})},
  {motion: 'eat-chew', cast: pair({view: 'right', expression: 'neutral'}, {view: 'left', expression: 'neutral'})},
  // EDU-EP08 kit intake (B4-B6): weightless figures in the EVA suit, no ground
  {motion: 'zero-g-drift', cast: [{person: 'woman-bob', outfit: 'eva-suit', x: 330}, {person: 'man-crop', outfit: 'eva-suit', x: 770, expression: 'happy'}]},
  {motion: 'pat-check', cast: [{person: 'woman-bob', outfit: 'eva-suit', x: 330, expression: 'worried'}, {person: 'man-crop', outfit: 'eva-suit', x: 770}]},
  {motion: 'rail-tow', cast: [{person: 'man-crop', outfit: 'eva-suit', x: 420, view: 'right'}, {person: 'man-parted', outfit: 'eva-suit', x: 760, view: 'left'}]},
  // EDU-EP13 kit intake (N5): the on-the-spot jump
  {motion: 'standing-jump', cast: pair({expression: 'neutral'}, {expression: 'happy'})},
];

/** Longest `motionDuration` among a scene's cast (walks and runs depend on height and distance), plus the hold, in whole frames. */
export const reelSceneSec = (e: ReelEntry): number => {
  const sec = Math.max(...e.cast.map((c) => motionDuration(e.motion, {distance: c.distance, height: PEOPLE[c.person].height}))) + REEL_HOLD;
  return Math.ceil(sec * REEL_FPS - 1e-6) / REEL_FPS;
};

export const reelShotId = (m: MotionId) => `kit-motion-${m}`;
/** Every motion id must be in the reel exactly once (checked by tests/poses-motions.test.ts). */
export const REEL_COVERS = MOTION_REEL.map((e) => e.motion);
export const REEL_ALL = MOTION_IDS;

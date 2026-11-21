import type {ExpressionId} from './expressions';
import {hash} from './hash';
import type {FaceState, Mouth} from './head';

// Activity mouths (13 Nov 2026, user-approved defaults): the mouth follows what the body is doing, over the expression's brows and eyes.
//   pant      running or after effort: an open `gape` mouth that opens and half-closes with the breath (2.5 a second, never shut)
//   clench    lifting or straining: gritted teeth (`clench`)
//   talk      speaking: the `talk` mouth on the seeded syllable cycle (`syllableOpen`) when nothing drives `open`
//   surprise  surprised mid-action: from `activityAt` the jaw drops wide in 0.08 s, holds, then settles half open (`gape`)
// Defaults (`paintFigureAt`, `layerMotion`): a pose or motion picks its activity (`POSE_ACTIVITY`, `MOTION_ACTIVITY`) and an expression id
// whose mouth is `talk` cycles, but only over a preset expression id, and pant / clench replace only a resting mouth (`RESTING_MOUTHS`),
// so a smile, a frown or an `o` the scene chose stays. A scene that sets `faceState.mouth` or `faceState.open`, or passes a whole
// `FaceState`, keeps its own mouth; a bare `faceState.mouth: 'talk'` with no `open` cycles like the `talk` preset (`sceneSetsMouth`). `activity: <id>` forces one over any expression mouth; `activity: false` (`ACTIVITY_MOUTHS_OFF`) turns it off.
// Sheet: KIT-ACTIVITY-MOUTHS (`activity-mouths-sheet.tsx`).

export const ACTIVITY_IDS = ['pant', 'clench', 'talk', 'surprise'] as const;
export type Activity = (typeof ACTIVITY_IDS)[number];

/** Pose sheet ids that pick an activity by default. */
export const POSE_ACTIVITY: Partial<Record<string, Activity>> = {P38: 'pant', P26: 'clench'};
/** Motion ids that pick an activity by default (`talk` and `point-and-say` already drive the talk mouth themselves). */
export const MOTION_ACTIVITY: Partial<Record<string, Activity>> = {'run-left-to-right': 'pant', 'run-right-to-left': 'pant'};
/** Mouths a default activity may replace: the closed resting mouth. */
export const RESTING_MOUTHS: readonly Mouth[] = ['flat'];

/** Spread into the options of a placement that must draw as before activity mouths (13 Nov 2026). */
export const ACTIVITY_MOUTHS_OFF = {activity: false} as const;

export type ActivityOpts = {
  /** Undefined = the default for the pose / motion / expression; an id forces it; false = off. */
  activity?: Activity | false;
  /** `surprise`: shot seconds when the surprise lands (default 0). */
  activityAt?: number;
};

/**
 * Mouth openness 0..1 of a seeded speech-like syllable envelope: about 5 syllables a second in words of 4, a pause after some
 * words, a level per syllable. Deterministic in `(t, seed)`. (Moved from `motions.ts`, which re-exports it.)
 */
export const syllableOpen = (t: number, seed: number): number => {
  if (t < 0) return 0;
  const SL = 0.2, i = Math.floor(t / SL), f = t / SL - i;
  if (i % 4 === 3 && hash(seed + Math.floor(i / 4) * 31 + 7) < 0.3) return 0; // a pause after some words
  const level = 0.35 + 0.65 * hash(seed * 3 + i * 13.7);
  return Math.pow(Math.sin(Math.PI * f), 0.6) * level;
};

/** Pant breath rate (per second) and the open range: a panting mouth never shuts. */
export const PANT_HZ = 2.5;
export const pantOpen = (t: number, seed: number): number => 0.3 + 0.7 * (0.5 - 0.5 * Math.cos(2 * Math.PI * (PANT_HZ * t + hash(seed * 7 + 3))));
/** Surprise jaw over the seconds since it landed: 0 → 1 in 0.08 s, held to 0.4 s, settling to 0.55 by 0.9 s. */
export const surpriseOpen = (s: number): number => {
  if (s < 0) return 0;
  if (s < 0.08) return s / 0.08;
  if (s < 0.4) return 1;
  const u = Math.min(1, (s - 0.4) / 0.5);
  return 1 - 0.45 * u * u * (3 - 2 * u);
};

/** What decides the default: the pose / motion id, and whether the face came from a preset id with no scene-set mouth. */
export type ActivityCtx = ActivityOpts & {pose?: string; motion?: string; t: number; seed: number;
  /** The expression id the face came from; undefined when the scene passed its own `FaceState`. */
  preset?: ExpressionId;
  /** The scene set `mouth` or `open` itself (paintFigureAt `faceState`). */
  sceneMouth?: boolean;
};

/**
 * Whether a scene's `faceState` drives the mouth itself. A bare `mouth: 'talk'` with no `open` does not: it asks for a talking mouth
 * over another expression's brows and eyes, so the syllable cycle still runs (it painted a closed line before, EDU-EP31 B06-SH02).
 */
export const sceneSetsMouth = (fs: Partial<FaceState>): boolean => fs.open !== undefined || (fs.mouth !== undefined && fs.mouth !== 'talk');

/** The activity in force for a placement, or null. */
export const activityOf = (face: FaceState, c: ActivityCtx): Activity | null => {
  if (c.activity === false) return null;
  if (c.activity) return c.sceneMouth ? null : c.activity;
  if (c.sceneMouth || !c.preset) return null;
  if (face.mouth === 'talk') return 'talk';
  const a = (c.motion && MOTION_ACTIVITY[c.motion]) || (c.pose && POSE_ACTIVITY[c.pose]) || null;
  return a && RESTING_MOUTHS.includes(face.mouth) ? a : null;
};

/** `face` with its mouth set by the activity in force (unchanged when none). Pure in its arguments. */
export const activityFace = (face: FaceState, c: ActivityCtx): FaceState => {
  const a = activityOf(face, c);
  if (!a) return face;
  if (a === 'pant') return {...face, mouth: 'gape', open: pantOpen(c.t, c.seed)};
  if (a === 'clench') return {...face, mouth: 'clench', open: 0};
  if (a === 'talk') return {...face, mouth: 'talk', open: Math.min(1, syllableOpen(c.t, c.seed) * (face.mouth === 'talk' ? (face.open ?? 0.7) / 0.7 : 1))};
  const s = c.t - (c.activityAt ?? 0);
  return s < 0 ? face : {...face, mouth: 'gape', open: surpriseOpen(s)};
};

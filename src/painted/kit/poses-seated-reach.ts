import type {FigPose} from './cast';
import type {V3} from './space';

// Seated reach poses (CP-P12 family on P31 `sit_chair_hands_lap`; EDU-EP16 brief N6, casting `new: seated reach-hover`, `new: withdraw-to-chest`,
// `new: look-up`; Boss W5.2, 2026-11-15). Kept in their own file, outside `poses-seated.ts` (EP06 / EP09 pinned scenes import that one), and outside
// the numbered pose sheet P01-P45: each pose is a set of world targets for the arm (metres, the scene's space) and a few FigPose fields, which the
// caller passes to `paintFigureAt` (`fig.rArm = {to, via, finger}` in picture px) and to a UT14 mitten drawn over the rig hand.
//
// - `seated-reach-hover`: the hand out over a target (a button), index extended, the others curled; the wrist sits behind and above the target
//   (default 2 cm toward +x, 7.5 cm up, 1 cm toward -z: the W3 LF-ROOF reach of EDU-EP16), the fingertip `hover` metres above it.
// - `withdraw-to-chest`: from a reach to a closed fist at the chest (held breath): the wrist lifts first, then comes in (an arc, not a straight
//   slide), the elbow drops back to the ribs; `k` 0..1, the mitten turns from pointing to a fist past `fistFrom`.
// - `look-up`: the head tips back to the sky: front and three-quarter heads shift their features up on the head sphere (`headPitch`, negative =
//   seen from below), a profile head cocks back (`headCock`, positive for a figure facing screen left); the eyes look up in both.
export const SEATED_REACH_IDS = ['seated-reach-hover', 'withdraw-to-chest', 'look-up'] as const;
export type SeatedReachId = (typeof SEATED_REACH_IDS)[number];
export const SEATED_REACH_INFO: Record<SeatedReachId, {description: string}> = {
  'seated-reach-hover': {description: 'Seated (P31), one hand out over a target, index extended and the other fingers curled, the fingertip hovering just above it.'},
  'withdraw-to-chest': {description: 'Seated (P31), the reaching hand lifts off the target and closes into a fist at the chest, elbow back to the ribs (held breath).'},
  'look-up': {description: 'Seated or standing, the head tipped back and the eyes up to the sky (front/3-4: features up on the head; profile: head cocked back).'},
};

const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

export type ReachTargets = {wrist: V3; elbow?: V3; /** World point the mitten's index aims at (the fingertip stops `hover` short of it on screen). */ aimAt: V3};

/** `seated-reach-hover`: wrist and aim for a fingertip `hover` m above `target`; `wristOff` moves the wrist (default the EP16 LF-ROOF reach). */
export const reachHover = (target: V3, o: {hover?: number; wristOff?: V3; elbow?: V3} = {}): ReachTargets => ({
  wrist: add(target, o.wristOff ?? [0.02, 0.075, -0.01]), aimAt: add(target, [0, o.hover ?? 0.01, 0]), ...(o.elbow ? {elbow: o.elbow} : {}),
});

/**
 * `withdraw-to-chest` at `k` 0..1 from `reach` to a fist at `chest` (wrist and elbow targets). The wrist rises `lift` m above the straight path
 * at mid-way (sin arc) and the elbow follows its own straight line to the chest elbow (by the ribs). `fist` is true past `fistFrom` (default 0.7).
 */
export const withdrawToChest = (k: number, reach: {wrist: V3; elbow: V3}, chest: {wrist: V3; elbow: V3}, o: {lift?: number; fistFrom?: number} = {}) => {
  const u = Math.max(0, Math.min(1, k)), e = u * u * (3 - 2 * u), arc = Math.sin(Math.PI * Math.min(1, u * 1.15)) * (o.lift ?? 0.06);
  return {wrist: add(lerp(reach.wrist, chest.wrist, e), [0, arc, 0]), elbow: lerp(reach.elbow, chest.elbow, e), fist: u >= (o.fistFrom ?? 0.7)};
};

/** `look-up` FigPose fields and the eye look vector for `amount` 0..1 (1 = about 30 deg back). `view` is the figure's four-view. */
export const lookUp = (view: 'front' | 'back' | 'left' | 'right', amount = 1, o: {lookX?: number} = {}): {fig: Partial<FigPose>; look: [number, number]} => {
  const a = Math.max(0, Math.min(1, amount));
  if (view === 'left' || view === 'right') return {fig: {headCock: (view === 'left' ? 1 : -1) * 16 * a, nod: [0, -0.03 * a]}, look: [(o.lookX ?? (view === 'left' ? -0.35 : 0.35)), -0.9 * a]};
  return {fig: {headPitch: -0.5 * a, nod: [0, -0.02 * a]}, look: [o.lookX ?? 0, -0.95 * a]};
};

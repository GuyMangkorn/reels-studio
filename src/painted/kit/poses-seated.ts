import type {PoseFigure} from './poses';
import {poseFor} from './poses';
import {bodyFrame, shoulderPoint, type CastDef} from './cast';
import type {Pt} from './painter';
import type {V3} from './space';
import {camPoint, type YCam} from './ycam';

// Two seated poses for EDU-EP06-SHORT (brief N7; Boss W5.2, 2026-11-07), built on P31 (`sit_chair_hands_lap`) and kept OUTSIDE the numbered
// pose sheet (P01-P45 stays as the user's sheet; promote them into it only on request). Use like a sheet pose:
//   `{face, ...seatedPose('seated-offer-palm', def, g, unit, 'front')}` next to a chair or sofa seat (`chairSpec(def).seatV`).
// - `seated-lean-in`: P31 with the torso tilted toward the other person (`lean` 0.12 -> 0.18 with `amount` 0..1, the 15 -> 25 degrees of the
//   brief) and a small head cock; arms stay P31's (elbows back, hands on the thighs, never splayed).
// - `seated-offer-palm`: P31 with one forearm held low and out, hand open and still (offered, not grabbing). `toward` is the screen side the palm
//   goes to: +1 = screen right (the character's left arm in the front view), -1 = screen left. Front and profile.
export const SEATED_POSE_IDS = ['seated-lean-in', 'seated-offer-palm'] as const;
export type SeatedPoseId = (typeof SEATED_POSE_IDS)[number];

export const SEATED_POSE_INFO: Record<SeatedPoseId, {description: string}> = {
  'seated-lean-in': {description: 'Seated, torso tilted toward the other person (15 to 25 degrees by `amount`), head cocked a little, hands in the lap; eyes wide, no blink (a hopeful stare).'},
  'seated-offer-palm': {description: 'Seated, one forearm low and out with the hand open and held still (an offered hand, not a grab); the other hand on the thigh.'},
};

export type SeatedOpts = {amount?: number; toward?: 1 | -1};

/** `PoseFigure` fields (plus `headCock` for the lean) of a seated pose; spread into `drawFigure`'s pose. */
export const seatedPose = (id: SeatedPoseId, def: CastDef, g: Pt, unit: number, view: 'front' | 'left' | 'right' = 'front', o: SeatedOpts = {}): PoseFigure & {headCock?: number} => {
  const base = poseFor('P31', def, g, unit, view);
  if (id === 'seated-lean-in') return {...base, lean: 0.12 + 0.06 * Math.max(0, Math.min(1, o.amount ?? 0)), headCock: 6};
  const toward = o.toward ?? 1, k = def.armScale ?? 1, dirU = view === 'front' ? 1 : view === 'left' ? -1 : 1;
  // arm points are picture px hung from the posed (seated) shoulder, as poseArms does: via = elbow close to the body and a little back, to = the open hand
  const arm = (side: 'r' | 'l', via: Pt, to: Pt): NonNullable<PoseFigure['rArm']> => {
    const sh = shoulderPoint(def, g, unit, {view, sit: 1}, side), px = (q: Pt): Pt => [sh[0] + dirU * q[0] * k * unit, sh[1] - q[1] * k * unit];
    return {via: px(via), to: px(to)};
  };
  if (view === 'front') {
    const side: 'r' | 'l' = toward > 0 ? 'l' : 'r';
    return {...base, [side === 'r' ? 'rArm' : 'lArm']: arm(side, [0.05 * toward, -0.25], [0.27 * toward, -0.33])};
  }
  // profile: the near arm (the one toward the viewer) offers forward, toward the side the figure faces
  return {...base, [view === 'right' ? 'rArm' : 'lArm']: arm(view === 'right' ? 'r' : 'l', [0.05, -0.255], [0.28, -0.32])};
};

/**
 * Picture px of a seated figure's knee (BOSS-3, EDU-EP06 B05-SH02: the cat's tail tip lands on it). `side` is the character's own side (front
 * view: 'l' = screen right); a profile has one near knee. Same transform as `drawFigure` for the P31 family (`sit: 1`), so it follows `g` and `unit`.
 */
export const seatedKnee = (def: CastDef, g: Pt, unit: number, side: 'r' | 'l', view: 'front' | 'left' | 'right' = 'front'): Pt => {
  const f = bodyFrame(def, {view, sit: 1}), legs = f.mode?.legs.filter((l) => !l.far) ?? [];
  const leg = view === 'front' ? legs.find((l) => (side === 'l' ? l.knee[0] > 0 : l.knee[0] < 0)) : legs[0];
  if (!leg) return [g[0], g[1]];
  return [g[0] + (view === 'left' ? -1 : 1) * leg.knee[0] * unit, g[1] - leg.knee[1] * unit];
};

// ---- N4 `seated-hands-on-table` (EDU-EP09 SET-DINING; Boss W5.2, 2026-11-08). P31 body, front view squared to the lens, each arm that rests on a
// table drawn to a world elbow on the wood (`via`) and down behind the table top (`to`); the forearm and hand on the wood are then painted by the
// caller (the hand macro). Kept outside the numbered pose sheet like the two above. World metres, `tableY` = table top height.
export const SEATED_HANDS_ON_TABLE = 'seated-hands-on-table' as const;
/** Elbow z on the wood just inside the back edge of a 0.8 m table whose centre is z 0. */
export const TABLE_ELBOW_Z = -0.37;
export type TableHands = {tableY: number; lHand?: V3; rHand?: V3; lElbow?: V3; rElbow?: V3; /** Elbow x offset from the hand toward the body (m): BOY -0.025 (under the shoulder), ELDER +0.03 (outside it). */ elbowIn?: number};
/** Default elbow on the wood for a hand: `side` +1 = the character's left arm (screen right in the front view). */
export const elbowOnTable = (hand: V3, side: 1 | -1, tableY: number, elbowIn = -0.025): V3 => [hand[0] + side * elbowIn, tableY + 0.026, TABLE_ELBOW_Z];
/** `PoseFigure` of a seated figure with forearms on a table; `cam` projects the world elbows. Spread into `drawFigure`'s pose with `view: 'front'`. */
export const seatedHandsOnTable = (cam: YCam, def: CastDef, g: Pt, unit: number, o: TableHands): PoseFigure => {
  const base = poseFor('P31', def, g, unit, 'front');
  const arm = (hand: V3 | undefined, elbow: V3 | undefined, side: 1 | -1): NonNullable<PoseFigure['lArm']> | null => {
    if (!hand) return null;
    const e = elbow ?? elbowOnTable(hand, side, o.tableY, o.elbowIn), via = camPoint(cam, e), to = camPoint(cam, [e[0], e[1] - 0.25, e[2] - 0.02]);
    return via && to ? {to, via} : null;
  };
  const l = arm(o.lHand, o.lElbow, 1), r = arm(o.rHand, o.rElbow, -1);
  return {...base, view: 'front', ...(l ? {lArm: l} : {}), ...(r ? {rArm: r} : {})};
};

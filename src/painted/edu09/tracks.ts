// EDU-EP09-SHORT W5.2 (Boss, 8 Nov 2026): pure time tracks for the room hands, keyed by the scene sheet's shot-local frames (SHEETS-R2).
// N5 `reach-own-hand` + `gentle-stop` (S01-B01-SH04), N11 `hand-lifted-dangle` (S01-B03-SH07), and the TP_LIFTS / `liftFinger` tracks
// (B01-SH03, B02-SH01, B03-SH04, B03-SH08). Each returns data a composition spreads into `paintDining` / `boyHand`; no painting here.
import {EXPRESSIONS} from '../kit/expressions';
import {liftFinger, TP_LIFTS, type FingerId, type HandMacro, type LongFingerId} from '../kit/hands';
import type {V3} from '../kit/space';
import {TABLE_Y, type Sitter} from './dining';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sm = (u: number) => { const k = clamp(u); return k * k * (3 - 2 * k); };
/** 0 before `a`, eased to 1 at `b`, 1 after. */
export const ramp = (f: number, a: number, b: number) => sm((f - a) / (b - a));
const mix3 = (p: V3, q: V3, u: number): V3 => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2] + (q[2] - p[2]) * u];

// ---- TP_LIFTS tracks: per shot, finger -> tip rise in cm (size 1), for `boyHand(pose, {lift})` or a hand `lMod`.
export type LiftMap = Partial<Record<FingerId, number>>;
const up = (f: number, a: number, b: number, c: number, d: number, peak: number) => peak * (ramp(f, a, b) - ramp(f, c, d));
/** S01-B01-SH03: ring hair-lift 0.4 cm L19-26, hold with tremble L27-35, back down L36-41. */
export const liftB01SH03 = (f: number): LiftMap => ({ring: up(f, 19, 26, 36, 41, TP_LIFTS['ring-hair'])});
/** S01-B02-SH01 three taps: thumb L14-21 up / L22-26 down, index L33-40 / L41-45, little L47-52 / L53-56, then all three together L58-65 (hold to L88). */
export const liftB02SH01 = (f: number): LiftMap => {
  const all = ramp(f, 58, 65);
  return {
    thumb: Math.max(up(f, 14, 21, 22, 26, TP_LIFTS.thumb), all * TP_LIFTS.thumb),
    index: Math.max(up(f, 33, 40, 41, 45, TP_LIFTS.index), all * TP_LIFTS.index),
    little: Math.max(up(f, 47, 52, 53, 56, TP_LIFTS.little), all * TP_LIFTS.little),
  };
};
/** S01-B03-SH04: ring tip rises 0.3 cm L92-101 and stops. */
export const liftB03SH04 = (f: number): LiftMap => ({ring: TP_LIFTS['ring-diagram'] * ramp(f, 92, 101)});
/** S01-B03-SH08 (flat hand): index and little lift 2.0 cm together L5-10 and hold; ring stays down. */
export const LIFT_SH08 = 2.0;
export const liftB03SH08 = (f: number): LiftMap => ({index: LIFT_SH08 * ramp(f, 5, 10), little: LIFT_SH08 * ramp(f, 5, 10)});
/** Apply a lift map (cm, size-scaled; `unit` world units per cm) to a macro hand. */
export const withLifts = (h: HandMacro, lifts: LiftMap): HandMacro => {
  const k = (h.size ?? 1) * (h.unit ?? 1);
  return (Object.entries(lifts) as [FingerId, number][]).reduce((a, [f, r]) => (r > 1e-6 ? liftFinger(a, f, r * k) : a), h);
};

// ---- N11 hand-lifted-dangle (S01-B03-SH07). Hand points are the middle MCP (dining metres), elbow stays on the wood at BOY_ELBOW_L.
export const BOY_ELBOW_L: V3 = [-0.13, TABLE_Y + 0.026, -0.32];
export const DANGLE_REST: V3 = [-0.2, TABLE_Y, -0.09];
export const DANGLE_UP: V3 = [-0.19, 0.83, -0.14];
export const BOB_AMP = 0.012;
/** Wrist bob in y (m): 0 before L8, then +-0.012 m at 3 Hz (10 f period) from L8 to L40, back to the mean after. */
export const bobAt = (f: number) => (f < 8 ? 0 : f > 40 ? 0 : BOB_AMP * Math.sin(((f - 8) / 10) * Math.PI * 2) * ramp(f, 8, 9) * (1 - ramp(f, 38, 40)));
/** Hand point of SH07 at local frame f: lifts L0-7 from the rest to DANGLE_UP, then bobs. */
export const dangleHandAt = (f: number): V3 => { const p = mix3(DANGLE_REST, DANGLE_UP, ramp(f, 0, 7)); return [p[0], p[1] + bobAt(f), p[2]]; };
/** Finger lag: each finger trails the wrist by one more frame, index (1 f) to little (4 f), the thumb 0; the delayed bob swings its MCP (deg per bob amplitude 8). */
export const FINGER_LAG: Record<LongFingerId, number> = {index: 1, middle: 2, ring: 3, little: 4};
export const dangleMod = (f: number) => (h: HandMacro): HandMacro => {
  const fingers = {...h.fingers};
  (Object.keys(FINGER_LAG) as LongFingerId[]).forEach((id) => { fingers[id] = {...fingers[id], mcp: fingers[id].mcp + (8 * (bobAt(f - FINGER_LAG[id]) - bobAt(f))) / BOB_AMP}; });
  return {...h, fingers};
};
/** BOY's SH07 sitter fields (hand only; faces `surprised` L0-14 then `happy`). Spread into `paintDining`'s `boy`. */
export const marionetteBoy = (f: number): Pick<Sitter, 'lHand' | 'lElbow' | 'lPose' | 'lMod' | 'face'> => ({
  lHand: dangleHandAt(f), lElbow: BOY_ELBOW_L, lPose: ramp(f, 0, 1) > 0 ? 'hand-lifted-dangle' : 'flat', lMod: dangleMod(f),
  face: {...(f < 15 ? EXPRESSIONS.surprised : EXPRESSIONS.happy), look: [0.4, -0.5]},
});

// ---- N5 reach-own-hand + gentle-stop (S01-B01-SH04, local frames 0-67). BOY's left hand is TP at BOY_TEST_HAND for the whole shot.
export const BOY_TEST_HAND: V3 = [-0.14, TABLE_Y, -0.26];
const REACH_FROM: V3 = [-0.38, TABLE_Y, -0.28], REACH_TO: V3 = [-0.235, TABLE_Y, -0.2];
const REACH_ELBOW_FROM: V3 = [-0.405, TABLE_Y + 0.026, -0.37], REACH_ELBOW_TO: V3 = [-0.31, TABLE_Y + 0.026, -0.37];
/** BOY's right hand: from L6 it slides toward his left ring finger (L6-27 eased), is stopped at L27, lowers to the wood L27-47 and stays. */
export const reachOwnHandAt = (f: number): {hand: V3; elbow: V3} => {
  const u = ramp(f, 6, 27), hand = mix3(REACH_FROM, REACH_TO, u), hover = 0.014 * ramp(f, 6, 12) * (1 - ramp(f, 27, 47));
  return {hand: [hand[0], hand[1] + hover, hand[2]], elbow: mix3(REACH_ELBOW_FROM, REACH_ELBOW_TO, u)};
};
const STOP_FROM: V3 = [0.2, TABLE_Y, -0.3], STOP_OVER: V3 = [-0.25, TABLE_Y, -0.205];
const STOP_ELBOW_FROM: V3 = [0.17, TABLE_Y + 0.026, -0.37];
/** FX08 (second pass): ELDER leans in over the table L10-27 ([dx, dz] m) so his arm reaches BOY's wrist at a believable length (it was 285 px upper arm and 188 px forearm against BOY's 169 and 118 at the same head size). */
export const ELDER_LEAN: [number, number] = [-0.18, 0.1];
export const elderLeanAt = (f: number): [number, number] => { const k = ramp(f, 10, 27); return [ELDER_LEAN[0] * k, ELDER_LEAN[1] * k]; };
/** ELDER's right hand: lifts from the table at L12 and goes BEHIND the milk box (z -0.50, the box hides it for a few frames), comes round its left side and settles palm-down on BOY's right wrist at L27, then lowers L27-47 to rest on the wrist.
 *  The elbow trails the hand on the far side of the box (0.17-0.03 m to its right, 0.04-0.245 m behind), so no part of the arm crosses the box (FX04, FX08). */
export const gentleStopAt = (f: number): {hand: V3; elbow: V3} => {
  const u = ramp(f, 12, 27), arc = 0.07 * Math.sin(Math.PI * clamp((f - 12) / 15)), rest = 0.03 + 0.04 * (1 - ramp(f, 27, 47));
  const lift = f < 27 ? arc + 0.03 * u : rest;
  const w1 = ramp(u, 0, 0.25), w2 = ramp(u, 0.55, 1);
  const x = STOP_FROM[0] + (STOP_OVER[0] - STOP_FROM[0]) * ramp(u, 0.2, 1); // back first at x 0.2 (right of the box), then across behind it
  const z = (STOP_FROM[2] - 0.23 * w1) + (STOP_OVER[2] - (STOP_FROM[2] - 0.23 * w1)) * w2;
  const trailX = 0.03 + 0.14 * ramp(u, 0.3, 0.7) - 0.05 * w2, trailZ = 0.17 - 0.07 * w1 + (0.245 - 0.1) * w2; // FX08 third pass: at rest the elbow hangs 0.17 m behind the wrist over the table's back edge (it sat 0.07 behind: no forearm, a 0.40 m upper arm)
  return {hand: [x, TABLE_Y + lift, z], elbow: [x + trailX, STOP_ELBOW_FROM[1], z - trailZ]};
};
/** Both sitters of SH04 at local frame f (the tracks above plus the sheet's faces: ELDER `happy`, BOY `worried` -> `neutral` at L40). The ELDER head shake L30-40 and the camera are the composition's. */
export const stopSitters = (f: number): {boy: Sitter; elder: Sitter} => {
  const r = reachOwnHandAt(f), s = gentleStopAt(f), t = f / 30;
  return {
    boy: {t, face: f < 40 ? EXPRESSIONS.worried : EXPRESSIONS.neutral, lHand: BOY_TEST_HAND, lElbow: [-0.13, TABLE_Y + 0.026, -0.37], lPose: 'test-fold-middle', rHand: r.hand, rElbow: r.elbow, rPose: 'flat'},
    elder: {t: t + 0.7, face: EXPRESSIONS.happy, rHand: s.hand, rElbow: s.elbow, rPose: 'flat', lean: elderLeanAt(f)},
  };
};

import {BONE, ikElbow} from '../kit/cast';
import type {Pt} from '../kit/painter';

/**
 * Arm that reaches a point, composed with the kit two-bone IK (ZC2-SB-R3 fix: no hand-placed elbows). `S` shoulder anchor, `h` the point the
 * fist/palm lands on (plate px), `U` px/m. Both bones are BONE x U (upper arm = forearm); `to` is the wrist (the mitten reaches `reach` m
 * past it); a target beyond reach is clamped to a straight arm. `out` picks the elbow side (-1 = viewer-left, +1 = viewer-right).
 */
export const reachArm = (S: Pt, h: Pt, U: number, out: number, reach = 0.075): {to: Pt; via: Pt} => {
  const L = BONE * U, dx0 = h[0] - S[0], dy0 = h[1] - S[1], d0 = Math.hypot(dx0, dy0) || 1;
  const wd = Math.max(d0 - reach * U, 0.3 * L), k = Math.min(wd, 2 * L - 1) / d0, to: Pt = [S[0] + dx0 * k, S[1] + dy0 * k];
  return {to, via: ikElbow(S, to, L, out)};
};

/**
 * Hand brought to a point near the shoulder (hand over the mouth, CP-P07): authored, not IK. The forearm is a full BONE x U at `deg`
 * off vertical, leaning inward toward the body midline by `side` (+1 = the hand lies to the viewer-right of the elbow); the elbow
 * lands below and in front of the chest, so the upper arm is foreshortened on screen (it points at the camera).
 */
export const handOverMouth = (S: Pt, h: Pt, U: number, deg: number, reach = 0.07, side = 1): {to: Pt; via: Pt} => {
  const a = (deg * Math.PI) / 180, d: Pt = [side * Math.sin(a), -Math.cos(a)];
  const to: Pt = [h[0] - d[0] * reach * U, h[1] - d[1] * reach * U];
  const via: Pt = [to[0] - d[0] * BONE * U, to[1] - d[1] * BONE * U];
  void S;
  return {to, via};
};


// EDU-EP14 N13 GIRL motions (kit intake proposed): authored with the kit's `Motion` helpers and layered with `layerMotion({motion: fn})`. The sting arm is the rig's
// `lArm` throughout: the screen-right visor arm in the front view (P30), the near arm in the left profile, so the arm that is shading her eyes is the arm that is
// stung (B01-SH09) and the arm that goes out (B05-SH01). (The sheets call it "right"; on the card it is the character's left, one arm in every shot.)
import {hump, seg, type Motion, type Reach} from '../kit/motions';

const FPS = 30;
const mixR = (a: Reach, b: Reach, k: number): Reach => ({to: [a.to[0] + (b.to[0] - a.to[0]) * k, a.to[1] + (b.to[1] - a.to[1]) * k], via: [a.via[0] + (b.via[0] - a.via[0]) * k, a.via[1] + (b.via[1] - a.via[1]) * k], near: ((a.near ?? 0) + ((b.near ?? 0) - (a.near ?? 0)) * k) || undefined});

/** `new: flinch-clutch-forearm` (front, B01-SH09): at +6 the stung forearm snaps to the chest in 3 f, the other hand covers the spot, shoulders up, `ouch` +6..+30, then a rub +30..+41. */
export const FLINCH_ARM_HIT = 6;
export const flinchClutchForearm: Motion = (t) => {
  const f = t * FPS, e = seg(f, FLINCH_ARM_HIT, FLINCH_ARM_HIT + 3), rub = Math.sin(((f - 30) / 11) * Math.PI * 4) * seg(f, 30, 32) * (1 - seg(f, 40, 42));
  if (e <= 0) return {face: 'neutral', look: [0, 0.8]};
  const sting: Reach = {to: [-0.09, -0.17], via: [0.08, -0.2], near: 0.12}, cover: Reach = {to: [0.16 + 0.012 * rub, -0.17 + 0.01 * rub], via: [-0.07, -0.2], near: 0.14};
  const restSting: Reach = {to: [0.012, 0.055 * 0 + 0.0], via: [0.0, 0.0]};
  void restSting;
  return {
    reach: {l: mixR({to: [0.02, 0.12], via: [0.11, 0.0]}, sting, e), r: mixR({to: [-0.04, -0.4], via: [-0.04, -0.2]}, cover, e)},
    face: 'ouch',
    body: {rise: 0.012 * e * (1 - seg(f, 24, 40)), crouch: 0.1 * hump(f, FLINCH_ARM_HIT, 22), nod: [0, -0.02 * e]},
  };
};

/** `new: hand-out-palm-up` (left profile, B05-SH01): the visor arm leaves the brow +15 and goes out past the drip line (crossing at +42), settling at P11 by +69, palm up. */
export const handOutPalmUp: Motion = (t) => {
  const f = t * FPS, u = seg(f, 15, 69);
  return {arms: {a: 'P30', b: 'P11', u}, face: f < 64 ? 'neutral' : 'happy'};
};

/** `new: palm-held-out` (front, B05-SH03): the screen-right arm (`lArm`, the arm that went out in B05-SH01) is held forward from the shoulder, forearm level, open hand in front of the chest (to about (0.35, 0.85, 0.45) m, R3.1)
 * to catch the rain; the other arm hangs. Static (the laugh is the face, the shoulders lift a little with it). */
export const palmHeldOut: Motion = (t) => {
  const f = t * FPS, laugh = hump(f, 3, 18);
  return {
    reach: {l: {to: [0.22, -0.2], via: [0.08, -0.36], near: 0.14}, r: {to: [-0.04, -0.4], via: [-0.04, -0.2]}},
    body: {rise: 0.008 * laugh},
  };
};

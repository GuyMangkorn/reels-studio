import {H, type Arm, type FigPose} from '../kit/cast';
import {HEAD_SPAN} from '../kit/head';
import {clamp01, type Painter, type Pt} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {KSO_WOMAN} from './cast';
import {maskOutline} from './face';
import {HEAD_CENTRE_M} from './space';
import {HAND_WOMAN} from './shot-art';
import {paintMassHand, sm} from './shot-motion';

// The woman's hand on the mask (S02-B03-SH02 pull, S02-B03-SH03 yank and release; user notes 1 Nov 2026). Round 3 (the arm
// jerked): the arm is no longer solved by IK from the mask edge, whose elbow solution flipped as the edge moved down. The pose is
// authored as a reach in depth: the fingers hook over the mask's left edge pointing up and in, the forearm drops from the wrist
// down and a little out toward the camera (foreshortened to 0.17 m), the elbow low and in front of the chest (P12
// surprise_cover_mouth: hand at the jaw side, elbow low). Wrist, elbow and hand angle are smooth functions of the mask state, so
// the shoulder drives the reach with no frame-to-frame pops. On release the wrist and elbow ease to the P01 hang (arm at the
// side) and the hand turns to follow the forearm. The two-mass hand (`paintMassHand`) is painted over the rig mitten. Pure.

const HAND_LEN = 0.15; // m: wrist to fingertips (the four-finger mass)
const FOREARM = 0.17; // m: the forearm on screen, foreshortened toward the camera
const EDGE = 15; // mask outline vertex the hand holds: the left edge below the ear loop (WORN [-0.96, 0.6])

/** Head centre of the woman at ground point `g` (plate px), as the rig puts it (space.ts HEAD_CENTRE_M). */
export const womanHead = (g: Pt, unit: number): Pt => [g[0], g[1] - HEAD_CENTRE_M * unit];

const mix = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

/**
 * The grip on the mask edge at mask state `m`: the right arm (shoulder -> authored elbow -> wrist) and a function painting the
 * hand after the figure. `release` 0..1 lets go: the arm eases (smoothstep) to the P01 hang at the side; `fist` 0..1 closes the hand.
 */
export const maskGrip = (g: Pt, unit: number, m: number, o: {release?: number; fist?: number} = {}): {rArm: Arm; paintHand: (p: Painter) => void} => {
  const K = (H / HEAD_SPAN) * unit;
  const head = womanHead(g, unit), e = maskOutline(m)[EDGE];
  const G: Pt = [head[0] + e[0] * K, head[1] + e[1] * K];
  const Lh = HAND_LEN * unit, overlap = 0.02 * unit;
  // Grip: the hand points up and in (0.32 rad off vertical), turning in a little as it pulls down; the forearm hangs below it.
  const pull = clamp01(m / 0.15);
  const ha = 0.32 + 0.16 * pull, fa = 0.3 - 0.08 * pull;
  const d: Pt = [Math.sin(ha), -Math.cos(ha)];
  const Wg: Pt = [G[0] - d[0] * (Lh - overlap), G[1] - d[1] * (Lh - overlap)];
  const Eg: Pt = [Wg[0] - Math.sin(fa) * FOREARM * unit, Wg[1] + Math.cos(fa) * FOREARM * unit];
  // Hang: the P01 hand target and elbow (CP-P05).
  const hang = poseArms('P01', KSO_WOMAN, g, unit).rArm!;
  const r = sm(o.release ?? 0);
  const W = mix(Wg, hang.to, r), E = mix(Eg, hang.via ?? mix(Eg, hang.to, 0.5), r);
  const rArm: Arm = {to: W, via: E};
  const paintHand = (p: Painter) => {
    // `fist` 0..1 (round 4, user: the released hand closes to a fist like the other one): the finger mass draws in toward the
    // wrist; at 1 it is not painted and the rig's mitten (the same round fist as the left hand) remains.
    const c = sm(o.fist ?? 0);
    if (c >= 1) return;
    const Lf = Lh * (1 - 0.6 * c);
    // Hand angle: the grip direction while holding, the forearm direction (elbow -> wrist) once hanging; turned through the inside.
    const ag = Math.atan2(d[1], d[0]), af = Math.atan2(W[1] - E[1], W[0] - E[0]);
    const ang = ag + (af - ag) * r;
    const dd: Pt = [Math.cos(ang), Math.sin(ang)];
    const tip: Pt = [W[0] + dd[0] * Lf, W[1] + dd[1] * Lf];
    const side = 1; // the thumb stays on one side of the hand as it turns (no flip)
    const n: Pt = [-dd[1] * side, dd[0] * side];
    const thumb: Pt = [tip[0] - dd[0] * Lf * 0.3 + n[0] * Lf * 0.36, tip[1] - dd[1] * Lf * 0.3 + n[1] * Lf * 0.36];
    paintMassHand(p, KSO_WOMAN.seed * 1000 + 800, HAND_WOMAN, W, tip, thumb, side);
  };
  return {rArm, paintHand};
};

/** The woman's left arm at the P01 hang (arm at the side). */
export const hangLeftArm = (g: Pt, unit: number): Arm => poseArms('P01', KSO_WOMAN, g, unit).lArm!;

export type GhostArms = Pick<FigPose, 'rArm' | 'lArm'>;

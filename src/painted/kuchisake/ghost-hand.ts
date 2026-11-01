import {BONE, H, ikElbow, type Arm, type FigPose} from '../kit/cast';
import {HEAD_SPAN} from '../kit/head';
import type {Painter, Pt} from '../kit/painter';
import {KSO_WOMAN} from './cast';
import {maskOutline} from './face';
import {HEAD_CENTRE_M} from './space';
import {HAND_WOMAN} from './shot-art';
import {armTarget, paintMassHand, shoulderPx, sm} from './shot-motion';

// The woman's hand on the mask (S02-B03-SH02 pull, S02-B03-SH03 yank, S03-B01-SH01 put-back; user note 1 Nov 2026). The rig arm
// carries the hand: its right arm (screen left) reaches the mask's left edge so the forearm is connected to the shoulder, and
// the two-mass hand (`paintMassHand`: four fingers + thumb) is painted over the rig mitten with the fingertips and the thumb on
// the mask edge. Pose basis: P12 (surprise_cover_mouth: hand at the jaw side, elbow low and out) for the reaching right arm,
// P06 (shrug_palms_up) for the free left arm. Pure functions of (m, lf).

const HAND_LEN = 0.15; // m: wrist to fingertips (the four-finger mass)
const EDGE = 15; // mask outline vertex the hand holds: the left edge below the ear loop (WORN [-0.96, 0.6])

/** Head centre of the woman at ground point `g` (plate px), as the rig puts it (space.ts HEAD_CENTRE_M). */
export const womanHead = (g: Pt, unit: number): Pt => [g[0], g[1] - HEAD_CENTRE_M * unit];

/**
 * The grip on the mask edge at mask state `m`: the right arm target (from the shoulder) and a function painting the hand
 * after the figure. `hold` 0..1 eases the arm off the mask (1 = holding). Returns undefined hand when `hold` is 0.
 */
export const maskGrip = (g: Pt, unit: number, m: number, o: {hold?: number; relaxed?: Pt} = {}): {rArm: Arm; paintHand: (p: Painter) => void} => {
  const hold = o.hold ?? 1;
  const K = (H / HEAD_SPAN) * unit;
  const head = womanHead(g, unit), e = maskOutline(m)[EDGE];
  const G: Pt = [head[0] + e[0] * K, head[1] + e[1] * K];
  const Sh = shoulderPx(KSO_WOMAN, g, unit, 'r');
  const Lh = HAND_LEN * unit, overlap = 0.02 * unit;
  let dir: Pt = [0.8, -0.6], W: Pt = [0, 0];
  for (let i = 0; i < 3; i++) {
    W = [G[0] - dir[0] * (Lh - overlap), G[1] - dir[1] * (Lh - overlap)];
    const E = ikElbow(Sh, W, BONE * unit, -1);
    const dx = W[0] - E[0], dy = W[1] - E[1], l = Math.hypot(dx, dy) || 1;
    dir = [dx / l, dy / l];
  }
  // Ease off the mask toward a relaxed hand position (offset from the shoulder, metres) as `hold` falls.
  const rel = armTarget(KSO_WOMAN, g, unit, 'r', o.relaxed ?? [-0.3, -0.25]);
  const Wh: Pt = [rel[0] + (W[0] - rel[0]) * hold, rel[1] + (W[1] - rel[1]) * hold];
  const rArm: Arm = {to: Wh, out: -1};
  const paintHand = (p: Painter) => {
    // The fingers point at the held mask edge, so the fingertips and the thumb land on it (overlap `overlap` px).
    const dx = G[0] - Wh[0], dy = G[1] - Wh[1], l = Math.hypot(dx, dy) || 1, d: Pt = [dx / l, dy / l];
    const tip: Pt = [Wh[0] + d[0] * Lh, Wh[1] + d[1] * Lh];
    const side: 1 | -1 = d[0] >= 0 ? 1 : -1; // the thumb on the lower side
    const n: Pt = [-d[1] * side, d[0] * side];
    const thumb: Pt = [tip[0] - d[0] * Lh * 0.3 + n[0] * Lh * 0.36, tip[1] - d[1] * Lh * 0.3 + n[1] * Lh * 0.36];
    paintMassHand(p, KSO_WOMAN.seed * 1000 + 800, HAND_WOMAN, Wh, tip, thumb, side);
  };
  return {rArm, paintHand};
};

/** The free left arm (screen right): from the hang toward a gesture offset `to` (metres from the shoulder) by `u` 0..1 (P06 shrug_palms_up reach). */
export const freeLeftArm = (g: Pt, unit: number, to: Pt, u: number, hang: Pt = [0.045, -0.518]): Arm => {
  const k = sm(u);
  return {to: armTarget(KSO_WOMAN, g, unit, 'l', [hang[0] + (to[0] - hang[0]) * k, hang[1] + (to[1] - hang[1]) * k]), out: 1};
};

export type GhostArms = Pick<FigPose, 'rArm' | 'lArm'>;

import {drawFigure, type Arm, type FigPose} from '../kit/cast';
import {capsule, ell, inkLine, lineOf, solid, toneOf, type InteriorLight} from '../kit/draw';
import type {FaceState} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {COWORKER, roomP, roomUnit} from './rooms';
import {armTarget, sm, talkOpen} from './shot-motion';

// The izakaya coworker at the table (S01-B02-SH01, SH02, SH03). Same rig, place, light and face as izakaya.tsx `paintCoworker`;
// only the arms change. Round 4 (user notes 1 Nov 2026):
// - `tell` (SH01): the round-3 elbow sat at 0.66 m, under the table's back edge (it covers her below 0.69 m from this lens), so
//   a bare forearm rose out of the table with no bend in view ("the elbow crease is too low"). The elbows now sit at the waist,
//   0.25 m under the shoulder (about 0.93 m, 0.24 m above the table line), just inside the torso edge with the upper arm behind
//   the torso (CP-P02, `behind: 'upper'`), so the bend shows and the forearm comes forward and up to the hands in front of the
//   apron. Hand placement P06 (shrug_palms_up, hands a little wider than the elbows); elbows CP-P02 instead of P06's CP-P01
//   splay (the user's round-3 depth note). The hands lift and spread a little with the speech envelope.
// - `hang` (SH02): both arms hang close to the body, P01 (CP-P05); the hands fall below the table line. Mouth lip-syncs.
// - `glass` (SH03): the left arm (screen right) hangs at the side (P01); the right arm (screen left) reaches over the table to
//   the beer glass and holds it (P01 -> reach; no pose in P01-P30 covers a reach forward to a table object, nearest P05
//   point_side with the elbow bent, CP-P12 deviation; the hand reads P10's closed grip). The rig carries the arm; a hand-painted
//   rounded hand (knuckles at the glass's left edge, four curled fingers wrapped across its front toward screen right, thumb tip
//   at the rim) covers the rig mitten, painted after the table (`paintGlassGrip`).
// Frame-by-frame drawing is not needed: the rig takes authored elbows (`via`), and the defect was the elbow height, not the rig.

const COW_G: [number, number, number] = [0, 0, 2.0];
const L_COW: InteriorLight = {key: [-0.25, -1], rim: [0.7, 0.8], rimScale: 0.3};
/** `tell` arm offsets from each shoulder anchor (m, u outward, v up): the elbow at the waist, the hand at rest and at full emphasis. */
const ELBOW: Pt = [0.02, -0.25], HAND0: Pt = [0.065, -0.16], HAND1: Pt = [0.1, -0.1];
/** The beer glass on the table (izakaya.tsx: x -0.25..-0.19, z 2.42, 0.75..0.87 m) and the grip height on it (m). */
const GLASS_X0 = -0.25, GLASS_X1 = -0.19, GLASS_Z = 2.42, GRIP_Y0 = 0.775, GRIP_Y1 = 0.845;
/** SH03 reach timing (shot-local frames): the hand leaves the side at REACH_F0 and closes on the glass at REACH_F1. */
export const REACH_F0 = 14, REACH_F1 = 40;

export type CoworkerArms = 'tell' | 'hang' | 'glass';

const g0 = (): Pt => roomP(COW_G);
const u0 = () => roomUnit(COW_G[2]);
/**
 * The grip on the glass (world metres at the glass depth), user correction round 4: her right hand (screen left) closes on the
 * glass from its screen-left side, palm toward her midline, so the back of the hand and knuckles sit at the glass's left edge
 * and the curled fingers wrap across the glass front toward screen right (the round-4 first pass pointed them the wrong way).
 * Hand pose: P10 (hold_phone_chest) hand closed round an object, read for the grip only (CP-P12).
 */
const GRIP_WRIST: [number, number] = [GLASS_X0 - 0.018, (GRIP_Y0 + GRIP_Y1) / 2 - 0.006];
const gp3 = (x: number, y: number): Pt => roomP([x, y, GLASS_Z]);

/** The SH03 reach 0..1 at shot-local frame `f`. */
export const reachAt = (f: number) => sm((f - REACH_F0) / (REACH_F1 - REACH_F0));

/** The `tell` arm on `side` (rig plate px). */
const tellArm = (side: 'r' | 'l', e: number, wob: Pt): Arm => {
  const s = side === 'r' ? -1 : 1, g = g0(), u = u0();
  const hand: Pt = [s * (HAND0[0] + (HAND1[0] - HAND0[0]) * e + wob[0]), HAND0[1] + (HAND1[1] - HAND0[1]) * e + wob[1]];
  return {via: armTarget(COWORKER, g, u, side, [s * ELBOW[0], ELBOW[1]]), to: armTarget(COWORKER, g, u, side, hand), behind: 'upper'};
};

/** The SH03 reaching right arm at reach `k`: from the P01 hang to the glass, elbow a little out and back. */
const reachArm = (k: number): Arm => {
  const g = g0(), u = u0();
  const hang = poseArms('P01', COWORKER, g, u).rArm!;
  // On the glass the rig hand target is the painted wrist, so the rig mitten sits under the painted fingers and the table.
  const wrist = gp3(GRIP_WRIST[0], GRIP_WRIST[1]);
  const to: Pt = [hang.to[0] + (wrist[0] - hang.to[0]) * k, hang.to[1] + (wrist[1] - hang.to[1]) * k];
  const viaR: Pt = armTarget(COWORKER, g, u, 'r', [-0.075, -0.235]);
  const via: Pt = [hang.via![0] + (viaR[0] - hang.via![0]) * k, hang.via![1] + (viaR[1] - hang.via![1]) * k];
  return {to, via};
};

/** The coworker at plate clock `tl` (s), global (timeline) frame `gf` for the speech envelope; `arms` picks the shot's arm mode. */
export const drawCoworkerTelling = (p: Painter, tl: number, gf: number, o: {face?: FaceState; arms?: CoworkerArms; f?: number} = {}): void => {
  const g = g0(), u = u0();
  const open = talkOpen(gf, 0.5);
  const mode = o.arms ?? 'tell';
  let rArm: Arm, lArm: Arm;
  if (mode === 'tell') {
    // Emphasis: the envelope smoothed over about 0.4 s lifts each hand; the left hand follows 5 frames behind, with its own slow drift.
    const env = (d: number[]) => Math.min(1, d.reduce((s, k) => s + talkOpen(gf + k, 0.5), 0) / 1.2);
    const wob = (ph: number): Pt => [0.01 * Math.sin(tl * 1.7 + ph), 0.012 * Math.sin(tl * 2.3 + ph)];
    rArm = tellArm('r', env([-6, -3, 0]), wob(0));
    lArm = tellArm('l', env([-11, -8, -5]), wob(2));
  } else {
    const hang = poseArms('P01', COWORKER, g, u);
    rArm = mode === 'glass' ? reachArm(reachAt(o.f ?? 0)) : hang.rArm!;
    lArm = hang.lArm!;
  }
  const f: FaceState = o.face ?? {brow: 'flat', eyes: 'wide', look: [0, 0], mouth: 'talk', open};
  const pose: FigPose = {view: 'front', face: f, light: L_COW, warm: 1, rArm, lArm};
  drawFigure(p, COWORKER, g, u, pose, tl);
};

/**
 * SH03, painted after the table: the forearm over the table edge and a rounded, curled hand. From reach 0.55 the closed hand
 * (back of the hand and knuckles, a rounded mass) rides the rig wrist onto the table; on the way in the four curled fingers
 * grow across the glass front (pinky lowest, index at the top, rounded tips) and the thumb tip shows over the rim.
 */
export const paintGlassGrip = (p: Painter, f: number): void => {
  const k = reachAt(f);
  if (k < 0.55) return;
  const u = u0(), ku = roomUnit(GLASS_Z);
  const skin = toneOf(mixColor(COWORKER.head.skin, '#f6c27a', 0.35), L_COW);
  const shade = mixColor(skin, '#2a1408', 0.2), crease = lineOf(skin, L_COW);
  const c = sm((k - 0.55) / 0.45);
  const {to: wrist, via: elbow} = reachArm(k) as {to: Pt; via: Pt};
  const W = gp3(GRIP_WRIST[0], GRIP_WRIST[1]);
  const off: Pt = [wrist[0] - W[0], wrist[1] - W[1]];
  const at = (x: number, y: number): Pt => {
    const q = gp3(x, y);
    return [q[0] + off[0], q[1] + off[1]];
  };
  const part = (seed: number, color: string, pts: Pt[], line = true) => {
    solid(p, seed, color, pts, 4, 0, 0.2);
    if (line) inkLine(p, seed + 50, pts, {weight: 1.1, color: crease});
  };
  // Forearm into the wrist, covering the rig wrist.
  const from: Pt = [elbow[0] + (wrist[0] - elbow[0]) * 0.7, elbow[1] + (wrist[1] - elbow[1]) * 0.7];
  part(6_430_001, skin, capsule(from, wrist, 0.058 * u, 0.05 * ku));
  // Back of the hand: a rounded mass from the wrist to the knuckle line at the glass's left edge.
  const [hx, hy] = [GLASS_X0 - 0.006, GRIP_WRIST[1] + 0.012];
  const hc = at(hx, hy);
  part(6_430_010, shade, ell(hc[0], hc[1], 0.03 * ku, 0.045 * ku, 18, 0.25));
  part(6_430_011, skin, ell(hc[0] - 0.004 * ku, hc[1] - 0.004 * ku, 0.024 * ku, 0.038 * ku, 18, 0.25), false);
  // Thumb tip over the rim, from the far side.
  const th = at(GLASS_X0 + 0.016, 0.866);
  part(6_430_020, skin, ell(th[0], th[1], 0.016 * ku, 0.011 * ku, 14, -0.3));
  // Curled fingers across the glass front, pinky (lowest, shortest) first so the index sits on top.
  if (c > 0) {
    for (let i = 3; i >= 0; i--) {
      const y = GRIP_Y1 - 0.008 - i * 0.019;
      const x1 = GLASS_X0 + (GLASS_X1 - GLASS_X0 - 0.006 - i * 0.005) * c;
      const a = at(GLASS_X0 - 0.004, y + 0.003), b = at(x1, y - 0.002);
      part(6_430_030 + i * 3, shade, capsule(a, b, 0.021 * ku, 0.019 * ku, 8));
      part(6_430_031 + i * 3, skin, capsule([a[0], a[1] - 0.003 * ku], [b[0] - 0.003 * ku, b[1] - 0.003 * ku], 0.013 * ku, 0.011 * ku, 8), false);
    }
  }
};

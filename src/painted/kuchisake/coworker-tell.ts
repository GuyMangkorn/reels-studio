import {drawFigure, type Arm, type FigPose} from '../kit/cast';
import type {InteriorLight} from '../kit/draw';
import type {FaceState} from '../kit/head';
import type {Painter, Pt} from '../kit/painter';
import {COWORKER, roomP, roomUnit} from './rooms';
import {talkOpen} from './shot-motion';

// The izakaya coworker telling the story with her hands (S01-B02-SH01, SH02, SH03). Same rig, place, light and face as izakaya.tsx
// `paintCoworker`; only the arms change. User note 1 Nov 2026 round 3: the hands come toward the camera in depth with the elbow
// bent and pointing back, the elbow at or under the table edge, so only the forearm rises into view. Pose basis: P06
// (shrug_palms_up) for the hand placement (hands out in front, a little wider than the elbows), with CP-P02 elbows (upper arm
// behind the torso, `behind: 'upper'`, the elbow just inside the torso edge) instead of P06's spread elbows (CP-P10 would keep
// P06 spread; the user's note overrides it for this shot). The elbow sits 0.05 m under the table top (0.75 m), so the table
// hides it. The hands lift and spread a little with the speech envelope; `still` rests them just above the table (SH03).

const COW_G: [number, number, number] = [0, 0, 2.0];
const L_COW: InteriorLight = {key: [-0.25, -1], rim: [0.7, 0.8], rimScale: 0.3};
/** Heights above the floor (m): the hidden elbow, the hand at rest and at full emphasis. */
const ELBOW_Y = 0.7, ELBOW_X = 0.095, HAND_Y0 = 0.9, HAND_Y1 = 0.99, HAND_X0 = 0.19, HAND_X1 = 0.24;

/** The arm on `side` with the elbow back under the table edge and the forearm toward the camera; `e` 0..1 emphasis, `x`/`y` drift (m). */
const depthArm = (g: Pt, u: number, side: -1 | 1, hand: Pt): Arm => ({
  via: [g[0] + side * ELBOW_X * u, g[1] - ELBOW_Y * u],
  to: [g[0] + side * hand[0] * u, g[1] - hand[1] * u],
  behind: 'upper',
});

/** The coworker mid-story at plate clock `tl` (s), global (timeline) frame `gf` for the speech envelope; `still` holds the hands at rest. */
export const drawCoworkerTelling = (p: Painter, tl: number, gf: number, o: {face?: FaceState; still?: boolean} = {}): void => {
  const g = roomP(COW_G), u = roomUnit(COW_G[2]);
  const open = talkOpen(gf, 0.5);
  // Emphasis: the envelope smoothed over about 0.4 s lifts each hand; the left hand follows 5 frames behind, with its own slow drift.
  const env = (d: number[]) => Math.min(1, d.reduce((s, k) => s + talkOpen(gf + k, 0.5), 0) / 1.2);
  const e1 = o.still ? 0 : env([-6, -3, 0]), e2 = o.still ? 0 : env([-11, -8, -5]);
  const w = o.still ? 0 : 1;
  const hand = (e: number, ph: number): Pt => [HAND_X0 + (HAND_X1 - HAND_X0) * e + w * 0.012 * Math.sin(tl * 1.7 + ph), HAND_Y0 + (HAND_Y1 - HAND_Y0) * e + w * 0.015 * Math.sin(tl * 2.3 + ph)];
  const rest: Pt = [0.16, 0.8];
  const rArm = depthArm(g, u, -1, o.still ? rest : hand(e1, 0));
  const lArm = depthArm(g, u, 1, o.still ? rest : hand(e2, 2));
  const f: FaceState = o.face ?? {brow: 'flat', eyes: 'wide', look: [0, 0], mouth: 'talk', open};
  const pose: FigPose = {view: 'front', face: f, light: L_COW, warm: 1, rArm, lArm};
  drawFigure(p, COWORKER, g, u, pose, tl);
};

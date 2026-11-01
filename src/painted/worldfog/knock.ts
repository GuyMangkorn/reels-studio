// WFOG-EP01-SHORT `FIG-KNOCK` (Boss, SS-R6 Boss list D-4/D-5; sheet sc04 S04-SH04 "The knock"). The unknown figure outside the
// shop glass: a generic 1.70 m cast body drawn as one opaque silhouette in the S02 silhouette value (`SIL`; DF-20261031-
// painted-opaque-cast), bare human head with short hair, plain jacket and trousers, no props, no face, no rim light. It walks up
// out of the fog, stops inside the door frame, knocks three times with the left knuckles (f39, f57, f75) and then lays the palm
// flat on the glass (f83–f104). Distance veil: fully fog-coloured at z ≥ 1.20 m, 10 % at z ≤ 0.70 m, linear between; the raised knocking
// hand is veil-free throughout the gesture. Scenes select the asset and its shot clock (`f`); the path, arms and veil are
// pure functions of `f` (no state carried between frames).
import {drawFigure as kitDrawFigure, type Arm, type CastDef, type FigPose} from '../kit/cast';
import {ell, solid} from '../kit/draw';
import type {FaceState} from '../kit/head';
import {mixColor, type Painter} from '../kit/painter';
import {SIL} from './assembly';
import {walkBob} from './cast';
import {groundAt} from './shop';
import {clamp01, ease, seg, type Proj, type V3} from './space';

export const FIG_KNOCK = 'FIG-KNOCK';

/** Cast body: 1.70 m (ST-07 baseline, head 0.425 m); shoulder 0.42 (the worker's width, so the arm hang matches the cast rig). */
export const KNOCK_CAST: CastDef = {
  height: 1.7, seed: 650, head: {skin: SIL, hair: SIL, cut: 'short'},
  outfit: {shoulder: 0.42, shirt: SIL, sleeve: SIL, longSleeves: true, jacket: SIL, pants: SIL, shoes: SIL},
};

/**
 * Background the veil fades the body into (pre-overlay). Measured on the S04-SH03 last-light frame (G3899): the pane behind the
 * figure reads RGB (110, 115, 109) after the window overlays, which lift the fog colour by about +2 levels, so the pre-overlay value
 * is #6c716b (build-notes r11). Used only while the veil is below 1: at 1 (z ≥ 1.20 m) the body is not drawn at all.
 */
export const KNOCK_VEIL_BG = '#6c716b';
/** Body x (WORLD-SHOP m) on the path; the figure walks straight toward the glass. */
export const KNOCK_X = 0.05;
/** Knuckle contacts (shot-local f); the knocks are 18 f apart (S02-SH07 rhythm). */
export const KNOCK_CONTACTS = [39, 57, 75] as const;

const NO_FACE: FaceState = {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'};
/** Plain arm hang of the cast rig (kit/cast.ts `hang`, front view), body-relative m: hand ±0.187 x, 0.6815 y; elbow ±0.19 x, 0.9315 y (before the walk bob). */
const HANG_HAND = {x: 0.187, y: 0.6815};
const HANG_ELBOW = {x: 0.19, y: 0.9315};
/** Knock-ready (sheet D-4): hand (0.30, 1.50), elbow via (0.30, 1.22, 0.22); the glass plane is z 0. */
const READY_HAND: V3 = [0.277, 1.50, 0.06];
const READY_ELBOW: V3 = [0.30, 1.22, 0.22];

/** Walk phase (cycles) of the knock: two steps (one cycle) by f34, then held at phase 1 (neutral legs, no bob). */
export const knockWalk = (f: number) => Math.min(f, 34) / 34;

/** Body depth z (m) at shot-local f: 0.04 m/f from z 1.60 to 0.56 at f26, eased out (quadratic) to 0.40 at f34, then still. */
export const knockBodyZ = (f: number) => {
  if (f <= 26) return 1.6 - 0.04 * f;
  if (f < 34) return 0.56 - 0.16 * (2 * ((f - 26) / 8) - ((f - 26) / 8) ** 2);
  return 0.4;
};

/** Distance veil (sheet D-4): 1 (fully fog-coloured) at z ≥ 1.20 m, 0.10 at z ≤ 0.70 m, linear between. */
export const knockVeil = (z: number) => 1 - 0.9 * clamp01((1.2 - z) / 0.5);

/**
 * Knocking hand height and depth (m) at shot-local f: rises from the hang to knock-ready (f28–f35); each knuckle strike comes in
 * 4 f from z 0.06, with a visible lateral recovery, and lands on the glass (z 0) at f39, f57, f75, and retracts 6 f to z 0.06 after the first two; after the third
 * the fist opens and the palm settles flat on the glass (y 1.50 → 1.42, f75–f83), held to f104.
 */
export const knockHandAt = (f: number): {x: number; y: number; z: number} => {
  const z = 0.06 * (1 - ease(seg(f, 35, 39)) + ease(seg(f, 39, 45)) - ease(seg(f, 53, 57)) + ease(seg(f, 57, 63)) - ease(seg(f, 71, 75)));
  // P15 single-arm placement: depth alone is invisible in this front projection. A 0.023 m lateral
  // recovery gives ~12 px on screen, contacts stay at x 0.30. Third rebound is smaller before P15 palm hold.
  const recovery = 1 - ease(seg(f, 35, 39)) + ease(seg(f, 39, 45))
    - ease(seg(f, 53, 57)) + ease(seg(f, 57, 63)) - ease(seg(f, 71, 75));
  const rebound3 = 0.008 * (ease(seg(f, 75, 77)) - ease(seg(f, 77, 83)));
  return {x: 0.30 - 0.023 * recovery - rebound3, y: 1.5 - 0.08 * ease(seg(f, 75, 83)), z};
};

/** Left (knocking, screen-right) arm in world metres at f, or undefined for the plain hang (f < 28). */
const knockArmWorld = (f: number, bz: number): {hand: V3; elbow: V3} | undefined => {
  if (f < 28) return undefined;
  const bob = walkBob(knockWalk(f));
  const hangHand: V3 = [KNOCK_X + HANG_HAND.x, HANG_HAND.y - bob, bz], hangElbow: V3 = [KNOCK_X + HANG_ELBOW.x, HANG_ELBOW.y - bob, bz];
  if (f < 35) {
    const u = ease(seg(f, 28, 35));
    const mix = (a: V3, b: V3): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
    return {hand: mix(hangHand, READY_HAND), elbow: mix(hangElbow, READY_ELBOW)};
  }
  const h = knockHandAt(f);
  return {hand: [h.x, h.y, h.z], elbow: READY_ELBOW};
};

/** The knocking arm as a rig target (plate px), so the arm is drawn shoulder → via → hand exactly as given. */
export const knockArm = (proj: Proj, f: number): Arm | undefined => {
  const w = knockArmWorld(f, knockBodyZ(f));
  return w ? {to: proj.P(w.hand), via: proj.P(w.elbow)} : undefined;
};

/**
 * Paint FIG-KNOCK at shot-local f in the window plate (before the glass overlay). The body colour is `SIL` mixed toward the veil
 * background by `knockVeil(z)`; the raised knocking hand is `SIL` itself throughout the gesture (its veil is 0).
 */
export const paintKnock = (p: Painter, proj: Proj, f: number) => {
  const bz = knockBodyZ(f);
  // Fully veiled (z ≥ 1.20 m, f0–f10): nothing is drawn, so the glass reads empty with the S04-SH03 look.
  if (knockVeil(bz) >= 1) return undefined;
  const {g, unit} = groundAt(proj, KNOCK_X, bz);
  const body = mixColor(SIL, KNOCK_VEIL_BG, knockVeil(bz));
  const pose: FigPose = {
    view: 'front', face: NO_FACE, walk: knockWalk(f), lArm: knockArm(proj, f), silhouette: body,
    // Ease in from the authored walk stop; feet and the absolute glass-hand target remain anchored.
    lean: 0.006 * Math.sin((f - 34) / 55) * ease(seg(f, 34, 46)),
    rise: 0.003 * Math.sin((f - 34) / 14) * ease(seg(f, 34, 46)),
  };
  const a = kitDrawFigure(p, KNOCK_CAST, g, unit, pose, f / 30);
  // Keep the raised hand completely veil-free throughout the gesture (user SS-R6 fix A1).
  if (f >= 28) {
    const palm = ease(seg(f, 75, 83));
    solid(p, 65010, SIL, ell(a.lHand[0], a.lHand[1], (0.045 - 0.01 * palm) * unit, (0.045 + 0.02 * palm) * unit, 14), 8, 0.02, 0.03);
  }
  return a;
};

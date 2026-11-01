import type {Brush} from '../BrushCanvas';
import {applyCamera, pushCamera, type Camera} from '../kit/camera';
import {H, shoulderHeight, type Arm, type CastDef, type FigPose} from '../kit/cast';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {POSES} from '../kit/poses';
import {CAST} from '../worldfog/cast';
import {streetP, streetUnit} from './space';

// KSO-EP01-SHORT interior look stills, shared by LF04 (izakaya, S01-B02-SH01) and LF05 (dark room, S03-B01-SH03).
// Brief KSO-BRIEF-FILM-R2: VD04 (back room), VD05 (cast reuse, narrator outfit), VD10 (dark room), VD02 (palette).
// Projection: the street lens (space.ts `STREET`: camera at z 4.7 m, eye 1.5 m, f 1410 px.m; origin = the floor point under
// the street lamp, +x right, +y up, +z toward the camera). One lens for LF01-LF05, so a 1.70 m figure is 300 px/m at 4.7 m
// depth and the lead rule (>= 480 px at 1920 px height) reads the same in every look.
// Cast: WFOG `narrator` (head, body, long hair) and `shopworker` (tied hair, apron), kit rig, unchanged; only the narrator's
// outfit changes to the dark work jacket (VD05; the kit's per-video outfit swap, not a new design).

export const FPS = 30;
export const PICTURE_W = 1080;
export const PICTURE_H = 1920;

/** World point (m) to plate px, and px per metre at depth z: the one projection owner for the interiors. */
export const roomP = streetP;
export const roomUnit = streetUnit;

/** The narrator in the dark work jacket (VD05); head, body and hair as the WFOG narrator. */
export const NARRATOR_DARK: CastDef = {
  ...CAST.narrator,
  outfit: {...CAST.narrator.outfit, shirt: '#3b4049', sleeve: '#2d3138', jacket: '#2d3138', pants: '#2e3a4c', shoes: '#2b2d31'},
};
/** The coworker: WFOG `shopworker` (tied hair, blue shirt, apron). */
export const COWORKER: CastDef = CAST.shopworker;

/** Plate paper (the colour under unpainted plate; the set covers the frame). */
export const PAPER_ROOM = '#140e09';
export const PAPER_DARK = '#060a10';

/**
 * Rig levels of one figure at crouch `c`, mirroring `kit/cast.ts` drawFigure (metres above the ground point). The shoulder
 * height is the kit's own `shoulderHeight`; the hip and torso scale follow the same constants as the rig body.
 */
const levels = (def: CastDef, c: number) => {
  const chin = def.height - H, shV = chin - 0.16 * H, torso = (chin - 0.068) * 0.44, hip0 = shV - torso + 0.034;
  return {shV, hip0, hipV: hip0 - 0.47 * c * (def.height / 1.7), tScale: 1 - 0.4 * c, shoulderY: shoulderHeight(def, c)};
};

/**
 * Hanging arms for one figure at crouch `c` (CP-P01/P12: pose P01, arms down). Front view: the P01 targets are offsets from
 * each shoulder anchor (poses.ts), so they are applied from the crouched shoulder height. Profile (right, facing screen
 * right): the kit's profile hang (hand under the hip, elbow in the body line).
 */
export const hangArms = (def: CastDef, g: Pt, unit: number, c: number, view: 'front' | 'right'): Pick<FigPose, 'rArm' | 'lArm'> => {
  const L = levels(def, c);
  const at = ([u, v]: Pt): Pt => [g[0] + u * unit, g[1] - v * unit];
  if (view === 'front') {
    const sw = def.outfit.shoulder * H;
    const arm = (side: 'r' | 'l'): Arm => {
      const s = side === 'r' ? -1 : 1, S: Pt = [s * (sw - 0.0255), L.shoulderY], P = POSES.P01[side];
      return {to: at([S[0] + P.to[0], S[1] + P.to[1]]), via: at([S[0] + P.via[0], S[1] + P.via[1]])};
    };
    return {rArm: arm('r'), lArm: arm('l')};
  }
  const sy = L.shoulderY - 0.0045 * L.tScale, hv = L.hipV + (L.shV - 0.53 - L.hip0) * L.tScale;
  const arm: Arm = {to: at([0.01, hv]), via: at([0.004, (sy + hv) / 2])};
  return {rArm: arm, lArm: arm};
};

/** One plate: the frame clock and the shot camera around the paint (the look.tsx `plate`, same order). */
export const plate = (brush: Brush, frame: number, cam: (tl: number) => Camera, paint: (p: Painter, tl: number) => void, paper: string) => {
  const tl = frame / FPS;
  const p = makePainter(brush, {t: tl, frame, fade: paper});
  brush.push();
  applyCamera(brush, cam(tl));
  paint(p, tl);
  brush.pop();
};

/** Shot camera helper: a slow push (brief: every shot drifts or pushes), identity at tl 0. */
export const push = (tl: number, len: number, s1: number, fx: number, fy: number): Camera => pushCamera(tl, len, {s0: 1, s1, fx, fy});

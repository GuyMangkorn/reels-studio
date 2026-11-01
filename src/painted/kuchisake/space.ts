import {pushCamera, type Camera} from '../kit/camera';
import {H} from '../kit/cast';
import {CHIN, HEAD_SPAN} from '../kit/head';
import type {Pt} from '../kit/painter';
import type {V3} from '../kit/space';

// KSO-EP01-SHORT spaces and camera ranges (brief KSO-BRIEF-FILM-R1, VD03/VD06; Boss fixes them here from the timed list).
// Picture is 1080x1920 px. Metres: the woman stands at the streetlight foot (x 0, z 0) on the road centreline; +x right,
// +y up, +z toward the camera. The lens of the street vantage sits at (0, STREET.eye, STREET.z) and looks toward -z.

export const KSO_HEIGHT = 1.95;
/** The woman's height (m) and the decal head centre above her feet (the kit's head decal, `drawFigure` `hc`). */
const HEAD_M = H / HEAD_SPAN;
export const HEAD_CENTRE_M = KSO_HEIGHT - H + CHIN * HEAD_M;

/** Street vantage (brief VD03): eye level 1.5 m, focal 1410 px.m, so a figure at depth 4.7 m is 300 px/m. */
export const STREET = {z: 4.7, eye: 1.5, f: 1410, hy: 430} as const;

/** Picture point of a world point of the street set (metres). */
export const streetP = ([x, y, z]: V3): Pt => {
  const d = STREET.z - z;
  return [540 + (STREET.f * x) / d, STREET.hy + (STREET.f * (STREET.eye - y)) / d];
};

/** px per metre at depth z (the plate's one projection owner). */
export const streetUnit = (z: number) => STREET.f / (STREET.z - z);

/** Reveal close-up (VD06 `CU`): the lens at about 1.15 m, so the head decal is 230 px per head unit (head about 520 px). */
export const CU_UNIT = 1229;
/**
 * The head decal centre in the close-up: upper frame, so the eyes, smile line and chin sit above y 860 (brief acceptance 3).
 * The neck and coat fall into the caption band and are darkened by the LF03 falloff.
 */
export const CU_HEAD_Y = 579;
export const CU_GROUND: Pt = [540, CU_HEAD_Y + HEAD_CENTRE_M * CU_UNIT];

/** LF01 CAM-CLOSE (S01-B01-SH01, brief VD08): slow push 1.00 -> 1.04, focus at the mask edge. Identity at frame 0. */
export const camClose = (tl: number): Camera => pushCamera(tl, 3.5, {s0: 1, s1: 1.04, fx: 540, fy: 540});

/** LF02 street (S02-B02-SH01, VD03): slow push 1.00 -> 1.06 about the woman's feet. */
export const camStreet = (tl: number): Camera => pushCamera(tl, 2.5, {s0: 1, s1: 1.06, fx: 540, fy: 880});

/** LF03 reveal (S02-B03-SH03, VD06): a slight push, identity at the stinger frame (tl 0). */
export const camReveal = (tl: number): Camera => pushCamera(tl, 1, {s0: 1, s1: 1.03, fx: 540, fy: 700});

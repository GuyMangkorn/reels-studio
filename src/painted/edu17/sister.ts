import {capsule, ell, hardFill, inkLine, openHandParts} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import {paintHeadFront, type FaceState} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {C} from './palette';

// EDU-EP17 SISTER on the phone screen (Boss W7, fix list R1.1 item 1; casting `woman-long, P07, happy`, screen only). A front-view head-and-shoulders
// portrait of the kit person `woman-long` (head = kit `paintHeadFront`, so eyes and mouth are the kit face) in the cream knit of the look frames,
// painted in the screen's own plane: local px with y down, origin at the screen centre, one screen height = h; the caller maps it onto the
// projected screen (translate, rotate, horizontal foreshortening). Every motion is a function of the frame number `f`:
//  - P07 wave (only where `wave` is set, B01-SH01): f 0-36, forearm swings +-20 deg about the elbow, period 12 f, open mitten hand (UT14);
//  - then the talk loop: mouth open/close in alternating 6 f and 8 f cycles, a small head bob (period 14 f).

export const SISTER_WAVE_END = 36;
/** Screen width / height of the phone screen (yard.ts `phone`: hw 0.0375, hh 0.08). */
export const SCREEN_ASPECT = 0.0375 / 0.08;
/** Head size K as a share of the screen height: the kit head outline spans 2.27 K, so the head is 0.36 of the screen (>= 0.35, fix list). */
export const SISTER_K = 0.158;

/** Talk-loop mouth opening 0..1 at frame f: one open/close per cycle, cycles of 6 and 8 f alternating (14 f pair). */
export const talkOpen = (f: number): number => {
  const m = ((f % 14) + 14) % 14, [s, n] = m < 6 ? [m, 6] : [m - 6, 8];
  return Math.sin((Math.PI * s) / n);
};
/** The sister's motion state at frame f. */
export const sisterState = (f: number, wave = false) => {
  const waving = wave && f < SISTER_WAVE_END;
  return {
    waving,
    /** forearm angle off vertical, degrees (+ = toward screen right) */
    arm: waving ? 20 * Math.sin((2 * Math.PI * f) / 12) : 0,
    /** 0..1; >= 0.35 paints the open smile (talk beat), below it the closed smile */
    open: waving ? 1 : talkOpen(f),
    /** head bob -1..1 (screen y) */
    bob: Math.sin((2 * Math.PI * f) / 14),
  };
};

const WL = PEOPLE['woman-long'];
/** Paints the portrait in screen-local px (h = screen height). Shapes stay inside x +-0.234 h, y +-0.5 h. */
export const paintSister = (p: Painter, h: number, f: number, wave = false) => {
  const s = sisterState(f, wave), hw = (SCREEN_ASPECT * h) / 2;
  const K = SISTER_K * h, cx = -0.02 * h + 0.004 * h * Math.sin((2 * Math.PI * f) / 28), cy = -0.075 * h + 0.012 * h * s.bob;
  const knit = C.knit, knitShade = mixColor(C.knit, '#8a7a66', 0.25), skin = WL.head.skin;
  // shoulders (cream knit) and neck
  const sh: Pt[] = [[-hw, 0.5 * h], [-hw, 0.36 * h], [-0.16 * h, 0.27 * h], [-0.06 * h, 0.25 * h], [0.04 * h, 0.25 * h], [0.14 * h, 0.27 * h], [hw, 0.36 * h], [hw, 0.5 * h]];
  hardFill(p, 2440, skin, [[cx - 0.045 * h, cy + 0.12 * h], [cx + 0.045 * h, cy + 0.12 * h], [cx + 0.05 * h, 0.29 * h], [cx - 0.05 * h, 0.29 * h]]);
  hardFill(p, 2441, knit, sh);
  hardFill(p, 2442, knitShade, [[cx - 0.06 * h, 0.255 * h], [cx + 0.06 * h, 0.255 * h], [cx + 0.045 * h, 0.3 * h], [cx - 0.045 * h, 0.3 * h]]);
  inkLine(p, 2443, sh.slice(1, -1), {closed: false, weight: 0.8, still: true});
  // the kit head (front view, woman-long), happy; mouth from the motion state
  // happy throughout: the open D smile while waving and on each talk beat, the closed soft smile between beats
  const face: FaceState = s.open >= 0.35 ? {...EXPRESSIONS.happy, mouth: 'smile'} : {...EXPRESSIONS.happy, mouth: 'smile', open: 0.1};
  paintHeadFront(p, 820 + 1, cx, cy, K, face, WL.head, f / 30);
  // P07 wave (sleeve, then the hand): elbow low at screen right, forearm up, open mitten (thumb toward the face)
  if (s.waving) {
    const E: Pt = [0.13 * h, 0.44 * h], a = (s.arm * Math.PI) / 180, len = 0.19 * h;
    const W: Pt = [E[0] + Math.sin(a) * len, E[1] - Math.cos(a) * len];
    hardFill(p, 2450, knit, capsule(E, W, 0.075 * h, 0.06 * h));
    inkLine(p, 2451, capsule(E, W, 0.075 * h, 0.06 * h), {weight: 0.8, still: true});
    const ang = Math.atan2(W[1] - E[1], W[0] - E[0]), H = openHandParts(W, ang, 0.85 * h, -1);
    hardFill(p, 2452, skin, H.palm);
    inkLine(p, 2453, H.palm, {weight: 0.8, still: true});
    H.creases.forEach((cr, i) => inkLine(p, 2454 + i, cr, {closed: false, weight: 0.6, still: true}));
  }
};

/** Old static screen blobs for a tiny screen (< 36 px tall), in screen-local px. */
export const paintSisterTiny = (p: Painter, h: number) => {
  hardFill(p, 2415, C.hairBlack, ell(-0.02 * h, -0.06 * h, 0.16 * h, 0.2 * h, 10));
  hardFill(p, 2416, C.skinSis, ell(-0.02 * h, -0.08 * h, 0.11 * h, 0.13 * h, 10));
  hardFill(p, 2414, C.knit, [[-0.234 * h, 0.5 * h], [0.234 * h, 0.5 * h], [0.2 * h, 0.2 * h], [-0.2 * h, 0.2 * h]]);
};

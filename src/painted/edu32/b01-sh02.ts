import type {AnimalAnchors} from '../kit/animals';
import type {Painter, Pt} from '../kit/painter';
import {mixYCam, type YCam} from '../kit/ycam';
import {blinkAt, heroAnchors, paintB01Band, paintB01Desk, paintHeroCat, type HeroAct} from './b01-set';

// EDU-EP32-SHORT B01-SH02 "the blueprint callouts" (timed sheet EDU-EP32-SHEET-R1, G [81, 229), 148 f; VD32-06, VD32-28; Boss G1, 2026-11-21).
// One plate EDU32-B01-SH02: the hero cat held in profile on page BP (blink only, L60 and L120), linear truck with an ease-out on the last 20 f.
// Three screen-space callouts (b01-callouts.tsx) anchored on the cat each frame (CO1 ear circle L32-L44, CO2 transmitter box + dashed arrow
// L65-L77, CO3 the back-fur thread lights shoulders -> hips L104-L124, its label at L110). No line touches the tail; no organ, outline or wound.

export const B01_SH02_N = 148;
const DEG = Math.PI / 180;
export const B01_SH02_CAM0: YCam = {x: 0.3, y: 0.55, z: 1.5, yaw: 0, pitch: 0, f: 900, hy: 800};
export const B01_SH02_CAM1: YCam = {x: 0.65, y: 0.55, z: 1.35, yaw: -8 * DEG, pitch: 0, f: 900, hy: 800};
/** Truck progress: constant speed to L127, then a 20 f ease-out to rest at L147. */
export const b01Sh02Progress = (L: number) => {
  const v = 1 / 137, l = Math.max(0, Math.min(147, L));
  if (l <= 127) return l * v;
  const d = l - 127;
  return 127 * v + v * (d - (d * d) / 40);
};
export const b01Sh02Cam = (L: number): YCam => mixYCam(B01_SH02_CAM0, B01_SH02_CAM1, b01Sh02Progress(L));
export const B01_SH02_BLINKS = [60, 120] as const;
/** Callout timing (shot-local frames): draw-on ranges and the CO3 label frame. */
export const CO = {co1: [32, 44], co2: [65, 77], co3: [104, 124], co3Label: 110} as const;
export const b01Sh02Act = (L: number): HeroAct => ({state: 'sit', lid: Math.max(...B01_SH02_BLINKS.map((b) => blinkAt(L, b)))});

/** The B01-SH02 plate at shot frame L (callouts are the screen overlay). */
export const paintB01SH02 = (p: Painter, L: number, id = 'B01-SH02') => {
  const c = b01Sh02Cam(L);
  paintB01Desk(p, c);
  paintB01Band(p, c);
  paintHeroCat(p, c, id, 2.7 + L / 30, b01Sh02Act(L));
};

/** Callout anchors in picture px at shot frame L: ear-mic centre, torso centre, the antenna-thread path (as painted by cast.ts
 *  `paintCatDressingProfile`, kept in step with it), the tail tip and the cat's ear-tip row. */
export type B01Anchors = {ear: Pt; torso: Pt; thread: Pt[]; tail?: Pt; hs: number; dir: number; earTop: number; outline: Pt[]};
export const b01Sh02Anchors = (L: number): B01Anchors | null => {
  const {an, outline} = heroAnchors(b01Sh02Cam(L), 2.7 + L / 30, b01Sh02Act(L)) as {an: AnimalAnchors; outline: Pt[]};
  if (!an.top || !an.mouth || !an.eye || !an.withers) return null;
  const hs = Math.abs(an.mouth[1] - an.top[1]) / 0.28, dir = Math.sign(an.eye[0] - an.top[0]) || 1, [tx, ty] = an.top, X = (k: number) => tx + dir * k * hs;
  const ear: Pt = [X(-0.0725), ty - 0.0215 * hs];
  const [wx, wy] = an.withers, cr = an.croup ?? an.withers, inset = 0.05 * hs, nape: Pt = [X(-0.2), ty + 0.2 * hs];
  const thread: Pt[] = [[X(-0.1), ty + 0.03 * hs], [X(-0.17), ty + 0.1 * hs], nape, [(nape[0] + wx) / 2, (nape[1] + wy) / 2 + inset], [wx, wy + inset], [wx + (cr[0] - wx) * 0.45, wy + (cr[1] - wy) * 0.45 + inset * 1.1]];
  const torso: Pt = [(wx + cr[0]) / 2 + dir * 0.05 * hs, (wy + cr[1]) / 2 + 0.42 * hs];
  return {ear, torso, thread, tail: an.tailTip, hs, dir, earTop: ty - 0.15 * hs, outline};
};

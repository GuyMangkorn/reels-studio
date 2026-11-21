import {clipPainter} from '../kit/clip-circle';
import {ell, washAt} from '../kit/draw';
import {mixColor, tintPainter, type Painter} from '../kit/painter';
import {drawAnimal, type AnimalAnchors, type AnimalPose} from '../kit/animals';
import type {V3} from '../kit/space';
import {wWash} from '../kit/world';
import {camPoint, camUnit, mixYCam, type YCam} from '../kit/ycam';
import {LAMP} from './desk';
import {CAT_SCALE, catDef, paintCatDressingProfile} from './cast';
import {easeInOut} from './field-cat';
import {lead} from './looks';
import {CAM_B06_KEY, CAT_DESK, CAT_SLEEP, paintOfficeSet} from './office';

// EDU-EP32-SHORT B06-SH02 "the real cat on the real desk" (CL01 payoff; timed sheet EDU-EP32-SHEET-R1, G [1583, 1651), 68 f; VD32-15, VD32-24,
// VD32-27; Boss G7, 2026-11-21). One plate EDU32-B06-SH02 on the LF04 set (office.ts `paintOfficeSet`): the real CAT x16 asleep in profile on the
// memo's left edge, facing screen-left (`CAT_SLEEP`, lids shut), breathing swell on a 60 f period (the kit breath clock scaled 2.6 s -> 2.0 s),
// ear flick L27-L35 on "เรียก" (W1610 = L27; kit `ears` pulsed to 0.5, the `new: ear-flick` stand-in shared with B01-SH03's L68-L76 flick),
// nothing else. Camera: eye (-2.0, 2.0, +6.3) yaw 0 -> `CAM_B06_KEY` L0 -> L67 eased; the last 10 f (L58-L67, G1641-G1650) are the closing
// hold's cat share (Q9: cat 10 / stamp 38). LF04 weaknesses fixed in this plate: the lamp pool is one smooth warmer falloff (no rings, no green
// cast on the felt) and the cat takes the lamp as a warm top light with a cool belly shade (it read flat in LF04). Shot-local L = round(tl * 30).

export const B06SH02_N = 68;
/** The lamp's light source for the cat passes: the diffuser inside the shade (desk.ts LAMP, 0.3 m along its axis toward the desk). */
const LAMP_BULB: V3 = [LAMP[0] * 0.93, LAMP[1] * 0.93, LAMP[2] * 0.93];
const DEG = Math.PI / 180;
export const B06SH02 = {flick: [27, 35], hold: 58, breathPeriod: 60} as const;
export const CAM_B06_START: YCam = {...CAM_B06_KEY, z: 6.3, yaw: 0 * DEG};
export const b06sh02Cam = (L: number): YCam => mixYCam(CAM_B06_START, CAM_B06_KEY, easeInOut(L / (B06SH02_N - 1)));
/** Kit plate clock: the kit breath runs on a 2.6 s period; the sheet asks for 60 f (2.0 s), so the clock runs 1.3x. */
export const b06Clock = (L: number, t0 = 2.0) => t0 + (L / 30) * (2.6 / (B06SH02.breathPeriod / 30));
/** The sleeping cat's pose at L: `CAT_SLEEP` plus the ear flick. */
export const b06sh02Pose = (L: number): Partial<AnimalPose> => {
  const [f0, f1] = B06SH02.flick, ears = L > f0 && L < f1 ? 0.5 * Math.sin((Math.PI * (L - f0)) / (f1 - f0)) : 0;
  return {...CAT_SLEEP, ears};
};

/** G7 lamp pool (replaces desk.ts `paintLampPool` on this set): 18 thin washes from a warm amber rim to a pale centre, so the falloff is smooth
 *  (LF04 showed five rings) and the warm amber, not lamp yellow, sits on the green felt (LF04 read greenish). */
export const paintWarmPool = (p: Painter, c: YCam, y = 0.035) => {
  const n = 18;
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1), r = 2.9 - 2.5 * u, col = mixColor('#ffa850', '#ffe2a8', u * u), op = 13 + 6 * u;
    wWash(p, c, 37800 + k, col, op, Array.from({length: 40}, (_, i): V3 => [r * Math.cos((i / 40) * 6.283), y, r * 0.92 * Math.sin((i / 40) * 6.283)]), 0.3, 0.04);
  }
};

/** Lamp light on the sleeping cat (LF04 read flat): the lamp hangs above and behind it, so the cat is painted in passes from one kit drawing
 *  (same seed and clock, so the passes register exactly): a cool shaded base, then the same cat clipped to nested circles about the lamp's
 *  picture point with a warmer, lighter tint each step, so its crown and back take the light and the belly and haunch fall into shade, with a
 *  curved terminator instead of a flat grey. `lit` false (the B06-SH03 close flank, lamp out of picture): one warm-shaded pass. */
const LIGHT_STEPS = [[0.96, '#ffd9a0', 0.14], [0.86, '#ffe2b0', 0.24], [0.76, '#fff0d0', 0.32]] as const;
export const paintSleepingCat = (p: Painter, c: YCam, t: number, pose: Partial<AnimalPose>, lit = true) => {
  const g = camPoint(c, CAT_DESK);
  if (!g) return null;
  const def = catDef(CAT_SCALE.deskReal), u0 = camUnit(c, CAT_DESK), len = def.height * u0, pz: AnimalPose = {view: 'front', state: 'sit', ...pose};
  // contact shadow: the screen ellipse of cast.ts paintRealCat at the eye-level key; the top-down insert paints its own from the outline
  if (lit) washAt(p, 32600, '#1a100a', 120, ell(g[0], g[1], 1.05 * len, 0.09 * len, 18), 0.15, 0.2);
  const an: AnimalAnchors = {};
  const base = tintPainter(p, '#2a3048', lit ? 0.2 : 0.1, {brush: true});
  drawAnimal(base, def.seed, def, g, u0, pz, t, an);
  paintCatDressingProfile(base, an, 32500);
  const lamp = camPoint(c, LAMP_BULB);
  if (lit && lamp) {
    // radius: from the lamp's picture point to the cat's ground line, so the outer step reaches about the belly line
    const d = Math.hypot(g[0] - lamp[0], g[1] - lamp[1]);
    for (const [k, col, u] of LIGHT_STEPS) {
      const q = clipPainter(p, lamp[0], lamp[1], k * d);
      drawAnimal(tintPainter(q, col, u, {brush: true}), def.seed, def, g, u0, pz, t, {});
      paintCatDressingProfile(q, an, 32500);
    }
  }
  if (!an.top || !an.mouth) return {g, top: g[1] - len, bottom: g[1], h: len, an};
  const hsS = Math.abs(an.mouth[1] - an.top[1]) / 0.28, earTip = an.top[1] - 0.15 * hsS;
  return {g, top: earTip, bottom: g[1], h: g[1] - earTip, an};
};

/** The B06-SH02 plate at shot frame L. */
export const paintB06SH02 = (p: Painter, L: number, id = 'B06-SH02') => {
  const c = b06sh02Cam(L);
  paintOfficeSet(p, c, paintWarmPool);
  const r = paintSleepingCat(p, c, b06Clock(L), b06sh02Pose(L));
  if (r) lead(id, 'CAT real x16 (curled asleep)', r);
  return r;
};

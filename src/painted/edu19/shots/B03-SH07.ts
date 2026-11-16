import type {V3} from '../../kit/space';
import {O2_LEVELS, ORDER_O2, slotX} from '../mats';
import {ease, frac} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';

// B03-SH07 · G 1397-1457 (60 f) · head tilt (L08c; EDU-EP19-SHEETS-R3, camera R1). DOG sitting on slot 6, front: the puzzled head tilt (kit
// `head-tilt` fields: `roll` 14 deg crown to screen right over 0.3 s, `earLift`) landing at l 10 (G 1407, the whine), held; a tiny tilt back
// to 10 deg at l 46-50 (R3). Jumbled glow on the two mats either side (slot 5 S5, slot 7 S4), the fixed opacity. Long line: none (unclipped).
const N = 60;
const M = sheetMove([0, 0.55, -0.2], [8, 2], [1.25, 1.1], 0.6, {f: 1000, hy: 700});

export const B03_SH07: FieldShotDef = {
  id: 'B03-SH07', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const k = ease(frac(L, 1, 10)), back = ease(frac(L, 46, 50));
    return {sun: 'B03', t: L / 30, stack: false, mats: {order: ORDER_O2, prints: 0.6},
      dog: {at: [slotX(6), 0, 0], pose: {view: 'front', state: 'sit', roll: 14 * k - 4 * back, earLift: 0.8 * k, wag: 0}}};
  },
  glow: () => [5, 7].map((i) => ({at: [slotX(i), 0.03, 0] as V3, level: O2_LEVELS[i], r: 0.4, seed: i})),
};
export const shot = makeShot(B03_SH07);

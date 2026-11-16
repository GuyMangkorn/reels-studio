import {animalMotion} from '../../kit/animal-motions';
import {DOG} from '../cast';
import {O2_LEVELS, ORDER_O2, slotX} from '../mats';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {glowRamp} from '../trail';

// B03-SH05 · G 1235-1307 (72 f) · the dog cannot tell (W-MATS 3; EDU-EP19-SHEETS-R3, 72 f unchanged; camera R2). Same nose vantage, wider (VD05 R2: eye 0.85, pitch -6, f 1050);
// the dog front on the middle mat (slot 6), sniffs slots 6, 5, 7 (l 16, 24, 32): jumbled halo sizes large-small-large (slot 5 S5, 6 S2, 7 S4) in
// the 1.0 m reading radius; `look-left-right` from l 34 (left l 38, right l 46, left l 54); `sit-down` l 58-72. LF05 = l 38. Long line (VD17):
// MUM off frame toward the gate, far anchor (-0.8, 0.95, -2.8), drawn under the dog so it leaves the ring behind the withers.
const N = 72;
const M = sheetMove([0, 0.3, -0.2], [0, 4], [2.4, 2.2], 0.85, {f: 1050, hy: 790, pitch: [-6, -6]});
const SNIFF: Record<number, number> = {6: 16, 5: 24, 7: 32};

export const B03_SH05: FieldShotDef = {
  id: 'B03-SH05', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const t = L / 30, look = animalMotion('look-left-right', Math.max(0, t - 30 / 30), {animal: DOG, view: 'front'});
    const sit = L >= 58 ? animalMotion('sit-down', (L - 58) / 30, {animal: DOG, view: 'front'}).pose : {};
    const z = L < 14 ? -1.4 + 1.25 * (L / 14) : -0.15;
    return {sun: 'B03', t, mats: {order: ORDER_O2, prints: 0.6},
      dog: {at: [0, 0, z], pose: {view: 'front', state: 'stand', ...(L >= 34 ? {look: look.pose.look} : {}), ...(L >= 14 && L < 34 ? {sniff: 0.5} : {}), ...sit}},
      line: [-0.8, 0.95, -2.8], lineUnder: true};
  },
  glow: (L) => [5, 6, 7].map((i) => ({at: [slotX(i), 0.03, 0], level: O2_LEVELS[i], k: glowRamp(L / 30, SNIFF[i] / 30, 1), r: 0.4, seed: i})),
};
export const shot = makeShot(B03_SH05);

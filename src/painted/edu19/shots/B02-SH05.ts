import {animalMotion} from '../../kit/animal-motions';
import {animalWalkSpeed} from '../../kit/animals';
import {camOf} from '../../kit/cam-moves';
import {DOG} from '../cast';
import {dogClock, ease, frac, lerp, NOSE_AHEAD} from '../motion19';
import {makeShot} from '../shot';
import {sheetMove, type FieldShotDef} from '../stage';
import {glowRamp, trailPrints, printZ} from '../trail';

// B02-SH05 · G 797-940 (143 f) · the slow sniff (W-SNIFF + L05a; EDU-EP19-SHEETS-R3, camera R2). The SH02 nose vantage (VD05 R2: eye 0.85, pitch -6, f 1300) with a
// slow push r 2.1 -> 1.9, the target on the dog's body (ground point + 0.25 m), linear l 18-100, held after. The dog walks in front view (l 0-18),
// cut-on-turn to RIGHT PROFILE at l 20 (FQ2, user 2026-11-15: like-for-like with SH02), `sniff-track` at half the SH02 pace: nose over -0.6 l 24,
// 0 l 62, +0.6 l 100, the body holds after. Round-2 glow: reading radius 0.7 m at the nose only, size steps S1-S3 rising (an older trail = smaller
// halos), 6 f in, 12 f out. Sun B02 (flatter, 22 deg). Near shade under the action floor (FQ1). W3.3 builds the profile part for the vantage
// check (still EDU19-VANTAGE-B02, l 106). W5.3: the walk-in (front, (-1.2, 0, -1.6) -> (-1.22, 0, -0.12) l 0-18, slowing, on the gait
// distance clock) and the hesitation l 100-130 (body holds, head bobs over +0.6 and tips nose-down 10 deg; the 0.3 m head swing back is not
// drawable in profile without a neck squash: the kit keeps the nose ~0.6 m ahead at any sniff, so it is replaced like B01-SH02).
const N = 143;
const M = sheetMove([[-0.97, 0.3, -0.1], [0.23, 0.3, -0.1]], [-4, 0], [2.1, 1.9], 0.85, {f: 1300, hy: 660, pitch: [-6, -6]});
/** Nose x over the shot: -0.6 at l 24, 0 at l 62, +0.6 at l 100 (linear), held after; before l 24 it is the walk-in (W5). */
const noseX = (L: number) => -0.6 + 1.2 * Math.min(1, Math.max(0, (L - 24) / 76));
/** Round-2 prints read at the nose: x and level (S1, S2, S3), and the frame the nose first reaches each. */
const R2 = [{x: -0.6, level: 0.08, on: 24}, {x: 0, level: 0.12, on: 62}, {x: 0.6, level: 0.17, on: 100}];
const RADIUS = 0.7;

export const B02_SH05: FieldShotDef = {
  id: 'B02-SH05', N,
  cam: (L) => camOf(M, Math.min(1, Math.max(0, (L - 18) / 82))),
  state: (L) => {
    const t = L / 30;
    if (L < 20) {
      // Walk-in, front view, slowing to a stop at l 18 (ease-out on z), paws planted on the distance clock.
      const u = 1 - (1 - frac(L, 0, 18)) ** 2, z = lerp(-1.6, -0.12, u), x = lerp(-1.2, -1.22, u);
      return {sun: 'B02', t, prints: trailPrints(), stack: false,
        dog: {at: [x, 0, z], pose: {view: 'front', state: 'stand', walk: dogClock(1.48 * u), stride: 1 - frac(L, 12, 18), headLow: L >= 14, sniff: 0.4 * frac(L, 14, 20)}},
        line: [1.8, 1.0, 0.6], nearShade: 1160};
    }
    const s = noseX(L) + 0.6, m = animalMotion('sniff-track', s / (0.5 * animalWalkSpeed(DOG)), {animal: DOG, view: 'right', distance: 1.2});
    const h = ease(frac(L, 100, 108)) * (1 - ease(frac(L, 126, 134))), bob = L >= 100 ? 0.06 * (1 - Math.cos((2 * Math.PI * (L - 100)) / 10)) : 0;
    return {sun: 'B02', t, prints: trailPrints(), stack: false,
      dog: {at: [noseX(L) - NOSE_AHEAD, 0, 0], pose: {...m.pose, wag: 0, ...(L < 24 ? {walk: undefined, stride: 0} : {}), ...(L >= 100 ? {walk: undefined, stride: 0, sniff: 1 - bob, tilt: 10 * h} : {})}},
      line: [1.8, 1.0, 0.6], nearShade: 1160};
  },
  glow: (L) => R2.map(({x, level, on}, k) => {
    // In over 6 f when the nose first reaches the print; out over 12 f once the nose is more than 0.7 m past it.
    const outAt = 24 + ((x + RADIUS + 0.6) / 1.2) * 76, kIn = glowRamp(L / 30, on / 30, 1), kOut = L < outAt ? 1 : Math.max(0, 1 - (L - outAt) / 12);
    return {at: [x, 0, printZ(x)], level, k: kIn * kOut, seed: k + 5};
  }),
};
export const shot = makeShot(B02_SH05);

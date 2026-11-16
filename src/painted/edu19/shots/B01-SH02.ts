import {animalMotion} from '../../kit/animal-motions';
import {animalWalkSpeed} from '../../kit/animals';
import {camOf} from '../../kit/cam-moves';
import {DOG} from '../cast';
import {ease, frac, NOSE_AHEAD} from '../motion19';
import {makeShot} from '../shot';
import {sheetMove, type FieldShotDef} from '../stage';
import {glowRamp, ROUND1_FIVE, trailPrints, printZ} from '../trail';

// B01-SH02 · G 48-162 (114 f) · nose on five prints (L01; EDU-EP19-SHEETS-R3, camera R2). Nose vantage (VD05 R2: eye 0.85, pitch -6, f 1300, r 1.9),
// the camera target on the dog's body (ground point + 0.25 m), linear l 0-96 with the nose, held l 96-114. LF02 = l 102: five prints lit in order,
// halos one size step larger each (VD04 R2, S1 swing side -> S5 tree side), the nose on the largest. The dog works the line in RIGHT PROFILE with
// `sniff-track` (Boss W3.1 feasibility change, user-accepted), the nose crossing x -1.2 .. +1.2 at l 0, 24, 48, 72, 96. W5 hesitation l 100-114: the
// body holds, the head bobs over +1.2 (sniff 1 <-> 0.88) and tips nose-down-back 10 deg. The sheet's 0.3 m head swing back toward +0.9 is not drawn:
// the kit profile neck has no yaw and a `leanTo` pull shortens it (the user's LF03 neck note), so the nose moves ~2 cm, not 0.3 m (Film note).
// Below the nose-down action floor the near lawn is near shade (FQ1, user 2026-11-15).
const N = 114;
const M = sheetMove([[-1.57, 0.3, -0.1], [0.83, 0.3, -0.1]], [-4, 2], 1.9, 0.85, {f: 1300, hy: 660, pitch: [-6, -6]});
const noseX = (L: number) => -1.2 + 2.4 * Math.min(1, Math.max(0, L / 96));
const ON = [0, 24, 48, 72, 96];

export const B01_SH02: FieldShotDef = {
  id: 'B01-SH02', N,
  cam: (L) => camOf(M, Math.min(1, Math.max(0, L / 96))),
  state: (L) => {
    // The gait clock follows the distance the body really travels (sheet: 2.4 m in 96 f), so the planted paws hold still.
    const t = L / 30, s = noseX(L) + 1.2, m = animalMotion('sniff-track', s / (0.5 * animalWalkSpeed(DOG)), {animal: DOG, view: 'right', distance: 2.4});
    const h = ease(frac(L, 100, 106)), bob = L >= 100 ? 0.06 * (1 - Math.cos((2 * Math.PI * (L - 100)) / 7)) : 0;
    return {sun: 'B01', t, prints: trailPrints(), stack: false,
      // W3.3 tune: ground z 0 (sheet -0.12) so the profile nose runs on the trail line (z 0, between the +-0.07 prints).
      dog: {at: [noseX(L) - NOSE_AHEAD, 0, 0], pose: {...m.pose, ...(L >= 96 ? {walk: undefined, stride: 0, sniff: 1 - bob, tilt: 10 * h} : {})}},
      line: [1.8, 1.0, 0.6], nearShade: 1160};
  },
  glow: (L) => ROUND1_FIVE.map(({x, level}, k) => ({at: [x, 0, printZ(x)], level, k: glowRamp(L / 30, ON[k] / 30, 1), seed: k})),
};
export const shot = makeShot(B01_SH02);

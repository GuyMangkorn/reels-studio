import {poseFor} from '../../kit/poses';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {GIRL} from '../cast';
import {ease, frac, lerp, oneFingerArms, paintIdeaFinger} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';

// B02-SH01 · G 508-591 (83 f) · she has a plan (L04; EDU-EP19-SHEETS-R3, camera R2 hy 700). Slow push on GIRL sitting on the grass at (5.9, 0, 0.5),
// front, P33 (knees up, arms round the shins) l 0-30; on "กลิ่นยิ่งเก่า ยิ่งจาง" her face turns sly (smug from l 24, the brows up off the
// laugh); on "เธอเลยมีแผน" (G 566, l 58) her left hand rises off the shins l 50-60 into `new: one-finger-idea` (motion19.ts; the user found
// P27 reads as two fists, W2.4), the finger up from l 56. The dog lies at her left (5.3, 0, 0.6), front, head down on its paws, at frame left.
const N = 83;
const M = sheetMove([5.9, 0.6, 0.5], [-20, -12], [1.3, 1.15], 0.75, {f: 1000, hy: 700});
const AT: V3 = [5.9, 0, 0.5];

export const B02_SH01: FieldShotDef = {
  id: 'B02-SH01', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const c = sheetCam(M, L, N), g = camPoint(c, AT) as Pt | null, u = camUnit(c, AT), k = frac(L, 50, 60), e = ease(k);
    let fig = {};
    if (g && k > 0) {
      const hug = poseFor('P33', GIRL, g, u, 'front').lArm!, up = oneFingerArms(c, AT, {view: 'front', floorSit: 1}, 1).lArm!;
      fig = {lArm: {to: [lerp(hug.to[0], up.to[0], e), lerp(hug.to[1], up.to[1], e)] as Pt, via: e > 0.35 ? up.via : hug.via, out: 1}};
    }
    return {sun: 'B01', t: L / 30, stack: false,
      girl: {at: AT, view: 'front', pose: 'P33', face: L < 24 ? 'happy' : 'smug', fig, held: (q, a, uu) => paintIdeaFinger(q, a.lHand, uu, frac(L, 52, 60))},
      dog: {at: [5.3, 0, 0.6], pose: {view: 'front', state: 'lie', lid: L > 40 ? 0.2 : 0, wag: 0}}};
  },
};
export const shot = makeShot(B02_SH01);

import {LANDMARKS} from '../../kit/hand-place';
import type {V3} from '../../kit/space';
import {paintFullonica} from '../fullonica';
import {act, layer, YUCK} from '../r4-looks';
import {MARCUS} from '../r4-cast';
import {bodyFacing, facePoint, HANG, paintedArms, pick3D, rigHands, type MidHandSpec} from '../r4-hands';
import {makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {shoulderRibbons} from '../acts26';
import {drift, ease, lerp3, rec, yc} from '../stage26';

// B02-SH04 · G [516, 620) · "ไหนี่มันฉี่ใช่ไหม" (SHEET-R1 part A). Medium close on Marcus, retention drift. UT14 exception: his right hand is the
// five-finger 3D pinch on the nose (thumb and finger, the gag), rising L0-L6, on from L6; the left hand is the painted mitten, rising L28-L34
// to point screen right at the jar (off-screen, "ไหนี่มันฉี่" LC) and held to L90. `disgusted` with the R5 yuck face; three ribbons round the head
// (CL04 ledger 100 %). The pinch reuses the KP-MARCUS-CLOSE `pinch` cell spec (approved).
const N = 104;
// hy 720 (the sheet line has no horizon): at the frame centre his chin sat at y 1194, on the caption band; the sheet's face is at y 533
const CAM = yc(-0.35, 1.4, 0.75, -6, -3, 1050, 720);
const AT: V3 = [-0.42, 0, 0.12];
const POINT: MidHandSpec = {gesture: 'point', w: [0.26, 0.06, 0.26], f: [0.6, 0.08, 0.8], b: [0, 1, 0]};
const mixSpec = (a: MidHandSpec, b: MidHandSpec, k: number): MidHandSpec => ({...b, w: lerp3(a.w as V3, b.w as V3, k), f: lerp3(a.f as V3, b.f as V3, k), b: lerp3(a.b as V3, b.b as V3, k)});
const rigAt = (L: number) => {
  const body = bodyFacing(MARCUS, AT, [0, 1]), nose = facePoint(body, 0.12, -0.03), chest = facePoint(body, 0.22, -0.4), k = ease(L, 0, 6);
  return rigHands(body, {
    right: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: lerp3(chest, nose, k)}, f: [-0.3, 1, 0.2], b: [0.2, 0, 1]},
    left: mixSpec(HANG, POINT, ease(L, 28, 34)),
  }, 44500);
};
export const def: Shot26 = {
  id: 'B02-SH04', N,
  cam: (L) => drift(CAM, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, r = rigAt(L);
    paintFullonica(p, c, {mood: 'morning'}, {
      noPoles: true,
      room: (q, cc) => {
        const m = act(q, cc, {def: MARCUS, at: AT, facing: [0, 1], face: 'disgusted', faceState: talkShot('B02-SH04', L, 'L05', YUCK), seed: 2622, t,
          arms: () => paintedArms(cc, r, {noHand: ['right']})});
        rec(pr, 'marcus', m);
        if (m) shoulderRibbons(q, m, (m.chin - m.headTop) / 0.42, t, {n: 3, strength: 1, seed: 35100});
      },
    });
  },
  hands: (L, c) => [layer(c, pick3D(rigAt(L), ['right']))],
};
export const shot = makeShot(def);

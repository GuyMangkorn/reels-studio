import type {V3} from '../../kit/space';
import {LIGHT_DAY} from '../crew';
import {paintHall} from '../hall';
import {lerp3, ramp, track} from '../motion22';
import {carrierItems, carrierSH06} from '../procession';
import {makeShot, type Shot22} from '../shot';
import {childItems, lifterItems, paintSpread, sheetMove, shotCam} from '../stage';
import {CS_AT} from '../tableware';

// B02-SH06 · G 400-456 (56 f) · about twenty dishes (EDU-EP22-SCENES-R1). High angle over CT: the 20 open dishes on four trays; CHILD front
// (pitch cue) P31, his right mitten picks up CS l 10-20 and lifts it over RB, `laugh` from l 13; carriers K1-K4 walk out to screen right, out of
// frame by l 40. W5.1 deviation: no steam (the hall has no steam asset; the dishes read as hot food by colour only).
const N = 56;
const M = sheetMove([0.0, 0.7, -0.1], [15, 12], [1.55, 1.35], 1.7, {f: 1050, hy: 700, pitch: [-35, -35]});
const HOVER_R: V3 = [-0.18, 0.79, -0.3], CS_GRIP: V3 = [CS_AT[0] + 0.07, CS_AT[1] + 0.03, CS_AT[2] + 0.02], OVER_RB: V3 = [0.03, 0.78, -0.33];
export const def: Shot22 = {
  id: 'B02-SH06', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, rHand = track(L, [[4, HOVER_R], [16, CS_GRIP], [26, OVER_RB]]), spoon = L >= 16;
    const lHand = lerp3([0.2, 0.8, -0.28], [0.12, 0.72, -0.5], ramp(L, 6, 20));
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on'},
      onChildTable: paintSpread({trays: [0, 1, 2, 3], rb: true, cs: !spoon}),
      items: [
        ...childItems({t, face: L >= 13 ? 'laugh' : 'happy', look: [0.15, 0.6], rHand, lHand, spoon, armPass: true}, pr),
        ...lifterItems(t),
        ...[0, 1, 2, 3].flatMap((k) => carrierItems(k, carrierSH06(k, L), t)),
      ],
    });
  },
};
export const shot = makeShot(def);

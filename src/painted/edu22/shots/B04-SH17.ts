import {LIGHT_ORDER, T_SH12, tasterStand} from '../crew';
import {G_COVER, G_SPOON, G_TAG} from '../glints';
import {paintHall} from '../hall';
import {ramp} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {lifterItems, sheetMove, shotCam} from '../stage';

// B04-SH17 · G 1220-1292 (72 f) · this checkpoint looks safer than it is (EDU-EP22-SCENES-R1). SH12's end framing (l 0 = SH12 l 39: yaw 36,
// r 2.4), a 3 % push to yaw 35, r 2.33; the same staging (covers off, T hands folded, lifters P01). Three warm glints on from l 0; G-TAG dims l 12-24
// (core gold -> grey #9a9a9a, size -40 %, halo off); G-SPOON and G-COVER stay warm.
const N = 72;
const M = sheetMove([-3.4, 0.9, 1.2], [36, 35], [2.4, 2.33], 1.5, {f: 1000, hy: 660});
export const def: Shot22 = {
  id: 'B04-SH17', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = (40 + L) / 30;
    paintHall(p, c, {light: LIGHT_ORDER, longTable: {covers: 'off', spoonOnSaucer: true}, items: [...lifterItems(t), tasterStand(t, T_SH12, {view: 'left'})]});
  },
  glints: (L) => [
    {id: 'G-TAG', at: G_TAG, k: 1, dim: ramp(L, 12, 24)},
    {id: 'G-SPOON', at: G_SPOON, k: 1},
    {id: 'G-COVER', at: G_COVER, k: 1},
  ],
};
export const shot = makeShot(def);

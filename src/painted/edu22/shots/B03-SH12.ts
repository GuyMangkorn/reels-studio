import {LIGHT_ORDER, SH12_MOVE, T_SH12, tasterStand} from '../crew';
import {G_COVER, G_SPOON, G_TAG, glintPop} from '../glints';
import {paintHall} from '../hall';
import {makeShot, type Shot22} from '../shot';
import {lifterItems, shotCam} from '../stage';

// B03-SH12 · G 846-886 (40 f) · three checkpoints (EDU-EP22-SCENES-R1, brief VD08). Three-quarter view down the open LT (all 28 covers off on the
// runner beside their bowls), T a step back at (-2.75, 0, +2.00) in left profile, hands folded; lifters E1-E3 front, P01. N7 glints (glints.tsx,
// world-locked through the shot camera): G-TAG l 6, G-SPOON l 16, G-COVER l 26, each a 6 f pop then steady. This end framing is SH17's start.
const N = 40;
export const def: Shot22 = {
  id: 'B03-SH12', N,
  cam: (L) => shotCam(SH12_MOVE, N, L),
  paint: (p, L, c) => {
    const t = L / 30;
    paintHall(p, c, {light: LIGHT_ORDER, longTable: {covers: 'off', spoonOnSaucer: true}, items: [...lifterItems(t), tasterStand(t, T_SH12, {view: 'left'})]});
  },
  glints: (L) => [
    {id: 'G-TAG', at: G_TAG, k: glintPop(L, 6)},
    {id: 'G-SPOON', at: G_SPOON, k: glintPop(L, 16)},
    {id: 'G-COVER', at: G_COVER, k: glintPop(L, 26)},
  ],
};
export const shot = makeShot(def);

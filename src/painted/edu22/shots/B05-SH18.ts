import type {Pt} from '../../kit/painter';
import {LIGHT_WARM, tasterStand} from '../crew';
import {paintHall} from '../hall';
import {ramp} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {childItems, lifterItems, paintSpread, sheetMove, shotCam} from '../stage';

// B05-SH18 · G 1292-1380 (88 f) · so why the long table? (EDU-EP22-SCENES-R1). The frame-0 axis again, now with his spread: CHILD front P31 with
// CS, one bite l 0-28 (`seated-spoon-to-mouth`: up l 0-10, chew, down l 18-28 to a pause mid-air l 30), `happy`; `turn-head-left` l 32-40 (eyes
// lead, the head swaps to the left profile at l 37, landing l 40 = G 1332), `suspicious` (curious). LT open (covers off), lifters and T.
const N = 88;
const M = sheetMove([-0.7, 1.0, -0.62], [74, 66], [2.0, 1.8], 1.05, {f: 1100, hy: 700});
export const def: Shot22 = {
  id: 'B05-SH18', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, eat = ramp(L, 0, 10) * (1 - ramp(L, 18, 28) * 0.55), turn = ramp(L, 32, 37);
    const look: Pt = L < 37 ? [-0.9 * turn, 0.1] : [-0.6, 0.05];
    paintHall(p, c, {
      light: LIGHT_WARM,
      longTable: {covers: 'off', spoonOnSaucer: true},
      onChildTable: paintSpread({trays: [0, 1, 2, 3], rb: true}),
      items: [...childItems({t, face: L < 32 ? 'happy' : 'suspicious', look, eat, fig: {head: L >= 37 ? 'left' : 'front', nod: [L < 37 ? -0.05 * turn : 0, 0]}}, pr),
        ...lifterItems(t), tasterStand(t)],
    });
  },
};
export const shot = makeShot(def);

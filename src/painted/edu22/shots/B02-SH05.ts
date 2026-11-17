import type {V3} from '../../kit/space';
import {LIGHT_DAY} from '../crew';
import {paintHall} from '../hall';
import {lerp3, ramp} from '../motion22';
import {carrierItems, carrierSH05, traysSetSH05} from '../procession';
import {makeShot, type Shot22} from '../shot';
import {childItems, lifterItems, paintSpread, sheetMove, shotCam} from '../stage';

// B02-SH05 · G 274-400 (126 f) · the dishes arrive (EDU-EP22-SCENES-R1, R1 carrier plan). Truck from the warm doorway to CT (ease [0, 0.87], hold
// l 110-126). Carriers K1-K4 walk their paths (procession.ts), each tray released on contact: TR1 l 64, TR2 l 78, TR4 l 92, TR3 l 106; each
// carrier steps back 0.3 m over 10 f. CHILD front P31: `surprised` -> `seated-reach-hover` l 32-47 (mittens over the table, never touching a
// carrier), `happy` from l 64, the mittens hovering over the landed trays (forearms repainted after CT: `armPass`).
const N = 126;
const M = {...sheetMove([[3.8, 1.2, -1.0], [0.35, 0.95, -0.25]], [12, 24], [3.1, 2.4], 1.5, {f: 1000, hy: 680}), ease: [0, 0.87] as [number, number]};
const LAP_R: V3 = [-0.07, 0.69, -0.56], LAP_L: V3 = [0.07, 0.69, -0.56];
export const def: Shot22 = {
  id: 'B02-SH05', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, reach = ramp(L, 32, 47), sway = Math.sin(L * 0.21) * 0.02 * reach;
    const rHov: V3 = [-0.2 + sway, 0.8, -0.3], lHov: V3 = [0.2 - sway, 0.8, -0.28];
    const face = L >= 64 ? 'happy' : 'surprised';
    const trays = traysSetSH05(L);
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on'},
      onChildTable: paintSpread({trays, rb: true, cs: true}),
      items: [
        ...childItems({t, face, look: [0.2, 0.25], rHand: lerp3(LAP_R, rHov, reach), lHand: lerp3(LAP_L, lHov, reach), armPass: reach > 0.05}, pr),
        ...lifterItems(t),
        ...[0, 1, 2, 3].flatMap((k) => carrierItems(k, carrierSH05(k, L), t)),
      ],
    });
  },
};
export const shot = makeShot(def);

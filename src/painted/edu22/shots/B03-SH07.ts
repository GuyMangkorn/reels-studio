import {TASTER} from '../cast';
import {LIGHT_DAY} from '../crew';
import {paintHall} from '../hall';
import {ramp} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {childItems, lifterItems, paintSpread, sheetMove, shotCam, T_MARK, tasterItem} from '../stage';

// B03-SH07 · G 456-562 (106 f) · the question swings to the long table (EDU-EP22-SCENES-R1). Hold l 0-46 on the child eating (`new:
// seated-spoon-to-mouth`, one bite l 4-34: spoon from RB up to the mouth l 4-16, held with a chew to l 22, down to RB by l 34), `happy`, never
// looking at LT; swing l 46-84 (ease [0.43, 0.79]) to LT's covered domes and the lifters; T idle at his mark in profile facing LT, spoon in hand.
const N = 106;
const M = {...sheetMove([[-0.3, 0.95, -0.6], [-3.5, 0.95, -0.4]], [62, 74], [1.4, 2.8], 1.05, {f: 1100, hy: 760}), ease: [0.43, 0.79] as [number, number]};
export const def: Shot22 = {
  id: 'B03-SH07', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, eat = ramp(L, 4, 16) * (1 - ramp(L, 22, 34));
    const chew = L > 14 && L < 26 ? 0.25 * (0.5 - 0.5 * Math.cos((L - 14) * 0.9)) : 0;
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on'},
      onChildTable: paintSpread({trays: [0, 1, 2, 3], rb: true}),
      items: [
        ...childItems({t, face: 'happy', look: [0.1, 0.35], eat, fig: {nod: [0, 0.02 * chew]}}, pr),
        ...lifterItems(t),
        tasterItem({at: T_MARK, t, view: 'left', seed: TASTER.seed, spoon: 'hand'}),
      ],
    });
  },
};
export const shot = makeShot(def);

import {callerStand, LIGHT_WARM, tasterStand} from '../crew';
import {paintHall} from '../hall';
import {makeShot, type Shot22} from '../shot';
import {childItems, eatCycle, lifterItems, paintSpread, sheetMove, shotCam} from '../stage';

// B05-SH19 · G 1380-1460 (80 f) · made for show (EDU-EP22-SCENES-R1). The one large reveal: crane up and back (ease [0.05, 0.875]: l 4-70, settle
// l 70-80) to the formal display, LT's open row with T, Y and E1-E3 in a line, the child small at his spread at right; ceiling beams at the top.
// The end camera (0.15, 3.4, 5.26) is beyond the old z +4.2 shell: hall.ts runs the floor, walls and ceiling on to z +6.5 and draws no near wall.
// CHILD front (pitch cue), eating (the B05 eat cycle, aligned with SH20's), happy; T, Y and the lifters front, P01, in attendance.
const N = 80;
const M = {...sheetMove([[-1.8, 0.8, -0.3], [-2.1, 0.8, -0.3]], [20, 22], [4.2, 6.0], [1.1, 3.4], {f: 950, hy: 760, pitch: [0, -22]}), ease: [0.05, 0.875] as [number, number]};
export const def: Shot22 = {
  id: 'B05-SH19', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    paintHall(p, c, {
      light: LIGHT_WARM,
      longTable: {covers: 'off', spoonOnSaucer: true},
      onChildTable: paintSpread({trays: [0, 1, 2, 3], rb: true}),
      items: [...childItems({t, face: 'happy', eat: eatCycle(L - 80)}, pr), ...lifterItems(t), tasterStand(t), callerStand(t)],
    });
  },
};
export const shot = makeShot(def);

import {callerStand, LIGHT_WARM, tasterStand} from '../crew';
import {paintHall} from '../hall';
import {camOf} from '../../kit/cam-moves';
import {SH20_END} from '../looks';
import {makeShot, type Shot22} from '../shot';
import {childItems, eatCycle, lifterItems, paintSpread, sheetMove, sine01} from '../stage';

// B05-SH20 · G 1460-1717 (257 f) · the dish in front of him, and the hold (EDU-EP22-SCENES-R1). 20a l 0-82: on LT (open domes, lifters), yaw
// 42 -> 40, r 3.3 -> 3.2 (sine). 20b l 82-144: truck and descend across the hall to the child (at -> (0.0, 0.8, -0.35), yaw 40 -> 30, r 3.2 -> 1.5,
// eye 1.6 -> 1.5, sine). Hold l 144-257 on 20b's end = LF01b's camera (looks.ts SH20_END, binding). CHILD front, the B05 eat cycle (48 f; spoon
// in RB at l 170 and l 178 for S14; the spoon at the lips on the last frame = LF01b), `happy` -> `relieved` from l 144. No eunuch at CT.
const N = 257;
const A = sheetMove([-3.6, 0.9, -0.3], [42, 40], [3.3, 3.2], 1.6, {f: 1100, hy: 640});
const B = sheetMove([[-3.6, 0.9, -0.3], [0.0, 0.8, -0.35]], [40, 30], [3.2, 1.5], [1.6, 1.5], {f: 1100, hy: 640});
export const def: Shot22 = {
  id: 'B05-SH20', N,
  cam: (L) => (L < 82 ? camOf(A, sine01(L / 82)) : L < 144 ? camOf(B, sine01((L - 82) / 62)) : camOf(SH20_END, 1)),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    paintHall(p, c, {
      light: LIGHT_WARM,
      longTable: {covers: 'off', spoonOnSaucer: true},
      onChildTable: paintSpread({trays: [0, 1, 2, 3], rb: true}),
      items: [...childItems({t, face: L >= 144 ? 'relieved' : 'happy', eat: eatCycle(L)}, pr), ...lifterItems(t), tasterStand(t), callerStand(t)],
    });
  },
};
export const shot = makeShot(def);

import type {V3} from '../../kit/space';
import {TASTER} from '../cast';
import {LIGHT_DAY} from '../crew';
import {paintHall, type CoverState} from '../hall';
import {lifterTable, nearLifter, type LiftJob} from '../lifts';
import {add3} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {sheetMove, shotCam, T_MARK} from '../stage';

// B03-SH11 · G 800-846 (46 f) · the lid ripple (EDU-EP22-SCENES-R1; brief N5 `new: cover-lift`, VD07). Truck along LT (1.8 m/s). T (both mittens
// free, spoon on SAU) lifts A01 (LT_BOWLS[1]) and A02 ([2]) from l 0 (R2) and the near-end bowl [0] l 10; lifters E1-E3 lift row B in z order
// from l 0 (R2; R1 l 6), 2.5 f apart, each lifter's two mittens alternating (lift 3 f up + 4 f back onto the runner beside the bowl), 15 visible lifts in
// l 0-40. W5.1 deviations (reach, each recorded in the handoff): row A beyond T (A04-A14, x -3.35) is 1.15 m from the lifters' side and out of any
// visible lifter's reach, so it is already open when it enters frame (VD07 rule; A04 sits at the right edge, x 1030, at l 0); the lifters stand
// 0.25-0.4 m along z from their marks (E1 z 1.45, E2 z 0.05, E3 z -1.4) and 0.2 m nearer the table (x -4.3) so each row-B cover they lift is
// inside +-0.6 m of them; row B's far end (B13, B14) is beyond E3 and open on entry (VD07).
const N = 46;
const M = sheetMove([[-3.6, 0.9, 2.0], [-3.6, 0.9, -0.8]], [68, 68], 2.0, 1.35, {f: 1000, hy: 760});
const T_AT: V3 = add3(T_MARK, [0, 0, -0.18]);
const MARKS: V3[] = [[-4.3, 0, 1.45], [-4.3, 0, 0.05], [-4.3, 0, -1.4]];
const TM = {up: 3, carry: 4, approach: 2, leave: 3};
const ZONES = [[14, 15, 16, 17], [18, 19, 20, 21], [22, 23, 24, 25]];
// R2 (SCENES-R2 fix 9): the ripple starts at l 0 (was l 6), same offsets; T's A01 lift is 40 % up at l 0 (t0 -1.2 of its 3 f rise), A02 from
// l 0 (was l 4); the near-end bowl [0] stays at l 10 (T's left mitten is busy with A01 until l 5.8 plus its 3 f leave).
const RIPPLE0 = 0;
/** Row-B jobs: ripple start RIPPLE0 + 2.5 f per bowl in z order; within a lifter the two hands alternate, a hand's second cover 11 f after its first. */
const JOBS: LiftJob[] = ZONES.flatMap((zone, who) => {
  const s = RIPPLE0 + 10 * who;
  return zone.map((i, n) => ({i, who, side: 'auto' as const, t0: s + (n % 2) * 2.5 + Math.floor(n / 2) * 11}));
});
const T_JOBS: LiftJob[] = [{i: 1, who: 0, side: 'l', t0: -1.2}, {i: 2, who: 0, side: 'r', t0: 0}, {i: 0, who: 0, side: 'l', t0: 10}];
const OPEN_ON_ENTRY = (i: number) => (i >= 3 && i <= 13) || i >= 26;
export const def: Shot22 = {
  id: 'B03-SH11', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = L / 30;
    const T = nearLifter(L, TASTER, {at: T_AT, t, facing: [-1, 0], kitFacing: true, seed: TASTER.seed}, T_JOBS, TM);
    const base = (i: number): CoverState => T.state(i) ?? (OPEN_ON_ENTRY(i) ? 'off' : 'on');
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: lifterTable(L, t, {jobs: JOBS, marks: MARKS, timing: TM, base, spoonOnSaucer: true}),
      items: [T.item],
    });
  },
};
export const shot = makeShot(def);

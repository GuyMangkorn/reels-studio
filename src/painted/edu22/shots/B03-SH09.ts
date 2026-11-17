import type {V3} from '../../kit/space';
import {TASTER} from '../cast';
import {blendHands, cardMouth, LIGHT_DAY, onBody, spoonBowlToward} from '../crew';
import {LT_BOWLS, paintHall, SAU} from '../hall';
import {add3, coverLift, lerp3, paintPerson, ramp, track, type PersonOpts} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {BOWL_A01, lifterItems, paintSpoonPx, sheetMove, shotCam, T_MARK} from '../stage';
import {paintCover, paintSpoonHeld} from '../tableware';

// B03-SH09 · G 674-740 (66 f) · the taster tastes a little (EDU-EP22-SCENES-R1). Side view; T in left profile facing LT, `new: spoon-taste`:
// the right mitten dips the spoon into A01 l 12-18, spoon to the mouth l 18-30, a small nod l 30-36, the spoon rests on SAU l 36-44, the left
// mitten lifts A01's cover from its rest point back onto the bowl l 44-56 (`coverLift` reverse), a half step -z toward A02 l 56-66 (0.18 m).
const N = 66;
// R2 (SCENES-R2 fix 2): medium shot, T from the cap to the hips (R1 at (-3.2, 1.2, 1.75), yaw 8 -> 3, r 2.3 -> 2.1, eye 1.5, f 1100, hy 680).
const M = sheetMove([-3.15, 1.15, 1.85], [12, 9], [1.3, 1.2], 1.4, {f: 1000, hy: 640, pitch: [-10, -10]});
const FOOD: V3 = [LT_BOWLS[BOWL_A01].at[0] + 0.02, 0.875, LT_BOWLS[BOWL_A01].at[2]];
const STEP: V3 = add3(T_MARK, [0, 0, -0.18]);
export const def: Shot22 = {
  id: 'B03-SH09', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = L / 30, at = lerp3(T_MARK, STEP, ramp(L, 56, 66));
    const nod = Math.sin(Math.PI * Math.min(1, Math.max(0, (L - 30) / 6)));
    const base: PersonOpts = {at, t, view: 'left', seed: TASTER.seed, fig: {nod: [0, 0.07 * nod]}, walk: 0.45 * ramp(L, 56, 66), stride: 0.5};
    const mouth = cardMouth(c, TASTER, base) ?? add3(at, [-0.1, 1.5, 0]);
    const rest = onBody(TASTER, T_MARK, [-1, 0], 0.22, 0.12, 0.52), dip: V3 = add3(FOOD, [0.09, 0.05, 0.0]), onSau: V3 = add3(SAU, [0.07, 0.03, -0.02]);
    const hand = track(L, [[4, rest], [12, dip], [18, dip], [26, add3(mouth, [0.03, -0.09, 0])], [33, add3(mouth, [0.03, -0.09, 0])], [42, onSau]]);
    const spoonTo: V3 = L < 20 ? FOOD : L < 35 ? mouth : SAU;
    const wr = ramp(L, 0, 4) * (1 - ramp(L, 44, 50));
    const lf = coverLift(BOWL_A01, L, 44, {reverse: true, carry: 12, approach: 4, leave: 6});
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on', coverOf: (i) => (i === BOWL_A01 ? lf.state : 'on'), spoonOnSaucer: L >= 42},
      items: [...lifterItems(t), {at, bias: 0, draw: (q, cc) => {
        if (lf.state === 'held') paintCover(q, cc, 24100 + BOWL_A01 * 60 + 10, lf.cover, true);
        const hp = blendHands(cc, TASTER, base, {r: [hand, wr], l: [lf.knob, lf.w]});
        // the spoon: in the hand (hanging) before l 4, a world spoon l 4-42, on SAU after (hall.ts)
        const spoonFree = L >= 4 && L < 42;
        if (spoonFree) paintSpoonHeld(q, cc, 26620, hand, spoonBowlToward(hand, spoonTo));
        paintPerson(q, cc, TASTER, {...base, handsPx: hp, held: (qq, a, u) => { if (L < 4) paintSpoonPx(qq, 26600, a.rHand, Math.PI / 2 + 0.25, u); }});
      }}],
    });
  },
};
export const shot = makeShot(def);

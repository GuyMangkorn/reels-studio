import type {V3} from '../../kit/space';
import {TASTER} from '../cast';
import {blendHands, cardMouth, LIGHT_DAY, onBody, spoonBowlToward} from '../crew';
import {coverOn, LT_BOWLS, paintHall} from '../hall';
import {add3, ramp, track, type PersonOpts} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {BOWL_A01, BOWL_A02, lifterItems, paintSpoonPx, sheetMove, shotCam, T_MARK, tasterItem} from '../stage';
import {paintCover, paintSpoonHeld} from '../tableware';

// B01-SH02 · G 37-140 (103 f) · "you" are the taster (EDU-EP22-SCENES-R1). Over T's right shoulder at the near end of LT, the domes receding up
// and right. N5 `new: spoon-taste` + one-hand `new: cover-lift` (Boss W5.1): the left mitten lifts A01's cover l 3-15 and holds it beside the bowl,
// the right mitten (spoon) dips l 50, lifts l 50-60, tastes l 60-74 (out of frame top-right), the cover goes back on l 76-86, T turns half a step
// toward A02 l 88-103. A01 = LT_BOWLS[1] (z 1.68, the sheet's tag bowl; stage.ts BOWL_A01).
const N = 103;
const M = sheetMove([-3.35, 0.88, 1.68], [30, 27], [1.1, 1.02], 1.55, {f: 1100, hy: 760, pitch: [-25, -25]});
const F0: [number, number] = [-1, 0];
const A02F = ((): [number, number] => { const a = LT_BOWLS[BOWL_A02].at, dx = a[0] - T_MARK[0], dz = a[2] - T_MARK[2], L = Math.hypot(dx, dz); return [dx / L, dz / L]; })();
const ON = coverOn(BOWL_A01), BESIDE: V3 = add3(ON, [0.03, 0.12, 0.2]);
const FOOD: V3 = [LT_BOWLS[BOWL_A01].at[0] + 0.02, 0.875, LT_BOWLS[BOWL_A01].at[2]];

export const def: Shot22 = {
  id: 'B01-SH02', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = L / 30, k = ramp(L, 88, 103), f: [number, number] = [F0[0] + (A02F[0] - F0[0]) * k, F0[1] + (A02F[1] - F0[1]) * k];
    const fl = Math.hypot(f[0], f[1]), facing: [number, number] = [f[0] / fl, f[1] / fl];
    // the cover (left mitten on the knob): on -> beside l 3-15, held, beside -> on l 76-86
    const cover = track(L, [[3, ON], [15, BESIDE], [76, BESIDE], [86, ON]]);
    const held = L > 3 && L < 86, wl = L <= 3 ? ramp(L, 0, 3) : L >= 86 ? 1 - ramp(L, 86, 92) : 1;
    // the spoon hand: rest -> over the bowl (l 40-50 dip) -> lifted (l 60) -> at the mouth (l 66-74) -> rest (l 88)
    const base: PersonOpts = {at: T_MARK, t, facing, kitFacing: true, seed: TASTER.seed};
    const rest = onBody(TASTER, T_MARK, F0, 0.2, 0.16, 0.5), mouth = cardMouth(c, TASTER, base) ?? add3(T_MARK, [-0.1, 1.5, 0]);
    const dipHand: V3 = add3(FOOD, [0.08, 0.05, 0.0]), up: V3 = [-3.12, 1.12, 1.72], atMouth: V3 = add3(mouth, [0.03, -0.09, 0]);
    const hand = track(L, [[38, rest], [50, dipHand], [60, up], [66, atMouth], [74, atMouth], [88, rest]]);
    const spoonTo: V3 = L < 55 ? FOOD : L < 80 ? mouth : add3(hand, [-0.1, -0.05, 0]);
    const wr = ramp(L, 34, 40) * (1 - ramp(L, 88, 96));
    const T = tasterItem({...base, held: (q, a, u) => { if (wr <= 0) paintSpoonPx(q, 26600, a.rHand, Math.PI / 2 + 0.25, u); }}, -0.2);
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on', coverOf: (i) => (i === BOWL_A01 && held ? 'held' : 'on')},
      items: [...lifterItems(t), {...T, draw: (q, cc) => {
        const hp = blendHands(cc, TASTER, base, {l: [add3(cover, [0, 0.07, 0]), wl], r: [hand, wr]});
        if (held) paintCover(q, cc, 24100 + BOWL_A01 * 60 + 10, cover, true);
        tasterItem({...base, handsPx: hp, held: (qq, a, u) => { if (wr <= 0) paintSpoonPx(qq, 26600, a.rHand, Math.PI / 2 + 0.25, u); }}).draw(q, cc);
        if (wr > 0) paintSpoonHeld(q, cc, 26620, hand, spoonBowlToward(hand, spoonTo));
      }}],
    });
  },
};
export const shot = makeShot(def);

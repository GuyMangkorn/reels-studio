import {lerpStrip, paintDemo, STRIP_A_PRESSED, stripAOver} from '../demo';
import {ramp, seg} from '../motion22';
import {LF02_HY, SH14} from '../looks';
import {DEMO_PAPER, makeShot, type Shot22} from '../shot';
import {sine01} from '../stage';

// B04-SH14 · G 972-1026 (54 f) · a boiled egg darkens silver (EDU-EP22-SCENES-R1; LF02 binding: looks.ts `SH14` at hy 880 = LF02_HY, r 0.19 ->
// 0.15, near 0.05). The mitten presses strip A's tip into the left yolk: contact l 6 (no deeper than 0.01 m), the tarnish front runs 0 -> 60 % of
// the strip l 12-44 (linear: 40 % = LF02 at l 33), hold l 44-54. Contact shadows under the hand and the strip tip (Film LF02 note; demo.ts).
const N = 54;
const ABOVE = stripAOver([-0.02, 0.04, 0]);
export const def: Shot22 = {
  id: 'B04-SH14', N, paper: DEMO_PAPER,
  cam: (L) => SH14(sine01(L / (N - 1)), LF02_HY),
  paint: (p, L, c) => {
    const tarnish = 0.6 * seg(L, 12, 44);
    paintDemo(p, c, L >= 6 ? {stripA: 'pressed', tarnish} : {stripA: lerpStrip(ABOVE, STRIP_A_PRESSED, ramp(L, 0, 6)), tarnish: 0});
  },
};
export const shot = makeShot(def);

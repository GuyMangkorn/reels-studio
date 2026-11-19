import {LF04_JAR, paintBenchScene} from '../bench26';
import {WS} from '../r4-looks';
import {makeShot, type Shot26} from '../shot';
import {ease, push} from '../stage26';

// B02-SH02 · G [423, 516) · the smell arrives, LF04 (approved) and the CL04 plant (SHEET-R1 part A). The LF04 camera with a slow 0.12 m push.
// Lid lift L0-L15 (clear at L15); three ribbons rise L15-L32 from the jar mouth and reach Marcus's nose at L32 ("กลิ่นมาถึงก่อน"); yuck face
// from L32; recoil from the waist (head cock -9) L32-L52; fan mitten up from L47; hold to L92 (the LF04 frame). Ribbons wave with t.
const N = 93;
export const def: Shot26 = {
  id: 'B02-SH02', N,
  cam: (L) => push(WS.LF04, 0.12 * ease(L, 0, N - 1)),
  paint: (p, L, c, pr) => {
    paintBenchScene(p, c, {t: L / 30, jar: LF04_JAR, lid: ease(L, 0, 15), senior: 'happy', marcus: 'neutral', yuck: L >= 32,
      recoil: ease(L, 32, 52), fan: ease(L, 44, 52), rib: L < 15 ? 0 : ease(L, 15, 32) * 0.98 + 0.02}, pr);
  },
};
export const shot = makeShot(def);

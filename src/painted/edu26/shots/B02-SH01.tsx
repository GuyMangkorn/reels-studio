import type {V3} from '../../kit/space';
import {LF04_JAR, paintBenchScene} from '../bench26';
import {WS} from '../r4-looks';
import {makeShot, type Shot26} from '../shot';
import {ease, lerp3, push} from '../stage26';

// B02-SH01 · G [360, 423) · the jar handed over (SHEET-R1 part A). The LF04 camera (measured) with a slow 0.10 m retention push. The senior
// carries the lidded jar at his chest and sets it on the bench at (+0.10, 0.86, -0.36) by L32 ("ให้ใบหนึ่ง"), then rests his mitten on the
// lid. Marcus `happy` -> `neutral` on the jar at L32; the shirt is on the bench stack. No ribbons until the lid opens (B02-SH02).
const N = 63;
const CARRY: V3 = [0.3, 0.95, -0.72];
export const def: Shot26 = {
  id: 'B02-SH01', N,
  cam: (L) => push(WS.LF04, 0.1 * ease(L, 0, N - 1)),
  paint: (p, L, c, pr) => {
    const k = ease(L, 12, 32);
    paintBenchScene(p, c, {t: L / 30, jar: lerp3(CARRY, LF04_JAR, k), lid: 0, carry: L < 33, senior: 'happy', marcus: L < 32 ? 'happy' : 'neutral',
      recoil: 0, fan: 0, rib: 0}, pr);
  },
};
export const shot = makeShot(def);

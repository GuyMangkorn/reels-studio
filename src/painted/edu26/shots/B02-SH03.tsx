import type {V3} from '../../kit/space';
import {camUnit} from '../../kit/ycam';
import {at2, paintFullonica} from '../fullonica';
import {act, arm, LF04_JAR, LF04_MARCUS, LF04_SENIOR} from '../r4-looks';
import {MARCUS, paintJar, SENIOR} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {shoulderRibbons} from '../acts26';
import {drift, ease, rec, yc} from '../stage26';

// B02-SH03 · G [620, 695) · "ของดีนะ ใส่เยอะ ๆ" (SHEET-R1 part A). Medium on the senior across the bench (retention drift); he beams, pats the open
// jar at L20 (est) and slides it 0.12 m toward Marcus L47-L55 ("ไม่ต้องเกรงใจ"), the base staying on the stone. Marcus's shoulder in the near-left
// foreground (his back three-quarter: this is the reverse of LF04) with two ribbons at 70 % (CL04 ledger).
const N = 75;
const CAM = yc(0.1, 1.47, 0.9, 8, -10, 950);
const TOWARD: V3 = [LF04_MARCUS[0] - LF04_JAR[0], 0, LF04_MARCUS[2] - LF04_JAR[2]];
const n = Math.hypot(TOWARD[0], TOWARD[2]);
export const def: Shot26 = {
  id: 'B02-SH03', N,
  cam: (L) => drift(CAM, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, slide = 0.12 * ease(L, 47, 55), pat = Math.sin(Math.PI * ease(L, 15, 25)) * 0.05;
    const jar: V3 = [LF04_JAR[0] + (TOWARD[0] / n) * slide, LF04_JAR[1], LF04_JAR[2] + (TOWARD[2] / n) * slide];
    paintFullonica(p, c, {mood: 'morning'}, {
      behindBench: (q, cc) => {
        const h = at2(cc, [jar[0] + 0.12, jar[1] + 0.3 + pat, jar[2] - 0.05]);
        rec(pr, 'senior', act(q, cc, {def: SENIOR, at: LF04_SENIOR, facing: [-0.55, 1], face: 'happy', faceState: talkShot('B02-SH03', L, 'L06'), seed: 2621, t,
          arms: (g, u) => ({lArm: arm(h, [g[0] + 0.05 * u, g[1] - 0.95 * u], {open: -1})})}));
      },
      room: (q, cc) => {
        paintJar(q, cc, jar, 34000, {lid: 'off', h: 0.36, w: 0.32});
        const m = act(q, cc, {def: MARCUS, at: LF04_MARCUS, facing: [0.55, -1], face: 'disgusted', seed: 2622, t});
        rec(pr, 'marcus', m);
        if (m) shoulderRibbons(q, m, camUnit(cc, [LF04_MARCUS[0], 1.3, LF04_MARCUS[2]]), t, {n: 2, strength: 0.7, seed: 35200});
      },
    });
  },
};
export const shot = makeShot(def);

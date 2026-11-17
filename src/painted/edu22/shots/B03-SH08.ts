import type {Pt} from '../../kit/painter';
import {camPoint, camUnit} from '../../kit/ycam';
import {LIGHT_DAY} from '../crew';
import {paintMitten, TASTER_MITTEN} from '../demo';
import {paintHall} from '../hall';
import {coverLift, lerpPt} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {BOWL_A01, sheetMove, shotCam} from '../stage';
import {paintCover} from '../tableware';

// B03-SH08 · G 562-674 (112 f) · the silver tag (EDU-EP22-SCENES-R1). Close on A01 (LT_BOWLS[1]); T's mitten and slate sleeve only (`new:
// cover-lift` one hand; demo.ts `paintMitten` with TASTER_MITTEN): enters from screen right l 0-4, lifts the cover up and out l 4-22 and sets it on
// the runner at its rest point (-3.35, 0.823, 1.85) by l 30, exits right l 30-40. The tag in the braised food reads from l 40.
const N = 112;
const M = sheetMove([-3.35, 0.86, 1.68], [22, 14], [0.38, 0.32], 1.02, {f: 1100, hy: 760, pitch: [-25, -25]});
const LIFT = {up: 9, carry: 17, approach: 4, leave: 10};
export const def: Shot22 = {
  id: 'B03-SH08', N,
  cam: (L) => shotCam(M, N, L, 0.05),
  paint: (p, L, c) => {
    const lf = coverLift(BOWL_A01, L, 4, LIFT);
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on', coverOf: (i) => (i === BOWL_A01 ? lf.state : 'on'), detailPx: 200},
      after: (q, cc) => {
        if (lf.state === 'held') paintCover(q, cc, 24100 + BOWL_A01 * 60 + 10, lf.cover, true);
        const k = camPoint(cc, lf.knob);
        if (!k || lf.w <= 0) return;
        const off: Pt = [1260, k[1] + 140], pinch = lerpPt(off, k, lf.w);
        paintMitten(q, [pinch[0] + 6, pinch[1] - 4], camUnit(cc, lf.knob), 0.32, TASTER_MITTEN);
      },
    });
  },
};
export const shot = makeShot(def);

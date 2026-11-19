import type {V3} from '../../kit/space';
import {camUnit} from '../../kit/ycam';
import {paintFullonica, STALL_Z0} from '../fullonica';
import {act} from '../r4-looks';
import {SENIOR} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {MARCUS_DAMP, shoulderRibbons} from '../acts26';
import {drift, ease, rec, yc} from '../stage26';

// B04-SH05 · G [1187, 1267) · "เอ่อ… สูตรลับของร้านครับ" (SHEET-R1 part B). Medium close on Marcus (`evening`), retention drift: the P04
// scratch-head mitten from L8, eyes slide right to the jar corner at L10 ("เอ่อ…"), the grin on "สูตรลับ" at L28; the senior in the
// background gives the P29 thumbs-up at L34. Two readable ribbons behind his head on the left (55 %).
const N = 80;
const CAM = yc(-0.3, 1.4, 1.3, 10, -3, 1050);
const AT: V3 = [-0.4, 0, 0.12], SEN: V3 = [0, 0, -1.8];
export const def: Shot26 = {
  id: 'B04-SH05', N,
  cam: (L) => drift(CAM, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, eyes = ease(L, 9, 13);
    paintFullonica(p, c, {mood: 'evening', t}, {
      stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
      behindBench: (q, cc) => rec(pr, 'senior', act(q, cc, {def: SENIOR, at: SEN, facing: [-0.1, 1], face: 'happy', seed: 2621, t, pose: L >= 34 ? 'P29' : 'P01'})),
      room: (q, cc) => {
        const m = act(q, cc, {def: MARCUS_DAMP, at: AT, facing: [0.2, 1], face: L >= 28 ? 'happy' : 'worried', faceState: talkShot('B04-SH05', L, 'L14', L >= 28 ? {mouth: 'grin'} : undefined),
          seed: 2622, t, look: [0.85 * eyes, 0], pose: L >= 8 ? 'P04' : 'P01'});
        rec(pr, 'marcus', m);
        if (m) shoulderRibbons(q, m, camUnit(cc, [AT[0], 1.3, AT[2]]), t, {n: 2, strength: 0.55, seed: 35900, side: 'r', reach: 1.2});
      },
    });
  },
};
export const shot = makeShot(def);

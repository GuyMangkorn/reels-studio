import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {LIQUID, paintFullonica, STALL_Z0, STALLS} from '../fullonica';
import {act, YUCK} from '../r4-looks';
import {MARCUS_BARE} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {shoulderRibbons, sourceRibbons, treadSlowing} from '../acts26';
import {drift, ease, rec, yc} from '../stage26';

// B03-SH06 · G [926, 1042) · "แม่ครับ… ผมสมัครงานผิดร้านแน่เลย" (SHEET-R1 part A). Medium close, slightly low, the light well behind; Marcus in
// the middle stall lifts his eyes to the ceiling at L0, the tread slows from 15 to about 30 f per step by L40, he hangs his head at L104-L110
// (line end) and holds (the plate holds its last frame under the time-passing dissolve to G1046). Three thin ribbons (70 %, CL04 carrier):
// off both shoulders and the stall edge. `setback` light.
const N = 116;
// hy 760 (no horizon in the sheet line): at the frame centre his chin sat at y 1192, on the band; the sheet's face is at y 742
const CAM = yc(-0.15, 1.3, -1.75, 0, 6, 1050, 760);
const AT: V3 = [-0.15, 0, -2.75];
export const def: Shot26 = {
  id: 'B03-SH06', N,
  cam: (L) => drift(CAM, L, 0.02),
  paint: (p, L, c, pr) => {
    const t = L / 30, hang = ease(L, 104, 110), up = 1 - ease(L, 60, 80);
    paintFullonica(p, c, {mood: 'setback'}, {
      noPoles: true,
      stallLiquidFrom: [STALL_Z0, AT[2] - 0.03, STALL_Z0],
      inStalls: (q, cc) => {
        const m = act(q, cc, {def: MARCUS_BARE, at: AT, facing: [0, 1], face: hang > 0.5 ? 'sad' : 'worried', faceState: talkShot('B03-SH06', L, 'L10', hang > 0.5 ? undefined : {...YUCK, eyes: 'dot', squint: 0.12 + 0.6 * (1 - up)}),
          seed: 2631, t, look: [0, -1.2 * up + 0.7 * hang], fig: {legKick: treadSlowing(L, 15, 30, 0, 40), headCock: 4 * hang, nod: [0, -0.12 * up + 0.3 * hang]},
          tint: {to: '#7d8f7c', u: 0.1}});
        rec(pr, 'marcus', m);
        if (m) shoulderRibbons(q, m, camUnit(cc, [AT[0], 1.3, AT[2]]), t, {n: 2, strength: 1, seed: 35700, thin: true, under: true});
      },
      room: (q, cc) => {
        const to = camPoint(cc, [STALLS[1].x1 + 0.05, 1.5, -2.6]);
        if (to) sourceRibbons(q, cc, [STALLS[1].x1 - 0.1, LIQUID + 0.3, -2.35], to, t, {n: 1, strength: 1, seed: 35740, w: 0.045 * camUnit(cc, [0, 1, -2.4]), under: true});
      },
    });
  },
};
export const shot = makeShot(def);

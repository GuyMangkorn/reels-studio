import {washAt} from '../../kit/draw';
import {hash} from '../../kit/hash';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, mixYCam} from '../../kit/ycam';
import {paintFullonica, STALL_Z0} from '../fullonica';
import {act, noseOf} from '../r4-looks';
import {MARCUS, paintJar, paintRibbons} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {armTo, shoulderRibbons} from '../acts26';
import {ease, rec, yc} from '../stage26';

// B02-SH05 · G [695, 767) · "ผิดจ้ะ" whip-pan to the tub (SHEET-R1 part A). Medium on Marcus holding the open jar at arm's length in both mittens,
// a forced smile, ribbons round him (ledger 100 %). Whip L48-L60 on "ผิดจ้ะ" (L48): streaked middle frames, landing on the empty middle stall
// (flat grey-teal liquid, rim readable) and held L60-L71 for the match cut.
// W5.2 deviation: from the sheet's start eye (-0.40, 1.42, +1.10) Marcus stands between the lens and the stall (his chest fills the ray at pitch
// -20), so the whip carries a hidden move under the streaks: L48-L54 swing from the start line toward the stall (yaw -> +14, pitch -> -16),
// L54 switch under full streak to the stall eye (-0.175, 1.75, -1.55), landing L60 at yaw 0, pitch -48, f 950 on the stall. Film to confirm.
const N = 72;
const A = yc(-0.4, 1.42, 1.1, 0, -8, 950), A1 = yc(-0.4, 1.42, 1.1, 14, -16, 950);
const B0 = yc(-0.175, 1.75, -1.55, -14, -36, 950), B = yc(-0.175, 1.75, -1.55, 0, -48, 950);
const AT: V3 = [-0.42, 0, 0.12];
const streak = (L: number) => (L < 48 || L > 60 ? 0 : Math.sin(Math.PI * (L - 48) / 12));
export const def: Shot26 = {
  id: 'B02-SH05', N,
  cam: (L) => (L < 54 ? mixYCam(A, A1, ease(L, 48, 54)) : mixYCam(B0, B, ease(L, 54, 60))),
  paint: (p, L, c, pr) => {
    const t = L / 30, jar: V3 = [AT[0] + 0.05, 1.0, AT[2] + 0.36];
    paintFullonica(p, c, {mood: 'morning'}, {
      noPoles: L < 54,
      stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
      room: (q, cc) => {
        if (cc.z < 0) return; // the stall camera: the room is empty of Marcus behind the lens
        const m = act(q, cc, {def: MARCUS, at: AT, facing: [0, 1], face: 'worried', faceState: {mouth: 'smile'}, seed: 2622, t,
          arms: () => ({rArm: armTo(cc, [jar[0] - 0.16, jar[1] + 0.05, jar[2]], 1, {open: true, drop: 0.08, out: 0.05}),
            lArm: armTo(cc, [jar[0] + 0.16, jar[1] + 0.05, jar[2]], -1, {open: true, drop: 0.08, out: 0.05})})});
        rec(pr, 'marcus', m);
        const j = paintJar(q, cc, [jar[0], jar[1] - 0.18, jar[2]], 34000, {lid: 'off', h: 0.36, w: 0.32});
        if (m) {
          const u = camUnit(cc, [AT[0], 1.3, AT[2]]);
          shoulderRibbons(q, m, u, t, {n: 2, strength: 1, seed: 35300});
          const mo = j?.mouth ?? camPoint(cc, jar);
          if (mo) paintRibbons(q, 35340, [mo[0], mo[1] - 6], noseOf(m, 0, 0.3), {w: 0.07 * u, op: 200, spread: 0.05 * u, bow: 0.2, waves: 1.8, count: 1, t});
        }
      },
    });
  },
  // the whip's streaks: wide paper-tone smears across the frame, strongest mid-whip
  screen: (p, L) => {
    const k = streak(L);
    if (k <= 0.05) return;
    for (let i = 0; i < 14; i++) {
      const y = 60 + i * 135 + 40 * hash(35400 + i), h = 30 + 60 * hash(35420 + i);
      washAt(p, 35440 + i, i % 2 ? '#e8cf9c' : '#9b6b48', Math.round(170 * k), [[-40, y], [1120, y - 30], [1120, y - 30 + h * (0.4 + k)], [-40, y + h * (0.4 + k)]], 0.15, 0.25);
    }
  },
};
export const shot = makeShot(def);

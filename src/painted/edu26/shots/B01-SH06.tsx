import type {V3} from '../../kit/space';
import {paintFullonica} from '../fullonica';
import {act} from '../r4-looks';
import {MARCUS, paintShirt} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {armTo, CL01_L, CL01_R, VOW_CAM} from '../acts26';
import {ease, lerp3, rec} from '../stage26';

// B01-SH06 · G [242, 360) · the vow, CL01 template (SHEET-R1 part A). Medium close at the bench's near side, retention drift. Marcus lifts the
// customer's ivory shirt from the basket (below frame right) L4-L20 and carries it over his left forearm; on "ด้วยสองมือนี้เลยครับ" (est, LC)
// both mittens rise L60-L76 to the CL01 world anchors (-0.447, 1.39, 0.38) / (-0.153, 1.39, 0.38), palms toward himself, `smug`; hold to L117.
// The CL01 spots (380, 900) / (700, 900) are the contract the match cut in B03-SH04 lands on (measured by measure-shots.ts, `rHandX` ...).
const N = 118;
const AT: V3 = [-0.42, 0, 0.12];
export const def: Shot26 = {
  id: 'B01-SH06', N,
  // no retention drift: the CL01 spots are a screen contract shared with B03-SH04's match cut
  cam: () => VOW_CAM,
  paint: (p, L, c, pr) => {
    const t = L / 30, lift = ease(L, 4, 20), raise = ease(L, 60, 76);
    const lLow: V3 = [-0.05, 0.75, 0.32], lCarry: V3 = [-0.2, 1.02, 0.3], rLow: V3 = [-0.6, 0.86, 0.2];
    const lw = raise > 0 ? lerp3(lCarry, CL01_L, raise) : lerp3(lLow, lCarry, lift), rw = lerp3(rLow, CL01_R, raise);
    paintFullonica(p, c, {mood: 'morning'}, {
      noPoles: true,
      room: (q, cc) => {
        const m = act(q, cc, {def: MARCUS, at: AT, facing: [0, 1], face: raise > 0.5 ? 'smug' : 'happy', faceState: talkShot('B01-SH06', L, 'L03'), seed: 2612, t, look: [0.15, 0.25 * (1 - raise)],
          arms: () => ({...(L >= 4 ? {lArm: armTo(cc, lw, -1, {open: true, drop: 0.2, out: 0.12})} : {}),
            ...(raise > 0 ? {rArm: armTo(cc, rw, 1, {open: true, drop: 0.2, out: 0.12})} : {})})});
        rec(pr, 'marcus', m);
        if (L >= 4) {
          // the shirt over the left forearm: hung from the forearm line (wrist -> 0.2 m toward the elbow)
          const a: V3 = [lw[0] - 0.06, lw[1] - 0.13, lw[2] - 0.1];
          paintShirt(q, cc, a, [lw[0] + 0.03, lw[1] - 0.02, lw[2]], 0.5, 31600, {lit: 0.35});
        }
      },
    });
  },
};
export const shot = makeShot(def);

import type {V3} from '../../kit/space';
import {paintFullonica, STALL_Z0} from '../fullonica';
import {act, paintTread, paintTreader, STALL1_AT, treader} from '../r4-looks';
import {MARCUS, SENIOR} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {treadKick, walkBetween} from '../acts26';
import {camKeys, ease, rec, yc} from '../stage26';

// B01-SH05 · G [140, 242) · Marcus steps in (SHEET-R1 part A). From the jar corner toward the street door (TH-WB axis, hy 930 as WS.B), push in
// eased L0 -> L101. Marcus (sandals, `happy`) is outside the door at L0, crosses the threshold (-2.90, 0, +0.40) at L7 and walks to
// (-0.80, 0, +0.55) by L50, then stands beaming at the room. The senior treads the middle stall and glances at the door at L61, smiling by L70.
// W5.2 deviation: the sheet's end facing "-x with a half-turn to the room" would show his back to this camera (it sits at +x); he stops facing
// the room and the lens (+x, a little toward +z) so the beam reads. Film to confirm.
const N = 102;
const C0 = yc(1.5, 1.55, 1.0, -52, -7, 800, 930), C1 = yc(1.3, 1.5, 0.8, -62, -6, 900, 930);
const OUT: V3 = [-3.5, 0, 0.38], DOOR: V3 = [-2.9, 0, 0.4], END: V3 = [-0.8, 0, 0.55];
export const def: Shot26 = {
  id: 'B01-SH05', N,
  cam: (L) => camKeys([[0, C0], [101, C1]], L),
  paint: (p, L, c, pr) => {
    const t = L / 30, w = L < 7 ? walkBetween(L, 0, 7, OUT, DOOR) : walkBetween(L, 7, 50, DOOR, END);
    const stride = L < 7 ? 1 : w.stride, glance = ease(L, 58, 64);
    paintFullonica(p, c, {mood: 'morning'}, {
      stallLiquidFrom: [STALL_Z0, STALL1_AT[2] - 0.03, STALL_Z0],
      inStalls: (q, cc) => rec(pr, 'senior', paintTreader(q, cc, {...treader(SENIOR, L >= 66 ? 'happy' : 'neutral', 2611), t, look: [-0.9 * glance, 0.05],
        fig: {legKick: treadKick(L, 0, 15, 18)}})),
      onLiquid: (q, cc, k) => { if (k === 1) paintTread(q, cc, 1, {mood: 'morning'}); },
      room: (q, cc) => rec(pr, 'marcus', act(q, cc, {def: MARCUS, at: w.at, facing: L < 50 ? [1, 0.05] : [1, 0.45], face: 'happy', seed: 2612, t,
        fig: w.walk !== undefined ? {walk: w.walk, stride} : {}})),
    });
  },
};
export const shot = makeShot(def);

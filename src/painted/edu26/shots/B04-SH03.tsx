import type {V3} from '../../kit/space';
import {paintFullonica, STALL_Z0} from '../fullonica';
import {act} from '../r4-looks';
import {CUSTOMER, paintShirt} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {armTo, handsOf} from '../acts26';
import {drift, ease, lerp, lerp3, rec, yc} from '../stage26';

// B04-SH03 · G [1125, 1187) · "ขาวดีนะ ใช้อะไรซักเนี่ย" (SHEET-R1 part B). Closer on the customer holding the shirt up in the door beam (`evening`),
// retention drift. CL02 payoff: the shirt glows white against the warm wall. On "ใช้อะไรซัก" (L22) she lowers it to her chest by L34 and turns
// her eyes to Marcus off-screen right. No Marcus, no ribbon in frame.
// W5.2 staging note: held square in front of her at head height the shirt hides her face, so it is held up and to her right (toward the door,
// screen left), her face clear beside it; lowered, it comes in front of her chest.
const N = 62;
const CAM = yc(-1.4, 1.46, 1.4, -35, -6, 990);
const AT: V3 = [-1.9, 0, 0.3], F: [number, number] = [0.6, 1];
export const def: Shot26 = {
  id: 'B04-SH03', N,
  cam: (L) => drift(CAM, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, low = ease(L, 22, 34), eyes = ease(L, 20, 26);
    const up = handsOf([AT[0] - 0.42, 0, AT[2] + 0.12], F, 1.86, 0.32, 0.24), down = handsOf(AT, F, 1.12, 0.3, 0.22);
    const h: [V3, V3] = [lerp3(up[0], down[0], low), lerp3(up[1], down[1], low)];
    paintFullonica(p, c, {mood: 'evening', t}, {
      stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
      room: (q, cc) => {
        rec(pr, 'customer', act(q, cc, {def: CUSTOMER, at: AT, facing: F, face: low > 0.5 ? 'suspicious' : 'happy', faceState: talkShot('B04-SH03', L, 'L13'), seed: 2671, t,
          look: [lerp(-0.4, 0.85, eyes), lerp(-0.45, 0, eyes)],
          arms: () => ({rArm: armTo(cc, h[0], 1, {open: true, drop: 0.25}), lArm: armTo(cc, h[1], -1, {open: true, drop: 0.25})})}));
        paintShirt(q, cc, h[0], h[1], 0.7, 31700, {lit: lerp(0.95, 0.6, low), warm: true});
      },
    });
  },
};
export const shot = makeShot(def);

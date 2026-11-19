import {paintFullonica, STALL_Z0} from '../fullonica';
import {paintTread, paintTreader, STALL1_AT, treader, WS} from '../r4-looks';
import {R4, SENIOR} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {treadKick} from '../acts26';
import {camKeys, rec, yc} from '../stage26';
import type {YCam} from '../../kit/ycam';

// B01-SH04 · G [0, 140) · hook crane (EDU-EP26-SHEET-R1 part A). Frame 0 high and close over the middle stall (TH-WC, `WS.C`), the senior
// treading from L4 one step per 15 f, double stomp on "ใช่ ฉี่" L78; the crane backs and down to the whole shop (TH-WA, `WS.A`) by L130,
// ease-in-out, held to L139. Morning light, no ribbons. The sheet line's eye/yaw/pitch/f are WS.C and WS.A (hy 900, the measured looks).
const N = 140;
// W5.2 deviation (acceptance G0 "feet in water fill the picture"): the sheet's L0 line (WS.C, pitch -36, f 860) centres the back wall and shows
// the senior whole; L0 tilts down to pitch -50 (f 900) so the tub and his treading feet fill the frame. Film to confirm.
const C0: YCam = yc(-0.175, 1.2, -2.08, 3, -55, 900, 900);
const lift = (k: ReturnType<typeof treadKick>, side: 'l' | 'r') => Math.min(1, (k?.[side]?.hip ?? 0) / 26);
export const def: Shot26 = {
  id: 'B01-SH04', N,
  cam: (L) => camKeys([[0, C0], [130, WS.A]], L),
  paint: (p, L, c, pr) => {
    const t = L / 30, stomp = L >= 78 && L < 86 ? {r: {hip: 30, knee: 36}} : undefined; // the double stomp: a hard right then left
    const kick = L >= 86 && L < 92 ? {l: {hip: 30, knee: 36}} : stomp ?? treadKick(L, 4, 15);
    paintFullonica(p, c, {mood: 'morning'}, {
      stallLiquidFrom: [STALL_Z0, STALL1_AT[2] - 0.03, STALL_Z0],
      inStalls: (q, cc) => rec(pr, 'senior', paintTreader(q, cc, {...treader(SENIOR, 'happy', 2611), t, fig: {legKick: kick}})),
      onLiquid: (q, cc, k) => { if (k === 1) paintTread(q, cc, 1, {mood: 'morning'}, R4.skinSenior, {l: lift(kick, 'l'), r: lift(kick, 'r')}); },
    });
  },
};
export const shot = makeShot(def);

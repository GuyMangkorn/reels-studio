import type {V3} from '../../kit/space';
import {MAT, ORDER_O1, slotX} from '../mats';
import {frac, lerp} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef, type MatPlace} from '../stage';

// B03-SH03 · G 1163-1205 (42 f) · lay the row, one step per mat (W-MATS 1; EDU-EP19-SHEETS-R3, camera R1). High diagonal from the swing end. l 0-18:
// the 13 mats slap down in four quick beats (l 0, 5, 10, 15: slots 0-3, 4-6, 7-9, 10-12), each dropping 0.25 m in 3 f, order O1. l 18-42: GIRL
// (back view, walking away) hops from the swing side onto slot 0 and on to slot 12, one hop per mat (P01 + lift arcs, time-lapse), a damp
// footprint mark appearing on each mat she lands on.
const N = 42;
const M = sheetMove([-1.8, 0, 0], [72, 72], [5.0, 4.6], 2.8, {f: 900, hy: 700, pitch: [-22, -22]});
const BEAT = (i: number) => (i < 4 ? 0 : i < 7 ? 5 : i < 10 ? 10 : 15);
/** Hop stops: the 13 slot centres (she is off frame while the mats land and appears on slot 0 at l 18: time-lapse; starting beside the swing
 *  end put her cropped huge in the near corner of this high vantage). */
const STOPS = ORDER_O1.map((_, i) => slotX(i));
const hop = (L: number) => frac(L, 18, 42) * (STOPS.length - 1);

export const B03_SH03: FieldShotDef = {
  id: 'B03-SH03', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const q = hop(L), i = Math.min(STOPS.length - 2, Math.floor(q)), f = q - i;
    const x = lerp(STOPS[i], STOPS[i + 1], f), lift = L >= 18 && L < 42 ? 0.14 * Math.sin(Math.PI * f) : 0;
    const matList: MatPlace[] = ORDER_O1.flatMap((color, k) => {
      const b = BEAT(k);
      if (L < b) return [];
      const y = 0.25 * (1 - frac(L, b, b + 3)) ** 2, landed = L >= 18 && q >= k - 0.5;
      return [{at: [slotX(k), 0, 0] as V3, color, y, print: landed ? 0.6 : undefined}];
    });
    return {sun: 'B03' as const, t: L / 30, stack: false, matList,
      ...(L < 18 ? {} : {girl: {at: [x, 0, 0] as V3, view: 'back', pose: 'P01', face: 'happy', fig: {lift: lift + (L >= 18 ? MAT.thick : 0)}, shadow: lift > 0.04 ? (false as const) : undefined}})};
  },
};
export const shot = makeShot(B03_SH03);

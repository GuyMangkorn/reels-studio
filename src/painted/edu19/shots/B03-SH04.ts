import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {ORDER_O1, ORDER_O2, slotX, type MatColor} from '../mats';
import {ease, frac, lerp, matCarry} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef, type MatPlace} from '../stage';

// B03-SH04 · G 1205-1235 (30 f) · Mum shuffles (W-MATS 2; EDU-EP19-SHEETS-R3, camera R1, same vantage, push continues). MUM (`new:
// crouch-swap-mats`, motion19.ts; line coiled, not drawn) crouched beside slot 3 lifts slot 3 and carries it to slot 5 while slot 5 slides to
// slot 3 (l 0-15, time-compressed); then a time-cut flicker (l 16-19: O2 and the swapped O1 alternate per frame, MUM gone) to the finished order
// O2 (l 20-30). The row stays straight on z 0; the footprint marks travel with their mats (every mat carries one).
const N = 30;
const M = sheetMove([-1.8, 0, 0], [72, 72], [4.6, 4.4], 2.8, {f: 900, hy: 700, pitch: [-22, -22]});
const MUM0: V3 = [-2.7, 0, 0.5];
const swapped = (): MatColor[] => { const o = [...ORDER_O1]; [o[3], o[5]] = [o[5], o[3]]; return o; };

export const B03_SH04: FieldShotDef = {
  id: 'B03-SH04', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const base = {sun: 'B03' as const, t: L / 30, stack: false};
    if (L >= 16) {
      const o2 = L >= 20 || L % 2 === 0;
      return {...base, mats: {order: o2 ? ORDER_O2 : swapped(), prints: 0.6}};
    }
    const c = sheetCam(M, L, N), u = ease(frac(L, 1, 14)), arc = Math.sin(Math.PI * u);
    const m3: V3 = [lerp(slotX(3), slotX(5), u), 0, 0.12 * arc], m5: V3 = [lerp(slotX(5), slotX(3), u), 0, -0.1 * arc];
    const matList: MatPlace[] = ORDER_O1.map((color, k) =>
      k === 3 ? {at: m3, color, y: 0.32 * arc, print: 0.6} : k === 5 ? {at: m5, color, y: 0.04 * arc, print: 0.6} : {at: [slotX(k), 0, 0] as V3, color, print: 0.6});
    const mum: V3 = [lerp(MUM0[0], slotX(5), u), 0, MUM0[2]], hold = camPoint(c, [m3[0], 0.32 * arc + 0.02, m3[2] + 0.3]);
    // Fix round 1 (user 2026-11-16, "about to lift the mat she faces the wrong side"): from this vantage the row (and the mat she lifts, -z of her)
    // lies to screen LEFT of MUM, so she works it in LEFT profile, facing the mats; she shuffles sideways along the row.
    return {...base, matList, mum: {at: mum, view: 'left', pose: 'P01', face: 'neutral', fig: matCarry(c, mum, 'left', hold, 1 - 0.4 * arc)}};
  },
};
export const shot = makeShot(B03_SH04);

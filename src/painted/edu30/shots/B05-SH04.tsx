import {emuWingWave, EMU_POSES} from '../emu';
import {paintEmu} from '../flock';
import {sunOf, paintPaddockScene} from '../paddock';
import {fenceLine} from '../vantage';
import {camLine, makeShot, type Shot30} from '../shot';
import type {YCam} from '../../kit/ycam';

// B05-SH04 (Boss T30, 2026-11-20): the reverse across the wire from the track verge. EMU-HERO waves the truck off ("ไว้มาใหม่นะ!"): T15 `emuWingWave` (front three-quarter, wing swings,
// T07 `talkBeak` onsets L 6, 13, 21, 28), head toward screen right. F2, F3, F4 watch the departed truck, heads turned +0.5, still. Birds paint before the fence (`cast`), so no body
// pixel is in front of the wire. No truck in frame. Same light and tint as B05-SH03.
const N = 46, SHOT = 'B05-SH04', LIGHT = 1;
const A = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860}), B = camLine({eye: [-0.25, 1.35, 7.7], yaw: -4, pitch: 0, f: 950, hy: 860});
const ease = (u: number) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
const CAM = (L: number): YCam => { const u = ease(L / 45), m = (a: number, b: number) => a + (b - a) * u; return {...A, x: m(A.x, B.x), z: m(A.z, B.z), yaw: m(A.yaw, B.yaw)}; };

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = sunOf(LIGHT);
    paintPaddockScene(p, c, {light: LIGHT, eaten: 0.7, stubble: 0.4, wire: {wireW: 2.5, wireCol: '#3e3226'}}, () => {
      // T08 fence rule z for F2 (-1.4), F3 (0.5), F4 (1.4); the hero and the fifth bird (0.95, back row, as B05-SH03) stand with them
      [...fenceLine(5)].sort((a, b) => a.at[2] - b.at[2] || a.at[0] - b.at[0]).forEach((m) => {
        if (m.hero) {
          const a = paintEmu(p, c, {...m, pose: emuWingWave(L)}, {sun, lod: 'near'});
          pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
          const tip = a.pt('wingTipL');
          if (tip) pr?.lead('wingTip (x = tip x, top = bottom = tip y)', {top: tip[1], bottom: tip[1], x: tip[0]});
        } else paintEmu(p, c, {...m, pose: EMU_POSES.stand({headYaw: 0.5})}, {sun, lod: 'far'});   // render budget, see B05-SH03
      });
    });
  },
  reel: () => ({strength: 1, tint: 'cool', tintAmount: 1, tintMix: 1, pop: 0}),
};
export const shot = makeShot(def);

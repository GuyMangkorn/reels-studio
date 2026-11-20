import type {V3} from '../../kit/space';
import {wFill} from '../../kit/world';
import {camPoint, type YCam} from '../../kit/ycam';
import {GUNNER1, GUNNER2, MEREDITH, paintCrew, paintCrewPose} from '../cast';
import {paintPaddockScene} from '../paddock';
import {buildLewisGun, paintLewisPanTicks, paintTruckRig, placeBuild, truckState} from '../props';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B02-SH04 (Boss T21, 2026-11-20): inspection line-up: exactly three men (MEREDITH saluting L 2-28 through T12, GUNNER-1 and GUNNER-2 `P01`, all neutral) at z 12.6 facing +z, the
// parked truck (T14, no riders, no gear) behind them, a canvas sheet at z 13.4 with the two Lewis guns lying on it (T13, no tripod, barrels +x, pans on). The camera trucks along the line
// (L 28-44), holds, then tilts down onto the guns (L 66-86), ease-in-out each move. Space P (T09), default newsreel grade.
const N = 98, SHOT = 'B02-SH04';
const M: V3 = [-8.5, 0, 12.6], G1P: V3 = [-7.3, 0, 12.6], G2P: V3 = [-6.1, 0, 12.6];
const cam = (eye: V3, yaw: number, pitch = 0) => camLine({eye, yaw, pitch, f: 900, hy: 860});
const K0 = cam([-8.5, 1.3, 15.2], 0), K1 = cam([-6.7, 1.3, 15.2], 2), K2 = cam([-7.2, 1.3, 15.2], 0, -30);
const ease = (u: number) => { const t = Math.max(0, Math.min(1, u)); return t * t * (3 - 2 * t); };
const mix = (a: YCam, b: YCam, u: number): YCam => ({...a, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u, yaw: a.yaw + (b.yaw - a.yaw) * u, pitch: (a.pitch ?? 0) + ((b.pitch ?? 0) - (a.pitch ?? 0)) * u});
const CAM = (L: number): YCam => (L <= 28 ? K0 : L <= 44 ? mix(K0, K1, ease((L - 28) / 16)) : L <= 66 ? K1 : L <= 86 ? mix(K1, K2, ease((L - 66) / 20)) : K2);

// Guns lie on the sheet with the receiver bottom (0.05 m under the tripod-head height 0.56) on the canvas at y 0.1 (T13 row), heading 0 = barrels +x.
const GUN_Y = 0.1 - (0.56 - 0.05);
const G1: V3 = [-7.8, GUN_Y, 13.4], G2: V3 = [-6.6, GUN_Y, 13.4];
const SHEET: V3[] = [[-8.5, 0.012, 12.8], [-5.9, 0.012, 12.8], [-5.9, 0.012, 14.0], [-8.5, 0.012, 14.0]];

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const st = truckState(SHOT, L)!;
    paintPaddockScene(p, c, {light: 0, eaten: 0.4});
    paintTruckRig(p, c, {centre: st.centre, dir: st.dir, riders: 'none', gear: 'none', wheelTurn: st.wheelTurn, t: L / 30, seed: 21400});
    const g2 = paintCrew(p, c, GUNNER2, G2P, {pose: 'P01', t: 1.2, seed: 34300, hat: 'slouch', upLeft: true});
    const g1 = paintCrew(p, c, GUNNER1, G1P, {pose: 'P01', t: 1.2, seed: 34200, hat: 'slouch', upLeft: true});
    const m = paintCrewPose(p, c, MEREDITH, M, {pose: 'salute', L, seed: 34100});
    wFill(p, c, 21500, '#8a8160', SHEET);
    for (const [k, g] of [[0, G1], [1, G2]] as const) {
      placeBuild(p, c, buildLewisGun({tripod: false, elev: 0}), g, 0, {seed: 21600 + k * 10, shadowOp: 0});
      paintLewisPanTicks(p, c, 21620 + k * 10, g, 0, 0, {elev: 0});
    }
    if (m) pr?.lead('MEREDITH', {top: m.top, bottom: m.bottom, x: m.head[0]});
    if (g1) pr?.lead('GUNNER-1', {top: g1.top, bottom: g1.bottom, x: g1.head[0]});
    if (g2) pr?.lead('GUNNER-2', {top: g2.top, bottom: g2.bottom, x: g2.head[0]});
    for (const [name, g] of [['G1', G1], ['G2', G2]] as const) {
      const q = camPoint(c, [g[0], g[1] + 0.56, g[2]]);   // the gun's centre (tripod-head height)
      if (q) pr?.lead(`${name} gun`, {top: q[1], bottom: q[1], x: q[0]});
    }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

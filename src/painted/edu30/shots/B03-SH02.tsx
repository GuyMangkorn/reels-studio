import {GUNFIRE_PRESETS, paintCasings, paintSmoke, type CasingSpec} from '../../kit/gunfire';
import type {V3} from '../../kit/space';
import {camDist} from '../../kit/ycam';
import {GUNNER1, GUNNER2, MEREDITH, paintCrew, paintSeatedGunner} from '../cast';
import {burst, paintBurstDust, paintFlock} from '../flock';
import {paintPaddockScene, SUN} from '../paddock';
import {buildLewisGun, lewisAnchors, lewisPanTurn, lewisRecoil, paintLewisPanTicks, placeBuild} from '../props';
import {camLine, makeShot, type Shot30} from '../shot';

// B03-SH02 (Boss T25, 2026-11-20): the only top-down shot, 40 birds burst into six groups (T08 `burst`, dust per group). Space P, light 0, eaten 0.4, no shake, no overscan.
// Camera eye (0, 18 -> 20, 10) linear over L 0-50. Gun and the three crew small at the bottom, still (the B03-SH01 marks, back views); the casings, smoke and rounds continue
// B03-SH01 through its local clock L + 72 (casings still falling at L 0, TF28 smoke drift +x, seed 7100). Only the 40 birds and their dust are painted (no far flock).
const N = 51, OFF = 72;
const CAM = (L: number) => camLine({eye: [0, 18 + (2 * Math.max(0, Math.min(50, L))) / 50, 10], yaw: 0, pitch: -48, f: 800, hy: 860});
const PRE = GUNFIRE_PRESETS.B03_SH01, ROUNDS = [...PRE.rounds];
const G1: V3 = [0, 0, 0], H = -Math.PI / 2, SEAT: V3 = [0, 0, 0.85], MER: V3 = [-0.6, 0, 1.05], G2P: V3 = [0.75, 0, 0.45], DIR: V3 = [0, 0, -1], T = 1.2;
const SMOKE = {...PRE.smoke, drift: [0.25, 0.06, 0] as [number, number, number], seed: 7100};
const CASINGS: CasingSpec = {port: lewisAnchors(G1, H).port, side: 1, seed: 8100, dir: DIR, ground: () => 0, box: {x: [0.8, 1.5], z: [-0.2, 0.4]}};

export const def: Shot30 = {
  id: 'B03-SH02', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning, S = L + OFF, rec = lewisRecoil(S, ROUNDS), a = lewisAnchors(G1, H, {recoil: rec});
    paintPaddockScene(p, c, {light: 0, eaten: 0.4}, () => {
      paintFlock(p, c, burst(L), {sun});
      paintBurstDust(p, c, L);
    });
    paintCasings(p, c, S, ROUNDS, CASINGS);
    const crew: {at: V3; f: () => void}[] = [
      {at: MER, f: () => { const m = paintCrew(p, c, MEREDITH, MER, {view: 'back', pose: 'P01', t: T, seed: 33100, hat: 'slouch'}); if (m) pr?.lead('MEREDITH', {top: m.top, bottom: m.bottom, x: m.head[0]}); }},
      {at: SEAT, f: () => { paintSeatedGunner(p, c, GUNNER1, SEAT, {view: 'back', grip: a.grip, stock: a.stock, jolt: 0, t: T, seed: 33200}); }},
      {at: G1, f: () => {
        placeBuild(p, c, buildLewisGun({recoil: rec}), G1, H, {seed: 35300, sun});
        paintLewisPanTicks(p, c, 35400, G1, H, lewisPanTurn(S, ROUNDS), {recoil: rec});
      }},
      {at: G2P, f: () => { paintCrew(p, c, GUNNER2, G2P, {view: 'back', pose: 'P01', t: T, seed: 33400, hat: 'slouch'}); }},
    ];
    crew.sort((x, y) => camDist(c, y.at) - camDist(c, x.at)).forEach((it) => it.f());
    paintSmoke(p, c, a.muzzle, S, ROUNDS, {...SMOKE, fadeAfter: 45});
  },
  reel: () => ({strength: 1, tint: 'warm', tintAmount: 1}),
};
export const shot = makeShot(def);

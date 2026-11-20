import {GUNFIRE_PRESETS, blastLean, paintBlast, paintCasings, paintMuzzleFlash, paintSmoke, paintSpurts, popFor, roundPhase, shakeAt, strikePoints, type CasingSpec} from '../../kit/gunfire';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {GUNNER1, paintSeatedGunner} from '../cast';
import {flockIn, footEvents, paintFlock, paintPuffs, scatter} from '../flock';
import {paintPaddockScene, SUN} from '../paddock';
import {buildLewisGun, lewisAnchors, lewisPanTurn, lewisRecoil, paintLewisPanTicks, placeBuild} from '../props';
import {camLine, makeShot, type Shot30} from '../shot';

// B03-SH01 (Boss T24, 2026-11-20): over GUNNER-1's shoulder, the first full-frame firing beat (VD30-11): 23 rounds every 3 frames from local 2 to 68,
// the flock startling, bunching and bolting (T08 `scatter`), gunner jolt (T11), Lewis gun recoil and pan (T13), flash, smoke, blast, casings and
// strike spurts (T04, T05), the VD30-11 shake on the plate canvas (T34 hook), bolt open from local 70 (no flash, shake 0).
const N = 72;
const CAM = camLine({eye: [0.4, 1.0, 1.65], yaw: -3, pitch: 0, f: 900, hy: 860});
const PRE = GUNFIRE_PRESETS.B03_SH01, ROUNDS = [...PRE.rounds];
const G1: V3 = [0, 0, 0], H = -Math.PI / 2, SEAT: V3 = [0, 0, 0.85], DIR: V3 = [0, 0, -1];
const MUZZLE0 = lewisAnchors(G1, H).muzzle;
const SMOKE = {...PRE.smoke, seed: 7100}, SHAKE = {...PRE.shake, seed: 7500, stop: 70};
const CASINGS: CasingSpec = {port: lewisAnchors(G1, H).port, side: 1, seed: 8100, dir: DIR, ground: () => 0, box: {x: [0.8, 1.5], z: [-0.2, 0.4]}};
const sh = (a: number) => { const v = Math.sin(a * 12.9898) * 43758.5453; return v - Math.floor(v); };

/** Near stalks 1 to 3 m ahead of the muzzle and a few wider, below the horizon on the right and left. */
const STALKS: V3[] = Array.from({length: 22}, (_, i) => [-2.2 + 0.2 * i + (sh(i) - 0.5) * 0.15, 0, -1.7 - 1.9 * sh(i * 3.7 + 1)] as V3);

/** Strike points: round i at z -14 - 12 i / 22, x seeded -6..+6, never within 4 m of a bird at any frame of the shot. */
let strikeMemo: V3[] | null = null;
export const strikesB03 = (): V3[] => {
  if (strikeMemo) return strikeMemo;
  const avoid: V3[] = [];
  for (let L = 0; L < N; L += 2) scatter(L).forEach((m) => avoid.push(m.at));
  flockIn(31000, 40, [-30, 30], [-60, -30], {mix: [0.5, 0, 0.5]}).forEach((m) => avoid.push(m.at));
  return (strikeMemo = strikePoints({count: 23, seed: 9100, minDist: 4, x: [-6, 6], z: (i) => -14 - (12 * i) / 22, ground: () => 0, avoid}).points);
};

/** Dust kicked up by the bolting birds: the footfalls of the last 12 frames (T08 footEvents on the scatter states). */
const boltDust = (p: Parameters<Shot30['paint']>[0], c: Parameters<Shot30['paint']>[2], L: number) => {
  if (L < 40) return;
  const st: Record<number, ReturnType<typeof scatter>> = {};
  for (let f = Math.max(0, L - 13); f <= L; f++) st[f] = scatter(f);
  st[L].forEach((_, i) => {
    const s = (f: number) => { const m = st[f]?.[i]; return m && f >= 40 && m.pose.walk !== undefined ? {at: m.at, heading: m.heading, ph: m.pose.walk} : null; };
    paintPuffs(p, c, 36700 + i * 11, footEvents(s, L, 12), 0.25);
  });
};

export const def: Shot30 = {
  id: 'B03-SH01', N, paper: '#efe6d0', overscan: true,
  cam: () => CAM,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning, rec = lewisRecoil(L, ROUNDS), a = lewisAnchors(G1, H, {recoil: rec}), ph = roundPhase(L, ROUNDS);
    const jolt = ph.n < 0 ? 0 : ph.k === 0 ? 1 : ph.k === 1 ? 0.5 : 0;
    const open = L >= 70;   // bolt open: no flash, smoke hangs
    const fire = open ? [] : ROUNDS;
    paintPaddockScene(p, c, {
      light: 0, eaten: 0.4, far: {n: 160, x: [-120, 120], z: [-200, -80]}, stalks: STALKS,
      lean: (x, z) => blastLean(L, ROUNDS, Math.hypot(x - MUZZLE0[0], z - MUZZLE0[2])), leanFrom: MUZZLE0,
    }, () => {
      paintFlock(p, c, scatter(L), {sun});
      boltDust(p, c, L);
      paintSpurts(p, c, L, ROUNDS, {points: strikesB03(), kind: 'dust', h: [0.6, 1.2], seed: 9200});
    });
    paintBlast(p, c, a.muzzle, DIR, L, ROUNDS, {ground: 'wheat', seed: 7200});
    paintCasings(p, c, L, ROUNDS, CASINGS);
    placeBuild(p, c, buildLewisGun({recoil: rec}), G1, H, {seed: 35300, sun});
    paintLewisPanTicks(p, c, 35400, G1, H, lewisPanTurn(L, ROUNDS), {recoil: rec});
    paintSmoke(p, c, a.muzzle, L, ROUNDS, SMOKE);
    const g = paintSeatedGunner(p, c, GUNNER1, SEAT, {view: 'back', grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
    if (g) pr?.lead('GUNNER-1', {top: g.top, bottom: g.bottom, x: g.head[0]});
    paintMuzzleFlash(p, c, a.muzzle, DIR, L, fire, {halo: PRE.halo, seed: 7300});
    const mp = camPoint(c, a.muzzle);   // muzzle probe: the point through the stack camera
    if (mp) pr?.lead('muzzle', {top: mp[1], bottom: mp[1], x: mp[0]});
  },
  reel: (L) => ({strength: 1, tint: 'warm', tintAmount: 1, pop: popFor(L, ROUNDS)}),
  shake: (L) => shakeAt(L, ROUNDS, SHAKE),
};
export const shot = makeShot(def);

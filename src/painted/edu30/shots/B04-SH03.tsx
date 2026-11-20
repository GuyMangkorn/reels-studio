import {GUNFIRE_PRESETS, paintBlast, paintCasings, paintMuzzleFlash, paintSmoke, paintSpurts, paintSplash, popFor, roundPhase, shakeAt, strikePoints, type CasingSpec} from '../../kit/gunfire';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {GUNNER1, paintGunnerFists, paintSeatedGunner} from '../cast';
import {DAM, G1_AIM, overWater, paintDam, southBankY} from '../dam';
import {paintFlock, paintQueueFar, paintQueueWade, queue, queueAvoid, queueSplashes} from '../flock';
import {SUN} from '../paddock';
import {buildLewisGun, lewisAnchors, lewisPanTurn, lewisRecoil, paintLewisPanTicks, placeBuild} from '../props';
import {camLine, makeShot, type Shot30} from '../shot';

// B04-SH03 (Boss T27, 2026-11-20): low three-quarter on G1 from the water side, the full-frame firing beat (VD30-11): 11 rounds every 3 frames from local 10 to 40,
// flash + 260 px halation (no water mirror, TF20), mud blast, casings into the shallows or onto the slope (T05), strikes (mud on the rim, spouts in the shallows),
// the queue (T16: flinch, two hops with splashes at L 25, bunching at the front only) over the T10 dam, the right fist on the grip (T11, T36), recoil and pan (T13),
// the VD30-11 shake on the plate canvas (T34 hook) and everything stopping dead at local 42 (smoke and queue still move).
const N = 47;
const CAM = camLine({eye: [-6.3, 0.92, -5.75], yaw: 112, pitch: 0, f: 800, hy: 820});
const PRE = GUNFIRE_PRESETS.B04_SH03, ROUNDS = [...PRE.rounds];
const G1: V3 = [-5.6, 0.32, -5.0], H = 0, SEAT: V3 = [-6.2, 0.36, -4.75], DIR = G1_AIM.fire;
const SMOKE = {...PRE.smoke, seed: 7100}, SHAKE = {...PRE.shake, seed: 7500};
const A0 = lewisAnchors(G1, H);
const CASINGS: CasingSpec = {port: A0.port, side: 1, seed: 8300, dir: DIR, ground: (_x, z) => southBankY(z), water: {y: DAM.water, inside: overWater}};

/** Strike points: 11 points x walking -1.0 to +1.4 along the queue's line, z seeded -4.9..-5.6, never within 1.5 m of a bird at any frame (CAT02); in the water they sit on the water plane. */
let strikeMemo: ReturnType<typeof strikePoints> | null = null;
const strikes = () => strikeMemo ??= strikePoints({count: 11, seed: 9300, minDist: 1.5, x: (i) => -1 + (2.4 * i) / 10, z: (_i, r) => -4.9 - 0.7 * r, ground: (_x, z) => southBankY(z), water: {y: DAM.water, inside: overWater}, avoid: queueAvoid('B04-SH03', N, 1)});

export const def: Shot30 = {
  id: 'B04-SH03', N, paper: '#efe6d0', overscan: true,
  cam: () => CAM,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning, rec = lewisRecoil(L, ROUNDS), a = lewisAnchors(G1, H, {recoil: rec}), ph = roundPhase(L, ROUNDS);
    const jolt = ph.n < 0 ? 0 : ph.k === 0 ? 1 : ph.k === 1 ? 0.5 : 0;
    const sk = strikes(), none = (pts: V3[], keep: boolean[]) => pts.map((pt, i) => (keep[i] ? pt : null));
    paintDam(p, c, 38000);
    paintQueueFar(p, c);
    paintFlock(p, c, queue(L, 'B04-SH03'), {sun, shadowOp: 45});
    paintQueueWade(p, c, L, 'B04-SH03');
    queueSplashes().forEach((s, k) => paintSplash(p, c, L, s.at, s.start, 36400 + k * 9));
    paintSpurts(p, c, L, ROUNDS, {points: none(sk.points, sk.wet.map((w) => !w)), kind: 'mud', h: [0.4, 0.9], seed: 9400});
    paintSpurts(p, c, L, ROUNDS, {points: none(sk.points, sk.wet), kind: 'spout', h: [0.4, 0.9], seed: 9500});
    paintBlast(p, c, a.muzzle, DIR, L, ROUNDS, {ground: 'mud', seed: 7200});
    paintCasings(p, c, L, ROUNDS, CASINGS);
    const gopts = {view: 'back' as const, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200};
    paintSeatedGunner(p, c, GUNNER1, SEAT, gopts);
    placeBuild(p, c, buildLewisGun({recoil: rec}), G1, H, {seed: 35300, sun});
    paintLewisPanTicks(p, c, 35400, G1, H, lewisPanTurn(L, ROUNDS), {recoil: rec});
    paintGunnerFists(p, c, GUNNER1, SEAT, gopts);
    paintSmoke(p, c, a.muzzle, L, ROUNDS, SMOKE);
    paintMuzzleFlash(p, c, a.muzzle, DIR, L, ROUNDS, {halo: PRE.halo, seed: 7300});
    const mp = camPoint(c, a.muzzle), rp = camPoint(c, a.port);   // probe leads: muzzle and receiver (port) through the stack camera
    if (mp) pr?.lead('muzzle', {top: mp[1], bottom: mp[1], x: mp[0]});
    if (rp) pr?.lead('receiver', {top: rp[1], bottom: rp[1], x: rp[0]});
  },
  reel: (L) => ({strength: 1, tint: 'warm', tintAmount: 1, pop: popFor(L, ROUNDS)}),
  shake: (L) => shakeAt(L, ROUNDS, SHAKE),
};
export const shot = makeShot(def);

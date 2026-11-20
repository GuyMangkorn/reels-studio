import {GUNFIRE_PRESETS, paintCasing, restingCasings, type CasingSpec} from '../../kit/gunfire';
import type {Painter} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {wFill} from '../../kit/world';
import {camPoint, type YCam} from '../../kit/ycam';
import {GUNNER1, paintGunnerFists, paintSeatedGunner, rackGunnerOpts, type GunnerOpts} from '../cast';
import {DAM, overWater, paintDam, southBankY} from '../dam';
import {SUN} from '../paddock';
import {buildLewisGun, lewisAnchors, lewisCock, lewisJamNudge, lewisPanTurn, paintLewisPanTicks, paintLewisPuff, placeBuild} from '../props';
import {camLine, makeShot, type Shot30} from '../shot';

// B04-SH06 (Boss T28, 2026-11-20): front three-quarter medium on GUNNER-1 at the dead gun, one practised rack and a groan (VD30-12/13). Camera eye (-4.6, 1.45, -3.9)
// yaw -57 -> eye (-4.68, 1.45, -3.95) yaw -55, ease-in-out over L 0-23 (T10 near slope, clearance 0.70-0.72 m). GUNNER-1 `cockingPull` + face keys on `front34` (T17),
// G1 with the `cock` keys (T13) and the pan ticks at the 11-round turn plus the 2 deg jam nudge (as B04-SH04), the jam wisp L 0-12, the spent casings of B04-SH03 at rest,
// GUNNER-2's spare pan at the left edge (no figure). MEREDITH and GUNNER-2 are at their withdrawal marks, not painted.
const N = 24;
const SEAT: V3 = [-6.2, 0.36, -4.75], GUN: V3 = [-5.6, 0.32, -5.0], HEAD = 0, SPARE_PAN: V3 = [-6.4, 0.75, -4.0];
const E0: V3 = [-4.6, 1.45, -3.9], E1: V3 = [-4.68, 1.45, -3.95];
const io = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
export const camAt = (L: number) => { const u = io(L / (N - 1)); return camLine({eye: [E0[0] + (E1[0] - E0[0]) * u, E0[1], E0[2] + (E1[2] - E0[2]) * u], yaw: -57 + 2 * u, pitch: -12, f: 950, hy: 800}); };
const JAM_TURN = lewisPanTurn(999, GUNFIRE_PRESETS.B04_SH03.rounds) + lewisJamNudge(99);

/** The B04-SH03 casing spec (rounds, port, water, slope): the same rest positions are laid static in B04-SH06 and B04-SH05. */
export const B04_CASINGS: CasingSpec = {
  port: lewisAnchors(GUN, HEAD).port, side: 1, seed: 8300, dir: [1, 0, 0],
  ground: (_x, z) => southBankY(z), water: {y: DAM.water, inside: overWater},
};
export const paintRestingCasings = (p: Painter, c: YCam, seed: number, skipNear = 0) => {
  restingCasings([...GUNFIRE_PRESETS.B04_SH03.rounds], B04_CASINGS).forEach((r, i) => {
    if (r.sunk || Math.hypot(r.pos[0] - c.x, r.pos[1] - c.y, r.pos[2] - c.z) < skipNear) return;
    paintCasing(p, c, r.pos, Math.PI * Math.round(i * 0.7), r.heading, seed + i * 3);
  });
};

/** A spare pan magazine lying flat (axis up): side, rim ellipse and top, plain fills. */
const paintSparePan = (p: Painter, c: YCam, at: V3, seed: number) => {
  const ring = (y: number, r: number): V3[] => Array.from({length: 18}, (_, k) => [at[0] + r * Math.cos((k / 18) * 6.2832), at[1] + y, at[2] + r * Math.sin((k / 18) * 6.2832)] as V3);
  wFill(p, c, seed, '#2b2a27', [...ring(0, 0.135), ...ring(0.044, 0.135).reverse()]);
  wFill(p, c, seed + 1, '#56544c', ring(0.044, 0.135));
  wFill(p, c, seed + 2, '#2b2a27', ring(0.046, 0.1));
};

export const rackAt = (L: number) => {
  const a = lewisAnchors(GUN, HEAD, {cock: lewisCock(L)}), cock = (k: number) => lewisAnchors(GUN, HEAD, {cock: k}).cock;
  return {a, opts: {...rackGunnerOpts(L, {cock, grip: a.grip, stock: a.stock}), view: 'front34', t: 1.2, seed: 33200} as GunnerOpts};
};
export const RACK_SEAT = SEAT;

export const def: Shot30 = {
  id: 'B04-SH06', N, paper: '#efe6d0',
  cam: camAt,
  paint: (p, L, c, pr) => {
    paintDam(p, c, 38000, {nearSlope: true});
    paintRestingCasings(p, c, 38600);
    paintSparePan(p, c, SPARE_PAN, 38700);
    const {a, opts} = rackAt(L);
    const g = paintSeatedGunner(p, c, GUNNER1, SEAT, opts);
    placeBuild(p, c, buildLewisGun({cock: lewisCock(L)}), GUN, HEAD, {seed: 33300, sun: SUN.morning});
    paintLewisPanTicks(p, c, 33400, GUN, HEAD, JAM_TURN, {});
    paintLewisPuff(p, c, a.port, 'B04-SH06', L);
    paintGunnerFists(p, c, GUNNER1, SEAT, opts);
    if (g) pr?.lead('GUNNER-1', {top: g.top, bottom: g.bottom, x: g.head[0]});
    const k = camPoint(c, a.cock);
    if (k) pr?.lead('handle', {top: k[1], bottom: k[1], x: k[0]});
  },
  reel: () => ({strength: 1, tint: 'warm', tintAmount: 1, pop: 0}),
};
export const shot = makeShot(def);

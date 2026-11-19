import {washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, ring, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {flatCircle, paintBox, paintSorted, sphereAt, wFill, wInk, type Box, type Item} from '../kit/world';
import {camPoint, camUnit, type YBody, type YCam} from '../kit/ycam';
import {GUNNER1, paintSeatedGunner} from './cast';
import {add, lerp, mul, newRig, nrm, paintBeast, type Build, type L3} from '../survival/beast';

// EDU-EP30 props (VD30-07, Film W3 look assets 2026-11-19; Boss hardens): `new: lewis-gun` and the bell tent as beast-loft builds (any yaw,
// soft look), `new: truck-1932` as world boxes and wheel discs. Dimensions are estimates (brief technical handoff): Lewis gun 1.28 m long,
// pan magazine 0.27 m across, axis 0.62 m over the ground on its low tripod; truck 5.2 x 2.0 m, cab roof 2.1 m, tray deck 1.1 m.

const SOFT: NonNullable<Build['look']> = {sub: 2, ring: 2, rim: '#d8ccb0', rimK: 0.22, edge: 0.45, far: 0.15};
export const GUN_PX = {metal: '#34332f', shroud: '#45443e', fin: '#5d5b53', wood: '#6e4b2c', mag: '#2b2a27', magRim: '#56544c'} as const;

export type LewisRecoil = {back: number; rise: number};
type GunOpts = {elev?: number; tripod?: boolean; recoil?: LewisRecoil; cock?: number};
/** Pan magazine turn per round (rad): 360 degrees over the 47-round pan = 7.66 degrees (VD30-11 step 3). */
export const PAN_STEP = (7.66 * Math.PI) / 180;
const COCK_TRAVEL = 0.12, COCK_S = -0.17, PAN_TOP = 0.022;   // handle travel back along -dir (m); handle rest position along the barrel from the tripod head; pan half thickness (m)
/** Gun-local frame shared by the build and `lewisAnchors`: +x barrel, +y up, local z = the gun's left (paintBeast `l`). The gun body pitches up
 *  by `recoil.rise` about the tripod head `pv` and slides `recoil.back` along -dir; the tripod legs stay on `pv` and their feet. */
const gunFrame = (o: GunOpts) => {
  const e = (o.elev ?? 0.04) + (o.recoil?.rise ?? 0), pv: L3 = [0, 0.56, 0], ax: L3 = [Math.cos(e), Math.sin(e), 0], up: L3 = [-Math.sin(e), Math.cos(e), 0];
  const org = add(pv, mul(ax, -(o.recoil?.back ?? 0)));
  const A = (s: number, h = 0, w = 0): L3 => add(add(add(org, mul(ax, s)), mul(up, h)), [0, 0, w]);
  return {pv, ax, up, A, mc: A(-0.18, 0.075), port: A(-0.08, -0.02, -0.05), cock: (k = 0) => A(COCK_S - COCK_TRAVEL * k, -0.03, -0.09)};
};

/** Lewis gun on its low tripod. Local frame: +x along the barrel (muzzle), +y up, origin on the ground under the tripod head. `elev` raises the
 *  barrel (rad); `tripod` false = the gun alone (truck pedestal). `recoil` is `lewisRecoil` (body only, tripod feet fixed); `cock` 0..1 draws the cocking handle (absent = not drawn). Anchors: muzzle,
 *  grip, mag (pan centre), stock, port, cock. */
export const buildLewisGun = (o: GunOpts = {}): Build => {
  const R = newRig(), F = gunFrame(o), {pv, up, A, mc} = F;
  const g = R.bone('gun', null);
  R.loft(g, {m: 10, cap: true, col: () => GUN_PX.wood, keys: [{p: A(-0.66, -0.02), a: 0.022, b: 0.06}, {p: A(-0.5, -0.005), a: 0.022, b: 0.045}, {p: A(-0.34, 0.0), a: 0.024, b: 0.034}]});   // butt stock
  R.loft(g, {m: 10, cap: true, col: () => GUN_PX.metal, keys: [{p: A(-0.36, 0), a: 0.034, b: 0.045}, {p: A(-0.2, 0.005), a: 0.04, b: 0.05}, {p: A(-0.04, 0), a: 0.04, b: 0.046}]});   // receiver
  R.loft(g, {m: 12, cap: true, col: (u) => (Math.floor(u * 14) % 2 ? GUN_PX.fin : GUN_PX.shroud), keys: [{p: A(-0.05, 0), a: 0.058, b: 0.058}, {p: A(0.3, 0), a: 0.058, b: 0.058}, {p: A(0.56, 0), a: 0.054, b: 0.054}, {p: A(0.6, 0), a: 0.03, b: 0.03}]});   // finned shroud
  R.loft(g, {m: 8, cap: true, col: () => GUN_PX.metal, keys: [{p: A(0.6, 0), a: 0.016, b: 0.016}, {p: A(0.66, 0), a: 0.014, b: 0.014}]});   // muzzle
  R.loft(g, {m: 8, cap: true, col: () => GUN_PX.wood, keys: [{p: A(-0.28, -0.03), a: 0.016, b: 0.02}, {p: A(-0.3, -0.1), a: 0.017, b: 0.022}, {p: A(-0.31, -0.14), a: 0.016, b: 0.02}]});   // grip
  // pan magazine: a flat drum on top of the receiver (its axis along `up`), dark with a lighter rim
  R.loft(g, {m: 18, cap: true, col: (u) => (u < 0.2 || u > 0.8 ? GUN_PX.magRim : GUN_PX.mag), keys: [{p: add(mc, mul(up, -0.022)), a: 0.135, b: 0.135}, {p: add(mc, mul(up, 0.0)), a: 0.137, b: 0.137}, {p: add(mc, mul(up, 0.022)), a: 0.135, b: 0.135}]});
  if (o.tripod !== false) for (const [fx, fz] of [[0.42, 0.34], [0.42, -0.34], [-0.52, 0]] as const) {
    R.loft(g, {m: 6, col: () => GUN_PX.metal, keys: [{p: pv, a: 0.016, b: 0.016}, {p: lerp(pv, [fx, 0.02, fz], 0.5), a: 0.014, b: 0.014}, {p: [fx, 0.02, fz], a: 0.012, b: 0.012}]});
  }
  R.B.shadow = {s: -0.05, l: 0, rs: 0.55, rl: 0.3};
  R.B.feet = [];
  const handle = F.cock(o.cock ?? 0);
  if (o.cock !== undefined) {   // cocking handle: a short stem out of the receiver's right side and a round knob
    R.loft(g, {m: 8, cap: true, col: () => GUN_PX.metal, keys: [{p: A(COCK_S - COCK_TRAVEL * o.cock, -0.03, -0.045), a: 0.006, b: 0.006}, {p: handle, a: 0.007, b: 0.007}]});
    R.loft(g, {m: 8, cap: true, col: () => GUN_PX.fin, keys: [{p: add(handle, [0, 0, 0.012]), a: 0.015, b: 0.015}, {p: add(handle, [0, 0, -0.012]), a: 0.015, b: 0.015}]});
  }
  R.B.anchors = {muzzle: A(0.66), grip: A(-0.3, -0.12), mag: mc, stock: A(-0.6, -0.02), port: F.port, cock: handle};
  R.B.look = SOFT;
  return R.B;
};

/** Pan ticks (T13): a long and a short pale mark on the pan top that turn with the pan, so each round's step shows. `magTurn` in rad (`lewisPanTurn`,
 *  anticlockwise seen from above). Painted in world space after the gun (a loft cap would hide the far half of a tick by centre-depth sort), only
 *  while the pan top faces the lens. `at`, `heading`, `o` as `lewisAnchors`. */
export const paintLewisPanTicks = (p: Painter, c: YCam, seed: number, at: V3, heading: number, magTurn: number, o: {elev?: number; recoil?: LewisRecoil} = {}) => {
  const F = gunFrame(o), fx = Math.cos(heading), fz = Math.sin(heading), lx = Math.sin(heading), lz = -Math.cos(heading);
  const W = ([s, y, l]: L3): V3 => [at[0] + s * fx + l * lx, at[1] + y, at[2] + s * fz + l * lz];
  const top = add(F.mc, mul(F.up, PAN_TOP + 0.0015)), wt = W(top), wu = W(add(top, F.up));
  if ((wu[0] - wt[0]) * (c.x - wt[0]) + (wu[1] - wt[1]) * (c.y - wt[1]) + (wu[2] - wt[2]) * (c.z - wt[2]) <= 0) return;   // pan top faces away from the lens
  const ticks = [{a0: 0, r0: 0.035, r1: 0.125, hw: 0.008, col: '#b5af98'}, {a0: Math.PI, r0: 0.075, r1: 0.125, hw: 0.006, col: '#8c8775'}];
  ticks.forEach((t, i) => {
    const a = magTurn + t.a0, d = add(mul(F.ax, Math.cos(a)), [0, 0, Math.sin(a)]), n = add(mul(F.ax, -Math.sin(a)), [0, 0, Math.cos(a)]);
    const P = (r: number, w: number): V3 => W(add(top, add(mul(d, r), mul(n, w))));
    wFill(p, c, seed + i, t.col, [P(t.r0, -t.hw), P(t.r1, -t.hw), P(t.r1, t.hw), P(t.r0, t.hw)]);
  });
};

/** World anchors of the Lewis gun placed by `placeBuild(p, c, buildLewisGun(o), at, heading)` (same transform as paintBeast, no pitch or bank):
 *  `muzzle`, `port` (ejection port, receiver right), `pan` (pan centre, top face), `grip` (pistol grip mid), `stock` (stock comb mid), `cock`
 *  (cocking-handle knob, receiver right), plus the unit barrel direction `dir`. `o.recoil` / `o.cock` as in `buildLewisGun`. */
export const lewisAnchors = (at: V3, heading: number, o: {elev?: number; recoil?: LewisRecoil; cock?: number} = {}) => {
  const F = gunFrame(o), fx = Math.cos(heading), fz = Math.sin(heading), lx = Math.sin(heading), lz = -Math.cos(heading);
  const W = ([s, y, l]: L3): V3 => [at[0] + s * fx + l * lx, at[1] + y, at[2] + s * fz + l * lz];
  const d = F.ax;
  return {muzzle: W(F.A(0.66)), port: W(F.port), pan: W(add(F.mc, mul(F.up, PAN_TOP))), grip: W(F.A(-0.3, -0.12)), stock: W(F.A(-0.6, -0.02)), cock: W(F.cock(o.cock ?? 0)),
    dir: [d[0] * fx + d[2] * lx, d[1], d[0] * fz + d[2] * lz] as L3};
};

/** Per-round recoil of the gun body (VD30-11 step 3): k = frames since the latest round frame in `rounds` (k 0: 5 mm back and 0.3 deg up, k 1: half,
 *  k >= 2 or before the first round: none). The tripod feet never move. `rise` in rad. */
export const lewisRecoil = (L: number, rounds: readonly number[]): LewisRecoil => {
  let last = -1;
  for (const r of rounds) if (r <= L && r > last) last = r;
  const k = last < 0 ? 2 : L - last;
  return k === 0 ? {back: 0.005, rise: (0.3 * Math.PI) / 180} : k === 1 ? {back: 0.0025, rise: (0.15 * Math.PI) / 180} : {back: 0, rise: 0};
};
/** Pan turn (rad) at frame L: one `PAN_STEP` per round frame <= L (the step lands on the round frame). */
export const lewisPanTurn = (L: number, rounds: readonly number[]): number => PAN_STEP * rounds.filter((r) => r <= L).length;

const easeOut = (u: number) => 1 - (1 - u) * (1 - u), easeIn = (u: number) => u * u, unit = (v: number) => Math.max(0, Math.min(1, v));
/** B04-SH04 jam nudge (rad, added to the 11-round pan turn): +2 degrees over local 4..11 (ease-out), then still. */
export const lewisJamNudge = (L: number): number => ((2 * Math.PI) / 180) * easeOut(unit((L - 4) / 7));
/** B04-SH06 cocking rack, `cock` 0..1: local 0 -> 3 ease-out to 1, 3 -> 6 ease-in back to 0. */
export const lewisCock = (L: number): number => (L <= 3 ? easeOut(unit(L / 3)) : 1 - easeIn(unit((L - 3) / 3)));

/** The jam smoke from the port. `shot` 'B04-SH04': local 12..21, three circles r 0.02 -> 0.09 m, #8f8a80, alpha 0.7 -> 0, rising 0.05 m and drifting
 *  0.04 m toward +z (the three are spread 0 / +0.025 / -0.025 m along x as they grow). 'B04-SH06': local 0..12, one wisp r 0.05 m, alpha 0.3 -> 0,
 *  rising 0.06 m. `port` is the world port anchor. Plain flat fills. */
export const paintLewisPuff = (p: Painter, c: YCam, port: V3, shot: 'B04-SH04' | 'B04-SH06', L: number) => {
  const puff = shot === 'B04-SH04', u = puff ? (L - 12) / 9 : L / 12;
  if (u < 0 || u > 1) return;
  const specs = puff ? [0, 0.025, -0.025].map((dx) => ({dx, r: 0.02 + 0.07 * u, a: 0.7 * (1 - u), up: 0.05 * u, dz: 0.04 * u})) : [{dx: 0, r: 0.05, a: 0.3 * (1 - u), up: 0.06 * u, dz: 0}];
  specs.forEach((s) => {
    const w: V3 = [port[0] + s.dx * u, port[1] + s.up, port[2] + s.dz], q = camPoint(c, w);
    if (!q || s.a <= 0.004) return;
    p.layer(s.a, 0).flat('#8f8a80', ring(q[0], q[1], s.r * camUnit(c, w), s.r * camUnit(c, w), 16));
  });
};

/** Bell tent: canvas cone on a short wall, a dark door slit and a pole tip. Local: origin at the centre of the floor. */
export const buildBellTent = (o: {r?: number; h?: number; canvas?: string} = {}): Build => {
  const R = newRig(), r = o.r ?? 1.5, h = o.h ?? 2.6, cv = o.canvas ?? '#d6c9aa', b = R.bone('tent', null);
  R.loft(b, {m: 18, col: (u) => mixColor(cv, '#8a7a5c', u < 0.25 ? 0.12 : 0), keys: [{p: [0, 0, 0], a: r, b: r}, {p: [0, h * 0.4, 0], a: r * 0.97, b: r * 0.97}, {p: [0, h * 0.5, 0], a: r * 0.8, b: r * 0.8}, {p: [0, h * 0.85, 0], a: r * 0.18, b: r * 0.18}, {p: [0, h, 0], a: 0.03, b: 0.03}]});
  R.flat(b, {pts: [[r * 0.98, 0, -0.05], [r * 0.98, 0, 0.32], [r * 0.82, h * 0.48, 0.14]], col: '#3a3024', two: true});
  R.B.shadow = {s: 0.3, l: 0.2, rs: r * 1.25, rl: r * 1.1};
  R.B.feet = []; R.B.anchors = {top: [0, h, 0]}; R.B.look = SOFT;
  return R.B;
};

/** Paint a build at a world ground point facing `heading` (rad, 0 = +x, pi/2 = +z), through the beast painter. */
export const placeBuild = (p: Painter | null, c: YCam, B: Build, at: V3, heading: number, o: {seed?: number; sun?: V3; shadowOp?: number; amb?: string; ambK?: number; haze?: number; hazeCol?: string} = {}) =>
  paintBeast(p, c, B, {at: [at[0], at[2]], heading, ground: at[1], seed: o.seed ?? 80000, sun: o.sun, shadowOp: o.shadowOp ?? 70, amb: o.amb, ambK: o.ambK, haze: o.haze, hazeCol: o.hazeCol});

/** A vertical wheel disc in the plane x = const (axle along x), centre `c0`, radius `r`: tyre, rim and hub. (The locked LF01a look; the T14 rig uses `sideWheel`.) */
const wheel = (p: Painter, c: YCam, seed: number, c0: V3, r: number, tyre: string, rim: string) => {
  const ring = (rr: number, dx: number): V3[] => Array.from({length: 18}, (_, i) => [c0[0] + dx, c0[1] + rr * Math.sin((i / 18) * 6.283), c0[2] + rr * Math.cos((i / 18) * 6.283)]);
  wFill(p, c, seed, tyre, ring(r, 0));
  wFill(p, c, seed + 1, rim, ring(r * 0.55, Math.sign(c.x - c0[0]) * 0.02));
  wFill(p, c, seed + 2, mixColor(rim, '#1a1610', 0.5), ring(r * 0.16, Math.sign(c.x - c0[0]) * 0.04));
};
/** T14: a wheel with its axle along z (the truck's side faces +-z), tyre width 0.18 m, a hub mark at angle `turn` (rad about +z, `-distance / 0.40` for a wheel rolling toward +x). */
const sideWheel = (p: Painter, c: YCam, seed: number, c0: V3, r: number, tyre: string, rim: string, turn: number) => {
  const sg = c.z >= c0[2] ? 1 : -1, ringAt = (rr: number, dz: number, ph = 0): V3[] => Array.from({length: 20}, (_, i) => [c0[0] + rr * Math.cos((i / 20) * 6.283 + ph), c0[1] + rr * Math.sin((i / 20) * 6.283 + ph), c0[2] + dz]);
  wFill(p, c, seed, mixColor(tyre, '#000000', 0.3), ringAt(r, -sg * 0.09));   // far tyre wall
  wFill(p, c, seed + 1, tyre, ringAt(r, sg * 0.09));
  wFill(p, c, seed + 2, rim, ringAt(r * 0.58, sg * 0.1));
  wFill(p, c, seed + 3, mixColor(rim, '#1a1610', 0.5), ringAt(r * 0.16, sg * 0.11));
  const q = (rr: number, w: number): V3 => [c0[0] + rr * Math.cos(turn) - w * Math.sin(turn), c0[1] + rr * Math.sin(turn) + w * Math.cos(turn), c0[2] + sg * 0.115];
  wFill(p, c, seed + 4, '#2a251c', [q(r * 0.16, -0.025), q(r * 0.56, -0.025), q(r * 0.56, 0.025), q(r * 0.16, 0.025)]);
};

/** 1932 open-cab tray truck, generic (no badges). `at` the ground centre, the cab toward +x when `dir` 1 (toward -x when -1). Boxes are axis
 *  aligned along x. `gun` paints G2 on its pedestal in the tray. T14 options (all absent = the locked look): `hollow` builds the tray from boards
 *  (floor, two sides, tail and head boards) so what sits in it shows; `inTray` and `inCab` paint riders and gear in the right painter's order
 *  (`inTray` between the boards farther and nearer than `trayAt`, `inCab` after the cab body and before its roof); `wheelTurn` (rad) draws the
 *  side wheels (axle along z) with a hub mark. */
export type TruckPaintOpts = {body?: string; gun?: boolean; hollow?: boolean; inTray?: () => void; inCab?: () => void; wheelTurn?: number; trayAt?: V3};
export const paintTruck = (p: Painter, c: YCam, seed: number, at: V3, dir: 1 | -1, o: TruckPaintOpts = {}) => {
  const [x, , z] = at, body = o.body ?? '#55503f', X = (a: number) => x + dir * a;
  const bx = (a0: number, a1: number, y0: number, y1: number, w: number): Box => ({x0: Math.min(X(a0), X(a1)), x1: Math.max(X(a0), X(a1)), y0, y1, z0: z - w, z1: z + w});
  const near = c.z > z ? 1 : -1, wh = (sd: number, s: number, a: number) => {
    const c0: V3 = [X(a), 0.42, z + s * 0.95];
    if (o.wheelTurn !== undefined) sideWheel(p, c, sd, c0, 0.42, '#1d1b18', '#6a6456', o.wheelTurn); else wheel(p, c, sd, c0, 0.42, '#1d1b18', '#6a6456');
  };
  for (const s of [-1, 1]) if (s !== near) { wh(seed + 10 + s, s, -1.5); wh(seed + 20 + s, s, 1.6); }
  paintBox(p, c, seed + 30, bx(-2.6, 0.7, 0.8, 1.1, 1.0), mixColor(body, '#7a6a4c', 0.35), {}, {ink: true});   // tray deck
  const sideCol = mixColor(body, '#7a6a4c', 0.5);
  if (!o.hollow) paintBox(p, c, seed + 50, bx(-2.6, 0.7, 1.1, 1.45, 1.0), sideCol, {top: 0.25}, {ink: true});   // tray sides (low drop sides)
  else {
    const T = 0.03, boards: {b: Box; at: V3}[] = [
      {b: {...bx(-2.6, 0.7, 1.1, 1.45, 1.0), z0: z - 1.0, z1: z - 1.0 + T}, at: [X(-0.95), 1.3, z - 1.0]}, {b: {...bx(-2.6, 0.7, 1.1, 1.45, 1.0), z0: z + 1.0 - T, z1: z + 1.0}, at: [X(-0.95), 1.3, z + 1.0]},
      {b: bx(-2.6, -2.6 + T, 1.1, 1.45, 1.0), at: [X(-2.6), 1.3, z]}, {b: bx(0.67, 0.7, 1.1, 1.45, 1.0), at: [X(0.7), 1.3, z]}];
    const mid = camDistTo(c, o.trayAt ?? [X(-0.95), 1.1, z]), sorted = boards.map((q) => ({q, d: camDistTo(c, q.at)})).sort((a, b) => b.d - a.d);
    sorted.filter((e) => e.d > mid).forEach((e, i) => paintBox(p, c, seed + 52 + i * 4, e.q.b, sideCol, {top: 0.25}, {ink: true}));
    o.inTray?.();
    sorted.filter((e) => e.d <= mid).forEach((e, i) => paintBox(p, c, seed + 62 + i * 4, e.q.b, sideCol, {top: 0.25}, {ink: true}));
  }
  paintBox(p, c, seed + 70, bx(0.7, 1.75, 0.75, 1.75, 0.85), body, {}, {ink: true});   // cab body
  o.inCab?.();
  paintBox(p, c, seed + 90, bx(0.65, 1.8, 2.05, 2.12, 0.9), mixColor(body, '#1a1610', 0.3), {}, {ink: true});   // cab roof (open sides)
  for (const s of [-1, 1]) wFill(p, c, seed + 110 + s, '#2a2620', [[X(0.72), 1.75, z + s * 0.86], [X(0.76), 1.75, z + s * 0.86], [X(0.76), 2.05, z + s * 0.86], [X(0.72), 2.05, z + s * 0.86]]);   // roof posts
  paintBox(p, c, seed + 130, bx(1.75, 2.6, 0.7, 1.35, 0.55), body, {top: -0.1}, {ink: true});   // bonnet
  paintBox(p, c, seed + 150, bx(2.6, 2.68, 0.65, 1.4, 0.5), '#3a3830', {}, {ink: true});   // radiator
  for (const s of [-1, 1]) paintBox(p, c, seed + 170 + s * 3, bx(1.2, 2.6, 0.62, 0.7, 0.98 * 1), mixColor(body, '#1a1610', 0.3), {}, {});   // running board / mudguard line
  const hl = camPoint(c, [X(2.7), 1.25, z + near * 0.42]);
  if (hl) wInk(p, c, seed + 190, [[X(2.7), 1.25, z + near * 0.42], [X(2.74), 1.25, z + near * 0.42]], {weight: 3, color: '#d8d0b8'});
  for (const s of [-1, 1]) if (s === near) { wh(seed + 200 + s, s, -1.5); wh(seed + 210 + s, s, 1.6); }
  if (o.gun) placeBuild(p, c, buildLewisGun({tripod: false, elev: 0.08}), [X(-1.2), 1.45, z], dir > 0 ? Math.PI : 0, {seed: seed + 300, shadowOp: 0});
};
const camDistTo = (c: YCam, v: V3) => Math.hypot(v[0] - c.x, v[2] - c.z);

export const unitDir = (a: V3, b: V3): L3 => nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);

/** Crew gear on the ground (UT12 lived-in props, each with a contact shade): a canvas sheet with fold lines, a wooden ammunition box,
 *  two spare pan magazines, a canvas water bag. Positions are world ground points. */
export const paintGear = (p: Painter, c: YCam, seed: number, o: {sheet: V3; box: V3; mags: V3; bag?: V3}) => {
  const [sx, , sz] = o.sheet, a = 0.5, ca = Math.cos(a), sa = Math.sin(a), Q = (u: number, v: number): V3 => [sx + u * ca - v * sa, 0.01, sz + u * sa + v * ca];
  wFill(p, c, seed, '#cfc3a1', [Q(-0.9, -0.6), Q(0.9, -0.6), Q(0.9, 0.6), Q(-0.9, 0.6)]);
  for (const [k, u] of [[0, -0.3], [1, 0.3]] as const) wInk(p, c, seed + 2 + k, [Q(u, -0.6), Q(u, 0.6)], {closed: false, weight: 0.8, color: '#a89c7c'});
  wFill(p, c, seed + 5, '#b3a786', [Q(0.5, -0.6), Q(0.9, -0.6), Q(0.9, 0.6), Q(0.5, 0.6)]);
  const [bx, , bz] = o.box;
  wFill(p, c, seed + 8, '#5a4a36', [[bx - 0.3, 0.005, bz - 0.2], [bx + 0.32, 0.005, bz - 0.2], [bx + 0.32, 0.005, bz + 0.22], [bx - 0.3, 0.005, bz + 0.22]]);
  paintBox(p, c, seed + 10, {x0: bx - 0.25, x1: bx + 0.25, y0: 0, y1: 0.24, z0: bz - 0.16, z1: bz + 0.16}, '#7a5a36', {}, {ink: true});
  wInk(p, c, seed + 30, [[bx - 0.25, 0.12, bz + 0.165], [bx + 0.25, 0.12, bz + 0.165]], {closed: false, weight: 0.8, color: '#4a3622'});
  const [mx, , mz] = o.mags;
  for (const [k, dx, dz, y] of [[0, 0, 0, 0.02], [1, 0.1, 0.06, 0.065]] as const) {
    const ring = (r: number, yy: number): V3[] => Array.from({length: 20}, (_, i) => [mx + dx + r * Math.cos((i / 20) * 6.283), yy, mz + dz + r * Math.sin((i / 20) * 6.283)]);
    wFill(p, c, seed + 40 + k * 3, '#1e1d1a', ring(0.14, y - 0.02));
    wFill(p, c, seed + 41 + k * 3, GUN_PX.mag, ring(0.135, y + 0.02));
    wFill(p, c, seed + 42 + k * 3, GUN_PX.magRim, ring(0.04, y + 0.021));
  }
  if (o.bag) { const g = camPoint(c, o.bag); if (g) wFill(p, c, seed + 60, '#b8a47c', Array.from({length: 12}, (_, i) => { const t = (i / 12) * 6.283; return [o.bag![0] + 0.22 * Math.cos(t), 0.08 + 0.08 * Math.sin(t) * 0.5, o.bag![2] + 0.14 * Math.sin(t)] as V3; })); }
};


// ---- T14: the 1932 truck rig (Boss, 2026-11-19). Space T = space P axes translated to the truck's ground centre (a along the truck, + = the cab end
// when dir 1; y up; z across, +z the truck's right when dir 1); a truck with dir -1 is the same truck turned about (a, z) -> (-a, -z).
const T14_FPS = 30, TRUCK_WHEEL_R = 0.4;
/** World point of the truck-local point T(a, y, z). */
export const truckPoint = (centre: V3, dir: 1 | -1, a: number, y: number, z: number): V3 => [centre[0] + dir * a, centre[1] + y, centre[2] + dir * z];
const nz = (v: number) => v + 0;   // no negative zero
/** Rigid pose of the truck as a `YCam.body`: pivot = `centre` (on the ground), `pitch` rad about world z (+ = nose up for a truck whose nose is +x), `roll` rad about world x
 *  (+ = the truck's left side down for dir 1; `paintTruckRig` passes `pitch * dir` and `roll * dir`). Row-major, v -> o + m (v - o); (0, 0) is the identity. */
export const truckBody = (centre: V3, pitch: number, roll: number): YBody => {
  const cp = Math.cos(pitch), sp = Math.sin(pitch), a = -roll, ca = Math.cos(a), sa = Math.sin(a);
  const Rz = [cp, -sp, 0, sp, cp, 0, 0, 0, 1], Rx = [1, 0, 0, 0, ca, -sa, 0, sa, ca];
  const m = [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => nz(Rx[i * 3] * Rz[j] + Rx[i * 3 + 1] * Rz[3 + j] + Rx[i * 3 + 2] * Rz[6 + j])));
  return {o: centre, m};
};
/** The inverse pose (transpose), for the set of a camera that rides the truck (B05-SH01). */
export const invertBody = (b: YBody): YBody => ({o: b.o, m: [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => b.m[j * 3 + i]))});
/** Camera for a set painted around a truck-locked camera: `c` is the truck-local camera in world metres (`truckCam`), its `body` the inverse truck pose, so the world tilts and the riders stay still. */
export const truckSetCam = (c: YCam, centre: V3, pitch: number, roll: number): YCam => ({...c, body: invertBody(truckBody(centre, pitch, roll))});
/** A camera given in truck-local metres (dir 1 truck, no pitch or roll): world eye = centre + local eye; yaw/pitch in degrees as the sheet camera lines. */
export const truckCam = (centre: V3, o: {eye: V3; yaw: number; pitch?: number; f: number; hy: number}): YCam =>
  ({x: centre[0] + o.eye[0], y: centre[1] + o.eye[1], z: centre[2] + o.eye[2], yaw: (o.yaw * Math.PI) / 180, pitch: ((o.pitch ?? 0) * Math.PI) / 180, f: o.f, hy: o.hy});

export type TruckShotId = 'B01-SH02' | 'B02-SH03' | 'B02-SH04' | 'B05-SH01' | 'B05-SH02' | 'B05-SH03' | 'B06-SH03' | 'B06-SH04';
export type TruckState = {centre: V3; dir: 1 | -1; pitch: number; roll: number; g2Elev: number; wheelTurn: number};
const G2_REST = (10 * Math.PI) / 180, D = Math.PI / 180;
const smooth = (u: number) => u * u * (3 - 2 * u);
type Key = [frame: number, value: number, ease?: 'out'];
/** Keyed value at frame L; each segment eases by the ease of the key it ends on (default ease-in-out); constant outside the keys. */
const keyed = (L: number, keys: Key[]): number => {
  if (L <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (L <= keys[i][0]) {
    const u = (L - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
    return keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * (keys[i][2] === 'out' ? easeOut(u) : smooth(u));
  }
  return keys[keys.length - 1][1];
};
/** B05-SH01 seeded bumps: one every 12-18 f, strength s 0.6-1.0, roll sign seeded. */
export const bumpsB05Sh01 = (seed = 14000): {k: number; s: number; rs: 1 | -1}[] => {
  const out: {k: number; s: number; rs: 1 | -1}[] = [];
  let k = -9;   // the gap runs from 9 f before L 0, so the first bump (L 3-9) is under way at the R30-truck-chase L 10 proof frame
  for (let i = 0; i < 10; i++) { k += 12 + Math.floor(hash(seed + i * 5) * 7); out.push({k, s: 0.6 + 0.4 * hash(seed + i * 5 + 1), rs: hash(seed + i * 5 + 2) < 0.5 ? -1 : 1}); }
  return out;
};
const wheelTurnOf = (x: number, x0: number) => nz(-(x - x0) / TRUCK_WHEEL_R);
/** Drive schedule of every truck shot (T14 Decided values), a pure function of the shot-local frame; null = the truck is absent. */
export const truckState = (shot: TruckShotId, L: number, seed = 14000): TruckState | null => {
  const base = (x: number, o: Partial<TruckState> & {x0: number}): TruckState => ({centre: [x, 0, 9.5], dir: o.dir ?? 1, pitch: o.pitch ?? 0, roll: o.roll ?? 0, g2Elev: o.g2Elev ?? G2_REST, wheelTurn: wheelTurnOf(x, o.x0)});
  switch (shot) {
    case 'B01-SH02': return base(-7 + (13 * L) / 58, {x0: -7});
    case 'B02-SH03': {
      const l = Math.min(L, 44), front = l <= 30 ? -16 + 0.3351 * l : -5.947 + 0.3351 * (l - 30) - 0.01197 * (l - 30) ** 2;   // held at the L 44 value after the stop
      return base(front - 2.6, {x0: -18.6, pitch: keyed(L, [[44, 0], [46, -2 * D], [48, 0.8 * D], [50, 0]])});
    }
    case 'B02-SH04': return base(-3.6 - 2.6, {x0: -6.2});
    case 'B05-SH01': {
      let pitch = 0, roll = 0, elev = 0;
      for (const b of bumpsB05Sh01(seed)) {
        const sh = keyed(L - b.k, [[0, 0], [3, 1], [6, -0.5], [9, 0]]);
        pitch += 1.5 * D * b.s * sh; roll += 1.0 * D * b.s * b.rs * sh; elev += 15 * D * keyed(L - b.k, [[0, 0], [3, 1], [9, 0]]);
      }
      return base(-17 + (12 * L) / 59, {x0: -17, pitch, roll, g2Elev: G2_REST + elev});
    }
    case 'B05-SH02': {
      let pitch = 0, elev = 0;
      for (const k of [8, 24, 38, 52, 66]) {
        pitch += keyed(L - k, [[0, 0], [3, 3 * D], [6, -2 * D], [8, 0]]);
        elev += keyed(L - k, [[0, 0], [3, 40 * D, 'out'], [8, 0]]);
      }
      return base(-5 + (5 * L - (L * L) / 166) / T14_FPS, {x0: -5, pitch, g2Elev: G2_REST + elev});
    }
    case 'B05-SH03': return base(-2 + (37 * L) / 93, {x0: -2});
    case 'B06-SH03': {
      if (L < 27) return null;
      if (L < 59) return base(30 - 28 * easeOut(unit((L - 27) / 18)), {x0: 30, dir: -1});
      const j = Math.min(5, Math.floor((L - 59) / 6));
      return j === 1 || j === 3 ? null : base(2, {x0: 30, dir: 1});
    }
    case 'B06-SH04': {
      const t = L / T14_FPS, ta = 10 / T14_FPS, a = 12 / ta;
      return base(t <= ta ? 2 + 0.5 * a * t * t : 2 + 0.5 * a * ta * ta + 12 * (t - ta), {x0: 2});
    }
  }
};

const SIL = '#2b241c';
/** A flat-fill rider silhouette (shoulders, head, slouch hat) sitting at the world seat point `at`. */
const paintSilhouette = (p: Painter, c: YCam, seed: number, at: V3, o: {shoulders: boolean}) => {
  const flat = {top: 0, bottom: 0, front: 0, back: 0, left: 0, right: 0};
  if (o.shoulders) paintBox(p, c, seed, {x0: at[0] - 0.14, x1: at[0] + 0.14, y0: at[1] + 0.35, y1: at[1] + 0.62, z0: at[2] - 0.25, z1: at[2] + 0.25}, SIL, flat);
  const h = sphereAt(c, [at[0], at[1] + 0.78, at[2]], 0.105);
  if (h) p.flat(SIL, ring(h.x, h.y, h.r, h.r, 14));
  const br = flatCircle(c, [at[0], at[1] + 0.86, at[2]], 0.2);
  if (br.length > 2) p.flat(SIL, br);
  const cr = sphereAt(c, [at[0], at[1] + 0.92, at[2]], 0.095);
  if (cr) p.flat(SIL, ring(cr.x, cr.y - cr.r * 0.1, cr.r, cr.r * 0.7, 14));
};

export type TruckRigOpts = {centre: V3; dir: 1 | -1; pitch?: number; roll?: number; riders: 'silhouettes' | 'chase' | 'none'; gear: 'cases' | 'pedestal' | 'none'; g2Elev?: number; wheelTurn?: number; t: number; seed: number; magTurn?: number};
/** G2 pivot (tripod-head point) in space T and its rest yaw (T13 r3: muzzle 0.66 m from the pivot). */
export const G2_PIVOT: V3 = [-0.55, 1.8, -0.1];
const G2_YAW = (-14 * Math.PI) / 180;
/** Paints the truck, its crew and G2 in one rigid pass: every part uses `{...c, body: truckBody(...)}`. Returns the camera used, the G2 anchors in unrotated world metres (`lewisAnchors`), the muzzle as a picture point and the gunner result. */
export const paintTruckRig = (p: Painter, c: YCam, o: TruckRigOpts) => {
  const {centre, dir} = o, pitch = o.pitch ?? 0, roll = o.roll ?? 0, cb: YCam = pitch || roll ? {...c, body: truckBody(centre, pitch * dir, roll * dir)} : c;
  const P = (a: number, y: number, z: number) => truckPoint(centre, dir, a, y, z);
  const pivot = P(...G2_PIVOT), elev = o.g2Elev ?? G2_REST, heading = G2_YAW + (dir < 0 ? Math.PI : 0), gunAt: V3 = [pivot[0], pivot[1] - 0.56, pivot[2]];
  const an = lewisAnchors(gunAt, heading, {elev});
  let gunner = null as ReturnType<typeof paintSeatedGunner>;
  const paintG2 = () => {
    paintBox(p, cb, o.seed + 400, {x0: pivot[0] - 0.04, x1: pivot[0] + 0.04, y0: 1.1, y1: 1.75, z0: pivot[2] - 0.04, z1: pivot[2] + 0.04}, '#34332f', {top: 0, bottom: 0, front: 0, back: 0.1, left: 0.15, right: 0.2});
    placeBuild(p, cb, buildLewisGun({elev, tripod: false}), gunAt, heading, {seed: o.seed + 410, shadowOp: 0});
    paintLewisPanTicks(p, cb, o.seed + 420, gunAt, heading, o.magTurn ?? 0, {elev});
  };
  const inTray = () => {
    if (o.riders === 'chase') {
      paintG2();
      gunner = paintSeatedGunner(p, cb, GUNNER1, P(-1.2, 1.1, 0), {view: 'right', grip: an.grip, stock: an.stock, t: o.t, seed: o.seed + 430});
      return;
    }
    const items: Item[] = [];
    if (o.riders === 'silhouettes') for (const s of [-1, 1]) items.push({at: P(-1.2, 1.1, s * 0.45), draw: () => paintSilhouette(p, cb, o.seed + 440 + s * 7, P(-1.2, 1.1, s * 0.45), {shoulders: true})});
    if (o.gear === 'pedestal') items.push({at: pivot, draw: paintG2});
    if (o.gear === 'cases') for (const s of [-1, 1]) {
      const m = P(-0.05, 1.1, s * 0.33);
      items.push({at: m, draw: () => paintBox(p, cb, o.seed + 460 + s * 5, {x0: m[0] - 0.7, x1: m[0] + 0.7, y0: 1.1, y1: 1.3, z0: m[2] - 0.125, z1: m[2] + 0.125}, '#5c4a32', {}, {ink: true})});
    }
    paintSorted(p, cb, items);
  };
  const inCab = () => {
    if (o.riders === 'silhouettes') paintSilhouette(p, cb, o.seed + 470, P(1.6, 1.12, -0.45), {shoulders: false});
    if (o.riders === 'chase') for (const s of [-1, 1]) paintSilhouette(p, cb, o.seed + 470 + s * 7, P(1.6, 1.12, s * 0.45), {shoulders: false});
  };
  paintTruck(p, cb, o.seed, centre, dir, {hollow: true, inTray, inCab, wheelTurn: o.wheelTurn ?? 0, trayAt: P(-0.95, 1.1, 0)});
  return {cam: cb, anchors: an, muzzle: camPoint(cb, an.muzzle), gunner};
};

export type DustPuff = {at: V3; r: number; alpha: number; seed: number};
/** Dust puffs alive at frame L behind a truck driven by `track` (T14): one per 2 frames at each rear wheel while the truck moves; radius 0.3 -> 1.5 m and alpha 0.40 -> 0 over 30 f; velocity
 *  0.3 x the truck's velocity at birth plus seeded +-0.2 m/s; once the truck is stopped a puff's velocity decays x0.92 per frame (so the cloud rolls on past it). Pure in L. */
export const truckDustPuffs = (L: number, track: (L: number) => TruckState | null, seed = 14500): DustPuff[] => {
  const speedAt = (f: number): V3 | null => { const a = track(f), b = track(f + 1); return a && b ? [(b.centre[0] - a.centre[0]) * T14_FPS, 0, (b.centre[2] - a.centre[2]) * T14_FPS] : null; };
  const moving = (f: number) => { const v = speedAt(f); return !!v && Math.hypot(v[0], v[2]) > 0.05; };
  const factor = (f: number) => { if (moving(f)) return 1; let n = 1; while (n < 40 && !moving(f - n)) n++; return 0.92 ** n; };
  const out: DustPuff[] = [];
  for (let b = Math.max(0, L - 29); b <= L; b++) {   // a puff aged 30 f has alpha 0
    if (b % 2 || !moving(b)) continue;
    const st = track(b)!, v = speedAt(b)!;
    for (const s of [-1, 1]) {
      const sd = seed + b * 13 + s * 5, jx = (hash(sd) * 2 - 1) * 0.2, jz = (hash(sd + 1) * 2 - 1) * 0.2, vel: V3 = [0.3 * v[0] + jx, 0, 0.3 * v[2] + jz];
      const at0 = truckPoint(st.centre, st.dir, -1.5, 0, s * 0.95), at: V3 = [at0[0], 0, at0[2]];
      for (let f = b; f < L; f++) { const k = factor(f) / T14_FPS; at[0] += vel[0] * k; at[2] += vel[2] * k; }
      const u = (L - b) / 30, r = 0.3 + 1.2 * u;
      out.push({at: [at[0], 0.15 + 0.5 * r, at[2]], r, alpha: 0.4 * (1 - u), seed: sd});
    }
  }
  return out;
};
/** Paints the dust of `truckDustPuffs` as plain `#b08a62` circles, far to near. `part` splits it around the truck for painter's order: 'far' (farther than `truckAt`, before the truck) and 'near' (after it); absent = all. */
export const paintTruckDust = (p: Painter, c: YCam, L: number, track: (L: number) => TruckState | null, o: {seed?: number; part?: 'far' | 'near'; truckAt?: V3} = {}) => {
  const ref = o.truckAt ? camDistTo(c, o.truckAt) : 0;
  truckDustPuffs(L, track, o.seed).filter((q) => !o.part || (camDistTo(c, q.at) > ref) === (o.part === 'far')).sort((a, b) => camDistTo(c, b.at) - camDistTo(c, a.at)).forEach((q) => {
    const m = camPoint(c, q.at);
    if (!m || q.alpha <= 0) return;
    const R = q.r * camUnit(c, q.at);
    washAt(p, q.seed, '#b08a62', q.alpha * 255, ring(m[0], m[1], R, R, 16), 0, 0);
  });
};

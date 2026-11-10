import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, paintSorted, qy, qz, wFill, wInk, wWash, type Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C, lookCam, type Season} from './palette';
import {horizonY, lump, paintPathBack, pathItems, type PathState} from './path';
import {seasonAt, type StateKey} from './season';

// `new: SET-AERIAL16` (brief "Set plan - SET-AERIAL16", N4; Film look at W3 for LF04, Boss polish and camera move at W5.2). A map-like painted neighbourhood
// seen from above at about 55-65 deg pitch, painted-3D: the campus quad around the path origin (hall with a pitched slate roof, walks, the maple row, firs),
// then an American street grid (blocks 100 x 200 m) of pitched-roof houses with driveways, parked cars, lawns, street trees as lit canopy spheres with
// cast shadows (sun from the east, -x: shadows fall toward +x), atmospheric haze with distance. A season clock `s` (0 summer, 1 autumn, 2 winter) blends
// the palette continuously (no layering: cheap and deterministic). Crow clusters (3-6 dark marks with a pale beak flick on the lit side) switch on tree by
// tree outward from the nest tree as `spread` 0..1 grows. No labels, no scale bar. Space A = space P (origin on the path centreline).

export type AerialState = {
  /** Shot-local frame (the crow flutter as the wave arrives). */ n?: number;
  /** Season clock: 0 summer, 1 autumn, 2 winter (fractions blend). `season` names a fixed look for stills (spring/later/bud/dusk not drawn here). */
  s: number; spread: number; t: number;
};
/** Fixed season to clock value (stills). */
export const seasonClock = (S: Season): number => (S === 'autumn' ? 1 : S === 'winter' ? 2 : 0);

const SUMMER = ['#4d7a3a', '#5f8c45', '#3f6a32', '#6b9650'], AUTUMN = ['#d9772f', '#b8452a', '#e8b04a', '#c9a03a'], WINTER = ['#7a6e64', '#6a6058', '#857a6e', '#746a60'];
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const pal = (s: number, i: number) => { const a = s <= 1 ? SUMMER : AUTUMN, b = s <= 1 ? AUTUMN : WINTER, u = s <= 1 ? s : s - 1; return mixColor(a[i % 4], b[i % 4], clamp01(u)); };
const ground = (s: number) => mixColor(mixColor('#86a85c', '#a3a06a', clamp01(s)), '#a9ad99', clamp01(s - 1));
const ROOF = ['#6b6660', '#7a5a48', '#5a5f66', '#8a7060', '#4f5358', '#6a4a3e'];
const WALL = ['#e6dcc8', '#d9c9a8', '#cfd6d8', '#e9d6c0', '#bfc9b8'];
const CAR = ['#a83a32', '#2f4a6a', '#d8d8d4', '#3a3d42', '#c8a23a', '#4f6f58'];
const LIT = '#fff1cf', SHADE = '#2c2a40';
const dk = (col: string, u: number) => mixColor(col, SHADE, u), lt = (col: string, u: number) => mixColor(col, LIT, u);

type Tree = {x: number; z: number; r: number; id: number; d: number};

export const paintAerial = (p: Painter, c: YCam, st: AerialState) => {
  const {s} = st;
  const hz = horizonY(c), hazeCol = mixColor('#dfe3da', '#c9d0d2', clamp01(s - 1) * 0.6);
  const H = (col: string, at: V3, k = 1) => { const d = Math.hypot(at[0] - c.x, at[2] - c.z); return mixColor(col, hazeCol, clamp01((d - 350) / 1900) * 0.55 * k); };
  const onScreen = (at: V3, pad = 80) => { const q = camPoint(c, at); return !!q && q[0] > -pad && q[0] < 1080 + pad && q[1] > -pad && q[1] < 1920 + pad; };
  if (hz > -100) paintSkyBands(p, {from: mixColor('#aec6d3', '#b9c0c6', clamp01(s - 1)), to: hazeCol, horizon: Math.min(2300, hz + 40), width: 1080, bands: 10});
  const G = ground(s);
  // ground and lawns (each yard a slightly different tone)
  wFill(p, c, 40000, H(G, [0, 0, -300]), qy(0, -1600, 1600, -1800, 1000));
  for (let i = -8; i < 8; i++) for (let j = -8; j < 4; j++) {
    if ((i === -1 || i === 0) && (j === -1 || j === 0)) continue;
    const at: V3 = [i * 100 + 50, 0, j * 200 + 100];
    if (!onScreen(at, 400)) continue;
    wFill(p, c, 40500 + (i + 8) * 13 + j + 8, H(mixColor(G, '#5f6a48', 0.2 * hash(40600 + i * 31 + j)), at), qy(0.02, i * 100 + 6, i * 100 + 94, j * 200 + 6, j * 200 + 194));
  }
  // streets: x every 100 m, z every 200 m (10 m asphalt, 2 m pale sidewalks each side), dashed centre lines near the camera
  const asphalt = (at: V3) => H(mixColor('#6c6b69', '#7d7c78', clamp01(s - 1) * 0.5), at), walk = (at: V3) => H('#b9b5aa', at);
  for (let i = -8; i <= 8; i++) {
    wFill(p, c, 40010 + i, walk([i * 100, 0, -300]), qy(0.06, i * 100 - 7, i * 100 + 7, -1600, 900));
    wFill(p, c, 40100 + i, asphalt([i * 100, 0, -300]), qy(0.08, i * 100 - 5, i * 100 + 5, -1600, 900));
  }
  for (let j = -8; j <= 4; j++) {
    wFill(p, c, 40040 + j, walk([0, 0, j * 200]), qy(0.06, -1400, 1400, j * 200 - 7, j * 200 + 7));
    wFill(p, c, 40140 + j, asphalt([0, 0, j * 200]), qy(0.08, -1400, 1400, j * 200 - 5, j * 200 + 5));
  }
  for (let i = -8; i <= 8; i++) for (let k = 0; k < 90; k++) {
    const z = -1000 + k * 22, at: V3 = [i * 100, 0, z];
    if (Math.hypot(at[0] - c.x, at[2] - c.z) > 650 || !onScreen(at, 20) || (z > -1 - 12 && z < 1 + 12 && false)) continue;
    wFill(p, c, 41500 + i * 100 + k, H('#d8c25a', at), qy(0.1, i * 100 - 0.2, i * 100 + 0.2, z, z + 7));
  }
  // campus quad: lawn (over the streets), walks, the main path, the hall's apron
  const qc: V3 = [0, 0, 0];
  wFill(p, c, 40001, H(mixColor(G, '#7aa04e', 0.45), qc), qy(0.05, -95, 95, -195, 195));
  wWash(p, c, 40004, dk(G, 0.25), 90, qy(0.052, -95, 95, -150, -60), 0.2, 0.4);
  for (const [i, [a, b, d, e]] of ([[-60, 60, -2.2, 2.2], [-1.5, 1.5, -150, -2], [-61.5, -58.5, -100, 100], [58.5, 61.5, -100, 100], [-60, 60, 98.5, 101.5]] as number[][]).entries()) {
    const wide = i === 0 ? 1.2 : 1.5; // the main path is 2.4 m (true width); the cross walks 3 m
    void wide;
    wFill(p, c, 40010 + 50 + i, H(C.path, qc), i === 0 ? qy(0.1, -60, 60, -1.2, 1.2) : qy(0.09, a, b, d, e));
  }
  wFill(p, c, 40070, H('#b9b4a6', qc), qy(0.09, -24, 29, -23.4, -17));
  // the hall: brick walls, pitched slate roof along x with a ridge, chimneys, two rows of windows on the front face
  const hall = (col: string, k = 0) => H(col, [2, 0, -32], k);
  paintBox(p, c, 40200, {x0: -20, x1: 25, y0: 0, y1: 13, z0: -40, z1: -24}, hall('#a4553f'), {top: 0, front: 0.05, right: 0.28, left: 0.1});
  wFill(p, c, 40210, hall(dk(C.slate, 0.1)), [[-20.8, 13, -40.6], [25.8, 13, -40.6], [25.8, 18, -32], [-20.8, 18, -32]]);
  wFill(p, c, 40211, hall(lt(C.slate, 0.08)), [[-20.8, 13, -23.4], [25.8, 13, -23.4], [25.8, 18, -32], [-20.8, 18, -32]]);
  wFill(p, c, 40212, hall(C.slate), [[25.8, 13, -40.6], [25.8, 13, -23.4], [25.8, 18, -32]]);
  for (const cx of [-12, 2, 16]) paintBox(p, c, 40220 + cx, {x0: cx - 0.8, x1: cx + 0.8, y0: 17.6, y1: 20.5, z0: -34, z1: -32.5}, hall('#8a4a38'), {});
  for (let row = 0; row < 3; row++) for (let col = 0; col < 14; col++) {
    const wx = -18.4 + col * 3.0, wy = 2 + row * 3.8;
    if (Math.abs(wx - 2.5) < 1.7 && row === 0) continue;
    wFill(p, c, 40240 + row * 20 + col, hall('#5d6f7c'), qz(-23.97, wx - 0.7, wx + 0.7, wy, wy + 2.0));
  }
  wFill(p, c, 40300, hall('#3a2a22'), qz(-23.96, 1.0, 4.0, 0, 2.8));

  // ---- collect shadows (ground), then depth-sorted items
  type Hs = {x: number; z: number; wx: number; wz: number; h: number; rot: boolean; id: number; hall?: boolean};
  const houses: Hs[] = [], trees: Tree[] = [], cars: V3[] = [];
  let n = 0;
  const addHouse = (hx: number, hz: number, rot: boolean) => {
    n++;
    const at: V3 = [hx, 0, hz];
    if (!onScreen(at, 120)) return;
    const d = Math.hypot(hx - c.x, hz - c.z);
    if (d > 1500) return;
    houses.push({x: hx, z: hz, wx: rot ? 4.5 : 5.5, wz: rot ? 5.5 : 4.5, h: 5 + 1.2 * hash(40310 + n), rot, id: n});
  };
  for (let i = -5; i < 5; i++) for (let j = -5; j < 3; j++) {
    const bx = i * 100, bz = j * 200;
    if ((i === -1 || i === 0) && (j === -1 || j === 0)) { // the campus: scattered trees
      for (let k = 0; k < 16; k++) { const tx = bx + 8 + 84 * hash(44000 + i * 50 + j * 7 + k), tz = bz + 12 + 176 * hash(44200 + i * 50 + j * 7 + k); if (Math.abs(tz + 32) > 18 && Math.abs(tz) > 6 && Math.abs(tx) > 7) trees.push({x: tx, z: tz, r: 5.5 + 2.2 * hash(44400 + k + i * 9 + j), id: 5000 + (i + 1) * 100 + (j + 1) * 20 + k, d: 0}); }
      continue;
    }
    for (let k = 0; k < 6; k++) for (const side of [0, 1]) {
      const hx = bx + 12 + k * 15.2, hz = bz + (side ? 180 : 20);
      addHouse(hx, hz, false);
      if (hash(40320 + n) > 0.55) trees.push({x: hx + 6, z: hz + (side ? -12 : 12) * 0 + (side ? 12 : -12), r: 4.6 + 2 * hash(40330 + n), id: n * 3 + side, d: 0});
      if (hash(40340 + n) > 0.7) cars.push([hx - 3, 0.06, side ? bz + 193 : bz + 7]);
    }
    for (let k = 0; k < 9; k++) for (const side of [0, 1]) {
      const hz = bz + 38 + k * 15.5, hx = bx + (side ? 82 : 18);
      addHouse(hx, hz, true);
      if (hash(40350 + n) > 0.5) trees.push({x: hx + (side ? 12 : -12), z: hz + 4, r: 4.6 + 2 * hash(40360 + n), id: n * 3 + 2, d: 0});
      if (k % 3 === 1) trees.push({x: bx + 50 + 10 * (hash(44100 + n) - 0.5), z: hz, r: 5 + 2 * hash(44110 + n), id: n * 5, d: 0});
      if (hash(40370 + n) > 0.75) cars.push([side ? bx + 93 : bx + 7, 0.06, hz + 6]);
    }
  }
  // campus halls around the quad (brick, pitched slate), placed clear of the path and the main hall
  ([[-72, -96, 16, 9, 10], [72, -104, 14, 8, 9], [-74, 52, 12, 8, 8], [70, 60, 15, 9, 9], [-70, 126, 14, 8, 9], [74, 134, 16, 9, 10], [-30, 76, 9, 6, 6], [32, 150, 10, 7, 7]] as number[][]).forEach(([x, z, wx, wz, hh], i) => {
    if (onScreen([x, 0, z], 160)) houses.push({x, z, wx, wz, h: hh, rot: false, id: 900 + i, hall: true});
  });
  [-20, -11, 2.5, 11, 20].forEach((x, i) => trees.push({x, z: -4.5, r: 3.4, id: 9000 + i, d: 0}));
  trees.push({x: -26, z: -16, r: 4.2, id: 9100, d: 0}, {x: -22, z: -18, r: 4.2, id: 9101, d: 0});
  for (const t of trees) t.d = Math.hypot(t.x - 2.5, t.z + 4.5);

  // cast shadows on the ground (sun from -x: they fall toward +x and a little toward the camera side)
  for (const h of houses) {
    const sx = h.h * 0.9, sz = h.h * 0.25, x0 = h.x - h.wx, x1 = h.x + h.wx, z0 = h.z - h.wz, z1 = h.z + h.wz;
    wFill(p, c, 45000 + h.id * 2, H(dk(G, 0.38), [h.x, 0, h.z]), [[x1, 0.04, z0], [x1 + sx, 0.04, z0 + sz], [x1 + sx, 0.04, z1 + sz], [x1, 0.04, z1], [x0, 0.04, z1], [x0, 0.04, z0]]);
    // driveway to the street
    const dz = h.rot || h.hall ? 0 : (h.z % 200 > 100 ? 1 : -1);
    if (!h.rot && !h.hall) wFill(p, c, 45001 + h.id * 2, H('#b4afa4', [h.x, 0, h.z]), qy(0.05, h.x - 1.4, h.x + 1.4, dz > 0 ? h.z + h.wz : h.z - h.wz - 14, dz > 0 ? h.z + h.wz + 14 : h.z - h.wz));
  }
  const amt = clamp01(1 - clamp01(s - 1) * 1.15); // leaf amount: full until autumn, gone by the end of winter
  for (const t of trees) {
    const at: V3 = [t.x, 0, t.z];
    if (!onScreen(at, 120)) continue;
    const r = t.r * (0.5 + 0.5 * amt);
    const q = camPoint(c, [t.x + r * 0.95, 0.05, t.z + r * 0.3]);
    if (!q) continue;
    const u = camUnit(c, at);
    washAt(p, 46000 + t.id * 2, H(dk(G, 0.5), at), s > 1.5 ? 70 : 150, ell(q[0], q[1], r * u * 0.95, r * u * 0.55, 14), 0.1, 0.2);
  }

  // ---- depth-sorted 3D items: houses, cars, trees
  const items: Item[] = [];
  for (const h of houses) items.push({at: [h.x, 0, h.z], draw: (pp, cc) => paintHouse(pp, cc, h, G, H, s)});
  for (const [i, at] of cars.entries()) {
    if (!onScreen(at, 20) || Math.hypot(at[0] - c.x, at[2] - c.z) > 520) continue;
    const col = CAR[i % CAR.length], along = Math.abs(at[0] % 100) < 20;
    items.push({at, draw: (pp, cc) => paintBox(pp, cc, 47000 + i * 6, along ? {x0: at[0] - 2.3, x1: at[0] + 2.3, y0: 0.1, y1: 1.5, z0: at[2] - 0.95, z1: at[2] + 0.95} : {x0: at[0] - 0.95, x1: at[0] + 0.95, y0: 0.1, y1: 1.5, z0: at[2] - 2.3, z1: at[2] + 2.3}, H(col, at), {top: -0.12})});
  }
  for (const t of trees) {
    const at: V3 = [t.x, 0, t.z];
    if (!onScreen(at, 160)) continue;
    items.push({at, draw: (pp, cc) => paintTreeTop(pp, cc, t, s, amt, st.spread, H, st.n ?? 0)});
  }
  paintSorted(p, c, items);

  // the masked walker: a dot on the path (identity unreadable at this size)
  const w = camPoint(c, [1.0, 0.9, 0.3]);
  if (w) { const u = Math.max(2.4, 1.6 * camUnit(c, [1, 0.9, 0.3])); hardFill(p, 48990, C.mustard, ell(w[0], w[1], u * 0.9, u * 0.9, 8)); hardFill(p, 48991, C.latex, ell(w[0], w[1] - u * 0.7, u * 0.5, u * 0.5, 8)); }
};

const paintHouse = (p: Painter, c: YCam, h: {x: number; z: number; wx: number; wz: number; h: number; rot: boolean; id: number; hall?: boolean}, G: string, H: (col: string, at: V3, k?: number) => string, s: number) => {
  const at: V3 = [h.x, 0, h.z], px = camUnit(c, at);
  if (px < 0.9) return;
  const roofC = h.hall ? C.slate : ROOF[Math.floor(hash(40300 + h.id) * ROOF.length)], wallC = h.hall ? '#a4553f' : WALL[Math.floor(hash(40305 + h.id) * WALL.length)];
  const x0 = h.x - h.wx, x1 = h.x + h.wx, z0 = h.z - h.wz, z1 = h.z + h.wz, y1 = h.h, rise = 2.6, snow = clamp01(s - 1.2) * 0.5;
  paintBox(p, c, 41000 + h.id * 20, {x0, x1, y0: 0, y1, z0, z1}, H(wallC, at), {top: 0, front: 0.06, right: 0.3, left: 0.1, back: 0.16});
  const R = (col: string) => H(mixColor(col, '#e8ecee', snow), at);
  const rl = lt(roofC, 0.12), rd = dk(roofC, 0.22);
  if (h.rot) { // ridge along z: east (-x) slope lit, west (+x) slope in shade
    const xm = h.x;
    wFill(p, c, 41001 + h.id * 20, R(rl), [[x0 - 0.5, y1, z0 - 0.6], [xm, y1 + rise, z0 - 0.6], [xm, y1 + rise, z1 + 0.6], [x0 - 0.5, y1, z1 + 0.6]]);
    wFill(p, c, 41002 + h.id * 20, R(rd), [[xm, y1 + rise, z0 - 0.6], [x1 + 0.5, y1, z0 - 0.6], [x1 + 0.5, y1, z1 + 0.6], [xm, y1 + rise, z1 + 0.6]]);
    wInk(p, c, 41003 + h.id * 20, [[xm, y1 + rise, z0 - 0.6], [xm, y1 + rise, z1 + 0.6]], {color: dk(roofC, 0.4), weight: 0.6});
  } else { // ridge along x: south slope (toward +z, to the camera) mid, north slope darker
    const zm = h.z;
    wFill(p, c, 41001 + h.id * 20, R(lt(roofC, 0.04)), [[x0 - 0.6, y1, zm], [x1 + 0.6, y1, zm], [x1 + 0.6, y1 + rise, zm], [x0 - 0.6, y1 + rise, zm]].map((q, i): V3 => (i < 2 ? [q[0], q[1], z1 + 0.5] : [q[0], q[1], zm])));
    wFill(p, c, 41002 + h.id * 20, R(rd), [[x0 - 0.6, y1, z0 - 0.5], [x1 + 0.6, y1, z0 - 0.5], [x1 + 0.6, y1 + rise, zm], [x0 - 0.6, y1 + rise, zm]]);
    wInk(p, c, 41003 + h.id * 20, [[x0 - 0.6, y1 + rise, zm], [x1 + 0.6, y1 + rise, zm]], {color: dk(roofC, 0.4), weight: 0.6});
  }
  if (hash(40390 + h.id) > 0.55 && px > 2) paintBox(p, c, 41010 + h.id * 20, {x0: h.x + 1, x1: h.x + 2, y0: y1 + 1, y1: y1 + rise + 1.4, z0: h.z - 0.5, z1: h.z + 0.5}, H('#8a4a38', at), {});
};

/** Frame at which the crow wave reaches a tree (inverse of `shot16Spread`: the spread front passes `t.d * (0.8 + 0.2 h) / 600`). */
const arriveN = (need: number): number => { let n = 1; while (n < 60 && 0.04 + 0.96 * smooth((n - 1) / 49) < need) n += 0.5; return n; };
/** A canopy of lobed clumps (R2.1 F10; never a sphere): dark underside clumps, the body, then lit caps toward the sun (-x, up) so each tree has a shadow side; bare grey crowns as the leaves go; crow flecks (small chevrons) only on the canopy edge, a lift-and-settle flutter (6 f, about 3 m) as the wave arrives. */
const paintTreeTop = (p: Painter, c: YCam, t: Tree, s: number, amt: number, spread: number, H: (col: string, at: V3, k?: number) => string, n = 0) => {
  const cen: V3 = [t.x, 6.5, t.z], q = camPoint(c, cen);
  if (!q) return;
  const u = camUnit(c, cen), r = t.r * (0.5 + 0.5 * amt) * u, at: V3 = [t.x, 0, t.z], base = pal(s, Math.abs(t.id)), id = Math.abs(t.id);
  if (r < 1.2) return;
  const trunk = camPoint(c, [t.x, 0.2, t.z]);
  if (trunk && amt < 0.7 && r > 4) hardFill(p, 42000 + id * 9 + 7, H('#4a3d34', at), ell(trunk[0] + 0.4 * r * 0, (trunk[1] + q[1]) / 2, Math.max(1, r * 0.07), Math.abs(trunk[1] - q[1]) / 2, 6));
  const lobes = (k: number, dx: number, dy: number, sc: number, col: string, seed: number) => {
    for (let i = 0; i < k; i++) {
      const a = (i / k) * 6.283 + hash(seed + id * 3) * 2, d = r * (0.38 + 0.3 * hash(seed + 1 + id * 5 + i)), sz = r * sc * (0.5 + 0.22 * hash(seed + 2 + id * 5 + i));
      hardFill(p, seed + 7 * id + i, col, lump(q[0] + Math.cos(a) * d + dx * r, q[1] + Math.sin(a) * d * 0.82 + dy * r, sz, sz * 0.86, seed + id + i, 12));
    }
  };
  if (amt > 0.12) {
    lobes(6, 0.1, 0.16, 0.62, H(dk(base, 0.5), at), 42000); // underside and shadow side (toward +x, down)
    lobes(6, 0.06, 0.04, 0.58, H(dk(base, 0.2), at), 42060);
    lobes(5, -0.1, -0.12, 0.5, H(base, at), 42120);
    lobes(3, -0.28, -0.3, 0.3, H(lt(base, 0.35), at), 42180); // lit caps on the sun side
  } else if (amt < 0.75 && r > 3) {
    // bare grey crown (winter): a soft crown of fine twigs the flecks sit on
    washAt(p, 42240 + id, H(mixColor('#6a6058', '#8a7e72', 0.4), at), 80, lump(q[0], q[1], r * 0.9, r * 0.75, 42250 + id, 14), 0.15, 0.3);
  }
  if (amt < 0.75 && r > 3) { // bare limbs
    const w = Math.max(0.6, r * 0.035), col = H(mixColor('#5b5048', '#7a6e64', 0.3), at);
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * 6.283 + hash(42200 + id) * 3;
      wInk(p, c, 42300 + id * 8 + k, [[t.x, 5, t.z], [t.x + Math.cos(a) * t.r * 0.5, 7.8, t.z + Math.sin(a) * t.r * 0.5], [t.x + Math.cos(a) * t.r * 0.95, 9.4, t.z + Math.sin(a) * t.r * 0.95]], {color: col, weight: w, closed: false});
    }
  }
  // crow flecks: trees within the spread front carry 2-4 dark chevrons on the canopy EDGE (never at the centre, never paired); each lifts about 3 m and settles in 6 f as the wave arrives
  const front = 40 + 560 * spread, need = (t.d * (0.8 + 0.2 * hash(43600 + id))) / 600;
  if (t.d < front && hash(43500 + id) < 0.88 - 0.4 * (t.d / 600) && spread * 600 > t.d * (0.8 + 0.2 * hash(43600 + id))) {
    const m = 2 + Math.floor(hash(43000 + id) * 3), dot = Math.max(2.2, 0.36 * camUnit(c, cen));
    const kf = clamp01((n - arriveN(need)) / 6), lift = Math.sin(Math.PI * kf) * 3 * u * (kf > 0 && kf < 1 ? 1 : 0);
    for (let k = 0; k < m; k++) {
      const a = (hash(43100 + id * 7) + (k + 0.3 * hash(43110 + id * 7 + k)) / m) * 6.283, rr = Math.max(r, 5) * (0.8 + 0.18 * hash(43200 + id * 7 + k));
      const x = q[0] + Math.cos(a) * rr - r * 0.04, y = q[1] + Math.sin(a) * rr * 0.8 - r * 0.04 - lift * (0.6 + 0.4 * hash(43120 + id + k));
      hardFill(p, 43300 + id * 9 + k, '#14161c', [[x - dot * 1.5, y - dot * 0.2], [x, y - dot * 0.9], [x + dot * 1.5, y - dot * 0.2], [x, y + dot * 0.5]]);
    }
  }
};

// ---- the shot 16 move (S01-B04-SH03, 61 f): crane up and back from the wire over NT to the aerial; the season runs summer -> autumn -> winter across it
const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
type K = {pos: V3; at: V3};
const KEYS16: K[] = [{pos: [6.0, 8.0, 2.0], at: [5.0, 6.0, -3.5]}, {pos: [12, 200, 50], at: [0, 0, -80]}, {pos: [20, 380, 100], at: [0, 0, -150]}];
/** The camera at shot-local frame `n` (0..60): ease-in-out over the three keys (+0, +30 = camLF04A, +60); hy 960 -> 700 over +0..+15. */
export const shot16Cam = (n: number): YCam => {
  const t = smooth(n / 60), seg = t < 0.5 ? 0 : 1, u = t < 0.5 ? t * 2 : (t - 0.5) * 2, a = KEYS16[seg], b = KEYS16[seg + 1];
  const mix = (x: V3, y: V3): V3 => [lerp(x[0], y[0], u), lerp(x[1], y[1], u), lerp(x[2], y[2], u)];
  return lookCam(mix(a.pos, b.pos), mix(a.at, b.at), 900, {hy: lerp(960, 700, smooth(n / 15)), near: 0.05});
};
/** Season clock at +n: summer until +14, autumn by +30 (held to +38), winter by +50 (held). */
export const shot16Season = (n: number) => (n < 30 ? smooth((n - 14) / 16) : 1 + smooth((n - 38) / 12));
/** How far the crow clusters have spread (0..1) at +n: first clusters beyond the campus at +1, many streets lit by +23, the whole view by +50. */
export const shot16Spread = (n: number) => 0.04 + 0.96 * smooth((n - 1) / 49);
/** Path-set states for the first frames of the move (summer -> autumn dissolve), until the aerial takes over. */
const PATH16: StateKey[] = [{n: 0, state: {season: 'summer', nest: 'full'}}, {n: 14, dur: 16, state: {season: 'autumn', nest: 'full'}}];
/** Aerial opacity over the path set during the hand-off (the camera passes y 40 at about +12): 0 below y 30, 1 above y 90. */
export const shot16Handoff = (c: YCam) => smooth((c.y - 32) / 36);

/** Paint shot 16 at frame `n`: the path set (while low), the aerial layered in over the hand-off, then the aerial alone. `movers` (the crows at the wire) belong to the path set. */
export const paintShot16 = (p: Painter, n: number, movers: Item[] = []) => {
  const c = shot16Cam(n), h = shot16Handoff(c), st: AerialState = {s: shot16Season(n), spread: shot16Spread(n), t: n / 30, n};
  if (h < 1) {
    const now = seasonAt(PATH16, n, st.t);
    const set = (pp: Painter, s: PathState) => { paintPathBack(pp, c, s); paintSorted(pp, c, pathItems(s)); };
    set(p, now.a);
    if (now.b) set(p.layer(now.u, 77100), now.b);
    paintSorted(p, c, movers);
  }
  if (h > 0.01) paintAerial(h >= 1 ? p : p.layer(h, 77200), c, st);
  return c;
};

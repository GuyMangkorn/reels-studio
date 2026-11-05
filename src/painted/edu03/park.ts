import {drawAnimal, ANIMALS, type AnimalPose} from '../kit/animals';
import {drawFigure, type FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, INK, limb, solid, washAt} from '../kit/draw';
import type {InteriorLight} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseFor, type AnyPoseId} from '../kit/poses';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {camPoint, camSpace, camToPicture, camUnit, type YCam} from '../kit/ycam';
import {OWNER, OWNER_B04, PARK_LIGHT, paintFaceKey, paintSlingBag} from './cast';
import {paintBox, paintSorted, qy, sphereAt, wFill, wInk, wWash, wp, type Item} from './world';

// EDU-EP03-SHORT SET-PARK (brief EDU-BRIEF-R1 VD04, set plan): a Bangkok public park in world metres (`PARK` space: origin at the red
// ball's rest point R0, +x right, +z toward the default camera), drawn through the kit yaw camera. Look-defining asset written at the
// W3 look frame; ENV-P01: the set stays in this episode. Every mark is a pure function of the camera and the state (seeded per element).

/** Colour key, normal view (brief "Colour and value key"). */
export const K = {
  skyTop: '#8fc3ea', skyLow: '#f3e6c4', lawn: '#6fae45', lawnLight: '#82bd55', lawnShade: '#3f7f3a', tuft: '#4f8f3c', tuftDark: '#3d7a30',
  leaf: '#4f8f3c', leafDark: '#2f5f34', yellow: '#fbd21a', yellowDark: '#e0b414', flame: '#e04a2a', flameDark: '#c43a1e',
  path: '#d8cfb8', kerb: '#c2b9a2', marigold: '#f0a020', marigoldDark: '#e0801a',
  bark: '#7a5a3c', haze: '#a9bccb', roof: '#b5473a', white: '#f2eee4', lamp: '#3b4a44', bin: '#4f8a52', wood: '#a9794a',
} as const;
export const BALLS = {
  red: {base: '#d6332b', hi: '#ff8a74', shade: '#8f1f1a'},
  blue: {base: '#2f6fd8', hi: '#9cc3ff', shade: '#1d4590'},
} as const;
export type BallColor = keyof typeof BALLS;
/** Ball Ø 0.10 m (stylised ~1.4x a real 0.07 m dog ball; brief set plan). */
export const BALL_R = 0.05;

export const POS = {
  R0: [0, 0, 0] as V3, L1: [-0.6, 0, -0.2] as V3, O: [-4.5, 0, -1.5] as V3, D0: [-3.85, 0, -0.85] as V3, S1: [2.6, 0, -1.0] as V3,
  TREE_Y: [-4.0, 0, -8.5] as V3, TREE_R: [5.0, 0, -10.0] as V3, BENCH: [-6.8, 0, -3.6] as V3, LAMP: [4.8, 0, -5.0] as V3, BIN: [-2.8, 0, -5.0] as V3, SALA: [-9, 0, -18] as V3,
};
/** Camera targets (brief "Camera targets"). */
export const T = {BALL: [0, 0.05, 0] as V3, OWNER: [-4.5, 1.25, -1.5] as V3, TWO: [-4.2, 0.8, -1.3] as V3, DOG_S1: [2.6, 0.45, -1.0] as V3, PARK: [0, 1.5, -5] as V3};

const rgt = (c: YCam): [number, number] => [Math.cos(c.yaw), Math.sin(c.yaw)];
/** Camera-facing billboard: local (u right, v up) metres to world points at `base`. */
const bb = (c: YCam, base: V3, pts: [number, number][]): V3[] => { const [rx, rz] = rgt(c); return pts.map(([u, v]): V3 => [base[0] + rx * u, base[1] + v, base[2] + rz * u]); };
const horizonY = (c: YCam) => camToPicture(c, camSpace(c, [c.x + 1e4 * Math.sin(c.yaw), c.y, c.z - 1e4 * Math.cos(c.yaw)]))[1];
/** Irregular lobe around (u, v): n points, radius jitter by hash. */
const lobe = (u: number, v: number, rx: number, ry: number, seed: number, n = 14): [number, number][] =>
  Array.from({length: n}, (_, i): [number, number] => { const a = (i / n) * 6.283, j = 1 + 0.16 * (hash(seed + i * 3.1) - 0.5); return [u + rx * j * Math.cos(a), v + ry * j * Math.sin(a)]; });
const dab = (p: Painter, seed: number, color: string, c: YCam, at: V3, r: number, passes = 2) => {
  const s = sphereAt(c, at, r);
  if (s && s.r > 0.6) solid(p, seed, color, ell(s.x, s.y, s.r, s.r * 0.9, 9), passes, 0.05, 0.12);
};

// ------------------------------------------------------------------------------------------------------------------ ground
const paintGround = (p: Painter, c: YCam) => {
  const hz = horizonY(c);
  paintSkyBands(p, {from: K.skyTop, to: K.skyLow, via: '#c9dcea', viaAt: 0.5, horizon: hz + 2, width: 1080, bands: 8, top: -200});
  p.flat(K.lawn, [[-200, hz - 4], [1280, hz - 4], [1280, 2200], [-200, 2200]]);
};
const paintHaze = (p: Painter, c: YCam) => {
  // City haze: pale blue-grey high-rise silhouettes far behind the tree line, very low contrast.
  const z = -52;
  for (let i = 0; i < 18; i++) {
    const w = 3.5 + hash(i * 7.3) * 5, h = 14 + hash(i * 3.7 + 1) * 22, x = -70 + i * 8 + hash(i) * 3;
    const col = mixColor('#9db5c8', '#cfe0ec', 0.3 + 0.35 * hash(i * 5.1));
    wFill(p, c, 5200 + i * 2, col, [[x, 0, z], [x + w, 0, z], [x + w, h, z], [x, h, z]]);
    if (i % 3 === 0) wFill(p, c, 5201 + i * 2, mixColor(col, '#cfe0ec', 0.3), [[x + w * 0.2, h, z], [x + w * 0.8, h, z], [x + w * 0.8, h + 3, z], [x + w * 0.2, h + 3, z]]);
  }
};
const paintTreeLine = (p: Painter, c: YCam) => {
  // Far tree line at z -16, height 8-10, soft washes in two greens.
  for (let i = 0; i < 26; i++) {
    const x = -50 + i * 4 + hash(i * 2.2) * 2, h = 6 + hash(i * 4.1) * 3, r = 3 + hash(i * 1.7) * 1.8;
    const col = mixColor(K.leafDark, K.leaf, 0.2 + 0.5 * hash(i * 9.1));
    const q = wp(c, bb(c, [x, 0, -16], lobe(0, h - r * 0.9, r, r * 1.1, 600 + i)));
    if (q.length >= 3) solid(p, 5400 + i, col, q, 3, 0.05, 0.15);
  }
  const base = wp(c, qy(0.0, -60, 60, -17.5, -15.5).map((v): V3 => [v[0], v[1] + 0.001, v[2]]));
  if (base.length >= 3) solid(p, 5440, K.leafDark, base, 2, 0.04, 0.1);
};
const paintLawn = (p: Painter, c: YCam) => {
  wFill(p, c, 5500, K.lawn, qy(0, -70, 70, -17, 8));
  // Mown stripes along x (z bands), every other one lighter; shade patches under the two trees.
  for (let i = 0, z = -16; z < 6; i++, z += 1.5) if (i % 2 === 0) wWash(p, c, 5510 + i, K.lawnLight, 255, qy(0.001, -70, 70, z, z + 1.5), 0.06, 0.3);
    else wWash(p, c, 5510 + i, mixColor(K.lawn, '#2f6a2f', 0.16), 140, qy(0.001, -70, 70, z, z + 1.5), 0.06, 0.3);
  wWash(p, c, 5540, K.lawnShade, 140, ellWorld([POS.TREE_Y[0] + 1.6, 0.002, POS.TREE_Y[2] + 2.2], 3.6, 2.0), 0.1, 0.3);
  wWash(p, c, 5541, K.lawnShade, 130, ellWorld([POS.TREE_R[0] + 1.8, 0.002, POS.TREE_R[2] + 2.0], 4.2, 2.2), 0.1, 0.3);
};
const ellWorld = (at: V3, rx: number, rz: number, n = 22): V3[] => Array.from({length: n}, (_, i): V3 => [at[0] + rx * Math.cos((i / n) * 6.283), at[1], at[2] + rz * Math.sin((i / n) * 6.283)]);
const ellGround = (c: YCam, at: V3, rx: number, rz: number, n = 22) => wp(c, ellWorld(at, rx, rz, n));
const paintPath = (p: Painter, c: YCam) => {
  wFill(p, c, 5600, K.path, qy(0.002, -70, 70, -6.5, -4.5));
  for (let x = -40; x < 40; x += 2) wInk(p, c, 5610 + (x + 40), [[x, 0.003, -6.5], [x, 0.003, -4.5]], {closed: false, color: mixColor(K.path, INK, 0.28), weight: 0.45});
  wWash(p, c, 5602, '#f6efd9', 90, qy(0.003, -70, 70, -5.9, -5.3), 0.05, 0.3);
  paintBox(p, c, 5620, {x0: -70, x1: 70, y0: 0, y1: 0.12, z0: -4.62, z1: -4.5}, K.kerb, {}, {});
  paintBox(p, c, 5630, {x0: -70, x1: 70, y0: 0, y1: 0.12, z0: -6.62, z1: -6.5}, K.kerb, {}, {});
};
const paintMarigolds = (p: Painter, c: YCam) => {
  paintBox(p, c, 5700, {x0: -2, x1: 2, y0: 0, y1: 0.14, z0: -4.9, z1: -4.1}, '#6b4a30', {}, {ink: true});
  for (let i = 0; i < 70; i++) { // leaves
    const x = -1.95 + hash(i * 1.3) * 3.9, z = -4.85 + hash(i * 2.9) * 0.7;
    dab(p, 5720 + i, mixColor(K.leaf, K.leafDark, hash(i) * 0.6), c, [x, 0.2 + hash(i * 5.2) * 0.08, z], 0.09, 1);
  }
  for (let i = 0; i < 90; i++) { // blooms
    const x = -1.95 + hash(i * 3.3 + 1) * 3.9, z = -4.85 + hash(i * 1.9 + 2) * 0.7, y = 0.26 + hash(i * 4.4) * 0.14;
    dab(p, 5800 + i * 2, hash(i * 7) > 0.35 ? K.marigold : K.marigoldDark, c, [x, y, z], 0.075 + hash(i) * 0.03);
  }
};

// ------------------------------------------------------------------------------------------------------------------ trees and props
const paintTrunk = (p: Painter, c: YCam, seed: number, base: V3, h: number, w0: number, w1: number) => {
  const q = wp(c, bb(c, base, [[-w0 / 2, 0], [w0 / 2, 0], [w1 / 2, h], [-w1 / 2, h]]));
  if (q.length >= 3) { solid(p, seed, K.bark, q, 8, 0.05, 0.12); inkLine(p, seed + 1, q, {weight: 0.8, color: mixColor(K.bark, INK, 0.55)}); }
  const r = wp(c, bb(c, base, [[w0 * 0.1, 0], [w0 / 2, 0], [w1 / 2, h], [w1 * 0.1, h]]));
  if (r.length >= 3) washAt(p, seed + 2, '#4a3422', 110, r, 0.08, 0.3);
};
const treeY = (p: Painter, c: YCam): Item => ({at: POS.TREE_Y, draw: () => {
  const b = POS.TREE_Y;
  paintTrunk(p, c, 6000, b, 3.4, 0.5, 0.3);
  const lobes: [number, number, number, number][] = [[-1.5, 4.6, 1.5, 1.0], [0.2, 5.4, 1.9, 1.2], [1.6, 4.8, 1.4, 1.0], [-0.4, 6.1, 1.5, 0.8], [-1.9, 5.7, 1.1, 0.8], [1.9, 5.9, 1.0, 0.8]];
  lobes.forEach(([u, v, rx, ry], i) => { const q = wp(c, bb(c, b, lobe(u, v, rx, ry, 610 + i))); if (q.length >= 3) { solid(p, 6010 + i, mixColor(K.leaf, K.leafDark, 0.2 + 0.1 * i % 0.5), q, 3, 0.07, 0.2); } });
  // Hanging yellow flower chains (ราชพฤกษ์): tapered strips from the canopy down, in two yellows.
  for (let i = 0; i < 80; i++) {
    const u = -2.4 + hash(i * 1.37) * 4.8, top = 4.2 + 1.5 * (1 - Math.abs(u) / 2.6) + hash(i * 2.1) * 0.5, len = 0.7 + hash(i * 3.3) * 0.9, sway = (hash(i * 5.5) - 0.5) * 0.25;
    const col = hash(i * 9.7) > 0.3 ? K.yellow : K.yellowDark;
    const n = Math.round(4 + len * 4);
    for (let k = 0; k < n; k++) { // a chain = stacked blossom dabs, wide near the stem and tapering, drifting a little
      const w = k / (n - 1), r = 0.085 - 0.04 * w, ux = u + sway * w + 0.03 * Math.sin(i + k * 1.7);
      dab(p, 6100 + i * 10 + k, k % 3 === 1 ? K.yellowDark : col, c, bb(c, b, [[ux, top - len * w]])[0], r, 1);
    }
  }
}});
const treeR = (p: Painter, c: YCam): Item => ({at: POS.TREE_R, draw: () => {
  const b = POS.TREE_R;
  paintTrunk(p, c, 6500, b, 3.6, 0.55, 0.35);
  // Umbrella canopy Ø 7: wide flat lobes, leaf green; flame-red blooms on top of feathery leaves.
  const lobes: [number, number, number, number][] = [[-2.4, 4.4, 1.7, 0.9], [-0.6, 5.0, 2.0, 1.0], [1.4, 5.0, 2.0, 1.0], [2.9, 4.5, 1.5, 0.8], [0.4, 4.3, 1.8, 0.7]];
  lobes.forEach(([u, v, rx, ry], i) => { const q = wp(c, bb(c, b, lobe(u, v, rx, ry, 650 + i))); if (q.length >= 3) solid(p, 6510 + i, mixColor(K.leaf, K.leafDark, 0.15 * i % 0.45), q, 3, 0.07, 0.2); });
  for (let i = 0; i < 40; i++) { // feathery leaves
    const u = -3.2 + hash(i * 1.9) * 6.4, v = 4.2 + hash(i * 3.1) * 1.3;
    inkLine(p, 6600 + i, bb(c, b, [[u, v], [u + 0.25, v + 0.12], [u + 0.5, v + 0.05]]).map((w) => camPoint(c, w) as Pt), {closed: false, weight: 0.5, color: K.leafDark});
  }
  for (let i = 0; i < 110; i++) {
    const u = -3.2 + hash(i * 2.3 + 1) * 6.4, v = 4.1 + hash(i * 1.1 + 3) * 1.5 + (1 - Math.abs(u) / 3.4) * 0.3;
    dab(p, 6700 + i * 2, hash(i * 7.7) > 0.4 ? K.flame : K.flameDark, c, bb(c, b, [[u, v]])[0], 0.14 + hash(i * 4.1) * 0.12);
  }
}});
const bench = (p: Painter, c: YCam): Item => ({at: POS.BENCH, draw: () => {
  const [x, , z] = POS.BENCH;
  paintBox(p, c, 7000, {x0: x - 0.8, x1: x - 0.7, y0: 0, y1: 0.42, z0: z - 0.2, z1: z + 0.2}, '#8f8a80', {}, {ink: true});
  paintBox(p, c, 7010, {x0: x + 0.7, x1: x + 0.8, y0: 0, y1: 0.42, z0: z - 0.2, z1: z + 0.2}, '#8f8a80', {}, {ink: true});
  for (let i = 0; i < 3; i++) paintBox(p, c, 7020 + i * 6, {x0: x - 0.8, x1: x + 0.8, y0: 0.42, y1: 0.47, z0: z - 0.22 + i * 0.15, z1: z - 0.1 + i * 0.15}, K.wood, {}, {ink: true});
  for (let i = 0; i < 2; i++) paintBox(p, c, 7050 + i * 6, {x0: x - 0.8, x1: x + 0.8, y0: 0.62 + i * 0.16, y1: 0.72 + i * 0.16, z0: z - 0.24, z1: z - 0.2}, K.wood, {}, {ink: true});
}});
const lamp = (p: Painter, c: YCam): Item => ({at: POS.LAMP, draw: () => {
  const b = POS.LAMP, col = K.lamp;
  const pole = wp(c, bb(c, b, [[-0.045, 0], [0.045, 0], [0.035, 3.3], [-0.035, 3.3]]));
  if (pole.length >= 3) { solid(p, 7100, col, pole, 3, 0.04, 0.1); inkLine(p, 7101, pole, {weight: 0.6, color: INK}); }
  const base = wp(c, bb(c, b, [[-0.11, 0], [0.11, 0], [0.07, 0.35], [-0.07, 0.35]]));
  if (base.length >= 3) solid(p, 7102, col, base, 3, 0.04, 0.1);
  const head = wp(c, bb(c, b, [[-0.17, 3.3], [0.17, 3.3], [0.13, 3.55], [-0.13, 3.55]]));
  if (head.length >= 3) { solid(p, 7103, mixColor(col, '#fff2c0', 0.1), head, 3, 0.04, 0.1); inkLine(p, 7104, head, {weight: 0.7, color: INK}); }
}});
const bin = (p: Painter, c: YCam): Item => ({at: POS.BIN, draw: () => {
  const b = POS.BIN;
  const body = wp(c, bb(c, b, [[-0.25, 0], [0.25, 0], [0.23, 0.82], [-0.23, 0.82]]));
  if (body.length >= 3) { solid(p, 7200, K.bin, body, 3, 0.05, 0.12); inkLine(p, 7201, body, {weight: 0.8, color: mixColor(K.bin, INK, 0.6)}); }
  const lid = wp(c, bb(c, b, [[-0.27, 0.82], [0.27, 0.82], [0.24, 0.92], [-0.24, 0.92]]));
  if (lid.length >= 3) { solid(p, 7202, mixColor(K.bin, '#1c3a22', 0.45), lid, 3, 0.05, 0.12); inkLine(p, 7203, lid, {weight: 0.8, color: INK}); }
  const sh = wp(c, bb(c, b, [[0.1, 0], [0.25, 0], [0.23, 0.82], [0.12, 0.82]]));
  if (sh.length >= 3) washAt(p, 7204, '#1f3a26', 100, sh, 0.06, 0.3);
}});
const sala = (p: Painter, c: YCam): Item => ({at: POS.SALA, draw: () => {
  const [x, , z] = POS.SALA, haze = (col: string) => mixColor(col, K.skyLow, 0.18);
  paintBox(p, c, 7300, {x0: x - 1.6, x1: x + 1.6, y0: 0, y1: 0.4, z0: z - 1.6, z1: z + 1.6}, haze('#d9d2c2'), {}, {});
  for (const [dx, dz] of [[-1.4, -1.4], [1.3, -1.4], [-1.4, 1.3], [1.3, 1.3]]) paintBox(p, c, 7310 + (dx > 0 ? 6 : 0) + (dz > 0 ? 12 : 0), {x0: x + dx, x1: x + dx + 0.12, y0: 0.4, y1: 3.0, z0: z + dz, z1: z + dz + 0.12}, haze(K.white), {}, {});
  const roof = wp(c, bb(c, POS.SALA, [[-2.4, 3.0], [2.4, 3.0], [1.2, 4.1], [-1.2, 4.1]]));
  if (roof.length >= 3) { solid(p, 7330, haze(K.roof), roof, 3, 0.05, 0.12); inkLine(p, 7331, roof, {weight: 0.8, color: mixColor(K.roof, INK, 0.5)}); }
  const apex = wp(c, bb(c, POS.SALA, [[-0.1, 4.1], [0.1, 4.1], [0.05, 4.7], [-0.05, 4.7]]));
  if (apex.length >= 3) solid(p, 7332, haze('#d9b84a'), apex, 3, 0.04, 0.1);
}});

// ------------------------------------------------------------------------------------------------------------------ balls, shadows, tufts
export type BallState = {at: V3; color: BallColor; /** Picture-radius scale (a ball held toward the lens is nearer than its body). */ scale?: number};

/** Painted sphere: shade disc, lit disc offset toward the sun (upper left), highlight, seam, ink outline. */
export const paintBallDisc = (p: Painter, seed: number, cx: number, cy: number, r: number, color: BallColor) => {
  const k = BALLS[color], line = mixColor(k.base, INK, 0.6);
  solid(p, seed, k.shade, ell(cx, cy, r, r, 18), 6, 0.03, 0.08);
  solid(p, seed + 1, k.base, ell(cx - 0.13 * r, cy - 0.13 * r, 0.86 * r, 0.86 * r, 18), 10, 0.02, 0.06);
  const seam = Array.from({length: 9}, (_, i): Pt => { const a = (-0.95 + (i / 8) * 1.9); return [cx + 0.98 * r * Math.sin(a), cy + (0.18 * r) - 0.28 * r * Math.cos(a)]; });
  inkLine(p, seed + 2, seam, {closed: false, weight: 0.5, color: mixColor(k.base, k.shade, 0.5), curve: 0.2});
  solid(p, seed + 3, k.hi, ell(cx - 0.4 * r, cy - 0.42 * r, 0.22 * r, 0.14 * r, 10, -0.7), 3, 0.03, 0.08);
  inkLine(p, seed + 4, ell(cx, cy, r, r, 18), {weight: 0.8, color: line});
};
const groundShadow = (p: Painter, c: YCam, seed: number, at: V3, rx: number, rz: number, dx: number, dz: number, op = 120) => {
  const q = ellGround(c, [at[0] + dx, 0.004, at[2] + dz], rx, rz, 18);
  if (q.length >= 3) washAt(p, seed, '#24441f', op, q, 0.12, 0.2);
  const core = ellGround(c, [at[0] + dx * 0.5, 0.005, at[2] + dz * 0.5], rx * 0.55, rz * 0.55, 14);
  if (core.length >= 3) washAt(p, seed + 1, '#17300f', op * 0.8, core, 0.08, 0.2);
};
const ballItem = (p: Painter, c: YCam, b: BallState, i: number): Item => ({at: b.at, draw: () => {
  const g: V3 = [b.at[0], b.at[1] <= BALL_R + 0.01 ? 0 : b.at[1], b.at[2]];
  groundShadow(p, c, 8000 + i * 20, [b.at[0], 0, b.at[2]], BALL_R * 1.6, BALL_R * 1.1, 0.07, 0.03, 190);
  const s = sphereAt(c, b.at, BALL_R * (b.scale ?? 1));
  void g;
  if (s) paintBallDisc(p, 8100 + i * 10, s.x, s.y, s.r, b.color);
}});
const tuft = (p: Painter, c: YCam, seed: number, at: V3, h: number, n = 5) => {
  for (let k = 0; k < n; k++) {
    const a = (k - (n - 1) / 2) * 0.1 + (hash(seed + k) - 0.5) * 0.06, hh = h * (0.7 + 0.5 * hash(seed + k * 2.3));
    const base = camPoint(c, [at[0] + (k - n / 2) * 0.012, 0, at[2]]), tip = camPoint(c, [at[0] + a * hh * 1.2, hh, at[2] + 0.01]);
    if (base && tip) inkLine(p, seed * 3 + k, [base, [(base[0] + tip[0]) / 2 + (hash(seed + k) - 0.5) * 3, (base[1] + tip[1]) / 2], tip], {closed: false, weight: 0.55, color: hash(seed + k * 7) > 0.5 ? K.tuftDark : K.tuft, still: true});
  }
};
const paintTufts = (p: Painter, c: YCam, region: {x0: number; x1: number; z0: number; z1: number; n: number}, skip?: (x: number, z: number) => boolean) => {
  for (let i = 0; i < region.n; i++) {
    const x = region.x0 + hash(i * 1.77 + 5) * (region.x1 - region.x0), z = region.z0 + hash(i * 2.91 + 9) * (region.z1 - region.z0);
    if (skip?.(x, z)) continue;
    tuft(p, c, 9000 + i, [x, 0, z], 0.07 + 0.06 * hash(i * 3.3), 4);
  }
  for (let i = 0; i < region.n / 3; i++) { // clover/dark dabs
    const x = region.x0 + hash(i * 4.1 + 2) * (region.x1 - region.x0), z = region.z0 + hash(i * 1.3 + 7) * (region.z1 - region.z0);
    if (skip?.(x, z)) continue;
    const q = ellGround(c, [x, 0.003, z], 0.12 + 0.1 * hash(i), 0.08, 8);
    if (q.length >= 3) washAt(p, 9600 + i, hash(i * 5) > 0.5 ? '#5a9a38' : '#3d7a30', 90, q, 0.1, 0.3);
  }
};

// ------------------------------------------------------------------------------------------------------------------ cast
export type OwnerState = {at?: V3; pose?: AnyPoseId; face?: ExpressionId; headCock?: number; /** Ball in his right hand, at chest. */ held?: BallColor; /** Scene light override (B04 face key, `PARK_LIGHT_B04`); default `PARK_LIGHT`. */ light?: InteriorLight; /** Warm face/hand light 0..1 (kit `FigPose.warm`). */ warm?: number; /** B04 face key paint (`paintFaceKey`). */ faceKey?: boolean};  // `faceKey` also switches the owner to his sunlit skin (`OWNER_B04`)
export type DogState = {at?: V3; pose: AnimalPose; ball?: undefined};
export type ParkState = {t: number; balls?: BallState[]; owner?: OwnerState; dog?: DogState; /** Skip the tufts and the haze for a cheap iteration frame. */ draft?: boolean};

const ownerItem = (p: Painter, c: YCam, st: OwnerState, t: number): Item => {
  const at = st.at ?? POS.O;
  return {at, draw: () => {
    const g = camPoint(c, at), u = camUnit(c, at);
    if (!g) return;
    groundShadow(p, c, 8300, at, 0.55, 0.28, 0.55, 0.12, 110);
    const def = st.faceKey ? OWNER_B04 : OWNER;
    const pose = poseFor(st.pose ?? 'P11', def, g, u, 'front');
    const face = EXPRESSIONS[st.face ?? 'happy'];
    const a: FigAnchors = drawFigure(p, def, g, u, {...pose, face, headCock: st.headCock, warm: st.warm, light: st.light ?? PARK_LIGHT}, t);
    if (st.faceKey) paintFaceKey(p, a, u, 8350);
    paintSlingBag(p, def, pose.kneel ? [g[0], g[1] + 0.3 * u] : g, u, 8450, a); // kneeling: the hip (and the bag on it) drops by the shin length
    if (st.held) {
      // The ball sits in his right grip (screen left), held up and a little toward the lens, so it is drawn at the nearer scale.
      const toCam: V3 = [at[0] + (c.x - at[0]) * 0.2, 0, at[2] + (c.z - at[2]) * 0.2], un = camUnit(c, toCam);
      const cx = a.rHand[0], cy = a.rHand[1] - BALL_R * un * 0.9;
      paintBallDisc(p, 8500, cx, cy, BALL_R * un, st.held);
      const fingers: Pt[] = ell(cx + 0.012 * un, cy + BALL_R * un * 0.95, 0.052 * un, 0.034 * un, 12);
      solid(p, 8510, OWNER.head.skin, fingers, 3, 0.04, 0.1);
      inkLine(p, 8511, fingers, {weight: 0.6, color: mixColor(OWNER.head.skin, INK, 0.6)});
    }
  }};
};
/** EP03 golden: lighter outline and far-leg shade (user note, 5 Nov 2026); the shared kit entry is unchanged. */
const DOG_EP03 = {...ANIMALS['dog-golden'], inkMix: 0.06, farMix: 0.12, sniffNeck: true};
const dogItem = (p: Painter, c: YCam, st: DogState, t: number): Item => {
  const at = st.at ?? POS.D0;
  return {at, draw: () => {
    const g = camPoint(c, at), u = camUnit(c, at);
    if (!g) return;
    groundShadow(p, c, 8700, at, 0.5, 0.2, 0.4, 0.1, 120);
    drawAnimal(p, ANIMALS['dog-golden'].seed, DOG_EP03, g, u, st.pose, t);
  }};
};

/** Whole park for one camera and state, far to near. */
export const paintPark = (p: Painter, c: YCam, st: ParkState) => {
  paintGround(p, c);
  if (!st.draft) paintHaze(p, c);
  paintTreeLine(p, c);
  paintLawn(p, c);
  paintPath(p, c);
  paintMarigolds(p, c);
  paintTufts(p, c, {x0: -9, x1: 9, z0: -3.8, z1: 2.5, n: st.draft ? 20 : 150});
  const items: Item[] = [treeY(p, c), treeR(p, c), bench(p, c), lamp(p, c), bin(p, c), sala(p, c)];
  if (st.owner) items.push(ownerItem(p, c, st.owner, st.t));
  if (st.dog) items.push(dogItem(p, c, st.dog, st.t));
  (st.balls ?? []).forEach((b, i) => items.push({...ballItem(p, c, b, i), bias: -0.05}));
  paintSorted(p, c, items);
};
export {hardFill, limb, tuft};

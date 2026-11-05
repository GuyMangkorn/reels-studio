import {drawFigure, type FigAnchors} from '../kit/cast';
import {blob, ell, glaze, hardFill, inkLine, INK, washAt, type InteriorLight} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseFor, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam} from '../kit/views';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {COOK, paintBibApron} from './cast';
import {flatCircle, paintBox, paintSorted, qx, qy, qz, sphereAt, wFill, wInk, wp, wWash, type Item} from './world';

// SET-KITCHEN (brief EDU-BRIEF-R1 set plan and VD03; look frame LF01, first shot S01-B01-SH02). Look-defining set written by
// Film at W3.1; Boss hardens it into shot plates at W5.2. Named space KITCHEN: metres, origin on the floor under the cutting-
// board centre, +x right as seen from the camera side, +y up, +z toward the camera side of the island (kit `ycam.ts` frame).
// Every number below is the set plan's, confirmed or revised at W3.1 (revisions in the brief change log).

export const K = {
  wall: '#efe0c4', wallShadow: '#c9a982', ceiling: '#f3e6cc', floor: '#b8674a', grout: '#8e4f3a',
  tile: '#e8e0cc', tileGrout: '#c8bba0', teal: '#7fb3a8', wood: '#c48a52', woodDark: '#9a6438', brass: '#c9a24a',
  gold: '#f6cf86', pendant: '#f2b56b', steel: '#b9c0c4', steelDark: '#7d868c', fridge: '#efe6d2', towel: '#e9dcc0',
  onion: '#c98a44', onionDark: '#9a5e2c', onionHi: '#e6b770', skyTop: '#f1d9a8', skyLow: '#f6c27a', pot: '#c2553f',
} as const;

/** The cook's key light: low gold from the window, screen left-back (travels right and down); warm room palette. */
export const KITCHEN_LIGHT: InteriorLight = {
  key: [0.7, 0.75], rim: [0.9, 0.35], rimScale: 0.8, under: true, shaped: true, handScale: 1.3,
  pal: {ambient: '#c9a982', ambientMix: 0.1, shadow: '#5a3628', shadowMix: 0.32, shadowOpacity: 140, light: '#fbe7bf', lightMix: 0.25,
    rimColor: '#f6cf86', rimMix: 0.45, rimTo: 0.09, falloff: '#3a2418', falloffOpacity: 90, hatchMix: 0.5},
};

export const SET = {
  island: {x0: -1.2, x1: 1.2, y0: 0, y1: 0.9, z0: -0.3, z1: 0.3},
  board: {x0: -0.2, x1: 0.2, y0: 0.9, y1: 0.92, z0: -0.14, z1: 0.14},
  onion: [0.02, 0.96, 0.02] as V3, onionR: 0.04,
  cook: [0, 0, -0.55] as V3,
  wallZ: -1.6, rightX: 2.6, ceilY: 2.6,
  window: {x0: -1.3, x1: -0.3, y0: 1.1, y1: 2.0},
  back: {x0: -2.6, x1: 1.2, y0: 0, y1: 0.86, z0: -1.6, z1: -1.0},
  fridge: {x0: 1.45, x1: 2.15, y0: 0, y1: 1.85, z0: -1.6, z1: -0.95},
  pendant: [0, 2.1, 0] as V3,
} as const;
/** Camera targets (brief set plan). */
export const T = {ONION: [0.02, 0.96, 0.02] as V3, FACE: [0, 1.4, -0.55] as V3, CHEST: [0, 1.15, -0.55] as V3, MID: [0, 1.15, -0.25] as V3};

const dk = (c: string, u: number) => mixColor(c, '#3a2418', u);
const lt = (c: string, u: number) => mixColor(c, '#fff4dc', u);

// ------------------------------------------------------------------ room shell

const paintShell = (p: Painter, c: YCam) => {
  const S = SET, wz = S.wallZ;
  // Ceiling and floor first, then the back and right walls (the camera never sees the left or front walls on the plan's arcs).
  wFill(p, c, 40100, K.ceiling, qy(S.ceilY, -2.6, S.rightX, wz, 3));
  wFill(p, c, 40110, K.floor, qy(0, -2.6, S.rightX, wz, 3));
  for (let i = -8; i <= 8; i++) wFill(p, c, 40120 + i, K.grout, qy(0.001, i * 0.32 - 0.008, i * 0.32 + 0.008, wz, 3));
  for (let j = 0; j < 14; j++) wFill(p, c, 40140 + j, K.grout, qy(0.001, -2.6, S.rightX, wz + j * 0.32 - 0.008, wz + j * 0.32 + 0.008));
  for (let i = 0; i < 9; i++) wWash(p, c, 40160 + i, dk(K.floor, 0.18), 60, qy(0.002, -1.6 + i * 0.5, -1.35 + i * 0.5, -1.0 + 0.3 * hash(i), -0.7 + 0.3 * hash(i)), 0.3, 0.7);
  // Back wall plaster: flat base, two glazes for warmth, stains and a cool shadow toward the right.
  const back = qz(wz, -2.6, S.rightX, 0, S.ceilY);
  wFill(p, c, 40200, K.wall, back);
  wWash(p, c, 40201, lt(K.wall, 0.3), 70, qz(wz, -1.9, 0.3, 0.9, 2.3), 0.4, 0.5);
  wWash(p, c, 40202, K.wallShadow, 80, qz(wz, 0.9, S.rightX, 0.9, S.ceilY), 0.35, 0.6);
  wWash(p, c, 40203, K.wallShadow, 55, qz(wz, -2.6, S.rightX, 2.25, S.ceilY), 0.3, 0.6);
  const stains: [number, number, number, number][] = [[0.3, 2.3, 0.22, 0.12], [-1.7, 1.75, 0.18, 0.25], [1.05, 1.55, 0.14, 0.1], [-0.1, 2.45, 0.3, 0.08]];
  stains.forEach(([x, y, rx, ry], i) => {
    const q = wp(c, Array.from({length: 14}, (_, k): V3 => [x + rx * Math.cos(k * 0.449) * (0.8 + 0.4 * hash(i * 9 + k)), y + ry * Math.sin(k * 0.449), wz + 0.001]));
    if (q.length >= 3) washAt(p, 40210 + i, dk(K.wall, 0.16), 55, q, 0.45, 0.7);
  });
  // Right wall (fridge side), in the window's shadow.
  wFill(p, c, 40230, dk(K.wall, 0.14), qx(S.rightX, 0, S.ceilY, wz, 3));
  wWash(p, c, 40231, K.wallShadow, 90, qx(S.rightX - 0.001, 0, S.ceilY, wz, 3), 0.3, 0.6);
  // Corner line and skirting.
  wFill(p, c, 40232, dk(K.wall, 0.3), qx(S.rightX - 0.002, 0, S.ceilY, wz, wz + 0.02));
  // Tiled splash-back band behind the back counter (y 0.90-1.40) with grout.
  wFill(p, c, 40240, K.tile, qz(wz + 0.002, -2.6, 1.2, 0.86, 1.4));
  for (let k = 1; k < 4; k++) wFill(p, c, 40241 + k, K.tileGrout, qz(wz + 0.003, -2.6, 1.2, 0.86 + k * 0.135 - 0.004, 0.86 + k * 0.135 + 0.004));
  for (let i = 0; i < 26; i++) {
    const x = -2.6 + i * 0.15, row = i % 2 ? 0.0675 : 0;
    for (let k = 0; k < 4; k++) wFill(p, c, 40250 + i * 4 + k, K.tileGrout, qz(wz + 0.003, x + row - 0.004, x + row + 0.004, 0.86 + k * 0.135, 0.86 + (k + 1) * 0.135));
  }
  wWash(p, c, 40370, K.wallShadow, 50, qz(wz + 0.004, 0.2, 1.2, 0.86, 1.4), 0.3, 0.6);
};

// ------------------------------------------------------------------ window, light and sky

const paintWindow = (p: Painter, c: YCam, t: number) => {
  const w = SET.window, z = SET.wallZ;
  // Late-afternoon sky in bands, a far roofline and a tree, seen through the opening.
  const bands = 7;
  for (let i = 0; i < bands; i++) {
    const y0 = w.y1 - ((w.y1 - w.y0) * i) / bands, y1 = w.y1 - ((w.y1 - w.y0) * (i + 1.25)) / bands;
    wFill(p, c, 40400 + i, mixColor(K.skyTop, K.skyLow, i / (bands - 1)), qz(z - 0.01, w.x0, w.x1, Math.max(w.y0, y1), y0));
  }
  wFill(p, c, 40410, '#d9a873', [[w.x0, w.y0, z - 0.012], [w.x0, w.y0 + 0.22, z - 0.012], [w.x0 + 0.3, w.y0 + 0.26, z - 0.012], [w.x0 + 0.32, w.y0 + 0.18, z - 0.012], [w.x1, w.y0 + 0.2, z - 0.012], [w.x1, w.y0, z - 0.012]]);
  for (let k = 0; k < 3; k++) {
    const tree = wp(c, Array.from({length: 14}, (_, i): V3 => [w.x1 - 0.18 + 0.07 * k + 0.07 * Math.cos(i * 0.449) * (0.8 + 0.3 * hash(i + k * 20)), w.y0 + 0.3 + 0.05 * k + 0.06 * Math.sin(i * 0.449), z - 0.011]));
    if (tree.length >= 3) washAt(p, 40411 + k, ['#9aa060', '#8a9454', '#a8a868'][k], 140, tree, 0.2, 0.4);
  }
  // Sun glow low in the window.
  const sun = camPoint(c, [w.x0 + 0.3, w.y0 + 0.42, z - 0.02]);
  if (sun) paintHalo(p, {x: sun[0], y: sun[1], r: 0.35 * camUnit(c, [w.x0 + 0.3, w.y0 + 0.42, z]), color: '#fff0c8', level: 0.8, squash: 1, seed: 40420});
  // Frame, mullion and transom (crisp), sill.
  const fr = 0.05, F = '#f4ead6';
  wFill(p, c, 40430, F, qz(z + 0.005, w.x0 - fr, w.x1 + fr, w.y1, w.y1 + fr));
  wFill(p, c, 40431, F, qz(z + 0.005, w.x0 - fr, w.x0, w.y0, w.y1 + fr));
  wFill(p, c, 40432, F, qz(z + 0.005, w.x1, w.x1 + fr, w.y0, w.y1 + fr));
  wFill(p, c, 40433, F, qz(z + 0.005, (w.x0 + w.x1) / 2 - 0.02, (w.x0 + w.x1) / 2 + 0.02, w.y0, w.y1));
  wFill(p, c, 40434, F, qz(z + 0.005, w.x0, w.x1, w.y0 + 0.58, w.y0 + 0.62));
  paintBox(p, c, 40440, {x0: w.x0 - 0.1, x1: w.x1 + 0.1, y0: w.y0 - 0.04, y1: w.y0, z0: z, z1: z + 0.1}, '#f0e2c6', {}, {ink: false});
  wInk(p, c, 40445, qz(z + 0.006, w.x0 - fr, w.x1 + fr, w.y0, w.y1 + fr), {color: dk(F, 0.5), weight: 0.6});
  // Basil pot on the sill.
  const pot = [w.x0 + 0.24, w.y0, z + 0.05] as V3;
  paintBox(p, c, 40450, {x0: pot[0] - 0.06, x1: pot[0] + 0.06, y0: w.y0, y1: w.y0 + 0.11, z0: pot[2] - 0.04, z1: pot[2] + 0.04}, '#c87a4f', {}, {ink: true});
  for (let k = 0; k < 7; k++) {
    const lf = sphereAt(c, [pot[0] - 0.07 + 0.024 * k, w.y0 + 0.15 + 0.05 * hash(k * 3), pot[2] + 0.03], 0.035);
    if (lf) washAt(p, 40460 + k, k % 2 ? '#6f8f4a' : '#86a356', 170, ell(lf.x, lf.y, lf.r, lf.r * 0.7, 12, 0.4 * k), 0.15, 0.3);
  }
  void t;
};

/** Light patches lighten (a watercolour wash only darkens): a flat warm veil at partial opacity, stacked twice for a soft edge. */
const lightVeil = (p: Painter, c: YCam, seed: number, a: number, pts: V3[]) => {
  const q = wp(c, pts);
  if (q.length < 3) return;
  const cx = q.reduce((s, v) => s + v[0], 0) / q.length, cy = q.reduce((s, v) => s + v[1], 0) / q.length;
  hardFill(p.layer(a * 0.5, seed), seed, '#fff1c8', q);
  hardFill(p.layer(a * 0.6, seed + 1), seed + 1, '#fff1c8', q.map(([x, y]): Pt => [cx + (x - cx) * 0.7, cy + (y - cy) * 0.7]));
};

/** Gold window light: a soft beam falling on the back counter and the island top, peak about 0.3 (VD03, UT04). */
const paintWindowLight = (p: Painter, c: YCam) => {
  const w = SET.window;
  lightVeil(p, c, 40500, 0.2, [[w.x0, 0.902, -1.55], [w.x1 + 0.5, 0.902, -1.55], [w.x1 + 0.9, 0.902, -1.02], [w.x0 + 0.2, 0.902, -1.02]]);
};

// ------------------------------------------------------------------ back counter, sink, stove, shelf, rail, fridge, pendant

const backCounter = (t: number): Item => ({
  at: [-0.7, 0, -1.3],
  draw: (p, c) => {
    const b = SET.back;
    paintBox(p, c, 40600, {...b}, K.teal, {front: 0.06}, {ink: false, grain: 60});
    // Door seams and knobs on the counter front (z -1.0).
    for (let i = 0; i < 7; i++) {
      const x = b.x0 + 0.55 * i + 0.08;
      wFill(p, c, 40610 + i, dk(K.teal, 0.3), qz(b.z1 + 0.002, x, x + 0.012, 0.08, 0.8));
      const kn = sphereAt(c, [x + 0.07, 0.72, b.z1 + 0.01], 0.014);
      if (kn) hardFill(p, 40620 + i, K.brass, ell(kn.x, kn.y, kn.r, kn.r, 10));
    }
    wFill(p, c, 40630, dk(K.teal, 0.45), qz(b.z1 + 0.003, b.x0, b.x1, 0, 0.07));
    paintBox(p, c, 40640, {x0: b.x0, x1: b.x1, y0: 0.86, y1: 0.9, z0: b.z0, z1: b.z1 + 0.02}, K.wood, {front: 0.15}, {ink: false});
    // Sink under the window: steel basin inset and a faucet.
    wFill(p, c, 40650, K.steel, qy(0.901, -1.15, -0.45, -1.5, -1.12));
    wFill(p, c, 40651, K.steelDark, qy(0.902, -1.1, -0.5, -1.46, -1.16));
    wInk(p, c, 40652, qy(0.902, -1.15, -0.45, -1.5, -1.12), {color: '#5b6268', weight: 0.6});
    const fa = [[-0.8, 0.9, -1.52], [-0.8, 1.12, -1.52], [-0.8, 1.14, -1.42], [-0.8, 1.06, -1.34]] as V3[];
    wInk(p, c, 40653, fa, {closed: false, weight: 2.2, color: '#8b949a'});
    // Stove at x +0.6: dark hob, two burners, the pot on the back burner with a warm-grey steam wisp (not lilac).
    wFill(p, c, 40660, '#3b3532', qy(0.903, 0.3, 0.95, -1.52, -1.08));
    for (const [x, z] of [[0.45, -1.2], [0.78, -1.38]] as [number, number][]) {
      const r = flatCircle(c, [x, 0.905, z], 0.08);
      if (r.length >= 3) hardFill(p, 40661 + x * 10, '#55504c', r);
    }
    const potC: V3 = [0.78, 0.905, -1.38];
    const potTop = flatCircle(c, [potC[0], 1.06, potC[2]], 0.13), potBot = flatCircle(c, potC, 0.13);
    if (potTop.length >= 3 && potBot.length >= 3) {
      const xs = [...potTop, ...potBot].map((q) => q[0]);
      const l = Math.min(...xs), r = Math.max(...xs);
      const yTop = (Math.min(...potTop.map((q) => q[1])) + Math.max(...potTop.map((q) => q[1]))) / 2;
      const yBot = Math.max(...potBot.map((q) => q[1]));
      hardFill(p, 40670, K.pot, [[l, yTop], [r, yTop], [r, yBot - 4], [(l + r) / 2, yBot], [l, yBot - 4]]);
      washAt(p, 40671, dk(K.pot, 0.3), 110, [[(l + r) / 2 + (r - l) * 0.15, yTop], [r, yTop], [r, yBot - 4], [(l + r) / 2 + (r - l) * 0.2, yBot - 1]], 0.15, 0.4);
      hardFill(p, 40672, dk(K.pot, 0.45), potTop);
      washAt(p, 40673, lt(K.pot, 0.4), 90, [[l + 6, yTop + 8], [l + (r - l) * 0.22, yTop + 8], [l + (r - l) * 0.2, yBot - 10], [l + 6, yBot - 14]], 0.2, 0.3);
      inkLine(p, 40674, [[l, yTop], [l, yBot - 4], [(l + r) / 2, yBot], [r, yBot - 4], [r, yTop]], {closed: false, weight: 0.8, color: dk(K.pot, 0.6)});
      for (let k = 0; k < 4; k++) {
        const sy = yTop - 20 - k * 38, sx = (l + r) / 2 + 14 * Math.sin(t * 1.3 + k * 1.7);
        washAt(p, 40680 + k, '#e9dfd2', 55 - k * 10, blob(40680 + k, sx, sy, 22 + k * 8, 18 + k * 5, t), 0.6, 0.5);
      }
    }
  },
});

const shelfAndRail = (): Item => ({
  at: [0.7, 0, -1.6],
  bias: 0.3,
  draw: (p, c) => {
    const z = SET.wallZ;
    paintBox(p, c, 40700, {x0: 0.2, x1: 1.2, y0: 1.78, y1: 1.8, z0: z, z1: z + 0.25}, K.wood, {front: 0.2}, {ink: true});
    const jars: [number, number, string][] = [[0.3, 0.14, '#d8a24a'], [0.42, 0.11, '#b65a3a'], [0.53, 0.16, '#e8dcc0'], [0.64, 0.12, '#7a8f4a'], [0.76, 0.1, '#c98a44']];
    jars.forEach(([x, h, col], i) => {
      paintBox(p, c, 40710 + i * 10, {x0: x - 0.04, x1: x + 0.04, y0: 1.8, y1: 1.8 + h, z0: z + 0.08, z1: z + 0.16}, col, {}, {ink: true});
      paintBox(p, c, 40715 + i * 10, {x0: x - 0.042, x1: x + 0.042, y0: 1.8 + h, y1: 1.82 + h, z0: z + 0.078, z1: z + 0.162}, '#6a4a32', {});
    });
    // Cookbooks leaning at the right end.
    paintBox(p, c, 40770, {x0: 0.92, x1: 0.96, y0: 1.8, y1: 2.04, z0: z + 0.03, z1: z + 0.21}, '#5b7aa6', {}, {ink: true});
    paintBox(p, c, 40773, {x0: 0.96, x1: 1.0, y0: 1.8, y1: 2.0, z0: z + 0.03, z1: z + 0.21}, '#c45a44', {}, {ink: true});
    // Utensil rail with ladle, whisk and a small pan.
    wInk(p, c, 40780, [[-0.9, 1.95, z + 0.05], [-0.3, 1.95, z + 0.05]], {closed: false, weight: 2.4, color: '#7d868c'});
    wInk(p, c, 40781, [[-0.8, 1.95, z + 0.05], [-0.8, 1.62, z + 0.05]], {closed: false, weight: 1.6, color: '#8b949a'});
    const ladle = sphereAt(c, [-0.8, 1.6, z + 0.06], 0.045);
    if (ladle) hardFill(p, 40782, '#9aa3a8', ell(ladle.x, ladle.y, ladle.r, ladle.r * 0.8, 12));
    wInk(p, c, 40783, [[-0.62, 1.95, z + 0.05], [-0.62, 1.8, z + 0.05]], {closed: false, weight: 1.4, color: '#8b949a'});
    for (let k = 0; k < 3; k++) {
      const wk = wp(c, Array.from({length: 10}, (_, i): V3 => [-0.62 + (0.03 - k * 0.01) * Math.cos(i * 0.698), 1.72 + 0.08 * Math.sin(i * 0.698), z + 0.05]));
      if (wk.length >= 3) inkLine(p, 40784 + k, wk, {weight: 0.6, color: '#7d868c'});
    }
    wInk(p, c, 40788, [[-0.42, 1.95, z + 0.04], [-0.42, 1.8, z + 0.04]], {closed: false, weight: 1.6, color: '#2f2a28'});
    const pan = sphereAt(c, [-0.42, 1.68, z + 0.03], 0.11);
    if (pan) {
      hardFill(p, 40789, '#3a3533', ell(pan.x, pan.y, pan.r, pan.r, 16));
      washAt(p, 40790, '#6a625c', 90, ell(pan.x - pan.r * 0.3, pan.y - pan.r * 0.3, pan.r * 0.45, pan.r * 0.35, 12), 0.3, 0.3);
    }
  },
});

const fridgeItem = (): Item => ({
  at: [1.8, 0, -1.27],
  draw: (p, c) => {
    const f = SET.fridge;
    paintBox(p, c, 40800, {...f}, K.fridge, {front: 0.04, left: 0.2, top: -0.02}, {ink: true});
    wFill(p, c, 40810, dk(K.fridge, 0.25), qz(f.z1 + 0.002, f.x0 + 0.02, f.x1 - 0.02, 1.28, 1.295));
    wFill(p, c, 40811, '#a8a090', qz(f.z1 + 0.012, f.x0 + 0.06, f.x0 + 0.085, 0.8, 1.2));
    wFill(p, c, 40812, '#a8a090', qz(f.z1 + 0.012, f.x0 + 0.06, f.x0 + 0.085, 1.36, 1.6));
    // Three magnets and a child's drawing (paper with crayon marks).
    ([[1.85, 1.62, '#d2463a'], [2.0, 1.5, '#2fa6d9'], [1.7, 1.12, '#e8c43a']] as [number, number, string][]).forEach(([x, y, col], i) => {
      const m = sphereAt(c, [x, y, f.z1 + 0.01], 0.022);
      if (m) hardFill(p, 40820 + i, col, ell(m.x, m.y, m.r, m.r, 10));
    });
    const paper = qz(f.z1 + 0.006, 1.68, 2.0, 0.85, 1.12);
    wFill(p, c, 40830, '#fbf6ea', paper);
    wWash(p, c, 40831, '#f2b23a', 150, qz(f.z1 + 0.007, 1.74, 1.82, 0.98, 1.06), 0.1, 0.3);
    wInk(p, c, 40832, [[1.72, 0.9, f.z1 + 0.008], [1.8, 0.95, f.z1 + 0.008], [1.9, 0.9, f.z1 + 0.008], [1.97, 0.96, f.z1 + 0.008]], {closed: false, weight: 0.9, color: '#3a8a4a'});
    wInk(p, c, 40833, [[1.86, 1.05, f.z1 + 0.008], [1.9, 0.98, f.z1 + 0.008], [1.94, 1.05, f.z1 + 0.008]], {closed: false, weight: 0.9, color: '#c43a3a'});
    wWash(p, c, 40834, K.wallShadow, 60, qz(f.z1 + 0.009, f.x0, f.x1, 0, 1.85), 0.25, 0.6);
  },
});

const pendantItem = (t: number): Item => ({
  at: [0, 0, 0],
  bias: -1.5, // hangs in front of the cook from this side
  draw: (p, c) => {
    const [x, y, z] = SET.pendant;
    wInk(p, c, 40900, [[x, SET.ceilY, z], [x, y + 0.14, z]], {closed: false, weight: 1.2, color: '#3a2e26'});
    const top = camPoint(c, [x, y + 0.14, z]), rim = flatCircle(c, [x, y, z], 0.15, 18);
    if (!top || rim.length < 3) return;
    const xs = rim.map((q) => q[0]), ys = rim.map((q) => q[1]);
    const l = Math.min(...xs), r = Math.max(...xs), yb = (Math.min(...ys) + Math.max(...ys)) / 2, w2 = (r - l) * 0.18;
    const halo = camPoint(c, [x, y - 0.05, z]);
    if (halo) paintHalo(p, {x: halo[0], y: halo[1], r: 0.55 * camUnit(c, SET.pendant), color: K.pendant, level: 0.55, squash: 0.8, t, seed: 40910});
    hardFill(p, 40920, '#d9874a', [[top[0] - w2, top[1]], [top[0] + w2, top[1]], [r, yb], [l, yb]]);
    washAt(p, 40921, '#a85a2e', 110, [[top[0], top[1]], [top[0] + w2, top[1]], [r, yb], [(l + r) / 2 + (r - l) * 0.1, yb]], 0.1, 0.4);
    hardFill(p, 40922, '#fff0c8', rim);
    inkLine(p, 40923, [[top[0] - w2, top[1]], [top[0] + w2, top[1]], [r, yb], [l, yb]], {weight: 0.8, color: '#5a3020'});
  },
});

// ------------------------------------------------------------------ island and its props

const islandItem = (): Item => ({
  at: [0, 0, 0],
  draw: (p, c) => {
    const I = SET.island;
    paintBox(p, c, 41000, {...I, y1: 0.86}, K.teal, {front: 0.02, left: 0.18}, {ink: true, grain: 70});
    // Three doors, a drawer line and brass knobs on the front (+z).
    const zf = I.z1 + 0.003;
    wFill(p, c, 41010, dk(K.teal, 0.3), qz(zf, I.x0 + 0.04, I.x1 - 0.04, 0.7, 0.712));
    for (let i = 0; i < 3; i++) {
      const x0 = I.x0 + 0.08 + i * 0.78, x1 = x0 + 0.7;
      wInk(p, c, 41020 + i, qz(zf, x0, x1, 0.1, 0.64), {color: dk(K.teal, 0.5), weight: 0.7});
      wWash(p, c, 41025 + i, lt(K.teal, 0.25), 80, qz(zf + 0.001, x0 + 0.04, x0 + 0.16, 0.14, 0.6), 0.2, 0.4);
      const kn = sphereAt(c, [x1 - 0.07, 0.56, zf + 0.012], 0.016);
      if (kn) hardFill(p, 41030 + i, K.brass, ell(kn.x, kn.y, kn.r, kn.r, 10));
      const kd = sphereAt(c, [(x0 + x1) / 2, 0.785, zf + 0.012], 0.014);
      if (kd) hardFill(p, 41035 + i, K.brass, ell(kd.x, kd.y, kd.r, kd.r, 10));
    }
    wFill(p, c, 41040, dk(K.teal, 0.45), qz(zf, I.x0, I.x1, 0, 0.06));
    // Tea towel over the front at x -0.50.
    const tw: V3[] = [[-0.62, 0.9, zf + 0.012], [-0.38, 0.9, zf + 0.012], [-0.37, 0.52, zf + 0.012], [-0.63, 0.53, zf + 0.012]];
    wFill(p, c, 41050, K.towel, tw);
    for (let k = 0; k < 3; k++) wFill(p, c, 41051 + k, '#c4553f', qz(zf + 0.013, -0.625 + 0.001 * k, -0.375, 0.8 - k * 0.04, 0.812 - k * 0.04));
    wInk(p, c, 41055, tw, {color: '#9a8a6a', weight: 0.6});
    // Butcher-block top with grain and knife marks.
    paintBox(p, c, 41060, {x0: I.x0 - 0.02, x1: I.x1 + 0.02, y0: 0.86, y1: 0.9, z0: I.z0 - 0.02, z1: I.z1 + 0.02}, K.wood, {front: 0.18, left: 0.24}, {ink: true});
    for (let k = 0; k < 9; k++) {
      const z = I.z0 + 0.03 + k * 0.065;
      wInk(p, c, 41070 + k, [[I.x0, 0.9005, z], [-0.4 + 0.3 * hash(k), 0.9005, z + 0.004], [I.x1, 0.9005, z - 0.003]], {closed: false, weight: 0.4, color: K.woodDark});
    }
    lightVeil(p, c, 40501, 0.16, [[-1.15, 0.9008, -0.3], [0.25, 0.9008, -0.3], [0.55, 0.9008, 0.3], [-0.85, 0.9008, 0.3]]);
    for (let k = 0; k < 5; k++) {
      const x = -0.9 + 0.38 * k + 0.1 * hash(k * 5);
      wInk(p, c, 41080 + k, [[x, 0.9006, 0.12], [x + 0.06, 0.9006, 0.05]], {closed: false, weight: 0.4, color: '#8a5a32'});
    }
  },
});

/** Whole yellow onion of radius `r` m at `v` (no face, ever: F020). Papery gold-brown skin, long stripes, sprout tip, root tuft. */
export const paintOnion = (p: Painter, c: YCam, seed: number, v: V3, r: number, o: {tint?: string} = {}) => {
  const s = sphereAt(c, v, r);
  if (!s) return;
  const {x, y} = s, R = s.r;
  const col = o.tint ? mixColor(K.onion, o.tint, 0.4) : K.onion;
  // Contact shadow on the board.
  const sh = flatCircle(c, [v[0] + 0.01, v[1] - r + 0.002, v[2] + 0.005], r * 0.95, 16);
  if (sh.length >= 3) washAt(p, seed, '#5a3418', 110, sh, 0.25, 0.3);
  const body: Pt[] = Array.from({length: 22}, (_, i) => {
    const a = (i / 22) * Math.PI * 2, top = Math.max(0, -Math.sin(a));
    const rr = R * (1 - 0.12 * top);
    return [x + rr * Math.cos(a) * (1 - 0.35 * top ** 3), y + R * 0.98 * Math.sin(a) - R * 0.32 * top ** 4];
  });
  hardFill(p, seed + 1, col, body);
  washAt(p, seed + 2, dk(col, 0.35), 150, [[x + R * 0.15, y - R * 0.9], [x + R, y - R * 0.1], [x + R * 0.7, y + R * 0.8], [x + R * 0.2, y + R]], 0.15, 0.4);
  washAt(p, seed + 3, K.onionHi, 160, ell(x - R * 0.4, y - R * 0.25, R * 0.28, R * 0.4, 12, -0.4), 0.2, 0.3);
  for (let k = -2; k <= 2; k++) inkLine(p, seed + 10 + k, [[x + k * R * 0.12, y - R * 1.15], [x + k * R * 0.42, y - R * 0.2], [x + k * R * 0.36, y + R * 0.6], [x + k * R * 0.1, y + R * 0.95]], {closed: false, weight: 0.45, color: K.onionDark, curve: 0.4});
  inkLine(p, seed + 20, [[x - R * 0.06, y - R * 1.2], [x + R * 0.05, y - R * 1.55], [x + R * 0.16, y - R * 1.62]], {closed: false, weight: 1.1, color: '#7a4a24', curve: 0.4});
  for (let k = -2; k <= 2; k++) inkLine(p, seed + 30 + k, [[x + k * R * 0.05, y + R * 0.96], [x + k * R * 0.14, y + R * 1.12]], {closed: false, weight: 0.5, color: '#d8c49a'});
  inkLine(p, seed + 40, body, {weight: 0.8, color: dk(col, 0.6)});
};

const boardItem = (): Item => ({
  at: [0, 0, 0.0],
  bias: -0.05,
  draw: (p, c) => {
    const B = SET.board;
    paintBox(p, c, 41100, {...B}, '#d8a86a', {front: 0.2, left: 0.25, top: -0.04}, {ink: true});
    wWash(p, c, 41105, '#b9874e', 90, qy(0.9205, -0.12, 0.02, -0.08, 0.04), 0.35, 0.6); // juice stain
    for (let k = 0; k < 4; k++) wInk(p, c, 41110 + k, [[B.x0 + 0.02, 0.9205, -0.1 + k * 0.06], [B.x1 - 0.02, 0.9205, -0.1 + k * 0.06 + 0.01]], {closed: false, weight: 0.35, color: '#a8784a'});
    paintOnion(p, c, 41120, SET.onion, SET.onionR);
  },
});

const basketItem = (): Item => ({
  at: [0.75, 0, 0.05],
  bias: -0.05,
  draw: (p, c) => {
    const ctr: V3 = [0.75, 0.9, 0.05];
    const bot = flatCircle(c, ctr, 0.13, 18), rim = flatCircle(c, [0.75, 1.0, 0.05], 0.15, 20);
    if (bot.length < 3 || rim.length < 3) return;
    [[0.68, 1.02, 0.02], [0.8, 1.02, 0.0], [0.74, 1.03, 0.1], [0.84, 1.01, 0.1]].forEach((v, i) => paintOnion(p, c, 41200 + i * 50, v as V3, 0.042));
    const xs = rim.map((q) => q[0]);
    const l = Math.min(...xs), r = Math.max(...xs), yr = Math.max(...rim.map((q) => q[1])), yb = Math.max(...bot.map((q) => q[1]));
    for (let k = 0; k <= 8; k++) {
      const u = k / 8, xa = l + (r - l) * u, xb = l + (r - l) * (0.07 + 0.86 * u);
      inkLine(p, 41400 + k, [[xa, yr - 4], [xb, yb]], {closed: false, weight: 0.7, color: '#4a4440'});
    }
    inkLine(p, 41410, rim, {weight: 1.1, color: '#4a4440'});
    inkLine(p, 41411, bot.filter((q) => q[1] > (yb - 12)), {closed: false, weight: 0.9, color: '#4a4440'});
    const sh = flatCircle(c, [0.76, 0.901, 0.07], 0.14, 16);
    if (sh.length >= 3) washAt(p, 41412, '#5a3418', 70, sh, 0.3, 0.3);
  },
});

const garlicItem = (): Item => ({
  at: [-0.75, 0, 0.1],
  bias: -0.05,
  draw: (p, c) => {
    const rim = flatCircle(c, [-0.75, 0.97, 0.1], 0.09, 20), bot = flatCircle(c, [-0.75, 0.9, 0.1], 0.06, 16);
    if (rim.length < 3 || bot.length < 3) return;
    const sh = flatCircle(c, [-0.73, 0.901, 0.12], 0.08, 16);
    if (sh.length >= 3) washAt(p, 41500, '#5a3418', 80, sh, 0.3, 0.3);
    const xs = rim.map((q) => q[0]), l = Math.min(...xs), r = Math.max(...xs);
    const ym = (Math.min(...rim.map((q) => q[1])) + Math.max(...rim.map((q) => q[1]))) / 2, yb = Math.max(...bot.map((q) => q[1]));
    hardFill(p, 41501, '#3f6f8a', [[l, ym], [r, ym], [(l + r) / 2 + (r - l) * 0.3, yb], [(l + r) / 2 - (r - l) * 0.3, yb]]);
    hardFill(p, 41502, '#2c5068', rim);
    for (let k = 0; k < 3; k++) {
      const s = sphereAt(c, [-0.79 + k * 0.04, 0.99 + 0.01 * (k % 2), 0.1 + 0.02 * (k - 1)], 0.03);
      if (s) {
        hardFill(p, 41510 + k, '#f1e8d6', ell(s.x, s.y, s.r, s.r * 0.9, 12));
        inkLine(p, 41515 + k, [[s.x, s.y - s.r * 1.25], [s.x, s.y + s.r * 0.8]], {closed: false, weight: 0.4, color: '#b8a888'});
        inkLine(p, 41520 + k, ell(s.x, s.y, s.r, s.r * 0.9, 12), {weight: 0.5, color: '#a89878'});
      }
    }
    washAt(p, 41530, '#7fb0c8', 90, [[l + 4, ym + 3], [l + (r - l) * 0.25, ym + 3], [(l + r) / 2 - (r - l) * 0.24, yb - 3]], 0.2, 0.3);
    inkLine(p, 41531, [[l, ym], [(l + r) / 2 - (r - l) * 0.3, yb], [(l + r) / 2 + (r - l) * 0.3, yb], [r, ym]], {closed: false, weight: 0.8, color: '#22394a'});
  },
});

/** Thai home props (UT05, UT12): a granite mortar and pestle and a dish of limes and bird chillies on the island; a rice cooker and a fish-sauce bottle on the back counter. */
const homeProps = (): Item[] => [
  {
    at: [0.45, 0, 0.12], bias: -0.05,
    draw: (p, c) => {
      const rim = flatCircle(c, [0.45, 1.0, 0.12], 0.07, 18), bot = flatCircle(c, [0.45, 0.9, 0.12], 0.055, 16);
      if (rim.length < 3 || bot.length < 3) return;
      const sh = flatCircle(c, [0.47, 0.901, 0.14], 0.075, 16);
      if (sh.length >= 3) washAt(p, 41600, '#5a3418', 90, sh, 0.3, 0.3);
      const xs = rim.map((q) => q[0]), l = Math.min(...xs), r = Math.max(...xs);
      const ym = (Math.min(...rim.map((q) => q[1])) + Math.max(...rim.map((q) => q[1]))) / 2, yb = Math.max(...bot.map((q) => q[1]));
      hardFill(p, 41601, '#6f6a66', [[l, ym], [r, ym], [r - (r - l) * 0.1, yb - 3], [(l + r) / 2, yb], [l + (r - l) * 0.1, yb - 3]]);
      washAt(p, 41602, '#4a4542', 120, [[(l + r) / 2, ym], [r, ym], [r - (r - l) * 0.1, yb - 3], [(l + r) / 2 + 4, yb]], 0.1, 0.5);
      hardFill(p, 41603, '#3e3a37', rim);
      const pa = camPoint(c, [0.43, 0.98, 0.12]), pb = camPoint(c, [0.52, 1.13, 0.08]);
      if (pa && pb) {
        hardFill(p, 41604, '#7d7874', [[pa[0] - 5, pa[1]], [pa[0] + 5, pa[1]], [pb[0] + 8, pb[1]], [pb[0] - 8, pb[1]]]);
        inkLine(p, 41605, [[pa[0] - 5, pa[1]], [pb[0] - 8, pb[1]], [pb[0] + 8, pb[1]], [pa[0] + 5, pa[1]]], {weight: 0.6, color: '#2f2b28'});
      }
      inkLine(p, 41606, [[l, ym], [r - (r - l) * 0.1, yb - 3], [(l + r) / 2, yb], [l + (r - l) * 0.1, yb - 3], [l, ym]], {weight: 0.7, color: '#2f2b28'});
    },
  },
  {
    at: [-0.38, 0, 0.16], bias: -0.05,
    draw: (p, c) => {
      const dish = flatCircle(c, [-0.38, 0.905, 0.16], 0.09, 20);
      if (dish.length < 3) return;
      hardFill(p, 41700, '#f1ece0', dish);
      inkLine(p, 41701, dish, {weight: 0.6, color: '#8a8478'});
      [[-0.41, 0.16], [-0.35, 0.14], [-0.37, 0.2]].forEach(([x, z], i) => {
        const s = sphereAt(c, [x, 0.93, z], 0.025);
        if (s) { hardFill(p, 41710 + i, '#7fae3e', ell(s.x, s.y, s.r, s.r * 0.85, 12)); washAt(p, 41715 + i, '#c8e07a', 140, ell(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.4, s.r * 0.3, 8), 0.1, 0.2); }
      });
      for (let k = 0; k < 4; k++) {
        const a = camPoint(c, [-0.44 + 0.03 * k, 0.915, 0.12 + 0.02 * (k % 2)]), b = camPoint(c, [-0.4 + 0.03 * k, 0.915, 0.1 + 0.02 * (k % 2)]);
        if (a && b) inkLine(p, 41720 + k, [a, b], {closed: false, weight: 2.4, color: '#d2382c'});
      }
    },
  },
  {
    at: [-1.8, 0, -1.3],
    draw: (p, c) => {
      paintBox(p, c, 41800, {x0: -1.95, x1: -1.65, y0: 0.9, y1: 1.15, z0: -1.45, z1: -1.2}, '#f2ede2', {}, {ink: true});
      paintBox(p, c, 41806, {x0: -1.93, x1: -1.67, y0: 1.15, y1: 1.19, z0: -1.43, z1: -1.22}, '#d9cfbd', {}, {ink: true});
      wFill(p, c, 41810, '#c4553f', qz(-1.199, -1.86, -1.74, 1.02, 1.06));
      paintBox(p, c, 41815, {x0: -0.12, x1: -0.06, y0: 0.9, y1: 1.12, z0: -1.5, z1: -1.44}, '#7a4a1e', {}, {ink: true});
      paintBox(p, c, 41820, {x0: -0.105, x1: -0.075, y0: 1.12, y1: 1.17, z0: -1.485, z1: -1.455}, '#d2382c', {});
    },
  },
];

/** Gold light from the window off screen left: a soft beam through the air toward the island, peak well under 0.3. */
const paintBeam = (p: Painter, c: YCam) => {
  const w = SET.window;
  const a = [[w.x0, w.y1, -1.6], [w.x1, w.y1, -1.6], [0.6, 0.92, 0.25], [-0.6, 0.92, 0.25]] as V3[];
  lightVeil(p, c, 41950, 0.07, a);
};

// ------------------------------------------------------------------ the cook

export type CookState = {pose: AnyPoseId; face: ExpressionId; knife?: 'raised' | 'none'; headCock?: number; look?: Pt};
/** Chef's knife held in the fist at `wrist` (px), blade pointing along `ang` (radians, picture), length in px. */
const paintKnife = (p: Painter, seed: number, wrist: Pt, ang: number, unit: number) => {
  const d: Pt = [Math.cos(ang), Math.sin(ang)], n: Pt = [-d[1], d[0]];
  const at = (s: number, w: number): Pt => [wrist[0] + d[0] * s * unit + n[0] * w * unit, wrist[1] + d[1] * s * unit + n[1] * w * unit];
  // Handle (0.12 m) through the fist, blade (0.20 m) beyond it with a curved belly and a steel highlight.
  hardFill(p, seed, '#3a2a22', [at(-0.02, -0.014), at(0.1, -0.016), at(0.1, 0.016), at(-0.02, 0.014)]);
  const blade: Pt[] = [at(0.1, -0.012), at(0.11, -0.024), at(0.24, -0.02), at(0.3, -0.002), at(0.29, 0.006), at(0.11, 0.012)];
  hardFill(p, seed + 1, '#c9d0d4', blade);
  washAt(p, seed + 2, '#f4f8fa', 200, [at(0.12, -0.016), at(0.25, -0.013), at(0.27, -0.008), at(0.12, -0.008)], 0.05, 0.2);
  inkLine(p, seed + 3, blade, {weight: 0.8, color: '#4d565c'});
};

const cookItem = (t: number, st: CookState, out: {a?: FigAnchors}): Item => ({
  at: SET.cook,
  draw: (p, c) => {
    const at = SET.cook, g = camPoint(c, at), u = camUnit(c, at);
    if (!g) return;
    // Squared to the lens (front view): facing set from the camera of this frame's shot, passed in by the look frame (`facingCam`).
    const pose = poseFor(st.pose, COOK, g, u, 'front');
    const face = {...EXPRESSIONS[st.face], ...(st.look ? {look: st.look} : {})};
    // Knife first, so the rig's fist (KITCHEN_LIGHT.shaped, UT14) closes over the handle: grip from the pose's wrist target.
    if (st.knife === 'raised' && pose.rArm) paintKnife(p, 42100, pose.rArm.to, -Math.PI / 2 - 0.35, u);
    const a = drawFigure(p, COOK, g, u, {...pose, face, headCock: st.headCock, light: KITCHEN_LIGHT}, t);
    paintBibApron(p, COOK, g, u, 42000, a);
    out.a = a;
  },
});

export type KitchenOpts = {t: number; cook?: CookState};
/** Paint SET-KITCHEN seen from `c`: shell and window, then the set items depth-sorted far to near with the cook. Returns the cook's anchors. */
export const paintKitchen = (p: Painter, c: YCam, o: KitchenOpts): FigAnchors | undefined => {
  paintShell(p, c);
  paintWindow(p, c, o.t);
  const out: {a?: FigAnchors} = {};
  const items: Item[] = [backCounter(o.t), shelfAndRail(), fridgeItem(), islandItem(), boardItem(), basketItem(), garlicItem(), pendantItem(o.t), ...homeProps()];
  if (o.cook) items.push(cookItem(o.t, o.cook, out));
  // Window light after the back counter (it lies on the counter top) and before the island props.
  items.push({at: [-0.7, 0, -1.25], bias: -0.01, draw: (q, cc) => paintWindowLight(q, cc)});
  paintSorted(p, c, items);
  paintBeam(p, c);
  // Warm room glaze over the far set (air), very light.
  glaze(p, 41900, '#f6cf86', 18, [[-200, -200], [1280, -200], [1280, 2200], [-200, 2200]], {border: 0});
  return out.a;
};

/** The facing that squares the cook to a camera (front view), for a shot's mid-frame camera (kit `squareToCam`). */
export const cookFacing = (c: YCam) => squareToCam(c, SET.cook, 'front');
export {INK};

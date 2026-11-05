import {drawFigure, ELBOW_W, H, shoulderPoint, type FigAnchors} from '../kit/cast';
import {blob, clipHalf, ell, fistParts, formDir, glaze, hardFill, inkLine, INK, lineOf, modelPart, openHandParts, palOf, planeBand, shapedLimb, solid, toneOf, washAt, type InteriorLight} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {hairFront} from '../kit/hair';
import {CHIN, HEAD_SPAN, type FaceState} from '../kit/head';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {poseFor, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam} from '../kit/views';
import {camPoint, camSpace, camUnit, type YCam} from '../kit/ycam';
import {APRON, COOK, paintBibApron} from './cast';
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
  // W5.2 (Boss, LF01 polish; viewer check r2 note: muddy smudge on the upper-left of the hair): the window rim (travelling
  // right-down, so it lands on the upper-left of every part) was a pale gold band 0.09 deep in opaque passes, which over the
  // near-black `woman-curly` cloud dried to a grey-olive flap; it is now a thinner (0.05), more saturated gold, and the lit
  // glaze a warm gold at a lower opacity (episode light, kit unchanged). v6 (viewer check r5: "tan streak still in hair
  // top-left"): the rim's straight-cut band on the front hair cap was still ~22 px wide; rimTo 0.006 leaves a 2-3 px warm line
  // on each part's upper-left silhouette, in a more saturated orange so it reads warm, not tan, over the near-black hair.
  pal: {ambient: '#c9a982', ambientMix: 0.1, shadow: '#5a3628', shadowMix: 0.32, shadowOpacity: 140, light: '#ffbe6a', lightMix: 0.22, lightOpacity: 70,
    rimColor: '#ffa53a', rimMix: 0.55, rimTo: 0.006, falloff: '#3a2418', falloffOpacity: 90, hatchMix: 0.5},
};

export const SET = {
  island: {x0: -1.2, x1: 1.2, y0: 0, y1: 0.9, z0: -0.3, z1: 0.3},
  // W3.1 v2 (viewer check r1): the board moves to the left of centre on the island, on the line from the cook to the B01-SH02
  // camera, so the onion sits in front of her in the lower third (was x -0.20..0.20, z -0.14..0.14, onion at [0.02, 0.96, 0.02]).
  // W5.2 v6 (Boss; viewer check r5: the onion read at ~80 of 540 px): the hero onion grows to radius 0.07 (Ø 0.14 m, to the
  // stylised 4-head rig: head ~0.40 m, so onion:head ~0.35, a real onion's ratio) and sits 0.06 m nearer the lens and 0.10 m
  // left on a larger board, so in B01-SH02 it is ~177 of 540 px wide with its top below the caption band (y >= 1256).
  board: {x0: -0.62, x1: -0.1, y0: 0.9, y1: 0.92, z0: -0.17, z1: 0.15},
  onion: [-0.35, 0.92 + 0.07 * 0.92, 0.0] as V3, onionR: 0.07,
  cook: [0, 0, -0.55] as V3,
  wallZ: -1.6, rightX: 2.6, ceilY: 2.6,
  window: {x0: -1.3, x1: -0.3, y0: 1.1, y1: 2.0},
  back: {x0: -2.6, x1: 1.2, y0: 0, y1: 0.86, z0: -1.6, z1: -1.0},
  fridge: {x0: 1.45, x1: 2.15, y0: 0, y1: 1.85, z0: -1.6, z1: -0.95},
  pendant: [0, 2.1, 0] as V3,
} as const;
/** Camera targets (brief set plan). */
export const T = {ONION: [-0.35, 0.984, 0.0] as V3, FACE: [0, 1.4, -0.55] as V3, CHEST: [0, 1.15, -0.55] as V3, MID: [0, 1.15, -0.25] as V3};

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
  // W5.2 v6 (viewer check r5: grey-brown smudges on the ceiling top-centre and top-right): the textured top band (40203) and
  // the two high stains are gone, and so is the textured shadow toward the right (40202: its soft left edge dried to a
  // grey-brown blotch above the fridge); the right wall (40230) carries the shade.
  const stains: [number, number, number, number][] = [[-1.7, 1.75, 0.18, 0.25], [1.05, 1.55, 0.14, 0.1]];
  stains.forEach(([x, y, rx, ry], i) => {
    const q = wp(c, Array.from({length: 14}, (_, k): V3 => [x + rx * Math.cos(k * 0.449) * (0.8 + 0.4 * hash(i * 9 + k)), y + ry * Math.sin(k * 0.449), wz + 0.001]));
    if (q.length >= 3) washAt(p, 40210 + i, dk(K.wall, 0.16), 55, q, 0.45, 0.7);
  });
  // Right wall (fridge side), in the window's shadow.
  wFill(p, c, 40230, dk(K.wall, 0.14), qx(S.rightX, 0, S.ceilY, wz, 3));
  // v6: a flat veil, not a bleeding wash (its bleed crossed the corner onto the back wall as the top-right blotch).
  wFill(p.layer(0.3, 40231), c, 40231, K.wallShadow, qx(S.rightX - 0.001, 0, S.ceilY, wz, 3));
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
    // Three magnets and a child's drawing. W3.1 v2 (viewer check r1: unreadable): bigger paper held by a magnet at its top, a
    // crayon sun with rays, a house with a red roof and green grass; round magnets with a highlight.
    const Z = f.z1 + 0.008, P = (x: number, y: number): V3 => [x, y, Z];
    const paper = qz(f.z1 + 0.006, 1.62, 2.04, 0.78, 1.2);
    wFill(p, c, 40830, '#fbf6ea', paper);
    wInk(p, c, 40829, paper, {color: '#b8ab90', weight: 0.5});
    const sun = sphereAt(c, P(1.72, 1.1), 0.045);
    if (sun) {
      hardFill(p, 40831, '#f2b23a', ell(sun.x, sun.y, sun.r, sun.r, 14));
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * 6.283, r0 = 0.06, r1 = 0.085;
        wInk(p, c, 40840 + k, [P(1.72 + r0 * Math.cos(a), 1.1 + r0 * Math.sin(a)), P(1.72 + r1 * Math.cos(a), 1.1 + r1 * Math.sin(a))], {closed: false, weight: 1.2, color: '#e89a2a'});
      }
    }
    wFill(p, c, 40832, '#e9c79a', qz(Z, 1.82, 1.98, 0.86, 0.99));
    wFill(p, c, 40833, '#c43a3a', [P(1.8, 0.99), P(2.0, 0.99), P(1.9, 1.08)]);
    wFill(p, c, 40835, '#5a8ad0', qz(Z + 0.001, 1.88, 1.92, 0.86, 0.92));
    wInk(p, c, 40836, [P(1.64, 0.83), P(1.75, 0.85), P(1.86, 0.82), P(2.02, 0.84)], {closed: false, weight: 1.6, color: '#3a8a4a'});
    ([[1.83, 1.17, '#d2463a'], [2.06, 1.55, '#2fa6d9'], [1.65, 1.45, '#e8c43a']] as [number, number, string][]).forEach(([x, y, col], i) => {
      const m = sphereAt(c, [x, y, f.z1 + 0.012], 0.028);
      if (!m) return;
      hardFill(p, 40820 + i, col, ell(m.x, m.y, m.r, m.r, 12));
      hardFill(p, 40823 + i, '#ffffff', ell(m.x - m.r * 0.35, m.y - m.r * 0.35, m.r * 0.28, m.r * 0.2, 8));
      inkLine(p, 40826 + i, ell(m.x, m.y, m.r, m.r, 12), {weight: 0.6, color: dk(col, 0.5)});
    });
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
    // W5.2 v6 (viewer check r5: "grey-brown smudges on the ceiling top-right"): with the lamp above the frame (B01-SH02) its
    // halo's outer falloff showed as a dull smudge in the top-right corner; the halo is painted only when the lamp is in frame.
    if (halo && halo[0] > 0 && halo[0] < 1080 && halo[1] > 0 && halo[1] < 1920) paintHalo(p, {x: halo[0], y: halo[1], r: 0.55 * camUnit(c, SET.pendant), color: K.pendant, level: 0.55, squash: 0.8, t, seed: 40910});
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
    // W5.2 (Boss, LF01 polish; viewer check r2 note: the lower third is flat tan): butcher-block planks in alternating tones
    // with dry-brush streaks along the grain, darker wear at the near edge, the cook's soft shadow on the far half, and a
    // warm-to-dark falloff toward the near edge so the foreground has depth.
    for (let k = 0; k < 9; k++) {
      const z0 = I.z0 - 0.02 + k * 0.071, tone = k % 3 === 0 ? dk(K.wood, 0.12) : k % 3 === 1 ? lt(K.wood, 0.08) : mixColor(K.wood, '#b07040', 0.4);
      wWash(p, c, 41090 + k, tone, 55 + 25 * hash(k * 3.3), qy(0.9004, I.x0 - 0.02, I.x1 + 0.02, z0, z0 + 0.068), 0.15, 0.55);
    }
    // W5.2 v6 (viewer check r5: little grain, no cook shadow, front edge not darker): 40 grain lines at 0.7-1.5 px in the
    // dark wood tone (v5: 26 at 0.35-0.75 px, unreadable at 270), a deeper cook's shadow, and a two-step darker near edge.
    for (let k = 0; k < 40; k++) {
      const z = I.z0 + 0.6 * hash(k * 2.9 + 0.4), x0 = -1.15 + 2.1 * hash(k * 6.3), L = 0.2 + 0.5 * hash(k * 1.7);
      wInk(p, c, 41140 + k, [[x0, 0.9006, z], [x0 + L * 0.5, 0.9006, z + 0.003 * (hash(k) - 0.5)], [Math.min(1.2, x0 + L), 0.9006, z + 0.004]], {closed: false, weight: 0.7 + 0.8 * hash(k * 4.1), color: k % 3 ? dk(K.woodDark, 0.15) : dk(K.wood, 0.45)});
    }
    for (let k = 0; k < 6; k++) {
      const x = -1.0 + 0.32 * k + 0.12 * hash(k * 3.7), z = 0.05 + 0.2 * hash(k * 8.3), d = 0.04 + 0.04 * hash(k);
      wInk(p, c, 41190 + k, [[x, 0.9006, z], [x + d, 0.9006, z - d * 0.5]], {closed: false, weight: 1.2, color: '#6e4424'});
    }
    wWash(p, c, 41170, '#4a2814', 100, [[-0.6, 0.9007, -0.32], [0.5, 0.9007, -0.32], [0.38, 0.9007, -0.12], [-0.45, 0.9007, -0.16]], 0.08, 0.15); // cook's shadow
    wWash(p, c, 41171, dk(K.wood, 0.5), 80, qy(0.9007, I.x0 - 0.02, I.x1 + 0.02, 0.16, I.z1 + 0.02), 0.08, 0.12); // near-edge falloff
    wWash(p, c, 41172, dk(K.wood, 0.65), 100, qy(0.9008, I.x0 - 0.02, I.x1 + 0.02, 0.25, I.z1 + 0.02), 0.06, 0.12);
    lightVeil(p, c, 40501, 0.16, [[-1.15, 0.9008, -0.3], [0.25, 0.9008, -0.3], [0.55, 0.9008, 0.3], [-0.85, 0.9008, 0.3]]);
    for (let k = 0; k < 5; k++) {
      const x = -0.9 + 0.38 * k + 0.1 * hash(k * 5);
      wInk(p, c, 41080 + k, [[x, 0.9006, 0.12], [x + 0.06, 0.9006, 0.05]], {closed: false, weight: 0.4, color: '#8a5a32'});
    }
  },
});

/**
 * Whole yellow onion of radius `r` m at `v` (no face, ever: F020). W3.1 v2 (viewer check r1: the v1 onion read as a pear): a squat
 * round bulb with broad shoulders and a short dry neck. W5.2 v6 (viewer check r5: "~80 px, layer lines and tip not visible, peel
 * pieces read as paper chips"): every mark scales with the projected radius `R` (px), so the hero onion at R ~ 170 carries dark
 * layer lines from neck to root, a twisted dry tip, a root disc with a wiry tuft, and curled translucent outer skins (one
 * lifting off the lit shoulder, one loose at the root) instead of flat chips; small basket onions keep the same build.
 */
export const paintOnion = (p: Painter, c: YCam, seed: number, v: V3, r: number, o: {tint?: string; noShadow?: boolean} = {}) => {
  const s = sphereAt(c, v, r);
  if (!s) return;
  const {x, y} = s, R = s.r, wk = Math.max(0.6, R / 70); // line weight scale
  const col = o.tint ? mixColor(K.onion, o.tint, 0.4) : K.onion;
  // Contact shadow on the board: a soft wide pool toward the lens-right (the window is back-left) and a dark core under the root.
  const by = v[1] - 0.92 * r + 0.001;
  if (!o.noShadow) {
    const sh = flatCircle(c, [v[0] + 0.01, by, v[2] + 0.008], r * 1.0, 18);
    if (sh.length >= 3) washAt(p, seed, '#5a3418', 110, sh, 0.12, 0.2);
    const shc = flatCircle(c, [v[0] + 0.004, by, v[2] + 0.004], r * 0.62, 16);
    if (shc.length >= 3) washAt(p, seed + 50, '#3a2014', 150, shc, 0.2, 0.2);
  }
  // Squat bulb (1.06 R wide, 0.92 R tall) whose very top draws into a short neck.
  const RX = R * 1.06, RY = R * 0.92;
  const body: Pt[] = Array.from({length: 40}, (_, i) => {
    const a = (i / 40) * Math.PI * 2, top = Math.max(0, -Math.sin(a));
    return [x + RX * Math.cos(a) * (1 - 0.3 * top ** 8), y + RY * Math.sin(a) - R * 0.22 * top ** 10];
  });
  hardFill(p, seed + 1, col, body);
  // Form: shade on the far (right, lower) side, warm light upper left, a darker band at the root end.
  washAt(p, seed + 2, dk(col, 0.4), 160, [[x + RX * 0.05, y - RY * 0.95], [x + RX, y - RY * 0.1], [x + RX * 0.75, y + RY * 0.8], [x + RX * 0.1, y + RY]], 0.2, 0.4);
  for (let k = 0; k < 4; k++) hardFill(p.layer(0.1, seed + 100 + k), seed + 100 + k, '#f2c886', ell(x - RX * 0.36, y - RY * 0.3, RX * (0.34 - 0.07 * k), RY * (0.46 - 0.09 * k), 16, -0.4));
  washAt(p, seed + 4, dk(col, 0.3), 120, ell(x, y + RY * 0.78, RX * 0.6, RY * 0.22, 16), 0.2, 0.3);
  // Layer lines: longitudes from the neck to the root over the sphere, dark on the shade side, warm brown on the lit side,
  // with a faint second line beside each one (the papery outer skin is several thin layers).
  const top: Pt = [x, y - RY - R * 0.2], root: Pt = [x, y + RY * 0.96];
  const lon = (phi: number): Pt[] => Array.from({length: 11}, (_, q) => {
    const th = 0.12 + (q / 10) * (Math.PI - 0.2);
    return [x + RX * Math.sin(th) * Math.sin(phi), y - RY * Math.cos(th) + R * 0.03 * Math.sin(th) * Math.sin(phi * 2)];
  });
  for (let k = -4; k <= 4; k++) {
    const phi = (k / 4.6) * (Math.PI / 2);
    inkLine(p, seed + 10 + k, [top, ...lon(phi), root], {closed: false, weight: wk * (k > 0 ? 1.5 : 1.05), color: k > 0 ? dk(col, 0.62) : dk(col, 0.45), curve: 0.4});
    if (k > -4) inkLine(p, seed + 60 + k, [top, ...lon(phi - 0.09), root], {closed: false, weight: wk * 0.55, color: k > 0 ? dk(col, 0.4) : dk(col, 0.25), curve: 0.4});
  }
  // Rim of dark skin round the shade side.
  inkLine(p, seed + 70, body.slice(36).concat(body.slice(0, 13)), {closed: false, weight: wk * 2.2, color: dk(col, 0.55), curve: 0.4});
  // Curled outer skin peeling off the lit (left) side: a translucent pale sheet still attached along a longitude, its free
  // edge lifting a little past the silhouette and rolling back on itself; a soft shadow on the bulb beside it. Light colours
  // are partial-opacity veils (a wash only darkens).
  {
    const att: Pt[] = lon(-0.9).slice(2, 8), n = att.length - 1;
    const free = att.map(([ax, ay], i): Pt => {
      const f = Math.sin((Math.PI * i) / n);
      return [ax - R * (0.03 + 0.17 * f), ay - R * 0.05 * f];
    });
    washAt(p, seed + 80, dk(col, 0.45), 130, [...att.map(([ax, ay], i): Pt => [ax + R * 0.09 * Math.sin((Math.PI * i) / n), ay]), ...att.slice().reverse()], 0.08, 0.3);
    const sheet: Pt[] = [...att, ...free.slice().reverse()];
    hardFill(p.layer(0.55, seed + 81), seed + 81, '#f6dca8', sheet);
    hardFill(p.layer(0.3, seed + 82), seed + 82, '#d9a35c', [...att, ...free.map(([fx, fy], i): Pt => [(2 * att[i][0] + fx) / 3, (2 * att[i][1] + fy) / 3]).reverse()]);
    for (let i = 1; i < n; i++) inkLine(p, seed + 83 + i, [att[i], free[i]], {closed: false, weight: wk * 0.45, color: '#c08a4a', curve: 0.3});
    // The rolled free edge: a pale tube with a brown line where it turns under.
    inkLine(p.layer(0.8, seed + 95), seed + 95, free, {closed: false, weight: wk * 2.2, color: '#f8e4bc', curve: 0.5});
    inkLine(p, seed + 96, free.map(([fx, fy]): Pt => [fx + R * 0.02, fy + R * 0.015]), {closed: false, weight: wk * 0.9, color: dk(col, 0.5), curve: 0.5});
    inkLine(p, seed + 97, sheet, {weight: wk * 0.5, color: dk(col, 0.45)});
  }
  // Dry neck: a twisted papery tip in three strands, tapering, dark brown with a light edge on the lit side.
  const strand = (pts: Pt[], w0: number, color: string, id: number) => {
    const L: Pt[] = [], Rt: Pt[] = [];
    pts.forEach((q, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const w = w0 * (1 - (0.85 * i) / (pts.length - 1)), nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d;
      L.push([q[0] + nx * w, q[1] + ny * w]);
      Rt.push([q[0] - nx * w, q[1] - ny * w]);
    });
    hardFill(p, id, color, [...L, ...Rt.reverse()]);
  };
  const ny0 = y - RY - R * 0.16;
  strand([[x - R * 0.03, ny0 + R * 0.02], [x - R * 0.01, ny0 - R * 0.18], [x + R * 0.06, ny0 - R * 0.34], [x + R * 0.17, ny0 - R * 0.44]], R * 0.075, '#7a4a24', seed + 90);
  strand([[x + R * 0.03, ny0 + R * 0.02], [x + R * 0.04, ny0 - R * 0.14], [x + R * 0.02, ny0 - R * 0.27], [x - R * 0.04, ny0 - R * 0.36]], R * 0.045, '#9a6a3a', seed + 91);
  strand([[x + R * 0.02, ny0 - R * 0.1], [x + R * 0.1, ny0 - R * 0.22], [x + R * 0.13, ny0 - R * 0.3]], R * 0.03, '#5e3818', seed + 92);
  inkLine(p, seed + 93, [[x - R * 0.06, ny0], [x - R * 0.04, ny0 - R * 0.2], [x + R * 0.04, ny0 - R * 0.35]], {closed: false, weight: wk * 0.8, color: '#d8a868', curve: 0.4});
  // Root disc (dark ring, lighter boss) and a wiry tuft splaying out and curling over the board.
  const ry0 = y + RY * 0.93;
  hardFill(p, seed + 22, '#6e5032', ell(x, ry0, R * 0.2, R * 0.075, 14));
  hardFill(p, seed + 23, '#a88a5a', ell(x - R * 0.02, ry0 - R * 0.01, R * 0.11, R * 0.04, 12));
  for (let k = 0; k < 15; k++) {
    const f = k / 14 - 0.5, h = hash(seed + k * 3.1), sp = f * R * 0.95, dn = R * (0.07 + 0.08 * h);
    inkLine(p, seed + 30 + k, [[x + f * R * 0.3, ry0 + R * 0.02], [x + sp * 0.55, ry0 + dn * 0.8], [x + sp, ry0 + dn], [x + sp * 1.15 + R * 0.05 * (h - 0.5), ry0 + dn * 0.7]], {closed: false, weight: wk * (0.5 + 0.5 * h), color: k % 3 ? '#cdb184' : '#8a6a42', curve: 0.5});
  }
  inkLine(p, seed + 40, body, {weight: wk * 1.0, color: dk(col, 0.6)});
};

/** A curled translucent onion skin lying on a flat surface (px centre, size `sz` px, angle `ang`): a pale sheet rolled at one edge. */
const paintLooseSkin = (p: Painter, id: number, cx: number, cy: number, sz: number, ang: number) => {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u: number, v: number): Pt => [cx + (u * ca - v * sa) * sz, cy + (u * sa + v * ca) * sz * 0.55];
  washAt(p, id, '#3a2014', 70, [P(-0.9, 0.15), P(0.95, 0.1), P(0.8, 0.5), P(-0.7, 0.55)], 0.35, 0.2); // soft shadow under it
  const sheet: Pt[] = [P(-1, 0), P(-0.6, -0.35), P(0.2, -0.45), P(0.9, -0.2), P(1, 0.15), P(0.4, 0.35), P(-0.5, 0.32)];
  hardFill(p.layer(0.5, id + 1), id + 1, '#f6dca6', sheet);
  hardFill(p.layer(0.3, id + 2), id + 2, '#c99050', [P(-0.6, 0.05), P(0.6, -0.05), P(0.5, 0.25), P(-0.5, 0.25)]);
  // Rolled edge: a tight tube along the far side, light on top and a dark line under it.
  const lip: Pt[] = [P(-0.95, -0.05), P(-0.5, -0.38), P(0.2, -0.47), P(0.85, -0.24)];
  inkLine(p.layer(0.8, id + 3), id + 3, lip, {closed: false, weight: Math.max(1, sz * 0.07), color: '#f8e4bc', curve: 0.5});
  inkLine(p, id + 4, lip.map(([a, b]): Pt => [a, b + sz * 0.06]), {closed: false, weight: Math.max(0.6, sz * 0.035), color: K.onionDark, curve: 0.5});
  for (const f of [-0.4, 0.1, 0.55]) inkLine(p, id + 5 + f * 10, [P(f, -0.3), P(f + 0.1, 0.25)], {closed: false, weight: Math.max(0.5, sz * 0.02), color: '#c99a5a', curve: 0.4});
  inkLine(p, id + 9, sheet, {weight: Math.max(0.5, sz * 0.025), color: dk('#e9c27e', 0.5)});
};

// ------------------------------------------------------------------ W5.2 G-A: onion halves, a knife in the world, droplets (N3, N4, N7)

/**
 * The onion on the board (W5.2 G-A, N4). `whole`: `paintOnion` at `at`. `halves`: the bulb cut by a vertical plane through `at`
 * whose horizontal normal is `n` (angle in the x-z plane, radians, 0 = +x); each half slides `sep` m out along its side of the
 * normal and turns `turn[i]` radians about its own vertical axis (a cut face turning toward the lens). Halves stand on their
 * root ends, cut faces vertical; the same bulb proportions as `paintOnion` (1.06 r wide, 0.92 r tall).
 */
export type OnionPiece = {kind: 'whole'; at: V3; r?: number} | {kind: 'halves'; at: V3; r?: number; n: number; sep: number | [number, number]; turn?: [number, number]};

const hull = (pts: Pt[]): Pt[] => {
  const q = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (q.length < 3) return q;
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const v of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], v) <= 0) lo.pop(); lo.push(v); }
  for (const v of q.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], v) <= 0) up.pop(); up.push(v); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** One onion half (`side` +1 / -1 of the cut normal). Cut face `#f3ead2` with ring lines, skin with layer lines, contact shadow. */
const paintOnionHalf = (p: Painter, c: YCam, seed: number, at: V3, r: number, nAng: number, side: 1 | -1, sep: number, turn: number) => {
  const a = r * 1.06, b = r * 0.92;
  // Local frame of this half: e1 = outward normal (turned), e3 = along the cut face, both horizontal.
  const ang = nAng + (side < 0 ? Math.PI : 0) + turn;
  const e1: V3 = [Math.cos(ang), 0, Math.sin(ang)], e3: V3 = [-Math.sin(ang), 0, Math.cos(ang)];
  const n0: V3 = [Math.cos(nAng) * side, 0, Math.sin(nAng) * side];
  const C: V3 = [at[0] + n0[0] * sep, at[1], at[2] + n0[2] * sep];
  const W = (u1: number, uy: number, u3: number): V3 => [C[0] + e1[0] * u1 + e3[0] * u3, C[1] + uy, C[2] + e1[2] * u1 + e3[2] * u3];
  // Surface sample (th from the top, ph -pi/2..pi/2 on the outer side).
  const S = (th: number, ph: number): V3 => {
    const neck = th < 0.35 ? 0.35 * (1 - th / 0.35) ** 2 : 0; // the top draws into a short neck
    return W(a * Math.sin(th) * Math.cos(ph) * (1 - 0.6 * neck), b * Math.cos(th) + r * 0.2 * neck, a * Math.sin(th) * Math.sin(ph) * (1 - 0.6 * neck));
  };
  const proj: Pt[] = [];
  for (let i = 0; i <= 10; i++) for (let j = 0; j <= 10; j++) {
    const q = camPoint(c, S((i / 10) * Math.PI, -Math.PI / 2 + (j / 10) * Math.PI));
    if (q) proj.push(q);
  }
  const face: V3[] = Array.from({length: 32}, (_, k) => S((k / 32) * Math.PI * 2 <= Math.PI ? (k / 32) * Math.PI * 2 : Math.PI * 2 - (k / 32) * Math.PI * 2, (k / 32) * Math.PI * 2 <= Math.PI ? Math.PI / 2 : -Math.PI / 2));
  const fq = face.map((v) => camPoint(c, v)).filter((q): q is Pt => !!q);
  const hl = hull([...proj, ...fq]);
  if (hl.length < 3) return;
  const unit = camUnit(c, C), wk = Math.max(0.6, (r * unit) / 70);
  // Contact shadow under the root end.
  // Contact shadow: the half's own D-shaped footprint on the board, nudged toward the lens-right (window back-left).
  const yb = at[1] - b + 0.001;
  const sh = Array.from({length: 13}, (_, k) => {
    const ph = -Math.PI / 2 + (k / 12) * Math.PI, v = W(a * 0.92 * Math.cos(ph), 0, a * 0.92 * Math.sin(ph));
    return camPoint(c, [v[0] + 0.006, yb, v[2] + 0.005]);
  }).filter((q): q is Pt => !!q);
  if (sh.length >= 3) washAt(p, seed, '#3a2014', 120, sh, 0.12, 0.2);
  const cx = hl.reduce((s, q) => s + q[0], 0) / hl.length, cy = hl.reduce((s, q) => s + q[1], 0) / hl.length;
  hardFill(p, seed + 1, K.onion, hl);
  const sd = clipHalf(hl, [0.8, 0.6], cx * 0.8 + cy * 0.6 - r * unit * 0.15);
  if (sd.length >= 3) washAt(p, seed + 2, dk(K.onion, 0.4), 150, sd, 0.2, 0.4);
  // Layer lines on the visible skin: longitudes from the neck to the root, only where the surface faces the lens.
  const camW: V3 = [c.x, c.y, c.z];
  const facing = (v: V3, nrm: V3) => (camW[0] - v[0]) * nrm[0] + (camW[1] - v[1]) * nrm[1] + (camW[2] - v[2]) * nrm[2] > 0;
  for (let k = 1; k < 8; k++) {
    const ph = -Math.PI / 2 + (k / 8) * Math.PI, pts: Pt[] = [];
    for (let i = 1; i <= 11; i++) {
      const th = 0.15 + (i / 11) * (Math.PI - 0.3), v = S(th, ph);
      const nrm: V3 = [v[0] - C[0], (v[1] - C[1]) * (a / b) ** 2, v[2] - C[2]];
      const q = camPoint(c, v);
      if (q && facing(v, nrm)) pts.push(q);
    }
    if (pts.length >= 3) inkLine(p, seed + 10 + k, pts, {closed: false, weight: wk * 1.1, color: dk(K.onion, 0.5), curve: 0.4});
  }
  // Cut face: visible when its normal (-e1) points at the lens.
  const fn: V3 = [-e1[0], 0, -e1[2]], fc = W(0, 0, 0);
  if (facing(fc, fn) && fq.length >= 3) {
    hardFill(p, seed + 20, '#f3ead2', fq);
    // The skin rim round the face, then rings (the onion's layers), each ring a scaled copy of the face outline about its centre.
    inkLine(p, seed + 21, fq, {weight: wk * 2.4, color: K.onion});
    const ctr = camPoint(c, fc);
    if (ctr) {
      [0.86, 0.72, 0.58, 0.45, 0.32, 0.2].forEach((s, i) => {
        const hy0 = fc[1] - b * 0.08; // rings centre a little under the middle (the heart sits low)
        const ring = face.map((v) => camPoint(c, [fc[0] + (v[0] - fc[0]) * s, hy0 + (v[1] - hy0) * s, fc[2] + (v[2] - fc[2]) * s] as V3)).filter((q): q is Pt => !!q);
        if (ring.length >= 3) inkLine(p, seed + 22 + i, ring, {weight: wk * (i % 2 ? 0.7 : 1.0), color: i % 2 ? '#d9c79c' : '#c9b27e'});
      });
      washAt(p, seed + 30, '#e4e0a8', 120, ell(ctr[0], ctr[1] + b * unit * 0.05, a * unit * 0.12, b * unit * 0.14, 12), 0.1, 0.3); // the green-yellow heart
      washAt(p, seed + 31, '#fffaf0', 140, ell(ctr[0] - a * unit * 0.25, ctr[1] - b * unit * 0.35, a * unit * 0.18, b * unit * 0.1, 12, -0.3), 0.1, 0.2); // wet sheen
    }
  }
  inkLine(p, seed + 40, hl, {weight: wk * 1.0, color: dk(K.onion, 0.6)});
  // Half of the dry neck: a short papery stub on the top, leaning out over the skin side.
  const n0p = camPoint(c, S(0, 0)), n1p = camPoint(c, W(a * 0.1, b + r * 0.3, 0)), n2p = camPoint(c, W(a * 0.32, b + r * 0.36, 0));
  if (n0p && n1p && n2p) {
    inkLine(p, seed + 45, [n0p, n1p, n2p], {closed: false, weight: wk * 3.2, color: '#7a4a24', curve: 0.5});
    inkLine(p, seed + 46, [n0p, n1p], {closed: false, weight: wk * 1.0, color: '#d8a868', curve: 0.5});
  }
  // Root tuft under the base.
  const rt = camPoint(c, W(a * 0.1, -b * 0.96, 0));
  if (rt) for (let k = 0; k < 7; k++) {
    const f = k / 6 - 0.5, h = hash(seed + k * 3.1), R = r * unit;
    inkLine(p, seed + 50 + k, [[rt[0] + f * R * 0.2, rt[1]], [rt[0] + f * R * 0.6, rt[1] + R * (0.06 + 0.05 * h)], [rt[0] + f * R * 0.9 + R * 0.04 * (h - 0.5), rt[1] + R * 0.07]], {closed: false, weight: wk * 0.7, color: k % 3 ? '#cdb184' : '#8a6a42', curve: 0.5});
  }
};

/** `between`: painted after the far half and before the near one (a blade standing in the cut). `sep` / `turn` per side [+n, -n]. */
export const paintOnionPiece = (p: Painter, c: YCam, seed: number, o: OnionPiece, between?: () => void) => {
  const r = o.r ?? SET.onionR;
  if (o.kind === 'whole') { paintOnion(p, c, seed, o.at, r); between?.(); return; }
  // Far half first (the one whose centre is deeper in the picture).
  const sides: (1 | -1)[] = [1, -1], sepOf = (sd: 1 | -1) => (typeof o.sep === 'number' ? o.sep : o.sep[sd > 0 ? 0 : 1]);
  const depth = (sd: 1 | -1) => camSpace(c, [o.at[0] + Math.cos(o.n) * sd * (sepOf(sd) + r * 0.4), o.at[1], o.at[2] + Math.sin(o.n) * sd * (sepOf(sd) + r * 0.4)]).d;
  sides.sort((x, y) => depth(y) - depth(x)).forEach((sd, i) => {
    paintOnionHalf(p, c, seed + (sd > 0 ? 0 : 100), o.at, r, o.n, sd, sepOf(sd), (o.turn ?? [0, 0])[sd > 0 ? 0 : 1]);
    if (i === 0) between?.();
  });
};

/**
 * A chef's knife in world metres (W5.2 G-A, N3; B02-SH02 insert): the blade lies in the vertical plane through `tip` along the
 * horizontal direction `dirAng` (x-z angle), its spine tilted `tilt` radians down toward the tip; the handle runs back from the
 * heel. Steel with a highlight, a dark spine and edge line, and a wet cut line when `wet`.
 */
export const paintWorldKnife = (p: Painter, c: YCam, seed: number, tip: V3, dirAng: number, tilt: number, hand = false) => {
  const d: V3 = [Math.cos(dirAng) * Math.cos(tilt), -Math.sin(tilt), Math.sin(dirAng) * Math.cos(tilt)];
  const up: V3 = [Math.cos(dirAng) * Math.sin(tilt), Math.cos(tilt), Math.sin(dirAng) * Math.sin(tilt)];
  const P = (s: number, h: number): V3 => [tip[0] - d[0] * s + up[0] * h, tip[1] - d[1] * s + up[1] * h, tip[2] - d[2] * s + up[2] * h];
  // Blade 0.20 m: edge along h = 0 with a curved belly near the tip, spine at h 0.045.
  const blade = [P(0, 0.004), P(0.03, 0.0), P(0.12, 0.0), P(0.2, 0.0), P(0.2, 0.046), P(0.06, 0.042), P(0.0, 0.02)].map((v) => camPoint(c, v));
  if (blade.some((q) => !q)) return;
  const bq = blade as Pt[];
  hardFill(p, seed, '#c9d0d4', bq);
  const hiQ = [P(0.03, 0.02), P(0.19, 0.022), P(0.19, 0.034), P(0.05, 0.032)].map((v) => camPoint(c, v)) as Pt[];
  if (hiQ.every(Boolean)) washAt(p, seed + 1, '#f4f8fa', 200, hiQ, 0.05, 0.2);
  const edge = [P(0.005, 0.003), P(0.03, 0.0005), P(0.2, 0.0005)].map((v) => camPoint(c, v)) as Pt[];
  const handle = [P(0.2, 0.004), P(0.33, 0.006), P(0.34, 0.03), P(0.2, 0.04)].map((v) => camPoint(c, v)) as Pt[];
  if (handle.every(Boolean)) {
    hardFill(p, seed + 2, '#3a2a22', handle);
    for (const s of [0.24, 0.3]) { const q = camPoint(c, P(s, 0.022)); if (q) hardFill(p, seed + 3 + s * 10, K.brass, ell(q[0], q[1], 2.5, 2.5, 8)); }
  }
  if (edge.every(Boolean)) inkLine(p, seed + 6, edge, {closed: false, weight: 1.2, color: '#f8fbfc'});
  inkLine(p, seed + 7, bq, {weight: 1.1, color: '#4d565c'});
  // Her right fist round the handle and the forearm running back up out of frame (the grip is above the insert's frame edge).
  const wr = camPoint(c, P(0.33, 0.02)), kn = camPoint(c, P(0.22, 0.02)), el = camPoint(c, add3(P(0.33, 0.02), [-d[0] * 0.18 + up[0] * 0.2, 0.22, -d[2] * 0.18 + up[2] * 0.2]));
  if (hand && wr && kn && el) {
    const L = KITCHEN_LIGHT, V = palOf(L), skin = toneOf(COOK.head.skin, L), hu = camUnit(c, P(0.3, 0.02)) * 1.05;
    const ang = Math.atan2(kn[1] - wr[1], kn[0] - wr[0]);
    const fore = shapedLimb(el, wr, ELBOW_W * hu * 1.1, 0.044 * hu, {bulge: 0.018 * hu, peak: 0.3, asym: 0.25, capB: false});
    hardFill(p, seed + 20, skin, fore);
    modelPart(p, seed + 21, skin, fore, L);
    inkLine(p, seed + 22, fore, {weight: V.lineOuter, color: lineOf(skin, L)});
    const F = fistParts(wr, ang, hu, -1);
    hardFill(p, seed + 23, skin, F.back);
    solid(p, seed + 24, skin, F.back, 4, 0, 0.2);
    const shd = planeBand(F.back, formDir(F.back, L.key), 0.58);
    if (shd.length) glaze(p, seed + 25, mixColor(skin, '#5a3020', 0.4), 80, shd, {border: 0.15, bleed: 0.03, split: 0});
    inkLine(p, seed + 26, F.back, {weight: V.lineOuter, color: lineOf(skin, L)});
    const dark = mixColor(skin, INK, 0.5);
    [...F.creases, F.thumbCrease].forEach((cr, i) => inkLine(p, seed + 27 + i, cr, {closed: false, weight: 1.5, curve: 0.5, color: dark}));
  }
};
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/**
 * Juice droplets spraying from a cut (W5.2 G-A, N7): `n` drops born over 3 frames from `l0` (shot-local frame) at `from` (world),
 * thrown up and toward the lens (`toward`, a horizontal unit vector in x-z), falling under gravity, each living `life` frames.
 * Pure function of the frame: per-drop speed and size from `hash`. Each drop is a pale bead stretched along its motion with a
 * dark lower rim and a warm window glint; it fades over its last 3 frames.
 */
export const paintDroplets = (p: Painter, c: YCam, seed: number, o: {from: V3; spread: number; l0: number; f: number; n: number; toward: [number, number]; life?: number}) => {
  const life = o.life ?? 8, side: [number, number] = [-o.toward[1], o.toward[0]];
  for (let i = 0; i < o.n; i++) {
    const h1 = hash(seed + i * 1.7), h2 = hash(seed + i * 3.3), h3 = hash(seed + i * 5.9), h4 = hash(seed + i * 7.1);
    const age = (o.f - o.l0 - 3 * h1) / 30;
    if (age < 0 || age * 30 > life) continue;
    const vUp = 0.9 + 0.9 * h2, vT = 0.35 + 0.6 * h3, vS = (h4 - 0.5) * 1.0, s0 = (h1 - 0.5) * o.spread;
    const pos = (t: number): V3 => [
      o.from[0] + side[0] * s0 + (o.toward[0] * vT + side[0] * vS) * t, o.from[1] + vUp * t - 4.9 * t * t, o.from[2] + side[1] * s0 + (o.toward[1] * vT + side[1] * vS) * t,
    ];
    const v = pos(age), v1 = pos(Math.max(0, age - 0.025));
    const q = camPoint(c, v), q1 = camPoint(c, v1);
    if (!q || !q1) continue;
    const R = Math.max(2, (0.0022 + 0.0024 * h3) * camUnit(c, v)), fade = Math.min(1, (life - age * 30) / 3);
    const dx = q[0] - q1[0], dy = q[1] - q1[1], L = Math.hypot(dx, dy), a = Math.atan2(dy, dx), st = Math.min(2.2, 1 + L / (R * 3));
    const L1 = p.layer(0.85 * fade, seed + 10 + i * 7);
    hardFill(L1, seed + 10 + i * 7, '#eef3ea', ell(q[0], q[1], R * st, R, 12, a));
    inkLine(L1, seed + 11 + i * 7, ell(q[0] + R * 0.12, q[1] + R * 0.18, R * st * 0.9, R * 0.9, 12, a).slice(1, 8), {closed: false, weight: Math.max(0.6, R * 0.22), color: '#8fa6a0'});
    hardFill(p.layer(fade, seed + 12 + i * 7), seed + 12 + i * 7, '#fff6dc', ell(q[0] - R * 0.35, q[1] - R * 0.35, R * 0.32, R * 0.28, 8));
    if (h2 > 0.6) hardFill(p.layer(0.8 * fade, seed + 13 + i * 7), seed + 13 + i * 7, '#ffd890', ell(q[0] + R * 0.3, q[1] - R * 0.1, R * 0.18, R * 0.16, 6));
  }
};

const boardItem = (pieces?: OnionPiece[], out?: CookOut, kn?: KitchenOpts['knife']): Item => ({
  at: [SET.onion[0], 0, SET.onion[2]],
  bias: -0.05,
  draw: (p, c) => {
    const B = SET.board, Y = B.y1 + 0.0004;
    paintBox(p, c, 41100, {...B}, '#d8a86a', {front: 0.34, left: 0.3, top: -0.04}, {ink: true});
    const bx = (B.x0 + B.x1) / 2, bz = (B.z0 + B.z1) / 2;
    wWash(p, c, 41105, '#b9874e', 70, qy(Y, bx + 0.08, bx + 0.2, bz - 0.12, bz - 0.02), 0.15, 0.4); // juice stain
    // W5.2 v6 (viewer check r5: "bottom third plain fills, little grain, no knife marks"): the board carries its use at a
    // contrast that reads at 270 px: tonal planks along x, long dark grain lines with a light line beside some, crossed
    // knife scores (a dark cut with a pale lip), a worn darker far edge and a darker near lip (its front face is shaded 0.34).
    for (let k = 0; k < 6; k++) {
      const z0 = B.z0 + 0.008 + k * 0.053;
      wWash(p, c, 41130 + k, k % 2 ? '#c38a4c' : '#e4b87a', 80, qy(Y, B.x0 + 0.01, B.x1 - 0.01, z0, z0 + 0.038 + 0.014 * hash(k)), 0.15, 0.6);
    }
    for (let k = 0; k < 26; k++) {
      const z = B.z0 + 0.012 + 0.3 * hash(k * 5.1 + 0.2), x0 = B.x0 + 0.01 + 0.22 * hash(k * 2.3), L = 0.12 + 0.28 * hash(k * 7.7), w = 0.004 * (hash(k * 3) - 0.5);
      const ln: V3[] = [[x0, Y, z], [Math.min(B.x1 - 0.012, x0 + L * 0.5), Y, z + w], [Math.min(B.x1 - 0.012, x0 + L), Y, z + w * 0.4]];
      wInk(p, c, 41140 + k, ln, {closed: false, weight: 0.7 + 0.7 * hash(k), color: k % 3 ? '#9a6838' : '#7a4e2a'});
      if (k % 4 === 0) wInk(p, c, 41170 + k, ln.map(([a, , z2]): V3 => [a, Y, z2 + 0.004]), {closed: false, weight: 0.6, color: '#f0cc90'});
    }
    for (let k = 0; k < 9; k++) {
      const x = B.x0 + 0.05 + 0.4 * hash(k * 9.1), z = B.z0 + 0.03 + 0.26 * hash(k * 4.7), d = 0.03 + 0.035 * hash(k * 1.3), a = (k % 2 ? 0.5 : -0.4) + 0.3 * hash(k * 2.2);
      const cut: V3[] = [[x, Y, z], [x + d * Math.cos(a), Y, z + d * Math.sin(a)]];
      wInk(p, c, 41200 + k, cut, {closed: false, weight: 1.3, color: '#6e4424'});
      wInk(p, c, 41220 + k, cut.map(([a2, , z2]): V3 => [a2, Y, z2 + 0.003]), {closed: false, weight: 0.7, color: '#f2d29c'});
    }
    wWash(p, c, 41206, '#8a5a30', 110, qy(Y, B.x0, B.x1, B.z0, B.z0 + 0.03), 0.06, 0.3); // worn far edge
    wWash(p, c, 41207, '#8a5a30', 90, qy(Y, B.x0, B.x1, B.z1 - 0.035, B.z1), 0.06, 0.3); // darker near lip
    // The cook's shadow reaches onto the far half of the board (window back-left: it falls toward the lens and right).
    wWash(p, c, 41208, '#6a3c20', 95, [[B.x0 + 0.1, Y, B.z0], [B.x1, Y, B.z0], [B.x1, Y, B.z0 + 0.12], [B.x0 + 0.22, Y, B.z0 + 0.06]], 0.08, 0.15);
    // Curled loose skins on the board (v6: they were flat pentagon chips).
    ([[0.15, -0.1, 0.35, 0.05], [-0.16, 0.06, -0.45, 0.042]] as const).forEach(([fx, fz, ang, sz], k) => {
      const q = camPoint(c, [SET.onion[0] + fx, Y, SET.onion[2] + fz]);
      if (q) paintLooseSkin(p, 41240 + k * 12, q[0], q[1], sz * camUnit(c, [SET.onion[0] + fx, Y, SET.onion[2] + fz]), ang);
    });
    if (out?.knife) paintKnife(p, 42100, out.knife.wrist, out.knife.ang, out.knife.unit, out.knife.wu, true, out.knife.fist);
    if (!pieces) paintOnion(p, c, 41120, SET.onion, SET.onionR);
    else pieces.forEach((o, i) => paintOnionPiece(p, c, i ? 44000 + i * 500 : 41120, o, kn && kn.inPiece === i ? () => paintWorldKnife(p, c, 42500, kn.tip, kn.dirAng, kn.tilt, kn.hand) : undefined));
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
  at: [-0.85, 0, -0.18],
  bias: -0.05,
  draw: (p, c) => {
    const rim = flatCircle(c, [-0.85, 0.97, -0.18], 0.09, 20), bot = flatCircle(c, [-0.85, 0.9, -0.18], 0.06, 16);
    if (rim.length < 3 || bot.length < 3) return;
    const sh = flatCircle(c, [-0.83, 0.901, -0.16], 0.08, 16);
    if (sh.length >= 3) washAt(p, 41500, '#5a3418', 80, sh, 0.3, 0.3);
    const xs = rim.map((q) => q[0]), l = Math.min(...xs), r = Math.max(...xs);
    const ym = (Math.min(...rim.map((q) => q[1])) + Math.max(...rim.map((q) => q[1]))) / 2, yb = Math.max(...bot.map((q) => q[1]));
    hardFill(p, 41501, '#3f6f8a', [[l, ym], [r, ym], [(l + r) / 2 + (r - l) * 0.3, yb], [(l + r) / 2 - (r - l) * 0.3, yb]]);
    hardFill(p, 41502, '#2c5068', rim);
    // Three whole garlic heads (W3.1 v2, viewer check r1: the v1 white balls read as eggs or rice): papery bulbs with clove
    // lobes, a pointed neck, purple streaks and clove lines, sitting proud of the bowl rim.
    ([[-0.89, 1.0, -0.19], [-0.82, 1.005, -0.16], [-0.855, 1.03, -0.21]] as V3[]).forEach((gv, k) => {
      const s = sphereAt(c, gv, 0.036);
      if (!s) return;
      const R = s.r;
      const head: Pt[] = Array.from({length: 30}, (_, i) => {
        const a = (i / 30) * Math.PI * 2, tp = Math.max(0, -Math.sin(a)), lobe = 1 + 0.07 * Math.abs(Math.cos(2.5 * a));
        return [s.x + R * 1.05 * lobe * Math.cos(a) * (1 - 0.55 * tp ** 4), s.y + R * 0.86 * Math.sin(a) - R * 0.5 * tp ** 6];
      });
      hardFill(p, 41510 + k * 6, '#f3ecdc', head);
      washAt(p, 41511 + k * 6, '#c9b9a0', 120, [[s.x + R * 0.2, s.y - R * 0.6], [s.x + R, s.y], [s.x + R * 0.6, s.y + R * 0.8], [s.x + R * 0.1, s.y + R * 0.85]], 0.15, 0.3);
      for (let q = -2; q <= 2; q++) {
        const line: Pt[] = [[s.x, s.y - R * 1.15], [s.x + q * R * 0.32, s.y - R * 0.45], [s.x + q * R * 0.42, s.y + R * 0.3], [s.x + q * R * 0.2, s.y + R * 0.82]];
        inkLine(p, 41512 + k * 6, line, {closed: false, weight: 0.6, color: q % 2 ? '#a88aa0' : '#b8a888', curve: 0.4});
      }
      washAt(p, 41513 + k * 6, '#b58aa8', 55, [[s.x - R * 0.05, s.y - R * 0.9], [s.x + R * 0.12, s.y - R * 0.9], [s.x + R * 0.3, s.y + R * 0.4], [s.x + R * 0.15, s.y + R * 0.5]], 0.15, 0.3);
      inkLine(p, 41514 + k * 6, [[s.x, s.y - R * 1.15], [s.x + R * 0.05, s.y - R * 1.45]], {closed: false, weight: 1.2, color: '#b8a888'});
      inkLine(p, 41515 + k * 6, head, {weight: 0.7, color: '#8a7a68'});
    });
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
    at: [0.06, 0, -0.1], bias: -0.05,
    draw: (p, c) => {
      const dish = flatCircle(c, [0.06, 0.905, -0.1], 0.09, 20);
      if (dish.length < 3) return;
      hardFill(p, 41700, '#f1ece0', dish);
      inkLine(p, 41701, dish, {weight: 0.6, color: '#8a8478'});
      [[0.03, -0.1], [0.09, -0.12], [0.07, -0.06]].forEach(([x, z], i) => {
        const s = sphereAt(c, [x, 0.93, z], 0.025);
        if (s) { hardFill(p, 41710 + i, '#7fae3e', ell(s.x, s.y, s.r, s.r * 0.85, 12)); washAt(p, 41715 + i, '#c8e07a', 140, ell(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.4, s.r * 0.3, 8), 0.1, 0.2); }
      });
      for (let k = 0; k < 4; k++) {
        const a = camPoint(c, [0.0 + 0.03 * k, 0.915, -0.14 + 0.02 * (k % 2)]), b = camPoint(c, [0.04 + 0.03 * k, 0.915, -0.16 + 0.02 * (k % 2)]);
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

/** A knife held in the right fist in world metres: `grip` is the wrist, `tip` the blade tip (0.30 m apart, `paintKnife`'s length). */
export type KnifeHold = {grip: V3; tip: V3};
export type CookState = {
  pose: AnyPoseId; face: ExpressionId; knife?: 'raised' | 'none'; headCock?: number; look?: Pt;
  /**
   * W5.2 G-A (Boss; scene sheets SS-R2). All optional: absent keeps LF01 exactly. With `knife: 'raised'` both arms are driven here
   * (the pose only sets the body), so `P25` chop / rest and the `P07` variant share one arm build.
   * `raise`: knife hand 0 = in front of the chest (y ~1.10, blade up and out) .. 1 = beside the shoulder (LF01); default 1.
   * `hold` + `holdMix`: the knife at a world grip/tip (chop on the board, resting on it), mixed over the raised hand 0..1 in picture.
   * `lHand`: the left wrist in world metres (default `HAND_AT` on the island top); `lFlat` 0..1 = palm on a surface (contact shadow).
   * `faceAdd`: face fields over the expression (tears, a blink `eyes: 'shut'`, mouth `open`). `rise`: shoulders/breath, metres.
   */
  raise?: number; hold?: KnifeHold; holdMix?: number; holdElbow?: [number, number];
  lHand?: V3; lFlat?: number; faceAdd?: Partial<FaceState>; rise?: number;
};
const lerpPt = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
const lerpAng = (a: number, b: number, u: number) => {
  let d = b - a;
  d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI;
  return a + d * u;
};
/** Chef's knife held in the fist at `wrist` (px), blade pointing along `ang` (radians, picture), length in px (`wu`: width unit, default `unit`). */
const paintKnife = (p: Painter, seed: number, wrist: Pt, ang: number, unit: number, wu = unit, bladeOnly = false, fistPx = 0) => {
  const d: Pt = [Math.cos(ang), Math.sin(ang)], n: Pt = [-d[1], d[0]];
  // `fistPx` (bladeOnly): the fist (rig, its own smaller unit, cocked at the wrist) holds the handle; the visible handle runs from
  // inside the fist to the heel at about half the fist's length, and the tip stays at 0.30 m.
  const s0 = fistPx > 0 ? Math.min(0.2, (0.5 * fistPx) / unit) : 0.1, rs = (s: number) => (s < 0.1 ? (s * s0) / 0.1 : s0 + ((s - 0.1) * (0.3 - s0)) / 0.2);
  const at = (s: number, w: number): Pt => [wrist[0] + d[0] * rs(s) * unit + n[0] * w * wu, wrist[1] + d[1] * rs(s) * unit + n[1] * w * wu];
  // Handle (0.12 m) through the fist, blade (0.20 m) beyond it with a curved belly and a steel highlight. `bladeOnly`: the knife is
  // painted after the island (a chop or a rest in front of her), and the fist already covers the handle.
  if (!bladeOnly) hardFill(p, seed, '#3a2a22', [at(-0.02, -0.014), at(0.1, -0.016), at(0.1, 0.016), at(-0.02, 0.014)]);
  else if (fistPx > 0) hardFill(p, seed + 5, '#3a2a22', [at(0.02, -0.014), at(0.1, -0.016), at(0.1, 0.016), at(0.02, 0.014)]);
  const blade: Pt[] = [at(0.1, -0.012), at(0.11, -0.024), at(0.24, -0.02), at(0.3, -0.002), at(0.29, 0.006), at(0.11, 0.012)];
  hardFill(p, seed + 1, '#c9d0d4', blade);
  washAt(p, seed + 2, '#f4f8fa', 200, [at(0.12, -0.016), at(0.25, -0.013), at(0.27, -0.008), at(0.12, -0.008)], 0.05, 0.2);
  inkLine(p, seed + 3, blade, {weight: 0.8, color: '#4d565c'});
};

type CookOut = {a?: FigAnchors; arm?: {E: Pt; T: Pt; unit: number; hu: number; flat?: number}; knife?: {wrist: Pt; ang: number; unit: number; wu: number; fist: number}};
/** Wrist of the cook's resting hand on the island top (B01-SH02, P07 + knife raised). */
const HAND_AT: V3 = [0.15, 0.9, -0.27];
const cookItem = (t: number, st: CookState, out: CookOut): Item => ({
  at: SET.cook,
  draw: (p, c) => {
    const at = SET.cook, g = camPoint(c, at), u = camUnit(c, at);
    if (!g) return;
    // Squared to the lens (front view): facing set from the camera of this frame's shot, passed in by the look frame (`facingCam`).
    const pose = poseFor(st.pose, COOK, g, u, 'front');
    const face = {...EXPRESSIONS[st.face], ...(st.look ? {look: st.look} : {}), ...(st.faceAdd ?? {})};
    if (st.rise) pose.rise = (pose.rise ?? 0) + st.rise;
    let knifeAng = -Math.PI / 2 - 0.35, knifeU = u, knifeW = u;
    if (st.knife === 'raised' && st.pose === 'P07' && pose.rArm?.via) {
      // W3.1 v2 (viewer check r1: elbow/shoulder seams and a stiff vertical forearm): the knife is held up beside her face with
      // the elbow tucked back at her side (CP-P02, `behind: 'upper'`), so the elbow joint and the sleeve cut sit behind the torso
      // and only the forearm and fist show, rising past the shoulder line. Both bones at the P07 length (0.26 m); the shoulder
      // is recovered from P07's authored elbow.
      const k = COOK.armScale ?? 1, sh: Pt = [pose.rArm.via[0] + 0.184 * k * u, pose.rArm.via[1] + 0.183 * k * u];
      const M = (dx: number, dy: number): Pt => [sh[0] + dx * k * u, sh[1] - dy * k * u];
      // W5.2 G-A (B01-SH02 l 0-12): from the chest (wrist ~0.27 m under the shoulder, blade up and out past her cheek) to LF01's hold.
      const r = st.raise ?? 1;
      let via = r >= 1 ? M(-0.08, -0.22) : lerpPt(M(-0.06, -0.25), M(-0.08, -0.22), r);
      let to = r >= 1 ? M(-0.17, 0.02) : lerpPt(M(0.03, -0.27), M(-0.17, 0.02), r);
      knifeAng = r >= 1 ? -Math.PI / 2 - 0.22 : lerpAng(-Math.PI / 2 - 0.6, -Math.PI / 2 - 0.22, r);
      // W5.2 G-A (B01-SH03 chop, B01-SH01 / B02-SH01 rest): the wrist goes to a world grip and the blade to a world tip; the elbow
      // stays back at her side (`holdElbow`, shoulder-relative metres), the knife's length and width follow the projection.
      const m = st.hold ? Math.max(0, Math.min(1, st.holdMix ?? 1)) : 0;
      if (st.hold && m > 0) {
        const W = camPoint(c, st.hold.grip), P = camPoint(c, st.hold.tip);
        if (W && P) {
          const L = Math.hypot(P[0] - W[0], P[1] - W[1]) / 0.3, he = st.holdElbow ?? [-0.1, -0.2];
          via = lerpPt(via, M(he[0], he[1]), m);
          to = lerpPt(to, W, m);
          knifeAng = lerpAng(knifeAng, Math.atan2(P[1] - W[1], P[0] - W[0]), m);
          knifeU = u + (L - u) * m;
          knifeW = u + (Math.max(L, camUnit(c, st.hold.grip) * 0.8) - u) * m;
        }
      }
      pose.rArm = {...pose.rArm, via, to, behind: 'upper', fist: -1};
    }
    // W5.2 v6 (Boss; viewer check r5: "the screen-right forearm runs straight down behind the counter with no hand"; v5 put
    // the wrist 0.4 m below the shoulder, under the island's far edge, so the island hid the hand): her left arm (screen
    // right) keeps the elbow at her side (CP-P arm depth) and the forearm reaches forward and out to the island top, the wrist
    // on the top at HAND_AT (0.03 m inside the far edge). The rig paints the whole arm; the island then covers the part below
    // its far edge, and `handItem` repaints the forearm and the open mitten hand over the top with a contact shadow.
    if (st.knife === 'raised') {
      const k = COOK.armScale ?? 1, sh = shoulderPoint(COOK, g, u, {...pose, view: 'front'}, 'l');
      const LH = st.lHand ?? HAND_AT, T0 = camPoint(c, LH);
      if (T0) {
        const E: Pt = [sh[0] + 0.03 * k * u, sh[1] + 0.25 * k * u];
        pose.lArm = {via: E, to: T0, open: 1};
        out.arm = {E, T: T0, unit: u, hu: camUnit(c, LH), flat: st.lFlat ?? (st.lHand ? 0 : 1)};
      }
    }
    // Knife first, so the rig's fist (KITCHEN_LIGHT.shaped, UT14) closes over the handle: grip from the pose's wrist target.
    // W5.2 G-A: once the knife comes down in front of her (hold mix > 0.35) its blade is painted by the board, after the island
    // and before the onion pieces (a blade through the onion reads inside it); the rig's fist covers the handle.
    const late = !!st.hold && (st.holdMix ?? 1) > 0.35;
    if (st.knife === 'raised' && pose.rArm) {
      if (late) out.knife = {wrist: pose.rArm.to, ang: knifeAng, unit: knifeU, wu: knifeW, fist: 0.085 * u * (KITCHEN_LIGHT.handScale ?? 1)};
      else paintKnife(p, 42100, pose.rArm.to, knifeAng, knifeU, knifeW);
    }
    const a = drawFigure(p, COOK, g, u, {...pose, face, headCock: st.headCock, light: KITCHEN_LIGHT}, t);
    // W5.2 v6 (viewer check r5: "2-3 px warm hair rim, no tan streak"): KITCHEN_LIGHT's straight-cut rim band is cut to a
    // sliver (rimTo 0.006), and the window rim on the hair is one thin warm line just inside the upper-left silhouette of
    // the curly cloud (kit `hairFront('curly').back`, placed with the rig's own head frame: K = HD / HEAD_SPAN, head cock
    // about the neck-top pivot), fading in and out along the arc that faces the window.
    if (COOK.head.cut === 'curly') {
      const HD = H * (COOK.headScale ?? 1), Kpx = (HD / HEAD_SPAN) * u, d = CHIN * Kpx - 0.051 * u, th = ((st.headCock ?? 0) * Math.PI) / 180;
      const pv: Pt = [a.head[0] - d * Math.sin(th), a.head[1] + d * Math.cos(th)], hc: Pt = [pv[0], pv[1] - d];
      const rot = ([x, y]: Pt): Pt => [pv[0] + (x - pv[0]) * Math.cos(th) - (y - pv[1]) * Math.sin(th), pv[1] + (x - pv[0]) * Math.sin(th) + (y - pv[1]) * Math.cos(th)];
      const cloudPts = (hairFront('curly').back ?? [])[0] ?? [];
      const lit = [-0.88, -0.48], arc: {q: Pt; w: number}[] = [];
      cloudPts.slice(0, 81).forEach(([x, y]) => {
        const l = Math.hypot(x, y + 0.25) || 1, f = ((x / l) * lit[0] + ((y + 0.25) / l) * lit[1] - 0.35) / 0.65;
        if (f > 0) arc.push({q: rot([hc[0] + x * Kpx * (1 - 2 / (l * Kpx)), hc[1] + y * Kpx * (1 - 2 / (l * Kpx))]), w: Math.min(1, f * 1.6)});
      });
      if (arc.length >= 3) {
        inkLine(p.layer(0.85, 42400), 42400, arc.map((v) => v.q), {closed: false, weight: 2.6, color: '#e8923e', curve: 0.5});
        inkLine(p.layer(0.5, 42401), 42401, arc.slice(Math.floor(arc.length * 0.2), Math.ceil(arc.length * 0.8)).map((v) => v.q), {closed: false, weight: 1.2, color: '#ffc27a', curve: 0.5});
      }
    }
    // W5.2 v6 (viewer check r5: "dark sliver at the apron bottom"): behind the island the plum skirt showed as a dark strip
    // beside the apron's lower edge, above the island's far edge; the apron skirt flares to cover it (hidden below the top).
    const HD = H * (COOK.headScale ?? 1), chin = COOK.height - HD, hip = chin - 0.16 * HD - (chin - 0.068) * 0.44 + 0.034; // cast.ts hip0
    const S = (du: number, dv: number): Pt => [g[0] + du * u, g[1] - dv * u];
    for (const sd of [-1, 1]) solid(p, 42060 + sd, APRON, [S(sd * 0.1, hip + 0.04), S(sd * 0.125, hip + 0.04), S(sd * 0.17, 0.5), S(sd * 0.1, 0.5)], 3, 0.06, 0.2);
    paintBibApron(p, COOK, g, u, 42000, a);
    out.a = a;
  },
});

/**
 * The cook's resting hand over the island top (v6): the forearm from the elbow to the wrist and an open mitten hand lying
 * palm-down on the top, fingers toward the lens and out, painted after the island (the rig's own copy of it is under the
 * island's far edge), with a soft contact shadow toward the lens-right and a darker core under the palm.
 * Same shape calls as the rig's shaped front arm (`shapedLimb` forearm, `openHandParts` HL1 mitten) under KITCHEN_LIGHT.
 */
const handItem = (out: CookOut, at: V3 = HAND_AT, carry?: V3): Item => ({
  at,
  bias: -0.3,
  draw: (p, c) => {
    const A = out.arm;
    if (!A) return;
    // W5.2 G-A (B02-SH01): the onion she carries in: its shadow on the board (fading with height), then the hand, then the onion
    // over the palm (she holds it from behind and above, the mitten's fingertips over its shoulder).
    if (carry) {
      const hgt = carry[1] - SET.onion[1], sh = flatCircle(c, [carry[0] + 0.01, 0.9205, carry[2] + 0.008], SET.onionR * (1 + 2 * hgt), 18);
      if (sh.length >= 3) washAt(p, 45790, '#5a3418', Math.max(0, 120 * (1 - hgt / 0.15)), sh, 0.2, 0.2);
    }
    const L = KITCHEN_LIGHT, V = palOf(L), skin = toneOf(COOK.head.skin, L), unit = A.unit;
    const fa = Math.atan2(A.T[1] - A.E[1], A.T[0] - A.E[0]), ang = fa + 0.5, hk = A.hu * 0.92;
    // The hand's wrist sits a little back inside the forearm's end so the two overlap (no gap at the wrist).
    const hand = openHandParts([A.T[0] - Math.cos(fa) * 0.012 * hk, A.T[1] - Math.sin(fa) * 0.012 * hk], ang, hk, 1);
    // Contact shadow first, on the wood: a soft pool offset toward the lens-right and a tight dark core under the palm.
    const off = (pts: Pt[], dx: number, dy: number, f: number): Pt[] => {
      const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
      return pts.map(([x, y]): Pt => [cx + (x - cx) * f + dx, cy + (y - cy) * f * 0.8 + dy]);
    };
    // W5.2 G-A: the contact shadow only when the palm lies on a surface (`flat`, default 1 on the island top); a hand in the air or
    // over an onion it carries casts none here.
    const fl = A.flat ?? 1;
    if (fl > 0) {
      washAt(p, 42300, '#3a1e10', 130 * fl, off(hand.palm, 0.02 * hk, 0.024 * hk, 1.08), 0.15, 0.2);
      washAt(p, 42301, '#2a140a', 150 * fl, off(hand.palm, 0.012 * hk, 0.014 * hk, 0.92), 0.1, 0.15);
    }
    const fore = shapedLimb(A.E, A.T, ELBOW_W * unit, 0.044 * unit * (1 + ((L.handScale ?? 1) - 1) * 0.75), {bulge: 0.018 * unit, peak: 0.3, asym: 0.25, capB: false});
    hardFill(p, 42310, skin, fore);
    solid(p, 42311, skin, fore, 4, 0, 0.2);
    modelPart(p, 42312, skin, fore, L);
    inkLine(p, 42313, fore, {weight: V.lineOuter, color: lineOf(skin, L)});
    hardFill(p, 42320, skin, hand.palm);
    solid(p, 42321, skin, hand.palm, 4, 0, 0.2);
    const shd = planeBand(hand.palm, formDir(hand.palm, L.key), 0.58);
    if (shd.length) glaze(p, 42322, mixColor(skin, '#5a3020', 0.4), 80, shd, {border: 0.15, bleed: 0.03, split: 0});
    inkLine(p, 42323, hand.palm, {weight: V.lineOuter, color: lineOf(skin, L)});
    const dark = mixColor(skin, INK, 0.5);
    [...hand.creases, hand.thumbCrease].forEach((cr, i) => inkLine(p, 42330 + i, cr, {closed: false, weight: 1.5, curve: 0.5, color: dark}));
    if (carry) paintOnion(p, c, 45800, carry, SET.onionR, {noShadow: true});
  },
});

export type KitchenOpts = {
  t: number; cook?: CookState;
  /** W5.2 G-A: the onions on the board (default: the LF01 whole onion at `SET.onion`); `carry`: an onion in her left hand (world centre). */
  pieces?: OnionPiece[]; carry?: V3;
  /** A knife in the world (B02-SH02 insert: the grip is above frame, no cook arm). */
  knife?: {tip: V3; dirAng: number; tilt: number; hand?: boolean; /** Index into `pieces`: the blade stands in that piece's cut (painted between its halves). */ inPiece?: number};
  /** Juice droplets (N7), painted last in front of the set. */
  droplets?: Parameters<typeof paintDroplets>[3][];
  /** The cook (and her hand) colour-mixed toward the room air 0..1: soft behind a close prop (B01-SH01, B02-SH01). */
  cookSoft?: number;
};
/** Paint SET-KITCHEN seen from `c`: shell and window, then the set items depth-sorted far to near with the cook. Returns the cook's anchors. */
export const paintKitchen = (p: Painter, c: YCam, o: KitchenOpts): FigAnchors | undefined => {
  paintShell(p, c);
  paintWindow(p, c, o.t);
  const out: CookOut = {};
  const items: Item[] = [backCounter(o.t), shelfAndRail(), fridgeItem(), islandItem(), boardItem(o.pieces, out, o.knife), basketItem(), garlicItem(), pendantItem(o.t), ...homeProps()];
  if (o.cook) {
    const soft = o.cookSoft ?? 0, sp = (it: Item): Item => (soft > 0 ? {...it, draw: (q, cc) => it.draw(tintPainter(q, '#d9c3a0', soft), cc)} : it);
    items.push(sp(cookItem(o.t, o.cook, out)), sp(handItem(out, o.cook.lHand ?? HAND_AT, o.carry)));
  }
  if (o.knife && o.knife.inPiece === undefined) { const kn = o.knife; items.push({at: kn.tip, bias: -0.2, draw: (q, cc) => paintWorldKnife(q, cc, 42500, kn.tip, kn.dirAng, kn.tilt, kn.hand)}); }
  // Window light after the back counter (it lies on the counter top) and before the island props.
  items.push({at: [-0.7, 0, -1.25], bias: -0.01, draw: (q, cc) => paintWindowLight(q, cc)});
  paintSorted(p, c, items);
  paintBeam(p, c);
  // Warm room glaze over the far set (air), very light.
  glaze(p, 41900, '#f6cf86', 18, [[-200, -200], [1280, -200], [1280, 2200], [-200, 2200]], {border: 0});
  (o.droplets ?? []).forEach((d, i) => paintDroplets(p, c, 43000 + i * 400, d));
  return out.a;
};

/** The facing that squares the cook to a camera (front view), for a shot's mid-frame camera (kit `squareToCam`). */
export const cookFacing = (c: YCam) => squareToCam(c, SET.cook, 'front');
export {INK};

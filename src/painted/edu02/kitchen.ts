import {drawFigure, ELBOW_W, H, shoulderPoint, type FigAnchors} from '../kit/cast';
import {blob, clipHalf, ell, fistParts, formDir, glaze, hardFill, inkLine, INK, lineOf, modelPart, openHandParts, palOf, planeBand, shapedLimb, solid, toneOf, washAt, type InteriorLight} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {hairFront} from '../kit/hair';
import {CHIN, HEAD_SPAN, type FaceState} from '../kit/head';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {poseFor, poseMix, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam} from '../kit/views';
import {camPoint, camSpace, camUnit, type YCam} from '../kit/ycam';
import {APRON, COOK, paintBibApron} from './cast';
import {candleItems, FRIDGE_COLD, fridgePovItems, paintBreadInMouth, paintGoggles, paintFridgeDark, paintFrontWall, paintFrost, paintMatch, type CandleState} from './props';
import {flatCircle, hull, paintBox, paintSorted, qx, qy, qz, sphereAt, wFill, wInk, wp, wWash, type Item} from './world';

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
  // W5.2 G-D (B05-SH04, the fridge POV looks toward +z): the front wall closes the room on the camera side; never seen before.
  if (Math.cos(c.yaw) < -0.2) paintFrontWall(p, c, 3, -2.6, S.rightX, S.ceilY, K.wall);
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
export type OnionPiece = (
  | {kind: 'whole'; at: V3; r?: number}
  | {kind: 'halves'; at: V3; r?: number; n: number; sep: number | [number, number]; turn?: [number, number]}
  /** W5.2 G-C (B04-SH03): `n` cut slices lying flat on the board in a row from `at` along +x, ring face up, the newest last. */
  | {kind: 'slices'; at: V3; r?: number; n: number}
  /**
   * W5.2 G-E (B06-SH04, O4): a fresh half onion lying cut face down, `at` the centre of its flat face on the board, `axis` the x-z
   * angle of its stem-root axis (+axis end = the root). `cut`: a slice plane at `s` m along the axis from the centre, the knife's
   * depth into it `depth` 0..1 (a groove over the dome), and the slice (the cap past `s`) falling away `fall` 0..1.
   */
  | {kind: 'dome'; at: V3; r?: number; axis: number; cut?: {s: number; depth: number; fall: number}}
  /**
   * W5.2 G-F (B07, O4): the same half onion turned cut face up, resting on its round side; `at` the centre of its footprint on the
   * board, `axis` the x-z angle of the stem-root axis (+axis = root), `trim` metres sliced off the root end (B07-SH03 strokes).
   */
  | {kind: 'cup'; at: V3; r?: number; axis: number; trim?: number}
) & {
  /** W5.2 G-D (N4, O3 from the fridge): 0..1 white rime and specks on the skin (W5.3: no tint, no twinkle); `t` seconds. */
  frost?: number; t?: number;
};

/**
 * One onion slice lying flat on the board (W5.2 G-C, N4 pieces): a half-disc of the onion's section (`ang` points its round side), a
 * thin darker side band for its thickness, the cream ring face with three ring arcs, the skin rim and a soft contact shadow.
 */
const paintOnionSlice = (p: Painter, c: YCam, seed: number, at: V3, R: number, ang: number, tint?: string) => {
  const ON = tint ? mixColor(K.onion, tint, 0.4) : K.onion, FACE = tint ? mixColor('#f3ead2', tint, 0.3) : '#f3ead2';
  const y0 = SET.board.y1 + 0.0005, th = 0.006;
  const disc = (y: number, s = 1): V3[] => Array.from({length: 15}, (_, k) => {
    const a = ang - Math.PI / 2 + (k / 14) * Math.PI;
    return [at[0] + R * s * Math.cos(a), y, at[2] + R * s * Math.sin(a)];
  });
  const sh = wp(c, disc(y0).map(([x, y, z]): V3 => [x + 0.004, y, z + 0.004]));
  if (sh.length >= 3) washAt(p, seed, '#3a2014', 90, sh, 0.1, 0.2);
  const side = hull([...wp(c, disc(y0)), ...wp(c, disc(y0 + th))]);
  if (side.length >= 3) hardFill(p, seed + 1, dk(ON, 0.25), side);
  const top = wp(c, disc(y0 + th));
  if (top.length < 3) return;
  hardFill(p, seed + 2, FACE, top);
  const wk = Math.max(0.5, (R * camUnit(c, at)) / 60);
  [0.75, 0.5, 0.26].forEach((s, i) => {
    const ring = wp(c, disc(y0 + th + 0.0002, s));
    if (ring.length >= 3) inkLine(p, seed + 3 + i, ring.slice(0, -1), {closed: false, weight: wk * (i % 2 ? 0.7 : 1), color: i % 2 ? '#d9c79c' : '#c9b27e'});
  });
  inkLine(p, seed + 7, top, {weight: wk * 1.6, color: ON});
};


/** One onion half (`side` +1 / -1 of the cut normal). Cut face `#f3ead2` with ring lines, skin with layer lines, contact shadow. */
const paintOnionHalf = (p: Painter, c: YCam, seed: number, at: V3, r: number, nAng: number, side: 1 | -1, sep: number, turn: number, tint?: string) => {
  // W5.2 G-D: `tint` (O3 frost) mixes the skin 0.4 and the cut face 0.3 toward it (the kit tint painter does not reach hardFill).
  const ON = tint ? mixColor(K.onion, tint, 0.4) : K.onion, FACE = tint ? mixColor('#f3ead2', tint, 0.3) : '#f3ead2';
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
  hardFill(p, seed + 1, ON, hl);
  const sd = clipHalf(hl, [0.8, 0.6], cx * 0.8 + cy * 0.6 - r * unit * 0.15);
  if (sd.length >= 3) washAt(p, seed + 2, dk(ON, 0.4), 150, sd, 0.2, 0.4);
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
    if (pts.length >= 3) inkLine(p, seed + 10 + k, pts, {closed: false, weight: wk * 1.1, color: dk(ON, 0.5), curve: 0.4});
  }
  // Cut face: visible when its normal (-e1) points at the lens.
  const fn: V3 = [-e1[0], 0, -e1[2]], fc = W(0, 0, 0);
  if (facing(fc, fn) && fq.length >= 3) {
    hardFill(p, seed + 20, FACE, fq);
    // The skin rim round the face, then rings (the onion's layers), each ring a scaled copy of the face outline about its centre.
    inkLine(p, seed + 21, fq, {weight: wk * 2.4, color: ON});
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
  inkLine(p, seed + 40, hl, {weight: wk * 1.0, color: dk(ON, 0.6)});
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

/**
 * A half onion lying cut face down (W5.2 G-E, N4 `O4`; B06-SH04): a dome 1.06 r high and wide over a 0.92 r half-axis, its skin
 * longitudes running stem to root along the axis, a dry neck stub at the stem end (-axis) and the root tuft at the root end. With
 * `cut` the dome is two parts split at the slice plane `s` (the knife's groove over the top while `depth` < 1 and before the slice
 * falls), the slice (cap) sliding off along +axis by `fall` and showing the ringed cut face of the rest when that face meets the lens.
 * `between` is painted after the farther part (the blade standing in the cut).
 */
const paintOnionDome = (p: Painter, c: YCam, seed: number, at: V3, r: number, axis: number, cut?: {s: number; depth: number; fall: number}, between?: () => void) => {
  const A = r * 1.06, L = r * 0.92, e1: V3 = [Math.cos(axis), 0, Math.sin(axis)], e3: V3 = [-Math.sin(axis), 0, Math.cos(axis)];
  const camW: V3 = [c.x, c.y, c.z], unit = camUnit(c, at), wk = Math.max(0.6, (r * unit) / 70);
  const rho = (s: number) => Math.sqrt(Math.max(0, 1 - (s / L) ** 2));
  const W = (s: number, al: number, sh = 0, y = at[1]): V3 => {
    const k = rho(s);
    return [at[0] + e1[0] * (s + sh) + e3[0] * A * k * Math.cos(al), y + A * k * Math.sin(al), at[2] + e1[2] * (s + sh) + e3[2] * A * k * Math.cos(al)];
  };
  const facing = (v: V3, n: V3) => (camW[0] - v[0]) * n[0] + (camW[1] - v[1]) * n[1] + (camW[2] - v[2]) * n[2] > 0;
  const pts = (vs: V3[]) => vs.map((v) => camPoint(c, v)).filter((q): q is Pt => !!q);
  const face = (s: number, sh: number, sc = 1): V3[] => Array.from({length: 17}, (_, k) => {
    const al = (k / 16) * Math.PI, k0 = rho(s) * sc;
    return [at[0] + e1[0] * (s + sh) + e3[0] * A * k0 * Math.cos(al), at[1] + A * k0 * Math.sin(al), at[2] + e1[2] * (s + sh) + e3[2] * A * k0 * Math.cos(al)];
  });
  type Part = {s0: number; s1: number; sh: number; faceS?: number; faceN?: 1 | -1; id: number};
  const fall = cut ? Math.max(0, Math.min(1, cut.fall)) : 0, cs = cut ? cut.s : L;
  // Split once the blade is in (depth > 0): the rest, then the blade (`between`), then the slice on the lens side of the plane
  // (+axis toward the lens in B06-SH04), so the slice's skin hides the blade inside the cut.
  const parts: Part[] = cut && (fall > 0 || cut.depth > 0)
    ? [{s0: -L, s1: cs, sh: 0, faceS: cs, faceN: 1, id: 0}, {s0: cs, s1: L, sh: 0.028 * fall, faceS: cs, faceN: -1, id: 1}]
    : [{s0: -L, s1: L, sh: 0, id: 0}];
  const dep = (pt: Part) => camSpace(c, W((pt.s0 + pt.s1) / 2, Math.PI / 2, pt.sh)).d;
  const paintPart = (pt: Part) => {
    const sd = seed + pt.id * 200, grid: V3[] = [];
    for (let i = 0; i <= 12; i++) for (let j = 0; j <= 12; j++) grid.push(W(pt.s0 + ((pt.s1 - pt.s0) * i) / 12, (j / 12) * Math.PI, pt.sh));
    const hl = hull(pts(grid));
    if (hl.length < 3) return;
    // Contact shadow: the part's footprint on the board nudged toward the lens-right (window back-left).
    const foot = hull(pts(Array.from({length: 24}, (_, k) => {
      const s = pt.s0 + ((pt.s1 - pt.s0) * (k % 12)) / 11, al = k < 12 ? 0 : Math.PI, v = W(s, al, pt.sh, at[1] + 0.0005);
      return [v[0] + 0.006, v[1], v[2] + 0.005] as V3;
    })));
    if (foot.length >= 3) washAt(p, sd, '#3a2014', 130, foot, 0.12, 0.2);
    hardFill(p, sd + 1, K.onion, hl);
    const cx = hl.reduce((s, q) => s + q[0], 0) / hl.length, cy = hl.reduce((s, q) => s + q[1], 0) / hl.length;
    const shd = clipHalf(hl, [0.8, 0.6], cx * 0.8 + cy * 0.6 - r * unit * 0.1);
    if (shd.length >= 3) washAt(p, sd + 2, dk(K.onion, 0.4), 150, shd, 0.2, 0.4);
    for (let k = 0; k < 3; k++) {
      const q = camPoint(c, W((pt.s0 + pt.s1) / 2 - 0.2 * (pt.s1 - pt.s0), 2.2, pt.sh));
      if (q) hardFill(p.layer(0.1, sd + 100 + k), sd + 100 + k, '#f2c886', ell(q[0], q[1], (0.3 - 0.06 * k) * A * unit, (0.22 - 0.05 * k) * A * unit, 16, -0.3));
    }
    // Skin longitudes (constant angle round the axis), where the surface faces the lens.
    for (let k = 1; k < 9; k++) {
      const al = (k / 9) * Math.PI, line: Pt[] = [];
      for (let i = 0; i <= 14; i++) {
        const s = pt.s0 + ((pt.s1 - pt.s0) * i) / 14, v = W(s, al, pt.sh), ctr: V3 = [at[0] + e1[0] * (s + pt.sh), at[1], at[2] + e1[2] * (s + pt.sh)];
        const q = camPoint(c, v);
        if (q && facing(v, [v[0] - ctr[0], v[1] - ctr[1], v[2] - ctr[2]])) line.push(q);
      }
      if (line.length >= 3) inkLine(p, sd + 10 + k, line, {closed: false, weight: wk * (k > 4 ? 1.3 : 1.0), color: k > 4 ? dk(K.onion, 0.6) : dk(K.onion, 0.45), curve: 0.4});
    }
    // Ringed cut face at the slice plane, when it meets the lens.
    if (pt.faceS !== undefined && pt.faceN) {
      const n: V3 = [e1[0] * pt.faceN, 0, e1[2] * pt.faceN], fc = W(pt.faceS, Math.PI / 2, pt.sh, at[1]);
      const fq = pts(face(pt.faceS, pt.sh));
      if (facing([fc[0], at[1] + 0.02, fc[2]], n) && fq.length >= 3) {
        hardFill(p, sd + 30, '#f3ead2', fq);
        inkLine(p, sd + 31, fq, {weight: wk * 2.2, color: K.onion});
        [0.82, 0.64, 0.46, 0.28].forEach((s, i) => {
          const ring = pts(face(pt.faceS!, pt.sh, s));
          if (ring.length >= 3) inkLine(p, sd + 32 + i, ring.slice(0, -1), {closed: false, weight: wk * (i % 2 ? 0.7 : 1.0), color: i % 2 ? '#d9c79c' : '#c9b27e'});
        });
      }
    }
    inkLine(p, sd + 40, hl, {weight: wk * 1.0, color: dk(K.onion, 0.6)});
    // Root tuft at the +axis end, a dry neck stub at the -axis end.
    if (pt.s1 >= L - 1e-6) {
      const rt = camPoint(c, [at[0] + e1[0] * (L + pt.sh), at[1] + A * 0.3, at[2] + e1[2] * (L + pt.sh)]), R = r * unit;
      if (rt) for (let k = 0; k < 9; k++) {
        const f = k / 8 - 0.5, h = hash(sd + k * 3.1);
        inkLine(p, sd + 50 + k, [[rt[0], rt[1] + f * R * 0.25], [rt[0] + R * (0.06 + 0.04 * h), rt[1] + f * R * 0.5], [rt[0] + R * (0.1 + 0.05 * h), rt[1] + f * R * 0.75 + R * 0.04]], {closed: false, weight: wk * 0.7, color: k % 3 ? '#cdb184' : '#8a6a42', curve: 0.5});
      }
    }
    if (pt.s0 <= -L + 1e-6) {
      const n0 = camPoint(c, [at[0] - e1[0] * L * 0.97, at[1] + A * 0.4, at[2] - e1[2] * L * 0.97]), nx = at[1] + A * 0.45;
      const n1 = camPoint(c, [at[0] - e1[0] * (L + 0.018), nx, at[2] - e1[2] * (L + 0.018)]), n2 = camPoint(c, [at[0] - e1[0] * (L + 0.034), nx + 0.006, at[2] - e1[2] * (L + 0.034)]);
      if (n0 && n1 && n2) {
        inkLine(p, sd + 60, [n0, n1, n2], {closed: false, weight: wk * 3.2, color: '#7a4a24', curve: 0.5});
        inkLine(p, sd + 61, [n0, n1], {closed: false, weight: wk * 1.0, color: '#d8a868', curve: 0.5});
      }
    }
  };
  const order = parts.slice().sort((a, b) => dep(b) - dep(a));
  order.forEach((pt, i) => {
    paintPart(pt);
    if (i === 0) between?.();
  });
  {
    // The knife's groove over the dome while the blade is in it (before the slice falls).
    if (cut && fall <= 0 && cut.depth > 0) {
      const d = Math.min(1, cut.depth), g = pts(Array.from({length: 13}, (_, k) => W(cut.s, Math.PI / 2 + (k / 12 - 0.5) * Math.PI * d)));
      if (g.length >= 2) {
        inkLine(p, seed + 90, g, {closed: false, weight: wk * 1.8, color: '#5e3818', curve: 0.4});
        inkLine(p.layer(0.8, seed + 91), seed + 91, g.map(([x, y]): Pt => [x + wk, y + wk * 0.6]), {closed: false, weight: wk * 0.9, color: '#f6ecd0', curve: 0.4});
      }
    }
  }
};

/** Cut-face height of the `cup` half above the board (its round side flattened a little where it rests), in units of `r`. */
const CUP_H = 1.06 * 0.86;
/**
 * The half onion lying cut face up (W5.2 G-F, N4 `O4`; B07): a bowl of the dome's proportions (1.06 r across, 0.92 r half-axis)
 * whose flat face sits CUP_H r above the board. The cut face is the brief's cream `#f3ead2` with the longitudinal section's
 * layers: nested ovals that close in toward the root plate, alternate bands in `#dfe6c0` and a tan line at each layer edge (the
 * pale green alone is ~1.1:1 on the cream), a yellow-green heart near the root and a wet sheen. Skin longitudes show on the visible
 * belly under the rim, a dry neck stub at the stem end, the root tuft at the root end unless `trim` has cut it off.
 */
const paintOnionCup = (p: Painter, c: YCam, seed: number, at: V3, r: number, axis: number, trim = 0) => {
  const A = r * 1.06, L = r * 0.92, h = r * CUP_H, s1 = L - Math.max(0, trim), e1: V3 = [Math.cos(axis), 0, Math.sin(axis)], e3: V3 = [-Math.sin(axis), 0, Math.cos(axis)];
  const camW: V3 = [c.x, c.y, c.z], unit = camUnit(c, at), wk = Math.max(0.6, (r * unit) / 70);
  const rho = (s: number) => Math.sqrt(Math.max(0, 1 - (s / L) ** 2));
  const P3 = (s: number, u: number, y: number): V3 => [at[0] + e1[0] * s + e3[0] * u, y, at[2] + e1[2] * s + e3[2] * u];
  /** Bowl surface: `al` 0..pi from one rim edge under the belly to the other. */
  const B = (s: number, al: number): V3 => P3(s, A * rho(s) * Math.cos(al), at[1] + h - h * rho(s) * Math.sin(al));
  const pts = (vs: V3[]) => vs.map((v) => camPoint(c, v)).filter((q): q is Pt => !!q);
  /** Face outline scaled `k` about the point `sr` along the axis (k 1 = the rim), clipped at the trimmed end. */
  const sr = L * 0.62;
  const rim = (k: number, yOff = 0): V3[] => {
    const out: V3[] = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2, s = L * Math.cos(a), w = A * Math.sin(a);
      const sk = sr + (s - sr) * k;
      out.push(P3(Math.min(sk, s1), sk > s1 ? Math.sign(w) * Math.min(Math.abs(w * k), A * rho(s1)) : w * k, at[1] + h + yOff));
    }
    return out;
  };
  const grid: V3[] = [];
  for (let i = 0; i <= 12; i++) for (let j = 0; j <= 12; j++) grid.push(B(-L + ((s1 + L) * i) / 12, (j / 12) * Math.PI));
  const face = pts(rim(1));
  const hl = hull([...pts(grid), ...face]);
  if (hl.length < 3) return;
  // Contact shadow: the footprint (the belly's lowest line, widened) nudged toward the lens-right (window back-left).
  const foot = hull(pts(Array.from({length: 24}, (_, k) => {
    const s = -L * 0.85 + ((Math.min(s1, L * 0.85) + L * 0.85) * (k % 12)) / 11, u = (k < 12 ? 1 : -1) * A * 0.55 * rho(s);
    return P3(s + 0.006, u, at[1] + 0.0005).map((v, i) => (i === 2 ? v + 0.005 : v)) as V3;
  })));
  // Shadow and belly shade are flat translucent layers, not washes: a wash's bleed re-rolls with the projected polygon, so under the
  // moving B07 cameras it flickered (the kitchen wash flicker of G-D/G-E, here on a new piece).
  if (foot.length >= 3) hardFill(p.layer(0.22, seed), seed, '#3a2014', foot);
  // Root tuft first (the root end is the far end from every B07 camera): only what sticks out past the bowl shows.
  if (trim <= 0) {
    const rt = camPoint(c, P3(L, 0, at[1] + h * 0.7)), R = r * unit;
    if (rt) for (let k = 0; k < 9; k++) {
      const f = k / 8 - 0.5, hh = hash(seed + k * 3.1);
      inkLine(p, seed + 85 + k, [[rt[0], rt[1] + f * R * 0.25], [rt[0] + R * (0.06 + 0.04 * hh), rt[1] + f * R * 0.5], [rt[0] + R * (0.1 + 0.05 * hh), rt[1] + f * R * 0.75 + R * 0.04]], {closed: false, weight: wk * 0.7, color: k % 3 ? '#cdb184' : '#8a6a42', curve: 0.5});
    }
  }
  hardFill(p, seed + 1, K.onion, hl);
  const cx = hl.reduce((a, q) => a + q[0], 0) / hl.length, cy = hl.reduce((a, q) => a + q[1], 0) / hl.length;
  const shd = clipHalf(hl, [0.8, 0.6], cx * 0.8 + cy * 0.6 - r * unit * 0.1);
  if (shd.length >= 3) hardFill(p.layer(0.3, seed + 2), seed + 2, dk(K.onion, 0.4), shd);
  // Skin longitudes on the belly where it faces the lens.
  // Each longitude splits where it turns away, so a line never jumps across a hidden stretch.
  for (let k = 1; k < 9; k++) {
    const al = (k / 9) * Math.PI, runs: Pt[][] = [[]];
    for (let i = 1; i <= 13; i++) {
      const s = -L + ((s1 + L) * i) / 14, v = B(s, al), ctr = P3(s, 0, at[1] + h);
      const q = camPoint(c, v), n: V3 = [v[0] - ctr[0], v[1] - ctr[1], v[2] - ctr[2]];
      if (q && (camW[0] - v[0]) * n[0] + (camW[1] - v[1]) * n[1] + (camW[2] - v[2]) * n[2] > 0) runs[runs.length - 1].push(q);
      else if (runs[runs.length - 1].length) runs.push([]);
    }
    runs.forEach((line, j) => {
      if (line.length >= 3) inkLine(p, seed + 100 + k * 5 + j, line, {closed: false, weight: wk * (k > 4 ? 1.3 : 1.0), color: k > 4 ? dk(K.onion, 0.6) : dk(K.onion, 0.45), curve: 0.4});
    });
  }
  // The cut face (up): cream, alternate pale-green layer bands, tan layer lines, the heart and a wet sheen; a thick skin rim.
  if (face.length >= 3 && c.y > at[1] + h) {
    hardFill(p, seed + 30, '#f3ead2', face);
    const K6 = [0.86, 0.72, 0.58, 0.45, 0.32, 0.2];
    K6.forEach((k, i) => {
      const ring = pts(rim(k, 0.0002));
      if (ring.length < 3) return;
      if (i % 2 === 0) hardFill(p.layer(0.75, seed + 40 + i), seed + 40 + i, '#dfe6c0', ring);
      else hardFill(p, seed + 40 + i, '#f3ead2', ring);
    });
    K6.forEach((k, i) => {
      const ring = pts(rim(k, 0.0003));
      if (ring.length >= 3) inkLine(p, seed + 50 + i, ring, {weight: wk * (i % 2 ? 0.7 : 1.0), color: i % 2 ? '#d9c79c' : '#c9b27e'});
    });
    const heart = camPoint(c, P3(sr, 0, at[1] + h + 0.0004));
    if (heart) washAt(p, seed + 60, '#d6dc98', 120, ell(heart[0], heart[1], A * unit * 0.14, A * unit * 0.07, 12), 0.1, 0.3);
    const sheen = camPoint(c, P3(-L * 0.35, A * 0.3, at[1] + h + 0.0004));
    if (sheen) washAt(p, seed + 61, '#fffaf0', 140, ell(sheen[0], sheen[1], A * unit * 0.22, A * unit * 0.07, 12, -0.2), 0.1, 0.2);
    inkLine(p, seed + 62, face, {weight: wk * 2.4, color: K.onion});
  }
  inkLine(p, seed + 70, hl, {weight: wk * 1.0, color: dk(K.onion, 0.6)});
  // Dry neck stub at the stem end (-axis), leaning out along the axis at the face's height.
  const n0 = camPoint(c, P3(-L * 0.97, 0, at[1] + h * 0.9)), n1 = camPoint(c, P3(-L - 0.018, 0, at[1] + h * 0.95)), n2 = camPoint(c, P3(-L - 0.034, 0.004, at[1] + h + 0.004));
  if (n0 && n1 && n2) {
    inkLine(p, seed + 80, [n0, n1, n2], {closed: false, weight: wk * 3.2, color: '#7a4a24', curve: 0.5});
    inkLine(p, seed + 81, [n0, n1], {closed: false, weight: wk * 1.0, color: '#d8a868', curve: 0.5});
  }
};
/** Projected box of a `cup` piece (px): its top (the face's far rim), base, centre and width (B07 measurements and the bell anchor). */
export const cupExtent = (c: YCam, at: V3, axis: number, r = SET.onionR) => {
  const A = r * 1.06, L = r * 0.92, h = r * CUP_H, vs: V3[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, s = L * Math.cos(a), u = A * Math.sin(a);
    for (const y of [at[1] + h, at[1]]) vs.push([at[0] + Math.cos(axis) * s - Math.sin(axis) * u * (y === at[1] ? 0.55 : 1), y, at[2] + Math.sin(axis) * s + Math.cos(axis) * u * (y === at[1] ? 0.55 : 1)]);
  }
  const q = vs.map((v) => camPoint(c, v)).filter((x): x is Pt => !!x);
  if (!q.length) return null;
  const xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  return {top: Math.round(y0), base: Math.round(y1), cx: Math.round((x0 + x1) / 2), cy: Math.round((y0 + y1) / 2), width: Math.round(x1 - x0)};
};

/** `between`: painted after the far half and before the near one (a blade standing in the cut). `sep` / `turn` per side [+n, -n]. */
export const paintOnionPiece = (p0: Painter, c: YCam, seed: number, o: OnionPiece, between?: () => void) => {
  const fr = o.frost ?? 0;
  // W5.2 G-D (O3): frost was an ice tint at the source plus a rime and sparkle pass; W5.3 fix round 1: no tint (the onion keeps its
  // colour, the tint read as grey glass), the white rime pass alone over the projected bulb after the piece (props.ts `paintFrost`).
  const p = p0, r = o.r ?? SET.onionR;
  const frostOver = () => {
    const s = fr > 0 && o.kind !== 'slices' ? sphereAt(c, o.at, r * (o.kind === 'halves' ? 1.15 : 1)) : null;
    if (s) paintFrost(p, seed + 400, s.x, s.y - s.r * 0.05, s.r, fr);
  };
  if (o.kind === 'whole') { paintOnion(p, c, seed, o.at, r); frostOver(); between?.(); return; }
  if (o.kind === 'dome') { paintOnionDome(p, c, seed, o.at, r, o.axis, o.cut, between); return; }
  if (o.kind === 'cup') { paintOnionCup(p, c, seed, o.at, r, o.axis, o.trim); between?.(); return; }
  if (o.kind === 'slices') {
    for (let k = 0; k < o.n; k++) paintOnionSlice(p, c, seed + k * 10, [o.at[0] + 0.022 * k, o.at[1], o.at[2] + 0.012 * Math.sin(k * 2.3)], r * (0.95 - 0.04 * (k % 3)), -Math.PI / 2 + 0.25 * Math.sin(k * 1.7));
    between?.();
    return;
  }
  // Far half first (the one whose centre is deeper in the picture).
  const sides: (1 | -1)[] = [1, -1], sepOf = (sd: 1 | -1) => (typeof o.sep === 'number' ? o.sep : o.sep[sd > 0 ? 0 : 1]);
  const depth = (sd: 1 | -1) => camSpace(c, [o.at[0] + Math.cos(o.n) * sd * (sepOf(sd) + r * 0.4), o.at[1], o.at[2] + Math.sin(o.n) * sd * (sepOf(sd) + r * 0.4)]).d;
  sides.sort((x, y) => depth(y) - depth(x)).forEach((sd, i) => {
    paintOnionHalf(p, c, seed + (sd > 0 ? 0 : 100), o.at, r, o.n, sd, sepOf(sd), (o.turn ?? [0, 0])[sd > 0 ? 0 : 1]);
    if (i === 0) between?.();
  });
  frostOver();
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

/**
 * Lilac onion gas rising in the kitchen (W5.2 G-C, N7; S01-B04-SH01). Three wisps leave the cut onion at `from` and rise toward
 * `to` (the cook's eyes); `reach` 0..1 is how far the heads have travelled (heights from.y -> to.y), each head rolling into a
 * small curl in the picture. The body: a broad soft haze, puffs strung along the path (kit fog-bank puffs, retinted) and three drifting filaments,
 * widening as it rises (0.012 -> 0.06 m), fading in at the source and tapering into the curl; `alpha` scales the whole stack
 * (default 1 = about 0.55 at the densest strand, 0.35 at the body's edges: sheet alpha 0.35-0.55). Painted as one depth-sorted item per wisp at its source, so the vapour sits
 * after the board and the cook (it is between them and the lens) and the face under it keeps its own paint: the fog depth gate
 * (DF-20261030-painted-fog-front-depth-gate), no global fade of what is behind.
 */
export type KitchenMist = {from: V3; to: V3; reach: number; t: number; alpha?: number;
  /** W5.2 G-D: a waypoint (world m) the wisps bend through on the way to `to` (B05-SH02: 0.05 m in front of the bread, then up to the eyes). */
  via?: V3;
  /** W5.2 G-E: how many of the three wisps (default 3; B06-SH04's single thread is 1) and a width scale (default 1). */
  n?: number; width?: number;
};
/** Per wisp: source offset (world m), end offset (m along the camera's right, m up) from `to`, sway (m), curl turn and radius (m), width and alpha scale, lag (0..1 of `reach`). */
type MistWisp = {from: V3; to: [number, number]; sway: number; dir: 1 | -1; curl: number; w: number; a: number; lag: number};
const MIST_WISPS: MistWisp[] = [
  {from: [-0.03, 0.0, 0.02], to: [-0.075, 0.0], sway: -0.06, dir: -1, curl: 0.03, w: 1, a: 1, lag: 0},
  {from: [0.03, 0.0, -0.015], to: [0.075, -0.01], sway: 0.055, dir: 1, curl: 0.026, w: 0.9, a: 0.9, lag: 0.06},
  {from: [0.0, 0.0, 0.03], to: [0.0, -0.06], sway: 0.03, dir: -1, curl: 0.022, w: 0.8, a: 0.8, lag: 0.12},
];
/** `k`: the mist's index in `KitchenOpts.mist` (its seed block; 0 keeps the G-C seeds). */
const mistItems = (m: KitchenMist, k = 0): Item[] =>
  MIST_WISPS.slice(0, m.n ?? 3).map((wi, w) => ({at: add3(m.from, wi.from), bias: -0.06, draw: (p: Painter, c: YCam) => paintMistWisp(p, c, 43800 + k * 300 + w * 60, m, w)}));
const paintMistWisp = (p: Painter, c: YCam, seed: number, m: KitchenMist, w: number) => {
  const wi = MIST_WISPS[w], reach = Math.max(0, Math.min(1, (m.reach - wi.lag) / (1 - wi.lag)));
  if (reach <= 0.02) return;
  const right: V3 = [Math.cos(c.yaw), 0, Math.sin(c.yaw)], t = m.t;
  const A0 = add3(m.from, wi.from);
  const B0: V3 = [m.to[0] + right[0] * wi.to[0], m.to[1] + wi.to[1], m.to[2] + right[2] * wi.to[0]];
  const N = 30, ph = t * 0.8 + w * 1.9, world: V3[] = [];
  for (let k = 0; k <= N; k++) {
    const s = (k / N) * reach, h = s ** 1.5; // rises first, drifts toward the face later
    // The path runs almost along the lens axis in B04-SH01 (onion -> face), so its shape in the picture comes from the sideways
    // terms: an outward lean (bulge) that comes back to the end point, plus a slow sway.
    const sw = wi.sway * Math.sin(Math.PI * s) + 0.35 * Math.abs(wi.sway) * Math.sin(Math.PI * s * 1.3 + ph) * Math.sin(Math.PI * Math.min(1, s * 1.2));
    if (m.via) {
      // Through the waypoint: a quadratic curve A0 -> via -> B0 (the via shifted with the wisp's end offset), plus the sway.
      const V: V3 = [m.via[0] + right[0] * wi.to[0] * 0.5, m.via[1], m.via[2] + right[2] * wi.to[0] * 0.5], a = (1 - s) * (1 - s), b = 2 * s * (1 - s), e = s * s;
      world.push([a * A0[0] + b * V[0] + e * B0[0] + right[0] * sw, a * A0[1] + b * V[1] + e * B0[1], a * A0[2] + b * V[2] + e * B0[2] + right[2] * sw]);
    } else world.push([A0[0] + (B0[0] - A0[0]) * h + right[0] * sw, A0[1] + (B0[1] - A0[1]) * s, A0[2] + (B0[2] - A0[2]) * h + right[2] * sw]);
  }
  const pts = world.map((v) => camPoint(c, v));
  if (pts.some((q) => !q)) return;
  const all = pts as Pt[];
  const unitAt = world.map((v) => camUnit(c, v));
  // The curl at the head, in the picture (tangent to the path), radius in metres at the head's projection.
  const [ex, ey] = all[N], [qx, qy] = all[N - 1], hl = Math.hypot(ex - qx, ey - qy) || 1, hx = (ex - qx) / hl, hy = (ey - qy) / hl;
  const r0 = wi.curl * unitAt[N] * Math.min(1, reach / 0.6), cx = ex - hy * r0 * wi.dir, cy = ey + hx * r0 * wi.dir, phi0 = Math.atan2(ey - cy, ex - cx);
  const curl: Pt[] = [];
  for (let k = 1; k <= 14; k++) {
    const th = (k / 14) * Math.PI * 1.7, r = r0 * (1 - 0.55 * (k / 14));
    curl.push([cx + r * Math.cos(phi0 + wi.dir * th), cy + r * Math.sin(phi0 + wi.dir * th)]);
    unitAt.push(unitAt[N]);
  }
  const line = [...all, ...curl], n = line.length - 1;
  const hw = (f: number) => (m.width ?? 1) * wi.w * (0.012 + 0.048 * Math.min(1, (f * n) / N)) * unitAt[Math.round(f * n)] * (1 + 0.15 * Math.sin(f * 8 + w * 2.1 + t * 0.8));
  const env = (f: number) => Math.min(1, f / 0.2) * Math.pow(Math.min(1, (1 - f) / 0.15), 0.7); // fade in at the source, taper into the curl
  const A = (m.alpha ?? 1) * wi.a;
  const nrm = line.map((_, k): Pt => {
    const pa = line[Math.max(0, k - 1)], pb = line[Math.min(n, k + 1)], d = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
    return [-(pb[1] - pa[1]) / d, (pb[0] - pa[0]) / d];
  });
  const ribbonOf = (q: Pt[], wf: (f: number) => number): Pt[] => {
    const L: Pt[] = [], R: Pt[] = [];
    q.forEach((v, k) => {
      const ww = wf(k / n);
      L.push([v[0] + nrm[k][0] * ww, v[1] + nrm[k][1] * ww]);
      R.push([v[0] - nrm[k][0] * ww, v[1] - nrm[k][1] * ww]);
    });
    return [...L, ...R.reverse()];
  };
  const veil = (id: number, color: string, a: number, q: Pt[]) => { if (a > 0.002 && q.length >= 3) hardFill(p.layer(a, id), id, color, q); };
  ([[1.6, 0.08], [1.1, 0.1]] as const).forEach(([gw, al], i) => veil(seed + i, '#8f5cf5', al * A, ribbonOf(line, (f) => hw(f) * gw * env(f))));
  // Puffs (the kit fog bank's drifting puffs, retinted and strung along the path): soft stacked ovals growing as the gas rises,
  // each drifting on its own phase, so the body reads as a cloud of gas and not as a ribbon.
  for (let k = 2; k < n; k += 3) {
    const f = k / n, r = hw(f) * 1.5 * env(f), j = hash(seed + k * 1.3);
    if (r < 2) continue;
    const cx2 = line[k][0] + r * 0.35 * Math.sin(t * 0.9 + k * 1.7), cy2 = line[k][1] + r * 0.2 * Math.cos(t * 0.7 + k);
    for (let i = 0; i < 4; i++) veil(seed + 100 + k * 4 + i, '#9d6bff', 0.06 * A, ell(cx2, cy2, r * (1 - 0.18 * i) * (0.9 + 0.3 * j), r * (1 - 0.18 * i) * 0.8, 14, j * 3));
  }
  [-0.6, 0, 0.6].forEach((sj, j) => {
    const q = line.map((v, k): Pt => {
      const f = k / n, a = hw(f) * (sj + 0.28 * Math.sin(f * 7 + j * 1.7 + t * (0.5 + 0.12 * j)));
      return [v[0] + nrm[k][0] * a, v[1] + nrm[k][1] * a];
    });
    const fw = (f: number) => hw(f) * (0.3 + 0.1 * Math.sin(f * 5 + j * 2.3)) * env(f);
    ([[1.4, 0.08], [0.8, 0.12]] as const).forEach(([gw, al], i) => veil(seed + 5 + j * 4 + i, j === 1 ? '#7c40f0' : '#9a5cff', al * A, ribbonOf(q, (f) => fw(f) * gw)));
  });
  // A pale lilac lift along the window side (upper left) of the body, soft, so the gas reads lit and not as a purple stain.
  veil(seed + 40, '#d8c4ff', 0.1 * A, ribbonOf(line.map((v, k): Pt => [v[0] - 0.35 * hw(k / n), v[1] - 0.2 * hw(k / n)]), (f) => hw(f) * 0.45 * env(f)));
};

const boardItem = (pieces?: OnionPiece[], out?: CookOut, kn?: KitchenOpts['knife'], rest?: KnifeHold): Item => ({
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
    // W5.2 G-D: the knife put down on the board (no hand): the same picture knife as a hold, handle and all, with a thin shadow.
    if (rest) {
      const W = camPoint(c, rest.grip), P = camPoint(c, rest.tip);
      if (W && P) {
        const L = Math.hypot(P[0] - W[0], P[1] - W[1]) / 0.3, ang = Math.atan2(P[1] - W[1], P[0] - W[0]), wu = Math.max(L, camUnit(c, rest.grip) * 0.8);
        const n: Pt = [-Math.sin(ang), Math.cos(ang)], sh = 0.006 * wu;
        washAt(p, 42150, '#3a2014', 110, [[W[0] + n[0] * sh, W[1] + n[1] * sh + sh], [P[0] + n[0] * sh, P[1] + n[1] * sh + sh], [P[0] + n[0] * sh * 3, P[1] + n[1] * sh * 3 + sh * 2], [W[0] + n[0] * sh * 3, W[1] + n[1] * sh * 3 + sh * 2]], 0.1, 0.2);
        paintKnife(p, 42160, W, ang, L, wu);
      }
    }
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
  /** W5.2 G-C: comic waterfall tears 0..1 (`paintWaterfallTears`, B04-SH03). */
  waterfall?: number;
  /**
   * W5.2 G-D (B05). `at`: ground point (default `SET.cook`; B05-SH04 stands at the fridge). A `hold` without the knife drives the
   * right wrist the same way (laying the knife down, picking it up, a match). `rPose`: the right arm blended by `mix` toward kit pose
   * `a` (or `poseMix(a, b, u)`), `off` metres (picture right, up), `knifeAng` the knife's picture angle there (P06 shrug: point
   * down). `lPose`: the left arm from its rest on the island toward pose `a` by `mix`; `lRest`: the left hand rests on the island
   * without the knife. `rReach`: the right wrist reaching to a world point (open hand). `bread`: a slice in the mouth (N8),
   * `bob` m down, `tilt` rad. `cold` 0..1: the fridge's cold light on her (B05-SH04).
   */
  at?: V3;
  rPose?: {a: AnyPoseId; b?: AnyPoseId; u?: number; mix: number; off?: [number, number]; knifeAng?: number};
  lPose?: {a: AnyPoseId; mix: number;
    /** W5.2 G-E: blend `poseMix(a, b, u)`, take the kit pose's RIGHT arm mirrored about her centre line (`mirror`: P24 eye wipe with the left hand), `off` metres (picture right, up). */
    b?: AnyPoseId; u?: number; mirror?: boolean; off?: [number, number]};
  lRest?: boolean;
  /**
   * W5.3 fix round 2 (B05-SH03 SS-R3, "keep the elbow visibly bent"): 0..1 mix of the left elbow from its default (hanging at her
   * side) toward a bent elbow in the picture: 0.45 of the way from the shoulder to the wrist, dropped 0.09 m (x armScale) below that
   * line, so a long reach (the wick, about 0.68 m) reads as upper arm + forearm with a bend, not one bar. Off when absent.
   */
  lBend?: number;
  /**
   * W6 (B05-SH03, user: "two palms at the candle"): a left hand held up in the air (the match at the wick). `handItem` repaints the
   * rig's own open hand (forearm direction, rig size, wrist at the target) instead of its island palm (turned 0.5 rad, sized by the
   * hand's depth), which showed beside the rig's hand as a second palm; both drop the thumb lobe, which hung under the palm like
   * another one. Off when absent.
   */
  lAirHand?: boolean;
  /**
   * W5.3 fix round 2 (B05-SH04 `carryR.hand`): `elbow` a world elbow point (default: between the shoulder and the wrist); `hide`
   * the world centre of a sphere (the carried onion, painted after the cook) the rig's own open hand is tucked behind: the rig's wrist goes to
   * the sphere's middle so its hand lies inside the sphere's picture circle, while `out.reach` keeps `to` as the wrist.
   */
  rReach?: {to: V3; mix: number; elbow?: V3; hide?: V3};
  bread?: {bob: number; tilt: number};
  cold?: number;
  /** W5.3 fix round 1 (B05-SH04): the fridge's cool key on her face and apron, 0..1 (off when absent). */
  coldKey?: number;
  /**
   * W5.2 G-E (N8 swim goggles, B06-SH02/SH03): `lift` head units the lenses sit above the eyes (0 = on); `held` 0..1 the strap
   * ends at her two hands (stretched over the curls) instead of round the head; `squash` 0..1 the snap; `bounce` the curls' bounce
   * (signed, head units).
   */
  goggles?: {lift: number; held?: number; squash?: number; bounce?: number};
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

type CookOut = {
  /** W5.3: the waterfall tears' frame, painted after the set (`paintKitchen`) so the falls land on the island top in front of it. */
  falls?: {a: FigAnchors; u: number; Kpx: number; hc: Pt; rot: (q: Pt) => Pt; level: number; t: number; land: [Pt, Pt]};
  /** W5.3: the right arm's reach (`rReach`) in px, for `carryR.hand` to repaint the forearm and hand over the onion. */
  reach?: {E: Pt; T: Pt; unit: number; mix: number; cold: number};
  a?: FigAnchors; arm?: {E: Pt; T: Pt; unit: number; hu: number; flat?: number; air?: boolean}; knife?: {wrist: Pt; ang: number; unit: number; wu: number; fist: number}};
/** Wrist of the cook's resting hand on the island top (B01-SH02, P07 + knife raised). */
const HAND_AT: V3 = [0.15, 0.9, -0.27];
const cookItem = (t: number, st: CookState, out: CookOut): Item => ({
  at: st.at ?? SET.cook,
  draw: (p0, c) => {
    const at = st.at ?? SET.cook, g = camPoint(c, at), u = camUnit(c, at);
    if (!g) return;
    const p = p0;
    // Squared to the lens (front view): facing set from the camera of this frame's shot, passed in by the look frame (`facingCam`).
    const pose = poseFor(st.pose, COOK, g, u, 'front');
    const face = {...EXPRESSIONS[st.face], ...(st.look ? {look: st.look} : {}), ...(st.faceAdd ?? {})};
    if (st.rise) pose.rise = (pose.rise ?? 0) + st.rise;
    let knifeAng = -Math.PI / 2 - 0.35, knifeU = u, knifeW = u;
    if ((st.knife === 'raised' || st.hold) && st.pose === 'P07' && pose.rArm?.via) {
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
    // W5.2 G-D: the right arm blended toward a kit pose (wipe, thinking, shrug) or reaching to a world point.
    if (st.rPose && st.rPose.mix > 0 && pose.rArm) {
      const R = st.rPose, m = Math.min(1, R.mix), B = (R.b ? poseMix(R.a, R.b, R.u ?? 0, COOK, g, u, 'front') : poseFor(R.a, COOK, g, u, 'front')).rArm;
      if (B) {
        const o = R.off ?? [0, 0], off = (q: Pt): Pt => [q[0] + o[0] * u, q[1] - o[1] * u], A = pose.rArm;
        pose.rArm = {...A, to: lerpPt(A.to, off(B.to), m), via: lerpPt(A.via ?? B.via ?? A.to, off(B.via ?? B.to), m), behind: m > 0.5 ? B.behind : A.behind};
        if (R.knifeAng !== undefined) knifeAng = lerpAng(knifeAng, R.knifeAng, m);
      }
    }
    if (st.rReach && st.rReach.mix > 0 && pose.rArm) {
      const T = camPoint(c, st.rReach.to), sh = shoulderPoint(COOK, g, u, {...pose, view: 'front'}, 'r');
      if (T) {
        const m = Math.min(1, st.rReach.mix), A = pose.rArm, E0 = st.rReach.elbow ? camPoint(c, st.rReach.elbow) : null;
        const E: Pt = E0 ?? [(sh[0] + T[0]) / 2 - 0.04 * u, (sh[1] + T[1]) / 2], H = st.rReach.hide, C = H ? camPoint(c, H) : null;
        // `hide`: the rig's hand (about 0.125 m x handScale from its wrist along the forearm) centred on the sphere's middle.
        let Tr = T;
        if (C) { const dx = C[0] - E[0], dy = C[1] - E[1], n = Math.hypot(dx, dy) || 1, h = 0.0625 * u * (KITCHEN_LIGHT.handScale ?? 1); Tr = [C[0] - (dx / n) * h, C[1] - (dy / n) * h]; }
        pose.rArm = {to: lerpPt(A.to, Tr, m), via: lerpPt(A.via ?? E, E, m), open: 1};
        out.reach = {E: pose.rArm.via ?? E, T: C ? lerpPt(A.to, T, m) : pose.rArm.to, unit: u, mix: m, cold: st.coldKey ?? 0};
      }
    }
    if (st.knife === 'raised' || st.lRest) {
      const k = COOK.armScale ?? 1, sh = shoulderPoint(COOK, g, u, {...pose, view: 'front'}, 'l');
      const LH = st.lHand ?? HAND_AT, T0 = camPoint(c, LH);
      if (T0) {
        let E: Pt = [sh[0] + 0.03 * k * u, sh[1] + 0.25 * k * u];
        if (st.lBend) {
          // The perpendicular to shoulder -> wrist that points down in the picture.
          const dx = T0[0] - sh[0], dy = T0[1] - sh[1], n = Math.hypot(dx, dy) || 1, s0 = dx >= 0 ? 1 : -1, drop = 0.09 * k * u;
          const B: Pt = [sh[0] + 0.45 * dx - (s0 * dy / n) * drop, sh[1] + 0.45 * dy + (s0 * dx / n) * drop];
          E = lerpPt(E, B, Math.min(1, st.lBend));
        }
        pose.lArm = {via: E, to: T0, open: 1, ...(st.lAirHand ? {noThumb: true} : {})};
        out.arm = {E, T: T0, unit: u, hu: camUnit(c, LH), flat: st.lFlat ?? (st.lHand ? 0 : 1), ...(st.lAirHand ? {air: true} : {})};
        // W5.2 G-D (P06 shrug): the left hand leaves the island toward the pose; past halfway the rig's own open hand shows it.
        const LP = st.lPose, P = LP && LP.mix > 0 ? (LP.b ? poseMix(LP.a, LP.b, LP.u ?? 0, COOK, g, u, 'front') : poseFor(LP.a, COOK, g, u, 'front')) : undefined;
        // W5.2 G-E: `mirror` takes the pose's right arm reflected about her centre line (a left-hand eye wipe from P24).
        const Bm = P && LP?.mirror ? P.rArm : P?.lArm, o = LP?.off ?? [0, 0];
        const mr = (q: Pt): Pt => [(LP?.mirror ? 2 * g[0] - q[0] : q[0]) + o[0] * u, q[1] - o[1] * u];
        const B = Bm ? {to: mr(Bm.to), via: Bm.via ? mr(Bm.via) : undefined} : undefined;
        if (st.lPose && B) {
          const m = Math.min(1, st.lPose.mix), via = lerpPt(E, B.via ?? B.to, m), to = lerpPt(T0, B.to, m);
          // The shrug's palm-up hand points out to picture right, so the thumb lies on the upper side (v is down there): open -1.
          pose.lArm = {via, to, open: LP?.a === 'P06' ? -1 : 1};
          out.arm = m < 0.5 ? {...out.arm, E: via, T: to, flat: (out.arm.flat ?? 1) * (1 - 2 * m)} : undefined;
        }
      }
    }
    // Knife first, so the rig's fist (KITCHEN_LIGHT.shaped, UT14) closes over the handle: grip from the pose's wrist target.
    // W5.2 G-A: once the knife comes down in front of her (hold mix > 0.35) its blade is painted by the board, after the island
    // and before the onion pieces (a blade through the onion reads inside it); the rig's fist covers the handle.
    // W5.2 G-D: a shrug (`rPose` past halfway) brings the knife back to the fist in front of her: painted with the cook again.
    const late = !!st.hold && (st.holdMix ?? 1) > 0.35 && !(st.rPose && st.rPose.mix > 0.5);
    if (st.knife === 'raised' && pose.rArm) {
      if (late) out.knife = {wrist: pose.rArm.to, ang: knifeAng, unit: knifeU, wu: knifeW, fist: 0.085 * u * (KITCHEN_LIGHT.handScale ?? 1)};
      else paintKnife(p, 42100, pose.rArm.to, knifeAng, knifeU, knifeW);
    }
    // W5.3 fix round 1: `coldKey` cools the skin itself (the fridge key is frontal, so the whole face takes it evenly; a veil over
    // the drawn head either banded or tinted the fringe and brows).
    const fig = st.coldKey ? {...COOK, head: {...COOK.head, skin: mixColor(COOK.head.skin, FRIDGE_COLD, 0.24 * st.coldKey)}} : COOK;
    const a = drawFigure(p, fig, g, u, {...pose, face, headCock: st.headCock, light: KITCHEN_LIGHT}, t);
    // W5.2 v6 (viewer check r5: "2-3 px warm hair rim, no tan streak"): KITCHEN_LIGHT's straight-cut rim band is cut to a
    // sliver (rimTo 0.006), and the window rim on the hair is one thin warm line just inside the upper-left silhouette of
    // the curly cloud (kit `hairFront('curly').back`, placed with the rig's own head frame: K = HD / HEAD_SPAN, head cock
    // about the neck-top pivot), fading in and out along the arc that faces the window.
    const {Kpx, hc, rot} = headFrame(a, u, st.headCock ?? 0);
    if (COOK.head.cut === 'curly') {
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
    if (st.waterfall) {
      // W5.3 fix round 1: each fall lands on the island top 0.55 m out to her side, just inside its far edge (behind the board).
      const L = [-1, 1].map((sd) => camPoint(c, [at[0] + sd * 0.55, SET.board.y1 - 0.015, -0.24])).filter((q): q is Pt => !!q).sort((x, y) => x[0] - y[0]);
      if (L.length === 2) out.falls = {a, u, Kpx, hc, rot, level: st.waterfall, t, land: [L[0], L[1]]};
    }
    // W5.2 G-D (N8, B05-SH02): the bread slice held in her teeth, over the mouth (head units y 0.6, kit head.ts `my`).
    // W5.2 G-D (B05-SH04): the fridge's cold light falls on her from the lens side: a soft cold pool over her head and chest
    // (and the wall round her), three stacked veils (the kit tint painter does not reach the rig's brush fills).
    if (st.cold) for (let k = 0; k < 3; k++) hardFill(p.layer(0.035 * st.cold, 42900 + k), 42900 + k, FRIDGE_COLD, ell(g[0], a.head[1] + 0.1 * u, (0.26 + 0.1 * k) * u, (0.3 + 0.1 * k) * u, 24));
    // W5.3 fix round 1 (viewer check r1: "no cold light on the face", sheet acceptance c 1170): `coldKey` 0..1 is the fridge's cool
    // key itself, frontal from the lens: the skin is cooled in the figure def above, plus a light cool veil over the bib. Absent
    // paints as W5.2.
    if (st.coldKey) hardFill(p.layer(0.14 * st.coldKey, 42913), 42913, FRIDGE_COLD, ell(g[0], a.head[1] + 0.5 * u, 0.12 * u, 0.15 * u, 20));
    if (st.goggles) {
      // W5.2 G-E (N8): the goggles over the face in the rig's head frame (eyes at head units (+-0.4, 0.05)); the strap is pulled up
      // over the curls while she stretches it, else runs to the curl cloud's edge at the temples (where it squashes the curls).
      const P = (x: number, y: number): Pt => rot([hc[0] + x * Kpx, hc[1] + y * Kpx]);
      const cloud = (hairFront('curly').back ?? [])[0] ?? [], edge = cloud.filter(([, y]) => Math.abs(y + 0.05) < 0.2).reduce((m, [x]) => Math.max(m, Math.abs(x)), 1.05);
      paintGoggles(p, 48100, P, Kpx, {...st.goggles, edge: edge * 0.95, hair: COOK.head.hair});
    }
    if (st.bread) paintBreadInMouth(p, 42800, rot([hc[0], hc[1] + 0.6 * Kpx + st.bread.bob * u]), u, st.bread.tilt + ((st.headCock ?? 0) * Math.PI) / 180, toneOf(COOK.head.skin, KITCHEN_LIGHT));
    out.a = a;
  },
});

/** The rig's front head frame in px: head units `Kpx`, the un-cocked head centre `hc` and the head-cock rotation about the neck. */
const headFrame = (a: FigAnchors, u: number, cockDeg: number) => {
  const HD = H * (COOK.headScale ?? 1), Kpx = (HD / HEAD_SPAN) * u, d = CHIN * Kpx - 0.051 * u, th = (cockDeg * Math.PI) / 180;
  const pv: Pt = [a.head[0] - d * Math.sin(th), a.head[1] + d * Math.cos(th)], hc: Pt = [pv[0], pv[1] - d];
  const rot = ([x, y]: Pt): Pt => [pv[0] + (x - pv[0]) * Math.cos(th) - (y - pv[1]) * Math.sin(th), pv[1] + (x - pv[0]) * Math.sin(th) + (y - pv[1]) * Math.cos(th)];
  return {Kpx, hc, rot};
};

/**
 * Comic waterfall tears (W5.2 G-C, N7 `new: waterfall-tears FX`; S01-B04-SH03): from under each lower lid (head units
 * (+-0.44, 0.2), the kit's tear-stream start) a jet spouts up and out past the temple, arcs over and falls outside the shoulder onto
 * the island top beside her, splashing there. W5.3 fix round 1 (viewer check r1: the W5.2 arcs fell back inside the shoulders onto
 * the bib and read as a stethoscope / headphone cord): open fountain arcs (cubic, crest 0.45 head units above the lid, 2.2 out) that
 * land on the island top 0.55 m out to each side of her, just inside its far edge (`land`, projected by the cook item), clear of both
 * hands; painted after the set so the landing is not under the island. The jet tapers into the fall and breaks into drops over its
 * last 15 %. `level` 0..1 grows the arcs from the lid; `t` runs
 * the flow (white streaks travelling along each arc), the beads breaking off its outer edge and the splash. Water as light: a
 * wobbling edge (a clean even band read as a tube), a soft spray veil, a deeper blue underside, a lit core and splash beads round
 * the landing. Painted after the apron, in front of the whole figure.
 */
const paintWaterfallTears = (p: Painter, seed: number, w: NonNullable<CookOut['falls']>) => {
  const {Kpx, hc, rot, level, t} = w;
  const lv = Math.max(0, Math.min(1, level));
  if (lv <= 0) return;
  const veil = (id: number, color: string, al: number, q: Pt[]) => { if (al > 0.002 && q.length >= 3) hardFill(p.layer(al, id), id, color, q); };
  for (const side of [-1, 1] as const) {
    const P0 = rot([hc[0] + side * 0.44 * Kpx, hc[1] + 0.2 * Kpx]);
    const C1 = rot([hc[0] + side * 1.05 * Kpx, hc[1] - 0.45 * Kpx]); // spouts up and out past the temple
    const C2 = rot([hc[0] + side * 2.2 * Kpx, hc[1] - 0.35 * Kpx]);
    const P2 = w.land[side < 0 ? 0 : 1];
    const bz = (s: number): Pt => {
      const v = 1 - s;
      return [v ** 3 * P0[0] + 3 * v * v * s * C1[0] + 3 * v * s * s * C2[0] + s ** 3 * P2[0], v ** 3 * P0[1] + 3 * v * v * s * C1[1] + 3 * v * s * s * C2[1] + s ** 3 * P2[1]];
    };
    const JET = 0.85, N = 24, arc = Array.from({length: N + 1}, (_, k) => bz((k / N) * Math.min(lv, JET)));
    const nrm = arc.map((_, k): Pt => {
      const pa = arc[Math.max(0, k - 1)], pb = arc[Math.min(N, k + 1)], d = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
      return [-(pb[1] - pa[1]) / d, (pb[0] - pa[0]) / d];
    });
    // Half-width wobbles along the jet and in time, so the edge is never a clean tube wall.
    const wob = (k: number, i: number) => 1 + 0.18 * Math.sin(k * 1.9 + t * 9 + side + i) + 0.1 * Math.sin(k * 4.3 - t * 13 + i * 2);
    // Thin at the lid, fullest past the crest, tapering into the fall (where it breaks into drops).
    const prof = (f: number) => (f < 0.08 ? 0.5 + f / 0.16 : 1) * (f > 0.55 ? 1 - 0.55 * ((f - 0.55) / 0.45) : 1);
    const band = (w0: number, w1: number, o = 0, i = 0): Pt[] => {
      const L: Pt[] = [], R: Pt[] = [];
      arc.forEach((v, k) => {
        const f = k / N, ww = (w0 + (w1 - w0) * Math.min(1, f * 1.8)) * Kpx * prof(f) * wob(k, i), oo = o * Kpx;
        L.push([v[0] + nrm[k][0] * (ww + oo), v[1] + nrm[k][1] * (ww + oo)]);
        R.push([v[0] - nrm[k][0] * (ww - oo), v[1] - nrm[k][1] * (ww - oo)]);
      });
      return [...L, ...R.reverse()];
    };
    // Which normal side faces up in the picture (the lit side of the jet).
    const up = nrm[Math.round(N / 2)][1] < 0 ? 1 : -1;
    // Thin at the lid, opening toward the landing; a soft outer spray veil, the body, a deeper blue on the underside, the lit core.
    veil(seed + (side + 1) * 40, '#bfe2f4', 0.3, band(0.07, 0.26, 0, 1));
    veil(seed + (side + 1) * 40 + 1, '#8fcbec', 0.6, band(0.05, 0.16, 0, 2));
    veil(seed + (side + 1) * 40 + 3, '#5f9bc4', 0.4, band(0.02, 0.06, -up * 0.08, 3));
    veil(seed + (side + 1) * 40 + 2, '#f4fbff', 0.75, band(0.014, 0.035, up * 0.04, 4));
    // Beads breaking off the outer edge of the jet, carried along it.
    for (let j = 0; j < 6; j++) {
      const s0 = (((j / 6 + t * 1.2 + hash(seed + j * 2.9 + side)) % 1) + 1) % 1;
      if (s0 > Math.min(lv, JET) || s0 < 0.2) continue;
      const k = Math.min(N, Math.round((s0 / Math.min(lv, JET)) * N)), q = bz(s0), off = (0.14 + 0.1 * hash(seed + j * 7.1)) * Kpx * (0.5 + s0);
      const r = (0.025 + 0.02 * hash(seed + j * 3.3)) * Kpx;
      veil(seed + (side + 1) * 40 + 30 + j, '#dff3fc', 0.8, ell(q[0] + nrm[k][0] * off * up, q[1] + nrm[k][1] * off * up, r, r * 1.2, 10));
    }
    // Flow: four short white streaks travelling along the arc (the highlight line).
    for (let j = 0; j < 4; j++) {
      const s0 = (((j / 4 + t * 1.5 + (side > 0 ? 0.12 : 0)) % 1) + 1) % 1, s1 = Math.min(JET, s0 + 0.1);
      if (s0 > Math.min(lv, JET) - 0.04) continue;
      const seg = Array.from({length: 5}, (_, k) => bz(s0 + ((Math.min(s1, lv) - s0) * k) / 4));
      inkLine(p.layer(0.85, seed + (side + 1) * 40 + 10 + j), seed + (side + 1) * 40 + 10 + j, seg, {closed: false, weight: Math.max(1.5, 0.035 * Kpx), color: '#ffffff', curve: 0.5});
    }
    // The fall breaks into drops over the last 15 % of the arc, each a small bead travelling down it.
    for (let j = 0; j < 8; j++) {
      const s0 = JET + (1 - JET) * ((((j / 8 + t * 2.2 + 0.07 * side) % 1) + 1) % 1);
      if (s0 > lv) continue;
      const q = bz(s0), r = (0.05 - 0.015 * ((s0 - JET) / (1 - JET))) * Kpx;
      veil(seed + (side + 1) * 40 + 50 + j, '#8fcbec', 0.7, ell(q[0], q[1], r, r * 1.35, 10));
      veil(seed + (side + 1) * 40 + 70 + j, '#f4fbff', 0.8, ell(q[0] - 0.3 * r, q[1] - 0.35 * r, r * 0.35, r * 0.4, 8));
    }
    if (lv < 0.97) continue;
    // Landing on the island top beside her: a wet darker patch, a splash crown and beads thrown out and up, re-born on a 0.4 s cycle.
    washAt(p, seed + (side + 1) * 40 + 20, '#5a3418', 70, ell(P2[0], P2[1] + 0.04 * Kpx, 0.3 * Kpx, 0.1 * Kpx, 14), 0.08, 0.2);
    veil(seed + (side + 1) * 40 + 21, '#cfeaf7', 0.6, ell(P2[0], P2[1], 0.18 * Kpx, 0.06 * Kpx, 14));
    for (let j = 0; j < 7; j++) {
      const ph = (((t / 0.4 + hash(seed + j * 3.7 + side)) % 1) + 1) % 1, ang = -Math.PI / 2 + (j - 3) * 0.42 + 0.2 * (hash(seed + j * 5.1) - 0.5);
      const dist = (0.15 + 0.35 * ph) * Kpx, drop = 0.6 * ph * ph * Kpx;
      const q: Pt = [P2[0] + Math.cos(ang) * dist, P2[1] + Math.sin(ang) * dist * 0.8 + drop];
      const r = (0.035 + 0.02 * hash(seed + j)) * Kpx * (1 - 0.5 * ph);
      veil(seed + (side + 1) * 40 + 22 + j, '#dff3fc', 0.85 * (1 - ph * 0.7), ell(q[0], q[1], r, r * 1.15, 10));
    }
  }
};

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
    const hand = A.air ? openHandParts(A.T, fa, unit * (L.handScale ?? 1), 1, true) : openHandParts([A.T[0] - Math.cos(fa) * 0.012 * hk, A.T[1] - Math.sin(fa) * 0.012 * hk], ang, hk, 1);
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

/**
 * W5.3 fix round 2 (B05-SH04, user note: "an arm laid over the onion, not a hand holding it"): her right hand lifting O3 the way a
 * hand lifts a ball, drawn from the onion outward (`sp`, its picture circle; hand sizes follow the onion's depth, not the cook's).
 * `back` (before the onion): the forearm from the rig's elbow `E` to the wrist `T` (set by the shot just inside the onion's
 * lower-left, widening toward the lens) and the cupped palm under and behind the onion's lower half, so the onion hides the palm and
 * the wrist and no forearm crosses its front. `front` (after the onion and its frost): the thumb, one rounded form coming round the
 * near side from under the bottom onto the front lower-right (round 3: a right hand's medial edge), and four mitten fingertips curling
 * over the far upper-right rim at different heights (index at the right next to the thumb, middle reaching furthest, little finger at the top and shortest), each with a soft contact shadow on the onion. Fades in with the reach (`mix`).
 */
const DEG_RAD = Math.PI / 180;
const paintCarryHand = (p0: Painter, seed: number, R: NonNullable<CookOut['reach']>, sp: {x: number; y: number; r: number}, part: 'back' | 'front') => {
  if (R.mix <= 0.02) return;
  const p = R.mix < 1 ? p0.layer(R.mix, seed) : p0;
  const L = KITCHEN_LIGHT, V = palOf(L), skin = toneOf(R.cold ? mixColor(COOK.head.skin, FRIDGE_COLD, 0.24 * R.cold) : COOK.head.skin, L);
  const ink = lineOf(skin, L), dark = mixColor(skin, '#5a3020', 0.4), {x, y, r} = sp;
  const rim = (deg: number, k: number): Pt => [x + Math.cos(deg * DEG_RAD) * r * k, y + Math.sin(deg * DEG_RAD) * r * k];
  const part3 = (k: number, pts: Pt[]) => {
    hardFill(p, seed + k, skin, pts);
    modelPart(p, seed + k + 1, skin, pts, L);
    const shd = planeBand(pts, formDir(pts, L.key), 0.62);
    if (shd.length) glaze(p, seed + k + 2, dark, 70, shd, {border: 0.15, bleed: 0.03, split: 0});
    inkLine(p, seed + k + 3, pts, {weight: V.lineOuter, color: ink});
  };
  if (part === 'back') {
    // Forearm: the rig's elbow width to a wrist about 0.06 m wide at the onion's depth (x handScale), foreshortened toward the lens.
    const wW = Math.max(ELBOW_W * R.unit, 0.85 * r * ((L.handScale ?? 1) * 0.06) / SET.onionR);
    part3(10, shapedLimb(R.E, R.T, ELBOW_W * R.unit, wW, {bulge: 0.12 * wW, peak: 0.35, asym: 0.25, capB: true}));
    // Cupped palm under and behind the lower half (a tilted sliver: only its heel and outer edge show past the onion's bottom).
    part3(20, ell(x - 0.2 * r, y + 0.7 * r, 0.66 * r, 0.34 * r, 22, -0.3));
    return;
  }
  // Thumb (W5.3 fix round 3, user note "the hand is mirrored"): a right hand with its palm toward the lens and the forearm from the
  // lower-left has its thumb on the medial (her-left = picture-right) edge, so it comes from under the onion's bottom round onto
  // the front lower-right, opposite the fingers (round 2 had it on the front-left, a left hand's side). Shorter than the fingers.
  const tb = rim(104, 1.06), tt: Pt = [x + 0.24 * r, y + 0.6 * r], tw = 0.3 * r;
  glaze(p, seed + 30, '#3a2410', 70, shapedLimb([tb[0] + 0.05 * r, tb[1] + 0.05 * r], [tt[0] + 0.06 * r, tt[1] + 0.07 * r], tw, tw * 0.9), {border: 0.3, bleed: 0.06, split: 0});
  part3(31, shapedLimb(tb, tt, tw, tw * 0.88, {bulge: 0.08 * tw, capB: true}));
  // Fingers (index -> little): rim angle (deg, picture, y down), how far the tip curls in past the rim (x r), width (x r). Round 3:
  // the index next to the thumb (right rim), the little finger at the top and shortest, the middle finger reaching furthest.
  const FINGERS: [number, number, number][] = [[-17, 0.17, 0.3], [-34, 0.21, 0.31], [-52, 0.18, 0.3], [-70, 0.13, 0.26]];
  FINGERS.forEach(([a, d, w], i) => {
    const base = rim(a + 5, 1.07), tip = rim(a - 3, 1 - d), ww = w * r;
    glaze(p, seed + 40 + i * 8, '#3a2410', 60, shapedLimb([base[0] - 0.04 * r, base[1] + 0.06 * r], [tip[0] - 0.04 * r, tip[1] + 0.07 * r], ww, ww * 0.9), {border: 0.3, bleed: 0.06, split: 0});
    part3(41 + i * 8, shapedLimb(base, tip, ww, ww * 0.9, {bulge: 0.06 * ww, capB: true}));
  });
};

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
  /** W5.2 G-D: the knife lying on the board without a hand (B05-SH01 after she lays it down, B05-SH03 until she picks it up). */
  knifeRest?: KnifeHold;
  /** W5.2 G-D (N8, B05-SH03): candle, saucer and matchbox; the struck match in her fingers. */
  candle?: CandleState;
  /** W5.2 G-D (N2, B05-SH04): the camera is inside the fridge: interior instead of the fridge box, `door` 0..1 open, `light` 0..1 on. */
  fridgePov?: {door: number; light: number};
  /**
   * W5.2 G-D (N4): an onion of her right hand at a world centre (painted after the cook), `frost` 0..1 (O3). W5.3 fix round 1
   * (B05-SH04, viewer check r1: "no arm reach, the onion floats up"): `hand` repaints her reaching forearm and open mitten over the
   * onion (from the cook's `rReach`), gripping it over the top; absent paints as W5.2. W5.3 fix round 2 (user note): `hand` is
   * `paintCarryHand`, the palm under and behind the onion, the thumb on its front lower-right (round 3) and the fingertips over its upper-right rim.
   */
  carryR?: {at: V3; frost?: number; hand?: boolean};
  /** W5.2 G-C: lilac onion gas rising from the board (N7, `paintMistWisp`), depth-sorted with the set; G-D: several (B05-SH03 split). */
  mist?: KitchenMist | KitchenMist[];
  /**
   * W5.2 G-E (B06-SH03): skip set items whose anchor lies nearer the lens than this (m): the board, its pieces and the knife sit
   * 0.2-0.31 m from a close face camera and would show a near-plane cut. The island (a big box, clipped below the frame) stays.
   */
  cullNear?: number;
};
/** Paint SET-KITCHEN seen from `c`: shell and window, then the set items depth-sorted far to near with the cook. Returns the cook's anchors. */
export const paintKitchen = (p: Painter, c: YCam, o: KitchenOpts): FigAnchors | undefined => {
  paintShell(p, c);
  if (!o.fridgePov) paintWindow(p, c, o.t);
  const out: CookOut = {};
  const island = islandItem();
  let items: Item[] = [backCounter(o.t), shelfAndRail(), ...(o.fridgePov ? fridgePovItems(SET.fridge, o.fridgePov.door, o.fridgePov.light, o.t) : [fridgeItem()]), island, boardItem(o.pieces, out, o.knife, o.knifeRest), basketItem(), garlicItem(), pendantItem(o.t), ...homeProps()];
  if (o.cook) {
    const soft = o.cookSoft ?? 0, sp = (it: Item): Item => (soft > 0 ? {...it, draw: (q, cc) => it.draw(tintPainter(q, '#d9c3a0', soft), cc)} : it);
    items.push(sp(cookItem(o.t, o.cook, out)), sp(handItem(out, o.cook.lHand ?? HAND_AT, o.carry)));
  }
  if (o.knife && o.knife.inPiece === undefined) { const kn = o.knife; items.push({at: kn.tip, bias: -0.2, draw: (q, cc) => paintWorldKnife(q, cc, 42500, kn.tip, kn.dirAng, kn.tilt, kn.hand)}); }
  if (o.mist) (Array.isArray(o.mist) ? o.mist : [o.mist]).forEach((m, k) => items.push(...mistItems(m, k)));
  if (o.candle) items.push(...candleItems(o.candle));
  if (o.candle?.match) { const m = o.candle.match, tt = o.t; items.push({at: m.to, bias: -0.35, draw: (q, cc) => paintMatch(q, cc, m, tt)}); }
  if (o.carryR) {
    // W5.2 G-D: O3 in her right hand (the hand behind it, as `carry`), frost and all; contact shadow only near the shelf or board.
    const cr = o.carryR;
    items.push({at: cr.at, bias: -0.32, draw: (q, cc) => {
      const sp = sphereAt(cc, cr.at, SET.onionR), hand = cr.hand && out.reach && sp ? out.reach : undefined;
      if (hand && sp) paintCarryHand(q, 46000, hand, sp, 'back');
      paintOnion(q, cc, 45900, cr.at, SET.onionR, {noShadow: true});
      if (sp) paintFrost(q, 46300 + 600, sp.x, sp.y - sp.r * 0.05, sp.r, cr.frost ?? 0);
      if (hand && sp) paintCarryHand(q, 46100, hand, sp, 'front');
    }});
  }
  // Window light after the back counter (it lies on the counter top) and before the island props (not from inside the fridge).
  if (!o.fridgePov) items.push({at: [-0.7, 0, -1.25], bias: -0.01, draw: (q, cc) => paintWindowLight(q, cc)});
  if (o.cullNear) { const near = o.cullNear; items = items.filter((it) => it === island || camSpace(c, it.at).d >= near); }
  paintSorted(p, c, items);
  if (out.falls) paintWaterfallTears(p, 42700, out.falls);
  if (!o.fridgePov) paintBeam(p, c);
  if (o.fridgePov) paintFridgeDark(p, o.fridgePov.light);
  // Warm room glaze over the far set (air), very light.
  glaze(p, 41900, '#f6cf86', 18, [[-200, -200], [1280, -200], [1280, 2200], [-200, 2200]], {border: 0});
  (o.droplets ?? []).forEach((d, i) => paintDroplets(p, c, 43000 + i * 400, d));
  return out.a;
};

/** The facing that squares the cook to a camera (front view), for a shot's mid-frame camera (kit `squareToCam`). */
export const cookFacing = (c: YCam) => squareToCam(c, SET.cook, 'front');
export {INK};

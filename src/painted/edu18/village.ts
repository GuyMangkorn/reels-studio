import {hardFill} from '../kit/draw';
import {mixColor, type Painter} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {bandPts, depth, ellPts, hn, okPoly, P, poly, sugarPalm, wCut, wFlat, wShadow, wStroke, yAt} from './scenery';

// SET-GATE18 (EDU-EP18-BRIEF-R1 N7, space V; Film W3 look frame LF02, 16 Nov 2026). Designed from the script before the kit: a rural Thai
// home gate on a hot, still afternoon: two white concrete posts with caps, green steel swing leaves (the camera-left leaf open into the yard),
// a low post-and-wire fence with bougainvillea spilling over the camera-right post, the red laterite lane beyond, a rice paddy, sugar palms and
// one electric pole with sagging wires, a far tree line. The yard is packed earth with fallen mango leaves and the mango shade on the right.
// V: metres, origin on the ground at the gate centre, +y up, +z out through the gate to the lane (the camera stands in the yard at -z, so
// world +x is SCREEN LEFT). Posts and wires are straight (N7 criterion). Large flats stay flat bands (DF-20261030-p5brush-large-fill-mottle).

export const VILLAGE = {
  skyTop: '#8fc0e0', skyLow: '#e9f0ec', lane: '#b8643c', laneShade: '#8a4a2e', yard: '#c9a77a', yardShade: '#9a7a58',
  post: '#efece4', postShade: '#b8b4a8', steel: '#3f8a5a', steelShade: '#2c6040', bougain: '#c8327a', leaf: '#3f6a32', leafDark: '#2c4a26',
  rice: '#7fae4a', riceFar: '#9fbf7a', palm: '#2f3a2a', haze: '#c9dbe0', wire: '#3a3634', poleWood: '#8a8478',
};
/** W3 change: direction to the sun. The brief's (0.55, 0.57, -0.61) is camera LEFT in this space (world +x is screen left); the brief's prose
 *  says "from screen right-front, behind the camera's right", so x is negated: her front lit warm from screen right, shadows fall screen left. */
export const SUN_V: V3 = [-0.55, 0.57, -0.61];

const hazeV = (col: string, d: number) => mixColor(col, VILLAGE.haze, Math.min(0.8, d / 220));
/** Ground shadow of a vertical world segment (base at y 0, height h) cast away from the sun. */
const castLen = (h: number) => h * Math.hypot(SUN_V[0], SUN_V[2]) / SUN_V[1];
const shadowDir: [number, number] = [-SUN_V[0] / Math.hypot(SUN_V[0], SUN_V[2]), -SUN_V[2] / Math.hypot(SUN_V[0], SUN_V[2])];

/** A rough square concrete post with a cap (front face and the shaded side), centre (x, z), width w, height h. */
const post = (p: Painter, c: YCam, seed: number, x: number, z: number, w: number, h: number, cap: boolean) => {
  const s = w / 2;
  wShadow(p, c, seed + 9, [[x - s, 0, z - s], [x + s, 0, z - s], [x + s + shadowDir[0] * castLen(h), 0, z - s + shadowDir[1] * castLen(h)], [x - s + shadowDir[0] * castLen(h), 0, z + s + shadowDir[1] * castLen(h)]], 10, 0.22);
  // side face toward +x (screen left, away from the sun): shade
  wFlat(p, c, seed, VILLAGE.postShade, [[x + s, 0, z - s], [x + s, 0, z + s], [x + s, h, z + s], [x + s, h, z - s]]);
  wCut(p, c, seed + 1, VILLAGE.post, [[x - s, 0, z - s], [x + s, 0, z - s], [x + s, h, z - s], [x - s, h, z - s]], {shadow: 4});
  if (cap) {
    const k = s + 0.04;
    wFlat(p, c, seed + 2, VILLAGE.postShade, [[x - k, h, z - k], [x + k, h, z - k], [x + k, h + 0.08, z - k], [x - k, h + 0.08, z - k]]);
    wFlat(p, c, seed + 3, VILLAGE.post, [[x - k, h + 0.08, z - k], [x + k, h + 0.08, z - k], [x + s * 0.4, h + 0.2, z], [x - s * 0.4, h + 0.2, z]]);
  }
  wStroke(p, c, seed + 4, [[x - s, 0.05, z - s - 0.001], [x - s, h - 0.05, z - s - 0.001]], '#ffffff', 0.5);
};

/** A steel swing leaf from hinge (x0, z0) to free end (x1, z1), height h above a 0.08 m clearance: frame, top rail, vertical bars. */
const leaf = (p: Painter, c: YCam, seed: number, a: [number, number], b: [number, number], h: number) => {
  const y0 = 0.08, y1 = y0 + h, col = VILLAGE.steel;
  const at = (u: number, y: number): V3 => [a[0] + (b[0] - a[0]) * u, y, a[1] + (b[1] - a[1]) * u];
  const bar = (u0: number, u1: number, ya: number, yb: number, k: number, cc = col) => wFlat(p, c, seed + k, cc, [at(u0, ya), at(u1, ya), at(u1, yb), at(u0, yb)]);
  bar(0, 1, y1 - 0.06, y1, 0); bar(0, 1, y0, y0 + 0.06, 1); bar(0, 1, y0 + h * 0.45, y0 + h * 0.45 + 0.04, 2);
  bar(0, 0.04, y0, y1, 3); bar(0.96, 1, y0, y1, 4);
  for (let i = 1; i < 12; i++) { const u = i / 12; bar(u - 0.008, u + 0.008, y0, y1, 5 + i, VILLAGE.steelShade); }
};

/** Bougainvillea mass: dark leaf clumps with magenta bract clusters, along x0..x1 at depth z, top at height h. */
const bougainvillea = (p: Painter, c: YCam, seed: number, x0: number, x1: number, z: number, h: number) => {
  const n = 70;
  for (let k = 0; k < n; k++) {
    const x = x0 + ((x1 - x0) * (k + hn(seed + k) * 0.6)) / n, y = 0.3 + (h - 0.3) * Math.sqrt(hn(seed * 7 + k)), r = 0.07 + 0.08 * hn(seed * 3 + k);
    const q = P(c, [x, y, z - 0.05]);
    if (!q) continue;
    const s = (c.f * r) / Math.max(0.5, depth(c, [x, y, z]));
    hardFill(p, seed + 100 + k, k % 3 ? VILLAGE.leafDark : VILLAGE.leaf, ellPts(q[0], q[1], s * 1.2, s * 0.8, 9));
  }
  for (let k = 0; k < n * 2; k++) {
    const x = x0 + (x1 - x0) * hn(seed * 11 + k), y = 0.5 + (h - 0.4) * Math.sqrt(hn(seed * 13 + k)), r = 0.035 + 0.04 * hn(seed * 17 + k);
    const q = P(c, [x, y, z - 0.12]);
    if (!q) continue;
    const s = (c.f * r) / Math.max(0.5, depth(c, [x, y, z]));
    const lit = x < -1.6 ? 0.25 : 0.05;
    hardFill(p, seed + 300 + k, mixColor(VILLAGE.bougain, '#ff9ac4', lit * hn(seed + k * 5)), ellPts(q[0], q[1], s, s * 0.8, 7));
  }
  // a few loose trails hanging off the top of the post
  for (let k = 0; k < 4; k++) {
    const x = x1 - 0.1 - 0.15 * k;
    wStroke(p, c, seed + 500 + k, [[x, h + 0.05, z - 0.1], [x + 0.08, h - 0.35, z - 0.12], [x + 0.02, h - 0.7 - 0.1 * k, z - 0.12]], VILLAGE.leafDark, 1.4);
  }
};

/** Everything behind the girl: sky, far trees, palms, paddy, pole and wires, lane, fence, gate, yard, bougainvillea. */
/** `o.leafOpen` (deg, default 110: user, 16 Nov 2026, so the leaf reads in B03-SH02 and SH03; LF02 was approved at 70): the shots keep one angle across B03. */
export const paintVillageBack = (p: Painter, c: YCam, o: {leafOpen?: number} = {}) => {
  const hor = c.hy;
  paintSkyBands(p, {from: VILLAGE.skyTop, to: VILLAGE.skyLow, horizon: hor + 30, width: 1080, bands: 22, style: 'flat', seed: 28100});
  // a few flat afternoon cumulus, far
  [[-220, 240, 70], [180, 360, 50], [60, 130, 40]].forEach(([dx, dy, s], i) => {
    const cx = 540 + dx, cy = hor - dy;
    [[0, 0, 1], [-0.7, 0.18, 0.7], [0.75, 0.2, 0.65], [0.3, -0.25, 0.7]].forEach(([ox, oy, k], j) => hardFill(p, 28120 + i * 8 + j, j === 0 ? '#f6f8f6' : '#eef3f2', ellPts(cx + ox * s * 2.2, cy + oy * s, s * 1.6 * k, s * k, 18)));
    hardFill(p, 28150 + i, '#dfe8ea', [[cx - s * 3.4, cy + s * 0.55], [cx + s * 3.2, cy + s * 0.55], [cx + s * 2.6, cy + s * 0.75], [cx - s * 2.8, cy + s * 0.75]]);
  });
  // far tree line z 300, village trees
  const far: V3[] = [];
  for (let i = 0; i <= 180; i++) { const x = -260 + i * 3; far.push([x, 7 + 3 * hn(i * 5) + 2.5 * Math.abs(Math.sin(i * 0.9)) + 2 * Math.sin(i * 0.13), 300]); }
  wCut(p, c, 28200, hazeV('#4f6a46', 300), [...far, [280, -0.5, 300], [-260, -0.5, 300]]);
  // paddy (z 6 .. 300): flat bands far to near, a darker band at every bund
  const D = [300, 150, 90, 60, 42, 30, 22, 16, 12, 9, 7, 5.2];
  D.forEach((d, i) => {
    const y0 = yAt(c, 0, d), y1 = i + 1 < D.length ? yAt(c, 0, D[i + 1]) : yAt(c, 0, 5);
    hardFill(p, 28300 + i, mixColor(VILLAGE.riceFar, VILLAGE.rice, i / (D.length - 1)), bandPts(y0, y1 + 1));
    if (i > 2) hardFill(p, 28320 + i, mixColor(VILLAGE.rice, VILLAGE.leaf, 0.35), bandPts(y1 - 2 - i * 0.3, y1 + 1));
  });
  // sugar palms in loose clusters across the paddy
  ([[6, 38, 15], [9, 44, 17], [3.5, 52, 13], [-7, 34, 14], [-9.5, 41, 16], [-16, 58, 18], [18, 64, 15], [-2, 70, 12]] as [number, number, number][])
    .sort((a, b) => b[1] - a[1]).forEach(([x, z, h], i) => sugarPalm(p, c, 28400 + i * 60, x, z, h, hazeV(VILLAGE.palm, z)));
  // lane z 0.6 .. 5: red laterite, ruts along x, a grass verge on the far side
  wFlat(p, c, 28800, mixColor(VILLAGE.rice, VILLAGE.leafDark, 0.25), [[-30, 0, 5.6], [30, 0, 5.6], [30, 0, 4.9], [-30, 0, 4.9]]);
  wFlat(p, c, 28801, VILLAGE.lane, [[-30, 0, 5.0], [30, 0, 5.0], [30, 0, 0.6], [-30, 0, 0.6]]);
  [[1.5, 1.85], [3.3, 3.6]].forEach(([z0, z1], i) => wFlat(p, c, 28802 + i, mixColor(VILLAGE.lane, VILLAGE.laneShade, 0.55), [[-30, 0, z1], [30, 0, z1], [30, 0, z0], [-30, 0, z0]]));
  for (let k = 0; k < 30; k++) { const x = -6 + 12 * hn(28810 + k), z = 0.8 + 4 * hn(28850 + k); wStroke(p, c, 28900 + k, [[x, 0, z], [x + 0.25, 0, z + 0.02]], mixColor(VILLAGE.lane, '#e09a6a', 0.4), 0.6); }
  // electric pole at the brief's (5.5, 0, 6) with sagging wires (off the LF02 frame; B03-SH01 start sees it)
  const pole: V3 = [5.5, 0, 6];
  wCut(p, c, 28950, VILLAGE.poleWood, [[pole[0] - 0.11, 0, pole[2]], [pole[0] + 0.11, 0, pole[2]], [pole[0] + 0.08, 8, pole[2]], [pole[0] - 0.08, 8, pole[2]]], {shadow: 3});
  wFlat(p, c, 28951, VILLAGE.wire, [[pole[0] - 0.9, 7.4, pole[2]], [pole[0] + 0.9, 7.4, pole[2]], [pole[0] + 0.9, 7.52, pole[2]], [pole[0] - 0.9, 7.52, pole[2]]]);
  [-0.8, -0.3, 0.3, 0.8].forEach((dx, i) => {
    const pts: V3[] = [];
    for (let k = 0; k <= 16; k++) { const u = k / 16, x = pole[0] + dx - 20 * u; pts.push([x, 7.55 - 1.1 * Math.sin(Math.PI * u), pole[2] + 0.3 * u]); }
    wStroke(p, c, 28960 + i, pts, VILLAGE.wire, 0.7);
    const pts2: V3[] = [];
    for (let k = 0; k <= 16; k++) { const u = k / 16, x = pole[0] + dx + 26 * u; pts2.push([x, 7.55 - 1.4 * Math.sin(Math.PI * u), pole[2] - 0.2 * u]); }
    wStroke(p, c, 28970 + i, pts2, VILLAGE.wire, 0.7);
  });
  // yard earth from the gate line to the camera
  wFlat(p, c, 29000, VILLAGE.yard, [[-30, 0, 0.6], [30, 0, 0.6], [30, 0, -12], [-30, 0, -12]]);
  wFlat(p, c, 29001, mixColor(VILLAGE.yard, VILLAGE.lane, 0.25), [[-30, 0, 0.6], [30, 0, 0.6], [30, 0, -0.5], [-30, 0, -0.5]]);
  // fallen mango leaves and a few pebbles
  for (let k = 0; k < 26; k++) {
    const x = -2.6 + 4.2 * hn(29100 + k), z = -4.6 + 4.4 * hn(29200 + k), a = 6.28 * hn(29300 + k), L = 0.12;
    const inShade = z < houseEdge(x);
    wFlat(p, c, 29400 + k, mixColor(k % 3 ? '#8a7a3a' : '#a0622e', VILLAGE.yardShade, inShade ? 0.5 : 0.1), [[x - L * Math.cos(a), 0, z - L * Math.sin(a)], [x + 0.03 * Math.sin(a), 0, z - 0.03 * Math.cos(a)], [x + L * Math.cos(a), 0, z + L * Math.sin(a)], [x - 0.03 * Math.sin(a), 0, z + 0.03 * Math.cos(a)]]);
  }
  // fence: concrete posts and three straight wires along z 0
  const fx = [-8.4, -6.4, -4.4, -2.4, 2.4, 4.4, 6.4, 8.4];
  [[-9, -1.4], [1.4, 9]].forEach(([x0, x1], s) => [0.35, 0.65, 0.95].forEach((y, i) => wStroke(p, c, 29500 + s * 4 + i, [[x0, y, 0], [x1, y, 0]], '#5a5550', 0.6)));
  fx.forEach((x, i) => post(p, c, 29600 + i * 10, x, 0, 0.12, 1.0, false));
  // gate leaves: the camera-left (+x) leaf open 110 deg into the yard, the camera-right (-x) leaf closed
  const hingeL: [number, number] = [1.275, 0], open = ((o.leafOpen ?? 110) * Math.PI) / 180;
  leaf(p, c, 29700, [-1.275, 0], [0, 0], 1.2);
  leaf(p, c, 29720, hingeL, [hingeL[0] - 1.275 * Math.cos(open), -1.275 * Math.sin(open)], 1.2);
  wShadow(p, c, 29740, [[-1.275, 0, 0], [0, 0, 0], [0 + shadowDir[0] * castLen(1.2), 0, shadowDir[1] * castLen(1.2)], [-1.275 + shadowDir[0] * castLen(1.2), 0, shadowDir[1] * castLen(1.2)]], 6, 0.12);
  // gate posts
  post(p, c, 29800, 1.4, 0, 0.25, 1.6, true);
  post(p, c, 29820, -1.4, 0, 0.25, 1.6, true);
  bougainvillea(p, c, 29900, -3.2, -1.25, 0, 1.75);
};

/** z of the stilt house's shadow edge across the yard at x (the house is behind the camera at z -9 .. -15; its eave shadow reaches about
 *  z -3.1 with the 15:30 sun, a softly waving eave line). */
export const houseEdge = (x: number) => -3.05 - 0.25 * Math.sin(x * 1.7) - 0.12 * Math.sin(x * 4.1);
const houseShadow = (): V3[] => { const pts: V3[] = []; for (let i = 0; i <= 80; i++) { const x = -12 + i * 0.3; pts.push([x, 0.002, houseEdge(x)]); } return [...pts, [12, 0.002, -12], [-12, 0.002, -12]]; };
/** Foreground (UT12: darker, no light edges): the house's eave shadow over the near yard, painted as ground before the hens. */
export const paintVillageFront = (p: Painter, c: YCam) => {
  const q = poly(c, houseShadow());
  if (okPoly(q)) hardFill(p, 29990, VILLAGE.yardShade, q);
};
/** The girl's ground shadow (feet g, unit px/m): a short dark ellipse cast screen left and away. */
export const paintFigureShadow = (p: Painter, c: YCam, at: V3, h: number, seed: number) => {
  const L = castLen(h);
  const pts: V3[] = [];
  for (let k = 0; k <= 16; k++) {
    const a = (k / 16) * Math.PI * 2, u = 0.5 + 0.5 * Math.cos(a), w = 0.16 * Math.sin(a);
    pts.push([at[0] + shadowDir[0] * L * u - shadowDir[1] * w, 0.002, at[2] + shadowDir[1] * L * u + shadowDir[0] * w]);
  }
  wShadow(p, c, seed, pts, 4, 0.3);
};

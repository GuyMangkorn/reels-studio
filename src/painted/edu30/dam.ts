import {clipHalf, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {PAD, paintPadSky, paintScrub} from './paddock';

// SPACE D, the farm dam in 1932 (`new: farm-dam-1932`, VD30-03; Film W3 look asset 2026-11-19, Boss hardens). An excavated earth tank with
// spoil banks, muddy water, two dead trees and a steel windmill, in the same NE morning light as the paddock. World: metres, origin on the
// ground at the outer foot of the south bank, middle; north = -z. W3 change (Film): the south crest is 1.2 m (brief estimate 1.6 m) so the
// water reads over it from a crouch-height lens; crew heights follow the slope.
// ROWS-R4 (Film, LF02 redesign): an organic waterline (`SHORE`), water that mirrors the sky, the far bank, the windmill, the dead trees and
// (through `reflect`) the cast, ripple dashes square to the lens, a thin wet rim and dry bathtub rings on the lit inner slope.

export const DAM = {crest: 1.2, crestZ: [-2.8, -1.2] as [number, number], water: 0.3, waterZ: [-5, -25] as [number, number], northCrest: 1.4, northZ: -28,
  earth: '#ad7a52', earthLit: '#c9966a', earthShade: '#97683f', spoil: '#b9875e', waterCol: '#5f5a48', waterLight: '#e6e2d2', waterDark: '#3f3729',
  deadWood: '#8f877c', deadWoodDark: '#5d564e', steel: '#5a5c5a', grass: '#c2ab7a',
  // LF02 redesign (Film, ROWS-R4): seen from a low lens the water is at a grazing angle and mirrors the white morning sky (pale, cool); the wet mud rim is
  // the darkest value of the bank, so bank (warm mid), rim (dark) and water (pale, cool) read as three separate things at 270 px.
  skyWater: '#e4e7e2', skyWaterFar: '#f2f1e8', nearWater: '#c9cdc8', mud: '#5b4330', inner: '#b07e52', reflection: '#6d6a60'} as const;

const h = (n: number) => { const s = Math.sin(n * 63.71 + 21.3) * 43758.5453; return s - Math.floor(s); };
/** Ground height of the south bank at z (outer slope, crest, inner slope). */
export const southBankY = (z: number) => z >= 0 ? 0 : z >= DAM.crestZ[1] ? DAM.crest * (-z / -DAM.crestZ[1]) : z >= DAM.crestZ[0] ? DAM.crest : z >= DAM.waterZ[0] ? DAM.water + (DAM.crest - DAM.water) * ((z - DAM.waterZ[0]) / (DAM.crestZ[0] - DAM.waterZ[0])) : DAM.water;

/** The waterline (x, z), an organic loop: the south shore wobbles about z -5.3, an east bay where the queue comes in, a ragged north shore. */
export const SHORE_SOUTH_N = 73;
export const SHORE: [number, number][] = [
  ...Array.from({length: SHORE_SOUTH_N}, (_, i): [number, number] => { const x = -24 + i * 0.5; return [x, -5.2 - 0.18 * (1 + Math.sin(x * 1.3 + 1)) - 0.08 * (1 + Math.sin(x * 3.1)) - 0.08 * h(i)]; }),
  [13.4, -6.4], [15.2, -8.8], [16.3, -12.2], [16.4, -16.0], [15.1, -19.8], [12.6, -23.2], [9.0, -25.0],
  ...Array.from({length: 12}, (_, i): [number, number] => { const x = 6.5 - i * 2.6; return [x, -25.1 - 0.7 * (0.5 + 0.5 * Math.sin(x * 0.45)) - 0.3 * h(i + 40)]; }),
  [-24.0, -23.2], [-25.6, -18.0], [-26.0, -12.0], [-25.4, -7.4]];
const at = (y: number) => (q: Pt): V3 => [q[0], y, q[1]];
/** The waterline part with z beyond `z` (further north), as a world polygon at the water height (+ `dy`). */
const waterBeyond = (z: number, dy = 0): V3[] => clipHalf(SHORE as Pt[], [0, -1], -z).map(at(DAM.water + dy));

export type DamOpts = {
  /** dead trees standing in the water: base (x, z) and height (m) */
  trees?: [number, number, number][];
  /** windmill on the shore: base (x, z) and tower height */
  windmill?: [number, number, number];
  /** paints reflections of the cast into the water (after the water and the set reflections, before the ripples and the bank) */
  reflect?: () => void;
};
export const DAM_TREES: [number, number, number][] = [[-3.6, -13, 6.5], [4.2, -17, 7.5]];

export const paintDam = (p: Painter, c: YCam, seed: number, o: DamOpts = {}) => {
  const trees = o.trees ?? DAM_TREES, mill = o.windmill ?? [-12, -26, 9];
  paintPadSky(p, c);
  paintScrub(p, c, seed + 10, 300);
  paintScrub(p, c, seed + 20, 150, '#7a8264');
  const R = 600;
  wFill(p, c, seed + 30, DAM.grass, [[c.x - R, 0, c.z - R], [c.x + R, 0, c.z - R], [c.x + R, 0, c.z + R], [c.x - R, 0, c.z + R]]);
  // far paddock bands (stubble and wheat strips beyond the north bank)
  for (let k = 0; k < 6; k++) { const z0 = -40 - k * k * 9, z1 = z0 - 6 - k * 3; wFill(p, c, seed + 40 + k, k % 2 ? PAD.wheatLit : mixColor(DAM.grass, PAD.wheat, 0.5), [[-R, 0.01, z0], [R, 0.01, z0], [R, 0.01, z1], [-R, 0.01, z1]]); }
  // north spoil bank: a long low ridge with heaps
  const nb: V3[] = [];
  for (let i = 0; i <= 24; i++) { const x = -26 + i * (52 / 24); nb.push([x, DAM.northCrest * (0.75 + 0.4 * h(i)), DAM.northZ - 0.5 * Math.sin(i)]); }
  wFill(p, c, seed + 60, DAM.earthShade, [...nb, [26, 0, DAM.northZ - 4], [-26, 0, DAM.northZ - 4]]);
  wFill(p, c, seed + 61, DAM.spoil, [...nb, [26, DAM.water, DAM.waterZ[1] - 1], [-26, DAM.water, DAM.waterZ[1] - 1]]);
  paintWindmill(p, c, seed + 300, [mill[0], 0, mill[1]], mill[2]);
  // the water: the white sky mirrored (pale, brightest far off), muddier and darker toward the near shore
  wFill(p, c, seed + 200, DAM.nearWater, SHORE.map(at(DAM.water)));
  wWash(p, c, seed + 201, DAM.skyWater, 90, waterBeyond(-7.5, 0.001), 0.35, 0.2);
  wWash(p, c, seed + 202, DAM.skyWaterFar, 85, waterBeyond(-13, 0.002), 0.35, 0.15);
  // the far bank and the windmill upside down in it (a reflection is the strongest "this is water" cue), broken by ripple lines
  const nbR = nb.map(([x, y, z]): V3 => [x, 2 * DAM.water - y * 0.8, z]);
  const north = SHORE.filter(([x, z]) => z < -24.5 && x > -22 && x < 8).map(at(DAM.water + 0.003));
  wWash(p, c, seed + 203, DAM.reflection, 55, [...north, ...nbR.filter(([x]) => x > -22 && x < 8).map(([x, y, z]): V3 => [x, y, Math.max(z, -26.5)]).reverse()], 0.25, 0.2);
  paintWindmill(p, c, seed + 1300, [mill[0], 0, mill[1]], mill[2], 0, DAM.water);
  trees.forEach(([x, z, ht], i) => paintDeadTree(p, c, seed + 1500 + i * 20, [x, DAM.water, z], ht, DAM.water));
  o.reflect?.();
  // ripple lines: short dashes square to the lens (they read level on screen), pale and dark, rings round the trunks
  const rx = Math.cos(c.yaw), rz = Math.sin(c.yaw);
  for (let k = 0; k < 34; k++) {
    const z = -6.2 - h(k * 7) * 17, x0 = -20 + h(k * 3) * 34, w = 0.8 + h(k * 5) * 2.4;
    if (!pointIn(SHORE, [x0, z]) || !pointIn(SHORE, [x0 + w * rx, z + w * rz])) continue;
    wInk(p, c, seed + 2000 + k, [[x0, DAM.water + 0.004, z], [x0 + w * rx, DAM.water + 0.004, z + w * rz]], {closed: false, weight: 1.1, color: k % 3 ? DAM.skyWaterFar : DAM.reflection});
  }
  for (let k = 0; k < 90; k++) {   // near water: short ripple dashes, pale and a few dark, breaking the reflections
    const z = -5.55 - h(k * 11 + 3) * 3.4, x0 = -5 + h(k * 13 + 1) * 8.2, w = 0.2 + h(k * 17) * 0.5;
    if (!pointIn(SHORE, [x0, z + 0.1]) || !pointIn(SHORE, [x0 + w * rx, z + w * rz + 0.1])) continue;
    wInk(p, c, seed + 2050 + k, [[x0, DAM.water + 0.004, z], [x0 + w * rx, DAM.water + 0.004, z + w * rz]], {closed: false, weight: 1.6, color: k % 3 ? DAM.skyWaterFar : mixColor(DAM.reflection, DAM.nearWater, 0.4)});
  }
  trees.forEach(([x, z], i) => { for (let r = 0; r < 3; r++) { const rr = 0.45 + r * 0.5; wInk(p, c, seed + 2100 + i * 5 + r, Array.from({length: 18}, (_, k): V3 => [x + rr * 1.6 * Math.cos((k / 18) * 6.283), DAM.water + 0.005, z + rr * 0.9 * Math.sin((k / 18) * 6.283)]), {weight: 0.9, color: r % 2 ? DAM.reflection : DAM.skyWaterFar}); } });
  // the dead trees themselves (VD30-03), standing in the water
  trees.forEach(([x, z, ht], i) => paintDeadTree(p, c, seed + 150 + i * 10, [x, DAM.water, z], ht));
  // the south bank: inner slope down to the waterline (lit by the NE sun: it faces north), the wet mud rim at the water, crest, outer slope (shade)
  // the bank mirrored in the water just off the shore (before the crew reflections), a darker warm band
  for (let i = 0; i < SHORE_SOUTH_N - 1; i++) {
    const [xa, za] = SHORE[i], [xb, zb] = SHORE[i + 1], my = 2 * DAM.water - DAM.crest;
    wWash(p, c, seed + 1700 + i, mixColor(DAM.inner, DAM.nearWater, 0.5), 55, [[xa, DAM.water + 0.002, za], [xb, DAM.water + 0.002, zb], [xb, my, DAM.crestZ[0]], [xa, my, DAM.crestZ[0]]], 0.1, 0.2);
  }
  for (let i = 0; i < SHORE_SOUTH_N - 1; i++) {
    const [xa, za] = SHORE[i], [xb, zb] = SHORE[i + 1];
    wFill(p, c, seed + 400 + i, DAM.inner, [[xa, DAM.water, za], [xb, DAM.water, zb], [xb, DAM.crest, DAM.crestZ[0]], [xa, DAM.crest, DAM.crestZ[0]]]);
  }
  // the wet rim: a thin dark band at the waterline, and two dry "bathtub rings" higher up the slope where the water stood before the drought
  const rim = (dz: number, dy: number) => SHORE.slice(0, SHORE_SOUTH_N).map(([x, z]): V3 => [x, DAM.water + dy, z + dz]);
  const rimA = rim(-0.02, 0.001), rimB = rim(0.035, 0.015);
  wFill(p, c, seed + 440, mixColor(DAM.mud, DAM.inner, 0.25), [...rimA, ...rimB.slice().reverse()]);
  for (const [k, f] of [[0, 0.3], [1, 0.62]] as const) {
    const line = SHORE.slice(0, SHORE_SOUTH_N).map(([x, z]): V3 => { const zz = z + (DAM.crestZ[0] - z) * f; return [x, DAM.water + (DAM.crest - DAM.water) * f, zz + 0.12 * Math.sin(x * 0.9 + k)]; });
    for (let j = 0; j + 4 < line.length; j += 4) wInk(p, c, seed + 460 + k * 40 + j, line.slice(j, j + 5), {closed: false, weight: 1.4, color: mixColor(DAM.inner, DAM.mud, 0.3)});
  }
  for (const [k, x0, x1] of [[0, -24, -8], [1, -8, 8], [2, 8, 14]] as const) {
    wFill(p, c, seed + 410 + k, DAM.earth, [[x0, DAM.crest, DAM.crestZ[0]], [x1, DAM.crest, DAM.crestZ[0]], [x1, DAM.crest, DAM.crestZ[1]], [x0, DAM.crest, DAM.crestZ[1]]]);
    wFill(p, c, seed + 420 + k, DAM.earthShade, [[x0, DAM.crest, DAM.crestZ[1]], [x1, DAM.crest, DAM.crestZ[1]], [x1, 0, 0], [x0, 0, 0]]);
  }
  // east end of the bank: it ramps down to the low approach where the queue walks in (x 14..17)
  wFill(p, c, seed + 430, DAM.earth, [[14, DAM.crest, DAM.crestZ[0]], [14, DAM.crest, DAM.crestZ[1]], [17.5, 0.5, -1.6], [17.5, 0.5, -3.4]]);
  wFill(p, c, seed + 431, DAM.earthShade, [[14, DAM.crest, DAM.crestZ[1]], [14, 0, 0], [17.5, 0, -0.4], [17.5, 0.5, -1.6]]);
  wFill(p, c, seed + 432, DAM.inner, [[14, DAM.crest, DAM.crestZ[0]], [17.5, 0.5, -3.4], [15.2, DAM.water, -8.8], [13.4, DAM.water, -6.4]]);
  // crest: a ragged inner lip of clods and dry tussocks (the crew's cover), and clods along the outer lip
  for (let i = 0; i < 60; i++) {
    const inner = i % 2 === 0, x = -12 + (i >> 1) * 0.85 + h(i) * 0.4, z = inner ? DAM.crestZ[0] + 0.1 + h(i * 3) * 0.2 : DAM.crestZ[1] - 0.05 - h(i * 3) * 0.25, s = camPoint(c, [x, DAM.crest, z]);
    if (!s) continue;
    const u = camUnit(c, [x, DAM.crest, z]), r = (0.07 + 0.09 * h(i * 7)) * u;
    hardFill(p, seed + 500 + i, i % 3 ? DAM.earthShade : DAM.spoil, Array.from({length: 9}, (_, k) => { const a = Math.PI + (k / 8) * Math.PI; return [s[0] + r * 1.4 * Math.cos(a), s[1] + r * Math.sin(a)] as Pt; }));
    if (inner && i % 4 === 0) for (let j = 0; j < 7; j++) inkLine(p, seed + 600 + i * 8 + j, [[s[0] + (j - 3) * 0.04 * u, s[1]], [s[0] + (j - 3) * 0.09 * u, s[1] - (0.22 + 0.12 * h(i + j)) * u]], {closed: false, weight: Math.max(0.9, u * 0.008), color: '#8a7448', still: true});
  }
  // crest top texture: stones and dry grass, a few darker clods (foreground, UT12a)
  for (let i = 0; i < 70; i++) {
    const x = -6 + h(i * 5) * 12, z = DAM.crestZ[0] + 0.15 + h(i * 9) * 1.4 + (i % 5 === 0 ? 1.4 + h(i) : 0), y = southBankY(z), s = camPoint(c, [x, y, z]);
    if (!s) continue;
    const u = camUnit(c, [x, y, z]), r = (0.03 + 0.04 * h(i)) * u;
    hardFill(p, seed + 700 + i, mixColor(DAM.earthShade, '#3a281a', 0.2 + 0.25 * h(i * 2)), Array.from({length: 8}, (_, k) => { const a = (k / 8) * 6.283; return [s[0] + r * 1.3 * Math.cos(a), s[1] + r * 0.6 * Math.sin(a)] as Pt; }));
  }
};

/** Even-odd point-in-polygon on (x, z). */
const pointIn = (poly: [number, number][], [x, z]: [number, number]) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside; }
  return inside;
};

/** Dead tree: grey bare trunk and a few forked branches (tapered polygons). `mirror` = a water height: paint its reflection instead. */
export const paintDeadTree = (p: Painter, c: YCam, seed: number, at: V3, ht: number, mirror?: number) => {
  const [x, y0, z] = at, M = (v: V3): V3 => mirror === undefined ? v : [v[0], 2 * mirror - v[1], v[2]];
  const limbP = (a0: V3, b0: V3, w0: number, w1: number, k: number, col0: string) => {
    const a = M(a0), b = M(b0), col = mirror === undefined ? col0 : DAM.reflection;
    const pa = camPoint(c, a), pb = camPoint(c, b);
    if (!pa || !pb) return;
    const ua = camUnit(c, a), ub = camUnit(c, b), dx = pb[0] - pa[0], dy = pb[1] - pa[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    hardFill(p, seed + k, col, [[pa[0] + nx * w0 * ua, pa[1] + ny * w0 * ua], [pb[0] + nx * w1 * ub, pb[1] + ny * w1 * ub], [pb[0] - nx * w1 * ub, pb[1] - ny * w1 * ub], [pa[0] - nx * w0 * ua, pa[1] - ny * w0 * ua]]);
  };
  // branches spread square to the lens (along the camera's right vector) so they never foreshorten to a bare pole (LF02 looks along -x)
  const rx = Math.cos(c.yaw), rz = Math.sin(c.yaw), P = (s: number, y: number): V3 => [x + s * rx, y, z + s * rz];
  const top: V3 = P(0.2, y0 + ht * 0.6);
  limbP([x, y0, z], top, 0.22, 0.13, 0, DAM.deadWood);
  const br: [V3, V3, number][] = [[top, P(-ht * 0.28, y0 + ht * 0.95), 0.08], [top, P(ht * 0.3, y0 + ht * 0.88), 0.08], [P(0.1, y0 + ht * 0.42), P(ht * 0.25, y0 + ht * 0.6), 0.06], [P(-ht * 0.14, y0 + ht * 0.78), P(-ht * 0.2, y0 + ht), 0.04], [P(ht * 0.15, y0 + ht * 0.75), P(ht * 0.12, y0 + ht * 1.0), 0.04]];
  br.forEach(([a, b, w], i) => limbP(a, b, w, w * 0.35, 10 + i, i % 2 ? DAM.deadWoodDark : DAM.deadWood));
};

/** Steel windmill: tapering lattice tower, a wheel of blades, a tail vane, a stone tank stand at its foot. `mirror` = a water height: its reflection. */
export const paintWindmill = (p: Painter, c: YCam, seed: number, at: V3, ht: number, t = 0, mirror?: number) => {
  const [x, , z] = at, w0 = 1.0, w1 = 0.18, legs: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const M = (v: V3): V3 => mirror === undefined ? v : [v[0], 2 * mirror - v[1], v[2]], R0 = mirror === undefined ? null : DAM.reflection;
  const L = (k: number, y: number): V3 => { const w = w0 + (w1 - w0) * (y / ht); return M([x + legs[k][0] * w, y, z + legs[k][1] * w]); };
  for (let k = 0; k < 4; k++) wInk(p, c, seed + k, [L(k, 0), L(k, ht)], {closed: false, weight: 1.3, color: R0 ?? DAM.steel});
  for (let j = 1; j < 6; j++) { const y = (j / 6) * ht, y2 = ((j - 1) / 6) * ht; for (let k = 0; k < 4; k++) wInk(p, c, seed + 10 + j * 8 + k, [L(k, y2), L((k + 1) % 4, y)], {closed: false, weight: 0.6, color: R0 ?? DAM.steel}); }
  const hub: V3 = M([x, ht + 0.25, z + 0.3]);
  const hp = camPoint(c, hub);
  if (hp) {
    const u = camUnit(c, hub), R = 1.2 * u;
    for (let b = 0; b < 18; b++) {
      const a = (b / 18) * 6.283 + t * 1.6, a2 = a + 0.2;
      hardFill(p, seed + 100 + b, R0 ?? (b % 2 ? '#6e706c' : '#7c7e78'), [[hp[0] + 0.2 * R * Math.cos(a), hp[1] + 0.2 * R * Math.sin(a)], [hp[0] + R * Math.cos(a), hp[1] + R * Math.sin(a)], [hp[0] + R * Math.cos(a2), hp[1] + R * Math.sin(a2)], [hp[0] + 0.2 * R * Math.cos(a2), hp[1] + 0.2 * R * Math.sin(a2)]]);
    }
    inkLine(p, seed + 140, Array.from({length: 24}, (_, k) => [hp[0] + R * Math.cos((k / 24) * 6.283), hp[1] + R * Math.sin((k / 24) * 6.283)] as Pt), {weight: 0.8, color: R0 ?? DAM.steel, still: true});
  }
  wFill(p, c, seed + 150, R0 ?? '#6a6c68', ([[x + 0.2, ht + 0.35, z - 0.2], [x + 2.2, ht + 0.6, z - 0.4], [x + 2.2, ht - 0.1, z - 0.4], [x + 0.2, ht + 0.1, z - 0.2]] as V3[]).map(M));
  if (mirror === undefined) paintBox(p, c, seed + 170, {x0: x + 1.6, x1: x + 3.8, y0: 0, y1: 1.4, z0: z - 1.1, z1: z + 1.1}, '#8d8a80', {}, {});
};

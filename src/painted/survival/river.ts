import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import {paintFogBank} from '../kit/fog';
import {paintSorted, qy, wFill, wInk, wp, type Item} from '../kit/world';
import {camPoint} from '../kit/ycam';
import {cardAt, cell, lit, strip, type Light, type Painter, type Pt, type V3, type YCam} from './core';
import {forestItems, paintConifer, paintFernClump, paintTreeFern} from './forest';

// SET-RIVER (RIV, N16-11; brief "Set plan - SET-RIVER", shared by EP16 sh16, EP17 sh9-11 and 16-17, EP18 sh3): a shallow, clear river with pebbles visible on
// the bed, a low bank on each side, the same meso forest behind, and net stakes. Space RIV in metres: origin on the near bank waterline at the fishing
// spot, +x downstream, +y up, +z toward the bank (the camera side). The river is 8 m wide (z -8..0), 0.3-0.6 m deep; the far bank starts at z -8 and the
// forest wall stands at z -13 and behind. Built for a yaw camera at about eye 1.6 m on the near bank (or knee-deep in the water, z > -3).
// Flat banded fills like the village (UT01/UT03: the water mirrors the sky colour but stays clear: pebbles read through it).

export const RC = {
  water: '#8fb8b0', waterDeep: '#6a9a98', waterFar: '#a4c4b8', pebbleA: '#c8b690', pebbleB: '#8a8a78', pebbleC: '#a9a090', sand: '#cdbd92', bank: '#8a7a50', bankGrass: '#6f8a48',
  glint: '#f4f8ec', stake: '#7a5a3a', net: '#d8d0b4', ink: '#2b3a30',
} as const;
export type RiverMode = 'day' | 'dusk';
export const RIVER_LIGHT: Record<RiverMode, Light> = {day: {amb: '#d6e2c8', k: 0.1}, dusk: {amb: '#e8b890', k: 0.32}};

/** Number of flow ripple lines per call and the bed pebbles per square metre are fixed so a still and a moving shot share one drawing. */
export type RiverOpts = {
  mode?: RiverMode; t: number; light?: Light;
  /** Net stakes in the water: [x, z] of the first pole and the pole spacing along x (m); drawn as two poles and a sagging mesh. */
  nets?: {at: [number, number]; span?: number}[];
  extra?: Item[];
  x0?: number; x1?: number;
  /** N16-11 R3: world x offset (m) of the bed pebbles, for the 4-frame shimmer after a footfall (`shimmerJit`). */
  jit?: number;
};

const bedPebbles = (L: Light, x0: number, x1: number, seed: number, jit = 0): Item[] => {
  const items: Item[] = [];
  const n = Math.round((x1 - x0) * 5);
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * hash(seed + i * 1.7) + jit, z = -7.6 + 7.4 * hash(seed + i * 4.1 + 0.3), r = 0.05 + 0.1 * hash(seed + i * 2.3 + 0.5);
    const col = [RC.pebbleA, RC.pebbleB, RC.pebbleC][i % 3], at: V3 = [x, 0, z];
    items.push({at, bias: 6, draw: (p, c) => {
      const k = cardAt(c, [x, 0.01, z]);
      if (!k || k.u * r < 1.2) return;
      // on the bed under water: a flat ellipse slightly cooler than on dry ground
      hardFill(p, seed + 100 + i * 2, mixColor(lit(L, col), RC.waterDeep, 0.22), cell(k, 0, 0, r, r * 0.45, 8, 0));
    }});
  }
  return items;
};

const stakeNet = (L: Light, [x, z]: [number, number], span: number, seed: number): Item => ({at: [x + span / 2, 0, z], draw: (p, c) => {
  const pole = (px: number, id: number) => {
    const a = camPoint(c, [px, -0.3, z]), b = camPoint(c, [px, 1.5, z]);
    if (a && b) hardFill(p, id, lit(L, RC.stake), strip([a, b], [0.04 * (a[1] - b[1]) / 1.8, 0.03 * (a[1] - b[1]) / 1.8]));
  };
  // mesh: a sagging curtain between the poles, half under the water line
  const top = Array.from({length: 9}, (_, i): V3 => [x + (span * i) / 8, 1.1 - 0.12 * Math.sin((Math.PI * i) / 8), z]);
  const bot = Array.from({length: 9}, (_, i): V3 => [x + (span * (8 - i)) / 8, -0.1, z]);
  const q = wp(c, [...top, ...bot]);
  if (q.length > 3) hardFill(p, seed + 2, mixColor(lit(L, RC.net), RC.waterFar, 0.45), q);
  for (let i = 1; i < 8; i++) wInk(p, c, seed + 10 + i, [[x + (span * i) / 8, -0.1, z], [x + (span * i) / 8, 1.05, z]], {closed: false, weight: 0.3, color: lit(L, '#8a8470')});
  for (let j = 1; j < 4; j++) wInk(p, c, seed + 30 + j, [[x, j * 0.28 - 0.1, z], [x + span, j * 0.28 - 0.1, z]], {closed: false, weight: 0.3, color: lit(L, '#8a8470')});
  pole(x, seed);
  pole(x + span, seed + 1);
  // water line cuts the poles: a short ripple ring at each foot
  for (const px of [x, x + span]) { const g = camPoint(c, [px, 0, z]); if (g) inkLine(p, seed + 50 + Math.round(px), Array.from({length: 12}, (_, j): Pt => [g[0] + 12 * Math.cos(j / 12 * 6.283), g[1] + 3 * Math.sin(j / 12 * 6.283)]), {weight: 0.5, color: '#e8f2ec', still: true}); }
}});

/** The river plate (sky, forest wall, far bank, water over the bed, near bank, nets) seen through `c`; people and props go in `extra`. */
export const paintRiver = (p: Painter, c: YCam, o: RiverOpts) => {
  const mode = o.mode ?? 'day', L = o.light ?? RIVER_LIGHT[mode], dusk = mode === 'dusk';
  const x0 = o.x0 ?? -75, x1 = o.x1 ?? 60;
  paintSkyBands(p, dusk
    ? {from: '#6a6a9a', via: '#e8a878', to: '#f4d4a0', horizon: c.hy + 40, width: 1080, viaAt: 0.55, bands: 10, style: 'flat'}
    : {from: '#a9c4c8', via: '#cfdcc4', to: '#e8e6c8', horizon: c.hy + 40, width: 1080, viaAt: 0.55, bands: 10, style: 'flat'});
  const haze = dusk ? '#e8c0a0' : '#dfe8d4';
  // conifer wall behind the far bank (z -13 and back), hazed with distance
  const fi = forestItems(-13, x0 / 2, x1 / 2, 4711);
  paintSorted(p, c, fi.filter((f) => f.kind === 'conifer').map((f): Item => ({at: f.at, draw: (q, cc) => paintConifer(q, cc, f.at, f.h, L, f.seed, {haze: Math.min(0.6, Math.max(0, (-f.at[2] - 16) / 30)), hazeCol: haze})})));
  paintFogBank(p, {y: c.hy - 50, height: 220, width: 1080, color: dusk ? '#f0d0b0' : '#e6eedc', density: 0.6, t: o.t, puffs: 7, seed: 7410});
  // far bank earth and grass (z -10..-8), water (z -8..0), near bank (z 0..6)
  wFill(p, c, 26000, lit(L, RC.bankGrass), qy(0, x0, x1, -13, -8));
  wFill(p, c, 26001, lit(L, RC.bank), qy(0.005, x0, x1, -9, -8));
  wFill(p, c, 26002, lit(L, RC.water), qy(0.01, x0, x1, -8, 0));
  // depth bands: deeper and cooler mid-river, lighter in the shallows at both edges
  wFill(p, c, 26003, mixColor(lit(L, RC.waterDeep), lit(L, RC.water), 0.4), qy(0.012, x0, x1, -6.6, -2.6));
  wFill(p, c, 26004, lit(L, RC.waterDeep), qy(0.013, x0, x1, -5.4, -3.8));
  wFill(p, c, 26005, lit(L, RC.sand), qy(0.004, x0, x1, 0, 1.4));
  wFill(p, c, 26006, lit(L, RC.bankGrass), qy(0.003, x0, x1, 1.4, 14));
  const items: Item[] = [...bedPebbles(L, Math.max(x0, c.x - 40), Math.min(x1, c.x + 40), 26100, o.jit ?? 0)];
  // flow: long thin ripple strokes drifting downstream (+x) and glints on the water
  for (let i = 0; i < 46; i++) {
    const z = -7.7 + 7.4 * hash(26300 + i), len = 0.8 + 1.8 * hash(26400 + i), x = x0 + ((hash(26500 + i) * (x1 - x0) + o.t * (0.5 + 0.4 * hash(26600 + i))) % (x1 - x0));
    if (Math.abs(x - c.x) > 45) continue;
    items.push({at: [x, 0, z], bias: 5, draw: (q, cc) => wInk(q, cc, 26700 + i, [[x, 0.02, z], [x + len * 0.5, 0.02, z + 0.03], [x + len, 0.02, z]], {closed: false, weight: 0.5, color: lit(L, i % 4 ? '#d4e8e0' : RC.glint)})});
  }
  for (const [i, n] of (o.nets ?? []).entries()) items.push(stakeNet(L, n.at, n.span ?? 1.6, 26900 + i * 100));
  // banks: ferns and clumps on the near bank, tree ferns on the far bank
  for (let x = x0 + 4; x < x1; x += 3.4) {
    if (Math.abs(x - c.x) > 40) continue;
    const h = hash(26800 + x);
    items.push({at: [x + h, 0, 2.2 + 2 * hash(26810 + x)], draw: (q, cc) => paintFernClump(q, cc, [x + h, 0, 2.2 + 2 * hash(26810 + x)], 0.8 + 0.5 * h, L, 27000 + Math.round(x * 7))});
    if (h > 0.4) items.push({at: [x, 0, -10 - 1.5 * h], draw: (q, cc) => paintTreeFern(q, cc, [x, 0, -10 - 1.5 * h], 3.5 + 2.5 * h, L, 27500 + Math.round(x * 5))});
  }
  paintSorted(p, c, [...items, ...(o.extra ?? [])]);
  // sun glitter bands low in the water (keeps the lower frame bright but broken, UT01)
  const g = camPoint(c, [c.x + 2, 0, -4]);
  if (g) washAt(p, 27900, dusk ? '#ffd8a0' : '#f6f8e8', 30, [[g[0] - 280, g[1] - 14], [g[0] + 280, g[1] - 14], [g[0] + 240, g[1] + 6], [g[0] - 240, g[1] + 6]], 0.5, 0.3);
};

/** Colour of the painted river surface at depth line `z` (m), mirroring the fills in `paintRiver` (shallows, mid band, deep channel), so a waterline sheet matches what it covers (N16-11 R2). */
export const waterColorAt = (z: number, L: Light): string => {
  let col = lit(L, RC.water);
  if (z >= -6.6 && z <= -2.6) col = mixColor(lit(L, RC.waterDeep), lit(L, RC.water), 0.4);
  if (z >= -5.4 && z <= -3.8) col = lit(L, RC.waterDeep);
  return col;
};

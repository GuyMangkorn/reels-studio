import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import {paintFogBank, paintHalo} from '../kit/fog';
import {paintBox, paintSorted, qy, qz, qx, wFill, wInk, wp, type Box, type Item} from '../kit/world';
import {camPoint} from '../kit/ycam';
import {cardAt, cell, cps, lit, strip, type Light, type Painter, type Pt, type V3, type YCam} from './core';
import {paintHen} from './hen';
import {paintSkyRipple} from './sky';
import {granaryExterior, type GranaryOpts} from './granary';
import {forestItems, paintConifer, paintCycad, paintFernClump, paintTreeFern} from './forest';

// SET-VIL Isan village (brief VD-S02, "Set plan - SET-VIL"), shared by EP16-18. Look stills W3 (Film): night with the sky ripple (S-WORM, VD-S01)
// and the humid morning in the dinosaur world. Space VIL in metres: origin yard centre on the ground, +x east, +y up, +z south.

export const VC = {
  wood: '#8a6446', woodDark: '#5e402c', woodPale: '#b08a62', zinc: '#9aa0a2', zincDark: '#6d7476', thatch: '#b8955a', bamboo: '#c7ad72',
  dirt: '#b39a72', dirtDark: '#8f7a58', paddy: '#9aa25a', bund: '#8a8150', jar: '#7a4a30', straw: '#d6b866', cloth: '#b5473a',
  window: '#ffc46a', ink: '#2b211c',
} as const;

export type VilMode = 'night' | 'morning';
export const LIGHT: Record<VilMode, Light> = {night: {amb: '#1a2442', k: 0.62}, morning: {amb: '#d6e2c8', k: 0.1}};

const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Box => ({x0, x1, y0, y1, z0, z1});
const pb = (p: Painter, c: YCam, seed: number, b: Box, col: string, L: Light, ink = true) =>
  paintBox(p, c, seed, b, lit(L, col), {top: -0.08, left: 0.12, right: 0.24, front: 0.04, back: 0.18}, {ink});

const stars = (p: Painter, horizon: number, seed: number) => {
  for (let i = 0; i < 70; i++) {
    const x = hash(seed + i) * 1080, y = hash(seed + i * 3.7) * (horizon - 120), r = 1.2 + 1.8 * hash(seed + i * 9.1);
    hardFill(p, seed + 10 + i, i % 7 ? '#c9d4f0' : '#fff2c8', cell({g: [x, y], u: 1, s: 1}, 0, 0, r, r, 6));
  }
};

/** Stilt house (เรือนใต้ถุนสูง): posts, floor y 2.4, plank room x -9..-3.2, open veranda x -3..-1, zinc gable roof, ladder, under-house slats. */
const houseItems = (L: Light, mode: VilMode): Item[] => {
  const items: Item[] = [];
  const posts: [number, number][] = [];
  for (const x of [-9, -7, -5, -3, -1]) for (const z of [-8, -4.5, -1]) posts.push([x, z]);
  posts.forEach(([x, z], i) => items.push({at: [x, 0, z], draw: (p, c) => pb(p, c, 9200 + i * 7, box(x - 0.09, x + 0.09, 0, 2.4, z - 0.09, z + 0.09), VC.woodDark, L, false)}));
  // under-house slat screens (back z -8, front z -1 with door and window openings, west x -9)
  const slats = (p: Painter, c: YCam, seed: number, pts: [number, number][], plane: 'z' | 'x', at: number) => {
    pts.forEach(([a, b], i) => {
      const q = plane === 'z' ? qz(at, a, b, 0.05, 2.3) : qx(at, 0.05, 2.3, a, b);
      wFill(p, c, seed + i * 2, lit(L, i % 2 ? VC.bamboo : mixColor(VC.bamboo, VC.wood, 0.3)), q);
    });
  };
  const run = (x0: number, x1: number, step = 0.16, skip: [number, number][] = []) => {
    const out: [number, number][] = [];
    for (let x = x0; x < x1; x += step) if (!skip.some(([s0, s1]) => x + 0.11 > s0 && x < s1)) out.push([x, x + 0.11]);
    return out;
  };
  items.push({at: [-5, 0, -8.2], bias: 2, draw: (p, c) => slats(p, c, 9400, run(-9, -1), 'z', -8)});
  items.push({at: [-9.1, 0, -4.5], draw: (p, c) => slats(p, c, 9600, run(-8, -1), 'x', -9)});
  items.push({at: [-5, 0, -1.1], bias: 0.3, draw: (p, c) => {
    slats(p, c, 9800, run(-9, -1, 0.16, [[-5.2, -4.4], [-2.8, -1.6]]), 'z', -1);
    // window opening x -2.8..-1.6 has slats only below 0.8 and above 1.6
    run(-2.8, -1.6).forEach(([a, b], i) => { wFill(p, c, 9900 + i * 2, lit(L, VC.bamboo), qz(-1, a, b, 0.05, 0.8)); wFill(p, c, 9901 + i * 2, lit(L, VC.bamboo), qz(-1, a, b, 1.6, 2.3)); });
    if (mode === 'night') { const q = wp(c, qz(-1.01, -5.2, -4.4, 0.05, 2.0)); if (q.length > 2) washAt(p, 9990, '#ffb85a', 90, q, 0.2, 0.2); }
  }});
  // floor beam + veranda deck + room + roof as one item (painted after the under-house)
  items.push({at: [-5, 2.4, -0.6], bias: -0.5, draw: (p, c) => {
    pb(p, c, 10000, box(-9.1, -0.9, 2.35, 2.55, -8.1, -0.9), VC.woodDark, L);
    pb(p, c, 10010, box(-9, -3.2, 2.55, 4.6, -8, -1), VC.wood, L);
    // plank lines on the visible faces
    for (let y = 2.75; y < 4.6; y += 0.22) { wInk(p, c, 10100 + Math.round(y * 50), [[-9, y, -0.99], [-3.2, y, -0.99]], {closed: false, weight: 0.45, color: lit(L, VC.woodDark)}); wInk(p, c, 10200 + Math.round(y * 50), [[-3.19, y, -8], [-3.19, y, -1]], {closed: false, weight: 0.45, color: lit(L, VC.woodDark)}); }
    // windows on the south wall: one lit (warm), one shuttered
    const lw = qz(-0.98, -5.4, -4.5, 3.1, 3.95);
    wFill(p, c, 10300, mode === 'night' ? VC.window : lit(L, '#3a2a22'), lw);
    wInk(p, c, 10301, lw, {color: lit(L, VC.woodDark), weight: 0.9});
    wFill(p, c, 10302, lit(L, VC.woodDark), qz(-0.98, -7.7, -6.9, 3.1, 3.95));
    // veranda railing on the south and east edges
    for (let x = -3; x <= -1; x += 0.5) pb(p, c, 10400 + Math.round(x * 10), box(x - 0.04, x + 0.04, 2.55, 3.25, -1.04, -0.96), VC.woodPale, L, false);
    pb(p, c, 10450, box(-3, -1, 3.2, 3.28, -1.05, -0.95), VC.woodPale, L, false);
    for (let z = -8; z <= -1; z += 0.6) if (z < -5.6 || z > -4.4) pb(p, c, 10460 + Math.round(-z * 10), box(-1.04, -0.96, 2.55, 3.25, z - 0.04, z + 0.04), VC.woodPale, L, false);
    pb(p, c, 10500, box(-1.05, -0.95, 3.2, 3.28, -8, -1), VC.woodPale, L, false);
    // zinc gable roof over the room (ridge along x at z -4.5) and a lean-to over the veranda
    const ridge = 6.1, eave = 4.45;
    const south = [[-9.6, eave, -0.3], [-2.7, eave, -0.3], [-2.7, ridge, -4.5], [-9.6, ridge, -4.5]] as V3[];
    const north = [[-9.6, eave, -8.7], [-2.7, eave, -8.7], [-2.7, ridge, -4.5], [-9.6, ridge, -4.5]] as V3[];
    wFill(p, c, 10600, lit(L, VC.zincDark), north);
    wFill(p, c, 10601, lit(L, VC.zinc), south);
    for (let x = -9.5; x < -2.7; x += 0.35) wInk(p, c, 10610 + Math.round(-x * 10), [[x, eave, -0.3], [x, ridge, -4.5]], {closed: false, weight: 0.4, color: lit(L, VC.zincDark)});
    wFill(p, c, 10700, lit(L, VC.woodPale, 0.08), [[-2.7, eave, -0.3], [-2.7, ridge, -4.5], [-2.7, eave, -8.7]]);
    const lean = [[-3.2, 4.35, -0.5], [-0.6, 3.8, -0.5], [-0.6, 3.8, -8.4], [-3.2, 4.35, -8.4]] as V3[];
    wFill(p, c, 10710, lit(L, VC.zinc, 0.05), lean);
    for (let z = -8.3; z < -0.5; z += 0.4) wInk(p, c, 10720 + Math.round(-z * 10), [[-3.2, 4.35, z], [-0.6, 3.8, z]], {closed: false, weight: 0.35, color: lit(L, VC.zincDark)});
  }});
  // ladder from the yard (0.6, 0, -5) to the veranda edge (-1, 2.4, -5)
  items.push({at: [0.4, 0, -5], bias: -0.2, draw: (p, c) => {
    for (const z of [-5.25, -4.75]) wFill(p, c, 10800 + (z < -5 ? 0 : 1), lit(L, VC.woodPale), [[0.62, 0, z - 0.04], [0.7, 0, z + 0.04], [-0.92, 2.5, z + 0.04], [-1.0, 2.5, z - 0.04]]);
    for (let i = 1; i < 7; i++) { const u = i / 7; wInk(p, c, 10810 + i, [[0.66 - 1.62 * u, 2.5 * u, -5.25], [0.66 - 1.62 * u, 2.5 * u, -4.75]], {closed: false, weight: 1.4, color: lit(L, VC.woodPale, 0.1)}); }
  }});
  return items;
};

const coopItems = (L: Light): Item[] => [{at: [4, 0, -5.3], draw: (p, c) => {
  pb(p, c, 11000, box(3, 5, 0, 1.3, -6, -4.6), VC.bamboo, L);
  for (let x = 3.1; x < 5; x += 0.14) wInk(p, c, 11010 + Math.round(x * 20), [[x, 0, -4.59], [x, 1.3, -4.59]], {closed: false, weight: 0.4, color: lit(L, '#6a5530')});
  wFill(p, c, 11100, lit(L, '#2a2018'), qz(-4.58, 3.7, 4.3, 0, 0.7));
  wFill(p, c, 11101, lit(L, VC.thatch, 0.05), [[2.8, 1.25, -4.4], [5.2, 1.25, -4.4], [5.2, 1.85, -5.3], [2.8, 1.85, -5.3]]);
  wFill(p, c, 11102, lit(L, mixColor(VC.thatch, VC.woodDark, 0.3)), [[5.2, 1.25, -4.4], [5.2, 1.85, -5.3], [5.2, 1.25, -6.2]]);
  for (let x = 2.9; x < 5.2; x += 0.12) wInk(p, c, 11110 + Math.round(x * 30), [[x, 1.25, -4.4], [x + 0.05, 1.85, -5.3]], {closed: false, weight: 0.35, color: lit(L, '#7a5a2a')});
}}];

const granaryItems = (L: Light): Item[] => [{at: [7.75, 0, -8.2], draw: (p, c) => {
  for (const [x, z] of [[6.6, -9.4], [8.9, -9.4], [6.6, -7.1], [8.9, -7.1]] as const) pb(p, c, 11200 + Math.round(x * 10 - z), box(x - 0.09, x + 0.09, 0, 0.6, z - 0.09, z + 0.09), VC.woodDark, L, false);
  pb(p, c, 11300, box(6.5, 9, 0.6, 2.6, -9.5, -7), VC.wood, L);
  for (let y = 0.8; y < 2.6; y += 0.2) wInk(p, c, 11310 + Math.round(y * 50), [[6.5, y, -6.99], [9, y, -6.99]], {closed: false, weight: 0.4, color: lit(L, VC.woodDark)});
  wFill(p, c, 11400, lit(L, VC.woodDark, 0.1), qz(-6.98, 7.4, 8.1, 0.6, 2.0));
  wFill(p, c, 11401, lit(L, VC.zinc), [[6.2, 2.55, -6.6], [9.3, 2.55, -6.6], [9.3, 3.9, -8.25], [6.2, 3.9, -8.25]]);
  wFill(p, c, 11402, lit(L, VC.woodPale, 0.1), [[9.3, 2.55, -6.6], [9.3, 3.9, -8.25], [9.3, 2.55, -9.9]]);
}}];

/** Fence 1.2 m along z -12 (gate gap x 1.4..2.8, gate panel swung open) and x -14 and x 11. */
const fenceItems = (L: Light): Item[] => {
  const items: Item[] = [];
  const post = (x: number, z: number, i: number) => items.push({at: [x, 0, z], draw: (p, c) => pb(p, c, 12000 + i * 5, box(x - 0.06, x + 0.06, 0, 1.2, z - 0.06, z + 0.06), VC.woodDark, L, false)});
  let i = 0;
  for (let x = -14; x <= 11; x += 1.5) if (x < 1.3 || x > 2.9) post(x, -12, i++);
  for (let z = -10.5; z <= 6; z += 1.5) post(-14, z, i++);
  const rails = (seg: [V3, V3][]) => items.push({at: [(seg[0][0][0] + seg[0][1][0]) / 2, 0, (seg[0][0][2] + seg[0][1][2]) / 2], bias: 0.1, draw: (p, c) => seg.forEach(([a, b], j) => [0.45, 1.05].forEach((y, k) => wFill(p, c, 12500 + j * 4 + k + Math.round(a[0] * 7), lit(L, VC.woodPale, 0.05), [[a[0], y, a[2]], [b[0], y, b[2]], [b[0], y + 0.08, b[2]], [a[0], y + 0.08, a[2]]])))});
  rails([[[-14, 0, -12], [1.4, 0, -12]]]);
  rails([[[2.8, 0, -12], [12, 0, -12]]]);
  rails([[[-14, 0, -12], [-14, 0, 6]]]);
  // gate panel open, swung outward to the north-east
  items.push({at: [3.0, 0, -12.6], draw: (p, c) => { for (const y of [0.3, 0.75]) wFill(p, c, 12700 + y * 10, lit(L, VC.woodPale), [[2.8, y, -12], [3.4, y, -13.2], [3.4, y + 0.09, -13.2], [2.8, y + 0.09, -12]]); wFill(p, c, 12720, lit(L, VC.woodPale), [[3.35, 0.2, -13.1], [3.45, 0.2, -13.3], [3.45, 1.1, -13.3], [3.35, 1.1, -13.1]]); }});
  return items;
};

/** Lived-in yard props (UT12): water jars by the ladder, a rice-straw stack, a woodpile under the house, a clothesline with a pha khao ma. */
const propItems = (L: Light, mode: VilMode): Item[] => {
  const jar = (at: V3, s: number, seed: number): Item => ({at, draw: (p, c) => {
    const k = cardAt(c, at); if (!k) return;
    hardFill(p, seed, lit(L, VC.jar), cell(k, 0, 0.42 * s, 0.36 * s, 0.42 * s, 18));
    hardFill(p, seed + 1, lit(L, mixColor(VC.jar, '#2a1a10', 0.35)), cell(k, 0.08 * s, 0.38 * s, 0.24 * s, 0.36 * s, 14));
    hardFill(p, seed + 2, lit(L, '#3a2418'), cell(k, 0, 0.82 * s, 0.22 * s, 0.05 * s, 12));
    inkLine(p, seed + 3, cell(k, 0, 0.42 * s, 0.36 * s, 0.42 * s, 18), {weight: 0.6, color: lit(L, VC.ink), still: true});
  }});
  const straw = (at: V3, seed: number, sc = 1): Item => ({at, draw: (p, c) => {
    const k = cardAt(c, at, 1, sc); if (!k) return;
    hardFill(p, seed, lit(L, VC.straw), cps(k, [[-1.3, 0], [1.3, 0], [1.1, 0.9], [0.5, 1.6], [-0.5, 1.6], [-1.1, 0.9]]));
    for (let i = 0; i < 14; i++) inkLine(p, seed + 1 + i, cps(k, [[-1.2 + i * 0.18, 0.05], [-1.0 + i * 0.15, 0.9 + 0.5 * hash(seed + i)]]), {closed: false, weight: 0.35, color: lit(L, '#9a7a3a'), still: true});
  }});
  const items: Item[] = [jar([1.3, 0, -3.6], 1, 13000), jar([1.95, 0, -3.3], 0.8, 13010), straw([-11.6, 0, -5.5], 13100, 0.8)];
  // foreground: a bamboo clump at the near left (dark, low contrast, UT12a), a puddle that mirrors the sky, the cold fire pit F1, cart ruts
  const bamboo = (at: V3, seed: number): Item => ({at, draw: (p, c) => {
    const k = cardAt(c, at); if (!k) return;
    for (let i = 0; i < 9; i++) {
      const x = -0.5 + i * 0.12, lean = (i - 4) * 0.35, h = 6 + 2.5 * hash(seed + i);
      hardFill(p, seed + i * 3, lit(L, i % 2 ? '#5d7a3a' : '#4a6a30', 0.12), cps(k, [[x - 0.04, 0], [x + 0.04, 0], [x + lean + 0.025, h], [x + lean - 0.025, h]]));
      for (let j = 1; j < 6; j++) { const u = j / 6; inkLine(p, seed + i * 3 + 1 + j * 20, cps(k, [[x + lean * u - 0.05, h * u], [x + lean * u + 0.05, h * u]]), {closed: false, weight: 0.5, color: lit(L, '#2f4020', 0.1), still: true}); }
      for (let j = 0; j < 4; j++) { const u = 0.45 + j * 0.15, bx = x + lean * u, by = h * u, sd = (i + j) % 2 ? 1 : -1;
        hardFill(p, seed + 200 + i * 9 + j, lit(L, '#557a34', 0.15), cps(k, [[bx, by], [bx + sd * 0.9, by + 0.25], [bx + sd * 1.3, by - 0.1], [bx + sd * 0.7, by - 0.05]])); }
    }
  }});
  const puddle = (at: V3, rx: number, rz: number, seed: number): Item => ({at, bias: 3, draw: (p, c) => {
    const ring = (s: number) => Array.from({length: 24}, (_, i): V3 => { const a = (i / 24) * Math.PI * 2; return [at[0] + rx * s * Math.cos(a), 0.01, at[2] + rz * s * Math.sin(a) * (1 + 0.15 * Math.sin(3 * a))]; });
    const q = wp(c, ring(1));
    if (q.length < 3) return;
    hardFill(p, seed, mode === 'night' ? '#2c3a66' : '#bcd0cc', q);
    if (mode === 'night') for (let i = 1; i < 4; i++) { const r = wp(c, ring(0.25 * i)); if (r.length > 2) inkLine(p, seed + i, r, {weight: 0.6, color: '#8fa8ee', still: true}); }
    inkLine(p, seed + 9, q, {weight: 0.5, color: lit(L, VC.dirtDark), still: true});
  }});
  items.push(bamboo([5.6, 0, 9.9], 13500));
  if (mode === 'night') items.push(puddle([5.4, 0, 5.0], 1.4, 0.7, 13600));
  // yard bench (แคร่) and log seats by the fire pit, a hen trough by the coop
  items.push({at: [1.6, 0, 1.4], draw: (p, c) => {
    for (const [x, z] of [[0.7, 0.9], [2.5, 0.9], [0.7, 1.9], [2.5, 1.9]] as const) pb(p, c, 13800 + Math.round(x * 10 + z), box(x - 0.05, x + 0.05, 0, 0.45, z - 0.05, z + 0.05), VC.woodDark, L, false);
    pb(p, c, 13820, box(0.6, 2.6, 0.45, 0.52, 0.8, 2.0), VC.bamboo, L);
    for (let x = 0.7; x < 2.6; x += 0.12) wInk(p, c, 13830 + Math.round(x * 30), [[x, 0.525, 0.8], [x, 0.525, 2.0]], {closed: false, weight: 0.35, color: lit(L, '#7a6430')});
  }});
  for (const [i, [x, z, a]] of ([[-2.1, 1.1, 0.3], [0.1, 2.3, -0.4], [-1.4, 2.8, 1.2]] as const).entries()) items.push({at: [x, 0, z], draw: (p, c) => {
    const dx = Math.cos(a) * 0.6, dz = Math.sin(a) * 0.6;
    pb(p, c, 13900 + i * 5, box(x - Math.abs(dx) - 0.12, x + Math.abs(dx) + 0.12, 0, 0.26, z - Math.abs(dz) - 0.12, z + Math.abs(dz) + 0.12), VC.woodPale, L);
  }});
  // buffalo cart (เกวียน) resting on its shafts by the granary: two spoked wheels (1.4 m), a slatted bed
  items.push({at: [8.4, 0, -2.2], draw: (p, c) => {
    const wheel = (z: number, id: number) => {
      const R = 0.7, cx = 8.4, cy = 0.7, rim = (r: number): V3[] => Array.from({length: 28}, (_, j) => [cx + r * Math.cos(j / 28 * 6.283), cy + r * Math.sin(j / 28 * 6.283), z]);
      const o = wp(c, rim(R)), inn = wp(c, rim(R - 0.09));
      if (o.length > 2) hardFill(p, id, lit(L, VC.woodDark), o);
      if (inn.length > 2) hardFill(p, id + 1, lit(L, mixColor(VC.dirt, VC.dirtDark, 0.4)), inn);
      for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI; wFill(p, c, id + 2 + j, lit(L, VC.wood), [[cx + R * Math.cos(a) - 0.03, cy + R * Math.sin(a), z], [cx - R * Math.cos(a) - 0.03, cy - R * Math.sin(a), z], [cx - R * Math.cos(a) + 0.03, cy - R * Math.sin(a), z], [cx + R * Math.cos(a) + 0.03, cy + R * Math.sin(a), z]]); }
      const hub = wp(c, rim(0.13)); if (hub.length > 2) hardFill(p, id + 12, lit(L, VC.woodDark, 0.1), hub);
    };
    wheel(-2.85, 13960);
    pb(p, c, 13980, box(7.0, 9.8, 0.75, 0.95, -2.8, -1.6), VC.wood, L);
    for (let x = 7.1; x < 9.8; x += 0.3) pb(p, c, 13985 + Math.round(x * 10), box(x, x + 0.06, 0.95, 1.35, -2.8, -2.74), VC.woodPale, L, false);
    wFill(p, c, 13999, lit(L, VC.woodDark), [[7.0, 0.85, -2.5], [4.6, 0.02, -2.4], [4.6, 0.1, -2.3], [7.0, 0.93, -2.4]]);
    wheel(-1.55, 13970);
  }});
  items.push({at: [3.6, 0, -4.1], draw: (p, c) => pb(p, c, 13950, box(3.2, 4.4, 0, 0.18, -4.25, -3.95), '#7a7468', L)});
  items.push({at: [-1, 0, 1.5], draw: (p, c) => {
    const ash = wp(c, Array.from({length: 16}, (_, i): V3 => [-1 + 0.45 * Math.cos(i / 16 * 6.283), 0.01, 1.5 + 0.45 * Math.sin(i / 16 * 6.283)]));
    if (ash.length > 2) hardFill(p, 13700, lit(L, '#4a4440'), ash);
    for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283, k = cardAt(c, [-1 + 0.55 * Math.cos(a), 0, 1.5 + 0.55 * Math.sin(a)]); if (k) hardFill(p, 13710 + i, lit(L, '#8a8478'), cell(k, 0, 0.06, 0.11, 0.07, 9)); }
  }});
  items.push({at: [-8.9, 0, -6.9], draw: (p, c) => {
    pb(p, c, 13200, box(-9.5, -8.3, 0, 1.3, -7.5, -6.3), VC.woodDark, L);
    for (let i = 0; i < 12; i++) { const k = cardAt(c, [-8.9 + 0.5 * (hash(i + 1) - 0.5), 0.1 + 1.05 * hash(i + 7), -6.29]); if (k) hardFill(p, 13210 + i, lit(L, VC.woodPale, -0.05), cell(k, 0, 0, 0.09, 0.09, 8)); }
  }});
  items.push({at: [-0.2, 0, 0.6], draw: (p, c) => {
    const a: V3 = [-1, 1.85, -0.95], b: V3 = [3.0, 1.85, 1.2];
    const pa = camPoint(c, a), pbp = camPoint(c, b); if (!pa || !pbp) return;
    inkLine(p, 13300, [pa, [(pa[0] + pbp[0]) / 2, (pa[1] + pbp[1]) / 2 + 6], pbp], {closed: false, weight: 0.5, color: lit(L, '#5a4a3a'), still: true});
    pb(p, c, 13301, box(2.95, 3.05, 0, 1.9, 1.15, 1.25), VC.woodDark, L, false);
    const cloth = [[0.6, 1.83, 0.04], [1.6, 1.83, 0.58], [1.6, 1.05, 0.58], [0.6, 1.05, 0.04]] as V3[];
    wFill(p, c, 13310, lit(L, VC.cloth), cloth);
    for (let j = 0; j < 4; j++) { const u = (j + 0.5) / 4; wFill(p, c, 13320 + j, lit(L, '#e8dccb'), [[0.6 + u, 1.83, 0.04 + 0.54 * u], [0.68 + u, 1.83, 0.083 + 0.54 * u], [0.68 + u, 1.05, 0.083 + 0.54 * u], [0.6 + u, 1.05, 0.04 + 0.54 * u]]); }
    void mode;
  }});
  return items;
};

/** Ground: yard dirt to the fence, paddy east (x 12..30, z -4..4) with bunds, forest floor beyond the fence. */
const paintGround = (p: Painter, c: YCam, L: Light) => {
  wFill(p, c, 14000, lit(L, '#55683e', 0.05), qy(0, -80, 80, -80, -12));
  wFill(p, c, 14001, lit(L, VC.dirt), qy(0, -40, 40, -12, 40));
  // worn paths and patches
  wFill(p, c, 14002, lit(L, VC.dirtDark), [[0.2, 0, -4.4], [1.6, 0, -4.6], [2.9, 0, -11.9], [1.6, 0, -11.9]]);
  for (let i = 0; i < 18; i++) {
    const x = -12 + 22 * hash(14100 + i), z = -11 + 18 * hash(14200 + i), q = wp(c, [[x, 0, z], [x + 1.6, 0, z + 0.2], [x + 1.4, 0, z + 0.9], [x - 0.2, 0, z + 0.7]]);
    if (q.length > 2) washAt(p, 14300 + i, lit(L, i % 2 ? VC.dirtDark : '#c8b088'), 80, q, 0.2, 0.3);
  }
  for (const dx of [0, 1.3]) wInk(p, c, 14090 + dx * 10, [[9.6 - dx, 0.01, 11], [6.5 - dx, 0.01, 2], [2.6 - dx, 0.01, -11.5]], {closed: false, weight: 1.1, color: lit(L, '#7a6646')});
  // flooded empty paddy (VD-S01 W3 proposal): x 12..30, z -8..8, water mirrors the sky; bunds every 6 m (x) and 4 m (z)
  const night = L.k > 0.4;
  const water = wp(c, qy(0.01, 12, 30, -8, 8));
  if (water.length > 2) {
    hardFill(p, 14400, night ? '#1a2548' : '#c4d6cf', water);
    const hz = c.hy;
    if (night) for (let i = 0; i < 6; i++) {
      const y0 = hz + 60 + i * 140, band = [[0, y0], [1080, y0], [1080, y0 + 140], [0, y0 + 140]] as Pt[];
      washAt(p, 14401 + i, mixColor('#2e3d6e', '#141c38', i / 6), 90, band.map(([x, y]) => [x, Math.max(y, water.reduce((m, q) => Math.min(m, q[1]), 9999))] as Pt), 0.1, 0.1);
    }
  }
  if (water.length > 2 && night) {
    // reflections: the moon and the lit window as soft vertical streaks on the water
    const streak = (x: number, y: number, w: number, h: number, col: string, op: number, id: number) => washAt(p, id, col, op, [[x - w, y], [x + w, y], [x + w * 0.4, y + h], [x - w * 0.4, y + h]], 0.4, 0.3);
    const win = camPoint(c, [-4.95, -3.5, -0.9]);
    if (win) streak(win[0], c.hy + 70, 10, 120, '#ffb85a', 70, 14390);
    streak(170, c.hy + 120, 14, 260, '#c9d4f0', 45, 14391);
  }
  const bundCol = lit(L, '#6a5638', 0.0);
  for (let x = 12; x <= 30; x += 6) { wFill(p, c, 14410 + x, bundCol, [[x - 0.15, 0.12, -8], [x + 0.15, 0.12, -8], [x + 0.15, 0.12, 8], [x - 0.15, 0.12, 8]]); wFill(p, c, 14430 + x, lit(L, '#4a3c28'), [[x + 0.15, 0.12, -8], [x + 0.2, 0.01, -8], [x + 0.2, 0.01, 8], [x + 0.15, 0.12, 8]]); }
  for (let z = -8; z <= 8; z += 4) { wFill(p, c, 14450 + z, bundCol, qy(0.12, 12, 30, z - 0.15, z + 0.15)); wFill(p, c, 14470 + z, lit(L, '#4a3c28'), [[12, 0.12, z + 0.15], [30, 0.12, z + 0.15], [30, 0.01, z + 0.2], [12, 0.01, z + 0.2]]); }
  for (let i = 0; i < 40; i++) {
    const onX = i % 2 === 0, x = onX ? 12 + 6 * Math.floor(hash(14500 + i) * 4) : 12 + 18 * hash(14600 + i), z = onX ? -8 + 16 * hash(14700 + i) : -8 + 4 * Math.floor(hash(14800 + i) * 5);
    const k = cardAt(c, [x, 0.12, z]); if (!k || k.u < 6) continue;
    hardFill(p, 14900 + i, lit(L, '#6f8a3e', 0.08), cps(k, [[-0.15, 0], [-0.1, 0.25], [-0.03, 0.08], [0, 0.32], [0.04, 0.08], [0.11, 0.22], [0.15, 0]]));
  }
};

/** East-yard work corner (R1.1, user note on LF16-VIL-MORN 14 Nov 2026, UT03: the near ground carries story): between the cart and the paddy edge.
 * Two log seats (10.1, 1.1) and (10.55, 0.3); a hoe lying at (11.2, -0.3) (rice work, B04); a bamboo hen cover (sum kai) with a hen inside at (7.7, -0.7)
 * (the hens, B06); a stack of split firewood by the cart at (10.1, -2.6) with three bamboo poles leaning on it (the woodpile theme of EP17). */
const workItems = (L: Light, mode: VilMode): Item[] => {
  const log = (a: V3, b: V3, r: number, seed: number): Item => ({at: [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2], draw: (p, c) => {
    const pa = camPoint(c, [a[0], r, a[2]]), pb2 = camPoint(c, [b[0], r, b[2]]), ka = cardAt(c, a), kb = cardAt(c, b); if (!pa || !pb2 || !ka || !kb) return;
    hardFill(p, seed, lit(L, '#6e5038'), strip([pa, pb2], [r * ka.u, r * kb.u]));
    hardFill(p, seed + 1, lit(L, '#4e3826'), strip([[pa[0], pa[1] + 0.45 * r * ka.u], [pb2[0], pb2[1] + 0.45 * r * kb.u]], [0.4 * r * ka.u, 0.4 * r * kb.u]));
    for (let i = 1; i < 5; i++) { const u = i / 5; inkLine(p, seed + 2 + i, [[pa[0] + (pb2[0] - pa[0]) * u, pa[1] + (pb2[1] - pa[1]) * u - 0.6 * r * ka.u], [pa[0] + (pb2[0] - pa[0]) * (u + 0.08), pa[1] + (pb2[1] - pa[1]) * (u + 0.08) - 0.3 * r * ka.u]], {closed: false, weight: 0.5, color: lit(L, '#3a2a1c'), still: true}); }
    const near = ka.u > kb.u ? {q: pa, k: ka} : {q: pb2, k: kb};
    hardFill(p, seed + 10, lit(L, '#c9a678'), cell({g: near.q, u: near.k.u, s: 1}, 0, 0, r * 0.55, r * 0.95, 14));
    inkLine(p, seed + 11, cell({g: near.q, u: near.k.u, s: 1}, 0, 0, r * 0.32, r * 0.55, 12), {weight: 0.5, color: lit(L, '#8a6a44'), still: true});
    washAt(p, seed + 12, '#3b3226', 60, strip([[pa[0], pa[1] + r * ka.u], [pb2[0], pb2[1] + r * kb.u]], [0.25 * r * ka.u, 0.25 * r * kb.u]), 0.3, 0.2);
  }});
  const items: Item[] = [log([9.55, 0, 1.45], [10.6, 0, 0.75], 0.17, 13400), log([10.1, 0, 0.55], [11.0, 0, 0.05], 0.15, 13420)];
  // hoe (jop) lying on the ground: handle 1.3 m, iron blade at the far end
  items.push({at: [11.2, 0, -0.3], draw: (p, c) => {
    const h0 = camPoint(c, [11.75, 0.03, 0.15]), h1 = camPoint(c, [10.75, 0.03, -0.7]); const k = cardAt(c, [10.7, 0, -0.75]); if (!h0 || !h1 || !k) return;
    hardFill(p, 13440, lit(L, '#b08a5a'), strip([h0, h1], [0.022 * k.u * 1.4, 0.02 * k.u]));
    hardFill(p, 13441, lit(L, '#5a5e60'), [[h1[0] - 0.12 * k.u, h1[1] - 0.01 * k.u], [h1[0] + 0.08 * k.u, h1[1] - 0.03 * k.u], [h1[0] + 0.1 * k.u, h1[1] + 0.04 * k.u], [h1[0] - 0.1 * k.u, h1[1] + 0.05 * k.u]]);
  }});
  // bamboo hen cover with a hen inside (the slats are painted over the hen)
  const HC: V3 = [7.7, 0, -0.7];
  items.push({at: HC, draw: (p, c) => {
    const k = cardAt(c, HC); if (!k) return;
    hardFill(p, 13500, lit(L, '#3a2e22', 0.1), cell(k, 0, 0.0, 0.4, 0.06, 16));
    paintHen(p, c, [HC[0], 0, HC[2]], {view: 'right', tilt: 8}, L, 16900, {shadow: false});
    const shell: [number, number][] = [[-0.38, 0], [-0.3, 0.32], [-0.14, 0.52], [-0.06, 0.58], [0.06, 0.58], [0.14, 0.52], [0.3, 0.32], [0.38, 0]];
    for (let i = 0; i <= 12; i++) { const x = -0.38 + i * (0.76 / 12), top = 0.58 - 1.6 * (x * x) * 1.1; inkLine(p, 13510 + i, cps(k, [[x, 0], [x * 0.25, Math.max(0.3, top)], [x * 0.12, 0.58]]), {closed: false, weight: 1.1, color: lit(L, '#c7ad72'), still: true, curve: 0.6}); }
    for (const [i, y] of [[0, 0.04], [1, 0.22], [2, 0.42]] as const) inkLine(p, 13530 + i, cps(k, shell.filter(([, yy]) => yy <= y + 0.2).map(([x, yy]) => [x * (1 - y * 0.75), Math.min(yy, y)] as [number, number])), {closed: false, weight: 1.4, color: lit(L, '#a88a52'), still: true});
    hardFill(p, 13535, lit(L, '#a88a52'), cell(k, 0, 0.6, 0.07, 0.03, 10));
  }});
  // split firewood stack (end grain toward the lens) by the cart, with three bamboo poles leaning on it
  const FW: V3 = [10.1, 0, -2.6];
  items.push({at: FW, draw: (p, c) => {
    const k = cardAt(c, FW); if (!k) return;
    hardFill(p, 13550, lit(L, '#4a3828'), cps(k, [[-0.6, 0], [0.6, 0], [0.58, 0.66], [-0.58, 0.66]]));
    for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { const x = -0.5 + i * 0.165 + (r % 2) * 0.06, y = 0.09 + r * 0.16; if (x > 0.55) continue; hardFill(p, 13560 + r * 10 + i, lit(L, i % 3 ? '#c9a678' : '#b58e5e'), cell(k, x, y, 0.07, 0.07, 7, i)); }
    for (let i = 0; i < 3; i++) { const a2 = camPoint(c, [FW[0] - 0.4 + i * 0.25, 0, FW[2] + 0.5]), b2 = camPoint(c, [FW[0] - 0.7 + i * 0.3, 2.4, FW[2] - 0.2]); if (a2 && b2) hardFill(p, 13600 + i, lit(L, i % 2 ? '#c7ad72' : '#a8904e'), strip([a2, b2], [0.03 * k.u, 0.025 * k.u])); }
    void mode;
  }});
  return items;
};

export type VilOpts = {mode: VilMode; t: number; light?: Light; skip?: {forest?: boolean; fence?: boolean}; ripple?: {speed: number; glow: number}; extra?: Item[]; /** N16-04 R2: the full granary (doors, ladder, heap) instead of the plain look-frame block */ granary?: GranaryOpts; /** N16-20: paint this sky (e.g. paintSkyCycle) instead of the fixed day/night sky; pass its Light as `light` */ sky?: (p: Painter, c: YCam) => void};
/** The whole village plate seen through `c`. */
export const paintVillage = (p: Painter, c: YCam, o: VilOpts) => {
  const L = o.light ?? LIGHT[o.mode], night = o.mode === 'night';
  if (o.sky) o.sky(p, c);
  else {
    paintSkyBands(p, night
      ? {from: '#0f1530', via: '#1d2a52', to: '#3a4a74', horizon: c.hy + 40, width: 1080, viaAt: 0.5, bands: 10, style: 'flat'}
      : {from: '#a9c4c8', via: '#cfdcc4', to: '#e8e6c8', horizon: c.hy + 40, width: 1080, viaAt: 0.55, bands: 10, style: 'flat'});
    if (night) { stars(p, c.hy, 9000); paintSkyDisc(p, {x: 170, y: 330, r: 26, color: '#f2ecd8', glow: 0.5, glowColor: '#9fb0d8'}); }
  }
  if (o.ripple) paintSkyRipple(p, {cx: 600, cy: 420, t: o.t, speed: o.ripple.speed, glow: o.ripple.glow});
  // far forest conifers beyond the fence (sorted far to near), haze between layers
  const fi = forestItems(-15, -40, 40, 777);
  paintGround(p, c, L);
  if (night && o.ripple) {
    // dim mirror of the sky ripple in the paddy water, broken by the bunds (kept low for the caption band)
    const cy = 2 * c.hy - 420 - 40;
    for (let i = 1; i < 6; i++) { const r = ((o.t * o.ripple.speed * 60) % 95) + i * 95; inkLine(p, 9300 + i, Array.from({length: 40}, (_, j): Pt => [600 + r * Math.cos(j / 40 * 6.283), cy + r * 0.22 * Math.sin(j / 40 * 6.283)]), {weight: 0.5, color: '#4a5f9a', still: true, curve: 0.3}); }
  }
  const haze = night ? '#2a3658' : '#dfe8d4';
  const far = fi.filter((f) => f.kind === 'conifer').map((f): Item => ({at: f.at, draw: (q, cc) => paintConifer(q, cc, f.at, f.h, L, f.seed, {haze: Math.min(0.6, Math.max(0, (-f.at[2] - 18) / 30)), hazeCol: haze})}));
  paintSorted(p, c, far);
  if (!night) paintFogBank(p, {y: c.hy - 60, height: 240, width: 1080, color: '#e6eedc', density: 0.7, t: o.t, puffs: 7, seed: 7310});
  else paintFogBank(p, {y: c.hy - 20, height: 160, width: 1080, color: '#33416a', density: 0.6, t: o.t, puffs: 6, seed: 7320});
  const near: Item[] = fi.filter((f) => f.kind !== 'conifer').map((f) => ({at: f.at, draw: (q, cc) => {
    if (f.kind === 'fern') paintTreeFern(q, cc, f.at, f.h, L, f.seed);
    else if (f.kind === 'cycad') paintCycad(q, cc, f.at, f.h, L, f.seed);
    else paintFernClump(q, cc, f.at, f.h, L, f.seed);
  }}));
  paintSorted(p, c, [...near, ...(o.skip?.fence ? [] : fenceItems(L)), ...houseItems(L, o.mode), ...coopItems(L), ...(o.granary ? granaryExterior(L, o.granary) : granaryItems(L)), ...propItems(L, o.mode), ...workItems(L, o.mode), ...(o.extra ?? [])]);
  if (night) {
    // warm window glow spilling onto the yard (one light source in a cool world)
    const w = camPoint(c, [-4.95, 3.5, -0.9]);
    if (w) paintHalo(p, {x: w[0], y: w[1], r: 46, color: '#ffb85a', level: 0.7, squash: 0.8, seed: 7450});
    const pool = wp(c, [[-6.5, 0, -0.5], [-3.5, 0, -0.5], [-2.5, 0, 2.5], [-7.5, 0, 2.5]]);
    if (pool.length > 2) washAt(p, 14600, '#ffb060', 40, pool, 0.6, 0.2);
  }
};

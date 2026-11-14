import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {paintHalo} from '../kit/fog';
import {hull, paintBox, paintSorted, qx, qy, qz, wFill, wInk, wp, type Box, type Item} from '../kit/world';
import {camPoint, camUnit} from '../kit/ycam';
import {cardAt, cell, cps, lit, type Light, type Painter, type Pt, type V3, type YCam} from './core';
import {VC} from './village';

// SET-UNDER at night (EP18 VD18-01; set plan "Under the house (UNDER)" in the EP16 brief): the open kitchen-living space under the stilt house,
// one oil lamp on the bamboo platform, the kitchen shelf with the sugar and salt jars (K02) on the back slats, the floor of the house overhead.
// W3 change: the interior post row moves from z -4.5 to z -5.6 so no post passes through the platform (x -5.6..-3.6, z -5.1..-3.7).

export const NIGHT_IN: Light = {amb: '#1c2238', k: 0.5};
export const LAMP: V3 = [-3.72, 0.62, -5.0];   // R1.1: back-right corner of the platform, clear of K's feet in shot 4
export const UC = {mat: '#c9a866', matLine: '#9a7a40', glass: '#cfe0e4', sugar: '#efe6d0', salt: '#f8f8f4', lid: '#c23a2a', lidSalt: '#2f6fb8', clay: '#8a4a2c', steel: '#b8bcc0', plastic: '#d9ecef'} as const;

const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Box => ({x0, x1, y0, y1, z0, z1});
/** Warmth of a point from the lamp (0..1), falls off over about 2.5 m. */
export const lampK = (v: V3) => Math.max(0, 1 - Math.hypot(v[0] - LAMP[0], v[1] - LAMP[1], v[2] - LAMP[2]) / 2.6);
const warm = (col: string, v: V3, L: Light, s = 1) => mixColor(lit(L, col, -0.42 * lampK(v) * s), '#ffb060', 0.22 * lampK(v) * s);
const pbw = (p: Painter, c: YCam, seed: number, b: Box, col: string, L: Light, ink = true) => {
  const mid: V3 = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2];
  paintBox(p, c, seed, b, warm(col, mid, L), {top: -0.1, left: 0.1, right: 0.2, front: 0.04, back: 0.16}, {ink});
};

/** A vertical cylinder (jar, bottle, cup) from rings, filled as one hull; returns the top ring. */
export const cylinder = (p: Painter, c: YCam, seed: number, at: V3, r: number, h: number, col: string, o: {top?: string; ink?: string; taper?: number} = {}) => {
  const ring = (y: number, rr: number) => Array.from({length: 20}, (_, i): V3 => [at[0] + rr * Math.cos(i / 20 * 6.283), at[1] + y, at[2] + rr * Math.sin(i / 20 * 6.283)]);
  const body = [...ring(0, r), ...ring(h, r * (o.taper ?? 1))].map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  if (body.length < 6) return null;
  const hl = hull(body);
  hardFill(p, seed, col, hl);
  const top = ring(h, r * (o.taper ?? 1)).map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  if (o.top) hardFill(p, seed + 1, o.top, top);
  if (o.ink) inkLine(p, seed + 2, hl, {weight: 0.6, color: o.ink, still: true});
  return top;
};

/** The under-house kitchen-living space (no cast): back slats, shelf and jars, platform with mat, lamp, joists, kitchen props. */
export const paintUnder = (p: Painter, c: YCam, o: {t: number; extra?: Item[]; jarLight?: number}) => {
  const L = NIGHT_IN;
  hardFill(p, 20000, '#151a2a', [[-200, -200], [1280, -200], [1280, 2120], [-200, 2120]]);
  // packed-earth floor, the house floor overhead with joists
  wFill(p, c, 20001, warm('#7a6448', [-4.4, 0, -4.4], L, 0.6), qy(0, -9.2, -0.8, -8.2, -0.8));
  for (let i = 0; i < 10; i++) { const x = -8.5 + 7.5 * hash(20010 + i), z = -7.8 + 6.5 * hash(20020 + i), q = wp(c, [[x, 0.005, z], [x + 0.9, 0.005, z + 0.1], [x + 0.7, 0.005, z + 0.5], [x - 0.1, 0.005, z + 0.4]]); if (q.length > 2) washAt(p, 20030 + i, warm('#5e4a34', [x, 0, z], L, 0.6), 90, q, 0.2, 0.3); }
  wFill(p, c, 20040, warm(VC.woodDark, [-4.4, 2.35, -4.4], L, 0.5), qy(2.35, -9.2, -0.8, -8.2, -0.8));
  for (let z = -8; z <= -1; z += 0.55) paintBox(p, c, 20050 + Math.round(-z * 10), box(-9.1, -0.9, 2.18, 2.35, z - 0.05, z + 0.05), warm(VC.wood, [-4.4, 2.2, z], L, 0.6), {bottom: 0.12}, {ink: false});
  // back slat wall (z -8): bamboo slats with dark gaps (night outside)
  wFill(p, c, 20100, '#0e1220', qz(-8.02, -9.2, -0.8, 0, 2.35));
  for (let x = -9; x < -0.9; x += 0.16) wFill(p, c, 20110 + Math.round(-x * 10), warm(Math.round(x * 6) % 2 ? VC.bamboo : mixColor(VC.bamboo, VC.wood, 0.3), [x, 1.1, -8], L, 0.9), qz(-8, x, x + 0.12, 0.03, 2.3));
  // west slat wall (x -9)
  for (let z = -8; z < -1; z += 0.16) wFill(p, c, 20200 + Math.round(-z * 10), warm(VC.bamboo, [-9, 1.1, z], L, 0.7), qx(-9, 0.03, 2.3, z, z + 0.12));
  const items: Item[] = [];
  // posts (the interior row at z -5.6)
  for (const x of [-9, -7, -5, -3, -1]) for (const z of [-8, -5.6, -1]) items.push({at: [x, 0, z], draw: (q, cc) => pbw(q, cc, 20300 + Math.round(x * 10 - z * 3), box(x - 0.09, x + 0.09, 0, 2.35, z - 0.09, z + 0.09), VC.woodDark, L, false)});
  // kitchen shelf: board on two brackets, the jars and kitchen things
  items.push({at: [-4.4, 1.1, -7.85], bias: 0.1, draw: (q, cc) => {
    pbw(q, cc, 20400, box(-5.3, -3.5, 1.06, 1.1, -7.98, -7.68), VC.woodPale, L);
    pbw(q, cc, 20401, box(-5.2, -5.16, 0.85, 1.06, -7.98, -7.75), VC.woodDark, L, false);
    pbw(q, cc, 20402, box(-3.64, -3.6, 0.85, 1.06, -7.98, -7.75), VC.woodDark, L, false);
    const jl = o.jarLight ?? 0;
    const jar = (x: number, fill: string, lid: string, id: number) => {
      const at: V3 = [x, 1.1, -7.83];
      cylinder(q, cc, id, at, 0.065, 0.16, mixColor(warm(UC.glass, at, L), '#fff4dc', 0.5 * jl), {ink: warm('#3a4048', at, L)});
      cylinder(q, cc, id + 3, at, 0.06, 0.11, mixColor(warm(fill, at, L), '#fffaf0', 0.6 * jl));
      cylinder(q, cc, id + 6, [x, 1.26, -7.83], 0.068, 0.03, mixColor(warm(lid, at, L, 0.6), lid, 0.6 * jl), {top: mixColor(warm(lid, at, L, 0.6), '#ffffff', 0.15)});
    };
    jar(-4.6, UC.sugar, UC.lid, 20410);
    jar(-4.25, UC.salt, UC.lidSalt, 20420);
    // fish-sauce bottle, stacked enamel plates, a mortar with pestle, a sticky-rice basket
    cylinder(q, cc, 20430, [-3.85, 1.1, -7.82], 0.035, 0.24, warm('#6a3a1a', [-3.85, 1.2, -7.82], L), {taper: 0.45});
    cylinder(q, cc, 20435, [-5.0, 1.1, -7.83], 0.11, 0.07, warm('#e8e4dc', [-5, 1.1, -7.83], L), {top: warm('#f4f0e8', [-5, 1.1, -7.83], L)});
    cylinder(q, cc, 20440, [-3.7, 0.0, -7.6], 0.16, 0.18, warm('#8a8070', [-3.7, 0, -7.6], L), {top: warm('#4a4038', [-3.7, 0, -7.6], L), taper: 1.2});
    const k = cardAt(cc, [-5.6, 0.0, -7.6]);
    if (k) { hardFill(q, 20450, warm(VC.bamboo, [-5.6, 0.3, -7.6], L), cps(k, [[-0.16, 0], [0.16, 0], [0.13, 0.32], [0.1, 0.36], [-0.1, 0.36], [-0.13, 0.32]])); for (let j = 0; j < 4; j++) inkLine(q, 20451 + j, cps(k, [[-0.14, 0.06 + j * 0.08], [0.14, 0.06 + j * 0.08]]), {closed: false, weight: 0.4, color: warm('#6a5530', [-5.6, 0.3, -7.6], L), still: true}); }
  }});
  // clay charcoal stove with a blackened pot, a water jar (โอ่ง) with a dipper, a pha khao ma hanging on a post
  items.push({at: [-6.3, 0, -7.2], draw: (q, cc) => {
    cylinder(q, cc, 20500, [-6.3, 0, -7.2], 0.17, 0.26, warm(UC.clay, [-6.3, 0.2, -7.2], L), {top: warm('#2a1a12', [-6.3, 0.2, -7.2], L), taper: 1.15});
    cylinder(q, cc, 20505, [-6.3, 0.26, -7.2], 0.15, 0.16, warm('#2a2622', [-6.3, 0.3, -7.2], L), {top: '#3a3430'});
  }});
  items.push({at: [-2.3, 0, -7.2], draw: (q, cc) => {
    const k = cardAt(cc, [-2.3, 0, -7.2]); if (!k) return;
    hardFill(q, 20520, warm(VC.jar, [-2.3, 0.4, -7.2], L), cell(k, 0, 0.42, 0.36, 0.42, 18));
    hardFill(q, 20521, warm('#2a1a10', [-2.3, 0.8, -7.2], L), cell(k, 0, 0.82, 0.22, 0.05, 12));
    inkLine(q, 20522, cell(k, 0, 0.42, 0.36, 0.42, 18), {weight: 0.6, color: VC.ink, still: true});
  }});
  items.push({at: [-3.0, 1.2, -5.5], draw: (q, cc) => {
    const top = camPoint(cc, [-3.1, 1.75, -5.5]), u = camUnit(cc, [-3.1, 1.75, -5.5]); if (!top) return;
    const cloth: Pt[] = [[top[0] - 0.12 * u, top[1]], [top[0] + 0.12 * u, top[1]], [top[0] + 0.1 * u, top[1] + 0.65 * u], [top[0] - 0.1 * u, top[1] + 0.62 * u]];
    hardFill(q, 20530, warm('#b5473a', [-3.1, 1.4, -5.5], L), cloth);
    for (let j = 0; j < 4; j++) hardFill(q, 20531 + j, warm('#e8dccb', [-3.1, 1.4, -5.5], L), [[top[0] - 0.12 * u + j * 0.06 * u, top[1]], [top[0] - 0.1 * u + j * 0.06 * u, top[1]], [top[0] - 0.1 * u + j * 0.06 * u, top[1] + 0.63 * u], [top[0] - 0.12 * u + j * 0.06 * u, top[1] + 0.63 * u]]);
  }});
  // bamboo platform (แคร่) with a woven mat, the oil lamp on it
  items.push({at: [-4.6, 0.45, -4.4], bias: 0.2, draw: (q, cc) => {
    for (const [x, z] of [[-5.5, -5.0], [-3.7, -5.0], [-5.5, -3.8], [-3.7, -3.8]] as const) pbw(q, cc, 20600 + Math.round(-x * 10 - z), box(x - 0.05, x + 0.05, 0, 0.4, z - 0.05, z + 0.05), VC.woodDark, L, false);
    pbw(q, cc, 20610, box(-5.6, -3.6, 0.38, 0.45, -5.1, -3.7), VC.bamboo, L);
    for (let x = -5.55; x < -3.6; x += 0.1) wInk(q, cc, 20620 + Math.round(-x * 20), [[x, 0.455, -5.1], [x, 0.455, -3.7]], {closed: false, weight: 0.35, color: warm('#7a6430', [x, 0.45, -4.4], L)});
    wFill(q, cc, 20700, warm(UC.mat, [-4.7, 0.45, -4.4], L), qy(0.46, -5.45, -3.85, -4.95, -3.85));
    for (let x = -5.4; x < -3.85; x += 0.18) wInk(q, cc, 20710 + Math.round(-x * 30), [[x, 0.462, -4.95], [x, 0.462, -3.85]], {closed: false, weight: 0.4, color: warm(UC.matLine, [x, 0.46, -4.4], L)});
    for (let z = -4.9; z < -3.85; z += 0.18) wInk(q, cc, 20760 + Math.round(-z * 30), [[-5.45, 0.462, z], [-3.85, 0.462, z]], {closed: false, weight: 0.4, color: warm(UC.matLine, [-4.6, 0.46, z], L)});
  }});
  items.push({at: LAMP, bias: -0.1, draw: (q, cc) => {
    cylinder(q, cc, 20800, [LAMP[0], 0.46, LAMP[2]], 0.05, 0.07, warm('#8a8a7a', LAMP, L, 0.5), {top: '#5a5a50'});
    cylinder(q, cc, 20805, [LAMP[0], 0.53, LAMP[2]], 0.012, 0.03, '#3a3430');
  }});
  paintSorted(p, c, [...items, ...(o.extra ?? [])]);
  // the flame and its light (one warm source; its glow kept off the faces by staging)
  const f = camPoint(c, [LAMP[0], 0.6, LAMP[2]]), u = camUnit(c, LAMP);
  if (f) {
    paintHalo(p, {x: f[0], y: f[1], r: 0.6 * u, color: '#ffb35a', level: 0.45, squash: 0.85, t: o.t, seed: 20900});
    const fl = 1 + 0.08 * Math.sin(o.t * 13);
    hardFill(p, 20910, '#ffcf6a', [[f[0] - 0.014 * u, f[1] + 0.02 * u], [f[0], f[1] - 0.06 * u * fl], [f[0] + 0.014 * u, f[1] + 0.02 * u]]);
    hardFill(p, 20911, '#fff4c8', [[f[0] - 0.006 * u, f[1] + 0.015 * u], [f[0], f[1] - 0.03 * u * fl], [f[0] + 0.006 * u, f[1] + 0.015 * u]]);
  }
};
export {qx, qy, qz, cps};

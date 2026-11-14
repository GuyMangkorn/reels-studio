import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {bez, cardAt, cell, cp, cps, lit, strip, type Card, type Light, type Painter, type Pt, type V3, type YCam} from './core';

// SET-MESO-FOREST (brief VD-S03): tree ferns 3-6 m, cycads 1.5-2.5 m (one with an orange seed cluster), conifers 25-35 m;
// no flowering plant, no grass. Each plant is a card squared to the lens at its world foot point (look stills, W3, Film).

export const FC = {
  fern: '#5f8f3e', fernDark: '#3c6a2e', fernTrunk: '#5a4232', cycad: '#4f7a33', cycadDark: '#2f5428', cycadTrunk: '#7a6440',
  seed: '#e07a2a', conifer: '#3f6a3a', coniferDark: '#29482c', coniferTrunk: '#7a4a32', groundFern: '#4c7a36', ink: '#24301f',
} as const;

const fronds = (p: Painter, k: Card, seed: number, top: [number, number], n: number, len: number, col: string, dark: string, droop: number, spread = [200, -20]) => {
  for (let i = 0; i < n; i++) {
    const h = hash(seed + i * 7.3);
    const a = ((spread[0] + (spread[1] - spread[0]) * (i + 0.5 * h) / n) * Math.PI) / 180;
    const L = len * (0.8 + 0.35 * h);
    const tip: [number, number] = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L * 0.55 - droop * L * (0.5 + 0.5 * Math.abs(Math.cos(a)))];
    const mid: [number, number] = [top[0] + Math.cos(a) * L * 0.55, top[1] + Math.sin(a) * L * 0.5 + 0.25 * L];
    const line = bez(cp(k, top[0], top[1]), cp(k, mid[0], mid[1]), cp(k, tip[0], tip[1]), 10);
    const w = line.map((_, j) => k.u * 0.17 * L / 2 * Math.sin(Math.PI * Math.min(1, (j + 1) / line.length)) ** 0.7);
    const back = i % 2 === 0;
    hardFill(p, seed + i * 11, back ? dark : col, strip(line, w));
    // pinnae: short ticks along both sides
    inkLine(p, seed + i * 11 + 1, line, {closed: false, weight: 0.5, color: mixColor(dark, FC.ink, 0.4), still: true, curve: 0.3});
    for (let j = 2; j < line.length - 1; j += 2) {
      const q = line[j], q2 = line[j + 1], dx = q2[0] - q[0], dy = q2[1] - q[1], l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l, ww = w[j] * 1.15;
      inkLine(p, seed + i * 11 + 2 + j, [[q[0] + nx * ww, q[1] + ny * ww], q, [q[0] - nx * ww, q[1] - ny * ww]], {closed: false, weight: 0.35, color: mixColor(back ? col : dark, FC.ink, 0.15), still: true, curve: 0});
    }
  }
};

/** Tree fern: a slim shaggy trunk and an arching crown of fronds. */
export const paintTreeFern = (p: Painter, c: YCam, at: V3, h: number, L: Light, seed: number, s = 1) => {
  const k = cardAt(c, at, s);
  if (!k || k.u * h < 4) return;
  const lean = (hash(seed) - 0.5) * 0.3;
  const trunk = cps(k, [[-0.12, 0], [0.12, 0], [0.09 + lean, h], [-0.09 + lean, h]]);
  hardFill(p, seed, lit(L, FC.fernTrunk), trunk);
  for (let i = 1; i < 6; i++) inkLine(p, seed + 1 + i, cps(k, [[-0.1 + lean * i / 6, h * i / 6], [0.1 + lean * i / 6, h * i / 6 + 0.06]]), {closed: false, weight: 0.4, color: lit(L, '#3a2a20'), still: true});
  fronds(p, k, seed + 20, [lean, h], 9, Math.max(1.6, h * 0.42), lit(L, FC.fern), lit(L, FC.fernDark), 0.45);
};

/** Cycad: a thick scaled trunk and a crown of stiff saw-edged fronds; `seeds` adds the orange seed cluster (shot 6's lure). */
export const paintCycad = (p: Painter, c: YCam, at: V3, h: number, L: Light, seed: number, o: {seeds?: boolean; s?: number; seedGlow?: number} = {}) => {
  const k = cardAt(c, at, o.s ?? 1);
  if (!k || k.u * h < 4) return;
  const th = h * 0.45;
  hardFill(p, seed, lit(L, FC.cycadTrunk), cps(k, [[-0.2, 0], [0.2, 0], [0.17, th], [-0.17, th]]));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) {
    const y = (th * (i + 0.5)) / 5, x = -0.12 + j * 0.12 + (i % 2) * 0.06;
    inkLine(p, seed + 10 + i * 3 + j, cps(k, [[x - 0.05, y], [x, y + 0.04], [x + 0.05, y], [x, y - 0.04]]), {weight: 0.35, color: lit(L, '#4a3a22'), still: true});
  }
  const top: [number, number] = [0, th];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const hh = hash(seed + i * 3.1);
    const a = ((180 - (180 * (i + 0.5)) / n) * Math.PI) / 180;
    const Lf = (h - th) * (1.2 + 0.3 * hh);
    const tip: [number, number] = [Math.cos(a) * Lf * 1.15, th + Math.max(0.1, Math.sin(a)) * Lf - 0.1 * Math.abs(Math.cos(a)) * Lf];
    const line = bez(cp(k, top[0], top[1]), cp(k, (tip[0] + top[0]) / 2, (tip[1] + top[1]) / 2 + 0.12 * Lf), cp(k, tip[0], tip[1]), 10);
    const w = line.map((_, j) => k.u * 0.11 * (1 - j / line.length * 0.7));
    const dark = i % 3 === 0;
    hardFill(p, seed + 40 + i * 5, lit(L, dark ? FC.cycadDark : FC.cycad), strip(line, w));
    // saw edge: zigzag ink along one side
    const zig: Pt[] = line.map((q, j) => [q[0] + (j % 2 ? 1 : -1) * w[j] * 0.9, q[1] - (j % 2 ? 1 : -1) * w[j] * 0.3]);
    inkLine(p, seed + 41 + i * 5, zig, {closed: false, weight: 0.35, color: lit(L, FC.ink), still: true, curve: 0});
    inkLine(p, seed + 42 + i * 5, line, {closed: false, weight: 0.45, color: lit(L, mixColor(FC.cycadDark, FC.ink, 0.4)), still: true, curve: 0.2});
  }
  if (o.seeds) {
    for (let i = 0; i < 9; i++) {
      const x = -0.12 + 0.24 * hash(seed + 200 + i), y = th + 0.02 + 0.12 * hash(seed + 300 + i);
      hardFill(p, seed + 400 + i, lit(L, FC.seed, -0.2), cell(k, x, y, 0.045, 0.06, 10));
      inkLine(p, seed + 420 + i, cell(k, x, y, 0.045, 0.06, 10), {weight: 0.35, color: lit(L, '#7a3a12'), still: true});
    }
    if (o.seedGlow) washAt(p, seed + 450, '#ffd27a', 40 * o.seedGlow, cell(k, 0, th + 0.08, 0.35, 0.25, 16), 0.3, 0.2);
  }
};

/** Tall conifer (araucaria-like): straight trunk, branch tiers with tufts, a rounded dense crown near the top. */
export const paintConifer = (p: Painter, c: YCam, at: V3, h: number, L: Light, seed: number, o: {haze?: number; hazeCol?: string} = {}) => {
  const k = cardAt(c, at);
  if (!k || k.u * h < 6) return;
  const hz = o.haze ?? 0, H = (col: string) => mixColor(lit(L, col), o.hazeCol ?? L.amb, hz);
  hardFill(p, seed, H(FC.coniferTrunk), cps(k, [[-0.45, 0], [0.45, 0], [0.12, h], [-0.12, h]]));
  const tiers = 9;
  for (let i = 0; i < tiers; i++) {
    const y = h * (0.42 + 0.58 * (i / tiers)), wid = (h * 0.2) * (1 - (i / tiers) * 0.75) * (0.85 + 0.3 * hash(seed + i));
    for (const sd of [-1, 1]) {
      const tip: [number, number] = [sd * wid, y - 0.6 - 0.25 * wid];
      hardFill(p, seed + 10 + i * 4 + (sd > 0 ? 1 : 0), H(i % 2 ? FC.conifer : FC.coniferDark), [
        ...bez(cp(k, 0, y + 0.5), cp(k, sd * wid * 0.5, y + 0.9), cp(k, tip[0], tip[1]), 6),
        ...bez(cp(k, tip[0], tip[1]), cp(k, sd * wid * 0.45, y - 0.9), cp(k, 0, y - 0.7), 6),
      ]);
    }
  }
  hardFill(p, seed + 60, H(FC.coniferDark), cell(k, 0, h * 0.98, h * 0.07, h * 0.06, 16));
};

/** Low ground ferns along a world line (forest floor edge). */
export const paintFernClump = (p: Painter, c: YCam, at: V3, size: number, L: Light, seed: number) => {
  const k = cardAt(c, at);
  if (!k || k.u * size < 3) return;
  fronds(p, k, seed, [0, 0.05], 7, size, lit(L, FC.groundFern), lit(L, FC.fernDark), 0.25, [170, 10]);
};

/** A forest wall: rows of conifers behind tree ferns and cycads between x0..x1 starting at depth z (north of the fence). */
export const forestItems = (zFront: number, x0: number, x1: number, seed: number) => {
  const items: {kind: 'conifer' | 'fern' | 'cycad' | 'clump'; at: V3; h: number; seed: number}[] = [];
  for (let r = 0; r < 3; r++) for (let x = x0; x < x1; x += 7 + r * 2) {
    const h = 25 + 10 * hash(seed + x * 3 + r);
    items.push({kind: 'conifer', at: [x + 4 * hash(seed + x + r * 17), 0, zFront - 6 - r * 9 - 3 * hash(seed + x * 5 + r)], h, seed: seed + 1000 + Math.round(x * 13) + r * 97});
  }
  for (let x = x0; x < x1; x += 2.6) {
    const hh = hash(seed + x * 7.7);
    items.push({kind: hh > 0.35 ? 'fern' : 'cycad', at: [x + hh, 0, zFront - 0.5 - 3 * hash(seed + x * 2.3)], h: hh > 0.35 ? 3 + 3 * hh : 1.5 + hh * 2, seed: seed + 3000 + Math.round(x * 31)});
  }
  for (let x = x0; x < x1; x += 1.7) items.push({kind: 'clump', at: [x, 0, zFront + 0.3 * hash(seed + x)], h: 0.8 + 0.5 * hash(seed + x * 9), seed: seed + 5000 + Math.round(x * 17)});
  return items;
};

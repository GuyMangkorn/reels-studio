import {ell, hardFill, inkLine, limb, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// N16-09 flower-pop insert card (EP16 shot 4, no text): a 2x2 grid of tiles x 150-930, y 300-1100 (tile 370x370, gap 40): mango, banana, chilli, morning glory
// (ผักบุ้ง). Each tile paints its food at once and its flower pops beside it on a beat (the sheet's +6 / +24 / +42 / +60). Painted fills here, the crisp tile
// frames are the SVG `FlowerPopFrame` in screens.tsx; both take the same `slide`. Boss, 14 Nov 2026.

export const FLOWER_TILES = ['mango', 'banana', 'chilli', 'morning-glory'] as const;
export type FlowerTile = (typeof FLOWER_TILES)[number];
/** Tile centres and size (px). */
export const TILE = 370;
export const TILE_AT: Record<FlowerTile, Pt> = {mango: [335, 485], banana: [745, 485], chilli: [335, 895], 'morning-glory': [745, 895]};
/** Sheet beats (shot-local frames): the card slides up over 8 f; each flower pops at its frame. */
export const FLOWER_POP_FRAMES: Record<FlowerTile, number> = {mango: 6, banana: 24, chilli: 42, 'morning-glory': 60};

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
/** Card slide-in 0..1 at shot frame `f` (8 f ease-out). */
export const flowerSlide = (f: number) => easeOut(f / 8);
/** Flower pop scale at frame `f` for tile `id`: 0 before its beat, a 6 f overshoot (1.2 at +3) settling to 1. */
export const flowerPopScale = (id: FlowerTile, f: number): number => {
  const k = (f - FLOWER_POP_FRAMES[id]) / 6;
  if (k <= 0) return 0;
  if (k >= 1) return 1;
  return k < 0.5 ? 1.2 * easeOut(k * 2) : 1.2 - 0.2 * ((k - 0.5) * 2);
};

const ink = '#4a3a2c';
type P = (x: number, y: number) => Pt;
const petals = (p: Painter, seed: number, at: P, n: number, r: number, rw: number, col: string, a0 = 0, rot = 0) => {
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * 6.2832 + rot, c: Pt = at(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55);
    hardFill(p, seed + i, col, ell(c[0], c[1], r * 0.55, rw, 10, a));
  }
};

const mango = (p: Painter, at: P, S: number, pop: number, seed: number) => {
  const [x, y] = at(-30, 40);
  hardFill(p, seed, '#e8a53a', ell(x, y, 78 * S, 66 * S, 20, -0.5));
  washAt(p, seed + 1, '#d8602e', 150, ell(x + 20 * S, y - 12 * S, 42 * S, 36 * S, 14, -0.5), 0.3, 0.3);
  washAt(p, seed + 2, '#f8e0a0', 150, ell(x - 28 * S, y + 22 * S, 20 * S, 12 * S, 10, -0.5), 0.2, 0.2);
  inkLine(p, seed + 3, ell(x, y, 78 * S, 66 * S, 20, -0.5), {weight: 0.9, color: ink, still: true});
  const t = at(-14, -22);
  inkLine(p, seed + 4, [t, at(-8, -38), at(-4, -48)], {weight: 1.2, color: '#5a6a30', closed: false, still: true});
  hardFill(p, seed + 5, '#4f7a3a', ell(...at(30, -50), 46 * S, 14 * S, 12, -0.4));
  inkLine(p, seed + 6, ell(...at(30, -50), 46 * S, 14 * S, 12, -0.4), {weight: 0.7, color: ink, still: true});
  if (pop <= 0) return;
  // the panicle: a brown stem and a cone of tiny cream-pink flowers
  const q = (px: number, py: number): Pt => { const b = at(95, 20); return [b[0] + px * pop * S, b[1] + py * pop * S]; };
  inkLine(p, seed + 10, [q(0, 50), q(2, 10), q(0, -50)], {weight: 1.6, color: '#7a5a3a', closed: false, still: true});
  for (let i = 0; i < 14; i++) {
    const v = i / 13, ax = (i % 2 ? 1 : -1) * (6 + 24 * (1 - v)) * (0.5 + 0.5 * ((i * 7) % 5) / 4), ay = 36 - v * 82;
    petals(p, seed + 20 + i * 8, (u, w) => { const c = q(ax, ay); return [c[0] + u * pop, c[1] + w * pop]; }, 5, 9 * S, 5 * S, i % 3 ? '#f4d8c6' : '#f2e6d0');
    const c = q(ax, ay); hardFill(p, seed + 24 + i * 8, '#e8b84a', ell(c[0], c[1], 2.2 * S * pop, 2.2 * S * pop, 6));
  }
};

const banana = (p: Painter, at: P, S: number, pop: number, seed: number) => {
  const col = ['#e6c53a', '#e8cc48', '#dfbd2e'];
  for (let i = 0; i < 4; i++) {
    const a = at(-84 + i * 22, 52 - i * 6), b = at(-10 + i * 20, 8 + i * 4), c = at(8 + i * 24, 70 - i * 14);
    const arc: Pt[] = Array.from({length: 9}, (_, j) => { const t = j / 8, m = 1 - t; return [m * m * a[0] + 2 * m * t * b[0] + t * t * c[0], m * m * a[1] + 2 * m * t * b[1] + t * t * c[1]] as Pt; });
    const poly: Pt[] = [...arc.map(([x, y]): Pt => [x, y - 15 * S]), ...arc.slice().reverse().map(([x, y]): Pt => [x, y + 15 * S])];
    hardFill(p, seed + i * 3, col[i % 3], poly);
    inkLine(p, seed + i * 3 + 1, poly, {weight: 0.8, color: ink, still: true});
    hardFill(p, seed + i * 3 + 2, '#7a8a3a', ell(arc[8][0], arc[8][1], 6 * S, 8 * S, 8));
  }
  hardFill(p, seed + 20, '#6a7a38', limb(at(-90, 40), at(-100, 0), 14 * S, 12 * S));
  if (pop <= 0) return;
  // banana blossom: a hanging purple-red bud of overlapping bracts
  const b = at(105, -30), q = (px: number, py: number): Pt => [b[0] + px * pop * S, b[1] + py * pop * S];
  inkLine(p, seed + 30, [q(0, -70), q(4, -40), q(0, -10)], {weight: 1.8, color: '#6a7a38', closed: false, still: true});
  const bud = (cx: number, cy: number, rx: number, ry: number, col: string, id: number) => hardFill(p, seed + id, col, ell(q(cx, cy)[0], q(cx, cy)[1], rx * S * pop, ry * S * pop, 14, 0.1));
  bud(0, 28, 26, 44, '#6a2448', 31);
  bud(-6, 18, 17, 30, '#8a3058', 32);
  bud(8, 40, 15, 22, '#a8446a', 33);
  inkLine(p, seed + 34, ell(q(0, 28)[0], q(0, 28)[1], 26 * S * pop, 44 * S * pop, 14, 0.1), {weight: 0.8, color: ink, still: true});
  for (let i = 0; i < 3; i++) hardFill(p, seed + 40 + i, '#f2e6b0', ell(q(-22 + i * 8, 56 + i * 3)[0], q(-22 + i * 8, 56 + i * 3)[1], 6 * S * pop, 3 * S * pop, 8));
};

const chilli = (p: Painter, at: P, S: number, pop: number, seed: number) => {
  for (let i = 0; i < 2; i++) {
    const a = at(-100 + i * 30, -10 + i * 30), b = at(-30 + i * 24, 20 + i * 8), c = at(30 + i * 20, 82 + i * 10);
    const arc: Pt[] = Array.from({length: 9}, (_, j) => { const t = j / 8, m = 1 - t; return [m * m * a[0] + 2 * m * t * b[0] + t * t * c[0], m * m * a[1] + 2 * m * t * b[1] + t * t * c[1]] as Pt; });
    const w = (j: number) => (13 - 11 * (j / 8)) * S;
    const poly: Pt[] = [...arc.map(([x, y], j): Pt => [x, y - w(j)]), ...arc.slice().reverse().map(([x, y], j): Pt => [x, y + w(8 - j)])];
    hardFill(p, seed + i * 4, i ? '#d8402e' : '#c4302a', poly);
    washAt(p, seed + i * 4 + 1, '#f48a6a', 120, arc.slice(1, 6).map(([x, y]): Pt => [x, y - 5 * S]).concat(arc.slice(1, 6).reverse().map(([x, y]): Pt => [x, y - 1 * S])), 0.1, 0.2);
    inkLine(p, seed + i * 4 + 2, poly, {weight: 0.8, color: ink, still: true});
    hardFill(p, seed + i * 4 + 3, '#4f7a3a', [[arc[0][0] - 12 * S, arc[0][1] - 10 * S], [arc[0][0] + 6 * S, arc[0][1] - 18 * S], [arc[0][0] + 12 * S, arc[0][1] + 4 * S], [arc[0][0] - 8 * S, arc[0][1] + 10 * S]]);
  }
  if (pop <= 0) return;
  const b = at(90, 8), q = (px: number, py: number): Pt => [b[0] + px * pop * S, b[1] + py * pop * S];
  inkLine(p, seed + 20, [q(-8, 60), q(0, 20), q(2, 0)], {weight: 1.6, color: '#5a6a30', closed: false, still: true});
  hardFill(p, seed + 21, '#4f7a3a', ell(q(-34, 36)[0], q(-34, 36)[1], 24 * S * pop, 9 * S * pop, 10, 0.5));
  petals(p, seed + 22, (u, w) => [q(0, 0)[0] + u * pop, q(0, 0)[1] + w * pop], 5, 34 * S, 17 * S, '#f8f4e8', -1.57);
  inkLine(p, seed + 30, ell(q(0, 0)[0], q(0, 0)[1], 31 * S * pop, 31 * S * pop, 14), {weight: 0.5, color: '#a89c80', still: true});
  hardFill(p, seed + 31, '#e8c03a', ell(q(0, 0)[0], q(0, 0)[1], 8 * S * pop, 8 * S * pop, 8));
};

const glory = (p: Painter, at: P, S: number, pop: number, seed: number) => {
  // water spinach: a stem with arrowhead leaves and a tuft of tender tips
  const st: Pt[] = [at(-100, 80), at(-80, 20), at(-50, -30), at(-20, -60)];
  inkLine(p, seed, st, {weight: 2.2, color: '#6a9a48', closed: false, still: true});
  const leaf = (c: Pt, a: number, k: number, id: number) => {
    const pts: Pt[] = [[0, -22], [14, 4], [8, 18], [0, 24], [-8, 18], [-14, 4]].map(([x, y]) => [c[0] + (x * Math.cos(a) - y * Math.sin(a)) * k * S, c[1] + (x * Math.sin(a) + y * Math.cos(a)) * k * S] as Pt);
    hardFill(p, seed + id, '#5a8a3e', pts);
    inkLine(p, seed + id + 1, pts, {weight: 0.7, color: ink, still: true});
    inkLine(p, seed + id + 2, [c, [c[0] + Math.sin(a) * -20 * k * S, c[1] + Math.cos(a) * 20 * k * S]], {weight: 0.5, color: '#2f5a28', closed: false, still: true});
  };
  leaf(at(-85, 50), -1.0, 1.6, 10); leaf(at(-60, 0), 1.0, 1.7, 14); leaf(at(-30, -40), -0.8, 1.5, 18); leaf(at(10, -62), 1.2, 1.5, 22); leaf(at(-100, 90), 0.2, 1.2, 26);
  if (pop <= 0) return;
  const b = at(70, 10), q = (px: number, py: number): Pt => [b[0] + px * pop * S, b[1] + py * pop * S];
  inkLine(p, seed + 30, [q(-10, 70), q(0, 30), q(0, 6)], {weight: 1.6, color: '#5a8a3e', closed: false, still: true});
  // trumpet seen from the front: a pleated five-lobed funnel, white throat
  petals(p, seed + 32, (u, w) => [q(0, 0)[0] + u * pop, q(0, 0)[1] + w * pop], 5, 52 * S, 26 * S, '#a98be0', -1.2);
  inkLine(p, seed + 40, ell(q(0, 0)[0], q(0, 0)[1], 46 * S * pop, 46 * S * pop, 14), {weight: 0.5, color: '#6a4ea8', still: true});
  hardFill(p, seed + 41, '#f4eefc', ell(q(0, 0)[0], q(0, 0)[1], 20 * S * pop, 20 * S * pop, 12));
  for (let i = 0; i < 5; i++) { const a = -1.2 + (i / 5) * 6.2832 + 0.63; inkLine(p, seed + 42 + i, [q(Math.cos(a) * 20 * S, Math.sin(a) * 20 * S), q(Math.cos(a) * 44 * S, Math.sin(a) * 44 * S)], {weight: 0.5, color: '#7a5ec0', closed: false, still: true}); }
  hardFill(p, seed + 50, '#e8c03a', ell(q(0, 0)[0], q(0, 0)[1], 5 * S * pop, 5 * S * pop, 8));
};

/**
 * The flower-pop card at shot frame `f` (30 fps): panels and foods slide up over 8 f, each flower pops on its beat (`FLOWER_POP_FRAMES`). `scrim` darkens what is under
 * (default 0.5: the sheet's blurred, darkened forest plate is the Editor's layer, this only adds the dim). Pair with `<FlowerPopFrame slide={flowerSlide(f)} />`.
 */
export const paintFlowerPopCard = (p: Painter, f: number, o: {scrim?: number; seed?: number} = {}) => {
  const seed = o.seed ?? 44000, slide = flowerSlide(f), dy = (1 - slide) * 900;
  const sc = o.scrim ?? 0.5;
  if (sc > 0) washAt(p, seed, '#10150f', 255 * sc * slide, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);
  FLOWER_TILES.forEach((id, i) => {
    const [cx, cy] = TILE_AT[id], oy = cy + dy, h = TILE / 2, s = seed + 100 + i * 400;
    hardFill(p, s, mixColor('#f4ead2', '#e4d6b4', 0.35), [[cx - h, oy - h], [cx + h, oy - h], [cx + h, oy + h], [cx - h, oy + h]]);
    washAt(p, s + 1, '#d8c498', 120, [[cx - h + 8, oy + h - 70], [cx + h - 8, oy + h - 70], [cx + h - 8, oy + h - 8], [cx - h + 8, oy + h - 8]], 0.3, 0.3);
    const at: P = (x, y) => [cx + x * 1, oy + y * 1], pop = flowerPopScale(id, f);
    [mango, banana, chilli, glory][i](p, at, 1, pop, s + 10);
  });
};

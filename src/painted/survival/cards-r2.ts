import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {flowerPopScale, flowerSlide, FLOWER_TILES, TILE, TILE_AT, type FlowerTile} from './cards';

// N16-09 R2 painted fruit and flower tiles (EDU-EP16 shots 4-5; Boss, 14 Nov 2026; user on the draft: "polish the fruit and flower pictures, more detail").
// Same card, tile positions and pop beats as `cards.ts` (the crisp frames `FlowerPopFrame` in screens.tsx are unchanged); the art is redone with shaded volumes (lit side, shade side, rim, gloss),
// speckle and veins, flowers with real parts (petals, throat, stamens, sepals), and loose painted blossoms drifting over the card. Painted fills only, no text.

const INK = '#3a2c20';
type At = (x: number, y: number) => Pt;
const rot = (c: Pt, a: number, x: number, y: number): Pt => [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)];
/** A shaded ellipsoid: base fill, shade crescent on the lower-right, a lit upper-left bloom, optional gloss and speckle, ink rim. */
const volume = (p: Painter, seed: number, c: Pt, rx: number, ry: number, a: number, col: {base: string; shade: string; light: string; gloss?: string}, o: {speckle?: string; n?: number; rim?: string} = {}) => {
  hardFill(p, seed, col.base, ell(c[0], c[1], rx, ry, 22, a));
  const sh = rot(c, a, rx * 0.16, ry * 0.2);
  washAt(p, seed + 1, col.shade, 150, ell(sh[0], sh[1], rx * 0.92, ry * 0.9, 18, a), 0.25, 0.3);
  hardFill(p, seed + 2, col.base, ell(c[0] - rx * 0.1 * Math.cos(a), c[1] - ry * 0.12, rx * 0.84, ry * 0.8, 20, a));
  const lt = rot(c, a, -rx * 0.28, -ry * 0.3);
  washAt(p, seed + 3, col.light, 170, ell(lt[0], lt[1], rx * 0.46, ry * 0.4, 14, a), 0.3, 0.3);
  if (col.gloss) { const g = rot(c, a, -rx * 0.4, -ry * 0.42); hardFill(p, seed + 4, col.gloss, ell(g[0], g[1], rx * 0.16, ry * 0.07, 10, a - 0.5)); }
  if (o.speckle) for (let i = 0; i < (o.n ?? 12); i++) { const t = hash(seed + 50 + i) * 6.283, r = Math.sqrt(hash(seed + 80 + i)) * 0.78, q = rot(c, a, Math.cos(t) * rx * r, Math.sin(t) * ry * r); hardFill(p, seed + 10 + i, o.speckle, ell(q[0], q[1], 1.8, 1.4, 6)); }
  inkLine(p, seed + 8, ell(c[0], c[1], rx, ry, 22, a), {weight: 0.9, color: o.rim ?? mixColor(col.shade, INK, 0.5), still: true});
};
/** A lanceolate leaf from `base` along angle `a`, length `L`, half-width `w`, with a midrib and side veins. */
const leaf = (p: Painter, seed: number, base: Pt, a: number, L: number, w: number, col = '#4f7a3a', lt = '#7aa84e') => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8, half = w * Math.sin(Math.PI * Math.pow(t, 0.7)); pts.push(rot(base, a, L * t, -half - 1)); }
  for (let i = 8; i >= 0; i--) { const t = i / 8, half = w * Math.sin(Math.PI * Math.pow(t, 0.7)); pts.push(rot(base, a, L * t, half + 1)); }
  hardFill(p, seed, col, pts);
  const up: Pt[] = []; for (let i = 0; i <= 8; i++) { const t = i / 8; up.push(rot(base, a, L * t, -w * 0.75 * Math.sin(Math.PI * Math.pow(t, 0.7)) * 0.5)); }
  washAt(p, seed + 1, lt, 120, [...up, ...Array.from({length: 9}, (_, i): Pt => rot(base, a, L * (1 - i / 8), 0))], 0.2, 0.3);
  inkLine(p, seed + 2, [base, rot(base, a, L, 0)], {weight: 0.9, color: mixColor(col, INK, 0.5), closed: false, still: true});
  for (let i = 1; i < 6; i++) for (const s of [-1, 1]) { const t = i / 6.5, b0 = rot(base, a, L * t, 0), tip = rot(base, a, L * (t + 0.12), s * w * 0.78 * Math.sin(Math.PI * Math.pow(t + 0.1, 0.7))); inkLine(p, seed + 3 + i * 2 + (s > 0 ? 1 : 0), [b0, tip], {weight: 0.4, color: mixColor(col, INK, 0.35), closed: false, still: true}); }
  inkLine(p, seed + 30, pts, {weight: 0.7, color: mixColor(col, INK, 0.55), still: true});
};
/** A five-petal flower seen from the front: rounded petals with a vein each, a throat and stamens. */
const bloom = (p: Painter, seed: number, c: Pt, r: number, a0: number, o: {petal: string; edge: string; throat: string; stamen?: string; anth?: string; n?: number; vein?: string}) => {
  const n = o.n ?? 5;
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * 6.2832, pc = rot(c, a, r * 0.55, 0);
    hardFill(p, seed + i * 3, o.petal, ell(pc[0], pc[1], r * 0.52, r * 0.4, 12, a));
    washAt(p, seed + i * 3 + 1, o.edge, 120, ell(...rot(c, a, r * 0.72, 0), r * 0.3, r * 0.3, 8, a), 0.2, 0.3);
    inkLine(p, seed + i * 3 + 2, [c, rot(c, a, r * 0.95, 0)], {weight: 0.4, color: o.vein ?? o.edge, closed: false, still: true});
  }
  inkLine(p, seed + 40, Array.from({length: n * 6}, (_, i): Pt => { const t = (i / (n * 6)) * 6.2832, k = 0.88 + 0.12 * Math.cos(n * (t - a0)); return [c[0] + Math.cos(t) * r * k, c[1] + Math.sin(t) * r * k]; }), {weight: 0.55, color: o.edge, still: true});
  hardFill(p, seed + 41, o.throat, ell(c[0], c[1], r * 0.2, r * 0.2, 10));
  for (let i = 0; i < 5; i++) { const q = rot(c, a0 + i * 1.2566 + 0.3, r * 0.22, 0); inkLine(p, seed + 42 + i, [c, q], {weight: 0.5, color: o.stamen ?? '#e8c03a', closed: false, still: true}); hardFill(p, seed + 47 + i, o.anth ?? o.stamen ?? '#e8c03a', ell(q[0], q[1], r * 0.045, r * 0.045, 6)); }
};

const mango = (p: Painter, at: At, pop: number, s: number) => {
  const c = at(-48, 50);
  leaf(p, s + 100, at(-8, -20), -0.35, 96, 17); leaf(p, s + 140, at(-20, -14), -1.05, 80, 15, '#3f6a30');
  volume(p, s, c, 86, 70, -0.45, {base: '#e2a634', shade: '#a8602a', light: '#fff0a8', gloss: '#fffbe0'}, {speckle: '#8a6a28', n: 16});
  washAt(p, s + 30, '#d8502e', 150, ell(...rot(c, -0.45, 30, 22), 44, 38, 14, -0.45), 0.3, 0.3);   // red blush on the lower side
  washAt(p, s + 31, '#8aa83a', 170, ell(...rot(c, -0.45, -52, -20), 30, 40, 12, -0.45), 0.3, 0.3);   // green shoulder at the stem end
  inkLine(p, s + 32, [at(-70, -10), at(-72, -26), at(-66, -40)], {weight: 2.6, color: '#6a4a2c', closed: false, still: true});
  hardFill(p, s + 33, '#5a3a20', ell(...at(-66, -41), 5, 3.5, 8));
  if (pop <= 0) return;
  // panicle: main axis with five side branches, each carrying small five-petal flowers and buds
  const b = at(108, 18), q = (x: number, y: number): Pt => [b[0] + x * pop, b[1] + y * pop];
  inkLine(p, s + 200, [q(2, 62), q(5, 20), q(-2, -30), q(0, -66)], {weight: 2.2, color: '#7a5a3a', closed: false, still: true});
  for (let i = 0; i < 5; i++) {
    const y0 = 40 - i * 24, dir = i % 2 ? 1 : -1, tip: Pt = q(dir * (30 - i * 3), y0 - 18);
    inkLine(p, s + 210 + i * 30, [q(1, y0), q(dir * 14, y0 - 8), tip], {weight: 1.1, color: '#8a6a44', closed: false, still: true});
    for (let k = 0; k < 4; k++) {
      const u = 0.35 + k * 0.22, fc: Pt = [q(1, y0)[0] + (tip[0] - q(1, y0)[0]) * u, q(1, y0)[1] + (tip[1] - q(1, y0)[1]) * u + (k % 2 ? 6 : -6) * pop];
      if (k === 3) hardFill(p, s + 211 + i * 30 + k * 4, '#e8a8a0', ell(fc[0], fc[1], 3 * pop, 4 * pop, 6));
      else bloom(p, s + 211 + i * 30 + k * 4 + 100 * i, fc, 9.5 * pop, k, {petal: k % 2 ? '#f6dcd0' : '#f4e8d2', edge: '#d89a8a', throat: '#e8b040', stamen: '#d8902a'});
    }
  }
  hardFill(p, s + 400, '#e8a8a0', ell(...q(0, -68), 4 * pop, 5 * pop, 6));
};

const banana = (p: Painter, at: At, pop: number, s: number) => {
  // a hand of five fingers fanned from a crown, each curved with three ridges and a dark tip
  const crown = at(-92, 52);
  for (let i = 0; i < 5; i++) {
    const a0 = -0.55 + i * 0.2, L = 170 - Math.abs(i - 2) * 10, pts: Pt[] = [], mid: Pt[] = [];
    for (let k = 0; k <= 10; k++) {
      const t = k / 10, ang = a0 - 0.55 * t, r = L * t, px = crown[0] + 6 + Math.cos(ang) * r * 0.92 + i * 6, py = crown[1] + 20 - Math.sin(-ang) * 0 + Math.sin(ang) * r * 0.9 - 10 * i + 2 * t * L * 0.1;
      mid.push([px, py]);
    }
    const w = (k: number) => (3 + 17 * Math.sin(Math.PI * Math.min(1, (k / 10) * 1.08))) + (k > 9 ? 0 : 0);
    mid.forEach(([x, y], k) => pts.push([x, y - w(k)])); mid.slice().reverse().forEach(([x, y], k) => pts.push([x, y + w(10 - k)]));
    const col = ['#e8cc42', '#e0c038', '#ecd24c', '#dcb830', '#e4c640'][i];
    hardFill(p, s + i * 12, col, pts);
    washAt(p, s + i * 12 + 1, '#a8841c', 130, [...mid.map(([x, y], k): Pt => [x, y + w(k) * 0.2]), ...mid.slice().reverse().map(([x, y], k): Pt => [x, y + w(10 - k)])], 0.2, 0.3);
    washAt(p, s + i * 12 + 2, '#fff4b0', 130, [...mid.slice(1, 8).map(([x, y], k): Pt => [x, y - w(k + 1) * 0.9]), ...mid.slice(1, 8).reverse().map(([x, y], k): Pt => [x, y - w(7 - k) * 0.35])], 0.2, 0.3);
    for (const f of [-0.5, 0, 0.5]) inkLine(p, s + i * 12 + 3 + Math.round(f * 2 + 2), mid.slice(1, 9).map(([x, y], k): Pt => [x, y + f * w(k + 1)]), {weight: 0.4, color: '#a8841c', closed: false, still: true});
    for (let k = 0; k < 5; k++) { const m = mid[2 + k]; hardFill(p, s + i * 12 + 8 + k, '#7a5a20', ell(m[0] + (hash(s + i * 5 + k) - 0.5) * 8, m[1] + (hash(s + i * 9 + k) - 0.5) * 12, 1.4, 1.1, 5)); }
    hardFill(p, s + i * 12 + 9, '#3a2c1a', ell(mid[10][0], mid[10][1], 5, 4, 8));
    hardFill(p, s + i * 12 + 10, '#6a7a38', ell(mid[0][0], mid[0][1], 9, 8, 8));   // green neck at the crown
    inkLine(p, s + i * 12 + 11, pts, {weight: 0.8, color: INK, still: true});
  }
  hardFill(p, s + 80, '#6a5a2e', ell(crown[0] - 4, crown[1] + 14, 18, 12, 10, 0.4));
  inkLine(p, s + 81, [at(-98, 44), at(-106, 6), at(-104, -30)], {weight: 3, color: '#6a7a38', closed: false, still: true});
  if (pop <= 0) return;
  // blossom: a hanging bulb of overlapping purple-red bracts, one lifted to show rows of cream flowers
  const b = at(112, -34), q = (x: number, y: number): Pt => [b[0] + x * pop, b[1] + y * pop];
  inkLine(p, s + 100, [q(2, -86), q(7, -56), q(0, -28)], {weight: 2.4, color: '#6a7a38', closed: false, still: true});
  const bract = (cx: number, cy: number, rx: number, ry: number, a: number, col: string, hi: string, id: number) => {
    const c = q(cx, cy);
    hardFill(p, s + id, col, ell(c[0], c[1], rx * pop, ry * pop, 16, a));
    washAt(p, s + id + 1, hi, 150, ell(c[0] - rx * 0.25 * pop, c[1] - ry * 0.2 * pop, rx * 0.4 * pop, ry * 0.55 * pop, 10, a), 0.2, 0.3);
    inkLine(p, s + id + 2, ell(c[0], c[1], rx * pop, ry * pop, 16, a), {weight: 0.8, color: '#3a1428', still: true});
  };
  bract(0, 36, 28, 52, 0.05, '#5a1e40', '#8a3a66', 110);
  bract(14, 30, 22, 44, -0.18, '#6c2650', '#a04a78', 120);
  bract(-12, 24, 20, 40, 0.28, '#7a2e5a', '#b05884', 130);
  // lifted bract and the flowers under it
  const lift = q(-26, 58);
  hardFill(p, s + 140, '#e8d890', ell(q(-12, 66)[0], q(-12, 66)[1], 16 * pop, 9 * pop, 10, 0.5));
  for (let i = 0; i < 4; i++) hardFill(p, s + 141 + i, '#f6ecb8', ell(q(-22 + i * 7, 68 + (i % 2) * 3)[0], q(-22 + i * 7, 68 + (i % 2) * 3)[1], 4.2 * pop, 2.6 * pop, 6, 0.4));
  hardFill(p, s + 150, '#5a1e40', [lift, q(-6, 54), q(-2, 74), q(-30, 80)]);
};

const chilli = (p: Painter, at: At, pop: number, s: number) => {
  const peppers: {a: Pt; b: Pt; c: Pt; col: {base: string; shade: string; light: string}}[] = [
    {a: at(-112, -2), b: at(-52, 16), c: at(14, 92), col: {base: '#c8322a', shade: '#7a1818', light: '#f27a62'}},
    {a: at(-84, 28), b: at(-14, 34), c: at(54, 112), col: {base: '#dc4630', shade: '#8a2218', light: '#f89478'}},
    {a: at(-104, 58), b: at(-60, 62), c: at(-16, 120), col: {base: '#9ac03a', shade: '#4a6a1c', light: '#d4e87a'}},
  ];
  peppers.forEach((c, i) => {
    const arc: Pt[] = Array.from({length: 11}, (_, j) => { const t = j / 10, m = 1 - t; return [m * m * c.a[0] + 2 * m * t * c.b[0] + t * t * c.c[0], m * m * c.a[1] + 2 * m * t * c.b[1] + t * t * c.c[1]] as Pt; });
    const w = (j: number) => 15 - 13.5 * Math.pow(j / 10, 1.2);
    const poly: Pt[] = [...arc.map(([x, y], j): Pt => [x, y - w(j)]), ...arc.slice().reverse().map(([x, y], j): Pt => [x, y + w(10 - j)])];
    hardFill(p, s + i * 14, c.col.base, poly);
    washAt(p, s + i * 14 + 1, c.col.shade, 150, [...arc.map(([x, y], j): Pt => [x, y + w(j) * 0.1]), ...arc.slice().reverse().map(([x, y], j): Pt => [x, y + w(10 - j)])], 0.2, 0.3);
    hardFill(p, s + i * 14 + 2, c.col.light, [...arc.slice(1, 8).map(([x, y], j): Pt => [x, y - w(j + 1) * 0.72]), ...arc.slice(1, 8).reverse().map(([x, y], j): Pt => [x, y - w(7 - j) * 0.4])]);
    hardFill(p, s + i * 14 + 3, '#fff6ec', arc.slice(1, 6).map(([x, y], j): Pt => [x, y - w(j + 1) * 0.58]).concat(arc.slice(1, 6).reverse().map(([x, y], j): Pt => [x, y - w(5 - j) * 0.5])));
    inkLine(p, s + i * 14 + 4, poly, {weight: 0.9, color: INK, still: true});
    // calyx: green star cap and a short stem
    const k0 = arc[0];
    hardFill(p, s + i * 14 + 5, '#4f7a3a', [0, 1, 2, 3, 4, 5, 6, 7].map((n): Pt => { const r = n % 2 ? 9 : 17, t = (n / 8) * 6.2832 - 0.4; return [k0[0] + Math.cos(t) * r, k0[1] + Math.sin(t) * r * 0.9]; }));
    inkLine(p, s + i * 14 + 6, [[k0[0] - 4, k0[1] - 8], [k0[0] - 12, k0[1] - 22], [k0[0] - 8, k0[1] - 34]], {weight: 2.2, color: '#5a6a30', closed: false, still: true});
  });
  if (pop <= 0) return;
  const b = at(104, 6), q = (x: number, y: number): Pt => [b[0] + x * pop, b[1] + y * pop];
  inkLine(p, s + 100, [q(-10, 76), q(2, 34), q(2, 6)], {weight: 2, color: '#5a6a30', closed: false, still: true});
  leaf(p, s + 110, q(-6, 56), -2.5, 52 * pop, 12 * pop, '#4f7a3a'); leaf(p, s + 150, q(-6, 62), 0.4 + 2.2, 44 * pop, 11 * pop, '#3f6a30');
  // sepals under the flower, five white rounded petals with veins, a green-yellow centre ringed with blue-grey anthers
  hardFill(p, s + 190, '#5a8a3e', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n): Pt => { const r = n % 2 ? 12 : 28, t = (n / 10) * 6.2832 + 0.3; return [q(0, 4)[0] + Math.cos(t) * r * pop, q(0, 4)[1] + Math.sin(t) * r * pop]; }));
  bloom(p, s + 200, q(0, 0), 40 * pop, -1.57, {petal: '#faf6ec', edge: '#c8bca0', throat: '#cce068', stamen: '#a8a890', anth: '#6a78a8', vein: '#d4c8aa'});
  hardFill(p, s + 300, '#e8e07a', ell(...q(0, 0), 7 * pop, 7 * pop, 8));
  hardFill(p, s + 310, '#e8f4d8', ell(q(16, 70)[0], q(16, 70)[1], 7 * pop, 8 * pop, 8));   // a bud
};

const glory = (p: Painter, at: At, pop: number, s: number) => {
  // water spinach: a hollow stem with nodes, arrowhead leaves with veins, a curled tendril
  const st: Pt[] = [at(-108, 96), at(-92, 36), at(-62, -10), at(-24, -44), at(8, -62)];
  inkLine(p, s, st, {weight: 3.4, color: '#7aaa52', closed: false, still: true, curve: 0.4});
  inkLine(p, s + 1, st, {weight: 1.2, color: '#c4e0a0', closed: false, still: true, curve: 0.4});
  for (const n of [1, 2, 3]) hardFill(p, s + 2 + n, '#6a9a48', ell(st[n][0], st[n][1], 4.5, 4.5, 8));
  const arrow = (c: Pt, a: number, k: number, id: number) => {
    const pts: Pt[] = [[0, -34], [20, -4], [26, 18], [10, 20], [0, 30], [-10, 20], [-26, 18], [-20, -4]].map(([x, y]) => rot(c, a, x * k, y * k));
    hardFill(p, s + id, '#4f8a3e', pts);
    washAt(p, s + id + 1, '#8ac060', 130, [0, 1, 2, 3].map((n): Pt => rot(c, a, [0, -18, -6, 0][n] * k, [-30, -2, 14, 22][n] * k)), 0.2, 0.3);
    inkLine(p, s + id + 2, [rot(c, a, 0, 28 * k), rot(c, a, 0, -30 * k)], {weight: 0.9, color: '#2f5a28', closed: false, still: true});
    for (const sd of [-1, 1]) for (const [vy, vx] of [[8, 16], [-4, 12], [-16, 8]]) inkLine(p, s + id + 3 + (vy + 20) * 2 + (sd > 0 ? 1 : 0), [rot(c, a, 0, vy * k), rot(c, a, sd * vx * k, (vy - 6) * k)], {weight: 0.4, color: '#2f5a28', closed: false, still: true});
    inkLine(p, s + id + 80, pts, {weight: 0.8, color: '#2a4a24', still: true});
  };
  arrow(at(-96, 56), -1.1, 1.5, 20); arrow(at(-70, 6), 1.0, 1.7, 160); arrow(at(-38, -34), -0.9, 1.5, 320); arrow(at(2, -58), 1.2, 1.4, 480); arrow(at(-110, 100), 0.1, 1.1, 640);
  inkLine(p, s + 800, [at(-50, -12), at(-34, -22), at(-26, -10), at(-36, -2), at(-42, -10)], {weight: 1.1, color: '#7aaa52', closed: false, still: true, curve: 0.5});
  if (pop <= 0) return;
  const b = at(74, 10), q = (x: number, y: number): Pt => [b[0] + x * pop, b[1] + y * pop];
  inkLine(p, s + 900, [q(-14, 84), q(-2, 40), q(0, 8)], {weight: 2, color: '#5a8a3e', closed: false, still: true});
  // trumpet from the front: five lobes shading from violet at the rim to pale at the throat, pleat lines, white star, stamens
  hardFill(p, s + 910, '#5a8a3e', ell(...q(0, 10), 16 * pop, 10 * pop, 10));
  bloom(p, s + 920, q(0, 0), 56 * pop, -1.2, {petal: '#9a78d8', edge: '#6a46b0', throat: '#fbf8ff', stamen: '#e8d070', anth: '#f4e090', vein: '#8a68c8'});
  washAt(p, s + 1000, '#f0e4ff', 200, ell(...q(0, 0), 30 * pop, 30 * pop, 16), 0.3, 0.3);
  for (let i = 0; i < 5; i++) { const a = -1.2 + (i / 5) * 6.2832 + 0.628; hardFill(p, s + 1010 + i, '#fdfaff', [q(Math.cos(a) * 6, Math.sin(a) * 6), q(Math.cos(a + 0.35) * 30, Math.sin(a + 0.35) * 30), q(Math.cos(a) * 36, Math.sin(a) * 36), q(Math.cos(a - 0.35) * 30, Math.sin(a - 0.35) * 30)]); }
  hardFill(p, s + 1020, '#fff8d0', ell(...q(0, 0), 5 * pop, 5 * pop, 8));
  hardFill(p, s + 1030, '#8a68c8', [q(-30, 70), q(-18, 60), q(-4, 76), q(-12, 96), q(-26, 92)]);   // a furled bud
  inkLine(p, s + 1031, [q(-30, 70), q(-18, 60), q(-4, 76), q(-12, 96), q(-26, 92)], {weight: 0.7, color: '#4a3088', still: true});
};

const TILE_PAINT: Record<FlowerTile, (p: Painter, at: At, pop: number, s: number) => void> = {mango, banana, chilli, 'morning-glory': glory};
/** Loose painted blossoms (five-petal, in the four flower colours) drifting down across the card, each turning slowly; deterministic in `f`. They are the only art allowed outside the tiles. */
export const LOOSE_BLOSSOMS = 14;
export const looseBlossoms = (f: number): {x: number; y: number; a: number; r: number; col: number}[] => Array.from({length: LOOSE_BLOSSOMS}, (_, i) => {
  const sp = 0.7 + 0.8 * hash(7000 + i), x0 = 60 + 960 * hash(7100 + i), y0 = -80 + 1000 * hash(7200 + i);
  return {x: x0 + 34 * Math.sin(f * 0.07 * sp + i), y: ((y0 + f * 3.2 * sp + 100) % 1160) - 100 + 180, a: f * 0.04 * sp + i, r: 13 + 9 * hash(7300 + i), col: i % 4};
});
const BLOSSOM_COL = [{petal: '#f4d8cc', edge: '#d89a8a'}, {petal: '#b05884', edge: '#6a1e44'}, {petal: '#faf6ec', edge: '#c8bca0'}, {petal: '#a98be0', edge: '#6a46b0'}];

/** The R2 flower-pop card at shot frame `f`: same slide, pops and scrim as `paintFlowerPopCard`, richer tiles, plus loose blossoms after the first pop. */
export const paintFlowerPopCardR2 = (p: Painter, f: number, o: {scrim?: number; seed?: number; blossoms?: boolean} = {}) => {
  const seed = o.seed ?? 45000, slide = flowerSlide(f), dy = (1 - slide) * 900, sc = o.scrim ?? 0.5;
  if (sc > 0) washAt(p, seed, '#10150f', 255 * sc * slide, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);
  FLOWER_TILES.forEach((id, i) => {
    const [cx, cy] = TILE_AT[id], oy = cy + dy, h = TILE / 2, s = seed + 100 + i * 2000;
    hardFill(p, s, mixColor('#f6ecd4', '#e8dab6', 0.3), [[cx - h, oy - h], [cx + h, oy - h], [cx + h, oy + h], [cx - h, oy + h]]);
    washAt(p, s + 1, '#d8c498', 130, [[cx - h + 8, oy + h - 64], [cx + h - 8, oy + h - 64], [cx + h - 8, oy + h - 8], [cx - h + 8, oy + h - 8]], 0.3, 0.3);
    for (let k = 0; k < 6; k++) hardFill(p, s + 2 + k, '#dccba4', ell(cx - h + 40 + 60 * k + 10 * hash(s + k), oy + h - 30 + 10 * hash(s + 9 + k), 22, 4, 8));   // table-cloth grain under the food
    TILE_PAINT[id](p, (x, y) => [cx + x, oy + y], flowerPopScale(id, f), s + 10);
  });
  if (o.blossoms !== false && f > 8 && slide > 0.95) looseBlossoms(f).forEach((b, i) => {
    if (b.y < -40 || b.y > 1980) return;
    const col = BLOSSOM_COL[b.col];
    bloom(p, seed + 30000 + i * 60, [b.x, b.y], b.r, b.a, {petal: col.petal, edge: col.edge, throat: '#e8c03a', n: 5});
  });
};
export type {FlowerTile};

import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {paintHalo} from '../kit/fog';
import {paintBox, paintSorted, qx, qy, qz, wFill, wInk, wp, type Box, type Item} from '../kit/world';
import {camPoint, camUnit} from '../kit/ycam';
import {lit, type Light, type Painter, type Pt, type V3, type YCam} from './core';
import {cylinder} from './under';
import {VC} from './village';

// SET-SHOP (N18-03, EP18 shots 9-10, W-SHOP): the village grocery at night with a glass pharmacy cabinet, one hanging lamp, moths and a bead curtain. Boss, 14 Nov 2026.
// Space SHOP (metres, brief "Set plan - SET-SHOP"): origin the shop floor centre, +x right seen from the door, +y up, +z toward the door. Pharmacy cabinet x 0.5..1.7,
// y 0.9..2.1 against the back wall z -2.45; counter z -1.35..-1.05; shopkeeper mark (0.4, 0, -1.6); entry mark (0.4, 0, -0.5); lamp (0.5, 2.4, -1.2); bead
// curtain across the open front at z +1.5. The shop is open-fronted (shutters up) so the camera outside the door sees in. Night only: one warm lamp, the
// colours muted under the subjects (UT12a). `stock` is the cabinet's contents: 'few' (boxes and a half-empty strip), 'last' (one box) or 'bare' (empty, shot 10).

export const SHOP_LAMP: V3 = [0.5, 2.4, -1.2];
export const SHOP_LIGHT: Light = {amb: '#1c2238', k: 0.46};
export const SC = {wall: '#5a7270', floor: '#6a6258', ceiling: '#4a3c30', counter: '#7a5a3a', frame: '#3a5a48', glass: '#a9c4cc', shelf: '#8a6a44', ink: '#2b211c', bead: '#d8a8a0'} as const;
export type ShopStock = 'few' | 'last' | 'bare';

const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Box => ({x0, x1, y0, y1, z0, z1});
/** Warmth of a point from the lamp (0..1): falls off over about 3 m. */
export const shopLampK = (v: V3) => Math.max(0, 1 - Math.hypot(v[0] - SHOP_LAMP[0], v[1] - SHOP_LAMP[1], v[2] - SHOP_LAMP[2]) / 3.2);
const warm = (col: string, v: V3, L: Light, s = 1) => mixColor(lit(L, col, -0.4 * shopLampK(v) * s), '#ffb868', 0.2 * shopLampK(v) * s);
const pbw = (p: Painter, c: YCam, seed: number, b: Box, col: string, L: Light, ink = true) => {
  const mid: V3 = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2];
  paintBox(p, c, seed, b, warm(col, mid, L), {top: -0.1, left: 0.1, right: 0.2, front: 0.04, back: 0.16}, {ink});
};

export type ShopOpts = {t: number; stock?: ShopStock; /** Bead curtain: 'full' strands across the front, 'off' none (default 'full'). */ curtain?: 'full' | 'off'; extra?: Item[]; light?: Light};

/** One moth in orbit round the lamp: world point of moth `i` at second `t` (a pure function, seekable). */
export const mothAt = (i: number, t: number): V3 => {
  const a = t * (1.6 + 0.9 * hash(80100 + i)) + hash(80110 + i) * 6.28, r = 0.18 + 0.26 * hash(80120 + i), tilt = 0.5 + 0.4 * hash(80130 + i);
  return [SHOP_LAMP[0] + r * Math.cos(a), SHOP_LAMP[1] - 0.05 + 0.2 * Math.sin(a * tilt + i), SHOP_LAMP[2] + r * Math.sin(a) * 0.8];
};

/** The village grocery (no cast): back wall and shelves, counter, glass pharmacy cabinet, lamp with moths, bead curtain. */
export const paintShop = (p: Painter, c: YCam, o: ShopOpts) => {
  const L = o.light ?? SHOP_LIGHT, stock = o.stock ?? 'few';
  hardFill(p, 80000, '#12161f', [[-200, -200], [1280, -200], [1280, 2120], [-200, 2120]]);
  // floor, back wall, ceiling beam line, side walls (open front)
  wFill(p, c, 80001, warm(SC.floor, [0.5, 0, -0.5], L, 0.7), qy(0, -4, 4, -2.45, 2.2));
  for (let i = 0; i < 9; i++) { const x = -3.6 + 0.9 * i; wInk(p, c, 80010 + i, [[x, 0.004, -2.45], [x, 0.004, 2.2]], {closed: false, weight: 0.4, color: warm('#4a443c', [x, 0, -0.5], L, 0.7)}); }
  wFill(p, c, 80020, warm(SC.wall, [0.5, 1.2, -2.45], L, 0.9), qz(-2.45, -4, 4, 0, 2.7));
  for (let x = -3.8; x < 4; x += 0.3) wInk(p, c, 80030 + Math.round((x + 4) * 10), [[x, 0, -2.44], [x, 2.7, -2.44]], {closed: false, weight: 0.35, color: warm('#465e5c', [x, 1.2, -2.44], L, 0.8)});
  wFill(p, c, 80100, warm('#3a4a48', [-3.9, 1.2, 0], L, 0.6), qx(-3.95, 0, 2.7, -2.45, 2.2));
  wFill(p, c, 80101, warm('#3a4a48', [3.9, 1.2, 0], L, 0.6), qx(3.95, 0, 2.7, -2.45, 2.2));
  wFill(p, c, 80102, warm(SC.ceiling, [0.5, 2.7, -0.5], L, 0.8), qy(2.7, -4, 4, -2.45, 2.2));
  const items: Item[] = [];
  // grocery shelving to the left of the cabinet: three boards with noodle packs, bottles, cans and bags in muted colours
  items.push({at: [-1.4, 1.0, -2.3], bias: 0.3, draw: (q, cc) => {
    for (let r = 0; r < 4; r++) pbw(q, cc, 80200 + r * 3, box(-2.8, -0.2, 0.55 + r * 0.45, 0.6 + r * 0.45, -2.42, -2.12), SC.shelf, L);
    pbw(q, cc, 80220, box(-2.82, -2.76, 0, 2.3, -2.42, -2.12), VC.woodDark, L, false);
    pbw(q, cc, 80221, box(-0.24, -0.18, 0, 2.3, -2.42, -2.12), VC.woodDark, L, false);
    const cols = ['#a8663a', '#7a8a4a', '#8a5a6a', '#6a7a9a', '#b8a050', '#8a7060'];
    for (let r = 0; r < 4; r++) for (let i = 0; i < 11; i++) {
      const x = -2.7 + i * 0.22 + 0.04 * hash(80300 + r * 20 + i), h = 0.14 + 0.1 * hash(80330 + r * 20 + i), col = cols[(r * 3 + i) % cols.length];
      if (hash(80360 + r * 20 + i) < 0.18) continue;
      if ((r + i) % 4 === 0) cylinder(q, cc, 80400 + r * 40 + i * 3, [x + 0.06, 0.6 + r * 0.45, -2.28], 0.04, h + 0.05, warm(col, [x, 1, -2.3], L, 0.8), {ink: warm('#2a2e34', [x, 1, -2.3], L)});
      else pbw(q, cc, 80400 + r * 40 + i * 3, box(x, x + 0.14, 0.6 + r * 0.45, 0.6 + r * 0.45 + h, -2.38, -2.24), col, L, false);
    }
  }});
  // counter (wood, a glass jar of sweets, a scale), a stool
  items.push({at: [0.4, 0, -1.2], bias: -0.1, draw: (q, cc) => {
    pbw(q, cc, 80500, box(-1.8, 2.2, 0, 0.98, -1.35, -1.05), SC.counter, L);
    pbw(q, cc, 80501, box(-1.85, 2.25, 0.98, 1.03, -1.4, -1.0), mixColor(SC.counter, '#c8a468', 0.25), L);
    for (let i = 0; i < 8; i++) wInk(q, cc, 80510 + i, [[-1.7 + i * 0.5, 0.05, -1.04], [-1.7 + i * 0.5, 0.95, -1.04]], {closed: false, weight: 0.4, color: warm('#4a3220', [0.4, 0.5, -1.04], L)});
    cylinder(q, cc, 80520, [-1.2, 1.03, -1.22], 0.07, 0.17, warm('#cfe0e4', [-1.2, 1.1, -1.2], L), {top: warm('#a8663a', [-1.2, 1.2, -1.2], L), ink: warm('#3a4048', [-1.2, 1.1, -1.2], L)});
    cylinder(q, cc, 80523, [1.9, 1.03, -1.2], 0.05, 0.1, warm('#d8d0b4', [1.9, 1.1, -1.2], L), {ink: warm('#3a4048', [1.9, 1.1, -1.2], L)});
  }});
  // pharmacy cabinet: green wooden frame, glass front, three shelves; contents by `stock`
  items.push({at: [1.1, 0, -2.3], bias: 0.1, draw: (q, cc) => {
    const cab = box(0.5, 1.7, 0.9, 2.1, -2.42, -2.1);
    pbw(q, cc, 80600, box(0.5, 1.7, 0.0, 0.9, -2.42, -2.1), SC.frame, L);                       // base cupboard
    pbw(q, cc, 80601, cab, '#1a1e22', L, false);                                                // dark interior
    for (let s = 0; s < 4; s++) pbw(q, cc, 80610 + s * 3, box(0.52, 1.68, 1.2 + s * 0.3 - 0.015, 1.2 + s * 0.3 + 0.015, -2.4, -2.14), mixColor(SC.shelf, '#d8d0b4', 0.3), L, false);
    const bx = (x: number, y: number, w: number, h: number, col: string, id: number) => pbw(q, cc, 80700 + id * 3, box(x, x + w, y, y + h, -2.36, -2.28), col, L, false);
    if (stock === 'few') {
      bx(0.62, 1.2, 0.16, 0.12, '#f4f4ee', 1); bx(0.8, 1.2, 0.12, 0.09, '#3a9a5a', 2); bx(0.96, 1.2, 0.18, 0.1, '#d8b878', 3); bx(1.2, 1.2, 0.14, 0.14, '#f4f4ee', 4);
      bx(0.64, 1.5, 0.14, 0.1, '#b8c8d8', 5); bx(0.84, 1.5, 0.16, 0.13, '#f4f4ee', 6); bx(1.3, 1.5, 0.12, 0.11, '#d8b878', 7); bx(0.7, 1.8, 0.2, 0.1, '#b8c8d8', 8);
      // the one half-empty strip leaning on the shelf at x 1.45
      wFill(q, cc, 80760, warm('#c8ccd0', [1.45, 1.55, -2.3], L), [[1.42, 1.5, -2.3], [1.56, 1.5, -2.3], [1.56, 1.62, -2.3], [1.42, 1.62, -2.3]]);
      for (let i = 0; i < 4; i++) wFill(q, cc, 80761 + i, i < 2 ? warm('#e8ecee', [1.5, 1.56, -2.3], L) : '#262a30', [[1.43 + i * 0.03, 1.52, -2.29], [1.45 + i * 0.03, 1.52, -2.29], [1.45 + i * 0.03, 1.58, -2.29], [1.43 + i * 0.03, 1.58, -2.29]]);
    } else if (stock === 'last') bx(1.05, 1.2, 0.16, 0.12, '#f4f4ee', 1);
    // glass front: two doors with a pale reflection and a lamp glint; frame mullions
    const gl = wp(cc, [[0.52, 0.92, -2.09], [1.68, 0.92, -2.09], [1.68, 2.08, -2.09], [0.52, 2.08, -2.09]]);
    if (gl.length > 2) { washAt(q, 80800, warm(SC.glass, [1.1, 1.5, -2.09], L, 0.7), 70, gl, 0.1, 0.15); }
    const refl = wp(cc, [[0.6, 1.2, -2.09], [0.78, 1.2, -2.09], [0.98, 2.0, -2.09], [0.8, 2.0, -2.09]]);
    if (refl.length > 2) washAt(q, 80801, '#e8f4f8', 60, refl, 0.1, 0.1);
    for (const x of [0.5, 1.1, 1.7]) pbw(q, cc, 80810 + Math.round(x * 10), box(x - 0.03, x + 0.03, 0.9, 2.1, -2.14, -2.08), SC.frame, L, false);
    pbw(q, cc, 80820, box(0.47, 1.73, 2.07, 2.13, -2.15, -2.07), SC.frame, L, false);
    pbw(q, cc, 80821, box(0.47, 1.73, 0.88, 0.94, -2.15, -2.07), SC.frame, L, false);
    // a green cross sign on the cabinet top
    wFill(q, cc, 80830, '#3a9a5a', qz(-2.09, 1.06, 1.14, 2.16, 2.36)); wFill(q, cc, 80831, '#3a9a5a', qz(-2.09, 1.0, 1.2, 2.24, 2.28));
    void cab;
  }});
  paintSorted(p, c, [...items, ...(o.extra ?? [])]);
  // the lamp: cord, shade, bulb, warm halo; moths round it
  const lp = camPoint(c, SHOP_LAMP), u = camUnit(c, SHOP_LAMP), top = camPoint(c, [SHOP_LAMP[0], 2.7, SHOP_LAMP[2]]);
  if (lp && top) {
    inkLine(p, 80900, [top, [lp[0], lp[1] - 0.12 * u]], {closed: false, weight: 0.6, color: '#1a1814', still: true});
    hardFill(p, 80901, '#2a2622', [[lp[0] - 0.09 * u, lp[1] - 0.04 * u], [lp[0] + 0.09 * u, lp[1] - 0.04 * u], [lp[0] + 0.05 * u, lp[1] - 0.12 * u], [lp[0] - 0.05 * u, lp[1] - 0.12 * u]]);
    paintHalo(p, {x: lp[0], y: lp[1], r: 0.7 * u, color: '#ffb35a', level: 0.3, squash: 0.85, t: o.t, seed: 80910});
    hardFill(p, 80920, '#fff0c0', Array.from({length: 12}, (_, i): Pt => [lp[0] + 0.035 * u * Math.cos((i / 12) * 6.28), lp[1] + 0.045 * u * Math.sin((i / 12) * 6.28)]));
    for (let i = 0; i < 6; i++) {
      const m = camPoint(c, mothAt(i, o.t)), flap = Math.sin(o.t * 38 + i * 2.1) > 0 ? 1 : 0.45, s = 0.026 * u;
      if (m) { hardFill(p, 80930 + i * 2, '#e6dcc4', [[m[0], m[1]], [m[0] - s * 1.2, m[1] - s * flap], [m[0] - s * 0.8, m[1] + s * 0.5]]); hardFill(p, 80931 + i * 2, '#d8cdb0', [[m[0], m[1]], [m[0] + s * 1.2, m[1] - s * flap], [m[0] + s * 0.8, m[1] + s * 0.5]]); }
    }
  }
  // bead curtain across the open front (z 1.5): thin strands with beads, translucent against the dark
  if ((o.curtain ?? 'full') === 'full') {
    for (let i = 0; i < 26; i++) {
      const x = -0.5 + i * 0.075, a = camPoint(c, [x, 2.45, 1.5]), b = camPoint(c, [x + 0.006 * Math.sin(o.t * 1.3 + i), 0.7 + 0.1 * hash(80950 + i), 1.5]);
      if (!a || !b) continue;
      inkLine(p, 80960 + i, [a, b], {closed: false, weight: 0.4, color: warm('#8a6a60', [x, 1.5, 1.5], L, 0.6), still: true});
      for (let j = 0; j < 9; j++) { const q = [a[0] + (b[0] - a[0]) * (j / 8), a[1] + (b[1] - a[1]) * (j / 8)] as Pt, r = 0.011 * camUnit(c, [x, 1.5, 1.5]); hardFill(p, 81000 + i * 10 + j, j % 2 ? SC.bead : '#c8c0a0', Array.from({length: 6}, (_, k): Pt => [q[0] + r * Math.cos((k / 6) * 6.28), q[1] + r * Math.sin((k / 6) * 6.28)])); }
    }
  }
};

import {INK, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, wp, type Item} from '../kit/world';
import type {YCam} from '../kit/ycam';

// EDU-EP19 EVA mats (brief N7, VD08; scene sheets B03): 13 mats in four muted colours on the trail line, a stack of 14 by the fence.
// Started at the W2.4 comp card (15 Nov 2026): colours, orders, sizes and the sheet painters (top view with foreshortening, stack
// elevation, damp footprint). The world-space row, lift-swap motion and slap-down are W3/W5 work on top of these.

/** Muted EVA tones (brief colour key): teal, terracotta, ochre, slate. Never brighter than the girl's face. */
export const MAT_COLORS = {T: '#4f8f8a', R: '#b8654a', O: '#c9a24a', S: '#6d7a86'} as const;
export type MatColor = keyof typeof MAT_COLORS;
/** Lay order O1 by slot 0-12 (B03 W-MATS, scene sheets): the ordered look. */
export const ORDER_O1: MatColor[] = ['T', 'R', 'O', 'S', 'T', 'R', 'O', 'S', 'T', 'R', 'O', 'S', 'T'];
/** Swapped order O2 by slot 0-12 (MUM's swap, B03-SH04): the shuffled look, same line. */
export const ORDER_O2: MatColor[] = ['R', 'S', 'T', 'T', 'O', 'R', 'S', 'O', 'R', 'T', 'S', 'O', 'T'];
/** Glow level per slot after the swap (B03-SH05, jumbled). */
export const O2_LEVELS = [0.1, 0.28, 0.12, 0.26, 0.08, 0.28, 0.1, 0.26, 0.14, 0.3, 0.08, 0.24, 0.12];
/** Mat size, m: 0.60 x 0.60 x 0.025; slots 0.9 m apart from x -5.4 to +5.4; stack of 14 on a 0.12 m pallet. */
export const MAT = {side: 0.6, thick: 0.025, pitch: 0.9, x0: -5.4, stack: 14, pallet: 0.12} as const;
export const slotX = (i: number) => MAT.x0 + i * MAT.pitch;

/**
 * One mat seen from above at a camera pitch: `c` the mat centre on the ground (px), `unit` px per m, `k` 0..1 the vertical squash of the
 * top (1 = straight down, 0.3 = a low eye), `color` a MAT_COLORS key. The near edge shows the 2.5 cm thickness, the edges carry the EVA
 * jigsaw teeth. `print` adds the damp footprint mark (a child's sneaker sole, toe toward +x).
 */
export const paintMatTop = (p: Painter, seed: number, c: Pt, unit: number, color: MatColor, o: {k?: number; print?: number} = {}) => {
  const k = o.k ?? 0.45, hw = (MAT.side / 2) * unit, hd = hw * k, t = Math.max(2, MAT.thick * unit * (1 - k * 0.6)), base = MAT_COLORS[color];
  const top: Pt[] = [[c[0] - hw, c[1] - hd], [c[0] + hw, c[1] - hd], [c[0] + hw, c[1] + hd], [c[0] - hw, c[1] + hd]];
  solid(p, seed, mixColor(base, INK, 0.35), [[c[0] - hw, c[1] + hd], [c[0] + hw, c[1] + hd], [c[0] + hw, c[1] + hd + t], [c[0] - hw, c[1] + hd + t]], 3, 0.03, 0.05);
  solid(p, seed + 1, base, top, 4, 0.12, 0.12);
  // EVA texture: a soft lighter sheen toward the light and a fine dimple field (a few dabs, value close to the base, UT12a).
  washAt(p, seed + 2, mixColor(base, '#fff6e0', 0.35), 60, [[c[0] - hw * 0.9, c[1] - hd * 0.9], [c[0] + hw * 0.2, c[1] - hd * 0.9], [c[0] - hw * 0.3, c[1] + hd * 0.2], [c[0] - hw * 0.9, c[1] + hd * 0.1]], 0.3, 0.3);
  // Jigsaw teeth on the near and far edges.
  for (const ey of [-hd, hd]) for (let i = 0; i < 5; i++) {
    const x = c[0] - hw + ((i + 0.5) / 5) * 2 * hw, w = hw * 0.12, dy = (ey < 0 ? -1 : 1) * hd * 0.1;
    solid(p, seed + 10 + i + (ey < 0 ? 0 : 5), base, [[x - w, c[1] + ey], [x + w, c[1] + ey], [x + w * 0.8, c[1] + ey + dy], [x - w * 0.8, c[1] + ey + dy]], 2, 0.05, 0.05);
  }
  inkLine(p, seed + 30, top, {color: mixColor(base, INK, 0.55), weight: 0.7, curve: 0.05});
  if (o.print) {
    // Damp footprint: two darker soft ovals (sole + heel), opacity = `print` 0..1.
    const fx = c[0] - hw * 0.12, fy = c[1] + hd * 0.05, sl = 0.11 * unit, sw = 0.045 * unit * Math.max(0.35, k);
    washAt(p, seed + 40, mixColor(base, INK, 0.5), 120 * o.print, ell(fx, fy, sl, sw), 0.15, 0.2);
    washAt(p, seed + 41, mixColor(base, INK, 0.5), 110 * o.print, ell(fx + sl * 1.55, fy, sl * 0.45, sw * 0.9), 0.15, 0.2);
  }
};
const ell = (cx: number, cy: number, rx: number, ry: number): Pt[] => Array.from({length: 16}, (_, i): Pt => [cx + rx * Math.cos((i / 16) * Math.PI * 2), cy + ry * Math.sin((i / 16) * Math.PI * 2)]);

/** The 13-mat row from the side at a low pitch: slots spaced `MAT.pitch`, centred on `c` (px of slot 6). */
export const paintMatRow = (p: Painter, seed: number, c: Pt, unit: number, order: MatColor[], o: {k?: number; prints?: boolean} = {}) =>
  order.forEach((col, i) => paintMatTop(p, seed + i * 50, [c[0] + (i - 6) * MAT.pitch * unit, c[1]], unit, col, {k: o.k, print: o.prints ? 0.7 : 0}));

/** The mat stack ST in elevation (seen from the lawn): pallet, 14 mats in the four colours, top teal; `g` ground centre (px). */
export const paintMatStack = (p: Painter, seed: number, g: Pt, unit: number) => {
  const hw = (MAT.side / 2) * unit, ph = MAT.pallet * unit;
  solid(p, seed, '#8a6e4e', [[g[0] - hw * 1.05, g[1]], [g[0] + hw * 1.05, g[1]], [g[0] + hw * 1.05, g[1] - ph], [g[0] - hw * 1.05, g[1] - ph]], 4, 0.15, 0.1);
  for (const sx of [-0.8, 0, 0.8]) solid(p, seed + 1 + sx * 10, '#5a4634', [[g[0] + sx * hw - 0.05 * unit, g[1]], [g[0] + sx * hw + 0.05 * unit, g[1]], [g[0] + sx * hw + 0.05 * unit, g[1] - ph * 0.6], [g[0] + sx * hw - 0.05 * unit, g[1] - ph * 0.6]], 3, 0.05, 0.05);
  const cols: MatColor[] = ['S', 'O', 'R', 'T', 'O', 'S', 'R', 'T', 'S', 'O', 'R', 'S', 'O', 'T'];
  cols.forEach((col, i) => {
    const y0 = g[1] - ph - i * MAT.thick * unit, y1 = y0 - MAT.thick * unit, j = ((i * 37) % 7 - 3) * 0.006 * unit;
    solid(p, seed + 20 + i, MAT_COLORS[col], [[g[0] - hw + j, y0], [g[0] + hw + j, y0], [g[0] + hw + j, y1], [g[0] - hw + j, y1]], 3, 0.06, 0.05);
  });
  const top = g[1] - ph - MAT.stack * MAT.thick * unit;
  inkLine(p, seed + 60, [[g[0] - hw * 1.05, g[1]], [g[0] - hw, top], [g[0] + hw, top], [g[0] + hw * 1.05, g[1]]], {closed: false, weight: 0.8, color: mixColor('#4a3a2e', INK, 0.4), curve: 0.05});
};

// ------------------------------------------------------------------------------------------------ world-space mats (W3, LF01 stack, LF05 row)
/** One mat on the ground in space F: centre `at` (x, z), colour, optional damp footprint 0..1 and a small yaw (rad) for a hand-laid look. */
export const paintMatW = (p: Painter, c: YCam, seed: number, at: V3, color: MatColor, o: {print?: number; yaw?: number; y?: number} = {}) => {
  const h = MAT.side / 2, base = MAT_COLORS[color], y0 = o.y ?? 0, y1 = y0 + MAT.thick, a = o.yaw ?? 0, ca = Math.cos(a), sa = Math.sin(a);
  const P = (u: number, v: number, y: number): V3 => [at[0] + u * ca - v * sa, y, at[2] + u * sa + v * ca];
  const top = [P(-h, -h, y1), P(h, -h, y1), P(h, h, y1), P(-h, h, y1)];
  // Near edge (the 2.5 cm side toward the camera) then the top, a soft sheen toward the light, jigsaw teeth on the near edge, an ink outline.
  const near = wp(c, [P(-h, h, y0), P(h, h, y0), P(h, h, y1), P(-h, h, y1)]);
  if (near.length >= 3) solid(p, seed, mixColor(base, INK, 0.35), near, 3, 0.03, 0.05);
  const q = wp(c, top);
  if (q.length < 3) return;
  solid(p, seed + 1, base, q, 4, 0.1, 0.1);
  const sheen = wp(c, [P(-h * 0.9, -h * 0.9, y1 + 0.001), P(h * 0.1, -h * 0.9, y1 + 0.001), P(-h * 0.4, h * 0.2, y1 + 0.001), P(-h * 0.9, h * 0.1, y1 + 0.001)]);
  if (sheen.length >= 3) washAt(p, seed + 2, mixColor(base, '#fff6e0', 0.3), 60, sheen, 0.3, 0.3);
  for (let i = 0; i < 5; i++) {
    const u = -h + ((i + 0.5) / 5) * 2 * h, w = h * 0.12, tooth = wp(c, [P(u - w, h, y1), P(u + w, h, y1), P(u + w * 0.8, h + 0.03, y1), P(u - w * 0.8, h + 0.03, y1)]);
    if (tooth.length >= 3) solid(p, seed + 10 + i, base, tooth, 2, 0.04, 0.05);
  }
  inkLine(p, seed + 30, q, {color: mixColor(base, INK, 0.55), weight: 0.7, curve: 0.04});
  if (o.print) {
    const sole = wp(c, Array.from({length: 14}, (_, k): V3 => P(-0.03 + 0.1 * Math.cos((k / 14) * 6.283), y1 + 0.002, 0.04 * Math.sin((k / 14) * 6.283)))),
      heel = wp(c, Array.from({length: 12}, (_, k): V3 => P(0.12 + 0.045 * Math.cos((k / 12) * 6.283), y1 + 0.002, 0.035 * Math.sin((k / 12) * 6.283))));
    if (sole.length >= 3) washAt(p, seed + 40, mixColor(base, INK, 0.45), 110 * o.print, sole, 0.15, 0.2);
    if (heel.length >= 3) washAt(p, seed + 41, mixColor(base, INK, 0.45), 100 * o.print, heel, 0.15, 0.2);
  }
};
/** The mat row on the trail line (z 0), slot i at `slotX(i)`, one depth-sorted item per mat so the cast stands on them. */
export const matRowItems = (p: Painter, c: YCam, order: MatColor[], o: {prints?: number} = {}): Item[] =>
  order.map((col, i) => ({at: [slotX(i), 0, 0] as V3, bias: 0.6, draw: () => paintMatW(p, c, 9500 + i * 50, [slotX(i), 0, 0], col, {print: o.prints, yaw: (((i * 37) % 7) - 3) * 0.012})}));
/** The mat stack ST in the world: a 0.12 m pallet and 14 mats in the four colours, top teal, at `at` (brief: (1.6, 0, -6.3)). */
export const matStackItem = (p: Painter, c: YCam, at: V3, o: {top?: V3} = {}): Item => ({at, draw: () => {
  const h = MAT.side / 2 + 0.02;
  paintBox(p, c, 9300, {x0: at[0] - h, x1: at[0] + h, y0: 0, y1: MAT.pallet, z0: at[2] - h, z1: at[2] + h}, '#8a6e4e', {front: 0.1}, {});
  const cols: MatColor[] = ['S', 'O', 'R', 'T', 'O', 'S', 'R', 'T', 'S', 'O', 'R', 'S', 'O', 'T'];
  cols.forEach((col, i) => {
    const y0 = MAT.pallet + i * MAT.thick, j = (((i * 37) % 7) - 3) * 0.008, s = MAT.side / 2;
    // W5 (B03-SH02): the top mat moves by `o.top` (the girl drags it off the stack); the others stay.
    const d: V3 = i === cols.length - 1 && o.top ? o.top : [0, 0, 0];
    paintBox(p, c, 9320 + i * 4, {x0: at[0] - s + j + d[0], x1: at[0] + s + j + d[0], y0: y0 + d[1], y1: y0 + MAT.thick + d[1], z0: at[2] - s + d[2], z1: at[2] + s - j + d[2]}, MAT_COLORS[col], {top: -0.04, front: 0.08}, {});
  });
}});

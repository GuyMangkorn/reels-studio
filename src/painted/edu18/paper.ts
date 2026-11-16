import {hardFill, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// EDU-EP18 papercut layer (Boss, 15 Nov 2026, comp-card fix round 1): the soft stacked-paper look shared by the EP18 hippo, hen and dog copy.
// Each layer is a flat opaque cut with a soft drop shadow under it and a faint painterly glaze toward its lit edge; no ink outline.
// Moves to the kit with the creatures at intake (kit README#kit-intake).

/** The shadow paper casts on the layer below: screen offset (px), blur spread (px), colour and opacity (0..1). */
export type PaperShadow = {dx: number; dy: number; blur: number; col?: string; op?: number};
export const PAPER_SHADOW_COL = '#2a2030';

const centroid = (q: Pt[]): Pt => [q.reduce((a, v) => a + v[0], 0) / q.length, q.reduce((a, v) => a + v[1], 0) / q.length];
/** Push every vertex `g` px away from the centroid (a soft-shadow ring for round cuts). */
export const growPoly = (q: Pt[], g: number): Pt[] => { const [mx, my] = centroid(q); return q.map(([x, y]) => { const dx = x - mx, dy = y - my, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * g, y + (dy / l) * g]; }); };
/** Shrink toward a point `at` by factor `k` (1 = unchanged). */
export const shrinkToward = (q: Pt[], at: Pt, k: number): Pt[] => q.map(([x, y]) => [at[0] + (x - at[0]) * k, at[1] + (y - at[1]) * k]);

/** Soft drop shadow: three widening low-alpha passes offset down/right. */
export const paperShadow = (p: Painter, seed: number, q: Pt[], s: PaperShadow) => {
  if (q.length < 3) return;
  const col = s.col ?? PAPER_SHADOW_COL, op = s.op ?? 0.32;
  [[1, 0.42], [0.55, 0.34], [0.15, 0.3]].forEach(([g, a], k) => {
    const off = 1 - 0.25 * k, poly = growPoly(q, s.blur * g).map(([x, y]): Pt => [x + s.dx * off, y + s.dy * off]);
    hardFill(p.layer(op * a, seed * 7 + k), seed * 7 + k, col, poly);
  });
};

export type PaperOpts = {shadow?: PaperShadow | null; /** faint lighter glaze toward this screen point (the lit side), 0..1 strength */ glaze?: {at: Pt; col?: string; k?: number}};
/** One papercut layer: shadow, flat cut, glaze. */
export const paperLayer = (p: Painter, seed: number, col: string, q: Pt[], o: PaperOpts = {}) => {
  if (q.length < 3 || !q.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))) return;
  if (o.shadow) paperShadow(p, seed, q, o.shadow);
  hardFill(p, seed, col, q);
  if (o.glaze) {
    const g = o.glaze, k = g.k ?? 0.5, c = g.col ?? mixColor(col, '#fbf3e6', 0.35);
    hardFill(p.layer(0.28 * k, seed * 3 + 1), seed * 3 + 1, c, shrinkToward(q, g.at, 0.62));
    washAt(p, seed * 3 + 2, c, 46 * k, shrinkToward(q, g.at, 0.4), 0.06, 0.35);
  }
};

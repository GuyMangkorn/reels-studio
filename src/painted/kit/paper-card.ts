import type {Brush} from '../BrushCanvas';
import {clipHalf, hardFill, inkLine, washAt} from './draw';
import {makePainter, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, camPoly, camUnit, type YCam} from './ycam';

// Paper cut-out card treatment (kit, EDU-EP32-SHORT VD32-01 / VD32-02 gate still; Boss W3, 2026-11-21). Opt-in wrapper around any painted
// figure, animal or scenery drawing that stands squared to the yaw camera: the drawing is first run on a recording painter, its silhouette is
// rasterised, grown by the cut margin and traced into one card outline; then, in this order, the card's cast shadow from a point light on the
// ground plane under its foot, a fold tab on that plane at the foot line, the cream card (the cut edge shows as the margin around the drawing),
// a thin paper-thickness line, the drawing itself and a warm rim on the lamp side of the edge. One fill per layer: the shadow is one
// translucent polygon, so overlapping parts never darken it (DF-20261030-painted-layer-order: the edge is painted first, the figure on top).
// Pure function of its arguments (no state between frames). Absent = nothing changes for any existing drawing.

/** 2D affine [a, b, c, d, e, f]: x' = a x + c y + e, y' = b x + d y + f (the p5 convention). */
type M = [number, number, number, number, number, number];
const mul = (m: M, n: M): M => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];

/** Shapes a drawing put down, in picture px after its own push/translate/rotate/scale: filled polygons and stroked polylines. */
export type CardShapes = {polys: Pt[][]; lines: Pt[][]};

/** A painter whose brush records geometry instead of painting (same calls, same transforms), for `cardOutline`. */
export const recordingPainter = (): {p: Painter; shapes: CardShapes} => {
  const shapes: CardShapes = {polys: [], lines: []};
  let m: M = [1, 0, 0, 1, 0, 0];
  const stack: M[] = [];
  const T = (q: Pt): Pt => [m[0] * q[0] + m[2] * q[1] + m[4], m[1] * q[0] + m[3] * q[1] + m[5]];
  const api: Record<string, (...a: never[]) => unknown> = {
    push: () => { stack.push(m); },
    pop: () => { m = stack.pop() ?? m; },
    translate: (x: number, y: number) => { m = mul(m, [1, 0, 0, 1, x, y]); },
    rotate: (a: number) => { const c = Math.cos(a), s = Math.sin(a); m = mul(m, [c, s, -s, c, 0, 0]); },
    scale: (x: number, y?: number) => { m = mul(m, [x, 0, 0, y ?? x, 0, 0]); },
    polygon: (pts: Pt[]) => { if (pts.length >= 3) shapes.polys.push(pts.map(T)); },
    spline: (pts: Pt[]) => { if (pts.length >= 2) shapes.lines.push(pts.map(T)); },
    line: (x1: number, y1: number, x2: number, y2: number) => { shapes.lines.push([T([x1, y1]), T([x2, y2])]); },
    circle: (x: number, y: number, r: number) => { shapes.polys.push(Array.from({length: 16}, (_, i): Pt => T([x + r * Math.cos((i / 16) * 6.283), y + r * Math.sin((i / 16) * 6.283)]))); },
    rect: (x: number, y: number, w: number, h: number, mode?: string) => {
      const x0 = mode === 'center' ? x - w / 2 : x, y0 = mode === 'center' ? y - h / 2 : y;
      shapes.polys.push([T([x0, y0]), T([x0 + w, y0]), T([x0 + w, y0 + h]), T([x0, y0 + h])]);
    },
  };
  const brush = new Proxy(api, {get: (t, k) => (typeof k === 'string' && k in t ? t[k] : () => undefined)}) as unknown as Brush;
  return {p: makePainter(brush, {t: 0, frame: 0}), shapes};
};

/**
 * One outer outline around everything in `shapes`, grown by `grow` px (the cut margin): rasterised on a `cell` px grid, grown with a chamfer
 * distance, traced (Moore neighbours), smoothed. Gaps narrower than twice the margin close up, as a hand-cut card leaves paper between the legs.
 */
export const traceOutline = (shapes: CardShapes, grow: number, cell = 2): Pt[] => {
  const all = [...shapes.polys.flat(), ...shapes.lines.flat()].filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (all.length < 3) return [];
  const pad = grow + 3 * cell;
  const x0 = Math.min(...all.map((q) => q[0])) - pad, y0 = Math.min(...all.map((q) => q[1])) - pad;
  const W = Math.ceil((Math.max(...all.map((q) => q[0])) + pad - x0) / cell), H = Math.ceil((Math.max(...all.map((q) => q[1])) + pad - y0) / cell);
  if (W * H > 4e6) return [];
  const g = new Uint8Array(W * H);
  const fillPoly = (pts: Pt[]) => {
    const ys = pts.map((q) => (q[1] - y0) / cell - 0.5);
    const j0 = Math.max(0, Math.ceil(Math.min(...ys))), j1 = Math.min(H - 1, Math.floor(Math.max(...ys)));
    for (let j = j0; j <= j1; j++) {
      const xs: number[] = [];
      for (let k = 0; k < pts.length; k++) {
        const ya = ys[k], yb = ys[(k + 1) % pts.length];
        if ((ya <= j) !== (yb <= j)) {
          const xa = (pts[k][0] - x0) / cell - 0.5, xb = (pts[(k + 1) % pts.length][0] - x0) / cell - 0.5;
          xs.push(xa + ((j - ya) / (yb - ya)) * (xb - xa));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let i = Math.max(0, Math.ceil(xs[k])); i <= Math.min(W - 1, Math.floor(xs[k + 1])); i++) g[j * W + i] = 1;
    }
  };
  shapes.polys.forEach(fillPoly);
  for (const ln of shapes.lines) for (let k = 0; k + 1 < ln.length; k++) {
    const [a, b] = [ln[k], ln[k + 1]], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / cell));
    for (let s = 0; s <= n; s++) {
      const i = Math.round((a[0] + ((b[0] - a[0]) * s) / n - x0) / cell - 0.5), j = Math.round((a[1] + ((b[1] - a[1]) * s) / n - y0) / cell - 0.5);
      if (i >= 0 && j >= 0 && i < W && j < H) g[j * W + i] = 1;
    }
  }
  // chamfer 3-4 distance (in cells x 3) from the filled cells, then threshold at the margin
  const D = new Float32Array(W * H).map((_, k) => (g[k] ? 0 : 1e9));
  const at = (i: number, j: number) => (i < 0 || j < 0 || i >= W || j >= H ? 1e9 : D[j * W + i]);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const k = j * W + i; D[k] = Math.min(D[k], at(i - 1, j) + 3, at(i, j - 1) + 3, at(i - 1, j - 1) + 4, at(i + 1, j - 1) + 4); }
  for (let j = H - 1; j >= 0; j--) for (let i = W - 1; i >= 0; i--) { const k = j * W + i; D[k] = Math.min(D[k], at(i + 1, j) + 3, at(i, j + 1) + 3, at(i + 1, j + 1) + 4, at(i - 1, j + 1) + 4); }
  const lim = (3 * grow) / cell, on = (i: number, j: number) => i >= 0 && j >= 0 && i < W && j < H && D[j * W + i] <= lim;
  let s = -1;
  for (let k = 0; k < W * H && s < 0; k++) if (D[k] <= lim) s = k;
  if (s < 0) return [];
  // Moore neighbour trace, clockwise on screen (y down), starting with the west cell as the backtrack
  const dirs: Pt[] = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
  const dirOf = (dx: number, dy: number) => dirs.findIndex(([a, b]) => a === dx && b === dy);
  const si = s % W, sj = Math.floor(s / W);
  let ci = si, cj = sj, back = 0;
  const cells: Pt[] = [[si, sj]];
  for (let guard = 0; guard < 4 * (W + H) * 8; guard++) {
    let moved = false;
    for (let k = 1; k <= 8; k++) {
      const d = (back + k) % 8, ni = ci + dirs[d][0], nj = cj + dirs[d][1];
      if (on(ni, nj)) {
        const b = dirs[(d + 7) % 8], bi = ci + b[0], bj = cj + b[1];
        back = dirOf(bi - ni, bj - nj);
        ci = ni; cj = nj; moved = true;
        break;
      }
    }
    if (!moved || (ci === si && cj === sj)) break;
    cells.push([ci, cj]);
  }
  const px = cells.map(([i, j]): Pt => [x0 + (i + 0.5) * cell, y0 + (j + 0.5) * cell]);
  // smooth (closed moving average, 7 cells) and thin to every second point
  const n = px.length, w = Math.min(3, Math.floor(n / 4));
  const sm = px.map((_, k) => { let x = 0, y = 0; for (let o = -w; o <= w; o++) { const q = px[(k + o + n) % n]; x += q[0]; y += q[1]; } return [x / (2 * w + 1), y / (2 * w + 1)] as Pt; });
  return sm.filter((_, k) => k % 2 === 0);
};

/** Card outline of a drawing: record it, trace it grown by `grow` px, cut straight at the foot line `footY` (picture y) when given. */
export const cardOutline = (draw: (q: Painter) => void, grow: number, footY?: number): Pt[] => {
  const r = recordingPainter();
  draw(r.p);
  const o = traceOutline(r.shapes, grow);
  return footY === undefined || !o.length ? o : clipHalf(o, [0, -1], -footY);
};

export type PaperCardOpts = {
  /** World contact point of the card (its foot line centre); the card stands squared to the lens on the horizontal plane y = foot[1]. */
  foot: V3;
  /** Point light (world), for the cast shadow and the warm rim. */
  light: V3;
  seed: number;
  /** Cut margin around the drawing, picture px (default 7; the gate asks 4-10 px). */
  edge?: number;
  /** Card paper colour (default cream #f1e7d0). */
  paper?: string;
  /** Paper-thickness line colour (default a kraft shade). */
  rule?: string;
  /** Fold tab depth toward the lens (model m, default 0.12) and colour; false = none (a card held by its scenery). */
  tab?: {depth?: number; color?: string} | false;
  /** Cast shadow colour and opacity (0-255) on the foot plane; false = none. `clip` trims the picture polygon (the edge of a ledge). */
  shadow?: {color?: string; op?: number; clip?: (pts: Pt[]) => Pt[]} | false;
  /** Warm rim on the edge that faces the light (default #ffe0a0); false = none. */
  rim?: string | false;
};
export type PaperCardOut = {outline: Pt[]; shadow: Pt[]; tab: Pt[]; footY: number};

/** Camera right and toward-the-lens horizontal unit vectors (the card plane is squared to the lens). */
const camAxes = (c: YCam): {R: V3; N: V3} => ({R: [Math.cos(c.yaw), 0, Math.sin(c.yaw)], N: [-Math.sin(c.yaw), 0, Math.cos(c.yaw)]});

/**
 * Paint `draw` (a figure, animal or scenery drawing already placed in picture px for this camera) as a standing paper cut-out card.
 * Returns the picture polygons it used, or null when the foot is behind the lens.
 */
export const paperCard = (p: Painter, c: YCam, o: PaperCardOpts, draw: (q: Painter) => void): PaperCardOut | null => {
  const g = camPoint(c, o.foot);
  if (!g) return null;
  const u = camUnit(c, o.foot), {R, N} = camAxes(c);
  const outline = cardOutline(draw, o.edge ?? 7, g[1]);
  if (outline.length < 3) { draw(p); return {outline, shadow: [], tab: [], footY: g[1]}; }
  // picture point on the card -> world point on the card plane (a along R, b up), using the scale the drawing was placed with
  const world = (q: Pt): V3 => { const a = (q[0] - g[0]) / u, b = (g[1] - q[1]) / u; return [o.foot[0] + a * R[0], o.foot[1] + b, o.foot[2] + a * R[2]]; };
  let shadow: Pt[] = [];
  if (o.shadow !== false) {
    const L = o.light, y0 = o.foot[1];
    const pts = outline.map((q) => {
      const W = world(q);
      if (L[1] <= W[1] + 1e-3) return null;
      const t = (L[1] - y0) / (L[1] - W[1]);
      return camPoint(c, [L[0] + t * (W[0] - L[0]), y0, L[2] + t * (W[2] - L[2])]);
    });
    if (pts.every(Boolean)) {
      shadow = pts as Pt[];
      if (o.shadow?.clip) shadow = o.shadow.clip(shadow);
      if (shadow.length >= 3) washAt(p, o.seed + 1, o.shadow?.color ?? '#2a2018', o.shadow?.op ?? 120, shadow, 0.05, 0.1);
    }
  }
  let tab: Pt[] = [];
  const paper = o.paper ?? '#f1e7d0', rule = o.rule ?? '#b39a74';
  if (o.tab !== false) {
    const bot = outline.filter((q) => q[1] >= g[1] - 1.5);
    if (bot.length >= 2) {
      const a0 = (Math.min(...bot.map((q) => q[0])) - g[0]) / u, a1 = (Math.max(...bot.map((q) => q[0])) - g[0]) / u;
      const d = o.tab?.depth ?? 0.12, inset = Math.min(0.25 * (a1 - a0), d * 0.6);
      const P = (a: number, k: number): V3 => [o.foot[0] + a * R[0] + k * N[0], o.foot[1] + 0.001, o.foot[2] + a * R[2] + k * N[2]];
      tab = camPoly(c, [P(a0, 0), P(a1, 0), P(a1 - inset, d), P(a0 + inset, d)]);
      if (tab.length >= 3) {
        hardFill(p, o.seed + 2, o.tab?.color ?? '#cfb388', tab);
        inkLine(p, o.seed + 3, tab, {color: rule, weight: 0.55, still: true, curve: 0});
      }
    }
  }
  hardFill(p, o.seed + 4, paper, outline);
  inkLine(p, o.seed + 5, outline, {color: rule, weight: 0.7, still: true, curve: 0.1});
  draw(p);
  if (o.rim !== false) {
    // the stretch of the edge whose outward normal faces the light's picture direction
    const lp = camPoint(c, o.light) ?? [g[0] - 600, g[1] - 900];
    const n = outline.length, cx = outline.reduce((s, q) => s + q[0], 0) / n, cy = outline.reduce((s, q) => s + q[1], 0) / n;
    const lx = lp[0] - cx, ly = lp[1] - cy, ll = Math.hypot(lx, ly) || 1;
    let run: Pt[] = [], k = 0;
    const flush = () => { if (run.length >= 4) inkLine(p, o.seed + 10 + k++, run, {color: o.rim || '#ffe0a0', weight: 1.1, still: true, closed: false, curve: 0.2}); run = []; };
    for (let i = 0; i < n; i++) {
      const a = outline[(i + n - 1) % n], b = outline[(i + 1) % n], tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
      // clockwise outline (y down): outward normal = (ty, -tx)
      const facing = (ty * lx - tx * ly) / (tl * ll) > 0.35 && outline[i][1] < g[1] - 3;
      if (facing) run.push(outline[i]); else flush();
    }
    flush();
  }
  return {outline, shadow, tab, footY: g[1]};
};

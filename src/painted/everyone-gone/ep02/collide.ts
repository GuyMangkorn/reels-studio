import type {Brush} from '../../BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from '../../kit/cast';
import {makePainter, type Pt} from '../../kit/painter';
import {proj, type Cam} from '../space';

// EG-EP02 crowd collision and occlusion rule (Film, brief EG2-BRIEF-FILM-R1.3 `VD13`, 3 Nov 2026; user note on S05-B01-SH01
// "people go through the bench" and LF03/LF05 "the boat passes through the pier"). Pure geometry, no painting:
//   1. every solid (bench, pillar, rail post, bollard, boat, shrine, sign) and every person is a world box (metres);
//   2. no standing person's box intersects a solid or another person; a seated person belongs to one bench and sits on its seat;
//   3. the paint order is a back-to-front sort of the items whose picture boxes overlap, decided by an axis-aligned separating
//      plane (the item on the camera's side of it can never be hidden by the other, so it is painted later).
// `tests/eg2-crowd-collision.test.ts` checks every state of every set with these functions and with the measured picture
// box of each drawn figure, so a state is checked without rendering it.

/** World box, metres: x0 < x1, y0 < y1, z0 < z1 (z1 nearer the camera). */
export type Box = {x0: number; x1: number; y0: number; y1: number; z0: number; z1: number};
/** Picture box, px. */
export type Rect2 = {x0: number; y0: number; x1: number; y1: number};

export const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Box => ({
  x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: Math.min(y0, y1), y1: Math.max(y0, y1), z0: Math.min(z0, z1), z1: Math.max(z0, z1),
});
export const union = (a: Box, b: Box): Box => ({x0: Math.min(a.x0, b.x0), x1: Math.max(a.x1, b.x1), y0: Math.min(a.y0, b.y0), y1: Math.max(a.y1, b.y1), z0: Math.min(a.z0, b.z0), z1: Math.max(a.z1, b.z1)});

/** True when the boxes share volume (touching faces with `eps` clearance count as apart). */
export const intersects = (a: Box, b: Box, eps = 0) =>
  a.x0 < b.x1 - eps && b.x0 < a.x1 - eps && a.y0 < b.y1 - eps && b.y0 < a.y1 - eps && a.z0 < b.z1 - eps && b.z0 < a.z1 - eps;

/** Picture box of a world box (the eight corners projected; boxes behind the near plane are clamped by `proj`). */
export const screenOf = (c: Cam, b: Box): Rect2 => {
  const xs: number[] = [], ys: number[] = [];
  for (const x of [b.x0, b.x1]) for (const y of [b.y0, b.y1]) for (const z of [b.z0, b.z1]) {
    const [px, py] = proj(c, [x, y, z]);
    xs.push(px);
    ys.push(py);
  }
  return {x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys)};
};
/** Convex hull (px) of a world box's eight projected corners: the box's exact picture outline. */
export const hullOf = (c: Cam, b: Box): Pt[] => {
  const pts: Pt[] = [];
  for (const x of [b.x0, b.x1]) for (const y of [b.y0, b.y1]) for (const z of [b.z0, b.z1]) pts.push(proj(c, [x, y, z]));
  pts.sort((a, q) => a[0] - q[0] || a[1] - q[1]);
  const cross = (o: Pt, a: Pt, q: Pt) => (a[0] - o[0]) * (q[1] - o[1]) - (a[1] - o[1]) * (q[0] - o[0]);
  const lo: Pt[] = [], hi: Pt[] = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...pts].reverse()) { while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
};
/** True when two convex picture outlines overlap by more than `pad` px (separating-axis test). */
export const hullsOverlap = (a: Pt[], b: Pt[], pad = 0) => {
  for (const poly of [a, b]) for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const n: Pt = [(p[1] - q[1]) / len, (q[0] - p[0]) / len];
    const span = (pts: Pt[]) => { const d = pts.map((r) => r[0] * n[0] + r[1] * n[1]); return [Math.min(...d), Math.max(...d)]; };
    const [a0, a1] = span(a), [b0, b1] = span(b);
    if (a1 - pad <= b0 || b1 - pad <= a0) return false;
  }
  return true;
};
export const rectsOverlap = (a: Rect2, b: Rect2, pad = 0) => a.x0 < b.x1 - pad && b.x0 < a.x1 - pad && a.y0 < b.y1 - pad && b.y0 < a.y1 - pad;

/**
 * Which of two boxes must be painted later: +1 = `a` (nothing of `b` can hide it), -1 = `b`, 0 = no constraint (they
 * intersect, which the collision test forbids, or the camera stands in the gap between them, so neither can hide the other).
 * Uses the first axis-aligned plane that separates them; the box on the camera's side of that plane wins.
 */
export const frontOf = (c: Cam, a: Box, b: Box): 1 | -1 | 0 => {
  const cam = {x: c.x, y: c.y, z: c.z};
  const axes = [['x', 'x0', 'x1'], ['z', 'z0', 'z1'], ['y', 'y0', 'y1']] as const;
  for (const [k, lo, hi] of axes) {
    if (a[hi] <= b[lo]) return cam[k] <= a[hi] ? 1 : cam[k] >= b[lo] ? -1 : 0; // a on the low side
    if (b[hi] <= a[lo]) return cam[k] <= b[hi] ? -1 : cam[k] >= a[lo] ? 1 : 0;
  }
  return 0;
};

export type Item = {id: string; box: Box; draw: () => void};

/**
 * Back-to-front order: a topological sort of "must paint before" edges between items whose picture boxes overlap (`frontOf`),
 * ties and cycles broken by the nearest z (far first), then by input order.
 */
export const paintOrder = <T extends {id: string; box: Box}>(c: Cam, items: T[]): T[] => {
  const n = items.length, scr = items.map((it) => hullOf(c, it.box));
  const after: number[][] = items.map(() => []), indeg = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (!hullsOverlap(scr[i], scr[j])) continue;
    const f = frontOf(c, items[i].box, items[j].box);
    if (f === 1) { after[j].push(i); indeg[i]++; } else if (f === -1) { after[i].push(j); indeg[j]++; }
  }
  const key = (i: number) => items[i].box.z1 * 1e4 + i * 1e-3;
  const done = new Array<boolean>(n).fill(false), out: T[] = [];
  while (out.length < n) {
    let pick = -1;
    for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0 && (pick < 0 || key(i) < key(pick))) pick = i;
    if (pick < 0) for (let i = 0; i < n; i++) if (!done[i] && (pick < 0 || key(i) < key(pick))) pick = i; // cycle: nearest-z rule
    done[pick] = true;
    out.push(items[pick]);
    for (const j of after[pick]) indeg[j]--;
  }
  return out;
};

/**
 * Measured picture extent of one drawn figure, in metres around its ground point (u = picture x / unit, v = height): records the
 * polygons and splines `drawFigure` sends to the brush (the ground shadow left out). Used for the person boxes and by the test.
 */
export const measureFigure = (def: CastDef, poseAt: (g: Pt, unit: number) => FigPose, t = 0, seed = def.seed) => {
  const U = 200, g: Pt = [1000, 1000], pose = poseAt(g, U);
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity, shadow = false;
  const add = (pts: unknown) => {
    for (const q of pts as Pt[]) {
      u0 = Math.min(u0, q[0]); u1 = Math.max(u1, q[0]); v0 = Math.min(v0, q[1]); v1 = Math.max(v1, q[1]);
    }
  };
  const brush = new Proxy({}, {
    get: (_, name) => (...args: unknown[]) => {
      if (name === 'fill') shadow = args[0] === '#1e2324';
      if (name === 'polygon' && !shadow) add(args[0]);
      if (name === 'spline') add(args[0]);
    },
  }) as Brush;
  drawFigure(makePainter(brush, {t, frame: 0}), def, g, U, pose, t, seed);
  return {u0: (u0 - g[0]) / U, u1: (u1 - g[0]) / U, top: (g[1] - v0) / U, bottom: (g[1] - v1) / U};
};

/** World box of a profile or back-view figure card standing (or sitting) at ground point `at`: measured extent + `pad` m. */
export const figureBox = (m: ReturnType<typeof measureFigure>, at: readonly [number, number, number], halfDepth = 0.2, pad = 0.03): Box =>
  box(at[0] + m.u0 - pad, at[0] + m.u1 + pad, 0, m.top + pad, at[2] - halfDepth, at[2] + halfDepth);

import {inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';

// Water-surface marks shared by the macro lake (macro.ts: SH12, SH17, SH15) and the soi puddle (soi.ts: SH20): one continuous reflection streak cut by ripple gaps
// (F2-B12 (1), F2-B20) and ripple rings that are always lighter than the water (F2-B12 (2)). Pure functions of the camera and the ambient clock.

export const RING_LIGHT = '#e0eef2';

/** A ring on the plane `y`: centre (x, z), half-width `r` (aspect 0.8 in depth), >= 32 segments, lighter than the water, alpha `a` (0..1) fading with age. */
export const paintRing = (p: Painter, c: YCam, y: number, ring: {x: number; z: number; r: number; a: number}, o: {seed: number; weight?: number; n?: number; color?: string; rz?: number}) => {
  if (ring.a <= 0.02) return;
  const n = Math.max(32, o.n ?? 36), pts: Pt[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI, q = camPoint(c, [ring.x + ring.r * Math.cos(a), y, ring.z + (o.rz ?? ring.r * 0.8) * Math.sin(a)], c.near ?? 0.3); if (q) pts.push(q); }
  if (pts.length < 3) return;
  inkLine(p.layer(Math.min(1, ring.a), o.seed), o.seed, pts, {weight: o.weight ?? 1.6, color: o.color ?? RING_LIGHT, curve: 0.2, still: true});
};

export type StreakSpec = {
  seed: number; y: number; z0: number; z1: number;
  /** Centre line x at depth z. */
  xOf: (z: number) => number;
  /** Half-width at `u` (0 at z0 .. 1 at z1). */
  hw: (u: number) => number;
  color: string; alpha: number; bleed?: number;
  /** Ripple gaps the streak is cut by: depth z and width (same units as the plane). */
  gaps?: {z: number; w: number}[];
  /** A brighter core along part of the streak. */
  core?: {u0: number; u1: number; hw: number; color: string; alpha: number};
};
/** Screen-px caps of the streak (F3-B12): full width at the shop (far) end and at the near end; the far end is the one higher in the picture. */
export const STREAK_PX = {far: 40, near: 16};
/** Gap lengths on screen (px) and the number of breaks (F3-B12). */
const GAP_PX: [number, number] = [6, 24], GAP_N = 10;
const STROKES: [number, number][] = [[1, 0.12], [0.6, 0.12], [0.3, 0.12]];
/**
 * One shop-reflection streak on a water plane (F3-B12, replaces the F2-B12 band): projected ribbon with the width capped in screen px (<= 40 at the shop end,
 * <= 16 at the near end), three stacked soft strokes (width x 1.0 / 0.6 / 0.3, alpha 0.12 each, peak ~0.32, no halo), 8-12 irregular unpainted breaks of 6-24 px
 * (nothing is painted over them), and a <= 4 px brighter core on the far 40 %. `hw`, `bleed` and `gaps` are kept for callers but the px caps rule.
 */
export const paintStreak = (p: Painter, c: YCam, s: StreakSpec) => {
  const N = 400, pts: {q: Pt; w: number; u: number}[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, z = s.z0 + (s.z1 - s.z0) * u, x = s.xOf(z), h = s.hw(u);
    const m = camPoint(c, [x, s.y, z], c.near ?? 0.3), a = camPoint(c, [x - h, s.y, z], c.near ?? 0.3), b = camPoint(c, [x + h, s.y, z], c.near ?? 0.3);
    if (m && a && b) pts.push({q: m, w: Math.hypot(b[0] - a[0], b[1] - a[1]), u});
  }
  if (pts.length < 4) return;
  const far0 = pts[0].q[1] <= pts[pts.length - 1].q[1]; // the shop end is the higher one in the picture
  const arc: number[] = [0];
  for (let i = 1; i < pts.length; i++) arc.push(arc[i - 1] + Math.hypot(pts[i].q[0] - pts[i - 1].q[0], pts[i].q[1] - pts[i - 1].q[1]));
  const total = arc[arc.length - 1];
  const cap = (i: number) => { const f = total > 0 ? arc[i] / total : 0, k = far0 ? f : 1 - f; return STREAK_PX.far + (STREAK_PX.near - STREAK_PX.far) * k; };
  const wOf = (i: number) => Math.min(pts[i].w, cap(i));
  // 8-12 irregular breaks of 6-24 px, spacing +-40 % about an even spread, no break at the ends
  const nGap = GAP_N, spacing = total / (nGap + 1), breaks: [number, number][] = [];
  for (let g = 0; g < nGap; g++) {
    const mid = spacing * (g + 1) + (hash(s.seed + 7 + g) - 0.5) * 0.8 * spacing, len = GAP_PX[0] + (GAP_PX[1] - GAP_PX[0]) * hash(s.seed + 61 + g);
    breaks.push([mid - len / 2, mid + len / 2]);
  }
  const inGap = (i: number) => breaks.some(([a, b]) => arc[i] >= a && arc[i] <= b);
  const runs: number[][] = [];
  let cur: number[] = [];
  for (let i = 0; i < pts.length; i++) { if (inGap(i)) { if (cur.length) runs.push(cur); cur = []; } else cur.push(i); }
  if (cur.length) runs.push(cur);
  const poly = (idx: number[], k: number, fixed?: number): Pt[] => {
    const L: Pt[] = [], R: Pt[] = [];
    idx.forEach((i, j) => {
      const a = pts[idx[Math.max(0, j - 1)]].q, b = pts[idx[Math.min(idx.length - 1, j + 1)]].q, dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
      const h = (fixed ?? wOf(i) * k) / 2, q = pts[i].q;
      L.push([q[0] - (dy / n) * h, q[1] + (dx / n) * h]); R.push([q[0] + (dy / n) * h, q[1] - (dx / n) * h]);
    });
    return [...L, ...R.reverse()];
  };
  runs.forEach((idx, r) => {
    if (idx.length < 2) return;
    STROKES.forEach(([k, al], j) => washAt(p, s.seed + 10 + r * 5 + j, s.color, al * 255, poly(idx, k), 0.15, 0.1));
    if (s.core) {
      const ci = idx.filter((i) => pts[i].u >= s.core!.u0 && pts[i].u <= s.core!.u1);
      if (ci.length >= 2) washAt(p, s.seed + 14 + r * 5, s.core.color, Math.min(s.core.alpha, 0.2 * 255), poly(ci, 1, 4), 0.1, 0.1);
    }
  });
};
/** `n` ripple gaps evenly spread over [z0, z1] with +-30 % jitter on the width. */
export const gapsOf = (z0: number, z1: number, n: number, w: number, seed: number) =>
  Array.from({length: n}, (_, i) => ({z: z0 + ((i + 0.5) / n) * (z1 - z0) + (hash(seed + i) - 0.5) * 0.3 * ((z1 - z0) / n), w: w * (1 + 0.6 * (hash(seed + 40 + i) - 0.5))}));

/** Ground point (plane `y`) under picture point (sx, sy), or null when the ray does not reach it. */
export const unproject = (c: YCam, sx: number, sy: number, y: number): V3 | null => {
  const r = (sx - 540 - (c.cx ?? 0)) / c.f, u = -(sy - c.hy) / c.f, d = 1, cs = Math.cos(c.pitch ?? 0), sn = Math.sin(c.pitch ?? 0);
  // camera space (r, u, d) -> yawed frame: undo the pitch
  const uu = u * cs + d * sn, dd = d * cs - u * sn;
  if (Math.abs(uu) < 1e-6) return null;
  const k = (y - c.y) / uu;
  if (k <= 0) return null;
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw), dx = r * co + dd * s, dz = r * s - dd * co;
  return [c.x + dx * k, y, c.z + dz * k];
};
void mixColor;

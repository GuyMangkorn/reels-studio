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
const strip = (c: YCam, s: StreakSpec, u0: number, u1: number, k: number, n: number): Pt[] => {
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = u0 + ((u1 - u0) * i) / n, z = s.z0 + (s.z1 - s.z0) * u, x = s.xOf(z), w = k < 0 ? -k : s.hw(u) * k;
    const a = camPoint(c, [x - w, s.y, z], c.near ?? 0.3), b = camPoint(c, [x + w, s.y, z], c.near ?? 0.3);
    if (a) left.push(a);
    if (b) right.push(b);
  }
  return [...left, ...right.reverse()];
};
/** One continuous streak on a water plane (ribbon along z) with a soft halo, cut by ripple gaps (the water shows through them), and an optional brighter core. */
export const paintStreak = (p: Painter, c: YCam, s: StreakSpec) => {
  const span = s.z1 - s.z0, gs = [...(s.gaps ?? [])].sort((a, b) => a.z - b.z).map((g) => [(g.z - g.w / 2 - s.z0) / span, (g.z + g.w / 2 - s.z0) / span] as [number, number]);
  const segs: [number, number][] = [];
  let u = 0;
  gs.forEach(([a, b]) => { if (a > u) segs.push([u, a]); u = Math.max(u, b); });
  if (u < 1) segs.push([u, 1]);
  segs.forEach(([a, b], i) => {
    const n = Math.max(2, Math.round((b - a) * 28));
    const halo = strip(c, s, a, b, 1.5, n), body = strip(c, s, a, b, 1, n);
    if (halo.length >= 3) washAt(p, s.seed + 10 + i * 3, s.color, s.alpha * 0.4, halo, 0.4, 0.1);
    if (body.length >= 3) washAt(p, s.seed + 11 + i * 3, s.color, s.alpha, body, s.bleed ?? 0.25, 0.1);
    if (s.core) {
      const k0 = Math.max(a, s.core.u0), k1 = Math.min(b, s.core.u1);
      if (k1 - k0 > 0.002) { const q = strip(c, s, k0, k1, -s.core.hw, Math.max(2, Math.round((k1 - k0) * 28))); if (q.length >= 3) washAt(p, s.seed + 12 + i * 3, s.core.color, s.core.alpha, q, 0.2, 0.1); }
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

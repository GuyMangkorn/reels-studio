import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP16..18 survival series: shared helpers for the look stills (W3, Film; brief EDU-EP16-BRIEF-R1 VD-S01..S07).
// Proposed shared series module (brief "Technical handoff": `src/painted/survival/`; Boss decides the final home when hardening).
// Space VIL: metres, origin on the ground at the yard centre, +x east, +y up, +z south (toward the usual camera).

/** A card anchored at a world ground point: picture ground point and px per metre (organic props, plants, creatures). */
export type Card = {g: Pt; u: number; /** 1 = drawn facing screen right, -1 = mirrored. */ s: number};
export const cardAt = (c: YCam, at: V3, s = 1, scale = 1): Card | null => {
  const g = camPoint(c, at);
  return g ? {g, u: camUnit(c, at) * scale, s} : null;
};
/** Card-local metres (x right, y up) to picture px. */
export const cp = (k: Card, x: number, y: number): Pt => [k.g[0] + k.s * x * k.u, k.g[1] - y * k.u];
export const cps = (k: Card, pts: [number, number][]): Pt[] => pts.map(([x, y]) => cp(k, x, y));
/** Ellipse in card metres. */
export const cell = (k: Card, cx: number, cy: number, rx: number, ry: number, n = 16, a = 0): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const t = (i / n) * Math.PI * 2, x = rx * Math.cos(t), y = ry * Math.sin(t);
    return cp(k, cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a));
  });
/** Light model for a still: everything is mixed toward the ambient colour by `amb`, warm light adds by `warm`. */
export type Light = {amb: string; k: number};
export const lit = (L: Light, col: string, extra = 0) => mixColor(col, L.amb, Math.max(0, Math.min(0.95, L.k + extra)));
/** A curved strip (frond, neck): centre line points with half-widths, as a closed polygon. */
export const strip = (pts: Pt[], w: number[]): Pt[] => {
  const left: Pt[] = [], right: Pt[] = [];
  pts.forEach((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    left.push([q[0] + nx * w[i], q[1] + ny * w[i]]);
    right.push([q[0] - nx * w[i], q[1] - ny * w[i]]);
  });
  return [...left, ...right.reverse()];
};
export const bez = (a: Pt, b: Pt, c: Pt, n = 12): Pt[] =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n, m = 1 - t;
    return [m * m * a[0] + 2 * m * t * b[0] + t * t * c[0], m * m * a[1] + 2 * m * t * b[1] + t * t * c[1]];
  });
export type {Painter, Pt, V3, YCam};

/** Inverse of the camera: the world point under picture px (`x`, `y`) at depth `d` along the view axis (m). For placing flying and screen-led things (batch 2). */
export const worldAt = (c: YCam, x: number, y: number, d: number): V3 => {
  const ur = ((c.hy - y) * d) / c.f, r = ((x - 540 - (c.cx ?? 0)) * d) / c.f; // camera space (after pitch): up, right at depth d
  const cs = Math.cos(c.pitch ?? 0), sn = Math.sin(c.pitch ?? 0);
  const dd = d * cs - ur * sn, uu = ur * cs + d * sn; // undo the pitch
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw);
  return [c.x + r * co + dd * s, c.y + uu, c.z + r * s - dd * co];
};

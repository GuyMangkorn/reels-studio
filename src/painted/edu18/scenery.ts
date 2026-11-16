import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, camSpace, type YCam} from '../kit/ycam';
import {paperLayer, paperShadow} from './paper';

// EDU-EP18 set helpers shared by the W3 sets (Film, 16 Nov 2026): world-metre polygons through the kit yaw camera, painted as EP18 papercut
// layers (paper.ts: flat cut, soft drop shadow, faint glaze) with brush-mark texture strokes. Pure functions of their arguments.

export const P = (c: YCam, v: V3): Pt | null => camPoint(c, v);
export const poly = (c: YCam, pts: V3[]): Pt[] => camPoly(c, pts);
export const okPoly = (q: Pt[]) => q.length >= 3 && q.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
/** Picture y of the horizon-parallel line at world height y, depth d (pitch 0 cameras). */
export const yAt = (c: YCam, y: number, d: number) => c.hy - (c.f * (y - c.y)) / d;
/** Full-width picture band between two y values. */
export const bandPts = (y0: number, y1: number, pad = 200): Pt[] => [[-pad, y0], [1080 + pad, y0], [1080 + pad, y1], [-pad, y1]];
/** Seeded 0..1 noise. */
export const hn = (n: number) => hash(n);

/** A papercut world polygon: flat cut, optional drop shadow (px at this depth), optional glaze toward a picture point. */
export const wCut = (p: Painter, c: YCam, seed: number, col: string, pts: V3[], o: {shadow?: number; glazeAt?: Pt; glazeK?: number} = {}) => {
  const q = poly(c, pts);
  if (!okPoly(q)) return q;
  paperLayer(p, seed, col, q, {shadow: o.shadow ? {dx: o.shadow * 0.5, dy: o.shadow, blur: o.shadow * 0.9, op: 0.26} : null, ...(o.glazeAt ? {glaze: {at: o.glazeAt, k: o.glazeK ?? 0.5}} : {})});
  return q;
};
/** A flat world polygon, no shadow. */
export const wFlat = (p: Painter, c: YCam, seed: number, col: string, pts: V3[]) => {
  const q = poly(c, pts);
  if (okPoly(q)) hardFill(p, seed, col, q);
  return q;
};
/** Shadow only (a cut's cast shadow on the surface under it). */
export const wShadow = (p: Painter, c: YCam, seed: number, pts: V3[], s: number, op = 0.26) => {
  const q = poly(c, pts);
  if (okPoly(q)) paperShadow(p, seed, q, {dx: s * 0.5, dy: s, blur: s * 0.9, op});
};
/** Brush marks: a short world polyline as a thin still ink stroke (grain, cracks, plank joints, ripples). */
export const wStroke = (p: Painter, c: YCam, id: number, pts: V3[], color: string, weight = 0.6) => {
  const q = pts.map((v) => P(c, v));
  if (q.some((v) => !v)) return;
  inkLine(p, id, q as Pt[], {closed: false, weight, curve: 0.3, color, still: true});
};
/** Picture-space soft wash of a polygon, seeded. */
export const glow = (p: Painter, seed: number, col: string, op: number, q: Pt[]) => washAt(p, seed, col, op, q, 0.3, 0.3);
/** Ellipse points in picture px. */
export const ellPts = (cx: number, cy: number, rx: number, ry: number, n = 22): Pt[] => Array.from({length: n}, (_, k) => [cx + rx * Math.cos((k / n) * 6.283), cy + ry * Math.sin((k / n) * 6.283)] as Pt);
/** A ground-plane circle (y fixed) in world metres. */
export const wCircle = (at: V3, r: number, n = 28, a0 = 0, a1 = Math.PI * 2): V3[] => Array.from({length: n + 1}, (_, k) => { const a = a0 + ((a1 - a0) * k) / n; return [at[0] + r * Math.cos(a), at[1], at[2] + r * Math.sin(a)] as V3; });
/** Depth along the camera axis. */
export const depth = (c: YCam, v: V3) => camSpace(c, v).d;
/** Horizontal picture x range of a world point set (for culling props off frame). */
export const inFrame = (q: Pt[] | null, m = 200) => !!q && q.some(([x, y]) => x > -m && x < 1080 + m && y > -m && y < 1920 + m);
/** A sugar palm (ตาล): straight trunk, round crown of fan leaves; silhouette, hazed by distance. */
export const sugarPalm = (p: Painter, c: YCam, seed: number, x: number, z: number, h: number, col: string) => {
  wCut(p, c, seed, col, [[x - 0.2, 0, z], [x + 0.2, 0, z], [x + 0.14, h, z], [x - 0.14, h, z]]);
  // round crown: fan leaves radiating all round (sugar palm), longer upward, drooping below
  const n = 22;
  for (let k = 0; k < n; k++) {
    const a = (Math.PI * 2 * k) / n + (hn(seed + k) - 0.5) * 0.25, up = Math.sin(a), L = (up < 0 ? 1.3 : 1.8) + 0.4 * hn(seed * 3 + k);
    const tip: V3 = [x + L * Math.cos(a), h + L * up * (up < 0 ? 0.8 : 1) - (up < 0 ? 0.6 : 0), z];
    const w = 0.3, side: V3 = [x + w * Math.cos(a + 0.6), h + w * Math.sin(a + 0.6), z], side2: V3 = [x + w * Math.cos(a - 0.6), h + w * Math.sin(a - 0.6), z];
    const fan1: V3 = [tip[0] + 0.3 * Math.cos(a + 1.2), tip[1] + 0.3 * Math.sin(a + 1.2), z], fan2: V3 = [tip[0] + 0.3 * Math.cos(a - 1.2), tip[1] + 0.3 * Math.sin(a - 1.2), z];
    wFlat(p, c, seed + 1 + k, col, [[x, h, z], side, fan1, tip, fan2, side2]);
  }
  // hanging dead fronds under the crown
  wFlat(p, c, seed + 40, mixColor(col, '#6a5a3a', 0.3), [[x - 0.6, h - 0.1, z], [x + 0.6, h - 0.1, z], [x + 0.3, h - 1.4, z], [x - 0.4, h - 1.2, z]]);
};

/** Mix helper. */
export const mix = mixColor;

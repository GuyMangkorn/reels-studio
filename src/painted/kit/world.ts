import {clipHalf, hardFill, inkLine, INK, washAt} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camDist, camPoint, camPoly, camUnit, type YCam} from './ycam';

// World-metre paint helpers for sets built in metres and drawn through the yaw camera (`ycam.ts`, the painted 3D camera):
// clip projected polygons to a safe box, paint world polygons as crisp fills, washes and ink, paint boxes by visible face,
// round props, and depth-sort set items. Copied from EDU-EP02 `edu02/world.ts` (re-used by EDU-EP03..06; ENV-P01 second use,
// 7 Nov 2026). The episodes keep their own copy so their pinned scenes keep their hashes. Tools only: no look is a default.

export type Rect = [number, number, number, number];
/** Clip box for a 1080 x 1920 frame with a 300 px margin (strokes stay finite when a set runs far off frame). */
export const SAFE_RECT: Rect = [-300, -300, 1380, 2220];
/** Clip a picture polygon to a rectangle [x0, y0, x1, y1]. */
export const clip = (pts: Pt[], [x0, y0, x1, y1]: Rect = SAFE_RECT): Pt[] => {
  let r = clipHalf(pts, [1, 0], x0);
  if (r.length) r = clipHalf(r, [-1, 0], -x1);
  if (r.length) r = clipHalf(r, [0, 1], y0);
  if (r.length) r = clipHalf(r, [0, -1], -y1);
  return r;
};
const ok = (pts: Pt[]) => pts.length >= 3;

/** World polygon -> clipped picture polygon. */
export const wp = (c: YCam, pts: V3[]): Pt[] => clip(camPoly(c, pts));
/** Crisp fill of a world polygon (architecture edges). Returns the picture polygon. */
export const wFill = (p: Painter, c: YCam, seed: number, color: string, pts: V3[]) => {
  const q = wp(c, pts);
  if (ok(q)) hardFill(p, seed, color, q);
  return q;
};
/** Watercolour wash of a world polygon. Returns the picture polygon. */
export const wWash = (p: Painter, c: YCam, seed: number, color: string, op: number, pts: V3[], bleed = 0.2, tex = 0.45) => {
  const q = wp(c, pts);
  if (ok(q)) washAt(p, seed, color, op, q, bleed, tex);
  return q;
};
/** Ink outline of a world polygon or polyline (skipped when any point is behind the lens). */
export const wInk = (p: Painter, c: YCam, id: number, pts: V3[], o: {color?: string; weight?: number; closed?: boolean} = {}) => {
  const q = pts.map((v) => camPoint(c, v));
  if (q.some((v) => !v)) return;
  inkLine(p, id, q as Pt[], {closed: o.closed ?? true, weight: o.weight ?? 0.9, color: o.color ?? INK, curve: 0.05});
};

/** Axis-aligned rectangles in metres: `qx` a wall at x, `qy` a floor or ceiling at height y, `qz` a wall at depth z. */
export const qx = (x: number, y0: number, y1: number, z0: number, z1: number): V3[] => [[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]];
export const qy = (y: number, x0: number, x1: number, z0: number, z1: number): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
export const qz = (z: number, x0: number, x1: number, y0: number, y1: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];

export type Box = {x0: number; x1: number; y0: number; y1: number; z0: number; z1: number};
export type BoxFace = 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';
/** The faces of a box the camera sees (front = +z). */
export const boxFaces = (c: YCam, b: Box): {face: BoxFace; pts: V3[]}[] => {
  const out: {face: BoxFace; pts: V3[]}[] = [];
  if (c.y > b.y1) out.push({face: 'top', pts: qy(b.y1, b.x0, b.x1, b.z0, b.z1)});
  if (c.y < b.y0) out.push({face: 'bottom', pts: qy(b.y0, b.x0, b.x1, b.z0, b.z1)});
  if (c.x < b.x0) out.push({face: 'left', pts: qx(b.x0, b.y0, b.y1, b.z0, b.z1)});
  if (c.x > b.x1) out.push({face: 'right', pts: qx(b.x1, b.y0, b.y1, b.z0, b.z1)});
  if (c.z > b.z1) out.push({face: 'front', pts: qz(b.z1, b.x0, b.x1, b.y0, b.y1)});
  if (c.z < b.z0) out.push({face: 'back', pts: qz(b.z0, b.x0, b.x1, b.y0, b.y1)});
  return out;
};
/** A painted box: each visible face in its tone (`shade` by face; negative = lighter), crisp edges, optional grain and ink. */
export const paintBox = (p: Painter, c: YCam, seed: number, b: Box, color: string, shade: Partial<Record<BoxFace, number>> = {}, o: {ink?: boolean; grain?: number} = {}) => {
  const tone: Record<BoxFace, number> = {top: -0.06, bottom: 0.3, front: 0.0, back: 0.1, left: 0.16, right: 0.2, ...shade};
  boxFaces(c, b).forEach(({face, pts}, i) => {
    const col = tone[face] >= 0 ? mixColor(color, '#3a2418', tone[face]) : mixColor(color, '#fff4dc', -tone[face]);
    const q = wFill(p, c, seed + i * 3, col, pts);
    if (o.grain && ok(q)) washAt(p, seed + i * 3 + 1, mixColor(col, '#3a2418', 0.2), o.grain, q, 0.05, 0.75);
    if (o.ink) wInk(p, c, seed + i * 3 + 2, pts, {color: mixColor(col, INK, 0.55), weight: 0.7});
  });
};

/** Picture centre and radius (px) of a sphere of radius `r` m at `v`, or null behind the lens. */
export const sphereAt = (c: YCam, v: V3, r: number): {x: number; y: number; r: number} | null => {
  const q = camPoint(c, v);
  return q ? {x: q[0], y: q[1], r: r * camUnit(c, v)} : null;
};
/** Ellipse of a horizontal circle (radius `r` m, centre `v`) as a clipped picture polygon. */
export const flatCircle = (c: YCam, v: V3, r: number, n = 20): Pt[] =>
  wp(c, Array.from({length: n}, (_, i): V3 => [v[0] + r * Math.cos((i / n) * 6.283), v[1], v[2] + r * Math.sin((i / n) * 6.283)]));

/** One depth-sorted item of a set: its ground point (painter's order) and its paint call. */
export type Item = {at: V3; draw: (p: Painter, c: YCam) => void; bias?: number};
/** Paint items far to near (horizontal distance from the camera, plus an optional bias in metres; negative = nearer). */
export const paintSorted = (p: Painter, c: YCam, items: Item[]) =>
  items.map((it) => ({it, d: camDist(c, it.at) + (it.bias ?? 0)})).sort((a, b) => b.d - a.d).forEach((o) => o.it.draw(p, c));

/** Convex hull of picture points (monotone chain), for round props seen from any side. */
export const hull = (pts: Pt[]): Pt[] => {
  const q = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (q.length < 3) return q;
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const v of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], v) <= 0) lo.pop(); lo.push(v); }
  for (const v of q.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], v) <= 0) up.pop(); up.push(v); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

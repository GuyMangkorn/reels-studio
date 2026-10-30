import {hash} from './hash';
import {type Painter, type Pt} from './painter';
import {NEAR, type Proj, type V3} from './space';

// Fill, line and polygon helpers for painted plates (episode-neutral; WORLD FOG lighting lives in worldfog/draw.ts). Opaque decal fills use explicit seeds (never the wash counter), so a part
// keeps its marks whatever else is drawn before it; ink outlines boil on the plate frame (painted-2d skill).

export const INK = '#2b211c';

export const finite = (pts: Pt[]) => pts.length >= 3 && pts.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y));

/**
 * Opaque seeded fill: `passes` low-texture passes with no bleed. Several passes keep dark fills solid over wet light
 * ones and stop fog showing through texture gaps (build-notes: 6-8 passes for dark over wet, 8 for light over dark).
 */
export const solid = (p: Painter, seed: number, color: string, pts: Pt[], passes = 4, texture = 0.06, border = 0.15) => {
  if (!finite(pts)) return;
  const {brush} = p;
  for (let k = 0; k < passes; k++) {
    brush.seed(seed * 16 + k);
    brush.noiseSeed(seed * 16 + k);
    brush.noStroke();
    brush.fill(color, 255 * p.alpha);
    brush.fillBleed(0);
    brush.fillTexture(texture, border);
    brush.polygon(pts);
    brush.noFill();
  }
};

/**
 * Crisp opaque fill for straight architecture (window mullions, transom, sill, frames; SS-R3.2 open item 16): the flat
 * colour underlayer (brush.wash: no bleed, no texture), so the bar edges stay straight and hard on the fogged interior
 * (VD07, SP03). `fill()` always grows an irregular watercolour edge, which read as blobby bars.
 */
export const hardFill = (p: Painter, seed: number, color: string, pts: Pt[]) => {
  if (!finite(pts)) return;
  const {brush} = p;
  brush.seed(seed);
  brush.noiseSeed(seed);
  brush.noStroke();
  brush.noFill();
  brush.wash(color, 255 * p.alpha);
  brush.polygon(pts);
  brush.noWash();
};

/** Watercolour wash with its own seed (bleed + texture), for sets and atmosphere. */
export const washAt = (p: Painter, seed: number, color: string, opacity: number, pts: Pt[], bleed = 0.25, texture = 0.45) => {
  if (!finite(pts)) return;
  const {brush} = p;
  brush.seed(seed);
  brush.noiseSeed(seed);
  brush.noStroke();
  brush.fill(color, opacity * p.alpha);
  brush.fillBleed(bleed);
  brush.fillTexture(texture, 0.4);
  brush.polygon(pts);
  brush.noFill();
};

/** One boiling ink line (closed by default). */
export const inkLine = (p: Painter, id: number, pts: Pt[], o: {color?: string; weight?: number; curve?: number; closed?: boolean; still?: boolean} = {}) => {
  if (pts.length < 2 || !pts.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))) return;
  (o.still ? p.inkStill : p.ink)(id, 'rotring', o.color ?? INK, o.weight ?? 1.0);
  p.brush.spline(o.closed === false ? pts : [...pts, pts[0]], o.curve ?? 0.15);
};

export const ell = (cx: number, cy: number, rx: number, ry = rx, n = 18, a = 0): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const t = (i / n) * Math.PI * 2, u = rx * Math.cos(t), v = ry * Math.sin(t);
    return [cx + u * Math.cos(a) - v * Math.sin(a), cy + u * Math.sin(a) + v * Math.cos(a)];
  });

/** A quad around the segment a-b, width w0 at a and w1 at b. */
export const limb = ([ax, ay]: Pt, [bx, by]: Pt, w0: number, w1: number): Pt[] => {
  const len = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / len, ny = (bx - ax) / len;
  return [[ax + (nx * w0) / 2, ay + (ny * w0) / 2], [bx + (nx * w1) / 2, by + (ny * w1) / 2], [bx - (nx * w1) / 2, by - (ny * w1) / 2], [ax - (nx * w0) / 2, ay - (ny * w0) / 2]];
};

/** A rounded segment a-b (both ends capped), width w0 at a and w1 at b. */
export const capsule = (a: Pt, b: Pt, w0: number, w1: number, n = 6): Pt[] => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const arc = (c: Pt, r: number, from: number): Pt[] => Array.from({length: n + 1}, (_, i): Pt => [c[0] + r * Math.cos(from + (Math.PI * i) / n), c[1] + r * Math.sin(from + (Math.PI * i) / n)]);
  return [...arc(b, w1 / 2, ang - Math.PI / 2), ...arc(a, w0 / 2, ang + Math.PI / 2)];
};

export const rectPts = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Soft breathing blob, phases from `id`, so neighbouring banks do not move in step. */
export const blob = (id: number, cx: number, cy: number, rx: number, ry: number, t: number, n = 18): Pt[] =>
  Array.from({length: n}, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2;
    const r = 1 + 0.13 * Math.sin(3 * a + hash(id + 11) * 6.28 + t * 0.35) + 0.07 * Math.sin(5 * a + hash(id + 23) * 6.28 - t * 0.27);
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
  });

/** A wash band between two y lines with a wavy top edge (static per id). */
export const band = (id: number, y0: number, y1: number, amp: number): Pt[] => [
  ...Array.from({length: 13}, (_, i): Pt => [-200 + i * 125, y0 + (hash(id + i) - 0.5) * amp]),
  [1300, y1],
  [-200, y1],
];

/** Clip a world polygon to depth >= NEAR (Sutherland-Hodgman on one plane), then project it. */
export const projectPoly = (proj: Proj, pts: V3[]): Pt[] => {
  const out: V3[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const da = proj.rawDepth(a) - NEAR, db = proj.rawDepth(b) - NEAR;
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) {
      const u = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]);
    }
  }
  return out.length >= 3 ? clipScreen(out.map(proj.P)) : [];
};

/** Clip a screen polygon to a generous frame box, so near-plane polygons stay a sane size for the brush. */
const BOX = {x0: -400, y0: -500, x1: 1480, y1: 2420};
export const clipScreen = (pts: Pt[]): Pt[] => {
  let poly = pts;
  const edges: [(q: Pt) => number][] = [[(q) => q[0] - BOX.x0], [(q) => BOX.x1 - q[0]], [(q) => q[1] - BOX.y0], [(q) => BOX.y1 - q[1]]];
  for (const [inside] of edges) {
    const res: Pt[] = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const da = inside(a), db = inside(b);
      if (da >= 0) res.push(a);
      if ((da >= 0) !== (db >= 0)) {
        const u = da / (da - db);
        res.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
      }
    }
    poly = res;
    if (poly.length < 3) return [];
  }
  return poly;
};

/** World quad helpers. */
export const quadX = (x: number, y0: number, y1: number, z0: number, z1: number): V3[] => [[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]];
export const quadY = (y: number, x0: number, x1: number, z0: number, z1: number): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
export const quadZ = (z: number, x0: number, x1: number, y0: number, y1: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];

/** Screen-space bounding box of points. */
export const bbox = (pts: Pt[]) => ({
  x0: Math.min(...pts.map((q) => q[0])), x1: Math.max(...pts.map((q) => q[0])),
  y0: Math.min(...pts.map((q) => q[1])), y1: Math.max(...pts.map((q) => q[1])),
});

export const norm = ([x, y]: Pt): Pt => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};

/** Clip a polygon to the half-plane dot(q, n) >= c (Sutherland-Hodgman, one edge). */
export const clipHalf = (pts: Pt[], n: Pt, c: number): Pt[] => {
  const out: Pt[] = [];
  const d = (q: Pt) => q[0] * n[0] + q[1] * n[1] - c;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const da = d(a), db = d(b);
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) {
      const u = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
    }
  }
  return out.length >= 3 ? out : [];
};

/** The band of a polygon between fractions u0..u1 of its extent along direction `dir` (0 = the side `dir` comes from). */
export const planeBand = (pts: Pt[], dir: Pt, u0: number, u1 = 1): Pt[] => {
  const n = norm(dir);
  const s = pts.map((q) => q[0] * n[0] + q[1] * n[1]);
  const lo = Math.min(...s), hi = Math.max(...s), span = hi - lo;
  if (span < 1) return [];
  let band = u0 > 0 ? clipHalf(pts, n, lo + u0 * span) : pts;
  if (u1 < 1 && band.length) band = clipHalf(band, [-n[0], -n[1]], -(lo + u1 * span));
  return band;
};

/** Textured watercolour glaze with its own seed; bleeds inward so the outer silhouette stays where the ink is. */
export const glaze = (p: Painter, seed: number, color: string, opacity: number, pts: Pt[], o: {bleed?: number; texture?: number; border?: number; split?: number} = {}) => {
  if (!finite(pts)) return;
  const {brush} = p;
  brush.seed(seed);
  brush.noiseSeed(seed);
  brush.noStroke();
  brush.fill(color, opacity * p.alpha);
  brush.fillBleed(o.bleed ?? 0.04, 'in');
  // Texture 0 and no scatter: granulation gaps show whatever was painted before the part (the shelf through a figure,
  // the fog through a wall); only the pigment ring (`border`) and the hue split are used (build-notes 2026-10-30, Film look dev).
  brush.fillTexture(0, o.border ?? 0.4, false, o.split ?? 0.2);
  brush.polygon(pts);
  brush.noFill();
};

/**
 * Shading direction of a part: the key itself for round parts; for long parts (limbs, sleeves, torch) the part of the key
 * across the long axis, so a limb shades down one side like a cylinder instead of across its length.
 */
export const formDir = (pts: Pt[], key: Pt): Pt => {
  const k = norm(key);
  const n = pts.length;
  const mx = pts.reduce((a, q) => a + q[0], 0) / n, my = pts.reduce((a, q) => a + q[1], 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of pts) {
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
    sxy += (x - mx) * (y - my);
  }
  const tr = sxx + syy, det = sxx * syy - sxy * sxy;
  const l1 = tr / 2 + Math.sqrt(Math.max(0, (tr * tr) / 4 - det)), l2 = tr - l1;
  if (l2 <= 0 || l1 / l2 < 3.2) return k;
  const ax = norm(Math.abs(sxy) > 1e-6 ? [l1 - syy, sxy] : sxx >= syy ? [1, 0] : [0, 1]);
  const d = k[0] * ax[0] + k[1] * ax[1];
  const across: Pt = [k[0] - d * ax[0], k[1] - d * ax[1]];
  return Math.hypot(across[0], across[1]) < 0.2 ? k : norm(across);
};

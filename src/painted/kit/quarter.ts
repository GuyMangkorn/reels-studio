import type {Pt} from './painter';

// Three-quarter geometry for the front body (`cast.ts`) and head (`head.ts`), see `FigPose.quarter`; `back.ts` uses `quarterGeo`
// and `clipHalf` for the back three-quarter (VA02, 13 Nov 2026).
//
// The torso is read as a block turned by `theta` about the vertical axis: a front plane `kp = cos theta` wide and a side plane
// `QUARTER_DEPTH * sin theta` wide, joined at a vertical edge. The whole silhouette is `kt` times the flat width, so the picture keeps
// the figure's footprint and only its inner structure changes. Local `u` stays in front-view metres (the renderer multiplies it by
// `kt`), so every front-view mark (collar, belt, hem) keeps its coordinates.

/** Torso depth over width (a real torso is about 0.6 as deep as it is wide). */
export const QUARTER_DEPTH = 0.62;
/** Valid turn in degrees. 15..60 was the original range; the orbit (`quarterFollow`) runs on to 75 so the cut to the profile is a 15 degree
 *  step, not 30 (13 Nov 2026). Past about 75 the face and the turned arms no longer read. */
export const QUARTER_MIN = 15, QUARTER_MAX = 75;

export type QuarterGeo = {
  /** Turn in radians (clamped to `QUARTER_MIN`..`QUARTER_MAX`, 15..75 degrees). */
  qr: number;
  /** Screen side the figure faces: -1 left, +1 right. */
  qdir: 1 | -1;
  sin: number; cos: number;
  /** Centre offsets foreshorten by kp; the torso and cloth width scale by kt; kr = kp / kt. */
  kp: number; kt: number; kr: number;
  /** Share of the silhouette width taken by the front plane. */
  sf: number;
  /** Late turn 0..1 (`quarterLate`): 0 up to 60 degrees, 1 at 75. */
  late: number;
};

/** Late turn (orbit turn, 13 Nov 2026): 0 up to 60 degrees (the approved 15..60 drawing is untouched), easing to 1 at 75. Over it the turned
 *  body and head move toward the profile they cut to: chest marks to the front edge, the near arm in from the silhouette edge, the hair round
 *  the back of the head. `deg` is the turn in degrees (sign ignored). */
export const quarterLate = (deg: number): number => smooth01(60, 75, Math.abs(deg));

/** Geometry of a three-quarter pose; undefined when the pose has no `quarter`. */
export const quarterGeo = (pose: {quarter?: 'left' | 'right'; quarterDeg?: number}): QuarterGeo | undefined => {
  if (!pose.quarter) return undefined;
  const qr = (Math.max(QUARTER_MIN, Math.min(QUARTER_MAX, pose.quarterDeg ?? 45)) * Math.PI) / 180;
  const sin = Math.sin(qr), cos = Math.cos(qr), kt = Math.hypot(cos, QUARTER_DEPTH * sin);
  return {qr, qdir: pose.quarter === 'left' ? -1 : 1, sin, cos, kp: cos, kt, kr: cos / kt, sf: cos / (cos + QUARTER_DEPTH * sin), late: quarterLate((qr * 180) / Math.PI)};
};

/** Keep the part of polygon `pts` on the same side of the line a-b as the point `ref` (Sutherland-Hodgman against one half-plane). */
export const clipHalf = (pts: Pt[], a: Pt, b: Pt, ref: Pt): Pt[] => {
  const side = (q: Pt) => (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
  const sg = Math.sign(side(ref)) || 1;
  const d = (q: Pt) => sg * side(q);
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % pts.length], d0 = d(p0), d1 = d(p1);
    if (d0 >= 0) out.push(p0);
    if ((d0 >= 0) !== (d1 >= 0)) {
      const t = d0 / (d0 - d1);
      out.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]);
    }
  }
  return out;
};

/**
 * A hem or belt edge across a turned body: the vertical edge between the planes is the nearest part of the block, so the hem
 * dips lowest there and rises toward both ends. Returns `n + 1` points from `u0` to `u1` at height `v` (local metres), dipping by `amp`
 * at `uc`.
 */
export const curvedEdge = (u0: number, u1: number, v: number, uc: number, amp: number, n = 8): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const u = u0 + ((u1 - u0) * i) / n;
    const span = u >= uc ? Math.abs((u0 > u1 ? u0 : u1) - uc) : Math.abs((u0 < u1 ? u0 : u1) - uc);
    const t = span < 1e-6 ? 0 : Math.max(-1, Math.min(1, (u - uc) / span));
    return [u, v - amp * Math.cos((Math.PI / 2) * t)];
  });

/**
 * Union of overlapping shapes as one outline (pass 4, 4 Nov 2026): the farthest crossing of each of `n` rays from `c` with any polygon's
 * boundary. Exact for shapes whose union is star-shaped about `c` (a skull with its hair cap, volume, bob or hood behind it), so a turned
 * head is one solid with one silhouette instead of stacked same-colour layers whose edges show through.
 */
export const polarUnion = (polys: Pt[][], c: Pt, n = 240): Pt[] =>
  Array.from({length: n}, (_, i): Pt => {
    const a = (i / n) * 2 * Math.PI, dx = Math.cos(a), dy = Math.sin(a);
    let tMax = 0;
    for (const poly of polys) {
      for (let j = 0; j < poly.length; j++) {
        const p0 = poly[j], p1 = poly[(j + 1) % poly.length], ex = p1[0] - p0[0], ey = p1[1] - p0[1];
        const den = dx * ey - dy * ex;
        if (Math.abs(den) < 1e-12) continue;
        const wx = p0[0] - c[0], wy = p0[1] - c[1];
        const t = (wx * ey - wy * ex) / den, s = (wx * dy - wy * dx) / den;
        if (t > 0 && s >= 0 && s <= 1 && t > tMax) tMax = t;
      }
    }
    return [c[0] + dx * tMax, c[1] + dy * tMax];
  });

/**
 * The part of polygon `pts` above (`keep` 'above': v <= h(u), screen y down) or below the curve v = h(u). Between a boundary exit and the
 * next entry the cut follows the curve itself, so a hairline or nape cut is curved, never a straight clip edge. `outer` returns the kept
 * pieces of the original boundary (to ink the silhouette without inking the cut).
 */
export const splitByCurve = (pts: Pt[], h: (u: number) => number, keep: 'above' | 'below', step = 0.03): {poly: Pt[]; outer: Pt[][]} => {
  const inside = (q: Pt) => (keep === 'above' ? q[1] <= h(q[0]) : q[1] >= h(q[0]));
  const n = pts.length, i0 = pts.findIndex(inside);
  if (i0 < 0) return {poly: [], outer: []};
  if (pts.every(inside)) return {poly: pts, outer: [[...pts, pts[0]]]};
  const cross = (a: Pt, b: Pt): Pt => {
    let lo = 0, hi = 1;
    const ina = inside(a);
    for (let k = 0; k < 24; k++) {
      const m = (lo + hi) / 2, q: Pt = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
      if (inside(q) === ina) lo = m; else hi = m;
    }
    const m = (lo + hi) / 2;
    return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
  };
  const poly: Pt[] = [], outer: Pt[][] = [];
  let run: Pt[] = [], exit: Pt | null = null;
  for (let k = 0; k < n; k++) {
    const a = pts[(i0 + k) % n], b = pts[(i0 + k + 1) % n], ia = inside(a), ib = inside(b);
    if (ia) { poly.push(a); run.push(a); }
    if (ia && !ib) {
      exit = cross(a, b);
      poly.push(exit); run.push(exit);
      outer.push(run); run = [];
    } else if (!ia && ib) {
      const entry = cross(a, b);
      if (exit) {
        const m = Math.max(1, Math.ceil(Math.abs(entry[0] - exit[0]) / step));
        for (let j = 1; j < m; j++) {
          const u = exit[0] + ((entry[0] - exit[0]) * j) / m;
          poly.push([u, h(u)]);
        }
      }
      poly.push(entry); run = [entry];
    }
  }
  // The last run closes onto the first one (the walk starts inside, at i0).
  if (run.length && outer.length) outer[0] = [...run, ...outer[0]];
  else if (run.length) outer.push(run);
  return {poly, outer};
};

/** Polygon with no edge longer than `step` (so a non-linear map such as `turnU` bends the edges instead of cutting chords). */
export const densify = (pts: Pt[], step: number, closed = true): Pt[] => {
  const out: Pt[] = [];
  const m = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
  }
  if (!closed) out.push(pts[pts.length - 1]);
  return out;
};

/** Smooth 0..1 step of `x` between `a` and `b`. */
export const smooth01 = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Ramer-Douglas-Peucker simplification (tolerance `eps`, same units as the points). Ink outlines go through p5.brush `spline`, which
 * drifts off the shape over a few hundred short segments (the r4 spiky outline crept 0.1 head units off its fill); corners stay.
 */
export const simplify = (pts: Pt[], eps: number): Pt[] => {
  if (pts.length < 3) return pts;
  const keep = new Array<boolean>(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = pts[a], [bx, by] = pts[b], len = Math.hypot(bx - ax, by - ay) || 1e-9;
    let best = -1, dmax = eps;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
      if (d > dmax) { dmax = d; best = i; }
    }
    if (best > 0) { keep[best] = true; stack.push([a, best], [best, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};

/**
 * A cap on a three-quarter head (pass 4, 4 Nov 2026): crown and band are round shells, so they keep their outline (the head's
 * silhouette does not turn); the badge turns round the band (radius 1.13) and the peak is a half disc in front of the band, turned and
 * projected, so it reaches past the brow on the facing side. Head units; `turn` radians (+ = facing screen right).
 */
export const turnedCap = (tn: string, pts: Pt[], turn: number): Pt[] => {
  if (tn === 'main' || tn === 'band') return pts;
  const c = Math.cos(turn), s = Math.sin(turn), rot = (x: number, z: number) => x * c + z * s;
  if (tn === 'white') return pts.map(([u, v]): Pt => {
    const z = Math.sqrt(Math.max(0, 1.13 * 1.13 - u * u));
    return [rot(u, z), v];
  });
  // Peak: inner edge along the band front (x = 1.0 cos a, z = 1.0 sin a), outer edge 0.62 further forward, a little lower at the tip.
  const n = 16, rim = (r: number, dz: number, dv: number) => Array.from({length: n + 1}, (_, i): Pt => {
    const a = (Math.PI * i) / n, x = r * Math.cos(a), z = r * Math.sin(a) + dz * Math.sin(a);
    return [rot(x, z), -0.42 + dv * Math.sin(a)];
  });
  return [...rim(0.98, 0.62, 0.05), ...rim(0.98, 0, -0.02).reverse()];
};

import {capsule, hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import type {EvaAnchors} from '../kit/eva';

// EDU-EP08-SHORT N10 `ice-shell-gag` (brief VD11, storyboard S01-B02-SH02): cartoon frost creeps over the SUIT from its edges toward the centre
// in ~10 f, freezes 4 f, cracks, then crumbles into shards that float away (zero-g: constant drift and spin, nothing falls). The frost is
// confined to convex silhouette parts of the suit (torso below the neck ring, sleeves to the wrist, legs): never the head, neck ring, gloves or
// boots. A pure function of the shot-local clock; the silhouette parts come from the figure's anchors, so the gag follows the figure.

export const ICE_T = {creep: [0.0, 0.33] as const, hold: [0.33, 0.47] as const, crack: [0.47, 0.65] as const, crumble: [0.65, 1.4] as const, life: 0.75};
export const ICE_COL = {a: '#e6f4fb', b: '#cfe8f6', c: '#f4fbff', edge: '#7fb2d6', crack: '#4a7fa6', glint: '#ffffff'};

export type IceState = {creep: number; crack: number; crumble: number; frost: boolean};
const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / Math.max(1e-6, b - a)));
const ease = (x: number) => x * x * (3 - 2 * x);
export const iceAt = (t: number): IceState => ({
  creep: ease(ramp(t, ICE_T.creep[0], ICE_T.creep[1])), crack: ramp(t, ICE_T.crack[0], ICE_T.crack[1]), crumble: t - ICE_T.crumble[0],
  frost: t >= ICE_T.creep[0] && t < ICE_T.crumble[1],
});

/** A silhouette part: a convex polygon (picture px) and a tag. */
export type IcePart = {id: string; poly: Pt[]};

type Def = {height: number; headScale?: number; outfit: {shoulder: number}};
/**
 * The suit's frost-able parts from a figure's anchors for a front or three-quarter view (or a profile with `side`): torso from just under the
 * neck ring to the hips, both sleeves down to 0.1 m short of the glove, both legs to the ankle. `u` is px per metre (EvaAnchors.u).
 */
export const suitParts = (a: EvaAnchors, def: Def, o: {side?: boolean} = {}): IcePart[] => {
  const u = a.u, HD = 0.425 * (def.headScale ?? 1), chinM = def.height - HD, shV = chinM - 0.16 * HD, torso = (chinM - 0.068) * 0.44, hipM = shV - torso + 0.034;
  const cx = (a.rShoulder[0] + a.lShoulder[0]) / 2, shY = (a.rShoulder[1] + a.lShoulder[1]) / 2, half = Math.abs(a.rShoulder[0] - a.lShoulder[0]) / 2;
  const hipY = a.feet[1] - hipM * u, topY = Math.max(a.ring[1] + 0.035 * u, shY - 0.02 * u), k = o.side ? 0.55 : 1;
  const parts: IcePart[] = [];
  const hw = Math.max(half * k * 0.96, 0.07 * u);
  parts.push({id: 'torso', poly: [[cx - hw * 0.8, topY], [cx + hw * 0.8, topY], [cx + hw * 1.0, topY + 0.05 * u], [cx + hw * 0.92, hipY], [cx - hw * 0.92, hipY], [cx - hw * 1.0, topY + 0.05 * u]]});
  const arm = (sh: Pt, up: Pt, hand: Pt, id: string) => {
    const el: Pt = [2 * up[0] - sh[0], 2 * up[1] - sh[1]];
    const L = Math.hypot(hand[0] - el[0], hand[1] - el[1]) || 1, cut = Math.max(0, L - 0.1 * u) / L;
    const wr: Pt = [el[0] + (hand[0] - el[0]) * cut, el[1] + (hand[1] - el[1]) * cut];
    parts.push({id: id + 'U', poly: capsule(sh, el, 0.058 * u * 2, 0.052 * u * 2, 5)}, {id: id + 'F', poly: capsule(el, wr, 0.052 * u * 2, 0.047 * u * 2, 5)});
  };
  arm(a.rShoulder, a.rUpper, a.rHand, 'r');
  if (!o.side) arm(a.lShoulder, a.lUpper, a.lHand, 'l');
  const legW = 0.075 * u * 2, ankleY = a.feet[1] - 0.1 * u;
  if (o.side) parts.push({id: 'leg', poly: capsule([cx, hipY], [cx, ankleY], legW * 1.15, legW * 0.9, 5)});
  else for (const s of [-1, 1]) parts.push({id: s < 0 ? 'legL' : 'legR', poly: capsule([cx + s * hw * 0.5, hipY], [cx + s * hw * 0.52, ankleY], legW, legW * 0.88, 5)});
  return parts;
};

const centroid = (P: Pt[]): Pt => [P.reduce((s, q) => s + q[0], 0) / P.length, P.reduce((s, q) => s + q[1], 0) / P.length];
const scaleAbout = (P: Pt[], c: Pt, k: number): Pt[] => P.map(([x, y]): Pt => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]);
/** Liang-Barsky style clip of segment a-b against a convex polygon (any winding); null when nothing remains. */
export const clipSegment = (P: Pt[], a: Pt, b: Pt): [Pt, Pt] | null => {
  const area = P.reduce((s, q, i) => { const r = P[(i + 1) % P.length]; return s + (q[0] * r[1] - r[0] * q[1]); }, 0), sg = area >= 0 ? 1 : -1;
  let t0 = 0, t1 = 1;
  for (let i = 0; i < P.length; i++) {
    const p0 = P[i], p1 = P[(i + 1) % P.length], ex = p1[0] - p0[0], ey = p1[1] - p0[1];
    // inside is the left of each edge for CCW (sg = 1) polygons: cross(e, p - p0) * sg >= 0
    const d0 = (ex * (a[1] - p0[1]) - ey * (a[0] - p0[0])) * sg, d1 = (ex * (b[1] - p0[1]) - ey * (b[0] - p0[0])) * sg;
    if (d0 < 0 && d1 < 0) return null;
    if (d0 < 0 !== d1 < 0) { const k = d0 / (d0 - d1); if (d0 < 0) t0 = Math.max(t0, k); else t1 = Math.min(t1, k); }
  }
  if (t0 >= t1) return null;
  return [[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]];
};
/** Inside test for a convex polygon (tests use it to prove the frost stays on the suit). */
export const insidePoly = (P: Pt[], [x, y]: Pt, pad = 0.5): boolean => {
  const area = P.reduce((s, q, i) => { const r = P[(i + 1) % P.length]; return s + (q[0] * r[1] - r[0] * q[1]); }, 0), sg = area >= 0 ? 1 : -1;
  return P.every((p0, i) => { const p1 = P[(i + 1) % P.length]; return ((p1[0] - p0[0]) * (y - p0[1]) - (p1[1] - p0[1]) * (x - p0[0])) * sg >= -pad; });
};

/** Jagged copy of a closed polygon: each edge split into 3 with the inner vertices pushed alternately in and out by up to `amp` px (crystal edge). */
const jag = (P: Pt[], c: Pt, amp: number, seed: number): Pt[] => {
  const out: Pt[] = [];
  P.forEach((q, i) => {
    const r = P[(i + 1) % P.length];
    out.push(q);
    for (const f of [1 / 3, 2 / 3]) {
      const x = q[0] + (r[0] - q[0]) * f, y = q[1] + (r[1] - q[1]) * f, dx = x - c[0], dy = y - c[1], L = Math.hypot(dx, dy) || 1, s = (hash(seed + i * 7 + f * 3) - 0.5) * 2 * amp;
      out.push([x + (dx / L) * s, y + (dy / L) * s]);
    }
  });
  return out;
};

/** Bisect a triangle across its longest edge until every edge is under `max` px (shards stay chunky: no long thin splinters). */
const bisect = (tri: Pt[], max: number, depth = 0): Pt[][] => {
  const e = [0, 1, 2].map((i) => Math.hypot(tri[(i + 1) % 3][0] - tri[i][0], tri[(i + 1) % 3][1] - tri[i][1])), L = Math.max(...e), i = e.indexOf(L);
  if (L <= max || depth > 5) return [tri];
  const a = tri[i], b = tri[(i + 1) % 3], c = tri[(i + 2) % 3], m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return [...bisect([a, m, c], max, depth + 1), ...bisect([m, b, c], max, depth + 1)];
};

export type IceShard = {part: string; tri: Pt[]; c: Pt; v: Pt; spin: number; delay: number; tone: 0 | 1 | 2};
/** The frozen shell as triangles (centroid fan, each triangle split once) with a drift velocity (px/s, outward from the part centre plus a common sideways drift) and a spin. */
export const iceShards = (parts: IcePart[], u: number, seed = 9950): IceShard[] => {
  const out: IceShard[] = [];
  parts.forEach((part, pi) => {
    const c = centroid(part.poly), n = part.poly.length;
    for (let i = 0; i < n; i++) {
      const a = part.poly[i], b = part.poly[(i + 1) % n], m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const cells = [...bisect([a, m, c], 0.17 * u), ...bisect([m, b, c], 0.17 * u)];
      for (const [k, tri] of cells.entries()) {
        const tc = centroid(tri), id = seed + pi * 1000 + i * 40 + k, dx = tc[0] - c[0], dy = tc[1] - c[1], L = Math.hypot(dx, dy) || 1, sp = (0.22 + 0.5 * hash(id)) * u;
        out.push({part: part.id, tri, c: tc, v: [(dx / L) * sp + 0.05 * u, (dy / L) * sp - 0.04 * u * hash(id + 1)], spin: (hash(id + 2) - 0.5) * 6, delay: 0.25 * hash(id + 3) + 0.001 * Math.hypot(tc[0] - parts[0].poly[0][0], tc[1] - parts[0].poly[0][1]) * 0, tone: (Math.floor(hash(id + 4) * 3) % 3) as 0 | 1 | 2});
      }
    }
  });
  return out;
};
const toneCol = (n: 0 | 1 | 2) => [ICE_COL.a, ICE_COL.b, ICE_COL.c][n];

/** One shard at crumble time `tau` seconds (negative: at rest on the suit): position offset, rotation and size factor. */
export const shardAt = (s: IceShard, tau: number): {off: Pt; rot: number; k: number; gone: boolean} => {
  const a = tau - s.delay;
  if (a <= 0) return {off: [0, 0], rot: 0, k: 1, gone: false};
  const k = Math.max(0, 1 - a / ICE_T.life);
  return {off: [s.v[0] * a, s.v[1] * a], rot: s.spin * a, k: 0.35 + 0.65 * k, gone: a >= ICE_T.life};
};

/**
 * Paint the gag at shot-local `t` over `parts` (from `suitParts`): paint it right after the figure. Creep: jagged frost rings closing in from
 * each part's edge with crystal ticks; hold: whole shell; crack: three dark zig-zag cracks across the torso; crumble: shards drift away and spin.
 */
export const paintIceShell = (p: Painter, parts: IcePart[], u: number, t: number, seed = 9950) => {
  const s = iceAt(t);
  if (!s.frost) return;
  const id = seed;
  if (s.crumble <= 0) {
    parts.forEach((part, pi) => {
      const c = centroid(part.poly);
      if (s.creep >= 0.985) { hardFill(p, id + pi * 40, ICE_COL.a, part.poly); }
      else if (s.creep > 0.01) {
        const inner = jag(scaleAbout(part.poly, c, 1 - s.creep), c, 0.012 * u, id + pi), outer = part.poly;
        hardFill(p, id + pi * 40, ICE_COL.a, [...outer, outer[0], inner[0], ...[...inner].reverse()]);
        // crystal ticks growing inward from the edge
        outer.forEach((q, i) => {
          const r = outer[(i + 1) % outer.length];
          for (let j = 0; j < 3; j++) {
            const f = (j + 0.5 + 0.3 * (hash(id + pi * 9 + i + j) - 0.5)) / 3, bx = q[0] + (r[0] - q[0]) * f, by = q[1] + (r[1] - q[1]) * f, dx = c[0] - bx, dy = c[1] - by, L = Math.hypot(dx, dy) || 1;
            const len = Math.min(0.06 * u * s.creep * (0.6 + 0.8 * hash(id + i * 3 + j)), L * 0.5), ang = (hash(id + 5 + i + j * 2) - 0.5) * 0.9, ca = Math.cos(ang), sa = Math.sin(ang);
            const seg = clipSegment(part.poly, [bx, by], [bx + (dx / L * ca - dy / L * sa) * len, by + (dx / L * sa + dy / L * ca) * len]);
            if (seg) inkLine(p, id + pi * 40 + 10 + i * 3 + j, [seg[0], seg[1]], {closed: false, weight: 1.1, color: ICE_COL.edge, still: true});
          }
        });
      }
      if (s.creep > 0.01) inkLine(p, id + pi * 40 + 1, part.poly, {closed: true, weight: 1.2, color: ICE_COL.edge, still: true, curve: 0});
    });
    // crack: zig-zags across the torso
    const torso = parts.find((q) => q.id === 'torso');
    if (torso && s.crack > 0.01) {
      const c = centroid(torso.poly), xs = torso.poly.map((q) => q[0]), ys = torso.poly.map((q) => q[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
      for (let k = 0; k < 3; k++) {
        const x0 = c[0] + (k - 1) * w * 0.26, pts: Pt[] = [];
        const n = Math.max(2, Math.round(7 * s.crack));
        for (let i = 0; i <= n; i++) pts.push([x0 + (i % 2 ? 1 : -1) * w * 0.05 * (0.6 + hash(id + 300 + k * 9 + i)), Math.min(...ys) + (h * i) / 7]);
        const clipped: Pt[] = [];
        for (let i = 0; i + 1 < pts.length; i++) { const seg = clipSegment(torso.poly, pts[i], pts[i + 1]); if (seg) { if (!clipped.length) clipped.push(seg[0]); clipped.push(seg[1]); } }
        if (clipped.length > 1) { inkLine(p, id + 700 + k * 2, clipped, {closed: false, weight: 3.4, color: '#ffffff', still: true, curve: 0}); inkLine(p, id + 701 + k * 2, clipped, {closed: false, weight: 1.6, color: ICE_COL.crack, still: true, curve: 0}); }
      }
    }
    return;
  }
  // crumble: shards leave the shell; each draws its own facet colour, an edge and (some) a glint
  const shards = iceShards(parts, u, id);
  shards.forEach((sh, i) => {
    const st = shardAt(sh, s.crumble);
    if (st.gone) return;
    const ca = Math.cos(st.rot), sa = Math.sin(st.rot);
    const poly = sh.tri.map(([x, y]): Pt => { const dx = (x - sh.c[0]) * st.k, dy = (y - sh.c[1]) * st.k; return [sh.c[0] + st.off[0] + dx * ca - dy * sa, sh.c[1] + st.off[1] + dx * sa + dy * ca]; });
    hardFill(p, id + 800 + i, toneCol(sh.tone), poly);
    if (st.off[0] !== 0 || st.off[1] !== 0) inkLine(p, id + 1500 + i, poly, {closed: true, weight: 0.9, color: ICE_COL.edge, still: true, curve: 0});
    if (i % 5 === 0 && st.k > 0.6) { const q = poly[0], r = 3.5 * st.k; hardFill(p, id + 2200 + i, ICE_COL.glint, [[q[0], q[1] - r], [q[0] + r * 0.3, q[1]], [q[0], q[1] + r], [q[0] - r * 0.3, q[1]]]); }
  });
};

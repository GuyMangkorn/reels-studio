import {ell, hardFill, inkLine, solid, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDist, camPoint, camUnit, type YCam} from '../kit/ycam';
import {wFill, type Item} from './world';

// Macro world of EDU-EP05 (brief EDU-BRIEF-R1.1 VD06, VD09, VD11; set metres `sm`, k 320 sm per real metre). Look-frame code (W3.1):
// `new: macro-grass` blade ribbons, `new: dew-drop` D1 at rest, thatch ground and the painted depth of field. Boss turns the blade
// and drop into shared kit tools after the user passes the look frames (N1, N4); nothing here is shared yet.
// Blades are world-space centre lines (so they slide in parallax), drawn as ribbons whose width faces the lens.

export type BladePal = {base: string; body: string; edge: string; vein: string};
export const SUNLIT: BladePal = {base: '#6f9a3a', body: '#b9d86a', edge: '#e8f2a0', vein: '#8fb24a'};
/** Backlit blades in the middle distance: darker bodies, bright rims (so TINY, the ant's leaf and the drop pop). */
export const MIDLIT: BladePal = {base: '#3f6a2c', body: '#7ea644', edge: '#e4f09a', vein: '#5f8a34'};
export const SHADE: BladePal = {base: '#2a4a4c', body: '#3f6b5a', edge: '#5f8a78', vein: '#2f5560'};

export type Blade = {
  root: V3; h: number; w: number;
  /** Horizontal lean direction [x, z] (normalised inside). */
  dir: [number, number];
  /** Start angle from vertical (deg) and extra curl toward the tip (deg). */
  lean: number; curl: number;
  pal: BladePal; seed: number;
  /** Dew beads: [position along the blade 0..1, radius sm]. */
  beads?: [number, number][];
  /** Wind sway amplitude (deg) on ambient time. */
  sway?: number;
  /** Ribbon width squash 0..1 where the blade lies flat (seen edge-on). */
  flatten?: number;
  /** Authored world centre line (replaces the lean/curl growth; hero blades such as `B-DEW`). */
  line?: V3[];
  /** Width taper exponent (default 0.55; smaller keeps the blade broad to the tip). */
  taper?: number;
  /** Always paint as an out-of-focus near sweep (soft dark wash, no line), whatever its distance. */
  near?: boolean;
  /** Extra width multiplier along the blade, s 0..1 root to tip (LF03 v3: `B-DEW` narrows to a slim tip under the drop). */
  widthAt?: (s: number) => number;
  /** Breeze bend (N1, SH05 "tip deflection <= 25% of height"): the line is pushed toward `dir` [x, z] by `amt` x height at the tip,
   * growing with s^2 from the root (the root stays planted). `amt` is clamped to `MAX_BEND`. */
  bend?: Bend;
};
export type Bend = {dir: [number, number]; amt: number};
/** Largest tip deflection of a blade in the breeze, as a fraction of its height (scene sheet S01-B02-SH01). */
export const MAX_BEND = 0.25;

const DEG = Math.PI / 180;
/** World centre line of a blade at time t (n segments). */
export const bladeLine = (b: Blade, t = 0, n = 12): V3[] => {
  const [dx, dz] = b.dir, k = Math.hypot(dx, dz) || 1, ux = dx / k, uz = dz / k;
  const sw = (b.sway ?? 0) * Math.sin(t * 0.9 + b.seed * 1.7) * DEG;
  const pts: V3[] = [b.root];
  let [x, y, z] = b.root;
  for (let i = 1; i <= n; i++) {
    const s = (i - 0.5) / n, th = (b.lean * DEG + sw * s) + b.curl * DEG * s * s, ds = b.h / n;
    x += ux * Math.sin(th) * ds; z += uz * Math.sin(th) * ds; y += Math.cos(th) * ds;
    pts.push([x, y, z]);
  }
  return pts;
};

/** Applies a breeze bend to a world centre line of height `h`: lateral shift `amt * h * s^2` along `dir` (s = arc fraction), tip drop
 * so the blade keeps its length. Returns the line unchanged when there is no bend. */
export const bendLine = (line: V3[], h: number, bend?: Bend): V3[] => {
  if (!bend || bend.amt <= 0) return line;
  const k = Math.hypot(bend.dir[0], bend.dir[1]) || 1, ux = bend.dir[0] / k, uz = bend.dir[1] / k, amt = Math.min(MAX_BEND, bend.amt);
  const shifted = line.map((v, i): V3 => { const s = i / (line.length - 1), d = amt * h * s * s; return [v[0] + ux * d, v[1], v[2] + uz * d]; });
  // restore the segment lengths (the lean adds length): pull each segment's y back so it keeps its original length
  const out: V3[] = [shifted[0]];
  for (let i = 1; i < line.length; i++) {
    const L0 = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1], line[i][2] - line[i - 1][2]);
    const dx = shifted[i][0] - shifted[i - 1][0], dz = shifted[i][2] - shifted[i - 1][2], dy0 = line[i][1] - line[i - 1][1];
    const dy = Math.sqrt(Math.max(0, L0 * L0 - dx * dx - dz * dz)) * Math.sign(dy0 || 1);
    out.push([shifted[i][0], out[i - 1][1] + dy, shifted[i][2]]);
  }
  return out;
};
/** Tip deflection of a bent line as a fraction of its height (horizontal tip distance from the unbent line over the unbent height). */
export const tipDeflection = (base: V3[], bent: V3[]): number => {
  const a = base[base.length - 1], b = bent[bent.length - 1], h = Math.max(1e-6, a[1] - base[0][1]);
  return Math.hypot(b[0] - a[0], b[2] - a[2]) / h;
};
/** The same breeze on many blades (a gust over the set). */
export const gust = (blades: Blade[], bend: Bend): Blade[] => blades.map((b) => ({...b, bend}));

/** Screen ribbon of a world centre line: half widths `hw(s)` in world units, facing the lens. */
const ribbon = (c: YCam, line: V3[], hw: (s: number) => number) => {
  const sp = line.map((v) => camPoint(c, v));
  if (sp.some((q) => !q)) return null;
  const q = sp as Pt[], L: Pt[] = [], R: Pt[] = [];
  q.forEach((pt, i) => {
    const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const w = hw(i / (q.length - 1)) * camUnit(c, line[i]);
    L.push([pt[0] - (dy / n) * w, pt[1] + (dx / n) * w]);
    R.push([pt[0] + (dy / n) * w, pt[1] - (dx / n) * w]);
  });
  return {L, R, mid: q};
};

/** Painted depth of field (brief): nearer than `near` or farther than `far` from the lens = soft wash, no ink line. */
export type Dof = {near: number; far: number; nearColor: string; farColor: string; farMix: number};
export const DOF_SUN: Dof = {near: 0.9, far: 22, nearColor: '#3e5a26', farColor: '#f3e6b4', farMix: 0.55};

const lineHeight = (l?: V3[]) => (l ? l[l.length - 1][1] - l[0][1] : 1);
export const paintBlade = (p: Painter, c: YCam, b: Blade, t: number, dof: Dof = DOF_SUN) => {
  const line = bendLine(b.line ?? bladeLine(b, t), b.h || lineHeight(b.line), b.bend), d = camDist(c, b.root);
  const fl = b.flatten ?? 0;
  const hw = (s: number) => (b.w / 2) * Math.pow(1 - s, b.taper ?? 0.55) * (1 - fl * Math.min(1, s * 1.6)) * (b.widthAt ? b.widthAt(s) : 1);
  const r = ribbon(c, line, hw);
  if (!r) return;
  const poly = [...r.L, ...r.R.slice().reverse()];
  if (d < dof.near || b.near) { const nc = b.near ? b.pal.base : dof.nearColor; washAt(p, b.seed, nc, 235, poly, 0.1, 0.2); washAt(p, b.seed + 1, mixColor(nc, '#000000', 0.25), 120, [...r.L.slice(2), ...r.mid.slice(2).reverse()], 0.1, 0.2); return; }
  const far = d > dof.far, mixF = far ? Math.min(1, dof.farMix * (0.6 + (d - dof.far) / dof.far)) : 0;
  const col = (x: string) => (far ? mixColor(x, dof.farColor, mixF) : x);
  solid(p, b.seed, col(b.pal.base), poly, 3);
  // upper body lighter, then a translucent edge strip on the sun side (R edge)
  const k0 = Math.floor(r.mid.length * 0.22);
  const bodyPoly = [...r.L.slice(k0), ...r.R.slice(k0).reverse()];
  solid(p, b.seed + 1, col(b.pal.body), bodyPoly, 2);
  const edge = r.R.slice(k0).map((q, i): Pt => [q[0] + (r.mid[i + k0][0] - q[0]) * 0.45, q[1] + (r.mid[i + k0][1] - q[1]) * 0.45]);
  washAt(p, b.seed + 2, col(b.pal.edge), 200, [...r.R.slice(k0), ...edge.reverse()], 0.05, 0.1);
  if (!far) {
    inkLine(p, b.seed + 3, r.mid.slice(1, -1), {closed: false, weight: 0.45, color: b.pal.vein});
    inkLine(p, b.seed + 4, poly, {weight: 0.55, color: mixColor(b.pal.base, '#1d2a14', 0.45)});
  }
  (b.beads ?? []).forEach(([s, rad], i) => {
    const j = Math.min(line.length - 1, Math.round(s * (line.length - 1))), v = line[j], q = camPoint(c, v);
    if (!q) return;
    const u = camUnit(c, v), R0 = rad * u;
    if (R0 < 1.2) return;
    washAt(p, b.seed + 10 + i, far ? col('#f4f7e6') : '#eef8f4', 170, ell(q[0], q[1] - R0 * 0.2, R0, R0 * 0.9, 14), 0.05, 0.1);
    washAt(p, b.seed + 20 + i, mixColor(b.pal.body, '#4a6a2a', 0.3), 120, ell(q[0], q[1] - R0 * 0.55, R0 * 0.7, R0 * 0.35, 12), 0.05, 0.1);
    washAt(p, b.seed + 30 + i, '#fffbe8', 245, ell(q[0] - R0 * 0.35, q[1] - R0 * 0.45, R0 * 0.28, R0 * 0.24, 10), 0, 0);
    if (!far && R0 > 4) inkLine(p, b.seed + 40 + i, ell(q[0], q[1] - R0 * 0.2, R0, R0 * 0.9, 14), {weight: 0.35, color: '#7a9a6a'});
  });
};
export const bladeItem = (b: Blade, t: number, dof?: Dof, bias = 0): Item => ({at: b.root, bias, draw: (p, c) => paintBlade(p, c, b, t, dof)});

/** A clump of blades around (x, z), seeded and deterministic. */
export const clump = (o: {x: number; z: number; n: number; h: [number, number]; w: [number, number]; pal: BladePal; seed: number; spread?: number; beads?: boolean; beadAt?: [number, number]; lean?: [number, number]; curl?: [number, number]; sway?: number}): Blade[] =>
  Array.from({length: o.n}, (_, i) => {
    const r = (k: number) => hash(o.seed * 31 + i * 7 + k);
    const a = r(1) * 2 * Math.PI, sp = (o.spread ?? 0.6) * Math.sqrt(r(2));
    const [l0, l1] = o.lean ?? [3, 16], [c0, c1] = o.curl ?? [6, 30];
    const [b0, b1] = o.beadAt ?? [0.15, 0.75];
    const beads: [number, number][] | undefined = o.beads ? [[b0 + r(5) * (b1 - b0), 0.12 + r(6) * 0.2], ...(r(9) > 0.4 ? [[b0 + r(10) * (b1 - b0) * 0.6, 0.08 + r(11) * 0.15] as [number, number]] : [])] : undefined;
    return {root: [o.x + Math.cos(a) * sp, 0, o.z + Math.sin(a) * sp], h: o.h[0] + r(3) * (o.h[1] - o.h[0]), w: o.w[0] + r(4) * (o.w[1] - o.w[0]), dir: [Math.cos(a + 0.4 * (r(7) - 0.5)), Math.sin(a + 0.4 * (r(7) - 0.5))], lean: l0 + r(8) * (l1 - l0), curl: c0 + r(12) * (c1 - c0), pal: o.pal, seed: o.seed * 100 + i * 13, beads, sway: o.sway ?? 1.2};
  });

/** Ground plane with thatch bits and pebbles (sm). */
export const paintGround = (p: Painter, c: YCam, o: {x: [number, number]; z: [number, number]; soil: string; thatch: string; pebble: string; seed: number; bits?: number; bx?: [number, number]; bz?: [number, number]}) => {
  wFill(p, c, o.seed, o.soil, [[o.x[0], 0, o.z[0]], [o.x[1], 0, o.z[0]], [o.x[1], 0, o.z[1]], [o.x[0], 0, o.z[1]]]);
  const n = o.bits ?? 60, bx = o.bx ?? o.x, bz = o.bz ?? o.z;
  for (let i = 0; i < n; i++) {
    const r = (k: number) => hash(o.seed * 17 + i * 5 + k);
    const x = bx[0] + r(1) * (bx[1] - bx[0]), z = bz[0] + r(2) * (bz[1] - bz[0]), v: V3 = [x, 0, z];
    if (camDist(c, v) > 18) continue;
    const q = camPoint(c, v);
    if (!q) continue;
    const u = camUnit(c, v);
    if (r(3) < 0.55) {
      const len = (0.4 + r(4) * 1.2), a = r(5) * Math.PI, ex = Math.cos(a) * len, ez = Math.sin(a) * len;
      const b = camPoint(c, [x + ex, 0.02, z + ez]);
      if (b) solid(p, o.seed + 100 + i, mixColor(o.thatch, o.soil, r(6) * 0.4), [[q[0], q[1] - 0.04 * u], [b[0], b[1] - 0.04 * u], [b[0], b[1] + 0.04 * u], [q[0], q[1] + 0.04 * u]], 2);
    } else {
      const rad = 0.08 + r(7) * 0.25;
      solid(p, o.seed + 300 + i, mixColor(o.pebble, o.soil, r(8) * 0.5), ell(q[0], q[1] - rad * u * 0.4, rad * u, rad * u * 0.55, 10), 2);
    }
  }
};

/** Warm sun shafts as soft slanted washes (in canvas, so they stay under the cast). */
export const paintShafts = (p: Painter, xs: number[], o: {top: number; bottom: number; slant: number; color: string; level: number; seed: number; t: number}) => {
  xs.forEach((x, i) => {
    const w = 50 + hash(i + o.seed) * 80, br = 0.6 + 0.4 * Math.sin(o.t * 0.8 + i * 2.1);
    washAt(p, o.seed + i, o.color, 70 * o.level * br, [[x, o.top], [x + w, o.top], [x + w + o.slant, o.bottom], [x + o.slant + w * 0.2, o.bottom]], 0.2, 0.1);
  });
};

/** Vertical screen gradient (flat bands), for the macro air behind the far blades. */
export const paintAir = (p: Painter, cols: [number, string][], seed: number) => {
  for (let i = 0; i < cols.length - 1; i++) {
    const [y0, c0] = cols[i], [y1] = cols[i + 1];
    const steps = 6;
    for (let k = 0; k < steps; k++) {
      const a = y0 + ((y1 - y0) * k) / steps, b = y0 + ((y1 - y0) * (k + 1)) / steps + 2;
      hardFill(p, seed + i * 10 + k, mixColor(c0, cols[i + 1][1], k / (steps - 1)), [[-40, a], [1120, a], [1120, b], [-40, b]]);
    }
  }
};

/** Soft glow blobs (sun through blades). */
export const glow = (p: Painter, x: number, y: number, r: number, color: string, level: number, seed: number) => {
  washAt(p, seed, color, 60 * level, ell(x, y, r, r, 24), 0.4, 0.2);
  washAt(p, seed + 1, color, 90 * level, ell(x, y, r * 0.55, r * 0.55, 20), 0.3, 0.2);
  washAt(p, seed + 2, mixColor(color, '#ffffff', 0.5), 150 * level, ell(x, y, r * 0.22, r * 0.22, 16), 0.2, 0.2);
};

// ---- `new: dew-drop` D1 at rest (state a). Sessile drop: Ø 1.1, height 0.85, contact patch Ø 0.7 sm (C07: <= 1.0x TINY).
export const DROP = {w: 1.1, h: 0.91, patch: 0.3} as const; // LF03 v4: rounded foot wrapping the blade bend; contact ~0.3 sm along the blade, height unchanged
/** Drop outline in sm about the contact centre (x right in the picture, y up). Upper half: a sphere of radius 0.55 centred 0.36 above the
 * contact (top 0.91, 0.58x TINY's height, under the 1.0x limit). LF03 v4: the lower half is no longer a flat chord (v2/v3: a 0.89 sm flat
 * foot that floated beside the slim blade) but a rounded belly (ry 0.32) that sags 0.04 onto the blade bend (`DROP_SAG` centre x), so the
 * water wraps down over the blade and the contact patch follows it. Points run from the bottom, round the right, top and left, back to
 * the bottom, so a filter that removes the contact keeps one contiguous run. */
export const DROP_R = 0.55, DROP_C = 0.36, DROP_RY = 0.32, DROP_SAG = {x: -0.04, d: 0.04, w: 0.17};
const dropY = (x: number, sn: number) => (sn >= 0 ? DROP_C + sn * DROP_R : DROP_C + sn * DROP_RY - DROP_SAG.d * Math.exp(-(((x - DROP_SAG.x) / DROP_SAG.w) ** 2)));
export const dropShape = (n = 48): Pt[] => Array.from({length: n + 1}, (_, i): Pt => {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / n, x = Math.cos(a) * DROP_R;
  return [x, dropY(x, Math.sin(a))];
});
/** Radial scale (about the drop centre) that keeps a point inside the v4 outline (`m` of the boundary). */
const inDrop = ([x, y]: Pt, m = 0.97): Pt => {
  const dy = y - DROP_C, a = Math.atan2(dy, x), bx = Math.cos(a) * DROP_R, by = dropY(bx, Math.sin(a)) - DROP_C, lim = Math.hypot(bx, by) * m, n = Math.hypot(x, dy);
  const k = n > lim ? lim / n : 1;
  return [x * k, DROP_C + dy * k];
};
const circ = (cx: number, cy: number, r: number, ry = r, n = 24): Pt[] => Array.from({length: n}, (_, i): Pt => [cx + Math.cos((i / n) * 2 * Math.PI) * r, cy + Math.sin((i / n) * 2 * Math.PI) * ry]);

/**
 * Paints D1 at rest at screen contact point `g` (px), `u` px per sm, lit from back-left (`sunSide` -1). LF03 v2 (water, not glass):
 * a mostly transparent body tinted pale green-blue so the blade behind shows through; the inverted scene as a soft dark crescent that
 * hugs the top contour (no horizontal band, no level line) and a soft warm glow low in the body; a thin cool refraction edge on the
 * shadow side, a soft bright rim on the sun side, soft window highlights, a rounded foot that wraps the blade bend (v3: no ellipses under it; v4: no flat foot).
 */
export const paintDrop = (p: Painter, g: Pt, u: number, o: {sunSide?: -1 | 1; t?: number; sky?: string; green?: string} = {}) => {
  const s = o.sunSide ?? -1, S = ([x, y]: Pt): Pt => [g[0] + x * u, g[1] - y * u];
  const D = dropShape(), C = DROP_C, R = DROP_R;
  const clipD = (pts: Pt[]) => pts.map((q) => inDrop(q));
  void R;
  // LF03 v3: no caustic, contact shade or meniscus ellipses under the foot (they read as a puddle rim); the flat foot on the slim blade
  // tip is the contact (LF03 v4: the rounded foot wraps the blade bend instead)
  // body: transparent water, a pale cool tint over the blade behind
  washAt(p, 8504, '#e4f2ea', 85, D.map(S), 0.04, 0.05);
  // LF03 v5: a soft water veil over the low-left belly where the blade's upturned tip shows through (v4: a pale J, the brightest drawn
  // shape in the belly), in the water body's own green so the glow above it stays the light, so the tip reads as a faint refraction, not an outline
  washAt(p, 8515, '#bfd68e', 130, clipD(circ(-0.03, 0.1, 0.22, 0.13)).map(S), 0.35, 0.05);
  // the inverted scene: the dark ground and blades as a crescent along the top contour (thick at the top, thin down the sides)
  const top = D.filter(([, y]) => y > C - 0.1);
  const inner = top.map(([x, y]): Pt => { const dx = x, dy = y - C, n = Math.hypot(dx, dy) || 1, th = 0.24 * Math.max(0, dy / n) + 0.05; return [dx * (1 - th / n), C - 0.06 + dy * (1 - th / n)]; }).reverse();
  washAt(p, 8506, o.green ?? '#557f34', 150, [...top, ...inner].map(S), 0.18, 0.08);
  // the inverted bright sky low in the body: a soft warm glow, no edge
  washAt(p, 8505, o.sky ?? '#fff3cf', 170, clipD(circ(0, C - 0.12, 0.34, 0.24)).map(S), 0.2, 0.05);
  washAt(p, 8507, '#fffbe6', 150, clipD(circ(-s * 0.06, C - 0.2, 0.2, 0.12)).map(S), 0.2, 0.05);
  // the inverted low sun: a bright spot low on the side away from the sun
  washAt(p, 8508, '#ffffff', 220, ell(g[0] - s * 0.16 * u, g[1] - 0.18 * u, 0.08 * u, 0.05 * u, 12), 0.1, 0.03);
  // thin cool refraction edge along the shadow side, a soft bright rim along the sun side
  const ring = (k: number, keep: (x: number, y: number) => boolean) => {
    const outer = D.filter(([x, y]) => keep(x, y)), inner2 = outer.map(([x, y]): Pt => [x * k, C + (y - C) * k]).reverse();
    return [...outer, ...inner2].map(S);
  };
  washAt(p, 8509, '#3f6450', 120, ring(0.9, (x, y) => x * s < 0.05 && y > 0.05), 0.12, 0.05);
  washAt(p, 8510, '#fffbe8', 190, ring(0.93, (x, y) => x * s > -0.15 && y > 0.08), 0.12, 0.05);
  // soft window highlights up on the sun side
  washAt(p, 8511, '#ffffff', 225, ell(g[0] + s * 0.2 * u, g[1] - (C + 0.32) * u, 0.1 * u, 0.06 * u, 14, s * 0.5), 0.12, 0);
  washAt(p, 8512, '#ffffff', 200, ell(g[0] + s * 0.04 * u, g[1] - (C + 0.44) * u, 0.035 * u, 0.028 * u, 8), 0.1, 0);
  // thin, light ink line (hero object): water edge, not a glass rim
  // LF03 v4: open where the water wraps the blade bend (the contact), so the foot reads as water on the blade, not a rim
  inkLine(p, 8513, D.filter(([x, y]) => !(y < 0.14 && x > -0.24 && x < 0.16)).map(S), {weight: Math.max(0.5, u / 560), color: '#7d9c8a', closed: false});
  const sh = 0.6 + 0.4 * Math.sin((o.t ?? 0) * 3.1);
  washAt(p, 8514, '#ffffff', 190 * sh, ell(g[0] + s * 0.42 * u, g[1] - C * u, 0.025 * u, 0.025 * u, 8), 0.05, 0);
};

/**
 * Out-of-focus near grass tips rising from the bottom of the frame (painted depth of field): world-space short blades on a band
 * 0.45-1.2 units in front of the camera, so they slide with the move. Soft washes, no line.
 */
export const nearTips = (c: YCam, o: {n: number; h: [number, number]; seed: number; color: string; spread?: number}): Blade[] => {
  const fx = Math.sin(c.yaw), fz = -Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = Math.sin(c.yaw);
  return Array.from({length: o.n}, (_, i) => {
    const r = (k: number) => hash(o.seed * 41 + i * 9 + k);
    const d = 0.5 + r(1) * 0.7, s = ((i + r(2) * 0.8) / o.n - 0.5) * (o.spread ?? 1.6) * d;
    const root: V3 = [c.x + fx * d + rx * s, 0, c.z + fz * d + rz * s];
    return {root, h: o.h[0] + r(3) * (o.h[1] - o.h[0]), w: 0.05 + r(4) * 0.05, dir: [rx * (r(5) - 0.5) + fx * 0.3, rz * (r(5) - 0.5) + fz * 0.3], lean: 4 + r(6) * 14, curl: 8 + r(7) * 30,
      pal: {base: o.color, body: o.color, edge: o.color, vein: o.color}, seed: o.seed * 100 + i * 7, near: true, sway: 1.5};
  });
};

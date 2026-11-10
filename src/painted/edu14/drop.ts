import {ell, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// `new: drop` (N2, VD04, EDU-EP14-BRIEF-R1): the raindrop "character" of EDU-EP14-SHORT, written by Film at W3 (SP1) on the EP05
// `edu05/drop.ts` + `macro.ts` water method (translucent body over the scene, inverted scene inside, rim, highlights, thin edge line).
// A pure function of its state: no clock, no Math.random. Units are millimetres in the drop frame `M` (x right, y up); `g` is the
// anchor in picture px and `u` px per mm (`scale`: m-scale shots pass u = px/m / 1000).
// Anchors: `pendant` hangs from its attachment point on the lip underside (y 0, the body below); every other state is centred on
// its bounding box; `burst` fragments fly from the bag's centre (the burst origin).
// Shape truth (fact-check F20-F23, CL08-CL11): only `pendant` is a teardrop (a drop clinging to a surface); a falling drop is a
// round ball (small), a bun (round top, flat bottom), then an upside-down bag (hollow underside, thick rim) that bursts into round drops.

export type DropKind = 'pendant' | 'sphere' | 'bun' | 'bag' | 'burst';
export type DropState = {
  kind: DropKind;
  /** mm. pendant: length (6.0); sphere: diameter (2.0 small, 5.0 hero); bun: width (4.0); bag/burst: the equivalent drop (5.0). */
  size: number;
  /** pendant: 0..1 swell (0.55x -> 1x of its size). */
  swell?: number;
  /** pendant: 0..1 let go: the neck pinches and the body rounds into a ball (falling is the scene's move). */
  release?: number;
  /** bun: 0..1 flatness of the bottom (0.35 = the B03-SH03 "ก้นแบน" key). */
  flat?: number;
  /** bag: 0..0.6 hollow depth as a fraction of its height. */
  hollow?: number;
  /** bag: 0..1 balloon before the burst (width up to 1.6x the drop, the film at the dome thinning to 0.1 mm). */
  inflate?: number;
  /** burst: frames since the burst (0 = the burst frame). */
  burstF?: number;
};

export const PAL = {
  body: '#a9cfe0', // 35 % over the scene
  rim: '#ffffff',
  cyan: '#bfe6f2',
  edge: '#4f8fa6', // the thin edge line: a deeper cyan so the edge survives the no-air grade and light backgrounds
  deep: '#5d8796', // darker bottom band
} as const;
/** The scene the drop refracts (inverted top-to-bottom): `sky` shows low in the body, `ground` along the top. */
export type Refract = {sky: string; ground: string};
export const REFRACT_REAL: Refract = {sky: '#dfe8ea', ground: '#4a4f52'};
export const REFRACT_NOAIR: Refract = {sky: '#c9d0d2', ground: '#4b5254'};

const smooth = (a: number, b: number, v: number) => { const k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
const N = 72;

/** Circle of diameter d about (cx, cy), N points counter-clockwise from the right (y up). */
const circle = (d: number, cx = 0, cy = 0, n = N): Pt[] => Array.from({length: n}, (_, i) => { const t = (i / n) * 2 * Math.PI; return [cx + (d / 2) * Math.cos(t), cy + (d / 2) * Math.sin(t)]; });

/**
 * Pendant teardrop hanging from (0, 0) (pass 3): the classic teardrop x = A sin(th) sin(th/2), pointed top on the lip, round bulb
 * (width `wid`) at the bottom, plus a small meniscus foot where it clings to the lip. The only teardrop of the episode (CL08).
 */
const pendantShape = (len: number, wid: number): Pt[] => {
  const A = wid / 2 / 0.7698, foot = 0.09 * wid; // max of sin(th) sin(th/2) is 0.7698 at th = 2.19
  const right = Array.from({length: N / 2 + 1}, (_, i): Pt => {
    const th = Math.PI * (1 - i / (N / 2)); // bottom (pi) -> top (0)
    const y = -len * (1 - Math.cos(th)) / 2, t = 1 + y / len; // t 0 bottom .. 1 top
    return [A * Math.sin(th) * Math.sin(th / 2) + foot * smooth(0.86, 1, t) ** 2, y];
  });
  return [...right, ...right.slice(1, -1).reverse().map(([x, y]): Pt => [-x, y])];
};

/** Bun: width w, round top, bottom flattened by `f` (superellipse exponent 2 -> 6, height 1 -> 0.6). Bounding box centred on 0. */
const bunShape = (w: number, f: number): Pt[] => {
  const a = w / 2, bt = a * (1 - 0.12 * f), bb = a * (1 - 1.15 * f), n = 2 + 11 * f;
  const pts = Array.from({length: N}, (_, i): Pt => {
    const t = (i / N) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
    return s >= 0 ? [a * c, bt * s] : [a * Math.sign(c) * Math.abs(c) ** (2 / n), -bb * Math.abs(s) ** (2 / n)];
  });
  const dy = (bt - bb) / 2;
  return pts.map(([x, y]): Pt => [x, y - dy]);
};

/**
 * Bag geometry (mm, y 0 = the mouth plane): outer half-width a, dome height ht, rim tube radius rt, the mouth ellipse (rx, ry; the
 * camera ~13 deg below the mouth plane), the hollow's half-width ai and apex height, base depth b. Width = the drop up to hollow 0.15
 * (the ruler match), 1.25x at 0.6, 1.6x fully inflated.
 */
export const bagDims = (size: number, hollow: number, inflate: number) => {
  const R = size / 2, h = Math.min(0.6, Math.max(0, hollow)), i = Math.min(1, Math.max(0, inflate)), rimK = smooth(0.05, 0.4, h);
  const a = R * (1 + 0.25 * smooth(0.15, 0.6, h)) * (1 + 0.28 * i);
  const rt = a * (0.08 + 0.08 * rimK) * (1 - 0.4 * i), rx = a - rt, ry = rx * 0.22, b = ry + rt;
  const ht = R * (1.05 - 0.15 * h) * (1 + 0.55 * i), H = ht + b;
  const ai = (a - 2 * rt) * (0.35 + 0.65 * rimK);
  // hollow apex above the mouth plane: 0.75 of the dome at hollow 0.6 (film ~0.6 mm), up to 0.1 mm under the top when inflated
  const apex = Math.min(ht - 0.1, (h / 0.6) * 0.75 * ht + i * ht);
  return {a, ht, b, H, rt, rx, ry, ai, apex, film: ht - apex};
};
const half = (n: number, f: (t: number) => Pt) => Array.from({length: n + 1}, (_, i) => f((i / n) * Math.PI));
/** Upside-down bag silhouette: dome over the rim torus (the hollow shows inside, painted by `paintBag`). Box centred on 0. */
const bagShape = (size: number, hollow: number, inflate: number): Pt[] => {
  const {a, ht, b} = bagDims(size, hollow, inflate), dy = (ht - b) / 2;
  const top = half(N / 2, (t) => [a * Math.cos(t), ht * Math.sin(t)]);
  const bottom = half(N / 2, (t) => [-a * Math.cos(t), -b * Math.sin(t)]).slice(1, -1);
  return [...top, ...bottom].map(([x, y]): Pt => [x, y - dy]);
};

/** The outline of a state, mm about its anchor, closed implicitly (first != last), counter-clockwise from the right (y up). */
export const dropOutline = (st: DropState): Pt[] => {
  if (st.kind === 'pendant') {
    const k = 0.55 + 0.45 * (st.swell ?? 1), len = st.size * k, wid = (st.size * 0.7) * k, rel = smooth(0, 1, st.release ?? 0);
    const P = pendantShape(len, wid);
    if (rel <= 0) return P;
    // let go: blend point-for-point into the ball of the same width, centred where the bulb was, then drop clear of the lip
    const yc = -(len - wid / 2), d = wid * 1.08;
    const C = P.map((_, i) => { const t = -Math.PI / 2 + (i / P.length) * 2 * Math.PI; return [(d / 2) * Math.cos(t), yc + (d / 2) * Math.sin(t)] as Pt; });
    return P.map(([x, y], i): Pt => [x + (C[i][0] - x) * rel, y + (C[i][1] - y) * rel]);
  }
  if (st.kind === 'sphere') return circle(st.size);
  if (st.kind === 'bun') return bunShape(st.size, st.flat ?? 0.35);
  return bagShape(st.size, st.hollow ?? 0.6, st.inflate ?? 0);
};

export const bounds = (pts: Pt[]) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  return {x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys)};
};

/**
 * Burst fragment sizes for a 5 mm drop (mm; scaled with `size`), Boat PC-1 (fact-check W3 picture check, 2026-11-09): bag
 * break-up gives a broad spread whose volumes add up to no more than the parent drop. 16 pieces, 0.3-3.5 mm, three groups:
 * 2 large node/rim pieces, 5 middle rim-ring drops (the thick rim breaks into fewer, larger drops), 9 small thin-film droplets.
 * Volume sum 59.4 mm^3 of the parent's 65.4 mm^3 (0.91).
 */
export const BURST_SIZES = {large: [3.4, 3.1], rim: [2.3, 2.1, 2.0, 1.9, 1.7], film: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.35, 0.3]} as const;
export type BurstDrop = {x: number; y: number; d: number; front: boolean; group: 'large' | 'rim' | 'film'};

/** Burst fragments (mm about the burst origin; `f` frames since the burst): a pure function of (size, f), fixed jitter, no random. */
export const burstFragments = (size: number, f: number) => {
  const {a, rx, ry, ht, b} = bagDims(size, 0.6, 1), R = size / 2, k = size / 5, g = 0.012, dy = (ht - b) / 2; // g mm per frame^2 (picture gravity, est)
  const rimY = -dy, jit = (i: number) => Math.sin(i * 12.9898 + 4.1) * 0.5 + 0.5;
  // rim ring: 7 beads round the rim; the 2 large node pieces at the left and right ends, 3 rim drops across the front, 2 behind.
  // At the burst frame the ring has already necked into beads and opened to 1.7x the rim, tilted (0.3) so it reads as a ring.
  const slots = [Math.PI * 1.0, Math.PI * 1.97, Math.PI * 1.3, Math.PI * 1.5, Math.PI * 1.7, Math.PI * 0.35, Math.PI * 0.65]; // large x2, rim x5
  const ring = [...BURST_SIZES.large, ...BURST_SIZES.rim].map((d5, i): BurstDrop => {
    const ph = slots[i], j = jit(i), large = i < 2, r0 = 1.7 * rx, q0 = Math.max(ry, 0.3 * r0);
    const x0 = r0 * Math.cos(ph), y0 = rimY + q0 * Math.sin(ph);
    const sp = large ? 0.05 + 0.02 * j : 0.07 + 0.04 * j; // the heavy node pieces move slower
    const vx = Math.cos(ph) * sp, vy = 0.01 + 0.02 * j - (large ? 0.01 : 0);
    return {x: x0 + vx * f, y: y0 + vy * f - g * f * f, d: d5 * k, front: Math.sin(ph) < 0, group: large ? 'large' : 'rim'};
  });
  // thin film: 9 fine droplets from the torn dome, thrown up and out fastest, spread across the dome
  const film = BURST_SIZES.film.map((d5, i): BurstDrop => {
    const j = jit(i + 20), t = (0.15 + 0.7 * (((i * 4) % 9) / 8)) * Math.PI, rr = 1.35 + 0.25 * j; // an arc above the ring where the dome was
    const x0 = a * rr * Math.cos(t), y0 = ht * rr * Math.sin(t) - dy, sp = 0.1 + 0.08 * j;
    return {x: x0 + Math.cos(t) * sp * f, y: y0 + Math.sin(t) * sp * 0.6 * f - g * f * f, d: d5 * k, front: i % 2 === 0, group: 'film'};
  });
  // the torn dome: arcs of the old film thrown up and out, gone by f 6
  const shards = Array.from({length: 6}, (_, i) => {
    const t0 = (0.08 + i * 0.15) * Math.PI, t1 = t0 + 0.1 * Math.PI, s = 1 + 0.09 * f;
    return Array.from({length: 5}, (_, q): Pt => { const t = t0 + ((t1 - t0) * q) / 4; return [a * s * Math.cos(t), R * 1.4 * s * Math.sin(t) + 0.05 * f]; });
  });
  return {drops: [...ring, ...film], shards, shardAlpha: Math.max(0, 1 - f / 6)};
};

// ---- painting --------------------------------------------------------------------------------------------------------------

const signedArea = (pts: Pt[]) => pts.reduce((s, q, i) => { const n = pts[(i + 1) % pts.length]; return s + (q[0] * n[1] - n[0] * q[1]); }, 0) / 2;
/** Picture-px polygon offset inward by d px along the vertex normals (works for the gentle concavities of the bag). */
const inset = (P: Pt[], d: number): Pt[] => {
  const sg = signedArea(P) > 0 ? 1 : -1; // picture y is down: a CCW-in-y-up outline is CW here
  return P.map((q, i) => {
    const a = P[(i - 1 + P.length) % P.length], b = P[(i + 1) % P.length], tx = b[0] - a[0], ty = b[1] - a[1], n = Math.hypot(tx, ty) || 1;
    return [q[0] - (sg * ty / n) * d, q[1] + (sg * tx / n) * d] as Pt;
  });
};
/** A band between the outline and its inset, over the vertices that `keep` (one contiguous run, or the whole ring). */
const band = (P: Pt[], d: number, keep: (q: Pt, i: number) => boolean): Pt[] => {
  const I = inset(P, d), idx = P.map((q, i) => (keep(q, i) ? i : -1)).filter((i) => i >= 0);
  if (idx.length < 3) return [];
  if (idx.length === P.length) return [...P, P[0], I[0], ...I.slice().reverse()];
  // rotate so a wrap-around run (end of the list into its start) stays contiguous
  const gap = idx.findIndex((v, k) => k > 0 && v !== idx[k - 1] + 1), run = gap > 0 ? [...idx.slice(gap), ...idx.slice(0, gap)] : idx;
  return [...run.map((i) => P[i]), ...run.slice().reverse().map((i) => I[i])];
};

export type PaintOpts = {refract?: Refract; seed?: number; light?: -1 | 1};
/** One water body: outline `P` in picture px, `L` its size in px (the larger box side). */
const paintWater = (p: Painter, P: Pt[], L: number, o: PaintOpts & {noGlow?: boolean; noInk?: boolean; bulb?: {c: Pt; r: number}; outer?: number}) => {
  const s = o.seed ?? 14000, R = o.refract ?? REFRACT_REAL, side = o.light ?? -1;
  const bb = bounds(P), b = o.bulb ? {x0: o.bulb.c[0] - o.bulb.r, x1: o.bulb.c[0] + o.bulb.r, y0: o.bulb.c[1] - o.bulb.r, y1: bb.y1, w: 2 * o.bulb.r, h: bb.y1 - o.bulb.c[1] + o.bulb.r} : bb;
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  const yN = (q: Pt) => (q[1] - b.y0) / Math.max(1, b.h); // 0 top .. 1 bottom
  const out = (i: number) => i < (o.outer ?? P.length); // the bag's top bands stay on the dome (pass 3.1: they crossed the hollow)
  // body: clear water tinted over the scene
  washAt(p, s, PAL.body, 0.35 * 255, P, 0, 0);
  if (L < 18) {
    // a fragment: body, edge and one highlight
    washAt(p, s + 1, PAL.cyan, 200, band(P, Math.max(1, L * 0.14), () => true), 0, 0);
    washAt(p, s + 2, PAL.rim, 230, ell(cx + side * L * 0.15, cy - L * 0.2, L * 0.16, L * 0.12, 8), 0, 0);
    inkLine(p, s + 3, P, {weight: 0.5, color: PAL.edge, curve: 0.3});
    return;
  }
  // the inverted scene: the dark ground as a crescent along the top inside, the bright sky low in the body
  if (o.bulb) {
    // pendant: the crescent is a lens in the bulb's upper half (an inset band would cross itself at the pointed top)
    const {c, r} = o.bulb, arc = (k: number, dy: number, rev = false) => { const q = Array.from({length: 17}, (_, i) => { const t = Math.PI * (0.12 + 0.76 * i / 16); return [c[0] + r * k * Math.cos(t), c[1] + dy - r * k * Math.sin(t)] as Pt; }); return rev ? q.reverse() : q; };
    washAt(p, s + 4, R.ground, 120, [...arc(0.86, 0), ...arc(0.8, r * 0.3, true)], 0, 0);
  } else washAt(p, s + 4, R.ground, 120, band(P, L * 0.17, (q, i) => out(i) && yN(q) < 0.42), 0, 0);
  if (!o.noGlow) washAt(p, s + 5, R.sky, 95, ell(cx, cy + b.h * 0.2, b.w * 0.26, b.h * 0.16, 20), 0, 0);
  // darker bottom: the shade-side refraction edge along the base
  washAt(p, s + 6, PAL.deep, 110, band(P, L * 0.07, (q) => yN(q) > 0.62), 0, 0);
  // cyan edge all round, white rim along the top
  washAt(p, s + 7, PAL.cyan, 235, band(P, Math.max(2, L * 0.045), () => true), 0, 0);
  washAt(p, s + 8, PAL.rim, 215, band(P, Math.max(1.5, L * 0.035), (q, i) => out(i) && yN(q) < 0.3), 0, 0);
  // window highlight up on the light side and a small specular dot
  washAt(p, s + 9, PAL.rim, 230, ell(cx + side * b.w * 0.2, b.y0 + b.h * 0.24, b.w * 0.11, b.h * 0.07, 14, side * 0.5), 0, 0);
  washAt(p, s + 10, PAL.rim, 210, ell(cx + side * b.w * 0.05, b.y0 + b.h * 0.12, L * 0.025, L * 0.022, 8), 0, 0);
  washAt(p, s + 11, PAL.rim, 170, ell(cx - side * b.w * 0.36, cy + b.h * 0.08, L * 0.02, L * 0.02, 8), 0, 0);
  if (!o.noInk) inkLine(p, s + 12, P, {weight: Math.max(0.6, L / 260), color: PAL.edge, curve: 0.1});
};

/** Paints the drop in a state at anchor `g` (px), `u` px per mm. */
export const paintDrop14 = (p: Painter, g: Pt, u: number, st: DropState, o: PaintOpts = {}) => {
  const S = ([x, y]: Pt): Pt => [g[0] + x * u, g[1] - y * u], seed = o.seed ?? 14000;
  if (st.kind === 'burst') {
    const F = burstFragments(st.size, st.burstF ?? 0);
    if (F.shardAlpha > 0) F.shards.forEach((sh, i) => inkLine(p, seed + 60 + i, sh.map(S), {weight: Math.max(0.8, u / 40), color: mixColor(PAL.cyan, '#ffffff', 0.3), closed: false}));
    // back fragments first, then the front of the ring
    [...F.drops.filter((d) => !d.front), ...F.drops.filter((d) => d.front)].forEach((d, i) =>
      paintWater(p, circle(d.d, d.x, d.y, 28).map(S), d.d * u, {...o, seed: seed + 100 + i * 20}));
    return;
  }
  const P = dropOutline(st).map(S), b = bounds(P);
  if (st.kind === 'pendant') {
    // the bulb is the body: highlights and the inverted scene sit on it, not on the pointed top
    const k = 0.55 + 0.45 * (st.swell ?? 1), wid = st.size * 0.7 * k, len = st.size * k, rel = st.release ?? 0;
    const bc = S([0, -len + wid / 2 + 0.1 * wid * (1 - rel)]);
    paintWater(p, P, wid * u, {...o, bulb: {c: bc, r: (wid / 2) * u}});
    return;
  }
  if (st.kind !== 'bag' || bagDims(st.size, st.hollow ?? 0.6, st.inflate ?? 0).ai < 0.15) { paintWater(p, P, Math.max(b.w, b.h), o); return; }
  // bag (pass 3): the water is the arch over the hollow (dome + rims), the front rim torus crosses the mouth below it
  const {a, ht, b: bb, ai, apex} = bagDims(st.size, st.hollow ?? 0.6, st.inflate ?? 0), dy = (ht - bb) / 2;
  const arch = [...half(N / 2, (t) => [a * Math.cos(t), ht * Math.sin(t)]), ...half(N / 2, (t) => [-ai * Math.cos(t), apex * Math.sin(t) ** 0.6])].map(([x, y]) => S([x, y - dy]));
  paintWater(p, arch, Math.max(b.w, b.h), {...o, noGlow: true, noInk: true, outer: N / 2 + 1});
  paintBag(p, S, u, st, seed);
  inkLine(p, seed + 12, P, {weight: Math.max(0.6, Math.max(b.w, b.h) / 260), color: PAL.edge, curve: 0.1});
};

/** The inside of the bag: the hollow (lighter: two thin films), its inner edge, the back rim seen through it, the front rim torus. */
const paintBag = (p: Painter, S: (q: Pt) => Pt, u: number, st: DropState, seed: number) => {
  const {ht, b, rt, rx, ry, ai, apex} = bagDims(st.size, st.hollow ?? 0.6, st.inflate ?? 0), dy = (ht - b) / 2;
  if (ai < 0.15 || apex < -b + 0.15) return;
  const D = ([x, y]: Pt): Pt => S([x, y - dy]);
  const inner = half(N / 2, (t) => [ai * Math.cos(t), apex * Math.sin(t) ** 0.6]);
  // hollow: no water in it, only the thin back film: a faint cool veil and a bright inner edge
  washAt(p, seed + 30, mixColor(PAL.cyan, '#ffffff', 0.5), 40 + 70 * (st.inflate ?? 0), [...inner.map(D), ...half(20, (t) => [ai * Math.cos(t), -Math.max(0.02, ry - rt) * Math.sin(t)]).slice(1, -1).map(D)], 0, 0);
  inkLine(p, seed + 32, inner.map(D), {weight: Math.max(0.6, u / 110), color: PAL.edge, closed: false, curve: 0.1});
  // the back of the rim through the hollow: a faint arc
  inkLine(p, seed + 33, half(24, (t) => [rx * Math.cos(t) * 0.98, ry * Math.sin(t)]).filter(([x]) => Math.abs(x) < ai).map(D), {weight: Math.max(0.5, u / 140), color: mixColor(PAL.cyan, '#ffffff', 0.3), closed: false});
  // front rim: a thick glossy torus band across the mouth, a white streak along it
  const outer = half(N / 2, (t) => [-(rx + rt) * Math.cos(t), -(ry + rt) * Math.sin(t)]), inn = half(N / 2, (t) => [-(rx - rt) * Math.cos(t), -Math.max(0.02, ry - rt) * Math.sin(t)]);
  const ringB = [...outer.map(D), ...inn.slice().reverse().map(D)];
  washAt(p, seed + 34, PAL.body, 110, ringB, 0, 0);
  washAt(p, seed + 35, PAL.cyan, 150, ringB, 0, 0);
  washAt(p, seed + 36, '#ffffff', 200, [...half(20, (t) => [-(rx - rt * 0.1) * 0.8 * Math.cos(t), -(ry - rt * 0.15) * Math.sin(t)]).map(D), ...half(20, (t) => [-(rx - rt * 0.45) * 0.8 * Math.cos(t), -Math.max(0.02, ry - rt * 0.45) * Math.sin(t)]).reverse().map(D)], 0, 0);
  inkLine(p, seed + 37, inn.map(D), {weight: Math.max(0.5, u / 140), color: PAL.edge, closed: false});
};

/** Size of a state's outline in mm (for tests and the ruler check). */
export const dropSize = (st: DropState) => (st.kind === 'burst' ? null : bounds(dropOutline(st)));

/**
 * The drop's state for a storyboard shot and shot-local frame (re-keyed to ROWS-R4.1):
 * B01-SH01 the K01 pendant, B01-SH06 the no-air hero sphere, B03-SH01 the small round drop, B03-SH03 the bun (flat 0 -> 0.35 +10..+41),
 * B04-SH02 the bag (hollow 0 -> 0.6 +20..+76, 0.35 at +52), B04-SH03 the 5 mm drop on the ruler (hollow 0.12, width = 5.0 mm),
 * inflating +46..+52 and bursting at +52. Undefined for shots without the drop.
 */
export const dropStateFor = (shot: string, L: number): DropState | undefined => {
  switch (shot) {
    case 'S01-B01-SH01': return {kind: 'pendant', size: 6, swell: 1};
    case 'S01-B01-SH06': return {kind: 'sphere', size: 5};
    case 'S01-B03-SH01': return {kind: 'sphere', size: 2};
    case 'S01-B03-SH03': return {kind: 'bun', size: 4, flat: 0.35 * smooth(10, 41, L)};
    case 'S01-B04-SH02': return {kind: 'bag', size: 5, hollow: 0.6 * smooth(20, 76, L)};
    case 'S01-B04-SH03': return L < 52 ? {kind: 'bag', size: 5, hollow: 0.12, inflate: smooth(46, 52, L)} : {kind: 'burst', size: 5, burstF: L - 52};
    default: return undefined;
  }
};

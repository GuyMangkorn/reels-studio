import {hash} from '../kit/hash';
import {mixColor, range, ring, type Painter, type Pt} from '../kit/painter';
import {bands, span} from '../sea';
import {H, hydParts, SECTION, W} from './geometry';

// BLOOP painted sets and props (DEP02): SET-DEEP (L-A1), SET-COLD (M04), SET-DREAM, the map ocean wash, the section
// wash, PROP-HYD (one outline source, `hydParts`; a dark variant for the rush, FR10), and the ICE keel (FR04). Ported
// from the look spike (src/painted/spike/BloopLook.tsx); the spike is not imported. Every mark is a pure function of the
// plate's own frame (washes hold still; ink boils only where stated).

export const DEEP = ['#1d3550', '#193049', '#152a40', '#132538', '#0f1e2e', '#0b1622', '#0a131d'];
export const COLD = ['#1b3d49', '#183845', '#15333f', '#132d38', '#10262f', '#0c1d25', '#0a171d'];
export const AMBER = '#f2b25c';
export const ICE = '#cfe9f2';
export const INK_D = '#4a4562';
export const DREAM_INK = '#6f6a86';
export const DREAM_PAPER = '#e7e2d6';

/** SET-DEEP (VD03): vertical indigo bands on a flat underlayer, faint far haze. `wide` covers the map's plate world. */
export const paintDeep = (p: Painter, o: {haze?: number; cold?: boolean; wide?: boolean} = {}) => {
  const palette = o.cold ? COLD : DEEP;
  const under = o.cold ? '#122d37' : '#132538';
  if (o.wide) bands(p, 2140, under, palette, -300, 2600, {opacity: 200, bleed: 0.04, texture: 0.35});
  else bands(p, W, under, palette, -260, H + 260, {opacity: 200, bleed: 0.04, texture: 0.35});
  const haze = o.haze ?? 1;
  const tint = o.cold ? '#2a4d58' : '#24405c';
  [[380, 560], [600, 760]].forEach(([y0, y1], i) => p.wash(i ? mixColor(tint, '#1f3956', 0.5) : tint, 70 * haze, span(W, y0 + 20 * Math.sin(i), y1), 0.08, 0.3));
};

/** Screen-space marine snow: sparse specks on hash lanes (no boil), dimmed through the caption zone. */
export const paintSnow = (p: Painter, t: number, count = 70, color = '#8fa7b8') => {
  p.inkStill(70, 'pen', color, 0.9);
  for (let i = 0; i < count; i++) {
    const x = (hash(i + 900) * W + t * (3 + hash(i + 901) * 6)) % W;
    const y = (hash(i + 902) * H + t * (5 + hash(i + 903) * 8)) % H;
    if (y > 840 && y < 1260 && i % 3) continue;
    const l = 2 + hash(i + 904) * 3;
    p.brush.line(x, y, x + l * 0.6, y + l);
  }
};

/**
 * SET-DREAM (VD08): the deep blue loosens into a pale, paper-showing halo around the creature centre (cx, cy); the frame
 * edges and everything below y 860 stay mid-dark so CAP-ZONE holds value <= 45 % (Film's look check). FR03 centres the
 * halo on the head and body (about (480, 560)) rather than on the frame.
 */
export const paintDreamWater = (p: Painter, cy = 480, cx = 540) => {
  const steps = 30, y0 = -100, y1 = 900;
  for (let i = 0; i < steps; i++) {
    const u = (i + 1) / steps;
    p.flat(mixColor('#8197a8', '#34465a', u), span(W, y0 + (i * (y1 - y0)) / steps - (i ? 0 : 300), y0 + ((i + 1) * (y1 - y0)) / steps + 2));
  }
  p.flat('#34465a', span(W, y1, H + 300));
  ['#3e5165', '#3a4c60', '#36485b', '#334457', '#304054'].forEach((c, i) => p.wash(c, 90, span(W, 820 + i * 220, 1100 + i * 220), 0.1, 0.55));
  ([[680, 330, '#7f93a3', 120], [620, 300, '#9aaebb', 140], [560, 270, '#b7c7cf', 150], [490, 235, '#cbd7dc', 165], [410, 195, '#e1e6e2', 170]] as [number, number, string, number][])
    .forEach(([rx, ry, c, o], i) => p.wash(c, o, ring(cx + i * 6, cy - i * 14, rx, ry, 48), 0.24, 0.65));
};

/**
 * Map ocean wash (SET-DEEP bands over the whole plate world, M01): the map's painted water under the SVG land. The opaque
 * underlayer comes first; `between` paints under the translucent bands (SH07: the ghost under the map wash).
 */
export const paintMapOcean = (p: Painter, o: {opacity?: number; pale?: number; between?: (q: Painter) => void} = {}) => {
  const colours = o.pale ? DEEP.map((c) => mixColor(c, '#e7e2d6', o.pale as number)) : DEEP;
  const y0 = -300, y1 = 2600, step = (y1 - y0) / colours.length;
  p.flat('#132538', span(2140, y0, y1));
  o.between?.(p);
  colours.forEach((c, i) => p.wash(c, o.opacity ?? 200, span(2140, y0 + i * step - step * 0.3, y0 + (i + 1) * step + step * 0.3), 0.04, 0.35));
};

/** Section wash (VD09): a painted vertical wash, lighter near the surface and darker below the channel band. */
export const paintSection = (p: Painter) => {
  bands(p, W, '#17303f', ['#24465d', '#1f3e53', '#1a3449', '#152b3e', '#112234', '#0d1b29', '#0a1521'], SECTION.surfaceY, SECTION.seafloorY, {opacity: 200, bleed: 0.04, texture: 0.3});
  p.flat('#08131c', span(W, SECTION.seafloorY, H + 300));
};

/**
 * PROP-HYD painted (VD04; FR10 pass 3: the L-A1 prop values, one value for the whole shot): mid-value body `#4d6379`, cel
 * shade `#2a394b` on the left, cool rim `#86aac2` on the right, cap `#566d82`, one thin ink line that boils. An opaque
 * flat underlayer under the body and cap, so nothing behind (the mouth) shows through it.
 */
export const paintHydrophone = (p: Painter, cx: number, cy: number, k = 1, o: {cableAlpha?: number} = {}) => {
  const {brush} = p;
  const hp = hydParts(cx, cy, k);
  // the cable (BLOOP-BRIEF-R7 H10): it fades to the water colour over the frames after the lip line passes (cableAlpha 1 -> 0)
  const cableA = o.cableAlpha ?? 1;
  if (cableA > 0) {
    const cp = cableA < 1 ? p.layer(cableA, 9300) : p;
    cp.inkStill(60, '2B', '#050a10', 2.2);
    cp.brush.spline(range(6, (u) => [hp.top[0] + 18 * Math.sin(u * 2.2), hp.top[1] - u * (hp.top[1] + 260)] as Pt), 0.6);
  }
  p.flat('#4d6379', hp.body);
  p.flat('#566d82', hp.cap);
  p.wash('#4d6379', 245, hp.body, 0.04, 0.2);
  p.wash('#2a394b', 230, hp.body.filter(([x]) => x <= cx - 6).concat([[cx - 6, cy + hp.h], [cx - 6, cy - hp.h]]), 0.04, 0.2);
  p.wash('#86aac2', 170, [[cx + hp.w - 16 * k, cy - hp.h + 30 * k], [cx + hp.w - 4 * k, cy - hp.h + 30 * k], [cx + hp.w - 4 * k, cy + hp.h - 30 * k], [cx + hp.w - 16 * k, cy + hp.h - 30 * k]], 0.03, 0.2);
  p.wash('#566d82', 240, hp.cap, 0.03, 0.2);
  [-0.45, 0.5].forEach((f) => p.wash('#1c2734', 220, [[cx - hp.w, cy + f * hp.h - 7 * k], [cx + hp.w, cy + f * hp.h - 7 * k], [cx + hp.w, cy + f * hp.h + 7 * k], [cx - hp.w, cy + f * hp.h + 7 * k]] as Pt[], 0.02, 0.1));
  p.ink(61, 'pen', '#03060a', 1.6);
  brush.spline([...hp.body, hp.body[0]], 0.2);
  brush.polygon(hp.cap);
  p.ink(62, 'HB', '#b5d0e0', 1.6);
  brush.spline(range(8, (u) => [cx + hp.w - 4, cy - hp.h + 30 + u * (2 * hp.h - 60)] as Pt), 0.2);
  p.ink(63, 'pen', '#7e95a8', 1.2);
  hp.bars.forEach(([a, b]) => brush.line(a[0], a[1], b[0], b[1]));
  hp.hoops.forEach((y) => brush.spline(range(10, (u) => [cx - hp.cageW + u * 2 * hp.cageW, y + 7 * k * Math.sin(u * Math.PI)] as Pt), 0.5));
};

/**
 * ICE keel silhouette (FR04 R4, ported from Film's reference `keelOutline` in src/painted/spike/BloopLook.tsx; not imported).
 * The union of seven ellipses in units of the bounding width `w` and depth `D = w / 1.6` (y down from the waterline row,
 * x from the keel centre `cx`): a top shelf, a body, a main off-centre keel bulge (the deepest point), a secondary bulge,
 * two shoulder knobs and a small low knob. Rays are cast from (0.02 w, 0.33 D), the radius on each ray is the farthest point
 * inside the union, 120 radii are low-passed (circular moving average, width 7) into soft waists, and the top is clamped to
 * a gently domed waterline. `mirror` (+1 or -1) flips the berg about its centre so SH11 and SH12 differ.
 */
export const keelOutline = (cx: number, cy: number, w: number, seed = 1, mirror: 1 | -1 = 1): Pt[] => {
  const D = w / 1.6;
  const j = (i: number, amp: number) => (hash(seed * 17 + i) - 0.5) * 2 * amp;
  // [centre x, centre y, rx, ry] in units of w (x) and D (y)
  const lobes: [number, number, number, number][] = [
    [0, 0.08, 0.5, 0.14],
    [0.02, 0.28, 0.43, 0.3],
    [-0.13 + j(1, 0.03), 0.62 + j(2, 0.04), 0.2, 0.36],
    [0.2 + j(3, 0.03), 0.5 + j(4, 0.04), 0.15, 0.22],
    [0.37 + j(5, 0.02), 0.27, 0.11, 0.16],
    [-0.37 + j(6, 0.02), 0.3, 0.12, 0.19],
    [0.06 + j(7, 0.03), 0.7, 0.09, 0.14],
  ];
  const ox = 0.02 * w, oy = 0.33 * D;
  const inside = (x: number, y: number) => lobes.some(([lx, ly, rx, ry]) => ((x - lx * w) / (rx * w)) ** 2 + ((y - ly * D) / (ry * D)) ** 2 <= 1);
  const n = 120;
  const rr = Array.from({length: n}, (_, i) => {
    const t = (i / n) * 6.283, c = Math.cos(t), sn = Math.sin(t);
    let r = 0;
    for (let d = 2; d < w; d += 2) if (inside(ox + c * d, oy + sn * d)) r = d;
    return r;
  });
  const sm = rr.map((_, i) => {
    let acc = 0;
    for (let k = -3; k <= 3; k++) acc += rr[(i + k + n) % n];
    return acc / 7;
  });
  return sm.map((r, i) => {
    const t = (i / n) * 6.283;
    const x = ox + Math.cos(t) * r;
    let y = oy + Math.sin(t) * r;
    const top = -0.02 * D - 0.035 * D * Math.cos((x / w) * 2.6) + j(20 + Math.round(x / 40), 0.006 * D);
    if (y < top) y = top;
    return [cx + mirror * x, cy + y] as Pt;
  });
};

/** Closed Catmull-Rom sampling through `pts` (n samples), as the reference's `closed`. */
export const catmullClosed = (pts: Pt[], n: number): Pt[] => {
  const ring = [...pts, pts[0]];
  const m = ring.length - 1;
  return Array.from({length: n}, (_, k) => {
    const f = (k / n) * m, i = Math.min(m - 1, Math.floor(f)), s = f - i;
    const p0 = ring[Math.max(0, i - 1)], p1 = ring[i], p2 = ring[i + 1], p3 = ring[Math.min(m, i + 2)];
    const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s * s + (-a + 3 * b - 3 * cc + d) * s * s * s);
    return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])] as Pt;
  });
};

/** Clip a closed polygon to y <= yc ('above') or y >= yc ('below') (Sutherland-Hodgman against one row). */
const clipY = (poly: Pt[], yc: number, keep: 'above' | 'below'): Pt[] => {
  const ins = ([, y]: Pt) => (keep === 'above' ? y <= yc : y >= yc);
  const out: Pt[] = [];
  poly.forEach((cur, i) => {
    const prev = poly[(i + poly.length - 1) % poly.length];
    const cross = (): Pt => {
      const u = (yc - prev[1]) / (cur[1] - prev[1]);
      return [prev[0] + (cur[0] - prev[0]) * u, yc];
    };
    if (ins(cur)) {
      if (!ins(prev)) out.push(cross());
      out.push(cur);
    } else if (ins(prev)) out.push(cross());
  });
  return out;
};

/**
 * Painted keel (FR04 R4 value bands, FR09 haze): the underside colour everywhere first, then value bands clipped from the
 * outline itself (no box, no rectangle behind it). `haze` (FR09): the outline grown by about 16 px each side, one wash
 * `#5e8798` at 60/255 with bleed 0.5, drawn under the berg (never a disc or ellipse).
 */
/** The smoothed keel ring (120 samples) that the bands and the haze are built from. */
export const keelRing = (pts: Pt[]): Pt[] => catmullClosed(pts, 120);
/** The FR09 haze ring: the keel ring grown by about 16 px each side about its centre (never a disc or ellipse). */
export const hazeRing = (pts: Pt[]): Pt[] => {
  const sm = keelRing(pts);
  const xs = sm.map((q) => q[0]), ys = sm.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return sm.map(([x, y]) => [cx + (x - cx) * (1 + 32 / (x1 - x0)), cy + (y - cy) * (1 + 32 / (y1 - y0))] as Pt);
};
export const paintKeel = (p: Painter, pts: Pt[], o: {haze?: boolean; hazeAlpha?: number} = {}) => {
  const sm = keelRing(pts);
  const ys = sm.map((q) => q[1]);
  const y0 = Math.min(...ys), y1 = Math.max(...ys), h = y1 - y0;
  if (o.haze) p.wash('#5e8798', 24 * (o.hazeAlpha ?? 1), hazeRing(pts), 0.5, 0.4);
  p.flat('#2f5a6b', sm);
  p.wash('#5e91a3', 230, clipY(sm, y0 + 0.72 * h, 'above'), 0.18, 0.5);
  p.wash('#6f9fb0', 170, clipY(sm, y0 + 0.45 * h, 'above'), 0.2, 0.5);
  p.wash('#b8dbe6', 220, clipY(sm, y0 + 0.17 * h, 'above'), 0.15, 0.45);
  p.wash('#24495a', 170, clipY(sm, y0 + 0.86 * h, 'below'), 0.2, 0.5);
};

/**
 * ICE mass (VD10, M04, FR04 R4): the keel from `keelOutline` with its value bands; opaque by construction (every band is
 * a wash over the opaque underside), so nothing beneath shows through (DF-20261030-painted-glaze-pickup). The outline ink
 * is drawn only when `ink` is set (morph >= 0.85, kept). `haze` (FR09) adds the shape-following haze under the berg.
 */
export const paintIce = (p: Painter, outline: Pt[], o: {id: number; haze?: boolean; hazeAlpha?: number; ink?: boolean} = {id: 0}) => {
  paintKeel(p, outline, {haze: o.haze, hazeAlpha: o.hazeAlpha});
  if (o.ink === false) return;
  p.inkStill(o.id, 'HB', '#1e4656', 2);
  p.brush.spline([...outline, outline[0]], 0.4);
};

/** Wet-in-wet blooms (BLOOP-SHEETS-R8: SH11 fissures, SH12 section ice): soft watercolour patches spreading from each origin to `reach` px. */
export const paintBlooms = (p: Painter, origins: Pt[], reach: number, progress: number, color: string, opacity: number) => {
  if (progress <= 0) return;
  origins.forEach(([x, y], i) => {
    const r = reach * progress;
    const poly = range(16, (u) => {
      const a = u * 2 * Math.PI, w = 0.8 + 0.2 * hash(i * 97 + Math.round(u * 16));
      return [x + r * w * Math.cos(a), y + r * w * Math.sin(a) * 0.7] as Pt;
    });
    p.wash(color, Math.round(opacity * Math.min(1, 2 * progress)), poly, 0.6, 0.3);
  });
};

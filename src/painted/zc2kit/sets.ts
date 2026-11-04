import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// ZCONDO2 kit-look SETS (r3, UT12, 3 Nov 2026): textured walls/floors/doors and lived-in Thai condo props for the four proof frames.
// Everything is p5.brush: hard flat underlayer for straight edges, then seeded washes (bleed + texture) for plaster tone, stains and
// wear, and pencil/charcoal strokes for grain, grout and cracks. Props are authored in local metres (y up, origin bottom-centre)
// and placed through a mapper `M` (affine for elevations, bilinear for wall quads in perspective), so one prop serves every frame.
// Proposed for kit intake: `plaster`, `tileFloor`, `woodGrain` and the prop set (KIT-P01); not yet in src/painted/kit.

export type M = (x: number, y: number) => Pt;
export const affine = (ox: number, oy: number, s: number): M => (x, y) => [ox + x * s, oy - y * s];
/** Bilinear map of a wall quad (tl, tr, br, bl) to local metres: x 0..w from the left, y 0..h from the bottom. */
export const quadMap = (tl: Pt, tr: Pt, br: Pt, bl: Pt, w: number, h: number, ox = 0): M => (x, y) => {
  const u = (x + ox) / w, v = 1 - y / h;
  const t: Pt = [tl[0] + (tr[0] - tl[0]) * u, tl[1] + (tr[1] - tl[1]) * u], b: Pt = [bl[0] + (br[0] - bl[0]) * u, bl[1] + (br[1] - bl[1]) * u];
  return [t[0] + (b[0] - t[0]) * v, t[1] + (b[1] - t[1]) * v];
};

let N = 5000;
export const resetIds = (base: number) => { N = base; };
const nid = () => N++;
const H = (i: number) => hash(i * 3.7 + 1.3);

const tint = (p: Painter, color: string, alpha: number, pts: Pt[]) => {
  const b = p.brush;
  b.seed(nid()); b.noStroke(); b.noFill(); b.wash(color, alpha * p.alpha); b.polygon(pts); b.noWash();
};
/** Pencil / charcoal stroke through points (brush names: 2B, HB, charcoal). */
export const stroke = (p: Painter, name: string, color: string, w: number, pts: Pt[], curve = 0.1) => {
  if (pts.length < 2) return;
  p.inkStill(nid(), name, color, w);
  p.brush.spline(pts, curve);
};
const fill = (p: Painter, color: string, pts: Pt[]) => hardFill(p, nid(), color, pts);
export const fillF = fill;
export const tintS = (p: Painter, color: string, alpha: number, pts: Pt[]) => tint(p, color, alpha, pts);
export const glazeS = (p: Painter, color: string, a: number, pts: Pt[]) => washAt(p, nid(), color, a, pts, 0.35, 0.5);
const glazeM = (p: Painter, color: string, a: number, pts: Pt[], bleed = 0.3, tex = 0.5) => washAt(p, nid(), color, a, pts, bleed, tex);
const outline = (p: Painter, pts: Pt[], color = '#4b3d33', w = 0.8) => inkLine(p, nid(), pts, {color, weight: w, closed: true, curve: 0.02, still: true});
const ring = (cx: number, cy: number, rx: number, ry: number, n = 12): Pt[] => ell(cx, cy, rx, ry, n);
const ringM = (m: M, cx: number, cy: number, r: number, n = 14): Pt[] => Array.from({length: n}, (_, i) => m(cx + r * Math.cos((i / n) * 6.283), cy + r * Math.sin((i / n) * 6.283)));
const P = (m: M, pts: [number, number][]): Pt[] => pts.map(([x, y]) => m(x, y));
const bil = (q: Pt[], u: number, v: number): Pt => {
  const t: Pt = [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u], b: Pt = [q[3][0] + (q[2][0] - q[3][0]) * u, q[3][1] + (q[2][1] - q[3][1]) * u];
  return [t[0] + (b[0] - t[0]) * v, t[1] + (b[1] - t[1]) * v];
};

// ------------------------------------------------------------------ surfaces
export type SurfaceOpts = {
  seed?: number; patches?: number; grain?: 'h' | 'v' | 'none'; grainN?: number; streaks?: number; warm?: string; cool?: string; wear?: number; patchAlpha?: number;
};
/**
 * Painted surface on a quad (tl, tr, br, bl): crisp underlayer, tone patches (washes with bleed + texture), grain strokes in pencil,
 * water streaks from the top edge and edge wear. No two patches or strokes repeat.
 */
export const surface = (p: Painter, q: Pt[], base: string, o: SurfaceOpts = {}) => {
  const s0 = (o.seed ?? 0) * 100;
  fill(p, base, q);
  const warm = o.warm ?? '#6a5238', cool = o.cool ?? '#fff6dc';
  const np = o.patches ?? 14;
  for (let i = 0; i < np; i++) {
    const u = H(s0 + i * 5 + 1), v = H(s0 + i * 5 + 2), ru = 0.06 + 0.2 * H(s0 + i * 5 + 3), rv = 0.04 + 0.16 * H(s0 + i * 5 + 4);
    const pts: Pt[] = Array.from({length: 9}, (_, k) => {
      const a = (k / 9) * 6.283, rr = 0.7 + 0.5 * H(s0 + i * 17 + k);
      return bil(q, Math.min(1, Math.max(0, u + Math.cos(a) * ru * rr)), Math.min(1, Math.max(0, v + Math.sin(a) * rv * rr)));
    });
    const light = H(s0 + i * 5 + 5) > 0.45;
    glazeM(p, mixColor(base, light ? cool : warm, light ? 0.35 : 0.3), (o.patchAlpha ?? 70) * (0.6 + 0.8 * H(s0 + i + 40)), pts, 0.35, 0.6);
  }
  const gn = o.grainN ?? 26, gdir = o.grain ?? 'h';
  if (gdir !== 'none') {
    for (let i = 0; i < gn; i++) {
      const a = H(s0 + i * 7 + 200), b = H(s0 + i * 7 + 201), len = 0.12 + 0.4 * H(s0 + i * 7 + 202), w = 0.6 + 0.9 * H(s0 + i * 7 + 203);
      const col = mixColor(base, i % 3 ? warm : '#ffffff', i % 3 ? 0.22 : 0.3);
      const seg: Pt[] = [0, 0.33, 0.66, 1].map((t, k) => {
        const wob = (H(s0 + i * 13 + k) - 0.5) * 0.012;
        return gdir === 'h' ? bil(q, Math.min(1, a + len * t), Math.min(1, Math.max(0, b + wob))) : bil(q, Math.min(1, Math.max(0, a + wob)), Math.min(1, b + len * t));
      });
      stroke(p, i % 4 === 0 ? 'charcoal' : '2B', col, w, seg, 0.2);
    }
  }
  for (let i = 0; i < (o.streaks ?? 0); i++) {
    const u = 0.05 + 0.9 * H(s0 + i * 3 + 400), len = 0.18 + 0.4 * H(s0 + i * 3 + 401), wd = 0.008 + 0.014 * H(s0 + i * 3 + 402);
    glazeM(p, '#6b5a3c', 55, [bil(q, u - wd, 0), bil(q, u + wd, 0), bil(q, u + wd * 0.6 + 0.004, len), bil(q, u - wd * 0.5, len + 0.05)], 0.25, 0.5);
    stroke(p, '2B', mixColor(base, '#4a3a26', 0.4), 0.5, [bil(q, u + wd, 0.02), bil(q, u + wd * 0.6 + 0.004, len)], 0.1);
  }
  if (o.wear) {
    for (let i = 0; i < o.wear; i++) {
      const u = H(s0 + i * 2 + 500), v = H(s0 + i * 2 + 501);
      stroke(p, 'HB', mixColor(base, '#f8f0da', 0.55), 0.7, [bil(q, u, v), bil(q, Math.min(1, u + 0.04), Math.min(1, v + 0.02 + H(s0 + i + 502) * 0.03))], 0.1);
    }
  }
};

/** A jagged wall crack from (x, y) with `n` kinks; branch adds one fork. */
export const crack = (p: Painter, m: M, x: number, y: number, dx: number, dy: number, n: number, seed: number, w = 0.9) => {
  const pts: [number, number][] = [[x, y]];
  for (let i = 1; i <= n; i++) {
    const [px, py] = pts[i - 1];
    pts.push([px + dx / n + (H(seed + i) - 0.5) * 0.05, py + dy / n + (H(seed + i + 50) - 0.5) * 0.04]);
  }
  stroke(p, '2B', '#4d4030', w, P(m, pts), 0.05);
  const k = Math.floor(n / 2), [bx, by] = pts[k];
  stroke(p, 'HB', '#5a4a38', w * 0.7, P(m, [[bx, by], [bx + dx * 0.25, by + dy * 0.1 + 0.05], [bx + dx * 0.4, by + dy * 0.12 + 0.07]]), 0.05);
  stroke(p, 'HB', '#f8f0da', w * 0.5, P(m, pts.map(([a, b]) => [a + 0.006, b - 0.004] as [number, number])), 0.05);
};

/** Floor mapper for an elevation view: wall plane at scale U px/m with floor line GY and horizon y Hy; xw across, zw towards the camera. */
export const floorMap = (cx: number, Hy: number, GY: number, U: number, D: number) => (xw: number, zw: number): Pt => {
  const k = D / Math.max(0.2, D - zw);
  return [cx + xw * U * k, Hy + (GY - Hy) * k];
};

/** Ceramic tile floor: each tile its own tone and wash, grout in pencil, chips and wear; `fm` maps (x, z) m to screen. */
export const tileFloor = (p: Painter, fm: (x: number, z: number) => Pt, x0: number, x1: number, z0: number, z1: number, tile: number, base: string, seed = 0) => {
  const s0 = seed * 100;
  let i = 0;
  for (let z = z0; z < z1; z += tile) {
    for (let x = x0; x < x1; x += tile) {
      const q = [fm(x, z), fm(x + tile, z), fm(x + tile, z + tile), fm(x, z + tile)];
      const j = H(s0 + i * 3 + 1);
      fill(p, mixColor(base, j > 0.5 ? '#f3ead2' : '#6f6048', 0.04 + 0.12 * Math.abs(j - 0.5) * 2), q);
      if (j > 0.35) glazeM(p, mixColor(base, '#ffffff', 0.25), 45, [bil(q, 0.15, 0.15), bil(q, 0.9, 0.2), bil(q, 0.8, 0.85), bil(q, 0.1, 0.8)], 0.4, 0.55);
      if (H(s0 + i * 3 + 2) > 0.6) glazeM(p, '#5a4a36', 50, [bil(q, 0.5, 0.3), bil(q, 0.95, 0.5), bil(q, 0.7, 1), bil(q, 0.35, 0.9)], 0.4, 0.6); // scuffed tile
      i++;
    }
  }
  for (let z = z0; z <= z1 + 1e-6; z += tile) stroke(p, '2B', mixColor(base, '#2e2418', 0.5), 1.6, [fm(x0, z), fm((x0 + x1) / 2, z), fm(x1, z)], 0.02);
  for (let x = x0; x <= x1 + 1e-6; x += tile) stroke(p, '2B', mixColor(base, '#2e2418', 0.5), 1.6, [fm(x, z0), fm(x, (z0 + z1) / 2), fm(x, z1)], 0.02);
  for (let z = z0; z < z1; z += tile) for (let x = x0; x < x1; x += tile) if (H(s0 + z * 9 + x * 13) > 0.8) { // chipped corner + wear scratches
    const a = fm(x + 0.03, z + 0.03), b = fm(x + 0.12, z + 0.05);
    stroke(p, 'HB', '#f4ecd6', 0.8, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2], b], 0.1);
  }
};

/** Wood panel: grain strokes run along `v` (vertical) or `h`, with a darker edge and a bevel highlight. */
export const woodGrain = (p: Painter, q: Pt[], base: string, seed: number, dir: 'v' | 'h' = 'v', n = 28) => {
  fill(p, base, q);
  for (let i = 0; i < 4; i++) glazeM(p, mixColor(base, i % 2 ? '#fff1d0' : '#4a3422', 0.25), 70, [bil(q, 0.05 + i * 0.22, 0.03), bil(q, 0.2 + i * 0.22, 0.03), bil(q, 0.2 + i * 0.22, 0.97), bil(q, 0.05 + i * 0.22, 0.97)], 0.4, 0.6);
  for (let i = 0; i < n; i++) {
    const a = 0.03 + 0.94 * H(seed * 50 + i), t0 = H(seed * 50 + i + 100) * 0.3, t1 = Math.min(1, t0 + 0.3 + 0.6 * H(seed * 50 + i + 200));
    const pts: Pt[] = [t0, (t0 + t1) / 2, t1].map((t, k) => {
      const u = a + (H(seed * 50 + i * 9 + k) - 0.5) * 0.02;
      return dir === 'v' ? bil(q, u, t) : bil(q, t, u);
    });
    stroke(p, '2B', mixColor(base, i % 4 ? '#3a2616' : '#fff1d0', i % 4 ? 0.3 : 0.25), 0.6 + 0.6 * H(seed * 50 + i + 300), pts, 0.3);
  }
  for (let k = 0; k < 2; k++) { // knots
    const c = bil(q, 0.2 + 0.55 * H(seed * 7 + k), 0.2 + 0.6 * H(seed * 7 + k + 9));
    stroke(p, '2B', mixColor(base, '#3a2616', 0.45), 0.7, ring(c[0], c[1], 6 + 3 * k, 12 + 4 * k, 10), 0.2);
  }
};

// ------------------------------------------------------------------ props (local metres, origin bottom-centre)
/** Soft contact shadow on the floor (ellipse flattened by the mapper) plus a dark core. */
export const contact = (p: Painter, m: M, cx: number, rx: number, ry = 0.035, a = 95) => {
  glazeM(p, '#3d2f25', a * 0.55, P(m, Array.from({length: 14}, (_, i) => [cx + rx * 1.25 * Math.cos((i / 14) * 6.283), ry * 1.7 * Math.sin((i / 14) * 6.283) - ry * 0.4] as [number, number])), 0.4, 0.4);
  tint(p, '#2d2119', a, P(m, Array.from({length: 14}, (_, i) => [cx + rx * Math.cos((i / 14) * 6.283), ry * Math.sin((i / 14) * 6.283) - ry * 0.2] as [number, number])));
};
const drop = (p: Painter, m: M, pts: [number, number][], d = 0.012, a = 70) => tint(p, '#2d2119', a, P(m, pts.map(([x, y]) => [x + d, y - d] as [number, number])));
const box = (p: Painter, m: M, x0: number, y0: number, x1: number, y1: number, color: string, w = 0.8): Pt[] => {
  const q = P(m, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); fill(p, color, q); outline(p, q, mixColor(color, '#2a211b', 0.6), w); return q;
};

export const lightSwitch = (p: Painter, m: M) => {
  drop(p, m, [[-0.043, 0], [0.043, 0], [0.043, 0.115], [-0.043, 0.115]]);
  glazeM(p, '#6b5a3c', 60, P(m, [[-0.06, -0.02], [0.06, -0.015], [0.058, 0.13], [-0.058, 0.135]]), 0.5, 0.5); // grime halo
  box(p, m, -0.043, 0, 0.043, 0.115, '#ebe3cf');
  [0.06, 0.012].forEach((y) => { box(p, m, -0.026, y, 0.026, y + 0.042, '#f7f1e0', 0.6); tint(p, '#a89c80', 60, P(m, [[-0.026, y], [0.026, y], [0.026, y + 0.012], [-0.026, y + 0.012]])); });
  [[-0.032, 0.105], [0.032, 0.01]].forEach(([x, y]) => { fill(p, '#8a8068', ringM(m, x, y, 0.004, 6)); });
  glazeM(p, '#7a6a4a', 55, P(m, [[0.0, 0.0], [0.043, 0.0], [0.043, 0.04], [0.01, 0.03]]), 0.4, 0.5); // thumb grime
};
export const intercom = (p: Painter, m: M) => {
  drop(p, m, [[-0.06, 0], [0.06, 0], [0.06, 0.22], [-0.06, 0.22]], 0.014, 75);
  box(p, m, -0.06, 0, 0.06, 0.22, '#d8d0b8');
  tint(p, '#fff8e6', 70, P(m, [[-0.06, 0.12], [-0.03, 0.12], [-0.03, 0.22], [-0.06, 0.22]]));
  for (let i = 0; i < 5; i++) stroke(p, '2B', '#6c6350', 1.2, P(m, [[-0.036, 0.19 - i * 0.012], [0.036, 0.19 - i * 0.012]]), 0.02); // speaker grille
  fill(p, '#3f9a5c', ringM(m, 0.036, 0.095, 0.007, 8));
  fill(p, '#a9a08a', ringM(m, -0.022, 0.06, 0.012, 10)); fill(p, '#a9a08a', ringM(m, 0.022, 0.06, 0.012, 10));
  fill(p, '#a9a08a', ringM(m, 0, 0.03, 0.012, 10));
  stroke(p, 'HB', '#4b4538', 1.1, P(m, [[0.06, 0.04], [0.09, 0.0], [0.07, -0.05], [0.1, -0.1], [0.075, -0.15], [0.1, -0.2]]), 0.3); // coiled cord
};
export const breaker = (p: Painter, m: M) => {
  drop(p, m, [[-0.15, 0], [0.15, 0], [0.15, 0.32], [-0.15, 0.32]], 0.016, 80);
  box(p, m, -0.15, 0, 0.15, 0.32, '#a6aaa4');
  glazeM(p, '#fffbe8', 60, P(m, [[-0.15, 0.1], [-0.05, 0.1], [-0.05, 0.32], [-0.15, 0.32]]), 0.3, 0.5);
  box(p, m, -0.12, 0.2, 0.12, 0.27, '#d6d0b8', 0.5); // label strip
  for (let i = 0; i < 4; i++) stroke(p, 'HB', '#5a5446', 0.6, P(m, [[-0.1, 0.262 - i * 0.012], [0.1 - i * 0.02, 0.262 - i * 0.012]]), 0.02);
  for (let i = 0; i < 6; i++) { box(p, m, -0.1 + i * 0.036, 0.04, -0.07 + i * 0.036, 0.15, '#2f3236', 0.4); box(p, m, -0.095 + i * 0.036, i % 2 ? 0.045 : 0.1, -0.075 + i * 0.036, i % 2 ? 0.09 : 0.145, '#d5d8d2', 0.3); }
  stroke(p, 'HB', '#f2f2ea', 0.8, P(m, [[-0.15, 0.32], [0.15, 0.32]]), 0.02);
  [[-0.14, 0.31], [0.14, 0.31], [-0.14, 0.01], [0.14, 0.01]].forEach(([x, y]) => fill(p, '#6e716c', ringM(m, x, y, 0.006, 6)));
  glazeM(p, '#7a4a2a', 55, P(m, [[-0.15, 0], [-0.1, 0], [-0.11, 0.06], [-0.15, 0.05]]), 0.4, 0.5); // rust
};
export const keyRack = (p: Painter, m: M) => {
  drop(p, m, [[-0.16, 0], [0.16, 0], [0.16, 0.07], [-0.16, 0.07]]);
  woodGrain(p, P(m, [[-0.16, 0.07], [0.16, 0.07], [0.16, 0], [-0.16, 0]]), '#7a5a3c', 9, 'h', 8);
  outline(p, P(m, [[-0.16, 0], [0.16, 0], [0.16, 0.07], [-0.16, 0.07]]), '#3d2a1a', 0.7);
  [-0.11, -0.04, 0.03, 0.1].forEach((x, i) => {
    fill(p, '#c9b070', ringM(m, x, 0.045, 0.007, 8));
    if (i !== 2) { stroke(p, '2B', '#4a4a4c', 1.0, P(m, [[x, 0.04], [x, -0.03]]), 0.02); fill(p, i === 1 ? '#c9a24a' : '#9aa0a4', P(m, [[x - 0.012, -0.03], [x + 0.012, -0.03], [x + 0.012, -0.09], [x - 0.012, -0.09]])); fill(p, '#d9d0b0', ringM(m, x, -0.03, 0.012, 8)); }
  });
  stroke(p, '2B', '#a33a2e', 1.6, P(m, [[0.03, 0.04], [0.045, -0.04], [0.035, -0.12], [0.05, -0.17]]), 0.3); // red lanyard on the third hook
};
export const umbrella = (p: Painter, m: M) => { // leaning furled umbrella, handle down
  contact(p, m, 0.05, 0.07, 0.03, 80);
  const tilt = 0.1;
  const L = (t: number, x: number): [number, number] => [tilt * t + x, t];
  fill(p, '#2d3a55', P(m, [L(0.2, -0.03), L(0.2, 0.03), L(0.6, 0.058), L(0.92, 0.012), L(0.97, 0), L(0.92, -0.012), L(0.6, -0.058)]));
  tint(p, '#9fb2d8', 60, P(m, [L(0.25, -0.03), L(0.25, -0.012), L(0.6, -0.03), L(0.9, -0.005), L(0.6, -0.052)]));
  for (let i = 0; i < 3; i++) stroke(p, '2B', '#1d2740', 0.9, P(m, [L(0.3 + i * 0.12, -0.02), L(0.42 + i * 0.12, 0.05)]), 0.2);
  stroke(p, 'HB', '#1a1a1c', 2.2, P(m, [L(0.0, 0.06), L(0.0, 0.0), L(0.08, -0.03), L(0.16, 0.0), L(0.2, 0.0)]), 0.3); // J handle
  fill(p, '#6e6e70', P(m, [L(0.19, -0.01), L(0.19, 0.01), L(0.23, 0.01), L(0.23, -0.01)]));
  stroke(p, 'HB', '#161820', 1.6, P(m, [L(0.97, 0), L(1.05, 0.0)]), 0.1);
  outline(p, P(m, [L(0.2, -0.03), L(0.6, -0.058), L(0.92, -0.012), L(0.92, 0.012), L(0.6, 0.058), L(0.2, 0.03)]), '#141a2a', 0.8);
};
/** A leaf along a curved spine (local metres, y up): `len` from (bx, by) at angle `a` from vertical, drooping by `g` (0 stiff .. 1 hanging), widest `w` at 40%. Returns the outline and the spine. */
const leafShape = (m: M, bx: number, by: number, a: number, len: number, g: number, w: number, n = 9) => {
  const sp = (t: number): [number, number] => [bx + Math.sin(a) * len * t + Math.sign(Math.sin(a) || 1) * g * len * 0.5 * t * t, by + Math.cos(a) * len * t - g * len * 0.9 * t * t];
  const pts: [number, number][] = Array.from({length: n + 1}, (_, i) => sp(i / n));
  const side = (sgn: number) => pts.map(([x, y], i) => {
    const q = pts[Math.min(n, i + 1)], r = pts[Math.max(0, i - 1)], tx = q[0] - r[0], ty = q[1] - r[1], tl = Math.hypot(tx, ty) || 1, t = i / n;
    const ww = w * Math.sin(Math.PI * Math.pow(t, 0.7)) ** 0.85;
    return [x - (ty / tl) * ww * sgn, y + (tx / tl) * ww * sgn] as [number, number];
  });
  const L = side(1), R = side(-1);
  return {outline: P(m, [...L, ...R.reverse()]), halfShade: P(m, [...pts, ...R.reverse().slice(0)].slice(0)), spine: P(m, pts), L: P(m, L), R: P(m, R)};
};
/**
 * House plant in a pot, three variants so a place never repeats the same one: 0 broad drooping leaves in a terracotta pot (some dry),
 * 1 snake plant, upright striped blades in a grey glazed pot, 2 trailing pothos, small heart leaves spilling over a white pot.
 * Leaves are curved, two-toned (lit half, shade half), with a midrib; no leaf is the same size or angle.
 */
export const plant = (p: Painter, m: M, wilt = 0.5, variant = 0) => {
  contact(p, m, 0, 0.13, 0.04, 100);
  const potCol = ['#b8683e', '#6f7c82', '#d8d2c2'][variant] ?? '#b8683e', rimCol = ['#c4764a', '#8a979c', '#e6e0d2'][variant] ?? '#c4764a';
  fill(p, '#8a5a40', P(m, [[-0.14, 0.0], [0.14, 0.0], [0.15, 0.02], [-0.15, 0.02]])); // saucer
  const pot = P(m, [[-0.09, 0.02], [0.09, 0.02], [0.125, 0.22], [-0.125, 0.22]]);
  fill(p, potCol, pot); glazeM(p, mixColor(potCol, '#ffffff', 0.35), 80, P(m, [[-0.1, 0.04], [-0.05, 0.04], [-0.07, 0.2], [-0.115, 0.2]]), 0.3, 0.5); tint(p, '#2a1a10', 70, P(m, [[0.04, 0.02], [0.09, 0.02], [0.125, 0.22], [0.06, 0.22]]));
  fill(p, rimCol, P(m, [[-0.14, 0.22], [0.14, 0.22], [0.14, 0.27], [-0.14, 0.27]])); outline(p, pot, '#4a2a1a', 0.8);
  outline(p, P(m, [[-0.14, 0.22], [0.14, 0.22], [0.14, 0.27], [-0.14, 0.27]]), '#4a2a1a', 0.8);
  fill(p, '#3a2a1c', P(m, [[-0.12, 0.27], [0.12, 0.27], [0.1, 0.285], [-0.1, 0.285]]));
  const leaf = (bx: number, by: number, a: number, len: number, g: number, w: number, col: string, k: number, dry = false) => {
    const L = leafShape(m, bx, by, a, len, g, w);
    fill(p, col, L.outline);
    tint(p, dry ? '#4a3a1a' : '#1a2a10', 70, [...L.R, ...L.spine.slice().reverse()]); // shade half, away from the window light
    tint(p, dry ? '#f0e4a8' : '#e8f2b8', 50, [...L.L, ...L.spine.slice().reverse()]); // lit half
    stroke(p, '2B', mixColor(col, '#1a2410', 0.55), 0.9, L.spine, 0.3); // midrib
    outline(p, L.outline, mixColor(col, '#10180a', 0.55), 0.6);
    if (dry) tint(p, '#6a4a22', 120, [L.spine[Math.floor(L.spine.length * 0.7)], ...L.L.slice(6), ...L.R.slice(6).reverse()]); // brown dead tip
    void k;
  };
  const green = (i: number, dry: boolean) => dry ? (i % 2 ? '#a5974a' : '#8c7a3c') : ['#4f7a3a', '#5f8441', '#3f6a30', '#6a8f46'][i % 4];
  if (variant === 0) {
    // broad leaves, uneven: a few dry, outer ones hang
    const n = 8;
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * 2 - 1, a = t * 1.25 + (H(i + 70) - 0.5) * 0.35, len = 0.26 + 0.2 * H(i + 71) - 0.05 * Math.abs(t), g = 0.15 + 0.7 * Math.abs(t) ** 1.5 + 0.2 * H(i + 72), dry = H(i + 90) < wilt * 0.7;
      leaf(0.014 * (i - 3.5), 0.285, a, len, g, 0.045 + 0.02 * H(i + 73), green(i, dry), i, dry);
    }
  } else if (variant === 1) {
    // snake plant: stiff blades of unequal height, pale edge and dark cross bands
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * 2 - 1, a = t * 0.38 + (H(i + 40) - 0.5) * 0.12, len = 0.55 + 0.4 * H(i + 41) - 0.2 * Math.abs(t), w = 0.03 + 0.012 * H(i + 42);
      const L = leafShape(m, 0.02 * (i - 3), 0.285, a, len, 0.02 + 0.1 * Math.abs(t), w, 8);
      fill(p, i % 2 ? '#3f5f3a' : '#47693f', L.outline);
      tint(p, '#101a0c', 75, [...L.R, ...L.spine.slice().reverse()]); tint(p, '#e8f0b0', 40, [...L.L, ...L.spine.slice().reverse()]);
      stroke(p, '2B', '#c9c070', 1.1, L.L, 0.2);
      for (let k = 1; k < 6; k++) stroke(p, 'HB', '#1f3018', 0.9, [L.L[k], L.R[k]], 0.02);
      outline(p, L.outline, '#142010', 0.6);
    }
  } else {
    // pothos: a mound of heart leaves, three vines hanging over the rim and down the pot
    for (let i = 0; i < 11; i++) {
      const a = (i / 10) * 2.4 - 1.2 + (H(i + 50) - 0.5) * 0.3, r = 0.1 + 0.08 * H(i + 51), x = Math.sin(a) * r, y = 0.3 + Math.cos(a) * r * 0.5 + 0.03 * H(i + 52);
      leaf(x, y, a * 0.7, 0.13 + 0.05 * H(i + 53), 0.35 + 0.3 * H(i + 54), 0.05, ['#5a8a3c', '#6b9a46', '#4a7a34'][i % 3], i);
    }
    [[-0.1, -1], [0.07, 1], [0.12, 1]].forEach(([x0, dir], v) => {
      const xs = x0 + dir * 0.06, len = 0.2 + 0.1 * v;
      const vine: [number, number][] = Array.from({length: 7}, (_, i) => [x0 + dir * 0.05 * (i / 6) + dir * 0.03 * Math.sin(i), 0.27 - (len * i) / 6]);
      stroke(p, '2B', '#4a5a28', 1.4, P(m, vine), 0.3);
      vine.slice(1).forEach(([vx, vy], i) => leaf(vx, vy, dir * (1.0 + 0.2 * (i % 2)), 0.08, 0.5, 0.032, ['#6b9a46', '#5a8a3c'][i % 2], i));
      void xs;
    });
  }
};
export const shoeRack = (p: Painter, m: M) => { // slatted two-tier rack with shoes and sandals
  contact(p, m, 0, 0.36, 0.04, 110);
  woodGrain(p, P(m, [[-0.34, 0.5], [0.34, 0.5], [0.34, 0.47], [-0.34, 0.47]]), '#8a6a48', 3, 'h', 6);
  [-0.31, 0.31].forEach((x, i) => woodGrain(p, P(m, [[x - 0.02, 0.5], [x + 0.02, 0.5], [x + 0.02, 0], [x - 0.02, 0]]), '#6a4a30', 4 + i, 'v', 6));
  [0.24, 0.0].forEach((y, i) => woodGrain(p, P(m, [[-0.34, y + 0.025], [0.34, y + 0.025], [0.34, y], [-0.34, y]]), '#7a5a3c', 6 + i, 'h', 6));
  const shoe = (x: number, y: number, c: string, sole = '#e8e0cc', flip = 1) => {
    const q: [number, number][] = [[x, y], [x + 0.19 * flip, y], [x + 0.2 * flip, y + 0.035], [x + 0.14 * flip, y + 0.06], [x + 0.06 * flip, y + 0.075], [x + 0.005 * flip, y + 0.07]];
    fill(p, c, P(m, q)); fill(p, sole, P(m, [[x, y], [x + 0.19 * flip, y], [x + 0.195 * flip, y + 0.012], [x, y + 0.012]])); outline(p, P(m, q), '#2a211b', 0.7);
    tint(p, '#ffffff', 50, P(m, [[x + 0.04 * flip, y + 0.03], [x + 0.14 * flip, y + 0.04], [x + 0.1 * flip, y + 0.06]]));
  };
  shoe(-0.28, 0.265, '#3b4a62'); shoe(-0.06, 0.265, '#8a4a3a'); shoe(0.1, 0.265, '#c9b78f', '#8a7a5a');
  shoe(-0.22, 0.025, '#2f3a3a'); shoe(0.0, 0.025, '#d9d0b4', '#9a8a6a', -1);
  fill(p, '#4a8a86', P(m, [[0.1, 0.025], [0.27, 0.025], [0.27, 0.035], [0.1, 0.035]])); stroke(p, '2B', '#e8e0cc', 1.4, P(m, [[0.15, 0.036], [0.19, 0.06], [0.23, 0.036]]), 0.3); // sandal
};
export const umbrellaStand = umbrella;
export const meterBox = (p: Painter, m: M) => { // electric meter cabinet on the corridor wall
  drop(p, m, [[-0.17, 0], [0.17, 0], [0.17, 0.5], [-0.17, 0.5]], 0.02, 80);
  box(p, m, -0.17, 0, 0.17, 0.5, '#8d9490');
  glazeM(p, '#fffbe8', 55, P(m, [[-0.17, 0.2], [-0.07, 0.2], [-0.07, 0.5], [-0.17, 0.5]]), 0.3, 0.5);
  box(p, m, -0.12, 0.2, 0.12, 0.42, '#2f3a40', 0.8);
  tint(p, '#cfe0e8', 90, P(m, [[-0.12, 0.34], [0.0, 0.34], [-0.04, 0.42], [-0.12, 0.42]])); // glass glint
  box(p, m, -0.09, 0.3, 0.09, 0.38, '#e8e4d2', 0.6);
  for (let i = 0; i < 5; i++) { box(p, m, -0.08 + i * 0.033, 0.31, -0.054 + i * 0.033, 0.37, '#1d1d1c', 0.3); }
  fill(p, '#d4d0c0', ringM(m, 0, 0.255, 0.035, 14)); outline(p, ringM(m, 0, 0.255, 0.035, 14), '#2a2a28', 0.6);
  stroke(p, '2B', '#a33a2e', 1.0, P(m, [[0, 0.255], [0.025, 0.27]]), 0.02); // dial hand
  stroke(p, 'HB', '#4a4a48', 1.1, P(m, [[-0.1, 0], [-0.1, -0.1], [-0.13, -0.2]]), 0.3); stroke(p, 'HB', '#5a4a38', 1.1, P(m, [[0.0, 0], [0.01, -0.12]]), 0.3); // conduit
  box(p, m, -0.06, 0.1, 0.06, 0.16, '#d6c28a', 0.5); fill(p, '#a33a2e', ringM(m, 0.1, 0.13, 0.012, 8)); // label, seal
  glazeM(p, '#6a3a1e', 60, P(m, [[0.05, 0], [0.17, 0], [0.17, 0.08], [0.09, 0.05]]), 0.4, 0.5);
};
const seg7: Record<string, number[]> = {'0': [1, 1, 1, 0, 1, 1, 1], '1': [0, 0, 1, 0, 0, 1, 0], '2': [1, 0, 1, 1, 1, 0, 1], '3': [1, 0, 1, 1, 0, 1, 1], '4': [0, 1, 1, 1, 0, 1, 0], '5': [1, 1, 0, 1, 0, 1, 1], '6': [1, 1, 0, 1, 1, 1, 1], '7': [1, 0, 1, 0, 0, 1, 0], '8': [1, 1, 1, 1, 1, 1, 1], '9': [1, 1, 1, 1, 0, 1, 1]};
export const numberPlate = (p: Painter, m: M, text = '1207') => {
  drop(p, m, [[-0.1, 0], [0.1, 0], [0.1, 0.075], [-0.1, 0.075]], 0.01, 80);
  box(p, m, -0.1, 0, 0.1, 0.075, '#b99a54', 0.7);
  tint(p, '#fff1b0', 70, P(m, [[-0.1, 0.04], [0.0, 0.04], [-0.03, 0.075], [-0.1, 0.075]]));
  [...text].forEach((ch, k) => {
    const x = -0.075 + k * 0.04, y = 0.012, w = 0.022, h = 0.025;
    const s = seg7[ch] ?? seg7['0'];
    const lines: [number, number, number, number][] = [[0, h * 2, w, h * 2], [0, h, 0, h * 2], [w, h, w, h * 2], [0, h, w, h], [0, 0, 0, h], [w, 0, w, h], [0, 0, w, 0]];
    lines.forEach((l, i) => { if (s[i]) stroke(p, 'HB', '#2a2218', 1.7, P(m, [[x + l[0], y + l[1] * 0.55 * 0.9 + 0.0], [x + l[2], y + l[3] * 0.55 * 0.9]]), 0.01); });
  });
  [[-0.092, 0.067], [0.092, 0.067], [-0.092, 0.008], [0.092, 0.008]].forEach(([x, y]) => fill(p, '#6a5a30', ringM(m, x, y, 0.004, 6)));
};
export const noticePaper = (p: Painter, m: M, tilt = 0.04) => { // juristic-person style notice taped to a door
  const r = (x: number, y: number): [number, number] => [x + tilt * y, y - tilt * x * 0.5];
  const sh = [[-0.105, 0], [0.105, 0], [0.105, 0.297], [-0.105, 0.297]].map(([x, y]) => r(x, y));
  drop(p, m, sh, 0.008, 70);
  fill(p, '#f1ead4', P(m, sh)); outline(p, P(m, sh), '#6a604a', 0.5);
  fill(p, '#b8372b', P(m, [[-0.1, 0.27], [0.1, 0.27], [0.1, 0.29], [-0.1, 0.29]].map(([x, y]) => r(x, y))));
  for (let i = 0; i < 11; i++) stroke(p, 'HB', '#6e675a', 0.8, P(m, [[-0.09, 0.245 - i * 0.02], [-0.09 + (i === 5 || i === 10 ? 0.09 : 0.17 - 0.03 * H(i + 20)), 0.245 - i * 0.02]].map(([x, y]) => r(x, y))), 0.01);
  [[-0.105, 0.297, 0.02, 0.02], [0.105, 0.297, -0.02, 0.02]].forEach(([x, y, dx, dy]) => fill(p, '#e8dcb0', P(m, [[x, y], [x + dx * 1.2, y], [x + dx * 1.2, y + dy], [x, y + dy]].map(([a, b]) => r(a, b))))); // tape
  glazeM(p, '#6b5a3c', 50, P(m, [[0.04, 0], [0.105, 0], [0.105, 0.08], [0.06, 0.05]].map(([x, y]) => r(x, y))), 0.4, 0.5);
};
export const fireSign = (p: Painter, m: M) => { // green exit sign with running figure and arrow
  const q = [[-0.22, 0], [0.22, 0], [0.22, 0.17], [-0.22, 0.17]] as [number, number][];
  drop(p, m, q, 0.014, 75); fill(p, '#2c8a52', P(m, q)); outline(p, P(m, q), '#143a22', 0.8);
  tint(p, '#9af0b8', 50, P(m, [[-0.22, 0.09], [0.0, 0.09], [-0.05, 0.17], [-0.22, 0.17]]));
  fill(p, '#f6faf0', ringM(m, 0.0, 0.135, 0.016, 8)); // head
  stroke(p, '2B', '#f6faf0', 2.4, P(m, [[0.0, 0.12], [-0.012, 0.085], [0.01, 0.06], [0.0, 0.03]]), 0.3);
  stroke(p, '2B', '#f6faf0', 2.0, P(m, [[-0.04, 0.1], [0.0, 0.11], [0.035, 0.09]]), 0.3);
  stroke(p, '2B', '#f6faf0', 2.0, P(m, [[0.01, 0.06], [0.04, 0.045], [0.05, 0.02]]), 0.3);
  box(p, m, 0.1, 0.03, 0.2, 0.14, '#f6faf0', 0.5); fill(p, '#2c8a52', P(m, [[0.12, 0.05], [0.18, 0.05], [0.18, 0.12], [0.12, 0.12]]));
  stroke(p, '2B', '#f6faf0', 2.2, P(m, [[-0.2, 0.085], [-0.1, 0.085]]), 0.01); stroke(p, '2B', '#f6faf0', 2.2, P(m, [[-0.13, 0.12], [-0.095, 0.085], [-0.13, 0.05]]), 0.01);
};
export const extCabinet = (p: Painter, m: M) => { // red wall box with a cylinder behind a glass panel
  drop(p, m, [[-0.16, 0], [0.16, 0], [0.16, 0.7], [-0.16, 0.7]], 0.018, 80);
  box(p, m, -0.16, 0, 0.16, 0.7, '#9d3328');
  glazeM(p, '#ff8f7a', 60, P(m, [[-0.16, 0.35], [-0.08, 0.35], [-0.08, 0.7], [-0.16, 0.7]]), 0.3, 0.5);
  box(p, m, -0.1, 0.1, 0.1, 0.6, '#27302f', 0.7);
  fill(p, '#c2352a', P(m, [[-0.05, 0.14], [0.05, 0.14], [0.05, 0.5], [-0.05, 0.5]])); fill(p, '#1d1d1c', P(m, [[-0.03, 0.5], [0.03, 0.5], [0.03, 0.54], [-0.03, 0.54]]));
  stroke(p, 'HB', '#d6d6cc', 1.2, P(m, [[0.0, 0.5], [0.07, 0.54], [0.08, 0.46]]), 0.3);
  tint(p, '#e0f0f8', 70, P(m, [[-0.1, 0.4], [-0.01, 0.4], [-0.07, 0.6], [-0.1, 0.6]])); // glass glint
  box(p, m, -0.07, 0.65, 0.07, 0.69, '#e8e0cc', 0.4); stroke(p, 'HB', '#6a5a4a', 0.6, P(m, [[-0.05, 0.67], [0.05, 0.67]]), 0.01);
  stroke(p, '2B', '#e8e0cc', 1.4, P(m, [[0.12, 0.3], [0.12, 0.4]]), 0.02); // handle
};
export const ventGrille = (p: Painter, m: M) => { // ceiling vent: frame + slats + dust
  const q: [number, number][] = [[-0.3, 0], [0.3, 0], [0.3, 0.3], [-0.3, 0.3]];
  fill(p, '#c9c6b8', P(m, q)); outline(p, P(m, q), '#6b665a', 0.8);
  for (let i = 0; i < 7; i++) { stroke(p, '2B', '#4b4a42', 1.6, P(m, [[-0.27, 0.035 + i * 0.037], [0.27, 0.035 + i * 0.037]]), 0.01); stroke(p, 'HB', '#f4f0e0', 0.8, P(m, [[-0.27, 0.045 + i * 0.037], [0.27, 0.045 + i * 0.037]]), 0.01); }
  glazeM(p, '#4b4a42', 60, P(m, [[-0.3, 0.0], [-0.1, 0.0], [-0.1, 0.3], [-0.3, 0.3]]), 0.4, 0.6);
  glazeM(p, '#6b5a3c', 45, P(m, [[0.2, 0.0], [0.34, 0.0], [0.32, -0.06], [0.2, -0.04]]), 0.4, 0.5); // grime streak below
};
export const mailSlot = (p: Painter, m: M) => {
  box(p, m, -0.13, 0, 0.13, 0.05, '#b99a54', 0.6); box(p, m, -0.1, 0.012, 0.1, 0.03, '#2a2218', 0.4);
  tint(p, '#fff1b0', 60, P(m, [[-0.13, 0.03], [0.0, 0.03], [-0.02, 0.05], [-0.13, 0.05]]));
};
export const tubeLight = (p: Painter, m: M, glow = 70) => { // wall-mounted fluorescent tube with housing
  tint(p, '#f4f6d8', glow * 0.5, P(m, [[-0.75, -0.14], [0.75, -0.14], [0.65, 0.14], [-0.65, 0.14]]));
  box(p, m, -0.6, 0, 0.6, 0.05, '#cfcdbd', 0.7); box(p, m, -0.56, 0.005, 0.56, 0.04, '#fbfbec', 0.3);
  [-0.6, 0.6].forEach((x) => box(p, m, x - 0.02, -0.005, x + 0.02, 0.055, '#8a8878', 0.5));
};
export const doorFurniture = (p: Painter, m: M) => { /* reserved */ void p; void m; };

/** Hand-painted door leaf on a quad: wood-grain panels, bevels, scuffs, kick-plate wear; used by the corridor and the room doors. */
export const doorLeaf = (p: Painter, q: Pt[], base: string, seed: number, o: {panels?: boolean; frame?: string; grainN?: number} = {}) => {
  woodGrain(p, q, base, seed, 'v', o.grainN ?? 22);
  if (o.panels !== false) {
    const pn = [[0.14, 0.07, 0.86, 0.46], [0.14, 0.53, 0.86, 0.94]];
    pn.forEach(([u0, v0, u1, v1], i) => {
      const r = [bil(q, u0, v0), bil(q, u1, v0), bil(q, u1, v1), bil(q, u0, v1)];
      glazeM(p, mixColor(base, '#2a1c10', 0.3), 90, r, 0.2, 0.4);
      outline(p, r, mixColor(base, '#2a1c10', 0.65), 0.9);
      stroke(p, 'HB', mixColor(base, '#fff3d6', 0.6), 1.3, [bil(q, u0, v0 + 0.004), bil(q, u1, v0 + 0.004)], 0.01); void i;
    });
  }
  const kick = [bil(q, 0, 0.93), bil(q, 1, 0.93), bil(q, 1, 1), bil(q, 0, 1)];
  glazeM(p, '#2a1c10', 70, kick, 0.3, 0.6);
  for (let i = 0; i < 7; i++) stroke(p, 'HB', '#f0e4c8', 0.8, [bil(q, 0.1 + 0.8 * H(seed + i), 0.94 + 0.05 * H(seed + i + 9)), bil(q, 0.12 + 0.8 * H(seed + i), 0.96 + 0.04 * H(seed + i + 9))], 0.1);
};
export const _unused = {ring};

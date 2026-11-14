import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {paintBox, qx, qy, qz, wFill, wInk, wp, type Box, type Item} from '../kit/world';
import {cardAt, cp, cps, lit, type Light, type Painter, type Pt, type V3, type YCam} from './core';

// SET-GRANARY (N16-04 R2, EDU-EP16 shots 13-14; Boss, 14 Nov 2026): the raised Isan granary (yung khao) seen from the yard, and the paddy heap inside it.
// Space VIL in metres (as village.ts). Footprint x 6.5..9 by z -9.5..-7, floor y 0.6, plank walls to y 2.6, gable zinc roof to y 3.9 (ridge along x at z -8.25).
// Double doors in the front wall (z -7): x 7.2..8.3, y 0.6..2.2 (1.6 m), hinged at the outer jambs, opening INWARD (-z). Three-step ladder at x 7.55..7.95.
// `open` 0..1 swings both leaves from shut to 100 deg; the doorway then shows the dark interior, the golden paddy heap and its spill over the threshold.
// The same heap is `paddyHeapItem` for the interior camera (shot 13 inside view), so the picture seen from outside and from inside is one asset.

export const GC = {
  plank: '#8a6446', plankDark: '#5e402c', plankPale: '#b08a62', zinc: '#a2a8a8', zincDark: '#6d7476', rust: '#8a5a3a', inside: '#2a1d12', insideLit: '#4a3622',
  paddy: '#dcb83e', paddyLight: '#f0d466', paddyDark: '#a8832a', husk: '#8a6a22', ink: '#2b211c',
} as const;
export const GRANARY = {x0: 6.5, x1: 9, z0: -9.5, z1: -7, floor: 0.6, wall: 2.6, ridge: 3.9, door: {x0: 7.2, x1: 8.3, h: 1.6}, ladderX: [7.55, 7.95] as [number, number]} as const;

const T = (L: Light, col: string, d = 0) => lit(L, col, d);
const wp3 = (c: YCam, pts: V3[]) => wp(c, pts);
/** One door leaf's four corners at open amount `k`: hinged at (hx, z1), `dir` +1 = swings toward +x (the left leaf), -1 = toward -x. */
export const leafCorners = (hx: number, dir: 1 | -1, k: number, w: number, y0: number, y1: number, z = GRANARY.z1): V3[] => {
  const a = k * (100 * Math.PI) / 180, tx = hx + dir * w * Math.cos(a), tz = z - w * Math.sin(a);
  return [[hx, y0, z], [tx, y0, tz], [tx, y1, tz], [hx, y1, z]];
};

/** Paddy mound as a card at a ground point (m): half-width `r`, height `h`; `spill` m of grain fanned toward the camera side. Drawn as one silhouette with value bands and grain ticks, seeded so it is the same in every call. */
export const paintPaddyMound = (p: Painter, c: YCam, at: V3, r: number, h: number, L: Light, seed = 53000, o: {spill?: number; clipY?: number} = {}) => {
  const k = cardAt(c, at, 1);
  if (!k) return null;
  const N = 28, top: [number, number][] = [];
  for (let i = 0; i <= N; i++) { const x = -r + (2 * r * i) / N, u = Math.abs(x) / r; top.push([x + 0.04 * r * Math.sin(i * 1.7), h * Math.max(0, 1 - Math.pow(u, 1.7)) * (0.97 + 0.05 * hash(seed + i))]); }
  const sp = o.spill ?? 0;
  const base: [number, number][] = sp > 0 ? [[r, 0], [r + sp * 0.5, 0.0], [-r - sp * 0.4, 0.0], [-r, 0]] : [[r, 0], [-r, 0]];
  hardFill(p, seed, T(L, GC.paddyDark), cps(k, [...top, ...base]));
  // lit left-upper half, mid band, and a shadow wedge at the right foot
  const half = top.filter(([x]) => x < 0.15 * r);
  hardFill(p, seed + 1, T(L, GC.paddy), cps(k, [...half, [0.15 * r, 0], [-r * 0.98, 0]]));
  hardFill(p, seed + 2, T(L, GC.paddyLight), cps(k, [...top.filter(([x]) => x < -0.1 * r).map(([x, y]) => [x * 0.92, y * 0.97] as [number, number]), [-0.1 * r, h * 0.45], [-r * 0.5, h * 0.3]]));
  hardFill(p, seed + 3, T(L, mixColor(GC.paddyDark, '#2a1a08', 0.35)), cps(k, [[r * 0.55, h * 0.3], ...top.filter(([x]) => x > 0.55 * r), [r, 0], [r * 0.55, 0]]));
  // grain ticks: short strokes down the slope
  const nT = Math.round(900 * r * (h + 0.2));
  for (let i = 0; i < nT; i++) {
    const x = (hash(seed + 100 + i) * 2 - 1) * r * 0.95, yMax = h * Math.max(0, 1 - Math.pow(Math.abs(x) / r, 1.7)), y = yMax * Math.sqrt(hash(seed + 300 + i)) * 0.97;
    if (o.clipY !== undefined && y > o.clipY) continue;
    const a = cp(k, x, y), l = 0.011 * k.u, hv = hash(seed + 500 + i), col = hv > 0.66 ? GC.paddyLight : hv > 0.33 ? GC.husk : GC.paddy;
    hardFill(p, seed + 5000 + i, T(L, col), [a, [a[0] + l * 1.3, a[1] + l * 0.3], [a[0] + l * 0.9, a[1] + l * 0.9], [a[0] - l * 0.2, a[1] + l * 0.7]]);
  }
  // spill: scattered grains fanned on the floor
  for (let i = 0; i < Math.round(sp * 26); i++) {
    const x = r * 0.4 + sp * 0.9 * hash(seed + 700 + i) * (i % 2 ? 1 : -1.1), yy = 0.02 * hash(seed + 800 + i);
    hardFill(p, seed + 2000 + i, T(L, i % 3 ? GC.paddy : GC.paddyLight), [cp(k, x - 0.012, yy), cp(k, x + 0.012, yy + 0.004), cp(k, x, yy + 0.022)]);
  }
  return k;
};
/** Paddy heap as a depth-sorted item (interior camera, or any view of the heap). */
export const paddyHeapItem = (at: V3, r: number, h: number, L: Light, seed = 53000, o: {spill?: number} = {}): Item => ({at, draw: (p, c) => { paintPaddyMound(p, c, at, r, h, L, seed, o); }});

export type GranaryOpts = {open?: number; heap?: boolean};
/** The granary exterior as sorted items for `paintVillage` (or any set): posts with rat guards, plank walls, double doors at `open`, ladder, gable zinc roof; with `heap` the doorway shows the interior and the heap spilling over the sill. */
export const granaryExterior = (L: Light, o: GranaryOpts = {}): Item[] => {
  const k = Math.max(0, Math.min(1, o.open ?? 0)), G = GRANARY, dw = (G.door.x1 - G.door.x0) / 2, y0 = G.floor, y1 = G.floor + G.door.h, S = 11200;
  const items: Item[] = [];
  const box = (b: Box, col: string, seed: number, ink = true) => (p: Painter, c: YCam) => paintBox(p, c, seed, b, T(L, col), {top: -0.08, left: 0.12, right: 0.24, front: 0.04, back: 0.18}, {ink, grain: 40});
  // posts (4 corners + 2 under the door) with a round rat guard disc each
  for (const [x, z] of [[6.6, -9.4], [8.9, -9.4], [6.6, -7.1], [7.75, -7.1], [8.9, -7.1]] as const) items.push({at: [x, 0, z], draw: (p, c) => {
    box({x0: x - 0.1, x1: x + 0.1, y0: 0, y1: y0, z0: z - 0.1, z1: z + 0.1}, GC.plankDark, S + Math.round(x * 10 - z))(p, c);
    const ring = wp3(c, Array.from({length: 14}, (_, i): V3 => [x + 0.27 * Math.cos((i / 14) * 6.283), 0.36, z + 0.27 * Math.sin((i / 14) * 6.283)]));
    if (ring.length > 3) { hardFill(p, S + 60 + Math.round(x * 10 - z), T(L, GC.zincDark), ring); }
  }});
  // body: floor beam, walls, plank lines, door frame, doors, ladder
  items.push({at: [7.75, 0, -8.2], bias: -0.3, draw: (p, c) => {
    box({x0: G.x0 - 0.05, x1: G.x1 + 0.05, y0: y0 - 0.14, y1: y0, z0: G.z0 - 0.05, z1: G.z1 + 0.05}, GC.plankDark, S + 100)(p, c);
    box({x0: G.x0, x1: G.x1, y0: y0, y1: G.wall, z0: G.z0, z1: G.z1}, GC.plank, S + 120, false)(p, c);
    // front wall planks: vertical boards with value jitter, then horizontal battens
    for (let x = G.x0; x < G.x1 - 0.01; x += 0.125) {
      if (x + 0.125 > G.door.x0 && x < G.door.x1) continue;
      const j = hash(S + Math.round(x * 100));
      wFill(p, c, S + 200 + Math.round(x * 100), mixColor(T(L, GC.plank), T(L, j > 0.5 ? GC.plankPale : GC.plankDark), 0.12 + 0.2 * j), qz(G.z1 + 0.005, x, x + 0.118, y0, G.wall));
    }
    for (const y of [0.9, 1.5, 2.1]) wFill(p, c, S + 300 + Math.round(y * 10), T(L, GC.plankDark, 0.05), qz(G.z1 + 0.012, G.x0, G.x1, y, y + 0.07));
    // side wall (right) boards
    for (let z = G.z0; z < G.z1 - 0.01; z += 0.125) wFill(p, c, S + 400 + Math.round(z * 100), mixColor(T(L, GC.plank, 0.2), T(L, GC.plankDark, 0.2), 0.3 * hash(S + 400 + z * 7)), qx(G.x1 + 0.005, y0, G.wall, z, z + 0.118));
    // door frame (jambs + lintel + sill), 8 cm
    const df = T(L, GC.plankDark);
    wFill(p, c, S + 500, df, qz(G.z1 + 0.02, G.door.x0 - 0.08, G.door.x0, y0, y1 + 0.08));
    wFill(p, c, S + 501, df, qz(G.z1 + 0.02, G.door.x1, G.door.x1 + 0.08, y0, y1 + 0.08));
    wFill(p, c, S + 502, df, qz(G.z1 + 0.02, G.door.x0 - 0.08, G.door.x1 + 0.08, y1, y1 + 0.08));
    wFill(p, c, S + 503, T(L, GC.plankPale, 0.05), qy(y0 + 0.012, G.door.x0 - 0.08, G.door.x1 + 0.08, G.z1 - 0.02, G.z1 + 0.14));   // sill (threshold) a little proud of the wall
    // doorway: dark interior with a lit back wall; heap + spill when asked
    const hole = qz(G.z1 - 0.001, G.door.x0, G.door.x1, y0, y1);
    if (k > 0.02) {
      wFill(p, c, S + 510, T(L, GC.inside), hole);
      wFill(p, c, S + 511, T(L, GC.insideLit, 0.0), qz(G.z0 + 0.1, G.door.x0, G.door.x1, y0, y1).map(([x, y, z]) => [x, y, z + (G.z1 - G.z0) * 0.55] as V3));
      if (o.heap) {
        const cx = (G.door.x0 + G.door.x1) / 2, kk = cardAt(c, [cx, y0 + 0.002, G.z1 - 0.34], 1);
        if (kk) paintPaddyMound(p, c, [cx, y0 + 0.002, G.z1 - 0.34], dw * 0.98, 1.0, L, 53100, {spill: 0.25, clipY: 1.0});
        // spill over the sill and down toward the ladder: grains on the sill and a tongue on the ground
        const tongue = wp3(c, [[cx - 0.25, y0 + 0.02, G.z1 - 0.34], [cx + 0.25, y0 + 0.02, G.z1 - 0.34], [cx + 0.18, y0 + 0.016, G.z1 + 0.16], [cx - 0.18, y0 + 0.016, G.z1 + 0.16]]);
        if (tongue.length > 3) hardFill(p, S + 520, T(L, GC.paddy), tongue);
        for (let i = 0; i < 26; i++) { const gx = cx + (hash(S + 530 + i) - 0.5) * 0.7, gz = G.z1 + 0.02 + 0.28 * hash(S + 560 + i), q = wp3(c, [[gx, y0 + 0.02, gz], [gx + 0.025, y0 + 0.02, gz], [gx + 0.012, y0 + 0.032, gz]]); if (q.length > 2) hardFill(p, S + 600 + i, T(L, i % 3 ? GC.paddy : GC.paddyLight), q); }
      }
    } else wFill(p, c, S + 510, T(L, GC.plankDark, 0.08), hole);
    // leaves
    const lcol = T(L, GC.plankPale, -0.02), ldk = T(L, GC.plankDark, 0.1);
    for (const [hx, dir, i] of [[G.door.x0, 1, 0], [G.door.x1, -1, 1]] as const) {
      const q = leafCorners(hx, dir, k, dw, y0, y1);
      wFill(p, c, S + 700 + i * 20, lcol, q);
      if (k < 0.55) for (const f of [0.25, 0.5, 0.75]) { const a = q[0], b = q[1], t = f; wInk(p, c, S + 701 + i * 20 + Math.round(f * 4), [[a[0] + (b[0] - a[0]) * t, y0, a[2] + (b[2] - a[2]) * t], [a[0] + (b[0] - a[0]) * t, y1, a[2] + (b[2] - a[2]) * t]], {closed: false, weight: 0.5, color: ldk}); }
      for (const y of [y0 + 0.3, y1 - 0.3]) wFill(p, c, S + 710 + i * 20 + Math.round(y * 10), ldk, [[q[0][0], y, q[0][2]], [q[1][0], y, q[1][2]], [q[1][0], y + 0.08, q[1][2]], [q[0][0], y + 0.08, q[0][2]]]);
      wInk(p, c, S + 730 + i, q, {weight: 0.8, color: T(L, GC.plankDark, 0.3)});
    }
    if (k < 0.3) { // shut: a wooden bar latch across both leaves
      wFill(p, c, S + 760, T(L, GC.plankDark, 0.2), qz(G.z1 + 0.04, G.door.x0 + 0.05, G.door.x1 - 0.05, y0 + 0.78, y0 + 0.86));
    }
    // ladder: two rails and three rungs at the door sill
    const [lx0, lx1] = G.ladderX, lz = -6.7;
    for (const lx of [lx0, lx1]) wFill(p, c, S + 800 + Math.round(lx * 10), T(L, GC.plankDark), [[lx - 0.035, 0, lz + 0.35], [lx + 0.035, 0, lz + 0.35], [lx + 0.035, y0 + 0.06, lz - 0.02], [lx - 0.035, y0 + 0.06, lz - 0.02]]);
    for (let i = 1; i <= 3; i++) { const t = i / 4, yy = y0 * t + 0.02, zz = lz + 0.35 - 0.35 * t; wFill(p, c, S + 820 + i, T(L, GC.plankPale), [[lx0 - 0.03, yy, zz + 0.04], [lx1 + 0.03, yy, zz + 0.04], [lx1 + 0.03, yy + 0.04, zz - 0.04], [lx0 - 0.03, yy + 0.04, zz - 0.04]]); }
  }});
  // roof: gable, zinc front slope with corrugation, overhang, ridge cap; rust streaks; plank gable ends
  items.push({at: [7.75, 0, -8.2], bias: -1.2, draw: (p, c) => {
    const ez0 = G.z0 - 0.5, ez1 = G.z1 + 0.55, xa = G.x0 - 0.35, xb = G.x1 + 0.35, ey = G.wall - 0.05, ry = G.ridge, rz = (G.z0 + G.z1) / 2;
    wFill(p, c, S + 900, T(L, GC.plankPale, 0.1), [[xb - 0.2, ey + 0.05, ez1 - 0.45], [xb - 0.2, ry - 0.05, rz], [xb - 0.2, ey + 0.05, ez0 + 0.45]]);   // right gable board (inside the eave)
    if (c.y > ey) wFill(p, c, S + 901, T(L, GC.zincDark), [[xa, ey, ez0], [xb, ey, ez0], [xb, ry, rz], [xa, ry, rz]]);   // far slope (seen from above)
    else {   // seen from below: the soffit boards under the eave
      wFill(p, c, S + 901, T(L, GC.plankDark, 0.05), qy(ey - 0.02, xa, xb, G.z1, ez1));
      for (let x = xa + 0.1; x < xb; x += 0.12) wInk(p, c, S + 905 + Math.round(x * 20), [[x, ey - 0.02, G.z1], [x, ey - 0.02, ez1]], {closed: false, weight: 0.3, color: T(L, GC.plankDark, 0.3)});
    }
    const front: V3[] = [[xa, ey, ez1], [xb, ey, ez1], [xb, ry, rz], [xa, ry, rz]];
    wFill(p, c, S + 902, T(L, GC.zinc), front);
    const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    for (let x = xa + 0.1; x < xb; x += 0.1) wInk(p, c, S + 910 + Math.round(x * 20), [[x, ey, ez1], [x, ry, rz]], {closed: false, weight: 0.3, color: T(L, GC.zincDark, 0.05)});
    for (let i = 0; i < 9; i++) {   // rust streaks down the slope
      const x = xa + (xb - xa) * hash(S + 950 + i), a = lerp3([x, ry, rz], [x, ey, ez1], 0.15 + 0.2 * hash(S + 970 + i)), b = lerp3([x, ry, rz], [x, ey, ez1], 0.55 + 0.4 * hash(S + 990 + i));
      const q = wp3(c, [[a[0] - 0.05, a[1], a[2]], [a[0] + 0.05, a[1], a[2]], [b[0] + 0.02, b[1], b[2]], [b[0] - 0.02, b[1], b[2]]]); if (q.length > 3) washAt(p, S + 1000 + i, GC.rust, 55, q, 0.2, 0.4);
    }
    wFill(p, c, S + 1020, T(L, GC.zincDark, 0.25), [[xa, ry + 0.03, rz + 0.12], [xb, ry + 0.03, rz + 0.12], [xb, ry + 0.03, rz - 0.12], [xa, ry + 0.03, rz - 0.12]]);   // ridge cap
    wInk(p, c, S + 1030, front, {weight: 0.9, color: T(L, GC.zincDark, 0.35)});
    wFill(p, c, S + 1040, T(L, GC.plankDark, 0.2), [[xa, ey, ez1 - 0.02], [xb, ey, ez1 - 0.02], [xb, ey - 0.07, ez1 - 0.02], [xa, ey - 0.07, ez1 - 0.02]]);   // eave board under the front edge
  }});
  return items;
};
/** Pixel-space ink handle for tests: the doorway polygon in the picture for the current camera (or null when behind the lens). */
export const doorwayPoly = (c: YCam): Pt[] => wp(c, qz(GRANARY.z1, GRANARY.door.x0, GRANARY.door.x1, GRANARY.floor, GRANARY.floor + GRANARY.door.h));
void inkLine;

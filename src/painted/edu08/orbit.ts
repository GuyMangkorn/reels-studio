import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDepth, camPoly, camPoint, type YCam} from '../kit/ycam';

// EDU-EP08-SHORT SET-ORBIT (brief EDU-EP08-BRIEF-R1.1 set plan, N2). LOOK-FRAME CODE. Metres: origin on the handrail under AST's tether
// clip, +x along the truss away from the airlock, +y local zenith, +z out from the truss toward the usual camera side; Earth at -y.
// Painted back to front: airlock module + open hatch, radiator panel, truss (pale faces, ink chords), handrail and standoffs, tether.

export const SUN: V3 = (() => { const v: V3 = [-0.6, 0.55, 0.58], n = Math.hypot(...v); return [v[0] / n, v[1] / n, v[2] / n]; })();
export const OC = {
  alu: '#c7ccd3', aluSh: '#6c7787', rail: '#e0b23a', railSh: '#9a7420', skin: '#e6e8ea', seam: '#a3adb9', rad: '#d8dde3', hatchIn: '#1a2233', hatchRing: '#d8e4f0',
};
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** Lit / shade mix for a face with normal `n`: sun key plus a blue Earthshine from below. */
export const shadeFace = (n: V3, lit: string, dark: string, sun = SUN): string => {
  const k = Math.max(0, dot(n, sun)), es = Math.max(0, -n[1]) * 0.35;
  return mixColor(mixColor(dark, lit, Math.min(1, 0.15 + 0.85 * k)), '#7fb2e6', es * (1 - k));
};
const fillW = (p: Painter, c: YCam, seed: number, color: string, pts: V3[]) => { const q = camPoly(c, pts); if (q.length >= 3) hardFill(p, seed, color, q); };
const lineW = (p: Painter, c: YCam, id: number, a: V3, b: V3, o: {color?: string; weight?: number} = {}) => {
  const n = 6, pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const v: V3 = [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, a[2] + (b[2] - a[2]) * i / n]; if (camDepth(c, v) > 0.35) { const q = camPoint(c, v); if (q) pts.push(q); } }
  if (pts.length >= 2) inkLine(p, id, pts, {closed: false, curve: 0, weight: o.weight ?? 1, color: o.color, still: true});
};
/** A tube between a and b of diameter dia (m) as a flat strip facing the camera, with a lit edge. */
const tube = (p: Painter, c: YCam, seed: number, a: V3, b: V3, dia: number, col: string, sh: string, n = 8) => {
  for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n;
    const A: V3 = [a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0, a[2] + (b[2] - a[2]) * u0], B: V3 = [a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1, a[2] + (b[2] - a[2]) * u1];
    const qa = camPoint(c, A), qb = camPoint(c, B);
    if (!qa || !qb || camDepth(c, A) < 0.4 || camDepth(c, B) < 0.4) continue;
    const wa = (c.f * dia) / camDepth(c, A) / 2, wb = (c.f * dia) / camDepth(c, B) / 2;
    const dx = qb[0] - qa[0], dy = qb[1] - qa[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    hardFill(p, seed + i, sh, [[qa[0] + nx * wa, qa[1] + ny * wa], [qb[0] + nx * wb, qb[1] + ny * wb], [qb[0] - nx * wb, qb[1] - ny * wb], [qa[0] - nx * wa, qa[1] - ny * wa]]);
    const s1 = ny > 0 ? -1 : 1; // lit half on the upper side of the strip
    hardFill(p, seed + 50 + i, col, [[qa[0], qa[1]], [qb[0], qb[1]], [qb[0] + s1 * nx * wb, qb[1] + s1 * ny * wb], [qa[0] + s1 * nx * wa, qa[1] + s1 * ny * wa]]);
  }
};

export type OrbitOpts = {t: number; radiator?: boolean; hatchOpen?: number; tether?: {from: V3}; truss?: boolean};

/** The airlock module (cylinder along z with the outer hatch on its +z end cap) and the radiator panel. */
export const paintModule = (p: Painter, c: YCam, o: OrbitOpts) => {
  const cx = -4.5, cy = 0.7, R = 1.1, z0 = -2.6, z1 = -0.4, N = 20, id = 8100;
  // radiator panel (behind / above), off unless asked (it read as a floating slab in LF01 v1)
  if (o.radiator) {
  fillW(p, c, id, shadeFace([0, 1, 0], OC.rad, '#7d8796'), [[-2.5, 2.6, -4.5], [-0.5, 2.6, -4.5], [-0.5, 2.6, -2.0], [-2.5, 2.6, -2.0]]);
  fillW(p, c, id + 1, '#8792a1', [[-2.5, 2.6, -2.0], [-0.5, 2.6, -2.0], [-0.5, 2.7, -2.0], [-2.5, 2.7, -2.0]]);
  for (let k = 1; k < 8; k++) lineW(p, c, id + 10 + k, [-2.5 + k * 0.25, 2.61, -4.5], [-2.5 + k * 0.25, 2.61, -2.0], {weight: 0.6, color: '#8a95a3'});
  }
  // cylinder facets, far ones first
  const facets = Array.from({length: N}, (_, i) => {
    const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2;
    const n: V3 = [Math.cos(am), Math.sin(am), 0];
    const pts: V3[] = [[cx + R * Math.cos(a0), cy + R * Math.sin(a0), z0], [cx + R * Math.cos(a1), cy + R * Math.sin(a1), z0], [cx + R * Math.cos(a1), cy + R * Math.sin(a1), z1], [cx + R * Math.cos(a0), cy + R * Math.sin(a0), z1]];
    const mid: V3 = [cx + R * n[0], cy + R * n[1], (z0 + z1) / 2];
    return {i, n, pts, d: camDepth(c, mid)};
  }).sort((a, b) => b.d - a.d);
  for (const f of facets) {
    const toCam: V3 = [c.x - (cx + R * f.n[0]), c.y - (cy + R * f.n[1]), c.z - (z0 + z1) / 2];
    if (dot(toCam, f.n) < 0) continue;
    fillW(p, c, id + 100 + f.i, shadeFace(f.n, OC.skin, '#5f6a7a'), f.pts);
    // quilted seams along the length
    lineW(p, c, id + 200 + f.i, f.pts[0], f.pts[3], {weight: 0.5, color: OC.seam});
  }
  for (const zz of [-2.2, -1.6, -1.0]) {
    const ring: V3[] = Array.from({length: N + 1}, (_, i) => [cx + R * Math.cos((i / N) * Math.PI * 2), cy + R * Math.sin((i / N) * Math.PI * 2), zz]);
    for (let i = 0; i < N; i++) { const m: V3 = [(ring[i][0] + ring[i + 1][0]) / 2, (ring[i][1] + ring[i + 1][1]) / 2, zz]; const n: V3 = [m[0] - cx, m[1] - cy, 0]; if (dot([c.x - m[0], c.y - m[1], c.z - zz], n) > 0) lineW(p, c, id + 300 + i + zz * 100, ring[i], ring[i + 1], {weight: 0.55, color: OC.seam}); }
  }
  // end cap (+z) with the hatch opening
  const cap: V3[] = Array.from({length: N}, (_, i) => [cx + R * Math.cos((i / N) * Math.PI * 2), cy + R * Math.sin((i / N) * Math.PI * 2), z1]);
  if (c.z > z1) {
    fillW(p, c, id + 400, shadeFace([0, 0, 1], OC.skin, '#5f6a7a'), cap);
    const ringO: V3[] = Array.from({length: 28}, (_, i) => [cx + 0.58 * Math.cos((i / 28) * Math.PI * 2), cy + 0.58 * Math.sin((i / 28) * Math.PI * 2), z1 + 0.01]);
    const hole: V3[] = Array.from({length: 28}, (_, i) => [cx + 0.5 * Math.cos((i / 28) * Math.PI * 2), cy + 0.5 * Math.sin((i / 28) * Math.PI * 2), z1 + 0.01]);
    fillW(p, c, id + 401, '#9aa6b5', ringO);
    fillW(p, c, id + 402, OC.hatchIn, hole);
    // the light ring inside the hatch (interior panel light)
    const inner: V3[] = Array.from({length: 28}, (_, i) => [cx + 0.42 * Math.cos((i / 28) * Math.PI * 2), cy + 0.42 * Math.sin((i / 28) * Math.PI * 2), z1 - 0.3]);
    fillW(p, c, id + 403, OC.hatchRing, inner);
    fillW(p, c, id + 404, mixColor(OC.hatchIn, '#000000', 0.2), inner.map(([x, y, z]): V3 => [cx + (x - cx) * 0.7, cy + (y - cy) * 0.7, z - 0.2]));
    const q = camPoly(c, ringO); if (q.length > 3) inkLine(p, id + 405, q, {weight: 1});
    // the door, hinged on the -x edge, open `hatchOpen` (default 100 deg)
    const phi = ((o.hatchOpen ?? 100) * Math.PI) / 180, hx = cx - 0.525, rr = 0.525;
    const door: V3[] = Array.from({length: 24}, (_, i) => { const a = (i / 24) * Math.PI * 2, s = rr + rr * Math.cos(a), v = rr * Math.sin(a); return [hx + s * Math.cos(phi), cy + v, z1 + 0.04 + s * Math.sin(phi)]; });
    fillW(p, c, id + 410, shadeFace([Math.sin(phi), 0, -Math.cos(phi)], '#d9dde2', '#6a7483'), door);
    const dq = camPoly(c, door); if (dq.length > 3) inkLine(p, id + 411, dq, {weight: 1});
  }
  // silhouette edges of the cylinder
  for (const s of [-1, 1]) lineW(p, c, id + 420 + s, [cx, cy + s * R, z0], [cx, cy + s * R, z1], {weight: 0.9});
};

/** Truss (pale faces, ink lattice), gold handrail with standoffs, optional tether from AST's hip to the clip. */
export const paintTruss = (p: Painter, c: YCam, o: OrbitOpts) => {
  const id = 8500, xa = -7, xb = 9, y0 = -1.05, y1 = -0.05, z0 = -1.25, z1 = -0.25;
  if (o.truss !== false) {
    // open lattice (the Earth shows through): aluminium members as tubes, far chords first, a thin cable tray on the top face
    const m = 0.06, al = shadeFace([0, 0.6, 0.8], OC.alu, OC.aluSh), alD = mixColor(OC.aluSh, '#1a2233', 0.3);
    tube(p, c, id + 10, [xa, y0, z0], [xb, y0, z0], m, alD, alD, 24);
    tube(p, c, id + 40, [xa, y1, z0], [xb, y1, z0], m, al, OC.aluSh, 24);
    for (let x = xa; x <= xb; x += 1) {
      tube(p, c, id + 100 + (x - xa) * 3, [x, y0, z0], [x, y1, z0], m * 0.8, alD, alD, 2);
      tube(p, c, id + 200 + (x - xa) * 3, [x, y0, z0], [x, y0, z1], m * 0.8, alD, alD, 2);
      if (x < xb) { tube(p, c, id + 300 + (x - xa) * 3, [x, y0, z0], [x + 1, y1, z0], m * 0.6, alD, alD, 3); tube(p, c, id + 400 + (x - xa) * 3, [x, y0, z1], [x + 1, y0, z0], m * 0.6, alD, alD, 3); }
    }
    tube(p, c, id + 70, [xa, y0, z1], [xb, y0, z1], m, al, OC.aluSh, 24);
    fillW(p, c, id + 5, mixColor('#c9ced6', '#6c7787', 0.3), [[xa, y1 + 0.002, -0.85], [xb, y1 + 0.002, -0.85], [xb, y1 + 0.002, -0.65], [xa, y1 + 0.002, -0.65]]);
    for (let x = xa; x <= xb; x += 1) {
      tube(p, c, id + 500 + (x - xa) * 3, [x, y0, z1], [x, y1, z1], m * 0.8, al, OC.aluSh, 2);
      tube(p, c, id + 600 + (x - xa) * 3, [x, y1, z0], [x, y1, z1], m * 0.8, al, OC.aluSh, 2);
      if (x < xb) { tube(p, c, id + 700 + (x - xa) * 3, [x, y0, z1], [x + 1, y1, z1], m * 0.6, al, OC.aluSh, 3); tube(p, c, id + 800 + (x - xa) * 3, [x, y1, z1], [x + 1, y1, z0], m * 0.6, al, OC.aluSh, 3); }
    }
    tube(p, c, id + 900, [xa, y1, z1], [xb, y1, z1], m, al, OC.aluSh, 24);
  }
  // handrail standoffs and rail
  for (let x = -6; x <= 8; x += 1) tube(p, c, id + 300 + x * 2, [x, -0.05, -0.15], [x, 0.0, -0.15], 0.025, OC.aluSh, OC.aluSh, 1);
  tube(p, c, id + 400, [-6, 0, -0.15], [8, 0, -0.15], 0.035, OC.rail, OC.railSh, 28);
  if (o.tether) {
    const clip: V3 = [0.35, 0.0, -0.15], f = o.tether.from;
    const pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12, sag = Math.sin(Math.PI * u) * 0.18; const v: V3 = [f[0] + (clip[0] - f[0]) * u + sag * 0.3, f[1] + (clip[1] - f[1]) * u - sag, f[2] + (clip[2] - f[2]) * u]; const q = camPoint(c, v); if (q) pts.push(q); }
    if (pts.length > 2) inkLine(p, id + 500, pts, {closed: false, weight: 1.3, color: '#e9e4d6', curve: 0.4});
    const cq = camPoint(c, clip); if (cq) hardFill(p, id + 501, '#4a5262', [[cq[0] - 6, cq[1] - 5], [cq[0] + 6, cq[1] - 5], [cq[0] + 6, cq[1] + 6], [cq[0] - 6, cq[1] + 6]]);
  }
};

/** SET-ORBIT anchors (metres, brief unit table; origin on the handrail under AST's tether clip, +x along the truss away from the airlock). */
export const ORBIT = {
  /** Tether clip on the handrail. */
  clip: [0.35, 0.0, -0.15] as V3,
  /** Gold handrail line (a, b): the B6 `rail-tow` grip line. */
  rail: [[-6, 0, -0.15], [8, 0, -0.15]] as [V3, V3],
  /** Truss box x range and the lattice y/z bounds. */
  truss: {x: [-7, 9] as [number, number], y: [-1.05, -0.05] as [number, number], z: [-1.25, -0.25] as [number, number]},
  /** Airlock module: cylinder axis along z at (x, y), radius, z range; outer hatch on the +z cap, door Ø 1.05 hinged on the -x edge. */
  module: {x: -4.5, y: 0.7, R: 1.1, z: [-2.6, -0.4] as [number, number], hatchCentre: [-4.5, 0.7, -0.4] as V3, hatchOpening: 0.5},
  /** Far module (optional, `paintFarModule`): axis along x. */
  far: {x: [14, 21] as [number, number], y: 2.4, z: -13, R: 1.7},
};

/**
 * The far module: a distant pressurised module along x with one solar wing, far down the truss (opt-in; the look frames do not show it).
 * Vacuum has no haze, so it differs from the near module only by size and by a slightly cooler shade.
 */
export const paintFarModule = (p: Painter, c: YCam, seed = 8300) => {
  const {x: [xa, xb], y, z, R} = ORBIT.far, N = 14;
  // solar wing behind the module (a dark-blue panel with a lattice, edge on to the truss)
  const wy0 = y + R + 0.2, wy1 = y + R + 6.5;
  fillW(p, c, seed, '#26406e', [[xa + 1.2, wy0, z - 0.4], [xb - 1.2, wy0, z - 0.4], [xb - 1.2, wy1, z - 0.4], [xa + 1.2, wy1, z - 0.4]]);
  for (let k = 0; k <= 7; k++) lineW(p, c, seed + 1 + k, [xa + 1.2 + k * ((xb - xa - 2.4) / 7), wy0, z - 0.39], [xa + 1.2 + k * ((xb - xa - 2.4) / 7), wy1, z - 0.39], {weight: 0.6, color: '#7f9bd0'});
  lineW(p, c, seed + 10, [xa + 1.2, (wy0 + wy1) / 2, z - 0.39], [xb - 1.2, (wy0 + wy1) / 2, z - 0.39], {weight: 0.6, color: '#7f9bd0'});
  fillW(p, c, seed + 11, OC.aluSh, [[(xa + xb) / 2 - 0.1, y + R, z - 0.4], [(xa + xb) / 2 + 0.1, y + R, z - 0.4], [(xa + xb) / 2 + 0.1, wy0, z - 0.4], [(xa + xb) / 2 - 0.1, wy0, z - 0.4]]);
  const facets = Array.from({length: N}, (_, i) => {
    const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2, n: V3 = [0, Math.sin(am), Math.cos(am)];
    const pts: V3[] = [[xa, y + R * Math.sin(a0), z + R * Math.cos(a0)], [xb, y + R * Math.sin(a0), z + R * Math.cos(a0)], [xb, y + R * Math.sin(a1), z + R * Math.cos(a1)], [xa, y + R * Math.sin(a1), z + R * Math.cos(a1)]];
    return {i, n, pts, d: camDepth(c, [(xa + xb) / 2, y + R * n[1], z + R * n[2]])};
  }).sort((a, b) => b.d - a.d);
  for (const f of facets) {
    const toCam: V3 = [0, c.y - (y + R * f.n[1]), c.z - (z + R * f.n[2])];
    if (dot(toCam, f.n) < 0) continue;
    fillW(p, c, seed + 100 + f.i, shadeFace(f.n, mixColor(OC.skin, '#cfe0f2', 0.2), '#56627a'), f.pts);
  }
  for (const xx of [xa + 2.2, (xa + xb) / 2, xb - 2.2]) { // quilting bands
    const ring: V3[] = Array.from({length: N + 1}, (_, i) => [xx, y + R * Math.sin((i / N) * Math.PI * 2), z + R * Math.cos((i / N) * Math.PI * 2)]);
    for (let i = 0; i < N; i++) { const n: V3 = [0, ring[i][1] - y, ring[i][2] - z]; if (dot([0, c.y - ring[i][1], c.z - ring[i][2]], n) > 0) lineW(p, c, seed + 200 + i + xx * 3, ring[i], ring[i + 1], {weight: 0.5, color: OC.seam}); }
  }
};

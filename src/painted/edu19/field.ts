import {ell, INK, inkLine, solid, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, qy, wFill, wp, wWash, type Item} from '../kit/world';
import {camPoint, camSpace, camToPicture, camUnit, type YCam} from '../kit/ycam';

// EDU-EP19 SET-FIELD19 pieces (brief N1, set plan). Started at the W2.4 comp card (15 Nov 2026): the swing SW, the rain tree TR and the
// post-and-rail fence as elevation painters at their set-plan sizes (ground point `g` px, `unit` px per m). The world-space set with the
// yaw camera, lawn, sky and the three sun states is W3 (look frame LF01) on top of these.

export const SWING = {bar: 2.2, span: 1.2, depth: 1.6, seat: 0.45} as const;
export const TREE = {trunk: 0.8, fork: 2.2, canopyR: 4.5, canopyLo: 4, canopyHi: 7.5} as const;
export const FENCE = {h: 1.1, post: 2.0, gate: 1.2} as const;

const quad = (a: Pt, b: Pt, w: number): Pt[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * w / 2, ny = (dx / l) * w / 2;
  return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
};
const at = (g: Pt, unit: number, x: number, y: number): Pt => [g[0] + x * unit, g[1] - y * unit];

/** Steel A-frame swing seen from the lawn (+z): top bar 2.2 m, legs splayed, one rubber seat at 0.45 m on two chains, worn dirt under it. */
export const paintSwing = (p: Painter, seed: number, g: Pt, unit: number) => {
  const steel = '#6f8190', P = (x: number, y: number) => at(g, unit, x, y), w = Math.max(3, 0.06 * unit);
  washAt(p, seed, '#8a6f4e', 140, Array.from({length: 14}, (_, i): Pt => P(0.55 * Math.cos((i / 14) * Math.PI * 2), 0.04 * Math.sin((i / 14) * Math.PI * 2))), 0.25, 0.4);
  for (const sx of [-1, 1]) {
    solid(p, seed + 1 + sx, mixColor(steel, '#3a2a40', 0.22), quad(P(sx * 0.6, SWING.bar), P(sx * 0.82, 0), w * 0.9), 3, 0.04, 0.05); // far leg
    solid(p, seed + 4 + sx, steel, quad(P(sx * 0.6, SWING.bar), P(sx * 0.66, 0), w), 4, 0.04, 0.05);
  }
  solid(p, seed + 8, steel, quad(P(-0.72, SWING.bar), P(0.72, SWING.bar), w * 1.1), 4, 0.04, 0.05);
  for (const sx of [-0.2, 0.2]) inkLine(p, seed + 10 + sx * 10, [P(sx, SWING.bar), P(sx, SWING.seat + 0.02)], {closed: false, weight: 0.8, color: '#5a5f66', curve: 0});
  solid(p, seed + 14, '#2c2a2a', [P(-0.26, SWING.seat + 0.02), P(0.26, SWING.seat + 0.02), P(0.22, SWING.seat - 0.04), P(-0.22, SWING.seat - 0.04)], 4, 0.05, 0.05);
};

/** Rain tree (จามจุรี) seen from the lawn: trunk 0.8 m with flared roots, fork at 2.2 m into three limbs, umbrella canopy 9 m wide between 4 and
 * 7.5 m, a darker underside and lit top clumps (light from behind-left), dappled shade disc under it. */
export const paintTree = (p: Painter, seed: number, g: Pt, unit: number) => {
  const P = (x: number, y: number) => at(g, unit, x, y), bark = '#6b5a4a', leaf = '#5f7f3e', leafDark = '#3f5a36', leafLit = '#93a957';
  washAt(p, seed, '#2e4434', 110, Array.from({length: 22}, (_, i): Pt => P(4.2 * Math.cos((i / 22) * Math.PI * 2), 0.35 * Math.sin((i / 22) * Math.PI * 2))), 0.3, 0.5);
  // Canopy underside, then the clumps.
  const blob = (cx: number, cy: number, rx: number, ry: number, s: number): Pt[] => Array.from({length: 18}, (_, i): Pt => {
    const a = (i / 18) * Math.PI * 2, j = 0.82 + 0.3 * hash(s + i);
    return P(cx + rx * j * Math.cos(a), cy + ry * j * Math.sin(a));
  });
  solid(p, seed + 1, leafDark, blob(0, 4.9, 4.4, 1.1, seed + 2), 4, 0.15, 0.2);
  // Trunk, roots, limbs.
  solid(p, seed + 3, bark, [P(-0.55, 0), P(-0.36, 0.3), P(-0.32, TREE.fork), P(0.34, TREE.fork), P(0.38, 0.3), P(0.6, 0)], 4, 0.18, 0.12);
  for (const [x1, y1, w] of [[-2.4, 4.6, 0.32], [0.3, 5.0, 0.36], [2.6, 4.5, 0.3]] as const) solid(p, seed + 4 + x1 * 10, mixColor(bark, INK, 0.1), quad(P(x1 * 0.08, TREE.fork - 0.1), P(x1, y1), w * unit), 3, 0.1, 0.1);
  solid(p, seed + 9, mixColor(bark, '#3a2a40', 0.3), [P(0.1, 0.1), P(0.3, 0.2), P(0.26, TREE.fork - 0.2), P(0.08, TREE.fork - 0.4)], 3, 0.1, 0.1); // shade side (light from the left)
  const clumps: [number, number, number, number][] = [[-3.4, 5.6, 1.2, 0.8], [-1.8, 6.4, 1.4, 0.9], [0.2, 6.8, 1.6, 0.9], [2.1, 6.4, 1.4, 0.9], [3.5, 5.6, 1.1, 0.75], [-0.9, 5.6, 1.3, 0.7], [1.3, 5.5, 1.3, 0.7]];
  clumps.forEach(([cx, cy, rx, ry], i) => {
    solid(p, seed + 20 + i, leaf, blob(cx, cy, rx, ry, seed + 30 + i * 7), 4, 0.2, 0.2);
    washAt(p, seed + 40 + i, leafLit, 120, blob(cx - rx * 0.25, cy + ry * 0.25, rx * 0.55, ry * 0.45, seed + 50 + i * 7), 0.25, 0.4);
  });
  inkLine(p, seed + 70, [P(-0.55, 0), P(-0.36, 0.3), P(-0.32, TREE.fork)], {closed: false, weight: 0.8, color: mixColor(bark, INK, 0.5), curve: 0.2});
  inkLine(p, seed + 71, [P(0.6, 0), P(0.38, 0.3), P(0.34, TREE.fork)], {closed: false, weight: 0.8, color: mixColor(bark, INK, 0.5), curve: 0.2});
};

/** Low wooden post-and-rail fence, 1.1 m, posts every 2 m from `x0` to `x1` m (relative to `g`), the 1.2 m gate gap centred on x = 0 when `gate`. */
export const paintFence = (p: Painter, seed: number, g: Pt, unit: number, x0: number, x1: number, o: {gate?: boolean} = {}) => {
  const P = (x: number, y: number) => at(g, unit, x, y), wood = '#9a7a56', gap = o.gate ? FENCE.gate / 2 : -1;
  const spans: [number, number][] = o.gate ? [[x0, -gap], [gap, x1]] : [[x0, x1]];
  spans.forEach(([a, b], si) => {
    for (const y of [0.45, 0.95]) solid(p, seed + si * 10 + y * 10, mixColor(wood, '#3a2a40', 0.08), quad(P(a, y), P(b, y), 0.09 * unit), 3, 0.15, 0.05);
    for (let x = a, i = 0; x <= b + 1e-6; x += FENCE.post, i++) {
      solid(p, seed + 100 + si * 50 + i, wood, [P(x - 0.06, 0), P(x + 0.06, 0), P(x + 0.06, FENCE.h), P(x - 0.06, FENCE.h + 0.03)], 4, 0.15, 0.05);
      inkLine(p, seed + 200 + si * 50 + i, [P(x - 0.06, 0), P(x - 0.06, FENCE.h + 0.03), P(x + 0.06, FENCE.h), P(x + 0.06, 0)], {closed: false, weight: 0.6, color: mixColor(wood, INK, 0.5), curve: 0});
    }
  });
};

// ================================================================================================ SET-FIELD19 in world metres (W3, LF01)
// Space `F` (brief projection contract): origin M0 on the ground at the trail midpoint, +x toward the tree (screen right), +y up, +z toward
// the open lawn (camera side), fence at z -7. Seen through the kit yaw camera (`ycam.ts`). Back to front: sky, far trees and roof, fence,
// lawn (wash-flat base + sparse strokes, DF-20261030-p5brush-large-fill-mottle), shade, prints; then the depth-sorted items (tree, swing,
// gear, stack) together with the cast (`fieldItems` + the shot's actors through `paintSorted`).

/** Named set points (brief set plan). */
export const F = {
  M0: [0, 0, 0] as V3, TR: [6.0, 0, -0.4] as V3, G1: [6.75, 0, -0.45] as V3, GP: [6.45, 1.15, -0.05] as V3,
  SW: [-6.0, 0, 0] as V3, ST: [1.6, 0, -6.3] as V3, fenceZ: -7.0,
} as const;

/** Sun states (brief set plan "Light"): B01 gold 28 deg, B02 flatter and cooler 22 deg after the wait, B03 deep gold 18 deg (B03-B04). */
export type SunId = 'B01' | 'B02' | 'B03';
type Sun = {elev: number; skyTop: string; skyVia: string; skyLow: string; lit: string; shade: string; stripe: string; warm: string; far: string};
export const SUN: Record<SunId, Sun> = {
  B01: {elev: 28, skyTop: '#9fc3dc', skyVia: '#cfe0e2', skyLow: '#f3cfa6', lit: '#86a24c', shade: '#4f6b46', stripe: '#93ad55', warm: '#f2c27a', far: '#7f9a6a'},
  B02: {elev: 22, skyTop: '#a7c2d6', skyVia: '#d3dfdf', skyLow: '#ead2b4', lit: '#7f9a4f', shade: '#4d6648', stripe: '#8aa357', warm: '#e8c48e', far: '#7e966e'},
  B03: {elev: 18, skyTop: '#95b5d2', skyVia: '#e2d4bf', skyLow: '#f2b878', lit: '#8ea247', shade: '#4c6343', stripe: '#9cae4f', warm: '#f4b25e', far: '#86956a'},
};
/** Ground shadow offset per metre of height: away from the sun (behind-left, toward +x +z). */
/** A sun state between two keys (W5: B02-SH03 sweeps 28 -> 22 deg on the event clock): colours and elevation mixed by `u`, the shadow azimuth turned
 *  `az` degrees (the tree shade sweeps). A plain key draws exactly as before. */
export type SunRef = SunId | {from: SunId; to: SunId; u: number; az?: number};
const SUN_KEYS: (keyof Sun)[] = ['skyTop', 'skyVia', 'skyLow', 'lit', 'shade', 'stripe', 'warm', 'far'];
export const sunOf = (s: SunRef): Sun => {
  if (typeof s === 'string') return SUN[s];
  const a = SUN[s.from], b = SUN[s.to], u = Math.max(0, Math.min(1, s.u)), out = {elev: a.elev + (b.elev - a.elev) * u} as Sun;
  for (const k of SUN_KEYS) (out as Record<string, unknown>)[k] = mixColor(a[k] as string, b[k] as string, u);
  return out;
};
export const shadowStep = (sun: SunRef): [number, number] => {
  const k = 1 / Math.tan((sunOf(sun).elev * Math.PI) / 180);
  if (typeof sun === 'string' || !sun.az) return [0.707 * k, 0.707 * k];
  const a = Math.PI / 4 + (sun.az * Math.PI) / 180;
  return [Math.cos(a) * k, Math.sin(a) * k];
};

const rgt = (c: YCam): [number, number] => [Math.cos(c.yaw), Math.sin(c.yaw)];
/** Camera-facing billboard: local (u right, v up) metres to world points at `base`. */
export const bb = (c: YCam, base: V3, pts: [number, number][]): V3[] => { const [rx, rz] = rgt(c); return pts.map(([u, v]): V3 => [base[0] + rx * u, base[1] + v, base[2] + rz * u]); };
const horizonY = (c: YCam) => camToPicture(c, camSpace(c, [c.x + 1e4 * Math.sin(c.yaw), c.y, c.z - 1e4 * Math.cos(c.yaw)]))[1];
const lobe = (u: number, v: number, rx: number, ry: number, seed: number, n = 14): [number, number][] =>
  Array.from({length: n}, (_, i): [number, number] => { const a = (i / n) * 6.283, j = 1 + 0.18 * (hash(seed + i * 3.1) - 0.5); return [u + rx * j * Math.cos(a), v + ry * j * Math.sin(a)]; });
/** Ground ellipse (world points) at height y. */
export const ellWorld = (at: V3, rx: number, rz: number, n = 22, y = at[1]): V3[] => Array.from({length: n}, (_, i): V3 => [at[0] + rx * Math.cos((i / n) * 6.283), y, at[2] + rz * Math.sin((i / n) * 6.283)]);
const poly = (p: Painter, seed: number, color: string, q: Pt[], passes = 3, tex = 0.05, border = 0.12) => { if (q.length >= 3) solid(p, seed, color, q, passes, tex, border); };
const glz = (p: Painter, seed: number, color: string, op: number, q: Pt[]) => { if (q.length >= 3) washAt(p, seed, color, op, q, 0.1, 0.3); };

/** A soft ground shadow for an object of `h` m at `at`, footprint radii rx/rz, cast away from the sun. */
export const groundShadow = (p: Painter, c: YCam, seed: number, sun: SunRef, at: V3, rx: number, rz: number, h: number, op = 110) => {
  const [sx, sz] = shadowStep(sun), dx = sx * h * 0.5, dz = sz * h * 0.5;
  glz(p, seed, '#2c3f27', op, wp(c, ellWorld([at[0] + dx * 0.6, 0.004, at[2] + dz * 0.6], rx + Math.abs(dx) * 0.6, rz + Math.abs(dz) * 0.35, 18)));
  glz(p, seed + 1, '#1e2c1a', op * 0.7, wp(c, ellWorld([at[0], 0.005, at[2]], rx * 0.7, rz * 0.7, 14)));
};

const paintFar = (p: Painter, c: YCam, sun: Sun) => {
  // School roof far left (z -26), then mango / banana tree row 12-20 m behind the fence: soft lobes in two values, no ink.
  wFill(p, c, 7010, mixColor('#b98a6a', sun.far, 0.35), [[-24, 3.2, -26], [-10, 3.2, -26], [-11.5, 5.0, -26], [-22.5, 5.0, -26]]);
  wFill(p, c, 7011, mixColor('#d8cbb4', sun.far, 0.3), [[-23.5, 0, -26], [-10.5, 0, -26], [-10.5, 3.2, -26], [-23.5, 3.2, -26]]);
  for (let i = 0; i < 30; i++) {
    const x = -34 + i * 2.4 + hash(i * 2.2) * 1.6, z = -19 - hash(i * 3.9) * 8, h = 4 + hash(i * 4.1) * 3.5, r = 1.8 + hash(i * 1.7) * 1.4, banana = hash(i * 6.1) > 0.7;
    const col = mixColor(sun.far, mixColor(sun.shade, '#9fb39a', 0.4), 0.3 + 0.5 * hash(i * 9.1));
    if (banana) for (let k = 0; k < 5; k++) { const a = -1.2 + k * 0.6, q = wp(c, bb(c, [x, 0, z], [[0, h * 0.55], [Math.sin(a) * 2.2, h * 0.55 + Math.cos(a) * 1.4], [Math.sin(a) * 2.4 + 0.3, h * 0.55 + Math.cos(a) * 1.1]])); poly(p, 7100 + i * 8 + k, col, q, 2); }
    else poly(p, 7100 + i * 8, col, wp(c, bb(c, [x, 0, z], lobe(0, h - r * 0.8, r * 1.2, r, 700 + i))), 2, 0.04, 0.15);
  }
  wFill(p, c, 7400, mixColor(sun.far, sun.shade, 0.25), qy(0.001, -60, 60, -30, -18.5));
};

/** Post-and-rail fence along z -7, the gate gap x -0.6..0.6. */
const paintFenceW = (p: Painter, c: YCam, sun: Sun) => {
  const wood = mixColor('#9a7a56', sun.warm, 0.12), dark = mixColor(wood, '#3a2a40', 0.25), z = F.fenceZ;
  for (const [a, b] of [[-14, -0.6], [0.6, 14]] as const) {
    for (const y of [0.45, 0.95]) paintBox(p, c, 7500 + (a < 0 ? 0 : 20) + y * 10, {x0: a, x1: b, y0: y - 0.045, y1: y + 0.045, z0: z - 0.03, z1: z + 0.03}, wood, {front: 0, top: -0.1}, {});
    for (let x = a, i = 0; x <= b + 1e-6; x += FENCE.post, i++) {
      paintBox(p, c, 7600 + (a < 0 ? 0 : 100) + i * 3, {x0: x - 0.06, x1: x + 0.06, y0: 0, y1: FENCE.h, z0: z - 0.06, z1: z + 0.06}, wood, {front: 0, left: 0.2, right: 0.2}, {});
      groundShadow(p, c, 7800 + (a < 0 ? 0 : 100) + i * 3, 'B01', [x, 0, z], 0.07, 0.05, 0.3, 60);
    }
  }
  void dark;
};

const paintLawnW = (p: Painter, c: YCam, sun: Sun, sunId: SunRef) => {
  wFill(p, c, 7900, sun.lit, qy(0, -40, 40, -19, 12));
  // Mower stripes along x (bands of constant z, 1.2 m wide), every other one lighter: they run with the trail axis.
  for (let i = 0, z = -7; z < 11; i++, z += 1.2) if (i % 2 === 0) wWash(p, c, 7910 + i, sun.stripe, 150, qy(0.001, -40, 40, z, z + 1.2), 0.04, 0.2);
  // Beyond the fence: rougher grass, slightly darker.
  wWash(p, c, 7940, mixColor(sun.lit, sun.shade, 0.3), 160, qy(0.001, -40, 40, -18.5, -7.05), 0.05, 0.2);
  // Worn bare patch at the gate, dirt under the swing seat.
  glz(p, 7941, '#a88a5e', 150, wp(c, ellWorld([0, 0.002, -6.6], 0.8, 0.45, 18)));
  glz(p, 7942, '#9a7d55', 170, wp(c, ellWorld([-6.0, 0.002, 0], 0.6, 0.35, 18)));
  // Rain tree shade disc, cast toward +x +z by the low sun; dappled lighter holes.
  const [sx, sz] = shadowStep(sunId), sh: V3 = [F.TR[0] + 0.9 + sx * 0.25, 0.003, F.TR[2] + 0.5 + sz * 0.25]; // covers G1 and the trail's tree end (brief)
  glz(p, 7943, sun.shade, 200, wp(c, ellWorld(sh, 4.2, 3.0, 28)));
  for (let i = 0; i < 14; i++) {
    const a = hash(i * 3.3) * 6.283, r = 3.2 * Math.sqrt(hash(i * 5.7));
    glz(p, 7950 + i, mixColor(sun.shade, sun.lit, 0.45), 120, wp(c, ellWorld([sh[0] + r * Math.cos(a), 0.0035, sh[2] + r * 0.8 * Math.sin(a)], 0.25 + 0.2 * hash(i), 0.15 + 0.1 * hash(i + 1), 10)));
  }
  // Clover patches and a few dandelions (sparse; set detail at the surface value, UT12a).
  for (let i = 0; i < 26; i++) {
    const x = -9 + hash(i * 1.77 + 5) * 18, z = -6.5 + hash(i * 2.91 + 9) * 15;
    if (Math.abs(z) < 0.35 && Math.abs(x) < 5.6) continue;
    glz(p, 8000 + i, mixColor(sun.lit, '#3d6a30', 0.35), 80, wp(c, ellWorld([x, 0.003, z], 0.18 + 0.15 * hash(i), 0.1 + 0.08 * hash(i * 2), 9)));
  }
  for (let i = 0; i < 18; i++) {
    const x = -9 + hash(i * 4.4 + 1) * 18, z = -6 + hash(i * 1.3 + 2) * 14, q = camPoint(c, [x, 0.03, z]);
    if (!q || Math.abs(z) < 0.4) continue;
    const r = Math.max(1.2, 0.025 * camUnit(c, [x, 0, z]));
    solid(p, 8040 + i, '#e9d27a', ell(q[0], q[1], r, r * 0.8, 8), 2, 0.02, 0.05);
  }
  // Near lawn (foreground layer, darker and lower in contrast than the midground, no light edges; UT12/UT12a): clover dabs and grass tufts
  // sampled in camera space 0.5-7 m ahead, sized by the lens, held still.
  const fwd: [number, number] = [Math.sin(c.yaw), -Math.cos(c.yaw)], rt = rgt(c), hz = horizonY(c);
  for (let i = 0; i < 150; i++) {
    const d = 0.5 + 6.5 * hash(i * 2.17 + 1) ** 1.6, lat = (hash(i * 1.31 + 3) - 0.5) * d * 1.3;
    const x = c.x + fwd[0] * d + rt[0] * lat, z = c.z + fwd[1] * d + rt[1] * lat;
    if (Math.abs(z) < 0.3 && Math.abs(x) < 5.8) continue; // keep the trail line clear
    const base = camPoint(c, [x, 0, z]), u = camUnit(c, [x, 0, z]);
    if (!base || base[1] < hz + 4 || base[1] > 2000) continue;
    if (i % 3 === 0) { glz(p, 8100 + i, mixColor(sun.lit, '#2f5a26', 0.3), 70, wp(c, ellWorld([x, 0.003, z], 0.09 + 0.08 * hash(i), 0.05 + 0.04 * hash(i * 2), 9))); continue; }
    const n = 3 + (i % 3), h = (0.05 + 0.05 * hash(i * 3.3)) * u;
    for (let k = 0; k < n; k++) {
      const bx = base[0] + (k - n / 2) * 0.012 * u, lean = (hash(i * 5.5 + k) - 0.5) * h * 0.7;
      inkLine(p, 8300 + i * 6 + k, [[bx, base[1]], [bx + lean * 0.5, base[1] - h * 0.55], [bx + lean, base[1] - h * (0.75 + 0.3 * hash(i + k))]], {closed: false, weight: Math.min(1.4, 0.45 + u / 900), color: hash(i * 7 + k) > 0.45 ? mixColor(sun.lit, '#2d4a24', 0.45) : mixColor(sun.lit, '#3d5a2a', 0.25), still: true});
    }
  }
};

/** Background pass of SET-FIELD19: sky, far trees, fence, lawn, shade. Call first; then `paintSorted` with `fieldItems` and the actors. */
export const paintFieldBack = (p: Painter, c: YCam, sunId: SunRef) => {
  const sun = sunOf(sunId), hz = horizonY(c);
  paintSkyBands(p, {from: sun.skyTop, to: sun.skyLow, via: sun.skyVia, viaAt: 0.55, horizon: hz + 3, width: 1080, bands: 9, top: -200});
  p.flat(sun.lit, [[-200, hz], [1280, hz], [1280, 2200], [-200, 2200]]);
  paintFar(p, c, sun);
  paintLawnW(p, c, sun, sunId);
  paintFenceW(p, c, sun);
};

// ------------------------------------------------------------------------------------------------ items (depth-sorted with the cast)
const treeItem = (p: Painter, c: YCam, sunId: SunRef): Item => ({at: F.TR, draw: () => {
  const sun = sunOf(sunId), b = F.TR, bark = mixColor('#6b5a4a', sun.warm, 0.08), lit = mixColor('#93a957', sun.warm, 0.2);
  // Canopy underside first (behind the trunk's top), then trunk with flared roots, limbs, top clumps lit from the left.
  poly(p, 8300, '#3f5a36', wp(c, bb(c, b, lobe(0.2, 4.7, 4.5, 0.9, 830, 22))), 3, 0.05, 0.15);
  const tr = TREE.trunk / 2;
  poly(p, 8310, bark, wp(c, bb(c, b, [[-tr - 0.3, 0], [-tr, 0.35], [-tr * 0.85, TREE.fork], [tr * 0.85, TREE.fork], [tr, 0.35], [tr + 0.3, 0]])), 5, 0.1, 0.1);
  glz(p, 8311, '#3a2c22', 120, wp(c, bb(c, b, [[tr * 0.15, 0.02], [tr + 0.25, 0.02], [tr, 0.35], [tr * 0.8, TREE.fork], [tr * 0.1, TREE.fork]])));
  // Bark: a lit band on the sun side, vertical ridge strokes, root flare shadows (texture by sparse strokes at the trunk's value, UT12a).
  glz(p, 8312, mixColor(bark, sun.warm, 0.35), 110, wp(c, bb(c, b, [[-tr * 0.95, 0.4], [-tr * 0.55, 0.4], [-tr * 0.5, TREE.fork], [-tr * 0.82, TREE.fork]])));
  for (let k = 0; k < 9; k++) {
    const u0 = -tr * 0.8 + (k / 8) * tr * 1.6, wob = (hash(k * 3.7) - 0.5) * 0.08, line = wp(c, bb(c, b, [[u0 * 1.15, 0.15 + hash(k) * 0.3], [u0 + wob, 0.9 + hash(k * 2) * 0.4], [u0 * 0.9 - wob, TREE.fork - 0.1 - hash(k * 5) * 0.4]]));
    if (line.length >= 2) inkLine(p, 8313 + k, line, {closed: false, weight: 0.55, color: mixColor(bark, INK, 0.35), curve: 0.3, still: true});
  }
  // Bark plates: soft darker patches along the trunk (value close to the bark).
  for (let k = 0; k < 7; k++) {
    const u0 = (hash(k * 4.3 + 1) - 0.5) * tr * 1.3, v0 = 0.3 + hash(k * 2.9) * (TREE.fork - 0.6), w = 0.06 + hash(k * 7.1) * 0.08, hh = 0.25 + hash(k * 1.9) * 0.4;
    glz(p, 8325 + k, mixColor(bark, INK, 0.2), 90, wp(c, bb(c, b, [[u0 - w, v0], [u0 + w, v0 + 0.05], [u0 + w * 0.7, v0 + hh], [u0 - w * 0.8, v0 + hh - 0.04]])));
  }
  const limbs: [number, number, number][] = [[-2.6, 4.6, 0.3], [0.3, 5.1, 0.34], [2.8, 4.5, 0.28]];
  limbs.forEach(([u1, v1, w], i) => poly(p, 8320 + i, mixColor(bark, INK, 0.1), wp(c, bb(c, b, [[-w, TREE.fork - 0.2], [w, TREE.fork - 0.2], [u1 + w * 0.4, v1], [u1 - w * 0.4, v1]])), 3, 0.06, 0.1));
  const rim = wp(c, bb(c, b, [[-tr - 0.3, 0], [-tr, 0.35], [-tr * 0.85, TREE.fork]]));
  if (rim.length >= 2) inkLine(p, 8330, rim, {closed: false, weight: 0.8, color: mixColor(bark, sun.warm, 0.45), curve: 0.2});
  const right = wp(c, bb(c, b, [[tr + 0.3, 0], [tr, 0.35], [tr * 0.85, TREE.fork]]));
  if (right.length >= 2) inkLine(p, 8331, right, {closed: false, weight: 0.8, color: mixColor(bark, INK, 0.5), curve: 0.2});
  const clumps: [number, number, number, number][] = [[-3.4, 5.6, 1.3, 0.8], [-1.8, 6.5, 1.5, 0.95], [0.2, 6.9, 1.7, 0.9], [2.1, 6.5, 1.5, 0.9], [3.6, 5.6, 1.2, 0.75], [-0.9, 5.6, 1.4, 0.7], [1.4, 5.5, 1.4, 0.7]];
  clumps.forEach(([u, v, rx, ry], i) => {
    poly(p, 8340 + i, mixColor('#5f7f3e', '#3f5a36', 0.15 * (i % 3)), wp(c, bb(c, b, lobe(u, v, rx, ry, 840 + i * 7, 16))), 3, 0.06, 0.18);
    glz(p, 8360 + i, lit, 150, wp(c, bb(c, b, lobe(u - rx * 0.3, v + ry * 0.25, rx * 0.5, ry * 0.45, 860 + i * 7, 12))));
  });
}});
const swingItem = (p: Painter, c: YCam, sunId: SunRef): Item => ({at: F.SW, draw: () => {
  const steel = mixColor('#6f8190', sunOf(sunId).warm, 0.1), x0 = -6.6, x1 = -5.4, d = SWING.depth / 2, y = SWING.bar, t = 0.03;
  for (const x of [x0, x1]) for (const z of [-d, d]) poly(p, 8400 + (x + 7) * 10 + z * 3, z < 0 ? mixColor(steel, '#3a2a40', 0.22) : steel, wp(c, [[x - t, y, -0.02], [x + t, y, 0.02], [x + t, 0, z], [x - t, 0, z]]), 3, 0.03, 0.05);
  poly(p, 8420, steel, wp(c, [[x0 - 0.1, y - t, 0], [x1 + 0.1, y - t, 0], [x1 + 0.1, y + t, 0], [x0 - 0.1, y + t, 0]]), 3, 0.03, 0.05);
  for (const dx of [-0.22, 0.22]) { const a = camPoint(c, [-6 + dx, y, 0]), q = camPoint(c, [-6 + dx, SWING.seat + 0.02, 0]); if (a && q) inkLine(p, 8430 + dx * 10, [a, q], {closed: false, weight: 0.7, color: '#5a5f66', curve: 0}); }
  paintBox(p, c, 8440, {x0: -6.26, x1: -5.74, y0: SWING.seat - 0.03, y1: SWING.seat + 0.02, z0: -0.1, z1: 0.1}, '#2c2a2a', {}, {});
  groundShadow(p, c, 8450, sunId, [-6.0, 0, 0], 0.7, 0.9, 1.0, 70);
}});
/** Training gear by the fence (CL02 "training field" read): three orange cones, a low jump bar, a gear bag and a steel bowl, at surface value. */
const gearItems = (p: Painter, c: YCam, sunId: SunRef): Item[] => {
  const cone = (i: number, at: V3): Item => ({at, draw: () => {
    groundShadow(p, c, 8500 + i * 4, sunId, at, 0.13, 0.13, 0.3, 80);
    poly(p, 8502 + i * 4, '#d9793a', wp(c, bb(c, at, [[-0.13, 0], [0.13, 0], [0.025, 0.3], [-0.025, 0.3]])), 3, 0.04, 0.08);
    poly(p, 8503 + i * 4, '#efe2c8', wp(c, bb(c, at, [[-0.07, 0.13], [0.07, 0.13], [0.055, 0.18], [-0.055, 0.18]])), 2, 0.02, 0.05);
  }});
  const bar: Item = {at: [-3.0, 0, -6.0], draw: () => {
    for (const x of [-3.6, -2.4]) paintBox(p, c, 8530 + x * 10, {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: 0.55, z0: -6.025, z1: -5.975}, '#e7e1d2', {}, {});
    paintBox(p, c, 8550, {x0: -3.6, x1: -2.4, y0: 0.47, y1: 0.51, z0: -6.02, z1: -5.98}, '#c7553f', {}, {});
  }};
  const bag: Item = {at: [0.9, 0, -6.5], draw: () => {
    groundShadow(p, c, 8560, sunId, [0.9, 0, -6.5], 0.35, 0.2, 0.3, 90);
    paintBox(p, c, 8562, {x0: 0.6, x1: 1.15, y0: 0, y1: 0.28, z0: -6.65, z1: -6.38}, '#4b5a52', {top: -0.15}, {});
    paintBox(p, c, 8570, {x0: 1.22, x1: 1.42, y0: 0, y1: 0.07, z0: -6.45, z1: -6.25}, '#b9bec4', {}, {});
  }};
  return [cone(0, [2.4, 0, -6.4]), cone(1, [2.7, 0, -6.1]), cone(2, [2.2, 0, -6.0]), bar, bag];
};

/** Depth-sorted set items: tree, swing, gear and (when `stack`) the mat stack ST (painted by mats.ts through the callback). */
export const fieldItems = (p: Painter, c: YCam, sunId: SunRef, extra: Item[] = []): Item[] => [treeItem(p, c, sunId), swingItem(p, c, sunId), ...gearItems(p, c, sunId), ...extra];

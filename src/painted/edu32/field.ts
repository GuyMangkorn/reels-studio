import {ell, INK, inkLine, solid, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, qy, wFill, wp, wWash} from '../kit/world';
import {camPoint, camSpace, camToPicture, camUnit, type YCam} from '../kit/ycam';

// EDU-EP32-SHORT Space F, the test field (EDU-EP32-BRIEF-R2 VD32-19, VD32-20, set plan "Space F"; Boss W3 gate LF03R, 2026-11-21). Real metres,
// laid 1:1 on page P's coordinates (VD32-18): origin = the ground point under Space D's origin, +x right, +y up, +z toward the master camera.
// Back to front: overcast sky with a cloud gap, the tree line at z -16, the hedge, the mown lawn, the canopy shade and the warm sun patch, the
// rope square, the two trunks with low foliage, the 1960s bench (green slats, black iron ends). Light state `FieldLight`: 'overcast' (the bridge
// until the cloud passes in B03-SH03) or 'sun' (canopy shade over the bench, one leaf-gap patch on the grass in front). Kit plates PL-EDU-PARK
// and PL-EDU-FIELD19 were reference for grass and tree massing only (ENV-P02); the lawn and tree painters follow `edu19/field.ts`.

export type FieldLight = 'overcast' | 'sun';
/** Bench on `BENCH_P`'s footprint (looks.ts), armrest tops 0.55 m at x +-0.95. */
export const BENCH_F = {x0: -0.95, x1: 0.95, zb: -0.42, zf: -0.18, seat: 0.345, back: 0.78, arm: 0.55} as const;
/** Set points (brief set plan). */
export const SF = {
  treeL: [-1.8, 0, -1.2] as V3, treeR: [1.7, 0, -1.3] as V3, manL: [-0.6, 0, -0.1] as V3, manR: [0.62, 0, -0.1] as V3,
  catSeat: [0, BENCH_F.seat, -0.3] as V3, patch: [0.5, 0, 0.7] as V3, sparrow: [0.95, BENCH_F.arm, -0.3] as V3, agent: [3.6, 0, 2.4] as V3,
  rope: [[-2.6, -1.6], [3.2, -1.6], [3.2, 3.4], [-2.6, 3.4]] as [number, number][], treeLineZ: -16,
} as const;
/** Sun direction (toward the sun): behind-left and high, so shadows fall toward +x +z. */
export const SUN_DIR: V3 = [-0.35, 0.85, -0.4];
const PAL = {
  overcast: {skyTop: '#aeb8bc', skyVia: '#c9cfc4', skyLow: '#d8d9cc', lawn: '#6f9150', stripe: '#789a58', far: '#7d8f72', farDark: '#5f7259', hedge: '#4f6a43'},
  sun: {skyTop: '#9fb6c6', skyVia: '#c4cfc9', skyLow: '#dcdac8', lawn: '#7c9c4e', stripe: '#86a656', far: '#7f9a68', farDark: '#5c7352', hedge: '#506d41'},
} as const;
export const SHADE = '#3f5a52';
export const SUN_WARM = '#ffe2a0';

const horizonY = (c: YCam) => camToPicture(c, camSpace(c, [c.x + 1e4 * Math.sin(c.yaw), c.y, c.z - 1e4 * Math.cos(c.yaw)]))[1];
const rgt = (c: YCam): [number, number] => [Math.cos(c.yaw), Math.sin(c.yaw)];
/** Camera-facing billboard points (u right, v up, metres) at `base`. */
const bb = (c: YCam, base: V3, pts: [number, number][]): V3[] => { const [rx, rz] = rgt(c); return pts.map(([u, v]): V3 => [base[0] + rx * u, base[1] + v, base[2] + rz * u]); };
const lobe = (u: number, v: number, rx: number, ry: number, seed: number, n = 14): [number, number][] =>
  Array.from({length: n}, (_, i): [number, number] => { const a = (i / n) * 6.283, j = 1 + 0.2 * (hash(seed + i * 3.1) - 0.5); return [u + rx * j * Math.cos(a), v + ry * j * Math.sin(a)]; });
export const ellW = (at: V3, rx: number, rz: number, n = 22, y = at[1]): V3[] => Array.from({length: n}, (_, i): V3 => [at[0] + rx * Math.cos((i / n) * 6.283), y, at[2] + rz * Math.sin((i / n) * 6.283)]);
const poly = (p: Painter, seed: number, color: string, q: Pt[], passes = 3, tex = 0.05, border = 0.12) => { if (q.length >= 3) solid(p, seed, color, q, passes, tex, border); };
const glz = (p: Painter, seed: number, color: string, op: number, q: Pt[], bleed = 0.1) => { if (q.length >= 3) washAt(p, seed, color, op, q, bleed, 0.3); };
/** Ground shadow offset per metre of height (away from the sun). */
const SH: [number, number] = [-SUN_DIR[0] / SUN_DIR[1], -SUN_DIR[2] / SUN_DIR[1]];

/** A sun shadow on the ground for an object `h` m tall standing on footprint (rx, rz) at `at`, plus its soft contact core. */
export const sunShadow = (p: Painter, c: YCam, seed: number, at: V3, rx: number, rz: number, h: number, op = 110) => {
  const dx = SH[0] * h * 0.5, dz = SH[1] * h * 0.5;
  glz(p, seed, '#2c3f27', op, wp(c, ellW([at[0] + dx, 0.004, at[2] + dz], rx + Math.abs(dx) * 0.8, rz + Math.abs(dz) * 0.5, 18)));
  glz(p, seed + 1, '#1e2c1a', op * 0.7, wp(c, ellW([at[0], 0.005, at[2]], rx * 0.8, rz * 0.8, 14)));
};
/** Soft ambient contact under an object in canopy shade (no direction). */
export const contactShade = (p: Painter, c: YCam, seed: number, at: V3, rx: number, rz: number, op = 120) =>
  glz(p, seed, '#1f2c24', op, wp(c, ellW([at[0], at[1] + 0.004, at[2]], rx, rz, 16)), 0.2);

/** Caption-band ground shade for any Space F camera (G4, 21 Nov 2026; caption-zone limits mean 0.25 / p95 0.40 on y 1230-1344): nested glazes whose
 *  back edges are wavy ground lines across the whole view, each placed at the ground distance that lands on picture row `row` for this camera
 *  (so the ramp stays put on screen while the camera moves), filled down past the frame bottom, darkest nearest the camera. The bridge keeps its
 *  own world-z version (`bridge.ts` NEAR_SHADE). G4 paints it last on the plate (over the near-lawn tufts): every figure stays above the ramp. */
export const paintNearGroundShade = (p: Painter, c: YCam, seed: number, color: string, steps: [number, number][], k = 1) => {
  if (k <= 0) return;
  const fx = Math.sin(c.yaw), fz = -Math.cos(c.yaw), [rx, rz] = rgt(c);
  steps.forEach(([row, op], i) => {
    const dep = -(c.pitch ?? 0) + Math.atan((row - c.hy) / c.f);
    if (dep <= 0.01) return;
    const d = c.y / Math.tan(dep);
    const edge = Array.from({length: 49}, (_, j) => {
      const s = (j - 24) * 0.06 * Math.max(1, d), w = 0.03 * d * (Math.sin(s * 1.4 / d + i * 1.7) + 0.5 * Math.sin(s * 3.3 / d + i * 0.9));
      return camPoint(c, [c.x + fx * (d + w) + rx * s, 0.002, c.z + fz * (d + w) + rz * s]);
    }).filter((q): q is Pt => q !== null);
    if (edge.length < 2) return;
    washAt(p, seed + i, color, op * k, [...edge, [edge[edge.length - 1][0], 2300], [edge[0][0], 2300]], 0.2, 0.2);
  });
};
/** World z of the ground line straight ahead that lands on picture row `row` (for splitting the near-lawn tufts at the ramp). */
export const groundZAtRow = (c: YCam, row: number) => {
  const dep = -(c.pitch ?? 0) + Math.atan((row - c.hy) / c.f);
  return dep <= 0.01 ? -Infinity : c.z - Math.cos(c.yaw) * (c.y / Math.tan(dep));
};
/** Near-lawn tufts in front of world z `zFrom`, painted over the caption-band ramp in the shade's own tone (grass in shadow, not a flat slab). */
export const paintShadedNearLawn = (p: Painter, c: YCam, L: FieldLight, zFrom: number, shade: string) =>
  paintNearLawn(tintPainter(p, shade, 0.62, {brush: true}), c, L, zFrom);
/** The G4 caption-band ramp (picture rows, glaze opacity): starts soft under the staging limit y 1200 and is dense through the band. */
export const BAND_RAMP: [number, number][] = [[1160, 18], [1178, 24], [1196, 30], [1212, 38], [1228, 52], [1246, 60], [1266, 66], [1290, 70], [1320, 78], [1360, 86]];

// ------------------------------------------------------------------------------------------------ background
const paintSky = (p: Painter, c: YCam, L: FieldLight, hz: number) => {
  const k = PAL[L];
  paintSkyBands(p, {from: k.skyTop, to: k.skyLow, via: k.skyVia, viaAt: 0.5, horizon: hz + 4, width: 1080, bands: 8, top: -200});
  // Overcast deck: broad soft cloud lobes; in 'sun' a brighter gap opens high on the left (the cloud has passed the sun).
  for (let i = 0; i < 9; i++) {
    const x = -120 + i * 150 + hash(i * 2.3) * 60, y = hz - 140 - hash(i * 4.1) * 260, rx = 170 + hash(i * 1.7) * 120, ry = 34 + hash(i * 3.3) * 26;
    glz(p, 9000 + i, mixColor(k.skyVia, '#eef0e8', 0.5), 120, ell(x, y, rx, ry, 18), 0.3);
    glz(p, 9020 + i, mixColor(k.skyTop, '#8d9aa2', 0.35), 70, ell(x + 30, y + ry * 0.7, rx * 0.8, ry * 0.45, 14), 0.3);
  }
  if (L === 'sun') glz(p, 9040, '#f4efd8', 150, ell(170, hz - 330, 230, 90, 22), 0.4);
};

const paintTreeLine = (p: Painter, c: YCam, L: FieldLight) => {
  const k = PAL[L], z0 = SF.treeLineZ;
  // Slight rise to the tree line, then two rows of soft lobes (no ink), the near row darker; nothing built in any direction.
  wFill(p, c, 9100, mixColor(k.lawn, k.far, 0.5), qy(0.05, -60, 60, z0 - 4, z0 + 2));
  for (let row = 0; row < 2; row++) for (let i = 0; i < 26; i++) {
    const x = -32 + i * 2.6 + hash(i * 2.2 + row) * 1.8, z = z0 - 3 + row * 2.5 - hash(i * 3.9 + row) * 2, h = 2.4 + hash(i * 4.1 + row * 7) * 1.8, r = 1.2 + hash(i * 1.7 + row) * 0.9;
    const col = mixColor(row ? k.farDark : k.far, '#a9b6a6', row ? 0.12 : 0.3 + 0.2 * hash(i * 9.1));
    poly(p, 9110 + row * 100 + i, col, wp(c, bb(c, [x, 0, z], lobe(0, h - r * 0.7, r * 1.25, r, 900 + i * 3 + row))), 2, 0.04, 0.15);
  }
  // Hedge x -10..-6 at z -4 (low box of foliage).
  poly(p, 9300, k.hedge, wp(c, [[-10, 0, -4], [-6, 0, -4], [-6, 0.9, -4], [-10, 0.95, -4]]), 3, 0.05, 0.12);
};

const paintLawn = (p: Painter, c: YCam, L: FieldLight) => {
  const k = PAL[L];
  wFill(p, c, 9400, k.lawn, qy(0, -40, 40, -19, 12));
  for (let i = 0, z = -14; z < 10; i++, z += 1.4) if (i % 2 === 0) wWash(p, c, 9410 + i, k.stripe, 140, qy(0.001, -40, 40, z, z + 1.4), 0.04, 0.2);
  for (let i = 0; i < 24; i++) {
    const x = -8 + hash(i * 1.77 + 5) * 16, z = -12 + hash(i * 2.91 + 9) * 13;
    glz(p, 9440 + i, mixColor(k.lawn, '#3d6a30', 0.35), 80, wp(c, ellW([x, 0.003, z], 0.2 + 0.15 * hash(i), 0.1 + 0.08 * hash(i * 2), 9)));
  }
};

/** Canopy shade over the bench and the near lawn ('sun' only), the leaf dapples, then the warm sun patch (the brightest warm ground area). */
const paintShadeAndPatch = (p: Painter, c: YCam, L: FieldLight) => {
  if (L !== 'sun') return;
  glz(p, 9500, SHADE, 190, wp(c, ellW([0.5, 0.003, 0.7], 3.9, 3.2, 30)), 0.3);
  glz(p, 9501, SHADE, 150, wp(c, ellW([3.6, 0.003, 0.5], 2.6, 2.4, 24)), 0.3);
  // dapples: small cool-lit holes in the shade, away from the patch
  for (let i = 0; i < 12; i++) {
    const a = hash(i * 3.3) * 6.283, r = 1.4 + 2.2 * Math.sqrt(hash(i * 5.7)), x = 0.5 + r * Math.cos(a), z = 0.7 + r * 0.8 * Math.sin(a);
    if (Math.hypot(x - SF.patch[0], z - SF.patch[2]) < 1.2 || z > 2.2) continue;
    glz(p, 9510 + i, mixColor(SHADE, '#9fb36a', 0.45), 110, wp(c, ellW([x, 0.0035, z], 0.12 + 0.12 * hash(i), 0.08 + 0.06 * hash(i + 1), 10)));
  }
  // the patch (0.9 x 0.6 m, soft edge about 0.1 m): sunlit grass, not a disc. Five nested warm-green glazes with a leaf-gap wobble on the rim, the
  // hottest at the centre, so the edge steps fade out instead of reading as a ring.
  const [px, , pz] = SF.patch, lawn = PAL[L].lawn;
  const gap = (k: number, n = 30): V3[] => Array.from({length: n}, (_, i): V3 => {
    const a = (i / n) * 6.283, w = 1 + 0.09 * Math.sin(3 * a + 1.3) + 0.06 * Math.sin(5 * a + 0.4);
    return [px + 0.45 * k * w * Math.cos(a), 0.004 + k * 0.0004, pz + 0.3 * k * w * Math.sin(a)];
  });
  [[1.18, 0.38, 110], [1.04, 0.55, 130], [0.9, 0.72, 150], [0.72, 0.86, 170], [0.48, 1, 170]].forEach(([k, u, op], i) =>
    glz(p, 9530 + i, mixColor(mixColor(SHADE, lawn, 0.5), mixColor(SUN_WARM, '#e4e48a', 0.25), u), op, wp(c, gap(k)), 0.35));
};

/** The white rope at 0.45 m on stakes (the test square); posts cast sun shadows when they stand outside the canopy shade. */
const paintRope = (p: Painter, c: YCam, L: FieldLight) => {
  const r = SF.rope, H = 0.45;
  for (let i = 0; i < 4; i++) {
    const [x0, z0] = r[i], [x1, z1] = r[(i + 1) % 4];
    const n = 12, pts: Pt[] = [];
    for (let k = 0; k <= n; k++) { const u = k / n, q = camPoint(c, [x0 + (x1 - x0) * u, H - 0.04 * Math.sin(u * Math.PI), z0 + (z1 - z0) * u]); if (q) pts.push(q); }
    if (pts.length >= 2) inkLine(p, 9600 + i, pts, {closed: false, weight: 1.1, color: '#ece8dc', curve: 0.2, still: true});
  }
  for (const [x, z] of r) {
    if (L === 'sun') sunShadow(p, c, 9620 + x * 10 + z, [x, 0, z], 0.03, 0.03, 0.5, 70);
    paintBox(p, c, 9640 + x * 10 + z, {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: H + 0.04, z0: z - 0.025, z1: z + 0.025}, '#d9d2c0', {}, {});
  }
};

/** Background pass of Space F: sky, tree line, hedge, lawn, canopy shade and patch, rope. */
export const paintFieldBack = (p: Painter, c: YCam, L: FieldLight) => {
  const hz = horizonY(c);
  paintSky(p, c, L, hz);
  p.flat(PAL[L].lawn, [[-200, hz], [1280, hz], [1280, 2200], [-200, 2200]]);
  paintTreeLine(p, c, L);
  paintLawn(p, c, L);
  paintShadeAndPatch(p, c, L);
  paintRope(p, c, L);
};

// ------------------------------------------------------------------------------------------------ trees and near lawn
const BARK = '#5e5045', LEAF = '#4f7038', LEAF_DARK = '#344c32', LEAF_LIT = '#86a352';
/** One park tree: trunk 0.3 m with a slight root flare, the canopy above the frame (5.5-6.5 m) with a few low drooping clumps that reach into the
 *  top of a cat-height frame. Lit edge on the sun side (left). */
export const paintFieldTree = (p: Painter, c: YCam, at: V3, seed: number, L: FieldLight) => {
  const tr = 0.15, shadeK = L === 'sun' ? 0.25 : 0.1, bark = mixColor(BARK, SHADE, shadeK);
  contactShade(p, c, seed, at, 0.3, 0.22, 110);
  poly(p, seed + 1, bark, wp(c, bb(c, at, [[-tr - 0.12, 0], [-tr, 0.25], [-tr * 0.85, 3.4], [tr * 0.85, 3.4], [tr, 0.25], [tr + 0.12, 0]])), 4, 0.08, 0.1);
  glz(p, seed + 2, mixColor(bark, INK, 0.3), 120, wp(c, bb(c, at, [[tr * 0.1, 0.02], [tr + 0.1, 0.02], [tr, 0.25], [tr * 0.8, 3.4], [tr * 0.05, 3.4]])));
  if (L === 'sun') glz(p, seed + 3, mixColor(bark, SUN_WARM, 0.35), 110, wp(c, bb(c, at, [[-tr * 0.95, 0.6], [-tr * 0.6, 0.6], [-tr * 0.55, 3.2], [-tr * 0.8, 3.2]])));
  for (let k = 0; k < 6; k++) {
    const u0 = -tr * 0.7 + (k / 5) * tr * 1.4, line = wp(c, bb(c, at, [[u0 * 1.1, 0.2 + hash(seed + k) * 0.3], [u0 + (hash(k * 3.7) - 0.5) * 0.03, 1.3], [u0 * 0.9, 3.0]]));
    if (line.length >= 2) inkLine(p, seed + 10 + k, line, {closed: false, weight: 0.55, color: mixColor(bark, INK, 0.35), curve: 0.3, still: true});
  }
  // canopy underside and low clumps (only these reach the frame at cat height)
  const side = at[0] < 0 ? 1 : -1;
  poly(p, seed + 20, mixColor(LEAF_DARK, SHADE, shadeK), wp(c, bb(c, at, lobe(side * 0.6, 3.5, 2.5, 0.7, seed + 21, 20))), 3, 0.05, 0.15);
  const clumps: [number, number, number, number][] = [[side * 0.2, 4.6, 1.6, 0.9], [side * 1.6, 4.3, 1.4, 0.8], [side * -0.9, 4.2, 1.2, 0.7], [side * 0.8, 5.4, 1.4, 0.7], [side * -0.4, 2.7, 0.8, 0.45], [side * 0.6, 2.4, 0.9, 0.5], [side * 1.5, 2.6, 0.8, 0.45], [side * 2.3, 2.9, 0.7, 0.4]];
  clumps.forEach(([u, v, rx, ry], i) => {
    poly(p, seed + 30 + i, mixColor(mixColor(LEAF, LEAF_DARK, 0.2 * (i % 3)), SHADE, shadeK), wp(c, bb(c, at, lobe(u, v, rx, ry, seed + 40 + i * 7, 16))), 3, 0.05, 0.18);
    glz(p, seed + 50 + i, mixColor(LEAF_LIT, L === 'sun' ? SUN_WARM : '#c9cfc4', 0.15), 130, wp(c, bb(c, at, lobe(u - rx * 0.3, v + ry * 0.25, rx * 0.45, ry * 0.4, seed + 60 + i * 7, 12))));
  });
};

/** Near lawn (foreground layer, darker and lower in contrast, UT12): grass tufts sampled 0.5-5 m ahead of the camera, held still. Skips the patch. */
/** `zMin`/`zMax` keep only the tufts whose root lies in that depth band (paint the band behind a figure before it, the rest after). */
export const paintNearLawn = (p: Painter, c: YCam, L: FieldLight, zMin = -Infinity, zMax = Infinity) => {
  const base0 = mixColor(PAL[L].lawn, SHADE, L === 'sun' ? 0.45 : 0.2), fwd: [number, number] = [Math.sin(c.yaw), -Math.cos(c.yaw)], rt = rgt(c), hz = horizonY(c);
  for (let i = 0; i < 160; i++) {
    const d = 0.5 + 4.5 * hash(i * 2.17 + 1) ** 1.5, lat = (hash(i * 1.31 + 3) - 0.5) * d * 1.1;
    const x = c.x + fwd[0] * d + rt[0] * lat, z = c.z + fwd[1] * d + rt[1] * lat;
    if (z < -0.1 || z < zMin || z >= zMax) continue; // behind the bench line, or outside the band
    const inPatch = Math.hypot((x - SF.patch[0]) / 0.5, (z - SF.patch[2]) / 0.34) < 1;
    const base = camPoint(c, [x, 0, z]), u = camUnit(c, [x, 0, z]);
    if (!base || base[1] < hz + 4 || base[1] > 2000) continue;
    const col = inPatch ? mixColor(SUN_WARM, '#9aa848', 0.55) : base0;
    if (i % 3 === 0 && !inPatch) { glz(p, 9700 + i, mixColor(base0, '#22381f', 0.3), 70, wp(c, ellW([x, 0.003, z], 0.07 + 0.06 * hash(i), 0.04 + 0.03 * hash(i * 2), 9))); continue; }
    const n = 3 + (i % 3), h = (0.04 + 0.04 * hash(i * 3.3)) * u;
    for (let k = 0; k < n; k++) {
      const bx = base[0] + (k - n / 2) * 0.012 * u, lean = (hash(i * 5.5 + k) - 0.5) * h * 0.7;
      inkLine(p, 9900 + i * 6 + k, [[bx, base[1]], [bx + lean * 0.5, base[1] - h * 0.55], [bx + lean, base[1] - h * (0.75 + 0.3 * hash(i + k))]], {closed: false, weight: Math.min(1.4, 0.45 + u / 900), color: hash(i * 7 + k) > 0.45 ? mixColor(col, '#20341c', 0.4) : mixColor(col, '#3d5a2a', 0.15), still: true});
    }
  }
};

// ------------------------------------------------------------------------------------------------ the bench
const SLAT = '#3f6b4a', IRON = '#1f2124';
/** Bench back: iron end frames (behind the seat line) and three back slats. Paint before the seated figures. */
export const paintFieldBenchBack = (p: Painter, c: YCam, L: FieldLight) => {
  const b = BENCH_F, sh = L === 'sun' ? 0.22 : 0.08, slat = mixColor(SLAT, SHADE, sh), iron = IRON;
  contactShade(p, c, 9800, [0, 0, (b.zb + b.zf) / 2], 1.1, 0.25, 130);
  for (const x of [b.x0, b.x1]) {
    // rear leg rising into the back post
    paintBox(p, c, 9810 + (x > 0 ? 5 : 0), {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: b.back, z0: b.zb - 0.03, z1: b.zb + 0.02}, iron, {}, {});
  }
  for (let k = 0; k < 3; k++) {
    const y0 = b.seat + 0.1 + k * 0.13;
    paintBox(p, c, 9820 + k * 3, {x0: b.x0 - 0.04, x1: b.x1 + 0.04, y0, y1: y0 + 0.085, z0: b.zb - 0.01 + k * 0.012, z1: b.zb + 0.015 + k * 0.012}, slat, {front: -0.04 * k, top: -0.15}, {});
  }
};
/** Bench seat slats, front legs and armrests (the armrest top is the sparrow's perch). */
export const paintFieldBenchSeat = (p: Painter, c: YCam, L: FieldLight) => {
  const b = BENCH_F, sh = L === 'sun' ? 0.22 : 0.08, slat = mixColor(SLAT, SHADE, sh), iron = IRON;
  for (let k = 0; k < 3; k++) {
    const z0 = b.zb + 0.01 + k * 0.08;
    paintBox(p, c, 9840 + k * 3, {x0: b.x0 - 0.03, x1: b.x1 + 0.03, y0: b.seat - 0.03, y1: b.seat, z0, z1: z0 + 0.07}, slat, {top: -0.12, front: 0.12}, {});
  }
  for (const x of [b.x0, b.x1]) {
    const s = x > 0 ? 5 : 0;
    paintBox(p, c, 9860 + s, {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: b.arm, z0: b.zf - 0.01, z1: b.zf + 0.04}, iron, {}, {});
    paintBox(p, c, 9870 + s, {x0: x - 0.03, x1: x + 0.03, y0: b.arm - 0.03, y1: b.arm, z0: b.zb - 0.03, z1: b.zf + 0.06}, iron, {top: -0.25}, {});
    paintBox(p, c, 9880 + s, {x0: x - 0.02, x1: x + 0.02, y0: 0.06, y1: 0.09, z0: b.zb, z1: b.zf + 0.03}, iron, {}, {});
  }
};

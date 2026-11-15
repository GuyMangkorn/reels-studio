import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDepth, camPoint, camUnit, type YCam} from '../kit/ycam';
import {wp} from '../kit/world';
import {hash} from '../kit/hash';
import {planeDashes} from './marks';
import {C} from './palette';

// N6 SET-SEA17 (space W, metres, compressed staging: claims no distance or depth; brief "Set plan — SET-SEA17"). W3 THUMBNAIL grade
// (Film, 2026-11-15): flat washes in depth order (water, seabed strips with distance haze, rocks, cable with its own glow, particles).

const ok = (q: Pt[]) => q.length >= 3;
/** Seabed height y_bed(z): beach shoal, sandy flat, slope, deep floor (brief profile). */
export const bedY = (z: number) => {
  const seg: [number, number, number, number][] = [[0, -16, 0, -2.5], [-16, -80, -2.5, -7], [-80, -150, -7, -38], [-150, -700, -38, -50]];
  for (const [z0, z1, y0, y1] of seg) if (z <= z0 && z >= z1) { const u = (z - z0) / (z1 - z0); return y0 + (y1 - y0) * (z0 === -80 ? u * u * (3 - 2 * u) : u); }
  return z > 0 ? 0 : -50;
};
/** Cable path: buried under the shallows to z -80, then on the floor, snaking x = 0.8 sin(z / 23). */
export const cableAt = (z: number): V3 => [0.8 * Math.sin(z / 23), bedY(z) + (z < -80 ? 0.012 : -0.05), z];

export type SeaLight = {amb: number};
/** Water colour at depth y (0 surface .. -50 deep), lifted by `amb` (UT03: the deep never goes black). */
export const waterAt = (y: number, L: SeaLight) => {
  const k = Math.min(1, Math.max(0, -y / 45));
  const base = k < 0.15 ? mixColor(C.shallow0, C.shallow1, k / 0.15) : k < 0.5 ? mixColor(C.shallow1, C.slope1, (k - 0.15) / 0.35) : mixColor(C.slope1, C.deep0, (k - 0.5) / 0.5);
  return mixColor(base, '#3f86a6', 0.45 * L.amb * k);
};
const sandAt = (y: number) => { const k = Math.min(1, -y / 45); return k < 0.2 ? mixColor(C.seaSand, C.ripple, k / 0.2 * 0.5) : mixColor(mixColor(C.seaSand, C.ripple, 0.5), '#566d76', Math.min(1, (k - 0.2) / 0.5)); };

/** Water colour seen along a ray of elevation `elev` (rad) from the camera: lit toward the surface above, the camera-depth blue level, darker below. */
const rayWater = (c: YCam, elev: number, L: SeaLight) => {
  const s = Math.sin(elev);
  return s > 0 ? mixColor(waterAt(c.y - 6, L), waterAt(Math.min(0, c.y + 30), L), Math.min(1, s * 1.6)) : mixColor(waterAt(c.y - 6, L), waterAt(c.y - 28, L), Math.min(1, -s * 1.6));
};
/** Water backdrop: picture bands by ray elevation (pitch-aware), so the horizon colour matches the haze the seabed fades into. */
const water = (p: Painter, c: YCam, L: SeaLight) => {
  for (let i = 0; i < 14; i++) {
    const y0 = -40 + i * 145, elev = Math.atan((c.hy - (y0 + 72)) / c.f) + (c.pitch ?? 0);
    hardFill(p, 5000 + i, rayWater(c, elev, L), [[-40, y0], [1120, y0], [1120, y0 + 155], [-40, y0 + 155]]);
  }
};

/** Seabed in strips far to near; each strip hazes toward the water colour with distance from the camera. */
const bed = (p: Painter, c: YCam, L: SeaLight, zFar: number, zNear: number) => {
  const n = 70, far = c.y < -20 ? 34 : 70, fogCol = (z: number) => mixColor(rayWater(c, 0, L), waterAt(bedY(z), L), 0.5);
  const haze = (z: number) => Math.min(1, (Math.abs(camDepth(c, [c.x, bedY(z), z])) / far) ** 0.8);
  for (let i = 0; i < n; i++) {
    const zAt = (j: number) => zNear - (zNear - zFar) * ((n - j) / n) ** 2, z0 = zAt(i), z1 = zAt(i + 1);
    const q = wp(c, [[c.x - 600, bedY(z0), z0], [c.x + 600, bedY(z0), z0], [c.x + 600, bedY(z1), z1], [c.x - 600, bedY(z1), z1]]);
    if (!ok(q)) continue;
    const zm = (z0 + z1) / 2, col = mixColor(mixColor(sandAt(bedY(zm)), '#6f8fa0', 0.3 * L.amb * Math.min(1, -bedY(zm) / 40)), fogCol(zm), haze(zm));
    hardFill(p, 5100 + i, i % 2 ? col : mixColor(col, '#000000', 0.035), q);
  }
};

/** Soft cyan light the cable's glow throws on the floor: a wide faint band under it (the deep floor reads by it, UT03). */
const glowPool = (p: Painter, c: YCam, zFar: number, zNear: number) => {
  const P: Pt[] = [], W: number[] = [], D: number[] = [];
  for (let z = zNear; z >= Math.max(zFar, zNear - 60); z -= 1.0) {
    if (z > -80) continue;
    const v = cableAt(z), q = seen(c, v) ? camPoint(c, v, 0.4) : null;
    if (!q) { if (P.length) break; continue; }
    P.push(q); W.push(Math.max(1.5, 0.045 * camUnit(c, v))); D.push(Math.abs(camDepth(c, v)));
  }
  for (let i0 = 0, r = 0; i0 < P.length - 1; i0 += 6, r++) hardFill(p, 5160 + r, mixColor(mixColor(C.glow, '#8a9a90', 0.7), rayWater(c, 0, {amb: 0}), Math.min(0.9, D[i0] / 30)), ribbon(P.slice(i0, i0 + 7), W.slice(i0, i0 + 7)));
};
/** A flat ribbon polygon along picture points `P` with half-widths `W`. */
export const ribbon = (P: Pt[], W: number[]): Pt[] => {
  if (P.length < 2) return [];
  const L: Pt[] = [], R: Pt[] = [];
  P.forEach((q, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, nx = -dy / n, ny = dx / n;
    L.push([q[0] + nx * W[i], q[1] + ny * W[i]]); R.push([q[0] - nx * W[i], q[1] - ny * W[i]]);
  });
  return [...L, ...R.reverse()];
};

/** Pebbles and small shell specks near the camera: the floor's scale and texture (hazed with distance). */
const pebbles = (p: Painter, c: YCam, L: SeaLight, zFar: number, zNear: number) => {
  for (let i = 0; i < 90; i++) {
    const z = zNear - 1.5 - ((i * 0.618) % 1) ** 1.6 * 40, x = c.x - 9 + ((i * 0.377) % 1) * 18;
    if (z < zFar) continue;
    const v: V3 = [x, bedY(z), z], q = camPoint(c, v, 1);
    if (!q) continue;
    const k = camUnit(c, v), d = Math.abs(camDepth(c, v)), r = (0.04 + ((i * 0.53) % 1) * 0.08) * k;
    const col = mixColor(i % 4 ? mixColor(sandAt(bedY(z)), '#1d2a33', 0.35) : mixColor(sandAt(bedY(z)), '#e8e2d0', 0.35), rayWater(c, 0, L), Math.min(1, d / 30));
    hardFill(p, 5240 + i, col, ell(q[0], q[1], r, r * 0.5, 8));
  }
};

/** Finished grade (W3 LF02): rock outcrops on the slope as lit boulder clusters with a dark foot, sea pens and ooze mottling on the deep floor,
 *  seagrass tufts and litter (a tyre, a lost sandal) on the flat, sand ripples as dashes; everything hazed toward the water by distance. */
const props = (p: Painter, c: YCam, L: SeaLight, zFar: number, zNear: number) => {
  const hz = (v: V3, far: number) => Math.min(0.92, Math.abs(camDepth(c, v)) / far);
  const farD = c.y < -20 ? 28 : 55;
  // sand ripples on the flat and the upper slope (perpendicular to the shore: dashes along x)
  planeDashes(p, c, 5800, (u, v) => { const z = Math.min(zNear, -16) - v * v * 120; return [c.x - 14 + u * 28, bedY(z) + 0.01, z]; }, {n: 260, col: (i) => {
    const z = Math.min(zNear, -16) - hash(5800 + i * 2.71 + 0.5) ** 2 * 120, y = bedY(z);
    return mixColor(mixColor(sandAt(y), '#3f5560', 0.12), rayWater(c, 0, L), hz([c.x, y, z], farD));
  }, len: 0.014, w: 0.04});
  // rock clusters on the slope (z -95 .. -150) and a few on the deep floor
  for (let i = 0; i < 26; i++) {
    const z = -92 - hash(5900 + i) * 70, x = (hash(5930 + i) - 0.5) * 34;
    if (z < zFar || z > zNear || Math.abs(x - cableAt(z)[0]) < 1.4) continue;
    const y = bedY(z), base = camPoint(c, [x, y, z]);
    if (!base) continue;
    const k = camUnit(c, [x, y, z]), f = Math.min(0.95, (Math.abs(camDepth(c, [x, y, z])) / (c.y < -20 ? 30 : 56)) ** 0.8), sz = 0.7 + hash(5960 + i) * 1.4;
    const fog = mixColor(rayWater(c, 0, L), waterAt(y, L), 0.4);
    const rock = mixColor(mixColor(C.rock, '#4a5e66', 0.3), fog, f), lit = mixColor(mixColor(C.rock, '#7f9a9a', 0.45), fog, f), foot = mixColor('#14222a', fog, f);
    hardFill(p, 6000 + i * 4, foot, ell(base[0], base[1], sz * 1.3 * k, sz * 0.25 * k, 14));
    [[0, 1], [-0.7, 0.65], [0.75, 0.55]].forEach(([dx, s0], j) => {
      const r = sz * s0 * k, cx = base[0] + dx * sz * k, cy = base[1] - r * 0.55;
      hardFill(p, 6001 + i * 4 + j, rock, [[cx - r, base[1]], [cx - r * 0.8, cy - r * 0.2], [cx - r * 0.2, cy - r * 0.6], [cx + r * 0.5, cy - r * 0.45], [cx + r, base[1]]]);
      hardFill(p, 6100 + i * 4 + j, lit, [[cx - r * 0.8, cy - r * 0.2], [cx - r * 0.2, cy - r * 0.6], [cx + r * 0.5, cy - r * 0.45], [cx + r * 0.1, cy - r * 0.15], [cx - r * 0.5, cy]]);
    });
  }
  // deep floor: ooze mottling and sea pens
  for (let i = 0; i < 60; i++) {
    const z = -150 - hash(6200 + i) ** 1.5 * 200, x = (hash(6260 + i) - 0.5) * 40;
    if (z < zFar || z > zNear) continue;
    const y = bedY(z), q = camPoint(c, [x, y, z]);
    if (!q) continue;
    const k = camUnit(c, [x, y, z]), f = hz([x, y, z], farD);
    if (i % 3) hardFill(p, 6300 + i, mixColor(mixColor(C.ooze, '#1f2a30', 0.3), waterAt(y, L), f), ell(q[0], q[1], 0.6 * k, 0.12 * k, 12));
    else inkLine(p, 6300 + i, [q, [q[0] + 0.05 * k, q[1] - 0.4 * k]], {closed: false, color: mixColor('#c98a7a', waterAt(y, L), Math.min(0.85, f)), weight: Math.max(0.5, 0.04 * k), still: true});
  }
  // seagrass tufts on the flat (blades, not blobs)
  for (let i = 0; i < 40; i++) {
    const z = -18 - hash(6400 + i) * 62, x = (hash(6450 + i) - 0.5) * 40;
    if (z < zFar || z > zNear) continue;
    const y = bedY(z), q = camPoint(c, [x, y, z]);
    if (!q) continue;
    const k = camUnit(c, [x, y, z]), col = mixColor(C.seagrass, waterAt(y, L), hz([x, y, z], farD));
    for (let j = 0; j < 6; j++) { const a = -Math.PI / 2 + (j - 2.5) * 0.18, l = (0.35 + hash(6500 + i * 6 + j) * 0.3) * k; inkLine(p, 6520 + i * 6 + j, [[q[0] + (j - 2.5) * 0.04 * k, q[1]], [q[0] + Math.cos(a) * l * 0.5 + 0.05 * k, q[1] + Math.sin(a) * l * 0.55], [q[0] + Math.cos(a) * l + 0.1 * k, q[1] + Math.sin(a) * l]], {closed: false, color: col, weight: Math.max(0.6, 0.03 * k), still: true, curve: 0.5}); }
  }
  // village litter on the flat: an old tyre and a lost sandal
  const tyre: V3 = [-3.2, bedY(-62), -62], tq = camPoint(c, tyre);
  if (tq && -62 <= zNear && -62 >= zFar) { const k = camUnit(c, tyre), f = hz(tyre, farD); inkLine(p, 6800, ell(tq[0], tq[1] - 0.12 * k, 0.32 * k, 0.12 * k, 18), {color: mixColor('#22262a', waterAt(tyre[1], L), f), weight: Math.max(1, 0.08 * k), still: true}); }
  const sandal: V3 = [2.4, bedY(-55), -55], sq = camPoint(c, sandal);
  if (sq && -55 <= zNear && -55 >= zFar) { const k = camUnit(c, sandal); hardFill(p, 6801, mixColor('#3a6a9a', waterAt(sandal[1], L), hz(sandal, farD)), ell(sq[0], sq[1], 0.13 * k, 0.04 * k, 10, 0.3)); }
};

/** Caustic net on the sand under shallow water (world-space, fading with depth): short bright curved strokes. */
const caustics = (p: Painter, c: YCam, zFar: number, zNear: number) => {
  for (let i = 0; i < 140; i++) {
    const z = Math.min(zNear, -2) - hash(7000 + i) ** 1.6 * 110, x = c.x + (hash(7200 + i) - 0.5) * 30, y = bedY(z), fade = Math.max(0, 1 - -y / 16);
    if (z < zFar || fade <= 0.05) continue;
    const q = camPoint(c, [x, y, z]);
    if (!q) continue;
    const k = camUnit(c, [x, y, z]), r = 0.35 * k;
    if (r < 2) continue;
    inkLine(p, 7400 + i, [[q[0] - r, q[1]], [q[0] - r * 0.2, q[1] - r * 0.18], [q[0] + r * 0.6, q[1] + r * 0.05]], {closed: false, color: mixColor(C.caustic, sandAt(y), 1 - fade * 0.55), weight: Math.max(0.6, 0.03 * k), still: true, curve: 0.5});
  }
};

/** A small school of silver fish in mid-water (lived-in sea), as picture-scaled darts. */
const fish = (p: Painter, c: YCam, L: SeaLight, at: V3) => {
  const q0 = camPoint(c, at);
  if (!q0) return;
  const k = camUnit(c, at);
  for (let i = 0; i < 14; i++) {
    const x = q0[0] + (hash(7600 + i) - 0.5) * 3.2 * k, y = q0[1] + (hash(7620 + i) - 0.5) * 1.2 * k, l = 0.22 * k;
    const col = mixColor('#c8dcdc', waterAt(at[1], L), 0.45);
    hardFill(p, 7640 + i, col, [[x - l, y], [x - l * 0.2, y - l * 0.22], [x + l * 0.5, y], [x - l * 0.2, y + l * 0.2]]);
    hardFill(p, 7660 + i, col, [[x + l * 0.45, y], [x + l * 0.8, y - l * 0.18], [x + l * 0.8, y + l * 0.18]]);
  }
};

/** False when the seabed hides world point `v` from the camera (the shelf edge over the slope): samples the sight line against y_bed. */
export const seen = (c: YCam, v: V3) => {
  for (let i = 1; i < 24; i++) { const u = i / 24, x = c.x + (v[0] - c.x) * u, y = c.y + (v[1] - c.y) * u, z = c.z + (v[2] - c.z) * u; void x; if (y < bedY(z) - 0.03) return false; }
  return true;
};
/** The cable with its own soft signal glow (always readable at depth, UT03) and travelling pulses at shot time `t`. */
export const paintCable = (p: Painter, c: YCam, zFar: number, zNear: number, o: {t?: number; glow?: number; step?: number; free?: boolean; pulses?: number[]} = {}) => {
  const pts: Pt[] = [], ws: number[] = [], nearP = o.free ? (c.near ?? 0.3) : 0.3;
  // `free` (Boss W5): no clamp at the camera's z, for cameras that look across the cable (yaw 90 deep shots); `step` samples finer for close cameras
  for (let z = o.free ? zNear : Math.min(zNear, c.z - 0.2); z >= zFar; z -= o.step ?? 0.5) {
    const v = cableAt(z), q = camPoint(c, v, nearP);
    if (!q || !seen(c, v)) { if (pts.length) break; continue; }
    pts.push(q); ws.push(camUnit(c, v));
  }
  if (pts.length < 2) return;
  const g = o.glow ?? 1;
  // glow halo, then the dark sheath, as flat ribbons in runs (a rotring line lumps at these widths), then a thin highlight
  const hw = ws.map((w) => Math.max(0.7, 0.01 * w));
  for (let i0 = 0, r = 0; i0 < pts.length - 1; i0 += 12, r++) {
    const P = pts.slice(i0, i0 + 13), W = hw.slice(i0, i0 + 13);
    if (g > 0) hardFill(p, 5300 + r, mixColor(C.glow, '#0f2a40', 0.62 - 0.25 * g), ribbon(P, W.map((w) => w * 2.6 + 0.8)));
    hardFill(p, 5400 + r, C.cable, ribbon(P, W));
  }
  inkLine(p, 5299, pts, {closed: false, color: mixColor(C.cableHi, C.glow, 0.35), weight: 0.5, still: true, curve: 0});
  if (o.free && hw[0] > 6) {
    // close range (Boss W5, N15): armour lay and a lit top strip so the sheath reads as a round tube, and a thin glow rim on its top edge
    const off = (P: Pt[], W: number[], s: number): Pt[] => P.map((q, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, sg = dx >= 0 ? 1 : -1; return [q[0] + (dy / n) * W[i] * s * sg, q[1] - (dx / n) * W[i] * s * sg] as Pt; });
    const hi0 = off(pts, hw, 0.78), hi1 = off(pts, hw, 0.38);
    hardFill(p, 5480, mixColor(C.armour, C.cableHi, 0.55), [...hi0, ...hi1.reverse()]);
    hardFill(p, 5481, mixColor(C.cable, '#000000', 0.25), [...off(pts, hw, -0.55), ...off(pts, hw, -1).reverse()]);
    inkLine(p, 5482, off(pts, hw, 1.02), {closed: false, color: mixColor(C.glow, C.cableHi, 0.35), weight: 1.2, still: true, curve: 0});
    for (let i = 1; i < pts.length - 1; i += Math.max(1, Math.round(hw[0] / 4))) {
      const a = off([pts[i - 1], pts[i], pts[i + 1]], [hw[i], hw[i], hw[i]], 0.95)[1], b = off([pts[i - 1], pts[i], pts[i + 1]], [hw[i], hw[i], hw[i]], -0.95)[1];
      inkLine(p, 5483 + (i % 400), [a, [b[0] + hw[i] * 0.5, b[1]]], {closed: false, color: mixColor(C.cable, C.cableHi, 0.25), weight: 0.6, still: true, curve: 0});
    }
  }
  // pulses: bright dots every ~6 m moving away from the camera
  const t = o.t ?? 0, zs = o.pulses ?? Array.from({length: 40}, (_, k) => zNear - ((k * 6 + t * 12) % (zNear - zFar)));
  for (let k = 0; k < zs.length; k++) {
    const z = zs[k];
    const v = cableAt(z), q = camPoint(c, v, o.free ? nearP : 0.4);
    if (!q || !seen(c, v)) continue;
    const r = Math.max(1.5, 0.05 * camUnit(c, v, o.free ? nearP : undefined));
    washAt(p, 5500 + k, C.glow, 120, ell(q[0], q[1], r * 2.4, r * 1.2, 10), 0.1, 0);
    hardFill(p, 5550 + k, C.core, ell(q[0], q[1], r * 0.8, r * 0.5, 8));
  }
};

/** Light shafts from the surface (picture-space slanted bands, fading with depth) and drifting particles. */
const shafts = (p: Painter, c: YCam) => {
  const k = Math.max(0, 1 - -c.y / 14);
  if (k <= 0) return;
  [[220, 140], [470, 90], [700, 160], [900, 80]].forEach(([x, w], i) => {
    washAt(p, 5600 + i, '#e8f7e0', 60 * k, [[x - w / 2, -40], [x + w / 2, -40], [x + w / 2 + 260, 1500], [x - w / 2 + 160, 1500]], 0.3, 0.2);
  });
};
const particles = (p: Painter, c: YCam, L: SeaLight) => {
  for (let i = 0; i < 60; i++) {
    const x = ((i * 0.618) % 1) * 1080, y = ((i * 0.377) % 1) * 1900, r = 1.5 + ((i * 0.53) % 1) * 2.5;
    hardFill(p, 5700 + i, mixColor('#cfe8e8', waterAt(c.y, L), 0.55), ell(x, y, r, r, 6));
  }
};

/** Seabed in strips by distance along the camera's look (Boss W5): any yaw, lateral edges sampled so a strip follows the slope; hazed by
 *  distance. Used by the shots that look across or back up the slope (B03, B04); `bed` (above) stays the look-frame floor for -z cameras. */
const bedView = (p: Painter, c: YCam, L: SeaLight, dMin: number) => {
  const fx = Math.sin(c.yaw), fz = -Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = Math.sin(c.yaw), n = 64, m = 18, dMax = 260;
  const far = c.y < -20 ? 30 : 60, fogCol = (y: number) => mixColor(rayWater(c, 0, L), waterAt(y, L), 0.5);
  const at = (d: number, s: number): V3 => { const x = c.x + fx * d + rx * s, z = c.z + fz * d + rz * s; return [x, bedY(z), z]; };
  for (let i = 0; i < n; i++) {
    const dAt = (j: number) => dMin + (dMax - dMin) * (j / n) ** 2.4, d0 = dAt(i), d1 = dAt(i + 1), w0 = d0 * 1.3 + 1, w1 = d1 * 1.3 + 1;
    const pts: V3[] = [];
    for (let j = 0; j <= m; j++) pts.push(at(d0, -w0 + (2 * w0 * j) / m));
    for (let j = m; j >= 0; j--) pts.push(at(d1, -w1 + (2 * w1 * j) / m));
    const q = wp(c, pts);
    if (!ok(q)) continue;
    const ym = at((d0 + d1) / 2, 0)[1], hz = Math.min(1, ((d0 + d1) / 2 / far) ** 0.8);
    const col = mixColor(mixColor(sandAt(ym), '#6f8fa0', 0.3 * L.amb * Math.min(1, -ym / 40)), fogCol(ym), hz);
    hardFill(p, 5100 + i, i % 2 ? col : mixColor(col, '#000000', 0.035), q);
  }
};

export type SeaOpts = {light?: SeaLight; zFar?: number; zNear?: number; t?: number; fish?: V3;
  /** 'view' paints the floor by distance along the look (any yaw; Boss W5). */
  bed?: 'view';
  /** Cable override for cameras that look across it: its own z range, sampling step and pulse positions (Boss W5). */
  cable?: {zFar: number; zNear: number; step?: number; pulses?: number[]; glow?: number};
  /** Skip the generic props (rocks, ooze, seagrass) when a shot places its own. */
  noProps?: boolean;
  /** Explicit pulse z positions on the default cable (Boss W5). */
  pulses?: number[];
  /** Glow pool strength 0..1 on the default cable (default on). */
  pool?: boolean;
};
export const paintSea = (p: Painter, c: YCam, o: SeaOpts = {}) => {
  const L = o.light ?? {amb: 0}, zFar = o.zFar ?? -700, zNear = o.zNear ?? Math.min(0, c.z + 2);
  water(p, c, L);
  shafts(p, c);
  if (o.bed === 'view') bedView(p, c, L, Math.max(0.01, c.near ?? 0.3)); else bed(p, c, L, zFar, zNear);
  caustics(p, c, zFar, zNear);
  if (!o.noProps) props(p, c, L, zFar, zNear);
  pebbles(p, c, L, zFar, zNear);
  if (o.cable) paintCable(p, c, o.cable.zFar, o.cable.zNear, {t: o.t ?? 0.4, glow: o.cable.glow ?? 1, step: o.cable.step, free: true, pulses: o.cable.pulses});
  else { if (o.pool !== false) glowPool(p, c, zFar, zNear); paintCable(p, c, zFar, zNear, {t: o.t ?? 0.4, glow: 1, pulses: o.pulses}); }
  if (o.fish) fish(p, c, L, o.fish);
  particles(p, c, L);
};

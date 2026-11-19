import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, wFill, wInk} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {buildBellTent, placeBuild} from './props';

// SPACE P, the Campion wheat paddock in 1932 (`new: wheat-paddock-1932`, VD30-02; Film W3 look asset 2026-11-19, Boss hardens). Painted in
// full colour; the newsreel layer (newsreel.tsx) tints it. Value plan under the tint (brief): white-hot pale sky lightest, pale gold wheat light,
// red-brown earth and khaki mid, emus the darkest mass. World: metres, origin on the ground at G1's tripod, +x right in the master view,
// +y up, +z toward the fence and the track (south); north = -z. Plan in film-brief.md #set-plans.

export const PAD = {
  skyTop: '#d4dee2', skyHaze: '#f3eedf', skyLow: '#f6f0de', scrub: '#5e6a4a', scrubFar: '#8e9478', wheat: '#d8bd76', wheatLit: '#e6cf8e', wheatShade: '#ae9257',
  wheatEar: '#c9a75c', stubble: '#c8ad78', earth: '#9a5a38', earthLight: '#b67a52', track: '#a8653f', rut: '#7d4a2e', verge: '#c4ad7c', post: '#6b5a44', wire: '#4a4036',
  gumTrunk: '#d9c3b0', gumTrunkShade: '#a58f80', gumLeaf: '#6f7a58', gumLeafDark: '#4e5a40', iron: '#9a9c96', ironShade: '#6d6f6a',
} as const;
export type PadLight = 'morning' | 'west';
/** NE morning sun (southern hemisphere, north = -z) and the low west retreat sun (VD30-02). */
export const SUN: Record<PadLight, V3> = {morning: [0.45, 0.8, -0.4], west: [-0.85, 0.3, 0.1]};

const h = (n: number) => { const s = Math.sin(n * 91.345 + 47.123) * 43758.5453; return s - Math.floor(s); };
/** Picture row of the horizon for this camera (pitch aware). */
export const horizonRow = (c: YCam) => camPoint(c, [c.x + 5000 * Math.sin(c.yaw), c.y, c.z - 5000 * Math.cos(c.yaw)])?.[1] ?? c.hy;

export const paintPadSky = (p: Painter, c: YCam, light: PadLight = 'morning') => {
  const hz = horizonRow(c);
  const cool = light === 'west';
  paintSkyBands(p, {from: cool ? '#b8c2c8' : PAD.skyTop, via: cool ? '#d8d2c2' : PAD.skyHaze, viaAt: 0.6, to: cool ? '#efd9b4' : PAD.skyLow, horizon: hz + 12, width: 1080, top: -200, bands: 9});
};

/** A ring of mallee scrub on the horizon at radius `r` (m) round the camera, bumpy top 2.5-6 m, painted in segments in front of the lens. */
export const paintScrub = (p: Painter, c: YCam, seed: number, r = 260, color: string = PAD.scrubFar) => {
  const N = 72;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, pts: V3[] = [];
    const K = 6;
    for (let k = 0; k <= K; k++) { const a = a0 + (a1 - a0) * (k / K), hh = 2.5 + 3.5 * h(i * 13 + k) * (0.6 + 0.4 * Math.sin(i * 0.7)); pts.push([c.x + r * Math.cos(a), hh, c.z + r * Math.sin(a)]); }
    pts.push([c.x + r * Math.cos(a1), -0.5, c.z + r * Math.sin(a1)], [c.x + r * Math.cos(a0), -0.5, c.z + r * Math.sin(a0)]);
    const q = pts.map((v) => camPoint(c, v));
    if (q.every(Boolean)) hardFill(p, seed + i, mixColor(color, '#6a705a', h(i) * 0.3), q as Pt[]);
  }
};

/** The paddock ground: dry verge everywhere, the wheat field north of the fence (as its canopy plane at 0.85 m when the lens is above it),
 *  the eaten patch, the red dirt track with ruts, the gun clearing. `eaten` grows the patch (0..1). */
export const CLEARING = {c: [-0.3, -0.4] as [number, number], r: 3.7};
export const clearingPts = (y = 0): V3[] => Array.from({length: 28}, (_, i) => { const a = (i / 28) * Math.PI * 2, rr = CLEARING.r * (0.9 + 0.18 * h(i * 3.1)); return [CLEARING.c[0] + rr * Math.cos(a), y, CLEARING.c[1] + rr * Math.sin(a)]; });
export const WHEAT_H = 0.85;

export const paintPadGround = (p: Painter, c: YCam, seed: number, o: {eaten?: number; light?: PadLight} = {}) => {
  const above = c.y > WHEAT_H + 0.05, R = 600;
  wFill(p, c, seed, PAD.verge, [[c.x - R, 0, c.z - R], [c.x + R, 0, c.z - R], [c.x + R, 0, c.z + R], [c.x - R, 0, c.z + R]]);
  // wheat field: from far north to the fence (z +6)
  const wy = above ? WHEAT_H : 0;
  wFill(p, c, seed + 1, PAD.wheat, [[-R, wy, -R], [R, wy, -R], [R, wy, 6], [-R, wy, 6]]);
  // value bands on the field (light ripples, so the plain is not one flat fill)
  for (let k = 0; k < 9; k++) { const z0 = -12 - k * k * 4.5, z1 = z0 - 3 - k * 2; wFill(p, c, seed + 10 + k, k % 2 ? PAD.wheatLit : mixColor(PAD.wheat, PAD.wheatShade, 0.35), [[-R, wy + 0.001, z0], [R, wy + 0.001, z0], [R, wy + 0.001, z1], [-R, wy + 0.001, z1]]); }
  // the eaten patch: bare red-brown earth with flattened stalks, x -25..25, z -60..-20 (grows)
  const e = o.eaten ?? 0.4, ex = 6 + 19 * e, ez0 = -40 + 20 * e, ez1 = -40 - 20 * e;
  wFill(p, c, seed + 30, PAD.earth, Array.from({length: 18}, (_, i) => { const a = (i / 18) * Math.PI * 2; return [ex * Math.cos(a) * (0.85 + 0.25 * h(i + 7)), 0.02, (ez0 + ez1) / 2 + ((ez0 - ez1) / 2) * Math.sin(a) * (0.85 + 0.25 * h(i + 3))] as V3; }));
  // fence-side wheat wall (seen from the track side)
  if (c.z > 6) wFill(p, c, seed + 40, PAD.wheatShade, [[-R, 0, 6], [R, 0, 6], [R, WHEAT_H, 6], [-R, WHEAT_H, 6]]);
  // track: red dirt along x, z 7.5..11.5, two ruts
  wFill(p, c, seed + 50, PAD.track, [[-R, 0.005, 7.5], [R, 0.005, 7.5], [R, 0.005, 11.5], [-R, 0.005, 11.5]]);
  for (const [k, zr] of [[0, 8.7], [1, 10.4]] as const) wFill(p, c, seed + 51 + k, PAD.rut, [[-R, 0.01, zr - 0.18], [R, 0.01, zr - 0.18], [R, 0.01, zr + 0.18], [-R, 0.01, zr + 0.18]]);
};

/** Wheat ears as short strokes over the field between `d0` and `d1` m from the camera, in front of the lens (the mid texture band). */
export const paintWheatTexture = (p: Painter, c: YCam, seed: number, d0 = 4, d1 = 60, n = 900) => {
  const top = c.y > WHEAT_H + 0.05 ? WHEAT_H : WHEAT_H;
  for (let i = 0; i < n; i++) {
    const a = c.yaw + (h(i * 2.3) - 0.5) * 1.4, d = d0 + (d1 - d0) * h(i * 5.7) ** 1.6;
    const x = c.x + d * Math.sin(a), z = c.z - d * Math.cos(a);
    if (z > 5.8 || inClearing(x, z, 0.3) || inEaten(x, z)) continue;
    const b = camPoint(c, [x, top - 0.18, z]), t = camPoint(c, [x + 0.03, top + 0.06, z]);
    if (!b || !t || b[1] < -50 || b[1] > 2000) continue;
    inkLine(p, seed + 1 + i, [b, t], {closed: false, weight: Math.max(0.5, Math.min(2.2, camUnit(c, [x, 0, z]) * 0.012)), color: h(i * 9.1) > 0.5 ? PAD.wheatEar : PAD.wheatShade, still: true});
  }
};
export const inClearing = (x: number, z: number, pad = 0) => Math.hypot(x - CLEARING.c[0], z - CLEARING.c[1]) < CLEARING.r + pad;
const inEaten = (x: number, z: number) => Math.abs(x) < 14 && z < -28 && z > -52;

/** The gun clearing: trampled stubble floor and the standing-wheat wall round it (inner faces seen from inside, painted far to near). */
export const paintClearing = (p: Painter, c: YCam, seed: number) => {
  const fl = clearingPts(0.012);
  wFill(p, c, seed, PAD.stubble, fl);
  for (let k = 0; k < 14; k++) {   // flattened stalks: straw strokes on the floor
    const a = h(k * 4.1) * 6.283, rr = CLEARING.r * 0.85 * Math.sqrt(h(k * 7.3)), x = CLEARING.c[0] + rr * Math.cos(a), z = CLEARING.c[1] + rr * Math.sin(a), b = h(k * 1.9) * 3.1;
    wInk(p, c, seed + 10 + k, [[x, 0.02, z], [x + 0.5 * Math.cos(b), 0.02, z + 0.5 * Math.sin(b)]], {closed: false, weight: 1.2, color: PAD.wheatShade});
  }
  const pts = clearingPts(0), segs = pts.map((a, i) => ({a, b: pts[(i + 1) % pts.length], i}));
  const d = (v: V3) => Math.hypot(v[0] - c.x, v[2] - c.z);
  segs.sort((s1, s2) => d(s2.a) + d(s2.b) - d(s1.a) - d(s1.b)).forEach(({a, b, i}) => {
    const hA = WHEAT_H * (0.92 + 0.12 * h(i)), hB = WHEAT_H * (0.92 + 0.12 * h(i + 1));
    const q = wFill(p, c, seed + 100 + i, mixColor(PAD.wheatShade, PAD.wheat, 0.6 + 0.3 * h(i * 2)), [a, b, [b[0], hB, b[2]], [a[0], hA, a[2]]]);
    if (q.length > 2) for (let k = 0; k < 10; k++) {   // stalk strokes on the wall face
      const u = (k + 0.5) / 10, x = a[0] + (b[0] - a[0]) * u, z = a[2] + (b[2] - a[2]) * u;
      wInk(p, c, seed + 600 + i * 12 + k, [[x, 0, z], [x + 0.01, (hA + (hB - hA) * u) - 0.05, z]], {closed: false, weight: 0.9, color: mixColor(PAD.wheatShade, '#6a5232', 0.3)});
    }
    if (q.length > 2) {   // ears along the top edge
      for (let k = 0; k < 7; k++) {
        const u = (k + 0.5) / 7, x = a[0] + (b[0] - a[0]) * u, z = a[2] + (b[2] - a[2]) * u, yy = hA + (hB - hA) * u;
        wInk(p, c, seed + 300 + i * 8 + k, [[x, yy - 0.12, z], [x + 0.02, yy + 0.07, z]], {closed: false, weight: 1.4, color: k % 2 ? PAD.wheatEar : PAD.wheatShade});
      }
    }
  });
};

/** Foreground stalks near the lens (bottom of frame), darker and lower in contrast than the midground (UT12a). `spots` world points. */
export const paintNearStalks = (p: Painter, c: YCam, seed: number, spots: V3[]) => {
  spots.forEach((s, i) => {
    for (let k = 0; k < 9; k++) {
      const x = s[0] + (h(i * 11 + k) - 0.5) * 0.5, z = s[2] + (h(i * 7 + k * 3) - 0.5) * 0.3, hh = WHEAT_H * (0.85 + 0.25 * h(i + k * 5)), lean = (h(k * 2 + i) - 0.5) * 0.12;
      const b = camPoint(c, [x, 0, z]), t = camPoint(c, [x + lean, hh, z]), ear = camPoint(c, [x + lean * 1.25, hh + 0.13, z]);
      if (!b || !t || !ear) continue;
      const w = camUnit(c, [x, hh, z]);
      inkLine(p, seed + i * 40 + k, [b, t], {closed: false, weight: Math.max(1, w * 0.008), color: mixColor(PAD.wheatShade, '#4a3a22', 0.45), still: true});
      const ex = ear[0] - t[0], ey = ear[1] - t[1], wd = Math.max(3, w * 0.014);
      hardFill(p, seed + i * 40 + 20 + k, mixColor(PAD.wheatEar, '#5a4528', 0.4), [[t[0] - wd, t[1]], [t[0] + ex * 0.5 - wd * 1.1, t[1] + ey * 0.5], [ear[0], ear[1]], [t[0] + ex * 0.5 + wd * 1.1, t[1] + ey * 0.5], [t[0] + wd, t[1]]]);
    }
  });
};

/** Post-and-wire fence along z +6 (posts 1.1 m every 3 m, three wires), with the gate gap x -4..-1. */
export const paintFence = (p: Painter, c: YCam, seed: number, x0 = -60, x1 = 60) => {
  for (let x = x0; x <= x1; x += 3) {
    if (x > -4 && x < -1) continue;
    paintBox(p, c, seed + Math.round(x + 100), {x0: x - 0.05, x1: x + 0.05, y0: 0, y1: 1.1, z0: 5.95, z1: 6.05}, PAD.post, {}, {});
  }
  for (const [k, y] of [[0, 0.35], [1, 0.7], [2, 1.02]] as const) for (const [a, b] of [[x0, -4], [-1, x1]] as const) wInk(p, c, seed + 300 + k * 2 + (a === x0 ? 0 : 1), [[a, y, 6], [b, y, 6]], {closed: false, weight: 0.7, color: PAD.wire});
  // the gate: a five-bar frame swung open
  paintBox(p, c, seed + 400, {x0: -4.05, x1: -3.95, y0: 0, y1: 1.2, z0: 5.9, z1: 6.1}, PAD.post);
  for (const [k, y] of [[0, 0.25], [1, 0.55], [2, 0.85], [3, 1.1]] as const) wInk(p, c, seed + 410 + k, [[-4, y, 6], [-3.2, y, 8.6]], {closed: false, weight: 1.3, color: '#7e6c52'});
};

/** Salmon gum: smooth pale pinkish trunk forking high, sparse clumped canopy (washes), at `at` with height `ht`. */
export const paintGum = (p: Painter, c: YCam, seed: number, at: V3, ht: number, light: PadLight = 'morning') => {
  const [x, , z] = at, tw = ht * 0.028, sx = SUN[light][0] > 0 ? 1 : -1;
  const trunk: V3[] = [[x - tw, 0, z], [x + tw, 0, z], [x + tw * 0.7, ht * 0.55, z], [x - tw * 0.7, ht * 0.55, z]];
  const q = wFill(p, c, seed, PAD.gumTrunk, trunk);
  if (q.length > 2) wFill(p, c, seed + 1, PAD.gumTrunkShade, [[x - tw * sx, 0, z], [x - tw * sx * 0.2, 0, z], [x - tw * 0.2 * sx, ht * 0.55, z], [x - tw * 0.7 * sx, ht * 0.55, z]]);
  for (const [k, dx] of [[0, -0.18], [1, 0.22]] as const) wFill(p, c, seed + 2 + k, PAD.gumTrunk, [[x - tw * 0.6, ht * 0.5, z], [x + tw * 0.6, ht * 0.5, z], [x + dx * ht + tw * 0.3, ht * 0.85, z], [x + dx * ht - tw * 0.3, ht * 0.85, z]]);
  for (let k = 0; k < 7; k++) {
    const cx = x + (h(seed + k) - 0.5) * ht * 0.6, cy = ht * (0.72 + 0.25 * h(seed + k * 3)), r = ht * (0.1 + 0.07 * h(seed + k * 5));
    const s = camPoint(c, [cx, cy, z]);
    if (!s) continue;
    const rp = r * camUnit(c, [cx, cy, z]);
    const blob: Pt[] = Array.from({length: 14}, (_, i) => { const a = (i / 14) * 6.283; return [s[0] + rp * Math.cos(a) * (0.85 + 0.3 * h(k * 17 + i)), s[1] + rp * 0.62 * Math.sin(a) * (0.85 + 0.3 * h(k * 13 + i))]; });
    hardFill(p, seed + 20 + k, k % 3 ? PAD.gumLeaf : PAD.gumLeafDark, blob);
  }
  const sh: V3[] = Array.from({length: 14}, (_, i) => { const a = (i / 14) * 6.283; return [x + ht * 0.25 * Math.cos(a) + ht * 0.1, 0.01, z + ht * 0.18 * Math.sin(a) + ht * 0.08]; });
  wFill(p, c, seed + 40, mixColor(PAD.verge, '#5a4a32', 0.35), sh);
};

/** Far farmhouse: corrugated iron walls and roof, veranda, a water tank on a stand. */
export const paintFarmhouse = (p: Painter, c: YCam, seed: number, at: V3) => {
  const [x, , z] = at;
  paintBox(p, c, seed, {x0: x - 6, x1: x + 6, y0: 0, y1: 3, z0: z - 4, z1: z + 4}, PAD.iron, {}, {});
  wFill(p, c, seed + 10, PAD.ironShade, [[x - 6.5, 3, z + 4.5], [x + 6.5, 3, z + 4.5], [x + 6.5, 4.6, z], [x - 6.5, 4.6, z]]);
  paintBox(p, c, seed + 20, {x0: x + 8, x1: x + 10, y0: 3, y1: 5.2, z0: z - 1, z1: z + 1}, '#8a8c84');
  for (const dx of [8.1, 9.9]) wInk(p, c, seed + 30 + dx, [[x + dx, 0, z], [x + dx, 3, z]], {closed: false, weight: 0.8, color: '#4a4a44'});
};

/** Camp: the bell tent and a water drum. */
export const paintCamp = (p: Painter, c: YCam, seed: number, light: PadLight = 'morning') => {
  placeBuild(p, c, buildBellTent(), [-14, 0, 14], 0.6, {seed, sun: SUN[light]});
  paintBox(p, c, seed + 50, {x0: -11.8, x1: -11.2, y0: 0, y1: 0.9, z0: 12.7, z1: 13.3}, '#5d5a50', {}, {ink: true});
};

let noClearing = false;
export const setNoClearing = (v: boolean) => { noClearing = v; };
const inWheat = (x: number, z: number) => z < 5.9 && (noClearing || !inClearing(x, z, 0.05)) && !inEaten(x, z);
/** Standing wheat as stacked ridges round the camera (far to near): each ridge a band from the ground to the ear line at one radius, with a
 *  bumpy ear-top edge, alternating lit and shaded values, only where the ground is wheat (not the clearing, the eaten patch or south of the
 *  fence). Near ridges carry ear strokes. This is what makes the plain read as a tall crop, at any camera height. */
export const paintWheatRidges = (p: Painter, c: YCam, seed: number, o: {r0?: number; r1?: number; rows?: number; fov?: number; light?: PadLight} = {}) => {
  const r0 = o.r0 ?? 2.5, r1 = o.r1 ?? 140, rows = o.rows ?? 26, fov = o.fov ?? 0.75, S = 64;
  for (let k = rows - 1; k >= 0; k--) {
    const r = r0 * Math.pow(r1 / r0, k / (rows - 1)), col = mixColor(PAD.wheat, k % 2 ? PAD.wheatLit : PAD.wheatShade, 0.25 + 0.35 * h(k * 7.7));
    let run: V3[] = [];
    const flush = () => {
      if (run.length >= 2) {
        const top = run, bottom = run.slice().reverse().map(([x, , z]) => [x, 0, z] as V3), q = [...top, ...bottom].map((v) => camPoint(c, v));
        if (q.every(Boolean)) hardFill(p, seed + k * 97 + run.length, col, q as Pt[]);
        if (r < 12) top.forEach((v, i) => {   // stalks on the ridge face (vertical strokes), then the ears on its top
          const g = camPoint(c, [v[0], 0, v[2]]), t = camPoint(c, [v[0] + 0.01, v[1] - 0.05, v[2]]);
          if (g && t && h(k * 71 + i) > 0.35) inkLine(p, seed + 9000 + k * 200 + i, [g, t], {closed: false, weight: Math.max(0.6, 12 / r), color: mixColor(PAD.wheatShade, '#6a5232', 0.35), still: true});
        });
        if (r < 14) top.forEach((v, i) => { if (i % 2) return; const b = camPoint(c, [v[0], v[1] - 0.14, v[2]]), t = camPoint(c, [v[0] + 0.02, v[1] + 0.05, v[2]]); if (b && t) inkLine(p, seed + 5000 + k * 200 + i, [b, t], {closed: false, weight: Math.max(0.8, 26 / r), color: i % 4 ? PAD.wheatEar : PAD.wheatShade, still: true}); });
      }
      run = [];
    };
    for (let i = 0; i <= S; i++) {
      const a = c.yaw + (i / S - 0.5) * 2 * fov, x = c.x + r * Math.sin(a), z = c.z - r * Math.cos(a);
      if (inWheat(x, z)) run.push([x, WHEAT_H * (0.94 + 0.1 * h(k * 131 + i)), z]); else flush();
    }
    flush();
  }
};

/** KP-EMU stage: a patch of eaten ground (red-brown earth, straw strokes) round the bird, wheat beyond. */
export const paintKpPatch = (p: Painter, c: YCam, seed: number) => {
  wFill(p, c, seed, PAD.earthLight, Array.from({length: 20}, (_, i) => { const a = (i / 20) * Math.PI * 2; return [6.5 * Math.cos(a) * (0.9 + 0.2 * h(i)), 0.01, -1 + 5.5 * Math.sin(a) * (0.9 + 0.2 * h(i + 5))] as V3; }));
  for (let k = 0; k < 40; k++) { const x = -4 + h(k * 3.3) * 8, z = -5 + h(k * 5.9) * 7, b = h(k * 2.1) * 3.1; wInk(p, c, seed + 10 + k, [[x, 0.02, z], [x + 0.35 * Math.cos(b), 0.02, z + 0.35 * Math.sin(b)]], {closed: false, weight: 1.1, color: PAD.wheatShade}); }
};

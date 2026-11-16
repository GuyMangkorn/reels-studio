import {hardFill} from '../kit/draw';
import {mixColor, type Painter} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {bandPts, depth, ellPts, glow, hn, okPoly, P, poly, sugarPalm, wCut, wFlat, wShadow, wStroke, yAt} from './scenery';

// SET-PATH18 (EDU-EP18-BRIEF-R1 N10, space F; Film W3 look frame LF02B, 16 Nov 2026). Designed from the script before the kit: the walk home
// along a raised dirt bund between paddies at golden hour, the low sun straight behind her so the rice tips glow and her long shadow runs
// down the path toward the lens and across the snake lying in the dust. Calm far field (no mottle: flat depth bands), readable near rows.
// F: metres, origin on the bund centre line at the snake, +y up, -z toward her and the sun, so the camera at +z looks -z (world +x is screen
// right). Bund top y 0.35, 0.9 m wide; rice 0.6 m tall standing in paddy water y 0. Rice painter proposed for the kit at intake (N10).

export const PADDY = {
  skyTop: '#9fb7c9', skyMid: '#e8c79a', skyLow: '#f0c27e', sun: '#fff2c8', sunGlow: '#ffd690', rice: '#6fa63a', tip: '#c9d86a', riceShade: '#3f6a2a',
  dirt: '#a88058', dirtShade: '#6e5236', palm: '#2f3a2a', haze: '#e6c896', hill: '#8a9ab0', grass: '#7a8a3a',
};
/** Direction to the sun: low, straight behind her. W3 change: the brief's (-0.30, 0.20, -0.93) throws her shadow 0.3 m sideways per metre,
 *  which at this lens fans it off to the right of the frame (2000 px at the lens) and misses the snake; (-0.06, 0.20, -0.98) puts the disc
 *  just behind her (a backlight halo) and runs the shadow down the path, across the snake, toward the lens, as the brief's light line asks. */
export const SUN_F: V3 = [-0.06, 0.2, -0.978];
const hazeF = (col: string, d: number) => mixColor(col, PADDY.haze, Math.min(0.85, 0.15 + d / 260));
const BUND_Y = 0.35, BUND_W = 0.45, RICE_Y = 0.6;

/** A rice clump at (x, z) in world metres: a fan of dark blades and backlit tips; `k` scales it (near clumps are larger). */
const clump = (p: Painter, c: YCam, seed: number, x: number, z: number, base: number, top: number, k = 1) => {
  const d = depth(c, [x, top, z]);
  if (d < 0.35) return;
  const col = hazeF(mixColor(PADDY.riceShade, PADDY.rice, 0.3 * hn(seed)), d);
  const n = d < 3 ? 7 : 4;
  for (let i = 0; i < n; i++) {
    const lean = (i / (n - 1) - 0.5) * 0.5 * k + (hn(seed + i) - 0.5) * 0.12, h = (top - base) * (0.8 + 0.25 * hn(seed * 3 + i));
    const w = 0.012 * k;
    const blade: V3[] = [[x - w, base, z], [x + w, base, z], [x + lean * h * 0.9 + w * 0.3, base + h, z], [x + lean * h, base + h * 1.02, z]];
    wFlat(p, c, seed * 10 + i, col, blade);
    if (d < 9) wStroke(p, c, seed * 10 + i + 5, [[x + lean * h * 0.55, base + h * 0.62, z], [x + lean * h, base + h * 1.02, z]], hazeF(PADDY.tip, d * 0.5), d < 2 ? 1.6 : 0.8);
  }
};

/** Sky, sun, far hills, tree line, palms, the field to the horizon, the rice walls along the bund and the bund itself. */
export const paintPaddyBack = (p: Painter, c: YCam, o: {t: number}) => {
  paintSkyBands(p, {from: PADDY.skyTop, via: PADDY.skyMid, viaAt: 0.55, to: PADDY.skyLow, horizon: c.hy + 30, width: 1080, bands: 26, style: 'flat', seed: 38100});
  const sun = P(c, [c.x + SUN_F[0] * 1000, c.y + SUN_F[1] * 1000, c.z + SUN_F[2] * 1000]);
  if (sun) {
    [[620, 400, 16], [440, 290, 22], [300, 200, 30], [190, 140, 42]].forEach(([rx, ry, op], k) => glow(p, 38120 + k, PADDY.sunGlow, op, ellPts(sun[0], sun[1], rx, ry, 40)));
    paintSkyDisc(p, {x: sun[0], y: sun[1], r: 46, color: PADDY.sun, glow: 0.9, glowColor: PADDY.sunGlow, t: o.t, seed: 38130});
  }
  // low blue hill z -2500 and the village tree line z -400
  const hill: V3[] = [];
  for (let i = 0; i <= 40; i++) { const x = -3000 + i * 150; hill.push([x, 60 + 70 * Math.sin(i * 0.35 + 0.6) + 25 * hn(i), -2500]); }
  wCut(p, c, 38200, mixColor(PADDY.hill, PADDY.haze, 0.45), [...hill, [3000, -5, -2500], [-3000, -5, -2500]]);
  const trees: V3[] = [];
  for (let i = 0; i <= 200; i++) { const x = -400 + i * 4; trees.push([x, 8 + 4 * hn(i * 7) + 3 * Math.abs(Math.sin(i * 0.8)), -400]); }
  wCut(p, c, 38210, hazeF('#4a5a3a', 400), [...trees, [400, -1, -400], [-400, -1, -400]]);
  // three electric poles along a dirt lane at x -40
  [-30, -70, -110].forEach((z, i) => wFlat(p, c, 38220 + i, hazeF('#4a4440', -z), [[-40.1, 0, z], [-39.9, 0, z], [-39.92, 8, z], [-40.08, 8, z]]));
  // sugar palms in loose clusters z -60 .. -150
  ([[-14, -62, 15], [-11, -70, 17], [-17, -78, 13], [9, -88, 16], [12, -95, 18], [26, -120, 14], [-36, -135, 17], [4, -150, 12], [42, -70, 16]] as [number, number, number][])
    .sort((a, b) => a[1] - b[1]).forEach(([x, z, h], i) => sugarPalm(p, c, 38300 + i * 60, x, z, h, hazeF(PADDY.palm, -z * 0.8)));
  // the field top (y 0.6) as flat depth bands, golden-hazed far, green and backlit near
  const D = [400, 120, 60, 30, 18, 11, 7, 4.5, 3, 2, 1.4, 1.0, 0.7];
  D.forEach((d, i) => {
    const y0 = yAt(c, RICE_Y, d), y1 = i + 1 < D.length ? yAt(c, RICE_Y, D[i + 1]) : 1920, u = i / (D.length - 1);
    hardFill(p, 38400 + i, hazeF(mixColor(PADDY.tip, PADDY.rice, Math.min(1, u * 1.4)), d * 0.6), bandPts(y0, y1 + 1));
  });
  // a glint of paddy water between rows under the sun
  if (sun) for (let k = 0; k < 12; k++) {
    const d = 12 * Math.pow(0.8, k) + 2, x = c.x + SUN_F[0] / -SUN_F[2] * d + (hn(38450 + k) - 0.5) * 2, y = yAt(c, RICE_Y, d) + 2;
    const q = P(c, [x, RICE_Y, c.z - d]);
    if (q) hardFill(p, 38460 + k, mixColor(PADDY.tip, PADDY.sun, 0.6), [[q[0] - 30 / Math.sqrt(d), y], [q[0] + 30 / Math.sqrt(d), y], [q[0] + 20 / Math.sqrt(d), y + 2], [q[0] - 20 / Math.sqrt(d), y + 2]]);
  }
  // field rows: clumps on both sides of the bund, rows along z (readable near, sparse and hazed far)
  for (let side = -1; side <= 1; side += 2) {
    for (let r = 0; r < 9; r++) {
      const x = side * (BUND_W + 0.18 + r * 0.25);
      for (let z = -22; z < 1.6; z += 0.22 + Math.max(0, -z) * 0.04) clump(p, c, 38500 + side * 5000 + r * 400 + Math.round(z * 10), x + (hn(r * 31 + z) - 0.5) * 0.06, z, RICE_Y - 0.2, RICE_Y + 0.05 * hn(r + z), 1);
    }
  }
  // the bund: side faces (dark) then the top, depth-banded from lit far dirt to the shaded near path
  for (let side = -1; side <= 1; side += 2) wFlat(p, c, 38900 + side, PADDY.dirtShade, [[side * BUND_W, BUND_Y, -40], [side * BUND_W, BUND_Y, 1.6], [side * (BUND_W + 0.3), 0.1, 1.6], [side * (BUND_W + 0.3), 0.1, -40]]);
  const ZB = [-40, -12, -5, -2.5, -1.2, -0.4, 0.3, 0.8, 1.2];
  ZB.forEach((z0, i) => {
    if (i + 1 >= ZB.length) return;
    const z1 = ZB[i + 1], u = i / (ZB.length - 2);
    wFlat(p, c, 38910 + i, mixColor(mixColor(PADDY.dirt, PADDY.tip, 0.18), PADDY.dirtShade, u * 0.75), [[-BUND_W, BUND_Y, z0], [BUND_W, BUND_Y, z0], [BUND_W, BUND_Y, z1], [-BUND_W, BUND_Y, z1]]);
  });
  // cracks, grass tufts on the bund edges, two flip-flop prints
  for (let k = 0; k < 40; k++) {
    const x = (hn(39000 + k) - 0.5) * 0.8, z = -3 + 4.2 * hn(39100 + k), a = 6.28 * hn(39200 + k), L = 0.05 + 0.08 * hn(39300 + k);
    wStroke(p, c, 39400 + k, [[x, BUND_Y, z], [x + L * Math.cos(a), BUND_Y, z + L * Math.sin(a)], [x + L * Math.cos(a) + 0.04, BUND_Y, z + L * Math.sin(a) + 0.03]], mixColor(PADDY.dirtShade, '#2a2018', 0.4), 0.6);
  }
  for (let k = 0; k < 34; k++) {
    const side = k % 2 ? 1 : -1, z = -8 + 9.4 * hn(39500 + k), x = side * (BUND_W - 0.04 - 0.08 * hn(39600 + k));
    clump(p, c, 39700 + k, x, z, BUND_Y, BUND_Y + 0.08 + 0.06 * hn(k), 0.7);
  }
  [[-0.12, -1.6, 0.2], [0.14, -2.3, -0.1]].forEach(([x, z, a], i) => {
    const pts: V3[] = [];
    for (let k = 0; k < 14; k++) { const t = (k / 14) * 6.283; pts.push([x + 0.045 * Math.cos(t) * (1 - 0.15 * Math.sin(t)), BUND_Y + 0.001, z + 0.12 * Math.sin(t) + a * 0.01]); }
    wFlat(p, c, 39800 + i, mixColor(PADDY.dirtShade, PADDY.dirt, 0.35), pts);
  });
};

/** Her long shadow down the path toward the lens (from feet `at`, height h): two leg strips, the body beyond the camera. */
export const paintLongShadow = (p: Painter, c: YCam, at: V3, h: number, seed: number) => {
  const hor = Math.hypot(SUN_F[0], SUN_F[2]), dx = -SUN_F[0] / hor, dz = -SUN_F[2] / hor, L = (h * hor) / SUN_F[1];
  const zMax = c.z - 0.32, end = Math.min(L, (zMax - at[2]) / dz);
  [-0.07, 0.08].forEach((o, i) => {
    const px = -dz, pz = dx, w0 = 0.05, w1 = 0.075;
    const a: V3 = [at[0] + o * px - w0 * px, BUND_Y + 0.002, at[2] + o * pz - w0 * pz], b: V3 = [at[0] + o * px + w0 * px, BUND_Y + 0.002, at[2] + o * pz + w0 * pz];
    const e = end;
    const cc: V3 = [b[0] + dx * e + (w1 - w0) * px, BUND_Y + 0.002, b[2] + dz * e + (w1 - w0) * pz], d: V3 = [a[0] + dx * e - (w1 - w0) * px, BUND_Y + 0.002, a[2] + dz * e - (w1 - w0) * pz];
    const q = poly(c, [a, b, cc, d]);
    if (okPoly(q)) hardFill(p, seed + i, mixColor(PADDY.dirtShade, PADDY.dirt, 0.2), q);
  });
};

/** Near foreground: backlit rice tufts leaning over the bund edges at the frame sides (UT12: darker, no light edges), and a darkening of the
 *  nearest path so the bottom of the frame settles. */
export const paintPaddyFront = (p: Painter, c: YCam) => {
  for (let k = 0; k < 10; k++) {
    const side = k % 2 ? 1 : -1, z = 0.5 + 0.6 * hn(39900 + k);
    clump(p, c, 39910 + k, side * (BUND_W + 0.02 + 0.1 * hn(k + 3)), z, BUND_Y - 0.05, RICE_Y + 0.08 * hn(k + 7), 1.3);
  }
  // the near path (pebbles kept out of the caption band, z about 0.45 .. 0.95): pebbles with their shadows toward the lens, loose straw, dry grass at the edges
  for (let k = 0; k < 22; k++) {
    const x = (hn(39920 + k) - 0.5) * 0.8, z = k % 2 ? 0.97 + 0.15 * hn(39940 + k) : -0.7 + 0.6 * hn(39940 + k), r = 0.008 + 0.012 * hn(39960 + k);
    const q = P(c, [x, BUND_Y + r * 0.6, z]), s = q ? (c.f * r) / Math.max(0.3, depth(c, [x, BUND_Y, z])) : 0;
    if (!q || s < 1.5) continue;
    hardFill(p, 39970 + k, mixColor(PADDY.dirtShade, '#2a1e18', 0.35), ellPts(q[0] + s * 0.2, q[1] + s * 0.9, s * 1.1, s * 0.5, 10));
    hardFill(p, 40000 + k, mixColor(PADDY.dirt, k % 3 ? PADDY.dirtShade : '#d8c09a', 0.4), ellPts(q[0], q[1], s, s * 0.7, 10));
  }
  for (let k = 0; k < 14; k++) {
    const x = (hn(40100 + k) - 0.5) * 0.7, z = -0.2 + 1.2 * hn(40120 + k), a = 6.28 * hn(40140 + k), L = 0.06 + 0.06 * hn(40160 + k);
    wStroke(p, c, 40180 + k, [[x, BUND_Y + 0.002, z], [x + L * Math.cos(a), BUND_Y + 0.002, z + L * Math.sin(a)]], mixColor('#c9a86a', PADDY.dirtShade, 0.3), 1.2);
  }
  for (let k = 0; k < 8; k++) {
    const side = k % 2 ? 1 : -1, z = -0.3 + 1.3 * hn(40200 + k);
    clump(p, c, 40210 + k, side * (BUND_W - 0.06 * hn(k + 11)), z, BUND_Y, BUND_Y + 0.07 + 0.05 * hn(k + 13), 0.8);
  }
  const q = poly(c, [[-BUND_W, BUND_Y + 0.003, 0.9], [BUND_W, BUND_Y + 0.003, 0.9], [BUND_W, BUND_Y + 0.003, 1.15], [-BUND_W, BUND_Y + 0.003, 1.15]]);
  if (okPoly(q)) glow(p, 39990, '#2a1e18', 40, q);
};

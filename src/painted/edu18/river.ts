import {hardFill, inkLine} from '../kit/draw';
import {paintFogBank} from '../kit/fog';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {bandPts, depth, ellPts, glow, hn, okPoly, P, poly, wCircle, wCut, wStroke, yAt} from './scenery';

// SET-RIVER18 (EDU-EP18-BRIEF-R1 N1, space R; Film W3 look frame LF01, 16 Nov 2026). Designed from the script before the kit: a wide brown
// African river at dawn, papyrus walls on both banks, flat-topped acacias and a low ridge as silhouettes in the haze, mist lying on the water,
// a low sun behind the far bank at screen left-back that lays a glint path toward the lens. No landmark, sign or named river (truth limit 6).
// R: metres, origin on the water at the canoe centre, +x downstream, +y up, +z toward the near bank; water y 0; far bank z -28..-34.
// Paint order: paintRiverBack (sky .. water .. mist .. back arcs of the hippo rings) -> the hippo WebGL layer (hippo-set.tsx) ->
// paintRiverFront (front arcs and spray at the hippo, the canoe and girl painted by the look/shot, near floating leaves, a low mist veil).
// Large flats stay flat bands (DF-20261030-p5brush-large-fill-mottle); mist is a glaze <= 0.35 (DF-20261030-painted-glaze-pickup).

export const RIVER = {
  zenith: '#6f7fa6', mid: '#d9a77f', glow: '#f4c98a', sun: '#fff0c8', mist: '#e9dccb',
  waterNear: '#6b6a5e', waterMid: '#8a7f6a', glint: '#e8c08e', papyrus: '#5e7a3e', papyrusShade: '#3a4f2a', far: '#4a4038', haze: '#b9a08a',
};
/** World direction toward the dawn sun. W3 change: the brief's (-0.62, 0.10, -0.78) put the disc 42 deg off the LF01 lens; turned to (0.05, 0.10,
 *  -1.0) (still low behind the far bank) so the disc and its glint path sit in frame at top left, behind her. */
export const SUN_R: V3 = [0.049, 0.1, -0.994];

const hazeOf = (col: string, d: number) => mixColor(col, RIVER.haze, Math.min(0.85, 0.25 + d / 160));

/** Sky, sun, ridge, acacias, far papyrus bank, water bands, the sun's glint path, mist banks. */
export const paintRiverBack = (p: Painter, c: YCam, o: {t: number; rings?: {at: V3; r: number[]}}) => {
  const t = o.t;
  // sky: dawn bands down to below the horizon (water covers the rest)
  paintSkyBands(p, {from: RIVER.zenith, via: RIVER.mid, viaAt: 0.62, to: RIVER.glow, horizon: c.hy + 40, width: 1080, bands: 26, style: 'flat', seed: 18100});
  const sunPt = P(c, [c.x + SUN_R[0] * 1000, c.y + SUN_R[1] * 1000, c.z + SUN_R[2] * 1000]);
  if (sunPt) {
    // stepped papercut halo (one big flat ellipse read as a hard oval in the sky: t6, 16 Nov 2026)
    [[460, 230, 14], [330, 170, 18], [210, 120, 24]].forEach(([rx, ry, op], k) => glow(p, 18120 + k, RIVER.glow, op, ellPts(sunPt[0], sunPt[1], rx, ry, 40)));
    paintSkyDisc(p, {x: sunPt[0], y: sunPt[1], r: 34, color: RIVER.sun, glow: 0.8, glowColor: '#ffe2a8', t, seed: 18130});
  }
  // a few long dawn cloud streaks, lit from below
  [[-0.32, 0.36, 520], [0.18, 0.28, 760], [-0.05, 0.47, 380]].forEach(([dx, el, w], i) => {
    const q = P(c, [c.x + (Math.sin(c.yaw) + dx) * 1000, c.y + el * 1000, c.z - Math.cos(c.yaw) * 1000]);
    if (!q) return;
    const [x, y] = q, h = 16 + 8 * i;
    hardFill(p, 18140 + i, mixColor(RIVER.mid, RIVER.zenith, 0.35), [[x - w / 2, y], [x + w / 2, y - h * 0.3], [x + w / 2 - 40, y + h * 0.4], [x - w / 2 + 60, y + h * 0.6]]);
    hardFill(p, 18150 + i, mixColor(RIVER.glow, RIVER.mid, 0.3), [[x - w / 2 + 50, y + h * 0.35], [x + w / 2 - 50, y + h * 0.15], [x + w / 2 - 70, y + h * 0.55], [x - w / 2 + 90, y + h * 0.62]]);
  });
  // ridge z -600 (60 m), soft hills
  const ridge: V3[] = [];
  for (let i = 0; i <= 40; i++) { const x = -900 + i * 45; ridge.push([x, 30 + 26 * Math.sin(i * 0.37 + 1) + 10 * Math.sin(i * 1.3), -600]); }
  wCut(p, c, 18200, hazeOf(RIVER.far, 300), [...ridge, [900, -2, -600], [-900, -2, -600]]);
  // grassland rise behind the far bank (z -34 .. -60)
  const rise: V3[] = [];
  for (let i = 0; i <= 50; i++) { const x = -150 + i * 6; rise.push([x, 3.2 + 1.2 * Math.sin(i * 0.6) + 0.6 * hn(i + 3), -55]); }
  wCut(p, c, 18210, hazeOf('#6a5a40', 70), [...rise, [150, -0.5, -40], [-150, -0.5, -40]]);
  // acacias: trunk + flat umbrella canopy, far silhouettes
  const ACACIA: [number, number, number][] = [[-40, -70, 9], [15, -95, 7], [70, -120, 10], [-14, -82, 8], [-26, -64, 6.5], [32, -76, 7.5]];
  ACACIA.forEach(([x, z, h], i) => {
    const col = hazeOf(RIVER.far, -z), w = h * 0.95;
    wCut(p, c, 18300 + i * 4, col, [[x - 0.25, 0, z], [x + 0.25, 0, z], [x + 0.18, h * 0.7, z], [x + 0.7, h * 0.88, z], [x - 0.6, h * 0.86, z], [x - 0.15, h * 0.7, z]]);
    const can: V3[] = [];
    for (let k = 0; k <= 16; k++) { const u = k / 16, a = Math.PI * u; can.push([x + w * Math.cos(a) * (0.9 + 0.12 * hn(i * 31 + k)), h * 0.83 + h * 0.2 * Math.sin(a) * (0.75 + 0.4 * hn(i * 17 + k)), z]); }
    wCut(p, c, 18301 + i * 4, col, can);
    // lit lower edge of the canopy (sun side)
    wStroke(p, c, 18302 + i * 4, [[x - w * 0.85, h * 0.84, z], [x + w * 0.2, h * 0.82, z]], mixColor(col, RIVER.glow, 0.35), 0.8);
  });
  // far bank papyrus wall (z -28): mop-head umbels on the top edge, hazed; reeds in front of it
  const bank: V3[] = [];
  for (let i = 0; i <= 120; i++) { const x = -60 + i, top = 2.5 + 0.5 * hn(i * 7 + 1) + 0.25 * Math.sin(i * 0.4); bank.push([x, top, -29 - hn(i) * 2]); }
  const bankCol = hazeOf(RIVER.papyrusShade, 30);
  wCut(p, c, 18400, bankCol, [...bank, [60, -0.2, -28], [-60, -0.2, -28]]);
  bank.forEach(([x, y, z], i) => {
    if (i % 2) return;
    const q = P(c, [x, y, z]);
    if (!q || q[0] < -60 || q[0] > 1140) return;
    const s = (c.f / Math.max(1, depth(c, [x, y, z]))) * (0.5 + 0.3 * hn(i + 9));
    hardFill(p, 18410 + i, mixColor(bankCol, RIVER.glow, q[0] < 540 ? 0.22 : 0.08), [[q[0], q[1] + s * 0.2], [q[0] - s * 0.55, q[1] - s * 0.15], [q[0] - s * 0.2, q[1] - s * 0.4], [q[0] + s * 0.25, q[1] - s * 0.38], [q[0] + s * 0.6, q[1] - s * 0.1]]);
  });
  // a bright mist line where the far bank meets the water
  const wlFar = yAt(c, 0, 29);
  glow(p, 18490, mixColor(RIVER.mist, RIVER.glow, 0.4), 55, bandPts(wlFar - 10, wlFar + 8));
  // water: depth bands, far (sky-tinted) to near
  const D = [29, 22, 16, 12, 9, 7, 5.5, 4.4, 3.5, 2.8, 2.2, 1.7, 1.3, 1.0, 0.7];
  D.forEach((d, i) => {
    const y0 = yAt(c, 0, d), y1 = i + 1 < D.length ? yAt(c, 0, D[i + 1]) : 2200, u = i / (D.length - 1);
    const col = u < 0.35 ? mixColor(mixColor(RIVER.waterMid, RIVER.mid, 0.45), RIVER.waterMid, u / 0.35) : mixColor(RIVER.waterMid, RIVER.waterNear, (u - 0.35) / 0.65);
    hardFill(p, 18500 + i, col, bandPts(y0, y1 + 2));
  });
  // sky reflection sheen on the far water and the sun's glint path
  glow(p, 18520, RIVER.glow, 60, bandPts(wlFar, yAt(c, 0, 10)));
  if (sunPt) {
    for (let k = 0; k < 70; k++) {
      const d = 28 * Math.pow(0.93, k) + 0.9, y = yAt(c, 0, d) + (hn(k * 3) - 0.5) * 4;
      if (y > 1920) continue;
      const spread = 30 + 1400 / d, x = sunPt[0] + (hn(k * 5 + 1) - 0.5) * spread * 1.4, w = (12 + 90 * hn(k * 7 + 2)) * (6 / (d + 3)) + 6, h = Math.max(1.5, 22 / (d + 2));
      hardFill(p, 18530 + k, k % 3 ? RIVER.glint : '#fff0c8', [[x - w, y], [x + w, y - h * 0.4], [x + w * 0.8, y + h * 0.5], [x - w * 0.9, y + h * 0.4]]);
    }
  }
  // scattered cool glints and current streaks across the river (+x drift)
  for (let k = 0; k < 46; k++) {
    const d = 2 + 26 * hn(k * 13 + 4), x0 = -12 + 30 * hn(k * 11 + 6) + 0.4 * t, z = c.z - d * Math.cos(c.yaw);
    wStroke(p, c, 18600 + k, [[x0, 0, z], [x0 + 0.6 + 2 * hn(k), 0, z + 0.05]], k % 4 ? mixColor(RIVER.waterMid, '#c8b49a', 0.5) : RIVER.glint, 0.5 + 0.6 * (6 / (d + 4)));
  }
  // mist: a bank on the far water, glowing on the sun side
  paintFogBank(p, {y: yAt(c, 0, 18), height: 90, width: 1080, color: RIVER.mist, density: 0.55, drift: 6, t, puffs: 7, seed: 18700});
  if (sunPt) glow(p, 18710, '#ffe7c2', 70, ellPts(sunPt[0] + 80, yAt(c, 0, 20), 420, 70));
  paintFogBank(p, {y: yAt(c, 0.6, 9), height: 70, width: 1080, color: RIVER.mist, density: 0.35, drift: 9, t, puffs: 6, seed: 18720});
  if (o.rings) ringArcs(p, c, o.rings.at, o.rings.r, 'back', 18800);
};

/** Ripple rings round a point on the water: `back` arcs (far half, under the hippo layer) or `front` arcs (near half, over it). */
export const ringArcs = (p: Painter, c: YCam, at: V3, rs: number[], half: 'back' | 'front', seed: number) => {
  // the near half of a ring is the half whose points are nearer the camera than the centre
  const d0 = depth(c, at);
  rs.forEach((r, i) => {
    const pts = wCircle(at, r, 40);
    const run: V3[][] = [[]];
    pts.forEach((v) => { const near = depth(c, v) < d0; if ((half === 'front') === near) run[run.length - 1].push(v); else if (run[run.length - 1].length) run.push([]); });
    run.filter((s) => s.length > 2).forEach((s, k) => {
      wStroke(p, c, seed + i * 10 + k, s, i % 2 ? mixColor(RIVER.waterNear, '#2a2620', 0.4) : mixColor(RIVER.glint, RIVER.mist, 0.4), 1.6 - 0.25 * i);
    });
  });
};

/** Water pushed up round the hippo's waterline (a pale, broken collar) and the front ring arcs: paint after the WebGL hippo. */
export const paintHippoWaterFront = (p: Painter, c: YCam, at: V3, rs: number[], seed = 18900) => {
  ringArcs(p, c, at, rs, 'front', seed);
  // broken foam collar where the jaw and chest meet the surface
  const ctr = P(c, at);
  if (!ctr) return;
  const u = c.f / Math.max(0.5, depth(c, at));
  for (let k = 0; k < 9; k++) {
    const a = -0.5 + (k / 8) * 1.0, x = ctr[0] + a * u * 1.3, y = ctr[1] + (hn(k + 40) - 0.3) * u * 0.05, w = u * (0.08 + 0.1 * hn(k + 2));
    hardFill(p, seed + 80 + k, k % 2 ? RIVER.mist : '#f3e9d8', [[x - w, y], [x, y - w * 0.18], [x + w, y], [x, y + w * 0.12]]);
  }
};

/** Near floating water lettuce and a drifting papyrus stalk (dark foreground layer, low contrast, no light edges: UT12a). */
export const paintRiverForeground = (p: Painter, c: YCam, items: {at: V3; r: number; kind: 'lettuce' | 'stalk'; rot?: number}[], seed = 19000) => {
  items.forEach((it, i) => {
    const col = mixColor(RIVER.papyrusShade, '#22261c', 0.45);
    if (it.kind === 'lettuce') {
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2 + (it.rot ?? 0), r = it.r, x = it.at[0], z = it.at[2];
        wCut(p, c, seed + i * 20 + k, mixColor(col, '#4a5a34', 0.25 * (k % 2)), [[x, 0.02, z], [x + Math.cos(a - 0.35) * r * 0.8, 0.03, z + Math.sin(a - 0.35) * r * 0.8], [x + Math.cos(a) * r, 0.05, z + Math.sin(a) * r], [x + Math.cos(a + 0.35) * r * 0.8, 0.03, z + Math.sin(a + 0.35) * r * 0.8]], {shadow: 4});
      }
    } else {
      const a = it.rot ?? 0.3, L = it.r, [x, , z] = it.at;
      const q = poly(c, [[x, 0.015, z], [x + Math.cos(a) * L, 0.02, z + Math.sin(a) * L], [x + Math.cos(a) * L, 0.045, z + Math.sin(a) * L], [x, 0.04, z]]);
      if (okPoly(q)) hardFill(p, seed + 300 + i, col, q);
      const tip = P(c, [x + Math.cos(a) * L, 0.04, z + Math.sin(a) * L]);
      if (tip) for (let k = 0; k < 9; k++) inkLine(p, seed + 320 + i * 10 + k, [tip, [tip[0] + Math.cos(-2.4 + k * 0.32) * 60, tip[1] + Math.sin(-2.4 + k * 0.32) * 26]], {closed: false, weight: 0.9, curve: 0, color: col, still: true});
    }
  });
};

/** A thin low mist veil over the water in front of the hippo (front pass, glaze <= 0.3). */
export const paintRiverVeil = (p: Painter, c: YCam, t: number, dHippo: number) => {
  paintFogBank(p, {y: yAt(c, 0.05, dHippo - 0.3), height: 26, width: 1080, color: RIVER.mist, density: 0.22, drift: 10, t, puffs: 5, seed: 19200});
};

/** Ripple breaks over the reflections: short horizontal water-coloured strokes in a picture box (front pass, after the reflections). */
export const paintReflectionBreaks = (p: Painter, box: [number, number, number, number], n: number, seed: number) => {
  const [x0, y0, x1, y1] = box;
  for (let k = 0; k < n; k++) {
    const y = y0 + (y1 - y0) * hn(seed + k * 3), x = x0 + (x1 - x0) * hn(seed + k * 5 + 1), w = 20 + 70 * hn(seed + k * 7 + 2), h = 2 + 3 * ((y - y0) / Math.max(1, y1 - y0));
    hardFill(p, seed + k, k % 3 ? mixColor(RIVER.waterNear, RIVER.waterMid, 0.5) : mixColor(RIVER.glint, RIVER.waterMid, 0.55), [[x - w, y], [x + w, y - h * 0.3], [x + w * 0.85, y + h * 0.5], [x - w * 0.9, y + h * 0.4]]);
  }
};

/** Picture rectangle helper for the probe. */
export const riverPicture = (c: YCam) => ({horizon: c.hy, farWaterline: yAt(c, 0, 29)});
export type {Pt};

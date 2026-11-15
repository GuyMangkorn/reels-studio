import {ell, hardFill, washAt} from '../kit/draw';
import {paintFogBank} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, type YCam} from '../kit/ycam';
import {paintStars} from '../kit/stars';
import {FOREST} from './palette';

// SET-FOREST16 look (brief EDU-EP16-BRIEF-R2 IM4 / VD16, SH18; Film LF-FOREST, W3 2026-11-14; N7, Boss hardens). Space `F` in metres: origin on the
// ground at the camera's start target, +x right, +y up, +z toward the camera. Tall straight near-black trunks (0.4-0.8 m, 18-25 m) in five depth bands
// (z 2 to -40), canopy closing overhead with a few gaps of stars, three pale cold top-light shafts, ground mist 0.4-1.2 m drifting on the ambient clock.
// Kept empty and ambiguous (CL09): no eyes, figures, animals or lights. Aerial perspective: each band farther back is mixed toward the mist.
// Seeds 48000-48999.

/** Camera on the SH18 creep at `k` 0..1 (dolly z 6.0 -> 4.6, eye 1.5, yaw arc 6 deg, f 900). */
export const forestCam = (k: number): YCam => ({x: 0.25 * k, y: 1.5, z: 6.0 - 1.4 * k, yaw: ((-3 + 6 * k) * Math.PI) / 180, f: 900, hy: 1010, pitch: 0.07});

type Trunk = {x: number; z: number; d: number; band: number; lean: number};
// z (world), count, span (m), mist mix (aerial perspective toward the mist)
const BANDS: [number, number, number, number][] = [[-38, 16, 44, 0.8], [-24, 13, 30, 0.64], [-13, 10, 18, 0.46], [-5, 7, 11, 0.26], [1.2, 3, 5.6, 0.06]];

/** Deterministic trunk list (far to near), spacing 3-6 m, kept off the camera path (|x| > 1.1 m for the two near bands), plus one framing trunk at left. */
export const forestTrunks = (): Trunk[] => {
  const out: Trunk[] = [];
  BANDS.forEach(([z, n, span], b) => {
    for (let i = 0; i < n; i++) {
      let x = -span / 2 + (i + 0.5) * (span / n) + (hash(b * 31 + i * 7.3) - 0.5) * (span / n) * 0.6;
      if (b >= 3 && Math.abs(x) < 1.1) x = Math.sign(x || 1) * (1.1 + hash(i + b) * 0.5);
      out.push({x, z: z + (hash(b * 13 + i * 3.1) - 0.5) * 2.4, d: 0.4 + 0.4 * hash(b * 7 + i * 1.9), band: b, lean: (hash(b * 5 + i) - 0.5) * 0.02});
    }
  });
  out.push({x: -1.25, z: 3.4, d: 0.78, band: 5, lean: 0.004}); // near framing trunk, left edge
  return out;
};
const MIST = [0.8, 0.64, 0.46, 0.26, 0.06, 0];

const groundY = (c: YCam, z: number, h = 0): number => (camPoint(c, [c.x, h, z]) ?? [0, 2000])[1];

/** The whole SET-FOREST16 plate for camera `c` at time t (s). */
export const paintForest = (p: Painter, c: YCam, t: number) => {
  // sky (seen only through canopy gaps) and a far mist wall that is brightest low, darker upward (aerial perspective, UT03 mid values)
  hardFill(p, 48000, FOREST.sky, [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]);
  const hz = groundY(c, -60);
  [[620, 0.25], [420, 0.45], [250, 0.7], [120, 0.9]].forEach(([up, m], i) =>
    hardFill(p, 48001 + i, mixColor(FOREST.sky, FOREST.mistHigh, m * 0.85), [[-20, hz - up], [1100, hz - up - 30 * hash(i)], [1100, hz + 200], [-20, hz + 200]]));
  // ground: far to near, darker toward the lens
  [[0, 0.62], [0.12, 0.42], [0.3, 0.22], [0.5, 0.08], [0.72, 0.0]].forEach(([k, m], i) => {
    const y0 = hz + 10 + (1940 - hz) * k;
    hardFill(p, 48060 + i, mixColor(FOREST.ground, FOREST.mistLow, m), [[-20, y0], [1100, y0 + 14 * (hash(i + 3) - 0.5)], [1100, 1940], [-20, 1940]]);
  });
  // trunks band by band, far to near, with a mist bank laid in front of each band
  const trunks = forestTrunks().sort((a, b) => a.band - b.band || a.z - b.z);
  let lastBand = -1;
  trunks.forEach((tr, i) => {
    if (tr.band !== lastBand && tr.band < 5) {
      lastBand = tr.band;
            const zb = BANDS[tr.band][0] + 1.6, d0 = groundY(c, zb, 0), d1 = groundY(c, zb, 1.2);
      if (tr.band > 0) paintFogBank(p, {y: (d0 + d1) / 2 + (d0 - d1) * 0.1, height: Math.max(26, (d0 - d1) * 1.5), width: 1080, color: tr.band < 3 ? FOREST.mistHigh : FOREST.mistLow, density: 0.7, drift: 6, t, puffs: 7, seed: 48100 + tr.band * 10});
    }
    const mist = MIST[tr.band], col = mixColor(FOREST.trunk, FOREST.mistHigh, mist), h = 18 + 7 * hash(i * 1.3);
    const r = tr.d / 2, quad: V3[] = [[tr.x - r, -0.3, tr.z], [tr.x + r, -0.3, tr.z], [tr.x + r * 0.8 + tr.lean * h, h, tr.z], [tr.x - r * 0.8 + tr.lean * h, h, tr.z]];
    const poly = camPoly(c, quad);
    if (poly.length < 3) return;
    hardFill(p, 48200 + i, col, poly);
    // faint cold rim on the lit side (left, toward the shafts), a darker right edge, a root flare
    const rimQ: V3[] = [[tr.x - r, 0, tr.z], [tr.x - r * 0.75, 0, tr.z], [tr.x - r * 0.6 + tr.lean * h, h, tr.z], [tr.x - r * 0.8 + tr.lean * h, h, tr.z]];
    hardFill(p, 48400 + i, mixColor(col, FOREST.trunkRim, 0.5 - mist * 0.35), camPoly(c, rimQ));
    const flare: V3[] = [[tr.x - r * 1.45, -0.02, tr.z], [tr.x - r * 1.05, 0.25, tr.z], [tr.x - r, 0.6, tr.z], [tr.x + r, 0.6, tr.z], [tr.x + r * 1.05, 0.25, tr.z], [tr.x + r * 1.45, -0.02, tr.z]];
    hardFill(p, 48600 + i, col, camPoly(c, flare));
  });
  // canopy: dark leaf masses overhead with three gaps of stars; drawn last so the trunks vanish into it
  const gaps: Pt[] = GAPS;
  for (let i = 0; i < 34; i++) {
    const x = -60 + (i % 9) * 150 + 60 * hash(i * 1.7), y = -40 + Math.floor(i / 9) * 150 + 90 * hash(i * 2.9), rx = 150 + 90 * hash(i * 3.3), ry = 90 + 70 * hash(i * 4.1);
    hardFill(p, 48700 + i, i % 3 === 0 ? mixColor(FOREST.canopy, FOREST.mistLow, 0.18) : FOREST.canopy, blobPts(x, y, rx, ry, i));
  }
  for (let i = 0; i < 14; i++) { // ragged lower edge of the canopy
    const x = hash(i * 4.4 + 1) * 1100 - 10, y = 560 + 200 * hash(i * 2.7 + 3);
    hardFill(p, 48760 + i, mixColor(FOREST.canopy, FOREST.mistLow, 0.12 + 0.1 * hash(i)), blobPts(x, y, 70 + 60 * hash(i), 34 + 26 * hash(i + 2), i + 40));
  }
  gaps.forEach(([gx, gy], i) => { // cut the gaps back open: sky, a ragged lighter edge of lit leaves
    hardFill(p, 48790 + i, mixColor(FOREST.canopy, FOREST.mistLow, 0.35), blobPts(gx, gy, 92, 60, i + 70));
    hardFill(p, 48794 + i, mixColor(FOREST.sky, FOREST.mistLow, 0.3), blobPts(gx, gy, 72, 46, i + 80));
  });
  paintShafts(p, t, 1);
  gaps.forEach(([gx, gy], i) => paintStars(p, c, FOREST.sky, {seed: 71 + i, count: 900, alpha: 0.95, t, color: '#e3ecfa', rect: [gx - 60, gy - 36, gx + 60, gy + 36], big: 0.1}));
  // near ground mist (knee to waist) and soft leaf litter in the foreground
  [[0.45, 0.55], [1.0, 0.4]].forEach(([hm, dn], i) => {
    const z = 2.4 - i * 1.2, y = groundY(c, z, hm);
    paintFogBank(p, {y, height: 190, width: 1080, color: FOREST.mistLow, density: dn, drift: 8, t, puffs: 6, seed: 48800 + i * 10});
  });
  for (let i = 0; i < 60; i++) {
    const x = hash(i * 3.3 + 9) * 1080, y = 1500 + hash(i * 1.7 + 2) * 420, s = 7 + 12 * hash(i * 2.9);
    hardFill(p, 48850 + i, mixColor(FOREST.ground, FOREST.mistLow, 0.35 + 0.35 * hash(i * 5.1)), ell(x, y, s, s * 0.3, 8, (hash(i) - 0.5) * 0.6));
  }
};

/** Canopy gaps (picture px) where the stars show and the shafts start. */
const GAPS: Pt[] = [[310, 150], [700, 300], [930, 110]];
const blobPts = (x: number, y: number, rx: number, ry: number, id: number): Pt[] =>
  Array.from({length: 36}, (_, i): Pt => { const a = (i / 36) * Math.PI * 2, r = 1 + 0.12 * Math.sin(a * 5 + id) + 0.07 * Math.sin(a * 13 + id * 2) + 0.05 * Math.sin(a * 23 + id); return [x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]; });

/** Three pale cold top-light shafts from the canopy gaps: soft near-parallel beams (not spotlight cones), slanting a little right, fading downward. */
const paintShafts = (p: Painter, t: number, level: number) => GAPS.forEach(([gx, gy], i) => {
  const w0 = 46 + 10 * i, slant = 150, L = 1250, br = level * (0.85 + 0.15 * Math.sin(t * 0.3 + i));
  [[0, 0.45, 26], [0.45, 0.8, 18], [0.8, 1, 9]].forEach(([k0, k1, a], j) => {
    const y0 = gy + L * k0, y1 = gy + L * k1, x0 = gx + slant * k0, x1 = gx + slant * k1, wa = w0 * (1 + 0.6 * k0), wb = w0 * (1 + 0.6 * k1);
    washAt(p, 48900 + i * 6 + j, FOREST.light, a * br, [[x0 - wa, y0], [x0 + wa, y0], [x1 + wb, y1], [x1 - wb, y1]], 0, 0);
    washAt(p, 48903 + i * 6 + j, FOREST.light, a * 0.8 * br, [[x0 - wa * 0.45, y0], [x0 + wa * 0.45, y0], [x1 + wb * 0.45, y1], [x1 - wb * 0.45, y1]], 0, 0);
  });
});

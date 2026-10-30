// BLOOP ICE keel measurements (Boss, pass 3 under BLOOP-BRIEF-R4 FR04/FR09): side angles, aspect, lobe count and prominence,
// deepest-point position, SH11 creature coverage, and the FR09 haze distance. Writes the keel polygons used by
// scripts/the-bloop/region-luma.py (display luma per region) to out/qa/the-bloop/keel-polys.json and prints the metrics.
// Usage: node --import tsx scripts/the-bloop/measure-keel.ts
import {writeFileSync} from 'node:fs';
import {hazeRing, keelRing} from '../../src/painted/bloop/sets';
import {FAR_ICE, ICE_SH11, ICE_SH12, sh13Camera} from '../../src/painted/shots/bloop';
import {paintedShots} from '../../src/painted/registry';
import {toScreen, type Camera} from '../../src/painted/kit/camera';

type Pt = [number, number];
const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

// horizontal scanline crossings of a closed polygon at row y: sorted x values
const crossingsAtY = (poly: Pt[], y: number): number[] => {
  const xs: number[] = [];
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length];
    if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) xs.push(x1 + ((y - y1) * (x2 - x1)) / (y2 - y1));
  });
  return xs.sort((a, b) => a - b);
};
const crossingsAtX = (poly: Pt[], x: number): number[] => {
  const ys: number[] = [];
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length];
    if ((x1 <= x && x2 > x) || (x2 <= x && x1 > x)) ys.push(y1 + ((x - x1) * (y2 - y1)) / (x2 - x1));
  });
  return ys.sort((a, b) => a - b);
};
const inside = (poly: Pt[], x: number, y: number) => crossingsAtY(poly, y).filter((v) => v <= x).length % 2 === 1;

// prominence of each local maximum of a profile (larger = deeper bulge)
const prominences = (profile: number[], minSep: number): number[] => {
  const out: number[] = [];
  for (let i = minSep; i < profile.length - minSep; i++) {
    const v = profile[i];
    let isPeak = true;
    for (let k = -minSep; k <= minSep; k++) if (k && profile[i + k] > v) isPeak = false;
    if (!isPeak) continue;
    let l = v, r = v;
    for (let j = i - 1; j >= 0 && profile[j] <= v; j--) l = Math.min(l, profile[j]);
    for (let j = i + 1; j < profile.length && profile[j] <= v; j++) r = Math.min(r, profile[j]);
    out.push(v - Math.max(l, r));
  }
  return out;
};

const keelMetrics = (name: string, poly: Pt[]) => {
  const ring = keelRing(poly);
  const xs = ring.map((q) => q[0]), ys = ring.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2;
  // side walls: leftmost and rightmost crossings per row, depth fraction 0 (top) to 1 (bottom)
  const rows = [];
  for (let y = y0 + 2; y <= y1 - 2; y += 2) {
    const c = crossingsAtY(ring, y);
    if (c.length >= 2) rows.push({f: (y - y0) / h, left: c[0], right: c[c.length - 1]});
  }
  const wallAngle = (side: 'left' | 'right', fLo: number, fHi: number) => {
    const sel = rows.filter((r) => r.f >= fLo && r.f < fHi);
    const angles: number[] = [];
    for (let i = 0; i + 4 < sel.length; i++) {
      const dy = 4 * 2;
      const dx = sel[i + 4][side] - sel[i][side];
      angles.push((Math.atan(Math.abs(dx) / dy) * 180) / Math.PI);
    }
    return angles.length ? round(angles.reduce((a, b) => a + b, 0) / angles.length) : null;
  };
  // longest run of depth where a wall is within 5 degrees of vertical, as a fraction of the depth
  const nearVerticalRun = (side: 'left' | 'right') => {
    let best = 0, cur = 0;
    for (let i = 0; i + 4 < rows.length; i++) {
      const a = (Math.atan(Math.abs(rows[i + 4][side] - rows[i][side]) / 8) * 180) / Math.PI;
      if (a < 5) cur += 2; else cur = 0;
      best = Math.max(best, cur);
    }
    return round(best / h, 3);
  };
  // lobes: local maxima of the underside profile (largest bottom y per column), prominence >= 2 % of the depth
  const bottom: number[] = [];
  for (let x = x0 + 1; x < x1; x += 2) {
    const c = crossingsAtX(ring, x);
    bottom.push(c.length ? c[c.length - 1] : y0);
  }
  // lobes around the whole outline: peaks of the radial distance from the centroid along the 120-sample perimeter
  const gx = ring.reduce((a, q) => a + q[0], 0) / ring.length, gy = ring.reduce((a, q) => a + q[1], 0) / ring.length;
  const radial = ring.map(([x, y]) => Math.hypot(x - gx, y - gy));
  const n = radial.length;
  const perimeterPeaks: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = radial[i];
    let isPeak = true;
    for (let k = -4; k <= 4; k++) if (k && radial[(i + k + n) % n] > v) isPeak = false;
    if (!isPeak) continue;
    let l = v, r = v;
    for (let j = 1; j < n; j++) { const q = radial[(i - j + n) % n]; if (q > v) break; l = Math.min(l, q); }
    for (let j = 1; j < n; j++) { const q = radial[(i + j) % n]; if (q > v) break; r = Math.min(r, q); }
    perimeterPeaks.push(v - Math.max(l, r));
  }
  perimeterPeaks.sort((a, b) => b - a);
  const counted = perimeterPeaks.filter((p) => p >= 0.02 * w);
  const bulges = counted;
  const deepestX = bottom.indexOf(Math.max(...bottom));
  const deepestFromLeft = (x0 + 1 + 2 * deepestX - x0) / w;
  return {
    name, width: round(w), height: round(h), aspect: round(w / h, 2),
    wallAngleUpperDeg: {left: wallAngle('left', 0, 0.5), right: wallAngle('right', 0, 0.5)},
    wallAngleLowerDeg: {left: wallAngle('left', 0.5, 1), right: wallAngle('right', 0.5, 1)},
    nearVerticalRunFracOfDepth: {left: nearVerticalRun('left'), right: nearVerticalRun('right')},
    visibleBulges: bulges.length, bulgeProminencePx: bulges.map((p) => round(p)), undersideBulges: prominences(bottom, 12).filter((p) => p >= 0.02 * h).length,
    largestOverSmallest: bulges.length ? round(bulges[0] / bulges[bulges.length - 1], 2) : null,
    deepestPointFromLeftPct: round(100 * deepestFromLeft, 1), deepestPointX: round(x0 + 1 + 2 * deepestX),
    box: [round(x0), round(y0), round(x1), round(y1)],
  };
};

const SH11 = keelMetrics('SH11 ICE keel (680 px)', ICE_SH11);
const SH12 = keelMetrics('SH12 ICE keel (250 px)', ICE_SH12);
const FAR = keelMetrics('SH13 far ice (260 px)', FAR_ICE);

// SH11 creature head box (drift 0, R4): fraction covered by the keel silhouette
const head = [355, 335, 895, 815];
let covered = 0, total = 0;
const ring11 = keelRing(ICE_SH11);
for (let y = head[1] + 1; y < head[3]; y += 2) for (let x = head[0] + 1; x < head[2]; x += 2) {
  total++;
  if (inside(ring11, x, y)) covered++;
}
const coverage = {creatureHeadBox: head, coveragePct: round((100 * covered) / total, 1)};

// FR09 haze: max distance of a haze vertex from the keel silhouette (nearest keel vertex, approximate)
const haze = hazeRing(FAR_ICE);
const ringFar = keelRing(FAR_ICE);
const maxHazeOut = Math.max(...haze.map(([x, y]) => Math.min(...ringFar.map(([qx, qy]) => Math.hypot(x - qx, y - qy)))));
const hazeGrowPx = {maxDistanceFromSilhouettePx: round(maxHazeOut)};

const polys = {
  'SH11-keel': keelRing(ICE_SH11).map(([x, y]) => [round(x), round(y)]),
  'SH12-keel': keelRing(ICE_SH12).map(([x, y]) => [round(x), round(y)]),
  'SH13-far-keel': ringFar.map(([x, y]) => [round(x), round(y)]),
  'SH13-far-haze': haze.map(([x, y]) => [round(x), round(y)]),
};
// screen-space polygons of each frame (the plates' own cameras), for region-luma.py
const screenOf = (cam: Camera, poly: Pt[]) => poly.map((q) => toScreen(cam, q).map((v) => round(v)));
const sh11Cam = paintedShots['bloop-sh11'].camera(97 / 30);
const sh12Cam = paintedShots['bloop-sh12'].camera(150 / 30);
const screen = {
  'SH11-f97-keel': screenOf(sh11Cam, keelRing(ICE_SH11)),
  'SH12-f150-keel': screenOf(sh12Cam, keelRing(ICE_SH12)),
  'SH13-far-keel': screenOf(sh13Camera(0), ringFar),
  'SH13-far-haze': screenOf(sh13Camera(0), haze),
};
writeFileSync('out/qa/the-bloop/keel-polys-screen.json', JSON.stringify(screen));
writeFileSync('out/qa/the-bloop/keel-polys.json', JSON.stringify(polys));
console.log(JSON.stringify({SH11, SH12, FAR, coverage, hazeGrowPx}, null, 1));

// EDU-EP21-SHORT FX4 measurement (Boss, 2026-11-17): the live strikes of B01-SH01 and B05-SH13 against the SHEETS-R4 accept (a)-(h).
// Reads clean 1080x1920 stills `<dir>/<shot>_l<L>.png` (guides and tag off) and, for (f), a probe still of the same frame rendered with the
// bolt and flare switched off (`<probe>/<shot>_l<L>.png`; Bolt returning null, then reverted). The channel, branches and tip come from the
// shot's own exports through the same camera as the picture (SH01 `camAt`, SH13 the sagged `cb`), so the samples sit on the drawn line.
// Per frame it prints:
//   (a) max gap (px) along the visible channel where no pixel within +-4 px across it reaches luma 0.85;
//   (b) tip-to-T (px, projected) and the flare core's overlap of the struck edge line (core r - distance from the tip to that line);
//   (c) core luma share >= 0.95 (max within +-2 px across, every 4 px along y 20..tip-24) and sky luma 70 px either side (max, mean;
//       sky samples within 30 px of a branch or inside the car silhouette are skipped: they are not sky; mean, p95, share <= 0.60, max);
//   (d) area (px^2) with luma > 0.85 outside the bolt (40 px of the channel/branches), the flare glow and 10 px of the car outline/edge;
//   (e) widths across the channel at y 300 and 600 (600 -> tip - 80 when the tip is higher, so the flare is not measured): core (luma >= 0.95) and core+body (luma >= 0.88), horizontal run x |cos| of the slope;
//   (f) max luma the bolt adds inside the face box (projected face +-60 px SH01, +-50 px SH13) against the probe;
//   (g) bolt pixels (added luma > 0.02 against the probe) inside the @TamMaiLa box x 112-258, y 122-162 (the label's ink and outline
//       measured on the Draft v1 sample B01-SH01_G0013 plus 4 px; SceneRenderer portrait label left 120, top 128, 22 px);
//   (h) car body mean luma and mean hue (body = car silhouette minus the cabin hull) against the reference frame (SH01 L0, SH13 L140).
// Rec. 709 luma on the 8-bit sRGB values / 255. Usage:
//   npx tsx scripts/edu-series/ep21/short/fx4-measure.ts <SH01|SH13> <clean dir> <probe dir> [L...]
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {boltPaths, visibleChannel, ROOF_EDGE_NEAR, BONNET_EDGE, type BoltEnv, type BoltOpts} from '../../../../src/painted/edu21/bolt';
import {cabinSilhouette, carSilhouette, SAG_FULL, sagCam} from '../../../../src/painted/edu21/car';
import {B01_DRIVER, driverLead} from '../../../../src/painted/edu21/driver';
import * as S1 from '../../../../src/painted/edu21/shots/B01-SH01';
import * as S13 from '../../../../src/painted/edu21/shots/B05-SH13';
import type {Pt} from '../../../../src/painted/kit/painter';
import type {V3} from '../../../../src/painted/kit/space';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';

const W = 1080, H = 1920;
const read = (f: string) => {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: W * H * 3 + 1024});
  if (r.status !== 0 || r.stdout.length !== W * H * 3) throw new Error(`read ${f}: ${r.stderr}`);
  return r.stdout;
};
const lumaOf = (b: Buffer) => { const y = new Float32Array(W * H); for (let i = 0; i < W * H; i++) y[i] = (0.2126 * b[i * 3] + 0.7152 * b[i * 3 + 1] + 0.0722 * b[i * 3 + 2]) / 255; return y; };
const at = (y: Float32Array, x: number, yy: number) => { const xi = Math.round(x), yi = Math.round(yy); return xi < 0 || yi < 0 || xi >= W || yi >= H ? 0 : y[yi * W + xi]; };
const len = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const segDist = (p: Pt, a: Pt, b: Pt) => { const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)); return Math.hypot(p[0] - a[0] - u * dx, p[1] - a[1] - u * dy); };
const polyDist = (p: Pt, q: Pt[]) => { let d = Infinity; for (let i = 1; i < q.length; i++) d = Math.min(d, segDist(p, q[i - 1], q[i])); return d; };
const inPoly = (p: Pt, q: Pt[]) => { let c = false; for (let i = 0, j = q.length - 1; i < q.length; j = i++) { const [xi, yi] = q[i], [xj, yj] = q[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
/** Samples along a polyline every `step` px: point and unit normal. */
const along = (q: Pt[], step: number) => {
  const out: {p: Pt; n: Pt}[] = [];
  for (let i = 1; i < q.length; i++) {
    const a = q[i - 1], b = q[i], l = len(a, b), n: Pt = [-(b[1] - a[1]) / (l || 1), (b[0] - a[0]) / (l || 1)];
    for (let s = 0; s < l; s += step) out.push({p: [a[0] + ((b[0] - a[0]) * s) / l, a[1] + ((b[1] - a[1]) * s) / l], n});
  }
  return out;
};
const hueOf = (r: number, g: number, b: number) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};

type Strike = {cam: (L: number) => YCam; bolt: BoltOpts; T: V3; edge: V3[]; env: (L: number) => BoltEnv; glow: number; core: number; face: number};
const [which, dir, probe, ...ls] = process.argv.slice(2);
const sh = which === 'SH13' ? 'B05-SH13' : 'B01-SH01';
const strikeFor = (L: number): Strike => which === 'SH13'
  ? (L < 152 ? {cam: (l) => sagCam(S13.camAt(l), SAG_FULL), bolt: S13.BOLT1, T: S13.T1, edge: ROOF_EDGE_NEAR, env: S13.env1, glow: 70, core: 16, face: 50}
    : {cam: (l) => sagCam(S13.camAt(l), SAG_FULL), bolt: S13.BOLT2, T: S13.T2, edge: BONNET_EDGE, env: S13.env2, glow: 80, core: 18, face: 50})
  : {cam: S1.camAt, bolt: S1.BOLT, T: S1.T, edge: ROOF_EDGE_NEAR, env: S1.envAt, glow: 80, core: 18, face: 60};
const faceAt = (L: number, c: YCam) => {
  const d = driverLead(c, which === 'SH13' ? S13.driverAt(L) : B01_DRIVER(L));
  return d ? ([d.crown[0] + 0.216 * (d.hip[0] - d.crown[0]), d.crown[1] + 0.216 * (d.hip[1] - d.crown[1])] as Pt) : null;
};
const refL = which === 'SH13' ? 140 : 0;
const bodyStats = (L: number, rgb: Buffer) => {
  const c = which === 'SH13' ? sagCam(S13.camAt(L), SAG_FULL) : S1.camAt(L), sil = carSilhouette(c), cab = cabinSilhouette(c);
  let r = 0, g = 0, b = 0, y = 0, n = 0;
  for (let yy = 0; yy < H; yy += 2) for (let x = 0; x < W; x += 2) {
    if (!inPoly([x, yy], sil) || inPoly([x, yy], cab)) continue;
    const k = (yy * W + x) * 3; r += rgb[k]; g += rgb[k + 1]; b += rgb[k + 2]; y += (0.2126 * rgb[k] + 0.7152 * rgb[k + 1] + 0.0722 * rgb[k + 2]) / 255; n++;
  }
  return {luma: y / n, hue: hueOf(r / n, g / n, b / n)};
};
const ref = bodyStats(refL, read(`${dir}/${sh}_l${refL}.png`));
console.log(`${sh} reference L${refL}: body luma ${ref.luma.toFixed(3)} hue ${ref.hue.toFixed(1)}`);
const Ls = ls.length ? ls.map(Number) : which === 'SH13' ? [143, 144, 161, 162, 164, 165] : [12, 13, 15, 16];
for (const L of Ls) {
  const s = strikeFor(L), c = s.cam(L), bp = boltPaths(c, s.bolt), vis = visibleChannel(bp.channel), T = camPoint(c, s.T)!;
  const rgb = read(`${dir}/${sh}_l${L}.png`), Y = lumaOf(rgb), e = s.env(L);
  // (a) gaps
  let gap = 0, run = 0;
  for (const {p, n} of along(vis, 1)) {
    if (p[1] < 2) continue;
    let m = 0; for (let k = -4; k <= 4; k++) m = Math.max(m, at(Y, p[0] + n[0] * k, p[1] + n[1] * k));
    run = m >= 0.85 ? 0 : run + 1; gap = Math.max(gap, run);
  }
  // (b) tip and flare overlap of the struck edge line
  const tip = bp.tip!, edgePx = s.edge.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v), dEdge = polyDist(tip, edgePx);
  // (c) core and sky
  let ok = 0, tot = 0, skyMax = 0, skySum = 0, skyN = 0, skyAt: Pt = [0, 0];
  const skyV: number[] = [];
  const silC = carSilhouette(c);
  for (const {p, n} of along(vis, 4)) {
    if (p[1] < 20 || p[1] > tip[1] - 24) continue;
    let m = 0; for (let k = -2; k <= 2; k++) m = Math.max(m, at(Y, p[0] + n[0] * k, p[1] + n[1] * k));
    tot++; if (m >= 0.95) ok++;
    for (const sgn of [-1, 1]) {
      const q: Pt = [p[0] + n[0] * 70 * sgn, p[1] + n[1] * 70 * sgn];
      if (bp.branches.some((b) => polyDist(q, b) <= 30) || inPoly(q, silC)) continue;
      const v = at(Y, q[0], q[1]); if (v > skyMax) { skyMax = v; skyAt = q; } skyV.push(v); skySum += v; skyN++;
    }
  }
  // (e) widths at y 300 / 600
  const widths = [300, Math.min(600, Math.round(tip[1] - 80))].map((yy) => {
    for (let i = 1; i < vis.length; i++) {
      const a = vis[i - 1], b = vis[i];
      if ((a[1] - yy) * (b[1] - yy) > 0) continue;
      const u = (yy - a[1]) / (b[1] - a[1] || 1), x0 = a[0] + (b[0] - a[0]) * u, cos = Math.abs(b[1] - a[1]) / (len(a, b) || 1);
      const runAt = (thr: number) => { let l = 0, r = 0; let cx = Math.round(x0); for (let k = -3; k <= 3; k++) if (at(Y, x0 + k, yy) > at(Y, cx, yy)) cx = Math.round(x0 + k); if (at(Y, cx, yy) < thr) return 0; while (at(Y, cx - l - 1, yy) >= thr) l++; while (at(Y, cx + r + 1, yy) >= thr) r++; return l + r + 1; };
      return {y: yy, core: runAt(0.95) * cos, body: runAt(0.88) * cos};
    }
    return {y: yy, core: NaN, body: NaN};
  });
  // (d) bright area outside the bolt, flare and rim
  const sil = carSilhouette(c);
  let bright = 0;
  for (let yy = 0; yy < H; yy++) for (let x = 0; x < W; x++) {
    if (Y[yy * W + x] <= 0.85) continue;
    const p: Pt = [x, yy];
    if (len(p, tip) <= s.glow) continue;
    if (polyDist(p, bp.channel) <= 40 || bp.branches.some((q) => polyDist(p, q) <= 40)) continue;
    if (polyDist(p, [...sil, sil[0]]) <= 10 || polyDist(p, edgePx) <= 10) continue;
    bright++;
  }
  // (f) face, (g) mark from the probe
  let faceAdd = NaN, markPx = NaN;
  const pf = `${probe}/${sh}_l${L}.png`;
  const face = faceAt(L, which === 'SH13' ? sagCam(S13.camAt(L), SAG_FULL) : c);
  if (existsSync(pf)) {
    const P = lumaOf(read(pf));
    faceAdd = 0; markPx = 0;
    if (face) for (let yy = Math.round(face[1] - s.face); yy <= face[1] + s.face; yy++) for (let x = Math.round(face[0] - s.face); x <= face[0] + s.face; x++) faceAdd = Math.max(faceAdd, Y[yy * W + x] - P[yy * W + x]);
    for (let yy = 122; yy <= 162; yy++) for (let x = 112; x <= 258; x++) if (Y[yy * W + x] - P[yy * W + x] > 0.02) markPx++;
  }
  const body = bodyStats(L, rgb);
  const dh = Math.abs(((body.hue - ref.hue + 540) % 360) - 180);
  const f = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : 'n/a');
  console.log(`${sh} L${L} env stroke ${e.stroke} core ${e.core} | (a) max gap ${gap} px | (b) tip-T ${f(len(tip, T), 1)} px, flare core over edge ${f(s.core - dEdge, 1)} px` +
    ` | (c) core>=0.95 ${f(ok / Math.max(1, tot), 3)} of ${tot}, sky70 mean ${f(skySum / Math.max(1, skyN), 3)} p95 ${f(skyV.sort((a, b) => a - b)[Math.floor(0.95 * (skyV.length - 1))], 3)} <=0.60 ${f(skyV.filter((v) => v <= 0.6).length / Math.max(1, skyV.length), 3)} max ${f(skyMax, 3)} at (${skyAt.map((v) => v.toFixed(0)).join(',')})` +
    ` | (d) bright outside ${bright} px2 | (e) ${widths.map((w) => `y${w.y} core ${f(w.core, 1)} core+body ${f(w.body, 1)}`).join(', ')}` +
    ` | (f) face (${face ? face.map((v) => v.toFixed(0)).join(',') : '-'}) +${f(faceAdd, 3)} | (g) mark px ${f(markPx, 0)} | (h) body luma ${f(body.luma, 3)} hue ${f(body.hue, 1)} (dHue ${f(dh, 1)})`);
}

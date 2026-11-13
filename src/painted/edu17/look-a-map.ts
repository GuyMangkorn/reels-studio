// EDU-EP17 look frames set A (Film, W3, 2026-11-11): the painted look of the G map stack for LF01A (L3, the K02 neighbourhood), LF01B (L2 metro with the crowd fill)
// and LF07 (L0 globe). Look-defining code written in the production owner folder (film-visual-brief-workflow#look-assets); Boss hardens it into mapdraw.ts / the N3-N4
// layers in group 3 (scripts/edu-series/ep17/looks-a.md lists the values). Flat washes only (hardFill), world-anchored seeds, pure function of the camera and t.
import {makeBatch, type Batch} from './batch';
import {bottomShade} from './shade';
import {ell, hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {G_ANCHORS, gProject, gProjectPath, horizonAngle, lodAlpha, pxPerKm, rho, smooth, sphereWeight, type GCam} from './geo';
import {MAP_L0, MAP_L1, MAP_L2, province, type Flat} from './map';
import {paintBuiltUp} from './builtup';
import {cellNear, fillKey, fillModel, inRing, khetFill, nonCount} from './fill';

const mixHex = (a: string, b: string, u: number) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - u) + parseInt(b.slice(i, i + 2), 16) * u).toString(16).padStart(2, '0')).join('');
const ROAD_DARK = '#5c5548';
const logSmooth = (h: number, a: number, b: number) => smooth((Math.log(h) - Math.log(a)) / (Math.log(b) - Math.log(a)));

/** Film's map palette (LF01A/LF01B/LF07). `out*` = outside Bangkok + Nonthaburi: dimmed and desaturated so the two provinces read as the stage and the caption band
 * (Gulf and the southern provinces) stays mid-dark (brief: "lifted 8 %" replaced by "dimmed", reason in looks-a.md). */
export const LOOK_COL = {
  gulf: '#1d3c4e', gulfShelf: '#24475a', gulfSilt: '#3a5056',
  rice: '#93a463', rice2: '#a6ae6e', orchard: '#6f8a4f', urban: '#b6aa94', urbanCore: '#a99d89', road: '#e2d9c6', river: '#7a6f4f', canal: '#7d7558',
  outLand: '#56603f', outLand2: '#4d5839', outUrban: '#6f6a5c', outRoad: '#8b8571', outRiver: '#4f4a38',
  border: '#f4ecd8', borderSh: '#1a1a14', district: '#e6dcc6',
  crowd: '#5a4a42', crowdLit: '#97796a', crowdDeep: '#463831', flecks: ['#c94f3d', '#e0b84a', '#3f6fa8', '#f2efe6', '#3a8a6a', '#d77fa1', '#2b211c', '#7a5c48'],
  // L3 neighbourhood
  street: '#77736b', avenue: '#6a675f', plaza: '#c9c1af', pave: '#b3ab99',
  roofs: ['#b9b3a6', '#c9c3b5', '#a9a296', '#b5694a', '#9c5a40', '#6f8fa8', '#d8d2c2', '#8f8a80', '#7f8f86'],
  shadow: '#1e2026', tree: '#4f6b3a', tree2: '#5f7d45', treeLit: '#7d9a55', treeShade: '#263a20', khlong: '#2c3426',
  concrete: '#cdc7ba', concreteSh: '#9e988b', seats: '#7b8592', seats2: '#6d7784', track: '#b5553f', turf: '#4f7a45', turf2: '#5b8a50', line: '#eef0e6',
  // space and the globe
  space0: '#0b1430', space1: '#1d2c54', star: '#e8eefc', ocean: '#1f5fa8', ocean2: '#2a6db5', land: '#6b8f4e', land2: '#7f9a56', arid: '#b89a6a', tibet: '#958a72',
  cloud: '#f2f6fa', limb: '#8fd0ff', limbIn: '#6fb0e8', night: '#08142e', dot: '#2f7df6',
};

const W = 1080, H = 1920;
const FULL: Pt[] = [[-30, -30], [W + 30, -30], [W + 30, H + 30], [-30, H + 30]];
const touches = (pts: Pt[], m = 60) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return x1 >= -m && x0 <= W + m && y1 >= -m && y0 <= H + m;
};
export const ribbon = (pts: Pt[], w: number): Pt[] => {
  const n = pts.length, L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    L.push([pts[i][0] - dy * (w / 2), pts[i][1] + dx * (w / 2)]); R.push([pts[i][0] + dy * (w / 2), pts[i][1] - dx * (w / 2)]);
  }
  return [...L, ...R.reverse()];
};
const thin = (pts: Pt[], min = 0.8) => {
  const keep: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) if (Math.hypot(pts[i][0] - keep[keep.length - 1][0], pts[i][1] - keep[keep.length - 1][1]) >= min) keep.push(pts[i]);
  keep.push(pts[pts.length - 1]);
  return keep;
};
/** Annulus as one keyhole polygon (outer ring, bridge, inner ring reversed), so a translucent ring has no seams. */
export const annulus = (cx: number, cy: number, r0: number, r1: number, n = 96): Pt[] => {
  const o: Pt[] = [], i: Pt[] = [];
  for (let k = 0; k <= n; k++) { const a = (k / n) * Math.PI * 2; o.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); i.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); }
  return [...o, ...i.reverse()];
};
/** Disc (cx, cy, r) minus disc (lx, ly, R): the shaded part outside a lit disc, as one polygon (empty when L covers G). */
export const discMinus = (cx: number, cy: number, r: number, lx: number, ly: number, R: number, n = 160): Pt[] => {
  const g: Pt[] = [], l: Pt[] = [];
  const out = (x: number, y: number) => Math.hypot(x - lx, y - ly) > R, inn = (x: number, y: number) => Math.hypot(x - cx, y - cy) < r;
  const gs = Array.from({length: n}, (_, k) => [cx + r * Math.cos((k / n) * 2 * Math.PI), cy + r * Math.sin((k / n) * 2 * Math.PI)] as Pt);
  const ls = Array.from({length: n}, (_, k) => [lx + R * Math.cos((k / n) * 2 * Math.PI), ly + R * Math.sin((k / n) * 2 * Math.PI)] as Pt);
  const run = (arr: Pt[], ok: (x: number, y: number) => boolean, dst: Pt[]) => {
    const st = arr.findIndex((q, k) => ok(q[0], q[1]) && !ok(arr[(k + n - 1) % n][0], arr[(k + n - 1) % n][1]));
    if (st < 0) { if (arr.every((q) => ok(q[0], q[1]))) dst.push(...arr); return; }
    for (let k = 0; k < n; k++) { const q = arr[(st + k) % n]; if (!ok(q[0], q[1])) break; dst.push(q); }
  };
  run(gs, out, g); run(ls, inn, l);
  if (!g.length) return [];
  if (!l.length) return g;
  const e = g[g.length - 1], d0 = Math.hypot(l[0][0] - e[0], l[0][1] - e[1]), d1 = Math.hypot(l[l.length - 1][0] - e[0], l[l.length - 1][1] - e[1]);
  return [...g, ...(d0 < d1 ? l : [...l].reverse())];
};
/** The part of disc (c, r) not covered by the same disc moved `d` px along unit `u`: a crescent on the side away from u (limb shading). */
export const crescent = (cx: number, cy: number, r: number, d: number, u: Pt, n = 64): Pt[] => {
  const a = Math.atan2(Math.sqrt(Math.max(0, r * r - (d / 2) ** 2)), d / 2), b = Math.PI - a, rot = Math.atan2(u[1], u[0]), pts: Pt[] = [];
  for (let k = 0; k <= n; k++) { const t = rot + a + ((2 * Math.PI - 2 * a) * k) / n; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
  const lx = cx + u[0] * d, ly = cy + u[1] * d;
  for (let k = 0; k <= n; k++) { const t = rot + 2 * Math.PI - b - ((2 * Math.PI - 2 * b) * k) / n; pts.push([lx + r * Math.cos(t), ly + r * Math.sin(t)]); }
  return pts;
};

// ---- stage test (inside Bangkok or Nonthaburi) ------------------------------------------------------------------------------
const BKK = () => province('bangkok').ring, NON = () => province('nonthaburi').ring;
const onStage = (lon: number, lat: number) => inRing(lon, lat, BKK()) || inRing(lon, lat, NON());

/** A polyline drawn in two colours: vertices on the stage in `cIn`, outside in `cOut` (split at the vertex; the border line covers the step). */
const stageFlags = new WeakMap<Flat, Uint8Array>(); // the baked arrays never change: the stage test of every vertex is computed once
const stageOf = (xy: Flat) => {
  let f = stageFlags.get(xy);
  if (!f) { f = new Uint8Array(xy.length / 2); for (let i = 0; i < f.length; i++) f[i] = onStage(xy[2 * i], xy[2 * i + 1]) ? 1 : 0; stageFlags.set(xy, f); }
  return f;
};
const bkkFlags = new WeakMap<Flat, Uint8Array>();
const bkkOf = (xy: Flat) => {
  let f = bkkFlags.get(xy);
  if (!f) { f = new Uint8Array(xy.length / 2); for (let i = 0; i < f.length; i++) f[i] = stageOf(xy)[i] && inRing(xy[2 * i], xy[2 * i + 1], BKK()) ? 1 : 0; bkkFlags.set(xy, f); }
  return f;
};
const splitLine = (p: Painter, seed: number, cam: GCam, xy: Flat, w: number, cIn: string, cOut: string, b?: Batch) => {
  const n = xy.length / 2, fl = stageOf(xy);
  let run: Pt[] = [], runIn = fl[0] === 1, k = 0;
  const flush = () => { if (run.length >= 2 && touches(run, 20)) (b ? b.add : hardFill)(p, seed + k++, runIn ? cIn : cOut, ribbon(thin(run), w)); };
  for (let i = 0; i < n; i++) {
    const lon = xy[2 * i], lat = xy[2 * i + 1], g = gProject(cam, lat, lon), inn = fl[i] === 1;
    if (inn !== runIn) { run.push([g.x, g.y]); flush(); run = [run[run.length - 1]]; runIn = inn; } else run.push([g.x, g.y]);
  }
  flush();
};

const ringPts = (cam: GCam, xy: Flat) => gProjectPath(cam, xy, {close: true}).pts;

/** Dashed border with a soft shadow (2 px, 9 on / 6 off). */
const dashed = (p: Painter, seed: number, pts: Pt[], w = 2.2, on = 9, off = 6) => {
  hardFill(p.layer(0.35, seed), seed, LOOK_COL.borderSh, ribbon(thin(pts.map(([x, y]) => [x + 1.6, y + 1.6] as Pt)), w + 1.6));
  let acc = 0, cur: Pt[] = [pts[0]], drawOn = true, k = 1;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let s = 0;
    while (s < L) {
      const lim = (drawOn ? on : off) - acc, step = Math.min(lim, L - s);
      s += step; acc += step;
      const q: Pt = [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L];
      if (drawOn) cur.push(q);
      if (acc >= (drawOn ? on : off) - 1e-6) { if (drawOn && cur.length >= 2 && cur.some(([x, y]) => x > -20 && x < W + 20 && y > -20 && y < H + 20)) hardFill(p, seed + k++, LOOK_COL.border, ribbon(cur, w)); drawOn = !drawOn; acc = 0; cur = [q]; }
    }
  }
};

// ---- L2 metro look (LF01B, and the base of SH03/SH06/SH07) ------------------------------------------------------------------
export type MetroOpts = {/** weight of the built-up tone and grain (fix pass B, `builtUpAlpha(h)`) */ builtUp?: number; overlay?: boolean; phi?: number; outDim?: 'dim' | 'mid'; bottomShade?: number; shadeFrom?: number; streams?: number; t?: number};

/** Field patchwork: seeded fields (0.9-2.2 km) over the land, stage colours inside the provinces, dimmed outside. The land lattice is world-anchored and static: built once. */
type FieldCell = {la: number; lo: number; seed: number; r: number; a: number; col: string};
let fieldCells: FieldCell[] | null = null;
const fieldList = (): FieldCell[] => {
  if (fieldCells) return fieldCells;
  const stepDeg = 1.4 / 111, rings = MAP_L2.coast.filter((r) => r.length > 40), out: FieldCell[] = [];
  for (let la = 13.42; la < 14.25; la += stepDeg) for (let lo = 100.15; lo < 101.05; lo += stepDeg) {
    const i = Math.round(la * 1000), j = Math.round(lo * 1000), hsh = hash(i * 7919 + j);
    const cla = la + (hash(i * 31 + j) - 0.5) * stepDeg, clo = lo + (hash(i + j * 17) - 0.5) * stepDeg;
    if (!rings.some((ring) => inRing(clo, cla, ring))) continue;
    const inn = onStage(clo, cla);
    const col = inn ? (hsh < 0.33 ? LOOK_COL.rice2 : hsh < 0.6 ? LOOK_COL.orchard : LOOK_COL.rice) : hsh < 0.5 ? LOOK_COL.outLand2 : '#5c6744';
    out.push({la: cla, lo: clo, seed: 60000 + ((i * 131 + j) % 20000), r: 0.5 + hash(i * 3 + j * 5) * 0.6, a: (hash(i * 11 + j) - 0.5) * 0.5, col});
  }
  return (fieldCells = out);
};
const fields = (p: Painter, cam: GCam) => {
  const px = pxPerKm(cam), fa = smooth((px - 3) / 6); // the patchwork thins out under 9 px/km (h > 110 km) and is gone at 3 px/km: no dark window over the regional base
  if (fa <= 0.01) return;
  const q = fa < 1 ? p.layer(fa, 60000) : p, b = makeBatch();
  for (const f of fieldList()) {
    const c = gProject(cam, f.la, f.lo);
    if (c.x < -60 || c.x > W + 60 || c.y < -60 || c.y > H + 60) continue;
    const r = f.r * px;
    b.add(q, f.seed, f.col, ell(c.x, c.y, r * 1.3, r * 0.9, r > 60 ? 16 : r > 25 ? 10 : 6, f.a));
  }
  b.flush(); // grouped by colour: the patchwork keeps its blobs, the overlap order within a colour is the lattice order
};

/** Urban grain: grey ribbons along the main roads, wider near the old centre (Bangkok is built along its roads, rice between). */
const urban = (p: Painter, cam: GCam) => {
  const px = pxPerKm(cam), core = {lat: 13.752, lon: 100.53};
  let k = 0;
  const ub = makeBatch();
  for (const r of MAP_L2.roads) {
    const xy = r.xy;
    const lon = xy[0], lat = xy[1], dkm = Math.hypot((lat - core.lat) * 111, (lon - core.lon) * 108);
    const wkm = Math.max(0.7, 4.2 - dkm / 6.5) * (r.class === 'motorway' ? 0.8 : 1);
    splitLine(p, 70000 + 40 * k++, cam, xy, wkm * px, LOOK_COL.urban, LOOK_COL.outUrban, ub);
  }
  ub.flush();
  // the dense core: a blob around the old city and the CBD
  const cpts: Pt[] = [];
  for (let k2 = 0; k2 < 28; k2++) { const a = (k2 / 28) * Math.PI * 2, rr = 7.5 + 2.5 * Math.sin(a * 3 + 1) + 1.5 * hash(k2); const g = gProject(cam, core.lat + (rr * Math.sin(a)) / 111, core.lon + (rr * Math.cos(a)) / 108); cpts.push([g.x, g.y]); }
  hardFill(p, 69000, LOOK_COL.urbanCore, cpts);
};

/** Crowd fill over the stage at phi (N4): full khet as their rings, the partial khet faint, Nonthaburi cells (in `fillKey` order, so the fingers along the river and
 * highways are inside the phi count) merged into row runs, a speck dither ahead of the front, world-anchored flecks on a 0.55 km lattice. */
export {fillKey};
type Fleck = {la: number; lo: number; col: string; s: number; seed: number; khet: number; cell: number};
let fleckList: Fleck[] | null = null;
/** The fleck lattice, static: each fleck knows the khet (index in the fill order) or the Nonthaburi cell it sits in, so a frame only projects and tests the fill state. */
const flecks = (): Fleck[] => {
  if (fleckList) return fleckList;
  const m = fillModel(), st = 0.55 / 111, out: Fleck[] = [], bkb = province('bangkok').bbox, idx = new Map(m.khet.map((q, i) => [q.id, i]));
  const bk = MAP_L2.districts.filter((d) => d.province === 'bangkok').map((d) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < d.ring.length; i += 2) { x0 = Math.min(x0, d.ring[i]); x1 = Math.max(x1, d.ring[i]); y0 = Math.min(y0, d.ring[i + 1]); y1 = Math.max(y1, d.ring[i + 1]); }
    return {d, x0, x1, y0, y1};
  });
  let k = 0;
  for (let la = 13.48; la < 14.16; la += st) for (let lo = 100.32; lo < 100.95; lo += st) {
    const i = Math.round(la / st), j = Math.round(lo / st), hs = hash(i * 9176 + j);
    if (hs > 0.42) continue;
    const fla = la + (hash(i * 3 + j * 7) - 0.5) * st, flo = lo + (hash(i * 5 + j * 3) - 0.5) * st;
    let khet = -1, cell = -1;
    if (flo >= bkb.lon[0] && flo <= bkb.lon[1] && fla >= bkb.lat[0] && fla <= bkb.lat[1]) {
      const hit = bk.find((q) => flo >= q.x0 && flo <= q.x1 && fla >= q.y0 && fla <= q.y1 && inRing(flo, fla, q.d.ring));
      if (hit) khet = idx.get(hit.d.id) ?? -1;
    }
    if (khet < 0 && inRing(flo, fla, NON())) cell = cellNear(flo, fla);
    if (khet < 0 && cell < 0) continue;
    out.push({la: fla, lo: flo, col: LOOK_COL.flecks[Math.floor(hash(i * 41 + j * 13) * LOOK_COL.flecks.length)], s: 1.1 + hash(i + j * 29) * 1.0, seed: 90000 + (k++ % 30000), khet, cell});
  }
  return (fleckList = out);
};

export const paintFill = (p: Painter, cam: GCam, phi: number) => {
  const px = pxPerKm(cam), m = fillModel(), kf = khetFill(phi), nF = nonCount(phi);
  const byId = new Map(MAP_L2.districts.map((d) => [d.id, d]));
  const full = kf.every((v) => v >= 1);
  if (full) hardFill(p, 80000, LOOK_COL.crowd, ringPts(cam, BKK()));
  else m.khet.forEach((k, i) => { if (kf[i] > 0) hardFill(p.layer(kf[i] >= 1 ? 1 : 0.35 + 0.5 * kf[i], 80100 + i), 80100 + i, LOOK_COL.crowd, ringPts(cam, byId.get(k.id)!.ring)); });
  // Nonthaburi: the filled cells as runs along each grid row (a run = scalloped capsule, the union of the 0.3 km blobs)
  const r = 0.3 * px, step = (m.cellDeg / 111) * 0.999, rows = new Map<number, number[]>();
  for (let n = 0; n < nF; n++) { const key = Math.round(m.cells[n].y / step); (rows.get(key) ?? rows.set(key, []).get(key)!).push(n); }
  for (const [key, ns] of rows) {
    ns.sort((a, b) => m.cells[a].x - m.cells[b].x);
    let run: number[] = [];
    const flush = () => {
      if (!run.length) return;
      const top: Pt[] = [], bot: Pt[] = [];
      run.forEach((n, q) => {
        const c = m.cells[n], g = gProject(cam, c.y, c.x), wob = (hash(n * 3 + 1) - 0.5) * 0.12 * r;
        top.push([g.x, g.y - r * (1.02 + wob / r)]); bot.push([g.x, g.y + r * (1.02 - wob / r)]);
        if (q < run.length - 1) { const d = gProject(cam, (c.y + m.cells[run[q + 1]].y) / 2, (c.x + m.cells[run[q + 1]].x) / 2); top.push([d.x, d.y - r * 0.9]); bot.push([d.x, d.y + r * 0.9]); }
      });
      const a = gProject(cam, m.cells[run[0]].y, m.cells[run[0]].x), b = gProject(cam, m.cells[run[run.length - 1]].y, m.cells[run[run.length - 1]].x);
      const poly: Pt[] = [[a.x - r * 1.0, a.y], ...top, [b.x + r * 1.0, b.y], ...bot.reverse()];
      if (touches(poly, 10)) hardFill(p, 81000 + (key % 4000), LOOK_COL.crowd, poly);
      run = [];
    };
    for (const n of ns) { if (run.length && Math.abs(m.cells[n].x - m.cells[run[run.length - 1]].x) * 108 > 0.4 * 1.5) flush(); run.push(n); }
    flush();
  }
  // speck dither ahead of the front (single people still walking in): cells just past the front, over land and water alike (O5)
  if (nF > 0) {
    const front = m.cells[Math.min(nF, m.cells.length - 1)].key;
    for (let n = nF; n < m.cells.length && m.cells[n].key <= front + 0.9; n++) {
      const c = m.cells[n], near = 1 - (c.key - front) / 0.9;
      for (let s = 0; s < 3; s++) if (hash(n * 13 + s) < near * 0.8) { const g = gProject(cam, c.y + (hash(n * 7 + s) - 0.5) * 0.004, c.x + (hash(n * 5 + s) - 0.5) * 0.004); if (g.x > -4 && g.x < W + 4 && g.y > -4 && g.y < H + 4) hardFill(p, 83000 + n * 3 + s, LOOK_COL.crowdDeep, ell(g.x, g.y, 1.4, 1.4, 5)); }
    }
  }
  // flecks over the crowd (river included), grouped by colour
  const fb = makeBatch();
  for (const f of flecks()) {
    if (f.khet >= 0 ? kf[f.khet] < 1 : f.cell >= nF) continue;
    const g = gProject(cam, f.la, f.lo);
    if (g.x < -4 || g.x > W + 4 || g.y < -4 || g.y > H + 4) continue;
    const s = f.s;
    fb.add(p, f.seed, f.col, [[g.x - s, g.y - s * 0.8], [g.x + s, g.y - s], [g.x + s * 0.9, g.y + s], [g.x - s, g.y + s * 0.9]]);
  }
  fb.flush();
};

/** Road geometry for the streams: each way oriented so that index 0 is the end nearer MC (flecks flow toward index 0), with its cumulative length in km. */
type RoadPath = {r: (typeof MAP_L2.roads)[number]; xy: Flat; cum: number[]; n: number};
let roadPaths: RoadPath[] | null = null;
const MCP = {lat: G_ANCHORS.MC.lat, lon: G_ANCHORS.MC.lon};
const roadList = (): RoadPath[] => roadPaths ?? (roadPaths = MAP_L2.roads.map((r) => {
  const n = r.xy.length / 2, d = (i: number) => Math.hypot((r.xy[2 * i + 1] - MCP.lat) * 111.195, (r.xy[2 * i] - MCP.lon) * 108);
  let xy = r.xy;
  if (d(n - 1) < d(0)) { xy = []; for (let i = n - 1; i >= 0; i--) xy.push(r.xy[2 * i], r.xy[2 * i + 1]); }
  const cum = [0];
  for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot((xy[2 * i + 1] - xy[2 * i - 1]) * 111.195, (xy[2 * i] - xy[2 * i - 2]) * 108));
  return {r, xy, cum, n};
}));

export type StreamPassOpts = {
  /** stream amount 0..1 (the plate's `streams`; SH07's last trickle thins it) */ amount: number; phi: number; /** 0..1: the city is full, the paths read as solid crowd (shots 9 and 16) */ solid?: number;
  t: number; /** the camera altitude in km (widths, floors and the arm fade key on it) */ h: number;
};
/** Crowd streams along the highways and the K02 avenues: ONE path set from h 0.58 km to 80 km (fix pass B, B-MR4), drawn above L3 and L2 at full weight so no cross-fade thins it.
 * Widths follow the zoom up to a floor (motorway 12 px, trunk 8 px, K02 arms 10 px: at 270 px a 12 px ribbon is 3 px) that fades to the original 2.6 px by h 72 (frames h >= 72 are unchanged); the flecks drift toward
 * MC (and toward the bowl on the arms), with density that keeps a roughly constant 10 px spacing (a fixed candidate per 100 m is shown by rank, so nothing swims). Outside the stage
 * the paths are always open; inside Bangkok only where the khet is not yet full (`phi`); `solid` opens all of them. */
export const paintStreamPass = (p: Painter, cam: GCam, o: StreamPassOpts) => {
  const px = pxPerKm(cam), h = o.h, mid = 1 - logSmooth(h, 40, 72), solid = o.solid ?? 0, amount = o.amount * (solid > 0.5 ? mid : 1); // solid paths only below h 72: the filled map at h 80 stays as approved
  if (amount <= 0.004) return;
  const kf = khetFill(o.phi), m = fillModel();
  const byId = new Map(MAP_L2.districts.map((d) => [d.id, d])), cents = m.khet.map((q) => byId.get(q.id)!.centroid);
  const sb = makeBatch(), V = solid ? 0 : 0.35; // fleck speed, share of a path per second
  const roadAlpha = logSmooth(h, 1.5, 2.4); // the OSM paths come in over L3 while the arms hand over (L3 draws the arms below h 2 km)
  if (roadAlpha > 0.004) {
    const q = roadAlpha < 1 ? p.layer(roadAlpha, 95000) : p;
    let k = 0;
    for (const rp of roadList()) {
      const kk = k++, mw = rp.r.class === 'motorway';
      if (!mw && hash(kk * 3 + 1) > 0.35) continue;
      const xy = rp.xy, n = rp.n, fl = stageOf(xy), bf = bkkOf(xy), open: boolean[] = [];
      let any = false;
      for (let i = 0; i < n; i++) {
        let op = solid > 0.5 || fl[i] === 0;
        if (!op && bf[i] === 1 && o.phi < m.phiBangkok) {
          const lon = xy[2 * i], lat = xy[2 * i + 1];
          let best = -1, bd = Infinity;
          cents.forEach((c, j) => { const dd2 = (c[0] - lon) ** 2 + (c[1] - lat) ** 2; if (dd2 < bd) { bd = dd2; best = j; } });
          op = best >= 0 && kf[best] < 1;
        }
        open.push(op); any ||= op;
      }
      if (!any) continue;
      const pts: Pt[] = []; // projected once; runs are cut at closed vertices
      for (let i = 0; i < n; i++) { const g = gProject(cam, xy[2 * i + 1], xy[2 * i]); pts.push([g.x, g.y]); }
      const flo = (mw ? 12 : 8) * mid + 2.6 * (1 - mid), w = Math.max(flo, Math.min(20, 0.075 * px));
      let run: Pt[] = [];
      const flush = () => { if (run.length >= 2 && touches(run, 10)) hardFill(q.layer(0.85 * amount, 95000 + kk), 95000 + kk, solid > 0.5 ? LOOK_COL.crowdLit : LOOK_COL.crowd, ribbon(thin(run), w)); run = []; };
      for (let i = 0; i < n; i++) { if (open[i]) run.push(pts[i]); else flush(); }
      flush();
      // flecks: a candidate every 100 m of way, shown by rank so the spacing stays about 10 px; drift toward index 0
      const qa = q.layer(0.9 * amount, 96500), L = rp.cum[n - 1], M = Math.ceil(L * 10), dens = Math.min(1, (0.1 * px) / 10) * (solid > 0.5 ? 1 : 0.8), fs = Math.max(1.6, Math.min(6, w * 0.3));
      for (let mi = 0; mi < M; mi++) {
        const rk = hash(kk * 7919 + mi * 13 + 3);
        if (rk > dens) continue;
        const u0 = hash(kk * 104729 + mi * 31 + 1), u = (((u0 - V * o.t) % 1) + 1) % 1, s = (1 - u) * L;
        let i = 1; while (i < n - 1 && rp.cum[i] < s) i++;
        if (!open[i - 1] || !open[i]) continue;
        const f = (s - rp.cum[i - 1]) / Math.max(1e-9, rp.cum[i] - rp.cum[i - 1]), x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f;
        if (x < -6 || x > W + 6 || y < -6 || y > H + 6) continue;
        const off = (hash(kk * 31 + mi * 7) - 0.5) * w * 0.7;
        sb.add(qa, 96000 + ((kk * 50 + mi) % 9000), LOOK_COL.flecks[(mi + kk) % LOOK_COL.flecks.length], ell(x + off * 0.5, y + off * 0.5, fs, fs, 4));
      }
    }
  }
  // the K02 avenues (the L3 arms) over h 2-25 km: the same code the L3 layer runs below 2 km, widths floored, fading to the OSM paths
  const armW = 1 - logSmooth(h, 8, 25);
  if (armW > 0.004 && h >= 2) {
    const pitch = 0.118, av = 4, half = (0.5 * Math.hypot(W, H)) / px + 0.15, i0 = Math.floor(-half / pitch) - 1, i1 = Math.ceil(half / pitch) + 1, reach = Math.min(half * 1.1, 4.5);
    armStreams(armW < 1 ? p.layer(armW, 97000) : p, cam, {amt: amount, rot: (24 * Math.PI) / 180, pitch, av, i0, i1: Math.min(i1, i0 + 60), reach, t: o.t, floor: 10, sideMin: 1.4, solid: solid > 0.5 ? 1 : 0});
  }
  sb.flush();
};

export {bottomShade};

export const paintMetroLook = (p: Painter, cam: GCam, o: MetroOpts = {}) => {
  const px = pxPerKm(cam), dim = o.outDim ?? 'dim';
  // overlay (above h 25 km, over the regional base): the Gulf only inside the L2 coast window; otherwise the whole frame
  const [wx0, wy0, wx1, wy1] = MAP_L2.coastWindow, win: Pt[] = [];
  if (o.overlay) {
    const corners: Pt[] = [[wx0, wy0], [wx1, wy0], [wx1, wy1], [wx0, wy1]];
    for (let e = 0; e < 4; e++) for (let q = 0; q < 8; q++) { const A = corners[e], B = corners[(e + 1) % 4], u = q / 8, g = gProject(cam, A[1] + (B[1] - A[1]) * u, A[0] + (B[0] - A[0]) * u); win.push([g.x, g.y]); }
  }
  hardFill(p, 50001, LOOK_COL.gulf, o.overlay ? win : FULL);
  // shelf: lighter silty water hugging the coast (drawn as wide coast ribbons) and deep water beyond
  for (const xy of MAP_L2.coastLines) { const pts = gProjectPath(cam, xy).pts; if (pts.length > 1 && touches(pts)) { hardFill(p, 50010, LOOK_COL.gulfShelf, ribbon(thin(pts), 3.2 * px)); hardFill(p, 50011, LOOK_COL.gulfSilt, ribbon(thin(pts), 1.1 * px)); } }
  if (!o.overlay) for (let q = 0; q < 9; q++) { const y = 1400 + q * 58 + 20 * hash(q), x = 120 + 840 * hash(q * 3); hardFill(p.layer(0.14, 50020 + q), 50020 + q, '#3d6274', ell(x, y, 140 + 120 * hash(q * 5), 6 + 5 * hash(q * 7), 16, -0.06)); }
  let k = 0;
  for (const xy of MAP_L2.coast) { const pts = ringPts(cam, xy); if (pts.length > 2 && touches(pts)) hardFill(p, 50100 + k++, dim === 'dim' ? LOOK_COL.outLand : '#6d7652', pts); }
  hardFill(p, 50200, LOOK_COL.rice, ringPts(cam, BKK()));
  hardFill(p, 50201, LOOK_COL.rice, ringPts(cam, NON()));
  fields(p, cam);
  urban(o.builtUp && o.builtUp > 0.004 ? p.layer(1 - o.builtUp, 69500) : p, cam); // the road-ribbon placeholder gives way to the built-up tone (weight 0 from h 60: LF01B unchanged)
  if (o.builtUp) paintBuiltUp(p, cam, o.builtUp, (o.phi ?? 0) >= fillModel().phiBangkok);
  // water: canals, then the rivers (silt brown on the stage, darker outside)
  const wb = makeBatch(), rb = makeBatch(), ob = makeBatch(); // canals, rivers, roads: each grouped by colour (in-stage / outside)
  if (px > 3) for (const c of MAP_L2.canals) splitLine(p, 52000 + (k++ % 3000), cam, c.xy, Math.max(0.9, Math.min(2.4, px * 0.05)), LOOK_COL.canal, LOOK_COL.outRiver, wb);
  wb.flush();
  // B-MR3 skeleton floors, fading to the approved LF01B widths and colours by h 72: the river 5 px, the motorways and arterials 2.2 px, in a road tone darker than the built-up grey
  const sk = 1 - logSmooth(cam.h, 40, 72), roadTone = mixHex(LOOK_COL.road, ROAD_DARK, sk);
  for (const r of MAP_L2.rivers) splitLine(p, 56000 + (k++ % 2000), cam, r.xy, Math.max(2.2 + 2.8 * sk, 0.3 * px), LOOK_COL.river, LOOK_COL.outRiver, rb);
  rb.flush();
  for (const r of MAP_L2.roads) splitLine(p, 57000 + (k++ % 3000), cam, r.xy, Math.max(1.2 + 1.0 * sk, Math.min(4, px * 0.025)), roadTone, LOOK_COL.outRoad, ob);
  ob.flush();
  if (o.phi && o.phi > 0) paintFill(p, cam, o.phi);
  // a full city keeps its structure: river and highways over the crowd fill (shots 9 and 16 mid-rise), fading out by h 72
  if (o.phi && o.phi >= 0.9 && sk > 0.02) {
    const q = p.layer(sk, 68000), fb2 = makeBatch(), fr = makeBatch();
    for (const r of MAP_L2.rivers) splitLine(q, 68100 + (k++ % 2000), cam, r.xy, Math.max(5, 0.3 * px), '#2c261c', '#2c261c', fr);
    fr.flush();
    for (const r of MAP_L2.roads) splitLine(q, 68500 + (k++ % 3000), cam, r.xy, Math.max(2.2, Math.min(4, px * 0.025)), '#d8cdb6', '#d8cdb6', fb2);
    fb2.flush();
  }
  // district lines faint over everything (the fill keeps "every district" readable), province borders on top
  const dq = p.layer(0.35, 58000);
  let j = 0;
  for (const xy of MAP_L2.districtLines) { const pts = gProjectPath(cam, xy).pts; if (pts.length > 1 && touches(pts, 10)) hardFill(dq, 58000 + j++, LOOK_COL.district, ribbon(thin(pts), 1.2)); }
  for (const pr of MAP_L2.provinces) dashed(p, pr.id === 'bangkok' ? 59000 : 59500, ringPts(cam, pr.ring.concat(pr.ring.slice(0, 2))));
  if (o.bottomShade) bottomShade(p, o.shadeFrom ?? 1130, o.bottomShade);
};

// ---- L3: the K02 neighbourhood (LF01A) --------------------------------------------------------------------------------------
/** `solid` 0..1: crowd over the street network (SH16: streets solid crowd, the stands full: pass `standsFull: 1`). */
export type L3Opts = {gridDeg?: number; streams?: number; light?: 'sun' | 'haze'; standsFull?: number; solid?: number; /** skip the avenue streams (`paintStreamPass` draws them) */ noStreams?: boolean; /** the clock, seconds (the stream flecks drift toward the bowl) */ t?: number; /** the layer's own alpha (the plate passes `lodAlpha(h).l3`): under 0.4 the blocks keep only their pave, no roofs, shadows or trees */ fade?: number};
const KX = 111.195 * Math.cos((G_ANCHORS.K02.lat * Math.PI) / 180), KY = 111.195;
/** Local metric frame around K02 (km east, km north), optionally turned by the street-grid angle. */
const local = (cam: GCam, e: number, n: number, rot = 0): Pt => {
  const c = Math.cos(rot), s = Math.sin(rot), E = e * c - n * s, N = e * s + n * c;
  const g = gProject(cam, G_ANCHORS.K02.lat + N / KY, G_ANCHORS.K02.lon + E / KX);
  return [g.x, g.y];
};
const rect = (cam: GCam, e0: number, n0: number, e1: number, n1: number, rot: number): Pt[] => [local(cam, e0, n0, rot), local(cam, e1, n0, rot), local(cam, e1, n1, rot), local(cam, e0, n1, rot)];
const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...s].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** Bowl (stadium) geometry in km, local axes (long axis east-west). */
const BOWL = {outerE: 0.15, outerN: 0.125, standE: 0.135, standN: 0.11, trackE: 0.088, trackN: 0.06, fieldE: 0.0525, fieldN: 0.034, plazaE: 0.2, plazaN: 0.175};
const inBowlZone = (e: number, n: number) => (e / 0.215) ** 2 + (n / 0.19) ** 2 < 1;
const KHLONG_N = -0.36; // the canal and its tree belts south of the stadium: under the caption band at the LF01A camera

/** The avenue streams of the K02 neighbourhood (LF01A): people fill the avenues that run into the bowl (the arms through K02, both axes of the turned grid) and trickle along the side
 * streets, densest at the plaza, ragged speck fronts toward the frame edges (they are still arriving). Flecks drift toward the bowl with the clock `t` (0 at the first frame: the
 * LF01A frame is unchanged). Drawn by `paintL3Look` below h 2 km and by `paintStreamPass` above, so the arms are one path set across the L3 -> L2 hand-over (B-MR4). */
export type ArmOpts = {amt: number; rot: number; pitch: number; av: number; i0: number; i1: number; reach: number; t: number; /** lowest ribbon width in px for the arms (0 = the L3 value) */ floor?: number; /** side streets only above this width in px */ sideMin?: number; solid?: number};
export const armStreams = (p: Painter, cam: GCam, o: ArmOpts) => {
  const px = pxPerKm(cam), {rot, pitch, av, i0, i1, reach, amt} = o, stb = makeBatch(), V = 0.16; // V: share of an arm per second
  let sk = 0;
  const stream = (pts: Pt[], wPx: number, dense: number) => {
    const nP = pts.length - 1, core = pts.slice(0, Math.max(2, Math.round(nP * dense) + 1));
    hardFill(p, 440000 + sk, o.solid ? LOOK_COL.crowdLit : LOOK_COL.crowd, ribbon(core, wPx));
    const per = Math.round(wPx * nP * 0.9);
    for (let q = 0; q < per; q++) {
      const a0 = Math.pow(hash(sk * 1000 + q), 1.2), along = o.t ? (((a0 - V * o.t * (o.solid ? 0 : 1)) % 1) + 1) % 1 : a0, idx = Math.min(nP - 1, Math.floor(along * nP)), A2 = pts[idx], B2 = pts[idx + 1];
      const f = along * nP - idx, x = A2[0] + (B2[0] - A2[0]) * f, y = A2[1] + (B2[1] - A2[1]) * f, dx = B2[0] - A2[0], dy = B2[1] - A2[1], L = Math.hypot(dx, dy) || 1;
      if (along > dense && hash(q * 7 + sk) < (along - dense) * 2.2) continue;
      const side = (hash(sk * 2000 + q) - 0.5) * wPx * 0.95, s = 1.6 + hash(q * 3 + sk) * 1.4 + (o.floor ? Math.min(1.2, o.floor * 0.1) : 0);
      stb.add(p, 441000 + ((sk * 3000 + q) % 60000), q % 4 === 0 ? LOOK_COL.crowdDeep : LOOK_COL.flecks[(q + sk) % LOOK_COL.flecks.length], ell(x - (dy / L) * side, y + (dx / L) * side, s, s, 5));
    }
    sk++;
  };
  const arm = (e0: number, n0: number, e1: number, n1: number, steps = 24) => Array.from({length: steps + 1}, (_, q) => local(cam, e0 + ((e1 - e0) * q) / steps, n0 + ((n1 - n0) * q) / steps, rot));
  for (const [de, dn] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) stream(arm(de * 0.16, dn * 0.14, de * reach, dn * reach), Math.max(o.floor ?? 0, 0.03 * px), 0.45 + 0.35 * amt);
  // side streets feeding the arms: alternate streets carry a thinner stream toward the avenue
  if (0.012 * px >= (o.sideMin ?? 0)) for (let i = i0; i <= i1; i++) {
    if (i % av === 0 || hash(i * 13 + 5) > 0.55) continue;
    const len = (0.12 + 0.25 * hash(i * 7)) * reach, sgn = hash(i * 3) < 0.5 ? 1 : -1;
    if (Math.abs(i * pitch) < 0.2) continue;
    stream(arm(i * pitch, 0, i * pitch, sgn * len, 10), 0.012 * px, 0.4 * amt + 0.2);
    stream(arm(0, i * pitch, sgn * len, i * pitch, 10), 0.012 * px, 0.4 * amt + 0.2);
  }
  stb.flush(); // the stream flecks, grouped by colour, over all the ribbons
};

export const paintL3Look = (p: Painter, cam: GCam, o: L3Opts = {}) => {
  const px = pxPerKm(cam), rot = ((o.gridDeg ?? 0) * Math.PI) / 180, sunPx: Pt = [-0.92, -0.38]; // shadows fall west-north-west (sun ESE, 55 deg up)
  const shK = (0.7 * px) / 1000; // px of shadow per metre of height (px is per km)
  hardFill(p, 300001, LOOK_COL.street, FULL);
  // size cull for the rise (from h 1 km): units under 9 px (the 0.8 m party gaps are under 1 px by then) merge into one strip per block side, no parapets, details or tiny trees
  const coarse = 0.009 * px < 9, ultra = 0.118 * px < 60, lite = (o.fade ?? 1) < 0.4, solid = o.solid ?? 0; // ultra (h > 2 km): one roof and one shadow per block
  const half = (0.5 * Math.hypot(W, H)) / px + 0.15;
  const pitch = 0.118, av = 4; // block pitch km; every 4th street an avenue
  const i0 = Math.floor(-half / pitch) - 1, i1 = Math.ceil(half / pitch) + 1;
  // avenues (wider, darker asphalt) under everything
  for (let i = i0; i <= i1; i++) if (i % av === 0) {
    hardFill(p, 300100 + i + 200, LOOK_COL.avenue, rect(cam, i * pitch - 0.016, -half, i * pitch + 0.016, half, rot));
    hardFill(p, 300600 + i + 200, LOOK_COL.avenue, rect(cam, -half, i * pitch - 0.016, half, i * pitch + 0.016, rot));
  }
  if (solid > 0) hardFill(p.layer(solid, 300050), 300050, LOOK_COL.crowd, FULL);
  // the khlong belt (east-west, unrotated so it stays under the band): water between two tree belts
  hardFill(p, 301000, LOOK_COL.treeShade, rect(cam, -half, KHLONG_N - 0.066, half, KHLONG_N + 0.066, 0));
  hardFill(p, 301001, LOOK_COL.khlong, rect(cam, -half, KHLONG_N - 0.026, half, KHLONG_N + 0.026, 0));
  hardFill(p.layer(0.5, 301002), 301002, '#3c4638', rect(cam, -half, KHLONG_N + 0.004, half, KHLONG_N + 0.009, 0)); // a soft sky reflection line on the water
  // blocks: shophouse rows (units 9-15 m, 4 storeys) around the edge of every block, one or two bigger buildings or a yard with trees inside;
  // shadows fall west-north-west (0.7 m per metre of height at 55 deg sun elevation)
  const shadows: Pt[][] = []; const roofs: {pts: Pt[]; col: string; seed: number; det: Pt[][]}[] = []; let trees: {c: Pt; r: number; seed: number; belt?: boolean}[] = [];
  const offFor = (hM: number): Pt => [sunPx[0] * hM * shK, sunPx[1] * hM * shK];
  const RT = ['#b9b3a6', '#a9a296', '#c4bdaf', '#9e978b'];
  for (let i = i0; i <= i1; i++) for (let j = i0; j <= i1; j++) {
    const e0 = i * pitch + (i % av === 0 ? 0.02 : 0.007), n0 = j * pitch + (j % av === 0 ? 0.02 : 0.007), e1 = (i + 1) * pitch - ((i + 1) % av === 0 ? 0.02 : 0.007), n1 = (j + 1) * pitch - ((j + 1) % av === 0 ? 0.02 : 0.007);
    const ce = (e0 + e1) / 2, cn = (n0 + n1) / 2;
    const [wx, wy] = [ce * Math.cos(rot) - cn * Math.sin(rot), ce * Math.sin(rot) + cn * Math.cos(rot)];
    if (inBowlZone(wx, wy) || Math.abs(wy - KHLONG_N) < 0.075) continue;
    const box = rect(cam, e0, n0, e1, n1, rot);
    if (!touches(box, 40)) continue;
    const bs = (i + 300) * 1000 + (j + 300);
    hardFill(p, 302000 + (bs % 40000), LOOK_COL.pave, box);
    if (lite) continue;
    if (ultra) {
      const fp = rect(cam, e0 + 0.004, n0 + 0.004, e1 - 0.004, n1 - 0.004, rot), o3 = offFor(14);
      shadows.push(hull([...fp, ...fp.map(([x, y]) => [x + o3[0], y + o3[1]] as Pt)]));
      roofs.push({pts: fp, col: RT[Math.floor(hash(bs * 3) * 4)], seed: bs * 64, det: []});
      continue;
    }
    const dep = 0.016, tone = hash(bs * 3);
    // four rows: south and north rows full width, west and east rows between them
    const rows: [number, number, number, number, boolean][] = [[e0, n0, e1, n0 + dep, true], [e0, n1 - dep, e1, n1, true], [e0, n0 + dep, e0 + dep, n1 - dep, false], [e1 - dep, n0 + dep, e1, n1 - dep, false]];
    rows.forEach(([a0, b0, a1, b1, alongE], ri) => {
      if (coarse) {
        const fp = rect(cam, a0, b0, a1, b1, rot);
        if (ri === 0) { const bf = rect(cam, e0, n0, e1, n1, rot), o3 = offFor(14); shadows.push(hull([...bf, ...bf.map(([x, y]) => [x + o3[0], y + o3[1]] as Pt)])); } // one shadow per block
        roofs.push({pts: fp, col: RT[Math.floor((tone * 4 + ri) % 4)], seed: bs * 64 + ri * 16, det: []});
        return;
      }
      const L = alongE ? a1 - a0 : b1 - b0;
      let u = 0, q = 0;
      while (u < L - 0.004) {
        const w = Math.min(L - u, 0.009 + 0.008 * hash(bs * 31 + ri * 7 + q)), hs = hash(bs * 37 + ri * 11 + q);
        const fp = alongE ? rect(cam, a0 + u, b0, a0 + u + w, b1, rot) : rect(cam, a0, b0 + u, a1, b0 + u + w, rot);
        const hM = 11 + 6 * hs, o2 = offFor(hM);
        shadows.push(hull([...fp, ...fp.map(([x, y]) => [x + o2[0], y + o2[1]] as Pt)]));
        const col = hs > 0.86 ? LOOK_COL.roofs[3 + Math.floor(hash(bs + q) * 3)] : RT[Math.floor((tone * 4 + hs * 1.6) % 4)];
        const det: Pt[][] = [];
        if (hash(bs * 41 + q + ri) < 0.5) { const c = local(cam, alongE ? a0 + u + w / 2 : (a0 + a1) / 2, alongE ? (b0 + b1) / 2 : b0 + u + w / 2, rot); det.push(ell(c[0], c[1], 0.0016 * px, 0.0016 * px, 7)); }
        roofs.push({pts: fp, col, seed: bs * 64 + ri * 16 + q, det});
        u += w + 0.0008; q++;
      }
    });
    // inside the rows: a bigger building (condo, warehouse, temple hall) or a yard with trees
    const ie0 = e0 + dep + 0.006, ie1 = e1 - dep - 0.006, in0 = n0 + dep + 0.006, in1 = n1 - dep - 0.006, hs = hash(bs * 7);
    if (hs < 0.4) { if (!coarse) for (let t = 0; t < 5; t++) trees.push({c: local(cam, ie0 + (ie1 - ie0) * hash(bs * 9 + t), in0 + (in1 - in0) * hash(bs * 11 + t), rot), r: (0.006 + 0.005 * hash(bs + t)) * px, seed: bs * 8 + t}); }
    else {
      const fp = rect(cam, ie0 + 0.006 * hash(bs), in0, ie1, in1 - 0.01 * hash(bs * 5), rot), hM = hs > 0.88 ? 45 + 40 * hash(bs + 9) : 14 + 10 * hash(bs * 5), o2 = offFor(hM);
      shadows.push(hull([...fp, ...fp.map(([x, y]) => [x + o2[0], y + o2[1]] as Pt)]));
      const det: Pt[][] = [];
      if (!coarse) for (let d = 0; d < 3; d++) { const c = local(cam, ie0 + (ie1 - ie0) * (0.2 + 0.6 * hash(bs * 17 + d)), in0 + (in1 - in0) * (0.2 + 0.6 * hash(bs * 19 + d)), rot); det.push(ell(c[0], c[1], 0.0025 * px, 0.0025 * px, 8)); }
      roofs.push({pts: fp, col: hs > 0.88 ? '#d8d2c2' : LOOK_COL.roofs[Math.floor(hash(bs * 11) * LOOK_COL.roofs.length)], seed: bs * 64 + 60, det});
    }
  }
  // street trees along the khlong belt and a few avenues
  for (let e = -half; e < half; e += ultra ? 0.033 : 0.011) for (const side of [-1, 1]) { const n = KHLONG_N + side * (0.035 + 0.012 * hash(Math.round(e * 1000) + side)); trees.push({c: local(cam, e + 0.004 * hash(e * 999), n, 0), r: (0.009 + 0.006 * hash(Math.round(e * 777) + side)) * px, seed: 700000 + Math.round(e * 1000) * 2 + side, belt: true}); }
  trees = trees.filter((t) => t.r >= 0.9 && t.c[0] > -30 && t.c[0] < W + 30 && t.c[1] > -30 && t.c[1] < H + 30); // size and screen cull
  const sh = p.layer(o.light === 'haze' ? 0.28 : 0.42, 310000);
  shadows.forEach((s, n) => hardFill(sh, 310000 + n, LOOK_COL.shadow, s));
  // roofs, parapet strips and details do not overlap one another: drawn grouped by colour (a composite per colour, not per roof)
  const rb = makeBatch(), pb = makeBatch(), db = makeBatch(), pl = p.layer(0.25, 380000);
  roofs.forEach((r) => {
    rb.add(p, 320000 + (r.seed % 60000), r.col, r.pts);
    if (coarse) return;
    // parapet shade on the west and north edge (one darker strip)
    const [a, b, , d] = r.pts;
    pb.add(pl, 380000 + (r.seed % 9000), LOOK_COL.shadow, [a, b, [b[0] + (d[0] - a[0]) * 0.08, b[1] + (d[1] - a[1]) * 0.08], [a[0] + (d[0] - a[0]) * 0.08, a[1] + (d[1] - a[1]) * 0.08]]);
    r.det.forEach((dd, q) => db.add(p, 390000 + ((r.seed * 5 + q) % 9000), q % 2 ? '#e8e4da' : '#8a8d90', dd));
  });
  rb.flush(); pb.flush(); db.flush();
  const ts = p.layer(0.45, 400000);
  trees.forEach((t, n) => hardFill(ts, 400000 + (n % 9000), LOOK_COL.treeShade, ell(t.c[0] + sunPx[0] * t.r * 0.7, t.c[1] + sunPx[1] * t.r * 0.7, t.r, t.r, 9)));
  const tb = makeBatch(), th = makeBatch(), thBelt = p.layer(0.45, 420000);
  trees.forEach((t, n) => {
    tb.add(p, 410000 + (n % 9000), t.belt ? (hash(t.seed) < 0.5 ? '#2e4225' : '#354b2b') : hash(t.seed) < 0.5 ? LOOK_COL.tree : LOOK_COL.tree2, ell(t.c[0], t.c[1], t.r, t.r * 0.95, 10));
    th.add(t.belt ? thBelt : p, 420000 + (n % 9000), t.belt ? '#4f6a3a' : LOOK_COL.treeLit, ell(t.c[0] + t.r * 0.3, t.c[1] + t.r * 0.15, t.r * 0.45, t.r * 0.4, 7));
  });
  tb.flush(); th.flush();
  // the stadium bowl at K02
  const B = BOWL, cE = (e: number, n: number) => local(cam, e, n, 0);
  const oval = (a: number, b: number, nn = 64) => Array.from({length: nn}, (_, q) => cE(a * Math.cos((q / nn) * Math.PI * 2), b * Math.sin((q / nn) * Math.PI * 2)));
  hardFill(p, 430000, LOOK_COL.plaza, oval(B.plazaE, B.plazaN));
  hardFill(sh, 430001, LOOK_COL.shadow, oval(B.outerE, B.outerN).map(([x, y]) => [x + sunPx[0] * 30 * shK, y + sunPx[1] * 30 * shK] as Pt));
  hardFill(p, 430002, LOOK_COL.concrete, oval(B.outerE, B.outerN));
  hardFill(p, 430003, LOOK_COL.seats, oval(B.standE, B.standN));
  // tiers: three concentric bands and radial aisles
  hardFill(p, 430004, LOOK_COL.seats2, oval(B.standE - 0.016, B.standN - 0.016));
  hardFill(p, 430005, LOOK_COL.seats, oval(B.standE - 0.032, B.standN - 0.032));
  // crowd in the stands: the south and west half full (a ragged edge), streams entering at the gates
  const full = o.standsFull ?? 0.55;
  const stand: Pt[] = [];
  const a0 = Math.PI * 0.35, a1 = a0 + Math.PI * 2 * full;
  for (let q = 0; q <= 48; q++) { const a = a0 + ((a1 - a0) * q) / 48; stand.push(cE((B.standE - 0.002) * Math.cos(a), -(B.standN - 0.002) * Math.sin(a))); }
  for (let q = 48; q >= 0; q--) { const a = a0 + ((a1 - a0) * q) / 48, rr = 0.012 + 0.02 * hash(q * 7); stand.push(cE((B.trackE + 0.004 + rr) * Math.cos(a), -(B.trackN + 0.004 + rr) * Math.sin(a))); }
  hardFill(p, 430010, LOOK_COL.crowd, stand);
  const bfl = makeBatch(), nFl = Math.min(900, Math.round(0.04 * B.standE * px * B.standN * px));
  for (let q = 0; q < nFl; q++) {
    const a = a0 + (a1 - a0) * hash(q * 3 + 1), rr = hash(q * 5 + 2), e = (B.trackE + 0.012 + (B.standE - B.trackE - 0.014) * rr) * Math.cos(a), n = -(B.trackN + 0.012 + (B.standN - B.trackN - 0.014) * rr) * Math.sin(a);
    const c = cE(e, n), s = 1.6 + hash(q) * 1.2;
    bfl.add(p, 431000 + q, LOOK_COL.flecks[q % LOOK_COL.flecks.length], ell(c[0], c[1], s, s, 5));
  }
  bfl.flush();
  for (let q = 0; q < 48; q++) { const a = (q / 48) * Math.PI * 2; const c0 = cE(B.trackE * Math.cos(a), B.trackN * Math.sin(a)), c1 = cE(B.outerE * Math.cos(a), B.outerN * Math.sin(a)); hardFill(p.layer(0.55, 432000 + q), 432000 + q, LOOK_COL.concreteSh, ribbon([c0, c1], 2)); }
  hardFill(p, 433000, LOOK_COL.track, oval(B.trackE, B.trackN));
  hardFill(p, 433001, LOOK_COL.turf, oval(B.trackE - 0.009, B.trackN - 0.009));
  for (let q = 0; q < 10; q++) { const e0 = -B.fieldE + (2 * B.fieldE * q) / 10; if (q % 2) hardFill(p, 433010 + q, LOOK_COL.turf2, [cE(e0, -B.fieldN), cE(e0 + (2 * B.fieldE) / 10, -B.fieldN), cE(e0 + (2 * B.fieldE) / 10, B.fieldN), cE(e0, B.fieldN)]); }
  const lw = 0.0007 * px;
  const fieldLine = (pts: Pt[]) => hardFill(p, 433100 + pts.length, LOOK_COL.line, ribbon(pts, Math.max(1.5, lw)));
  fieldLine([cE(-B.fieldE, -B.fieldN), cE(B.fieldE, -B.fieldN), cE(B.fieldE, B.fieldN), cE(-B.fieldE, B.fieldN), cE(-B.fieldE, -B.fieldN)]);
  fieldLine([cE(0, -B.fieldN), cE(0, B.fieldN)]);
  fieldLine(Array.from({length: 25}, (_, q) => cE(0.00915 * Math.cos((q / 24) * Math.PI * 2), 0.00915 * Math.sin((q / 24) * Math.PI * 2))));
  if (!o.noStreams) armStreams(p, cam, {amt: o.streams ?? 1, rot, pitch, av, i0, i1, reach: half * 1.1, t: o.t ?? 0});
  // solid crowd: shirt flecks along every street of the grid (the street ribbons are the crowd colour; blocks stay as they are)
  if (solid > 0 && !coarse) {
    let fk = 0;
    const sfb = makeBatch();
    for (let i = i0; i <= i1; i++) for (const horiz of [false, true]) {
      const wKm = i % av === 0 ? 0.032 : 0.014, step = 11 / px;
      for (let u = -half; u < half; u += step) {
        const hs = hash(i * 977 + Math.round(u * 5000) + (horiz ? 17 : 0));
        if (hs > 0.55 * solid) continue;
        const v = i * pitch + (hash(fk * 7 + 3) - 0.5) * wKm * 0.85, c = horiz ? local(cam, u, v, rot) : local(cam, v, u, rot);
        if (c[0] < -6 || c[0] > W + 6 || c[1] < -6 || c[1] > H + 6) { fk++; continue; }
        const s2 = 1.5 + hash(fk * 3) * 1.4;
        sfb.add(p, 470000 + (fk++ % 60000), hash(fk * 11) < 0.25 ? LOOK_COL.crowdDeep : LOOK_COL.flecks[fk % LOOK_COL.flecks.length], ell(c[0], c[1], s2, s2, 5));
      }
    }
    sfb.flush();
  }
  // haze option: a thin warm veil over everything
  if (o.light === 'haze') hardFill(p.layer(0.14, 450000), 450000, '#e9dfc8', FULL);
};

// ---- L0/L1 globe (LF07) -----------------------------------------------------------------------------------------------------
export type GlobeOpts = {sun?: Pt; shade?: number; clouds?: number; glow?: number; dot?: boolean; t?: number; alphaH?: number};
const DESERTS: {lat: number; lon: number; r: number; col: 'arid' | 'tibet'}[] = [
  {lat: 42.5, lon: 104, r: 7, col: 'arid'}, {lat: 39, lon: 83, r: 5, col: 'arid'}, {lat: 32.5, lon: 87, r: 6.5, col: 'tibet'}, {lat: 26.5, lon: 71.5, r: 3.6, col: 'arid'},
  {lat: 23, lon: 47, r: 7, col: 'arid'}, {lat: -25, lon: 132, r: 9.5, col: 'arid'}, {lat: -28, lon: 122, r: 5, col: 'arid'}, {lat: 30, lon: 60, r: 5, col: 'arid'},
];
const geoCircle = (cam: GCam, lat: number, lon: number, rDeg: number, n = 28, sx = 1, sy = 1): Pt[] => Array.from({length: n}, (_, q) => {
  const a = (q / n) * Math.PI * 2, g = gProject(cam, lat + rDeg * sy * Math.sin(a), lon + (rDeg * sx * Math.cos(a)) / Math.cos((lat * Math.PI) / 180));
  return [g.x, g.y];
});

export const paintGlobeLook = (p: Painter, cam: GCam, o: GlobeOpts = {}) => {
  const pp = cam.pp ?? [540, 960], r = rho(horizonAngle(cam.h), cam.h, cam.f ?? 1000), t = o.t ?? 0;
  // space: navy, brighter toward the Earth (UT03), stars; only when the disc leaves some of the frame bare (a cross-fade from the map must not tint through navy)
  const far = Math.max(...([[0, 0], [W, 0], [0, H], [W, H]] as Pt[]).map(([x, y]) => Math.hypot(x - pp[0], y - pp[1]))), bare = r < far + 40;
  if (bare) hardFill(p, 500000, LOOK_COL.space0, FULL);
  if (bare) for (let k = 0; k < 9; k++) hardFill(p.layer(0.13, 500010 + k), 500010 + k, LOOK_COL.space1, ell(pp[0], pp[1], r + 760 - k * 82, r + 760 - k * 82, 72));
  if (bare) for (let s = 0; s < 260; s++) {
    const x = hash(s * 3 + 1) * W, y = hash(s * 7 + 2) * H;
    if (Math.hypot(x - pp[0], y - pp[1]) < r + 30) continue;
    const big = hash(s * 11) > 0.86, tw = 0.65 + 0.35 * Math.sin(t * (1.3 + hash(s) * 2) + s);
    hardFill(p.layer(big ? tw : 0.55 + 0.3 * tw, 501000 + s), 501000 + s, LOOK_COL.star, ell(x, y, big ? 1.6 : 0.9, big ? 1.6 : 0.9, 6));
  }
  // atmosphere glow outside the limb
  const glow = o.glow ?? 1;
  if (bare) [[30, 0.1], [18, 0.16], [9, 0.26], [3.5, 0.45]].forEach(([dr, a], q) => hardFill(p.layer(a * glow, 502000 + q), 502000 + q, LOOK_COL.limb, ell(pp[0], pp[1], r + dr, r + dr, 120)));
  // ocean and land
  hardFill(p, 503000, LOOK_COL.ocean, ell(pp[0], pp[1], r, r, 120));
  hardFill(p.layer(0.5, 503001), 503001, LOOK_COL.ocean2, ell(pp[0] - r * 0.18, pp[1] - r * 0.25, r * 0.62, r * 0.62, 80));
  const A = lodAlpha(o.alphaH ?? cam.h);
  let k = 0;
  for (const ring of MAP_L0.rings) {
    const {pts, hidden} = gProjectPath(cam, ring.xy, {close: true, maxDeg: 2});
    if (hidden === pts.length || pts.length < 3 || !touches(pts)) continue;
    hardFill(p, 504000 + k++, LOOK_COL.land, pts);
  }
  if (A.l1 > 0.004) for (const xy of MAP_L1.land) { const {pts, hidden} = gProjectPath(cam, xy, {close: true}); if (hidden < pts.length && pts.length > 2 && touches(pts)) hardFill(p.layer(A.l1, 505000 + k), 505000 + k++, LOOK_COL.land, pts); }
  // greener tropics band and the deserts (soft blobs well inside the coasts)
  hardFill(p.layer(0.35, 506000), 506000, LOOK_COL.land2, geoCircle(cam, 22, 100, 9, 36, 1.6, 1));
  DESERTS.forEach((d, q) => { const c = geoCircle(cam, d.lat, d.lon, d.r, 30); const v = gProject(cam, d.lat, d.lon); if (v.visible) { hardFill(p.layer(0.22, 506100 + q), 506100 + q, LOOK_COL[d.col], c); hardFill(p.layer(0.25, 506200 + q), 506200 + q, LOOK_COL[d.col], geoCircle(cam, d.lat + d.r * 0.15, d.lon - d.r * 0.2, d.r * 0.65, 24, 1.3, 0.8)); hardFill(p.layer(0.25, 506300 + q), 506300 + q, LOOK_COL[d.col], geoCircle(cam, d.lat - d.r * 0.1, d.lon + d.r * 0.25, d.r * 0.4, 20, 1.4, 0.7)); } });
  // clouds: wisps fixed on the sphere (they ride the globe), an ITCZ chain near the equator
  const nc = Math.round(46 * (o.clouds ?? 1));
  for (let q = 0; q < nc; q++) {
    const lat = q < 22 ? 4 + (hash(q * 5) - 0.5) * 12 : (hash(q * 3) - 0.5) * 120, lon = 40 + hash(q * 7) * 130;
    const v = gProject(cam, lat, lon);
    if (!v.visible) continue;
    const rr = 1.2 + hash(q * 11) * 3.2;
    hardFill(p.layer(0.28 + 0.25 * hash(q), 507000 + q), 507000 + q, LOOK_COL.cloud, geoCircle(cam, lat, lon, rr, 18, 2.6, 0.38));
    hardFill(p.layer(0.35, 507500 + q), 507500 + q, LOOK_COL.cloud, geoCircle(cam, lat + rr * 0.15, lon + rr * 0.9, rr * 0.5, 14, 2.2, 0.4));
  }
  // limb haze inside the edge, then the shading crescents away from the sun (no terminator: the dot side stays lit)
  hardFill(p.layer(0.35, 508000), 508000, LOOK_COL.limbIn, annulus(pp[0], pp[1], r - 16, r, 120));
  hardFill(p.layer(0.25, 508001), 508001, LOOK_COL.limbIn, annulus(pp[0], pp[1], r - 6, r, 120));
  const sun = o.sun ?? [-0.5, -0.866], shade = o.shade ?? 1;
  const lx = pp[0] + sun[0] * r * 0.35, ly = pp[1] + sun[1] * r * 0.35;
  for (let q = 0; q < 10; q++) { const poly = discMinus(pp[0], pp[1], r - 0.5, lx, ly, r * (1.3 - 0.075 * q)); if (poly.length > 2) hardFill(p.layer(0.1 * shade, 509000 + q), 509000 + q, LOOK_COL.night, poly); }
  void sphereWeight;
};

/** The dot (K01's blue) with a white rim and a slow pulse ring (2.5 s period, ambient clock). */
export const paintDot = (p: Painter, x: number, y: number, t: number, d = 18) => {
  const u = (t % 2.5) / 2.5, rr = d / 2 + 4 + u * 22;
  hardFill(p.layer(0.7 * (1 - u), 510000), 510000, '#bfe0ff', annulus(x, y, rr - 2, rr, 48));
  hardFill(p.layer(0.5, 510001), 510001, '#0b1430', ell(x + 1.5, y + 1.5, d / 2 + 3, d / 2 + 3, 24));
  hardFill(p, 510002, '#ffffff', ell(x, y, d / 2 + 2.5, d / 2 + 2.5, 24));
  hardFill(p, 510003, LOOK_COL.dot, ell(x, y, d / 2, d / 2, 24));
  hardFill(p.layer(0.7, 510004), 510004, '#9cc8ff', ell(x - d * 0.15, y - d * 0.17, d * 0.18, d * 0.15, 10));
};

export const globeRadius = (cam: GCam) => rho(horizonAngle(cam.h), cam.h, cam.f ?? 1000);

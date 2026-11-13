// EDU-EP17 fix pass B (B-MR1, B-MR2): the built-up tone of Bangkok and Nonthaburi in the L2 map look. OSM land use (residential, commercial, industrial, retail; `map-landuse.json`,
// baked by scripts/edu17/bake-landuse.py) as a warm grey fill with a roof-fleck grain, so the mid-rise frames (h 2-60 km) read as a city and not as fields or a tiled block grid.
// The grain is a world-anchored lattice (two neighbouring octaves cross-fade as the camera rises) over a 55 m raster of the same land use, so flecks never swim.
import {hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {gProject, gUnproject, pxPerKm, smooth, type GCam} from './geo';
import {makeBatch} from './batch';
import {MAP_L2, MAP_LANDUSE, province} from './map';

const W = 1080, H = 1920;
export const BUILT_COL = {tone: '#a39a8c', flecks: ['#b9b3a6', '#c9c3b5', '#8f8a80', '#b5694a', '#9c5a40', '#d8d2c2', '#7f8f86', '#6f8fa8']};

const logSmooth = (h: number, a: number, b: number) => smooth((Math.log(h) - Math.log(a)) / (Math.log(b) - Math.log(a)));
/** Weight of the built-up tone at altitude h: in over h 2-3.2 km with the hand-over from L3 (B-MR2), 1 over h 3.2-30 (Film said 20; slower so +51 at h 44 still reads as a city), log fade to 0 by h 60 (B-MR1: h >= 72 frames do not change). */
export const builtUpAlpha = (h: number) => logSmooth(h, 2, 3.2) * (1 - logSmooth(h, 30, 60));

// ---- fallback (B-MR1): OSM land use is patchy in Bangkok (565 km2 of 2,203), so the inner districts (khet whose centroid lies within 15 km of MC) and Mueang Nonthaburi are
// built-up too: drawn at half weight under the land use, and part of the grain mask. ---------------------------------------------------------
const MC = {lat: 13.815, lon: 100.6};
let inner: number[][] | null = null;
const innerRings = (): number[][] => inner ?? (inner = MAP_L2.districts.filter((d) => (d.province === 'bangkok' && Math.hypot((d.centroid[1] - MC.lat) * 111.195, (d.centroid[0] - MC.lon) * 108) <= 15) || (d.province === 'nonthaburi' && d.nameEn === 'Mueang Nonthaburi')).map((d) => d.ring));

const inRingFlat = (x: number, y: number, flat: number[]) => {
  let c = false;
  const n = flat.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = flat[2 * i + 1], yj = flat[2 * j + 1];
    if ((yi > y) !== (yj > y) && x < ((flat[2 * j] - flat[2 * i]) * (y - yi)) / (yj - yi) + flat[2 * i]) c = !c;
  }
  return c;
};
// ---- rings and the 55 m raster -------------------------------------------------------------------------------------------------
type Ring = {xy: number[]; x0: number; x1: number; y0: number; y1: number; bk?: boolean};
let rings: Ring[] | null = null;
const mk = (xy: number[]): Ring => {
  const bk = province('bangkok').ring;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < xy.length; i += 2) { x0 = Math.min(x0, xy[i]); x1 = Math.max(x1, xy[i]); y0 = Math.min(y0, xy[i + 1]); y1 = Math.max(y1, xy[i + 1]); }
  return {xy, x0, x1, y0, y1, bk: inRingFlat((x0 + x1) / 2, (y0 + y1) / 2, bk)};
};
const ringList = (): Ring[] => rings ?? (rings = MAP_LANDUSE.rings.map(mk));
let innerR: Ring[] | null = null;
const innerList = (): Ring[] => innerR ?? (innerR = innerRings().map(mk));
const LON0 = 100.2, LAT0 = 13.45, STEP = 0.0005, NX = 1600, NY = 1500;
let mask: Uint8Array | null = null;
/** Even-odd scanline raster of the land use (cell centres); lookups outside the extract return 0. */
const builtMask = (): Uint8Array => {
  if (mask) return mask;
  const m = new Uint8Array(NX * NY);
  for (const r of [...ringList(), ...innerList()]) {
    const j0 = Math.max(0, Math.floor((r.y0 - LAT0) / STEP)), j1 = Math.min(NY - 1, Math.ceil((r.y1 - LAT0) / STEP)), n = r.xy.length / 2;
    for (let j = j0; j <= j1; j++) {
      const y = LAT0 + (j + 0.5) * STEP, xs: number[] = [];
      for (let a = 0, b = n - 1; a < n; b = a++) {
        const ya = r.xy[2 * a + 1], yb = r.xy[2 * b + 1];
        if ((ya > y) !== (yb > y)) xs.push(r.xy[2 * a] + ((y - ya) / (yb - ya)) * (r.xy[2 * b] - r.xy[2 * a]));
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const i0 = Math.max(0, Math.ceil((xs[k] - LON0) / STEP - 0.5)), i1 = Math.min(NX - 1, Math.floor((xs[k + 1] - LON0) / STEP - 0.5));
        for (let i = i0; i <= i1; i++) m[j * NX + i] = 1;
      }
    }
  }
  // bit 2: inside Bangkok's province ring (so a full Bangkok skips its tone and grain: the crowd fill covers them)
  const bk = province('bangkok').ring, n = bk.length / 2;
  for (let j = 0; j < NY; j++) {
    const y = LAT0 + (j + 0.5) * STEP, xs: number[] = [];
    for (let a = 0, b = n - 1; a < n; b = a++) {
      const ya = bk[2 * a + 1], yb = bk[2 * b + 1];
      if ((ya > y) !== (yb > y)) xs.push(bk[2 * a] + ((y - ya) / (yb - ya)) * (bk[2 * b] - bk[2 * a]));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const i0 = Math.max(0, Math.ceil((xs[k] - LON0) / STEP - 0.5)), i1 = Math.min(NX - 1, Math.floor((xs[k + 1] - LON0) / STEP - 0.5));
      for (let i = i0; i <= i1; i++) m[j * NX + i] |= 2;
    }
  }
  return (mask = m);
};
/** Built-up cell (bit 1), optionally not counting Bangkok's cells (bit 2). */
export const isBuilt = (lat: number, lon: number, skipBangkok = false) => {
  const i = Math.floor((lon - LON0) / STEP), j = Math.floor((lat - LAT0) / STEP);
  if (i < 0 || i >= NX || j < 0 || j >= NY) return false;
  const v = builtMask()[j * NX + i];
  return skipBangkok && (v & 2) !== 0 ? false : (v & 1) === 1;
};
/** Built-up share of the baked area over the stage (test and notes). */
export const builtShare = () => { const m = builtMask(); let n = 0; for (let i = 0; i < m.length; i++) n += m[i] & 1; return (n * STEP * STEP * 111.195 * 108) ; };

/** Geographic window of the frame (+ margin px): bbox of the four unprojected corners. */
const frameWindow = (cam: GCam, margin = 80) => {
  const c = [[-margin, -margin], [W + margin, -margin], [W + margin, H + margin], [-margin, H + margin]].map(([x, y]) => gUnproject(cam, x, y));
  if (c.some((q) => !q)) return null;
  const la = c.map((q) => q![0]), lo = c.map((q) => q![1]);
  return {la0: Math.min(...la), la1: Math.max(...la), lo0: Math.min(...lo), lo1: Math.max(...lo)};
};

/** The tone fill and the roof-fleck grain at weight `a` (0..1) over the stage's land use. */
export const paintBuiltUp = (p: Painter, cam: GCam, a: number, bangkokFull = false) => {
  if (a < 0.004) return;
  const win = frameWindow(cam);
  if (!win) return;
  const px = pxPerKm(cam), q = a < 1 ? p.layer(a, 66000) : p, kx = 108.0, ky = 111.195;
  let k = 0;
  for (const r of innerList()) {
    if (bangkokFull && r.bk) continue;
    if (r.x1 < win.lo0 || r.x0 > win.lo1 || r.y1 < win.la0 || r.y0 > win.la1) continue;
    const pts: Pt[] = [];
    for (let i = 0; i < r.xy.length; i += 2) { const g = gProject(cam, r.xy[i + 1], r.xy[i]); pts.push([g.x, g.y]); }
    hardFill(q.layer(0.55, 66050), 66050 + (k++ % 50), BUILT_COL.tone, pts);
  }
  // tone: the land-use rings in the window; a ring whose box is under 2.5 px on both sides is skipped (the grain carries that scale)
  for (const r of ringList()) {
    if (bangkokFull && r.bk) continue;
    if (r.x1 < win.lo0 || r.x0 > win.lo1 || r.y1 < win.la0 || r.y0 > win.la1) continue;
    if ((r.x1 - r.x0) * kx * px < 2.5 && (r.y1 - r.y0) * ky * px < 2.5) continue;
    const pts: Pt[] = [];
    for (let i = 0; i < r.xy.length; i += 2) { const g = gProject(cam, r.xy[i + 1], r.xy[i]); pts.push([g.x, g.y]); }
    hardFill(q, 66100 + (k++ % 5000), BUILT_COL.tone, pts);
  }
  // grain: lattice octaves (20 m x 2^j), two neighbours weighted by how close the screen spacing is to 16 px; fleck 2.6-4 px (ranked so about 5 000 are on screen); coverage under 3 %
  const target = 21 / px, o = Math.log2(target / 0.02), j0 = Math.floor(o), fr = o - j0, b = makeBatch();
  for (const [j, wgt] of [[j0, 1 - fr], [j0 + 1, fr]] as const) {
    if (wgt < 0.04) continue;
    const s = 0.02 * 2 ** j, qa = q.layer(wgt * 0.9, 66500 + j), dla = s / ky, dlo = s / kx;
    const i0 = Math.floor(win.lo0 / dlo), i1 = Math.ceil(win.lo1 / dlo), l0 = Math.floor(win.la0 / dla), l1 = Math.ceil(win.la1 / dla);
    for (let jy = l0; jy <= l1; jy++) for (let ix = i0; ix <= i1; ix++) {
      const hs = hash(ix * 7919 + jy * 104729 + j * 131);
      const la = (jy + 0.2 + 0.6 * hash(ix * 31 + jy * 17 + j)) * dla, lo = (ix + 0.2 + 0.6 * hash(ix * 13 + jy * 71 + j)) * dlo;
      if (hs > 0.65 || !isBuilt(la, lo, bangkokFull)) continue;
      const g = gProject(cam, la, lo);
      if (g.x < -6 || g.x > W + 6 || g.y < -6 || g.y > H + 6) continue;
      const sz = 1.3 + 0.7 * hash(ix + jy * 3 + j), col = BUILT_COL.flecks[Math.floor(hash(ix * 5 + jy * 11 + j) * BUILT_COL.flecks.length)];
      b.add(qa, 67000 + ((ix * 3 + jy) & 16383), col, [[g.x - sz, g.y - sz * 0.8], [g.x + sz, g.y - sz], [g.x + sz * 0.9, g.y + sz], [g.x - sz, g.y + sz * 0.9]]);
    }
  }
  b.flush();
};

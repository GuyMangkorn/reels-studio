// EDU-EP17 crowd fill clock (SP3 part of N4): phi in 0..1 = filled area / 2,050 km^2 (8.2 billion people at 4 per m^2) placed over the baked rings, in the
// brief's VD05 order: Bangkok's khet from the old centre outward (a khet is full when the running area passes its share), then Nonthaburi from the Bangkok border
// outward (distance to the Bangkok ring), over the river too (O5). This file holds the data side (areas, order, shares, keys); the painted layer (flecks, speck front,
// streams along the roads) is N4 proper and comes with the map plate. Pure functions of phi; no state.
import {districtsOf, MAP_L2, province, type Flat} from './map';
import {smooth} from './geo';

export const FILL_TOTAL_KM2 = 2050;
/** Old centre of Bangkok (Phra Nakhon): the inner-districts-first order starts here. */
export const FILL_CORE = {lat: 13.752, lon: 100.502};
const KX = Math.cos((13.85 * Math.PI) / 180) * 111.195, KY = 111.195; // km per degree at the metro latitude

type Pt = [number, number];
export const inRing = (x: number, y: number, r: number[]) => {
  let c = false;
  for (let i = 0, n = r.length / 2, j = n - 1; i < n; j = i++) {
    const xi = r[2 * i], yi = r[2 * i + 1], xj = r[2 * j], yj = r[2 * j + 1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const segDist = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = (bx - ax) * KX, dy = (by - ay) * KY, qx = (px - ax) * KX, qy = (py - ay) * KY, L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, (qx * dx + qy * dy) / L)) : 0;
  return Math.hypot(qx - t * dx, qy - t * dy);
};
/** Distance (km) from a point to a ring's boundary. */
export const ringDist = (x: number, y: number, r: number[]) => {
  let d = Infinity;
  for (let i = 0, n = r.length / 2; i < n; i++) { const j = (i + 1) % n; d = Math.min(d, segDist(x, y, r[2 * i], r[2 * i + 1], r[2 * j], r[2 * j + 1])); }
  return d;
};

export type FillModel = {
  bangkokKm2: number; nonthaburiKm2: number;
  /** khet ids in fill order with their cumulative area share of the khet union (0..1] */
  khet: {id: number; nameEn: string; areaKm2: number; cumKm2: number}[];
  /** Nonthaburi grid cells (cell area km^2 each) inside the ring with their distance to the Bangkok ring `m` (km), their distance to the Chao Phraya or a motorway/trunk `finger` (km)
   * and the fill order key `key = fillKey(m, finger)`; sorted by key (the fingers along the river and highways lead). The front at area A is the cell A / cellKm2. */
  cells: {x: number; y: number; m: number; border: number; finger: number; key: number}[]; cellKm2: number; cellDeg: number;
  /** phi at which Bangkok is full */
  phiBangkok: number;
};

/** Fill order key (km) of a Nonthaburi cell: its distance to the Bangkok ring, minus a lead of up to 4 km for cells within 0.45 km of the Chao Phraya or a motorway/trunk
 * (the crowd crosses along the river and roads first, brief VD06 / shot 6). The cells are sorted by this key so the painted fingers are counted in phi. */
export const fillKey = (m: number, finger: number) => (finger < 0.45 ? m - Math.min(4, 0.58 * m + 0.2) : m);

/** Distance (km) from a point to the nearest Chao Phraya / road segment in the Nonthaburi window (flat arrays of segments). */
const fingerSegs = (): number[] => {
  const segs: number[] = [];
  const add = (xy: Flat) => { for (let i = 0; i + 3 < xy.length; i += 2) if (xy[i + 1] > 13.78 && xy[i + 1] < 14.16 && xy[i] > 100.24 && xy[i] < 100.6) segs.push(xy[i], xy[i + 1], xy[i + 2], xy[i + 3]); };
  for (const r of MAP_L2.rivers) if (r.name === 'Chao Phraya River') add(r.xy);
  for (const r of MAP_L2.roads) add(r.xy);
  return segs;
};
const fingerOf = (segs: number[], x: number, y: number) => {
  let best = Infinity;
  for (let s = 0; s < segs.length; s += 4) {
    const ax = (segs[s] - x) * 108, ay = (segs[s + 1] - y) * 111, bx = (segs[s + 2] - x) * 108, by = (segs[s + 3] - y) * 111;
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L)) : 0;
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
  }
  return best;
};

let model: FillModel | null = null;
/** Builds the model from the baked rings (0.4 km grid for Nonthaburi; about 4,000 cells). Cached. */
export const fillModel = (): FillModel => {
  if (model) return model;
  const bk = districtsOf('bangkok'), core: Pt = [FILL_CORE.lon, FILL_CORE.lat];
  const sorted = [...bk].sort((a, b) => Math.hypot((a.centroid[0] - core[0]) * KX, (a.centroid[1] - core[1]) * KY) - Math.hypot((b.centroid[0] - core[0]) * KX, (b.centroid[1] - core[1]) * KY));
  let cum = 0;
  const khet = sorted.map((d) => ({id: d.id, nameEn: d.nameEn, areaKm2: d.areaKm2, cumKm2: (cum += d.areaKm2)}));
  const non = province('nonthaburi'), bangkok = province('bangkok');
  const bb = non.bbox, step = 0.4, dLon = step / KX, dLat = step / KY, cells: FillModel['cells'] = [], segs = fingerSegs();
  for (let lat = bb.lat[0] + dLat / 2; lat < bb.lat[1]; lat += dLat) for (let lon = bb.lon[0] + dLon / 2; lon < bb.lon[1]; lon += dLon) {
    if (!inRing(lon, lat, non.ring)) continue;
    const m = ringDist(lon, lat, bangkok.ring), finger = fingerOf(segs, lon, lat);
    cells.push({x: lon, y: lat, m, border: ringDist(lon, lat, non.ring), finger, key: fillKey(m, finger)});
  }
  cells.sort((a, b) => a.key - b.key);
  const cellKm2 = non.areaKm2 / cells.length; // the grid's own area, scaled to the ring's computed area (removes grid bias)
  model = {bangkokKm2: cum, nonthaburiKm2: non.areaKm2, khet, cells, cellKm2, cellDeg: step, phiBangkok: cum / FILL_TOTAL_KM2};
  return model;
};

/** Filled share of Bangkok (0..1 of the khet union) and of Nonthaburi's ring (0..1) at phi. */
export const fillShare = (phi: number) => {
  const m = fillModel(), A = Math.max(0, Math.min(1, phi)) * FILL_TOTAL_KM2;
  return {bangkok: Math.min(1, A / m.bangkokKm2), nonthaburi: Math.max(0, Math.min(1, (A - m.bangkokKm2) / m.nonthaburiKm2))};
};
/** Per-khet fill fraction at phi (in `khet` order): full khet first, one partial, the rest empty. */
export const khetFill = (phi: number): number[] => {
  const m = fillModel(), A = phi * FILL_TOTAL_KM2;
  return m.khet.map((k) => Math.max(0, Math.min(1, (A - (k.cumKm2 - k.areaKm2)) / k.areaKm2)));
};
/** Number of Nonthaburi cells filled at phi (the first `nonCount(phi)` cells of `fillModel().cells`, in fill order). */
export const nonCount = (phi: number) => {
  const m = fillModel(), a = phi * FILL_TOTAL_KM2 - m.bangkokKm2;
  return a <= 0 ? 0 : Math.min(m.cells.length, Math.floor(a / m.cellKm2));
};
/** Front key (km, `fillKey` units) in Nonthaburi at phi: cells with key at or below it are filled. NaN before Nonthaburi starts. */
export const nonFrontKm = (phi: number) => {
  const m = fillModel(), k = nonCount(phi);
  return k <= 0 ? NaN : m.cells[Math.min(m.cells.length - 1, k)].key;
};
/** Cell lookup on the 0.4 km grid: index of the cell nearest (lon, lat) when it is within one grid step, else -1. */
let cellGrid: Map<number, number> | null = null;
export const cellNear = (lon: number, lat: number): number => {
  const m = fillModel();
  if (!cellGrid) { cellGrid = new Map(); m.cells.forEach((c, n) => cellGrid!.set(Math.round(c.x * 1000) * 100000 + Math.round(c.y * 1000), n)); }
  const step = m.cellDeg; let best = -1, bd = Infinity;
  const gx = Math.round(lon * 1000), gy = Math.round(lat * 1000);
  for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) { const n = cellGrid.get((gx + dx) * 100000 + gy + dy); if (n !== undefined) { const c = m.cells[n], d = Math.hypot((c.x - lon) * KX, (c.y - lat) * KY); if (d < bd) { bd = d; best = n; } } }
  return bd <= step * 0.75 ? best : -1;
};

/** VD05 phi keys per shot (ROWS-R2.1): SH01 end 0.03, SH03 end 0.30, SH06 end 0.80 with Bangkok full at +40, SH07 1.00 at +48 then stop. */
export const FILL_KEYS = {sh01End: 0.03, sh03End: 0.3, sh06End: 0.8, sh07Full: 1.0, sh06BangkokFullAt: 40, sh07StopAt: 48} as const;
export const phiAt = (shot: 'S01-B01-SH01' | 'S01-B01-SH03' | 'S01-B02-SH01' | 'S01-B02-SH02', f: number): number => {
  const k = FILL_KEYS, pb = fillModel().phiBangkok;
  switch (shot) {
    case 'S01-B01-SH01': return k.sh01End * smooth((f - 10) / 52);
    case 'S01-B01-SH03': return k.sh01End + (k.sh03End - k.sh01End) * smooth(f / 77);
    case 'S01-B02-SH01': return f <= k.sh06BangkokFullAt ? k.sh03End + (pb - k.sh03End) * smooth(f / k.sh06BangkokFullAt) : pb + (k.sh06End - pb) * smooth((f - k.sh06BangkokFullAt) / (84 - k.sh06BangkokFullAt));
    case 'S01-B02-SH02': { const u = Math.min(1, f / k.sh07StopAt); return k.sh06End + (k.sh07Full - k.sh06End) * (1 - (1 - u) * (1 - u)); } // ease-out, then stop
  }
};

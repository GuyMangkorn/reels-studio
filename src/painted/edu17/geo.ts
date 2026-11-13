// EDU-EP17 `G` space (N1): the geographic nadir camera `gcam`. Points are (lat deg N, lon deg E); the camera looks straight down at a nadir point
// (lat, lon) from altitude `h` km over a sphere of radius R 6,371 km, focal `f` 1000 px, principal point `pp` (where the nadir lands on the 1080 x 1920
// picture), map yaw `yaw` deg (0 = north up, + turns the map clockwise). Ground scale at the nadir: px/km = f / h (brief: projection contract).
//
// Two projections of the same nadir ray model, blended by altitude (brief: "flat-plane up to 1,500 km, sphere above, blended"):
//   flat   (h <= H_FLAT 1,500 km): azimuthal equidistant, screen radius rho = f * (R * theta) / h, the EP14 straight-down ycam method;
//   sphere (h >= H_SPHERE 2,400 km): true pinhole, rho = f * R sin(theta) / (R + h - R cos(theta)); points past the horizon are clamped to the limb
//          (rho_limb = f * R / sqrt((R + h)^2 - R^2); 500.7 px at h 7,860 km), so a clipped ring closes along the limb arc and never along a chord.
// theta is the great-circle angle from the nadir. Between H_FLAT and H_SPHERE rho is the smoothstep(log h) blend of the two, so there is no pop.
import type {Pt} from '../kit/painter';

export const R_EARTH = 6371;
export const H_FLAT = 1500;
export const H_SPHERE = 2400;
const D2R = Math.PI / 180;

export type GCam = {lat: number; lon: number; h: number; f?: number; pp?: Pt; yaw?: number};
export type GPoint = {x: number; y: number; /** false: beyond the horizon (position clamped to the limb) */ visible: boolean};

export const smooth = (u: number) => { const k = Math.min(1, Math.max(0, u)); return k * k * (3 - 2 * k); };
/** Weight of the sphere projection at altitude h (0 flat ... 1 sphere), smoothstep in log h. */
export const sphereWeight = (h: number) => smooth((Math.log(h) - Math.log(H_FLAT)) / (Math.log(H_SPHERE) - Math.log(H_FLAT)));

/** Ground scale at the nadir, px per km. */
export const pxPerKm = (c: GCam) => (c.f ?? 1000) / c.h;
/** Screen radius (px) of the globe's limb at altitude h (the sphere model). */
export const limbRadius = (h: number, f = 1000) => (f * R_EARTH) / Math.sqrt((R_EARTH + h) ** 2 - R_EARTH ** 2);
/** Great-circle angle from the nadir at which a point leaves sight (rad). */
export const horizonAngle = (h: number) => Math.acos(R_EARTH / (R_EARTH + h));

/** Great-circle angle (rad) and bearing (rad, 0 = north, + toward east) from (lat0, lon0) to (lat, lon). */
export const angleBearing = (lat0: number, lon0: number, lat: number, lon: number) => {
  const p0 = lat0 * D2R, p = lat * D2R, dl = (lon - lon0) * D2R;
  const cosT = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(dl);
  const y = Math.sin(dl) * Math.cos(p), x = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(dl);
  return {theta: Math.acos(Math.max(-1, Math.min(1, cosT))), bearing: Math.atan2(y, x)};
};

/** Destination (lat, lon deg) from (lat0, lon0) at great-circle angle theta and bearing. */
export const destination = (lat0: number, lon0: number, theta: number, bearing: number): [number, number] => {
  const p0 = lat0 * D2R;
  const sp = Math.sin(p0) * Math.cos(theta) + Math.cos(p0) * Math.sin(theta) * Math.cos(bearing);
  const p = Math.asin(Math.max(-1, Math.min(1, sp)));
  const dl = Math.atan2(Math.sin(bearing) * Math.sin(theta) * Math.cos(p0), Math.cos(theta) - Math.sin(p0) * sp);
  return [p / D2R, lon0 + dl / D2R];
};

const rhoFlat = (theta: number, h: number, f: number) => (f * R_EARTH * theta) / h;
const rhoSphere = (theta: number, h: number, f: number) => {
  if (theta >= horizonAngle(h)) return limbRadius(h, f);
  return (f * R_EARTH * Math.sin(theta)) / (R_EARTH + h - R_EARTH * Math.cos(theta));
};
/** Screen radius (px) at great-circle angle theta for the camera's altitude (blend included). */
export const rho = (theta: number, h: number, f = 1000) => {
  const w = sphereWeight(h);
  if (w <= 0) return rhoFlat(theta, h, f);
  if (w >= 1) return rhoSphere(theta, h, f);
  return (1 - w) * rhoFlat(theta, h, f) + w * rhoSphere(theta, h, f);
};

/** Picture point of a geographic point. `visible` is false only for points past the horizon (clamped to the limb) in the sphere regime. */
export const gProject = (c: GCam, lat: number, lon: number): GPoint => {
  const f = c.f ?? 1000, pp = c.pp ?? [540, 960], psi = (c.yaw ?? 0) * D2R;
  const {theta, bearing} = angleBearing(c.lat, c.lon, lat, lon);
  const r = rho(theta, c.h, f);
  const u = r * Math.sin(bearing), v = r * Math.cos(bearing);
  const x = pp[0] + u * Math.cos(psi) + v * Math.sin(psi), y = pp[1] - (-u * Math.sin(psi) + v * Math.cos(psi));
  return {x, y, visible: theta < horizonAngle(c.h) || sphereWeight(c.h) < 1};
};

/** Inverse of `gProject` (bisection on theta; the blend is monotone). Null beyond the limb. */
export const gUnproject = (c: GCam, x: number, y: number): [number, number] | null => {
  const f = c.f ?? 1000, pp = c.pp ?? [540, 960], psi = (c.yaw ?? 0) * D2R;
  const X = x - pp[0], V = pp[1] - y;
  const u = X * Math.cos(psi) - V * Math.sin(psi), v = X * Math.sin(psi) + V * Math.cos(psi);
  const target = Math.hypot(u, v), bearing = Math.atan2(u, v);
  const hz = horizonAngle(c.h), w = sphereWeight(c.h);
  const hi = w >= 1 ? hz : Math.min(Math.PI, Math.max(hz, 3.1));
  if (target > rho(hi * 0.999999, c.h, f) + 1e-9 && w >= 1) return null;
  let lo = 0, up = hi;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + up) / 2;
    if (rho(mid, c.h, f) < target) lo = mid; else up = mid;
  }
  return destination(c.lat, c.lon, (lo + up) / 2, bearing);
};

/** Project a flat [lon, lat, ...] ring or line. Edges longer than `maxDeg` are subdivided first (a long ring edge is a great circle, not a screen chord). */
export const gProjectPath = (c: GCam, xy: ArrayLike<number>, o: {close?: boolean; maxDeg?: number} = {}): {pts: Pt[]; hidden: number} => {
  const maxDeg = o.maxDeg ?? 1e9, n = xy.length / 2, pts: Pt[] = [];
  let hidden = 0;
  const count = o.close ? n : n - 1;
  const push = (lat: number, lon: number) => {
    const q = gProject(c, lat, lon);
    if (!q.visible) hidden++;
    pts.push([q.x, q.y]);
  };
  for (let i = 0; i < count; i++) {
    const lon0 = xy[2 * i], lat0 = xy[2 * i + 1], j = (i + 1) % n, lon1 = xy[2 * j], lat1 = xy[2 * j + 1];
    const k = Math.max(1, Math.ceil(Math.max(Math.abs(lon1 - lon0), Math.abs(lat1 - lat0)) / maxDeg));
    for (let s = 0; s < k; s++) push(lat0 + ((lat1 - lat0) * s) / k, lon0 + ((lon1 - lon0) * s) / k);
  }
  if (!o.close) push(xy[2 * n - 1], xy[2 * n - 2]);
  return {pts, hidden};
};

// ---- camera moves ---------------------------------------------------------------------------------------------------------
/** Interpolated camera: nadir and pp linear in u, altitude log-linear (constant apparent zoom speed), yaw linear. */
export const gLerp = (a: GCam, b: GCam, u: number): GCam => ({
  lat: a.lat + (b.lat - a.lat) * u, lon: a.lon + (b.lon - a.lon) * u, h: Math.exp(Math.log(a.h) + (Math.log(b.h) - Math.log(a.h)) * u),
  f: a.f ?? 1000, pp: [(a.pp ?? [540, 960])[0] + ((b.pp ?? [540, 960])[0] - (a.pp ?? [540, 960])[0]) * u, (a.pp ?? [540, 960])[1] + ((b.pp ?? [540, 960])[1] - (a.pp ?? [540, 960])[1]) * u],
  yaw: (a.yaw ?? 0) + ((b.yaw ?? 0) - (a.yaw ?? 0)) * u,
});

/** Anchors in G (lat, lon): the brief's estimates; the bake checks them against the data (K02 and M0 inside Bangkok, MC inside Bangkok). */
export const G_ANCHORS = {MC: {lat: 13.815, lon: 100.6}, K02: {lat: 13.755, lon: 100.622}, M0: {lat: 13.737, lon: 100.56}, NON: {lat: 13.95, lon: 100.42}, TH_SOUTH: {lat: 13.75, lon: 100.5}, TH_MID: {lat: 13.75, lon: 100.6}} as const;

type Key = {lat: number; lon: number; h: number; pp: Pt; yaw: number};
const key = (a: {lat: number; lon: number}, h: number, pp: Pt, yaw = 0): Key => ({lat: a.lat, lon: a.lon, h, pp, yaw});
/** One shot's map camera: from -> to between frames [a, b] (shot-local, smoothstep ends, log h), held outside. `len` = shot frames. */
export type GMove = {shot: string; len: number; from: Key; to: Key; a: number; b: number; drift?: {from: number; perSecondH: number}};

/** The G camera lines of ROWS-R2.1 (storyboard "Per-shot staging"): shots 1, 3, 6, 7, 8, 9, 16, 22. */
export const G_SHOTS: GMove[] = [
  {shot: 'S01-B01-SH01', len: 69, from: key(G_ANCHORS.K02, 0.58, [540, 640]), to: key(G_ANCHORS.MC, 80, [540, 660]), a: 10, b: 62},
  {shot: 'S01-B01-SH03', len: 78, from: key(G_ANCHORS.MC, 85, [540, 660], 2), to: key(G_ANCHORS.MC, 80, [540, 660], 0), a: 0, b: 77},
  {shot: 'S01-B02-SH01', len: 85, from: key(G_ANCHORS.MC, 80, [540, 660], 0), to: key(G_ANCHORS.MC, 72, [540, 660], 3), a: 0, b: 84},
  {shot: 'S01-B02-SH02', len: 80, from: key(G_ANCHORS.MC, 80, [540, 660], 3), to: key(G_ANCHORS.NON, 45, [540, 660], 3), a: 0, b: 40},
  {shot: 'S01-B02-SH03', len: 82, from: key(G_ANCHORS.NON, 45, [540, 660], 3), to: key(G_ANCHORS.TH_SOUTH, 1100, [540, 820], 0), a: 6, b: 60},
  {shot: 'S01-B03-SH01', len: 55, from: key(G_ANCHORS.TH_SOUTH, 1100, [540, 820], 0), to: key(G_ANCHORS.M0, 6, [540, 700], 0), a: 10, b: 50},
  {shot: 'S01-B04-SH01', len: 48, from: key(G_ANCHORS.MC, 80, [540, 660], 0), to: key(G_ANCHORS.K02, 0.58, [540, 640], 0), a: 4, b: 42},
  {shot: 'S01-B05-SH01', len: 219, from: key(G_ANCHORS.MC, 80, [540, 660], 0), to: key(G_ANCHORS.TH_MID, 7860, [540, 960], 0), a: 6, b: 90, drift: {from: 90, perSecondH: 1.005}},
];

/** The shot's camera at shot-local frame `f` (fps 30). Shot 22 keeps drifting after the rise (h x 1.005 per second). */
export const gShotCam = (shot: string, f: number): GCam => {
  const m = G_SHOTS.find((s) => s.shot === shot);
  if (!m) throw new Error(`no G camera for ${shot}`);
  const u = smooth((f - m.a) / (m.b - m.a));
  const c = gLerp({...m.from, f: 1000}, {...m.to, f: 1000}, u);
  if (m.drift && f > m.drift.from) c.h *= Math.pow(m.drift.perSecondH, (f - m.drift.from) / 30);
  return c;
};

// ---- level of detail ------------------------------------------------------------------------------------------------------
/** Layer windows in km of altitude (alpha 0 -> 1 or 1 -> 0 over the pair, log blend). L3 -> L2: storyboard shot 1 (h 2-5 km, fix pass B). */
export const LOD = {l3: [2, 5] as const, l2: [100, 1000] as const, l1: [H_FLAT, 2000] as const, l0: [1000, H_FLAT] as const};
const logRamp = (h: number, [a, b]: readonly [number, number]) => smooth((Math.log(h) - Math.log(a)) / (Math.log(b) - Math.log(a)));
/**
 * Alpha of each map layer at altitude h. L0 (globe land) is the opaque base from H_FLAT up (it fades in over h 1,000-1,500 under the opaque L1, so its coarser coast shows gradually and never as a step) and L1 (region land, borders, rivers) lies over it and fades
 * out over h 1,500-2,000 (its window's closure edges first reach the frame at h 2,085, shot 22's pp and yaw 3),  so land never thins during a cross-fade; L2 (metro lines, districts, roads, fine coast) fades out over one decade above 100 km; L3 (the K02
 * neighbourhood plate) fades out over h 2-5 km while L2 is fully in.
 */
export const lodAlpha = (h: number) => ({l3: (1 - logRamp(h, LOD.l3)) ** 1.7, l2: 1 - logRamp(h, LOD.l2), l1: 1 - logRamp(h, LOD.l1), l0: logRamp(h, LOD.l0)});

/** Altitude (km) of a camera pair at which a layer alpha crosses `0.5` is not needed; seam altitudes for the SP1 pairs: */
export const LOD_SEAMS = [LOD.l3[0], LOD.l3[1], LOD.l2[0], LOD.l2[1], LOD.l1[0], LOD.l1[1]] as const;

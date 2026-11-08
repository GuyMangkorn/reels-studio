import {ell, hardFill, inkLine} from './draw';
import {hash} from './hash';
import type {Painter, Pt} from './painter';
import type {V3} from './space';
import type {YCam} from './ycam';

// ENV-EARTH: the Earth seen from a low orbit as a backdrop at infinity (kit atmosphere layer, from EDU-EP08-SHORT N1, Boss pass B; written
// reusable for the sci-fi round C13-C17: altitude `altKm`, sun warmth, glow, cloud count and a picture rect are options). Direction only: projected from the camera's yaw and pitch,
// never from its position, so a yaw arc slides the clouds and the limb correctly and a truck leaves them still.
// Geometry (staging, not a claim): altitude ALT km over a sphere of radius RE km; the limb is the cone of directions ALT_DIP below the
// local horizontal (19.8 deg at 400 km). Ground features (clouds, land) are points on the sphere, so they foreshorten toward the limb.

export const RE = 6371, ALT = 400;
const DEGR = Math.PI / 180;
/** Limb dip below the local horizontal, degrees (acos(RE / (RE + ALT))). */
export const limbDip = (altKm: number) => Math.acos(RE / (RE + altKm)) / DEGR;
export const LIMB_DIP = limbDip(ALT);

export const EARTH_COL = {
  space0: '#05070d', space1: '#0b1020', limbIn: '#2b6fd6', limbOut: '#8fd0ff',
  ocean: '#1f5fa8', ocean2: '#2f7fc4', haze: '#6fb0e8', cloud: '#f2f6fa', cloudSh: '#9fb6cf', land: '#6b8f4e', land2: '#b89a6a',
};

/** Direction (world, any length) to picture px through the camera's rotation only. Null when it points behind the lens. */
export const dirToPicture = (c: YCam, [x, y, z]: V3): Pt | null => {
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw);
  const r = x * co + z * s, u0 = y, d0 = x * s - z * co;
  const cs = Math.cos(c.pitch ?? 0), sn = Math.sin(c.pitch ?? 0);
  const u = u0 * cs - d0 * sn, d = d0 * cs + u0 * sn;
  if (d <= 1e-4) return null;
  return [540 + (c.cx ?? 0) + (c.f * r) / d, c.hy - (c.f * u) / d];
};

/** World elevation (deg, positive up) of the ray through picture point (X, Y). */
export const elevAt = (c: YCam, X: number, Y: number): number => {
  const r = (X - 540 - (c.cx ?? 0)) / c.f, uP = (c.hy - Y) / c.f;
  const cs = Math.cos(c.pitch ?? 0), sn = Math.sin(c.pitch ?? 0);
  const u = uP * cs + sn, d = cs - uP * sn;
  return Math.atan2(u, Math.hypot(r, d)) / DEGR;
};

/** Picture row where the ray in column X has elevation `el` (deg); elevation falls as Y grows. */
export const rowAtElev = (c: YCam, X: number, el: number): number => {
  let lo = -4000, hi = 6000;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (elevAt(c, X, m) > el) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
};

/** Iso-elevation curve across the picture (step px), as picture points. */
export const elevCurve = (c: YCam, el: number, step = 30): Pt[] => {
  const out: Pt[] = [];
  for (let X = -60; X <= 1140; X += step) out.push([X, rowAtElev(c, X, el)]);
  return out;
};

/** A ground point on the sphere: angular distance `th` (deg) from the nadir, world bearing `be` (deg, 0 = +z, 90 = +x). Returns the direction from the camera. */
export const groundDir = (th: number, be: number, alt = ALT): V3 => {
  const t = th * DEGR, b = be * DEGR;
  const P: V3 = [RE * Math.sin(t) * Math.sin(b), RE * Math.cos(t), RE * Math.sin(t) * Math.cos(b)];
  return [P[0], P[1] - (RE + alt), P[2]];
};
/** Ground blob around (th, be) with radius `km` (n points); `wob` irregularity 0..1 from `seed`. */
const groundBlob = (th: number, be: number, km: number, seed: number, n = 14, wob = 0.35, sx = 1, sy = 1, alt = ALT): V3[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2, k = 1 + wob * (hash(seed + i * 7.1) - 0.5) * 2;
    const dth = ((km * k * sy * Math.cos(a)) / RE) / DEGR, dbe = ((km * k * sx * Math.sin(a)) / (RE * Math.sin(Math.max(0.5, th) * DEGR))) / DEGR;
    return groundDir(Math.min(limbDip(alt) - 0.05, Math.max(0.2, th + dth)), be + dbe, alt);
  });

const proj = (c: YCam, vs: V3[]): Pt[] | null => {
  const out: Pt[] = [];
  for (const v of vs) { const q = dirToPicture(c, v); if (!q) return null; out.push(q); }
  return out;
};
const onScreen = (pts: Pt[]) => pts.some(([x, y]) => x > -200 && x < 1280 && y > -200 && y < 2120);

export type EarthOpts = {
  /** Picture rectangle the backdrop fills (default the full frame). */
  rect?: [number, number, number, number];
  /** Faint stars in the upper sky: count (default 22) and alpha (default 0.35, brief VD06). */
  stars?: number; starAlpha?: number;
  seed?: number;
  /** Warm the day side toward the sun key 0..1 (B04 exhale frame). */
  warm?: number;
  /** Cloud systems scattered over the sphere (default 520). */
  clouds?: number;
  /** Extra brightness on the haze band 0..1 (forward scatter, shade side). */
  glow?: number;
  /** Orbit altitude in km (default 400, the station): sets the limb dip and how far the ground features sit from the nadir. */
  altKm?: number;
};

/** Space wash, stars, the Earth day side with clouds and land, and the limb band. Returns the limb curve (picture px). */
export const paintEarth = (p: Painter, c: YCam, o: EarthOpts = {}): {limb: Pt[]} => {
  const [x0, y0, x1, y1] = o.rect ?? [0, 0, 1080, 1920], id = o.seed ?? 8800;
  const col = EARTH_COL, alt = o.altKm ?? ALT, dip = limbDip(alt);
  const box = (ya: number, yb: number): Pt[] => [[x0 - 40, ya], [x1 + 40, ya], [x1 + 40, yb], [x0 - 40, yb]];
  // space: near-black navy, lifting toward the limb (iso-elevation bands above the limb)
  hardFill(p, id, col.space0, box(y0 - 40, y1 + 40));
  const skyBands: [number, string][] = [[8, '#070a14'], [4.5, '#090d1a'], [2.2, col.space1], [1.0, '#0f1730'], [0.45, '#16224a']];
  skyBands.forEach(([dEl, cc], i) => {
    const top = elevCurve(c, -dip + dEl);
    hardFill(p, id + 1 + i, cc, [...top, [x1 + 60, y1 + 60], [x0 - 60, y1 + 60]]);
  });
  // stars: upper sky only, none within 150 px of the limb
  const limb = elevCurve(c, -dip);
  const limbY = (X: number) => { let best = limb[0]; for (const q of limb) if (Math.abs(q[0] - X) < Math.abs(best[0] - X)) best = q; return best[1]; };
  const nS = o.stars ?? 22, sa = o.starAlpha ?? 0.35;
  for (let i = 0; i < nS; i++) {
    const X = x0 + hash(id + i * 3.3) * (x1 - x0), Y = y0 + hash(id + i * 5.7 + 1) * (y1 - y0);
    if (Y > limbY(X) - 150) continue;
    const r = 1.6 + hash(id + i * 9.1) * 1.8;
    hardFill(p, id + 40 + i, mixHex('#05070d', '#e8eeff', sa * (0.6 + 0.4 * hash(id + i))), ell(X, Y, r, r, 8));
  }
  // atmosphere band above the limb (8-14 px at f 1100), then the ocean bands below it (iso-depression = rings about the nadir)
  const glow = o.glow ?? 0, warm = o.warm ?? 0;
  const atm = [[0.55, mixHex(col.limbIn, '#0f1730', 0.55)], [0.32, col.limbIn], [0.14, mixHex(col.limbOut, '#ffffff', 0.2 * glow)]] as const;
  atm.forEach(([dEl, cc], i) => hardFill(p, id + 70 + i, cc, [...elevCurve(c, -dip + dEl), [x1 + 60, y1 + 60], [x0 - 60, y1 + 60]]));
  const sea: [number, string][] = [
    [0, mixHex('#9fd2f5', '#ffffff', 0.15 + 0.2 * glow)], [0.18, mixHex(col.haze, '#ffe6b8', 0.15 * warm)], [0.6, mixHex('#4f92d2', '#f2d7a0', 0.1 * warm)],
    [1.5, col.ocean2], [3.5, mixHex(col.ocean2, col.ocean, 0.5)], [7, col.ocean], [14, '#1b5596'],
  ];
  sea.forEach(([dDep, cc], i) => hardFill(p, id + 80 + i, cc, [...elevCurve(c, -dip - dDep), [x1 + 60, y1 + 60], [x0 - 60, y1 + 60]]));
  // land hints (generic, no real coast): a few low-contrast shapes
  const lands: [number, number, number, number, string][] = [[15, 150, 380, 1.6, col.land], [17.5, 205, 260, 1.4, col.land2], [16.5, 310, 420, 1.5, col.land], [14, 40, 220, 1.0, col.land2], [18.2, 250, 300, 1.8, col.land]];
  lands.forEach(([th, be, km, sx, cc], i) => {
    const q = proj(c, groundBlob(th, be, km, id + 500 + i * 31, 18, 0.45, sx, 0.8, alt));
    if (q && onScreen(q)) hardFill(p, id + 500 + i, mixHex(cc, col.ocean2, 0.35), q);
  });
  // cloud systems: clusters of blobs fixed on the ground; a soft blue shadow under each (offset away from the sun, screen-right/down)
  for (let s = 0; s < (o.clouds ?? 520); s++) {
    // sqrt spread in angle: more systems toward the limb (they cover more of the picture there), few near the nadir
    const th = 1.5 + Math.sqrt(hash(id + s * 13.7)) * (dip - 2.0), be = hash(id + s * 29.3) * 360;
    const big = hash(id + s * 3.9) < 0.15, n = big ? 8 : 3 + Math.floor(hash(id + s) * 4);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + s, spread = (big ? 120 : 45) * hash(id + s * 7 + k);
      const dth = (spread * Math.cos(a)) / RE / DEGR, dbe = (spread * Math.sin(a)) / (RE * Math.sin(th * DEGR)) / DEGR;
      const km = (big ? 55 : 22) * (0.5 + 0.9 * hash(id + s * 11 + k * 3)) * (0.45 + 0.55 * th / dip);
      const sh = proj(c, groundBlob(th + dth + 0.04, be + dbe + 0.12, km, id + s * 100 + k, 18, 0.22, 1.3, 0.9, alt));
      const cl = proj(c, groundBlob(th + dth, be + dbe, km, id + s * 100 + k, 18, 0.22, 1.3, 0.9, alt));
      if (!cl || !onScreen(cl)) continue;
      if (sh) hardFill(p, id + 1000 + s * 20 + k, mixHex(col.cloudSh, col.ocean2, 0.35), sh);
      hardFill(p, id + 2000 + s * 20 + k, mixHex(col.cloud, '#fff1d6', 0.25 * warm), cl);
    }
  }
  // haze veil over the far ocean and clouds near the limb, then the bright limb line
  hardFill(p, id + 90, mixHex('#a9d8f7', '#ffffff', 0.2 * glow), [...elevCurve(c, -dip), ...elevCurve(c, -dip - 0.25).reverse()]);
  inkLine(p, id + 95, limb.filter(([x]) => x > x0 - 30 && x < x1 + 30), {color: mixHex('#cfeaff', '#ffffff', 0.4), weight: 1.1, closed: false, curve: 0.3, still: true});
  return {limb};
};

/** Mix two #rrggbb colours (u = 0 gives a). */
export const mixHex = (a: string, b: string, u: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, u))).toString(16).padStart(2, '0')).join('');
};

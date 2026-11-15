import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {wp} from '../kit/world';
import {camDepth, camPoint, camUnit, type YCam} from '../kit/ycam';
import {planeDashes} from './marks';
import {ribbon} from './sea';
import {C} from './palette';
import {horizonY} from './yard';

// N10 SET-REDSEA17 (space F: origin on the sea under midships, +x toward the bow) and N11 flashback seabed FS. W3 THUMBNAIL grade (Film,
// 2026-11-15). Truth limits (brief F023): the ship is already damaged and abandoned: a scorch patch on the aft hull side and a thin smoke trail
// only; no missile, fire, crew, name, flag, markings, wake, lights or lifeboats; anchor chain taut from the bow. Grade + LBL + CARD are screen layers.

const ok = (q: Pt[]) => q.length >= 3;
const DEG = Math.PI / 180;
const LIST = 9 * DEG;
/** Ship local to F metres. u along the hull (bow +x), v across (+ toward the camera side, +z), h up from the waterline at midships. The hull
 *  lists 9 deg away from the camera (tops lean to -z) and trims down by the stern (bow +3 m, stern -3 m): brief SET-REDSEA17. */
const shipW = (u: number, v: number, h: number): V3 => [u, h * Math.cos(LIST) + v * Math.sin(LIST) + (u / 75) * 3, v * Math.cos(LIST) - h * Math.sin(LIST)];
/** The local h at which the hull side at (u, v) meets the sea (world y 0). */
const hWater = (u: number, v: number) => -(v * Math.sin(LIST) + (u / 75) * 3) / Math.cos(LIST);
type Q3 = [number, number, number][];
/** Paint a ship-space polygon if it faces the camera (picture winding); returns the picture points or null. */
const face = (p: Painter, c: YCam, seed: number, col: string, pts: Q3, cull = true) => {
  const q = wp(c, pts.map(([u, v, h]) => shipW(u, v, h)));
  if (!ok(q)) return null;
  if (cull) {
    let a = 0;
    for (let i = 0; i < q.length; i++) { const [x0, y0] = q[i], [x1, y1] = q[(i + 1) % q.length]; a += x0 * y1 - x1 * y0; }
    if (a > 0) return null;
  }
  hardFill(p, seed, col, q);
  return q;
};
/** A ship-space box (u0..u1, v0..v1, h0..h1): every face that turns to the camera, shaded by face. */
const box = (p: Painter, c: YCam, seed: number, col: string, u0: number, u1: number, v0: number, v1: number, h0: number, h1: number) => {
  face(p, c, seed, col, [[u0, v1, h0], [u1, v1, h0], [u1, v1, h1], [u0, v1, h1]]);
  face(p, c, seed + 1, mixColor(col, '#2a2a2a', 0.3), [[u1, v0, h0], [u0, v0, h0], [u0, v0, h1], [u1, v0, h1]]);
  face(p, c, seed + 2, mixColor(col, '#2a2a2a', 0.12), [[u1, v1, h0], [u1, v0, h0], [u1, v0, h1], [u1, v1, h1]]);
  face(p, c, seed + 3, mixColor(col, '#2a2a2a', 0.22), [[u0, v0, h0], [u0, v1, h0], [u0, v1, h1], [u0, v0, h1]]);
  face(p, c, seed + 4, mixColor(col, '#ffffff', 0.12), [[u0, v0, h1], [u1, v0, h1], [u1, v1, h1], [u0, v1, h1]]);
};
const line3 = (p: Painter, c: YCam, id: number, pts: Q3, col: string, w: number) => {
  const q = pts.map(([u, v, h]) => camPoint(c, shipW(u, v, h)));
  if (q.every(Boolean)) inkLine(p, id, q as Pt[], {closed: false, color: col, weight: w, still: true, curve: 0});
};

/** N10 Red Sea surface: overcast sky, grey swell, the damaged bulk carrier from the side (white superstructure aft with its funnel, four deck
 *  cranes over the hatches, raised forecastle and mast), scorch patch and thin smoke aft, anchor chain taut from the bow. No name, flag, crew,
 *  lights, fire or wake. Finished grade W3 (LF05, T5B broadside). */
export const paintRedSea = (p: Painter, c: YCam, o: {t?: number} = {}) => {
  const hz = horizonY(c);
  paintSkyBands(p, {from: mixColor(C.rsSky0, '#8e9494', 0.35), via: C.rsSky0, viaAt: 0.55, to: C.rsHaze, horizon: hz + 3, width: 1080, bands: 9});
  // stratus: long soft cloud bands, darker undersides
  for (let i = 0; i < 9; i++) {
    const y = hz * (0.12 + i * 0.095), x = ((i * 0.618) % 1) * 1080, w = 260 + ((i * 0.37) % 1) * 320;
    hardFill(p, 8000 + i, mixColor(C.rsSky0, i % 2 ? '#9a9f9f' : '#c3c6c3', 0.55), ell(x, y, w, 16 + (i % 3) * 8, 20));
    hardFill(p, 8020 + i, mixColor(C.rsSky0, '#878d8d', 0.5), ell(x + w * 0.1, y + 10, w * 0.8, 6, 16));
  }
  // sea: bands far to near, then swell marks (darker troughs, light crests) in world space
  const bands: [number, number, string][] = [[-20000, -3000, mixColor(C.rsSea, C.rsHaze, 0.5)], [-3000, -800, mixColor(C.rsSea, C.rsHaze, 0.25)], [-800, 0, C.rsSea], [0, 3000, mixColor(C.rsSea, C.rsSwell, 0.45)]];
  bands.forEach(([z0, z1, col], i) => { const q = wp(c, [[-20000, 0, z0], [20000, 0, z0], [20000, 0, z1], [-20000, 0, z1]]); if (ok(q)) hardFill(p, 8040 + i, col, q); });
  hardFill(p, 8046, mixColor(C.rsHaze, C.rsSea, 0.25), [[-40, hz - 2], [1120, hz - 2], [1120, hz + 4], [-40, hz + 4]]);
  for (let i = 0; i < 220; i++) {
    const z = c.z - 4 - Math.pow(hash(8100 + i), 2.2) * 2500, x = c.x + (hash(8300 + i) - 0.5) * (z - c.z) * -1.6, q = camPoint(c, [x, 0, z]);
    if (!q || q[1] < hz + 2) continue;
    const d = Math.hypot(x - c.x, z - c.z), w = Math.min(150, Math.max(5, 6 * camUnit(c, [x, 0, z]))), flat = Math.max(0.03, Math.min(0.2, (c.y / d) * 1.4)), crest = i % 4 === 0;
    if (w > 30) hardFill(p, 8500 + i, crest ? mixColor(C.rsSea, '#9aa29f', 0.2) : mixColor(C.rsSwell, C.rsSea, 0.4), ell(q[0], q[1], w * 1.5, w * flat * 0.45, 16, (hash(8700 + i) - 0.5) * 0.06));
    else inkLine(p, 8500 + i, [[q[0] - w, q[1]], [q[0], q[1] - w * 0.07], [q[0] + w, q[1]]], {closed: false, color: crest ? mixColor(C.rsSea, '#d8dad6', 0.35) : C.rsSwell, weight: crest ? 0.7 : 1.0, still: true, curve: 0.4});
  }
  // hull plan: beam 23 m, deck at h 7 midships, forecastle h 9.5 from u 58, raked stem to u 78 at the top, transom at u -75
  const half = (u: number) => (u > 50 ? 11.5 * Math.max(0.04, 1 - ((u - 50) / 26) ** 1.8) : u < -66 ? 11.5 - ((-66 - u) / 9) * 2.5 : 11.5);
  const top = (u: number) => (u > 56 ? 9.5 : u > 54 ? 7 + ((u - 54) / 2) * 2.5 : 7);
  const us = [-75, -70, -60, -45, -30, -15, 0, 15, 30, 45, 54, 56, 62, 68, 72, 75];
  const stem = (u: number) => (u >= 75 ? 3 : 0); void stem;
  // dark water shadow under the hull (reflection band)
  const sh = wp(c, [[-80, 0, 13], [78, 0, 13], [78, 0, 26], [-80, 0, 26]].map(([x, y, z]) => [x, y, z] as V3));
  if (ok(sh)) hardFill(p, 8090, mixColor(C.rsSwell, '#2a2e2c', 0.35), sh);
  // far side never shows (list away); deck is above the eye; draw: superstructure, funnel, cranes, mast, then the near hull side over their feet
  // thin grey smoke from the damaged aft hatch, on the far side of the superstructure (painted before it), rising and drifting downwind (-x)
  const t = o.t ?? 0.4;
  for (let i = 0; i < 14; i++) {
    const u = -42 - i * 6.5 - t * 3, h = 10 + i * 3.4 + i * i * 0.12, q = camPoint(c, shipW(u, -5 - i * 0.8, h));
    if (!q) continue;
    const r = (2.2 + i * 0.9) * camUnit(c, shipW(u, 0, h));
    washAt(p, 8940 + i, mixColor('#5c5c5a', C.rsHaze, i / 20), 170 - i * 8, ell(q[0], q[1], r * 2.0, r * 0.6, 14, -0.12), 0.3, 0.2);
  }
  const sup = mixColor(C.superW, '#b8b6b0', 0.1);
  box(p, c, 8600, sup, -73, -57, -10, 10, 7, 11);
  box(p, c, 8610, sup, -72, -58, -9.5, 9.5, 11, 14);
  box(p, c, 8620, sup, -71.5, -59, -9, 9, 14, 17);
  box(p, c, 8630, sup, -71, -59.5, -11.5, 11.5, 17, 19.5); // bridge deck with wings
  // window rows: small dark panes on the decks, the bridge band dark
  [[8.2, 10.2], [11.6, 13.4], [14.6, 16.4]].forEach(([h0, h1], r) => {
    for (let k = 0; k < 6; k++) { const u0 = -71.5 + k * 2.3; face(p, c, 8640 + r * 8 + k, '#3a3e42', [[u0, 10.05 - r * 0.5, h0], [u0 + 1.3, 10.05 - r * 0.5, h0], [u0 + 1.3, 10.05 - r * 0.5, h1], [u0, 10.05 - r * 0.5, h1]]); }
  });
  face(p, c, 8670, '#2f3337', [[-70.5, 11.55, 18.0], [-60, 11.55, 18.0], [-60, 11.55, 19.2], [-70.5, 11.55, 19.2]]);
  face(p, c, 8671, '#2f3337', [[-59.45, 11.0, 18.0], [-59.45, -11.0, 18.0], [-59.45, -11.0, 19.2], [-59.45, 11.0, 19.2]]);
  // funnel (plain, no logo), black top
  box(p, c, 8680, '#6a6a66', -70, -64, -3, 3, 19.5, 26.5);
  box(p, c, 8690, '#2a2a2a', -70, -64, -3, 3, 26.5, 28);
  // radar mast on the bridge roof
  line3(p, c, 8695, [[-66, 0, 19.5], [-66, 0, 24]], '#4a4a48', 1.2);
  line3(p, c, 8696, [[-66, -3, 23], [-66, 3, 23]], '#4a4a48', 1.0);
  // hatch coamings and covers between the cranes, then four cranes on pedestals with jibs raised forward
  for (let i = 0; i < 5; i++) { const u0 = -50 + i * 20.5; box(p, c, 8700 + i * 6, mixColor('#6a4a3c', '#5a5a55', 0.5), u0, u0 + 15, -8, 8, 7, 8.8); }
  [-35.5, -15, 5.5, 26].forEach((u, i) => {
    box(p, c, 8740 + i * 6, '#c9b77a', u - 1.4, u + 1.4, -1.4, 1.4, 7, 15);
    box(p, c, 8770 + i * 6, '#d8ccA0', u - 1.8, u + 1.8, -1.8, 1.8, 15, 17.5);
    line3(p, c, 8800 + i, [[u + 1.5, 0, 16.5], [u + 15, 0, 30]], '#b8a66a', 2.4);
    line3(p, c, 8810 + i, [[u, 0, 17.5], [u + 15, 0, 30]], '#8a7a4a', 0.6);
    line3(p, c, 8820 + i, [[u + 15, 0, 30], [u + 15, 0, 18]], '#5a5040', 0.5);
  });
  // forecastle mast
  line3(p, c, 8830, [[64, 0, 9.5], [64, 0, 21]], '#4a4a48', 1.3);
  line3(p, c, 8831, [[64, -2.5, 18.5], [64, 2.5, 18.5]], '#4a4a48', 1.0);
  // near hull side: dark topsides, red boot-top band (wider at the raised bow), a lighter sheer line, then the stem and transom
  for (let i = 0; i < us.length - 1; i++) {
    const a = us[i], b = us[i + 1], va = half(a), vb = half(b), wa = hWater(a, va), wb = hWater(b, vb);
    const ra = wa + 1.0 + Math.max(0, a / 75) * 2.2, rb = wb + 1.0 + Math.max(0, b / 75) * 2.2;
    face(p, c, 8840 + i * 3, C.hullLow, [[a, va, wa], [b, vb, wb], [b, vb, rb], [a, va, ra]], false);
    face(p, c, 8841 + i * 3, C.hullUp, [[a, va, ra], [b, vb, rb], [b, vb, top(b)], [a, va, top(a)]], false);
  }
  // bow (port side seen past the stem) and the raked stem
  face(p, c, 8900, mixColor(C.hullUp, '#000000', 0.15), [[72, 0.6, hWater(72, 0.6)], [78, 0, 9.5], [75, half(75), 9.5]], false);
  // sheer line and rubbing strake
  line3(p, c, 8905, us.map((u) => [u, half(u) + 0.05, top(u) - 0.25] as [number, number, number]), mixColor(C.hullUp, '#d8d4cc', 0.35), 0.7);
  line3(p, c, 8906, us.map((u) => [u, half(u) + 0.05, top(u) - 2.2] as [number, number, number]), mixColor(C.hullUp, '#d8d4cc', 0.18), 0.5);
  // transom
  face(p, c, 8910, mixColor(C.hullUp, '#000000', 0.25), [[-75, 9, hWater(-75, 9)], [-75, 9, 7], [-75, -9, 7], [-75, -9, hWater(-75, -9)]], false);
  // scorch patch on the aft hull side (camera side) under the damaged hatch, streaks running down
  face(p, c, 8920, '#4a3326', [[-52, 11.55, 1.5], [-40, 11.55, 2.2], [-38, 11.55, 6.6], [-47, 11.55, 6.9], [-53, 11.55, 5.5]], false);
  for (let k = 0; k < 6; k++) { const u = -51 + k * 2.2; line3(p, c, 8925 + k, [[u, 11.56, 5.5 - (k % 2)], [u + 0.3, 11.56, 0.6 + (k % 3) * 0.5]], mixColor(C.scorch, '#1a1410', 0.3), 0.7); }
  // waterline foam where the hull meets the swell
  const foam = us.map((u) => camPoint(c, [u, 0.05, half(u) * Math.cos(LIST) - hWater(u, half(u)) * Math.sin(LIST) + 0.3])).filter(Boolean) as Pt[];
  if (foam.length > 2) inkLine(p, 8935, foam, {closed: false, color: mixColor(C.rsSea, '#e2e2dc', 0.45), weight: 1.0, still: true, curve: 0.2});
  // anchor chain from the bow hawse running taut down into the water ahead
  const h0 = camPoint(c, shipW(73, 2.5, 7.5)), h1 = camPoint(c, [96, 0, 2]);
  if (h0 && h1) inkLine(p, 8960, [h0, h1], {closed: false, color: '#2e2a26', weight: Math.max(1.0, 0.35 * camUnit(c, [86, 4, 2])), still: true, curve: 0});
  const sp = camPoint(c, [96, 0, 2]);
  if (sp) { const k = camUnit(c, [96, 0, 2]); inkLine(p, 8961, [[sp[0] - 1.2 * k, sp[1]], [sp[0] + 1.2 * k, sp[1]]], {closed: false, color: mixColor(C.rsSea, '#e2e2dc', 0.4), weight: 0.8, still: true}); }
};

/** FS flashback seabed: plain mid-grey sand, gentle undulation, three parallel cables at 25 deg; `dark` 0..3 = how many have gone dark. */
/** FS bed height (gentle undulation, m). */
export const fsBedY = (x: number, z: number) => 0.15 * Math.sin(x * 0.35 + z * 0.2) + 0.1 * Math.sin(z * 0.6);
/** FS cable C1..C3 axis and normal (x, z). */
export const FS_DIR: [number, number] = [Math.cos(25 * DEG), -Math.sin(25 * DEG)], FS_N: [number, number] = [Math.sin(25 * DEG), Math.cos(25 * DEG)];
/** `dark` 0..3 (fractional = the next cable fading over its 3 f); `far` sand distance (m, default 80); `near` first sand strip z offset from the camera
 *  (default -1, as LF06; a yawed or trucked camera needs + to cover the near-right corner); `onSand` paints after the sand, before the
 *  cables (B05-SH04 furrow: the cables lie in it). */
export const paintFlashSeabed = (p: Painter, c: YCam, o: {dark?: number; far?: number; near?: number; onSand?: () => void} = {}) => {
  // water backdrop (neutral, no shafts) and sand in strips with distance haze
  for (let i = 0; i < 12; i++) hardFill(p, 8400 + i, mixColor(C.fsWater0, C.fsWater1, i / 11), [[-40, -40 + i * 170], [1120, -40 + i * 170], [1120, 140 + i * 170], [-40, 140 + i * 170]]);
  const y = fsBedY, FAR = o.far ?? 80, NZ = o.near ?? -1;
  for (let i = 0; i < 50; i++) {
    const z0 = c.z + NZ - FAR * ((50 - i) / 50) ** 2, z1 = c.z + NZ - FAR * ((49 - i) / 50) ** 2;
    const q = wp(c, [[c.x - 300, y(0, z0), z0], [c.x + 300, y(0, z0), z0], [c.x + 300, y(0, z1), z1], [c.x - 300, y(0, z1), z1]]);
    if (!ok(q)) continue;
    const d = Math.abs(camDepth(c, [c.x, 0, (z0 + z1) / 2]));
    hardFill(p, 8420 + i, mixColor(i % 3 ? C.fsSand : mixColor(C.fsSand, C.fsFurrow, 0.15), C.fsWater1, Math.min(1, (d / (FAR / 2)) ** 0.8)), q);
  }
  for (let i = 0; i < 70; i++) {
    const x = c.x - 8 + ((i * 0.618) % 1) * 16, z = c.z - 2 - ((i * 0.377) % 1) ** 1.5 * 25, q = camPoint(c, [x, y(x, z), z]);
    if (!q) continue;
    const r = (0.04 + ((i * 0.53) % 1) * 0.06) * camUnit(c, [x, 0, z]), d = Math.abs(camDepth(c, [x, 0, z]));
    hardFill(p, 8480 + i, mixColor(C.fsFurrow, C.fsWater1, Math.min(1, d / 30)), ell(q[0], q[1], r, r * 0.45, 8));
  }
  // finished grade (LF06): sand ripples, a few shell flecks and suspended specks; flat diffuse light, no shafts (depth-neutral)
  planeDashes(p, c, 8800, (u, v) => { const x = c.x - 10 + u * 20, z = c.z - 1.5 - v * v * 40; return [x, y(x, z) + 0.005, z]; }, {n: 240, col: (i) => mixColor(mixColor(C.fsSand, C.fsFurrow, 0.45), C.fsWater1, Math.min(0.85, hash(8800 + i * 2.71 + 0.5) ** 2 * 1.2)), len: 0.02, w: 0.03});
  planeDashes(p, c, 9100, (u, v) => { const x = c.x - 10 + u * 20, z = c.z - 1.5 - v * v * 40; return [x, y(x, z) + 0.006, z]; }, {n: 90, col: (i) => mixColor(mixColor(C.fsSand, '#c8c4b4', 0.4), C.fsWater1, Math.min(0.85, hash(9100 + i * 2.71 + 0.5) ** 2 * 1.2)), len: 0.012, w: 0.02});
  for (let i = 0; i < 50; i++) { const x = hash(9300 + i) * 1080, yy = hash(9360 + i) * 1500, r = 1.2 + hash(9420 + i) * 2.2; hardFill(p, 9480 + i, mixColor('#b8c4c8', C.fsWater0, 0.5), ell(x, yy, r, r, 6)); }
  o.onSand?.();
  // cables C1..C3 at 25 deg to the frame, 2.5 m apart, through the FS origin
  const dir: [number, number] = [Math.cos(25 * DEG), -Math.sin(25 * DEG)], nrm: [number, number] = [-dir[1], dir[0]];
  [-2.5, 0, 2.5].forEach((off, k) => {
    const pts: Pt[] = [], ws: number[] = [];
    for (let s = -40; s <= 40; s += 0.5) {
      const x = dir[0] * s + nrm[0] * off, z = dir[1] * s + nrm[1] * off, v: V3 = [x, y(x, z) + 0.01, z], q = camPoint(c, v, 0.5);
      if (q) { pts.push(q); ws.push(camUnit(c, v)); }
    }
    const a = Math.max(0, Math.min(1, k + 1 - (o.dark ?? 0))), lit = a > 0;
    for (let i0 = 0, r = 0; i0 < pts.length - 1; i0 += 12, r++) {
      const P = pts.slice(i0, i0 + 13), W = ws.slice(i0, i0 + 13);
      if (lit) hardFill(p, 8560 + k * 40 + r, mixColor(mixColor(C.glow, C.fsSand, 0.4), C.fsSand, 1 - a), ribbon(P, W.map((w) => Math.max(1.6, 0.04 * w) * (0.4 + 0.6 * a))));
      hardFill(p, 8700 + k * 40 + r, C.fsCable, ribbon(P, W.map((w) => Math.max(0.8, 0.014 * w))));
    }
    if (a > 0.5) inkLine(p, 8690 + k, pts, {closed: false, color: mixColor(C.glow, '#ffffff', 0.3), weight: 0.5, still: true, curve: 0});
  });
};

import type {CastDef} from '../kit/cast';
import {ell, glaze, hardFill, inkLine, INK, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {dress} from '../kit/wardrobe';
import type {FaceState} from '../kit/head';
import {paintBox, paintSorted, wFill, wp, type Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBoat, type BoatKind} from './boats';
import {contact, grainLines, planeBlots, planeDashes, tone} from './marks';
import {C} from './palette';
import {paintSister, paintSisterTiny, SCREEN_ASPECT} from './sister';
import {shoulderPoint} from '../kit/cast';

// N1 SET-YARD17 (space R, metres; brief "Set plan — SET-YARD17"). Film W3 (2026-11-15): thumbnails T1A-T1C, then the FINISHED look frame LF01
// (T1A picked) and the B01-SH05 reverse: surface marks (marks.ts), lived-in props with contact shadows, the house and terrace for reverses,
// and the hose-water arm stand-in (N14 is Boss's kit pose; this is the look's authored arm, `hoseArms`). Origin M0 on the yard ground at the man's mark,
// +x right looking out to sea, +y up, +z toward the house (sea at -z).

const ok = (q: Pt[]) => q.length >= 3;
export type YardLight = {warm: number};
/** Picture y of the horizon (a point 6 km ahead at eye height). */
export const horizonY = (c: YCam) => camPoint(c, [c.x + Math.sin(c.yaw) * 6000, c.y, c.z - Math.cos(c.yaw) * 6000])?.[1] ?? c.hy;

/** MAN: `man-spiky + park-casual`, no cap, bare shins (sock = skin), dark-blue flip-flops (brief VD; outfit fields only). */
export const MAN: CastDef = (() => {
  const d = dress(PEOPLE['man-spiky'], 'park-casual');
  const skin = d.head.skin;
  return {...d, outfit: {...d.outfit, shirt: C.tee, sleeve: C.tee, pants: C.denim, shoes: C.flip, shorts: {sock: skin}, gear: {...d.outfit.gear, hat: undefined}}};
})();
export const M0: V3 = [0, 0, 0];

const sky = (p: Painter, c: YCam, L: YardLight) => {
  const hz = horizonY(c);
  paintSkyBands(p, {from: mixColor(C.zenith, '#5f8fc4', 0.35 * L.warm), via: mixColor(C.skyMid, '#f3c08a', 0.6 * L.warm), viaAt: 0.62, to: mixColor(C.haze, '#ffb36a', 0.65 * L.warm), horizon: hz + 4, width: 1080, bands: 9});
  // a few soft cumulus low over the sea
  [[160, 0.62, 120], [470, 0.72, 90], [820, 0.58, 150], [1010, 0.7, 70]].forEach(([x, k, w], i) => {
    const y = hz - (hz + 160) * (1 - k) * 0.5;
    washAt(p, 1700 + i, mixColor('#fbf6ec', '#ffe2bc', 0.5 * L.warm), 150, ell(x, y, w, w * 0.28, 16), 0.1, 0.2);
  });
};

/** Sea surface bands y -1.5, beach shelf to the waterline z -14, far headland and island. */
const seaAndFar = (p: Painter, c: YCam, L: YardLight) => {
  const hz = horizonY(c);
  // headland (left) and island (right): painted as picture silhouettes on the horizon at their bearings
  const hl = [camPoint(c, [-900, -1.5, -1600]), camPoint(c, [-250, -1.5, -1600])];
  if (hl[0] && hl[1]) {
    const x0 = hl[0][0], x1 = hl[1][0], h = (120 * c.f) / 1700;
    const pts: Pt[] = [[x0 - 200, hz + 2], [x0 - 200, hz - h * 0.7], [x0 + (x1 - x0) * 0.3, hz - h], [x0 + (x1 - x0) * 0.65, hz - h * 0.75], [x1, hz - h * 0.2], [x1 + 30, hz + 2]];
    hardFill(p, 1801, mixColor(C.headlandFar, C.haze, 0.25), pts);
    hardFill(p, 1802, mixColor(C.headland, C.headlandFar, 0.35), pts.map(([x, y]) => [x, y + (hz - y) * 0.45] as Pt));
  }
  const isl = camPoint(c, [500, -1.5, -2500]);
  if (isl) hardFill(p, 1803, mixColor(C.headlandFar, C.haze, 0.45), [[isl[0] - 40, hz + 1], [isl[0] - 10, hz - 12], [isl[0] + 25, hz - 9], [isl[0] + 50, hz + 1]]);
  // sea bands far -> near
  const bands: [number, number, string][] = [[-6000, -600, C.openSea], [-600, -160, mixColor(C.openSea, C.bayMid, 0.5)], [-160, -60, C.bayMid], [-60, -14, C.bayNear]];
  bands.forEach(([z0, z1, col], i) => {
    const q = wp(c, [[-8000, -1.5, z0], [8000, -1.5, z0], [8000, -1.5, z1], [-8000, -1.5, z1]]);
    if (ok(q)) hardFill(p, 1810 + i, mixColor(col, '#f0c890', 0.12 * L.warm), q);
  });
  // horizon haze line
  hardFill(p, 1820, mixColor(C.haze, C.openSea, 0.35), [[-50, hz - 3], [1130, hz - 3], [1130, hz + 5], [-50, hz + 5]]);
  // sun glitter right of centre: short horizontal dashes on the water, denser near the horizon
  for (let i = 0; i < 70; i++) {
    const u = (i * 0.618) % 1, v = (i * 0.377) % 1;
    const z = -30 - Math.pow(v, 0.6) * 900, x = 6 + z * -(0.25 + u * 0.55) * 0.6 + (u - 0.5) * 20;
    const q = camPoint(c, [x, -1.5, z]);
    if (!q || q[1] < hz + 1) continue;
    const w = Math.max(3, 260 / Math.abs(z) * (0.6 + u));
    hardFill(p, 1830 + i, mixColor(C.glitter, C.sun, 0.3 * L.warm), [[q[0] - w, q[1] - 1], [q[0] + w, q[1] - 1], [q[0] + w * 0.7, q[1] + 1.5], [q[0] - w * 0.7, q[1] + 1.5]]);
  }
};

/** Beach from the wall foot (y -0.30, z -0.8) to the waterline (z -14, y -1.5), wet edge and a lap of foam. */
const beach = (p: Painter, c: YCam) => {
  const q = wp(c, [[-60, -0.3, -0.55], [60, -0.3, -0.55], [60, -1.5, -14], [-60, -1.5, -14]]);
  if (ok(q)) hardFill(p, 1900, C.sand, q);
  const wet = wp(c, [[-60, -1.42, -12.6], [60, -1.42, -12.6], [60, -1.5, -14], [-60, -1.5, -14]]);
  if (ok(wet)) hardFill(p, 1901, mixColor(C.sand, C.sandShade, 0.55), wet);
  const foam = wp(c, [[-60, -1.49, -13.8], [60, -1.49, -13.8], [60, -1.5, -14.6], [-60, -1.5, -14.6]]);
  if (ok(foam)) hardFill(p, 1902, C.wake, foam);
  // finished grade: sand dashes and a few shells on the beach, the wrack line, wavelets on the bay (darker troughs, lit crests)
  planeDashes(p, c, 1903, (u, v) => [-12 + u * 24, -0.3 - v * 1.2, -0.8 - v * 13], {n: 120, col: (i) => tone(C.sand, i % 3 ? 0.1 : -0.12), len: 0.01, w: 0.02});
  planeDashes(p, c, 1990, (u, v) => [-12 + u * 24, -1.38, -11.4 - v * 0.6], {n: 30, col: tone(C.sand, 0.3), len: 0.03, w: 0.03});
  planeDashes(p, c, 1440, (u, v) => [-60 + u * 120, -1.5, -15 - v * v * 160], {n: 180, col: (i) => (i % 3 ? mixColor(C.bayMid, '#1d4a5e', 0.25) : mixColor(C.bayNear, '#e8f4ea', 0.35)), len: 0.012, w: 0.05});
};

/** A leaning coconut palm: trunk from `base` curving toward the sea, frond crown at the top. */
const palm = (p: Painter, c: YCam, seed: number, base: V3, lean: [number, number], h: number) => {
  const pts: V3[] = Array.from({length: 9}, (_, i) => { const u = i / 8; return [base[0] + lean[0] * u * u * h, base[1] + h * u, base[2] + lean[1] * u * u * h]; });
  const q = pts.map((v) => camPoint(c, v));
  if (q.some((v) => !v)) return;
  const qq = q as Pt[], top = qq[qq.length - 1], k = camUnit(c, pts[8]);
  const w0 = 0.32 * camUnit(c, base), w1 = 0.2 * k;
  const left = qq.map(([x, y], i) => [x - (w0 + (w1 - w0) * (i / 8)) / 2, y] as Pt), right = qq.map(([x, y], i) => [x + (w0 + (w1 - w0) * (i / 8)) / 2, y] as Pt).reverse();
  hardFill(p, seed, C.palmTrunk, [...left, ...right]);
  hardFill(p, seed + 1, mixColor(C.palmTrunk, '#3a2a1a', 0.3), [...left, ...left.map(([x, y]) => [x + w0 * 0.3, y] as Pt).reverse()]);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3, len = (2.6 + (i % 3) * 0.4) * k, droop = 0.9 * k;
    const tip: Pt = [top[0] + Math.cos(a) * len, top[1] + Math.abs(Math.sin(a)) * droop * 0.6 + (Math.sin(a) < 0 ? -len * 0.25 : len * 0.35)];
    const mid: Pt = [(top[0] + tip[0]) / 2, Math.min(top[1], tip[1]) - 0.35 * k];
    const n: Pt = [-(tip[1] - top[1]), tip[0] - top[0]], nl = Math.hypot(n[0], n[1]) || 1, wv = 0.28 * k;
    hardFill(p, seed + 10 + i, i % 2 ? C.palmLeaf : mixColor(C.palmLeaf, C.leafDark, 0.5), [top, [mid[0] + (n[0] / nl) * wv, mid[1] + (n[1] / nl) * wv], tip, [mid[0] - (n[0] / nl) * wv * 0.4, mid[1] - (n[1] / nl) * wv * 0.4]]);
  }
};

/** The whitewashed sea wall RL with its plank, the step gap x 2.2 -> 3.1 and the far run to x 5.5. */
const wall = (p: Painter, c: YCam, L: YardLight) => {
  const wallCol = mixColor(C.wall, '#ffe0b0', 0.12 * L.warm);
  [[-4.5, 2.2], [3.1, 5.5]].forEach(([x0, x1], i) => {
    paintBox(p, c, 2000 + i * 20, {x0, x1, y0: -0.3, y1: 0.88, z0: -0.70, z1: -0.50}, wallCol, {front: 0.05, back: 0.3, left: 0.14, right: -0.04, top: -0.02});
    paintBox(p, c, 2010 + i * 20, {x0: x0 - 0.03, x1: x1 + 0.03, y0: 0.88, y1: 0.95, z0: -0.72, z1: -0.48}, C.plank, {top: -0.12, front: 0.08, back: 0.25});
  });
  // three steps down to the beach in the gap
  [0, 1, 2].forEach((i) => paintBox(p, c, 2060 + i * 6, {x0: 2.2, x1: 3.1, y0: -0.3, y1: 0.6 - i * 0.3, z0: -0.7 - i * 0.3, z1: -0.5 - i * 0.3}, mixColor(C.wallShade, C.sand, 0.3), {top: -0.08}));
  // weather stains along the wall foot (sea-facing side is the far side; yard side gets a sand smear)
  const smear = wp(c, [[-4.5, 0, -0.495], [2.2, 0, -0.495], [2.2, 0.12, -0.495], [-4.5, 0.12, -0.495]]);
  if (ok(smear)) washAt(p, 2080, C.sandShade, 90, smear, 0.1, 0.4);
  // finished grade (UT12, under UT12a): damp and salt stains on both faces, a hairline crack, plank grain and water rings, at the surface value
  [[-0.495, 1], [-0.705, -1]].forEach(([z, sg], f) => {
    if ((c.z - z) * sg <= 0) return; // only the face the camera sees
    const at = (u: number, v: number): V3 => [-4.5 + u * 6.7, -0.25 + v * 1.05, z + sg * 0.002];
    const faceCol = tone(wallCol, f ? 0.3 : 0.05);
    if (!f) planeBlots(p, c, 2084, at, {n: 22, r: 0.045, col: (i) => tone(faceCol, 0.05 + (i % 3) * 0.03), vert: true});
    else { const alg = wp(c, [[-4.5, -0.3, z + sg * 0.003], [2.2, -0.3, z + sg * 0.003], [2.2, -0.12, z + sg * 0.003], [-4.5, -0.16, z + sg * 0.003]]); if (ok(alg)) hardFill(p, 2124, mixColor(faceCol, '#5f6f48', 0.35), alg); }
    planeDashes(p, c, 2090 + f * 40, (u, v) => [-4.5 + u * 6.7, -0.28 + v * 0.22, z + sg * 0.003], {n: 30, col: tone(faceCol, 0.16), len: 0.04, w: 0.012, dir: [1, 0]});
  });
  const crack = [[-2.05, 0.86], [-2.0, 0.66], [-2.08, 0.5], [-2.02, 0.32]].map(([x, y]) => camPoint(c, [x, y, c.z > -0.6 ? -0.493 : -0.707])).filter(Boolean) as Pt[];
  if (crack.length > 2) inkLine(p, 2170, crack, {closed: false, color: tone(wallCol, 0.3), weight: 0.6, still: true, curve: 0.1});
  [[-4.5, 2.2], [3.1, 5.5]].forEach(([x0, x1], i) => grainLines(p, c, 2175 + i * 8, [x0, 0.951, -0.72], [x1, 0.951, -0.72], [0, 0, 0.24], {rows: 4, col: tone(C.plank, 0.18), w: 0.6}));
  [[-0.9, -0.6], [0.6, -0.62], [1.6, -0.58]].forEach(([x, z], i) => { const q = camPoint(c, [x, 0.952, z]); if (q) { const k = camUnit(c, [x, 0.95, z]); inkLine(p, 2190 + i, ell(q[0], q[1], 0.06 * k, 0.018 * k, 14), {color: tone(C.plank, 0.22), weight: 0.6, still: true}); } });
};

/** A pot (tapered cylinder seen as its silhouette) with a plant mass on top. */
const pot = (p: Painter, c: YCam, seed: number, at: V3, r: number, h: number, col: string, plant: {h: number; r: number; col: string; flowers?: string}) => {
  const top = camPoint(c, [at[0], at[1] + h, at[2]]), bot = camPoint(c, at);
  if (!top || !bot) return;
  const k = camUnit(c, at), rt = r * k, rb = r * 0.75 * k;
  hardFill(p, seed, col, [[top[0] - rt, top[1]], [top[0] + rt, top[1]], [bot[0] + rb, bot[1]], [bot[0] - rb, bot[1]]]);
  hardFill(p, seed + 1, mixColor(col, '#2a1a10', 0.3), [[top[0] + rt * 0.25, top[1]], [top[0] + rt, top[1]], [bot[0] + rb, bot[1]], [bot[0] + rb * 0.2, bot[1]]]);
  hardFill(p, seed + 2, mixColor(col, '#fff0dc', 0.2), ell(top[0], top[1], rt, rt * 0.22, 14));
  const pc = camPoint(c, [at[0], at[1] + h + plant.h * 0.5, at[2]]);
  if (!pc) return;
  const pr = plant.r * k, ph = plant.h * k * 0.5;
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1, ox = Math.cos(a) * pr * 0.45, oy = Math.sin(a) * ph * 0.4;
    hardFill(p, seed + 4 + i, i % 2 ? plant.col : mixColor(plant.col, C.leafDark, 0.4), ell(pc[0] + ox, pc[1] + oy, pr * 0.62, ph * 0.7, 12, a));
  }
  if (plant.flowers) for (let i = 0; i < 7; i++) hardFill(p, seed + 12 + i, plant.flowers, ell(pc[0] + Math.cos(i * 2.3) * pr * 0.6, pc[1] + Math.sin(i * 1.7) * ph * 0.6, pr * 0.16, pr * 0.14, 8));
};

/** The bougainvillea: a big blue-glazed pot on the ground, a 1.5 m magenta mass spilling over the wall top. */
const bougainvillea = (p: Painter, c: YCam) => {
  pot(p, c, 2200, [1.3, 0, -0.3], 0.28, 0.45, C.bluePot, {h: 0.4, r: 0.35, col: C.leaf});
  const blobs: [number, number, number, number][] = [[1.15, 1.1, -0.45, 0.42], [1.55, 1.25, -0.55, 0.38], [1.3, 1.55, -0.5, 0.4], [0.95, 1.4, -0.6, 0.3], [1.75, 0.95, -0.62, 0.3], [1.4, 0.85, -0.75, 0.32]];
  blobs.forEach(([x, y, z, r], i) => {
    const q = camPoint(c, [x, y, z]);
    if (!q) return;
    const k = camUnit(c, [x, y, z]) * r;
    hardFill(p, 2220 + i, mixColor(C.leaf, C.leafDark, (i % 3) * 0.25), ell(q[0], q[1], k, k * 0.82, 14, i));
    for (let j = 0; j < 5; j++) hardFill(p, 2240 + i * 6 + j, j % 2 ? C.boug : mixColor(C.boug, '#ff7fb0', 0.3), ell(q[0] + Math.cos(j * 2.1 + i) * k * 0.55, q[1] + Math.sin(j * 1.7 + i) * k * 0.5, k * 0.3, k * 0.24, 10, j));
  });
};

/** Earthen water jar (โอ่ง) with a lid and dipper; aloe. */
const jarAndAloe = (p: Painter, c: YCam) => {
  const at: V3 = [-2.6, 0, -0.2], mid = camPoint(c, [at[0], 0.4, at[2]]), k = camUnit(c, at);
  if (mid) {
    hardFill(p, 2300, C.jar, ell(mid[0], mid[1], 0.36 * k, 0.4 * k, 18));
    hardFill(p, 2301, mixColor(C.jar, '#1a0f08', 0.35), ell(mid[0] + 0.12 * k, mid[1] + 0.04 * k, 0.24 * k, 0.36 * k, 14));
    hardFill(p, 2302, mixColor(C.jar, '#e8c49a', 0.3), ell(mid[0], mid[1] - 0.4 * k, 0.24 * k, 0.06 * k, 14));
    hardFill(p, 2303, mixColor(C.plank, '#2a1a10', 0.2), ell(mid[0], mid[1] - 0.42 * k, 0.26 * k, 0.05 * k, 14));
  }
  const al = camPoint(c, [-1.6, 0.25, -0.25]), ka = camUnit(c, [-1.6, 0, -0.25]);
  if (al) for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.35, l = (0.35 + (i % 2) * 0.1) * ka;
    hardFill(p, 2310 + i, i % 2 ? '#6f9a6a' : '#5a8456', [[al[0] - 0.03 * ka, al[1] + 0.2 * ka], [al[0] + Math.cos(a) * l, al[1] + 0.2 * ka + Math.sin(a) * l], [al[0] + 0.03 * ka, al[1] + 0.2 * ka]]);
  }
};

/** Phone PH on its mini tripod, screen facing +z turned 25 deg toward +x; painted screen (the PHONE-SVG layer replaces it at finished grade). */
export const phone = (p: Painter, c: YCam, o: {screen?: boolean; live?: SisterLive} = {}) => {
  const ctr: V3 = [-0.40, 1.10, -0.60], a = (25 * Math.PI) / 180, hw = 0.0375, hh = 0.08;
  const ax: V3 = [Math.cos(a) * hw, 0, -Math.sin(a) * hw];
  const corner = (sx: number, sy: number): V3 => [ctr[0] + ax[0] * sx, ctr[1] + hh * sy, ctr[2] + ax[2] * sx];
  // tripod legs
  const foot = camPoint(c, [ctr[0], 0.95, ctr[2]]), neck = camPoint(c, corner(0, -1));
  if (foot && neck) {
    const k = camUnit(c, ctr);
    [-1, 0, 1].forEach((s, i) => inkLine(p, 2400 + i, [neck, [foot[0] + s * 0.035 * k, foot[1]]], {closed: false, color: '#1a1a1a', weight: 1.4, still: true}));
  }
  const body = [corner(-1.12, -1.08), corner(1.12, -1.08), corner(1.12, 1.08), corner(-1.12, 1.08)];
  const q = wFill(p, c, 2410, C.phone, body);
  if (!ok(q) || !o.screen) return;
  const scr = wFill(p, c, 2411, C.screenLamp, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)]);
  if (!ok(scr)) return;
  const at = (sx: number, sy: number) => camPoint(c, corner(sx, sy)) as Pt;
  // window behind her (snowy blue evening), her hair and face, cream knit
  hardFill(p, 2412, C.screenWin, [at(0.15, 0.85), at(0.9, 0.85), at(0.9, 0.15), at(0.15, 0.15)]);
  hardFill(p, 2413, C.snow, [at(0.15, 0.3), at(0.9, 0.3), at(0.9, 0.15), at(0.15, 0.15)]);
  if (o.live) { liveScreen(p, at, o.live); hardFill(p, 2418, mixColor(C.tee, C.sand, 0.3), [at(0.45, 0.95), at(0.92, 0.95), at(0.92, 0.6), at(0.45, 0.6)]); return; }
  const head = at(-0.1, 0.25), k = camUnit(c, ctr);
  hardFill(p, 2414, C.knit, [at(-0.85, -1), at(0.7, -1), at(0.55, -0.35), at(-0.7, -0.35)]);
  hardFill(p, 2415, C.hairBlack, ell(head[0], head[1] + 0.012 * k, 0.026 * k, 0.034 * k, 12));
  hardFill(p, 2416, C.skinSis, ell(head[0], head[1], 0.018 * k, 0.022 * k, 12));
  // her waving hand (P07) and his self-view tile top-right
  hardFill(p, 2417, C.skinSis, ell(at(0.62, 0.1)[0], at(0.62, 0.1)[1], 0.009 * k, 0.012 * k, 8));
  hardFill(p, 2418, mixColor(C.tee, C.sand, 0.3), [at(0.45, 0.95), at(0.92, 0.95), at(0.92, 0.6), at(0.45, 0.6)]);
};

export type SisterLive = {f: number; wave?: boolean};
/** Last painted live screen in picture px (stills measures only; no effect on the picture). */
export const SCREEN_LAST: {box?: {cx: number; cy: number; h: number; w: number; f: number}} = {};
/** The live call (W7 fix list item 1): the sister portrait (`sister.ts`) mapped onto the projected screen; `at(sx, sy)` = screen corner coords. */
const liveScreen = (p: Painter, at: (sx: number, sy: number) => Pt, live: SisterLive) => {
  const o = at(0, 0), ey: Pt = [(at(0, -1)[0] - at(0, 1)[0]) / 2, (at(0, -1)[1] - at(0, 1)[1]) / 2], ex: Pt = [(at(1, 0)[0] - at(-1, 0)[0]) / 2, (at(1, 0)[1] - at(-1, 0)[1]) / 2];
  const h = 2 * Math.hypot(ey[0], ey[1]), w = 2 * Math.hypot(ex[0], ex[1]);
  if (!(h > 1) || !(w > 0.5)) return;
  SCREEN_LAST.box = {cx: o[0], cy: o[1], h, w, f: live.f};
  const flip = Math.sign(ex[0] * ey[1] - ex[1] * ey[0]) || 1, rot = Math.atan2(ey[1], ey[0]) - Math.PI / 2;
  p.brush.push();
  p.brush.translate(o[0], o[1]);
  p.brush.rotate(rot);
  p.brush.scale((flip * w) / (SCREEN_ASPECT * h), 1);
  if (h < 36) paintSisterTiny(p, h);
  else paintSister(p, h, live.f, live.wave);
  p.brush.pop();
};

/** Garden hose: tap post, a loose S on the sand, up to his left hand (slack), across to the end in his right hand; spray fan onto the chilli pot P2. */
export const hose = (p: Painter, c: YCam, rHand: Pt | null, lHand: Pt | null, o: {spray?: number; feet?: Pt | null; drop?: boolean; back?: boolean} = {}) => {
  const ground: V3[] = [[-2.2, 0.45, 0.6], [-2.15, 0.02, 0.72], [-1.7, 0.02, 0.95], [-1.1, 0.02, 0.7], [-0.9, 0.02, 0.35], [-0.5, 0.02, 0.25], [-0.3, 0.02, 0.12]];
  const w = (v: V3) => Math.max(1.2, (0.02 * camUnit(c, v)) / 2.2);
  const q = ground.map((v) => camPoint(c, v));
  // draw the visible runs as one smooth line each (a point behind the lens breaks the run)
  let run: Pt[] = [];
  const flush = (i: number) => { if (run.length >= 2) inkLine(p, 2510 + i, run, {closed: false, color: C.hose, weight: w(ground[Math.min(i, ground.length - 1)]), still: true, curve: 0.5}); run = []; };
  q.forEach((v, i) => { if (v) run.push(v); else flush(i); });
  const last = run[run.length - 1];
  flush(20);
  if (last && lHand) inkLine(p, 2531, [last, [lHand[0] - 4, (last[1] + lHand[1]) / 2], lHand], {closed: false, color: C.hose, weight: w([0, 0.4, 0]), still: true, curve: 0.5});
  if (lHand && rHand && !o.back) inkLine(p, 2532, [lHand, [(lHand[0] + rHand[0]) / 2, Math.max(lHand[1], rHand[1]) + 0.12 * camUnit(c, [0, 0.9, 0])], rHand], {closed: false, color: C.hose, weight: w([0, 0.9, 0]), still: true, curve: 0.5});
  const tgt = camPoint(c, [0.62, 1.08, -0.6]), uh = camUnit(c, [0.2, 0.9, -0.3]);
  // the hose end: a short stiff green stub out of the fist, pointing at the target (or hanging when dropped)
  if (rHand) {
    const dir: Pt = o.drop || !tgt ? [0.15, 1] : [tgt[0] - rHand[0], tgt[1] - rHand[1]], dl = Math.hypot(dir[0], dir[1]) || 1, end: Pt = [rHand[0] + (dir[0] / dl) * 0.09 * uh, rHand[1] + (dir[1] / dl) * 0.09 * uh];
    inkLine(p, 2533, [rHand, end], {closed: false, color: C.hose, weight: Math.max(1.4, (0.022 * uh) / 2.2), still: true, curve: 0});
    if (o.drop) { const d = [end, [end[0] + 0.004 * uh, end[1] + 0.06 * uh]] as Pt[]; inkLine(p, 2534, d, {closed: false, color: mixColor(C.spray, '#a9d8ee', 0.4), weight: 0.7, still: true}); }
    if (tgt && !o.drop && (o.spray ?? 1) > 0) {
      const dx = tgt[0] - end[0], dy = tgt[1] - end[1], len = Math.hypot(dx, dy) || 1, n: Pt = [-dy / len, dx / len], fan = 0.16 * uh;
      // a fan of fine arcs (thumb over the opening), droplets along it, a mist where it lands, a sun glint on the near edge
      for (let i = 0; i < 13; i++) {
        const s0 = (i - 6) / 6, e: Pt = [tgt[0] + n[0] * s0 * fan, tgt[1] + n[1] * s0 * fan], mid: Pt = [(end[0] + e[0]) / 2 + n[0] * s0 * fan * 0.25, (end[1] + e[1]) / 2 - fan * 0.22];
        inkLine(p, 2540 + i, [end, mid, e], {closed: false, color: i % 4 === 0 ? '#ffffff' : mixColor(C.spray, '#9fd0ea', (i % 3) * 0.25), weight: i % 4 === 0 ? 1.0 : 0.75, still: true, curve: 0.45});
      }
      for (let i = 0; i < 26; i++) {
        const s0 = (hash(2560 + i) - 0.5) * 2, f = 0.35 + hash(2590 + i) * 0.8, b: Pt = [end[0] + dx * f + n[0] * s0 * fan * f, end[1] + dy * f + n[1] * s0 * fan * f - fan * 0.25 * Math.sin(Math.PI * Math.min(1, f))];
        hardFill(p, 2620 + i, i % 3 ? C.spray : '#ffffff', ell(b[0], b[1], 0.005 * uh + 0.6, 0.005 * uh + 0.6, 6));
      }
      washAt(p, 2552, C.spray, 110, ell(tgt[0], tgt[1], fan * 1.2, fan * 0.5, 12), 0.2, 0.3);
    }
    hardFill(p, 2553, C.hoseShade, ell(end[0], end[1], 0.012 * uh, 0.012 * uh, 8));
  }
};

/** Patchy grass tufts and footprints on the yard sand. */
const ground = (p: Painter, c: YCam) => {
  const q = wp(c, [[-300, 0, -0.5], [300, 0, -0.5], [300, 0, 400], [-300, 0, 400]]);
  if (ok(q)) hardFill(p, 2600, C.sand, q);
  for (let i = 0; i < 26; i++) {
    const x = -5 + ((i * 0.618) % 1) * 10, z = -0.3 + ((i * 0.377) % 1) * 4;
    const g = camPoint(c, [x, 0, z]);
    if (!g) continue;
    const k = camUnit(c, [x, 0, z]);
    hardFill(p, 2610 + i, i % 3 ? C.grass : mixColor(C.grass, C.sandShade, 0.4), ell(g[0], g[1], 0.22 * k, 0.05 * k, 10));
    for (let j = 0; j < 4; j++) { const b = camPoint(c, [x + (j - 1.5) * 0.06, 0.07 + (j % 2) * 0.03, z]); if (b) inkLine(p, 2640 + i * 4 + j, [[g[0] + (j - 1.5) * 0.04 * k, g[1]], b], {closed: false, color: mixColor(C.grass, C.leafDark, 0.3), weight: 0.6, still: true}); }
  }
  // finished grade: sand grain dashes, the damp patch under the pot he waters, footprints and flip-flop prints, fallen petals
  const yd = (u: number, v: number): V3 => [-5 + u * 10, 0, -0.45 + v * 4.4];
  planeDashes(p, c, 2760, yd, {n: 420, col: (i) => tone(C.sand, i % 3 ? 0.1 : -0.12), len: 0.012, w: 0.008});
  planeBlots(p, c, 2930, yd, {n: 40, r: 0.025, col: tone(C.sand, 0.14)});
  const dq = camPoint(c, [0.62, 0.001, -0.42]);
  if (dq) { const k = camUnit(c, [0.62, 0, -0.42]); hardFill(p, 2980, tone(C.sand, 0.14), ell(dq[0], dq[1], 0.2 * k, 0.2 * k * Math.max(0.12, Math.sin(Math.atan2(c.y, Math.hypot(c.x - 0.62, c.z + 0.42)))), 18)); }
  [[-0.35, 0.55], [-0.15, 0.95], [-0.42, 1.4], [-0.2, 1.85], [0.25, 0.6]].forEach(([x, z], i) => { const q = camPoint(c, [x, 0.001, z]); if (q) { const k = camUnit(c, [x, 0, z]); hardFill(p, 2985 + i, tone(C.sand, 0.12), ell(q[0], q[1], 0.05 * k, 0.12 * k * Math.abs(Math.sin(c.pitch ?? 0.15) + 0.25), 10)); } });
  planeBlots(p, c, 2992, (u, v) => [0.6 + u * 1.3, 0.001, -0.48 + v * 0.6], {n: 9, r: 0.02, col: mixColor(C.boug, C.sand, 0.3)});
};

/** The man's watering arms (N14 `hose-water` stand-in authored for the look frames): right hand forward at the waist on the hose end, just
 *  outside the body line, elbow low and back (UT06); left hand at the hip holding the slack. Front-view picture targets; `back` mirrors them. */
export const hoseArms = (g: Pt, u: number, mode: 'water' | 'drop' = 'water') => {
  const S = (side: 'r' | 'l') => shoulderPoint(MAN, g, u, {view: 'front'}, side);
  const R = S('r'), L = S('l'), at = (o: Pt, dx: number, dy: number): Pt => [o[0] + dx * u, o[1] - dy * u];
  return mode === 'water'
    ? {rArm: {via: at(R, -0.07, -0.245), to: at(R, -0.15, -0.39)}, lArm: {via: at(L, 0.06, -0.25), to: at(L, 0.03, -0.47)}}
    : {rArm: {via: at(R, -0.035, -0.255), to: at(R, -0.05, -0.51)}, lArm: {via: at(L, 0.06, -0.25), to: at(L, 0.03, -0.47)}};
};

/** Lived-in props (finished grade): the tap post with its brass tap, a blue plastic bucket, an enamel mug on the plank. */
const tap = (p: Painter, c: YCam) => {
  paintBox(p, c, 2500, {x0: -2.27, x1: -2.13, y0: 0, y1: 0.6, z0: 0.53, z1: 0.67}, mixColor(C.wallShade, '#8a8378', 0.3), {top: -0.1});
  contact(p, c, 2505, [-2.2, 0, 0.6], 0.14, tone(C.sand, 0.25));
  const t0 = camPoint(c, [-2.2, 0.52, 0.53]), t1 = camPoint(c, [-2.2, 0.46, 0.45]);
  if (t0 && t1) inkLine(p, 2506, [t0, t1], {closed: false, color: '#b08a3a', weight: Math.max(1, 0.025 * camUnit(c, [-2.2, 0.5, 0.5])), still: true});
};
const can = (p: Painter, c: YCam) => {
  const at: V3 = [-0.75, 0, -0.22], k = camUnit(c, at), b = camPoint(c, at), t = camPoint(c, [at[0], 0.3, at[2]]);
  if (!b || !t) return;
  contact(p, c, 2700 - 40, at, 0.2, tone(C.sand, 0.25));
  const rt = 0.15 * k, rb = 0.12 * k;
  hardFill(p, 2661, '#2f7fc0', [[t[0] - rt, t[1]], [t[0] + rt, t[1]], [b[0] + rb, b[1]], [b[0] - rb, b[1]]]);
  hardFill(p, 2662, '#24639a', [[t[0] + rt * 0.3, t[1]], [t[0] + rt, t[1]], [b[0] + rb, b[1]], [b[0] + rb * 0.3, b[1]]]);
  hardFill(p, 2663, '#1d4f7c', ell(t[0], t[1], rt, rt * 0.3, 14));
  inkLine(p, 2664, [[t[0] - rt, t[1]], [t[0], t[1] - 0.12 * k], [t[0] + rt, t[1]]], {closed: false, color: '#1d4f7c', weight: 0.8, still: true, curve: 0.6});
};
const mug = (p: Painter, c: YCam) => {
  const at: V3 = [-2.05, 0.95, -0.6], k = camUnit(c, at), b = camPoint(c, at), t = camPoint(c, [at[0], 1.04, at[2]]);
  if (!b || !t) return;
  const r = 0.04 * k;
  hardFill(p, 2670, '#f2efe6', [[t[0] - r, t[1]], [t[0] + r, t[1]], [b[0] + r, b[1]], [b[0] - r, b[1]]]);
  hardFill(p, 2671, '#2f5e8e', ell(t[0], t[1], r, r * 0.3, 12));
  inkLine(p, 2672, [[b[0] + r, t[1] + r * 0.4], [b[0] + r * 1.6, (t[1] + b[1]) / 2], [b[0] + r, b[1] - r * 0.4]], {closed: false, color: '#d8d4ca', weight: 0.8, still: true, curve: 0.6});
};

/** The house side seen in the reverses: neighbours' roofs and trees behind, the wooden house on 0.6 m stilts with blue shutters, terrace,
 *  steps, a plastic chair, a fishing net drying on the terrace rail, a motorbike under the eave (brief set plan). */
const houseSide = (p: Painter, c: YCam, L: YardLight) => {
  const hz = horizonY(c);
  // far trees and a neighbour's roof behind the house
  [[-14, 22, 9, '#5d7f4c'], [-4, 24, 11, '#4f7240'], [8, 23, 10, '#5a7d48'], [16, 20, 8, '#678a52']].forEach(([x, z, h, col], i) => {
    const q = camPoint(c, [x as number, (h as number) * 0.55, z as number]);
    if (!q) return;
    const k = camUnit(c, [x as number, 0, z as number]) * (h as number) * 0.5;
    for (let j = 0; j < 5; j++) hardFill(p, 2800 + i * 6 + j, mixColor(col as string, j % 2 ? C.leafDark : '#7c9a5c', 0.25), ell(q[0] + (j - 2) * k * 0.45, q[1] + (j % 2) * k * 0.2, k * 0.6, k * 0.5, 14));
  });
  void hz;
  // far village tree line (closes the ground before the horizon)
  for (let i = 0; i < 16; i++) { const x = -60 + i * 9, q = camPoint(c, [x, 5, 70]); if (!q) continue; const k = camUnit(c, [x, 0, 70]) * (6 + (i % 3) * 2); hardFill(p, 2810 + i, mixColor(i % 2 ? '#6f8f5c' : '#7f9c68', C.haze, 0.35), ell(q[0], q[1] + k * 0.25, k * 0.75, k * 0.55, 14)); }
  const fb = wp(c, [[-80, 0, 69], [80, 0, 69], [80, 3.2, 69], [-80, 3.2, 69]]);
  if (ok(fb)) hardFill(p, 2828, mixColor('#6f8f5c', C.haze, 0.35), fb);
  // a lean-to shed beside the house (x 5.2 -> 10): planks, corrugated roof, crates and a fish basket by its wall
  paintBox(p, c, 2900, {x0: 5.2, x1: 10, y0: 0, y1: 2.5, z0: 5.6, z1: 8.5}, mixColor(C.houseWood, '#9a8a70', 0.4), {front: 0.05, left: 0.2});
  grainLines(p, c, 2906, [5.2, 0.05, 5.595], [10, 0.05, 5.595], [0, 2.4, 0], {rows: 9, col: tone(mixColor(C.houseWood, '#9a8a70', 0.4), 0.2), w: 0.6, wobble: 0.003});
  const sr = wp(c, [[5.0, 2.5, 5.0], [10.3, 2.5, 5.0], [10.3, 3.1, 8.6], [5.0, 3.1, 8.6]]);
  if (ok(sr)) hardFill(p, 2910, '#9a9c96', sr);
  grainLines(p, c, 2911, [5.0, 2.5, 5.0], [5.0, 3.1, 8.6], [5.3, 0, 0], {rows: 12, col: '#80827c', w: 0.5, wobble: 0});
  paintBox(p, c, 2914, {x0: 7.6, x1: 8.1, y0: 0, y1: 0.35, z0: 5.1, z1: 5.5}, '#c9b04a', {top: -0.08});
  paintBox(p, c, 2917, {x0: 7.65, x1: 8.05, y0: 0.35, y1: 0.7, z0: 5.12, z1: 5.48}, '#4a7ab0', {top: -0.08});
  contact(p, c, 2919, [7.85, 0, 5.3], 0.4, tone(C.sand, 0.25));
  const bk = camPoint(c, [7.3, 0.2, 5.25]);
  if (bk) { const k = camUnit(c, [7.3, 0, 5.25]); hardFill(p, 2921, '#b08a52', ell(bk[0], bk[1], 0.3 * k, 0.2 * k, 14)); grainLines(p, c, 2925, [7.0, 0.05, 5.0], [7.6, 0.05, 5.0], [0, 0.35, 0], {rows: 3, col: '#8a6a3a', w: 0.5, wobble: 0}); }
  paintBox(p, c, 2830, {x0: 6, x1: 13, y0: 0, y1: 3.2, z0: 12, z1: 18}, '#b9a68a', {}, {});
  const nr = wp(c, [[5.5, 3.2, 11.5], [13.5, 3.2, 11.5], [13.5, 4.6, 15], [5.5, 4.6, 15]]);
  if (ok(nr)) hardFill(p, 2836, '#a85a3a', nr);
  // house: stilts, floor, front wall with shutters and door, roof overhang
  const wood = mixColor(C.houseWood, '#ffd8a0', 0.08 * L.warm);
  for (let i = 0; i < 6; i++) paintBox(p, c, 2840 + i * 3, {x0: -5 + i * 2 - 0.08, x1: -5 + i * 2 + 0.08, y0: 0, y1: 0.6, z0: 5.9, z1: 6.06}, tone(wood, 0.3));
  paintBox(p, c, 2860, {x0: -5, x1: 5, y0: 0.6, y1: 3.4, z0: 6.0, z1: 10}, wood, {front: 0, left: 0.2, right: 0.25});
  grainLines(p, c, 2866, [-5, 0.6, 5.995], [5, 0.6, 5.995], [0, 2.8, 0], {rows: 11, col: tone(wood, 0.2), w: 0.6, wobble: 0.003});
  [[-3.6, -2.2], [1.6, 3.0]].forEach(([x0, x1], i) => {
    const win = wp(c, [[x0, 1.5, 5.99], [x1, 1.5, 5.99], [x1, 2.7, 5.99], [x0, 2.7, 5.99]]);
    if (ok(win)) hardFill(p, 2880 + i * 4, '#2b2622', win);
    const sh = (a: number, b: number, s: number) => { const q = wp(c, [[a, 1.45, 5.98], [b, 1.45, 5.98], [b, 2.75, 5.98], [a, 2.75, 5.98]]); if (ok(q)) hardFill(p, s, C.shutter, q); grainLines(p, c, s + 1, [a, 1.5, 5.975], [a, 2.7, 5.975], [b - a, 0, 0], {rows: 3, col: tone(C.shutter, 0.2), w: 0.5, wobble: 0.002}); };
    sh(x0 - 0.62, x0, 2881 + i * 4 + 20); sh(x1, x1 + 0.62, 2882 + i * 4 + 30);
  });
  const door = wp(c, [[-0.6, 0.6, 5.99], [0.6, 0.6, 5.99], [0.6, 2.6, 5.99], [-0.6, 2.6, 5.99]]);
  if (ok(door)) hardFill(p, 2920, tone(wood, 0.35), door);
  const roof = wp(c, [[-5.6, 3.4, 4.0], [5.6, 3.4, 4.0], [5.6, 4.4, 8.0], [-5.6, 4.4, 8.0]]);
  if (ok(roof)) hardFill(p, 2922, C.roof, roof);
  const under = wp(c, [[-5.6, 3.4, 4.0], [5.6, 3.4, 4.0], [5.6, 3.36, 6.0], [-5.6, 3.36, 6.0]]);
  if (ok(under)) hardFill(p, 2923, tone(C.roof, 0.35), under);
  grainLines(p, c, 2924, [-5.6, 3.4, 4.0], [-5.6, 4.4, 8.0], [11.2, 0, 0], {rows: 18, col: tone(C.roof, 0.18), w: 0.5, wobble: 0});
  // terrace z 4.2 -> 6.0 at y 0.6, posts, rail with the drying net, three steps, a plastic chair
  paintBox(p, c, 2950, {x0: -5, x1: 5, y0: 0.45, y1: 0.6, z0: 4.2, z1: 6.0}, C.terrace, {top: -0.04, front: 0.25});
  [-4.9, -1.5, 1.5, 4.9].forEach((x, i) => paintBox(p, c, 2956 + i * 3, {x0: x - 0.06, x1: x + 0.06, y0: 0.6, y1: 3.4, z0: 4.24, z1: 4.36}, tone(wood, 0.15)));
  paintBox(p, c, 2970, {x0: -5, x1: -1.5, y0: 1.3, y1: 1.38, z0: 4.24, z1: 4.32}, tone(wood, 0.1));
  const net = wp(c, [[-4.6, 1.34, 4.25], [-2.0, 1.34, 4.25], [-2.2, 0.75, 4.25], [-4.3, 0.7, 4.25]]);
  if (ok(net)) { glaze(p, 2972, C.net, 150, net, {bleed: 0.05, texture: 0}); grainLines(p, c, 2973, [-4.5, 0.72, 4.24], [-2.1, 0.75, 4.24], [0, 0.6, 0], {rows: 6, col: tone(C.net, 0.25), w: 0.5, wobble: 0.01}); }
  [0, 1, 2].forEach((i) => paintBox(p, c, 2980 + i * 3, {x0: -0.7, x1: 0.7, y0: 0, y1: 0.45 - i * 0.15, z0: 4.2 - (i + 1) * 0.3, z1: 4.2 - i * 0.3}, tone(C.terrace, 0.05), {top: -0.06}));
  paintBox(p, c, 2990, {x0: 2.2, x1: 2.7, y0: 0.6, y1: 1.05, z0: 4.6, z1: 5.1}, '#d8d0b8', {top: -0.06});
  paintBox(p, c, 2994, {x0: 2.2, x1: 2.7, y0: 1.05, y1: 1.45, z0: 5.05, z1: 5.12}, '#d8d0b8');
  // motorbike under the eave (simple side shape)
  const mb = null as Pt | null; // motorbike left out of the reverse (it read as a prop at his head)
  if (mb) { const k = camUnit(c, [8.6, 0, 4.9]); [-0.6, 0.6].forEach((dx, i) => inkLine(p, 2996 + i, ell(mb[0] + dx * k, mb[1] - 0.3 * k, 0.3 * k, 0.3 * k, 16), {color: '#2a2a2a', weight: 1.2, still: true})); hardFill(p, 2998, '#b83a30', [[mb[0] - 0.5 * k, mb[1] - 0.45 * k], [mb[0] + 0.4 * k, mb[1] - 0.5 * k], [mb[0] + 0.55 * k, mb[1] - 0.85 * k], [mb[0] - 0.3 * k, mb[1] - 0.8 * k]]); }
};

/** Depth slots for shot layers (Boss W5): 'far' after the sea and boats, 'p1' after the right palm (z -4.5), 'p2' after the left palm CP1 (z -2.5),
 *  'plank' after the wall and plank props, before the man (marks between the wall and him), 'near' after the man and the hose (front-of-wall marks: the signal line's near part). Look frames pass none. */
export type YardLayer = 'far' | 'p1' | 'p2' | 'plank' | 'near';
export type YardOpts = {spray?: number; light?: YardLight; boats?: boolean | ((p: Painter, c: YCam) => void);
  man?: {face?: string; view?: 'back' | 'front'; facing?: [number, number]; arms?: 'water' | 'drop'; faceState?: Partial<FaceState>; headYaw?: number;
    /** Shot arms (edu17/hose.ts `armsBlend`) instead of the look's `hoseArms`. */ fig?: Record<string, unknown>; at?: V3; t?: number} | false;
  /** Shot hose (edu17/hose.ts `paintHoseRig`) instead of the look's `hose`; gets MAN's anchors. */
  hoseFn?: (a: ReturnType<typeof paintFigureAt>) => void;
  layer?: (p: Painter, c: YCam, slot: YardLayer) => void;
  /** Live phone screen (shots, W7): the sister portrait at frame `f`, P07 wave when `wave`; absent = the look frames' static screen. */
  screen?: SisterLive};
/** The yard as the camera sees it, back to front; returns MAN's anchors for the measures. A camera beyond the wall (z < -0.7, the reverses)
 *  paints the house side and puts the man behind the wall and the plank props. */
export const paintYard = (p: Painter, c: YCam, o: YardOpts = {}) => {
  const L = o.light ?? {warm: 0}, reverse = c.z < -0.7;
  sky(p, c, L);
  if (reverse) ground(p, c);
  if (!reverse) {
    seaAndFar(p, c, L);
    if (typeof o.boats === 'function') o.boats(p, c);
    else if (o.boats !== false) {
      const boats: [BoatKind, V3, number][] = [['trawler', [40, -1.5, -260], 100], ['longtailY', [-2, -1.5, -85], 75], ['cabin', [6, -1.5, -60], 70], ['longtailR', [-9, -1.5, -42], 110]];
      boats.forEach(([k, at, hd], i) => paintBoat(p, c, 3000 + i * 60, k, at, hd));
    }
  } else houseSide(p, c, L);
  beach(p, c);
  o.layer?.(p, c, 'far');
  if (!reverse) { palm(p, c, 2700, [4.2, -0.6, -4.5], [0.05, -0.18], 6.5); o.layer?.(p, c, 'p1'); palm(p, c, 2730, [-3.8, -0.4, -2.5], [-0.08, -0.2], 7.2); o.layer?.(p, c, 'p2'); }
  if (!reverse) { wall(p, c, L); ground(p, c); }
  const plank: Item[] = [
    {at: [-1.65, 0.95, -0.6], draw: (q, cc) => pot(q, cc, 2100, [-1.65, 0.95, -0.6], 0.11, 0.16, C.clay, {h: 0.25, r: 0.16, col: '#5f9a48'})},
    {at: [0.62, 0.95, -0.6], draw: (q, cc) => pot(q, cc, 2130, [0.62, 0.95, -0.6], 0.12, 0.17, C.clay, {h: 0.3, r: 0.17, col: C.leaf, flowers: '#d8382c'})},
    {at: [1.0, 0.95, -0.6], draw: (q, cc) => pot(q, cc, 2160, [1.0, 0.95, -0.6], 0.07, 0.14, C.tin, {h: 0.22, r: 0.12, col: '#6f8f4a', flowers: '#e9d6f0'})},
    {at: [-0.4, 0.95, -0.6], draw: (q, cc) => phone(q, cc, {screen: !reverse, live: o.screen})},
    {at: [-2.05, 0.95, -0.6], draw: (q, cc) => mug(q, cc)},
  ];
  const yardItems: Item[] = [
    {at: [1.3, 0, -0.3], draw: bougainvillea},
    {at: [-2.6, 0, -0.2], draw: jarAndAloe},
    {at: [-0.75, 0, -0.22], draw: (q, cc) => can(q, cc)},
    {at: [-2.2, 0, 0.6], draw: (q, cc) => tap(q, cc)},
  ];
  if (!reverse) paintSorted(p, c, [...yardItems, ...plank]);
  else paintSorted(p, c, yardItems);
  let a: ReturnType<typeof paintFigureAt> = null;
  if (!reverse) o.layer?.(p, c, 'plank');
  if (o.man !== false) {
    const at = o.man?.at ?? M0, g = camPoint(c, at), u = camUnit(c, at);
    const arms = o.man?.fig ?? (g ? hoseArms(g, u, o.man?.arms ?? 'water') : {});
    const placing = o.man?.facing ? {facing: o.man.facing} : {view: o.man?.view ?? 'back'};
    a = paintFigureAt(p, c, MAN, {at, ...placing, pose: 'P01', face: (o.man?.face ?? 'neutral') as 'neutral', faceState: o.man?.faceState, t: o.man?.t ?? 0.4, shadow: {op: 70},
      fig: {...arms, ...(o.man?.headYaw !== undefined ? {headYaw: o.man.headYaw} : {})}});
  }
  if (o.hoseFn) o.hoseFn(a);
  else hose(p, c, a?.rHand ?? null, a?.lHand ?? null, {spray: o.spray, drop: o.man ? o.man.arms === 'drop' : false, back: !o.man || (!o.man.facing && (o.man.view ?? 'back') === 'back')});
  if (reverse) { wall(p, c, L); paintSorted(p, c, plank); }
  o.layer?.(p, c, 'near');
  return a;
};

export {INK};

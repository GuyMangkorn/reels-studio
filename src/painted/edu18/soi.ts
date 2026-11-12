import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// N6 `new: SET-SOI18` (brief EDU-EP18-BRIEF-R1.4 "Set plan - SET-SOI18"; metres). Origin O on the soi surface directly under the centre of the awning's lip
// (the drip line), x = 0 at the shop door's centre line; +x right along the shopfront as seen from the lane, +y up, +z out into the lane (toward the main
// cameras). Method reuse: the EP14 bus-stop tin roof, drip curtain, puddle ripples and splash crowns (second use, kit-promotion candidates at W8).
// Contents: dusk sky, the across-lane wall and gate, the mango tree, the lamp pole with the cool LED head, the shopfront (left bay lit under a half-up
// shutter, right bay shut with a textless sign), crates, the covered motorbike, the step, the tin awning with its drip curtain, the lane and the puddle K01.
// Pure function of the camera and the AMBIENT clock `t` (seconds): curtain, ripples and crowns run on it (R06).
export const SOI = {
  shopZ: -2.6, lipY: 2.35, lipZ: 0, awnY: 2.7, stepY: 0.1, stepFaceZ: -0.05, wallZ: 5.2, wallY: 2.2,
  puddle: {c: [0.85, 0.38] as Pt, rx: 0.6, rz: 0.36, y: 0.008},
  glow: [-1.8, 1.4, -2.4] as V3, lamp: [-4.2, 5.0, 4.6] as V3, pitch: 0.076, W: [0.55, 0.1, -0.12] as V3, WALL_GATE: [-1.5, 0.5] as Pt,
} as const;
export const SC = {
  skyTop: '#46515e', skyLow: '#7b8790', wall: '#8a8a7c', wallDark: '#5e6258', gate: '#343c40', tree: '#3d5a3a', treeDark: '#2c4430', lane: '#5a5e60', laneWet: '#4a4f52',
  concrete: '#8b8c86', step: '#9a9a92', shopWall: '#b7ad98', shutter: '#7d8a90', shutterDk: '#5f6c72', glowWarm: '#f2b866', tin: '#8f9ba3', tinDk: '#6e7a82', post: '#4a5258',
  crate: '#4f7f9a', bike: '#6c7378', rain: '#d6e4ec', crown: '#e4f0f4', puddle: '#6a7a82',
} as const;

const horizonOf = (c: YCam) => camPoint(c, [c.x + Math.sin(c.yaw) * 30000, c.y, c.z - Math.cos(c.yaw) * 30000])?.[1] ?? c.hy;
const onScreen = (c: YCam, v: V3, m = 160) => { const q = camPoint(c, v); return !!q && q[0] > -m && q[0] < 1080 + m && q[1] > -m && q[1] < 1920 + m; };

const paintSky = (p: Painter, c: YCam) => {
  const hz = Math.min(1920, Math.max(60, horizonOf(c)));
  paintSkyBands(p, {from: SC.skyTop, to: SC.skyLow, horizon: hz, width: 1080, bands: 9, style: 'flat', seed: 50100});
  if (hz < 1920) hardFill(p, 50120, SC.lane, [[-20, hz - 2], [1100, hz - 2], [1100, 1940], [-20, 1940]]);
};

const paintAcross = (p: Painter, c: YCam) => {
  const z = SOI.wallZ;
  // mango tree crown behind the wall (y 2.4-5.5), a few blobs
  [[-0.8, 3.7, 1.3], [0.3, 4.5, 1.1], [1.3, 3.8, 1.2], [-1.9, 3.2, 0.9], [0.4, 3.2, 1.2]].forEach(([x, y, r], i) => {
    const q = camPoint(c, [x, y, z + 1.5]);
    if (q) washAt(p, 50200 + i, i % 2 ? SC.tree : SC.treeDark, 235, ell(q[0], q[1], r * camUnit(c, [x, y, z + 1.5]), r * 0.85 * camUnit(c, [x, y, z + 1.5]), 18), 0.15, 0.3);
  });
  wFill(p, c, 50210, SC.wall, qz(z, -9, 9, 0, SOI.wallY));
  wWash(p, c, 50211, SC.wallDark, 120, qz(z, -9, 9, 0, 0.5), 0.2, 0.4); // damp base
  wFill(p, c, 50212, SC.gate, qz(z - 0.02, SOI.WALL_GATE[0], SOI.WALL_GATE[1], 0, 2.0)); // dark steel gate
  for (let i = 0; i < 9; i++) wInk(p, c, 50220 + i, [[SOI.WALL_GATE[0] + 0.2 * i + 0.1, 0.1, z - 0.03], [SOI.WALL_GATE[0] + 0.2 * i + 0.1, 1.9, z - 0.03]], {color: '#232a2d', closed: false, weight: 0.9});
  // lamp pole and the cool LED head (a glow disc)
  const base = camPoint(c, [-5.0, 0, 4.8]), head = camPoint(c, SOI.lamp);
  if (base && head) {
    inkLine(p, 50240, [base, head], {color: '#2f3538', weight: 3, closed: false, curve: 0});
    const u = camUnit(c, SOI.lamp);
    washAt(p, 50241, '#dfe9f2', 90, ell(head[0], head[1], 0.45 * u, 0.45 * u, 22), 0.3, 0.1);
    washAt(p, 50242, '#ffffff', 230, ell(head[0], head[1], 0.12 * u, 0.12 * u, 14), 0.1, 0.1);
  }
};

const paintShop = (p: Painter, c: YCam, t: number) => {
  const z = SOI.shopZ;
  wFill(p, c, 50300, SC.shopWall, qz(z, -4.2, 4.2, 0, 3.3));
  // left bay: the lit shop under the half-up shutter (opening y 0..1.9), shelves and a fridge glow
  wFill(p, c, 50310, '#3a3128', qz(z + 0.02, -4.0, 0, 0, 1.9));
  wWash(p, c, 50311, SC.glowWarm, 235, qz(z + 0.03, -3.9, -0.1, 0.1, 1.85), 0.1, 0.2);
  for (let i = 0; i < 4; i++) wWash(p, c, 50312 + i, mixColor('#8a6a46', '#e8d9b0', 0.3 + 0.1 * i), 200, qz(z + 0.04, -3.7 + i * 0.9, -3.0 + i * 0.9, 0.5 + 0.35 * (i % 3), 0.68 + 0.35 * (i % 3)), 0.1, 0.3);
  wWash(p, c, 50320, '#cfe6ec', 200, qz(z + 0.04, -0.9, -0.3, 0.1, 1.5), 0.1, 0.2); // fridge glow
  wFill(p, c, 50330, SC.shutter, qz(z + 0.1, -4.0, 0, 1.9, 2.5)); // shutter rolled up above the opening
  for (let i = 0; i < 7; i++) wInk(p, c, 50331 + i, [[-4.0, 1.93 + 0.09 * i, z + 0.11], [0, 1.93 + 0.09 * i, z + 0.11]], {color: SC.shutterDk, closed: false, weight: 0.8});
  // right bay: shutter down, a textless sign board above (y 2.9)
  wFill(p, c, 50340, SC.shutter, qz(z + 0.1, 0.1, 4.0, 0, 2.5));
  for (let i = 0; i < 12; i++) wInk(p, c, 50341 + i, [[0.1, 0.2 * i + 0.1, z + 0.11], [4.0, 0.2 * i + 0.1, z + 0.11]], {color: SC.shutterDk, closed: false, weight: 0.7});
  wFill(p, c, 50360, '#d6c9a0', qz(z + 0.12, 0.5, 3.6, 2.55, 3.1));
  wInk(p, c, 50361, qz(z + 0.13, 0.5, 3.6, 2.55, 3.1), {color: '#5c5440', weight: 1.1});
  // the lit shop's warm spill on the step and the lane (breathing a little: fridge flicker)
  const k = 0.92 + 0.08 * Math.sin(t * 5.1);
  wWash(p, c, 50370, SC.glowWarm, 90 * k, qy(SOI.stepY + 0.004, -3.9, -0.2, z + 0.2, -0.1), 0.4, 0.3);
};

const paintStepAndLane = (p: Painter, c: YCam) => {
  wFill(p, c, 50400, SC.lane, qy(0, -12, 12, -0.05, 14));
  wWash(p, c, 50401, SC.laneWet, 150, qy(0.002, -12, 12, 0.5, 14), 0.2, 0.5);
  wFill(p, c, 50402, SC.step, qy(SOI.stepY, -4.4, 4.4, SOI.shopZ, SOI.stepFaceZ));
  wFill(p, c, 50403, mixColor(SC.step, '#2b211c', 0.22), qz(SOI.stepFaceZ, -4.4, 4.4, 0, SOI.stepY));
  wInk(p, c, 50404, [[-4.4, SOI.stepY, SOI.stepFaceZ], [4.4, SOI.stepY, SOI.stepFaceZ]], {color: '#4a4a44', closed: false, weight: 1});
  wWash(p, c, 50405, '#c9d5da', 90, qy(SOI.stepY + 0.003, -4.2, 4.2, -0.5, -0.06), 0.3, 0.4); // wet step edge
};

const paintProps = (p: Painter, c: YCam) => {
  // crates of drinking water (stack at (-1.4, 0.10, -2.2)) and the covered motorbike (-2.6, 0.10, -1.4) side-on
  [[0, 0], [0.42, 0], [0.21, 0.28]].forEach(([dx, dy], i) => paintBox(p, c, 50500 + i * 12, {x0: -1.6 + dx, x1: -1.2 + dx, y0: 0.1 + dy, y1: 0.36 + dy, z0: -2.45, z1: -2.0}, SC.crate, {}, {ink: true}));
  paintBox(p, c, 50540, {x0: -3.3, x1: -1.9, y0: 0.1, y1: 0.78, z0: -1.65, z1: -1.2}, SC.bike, {top: -0.12}, {ink: true});
  paintBox(p, c, 50552, {x0: -2.4, x1: -2.0, y0: 0.78, y1: 1.05, z0: -1.55, z1: -1.3}, SC.bike, {}, {ink: true});
  [-3.15, -2.05].forEach((x, i) => { const q = camPoint(c, [x, 0.17, -1.42]); if (q) washAt(p, 50560 + i, '#23282b', 245, ell(q[0], q[1], 0.17 * camUnit(c, [x, 0.17, -1.42]), 0.17 * camUnit(c, [x, 0.17, -1.42]), 16), 0.05, 0.1); });
};

/** Awning: sloped tin from the shopfront (y 2.70, z -2.6) to the lip (y 2.35, z 0), corrugated every 7.6 cm, two posts at x +-3.6 (z -0.15). */
const paintAwning = (p: Painter, c: YCam) => {
  const L = SOI.lipY, A = SOI.awnY, z0 = SOI.shopZ;
  const sheet = (x0: number, x1: number): V3[] => [[x0, A, z0], [x1, A, z0], [x1, L, 0], [x0, L, 0]];
  // seen from below the underside shows; from above (camera above the lip) the top
  wFill(p, c, 50600, c.y < L ? SC.tinDk : SC.tin, sheet(-4.2, 4.2));
  const n = 10;
  for (let i = 0; i <= 8 * n; i += 1) {
    const x = -4 + i * SOI.pitch * (8 / (8 * n)) * 0 - 0; void x;
  }
  for (let i = 0; i < 106; i++) { // corrugation ridges
    const x = -4 + i * SOI.pitch;
    if (!onScreen(c, [x, L, 0], 100)) continue;
    wInk(p, c, 50610 + i, [[x, A, z0], [x, L, 0]], {color: mixColor(SC.tinDk, '#1c2326', 0.2), closed: false, weight: 0.8});
  }
  // lip edge (fascia 6 cm) and the posts
  wFill(p, c, 50620, SC.tinDk, qz(0.001, -4.2, 4.2, L - 0.06, L));
  [-3.6, 3.6].forEach((x, i) => wFill(p, c, 50630 + i, SC.post, qz(-0.15, x - 0.03, x + 0.03, 0, L)));
};

export type DripOpts = {t: number; density?: number; span?: [number, number]};
/** Drip curtain off the lip: one stream per corrugation valley landing at z 0.02-0.12, drops falling on the ambient clock, splash crowns where it lands. */
export const paintCurtain = (p: Painter, c: YCam, o: DripOpts) => {
  const [x0, x1] = o.span ?? [-4, 4], step = SOI.pitch / (o.density ?? 1);
  const streak = (w = 1.1) => p.inkStill(50700, 'pen', mixColor(SC.rain, '#ffffff', 0.45), w);
  let i = 0;
  for (let x = x0; x < x1; x += step, i++) {
    const zl = 0.02 + 0.1 * hash(50710 + i);
    if (!onScreen(c, [x, SOI.lipY, zl], 60)) continue;
    const ph = (o.t * (1.8 + 1.4 * hash(50720 + i)) + hash(50730 + i)) % 1, len = 0.18 + 0.2 * hash(50740 + i);
    const y1 = SOI.lipY - 0.04 - ph * (SOI.lipY - 0.04), a = camPoint(c, [x, Math.min(SOI.lipY - 0.03, y1 + len), zl]), b = camPoint(c, [x, Math.max(0, y1), zl]);
    const uw = camUnit(c, [x, SOI.lipY, zl]), wpx = Math.min(36, Math.max(1.1, uw * 0.0025)); // a drop 2.5 mm across: close lenses (SH19-SH21) see it as a real streak
    if (a && b && Math.abs(b[1] - a[1]) > 1) { streak(wpx); p.brush.line(a[0], a[1], b[0], b[1]); }
    // the continuous stream core: a thin pale line from the lip down (every valley carries one)
    const s0 = camPoint(c, [x, SOI.lipY - 0.03, zl]), s1 = camPoint(c, [x, 0.01, zl]);
    if (s0 && s1 && i % 2 === 0) washAt(p, 50800 + i, SC.rain, 55, [[s0[0] - Math.max(1.2, wpx * 0.5), s0[1]], [s0[0] + Math.max(1.2, wpx * 0.5), s0[1]], [s1[0] + Math.max(1.2, wpx * 0.5), s1[1]], [s1[0] - Math.max(1.2, wpx * 0.5), s1[1]]], 0, 0);
  }
  for (let j = 0; j < 36; j++) { // splash crowns where the curtain lands
    const sx = x0 + hash(50900 + j) * (x1 - x0), q = camPoint(c, [sx, 0.012, 0.07]);
    if (!q) continue;
    const u = camUnit(c, [sx, 0, 0.07]), k = (o.t * 2.2 + hash(50950 + j)) % 1, r = (0.015 + 0.03 * k) * u;
    inkLine(p, 51000 + j, [[q[0] - r, q[1]], [q[0] - r * 0.4, q[1] - r * 0.9], [q[0] + r * 0.4, q[1] - r * 0.9], [q[0] + r, q[1]]], {color: SC.crown, weight: 0.9, closed: false, still: true});
  }
};

/** Puddle K01: centre (0.85, 0, 0.38), rx 0.60, rz 0.36, 8 mm deep, surface y 0.008; ripple rings, the shop glow as one warm streak. */
export const ripples = (t: number, n = 12, seed = 51100) => Array.from({length: n}, (_, i) => {
  const ph = (t * 1.4 + hash(seed + i * 3)) % 1, a = hash(seed + i * 3 + 1) * 6.283, rr = Math.sqrt(hash(seed + i * 3 + 2)) * 0.85;
  return {x: SOI.puddle.c[0] + Math.cos(a) * rr * SOI.puddle.rx, z: SOI.puddle.c[1] + Math.sin(a) * rr * SOI.puddle.rz, r: 0.01 + ph * 0.09, a: 1 - ph};
});
/** Ripples across the near footprint of the puddle (SH20 looks down at its far edge: x 0.4-0.95, z 0-0.3), 34 rings, each growing over the ambient clock. */
const richRipples = (t: number, n = 34, seed = 51600) => Array.from({length: n}, (_, i) => {
  const ph = (t * 1.4 + hash(seed + i * 3)) % 1, x = 0.4 + hash(seed + i * 3 + 1) * 0.55, z = 0.02 + hash(seed + i * 3 + 2) * 0.3;
  return {x, z, r: 0.01 + ph * 0.08, a: 1 - ph};
}).filter((r) => ((r.x - SOI.puddle.c[0]) / (SOI.puddle.rx - 0.1)) ** 2 + ((r.z - SOI.puddle.c[1]) / (SOI.puddle.rz - 0.08)) ** 2 < 1);
export const paintPuddle = (p: Painter, c: YCam, t: number, o: {cold?: number; rich?: boolean} = {}) => {
  const P = SOI.puddle, ring = (cx: number, cz: number, rx: number, rz: number, n = 30): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI, q = camPoint(c, [cx + rx * Math.cos(a), P.y, cz + rz * Math.sin(a)]); if (q) out.push(q); }
    return out;
  };
  const lake = ring(P.c[0], P.c[1], P.rx, P.rz, 36);
  if (lake.length < 3) return;
  washAt(p, 51200, SC.puddle, 255, lake, 0.05, 0.1);
  if (o.rich) washAt(p, 51300, '#9db4be', 70, lake, 0.2, 0.1); // sky-light sheen under the rings
  const streak = ring(P.c[0] - 0.15, P.c[1] - 0.12, 0.09, 0.2, 18);
  if (streak.length >= 3 && !o.rich) washAt(p, 51201, SC.glowWarm, 120 * (1 - (o.cold ?? 0)), streak, 0.3, 0.1);
  (o.rich ? richRipples(t) : ripples(t)).forEach((r, i) => { const q = ring(r.x, r.z, r.r, r.r * 0.8, 14); if (q.length >= 3) inkLine(p, 51210 + i, q, {weight: o.rich ? 1.8 : 1.0, color: mixColor(o.rich ? '#eef8fa' : '#c9dde4', SC.puddle, 1 - r.a * 0.9), curve: 0.2, still: true}); });
  if (o.rich) { // F-B20: the puddle as water: a sky-light sheen, the warm streak broken into ripple-cut dashes, cool lamp glints, and crowns where the curtain lands on it
    for (let i = 0; i < 9; i++) { const q = ring(P.c[0] - 0.15 + 0.03 * Math.sin(i * 1.9 + t * 3), P.c[1] - 0.36 + i * 0.04, 0.035 + 0.04 * hash(51310 + i), 0.008, 10); if (q.length >= 3) washAt(p, 51320 + i, SC.glowWarm, 150, q, 0.3, 0.1); }
    for (let i = 0; i < 7; i++) { const q = ring(P.c[0] + 0.15 + 0.07 * i - 0.2, P.c[1] - 0.12 + 0.05 * i, 0.008, 0.006, 8); if (q.length >= 3) washAt(p, 51340 + i, '#f2fbff', 230, q, 0.1, 0); }
    for (let i = 0; i < 16; i++) { // crowns: small arcs standing on the surface where drops land
      const a = hash(51360 + i) * 6.283, rr = Math.sqrt(hash(51380 + i)) * 0.9, x = P.c[0] + Math.cos(a) * rr * P.rx, z = P.c[1] + Math.sin(a) * rr * P.rz, k = (t * 2.2 + hash(51400 + i)) % 1, r = 0.012 + 0.03 * k;
      const b = camPoint(c, [x, P.y, z]), u = camUnit(c, [x, P.y, z]);
      if (b) inkLine(p, 51420 + i, [[b[0] - r * u, b[1]], [b[0] - r * u * 0.4, b[1] - r * u * 0.9], [b[0] + r * u * 0.4, b[1] - r * u * 0.9], [b[0] + r * u, b[1]]], {color: SC.crown, weight: 1.6, closed: false, still: true});
    }
  }
};

export type SoiOpts = {t: number; glow?: number; puddle?: boolean; curtain?: boolean; cold?: number; richPuddle?: boolean};
/** The whole soi: sky, across-lane, shopfront, step and lane, props, puddle, then (after the people) the shot calls `paintCurtain` and the rain. */
export const paintSoi = (p: Painter, c: YCam, o: SoiOpts) => {
  paintSky(p, c);
  paintAcross(p, c);
  paintShop(p, c, o.t);
  paintStepAndLane(p, c);
  paintProps(p, c);
  if (o.puddle !== false) paintPuddle(p, c, o.t, {cold: o.cold, rich: o.richPuddle});
  paintAwning(p, c);
};
void qx; void paintBox; void ell;

import {ell, inkLine, washAt} from '../kit/draw';
import {qy, wWash} from '../kit/world';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camDepth, camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {paintDrop14, bounds, dropOutline, type DropState} from '../kit/water-drop';
import {lookCam} from './cams';

// N7 `new: macro world M` (brief EDU-EP18-BRIEF-R1.4 "Set plan - macro world M and drops"; EP05 macro.ts k-scaling method). UNITS: set metres
// `sm`, k = 405 sm per real metre (1 real mm = 0.405 sm), so the 1.62 m woman keeps her rig height 1.62 sm = 4.0 mm real. Origin O_M = H (1.02, 0.22,
// 0.50) m; axes as H (+x right, +y up, +z toward the lane = toward the main cameras; the default macro camera looks toward -z, at the shop).
// Ground (concrete) y -89.1; puddle surface y -85.9; puddle centre (-68.9, -85.9, -48.6), radius 243 x 146 sm. The kit camera, near 0.3 and lens values
// work unchanged in sm. Contents: the card at infinity (shop glow bokeh, lamp disc, dark lane; yaw/pitch parallax only), the slow rain (seeded buns
// beyond 20 sm as wash discs, each hanging then drifting down at 3-9 sm/s), the ground and the puddle lake (look-down shots), and the bun painter
// for D0 / D1 / D2 with the ambient wobble. Pure functions of the camera and the AMBIENT clock `t` (seconds).

export const K_SM = 405;
export const SM_PER_MM = 0.405;
export const O_M: V3 = [1.02, 0.22, 0.5]; // in H metres
export const GROUND_Y = -89.1;
export const PUDDLE = {y: -85.9, c: [-68.9, -48.6] as Pt, rx: 243, rz: 146};
/** Bun drop: 6.2 mm wide x 4.35 mm tall (flat 0.47), bottom face at -0.8808 sm from its centre (brief: 0.875, R2.0 rounding of 4.3 mm). */
export const BUN: DropState = {kind: 'bun', size: 6.2, flat: 0.47};
export const BUN_SM = (() => { const b = bounds(dropOutline(BUN)); return {w: b.w * SM_PER_MM, h: b.h * SM_PER_MM, bottom: b.y0 * SM_PER_MM, top: b.y1 * SM_PER_MM}; })();
export const WOBBLE_HZ = 1.6;

export const MC = {lane: '#2b3034', laneHi: '#3d464e', sky: '#4a5662', shop: '#f2b866', lamp: '#dfe9f2', wet: '#9fb7c2', ground: '#3a3f42', puddle: '#47545c'} as const;

/** The default macro camera (look-at form of the storyboard lines). */
export const macroCam = lookCam;

/** Wobble of a bun on the ambient clock: width and flatness oscillate a few percent (axis ratio 0.70 +- 0.04, brief). */
export const wobble = (t: number, phase = 0): {size: number; flat: number} => {
  const s = Math.sin(2 * Math.PI * WOBBLE_HZ * t + phase);
  return {size: 6.2 * (1 + 0.03 * s), flat: 0.47 - 0.05 * s};
};

/** Paints one hero bun (D0 / D1 / D2) with its centre at `at` (sm). Returns the screen centre and the px width, or null behind the lens. */
export const paintBun = (p: Painter, c: YCam, at: V3, o: {t: number; phase?: number; seed?: number; glow?: boolean} = {t: 0}): {g: Pt; widthPx: number; heightPx: number; bottom: number} | null => {
  const g = camPoint(c, at);
  if (!g) return null;
  const u = camUnit(c, at) * SM_PER_MM, w = wobble(o.t, o.phase ?? 0), st: DropState = {...BUN, ...w};
  paintDrop14(p, g, u, st, {seed: o.seed ?? 40000, light: -1});
  const b = bounds(dropOutline(st));
  if (o.glow !== false) {
    // the shop's warm glow inverted inside the water (brief: "the inverted shop glowing inside")
    washAt(p, (o.seed ?? 40000) + 40, MC.shop, 150, ell(g[0] + 0.06 * b.w * u, g[1] + 0.2 * b.h * u, 0.26 * b.w * u, 0.12 * b.h * u, 22), 0.2, 0.1);
    washAt(p, (o.seed ?? 40000) + 41, mixColor(MC.shop, '#ffffff', 0.35), 140, ell(g[0] + 0.02 * b.w * u, g[1] + 0.23 * b.h * u, 0.11 * b.w * u, 0.05 * b.h * u, 16), 0.2, 0.1);
  }
  return {g, widthPx: b.w * u, heightPx: b.h * u, bottom: g[1] - b.y0 * u};
};

// ---------------------------------------------------------------- backdrop card (infinity)
/** A direction (yaw, elevation in degrees from the +z-to-shop axis) projected as a point at infinity: yaw/pitch parallax only. */
const farPoint = (c: YCam, az: number, el: number): Pt | null => camPoint(c, [c.x + Math.sin(az) * 5000 * Math.cos(el), c.y + Math.sin(el) * 5000, c.z - Math.cos(az) * 5000 * Math.cos(el)], 0.3);
const BOKEH: {az: number; el: number; r: number; color: string; a: number}[] = [
  {az: -0.55, el: 0.02, r: 190, color: MC.shop, a: 95}, {az: -0.2, el: 0.12, r: 130, color: MC.shop, a: 80}, {az: 0.12, el: -0.01, r: 220, color: MC.shop, a: 100},
  {az: 0.4, el: 0.08, r: 110, color: MC.shop, a: 70}, {az: -0.8, el: 0.2, r: 90, color: '#f6d6a0', a: 60}, {az: 0.62, el: -0.03, r: 150, color: '#e9a85a', a: 70},
];
/** Backdrop card: dark lane below the horizon, a cool dusk band above it, the shop glow as large warm bokeh and the LED lamp as a cool disc. */
export const paintMacroBackdrop = (p: Painter, c: YCam, o: {glow?: number; haze?: number} = {}) => {
  const hz = farPoint(c, 0, 0), hy0 = hz ? hz[1] : c.hy, hy = hy0 + (o.haze ?? 0);
  washAt(p, 40100, MC.lane, 255, [[-60, -60], [1140, -60], [1140, 1980], [-60, 1980]], 0, 0);
  washAt(p, 40101, MC.sky, 200, [[-60, -60], [1140, -60], [1140, hy - 20], [-60, hy + 30]], 0.3, 0.2);
  if (o.haze) { // F-B03: the far ground is a soft haze, not a hard band: the sky wash steps down into the lane over 200 px
    [[60, 150], [110, 105], [160, 70], [210, 38]].forEach(([d, a], i) => washAt(p, 40140 + i, MC.sky, a, [[-60, hy - 20], [1140, hy - 20], [1140, hy + d], [-60, hy + d]], 0.5, 0.4));
  } else washAt(p, 40102, MC.laneHi, 150, [[-60, hy], [1140, hy - 30], [1140, hy + 260], [-60, hy + 300]], 0.4, 0.3);
  const k = o.glow ?? 1;
  BOKEH.forEach((b, i) => { const q = farPoint(c, b.az, b.el); if (q) washAt(p, 40110 + i, b.color, b.a * k, ell(q[0], q[1], b.r * c.f / 1000, b.r * c.f / 1000, 26), 0.35, 0.1); });
  const lamp = farPoint(c, -0.95, 0.16);
  if (lamp) washAt(p, 40130, MC.lamp, 70, ell(lamp[0], lamp[1], 80 * c.f / 1000, 80 * c.f / 1000, 22), 0.3, 0.1);
};

// ---------------------------------------------------------------- slow rain
export type RainDrop = {x: number; y: number; z: number; mm: number; v: number};
/** Seeded slow-rain drops in a periodic box around the camera: 1-3 mm (0.4-1.2 sm), falling `v` sm/f (smaller ones slower). */
export const slowRain = (n: number, seed = 41000): RainDrop[] => Array.from({length: n}, (_, i) => {
  const mm = 1 + 2 * hash(seed + i * 4);
  return {x: (hash(seed + i * 4 + 1) - 0.5) * 120, y: (hash(seed + i * 4 + 2) - 0.5) * 260, z: -(hash(seed + i * 4 + 3) * 62) + 3, mm, v: 0.3 * Math.sqrt(mm / 5.5)};
});
const wrap = (v: number, c: number, span: number) => c + ((((v - c + span / 2) % span) + span) % span) - span / 2;
/** Where each slow drop is at ambient time `t` (s): a periodic lattice about the camera, so the rain never runs out and needs no event clock. */
export const rainAt = (c: YCam, t: number, drops = DEFAULT_RAIN): (RainDrop & {at: V3})[] =>
  drops.map((d) => ({...d, at: [wrap(d.x, c.x, 120), wrap(d.y - d.v * t * 30, c.y, 260), wrap(d.z, c.z - 31, 62)] as V3}));
export const DEFAULT_RAIN = slowRain(70);
/** Paints the slow rain: near drops (< 20 sm deep) as small buns with a highlight, far ones as soft wash discs only (DF-20261031-paint-seed-defer). */
export const paintSlowRain = (p: Painter, c: YCam, t: number, o: {drops?: RainDrop[]; near?: number; alpha?: number; skip?: (d: {at: V3}) => boolean} = {}) => {
  const a = o.alpha ?? 1;
  rainAt(c, t, o.drops ?? DEFAULT_RAIN).forEach((d, i) => {
    if (o.skip?.(d)) return;
    const q = camPoint(c, d.at);
    if (!q || q[0] < -40 || q[0] > 1120 || q[1] < -40 || q[1] > 1960) return;
    const depth = camDepth(c, d.at), u = camUnit(c, d.at) * SM_PER_MM * d.mm, r = Math.max(2.2, u * 0.5);
    if (depth > (o.near ?? 20)) { washAt(p, 41500 + i, MC.wet, 70 * a, ell(q[0], q[1], r * 1.1, r * 1.1, 10), 0.2, 0); return; }
    washAt(p, 41500 + i, MC.wet, 105 * a, ell(q[0], q[1], r, r * 0.88, 14), 0, 0);
    washAt(p, 41700 + i, '#ffffff', 190 * a, ell(q[0] - r * 0.25, q[1] - r * 0.32, r * 0.22, r * 0.16, 8), 0, 0);
    if (r > 6) inkLine(p, 41900 + i, ell(q[0], q[1], r, r * 0.88, 16), {weight: Math.max(0.6, r / 28), color: '#c9dde4', curve: 0.2, still: true});
  });
};

// ---------------------------------------------------------------- ground and puddle lake (look-down)
const ringPts = (c: YCam, cx: number, cz: number, rx: number, rz: number, y: number, n = 36): Pt[] => {
  const w: V3[] = [];
  for (let i = 0; i < n; i++) { const th = (i / n) * 2 * Math.PI; w.push([cx + rx * Math.cos(th), y, cz + rz * Math.sin(th)]); }
  return camPoly(c, w, 0.3); // clipped at the near plane (F-B12: a lake under the lens must still fill the picture)
};
/** Ripple rings on the lake: seeded centres, each ring grows over 24 frames of AMBIENT time (loops), fading as it widens. */
export const lakeRipples = (t: number, n = 14, seed = 42000) => Array.from({length: n}, (_, i) => {
  const k = hash(seed + i * 3), ph = (t * 1.1 + hash(seed + i * 3 + 1)) % 1;
  return {x: PUDDLE.c[0] + (hash(seed + i * 3 + 2) * 2 - 1) * PUDDLE.rx * 0.8 + k * 0, z: PUDDLE.c[1] + (hash(seed + i * 3 + 1) * 2 - 1) * PUDDLE.rz * 0.8, r: 3 + ph * 22, a: 1 - ph};
});
/** Concrete ground plane and the puddle lake (surface y -85.9) for the look-down shots: a dark wet ground, the lake with a warm streak and ripple rings. */
export const paintLake = (p: Painter, c: YCam, t: number, o: {grade?: number} = {}) => {
  const ground = [[-3000, -3000], [3000, -3000], [3000, 3000], [-3000, 3000]].map(([x, z]) => camPoint(c, [x, GROUND_Y, z], 0.3)).filter((q): q is Pt => !!q);
  if (ground.length >= 3 && (c.pitch ?? 0) < -0.5) washAt(p, 42100, MC.ground, 255, [[-60, -60], [1140, -60], [1140, 1980], [-60, 1980]], 0, 0);
  const lake = ringPts(c, PUDDLE.c[0], PUDDLE.c[1], PUDDLE.rx, PUDDLE.rz, PUDDLE.y, 44);
  if (lake.length >= 3) {
    washAt(p, 42101, MC.puddle, 255, lake, 0.05, 0.1);
    const streak = ringPts(c, PUDDLE.c[0] + 90, PUDDLE.c[1] + 20, PUDDLE.rx * 0.07, PUDDLE.rz * 0.8, PUDDLE.y, 20);
    if (streak.length >= 3) washAt(p, 42102, MC.shop, 70 * (1 - (o.grade ?? 0)), streak, 0.3, 0.1);
    lakeRipples(t).forEach((r, i) => { const q = ringPts(c, r.x, r.z, r.r, r.r * 0.8, PUDDLE.y, 16); if (q.length >= 3) inkLine(p, 42200 + i, q, {weight: 1.1, color: mixColor('#c9dde4', MC.puddle, 1 - r.a * 0.8), curve: 0.2, still: true}); });
  }
};

/** F-B12 lake detail seen from above: a broad warm shop-reflection streak broken by ripples, cool lamp glints, and crowns where the slow drops land (smaller with distance). */
export const paintLakeDetail = (p: Painter, c: YCam, t: number) => {
  const pt = (x: number, z: number): Pt | null => camPoint(c, [x, PUDDLE.y, z], 0.3);
  // the lake reads brighter than the ground (cold sky reflection), with the shop's reflection as a broken warm streak of ripple-cut dashes and cool lamp glints
  const sky = ringPts(c, PUDDLE.c[0], PUDDLE.c[1], PUDDLE.rx, PUDDLE.rz, PUDDLE.y, 44);
  if (sky.length >= 3) washAt(p, 42300, '#7f9aa6', 95, sky, 0.1, 0.1);
  for (let i = 0; i < 11; i++) {
    const z = PUDDLE.c[1] - PUDDLE.rz * 0.8 + i * (PUDDLE.rz * 1.6 / 10), x = PUDDLE.c[0] + 60 + 14 * Math.sin(i * 1.7 + t * 2), w = 2.5 + 4 * hash(42320 + i), q = ringPts(c, x, z, w, 2.4, PUDDLE.y, 12);
    if (q.length >= 3) washAt(p, 42310 + i, MC.shop, 150, q, 0.3, 0.1);
  }
  for (let i = 0; i < 6; i++) { const q = ringPts(c, PUDDLE.c[0] - 100 + 30 * i, PUDDLE.c[1] - 60 + 25 * i, 0.9, 0.9, PUDDLE.y, 8); if (q.length >= 3) washAt(p, 42330 + i, MC.lamp, 190, q, 0.1, 0); }
  // landings: ring pairs where far drops reach the water, widening with the ambient clock
  for (let i = 0; i < 26; i++) {
    const ph = (t * 1.3 + hash(42310 + i)) % 1, x = PUDDLE.c[0] + (hash(42340 + i) * 2 - 1) * PUDDLE.rx * 0.85, z = PUDDLE.c[1] + (hash(42370 + i) * 2 - 1) * PUDDLE.rz * 0.85;
    [0.6, 1].forEach((k, j) => { const r = (2 + ph * 20) * k, q = ringPts(c, x, z, r, r * 0.8, PUDDLE.y, 14); if (q.length >= 3) inkLine(p, 42400 + i * 2 + j, q, {weight: 1.4, color: mixColor('#e0eef2', MC.puddle, 1 - (1 - ph) * 0.85), curve: 0.2, still: true}); });
    void pt;
  }
};

// ---------------------------------------------------------------- full world
export type MacroWorld = {t: number; look?: 'level' | 'down'; rain?: boolean; lake?: boolean; glow?: number; haze?: number};
/** Backdrop, optional lake, then the slow rain (far to near is by depth inside `paintSlowRain`). The shot draws drops and people after it. */
export const paintMacro = (p: Painter, c: YCam, w: MacroWorld) => {
  paintMacroBackdrop(p, c, {glow: w.glow, haze: w.haze});
  if (w.lake || w.look === 'down') paintLake(p, c, w.t);
  if (w.rain !== false) paintSlowRain(p, c, w.t);
};

/** A flat water plane at world height `y` (the hypothetical `Mh` puddle, SH15): a wide wash, a cold-able warm streak and ripple rings from far drops only. */
export const paintWaterPlane = (p: Painter, c: YCam, y: number, t: number, o: {cold?: number; reflect?: number} = {}) => {
  wWash(p, c, 42400, MC.puddle, 255, qy(y, -900, 900, -900, 600), 0.02, 0.05);
  wWash(p, c, 42401, '#8fb0c0', 80, qy(y, -300, 300, -400, 80), 0.1, 0.1); // cold sky reflection: the water reads lighter than the dark ground
  wWash(p, c, 42402, MC.shop, 90 * (1 - (o.cold ?? 0)), qy(y, -22, 22, -400, -60), 0.3, 0.1);
  if (o.reflect) wWash(p, c, 42403, '#dfeaf0', 50 * Math.min(1, o.reflect), qy(y, -1.2 - 2.2 * o.reflect, 1.2 + 2.2 * o.reflect, -1.2 - 2.2 * o.reflect, 1.2 + 2.2 * o.reflect), 0.6, 0.5); // the falling drop's reflection grows as it nears
  for (let i = 0; i < 18; i++) {
    const cx = (hash(42420 + i) - 0.5) * 320, cz = -140 + hash(42430 + i) * 130;
    if (Math.hypot(cx, cz) < 30) continue; // no ring under the mosquito (B-P3)
    const ph = (t * 1.1 + hash(42410 + i)) % 1, r = 4 + ph * 20;
    [0.62, 1].forEach((k, j) => {
      const q: Pt[] = [];
      for (let m = 0; m < 16; m++) { const a = (m / 16) * 2 * Math.PI, v = camPoint(c, [cx + r * k * Math.cos(a), y, cz + r * k * 0.8 * Math.sin(a)], 0.3); if (v) q.push(v); }
      if (q.length >= 3) inkLine(p, 42440 + i * 2 + j, q, {weight: 1.3, color: mixColor('#e0eef2', MC.puddle, 1 - (1 - ph) * 0.85), curve: 0.2, still: true});
    });
  }
};

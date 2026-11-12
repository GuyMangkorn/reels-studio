import {ell, inkLine, washAt} from '../kit/draw';
import {qy, wWash} from '../kit/world';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camDepth, camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {paintDrop14, bounds, dropOutline, type DropState} from '../kit/water-drop';
import {lookCam} from './cams';
import {gapsOf, paintRing, paintStreak} from './ripple';

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
/** Pass 5 (F5-B02, D5-02): the bun squeezed by `sq` (screen-height factor delta, negative = lower): height x (1 + sq), width x (1 - 0.5 sq) so the volume holds within +-2 %.
 * Solved on the bun's own `flat` (the outline stays the bun shape); the bottom face stays where it was (the top gives, the face is pinned). */
export const squeezeBun = (st: DropState, sq: number): DropState => {
  const h0 = bounds(dropOutline(st)).h, size = st.size * (1 - 0.5 * sq), target = h0 * (1 + sq);
  let lo = 0.05, hi = 1.2;
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (bounds(dropOutline({...st, size, flat: mid})).h > target) lo = mid; else hi = mid; } // the outline's height falls as `flat` rises
  return {...st, size, flat: (lo + hi) / 2};
};

export const paintBun = (p: Painter, c: YCam, at: V3, o: {t: number; phase?: number; seed?: number; glow?: boolean; up?: {maxBottom: number}; squeeze?: number} = {t: 0}): {g: Pt; widthPx: number; heightPx: number; bottom: number} | null => {
  let g = camPoint(c, at);
  if (!g) return null;
  if (o.up) return paintBunUp(p, c, at, {...o, maxBottom: o.up.maxBottom});
  const u = camUnit(c, at) * SM_PER_MM, w = wobble(o.t, o.phase ?? 0);
  let st: DropState = {...BUN, ...w};
  if (o.squeeze) { // bottom face pinned: g moves by the change of the outline's lowest point
    const y0 = bounds(dropOutline(st)).y0;
    st = squeezeBun(st, o.squeeze);
    g = [g[0], g[1] + (bounds(dropOutline(st)).y0 - y0) * u];
  }
  paintDrop14(p, g, u, st, {seed: o.seed ?? 40000, light: -1});
  const b = bounds(dropOutline(st));
  if (o.glow !== false) {
    // the shop's warm glow inverted inside the water (brief: "the inverted shop glowing inside")
    washAt(p, (o.seed ?? 40000) + 40, MC.shop, 150, ell(g[0] + 0.06 * b.w * u, g[1] + 0.2 * b.h * u, 0.26 * b.w * u, 0.12 * b.h * u, 22), 0.2, 0.1);
    washAt(p, (o.seed ?? 40000) + 41, mixColor(MC.shop, '#ffffff', 0.35), 140, ell(g[0] + 0.02 * b.w * u, g[1] + 0.23 * b.h * u, 0.11 * b.w * u, 0.05 * b.h * u, 16), 0.2, 0.1);
  }
  return {g, widthPx: b.w * u, heightPx: b.h * u, bottom: g[1] - b.y0 * u};
};

/** F2-B05 (SH05 only): the bun drawn from its 3D shape under the up-pitch. The bottom face is the projected rim ring (r 1.255 sm at y_c - 0.875) filled as water with the
 * inverted shop glow inside it and the rim highlight on its near edge; the dome's silhouette is the projected widest ring plus the top point behind it. The ring's
 * own foreshortening under the 61 deg look would drop the near edge to y ~1020 (over her hands); Film's hard check is a lowest pixel <= `maxBottom` (870 at +0,
 * 880 at +25), so the vertical semi-axis of the face is capped to meet it (the picture reads as the drop seen from a lower angle than the true 61 deg). */
const paintBunUp = (p: Painter, c: YCam, at: V3, o: {t: number; phase?: number; seed?: number; glow?: boolean; maxBottom: number}): {g: Pt; widthPx: number; heightPx: number; bottom: number} | null => {
  const s = o.seed ?? 40000, w = wobble(o.t, o.phase ?? 0), k = w.size / 6.2, R = 1.255 * k, fy = at[1] - 0.875;
  const ring = Array.from({length: 72}, (_, i) => camPoint(c, [at[0] + R * Math.cos((i / 72) * 2 * Math.PI), fy, at[2] + R * Math.sin((i / 72) * 2 * Math.PI)], 0.3)).filter((q): q is Pt => !!q);
  const fc = camPoint(c, [at[0], fy, at[2]], 0.3), top = camPoint(c, [at[0], at[1] + BUN_SM.top * k, at[2]], 0.3);
  if (ring.length < 8 || !fc || !top) return null;
  const xs = ring.map((q) => q[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), hw = (x1 - x0) / 2, cx = (x0 + x1) / 2, bottom = fc[1];
  const vTrue = (Math.max(...ring.map((q) => q[1])) - Math.min(...ring.map((q) => q[1]))) / 2, v = Math.min(vTrue, Math.max(20, o.maxBottom - bottom));
  const dome = Math.max(10, bottom - top[1]);
  const half = (rx: number, ry: number, a0: number, a1: number, n: number, ox = 0): Pt[] => Array.from({length: n + 1}, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + ox + rx * Math.cos(a), bottom - ry * Math.sin(a)] as Pt; });
  const face = ell(cx, bottom, hw, v, 48), outline = [...half(hw, dome, 0, Math.PI, 28), ...half(hw, v, Math.PI, 2 * Math.PI, 28).slice(1, -1)];
  const L = hw * 2;
  washAt(p, s, '#a9cfe0', 0.35 * 255, outline, 0, 0);
  washAt(p, s + 1, '#5d8796', 110, ell(cx, bottom + v * 0.05, hw * 0.96, v * 0.92, 40), 0.1, 0.05); // the flat face seen from beneath: darker water
  washAt(p, s + 2, '#b4d4d8', 170, ell(cx, bottom, hw * 0.78, v * 0.74, 36), 0.15, 0.05);
  if (o.glow !== false) { // the inverted shop glow inside the bottom-face ellipse
    washAt(p, s + 40, MC.shop, 150, ell(cx + 0.06 * hw, bottom + 0.08 * v, hw * 0.42, v * 0.34, 22), 0.25, 0.1);
    washAt(p, s + 41, mixColor(MC.shop, '#ffffff', 0.35), 140, ell(cx + 0.02 * hw, bottom + 0.1 * v, hw * 0.18, v * 0.14, 16), 0.2, 0.1);
  }
  washAt(p, s + 3, '#bfe6f2', 200, outline.map(([x, y]): Pt => [x, y]), 0, 0);
  washAt(p, s + 4, '#a9cfe0', 0.35 * 255, outline.map(([x, y]): Pt => [cx + (x - cx) * 0.965, bottom + (y - bottom) * 0.9 - (y < bottom ? 0 : 0)]), 0, 0); // inner water over the cyan edge band
  inkLine(p, s + 5, [...half(hw * 0.97, v * 0.97, Math.PI * 1.06, Math.PI * 1.94, 24)].map(([x, y]): Pt => [x, 2 * bottom - y]), {weight: Math.max(1.6, L / 220), color: '#ffffff', closed: false, curve: 0.2, still: true}); // rim highlight on the near (lower, toward the lens) edge
  inkLine(p, s + 6, outline, {weight: Math.max(1, L / 260), color: '#4f8fa6', curve: 0.1});
  inkLine(p, s + 7, face, {weight: Math.max(1, L / 400), color: '#d7ecef', curve: 0.2, still: true});
  washAt(p, s + 8, '#ffffff', 230, ell(cx - hw * 0.3, bottom - dome * 0.55, hw * 0.16, dome * 0.14, 14, -0.4), 0, 0);
  return {g: fc, widthPx: L, heightPx: dome + v, bottom: bottom + v};
};

// ---------------------------------------------------------------- backdrop card (infinity)
/** A direction (yaw, elevation in degrees from the +z-to-shop axis) projected as a point at infinity: yaw/pitch parallax only. */
const farPoint = (c: YCam, az: number, el: number): Pt | null => camPoint(c, [c.x + Math.sin(az) * 5000 * Math.cos(el), c.y + Math.sin(el) * 5000, c.z - Math.cos(az) * 5000 * Math.cos(el)], 0.3);
const BOKEH: {az: number; el: number; r: number; color: string; a: number}[] = [
  {az: -0.55, el: 0.02, r: 190, color: MC.shop, a: 95}, {az: -0.2, el: 0.12, r: 130, color: MC.shop, a: 80}, {az: 0.12, el: -0.01, r: 220, color: MC.shop, a: 100},
  {az: 0.4, el: 0.08, r: 110, color: MC.shop, a: 70}, {az: -0.8, el: 0.2, r: 90, color: '#f6d6a0', a: 60}, {az: 0.62, el: -0.03, r: 150, color: '#e9a85a', a: 70},
];
// ---- F4-B09 (D4-09, recorded cheat): screen-space streaming layers, constant speed, no easing. N near motes, G speed guide, F far layer (px per frame).
export const STREAM_F = 8, STREAM_G = 24;
const STREAM_PERIOD = 2400; // far layer wrap (frame 1920 + margins)
const streamWrap = (q: Pt, up: number): Pt => [q[0], ((((q[1] - up + 400) % STREAM_PERIOD) + STREAM_PERIOD) % STREAM_PERIOD) - 400];
/** N near motes: 9 suspended mist motes at Dl depth 4-8 sm: size 20-60 px, speed 38-75 px/f (nearer = bigger and faster); wrap below the frame bottom to above the top. */
export const STREAM_N = Array.from({length: 9}, (_, i) => {
  const d = hash(52900 + i * 3), side = i % 2 === 0 ? -1 : 1;
  const x = side < 0 ? 40 + hash(52901 + i * 3) * 250 : 790 + hash(52901 + i * 3) * 250; // the edge margins, clear of the bun
  return {x, v: 38 + 37 * d, r: (20 + 40 * d) / 2, y0: ((i * 0.618 + hash(52902 + i * 3) * 0.2) % 1) * 2120 - 100};
});
const NY = 1920 + 200; // wrap span: from 100 px under the bottom to 100 px above the top
/** Mote `i` centre y (px) at stream frame `L`. */
export const streamNY = (i: number, L: number) => 1920 + 100 - ((((STREAM_N[i].y0 + 100 + STREAM_N[i].v * L) % NY) + NY) % NY);
/** G speed guide: 3 cream far drops at x 900 +- 20, 600 px apart, 24 px/f; centre y (px) of drop `i` at `L`. */
export const streamGY = (i: number, L: number) => 1700 - 600 * i - STREAM_G * L + (1700 - 600 * i - STREAM_G * L < -120 ? 2160 : 0);
export const streamGX = (i: number) => 900 + [-20, 15, 5][i];
export const paintStreamMotes = (p: Painter, L: number, o: {guide?: boolean} = {}) => {
  STREAM_N.forEach((m, i) => {
    const y = streamNY(i, L);
    [[0.9, 26], [0.6, 51], [0.3, 89]].forEach(([k, a], j) => washAt(p, 52950 + i * 4 + j, '#dbe8ee', a, ell(m.x, y + k * m.v, m.r, m.r, 14), 0.3, 0)); // trail below: 3 copies at 0.9/0.6/0.3 x the step
    washAt(p, 52950 + i * 4 + 3, '#e8f1f5', 140, ell(m.x, y, m.r, m.r, 18), 0.4, 0.05);
  });
  if (o.guide === false) return;
  [0, 1, 2].forEach((i) => {
    const x = streamGX(i), y = streamGY(i, L);
    washAt(p, 53000 + i * 2, '#f3e6c4', 70, [[x - 6, y], [x + 6, y], [x + 3, y + 60], [x - 3, y + 60]], 0.2, 0); // 60 px trail
    washAt(p, 53001 + i * 2, '#f6ecd0', 215, ell(x, y, 12, 12, 16), 0.2, 0.05);
  });
};

/** Backdrop card: dark lane below the horizon, a cool dusk band above it, the shop glow as large warm bokeh and the LED lamp as a cool disc. */
export const paintMacroBackdrop = (p: Painter, c: YCam, o: {glow?: number; haze?: number; stream?: {L: number; speed?: number}} = {}) => {
  const hz = farPoint(c, 0, 0), hy0 = hz ? hz[1] : c.hy, up = o.stream ? (o.stream.speed ?? STREAM_F) * o.stream.L : 0, hy = hy0 + (o.haze ?? 0) - up;
  washAt(p, 40100, MC.lane, 255, [[-60, -60], [1140, -60], [1140, 1980], [-60, 1980]], 0, 0);
  washAt(p, 40101, MC.sky, 200, [[-60, -60], [1140, -60], [1140, hy - 20], [-60, hy + 30]], 0.3, 0.2);
  if (o.haze || o.stream) { // F-B03 (and F4-B09: the streaming horizon is the same 200 px gradient, scrolling up with the far layer): the far ground is a soft haze, not a hard band: the sky wash steps down into the lane over 200 px
    [[60, 150], [110, 105], [160, 70], [210, 38], [260, 20], [310, 10]].forEach(([d, a], i) => washAt(p, 40140 + i, MC.sky, a, [[-60, hy - 20], [1140, hy - 20], [1140, hy + d], [-60, hy + d]], 0.5, 0.4));
  } else washAt(p, 40102, MC.laneHi, 150, [[-60, hy], [1140, hy - 30], [1140, hy + 260], [-60, hy + 300]], 0.4, 0.3);
  const k = o.glow ?? 1;
  BOKEH.forEach((b, i) => { const q0 = farPoint(c, b.az, b.el), q = q0 && o.stream ? streamWrap(q0, up) : q0; if (q) washAt(p, 40110 + i, b.color, b.a * k, ell(q[0], q[1], b.r * c.f / 1000, b.r * c.f / 1000, 26), 0.35, 0.1); });
  const lamp0 = farPoint(c, -0.95, 0.16), lamp = lamp0 && o.stream ? streamWrap(lamp0, up) : lamp0;
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
    inkLine(p.layer(0.5, 42190), 42190, lake, {weight: 3, color: '#cfe0e6', curve: 0.2, still: true}); // F2-B12 (3): the wet edge, so the pale lake reads as a puddle against the ground
    lakeRipples(t).forEach((r, i) => paintRing(p, c, PUDDLE.y, {x: r.x, z: r.z, r: r.r, a: r.a * 0.8}, {seed: 42200 + i, weight: 1.6}));
  }
};

/** F-B12 lake detail seen from above (F2-B12): one continuous warm shop-reflection streak cut by ripple gaps, cool lamp glints, and ripple rings lighter than the water. */
export const paintLakeDetail = (p: Painter, c: YCam, t: number) => {
  const sky = ringPts(c, PUDDLE.c[0], PUDDLE.c[1], PUDDLE.rx, PUDDLE.rz, PUDDLE.y, 44);
  if (sky.length >= 3) washAt(p, 42300, '#7f9aa6', 95, sky, 0.1, 0.1);
  const z0 = PUDDLE.c[1] - 0.8 * PUDDLE.rz, z1 = PUDDLE.c[1] + 0.8 * PUDDLE.rz;
  paintStreak(p, c, {
    seed: 42310, y: PUDDLE.y, z0, z1, xOf: (z) => PUDDLE.c[0] + 60 + 4 * Math.sin(0.08 * z + 2 * t), hw: (u) => 6 - 3 * u, color: MC.shop, alpha: 0.35 * 255, bleed: 0.25,
    gaps: gapsOf(z0, z1, 10, 1.0, 42350), core: {u0: 0, u1: 0.4, hw: 1, color: '#f3d9a0', alpha: 0.5 * 255},
  });
  for (let i = 0; i < 6; i++) { const q = ringPts(c, PUDDLE.c[0] - 100 + 30 * i, PUDDLE.c[1] - 60 + 25 * i, 0.9, 0.9, PUDDLE.y, 8); if (q.length >= 3) washAt(p, 42330 + i, MC.lamp, 190, q, 0.1, 0); }
  // landings: rings where far drops reach the water, widening with the ambient clock, always lighter than the water and fading out
  for (let i = 0; i < 26; i++) {
    const ph = (t * 1.3 + hash(42310 + i)) % 1, x = PUDDLE.c[0] + (hash(42340 + i) * 2 - 1) * PUDDLE.rx * 0.85, z = PUDDLE.c[1] + (hash(42370 + i) * 2 - 1) * PUDDLE.rz * 0.85;
    [0.6, 1].forEach((k, j) => paintRing(p, c, PUDDLE.y, {x, z, r: (2 + ph * 20) * k, a: (1 - ph) * 0.85}, {seed: 42400 + i * 2 + j, weight: 1.6}));
  }
};

// ---------------------------------------------------------------- full world
export type MacroWorld = {t: number; stream?: {L: number; speed?: number}; look?: 'level' | 'down'; rain?: boolean; lake?: boolean; glow?: number; haze?: number};
/** Backdrop, optional lake, then the slow rain (far to near is by depth inside `paintSlowRain`). The shot draws drops and people after it. */
export const paintMacro = (p: Painter, c: YCam, w: MacroWorld) => {
  paintMacroBackdrop(p, c, {glow: w.glow, haze: w.haze, stream: w.stream});
  if (w.lake || w.look === 'down') paintLake(p, c, w.t);
  if (w.rain !== false) paintSlowRain(p, c, w.t);
};

/** A flat water plane at world height `y` (the hypothetical `Mh` puddle, SH15): a wide wash, a cold-able warm streak and ripple rings from far drops only.
 * F2-B15: no reflection quad (the shot draws the mirrored drop and mosquito); 6-10 far-drop rings 40-120 px across, lighter than the water, none within
 * 150 px of the point under the mosquito (B-P3), and the sky-light sheen is an ellipse so no long straight edge shows on the water. */
export const paintWaterPlane = (p: Painter, c: YCam, y: number, t: number, o: {cold?: number} = {}) => {
  wWash(p, c, 42400, MC.puddle, 255, qy(y, -900, 900, -900, 600), 0.02, 0.05);
  const sheen = camPoly(c, Array.from({length: 40}, (_, i): V3 => [330 * Math.cos((i / 40) * 2 * Math.PI), y, -100 + 260 * Math.sin((i / 40) * 2 * Math.PI)]), 0.3);
  if (sheen.length >= 3) washAt(p, 42401, '#8fb0c0', 80, sheen, 0.5, 0.3); // cold sky reflection: the water reads lighter than the dark ground
  const warm = camPoly(c, Array.from({length: 28}, (_, i): V3 => [22 * Math.cos((i / 28) * 2 * Math.PI), y, -230 + 170 * Math.sin((i / 28) * 2 * Math.PI)]), 0.3);
  if (warm.length >= 3) washAt(p, 42402, MC.shop, 90 * (1 - (o.cold ?? 0)), warm, 0.5, 0.2);
  const under = camPoint(c, [0, y, 0], 0.3);
  let n = 0;
  for (let i = 0; i < 300 && n < 9; i++) { // candidates at three scales about the point under the mosquito: the falling camera sees a wide, then a close lake
    const sc = [1, 0.25, 0.06][i % 3], at: V3 = [(hash(42420 + i) - 0.5) * 220 * sc, y, (hash(42430 + i) - 0.6) * 200 * sc], q = camPoint(c, at, 0.3);
    if (!q || q[0] < 60 || q[0] > 1020 || q[1] < 120 || q[1] > 1850 || (under && Math.hypot(q[0] - under[0], q[1] - under[1]) < 150)) continue;
    const ph = (t * 1.1 + hash(42410 + i)) % 1, px = 40 + 80 * ph, r = px / 2 / camUnit(c, at, 0.3);
    paintRing(p, c, y, {x: at[0], z: at[2], r, a: (1 - ph) * 0.85}, {seed: 42440 + n * 2, weight: 1.5});
    n++;
  }
};

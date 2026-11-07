import {ell, inkLine, solid, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintPuff} from './scenes';

// EDU-EP05 W5.2 effects and props: `new: shrink-pop` (N7), `new: warmth-puff` emitter (N8), `new: breadcrumb` (N5), `new: scale-bars` (N9).
// Pure functions of shot-local frame / state; Editor places them. Look-frame level code, kit intake at delivery.

const ease = (k: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, k)));
const smooth = (a: number, b: number, v: number) => { const k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

// ---- N7 shrink-pop (S01-B01-SH03 L 55-71): the card scales to ~0 about the touch point over 8 f (ease-in), a puff ring and sparkles run
// L 59-71 and peak on L 71 (the cut). `local` is the shot-local frame.
export const POP = {shrink: [55, 63] as [number, number], ring: [59, 71] as [number, number]};
/** Card scale about the touch point at a local frame (1 before, ~0 after the 8 f ease-in). */
export const shrinkScale = (local: number) => 1 - ease(((local - POP.shrink[0]) / (POP.shrink[1] - POP.shrink[0])) ** 1.6) * 0.995;
/** Scales picture point `q` about the touch `c` by the shrink (apply to the card's anchors and draw scale). */
export const shrinkAbout = (q: Pt, c: Pt, local: number): Pt => { const s = shrinkScale(local); return [c[0] + (q[0] - c[0]) * s, c[1] + (q[1] - c[1]) * s]; };
/** Puff ring progress 0..1 (1 = the peak on the cut). */
export const popPeak = (local: number) => smooth(POP.ring[0], POP.ring[1], local);
/** Puff ring + sparkle ticks centred on `c` (px), `r` px at the peak. */
export const paintShrinkPop = (p: Painter, c: Pt, local: number, r = 150, seed = 11000) => {
  const k = popPeak(local);
  if (k <= 0) return;
  const rr = r * (0.25 + 0.75 * ease(k)), a = 0.6 + 0.4 * k;
  washAt(p, seed, '#fff1cf', 150 * a, ell(c[0], c[1], rr * 1.15, rr * 1.15, 28), 0.3, 0.1);
  const ring = [...ell(c[0], c[1], rr, rr, 32), ...ell(c[0], c[1], rr * 0.72, rr * 0.72, 32).reverse()];
  washAt(p, seed + 1, '#ffffff', 200 * a, ring, 0.15, 0.05);
  for (let i = 0; i < 7; i++) {
    const th = (i / 7) * 2 * Math.PI + hash(seed + i) * 0.6, d = rr * (1.05 + 0.35 * hash(seed + 20 + i)) * (0.6 + 0.4 * k), len = r * 0.07 * (0.6 + hash(seed + 40 + i));
    const x = c[0] + Math.cos(th) * d, y = c[1] + Math.sin(th) * d;
    solid(p, seed + 60 + i, '#fff1cf', [[x, y - len], [x + len * 0.25, y], [x, y + len], [x - len * 0.25, y]], 2);
    solid(p, seed + 80 + i, '#fff1cf', [[x - len, y], [x, y - len * 0.25], [x + len, y], [x, y + len * 0.25]], 2);
  }
};
/** Cut-match check: distance between the pop centre in SH03 and the matching frame's centre in SH04 (sheet: 33 px, limit 40). */
export const popCutDelta = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// ---- N8 warmth puffs (S01-B04-SH02): world-space puffs emitted from torso/head anchors, drifting up and away from the lit side, growing and
// fading, one squeezed out between the hands (narrowed sideways by the fingers, then it re-inflates).
export type PuffSpec = {anchor: Pt; r: number; drift: Pt; period: number; life: number; phase: number; squeeze?: boolean};
export type PuffNow = {x: number; y: number; rx: number; ry: number; a: number; seed: number};
/** Live puffs of one emitter at time `t` s (px for `u` px per sm... the caller scales `r` and `drift` to px). */
export const puffsOf = (e: PuffSpec, t: number, seed = 12000): PuffNow[] => {
  const out: PuffNow[] = [];
  const n0 = Math.floor((t - e.phase) / e.period);
  for (let k = n0; k > n0 - Math.ceil(e.life / e.period) - 1; k--) {
    const age = t - e.phase - k * e.period;
    if (age < 0 || age > e.life) continue;
    const f = age / e.life, grow = 0.45 + 0.55 * ease(f), a = smooth(0, 0.18, f) * (1 - smooth(0.6, 1, f));
    out.push({x: e.anchor[0] + e.drift[0] * f, y: e.anchor[1] + e.drift[1] * f, rx: e.r * grow * (e.squeeze ? 0.55 + 0.45 * smooth(0, 0.25, f) : 1), ry: e.r * grow, a, seed: seed + (k & 15) * 7});
  }
  return out;
};
export const paintWarmthPuffs = (p: Painter, es: PuffSpec[], t: number) =>
  es.forEach((e, i) => puffsOf(e, t, 12000 + i * 200).forEach((q) => { if (q.a > 0.02) paintPuff(p, q.x, q.y, Math.max(q.rx, q.ry * 0.7), q.seed, t, q.a); }));

// ---- N5 breadcrumb C1 (0.85 x 0.60 x 0.50 sm): crust, porous crumb face, bite state, two grip anchors.
export const CRUMB = {w: 0.85, h: 0.6, crust: '#b9763a', crustDark: '#8a5326', crumb: '#f2dba8', pore: '#d6b87a'} as const;
/** Grip anchors in picture px (left and right hand) for a crumb at ground point `at` (the centre of its base): the lower third of the
 * left and right faces, where the hands hold it for the drag (S01-B04-SH03) and the lift (S01-B05-SH03). */
export const crumbGrips = (c: YCam, at: V3, lift = 0): {l: Pt; r: Pt; centre: Pt; u: number} | null => {
  const g = camPoint(c, [at[0], at[1] + lift, at[2]]), u = camUnit(c, at);
  if (!g) return null;
  const cy = g[1] - CRUMB.h * 0.5 * u;
  return {l: [g[0] - CRUMB.w * 0.5 * u, cy + CRUMB.h * 0.12 * u], r: [g[0] + CRUMB.w * 0.5 * u, cy + CRUMB.h * 0.12 * u], centre: [g[0], cy], u};
};
/** Torn edge: subdivides a closed local-unit polygon and pushes each new point by a seeded jitter (fixed per seed, so it never boils). */
const tear = (poly: Pt[], seed: number, amt: number, sub = 3): Pt[] => {
  const out: Pt[] = [];
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    for (let k = 0; k < sub; k++) { const t = k / sub, j = k === 0 ? 0.4 : 1; out.push([a[0] + (b[0] - a[0]) * t + (hash(seed + i * 7 + k * 3) - 0.5) * amt * j, a[1] + (b[1] - a[1]) * t + (hash(seed + 50 + i * 7 + k * 3) - 0.5) * amt * j]); }
  });
  return out;
};
/** Paints the crumb at ground point `at`, lifted by `lift` sm. `bites` 0..2 (first bite mark from L 22 of S01-B04-SH03). Silhouette box, grips and
 * cut-face box are fixed by CRUMB; torn edges, cracks, flour, pores and loose crumbs are seeded (13000-13999), never random.
 * `shadow` 0..1 (default 1) scales the contact shadow painted under the base (FR19: the lift fades it out as the crumb leaves the ground,
 * so no shadow hangs in the air across her face). */
export const paintCrumb = (p: Painter, c: YCam, at: V3, o: {lift?: number; bites?: number; shade?: number; shadow?: number} = {}) => {
  const gr = crumbGrips(c, at, o.lift ?? 0);
  if (!gr) return;
  const {centre, u} = gr, w = CRUMB.w * u, h = CRUMB.h * u, sh = o.shade ?? 0, col = (x: string) => mixColor(x, '#5f7fa4', sh);
  const L = (pts: Pt[]): Pt[] => pts.map(([x, y]): Pt => [centre[0] + x * w, centre[1] + y * h]); // local units (x,y in -0.5..0.5, y down) to picture px
  const lifted = (o.lift ?? 0) > 0.001;
  // contact shadow: wide soft pool, tighter dark core under the loaf, thinner when lifted
  const sA = (lifted ? 0.5 : 1) * Math.max(0, Math.min(1, o.shadow ?? 1));
  if (sA > 0) {
    washAt(p, 13000, '#3b2a1c', 55 * sA, ell(centre[0] + w * 0.04, centre[1] + h * 0.53, w * 0.72, h * 0.12, 20), 0.35, 0.3);
    washAt(p, 13010, '#2c1e14', 110 * sA, ell(centre[0] + w * 0.02, centre[1] + h * 0.5, w * 0.54, h * 0.065, 18), 0.2, 0.25);
  }
  // loose crumbs at the base (skipped when lifted: they stay on the ground)
  if (!lifted) for (let i = 0; i < 7; i++) {
    const side = hash(13020 + i) < 0.5 ? -1 : 1, x = side * (0.5 + 0.02 + 0.28 * hash(13030 + i)) * (hash(13040 + i) < 0.3 ? 0.6 : 1), y = 0.5 + 0.03 + 0.08 * hash(13050 + i), r = (0.012 + 0.022 * hash(13060 + i)) * u;
    const px = centre[0] + x * w, py = centre[1] + y * h;
    solid(p, 13070 + i, col(hash(13080 + i) < 0.6 ? CRUMB.crumb : CRUMB.crust), ell(px, py, r, r * 0.65, 7, hash(13090 + i) - 0.5), 2);
  }
  // loaf: torn silhouette inside the fixed box (base edge stays straight on the ground)
  const base: Pt[] = [[-0.5, 0.5], [-0.485, 0.12], [-0.46, -0.08], [-0.33, -0.32], [-0.2, -0.47], [0.05, -0.5], [0.3, -0.5], [0.44, -0.3], [0.5, -0.1], [0.5, 0.5]];
  const torn = tear(base, 13100, 0.05, 2).map(([x, y]): Pt => [Math.max(-0.5, Math.min(0.5, x)), Math.min(0.5, Math.max(-0.5, y))]);
  const loaf = L(torn);
  solid(p, 13001, col(CRUMB.crustDark), loaf, 4);
  // crust body: thicker on top and the lit left side, thin at the base; inset varies per vertex
  const cen: Pt = [0, 0.05];
  const body = torn.map(([x, y], i): Pt => { const k = 0.9 + 0.06 * hash(13110 + i) + (y < -0.2 ? -0.015 : 0); return [cen[0] + (x - cen[0]) * k, y > 0.45 ? y : cen[1] + (y - cen[1]) * k - 0.012]; });
  solid(p, 13002, col(CRUMB.crust), L(body), 3);
  // dawn light: warm gold on the upper-left crust, cool brown shade low on the right under the cut face
  washAt(p, 13120, '#e9b36a', 62, L([[-0.44, 0.05], [-0.38, -0.26], [-0.22, -0.43], [0.02, -0.46], [-0.1, -0.3], [-0.26, -0.12], [-0.34, 0.12]]), 0.35, 0.5);
  washAt(p, 13130, '#6d3b1c', 70, L([[-0.48, 0.5], [-0.46, 0.2], [-0.3, 0.3], [-0.05, 0.42], [0.1, 0.5]]), 0.3, 0.5);
  washAt(p, 13135, '#7a4a28', 40, L([[0.1, -0.5], [0.3, -0.5], [0.45, -0.3], [0.4, -0.2], [0.2, -0.38]]), 0.3, 0.5); // top edge turning toward the cut face
  // flour speckle on the lit top
  for (let i = 0; i < 16; i++) {
    const x = -0.42 + 0.7 * hash(13140 + i), top = -0.46 + 0.1 * Math.abs(x + 0.1) * 2, y = top + (0.34 - 0.0) * hash(13160 + i) * (x < -0.1 ? 1 : 0.5), r = (0.006 + 0.009 * hash(13180 + i)) * u;
    if (x > 0.08 && y > -0.38) continue;
    solid(p, 13200 + i, col('#f3e2c0'), ell(centre[0] + x * w, centre[1] + y * h, r, r * 0.7, 6), 1);
  }
  // baked cracks: a few short dark strokes on the crust, left of the cut face
  const cracks: Pt[][] = [[[-0.36, -0.18], [-0.3, -0.12], [-0.31, -0.03], [-0.24, 0.04]], [[-0.18, -0.4], [-0.14, -0.31], [-0.17, -0.22]], [[-0.4, 0.2], [-0.3, 0.24], [-0.27, 0.32], [-0.18, 0.34]], [[-0.1, -0.12], [-0.05, -0.04], [-0.07, 0.06]]];
  cracks.forEach((cr, i) => inkLine(p, 13250 + i, L(cr), {weight: 0.9, color: col('#5a2f14'), curve: 0.3}));
  // cut face: torn pale crumb on the +x side (box unchanged), rim of thin inner crust
  const fb: Pt[] = [[0.1, -0.38], [0.28, -0.4], [0.46, -0.36], [0.465, 0.04], [0.46, 0.46], [0.28, 0.465], [0.1, 0.46], [0.095, 0.04]];
  const ft = tear(fb, 13300, 0.025, 2).map(([x, y]): Pt => [Math.max(0.09, Math.min(0.47, x)), Math.max(-0.4, Math.min(0.47, y))]);
  const face = L(ft);
  solid(p, 13003, col(mixColor(CRUMB.crumb, CRUMB.crust, 0.35)), face, 3);
  solid(p, 13004, col(CRUMB.crumb), L(ft.map(([x, y]): Pt => [0.28 + (x - 0.28) * 0.9, 0.04 + (y - 0.04) * 0.92])), 3);
  washAt(p, 13310, '#fff1cf', 55, L([[0.14, -0.33], [0.3, -0.35], [0.28, -0.1], [0.14, -0.05]]), 0.3, 0.4); // lit upper-left of the face
  washAt(p, 13320, '#b98a4a', 70, L([[0.3, 0.1], [0.44, 0.06], [0.45, 0.43], [0.14, 0.44]]), 0.3, 0.5); // shade low and right
  // pores: varied size, a dark inner cavity with a pale lip below it
  for (let i = 0; i < 20; i++) {
    const x = 0.13 + 0.31 * hash(13100 + i * 3 + 1000), y = -0.34 + 0.78 * hash(13200 + i * 3 + 1000), big = hash(13330 + i), r = (0.01 + 0.032 * big * big) * u;
    const px = centre[0] + x * w, py = centre[1] + y * h;
    solid(p, 13400 + i, col(CRUMB.pore), ell(px, py, r, r * 0.72, 8, hash(13350 + i) - 0.5), 2);
    solid(p, 13450 + i, col('#a8782f'), ell(px - r * 0.12, py - r * 0.12, r * 0.62, r * 0.42, 7), 1);
    if (r > 0.02 * u) solid(p, 13480 + i, col('#fbeac0'), ell(px + r * 0.15, py + r * 0.62, r * 0.7, r * 0.12, 6), 1);
  }
  inkLine(p, 13500, loaf, {weight: 0.8, color: col('#5a3216')});
  inkLine(p, 13510, face, {weight: 0.4, color: col('#9a6a34'), closed: true});
  for (let b = 0; b < Math.min(2, o.bites ?? 0); b++) solid(p, 13600 + b, col(mixColor(CRUMB.crumb, '#8a5326', 0.45)), ell(centre[0] + w * (0.3 + 0.08 * b), centre[1] - h * 0.3 + h * 0.05 * b, w * 0.07, h * 0.06, 10), 2); // bite notch inside the cut face, near its top edge
};

// ---- N9 scale-bars (S01-B05-SH02, picture px): card, two bars, label slots, icon, shrink, surplus glow. No digits, axis, ticks or %.
export const BARS = {card: [40, 360, 400, 1000] as const, force: {x: [130, 210] as const, color: '#e8a33a'}, weight: {x: [260, 340] as const, color: '#5a7fa8'}, base: 880, start: 480,
  end: {force: 216, weight: 72}, slots: {force: [130, 900, 210, 980], weight: [260, 900, 340, 980]} as Record<'force' | 'weight', readonly [number, number, number, number]>, icon: {at: [90, 430] as Pt, from: 120, to: 48}};
export type BarsState = {wipe: number; force: number; weight: number; icon: number; glow: number};
/** Bar state at a shot-local frame (L numbers of the sheet: wipe 8-14, grow 14-20 / 20-26, icon 48-66, shrink 79-97 / 79-121, glow 143-152). */
export const barsAt = (L: number): BarsState => ({
  wipe: smooth(8, 14, L),
  force: (L < 20 ? ease((L - 14) / 6) : 1) * 0 + (L < 79 ? BARS.start * ease((L - 14) / 6) : BARS.start + (BARS.end.force - BARS.start) * (1 - (1 - smooth(79, 121, L)) ** 2)),
  weight: (L < 79 ? BARS.start * ease((L - 20) / 6) : BARS.start + (BARS.end.weight - BARS.start) * (1 - (1 - smooth(79, 97, L)) ** 2.4)),
  icon: BARS.icon.from + (BARS.icon.to - BARS.icon.from) * (1 - (1 - smooth(48, 66, L)) ** 2),
  glow: smooth(143, 152, L),
});
export const paintScaleBars = (p: Painter, s: BarsState) => {
  if (s.wipe <= 0) return;
  const [x0, y0, x1, y1] = BARS.card, w = x1 - x0, cx = x0 + w * s.wipe;
  solid(p, 14000, '#f4ecd8', rect(x0, y0, Math.max(x0 + 2, cx), y1), 3);
  inkLine(p, 14001, rect(x0, y0, Math.max(x0 + 2, cx), y1), {weight: 1.0, color: '#b9a98a'});
  (['force', 'weight'] as const).forEach((k, i) => {
    const b = BARS[k], h = Math.max(0, s[k]);
    if (h < 2) return;
    solid(p, 14010 + i, b.color, rect(b.x[0], BARS.base - h, b.x[1], BARS.base), 3);
    inkLine(p, 14020 + i, rect(b.x[0], BARS.base - h, b.x[1], BARS.base), {weight: 0.9, color: mixColor(b.color, '#2a2a2a', 0.5)});
  });
  if (s.glow > 0) {
    const top = BARS.base - s.weight, bot = BARS.base - s.force, [gx0, gx1] = BARS.force.x;
    washAt(p, 14030, '#ffe39a', 200 * s.glow, rect(gx0 - 6, bot, gx1 + 6, top), 0.3, 0.1);
  }
  // TINY outline icon (a stick figure): head circle + body line, the size of `icon`
  const [ix, iy] = BARS.icon.at, h = s.icon;
  inkLine(p, 14040, ell(ix, iy - h * 0.38, h * 0.12, h * 0.12, 12), {weight: 1.4, color: '#4a4a4a'});
  inkLine(p, 14041, [[ix, iy - h * 0.26], [ix, iy + h * 0.2]], {weight: 1.4, color: '#4a4a4a', closed: false});
  inkLine(p, 14042, [[ix - h * 0.2, iy - h * 0.1], [ix + h * 0.2, iy - h * 0.1]], {weight: 1.4, color: '#4a4a4a', closed: false});
  inkLine(p, 14043, [[ix - h * 0.14, iy + h * 0.5], [ix, iy + h * 0.2], [ix + h * 0.14, iy + h * 0.5]], {weight: 1.4, color: '#4a4a4a', closed: false});
};

// ---- N2 SET-DRIFT (S01-B02-SH02) and N10 `soft air streaks`: motes rising relative to her at 0.15 sm/s, a blurred slab band sliding up
// the left, and 3-5 thin pale curved strokes hugging her outline on L 50-70 (air holding her, never radial speed lines).
/** The sheet's 0.15 sm/s is quoted as ~27 px/s but at TINY's depth (692 px for 1.58 sm = 438 px/sm) it is 66 px/s: the rise is capped at `maxPx` px/s (spike 4: < 40). */
export const DRIFT = {moteSpeed: 0.15, maxPx: 27, slab: [20, 132] as [number, number], streaks: [50, 70] as [number, number], band: [1176, 1344] as [number, number]};
export type Mote = {x: number; y: number; r: number; a: number};
/** Motes at time `t` s for a camera that follows her: `u` px per sm; rise at 0.15 sm/s (px/s = 0.15 u), sparse, faded inside the caption band. */
export const driftMotes = (t: number, u: number, n = 22, seed = 16000): Mote[] =>
  Array.from({length: n}, (_, i): Mote => {
    const h = (k: number) => hash(seed + i * 7 + k), span = 1500, y = ((h(2) * span - t * moteSpeedPx(u)) % span + span) % span - 100;
    const inBand = y > DRIFT.band[0] - 40 && y < DRIFT.band[1] + 40;
    return {x: 40 + h(1) * 1000, y, r: 2 + h(3) * 4, a: (0.35 + 0.4 * h(4)) * (inBand ? 0.15 : 1)};
  });
/** Mote speed on screen (px/s) for the spike-4 check (< 40). */
export const moteSpeedPx = (u: number) => Math.min(DRIFT.moteSpeed * u, DRIFT.maxPx);
/** Slab band centre y (px) sliding up: enters the bottom at L 20, leaves the top at L 132. */
export const slabBandY = (L: number) => 1960 + (-160 - 1960) * smooth(DRIFT.slab[0], DRIFT.slab[1], L);
export const paintDriftAir = (p: Painter, t: number, L: number, u: number) => {
  washAt(p, 16100, '#bcd0e0', 90, rect(-40, -40, 260, 1960), 0.3, 0.1); // facade as a soft vertical wash, screen left
  const y = slabBandY(L);
  washAt(p, 16101, '#9fb4c8', 80, rect(-40, y - 40, 300, y + 40), 0.3, 0.1);
  driftMotes(t, u).forEach((m, i) => washAt(p, 16200 + i, '#f2c27a', 255 * m.a, ell(m.x, m.y, m.r, m.r, 8), 0.1, 0.05));
};
/** Soft air streaks: curved pale strokes hugging an outline (a closed ring of points round the figure, px), drawn as an arc each, slowly
 * drifting along the outline; none radial. `k` 0..1 is the fade over L 50-70 (ramp in, hold). */
export const paintAirStreaks = (p: Painter, ring: Pt[], L: number, seed = 16400) => {
  const k = smooth(DRIFT.streaks[0], DRIFT.streaks[0] + 6, L) * (1 - smooth(DRIFT.streaks[1], DRIFT.streaks[1] + 6, L));
  if (k <= 0.02 || ring.length < 8) return;
  const n = ring.length, cx = ring.reduce((s, q) => s + q[0], 0) / n, cy = ring.reduce((s, q) => s + q[1], 0) / n;
  for (let i = 0; i < 4; i++) {
    const start = Math.floor(((i / 4) * n + (L - DRIFT.streaks[0]) * 0.15 + hash(seed + i) * 3) % n), len = Math.floor(n * (0.12 + 0.06 * hash(seed + 9 + i)));
    const arc: Pt[] = Array.from({length: len}, (_, j) => { const q = ring[(start + j) % n], dx = q[0] - cx, dy = q[1] - cy, m = Math.hypot(dx, dy) || 1, off = 26 + 10 * i; return [q[0] + (dx / m) * off, q[1] + (dy / m) * off] as Pt; });
    inkLine(p, seed + 20 + i, arc, {weight: 2.4, color: '#8aa5bb', closed: false, curve: 0.4});
    washAt(p, seed + 40 + i, '#b9cfe0', 110 * k, arc.concat(arc.slice().reverse().map(([x, y]): Pt => [x + 4, y + 4])), 0.2, 0.05);
  }
};

/** N9 Thai bar labels as timeline items (`painted.shots[].items`, Remotion DOM, not painted): centred under each bar, in shot-local frames of S01-B05-SH02 (the label pops with its bar's grow). Editor spreads these into the shot cue. */
export const BAR_LABELS: {kind: 'label'; text: string; x: number; y: number; atFrame: number}[] = (['force', 'weight'] as const).map((k) => {
  const [x0, y0, x1, y1] = BARS.slots[k];
  return {kind: 'label', text: k === 'force' ? 'แรง' : 'น้ำหนัก', x: (x0 + x1) / 2, y: (y0 + y1) / 2, atFrame: k === 'force' ? 20 : 26};
});

/**
 * N8 emission for S01-B04-SH02, fed from the figure (`FigAnchors`, picture px; `u` px per sm): puff 1 from the shoulders at L 72, puff 2 from
 * the top of the head at L 84, puffs 3-4 at L 92 / 100 (shoulders / head); all drift -x and up at 0.3 sm/s. Puff 2 is clutched to the chest
 * L 96-106 (it follows the hands' midpoint) and squeezes out between the mittens L 106-116 (narrowed sideways, then re-inflates), then
 * floats off. Anchors are read at the current frame (she is nearly still until the shiver at L 116).
 */
export const warmthPuffsAt = (L: number, a: {headTop: number; head: [number, number] | number[]; rShoulder: Pt; lShoulder: Pt; rHand: Pt; lHand: Pt}, u: number): {x: number; y: number; r: number; a: number; seed: number}[] => {
  const sh: Pt = [(a.rShoulder[0] + a.lShoulder[0]) / 2, (a.rShoulder[1] + a.lShoulder[1]) / 2 - 0.05 * u], hd: Pt = [a.head[0], a.headTop - 0.08 * u];
  const hands: Pt = [(a.rHand[0] + a.lHand[0]) / 2, (a.rHand[1] + a.lHand[1]) / 2];
  const specs = [{t0: 72, src: sh, r: 0.2}, {t0: 84, src: hd, r: 0.24}, {t0: 92, src: sh, r: 0.17}, {t0: 100, src: hd, r: 0.19}];
  const out: {x: number; y: number; r: number; a: number; seed: number}[] = [];
  specs.forEach((e, i) => {
    const s = (L - e.t0) / 30;
    if (s < 0 || s > 3.2) return;
    const f = s / 3.2, grow = 0.45 + 0.55 * ease(f), al = smooth(0, 0.18, f) * (1 - smooth(0.6, 1, f));
    let x = e.src[0] - 0.3 * u * s, y = e.src[1] - 0.3 * u * s * 0.9, rx = e.r * u * grow;
    if (i === 1 && L >= 96) { // clutched, squeezed out, floats off
      const k = smooth(96, 106, L) * (1 - smooth(110, 130, L));
      x += (hands[0] - x) * k; y += (hands[1] - y) * k;
      if (L >= 106) rx *= 0.55 + 0.45 * smooth(106, 116, L);
    }
    out.push({x, y, r: rx, a: al, seed: 12500 + i * 10});
  });
  return out;
};

/** N5 parenting: the crumb ground point (same y, z as `at`) at which its +x grip sits on the hand point `hand` (px; the mean of her two hands). Two fixed-point steps (the camera yaw makes px per sm vary a little with x). */
export const crumbFollowHand = (c: YCam, at: V3, hand: Pt): V3 => {
  let a: V3 = at;
  for (let i = 0; i < 2; i++) { const gr = crumbGrips(c, a); if (!gr) break; a = [a[0] + (hand[0] - gr.r[0]) / gr.u, a[1], a[2]]; }
  return a;
};

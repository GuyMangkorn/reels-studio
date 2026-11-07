import {ell, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {bladeItem, clump, gust, glow, MIDLIT, nearTips, paintAir, paintDrop, paintGround, paintShafts, SHADE, SUNLIT, type Bend, type Blade, type BladePal, type Dof} from './macro';
import {paintSorted, type Item} from './world';

// SET-GARDEN-GRASS and SET-MACRO-PLANTER (brief EDU-BRIEF-R1.1 set plans; sm, k 320). Look-frame code (W3.1) for LF02-LF04 and the
// ant look check. SET-GARDEN-GRASS origin on the thatch at TINY's landing point in the sunlit clearing, +x right, +y up, +z toward the
// hero camera side. Clearing x -1..4, z -3..3; shade pocket under the tuft T-SHADE (x -1..-7, z -1..-6). Sun low from back-left.

export const T_DROP: V3 = [2.0, 1.1, -0.9];
export const D1_CONTACT: V3 = [2.2, 1.12, -1.0];

/** Catmull-Rom resample of a world centre line (`n` points per span), so a hero blade bends without polygon corners (LF03 v2). */
const spline = (pts: V3[], n = 6): V3[] => {
  const out: V3[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 1; j <= n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)) as V3);
    }
  }
  return out;
};

/** `B-DEW`: the hero blade, rising from (3.4, 0, -1.2) out of frame and arching back down into a cradle at the drop's contact point.
 * LF03 v2: the authored control points are unchanged; the line is spline-resampled (14 spans x 6) to remove the cradle's corners.
 * LF03 v3: the blade narrows down its falling half to a slim tip (half width ~0.11 sm at the drop, 0.2x the drop's width) and the last
 * three points droop just past the contact instead of curling up (tip at x 1.76, inside the drop's left edge), so D1 sits on the tip and the bend no longer reads as a cup.
 * LF03 v4: the tail bends at the drop's foot with its underside at the contact (centre y 1.24, half width ~0.11) and the tip turns up
 * inside the water (2.07, 1.29), so no pale hook shows outside the drop; the drop's rounded foot wraps the bend. */
const smooth = (a: number, b: number, s: number) => { const k = Math.min(1, Math.max(0, (s - a) / (b - a))); return k * k * (3 - 2 * k); };
export const B_DEW: Blade = {
  root: [3.4, 0, -1.2], h: 18, w: 1.4, dir: [-1, 0], lean: 0, curl: 0, pal: SUNLIT, seed: 9100, taper: 0.28,
  widthAt: (s) => 1 - 0.75 * smooth(0.4, 0.68, s),
  line: spline([[3.4, 0, -1.2], [3.36, 3, -1.18], [3.22, 6, -1.15], [3.0, 8, -1.12], [2.7, 8.7, -1.1], [2.45, 8.2, -1.08], [2.33, 6.5, -1.06], [2.3, 4.5, -1.04], [2.3, 2.8, -1.02], [2.3, 1.8, -1.01], [2.28, 1.45, -1.0], [2.22, 1.25, -1.0], [2.14, 1.24, -1.0], [2.07, 1.29, -1.0]]),
};

/**
 * N2: the shade edge of SET-GARDEN-GRASS, keyed per shot (scene sheets: x -0.5 through B04 and the garden, sliding to -1.2 over
 * S01-B05-SH01 L 0-89, then -1.2 -> -3.0 over S01-B05-SH03 L 0-80, "story-time cheat"). `local` is the shot-local frame.
 */
export const SHADE_EDGE_KEYS: Record<string, {x: [number, number]; frames: [number, number]}> = {
  'S01-B05-SH01': {x: [-0.5, -1.2], frames: [0, 89]},
  'S01-B05-SH02': {x: [-1.2, -1.2], frames: [0, 173]},
  'S01-B05-SH03': {x: [-1.2, -3.0], frames: [0, 80]},
  'S01-B05-SH04': {x: [-3.0, -3.0], frames: [0, 196]},
};
const smoothstep = (a: number, b: number, v: number) => { const k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
/** Shade edge x (sm) for a shot at a shot-local frame; -0.5 (the garden default) for shots without a key. */
export const shadeEdgeAt = (shot: string, local: number): number => {
  const k = SHADE_EDGE_KEYS[shot];
  if (!k) return -0.5;
  return k.x[0] + (k.x[1] - k.x[0]) * smoothstep(k.frames[0], k.frames[1], local);
};
/** How much of the shade a figure standing at world x takes (0 sunlit .. 1 shaded), soft over `soft` sm round the edge: the `u` for a
 * `tint` (K1 `tintPainter`) so a figure or the ant crossing the edge cools as she goes. */
export const edgeShade = (x: number, edge: number, soft = 0.5): number => 1 - smoothstep(edge - soft / 2, edge + soft / 2, x);
/** Cool a blade palette toward SHADE (a lit blade seen from inside the pocket). */
const coolPal = (pal: BladePal, k = 0.8): BladePal => (pal === SHADE ? pal : {base: mixColor(pal.base, SHADE.base, k), body: mixColor(pal.body, '#4a7a62', k), edge: mixColor(pal.edge, '#7aa08a', k), vein: mixColor(pal.vein, SHADE.vein, k)});

export type GardenMode = 'sun' | 'shade';
const AIR_SUN: [number, string][] = [[-40, '#f6e9b8'], [520, '#efe3a8'], [900, '#d9df98'], [1300, '#bcd27e'], [1960, '#a9c46c']];
const AIR_SHADE: [number, string][] = [[-40, '#9fb6c8'], [520, '#8eaab8'], [900, '#7d9aa6'], [1300, '#6a8a8c'], [1960, '#5e7e7a']];

/** Ring of blade clumps round the clearing plus the shade tuft; far ones become washes through the painted depth of field. */
export const gardenBlades = (t: number, gap?: {x: number; w: number}, edge = -0.5): Blade[] => {
  const out: Blade[] = [];
  const ring = 34;
  for (let i = 0; i < ring; i++) {
    const a = (i / ring) * 2 * Math.PI, r = (k: number) => hash(i * 29 + k + 4000);
    const R = 6 + r(1) * 5, x = 1.0 + Math.cos(a) * R, z = -1.5 + Math.sin(a) * R * 0.9;
    if (z > 1.2) continue; // keep the camera side of the clearing open; shots add their own foreground sweeps
    if (x < -0.5 && x > -8 && z < -0.5 && z > -7) continue; // the shade tuft is authored below
    const sun = x > edge || z < -7;
    if (gap && Math.abs(x - gap.x) < gap.w && z < -4) continue; // a gap in the grass for the far CL02 crossing
    out.push(...clump({x, z, n: 5, h: [16, 26], w: [1.0, 1.5], pal: sun ? (i % 3 === 0 ? SUNLIT : MIDLIT) : SHADE, seed: 400 + i, spread: 1.1, beads: r(3) > 0.6, lean: [2, 14], curl: [4, 26], sway: 1}));
  }
  // far wall of grass
  for (let i = 0; i < 40; i++) {
    const r = (k: number) => hash(i * 31 + k + 9000), a = -Math.PI * 0.95 + r(1) * Math.PI * 0.9;
    const R = 14 + r(2) * 16, fx = 1 + Math.cos(a) * R;
    if (gap && Math.abs(fx - gap.x) < gap.w * 1.6) continue;
    out.push(...clump({x: 1 + Math.cos(a) * R, z: -1.5 + Math.sin(a) * R, n: 3, h: [18, 30], w: [1.2, 1.8], pal: SUNLIT, seed: 1200 + i, spread: 1.4, lean: [2, 10], curl: [4, 18], sway: 0.8}));
  }
  // T-SHADE: a dense tuft leaning over the pocket
  for (let i = 0; i < 6; i++) out.push(...clump({x: -3.0 - i * 0.9, z: -3.8 + (i % 2) * 1.3, n: 5, h: [22, 26], w: [1.2, 1.6], pal: SHADE, seed: 2100 + i, spread: 1.0, lean: [12, 24], curl: [30, 70], sway: 0.8}).map((b) => ({...b, dir: [0.6 + hash(b.seed) * 0.4, 0.5] as [number, number]})));
  void t;
  return out;
};

export type GardenOpts = {
  t: number; mode: GardenMode; items?: Item[]; drop?: boolean;
  /** Screen position of the sun glow (px). */
  sun?: Pt;
  /** Extra foreground blades (shot-specific sweeps). */
  fore?: Blade[];
  dof?: Dof;
  /** Breeze over the whole set (N1: tip deflection <= 25% of height). */
  gust?: Bend;
  /** Ground shade edge x (sm): shade (cool glaze) for x < edge. */
  shadeEdge?: number;
  /** Gap in the grass ring (x centre, half width) for a far crossing. */
  gap?: {x: number; w: number};
  /** Items painted after the depth-sorted set and before the foreground (the shade air, a lead drawn on top of a glaze). */
  after?: (p: Painter, c: YCam) => void;
  /** Foreground tips (default 14 blades, height 0.25-0.6 sm); a shot with a lead low in the frame thins them (S01-B02-SH04). */
  tips?: {n: number; h: [number, number]};
};

export const paintGarden = (p: Painter, c: YCam, o: GardenOpts) => {
  const sunMode = o.mode === 'sun';
  paintAir(p, sunMode ? AIR_SUN : AIR_SHADE, 9500);
  const sun = o.sun ?? [180, 300];
  if (sunMode) glow(p, sun[0], sun[1], 420, '#fff1c8', 1, 9520);
  else glow(p, sun[0], sun[1], 360, '#f6e3a8', 0.55, 9520);
  paintGround(p, c, {x: [-40, 40], z: [-40, 6], soil: sunMode ? '#7a5c40' : '#4b4a48', thatch: sunMode ? '#c9ae76' : '#7f8a86', pebble: sunMode ? '#a89a88' : '#6f7a80', seed: 9600, bits: 260, bx: [c.x - 6, c.x + 6], bz: [c.z - 9, c.z - 0.3]});
  if (o.shadeEdge !== undefined && sunMode) {
    // the shade pocket on the ground (x < edge): cool glaze
    const e = o.shadeEdge, poly: V3[] = [[-40, 0.003, -40], [e, 0.003, -40], [e + 0.3, 0.003, 6], [-40, 0.003, 6]];
    const q = poly.map((v) => camPoint(c, v));
    if (q.every(Boolean)) washAt(p, 9610, '#4f6f8a', 120, q as Pt[], 0.25, 0.1);
  }
  const dof = o.dof;
  const edge = o.shadeEdge ?? -0.5;
  const items: Item[] = (o.gust ? gust(gardenBlades(o.t, o.gap, edge), o.gust) : gardenBlades(o.t, o.gap, edge)).map((b) => bladeItem(!sunMode ? {...b, pal: shadeOf(b.pal)} : edge < -0.5 && b.root[0] < edge ? {...b, pal: coolPal(b.pal)} : b, o.t, dof));
  if (o.drop !== false) {
    items.push(bladeItem(B_DEW, o.t, dof));
    items.push({at: D1_CONTACT, bias: -0.05, draw: (q, cc) => { const g = camPoint(cc, D1_CONTACT); if (g) paintDrop(q, g, camUnit(cc, D1_CONTACT), {sunSide: -1, t: o.t}); }});
  }
  items.push(...(o.items ?? []));
  paintSorted(p, c, items);
  if (sunMode) paintShafts(p, [-120, 60, 260, 420], {top: -60, bottom: 1150, slant: 380, color: '#ffd9a0', level: 0.55, seed: 9700, t: o.t});
  o.after?.(p, c);
  nearTips(c, {n: o.tips?.n ?? 14, h: o.tips?.h ?? [0.25, 0.6], seed: 77, color: sunMode ? '#55752e' : '#34504a'}).forEach((b) => bladeItem(b, o.t, dof).draw(p, c));
  (o.fore ?? []).forEach((b) => bladeItem(b, o.t, dof).draw(p, c));
};
const shadeOf = (pal: BladePal): BladePal => (pal === SUNLIT ? {...SHADE, body: '#4a7a62', edge: '#7aa08a'} : pal);

/** A near foreground sweep: a big dark blade crossing a frame edge (painted depth of field, no line). */
export const sweep = (root: V3, dir: [number, number], lean: number, curl: number, seed: number, w = 1.6, h = 20, color = '#3e5a26'): Blade =>
  ({root, h, w, dir, lean, curl, pal: {base: color, body: color, edge: color, vein: color}, seed, near: true});

// ---- SET-MACRO-PLANTER (sm): soil in the trough, the outer lip at z -6.4 with open sky and the hazy city far below beyond it.
const PLANTER_AIR: [number, string][] = [[-40, '#b7cde0'], [500, '#d9dccb'], [820, '#f4dcae'], [1100, '#f7e3b8'], [1960, '#e9d6a6']];
export const planterBlades = (): Blade[] => {
  const spots: [number, number, number][] = [[-4, -2, 7], [-1.5, -4.5, 7], [2.5, -3, 7], [5, 1, 6], [-6, 3, 5], [7.5, -5.5, 5], [-8, -5, 5], [0.5, -9, 4]];
  return spots.flatMap(([x, z, n], i) => clump({x, z, n, h: [20, 38], w: [1.0, 1.6], pal: {base: '#5f8a34', body: '#b9d86a', edge: '#e8f2a0', vein: '#8fb24a'}, seed: 3100 + i * 7, spread: 0.9, beads: true, beadAt: [0.03, 0.14], lean: [3, 14], curl: [4, 22], sway: 1.2}));
};
/**
 * `blades` replaces the planter's tufts (a shot keeps the ones behind the lead) and `gust` bends them in a breeze (S01-B02-SH01, N1).
 * `wallItem` draws the outer wall as a depth-sorted item, so tufts rooted behind it and a figure that has gone over it are hidden by it
 * (default: a backdrop painted before everything). `calm` [y0, y1] veils the soil in that picture band (the caption band) with a flat
 * soil wash before the figure; `bits` sets the soil's pebble and thatch count (default 220). All absent = as before (LF02, B01 plates).
 */
export const paintPlanter = (p: Painter, c: YCam, o: {t: number; items?: Item[]; fore?: Blade[]; sun?: Pt; blades?: Blade[]; gust?: Bend; wallItem?: boolean; calm?: [number, number]; bits?: number}) => {
  paintAir(p, PLANTER_AIR, 9800);
  const hz = camPoint(c, [0, c.y, -4000]);
  const sun = o.sun ?? [880, (hz?.[1] ?? 900) - 160];
  glow(p, sun[0], sun[1], 300, '#fff1cf', 1, 9810);
  // hazy towers far below the lip: soft shapes just over the lip line
  const lip = camPoint(c, [0, 1.3, -6.4]);
  if (lip) {
    for (let i = 0; i < 12; i++) {
      const r = (k: number) => hash(i * 7 + k + 300), x = -60 + i * 100 + r(1) * 40, w = 50 + r(2) * 60, h = 30 + r(3) * 120;
      washAt(p, 9830 + i, mixColor('#a9b9c9', '#f1dcc0', r(4) * 0.5), 150, [[x, lip[1] + 4], [x + w, lip[1] + 4], [x + w, lip[1] - h], [x, lip[1] - h]], 0.1, 0.1);
    }
    washAt(p, 9850, '#f3dcb8', 140, [[-60, lip[1] - 170], [1140, lip[1] - 170], [1140, lip[1] + 10], [-60, lip[1] + 10]], 0.3, 0.1);
  }
  // trough: outer lip (pale plastic edge), soil
  paintGround(p, c, {x: [-14, 14], z: [-6.4, 14], soil: '#4a3628', thatch: '#7a5c44', pebble: '#f2efe6', seed: 9860, bits: o.bits ?? 220, bx: [c.x - 5, c.x + 5], bz: [-6.3, c.z - 0.3]});
  if (o.calm) washAt(p, 9872, '#5a4434', 170, [[-60, o.calm[0]], [1140, o.calm[0]], [1140, o.calm[1]], [-60, o.calm[1]]], 0.4, 0.1);
  // camPoly clips at the near plane: with a yawed camera (S01-B02-SH01, yaw -35) the +-14 m ends of the wall are behind the lens
  const wall = (q: Painter, cc: YCam) => {
    const lp = camPoly(cc, [[-14, 0, -6.4], [14, 0, -6.4], [14, 1.3, -6.4], [-14, 1.3, -6.4]]);
    if (lp.length >= 3) washAt(q, 9870, '#e9e4da', 255, lp, 0.02, 0.05);
    const lt = camPoly(cc, [[-14, 1.3, -6.4], [14, 1.3, -6.4], [14, 1.3, -7.0], [-14, 1.3, -7.0]]);
    if (lt.length >= 3) washAt(q, 9871, '#f7f4ec', 255, lt, 0.02, 0.05);
  };
  if (!o.wallItem) wall(p, c);
  const items: Item[] = (o.gust ? gust(o.blades ?? planterBlades(), o.gust) : o.blades ?? planterBlades()).map((b) => bladeItem(b, o.t, {near: 0.9, far: 22, nearColor: '#3e5a26', farColor: '#f3e6b4', farMix: 0.5}));
  if (o.wallItem) items.push({at: [o.items?.[0]?.at[0] ?? 0, 0, -6.4], draw: wall});
  items.push(...(o.items ?? []));
  paintSorted(p, c, items);
  paintShafts(p, [520, 700, 860, 1000], {top: -60, bottom: 1100, slant: -420, color: '#ffd9a0', level: 0.5, seed: 9880, t: o.t});
  nearTips(c, {n: 12, h: [0.25, 0.55], seed: 78, color: '#34502a'}).forEach((b) => bladeItem(b, o.t).draw(p, c));
  (o.fore ?? []).forEach((b) => bladeItem(b, o.t).draw(p, c));
  void ell;
};

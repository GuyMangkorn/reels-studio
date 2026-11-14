import {hardFill, inkLine} from '../kit/draw';
import {mixColor} from '../kit/painter';
import {qy, qz, wp, type Item} from '../kit/world';
import {camPoint} from '../kit/ycam';
import {CAST, type Who} from './cast';
import {lit, type Light, type Painter, type Pt, type V3, type YCam} from './core';
import {RC, waterColorAt} from './river';

// N16-11 R2 river waterline (EDU-EP16 shot 16; Boss, 14 Nov 2026): a person (or any upright prop) standing IN the shallow river shows nothing below the water plane.
// `waterlineItem` is a sorted item placed a hair nearer the lens than the figure it covers: a water-coloured sheet from the river bed up to the plane at `level` m across the
// figure's width, a tint band just under the line, and two animated ripple rings round the legs. The figure is drawn normally; this item hides what is below the line.
// (Creatures take `BeastPlace.waterline`, which clips their parts; people are drawn as flat card figures, so a sheet is the equivalent.)

/** Water plane height (m) at a person's knee: 0.28 of standing height (kit cast definitions). */
export const kneeLevel = (who: Who): number => 0.28 * CAST[who].height;
export type WaterlineOpts = {L: Light; /** half width of the sheet (m): the figure's own footprint, so the sheet does not wipe out the rock or reeds beside it (B-R15B-01); default 0.34 */ w?: number; t?: number; seed?: number; /** water colour at the line (default the river's) */ color?: string};
/** The sheet polygon in the picture (null when the figure is behind the lens); exported for the cover test. */
export const waterlineSheet = (c: YCam, at: V3, level: number, w = 0.55): Pt[] => wp(c, qz(at[2] + 0.04, at[0] - w, at[0] + w, Math.min(-0.05, at[1] - 0.05), level));
/** Sutherland-Hodgman: `subject` clipped to the convex polygon `clip` (both picture polygons). */
export const clipConvex = (subject: Pt[], clip: Pt[]): Pt[] => {
  let area = 0;
  clip.forEach((a, i) => { const b = clip[(i + 1) % clip.length]; area += a[0] * b[1] - b[0] * a[1]; });
  const sgn = area >= 0 ? 1 : -1;
  let out = subject;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], inside = (q: Pt) => sgn * ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) >= 0;
    const inter = (p: Pt, q: Pt): Pt => { const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]), d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]), u = d1 / (d1 - d2); return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u]; };
    const inp = out; out = [];
    inp.forEach((p, k) => { const q = inp[(k + 1) % inp.length], ip = inside(p), iq = inside(q); if (ip) out.push(p); if (ip !== iq) out.push(inter(p, q)); });
  }
  return out;
};
/** Fill `shape` (a convex picture polygon) with the river surface it covers, band by band (shallows, mid band, deep channel), so it matches the painted river exactly at every screen row. */
const fillAsRiver = (p: Painter, c: YCam, shape: Pt[], x: number, L: Light, seed: number, color?: string) => {
  hardFill(p, seed, color ? lit(L, color) : lit(L, RC.water), shape);
  if (color) return;
  ([[-6.6, -2.6, mixColor(lit(L, RC.waterDeep), lit(L, RC.water), 0.4)], [-5.4, -3.8, lit(L, RC.waterDeep)]] as const).forEach(([z0, z1, col], i) => {
    const q = clipConvex(shape, wp(c, qy(0.012 + i * 0.001, x - 6, x + 6, z0, z1)));
    if (q.length > 2) hardFill(p, seed + 1 + i, col, q);
  });
};
/** `at` is the figure's feet (world y = the river bed under it, e.g. -0.12 in 0.12 m of water); `level` is the water plane as a WORLD y (0 in the river: the plane is y 0; `kneeLevel(who)` is a height above the feet, pass `at[1] + kneeLevel(who)`). */
export const waterlineItem = (at: V3, level: number, o: WaterlineOpts): Item => ({at, bias: -0.06, draw: (p: Painter, c: YCam) => {
  const w = o.w ?? 0.34, seed = o.seed ?? 28000, t = o.t ?? 0, glint = lit(o.L, RC.glint);
  const col = (z: number) => o.color ? lit(o.L, o.color) : waterColorAt(z, o.L);
  // 1) the sheet from the bed to the plane across the figure, 2) the surface ellipse round the legs; each painted in the river's own bands behind it
  // the sheet hides the submerged body; where it reaches past the near shoreline (high lens) the bank must hide it instead, so that part is filled with the bank's own sand and grass bands
  const sheet = waterlineSheet(c, at, level, w * 0.85);
  if (sheet.length < 3) return;
  const bank = (poly: Pt[]) => ([[0, 1.4, RC.sand, 0.004], [1.4, 14, RC.bankGrass, 0.003]] as const).forEach(([z0, z1, col, y], i) => { const q = clipConvex(poly, wp(c, qy(y, at[0] - 6, at[0] + 6, z0, z1))); if (q.length > 2) hardFill(p, seed + 5 + i, lit(o.L, col), q); });
  const water = clipConvex(sheet, wp(c, qy(0.01, at[0] - 6, at[0] + 6, -8, 0)));
  if (water.length > 2) fillAsRiver(p, c, water, at[0], o.L, seed, o.color);
  const shore = camPoint(c, [at[0], 0, 0]);
  if (shore && sheet.some((q) => q[1] > shore[1] + 1)) bank(clipConvex(sheet, [[-1e5, shore[1]], [1e5, shore[1]], [1e5, 1e5], [-1e5, 1e5]]));
  const surf = Array.from({length: 14}, (_, j) => camPoint(c, [at[0] + (w + 0.12) * Math.cos((j / 13) * Math.PI), level, at[2] + 0.02 + 0.42 * Math.sin((j / 13) * Math.PI)]));
  if (surf.every(Boolean)) fillAsRiver(p, c, surf as Pt[], at[0], o.L, seed + 10, o.color);
  // a thin bright line along the surface edge and two expanding ripple rings (the legs cutting the water)
  const edge = [camPoint(c, [at[0] - w, level, at[2] + 0.042]), camPoint(c, [at[0] + w, level, at[2] + 0.042])];
  if (edge[0] && edge[1]) inkLine(p, seed + 2, [edge[0], edge[1]], {closed: false, weight: 0.8, color: glint, still: true});
  for (let i = 0; i < 2; i++) {
    const ph = (t * 0.6 + i * 0.5) % 1, r = 0.14 + 0.36 * ph;
    const ring = Array.from({length: 22}, (_, j) => camPoint(c, [at[0] + r * Math.cos((j / 22) * 6.283), level + 0.004, at[2] + 0.12 + r * Math.sin((j / 22) * 6.283)]));
    if (ring.every(Boolean)) inkLine(p, seed + 20 + i, ring as Pt[], {weight: 0.7 * (1 - ph) + 0.2, color: mixColor(glint, col(at[2]), ph * 0.7), still: true, curve: 0.3});
  }
}});

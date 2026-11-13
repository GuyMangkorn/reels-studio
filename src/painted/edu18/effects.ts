import {ell, inkLine, solid, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {clamp01, ease, type V3} from '../kit/space';

// N8 shrink pop and N12 splash crown (episode copies of the EP05 `effects.ts` shrink and the EP14 splash-crown method; kit intake at W8).
// All pure functions of the shot-local EVENT frame `L`.

// ---- N8 shrink (SH02: she scales about P_S over +8..+16 ease-in, the puff ring and sparkle ticks run +12..+20 and peak on the cut at +20)
export const POP = {shrink: [8, 16] as [number, number], ring: [12, 20] as [number, number], cut: 20};
const seg = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));
/** Card scale about the touch point at SH02-local frame `L`: 1 before +8, about 0.005 at +16 (8 f ease-in, exponent 1.6 as EP05). */
export const shrinkScale = (L: number) => 1 - ease(seg(POP.shrink[0], POP.shrink[1], L) ** 1.6) * 0.995;
export const shrinkAbout = (q: Pt, c: Pt, L: number): Pt => { const s = shrinkScale(L); return [c[0] + (q[0] - c[0]) * s, c[1] + (q[1] - c[1]) * s]; };
/** Puff ring progress 0..1 (1 = the peak on the cut). */
export const popPeak = (L: number) => ease(seg(POP.ring[0], POP.ring[1], L));
/** Puff ring + 7 sparkle ticks centred on `c` (px), `r` px at the peak; `fade` < 1 lays it on a painter layer (SH03 +0..+10 the puff fades round her). */
export const paintShrinkPop = (p: Painter, c: Pt, L: number, r = 150, seed = 52000, fade = 1) => {
  const k = popPeak(L);
  if (k <= 0 || fade <= 0.02) return;
  if (fade < 1) p = p.layer(fade, seed);
  const rr = r * (0.25 + 0.75 * ease(k)), a = 0.6 + 0.4 * k;
  washAt(p, seed, '#fff1cf', 150 * a, ell(c[0], c[1], rr * 1.15, rr * 1.15, 28), 0.3, 0.1);
  const o = ell(c[0], c[1], rr, rr, 32), i = ell(c[0], c[1], rr * 0.72, rr * 0.72, 32).reverse();
  washAt(p, seed + 1, '#ffffff', 200 * a, [...o, o[0], ...i, i[0]], 0.15, 0.05);
  for (let n = 0; n < 7; n++) {
    const th = (n / 7) * 2 * Math.PI + hash(seed + n) * 0.6, d = rr * (1.05 + 0.35 * hash(seed + 20 + n)) * (0.6 + 0.4 * k), len = r * 0.07 * (0.6 + hash(seed + 40 + n));
    const x = c[0] + Math.cos(th) * d, y = c[1] + Math.sin(th) * d;
    solid(p, seed + 60 + n, '#fff1cf', [[x, y - len], [x + len * 0.25, y], [x, y + len], [x - len * 0.25, y]], 2);
    solid(p, seed + 80 + n, '#fff1cf', [[x - len, y], [x, y - len * 0.25], [x + len, y], [x, y + len * 0.25]], 2);
  }
};
/** Cut-match distance (px) between the puff centre at the last SH02 frame and the matching SH03 frame (SP1: within 40 px). */
export const cutDelta = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// ---- N12 splash crown at macro scale (P1 picture: SH17 +87, a drop lands in the puddle far below; SH18's cut lands on it)
/** Crown at `f` frames after impact (0 = the touch): radius and height in sm of a 2.51 sm bun's crown (rim jets 0.55 x the drop width, up to 0.8 sm). */
export const crownAt = (f: number, width = 2.51) => {
  const u = clamp01(f / 14);
  return {r: width * (0.25 + 0.5 * ease(u)), h: width * 0.32 * Math.sin(Math.PI * Math.min(1, u * 0.9)) * (1 - 0.3 * u), alpha: f < 0 ? 0 : 1 - 0.6 * ease(clamp01((f - 6) / 14))};
};
/** Paints the crown on the water at `at` (world sm, on the surface): a flat ring on the water, 12 rim lobes standing up with a bead at each tip, and the
 * fling of 7 small drops. Fallback of the brief (a ring of ripples and a few flung drops) is the same call with `jets: false`. */
export const paintSplashCrown = (p: Painter, c: YCam, at: V3, f: number, o: {width?: number; jets?: boolean; seed?: number; lineW?: number; flat?: boolean} = {}) => {
  if (f < 0) return;
  const w = o.width ?? 2.51, cr = crownAt(f, w), s = o.seed ?? 52500, g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  const ring = (rad: number, n = 28): Pt[] => Array.from({length: n}, (_, i) => { const a = (i / n) * 2 * Math.PI, q = camPoint(c, [at[0] + rad * Math.cos(a), at[1], at[2] + rad * Math.sin(a)], c.near ?? 0.3); return q ?? g; });
  washAt(p, s, '#c9dde4', 70 * cr.alpha, ring(cr.r * 1.2), 0.2, 0.1);
  if (o.flat) { // looked at from straight above (SH17): a bright filled annulus so the crown is the brightest thing on the water
    const o1 = ring(cr.r * 1.35), i1 = ring(cr.r * 0.55).reverse();
    washAt(p, s + 3, '#eef6f8', 235 * cr.alpha, [...o1, o1[0], ...i1, i1[0]], 0.1, 0.05);
    washAt(p, s + 4, '#ffffff', 150 * cr.alpha, ring(cr.r * 0.5), 0.1, 0.05);
  }
  inkLine(p, s + 1, ring(cr.r), {weight: o.lineW ?? Math.min(6, Math.max(1, u * 0.05)), color: '#e8f4f6', curve: 0.2, still: true});
  inkLine(p, s + 2, ring(cr.r * 1.35), {weight: o.lineW ? o.lineW * 0.8 : Math.min(4, Math.max(0.8, u * 0.03)), color: mixColor('#e8f4f6', '#6a7a82', 0.5), curve: 0.2, still: true});
  if (o.jets === false) return;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 2 * Math.PI + 0.2 * hash(s + i), h = cr.h * (0.7 + 0.5 * hash(s + 20 + i)), base = camPoint(c, [at[0] + cr.r * Math.cos(a), at[1], at[2] + cr.r * Math.sin(a)], c.near ?? 0.3), tip = camPoint(c, [at[0] + cr.r * (o.flat ? 1.3 : 1.1) * Math.cos(a), at[1] + h, at[2] + cr.r * (o.flat ? 1.3 : 1.1) * Math.sin(a)], c.near ?? 0.3);
    if (!base || !tip) continue;
    inkLine(p, s + 40 + i, [base, tip], {weight: Math.min(6, Math.max(1, u * 0.05)), color: '#eaf6f8', closed: false, curve: 0.2, still: true});
    washAt(p, s + 60 + i, '#f4fbfc', 200 * cr.alpha, ell(tip[0], tip[1], Math.min(6, Math.max(o.flat ? 3 : 1.5, u * 0.07)), Math.min(6, Math.max(o.flat ? 3 : 1.5, u * 0.07)), 8), 0, 0);
  }
  for (let i = 0; i < 7; i++) {
    const a = hash(s + 80 + i) * 2 * Math.PI, d = cr.r * (0.9 + 1.6 * hash(s + 100 + i)) * (0.4 + 0.6 * clamp01(f / 10)), hh = cr.h * (1.1 + 1.4 * hash(s + 120 + i)) * Math.sin(Math.PI * clamp01(f / 18));
    const q = camPoint(c, [at[0] + d * Math.cos(a), at[1] + hh, at[2] + d * Math.sin(a)], c.near ?? 0.3);
    if (q) washAt(p, s + 140 + i, '#e8f4f6', 190 * cr.alpha, ell(q[0], q[1], Math.min(5, Math.max(o.flat ? 3 : 1.4, u * 0.06)), Math.min(5, Math.max(o.flat ? 3 : 1.4, u * 0.06)), 8), 0, 0);
  }
};

/** Pass 4 (D4-17): the SH17 crown's outer ring (1.35 r at full open) is 6.5 sm across: width 3.2 sm (r = 0.75 w). */
export const CROWN_W = 3.2;
export const RIPPLE_R1 = 7; // not 8: at 20.6 px/sm (projection, f 1300, 63.4 sm above the water) 8 sm puts the ring's bottom at y 1164, over the 1145 limit; 7 sm = y 1143.6
/** One ripple ring from the SH17 crown's edge: radius 3.25 -> 7 sm over +76..+87 (shot-local), 2 px `#e0eef2`, alpha 0.6 -> 0.2. */
export const paintCrownRipple = (p: Painter, c: YCam, at: V3, L: number, o: {from?: number; to?: number; seed?: number} = {}) => {
  const a = o.from ?? 76, b = o.to ?? 87;
  if (L < a) return;
  const u = clamp01((L - a) / (b - a)), r = 3.25 + (RIPPLE_R1 - 3.25) * ease(u), al = 0.6 - 0.4 * u;
  const pts = Array.from({length: 40}, (_, i) => camPoint(c, [at[0] + r * Math.cos((i / 40) * 2 * Math.PI), at[1], at[2] + r * Math.sin((i / 40) * 2 * Math.PI)], c.near ?? 0.3));
  if (!pts.every((q): q is Pt => !!q)) return;
  inkLine(p.layer(al, (o.seed ?? 52700) + 1), (o.seed ?? 52700), pts, {weight: 2, color: '#e0eef2', curve: 0.2, still: true});
};

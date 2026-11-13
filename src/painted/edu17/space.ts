// EDU-EP17 N10 atom + loupe + speck ring and N11 balance (Boss, W5.2 group 5). Production versions of the approved look frames LF04 atom pick B and LF04 balance pick A
// (`look-b-space.ts` stays as the look record and supplies the space backdrop, the soft atom ball and the Earth ball). Shots: SH13 (Earth limb, loupe, atom), SH14 (balance),
// SH15 (inset loupe over the street). Everything is a pure function of the shot-local frame `f` (ROWS-R2.3 clocks), so a seek gives the same pixels. Pixels, y down.
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {EARTH_COL} from '../kit/earth';
import {hash} from '../kit/hash';
import {lerp, mixColor, ramp, type Painter, type Pt} from '../kit/painter';
import {paintAtom, paintEarthBall, paintSpace, SP} from './look-b-space';
import {bottomShade} from './shade';

export const W = 1080, H = 1920;
export const SH13_LEN = 93, SH14_LEN = 90, SH15_LEN = 87;
const KEY = '#1a2140';

// ---- clipping to a circle (the loupe glass) -------------------------------------------------------------------------------------------------------------------------

/** Sutherland-Hodgman against a convex polygon wound by increasing angle (see `circlePts`). */
export const clipPoly = (pts: Pt[], clip: Pt[]): Pt[] => {
  let out = pts;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], inp = out;
    const side = (q: Pt) => (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
    out = [];
    for (let j = 0; j < inp.length; j++) {
      const cur = inp[j], prev = inp[(j + inp.length - 1) % inp.length], sc = side(cur), sp = side(prev);
      if (sc >= 0) {
        if (sp < 0) { const k = sp / (sp - sc); out.push([prev[0] + (cur[0] - prev[0]) * k, prev[1] + (cur[1] - prev[1]) * k]); }
        out.push(cur);
      } else if (sp >= 0) { const k = sp / (sp - sc); out.push([prev[0] + (cur[0] - prev[0]) * k, prev[1] + (cur[1] - prev[1]) * k]); }
    }
  }
  return out;
};
export const circlePts = (cx: number, cy: number, r: number, n = 72): Pt[] => Array.from({length: n}, (_, i) => [cx + r * Math.cos((i / n) * 6.2832), cy + r * Math.sin((i / n) * 6.2832)] as Pt);

/** A painter whose polygons are clipped to the circle (c, r); a spline survives only when all its points are inside. Layers keep the clip. */
export const clipTo = (p: Painter, cx: number, cy: number, r: number): Painter => {
  const clip = circlePts(cx, cy, r);
  const raw = p.brush as unknown as Record<string, unknown>;
  const brush = new Proxy(raw, {
    get: (t, k) => {
      const v = t[k as string];
      if (k === 'polygon') return (pts: Pt[], ...rest: unknown[]) => { const c = clipPoly(pts, clip); if (c.length >= 3) (v as (...a: unknown[]) => void).call(t, c, ...rest); };
      if (k === 'spline') return (pts: Pt[], ...rest: unknown[]) => { if (pts.every(([x, y]) => Math.hypot(x - cx, y - cy) <= r)) (v as (...a: unknown[]) => void).call(t, pts, ...rest); };
      return typeof v === 'function' ? (v as (...a: unknown[]) => unknown).bind(t) : v;
    },
  }) as unknown as Painter['brush'];
  return {...p, brush, layer: (a, s) => clipTo(p.layer(a, s), cx, cy, r)};
};

// ---- the marker ring (R2.2: one style wherever the ring appears) -------------------------------------------------------------------------------------------------------

const annulus = (cx: number, cy: number, r0: number, r1: number, n = 48): Pt[] => [...ell(cx, cy, r1, r1, n), ...ell(cx, cy, r0, r0, n).reverse()];
const arcBand = (cx: number, cy: number, r0: number, r1: number, sweep: number, n = 48): Pt[] => {
  const k = Math.max(2, Math.ceil(n * sweep)), outer: Pt[] = [], inner: Pt[] = [];
  for (let i = 0; i <= k; i++) { const a = -Math.PI / 2 + (i / k) * sweep * Math.PI * 2; outer.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); inner.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); }
  return [...outer, ...inner.reverse()];
};
/** Marker ring of radius `r` (centre line), stroke `w` px `#ffd34a` with a 2 px `#1a2140` keyline and a 6 px soft glow. `sweep` 0-1 draws it on clockwise from the top; `alpha` fades it. */
export const paintMarkerRing = (p: Painter, seed: number, cx: number, cy: number, r: number, o: {w?: number; sweep?: number; alpha?: number} = {}) => {
  const w = o.w ?? 5, sweep = o.sweep ?? 1, q = (o.alpha ?? 1) >= 0.999 ? p : p.layer(o.alpha ?? 1, seed + 5000);
  if (sweep <= 0.001 || (o.alpha ?? 1) <= 0.003) return;
  const band = (r0: number, r1: number) => (sweep >= 0.999 ? annulus(cx, cy, r0, r1) : arcBand(cx, cy, r0, r1, sweep));
  washAt(q, seed + 1, SP.ring, 70, band(r + w / 2, r + w / 2 + 6), 0, 0);
  hardFill(q, seed + 2, KEY, band(r - w / 2 - 2, r + w / 2 + 2));
  hardFill(q, seed + 3, SP.ring, band(r - w / 2, r + w / 2));
};

// ---- N10: SH13 Earth limb -> loupe -> atom ---------------------------------------------------------------------------------------------------------------------------

/** The limb scene (+0 to +36): arc centre (540, 3200), radius 2600 (top y 600); Thailand and the crowd patch on the top; the 44 px marker ring on the patch (R2.2: 5 px). */
export const LIMB = {c: [540, 3200] as Pt, R: 2600, patch: [540, 600] as Pt, ring: 22};
const limbPt = (theta: number, depth = 0): Pt => [LIMB.c[0] + (LIMB.R - depth) * Math.sin(theta), LIMB.c[1] - (LIMB.R - depth) * Math.cos(theta)];
export const paintLimb = (p: Painter) => {
  const {c, R} = LIMB;
  paintSpace(p, [540, 560], {stars: 140});
  // atmosphere glow outside the limb, then the disc
  for (let i = 0; i < 5; i++) washAt(p, 3000 + i, EARTH_COL.limbOut, 40 + 10 * i, ell(c[0], c[1], R + 46 - i * 9, R + 46 - i * 9, 160), 0, 0);
  hardFill(p, 3010, EARTH_COL.ocean, ell(c[0], c[1], R, R, 180));
  for (let i = 0; i < 7; i++) washAt(p, 3011 + i, mixColor(EARTH_COL.ocean, EARTH_COL.ocean2, (i + 1) / 7), 120, ell(c[0] - 40, c[1] + 70 + i * 40, R - 80 - i * 55, R - 80 - i * 55, 160), 0, 0);
  // land under the patch: Southeast Asia as a few blobs hugging the arc, inside the disc by construction
  const blob = (k: number, th: number, depth: number, rx: number, ry: number, col: string) => {
    const [bx, by] = limbPt(th, depth), pts: Pt[] = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2, w = 1 + 0.2 * Math.sin(3 * a + k * 1.7) + 0.12 * Math.sin(5 * a + k * 2.9); let x = bx + rx * w * Math.cos(a), y = by + ry * w * Math.sin(a); const d = Math.hypot(x - c[0], y - c[1]); if (d > R - 3) { x = c[0] + ((x - c[0]) * (R - 3)) / d; y = c[1] + ((y - c[1]) * (R - 3)) / d; } pts.push([x, y]); }
    hardFill(p, 3030 + k, col, pts);
  };
  blob(1, 0.0, 40, 150, 60, EARTH_COL.land); blob(2, -0.12, 60, 120, 55, EARTH_COL.land2); blob(3, 0.14, 50, 130, 45, EARTH_COL.land); blob(4, 0.0, 14, 60, 20, '#8aa05f');
  for (let i = 0; i < 8; i++) { const th = (hash(i * 3 + 1) - 0.5) * 0.4, d = 20 + hash(i * 3 + 2) * 260, [x, y] = limbPt(th, d); washAt(p, 3040 + i, EARTH_COL.cloud, 190, ell(x, y, 70 + hash(i) * 90, 9 + hash(i + 4) * 8, 14, (hash(i + 2) - 0.5) * 0.3), 0, 0); }
  // limb darkening ring and the bright atmosphere line
  for (let i = 0; i < 4; i++) washAt(p, 3060 + i, '#0e2a5a', 40, annulus(c[0], c[1], R - 70 - 40 * i, R, 180), 0, 0);
  inkLine(p, 3070, Array.from({length: 33}, (_, i) => limbPt(-0.24 + (0.48 * i) / 32)), {color: EARTH_COL.limbOut, weight: 1.2, closed: false, still: true});
  // the crowd patch: a 4 px bump in the ring
  hardFill(p, 3080, '#6b6560', ell(LIMB.patch[0], LIMB.patch[1] + 1, 2.4, 2, 8));
  paintMarkerRing(p, 3090, LIMB.patch[0], LIMB.patch[1], LIMB.ring);
  bottomShade(p, 1000, 0.62, 98000, '#070c1c');
};

/** Loupe clock (R2.3): opens from the patch +22-+36 (circle grows and travels to the frame centre, the glass magnifies 0.05 -> 1), full frame after. */
export const loupeAt = (f: number): {open: number; c: Pt; r: number; m: number} => {
  const open = ramp(f, 22, 36);
  return {open, c: [lerp(LIMB.patch[0], 540, open), lerp(LIMB.patch[1], 960, open)], r: lerp(LIMB.ring + 6, 1260, open), m: lerp(0.05, 1, open)};
};
export const PIV: Pt = [540, 960];
/** Atom scene inside the loupe: surface row at y 760 (hero 360 px at (540, 760)), packed rows below, darker with depth; push 6 % +38-+92 about (600, 900); the marker ring draws on at
 * +40-+45 on the hero's lower edge (44 px across x push), the 3 px speck appears at +45 (grows in over 2 f), the leader follows. `c` and `m` place and magnify the picture in the glass. */
export const atomGeo = (f: number, c: Pt = PIV, m = 1) => {
  const s = 1 + 0.06 * ramp(f, 38, 92), o: Pt = [600, 900];
  const T = ([x, y]: Pt): Pt => [c[0] + (o[0] + (x - o[0]) * s - PIV[0]) * m, c[1] + (o[1] + (y - o[1]) * s - PIV[1]) * m];
  return {s, k: s * m, T, hero: T([540, 760]), speck: T([612, 932]), ring: 22 * s * m, leader: T([700, 560])};
};
export const paintAtomGlass = (p: Painter, f: number, c: Pt = PIV, m = 1, r = 1e9, marks = true, clipAt: Pt = c) => {
  const full = r >= 1180, q = full ? p : clipTo(p, clipAt[0], clipAt[1], r), g = atomGeo(f, c, m);
  paintSpace(q, [clipAt[0], clipAt[1] + 20 * m], {stars: full ? 90 : 20});
  const cull = (pt: Pt, rad: number) => Math.hypot(pt[0] - clipAt[0], pt[1] - clipAt[1]) - rad > r;
  for (let row = 3; row >= 1; row--) for (let i = -2; i <= 3; i++) {
    const x = 540 + (i - (row % 2) * 0.5) * 340 + (hash(row * 9 + i) - 0.5) * 30, y = 760 + row * 300, t = g.T([x, y]);
    if (!cull(t, 180 * g.k) && t[1] - 180 * g.k < H) paintAtom(q, 200 + row * 40 + (i + 2) * 6, t[0], t[1], 180 * g.k, 0.45 + 0.17 * row);
  }
  for (const i of [-1, 1]) { const t = g.T([540 + i * 360, 772 + i * 6]); if (!cull(t, 176 * g.k)) paintAtom(q, 400 + i * 10, t[0], t[1], 176 * g.k, 0.3); }
  if (!cull(g.hero, 180 * g.k)) paintAtom(q, 450, g.hero[0], g.hero[1], 180 * g.k, 0);
  if (!marks) return;
  const sw = ramp(f, 40, 45), sa = ramp(f, 45, 47);
  if (sa > 0) hardFill(q, 500, SP.speck, ell(g.speck[0], g.speck[1], 1.6 * g.k * sa, 1.6 * g.k * sa, 8));
  if (sw > 0) {
    paintMarkerRing(q, 510, g.speck[0], g.speck[1], g.ring, {sweep: sw});
    if (sw >= 0.999) {
      const dir = Math.atan2(g.leader[1] - g.speck[1], g.leader[0] - g.speck[0]);
      inkLine(q, 503, [[g.speck[0] + g.ring * Math.cos(dir), g.speck[1] + g.ring * Math.sin(dir)], g.leader], {color: SP.ring, weight: 0.9, closed: false, still: true});
    }
  }
  // the caption band stays mid-dark (the packed rows run under it)
  bottomShade(q, 1000, 0.7, 97000, '#070c1c');
};
/** The glass rim: a brass ring with a highlight arc, drawn over the edge of the circle. */
export const paintLoupeRim = (p: Painter, seed: number, cx: number, cy: number, r: number, w = 8) => {
  hardFill(p, seed, SP.brassSh, annulus(cx, cy, r - 1, r + w + 3, 72));
  hardFill(p, seed + 1, SP.brass, annulus(cx, cy, r, r + w, 72));
  const a0 = Math.PI * 1.05, a1 = Math.PI * 1.45;
  hardFill(p.layer(0.8, seed + 2), seed + 2, SP.brassHi, [...Array.from({length: 13}, (_, i) => [cx + (r + w * 0.7) * Math.cos(a0 + ((a1 - a0) * i) / 12), cy + (r + w * 0.7) * Math.sin(a0 + ((a1 - a0) * i) / 12)] as Pt), ...Array.from({length: 13}, (_, i) => [cx + (r + w * 0.2) * Math.cos(a1 - ((a1 - a0) * i) / 12), cy + (r + w * 0.2) * Math.sin(a1 - ((a1 - a0) * i) / 12)] as Pt)]);
};

/** SH13 (93 f): limb +0-+22 (still), loupe +22-+36, atom +36-+92 (push +38-+92, ring +40, speck +45). */
export const paintSh13 = (p: Painter, f: number) => {
  const L = loupeAt(f);
  if (L.open < 0.999) paintLimb(p);
  if (L.open > 0) {
    paintAtomGlass(p, f, L.c, L.m, L.r);
    if (L.open < 0.999) paintLoupeRim(p, 3200, L.c[0], L.c[1], L.r);
  }
};

// ---- N10: SH15 inset loupe over the street --------------------------------------------------------------------------------------------------------------------------

/** SH15 inset content (BRIEF-R2.5): shot 13's own +92 atom picture (space ground, hero with its left/right neighbours and the row beneath) through the clip at scale 0.35 (hero ~126 px),
 * centred on the hero's lower edge (the settled speck position) at the disc centre. The marks (speck, ring) are the inset's own: ring 44 px screen size. */
const INSET_M = 0.35 / 1.06, INSET_C: Pt = [850, 430];
const g92 = atomGeo(92, PIV, INSET_M), INSET_PIC: Pt = [INSET_C[0] - (g92.speck[0] - PIV[0]), INSET_C[1] - (g92.speck[1] - PIV[1])];
const g92c = atomGeo(92, INSET_PIC, INSET_M), HERO_V: Pt = [g92c.hero[0] - INSET_C[0], g92c.hero[1] - INSET_C[1]];
export const INSET = {c: INSET_C, r: 150, hero: g92c.hero, R: Math.hypot(HERO_V[0], HERO_V[1]), pic: INSET_PIC, m: INSET_M};
/** Inset clock (R2.3): opens +20-+28, the speck hangs 34 px off the hero's edge, slides back onto the edge line +36-+46, the ring fades +46-+60, the inset closes +70-+78. */
export const insetAt = (f: number) => ({r: INSET.r * ramp(f, 20, 28) * (1 - ramp(f, 70, 78)), off: 34 * (1 - ramp(f, 36, 46)), ring: 1 - ramp(f, 46, 60)});
export const insetSpeck = (f: number): Pt => { const d = INSET.R + insetAt(f).off, u: Pt = [-HERO_V[0] / INSET.R, -HERO_V[1] / INSET.R]; return [INSET.hero[0] + u[0] * d, INSET.hero[1] + u[1] * d]; };
export const paintInset = (p: Painter, f: number) => {
  const {r, ring} = insetAt(f);
  if (r < 3) return;
  const [cx, cy] = INSET.c, q = clipTo(p, cx, cy, r);
  paintAtomGlass(p, 92, INSET.pic, INSET.m, r, false, INSET.c);
  const sp = insetSpeck(f);
  hardFill(q, 720, SP.speck, ell(sp[0], sp[1], 1.6, 1.6, 8));
  paintMarkerRing(q, 730, sp[0], sp[1], 22, {alpha: ring});
  paintLoupeRim(p, 740, cx, cy, r, 6);
};

// ---- N11: SH14 balance ----------------------------------------------------------------------------------------------------------------------------------------------------

export const BAL = {pivot: [560, 560] as Pt, half: 380, stop: 28, pan: 150, hang: 270, base: 1500, earthR: 165, ringR: 26};
/** Beam angle (deg, Earth side down): level +0-+2, slams to the 28 deg stop by +10 (accelerating, u^2.2), rebounds short of the stop (28 -> 26 -> 28 half sine, low point 26 at +14) and rests on it from +18 (BRIEF-R2.5). Never above 28. */
export const beamAngle = (f: number): number => {
  if (f <= 2) return 0;
  if (f <= 10) return BAL.stop * Math.pow((f - 2) / 8, 2.2);
  if (f <= 18) return BAL.stop - 2 * Math.sin((Math.PI * (f - 10)) / 8);
  return BAL.stop;
};
/** Pan sway (px): the flung crowd pan swings +11 to +40 (decaying), the Earth pan shivers +10 to +22. */
export const panSway = (f: number, side: 'crowd' | 'earth'): number => side === 'crowd' ? 14 * Math.max(0, 1 - (f - 10) / 30) * Math.sin((f - 10) * 0.9 + 1) * (f >= 10 ? 1 : 0) : 3 * Math.max(0, 1 - (f - 10) / 12) * Math.sin((f - 10) * 1.3) * (f >= 10 ? 1 : 0);
/** Geometry at frame f (before the +41-+89 push): beam ends, pan centres, the speck. */
export const balanceGeo = (f: number) => {
  const th = (beamAngle(f) * Math.PI) / 180, [px, py] = BAL.pivot, L = BAL.half;
  const le: Pt = [px - L * Math.cos(th), py + L * Math.sin(th)], re: Pt = [px + L * Math.cos(th), py - L * Math.sin(th)];
  const lp: Pt = [le[0] + panSway(f, 'earth'), le[1] + BAL.hang], rp: Pt = [re[0] + panSway(f, 'crowd'), re[1] + BAL.hang];
  return {th, le, re, lp, rp, speck: [rp[0], rp[1] - 6] as Pt, earth: [lp[0], lp[1] - BAL.earthR - 4] as Pt};
};
export const PUSH_FROM: Pt = [895, 640];
export const pushAt = (f: number) => 1 + 0.08 * ramp(f, 41, 89);

export const paintBalance = (p: Painter, f: number) => {
  const g = balanceGeo(f), s = pushAt(f), T = ([x, y]: Pt): Pt => [PUSH_FROM[0] + (x - PUSH_FROM[0]) * s, PUSH_FROM[1] + (y - PUSH_FROM[1]) * s];
  const hi = SP.brassHi, [px, py] = BAL.pivot, ca = Math.cos(g.th), sa = Math.sin(g.th);
  paintSpace(p, [300, 1000], {stars: 140});
  bottomShade(p, 1100, 0.45, 96000, '#070c1c'); // under the brass: the band stays mid-dark, the column and base keep their light
  const poly = (seed: number, col: string, pts: Pt[]) => hardFill(p, seed, col, pts.map(T));
  // column and base (the base sits under the caption band)
  poly(10, SP.brassSh, [[px - 14, py + 10], [px + 14, py + 10], [px + 20, BAL.base], [px - 20, BAL.base]]);
  poly(11, SP.brass, [[px - 10, py + 10], [px + 2, py + 10], [px + 4, BAL.base], [px - 14, BAL.base]]);
  hardFill(p, 12, SP.brassSh, ell(...T([px, 1530]), 190 * s, 34 * s, 30));
  hardFill(p, 13, SP.brass, ell(...T([px, 1518]), 186 * s, 30 * s, 30));
  washAt(p, 14, hi, 150, ell(...T([px - 70, 1512]), 80 * s, 10 * s, 16), 0, 0);
  // pans: three chains from the beam end to the rim, the shallow bowl
  const pan = (end: Pt, c: Pt, k: number) => {
    const rim: Pt[] = [[c[0] - BAL.pan, c[1]], [c[0], c[1] + 8], [c[0] + BAL.pan, c[1]]];
    rim.forEach((q, i) => inkLine(p, 30 + k * 4 + i, [T(end), T(q)], {color: i === 1 ? SP.brassSh : SP.brass, weight: 1.1, closed: false, still: true}));
    poly(40 + k * 5, SP.brassSh, [[c[0] - BAL.pan, c[1]], [c[0] + BAL.pan, c[1]], [c[0] + 110, c[1] + 34], [c[0] - 110, c[1] + 34]]);
    hardFill(p, 41 + k * 5, SP.brass, ell(...T(c), BAL.pan * s, 16 * s, 30));
    washAt(p, 42 + k * 5, hi, 160, ell(...T([c[0] - 60, c[1] + 18]), 50 * s, 6 * s, 12), 0, 0);
  };
  pan(g.le, g.lp, 0);
  const e = T(g.earth);
  paintEarthBall(p, 600, e[0], e[1], BAL.earthR * s);
  poly(47, SP.brass, [[g.lp[0] - 150, g.lp[1]], [g.lp[0] - 120, g.lp[1] + 6], [g.lp[0] + 120, g.lp[1] + 6], [g.lp[0] + 150, g.lp[1]], [g.lp[0] + 130, g.lp[1] + 14], [g.lp[0] - 130, g.lp[1] + 14]]);
  pan(g.re, g.rp, 1);
  // beam, pointer, pivot boss
  const bw = 16, nx = sa * bw, ny = ca * bw, le = g.le, re = g.re;
  poly(50, SP.brassSh, [[le[0] - nx, le[1] - ny], [re[0] - nx, re[1] - ny], [re[0] + nx, re[1] + ny], [le[0] + nx, le[1] + ny]]);
  poly(51, SP.brass, [[le[0] - nx, le[1] - ny], [re[0] - nx, re[1] - ny], re, le]);
  inkLine(p, 52, [T([le[0] - nx * 0.7, le[1] - ny * 0.7]), T([re[0] - nx * 0.7, re[1] - ny * 0.7])], {color: hi, weight: 0.8, closed: false, still: true});
  poly(53, SP.brassSh, [[px - 6, py], [px + 6, py], [px + 6 * ca + 130 * sa, py + 130 * ca], [px - 6 * ca + 130 * sa, py + 130 * ca]]);
  hardFill(p, 54, SP.brass, ell(...T([px, py]), 30 * s, 30 * s, 20));
  washAt(p, 55, hi, 200, ell(...T([px - 9, py - 10]), 11 * s, 8 * s, 10), 0, 0);
  for (const q of [le, re]) hardFill(p, 56 + q[0], SP.brassSh, ell(...T(q), 12 * s, 12 * s, 12));
  // the crowd: a 4 px grey speck in the right pan with the 52 px marker ring
  const sp = T(g.speck);
  hardFill(p, 70, '#6b6560', ell(sp[0], sp[1], 2.2 * s, 2 * s, 8));
  paintMarkerRing(p, 72, sp[0], sp[1], BAL.ringR * s);
  return g;
};

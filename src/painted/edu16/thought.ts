import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {paintNebula, paintStars} from '../kit/stars';
import {TH} from './palette';

// N3 thought-space kit (brief EDU-EP16-BRIEF-R2, IM1-IM4 and W-STRIKE; Film look, W3 2026-11-14; Boss hardens). Screen-space pieces in 1080x1920 px,
// pure functions of their arguments: the void with dust, the frame-filling ragged bubble rim (normal and the rim-only black state), the blooming
// bubble with its three dots, the two light points, the thread and bead, the one strike flash and its shock ring. Method from edu14/bubble.ts (copy,
// no kit change). Seeds 46000-46999 belong to this file.

const W = 1080, Hh = 1920;

/** The void: near-black, a faint cold nebula along `diag` (two picture points) and dim star dust at infinity (`dust` 0..1; 0 = off, W-STRIKE black). */
export const paintVoid = (p: Painter, o: {cam: YCam; t: number; dust?: number; nebula?: number; diag?: [Pt, Pt]}) => {
  hardFill(p, 46000, TH.void, [[-10, -10], [W + 10, -10], [W + 10, Hh + 10], [-10, Hh + 10]]);
  const nb = o.nebula ?? 1;
  if (nb > 0) {
    // A lifted mid value under everything (UT03: no large flat black), then nebula blobs.
    washAt(p, 46001, TH.voidLift, 255 * nb, ell(540, 1000, 820, 1150, 28), 0, 0);
    paintNebula(p, [0, 120, W, 1800], [TH.nebula, TH.nebula2], 0.9 * nb);
    if (o.diag) {
      const [[ax, ay], [bx, by]] = o.diag, n = 7;
      for (let i = 0; i < n; i++) {
        const k = (i + 0.5) / n, x = ax + (bx - ax) * k, y = ay + (by - ay) * k;
        washAt(p, 46010 + i, TH.nebula2, 70 * nb, ell(x, y, 260 + 60 * hash(i + 3), 170 + 40 * hash(i + 9), 18, Math.atan2(by - ay, bx - ax)), 0, 0);
      }
    }
  }
  const d = o.dust ?? 1;
  if (d > 0) paintStars(p, o.cam, TH.void, {seed: 16, count: 260, alpha: 0.42 * d, t: o.t, color: '#c9d4ea', big: 0.04});
};

/** Inner edge of the frame rim at angle index i of n (a ragged super-ellipse 30-60 px in from the frame edge, breathing +-4 px). */
const rimInner = (i: number, n: number, t: number, inset: number): Pt => {
  const a = (i / n) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), e = 2 / 9;
  const w = 45 + 12 * Math.sin(a * 5 + 1.3) + 7 * Math.sin(a * 13 + 0.4) + 6 * (hash(i * 1.7 + 4) - 0.5) + 4 * Math.sin(t * 1.4 + a * 2) + inset;
  return [540 + (540 - w) * Math.sign(ca) * Math.abs(ca) ** e, 960 + (960 - w) * Math.sign(sa) * Math.abs(sa) ** e];
};
const rimOuter = (i: number, n: number): Pt => {
  const a = (i / n) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), e = 2 / 9;
  return [540 + 700 * Math.sign(ca) * Math.abs(ca) ** e, 960 + 1120 * Math.sign(sa) * Math.abs(sa) ** e];
};

/**
 * The painted bubble rim that frames every imagination shot (VD09): a ragged pale wash from the frame edge inward, with a softer inner step.
 * `level` 1 = normal (TH.rimLevel of the way from void to rim); the W-STRIKE black state uses 0.35 (>= 30 %, Boat P5).
 */
export const paintFrameRim = (p: Painter, o: {t: number; level?: number}) => {
  const lv = (o.level ?? 1) * TH.rimLevel, n = 120;
  // soft inner step (14 px inward of the rim), then the rim itself out past the frame edge
  const soft = mixColor(TH.void, TH.rim, lv * 0.45), main = mixColor(TH.void, TH.rim, lv);
  for (let i = 0; i < n; i++) {
    hardFill(p, 46100 + i, soft, [rimInner(i, n, o.t, 14), rimInner(i + 1, n, o.t, 14), rimInner(i + 1, n, o.t, -2), rimInner(i, n, o.t, -2)]);
    hardFill(p, 46300 + i, main, [rimInner(i, n, o.t, 0), rimInner(i + 1, n, o.t, 0), rimOuter(i + 1, n), rimOuter(i, n)]);
  }
  // a few dry-brush streaks in the rim so it reads painted, not a flat frame
  for (let i = 0; i < 18; i++) {
    const k = Math.floor(hash(i * 5.1 + 2) * n), q = rimInner(k, n, o.t, -10), r = rimOuter(k, n), m: Pt = [q[0] + (r[0] - q[0]) * 0.04, q[1] + (r[1] - q[1]) * 0.04];
    const len = 40 + 70 * hash(i + 31), a = (k / n) * Math.PI * 2 + Math.PI / 2;
    hardFill(p, 46500 + i, mixColor(TH.void, TH.rim, lv * 1.25), ell(m[0], m[1], len, 3 + 3 * hash(i + 7), 10, a));
  }
};

/** Light point with its halo: `kind` 'hers' (amber, warm round halo) or 'theirs' (cold, short soft halo); `r` the halo radius px; `level` 0..1. */
export const paintLight = (p: Painter, o: {at: Pt; r: number; kind: 'hers' | 'theirs'; level?: number; t?: number; seed?: number}) => {
  const lv = o.level ?? 1, s = o.seed ?? (o.kind === 'hers' ? 46600 : 46620), [x, y] = o.at, t = o.t ?? 0;
  if (lv <= 0) return;
  const col = o.kind === 'hers' ? TH.amber : TH.cold, br = 1 + 0.03 * Math.sin(t * 2.1);
  washAt(p, s, col, 34 * lv, ell(x, y, o.r * 1.5 * br, o.r * 1.5 * br, 24), 0, 0);
  washAt(p, s + 1, col, 60 * lv, ell(x, y, o.r * br, o.r * br, 24), 0, 0);
  washAt(p, s + 2, col, 110 * lv, ell(x, y, o.r * 0.45, o.r * 0.45, 20), 0, 0);
  hardFill(p, s + 3, mixColor(TH.void, mixColor(col, TH.core, 0.55), lv), ell(x, y, Math.max(4, o.r * 0.13), Math.max(4, o.r * 0.13), 14));
};

/** Three thought dots from `from` toward `to` (smallest first), pale rim wash; `pop` 0..1. */
export const paintDots = (p: Painter, o: {from: Pt; to: Pt; pop?: number; seed?: number; size?: number}) => {
  const pop = o.pop ?? 1, s = o.seed ?? 46700, z = o.size ?? 1;
  [[0.18, 9], [0.48, 14], [0.8, 20]].forEach(([k, r], i) => {
    const a = Math.max(0, Math.min(1, pop * 3 - i));
    if (a <= 0) return;
    const x = o.from[0] + (o.to[0] - o.from[0]) * k, y = o.from[1] + (o.to[1] - o.from[1]) * k, rr = r * z;
    hardFill(p, s + i * 3, mixColor(TH.void, TH.rim, 0.55 * a), ell(x, y, rr, rr, 14));
    hardFill(p, s + i * 3 + 1, mixColor(TH.void, TH.bubbleIn, a), ell(x, y, rr * 0.62, rr * 0.62, 14));
  });
};

/** Scalloped cloud outline points around `at` (rx, ry), `inset` px inward. */
export const cloudPts = (at: Pt, rx: number, ry: number, inset = 0, seed = 0, n = 64): Pt[] =>
  Array.from({length: n}, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2, sc = 1 + 0.055 * Math.abs(Math.sin(a * 4.5 + seed)) + 0.02 * Math.sin(a * 11 + seed * 2);
    return [at[0] + (rx * sc - inset) * Math.cos(a), at[1] + (ry * sc - inset) * Math.sin(a)];
  });

/** A blooming thought bubble: pale ragged edge, dark navy inside (`tint` mixes the inside toward a light's colour a little). `pop` 0..1 grows it. */
export const paintBubble = (p: Painter, o: {at: Pt; rx: number; ry: number; pop?: number; seed?: number; tint?: string}) => {
  const pop = Math.max(0, Math.min(1, o.pop ?? 1)), s = o.seed ?? 46800;
  if (pop <= 0) return;
  const rx = o.rx * pop, ry = o.ry * pop, inside = o.tint ? mixColor(TH.bubbleIn, o.tint, 0.06) : TH.bubbleIn;
  hardFill(p, s, mixColor(TH.void, TH.bubbleEdge, 0.55), cloudPts(o.at, rx + 10, ry + 10, 0, s % 7));
  hardFill(p, s + 1, mixColor(TH.void, TH.rim, 0.62), cloudPts(o.at, rx, ry, 0, s % 7));
  hardFill(p, s + 2, mixColor(inside, TH.bubbleEdge, 0.18), cloudPts(o.at, rx, ry, 14, s % 7));
  hardFill(p, s + 3, inside, cloudPts(o.at, rx, ry, 30, s % 7));
  washAt(p, s + 4, mixColor(inside, o.tint ?? TH.cold, 0.12), 120, ell(o.at[0], o.at[1] + ry * 0.12, rx * 0.66, ry * 0.6, 24), 0, 0);
};

/** The thread between two lights, lit (`lit` colour) from `a` up to `upTo` (0..1) and dark after it (`shadowFrom` darkens from there on). */
export const paintThread = (p: Painter, o: {a: Pt; b: Pt; upTo?: number; dark?: number; shadowFrom?: number; seed?: number}) => {
  const s = o.seed ?? 46900, n = 24, pts = Array.from({length: n + 1}, (_, i): Pt => {
    const k = i / n;
    return [o.a[0] + (o.b[0] - o.a[0]) * k + 10 * Math.sin(k * Math.PI * 2.2) * (1 - k), o.a[1] + (o.b[1] - o.a[1]) * k];
  });
  const cut = Math.round((o.shadowFrom ?? 1) * n), dark = o.dark ?? 0;
  const lit = mixColor(mixColor(TH.void, TH.amber, 0.42), TH.void, dark), shade = mixColor(TH.void, TH.dust, 0.25);
  if (cut > 0) inkLine(p, s, pts.slice(0, cut + 1), {color: lit, weight: 1.4, curve: 0.3, closed: false, still: true});
  if (cut < n) inkLine(p, s + 1, pts.slice(cut), {color: shade, weight: 1.1, curve: 0.3, closed: false, still: true});
};

/** Point on the thread at k (0..1). */
export const threadAt = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k + 10 * Math.sin(k * Math.PI * 2.2) * (1 - k), a[1] + (b[1] - a[1]) * k];

/** The warm bead (her message) on the thread; `level` 0..1 (dim warm mid-way; 0 after the strike). */
export const paintBead = (p: Painter, at: Pt, level = 1, seed = 46950) => {
  if (level <= 0) return;
  washAt(p, seed, TH.amber, 70 * level, ell(at[0], at[1], 22, 22, 16), 0, 0);
  hardFill(p, seed + 1, mixColor(TH.void, mixColor(TH.amber, TH.core, 0.3), 0.85 * level), ell(at[0], at[1], 6.5, 6.5, 12));
};

/** The one W-STRIKE flash at contact (STK-K2): amber to a cream core, peak radius <= 150 px, drawn BEFORE the claw so the claw stays an unlit silhouette. `k` 0..1. */
export const paintStrikeFlash = (p: Painter, at: Pt, k: number, rMax = 150) => {
  if (k <= 0) return;
  const r = rMax * (0.55 + 0.45 * k);
  washAt(p, 46970, TH.amber, 70 * k, ell(at[0], at[1], r, r, 28), 0, 0);
  washAt(p, 46971, TH.amber, 120 * k, ell(at[0], at[1], r * 0.6, r * 0.6, 24), 0, 0);
  washAt(p, 46972, TH.core, 200 * k, ell(at[0], at[1], r * 0.3, r * 0.3, 20), 0, 0);
};

/** The soft amber shock ring (STK-K4): radius px and alpha 0..1 (ink cannot take alpha, so the colour is mixed toward the void). */
export const paintShockRing = (p: Painter, at: Pt, r: number, alpha: number) => {
  if (alpha <= 0.01) return;
  const pts = ell(at[0], at[1], r, r, 40);
  inkLine(p, 46980, pts, {color: mixColor(TH.void, TH.amber, 0.75 * alpha), weight: 2.6, curve: 0.3, still: true});
  inkLine(p, 46981, ell(at[0], at[1], r - 7, r - 7, 40), {color: mixColor(TH.void, TH.amber, 0.35 * alpha), weight: 1.6, curve: 0.3, still: true});
};

/** A dark world limb under a light (IM1's "her light on a dark curve", reused for IM2's two worlds): a big disc edge with a thin atmosphere line of the
 *  light's colour and a few soft value steps, so the lower frame is textured mid-dark, not flat black (UT03). `c` disc centre, `r` radius px. */
export const paintLimb = (p: Painter, o: {c: Pt; r: number; color: string; seed?: number}) => {
  const s = o.seed ?? 46560, [cx, cy] = o.c, r = o.r;
  washAt(p, s, o.color, 34, ell(cx, cy, r + 46, r + 46, 96), 0, 0);
  hardFill(p, s + 1, mixColor(TH.void, o.color, 0.45), ell(cx, cy, r + 4, r + 4, 96));
  hardFill(p, s + 2, '#0f1524', ell(cx, cy, r, r, 96));
  hardFill(p, s + 3, '#0c111d', ell(cx, cy, r - 60, r - 60, 96));
  hardFill(p, s + 4, '#090d17', ell(cx, cy, r - 170, r - 170, 96));
  for (let i = 0; i < 9; i++) { // faint land shapes on the disc
    const a = hash(i * 2.3 + s) * Math.PI * 2, d = r * (0.2 + 0.45 * hash(i * 3.7 + s)), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    washAt(p, s + 10 + i, '#141c2e', 160, ell(x, y, 60 + 90 * hash(i + s), 26 + 30 * hash(i * 1.3 + s), 14, a), 0, 0);
  }
};

import {ell, hardFill, inkLine, INK} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {hull} from '../kit/world';
import {camPoint, camPoly, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt} from '../kit/figure-at';
import {CHILD, paintSkullcap} from './cast';
import {clipPolyPainter} from './motion22';
import {CAST, DEMO} from './palette';

// DEMO22 (EDU-EP22-BRIEF-R1 set plan, space D, metres, placeless; brief N6, VD09): a plain cool-grey paper top under one soft top light, a small
// white dish with a peeled boiled egg cut in half (cut faces up, yolk visible), two plain silver strips the size of the tag (0.06 x 0.015 m),
// a small clear cup with strip B standing in it, bright. Strip A is pressed tip-first into the left yolk by the child's mitten hand (UT14) and
// tarnishes from the tip (time-compressed; truth limit 5: no clock, no label). Its plainness marks it as an illustration, not Puyi's table.
// Painted throughout (UT11): the tarnish is the brief's fallback "painted lerped fill" (the SVG gradient mask is not built; recorded).
// Origin on the paper at the dish centre; +x right, +y up, +z toward the camera; no walls and no horizon (the ground fades to the vignette).

const ringAt = (c: YCam, at: V3, r: number, y: number, n = 20, sx = 1, sz = 1): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) { const q = camPoint(c, [at[0] + r * sx * Math.cos((i / n) * 6.283), y, at[2] + r * sz * Math.sin((i / n) * 6.283)]); if (q) out.push(q); }
  return out;
};
const solidOf = (c: YCam, at: V3, prof: [number, number][], n = 20, sx = 1, sz = 1): Pt[] => hull(prof.flatMap(([r, h]) => ringAt(c, at, r, at[1] + h, n, sx, sz)));
const fill = (p: Painter, seed: number, color: string, pts: Pt[]) => { if (pts.length >= 3) hardFill(p, seed, color, pts); };

export const DISH_AT: V3 = [0, 0, 0];
export const EGG_L: V3 = [-0.02, 0.006, 0];
export const EGG_R: V3 = [0.03, 0.006, -0.026];
export const CUP_AT: V3 = [0.12, 0, -0.04];
/** Yolk surface centre of the left half (where strip A's tip goes in). */
export const YOLK_L: V3 = [EGG_L[0], EGG_L[1] + 0.018, EGG_L[2]];

/** Paper ground with a soft radial vignette (stepped flat ellipses: wash-flat, DF-20261030-p5brush-large-fill-mottle) centred on picture `ctr`. */
const paintGround = (p: Painter, ctr: Pt) => {
  hardFill(p, 29000, DEMO.vignette, [[-300, -300], [1380, -300], [1380, 2220], [-300, 2220]]);
  for (let k = 0; k < 22; k++) {
    const u = k / 21, rx = 1500 - 1000 * u, ry = 1900 - 1250 * u;
    hardFill(p, 29001 + k, mixColor(DEMO.vignette, mixColor(DEMO.paper, DEMO.light, 0.35), Math.pow(u, 0.8)), ell(ctr[0], ctr[1], rx, ry, 56));
  }
};
const shadow = (p: Painter, c: YCam, seed: number, at: V3, r: number, op = 0.3, sx = 1, sz = 1) => {
  // the top light sits slightly behind (toward -z): shadows fall a little toward +z
  const q = ringAt(c, [at[0], 0.0005, at[2] + r * 0.18], r * 1.12, 0.0005, 24, sx, sz);
  if (q.length >= 3) hardFill(p.layer(op, seed * 3), seed, '#5e646b', q);
};

const paintDish = (p: Painter, c: YCam) => {
  shadow(p, c, 29100, DISH_AT, 0.06, 0.35);
  fill(p, 29101, DEMO.dishShade, solidOf(c, DISH_AT, [[0.04, 0], [0.06, 0.008]]));
  const top = ringAt(c, DISH_AT, 0.06, 0.008, 28);
  fill(p, 29102, DEMO.dish, top);
  fill(p, 29103, mixColor(DEMO.dish, DEMO.dishShade, 0.45), ringAt(c, [DISH_AT[0], 0, DISH_AT[2] - 0.004], 0.045, 0.004, 28));
  fill(p, 29104, DEMO.dish, ringAt(c, [DISH_AT[0], 0, DISH_AT[2] + 0.003], 0.041, 0.004, 28));
  if (top.length >= 3) inkLine(p, 29105, top, {weight: 0.9, color: mixColor(DEMO.dishShade, INK, 0.45), still: true});
};

/** Half a peeled egg lying cut face up: white dome under an oval cut face, the yolk in its centre (the yolk rim a little green-grey). */
const paintEggHalf = (p: Painter, c: YCam, seed: number, at: V3, yaw: number) => {
  const sx = 1, sz = 0.72;
  const rot = (x: number, z: number): [number, number] => [x * Math.cos(yaw) - z * Math.sin(yaw), x * Math.sin(yaw) + z * Math.cos(yaw)];
  const oval = (r: number, y: number, n = 24): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.283, [dx, dz] = rot(r * sx * Math.cos(a), r * sz * Math.sin(a)); const q = camPoint(c, [at[0] + dx, y, at[2] + dz]); if (q) out.push(q); }
    return out;
  };
  shadow(p, c, seed + 9, at, 0.024, 0.25, 1.1, 0.8);
  fill(p, seed, DEMO.eggShade, hull([...oval(0.022, at[1]), ...oval(0.0275, at[1] + 0.008), ...oval(0.028, at[1] + 0.016)]));
  const face = oval(0.0275, at[1] + 0.017);
  fill(p, seed + 1, DEMO.eggWhite, face);
  fill(p, seed + 2, DEMO.yolkRim, oval(0.0145, at[1] + 0.0175, 20));
  fill(p, seed + 3, DEMO.yolk, oval(0.0128, at[1] + 0.018, 20));
  fill(p.layer(0.5, seed * 3 + 4), seed + 4, mixColor(DEMO.yolk, '#fff3c8', 0.5), oval(0.005, at[1] + 0.0182, 12).map(([x, y]) => [x - 4, y - 3] as Pt));
  if (face.length >= 3) inkLine(p, seed + 5, face, {weight: 0.8, color: mixColor(DEMO.eggShade, INK, 0.4), still: true});
};

/** A silver strip from `a` (tip) to `b` (0.015 m wide, normal `n`), tarnished from the tip to fraction `tarnish` (soft front over `soft`). */
export const paintStrip = (p: Painter, c: YCam, seed: number, a: V3, b: V3, side: V3, tarnish: number, soft = 0.1) => {
  const N = 24, w = 0.0075, P = (u: number, s: number): V3 => [a[0] + (b[0] - a[0]) * u + side[0] * w * s, a[1] + (b[1] - a[1]) * u + side[1] * w * s, a[2] + (b[2] - a[2]) * u + side[2] * w * s];
  const T = DEMO.tarnish;
  // W3.1 LF02 (viewer check H-C): the tarnished part reads grey-black from the tip to the front (T[2] -> T[1]), then a short soft edge through
  // T[0] into bright silver, so "the first ~40 % dark, the tail bright" reads at 540 px.
  const colAt = (u: number) => {
    if (tarnish <= 0) return DEMO.strip;
    if (u <= tarnish) return mixColor(T[2], T[1], u / tarnish);
    const k = Math.min(1, (u - tarnish) / soft);
    return k < 0.5 ? mixColor(T[1], T[0], k * 2) : mixColor(T[0], DEMO.strip, (k - 0.5) * 2);
  };
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N, pts = [P(u0, -1), P(u1 + 0.002, -1), P(u1 + 0.002, 1), P(u0, 1)].map((v) => camPoint(c, v));
    if (pts.every(Boolean)) fill(p, seed + i, colAt((u0 + u1) / 2), pts as Pt[]);
  }
  // the highlight runs only on the bright part (the darkening strip loses it)
  const h0 = Math.min(0.95, tarnish + soft + 0.04), hl = [P(h0, 0.15), P(0.97, 0.15), P(0.97, 0.55), P(h0, 0.55)].map((v) => camPoint(c, v));
  if (h0 < 0.9 && hl.every(Boolean)) fill(p, seed + 30, DEMO.stripHi, hl as Pt[]);
  const out = [P(0, -1), P(1, -1), P(1, 1), P(0, 1)].map((v) => camPoint(c, v));
  if (out.every(Boolean)) inkLine(p, seed + 31, out as Pt[], {weight: 0.8, color: mixColor(DEMO.stripShade, INK, 0.5), still: true});
};

/** Small clear cup (Ø 0.06 m, h 0.05 m) with clear liquid and strip B standing in it, leaning on the rim, bright. */
/** Strip B's pose in the cup (tip on the bottom, leaning on the far rim): the W3 default. */
export const STRIP_B_CUP = {tip: [CUP_AT[0] - 0.008, 0.004, CUP_AT[2] + 0.006] as V3, top: [CUP_AT[0] + 0.012, 0.058, CUP_AT[2] - 0.022] as V3, side: [0.94, 0, 0.34] as V3};
export type StripPose = {tip: V3; top: V3; side: V3};
const paintCup = (p: Painter, c: YCam, b: StripPose = STRIP_B_CUP) => {
  shadow(p, c, 29300, CUP_AT, 0.03, 0.22);
  const body = solidOf(c, CUP_AT, [[0.026, 0], [0.03, 0.05]]);
  fill(p.layer(0.55, 29301 * 3), 29301, DEMO.glass, body);
  fill(p.layer(0.5, 29302 * 3), 29302, DEMO.liquid, solidOf(c, CUP_AT, [[0.0255, 0.002], [0.0285, 0.034]]));
  fill(p.layer(0.6, 29303 * 3), 29303, mixColor(DEMO.liquid, '#ffffff', 0.4), ringAt(c, CUP_AT, 0.0285, 0.034, 24));
  // strip B: from the bottom of the cup up to lean on the far rim
  paintStrip(p, c, 29310, b.tip, b.top, b.side, 0);
  fill(p.layer(0.35, 29330 * 3), 29330, DEMO.liquid, solidOf(c, CUP_AT, [[0.0255, 0.002], [0.0285, 0.033]]));
  const rim = ringAt(c, CUP_AT, 0.03, 0.05, 28);
  if (rim.length >= 3) inkLine(p, 29331, rim, {weight: 0.9, color: '#8a949c', still: true});
  if (body.length >= 3) inkLine(p, 29332, body, {weight: 0.8, color: '#8a949c', still: true});
  const g = camPoint(c, [CUP_AT[0] + 0.02, 0.03, CUP_AT[2] + 0.025]), u = camUnit(c, CUP_AT);
  if (g) fill(p, 29333, '#ffffff', [[g[0] - 0.002 * u, g[1] - 0.012 * u], [g[0] + 0.002 * u, g[1] - 0.012 * u], [g[0] + 0.003 * u, g[1] + 0.012 * u], [g[0] - 0.001 * u, g[1] + 0.012 * u]]);
};

export type MittenTone = {robe: string; robeShade: string; skin: string; skinShade: string; ink: string; seed: number; size: number};
const CHILD_MITTEN: MittenTone = {robe: CAST.childRobe, robeShade: CAST.childRobeShade, skin: CAST.childSkin, skinShade: '#d9a37a', ink: '#8a5a3a', seed: 29400, size: 1};
/** W5.1: the taster's mitten and slate sleeve (B03-SH08 close cover-lift), an adult hand 1.6x the child's. */
export const TASTER_MITTEN: MittenTone = {robe: CAST.eunuchRobe, robeShade: CAST.eunuchRobeShade, skin: '#cf9f74', skinShade: '#b4855c', ink: '#6e4a2e', seed: 29500, size: 1.6};
/** The child's mitten hand (UT14: no drawn fingers; thumb lobe, three short finger strokes) pinching the strip's upper end at picture `pinch`,
 *  the forearm in the robe sleeve (yellow by default; `tone` W5.1) running off frame toward the lower right. `u` px per metre at the pinch. */
export const paintMitten = (p: Painter, pinch: Pt, u0: number, dir: number, tone: MittenTone = CHILD_MITTEN) => {
  const u = u0 * tone.size, S = tone.seed - 29400;
  const L = 0.06 * u, W = 0.036 * u, cs = Math.cos(dir), sn = Math.sin(dir);
  const T = (x: number, y: number): Pt => [pinch[0] + x * cs - y * sn, pinch[1] + x * sn + y * cs];
  // sleeve (robe yellow, a darker cuff) from behind the wrist to off frame
  const sl: Pt[] = [T(L * 0.85, -W * 0.7), T(L * 4.5, -W * 1.1), T(L * 4.5, W * 1.4), T(L * 0.85, W * 0.85)];
  fill(p, 29400 + S, tone.robe, sl);
  fill(p, 29401 + S, tone.robeShade, [T(L * 0.85, -W * 0.7), T(L * 1.15, -W * 0.78), T(L * 1.15, W * 0.95), T(L * 0.85, W * 0.85)]);
  inkLine(p, 29402 + S, sl, {weight: 1.0, color: mixColor(tone.robeShade, INK, 0.5), still: true});
  // mitten: palm and fingers in one rounded shape, fingertips at the pinch
  const mit: Pt[] = [T(-L * 0.12, -W * 0.05), T(-L * 0.02, -W * 0.42), T(L * 0.35, -W * 0.58), T(L * 0.85, -W * 0.55), T(L * 0.9, W * 0.55), T(L * 0.45, W * 0.62), T(L * 0.05, W * 0.45)];
  fill(p, 29410 + S, tone.skin, mit);
  fill(p.layer(0.5, 29411 + S * 3), 29411 + S, tone.skinShade, [T(L * 0.3, W * 0.2), T(L * 0.88, W * 0.25), T(L * 0.88, W * 0.55), T(L * 0.4, W * 0.6)]);
  inkLine(p, 29412 + S, mit, {weight: 1.2, color: tone.ink, still: true});
  for (let k = 0; k < 3; k++) inkLine(p, 29413 + S + k, [T(L * 0.02 + k * 0.03 * L, -W * (0.18 - k * 0.12) + W * 0.08), T(L * 0.2 + k * 0.03 * L, -W * (0.2 - k * 0.12) + W * 0.08)], {closed: false, weight: 0.9, color: '#a8724f', still: true});
  // thumb lobe on top, pressing the strip from the near side
  const th: Pt[] = [T(-L * 0.06, -W * 0.5), T(L * 0.08, -W * 0.8), T(L * 0.3, -W * 0.82), T(L * 0.4, -W * 0.55), T(L * 0.18, -W * 0.38)];
  fill(p, 29420 + S, mixColor(tone.skin, '#ffffff', 0.08), th);
  inkLine(p, 29421 + S, th, {weight: 1.1, color: tone.ink, still: true});
};

export type DemoState = {
  /** Strip A: 'lying' on the paper, 'pressed' tip-first into the left yolk (held by the hand), 'rim' laid on the dish rim (SH16), or a free
   *  pose (tip and tail world points; W5.1 SH13 lift, SH15). */
  stripA: 'lying' | 'pressed' | 'rim' | StripPose;
  /** Tarnish front 0..1 of strip A's length (SH14 ramps 0 -> 0.6 over the L10 words). */
  tarnish: number;
  /** W5.1 SH15: dark spots where sulfur specks landed (u along the strip from the tip, s across -1..1, k 0..1 the spot's growth). */
  spots?: {u: number; s: number; k: number}[];
  /** W5.1 SH15: sulfur specks in flight (world points; `#e8c84a`). */
  specks?: V3[];
  /** W5.1: the mitten. `on` the strip it pinches (default A when A is held); `at` a free grip point (world) before it pinches; `dir` the
   *  picture angle the sleeve runs off to (default along the held strip). Absent with stripA 'lying' / 'rim' and no `at` = no hand. */
  hand?: {on?: 'A' | 'B'; at?: V3; dir?: number};
  /** W5.1 SH16: strip B's pose (default standing in the cup). */
  stripB?: StripPose;
  /** W5.1 SH16: the child leaning in behind the table's far edge (z -0.16): ground point, size factor on the lens scale, face, look. */
  child?: {at: V3; scale: number; face: ExpressionId; look?: Pt; t: number};
};

/** Strip A's free poses: lying on the paper (SH13 start) and held above the left yolk (SH13 end = SH14 start, tip at (-0.02, 0.04, 0)). */
export const STRIP_A_LYING: StripPose = {tip: [-0.1, 0.002, 0.05], top: [-0.1 + 0.06 * Math.cos(0.35), 0.002, 0.05 + 0.06 * Math.sin(0.35)], side: [-Math.sin(0.35), 0, Math.cos(0.35)]};
export const STRIP_A_SIDE: V3 = [0.6, 0, -0.8];
/** Strip A pressed or held over the yolk with its tip at `tip` (the LF02 direction: tail toward +x, +z, slightly up). */
export const stripAOver = (tip: V3): StripPose => ({tip, top: [tip[0] + 0.048, tip[1] + 0.01, tip[2] + 0.036], side: STRIP_A_SIDE});
export const STRIP_A_PRESSED = stripAOver([YOLK_L[0], YOLK_L[1] - 0.003, YOLK_L[2]]);
/** Strip A laid on the dish rim, tarnished end on the rim (SH16 l 8). */
export const STRIP_A_RIM: StripPose = {tip: [-0.05, 0.012, 0.045], top: [-0.05 - 0.055, 0.003, 0.045 + 0.024], side: [0.4, 0, 0.92]};
const along = (q: StripPose, u: number): V3 => [q.tip[0] + (q.top[0] - q.tip[0]) * u, q.tip[1] + (q.top[1] - q.tip[1]) * u, q.tip[2] + (q.top[2] - q.tip[2]) * u];
export const gripOf = (q: StripPose): V3 => along(q, 0.97);

/** Dark speck spots on strip A (SH15): each a small round blot in the darkest tarnish tone, growing with its `k`. */
const paintSpots = (p: Painter, c: YCam, q: StripPose, spots: NonNullable<DemoState['spots']>) => {
  const u0 = camUnit(c, q.tip);
  spots.forEach((sp, i) => {
    if (sp.k <= 0) return;
    const w = along(q, sp.u), at: V3 = [w[0] + q.side[0] * 0.0075 * sp.s * 0.7, w[1] + 0.0004, w[2] + q.side[2] * 0.0075 * sp.s * 0.7], pt = camPoint(c, at);
    if (pt) fill(p.layer(0.9, 29700 + i * 3), 29700 + i, DEMO.tarnish[2], ell(pt[0], pt[1], 0.0034 * u0 * sp.k, 0.0026 * u0 * sp.k, 12));
  });
};

/** DEMO22 at one frame (back to front: ground, [child behind the far edge], dish, eggs, cup, strip A, specks, hand). */
export const paintDemo = (p: Painter, c: YCam, st: DemoState) => {
  const ctr = camPoint(c, [0.02, 0, 0]) ?? [540, 900];
  paintGround(p, ctr);
  if (st.child) {
    // SH16: the child leans in behind the demo top's far edge (z -0.16): painted first, then the top is laid again in front of him (the same
    // stepped vignette, clipped to the top's picture polygon) so the table hides his body below the edge; a lit edge line marks it.
    const ch = st.child;
    paintFigureAt(p, c, CHILD, {at: ch.at, t: ch.t, pose: 'P01', view: 'front', fig: {quarter: 'left', quarterDeg: 30}, face: ch.face, faceState: ch.look ? {look: ch.look} : undefined, scale: ch.scale, shadow: false,
      held: (q, an) => paintSkullcap(q, an, 'front', 29800)});
    const top = camPoly(c, [[-1, 0, EDGE_Z], [1, 0, EDGE_Z], [1, 0, 1.2], [-1, 0, 1.2]]);
    if (top.length >= 3) {
      paintGround(clipPolyPainter(p, top), ctr);
      const e0 = camPoint(c, [-1, 0, EDGE_Z]), e1 = camPoint(c, [1, 0, EDGE_Z]);
      if (e0 && e1) inkLine(p, 29790, [e0, e1], {closed: false, weight: 1.4, color: mixColor(DEMO.paper, '#ffffff', 0.5), still: true});
    }
  }
  const bPose = st.stripB ?? STRIP_B_CUP;
  paintCup(p, c, bPose);
  paintDish(p, c);
  paintEggHalf(p, c, 29200, EGG_L, 0.25);
  paintEggHalf(p, c, 29230, EGG_R, -0.4);
  const a: StripPose = st.stripA === 'lying' ? STRIP_A_LYING : st.stripA === 'pressed' ? STRIP_A_PRESSED : st.stripA === 'rim' ? STRIP_A_RIM : st.stripA;
  const free = typeof st.stripA === 'object', held = st.stripA === 'pressed' || free;
  // W5.1 (Film LF02 note): a soft contact shadow of a held strip on the paper (straight down, a little toward +z) and under a pressed tip
  if (held) {
    const s0 = camPoint(c, [a.tip[0], 0.0006, a.tip[2] + 0.004 + a.tip[1] * 0.2]), s1 = camPoint(c, [a.top[0], 0.0006, a.top[2] + 0.004 + a.top[1] * 0.2]), us = camUnit(c, a.tip);
    if (s0 && s1) fill(p.layer(0.16, 29460 * 3), 29460, '#5e646b', [[s0[0], s0[1] - 0.004 * us], [s1[0], s1[1] - 0.004 * us], [s1[0], s1[1] + 0.004 * us], [s0[0], s0[1] + 0.004 * us]]);
  }
  if (st.stripA === 'pressed') {
    const t = camPoint(c, [YOLK_L[0] + 0.002, YOLK_L[1] + 0.0003, YOLK_L[2] + 0.004]), u = camUnit(c, YOLK_L);
    if (t) fill(p.layer(0.45, 29465 * 3), 29465, DEMO.yolkShade, ell(t[0], t[1], 0.0075 * u, 0.0035 * u, 14));
  }
  paintStrip(p, c, 29500, a.tip, a.top, a.side, st.tarnish);
  if (st.spots) paintSpots(p, c, a, st.spots);
  if (st.stripA === 'pressed') {
    // the yolk closes over the buried tip: a small yolk lip in front of it
    const lip = camPoint(c, [YOLK_L[0], YOLK_L[1] + 0.0005, YOLK_L[2] + 0.003]), u = camUnit(c, YOLK_L);
    if (lip) fill(p, 29540, DEMO.yolk, ell(lip[0], lip[1], 0.006 * u, 0.0026 * u, 14));
  }
  for (const [i, w] of (st.specks ?? []).entries()) {
    const q = camPoint(c, w), u = camUnit(c, w);
    if (q) { fill(p, 29600 + i, '#e8c84a', ell(q[0], q[1], 0.0016 * u, 0.0016 * u, 8)); fill(p.layer(0.6, 29640 + i * 3), 29640 + i, '#fff2b0', ell(q[0] - 0.0004 * u, q[1] - 0.0004 * u, 0.0007 * u, 0.0007 * u, 6)); }
  }
  // the hand: on strip A while A is held, on strip B when `on` B, or free at `at`
  const h = st.hand, on = h?.on ?? (held ? 'A' : undefined);
  const gripW = h?.at ?? (on === 'A' ? gripOf(a) : on === 'B' ? gripOf(bPose) : undefined);
  if (!gripW) return;
  const pinch = camPoint(c, gripW);
  if (!pinch) return;
  const ref = on === 'B' ? bPose : a, t0 = camPoint(c, ref.tip), t1 = camPoint(c, gripOf(ref));
  const dir = h?.dir ?? (t0 && t1 ? Math.atan2(t1[1] - t0[1], t1[0] - t0[0]) : 0.6);
  // soft shadow of the hand and sleeve on the paper (top light slightly behind: it falls toward +z); W5.1 a little darker (Film LF02 note)
  const sh = camPoint(c, [gripW[0] + 0.016, 0.0005, gripW[2] + 0.02 + gripW[1] * 0.3]), us = camUnit(c, gripW);
  if (sh) fill(p.layer(0.2, 29450 * 3), 29450, '#5e646b', ell(sh[0], sh[1], 0.032 * us, 0.016 * us, 24, dir));
  paintMitten(p, pinch, us, dir);
};
const EDGE_Z = -0.16;

// ------------------------------------------------------------------------------------------------ W5.1 demo moves
/** The demo-top camera of a sheet line (space D): eye = at.y + r tan(-pitch), as `SH14` in looks.ts. */
export const demoCam = (at: V3, yawDeg: number, r: number, pitchDeg: number, f: number, hy: number, near?: number): YCam => {
  const pc = (pitchDeg * Math.PI) / 180;
  return {...orbitYCam(at, r, (yawDeg * Math.PI) / 180, at[1] + r * Math.tan(-pc), f, hy), pitch: pc, ...(near ? {near} : {})};
};
const l3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
/** Blend two strip poses (tip, tail and the across vector). */
export const lerpStrip = (a: StripPose, b: StripPose, k: number): StripPose => ({tip: l3(a.tip, b.tip, k), top: l3(a.top, b.top, k), side: l3(a.side, b.side, k)});
/** A point along a strip from the tip (u 0) to the tail (u 1). */
export const stripAt = (q: StripPose, u: number): V3 => along(q, u);

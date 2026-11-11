import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';

// `new: mosquito` (brief EDU-EP18-BRIEF-R1.2 N1, VD03; Film's look-defining card, W3). The striped Thai ยุงลาย of the soi (Q-F1, user
// 2026-11-11): a slim black body with white bands across the abdomen, a white lyre on the thorax, long black legs with white rings at the
// base of each tarsal segment (the hind legs' last segment nearly all white), white knee spots, a long dark proboscis with one white band
// at 2/3, white-tipped palps, two clear wings with grey veins, a dark eye with one glint. No species name anywhere (species limit).
// A flat card squared to the lens (flea.ts method). UNITS: body lengths (bl): head front to abdomen tip = 1.0 bl (4.0 mm = 1.62 sm, her
// height), so `len` (px per bl) is the whole scale input and one drawing serves the 50 px full-size insert and the 843 px macro close.
// Local body frame: drawn about the waist (thorax/abdomen join), x toward the head, y up (dorsal), rotated by the state's pitch; the anchor
// `g` is the body's midpoint (X0 shift), so a storyboard's body-centre point and head-to-tail span map directly.
// Views: `left` / `right` (side, head toward screen left / right) and `below` (ventral, seen from beneath: the rider pressed on a drop's
// underside; `squash` < 1 foreshortens it for an oblique lens). States: hover (nose 15 deg down, legs hanging back and down, wings
// beating), pressed (flat on a water face: legs radial and relaxed, wings folded back), tip (legs spread wide; the shot rolls the card),
// clear (wings open and beating, legs trailing, flying off). Wingbeat clock 1.3 Hz on screen (the ~600 Hz beat at 1/450 real time,
// brief D10); `blur` draws the full-size blur fan instead of one wing. Under 120 px per bl the marks switch to a legible small-size set:
// 3 broad abdomen bands, white leg dots and knee spots at a 2 px floor (brief palette: "at 50 px ... 3 abdomen bands and white leg dots").
// Pure function of `t` (ambient wingbeat); every mark has its own seed (washes never boil), ink boils.

export const MOSQ = {
  body: '#1c1a1c', sheen: '#3a3d48', rim: '#6a7284', white: '#f1efe8', wing: '#e8eef2', vein: '#8a8a84', eye: '#141214', glint: '#ffffff',
  ink: '#0e0d10', shadow: '#1a1c22',
} as const;
/** Wingbeat on screen (Hz): the macro slow-motion clock (R06 ambient). */
export const MOSQ_BEAT_HZ = 1.3;
/** Body length in the two worlds (brief: 4.0 mm real; 1.62 sm in `M`). */
export const MOSQ_BL_M = 0.004, MOSQ_BL_SM = 1.62;

export type MosqState = 'hover' | 'pressed' | 'tip' | 'clear';
export type MosqView = 'left' | 'right' | 'below';
export type MosqOpts = {
  view: MosqView;
  state?: MosqState;
  /** Seconds on the ambient clock (wingbeat phase). */
  t?: number;
  /** Full-size blur fan for beating wings (B01-SH01, B05-SH04/SH05); default true when len < 120. */
  blur?: boolean;
  /** Wingbeat rate (Hz on screen); default 1.3. */
  beatHz?: number;
  /** `below` only: vertical foreshortening of the ventral view for an oblique lens (1 = straight up from beneath). */
  squash?: number;
  /** Extra whole-card pitch (deg, nose up positive): tip-roll and fly-off arcs. */
  pitchAdd?: number;
  /** Rim colour along the dorsal edge (the shop glow or the cool sky); default the cool sky rim. */
  rimColor?: string;
  /** `below` only: head toward screen left instead of right. */
  mirror?: boolean;
};

export type MosqMeasure = {head: Pt; tail: Pt; centre: Pt; toes: Pt[]; left: number; right: number; top: number; bottom: number};

const DEG = Math.PI / 180;
type Leg = {fem: number; tib: number; tar: number; curl?: number};
type SidePose = {pitch: number; wing: 'beat' | 'fold' | 'open'; fore: Leg; mid: Leg; hind: Leg};

// Segment lengths (bl): femur, tibia, tarsus. Hind leg 2.0 bl (8 mm), fore 1.5, mid 1.6 (brief sizes).
const LEN = {fore: [0.42, 0.45, 0.63], mid: [0.45, 0.5, 0.65], hind: [0.5, 0.55, 0.95]} as const;
const HIP = {fore: [0.2, -0.09] as Pt, mid: [0.14, -0.11] as Pt, hind: [0.08, -0.1] as Pt};
// Tarsal sub-segments (share of the tarsus) and the white ring at the base of each (bl).
const TAR = [0.36, 0.2, 0.16, 0.14, 0.14];
/** Waist-to-centre shift: the card's anchor `g` is the body's midpoint (head front +0.43, abdomen tip -0.615 in the waist frame). */
const X0 = 0.0925;
/** Head front to abdomen tip in drawing units: `len` is divided by it so the drawn body is exactly 1 bl (legs scale with it). */
export const BODY_SPAN = 1.045;
/** Far-side legs: hip offset (bl) up and back; their segment angles add 7 / 6 / 5 deg. */
const FAR_OFF: Pt = [-0.035, 0.03];
const RING = 0.032;

/** Side-view poses: absolute segment directions in the body frame (deg from +x toward +y). */
export const SIDE_POSES: Record<MosqState, SidePose> = {
  // hover: nose 15 deg down; fore legs down and a little forward, mid down, hind legs hanging back and down
  hover: {pitch: -15, wing: 'beat', fore: {fem: -45, tib: -75, tar: -92, curl: -5}, mid: {fem: -78, tib: -95, tar: -108, curl: -5}, hind: {fem: -100, tib: -112, tar: -122, curl: 6}},
  // pressed (side read of the rider): body level, legs splayed out flat fore and aft, wings folded back along the abdomen
  // (the face is above the back: legs rise to it and run along it, never above the dorsal line + 0.02)
  pressed: {pitch: 0, wing: 'fold', fore: {fem: 25, tib: 4, tar: -2, curl: -2}, mid: {fem: -28, tib: -6, tar: -10, curl: 2}, hind: {fem: 160, tib: 178, tar: 182, curl: 2}},
  // tip: legs spread as wide as they go (the air catches them, O1); wings still folded
  tip: {pitch: 4, wing: 'fold', fore: {fem: 40, tib: 22, tar: 8, curl: -4}, mid: {fem: -70, tib: -78, tar: -84}, hind: {fem: -150, tib: -168, tar: -178, curl: 4}},
  // clear: wings open and beating, legs trailing back, nose a little up
  clear: {pitch: 6, wing: 'beat', fore: {fem: -110, tib: -138, tar: -152, curl: -4}, mid: {fem: -128, tib: -152, tar: -164, curl: -4}, hind: {fem: -150, tib: -166, tar: -176, curl: 6}},
};

/** Below-view leg fans: angle of each leg from +x (deg) on the near (+) side, and a knee bend (deg). */
const BELOW_POSES: Record<MosqState, {fore: number; mid: number; hind: number; bend: number; wings: number}> = {
  hover: {fore: 60, mid: 100, hind: 140, bend: -22, wings: 70},
  pressed: {fore: 42, mid: 96, hind: 150, bend: -16, wings: 6},
  tip: {fore: 28, mid: 90, hind: 162, bend: -5, wings: 6},
  clear: {fore: 70, mid: 115, hind: 150, bend: -20, wings: 75},
};

const lp = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const dirv = (deg: number): Pt => [Math.cos(deg * DEG), Math.sin(deg * DEG)];
const add = (a: Pt, d: Pt, l: number): Pt => [a[0] + d[0] * l, a[1] + d[1] * l];
const ellL = (cx: number, cy: number, rx: number, ry: number, a = 0, n = 22): Pt[] =>
  Array.from({length: n}, (_, i) => { const th = (i / n) * 2 * Math.PI, x = rx * Math.cos(th), y = ry * Math.sin(th); return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]; });
const bandPoly = (pts: Pt[], w0: number, w1: number): Pt[] => {
  if (pts.length < 2) return [];
  const L: Pt[] = [], R: Pt[] = [];
  pts.forEach((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    L.push([q[0] - (dy / n) * w, q[1] + (dx / n) * w]); R.push([q[0] + (dy / n) * w, q[1] - (dx / n) * w]);
  });
  return [...L, ...R.reverse()];
};
const band = (p: Painter, seed: number, pts: Pt[], w0: number, w1: number, color: string, passes = 3) => {
  const poly = bandPoly(pts, w0, w1);
  if (poly.length) solid(p, seed, color, poly, passes);
};

/** Leg joints in the body frame for a side pose: hip, knee, ankle, then the tarsal joints to the tip. */
export const legJoints = (hip: Pt, leg: Leg, lens: readonly number[]): Pt[] => {
  const knee = add(hip, dirv(leg.fem), lens[0]), ankle = add(knee, dirv(leg.tib), lens[1]);
  const out: Pt[] = [hip, knee, ankle];
  let q = ankle, a = leg.tar;
  TAR.forEach((s) => { q = add(q, dirv(a), lens[2] * s); out.push(q); a += leg.curl ?? 0; });
  return out;
};

/** Wing angle (deg, body frame) on the wingbeat clock: a slow visible flap between up-back and level-back. */
export const wingAngle = (t: number, hz = MOSQ_BEAT_HZ) => 118 + 42 * Math.sin(2 * Math.PI * hz * t);

/** Paints the mosquito with its body centre (waist) at screen `g` and `len` px per body length. Returns key points (px). */
export const drawMosquito = (p: Painter, g: Pt, len: number, o: MosqOpts): MosqMeasure => {
  // hardening (W5.2): a card behind the lens or a degenerate scale draws nothing and measures as a point, never NaN geometry in the brush calls
  if (!Number.isFinite(g[0]) || !Number.isFinite(g[1]) || !Number.isFinite(len) || len < 0.5) return {head: g, tail: g, centre: g, toes: [], left: g[0], right: g[0], top: g[1], bottom: g[1]};
  const q = o.squash === undefined ? o : {...o, squash: Math.min(1, Math.max(0.2, o.squash))};
  return q.view === 'below' ? drawBelow(p, g, len / BODY_SPAN, q) : drawSide(p, g, len / BODY_SPAN, q);
};

const drawSide = (p: Painter, g: Pt, len: number, o: MosqOpts): MosqMeasure => {
  const dir = o.view === 'left' ? -1 : 1, state = o.state ?? 'hover', pose = SIDE_POSES[state], fine = len >= 120, t = o.t ?? 0;
  const pitch = (pose.pitch + (o.pitchAdd ?? 0)) * DEG, c = Math.cos(pitch), s = Math.sin(pitch);
  const S = ([x0, y]: Pt): Pt => { const x = x0 + X0, rx = x * c - y * s, ry = x * s + y * c; return [g[0] + dir * rx * len, g[1] - ry * len]; };
  const SP = (pts: Pt[]) => pts.map(S);
  const W = Math.max(0.5, len / 600), px = (v: number, min: number) => Math.max(min, v * len);
  const white = MOSQ.white, rim = o.rimColor ?? MOSQ.rim;
  const blur = o.blur ?? !fine;

  // ---- wings behind the body (far wing first)
  const root: Pt = [0.12, 0.1];
  const wingShape = (ang: number, k = 1): Pt[] => {
    const d = dirv(ang), n: Pt = [-d[1], d[0]], L = 0.8 * k, wd = 0.085;
    const pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12, w = wd * Math.sin(Math.PI * Math.min(1, u * 1.08)) * (1 - 0.25 * u); pts.push([root[0] + d[0] * L * u + n[0] * w, root[1] + d[1] * L * u + n[1] * w]); }
    for (let i = 12; i >= 0; i--) { const u = i / 12, w = wd * 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.08)); pts.push([root[0] + d[0] * L * u - n[0] * w, root[1] + d[1] * L * u - n[1] * w]); }
    return pts;
  };
  const paintWing = (ang: number, seed: number, alpha: number) => {
    const P = wingShape(ang);
    washAt(p, seed, MOSQ.wing, 84 * alpha, SP(P), 0, 0);
    if (len >= 60) {
      inkLine(p, seed + 1, SP(P), {weight: 0.7 * W, color: mixColor(MOSQ.vein, '#ffffff', 0.1), curve: 0.2});
      const d = dirv(ang), n: Pt = [-d[1], d[0]];
      [0.03, -0.015, -0.045].forEach((off, i) => inkLine(p, seed + 2 + i, SP([[root[0] + n[0] * off * 0.3, root[1] + n[1] * off * 0.3], [root[0] + d[0] * 0.72 + n[0] * off, root[1] + d[1] * 0.72 + n[1] * off]]), {weight: 0.5 * W, color: MOSQ.vein, closed: false, curve: 0.3}));
    }
  };
  if (pose.wing === 'fold') {
    paintWing(176, 20100, 1);
  } else if (blur) {
    // blur fan: the swept stroke as a soft translucent wedge, one faint wing at the beat's position
    const a0 = 76, a1 = 160, fan: Pt[] = [root];
    for (let i = 0; i <= 14; i++) fan.push(add(root, dirv(a0 + ((a1 - a0) * i) / 14), 0.78));
    washAt(p, 20110, mixColor(MOSQ.wing, rim, 0.25), 42, SP(fan), 0.1, 0);
    washAt(p, 20111, MOSQ.wing, 30, SP(fan.map((q, i) => (i === 0 ? q : lp(root, q, 0.7)))), 0.05, 0);
    paintWing(state === 'clear' ? wingAngle(t, o.beatHz) + 12 : wingAngle(t, o.beatHz), 20120, 0.7);
  } else {
    const a = wingAngle(t, o.beatHz) + (state === 'clear' ? 12 : 0);
    paintWing(a + 9, 20130, 0.8); // far wing a little behind
  }

  // ---- far legs (offset up and back, slightly lighter so the near set reads in front)
  const paintLeg = (key: 'fore' | 'mid' | 'hind', far: boolean, seed: number) => {
    const hip0 = HIP[key], hip: Pt = far ? [hip0[0] + FAR_OFF[0], hip0[1] + FAR_OFF[1]] : hip0;
    const leg = far ? {...pose[key], fem: pose[key].fem + 7, tib: pose[key].tib + 6, tar: pose[key].tar + 5} : pose[key];
    const J = legJoints(hip, leg, LEN[key]), P = SP(J);
    const col = far ? mixColor(MOSQ.body, '#4a4e5a', 0.35) : MOSQ.body, wc = far ? mixColor(white, '#9aa0aa', 0.3) : white;
    const w = fine ? [px(0.022, 1.6), px(0.017, 1.4), px(0.011, 1.2)] : [px(0.03, 1.6), px(0.022, 1.4), px(0.014, 1.2)];
    band(p, seed, [P[0], P[1]], w[0], w[0] * 0.8, col);
    band(p, seed + 1, [P[1], P[2]], w[1], w[1] * 0.8, col);
    band(p, seed + 2, P.slice(2), w[2], w[2] * 0.6, col);
    // white knee spot, then a white ring at the base of each tarsal segment; the hind leg's last segment nearly all white
    const dot = (q: Pt, r: number, sd: number) => solid(p, sd, wc, ell(q[0], q[1], r, r, 10), 2);
    dot(P[1], px(fine ? 0.016 : 0.022, 1.3), seed + 3);
    for (let i = 0; i < 4; i++) {
      const a = P[2 + i], b = P[3 + i], segL = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.min(0.9, (RING * len) / Math.max(1, segL));
      if (fine) band(p, seed + 10 + i, [a, lp(a, b, k)], w[2] * 1.15, w[2] * 1.1, wc, 2);
      else dot(lp(a, b, 0.12), Math.max(1.1, w[2] * 0.75), seed + 10 + i);
    }
    if (key === 'hind') band(p, seed + 20, [lp(P[6], P[7], 0.08), P[7]], w[2] * 1.1, w[2] * 0.8, wc, 2);
    return P[P.length - 1];
  };
  const toes: Pt[] = [];
  (['fore', 'mid', 'hind'] as const).forEach((k, i) => toes.push(paintLeg(k, true, 20200 + i * 40)));

  // ---- body: abdomen (7 segments tapering, slight droop), thorax, head; opaque black with a cool sheen and a rim on the dorsal edge
  const segs = 7, ab: {x0: number; x1: number; h0: number; h1: number}[] = [];
  for (let i = 0; i < segs; i++) {
    const u0 = i / segs, u1 = (i + 1) / segs, x0 = -0.02 - 0.58 * u0, x1 = -0.02 - 0.58 * u1;
    ab.push({x0, x1, h0: 0.062 - 0.03 * u0 ** 1.4, h1: 0.062 - 0.03 * u1 ** 1.4});
  }
  const droop = (x: number) => -0.025 * ((-x) / 0.6) ** 2;
  const abOut: Pt[] = [...ab.map((q): Pt => [q.x0, q.h0 + droop(q.x0)]), [-0.6, droop(-0.6) + 0.01], [-0.615, droop(-0.6)], [-0.6, droop(-0.6) - 0.012],
    ...ab.slice().reverse().map((q): Pt => [q.x0, -q.h0 * 0.95 + droop(q.x0)])];
  solid(p, 20400, MOSQ.body, SP(abOut), 5);
  const thorax = ellL(0.15, 0.02, 0.16, 0.12, 0.08), head = ellL(0.36, -0.005, 0.075, 0.07);
  solid(p, 20401, MOSQ.body, SP(thorax), 5);
  solid(p, 20402, MOSQ.body, SP(ellL(0.035, 0.065, 0.045, 0.02, 0.2)), 3); // scutellum lobe
  // proboscis (long, forward and down) with one white band at 2/3; palps short, white-tipped; antennae thin
  const pb0: Pt = [0.42, -0.03], pd = dirv(-38), pb1 = add(pb0, pd, 0.5);
  band(p, 20410, [pb0, add(pb0, pd, 0.25), pb1].map(S), px(0.026, 1.6), px(0.012, 1), MOSQ.body);
  band(p, 20411, [add(pb0, pd, 0.32), add(pb0, pd, 0.37)].map(S), px(0.026, 1.8), px(0.024, 1.6), white, 2);
  const pp0: Pt = [0.42, -0.01], ppd = dirv(-22);
  band(p, 20412, [pp0, add(pp0, ppd, 0.12)].map(S), px(0.022, 1.2), px(0.018, 1), MOSQ.body);
  band(p, 20413, [add(pp0, ppd, 0.1), add(pp0, ppd, 0.135)].map(S), px(0.022, 1.2), px(0.016, 1), white, 2);
  const an0: Pt = [0.4, 0.04];
  band(p, 20414, [an0, add(an0, dirv(48), 0.12), add(add(an0, dirv(48), 0.12), dirv(62), 0.12)].map(S), px(0.012, 0.9), px(0.006, 0.7), MOSQ.body);
  solid(p, 20403, MOSQ.body, SP(head), 5);
  // abdomen white bands: the base of each segment (6 bands at full detail; 3 broad bands at small size)
  const bandIdx = fine ? [0, 1, 2, 3, 4, 5] : [1, 3, 5];
  bandIdx.forEach((i, j) => {
    const q = ab[i], wd = fine ? (q.x0 - q.x1) * 0.22 : Math.max((q.x0 - q.x1) * 0.42, 2.2 / len);
    const xa = q.x0 - 0.004, xb = xa - wd, ha = q.h0 * 0.98, hb = q.h0 * 0.96;
    const poly: Pt[] = [[xa, ha + droop(xa)], [xb, hb + droop(xb)], [xb, -hb * 0.9 + droop(xb)], [xa, -ha * 0.9 + droop(xa)]];
    solid(p, 20420 + j, white, SP(poly), 3);
  });
  // thorax: white lyre (two curved lines on the upper side) and white side patches
  const lyre = (k: number): Pt[] => Array.from({length: 9}, (_, i) => { const u = i / 8; return [0.06 + 0.2 * u, 0.06 + k * 0.02 + 0.055 * Math.sin(Math.PI * u) * (k ? 0.65 : 1)]; });
  if (fine) {
    band(p, 20430, SP(lyre(0)), 0.016 * len, 0.012 * len, white, 2);
    band(p, 20431, SP(lyre(1)), 0.012 * len, 0.009 * len, white, 2);
    [[0.12, -0.045, 0.6], [0.205, -0.05, 0.9], [0.075, -0.012, 0.3]].forEach(([x, y, a], i) => solid(p, 20432 + i, white, SP(ellL(x, y, 0.024, 0.008, a, 10)), 2));
    // abdomen: a cool sheen along the upper half and ink seams between the segments (volume at macro size)
    washAt(p, 20436, MOSQ.sheen, 150, SP([...ab.map((q): Pt => [q.x0, q.h0 * 0.85 + droop(q.x0)]), ...ab.slice().reverse().map((q): Pt => [q.x0, q.h0 * 0.35 + droop(q.x0)])]), 0.05, 0);
    ab.slice(1).forEach((q, i) => inkLine(p, 20437 + i, SP([[q.x0, q.h0 + droop(q.x0)], [q.x0 + 0.006, droop(q.x0)], [q.x0, -q.h0 * 0.95 + droop(q.x0)]]), {weight: 0.6 * W, color: '#4a4e5a', closed: false, curve: 0.4}));
  } else {
    band(p, 20430, SP(lyre(0)), Math.max(1.6, 0.03 * len), Math.max(1.4, 0.026 * len), white, 2);
    const sp = S([0.15, -0.04]);
    solid(p, 20432, white, ell(sp[0], sp[1], px(0.03, 1.2), px(0.02, 1), 8), 2);
  }
  // dorsal rim (the sky or the shop glow) and the cool sheen on the thorax
  if (len >= 40) {
    washAt(p, 20440, MOSQ.sheen, 170, SP(ellL(0.17, 0.08, 0.1, 0.03, 0.1, 12)), 0.05, 0);
    inkLine(p, 20441, SP([[0.04, 0.09], [0.12, 0.135], [0.22, 0.13], [0.3, 0.085]]), {weight: Math.max(0.6, len / 260), color: rim, closed: false, curve: 0.3});
    inkLine(p, 20442, SP(ab.map((q): Pt => [q.x0, q.h0 + droop(q.x0) + 0.004])), {weight: Math.max(0.5, len / 340), color: rim, closed: false, curve: 0.3});
  }
  // eye with one glint
  solid(p, 20450, MOSQ.eye, SP(ellL(0.37, 0.0, 0.058, 0.055, 0, 16)), 3);
  if (len >= 40) washAt(p, 20451, MOSQ.glint, 230, SP(ellL(0.385, 0.022, 0.014, 0.012, 0, 8)), 0, 0);
  if (fine) inkLine(p, 20452, SP([...abOut]), {weight: 0.7 * W, color: MOSQ.ink, curve: 0.2});

  // ---- near wing over the body when beating (sharp, full-size only) or folded (over the abdomen)
  if (pose.wing === 'fold') paintWing(172, 20460, 1);
  else if (!blur) paintWing(wingAngle(t, o.beatHz) + (state === 'clear' ? 12 : 0), 20470, 1);

  // ---- near legs
  (['fore', 'mid', 'hind'] as const).forEach((k, i) => toes.push(paintLeg(k, false, 20500 + i * 40)));

  const all = [...SP(abOut), ...SP(head), ...toes, S(pb1)];
  return {head: S([0.43, 0]), tail: S([-0.615, droop(-0.6)]), centre: g, toes,
    left: Math.min(...all.map((q) => q[0])), right: Math.max(...all.map((q) => q[0])), top: Math.min(...all.map((q) => q[1])), bottom: Math.max(...all.map((q) => q[1]))};
};

/** Ventral view: the rider pressed on a drop's underside, seen from beneath (head toward screen right for `dir` +1). */
const drawBelow = (p: Painter, g: Pt, len: number, o: MosqOpts): MosqMeasure => {
  const state = o.state ?? 'pressed', pose = BELOW_POSES[state], fine = len >= 120, t = o.t ?? 0, sq = o.squash ?? 1;
  const tilt = (o.pitchAdd ?? 0) * DEG, c = Math.cos(tilt), s = Math.sin(tilt), m = o.mirror ? -1 : 1;
  const S = ([x0, y]: Pt): Pt => { const x = x0 + X0, yy = y * sq, rx = x * c - yy * s, ry = x * s + yy * c; return [g[0] + m * rx * len, g[1] - ry * len]; };
  const SP = (pts: Pt[]) => pts.map(S);
  const px = (v: number, min: number) => Math.max(min, v * len), white = MOSQ.white, W = Math.max(0.5, len / 600);

  // wings (dorsal, behind the body from beneath): folded = a narrow V along the abdomen; open = spread to the sides on the beat clock
  const wing = (side: 1 | -1, seed: number) => {
    const open = pose.wings > 20, ang = open ? 180 - side * (pose.wings + (state === 'clear' || state === 'hover' ? 18 * Math.sin(2 * Math.PI * (o.beatHz ?? MOSQ_BEAT_HZ) * t) : 0)) : 180 - side * pose.wings;
    const r: Pt = [0.12, side * 0.04], d = dirv(ang), n: Pt = [-d[1], d[0]], pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12, w = 0.09 * Math.sin(Math.PI * Math.min(1, u * 1.08)); pts.push([r[0] + d[0] * 0.8 * u + n[0] * w * side, r[1] + d[1] * 0.8 * u + n[1] * w * side]); }
    for (let i = 12; i >= 0; i--) { const u = i / 12, w = 0.05 * Math.sin(Math.PI * Math.min(1, u * 1.08)); pts.push([r[0] + d[0] * 0.8 * u - n[0] * w * side, r[1] + d[1] * 0.8 * u - n[1] * w * side]); }
    washAt(p, seed, MOSQ.wing, 70, SP(pts), 0, 0);
    if (len >= 60) inkLine(p, seed + 1, SP(pts), {weight: 0.7 * W, color: MOSQ.vein, curve: 0.2});
  };
  wing(1, 21000); wing(-1, 21010);

  // legs: three per side, radial, each femur / tibia / tarsus with a knee bend
  const toes: Pt[] = [];
  const legs = (side: 1 | -1, seed: number) => (['fore', 'mid', 'hind'] as const).forEach((k, i) => {
    const hipX = HIP[k][0], hip: Pt = [hipX, side * (k === 'mid' ? 0.075 : 0.06)];
    const base = pose[k], a0 = side * base, bend = pose.bend * (k === 'hind' ? -1 : 1) * side;
    const J = legJoints(hip, {fem: a0, tib: a0 + bend, tar: a0 + bend * 1.4, curl: bend * 0.12}, LEN[k]), P = SP(J);
    const w = [px(0.03, 1.6), px(0.022, 1.4), px(0.014, 1.2)];
    band(p, seed + i * 30, [P[0], P[1]], w[0], w[0] * 0.8, MOSQ.body);
    band(p, seed + i * 30 + 1, [P[1], P[2]], w[1], w[1] * 0.8, MOSQ.body);
    band(p, seed + i * 30 + 2, P.slice(2), w[2], w[2] * 0.6, MOSQ.body);
    solid(p, seed + i * 30 + 3, white, ell(P[1][0], P[1][1], px(fine ? 0.016 : 0.022, 1.3), px(fine ? 0.016 : 0.022, 1.3), 10), 2);
    for (let r = 0; r < 4; r++) {
      const a = P[2 + r], b = P[3 + r], segL = Math.hypot(b[0] - a[0], b[1] - a[1]), kk = Math.min(0.9, (RING * len) / Math.max(1, segL));
      if (fine) band(p, seed + i * 30 + 10 + r, [a, lp(a, b, kk)], w[2] * 1.15, w[2] * 1.1, white, 2);
      else solid(p, seed + i * 30 + 10 + r, white, ell(lp(a, b, 0.12)[0], lp(a, b, 0.12)[1], Math.max(1.1, w[2] * 0.75), Math.max(1.1, w[2] * 0.75), 8), 2);
    }
    if (k === 'hind') band(p, seed + i * 30 + 20, [lp(P[6], P[7], 0.08), P[7]], w[2] * 1.1, w[2] * 0.8, white, 2);
    toes.push(P[P.length - 1]);
  });
  legs(1, 21100); legs(-1, 21200);

  // body from beneath: abdomen tapering, thorax broad, head round; proboscis straight forward, palps beside it
  const abOut: Pt[] = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14, x = -0.02 - 0.59 * u; abOut.push([x, 0.07 - 0.04 * u ** 1.3]); }
  for (let i = 14; i >= 0; i--) { const u = i / 14, x = -0.02 - 0.59 * u; abOut.push([x, -(0.07 - 0.04 * u ** 1.3)]); }
  solid(p, 21300, MOSQ.body, SP(abOut), 5);
  solid(p, 21301, MOSQ.body, SP(ellL(0.15, 0, 0.16, 0.115)), 5);
  const pb0: Pt = [0.42, 0], pb1: Pt = [0.92, 0];
  band(p, 21310, [pb0, pb1].map(S), px(0.026, 1.6), px(0.012, 1), MOSQ.body);
  band(p, 21311, [[0.74, 0] as Pt, [0.79, 0] as Pt].map(S), px(0.028, 1.8), px(0.026, 1.6), white, 2);
  [1, -1].forEach((k, i) => {
    band(p, 21312 + i, [[0.42, k * 0.02] as Pt, [0.55, k * 0.035] as Pt].map(S), px(0.022, 1.2), px(0.018, 1), MOSQ.body);
    band(p, 21314 + i, [[0.53, k * 0.033] as Pt, [0.57, k * 0.037] as Pt].map(S), px(0.022, 1.2), px(0.018, 1), white, 2);
    band(p, 21316 + i, [[0.4, k * 0.04] as Pt, [0.5, k * 0.12] as Pt, [0.58, k * 0.2] as Pt].map(S), px(0.012, 0.9), px(0.006, 0.7), MOSQ.body);
  });
  solid(p, 21302, MOSQ.body, SP(ellL(0.36, 0, 0.075, 0.08)), 5);
  // white abdomen bands across each segment (6 full detail, 3 broad small) and white side patches on the thorax
  const idx = fine ? [0, 1, 2, 3, 4, 5] : [1, 3, 5];
  idx.forEach((i, j) => {
    const u0 = i / 7, x0 = -0.02 - 0.59 * u0 - 0.004, wd = fine ? 0.59 / 7 * 0.22 : Math.max(0.59 / 7 * 0.42, 2.2 / len), x1 = x0 - wd;
    const h = (u: number) => 0.07 - 0.04 * u ** 1.3, ha = h(u0) * 0.96, hb = h(u0 + wd / 0.59) * 0.96;
    solid(p, 21320 + j, white, SP([[x0, ha], [x1, hb], [x1, -hb], [x0, -ha]]), 3);
  });
  [[0.16, 0.07], [0.16, -0.07], [0.08, 0.05], [0.08, -0.05]].forEach(([x, y], i) => solid(p, 21330 + i, white, SP(ellL(x, y, fine ? 0.026 : 0.034, fine ? 0.016 : 0.022, 0, 10)), 2));
  // the two eyes from beneath with glints
  [1, -1].forEach((k, i) => {
    solid(p, 21340 + i, MOSQ.eye, SP(ellL(0.37, k * 0.05, 0.045, 0.035, 0, 14)), 3);
    if (len >= 40) washAt(p, 21342 + i, MOSQ.glint, 220, SP(ellL(0.385, k * 0.058, 0.012, 0.01, 0, 8)), 0, 0);
  });
  if (len >= 40) inkLine(p, 21350, SP(abOut), {weight: Math.max(0.5, len / 340), color: o.rimColor ?? MOSQ.rim, curve: 0.2});

  const all = [...SP(abOut), ...toes, S(pb1)];
  return {head: S([0.43, 0]), tail: S([-0.61, 0]), centre: g, toes,
    left: Math.min(...all.map((q) => q[0])), right: Math.max(...all.map((q) => q[0])), top: Math.min(...all.map((q) => q[1])), bottom: Math.max(...all.map((q) => q[1]))};
};

/** The mosquito through the yaw camera: card at its waist `at` (world units), `bl` = one body length in those units (0.004 m in `H`,
 * 1.62 sm in `M`). One drawing for both. */
export const paintMosquito = (p: Painter, c: YCam, at: V3, bl: number, o: MosqOpts): MosqMeasure | null => {
  const g = camPoint(c, at);
  if (!g) return null;
  return drawMosquito(p, g, camUnit(c, at) * bl, o);
};

/** How far (bl) the side-view card reaches below its anchor in a state: the lowest leg joint or toe of the near and far sets after the
 * pose pitch (wings never hang below the legs). */
export const mosqReachBelow = (state: MosqState, pitchAdd = 0) => {
  const pose = SIDE_POSES[state], a = (pose.pitch + pitchAdd) * DEG, c = Math.cos(a), s = Math.sin(a);
  const sets = (['fore', 'mid', 'hind'] as const).flatMap((k) => [legJoints(HIP[k], pose[k], LEN[k]),
    legJoints([HIP[k][0] + FAR_OFF[0], HIP[k][1] + FAR_OFF[1]], {...pose[k], fem: pose[k].fem + 7, tib: pose[k].tib + 6, tar: pose[k].tar + 5}, LEN[k])]);
  const ys = sets.flat().map(([x0, y]) => { const x = x0 + X0; return x * s + y * c; });
  return Math.max(0, -Math.min(...ys, -0.07)) / BODY_SPAN;
};
/** R04 contact guard: the lowest anchor height (world units) at which every part of the card clears the water by `clearance`
 * (storyboard R04: 1.0 sm in `M`, 0.15 m in `H`). `bl` = one body length in the same units. */
export const minAnchorHeight = (state: MosqState, bl: number, clearance: number, pitchAdd = 0) => clearance + mosqReachBelow(state, pitchAdd) * bl;

/** How far (bl) the dorsal outline (thorax top, scutellum, head) reaches above the anchor in a state: where a drop's bottom face meets the back
 * (SH04 contact at +17, SH15 hit at +50). Wings are excluded (folded or crushed at contact). */
export const mosqReachAbove = (state: MosqState, pitchAdd = 0) => {
  const a = (SIDE_POSES[state].pitch + pitchAdd) * DEG, c = Math.cos(a), s = Math.sin(a);
  const tops: Pt[] = [[0.15, 0.14], [0.035, 0.085], [0.36, 0.065], [0.04, 0.062]];
  return Math.max(...tops.map(([x0, y]) => (x0 + X0) * s + y * c)) / BODY_SPAN;
};
/** Anchor height (world units) at which the side-view back just touches a face at `faceY` above it: the passenger of a drop (R04 contact: within 0.02 sm). */
export const anchorUnderFace = (faceY: number, bl: number, state: MosqState = 'pressed', pitchAdd = 0) => faceY - mosqReachAbove(state, pitchAdd) * bl;
/** R04 check on a drawn card: true when every drawn part (body, legs) is at least `clearance` px above `waterPx` (screen y of the water under it). */
export const clearsWater = (m: MosqMeasure, waterPx: number, clearancePx: number) => m.bottom + clearancePx <= waterPx;

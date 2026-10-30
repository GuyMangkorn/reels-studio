import type {PaintContext} from '../BrushCanvas';
import {hash} from '../hash';
import {mixColor, type Pt} from '../painter';
import type {Cast} from '../spike/CastSheet';
import {CHIN, FACES, HEAD_SPAN, headOutline, paintHead, type Face, type HeadStyle} from '../spike/FaceSheet';
import {ellipse} from '../spike/ProportionSheet';
import {paintHeadSide, rotated, type Paint} from '../spike/SideSheet';
import {INK, placeAt} from './ctx';
import {BOB_SIDE, paintInfectedSide, paintRageFront} from './cast';
import {castBy, castTone, cel as celTone, clipConvex, type CastAt, floorCast, hull, KEY_SEC_DAY, localTravel, type Proj, roomFloorQuad, shift} from './light';
import type {Section} from './space';

// ZCPAINT 6-head body (BODY-ZCP-6H, S-P12, Boss pass 7 and 7b). ZCPAINT-only: WORLD FOG's 4-head figure (figure.ts, CastSheet,
// SideSheet, FaceSheet) is not changed. The decal heads are reused unchanged and scaled to 6 heads (K6). Proportions from
// Film's spike `front6` / `side6` / `seatHug6` (SPK-ZCP-05, approved as direction on 30 Oct 2026).
//
// Pass 7b (user look check, 30 Oct 2026): limbs, the neck and the trousers are one tapered tube each (`tub`: a Catmull-Rom
// centreline with a radius per control point, one closed outline, no joint caps); the tee, shorts block and torso are smooth
// convex shapes (`convexOf`); the cel band on a tube is its own centreline moved toward the key with the radius reduced by the
// same amount, so it stays inside the outline (no clipping of non-convex shapes). Cast shadows are the floor projection of the
// same parts (light.ts `floorCast`, LT-03) plus a flat contact patch under each foot or seat, so the shadow starts at the
// contact. The infected body is left to gravity (`figSlack`), not a fixed stoop angle.
//
// Geometry is in head units `HU` (x to the right, `up` above the floor, 1 head = 0.283 m) and converted to px once. Scale 1
// is 447 px/m, so 1 head = H6 = 126.65 px. Parts are flat washes (`washPaint`, LT-04). Decal faces stay unshaded.

/** Scale-1 calibration (SCALE-ZCP-R1): 447 px per metre. */
export const PX_M = 447;
/** One head of `zc-you` (1.70 m = 6 heads): 126.65 px. */
export const H6 = (1.7 * PX_M) / 6;
/** Decal unit: the WORLD FOG face head scaled to 6 heads (55.8 px). */
export const K6 = H6 / HEAD_SPAN;
/** Silhouette colour (B01 infected in silhouette: one colour, no cel, no ink). */
export const SIL = '#2a2422';
const BLOOD = '#5a1414';
const HAIR_STRAND = '#14110f';

export type HU = [number, number];
/** Head units to local px (ground origin, y down). */
export const toPx = (pts: HU[]): Pt[] => pts.map(([x, u]) => [x * H6, -u * H6]);
const unitHU = (v: HU): HU => {
  const n = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / n, v[1] / n];
};
const mid = (a: HU, b: HU, u: number): HU => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
const lerpHU = (a: HU, b: HU, s: number): HU => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
/** Ellipse in head units (radii in heads). */
export const ellHU = (cx: number, cy: number, rx: number, ry: number, n = 18): HU[] =>
  Array.from({length: n}, (_, i): HU => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)]);
/** Capsule in head units; `w0` and `w1` are diameters (heads). Convex (used for the hands). */
export const capHU = (a: HU, b: HU, w0: number, w1: number, n = 7): HU[] => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const r0 = w0 / 2, r1 = w1 / 2;
  const pts: HU[] = [];
  for (let i = 0; i <= n; i++) {
    const t = ang + Math.PI / 2 + (i / n) * Math.PI;
    pts.push([a[0] + r0 * Math.cos(t), a[1] + r0 * Math.sin(t)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = ang - Math.PI / 2 + (i / n) * Math.PI;
    pts.push([b[0] + r1 * Math.cos(t), b[1] + r1 * Math.sin(t)]);
  }
  return pts;
};
/** Two-bone IK in head units: the middle joint `l1` from `s` and `l2` from `t`; `bend` +1 puts it counter-clockwise of s→t. */
export const ik2 = (s: HU, t: HU, l1: number, l2: number, bend: 1 | -1): HU => {
  const dx = t[0] - s[0], dy = t[1] - s[1];
  const len = Math.hypot(dx, dy) || 1;
  const d = Math.min(len, l1 + l2 - 1e-6);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / len, uy = dy / len;
  return [s[0] + ux * a - uy * h * bend, s[1] + uy * a + ux * h * bend];
};
/** Rotation about `about` by `th` (head units; positive moves the top forward, the SideSheet `rotated` convention). */
const rotHU = (p: HU, about: HU, th: number): HU => {
  const dx = p[0] - about[0], dy = p[1] - about[1];
  return [about[0] + dx * Math.cos(th) + dy * Math.sin(th), about[1] - dx * Math.sin(th) + dy * Math.cos(th)];
};

/** Catmull-Rom through control points (open), `n` samples per span, with the fractional control index of each sample. */
const crSample = (P: HU[], n: number): {pts: HU[]; t: number[]} => {
  const pts: HU[] = [], t: number[] = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      t.push(i + u);
    }
  }
  pts.push(P[P.length - 1]);
  t.push(P.length - 1);
  return {pts, t};
};
/** Closed Catmull-Rom through control points, `n` samples per span (a smooth outline for convex shapes). */
const closedSample = (P: HU[], n = 4): HU[] => {
  const out: HU[] = [], N = P.length;
  for (let i = 0; i < N; i++) {
    const p0 = P[(i - 1 + N) % N], p1 = P[i], p2 = P[(i + 1) % N], p3 = P[(i + 2) % N];
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
};

/** A drawn part, back to front. `pts` is the outline in px. `cel` is the cel band in px for convex parts (clipped by `paintPart`);
 *  `tube` parts carry their centreline and radii instead (head units; `celH` the cel band in heads). `draw` runs a callback. */
export type Part = {
  col: string;
  pts: Pt[];
  cel: number;
  far?: boolean;
  ink?: boolean;
  up?: boolean;
  draw?: (p: Paint) => void;
  tube?: {c: HU[]; r: number[]; celH: number};
};

/** Convex flat part from head units (a capsule, a hull). */
const prt = (col: string, pts: HU[], celH: number, extra: Partial<Omit<Part, 'col' | 'pts' | 'cel' | 'tube' | 'draw'>> = {}): Part => ({
  col, pts: toPx(pts), cel: celH * H6, ...extra,
});
/** Smooth convex shape through control points: closed spline, then the convex hull. */
const convexOf = (col: string, ctrl: HU[], celH: number, extra: Partial<Omit<Part, 'col' | 'pts' | 'cel' | 'tube' | 'draw'>> = {}): Part =>
  prt(col, hull(closedSample(ctrl)) as HU[], celH, extra);
/** Tapered tube (limb, sleeve, neck, trouser leg) through `ctrl` (head units) with radii `r` (heads, half-widths). */
const tub = (col: string, ctrl: HU[], r: number[], celH: number, extra: Partial<Omit<Part, 'col' | 'pts' | 'cel' | 'tube' | 'draw'>> = {}): Part => {
  const {pts, t} = crSample(ctrl, 6);
  const rr = t.map((tt) => {
    const i = Math.min(Math.floor(tt), ctrl.length - 2), u = tt - i;
    return r[i] + (r[Math.min(i + 1, r.length - 1)] - r[i]) * u;
  });
  return {col, pts: toPx(tubeOutline(pts, rr)), cel: 0, tube: {c: pts, r: rr, celH}, ...extra};
};

/** One closed outline around a centreline: left side, round end, right side, round start. No inner joints. */
export const tubeOutline = (c: HU[], r: number[]): HU[] => {
  const N = c.length;
  const left: HU[] = [], right: HU[] = [];
  let nx0 = 0, ny0 = 0, nxN = 0, nyN = 0;
  for (let i = 0; i < N; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(N - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1];
    const L = Math.hypot(tx, ty) || 1;
    const nx = -ty / L, ny = tx / L;
    if (i === 0) { nx0 = nx; ny0 = ny; }
    if (i === N - 1) { nxN = nx; nyN = ny; }
    left.push([c[i][0] + nx * r[i], c[i][1] + ny * r[i]]);
    right.push([c[i][0] - nx * r[i], c[i][1] - ny * r[i]]);
  }
  const arc = (cx: number, cy: number, rad: number, a0: number, a1: number, m = 6): HU[] =>
    Array.from({length: m + 1}, (_, k): HU => {
      const th = a0 + (a1 - a0) * (k / m);
      return [cx + rad * Math.cos(th), cy + rad * Math.sin(th)];
    });
  const phiN = Math.atan2(nyN, nxN), phi0 = Math.atan2(ny0, nx0);
  const endCap = arc(c[N - 1][0], c[N - 1][1], r[N - 1], phiN, phiN - Math.PI);
  const startCap = arc(c[0][0], c[0][1], r[0], phi0 + Math.PI, phi0);
  return [...left, ...endCap, ...right.reverse(), ...startCap];
};

/** Hand: wrist `w` and direction `dir` (head units; `dir` points from the wrist to the fingers); `thumb` is the thumb side. */
export type HandKind = 'mitten' | 'fist' | 'pinch';
export type Hand = {kind: HandKind; w: HU; dir: HU; thumb: 1 | -1; forceCel?: boolean};

/**
 * Third-person hands (accepted at the user's look check, 30 Oct 2026). `mitten` (HD-03): WORLD FOG mitten with a thumb lobe, about
 * 0.41 × 0.26 heads, no finger articulation. `fist` (HD-04): closed, the back of the hand with four curled finger blocks in the cel
 * tone past the knuckles. `pinch`: index and thumb meet with a visible gap of 0.08 head (B05-SH03 lid, B07-SH01 case).
 */
export const handParts = (h: Hand, skin: string): Part[] => {
  const d = unitHU(h.dir), q: HU = [-d[1], d[0]];
  const at = (u: number, v: number): HU => [h.w[0] + d[0] * u + q[0] * v * h.thumb, h.w[1] + d[1] * u + q[1] * v * h.thumb];
  const P = (pts: HU[], celH: number, extra: Partial<Omit<Part, 'col' | 'pts' | 'cel' | 'tube' | 'draw'>> = {}) =>
    prt(skin, pts, celH, {far: h.forceCel, up: true, ...extra});
  if (h.kind === 'fist') {
    const out: Part[] = [P(capHU(at(0.04, 0), at(0.3, 0), 0.3, 0.34), 0.1)];
    for (let i = 0; i < 4; i++) {
      const v = -0.11 + i * 0.075;
      out.push(P(capHU(at(0.33, v), at(0.42, v), 0.13, 0.12, 5), 0, {far: true}));
    }
    out.push(P(capHU(at(0.02, 0.12), at(0.28, 0.14), 0.14, 0.13), 0.08));
    return out;
  }
  if (h.kind === 'pinch') {
    return [
      P(capHU(at(0.03, 0), at(0.22, 0), 0.26, 0.24), 0.09),
      P(capHU(at(0.22, 0), at(0.5, 0), 0.13, 0.11), 0.06), // index: tip at u 0.5, v 0
      P(capHU(at(0.04, 0.26), at(0.5, 0.19), 0.13, 0.11), 0.06), // thumb: tip 0.08 head from the index tip
    ];
  }
  return [
    P(capHU(at(0.02, 0), at(0.3, 0), 0.26, 0.22), 0.09),
    P(capHU(at(0.06, 0.1), at(0.22, 0.18), 0.14, 0.12), 0.07), // thumb lobe
  ];
};

/** The head: a decal face (`paintHead` / `paintHeadSide`) or the back of the head (no face). */
export type HeadMark = {
  kind: 'front' | 'side' | 'back';
  x: number;
  y: number;
  face: Face;
  style: HeadStyle;
  blink: boolean;
  cell: number;
  /** Head pitch about `pivot` (rad; positive nods forward) and the pivot (px). */
  tilt?: number;
  pivot?: Pt;
  /** Marks drawn over the head (rage, infected, stubble, hair strands). */
  over?: (ctx: PaintContext, p: Paint) => void;
  /** Hair mass in the silhouette colour (px, absolute, before the head pitch): the B01 silhouette head's hair (pass 8). */
  silHair?: Pt[];
  /** Back of the head: the three crown tufts (default on; the close bust turns them off, Boss pass 10). */
  tufts?: boolean;
  /** Blink start (s, plate time) when `blink` is on; default: the seeded phase of the head painter. */
  blinkAt?: number;
};
export type Fig = {
  view: string;
  parts: Part[];
  head: HeadMark;
  /** Floor contact patches (px polygons on the floor line): under each foot, and under the seat for seated figures. */
  contact: Pt[][];
  /** Joint anchors in local px (ground origin, y down): hips, knees, feet (ankles), hands (wrists), head centre. */
  anchors: {hips: Pt; knees: Pt[]; feet: Pt[]; hands: Pt[]; head: Pt};
};

// --- shared marks ------------------------------------------------------------------------------------------------------

/** Crew neck and three shirt folds on the front, or the spine crease on the back; `blood` adds the dried patch on the collar,
 *  `dirt` three smudges in the cel tone (the infected's worn shirt). */
const torsoMarks = (front: boolean, shirt: string, blood: boolean, dirt: boolean): Part => ({
  col: '', pts: [], cel: 0,
  draw: (p) => {
    const fold = celTone(shirt);
    if (front) {
      p.ink(toPx([[-0.2, 4.78], [0, 4.62], [0.2, 4.78]]), 0.9, 0.5);
      for (const f of [[[-0.42, 4.1], [-0.32, 3.85], [-0.4, 3.6]], [[0.1, 4.0], [0.2, 3.7], [0.12, 3.45]], [[-0.1, 3.6], [0.02, 3.4], [-0.06, 3.2]]] as HU[][]) {
        p.ink(toPx(f), 0.8, 0.5, fold);
      }
      if (blood) p.part(BLOOD, toPx(ellHU(0.12, 4.64, 0.12, 0.05, 12)), false);
    } else {
      p.ink(toPx([[0, 4.5], [0.03, 3.9], [-0.02, 3.2]]), 0.9, 0.5, fold);
    }
    if (dirt) {
      for (const [x, u, rx, ry] of [[-0.32, 3.95, 0.09, 0.05], [0.24, 3.52, 0.07, 0.04], [-0.1, 3.3, 0.1, 0.03]] as const) {
        p.part(fold, toPx(ellHU(x, u, rx, ry, 10)), false);
      }
    }
  },
});

/** Profile marks on the torso: two folds along the torso axis from `a` (hip) to `b` (shoulder), in the cel tone. */
const profileFolds = (a: HU, b: HU, shirt: string): Part => ({
  col: '', pts: [], cel: 0,
  draw: (p) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const at = (t: number, u: number): HU => [a[0] + dx * t + nx * u, a[1] + dy * t + ny * u];
    for (const [t0, u0, t1, u1] of [[0.45, 0.15, 0.6, 0.05], [0.62, -0.1, 0.78, -0.02]] as const) {
      p.ink(toPx([at(t0, u0), at(t1, u1)]), 0.8, 0.4, celTone(shirt));
    }
  },
});

/** Toe lines on a bare foot pointing +x (figdetail.ts `toeLines`, on the 6-head ankle). */
const toeLines = (ank: HU): Part => ({
  col: '', pts: [], cel: 0,
  draw: (p) => {
    for (const u of [0.25, 0.238]) p.ink(toPx([[ank[0] + u, ank[1] + 0.085], [ank[0] + u - 0.012, ank[1] + 0.03]]), 0.6, 0.3, INK);
  },
});

/** Hair strands on the back of the skull, profile head (figdetail.ts, pass 5), drawn over the head. */
const hairStrands = (p: Paint, cx: number, cy: number) => {
  for (const [a0, r0] of [[-2.05, 0.95], [-2.3, 0.97], [-2.55, 0.9]] as const) {
    const pts: Pt[] = [0, 0.13, 0.26].map((d, i) => {
      const r = r0 * K6 * (1 - 0.18 * i);
      return [cx + r * Math.cos(a0 + d), cy + r * Math.sin(a0 + d)];
    });
    p.ink(pts, 0.8, 0.5, HAIR_STRAND);
  }
};

/** Back of the head (no face): skull, the hair mass over the whole back and three crown tufts (figure.ts `paintBodyBack`). */
const backHair = (): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = Math.PI + (i / 20) * Math.PI;
    pts.push([1.07 * Math.cos(a), 1.12 * Math.sin(a) - 0.04]);
  }
  pts.push([1.0, 0.32], [0.9, 0.62], [0.55, 0.76], [0.2, 0.7], [0, 0.82], [-0.2, 0.7], [-0.55, 0.76], [-0.9, 0.62], [-1.0, 0.32]);
  return pts;
};
const paintBackHead = (p: Paint, cx: number, cy: number, style: HeadStyle, tufts = true) => {
  const X = ([u, v]: Pt): Pt => [cx + u * K6, cy + v * K6];
  for (const s of [-1, 1]) p.part(style.skin, ellipse(s * 1.0, 0.12, 0.14, 0.21, 16).map(X), true, 3);
  p.part(style.skin, headOutline().map(X), true, 3);
  p.part(style.hair, backHair().map(X), true, 6);
  if (tufts) for (const [x, w] of [[-0.5, 0.3], [-0.1, 0.3], [0.3, 0.3]] as const) p.part(style.hair, [[x, -1.12], [x + w / 2, -1.34], [x + w, -1.12]].map((q) => X(q as Pt)), false, 5);
};

/** Head mark constructor shared by the views. */
const headMark = (kind: HeadMark['kind'], x: number, y: number, face: Face, style: HeadStyle, cell: number, o: {blink?: boolean; blinkAt?: number; over?: HeadMark['over']}): HeadMark => ({
  kind, x, y, face, style, cell, blink: o.blink ?? false, over: o.over, blinkAt: o.blinkAt,
});

/** Contact patch under one foot (px polygon on the floor line). */
const footContact = (x: number): Pt[] => ellipse(x * H6, 0, 0.36 * H6, 0.05 * H6, 14);
/** A foot as a tapered tube from the ankle: heel and toe, sole on the floor for `lift` 0. */
const footCtrl = (a: HU, lift = 0): HU[] => [[a[0] - 0.12, 0.09 + 0.1 * lift], [a[0] + 0.36, 0.06 + 0.05 * lift]];
const FOOT_R = [0.1, 0.065];

// --- standing, front and back (zc-you) ---------------------------------------------------------------------------------

export type FrontOpts = {face?: Face; blink?: boolean; back?: boolean; arms?: 'hang' | 'bucket'; overlay?: 'rage' | 'day3'; blood?: boolean; dirt?: boolean; inserts?: Part[]; cell?: number};

/**
 * Standing, front or back view, 6 heads. Arms hang with mitten hands, or hold a bucket handle (`bucket`, B05-SH01). `inserts` are drawn
 * after the torso and before the hands (a prop in front of the body).
 */
export const figFront = (c: Cast, o: FrontOpts = {}): Fig => {
  const out = c.outfit, sk = c.head.skin, back = !!o.back, cell = o.cell ?? 0;
  const parts: Part[] = [], hands: Hand[] = [], contact: Pt[][] = [];
  for (const s of [-1, 1]) {
    parts.push(tub(out.pants, [[s * 0.3, 3.0], [s * 0.29, 2.5], [s * 0.28, 2.1]], [0.25, 0.23, 0.21], 0.14));
    parts.push(tub(sk, [[s * 0.28, 2.16], [s * 0.27, 1.78], [s * 0.26, 1.1], [s * 0.25, 0.24]], [0.2, 0.18, 0.165, 0.12], 0.11));
    parts.push(tub(sk, [[s * 0.2, 0.1], [s * 0.33, 0.085]], [0.09, 0.07], 0.06));
    contact.push(footContact(s * 0.27));
  }
  parts.push(convexOf(out.pants, [[-0.56, 3.36], [0.56, 3.36], [0.64, 3.02], [0.6, 2.7], [-0.6, 2.7], [-0.64, 3.02]], 0.34));
  for (const s of [-1, 1] as const) {
    const S: HU = [s * 0.72, 4.44];
    let E: HU = [s * 0.9, 3.56], W: HU = [s * 0.94, 2.68];
    let dir: HU = [s * 0.05, -1], thumb: 1 | -1 = s === 1 ? -1 : 1;
    if (o.arms === 'bucket') {
      W = [s * 0.36, 3.9];
      E = ik2(S, W, 0.9, 0.88, s);
      dir = [-s * 0.2, -1];
      thumb = s === 1 ? -1 : 1;
    }
    parts.push(tub(sk, [S, E, W], [0.16, 0.125, 0.1], 0.11, {up: true}));
    hands.push({kind: 'mitten', w: W, dir, thumb});
  }
  // Pass 8 (user 7b look check): the neck is drawn before the collar, so the tee hides its foot, and it is thicker (0.36 head wide).
  parts.push(tub(sk, [[0, 4.66], [0, 5.02]], [0.18, 0.17], 0.12, {far: true, ink: false, up: true}));
  parts.push(convexOf(out.shirt, [[-0.24, 4.82], [0.24, 4.82], [0.46, 4.79], [0.6, 4.7], [0.68, 4.5], [0.7, 4.2], [0.66, 3.7], [0.62, 3.3], [0.62, 2.96], [-0.62, 2.96], [-0.62, 3.3], [-0.66, 3.7], [-0.7, 4.2], [-0.68, 4.5], [-0.6, 4.7], [-0.46, 4.79]], 0.4, {up: true}));
  for (const s of [-1, 1]) parts.push(tub(out.sleeve, [[s * 0.6, 4.58], [s * 0.74, 4.28], [s * 0.8, 4.02]], [0.15, 0.15, 0.145], 0.12, {up: true}));
  parts.push(torsoMarks(!back, out.shirt, !!o.blood, !!o.dirt));
  parts.push(...(o.inserts ?? []));
  for (const h of hands) parts.push(...handParts(h, sk));
  const hy = -5.0 * H6 - CHIN * K6;
  const over: HeadMark['over'] = back || !o.overlay ? undefined
    : o.overlay === 'rage' ? (ctx, p) => paintRageFront(ctx, p, 0, hy, K6)
      : (_ctx, p) => stubble(p, 0, hy, K6, 'front', sk);
  const head = headMark(back ? 'back' : 'front', 0, hy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, over});
  return {
    view: back ? 'back' : 'front', parts, head, contact,
    anchors: {hips: [0, -3.0 * H6], knees: [[-0.27 * H6, -1.78 * H6], [0.27 * H6, -1.78 * H6]], feet: [[-0.27 * H6, 0], [0.27 * H6, 0]], hands: hands.map((h) => [h.w[0] * H6, -h.w[1] * H6] as Pt), head: [0, hy]},
  };
};

// --- profile, standing and walking (facing +x) -------------------------------------------------------------------------

export type SideOpts = {face?: Face; blink?: boolean; stride?: number; overlay?: 'day3'; cell?: number};

/**
 * Profile, 6 heads, facing +x (the mirror for facing left is `dir` -1 in `drawFig`). `stride` 0 stands; 1 is the B04-SH01 walk (near
 * leg forward, far leg back, arms swinging, the far heel lifted).
 */
export const figSide = (c: Cast, o: SideOpts = {}): Fig => {
  const out = c.outfit, sk = c.head.skin, a = 0.34 * (o.stride ?? 0), cell = o.cell ?? 0;
  const hip: HU = [0, 3.0];
  const kneeN: HU = [Math.sin(a) * 1.4, 3.0 - Math.cos(a) * 1.4], ankN: HU = [kneeN[0] - 0.12, 0.16];
  const kneeF: HU = [-Math.sin(a * 0.7) * 1.4, 3.0 - Math.cos(a * 0.7) * 1.4], ankF: HU = [kneeF[0] - 0.4, 0.24];
  const hemOn = (k: HU): HU => [hip[0] + (k[0] - hip[0]) * ((3.0 - 2.12) / (3.0 - k[1])), 2.12];
  const hemN = hemOn(kneeN), hemF = hemOn(kneeF);
  const parts: Part[] = [];
  // Far side, turned from the light: all cel.
  const shF: HU = [0.02, 4.45], elF: HU = [0.26, 3.6], wrF: HU = [0.42, 2.78];
  parts.push(tub(sk, [shF, elF, wrF], [0.16, 0.125, 0.1], 0, {far: true, up: true}));
  parts.push(...handParts({kind: 'mitten', w: wrF, dir: [0.35, -1], thumb: 1, forceCel: true}, sk));
  parts.push(tub(out.pants, [hip, mid(hip, kneeF, 0.5), hemF], [0.25, 0.23, 0.21], 0, {far: true}));
  parts.push(tub(sk, [hemF, kneeF, ankF], [0.2, 0.17, 0.12], 0, {far: true}));
  parts.push(tub(sk, footCtrl(ankF, 0.1), FOOT_R, 0, {far: true}));
  // Seat (convex), near trouser leg, near shin, foot; the tee and the near arm.
  parts.push(convexOf(out.pants, [[-0.42, 3.3], [0.3, 3.32], [0.38, 2.9], [0.4, 2.66], [-0.42, 2.64], [-0.46, 2.96]], 0.26));
  parts.push(tub(out.pants, [hip, mid(hip, kneeN, 0.5), hemN], [0.26, 0.24, 0.21], 0.16));
  parts.push(tub(sk, [hemN, kneeN, ankN], [0.2, 0.17, 0.12], 0.12));
  parts.push(tub(sk, footCtrl(ankN, 0), FOOT_R, 0.05));
  // Pass 8: the neck sits behind the collar (drawn before the tee), thicker and shorter than the spike's.
  parts.push(tub(sk, [[0.02, 4.6], [0.08, 4.96]], [0.18, 0.17], 0.14, {far: true, ink: false, up: true}));
  parts.push(convexOf(out.shirt, [[-0.3, 4.78], [0.02, 4.8], [0.24, 4.74], [0.36, 4.44], [0.36, 3.9], [0.34, 3.4], [0.34, 2.98], [-0.4, 2.98], [-0.42, 3.5], [-0.44, 3.9], [-0.44, 4.5], [-0.4, 4.66]], 0.34, {up: true}));
  const shN: HU = [-0.04, 4.44], elN: HU = [-0.22, 3.56], wrN: HU = [-0.36, 2.76];
  parts.push(tub(sk, [shN, elN, wrN], [0.16, 0.125, 0.1], 0.11, {up: true}));
  parts.push(tub(out.sleeve, [[shN[0] - 0.02, shN[1] + 0.02], mid(shN, elN, 0.45)], [0.165, 0.155], 0.13, {up: true}));
  parts.push(...handParts({kind: 'mitten', w: wrN, dir: [-0.15, -1], thumb: 1}, sk));
  parts.push(profileFolds([0, 3.2], [0, 4.5], out.shirt));
  parts.push(toeLines(ankN));
  const hx = 0.1 * H6, hy = -5.0 * H6 - CHIN * K6;
  const over: HeadMark['over'] = (ctx, p) => {
    hairStrands(p, hx, hy);
    if (o.overlay === 'day3') stubble(p, hx, hy, K6, 'side', sk);
    void ctx;
  };
  const head = headMark('side', hx, hy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, over});
  return {
    view: 'profile', parts, head, contact: [footContact(ankN[0]), footContact(ankF[0])],
    anchors: {hips: [0, -3.0 * H6], knees: [[kneeN[0] * H6, -kneeN[1] * H6], [kneeF[0] * H6, -kneeF[1] * H6]], feet: [[ankN[0] * H6, 0], [ankF[0] * H6, 0]], hands: [[wrN[0] * H6, -wrN[1] * H6]], head: [hx, hy]},
  };
};

// --- infected: left to gravity (figSlack) -------------------------------------------------------------------------------

export type SlackOpts = {view: 'front' | 'side'; slump?: number; face?: Face; blink?: boolean; overlay?: 'rage' | 'infected'; blood?: boolean; dirt?: boolean; cell?: number};

/**
 * Infected body left to gravity (user, 30 Oct 2026: 'เขียนปล่อยตามแรงโน้มถ่วง'): `slump` 0 is the upright 6-head figure (B1), 1 is
 * fully slack. Shoulders drop and come forward, the head drops with the chin to the chest (`side`: the head pitches forward about
 * the neck), arms hang straight under gravity with the elbows barely bent, the hips and knees sag. No fixed stoop angle: every
 * joint is an interpolation between the two postures. Trousers and a worn shirt in muted tones (`cast` passed by the caller).
 */
export const figSlack = (c: Cast, o: SlackOpts): Fig => {
  const s = Math.max(0, Math.min(1, o.slump ?? 1));
  return o.view === 'front' ? slackFront(c, o, s) : slackSide(c, o, s);
};

const slackFront = (c: Cast, o: SlackOpts, s: number): Fig => {
  const out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  // Pass 8 (user 7b look check): the shoulders and arms keep the approved drop (`sd`); the head drops less (`hd`), so the face is higher.
  const hipY = 3.0 - 0.08 * s, sd = 0.22 * s, hd = 0.12 * s, chin = 5.0 - hd;
  const parts: Part[] = [], hands: Hand[] = [], contact: Pt[][] = [];
  for (const sg of [-1, 1]) {
    parts.push(tub(out.pants, [[sg * 0.3, hipY], [sg * 0.29, 2.5], [sg * 0.27, 1.6], [sg * 0.25, 0.22]], [0.25, 0.23, 0.2, 0.16], 0.14));
    parts.push(tub(sk, [[sg * 0.2, 0.1], [sg * 0.33, 0.085]], [0.09, 0.07], 0.06));
    contact.push(footContact(sg * 0.25));
  }
  parts.push(convexOf(out.pants, [[-0.56, hipY + 0.34], [0.56, hipY + 0.34], [0.62, hipY], [0.58, 2.7], [-0.58, 2.7], [-0.62, hipY]], 0.34));
  for (const sg of [-1, 1] as const) {
    const S = lerpHU([sg * 0.72, 4.44], [sg * 0.68, 4.2], s);
    const E = lerpHU([sg * 0.9, 3.56], [sg * 0.84, 3.36], s);
    const W = lerpHU([sg * 0.94, 2.68], [sg * 0.86, 2.44], s);
    parts.push(tub(sk, [S, E, W], [0.16, 0.125, 0.1], 0.11, {up: true}));
    hands.push({kind: 'mitten', w: W, dir: [sg * 0.05 * (1 + s), -1], thumb: sg === 1 ? -1 : 1});
  }
  const top = 4.82 - sd;
  parts.push(tub(sk, [[0, 4.66 - sd], [0, chin + 0.02]], [0.19, 0.18], 0.12, {far: true, ink: false, up: true}));
  parts.push(convexOf(out.shirt, [[-0.24, top], [0.24, top], [0.46, top - 0.03], [0.6, top - 0.12], [0.68, 4.5 - sd * 0.9], [0.7, 4.2 - sd * 0.6], [0.66, 3.7], [0.62, 3.3], [0.62, 2.96], [-0.62, 2.96], [-0.62, 3.3], [-0.66, 3.7], [-0.7, 4.2 - sd * 0.6], [-0.68, 4.5 - sd * 0.9], [-0.6, top - 0.12], [-0.46, top - 0.03]], 0.4, {up: true}));
  for (const sg of [-1, 1]) parts.push(tub(out.sleeve, [[sg * 0.6, 4.56 - sd], [sg * 0.74, 4.28 - sd * 0.8], [sg * 0.8, 4.02 - sd * 0.6]], [0.15, 0.15, 0.145], 0.12, {up: true}));
  parts.push(torsoMarks(true, out.shirt, !!o.blood, !!o.dirt));
  for (const h of hands) parts.push(...handParts(h, sk));
  const hy = -chin * H6 - CHIN * K6;
  const over: HeadMark['over'] = o.overlay === 'rage' ? (ctx, p) => paintRageFront(ctx, p, 0, hy, K6) : undefined;
  const head = headMark('front', 0, hy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, over});
  return {
    view: 'slack-front', parts, head, contact,
    anchors: {hips: [0, -hipY * H6], knees: [[-0.27 * H6, -1.6 * H6], [0.27 * H6, -1.6 * H6]], feet: [[-0.25 * H6, 0], [0.25 * H6, 0]], hands: hands.map((h) => [h.w[0] * H6, -h.w[1] * H6] as Pt), head: [0, hy]},
  };
};

const slackSide = (c: Cast, o: SlackOpts, s: number): Fig => {
  const out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  const L = (a: HU, b: HU) => lerpHU(a, b, s);
  const H: HU = L([0, 3.0], [0.04, 2.92]);
  const S: HU = L([-0.04, 4.44], [0.26, 4.18]);
  const P: HU = L([0.02, 4.58], [0.3, 4.42]);
  const C0: HU = [P[0] + 0.08, P[1] + 0.96];
  // Pass 8: the head pitches 0.25 rad at full slump (was 0.4), so the face is higher while she charges (user 7b look check).
  const tilt = 0.25 * s;
  const chinU = rotHU([C0[0], C0[1] - 0.537], P, tilt);
  const kneeN: HU = L([0, 1.6], [0.1, 1.52]), ankN: HU = [-0.12, 0.16];
  const kneeF: HU = L([-0.14, 1.64], [-0.12, 1.58]), ankF: HU = L([-0.5, 0.24], [-0.22, 0.2]);
  const parts: Part[] = [];
  // Far side: cel throughout.
  parts.push(tub(out.pants, [H, mid(H, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.6)], [0.25, 0.23, 0.2, 0.16], 0, {far: true}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const EF = L([0.26, 3.6], [0.42, 3.38]), WF = L([0.42, 2.78], [0.5, 2.52]), SF = L([0.02, 4.45], [0.24, 4.2]);
  parts.push(tub(sk, [SF, EF, WF], [0.16, 0.125, 0.1], 0, {far: true, up: true}));
  parts.push(...handParts({kind: 'mitten', w: WF, dir: [0.2, -1], thumb: 1, forceCel: true}, sk));
  // Neck from the shoulders to the chin, behind the torso (pass 8: thicker; the head pitches about the neck pivot).
  parts.push(tub(sk, [S, P, chinU], [0.2, 0.19, 0.18], 0.12, {far: true, ink: false, up: true}));
  // Torso: the back of the spine rounds as the shoulders come forward.
  parts.push(convexOf(out.shirt, [[H[0] - 0.4, H[1] - 0.04], [H[0] + 0.34, H[1] - 0.04], [H[0] + 0.38, H[1] + 0.5], [S[0] + 0.3, S[1] - 0.1], [S[0] + 0.18, S[1] + 0.12], [P[0] - 0.08, P[1] - 0.02], [S[0] - 0.26, S[1] + 0.04], [H[0] - 0.42, H[1] + 0.56]], 0.34, {up: true}));
  // Near trousers and shin, feet.
  parts.push(tub(out.pants, [H, mid(H, kneeN, 0.5), kneeN, mid(kneeN, ankN, 0.6)], [0.26, 0.24, 0.2, 0.16], 0.16));
  parts.push(tub(sk, footCtrl(ankN, 0), FOOT_R, 0.05));
  // Near arm: hangs under gravity, elbow barely bent; sleeve over the upper arm.
  const EN = L([-0.22, 3.56], [0.32, 3.34]), WN = L([-0.36, 2.76], [0.38, 2.48]), SN = S;
  parts.push(tub(sk, [SN, EN, WN], [0.16, 0.125, 0.1], 0.11, {up: true}));
  parts.push(tub(out.sleeve, [[SN[0] - 0.02, SN[1] + 0.02], mid(SN, EN, 0.45)], [0.165, 0.155], 0.13, {up: true}));
  parts.push(...handParts({kind: 'mitten', w: WN, dir: [0.1 + 0.1 * s, -1], thumb: 1}, sk));
  parts.push(profileFolds(H, S, out.shirt));
  parts.push(toeLines(ankN));
  const cx = C0[0] * H6, cy = -C0[1] * H6;
  const over: HeadMark['over'] = (_ctx, p) => {
    hairStrands(p, cx, cy);
    if (o.overlay === 'infected') paintInfectedSide(p, cx, cy, K6, true);
  };
  const head = headMark('side', cx, cy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, over});
  head.silHair = BOB_SIDE.map(([u, v]): Pt => [cx + u * K6, cy + v * K6]);
  if (tilt) {
    head.tilt = tilt;
    head.pivot = [P[0] * H6, -P[1] * H6];
  }
  return {
    view: 'slack-side', parts, head, contact: [footContact(ankN[0]), footContact(ankF[0])],
    anchors: {hips: [H[0] * H6, -H[1] * H6], knees: [[kneeN[0] * H6, -kneeN[1] * H6]], feet: [[ankN[0] * H6, 0], [ankF[0] * H6, 0]], hands: [[WN[0] * H6, -WN[1] * H6]], head: [cx, cy]},
  };
};

// --- seated ------------------------------------------------------------------------------------------------------------

export type SeatOpts = {face?: Face; blink?: boolean; pitch?: number; overlay?: 'day3'; cell?: number};

/** Seated head: upright centre `unrot` (head units), pitched by `pitch` about the neck pivot `piv` (head units). */
const seatHead = (c: Cast, face: Face, unrot: HU, piv: HU, pitch: number, o: SeatOpts, cell: number): HeadMark => {
  const cx = unrot[0] * H6, cy = -unrot[1] * H6;
  const over: HeadMark['over'] = (ctx, p) => {
    hairStrands(p, cx, cy);
    if (o.overlay === 'day3') stubble(p, cx, cy, K6, 'side', c.head.skin);
    void ctx;
  };
  const head = headMark('side', cx, cy, face, c.head, cell, {blink: o.blink, over});
  if (pitch) {
    head.tilt = pitch;
    head.pivot = [piv[0] * H6, -piv[1] * H6];
  }
  return head;
};

/**
 * B09 seated on the floor, day 3, profile facing +x (`dir` -1 is the screen-left mirror of the staged door side), hugging the knees.
 * Hip joint 0.34 head up so the thigh (radius 0.32) rests on the floor; thigh 1.42 and shin 1.48 heads (two-bone knee); feet 1.22 heads
 * ahead; torso 1.8 heads (the standing torso, pass 9) with a 0.13 rad lean; the chin sits 0.27 head above the shoulder line (the standing
 * neck, pass 9: was 0.55, a long neck), so the head centre is 0.73 head above it and the crown height is unchanged.
 * Forearms cross in front of the shins just below the knees, hands as closed fists (`HD-04`). `pitch` nods the head forward (rad).
 */
export const figSeatFloor = (c: Cast, o: SeatOpts = {}): Fig => {
  const out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 0.34], ank: HU = [1.22, 0.16];
  const knee = ik2(hip, ank, 1.42, 1.48, 1);
  const lean = 0.13, N: HU = [Math.sin(lean), Math.cos(lean)];
  const S: HU = [hip[0] + 1.8 * N[0], hip[1] + 1.8 * N[1]];
  const kneeF: HU = [knee[0] - 0.06, knee[1] + 0.02], ankF: HU = [ank[0] - 0.08, ank[1]];
  const parts: Part[] = [], hands: Hand[] = [];
  parts.push(tub(out.pants, [hip, mid(hip, kneeF, 0.5), kneeF], [0.31, 0.29, 0.23], 0, {far: true}));
  parts.push(tub(sk, [kneeF, ankF], [0.17, 0.11], 0, {far: true}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const Sf: HU = [S[0] - 0.04, S[1] - 0.05], Tf: HU = [1.02, 1.2];
  const Ef = ik2(Sf, Tf, 0.9, 0.88, -1), df = unitHU([Tf[0] - Ef[0], Tf[1] - Ef[1]]);
  const Wf: HU = [Tf[0] - df[0] * 0.17, Tf[1] - df[1] * 0.17];
  parts.push(tub(sk, [Sf, Ef, Wf], [0.16, 0.125, 0.1], 0, {far: true, up: true}));
  hands.push({kind: 'fist', w: Wf, dir: df, thumb: 1, forceCel: true});
  parts.push(convexOf(out.pants, [[-0.46, 0.74], [0.3, 0.52], [0.36, 0.04], [-0.42, 0.02]], 0.24));
  parts.push(tub(out.pants, [hip, mid(hip, knee, 0.5), knee], [0.3, 0.27, 0.23], 0.2));
  parts.push(tub(sk, [knee, ank], [0.17, 0.105], 0.12));
  parts.push(tub(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  parts.push(convexOf(out.shirt, [[hip[0] - 0.42, hip[1] - 0.08], [hip[0] + 0.36, hip[1] - 0.08], [S[0] + 0.36, S[1]], [S[0] - 0.42, S[1]]], 0.34, {up: true}));
  const Sa: HU = [S[0] + 0.02, S[1] - 0.05], Tn: HU = [1.12, 1.12];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(tub(sk, [Sa, En, Wn], [0.16, 0.125, 0.1], 0.11, {up: true}));
  parts.push(tub(out.sleeve, [Sa, mid(Sa, En, 0.5)], [0.165, 0.155], 0.13, {up: true}));
  hands.push({kind: 'fist', w: Wn, dir: dn, thumb: 1});
  for (const h of hands) parts.push(...handParts(h, sk));
  parts.push(profileFolds(hip, S, out.shirt));
  parts.push(toeLines(ank));
  const chin: HU = [S[0] + 0.27 * N[0], S[1] + 0.27 * N[1]];
  parts.push(tub(sk, [S, chin], [0.15, 0.13], 0.12, {ink: false, up: true}));
  const unrot: HU = [S[0] + 0.73 * N[0], S[1] + 0.73 * N[1]];
  const piv: HU = [S[0] + 0.3 * N[0], S[1] + 0.3 * N[1]];
  const head = seatHead(c, o.face ?? FACES[0], unrot, piv, o.pitch ?? 0, o, cell + 90);
  return {
    view: 'seat-floor', parts, head,
    contact: [ellipse(-0.05 * H6, 0, 0.44 * H6, 0.06 * H6, 16), footContact(ank[0])],
    anchors: {hips: [0, -hip[1] * H6], knees: [[knee[0] * H6, -knee[1] * H6]], feet: [[ank[0] * H6, 0]], hands: hands.map((h) => [h.w[0] * H6, -h.w[1] * H6] as Pt), head: [head.x, head.y]},
  };
};

/**
 * B07 seated on the sofa, profile facing +x (the sofa stand-in is drawn by the caller, its seat top at 1.59 heads = 0.45 m; the seat
 * contact patch is drawn there too). Hips 1.85 heads; thighs near-horizontal (1.42 heads, the knee 0.21 head below the hip); shins
 * vertical to the bare feet on the floor. Torso leans back 0.17 rad, the head pitches forward (`pitch`, default 0.25 rad), bread in both
 * mitten hands at the chest. Pass 9: torso 1.8 heads (was 1.6) and the head centre 0.73 head above the shoulder line (was 1.09), so the chin sits
 * 0.27 head above the shoulders, the standing neck, and the crown height is unchanged for the floor figure.
 */
export const figSeatSofa = (c: Cast, o: SeatOpts = {}): Fig => {
  const out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 1.85], knee: HU = [1.404, 1.64], ank: HU = [1.404, 0.16];
  const lean = -0.17, N: HU = [Math.sin(lean), Math.cos(lean)];
  const S: HU = [hip[0] + 1.8 * N[0], hip[1] + 1.8 * N[1]];
  const kneeF: HU = [knee[0] - 0.04, knee[1]], ankF: HU = [ank[0] - 0.04, ank[1]];
  const parts: Part[] = [], hands: Hand[] = [];
  parts.push(tub(out.pants, [hip, mid(hip, kneeF, 0.5), kneeF], [0.25, 0.23, 0.21], 0, {far: true}));
  parts.push(tub(sk, [kneeF, ankF], [0.18, 0.11], 0, {far: true}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  parts.push(tub(out.pants, [hip, mid(hip, knee, 0.5), knee], [0.25, 0.23, 0.21], 0.18));
  parts.push(tub(sk, [knee, ank], [0.18, 0.11], 0.12));
  parts.push(tub(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  parts.push(convexOf(out.shirt, [[hip[0] - 0.42, hip[1] - 0.1], [hip[0] + 0.36, hip[1] - 0.1], [S[0] + 0.36, S[1]], [S[0] - 0.42, S[1]]], 0.34, {up: true}));
  const Sa: HU = [S[0] + 0.03, S[1] - 0.06], Tn: HU = [0.52, 2.92];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(tub(sk, [Sa, En, Wn], [0.16, 0.125, 0.1], 0.11, {up: true}));
  parts.push(tub(out.sleeve, [Sa, mid(Sa, En, 0.5)], [0.165, 0.155], 0.13, {up: true}));
  hands.push({kind: 'mitten', w: Wn, dir: dn, thumb: 1});
  for (const h of hands) parts.push(...handParts(h, sk));
  parts.push(profileFolds(hip, S, out.shirt));
  const chin: HU = [S[0] + 0.27 * N[0], S[1] + 0.27 * N[1]];
  parts.push(tub(sk, [S, chin], [0.15, 0.13], 0.12, {ink: false, up: true}));
  const unrot: HU = [S[0] + 0.73 * N[0], S[1] + 0.73 * N[1]];
  const piv: HU = [S[0] + 0.3 * N[0], S[1] + 0.3 * N[1]];
  const head = seatHead(c, o.face ?? FACES[0], unrot, piv, o.pitch ?? 0.25, o, cell + 90);
  return {
    view: 'seat-sofa', parts, head,
    contact: [footContact(ank[0])],
    anchors: {hips: [0, -hip[1] * H6], knees: [[knee[0] * H6, -knee[1] * H6]], feet: [[ank[0] * H6, 0]], hands: hands.map((h) => [h.w[0] * H6, -h.w[1] * H6] as Pt), head: [head.x, head.y]},
  };
};

// --- stubble (day 3) ---------------------------------------------------------------------------------------------------

const JAW_FRONT: Pt[] = [[-0.66, 0.5], [0.66, 0.5], [0.58, 0.88], [0.38, 1.08], [0, 1.15], [-0.38, 1.08], [-0.58, 0.88]];
const JAW_SIDE: Pt[] = [[0.8, 0.58], [0.8, 0.85], [0.64, 1.06], [0.44, 1.12], [0.22, 1.08], [0.14, 0.85], [0.3, 0.66], [0.6, 0.58]];
const inPoly = (poly: Pt[], [x, y]: Pt): boolean => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/**
 * Day-3 stubble (user, 30 Oct 2026: "หนวดเป็นจุดเล็กๆ"; pass 7b: sparse, not a blob): about 40 fine dots on the jaw and upper lip,
 * a brown mixed 50 % toward the skin tone (low contrast), seeded so they hold still.
 */
export const stubble = (p: Paint, cx: number, cy: number, K: number, view: 'front' | 'side', skin: string) => {
  const col = mixColor(skin, '#2a1f1a', 0.5);
  const jaw = view === 'front' ? JAW_FRONT : JAW_SIDE;
  let n = 0;
  for (let i = 0; i < 400 && n < 40; i++) {
    const u = view === 'front' ? -0.7 + 1.4 * hash(i * 2 + 5) : 0.05 + 0.8 * hash(i * 2 + 5);
    const v = 0.5 + 0.65 * hash(i * 2 + 6);
    if (!inPoly(jaw, [u, v])) continue;
    n++;
    const r = (0.03 + 0.012 * hash(i + 90)) * K;
    p.part(col, ellipse(cx + u * K, cy + v * K, r, r, 6), false);
  }
};

// --- drawing, shadows and measures -------------------------------------------------------------------------------------

/** Flat wash painter with rotring outlines (the spike's `flatPaint`): washes hold still, outlines boil every two frames. */
export const washPaint = (ctx: PaintContext, base: number): Paint => {
  const {brush} = ctx;
  let seed = base, line = base + 900;
  const ink = (pts: Pt[], weight = 1.0, curve = 0.15, color = INK) => {
    ctx.boil(++line);
    brush.set('rotring', color, weight);
    brush.spline(pts, curve);
  };
  return {
    sil: false, t: ctx.t, id: base,
    fork: (o) => washPaint(ctx, base + o),
    ink,
    part: (color, pts, outline = true) => {
      brush.seed(++seed);
      brush.noiseSeed(seed);
      brush.noStroke();
      brush.noFill();
      brush.wash(color, 255);
      brush.polygon(pts);
      brush.noWash();
      if (outline) ink([...pts, pts[0]]);
    },
  };
};

/** Paint one part: draw callback, silhouette, far (all cel), tube (two tones from the centreline), convex (two tones by clipping),
 *  or a flat wash. `light` is `localTravel` for the figure's direction. */
export const paintPart = (p: Paint, part: Part, light: Pt, sil?: string) => {
  if (part.draw) {
    if (!sil) part.draw(p);
    return;
  }
  if (sil) {
    p.part(sil, part.pts, false);
    return;
  }
  const ink = part.ink ?? true;
  if (part.far) {
    p.part(celTone(part.col), part.pts, ink);
    return;
  }
  if (part.tube && part.tube.celH > 0) {
    // The lit tone is the same tube with its centreline moved toward the key by half the cel band and the radius reduced by the
    // same amount: the lit tube touches the outline on the key side and leaves the cel band on the side away from the key.
    const d = part.tube.celH / 2, s: HU = [-light[0], light[1]];
    const lit = tubeOutline(part.tube.c.map(([x, u]): HU => [x + d * s[0], u + d * s[1]]), part.tube.r.map((v) => Math.max(0.01, v - d)));
    p.part(celTone(part.col), part.pts, false);
    p.part(part.col, toPx(lit), false);
    if (ink) p.ink([...part.pts, part.pts[0]]);
    return;
  }
  if (part.cel > 0) {
    // Convex part: the cel tone everywhere, the lit tone where the part is not within `cel` px of its side away from the key.
    p.part(celTone(part.col), part.pts, false);
    const lit = clipConvex(part.pts, shift(part.pts, [-light[0] * part.cel, -light[1] * part.cel]));
    if (lit.length > 2) p.part(part.col, lit, false);
    if (ink) p.ink([...part.pts, part.pts[0]]);
    return;
  }
  p.part(part.col, part.pts, ink);
};

const headOutlinePx = (h: HeadMark): Pt[] => headOutline().map(([u, v]): Pt => [h.x + u * K6, h.y + v * K6]);

/** Floor cast polygons of a figure (local px): every part and the head, projected from the key (LT-03). */
export const castPolys = (fig: Fig, dir: 1 | -1 = 1): Pt[][] => {
  const polys = fig.parts.filter((p) => !p.draw && p.pts.length > 2).map((p) => floorCast(p.pts, PX_M, dir));
  polys.push(floorCast(headOutlinePx(fig.head), PX_M, dir));
  return polys;
};

/** Where a figure goes in the composition: ground point, scale `k` (1 = 447 px/m) and `dir` (-1 mirrors to face left). */
export type Place = {gx: number; gy: number; k: number; dir: 1 | -1};

/** Pass 9: the sheet frames the upper back to the frame bottom, so the tee runs down past the frame edge and the shorts and legs are not
 *  seen (the head size and the shoulder line are the sheet's; a 6-head body at this head size would show the legs in the lower third). */
export const teeToFrameBottom = (shirt: string): Part => ({col: shirt, cel: 0.4 * H6, pts: toPx([[-0.62, 2.96], [0.62, 2.96], [0.62, -3.2], [-0.62, -3.2]])});


/**
 * Floor cast of a figure, in screen space (`LT-03`): one hull per part and the head (pitched as drawn), each projected by `proj` (the
 * section or the B10 perspective, `CastAt.lat`) and clipped to `clip` (the room's floor, `RK-26` floor-only fallback).
 */
export const figCast = (fig: Fig, proj: Proj, at: CastAt, clip: Pt[], key: readonly number[] = KEY_SEC_DAY): Pt[][] => {
  const h = fig.head, turn = (q: Pt): Pt => (h.tilt && h.pivot ? rotPt(q, h.pivot, h.tilt) : q);
  const polys = fig.parts.filter((p) => !p.draw && p.pts.length > 2).map((p) => castBy(proj, p.pts, at, key, PX_M));
  polys.push(castBy(proj, headOutlinePx(h).map(turn), at, key, PX_M));
  return polys.map((q) => clipConvex(q, clip)).filter((q) => q.length > 2);
};

/** A figure's floor cast on a section plate (`figCast` through the section projection, clipped to the room). */
export const sectionCast = (fig: Fig, S: Section, at: {Y: number; d: number; dir: 1 | -1}, room: readonly [number, number], key: readonly number[] = KEY_SEC_DAY): Pt[][] =>
  figCast(fig, S.P, {...at, lat: 'Y'}, roomFloorQuad(S, room), key);

/**
 * Paint one figure. `floor` is the receiving floor colour: its cast tone is painted first (LT-03), then the contact patches (the
 * darkest tone where the feet or seat touch) unless the figure is measured bare. `screenCast` (section plates, `sectionCast`) replaces the
 * sheet's local cast, painted in screen space. `sil` paints one colour without cel, ink or face.
 */
export const drawFig = (ctx: PaintContext, base: number, fig: Fig, at: Place, o: {floor?: string; sil?: string; screenCast?: Pt[][]; light?: Pt} = {}) => {
  if (o.floor && o.screenCast) {
    const s = washPaint(ctx, base + 700);
    for (const poly of o.screenCast) s.part(castTone(o.floor), poly, false);
  }
  placeAt(ctx.brush, at.gx, at.gy, at.k, at.dir, () => {
    if (o.floor) {
      const s = washPaint(ctx, base + 700);
      if (!o.screenCast) for (const poly of castPolys(fig, at.dir)) s.part(castTone(o.floor), poly, false);
      for (const poly of fig.contact) s.part(castTone(o.floor), poly, false);
    }
    const p = washPaint(ctx, base);
    const light = o.light ?? localTravel(at.dir);
    for (const part of fig.parts) paintPart(p, part, light, o.sil);
    const h = fig.head;
    if (o.sil) {
      const turn = (q: Pt): Pt => (h.tilt && h.pivot ? rotPt(q, h.pivot, h.tilt) : q);
      p.part(o.sil, headOutlinePx(h).map(turn), false);
      if (h.silHair) p.part(o.sil, h.silHair.map(turn), false);
      return;
    }
    if (h.kind === 'front') {
      paintHead(ctx, h.cell, h.x, h.y, K6, h.face, h.style, {blink: h.blink, blinkAt: h.blinkAt});
      h.over?.(ctx, p);
      return;
    }
    const q = h.tilt && h.pivot ? rotated(p, h.pivot, h.tilt) : p;
    if (h.kind === 'side') paintHeadSide(q, h.x, h.y, K6, h.face, h.style, {blink: h.blink, blinkAt: h.blinkAt});
    else paintBackHead(q, h.x, h.y, h.style, h.tufts !== false);
    h.over?.(ctx, q);
  });
};

/** Rotation with the same convention as SideSheet `rotated()` (screen coordinates; a positive angle moves the top to the right). */
export const rotPt = (p: Pt, about: Pt, angle: number): Pt => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [about[0] + (p[0] - about[0]) * c - (p[1] - about[1]) * s, about[1] + (p[0] - about[0]) * s + (p[1] - about[1]) * c];
};

/**
 * Visible top of the artwork above the floor (px, up positive; the lead-height measure excludes the cast shadow): the highest part
 * point or the crown tuft (1.34 K above the head centre), rotated with the head pitch.
 */
export const topPx = (fig: Fig): number => {
  let top = -Infinity;
  for (const p of fig.parts) if (!p.draw) for (const [, y] of p.pts) top = Math.max(top, -y);
  const h = fig.head;
  const tuft: Pt = [h.x, h.y - 1.34 * K6];
  const t = h.tilt && h.pivot ? rotPt(tuft, h.pivot, h.tilt) : tuft;
  return Math.max(top, -t[1]);
};

/** Skull crown (no tufts), px up, with the same pitch. `topPx` minus this is the hair-tuft allowance. */
export const skullTopPx = (fig: Fig): number => {
  const h = fig.head;
  const c: Pt = [h.x, h.y - 1.05 * K6];
  const t = h.tilt && h.pivot ? rotPt(c, h.pivot, h.tilt) : c;
  return -t[1];
};

// Pass 10 (bust.ts, closeups and inserts): helpers shared with the close-shot module. Re-exports only; no behaviour change.
export {BLOOD, HAIR_STRAND, unitHU, mid, lerpHU, prt, tub, convexOf, headMark, torsoMarks, profileFolds, toeLines, hairStrands, footContact, footCtrl, FOOT_R};

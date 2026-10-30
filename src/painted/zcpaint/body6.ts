import type {PaintContext} from '../BrushCanvas';
import {hash} from '../kit/hash';
import {mixColor, type Pt} from '../kit/painter';
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
/** The elbow of the two-bone solve that hangs lower (the elbow under the grip, not up and over it). */
export const lowElbow = (s: HU, t: HU, l1: number, l2: number): HU => {
  const a = ik2(s, t, l1, l2, 1), b = ik2(s, t, l1, l2, -1);
  return a[1] < b[1] ? a : b;
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
  /** Cloth part: the `washPaint` texture applies (`TX-ZCP-CLOTH`, off by default). */
  cloth?: boolean;
  /** Collar stand: the bust neck measure reads its top edge (`CS-ZCP-R26`). */
  collar?: boolean;
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
/** `across` (default 1) scales a mitten's width (thumb side and palm); `along` (default 1) scales its length. Both are opt-in: the shared
 *  mitten is unchanged for every shot that does not pass them. */
export type Hand = {kind: HandKind; w: HU; dir: HU; thumb: 1 | -1; forceCel?: boolean; across?: number; along?: number};
/** Mitten size (BODY-ZCP-6H): 0.26 across, 0.40 long from the wrist cap to the fingertips (the shared default measures 0.37 × 0.52). */
export type MittenSize = {across: number; along: number};
export const MITTEN_6H: MittenSize = {across: 0.7, along: 0.84};

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
  const a = h.across ?? 1, l = h.along ?? 1, ap = (u: number, v: number): HU => at(u * l, v * a);
  // A scaled mitten is one hull: the thumb lobe merges into the palm (two capsules read as a second finger at 270 px).
  if (h.across !== undefined || h.along !== undefined) return [P(hull([...capHU(ap(0.02, 0), ap(0.3, 0), 0.26 * a, 0.22 * a), ...capHU(ap(0.06, 0.1), ap(0.22, 0.18), 0.14 * a, 0.12 * a)]) as HU[], 0.09)];
  return [
    P(capHU(ap(0.02, 0), ap(0.3, 0), 0.26 * a, 0.22 * a), 0.09),
    P(capHU(ap(0.06, 0.1), ap(0.22, 0.18), 0.14 * a, 0.12 * a), 0.07), // thumb lobe
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

// --- costume (CS-ZCP-R26, Boss pass 11; ported from the SPK-ZCP-06 variant B spike, `src/painted/spike/ZcSpk06Figs.ts`) -------------------

/** Costume colours (`CS-ZCP-R26`): the open overshirt over a warm-grey tee, charcoal trousers. Day 3 is slightly darker. */
export type Costume = {over: string; tee: string; pants: string};
export const COSTUME: Costume = {over: '#2f5a5c', tee: '#cdc6b6', pants: '#474d55'};
export const COSTUME_DAY3: Costume = {over: '#2a5254', tee: '#c1b9a8', pants: '#444a51'};
/** The costume of a ZCPAINT figure by role: `zc-you` (day 3 darker); the infected keeps its approved 7b khaki shirt (no tee) and grey-green trousers. */
export const costumeOf = (c: Cast): Costume =>
  c.role === 'zc-infected' ? {over: c.outfit.shirt, tee: c.outfit.shirt, pants: c.outfit.pants}
    : c.role.includes('day 3') ? COSTUME_DAY3 : COSTUME;
/** Cloth parts carry `cloth` (the texture applies to them only, `TX-ZCP-CLOTH`); collar parts carry `collar` (the bust neck measure). */
export const CL = {cloth: true} as const;
export const COL = {cloth: true, collar: true} as const;
/** Cel-tone fold ink for a cloth colour. */
export const foldTone = (col: string) => mixColor(celTone(col), '#1d1a18', 0.25);
/** Open ink strokes (folds, seams, drapes) over the parts, in one colour. */
export const strokes = (segs: HU[][], color: string, w = 0.8): Part => ({
  col: '', pts: [], cel: 0, draw: (p) => { for (const s of segs) p.ink(toPx(s), w, 0.5, color); },
});
/** Cuff line across a sleeve end: `r` head either side of the arm, 0.12 head back from the wrist `w` along the unit arm direction `d`. */
export const cuffLine = (w: HU, d: HU, r: number, col: string): Part => {
  const n: HU = [-d[1], d[0]];
  const a: HU = [w[0] - d[0] * 0.12, w[1] - d[1] * 0.12];
  return strokes([[[a[0] + n[0] * r, a[1] + n[1] * r], [a[0] - n[0] * r, a[1] - n[1] * r]]], foldTone(col), 0.8);
};
/** Trousers from the hip to the ankle on side `s` (±1): thigh radius 0.27 → ankle 0.20 head (`CS-ZCP-R26`). */
export const trouserLeg = (col: string, s: number, hipY = 3.0): Part =>
  tub(col, [[s * 0.3, hipY], [s * 0.29, 2.5], [s * 0.27, 1.6], [s * 0.25, 0.22]], [0.27, 0.25, 0.22, 0.2], 0.14, CL);
/** The open front of the overshirt: placket lines at the edges of the tee strip, and the armpit drapes, in the cel tone. */
export const placket = (col: string): Part => ({
  col: '', pts: [], cel: 0,
  draw: (p) => {
    const f = foldTone(col);
    p.ink(toPx([[-0.24, 4.42], [-0.26, 3.6], [-0.3, 2.74]]), 0.9, 0.5, INK);
    p.ink(toPx([[0.24, 4.42], [0.26, 3.6], [0.3, 2.74]]), 0.9, 0.5, INK);
    p.ink(toPx([[-0.66, 4.0], [-0.56, 3.7], [-0.62, 3.36]]), 0.8, 0.5, f);
    p.ink(toPx([[0.66, 3.9], [0.58, 3.6], [0.64, 3.3]]), 0.8, 0.5, f);
  },
});
/** Collar stand of the overshirt (`CS-ZCP-R26`): a thin band about 0.12 head tall around the neck, its top at `top` heads (≈4.91 at the
 *  front opening, ≈4.95 at the sides and nape). `points` adds two collar points falling to ≈4.4 in front. A band, never a hood (RK-30). */
export const collarStand = (col: string, top: number, points: boolean): Part[] => {
  const stand = convexOf(col, [[-0.27, 4.7], [-0.25, top - 0.03], [0, top], [0.25, top - 0.03], [0.27, 4.7]], 0.05, COL);
  if (!points) return [stand];
  return [stand, ...([-1, 1] as const).map((s) => convexOf(col, [[s * 0.16, top - 0.02], [s * 0.42, 4.8], [s * 0.36, 4.56], [s * 0.24, 4.4]], 0.08, COL))];
};
/** Profile collar stand (zc-you): the top at the nape 4.95, at the front opening 4.91. */
export const collarSide = (col: string): Part => convexOf(col, [[-0.3, 4.72], [-0.3, 4.93], [0.0, 4.95], [0.2, 4.91], [0.26, 4.7]], 0.05, COL);
/** Seated collar stand in the torso frame `T(x, u)` (x forward, u up the torso from the hip): top `frontU` at the front, `backU` at the nape. */
export const collarSeat = (col: string, T: (x: number, u: number) => HU, frontU: number, backU: number): Part =>
  convexOf(col, [T(-0.3, frontU - 0.34), T(-0.3, backU), T(0, backU + 0.04), T(0.2, frontU), T(0.26, frontU - 0.34)], 0.05, COL);
/** Front-view torso outlines (head units): the tee block, the open overshirt (before the tee strip is laid on it). */
const TEE_BODY: HU[] = [[-0.24, 4.82], [0.24, 4.82], [0.46, 4.79], [0.6, 4.7], [0.68, 4.5], [0.7, 4.2], [0.66, 3.7], [0.62, 3.3], [0.62, 2.96], [-0.62, 2.96], [-0.62, 3.3], [-0.66, 3.7], [-0.7, 4.2], [-0.68, 4.5], [-0.6, 4.7], [-0.46, 4.79]];
const OVER_FRONT: HU[] = [[-0.22, 4.84], [0.22, 4.84], [0.46, 4.78], [0.66, 4.54], [0.72, 4.14], [0.7, 3.62], [0.68, 3.2], [0.7, 2.7], [-0.7, 2.7], [-0.68, 3.2], [-0.7, 3.62], [-0.72, 4.14], [-0.66, 4.54], [-0.46, 4.78]];
/** The tee strip between the open fronts of the overshirt (hem over the hip joint, 2.7 heads). */
const TEE_STRIP: HU[] = [[-0.22, 4.8], [0.22, 4.8], [0.26, 3.6], [0.32, 2.72], [-0.32, 2.72], [-0.26, 3.6]];

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
      // Dried blood on the band's lower edge: a streak that runs down with one drip, not a round disc (pass 12 look check).
      if (blood) p.part(BLOOD, toPx([[0.02, 4.7], [0.12, 4.72], [0.2, 4.69], [0.27, 4.66], [0.26, 4.6], [0.28, 4.5], [0.25, 4.45], [0.23, 4.56], [0.18, 4.6], [0.1, 4.6], [0.02, 4.62]]), false);
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

export type FrontOpts = {face?: Face; blink?: boolean; back?: boolean; arms?: 'hang' | 'bucket'; overlay?: 'rage' | 'day3'; blood?: boolean; dirt?: boolean; inserts?: Part[]; cell?: number; mitten?: MittenSize};

/**
 * Standing, front or back view, 6 heads. Arms hang with mitten hands, or hold a bucket handle (`bucket`, B05-SH01). `inserts` are drawn
 * after the torso and before the hands (a prop in front of the body).
 */
export const figFront = (c: Cast, o: FrontOpts = {}): Fig => {
  const k = costumeOf(c), sk = c.head.skin, back = !!o.back, cell = o.cell ?? 0;
  const parts: Part[] = [], armBack: Part[] = [], armFront: Part[] = [], hands: Hand[] = [], contact: Pt[][] = [];
  for (const s of [-1, 1] as const) {
    parts.push(trouserLeg(k.pants, s));
    parts.push(tub(sk, [[s * 0.2, 0.1], [s * 0.33, 0.085]], [0.09, 0.07], 0.06));
    contact.push(footContact(s * 0.27));
  }
  parts.push(convexOf(k.pants, [[-0.56, 3.36], [0.56, 3.36], [0.64, 3.02], [0.6, 2.7], [-0.6, 2.7], [-0.64, 3.02]], 0.34, CL));
  for (const s of [-1, 1] as const) {
    const S: HU = [s * 0.72, 4.44];
    let E: HU = [s * 0.9, 3.56], W: HU = [s * 0.94, 2.68];
    let dir: HU = [s * 0.05, -1], thumb: 1 | -1 = s === 1 ? -1 : 1;
    if (o.arms === 'bucket') {
      // CP-P02 (elbows back, hands in front): the elbow sits just inside the torso edge and a little below the hand. The upper arm is
      // behind the torso in the cel tone; the forearm and hand are in front, foreshortened by the depth (no outward splay).
      E = [s * 0.58, 3.72];
      W = [s * 0.36, 3.9];
      dir = [-s * 0.2, -1];
      thumb = s === 1 ? -1 : 1;
      armBack.push(tub(k.over, [S, mid(S, E, 0.5), E], [0.215, 0.2, 0.19], 0, {far: true, up: true, ...CL}));
      armFront.push(tub(k.over, [E, mid(E, W, 0.5), W], [0.19, 0.18, 0.17], 0.13, {up: true, ...CL}), cuffLine(W, unitHU([W[0] - E[0], W[1] - E[1]]), 0.17, k.over));
    } else {
      armBack.push(tub(k.over, [S, mid(S, E, 0.5), E, W], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true, ...CL}));
      armBack.push(cuffLine(W, unitHU([W[0] - E[0], W[1] - E[1]]), 0.17, k.over));
    }
    hands.push({kind: 'mitten', w: W, dir, thumb, ...o.mitten});
  }
  // Arms behind the torso edge, the approved full-figure neck, the tee block and the open overshirt; the tee strip, placket and collar on the front.
  parts.push(...armBack);
  parts.push(tub(sk, [[0, 4.66], [0, 5.02]], [0.18, 0.17], 0.12, {far: true, ink: false, up: true}));
  parts.push(convexOf(k.tee, TEE_BODY, 0.4, {up: true, ...CL}));
  parts.push(convexOf(k.over, OVER_FRONT, 0.4, {up: true, ...CL}));
  if (!back) parts.push(convexOf(k.tee, TEE_STRIP, 0.12, {up: true, ...CL}), placket(k.over));
  parts.push(...collarStand(k.over, back ? 4.95 : 4.91, !back));
  parts.push(torsoMarks(!back, k.over, !!o.blood, !!o.dirt));
  parts.push(...(o.inserts ?? []), ...armFront);
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

export type SideOpts = {
  face?: Face; blink?: boolean; stride?: number; overlay?: 'day3'; cell?: number;
  /** Plate mitten size (`MITTEN_6H`); the shared mitten when unset. */
  mitten?: MittenSize;
  /** Walk cycle (Boss pass 19): the gait phase in strides (0..1 is one two-step cycle), driven by the distance walked (`gaitPhase`), so a planted
   *  foot is fixed in the world (no sliding). Overrides `stride` poses for legs and arm swing; `stride` > 0 is still required for the walk arms' look. */
  gait?: number;
  /** 0 stands, 1 walks: blends the gait pose to the standing pose (the first and the closing step). Default 1. */
  gaitBlend?: number;
  /** The far arm reaches forward to `grip` (head units, facing +x) with blend `e` (0 hangs, 1 holds the grip): the B06-SH01 fridge hover. */
  hover?: {grip: HU; e: number};
};

/** Gait constants (Boss pass 19): stride (one two-step cycle) in heads, the stance share, the leg bone length. A planted foot moves back
 *  relative to the hip by exactly the distance the body advances, so the foot is fixed in the world (checked by `tests/zcpaint-gait.test.ts`). */
export const GAIT_STRIDE = 2.6, GAIT_STANCE = 0.6, GAIT_LEG = 1.44;
/** Gait phase (strides) for a body that has walked `heads` head units (0.2833 m each, `H6` px at 447 px/m) from a foot strike. */
export const gaitPhase = (heads: number) => heads / GAIT_STRIDE;
const sm = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** One leg at its phase `u` (0..1): the ankle's x offset from the hip (heads, + forward), lift (heads), the forward share `fwd` (-1 rear .. 1 front)
 *  and the foot tilt (heel up, toe up, heads). Stance: the foot runs back at the body's speed; swing: it lifts and returns forward. */
export const gaitLeg = (u0: number) => {
  const u = ((u0 % 1) + 1) % 1, b = GAIT_STANCE, half = (b * GAIT_STRIDE) / 2;
  let off: number, lift = 0, heel = 0, toe = 0;
  if (u < b) {
    off = half - GAIT_STRIDE * u;
    const f = off / half;
    toe = 0.14 * Math.max(0, (f - 0.45) / 0.55);
    heel = 0.2 * Math.max(0, (-f - 0.35) / 0.65);
  } else {
    const t = (u - b) / (1 - b);
    off = -half + 2 * half * sm(t);
    lift = 0.34 * Math.sin(Math.PI * t) ** 0.8;
    heel = 0.2 * (1 - sm(Math.min(1, t * 1.6)));
    toe = 0.14 * sm(Math.max(0, (t - 0.55) / 0.45));
  }
  return {off, lift, fwd: off / half, heel, toe};
};
/** Ankle position for a gait leg: the ankle must stay within the leg's reach (`2 * GAIT_LEG`), so it rises where the leg is nearly straight. */
const gaitAnkle = (hip: HU, off: number, lift: number, base: number): HU => {
  const x = -0.12 + off, reach = 2 * GAIT_LEG - 0.03;
  let y = base + lift;
  const dy = hip[1] - y;
  if (Math.hypot(x, dy) > reach) y = hip[1] - Math.sqrt(Math.max(0, reach * reach - x * x));
  return [x, y];
};
const footCtrlGait = (a: HU, heel: number, toe: number): HU[] => [[a[0] - 0.12, 0.09 + heel + (a[1] - 0.16) * 0.5], [a[0] + 0.36, 0.06 + toe + (a[1] - 0.16) * 0.5]];

/**
 * Profile, 6 heads, facing +x (the mirror for facing left is `dir` -1 in `drawFig`). `stride` 0 stands; 1 is the B04-SH01 walk (near
 * leg forward, far leg back, arms swinging, the far heel lifted).
 */
export const figSide = (c: Cast, o: SideOpts = {}): Fig => {
  const k = costumeOf(c), sk = c.head.skin, cell = o.cell ?? 0;
  // Walking (stride > 0) swings the arms (CP-P03: the near arm back, the far arm forward); standing, they hang straight (CP-P05).
  const walk = (o.stride ?? 0) > 0, a = 0.34 * (o.stride ?? 0);
  const hip: HU = [0, 3.0];
  const gl = o.gait !== undefined ? {n: gaitLeg(o.gait), f: gaitLeg(o.gait + 0.5)} : undefined;
  let kneeN: HU = [Math.sin(a) * 1.4, 3.0 - Math.cos(a) * 1.4], ankN: HU = [kneeN[0] - 0.12, 0.16];
  let kneeF: HU = [-Math.sin(a * 0.7) * 1.4, 3.0 - Math.cos(a * 0.7) * 1.4], ankF: HU = [kneeF[0] - 0.4, 0.24];
  if (gl) {
    const bl = clamp01(o.gaitBlend ?? 1);
    const gaN = gaitAnkle(hip, gl.n.off, gl.n.lift, 0.16), gaF = gaitAnkle(hip, gl.f.off, gl.f.lift, 0.22);
    ankN = lerpHU([-0.12, 0.16], gaN, bl);
    ankF = lerpHU([-0.4, 0.24], gaF, bl);
    kneeN = lerpHU([0, 1.6], ik2(hip, gaN, GAIT_LEG, GAIT_LEG, 1), bl);
    kneeF = lerpHU([0, 1.6], ik2(hip, gaF, GAIT_LEG, GAIT_LEG, 1), bl);
  }
  const footN = (lift: number) => (gl ? footCtrlGait(ankN, gl.n.heel, gl.n.toe) : footCtrl(ankN, lift));
  const footF = (lift: number) => (gl ? footCtrlGait(ankF, gl.f.heel, gl.f.toe) : footCtrl(ankF, lift));
  const hemAt = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  const parts: Part[] = [];
  // Far arm, all cel: a full sleeve to the wrist.
  const sz: Partial<MittenSize> = o.mitten ?? {};
  const SF: HU = walk ? [0.04, 4.42] : [0.02, 4.45];
  let EF: HU = walk ? [0.3, 3.64] : [0.26, 3.6], WF: HU = walk ? [0.5, 2.9] : [0.42, 2.78], farDir: HU = walk ? [0.4, -1] : [0.35, -1];
  if (gl) {
    // Arm swing in the gait (CP-P03): each arm swings against its own-side leg; the forearm bends forward a little.
    const swing = (sh: HU, th: number, bl: number): {E: HU; W: HU} => {
      const E: HU = [sh[0] + 0.9 * Math.sin(th * 0.85), sh[1] - 0.9 * Math.cos(th * 0.85)];
      return {E, W: [E[0] + 0.88 * Math.sin(th + 0.16 * bl), E[1] - 0.88 * Math.cos(th + 0.16 * bl)]};
    };
    const bl = clamp01(o.gaitBlend ?? 1);
    const sf = swing(SF, 0.275 + bl * (-0.075 - 0.3 * gl.f.fwd), bl);
    EF = sf.E; WF = sf.W; farDir = unitHU([WF[0] - EF[0], WF[1] - EF[1]]);
  }
  if (o.hover && o.hover.e > 0) {
    // Hover (B06-SH01): the hang blends into the reach. The elbow takes the lower of the two IK solutions, so it hangs under the grip.
    const G = o.hover.grip, e = o.hover.e;
    const Eh = lowElbow(SF, G, 0.9, 0.88);
    const dh = unitHU([G[0] - Eh[0], G[1] - Eh[1]]), Wh: HU = [G[0] - dh[0] * 0.17, G[1] - dh[1] * 0.17];
    EF = lerpHU(EF, Eh, e);
    WF = lerpHU(WF, Wh, e);
    farDir = lerpHU(farDir, dh, e);
  }
  parts.push(tub(k.over, [SF, mid(SF, EF, 0.5), EF, WF], [0.2, 0.195, 0.18, 0.16], 0, {far: true, up: true, ...CL}));
  parts.push(...handParts({kind: 'mitten', w: WF, dir: farDir, thumb: 1, forceCel: true, ...sz}, sk));
  // Far trousers to the ankle, far foot.
  parts.push(tub(k.pants, [hip, mid(hip, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemAt(kneeF, ankF)], [0.29, 0.27, 0.235, 0.215, 0.2], 0, {far: true, ...CL}));
  parts.push(tub(sk, footF(0.1), FOOT_R, 0, {far: true}));
  // Seat block, near trousers to the ankle, near foot, and the knee and instep folds.
  parts.push(convexOf(k.pants, [[-0.44, 3.24], [0.32, 3.24], [0.4, 2.9], [0.34, 2.62], [-0.44, 2.6], [-0.48, 2.94]], 0.26, CL));
  parts.push(tub(k.pants, [hip, mid(hip, kneeN, 0.5), kneeN, mid(kneeN, ankN, 0.5), hemAt(kneeN, ankN)], [0.3, 0.28, 0.245, 0.22, 0.205], 0.16, CL));
  parts.push(tub(sk, footN(0), FOOT_R, 0.05));
  parts.push(strokes([
    [[kneeN[0] - 0.16, kneeN[1] + 0.1], [kneeN[0] - 0.06, kneeN[1] + 0.02]],
    [[kneeN[0] - 0.18, kneeN[1] - 0.06], [kneeN[0] - 0.06, kneeN[1] - 0.1]],
    [[ankN[0] + 0.02, 0.42], [ankN[0] + 0.12, 0.34], [ankN[0] + 0.2, 0.36]],
  ], foldTone(k.pants)));
  parts.push(toeLines(ankN));
  // Neck behind the collar (the approved full-figure neck), the tee, the open overshirt, its collar and the front edge and waist drag.
  parts.push(tub(sk, [[0.02, 4.6], [0.08, 4.96]], [0.18, 0.17], 0.14, {far: true, ink: false, up: true}));
  parts.push(convexOf(k.tee, [[-0.3, 4.78], [0.02, 4.8], [0.24, 4.74], [0.36, 4.44], [0.36, 3.9], [0.34, 3.4], [0.34, 2.98], [-0.4, 2.98], [-0.42, 3.5], [-0.44, 3.9], [-0.44, 4.5], [-0.4, 4.66]], 0.34, {up: true, ...CL}));
  parts.push(convexOf(k.over, [[-0.36, 4.8], [0.0, 4.84], [0.2, 4.76], [0.3, 4.46], [0.28, 3.9], [0.28, 3.3], [0.33, 2.7], [-0.52, 2.68], [-0.56, 3.3], [-0.56, 3.9], [-0.54, 4.5], [-0.46, 4.7]], 0.36, {up: true, ...CL}));
  parts.push(collarSide(k.over));
  parts.push(strokes([
    [[0.22, 4.74], [0.28, 4.3], [0.28, 3.6], [0.3, 3.0], [0.33, 2.72]],
    [[-0.5, 3.5], [-0.3, 3.4], [-0.1, 3.44]],
    [[-0.14, 4.3], [-0.06, 3.9], [-0.12, 3.5]],
  ], foldTone(k.over)));
  // Near arm: a full sleeve to the wrist, the cuff, the elbow crease and the mitten.
  const SN: HU = walk ? [-0.06, 4.44] : [-0.04, 4.44];
  let EN: HU = walk ? [-0.32, 3.66] : [-0.22, 3.56], WN: HU = walk ? [-0.5, 2.9] : [-0.36, 2.76];
  if (gl) {
    const bl = clamp01(o.gaitBlend ?? 1), th = -0.2 + bl * (0.12 - 0.3 * gl.n.fwd);
    EN = [SN[0] + 0.9 * Math.sin(th * 0.85), SN[1] - 0.9 * Math.cos(th * 0.85)];
    WN = [EN[0] + 0.88 * Math.sin(th + 0.16 * bl), EN[1] - 0.88 * Math.cos(th + 0.16 * bl)];
  }
  parts.push(tub(k.over, [SN, mid(SN, EN, 0.5), EN, WN], [0.215, 0.205, 0.19, 0.17], 0.14, {up: true, ...CL}));
  parts.push(cuffLine(WN, unitHU([WN[0] - EN[0], WN[1] - EN[1]]), 0.16, k.over));
  parts.push(strokes([[[EN[0] + 0.1, EN[1] + 0.04], [EN[0] + 0.02, EN[1] - 0.02]]], foldTone(k.over)));
  parts.push(...handParts({kind: 'mitten', w: WN, dir: gl ? unitHU([WN[0] - EN[0], WN[1] - EN[1]]) : walk ? [-0.3, -1] : [-0.15, -1], thumb: 1, ...sz}, sk));
  parts.push(profileFolds([0, 3.2], [0, 4.5], k.over));
  const hx = 0.1 * H6, hy = -5.0 * H6 - CHIN * K6;
  const over: HeadMark['over'] = (ctx, p) => {
    hairStrands(p, hx, hy);
    if (o.overlay === 'day3') stubble(p, hx, hy, K6, 'side', sk);
    void ctx;
  };
  const head = headMark('side', hx, hy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, over});
  return {
    view: 'profile', parts, head, contact: [...(!gl || ankN[1] < 0.24 ? [footContact(ankN[0])] : []), ...(!gl || ankF[1] < 0.3 ? [footContact(ankF[0])] : [])],
    anchors: {hips: [0, -3.0 * H6], knees: [[kneeN[0] * H6, -kneeN[1] * H6], [kneeF[0] * H6, -kneeF[1] * H6]], feet: [[ankN[0] * H6, 0], [ankF[0] * H6, 0]], hands: [[WN[0] * H6, -WN[1] * H6]], head: [hx, hy]},
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
  for (const sg of [-1, 1] as const) {
    parts.push(trouserLeg(out.pants, sg, hipY));
    parts.push(tub(sk, [[sg * 0.2, 0.1], [sg * 0.33, 0.085]], [0.09, 0.07], 0.06));
    contact.push(footContact(sg * 0.25));
  }
  parts.push(convexOf(out.pants, [[-0.56, hipY + 0.34], [0.56, hipY + 0.34], [0.62, hipY], [0.58, 2.7], [-0.58, 2.7], [-0.62, hipY]], 0.34, CL));
  const top = 4.82 - sd;
  parts.push(tub(sk, [[0, 4.66 - sd], [0, chin + 0.02]], [0.19, 0.18], 0.12, {far: true, ink: false, up: true}));
  parts.push(convexOf(out.shirt, [[-0.24, top], [0.24, top], [0.46, top - 0.03], [0.6, top - 0.12], [0.68, 4.5 - sd * 0.9], [0.7, 4.2 - sd * 0.6], [0.66, 3.7], [0.62, 3.3], [0.62, 2.96], [-0.62, 2.96], [-0.62, 3.3], [-0.66, 3.7], [-0.7, 4.2 - sd * 0.6], [-0.68, 4.5 - sd * 0.9], [-0.6, top - 0.12], [-0.46, top - 0.03]], 0.4, {up: true, ...CL}));
  // Sleeves to the wrist (CS-ZCP-R26) in the khaki of the shirt, the cuff at the wrist, the mitten.
  for (const sg of [-1, 1] as const) {
    const S = lerpHU([sg * 0.72, 4.44], [sg * 0.68, 4.2], s);
    const E = lerpHU([sg * 0.9, 3.56], [sg * 0.84, 3.36], s);
    const W = lerpHU([sg * 0.94, 2.68], [sg * 0.86, 2.44], s);
    parts.push(tub(out.sleeve, [S, mid(S, E, 0.5), E, W], [0.215, 0.2, 0.18, 0.16], 0.13, {up: true, ...CL}));
    parts.push(cuffLine(W, unitHU([W[0] - E[0], W[1] - E[1]]), 0.16, out.sleeve));
    hands.push({kind: 'mitten', w: W, dir: [sg * 0.05 * (1 + s), -1], thumb: sg === 1 ? -1 : 1});
  }
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
  // Far side: cel throughout. Far trousers to the ankle and the far sleeve to the wrist.
  parts.push(tub(out.pants, [H, mid(H, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.6)], [0.27, 0.25, 0.22, 0.2], 0, {far: true, ...CL}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const EF = L([0.26, 3.6], [0.42, 3.38]), WF = L([0.42, 2.78], [0.5, 2.52]), SF = L([0.02, 4.45], [0.24, 4.2]);
  parts.push(tub(out.sleeve, [SF, EF, WF], [0.2, 0.19, 0.17], 0, {far: true, up: true, ...CL}));
  parts.push(...handParts({kind: 'mitten', w: WF, dir: [0.2, -1], thumb: 1, forceCel: true}, sk));
  // Neck from the shoulders to the chin, behind the torso (pass 8: thicker; the head pitches about the neck pivot).
  parts.push(tub(sk, [S, P, chinU], [0.2, 0.19, 0.18], 0.12, {far: true, ink: false, up: true}));
  // Torso: the back of the spine rounds as the shoulders come forward.
  parts.push(convexOf(out.shirt, [[H[0] - 0.4, H[1] - 0.04], [H[0] + 0.34, H[1] - 0.04], [H[0] + 0.38, H[1] + 0.5], [S[0] + 0.3, S[1] - 0.1], [S[0] + 0.18, S[1] + 0.12], [P[0] - 0.08, P[1] - 0.02], [S[0] - 0.26, S[1] + 0.04], [H[0] - 0.42, H[1] + 0.56]], 0.34, {up: true, ...CL}));
  // Near trousers to the ankle, bare foot.
  parts.push(tub(out.pants, [H, mid(H, kneeN, 0.5), kneeN, mid(kneeN, ankN, 0.6)], [0.27, 0.25, 0.22, 0.2], 0.16, CL));
  parts.push(tub(sk, footCtrl(ankN, 0), FOOT_R, 0.05));
  // Near arm: a sleeve to the wrist (hangs under gravity, the elbow barely bent), cuff, mitten.
  const EN = L([-0.22, 3.56], [0.32, 3.34]), WN = L([-0.36, 2.76], [0.38, 2.48]), SN = S;
  parts.push(tub(out.sleeve, [SN, mid(SN, EN, 0.5), EN, WN], [0.215, 0.2, 0.18, 0.16], 0.13, {up: true, ...CL}));
  parts.push(cuffLine(WN, unitHU([WN[0] - EN[0], WN[1] - EN[1]]), 0.16, out.sleeve));
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

export type SeatOpts = {
  face?: Face; blink?: boolean; pitch?: number; overlay?: 'day3'; cell?: number;
  /** Plate mitten size (`MITTEN_6H`); the shared mitten when unset. */
  mitten?: MittenSize;
  /** `bread` (B07-SH02): the far sleeve reaches to the bread and a loaf sits between both mittens. Unset keeps the near hand only. */
  hold?: 'bread';
};
/** Bread (B07-SH02): a loaf between both mittens at the chest, flat cel with the ink outline (not cloth, so never textured). */
const BREAD = '#d9a25c';
const breadPart = (c: HU): Part => convexOf(BREAD, ellHU(c[0], c[1], 0.26, 0.11, 14), 0.1);

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
 * Forearms cross in front of the shins just below the knees, hands as BODY-ZCP-6H mittens (Boss pass 18: the closed fists with finger blocks read
 * as fingers, user "มือตอนนั่งกอดเข่าไม่ต้องมีนิ้วก็ได้"). `pitch` nods the head forward (rad).
 */
export const figSeatFloor = (c: Cast, o: SeatOpts = {}): Fig => {
  const k = costumeOf(c), sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 0.34], ank: HU = [1.22, 0.16];
  const knee = ik2(hip, ank, 1.42, 1.48, 1);
  const lean = 0.13, N: HU = [Math.sin(lean), Math.cos(lean)];
  const S: HU = [hip[0] + 1.8 * N[0], hip[1] + 1.8 * N[1]];
  /** Torso frame: x forward, u up the torso from the hip. */
  const T = (x: number, u: number): HU => [hip[0] + x * N[1] + u * N[0], hip[1] - x * N[0] + u * N[1]];
  const kneeF: HU = [knee[0] - 0.06, knee[1] + 0.02], ankF: HU = [ank[0] - 0.08, ank[1]];
  const hemOf = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  const parts: Part[] = [], hands: Hand[] = [];
  // Far leg (cel): trousers to the ankle, bare foot. Far forearm (cel): a sleeve to the mitten.
  parts.push(tub(k.pants, [hip, mid(hip, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemOf(kneeF, ankF)], [0.32, 0.3, 0.25, 0.22, 0.2], 0, {far: true, ...CL}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const Sf: HU = [S[0] - 0.04, S[1] - 0.05], Tf: HU = [1.02, 1.2];
  const Ef = ik2(Sf, Tf, 0.9, 0.88, -1), df = unitHU([Tf[0] - Ef[0], Tf[1] - Ef[1]]);
  const Wf: HU = [Tf[0] - df[0] * 0.17, Tf[1] - df[1] * 0.17];
  parts.push(tub(k.over, [Sf, mid(Sf, Ef, 0.5), Ef, Wf], [0.215, 0.2, 0.18, 0.16], 0, {far: true, up: true, ...CL}));
  hands.push({kind: 'mitten', w: Wf, dir: df, thumb: 1, forceCel: true, ...MITTEN_6H});
  // The overshirt's back hem lies on the floor behind the hips; the seat block of the trousers.
  parts.push(convexOf(k.over, [[-0.6, 0.04], [0.1, 0.04], [0.2, 0.5], [-0.52, 0.86]], 0.2, CL));
  parts.push(convexOf(k.pants, [[-0.46, 0.74], [0.3, 0.52], [0.36, 0.04], [-0.42, 0.02]], 0.24, CL));
  // Near leg: trousers to the ankle, bare foot; the knee folds.
  parts.push(tub(k.pants, [hip, mid(hip, knee, 0.5), knee, mid(knee, ank, 0.5), hemOf(knee, ank)], [0.31, 0.28, 0.24, 0.215, 0.2], 0.2, CL));
  parts.push(tub(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  parts.push(strokes([
    [[knee[0] - 0.2, knee[1] - 0.18], [knee[0] - 0.06, knee[1] - 0.26]],
    [[knee[0] - 0.3, knee[1] - 0.3], [knee[0] - 0.14, knee[1] - 0.4]],
    [[ank[0] - 0.02, 0.44], [ank[0] + 0.08, 0.36], [ank[0] + 0.18, 0.38]],
  ], foldTone(k.pants)));
  // Neck (bare, from the shoulder point to the chin), then the tee and the open overshirt over the back and side (the front stops short,
  // so the tee shows at the chest), its folds, the near sleeve to the mitten, and the collar.
  const chin: HU = [S[0] + 0.27 * N[0], S[1] + 0.27 * N[1]];
  parts.push(tub(sk, [S, chin], [0.15, 0.13], 0.12, {ink: false, up: true}));
  parts.push(convexOf(k.tee, [[hip[0] - 0.42, hip[1] - 0.08], [hip[0] + 0.38, hip[1] - 0.08], [S[0] + 0.38, S[1]], [S[0] - 0.42, S[1]]], 0.34, {up: true, ...CL}));
  parts.push(convexOf(k.over, [[hip[0] - 0.52, hip[1] - 0.2], [hip[0] + 0.3, hip[1] - 0.12], [S[0] + 0.26, S[1] + 0.04], [S[0] - 0.2, S[1] + 0.12], [S[0] - 0.5, S[1] + 0.02]], 0.34, {up: true, ...CL}));
  parts.push(strokes([
    [[S[0] + 0.2, S[1]], [S[0] + 0.1, S[1] - 0.6], [hip[0] + 0.3, hip[1] - 0.1]],
    [[hip[0] - 0.4, hip[1] + 0.5], [hip[0] - 0.2, hip[1] + 0.4], [hip[0] - 0.02, hip[1] + 0.46]],
  ], foldTone(k.over)));
  const Sa: HU = [S[0] + 0.02, S[1] - 0.05], Tn: HU = [1.12, 1.12];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(tub(k.over, [Sa, mid(Sa, En, 0.5), En, Wn], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true, ...CL}));
  parts.push(cuffLine(Wn, dn, 0.16, k.over));
  hands.push({kind: 'mitten', w: Wn, dir: dn, thumb: 1, ...MITTEN_6H});
  for (const h of hands) parts.push(...handParts(h, sk));
  parts.push(profileFolds(hip, S, k.over));
  parts.push(toeLines(ank));
  parts.push(collarSeat(k.over, T, 1.98, 2.0));
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
  const k = costumeOf(c), sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 1.85], knee: HU = [1.404, 1.64], ank: HU = [1.404, 0.16];
  const lean = -0.17, N: HU = [Math.sin(lean), Math.cos(lean)];
  const S: HU = [hip[0] + 1.8 * N[0], hip[1] + 1.8 * N[1]];
  const T = (x: number, u: number): HU => [hip[0] + x * N[1] + u * N[0], hip[1] - x * N[0] + u * N[1]];
  const kneeF: HU = [knee[0] - 0.04, knee[1]], ankF: HU = [ank[0] - 0.04, ank[1]];
  const hemOf = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  const parts: Part[] = [], hands: Hand[] = [];
  // Far leg (cel) and foot; near leg: trousers to the ankle, bare foot on the floor.
  parts.push(tub(k.pants, [hip, mid(hip, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemOf(kneeF, ankF)], [0.25, 0.23, 0.21, 0.19, 0.18], 0, {far: true, ...CL}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  parts.push(tub(k.pants, [hip, mid(hip, knee, 0.5), knee, mid(knee, ank, 0.5), hemOf(knee, ank)], [0.25, 0.23, 0.21, 0.19, 0.18], 0.18, CL));
  parts.push(tub(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  const sz: Partial<MittenSize> = o.mitten ?? {};
  // Far sleeve (cel, behind the torso) to the bread when the B07 hold is on: the far mitten reaches forward under the near one.
  if (o.hold === 'bread') {
    const Sf: HU = [S[0] - 0.12, S[1] - 0.1], Tf: HU = [0.6, 2.78];
    const Ef = lowElbow(Sf, Tf, 0.9, 0.88), df = unitHU([Tf[0] - Ef[0], Tf[1] - Ef[1]]), Wf: HU = [Tf[0] - df[0] * 0.17, Tf[1] - df[1] * 0.17];
    parts.push(tub(k.over, [Sf, mid(Sf, Ef, 0.5), Ef, Wf], [0.215, 0.205, 0.19, 0.17], 0, {far: true, up: true, ...CL}));
    parts.push(...handParts({kind: 'mitten', w: Wf, dir: df, thumb: 1, forceCel: true, ...sz}, sk));
  }
  // Neck (bare, shoulder point to the chin), the tee and the open overshirt over the torso.
  const chin: HU = [S[0] + 0.27 * N[0], S[1] + 0.27 * N[1]];
  parts.push(tub(sk, [S, chin], [0.15, 0.13], 0.12, {ink: false, up: true}));
  parts.push(convexOf(k.tee, [[hip[0] - 0.42, hip[1] - 0.1], [hip[0] + 0.36, hip[1] - 0.1], [S[0] + 0.36, S[1]], [S[0] - 0.42, S[1]]], 0.34, {up: true, ...CL}));
  parts.push(convexOf(k.over, [[hip[0] - 0.5, hip[1] - 0.2], [hip[0] + 0.3, hip[1] - 0.14], [S[0] + 0.3, S[1] + 0.04], [S[0] - 0.4, S[1] + 0.06]], 0.34, {up: true, ...CL}));
  // Near sleeve to the wrist, cuff, mitten on the bread at the chest.
  const Sa: HU = [S[0] + 0.03, S[1] - 0.06], Tn: HU = [0.52, 2.92];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(tub(k.over, [Sa, mid(Sa, En, 0.5), En, Wn], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true, ...CL}));
  parts.push(cuffLine(Wn, dn, 0.16, k.over));
  hands.push({kind: 'mitten', w: Wn, dir: dn, thumb: 1, ...sz});
  if (o.hold === 'bread') parts.push(breadPart([0.58, 2.97]));
  for (const h of hands) parts.push(...handParts(h, sk));
  parts.push(profileFolds(hip, S, k.over));
  parts.push(collarSeat(k.over, T, 1.98, 2.0));
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
/** Stubble grid pitch in decal units (K): one dot per cell of the jaw box, jittered inside its cell (B09/B10 R2.6 fix). */
const STUBBLE_PITCH = 0.03;
/**
 * Day-3 stubble (user, 30 Oct 2026: "หนวดเป็นจุดเล็กๆ", S-P01): fine dots on the jaw and upper lip, a brown mixed 50 % toward the skin tone
 * (low contrast), seeded so they hold still. R2.6 overview fix: one jittered dot per grid cell, radius 0.0045-0.006 K (about 1.2-1.6 px at
 * the bust close, 0.5 px on a full figure). The earlier 40 random dots of 0.03-0.042 K clumped into blobs (DF-20261030-zcpaint-day3-stubble-spots).
 */
export const stubble = (p: Paint, cx: number, cy: number, K: number, view: 'front' | 'side', skin: string) => {
  const col = mixColor(skin, '#2a1f1a', 0.5);
  const jaw = view === 'front' ? JAW_FRONT : JAW_SIDE;
  const [u0, u1, v0, v1] = view === 'front' ? [-0.66, 0.66, 0.5, 1.15] : [0.14, 0.8, 0.58, 1.12];
  const nu = Math.ceil((u1 - u0) / STUBBLE_PITCH), nv = Math.ceil((v1 - v0) / STUBBLE_PITCH);
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const s = 3 * (j * nu + i) + 1;
      const u = u0 + (i + 0.2 + 0.6 * hash(s)) * STUBBLE_PITCH, v = v0 + (j + 0.2 + 0.6 * hash(s + 1)) * STUBBLE_PITCH;
      if (!inPoly(jaw, [u, v])) continue;
      const r = (0.0045 + 0.0015 * hash(s + 2)) * K;
      p.part(col, ellipse(cx + u * K, cy + v * K, r, r, 6), false);
    }
  }
};

// --- drawing, shadows and measures -------------------------------------------------------------------------------------

/** TX-ZCP-CLOTH (R2.6): the cloth texture, off by default. `dark` darkens the glaze; `hatch` lays a 2B pencil hatch in the cel band. */
export type Tex = {opacity: number; texture: number; border: number; dark: number; hatch?: {dist: number; angle: number; weight: number; mix: number}};
/** Variant B (SPK-ZCP-06): glaze 150 at 26 % darker, `fillTexture(0.7, 0.6)`, bleed 0; 2B hatch 7 px at 40 deg, weight 1.0, mix 0.6. */
export const TEX_B: Tex = {opacity: 150, texture: 0.7, border: 0.6, dark: 0.26, hatch: {dist: 7, angle: 40, weight: 1.0, mix: 0.6}};
/** `cloth`: the colours of cloth washes (lit and cel tones); `tex` on: each cloth wash takes one seeded glaze over its own opaque wash, the
 *  cel tones take the hatch. `scale`: the screen scale of the figure (the hatch keeps its screen spacing at a close). Seeds count per part. */
export type WashOpts = {cloth?: ReadonlySet<string>; tex?: Tex; scale?: number};
/** Flat wash painter with rotring outlines (the spike's `flatPaint`): washes hold still, outlines boil every two frames. */
export const washPaint = (ctx: PaintContext, base: number, opt: WashOpts = {}): Paint => {
  const {brush} = ctx;
  let seed = base, line = base + 900, tseed = base + 5000;
  const {cloth, tex} = opt, sk = opt.scale ?? 1;
  const shade = new Set([...(cloth ?? [])].filter((col) => [...(cloth ?? [])].some((b) => celTone(b) === col)));
  const ink = (pts: Pt[], weight = 1.0, curve = 0.15, color = INK) => {
    ctx.boil(++line);
    brush.set('rotring', color, weight);
    brush.spline(pts, curve);
  };
  return {
    sil: false, t: ctx.t, id: base,
    fork: (o) => washPaint(ctx, base + o, opt),
    ink,
    part: (color, pts, outline = true) => {
      brush.seed(++seed);
      brush.noiseSeed(seed);
      brush.noStroke();
      brush.noFill();
      brush.wash(color, 255);
      brush.polygon(pts);
      brush.noWash();
      if (tex && cloth?.has(color) && pts.length > 2) {
        brush.seed(++tseed);
        brush.noiseSeed(tseed);
        brush.noStroke();
        brush.fill(mixColor(color, '#141012', tex.dark), tex.opacity);
        brush.fillBleed(0);
        brush.fillTexture(tex.texture, tex.border, false, 0.2);
        brush.polygon(pts);
        brush.noFill();
        if (tex.hatch && shade.has(color)) {
          brush.seed(++tseed);
          brush.noiseSeed(tseed);
          brush.hatch(tex.hatch.dist / sk, tex.hatch.angle, {rand: 0.25, continuous: false, gradient: 0.15});
          brush.hatchStyle('2B', mixColor(color, '#1a1720', tex.hatch.mix), tex.hatch.weight / Math.sqrt(sk));
          brush.polygon(pts);
          brush.noHatch();
        }
      }
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

/** The cloth colours of a figure, lit and cel: the texture's targets (`TX-ZCP-CLOTH`). */
export const clothTones = (fig: Fig): Set<string> => new Set(fig.parts.filter((p) => p.cloth).flatMap((p) => [p.col, celTone(p.col)]));

/**
 * Paint one figure. `floor` is the receiving floor colour: its cast tone is painted first (LT-03), then the contact patches (the
 * darkest tone where the feet or seat touch) unless the figure is measured bare. `screenCast` (section plates, `sectionCast`) replaces the
 * sheet's local cast, painted in screen space. `sil` paints one colour without cel, ink or face. `tex` adds the cloth texture (off by default).
 */
export const drawFig = (ctx: PaintContext, base: number, fig: Fig, at: Place, o: {floor?: string; sil?: string; screenCast?: Pt[][]; light?: Pt; tex?: Tex} = {}) => {
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
    const p = o.tex ? washPaint(ctx, base, {cloth: clothTones(fig), tex: o.tex, scale: at.k}) : washPaint(ctx, base);
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

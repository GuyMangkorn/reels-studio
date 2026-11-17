import type {Brush} from '../BrushCanvas';
import type {CastDef, FigAnchors, FigPose} from '../kit/cast';
import {shoulderPoint} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import type {FaceState} from '../kit/head';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {hull} from '../kit/world';
import {camPoint, camSpace, camUnit, viewAngle, type YCam} from '../kit/ycam';
import {paintCourtCap} from './cast';
import {coverOn, coverRest} from './hall';

// EDU-EP22-SHORT episode movement (Boss W5.1, 2026-11-16; scene sheets EDU-EP22-SCENES-R1, brief N5). Every value is a pure function of the
// shot-local frame L (direct seek, no state). Kit intake (W8.4) files the reusable pieces:
// - `track`: world keyframes with a smoothstep per span (hands, covers, trays, spoons).
// - `paintPerson`: a standing eunuch with world hand targets (picture-px IK from the shoulder, reach-clamped by the rig), the court cap, a walk
//   phase from the distance travelled (kit 1.1 m per cycle at 1.7 m), and a view from the world facing (front / back / profile squared to the lens).
// - `new: cover-lift` (`coverLift`): one mitten on the knob lifts the silver cover straight up, carries it back and sets it on the runner on its
//   bowl's +z side (`hall.ts` rest point), or the reverse (set back on); the hand blends in from and out to the caller's rest hand.
// - `new: spoon-taste`: keyed per shot (dip into the bowl, spoon to the mouth, rest on SAU) with `mouthPx` from a dry run of the same figure.
// - Carrier walk paths (`walkPath`): a polyline with arrival frame, constant speed, the walk phase from the distance and an ease-out stop.
// - Far-side reach (`clipPolyPainter`, `armHull`): a figure behind a table is painted twice, its body clipped above the table's far edge and its
//   reaching forearms, hands and held props clipped to their hull after the table and its bowls, so hands over a table top are not covered by it.

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const seg = (L: number, a: number, b: number) => clamp01((L - a) / (b - a));
export const smooth = (k: number) => k * k * (3 - 2 * k);
export const ramp = (L: number, a: number, b: number) => smooth(seg(L, a, b));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const add3 = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
export const lerpPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

export type Key = [number, V3];
/** World keyframes: held before the first and after the last key, smoothstep inside each span. */
export const track = (L: number, keys: Key[]): V3 => {
  if (L <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (L <= keys[i][0]) return lerp3(keys[i - 1][1], keys[i][1], ramp(L, keys[i - 1][0], keys[i][0]));
  return keys[keys.length - 1][1];
};

/** World point at picture point `pt` and view depth `d` (inverse of `camPoint`). */
export const unproject = (c: YCam, pt: Pt, d: number): V3 => {
  const r = ((pt[0] - 540 - (c.cx ?? 0)) * d) / c.f, u1 = ((c.hy - pt[1]) * d) / c.f, pc = c.pitch ?? 0;
  const cs = Math.cos(pc), sn = Math.sin(pc), u = u1 * cs + d * sn, dd = d * cs - u1 * sn;
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw);
  return [c.x + r * co + dd * s, c.y + u, c.z + r * s - dd * co];
};
export const depthOf = (c: YCam, v: V3) => camSpace(c, v).d;

// ---------------------------------------------------------------------------------------------------------------------------- clipping
const inConvex = (q: Pt, poly: Pt[], sgn: number) => poly.every((a, i) => { const b = poly[(i + 1) % poly.length]; return sgn * ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) >= 0; });
const clipConvex = (pts: Pt[], clip: Pt[], sgn: number): Pt[] => {
  let out = pts;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], side = (q: Pt) => sgn * ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]));
    const src = out; out = [];
    for (let k = 0; k < src.length; k++) {
      const p = src[k], q = src[(k + 1) % src.length], dp = side(p), dq = side(q);
      if (dp >= 0) out.push(p);
      if ((dp >= 0) !== (dq >= 0)) { const t = dp / (dp - dq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
  }
  return out;
};
/** A painter whose marks stay inside the convex picture polygon `poly` (episode copy of kit `clipPainter` for any convex region). */
export const clipPolyPainter = (p: Painter, poly: Pt[]): Painter => {
  const sgn = Math.sign((poly[1][0] - poly[0][0]) * (poly[2][1] - poly[0][1]) - (poly[1][1] - poly[0][1]) * (poly[2][0] - poly[0][0])) || 1;
  const raw = p.brush as unknown as Record<string | symbol, unknown>;
  const brush = new Proxy(raw, {get: (t, k) => {
    const v = Reflect.get(t, k, t);
    if (typeof v !== 'function') return v;
    if (k === 'polygon') return (pts: Pt[]) => { const q = clipConvex(pts, poly, sgn); if (q.length >= 3) v.call(t, q); };
    if (k === 'spline') return (pts: Pt[], curv?: number) => {
      let run: Pt[] = [];
      const flush = () => { if (run.length >= 2) v.call(t, run, curv); run = []; };
      for (const q of pts) { if (inConvex(q, poly, sgn)) run.push(q); else flush(); }
      flush();
    };
    if (k === 'line') return (x1: number, y1: number, x2: number, y2: number) => { if (inConvex([x1, y1], poly, sgn) && inConvex([x2, y2], poly, sgn)) v.call(t, x1, y1, x2, y2); };
    return v.bind(t);
  }}) as unknown as Brush;
  return {...p, brush, layer: (a, base) => clipPolyPainter(p.layer(a, base), poly),
    wash: (col, op, pts, bleed, tex) => { const k = clipConvex(pts, poly, sgn); if (k.length >= 3) p.wash(col, op, k, bleed, tex); },
    flat: (col, pts) => { const k = clipConvex(pts, poly, sgn); if (k.length >= 3) p.flat(col, k); }};
};
/** The picture region above the line through `a` and `b` (extended across the frame). */
export const abovePoly = (a: Pt, b: Pt): Pt[] => {
  const k = (b[1] - a[1]) / (b[0] - a[0] || 1e-6), y = (x: number) => a[1] + (x - a[0]) * k;
  return [[-400, -400], [1480, -400], [1480, y(1480)], [-400, y(-400)]];
};
/** Convex hull around a reaching forearm and hand: from 40 % of the shoulder-hand line to just past the hand, `w` px wide, plus `extra` points. */
export const armHull = (sh: Pt, hand: Pt, w: number, extra: Pt[] = []): Pt[] => {
  const a = lerpPt(sh, hand, 0.4), dx = hand[0] - sh[0], dy = hand[1] - sh[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const b: Pt = [hand[0] + (dx / L) * w, hand[1] + (dy / L) * w];
  return hull([[a[0] + nx * w, a[1] + ny * w], [a[0] - nx * w, a[1] - ny * w], [b[0] + nx * w, b[1] + ny * w], [b[0] - nx * w, b[1] - ny * w], ...extra]);
};

// ---------------------------------------------------------------------------------------------------------------------------- people
export type View4 = 'front' | 'left' | 'right' | 'back';
/** View squared to the lens for a figure at `at` facing the world direction `facing`: front within 50 deg, back beyond 130, else the profile
 *  toward the side it faces (kit `viewAngle`: +90 = facing screen right). */
export const viewOf = (c: YCam, at: V3, facing: [number, number]): View4 => {
  const a = viewAngle(c, at, facing);
  return Math.abs(a) <= 50 ? 'front' : Math.abs(a) >= 130 ? 'back' : a > 0 ? 'right' : 'left';
};
/** Kit walk cycle: 1.1 m per cycle for a 1.7 m adult (motions.ts WALK_STEP), scaled by height. */
export const walkPhase = (def: CastDef, dist: number) => dist / (1.1 * (def.height / 1.7));

export type PersonOpts = {
  at: V3; t: number; seed?: number;
  /** View squared to the lens, or a world facing resolved by `viewOf`; `kitFacing` hands the facing to the kit (eight views, quarter turns). */
  view?: View4; facing?: [number, number]; kitFacing?: boolean;
  pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; fig?: Partial<FigPose>;
  walk?: number; stride?: number;
  /** World hand targets (picture-px IK from the shoulder, reach-clamped). */
  hands?: {r?: V3; l?: V3; rOut?: number; lOut?: number; behind?: boolean};
  /** Picture-px hand targets (a blend between the rest hand and a world target); win over `hands`. */
  handsPx?: {r?: Pt; l?: Pt};
  held?: (p: Painter, a: FigAnchors, u: number) => void;
  shadow?: FigureAtOpts['shadow'];
  cap?: boolean;
};
/** The view a `PersonOpts` draws with (for arm sides and the cap). */
export const personView = (c: YCam, o: PersonOpts): View4 => o.view ?? (o.facing ? viewOf(c, o.at, o.facing) : 'front');
const handArm = (c: YCam, w: V3, out?: number, behind?: boolean) => {
  const to = camPoint(c, w);
  return to ? {to, ...(out !== undefined ? {out} : {}), ...(behind ? {behind: 'upper' as const} : {})} : undefined;
};
/** A standing (or walking) eunuch with world hand targets and the court cap. Returns the kit anchors (null when off camera). */
export const paintPerson = (p: Painter, c: YCam, def: CastDef, o: PersonOpts): FigAnchors | null => {
  const v = personView(c, o);
  const fig: Partial<FigPose> = {...(o.walk !== undefined ? {walk: o.walk, stride: o.stride ?? 1} : {}), ...o.fig};
  if (o.hands?.r) { const a = handArm(c, o.hands.r, o.hands.rOut, o.hands.behind); if (a) fig.rArm = a; }
  if (o.hands?.l) { const a = handArm(c, o.hands.l, o.hands.lOut, o.hands.behind); if (a) fig.lArm = a; }
  if (o.handsPx?.r) fig.rArm = {to: o.handsPx.r, ...(o.hands?.behind ? {behind: 'upper' as const} : {})};
  if (o.handsPx?.l) fig.lArm = {to: o.handsPx.l, ...(o.hands?.behind ? {behind: 'upper' as const} : {})};
  return paintFigureAt(p, c, def, {
    at: o.at, t: o.t, pose: o.pose ?? 'P01', face: o.face ?? 'neutral', faceState: o.faceState, fig, seed: o.seed ?? def.seed, shadow: o.shadow,
    ...(o.kitFacing && o.facing ? {facing: o.facing} : {view: v}),
    held: (q, a, u) => { if (o.cap !== false) paintCourtCap(q, a, v === 'back' ? 'back' : v, (o.seed ?? def.seed) * 10 + 7); o.held?.(q, a, u); },
  });
};
/** Anchors of the same figure without painting (to aim a hand at the mouth before the arm is drawn). */
const NOOP = makePainter(new Proxy({}, {get: () => () => undefined}) as unknown as Brush, {t: 0, frame: 0});
export const personAnchors = (c: YCam, def: CastDef, o: PersonOpts): FigAnchors | null => paintPerson(NOOP, c, def, {...o, hands: undefined, handsPx: undefined, held: undefined});
/** Picture shoulder of a figure drawn by `paintPerson` (for arm hulls). */
export const shoulderPx = (c: YCam, def: CastDef, o: PersonOpts, side: 'r' | 'l'): Pt | null => {
  const g = camPoint(c, o.at);
  if (!g) return null;
  return shoulderPoint(def, g, camUnit(c, o.at), {view: personView(c, o), ...(o.fig ?? {})} as never, side);
};
/** Mouth of a figure in picture px (from its anchors: a little below the head centre, toward the facing side in profile). */
export const mouthPx = (a: FigAnchors, v: View4): Pt => {
  const K = (a.chin - a.headTop) / 2.39, s = v === 'left' ? -1 : v === 'right' ? 1 : 0;
  return [a.head[0] + s * 0.75 * K, a.head[1] + 0.72 * K];
};

// ---------------------------------------------------------------------------------------------------------------------------- N5 cover-lift
export type CoverLift = {state: 'on' | 'held' | 'off'; cover: V3; knob: V3; w: number};
/**
 * `new: cover-lift` for long-table bowl `i` at frame L: lift starts at `t0`, straight up `up` frames (0.12 m), back over the runner and down onto
 * the rest point in `carry` frames. `reverse` sets it back on (rest -> up -> on). `w` 0..1 is the hand's engagement (in over `approach`
 * frames before t0, out over `leave` after the set-down): hand = lerp(rest hand, knob, w).
 */
export const coverLift = (i: number, L: number, t0: number, o: {up?: number; carry?: number; approach?: number; leave?: number; reverse?: boolean} = {}): CoverLift => {
  const up = o.up ?? 5, carry = o.carry ?? 7, ap = o.approach ?? 4, lv = o.leave ?? 5, end = t0 + up + carry;
  const on = coverOn(i), rest = coverRest(i), top = add3(on, [0, 0.12, 0]), over = add3(rest, [0, 0.09, 0]);
  const keys: Key[] = o.reverse ? [[t0, rest], [t0 + carry * 0.55, over], [t0 + carry, top], [end, on]] : [[t0, on], [t0 + up, top], [t0 + up + carry * 0.45, over], [end, rest]];
  const cover = track(L, keys);
  const state = L < t0 ? (o.reverse ? 'off' : 'on') : L >= end ? (o.reverse ? 'on' : 'off') : 'held';
  const w = L < t0 ? ramp(L, t0 - ap, t0) : L <= end ? 1 : 1 - ramp(L, end, end + lv);
  return {state, cover, knob: add3(cover, [0, 0.07, 0]), w};
};

// ---------------------------------------------------------------------------------------------------------------------------- carrier paths
export type WalkPath = {pts: V3[]; /** frame the walk starts (at pts[0]) */ t0: number; /** arrival frame at the last point */ t1: number};
/** Position, facing and distance walked on a polyline at constant speed (ease-out over the last 0.35 m), held before t0 and after t1. */
export const walkPath = (w: WalkPath, L: number): {at: V3; facing: [number, number]; dist: number; moving: boolean} => {
  const segs = w.pts.slice(1).map((b, i) => { const a = w.pts[i]; return {a, b, len: Math.hypot(b[0] - a[0], b[2] - a[2])}; });
  const total = segs.reduce((s, q) => s + q.len, 0), k = seg(L, w.t0, w.t1);
  // constant speed to 85 % of the time, then a linear brake to a stop at t1 (no pop in speed or position)
  const kb = 0.85, v = 1 / (kb + (1 - kb) / 2), f = k < kb ? v * k : v * kb + v * ((k - kb) - (k - kb) ** 2 / (2 * (1 - kb)));
  const dist = total * Math.min(1, f);
  let d = dist;
  for (const s of segs) {
    if (d <= s.len || s === segs[segs.length - 1]) {
      const u = s.len ? Math.min(1, d / s.len) : 1;
      return {at: lerp3(s.a, s.b, u), facing: [(s.b[0] - s.a[0]) / (s.len || 1), (s.b[2] - s.a[2]) / (s.len || 1)], dist, moving: L > w.t0 && L < w.t1};
    }
    d -= s.len;
  }
  const last = segs[segs.length - 1];
  return {at: last.b, facing: [(last.b[0] - last.a[0]) / (last.len || 1), (last.b[2] - last.a[2]) / (last.len || 1)], dist, moving: false};
};
/** Unit vector toward `to` from `from` in the floor plane. */
export const toward = (from: V3, to: V3): [number, number] => { const dx = to[0] - from[0], dz = to[2] - from[2], L = Math.hypot(dx, dz) || 1; return [dx / L, dz / L]; };

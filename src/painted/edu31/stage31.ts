import {shoulderPoint, BONE, type Arm, type CastDef, type FigPose} from '../kit/cast';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import {clipConvex} from '../kit/clip-circle';
import {drawChair} from '../kit/props';
import {poseFor, type AnyPoseId} from '../kit/poses';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, mixYCam, type YCam} from '../kit/ycam';
import type {Item} from '../kit/world';
import {cam} from './set31';

// EDU-EP31-SHORT plate staging helpers (Boss W5.2 batch 1, 2026-11-21): timing curves on the shot clock, sheet camera lines and moves, kit
// figure placement (optionally on a chair), and the picture-plane two-bone arm that ends on a projected world point (hand-drawing 8: one chain,
// both bones at most `BONE`, the hand pulled back to full reach when a target is out of range). React-free.

export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const smooth = (u: number) => { const x = clamp01(u); return x * x * (3 - 2 * x); };
/** 0 -> 1 over shot frames [a, b], eased in and out. */
export const ez = (L: number, a: number, b: number) => smooth((L - a) / (b - a));
/** 0 -> 1 over [a, b], linear. */
export const lin = (L: number, a: number, b: number) => clamp01((L - a) / (b - a));
/** 0 -> 1 -> 0 over [a, b] (sine hump). */
export const hump = (L: number, a: number, b: number) => Math.sin(Math.PI * clamp01((L - a) / (b - a)));
/** Ease-out (fast start): 1 - (1 - u)^2. */
export const eout = (u: number) => { const x = clamp01(u); return 1 - (1 - x) * (1 - x); };
/** Ease-in (slow start): u^2. */
export const ein = (u: number) => { const x = clamp01(u); return x * x; };
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;
export const mix2 = (a: Pt, b: Pt, u: number): Pt => [mix(a[0], b[0], u), mix(a[1], b[1], u)];
export const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
/** Piecewise keys [frame, value] with eased segments. */
export const keysAt = (L: number, ks: readonly (readonly [number, number])[]): number => {
  if (L <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (L <= ks[i][0]) return mix(ks[i - 1][1], ks[i][1], ez(L, ks[i - 1][0], ks[i][0]));
  return ks[ks.length - 1][1];
};

/** A sheet camera line: `eye` m, yaw / pitch degrees, f px, hy row. */
export type CamLine = {eye: V3; yaw: number; pitch?: number; f: number; hy: number; near?: number};
export const camOf = (o: CamLine): YCam => ({...cam(o.eye[0], o.eye[1], o.eye[2], o.yaw, o.pitch ?? 0, o.f, o.hy), ...(o.near ? {near: o.near} : {})});
/** A camera move a -> b eased in and out over shot frames [L0, L1] (the sheet's "every field interpolates with ease-in-out"). */
export const camMove = (a: CamLine, b: CamLine, L0: number, L1: number) => (L: number): YCam => mixYCam(camOf(a), camOf(b), ez(L, L0, L1));

/** Picture point and px per metre of a world point. */
export const gu = (c: YCam, at: V3) => ({g: camPoint(c, at)!, u: camUnit(c, at)});
export const proj = (c: YCam, v: V3): Pt => camPoint(c, v, 0.02) ?? [-9999, -9999];

type FigOpts = Omit<FigureAtOpts, 't'> & {t?: number};
/** A kit figure as a depth-sorted item; `chair` paints the plain kitchen chair under a seated figure first. `out` receives the anchors. */
export const fig = (def: CastDef, o: FigOpts, chair?: boolean, out?: {a?: ReturnType<typeof paintFigureAt>}): Item => ({
  at: o.at,
  draw: (p, c) => {
    if (chair) { const g = camPoint(c, o.at); if (g) drawChair(p, (o.seed ?? def.seed) + 900, g, camUnit(c, o.at), def, o.view === 'back' ? 'front' : (o.view ?? 'front'), {color: '#7a5a3a'}); }
    const a = paintFigureAt(p, c, def, {...o, t: o.t ?? 0});
    if (out) out.a = a;
  },
});

/** Shoulder of a placed figure in picture px (character side), for the body fields it will be drawn with. */
export const shoulderAt = (def: CastDef, c: YCam, at: V3, body: Partial<FigPose> & {view: FigPose['view']}, side: 'r' | 'l', scale = 1): Pt => {
  const {g, u} = gu(c, at);
  return shoulderPoint(def, g, u * scale, body as Parameters<typeof shoulderPoint>[3], side);
};

/** Two-bone arm in the picture plane from shoulder `sh` to the hand target `to` (px), bones `BONE * u` px each; `bend` +1 puts the elbow on the
 *  counter-clockwise side of the shoulder->hand line (screen), -1 clockwise. Out-of-reach targets are pulled back to 0.998 of full reach. Returns
 *  the `Arm` (with `exact`, so a three-quarter body does not remap it) and the reach ratio |sh->to| / (2 BONE u) for the arm check. */
export const reachArm = (sh: Pt, to: Pt, u: number, bend: 1 | -1, extra: Partial<Arm> & {fore?: number} = {}): {arm: Arm; ratio: number; hand: Pt} => {
  const B = BONE * u, dx = to[0] - sh[0], dy = to[1] - sh[1], d0 = Math.hypot(dx, dy) || 1e-6, d = Math.min(d0, 2 * B * 0.998), s = d / d0;
  const hx = sh[0] + dx * s, hy = sh[1] + dy * s, half = d / 2, drop = Math.sqrt(Math.max(0, B * B - half * half));
  const nx = -dy / d0, ny = dx / d0; // +90 deg of the shoulder->hand line in screen coords (y down): counter-clockwise on screen is -n
  // `fore` 0..1: the elbow points toward the lens (foreshortened): its picture offset from the chord shrinks to (1 - fore), the bones read shorter
  const k = 1 - Math.max(0, Math.min(1, extra.fore ?? 0));
  const via: Pt = [sh[0] + dx * s / 2 - bend * drop * nx * k, sh[1] + dy * s / 2 - bend * drop * ny * k];
  const {fore, ...rest} = extra; void fore;
  return {arm: {to: [hx, hy], via, exact: true, ...rest}, ratio: d0 / (2 * B), hand: [hx, hy]};
};

/** A painter whose marks stay inside the convex polygon `clip` (picture px): polygons clipped, ink splines cut to their inside runs. Used for the
 *  second pass of a seated figure's forearm over the table top (the figure sorts behind the table, its reaching arm is in front of it). */
export const clipPolyPainter = (p: Painter, clip: Pt[]): Painter => {
  const sgn = Math.sign((clip[1][0] - clip[0][0]) * (clip[2][1] - clip[0][1]) - (clip[1][1] - clip[0][1]) * (clip[2][0] - clip[0][0])) || 1;
  const inside = (q: Pt) => clip.every((a, i) => { const b = clip[(i + 1) % clip.length]; return sgn * ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) >= 0; });
  const raw = p.brush as unknown as Record<string | symbol, unknown>;
  const brush = new Proxy(raw, {get: (t, k) => {
    const v = Reflect.get(t, k, t);
    if (typeof v !== 'function') return v;
    if (k === 'polygon') return (pts: Pt[]) => { const q = clipConvex(pts, clip); if (q.length >= 3) v.call(t, q); };
    if (k === 'spline') return (pts: Pt[], curv?: number) => {
      let run: Pt[] = [];
      const flush = () => { if (run.length >= 2) v.call(t, run, curv); run = []; };
      for (const q of pts) { if (inside(q)) run.push(q); else flush(); }
      flush();
    };
    return v.bind(t);
  }}) as unknown as Painter['brush'];
  return {...p, brush, layer: (a, base) => clipPolyPainter(p.layer(a, base), clip),
    wash: (col, op, pts, bleed, tex) => { const k = clipConvex(pts, clip); if (k.length >= 3) p.wash(col, op, k, bleed, tex); },
    flat: (col, pts) => { const k = clipConvex(pts, clip); if (k.length >= 3) p.flat(col, k); }};
};
/** Convex quad around the segment a -> b, half-width `w` px, extended `ext` px past both ends. */
export const segQuad = (a: Pt, b: Pt, w: number, ext = 0): Pt[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, nx = -uy * w, ny = ux * w;
  const A: Pt = [a[0] - ux * ext, a[1] - uy * ext], B: Pt = [b[0] + ux * ext, b[1] + uy * ext];
  return [[A[0] + nx, A[1] + ny], [B[0] + nx, B[1] + ny], [B[0] - nx, B[1] - ny], [A[0] - nx, A[1] - ny]];
};

/** Shoulder (picture px) of a figure placed at `at` in pose `pose` (its body fields: sit, lean ...) plus `body` overrides. */
export const poseShoulder = (def: CastDef, c: YCam, at: V3, pose: AnyPoseId, view: FigPose['view'], side: 'r' | 'l', body: Partial<FigPose> = {}): Pt => {
  const {g, u} = gu(c, at), pf = poseFor(pose, def, g, u, view === 'back' ? 'front' : view);
  return shoulderPoint(def, g, u, {...pf, ...body, view} as Parameters<typeof shoulderPoint>[3], side);
};

const NOOP_BRUSH = new Proxy({}, {get: () => () => undefined}) as Painter['brush'];
/** Anchors of a placed figure without painting (a no-op brush): head, chin, shoulders, to aim mittens at the face before the real paint. */
export const dryAnchors = (def: CastDef, c: YCam, o: FigOpts) => paintFigureAt(makePainter(NOOP_BRUSH, {t: o.t ?? 0, frame: 0}), c, def, {...o, t: o.t ?? 0});

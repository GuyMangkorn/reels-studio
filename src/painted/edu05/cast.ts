import {drawFigure, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, inkLine, INK, solid, washAt} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {poseFor, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {squareToCam, type View4} from '../kit/views';
import {camPoint, camUnit, viewAngle, type YCam} from '../kit/ycam';
import type {Item} from './world';

// EDU-EP05-SHORT cast (brief EDU-BRIEF-R1.1 VD02). TINY = `woman-bob + new: morning-pyjamas`. Look-frame code (W3.1), episode only:
// Boss hardens the outfit and props into the kit at W8.4 (kit intake). Units: metres in SET-BALCONY, set metres (sm, k 320) in the
// macro sets; the rig is the same 1.58-unit figure in both, so `camUnit` gives px per unit either way.

export const PYJAMA = '#a8c8e8';
export const PIPING = '#f7f7f2';
const bob = PEOPLE['woman-bob'];
/** `new: morning-pyjamas`: pastel blue short-sleeve shirt with white piping (v collar), matching knee shorts, bare feet. */
export const TINY: CastDef = {
  ...bob,
  outfit: {
    shoulder: bob.outfit.shoulder, shirt: PYJAMA, sleeve: PYJAMA, longSleeves: false, pants: '#9cbde0',
    shoes: bob.head.skin, shorts: {sock: bob.head.skin},
    gear: {collar: {kind: 'v', color: PIPING, depth: 0.09}, pockets: true},
  },
};

export type TinyOpts = {
  at: V3; view: View4; pose?: AnyPoseId; face?: ExpressionId; faceState?: Partial<FaceState>; headCock?: number;
  fig?: Partial<FigPose>; t: number;
  /** Colour-mix the figure toward a light (cool shade `#6f8fb0`, warm sun). `mul` (LF04 v3) multiplies every colour by an RGB light
   * filter first, and `u` then mixes toward `to` scaled by (1 - luminance): light colours (skin) keep their hue and only cool and darken
   * a little, dark ones (hair, ink) take the blue. */
  tint?: {to: string; u: number; mul?: [number, number, number]};
  /** Props drawn after the figure from its anchors (`u` px per unit). */
  held?: (p: Painter, a: FigAnchors, u: number) => void;
  /** Soft contact shadow under the feet (default true). */
  shadow?: boolean;
};

/** TINY through the yaw camera: flat card at the ground point, view held square to `cam` (painted 3D camera). */
export const paintTiny = (p: Painter, c: YCam, o: TinyOpts): FigAnchors | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const facing = squareToCam(c, o.at, o.view);
  const a = viewAngle(c, o.at, facing), view: FigPose['view'] = Math.abs(a) <= 45 ? 'front' : Math.abs(a) >= 135 ? 'back' : a > 0 ? 'right' : 'left';
  if (o.shadow !== false) washAt(p, 5101, '#3b3226', 60, ell(g[0], g[1], 0.32 * u, 0.06 * u, 16), 0.15, 0.2);
  const pv = view === 'back' ? 'front' : view;
  const pose = poseFor(o.pose ?? 'P01', TINY, g, u, pv);
  const face = {...EXPRESSIONS[o.face ?? 'neutral'], ...(o.faceState ?? {})} as FaceState;
  // K1 (W5.2): the kit `tintPainter` with `brush: true` takes the rig's solid fills (was the episode-local `tintAll`)
  const q = o.tint ? tintPainter(p, o.tint.to, o.tint.u, {mul: o.tint.mul, brush: true}) : p;
  const anchors = drawFigure(q, TINY, g, u, {...pose, view, face, headCock: o.headCock, ...o.fig}, o.t);
  o.held?.(q, anchors, u);
  return anchors;
};
export const tinyItem = (o: TinyOpts, out?: {a?: FigAnchors | null}): Item => ({at: o.at, draw: (p, c) => { const a = paintTiny(p, c, o); if (out) out.a = a; }});

/**
 * `new: coffee-mug` held in `new: mug-cradle` (LF01 v2, user note 2026-11-06 "the hand holding the mug looks odd"): coral ceramic mug
 * Ø 0.09 x 0.10 m seen a little from above (camera eye above the mug), so the rim ellipse and the coffee inside read; handle loop on
 * side `handle` (screen -1 / +1); a mitten hand from side `from` wraps the lower body: back of the hand past the silhouette edge, the
 * fingers across the front, the thumb lobe over the upper front. `hand` is the figure's hand point (px) = the mitten centre, `u` px per
 * metre. Returns the rim centre (for the steam).
 */
const MUG = '#e8795a';
export const paintMug = (p: Painter, hand: Pt, u: number, o: {handle: 1 | -1; from: 1 | -1; skin: string}): Pt => {
  const w = 0.09 * u, h = 0.10 * u, ry = w * 0.2, cx = hand[0] - o.from * 0.24 * w, cy = hand[1] - 0.14 * h;
  const top = cy - h / 2, bot = cy + h / 2, L = cx - w / 2, R = cx + w / 2, taper = w * 0.04;
  const arc = (x0: number, y0: number, rx: number, ryy: number, a0: number, a1: number, n = 10): Pt[] =>
    Array.from({length: n + 1}, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [x0 + rx * Math.cos(a), y0 + ryy * Math.sin(a)] as Pt; });
  // handle: a C loop (outer arc out, inner arc back), drawn first so the body overlaps its roots
  const hx = o.handle > 0 ? R - w * 0.04 : L + w * 0.04, hy = cy + h * 0.02, hr = h * 0.3, th = w * 0.11;
  const a0 = o.handle > 0 ? -Math.PI / 2 : Math.PI / 2, a1 = o.handle > 0 ? Math.PI / 2 : (3 * Math.PI) / 2;
  const loop: Pt[] = [...arc(hx, hy, hr * 0.85, hr, a0, a1), ...arc(hx, hy, hr * 0.85 - th, hr - th, a1, a0)];
  solid(p, 6105, mixColor(MUG, '#7a2e1e', 0.15), loop, 3);
  inkLine(p, 6106, loop, {weight: 0.8, color: mixColor(MUG, INK, 0.6)});
  // body: straight sides tapering a touch to a rounded base
  const body: Pt[] = [[L, top], [R, top], [R - taper, bot - ry * 0.6], ...arc(cx, bot - ry * 0.6, w / 2 - taper, ry * 0.8, 0, Math.PI, 8).slice(1, -1), [L + taper, bot - ry * 0.6]];
  solid(p, 6101, MUG, body, 3);
  // shade side away from the low sun (front right): the left third
  solid(p, 6102, mixColor(MUG, '#7a2e1e', 0.3), [[L, top], [L + w * 0.3, top], [L + w * 0.3 - taper * 0.5, bot - ry * 0.3], [L + taper, bot - ry * 0.6]], 2);
  inkLine(p, 6104, body, {weight: 0.8, color: mixColor(MUG, INK, 0.6)});
  // rim lip (pale glaze) and the coffee inside
  solid(p, 6103, mixColor(MUG, '#ffffff', 0.35), ell(cx, top, w / 2, ry, 18), 2);
  solid(p, 6107, '#4a2c1e', ell(cx, top + ry * 0.12, w / 2 - w * 0.07, ry - w * 0.06, 16), 2);
  inkLine(p, 6108, ell(cx, top, w / 2, ry, 18), {weight: 0.7, color: mixColor(MUG, INK, 0.55)});
  // mitten wrapped round the lower body: back of the hand outside the near edge, the finger band across the front, thumb over the top
  const sk = o.skin, skInk = mixColor(sk, '#7a4a30', 0.55), f = o.from;
  // v3 (user note 2026-11-06 "the palm round the mug looks a little small"): mitten ~26% wider, ~20% taller, the fingers wrap to near
  // the far edge (kit hand ~0.09 x 0.10 m; this one 0.097 x 0.072 m seen across the mug)
  const edge = f < 0 ? L : R, mx = edge - f * w * 0.36, my = cy + h * 0.12;
  const mitt: Pt[] = Array.from({length: 22}, (_, i) => {
    const a = (i / 22) * 2 * Math.PI, c = Math.cos(a), s2 = Math.sin(a), ex = 0.55; // superellipse: a rounded box, fingertips square-ish
    return [mx + Math.sign(c) * Math.abs(c) ** ex * w * 0.54, my + Math.sign(s2) * Math.abs(s2) ** ex * h * 0.36] as Pt;
  });
  solid(p, 6110, sk, mitt, 3);
  inkLine(p, 6111, mitt, {weight: 0.9, color: skInk, curve: 0.3});
  // finger grooves: two short strokes back from the fingertip edge
  const tipX = mx - f * w * 0.54;
  [-0.11, 0.11].forEach((d, k) => inkLine(p, 6112 + k, [[tipX, my + d * h], [tipX + f * w * 0.26, my + d * h]], {weight: 1.0, color: skInk, closed: false}));
  // thumb lobe over the upper front, pointing across the mug
  const thumb = ell(mx - f * w * 0.16, my - h * 0.36, w * 0.24, h * 0.11, 14, f * 0.25);
  solid(p, 6114, mixColor(sk, '#ffffff', 0.08), thumb, 3);
  inkLine(p, 6115, thumb, {weight: 0.9, color: skInk, curve: 0.3});
  return [cx, top];
};

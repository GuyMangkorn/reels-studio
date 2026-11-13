import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {shoulderPoint, type Arm, type CastDef, type FigAnchors} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import type {FaceState} from '../kit/head';
import type {FigPose} from '../kit/cast';
import type {Painter, Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {dress} from '../kit/wardrobe';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';

// EDU-EP15-SHORT cast (brief VD02, VD03; look-frame poses, Film W3; Boss hardens N6 at W5.2).
// WOMAN = `woman-curly + home-lounge, new: sit-phone, neutral`: P31 body with both hands raised to the chest holding the phone (elbows back at the waist).
// MAN = `man-spiky, new: hang-held-wrists, scared`: front view, arms straight up from P45's raise with the elbows outside the 4-head head and the wrists
// together above it, where the tokay's hind feet hold them (rig H). The figure is lifted so the wrists meet the anchor: with the kit's arm (2 x 0.26 m)
// and head the feet hang about 0.75 m above the floor (the brief's 0.46 m assumed adult proportions; W3 finding).

export const WOMAN: CastDef = dress(PEOPLE['woman-curly'], 'home-lounge');
export const MAN: CastDef = PEOPLE['man-spiky'];

const at2 = (sh: Pt, u: number, [x, y]: Pt): Pt => [sh[0] + x * u, sh[1] - y * u];
const arm = (def: CastDef, g: Pt, u: number, body: {sit?: number; lift?: number}, side: 'r' | 'l', via: Pt, to: Pt): Arm => {
  const sh = shoulderPoint(def, g, u, {view: 'front', ...body}, side);
  return {via: at2(sh, u, via), to: at2(sh, u, to)};
};

export type WomanOpts = {at: V3; face?: ExpressionId; faceState?: Partial<FaceState>; t: number; /** Phone glow on the face 0..1. */ glow?: number; headCock?: number; tint?: number};
/** WOMAN seated on the sofa scrolling her phone (`new: sit-phone`): hands meet at the chest, phone back to the lens, cool glow on the face. */
export const paintWomanPhone = (p: Painter, c: YCam, o: WomanOpts): FigAnchors | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const rArm = arm(WOMAN, g, u, {sit: 1}, 'r', [-0.045, -0.235], [0.135, -0.19]);
  const lArm = arm(WOMAN, g, u, {sit: 1}, 'l', [0.045, -0.235], [-0.135, -0.19]);
  const a = paintFigureAt(p, c, WOMAN, {...VIEW_CUES_OFF, at: o.at, view: 'front', pose: 'P31', face: o.face ?? 'neutral', faceState: o.faceState, fig: {rArm, lArm, headCock: o.headCock}, t: o.t, shadow: {op: 70}, tint: o.tint ? {to: '#ffcf8a', u: o.tint} : undefined});
  if (!a) return null;
  // phone between the hands (we see its dark back), a thin pale edge
  const m: Pt = [(a.rHand[0] + a.lHand[0]) / 2, (a.rHand[1] + a.lHand[1]) / 2 - 0.035 * u];
  const ph = [[m[0] - 0.036 * u, m[1] - 0.075 * u], [m[0] + 0.036 * u, m[1] - 0.072 * u], [m[0] + 0.034 * u, m[1] + 0.06 * u], [m[0] - 0.038 * u, m[1] + 0.058 * u]] as Pt[];
  hardFill(p, 76100, '#1f2326', ph);
  inkLine(p, 76101, ph, {weight: 0.5, color: '#5d646a', still: true});
  // hands over the phone edges (mittens)
  for (const [h, id] of [[a.rHand, 76102], [a.lHand, 76103]] as const) hardFill(p, id, '#7f5236', ell(h[0], h[1] - 0.02 * u, 0.03 * u, 0.034 * u, 12));
  // phone glow on the face (cool, 20 % per the brief) and a faint spill on the chest
  const k = o.glow ?? 1;
  if (k > 0) {
    washAt(p, 76110, C.phone, 70 * k, ell(a.head[0], a.head[1] + 0.03 * u, 0.1 * u, 0.085 * u, 18), 0.4, 0.3);
    washAt(p, 76111, C.phone, 40 * k, ell(m[0], m[1] - 0.06 * u, 0.09 * u, 0.06 * u, 16), 0.4, 0.3);
  }
  return a;
};

export type ManHangOpts = {wrists: V3; /** Metres the whole figure (hands included) hangs lower than the wrist anchor: W5-F3 shot 2 grips the hind legs / pelvis. Default 0. */ handDrop?: number; legKick?: FigPose['legKick']; face?: ExpressionId; faceState?: Partial<FaceState>; t: number; tint?: {to: string; u: number}};
// W3: wrists held together (brief #hang-rig-h) without crossed forearms: hands 0.06 m apart, each on its own side.
export const HANG_ARM = {via: [-0.01, 0.29] as Pt, to: [0.115, 0.58] as Pt};
/** Where the feet hang for a wrist anchor (metres): the figure's ground point. */
export const manHangFeet = (wrists: V3): V3 => {
  // shoulder height of the kit rig at unit 1 px/m (front, standing), measured from a dummy ground point
  const sh = shoulderPoint(MAN, [0, 0], 1, {view: 'front'}, 'r');
  const shoulderM = -sh[1];
  return [wrists[0], wrists[1] - HANG_ARM.to[1] - shoulderM, wrists[2]];
};
/** MAN hanging by the wrists (`new: hang-held-wrists`), front view squared to the lens, no ground shadow. */
export const paintManHang = (p: Painter, c: YCam, o: ManHangOpts): (FigAnchors & {feetM: V3}) | null => {
  const wrists: V3 = [o.wrists[0], o.wrists[1] - (o.handDrop ?? 0), o.wrists[2]];   // handDrop lowers the whole figure (arms keep their reach) so the fists land lower on the tokay
  const feet = manHangFeet(wrists);
  // Close up-tilted cameras (LF05B, TK7) put his true feet behind the lens: hang the figure in the picture plane through the wrists instead
  // (billboard anchor = wrists minus the camera's up vector times the wrist-to-feet drop), so hands, arms and head stay on the wrist depth.
  const ss = Math.sin(c.yaw), co = Math.cos(c.yaw), sn = Math.sin(c.pitch ?? 0), cs = Math.cos(c.pitch ?? 0), drop = wrists[1] - feet[1];
  const at: V3 = camPoint(c, feet) ? feet : [wrists[0] + sn * ss * drop, wrists[1] - cs * drop, wrists[2] - sn * co * drop];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  const rArm = arm(MAN, g, u, {}, 'r', HANG_ARM.via, HANG_ARM.to);
  const lArm = arm(MAN, g, u, {}, 'l', [-HANG_ARM.via[0], HANG_ARM.via[1]], [-HANG_ARM.to[0], HANG_ARM.to[1]]);
  const a = paintFigureAt(p, c, MAN, {...VIEW_CUES_OFF, at, view: 'front', pose: 'P45', face: o.face ?? 'scared', faceState: o.faceState, fig: {rArm, lArm, legKick: o.legKick}, t: o.t, shadow: false, tint: o.tint});
  if (!a) return null;
  // closed hands at the wrists (fists round the tokay's grip)
  for (const [h, id] of [[a.rHand, 76200], [a.lHand, 76201]] as const) { hardFill(p, id, MAN.head.skin, ell(h[0], h[1] - 0.022 * u, 0.03 * u, 0.036 * u, 12)); inkLine(p, id + 10, [[h[0] - 0.022 * u, h[1] - 0.04 * u], [h[0], h[1] - 0.05 * u], [h[0] + 0.022 * u, h[1] - 0.04 * u]], {closed: false, weight: 1.2, color: '#5a3a2a', still: true, curve: 0.5}); }
  void capsule;
  return {...a, feetM: feet};
};

export type WomanBackOpts = {at: V3; t: number; /** Head cock in degrees toward screen right (shot 10 tilt, 0 -> +12). */ headCock?: number; tint?: number};
/** WOMAN seen from behind on the sofa (`new: sit-phone`, P31 back, phone lowered to her lap, head up): the back of her head and shoulders. */
export const paintWomanBack = (p: Painter, c: YCam, o: WomanBackOpts): FigAnchors | null =>
  paintFigureAt(p, c, WOMAN, {...VIEW_CUES_OFF, at: o.at, view: 'back', pose: 'P31', face: 'neutral', fig: {headCock: o.headCock ?? 0}, t: o.t, shadow: {op: 60}, tint: o.tint ? {to: '#ffcf8a', u: o.tint} : undefined});

export type WomanProfileOpts = {at: V3; t: number; /** Lean 0..1 (0 = sitting back, 1 = P32 leaning in with the head raised). */ lean: number; face?: ExpressionId; faceState?: Partial<FaceState>; tint?: number};
/** WOMAN seated in profile facing screen left, leaning in (`new: sit-lean-in`, B04-SH01): P32's body with the bend eased in and the head kept raised (nod 0). */
export const paintWomanProfile = (p: Painter, c: YCam, o: WomanProfileOpts): FigAnchors | null =>
  paintFigureAt(p, c, WOMAN, {...VIEW_CUES_OFF, at: o.at, view: 'left', pose: 'P32', face: o.face ?? 'suspicious', faceState: o.faceState, fig: {bend: 0.4 * o.lean, nod: [0, 0]}, t: o.t, shadow: {op: 70}, tint: o.tint ? {to: '#ffcf8a', u: o.tint} : undefined});

export type WomanLapOpts = {at: V3; t: number; face?: ExpressionId; faceState?: Partial<FaceState>; tint?: number};
/** WOMAN seated facing the lens (`new: sit-lap-phone`, B05-SH04): P31 with the hands on the thighs, the phone dark on her lap, the face upturned. */
export const paintWomanLap = (p: Painter, c: YCam, o: WomanLapOpts): FigAnchors | null => {
  const a = paintFigureAt(p, c, WOMAN, {...VIEW_CUES_OFF, at: o.at, view: 'front', pose: 'P31', face: o.face ?? 'neutral', faceState: o.faceState, t: o.t, shadow: {op: 70}, tint: o.tint ? {to: '#ffcf8a', u: o.tint} : undefined});
  if (!a) return null;
  const u = camUnit(c, o.at), h = a.lHand;
  const ph = [[h[0] - 0.05 * u, h[1] - 0.012 * u], [h[0] + 0.0 * u, h[1] - 0.02 * u], [h[0] + 0.0 * u, h[1] + 0.085 * u], [h[0] - 0.055 * u, h[1] + 0.09 * u]] as Pt[];
  hardFill(p, 76150, '#1f2326', ph);
  inkLine(p, 76151, ph, {weight: 0.5, color: '#5d646a', still: true});
  hardFill(p, 76152, '#7f5236', ell(h[0], h[1], 0.028 * u, 0.03 * u, 12));
  return a;
};

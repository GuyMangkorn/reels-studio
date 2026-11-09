// EDU-EP12-SHORT look frames (brief EDU-EP12-BRIEF-R1.2, rows EDU-EP12-ROWS-R1.2, workflow W3). LOOK-FRAME CODE: pure paint functions.
// LF01 SET-HOME night (S01-B01-SH01 end: stepped aside, two lines, bed through the doorway), LF02 SET-HOME morning (S01-B03-SH01 end),
// LF03 Earth spine + sponge card (S01-B02-SH02 over the held B02-SH01 plate), LF04 bedroom by moonlight with the plumping spine
// (S01-B03-SH03 mid), LF05 SET-CABIN with the space spine (S01-B04-SH02 at 60 % (column at 30 % straightened)). Cameras are the brief's shot-plan lines with the lens and
// horizon set here (W3 R1.2); the W5.1 sheets take them over.
import {bodyFrame, type CastDef, type FigAnchors} from '../kit/cast';
import {camMove, camOf} from '../kit/cam-moves';
import {ell, hardFill, inkLine} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCabin} from './cabin';
import {BED, MATTRESS_Y, paintBedroomSet, paintHome, paintQuilt, wordAt} from './home';
import {AST, BOY_PJ, BOY_UNIFORM, C} from './palette';
import {paintSpineEarth, paintSpineSpace} from './spine';
import {paintSpongeCard} from './sponge';

export const LF_FRAMES = {LF01: 1, LF02: 1, LF03: 1, LF04: 1, LF05: 1} as const;
export type Measure = {lead?: {top: number; bottom: number; left?: number; right?: number}; word?: ReturnType<typeof wordAt>; gapPx?: number; cam?: YCam; spine?: {top: Pt; bottom: Pt}; extra?: Record<string, number>};
export const MEASURE: Record<string, Measure> = {};

/** The pencil (0.17 m, yellow body, pink eraser, graphite tip) held in a mitten at `hand`, pointing along `ang` (radians, picture). */
const paintPencil = (p: Painter, hand: Pt, u: number, ang: number, seed: number) => {
  const L = 0.17 * u, w = Math.max(3, 0.008 * u), dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy * w / 2, ny = dx * w / 2;
  const a: Pt = [hand[0] - dx * L * 0.35, hand[1] - dy * L * 0.35], b: Pt = [hand[0] + dx * L * 0.55, hand[1] + dy * L * 0.55], tip: Pt = [b[0] + dx * L * 0.1, b[1] + dy * L * 0.1];
  hardFill(p, seed, '#f2c230', [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]);
  hardFill(p, seed + 1, '#e9c9a0', [[b[0] + nx, b[1] + ny], tip, [b[0] - nx, b[1] - ny]]);
  hardFill(p, seed + 2, C.pencil, [[b[0] + dx * L * 0.06 + nx * 0.4, b[1] + dy * L * 0.06 + ny * 0.4], tip, [b[0] + dx * L * 0.06 - nx * 0.4, b[1] + dy * L * 0.06 - ny * 0.4]]);
  const e: Pt = [a[0] - dx * L * 0.08, a[1] - dy * L * 0.08];
  hardFill(p, seed + 3, '#e88a96', [[a[0] + nx, a[1] + ny], [e[0] + nx, e[1] + ny], [e[0] - nx, e[1] - ny], [a[0] - nx, a[1] - ny]]);
  inkLine(p, seed + 4, [[e[0] + nx, e[1] + ny], [b[0] + nx, b[1] + ny], tip, [b[0] - nx, b[1] - ny], [e[0] - nx, e[1] - ny]], {weight: 0.9, still: true});
};

/** Morning bed hair: a few tufts sticking up and out of the bowl cut (ink + hair colour), from the head anchors. */
const messyHair = (p: Painter, a: FigAnchors, u: number, hair: string, facing: number) => {
  const top: Pt = [a.head[0], a.headTop], s = 0.045 * u;
  const tufts: [number, number, number][] = [[-0.5, -0.1, 0.55], [-0.1, -0.15, 0.7], [0.35, -0.05, 0.45]];
  tufts.forEach(([ox, oy, l], i) => {
    const b: Pt = [top[0] + ox * s * 2 * facing, top[1] + s * (0.6 + oy)], tip: Pt = [b[0] + (ox - 0.2) * s * l * facing, b[1] - s * 1.3 * l];
    hardFill(p, 4300 + i, hair, [[b[0] - s * 0.35, b[1]], tip, [b[0] + s * 0.35, b[1]]]);
    inkLine(p, 4310 + i, [[b[0] - s * 0.35, b[1]], tip, [b[0] + s * 0.35, b[1]]], {weight: 0.9, closed: false, still: true});
  });
};

/** Spine end points of a figure (standing, floating or lying): the neck base 0.55 head below the head centre and the pelvis top (hips +
 * 0.05 m), both on the head-feet line and shifted toward the back by `off` m. */
const spineEnds = (def: CastDef, a: FigAnchors, u: number, back: Pt, view: 'left' | 'right', crouch = 0, off = 0.06): {top: Pt; bottom: Pt} => {
  const f = bodyFrame(def, {view, crouch}), headH = 0.425 * (def.headScale ?? 1);
  const d: Pt = [a.feet[0] - a.head[0], a.feet[1] - a.head[1]], L = Math.hypot(d[0], d[1]) || 1, n: Pt = [d[0] / L, d[1] / L];
  const neck = 0.55 * headH * u, hipFromFeet = (f.hipV + 0.05) / (def.height - crouch * 0.5 - headH / 2);
  const o: Pt = [back[0] * off * u, back[1] * off * u];
  return {
    top: [a.head[0] + n[0] * neck + o[0], a.head[1] + n[1] * neck + o[1]],
    bottom: [a.feet[0] - d[0] * hipFromFeet + o[0] * 1.1, a.feet[1] - d[1] * hipFromFeet + o[1] * 1.1],
  };
};

// ---- LF01: S01-B01-SH01 end (u 1). brief `target T-TRIM, yaw +30 -> +22, r 2.4 -> 2.1, eye 1.0, pitch -4`; lens f 1100, horizon 640 (W3).
export const camB01SH01 = camMove([0, 1.1, 0.02], [30, 22], [2.4, 2.1], 1.0, {pitch: [-4, -4], f: 1100, hy: 860});
export const BOY_ASIDE: V3 = [0.45, 0, 0.14];
const paintHallShot = (p: Painter, c: YCam, key: 'LF01' | 'LF02') => {
  const night = key === 'LF01';
  paintHome(p, c, {light: night ? 'night' : 'morning', marks: {night: true, morningDark: !night}});
  const def = night ? BOY_UNIFORM : BOY_PJ;
  const a = paintFigureAt(p, c, def, {at: BOY_ASIDE, view: 'left', pose: 'P01', face: night ? 'suspicious' : 'surprised', faceState: {look: [-0.9, -0.25]}, t: 0.4, shadow: {op: night ? 70 : 55}});
  if (!a) return;
  const u = camUnit(c, BOY_ASIDE);
  paintPencil(p, a.rHand, u, Math.PI * 1.15, 4200);
  if (!night) messyHair(p, a, u, def.head.hair, -1);
  MEASURE[key] = {lead: {top: a.top, bottom: a.bottom}, word: wordAt(c), cam: c, extra: {handY: Math.round(a.rHand[1]), headY: Math.round(a.head[1])},
    gapPx: (() => { const m = camPoint(c, [0, 1.3, 0.021]), n = camPoint(c, [0, 1.285, 0.021]); return m && n ? n[1] - m[1] : 0; })()};
};
export const camLF01 = camOf(camB01SH01, 1);
export const paintLF01 = (p: Painter) => paintHallShot(p, camLF01, 'LF01');

// ---- LF02: S01-B03-SH01 end. brief `as B01-SH01, morning light, yaw +26 -> +20`.
export const camB03SH01 = camMove([0, 1.1, 0.02], [26, 20], [2.4, 2.1], 1.0, {pitch: [-4, -4], f: 1100, hy: 860});
export const camLF02 = camOf(camB03SH01, 1);
export const paintLF02 = (p: Painter) => paintHallShot(p, camLF02, 'LF02');

// ---- LF03: S01-B02-SH02 = the held B02-SH01 plate at its end (pads thin, the boy side-on facing the trim), dimmed to 70 %, the sponge card
// at the third book. brief B02-SH01 `target T-BACK, yaw +80 -> +70, r 1.5 -> 1.3, eye 1.0`; lens f 1100, horizon 730, picture shift +110 px so the boy stands left of the card zone (W3).
export const camB02SH01 = camMove([-0.15, 0.95, 0.05], [80, 70], [1.5, 1.3], 1.0, {f: 1100, hy: 730, cx: 110});
export const BOY_SIDE: V3 = [-0.15, 0, 0.4];
export const camLF03 = camOf(camB02SH01, 1);
export const paintB02Plate = (p: Painter, c: YCam, s: {pad: number; drops?: number; glow?: number}) => {
  paintHome(p, c, {light: 'night', marks: {night: true}});
  const a = paintFigureAt(p, c, BOY_UNIFORM, {at: BOY_SIDE, view: 'right', pose: 'P01', face: 'worried', t: 0.2, shadow: {op: 70}});
  if (!a) return null;
  const u = camUnit(c, BOY_SIDE), ends = spineEnds(BOY_UNIFORM, a, u, [-1, 0], 'right');
  paintSpineEarth(p, 4400, ends.bottom, ends.top, [-1, 0], {pad: s.pad, drops: s.drops, glow: s.glow, u});
  return {a, ends};
};
export const paintLF03 = (p: Painter) => {
  const out = paintB02Plate(p, camLF03, {pad: 0.15});
  hardFill(p.layer(0.3, 4500), 4500, '#0e0b08', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  paintSpongeCard(p, {books: 3});
  if (out) MEASURE.LF03 = {lead: {top: out.a.top, bottom: out.a.bottom}, spine: out.ends, cam: camLF03, extra: {headTop: Math.round(out.a.headTop), chin: Math.round(out.a.chin)}};
};

// ---- LF04: S01-B03-SH03 mid (u 0.5). brief `target T-BED, camera on the bed's open side (yaw ~ +90), r 2.0 -> 1.8, eye 1.0, truck +x 0.15`;
// lens f 1100, horizon 575 (W3: the lying body centre near y 900 for the VD09 match cut).
export const camB03SH03 = camMove([[-2.08, 0.55, -2.4], [-2.08, 0.55, -2.25]], [90, 90], [2.0, 1.8], 1.0, {f: 1100, hy: 575});
export const camLF04 = camOf(camB03SH03, 0.5);
/** Feet end of the lying boy (P36 on the mattress, head on the pillow toward -z = screen right). */
export const BOY_BED: V3 = [-2.08, MATTRESS_Y - 0.04, -2.08];
export const paintLF04 = (p: Painter) => {
  const c = camLF04;
  paintBedroomSet(p, c, 'moon');
  const a = paintFigureAt(p, c, BOY_PJ, {at: BOY_BED, view: 'left', pose: 'P36', face: 'asleep', t: 0.3, shadow: false});
  // quilt to the chest (z of the chest line ~ the pillow + 0.42 m)
  paintQuilt(p, c, 'moon', -2.74, 0.2);
  if (a) {
    const u = camUnit(c, BOY_BED), ends = spineEnds(BOY_PJ, a, u, [0, 1], 'left');
    paintSpineEarth(p, 4600, ends.bottom, ends.top, [0, 1], {pad: 0.65, drops: -0.5, u});
    MEASURE.LF04 = {lead: {top: a.top, bottom: a.bottom, left: Math.min(a.feet[0], a.head[0]), right: Math.max(a.feet[0], a.head[0])}, spine: ends, cam: c};
  }
  void BED; void ell; void mixColor;
};

// ---- LF05: S01-B04-SH02 at u 0.6. brief `target T-SPINE, yaw -8 -> 0, r 1.6 -> 1.4, eye 1.15`; lens f 900, horizon 760 (W3).
export const camB04SH02 = camMove([-0.3, 1.05, -0.25], [-8, 0], [1.6, 1.4], 1.15, {f: 900, hy: 760});
export const camLF05 = camOf(camB04SH02, 0.6);
/** AST "ground point" for the floating card (hips at (-0.30, 0.95, -0.25), P46 crouch); drift +0.02 m/s in +y over the shot. */
export const AST_AT: V3 = [-0.3, 0.27, -0.25];
export const paintLF05 = (p: Painter) => {
  const c = camLF05;
  paintCabin(p, c, {marks: 1});
  const at: V3 = [AST_AT[0], AST_AT[1] + 0.02 * 3.6 * 0.6, AST_AT[2]];
  const a = paintFigureAt(p, c, AST, {at, view: 'left', pose: 'P46', face: 'neutral', faceState: {look: [0.2, -0.1]}, t: 0.6, shadow: false});
  if (!a) return;
  const u = camUnit(c, at), ends = spineEnds(AST, a, u, [1, 0], 'left', 0.22, 0.035);
  const axis: Pt = [ends.top[0] - ends.bottom[0], ends.top[1] - ends.bottom[1]], arc = Math.hypot(axis[0], axis[1]) * 1.02;
  const top = paintSpineSpace(p, 4700, ends.bottom, axis, [1, 0], arc, {straight: 0.3, u});
  MEASURE.LF05 = {lead: {top: a.top, bottom: a.bottom}, spine: {top, bottom: ends.bottom}, cam: c, extra: {headY: Math.round(a.head[1]), headX: Math.round(a.head[0])}};
};

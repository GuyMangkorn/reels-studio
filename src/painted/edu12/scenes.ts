// EDU-EP12-SHORT look frames (brief EDU-EP12-BRIEF-R1.2, rows EDU-EP12-ROWS-R1.2, workflow W3). LOOK-FRAME CODE: pure paint functions.
// LF01 SET-HOME night (S01-B01-SH01 end: stepped aside, two lines, bed through the doorway), LF02 SET-HOME morning (S01-B03-SH01 end),
// LF03 Earth spine + sponge card (S01-B02-SH02 over the held B02-SH01 plate), LF04 bedroom by moonlight with the plumping spine
// (S01-B03-SH03 mid), LF05 SET-CABIN with the space spine (S01-B04-SH02 at 60 % (column at 30 % straightened)). Cameras are the brief's shot-plan lines with the lens and
// horizon set here (W3 R1.2); the W5.1 sheets take them over.
import {bodyFrame, shoulderPoint, type CastDef, type FigAnchors} from '../kit/cast';
import {camMove, camOf} from '../kit/cam-moves';
import {capsule, ell, hardFill, inkLine} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCabin} from './cabin';
import {BED, MATTRESS_Y, paintBedroomSet, paintHome, paintQuilt, wordAt} from './home';
import {AST, BOY_PJ, BOY_UNIFORM, C} from './palette';
import {paintSpaceSpineCard, paintSpineEarth} from './spine';
import {paintSpongeCard} from './sponge';

export const LF_FRAMES = {LF01: 1, LF02: 1, LF03: 1, LF04: 1, LF04S: 1, LF05: 1} as const;
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
// R1.4 (viewer check UT03/UT02): the camera comes down to eye 0.75 (the bed side fills the lower frame instead of the floor) and the shot
// becomes a push-in toward the neck for the diagram half: start r 1.5 on the whole boy, end r 0.85 on the chest. LF04 is the END (diagram half).
export const camB03SH03 = camMove([[-2.08, 0.5, -2.45], [-2.08, 0.5, -2.85]], [90, 90], [1.5, 0.85], [1.05, 0.95], {pitch: [-4, -20], f: 1100, hy: 640, ease: [0.35, 0.8]});
export const camLF04 = camOf(camB03SH03, 1);
export const camLF04S = camOf(camB03SH03, 0);
/** Feet end of the lying boy (P36 on the mattress, head on the pillow toward -z = screen right). */
export const BOY_BED: V3 = [-2.08, MATTRESS_Y - 0.04, -2.08];
const paintB03SH03 = (p: Painter, c: YCam, key: string) => {
  paintBedroomSet(p, c, 'moon');
  const a = paintFigureAt(p, c, BOY_PJ, {at: BOY_BED, view: 'left', pose: 'P36', face: 'asleep', t: 0.3, shadow: false});
  // quilt to the chest (z of the chest line ~ the pillow + 0.42 m)
  paintQuilt(p, c, 'moon', -2.74, 0.2);
  if (a) {
    const u = camUnit(c, BOY_BED), ends = spineEnds(BOY_PJ, a, u, [0, 1], 'left');
    paintSpineEarth(p, 4600, ends.bottom, ends.top, [0, 1], {pad: 0.65, drops: -0.5, u});
    MEASURE[key] = {lead: {top: a.top, bottom: a.bottom, left: Math.min(a.feet[0], a.head[0]), right: Math.max(a.feet[0], a.head[0])}, spine: ends, cam: c};
  }
  void BED; void mixColor;
};
export const paintLF04 = (p: Painter) => paintB03SH03(p, camLF04, 'LF04');
/** B03-SH03 start framing (reference still for the brief's camera note; not a look frame). */
export const paintLF04S = (p: Painter) => paintB03SH03(p, camLF04S, 'LF04S');

// ---- LF05: S01-B04-SH02 at u 0.6. brief `target T-SPINE, yaw -8 -> 0, r 1.6 -> 1.4, eye 1.15`; lens f 900, horizon 760 (W3).
// R1.4 (viewer check): free float, read without narration: card lifted off the deck (no contact, no shadow), rolled back, squat legs in a
// loose drift, a floating pen beside her.
// R1.5 (viewer check round 2): the picture shifts 70 px left (cx -70) so the inset spine card fits at the right; arms re-authored from the
// shoulder as P46 (P46 angles: upper arm 16 deg forward of hanging, forearm 58 deg; the near arm repainted over the fitted top (`nearArm`) so the sleeve
// sits on the shoulder in front of the bust; lighter sleeve), pen moved below the window; a fitted top (bust, waist taper,
// seat) and a floating ponytail painted over the rig (UT08); the space spine moves off her back into an inset card with a heavy bracket and
// a leader to her back (H-C: the S-ribbon read as a scarf).
export const camB04SH02 = camMove([-0.3, 1.05, -0.25], [-8, 0], [1.6, 1.4], 1.15, {f: 900, hy: 760, cx: -70});
export const camLF05 = camOf(camB04SH02, 0.6);
/** AST card point for the free float (hips about (-0.30, 0.95, -0.25)); the feet end 0.2+ m above the deck. Drift +0.02 m/s in +y over the shot. */
export const AST_AT: V3 = [-0.3, 0.62, -0.25];
const AST_BODY = {view: 'left', crouch: 0.22, squat: 0.42} as const;
const AST_DRIFT = {squat: 0.42, noShadow: true} as const;
/** `new: pen-float` (brief SET-CABIN, optional prop): a navy pen turning slowly in mid-air, no contact, no shadow. */
const paintFloatPen = (p: Painter, c: YCam, at: V3, ang: number) => {
  const g = camPoint(c, at);
  if (!g) return;
  const u = camUnit(c, at), L = 0.14 * u, w = Math.max(3, 0.011 * u), d: Pt = [Math.cos(ang), Math.sin(ang)], n: Pt = [-d[1] * w / 2, d[0] * w / 2];
  const a: Pt = [g[0] - d[0] * L / 2, g[1] - d[1] * L / 2], b: Pt = [g[0] + d[0] * L / 2, g[1] + d[1] * L / 2], tip: Pt = [b[0] + d[0] * w, b[1] + d[1] * w];
  const body: Pt[] = [[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], tip, [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]];
  hardFill(p, 4750, '#24365e', body);
  const clip: Pt[] = [[a[0] + d[0] * L * 0.08 + n[0] * 1.4, a[1] + d[1] * L * 0.08 + n[1] * 1.4], [a[0] + d[0] * L * 0.38 + n[0] * 1.4, a[1] + d[1] * L * 0.38 + n[1] * 1.4]];
  inkLine(p, 4751, clip, {color: '#c9ccd4', weight: 1.4, closed: false, still: true});
  inkLine(p, 4752, body, {weight: 0.9, still: true});
};
/** Small gold ear stud (`woman-pixie` read, viewer check A-M): on the visible ear of a left profile, from the head anchor. */
const earStud = (p: Painter, a: FigAnchors, u: number) => {
  const e: Pt = [a.head[0] + 0.035 * u, a.head[1] + 0.085 * u];
  hardFill(p, 4760, '#e2b84a', ell(e[0], e[1], 0.014 * u, 0.014 * u, 12));
  inkLine(p, 4761, ell(e[0], e[1], 0.014 * u, 0.014 * u, 12), {weight: 0.7, still: true});
};
/** Chaikin smoothing of an open run of points (the ends stay), for the hand-placed body curves. */
const smooth = (pts: Pt[], n = 2): Pt[] => {
  let q = pts;
  for (let r = 0; r < n; r++) {
    const o: Pt[] = [q[0]];
    for (let i = 0; i < q.length - 1; i++) { const a = q[i], b = q[i + 1]; o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); }
    o.push(q[q.length - 1]); q = o;
  }
  return q;
};
/** `new: station-wear-fitted` (R1.5, UT08), left profile, painted in the rig's unrolled frame (`held`): bust curve on the chest front,
 * the front panel seam tapering to the belt, the seat curve behind the hip. Local metres u (toward the face) / v (up), as drawFigure's `U`. */
const fittedTop = (p: Painter, def: CastDef, g: Pt, u: number) => {
  const f = bodyFrame(def, AST_BODY), shV = f.shV, hip0 = f.hip0;
  const U = ([uu, v]: Pt): Pt => [g[0] - (f.hipU + uu) * u, g[1] - (f.hipV + (v - hip0) * f.tScale + f.lift) * u];
  const shirt = def.outfit.shirt, ink = '#2b211c';
  const bust: Pt[] = [[0.03, shV - 0.03], [0.07, shV - 0.05], [0.098, shV - 0.08], [0.118, shV - 0.11], [0.13, shV - 0.14], [0.127, shV - 0.17], [0.11, shV - 0.195], [0.085, shV - 0.212], [0.066, shV - 0.228], [0.03, shV - 0.228]];
  const bustC = smooth(bust.slice(0, 9).map(U));
  hardFill(p, 4770, shirt, [...bustC, U(bust[9])]);
  inkLine(p, 4771, bustC.slice(2, -2), {color: ink, weight: 1.0, closed: false, curve: 0.4, still: true});
  // under-bust shade and the front panel seam down to the belt (fitted cut)
  inkLine(p, 4772, ([[0.112, shV - 0.18], [0.08, shV - 0.21], [0.04, shV - 0.215]] as Pt[]).map(U), {color: mixColor(shirt, '#0b1324', 0.55), weight: 1.1, closed: false, curve: 0.4, still: true});
  inkLine(p, 4773, ([[0.0, shV - 0.06], [0.03, shV - 0.2], [0.012, hip0 + 0.12], [0.03, hip0 + 0.02]] as Pt[]).map(U), {color: mixColor(shirt, '#0b1324', 0.45), weight: 0.9, closed: false, curve: 0.5, still: true});
  // upper back: the shoulder-blade curve behind the kit's straight back, so the back line runs in to the waist
  const blade: Pt[] = [[-0.06, shV - 0.005], [-0.092, shV - 0.045], [-0.108, shV - 0.11], [-0.098, shV - 0.19], [-0.076, shV - 0.27], [-0.04, shV - 0.27], [-0.04, shV - 0.005]];
  const bladeC = smooth(blade.slice(0, 5).map(U));
  hardFill(p, 4768, shirt, [...bladeC, ...blade.slice(5).map(U)]);
  inkLine(p, 4769, bladeC, {color: ink, weight: 1.0, closed: false, curve: 0.4, still: true});
  // seat: from the torso back above the belt, out behind the hip joint and under into the thigh (legs frame: the hip anchor, back = +x for
  // a left profile), so the back line runs waist -> seat without a step
  const H: Pt = [g[0] - f.hipU * u, g[1] - (f.hipV + f.lift) * u], at = ([x, y]: Pt): Pt => [H[0] + x * u, H[1] + y * u];
  const seat: Pt[] = [U([-0.074, hip0 + 0.04]), at([0.105, -0.03]), at([0.14, 0.02]), at([0.135, 0.075]), at([0.09, 0.115]), at([0.03, 0.11]), at([0.0, 0.03]), U([-0.02, hip0 + 0.04])];
  const seatC = smooth(seat.slice(0, 7));
  hardFill(p, 4774, def.outfit.pants, [...seatC, seat[7]]);
  inkLine(p, 4775, seatC.slice(0, -4), {color: ink, weight: 1.0, closed: false, curve: 0.45, still: true});
  // the shirt hem over the seat top (the fitted top flares a little over the hip), then the belt again on top
  const hem: Pt[] = [U([-0.075, hip0 + 0.1]), U([-0.09, hip0 + 0.02]), U([-0.02, hip0 + 0.02]), U([-0.02, hip0 + 0.1])];
  hardFill(p, 4776, shirt, hem);
  inkLine(p, 4777, hem.slice(0, 2), {color: ink, weight: 1.0, closed: false, curve: 0.4, still: true});
  const belt = def.outfit.gear?.belt;
  if (belt) hardFill(p, 4778, belt.color, [U([-0.092, hip0 - 0.015 + (belt.h ?? 0.03)]), U([0.0, hip0 - 0.015 + (belt.h ?? 0.03)]), U([0.0, hip0 - 0.015]), U([-0.094, hip0 - 0.015])]);
};
/** The near arm repainted over the fitted top (R1.5): the rig paints its arm before `held`, so the bust would cover the upper arm; the same
 * shoulder -> elbow -> hand geometry is drawn again on top: bare upper arm, a short sleeve set on the shoulder, forearm and a mitten hand. */
const nearArm = (p: Painter, def: CastDef, sh: Pt, el: Pt, hand: Pt, u: number) => {
  const skin = def.head.skin, sl = def.outfit.sleeve, ink = '#2b211c';
  const up = capsule(sh, el, 0.07 * u, 0.062 * u), fore = capsule(el, hand, 0.062 * u, 0.048 * u);
  hardFill(p, 4790, skin, fore); inkLine(p, 4791, fore, {color: ink, weight: 0.9, still: true, curve: 0.1});
  hardFill(p, 4792, skin, up); inkLine(p, 4793, up, {color: ink, weight: 0.9, still: true, curve: 0.1});
  const d: Pt = [(el[0] - sh[0]), (el[1] - sh[1])], hem: Pt = [sh[0] + d[0] * 0.42, sh[1] + d[1] * 0.42];
  const sleeve = capsule([sh[0] - d[0] * 0.08, sh[1] - d[1] * 0.08], hem, 0.084 * u, 0.08 * u);
  hardFill(p, 4794, sl, sleeve); inkLine(p, 4795, sleeve, {color: ink, weight: 1.0, still: true, curve: 0.1});
  const fd: Pt = [hand[0] - el[0], hand[1] - el[1]], fl = Math.hypot(fd[0], fd[1]) || 1, hc: Pt = [hand[0] + fd[0] / fl * 0.035 * u, hand[1] + fd[1] / fl * 0.035 * u];
  const mitt = ell(hc[0], hc[1], 0.05 * u, 0.04 * u, 18, Math.atan2(fd[1], fd[0]));
  hardFill(p, 4796, skin, mitt); inkLine(p, 4797, mitt, {color: ink, weight: 0.9, still: true});
};
/** `new: float-ponytail` (R1.5, UT08 + zero-g cue): a short ponytail from the back of the crown drifting up and back (no gravity), a tie. */
const floatPonytail = (p: Painter, a: FigAnchors, u: number, hair: string) => {
  const t: Pt = [a.head[0] + 0.125 * u, a.head[1] - 0.04 * u];
  const spine: Pt[] = [t, [t[0] + 0.05 * u, t[1] - 0.03 * u], [t[0] + 0.095 * u, t[1] - 0.045 * u], [t[0] + 0.135 * u, t[1] - 0.08 * u], [t[0] + 0.15 * u, t[1] - 0.125 * u]];
  const L: Pt[] = [], R: Pt[] = [];
  spine.forEach((q, i) => {
    const nx = spine[Math.min(4, i + 1)], pv = spine[Math.max(0, i - 1)], d: Pt = [nx[0] - pv[0], nx[1] - pv[1]], l = Math.hypot(d[0], d[1]) || 1;
    const n: Pt = [-d[1] / l, d[0] / l], w = (0.044 - 0.032 * (i / 4) ** 1.5) * u;
    L.push([q[0] + n[0] * w, q[1] + n[1] * w]); R.push([q[0] - n[0] * w, q[1] - n[1] * w]);
  });
  const tail = [...L, spine[4], ...R.reverse()];
  hardFill(p, 4780, hair, tail);
  inkLine(p, 4781, tail, {weight: 0.9, curve: 0.35, still: true});
  inkLine(p, 4782, [spine[1], spine[2], spine[3]].map(([x, y]): Pt => [x, y + 0.008 * u]), {color: mixColor(hair, '#000000', 0.35), weight: 0.8, closed: false, curve: 0.4, still: true});
  const tie = ell(t[0] + 0.004 * u, t[1], 0.016 * u, 0.026 * u, 14, -0.7);
  hardFill(p, 4783, '#2e4a78', tie);
  inkLine(p, 4784, tie, {weight: 0.8, still: true});
};
export const paintLF05 = (p: Painter) => {
  const c = camLF05;
  paintCabin(p, c, {marks: 1});
  paintFloatPen(p, c, [-0.85, 0.95, 0.0], -0.45);
  const at: V3 = [AST_AT[0], AST_AT[1] + 0.02 * 3.6 * 0.6, AST_AT[2]];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  // arms from the shoulder (unrolled picture px): near (l) upper arm 15 deg forward of hanging, forearm forward and a little up; far (r) a
  // step behind it
  const sh = shoulderPoint(AST, g as Pt, u, AST_BODY, 'l');
  const fk = (a1: number, a2: number, from: Pt): {via: Pt; to: Pt} => {
    const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180, via: Pt = [from[0] - Math.sin(r1) * 0.25 * u, from[1] + Math.cos(r1) * 0.25 * u];
    return {via, to: [via[0] - Math.sin(r2) * 0.24 * u, via[1] + Math.cos(r2) * 0.24 * u]};
  };
  const near = fk(16, 58, sh), arms = {lArm: near, rArm: fk(10, 50, [sh[0] + 0.012 * u, sh[1]])};
  const held = (q: Painter, a: FigAnchors, uu: number) => { fittedTop(q, AST, g as Pt, uu); nearArm(q, AST, sh, near.via, near.to, uu); floatPonytail(q, a, uu, AST.head.hair); earStud(q, a, uu); };
  const a = paintFigureAt(p, c, AST, {at, view: 'left', pose: 'P46', face: 'neutral', faceState: {look: [0.2, -0.1]}, t: 0.6, shadow: false, roll: 14, fig: {...AST_DRIFT, ...arms}, held});
  if (!a) return;
  const ends = spineEnds(AST, a, u, [1, 0], 'left', 0, 0.045);
  const mid: Pt = [(ends.top[0] + ends.bottom[0]) / 2 + 0.03 * u, (ends.top[1] + ends.bottom[1]) / 2];
  const col = paintSpaceSpineCard(p, 4700, {straight: 0.3, leader: mid});
  const deck = camPoint(c, [at[0], 0, at[2]]);
  MEASURE.LF05 = {lead: {top: a.top, bottom: a.bottom}, spine: col, cam: c, extra: {headY: Math.round(a.head[1]), headX: Math.round(a.head[0]), headTop: Math.round(a.headTop), chin: Math.round(a.chin), feetY: Math.round(a.feet[1]), deckY: deck ? Math.round(deck[1]) : -1, leaderX: Math.round(mid[0]), leaderY: Math.round(mid[1])}};
};

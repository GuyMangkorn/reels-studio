import {hardFill, inkLine} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import type {View4} from '../kit/views';
import {paintSorted, type Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintAerial} from './aerial';
import {MAN, paintPerson, WALKER, WOMAN, type CastMeasure, type WalkOpts} from './cast';
import {paintCrow, paintCrowPx, type CrowMeasure, type CrowOpts} from './crow';
import type {MaskId} from './masks';
import {C, lookCam, NB, wireAt, WS} from './palette';
import {paintPathBack, pathItems, type PathState} from './path';
import type {CastDef} from '../kit/cast';

// EDU-EP16-SHORT look frames (W3; brief EDU-EP16-BRIEF-R1.1 "Look frames", rows EDU-EP16-ROWS-R1.1) and the crow / mask look-check stills (SP1, SP2).
// Pure paint functions; cameras are the sheet's `pos -> look-at` lines at the named moment, tuned where marked "W3" (recorded in task.md).
// LF01 wire stare (S01-B01-SH01 @ head turn), LF02 test rig (S01-B01-SH05 mid-walk), LF03 key image (S01-B03-SH03 @ push mid), LF04A aerial
// autumn (S01-B04-SH03 mid pull-out), LF04B winter visit (S01-B05-SH01 visit 1), LF05 dusk stare (S01-B05-SH04 end).
// Stills: CR1-CR3 crow model sheets, CR4 the mob at 10 m (S01-B01-SH06 start), MK1-MK3 MASK-A options A1-A3 on MAN and WALKER, MK4 MASK-B + WOMAN.

export const LF_IDS = ['LF01', 'LF02', 'LF03', 'LF04A', 'LF04B', 'LF05', 'CR1', 'CR2', 'CR3', 'CR4', 'MK1', 'MK2', 'MK3', 'MK4'] as const;
export type LfId = (typeof LF_IDS)[number];
export type Measure = {lead?: {top: number; bottom: number}; extra?: Record<string, number | string>; cam?: YCam};
export const MEASURE: Record<string, Measure> = {};
const T = 0.4;

// ---- helpers
type Out<T> = {v?: T | null};
const crowItem = (at: V3, o: CrowOpts, out?: Out<CrowMeasure>, bias = -0.05): Item => ({at, bias, draw: (p, c) => { const m = paintCrow(p, c, at, o); if (out) out.v = m; }});
const personItem = (def: CastDef, o: WalkOpts, out?: Out<CastMeasure>): Item => ({at: o.at, draw: (p, c) => { const m = paintPerson(p, c, def, o); if (out) out.v = m; }});
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const lead = (m?: CastMeasure | null) => (m ? {top: Math.round(m.top), bottom: Math.round(m.bottom)} : undefined);
const cm = (m: CrowMeasure | null | undefined, k: string): Record<string, number> => (m ? {[`${k}Len`]: m.lengthPx, [`${k}Head`]: m.headPx, [`${k}Ring`]: m.ringPx, [`${k}Top`]: m.box[1], [`${k}Bottom`]: m.box[3], [`${k}HeadY`]: Math.round(m.head[1])} : {});
const scene = (p: Painter, c: YCam, s: PathState, extra: Item[], skip?: string[]) => {
  paintPathBack(p, c, s);
  paintSorted(p, c, [...pathItems(s, {skip}), ...extra]);
};

// ---- LF01: S01-B01-SH01 at the head turn (on «จำหน้า»). W3: the camera sits a little further left-back so the crow is the upper-left foreground and
// MAN the lower right (sheet: pos (-4.55, 6.30, -3.05) look-at (-1.5, 1.6, 0.3)); MAN at x -2.2 (his path -3.4 -> 0.6).
export const camLF01 = lookCam([-4.5, 6.27, -2.9], [-1.4, 1.2, 0.7], 1100, {hy: 900, near: 0.05});
export const paintLF01 = (p: Painter) => {
  const c = camLF01, s: PathState = {season: 'spring', t: T};
  const crow: Out<CrowMeasure> = {}, man: Out<CastMeasure> = {};
  scene(p, c, s, [
    personItem(MAN, {at: [-2.2, 0, 0.3], view: 'left', walk: 0.3, t: T, mask: 'A1', cup: 'walk'}, man),
    crowItem(wireAt(WS.WSH), {variant: 'adult-ringed', view: 'back', head: 'profile-right', state: {headTilt: 0.5, lean: 6}, seed: 501, sun: -1}, crow, -10),
  ]);
  MEASURE.LF01 = {cam: c, extra: {...cm(crow.v, 'crow'), manTop: Math.round(man.v?.top ?? 0), manBottom: Math.round(man.v?.bottom ?? 0), maskPx: man.v?.maskPx ?? 0, maskBottom: man.v?.maskBottom ?? 0}};
};

// ---- LF02: S01-B01-SH05 mid-walk (x_w -10.6). W3: hy 960 -> 600 lifts MAN whole above the caption band (the path runs under it) with the wire
// crows in the upper frame.
const RIG = (xw: number) => lookCam([xw + 0.2, 0.95, 3.6], [xw + 0.4, 2.3, -0.8], 900, {hy: 600});
export const camLF02 = RIG(-10.6);
const wireRow = (xw: number, scold = false, phase = 0): Item[] => [-15.5, -14.5, -13.0, WS.WS1, WS.WS2, WS.WS3].map((x, i) => {
  const toR = x < xw, front = i % 3 === 1;
  return crowItem(wireAt(x), {
    variant: i % 2 ? 'adult-ringed' : 'adult', view: front ? 'front' : toR ? 'right' : 'left', head: toR ? 'profile-right' : 'profile-left',
    state: scold ? {beak: 0.55 + 0.3 * Math.sin(phase + i * 1.7), flare: 0.6, lean: 18, tailUp: 10} : {headTilt: 0.6, lean: 10}, seed: 520 + i, sun: -1,
  });
});
export const paintLF02 = (p: Painter) => {
  const c = camLF02, s: PathState = {season: 'spring', t: T};
  const man: Out<CastMeasure> = {};
  const near: Out<CrowMeasure> = {};
  const row = wireRow(-10.6);
  row[3] = crowItem(wireAt(WS.WS1), {variant: 'adult-ringed', view: 'left', head: 'profile-left', state: {headTilt: 0.7, lean: 16, beak: 0.25}, seed: 523, sun: -1}, near);
  scene(p, c, s, [personItem(MAN, {at: [-10.6, 0, 0.3], view: 'right', walk: 0.55, t: T, mask: 'A1', cup: 'walk'}, man), ...row]);
  MEASURE.LF02 = {cam: c, lead: lead(man.v), extra: {manPx: Math.round((man.v?.bottom ?? 0) - (man.v?.top ?? 0)), maskPx: man.v?.maskPx ?? 0, ...cm(near.v, 'ws1')}};
};

// ---- LF03: S01-B03-SH03 at the push mid-point (the key image on «โดนเหมือนกัน»). W3 camera: the sheet's lines leave both walkers outside a 1080
// frame at 35 deg; this camera stands ahead of her on the near lawn at about 34 deg off her side axis, so she is the near lead, MAN 6 m behind
// (bare-faced, sipping) and the mob on the wire and T2 above and around him, every scolding crow >= 10 m from her head.
export const camLF03 = lookCam([5.2, 1.45, 3.0], [-0.6, 2.6, -1.3], 1000, {hy: 680});
const WOMAN_AT: V3 = [2.8, 0, 0.3], MAN3_AT: V3 = [-3.2, 0, 0.3];
export const MOB3: V3[] = [wireAt(WS.WS1), wireAt(WS.WS2 + 0.3), wireAt(WS.WS3), [-11.3, 10.0, -4.5], [-10.4, 9.7, -4.2], [-18, 7.72, -2.4]];
export const paintLF03 = (p: Painter) => {
  const c = camLF03, s: PathState = {season: 'spring', t: T};
  const w: Out<CastMeasure> = {}, m: Out<CastMeasure> = {};
  const mob = MOB3.map((at, i) => crowItem(at, {variant: i % 2 ? 'adult-ringed' : 'adult', view: 'right', state: {beak: 0.5 + 0.4 * ((i * 37) % 3) / 2, flare: 0.8, lean: 20, tailUp: 15}, seed: 540 + i, sun: -1}));
  // one crow leapfrogging forward in the air (still >= 10 m behind her)
  // three crows leapfrogging forward in the air against the sky (still >= 10 m behind her)
  const flyers: V3[] = [[-6.0, 7.0, -1.8], [-5.4, 8.9, -0.6], [-8.2, 9.6, -2.2], [-9.5, 11.2, -1.0]];
  flyers.forEach((at, i) => mob.push(crowItem(at, {variant: 'adult', view: 'right', state: {wings: 1, wingUp: [0.6, -0.4, 0.9, -0.1][i], tuck: true, beak: 0.4}, seed: 549 + i * 3, sun: -1})));
  const fly = flyers[0];
  scene(p, c, s, [
    personItem(WOMAN, {at: WOMAN_AT, view: 'right', walk: 0.2, t: T, mask: 'A1', tote: true, face: 'neutral'}, w),
    personItem(MAN, {at: MAN3_AT, view: 'right', walk: 0.75, t: T, cup: 'sip', face: 'neutral'}, m),
    ...mob,
  ]);
  const head: V3 = [WOMAN_AT[0], 1.45, WOMAN_AT[2]];
  const ds = [...MOB3, ...flyers].map((v) => dist(v, head));
  void fly;
  MEASURE.LF03 = {cam: c, lead: lead(w.v), extra: {womanPx: Math.round((w.v?.bottom ?? 0) - (w.v?.top ?? 0)), maskPx: w.v?.maskPx ?? 0, maskBottom: w.v?.maskBottom ?? 0,
    manPx: Math.round((m.v?.bottom ?? 0) - (m.v?.top ?? 0)), mobMinDistM: Math.min(...ds).toFixed(1), mobMaxDistM: Math.max(...ds).toFixed(1),
    manToMobM: Math.min(...MOB3.map((v) => dist(v, [MAN3_AT[0], 1.6, 0.3]))).toFixed(1)}};
};

// ---- LF04A: S01-B04-SH03 mid pull-out (autumn). W3: the sheet's halfway camera (pos (33, 194, 211) -> look-at (2.5, 3, -76.75)) pitches only 33 deg
// and reads as a street grid running to a horizon; the brief's aerial reads map-like at 55-65 deg, so the end camera of the crane is steepened:
// halfway pos (12, 200, 50) -> look-at (0, 0, -80), pitch 57 deg (Boss re-times the crane on this point).
export const camLF04A = lookCam([12, 200, 50], [0, 0, -80], 900, {hy: 700});
export const paintLF04A = (p: Painter) => { paintAerial(p, camLF04A, {s: 1, spread: 0.55, t: T}); MEASURE.LF04A = {cam: camLF04A}; };

// ---- LF04B: S01-B05-SH01 winter, visit 1 (on «หลายปี»): NT bare, the old nest empty and broken, WALKER in MASK-A, mustard hoodie and grey scarf.
// W3 camera: the sheet's camera (pos (-0.6, 1.9, 2.6) look-at (1.9, 4.9, -3.3)) puts a walker on the path below the frame; pulled back onto the near
// lawn and tilted down so the bare tree, the nest and the full walker read together.
export const camLF04B = lookCam([-1.6, 1.6, 4.2], [2.0, 4.0, -3.5], 1000, {hy: 780});
export const paintLF04B = (p: Painter) => {
  const c = camLF04B, s: PathState = {season: 'winter', t: T, nest: 'empty'};
  const wk: Out<CastMeasure> = {}, a: Out<CrowMeasure> = {};
  scene(p, c, s, [
    personItem(WALKER, {at: [1.3, 0, 0.3], view: 'right', walk: 0.6, t: T, mask: 'A1', scarf: true}, wk),
    crowItem(wireAt(WS.WS7), {variant: 'adult-ringed', view: 'front', head: 'profile-right', state: {beak: 0.6, lean: 14, flare: 0.6}, seed: 560, sun: -1}, a),
    crowItem(wireAt(WS.WS8 + 0.5), {variant: 'adult', view: 'left', state: {beak: 0.5, lean: 18, flare: 0.7, tailUp: 10}, seed: 561, sun: -1}),
  ]);
  const nest = camPoint(c, [2.0, 5.6, -3.6]);
  MEASURE.LF04B = {cam: c, lead: lead(wk.v), extra: {walkerPx: Math.round((wk.v?.bottom ?? 0) - (wk.v?.top ?? 0)), maskPx: wk.v?.maskPx ?? 0, nestY: Math.round(nest?.[1] ?? 0), nestPx: Math.round(0.6 * camUnit(c, [2.0, 5.6, -3.6])), ...cm(a.v, 'ws7')}};
};

// ---- LF05: S01-B05-SH04 end (the stare after V03). W3: the camera sits 0.2 m below the wire looking up (sheet: level at 5.82), so the crow stands
// against the dusk sky above the hall's roofline; f 1100 at 0.7 m.
export const camLF05 = lookCam([-4.0, 5.6, -1.78], [-4.0, 5.98, -2.4], 1150, {hy: 830, near: 0.05});
export const paintLF05 = (p: Painter) => {
  const c = camLF05, s: PathState = {season: 'dusk', t: T};
  const cr: Out<CrowMeasure> = {};
  scene(p, c, s, [crowItem(wireAt(WS.WSH), {variant: 'young-ringless', view: 'left', head: 'front', state: {beak: 0}, seed: 580, sun: 0, rim: C.duskRim}, cr, -10)]);
  MEASURE.LF05 = {cam: c, extra: cm(cr.v, 'crow')};
};

// ---- crow model sheets (SP1): crows at picture size over a plain sky/lawn, a wire line and a body-length bar (0.45 m, check only)
const sheetBack = (p: Painter, sky = true) => {
  if (sky) paintSkyBands(p, {from: C.skyTop, to: C.skyHor, horizon: 1500, width: 1080, bands: 8});
  hardFill(p, 600, C.lawn, [[-50, 1500], [1130, 1500], [1130, 1980], [-50, 1980]]);
};
const wireLine = (p: Painter, y: number, id: number) => hardFill(p, id, C.wire, [[-20, y - 2], [1100, y - 2], [1100, y + 2], [-20, y + 2]]);
const bar = (p: Painter, x: number, y: number, L: number, id: number) => { p.inkStill(id, 'pen', C.ink, 3); p.brush.line(x, y, x + L, y); p.brush.line(x, y - 8, x, y + 8); p.brush.line(x + L, y - 8, x + L, y + 8); };
/** CR1: adult-ringed in four perched views (right, left, front, back with a profile head), on a wire, 360 px body length. */
export const paintCR1 = (p: Painter) => {
  sheetBack(p);
  const L = 360, ms: CrowMeasure[] = [];
  wireLine(p, 700, 601);
  ms.push(paintCrowPx(p, [300, 700], L, {variant: 'adult-ringed', view: 'right', seed: 610, sun: -1}));
  ms.push(paintCrowPx(p, [800, 700], L, {variant: 'adult-ringed', view: 'left', seed: 611, sun: -1}));
  wireLine(p, 1330, 602);
  ms.push(paintCrowPx(p, [270, 1330], L, {variant: 'adult-ringed', view: 'front', seed: 612, sun: -1}));
  ms.push(paintCrowPx(p, [780, 1330], L, {variant: 'adult-ringed', view: 'back', head: 'profile-right', seed: 613, sun: -1}));
  bar(p, 80, 1440, L, 619);
  MEASURE.CR1 = {extra: {L, ringPx: Math.max(...ms.map((m) => m.ringPx))}};
};
/** CR2: actions: scold (beak open, tail flared), caw (throat puff), take-off profile (wings up), fly from below (the low pass). */
export const paintCR2 = (p: Painter) => {
  sheetBack(p);
  const L = 340;
  wireLine(p, 640, 621);
  paintCrowPx(p, [290, 640], L, {variant: 'adult-ringed', view: 'right', state: {beak: 0.9, flare: 1, lean: 22, tailUp: 18}, seed: 630, sun: -1});
  paintCrowPx(p, [800, 640], L, {variant: 'adult', view: 'left', state: {beak: 0.8, puff: 1, lean: -6, tailUp: -12}, seed: 631, sun: -1});
  paintCrowPx(p, [300, 1250], L, {variant: 'adult', view: 'right', state: {wings: 1, wingUp: 0.8, tuck: true, beak: 0.3}, seed: 632, sun: -1});
  paintCrowPx(p, [780, 1060], L * 0.8, {variant: 'adult-ringed', view: 'below', state: {wingUp: 0.1}, seed: 633, sun: -1});
  MEASURE.CR2 = {extra: {L}};
};
/** CR3: the young: beg at the nest (red gape, blue-grey eye), young-ringless front stare (the end), and `held` (calm, folded, in two mitten hands). */
export const paintCR3 = (p: Painter) => {
  sheetBack(p);
  const L = 330;
  // nest cup on a branch
  hardFill(p, 640, C.trunk, [[40, 700], [600, 640], [600, 668], [40, 728]]);
  paintCrowPx(p, [300, 640], L, {variant: 'young', view: 'right', state: {beak: 1, lean: -28, wings: 0}, seed: 641, sun: -1});
  hardFill(p, 642, '#3a2e24', [[130, 600], [470, 600], [430, 690], [170, 690]]);
  for (let i = 0; i < 8; i++) inkLine(p, 643 + i, [[120 + i * 8, 610 + i * 10], [480 - i * 6, 606 + i * 10]], {weight: 2, color: '#6a5440', closed: false, still: true});
  wireLine(p, 700, 651);
  paintCrowPx(p, [800, 700], L, {variant: 'young-ringless', view: 'left', head: 'front', seed: 652, sun: -1});
  // held: crow body horizontal (lean -60 rotates a profile so the bill points forward-level), two mitten hands round the folded wings
  const hc: Pt = [540, 1300];
  paintCrowPx(p, [hc[0] - 40, hc[1] + 70], 420, {variant: 'adult', view: 'right', state: {tuck: true, lean: 32}, seed: 660, sun: -1});
  // sleeves from below (navy blazer), then two mitten hands closed over the folded wings (UT14: no fingers, three short strokes)
  for (const [sx, id] of [[-1, 670], [1, 671]] as const) {
    const wr: Pt = [hc[0] + sx * 95, hc[1] + 30];
    hardFill(p, id + 20, '#1f2a44', [[wr[0] - 46, wr[1] + 10], [wr[0] + 46, wr[1] + 10], [wr[0] + sx * 140 + 50, wr[1] + 420], [wr[0] + sx * 140 - 70, wr[1] + 420]]);
    hardFill(p, id + 21, '#f2efe8', [[wr[0] - 44, wr[1] + 4], [wr[0] + 44, wr[1] + 4], [wr[0] + 46, wr[1] + 26], [wr[0] - 46, wr[1] + 26]]);
    const hand: Pt[] = [[wr[0] - sx * 70, wr[1] - 70], [wr[0] + sx * 10, wr[1] - 92], [wr[0] + sx * 62, wr[1] - 40], [wr[0] + sx * 50, wr[1] + 18], [wr[0] - sx * 40, wr[1] + 20], [wr[0] - sx * 84, wr[1] - 20]];
    hardFill(p, id, '#e8c3a4', hand);
    inkLine(p, id + 5, hand, {weight: 1.2, color: '#9a6a50', closed: true, still: true});
    for (let k = 0; k < 3; k++) inkLine(p, id + 10 + k, [[wr[0] - sx * (60 - k * 22), wr[1] - 62 + k * 4], [wr[0] - sx * (54 - k * 22), wr[1] - 34 + k * 4]], {weight: 1.4, color: '#9a6a50', closed: false, still: true});
  }
  MEASURE.CR3 = {extra: {L}};
};
/** CR4: the mob on the wire at 10+ m (S01-B01-SH06 start): six scolding crows in the near row, two in T2's top, MAN masked ahead. */
// W3: the sheet's start camera puts the row above the frame's top-left; turned down and right so the row is the near foreground and MAN is ahead.
// MAN at x -5.6 (the shot's END mark): at its start mark (x -9.0) the front crow at x -16.0 is 8.6 m from his head (< 10 m, finding for W4/W5).
export const camCR4 = lookCam([-19.6, 6.9, -0.9], [-9.0, 3.2, -1.2], 1000, {near: 0.05, hy: 800});
export const paintCR4 = (p: Painter) => {
  const c = camCR4, s: PathState = {season: 'spring', t: T};
  const man: Out<CastMeasure> = {};
  const MAN_AT: V3 = [-5.6, 0, 0.3];
  const row: V3[] = [-18.0, -17.6, -17.2, -16.8, -16.4, -16.0].map((x) => wireAt(x)), tops: V3[] = [[-12.2, 8.4, -4.4], [-11.4, 8.6, -4.6]];
  const items = [...row, ...tops].map((at, i) => crowItem(at, {variant: i % 3 === 0 ? 'adult-ringed' : 'adult', view: i % 2 ? 'right' : 'front', head: 'profile-right', state: {beak: 0.4 + 0.5 * ((i * 5) % 4) / 3, flare: 0.8, lean: 20, tailUp: 12}, seed: 700 + i, sun: -1}));
  scene(p, c, s, [personItem(MAN, {at: MAN_AT, view: 'right', walk: 0.4, t: T, mask: 'A1', cup: 'walk'}, man), ...items], ['T1']);
  const head: V3 = [MAN_AT[0], 1.7, MAN_AT[2]];
  const ds = [...row, ...tops].map((v) => dist(v, head));
  MEASURE.CR4 = {cam: c, extra: {manPx: Math.round((man.v?.bottom ?? 0) - (man.v?.top ?? 0)), maskPx: man.v?.maskPx ?? 0, mobMinDistM: Math.min(...ds).toFixed(1)}};
};

// ---- mask option sheets (SP2, Q-F5): MAN front, MAN right, WALKER right, WALKER back, on the path in the morning
export const camMK = lookCam([0, 1.15, 4.6], [0, 1.1, 0.3], 1150, {hy: 760});
const lineup = (p: Painter, key: string, figs: {def: CastDef; view: View4; mask?: MaskId; x: number}[]) => {
  const c = camMK, s: PathState = {season: 'spring', t: T};
  const outs = figs.map(() => ({} as Out<CastMeasure>));
  scene(p, c, s, figs.map((f, i) => personItem(f.def, {at: [f.x, 0, 0.3], view: f.view, t: T, mask: f.mask, face: 'neutral', seed: 800 + i * 7}, outs[i])), ['bench', 'Y1']);
  MEASURE[key] = {cam: c, extra: Object.fromEntries(outs.flatMap((o, i) => [[`fig${i}MaskPx`, o.v?.maskPx ?? 0], [`fig${i}Top`, Math.round(o.v?.top ?? 0)], [`fig${i}Bottom`, Math.round(o.v?.bottom ?? 0)]]))};
};
const maskSheet = (id: MaskId) => (p: Painter) => lineup(p, `MK-${id}`, [
  {def: MAN, view: 'front', mask: id, x: -1.65}, {def: MAN, view: 'right', mask: id, x: -0.55}, {def: WALKER, view: 'right', mask: id, x: 0.55}, {def: WALKER, view: 'back', mask: id, x: 1.6},
]);
export const paintMK1 = maskSheet('A1');
export const paintMK2 = maskSheet('A2');
export const paintMK3 = maskSheet('A3');
/** MK4: MASK-B on MAN (front, right), MASK-A1 on WOMAN (front, right). */
export const paintMK4 = (p: Painter) => lineup(p, 'MK4', [
  {def: MAN, view: 'front', mask: 'B', x: -1.65}, {def: MAN, view: 'right', mask: 'B', x: -0.55}, {def: WOMAN, view: 'front', mask: 'A1', x: 0.55}, {def: WOMAN, view: 'right', mask: 'A1', x: 1.6},
]);
export {NB};

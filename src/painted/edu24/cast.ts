import type {CastDef, FigAnchors, FigPose} from '../kit/cast';
import {shoulderPoint} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt} from '../kit/figure-at';
import type {FaceState} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {chairSpec} from '../kit/props';
import type {V3} from '../kit/space';
import {dress} from '../kit/wardrobe';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {COOL_TINT, PAL, type Light} from './palette';
import {CHAIRS, HOST_AT, paintNote, paintPlainChair} from './room';

// EDU-EP24-SHORT cast (EDU-EP24-BRIEF-R2 VD02, user Q2): casting lines
//   YOU   `man-spiky, P31, happy | worried` (kit default rust jacket)
//   RIVAL `man-buzz + outfit override (grey-blue short-sleeve shirt, no apron, dark trousers and shoes), P31, neutral | sad`
//   HOST  `man-parted + office, P03, smug` / `new: note lift` (N7, authored here: right hand at shoulder height, left forearm across the waist)
// Film W3 look frames (2026-11-17); Boss hardens N6/N7 and the slump.

export const YOU: CastDef = PEOPLE['man-spiky'];
const buzz = PEOPLE['man-buzz'];
export const RIVAL: CastDef = {...buzz, outfit: {...buzz.outfit, shirt: '#6f8296', sleeve: '#6f8296', apron: undefined, pants: '#3d3a36', shoes: '#2a2a2c', boots: false}};
export const HOST: CastDef = dress(PEOPLE['man-parted'], 'office');

export type Who = 'you' | 'rival';
export type BidderOpts = {view: 'front' | 'back'; face?: ExpressionId; faceState?: Partial<FaceState>; fig?: Partial<FigPose>; light: Light; t?: number; warm?: number};
export type Lead = {crown: number; hip: number; lead: number; headX: number; chin: number; shoulderX: [number, number]};
const leadOf = (c: YCam, at: V3, seatV: number, a: FigAnchors | null): Lead | undefined => {
  const hip = camPoint(c, [at[0], seatV + 0.05, at[2]]);
  if (!a || !hip) return undefined;
  return {crown: Math.round(a.headTop), hip: Math.round(hip[1]), lead: Math.round(hip[1] - a.headTop), headX: Math.round(a.head[0]), chin: Math.round(a.chin), shoulderX: [Math.round(Math.min(a.lShoulder[0], a.rShoulder[0])), Math.round(Math.max(a.lShoulder[0], a.rShoulder[0]))]};
};

/** A bidder on an office chair at CHAIRS[who], facing -z (the board). Back view from the main wide (yaw 0), front view from the reverse (yaw 180). */
export const paintBidder = (p: Painter, c: YCam, who: Who, o: BidderOpts): Lead | undefined => {
  const def = who === 'you' ? YOU : RIVAL, at = CHAIRS[who], seed = who === 'you' ? 24600 : 24700;
  const seatV = chairSpec(def, 'front').seatV;
  if (o.view === 'front') paintPlainChair(p, c, at, seatV, 'back', o.light, seed);
  paintPlainChair(p, c, at, seatV, 'under', o.light, seed);
  const tint = o.light === 'warm' ? (o.warm ? {to: PAL.sun, u: o.warm} : undefined) : COOL_TINT;
  const a = paintFigureAt(p, c, def, {at, view: o.view, pose: 'P31', face: o.face ?? 'neutral', faceState: o.faceState, fig: o.fig, t: o.t ?? 0, tint, shadow: {op: 40}, seed: def.seed});
  if (o.view === 'back') paintPlainChair(p, c, at, seatV, 'back', o.light, seed);
  return leadOf(c, at, seatV, a);
};

export type HostOpts = {face?: ExpressionId; faceState?: Partial<FaceState>; noteLift?: boolean; light: Light | 'patch'; t?: number};
export type HostMeasure = {crown: number; tableTop: number; lead: number; note?: Pt[]; headX: number};
/** The host standing behind the side table, front to the main cameras: P03 arms folded, or N7 the note lift. */
export const paintHost = (p: Painter, c: YCam, o: HostOpts): HostMeasure | undefined => {
  const at = HOST_AT, g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return undefined;
  let fig: Partial<FigPose> | undefined;
  let noteQ: Pt[] | undefined;
  if (o.noteLift) {
    // N7: right hand (screen left) at shoulder height a little forward and out, note between thumb and two fingers; left forearm across the waist
    const sh = shoulderPoint(HOST, g as Pt, u, {view: 'front'}, 'r'), shl = shoulderPoint(HOST, g as Pt, u, {view: 'front'}, 'l');
    fig = {
      rArm: {to: [sh[0] - 0.2 * u, sh[1] + 0.02 * u], via: [sh[0] - 0.13 * u, sh[1] + 0.23 * u]},
      lArm: {to: [shl[0] - 0.28 * u, shl[1] + 0.103 * u], via: [shl[0] - 0.067 * u, shl[1] + 0.251 * u]}, // P03's left arm (kit poses.ts)
    };
  }
  const tint = o.light === 'patch' ? {to: PAL.sun, u: 0.16} : o.light === 'warm' ? undefined : COOL_TINT;
  const a = paintFigureAt(p, c, HOST, {at, view: 'front', pose: o.noteLift ? 'P01' : 'P03', face: o.face ?? 'smug', faceState: o.faceState, fig, t: o.t ?? 0, tint, shadow: {op: 40}, seed: HOST.seed,
    held: o.noteLift ? (q, an, uu) => {
      // the note held up by one end, long side horizontal, tilted a little
      const h = an.rHand, w = 0.16 * uu, hh = 0.075 * uu, tilt = -0.18;
      const cs = Math.cos(tilt), sn = Math.sin(tilt), x0 = h[0] - w * 0.9, y0 = h[1] - hh * 0.55;
      const R = (x: number, y: number): Pt => [h[0] + (x - h[0]) * cs - (y - h[1]) * sn, h[1] + (x - h[0]) * sn + (y - h[1]) * cs];
      noteQ = [R(x0, y0), R(x0 + w, y0), R(x0 + w, y0 + hh), R(x0, y0 + hh)];
      paintNote(q, 24800, noteQ);
    } : undefined});
  const top = camPoint(c, [at[0], 1.0, -1.35]);
  if (!a || !top) return undefined;
  return {crown: Math.round(a.headTop), tableTop: Math.round(top[1]), lead: Math.round(top[1] - a.headTop), note: noteQ?.map(([x, y]) => [Math.round(x), Math.round(y)] as Pt), headX: Math.round(a.head[0])};
};

// ---- Seated group (user, 2026-11-17: "มีคนนั่งข้างหลัง 2 คนที่ประมูล เป็นเงาได้ไหมสักกลุ่มนึง"; replaces the standing wall extras of the first
// pass): three colleagues on plain chairs in a row behind the bidders, watching the board. Flat soft silhouettes (no ink, no face, idle only),
// figure and chair in one muted tone, so they sit back as an out-of-focus row and never carry story. Row at z 2.05, x -0.75 / 0 / +0.75: from
// the wide the centre one sits in the picture gap between YOU and RIVAL and the outer two at the frame edges (measured clearances in the
// look-frame measure). Casting lines (silhouette only): G1 `woman-ponytail, P31`  G2 `man-crop, P31`  G3 `woman-curly, P31`
export type GroupId = 'G1' | 'G2' | 'G3';
export const GROUP: Record<GroupId, {def: CastDef; at: V3}> = {
  G1: {def: PEOPLE['woman-ponytail'], at: [-0.75, 0, 2.05]},
  G2: {def: PEOPLE['man-crop'], at: [0, 0, 2.05]},
  G3: {def: PEOPLE['woman-curly'], at: [0.75, 0, 2.05]},
};
export const GROUP_IDS = Object.keys(GROUP) as GroupId[];
/** One group member seated, as a flat silhouette: `view` 'back' from the wides, 'front' from the reverse. Returns the picture bounds of the
 *  head and shoulders (for the clearance measure). */
export const paintGroupMember = (p: Painter, c: YCam, id: GroupId, view: 'front' | 'back', light: Light): {crown: number; x0: number; x1: number} | undefined => {
  const e = GROUP[id], seatV = chairSpec(e.def, 'front').seatV, seed = 24950 + Number(id.slice(1)) * 100;
  const base = e.def.outfit.jacket ?? e.def.outfit.shirt;
  // foreground (wides, seen from behind): dark and close to the carpet value, so the row merges into the floor; background (reverse): close
  // to the wall value. Either way low contrast against what is behind it, the out-of-focus read.
  const toward = view === 'back' ? (light === 'warm' ? '#4a4f4c' : '#435052') : '#a7aba3';
  const col = mixColor(mixColor(base, e.def.head.hair, 0.35), toward, 0.7);
  const chair = mixColor(col, '#000000', 0.06);
  if (view === 'front') paintPlainChair(p, c, e.at, seatV, 'back', light, seed, chair);
  paintPlainChair(p, c, e.at, seatV, 'under', light, seed, chair);
  const a = paintFigureAt(p, c, e.def, {at: e.at, view, pose: 'P31', t: 0, fig: {silhouette: col}, shadow: false, seed: e.def.seed + 3});
  if (view === 'back') paintPlainChair(p, c, e.at, seatV, 'back', light, seed, chair);
  if (!a) return undefined;
  return {crown: Math.round(a.headTop), x0: Math.round(Math.min(a.lShoulder[0], a.rShoulder[0])), x1: Math.round(Math.max(a.lShoulder[0], a.rShoulder[0]))};
};

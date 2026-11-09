import {drawFigure, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, washAt} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {hipAnchor, rollAnchors, withRoll} from '../kit/figure-at';
import type {FaceState} from '../kit/head';
import {layerMotion} from '../kit/motions';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import type {Brush} from '../BrushCanvas';
import {poseFor, poseMix, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCar, paintPen, paintPhone, paintTissue, woman} from './car';
import {counterOf, fallY, keys, lerp, lightAt, lin, poseFrameAt, REWIND, seg} from './clock';

// EDU-EP11 interior story (Boss W5.2, SHEETS-R1.3): the WOMAN, her props and SET-CAR as ONE pure function of the story frame `s`. B01-B03 interior shots
// use s = G; the frozen shots hold s 842; the rewind (G1325-1340) runs s 842 -> 0 through the same function, so G1340 is frame 0 by construction. The mode
// switches (stand P10 <-> float P46 <-> crouch P35) are keyed `poseMix` blends: narrow windows going forward, wide ones in the rewind (N10, 15 f).

export const FEET0: V3 = [0.05, 0, -0.3];
/** Right-hand rail grip (world, CAR space) and the bell button centre. */
export const GRIP: V3 = [-0.66, 0.92, -0.3];
export const BELL: V3 = [-0.697, 0.95, -0.2];
const CROUCH_X = -0.36;
/** Float lift that puts the head top on the ceiling panel (2.30 m) at the bonk, in P46 with the knees bent; tuned by `tests/edu11-assets.test.ts` (contact +-6 px). */
export const BONK_LIFT = 0.78;

export type Mode = 'stand' | 'float' | 'crouch';
type Prop = {at: V3; deg: number};
export type Plan = {
  /** `poseMix(a, b, k)` of the body and arms; a === b === 'P46' with k 0 is the pure float (zero-g-drift). */
  a: AnyPoseId; b: AnyPoseId; k: number;
  feet: V3; lift: number; roll: number; rise: number;
  face: ExpressionId; faceState?: Partial<FaceState>;
  /** Right-hand grip blend 0..1 (world point GRIP). */
  grip: number;
  phoneHeld: boolean; nod?: Pt; crouchAdd?: number;
  phone: Prop | null; pen: Prop | null; tissue: Prop | null;
  light: number; display: string; bell: number;
};

const ceil = (k: readonly (readonly [number, number])[], s: number) => keys(s, k);
const wob = (s: number, a: number, f: number, ph = 0) => a * Math.sin((s / 30) * f * 2 * Math.PI + ph);

/** Mode windows [start, end] of the three pose switches: forward (narrow) and rewind (wide, centred on the switch frame 132 / 270 / 762). */
export const WINDOWS = {
  narrow: {standFloat: [132, 156], floatCrouch: [256, 284], crouchFloat: [762, 786]},
  wide: {standFloat: [92, 172], floatCrouch: [215, 325], crouchFloat: [717, 807]},
} as const;
export const modeMix = (s: number, wide: boolean): {a: AnyPoseId; b: AnyPoseId; k: number} => {
  const w = wide ? WINDOWS.wide : WINDOWS.narrow;
  if (s < w.standFloat[0]) return {a: 'P10', b: 'P10', k: 0};
  if (s < w.standFloat[1]) return {a: 'P10', b: 'P46', k: seg(s, w.standFloat[0], w.standFloat[1])};
  if (s < w.floatCrouch[0]) return {a: 'P46', b: 'P46', k: 0};
  if (s < w.floatCrouch[1]) return {a: 'P46', b: 'P35', k: seg(s, w.floatCrouch[0], w.floatCrouch[1])};
  if (s < w.crouchFloat[0]) return {a: 'P35', b: 'P35', k: 0};
  if (s < w.crouchFloat[1]) return {a: 'P35', b: 'P46', k: seg(s, w.crouchFloat[0], w.crouchFloat[1])};
  if (s < 806) return {a: 'P46', b: 'P46', k: 0};
  if (s < 820) return {a: 'P46', b: 'P04', k: seg(s, 806, 820)};
  return {a: 'P04', b: 'P04', k: 0};
};

const faceAt = (s: number): {face: ExpressionId; faceState?: Partial<FaceState>} => {
  if (s < 32) return {face: 'neutral'};
  if (s < 160) return {face: 'shock'};
  if (s < 242) return {face: 'scared', faceState: {mouth: 'flat', look: [0, 0]}};
  if (s < 270) return {face: 'worried'};
  if (s < 282) return {face: 'worried', faceState: {look: [0, -0.6]}}; // up at the ceiling
  if (s < 290) return {face: 'worried', faceState: {look: [0, 0.5]}}; // down at the floor
  if (s < 608) return {face: 'angry'}; // "โดดสวน": determined, eyes level
  if (s < 622) return {face: 'surprised'}; // "ห๊ะ"
  if (s < 662) return {face: 'sad'}; // the sigh
  if (s < 704) return {face: 'worried', faceState: {look: [0, 0.5]}};
  if (s < 756) return {face: 'worried', faceState: {look: [0, 0.5], mouth: 'talk', open: 0.12 + 0.14 * Math.abs(Math.sin((s - 704) * Math.PI * 3 / 30))}}; // lips count silently (3 Hz)
  if (s < 759) return {face: 'worried'};
  if (s < 800) return {face: 'angry'}; // the push-off, determined
  if (s < 806) return {face: 'shock'};
  return {face: 'ouch'};
};

/** Adrift prop path: world point at story frame `s` (keys in frames), plus a small slow wobble; spin in degrees. */
const drift = (s: number, k: readonly (readonly [number, number, number, number])[], seed: number): V3 => {
  const f = (i: 1 | 2 | 3) => keys(s, k.map((q) => [q[0], q[i]] as const));
  return [f(1) + wob(s, 0.02, 0.35, seed), f(2) + wob(s, 0.02, 0.5, seed * 2), f(3)];
};

/** The WOMAN, her props and the car state at story frame `s` (0..893). `wide` selects the rewind's wide blend windows. */
export const planAt = (s: number, wide = false): Plan => {
  const m = modeMix(s, wide), fc = faceAt(s);
  const lift = s < 132 ? ceil([[39, 0], [75, 0.02], [132, 0.02]], s) : s < 160 ? ceil([[132, 0.02], [160, 0.05]], s) : s < 256 ? 0.05 : s < 270 ? lerp(0.05, 0, seg(s, 256, 270)) : s < 762 ? 0 : s < 800 ? BONK_LIFT * seg(s, 762, 800) : s < 806 ? BONK_LIFT - 0.03 * lin(s, 800, 806) : BONK_LIFT - 0.03;
  const fx = s < 132 ? 0.05 : s < 160 ? lerp(0.05, 0, seg(s, 132, 160)) : s < 242 ? 0 : s < 278 ? lerp(0, CROUCH_X, seg(s, 242, 278)) : s < 762 ? CROUCH_X : s < 842 ? lerp(CROUCH_X, -0.3, seg(s, 762, 800)) : lerp(-0.3, 0.12, seg(s, 843, 870));
  const roll = s < 168 ? 0 : s < 242 ? -7 * seg(s, 168, 220) : s < 263 ? -7 * (1 - seg(s, 242, 263)) : s < 806 ? 0 : s < 842 ? 160 * seg(s, 806, 838) : 160 + 1.2 * (s - 842);
  const dip = s >= 295 && s < 305 ? Math.sin(Math.PI * lin(s, 295, 305)) : 0;
  const rise = ceil([[39, 0], [74, 0.25], [132, 0.45], [160, 1]], s);
  const grip = s < 163 ? 0 : s < 762 ? seg(s, 158, 168) : 1 - seg(s, 762, 770);
  const phone: Prop | null = s < 140 ? null : {at: drift(s, [[140, 0.0, 1.15, -0.2], [220, 0.62, 1.5, -0.2], [286, 0.55, 2.05, -0.2], [600, 0.35, 2.1, -0.2], [748, 0.3, 2.05, -0.2], [842, 0.45, 1.9, -0.2]], 1), deg: 40 * ((s - 140) / 30)};
  const pen: Prop | null = s < 144 ? null : {at: drift(s, [[144, 0.12, 1.1, -0.22], [220, 0.5, 1.28, -0.2], [300, 0.45, 1.95, -0.2], [748, 0.15, 2.0, -0.2], [842, 0.2, 1.7, -0.2]], 2), deg: 25 * ((s - 140) / 30) + 20};
  const tissue: Prop | null = s < 144 ? null : {at: drift(s, [[144, 0.15, 1.05, -0.22], [220, 0.7, 1.9, -0.2], [300, 0.65, 2.05, -0.2], [748, 0.55, 1.95, -0.2], [842, 0.6, 1.8, -0.2]], 3), deg: -18 * ((s - 140) / 30)};
  return {
    ...m, feet: [fx, 0, FEET0[2]], lift, roll, rise, ...fc, grip, phoneHeld: s < 140, crouchAdd: dip * 0.1, phone, pen, tissue,
    light: lightAt(s), display: String(counterOf(fallY(s))), bell: 0.3,
  };
};

// ---------------------------------------------------------------- B05 after the rewind: frame 0, then the settle, the slide, the press, the hold
/** Plan at composition frame G >= 1340 (the rewind has ended at frame 0): stand to G1544, slide-sit to G1574, reach-press G1676-1724, lean back from G1728. */
export const SEAT: V3 = [-0.44, 0, -0.4];
export type Seated = Plan & {reach: number; seat: number};
export const afterAt = (g: number): Seated => {
  const base = planAt(0);
  const seat = seg(g, 1544, 1574), phoneKnee = g >= 1564;
  const reach = g < 1676 ? 0 : g < 1688 ? seg(g, 1676, 1688) : g < 1700 ? 1 : 1 - seg(g, 1700, 1724);
  const face: ExpressionId = g < 1341 ? 'neutral' : g < 1347 ? 'surprised' : g < 1520 ? 'neutral' : g < 1564 ? 'neutral' : g < 1700 ? 'tired' : g < 1712 ? 'neutral' : g < 1750 ? 'tired' : 'relieved';
  const feet: V3 = [lerp(FEET0[0], SEAT[0], seg(g, 1544, 1560)), 0, lerp(FEET0[2], SEAT[2], seg(g, 1544, 1560))];
  const rise = g < 1520 ? 0 : 0.3 * (1 - seg(g, 1520, 1535));
  const dipK = g < 1520 ? 0 : 0.25 * (1 - seg(g, 1520, 1535)); // knees dipped 0.15 m after the catch, easing out
  const light = 1;
  const press = g >= 1688 ? 0.4 * seg(g, 1688, 1692) : 0;
  const bell = g < 1600 ? 0.3 : 0.3 + press;
  return {
    ...base, a: 'P10', b: g < 1544 ? 'P10' : 'P33', k: seat, feet, rise, face, crouchAdd: dipK + 0.5 * seat, phoneHeld: !phoneKnee, light, bell, reach, seat,
    nod: g >= 1728 ? [0, 0.12 * seg(g, 1728, 1745)] : undefined,
    display: '20',
  };
};

// ---------------------------------------------------------------- painting
export type PaintOpts = {
  /** Camera-space origin offset of CAR space (the car floor in SHAFT space): the figure stands at feet + `origin`. Default the car interior. */
  origin?: V3;
  /** Show the ground contact shadow (default true; false in section where the car glow carries it). */
  shadow?: boolean;
  /** Animation clock in seconds (blink, hair sway). */
  t: number;
  /** Which body parts to hold the hand to: grip and bell points in the same offset space are added by `origin`. */
  reach?: number;
  /** Seat sink 0..1 (G1544-1574): the hips at SEAT. */
  seat?: number;
  /** Picture-px correction of the grip and bell targets (set by the probe pass of `paintWoman`, so the fist lands on the world point). */
  adj?: {grip?: Pt; bell?: Pt};
  /** Absolute picture targets of the floating hands (probe pass). */
  floatArms?: {r: Pt; l: Pt};
};
const add = (a: V3, o: V3): V3 => [a[0] + o[0], a[1] + o[1], a[2] + o[2]];
const lerpPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/** Draw the WOMAN of a plan through `cam` at `origin`. Returns the anchors (rolled). The float is the zero-g drift (offset and roll), mixed in by the weight of P46. */
const paintWomanOnce = (p: Painter, cam: YCam, pl: Plan & {reach?: number}, o: PaintOpts): FigAnchors | null => {
  const org = o.origin ?? [0, 0, 0];
  const at = add(pl.feet, org), g0 = camPoint(cam, at);
  if (!g0) return null;
  const def: CastDef = woman(pl.rise, true), u = camUnit(cam, at), view = 'front' as const;
  const face = {...EXPRESSIONS[pl.face], ...(pl.faceState ?? {})} as FaceState;
  // the float weight: share of P46 in the blend
  const wf = (pl.a === 'P46' ? 1 - pl.k : 0) + (pl.b === 'P46' ? pl.k : 0);
  const L = layerMotion({person: def, motion: 'zero-g-drift', t: o.t, g: g0 as Pt, unit: u, view, pose: 'P46', expression: pl.face});
  const mixed = poseMix(pl.a, pl.b, pl.k, def, g0 as Pt, u, view) as unknown as FigPose;
  // pure float: the drift pose, but the arms stay on the P46 mix so they never snap down to the feet (user note, B03-SH03 jump frame)
  const body: Partial<FigPose> = wf >= 1 ? {...(L.pose as FigPose), lArm: mixed.lArm, rArm: mixed.rArm} : {...mixed};
  const gx = g0[0] + (L.g[0] - g0[0]) * wf, gy = g0[1] + (L.g[1] - g0[1]) * wf - pl.lift * u;
  const gp: Pt = [gx, gy];
  const roll = pl.roll + L.roll * wf;
  const fp = {...body, view, face, noShadow: true} as FigPose;
  if (pl.crouchAdd) fp.crouch = Math.min(1, (fp.crouch ?? 0) + pl.crouchAdd);
  if (pl.nod) fp.nod = pl.nod;
  if (pl.phoneHeld) fp.rHold = {kind: 'phone'}; else if (fp.rHold) fp.rHold = undefined;
  if (o.seat !== undefined && o.seat > 0 && !pl.phoneHeld) fp.lHold = {kind: 'phone'};
  // the arms follow the body drift: shift picture targets by the drift of the ground point
  const shift: Pt = [gp[0] - g0[0], gp[1] - g0[1]];
  if (wf < 1 && (shift[0] || shift[1])) for (const k of ['rArm', 'lArm'] as const) { const a = fp[k]; if (a) fp[k] = {...a, to: [a.to[0] + shift[0], a.to[1] + shift[1]], via: a.via && [a.via[0] + shift[0], a.via[1] + shift[1]]}; }
  // float arms (`o.floatArms`, measured by the probe pass): hands lifted to belly height and out a little, so a hand never touches a foot (user note, B03-SH03)
  if (o.floatArms && wf > 0) for (const k of ['rArm', 'lArm'] as const) { const t = k === 'rArm' ? o.floatArms.r : o.floatArms.l, a = fp[k]; if (!(k === 'rArm' && pl.grip > 0.5)) fp[k] = a && wf < 0.5 ? {...a, to: lerpPt(a.to, t, wf * 2), via: undefined} : {to: t, out: k === 'rArm' ? -1 : 1}; }
  // right-hand grip on the rail: blend the pose's hand target to the world point
  const gripW = camPoint(cam, add(GRIP, org)) as Pt | null, gripPx: Pt | null = gripW && o.adj?.grip ? [gripW[0] + o.adj.grip[0], gripW[1] + o.adj.grip[1]] : gripW;
  if (pl.grip > 0 && gripPx && fp.rArm) fp.rArm = {...fp.rArm, to: lerpPt(fp.rArm.to, gripPx, pl.grip), via: fp.rArm.via && lerpPt(fp.rArm.via, gripPx, pl.grip * 0.4), out: -1};
  else if (pl.grip > 0 && gripPx) fp.rArm = {to: gripPx, out: -1};
  // seated: left hand on the left knee with the phone, right hand in the lap, reach-press toward the bell
  if (o.seat !== undefined && o.seat > 0) {
    const bellW = camPoint(cam, add(BELL, org)) as Pt | null, bellPx: Pt | null = bellW && o.adj?.bell ? [bellW[0] + o.adj.bell[0], bellW[1] + o.adj.bell[1]] : bellW, rk = o.reach ?? 0;
    if (fp.rArm && bellPx && rk > 0) fp.rArm = {...fp.rArm, to: lerpPt(fp.rArm.to, bellPx, rk), via: undefined, out: -1};
  }
  if (o.shadow !== false) { const fl = camPoint(cam, at) as Pt; washAt(p, 9800, '#14181c', 55 * Math.max(0.4, 1 - pl.lift * 2), ell(fl[0], fl[1], 0.3 * u, 0.055 * u, 16), 0.15, 0.2); }
  const pivot = pl.grip > 0.5 && gripPx && pl.roll ? gripPx : roll ? hipAnchor(def, gp, u, fp) : gp;
  let a!: FigAnchors;
  withRoll(p, pivot, roll, () => { a = drawFigure(p, def, gp, u, fp, o.t, def.seed); });
  return rollAnchors(a, pivot, roll);
};

const NOOP = new Proxy({}, {get: () => () => {}}) as Brush;
/** `paintWomanOnce` plus a probe pass: where the fist is held to the rail or the bell, a silent first pass measures where the fist lands (arm and hand geometry
 * put it a few px off the target) and the real pass shifts the target by that error, so contact is exact (rail +-2 px, bell +-6 px, sheet acceptance). */
export const paintWoman = (p: Painter, cam: YCam, pl: Plan & {reach?: number}, o: PaintOpts): FigAnchors | null => {
  const wf = (pl.a === 'P46' ? 1 - pl.k : 0) + (pl.b === 'P46' ? pl.k : 0);
  if (wf > 0 && !o.floatArms) { // probe: where the plain arms hang, then lift the hands to 60 % of that drop and 30 % of it outward
    const a0 = paintWomanOnce(makePainter(NOOP, {t: o.t, frame: 0}), cam, pl, {...o, adj: o.adj ?? {}});
    if (a0) {
      const H = a0.feet[1] - a0.rShoulder[1], mk = (sh: Pt, sg: number): Pt => [sh[0] + sg * 0.1 * H, sh[1] + 0.47 * H];
      return paintWoman(p, cam, pl, {...o, floatArms: {r: mk(a0.rShoulder, -1), l: mk(a0.lShoulder, 1)}});
    }
  }
  const reach = o.seat !== undefined && o.seat > 0 && (o.reach ?? 0) > 0;
  if (o.adj || (pl.grip <= 0.5 && !reach)) return paintWomanOnce(p, cam, pl, o);
  const org = o.origin ?? [0, 0, 0], tgt = camPoint(cam, add(reach ? BELL : GRIP, org)) as Pt | null;
  const a0 = tgt ? paintWomanOnce(makePainter(NOOP, {t: o.t, frame: 0}), cam, pl, o) : null;
  if (!tgt || !a0) return paintWomanOnce(p, cam, pl, o);
  const adj: Pt = [tgt[0] - a0.rHand[0], tgt[1] - a0.rHand[1]];
  return paintWomanOnce(p, cam, pl, {...o, adj: reach ? {bell: adj} : {grip: adj}});
};

/** Props (phone, pen, tissue) adrift through the camera, offset by the car origin. */
export const paintProps = (p: Painter, cam: YCam, pl: Plan, org: V3 = [0, 0, 0]) => {
  if (pl.phone) paintPhone(p, cam, add(pl.phone.at, org), pl.phone.deg);
  if (pl.pen) paintPen(p, cam, add(pl.pen.at, org), pl.pen.deg);
  if (pl.tissue) paintTissue(p, cam, add(pl.tissue.at, org), pl.tissue.deg);
};

export type InteriorOpts = {front?: boolean; indicator?: boolean; figure?: boolean; wide?: boolean};
/** The whole interior at composition frame G (SET-CAR + WOMAN + props), for every interior shot, the frozen frame and the rewind. Returns the figure anchors. */
export const paintInterior = (p: Painter, cam: YCam, g: number, o: InteriorOpts = {}): FigAnchors | null => {
  const after = g >= REWIND.end;
  const rewinding = g >= REWIND.start && g < REWIND.end;
  const s = after ? 0 : poseFrameAt(g);
  const pl: Seated = after ? afterAt(g) : {...planAt(s, rewinding), reach: 0, seat: 0};
  const t = after ? (g - REWIND.end) / 30 : s / 30;
  const carLight = after ? 1 : lightAt(s);
  paintCar(p, cam, {light: carLight, display: pl.display, bell: pl.bell, front: o.front, back: o.front ? false : true, indicator: o.indicator ? pl.display : undefined});
  if (o.figure === false) return null;
  const a = paintWoman(p, cam, pl, {t, reach: pl.reach, seat: pl.seat});
  paintProps(p, cam, pl);
  return a;
};
void poseFor;

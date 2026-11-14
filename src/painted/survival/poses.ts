import {BONE, shoulderPoint, type Arm, type CastDef, type FigPose} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import type {Pt} from '../kit/painter';
import type {AnyPoseId, PoseBody} from '../kit/poses';
import {poseBody} from '../kit/poses';

// EDU-EP16..18 series poses and faces (N16-13, N18-09; Boss, 14 Nov 2026). Designed from the beat first, then matched to the pose sheet P01-P45
// (docs/character-proportion-principles.md#cp-p-pose-sheet, CP-P12); the casting line of each is named below. They are series poses on the kit rig
// (no kit file is edited): a hand-target table in metres from the shoulder of the POSED body, converted to the rig's `Arm` px with `shoulderPoint`, exactly as
// the kit's own `poseArms` does. Kit intake (KIT-P01) may file them as P47+ at delivery. Hands stay the kit's plain mittens (UT14); CP-P08 elbow outside the
// neck line, CP-P09 hand no larger than 1.3x, CP-P10 elbows back for the chest poses (`behind: 'upper'`).
//
//   mime-stir   = P11 (hand offered out low) + P10 hands meeting: the left palm held out cupping the seeds, the right hand circling over it (2 loops).        EP16 sh9
//   rub-hand    = P11 (hand offered out low) + P42 hunch: the left hand held out, the right hand rubbing its back; head down.                                    EP16 sh7
//   arms-wide   = P05 on both sides + P08 lift: both arms out and up, 110 deg from hanging, a small rise on the chest (ta-da).                                  EP16 sh13
//   belly-lie   = P37 lie-on-side, lower arm under the head as P37, upper arm bent across the belly (clutching).                                              EP18 sh4
//   cup-offer   = P34 kneel (the right arm resting as P34) + P18 offer cup: the left arm out toward the other person with the hand at his mouth height.          EP18 sh19
//   point-up    = P05 (arm out) raised: one arm straight out along the aim line, finger pointing, `aim` degrees above level (default 31), the other arm hanging.   EP16 sh8 (N16-18)
//   sip-lean    = P33 floor-sit hug (far arm round the shin) + P19 sip: the near arm up to the cup, the body leaning in a little.                              EP18 sh19

export const SURV_POSE_IDS = ['mime-stir', 'rub-hand', 'arms-wide', 'belly-lie', 'cup-offer', 'sip-lean', 'point-up'] as const;
export type SurvPoseId = (typeof SURV_POSE_IDS)[number];
type Tgt = {to: Pt; via: Pt; behind?: Arm['behind']};
type Side = 'r' | 'l';
type View3 = 'front' | 'left' | 'right';

export type SurvPoseSpec = {
  name: string; description: string;
  /** The kit pose it is built from (arms and body), for the casting line and kit intake. */
  base: AnyPoseId; face: ExpressionId;
  views: View3[];
  body: PoseBody | ((dir: 1 | -1, k: number) => PoseBody);
  /** Hand targets (m from the shoulder of the posed body; x toward screen right in front view, toward the facing side in profile, y up); `ph` = cycles of the loop, `k` 0..1 the amount. `dir` is the screen side the other person is on. */
  arms: (ph: number, k: number, dir: 1 | -1, aim?: number) => Record<Side, Tgt>;
  /** Seconds of one loop of `ph` per cycle (for motions that repeat), absent = no loop. */
  loopHz?: number;
};

const CHEST_R = {x: 0, y: -0.2};
const fk = (a1: number, a2: number, mirror: boolean): Tgt => {
  const s = mirror ? -1 : 1, r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const via: Pt = [s * BONE * Math.sin(r1), -BONE * Math.cos(r1)];
  return {via, to: [via[0] + s * BONE * Math.sin(r2), via[1] - BONE * Math.cos(r2)]};
};
const hang = (side: Side): Tgt => ({to: [side === 'r' ? -0.045 : 0.045, -0.518], via: [side === 'r' ? -0.023 : 0.023, -0.259]});
const mix = (a: Tgt, b: Tgt, k: number): Tgt => ({to: [a.to[0] + (b.to[0] - a.to[0]) * k, a.to[1] + (b.to[1] - a.to[1]) * k], via: [a.via[0] + (b.via[0] - a.via[0]) * k, a.via[1] + (b.via[1] - a.via[1]) * k], behind: b.behind});

export const SURV_POSES: Record<SurvPoseId, SurvPoseSpec> = {
  'mime-stir': {
    name: 'mime_stir', base: 'P11', face: 'smug', views: ['front'], loopHz: 1.7,
    description: 'Left hand held out low at the side with the palm cupped (the seeds, the pot), right hand circling over it as if stirring (two loops). Front. Pair with `smug`.',
    body: {nod: [0, -0.05]},
    arms: (ph) => ({
      l: {to: [0.2, -0.2], via: [0.15, -0.3]},
      r: {to: [0.2 + 0.055 * Math.cos(ph * 6.2832), -0.07 + 0.035 * Math.sin(ph * 6.2832)], via: [0.0, -0.22]},
    }),
  },
  'rub-hand': {
    name: 'rub_hand', base: 'P11', face: 'ouch', views: ['front'], loopHz: 2.2,
    description: 'The left hand held out low and still, the right hand rubbing across the back of it; shoulders a little hunched, head bowed. Front. Pair with `ouch` then `sad`.',
    body: {rise: -0.02, nod: [0, -0.12]},
    arms: (ph) => ({
      l: {to: [0.16, -0.19], via: [0.15, -0.3]},
      r: {to: [0.16 + 0.07 * Math.cos(ph * 6.2832), -0.12 + 0.015 * Math.sin(ph * 6.2832)], via: [-0.02, -0.25]},
    }),
  },
  'arms-wide': {
    name: 'arms_wide_tada', base: 'P08', face: 'happy', views: ['front'],
    description: 'Both arms thrown out and up (hands 25 deg above level), chest up: "ta-da". `k` 0..1 opens the arms from hanging; use `k` for the swing (about 21 f). Front.',
    body: (_d, k) => ({rise: 0.015 * k, nod: [0, 0.08 * k]}),
    arms: (_ph, k) => ({r: mix(hang('r'), fk(110, 128, true), k), l: mix(hang('l'), fk(110, 128, false), k)}),
  },
  'belly-lie': {
    name: 'belly_lie', base: 'P37', face: 'sad', views: ['front'],
    description: 'Lying on one side (P37, head to the left), lower arm under the head, upper arm bent across the belly, hand clutching. Front. Pair with `sad` or `tired`.',
    body: {lie: 1},
    arms: () => ({r: {via: [-0.199, 0.167], to: [-0.024, 0.218]}, l: {via: [0.12, -0.18], to: [0.0, -0.3]}}),
  },
  'cup-offer': {
    name: 'cup_offer_kneel', base: 'P34', face: 'worried', views: ['front'],
    description: 'Kneeling upright (P34), the left arm out toward the other person with the hand at his mouth height holding a cup (`paintCupOffered`), the right hand on the thigh. `dir` +1 = he is on the screen right. Front.',
    body: {kneel: 1},
    arms: (_ph, k, dir) => {
      const out: Tgt = {via: [0.15 * dir, -0.24], to: [0.34 * dir, -0.06]};
      const restR: Tgt = {via: [0.01, -0.26], to: [0.045, -0.5]}, restL: Tgt = {via: [-0.01, -0.26], to: [-0.045, -0.5]};
      // the arm on his side offers: with him on the screen right that is the character's left arm
      return dir > 0 ? {l: mix(restL, out, k), r: restR} : {r: mix(restR, out, k), l: restL};
    },
  },
  'point-up': {
    name: 'point_up', base: 'P05', face: 'surprised', views: ['front', 'left', 'right'],
    description: 'Pointing at something above: the arm on the `dir` side thrown out straight along the line to the target (`aim` degrees above level, default 31), finger extended, the other arm hanging. `k` 0..1 raises it from hanging (use ~8 f). `dir` +1 = the target is on the screen right (profile: toward the facing side). Pair with `surprised`.',
    body: {},
    arms: (_ph, k, dir, aim = 31) => {
      const e = (aim * Math.PI) / 180, L = 2 * BONE * 0.985, to: Pt = [dir * L * Math.cos(e), L * Math.sin(e)], via: Pt = [to[0] * 0.5, to[1] * 0.5 - 0.012];
      const out: Tgt = {to, via};
      // front view: the arm on the target side is the character's LEFT when the target is on the screen right (dir +1); profile views use the near arm ('r' = the facing side's arm)
      return dir > 0 ? {l: mix(hang('l'), out, k), r: hang('r')} : {r: mix(hang('r'), out, k), l: hang('l')};
    },
  },
  'sip-lean': {
    name: 'sip_lean', base: 'P33', face: 'tired', views: ['front'],
    description: 'Sitting on the ground (P33), leaning in toward the cup held by another person: the arm on his side up with the hand at the cup, the other arm round the shin; head bowed to the rim. `dir` +1 = the cup is on the screen right. Front.',
    body: (dir, k) => ({floorSit: 1, nod: [0.08 * dir * k, -0.1 * k]}),
    arms: (_ph, _k, dir) => {
      const cupArm: Tgt = {via: [0.2 * dir, -0.03], to: [0.1 * dir, 0.09]}, hug: Tgt = dir > 0 ? {via: [-0.125, -0.3], to: [-0.055, -0.17]} : {via: [0.125, -0.3], to: [0.055, -0.17]};
      return dir > 0 ? {l: cupArm, r: hug} : {r: cupArm, l: hug};
    },
  },
};

/** Series faces (state over a kit expression): `guilty-smile` = `tired` eyes and bags with a small smile, brows worried, eyes glancing aside (EP18 sh12). Use as `{face: 'tired', faceState: SURV_FACES['guilty-smile']}`. */
export const SURV_FACES: Record<'guilty-smile', Partial<FaceState>> = {
  'guilty-smile': {brow: 'worry', eyes: 'half', look: [0.7, 0.45], mouth: 'smile', squint: 0.35, bags: 1, sweat: true},
};

/**
 * The `FigPose` fields (body, arms in plate px) of a series pose for `def` standing at plate ground point `g`, `unit` px per metre, in `view`. `ph` loops (cycles; see `loopHz`),
 * `k` 0..1 the amount (arms-wide opening, cup-offer reach, sip lean), `dir` the screen side of the other person (cup poses).
 */
export const survPoseFig = (id: SurvPoseId, def: CastDef, g: Pt, unit: number, o: {view?: View3; ph?: number; k?: number; dir?: 1 | -1; /** point-up: degrees above level of the aim line */ aim?: number} = {}): Partial<FigPose> & {view: View3} => {
  const sp = SURV_POSES[id], view = o.view && sp.views.includes(o.view) ? o.view : sp.views[0], dir = o.dir ?? 1, k = o.k ?? 1;
  const body = typeof sp.body === 'function' ? sp.body(dir, k) : sp.body, t = sp.arms(o.ph ?? 0, k, dir, o.aim), ak = def.armScale ?? 1;
  const arm = (side: Side): Arm => {
    const sh = shoulderPoint(def, g, unit, {view, ...body}, side), a = t[side];
    const px = (q: Pt): Pt => [sh[0] + q[0] * ak * unit, sh[1] - q[1] * ak * unit];
    return {to: px(a.to), via: px(a.via), behind: a.behind, ...(id === 'point-up' && a.to !== undefined && Math.hypot(a.to[0], a.to[1]) > 0.3 ? {finger: true} : {})};
  };
  return {view, ...body, rArm: arm('r'), lArm: arm('l')};
};
export {poseBody};

// ---- N16-21: the laugh bounce. The draft passed `fig: {lean: 5 * sin(..)}`; the kit's `lean` is in RADIANS (upper body rotated about the hip), so 5 meant up to 286 deg and the head drew at ground level.
/** Largest upper-body lean (rad, 9 deg) any series motion may ask of the kit; `laughFig` clamps to it. */
export const MAX_LEAN = 0.16;
export const safeLean = (rad: number): number => Math.max(-MAX_LEAN, Math.min(MAX_LEAN, rad));
/** The laugh shoulder bounce as `FigPose` fields: `t` seconds since the laugh began, `amp` degrees of lean (default 4, Film's "lean <= 4 deg"), `hz` bounces per second (default 2); `rise` lifts the chest a hair on each bounce. Pair with the kit face `laugh`. */
export const laughFig = (t: number, o: {amp?: number; hz?: number} = {}): {lean: number; rise: number} => {
  const a = ((o.amp ?? 4) * Math.PI) / 180, w = 2 * Math.PI * (o.hz ?? 2) * Math.max(0, t);
  return {lean: safeLean(a * Math.sin(w)), rise: 0.008 * Math.abs(Math.sin(w))};
};

/** Degrees above level and screen side of the line from a shoulder to a target, both in picture px (y down): the `aim` and `dir` of `point-up`. */
export const aimFromPx = (shoulder: Pt, target: Pt): {aim: number; dir: 1 | -1} => ({aim: (Math.atan2(shoulder[1] - target[1], Math.abs(target[0] - shoulder[0])) * 180) / Math.PI, dir: target[0] >= shoulder[0] ? 1 : -1});

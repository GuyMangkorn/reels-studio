import {BONE, bodyFrame, drawFigure, ikElbow, shoulderPoint, type Arm, type CastDef, type FigAnchors, type FigPose, type Prop} from '../kit/cast';
import {capsule, INK, inkLine, solid} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {PoseBody} from '../kit/poses';
import {dressTravel, paintBackpack, paintTravelGear, type TravelOutfitId} from '../kit/wardrobe-travel';

// EDU-EP18-SHORT GIRL (brief VD02; user-approved look Q1, 15 Nov 2026): kit `woman-long` unchanged (head, height 1.64 m, seed 820),
// dressed per chapter with the travel outfits of `kit/wardrobe-travel.ts`, plus the six new poses of brief N6. The poses are episode
// code until kit intake (KIT-P01 at W8.4: candidates for `poses-more.ts`, CP-P12); they are authored like the kit body poses: arm
// targets in metres from the POSED shoulder (`shoulderPoint`), front view x toward screen right, profile x toward the facing side.
//
// Casting lines (brief VD02): `woman-long + new: travel-safari, P10, happy` (Africa), `+ new: life-vest` (canoe),
// `+ backpack` (gate), `woman-long + home-lounge (cardigan off), P37, relieved` (bed).

export const GIRL_BASE: CastDef = PEOPLE['woman-long'];
export const GIRL: Record<TravelOutfitId, CastDef> = {
  'travel-safari': dressTravel(GIRL_BASE, 'travel-safari'),
  'life-vest': dressTravel(GIRL_BASE, 'life-vest'),
  'travel-backpack': dressTravel(GIRL_BASE, 'travel-backpack'),
  'home-lounge-night': dressTravel(GIRL_BASE, 'home-lounge-night'),
};

export const GIRL_POSE_IDS = ['paddle-sit', 'selfie-peace', 'swat-neck', 'frozen-hand', 'step-freeze', 'sit-up-phone'] as const;
export type GirlPoseId = (typeof GIRL_POSE_IDS)[number];

type ArmT = {to: Pt; via: Pt; behind?: Arm['behind']; toCam?: number};
type ViewSpec = {body: PoseBody & Pick<FigPose, 'legKick' | 'seated' | 'walk' | 'stride'>; r?: ArmT; l?: ArmT; rHold?: Prop; lHold?: Prop};
export type GirlPoseSpec = {
  description: string;
  face: ExpressionId;
  /** Shots that use it (brief untimed shot list). */
  shots: string;
  front?: ViewSpec;
  side?: ViewSpec;
};

const a = (to: Pt, via: Pt, behind?: Arm['behind']): ArmT => ({to, via, ...(behind ? {behind} : {})});
const phone: Prop = {kind: 'phone'};

/**
 * The six N6 poses. `paddle-sit` takes its hands from the paddle grips (`paddleSitArms`); its table entry only sets the body (seated in
 * the hull: `seated` hides the legs, which lie forward along the floor under the gunwale).
 */
export const GIRL_POSES: Record<GirlPoseId, GirlPoseSpec> = {
  'paddle-sit': {
    description: 'Seated on the canoe floor, legs forward under the gunwale (not drawn), both mitten hands on the paddle shaft, elbows in depth; hands come from the paddle grips (paddleSitArms). Front (squared, canoe heading 135) and profile (heading 90).',
    face: 'neutral', shots: 'B01-SH01, B01-SH02, B01-SH03',
    front: {body: {sit: 1, seated: true}}, side: {body: {sit: 1, seated: true}},
  },
  'selfie-peace': {
    description: 'Right arm raised out to the side and forward holding the phone up at head height (forearm foreshortened toward the lens), left hand in a V beside the cheek (painted V over the mitten), head tipped toward the V. Front.',
    face: 'happy', shots: 'B02-SH01',
    front: {body: {nod: [-0.04, 0]}, r: a([-0.24, 0.1], [-0.14, -0.08]), l: a([0.075, 0.165], [0.165, -0.085]), rHold: phone},
  },
  'swat-neck': {
    description: 'Left hand slaps the side of the neck without looking up, elbow out; head stays down over the phone held at the chest in the right hand (P10 one-handed). Front.',
    face: 'smug', shots: 'B02-SH03',
    front: {body: {nod: [0, -0.12]}, r: a([0.086, -0.202], [-0.014, -0.251], 'upper'), l: a([0.0, 0.07], [0.19, -0.09]), rHold: phone},
  },
  'frozen-hand': {
    description: 'Right hand stopped mid-reach at hip height toward the dog, forearm toward the lens (elbow back), shoulders up; left arm hangs a little out. Front.',
    face: 'scared', shots: 'B03-SH02',
    front: {body: {rise: 0.03}, r: a([-0.17, -0.3], [-0.06, -0.24], 'upper'), l: a([0.11, -0.48], [0.05, -0.25])},
  },
  'step-freeze': {
    description: 'Walking toward the lens, frozen mid-step: front-view walk phase 0.3 (one foot lifted), arms slightly out from the sides, shoulders up. Front.',
    face: 'scared', shots: 'B04-SH02',
    front: {body: {rise: 0.02, walk: 0.3, stride: 0.8}, r: a([-0.15, -0.47], [-0.07, -0.245]), l: a([0.15, -0.47], [0.07, -0.245])},
  },
  'sit-up-phone': {
    description: 'Sitting up in bed against the wall, knees up (floorSit), both hands on the phone at the chest, elbows back (P10 arms on the seated body). Front.',
    face: 'neutral', shots: 'B06-SH01, B06-SH03, B06-SH04, B06-SH05',
    front: {body: {floorSit: 1}, r: a([0.086, -0.202], [-0.014, -0.251], 'upper'), l: a([-0.086, -0.202], [0.014, -0.251], 'upper'), rHold: phone},
  },
};

/** Views each pose has. */
export const girlPoseViews = (id: GirlPoseId): FigPose['view'][] => [...(GIRL_POSES[id].front ? ['front' as const] : []), ...(GIRL_POSES[id].side ? ['left' as const, 'right' as const] : [])];

/** FigPose fields of a girl pose for a view (arms hung from the posed shoulders). `paddle-sit` returns the body only. */
export const girlPose = (id: GirlPoseId, def: CastDef, g: Pt, unit: number, view: FigPose['view'] = 'front'): Omit<FigPose, 'face'> => {
  const spec = GIRL_POSES[id], vs = view === 'front' ? spec.front : spec.side;
  if (!vs) throw new Error(`${id} has no ${view} view`);
  const dir = view === 'left' ? -1 : 1, profile = view !== 'front';
  const body = vs.body;
  const arm = (side: 'r' | 'l', t?: ArmT): Arm | undefined => {
    if (!t) return undefined;
    const sh = shoulderPoint(def, g, unit, {view, ...body}, side), k = (profile ? dir : 1) * unit;
    return {to: [sh[0] + t.to[0] * k, sh[1] - t.to[1] * unit], via: [sh[0] + t.via[0] * k, sh[1] - t.via[1] * unit], ...(t.behind ? {behind: t.behind} : {}), ...(t.toCam ? {toCam: t.toCam} : {})};
  };
  return {view, ...body, rArm: arm('r', vs.r), lArm: arm('l', vs.l), rHold: vs.rHold, lHold: vs.lHold, ...(profile ? {farArmUnder: true} : {})};
};

/** Rig sit hip height for the seated paddler (m above the ground point), for `seatGround` in `kit/canoe.ts`. */
export const sitHipV = (def: CastDef, view: FigPose['view']) => bodyFrame(def, {view, sit: 1}).hipV;

/**
 * Arms on the paddle: the hands on the two grip points (px), elbows by two-bone IK (down and out in the front view, down and back in
 * profile). `side` is the hull side the blade is on (+1 her right): the lower hand is that side's hand, the top hand the other.
 */
export const paddleSitArms = (def: CastDef, g: Pt, unit: number, view: FigPose['view'], grips: {top: Pt; lower: Pt}, side: 1 | -1 = 1): Pick<FigPose, 'rArm' | 'lArm'> => {
  const body = GIRL_POSES['paddle-sit'].front!.body, L = BONE * (def.armScale ?? 1) * unit;
  const lowerSide = side === 1 ? 'r' : 'l', topSide = side === 1 ? 'l' : 'r';
  const solve = (s: 'r' | 'l', T: Pt): Arm => {
    const S = shoulderPoint(def, g, unit, {view, ...body}, s);
    const out = view === 'front' ? (s === 'r' ? -1 : 1) : view === 'left' ? 1 : -1;
    return {to: T, via: ikElbow(S, T, L, out)};
  };
  const arms = {[lowerSide]: solve(lowerSide, grips.lower), [topSide]: solve(topSide, grips.top)} as Record<'r' | 'l', Arm>;
  return {rArm: arms.r, lArm: arms.l};
};

/** Two raised fingers (peace V) over the mitten at `hand` px: index and middle, 0.055 m, spread about 24 degrees, tilted by `tilt` rad. */
export const paintPeaceV = (p: Painter, hand: Pt, unit: number, skin: string, seed = 8650, tilt = 0.15) => {
  const L = 0.07 * unit, w = 0.015 * unit;
  [-0.3, 0.3].forEach((da, i) => {
    const ang = -Math.PI / 2 + tilt + da, base: Pt = [hand[0] + Math.cos(ang) * 0.02 * unit + (i ? 0.006 : -0.006) * unit, hand[1] + Math.sin(ang) * 0.02 * unit];
    const tip: Pt = [base[0] + Math.cos(ang) * L, base[1] + Math.sin(ang) * L];
    const f = capsule(base, tip, w, w * 0.9, 6);
    solid(p, seed + i * 2, skin, f, 3);
    inkLine(p, seed + i * 2 + 1, f, {weight: 0.7, curve: 0.2, color: mixColor(skin, INK, 0.6)});
  });
};

/** Draw the girl in an outfit and pose with a named face; returns the anchors (travel gear and the V painted on top). */
export const drawGirl = (p: Painter, outfit: TravelOutfitId, g: Pt, unit: number, pose: Omit<FigPose, 'face'>, face: ExpressionId, t: number, seed = GIRL_BASE.seed, o: {peace?: boolean} = {}): FigAnchors => {
  const def = GIRL[outfit], fig: FigPose = {...pose, face: EXPRESSIONS[face]};
  if (outfit === 'travel-backpack') paintBackpack(p, def, g, unit, fig, 'behind', seed * 10 + 5);
  const an = drawFigure(p, def, g, unit, fig, t, seed);
  if (outfit === 'travel-backpack') paintBackpack(p, def, g, unit, fig, 'over', seed * 10 + 5);
  paintTravelGear(p, outfit, def, an, fig, unit, seed * 10 + 7);
  if (o.peace) paintPeaceV(p, an.lHand, unit, def.head.skin, seed * 10 + 3);
  return an;
};

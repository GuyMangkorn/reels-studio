// Pose library: the user's pose sheet P01-P30 as hand targets for the painted kit rig, its profile versions, and the new body
// poses P31+ (sit, kneel, lie, run, fall, cower...; `poses-more.ts`). Rules: docs/character-proportion-principles.md#cp-p-pose-sheet
// (CP-P08..CP-P11). The sheet's shoulder_deg and
// elbow_bend_deg are not rig inputs (CP-P11). Boss converted each arm once: two-bone forward kinematics with the rig's
// bone (BONE, 0.26 m) from the shoulder anchor, then checked against the picture (pose-sheet picture in the asset store).
// Where the sheet's angle sign or side did not match the picture, the picture decides (notes per pose). Chest-holding
// poses (CP-P10: P10, P17, P25, P26, P28) use the elbows-back rule (CP-P02): behind:'upper', the elbow just inside the
// torso edge, within one bone of the shoulder (so level with or just below the hand). Props: only the rig's Prop kinds (phone); other props are listed as missing.
//
// Targets are metres from each shoulder anchor (u toward screen right, v up), so one table serves every CastDef
// (height and outfit change the anchor). `poseArms` maps them to the Arm fields of drawFigure (plate px). The P01-P30 table
// below is the front view, standing; their profile versions are PROFILE_ARMS in poses-more.ts (P14 has none).
//
// Picking a pose (Film, Mark, Editor): by ID. `ALL_POSE_IDS` lists every pose, `POSE_INFO[id]` its name, one-line description,
// views it exists in and the expression that suits it. `poseFor(id, def, g, unit, view)` returns everything a FigPose needs
// from the pose (body fields, arms, held props): `{face, ...poseFor('P31', def, g, unit, 'right')}`. `poseMix` blends two poses.
import type {Arm, CastDef, FigPose, Prop} from './cast';
import {H, childHangExtra, shoulderPoint} from './cast';
import type {ExpressionId} from './expressions';
import type {Pt} from './painter';
import {BODY_POSES, BODY_POSE_IDS, HANG_SIDE, PROFILE_ARMS, toCamera, type BodyPoseId, type PoseBody, type SideArms, type View} from './poses-more';

export type {BodyPoseId, PoseBody, SideArms, View};
export {BODY_POSE_IDS};

export const POSE_IDS = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21', 'P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29', 'P30'] as const;
export type PoseId = (typeof POSE_IDS)[number];

/** One arm: hand target and authored elbow (`via`), metres from the shoulder anchor; `behind`, `toCam` and `finger` as Arm. */
export type ArmTarget = {to: Pt; via: Pt; behind?: Arm['behind']; toCam?: number; finger?: boolean};
export type PoseSpec = {name: string; r: ArmTarget; l: ArmTarget; rHold?: Prop; lHold?: Prop; missing?: string};

const a = (to: Pt, via: Pt, behind?: Arm['behind']): ArmTarget => ({to, via, behind});

export const POSES: Record<PoseId, PoseSpec> = {
  P01: {name: 'idle_arms_down', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([0.045, -0.518], [0.023, -0.259])}, // hang: FK both arms (CP-P05)
  P02: {name: 'thinking_hand_chin', r: a([0.134, 0.012], [0.089, -0.244]), l: a([-0.329, -0.058], [-0.130, -0.226])}, // R FK (hand under the chin); L FK (crosses under the R elbow)
  P03: {name: 'arms_crossed', r: a([0.280, -0.103], [0.067, -0.251]), l: a([-0.280, -0.103], [-0.067, -0.251])}, // FK both (forearms cross at the waist)
  P04: {name: 'scratch_head', r: a([-0.014, 0.409], [-0.167, 0.200]), l: a([0.045, -0.518], [0.023, -0.259])}, // R picture: hand on the crown (the FK sign puts it on the face); elbow FK
  P05: {name: 'point_side', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([0.520, 0.000], [0.260, 0.000])}, // L FK, arm level (CP-P01 reach to the side)
  P06: {name: 'shrug_palms_up', r: a([-0.355, -0.095], [-0.130, -0.226]), l: a([0.355, -0.095], [0.130, -0.226])}, // FK both, palms out (CP-P01 splay)
  P07: {name: 'wave', r: a([-0.207, 0.443], [-0.184, 0.183]), l: a([0.090, -0.512], [0.045, -0.256])}, // R FK (hand beside the head); L hang
  P08: {name: 'celebrate_V', r: a([-0.134, 0.500], [-0.089, 0.244]), l: a([0.134, 0.500], [0.089, 0.244])}, // FK both, hands above the head
  P09: {name: 'hands_on_hips', r: a([-0.034, -0.391], [-0.184, -0.183]), l: a([0.034, -0.391], [0.184, -0.183])}, // picture: hands at the hips, elbows out (CP-P01); the FK sign lands on the belly
  P10: {name: 'hold_phone_chest', r: a([0.086, -0.202], [-0.014, -0.251], 'upper'), l: a([-0.086, -0.202], [0.014, -0.251], 'upper'), rHold: {kind: 'phone'}}, // CP-P02 elbows back; hands meet at the phone (picture); phone in R hand
  P11: {name: 'offer_toward_camera', r: a([-0.134, -0.251], [-0.045, -0.256]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: forearm foreshortened toward camera (CP-P09); FK gives a full-length arm; L hang
  P12: {name: 'surprise_cover_mouth', r: a([0.026, 0.069], [-0.114, -0.151]), l: a([-0.026, 0.069], [0.114, -0.151])}, // picture: both hands at the jaw sides, outside the coat collar (0.24 H wide); elbows low-out
  P13: {name: 'punch_toward_camera', r: toCamera([0.045, -0.09]), l: a([0.045, -0.518], [0.023, -0.259])}, // fist toward camera: the whole arm foreshortened (a short cone, fist 1.3x, CP-P09; the 1 Nov 2026 fix: the first conversion bent the elbow down and read as a fist at the chest); L hang
  P14: {name: 'point_at_viewer', r: toCamera([0.085, -0.075], 1, true), l: a([0.045, -0.518], [0.023, -0.259])}, // finger toward the viewer: foreshortened arm and fist with the fingertip end-on; L hang
  P15: {name: 'stop_both_palms', r: a([-0.164, -0.032], [-0.134, -0.222]), l: a([0.164, -0.032], [0.134, -0.222])}, // picture: palms out at shoulder height, foreshortened toward camera
  P16: {name: 'reach_grab_camera', r: toCamera([-0.035, -0.02]), l: a([0.045, -0.518], [0.023, -0.259])}, // open hand reaching at the camera: foreshortened arm, hand beside the shoulder at 1.3x; L hang
  P17: {name: 'show_notebook_upright', r: a([0.026, -0.181], [-0.014, -0.251], 'upper'), l: a([-0.026, -0.181], [0.014, -0.251], 'upper'), missing: 'notebook'}, // CP-P02 elbows back; notebook missing (kit has no notebook)
  P18: {name: 'offer_cup_toward_camera', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([-0.036, -0.181], [0.089, -0.244]), missing: 'cup'}, // picture: the cup is on the screen-right hand (character L), so the L arm takes the sheet R angles mirrored; R hang; cup missing
  P19: {name: 'drink_cup', r: a([0.066, 0.129], [-0.174, 0.119]), l: a([0.045, -0.518], [0.023, -0.259]), missing: 'cup'}, // picture: hand at the mouth, elbow raised; cup missing; L hang
  P20: {name: 'phone_at_ear', r: a([-0.074, 0.218], [-0.254, 0.038]), l: a([0.045, -0.518], [0.023, -0.259]), rHold: {kind: 'phone'}}, // picture: phone at the ear; phone in R hand; L hang
  P21: {name: 'salute', r: a([-0.014, 0.399], [-0.154, 0.198]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: salute, hand at the brow; elbow out at head height; L hang
  P22: {name: 'flex_biceps', r: a([-0.215, 0.256], [-0.260, 0.000]), l: a([0.215, 0.256], [0.260, 0.000])}, // FK both, fists up outside the shoulders (CP-P01)
  P23: {name: 'hands_behind_head', r: a([-0.024, 0.218], [-0.199, 0.167]), l: a([0.024, 0.218], [0.199, 0.167])}, // picture: hands at the sides of the head, elbows out (CP-P01)
  P24: {name: 'facepalm', r: a([0.056, 0.238], [-0.144, 0.069]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: hand on the forehead; elbow raised out; L hang
  P25: {name: 'laptop_typing', r: a([-0.064, -0.261], [-0.014, -0.251], 'upper'), l: a([-0.106, -0.261], [0.014, -0.251], 'upper'), missing: 'laptop'}, // CP-P02; R holds the laptop (laptop missing); L types (FK)
  P26: {name: 'carry_box', r: a([-0.064, -0.261], [-0.014, -0.251], 'upper'), l: a([0.064, -0.261], [0.014, -0.251], 'upper'), missing: 'box'}, // CP-P02; box held at the sides (box missing)
  P27: {name: 'count_fingers', r: a([-0.164, 0.018], [-0.114, -0.222]), l: a([-0.016, -0.081], [0.124, -0.202])}, // picture: screen-left palm raised (the sheet L angles mirrored), screen-right finger points at it (sheet R angles mirrored); the sheet side labels do not match the picture
  P28: {name: 'write_notebook', r: a([0.036, -0.202], [-0.014, -0.251], 'upper'), l: a([-0.076, -0.261], [0.014, -0.251], 'upper'), missing: 'notebook'}, // CP-P02; R writes (picture), L holds the notebook (notebook missing)
  P29: {name: 'thumbs_up', r: a([-0.194, -0.061], [-0.114, -0.222]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: thumb-up fist at shoulder height outside the body (CP-P09); L hang
  P30: {name: 'visor_look_far', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([-0.016, 0.369], [0.154, 0.179])}, // picture: L hand at the visor, forearm up; R hang
};

/** Shoulder anchors the rig draws each arm from (cast.ts drawFigure at crouch 0), metres from the ground point. Front view, standing. */
export const shoulderAnchors = (def: CastDef): {r: Pt; l: Pt} => {
  const HD = H * (def.headScale ?? 1);
  const shV = def.height - HD - 0.16 * HD, sw = def.outfit.shoulder * HD;
  return {r: [-(sw - 0.0255), shV - 0.0255], l: [sw - 0.0255, shV - 0.0255]};
};

// ----------------------------------------------------------------------------------------------------------------- the library

export const ALL_POSE_IDS = [...POSE_IDS, ...BODY_POSE_IDS] as const;
export type AnyPoseId = PoseId | BodyPoseId;
export const isBodyPose = (id: AnyPoseId): id is BodyPoseId => (BODY_POSE_IDS as readonly string[]).includes(id);

export type PoseInfo = {
  name: string;
  /** One line: what the pose is and when to pick it. */
  description: string;
  /** Views the pose exists in. A view it lacks gets the P01 idle for that view from `poseFor`. */
  views: View[];
  /** Expression that suits it (`EXPRESSIONS` id); the pose does not apply it. */
  face: ExpressionId;
  /** Furniture the scene must draw (`props.ts` drawChair), and the prop the kit lacks (P17 notebook...). */
  prop?: 'chair';
  missing?: string;
  /** Peek-around: the scene paints a wall over the figure; its edge is this many metres from the ground point toward screen right. */
  occluder?: {edgeU: number};
};

const FRONT_ONLY: View[] = ['front'], BOTH: View[] = ['front', 'left', 'right'], SIDE_ONLY: View[] = ['left', 'right'];
const SHEET_FACE: Partial<Record<PoseId, ExpressionId>> = {P02: 'worried', P04: 'worried', P06: 'smug', P07: 'happy', P08: 'laugh', P09: 'smug', P11: 'happy', P12: 'surprised', P13: 'angry', P14: 'angry', P15: 'scared', P16: 'worried', P19: 'neutral', P20: 'talk', P21: 'happy', P22: 'smug', P24: 'sad', P27: 'talk', P29: 'happy'};
const SHEET_DESC: Record<PoseId, string> = {
  P01: 'Arms hanging: the default stance.', P02: 'One hand under the chin, other arm across the waist: thinking.', P03: 'Arms crossed over the chest: closed, impatient, sure.',
  P04: 'Hand on the crown of the head: puzzled, embarrassed.', P05: 'One arm out straight to the side (profile: forward): pointing at something.', P06: 'Both palms out and up at the sides: shrug, "who knows".',
  P07: 'One hand raised beside the head: wave, greeting.', P08: 'Both arms up in a V: celebration.', P09: 'Hands on the hips, elbows out: confident, scolding.',
  P10: 'Phone held in both hands at the chest.', P11: 'Hand offered toward the viewer (profile: toward the other person).', P12: 'Both hands at the mouth: shock, gasp.',
  P13: 'Fist thrown at the viewer (profile: straight forward).', P14: 'Finger pointed at the viewer. Front only.', P15: 'Both palms out in front: stop, "wait".',
  P16: 'Open hand reaching toward the viewer (profile: forward).', P17: 'Notebook held upright at the chest (notebook missing).', P18: 'Cup offered forward (cup missing).',
  P19: 'Drinking: hand at the mouth (cup missing).', P20: 'Phone at the ear: a call.', P21: 'Salute: hand at the brow.', P22: 'Fists up at the shoulders: flexing, strong.',
  P23: 'Hands behind the head, elbows out: relaxed, caught.', P24: 'Hand on the forehead: facepalm, despair.', P25: 'Hands at a laptop (laptop missing).', P26: 'Carrying a box at the belly (box missing).',
  P27: 'One hand up, the other counting off fingers.', P28: 'Writing in a notebook held at the chest (notebook missing).', P29: 'Thumbs up at the shoulder.', P30: 'Hand shading the eyes: looking far.',
};

export const POSE_INFO: Record<AnyPoseId, PoseInfo> = {
  ...(Object.fromEntries(POSE_IDS.map((id): [PoseId, PoseInfo] => [id, {
    name: POSES[id].name, description: SHEET_DESC[id], views: PROFILE_ARMS[id] ? BOTH : FRONT_ONLY, face: SHEET_FACE[id] ?? 'neutral', missing: POSES[id].missing,
  }])) as Record<PoseId, PoseInfo>),
  ...(Object.fromEntries(BODY_POSE_IDS.map((id): [BodyPoseId, PoseInfo] => {
    const b = BODY_POSES[id];
    return [id, {name: b.name, description: b.description, views: b.front && b.side ? BOTH : b.front ? FRONT_ONLY : SIDE_ONLY, face: b.face, prop: b.prop, occluder: b.occluder}];
  })) as Record<BodyPoseId, PoseInfo>),
};

/** Views a pose exists in (`POSE_INFO[id].views`). */
export const poseViews = (id: AnyPoseId): View[] => POSE_INFO[id].views;
export const hasView = (id: AnyPoseId, view: View) => POSE_INFO[id].views.includes(view);

export type PoseFigure = Pick<FigPose, 'view' | 'crouch' | 'bend' | 'lean' | 'rise' | 'sit' | 'floorSit' | 'kneel' | 'squat' | 'run' | 'lie' | 'lift' | 'nod' | 'head' | 'rArm' | 'lArm' | 'rHold' | 'lHold' | 'farArmUnder'>;
export type PoseArmsOut = Pick<FigPose, 'rArm' | 'lArm' | 'rHold' | 'lHold'>;

const dirOf = (view: View): 1 | -1 => (view === 'left' ? -1 : 1);

/** Body fields a pose sets for a view (what `poseFor` spreads besides the arms). Empty for the sheet poses and for a view the pose lacks. */
export const poseBody = (id: AnyPoseId, view: View): PoseBody => {
  if (!isBodyPose(id) || !hasView(id, view)) return {};
  const b = BODY_POSES[id];
  if (view === 'front') return {...b.front!.body};
  const sb = b.side!.body;
  return {...(typeof sb === 'function' ? sb(dirOf(view)) : sb)};
};

/** The arms (to, via, behind) and holds for a pose in a view, hung from the shoulders of the POSED body. */
type Arms = {r?: ArmTarget; l?: ArmTarget; rHold?: Prop; lHold?: Prop};
const armTargets = (id: AnyPoseId, view: View): Arms => {
  if (!hasView(id, view)) return {};
  if (view === 'front') {
    if (isBodyPose(id)) {
      const a = BODY_POSES[id].front!.arms;
      return a === 'rig' ? {} : a;
    }
    const sp = POSES[id];
    return {r: sp.r, l: sp.l, rHold: sp.rHold, lHold: sp.lHold};
  }
  const sa: SideArms | undefined = isBodyPose(id) ? BODY_POSES[id].side!.arms : PROFILE_ARMS[id];
  if (!sa) return {};
  const nearIsR = dirOf(view) > 0; // the rig draws the near arm on the character's right when facing right
  const n = sa.near === 'rig' ? undefined : sa.near, f = sa.far === 'rig' ? undefined : sa.far;
  return nearIsR ? {r: n, l: f, rHold: sa.nearHold, lHold: sa.farHold} : {l: n, r: f, lHold: sa.nearHold, rHold: sa.farHold};
};

/**
 * The FigPose arm and prop fields for one pose on a figure. `g` is the ground point and `unit` px per metre, as drawFigure takes
 * them; `view` defaults to 'front'. Sheet poses P01-P30 hang from the standing shoulders (front: exactly the original table).
 * Body poses P31+ hang from the shoulders of the body they set (`poseBody`), so use `poseFor` to get body and arms together.
 * An arm left to the rig (`'rig'`, P01 in profile) comes back undefined.
 */
export const poseArms = (id: AnyPoseId, def: CastDef, g: Pt, unit: number, view: View = 'front'): PoseArmsOut => {
  const t = armTargets(id, view), k = def.armScale ?? 1; // the table is in metres for the adult bone: shorter arms reach k times as far
  const body = poseBody(id, view);
  const standingFront = view === 'front' && !isBodyPose(id);
  const S = shoulderAnchors(def), dir = dirOf(view);
  const px = (side: 'r' | 'l', p: Pt): Pt => {
    if (standingFront) return [g[0] + (S[side][0] + p[0] * k) * unit, g[1] - (S[side][1] + p[1] * k) * unit];
    const sh = shoulderPoint(def, g, unit, {view, ...body}, side);
    return [sh[0] + (view === 'front' ? 1 : dir) * p[0] * k * unit, sh[1] - p[1] * k * unit];
  };
  const arm = (side: 'r' | 'l'): Arm | undefined => {
    const a = t[side];
    if (!a) return undefined;
    // A child's hanging arm (hand at the hang depth of the sheet) hangs just outside the body line (`childHangExtra`); adults get 0.
    const dx = view === 'front' && !a.behind ? hangShift(def, a.to) * (side === 'r' ? -1 : 1) * unit : 0;
    const out = hangOut(px(side, [0, 0]), px(side, a.via), px(side, a.to), dx);
    return {to: out.to, via: out.via, behind: a.behind, ...(a.toCam ? {toCam: a.toCam} : {}), ...(a.finger ? {finger: a.finger} : {})};
  };
  return {rArm: arm('r'), lArm: arm('l'), rHold: t.rHold, lHold: t.lHold};
};
/** Move a hanging hand `dx` px sideways and its elbow half of it, keeping the upper arm and forearm at their length (`sh` is the shoulder). */
const hangOut = (sh: Pt, via: Pt, to: Pt, dx: number): {via: Pt; to: Pt} => {
  if (!dx) return {via, to};
  const keep = (from: Pt, a: Pt, b: Pt, x: number): Pt => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), rx = x - from[0];
    return [x, from[1] + (b[1] >= a[1] ? 1 : -1) * Math.sqrt(Math.max(0, L * L - rx * rx))];
  };
  const v = keep(sh, sh, via, via[0] + dx / 2);
  return {via: v, to: keep(v, via, to, to[0] + dx)};
};
/** Outward shift (m) of a hanging hand on a child: full when the target is at the hang depth (0.5 m below the shoulder), none above 0.42 m. */
const hangShift = (def: CastDef, to: Pt): number => {
  const w = Math.max(0, Math.min(1, (-to[1] - 0.42) / 0.08));
  return w * w * (3 - 2 * w) * childHangExtra(def);
};

/** Everything a FigPose takes from a pose: `view`, body fields, arms, held props. Spread it: `{face, ...poseFor('P31', def, g, unit, 'right')}`. A view the pose lacks gets the P01 idle for that view. */
export const poseFor = (id: AnyPoseId, def: CastDef, g: Pt, unit: number, view: View = 'front'): PoseFigure => {
  const use: AnyPoseId = hasView(id, view) ? id : 'P01';
  return {view, ...poseBody(use, view), ...poseArms(use, def, g, unit, view), ...(view === 'front' ? {} : {farArmUnder: true})};
};

const NUM_FIELDS = ['crouch', 'bend', 'lean', 'rise', 'sit', 'floorSit', 'kneel', 'squat', 'lift'] as const;
const lerp1 = (a: number, b: number, u: number) => a + (b - a) * u;
const lerpPt = (a: Pt, b: Pt, u: number): Pt => [lerp1(a[0], b[0], u), lerp1(a[1], b[1], u)];
const hangArm = (def: CastDef, g: Pt, unit: number, view: View, side: 'r' | 'l', body: PoseBody): Arm => {
  const a = view === 'front' ? armTargets('P01', 'front')[side]! : HANG_SIDE, k = def.armScale ?? 1;
  const sh = shoulderPoint(def, g, unit, {view, ...body}, side), d = view === 'front' ? 1 : dirOf(view);
  const dx = view === 'front' ? childHangExtra(def) * (side === 'r' ? -1 : 1) * unit : 0; // as poseArms: a child's hang sits outside the body line
  return hangOut(sh, [sh[0] + d * a.via[0] * k * unit, sh[1] - a.via[1] * k * unit], [sh[0] + d * a.to[0] * k * unit, sh[1] - a.to[1] * k * unit], dx);
};

/**
 * Blend pose `a` into pose `b` by `u` (0..1) for one view: numeric body fields and every arm point interpolate, `behind` and holds
 * switch at the midpoint, `head`, `run` and `lie` follow `b` once u > 0.5 (run and lie interpolate when both set). A pose that
 * leaves an arm to the rig blends from the rig's hang. Use it for gestures that ease in and out (poseMix('P01', 'P15', pulse)).
 */
export const poseMix = (a: AnyPoseId, b: AnyPoseId, u: number, def: CastDef, g: Pt, unit: number, view: View = 'front'): PoseFigure => {
  const ua = hasView(a, view) ? a : 'P01', ub = hasView(b, view) ? b : 'P01';
  if (u <= 0) return poseFor(ua, def, g, unit, view);
  if (u >= 1) return poseFor(ub, def, g, unit, view);
  const ba = poseBody(ua, view), bb = poseBody(ub, view);
  const body: PoseBody = {};
  for (const f of NUM_FIELDS) if (ba[f] !== undefined || bb[f] !== undefined) body[f] = lerp1(ba[f] ?? 0, bb[f] ?? 0, u);
  if (ba.nod || bb.nod) body.nod = lerpPt(ba.nod ?? [0, 0], bb.nod ?? [0, 0], u);
  if (ba.run !== undefined && bb.run !== undefined) body.run = lerp1(ba.run, bb.run, u);
  else if ((u > 0.5 ? bb.run : ba.run) !== undefined) body.run = u > 0.5 ? bb.run : ba.run;
  if (ba.lie !== undefined || bb.lie !== undefined) body.lie = lerp1(ba.lie ?? 0, bb.lie ?? 0, u);
  const head = u > 0.5 ? bb.head : ba.head;
  if (head) body.head = head;
  const A = poseArms(ua, def, g, unit, view), B = poseArms(ub, def, g, unit, view);
  // Each arm is an offset from the shoulder of its own pose's body; the blend hangs the mixed offset from the shoulder of the mixed
  // body (the sit and kneel geometry is not linear in the field, so blending the absolute points would stretch the arm).
  const arm = (side: 'r' | 'l'): Arm | undefined => {
    const x = A[side === 'r' ? 'rArm' : 'lArm'], y = B[side === 'r' ? 'rArm' : 'lArm'];
    if (!x && !y) return undefined;
    const xa = x ?? hangArm(def, g, unit, view, side, ba), ya = y ?? hangArm(def, g, unit, view, side, bb);
    const sa = shoulderPoint(def, g, unit, {view, ...ba}, side), sb = shoulderPoint(def, g, unit, {view, ...bb}, side), sm = shoulderPoint(def, g, unit, {view, ...body}, side);
    const mix = (pa: Pt, pb: Pt): Pt => {
      const o = lerpPt([pa[0] - sa[0], pa[1] - sa[1]], [pb[0] - sb[0], pb[1] - sb[1]], u);
      return [sm[0] + o[0], sm[1] + o[1]];
    };
    const via = xa.via && ya.via ? mix(xa.via, ya.via) : undefined;
    const toCam = lerp1(xa.toCam ?? 0, ya.toCam ?? 0, u), finger = u > 0.5 ? ya.finger : xa.finger;
    return {to: mix(xa.to, ya.to), ...(via ? {via} : {}), behind: u > 0.5 ? ya.behind : xa.behind, ...(toCam > 0 ? {toCam} : {}), ...(toCam > 0 && finger ? {finger} : {})};
  };
  const from = u > 0.5 ? B : A;
  return {view, ...body, rArm: arm('r'), lArm: arm('l'), rHold: from.rHold, lHold: from.lHold, ...(view === 'front' ? {} : {farArmUnder: true})};
};

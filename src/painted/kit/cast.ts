import {lerp, mixColor, type Painter, type Pt} from './painter';
import {INK, palOf, capsule, ell, fistParts, formDir, openHandParts, planeBand, shapedLimb, glaze, hardFill, inkLine, limb, lineOf, modelPart, solid, toneOf, washAt, type InteriorLight} from './draw';
import {hatFront, hatSide, type HatKind} from './gear';
import {CHIN, HEAD_SPAN, paintHeadFront, paintHeadSide, turnU, type FaceState, type HeadStyle} from './head';
import {clamp01} from './space';
import {modeLegs, modeOf, type ModeLegs} from './legs';
import {drawFigureBack, hoodUpHead} from './back';
import {QUARTER_DEPTH, clipHalf, curvedEdge, quarterGeo, turnedCap} from './quarter';

// Recurring-cast rig (from WFOG MK-WF-DEP-05; brief VD03): one draw function for any `CastDef`, front and profile views only,
// 4 heads tall (1.7 m = 4 x 0.425 m; occupant 1.60 m with the same head), mitten hands, decal heads with face controls.
// Body controls: crouch, bend (profile, hands on knees), walk, lean, breath rise, two-bone IK arms to screen targets,
// props (torch, phone, umbrella). Drawn as a flat card at the character's depth: `g` is the ground point in plate px and
// `unit` the projector's px per metre there (one projection owner: the plate's projector supplies both).

export type Outfit = {
  shoulder: number; shirt: string; sleeve: string; longSleeves: boolean; pants: string; shoes: string;
  boots?: boolean; jacket?: string; coat?: string; apron?: string; skirt?: string;
  /** Skirt hem height above the ground, m (front and profile); absent = just above the knee. Short figures (children) set it: the knee rule drops their hem to the ankle in profile. */
  skirtHem?: number;
  /** Knee-length shorts: the `pants` colour stops just below the knee (a cuff); the shin is bare skin with a sock of this colour above the shoe. Front, profile and turned views (`back.ts` too). Absent = long trousers. */
  shorts?: {sock: string};
  /** Job-wardrobe details (`wardrobe.ts`): absent on every existing character, which then draws exactly as before. */
  gear?: Gear;
};
/**
 * Optional garment details layered on the base outfit (all default-absent). Units: metres in the figure's own frame
 * (`hem` is a height above the ground point); colours are CSS hex. Front and profile views both draw the fields that matter
 * in that view (`tie`, `badge` and `pockets` are front only).
 */
export type Gear = {
  /** Necktie, or with `bow` a ribbon bow (sailor uniform). */
  tie?: {color: string; bow?: boolean};
  /** `v` lapels / crossover collar (`depth` m below the shoulder line), `sailor` square collar with a `trim` stripe, `hood` hood bunched at the neck. */
  collar?: {kind: 'v' | 'sailor' | 'hood'; color: string; trim?: string; depth?: number};
  /** Waist band `h` m tall (default 0.035); `buckle` adds a plate in front view. */
  belt?: {color: string; h?: number; buckle?: string};
  /** Open long coat (lab coat): panels from the shoulders down to `hem` m above the ground. Set `sleeve` to the coat colour. */
  overcoat?: {color: string; hem: number};
  /** Monk's outer robe fold: a darker diagonal band across the chest. Combine with `shirt`, `sleeve` and a long `skirt`. */
  drape?: string;
  /** Headwear drawn over the head: `cap` peaked cap with a band, `helmet` open-face helmet, `nurse` nurse's cap. */
  hat?: {kind: HatKind; color: string; band?: string};
  /** Box or bag on the back (delivery), seen beside the shoulders in front view and behind the back in profile. */
  pack?: string;
  /** Chest badge or name tag (front view). */
  badge?: string;
  /** Two breast pockets (front view), outlined in a darker shade of the shirt. */
  pockets?: boolean;
  /** Kimono / yukata sleeves: the forearm cloth hangs in a wide flap. */
  wideSleeves?: boolean;
};
/**
 * `headScale` and `armScale` (default 1) shrink the head and the arm bones of the 4-head adult rig for children (people library);
 * they are absent on every recurring WFOG/ZC entry, so those draw exactly as before.
 */
export type CastDef = {height: number; head: HeadStyle; outfit: Outfit; seed: number; headScale?: number; armScale?: number};

/**
 * An arm target in plate px and the side the elbow bends toward (-1 screen-left, +1 screen-right). With `via` (an
 * authored elbow point, plate px) the arm is drawn shoulder -> via -> to exactly as given: no reach clamp, no IK
 * choice. Two-bone IK with a fixed bone length splays the elbow outward when the hand is close to the shoulder (crouched
 * hands on knees), so authored crouch poses use `via` (SS-R3.2 elbow rows). `behind` (front view): the elbow goes back
 * into depth, so the upper arm ('upper') or the whole arm ('all') is painted behind the torso, a shade darker.
 * `toCam` (front view, 0..1, default absent): the arm points at the viewer, so it is foreshortened. Author `to` close to the shoulder
 * (about 0.1 m away) and `via` on the shoulder-hand line; the arm then draws as a short cone that widens toward the hand and the hand
 * grows up to 1.3x (CP-P09: never more than 1.3x, never larger than the face). `finger` adds the end-on tip of a pointing finger.
 */
export type Arm = {to: Pt; out?: number; via?: Pt; behind?: 'upper' | 'all'; toCam?: number; finger?: boolean;
  /** `InteriorLight.shaped` only: the hand is a fist (back of the hand, finger bumps, thumb) instead of an oval; the value is the side the thumb lies on (+1 / -1 in the hand's frame). `to` is the wrist, the fist reaches about 0.1 m past it. */
  fist?: 1 | -1;
  /** `InteriorLight.shaped` only (UT14): an open mitten hand; the value is the side the thumb lobe lies on. */
  open?: 1 | -1;
  /** With `open`: hide the thumb lobe (mitten outline without it), e.g. a hand clamped over the mouth where the thumb is behind the palm. */
  noThumb?: boolean};
export type Prop =
  | {kind: 'torch'; angle: number; on: number}
  | {kind: 'phone'}
  | {kind: 'umbrella'; tip: Pt};

export type FigPose = {
  /** `back`: seen from behind (`back.ts`; standing, walk, lean, arms, sit, crouch/squat, kneel, floorSit, run; no face); the character's right is screen right and front-view arm targets are mirrored. */
  view: 'front' | 'left' | 'right' | 'back';
  /** Hood up (`gear.collar.kind` `hood`; any view): the hair is covered by a hood in the collar colour. Default absent = hood down, bunched at the neck. */
  hoodUp?: boolean;
  /** Hood being pulled up 0..1 (back view only, `hood-pull` motion): the bunched hood rises from the neck over the head and the hair shows above its rim; 1 = `hoodUp`. */
  hoodRise?: number;
  /** v collar (front view) blended into the shirt colour 0..1 (default 0 = as authored): a mug or hand held at the neck leaves a lone wedge of piping beside it that reads as a coaster (EDU-EP05 SIP/TOUCH). */
  collarHide?: number;
  /** Back view, hood up: `'drape'` keeps the cowl that falls over the nape to the shoulders (head-only close shots); absent = neck mode, the neck column in the hood colour and nothing wider than the torso below the hood (SS-R2.5). */
  cowl?: 'drape';
  head?: 'front' | 'left' | 'right';
  /**
   * Head cock (roll), DEGREES, positive = the top of the head tips toward screen right (user, 4 Nov 2026). Default absent (or 0) = the
   * upright head, drawn exactly as before. The whole head (skull, hair, face, ears, hood-up hood, hat) rotates in the picture plane about
   * a pivot at the top of the neck (the head centre line, 0.051 m above the chin, inside the jaw); the neck, collar and body stay. Every
   * view: front, front three-quarter, left, right and back. Readable range about -15..15; the neck join holds up to 15 without a gap.
   * Eases like any number: a motion's `body.headCock` adds to it (`motions.ts`), or drive it from a pose track (`zcpaint/pose.ts` `track`).
   * The returned `head`, `headTop` and `chin` anchors follow the cock. A tilt with the eyes looking sideways (`face.look`) reads puzzled.
   */
  headCock?: number;
  /**
   * Front three-quarter view (default absent = the exact front view; an optional extra beside the default front, back, left and right,
   * user 4 Nov 2026): with `view: 'front'` the body is turned about the vertical axis by `quarterDeg` (default 45, valid 15..60) so the
   * figure faces toward the screen side named here: `{view: 'front', quarter: 'left'}` is front-left (face toward the viewer and the
   * screen left). Valid with `view: 'front'` and, since 13 Nov 2026 (VA02), `view: 'back'` (facing away and toward that screen side,
   * `back.ts`); `drawFigure` ignores it for the profile views. In the front view the near shoulder is the character's left for `left`,
   * right for `right`. Drawn from the front figure: shoulders and hips foreshorten (torso width follows an ellipse of depth 0.62 of the
   * width, limb centres follow cos), the far arm goes behind the torso, shoes turn toward the facing side, chest details shift toward
   * it. The head is one solid (pass 4): its silhouette (skull, hair cap, volume, hood) keeps the unturned outline, and only the face
   * window under the hairline, the features and the hairline turn on the sphere (`head.ts` `turnU`), so the far side shows hair and
   * the ear. Front-view arm targets (the pose library's front poses) are
   * foreshortened about the figure's centre line, so any front pose that stays in the frontal plane reads turned with the body.
   * Supported like the back view: standing, crouch, walk, lean, rise, nod, arms, hats, `light`, `silhouette`; not sit, kneel, floorSit,
   * squat, run, lie, held props (those cut to a profile). The figure's own ground shadow stays round.
   */
  quarter?: 'left' | 'right';
  quarterDeg?: number;
  crouch?: number;
  /** Profile only: torso pitch toward the facing side, 0..1 (1 = about 60 deg, hands on knees). */
  bend?: number;
  /** Walk phase in cycles (undefined = standing still). */
  walk?: number;
  /** Walk amplitude 0..1 (default 1): leg swing, knee flex, foot lift, bob and arm swing scale with it, so a walk eases into standing by taking it to 0 (motions.ts). */
  stride?: number;
  /** Back view only: head turned toward screen right, radians (the hood opening shows as a crescent on the right edge). */
  headYaw?: number;
  /** Back view only: head tilted up, radians (the head lifts off the nape). */
  headTilt?: number;
  /** Upper-body lean toward screen right, radians. */
  lean?: number;
  /** Shoulders/breath rise, metres. */
  rise?: number;
  face: FaceState;
  /** Character's right / left arm targets (front view: right arm on screen-left). */
  rArm?: Arm;
  lArm?: Arm;
  rHold?: Prop;
  lHold?: Prop;
  /** Torch light on the face and hands, 0..1. */
  warm?: number;
  /** Rain-wet look (worker after the reveal). */
  wet?: boolean;
  /** Head nod/shake: [dx, dy] in head units. */
  nod?: Pt;
  /** Front and three-quarter heads: camera elevation in radians (+ = seen from above), features shift on the head sphere (`head.ts` `pitchV`). Set by `figure-at.ts` `pitchCue`; absent = as before. */
  headPitch?: number;
  /** Head-only size factor (perspective: the head is nearer a high camera than the feet). Scales the head, face and hat about the chin; body, neck and shoulders keep their size. Set by `figure-at.ts` `pitchCue`; absent = 1. */
  headSize?: number;
  /** Seated (driver): no legs or ground shadow; the car hides the lap. */
  seated?: boolean;
  /**
   * Body modes of the pose library (poses P31+, `legs.ts`). All default-absent, so existing characters draw exactly as before.
   * Modes do not combine: the first of kneel, floorSit, sit, squat, run that is set wins. Arms are the caller's (`rArm` / `lArm`,
   * or `poseFor` in `poses.ts`); a figure with no arm target in `run` pumps its arms.
   * `sit` 0..1: on a chair or stool (hips at seat height, thighs forward, shins down; the pelvis moves back in profile).
   * `floorSit` 0..1: on the ground, knees up. `kneel` 0..1: kneeling on both knees. `squat` 0..1: deep knee bend in profile (the
   * front view takes it as `crouch`). `run`: run phase in cycles (profile stride, flight bounce; the front view lifts alternate feet).
   */
  sit?: number;
  floorSit?: number;
  kneel?: number;
  squat?: number;
  run?: number;
  /** Whole figure rotated about its ground contact: -1..1, +1 = lying with the head toward screen left (CCW), -1 = head toward screen right. Arm targets stay in the unrotated body frame. */
  lie?: number;
  /** Whole figure raised off the ground, metres (jump, fall); the ground shadow stays unless `noShadow`. */
  lift?: number;
  /** Skip the soft ground shadow (and its dark core): a figure with no ground under it (the dream fall). Default absent = shadow as before. */
  noShadow?: boolean;
  /** Profile `run` only: 0..1 (default 1) blends the legs from a planted two-foot stance to the stride, the grounded foot staying put (EDU-EP05 R1.9 FR28). */
  runMix?: number;
  /** Front view, standing legs only (EDU-EP15 shot 2 knee kicks): flex per leg in degrees, `r`/`l` = the character's right/left (screen left/right). The thigh shortens by cos(hip), the shank folds by hip+knee; the other fields stay as the standing leg. Absent = straight legs. */
  legKick?: {r?: {hip: number; knee: number}; l?: {hip: number; knee: number}};
  /** Ground shadow held at its own floor spot (picture px `g`, `unit` px per metre) with opacity factor `k` 0..1, for a figure drawn scaled about a point (EDU-EP05 shrink: the shadow fades instead of riding the shrinking card). Absent = under the feet. */
  shadowFloor?: {g: Pt; unit: number; k: number};
  /** Neck in the face skin tone with a soft jaw shade and no outline, flaring into the collar (default absent = the VD18 shaded neck block, grey beside a lit face). EDU-EP01 W5.4. */
  softNeck?: boolean;
  /**
   * Profile only: paint the far arm BEFORE the legs, so the near thigh and the torso hide a hanging far hand (default absent: after
   * the legs, as the WFOG cast always drew it, which leaves a hand floating over the thigh). The pose library sets it in every profile.
   */
  farArmUnder?: boolean;
  /** Interior light (brief VD18): modelled washes, coloured ink, folds, face planes. Undefined = the blockout look. */
  light?: InteriorLight;
  /**
   * Flat silhouette (SS-R6 FIG-KNOCK, DF-20261031-painted-opaque-cast): every part, the head outline and the ground shadow are
   * one opaque colour with 8 solid passes; no inner or outer ink, folds, face, hem or wet lines. Undefined = the cast look.
   */
  silhouette?: string;
};

export type FigAnchors = {
  head: Pt; headTop: number; chin: number; feet: Pt;
  rHand: Pt; lHand: Pt; rShoulder: Pt; lShoulder: Pt; rUpper: Pt; lUpper: Pt;
  lens?: Pt; lensDir?: number;
  /** Visible top and bottom (px) of the figure for the lead measure. */
  top: number; bottom: number;
};

export const H = 0.425; // one head, m
export {QUARTER_DEPTH};
/** Upper-arm and forearm length, m (both bones; the pose library and its test use it). */
export const BONE = 0.26;

/** Short-sleeve hem of the shaped front-view arm, as a fraction of the on-screen upper arm (shoulder -> elbow); ZC2-SB-R3 sleeve fix. */
export const SLEEVE_HEM = 0.6;
/** Limb width at the elbow of the shaped arm (U): the upper arm ends and the forearm starts on the IK elbow point at this width, so both round caps are one circle of radius ELBOW_W / 2 centred on the joint (ZC2-SB-R3 elbow fix). */
export const ELBOW_W = 0.066;

/** Two-bone IK in px: elbow for shoulder S, hand target T, bone L; picks the solution bending down and toward `out`. */
export const ikElbow = (S: Pt, T: Pt, L: number, out: number): Pt => {
  const dx = T[0] - S[0], dy = T[1] - S[1];
  const d = Math.max(1e-3, Math.min(Math.hypot(dx, dy), 2 * L - 0.5));
  const a = Math.atan2(dy, dx), off = Math.acos(Math.min(1, d / (2 * L)));
  const cands: Pt[] = [a + off, a - off].map((b): Pt => [S[0] + L * Math.cos(b), S[1] + L * Math.sin(b)]);
  const score = ([x, y]: Pt) => y + out * (x - S[0]) * 0.35;
  return score(cands[0]) >= score(cands[1]) ? cands[0] : cands[1];
};
/** Clamp a hand target to the arm's reach. */
const reachTo = (S: Pt, T: Pt, L: number): Pt => {
  const d = Math.hypot(T[0] - S[0], T[1] - S[1]), m = 2 * L - 0.5;
  return d <= m ? T : [S[0] + ((T[0] - S[0]) * m) / d, S[1] + ((T[1] - S[1]) * m) / d];
};

/**
 * Extra outward offset (m) of a hanging hand on a child (`armScale` set; 0 on every adult, so those draw as before). The child's
 * shoulders are about as wide as the hips, so the adult hang (hand 0.034-0.045 m outside the shoulder anchor) leaves the hand over
 * the thigh; this puts the hand centre 0.038 m outside the hip line, as it sits on the adult (0.03-0.05 m).
 */
export const childHangExtra = (def: CastDef): number => {
  if (def.armScale === undefined) return 0;
  const HD = H * (def.headScale ?? 1), sw = def.outfit.shoulder * HD, hipEdge = 0.3 * HD + 0.013;
  return Math.max(0, hipEdge + 0.038 - (sw - 0.0255 + 0.045 * def.armScale));
};

/**
 * Front-view shoulder anchor height (m above the ground point) at a crouch, upright and without lean or rise: the levels
 * drawFigure uses (hip drop, torso scale about the hip). A shot hangs its elbows from this anchor through a rise (SS-R3.4
 * S03-SH02); the cast test checks it against the anchor drawFigure paints.
 */
/** Leg length / the 1.7 m adult's (0.336 m thigh): the scale the leg modes (`modeLegs`) work in; motions that move the root with the feet use it. */
export const legScale = (def: CastDef): number => {
  const Ht = def.height, HD = H * (def.headScale ?? 1), chin = Ht - HD, shV = chin - 0.16 * HD;
  const hip0 = shV - (chin - 0.068) * 0.44 + 0.034;
  return ((hip0 - 0.038) / 2) / 0.336;
};
export const shoulderHeight = (def: CastDef, crouch = 0): number => {
  const Ht = def.height, HD = H * (def.headScale ?? 1);
  const chin = Ht - HD, shV = chin - 0.16 * HD;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV - torso + 0.034;
  const c = clamp01(crouch);
  const hipV = hip0 - 0.47 * c * (Ht / 1.7);
  return hipV + (shV - 0.0255 - hip0) * (1 - 0.4 * c);
};

/** Fields of a pose that decide the body frame (hip height, torso tilt, leg mode). */
export type BodyFields = Pick<FigPose, 'crouch' | 'bend' | 'walk' | 'stride' | 'lean' | 'rise' | 'sit' | 'floorSit' | 'kneel' | 'squat' | 'run' | 'runMix' | 'lift'>;
export type BodyFrame = {
  hip0: number; shV: number; hipV: number; hipU: number; tScale: number; rise: number; tilt: number; lift: number;
  /** Crouch after the front-view squat mapping, 0..1. */
  c: number; bend: number; ph: number; bob: number;
  /** Leg mode (sit, floor, kneel, squat, run) with its legs; undefined = the original standing, walking and crouching legs. */
  mode?: ModeLegs;
};
/**
 * Body geometry shared by `drawFigure` and the pose library (`poses.ts` hangs arm targets from the shoulders it places): hip height
 * and shift, torso scale, lean and bend, lift, and the leg mode. For a pose with none of the mode fields this is the arithmetic
 * `drawFigure` always used. Metres in the figure's frame.
 */
/** Run in a skirt (sarong): the straight cloth holds the step to this share of the full stride, in every view (VA02 follow-up, 13 Nov 2026:
 *  the full stride swung the shins out of the cloth and the front, side and back no longer matched once the back was held in). */
const SARONG_STEP = 0.4;
export const bodyFrame = (def: CastDef, pose: BodyFields & {view: FigPose['view']}): BodyFrame => {
  const Ht = def.height, HD = H * (def.headScale ?? 1);
  const chin = Ht - HD, shV = chin - 0.16 * HD;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV - torso + 0.034, ankleV = 0.038;
  const knee0 = (hip0 + ankleV) / 2;
  const profile = pose.view !== 'front';
  const dir: 1 | -1 = pose.view === 'left' ? -1 : 1;
  let c = clamp01(pose.crouch ?? 0);
  const bend = clamp01(pose.bend ?? 0);
  let m = modeOf(pose);
  if (m?.kind === 'squat' && !profile) {
    c = Math.max(c, m.amount);
    m = undefined;
  }
  const walk = pose.walk;
  const ph = walk === undefined ? 0 : walk * Math.PI * 2;
  const bob = walk === undefined ? 0 : 0.018 * Math.abs(Math.sin(ph)) * (pose.stride ?? 1);
  const mode = m ? modeLegs({hip0, ankleV, L1: hip0 - knee0, L2: knee0 - ankleV}, profile ? 'profile' : 'front', m.kind === 'run' ? {kind: 'run', amount: m.amount * Math.PI * 2, mix: def.outfit.skirt ? Math.min(pose.runMix ?? 1, SARONG_STEP) : pose.runMix} : m) : undefined;
  const hipDrop = 0.47 * c * (Ht / 1.7) + bob;
  return {
    hip0, shV, c, bend, ph, bob, mode,
    tScale: 1 - 0.4 * c,
    hipV: mode ? mode.hipV : hip0 - hipDrop,
    hipU: mode ? mode.hipU : 0,
    rise: pose.rise ?? 0,
    tilt: profile ? dir * (pose.lean ?? 0) + bend * 1.05 : pose.lean ?? 0,
    lift: pose.lift ?? 0,
  };
};

/**
 * Where drawFigure paints a shoulder (plate px, before any `lie` rotation) for this pose: the same transform as its `U`. The pose
 * library hangs arm targets from it (`poses.ts`), so an arm offset means the same thing in a seated, bent or leaning body.
 * `side` is the character's own side (front view: right = screen left); a profile has one shoulder anchor for both arms.
 */
export const shoulderPoint = (def: CastDef, g: Pt, unit: number, pose: BodyFields & {view: FigPose['view']}, side: 'r' | 'l'): Pt => {
  const f = bodyFrame(def, pose);
  const HD = H * (def.headScale ?? 1), sw = def.outfit.shoulder * HD;
  const profile = pose.view !== 'front', dir: 1 | -1 = pose.view === 'left' ? -1 : 1;
  const [u, v]: Pt = profile ? [-0.0043, f.shV - 0.03] : [(side === 'r' ? -1 : 1) * (sw - 0.0255), f.shV - 0.0255];
  const r = v - f.hip0, vv = f.hipV + r * f.tScale + f.rise * clamp01(r / (f.shV - f.hip0));
  const a = -f.tilt, dv = vv - f.hipV;
  return [g[0] + (profile ? dir : 1) * (f.hipU + u * Math.cos(a) - dv * Math.sin(a)) * unit, g[1] - (f.hipV + u * Math.sin(a) + dv * Math.cos(a) + f.lift) * unit];
};

/**
 * Draw one character. `seed` separates this figure's fills from every other mark in the plate; `t` is the plate clock
 * (blink). Returns world anchors in plate px (head, hands, torch lens) for props, glows and other characters.
 */
export const drawFigure = (p: Painter, def: CastDef, g: Pt, unit: number, pose: FigPose, t: number, seed = def.seed): FigAnchors => {
  // Three-quarter is a front- and back-view field (back added 13 Nov 2026, VA02): with a profile view it is ignored and the plain view is drawn.
  if (pose.quarter && pose.view !== 'front' && pose.view !== 'back') pose = {...pose, quarter: undefined, quarterDeg: undefined};
  if (pose.view === 'back') return drawFigureBack(p, def, g, unit, pose, t, seed);
  const o = def.outfit;
  const Ht = def.height;
  const HD = H * (def.headScale ?? 1), AB = BONE * (def.armScale ?? 1); // children (people.ts): smaller head, shorter arms; absent = the 4-head adult
  const chin = Ht - HD, shV = chin - 0.16 * HD;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV - torso + 0.034, crotch0 = hip0 - 0.0425, ankleV = 0.038;
  const knee0 = (hip0 + ankleV) / 2;
  const sw = o.shoulder * HD, hw = 0.3 * HD;
  const K = HD / HEAD_SPAN;
  const fr = bodyFrame(def, pose);
  const {c, bend, mode} = fr;
  const profile = pose.view !== 'front';
  const dir: 1 | -1 = pose.view === 'left' ? -1 : 1;
  const headView = pose.head ?? (pose.view as 'front' | 'left' | 'right');
  // Three-quarter turn (FigPose.quarter): kp foreshortens centre offsets (shoulders, hips, arm targets), kt the torso and cloth width, both 1 when absent.
  const qg = quarterGeo(pose);
  const qr = qg?.qr ?? 0, qdir = qg?.qdir ?? 1, kp = qg?.kp ?? 1, kt = qg?.kt ?? 1, kr = qg?.kr ?? 1, sinq = qg?.sin ?? 0;
  // The front plane takes the facing side, the side plane (a darker shade) the other; `udiv(w)` is the edge between them at half-width w.
  const udiv = (w: number) => qdir * (1 - 2 * (qg?.sf ?? 1)) * w;
  /** Turned-body marks: shapes that get the side-plane shade (px polygons). */
  const planeShapes: {pts: Pt[]; color: string}[] = []; // each cloth shape with its own colour, so the side plane shades it in that cloth
  const headStyle = pose.hoodUp ? hoodUpHead(def.head, o) : def.head;
  const walk = pose.walk;
  const warm = pose.warm ?? 0;
  const coat = o.coat && pose.wet ? '#24384a' : o.coat;
  const sleeve = o.coat && pose.wet ? '#24384a' : o.sleeve;
  const skinHand = warm > 0 ? mixColor(def.head.skin, '#f6c27a', 0.35 * warm) : def.head.skin;

  // Walk: hip bob and leg swing; crouch: hips drop and the torso foreshortens; body modes (sit, kneel, run...): bodyFrame.
  const {ph, tScale, hipV, hipU, rise, tilt, lift: airborne} = fr;
  const ph0 = (pose.run ?? 0) * Math.PI * 2;

  // Local metres (u toward screen right for front; toward the facing side for profile) -> plate px.
  const X = (u: number) => g[0] + (profile ? dir : 1) * u * kt * unit;
  const Y = (v: number) => g[1] - (v + airborne) * unit;
  const S = ([u, v]: Pt): Pt => [X(u), Y(v)];
  /** Upper body: scale about the hip (crouch), breath rise, then rotate about the hip (lean / bend). */
  const U = ([u, v]: Pt): Pt => {
    const r = v - hip0;
    const vv = hipV + r * tScale + rise * clamp01(r / (shV - hip0));
    const a = -tilt; // positive tilt rotates the top toward +u
    const du = u, dv = vv - hipV;
    return S([hipU + du * Math.cos(a) - dv * Math.sin(a), hipV + du * Math.sin(a) + dv * Math.cos(a)]);
  };
  const Uq = (pts: Pt[]) => pts.map(U);
  const Sq = (pts: Pt[]) => pts.map(S);
  /** Legs are round: their centres foreshorten (already in their u), their thickness does not. */
  const SLq = (pts: Pt[]) => (pose.quarter ? pts.map(([u, v]): Pt => [g[0] + u * unit, Y(v)]) : pts.map(S));
  /** Chest-front marks (collar, tie, buttons, lapels) lie on the face of the torso, which a turned body brings toward the facing side. */
  const chestShift = pose.quarter && pose.view === 'front' ? (qdir * 0.1 * sinq) / kt : 0;
  // The shift tapers toward the cloth edge, so an outer corner (a jacket half, a collar tip) never leaves the silhouette.
  const Uqf = (pts: Pt[]) => (chestShift ? pts.map(([u, v]): Pt => U([u + chestShift * (1 - Math.min(1, Math.abs(u) / sw) ** 3), v])) : pts.map(U));

  const L = pose.light;
  const sil = pose.silhouette;
  let part = 0, line = 0;
  const fill = (color: string, pts: Pt[], outline = true, passes = 4) => {
    const base = sil ?? toneOf(color, L);
    if (L?.under && !sil) hardFill(p, seed * 1000 + part + 500, base, pts);
    solid(p, seed * 1000 + ++part, base, pts, sil ? 8 : passes, sil ? 0.02 : L ? 0 : 0.07, sil ? 0.03 : 0.2);
    if (L) {
      modelPart(p, seed * 1000 + part, base, pts, L);
      // Falloff from the overhead tubes: lower parts sit darker (measured from the shoulders to the ground point).
      const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length, top = U([0, shV])[1];
      const v = clamp01((cy - top) / Math.max(1, g[1] - top));
      if (v > 0.25) glaze(p, 7_900_000 + seed * 1000 + part, palOf(L).falloff, palOf(L).falloffOpacity * ((v - 0.25) / 0.75), pts, {border: 0.2, bleed: 0.02});
    }
    if (outline && !sil) inkLine(p, seed * 1000 + ++line, pts, {weight: L ? palOf(L).lineOuter : 1.0, color: lineOf(base, L)});
  };
  /** VD18 fold or crease: a short open ink stroke in a dark shade of the cloth. */
  const fold = (color: string, pts: Pt[]) => {
    if (L && !sil) inkLine(p, seed * 1000 + 400 + ++line, pts, {closed: false, weight: palOf(L).lineFold, curve: 0.5, color: mixColor(toneOf(color, L), L?.ink ?? INK, 0.55)});
  };

  // Soft ground shadow under the feet (every human has one). VD18: a wider soft shadow plus a dark occlusion core.
  // Lying (`lie`): the shadow lengthens along the body, toward the side the head points to.
  const lie = Math.max(-1, Math.min(1, pose.lie ?? 0)), lieA = Math.abs(lie);
  const sfl = pose.shadowFloor, sg = sfl?.g ?? g, su = sfl?.unit ?? unit, sk = sfl?.k ?? 1;
  const shX = sg[0] - Math.sign(lie) * 0.5 * Ht * lieA * su, shW = (profile ? 0.32 : 0.26) + (0.52 * Ht - (profile ? 0.32 : 0.26)) * lieA;
  const sh = ell(shX, sg[1] + 0.01 * su, shW * (L ? 1.15 : 1) * su, (L ? 0.07 : 0.06) * (1 + lieA) * su, 16);
  if (!pose.seated && !pose.noShadow && sk > 0.001 && !L) washAt(p, seed * 1000 + 999, sil ?? '#1e2324', 70 * sk, sh, 0.5, 0.3);
  if (!pose.seated && !pose.noShadow && sk > 0.001 && L) {
    glaze(p, seed * 1000 + 999, palOf(L).ground, 120 * sk, sh, {border: 0.1, bleed: 0.15});
    glaze(p, seed * 1000 + 998, palOf(L).groundCore, 160 * sk, ell(shX, sg[1] + 0.005 * su, ((profile ? 0.22 : 0.2) + (0.4 * Ht - (profile ? 0.22 : 0.2)) * lieA) * su, 0.03 * (1 + lieA) * su, 16), {border: 0.1, bleed: 0.08});
  }
  // Contact (kneel, floor-sit; default absent): a darker core under each part that rests on the ground, so the folded legs read as
  // touching it: the knees and the shin of a kneel, the seat of a floor-sit. Drawn under the figure like the shadow above.
  if (mode && !pose.seated && lie === 0 && (mode.kind === 'kneel' || mode.kind === 'floor')) {
    const spots: {u0: number; u1: number; hw: number; w: number}[] = [];
    if (mode.kind === 'kneel') {
      for (const l of mode.legs) {
        const w = clamp01((0.1 - l.knee[1]) / 0.05);
        if (w <= 0) continue;
        if (profile && l.ankle[1] < 0.1) spots.push({u0: Math.min(l.knee[0], l.ankle[0]) - 0.02, u1: Math.max(l.knee[0], l.ankle[0]) + 0.02, hw: 0.04, w});
        else spots.push({u0: l.knee[0], u1: l.knee[0], hw: 0.075, w});
      }
    } else {
      const w = clamp01((0.16 - mode.hipV) / 0.08);
      if (w > 0) spots.push({u0: mode.hipU, u1: mode.hipU, hw: 0.14, w});
    }
    spots.forEach((sp, i) => {
      const a = S([sp.u0, 0]), b = S([sp.u1, 0]), cx = (a[0] + b[0]) / 2, rx = Math.abs(b[0] - a[0]) / 2 + sp.hw * unit;
      const core = ell(cx, g[1] + 0.004 * unit, rx, 0.022 * unit, 14);
      if (L) glaze(p, seed * 1000 + 980 + i, '#07090a', 150 * sp.w, core, {border: 0.1, bleed: 0.08});
      else washAt(p, seed * 1000 + 980 + i, sil ?? '#1e2324', 110 * sp.w, core, 0.4, 0.3);
    });
  }
  // Lying: everything below is drawn rotated about the body's contact line (a point `lieR` above the ground point).
  const lieR = lieA * (profile ? 0.26 : o.shoulder + 0.03) * HD, lieAng = -lie * Math.PI / 2;
  const lieC: Pt = [g[0], g[1] - lieR * unit];
  const rotLie = ([x, y]: Pt): Pt => lie === 0 ? [x, y] : [lieC[0] + (x - lieC[0]) * Math.cos(lieAng) - (y - lieC[1]) * Math.sin(lieAng), lieC[1] + (x - lieC[0]) * Math.sin(lieAng) + (y - lieC[1]) * Math.cos(lieAng)];
  if (lie !== 0) {
    p.brush.push();
    p.brush.translate(lieC[0], lieC[1]);
    p.brush.rotate(lieAng);
    p.brush.translate(-lieC[0], -lieC[1]);
  }

  // ----------------------------------------------------------------- legs
  part = 10;
  line = 10;
  const legs: {hip: Pt; knee: Pt; ankle: Pt; far: boolean; foot?: {c: Pt; a: number}; hide?: boolean}[] = [];
  if (mode) {
    legs.push(...mode.legs);
  } else if (!profile) {
    for (const s of [-1, 1]) {
      const lift = walk === undefined ? 0 : 0.06 * Math.max(0, Math.sin(ph + (s > 0 ? Math.PI : 0))) * (pose.stride ?? 1);
      // Turned body: the leg on the facing side of the screen is the far one: a step behind and a little higher (it stands farther back on
      // the ground), the near one a step toward the turn.
      const farLeg = !!qg && s === qdir, st = qg ? (farLeg ? -0.035 : 0.07) * sinq : 0, rs = qg && farLeg ? 0.03 * sinq : 0;
      const hip: Pt = [s * 0.0725 * kp, hipV];
      const ankle: Pt = [s * (0.08 + 0.05 * c) * kp + qdir * st, ankleV + lift + rs];
      const knee: Pt = [s * (0.077 + 0.17 * c) * kp + qdir * st * 0.5, lerp((hipV + ankle[1]) / 2, 0.46, c)];
      const kk = pose.legKick?.[s > 0 ? 'l' : 'r'];
      if (kk && !qg) {
        const h = (kk.hip * Math.PI) / 180, sh = ((kk.hip + kk.knee) * Math.PI) / 180, L1 = hipV - knee[1], L2 = knee[1] - ankle[1];
        knee[1] = hipV - L1 * Math.cos(h);
        ankle[1] = knee[1] - L2 * Math.cos(sh);
        ankle[0] = knee[0] + (ankle[0] - knee[0]) * Math.cos(sh);
      }
      legs.push({hip, knee, ankle, far: farLeg});
    }
    if (qg) legs.sort((a, b) => Number(b.far) - Number(a.far));
  } else {
    const L1 = hip0 - knee0, L2 = knee0 - ankleV;
    for (const s of [1, -1]) {
      const sw0 = walk === undefined ? 0 : 0.42 * Math.sin(ph + (s > 0 ? 0 : Math.PI)) * (pose.stride ?? 1);
      // Bent (hands on knees): the knees flex so the shins angle back under the hips instead of one straight leg.
      const kneeBend = walk === undefined ? 0.45 * bend : Math.max(0, 0.6 * Math.sin(ph + (s > 0 ? 0 : Math.PI) + 1.2)) * (pose.stride ?? 1);
      const hip: Pt = [s > 0 ? 0.0 : -0.02, hipV];
      const knee: Pt = [hip[0] + L1 * Math.sin(sw0 + 0.1 * bend), hip[1] - L1 * Math.cos(sw0 + 0.1 * bend)];
      const b2 = sw0 - kneeBend;
      const ankle: Pt = [knee[0] + L2 * Math.sin(b2), knee[1] - L2 * Math.cos(b2)];
      legs.push({hip, knee, ankle, far: s < 0});
    }
    // Keep the lower foot on the ground.
    const low = Math.min(...legs.map((l) => l.ankle[1]));
    legs.forEach((l) => {
      const d = ankleV - low;
      l.hip = [l.hip[0], l.hip[1] + d];
      l.knee = [l.knee[0], l.knee[1] + d];
      l.ankle = [l.ankle[0], l.ankle[1] + d];
    });
    legs.sort((a, b) => Number(b.far) - Number(a.far));
  }
  // Three-quarter front: a skirt or coat hides what is under it. The legs start at the cloth hem and the far arm stops at the cloth top, so
  // the translucent wash never shows a thigh or a hand through it (4 Nov 2026). Old views are untouched (qg only).
  // Running in a skirt keeps the standing hem below the dropped hip in every view (as the back); the legs start at that hem.
  const runHem = mode?.kind === 'run' && o.skirt ? knee0 - 0.19 - (hip0 - fr.hipV) : undefined;
  const clothHem = !profile && (qg ? !mode || runHem !== undefined : runHem !== undefined) && (o.skirt || coat)
    ? Math.min(o.skirt ? o.skirtHem ?? runHem ?? Math.max(legs[0].knee[1] - 0.19 * (1 - c), 0.3 * c + 0.2) : 9, coat ? Math.max(legs[0].knee[1] - 0.05, 0.12) : 9) - (coat ? 0.035 : 0.03) * sinq * 0.9
    : undefined;
  // Side view with a skirt (walking or standing): the legs come out of the hem, never through the cloth's outer edge. The leg is cut at the hem line and
  // the hem spreads to cover the swung legs where they cross it (12 Nov 2026, EDU-EP18-SHORT: the trailing thigh left the skirt's side at a bent angle).
  const pHem = profile && (!mode || mode.kind === 'run') && o.skirt ? o.skirtHem ?? runHem ?? legs[0].knee[1] - 0.19 : undefined;
  let pHemX: [number, number] = [-0.32 * HD, 0.3 * HD];
  if (pHem !== undefined) {
    for (const l of legs) {
      for (const [p0, p1] of [[l.hip, l.knee], [l.knee, l.ankle]] as [Pt, Pt][]) {
        if ((p0[1] - pHem) * (p1[1] - pHem) > 0 || p0[1] === p1[1]) continue;
        const x = p0[0] + ((p1[0] - p0[0]) * (pHem - p0[1])) / (p1[1] - p0[1]);
        pHemX = [Math.min(pHemX[0], x - 0.04), Math.max(pHemX[1], x + 0.04)];
      }
    }
  }
  const clipLeg = (pts: Pt[]): Pt[] => (pHem !== undefined ? clipHalf(pts, [-1e5, Y(pHem)], [1e5, Y(pHem)], [0, Y(pHem) + 1e5]) : clothHem === undefined ? pts : clipHalf(pts, [-1e5, Y(clothHem)], [1e5, Y(clothHem)], [0, Y(clothHem) + 1e5]));
  const clothW = coat ? hw + 0.085 + 0.08 * c : Math.abs(legs[0].knee[0]) + 0.06;
  const clothTopY = clothHem === undefined ? 0 : U([0, hip0 + 0.034])[1], clothX0 = X(-clothW), clothX1 = X(clothW);
  const clipArmCloth = (pts: Pt[]): Pt[] => {
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
    return cx > clothX0 && cx < clothX1 ? clipHalf(pts, [-1e5, clothTopY], [1e5, clothTopY], [0, clothTopY - 1e5]) : pts;
  };
  // Three-quarter front, standing in trousers: the far arm hangs behind the hip, so its part below the shirt hem inside the body is hidden
  // (KIT-ARM-DEPTH F, 13 Nov 2026: the far hand showed as a loose ball at the crotch). A hand out past the hip stays.
  const farHip = !!qg && !mode && c < 0.05 && clothHem === undefined;
  const farHipY = U([0, hip0 + 0.0255])[1], farHipX0 = X(-(hw + 0.013)), farHipX1 = X(hw + 0.013);
  const clipFarHip = (pts: Pt[]): Pt[] => {
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
    return cx > farHipX0 && cx < farHipX1 ? clipHalf(pts, [-1e5, farHipY], [1e5, farHipY], [0, farHipY - 1e5]) : pts;
  };
  const legColor = (far: boolean) => (far ? mixColor(o.pants, '#000000', qg ? 0.1 : 0.18) : o.pants); // turned body (R1.9 FR22): far leg at most ~0.12 luma under the near one
  // Front view, thighs toward the camera (sitting, knees up): the legs are painted over the torso, after the head.
  const legsOver = !!mode && !profile && (mode.kind === 'sit' || mode.kind === 'floor');
  const fillL = (color: string, pts: Pt[], outline = true) => {
    const q = clipLeg(pts);
    if (q.length > 2) fill(color, q, outline);
  };
  const paintLegs = () => {
  part = 10;
  line = 10;
  for (const {hip, knee, ankle, far, foot, hide} of pose.seated ? [] : legs) {
    // Front kneel: the thigh comes toward the camera, so it widens toward the knee (the knee is the nearest part).
    const near = hide && !profile && mode?.kind === 'kneel';
    fillL(legColor(far), SLq(limb(hip, knee, 0.11, near ? 0.125 : 0.095)), true);
    if (!hide && o.shorts) {
      // Shorts: bare shin and sock from under a denim cuff that reaches a little below the knee (same limb silhouette as trousers, so no overlay edge).
      const at = (k: number): Pt => [knee[0] + (ankle[0] - knee[0]) * k, knee[1] + (ankle[1] - knee[1]) * k];
      const skinC = far ? mixColor(def.head.skin, '#000000', 0.18) : def.head.skin, sockC = far ? mixColor(o.shorts.sock, '#000000', 0.18) : o.shorts.sock;
      fillL(skinC, SLq(limb(at(0.1), ankle, 0.088, 0.066)), true);
      fillL(sockC, SLq(limb(at(0.84), [ankle[0], ankle[1] - 0.005], 0.07, 0.066)), true);
      fillL(legColor(far), SLq(limb(knee, at(0.16), 0.095, 0.1)), true);
    } else if (!hide) fillL(legColor(far), SLq(limb(knee, ankle, 0.095, 0.08)), true);
    if (c > 0.2 || mode) fillL(legColor(far), SLq(ell(knee[0], knee[1], near ? 0.064 : hide || legsOver ? 0.056 : 0.05, near ? 0.064 : hide || legsOver ? 0.056 : 0.05, 12)), false);
    if (hide || (pHem !== undefined && ankle[1] > pHem)) continue; // a foot lifted behind a skirt is under the cloth, not beside it
    if (c > 0.4) {
      // Crouched: the cloth bunches behind the knee (two short creases on the thigh just above it).
      const kx = knee[0] - hip[0], ky = knee[1] - hip[1], kl = Math.hypot(kx, ky) || 1, ux = kx / kl, uy = ky / kl;
      for (const d of [0.07, 0.13]) fold(legColor(far), SLq([[knee[0] - ux * d - uy * 0.035, knee[1] - uy * d + ux * 0.035], [knee[0] - ux * (d - 0.02), knee[1] - uy * (d - 0.02)], [knee[0] - ux * d + uy * 0.035, knee[1] - uy * d - ux * 0.035]]));
    }
    const shoe = far ? mixColor(o.shoes, '#000000', 0.2) : o.shoes;
    if (o.boots && !foot) {
      if (!profile) fill(shoe, SLq([[ankle[0] - 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.135], [ankle[0] + 0.06, ankle[1] - 0.038], [ankle[0] - 0.06, ankle[1] - 0.038]]));
      else fill(shoe, SLq([[ankle[0] - 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.01], [ankle[0] + 0.13, ankle[1] - 0.02], [ankle[0] + 0.13, ankle[1] - 0.038], [ankle[0] - 0.055, ankle[1] - 0.038]]));
    } else if (!profile && qg) fill(shoe, SLq(ell(ankle[0] + qdir * (far ? 0.04 : 0.085) * sinq + Math.sign(ankle[0]) * 0.008, ankle[1] - 0.017, 0.068 + (far ? 0.03 : 0.055) * sinq, 0.03, 14, qdir * 0.22 * sinq)));
    else if (!profile) fill(shoe, SLq(ell(ankle[0] + Math.sign(ankle[0]) * 0.017, ankle[1] - 0.017, 0.068, 0.03, 14)));
    else if (foot) fill(shoe, SLq(ell(foot.c[0], foot.c[1], 0.085, 0.03, 14, foot.a)));
    else fill(shoe, SLq(ell(ankle[0] + 0.035, ankle[1] - 0.017, 0.085, 0.03, 14)));
  }
  };
  const farUnder = profile && !!pose.farArmUnder;
  if (!legsOver && !farUnder) paintLegs();

  // ----------------------------------------------------------------- arms
  // Turned body (`qg`): the arm on the screen side away from the facing direction is the near one (shoulder at the silhouette edge, so it overlaps
  // the side plane); the one on the facing side is the far arm, tucked behind the chest (shoulder pulled in).
  const shU = (s: number) => (qg ? (s === qdir ? s * (sw - 0.0255) * kr * 0.8 : s * (sw - 0.014)) : s * (sw - 0.0255) * kr);
  const shR: Pt = profile ? U([-0.0043, shV - 0.03]) : U([shU(-1), shV - 0.0255]);
  const shL: Pt = profile ? U([-0.0043, shV - 0.03]) : U([shU(1), shV - 0.0255]);
  const Lpx = AB * unit;
  const hangX = childHangExtra(def);
  const hang = (s: number): Pt => (profile ? U([0.01 + 0.02 * Math.sin(ph + (s > 0 ? Math.PI : 0)) * (walk === undefined ? 0 : 6 * (pose.stride ?? 1)), shV - 0.03 - 2 * AB + 0.02]) : U([qg ? (s === qdir ? s * (sw - 0.0255 + 0.02 + hangX) * kr * 0.62 : s * (sw - 0.0255 + 0.04 + hangX)) : s * (sw - 0.0255 + 0.034 + hangX) * kr, shV - 0.0255 - 2 * AB + 0.02]));
  /** Run: arms pump opposite to the leg on their side (profile: elbow ~80 deg; front: hands rise to the chest and drop to the hip). */
  type ArmGeo = {Sh: Pt; E: Pt; T: Pt; cam?: number; finger?: boolean; fist?: 1 | -1; open?: 1 | -1; noThumb?: boolean};
  /** Three-quarter front, an arm pointing at the lens (`toCam`, not `behind`): drawn turned forward and over the torso (KIT-ARM-DEPTH A). */
  const qFwd = (a?: Arm): boolean => !!(qg && a?.toCam && !a.behind);
  const runArm = (s: number, Sh: Pt): ArmGeo => {
    const th = ph0 + (profile ? (s * dir < 0 ? Math.PI : 0) : s > 0 ? 0 : Math.PI);
    if (profile) {
      const al = 0.9 * Math.sin(th), be = al + 1.35 + 0.25 * Math.max(0, Math.sin(th));
      const e: Pt = [-0.0043 + AB * Math.sin(al), shV - 0.03 - AB * Math.cos(al)];
      return {Sh, E: U(e), T: U([e[0] + AB * Math.sin(be), e[1] - AB * Math.cos(be)])};
    }
    // The arm swinging forward points at the camera (`toCam`): its hand comes in toward the chest, large, on a short cone, and the
    // elbow goes onto the shoulder-hand line; the arm swinging back hangs low and outward as before.
    const fw = 0.5 + 0.5 * Math.sin(th), x0 = s * (sw - 0.0255), cam = fw * fw * (3 - 2 * fw);
    const T: Pt = [x0 + s * (0.05 - 0.02 * fw - 0.09 * cam), shV - 0.0255 - AB * (1.18 - 0.62 * fw)];
    const bent: Pt = [x0 + s * 0.075, shV - 0.0255 - AB * 0.72];
    return {Sh, E: U([lerp(bent[0], (x0 + T[0]) / 2, cam), lerp(bent[1], (shV - 0.0255 + T[1]) / 2, cam)]), T: U(T), cam};
  };
  const arm = (side: 'r' | 'l') => {
    const s = side === 'r' ? -1 : 1;
    const Sh = side === 'r' ? shR : shL;
    const a0 = side === 'r' ? pose.rArm : pose.lArm;
    // Turned body: a target near the body (hanging) scales with the torso (the near hand stays out at the silhouette edge, the far hand goes
    // in behind the chest); a target far from it (reaching, pointing) foreshortens by cos only.
    const qx = (q: Pt): Pt => {
      const dx = (q[0] - g[0]) / unit, ext = clamp01((Math.abs(dx) - (sw + 0.1)) / 0.25);
      return [g[0] + (q[0] - g[0]) * lerp(s === qdir ? 0.55 * kt : kt, kp, ext), q[1]];
    };
    if (a0 && qFwd(a0)) {
      // Three-quarter, arm at the lens (`toCam`; KIT-ARM-DEPTH A, 13 Nov 2026): the reach turns with the body. The front pose's shoulder-hand
      // offset is the arm's sideways and vertical part; the rest of the arm's length goes forward, which the turn shows by sin(turn) toward the
      // facing side and keeps foreshortened by cos(turn). The arm is painted over the torso (it is in front of the chest), the elbow on the line.
      const S0: Pt = a0.via ? [2 * a0.via[0] - a0.to[0], 2 * a0.via[1] - a0.to[1]] : Sh;
      const ox = (a0.to[0] - S0[0]) / unit, oy = (a0.to[1] - S0[1]) / unit, reach = 2 * AB * 0.95;
      const z = Math.sqrt(Math.max(0, reach * reach - ox * ox - oy * oy)) * Math.min(1, a0.toCam ?? 0);
      const T: Pt = [Sh[0] + (ox * kp + qdir * sinq * z) * unit, Sh[1] + oy * unit];
      const E: Pt = [(Sh[0] + T[0]) / 2, (Sh[1] + T[1]) / 2 + 0.015 * unit];
      return {Sh, E, T, cam: Math.max(0, Math.min(1, a0.toCam ?? 0)) * kp, finger: a0.finger};
    }
    const a = a0 && pose.quarter ? {...a0, to: qx(a0.to), via: a0.via && qx(a0.via)} : a0;
    if (!a && mode?.kind === 'run') return runArm(s, Sh);
    const T = a?.via ? a.to : reachTo(Sh, a?.to ?? hang(s), Lpx);
    const E = a?.via ?? (a ? ikElbow(Sh, T, Lpx, a.out ?? (profile ? -dir : s)) : ([lerp(Sh[0], T[0], 0.5) + (profile ? -dir * 0.02 * unit : s * 0.02 * unit), lerp(Sh[1], T[1], 0.5)] as Pt));
    return a?.toCam && !profile ? {Sh, E, T, cam: Math.max(0, Math.min(1, a.toCam)), finger: a.finger} : {Sh, E, T, fist: a?.fist, open: a?.open, noThumb: a?.noThumb};
  };
  const R = arm('r'), Lm = arm('l');
  const drawArm = (A: ArmGeo, hold: Prop | undefined, k: number, far: boolean, only?: 'upper' | 'lower') => {
    part = 70 + k * 10;
    const fillA = (color: string, pts: Pt[], outline = true, passes = 4) => {
      const q = far && clothHem !== undefined ? clipArmCloth(pts) : far && farHip ? clipFarHip(pts) : pts;
      if (q.length > 2) fill(color, q, outline, passes);
    };
    line = 70 + k * 10;
    const sl = far ? mixColor(sleeve, '#000000', 0.15) : sleeve;
    // Pointing at the viewer (`toCam`): a short cone that widens toward the hand, the hand up to 1.3x (CP-P09).
    const cam = A.cam ?? 0;
    const slc = cam ? mixColor(sl, '#ffffff', 0.16 * cam) : sl; // the nearer cone is lit lighter than the sleeve behind it, so it parts from the torso
    const shp = !!L?.shaped && !sil && !cam;
    if (shp) {
      // Shaped arm (InteriorLight.shaped): forearm with a belly that tapers to the wrist, a sleeve cut with a flared hem over it, a fist or an oval hand.
      const fx = A.T[0] - A.E[0], fy = A.T[1] - A.E[1], fl = Math.hypot(fx, fy) || 1, ux = fx / fl, uy = fy / fl;
      const ax = A.E[0] - A.Sh[0], ay = A.E[1] - A.Sh[1], al = Math.hypot(ax, ay) || 1;
      const forearmColor = o.longSleeves ? slc : skinHand;
      const drawFore = () => {
        part = 600 + k * 30;
        line = 600 + k * 30;
        // ZC2-SB-R3 elbow fix: the forearm starts AT the elbow joint (it began 0.05 U behind it, so its round start cap poked past
        // the upper arm as a ball), at the shared elbow width, so its cap is the same circle as the upper arm's end cap.
        fill(forearmColor, shapedLimb(A.E, A.T, ELBOW_W * unit, 0.044 * unit * (1 + ((L?.handScale ?? 1) - 1) * 0.75), {bulge: 0.018 * unit, peak: 0.3, asym: 0.25, capB: false}), true);
      };
      // ZC2-SB-R3 sleeves (front view, short sleeves): the sleeve no longer runs to the elbow as a slab over a round shoulder ball. A bare
      // upper arm runs shoulder -> elbow (round elbow cap); the sleeve is a tapered tube that starts on the shoulder seam (its cap sunk into
      // the torso line), ends at `SLEEVE_HEM` of the on-screen upper arm with a slightly flared, gently curved hem perpendicular to the bone,
      // and drops a small shadow on the skin under the cuff; the forearm comes out at the elbow, under the upper arm. Profile and long sleeves
      // keep the r6 sleeve-to-elbow drawing.
      const frontShort = !profile && !o.longSleeves;
      const dX = ax / al, dY = ay / al;
      if (only !== 'upper') drawFore();
      if (only !== 'lower' && frontShort) {
        part = 900 + k * 20;
        line = 900 + k * 20;
        const s0 = Math.min(0.022 * unit, al * 0.25), a0: Pt = [A.Sh[0] + dX * s0, A.Sh[1] + Math.max(dY * s0, 0.02 * unit)]; // cap top level with the shoulder line
        const hl = Math.max(al * SLEEVE_HEM, Math.min(al, 0.07 * unit)), hem: Pt = [A.Sh[0] + dX * hl, A.Sh[1] + dY * hl];
        const u0 = Math.max(s0, hl * 0.5); // the bare upper arm starts inside the sleeve, so no skin shows above the shoulder seam
        fill(skinHand, shapedLimb([A.Sh[0] + dX * u0, A.Sh[1] + dY * u0], A.E, 0.074 * unit, ELBOW_W * unit, {bulge: 0.006 * unit, peak: 0.3, asym: 0.15, capB: true}), true);
        const nX = -dY, nY = dX, hw = 0.046 * unit;
        washAt(p, seed * 1000 + 910 + k * 20, mixColor(skinHand, L?.ink ?? INK, 0.55), 150, [[hem[0] - nX * hw, hem[1] - nY * hw], [hem[0] + nX * hw, hem[1] + nY * hw], [hem[0] + nX * hw * 0.8 + dX * 0.032 * unit, hem[1] + nY * hw * 0.8 + dY * 0.032 * unit], [hem[0] - nX * hw * 0.8 + dX * 0.032 * unit, hem[1] - nY * hw * 0.8 + dY * 0.032 * unit]], 0.3, 0.3);
        part = 620 + k * 30;
        line = 620 + k * 30;
        const tube = shapedLimb(a0, hem, 0.096 * unit, 0.082 * unit, {bulge: 0.01 * unit, peak: 0.3, asym: 0.15, capB: false, flare: 0.014 * unit});
        tube.push([hem[0] + dX * 0.012 * unit, hem[1] + dY * 0.012 * unit]); // the hem wraps the arm: a shallow curve toward the hand
        fill(slc, tube, true);
        fold(sl, [[hem[0] - nX * 0.036 * unit - dX * 0.014 * unit, hem[1] - nY * 0.036 * unit - dY * 0.014 * unit], [hem[0] - dX * 0.004 * unit, hem[1] - dY * 0.004 * unit], [hem[0] + nX * 0.036 * unit - dX * 0.014 * unit, hem[1] + nY * 0.036 * unit - dY * 0.014 * unit]]);
      } else if (only !== 'lower') {
        part = 620 + k * 30;
        line = 620 + k * 30;
        const hemEnd: Pt = [A.E[0] + (ax / al) * 0.012 * unit, A.E[1] + (ay / al) * 0.012 * unit];
        fill(slc, shapedLimb(A.Sh, hemEnd, 0.1 * unit, 0.078 * unit, {bulge: 0.012 * unit, peak: 0.35, asym: 0.15, capB: false, flare: 0.012 * unit}), true);
        fold(sl, [[A.E[0] - (ax / al) * 0.05 * unit - (ay / al) * 0.03 * unit, A.E[1] - (ay / al) * 0.05 * unit + (ax / al) * 0.03 * unit], [A.E[0] - (ax / al) * 0.03 * unit, A.E[1] - (ay / al) * 0.03 * unit], [A.E[0] - (ax / al) * 0.05 * unit + (ay / al) * 0.03 * unit, A.E[1] - (ay / al) * 0.05 * unit - (ax / al) * 0.03 * unit]]);
      }
      if (only === 'upper') return A.T;
      const ang = Math.atan2(uy, ux);
      // HL1 hands (ZCONDO2, 4 Nov 2026): flat skin with one warm shade down the side away from the key and the arm's falloff, no cool
      // form glaze (it left a purple bruise on the small round shape); one smooth outline, short dark strokes only.
      const hu = unit * (L?.handScale ?? 1); // hand-only scale about the wrist (default 1)
      const dark = mixColor(skinHand, L?.ink ?? INK, 0.5);
      const handFill = (pts: Pt[]) => {
        const base = toneOf(skinHand, L);
        if (L?.under) hardFill(p, seed * 1000 + part + 500, base, pts);
        solid(p, seed * 1000 + ++part, base, pts, 4, 0, 0.2);
        if (L) {
          const sh = planeBand(pts, formDir(pts, L.key), 0.58);
          if (sh.length) glaze(p, 7_100_000 + seed * 1000 + part, mixColor(base, '#5a3020', 0.4), 80, sh, {border: 0.15, bleed: 0.03, split: 0});
          const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length, top = U([0, shV])[1];
          const v = clamp01((cy - top) / Math.max(1, g[1] - top));
          if (v > 0.25) glaze(p, 7_900_000 + seed * 1000 + part, palOf(L).falloff, palOf(L).falloffOpacity * ((v - 0.25) / 0.75), pts, {border: 0.1, bleed: 0.02, split: 0});
        }
        inkLine(p, seed * 1000 + ++line, pts, {weight: L ? palOf(L).lineOuter : 1.0, color: lineOf(base, L)});
      };
      const strokes = (list: Pt[][]) => list.forEach((cr) => inkLine(p, seed * 1000 + ++line, cr, {closed: false, weight: 1.5, curve: 0.5, color: dark}));
      part = 660 + k * 30;
      line = 660 + k * 30;
      if (A.fist) {
        const F = fistParts(A.T, ang, hu, A.fist);
        handFill(F.back);
        strokes([...F.creases, F.thumbCrease]);
        return [A.T[0] + ux * 0.05 * hu, A.T[1] + uy * 0.05 * hu] as Pt;
      }
      if (A.open) {
        const H = openHandParts(A.T, ang, hu, A.open, A.noThumb);
        if (A.noThumb) { handFill(H.palm); strokes(H.creases); return [A.T[0] + ux * 0.06 * hu, A.T[1] + uy * 0.06 * hu] as Pt; }
        handFill(H.palm);
        strokes([...H.creases, H.thumbCrease]);
        return [A.T[0] + ux * 0.06 * hu, A.T[1] + uy * 0.06 * hu] as Pt;
      }
      // relaxed hand (no fist/open given): the same bean, finger grooves only (it was a plain oval, two of them clasped read as a dough ball)
      const R0 = fistParts(A.T, ang, hu, k === 0 ? -1 : 1);
      handFill(R0.back);
      strokes(R0.creases);
      return [A.T[0] + ux * 0.045 * hu, A.T[1] + uy * 0.045 * hu] as Pt;
    }
    const upper = () => fillA(slc, capsule(A.Sh, A.E, 0.08 * unit, (cam ? 0.068 + 0.03 * cam : 0.068) * unit), true);
    const fore = () => fillA(o.longSleeves ? slc : skinHand, capsule(A.E, A.T, (cam ? 0.066 + 0.04 * cam : 0.066) * unit, (cam ? 0.056 + 0.06 * cam : 0.056) * unit), true);
    // Elbow joint (KIT-ARM-DEPTH D, 13 Nov 2026): a whole arm paints the forearm first and the sleeve over it, so the sleeve's round end
    // (0.068 U) covers the forearm's start cap (0.066 U) on the same elbow point: one round elbow, no skin cap and outline over the cloth.
    // The brush seeds of both parts are the ones they had before. An arm at the lens (`cam`) keeps its nearer forearm on top; a split arm
    // (`only`, behind the torso) is unchanged.
    const b0 = 70 + k * 10;
    if (!only && !cam) {
      part = line = b0 + 1;
      fore();
      part = line = b0;
      upper();
      part = line = b0 + 2;
    } else {
      if (only !== 'lower') upper();
      if (only === 'upper') return A.T;
      fore();
    }
    if (o.gear?.wideSleeves) {
      // Kimono sleeve: the cloth hangs in a wide flap round the forearm, the hand comes out of its opening.
      part = 70 + k * 10 + 5;
      const ex = A.T[0] - A.E[0], ey = A.T[1] - A.E[1], el = Math.hypot(ex, ey) || 1, nx = -ey / el, ny = ex / el;
      const w1 = 0.07 * unit, w2 = 0.11 * unit, dr = 0.1 * unit;
      fillA(sl, [[A.E[0] - nx * w1, A.E[1] - ny * w1], [A.E[0] + nx * w1, A.E[1] + ny * w1], [A.T[0] + nx * w2, A.T[1] + ny * w2 + dr], [A.T[0] - nx * w2, A.T[1] - ny * w2 + dr]], true);
    }
    if (o.longSleeves && L) {
      // Elbow crease: two short strokes where the sleeve bunches, on the inside of the bend.
      const ax = A.E[0] - A.Sh[0], ay = A.E[1] - A.Sh[1], al = Math.hypot(ax, ay) || 1, ux = ax / al, uy = ay / al;
      for (const d of [0.025, 0.06]) fold(sl, [[A.E[0] - ux * d * unit - uy * 0.03 * unit, A.E[1] - uy * d * unit + ux * 0.03 * unit], [A.E[0] - ux * (d - 0.015) * unit, A.E[1] - uy * (d - 0.015) * unit], [A.E[0] - ux * d * unit + uy * 0.025 * unit, A.E[1] - uy * d * unit - ux * 0.025 * unit]]);
    }
    const ang = Math.atan2(A.T[1] - A.E[1], A.T[0] - A.E[0]);
    const hand: Pt = [A.T[0] + Math.cos(ang) * 0.03 * unit, A.T[1] + Math.sin(ang) * 0.03 * unit];
    if (hold?.kind === 'torch') drawTorch(p, seed * 1000 + 200 + k * 10, hand, hold.angle, unit, hold.on);
    if (hold?.kind === 'phone') fillA('#1f2326', [[hand[0] - 0.035 * unit, hand[1] - 0.07 * unit], [hand[0] + 0.035 * unit, hand[1] - 0.07 * unit], [hand[0] + 0.035 * unit, hand[1] + 0.06 * unit], [hand[0] - 0.035 * unit, hand[1] + 0.06 * unit]]);
    if (hold?.kind === 'umbrella') drawUmbrella(p, seed * 1000 + 220 + k * 10, hand, hold.tip, unit);
    part = 70 + k * 10 + 8;
    const hs = cam ? 1 + 0.3 * cam : 1;
    fillA(o.coat ? '#26292c' : skinHand, ell(hand[0], hand[1], 0.045 * unit * hs, 0.052 * unit * hs, 14, ang), true, o.coat ? 6 : 4);
    if (A.finger && cam) {
      // The pointing finger seen end-on: a small round tip on the fist, toward the viewer.
      part = 70 + k * 10 + 9;
      // Less than fully end-on (three-quarter, `cam` < 1): the finger also shows its length along the arm (KIT-ARM-DEPTH A).
      const fl = 1 - cam, tip = ell(hand[0] + Math.cos(ang) * 0.04 * unit * hs * fl, hand[1] - 0.03 * unit * hs * cam + Math.sin(ang) * 0.04 * unit * hs * fl, (0.022 + 0.03 * fl) * unit * hs, 0.024 * unit * hs, 10, fl > 0 ? ang : undefined);
      fillA(o.coat ? '#26292c' : mixColor(skinHand, '#7a4a30', 0.18), tip, true, 4);
    }
    return hand;
  };

  // Profile: the far arm goes behind the torso; redraw order handled by drawing it first (before head and near arm).
  const nearSide: 'r' | 'l' = dir > 0 ? 'r' : 'l';
  /** Three-quarter front: the arm on the far side of the turned body is painted under the torso, a shade darker (the near one over it). */
  const quarterFar: 'r' | 'l' | undefined = pose.quarter ? (qdir < 0 ? 'r' : 'l') : undefined;
  let rHand: Pt = R.T, lHand: Pt = Lm.T;
  if (profile) {
    // The far arm is painted over the torso but is hidden behind it when it hangs; draw it slightly darker.
    if (nearSide === 'r') lHand = drawArm(Lm, pose.lHold, 1, true);
    else rHand = drawArm(R, pose.rHold, 0, true);
    if (farUnder && !legsOver) paintLegs();
  } else {
    if (pose.rArm?.behind) rHand = drawArm(R, pose.rHold, 0, true, pose.rArm.behind === 'upper' ? 'upper' : undefined);
    else if (quarterFar === 'r' && !qFwd(pose.rArm)) rHand = drawArm(R, pose.rHold, 0, true);
    if (pose.lArm?.behind) lHand = drawArm(Lm, pose.lHold, 1, true, pose.lArm.behind === 'upper' ? 'upper' : undefined);
    else if (quarterFar === 'l' && !qFwd(pose.lArm)) lHand = drawArm(Lm, pose.lHold, 1, true);
  }

  // ----------------------------------------------------------------- torso layers
  part = 40;
  line = 40;
  const kneeV = legs[0].knee[1];
  const G = o.gear;
  if (G?.pack) {
    // Delivery box on the back, behind the torso (front: wider than the shoulders; profile: behind the back).
    const sp = part, sl = line;
    part = 100;
    line = 100;
    const bw = Math.max(sw + 0.04, 0.2);
    if (!profile) fill(G.pack, Uq([[-bw, shV - 0.42], [bw, shV - 0.42], [bw, shV + 0.1], [-bw, shV + 0.1]]));
    else fill(G.pack, Uq([[-0.45, shV - 0.4], [-0.06, shV - 0.4], [-0.06, shV + 0.1], [-0.45, shV + 0.1]]));
    if (!sil) inkLine(p, seed * 1000 + ++line, profile ? Uq([[-0.45, shV - 0.12], [-0.06, shV - 0.12]]) : Uq([[-bw, shV - 0.12], [bw, shV - 0.12]]), {closed: false, weight: 0.9, curve: 0, color: mixColor(toneOf(G.pack, L), INK, 0.5)});
    part = sp;
    line = sl;
  }
  if (!profile) {
    if (!o.skirt && !o.coat) fill(o.pants, Uq([[-hw - 0.0085, hip0 + 0.0255], [hw + 0.0085, hip0 + 0.0255], [hw, crotch0], [-hw, crotch0]]), false);
    if (o.skirt) {
      const kx = Math.abs(legs[0].knee[0]);
      // Seated, kneeling or on the floor the skirt drapes over the thighs to the knee instead of hanging to a fixed height.
      const lap = mode && mode.kind !== 'run' && mode.kind !== 'squat' ? Math.min(o.skirtHem ?? 9, kneeV + (mode.kind === 'floor' ? 0.02 : -0.03)) : undefined;
      const hemF = lap ?? o.skirtHem ?? runHem ?? Math.max(kneeV - 0.19 * (1 - c), 0.3 * c + 0.2);
      const skirtPts = [...Uq([[-hw - 0.0085, hip0 + 0.034], [hw + 0.0085, hip0 + 0.034]]), ...(qg ? Sq(curvedEdge(kx + 0.06, -kx - 0.06, hemF, udiv(kx + 0.06), 0.03 * sinq, 8)) : Sq([[kx + 0.06, hemF], [-kx - 0.06, hemF]]))];
      fill(o.skirt, skirtPts);
      if (qg) planeShapes.push({pts: skirtPts, color: o.skirt});
    }
    // The hem of a turned body curves: lowest at the edge between the planes (the nearest part), rising toward both ends.
    const top: Pt[] = qg
      ? [[-sw + 0.017, shV], [sw - 0.017, shV], [sw, shV - 0.034], ...curvedEdge(hw + 0.013, -hw - 0.013, hip0, udiv(hw + 0.013), 0.016 * sinq), [-sw, shV - 0.034]]
      : [[-sw + 0.017, shV], [sw - 0.017, shV], [sw, shV - 0.034], [hw + 0.013, hip0], [-hw - 0.013, hip0], [-sw, shV - 0.034]];
    if (coat) {
      const hem = Math.max(kneeV - 0.05, 0.12);
      const coatPts = [...Uq([[-sw + 0.017, shV], [sw - 0.017, shV], [sw + 0.0085, shV - 0.0425]]), ...(qg ? curvedEdge(hw + 0.085 + 0.08 * c, -hw - 0.085 - 0.08 * c, hem, udiv(hw + 0.085 + 0.08 * c), 0.035 * sinq).map(S) : [S([hw + 0.085 + 0.08 * c, hem]), S([-hw - 0.085 - 0.08 * c, hem])]), U([-sw - 0.0085, shV - 0.0425])];
      fill(coat, coatPts);
      if (qg) planeShapes.push({pts: coatPts, color: coat});
      if (!sil) inkLine(p, seed * 1000 + ++line, [U([0, shV - 0.05]), U([0, hip0 - 0.02]), S([0, hem])], {closed: false, weight: 0.9, curve: 0.1});
      if (pose.wet && !sil) for (let i = 0; i < 6; i++) inkLine(p, seed * 1000 + 60 + i, [U([-0.12 + i * 0.05, shV - 0.06 - 0.07 * (i % 3)]), U([-0.12 + i * 0.05, shV - 0.12 - 0.07 * (i % 3)])], {color: '#8fa6b8', weight: 0.8, closed: false});
    } else {
      fill(o.shirt, Uq(top));
      if (qg) planeShapes.push({pts: Uq(top), color: o.shirt});
      if (o.jacket) {
        for (const s of [-1, 1]) fill(o.jacket, Uqf([[s * (sw - 0.017), shV], [s * 0.051, shV], [s * 0.0425, hip0 - 0.0255], [s * (hw + 0.021), hip0 - 0.0255], [s * sw, shV - 0.034]]));
      }
      if (o.apron) fill(o.apron, Uqf([[-0.085, shV - 0.0935], [0.085, shV - 0.0935], [0.11, hip0 - 0.136], [-0.11, hip0 - 0.136]]), true, 8);
      // VD18 drape: the shirt sags under the collar; a crouch bunches it at the waist.
      if (L?.shaped && !sil) {
        // Shirt folds (shaped look): pull creases from the armpits, a belly crease and a bunch at the hem.
        for (const s2 of [-1, 1]) {
          fold(o.shirt, Uq([[s2 * (sw - 0.03), shV - 0.07], [s2 * (sw - 0.055), shV - 0.115], [s2 * (sw - 0.05), shV - 0.17]]));
          fold(o.shirt, Uq([[s2 * (hw - 0.01), hip0 + 0.09], [s2 * (hw * 0.55), hip0 + 0.07], [s2 * 0.03, hip0 + 0.085]]));
        }
        fold(o.shirt, Uq([[-0.07, shV - 0.17], [-0.01, shV - 0.185], [0.06, shV - 0.17]]));
      }
      fold(o.shirt, Uq([[-0.045, shV - 0.05], [0, shV - 0.075], [0.045, shV - 0.05]]));
      if (c > 0.4) for (const dv of [0.05, 0.09]) fold(o.jacket ?? o.shirt, Uq([[-hw + 0.01, hip0 + dv], [-hw * 0.4, hip0 + dv - 0.015], [-0.07, hip0 + dv]]));
      if (o.jacket) for (const s2 of [-1, 1]) fold(o.jacket, Uq([[s2 * 0.12, shV - 0.03], [s2 * 0.14, (shV + hip0) / 2], [s2 * 0.13, hip0 + 0.01]]));
    }
  } else {
    if (!o.skirt && !o.coat) fill(o.pants, Uq([[-0.21 * HD, hip0 + 0.0255], [0.18 * HD, hip0 + 0.0255], [0.17 * HD, crotch0], [-0.24 * HD, crotch0 - 0.0085]]), false);
    if (o.skirt && mode && mode.kind !== 'run') {
      // Seated / kneeling / squatting: the skirt covers the thigh, from the waist to just over the near knee, and falls behind to the seat.
      const kn = legs[legs.length - 1].knee;
      const front: Pt = [Math.max(0.3 * HD, kn[0] + 0.03), Math.min(kn[1] - 0.03, o.skirtHem ?? 9)], back: Pt = [-0.32 * HD + hipU, Math.min(hipV - 0.06, kn[1])];
      fill(o.skirt, [...Uq([[-0.24 * HD, hip0 + 0.034], [0.2 * HD, hip0 + 0.034]]), S(front), S(back)], true, 8);
    } else if (o.skirt) fill(o.skirt, [...Uq([[-0.24 * HD, hip0 + 0.034], [0.2 * HD, hip0 + 0.034]]), ...Sq([[pHemX[1], o.skirtHem ?? kneeV - 0.19], [pHemX[0], o.skirtHem ?? kneeV - 0.19]])], true, 8);
    if (coat) {
      // The hem hangs to the knee when standing and follows the torso when bent (hands on knees), blended by `bend`:
      // a hem pinned to the knee in plate space reads as a kicked leg (SS-R3.2 S04-SH01 defect).
      const hem = Math.max(kneeV - 0.05, 0.12);
      const hemPt = (u: number, v: number): Pt => {
        const a = S([u, hem]), b = U([u, v]);
        return [lerp(a[0], b[0], bend), lerp(a[1], b[1], bend)];
      };
      fill(coat, [...Uq([[-0.19 * HD, shV], [0.14 * HD, shV], [0.24 * HD, shV - 0.0935], [0.2 * HD, hip0]]), hemPt(0.3 * HD + 0.06 * bend, hip0 - 0.14), hemPt(-0.32 * HD, hip0 - 0.14), ...Uq([[-0.26 * HD, hip0], [-0.24 * HD, shV - 0.064]])]);
      if (pose.wet && !sil) for (let i = 0; i < 5; i++) inkLine(p, seed * 1000 + 60 + i, [U([-0.06 + i * 0.03, shV - 0.06 - 0.08 * (i % 3)]), U([-0.06 + i * 0.03, shV - 0.13 - 0.08 * (i % 3)])], {color: '#8fa6b8', weight: 0.8, closed: false});
    } else {
      // The shirt and jacket reach the top of the trousers (hip0 + 0.0255): a shorter hem left a notch at the hip in
      // profile, where the far hanging hand showed through (SS-R3.2 profile hip gap, S03-SH07 and S04-SH02).
      fill(o.shirt, Uq([[-0.18 * HD, shV], [0.14 * HD, shV], [0.22 * HD, shV - 0.085], [0.18 * HD, hip0 + 0.0255], [-0.2 * HD, hip0 + 0.0255], [-0.21 * HD, shV - 0.064]]));
      // The jacket hem reaches the trouser front (0.18 H) at the hip: a shorter front corner left a step in the profile
      // silhouette (Boss r3, S03-SH07 and S04-SH02 thigh notch).
      if (o.jacket) fill(o.jacket, Uq([[-0.19 * HD, shV], [0.12 * HD, shV], [0.16 * HD, shV - 0.085], [0.18 * HD, hip0 + 0.0255], [-0.23 * HD, hip0 + 0.0255], [-0.23 * HD, shV - 0.064]]));
      if (o.apron) fill(o.apron, Uq([[0.18 * HD, shV - 0.0935], [0.24 * HD, shV - 0.085], [0.26 * HD, hip0 - 0.136], [0.18 * HD, hip0 - 0.136]]), true, 8);
    }
  }

  // ----------------------------------------------------------------- wardrobe gear (wardrobe.ts): absent on every existing character
  if (G && !coat && (G.collar || G.tie || G.belt || G.overcoat || G.drape || G.badge || G.pockets)) {
    const sp = part, sl = line;
    part = 100;
    line = 100;
    /** Front torso half-width at height v. */
    const edge = (v: number) => sw + (hw + 0.013 - sw) * clamp01((shV - 0.034 - v) / (shV - 0.034 - hip0));
    const stripe = (color: string, pts: Pt[], weight = 1.0) => { if (!sil) inkLine(p, seed * 1000 + ++line, pts, {closed: false, weight, curve: 0.3, color}); };
    const crease = (base: string, pts: Pt[]) => stripe(mixColor(toneOf(base, L), INK, 0.5), pts, 0.8);
    const bandV1 = hip0 - 0.015; // over the shirt hem / trouser top seam
    if (!profile) {
      if (G.drape) {
        fill(G.drape, Uqf([[0, shV - 0.005], [sw - 0.017, shV], [sw, shV - 0.034], [0.05, hip0 + 0.01], [-hw - 0.013, hip0 + 0.02], [-hw - 0.013, hip0 + 0.15]]));
        for (const k of [1, 2, 3]) crease(G.drape, Uqf([[0.04 * k, shV - 0.01 - 0.03 * k], [-hw + 0.02 + 0.045 * k, hip0 + 0.12 - 0.03 * k]]));
      }
      const col = G.collar;
      if (col?.kind === 'v') {
        const d = col.depth ?? 0.17;
        const ch = clamp01(pose.collarHide ?? 0), cm = (c: string) => (ch > 0 ? mixColor(c, o.shirt, ch) : c);
        fill(cm(col.trim ?? def.head.skin), Uqf([[-0.05, shV + 0.004], [0.05, shV + 0.004], [0, shV - d]]), false, 6);
        for (const sd of [-1, 1]) fill(cm(col.color), Uqf([[sd * 0.04, shV + 0.004], [sd * 0.115, shV - 0.004], [sd * 0.03, shV - d], [0, shV - d + 0.012]]), true, 6);
      } else if (col?.kind === 'sailor') {
        for (const sd of [-1, 1]) {
          fill(col.color, Uqf([[sd * 0.045, shV + 0.004], [sd * (sw - 0.02), shV], [sd * (sw - 0.03), shV - 0.055], [sd * 0.012, shV - 0.2], [0, shV - 0.17]]), true, 6);
          if (col.trim) stripe(col.trim, Uqf([[sd * (sw - 0.045), shV - 0.014], [sd * (sw - 0.052), shV - 0.05], [sd * 0.02, shV - 0.17]]), 1.1);
        }
      } else if (col?.kind === 'hood' && !pose.hoodUp) {
        fill(col.color, Uqf([[-0.095, shV + 0.025], [-0.085, shV - 0.06], [-0.04, shV - 0.115], [0, shV - 0.125], [0.04, shV - 0.115], [0.085, shV - 0.06], [0.095, shV + 0.025], [0.055, shV + 0.01], [0.04, shV - 0.045], [0, shV - 0.07], [-0.04, shV - 0.045], [-0.055, shV + 0.01]]), true, 6);
        for (const sd of [-1, 1]) stripe(col.trim ?? '#e8e4da', Uqf([[sd * 0.035, shV - 0.085], [sd * 0.042, shV - 0.17], [sd * 0.036, shV - 0.23]]), 1.2);
      }
      if (G.tie) {
        const tc = G.tie.color;
        if (G.tie.bow) {
          const y = shV - 0.19;
          fill(tc, Uqf([[0, y], [-0.07, y + 0.045], [-0.075, y - 0.045]]), true, 6);
          fill(tc, Uqf([[0, y], [0.07, y + 0.045], [0.075, y - 0.045]]), true, 6);
          fill(tc, Uqf([[-0.016, y + 0.016], [0.016, y + 0.016], [0.016, y - 0.016], [-0.016, y - 0.016]]), true, 6);
        } else {
          fill(tc, Uqf([[-0.018, shV - 0.045], [0.018, shV - 0.045], [0.014, shV - 0.075], [-0.014, shV - 0.075]]), true, 6);
          fill(tc, Uqf([[-0.014, shV - 0.075], [0.014, shV - 0.075], [0.027, shV - 0.2], [0, shV - 0.235], [-0.027, shV - 0.2]]), true, 6);
        }
      }
      if (G.belt) {
        const h = G.belt.h ?? 0.035, v0 = bandV1 + h;
        if (qg) {
          const ub = udiv(edge(bandV1)), a1 = 0.016 * sinq;
          fill(G.belt.color, [...curvedEdge(-edge(v0), edge(v0), v0, ub, a1).map(U), ...curvedEdge(edge(bandV1), -edge(bandV1), bandV1, ub, a1).map(U)]);
        } else fill(G.belt.color, Uqf([[-edge(v0), v0], [edge(v0), v0], [edge(bandV1), bandV1], [-edge(bandV1), bandV1]]));
        if (G.belt.buckle) fill(G.belt.buckle, Uqf([[-0.03, v0 - 0.004], [0.03, v0 - 0.004], [0.03, bandV1 + 0.004], [-0.03, bandV1 + 0.004]]), true, 6);
      }
      if (G.overcoat) {
        const hem = Math.min(G.overcoat.hem, kneeV + 0.12);
        for (const sd of [-1, 1]) fill(G.overcoat.color, [U([sd * (sw - 0.017), shV]), U([sd * 0.045, shV]), S([sd * 0.075, hem]), S([sd * (hw + 0.085 + 0.08 * c), hem]), U([sd * (sw + 0.0085), shV - 0.0425])]);
        if (!sil) for (const sd of [-1, 1]) crease(G.overcoat.color, Uqf([[sd * 0.07, hip0 - 0.06], [sd * 0.125, hip0 - 0.06], [sd * 0.125, hip0 - 0.17]]));
      }
      if (G.badge) fill(G.badge, Uqf([[0.04, shV - 0.075], [0.1, shV - 0.075], [0.1, shV - 0.105], [0.04, shV - 0.105]]), true, 6);
      if (G.pockets) for (const sd of [-1, 1]) crease(o.shirt, Uqf([[sd * 0.04, shV - 0.13], [sd * 0.1, shV - 0.13], [sd * 0.1, shV - 0.2], [sd * 0.04, shV - 0.2], [sd * 0.04, shV - 0.13]]));
    } else {
      if (G.drape) {
        fill(G.drape, Uq([[-0.18 * HD, shV], [0.14 * HD, shV], [0.22 * HD, shV - 0.085], [0.18 * HD, hip0 + 0.0255], [-0.05 * HD, hip0 + 0.0255], [-0.21 * HD, hip0 + 0.16]]));
        for (const k of [1, 2]) crease(G.drape, Uq([[-0.1 * HD + 0.07 * HD * k, shV - 0.04 * k], [-0.12 * HD + 0.05 * HD * k, hip0 + 0.12 - 0.02 * k]]));
      }
      const col = G.collar;
      if (col?.kind === 'hood' && !pose.hoodUp) fill(col.color, Uq([[-0.075, shV + 0.04], [-0.01, shV + 0.045], [0.0, shV - 0.05], [-0.09, shV - 0.12], [-0.16, shV - 0.06], [-0.15, shV]]), true, 6);
      else if (col?.kind === 'sailor') {
        fill(col.color, Uq([[-0.19 * HD, shV], [0.02, shV], [0.03, shV - 0.04], [-0.1, shV - 0.15], [-0.2 * HD, shV - 0.14]]), true, 6);
        if (col.trim) stripe(col.trim, Uq([[-0.2 * HD + 0.01, shV - 0.125], [-0.09, shV - 0.135], [0.02, shV - 0.035]]), 1.1);
      }
      if (G.belt) {
        const h = G.belt.h ?? 0.035, v0 = bandV1 + h;
        fill(G.belt.color, Uq([[-0.2 * HD, v0], [0.185 * HD, v0], [0.185 * HD, bandV1], [-0.2 * HD, bandV1]]));
      }
      if (G.overcoat) {
        const hem = Math.min(G.overcoat.hem, kneeV + 0.12);
        const hemP = (u: number): Pt => {
          const a = S([u, hem]), b = U([u, hip0 - 0.14]);
          return [lerp(a[0], b[0], bend), lerp(a[1], b[1], bend)];
        };
        fill(G.overcoat.color, [...Uq([[-0.19 * HD, shV], [0.14 * HD, shV], [0.24 * HD, shV - 0.0935], [0.22 * HD, hip0]]), hemP(0.27 * HD + 0.06 * bend), hemP(-0.32 * HD), ...Uq([[-0.26 * HD, hip0], [-0.24 * HD, shV - 0.064]])]);
      }
    }
    part = sp;
    line = sl;
  }

  // ----------------------------------------------------------------- turned body: the side plane
  // The garment on the side away from the facing direction is the side of the torso block, in shadow: every cloth shape is shaded where it
  // lies beyond the edge between the planes (a straight line from the shoulder to the hip, carried on down a coat), and the edge itself is
  // a thin fold line. Painted over the gear (belt, collar) so those darken with the cloth; the near arm is painted over it later.
  if (qg && !sil && !profile) {
    const D1 = U([udiv(sw), shV - 0.034]), D2 = U([udiv(hw + 0.013), hip0]), N = U([-qdir * sw, shV - 0.034]);
    const ext = (t: number): Pt => [D1[0] + (D2[0] - D1[0]) * t, D1[1] + (D2[1] - D1[1]) * t];
    planeShapes.forEach(({pts, color}, i) => {
      const part2 = clipHalf(pts, D1, D2, N);
      if (part2.length > 2) glaze(p, 7_700_000 + seed * 1000 + i, mixColor(color, '#0a0d12', 0.22), 110 + 60 * sinq, part2, {border: 0.25, bleed: 0.02});
    });
    inkLine(p, seed * 1000 + 450, [ext(0.04), ext(1)], {closed: false, weight: 0.8, curve: 0.2, color: mixColor(toneOf(coat ?? o.shirt, L), INK, 0.55)});
  }

  // ----------------------------------------------------------------- neck and head
  part = 120;
  line = 120;
  const nw = o.coat ? (profile ? 0.16 * HD : 0.24 * HD) : profile ? 0.08 * HD : 0.1 * HD;
  const nx = profile ? -0.08 * HD : 0;
  const scoop = !!L?.shaped && !sil && !coat; // crew-neck shirt: the neck ends in a U of chest skin and a collar band covers its foot
  const neckC = coat ?? (L ? mixColor(def.head.skin, palOf(L).shadow, 0.3) : def.head.skin);
  if (pose.softNeck && !coat && !sil) {
    // one skin tone with the face (mottled like it), narrow under the jaw and flaring into the collar, so it is neither a darker block nor cut off from the shirt
    const neck = Uq([[nx - nw, chin + 0.051], [nx + nw, chin + 0.051], [nx + nw * 1.18, shV - 0.03], [nx + nw * 1.42, shV + 0.012], [nx - nw * 1.42, shV + 0.012], [nx - nw * 1.18, shV - 0.03]]);
    const nt = mixColor(toneOf(def.head.skin, L), '#6a4a58', 0.03); // toneOf: the same ambient pull the face and shirt get, so it matches the face as painted
    solid(p, seed * 1000 + ++part, nt, neck, 6, 0.04, 0.1);
    if (L) glaze(p, 7_800_000 + seed * 1000 + part, mixColor(nt, '#4a3a58', 0.4), 85, Uq([[nx - nw, chin + 0.051], [nx + nw, chin + 0.051], [nx + nw, chin + 0.051 + 0.45 * (shV - chin - 0.051)], [nx - nw, chin + 0.051 + 0.3 * (shV - chin - 0.051)]]), {border: 0.1, bleed: 0.3});
  } else if (scoop) {
    const dip = (u: number): Pt => [nx + u * nw, shV - 0.013 - 0.026 * (1 - u * u)];
    const u = [0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75];
    fill(neckC, Uq([[nx - nw, chin + 0.051], [nx + nw, chin + 0.051], [nx + nw + 0.0043, shV - 0.013], ...u.map(dip), [nx - nw - 0.0043, shV - 0.013]]), false, 6);
    const rim = (d: number): Pt[] => [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1].map((q) => [nx + q * (nw + 0.016), shV - 0.006 - 0.026 * (1 - q * q) - d]);
    fill(o.shirt, Uq([...rim(0), ...rim(0.016).reverse()]), true, 4);
  } else {
    fill(neckC, Uq([[nx - nw, chin + 0.051], [nx + nw, chin + 0.051], [nx + nw + 0.0043, shV - 0.013], [nx - nw - 0.0043, shV - 0.013]]), false, 6);
  }
  const nod = pose.nod ?? [0, 0];
  const Kh = K * (pose.headSize ?? 1);
  const hc = U([nx + nod[0] * K, chin + CHIN * Kh - nod[1] * K]);
  const Kpx = Kh * unit;
  // The head stays upright (decal), only its centre follows the body transform. Head cock (FigPose.headCock): the head and hat rotate
  // about the neck top (0.051 m above the chin on the head's centre line); absent or 0 = no transform, so the strokes are unchanged.
  const cock = pose.headCock ? (pose.headCock * Math.PI) / 180 : 0;
  const pivot: Pt = [hc[0], hc[1] + (CHIN * Kh - 0.051) * unit];
  const rotHead = ([x, y]: Pt): Pt => cock === 0 ? [x, y] : [pivot[0] + (x - pivot[0]) * Math.cos(cock) - (y - pivot[1]) * Math.sin(cock), pivot[1] + (x - pivot[0]) * Math.sin(cock) + (y - pivot[1]) * Math.cos(cock)];
  if (cock !== 0) {
    p.brush.push();
    p.brush.translate(pivot[0], pivot[1]);
    p.brush.rotate(cock);
    p.brush.translate(-pivot[0], -pivot[1]);
  }
  if (sil) {
    // Bare short-haired human contour: crown volume, temples, tapered jaw and chin. No facial marks.
    // Only the silhouette branch changes; ordinary cast keeps its existing head rendering.
    const outline: Pt[] = [[0,-1.08],[0.3,-1.06],[0.56,-0.91],[0.72,-0.64],[0.77,-0.28],
      [0.73,0.12],[0.68,0.49],[0.52,0.88],[0.3,1.12],[0,1.22],[-0.3,1.12],
      [-0.52,0.88],[-0.68,0.49],[-0.73,0.12],[-0.77,-0.28],[-0.73,-0.64],[-0.57,-0.91],[-0.28,-1.07]];
    solid(p, seed + 1, sil, outline.map(([u, v]): Pt => [hc[0] + u * Kpx, hc[1] + v * Kpx]), 8, 0.02, 0.03);
  }
  else if (headView === 'front') paintHeadFront(p, seed + 1, hc[0], hc[1], Kpx, pose.face, headStyle, t, warm, L, pose.quarter ? qdir * qr : 0, pose.headPitch ?? 0);
  else paintHeadSide(p, seed + 1, hc[0], hc[1], Kpx, pose.face, headStyle, headView === 'left' ? -1 : 1, t, warm, L);
  if (G?.hat) {
    // Headwear over the head (wardrobe.ts): parts in head units, mirrored for a left-facing profile.
    part = 130;
    line = 130;
    const hat = G.hat, hd = headView === 'left' ? -1 : 1;
    const tone = {main: hat.color, band: hat.band ?? mixColor(hat.color, INK, 0.55), dark: mixColor(hat.color, INK, 0.6), white: '#e8dcb0'};
    for (const {tone: tn, pts} of headView === 'front' ? hatFront(hat.kind) : hatSide(hat.kind)) {
      fill(tone[tn], (pose.quarter && headView === 'front' && hat.kind === 'cap' ? turnedCap(tn, pts, qdir * qr) : pts.map(([u, v]): Pt => [headView === 'front' ? (pose.quarter ? turnU(qdir * qr, u, v) : u) : hd * u, v])).map(([u, v]): Pt => [hc[0] + u * Kpx, hc[1] + v * Kpx]), true, 6);
    }
  }
  if (cock !== 0) p.brush.pop();

  if (legsOver) paintLegs();

  // ----------------------------------------------------------------- near arms (front: both)
  let lens: Pt | undefined, lensDir: number | undefined;
  const torchOf = (hold?: Prop, hand?: Pt) => {
    if (hold?.kind === 'torch' && hand) {
      lens = [hand[0] + Math.cos(hold.angle) * 0.13 * unit, hand[1] + Math.sin(hold.angle) * 0.13 * unit];
      lensDir = hold.angle;
    }
  };
  if (!profile) {
    // A `behind: 'all'` arm is already painted under the torso; 'upper' adds its forearm and hand here, over the torso.
    const front = (a?: Arm, side?: 'r' | 'l') => (a?.behind === 'all' || (!a?.behind && quarterFar === side && !qFwd(a)) ? null : a?.behind === 'upper' ? ('lower' as const) : undefined);
    if (front(pose.rArm, 'r') !== null) rHand = drawArm(R, pose.rHold, 0, false, front(pose.rArm, 'r') ?? undefined);
    if (front(pose.lArm, 'l') !== null) lHand = drawArm(Lm, pose.lHold, 1, false, front(pose.lArm, 'l') ?? undefined);
    torchOf(pose.rHold, rHand);
    torchOf(pose.lHold, lHand);
  } else if (nearSide === 'r') {
    rHand = drawArm(R, pose.rHold, 0, false);
    torchOf(pose.rHold, rHand);
    torchOf(pose.lHold, lHand);
  } else {
    lHand = drawArm(Lm, pose.lHold, 1, false);
    torchOf(pose.lHold, lHand);
    torchOf(pose.rHold, rHand);
  }

  if (lie !== 0) p.brush.pop();
  const headTop = rotHead([hc[0], hc[1] - 1.17 * Kpx])[1];
  const chinY = rotHead([hc[0], hc[1] + CHIN * Kpx])[1];
  const headPt = rotHead(hc);
  if (lie !== 0) {
    // Anchors in the rotated picture; the bounds are the extremes of the rotated body (head top, feet, ground).
    const top = Math.min(...[rotLie([headPt[0], headTop]), rotLie(g)].map((q) => q[1]));
    const head = rotLie(headPt);
    return {
      head, headTop: top, chin: rotLie([headPt[0], chinY])[1], feet: g, rHand: rotLie(rHand), lHand: rotLie(lHand), rShoulder: rotLie(R.Sh), lShoulder: rotLie(Lm.Sh),
      rUpper: rotLie([lerp(R.Sh[0], R.E[0], 0.5), lerp(R.Sh[1], R.E[1], 0.5)]), lUpper: rotLie([lerp(Lm.Sh[0], Lm.E[0], 0.5), lerp(Lm.Sh[1], Lm.E[1], 0.5)]),
      lens: lens && rotLie(lens), lensDir: lensDir === undefined ? undefined : lensDir + lieAng, top, bottom: g[1],
    };
  }
  return {
    head: headPt, headTop, chin: chinY, feet: g, rHand, lHand, rShoulder: R.Sh, lShoulder: Lm.Sh,
    rUpper: [lerp(R.Sh[0], R.E[0], 0.5), lerp(R.Sh[1], R.E[1], 0.5)], lUpper: [lerp(Lm.Sh[0], Lm.E[0], 0.5), lerp(Lm.Sh[1], Lm.E[1], 0.5)],
    lens, lensDir, top: headTop, bottom: g[1],
  };
};

/** Painted torch (0.22 m, black body), held at `hand`, lens toward `angle` (plate radians). */
export const drawTorch = (p: Painter, seed: number, hand: Pt, angle: number, unit: number, on: number) => {
  const ax = Math.cos(angle), ay = Math.sin(angle);
  const a: Pt = [hand[0] - ax * 0.08 * unit, hand[1] - ay * 0.08 * unit], b: Pt = [hand[0] + ax * 0.13 * unit, hand[1] + ay * 0.13 * unit];
  solid(p, seed, '#16181a', capsule(a, b, 0.032 * unit, 0.042 * unit), 6, 0.04, 0.1);
  inkLine(p, seed, capsule(a, b, 0.032 * unit, 0.042 * unit), {weight: 0.9});
  solid(p, seed + 1, on > 0 ? '#fff1c8' : '#4a5052', ell(b[0], b[1], 0.012 * unit, 0.02 * unit, 12, angle), 4, 0.02, 0.1);
};

/** Closed umbrella held by the handle at `hand`, tip at `tip` (plate px). */
export const drawUmbrella = (p: Painter, seed: number, hand: Pt, tip: Pt, unit: number) => {
  const d = Math.hypot(tip[0] - hand[0], tip[1] - hand[1]) || 1;
  const ux = (tip[0] - hand[0]) / d, uy = (tip[1] - hand[1]) / d;
  const handle: Pt = [hand[0] - ux * 0.1 * unit, hand[1] - uy * 0.1 * unit];
  solid(p, seed, '#30353b', limb(handle, tip, 0.014 * unit, 0.01 * unit), 6, 0.03, 0.1);
  const at = (u: number): Pt => [lerp(hand[0], tip[0], u), lerp(hand[1], tip[1], u)];
  const w = (u: number) => (0.022 + 0.022 * Math.sin(Math.PI * u ** 0.7)) * unit;
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const u = 0.12 + 0.78 * (i / 10), q = at(u);
    left.push([q[0] - uy * w(u) / 2, q[1] + ux * w(u) / 2]);
    right.unshift([q[0] + uy * w(u) / 2, q[1] - ux * w(u) / 2]);
  }
  solid(p, seed + 1, '#30353b', [...left, ...right], 6, 0.03, 0.1);
  inkLine(p, seed + 1, [...left, ...right], {weight: 0.9});
  solid(p, seed + 2, '#30353b', ell(handle[0] + 0.02 * unit, handle[1], 0.03 * unit, 0.035 * unit, 10), 6, 0.03, 0.1);
};

export {INK};

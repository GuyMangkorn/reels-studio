import {lerp, mixColor, type Painter, type Pt} from './painter';
import {INK, VD18, capsule, ell, glaze, inkLine, limb, lineOf, modelPart, solid, toneOf, washAt, type InteriorLight} from './draw';
import {hatFront, hatSide} from './gear';
import {CHIN, HEAD_SPAN, paintHeadFront, paintHeadSide, type FaceState, type HeadStyle} from './head';
import {clamp01} from './space';
import {modeLegs, modeOf, type ModeLegs} from './legs';
import {drawFigureBack, hoodUpHead} from './back';

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
  hat?: {kind: 'cap' | 'helmet' | 'nurse'; color: string; band?: string};
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
export type Arm = {to: Pt; out?: number; via?: Pt; behind?: 'upper' | 'all'; toCam?: number; finger?: boolean};
export type Prop =
  | {kind: 'torch'; angle: number; on: number}
  | {kind: 'phone'}
  | {kind: 'umbrella'; tip: Pt};

export type FigPose = {
  /** `back`: seen from behind (`back.ts`; standing, walk, lean, arms, no face); the character's right is screen right and front-view arm targets are mirrored. */
  view: 'front' | 'left' | 'right' | 'back';
  /** Hood up (`gear.collar.kind` `hood`; any view): the hair is covered by a hood in the collar colour. Default absent = hood down, bunched at the neck. */
  hoodUp?: boolean;
  head?: 'front' | 'left' | 'right';
  crouch?: number;
  /** Profile only: torso pitch toward the facing side, 0..1 (1 = about 60 deg, hands on knees). */
  bend?: number;
  /** Walk phase in cycles (undefined = standing still). */
  walk?: number;
  /** Walk amplitude 0..1 (default 1): leg swing, knee flex, foot lift, bob and arm swing scale with it, so a walk eases into standing by taking it to 0 (motions.ts). */
  stride?: number;
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
  /** Whole figure raised off the ground, metres (jump, fall); the ground shadow stays. */
  lift?: number;
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
/** Upper-arm and forearm length, m (both bones; the pose library and its test use it). */
export const BONE = 0.26;

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
export type BodyFields = Pick<FigPose, 'crouch' | 'bend' | 'walk' | 'stride' | 'lean' | 'rise' | 'sit' | 'floorSit' | 'kneel' | 'squat' | 'run' | 'lift'>;
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
  const mode = m ? modeLegs({hip0, ankleV, L1: hip0 - knee0, L2: knee0 - ankleV}, profile ? 'profile' : 'front', m.kind === 'run' ? {kind: 'run', amount: m.amount * Math.PI * 2} : m) : undefined;
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
  const X = (u: number) => g[0] + (profile ? dir : 1) * u * unit;
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

  const L = pose.light;
  const sil = pose.silhouette;
  let part = 0, line = 0;
  const fill = (color: string, pts: Pt[], outline = true, passes = 4) => {
    const base = sil ?? toneOf(color, L);
    solid(p, seed * 1000 + ++part, base, pts, sil ? 8 : passes, sil ? 0.02 : L ? 0 : 0.07, sil ? 0.03 : 0.2);
    if (L) {
      modelPart(p, seed * 1000 + part, base, pts, L);
      // Falloff from the overhead tubes: lower parts sit darker (measured from the shoulders to the ground point).
      const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length, top = U([0, shV])[1];
      const v = clamp01((cy - top) / Math.max(1, g[1] - top));
      if (v > 0.25) glaze(p, 7_900_000 + seed * 1000 + part, VD18.falloff, VD18.falloffOpacity * ((v - 0.25) / 0.75), pts, {border: 0.2, bleed: 0.02});
    }
    if (outline && !sil) inkLine(p, seed * 1000 + ++line, pts, {weight: L ? VD18.lineOuter : 1.0, color: lineOf(base, L)});
  };
  /** VD18 fold or crease: a short open ink stroke in a dark shade of the cloth. */
  const fold = (color: string, pts: Pt[]) => {
    if (L && !sil) inkLine(p, seed * 1000 + 400 + ++line, pts, {closed: false, weight: VD18.lineFold, curve: 0.5, color: mixColor(toneOf(color, L), INK, 0.55)});
  };

  // Soft ground shadow under the feet (every human has one). VD18: a wider soft shadow plus a dark occlusion core.
  // Lying (`lie`): the shadow lengthens along the body, toward the side the head points to.
  const lie = Math.max(-1, Math.min(1, pose.lie ?? 0)), lieA = Math.abs(lie);
  const shX = g[0] - Math.sign(lie) * 0.5 * Ht * lieA * unit, shW = (profile ? 0.32 : 0.26) + (0.52 * Ht - (profile ? 0.32 : 0.26)) * lieA;
  const sh = ell(shX, g[1] + 0.01 * unit, shW * (L ? 1.15 : 1) * unit, (L ? 0.07 : 0.06) * (1 + lieA) * unit, 16);
  if (!pose.seated && !L) washAt(p, seed * 1000 + 999, sil ?? '#1e2324', 70, sh, 0.5, 0.3);
  if (!pose.seated && L) {
    glaze(p, seed * 1000 + 999, '#0e1213', 120, sh, {border: 0.1, bleed: 0.15});
    glaze(p, seed * 1000 + 998, '#07090a', 160, ell(shX, g[1] + 0.005 * unit, ((profile ? 0.22 : 0.2) + (0.4 * Ht - (profile ? 0.22 : 0.2)) * lieA) * unit, 0.03 * (1 + lieA) * unit, 16), {border: 0.1, bleed: 0.08});
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
      const hip: Pt = [s * 0.0725, hipV];
      const ankle: Pt = [s * (0.08 + 0.05 * c), ankleV + lift];
      const knee: Pt = [s * (0.077 + 0.17 * c), lerp((hipV + ankle[1]) / 2, 0.46, c)];
      legs.push({hip, knee, ankle, far: false});
    }
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
  const legColor = (far: boolean) => (far ? mixColor(o.pants, '#000000', 0.18) : o.pants);
  // Front view, thighs toward the camera (sitting, knees up): the legs are painted over the torso, after the head.
  const legsOver = !!mode && !profile && (mode.kind === 'sit' || mode.kind === 'floor');
  const paintLegs = () => {
  part = 10;
  line = 10;
  for (const {hip, knee, ankle, far, foot, hide} of pose.seated ? [] : legs) {
    // Front kneel: the thigh comes toward the camera, so it widens toward the knee (the knee is the nearest part).
    const near = hide && !profile && mode?.kind === 'kneel';
    fill(legColor(far), Sq(limb(hip, knee, 0.11, near ? 0.125 : 0.095)), true);
    if (!hide) fill(legColor(far), Sq(limb(knee, ankle, 0.095, 0.08)), true);
    if (c > 0.2 || mode) fill(legColor(far), Sq(ell(knee[0], knee[1], near ? 0.064 : hide || legsOver ? 0.056 : 0.05, near ? 0.064 : hide || legsOver ? 0.056 : 0.05, 12)), false);
    if (hide) continue;
    if (c > 0.4) {
      // Crouched: the cloth bunches behind the knee (two short creases on the thigh just above it).
      const kx = knee[0] - hip[0], ky = knee[1] - hip[1], kl = Math.hypot(kx, ky) || 1, ux = kx / kl, uy = ky / kl;
      for (const d of [0.07, 0.13]) fold(legColor(far), Sq([[knee[0] - ux * d - uy * 0.035, knee[1] - uy * d + ux * 0.035], [knee[0] - ux * (d - 0.02), knee[1] - uy * (d - 0.02)], [knee[0] - ux * d + uy * 0.035, knee[1] - uy * d - ux * 0.035]]));
    }
    const shoe = far ? mixColor(o.shoes, '#000000', 0.2) : o.shoes;
    if (o.boots && !foot) {
      if (!profile) fill(shoe, Sq([[ankle[0] - 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.135], [ankle[0] + 0.06, ankle[1] - 0.038], [ankle[0] - 0.06, ankle[1] - 0.038]]));
      else fill(shoe, Sq([[ankle[0] - 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.01], [ankle[0] + 0.13, ankle[1] - 0.02], [ankle[0] + 0.13, ankle[1] - 0.038], [ankle[0] - 0.055, ankle[1] - 0.038]]));
    } else if (!profile) fill(shoe, Sq(ell(ankle[0] + Math.sign(ankle[0]) * 0.017, ankle[1] - 0.017, 0.068, 0.03, 14)));
    else if (foot) fill(shoe, Sq(ell(foot.c[0], foot.c[1], 0.085, 0.03, 14, foot.a)));
    else fill(shoe, Sq(ell(ankle[0] + 0.035, ankle[1] - 0.017, 0.085, 0.03, 14)));
  }
  };
  const farUnder = profile && !!pose.farArmUnder;
  if (!legsOver && !farUnder) paintLegs();

  // ----------------------------------------------------------------- arms
  const shR: Pt = profile ? U([-0.0043, shV - 0.03]) : U([-(sw - 0.0255), shV - 0.0255]);
  const shL: Pt = profile ? U([-0.0043, shV - 0.03]) : U([sw - 0.0255, shV - 0.0255]);
  const Lpx = AB * unit;
  const hangX = childHangExtra(def);
  const hang = (s: number): Pt => (profile ? U([0.01 + 0.02 * Math.sin(ph + (s > 0 ? Math.PI : 0)) * (walk === undefined ? 0 : 6 * (pose.stride ?? 1)), shV - 0.03 - 2 * AB + 0.02]) : U([s * (sw - 0.0255 + 0.034 + hangX), shV - 0.0255 - 2 * AB + 0.02]));
  /** Run: arms pump opposite to the leg on their side (profile: elbow ~80 deg; front: hands rise to the chest and drop to the hip). */
  type ArmGeo = {Sh: Pt; E: Pt; T: Pt; cam?: number; finger?: boolean};
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
    const a = side === 'r' ? pose.rArm : pose.lArm;
    if (!a && mode?.kind === 'run') return runArm(s, Sh);
    const T = a?.via ? a.to : reachTo(Sh, a?.to ?? hang(s), Lpx);
    const E = a?.via ?? (a ? ikElbow(Sh, T, Lpx, a.out ?? (profile ? -dir : s)) : ([lerp(Sh[0], T[0], 0.5) + (profile ? -dir * 0.02 * unit : s * 0.02 * unit), lerp(Sh[1], T[1], 0.5)] as Pt));
    return a?.toCam && !profile ? {Sh, E, T, cam: Math.max(0, Math.min(1, a.toCam)), finger: a.finger} : {Sh, E, T};
  };
  const R = arm('r'), Lm = arm('l');
  const drawArm = (A: ArmGeo, hold: Prop | undefined, k: number, far: boolean, only?: 'upper' | 'lower') => {
    part = 70 + k * 10;
    line = 70 + k * 10;
    const sl = far ? mixColor(sleeve, '#000000', 0.15) : sleeve;
    // Pointing at the viewer (`toCam`): a short cone that widens toward the hand, the hand up to 1.3x (CP-P09).
    const cam = A.cam ?? 0;
    const slc = cam ? mixColor(sl, '#ffffff', 0.16 * cam) : sl; // the nearer cone is lit lighter than the sleeve behind it, so it parts from the torso
    if (only !== 'lower') fill(slc, capsule(A.Sh, A.E, 0.08 * unit, (cam ? 0.068 + 0.03 * cam : 0.068) * unit), true);
    if (only === 'upper') return A.T;
    fill(o.longSleeves ? slc : skinHand, capsule(A.E, A.T, (cam ? 0.066 + 0.04 * cam : 0.066) * unit, (cam ? 0.056 + 0.06 * cam : 0.056) * unit), true);
    if (o.gear?.wideSleeves) {
      // Kimono sleeve: the cloth hangs in a wide flap round the forearm, the hand comes out of its opening.
      part = 70 + k * 10 + 5;
      const ex = A.T[0] - A.E[0], ey = A.T[1] - A.E[1], el = Math.hypot(ex, ey) || 1, nx = -ey / el, ny = ex / el;
      const w1 = 0.07 * unit, w2 = 0.11 * unit, dr = 0.1 * unit;
      fill(sl, [[A.E[0] - nx * w1, A.E[1] - ny * w1], [A.E[0] + nx * w1, A.E[1] + ny * w1], [A.T[0] + nx * w2, A.T[1] + ny * w2 + dr], [A.T[0] - nx * w2, A.T[1] - ny * w2 + dr]], true);
    }
    if (o.longSleeves && L) {
      // Elbow crease: two short strokes where the sleeve bunches, on the inside of the bend.
      const ax = A.E[0] - A.Sh[0], ay = A.E[1] - A.Sh[1], al = Math.hypot(ax, ay) || 1, ux = ax / al, uy = ay / al;
      for (const d of [0.025, 0.06]) fold(sl, [[A.E[0] - ux * d * unit - uy * 0.03 * unit, A.E[1] - uy * d * unit + ux * 0.03 * unit], [A.E[0] - ux * (d - 0.015) * unit, A.E[1] - uy * (d - 0.015) * unit], [A.E[0] - ux * d * unit + uy * 0.025 * unit, A.E[1] - uy * d * unit - ux * 0.025 * unit]]);
    }
    const ang = Math.atan2(A.T[1] - A.E[1], A.T[0] - A.E[0]);
    const hand: Pt = [A.T[0] + Math.cos(ang) * 0.03 * unit, A.T[1] + Math.sin(ang) * 0.03 * unit];
    if (hold?.kind === 'torch') drawTorch(p, seed * 1000 + 200 + k * 10, hand, hold.angle, unit, hold.on);
    if (hold?.kind === 'phone') fill('#1f2326', [[hand[0] - 0.035 * unit, hand[1] - 0.07 * unit], [hand[0] + 0.035 * unit, hand[1] - 0.07 * unit], [hand[0] + 0.035 * unit, hand[1] + 0.06 * unit], [hand[0] - 0.035 * unit, hand[1] + 0.06 * unit]]);
    if (hold?.kind === 'umbrella') drawUmbrella(p, seed * 1000 + 220 + k * 10, hand, hold.tip, unit);
    part = 70 + k * 10 + 8;
    const hs = cam ? 1 + 0.3 * cam : 1;
    fill(o.coat ? '#26292c' : skinHand, ell(hand[0], hand[1], 0.045 * unit * hs, 0.052 * unit * hs, 14, ang), true, o.coat ? 6 : 4);
    if (A.finger && cam) {
      // The pointing finger seen end-on: a small round tip on the fist, toward the viewer.
      part = 70 + k * 10 + 9;
      fill(o.coat ? '#26292c' : mixColor(skinHand, '#7a4a30', 0.18), ell(hand[0], hand[1] - 0.03 * unit * hs, 0.022 * unit * hs, 0.024 * unit * hs, 10), true, 4);
    }
    return hand;
  };

  // Profile: the far arm goes behind the torso; redraw order handled by drawing it first (before head and near arm).
  const nearSide: 'r' | 'l' = dir > 0 ? 'r' : 'l';
  let rHand: Pt = R.T, lHand: Pt = Lm.T;
  if (profile) {
    // The far arm is painted over the torso but is hidden behind it when it hangs; draw it slightly darker.
    if (nearSide === 'r') lHand = drawArm(Lm, pose.lHold, 1, true);
    else rHand = drawArm(R, pose.rHold, 0, true);
    if (farUnder && !legsOver) paintLegs();
  } else {
    if (pose.rArm?.behind) rHand = drawArm(R, pose.rHold, 0, true, pose.rArm.behind === 'upper' ? 'upper' : undefined);
    if (pose.lArm?.behind) lHand = drawArm(Lm, pose.lHold, 1, true, pose.lArm.behind === 'upper' ? 'upper' : undefined);
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
      const hemF = lap ?? o.skirtHem ?? Math.max(kneeV - 0.19 * (1 - c), 0.3 * c + 0.2);
      fill(o.skirt, [...Uq([[-hw - 0.0085, hip0 + 0.034], [hw + 0.0085, hip0 + 0.034]]), ...Sq([[kx + 0.06, hemF], [-kx - 0.06, hemF]])]);
    }
    const top: Pt[] = [[-sw + 0.017, shV], [sw - 0.017, shV], [sw, shV - 0.034], [hw + 0.013, hip0], [-hw - 0.013, hip0], [-sw, shV - 0.034]];
    if (coat) {
      const hem = Math.max(kneeV - 0.05, 0.12);
      fill(coat, [...Uq([[-sw + 0.017, shV], [sw - 0.017, shV], [sw + 0.0085, shV - 0.0425]]), S([hw + 0.085 + 0.08 * c, hem]), S([-hw - 0.085 - 0.08 * c, hem]), U([-sw - 0.0085, shV - 0.0425])]);
      if (!sil) inkLine(p, seed * 1000 + ++line, [U([0, shV - 0.05]), U([0, hip0 - 0.02]), S([0, hem])], {closed: false, weight: 0.9, curve: 0.1});
      if (pose.wet && !sil) for (let i = 0; i < 6; i++) inkLine(p, seed * 1000 + 60 + i, [U([-0.12 + i * 0.05, shV - 0.06 - 0.07 * (i % 3)]), U([-0.12 + i * 0.05, shV - 0.12 - 0.07 * (i % 3)])], {color: '#8fa6b8', weight: 0.8, closed: false});
    } else {
      fill(o.shirt, Uq(top));
      if (o.jacket) {
        for (const s of [-1, 1]) fill(o.jacket, Uq([[s * (sw - 0.017), shV], [s * 0.051, shV], [s * 0.0425, hip0 - 0.0255], [s * (hw + 0.021), hip0 - 0.0255], [s * sw, shV - 0.034]]));
      }
      if (o.apron) fill(o.apron, Uq([[-0.085, shV - 0.0935], [0.085, shV - 0.0935], [0.11, hip0 - 0.136], [-0.11, hip0 - 0.136]]), true, 8);
      // VD18 drape: the shirt sags under the collar; a crouch bunches it at the waist.
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
    } else if (o.skirt) fill(o.skirt, [...Uq([[-0.24 * HD, hip0 + 0.034], [0.2 * HD, hip0 + 0.034]]), ...Sq([[0.3 * HD, o.skirtHem ?? kneeV - 0.19], [-0.32 * HD, o.skirtHem ?? kneeV - 0.19]])], true, 8);
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
        fill(G.drape, Uq([[0, shV - 0.005], [sw - 0.017, shV], [sw, shV - 0.034], [0.05, hip0 + 0.01], [-hw - 0.013, hip0 + 0.02], [-hw - 0.013, hip0 + 0.15]]));
        for (const k of [1, 2, 3]) crease(G.drape, Uq([[0.04 * k, shV - 0.01 - 0.03 * k], [-hw + 0.02 + 0.045 * k, hip0 + 0.12 - 0.03 * k]]));
      }
      const col = G.collar;
      if (col?.kind === 'v') {
        const d = col.depth ?? 0.17;
        fill(col.trim ?? def.head.skin, Uq([[-0.05, shV + 0.004], [0.05, shV + 0.004], [0, shV - d]]), false, 6);
        for (const sd of [-1, 1]) fill(col.color, Uq([[sd * 0.04, shV + 0.004], [sd * 0.115, shV - 0.004], [sd * 0.03, shV - d], [0, shV - d + 0.012]]), true, 6);
      } else if (col?.kind === 'sailor') {
        for (const sd of [-1, 1]) {
          fill(col.color, Uq([[sd * 0.045, shV + 0.004], [sd * (sw - 0.02), shV], [sd * (sw - 0.03), shV - 0.055], [sd * 0.012, shV - 0.2], [0, shV - 0.17]]), true, 6);
          if (col.trim) stripe(col.trim, Uq([[sd * (sw - 0.045), shV - 0.014], [sd * (sw - 0.052), shV - 0.05], [sd * 0.02, shV - 0.17]]), 1.1);
        }
      } else if (col?.kind === 'hood' && !pose.hoodUp) {
        fill(col.color, Uq([[-0.095, shV + 0.025], [-0.085, shV - 0.06], [-0.04, shV - 0.115], [0, shV - 0.125], [0.04, shV - 0.115], [0.085, shV - 0.06], [0.095, shV + 0.025], [0.055, shV + 0.01], [0.04, shV - 0.045], [0, shV - 0.07], [-0.04, shV - 0.045], [-0.055, shV + 0.01]]), true, 6);
        for (const sd of [-1, 1]) stripe(col.trim ?? '#e8e4da', Uq([[sd * 0.035, shV - 0.085], [sd * 0.042, shV - 0.17], [sd * 0.036, shV - 0.23]]), 1.2);
      }
      if (G.tie) {
        const tc = G.tie.color;
        if (G.tie.bow) {
          const y = shV - 0.19;
          fill(tc, Uq([[0, y], [-0.07, y + 0.045], [-0.075, y - 0.045]]), true, 6);
          fill(tc, Uq([[0, y], [0.07, y + 0.045], [0.075, y - 0.045]]), true, 6);
          fill(tc, Uq([[-0.016, y + 0.016], [0.016, y + 0.016], [0.016, y - 0.016], [-0.016, y - 0.016]]), true, 6);
        } else {
          fill(tc, Uq([[-0.018, shV - 0.045], [0.018, shV - 0.045], [0.014, shV - 0.075], [-0.014, shV - 0.075]]), true, 6);
          fill(tc, Uq([[-0.014, shV - 0.075], [0.014, shV - 0.075], [0.027, shV - 0.2], [0, shV - 0.235], [-0.027, shV - 0.2]]), true, 6);
        }
      }
      if (G.belt) {
        const h = G.belt.h ?? 0.035, v0 = bandV1 + h;
        fill(G.belt.color, Uq([[-edge(v0), v0], [edge(v0), v0], [edge(bandV1), bandV1], [-edge(bandV1), bandV1]]));
        if (G.belt.buckle) fill(G.belt.buckle, Uq([[-0.03, v0 - 0.004], [0.03, v0 - 0.004], [0.03, bandV1 + 0.004], [-0.03, bandV1 + 0.004]]), true, 6);
      }
      if (G.overcoat) {
        const hem = Math.min(G.overcoat.hem, kneeV + 0.12);
        for (const sd of [-1, 1]) fill(G.overcoat.color, [U([sd * (sw - 0.017), shV]), U([sd * 0.045, shV]), S([sd * 0.075, hem]), S([sd * (hw + 0.085 + 0.08 * c), hem]), U([sd * (sw + 0.0085), shV - 0.0425])]);
        if (!sil) for (const sd of [-1, 1]) crease(G.overcoat.color, Uq([[sd * 0.07, hip0 - 0.06], [sd * 0.125, hip0 - 0.06], [sd * 0.125, hip0 - 0.17]]));
      }
      if (G.badge) fill(G.badge, Uq([[0.04, shV - 0.075], [0.1, shV - 0.075], [0.1, shV - 0.105], [0.04, shV - 0.105]]), true, 6);
      if (G.pockets) for (const sd of [-1, 1]) crease(o.shirt, Uq([[sd * 0.04, shV - 0.13], [sd * 0.1, shV - 0.13], [sd * 0.1, shV - 0.2], [sd * 0.04, shV - 0.2], [sd * 0.04, shV - 0.13]]));
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

  // ----------------------------------------------------------------- neck and head
  part = 120;
  line = 120;
  const nw = o.coat ? (profile ? 0.16 * HD : 0.24 * HD) : profile ? 0.08 * HD : 0.1 * HD;
  const nx = profile ? -0.08 * HD : 0;
  fill(coat ?? (L ? mixColor(def.head.skin, VD18.shadow, 0.3) : def.head.skin), Uq([[nx - nw, chin + 0.051], [nx + nw, chin + 0.051], [nx + nw + 0.0043, shV - 0.013], [nx - nw - 0.0043, shV - 0.013]]), false, 6);
  const nod = pose.nod ?? [0, 0];
  const hc = U([nx + nod[0] * K, chin + CHIN * K - nod[1] * K]);
  const Kpx = K * unit;
  // The head stays upright (decal), only its centre follows the body transform.
  if (sil) {
    // Bare short-haired human contour: crown volume, temples, tapered jaw and chin. No facial marks.
    // Only the silhouette branch changes; ordinary cast keeps its existing head rendering.
    const outline: Pt[] = [[0,-1.08],[0.3,-1.06],[0.56,-0.91],[0.72,-0.64],[0.77,-0.28],
      [0.73,0.12],[0.68,0.49],[0.52,0.88],[0.3,1.12],[0,1.22],[-0.3,1.12],
      [-0.52,0.88],[-0.68,0.49],[-0.73,0.12],[-0.77,-0.28],[-0.73,-0.64],[-0.57,-0.91],[-0.28,-1.07]];
    solid(p, seed + 1, sil, outline.map(([u, v]): Pt => [hc[0] + u * Kpx, hc[1] + v * Kpx]), 8, 0.02, 0.03);
  }
  else if (headView === 'front') paintHeadFront(p, seed + 1, hc[0], hc[1], Kpx, pose.face, headStyle, t, warm, L);
  else paintHeadSide(p, seed + 1, hc[0], hc[1], Kpx, pose.face, headStyle, headView === 'left' ? -1 : 1, t, warm, L);
  if (G?.hat) {
    // Headwear over the head (wardrobe.ts): parts in head units, mirrored for a left-facing profile.
    part = 130;
    line = 130;
    const hat = G.hat, hd = headView === 'left' ? -1 : 1;
    const tone = {main: hat.color, band: hat.band ?? mixColor(hat.color, INK, 0.55), dark: mixColor(hat.color, INK, 0.6), white: '#e8dcb0'};
    for (const {tone: tn, pts} of headView === 'front' ? hatFront(hat.kind) : hatSide(hat.kind)) {
      fill(tone[tn], pts.map(([u, v]): Pt => [hc[0] + (headView === 'front' ? u : hd * u) * Kpx, hc[1] + v * Kpx]), true, 6);
    }
  }

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
    const front = (a?: Arm) => (a?.behind === 'all' ? null : a?.behind === 'upper' ? ('lower' as const) : undefined);
    if (front(pose.rArm) !== null) rHand = drawArm(R, pose.rHold, 0, false, front(pose.rArm) ?? undefined);
    if (front(pose.lArm) !== null) lHand = drawArm(Lm, pose.lHold, 1, false, front(pose.lArm) ?? undefined);
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
  const headTop = hc[1] - 1.17 * Kpx;
  const chinY = hc[1] + CHIN * Kpx;
  if (lie !== 0) {
    // Anchors in the rotated picture; the bounds are the extremes of the rotated body (head top, feet, ground).
    const top = Math.min(...[rotLie([hc[0], headTop]), rotLie(g)].map((q) => q[1]));
    const head = rotLie(hc);
    return {
      head, headTop: top, chin: rotLie([hc[0], chinY])[1], feet: g, rHand: rotLie(rHand), lHand: rotLie(lHand), rShoulder: rotLie(R.Sh), lShoulder: rotLie(Lm.Sh),
      rUpper: rotLie([lerp(R.Sh[0], R.E[0], 0.5), lerp(R.Sh[1], R.E[1], 0.5)]), lUpper: rotLie([lerp(Lm.Sh[0], Lm.E[0], 0.5), lerp(Lm.Sh[1], Lm.E[1], 0.5)]),
      lens: lens && rotLie(lens), lensDir: lensDir === undefined ? undefined : lensDir + lieAng, top, bottom: g[1],
    };
  }
  return {
    head: hc, headTop, chin: chinY, feet: g, rHand, lHand, rShoulder: R.Sh, lShoulder: Lm.Sh,
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

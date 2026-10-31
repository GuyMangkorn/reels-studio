import {lerp, mixColor, type Painter, type Pt} from './painter';
import {INK, VD18, capsule, ell, glaze, inkLine, limb, lineOf, modelPart, solid, toneOf, washAt, type InteriorLight} from './draw';
import {CHIN, HEAD_SPAN, paintHeadFront, paintHeadSide, type FaceState, type HeadStyle} from './head';
import {clamp01} from './space';

// Recurring-cast rig (from WFOG MK-WF-DEP-05; brief VD03): one draw function for any `CastDef`, front and profile views only,
// 4 heads tall (1.7 m = 4 x 0.425 m; occupant 1.60 m with the same head), mitten hands, decal heads with face controls.
// Body controls: crouch, bend (profile, hands on knees), walk, lean, breath rise, two-bone IK arms to screen targets,
// props (torch, phone, umbrella). Drawn as a flat card at the character's depth: `g` is the ground point in plate px and
// `unit` the projector's px per metre there (one projection owner: the plate's projector supplies both).

export type Outfit = {
  shoulder: number; shirt: string; sleeve: string; longSleeves: boolean; pants: string; shoes: string;
  boots?: boolean; jacket?: string; coat?: string; apron?: string; skirt?: string;
};
export type CastDef = {height: number; head: HeadStyle; outfit: Outfit; seed: number};

/**
 * An arm target in plate px and the side the elbow bends toward (-1 screen-left, +1 screen-right). With `via` (an
 * authored elbow point, plate px) the arm is drawn shoulder -> via -> to exactly as given: no reach clamp, no IK
 * choice. Two-bone IK with a fixed bone length splays the elbow outward when the hand is close to the shoulder (crouched
 * hands on knees), so authored crouch poses use `via` (SS-R3.2 elbow rows). `behind` (front view): the elbow goes back
 * into depth, so the upper arm ('upper') or the whole arm ('all') is painted behind the torso, a shade darker.
 */
export type Arm = {to: Pt; out?: number; via?: Pt; behind?: 'upper' | 'all'};
export type Prop =
  | {kind: 'torch'; angle: number; on: number}
  | {kind: 'phone'}
  | {kind: 'umbrella'; tip: Pt};

export type FigPose = {
  view: 'front' | 'left' | 'right';
  head?: 'front' | 'left' | 'right';
  crouch?: number;
  /** Profile only: torso pitch toward the facing side, 0..1 (1 = about 60 deg, hands on knees). */
  bend?: number;
  /** Walk phase in cycles (undefined = standing still). */
  walk?: number;
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
  /** Interior light (brief VD18): modelled washes, coloured ink, folds, face planes. Undefined = the blockout look. */
  light?: InteriorLight;
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
 * Front-view shoulder anchor height (m above the ground point) at a crouch, upright and without lean or rise: the levels
 * drawFigure uses (hip drop, torso scale about the hip). A shot hangs its elbows from this anchor through a rise (SS-R3.4
 * S03-SH02); the cast test checks it against the anchor drawFigure paints.
 */
export const shoulderHeight = (def: CastDef, crouch = 0): number => {
  const Ht = def.height;
  const chin = Ht - H, shV = chin - 0.16 * H;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV - torso + 0.034;
  const c = clamp01(crouch);
  const hipV = hip0 - 0.47 * c * (Ht / 1.7);
  return hipV + (shV - 0.0255 - hip0) * (1 - 0.4 * c);
};

/**
 * Draw one character. `seed` separates this figure's fills from every other mark in the plate; `t` is the plate clock
 * (blink). Returns world anchors in plate px (head, hands, torch lens) for props, glows and other characters.
 */
export const drawFigure = (p: Painter, def: CastDef, g: Pt, unit: number, pose: FigPose, t: number, seed = def.seed): FigAnchors => {
  const o = def.outfit;
  const Ht = def.height;
  const chin = Ht - H, shV = chin - 0.16 * H;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV - torso + 0.034, crotch0 = hip0 - 0.0425, ankleV = 0.038;
  const knee0 = (hip0 + ankleV) / 2;
  const sw = o.shoulder * H, hw = 0.3 * H;
  const K = H / HEAD_SPAN;
  const c = clamp01(pose.crouch ?? 0), bend = clamp01(pose.bend ?? 0);
  const profile = pose.view !== 'front';
  const dir: 1 | -1 = pose.view === 'left' ? -1 : 1;
  const headView = pose.head ?? pose.view;
  const walk = pose.walk;
  const warm = pose.warm ?? 0;
  const coat = o.coat && pose.wet ? '#24384a' : o.coat;
  const sleeve = o.coat && pose.wet ? '#24384a' : o.sleeve;
  const skinHand = warm > 0 ? mixColor(def.head.skin, '#f6c27a', 0.35 * warm) : def.head.skin;

  // Walk: hip bob and leg swing; crouch: hips drop and the torso foreshortens.
  const ph = walk === undefined ? 0 : walk * Math.PI * 2;
  const bob = walk === undefined ? 0 : 0.018 * Math.abs(Math.sin(ph));
  const hipDrop = 0.47 * c * (Ht / 1.7) + bob;
  const tScale = 1 - 0.4 * c;
  const hipV = hip0 - hipDrop;
  const rise = pose.rise ?? 0;
  const tilt = profile ? dir * (pose.lean ?? 0) + bend * 1.05 : pose.lean ?? 0;

  // Local metres (u toward screen right for front; toward the facing side for profile) -> plate px.
  const X = (u: number) => g[0] + (profile ? dir : 1) * u * unit;
  const Y = (v: number) => g[1] - v * unit;
  const S = ([u, v]: Pt): Pt => [X(u), Y(v)];
  /** Upper body: scale about the hip (crouch), breath rise, then rotate about the hip (lean / bend). */
  const U = ([u, v]: Pt): Pt => {
    const r = v - hip0;
    const vv = hipV + r * tScale + rise * clamp01(r / (shV - hip0));
    const a = -tilt; // positive tilt rotates the top toward +u
    const du = u, dv = vv - hipV;
    return S([du * Math.cos(a) - dv * Math.sin(a), hipV + du * Math.sin(a) + dv * Math.cos(a)]);
  };
  const Uq = (pts: Pt[]) => pts.map(U);
  const Sq = (pts: Pt[]) => pts.map(S);

  const L = pose.light;
  let part = 0, line = 0;
  const fill = (color: string, pts: Pt[], outline = true, passes = 4) => {
    const base = toneOf(color, L);
    solid(p, seed * 1000 + ++part, base, pts, passes, L ? 0 : 0.07, 0.2);
    if (L) {
      modelPart(p, seed * 1000 + part, base, pts, L);
      // Falloff from the overhead tubes: lower parts sit darker (measured from the shoulders to the ground point).
      const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length, top = U([0, shV])[1];
      const v = clamp01((cy - top) / Math.max(1, g[1] - top));
      if (v > 0.25) glaze(p, 7_900_000 + seed * 1000 + part, VD18.falloff, VD18.falloffOpacity * ((v - 0.25) / 0.75), pts, {border: 0.2, bleed: 0.02});
    }
    if (outline) inkLine(p, seed * 1000 + ++line, pts, {weight: L ? VD18.lineOuter : 1.0, color: lineOf(base, L)});
  };
  /** VD18 fold or crease: a short open ink stroke in a dark shade of the cloth. */
  const fold = (color: string, pts: Pt[]) => {
    if (L) inkLine(p, seed * 1000 + 400 + ++line, pts, {closed: false, weight: VD18.lineFold, curve: 0.5, color: mixColor(toneOf(color, L), INK, 0.55)});
  };

  // Soft ground shadow under the feet (every human has one). VD18: a wider soft shadow plus a dark occlusion core.
  const sh = ell(g[0], g[1] + 0.01 * unit, (profile ? 0.32 : 0.26) * (L ? 1.15 : 1) * unit, (L ? 0.07 : 0.06) * unit, 16);
  if (!pose.seated && !L) washAt(p, seed * 1000 + 999, '#1e2324', 70, sh, 0.5, 0.3);
  if (!pose.seated && L) {
    glaze(p, seed * 1000 + 999, '#0e1213', 120, sh, {border: 0.1, bleed: 0.15});
    glaze(p, seed * 1000 + 998, '#07090a', 160, ell(g[0], g[1] + 0.005 * unit, (profile ? 0.22 : 0.2) * unit, 0.03 * unit, 16), {border: 0.1, bleed: 0.08});
  }

  // ----------------------------------------------------------------- legs
  part = 10;
  line = 10;
  const legs: {hip: Pt; knee: Pt; ankle: Pt; far: boolean}[] = [];
  if (!profile) {
    for (const s of [-1, 1]) {
      const lift = walk === undefined ? 0 : 0.06 * Math.max(0, Math.sin(ph + (s > 0 ? Math.PI : 0)));
      const hip: Pt = [s * 0.0725, hipV];
      const ankle: Pt = [s * (0.08 + 0.05 * c), ankleV + lift];
      const knee: Pt = [s * (0.077 + 0.17 * c), lerp((hipV + ankle[1]) / 2, 0.46, c)];
      legs.push({hip, knee, ankle, far: false});
    }
  } else {
    const L1 = hip0 - knee0, L2 = knee0 - ankleV;
    for (const s of [1, -1]) {
      const sw0 = walk === undefined ? 0 : 0.42 * Math.sin(ph + (s > 0 ? 0 : Math.PI));
      // Bent (hands on knees): the knees flex so the shins angle back under the hips instead of one straight leg.
      const kneeBend = walk === undefined ? 0.45 * bend : Math.max(0, 0.6 * Math.sin(ph + (s > 0 ? 0 : Math.PI) + 1.2));
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
  for (const {hip, knee, ankle, far} of pose.seated ? [] : legs) {
    fill(legColor(far), Sq(limb(hip, knee, 0.11, 0.095)), true);
    fill(legColor(far), Sq(limb(knee, ankle, 0.095, 0.08)), true);
    if (c > 0.2) fill(legColor(far), Sq(ell(knee[0], knee[1], 0.05, 0.05, 12)), false);
    if (c > 0.4) {
      // Crouched: the cloth bunches behind the knee (two short creases on the thigh just above it).
      const kx = knee[0] - hip[0], ky = knee[1] - hip[1], kl = Math.hypot(kx, ky) || 1, ux = kx / kl, uy = ky / kl;
      for (const d of [0.07, 0.13]) fold(legColor(far), Sq([[knee[0] - ux * d - uy * 0.035, knee[1] - uy * d + ux * 0.035], [knee[0] - ux * (d - 0.02), knee[1] - uy * (d - 0.02)], [knee[0] - ux * d + uy * 0.035, knee[1] - uy * d - ux * 0.035]]));
    }
    const shoe = far ? mixColor(o.shoes, '#000000', 0.2) : o.shoes;
    if (o.boots) {
      if (!profile) fill(shoe, Sq([[ankle[0] - 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.135], [ankle[0] + 0.06, ankle[1] - 0.038], [ankle[0] - 0.06, ankle[1] - 0.038]]));
      else fill(shoe, Sq([[ankle[0] - 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.135], [ankle[0] + 0.05, ankle[1] + 0.01], [ankle[0] + 0.13, ankle[1] - 0.02], [ankle[0] + 0.13, ankle[1] - 0.038], [ankle[0] - 0.055, ankle[1] - 0.038]]));
    } else if (!profile) fill(shoe, Sq(ell(ankle[0] + Math.sign(ankle[0]) * 0.017, ankle[1] - 0.017, 0.068, 0.03, 14)));
    else fill(shoe, Sq(ell(ankle[0] + 0.035, ankle[1] - 0.017, 0.085, 0.03, 14)));
  }

  // ----------------------------------------------------------------- arms
  const shR: Pt = profile ? U([-0.0043, shV - 0.03]) : U([-(sw - 0.0255), shV - 0.0255]);
  const shL: Pt = profile ? U([-0.0043, shV - 0.03]) : U([sw - 0.0255, shV - 0.0255]);
  const Lpx = BONE * unit;
  const hang = (s: number): Pt => (profile ? U([0.01 + 0.02 * Math.sin(ph + (s > 0 ? Math.PI : 0)) * (walk === undefined ? 0 : 6), shV - 0.03 - 2 * BONE + 0.02]) : U([s * (sw - 0.0255 + 0.034), shV - 0.0255 - 2 * BONE + 0.02]));
  const arm = (side: 'r' | 'l') => {
    const s = side === 'r' ? -1 : 1;
    const Sh = side === 'r' ? shR : shL;
    const a = side === 'r' ? pose.rArm : pose.lArm;
    const T = a?.via ? a.to : reachTo(Sh, a?.to ?? hang(s), Lpx);
    const E = a?.via ?? (a ? ikElbow(Sh, T, Lpx, a.out ?? (profile ? -dir : s)) : ([lerp(Sh[0], T[0], 0.5) + (profile ? -dir * 0.02 * unit : s * 0.02 * unit), lerp(Sh[1], T[1], 0.5)] as Pt));
    return {Sh, E, T};
  };
  const R = arm('r'), Lm = arm('l');
  const drawArm = (A: {Sh: Pt; E: Pt; T: Pt}, hold: Prop | undefined, k: number, far: boolean, only?: 'upper' | 'lower') => {
    part = 70 + k * 10;
    line = 70 + k * 10;
    const sl = far ? mixColor(sleeve, '#000000', 0.15) : sleeve;
    if (only !== 'lower') fill(sl, capsule(A.Sh, A.E, 0.08 * unit, 0.068 * unit), true);
    if (only === 'upper') return A.T;
    fill(o.longSleeves ? sl : skinHand, capsule(A.E, A.T, 0.066 * unit, 0.056 * unit), true);
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
    fill(o.coat ? '#26292c' : skinHand, ell(hand[0], hand[1], 0.045 * unit, 0.052 * unit, 14, ang), true, o.coat ? 6 : 4);
    return hand;
  };

  // Profile: the far arm goes behind the torso; redraw order handled by drawing it first (before head and near arm).
  const nearSide: 'r' | 'l' = dir > 0 ? 'r' : 'l';
  let rHand: Pt = R.T, lHand: Pt = Lm.T;
  if (profile) {
    // The far arm is painted over the torso but is hidden behind it when it hangs; draw it slightly darker.
    if (nearSide === 'r') lHand = drawArm(Lm, pose.lHold, 1, true);
    else rHand = drawArm(R, pose.rHold, 0, true);
  } else {
    if (pose.rArm?.behind) rHand = drawArm(R, pose.rHold, 0, true, pose.rArm.behind === 'upper' ? 'upper' : undefined);
    if (pose.lArm?.behind) lHand = drawArm(Lm, pose.lHold, 1, true, pose.lArm.behind === 'upper' ? 'upper' : undefined);
  }

  // ----------------------------------------------------------------- torso layers
  part = 40;
  line = 40;
  const kneeV = legs[0].knee[1];
  if (!profile) {
    if (!o.skirt && !o.coat) fill(o.pants, Uq([[-hw - 0.0085, hip0 + 0.0255], [hw + 0.0085, hip0 + 0.0255], [hw, crotch0], [-hw, crotch0]]), false);
    if (o.skirt) {
      const kx = Math.abs(legs[0].knee[0]);
      fill(o.skirt, [...Uq([[-hw - 0.0085, hip0 + 0.034], [hw + 0.0085, hip0 + 0.034]]), ...Sq([[kx + 0.06, Math.max(kneeV - 0.19 * (1 - c), 0.3 * c + 0.2)], [-kx - 0.06, Math.max(kneeV - 0.19 * (1 - c), 0.3 * c + 0.2)]])]);
    }
    const top: Pt[] = [[-sw + 0.017, shV], [sw - 0.017, shV], [sw, shV - 0.034], [hw + 0.013, hip0], [-hw - 0.013, hip0], [-sw, shV - 0.034]];
    if (coat) {
      const hem = Math.max(kneeV - 0.05, 0.12);
      fill(coat, [...Uq([[-sw + 0.017, shV], [sw - 0.017, shV], [sw + 0.0085, shV - 0.0425]]), S([hw + 0.085 + 0.08 * c, hem]), S([-hw - 0.085 - 0.08 * c, hem]), U([-sw - 0.0085, shV - 0.0425])]);
      inkLine(p, seed * 1000 + ++line, [U([0, shV - 0.05]), U([0, hip0 - 0.02]), S([0, hem])], {closed: false, weight: 0.9, curve: 0.1});
      if (pose.wet) for (let i = 0; i < 6; i++) inkLine(p, seed * 1000 + 60 + i, [U([-0.12 + i * 0.05, shV - 0.06 - 0.07 * (i % 3)]), U([-0.12 + i * 0.05, shV - 0.12 - 0.07 * (i % 3)])], {color: '#8fa6b8', weight: 0.8, closed: false});
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
    if (!o.skirt && !o.coat) fill(o.pants, Uq([[-0.21 * H, hip0 + 0.0255], [0.18 * H, hip0 + 0.0255], [0.17 * H, crotch0], [-0.24 * H, crotch0 - 0.0085]]), false);
    if (o.skirt) fill(o.skirt, [...Uq([[-0.24 * H, hip0 + 0.034], [0.2 * H, hip0 + 0.034]]), ...Sq([[0.3 * H, kneeV - 0.19], [-0.32 * H, kneeV - 0.19]])], true, 8);
    if (coat) {
      // The hem hangs to the knee when standing and follows the torso when bent (hands on knees), blended by `bend`:
      // a hem pinned to the knee in plate space reads as a kicked leg (SS-R3.2 S04-SH01 defect).
      const hem = Math.max(kneeV - 0.05, 0.12);
      const hemPt = (u: number, v: number): Pt => {
        const a = S([u, hem]), b = U([u, v]);
        return [lerp(a[0], b[0], bend), lerp(a[1], b[1], bend)];
      };
      fill(coat, [...Uq([[-0.19 * H, shV], [0.14 * H, shV], [0.24 * H, shV - 0.0935], [0.2 * H, hip0]]), hemPt(0.3 * H + 0.06 * bend, hip0 - 0.14), hemPt(-0.32 * H, hip0 - 0.14), ...Uq([[-0.26 * H, hip0], [-0.24 * H, shV - 0.064]])]);
      if (pose.wet) for (let i = 0; i < 5; i++) inkLine(p, seed * 1000 + 60 + i, [U([-0.06 + i * 0.03, shV - 0.06 - 0.08 * (i % 3)]), U([-0.06 + i * 0.03, shV - 0.13 - 0.08 * (i % 3)])], {color: '#8fa6b8', weight: 0.8, closed: false});
    } else {
      // The shirt and jacket reach the top of the trousers (hip0 + 0.0255): a shorter hem left a notch at the hip in
      // profile, where the far hanging hand showed through (SS-R3.2 profile hip gap, S03-SH07 and S04-SH02).
      fill(o.shirt, Uq([[-0.18 * H, shV], [0.14 * H, shV], [0.22 * H, shV - 0.085], [0.18 * H, hip0 + 0.0255], [-0.2 * H, hip0 + 0.0255], [-0.21 * H, shV - 0.064]]));
      // The jacket hem reaches the trouser front (0.18 H) at the hip: a shorter front corner left a step in the profile
      // silhouette (Boss r3, S03-SH07 and S04-SH02 thigh notch).
      if (o.jacket) fill(o.jacket, Uq([[-0.19 * H, shV], [0.12 * H, shV], [0.16 * H, shV - 0.085], [0.18 * H, hip0 + 0.0255], [-0.23 * H, hip0 + 0.0255], [-0.23 * H, shV - 0.064]]));
      if (o.apron) fill(o.apron, Uq([[0.18 * H, shV - 0.0935], [0.24 * H, shV - 0.085], [0.26 * H, hip0 - 0.136], [0.18 * H, hip0 - 0.136]]), true, 8);
    }
  }

  // ----------------------------------------------------------------- neck and head
  part = 120;
  line = 120;
  const nw = o.coat ? (profile ? 0.16 * H : 0.24 * H) : profile ? 0.08 * H : 0.1 * H;
  const nx = profile ? -0.08 * H : 0;
  fill(coat ?? (L ? mixColor(def.head.skin, VD18.shadow, 0.3) : def.head.skin), Uq([[nx - nw, chin + 0.051], [nx + nw, chin + 0.051], [nx + nw + 0.0043, shV - 0.013], [nx - nw - 0.0043, shV - 0.013]]), false, 6);
  const nod = pose.nod ?? [0, 0];
  const hc = U([nx + nod[0] * K, chin + CHIN * K - nod[1] * K]);
  const Kpx = K * unit;
  // The head stays upright (decal), only its centre follows the body transform.
  if (headView === 'front') paintHeadFront(p, seed + 1, hc[0], hc[1], Kpx, pose.face, def.head, t, warm, L);
  else paintHeadSide(p, seed + 1, hc[0], hc[1], Kpx, pose.face, def.head, headView === 'left' ? -1 : 1, t, warm, L);

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

  const headTop = hc[1] - 1.17 * Kpx;
  const chinY = hc[1] + CHIN * Kpx;
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

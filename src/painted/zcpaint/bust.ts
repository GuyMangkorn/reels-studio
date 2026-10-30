import type {Pt} from '../painter';
import type {Cast} from '../spike/CastSheet';
import {CHIN, FACES, type Face} from '../spike/FaceSheet';
import {ellipse} from '../spike/ProportionSheet';
import {
  convexOf, footContact, footCtrl, FOOT_R, H6, handParts, hairStrands, headMark, ik2, K6, lerpHU, mid, profileFolds, stubble, tub, toeLines, torsoMarks, unitHU,
  type Fig, type Hand, type HandKind, type HeadMark, type HU, type Part,
} from './body6';
import {BOB_SIDE, paintInfectedSide, paintRageFront} from './cast';
import {cel} from './light';

// ZCPAINT close bust (Boss pass 10; user 30 Oct 2026: "วาดตัวช็อตใกล้แยก", a separate half-body drawing for the close shots). ZC only:
// WORLD FOG's 4-head figure and the full-length 6-head figures (`body6.ts` figFront / figSide / figSlack / figSeatFloor) are unchanged
// and still serve the medium and full-length shots. The bust redraws the upper body for closes: a natural shoulder slope into the neck
// (one convex shirt outline, no separate shoulder domes), a collar and a few cloth folds, sleeves that start inside the shoulder line and
// taper into the upper arm, forearms with mitten, fist or pinch hands, a chest and back shape, and the infected variant (slack shoulders,
// the head a little higher, dirty shirt, blood, rage face, bob hair). Parts are flat washes with two cel tones under the plate's key
// (`LT-02`); decal faces are the WORLD FOG heads at the plate's K, unshaded (`LT-05`).
//
// Geometry is in head units (`HU`, 1 head = 0.283 m, y up from the floor). The legs are the 6-head legs, so a plate whose frame ends above
// the feet crops them with the frame; `legs: false` stops at the shorts hem (a bust cut at the hips).

export type BustView = 'front' | 'back' | 'side';
/** Arm pose. `hang`: the arm falls under gravity with the hand of kind `hand` (default mitten) at the wrist. `reach`: two-bone IK to the grip
 *  point `to` (head units), the wrist held 0.17 head behind it, the hand kind `hand`; `bend` picks the elbow side (default: the arm's side). */
export type ArmPose = {kind: 'hang'; hand?: HandKind} | {kind: 'reach'; to: HU; hand: HandKind; bend?: 1 | -1};
export type BustOpts = {
  view: BustView;
  face?: Face;
  blink?: boolean;
  /** Blink start (s, plate time) when `blink` is on (B09-SH02: pf 10-14). */
  blinkAt?: number;
  cell?: number;
  /** 0 upright .. 1 slack: the infected left to gravity (shoulders drop, the head drops less, the arms hang forward). */
  slump?: number;
  /** `rage`: the infected's rage face on the front decal; `day3`: stubble and the day-three marks (B09). */
  overlay?: 'rage' | 'day3';
  blood?: boolean;
  dirt?: boolean;
  /** Front and back: `L` is screen-left, `R` screen-right. Side (facing +x): `L` is the far arm (cel), `R` the near arm. */
  arms?: {L?: ArmPose; R?: ArmPose};
  /** Legs to the feet (default true). `false` stops at the shorts hem for a bust cut at the hips. */
  legs?: boolean;
  /** Props drawn after the torso and before the hands (a bag, a bucket handle). */
  inserts?: Part[];
  /** Seated on the floor, facing +x, hugging the knees (B09-SH02); `pitch` nods the head forward (rad). Side view only. */
  seated?: boolean;
  pitch?: number;
};

/** Key travel for a figure: `screen` is the light's travel on the plate (x right, y down); `dir` mirrors the figure (-1 faces screen-left). */
export const keyTravel = (dir: 1 | -1, screen: Pt): Pt => {
  const x = dir * screen[0], y = screen[1];
  const n = Math.hypot(x, y) || 1;
  return [x / n, y / n];
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const L2 = (a: HU, b: HU, s: number): HU => lerpHU(a, b, s);
const toPx = (pts: HU[]): Pt[] => pts.map(([x, u]): Pt => [x * H6, -u * H6]);

/** Cloth folds (cel tone) in the shirt: drapes from the armpit toward the hem, and the side seam. The back has two drapes at the sides. */
const clothFolds = (shirt: string, front: boolean): Part => ({
  col: '', pts: [], cel: 0,
  draw: (p) => {
    const fold = cel(shirt);
    const segs: HU[][] = front
      ? [[[-0.5, 3.95], [-0.46, 3.62], [-0.56, 3.36]], [[0.46, 3.9], [0.5, 3.6], [0.42, 3.3]], [[0.06, 3.7], [0.14, 3.44], [0.04, 3.2]]]
      : [[[-0.42, 4.0], [-0.36, 3.7], [-0.46, 3.42]], [[0.4, 3.9], [0.44, 3.5], [0.36, 3.2]]];
    for (const seg of segs) p.ink(toPx(seg), 0.8, 0.5, fold);
  },
});

/** Standing front or back bust, 6 heads, with the infected's slump (`slump` 1 is `figSlack` front: shoulders -0.22 head, head -0.12). */
const standing = (c: Cast, o: BustOpts): Fig => {
  const out = c.outfit, sk = c.head.skin, back = o.view === 'back', cell = o.cell ?? 0;
  const s = clamp01(o.slump ?? 0);
  // Slack shoulders (infected): the outer shoulder drops 0.30 head, the neck base 0.20 (the head drops 0.12, so it stays higher).
  const sdO = 0.3 * s, sdT = 0.2 * s, hd = 0.12 * s, chin = 5.0 - hd;
  const long = c.role === 'zc-infected';
  const hipY = 3.0 - 0.08 * s;
  const top = 4.82 - sdT;
  // The slack infected is slimmer through the torso and arms (0.12 narrower at the side seams, the arms 0.08 closer to the body).
  const tw = 1 - 0.12 * s, aw = 0.08 * s;
  const parts: Part[] = [], hands: Hand[] = [], contact: Pt[][] = [];

  // Legs: shorts and bare shins for the tee-and-shorts figure; long trousers for the infected (as `figSlack`).
  if (o.legs !== false) {
    for (const sg of [-1, 1] as const) {
      if (long) {
        parts.push(tub(out.pants, [[sg * 0.3, hipY], [sg * 0.29, 2.5], [sg * 0.27, 1.6], [sg * 0.25, 0.22]], [0.25, 0.23, 0.2, 0.16], 0.14));
      } else {
        parts.push(tub(out.pants, [[sg * 0.3, 3.0], [sg * 0.29, 2.5], [sg * 0.28, 2.1]], [0.25, 0.23, 0.21], 0.14));
        parts.push(tub(sk, [[sg * 0.28, 2.16], [sg * 0.27, 1.78], [sg * 0.26, 1.1], [sg * 0.25, 0.24]], [0.2, 0.18, 0.165, 0.12], 0.11));
      }
      parts.push(tub(sk, [[sg * 0.2, 0.1], [sg * 0.33, 0.085]], [0.09, 0.07], 0.06));
      contact.push(footContact(sg * 0.27));
    }
  }
  if (long) {
    parts.push(convexOf(out.pants, [[-0.56, hipY + 0.34], [0.56, hipY + 0.34], [0.62, hipY], [0.58, 2.7], [-0.58, 2.7], [-0.62, hipY]], 0.34));
  } else {
    parts.push(convexOf(out.pants, [[-0.56, 3.36], [0.56, 3.36], [0.64, 3.02], [0.6, 2.7], [-0.6, 2.7], [-0.64, 3.02]], 0.34));
  }

  // Arms: the upper arm is a tapered sleeve that starts inside the shoulder line; the forearm skin runs to the wrist; the hand is a mitten,
  // a fist or a pinch. The shoulder joint sits inside the shirt edge, so no shoulder dome shows. A reaching arm crosses the torso, so it is
  // drawn after the shirt (`over`); a hanging arm sits behind the shirt edge.
  const overArms: Part[] = [];
  for (const sg of [-1, 1] as const) {
    const side = sg === -1 ? 'L' : 'R';
    const S = L2([sg * 0.6, 4.4], [sg * (0.6 - aw), 4.12], s);
    let E = L2([sg * 0.84, 3.52], [sg * (0.84 - aw), 3.34], s);
    let W = L2([sg * 0.92, 2.68], [sg * (0.92 - 2 * aw), 2.44], s);
    let hand: Hand = {kind: 'mitten', w: W, dir: [sg * 0.05 * (1 + s), -1], thumb: sg === 1 ? -1 : 1};
    const pose = o.arms?.[side];
    if (pose?.kind === 'reach') {
      E = ik2(S, pose.to, 0.9, 0.88, pose.bend ?? sg);
      const d = unitHU([pose.to[0] - E[0], pose.to[1] - E[1]]);
      W = [pose.to[0] - d[0] * 0.17, pose.to[1] - d[1] * 0.17];
      hand = {kind: pose.hand, w: W, dir: d, thumb: sg === 1 ? -1 : 1};
    } else if (pose?.kind === 'hang') {
      hand = {...hand, kind: pose.hand ?? 'mitten'};
    }
    const arm = pose?.kind === 'reach' ? overArms : parts;
    arm.push(tub(sk, [S, E, W], [0.15, 0.13, 0.105], 0.11, {up: true}));
    arm.push(tub(out.sleeve, [S, mid(S, E, 0.5)], [0.175, 0.165], 0.13, {up: true}));
    hands.push(hand);
  }

  // Neck (cel under the chin, as `figFront`), the shirt, the cloth folds, the collar and the props.
  parts.push(tub(sk, [[0, 4.66 - sdT], [0, chin + 0.02]], [0.19, 0.18], 0.12, {far: true, ink: false, up: true}));
  parts.push(convexOf(out.shirt, [
    [-0.2, top], [0.2, top], [0.44, top - 0.08], [0.66 * tw, 4.5 - sdO], [0.72 * tw, 4.12 - 0.5 * s],
    [0.7 * tw, 3.62], [0.66 * tw, 3.3], [0.68 * tw, 2.96], [-0.68 * tw, 2.96], [-0.66 * tw, 3.3], [-0.7 * tw, 3.62], [-0.72 * tw, 4.12 - 0.5 * s], [-0.66 * tw, 4.5 - sdO], [-0.44, top - 0.08],
  ], 0.4, {up: true}));
  parts.push(clothFolds(out.shirt, !back));
  parts.push(torsoMarks(!back, out.shirt, !!o.blood, !!o.dirt));
  parts.push(...(o.inserts ?? []));
  parts.push(...overArms);
  for (const h of hands) parts.push(...handParts(h, sk));

  const hy = -chin * H6 - CHIN * K6;
  const over: HeadMark['over'] = back || !o.overlay ? undefined
    : o.overlay === 'rage' ? (ctx, p) => paintRageFront(ctx, p, 0, hy, K6)
      : (_ctx, p) => stubble(p, 0, hy, K6, 'front', sk);
  const head = headMark(back ? 'back' : 'front', 0, hy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, blinkAt: o.blinkAt, over});
  if (back) head.tufts = false;
  return {
    view: back ? 'back' : 'front', parts, head, contact,
    anchors: {hips: [0, -hipY * H6], knees: [[-0.27 * H6, -1.7 * H6], [0.27 * H6, -1.7 * H6]], feet: [[-0.27 * H6, 0], [0.27 * H6, 0]], hands: hands.map((h) => [h.w[0] * H6, -h.w[1] * H6] as Pt), head: [0, hy]},
  };
};

/** Standing profile bust, facing +x (the mirror for facing left is `dir` -1 in `drawFig`). The stance, tee and sleeve are `figSide`'s
 *  (the approved S-P12 7b profile) at `slump` 0; at `slump` 1 the poses are `figSlack`'s side pose (head pitched 0.25 rad). */
const profile = (c: Cast, o: BustOpts): Fig => {
  const out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  const s = clamp01(o.slump ?? 0);
  const H = L2([0, 3.0], [0.04, 2.92], s);
  const S = L2([-0.04, 4.44], [0.26, 4.18], s);
  const P = L2([0.02, 4.6], [0.3, 4.42], s);
  const C0: HU = [P[0] + 0.08, P[1] + 0.937 + 0.023 * s];
  const tilt = 0.25 * s;
  const long = c.role === 'zc-infected';
  const parts: Part[] = [];
  // Far side, all cel: the far arm and leg.
  const EF = L2([0.26, 3.6], [0.42, 3.38], s), WF = L2([0.42, 2.78], [0.5, 2.52], s), SF = L2([0.02, 4.45], [0.24, 4.2], s);
  parts.push(tub(sk, [SF, EF, WF], [0.16, 0.125, 0.1], 0, {far: true, up: true}));
  parts.push(...handParts({kind: 'mitten', w: WF, dir: [0.35 - 0.15 * s, -1], thumb: 1, forceCel: true}, sk));
  const kneeF = L2([0, 1.6], [-0.12, 1.58], s), ankF = L2([-0.4, 0.24], [-0.22, 0.2], s);
  if (o.legs !== false) {
    parts.push(tub(out.pants, [H, mid(H, kneeF, 0.5), kneeF], [0.25, 0.23, 0.2], 0, {far: true}));
    parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  }
  // Neck behind the collar, all cel (the approved thick neck, pass 8).
  parts.push(tub(sk, [P, [P[0] + 0.06, P[1] + 0.36]], [0.18, 0.17], 0.14, {far: true, ink: false, up: true}));
  // Near leg: shorts to the hem then bare shin (figSide), or long trousers (the infected).
  const kneeN = L2([0, 1.6], [0.1, 1.52], s), ankN: HU = [-0.12, 0.16];
  if (o.legs !== false) {
    if (long) {
      parts.push(tub(out.pants, [H, mid(H, kneeN, 0.5), kneeN, mid(kneeN, ankN, 0.6)], [0.26, 0.24, 0.2, 0.16], 0.16));
    } else {
      const hemN: HU = [H[0] + (kneeN[0] - H[0]) * ((3.0 - 2.12) / (3.0 - kneeN[1])), 2.12];
      parts.push(tub(out.pants, [H, mid(H, kneeN, 0.5), hemN], [0.26, 0.24, 0.21], 0.16));
      parts.push(tub(sk, [hemN, kneeN, ankN], [0.2, 0.17, 0.12], 0.12));
    }
    parts.push(tub(sk, footCtrl(ankN, 0), FOOT_R, 0.05));
  }
  // Shirt: figSide's tee for the standing figure, the slack torso of figSlack for the infected; the seat block for the standing figure.
  if (s < 0.5) {
    parts.push(convexOf(out.shirt, [[-0.3, 4.78], [0.02, 4.8], [0.24, 4.74], [0.36, 4.44], [0.36, 3.9], [0.34, 3.4], [0.34, 2.98], [-0.4, 2.98], [-0.42, 3.5], [-0.44, 3.9], [-0.44, 4.5], [-0.4, 4.66]], 0.34, {up: true}));
    if (o.legs !== false) parts.push(convexOf(out.pants, [[-0.42, 3.3], [0.3, 3.32], [0.38, 2.9], [0.4, 2.66], [-0.42, 2.64], [-0.46, 2.96]], 0.26));
  } else {
    parts.push(convexOf(out.shirt, [[H[0] - 0.4, H[1] - 0.04], [H[0] + 0.34, H[1] - 0.04], [H[0] + 0.38, H[1] + 0.5], [S[0] + 0.3, S[1] - 0.1], [S[0] + 0.18, S[1] + 0.12], [P[0] - 0.08, P[1] - 0.02], [S[0] - 0.26, S[1] + 0.04], [H[0] - 0.42, H[1] + 0.56]], 0.34, {up: true}));
  }
  // Near arm: a tapered sleeve over the upper arm, the forearm, and the hand (mitten, or the reach).
  const SN = S, pose = o.arms?.R;
  let EN = L2([-0.22, 3.56], [0.32, 3.34], s), WN = L2([-0.36, 2.76], [0.38, 2.48], s);
  let hand: Hand = {kind: 'mitten', w: WN, dir: [-0.15 + 0.35 * s, -1], thumb: 1};
  if (pose?.kind === 'reach') {
    EN = ik2(SN, pose.to, 0.9, 0.88, pose.bend ?? 1);
    const d = unitHU([pose.to[0] - EN[0], pose.to[1] - EN[1]]);
    WN = [pose.to[0] - d[0] * 0.17, pose.to[1] - d[1] * 0.17];
    hand = {kind: pose.hand, w: WN, dir: d, thumb: 1};
  } else if (pose?.kind === 'hang') {
    hand = {...hand, kind: pose.hand ?? 'mitten'};
  }
  parts.push(tub(sk, [SN, EN, WN], [0.16, 0.125, 0.1], 0.11, {up: true}));
  parts.push(tub(out.sleeve, [[SN[0] - 0.02, SN[1] + 0.02], mid(SN, EN, 0.5)], [0.165, 0.155], 0.13, {up: true}));
  parts.push(...handParts(hand, sk));
  parts.push(profileFolds(H, S, out.shirt));
  parts.push(...(o.inserts ?? []));
  if (o.legs !== false) parts.push(toeLines(ankN));
  const hx = C0[0] * H6, hy = -C0[1] * H6;
  const over: HeadMark['over'] = (_ctx, p) => {
    hairStrands(p, hx, hy);
    if (o.overlay === 'day3') stubble(p, hx, hy, K6, 'side', sk);
    if (s > 0) paintInfectedSide(p, hx, hy, K6, true);
  };
  const head = headMark('side', hx, hy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, blinkAt: o.blinkAt, over});
  if (s > 0) head.silHair = BOB_SIDE.map(([u, v]): Pt => [hx + u * K6, hy + v * K6]);
  if (tilt) {
    head.tilt = tilt;
    head.pivot = [P[0] * H6, -P[1] * H6];
  }
  return {
    view: 'profile', parts, head, contact: o.legs === false ? [] : [footContact(ankN[0]), footContact(ankF[0])],
    anchors: {hips: [H[0] * H6, -H[1] * H6], knees: [[kneeN[0] * H6, -kneeN[1] * H6]], feet: [[ankN[0] * H6, 0], [ankF[0] * H6, 0]], hands: [[WN[0] * H6, -WN[1] * H6]], head: [hx, hy]},
  };
};

/**
 * Seated profile on the floor, facing +x, hugging the knees (B09-SH02, day 3): the figSeatFloor legs, the near forearm to a fist on the
 * knee and the far forearm crossed in front of the shin, with a chest and back shaped torso instead of a block and the shoulder slope into
 * the neck. Hip 0.34 head up, lean 0.13 rad (as `figSeatFloor`), the head centre 0.73 head above the shoulder line.
 */
const seatFloor = (c: Cast, o: BustOpts): Fig => {
  const out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 0.34], ank: HU = [1.22, 0.16];
  const knee = ik2(hip, ank, 1.42, 1.48, 1);
  const lean = 0.13, N: HU = [Math.sin(lean), Math.cos(lean)];
  /** Upright frame (x forward, u up) about the hip, leaned by `lean`. */
  const T = (x: number, u: number): HU => [hip[0] + x * N[1] + u * N[0], hip[1] - x * N[0] + u * N[1]];
  const S: HU = T(0, 1.8);
  const parts: Part[] = [], hands: Hand[] = [];
  // Far leg and far forearm (cel).
  const kneeF: HU = [knee[0] - 0.06, knee[1] + 0.02], ankF: HU = [ank[0] - 0.08, ank[1]];
  parts.push(tub(out.pants, [hip, mid(hip, kneeF, 0.5), kneeF], [0.31, 0.29, 0.23], 0, {far: true}));
  parts.push(tub(sk, [kneeF, ankF], [0.17, 0.11], 0, {far: true}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const Sf: HU = [S[0] - 0.04, S[1] - 0.05], Tf: HU = [1.02, 1.2];
  const Ef = ik2(Sf, Tf, 0.9, 0.88, -1), df = unitHU([Tf[0] - Ef[0], Tf[1] - Ef[1]]);
  const Wf: HU = [Tf[0] - df[0] * 0.17, Tf[1] - df[1] * 0.17];
  parts.push(tub(sk, [Sf, Ef, Wf], [0.16, 0.125, 0.1], 0, {far: true, up: true}));
  hands.push({kind: 'fist', w: Wf, dir: df, thumb: 1, forceCel: true});
  // Seat, near thigh and shin, foot.
  parts.push(convexOf(out.pants, [[-0.46, 0.74], [0.3, 0.52], [0.36, 0.04], [-0.42, 0.02]], 0.24));
  parts.push(tub(out.pants, [hip, mid(hip, knee, 0.5), knee], [0.3, 0.27, 0.23], 0.2));
  parts.push(tub(sk, [knee, ank], [0.17, 0.105], 0.12));
  parts.push(tub(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  // Torso: back and chest in the upright frame (waist, chest, shoulder blade), then the shoulder slope to the neck.
  parts.push(convexOf(out.shirt, [T(-0.42, -0.06), T(0.36, -0.06), T(0.4, 0.42), T(0.38, 1.0), T(0.3, 1.5), T(0.12, 1.78), T(-0.2, 1.82), T(-0.4, 1.66), T(-0.46, 1.2), T(-0.44, 0.62), T(-0.42, 0.2)], 0.34, {up: true}));
  // Near arm: sleeve over the upper arm, forearm to the fist on the knee.
  const Sa: HU = [S[0] + 0.02, S[1] - 0.05], Tn: HU = [1.12, 1.12];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(tub(sk, [Sa, En, Wn], [0.16, 0.125, 0.1], 0.11, {up: true}));
  parts.push(tub(out.sleeve, [Sa, mid(Sa, En, 0.5)], [0.165, 0.155], 0.13, {up: true}));
  hands.push({kind: 'fist', w: Wn, dir: dn, thumb: 1});
  for (const h of hands) parts.push(...handParts(h, sk));
  parts.push(profileFolds(hip, S, out.shirt));
  parts.push(toeLines(ank));
  const chin: HU = T(0.27, 1.8);
  parts.push(tub(sk, [S, chin], [0.15, 0.13], 0.12, {ink: false, up: true}));
  const unrot: HU = T(0.73, 1.8);
  const piv: HU = T(0.3, 1.8);
  const cx = unrot[0] * H6, cy = -unrot[1] * H6;
  const over: HeadMark['over'] = (_ctx, p) => {
    hairStrands(p, cx, cy);
    if (o.overlay === 'day3') stubble(p, cx, cy, K6, 'side', sk);
  };
  const head = headMark('side', cx, cy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, blinkAt: o.blinkAt, over});
  if (o.pitch) {
    head.tilt = o.pitch;
    head.pivot = [piv[0] * H6, -piv[1] * H6];
  }
  return {
    view: 'seat-floor', parts, head,
    contact: [ellipse(-0.05 * H6, 0, 0.44 * H6, 0.06 * H6, 16), footContact(ank[0])],
    anchors: {hips: [0, -hip[1] * H6], knees: [[knee[0] * H6, -knee[1] * H6]], feet: [[ank[0] * H6, 0]], hands: hands.map((h) => [h.w[0] * H6, -h.w[1] * H6] as Pt), head: [head.x, head.y]},
  };
};

/**
 * The close bust: standing front or back (`view`), standing profile (`view` side, `slump` for the infected), or the seated profile on the
 * floor (`seated`, side view). Returns a `Fig` for `drawFig`; the head centre is `fig.head.x / y` for placing it on the plate.
 */
export const bustFig = (c: Cast, o: BustOpts): Fig => {
  if (o.seated) return seatFloor(c, o);
  return o.view === 'side' ? profile(c, o) : standing(c, o);
};

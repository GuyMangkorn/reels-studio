import type {Pt} from '../kit/painter';
import type {Cast} from '../spike/CastSheet';
import {CHIN, FACES, type Face} from '../spike/FaceSheet';
import {ellipse} from '../spike/ProportionSheet';
import {
  CL, collarSeat, collarSide, collarStand, convexOf, costumeOf, cuffLine, foldTone, footContact, footCtrl, FOOT_R, H6, handParts, hairStrands,
  headMark, ik2, K6, lerpHU, mid, MITTEN_6H, placket, type Place, profileFolds, rotPt, stubble, strokes, toeLines, torsoMarks, trouserLeg, tub, unitHU,
  type Fig, type Hand, type HandKind, type HeadMark, type HU, type Part,
} from './body6';
import {BOB_SIDE, paintInfectedSide, paintRageFront} from './cast';
import {cel} from './light';
import {proj3, reachArm, type Cam3, type Reach3} from './proj';

// ZCPAINT close bust (Boss pass 10; user 30 Oct 2026: "วาดตัวช็อตใกล้แยก", a separate half-body drawing for the close shots). ZC only:
// WORLD FOG's 4-head figure and the full-length 6-head figures (`body6.ts`) are unchanged in their own modules and still serve the medium
// and full-length shots. The bust redraws the upper body for closes: a natural shoulder slope into the neck, a collar and a few cloth
// folds, sleeves that start inside the shoulder line and run to the wrist, forearms with mitten, fist or pinch hands, a chest and back
// shape, and the infected variant (slack shoulders, the head a little higher, khaki shirt, blood, rage face, bob hair).
//
// Pass 11 (R2.6, `CS-ZCP-R26`): the costume of `body6.ts` (open overshirt over a tee, sleeves to the wrist, trousers to the ankle; bare
// skin only at hands, feet, neck and face), the collar stand, and the shorter bust neck (collar base 4.80, 0.34 head wide). The visible
// bare neck from the chin to the collar edge is at most 0.10 head (`visibleNeckHU`). Parts are flat washes with two cel tones under the
// plate's key (`LT-02`); decal faces are the WORLD FOG heads at the plate's K, unshaded (`LT-05`).
//
// Geometry is in head units (`HU`, 1 head = 0.283 m, y up from the floor). `legs: false` stops at the waist (the close cut); the legs are
// the 6-head legs otherwise, so a plate whose frame ends above the feet crops them with the frame.

export type BustView = 'front' | 'back' | 'side';
/** Arm pose. `hang`: the arm falls under gravity with the hand of kind `hand` (default mitten) at the wrist (CP-P05). `reach`: two-bone IK
 *  to the grip point `to` (head units), the wrist held 0.17 head behind it, the hand kind `hand`; `bend` picks the elbow side (default: the
 *  arm's side). `depth: 'behind'` (front and back views, CP-P02): the elbow goes back into depth just inside the torso edge, a little below
 *  the grip; the upper arm is drawn behind the torso and the forearm in front. `dir` (side view only, B07-SH01 R2.6 fix): the finger
 *  direction, so `to` is the fingertip contact and the hand points at it instead of up the forearm (see `reachPts`). */
export type ArmPose = {kind: 'hang'; hand?: HandKind; across?: number} | {kind: 'reach'; to: HU; hand: HandKind; bend?: 1 | -1; depth?: 'front' | 'behind'; across?: number; dir?: HU; lay?: number}
  /** `reach3` (PJ-ZCP-07, Boss pass 14): a 3D reach into depth, projected by `BustOpts.proj`; the mitten is part of the arm. */
  | {kind: 'reach3'; pose: Reach3};
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
  /** The 3D camera (PJ-ZCP-07) that projects a `reach3` arm into the card's head units. Standing front and back views only. */
  proj?: Cam3;
  /** Legs to the feet (default true). `false` stops at the waist for a close cut. */
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

/** Bust torso outlines (head units; wider than the full figure's overshirt): the tee block, the open overshirt, the tee strip. */
const BUST_TEE: HU[] = [[-0.22, 4.84], [0.22, 4.84], [0.48, 4.76], [0.7, 4.54], [0.8, 4.14], [0.78, 3.62], [0.74, 3.2], [0.76, 2.7], [-0.76, 2.7], [-0.74, 3.2], [-0.78, 3.62], [-0.8, 4.14], [-0.7, 4.54], [-0.48, 4.76]];
const BUST_STRIP: HU[] = [[-0.22, 4.8], [0.22, 4.8], [0.26, 3.6], [0.32, 2.7], [-0.32, 2.7], [-0.26, 3.6]];

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
  const k = costumeOf(c), out = c.outfit, sk = c.head.skin, back = o.view === 'back', cell = o.cell ?? 0;
  const inf = c.role === 'zc-infected';
  const s = clamp01(o.slump ?? 0);
  // Slack shoulders (infected): the outer shoulder drops 0.30 head, the neck base 0.20 (the head drops 0.12, so it stays higher).
  const sdO = 0.3 * s, sdT = 0.2 * s, hd = 0.12 * s, chin = 5.0 - hd;
  const hipY = 3.0 - 0.08 * s;
  const top = 4.82 - sdT;
  // The slack infected is slimmer through the torso and arms (0.12 narrower at the side seams, the arms 0.08 closer to the body).
  const tw = 1 - 0.12 * s, aw = 0.08 * s;
  const parts: Part[] = [], armBack: Part[] = [], overArms: Part[] = [], hands: Hand[] = [], contact: Pt[][] = [];
  /** Wrist anchors of the arms in side order (L, R), 2D hands and projected arms alike. */
  const anchorHands: Pt[] = [];

  // Legs (close shots cut at the waist and draw none): trousers to the ankle, bare feet.
  if (o.legs !== false) {
    for (const sg of [-1, 1] as const) {
      parts.push(trouserLeg(k.pants, sg, hipY));
      parts.push(tub(sk, [[sg * 0.2, 0.1], [sg * 0.33, 0.085]], [0.09, 0.07], 0.06));
      contact.push(footContact(sg * 0.27));
    }
    parts.push(convexOf(k.pants, [[-0.56, hipY + 0.34], [0.56, hipY + 0.34], [0.62, hipY], [0.58, 2.7], [-0.58, 2.7], [-0.62, hipY]], 0.34, CL));
  }

  // Arms: a full sleeve from inside the shoulder line to the wrist (cuff), the mitten, fist or pinch hand. A reaching arm crosses the torso,
  // so it is drawn after the shirt (`overArms`); a hanging arm sits behind the shirt edge; a `behind` reach has its upper arm behind the torso.
  for (const sg of [-1, 1] as const) {
    const side = sg === -1 ? 'L' : 'R';
    const S = L2([sg * 0.6, 4.4], [sg * (0.6 - aw), 4.12], s);
    let E = L2([sg * 0.84, 3.52], [sg * (0.84 - aw), 3.34], s);
    let W = L2([sg * 0.92, 2.68], [sg * (0.92 - 2 * aw), 2.44], s);
    let hand: Hand = {kind: 'mitten', w: W, dir: [sg * 0.05 * (1 + s), -1], thumb: sg === 1 ? -1 : 1};
    const pose = o.arms?.[side];
    if (pose?.kind === 'reach3') {
      // PJ-ZCP-07: the 3D arm, projected into the card's head units. It reaches into depth, so the back view draws it before the torso
      // (the back hides the arm root) and the front view after it, like the other reaching arms. The mitten is part of the arm.
      if (!o.proj) throw new Error('bust: a reach3 arm needs BustOpts.proj');
      const arm = reachArm(o.proj, pose.pose, k.over, sk);
      if (back) armBack.push(...arm);
      else overArms.push(...arm);
      const pw = proj3(o.proj, pose.pose.W);
      anchorHands.push([pw[0] * H6, -pw[1] * H6]);
      continue;
    }
    if (pose?.kind === 'reach') {
      if (pose.dir) throw new Error('bust: arm dir is for the side view (B07-SH01)');
      const behind = pose.depth === 'behind';
      E = behind ? [sg * 0.58, pose.to[1] - 0.25] : ik2(S, pose.to, 0.9, 0.88, pose.bend ?? sg);
      const d = unitHU([pose.to[0] - E[0], pose.to[1] - E[1]]);
      W = [pose.to[0] - d[0] * 0.17, pose.to[1] - d[1] * 0.17];
      hand = {kind: pose.hand, w: W, dir: d, thumb: sg === 1 ? -1 : 1, across: pose.across};
      const dW = unitHU([W[0] - E[0], W[1] - E[1]]);
      if (behind) {
        armBack.push(tub(k.over, [S, mid(S, E, 0.5), E], [0.215, 0.2, 0.19], 0, {far: true, up: true, ...CL}));
        overArms.push(tub(k.over, [E, mid(E, W, 0.5), W], [0.19, 0.18, 0.17], 0.13, {up: true, ...CL}), cuffLine(W, dW, 0.16, k.over));
      } else {
        overArms.push(tub(k.over, [S, mid(S, E, 0.5), E, W], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true, ...CL}), cuffLine(W, dW, 0.16, k.over));
      }
    } else {
      if (pose?.kind === 'hang') hand = {...hand, kind: pose.hand ?? 'mitten', across: pose.across};
      armBack.push(tub(k.over, [S, mid(S, E, 0.5), E, W], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true, ...CL}));
      armBack.push(cuffLine(W, unitHU([W[0] - E[0], W[1] - E[1]]), 0.16, k.over));
    }
    hands.push(hand);
    anchorHands.push([hand.w[0] * H6, -hand.w[1] * H6]);
  }

  // Arms behind the shirt edge, the bust neck (shorter: from the collar base 4.80, less the slump, to the chin), the shirt, its folds and collar.
  parts.push(...armBack);
  // The neck is the approved R2.6 model-sheet tube for every bust (page E, B01-SH02 charge, G2 look check): no taper (`B8`: the visible neck ≤ 0.10).
  parts.push(tub(sk, [[0, 4.8 - sdT], [0, chin + 0.02]], [0.17, 0.17], 0.12, {far: !inf, ink: false, up: true}));
  if (inf) {
    parts.push(convexOf(out.shirt, [
      [-0.2, top], [0.2, top], [0.44, top - 0.08], [0.66 * tw, 4.5 - sdO], [0.72 * tw, 4.12 - 0.5 * s],
      [0.7 * tw, 3.62], [0.66 * tw, 3.3], [0.68 * tw, 2.96], [-0.68 * tw, 2.96], [-0.66 * tw, 3.3], [-0.7 * tw, 3.62], [-0.72 * tw, 4.12 - 0.5 * s], [-0.66 * tw, 4.5 - sdO], [-0.44, top - 0.08],
    ], 0.4, {up: true, ...CL}));
    // The khaki band collar: its top 0.09 head under the chin, so the visible neck stays within 0.10 head (dried blood on it).
    parts.push(...collarStand(out.shirt, chin - 0.09, false));
  } else {
    parts.push(convexOf(k.tee, BUST_TEE, 0.42, {up: true, ...CL}));
    parts.push(convexOf(k.over, BUST_TEE, 0.42, {up: true, ...CL}));
    if (!back) {
      parts.push(convexOf(k.tee, BUST_STRIP, 0.12, {up: true, ...CL}), placket(k.over));
      // Chest pocket (closes).
      parts.push(strokes([[[0.36, 4.2], [0.58, 4.2], [0.58, 3.92], [0.36, 3.92], [0.36, 4.2]]], foldTone(k.over)));
    }
    parts.push(...collarStand(k.over, back ? 4.95 : 4.91, !back));
  }
  parts.push(clothFolds(inf ? out.shirt : k.over, !back));
  parts.push(torsoMarks(!back, inf ? out.shirt : k.over, !!o.blood, !!o.dirt));
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
    anchors: {hips: [0, -hipY * H6], knees: [[-0.27 * H6, -1.7 * H6], [0.27 * H6, -1.7 * H6]], feet: [[-0.27 * H6, 0], [0.27 * H6, 0]], hands: anchorHands, head: [0, hy]},
  };
};

/** Profile chin (head units): the decal chin 0.537 head below the head centre, pitched about the neck pivot `P` by `tilt` (SideSheet sense). */
const profileChin = (C0: HU, P: HU, tilt: number): HU => {
  const p = rotPt([C0[0] * H6, -(C0[1] - 0.537) * H6], [P[0] * H6, -P[1] * H6], tilt);
  return [p[0] / H6, -p[1] / H6];
};

type ReachArm = Extract<ArmPose, {kind: 'reach'}>;
/** Two-bone reach of the side-view near arm (`ik2`: upper arm 0.9, forearm 0.88 head). Default: the wrist 0.17 head behind the grip `to`
 *  along the forearm. With `dir`: the wrist sits behind the fingertip contact `to` along the fingers (0.5 head for a pinch, whose index tip
 *  lies 0.5 from the wrist; 0.17 for the other hands), so the hand points at the grip and does not stand up the forearm (B07-SH01). */
const reachPts = (S: HU, pose: ReachArm, bend: 1 | -1): {E: HU; W: HU; d: HU} => {
  if (pose.dir) {
    const f = unitHU(pose.dir), off = pose.hand === 'pinch' ? 0.5 : 0.17;
    const W: HU = [pose.to[0] - f[0] * off, pose.to[1] - f[1] * off];
    return {E: ik2(S, W, 0.9, 0.88, bend), W, d: f};
  }
  const E = ik2(S, pose.to, 0.9, 0.88, bend), df = unitHU([pose.to[0] - E[0], pose.to[1] - E[1]]);
  const W: HU = [pose.to[0] - df[0] * 0.17, pose.to[1] - df[1] * 0.17];
  // `lay` (side view): the hand bends forward at the wrist by this angle (rad, clockwise toward +x), so it lies on the target, not up the forearm.
  const c = Math.cos(pose.lay ?? 0), sn = Math.sin(pose.lay ?? 0);
  return {E, W, d: pose.lay ? [df[0] * c + df[1] * sn, -df[0] * sn + df[1] * c] : df};
};

/** Standing profile bust, facing +x (the mirror for facing left is `dir` -1 in `drawFig`). The stance, tee and sleeve are `figSide`'s
 *  (the approved S-P12 7b profile, costume pass 11) at `slump` 0; at `slump` 1 the poses are `figSlack`'s side pose (head pitched 0.25 rad). */
const profile = (c: Cast, o: BustOpts): Fig => {
  const k = costumeOf(c), out = c.outfit, sk = c.head.skin, cell = o.cell ?? 0;
  const s = clamp01(o.slump ?? 0);
  const H = L2([0, 3.0], [0.04, 2.92], s);
  const S = L2([-0.04, 4.44], [0.26, 4.18], s);
  const P = L2([0.02, 4.6], [0.3, 4.42], s);
  const C0: HU = [P[0] + 0.08, P[1] + 0.937 + 0.023 * s];
  const tilt = 0.25 * s;
  const parts: Part[] = [];
  const hemAt = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  // Far side, all cel: the far sleeve to the wrist, and the far trousers to the ankle.
  const EF = L2([0.26, 3.6], [0.42, 3.38], s), WF = L2([0.42, 2.78], [0.5, 2.52], s), SF = L2([0.02, 4.45], [0.24, 4.2], s);
  parts.push(tub(k.over, [SF, EF, WF], [0.2, 0.19, 0.17], 0, {far: true, up: true, ...CL}));
  parts.push(...handParts({kind: 'mitten', w: WF, dir: [0.35 - 0.15 * s, -1], thumb: 1, forceCel: true}, sk));
  const kneeF = L2([0, 1.6], [-0.12, 1.58], s), ankF = L2([-0.4, 0.24], [-0.22, 0.2], s);
  const kneeN = L2([0, 1.6], [0.1, 1.52], s), ankN: HU = [-0.12, 0.16];
  if (o.legs !== false) {
    parts.push(tub(k.pants, [H, mid(H, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemAt(kneeF, ankF)], [0.29, 0.27, 0.235, 0.215, 0.2], 0, {far: true, ...CL}));
    parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  }
  // The bust neck behind the collar: from the collar base (4.80, less the slump) to the chin.
  parts.push(tub(sk, [[P[0], 4.8 - 0.2 * s], [P[0] + 0.06, P[1] + 0.36]], [0.17, 0.17], 0.14, {far: true, ink: false, up: true}));
  // Near trousers to the ankle and the near foot (close shots: none).
  if (o.legs !== false) {
    parts.push(tub(k.pants, [H, mid(H, kneeN, 0.5), kneeN, mid(kneeN, ankN, 0.5), hemAt(kneeN, ankN)], [0.3, 0.28, 0.245, 0.22, 0.205], 0.16, CL));
    parts.push(tub(sk, footCtrl(ankN, 0), FOOT_R, 0.05));
  }
  // Shirt: the tee and the open overshirt of the standing figure (collar stand at the nape and front), or the slack torso of the infected.
  if (s < 0.5) {
    parts.push(convexOf(k.tee, [[-0.3, 4.78], [0.02, 4.8], [0.24, 4.74], [0.36, 4.44], [0.36, 3.9], [0.34, 3.4], [0.34, 2.98], [-0.4, 2.98], [-0.42, 3.5], [-0.44, 3.9], [-0.44, 4.5], [-0.4, 4.66]], 0.34, {up: true, ...CL}));
    parts.push(convexOf(k.over, [[-0.36, 4.8], [0.0, 4.84], [0.2, 4.76], [0.3, 4.46], [0.28, 3.9], [0.28, 3.3], [0.33, 2.7], [-0.52, 2.68], [-0.56, 3.3], [-0.56, 3.9], [-0.54, 4.5], [-0.46, 4.7]], 0.36, {up: true, ...CL}));
    parts.push(strokes([[[0.22, 4.74], [0.28, 4.3], [0.28, 3.6], [0.3, 3.0], [0.33, 2.72]]], foldTone(k.over)));
    parts.push(collarSide(k.over));
    if (o.legs !== false) parts.push(convexOf(k.pants, [[-0.42, 3.3], [0.3, 3.32], [0.38, 2.9], [0.4, 2.66], [-0.42, 2.64], [-0.46, 2.96]], 0.26, CL));
  } else {
    parts.push(convexOf(out.shirt, [[H[0] - 0.4, H[1] - 0.04], [H[0] + 0.34, H[1] - 0.04], [H[0] + 0.38, H[1] + 0.5], [S[0] + 0.3, S[1] - 0.1], [S[0] + 0.18, S[1] + 0.12], [P[0] - 0.08, P[1] - 0.02], [S[0] - 0.26, S[1] + 0.04], [H[0] - 0.42, H[1] + 0.56]], 0.34, {up: true, ...CL}));
    // The khaki band collar follows the pitched chin: its top runs under the chin, 0.04 head below it (the visible neck, B8 ≤ 0.10).
    const chin = profileChin(C0, P, tilt);
    // The band's back edge stops at the neck's back (x 0.12): a back end past the neck drew the spike in the B01 silhouette (pass 12 look check).
    parts.push(convexOf(out.shirt, [[0.12, 4.66], [0.12, chin[1] - 0.14], [0.2, chin[1] - 0.08], [chin[0] - 0.1, chin[1] - 0.03], [chin[0], chin[1] - 0.03], [chin[0] + 0.02, 4.66]], 0.05, {cloth: true, collar: true}));
  }
  // Near arm: a sleeve to the wrist, the cuff, the hand (mitten, or the reach).
  const SN = S, pose = o.arms?.R;
  let EN = L2([-0.22, 3.56], [0.32, 3.34], s), WN = L2([-0.36, 2.76], [0.38, 2.48], s);
  let hand: Hand = {kind: 'mitten', w: WN, dir: [-0.15 + 0.35 * s, -1], thumb: 1};
  if (pose?.kind === 'reach') {
    const r = reachPts(SN, pose, pose.bend ?? 1);
    EN = r.E;
    WN = r.W;
    hand = {kind: pose.hand, w: WN, dir: r.d, thumb: 1};
  } else if (pose?.kind === 'hang') {
    hand = {...hand, kind: pose.hand ?? 'mitten'};
  }
  parts.push(tub(k.over, [SN, mid(SN, EN, 0.5), EN, WN], [0.215, 0.205, 0.19, 0.17], 0.14, {up: true, ...CL}));
  parts.push(cuffLine(WN, unitHU([WN[0] - EN[0], WN[1] - EN[1]]), 0.16, k.over));
  parts.push(...handParts(hand, sk));
  parts.push(profileFolds(H, S, k.over));
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
 * Seated profile on the floor, facing +x, hugging the knees (B09-SH02, day 3): the figSeatFloor legs in trousers to the ankle, the near
 * forearm in a sleeve to a BODY-ZCP-6H mitten on the knee (Boss pass 18, no finger blocks) and the far forearm crossed in front of the shin, with a chest and back shaped torso and the
 * shoulder slope into the neck. Hip 0.34 head up, lean 0.13 rad (as `figSeatFloor`), the head centre 0.73 head above the shoulder line.
 */
const seatFloor = (c: Cast, o: BustOpts): Fig => {
  const k = costumeOf(c), sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 0.34], ank: HU = [1.22, 0.16];
  const knee = ik2(hip, ank, 1.42, 1.48, 1);
  const lean = 0.13, N: HU = [Math.sin(lean), Math.cos(lean)];
  /** Upright frame (x forward, u up) about the hip, leaned by `lean`. */
  const T = (x: number, u: number): HU => [hip[0] + x * N[1] + u * N[0], hip[1] - x * N[0] + u * N[1]];
  const hemOf = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  const S: HU = T(0, 1.8);
  const parts: Part[] = [], hands: Hand[] = [];
  // Far leg (cel) and far forearm (cel): trousers to the ankle, a sleeve to the mitten.
  const kneeF: HU = [knee[0] - 0.06, knee[1] + 0.02], ankF: HU = [ank[0] - 0.08, ank[1]];
  parts.push(tub(k.pants, [hip, mid(hip, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemOf(kneeF, ankF)], [0.31, 0.29, 0.25, 0.22, 0.2], 0, {far: true, ...CL}));
  parts.push(tub(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const Sf: HU = [S[0] - 0.04, S[1] - 0.05], Tf: HU = [1.02, 1.2];
  const Ef = ik2(Sf, Tf, 0.9, 0.88, -1), df = unitHU([Tf[0] - Ef[0], Tf[1] - Ef[1]]);
  const Wf: HU = [Tf[0] - df[0] * 0.17, Tf[1] - df[1] * 0.17];
  parts.push(tub(k.over, [Sf, mid(Sf, Ef, 0.5), Ef, Wf], [0.215, 0.2, 0.18, 0.16], 0, {far: true, up: true, ...CL}));
  hands.push({kind: 'mitten', w: Wf, dir: df, thumb: 1, forceCel: true, ...MITTEN_6H});
  // Seat, near trousers to the ankle, bare foot.
  parts.push(convexOf(k.pants, [[-0.46, 0.74], [0.3, 0.52], [0.36, 0.04], [-0.42, 0.02]], 0.24, CL));
  parts.push(tub(k.pants, [hip, mid(hip, knee, 0.5), knee, mid(knee, ank, 0.5), hemOf(knee, ank)], [0.31, 0.28, 0.24, 0.215, 0.2], 0.2, CL));
  parts.push(tub(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  // Bare neck from the shoulder point to the chin (first, so the shirt covers its base).
  parts.push(tub(sk, [S, T(0.27, 1.8)], [0.15, 0.13], 0.12, {ink: false, up: true}));
  // Torso: the tee (chest and back shape), the open overshirt over it with the tee strip at the chest front, the collar stand.
  parts.push(convexOf(k.tee, [T(-0.42, -0.06), T(0.36, -0.06), T(0.4, 0.42), T(0.38, 1.0), T(0.3, 1.5), T(0.12, 1.78), T(-0.2, 1.82), T(-0.4, 1.66), T(-0.46, 1.2), T(-0.44, 0.62), T(-0.42, 0.2)], 0.34, {up: true, ...CL}));
  parts.push(convexOf(k.over, [T(-0.44, -0.04), T(0.2, -0.06), T(0.24, 0.42), T(0.22, 1.0), T(0.14, 1.5), T(0.0, 1.78), T(-0.2, 1.82), T(-0.4, 1.66), T(-0.46, 1.2), T(-0.44, 0.62), T(-0.42, 0.2)], 0.34, {up: true, ...CL}));
  parts.push(strokes([[T(0.2, 1.8), T(0.12, 1.1), T(0.2, 0.5)]], foldTone(k.over)));
  // Near arm: a sleeve to the wrist, the cuff, the mitten on the knee.
  const Sa: HU = [S[0] + 0.02, S[1] - 0.05], Tn: HU = [1.12, 1.12];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(tub(k.over, [Sa, mid(Sa, En, 0.5), En, Wn], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true, ...CL}));
  parts.push(cuffLine(Wn, dn, 0.16, k.over));
  hands.push({kind: 'mitten', w: Wn, dir: dn, thumb: 1, ...MITTEN_6H});
  for (const h of hands) parts.push(...handParts(h, sk));
  parts.push(profileFolds(hip, S, k.over));
  parts.push(toeLines(ank));
  parts.push(collarSeat(k.over, T, 1.72, 1.9));
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

/**
 * Waist-cut close (`FR-ZCP-CLOSE`): the figure's scale from its head on screen (crown to chin, `headPx`; one head is `H6` px at scale 1)
 * and the plate y of the chin, with the head centre at `cx`. The frame bottom then cuts at `waistCutHeads`.
 */
export const placeClose = (fig: Fig, cx: number, headPx: number, chinY: number, dir: 1 | -1): Place => {
  const k = headPx / H6;
  const h = fig.head;
  // The chin is pitched with the head (`head.tilt` about `head.pivot`, as in `visibleNeckHU`), so a tilted head lands its chin on the row.
  const chinPx: Pt = [h.x, h.y + CHIN * K6];
  const chin = h.tilt && h.pivot ? rotPt(chinPx, h.pivot, h.tilt) : chinPx;
  return {gx: cx - dir * k * h.x, gy: chinY - k * chin[1], k, dir};
};

/** Height of the frame bottom above the floor, in heads: `cut = 5.0 − (frameBottom − chin_y) / H` (the chin is at 5.0 heads). */
export const waistCutHeads = (chinY: number, headPx: number, frameBottom = 1920): number => 5.0 - (frameBottom - chinY) / headPx;

/**
 * Visible bare neck (head units) at the plate column `x` (heads from the figure's centre line; default: the chin's column): the chin to the
 * top edge of the collar stand (`CS-ZCP-R26`, B8 ≤ 0.10). The chin is the decal chin, pitched with the head (`head.tilt` about `head.pivot`).
 */
export const visibleNeckHU = (fig: Fig, x?: number): number => {
  const h = fig.head;
  const chinPx: Pt = [h.x, h.y + CHIN * K6];
  const chin = h.tilt && h.pivot ? rotPt(chinPx, h.pivot, h.tilt) : chinPx;
  const xp = x === undefined ? chin[0] : x * H6;
  let top = Infinity;
  for (const p of fig.parts) {
    if (!p.collar || p.pts.length < 3) continue;
    for (let i = 0; i < p.pts.length; i++) {
      const [ax, ay] = p.pts[i], [bx, by] = p.pts[(i + 1) % p.pts.length];
      if ((ax - xp) * (bx - xp) > 0) continue;
      if (ax === bx) {
        if (ax === xp) top = Math.min(top, ay, by);
        continue;
      }
      const t = (xp - ax) / (bx - ax);
      if (t >= 0 && t <= 1) top = Math.min(top, ay + (by - ay) * t);
    }
  }
  return -chin[1] / H6 + top / H6;
};

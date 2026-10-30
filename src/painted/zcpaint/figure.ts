import type {Pt} from '../kit/painter';
import type {Cast} from '../spike/CastSheet';
import {CHIN, FACES, HEAD_SPAN, headOutline, type Face} from '../spike/FaceSheet';
import {ellipse, limb, skeleton} from '../spike/ProportionSheet';
import {paintHeadSide, reach, rotated, type Paint} from '../spike/SideSheet';

export {rotated};

// ZCPAINT figure views that WORLD FOG does not have (S-P01/S-P02): back view and the two seated profile poses, on the
// same 4-head skeleton (190 px per head, 447 px/m) and the same Paint/Cast data as `paintBodySide`/`paintBodyFront`.
// Profile poses face +x; mirror with `brush.scale(-k, k)` for a figure facing left. Each returns the anchors props use.

const N = 4, H = 190, K = H / HEAD_SPAN;
const darker = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * f).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

/** Hair cap seen from behind: crown, the whole back to the nape line, two crown tufts (the front decal's hair, from behind). */
const backHair = (): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = Math.PI + (i / 20) * Math.PI;
    pts.push([1.07 * Math.cos(a), 1.12 * Math.sin(a) - 0.04]);
  }
  pts.push([1.0, 0.32], [0.9, 0.62], [0.55, 0.76], [0.2, 0.7], [0, 0.82], [-0.2, 0.7], [-0.55, 0.76], [-0.9, 0.62], [-1.0, 0.32]);
  return pts;
};

/**
 * Back view, ground point (cx, ground): the skeleton of the front view seen from behind (`B01-SH01` OTS, B06-SH02, B08,
 * B10 before the turn). Hair covers the whole skull to the nape; ears, neck, heels, tee back with a spine crease.
 * `headScaleX` squashes the head about its centre (1 = full back; the B10 turn swaps it for the front decal at the
 * narrowest point, see build notes). Returns the head anchor and hand points.
 */
export const paintBodyBack = (p: Paint, c: Cast, cx: number, ground: number, o: {headScaleX?: number; stoop?: number} = {}) => {
  const out = c.outfit, k = skeleton(cx, N, ground, H, out.shoulder);
  const STOOP = o.stoop ?? 0, h = H;
  if (STOOP) {
    // Stoop (ZCPAINT infected, 0..1): shoulders drop 0.09 head, head 0.17 head, arms follow; default off.
    k.chin += 0.17 * h * STOOP;
    k.shoulderY += 0.09 * h * STOOP;
    for (const a of k.arms) { a.shoulder[1] += 0.09 * h * STOOP; a.elbow[1] += 0.07 * h * STOOP; a.wrist[1] += 0.05 * h * STOOP; }
  }

  const hw = 0.3 * H;
  for (const {hip, ankle} of k.legs) p.part(out.pants, limb([hip[0], hip[1] - 0.04 * H], ankle, 0.26 * H, 0.19 * H));
  for (const {ankle} of k.legs) {
    p.part(out.shoes, ellipse(ankle[0], ground - 0.06 * H, 0.1 * H, 0.06 * H, 14)); // heel; bare feet match the skin
    p.ink([[ankle[0] - 0.08 * H, ground - 0.02 * H], [ankle[0] + 0.08 * H, ground - 0.02 * H]], 1.0, 0);
  }
  p.part(out.pants, [[cx - hw - 0.02 * H, k.hipY - 0.06 * H], [cx + hw + 0.02 * H, k.hipY - 0.06 * H], [cx + hw, k.crotchY], [cx - hw, k.crotchY]], false);
  p.part(out.shirt, [[cx - k.sw + 0.04 * H, k.shoulderY], [cx + k.sw - 0.04 * H, k.shoulderY], [cx + k.sw, k.shoulderY + 0.08 * H], [cx + hw + 0.03 * H, k.hipY], [cx - hw - 0.03 * H, k.hipY], [cx - k.sw, k.shoulderY + 0.08 * H]]);
  p.ink([[cx, k.shoulderY + 0.1 * H], [cx + 0.01 * H, (k.shoulderY + k.hipY) / 2], [cx, k.hipY - 0.05 * H]], 0.9, 0.5);
  const hands: Pt[] = [];
  for (const {shoulder, elbow, wrist} of k.arms) {
    p.part(out.sleeve, limb(shoulder, elbow, 0.19 * H, 0.16 * H));
    p.part(out.longSleeves ? out.sleeve : c.head.skin, limb(elbow, wrist, 0.15 * H, 0.13 * H));
    p.part(c.head.skin, ellipse(wrist[0], wrist[1] + 0.07 * H, 0.1 * H, 0.12 * H));
    hands.push([wrist[0], wrist[1] + 0.07 * H]);
  }
  // Neck and head.
  p.part(c.head.skin, [[cx - 0.1 * H, k.chin - 0.1 * H], [cx + 0.1 * H, k.chin - 0.1 * H], [cx + 0.11 * H, k.shoulderY + 0.02 * H], [cx - 0.11 * H, k.shoulderY + 0.02 * H]], false);
  const hy = k.chin - CHIN * K, sx = o.headScaleX ?? 1;
  const X = ([u, v]: Pt): Pt => [cx + u * K * sx, hy + v * K];
  for (const s of [-1, 1]) p.part(c.head.skin, ellipse(s * 1.0, 0.12, 0.14, 0.21, 16).map(X), true, 3);
  p.part(c.head.skin, headOutline().map(X), true, 3);
  p.part(c.head.hair, backHair().map(X), true, 6);
  for (const [x, w] of [[-0.5, 0.3], [-0.1, 0.3], [0.3, 0.3]] as const) p.part(c.head.hair, [[x, -1.12], [x + w / 2, -1.34], [x + w, -1.12]].map((q) => X(q as Pt)), false, 5);
  return {head: {x: cx, y: hy, K}, hands, shoulderY: k.shoulderY, hipY: k.hipY};
};

/** Seated pose result: anchors in the figure's local px (ground at y = ground). */
export type Seated = {head: {x: number; y: number; K: number}; hip: Pt; knee: Pt; foot: Pt; hands: Pt[]; shoulder: Pt};

const L_BONE = 148, TORSO = 222, ARM = 116;

/** One leg (thigh + shin + bare foot) from hip to knee to the ankle on `floorY`, colour-shaded for the far leg. */
const seatedLeg = (p: Paint, c: Cast, hip: Pt, knee: Pt, ankle: Pt, shade: number) => {
  const o = c.outfit, col = shade < 1 ? darker(o.pants, shade) : o.pants;
  p.part(col, limb(hip, knee, 0.27 * H, 0.2 * H));
  p.part(col, limb(knee, ankle, 0.2 * H, 0.16 * H));
  p.part(shade < 1 ? darker(c.head.skin, shade) : o.shoes, [[ankle[0] - 0.1 * H, ankle[1] - 0.06 * H], [ankle[0] + 0.1 * H, ankle[1] - 0.06 * H], [ankle[0] + 0.32 * H, ankle[1] + 0.05 * H], [ankle[0] + 0.3 * H, ankle[1] + 0.09 * H], [ankle[0] - 0.1 * H, ankle[1] + 0.09 * H]]);
};

/** Near and far arm to hand targets; elbow by two-bone `reach`, hand as a mitten (WORLD FOG hand). */
const seatedArms = (p: Paint, c: Cast, shoulder: Pt, targets: [Pt, Pt]) => {
  const o = c.outfit;
  const hands: Pt[] = [];
  ([[1, targets[1], 0.86], [0, targets[0], 1]] as const).forEach(([, T, shade]) => {
    const S: Pt = [shoulder[0] + (shade < 1 ? -0.03 * H : 0), shoulder[1] + 0.02 * H];
    const E = reach(S, T, ARM);
    const sleeve = shade < 1 ? darker(o.sleeve, shade) : o.sleeve;
    p.part(sleeve, limb(S, E, 0.19 * H, 0.16 * H));
    p.part(o.longSleeves ? sleeve : shade < 1 ? darker(c.head.skin, shade) : c.head.skin, limb(E, T, 0.15 * H, 0.13 * H));
    p.part(shade < 1 ? darker(c.head.skin, shade) : c.head.skin, ellipse(T[0] + 0.03 * H, T[1] + 0.02 * H, 0.1 * H, 0.12 * H));
    hands.push(T);
  });
  return hands;
};

/** Torso block in profile from hip to shoulder (shirt), one ink outline. */
const seatedTorso = (p: Paint, c: Cast, hip: Pt, shoulder: Pt) => p.part(c.outfit.shirt, limb([hip[0], hip[1] + 0.05 * H], [shoulder[0], shoulder[1] - 0.02 * H], 0.4 * H, 0.38 * H));

/**
 * B09 seated on the floor, unsupported, knees up, forearms resting on the knees with the hands hanging over the
 * kneecaps, head pitched down `pitch` radians (default 20 degrees), profile facing +x. Hip joint 17 px above the floor.
 * `lean` is the torso lean forward (radians). The far arm follows the near arm, a little behind.
 */
export const paintSeatedFloor = (p: Paint, c: Cast, cx: number, ground: number, o: {face?: Face; pitch?: number; lean?: number; blink?: boolean} = {}): Seated => {
  const lean = o.lean ?? 0.16, pitch = o.pitch ?? 0.35;
  const hip: Pt = [cx, ground - 0.09 * H];
  const th = 1.08; // thigh angle above horizontal, rad (knees pulled toward the chest)
  const knee: Pt = [hip[0] + L_BONE * Math.cos(th), hip[1] - L_BONE * Math.sin(th)];
  const drop = ground - 0.09 * H - knee[1];
  const ankle: Pt = [knee[0] + Math.sqrt(Math.max(0, L_BONE ** 2 - drop ** 2)), ground - 0.09 * H]; // shins lean forward to the feet
  const shoulder: Pt = [hip[0] + TORSO * Math.sin(lean), hip[1] - TORSO * Math.cos(lean)];
  seatedLeg(p, c, [hip[0] - 0.02 * H, hip[1]], [knee[0] - 0.05 * H, knee[1]], [ankle[0] - 0.04 * H, ankle[1]], 0.84); // far leg
  seatedTorso(p, c, hip, shoulder);
  seatedLeg(p, c, hip, knee, ankle, 1);
  // Neck + head: chin 0.12 H over the shoulder along the lean, head pitched down about the neck.
  const neck = lean + pitch;
  const headC: Pt = [shoulder[0] + (0.16 * H + CHIN * K) * Math.sin(neck), shoulder[1] - (0.16 * H + CHIN * K) * Math.cos(neck)];
  p.part(c.head.skin, limb([shoulder[0], shoulder[1] + 0.03 * H], [shoulder[0] + 0.12 * H * Math.sin(neck), shoulder[1] - 0.12 * H * Math.cos(neck)], 0.17 * H, 0.15 * H), false);
  const hp = rotated(p, headC, pitch);
  paintHeadSide(hp, headC[0], headC[1], K, o.face ?? FACES[0], c.head, {blink: o.blink});
  const hands = seatedArms(p, c, shoulder, [[knee[0] + 0.07 * H, knee[1] - 0.04 * H], [knee[0] - 0.02 * H, knee[1] - 0.08 * H]]);
  return {head: {x: headC[0], y: headC[1], K}, hip, knee, foot: ankle, hands, shoulder};
};

/**
 * B07 seated on the sofa (seat top `seatH` px above the floor, default 0.45 m = 201 px), back against the sofa back,
 * thighs sloping down to the feet, profile facing +x. `grip` puts the near hand on food or the mouth; default in the
 * lap. With the 4-head legs (0.67 m) the thigh must slope down for the bare feet to reach the floor on this seat.
 */
export const paintSeatedSofa = (p: Paint, c: Cast, cx: number, ground: number, o: {face?: Face; seatH?: number; grip?: Pt; blink?: boolean} = {}): Seated => {
  const seat = o.seatH ?? 0.45 * 447;
  const hip: Pt = [cx, ground - seat - 0.09 * H];
  const th = -0.38; // thigh slopes down by 22 degrees
  const knee: Pt = [hip[0] + L_BONE * Math.cos(th), hip[1] - L_BONE * Math.sin(th)];
  const drop = ground - 0.09 * H - knee[1];
  const ankle: Pt = [knee[0] + Math.sqrt(Math.max(0, L_BONE ** 2 - drop ** 2)), ground - 0.09 * H];
  const lean = -0.12;
  const shoulder: Pt = [hip[0] + TORSO * Math.sin(lean), hip[1] - TORSO * Math.cos(lean)];
  seatedLeg(p, c, [hip[0] + 0.02 * H, hip[1]], [knee[0] + 0.05 * H, knee[1]], [ankle[0] + 0.05 * H, ankle[1]], 0.84);
  seatedTorso(p, c, hip, shoulder);
  seatedLeg(p, c, hip, knee, ankle, 1);
  const headC: Pt = [shoulder[0] + (0.16 * H + CHIN * K) * Math.sin(lean + 0.18), shoulder[1] - (0.16 * H + CHIN * K) * Math.cos(lean + 0.18)];
  p.part(c.head.skin, limb([shoulder[0], shoulder[1] + 0.03 * H], [headC[0] - 0.02 * H, shoulder[1] - 0.12 * H], 0.17 * H, 0.15 * H), false);
  paintHeadSide(p, headC[0], headC[1], K, o.face ?? FACES[0], c.head, {blink: o.blink});
  const lap: Pt = [hip[0] + 0.55 * H, hip[1] - 0.3 * H];
  const hands = seatedArms(p, c, shoulder, [o.grip ?? lap, [(o.grip ?? lap)[0] - 0.12 * H, (o.grip ?? lap)[1] + 0.1 * H]]);
  return {head: {x: headC[0], y: headC[1], K}, hip, knee, foot: ankle, hands, shoulder};
};

import type {Arm, CastDef} from '../kit/cast';
import {frameOf, type Frame3} from '../kit/hand-props';
import {dist3, elbowIK, LANDMARKS} from '../kit/hand-place';
import type {Hand3DArm, Prop3D} from '../kit/hand3d';
import {macroSkeleton} from '../kit/hands';
import {bodyDir, placeMidHand, type Body, type MidPlaced} from '../kit/mid-hands';
import {add3, scale3, type V3} from '../kit/space';
import type {Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP26-SHORT BRIEF-R4 hand placement. A figure's hands are placed in its own body frame (kit `placeMidHand`, the KIT-MID-HANDS
// method) for any world facing, so wrists, elbows and the held coin sit on world anchors (nose, partition top, bench). The painted rig arm
// runs to that wrist and ends in the UT14 mitten by default. Hand rule (user, final, 18 Nov 2026): POV shots use five-finger 3D hands;
// in non-POV shots Film picks 3D only where the fingers must read (pinching a coin, pinching the nose): those sides get `noHand` and a
// `Hands3D` layer (`pick3D`), recorded per row in the storyboard change log.
// No Remotion import.

export type MidHandSpec = Parameters<typeof placeMidHand>[2];
export const HANG: MidHandSpec = {gesture: 'relaxed', w: [0.03, -0.53, 0.03], f: [0, -1, 0.06], b: [0.85, 0, 0.5]};

/** Body frame for a figure facing the world direction `facing` ([x, z]): z forward, x their right (forward x up), y up. */
export const bodyFacing = (def: CastDef, at: V3, facing: [number, number]): Body => {
  const n = Math.hypot(facing[0], facing[1]) || 1, z: V3 = [facing[0] / n, 0, facing[1] / n];
  return {at, x: [-z[2], 0, z[0]], y: [0, 1, 0], z, def, view: 'front'};
};

export type HandRig = {placed: Partial<Record<'right' | 'left', MidPlaced>>; gestures: Partial<Record<'right' | 'left', string>>; arms3D: Hand3DArm[]; props: Prop3D[];
  /** Sides placed with `HANG`: `paintedArms` leaves them to the pose's own hanging arm (the rig draws it from its own shoulder; R5). */
  hang: ('right' | 'left')[]};

/** Place the named hands; `coin` puts a coin (scaled `coinScale`, face toward `coinFace`) in the pinch of that side, its centre `coinLift`
 *  coin radii above the pinch point (1 = the rim sits in the pinch; more shows more of the face above the fingertips). `pole` (body frame,
 *  x mirrored per side like the hand specs) re-solves that side's elbow with the same bone lengths: the kit's fixed out-down-back pole
 *  swings the elbow forward of the chest when the hand is raised to the face (KP-MARCUS-CLOSE sniff R5 fix). */
export const rigHands = (body: Body, hands: Partial<Record<'right' | 'left', MidHandSpec>>, base: number,
  o: {coin?: 'right' | 'left'; coinScale?: number; coinFace?: V3; coinLift?: number; forearm?: Partial<Record<'right' | 'left', string>>;
    pole?: Partial<Record<'right' | 'left', V3>>} = {}): HandRig => {
  const placed: HandRig['placed'] = {};
  (['right', 'left'] as const).forEach((side, j) => {
    const m = hands[side];
    if (!m) return;
    const q = placeMidHand(body, side, m, base + j * 240), pole = o.pole?.[side];
    if (pole) {
      const s = side === 'right' ? 1 : -1;
      q.E = elbowIK(q.S, q.hand.wrist, bodyDir(body, [s * pole[0], pole[1], pole[2]]), dist3(q.S, q.E), dist3(q.E, q.hand.wrist));
    }
    placed[side] = q;
  });
  const props: Prop3D[] = [];
  if (o.coin && placed[o.coin]) {
    const sk = macroSkeleton(placed[o.coin]!.hand), s = o.coinScale ?? 1;
    const f = frameOf(add3(LANDMARKS.pinch(sk), [0, 0.012 * s * (o.coinLift ?? 1), 0]), [0, 1, 0], o.coinFace ?? [0, 0, 1]);
    const scaled: Frame3 = {o: f.o, x: scale3(f.x, s), y: scale3(f.y, s), z: scale3(f.z, s)};
    props.push({id: 'coin', frame: scaled});
  }
  // `forearm`: that side's 3D arm also draws the forearm tube in the sleeve colour (a long reach the painted card arm stops short of)
  const arms3D = (Object.entries(placed) as ['right' | 'left', MidPlaced][]).map(([side, q]) => o.forearm?.[side]
    ? {hand: q.hand, elbow: q.E, sleeve: o.forearm[side], handOnly: false} : {hand: q.hand, elbow: q.E, handOnly: true});
  const gestures = {right: hands.right?.gesture, left: hands.left?.gesture};
  return {placed, gestures, arms3D, props, hang: (['right', 'left'] as const).filter((q) => hands[q] === HANG)};
};

const CLOSED = new Set(['fist', 'pinch', 'claw', 'grip', 'thumbs-up', 'hold-pen', 'hold-phone']);
/** The painted rig arms to the placed wrists (`rArm` = the character's right), ending in a mitten (fist for closed gestures) or, with
 *  `noHand`, bare for a 3D hand laid on top. `exact` sides keep `to`/`via` on the projected wrist and elbow on a three-quarter body (kit
 *  `Arm.exact`; without it the turn pulls the arm end off a 3D hand: EDU-EP26 draft fix B, 19 Nov 2026). */
export const paintedArms = (c: YCam, r: HandRig, o: {noHand?: ('right' | 'left')[]; exact?: ('right' | 'left')[]} = {}): {rArm?: Arm; lArm?: Arm} => {
  const out: {rArm?: Arm; lArm?: Arm} = {};
  for (const side of ['right', 'left'] as const) {
    const q = r.placed[side];
    if (!q || r.hang.includes(side)) continue;
    const to = camPoint(c, q.hand.wrist), via = camPoint(c, q.E);
    const s = side === 'right' ? 1 : -1, g = r.gestures[side] ?? 'relaxed';
    const hand: Partial<Arm> = o.noHand?.includes(side) ? {noHand: true} : CLOSED.has(g) ? {fist: s} : {open: s};
    if (to && via) out[side === 'right' ? 'rArm' : 'lArm'] = {to, via, ...hand, ...(o.exact?.includes(side) ? {exact: true} : {})};
  }
  return out;
};

/** The 3D hands of the named sides (and the coin, when one of them holds it) for a `Hands3D` layer. */
export const pick3D = (r: HandRig, sides: ('right' | 'left')[], coinSide?: 'right' | 'left'): {arms3D: Hand3DArm[]; props: Prop3D[]} => ({
  arms3D: sides.flatMap((s) => r.placed[s] ? [r.arms3D[(['right', 'left'] as const).filter((q) => r.placed[q]).indexOf(s)]] : []),
  props: coinSide && sides.includes(coinSide) ? r.props : [],
});

/** Paint the rig's coin (if any) as the painted 2D coin at its world centre and size. */
export const coinOf = (c: YCam, r: HandRig): {at: Pt; r: number} | null => {
  const q = r.props.find((x) => x.id === 'coin');
  if (!q) return null;
  const at = camPoint(c, q.frame.o), s = Math.hypot(...q.frame.y);
  return at ? {at, r: 0.012 * s * camUnit(c, q.frame.o)} : null;
};

/** A world point on the figure's face: `fwd` metres forward of the head centre, `dy` up from it (head centre = height - half a head). */
export const facePoint = (body: Body, fwd: number, dy: number): V3 => {
  const H = 0.425 * (body.def.headScale ?? 1), cy = body.def.height - H / 2;
  return add3(body.at, add3(scale3(body.z, fwd), [0, cy + dy, 0]));
};

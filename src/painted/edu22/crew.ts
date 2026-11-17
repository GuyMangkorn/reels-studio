import type {CastDef} from '../kit/cast';
import type {V3} from '../kit/space';
import type {Item} from '../kit/world';
import {CALLER, TASTER} from './cast';
import type {HallLight} from './hall';
import type {Pt} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import {depthOf, lerpPt, mouthPx, paintPerson, personAnchors, personView, unproject, type PersonOpts} from './motion22';
import {sheetMove, T_MARK, Y_MARK} from './stage';

// EDU-EP22-SHORT shot staging shared by the hall shots (Boss W5.1, 2026-11-16): light presets, world hand points of a standing eunuch (folded
// hands, mouth), and the attendance line (taster T, caller Y, lifters E1-E3 standing in P01) as sorted items.

/** Light per beat: B01-B03 the late-morning hall of LF01; the orderly checkpoint view (SH12/SH17) a little warmer; B05 the warm pool of LF01b. */
export const LIGHT_DAY: HallLight = {};
export const LIGHT_ORDER: HallLight = {warm: 0.55};
export const LIGHT_WARM: HallLight = {warm: 0.8};

/** The figure's right in the floor plane for a world facing (facing -z -> right +x). */
export const rightOf = (f: [number, number]): [number, number] => [-f[1], f[0]];
/** A point on a standing figure: `fwd` metres ahead, `side` metres to its right, `h` a fraction of its height. */
export const onBody = (def: CastDef, at: V3, f: [number, number], fwd: number, side: number, h: number): V3 => {
  const r = rightOf(f);
  return [at[0] + f[0] * fwd + r[0] * side, def.height * h, at[2] + f[1] * fwd + r[1] * side];
};

export const facingOf = (from: V3, to: V3): [number, number] => { const dx = to[0] - from[0], dz = to[2] - from[2], L = Math.hypot(dx, dz) || 1; return [dx / L, dz / L]; };

/** A standing eunuch in attendance as a sorted item. */
export const standItem = (def: CastDef, o: PersonOpts, bias = 0): Item => ({at: o.at, bias, draw: (p, c) => { paintPerson(p, c, def, o); }});
/** The world point on a figure's card plane (its depth at height `h`) under picture point `px`: figures are cards squared to the lens, so a
 *  body-relative target (the mouth, the belly) is taken from the card's anchors, not from a world offset (close cameras would disagree). */
export const cardPoint = (c: YCam, at: V3, px: Pt, h: number): V3 => unproject(c, px, depthOf(c, [at[0], h, at[2]]));
/** Mouth of a drawn figure as a world point on its card. */
export const cardMouth = (c: YCam, def: CastDef, o: PersonOpts): V3 | null => {
  const a = personAnchors(c, def, o);
  return a ? cardPoint(c, o.at, mouthPx(a, personView(c, o)), def.height * 0.87) : null;
};
/** Picture targets for hands folded at the waist (front and profile cards). */
export const foldedPx = (c: YCam, def: CastDef, o: PersonOpts): {r?: Pt; l?: Pt} => {
  const a = personAnchors(c, def, o);
  if (!a) return {};
  const K = (a.chin - a.headTop) / 2.39, y = a.chin + 4.6 * K, x = (a.rShoulder[0] + a.lShoulder[0]) / 2;
  return {r: [x - 0.35 * K, y], l: [x + 0.35 * K, y + 0.1 * K]};
};
/** Taster T standing on a mark, hands folded (SH12 onward). */
export const tasterStand = (t: number, at: V3 = T_MARK, o: Partial<PersonOpts> = {}): Item => ({at, bias: 0, draw: (p, c) => {
  const base: PersonOpts = {at, t, view: 'front', seed: TASTER.seed, ...o};
  paintPerson(p, c, TASTER, {...base, handsPx: foldedPx(c, TASTER, base)});
}});
/** Caller Y on his call mark (SH19, SH20). */
export const callerStand = (t: number, at: V3 = Y_MARK, o: Partial<PersonOpts> = {}): Item => standItem(CALLER, {at, t, view: 'front', seed: CALLER.seed, ...o});

/** Picture hand targets blended from the figure's rest hands (its pose without targets) toward world points by weight w 0..1. */
export const blendHands = (c: YCam, def: CastDef, o: PersonOpts, tg: {r?: [V3, number]; l?: [V3, number]}): {r?: Pt; l?: Pt} => {
  const rest = personAnchors(c, def, o), out: {r?: Pt; l?: Pt} = {};
  if (!rest) return out;
  for (const side of ['r', 'l'] as const) {
    const t = tg[side];
    if (!t || t[1] <= 0) continue;
    const q = camPoint(c, t[0]);
    if (q) out[side] = lerpPt(side === 'r' ? rest.rHand : rest.lHand, q, Math.min(1, t[1]));
  }
  return out;
};
/** A world spoon's bowl `len` metres from the hand toward `to` (the dip point or the mouth). */
export const spoonBowlToward = (hand: V3, to: V3, len = 0.09): V3 => {
  const d: V3 = [to[0] - hand[0], to[1] - hand[1], to[2] - hand[2]], L = Math.hypot(d[0], d[1], d[2]) || 1;
  return [hand[0] + (d[0] / L) * len, hand[1] + (d[1] / L) * len, hand[2] + (d[2] / L) * len];
};

/** B03-SH12's camera line; B04-SH17 continues from its end frame (scene sheet: SH17 l 0 = SH12 l 39). T's SH12/SH17 mark: W5.1 deviation, the
 *  sheet's (-2.75, 0, +2.00) puts T's body over G-COVER (648, 895) at l 39 (T head x 605); at (-2.45, 0, +1.85) his head is at x 771 -> 860, clear
 *  of all three glints (scripts/edu-series/ep22/short/measure-shots.ts prints T's head x beside the glints). */
export const SH12_MOVE = sheetMove([-3.4, 0.9, 1.2], [40, 36], [2.6, 2.4], 1.5, {f: 1000, hy: 660});
export const T_SH12: V3 = [-2.45, 0, 1.85];

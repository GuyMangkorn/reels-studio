import {shoulderPoint, type Arm, type CastDef, type FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt} from '../kit/figure-at';
import type {Painter, Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {figureView4, type View4} from '../kit/views';
import {dress, tintHoodie} from '../kit/wardrobe';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintMask, headFrame, type MaskId} from './masks';
import {ep16Pose, EP16_POSES, type Ep16PoseId} from './poses';
import {paintHandNet, paintHeldBird, paintMitten} from './props';
import {C} from './palette';

// EDU-EP16-SHORT cast (brief VD02, VD03, VD27; storyboard "Casting"; Film W3 look frames). Props `new: coffee-cup`, `new: tote-bag`,
// `new: wool-scarf` are look sketches for Boss (N6).
// MAN    = `man-parted + office` (1.80 m, navy blazer), walk + coffee cup in the right hand; in MASK-A in B01, bare-faced from B02-SH01 end.
// WOMAN  = `woman-bob + home-lounge` (1.58 m, oatmeal cardigan, dusty-rose tee), tote on the left shoulder.
// WALKER = `man-spiky + hoodie (tintHoodie #c8962e)` (1.72 m, deep brown skin, black spiky hair), hands free; grey scarf on the winter visit.

export const MAN: CastDef = dress(PEOPLE['man-parted'], 'office');
export const WOMAN: CastDef = dress(PEOPLE['woman-bob'], 'home-lounge');
export const WALKER: CastDef = tintHoodie(dress(PEOPLE['man-spiky'], 'hoodie'), C.mustard);

export type WalkOpts = {
  at: V3; view?: View4; /** World travel direction [x, z]: the view is the nearest of the four to the lens (kit `figureView4`), so a walker always faces where he goes; `view` overrides. */ travel?: [number, number]; walk?: number; pose?: AnyPoseId; face?: ExpressionId; t: number; seed?: number;
  mask?: MaskId; cup?: 'walk' | 'sip'; tote?: boolean | 'hand'; scarf?: boolean; sun?: -1 | 1; tint?: {to: string; u: number}; shadowOp?: number;
  /** W5.2 episode poses (N5) at gesture clock `k` 0..1; kneel-based poses default `pose` to P34. */
  ep?: {id: Ep16PoseId; k: number};
  /** Mask peel / pull clock (0 worn, 1 lifted clear above the head) and the held mask: `maskHand` hangs it from the right hand (mask-off end state). */
  maskLift?: number; maskHand?: boolean; maskTilt?: number;
  /** `new: hand-net` (kneel-net): lowering clock, mesh drape, and the hoop centre override (picture px). */
  net?: {k: number; drape?: number; hoopAt?: [number, number]};
  /** `new: hold-bird` / `open-hands` bird in the hands (mitten hands redrawn over it). `ring` puts the orange band on its left leg. */
  bird?: {ring?: boolean; headTilt?: number; head?: 'profile-right' | 'front'};
  /** Tote swung up over the head 0..1 (tote-over-head): 0 on the shoulder. */
  toteUp?: number;
};
export type CastMeasure = FigAnchors & {maskPx?: number; maskTop?: number; maskBottom?: number};

const sideDir = (v: View4) => (v === 'left' ? -1 : 1);

/** A kit figure walking (or standing) on the path, with the episode's masks and props. */
export const paintPerson = (p: Painter, c: YCam, def: CastDef, o: WalkOpts): CastMeasure | null => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const view = o.view ?? (o.travel ? figureView4(c, o.at, o.travel) : 'right'), d = sideDir(view), side = view === 'left' || view === 'right';
  let rArm: Arm | undefined;
  // MAN's cup arm (profile): elbow at the waist, forearm forward, cup at chest height; `sip` lifts the hand to the mouth (P19 in profile).
  if (o.cup && side) {
    const sh = shoulderPoint(def, g, u, {view, walk: o.walk}, 'r');
    rArm = o.cup === 'sip'
      ? {via: [sh[0] + d * 0.05 * u, sh[1] + 0.25 * u], to: [sh[0] + d * 0.2 * u, sh[1] - 0.04 * u]}
      : {via: [sh[0] + d * 0.02 * u, sh[1] + 0.27 * u], to: [sh[0] + d * 0.24 * u, sh[1] + 0.33 * u]};
  }
  // front view (R3: a walker coming toward the lens): the cup hand is the character's right = screen left; `sip` lifts it to the chin with the elbow out
  if (o.cup === 'sip' && view === 'front') {
    const sh = shoulderPoint(def, g, u, {view: 'front', walk: o.walk}, 'r');
    rArm = {via: [sh[0] - 0.1 * u, sh[1] + 0.0 * u], to: [sh[0] + 0.08 * u, sh[1] - 0.2 * u]};
  }
  // under a pull-over mask (A1-A3) the hair is flattened: the kit's short cut in the wearer's colour, so spikes never poke through the dome
  // (R3 H7: only while the mask is on the head; a mask held in the hand or lifted clear leaves the wearer's own cut, so bob and parted hair keep their size across the shot)
  const worn = !!o.mask && o.mask !== 'B' && !o.maskHand && !(o.maskLift !== undefined && o.maskLift > 0.05);
  const body = worn ? {...def, head: {...def.head, cut: 'short' as const}} : def;
  const epPose = o.ep ? ep16Pose(o.ep.id, def, g as Pt, u, view, o.ep.k) : {};
  const a = paintFigureAt(p, c, body, {
    at: o.at, view, pose: o.pose ?? (o.ep && EP16_POSES[o.ep.id].base === 'P34' ? 'P34' : 'P01'), face: o.face ?? 'neutral', t: o.t, seed: o.seed, tint: o.tint, shadow: {op: o.shadowOp ?? 70},
    fig: {...(o.walk !== undefined ? {walk: o.walk} : {}), ...(rArm ? {rArm} : {}), ...epPose},
  });
  if (!a) return null;
  const s = (o.seed ?? def.seed) + 900;
  if (o.tote) paintTote(p, a, u, view, s + 10, o.toteUp ?? 0, o.tote === 'hand' ? 'hand' : 'shoulder', def.head.skin);
  if (o.scarf) paintScarf(p, a, u, view, s + 20);
  let m: CastMeasure = a;
  if (o.bird) paintHeldBird(p, a.rHand, a.lHand, u, {seed: s + 70, skin: def.head.skin, ...o.bird});
  if (o.net) {
    // lower grip = the character's right hand (screen left in the front view), upper grip = the left
    // profile (R2.1 F3): the hoop rides from behind the shoulder (raised) to `hoopAt` (lowered forward over the crow) with the lowering clock
    let hoopAt = o.net.hoopAt;
    if (side && hoopAt) { const e = o.net.k * o.net.k * (3 - 2 * o.net.k), up: Pt = [a.lHand[0] - d * 0.5 * u, a.lHand[1] - 0.66 * u]; hoopAt = [up[0] + (hoopAt[0] - up[0]) * e, up[1] + (hoopAt[1] - up[1]) * e]; }
    paintHandNet(p, a.rHand, a.lHand, u, {k: o.net.k, drape: o.net.drape, hoopAt, seed: s + 80, skin: def.head.skin});
  }
  if (o.mask) {
    const {K} = headFrame(a);
    const at: [number, number] | undefined = o.maskHand ? [a.rHand[0], a.rHand[1] + 1.35 * K] : undefined;
    const mk = paintMask(p, a, {id: o.mask, view: o.maskHand ? 'front' : view, seed: s + 40, hair: def.head.hair, skin: def.head.skin, sun: o.sun, lift: o.maskLift, at, tilt: o.maskTilt});
    m = {...a, maskPx: mk.px, maskTop: Math.round(mk.top), maskBottom: Math.round(mk.bottom)};
    if (o.maskHand) paintMitten(p, a.rHand, 0.1 * u, 1, def.head.skin, s + 90);
  }
  if (o.cup) paintCup(p, a.rHand, u, s + 60, o.cup === 'sip' ? (view === 'front' ? 0.5 : d * 0.5) : 0);
  return m;
};

/** `new: coffee-cup`: lidded paper takeaway cup (0.09 x 0.07 m) with a kraft sleeve, held in the hand at `h`. */
export const paintCup = (p: Painter, h: Pt, u: number, seed: number, tilt = 0) => {
  const w = 0.075 * u, ht = 0.11 * u, co = Math.cos(tilt), si = Math.sin(tilt);
  const R = ([x, y]: number[]): Pt => [h[0] + x * co - y * si, h[1] + x * si + y * co];
  const body: Pt[] = [[-w * 0.42, -ht * 0.8], [w * 0.42, -ht * 0.8], [w * 0.34, ht * 0.25], [-w * 0.34, ht * 0.25]].map(R);
  hardFill(p, seed, C.cup, body);
  hardFill(p, seed + 1, C.sleeve, [[-w * 0.4, -ht * 0.45], [w * 0.4, -ht * 0.45], [w * 0.37, -ht * 0.05], [-w * 0.37, -ht * 0.05]].map(R));
  hardFill(p, seed + 2, C.lid, [[-w * 0.48, -ht * 0.92], [w * 0.48, -ht * 0.92], [w * 0.46, -ht * 0.8], [-w * 0.46, -ht * 0.8]].map(R));
  inkLine(p, seed + 3, body, {weight: 0.8, closed: true, still: true});
  // the hand over the sleeve (mitten, UT14)
  hardFill(p, seed + 4, '#e8c3a4', ell(h[0], h[1] - ht * 0.15, w * 0.36, w * 0.42, 12));
};

/**
 * `new: tote-bag`: canvas tote, teal stripe. `shoulder` (default): hangs from the near shoulder by a strap at the hip. `hand` (W5.3 R3, shots 12-13): carried in the near hand by two handles
 * (the fist closes over them), hanging below the hand and swinging against the arm swing (a pendulum: the bag lags the hand by about half a cycle, tilt 1.1 rad per metre of hand offset from the
 * shoulder); `up` 0..1 (tote-over-head) takes it up: both hands grip the bag's lower corners and the bag rides on them over the head (bottom 0.03 m below the fists, clear of the head).
 */
const paintTote = (p: Painter, a: FigAnchors, u: number, view: View4, seed: number, up = 0, mode: 'shoulder' | 'hand' = 'shoulder', skin = '#e8c3a4') => {
  const sh = view === 'right' ? a.rShoulder : a.lShoulder, d = sideDir(view);
  const hand = view === 'right' ? a.rHand : a.lHand, e = up * up * (3 - 2 * up);
  const bagAt = (top: Pt, tilt = 0): Pt[] => {
    const R = ([x, y]: Pt): Pt => [top[0] + (x * Math.cos(tilt) - y * Math.sin(tilt)) * u, top[1] + (x * Math.sin(tilt) + y * Math.cos(tilt)) * u];
    return [R([-0.15, 0]), R([0.15, 0]), R([0.17, 0.36]), R([-0.17, 0.36])];
  };
  const paintBag = (bag: Pt[], top: Pt, tilt: number) => {
    const R = ([x, y]: Pt): Pt => [top[0] + (x * Math.cos(tilt) - y * Math.sin(tilt)) * u, top[1] + (x * Math.sin(tilt) + y * Math.cos(tilt)) * u];
    hardFill(p, seed + 1, C.tote, bag);
    hardFill(p, seed + 2, C.toteStripe, [R([-0.14, 0.2]), R([0.14, 0.2]), R([0.155, 0.25]), R([-0.155, 0.25])]);
    washAt(p, seed + 3, '#8a7a5a', 70, [bag[0], R([-0.07, 0]), R([-0.11, 0.36]), bag[3]], 0.1, 0.2);
    inkLine(p, seed + 4, bag, {weight: 0.8, closed: true, still: true});
  };
  const fist = (q: Pt, k: number) => paintMitten(p, q, 0.085 * u, d as 1 | -1, skin, seed + k, {rot: 0});
  if (mode === 'hand') {
    const other = view === 'right' ? a.lHand : a.rHand;
    // carried: the bag hangs from the near hand; the tilt follows the hand's offset from the shoulder (the bottom lags behind the swing)
    const tilt = Math.max(-0.3, Math.min(0.3, 1.1 * ((hand[0] - sh[0]) * d) / u)) * d;
    const hang: Pt = [hand[0] - 0.22 * u * Math.sin(tilt), hand[1] + 0.22 * u * Math.cos(tilt)];
    // held overhead: the bag sits on both fists (bottom corners), the handles fold into a loop over the top
    const gx = (hand[0] + other[0]) / 2, gy = (hand[1] + other[1]) / 2 + 0.03 * u, heldTop: Pt = [gx, gy - 0.36 * u];
    const top: Pt = [hang[0] * (1 - e) + heldTop[0] * e, hang[1] * (1 - e) + heldTop[1] * e], tl = tilt * (1 - e);
    const corner = (x: number): Pt => [top[0] + (x * Math.cos(tl)) * u, top[1] + (x * Math.sin(tl)) * u];
    const grip: Pt = [hand[0] * (1 - e) + top[0] * e, hand[1] * (1 - e) + (top[1] - 0.13 * u) * e];
    for (const x of [-0.1, 0.1]) inkLine(p, seed + (x < 0 ? 0 : 5), [corner(x), [(corner(x)[0] + grip[0]) / 2 + x * 0.2 * u, (corner(x)[1] + grip[1]) / 2], grip], {weight: 2.0, color: '#a8987a', closed: false, still: true});
    const bag = bagAt(top, tl);
    paintBag(bag, top, tl);
    if (e < 0.55) fist(hand, 20);
    else { fist([bag[3][0] + 0.02 * u, bag[3][1] - 0.04 * u], 20); fist([bag[2][0] - 0.02 * u, bag[2][1] - 0.04 * u], 30); }
    return;
  }
  // `up` (new: tote-over-head): the near hand takes the bag up; at 1 the whole bag sits over the head (bottom 0.06 m above the head top), held at its side by the hands
  const rest: Pt = [sh[0] - d * 0.06 * u, sh[1] + 0.42 * u];
  const bagBottom = Math.min(hand[1] + 0.02 * u, a.headTop - 0.06 * u), held: Pt = [a.head[0] - d * 0.1 * u, bagBottom - 0.36 * u];
  const top: Pt = [rest[0] * (1 - e) + held[0] * e, rest[1] * (1 - e) + held[1] * e];
  const bag = bagAt(top);
  inkLine(p, seed, [[top[0] - 0.1 * u, top[1]], [sh[0] * (1 - e) + hand[0] * e - d * 0.02 * u, (sh[1] + 0.02 * u) * (1 - e) + (hand[1] + 0.04 * u) * e], [top[0] + 0.1 * u, top[1]]], {weight: 2.2, color: '#a8987a', closed: false, still: true});
  paintBag(bag, top, 0);
};

/** `new: wool-scarf` (R1.1): grey knit scarf wrapped at the neck, ends hanging at the chest. */
const paintScarf = (p: Painter, a: FigAnchors, u: number, view: View4, seed: number) => {
  const nk: Pt = [(a.rShoulder[0] + a.lShoulder[0]) / 2, Math.min(a.rShoulder[1], a.lShoulder[1]) - 0.02 * u];
  const d = sideDir(view), side = view === 'left' || view === 'right';
  const wrap: Pt[] = side
    ? [[nk[0] - 0.1 * u, nk[1] - 0.08 * u], [nk[0] + d * 0.08 * u, nk[1] - 0.1 * u], [nk[0] + d * 0.11 * u, nk[1] + 0.02 * u], [nk[0] - 0.11 * u, nk[1] + 0.04 * u]]
    : [[nk[0] - 0.14 * u, nk[1] - 0.07 * u], [nk[0] + 0.14 * u, nk[1] - 0.07 * u], [nk[0] + 0.15 * u, nk[1] + 0.04 * u], [nk[0] - 0.15 * u, nk[1] + 0.04 * u]];
  hardFill(p, seed, C.scarf, wrap);
  if (view !== 'back') {
    const ex = side ? nk[0] + d * 0.07 * u : nk[0] + 0.06 * u;
    const end: Pt[] = [[ex - 0.035 * u, nk[1]], [ex + 0.035 * u, nk[1]], [ex + 0.04 * u, nk[1] + 0.32 * u], [ex - 0.03 * u, nk[1] + 0.33 * u]];
    hardFill(p, seed + 1, C.scarfShade, end);
    for (let i = 0; i < 3; i++) inkLine(p, seed + 2 + i, [[end[3][0] + i * 0.02 * u, end[3][1]], [end[3][0] + i * 0.02 * u, end[3][1] + 0.04 * u]], {weight: 1.0, color: C.scarfShade, closed: false, still: true});
  }
  for (let i = 0; i < 4; i++) inkLine(p, seed + 6 + i, [[wrap[0][0] + (i + 0.5) * 0.05 * u, wrap[0][1] + 0.01 * u], [wrap[3][0] + (i + 0.5) * 0.05 * u, wrap[3][1] - 0.01 * u]], {weight: 0.6, color: C.scarfShade, closed: false, still: true});
  inkLine(p, seed + 12, wrap, {weight: 0.8, closed: true, still: true});
};

/** R4 (J3): the held mask in transit between two people's right hands (`e` 0 at `from`'s hand, 1 at `to`'s), hung under the hand as `maskHand` does; the head frame (size) is the receiver's. */
export const paintMaskCarry = (p: Painter, from: FigAnchors, to: FigAnchors, def: CastDef, e: number, seed: number, u: number) => {
  const {K} = headFrame(to), x = from.rHand[0] + (to.rHand[0] - from.rHand[0]) * e, y = from.rHand[1] + (to.rHand[1] - from.rHand[1]) * e - Math.sin(Math.PI * e) * 0.1 * K;
  paintMask(p, to, {id: 'A1', view: 'front', seed, hair: def.head.hair, skin: def.head.skin, at: [x, y + 1.35 * K]});
  paintMitten(p, [x, y], 0.1 * u, 1, def.head.skin, seed + 50);
};

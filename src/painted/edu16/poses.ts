import {shoulderPoint, type Arm, type CastDef, type FigPose} from '../kit/cast';
import type {Pt} from '../kit/painter';
import {BODY_POSES, HANG_SIDE, type PoseBody} from '../kit/poses-more';
import {POSES} from '../kit/poses';
import type {View4} from '../kit/views';

// EDU-EP16 poses (N5, W5.2; brief "New assets" N5): `new: kneel-net`, `new: hold-bird`, `new: open-hands`, `new: duck-cover`, `new: mask-off`,
// `new: mask-on`, `new: tote-over-head`. Episode-local (kit intake at W8 moves them to `poses-more.ts` as P47+). Each pose is a few keyframes of
// body fields and arm targets (metres from the shoulder of the posed body, as the kit pose sheet: front u = screen right, profile u = toward the
// facing side; v up; two bones of at most BONE 0.26 m). `k` 0..1 is the gesture clock (net lowering, hands opening, duck, peel, pull, tote swing):
// the keyframes are spread evenly over k and linearly interpolated, so a shot drives it with one number. `ep16Pose` returns FigPose fields to spread
// into `paintFigureAt`'s `fig`, over a base pose (the walk or stand the shot already uses: pass `base`, default P01).

export type Ep16PoseId = 'kneel-net' | 'hold-bird' | 'open-hands' | 'duck-cover' | 'mask-off' | 'mask-off-r' | 'mask-on' | 'tote-over-head' | 'give-mask' | 'take-mask';
type A = {via: Pt; to: Pt};
type Frame = {body?: PoseBody; r?: A; l?: A; /** Profile: near / far arm (near = character's right when facing right). */ near?: A; far?: A};
export type PoseDef = {name: string; views: View4[]; /** The kit pose whose body (and hang) the keyframes start from (a kneel pose for the kneeling ones). */ base: 'P01' | 'P34'; keys: Frame[]};
const a = (via: Pt, to: Pt): A => ({via, to});

export const EP16_POSES: Record<Ep16PoseId, PoseDef> = {
  // MAN kneels at C0 (front): the net pole in both hands, raised beside him (k 0) then lowered in front of the knees (k 1). The pole itself is `paintHandNet`.
  // R2.1 (F3): also the `right`/`left` profile (shot 3): both hands on the pole in front of the chest (u toward the facing side), the hoop raised behind the shoulder at k 0, lowered forward at k 1.
  'kneel-net': {name: 'kneel_net', views: ['front', 'right', 'left'], base: 'P34', keys: [
    {body: {kneel: 1}, r: a([-0.17, -0.2], [-0.15, -0.36]), l: a([0.17, -0.2], [0.17, -0.06]), near: a([0.1, -0.2], [0.2, -0.3]), far: a([0.1, -0.2], [0.17, -0.2])},
    {body: {kneel: 1}, r: a([-0.15, -0.23], [-0.1, -0.5]), l: a([0.12, -0.23], [0.05, -0.38]), near: a([0.14, -0.22], [0.26, -0.36]), far: a([0.14, -0.2], [0.24, -0.24])},
  ]},
  // MAN kneels, hands cupped low and together holding the calm crow (front).
  'hold-bird': {name: 'hold_bird', views: ['front'], base: 'P34', keys: [
    {body: {kneel: 1}, r: a([-0.12, -0.22], [-0.07, -0.45]), l: a([0.12, -0.22], [0.07, -0.45])},
  ]},
  // The hands open and rise a little after the release (front): k 0 closed (as hold-bird), 1 palms up and apart.
  'open-hands': {name: 'open_hands', views: ['front'], base: 'P34', keys: [
    {body: {kneel: 1}, r: a([-0.12, -0.22], [-0.07, -0.45]), l: a([0.12, -0.22], [0.07, -0.45])},
    {body: {kneel: 1}, r: a([-0.2, -0.18], [-0.22, -0.4]), l: a([0.2, -0.18], [0.22, -0.4])},
    {body: {kneel: 1}, r: a([-0.24, -0.14], [-0.3, -0.34]), l: a([0.24, -0.14], [0.3, -0.34])},
  ]},
  // MAN walking (profile): knees bend, head down, the far (left) arm over the head, the near (right) cup arm out, k 0 -> 1 in 3-4 frames.
  'duck-cover': {name: 'duck_cover', views: ['right', 'left'], base: 'P01', keys: [
    {body: {}, near: a([0.02, -0.255], [0.2, -0.33]), far: a([-0.012, -0.25], [0.014, -0.5])},
    {body: {squat: 0.7, bend: 0.3, nod: [0.03, -0.12]}, near: a([0.14, 0.0], [0.3, 0.2]), far: a([0.12, 0.22], [0.25, 0.33])},
  ]},
  // MAN, front: both hands at the chin, then lifting the mask up and clear (k 0 -> 1; the mask follows with `lift`).
  'mask-off': {name: 'mask_off', views: ['front'], base: 'P01', keys: [
    {body: {}, r: a([-0.2, -0.18], [-0.09, 0.1]), l: a([0.2, -0.18], [0.09, 0.1])},
    {body: {}, r: a([-0.22, 0.0], [-0.12, 0.26]), l: a([0.22, 0.0], [0.12, 0.26])},
    {body: {rise: 0.01}, r: a([-0.24, 0.1], [-0.12, 0.34]), l: a([0.24, 0.1], [0.12, 0.34])},
  ]},
  // MAN, front, R2.1 (F1, shot 8): RIGHT hand only (screen left; the left arm stays in the P01 hang): hang, hand at the mask's chin, up with the mask, out to the left and down (k 0, 1/3, 2/3, 1; unequal beats are set by the shot's clock map).
  'mask-off-r': {name: 'mask_off_r', views: ['front'], base: 'P01', keys: [
    {body: {}},
    {body: {}, r: a([-0.2, -0.16], [-0.1, 0.1])},
    {body: {}, r: a([-0.25, 0.12], [-0.16, 0.36])},
    {body: {}, r: a([-0.3, 0.05], [-0.46, -0.12])},
  ]},
  // WOMAN, front: holds the mask at the chest, lifts it over the head, pulls it down onto the face (k 0 -> 1; the mask uses `lift` 1 -> 0).
  'mask-on': {name: 'mask_on', views: ['front'], base: 'P01', keys: [
    {body: {}, r: a([-0.17, -0.2], [-0.1, -0.12]), l: a([0.17, -0.2], [0.1, -0.12])},
    {body: {}, r: a([-0.25, 0.05], [-0.14, 0.34]), l: a([0.25, 0.05], [0.14, 0.34])},
    {body: {}, r: a([-0.22, -0.02], [-0.13, 0.12]), l: a([0.22, -0.02], [0.13, 0.12])},
    {body: {}}, // R2.1 (F5): the hands drop to the P01 hang (no shrug)
  ]},
  // WOMAN walking (profile): the near arm swings the tote up and over her head (k 0 -> 1), the far arm stays.
  'tote-over-head': {name: 'tote_over_head', views: ['right', 'left'], base: 'P01', keys: [
    {body: {}, near: a([0.0, -0.255], [0.02, -0.5]), far: a([-0.012, -0.25], [0.014, -0.5])},
    {body: {rise: 0.01}, near: a([-0.1, 0.0], [-0.2, 0.26]), far: a([-0.08, -0.05], [-0.18, 0.22])},
    // R2.1 (F14): both hands up on the bag's two sides, forearms beside (behind) the head
    // R3 (H8/H9): the fists grip the bag's two lower corners (near hand at the back corner, far hand at the front corner), v 0.46 m over the shoulder = 0.08 m over the head top
    {body: {rise: 0.02}, near: a([-0.16, 0.2], [-0.26, 0.43]), far: a([0.0, 0.22], [0.06, 0.45])},
  ]},
  // R4 (J3, shot 11) hand-over in profile: MAN (view right, near arm) holds the mask close, reaches out to her, then lets the arm drop (k 0, 1/3 hold, 2/3 reach, 1 hang).
  'give-mask': {name: 'give_mask', views: ['right'], base: 'P01', keys: [
    {body: {}, near: a([0.1, -0.2], [0.2, -0.18]), far: a([-0.012, -0.25], [0.014, -0.5])},
    {body: {}, near: a([0.14, -0.15], [0.42, -0.1]), far: a([-0.012, -0.25], [0.014, -0.5])},
    {body: {}, near: a([0.0, -0.255], [0.02, -0.5]), far: a([-0.012, -0.25], [0.014, -0.5])},
  ]},
  // WOMAN (view left; the character's right arm is the far arm in a left profile) hangs, reaches to him, takes the mask back to her chest (k 0, 1/3 reach, 1 held at the chest).
  'take-mask': {name: 'take_mask', views: ['left'], base: 'P01', keys: [
    {body: {}, near: a([0.0, -0.255], [0.02, -0.5]), far: a([-0.012, -0.25], [0.014, -0.5])},
    {body: {}, near: a([0.0, -0.255], [0.02, -0.5]), far: a([0.14, -0.15], [0.42, -0.1])},
    {body: {}, near: a([0.0, -0.255], [0.02, -0.5]), far: a([0.1, -0.1], [0.2, -0.04])},
  ]},
};

const lerp = (x: number, y: number, u: number) => x + (y - x) * u;
const lerpPt = (p: Pt, q: Pt, u: number): Pt => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
const NUM = ['crouch', 'bend', 'lean', 'rise', 'sit', 'floorSit', 'kneel', 'squat', 'lift'] as const;
const FRONT_HANG: A = {via: [0.012, -0.255], to: [0.03, -0.5]};

/** Frame at gesture clock `k` (keyframes evenly spaced over 0..1, linear). */
const frameAt = (keys: Frame[], k: number): {body: PoseBody; k0: Frame; k1: Frame; u: number} => {
  const m = keys.length - 1, x = Math.max(0, Math.min(1, k)) * m, i = Math.min(m - 1 < 0 ? 0 : m - 1, Math.floor(x)), u = m === 0 ? 0 : x - i;
  const k0 = keys[i], k1 = keys[Math.min(m, i + 1)], b0 = k0.body ?? {}, b1 = k1.body ?? {}, body: PoseBody = {};
  for (const f of NUM) if (b0[f] !== undefined || b1[f] !== undefined) body[f] = lerp(b0[f] ?? 0, b1[f] ?? 0, u);
  if (b0.nod || b1.nod) body.nod = lerpPt(b0.nod ?? [0, 0], b1.nod ?? [0, 0], u);
  return {body, k0, k1, u};
};

/**
 * FigPose fields for pose `id` at gesture clock `k` on figure `def` at ground point `g` (picture px), `unit` px per metre, in `view`. Spread into
 * `paintFigureAt`'s `fig`. A view the pose lacks returns {} (the base pose stays). The shoulder is that of the posed body, so a hand "at the chin"
 * stays at the chin for any person.
 */
export const ep16Pose = (id: Ep16PoseId, def: CastDef, g: Pt, unit: number, view: View4, k = 1): Partial<FigPose> => {
  const P = EP16_POSES[id];
  if (!P.views.includes(view)) return {};
  const {body, k0, k1, u} = frameAt(P.keys, k), front = view === 'front', dir = view === 'left' ? -1 : 1, sc = def.armScale ?? 1;
  const out: Partial<FigPose> = {...body, ...(body.lean !== undefined ? {lean: body.lean * dir} : {})};
  const px = (side: 'r' | 'l', p: Pt): Pt => {
    const sh = shoulderPoint(def, g, unit, {view: view === 'back' ? 'front' : view, ...body}, side);
    return [sh[0] + (front ? 1 : dir) * p[0] * sc * unit, sh[1] - p[1] * sc * unit];
  };
  const arm = (side: 'r' | 'l', x: A | undefined, y: A | undefined): Arm | undefined => {
    if (!x && !y) return undefined;
    const hang = front ? FRONT_HANG : {via: HANG_SIDE.via, to: HANG_SIDE.to};
    const h: A = front && side === 'r' ? {via: [-hang.via[0], hang.via[1]], to: [-hang.to[0], hang.to[1]]} : hang;
    const A0 = x ?? h, A1 = y ?? h;
    return {to: px(side, lerpPt(A0.to, A1.to, u)), via: px(side, lerpPt(A0.via, A1.via, u))};
  };
  if (front) { out.rArm = arm('r', k0.r, k1.r); out.lArm = arm('l', k0.l, k1.l); }
  else {
    const nearIsR = dir > 0, n = arm(nearIsR ? 'r' : 'l', k0.near, k1.near), f = arm(nearIsR ? 'l' : 'r', k0.far, k1.far);
    out.rArm = nearIsR ? n : f; out.lArm = nearIsR ? f : n; out.farArmUnder = true;
  }
  return out;
};
export {BODY_POSES, POSES};

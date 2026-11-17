import {BONE, bodyFrame, shoulderPoint, type Arm, type CastDef, type FigAnchors, type FigPose} from './cast';
import {ell, washAt} from './draw';
import type {ExpressionId} from './expressions';
import type {FaceState} from './head';
import {quarterGeo} from './quarter';
import type {View4} from './views';
import {cardSquash, paintFigureAt, viewAtCam} from './figure-at';
import type {Painter, Pt} from './painter';
import {poseFor} from './poses';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

// KIT copy of EDU-EP21 N4 `car-seat sit` + `radio reach` (KIT-P01 intake, W8.4, 17 Nov 2026; the episode keeps src/painted/edu21/driver.ts
// and cast.ts unchanged). Casting lines: `car-seat-sit` (P31 body on a bucket-seat cushion, hands `wheel` at 9-and-3, `face` = P12 seated,
// `thighs` = P31) and `radio-reach` (`leftShoulderW` + `reachArm`: world-metre two-bone reach of the left hand to a dash point, handed to
// `SeatedState.reachL`). Pose helpers, not `POSES` ids: the shot drives hand blends (`mixHandSet`, `armFk`) and the reach with its own clock
// (EP21's B01/B04 tracks stay episode timing). Hip joint: `SEDAN_DRIVER_HIP` in sedan-cabin.ts for the kit sedan. Parity: tests/edu21-kit.test.ts.

/** Ground point to hand `paintFigureAt` so a `sit: 1` pose puts the hip joint at `hip` (the feet fall below the cabin floor, hidden). */
export const seatedGround = (def: CastDef, hip: [number, number, number], view: 'front' | 'left' | 'right' = 'right'): [number, number, number] => {
  const f = bodyFrame(def, {view, sit: 1});
  return [hip[0], hip[1] - f.hipV, hip[2]];
};

export type ArmM = {via: Pt; to: Pt};
export type HandSet = {near: ArmM; far: ArmM; r: ArmM; l: ArmM};
export const am = (via: Pt, to: Pt): ArmM => ({via, to});
/** Hand states (N4). `near`/`far` profile arms; `r`/`l` front arms (character's right = screen left). */
export const CAR_SEAT_HANDS: Record<'wheel' | 'face' | 'thighs', HandSet> = {
  // both hands on the rim at 9-and-3: wheel centre (+0.30, 0.95, +0.38), r 0.18; the shoulder sits ~0.45 m behind the rim
  wheel: {near: am([0.2, -0.14], [0.44, -0.05]), far: am([0.2, -0.15], [0.43, -0.07]), r: am([-0.1, -0.21], [-0.02, -0.12]), l: am([0.1, -0.21], [0.02, -0.12])},
  // P12 (hands near the face), seated. Raised from the kit's P12 (hand 0.07-0.14 m over the shoulder) to the cheeks (0.15-0.17 m): on the
  // four-head card the seated shoulder (y ~0.89) sits under the door's beltline (0.92), so the kit targets left both hands behind the door
  // in B01-SH02 and the startle never read (Boss W5.2 r3 frames).
  face: {near: am([0.13, -0.08], [0.12, 0.17]), far: am([0.1, -0.12], [0.09, 0.15]), r: am([-0.15, -0.06], [0.02, 0.15]), l: am([0.15, -0.06], [-0.02, 0.15])},
  // P31 (hands on the thighs)
  thighs: {near: am([0.04, -0.255], [0.2, -0.43]), far: am([0.04, -0.255], [0.24, -0.41]), r: am([-0.08, -0.225], [0.045, -0.43]), l: am([0.08, -0.225], [-0.045, -0.43])},
};
/** Arm from two bone angles (0 = down, 90 = forward/screen-right) and the two bone lengths (m). */
const fk = (a1: number, a2: number, l1: number, l2: number): ArmM => {
  const via: Pt = [l1 * Math.sin(a1), -l1 * Math.cos(a1)];
  return {via, to: [via[0] + l2 * Math.sin(a2), via[1] - l2 * Math.cos(a2)]};
};
const bones = (a: ArmM): [number, number, number, number] => [Math.atan2(a.via[0], -a.via[1]), Math.atan2(a.to[0] - a.via[0], -(a.to[1] - a.via[1])),
  Math.hypot(a.via[0], a.via[1]), Math.hypot(a.to[0] - a.via[0], a.to[1] - a.via[1])];
/** Blend two arms on their bone angles and lengths (u 0..1): continuous into both authored end states, no straight-line shortening. */
export const armFk = (a: ArmM, b: ArmM, u: number): ArmM => {
  if (u <= 0) return a;
  if (u >= 1) return b;
  const A = bones(a), B = bones(b), m = (i: number) => A[i] + (B[i] - A[i]) * u;
  return fk(m(0), m(1), m(2), m(3));
};
export const mixHandSet = (a: HandSet, b: HandSet, u: number): HandSet => ({near: armFk(a.near, b.near, u), far: armFk(a.far, b.far, u), r: armFk(a.r, b.r, u), l: armFk(a.l, b.l, u)});

export type SeatedState = {
  face: ExpressionId;
  hands: HandSet;
  /** Body offsets (m): `lift` up (the jolt's shoulders-up, the breath's drop as a negative), `back` toward -x (head back). */
  lift?: number; back?: number;
  /** Cyan instrument wash on her face (pre-strike only, CL21-03; 13 % #9cc8f0 in LF01 terms). */
  dashGlow?: boolean;
  /** Cool cabin tint toward #3a4656 (0..1). */
  tint?: number;
  // Boss W5.2 BG2 (2026-11-16): head and upper-body fields passed to the kit figure (`FigPose`), and the N4 radio reach.
  /** Upper-body lean toward screen right, radians (kit `lean`; the shot gives the sign for its lens). */
  lean?: number;
  /** Back view: head turned toward screen right / tilted up, radians (kit `headYaw`, `headTilt`). */
  headYaw?: number; headTilt?: number;
  /** Front/three-quarter head: features shifted on the head sphere, radians (kit `headPitch`; negative = looking up). */
  headPitch?: number;
  /** Head nod offset [dx, dy] in head units (kit `nod`), the small head turn of a front view. */
  nod?: Pt;
  /** Expression overrides (eye look, blink) on top of `face`. */
  faceState?: Partial<FaceState>;
  /** N4 `new: radio reach`: her LEFT wrist and elbow as world points (space R, `reachArm`), painted in place of the hand set's left arm. */
  reachL?: {wrist: V3; elbow: V3};
};

/** Arms of a hand set as FigPose fields for this view (profile: one shoulder anchor, near arm = her right when facing screen right). */
const armsFor = (def: CastDef, s: HandSet, g: Pt, unit: number, view: 'front' | 'left' | 'right'): {rArm: Arm; lArm: Arm} => {
  const body = {view, sit: 1} as const;
  if (view === 'front') {
    const px = (side: 'r' | 'l', q: Pt): Pt => { const sh = shoulderPoint(def, g, unit, body, side); return [sh[0] + q[0] * unit, sh[1] - q[1] * unit]; };
    return {rArm: {via: px('r', s.r.via), to: px('r', s.r.to)}, lArm: {via: px('l', s.l.via), to: px('l', s.l.to)}};
  }
  const dir = view === 'left' ? -1 : 1, sh = shoulderPoint(def, g, unit, body, 'r');
  const px = (q: Pt): Pt => [sh[0] + dir * q[0] * unit, sh[1] - q[1] * unit];
  const near: Arm = {via: px(s.near.via), to: px(s.near.to)}, far: Arm = {via: px(s.far.via), to: px(s.far.to)};
  return dir > 0 ? {rArm: near, lArm: far} : {lArm: near, rArm: far};
};

/** Paint `def` seated (P31 body, facing +x) with the hip joint at `seat` through camera `c` (call inside the car's `inside` painter so the
 *  glass clips the figure). Returns the anchors. */
export const paintSeatedAt = (p: Painter, c: YCam, def: CastDef, seat: V3, s: SeatedState, o: {t: number; seed?: number; view?: View4} = {t: 0}): FigAnchors | null => {
  const hip: V3 = [seat[0] - (s.back ?? 0), seat[1] + (s.lift ?? 0), seat[2]];
  const at = seatedGround(def, hip, 'right');
  const g = camPoint(c, at);
  if (!g) return null;
  // `o.view` holds a four-view square to the lens (SH12 `left`); default the view follows her facing +x through the eight views
  const place = o.view ? {view: o.view} : {facing: [1, 0] as [number, number]};
  const unit = camUnit(c, at), vf = viewAtCam(c, {at, ...place});
  const view = vf.view === 'back' ? 'front' : vf.view;
  // poseFor's `view` is dropped so the placement's own view (back, back three-quarter) wins over the arm frame's (Boss W5.2 BG2: with it
  // the fig forced every back view to the front card; BG1's front and profile lenses are unchanged)
  const {view: _poseView, ...pose} = poseFor('P31', def, g, unit, view);
  void _poseView;
  const fig: Partial<FigPose> = {...pose, ...armsFor(def, s.hands, g, unit, view),
    ...(s.lean ? {lean: s.lean} : {}), ...(s.headYaw ? {headYaw: s.headYaw} : {}), ...(s.headTilt ? {headTilt: s.headTilt} : {}),
    ...(s.headPitch ? {headPitch: s.headPitch} : {}), ...(s.nod ? {nod: s.nod} : {})};
  if (s.reachL) {
    const arm = reachArmAt(def, c, g, unit, at, vf, s.reachL);
    if (arm) fig.lArm = arm;
  }
  const a = paintFigureAt(p, c, def, {at, ...place, pose: 'P31', fig, face: s.face, ...(s.faceState ? {faceState: s.faceState} : {}), t: o.t, shadow: false, ...(o.seed ? {seed: o.seed} : {}),
    ...(s.tint ? {tint: {to: '#3a4656', u: s.tint}} : {})});
  if (a && s.dashGlow) {
    const h = a.chin - a.headTop;
    washAt(p, 33001, '#9cc8f0', 58, ell(a.head[0] + 0.15 * h, a.chin - 0.35 * h, 0.62 * h, 0.5 * h, 18), 0.4, 0.2);
  }
  return a;
};

/** Projected lead of a seated four-head card for state `s`: crown (hip + 0.97 m, woman-ponytail's card) and hip picture points and their distance (px). */
export const seatedLead = (c: YCam, seat: V3, s: Pick<SeatedState, 'lift' | 'back'> = {}) => {
  const hip: V3 = [seat[0] - (s.back ?? 0), seat[1] + (s.lift ?? 0), seat[2]];
  const h = camPoint(c, hip), k = camPoint(c, [hip[0], hip[1] + 0.97, hip[2]]);
  return h && k ? {hip: h, crown: k, px: Math.hypot(k[0] - h[0], k[1] - h[1])} : null;
};

// ------------------------------------------------------------------------------------------------ N4 radio reach (B04-SH09)
// Boss W5.2 BG2, 2026-11-16. The reach is solved in world metres (space R) on the four-head card's own bones (kit `BONE` 0.26 m each)
// from her left shoulder, with the sheet's lean (10 deg forward, 8 deg toward -z, about the hip), then projected through the lens and
// handed to the kit card. Card shoulder: 0.4535 m over the hip, 0.1275 m to the side (kit `bodyFrame`/`shoulderPoint`, front, sit 1).
const SH_UP = 0.4535, SH_SIDE = 0.1275, HAND = 0.085;
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);

/** Her left shoulder in space R with the upper body leaned `fwd` deg toward +x and `side` deg toward -z about the hip `hip`. */
export const leftShoulderW = (hip: V3, fwd: number, side: number): V3 => {
  const f = (fwd * Math.PI) / 180, s = (side * Math.PI) / 180;
  // offset (0, SH_UP, -SH_SIDE): pitch forward about z, then roll toward -z about x
  const y1 = SH_UP * Math.cos(f), x1 = SH_UP * Math.sin(f);
  const y2 = y1 * Math.cos(s) - SH_SIDE * Math.sin(s), z2 = -y1 * Math.sin(s) - SH_SIDE * Math.cos(s);
  return [hip[0] + x1, hip[1] + y2, hip[2] + z2];
};

/** Two-bone IK in world metres: elbow for shoulder `sh` and wrist `w` (wrist pulled in to the reach), bending toward `pole`. */
export const reachArm = (sh: V3, w: V3, pole: V3): {wrist: V3; elbow: V3; dist: number; reach: number} => {
  const L = BONE, max = 2 * L * 0.999, d0 = sub3(w, sh), dist = len3(d0);
  const dir = mul3(d0, 1 / (dist || 1)), d = Math.min(dist, max), wrist = add3(sh, mul3(dir, d));
  const pd = sub3(pole, mul3(dir, pole[0] * dir[0] + pole[1] * dir[1] + pole[2] * dir[2])), pl = len3(pd) || 1;
  const h = Math.sqrt(Math.max(0, L * L - (d / 2) * (d / 2)));
  return {wrist, elbow: add3(add3(sh, mul3(dir, d / 2)), mul3(pd, h / pl)), dist, reach: max};
};

/** The world reach as a kit arm for this lens: picture points, inverted through the back view's mirror, its three-quarter turn
 *  (`quarterGeo`: kt * kr, x 0.85 for the far arm) and the card squash, so `back.ts` paints the wrist on the projected target. */
const reachArmAt = (def: CastDef, c: YCam, g: Pt, unit: number, at: V3, vf: ReturnType<typeof viewAtCam>, r: {wrist: V3; elbow: V3}): Arm | null => {
  const W = camPoint(c, r.wrist), E = camPoint(c, r.elbow);
  if (!W || !E) return null;
  const sy = cardSquash(c, at, def.height, g, unit);
  const unsq = (q: Pt): Pt => [q[0], g[1] + (q[1] - g[1]) / sy];
  if (vf.view !== 'back') return {via: unsq(E), to: unsq(W)};
  const qb = quarterGeo(vf), k = qb ? qb.kt * qb.kr * (qb.qdir === -1 ? 1 : 0.85) : 1;
  const inv = (q: Pt): Pt => { const u = unsq(q), x = g[0] + (u[0] - g[0]) / k; return [2 * g[0] - x, u[1]]; };
  return {via: inv(E), to: inv(W)};
};

/** Left wrist at rest on the left thigh (CAR_SEAT_HANDS.thighs, front `l` arm, from the unleaned shoulder). */
export const thighWristL = (hip: V3): V3 => [hip[0] + 0.2, hip[1] + SH_UP - 0.43, hip[2] - SH_SIDE + 0.045];

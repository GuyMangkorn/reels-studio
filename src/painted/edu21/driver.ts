import {BONE, shoulderPoint, type Arm, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, washAt} from '../kit/draw';
import type {ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {quarterGeo} from '../kit/quarter';
import type {View4} from '../kit/views';
import {cardSquash, paintFigureAt, viewAtCam} from '../kit/figure-at';
import type {Painter, Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {DRIVER, DRIVER_HIP, seatedGround} from './cast';

// DRIVER at the wheel (brief N3 outfit on `woman-ponytail`, N4 `new: car-seat sit`; Boss W5.2 BG1, 2026-11-16, from the W3 look-frame
// `paintDriver` in look.tsx, which stays as it was for the locked LF01-LF03 stills). Seated hip H = DRIVER_HIP, facing +x, view cues on.
// N4: P31 body (sit 1) with the arms authored here as hand targets from the POSED shoulders (`shoulderPoint`, as the kit pose library
// does), so a hand on the wheel rim, at the face or on the thigh means the same thing in every view. Blends between hand states run on
// the two bone angles and lengths (`armFk`), so the arm swings instead of shortening mid-move (a straight lerp of the points does).
// The B01 track (`B01_DRIVER`) is the sheet's hands/expression/jolt table as a pure function of the composition frame G, shared by
// B01-SH01 and B01-SH02 so the action matches across the cut (EDU-EP21-SHEETS-R1, "Casting, props and hands").

/** One arm as [elbow, wrist] in metres from the posed shoulder: profile = [u forward, v up]; front = [x screen-right, v up]. */
type ArmM = {via: Pt; to: Pt};
type HandSet = {near: ArmM; far: ArmM; r: ArmM; l: ArmM};
const am = (via: Pt, to: Pt): ArmM => ({via, to});
/** Hand states (N4). `near`/`far` profile arms; `r`/`l` front arms (character's right = screen left). */
export const HANDS: Record<'wheel' | 'face' | 'thighs', HandSet> = {
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
const mixSet = (a: HandSet, b: HandSet, u: number): HandSet => ({near: armFk(a.near, b.near, u), far: armFk(a.far, b.far, u), r: armFk(a.r, b.r, u), l: armFk(a.l, b.l, u)});

export type DriverState = {
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

const ease = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const span = (G: number, a: number, b: number) => ease((G - a) / (b - a));

/** B01 track on the composition clock G (SH01 G0-29, SH02 G29-100), from the sheet's hands table and the two shot blocks:
 *  wheel G0-13; lift off at the strike G14 to near the face (P12) by G37; held; lowered to the thighs G69-95. `worried` to G13,
 *  `surprised` G14-72, `worried` from G73 (SH02 L44). Jolt G14-20: shoulders up 3 cm, head back 2 cm (rise G14-17, settle G20-34).
 *  Breath SH02 L48-60 (G77-89): shoulders drop 2 cm and recover. Dash wash on her face G0-12. */
export const B01_DRIVER = (G: number): DriverState => {
  const hands = G < 69 ? mixSet(HANDS.wheel, HANDS.face, span(G, 14, 37)) : mixSet(HANDS.face, HANDS.thighs, span(G, 69, 95));
  const jolt = G < 14 ? 0 : G < 20 ? span(G, 14, 17) : 1 - span(G, 20, 34);
  const breath = G >= 77 && G <= 89 ? Math.sin((Math.PI * (G - 77)) / 12) : 0;
  return {face: G < 14 ? 'worried' : G < 73 ? 'surprised' : 'worried', hands, lift: 0.03 * jolt - 0.02 * breath, back: 0.02 * jolt, dashGlow: G <= 12};
};

/** Arms of a hand set as FigPose fields for this view (profile: one shoulder anchor, near arm = her right when facing screen right). */
const armsFor = (s: HandSet, g: Pt, unit: number, view: 'front' | 'left' | 'right'): {rArm: Arm; lArm: Arm} => {
  const body = {view, sit: 1} as const;
  if (view === 'front') {
    const px = (side: 'r' | 'l', q: Pt): Pt => { const sh = shoulderPoint(DRIVER, g, unit, body, side); return [sh[0] + q[0] * unit, sh[1] - q[1] * unit]; };
    return {rArm: {via: px('r', s.r.via), to: px('r', s.r.to)}, lArm: {via: px('l', s.l.via), to: px('l', s.l.to)}};
  }
  const dir = view === 'left' ? -1 : 1, sh = shoulderPoint(DRIVER, g, unit, body, 'r');
  const px = (q: Pt): Pt => [sh[0] + dir * q[0] * unit, sh[1] - q[1] * unit];
  const near: Arm = {via: px(s.near.via), to: px(s.near.to)}, far: Arm = {via: px(s.far.via), to: px(s.far.to)};
  return dir > 0 ? {rArm: near, lArm: far} : {lArm: near, rArm: far};
};

/** Paint DRIVER seated at the wheel through camera `c` (call inside the car's `inside` painter so the glass clips her). Returns her anchors. */
export const paintDriverAt = (p: Painter, c: YCam, s: DriverState, o: {t: number; seed?: number; view?: View4} = {t: 0}): FigAnchors | null => {
  const hip: V3 = [DRIVER_HIP[0] - (s.back ?? 0), DRIVER_HIP[1] + (s.lift ?? 0), DRIVER_HIP[2]];
  const at = seatedGround(DRIVER, hip, 'right');
  const g = camPoint(c, at);
  if (!g) return null;
  // `o.view` holds a four-view square to the lens (SH12 `left`); default the view follows her facing +x through the eight views
  const place = o.view ? {view: o.view} : {facing: [1, 0] as [number, number]};
  const unit = camUnit(c, at), vf = viewAtCam(c, {at, ...place});
  const view = vf.view === 'back' ? 'front' : vf.view;
  // poseFor's `view` is dropped so the placement's own view (back, back three-quarter) wins over the arm frame's (Boss W5.2 BG2: with it
  // the fig forced every back view to the front card; BG1's front and profile lenses are unchanged)
  const {view: _poseView, ...pose} = poseFor('P31', DRIVER, g, unit, view);
  void _poseView;
  const fig: Partial<FigPose> = {...pose, ...armsFor(s.hands, g, unit, view),
    ...(s.lean ? {lean: s.lean} : {}), ...(s.headYaw ? {headYaw: s.headYaw} : {}), ...(s.headTilt ? {headTilt: s.headTilt} : {}),
    ...(s.headPitch ? {headPitch: s.headPitch} : {}), ...(s.nod ? {nod: s.nod} : {})};
  if (s.reachL) {
    const arm = reachArmAt(c, g, unit, at, vf, s.reachL);
    if (arm) fig.lArm = arm;
  }
  const a = paintFigureAt(p, c, DRIVER, {at, ...place, pose: 'P31', fig, face: s.face, ...(s.faceState ? {faceState: s.faceState} : {}), t: o.t, shadow: false, ...(o.seed ? {seed: o.seed} : {}),
    ...(s.tint ? {tint: {to: '#3a4656', u: s.tint}} : {})});
  if (a && s.dashGlow) {
    const h = a.chin - a.headTop;
    washAt(p, 33001, '#9cc8f0', 58, ell(a.head[0] + 0.15 * h, a.chin - 0.35 * h, 0.62 * h, 0.5 * h, 18), 0.4, 0.2);
  }
  return a;
};

/** Projected lead of DRIVER for state `s`: crown (hip + 0.97 m) and hip picture points and their distance (px). */
export const driverLead = (c: YCam, s: Pick<DriverState, 'lift' | 'back'> = {}) => {
  const hip: V3 = [DRIVER_HIP[0] - (s.back ?? 0), DRIVER_HIP[1] + (s.lift ?? 0), DRIVER_HIP[2]];
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
const reachArmAt = (c: YCam, g: Pt, unit: number, at: V3, vf: ReturnType<typeof viewAtCam>, r: {wrist: V3; elbow: V3}): Arm | null => {
  const W = camPoint(c, r.wrist), E = camPoint(c, r.elbow);
  if (!W || !E) return null;
  const sy = cardSquash(c, at, DRIVER.height, g, unit);
  const unsq = (q: Pt): Pt => [q[0], g[1] + (q[1] - g[1]) / sy];
  if (vf.view !== 'back') return {via: unsq(E), to: unsq(W)};
  const qb = quarterGeo(vf), k = qb ? qb.kt * qb.kr * (qb.qdir === -1 ? 1 : 0.85) : 1;
  const inv = (q: Pt): Pt => { const u = unsq(q), x = g[0] + (u[0] - g[0]) / k; return [2 * g[0] - x, u[1]]; };
  return {via: inv(E), to: inv(W)};
};

/** Left wrist at rest on the left thigh (HANDS.thighs, front `l` arm, from the unleaned shoulder). */
const THIGH_L = (hip: V3): V3 => [hip[0] + 0.2, hip[1] + SH_UP - 0.43, hip[2] - SH_SIDE + 0.045];

/**
 * B04 track on the composition clock G (SH09 G765-822), from the shot block: `suspicious`, head turned down-left toward the radio
 * L5-57 (G770-822); the left hand leaves the thigh L9 (G774), reaches L9-28, touches the button L29 (G794), presses to L39 (G804),
 * returns L40-56 (G805-821); the upper body leans 10 deg forward and 8 deg toward -z with the reach and back with the return; the
 * right hand stays on the right thigh. `press` 0..1 is the button travel; `light` the radio screen (20 % flicker G797-798 and G800,
 * dead from G801). Returns the state and the measured reach (fingertip distance from the leaned shoulder to the button).
 */
export const B04_DRIVER = (G: number, button: V3): {s: DriverState; press: number; light: number; reach: {dist: number; max: number; lean: number}} => {
  const out = span(G, 774, 793), back = span(G, 805, 821), u = out * (1 - back);
  const lean = G < 805 ? span(G, 774, 790) : 1 - span(G, 805, 819);
  const hip = DRIVER_HIP, sh = leftShoulderW(hip, 10 * lean, 8 * lean);
  // the fingertip lands on the button: the wrist stops one hand length short of it on the shoulder-button line
  const shFull = leftShoulderW(hip, 10, 8), tipDir = sub3(button, shFull), tl = len3(tipDir);
  const W1 = sub3(button, mul3(tipDir, HAND / tl)), W0 = THIGH_L(hip);
  const press = G < 794 ? 0 : G <= 804 ? Math.min(1, (G - 793) / 3) : 0;
  // press: the wrist goes 4 mm further in while the button travels
  const W = add3(add3(add3(W0, mul3(sub3(W1, W0), u)), [0, 0.05 * Math.sin(Math.PI * u), 0]), mul3(tipDir, (0.004 * press) / tl));
  const arm = reachArm(sh, W, [0, -1, -0.6]);
  const head = span(G, 770, 777);
  const light = G === 797 || G === 798 || G === 800 ? 0.2 : 0;
  const s: DriverState = {face: 'suspicious', hands: HANDS.thighs, headYaw: -0.32 * head, headTilt: -0.14 * head, lift: -0.012 * lean,
    ...(u > 0.001 ? {reachL: {wrist: arm.wrist, elbow: arm.elbow}} : {})};
  return {s, press, light, reach: {dist: len3(sub3(button, shFull)), max: 2 * BONE + HAND, lean}};
};

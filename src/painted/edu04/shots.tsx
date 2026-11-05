import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type Brush, type PaintContext} from '../BrushCanvas';
import type {FigAnchors} from '../kit/cast';
import {STILL_CAMERA, type Camera} from '../kit/camera';
import {EXPRESSIONS} from '../kit/expressions';
import {makePainter, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {Grain} from '../kit/screen';
import {camPoint, camUnit, mixYCam, orbitYCam, type YCam} from '../kit/ycam';
import {span} from '../sea';
import {b01Cast, paintCheckout, type Light, type Who} from './checkout';
import {PAPER} from './look';
import {paintPlan, PAPER_PLAN, planPush, type PlanState} from './plan';
import {FractionLockup, ModelEyebrow, YouTag} from './plan-labels';
import {paintCoinPurse, paintCoins, paintPineapple, TitleStrip} from './props';

// EDU-EP04-SHORT shot plates (Boss W5.2; scene sheets EDU-EP04-SHEETS-R1 under brief EDU-BRIEF-R1.1).
// One entry per timeline scene: its length (30 fps) and a painter that is a pure function of the shot-local frame `f`, so the Editor
// mounts `plateOf(id, f)` in a registry adapter and every frame is seekable. The 2D plate camera is `STILL_CAMERA`: every move is the
// world camera's (painted 3D camera). Nothing here draws captions, narration, sound or the channel mark.
// Shot groups (sheet "Boss and Editor handoff"): G1 store B01-B02 + B03-SH01 (built, W5.2); G2 `PLAN`; G3 store B04 + memory; G4 refit.
// Shots of the groups not built yet render an empty paper plate (`BUILT[id] === false`) so the composition validates and seeks.

export const EDU4_SHOTS = [
  ['S01-B01-SH01', 56], ['S01-B01-SH02', 65], ['S01-B02-SH01', 50], ['S01-B02-SH02', 62], ['S01-B02-SH03', 36], ['S01-B02-SH04', 42],
  ['S01-B03-SH01', 49], ['S01-B03-SH02', 36], ['S01-B03-SH03', 158], ['S01-B03-SH04', 104], ['S01-B03-SH05', 87],
  ['S01-B04-SH01', 55], ['S01-B04-SH02', 87], ['S01-B04-SH03', 67], ['S01-B04-SH04', 70],
  ['S01-B05-SH01', 125], ['S01-B05-SH02', 107],
  ['S01-B06-SH01', 85], ['S01-B06-SH02', 179], ['S01-B06-SH03', 137],
] as const satisfies readonly (readonly [string, number])[];
export type Edu4ShotId = (typeof EDU4_SHOTS)[number][0];
export const EDU4_FRAMES = Object.fromEntries(EDU4_SHOTS) as Record<Edu4ShotId, number>;
export const EDU4_TOTAL = EDU4_SHOTS.reduce((a, [, n]) => a + n, 0);
/** G1 and G2 plates are built; the others are placeholders until their group. */
export const G1: readonly Edu4ShotId[] = ['S01-B01-SH01', 'S01-B01-SH02', 'S01-B02-SH01', 'S01-B02-SH02', 'S01-B02-SH03', 'S01-B02-SH04', 'S01-B03-SH01'];
/** G2: the `PLAN` diagram shots (S01-B03-SH02..SH05). */
export const G2: readonly Edu4ShotId[] = ['S01-B03-SH02', 'S01-B03-SH03', 'S01-B03-SH04', 'S01-B03-SH05'];
export const isPlan = (id: Edu4ShotId) => G2.includes(id);
export const isBuilt = (id: Edu4ShotId) => G1.includes(id) || G2.includes(id);

const FPS = 30;
const DEG = Math.PI / 180;
export const GRADE = 'radial-gradient(ellipse 95% 75% at 50% 42%, rgba(255,255,255,0) 58%, rgba(60,70,80,0.20) 100%)';
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const inOut = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(u));
const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const mix3 = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
/** 1 on frames [a, b), eased over 2 frames at each edge (a glance, a flash). */
const pulse = (f: number, a: number, b: number) => clamp01(Math.min(f - a + 1, b - f) / 2);

/** Sheet camera `cam: <target>, yaw a, r, eye, pitch, f, hy, cx` as a kit yaw camera (`orbitYCam`: the sheet's yaw is the orbit azimuth). */
const orbit = (at: V3, az: number, r: number, eye: number, f: number, hy: number, pitch = 0, cx = 0): YCam => ({...orbitYCam(at, r, az * DEG, eye, f, hy), ...(pitch ? {pitch: pitch * DEG} : {}), ...(cx ? {cx} : {})});

// ---- Cameras (sheet blocks; SD01 LF01 v2, SD03, SD05, SD06)
const T_MAN: V3 = [0, 1.55, -1.3];
const b01sh01Cam = (f: number): YCam => { const e = inOut(f / 55); return orbit(T_MAN, mix(-6, -4, e), mix(3.8, 3.5, e), 1.9, 860, 790, -6, -90); };
const b01sh02Cam = (f: number): YCam => orbit(T_MAN, -15, mix(1.4, 1.25, f / 64), 1.55, 1100, 760);
// SD10: the sheet's `T-LANES (0 -> -1.2, 1.20, -2.00), yaw -35 -> -45, r 3.0, eye 1.45` (its `meas` MAN x 705 -> 211 reproduce) puts the lens at
// x -1.7 .. -3.3, z +0.5: the lane-1 till and register (start) and `man-buzz` at lane 1 S1 (from L 15) stand between it and MAN, who is hidden
// for most of the shot. Same idea (MAN crosses to lane 1, floor stripe amber -> teal), re-solved from the lane axis, higher: see build-notes.
/** Camera at `pos` looking at the world point `at` (yaw only; `pitch` degrees, + up). */
const lookAt = (pos: V3, at: V3, f: number, hy: number, pitch = 0): YCam => ({x: pos[0], y: pos[1], z: pos[2], yaw: -Math.atan2(pos[0] - at[0], pos[2] - at[2]), f, hy, ...(pitch ? {pitch: pitch * DEG} : {})});
const b02sh01Cam = (f: number): YCam => { const e = inOut(f / 49); return orbit(mix3([0, 1.4, -2], [-1.2, 1.4, -2], e), mix(-35, -45, e), 3.0, 2.5, 1000, 520, -10); };
const b02sh02Cam = (f: number): YCam => { const u = f / 61; return orbit([-1.3, 1.3, -1.2], mix(0, 4, u), mix(3.4, 3.2, u), 1.4, 1200, 600); };
// SD09: the sheet's `T-GAG (2.55, 1.00, -1.60), yaw +21.5, r 1.9, cx +150` puts the counter-side elder off the left edge (head x -150) and does not reproduce its
// own `meas` (elder head 249, coins 560/882, spiky 602, MAN 757). Re-solved to those numbers: target (2.0, 1.0, -1.4), az 35, r 2.3 -> 2.2, cx 0.
const b02sh03Cam = (f: number): YCam => orbit([2.0, 1.0, -1.4], 35, mix(2.3, 2.2, f / 35), 1.2, 1000, 540);
const b02sh04Cam = (f: number): YCam => { const u = f / 41; return orbit([2.2, 1.55, -2.2], mix(60, 55, u), mix(2.3, 2.1, u), 1.55, 1100, 700); };
/** S01-B03-SH01 crane: SH04's end camera to the top-down `PLAN` pose over L 0-34, ease in-out (SD06). */
const CRANE_END: YCam = {x: 0, y: 3.0, z: 0.4, yaw: 0, pitch: -70 * DEG, f: 475, hy: 720};
const b03sh01Cam = (f: number): YCam => mixYCam(b02sh04Cam(41), CRANE_END, inOut(f / 34));
export const CAMS: Partial<Record<Edu4ShotId, (f: number) => YCam>> = {
  'S01-B01-SH01': b01sh01Cam, 'S01-B01-SH02': b01sh02Cam, 'S01-B02-SH01': b02sh01Cam, 'S01-B02-SH02': b02sh02Cam, 'S01-B02-SH03': b02sh03Cam,
  'S01-B02-SH04': b02sh04Cam, 'S01-B03-SH01': b03sh01Cam,
};

// ---- Cast
type Patch = Partial<Who> | null;
/** The B01 cast with per-key patches (`null` removes a figure). */
const cast = (patch: Record<string, Patch>, man: Partial<Who> = {}): Who[] =>
  b01Cast(man).flatMap((w) => { const q = patch[w.key]; return q === null ? [] : [q ? {...w, ...q} : w]; });
const L1 = (z: number): V3 => [-2.2, 0, z];
const L2 = (z: number): V3 => [0, 0, z];
const L3 = (z: number): V3 => [2.2, 0, z];

// Slots after the B02 shuffles (SD02): lane 1 (pixie, girl), lane 2 (elder, shaved, curly), lane 3 (spiky, welder).
const step = (z0: number, z1: number, f: number, a: number, b = a + 12) => mix(z0, z1, inOut(prog(f, a, b)));

/** MAN's B02-SH01 path (sheet: squeezes past `man-elder` around the lane-1 counter tail), waypoints at frames. */
const MAN_PATH: [number, V3][] = [[2, [0, 0, -1.3]], [16, [-0.3, 0, -2.55]], [30, [-1.8, 0, -2.6]], [40, [-2.1, 0, -2.3]]];
const pathAt = (f: number): {at: V3; dir: [number, number]; len: number} => {
  const first = MAN_PATH[0], last = MAN_PATH[MAN_PATH.length - 1];
  if (f <= first[0]) return {at: first[1], dir: [0, 1], len: 0};
  const lens = MAN_PATH.slice(1).map(([, v], i) => Math.hypot(v[0] - MAN_PATH[i][1][0], v[2] - MAN_PATH[i][1][2]));
  const total = lens.reduce((a, b) => a + b, 0), k = easeOut(prog(f, first[0], last[0])) * total;
  let acc = 0;
  for (let i = 0; i < lens.length; i++) {
    if (k <= acc + lens[i] || i === lens.length - 1) {
      const u = clamp01((k - acc) / lens[i]), a = MAN_PATH[i][1], b = MAN_PATH[i + 1][1];
      const dx = b[0] - a[0], dz = b[2] - a[2];
      return {at: [mix(a[0], b[0], u), 0, mix(a[2], b[2], u)], dir: [dx, dz], len: k};
    }
    acc += lens[i];
  }
  return {at: last[1], dir: [0, 1], len: total};
};

const FACE_SUSP = EXPRESSIONS.suspicious;

// ---- S01-B01-SH01 (56 f): LF01 v2 queue at opening size. Eye darts to lane 1 L 10-16 and L 30-36.
const b01sh01 = (f: number) => {
  const g = pulse(f, 10, 16) + pulse(f, 30, 36);
  return {cam: b01sh01Cam(f), who: cast({}, {face: 'suspicious', look: [-0.3 - 0.6 * Math.min(1, g), 0], headCock: -4}), lights: {}};
};

// ---- S01-B01-SH02 (65 f): close on MAN; the squint deepens L 10-30 (brow lower, headCock -4 -> -7). Title strip is an overlay.
const b01sh02 = (f: number) => {
  const d = inOut(prog(f, 10, 30));
  const faceState = {...FACE_SUSP, look: [-0.3, 0] as [number, number], squint: mix(0.3, 0.62, d)};
  return {cam: b01sh02Cam(f), who: cast({}, {faceState, headCock: mix(-4, -7, d)}), lights: {}};
};

// ---- S01-B02-SH01 (50 f): lane-1 shuffle, MAN slides across to lane 1; sly grin L 40-50.
const b02sh01 = (f: number) => {
  const m = pathAt(f), walking = f > 2 && f < 41, grin = prog(f, 38, 46);
  const faceState = {...FACE_SUSP, look: [-0.9, 0] as [number, number], ...(grin > 0.5 ? {mouth: 'smile' as const, squint: 0.4} : {})};
  const man: Partial<Who> = {
    at: m.at, faceState, headCock: -4 + 2 * grin, facing: walking ? [Math.sign(m.dir[0]) || 0.3, 0.45] : [0, 1],
    ...(walking ? {fig: {walk: m.len / 1.15, stride: 1}} : {}),
  };
  const who = cast({
    pixie: {at: L1(step(-1.3, -0.85, f, 2))}, girl: {at: [-2.5, 0, step(-2.2, -1.75, f, 2)]}, man,
  });
  return {cam: b02sh01Cam(f), who, lights: {} as Partial<Record<1 | 2 | 3, Light>>};
};

// ---- S01-B02-SH02 (62 f): till-1 price check, lane 1 frozen (CL01); lane 2 advances twice; MAN shock L8, angry L24, glare L50-62.
const PINE_BELT: V3 = [-1.35, 1.03, -0.7];
const PINE_END: V3 = [-0.75, 1.75, -0.3];
const b02sh02 = (f: number) => {
  const cam = b02sh02Cam(f), lift = inOut(prog(f, 0, 8));
  const flash = (f >= 4 && f < 34 && Math.floor((f - 4) / 5) % 2 === 0) ? 'red' : 'off';
  const face = f >= 24 ? 'angry' : f >= 8 ? 'shock' : 'suspicious';
  const glare = prog(f, 50, 58);
  const faceState = {...EXPRESSIONS[face], look: [mix(-0.2, 0.9, glare), 0] as [number, number]};
  // Sheet: CSH1's right hand lifts the pineapple from the belt (-1.35, 0.90, -0.45) to (-0.75, 1.75, -0.30) over L 0-8 and holds it high.
  // The kit P07 profile hand tops out at chin height, so the raised arm is an explicit target: the hand grips the pineapple's upper side, the
  // elbow solves to the bone length (0.26 m) bent down and back (screen right, CSH1 faces screen left).
  const csh = [-0.55, 1.44, -0.2] as V3, uc = camUnit(cam, [-0.55, 0, -0.2]);
  const pineAt = (): [number, number] => {
    const belt = camPoint(cam, PINE_BELT) ?? [0, 0] as [number, number], end = camPoint(cam, PINE_END) ?? [0, 0] as [number, number];
    return [mix(belt[0], end[0], lift), mix(belt[1], end[1], lift)];
  };
  const sh = camPoint(cam, csh) ?? [0, 0] as [number, number], pa = pineAt();
  const hand: [number, number] = [pa[0] + 0.07 * uc, pa[1] - 0.09 * uc];
  const d = Math.hypot(hand[0] - sh[0], hand[1] - sh[1]), mid: [number, number] = [(hand[0] + sh[0]) / 2, (hand[1] + sh[1]) / 2];
  const hh = Math.sqrt(Math.max(0, (0.26 * uc) ** 2 - (d / 2) ** 2)), nx = -(hand[1] - sh[1]) / (d || 1), ny = (hand[0] - sh[0]) / (d || 1);
  const sgn = nx > 0 ? 1 : -1; // elbow toward screen right
  const rArm = {to: hand, via: [mid[0] + sgn * nx * hh, mid[1] + sgn * ny * hh] as [number, number]};
  const held: Who['held'] = (p, _a, u) => { paintPineapple(p, pa, u); };
  const who = cast({
    csh1: {pose: 'P01', fig: {rArm}, held},
    buzz: {pose: 'P25'}, pixie: {at: L1(-0.85)}, girl: {at: [-2.5, 0, -1.75]},
    elder: {at: L2(step(step(-2.2, -1.3, f, 6, 18), -0.4, f, 30, 42))}, shaved: {at: L2(step(-4.0, -2.2, f, 6, 42))},
    curly: {at: [mix(2.2, 0, inOut(prog(f, 10, 40))), 0, mix(-2.2, -3.1, inOut(prog(f, 10, 40)))] as V3},
    man: {at: [-2.1, 0, -2.3], faceState, headCock: -4, facing: [glare > 0.5 ? 1 : 0.2, 1]},
  });
  return {cam, who, lights: {1: flash} as Partial<Record<1 | 2 | 3, Light>>};
};

// ---- S01-B02-SH03 (36 f): silent coin gag. MAN whooshes in, leans past `man-spiky`; `woman-elder` counts coins onto the counter.
const COIN_AT: V3 = [2.78, 0.88, -0.35], COIN_FRAMES = [8, 15, 22, 29];
const b02sh03 = (f: number) => {
  const cam = b02sh03Cam(f), arrive = easeOut(prog(f, 0, 6)), lean = inOut(prog(f, 6, 10));
  const n = COIN_FRAMES.filter((c) => f >= c).length;
  // `new: coin-count motion`: every 7 f the hand dips from the purse to the counter (one coin per dip)
  const dip = inOut(Math.max(0, 1 - Math.abs(((f - 1) % 7) - 3.5) / 3.5));
  const welder: Partial<Who> = {
    pose: 'P01', mix: {to: 'P25', u: 1}, at: L3(-0.4), face: 'neutral', facing: [0, 1],
    held: (p, a, u) => paintCoinPurse(p, [a.lHand[0] - 0.02 * u, a.lHand[1] + 0.03 * u], u),
    fig: {rise: 0.01 * dip},
  };
  const man: Partial<Who> = {
    at: [mix(-1.6, 2.2 + 0.2 * lean, arrive), 0, -2.2], facing: [0, 1], faceState: {...EXPRESSIONS[f >= 8 ? 'shock' : 'suspicious'], look: [0.6, 0]},
    fig: {lean: 0.14 * lean}, headCock: 6 * lean,
  };
  const who = cast({
    pixie: {at: L1(-0.85)}, girl: {at: [-2.5, 0, -1.75]}, buzz: {pose: 'P25'},
    elder: {at: L2(-0.4)}, shaved: {at: L2(-2.2)}, curly: {at: L2(-3.1)},
    spiky: {at: L3(-1.3)}, welder, man,
  });
  const coins = {at: COIN_AT, draw: (p: Painter, c: YCam) => paintCoins(p, c, COIN_AT, n)};
  return {cam, who, lights: {1: 'green'} as Partial<Record<1 | 2 | 3, Light>>, items: [coins]};
};

// ---- S01-B02-SH04 (42 f): "อ้าว…": MAN turns to the camera and sulks; lanes 1 and 2 move one step each at L 10-22.
const b02sh04Who = (f: number): Who[] => {
  const turn = inOut(prog(f, 0, 14));
  const dir: [number, number] = [mix(0.8, 0, turn), 1]; // facing +z at L0, squared to the lens by L14
  const man: Partial<Who> = {at: [2.2, 0, -2.2], faceState: {...EXPRESSIONS.sad, look: [0, 0.3]}, facing: turn >= 1 ? undefined : dir, view: 'front', fig: {rise: -0.02 * turn}};
  return cast({
    pixie: {at: L1(step(-0.85, -0.4, f, 10, 22)), pose: 'P25'}, girl: {at: [-2.5, 0, step(-1.75, -1.3, f, 10, 22)]}, buzz: null,
    elder: {at: L2(-0.4), pose: 'P25'}, shaved: {at: L2(step(-2.2, -1.3, f, 10, 22))}, curly: {at: L2(step(-3.1, -2.2, f, 10, 22))},
    spiky: {at: L3(-1.3)}, welder: {at: L3(-0.4)}, man,
  });
};
const b02sh04 = (f: number) => ({cam: b02sh04Cam(f), who: b02sh04Who(f), lights: {1: 'green'} as Partial<Record<1 | 2 | 3, Light>>});

// ---- S01-B03-SH01 (49 f): freeze at SH04's last pose, crane up over L 0-34, dissolve to `PLAN` L 34-49 (SD06). Ambient clock stopped (fixed t).
export const B03SH01_DISSOLVE = {from: 34, frames: 15};

type Spec = {cam: YCam; who: Who[]; lights: Partial<Record<1 | 2 | 3, Light>>; items?: {at: V3; draw: (p: Painter, c: YCam) => void}[]; t?: number};
const SPECS: Record<string, (f: number) => Spec> = {
  'S01-B01-SH01': b01sh01, 'S01-B01-SH02': b01sh02, 'S01-B02-SH01': b02sh01, 'S01-B02-SH02': b02sh02, 'S01-B02-SH03': b02sh03, 'S01-B02-SH04': b02sh04,
  'S01-B03-SH01': (f) => ({cam: b03sh01Cam(f), who: b02sh04Who(41), lights: {1: 'green'}, t: 41 / FPS}),
};

// ---- G2 `PLAN` shots (S01-B03-SH02..SH05): fixed plane in plan px (130 px/m), picture push scale 1.00 -> 1.02 -> 1.05 about (540, 560).
export type PlanLabels = {equal: number; fracs: {text: string; x: number; op: number}[]; tag?: {x: number; y: number; op: number}};
type PlanSpec = {state: PlanState; labels: PlanLabels};
const HOP = {from: 33, to: 45, apex: 520, slide: 47};
const planSpec = (id: Edu4ShotId, f: number): PlanSpec => {
  const t = f / FPS;
  if (id === 'S01-B03-SH02') {
    const state: PlanState = {lit: [1, 2, 3], manLane: 2, t, scale: 1 + 0.02 * (f / 35), inkIn: [prog(f, 2, 8), prog(f, 8, 14), prog(f, 14, 20)]};
    return {state, labels: {equal: prog(f, 4, 10), fracs: []}};
  }
  if (id === 'S01-B03-SH03') {
    const lit = f < 22 ? [1, 2, 3] : f < 92 ? [2] : f < 140 ? [1, 3] : [2];
    const state: PlanState = {lit: lit as (1 | 2 | 3)[], manLane: 2, t, glow: f >= 22 && f < 140 || f >= 140, scale: 1.02 + 0.03 * (f / 157)};
    const one = Math.min(prog(f, 61, 65), 1 - prog(f, 92, 98)) + prog(f, 140, 146), two = Math.min(prog(f, 92, 98), 1 - prog(f, 140, 146));
    const man = planPush(state, [540, 586]);
    return {state, labels: {equal: 0, fracs: [{text: '1/3', x: 540, op: Math.min(1, one)}, {text: '2/3', x: 540, op: two}], tag: f >= 22 ? {x: man[0] - 40 * (state.scale ?? 1), y: man[1], op: prog(f, 22, 26)} : undefined}};
  }
  // SH04 hop and SH05 caveat: SH04 end state held
  const hopU = id === 'S01-B03-SH04' ? inOut(prog(f, HOP.from, HOP.to)) : 1, landed = hopU >= 1;
  const dot: [number, number] = [mix(540, 826, hopU), 586 - (586 - HOP.apex) * Math.sin(Math.PI * hopU)];
  const hopping = id !== 'S01-B03-SH04' || f >= HOP.from;
  const state: PlanState = {
    lit: hopping && f >= (id === 'S01-B03-SH04' ? 39 : 0) ? [3] : [2], manLane: 2, t, glow: true, scale: 1.05, dx: id === 'S01-B03-SH04' ? (10 * f) / 103 : 10,
    ...(hopping ? {man: dot, plain2: id === 'S01-B03-SH04' ? prog(f, HOP.from, HOP.from + 6) : 1, plain3: id === 'S01-B03-SH04' ? 1 - prog(f, 42, 48) : 0} : {}),
    ...(id === 'S01-B03-SH05' ? {wobble: 6 * Math.min(prog(f, 6, 10), 1 - prog(f, 38, 42)), wobblePhase: (2 * Math.PI * 2 * (f - 6)) / 36, sign: prog(f, 54, 60), trolley: prog(f, 64, 70)} : {}),
  };
  const lx = id === 'S01-B03-SH04' ? mix(540, 826, inOut(prog(f, HOP.from, HOP.slide))) : 826, pos = planPush(state, hopping ? dot : [540, 586]);
  void landed;
  return {state, labels: {equal: 0, fracs: [{text: '1/3', x: lx, op: 1}], tag: {x: pos[0] - 40 * 1.05, y: pos[1], op: 1}}};
};
export const planLabelsOf = (id: Edu4ShotId, f: number): PlanLabels | null => (isPlan(id) ? planSpec(id, Math.max(0, Math.min(EDU4_FRAMES[id] - 1, f))).labels : null);

/** Screen text of the `PLAN` shots (Thai type is rendered, never painted): "ถ้าทุกแถวเท่ากัน" (L07), the fraction + "แบบจำลอง" lockup, the "คุณ" tag. */
export const PlanText = ({labels}: {labels: PlanLabels}) => (
  <>
    <ModelEyebrow />
    {labels.equal > 0 && <div lang="th" style={{position: 'absolute', left: 0, width: 1080, top: 900, textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 92, lineHeight: 1.1, color: '#2b211c', opacity: labels.equal}}>ถ้าทุกแถวเท่ากัน</div>}
    {labels.fracs.filter((q) => q.op > 0).map((q) => <div key={q.text} style={{position: 'absolute', inset: 0, opacity: q.op}}><FractionLockup frac={q.text} x={Math.min(q.x, 1080 - 40 - 330 + 120)} /></div>)}
    {labels.tag && <div style={{position: 'absolute', inset: 0, opacity: labels.tag.op}}><YouTag x={labels.tag.x} y={labels.tag.y} /></div>}
  </>
);

export type Edu4Plate = {cam: Camera; ycam?: YCam; paper: string; grade: string; built: boolean; paint: (p: Painter) => void; title?: number; gradeOpacity: number; labels?: PlanLabels};

/** Title strip wipe (S01-B01-SH02, VD16): wipes in L 0-6, holds, wipes out L 58-64 (strip off by the cut). */
export const titleWipe = (id: Edu4ShotId, f: number) => (id === 'S01-B01-SH02' ? Math.min(prog(f, 0, 6), 1 - prog(f, 58, 64)) : 0);

/** The plate of one shot at shot-local frame `f` (held in the shot's own range). */
export const plateOf = (id: Edu4ShotId, f: number): Edu4Plate => {
  const fr = Math.max(0, Math.min(EDU4_FRAMES[id] - 1, f));
  if (!isBuilt(id)) return {cam: STILL_CAMERA, paper: PAPER, grade: 'none', built: false, gradeOpacity: 0, paint: () => {}};
  if (isPlan(id)) {
    const ps = planSpec(id, fr);
    return {cam: STILL_CAMERA, paper: PAPER_PLAN, grade: 'none', built: true, gradeOpacity: 0, labels: ps.labels, paint: (p) => paintPlan(p, ps.state)};
  }
  const s = SPECS[id](fr);
  if (id === 'S01-B03-SH01') {
    const d = B03SH01_DISSOLVE, u = prog(fr, d.from - 1, d.from + d.frames), t = s.t ?? fr / FPS;
    return {
      cam: STILL_CAMERA, ycam: s.cam, paper: PAPER, grade: GRADE, built: true, gradeOpacity: 1 - u,
      paint: (p) => {
        paintCheckout(p, s.cam, {t, who: s.who, lights: s.lights});
        if (u > 0) {
          const q = p.layer(u, 41000);
          q.flat(PAPER_PLAN, span(1080, -200, 2120));
          paintPlan(q, {lit: [1, 2, 3], manLane: 2, t});
        }
      },
    };
  }
  return {
    cam: STILL_CAMERA, ycam: s.cam, paper: PAPER, grade: GRADE, built: true, gradeOpacity: 1,
    paint: (p) => paintCheckout(p, s.cam, {t: s.t ?? p.t, who: s.who, lights: s.lights, items: s.items}),
  };
};

/**
 * Measured picture size (px, 1080x1920) of one figure of a G1 frame through the real painter path (a recording brush): `top`/`bottom` = visible
 * figure, `headTop`/`chin` = head (head height = chin - headTop), `x` = head centre. Used for the W5.2 lead measure (H1).
 */
export const measureOf = (id: Edu4ShotId, f: number, key = 'man') => {
  const s = SPECS[id]?.(Math.max(0, Math.min(EDU4_FRAMES[id] - 1, f)));
  if (!s) return null;
  const out: Record<string, FigAnchors> = {};
  const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
  paintCheckout(makePainter(brush, {t: s.t ?? f / FPS, frame: f}), s.cam, {t: s.t ?? f / FPS, who: s.who, lights: s.lights, items: s.items, out});
  const a = out[key];
  return a ? {x: Math.round(a.head[0]), headTop: Math.round(a.headTop), chin: Math.round(a.chin), headPx: Math.round(a.chin - a.headTop), top: Math.round(a.top), bottom: Math.round(a.bottom), bodyPx: Math.round(a.bottom - a.top)} : null;
};

/** Standalone plate (stills and QA; the timeline uses a registry adapter over `plateOf` on PaintedStage's one canvas). */
export const ShotPlate = ({id}: {id: Edu4ShotId}) => {
  const frame = useCurrentFrame();
  const fn = useCallback(({brush, frame: fr}: PaintContext) => plateOf(id, fr).paint(makePainter(brush, {t: fr / FPS, frame: fr, fade: PAPER})), [id]);
  const plate = plateOf(id, frame), wipe = titleWipe(id, frame);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      {plate.gradeOpacity > 0 && <AbsoluteFill style={{pointerEvents: 'none', background: plate.grade, opacity: plate.gradeOpacity}} />}
      {wipe > 0 && <TitleStrip wipe={wipe} />}
      {plate.labels && <PlanText labels={plate.labels} />}
      <Grain opacity={0.09} />
    </AbsoluteFill>
  );
};

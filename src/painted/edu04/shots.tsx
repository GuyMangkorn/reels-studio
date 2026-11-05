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
import {b01Cast, b06Cast, CONTENT, paintCheckout, type Light, type Who} from './checkout';
import {PAPER} from './look';
import {paintPlan, PAPER_PLAN, planPush, type PlanState} from './plan';
import {FractionLockup, ModelEyebrow, YouTag} from './plan-labels';
import {glaze} from '../kit/draw';
import {CSH2, MAN} from './cast';
import {paintBasket} from './checkout';
import {paintHotBubble, paintPaleBubble} from './bubbles';
import {paintWho} from './checkout';
import {paintCoinPurse, paintCoins, paintPineapple, paintTally, StampText, TitleStrip} from './props';

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
/** G1-G3 plates are built; the others are placeholders until their group. */
export const G1: readonly Edu4ShotId[] = ['S01-B01-SH01', 'S01-B01-SH02', 'S01-B02-SH01', 'S01-B02-SH02', 'S01-B02-SH03', 'S01-B02-SH04', 'S01-B03-SH01'];
/** G2: the `PLAN` diagram shots (S01-B03-SH02..SH05). */
export const G2: readonly Edu4ShotId[] = ['S01-B03-SH02', 'S01-B03-SH03', 'S01-B03-SH04', 'S01-B03-SH05'];
export const isPlan = (id: Edu4ShotId) => G2.includes(id);
/** G3: store B04 (neck craned, eyes track lane 3, tallies, his own overtake) and B05 (memory bubbles, stamp + crack). */
export const G3: readonly Edu4ShotId[] = ['S01-B04-SH01', 'S01-B04-SH02', 'S01-B04-SH03', 'S01-B04-SH04', 'S01-B05-SH01', 'S01-B05-SH02'];
/** G4: the refit B06 (LF04 v2 shared queue, calm, walk to till 2). */
export const G4: readonly Edu4ShotId[] = ['S01-B06-SH01', 'S01-B06-SH02', 'S01-B06-SH03'];
export const isBuilt = (id: Edu4ShotId) => G1.includes(id) || G2.includes(id) || G3.includes(id) || G4.includes(id);

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

// ---- G3 store B04 (SD04, SD05): MAN back at lane 2 S4, head turned to lane 3; B05 on the LF03 / memory set (cream veil, MAN alone).
const MAN_S4: V3 = [0, 0, -3.1];
const T_S4: V3 = [0, 1.55, -3.1];
const b04sh01Cam = (f: number): YCam => { const e = inOut(f / 54); return orbit(T_S4, mix(25, 18, e), mix(2.0, 1.8, e), 1.5, 1050, 640); };
const b04sh02Cam = (f: number): YCam => orbit(T_S4, 10, mix(1.05, 0.95, f / 86), 1.55, 1150, 720);
const b04sh03Cam = (f: number): YCam => orbit(T_S4, mix(-30, -36, f / 66), 1.8, 1.5, 900, 680, 0, -220);
const T_S3: V3 = [0, 1.55, -2.65];
const b04sh04Cam = (f: number): YCam => orbit(T_S3, mix(30, 36, f / 69), 2.1, 1.5, 900, 680, 0, 200);
const T_B05: V3 = [0, 1.55, -2.2];
const b05sh01Cam = (f: number): YCam => { const e = inOut(f / 124); return orbit(T_B05, mix(-10, -4, e), mix(1.5, 1.4, e), 1.5, 1100, 1000); };
const b05sh02Cam = (f: number): YCam => orbit(T_B05, 0, mix(1.3, 1.2, f / 106), 1.55, 1100, 860);
Object.assign(CAMS, {'S01-B04-SH01': b04sh01Cam, 'S01-B04-SH02': b04sh02Cam, 'S01-B04-SH03': b04sh03Cam, 'S01-B04-SH04': b04sh04Cam, 'S01-B05-SH01': b05sh01Cam, 'S01-B05-SH02': b05sh02Cam});

/** Lane 3 walkers of S01-B04-SH03: constant 0.075 m/f (0.9 m per 12 f), head crossing z -3.10 at L 12 / 30 / 48; the queue ahead of each opens. */
const WALK = [{id: 'spiky', cross: 12, z0: -3.9, z1: -0.5}, {id: 'curly', cross: 30, z0: -4.8, z1: -1.4}, {id: 'buzz', cross: 48, z0: -5.7, z1: -2.3}] as const;
const walkerZ = (w: (typeof WALK)[number], f: number) => Math.max(w.z0, Math.min(w.z1, -3.1 + 0.075 * (f - w.cross)));
const walkersAt = (f: number): Record<string, Partial<Who>> => Object.fromEntries(WALK.map((w) => {
  const z = walkerZ(w, f), moving = z > w.z0 + 1e-6 && z < w.z1 - 1e-6;
  return [w.id, {at: [2.2, 0, z] as V3, facing: [0, 1] as [number, number], ...(moving ? {fig: {walk: (z - w.z0) / 1.15, stride: 1}} : {})}];
}));

const b04Cast = (patch: Record<string, Patch>, man: Partial<Who>): Who[] => {
  const base = cast({
    pixie: {at: L1(-2.65), facing: [0, 1], pose: 'P01'}, girl: {at: [-2.75, 0, -2.65], facing: [0, 1]}, welder: null,
    elder: {at: L2(-0.4), pose: 'P25'}, shaved: {at: L2(-1.3)},
    spiky: {at: L3(-2.2), facing: [0, 1]}, curly: {at: L3(-3.1), facing: [0, 1]}, buzz: {at: L3(-4.0), facing: [0, 1]},
    ...patch,
  }, {facing: [0, 1], ...man});
  return base;
};
const b04LookTrack = (f: number) => {
  const base = f < 36 ? 0.4 : mix(0.4, 0.9, prog(f, 36, 84));
  const re = -0.14 * pulse(f, 50, 53) - 0.14 * pulse(f, 66, 69); // two small re-catches
  return [base + re, f < 36 ? 0 : mix(0, 0.05, prog(f, 36, 84))] as [number, number];
};
const b04sh01 = (f: number) => {
  const e = inOut(prog(f, 0, 20));
  return {cam: b04sh01Cam(f), lights: {1: 'off', 2: 'off', 3: 'off'} as Partial<Record<1 | 2 | 3, Light>>,
    who: b04Cast({}, {at: MAN_S4, pose: 'P30', face: 'suspicious', look: [0.4, 0], headCock: 6, fig: {lean: 0.05 * e}})};
};
const b04sh02 = (f: number) => ({
  cam: b04sh02Cam(f), lights: {} as Partial<Record<1 | 2 | 3, Light>>,
  who: b04Cast({}, {at: MAN_S4, pose: 'P30', mix: {to: 'P01' as const, u: inOut(prog(f, 0, 8))}, face: 'suspicious', look: b04LookTrack(f), headCock: 6, fig: {lean: 0.05}}),
});
const TALLY = [14, 32, 50];
/** Red chalk tally above MAN's head (screen space): strokes drawn on over 4 f at the given frames; `x` follows his head. */
const tallyAt = (p: Painter, cam: YCam, f: number, manAt: V3) => {
  const n = TALLY.filter((a) => f >= a).length;
  if (n === 0) return;
  const g = camPoint(cam, [manAt[0], 2.1, manAt[2]]);
  const last = TALLY[n - 1], part = prog(f, last, last + 4);
  paintTally(p, n, (g ? g[0] : 540) - 1.5 * 38, 290, 38, 8100, part);
};
const b04sh03 = (f: number) => {
  const cam = b04sh03Cam(f);
  const face = f >= 32 ? 'angry' : 'suspicious';
  // eyes follow the walker in transit: right (toward lane 3) as it arrives, sweeping to the centre as it passes
  const near = WALK.reduce((a, w) => (Math.abs(f - w.cross) < Math.abs(f - a.cross) ? w : a), WALK[0]);
  const lk: [number, number] = [mix(0.95, 0.5, inOut(prog(f, near.cross - 10, near.cross + 12))), 0];
  return {cam, lights: {} as Partial<Record<1 | 2 | 3, Light>>, post: (p: Painter) => tallyAt(p, cam, f, MAN_S4),
    who: b04Cast(walkersAt(f), {at: MAN_S4, pose: 'P01', face, look: lk, headCock: 6})};
};
const b04sh04 = (f: number) => {
  const cam = b04sh04Cam(f), z = mix(-3.1, -2.2, inOut(prog(f, 8, 20)));
  const at: V3 = [0, 0, z];
  const walkQ: Record<string, Partial<Who>> = Object.fromEntries(WALK.map((w) => [w.id, {at: [2.2, 0, w.z1] as V3, facing: [0, 1] as [number, number]}]));
  return {cam, lights: {} as Partial<Record<1 | 2 | 3, Light>>, post: (p: Painter) => tallyAt(p, cam, 99, at),
    who: b04Cast({...walkQ, shaved: null}, {at, pose: 'P01', face: 'suspicious', look: [0.8, 0.05], headCock: 6, ...(f >= 8 && f < 20 ? {fig: {walk: (z + 3.1) / 1.15, stride: 0.7}} : {})})};
};
const VEIL = [[-100, -100], [1180, -100], [1180, 2020], [-100, 2020]] as [number, number][];
const b05sh01 = (f: number) => {
  const cam = b05sh01Cam(f), t = f / FPS, heat = prog(f, 62, 70);
  const wince = Math.min(prog(f, 62, 65), 1 - prog(f, 100, 106)); // neutral -> angry over 3 f, hold to L100, back by L106
  const fade = 1 - 0.6 * prog(f, 66, 122);
  return {cam, lights: {} as Partial<Record<1 | 2 | 3, Light>>, veil: true,
    who: [{key: 'man', def: MAN, at: [0, 0, -2.2] as V3, face: 'neutral' as const, look: [0.35, -0.7] as [number, number], headCock: 5, basket: true,
      ...(wince > 0 ? {faceState: {...EXPRESSIONS[wince >= 0.5 ? 'angry' : 'neutral'], browTo: EXPRESSIONS.angry.brow, browMix: wince, look: [0.35, -0.7] as [number, number]}} : {})} as Who],
    post: (p: Painter) => {
      const pop = (a: number) => easeOut(prog(f, a, a + 5));
      if (f >= 8) { const k = pop(8), q = p.layer(Math.min(1, k * 1.5), 42100); paintPaleBubble(q, 800, 500, 205 * (0.55 + 0.45 * k), 190 * (0.55 + 0.45 * k), t, fade, Math.min(3, Math.floor((f - 8) / 3))); }
      if (f >= 14) { const k = pop(14), q = p.layer(Math.min(1, k * 1.5), 42200); paintHotBubble(q, 285, 450, 235 * (0.55 + 0.45 * k), 210 * (0.55 + 0.45 * k), t, Math.min(3, Math.floor((f - 14) / 3)), heat); }
    }};
};
const b05sh02 = (f: number) => {
  const cam = b05sh02Cam(f);
  const up = prog(f, 92, 100), look: [number, number] = [0.1 * (1 - up) + 0.1 * up, -0.9 * up * (1 - prog(f, 100, 104))];
  return {cam, lights: {} as Partial<Record<1 | 2 | 3, Light>>, veil: true,
    who: [{key: 'man', def: MAN, at: [0, 0, -2.2] as V3, face: f >= 96 ? 'neutral' as const : 'sad' as const, look, headCock: 3, basket: true} as Who]};
};
/** Stamp overlay of S01-B05-SH02 (screen layer): thunk-on at L20 (scale 1.3 -> 1.0 over 4 f, rot -6), crack L91-97, halves offset 14 px + 2 deg opposite tilt, dark crack, chips. */
export type StampLayer = {x: number; y: number; scale: number; rot: number; op: number; crack: number; split: number};
export const stampOf = (id: Edu4ShotId, f: number): StampLayer | null => {
  if (id !== 'S01-B05-SH02' || f < 20) return null;
  const k = prog(f, 20, 24);
  return {x: 540, y: 1038, scale: 0.9 * mix(1.3, 1.0, easeOut(k)), rot: -6, op: Math.min(1, (f - 19) / 2), crack: prog(f, 91, 97), split: f >= 97 ? 14 : 0};
};

// ---- G4 refit B06 (LF04 v2): one serpentine feeding three tills. MAN eyes shut and calm at the queue head; SH03 walks to till 2 (SD07, SD08).
const T_HEAD: V3 = [0, 1.55, -3.0];
const b06sh01Cam = (f: number): YCam => { const e = inOut(f / 84); return orbit(T_HEAD, mix(4, 2, e), mix(3.5, 3.2, e), 2.0, 1050, 640, -3); };
const b06sh02Cam = (f: number): YCam => orbit(T_HEAD, mix(-12, -18, f / 178), mix(1.4, 1.25, f / 178), 1.55, 1100, 720);
const TILL2: V3 = [0.2, 1.4, -0.5];
const b06sh03Cam = (f: number): YCam => { const e = 1 - Math.exp((-4.6 * f) / 120), l = Math.min(1, e / 0.99); return orbit(TILL2, mix(-25, -18, l), mix(3.9, 3.6, l), 1.8, 860, 760, -5); };
Object.assign(CAMS, {'S01-B06-SH01': b06sh01Cam, 'S01-B06-SH02': b06sh02Cam, 'S01-B06-SH03': b06sh03Cam});
const GRADE_B06 = `linear-gradient(rgba(255,176,80,0.06), rgba(255,176,80,0.06)), ${GRADE}`; // warmer (-5 % blue)

/** `b06Cast` with the queue one 0.45 m step on (flow along each row: row -3.05 and -5.2 toward +x, row -4.1 toward -x) and per-key patches. */
const b06With = (shuffle: number, patch: Record<string, Patch>): Who[] => {
  const dx: Record<string, number> = {long: 1, pixie: 1, girl: -1, shaved: -1, curly: -1, elder: -1, buzz: 1, welder: 1};
  return b06Cast().flatMap((w) => {
    const q = patch[w.key];
    if (q === null) return [];
    const d = dx[w.key];
    const moved = d && shuffle > 0 ? {at: [w.at[0] + d * 0.45 * shuffle, 0, w.at[2]] as V3, ...(shuffle > 0 && shuffle < 1 ? {fig: {walk: (0.45 * shuffle) / 1.15, stride: 0.6}} : {})} : {};
    return [{...w, ...moved, ...(q ?? {})}];
  });
};
const b06sh01 = (f: number) => ({
  cam: b06sh01Cam(f), lights: {2: 'green'} as Partial<Record<1 | 2 | 3, Light>>, shared: true, grade: GRADE_B06,
  who: b06With(inOut(prog(f, 40, 52)), {man: {headCock: 0}}),
});
const b06sh02 = (f: number) => {
  const eyes = (f < 112 ? 'shut' : f < 116 ? 'half' : 'dot') as 'shut' | 'half' | 'dot', face = {...CONTENT, eyes, mouth: 'smile' as const, open: 0, brow: f >= 116 ? 'up' as const : 'flat' as const};
  const walkU = prog(f, 170, 179), z = mix(-3.05, -2.8, inOut(walkU));
  return {
    cam: b06sh02Cam(f), lights: {2: 'green'} as Partial<Record<1 | 2 | 3, Light>>, shared: true, grade: GRADE_B06,
    who: b06With(1, {man: {faceState: face, basket: f >= 162, pose: 'P44', mix: {to: 'P01' as const, u: inOut(prog(f, 160, 170))}, at: [0, 0, z] as V3,
      fig: {rise: f >= 118 ? mix(0.02, -0.012, inOut(prog(f, 118, 140))) : 0.01, ...(walkU > 0 && walkU < 1 ? {walk: (z + 3.05) / 1.15, stride: 0.7} : {})}}}),
  };
};
const BELT_END: V3 = [0.62, 0.85, -0.65];
const b06sh03 = (f: number) => {
  const cam = b06sh03Cam(f), walkZ = mix(-1.6, -0.4, prog(f, 0, 60)), w = inOut(prog(f, 60, 72)) * (1 - inOut(prog(f, 74, 82)));
  const turn = inOut(prog(f, 60, 68)) * (1 - inOut(prog(f, 80, 92)));
  const B = camPoint(cam, BELT_END) ?? [0, 0] as [number, number], u = camUnit(cam, [0, 0, walkZ]);
  const rest = (dx: number) => camPoint(cam, [dx, 0.85, walkZ]) ?? [0, 0] as [number, number];
  const handArm = (dx: number, off: number) => {
    const r = rest(dx), tgt: [number, number] = [B[0] + off * u, B[1] - 0.04 * u];
    return {to: [mix(r[0], tgt[0], w), mix(r[1], tgt[1], w)] as [number, number]};
  };
  const down = f >= 74;
  const fig = {...(f < 60 ? {walk: (walkZ + 1.6) / 1.15, stride: 1} : {}), ...(w > 0.01 ? {rArm: handArm(-0.22, -0.07), lArm: handArm(0.22, 0.07)} : {})};
  const basketItem = {at: BELT_END, draw: (p: Painter, c: YCam) => { const b = camPoint(c, BELT_END), uu = camUnit(c, BELT_END); if (b) paintBasket(p, [b[0], b[1] - 0.3 * uu], uu, 5900); }};
  const man: Partial<Who> = {at: [0, 0, walkZ] as V3, pose: 'P01', faceState: {...EXPRESSIONS.happy, mouth: 'smile' as const, open: 0, look: [0, 0] as [number, number]}, facing: [0.36 * turn, 1], basket: f < 74, fig};
  const noodle = f >= 95 && f < 125 ? mix(0, 1, inOut(prog(f, 95, 110))) : 0;
  return {
    cam, lights: {2: 'green'} as Partial<Record<1 | 2 | 3, Light>>, shared: true, grade: GRADE_B06, items: down ? [basketItem] : [],
    who: b06With(1, {
      man, long: {at: [0, 0, -2.0] as V3, view: 'front' as const}, pixie: {at: [0, 0, -2.95] as V3, view: 'front' as const},
      csh2: {def: CSH2, at: [1.65, 0, -0.2] as V3, view: 'left' as const, face: f >= 70 ? 'happy' as const : 'neutral' as const, pose: 'P25' as const, fig: noodle ? {lean: 0} : {}},
    }),
  };
};

type Spec = {shared?: boolean; grade?: string; post?: (p: Painter) => void; veil?: boolean; cam: YCam; who: Who[]; lights: Partial<Record<1 | 2 | 3, Light>>; items?: {at: V3; draw: (p: Painter, c: YCam) => void}[]; t?: number};
const SPECS: Record<string, (f: number) => Spec> = {
  'S01-B01-SH01': b01sh01, 'S01-B01-SH02': b01sh02, 'S01-B02-SH01': b02sh01, 'S01-B02-SH02': b02sh02, 'S01-B02-SH03': b02sh03, 'S01-B02-SH04': b02sh04,
  'S01-B03-SH01': (f) => ({cam: b03sh01Cam(f), who: b02sh04Who(41), lights: {1: 'green'}, t: 41 / FPS}),
  'S01-B04-SH01': b04sh01, 'S01-B04-SH02': b04sh02, 'S01-B04-SH03': b04sh03, 'S01-B04-SH04': b04sh04, 'S01-B05-SH01': b05sh01, 'S01-B05-SH02': b05sh02,
  'S01-B06-SH01': b06sh01, 'S01-B06-SH02': b06sh02, 'S01-B06-SH03': b06sh03,
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

export type Edu4Plate = {cam: Camera; ycam?: YCam; paper: string; grade: string; built: boolean; paint: (p: Painter) => void; title?: number; gradeOpacity: number; labels?: PlanLabels; stamp?: StampLayer | null};

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
    cam: STILL_CAMERA, ycam: s.cam, paper: PAPER, grade: s.grade ?? GRADE, built: true, gradeOpacity: 1, stamp: stampOf(id, fr),
    paint: (p) => {
      if (s.veil) {
        // the memory pulls focus (LF03): the set under a cream veil, then MAN, then the bubbles
        paintCheckout(p, s.cam, {t: s.t ?? p.t, who: [], lights: s.lights});
        glaze(p, 7000, '#f1e8d2', 120, VEIL, {border: 0});
        s.who.forEach((w) => paintWho(p, s.cam, w, {t: s.t ?? p.t, who: []}));
      } else paintCheckout(p, s.cam, {t: s.t ?? p.t, who: s.who, lights: s.lights, items: s.items});
      s.post?.(p);
    },
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
      {plate.stamp && <StampText {...plate.stamp} />}
      {plate.labels && <PlanText labels={plate.labels} />}
      <Grain opacity={0.09} />
    </AbsoluteFill>
  );
};

import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {STILL_CAMERA, type Camera} from '../kit/camera';
import {makePainter, ramp, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {camPoint, camUnit, mixYCam, orbitYCam, type YCam} from '../kit/ycam';
import {span} from '../sea';
import {paintDoodle, type Doodle} from './doodles';
import {paintEyeMacro} from './eye';
import {flatFillBrush} from './flat';
import {cupExtent, paintKitchen, SET, T, type CookState, type KitchenMist, type KitchenOpts, type KnifeHold, type OnionPiece} from './kitchen';
import {LF02_CAM, LF03_CAM} from './look';
import {heroExtent, paintCellMacro, type CellState} from './macro';
import {CANDLE} from './props';

// EDU-EP02-SHORT shot plates (Boss W5.2; scene sheets SS-R2 under brief EDU-BRIEF-R1.5, scripts/edu-series/ep02/scenes/).
// One entry per timeline scene: its length, world camera (kit yaw camera inside SET-KITCHEN) and painter as pure functions of
// the shot-local frame `f` (30 fps), so the Editor mounts `plateOf(id, f)` in a registry adapter and every frame is seekable.
// The 2D plate camera is `STILL_CAMERA`: every move is the world camera's (painted 3D camera, no picture push). Nothing here
// draws text; captions, narration, sound and the channel mark belong to the scene sheets and the Editor.
// Group G-A (S01-B01-SH01..SH03, S01-B02-SH01..SH02): N3 chop, N4 halves, N7 droplets (kitchen.ts).
// Group G-B (S01-B03-SH01..SH03): N5 timed cell states in the CELL macro set (macro.ts).
// Group G-C (S01-B04-SH01..SH03): N7 kitchen mist and waterfall tears, N4 slices (kitchen.ts); N6 eye macro (eye.ts).
// Group G-D (S01-B05-SH01..SH05): N8 bread and candle, N2 fridge interior, N4 frosty onion (props.ts); N9 doodles (doodles.ts).
// Group G-E (S01-B06-SH01..SH04): N8 swim goggles (props.ts), N4 half onion cut face down (kitchen.ts `dome`), near-item culling.
// Group G-F (S01-B07-SH01..SH03): N4 O4 cut face up (kitchen.ts `cup`), N9 chalk alarm bell with draw-on and wiggle (doodles.ts `bell`).

export const EDU2_SHOTS = [
  ['S01-B01-SH01', 57],
  ['S01-B01-SH02', 59],
  ['S01-B01-SH03', 44],
  ['S01-B02-SH01', 124],
  ['S01-B02-SH02', 40],
  ['S01-B03-SH01', 134],
  ['S01-B03-SH02', 64],
  ['S01-B03-SH03', 108],
  ['S01-B04-SH01', 53],
  ['S01-B04-SH02', 96],
  ['S01-B04-SH03', 96],
  ['S01-B05-SH01', 53],
  ['S01-B05-SH02', 122],
  ['S01-B05-SH03', 104],
  ['S01-B05-SH04', 32],
  ['S01-B05-SH05', 48],
  ['S01-B06-SH01', 68],
  ['S01-B06-SH02', 53],
  ['S01-B06-SH03', 68],
  ['S01-B06-SH04', 125],
  ['S01-B07-SH01', 58],
  ['S01-B07-SH02', 80],
  ['S01-B07-SH03', 85],
] as const satisfies readonly (readonly [string, number])[];
export type Edu2ShotId = (typeof EDU2_SHOTS)[number][0];
export const EDU2_FRAMES: Record<Edu2ShotId, number> = Object.fromEntries(EDU2_SHOTS) as Record<Edu2ShotId, number>;

const FPS = 30;
const DEG = Math.PI / 180;
export const EDU2_PAPER = '#efe0c4';
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const inOut = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(u));
const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;
const easeIn = (u: number) => clamp01(u) ** 2;
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

/** Sheet camera `cam: <target>, yaw, r, eye, pitch, f, hy` plus a truck along the camera's right (m). */
const orbit = (at: V3, yawDeg: number, r: number, eye: number, f: number, hy: number, pitchDeg = 0, truck = 0, near?: number): YCam => {
  const c = orbitYCam(at, r, yawDeg * DEG, eye, f, hy);
  return {...c, x: c.x + truck * Math.cos(c.yaw), z: c.z + truck * Math.sin(c.yaw), ...(pitchDeg ? {pitch: pitchDeg * DEG} : {}), ...(near ? {near} : {})};
};
/** Near plane of the board-level cameras: the lens is a few centimetres over / in front of the island top (kit default 0.3 cut the top away). */
const BOARD_NEAR = 0.04;
/** Horizontal unit vector from the target toward a camera at sheet yaw `yawDeg` (droplets thrown toward the lens). */
const towardLens = (yawDeg: number): [number, number] => [Math.sin(yawDeg * DEG), Math.cos(yawDeg * DEG)];

const O1: V3 = SET.onion;
const whole = (at: V3 = O1): OnionPiece => ({kind: 'whole', at});
/** O1 halves pushed to the board's right end (B02-SH01 on; sheet (-0.16, 0.95, 0.06), kept standing on their roots). */
const O1_PUSHED: V3 = [-0.16, O1[1], 0.06];
/** O1's halves there, parted 0.07 m with their cut faces turned a little toward the B02 cameras so they read as halves. */
const O1_HALVES: OnionPiece = {kind: 'halves', at: O1_PUSHED, n: 0, sep: 0.035, turn: [-0.45, 0.3]};
/** Ambient breath (shoulders) on the shot's own clock, metres. */
const breath = (f: number) => 0.004 * Math.sin((2 * Math.PI * f) / (FPS * 3.6));

/** `paper` and `grade` (a CSS background over the canvas) are the plate's set: kitchen or the CELL macro. */
export type Edu2Plate = {cam: Camera; ycam: YCam; paper: string; grade: string; paint: (p: Painter) => void};
type Spec = (
  | {ycam: YCam; opts: Omit<KitchenOpts, 't'>; cell?: undefined; eye?: undefined}
  | {ycam: YCam; cell: Omit<CellState, 't'>; opts?: undefined; eye?: undefined}
  | {ycam: YCam; eye: {u: number}; opts?: undefined; cell?: undefined}
) & {/** Screen-space doodles over the plate (N9, G-D). */ doodles?: Doodle[]};

// ---- S01-B01-SH01 (57 f): the onion is innocent. `cam: T-ONION, yaw -30 -> -45 arc, r 0.60 -> 0.52, eye 1.20, pitch -15, f 1700, hy 600`.
// Boss W5.2 feasibility change (for Film): hy 600 -> 440. At hy 600 the rig's chin is at y ~121 and her mouth and chin are in
// frame (acceptance: nothing of her face visible); hy 440 puts the chin at y ~ -39 and moves O1 up 160 px (centre 582 -> 664).
export const B01SH01_HY = 440;
const b01sh01 = (f: number): Spec => {
  const e = inOut(f / 56);
  return {
    ycam: orbit(T.ONION, mix(-30, -45, e), mix(0.6, 0.52, e), 1.2, 1700, B01SH01_HY, -15),
    opts: {
      pieces: [whole()],
      // P25 base (both arms driven): knife low in her right hand beside the board (out of frame), left hand on the island; face off frame.
      // The tip stays > 0.3 m from the lens over the whole arc (a point inside the near plane drops the hold and the knife pops up).
      cook: {pose: 'P07', face: 'neutral', knife: 'raised', hold: {grip: [-0.55, 0.97, -0.38], tip: [-0.75, 0.93, -0.16]}, holdMix: 1, holdElbow: [-0.12, -0.24], rise: breath(f)},
      cookSoft: 0.5,
    },
  };
};

// ---- S01-B01-SH02 (59 f, LF01): she raises the knife. `cam: T-CHEST, yaw -40 -> -34, r 1.20 -> 1.14, eye 1.45, pitch -6, f 1300, hy 713`.
export const B01SH02_CAM = {yaw0: -40, yaw1: -34, r0: 1.2, r1: 1.14, eye: 1.45, pitch: -6, f: 1300, hy: 713};
const b01sh02 = (f: number): Spec => {
  const k = B01SH02_CAM, e = inOut(f / 58);
  const toLens = prog(f, 36, 38);
  const cook: CookState = {
    pose: 'P07', face: 'smug', knife: 'raised', raise: inOut(f / 12), headCock: 6 * inOut(prog(f, 14, 24)),
    // Gaze on O1 (down-left of her face) l 0-36, to the lens by l 38 (sly).
    look: [mix(-0.3, 0, toLens), mix(0.3, 0, toLens)], rise: breath(f),
  };
  return {ycam: orbit(T.CHEST, mix(k.yaw0, k.yaw1, e), mix(k.r0, k.r1, e), k.eye, k.f, k.hy, k.pitch), opts: {pieces: [whole()], cook}};
};

// ---- S01-B01-SH03 (44 f): one chop, the wail. `cam: T-FACE, yaw -30, r 1.30 -> 1.15 push, truck +0.10, eye 1.40, f 1100, hy 620`, ease-out.
/**
 * The chop: blade through O1 at l 6, tip on the board just past it; the grip 0.30 m back, up and out to her right (screen left),
 * so the arm reads reaching to the board and the blade slants across O1 instead of pointing straight down the lens axis. The cut
 * plane holds the blade, so the halves part along its normal (-15 deg off x: the sheet's x -0.39 / -0.31, give or take 0.01 m in z).
 */
const CHOP: {grip: V3; tip: V3} = {grip: [-0.4, 1.05, -0.18], tip: [-0.33, 0.92, 0.08]};
const CHOP_N = Math.atan2(-(CHOP.tip[0] - CHOP.grip[0]), CHOP.tip[2] - CHOP.grip[2]);
const b01sh03 = (f: number): Spec => {
  const e = easeOut(f / 43);
  // l 0-3 knife up at the shoulder, l 3-6 down (accelerating), l 6-12 rebound 0.08 m and settle back on the board.
  const down = easeIn(prog(f, 3, 6)), reb = f >= 6 ? 0.08 * Math.sin(Math.PI * prog(f, 6, 12)) : 0;
  const hold = {grip: add(CHOP.grip, [0, reb, 0]), tip: add(CHOP.tip, [0, reb, 0])};
  const crying = f >= 10, squeeze = f >= 8 && f < 10;
  const shake = f >= 10 ? 0.012 * Math.abs(Math.sin((2 * Math.PI * (f - 10)) / 33)) : 0; // x2 shoulder shakes l 10-43
  const cook: CookState = {
    pose: 'P07', face: crying ? 'crying' : 'smug', knife: 'raised', hold, holdMix: down, holdElbow: [-0.1, -0.2],
    faceAdd: crying ? {tears: ramp(f, 10, 18), open: f < 40 ? 0.75 : 0.45} : squeeze ? {eyes: 'shut', brow: 'worry', mouth: 'flat'} : {},
    rise: breath(f) + shake,
  };
  const sep = f >= 6 ? 0.04 * easeOut(prog(f, 6, 10)) : 0;
  return {
    ycam: orbit(T.FACE, -30, mix(1.3, 1.15, e), 1.4, 1100, 620, 0, 0.1 * e),
    opts: {
      pieces: [f < 6 ? whole() : {kind: 'halves', at: O1, n: CHOP_N, sep}],
      cook,
      droplets: [{from: [O1[0], 0.98, O1[2]], spread: 0.08, l0: 6, f, n: 16, toward: towardLens(-30)}],
    },
  };
};

// ---- S01-B02-SH01 (124 f): a fresh onion does nothing. `cam: T-ONION, yaw -50, r 0.62, truck -0.06 -> +0.06 (linear), eye 1.10, f 1300, hy 700`.
const b02sh01 = (f: number): Spec => {
  const c = orbit(T.ONION, -50, 0.62, 1.1, 1300, 700, 0, mix(-0.06, 0.06, f / 123), BOARD_NEAR);
  // O2 carried in by her left hand and set down at T-ONION at l 10 (root on the board), released l 14. Boss W5.2 feasibility
  // change (for Film): it comes down from her side of the island (start (-0.12, 1.16, -0.2), upper right of O2 in the picture)
  // instead of from frame right: her left shoulder is at the frame centre in this camera, so an arm from frame right would cross
  // her own body.
  const start: V3 = [-0.12, 1.16, -0.2];
  const u = easeOut(prog(f, 0, 10));
  const o2: V3 = f >= 10 ? O1 : add(add(start, [O1[0] - start[0], O1[1] - start[1], O1[2] - start[2]], u), [0, 0.03 * Math.sin(Math.PI * u), 0]);
  // Left wrist: behind and over O2's top while carrying (l 0-14), withdrawing to the island l 14-24.
  const grip = add(o2, [0.02, SET.onionR * 0.8, -0.05]);
  const w = inOut(prog(f, 14, 24)), HAND: V3 = [0.15, 0.9, -0.27];
  const lHand: V3 = f < 14 ? grip : [mix(grip[0], HAND[0], w), mix(grip[1], HAND[1], w) + 0.06 * Math.sin(Math.PI * w), mix(grip[2], HAND[2], w)];
  const blink = f >= 70 && f < 73;
  const cook: CookState = {
    // Knife resting in her right hand: fist just over the island's far edge, the blade sloping down to its tip on the board left of O2.
    pose: 'P07', face: 'sad', knife: 'raised', hold: {grip: [-0.42, 1.0, -0.3], tip: [-0.5, 0.925, -0.02]}, holdMix: 1, holdElbow: [-0.12, -0.22],
    lHand, lFlat: f < 24 ? 0 : 1, look: [-0.35, 0.55], faceAdd: {tears: 0.6, ...(blink ? {eyes: 'shut' as const} : {})}, rise: breath(f),
  };
  return {
    ycam: c,
    // O2 stays in the hand (painted over the palm) until the release at l 14, then belongs to the board.
    // (until l 22, while the hand starts away, so the palm never covers it).
    opts: {pieces: [O1_HALVES, ...(f >= 22 ? [whole()] : [])], carry: f < 22 ? o2 : undefined, cook, cookSoft: 0.3},
  };
};

// ---- S01-B02-SH02 (40 f): the knife goes in. `cam: T-ONION, yaw -80, r 0.55 -> 0.42 push (ease-in), eye 0.98, f 1700, hy 700`.
/** Cut plane normal (x-z angle): 40 deg off the view axis, so the blade reads three-quarter and the far half's cut face meets the lens. */
const B02SH02_N = 30 * DEG;
const b02sh02 = (f: number): Spec => {
  const e = easeIn(f / 39);
  // Blade tip height: from above frame (l 0) to O2's top (l 14), a slow press into the skin (l 14-22), through to the board (l 22-26).
  const top = O1[1] + SET.onionR * 0.92;
  const tipY = f < 14 ? mix(1.2, top, inOut(f / 14)) : f < 22 ? mix(top, top - 0.02, prog(f, 14, 22)) : mix(top - 0.02, 0.921, easeIn(prog(f, 22, 26)));
  const dirAng = B02SH02_N + Math.PI / 2, d: V3 = [Math.cos(dirAng), 0, Math.sin(dirAng)];
  const tip: V3 = add([O1[0], tipY, O1[2]], d, SET.onionR * 1.25);
  // Halves part l 26-39: the near half (screen left) slides 0.045 m away and turns off, the far one 0.006 m and turns its cut face to
  // the lens (Boss W5.2, for Film: the sheet's 0.02 m part left the far face mostly behind the near half from this camera).
  const pu = easeOut(prog(f, 26, 39)), turn = inOut(prog(f, 26, 39));
  return {
    ycam: orbit(T.ONION, -80, mix(0.55, 0.42, e), 0.98, 1700, 700, 0, 0, BOARD_NEAR),
    opts: {
      pieces: [O1_HALVES, f < 22 ? whole() : {kind: 'halves', at: O1, n: B02SH02_N, sep: [0.006 * pu, 0.045 * pu], turn: [-1.0 * turn, 0.35 * turn]}],
      knife: {tip, dirAng, tilt: 0.45, hand: true, ...(f >= 22 ? {inPiece: 1} : {})},
      droplets: [{from: [O1[0], 0.99, O1[2]], spread: 0.09, l0: 22, f, n: 16, toward: towardLens(-80)}],
    },
  };
};

// ---- Group G-B: the CELL macro set (brief VD05; LF02 v2 approved look). Cell-local metres, hero cell at the origin.
/** A sine bump 0 -> 1 -> 0 over l [a, b]. */
const bump = (f: number, a: number, b: number) => (f >= a && f <= b ? Math.sin(Math.PI * prog(f, a, b)) : 0);
/** Hero wall breathing, +-1% on the shot's ambient clock. */
const cellBreath = (f: number) => 0.01 * Math.sin((2 * Math.PI * f) / (FPS * 3.2));
const cellCam = (x: number, y: number, z: number, pitchDeg = 0): YCam => ({x, y, z, yaw: 0, f: 1000, hy: 600, ...(pitchDeg ? {pitch: pitchDeg * DEG} : {})});
const ALL5 = [1, 1, 1, 1, 1] as const, ALL10 = [...ALL5, ...ALL5] as const;

// ---- S01-B03-SH01 (134 f, LF02): inside the cell. `cam: CELL, dolly z +1.20 -> +0.55, truck x -0.10 -> 0, yaw 10 -> 0, eye -0.06,
// f 1000, hy 600` (= LF02_CAM a -> b), ease in-out l 0-133. The timeline lays the 15 f dissolve from B02-SH02 over l 0-14.
const b03sh01 = (f: number): Spec => ({
  ycam: mixYCam(LF02_CAM.a, LF02_CAM.b, inOut(f / 133)),
  cell: {
    // Sac pulse on "เอนไซม์" (l 33-45), bead glint on "สารที่มีกำมะถัน" (l 57-69); both again with the sac membrane brightening
    // on "ซึ่งปกติแยกกันอยู่" (l 93-110).
    sacPulse: bump(f, 33, 45) + bump(f, 93, 110), beadGlint: bump(f, 57, 69) + bump(f, 93, 110), sacGlow: bump(f, 93, 110),
    breathe: cellBreath(f), drift: [0, 0, 0, 0, 0],
  },
});

// ---- S01-B03-SH02 (64 f): the cell breaks, the two meet. `cam: CELL, dolly z 0.55 -> 0.45, eye -0.06, yaw 0, f 1000, hy 600`,
// 2-frame truck jitter +-0.01 m at l 14-15 (the tear).
const b03sh02 = (f: number): Spec => ({
  ycam: cellCam(f === 14 ? 0.01 : f === 15 ? -0.01 : 0, -0.06, mix(0.55, 0.45, inOut(f / 63))),
  cell: {
    sacPulse: 0, beadGlint: 0, breathe: cellBreath(f),
    // Blade sweeps in l 0-12 (accelerating into the wall), rests in the tear, withdraws l 18-34 (W5.3: from the lower left, macro.ts TEAR).
    blade: easeIn(prog(f, 0, 12)), bladeOut: easeIn(prog(f, 18, 34)), tear: easeOut(prog(f, 12, 16)),
    // Sac pops l 16-18, its fragments fade l 18-30; the teal enzymes spill (the nearest touches its bead by l 18) and drift to l 39.
    pop: easeOut(prog(f, 16, 18)), sacGone: prog(f, 18, 30),
    drift: [0, 1, 2, 3, 4].map((e) => easeOut(prog(f, 16, 19 + 5 * e))),
    // Orange: the met beads turn from l 30 (one every 6 f), each with a small drop beside it 3 f later; the last done by l 63.
    orange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => easeOut(prog(f, 30 + 6 * (k % 5) + (k >= 5 ? 3 : 0), 36 + 6 * (k % 5) + (k >= 5 ? 3 : 0)))),
  },
});

// ---- S01-B03-SH03 (108 f): a second enzyme makes the gas. `cam: CELL, crane eye -0.06 -> +0.40, pitch 0 -> +12 deg,
// dolly z 0.45 -> 0.60, f 1000, hy 600`, ease in-out l 0-107.
export const B03SH03_CAM = {y0: -0.06, y1: 0.4, z0: 0.45, z1: 0.6, pitch1: 12, from: 32, to: 107};
const b03sh03 = (f: number): Spec => {
  const k = B03SH03_CAM, e = inOut(prog(f, k.from, k.to));
  return {
    ycam: cellCam(0, mix(k.y0, k.y1, e), mix(k.z0, k.z1, e), k.pitch1 * e),
    cell: {
      sacPulse: 0, beadGlint: 0, breathe: cellBreath(f), tear: 1, pop: 1, sacGone: 1, drift: ALL5, orange: ALL10,
      // Violet enzymes appear and pulse on "แล้วเอนไซม์อีกตัว" (l 4-16), move onto the orange l 16-40.
      violet: easeOut(prog(f, 4, 10)), violetPulse: bump(f, 4, 16), touch: [0, 1, 2, 3, 4].map((v) => inOut(prog(f, 16 + 3 * v, 28 + 3 * v))),
      // Orange -> lilac l 30-60 (one item every 2.5 f), then the puffs rise and fill the upper frame by the end (l 60-107).
      lilac: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((q) => inOut(prog(f, 30 + 2.5 * q, 37 + 2.5 * q))),
      rise: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((q) => inOut(prog(f, 48 + 1.5 * q, 104))),
    },
  };
};

// ---- Group G-C: B04 (kitchen, EYE). The O2 halves stay as B02-SH02 left them (standing, parted, cut faces turned to the lens).
const O2_HALVES: OnionPiece = {kind: 'halves', at: O1, n: B02SH02_N, sep: [0.006, 0.045], turn: [-1.0, 0.35]};
/** Knife resting on the board in her right hand (as B02-SH01): fist over the island's far edge, tip on the board left of O2. */
const REST: KnifeHold = {grip: [-0.42, 1.0, -0.3], tip: [-0.5, 0.925, -0.02]};
const mixHold = (a: KnifeHold, b: KnifeHold, u: number): KnifeHold => ({grip: add(a.grip, [b.grip[0] - a.grip[0], b.grip[1] - a.grip[1], b.grip[2] - a.grip[2]], u), tip: add(a.tip, [b.tip[0] - a.tip[0], b.tip[1] - a.tip[1], b.tip[2] - a.tip[2]], u)});
const mixV = (a: V3, b: V3, u: number): V3 => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];

// ---- S01-B04-SH01 (53 f): the gas rises to her eyes. `cam: T-ONION -> T-FACE (target blend), yaw -35, crane eye 1.00 -> 1.40,
// r 1.00 -> 1.20, f 1000, hy 600`, ease in-out l 0-52. Mist (N7) from the halves toward (0, 1.40, -0.50): its head reaches her chin
// (y 1.215) at l 36 and her eyes (1.40) at l 46; it is already ~0.10 m over the halves at l 0, so the cut from B03-SH03's rising
// lilac lands on lilac rising (match). Head height = 1.0 + 0.4 reach, reach = 0.25 + 0.75 (l / 46)^3.92 (slow drift, then the rush
// to the face under the whoosh at l 24).
export const B04SH01_MIST = {from: [O1[0], 1.0, O1[2]] as V3, to: [0, 1.4, -0.5] as V3, r0: 0.25, pow: 3.92, eyesAt: 46};
const b04sh01 = (f: number): Spec => {
  const e = inOut(f / 52), m = B04SH01_MIST;
  const cook: CookState = {
    pose: 'P07', face: 'neutral', knife: 'raised', hold: REST, holdMix: 1, holdElbow: [-0.12, -0.22],
    look: [-0.35, 0.55], faceAdd: {tears: 0.2, squint: 0.6 * inOut(prog(f, 44, 50))}, rise: breath(f),
  };
  return {
    ycam: orbit(mixV(T.ONION, T.FACE, e), -35, mix(1.0, 1.2, e), mix(1.0, 1.4, e), 1000, 600),
    opts: {pieces: [O1_HALVES, O2_HALVES], cook, mist: {from: m.from, to: m.to, reach: Math.min(1, m.r0 + (1 - m.r0) * Math.min(1, f / m.eyesAt) ** m.pow), t: f / FPS}},
  };
};

// ---- S01-B04-SH02 (96 f, LF03): nerve endings fire, tears wash it. `cam: EYE, yaw -7 -> +6 arc, r 0.307 -> 0.294, eye 0, f 1000,
// hy 880` (= LF03_CAM), linear l 0-95; eye state u = l / 95 (eye.ts: mist lands u 0.05-0.45, flicks u 0.28-0.62 = l 27-59, tear
// wave u 0.5-0.92 = l 48-87, one drop u 0.85-1).
const b04sh02 = (f: number): Spec => {
  const k = LF03_CAM, u = f / 95;
  return {ycam: orbitYCam([0, 0, 0], mix(k.r0, k.r1, u), mix(k.yaw0, k.yaw1, u) * DEG, k.eye, k.f, k.hy), eye: {u}};
};

// ---- S01-B04-SH03 (96 f): "not moved, just washing". `cam: T-FACE, yaw -28 -> -36 arc, r 1.40 -> 1.20, eye 1.40, f 1000, hy 620`,
// ease-out l 0-95. She chops on a steady beat (knife tip on the board at l 12, 30, 48, 66, 84), one slow blink l 44-50, gaze at the
// lens; waterfall tears (N7) grow from the lids l 0-8; a slice lands right of O2 on each chop.
export const B04SH03_CHOPS = [12, 30, 48, 66, 84] as const;
/**
 * Chop hold at the k-th slice, rocking on the tip: the tip stays on the board in front of O2 (each slice 0.004 m further right) and
 * lifts 0.02 m at the top; the grip swings up about it, 0.28 m away, from 23 deg (blade on the board) to 55 deg (raised) at
 * `lift` 0..1. (A whole-knife lift kept the blade near level and, from this camera, read as a stab across her body.)
 */
const sliceHold = (k: number, lift: number): KnifeHold => {
  const tip: V3 = [-0.27 + 0.004 * k, 0.921 + 0.02 * lift, 0.09], th = (23 + 32 * lift) * DEG, h = [-0.33, -0.94];
  return {tip, grip: [tip[0] + 0.28 * Math.cos(th) * h[0], tip[1] + 0.28 * Math.sin(th), tip[2] + 0.28 * Math.cos(th) * h[1]]};
};
const b04sh03 = (f: number): Spec => {
  const e = easeOut(f / 95), C = B04SH03_CHOPS;
  const done = C.filter((c) => c <= f).length, prev = done ? C[done - 1] : -6;
  // Knife lift 0..1 on the cycle after the previous chop: on the board d 0-2 (a small rebound at d 1), up d 2-12, down d 12-18.
  const d = f - prev, UP = 1;
  const lift = d <= 2 ? (d === 1 ? 0.1 : 0) : d <= 12 ? UP * easeOut((d - 2) / 10) : UP * (1 - easeIn((d - 12) / 6));
  const hold = f < 6 ? mixHold(REST, sliceHold(0, UP), easeOut(f / 6)) : sliceHold(Math.min(done, C.length - 1), lift);
  const blink = f >= 44 && f <= 50 ? (f <= 45 || f >= 49 ? ('half' as const) : ('shut' as const)) : undefined;
  const cook: CookState = {
    pose: 'P07', face: 'neutral', knife: 'raised', hold, holdMix: 1, holdElbow: [-0.1, -0.2], look: [0, 0],
    faceAdd: {tears: 1, squint: 0.5 * (1 - inOut(f / 10)), ...(blink ? {eyes: blink} : {})}, rise: breath(f), waterfall: easeOut(f / 8),
  };
  return {
    ycam: orbit(T.FACE, mix(-28, -36, e), mix(1.4, 1.2, e), 1.4, 1000, 620),
    opts: {pieces: [O1_HALVES, O2_HALVES, ...(done ? [{kind: 'slices', at: [-0.3, O1[1], 0.1], n: done} as OnionPiece] : [])], cook},
  };
};

// ---- Group G-D: B05, the tricks (scene sheet s01-b05.md). The board as B04-SH03 left it: O1 halves at the board end, O2 halves at
// T-ONION and its five slices in front (time jumps between shots are accepted cuts).
const B05_SLICES: V3 = [-0.3, O1[1], 0.1];
const b05Pieces = (slices = 5): OnionPiece[] => [O1_HALVES, O2_HALVES, {kind: 'slices', at: B05_SLICES, n: slices}];
/** The knife laid down flat along the board's back strip (B05-SH01 l 10 on, B05-SH03 until she picks it up at l 36). */
const LAY: KnifeHold = {grip: [-0.17, 0.925, -0.15], tip: [-0.47, 0.925, -0.13]};
/**
 * Knife lift 0..1 on a chop beat `C` (as B04-SH03: on the board d 0-2 with a small rebound at d 1, up, down over the 6 f before
 * the next chop); after the last chop it rises and holds. Before the first chop it comes down from the top.
 */
const chopLift = (f: number, C: readonly number[], period = 18) => {
  const done = C.filter((c) => c <= f).length, prev = done ? C[done - 1] : C[0] - period, next = done < C.length ? C[done] : undefined, d = f - prev;
  if (d <= 2) return d === 1 ? 0.1 : 0;
  if (next === undefined) return easeOut(Math.min(1, (d - 2) / 10));
  const down = next - 6;
  return f < down ? easeOut(Math.min(1, (d - 2) / Math.max(1, down - prev - 2))) : 1 - easeIn((f - down) / 6);
};
const chopsDone = (f: number, C: readonly number[]) => C.filter((c) => c <= f).length;
/** The doodle timing of the sheets: drawn on over 6 f from `a`, then a pop over 4 f. */
// The "?" draws on over 6 f and pops; the red "✗" is a stamp (whole at once, pop over 4 f): drawn stroke by stroke it reads as a tick.
const doodleAt = (f: number, a: number, d: Omit<Doodle, 'draw' | 'pop'>): Doodle[] =>
  f < a ? [] : d.kind === 'cross' ? [{...d, draw: 1, pop: bump(f, a, a + 4)}] : [{...d, draw: prog(f, a, a + 6), pop: bump(f, a + 6, a + 10)}];
/** P06 shrug with the knife point-down in the right fist (B05-SH03 l 86, B05-SH05 l 32): right arm, left arm and knife angle. */
const shrug = (u: number): Pick<CookState, 'rPose' | 'lPose'> => (u > 0 ? {rPose: {a: 'P06', mix: u, knifeAng: Math.PI / 2 - 0.15}, lPose: {a: 'P06', mix: u}} : {});
const EYES: V3 = [0, 1.4, -0.5];

// ---- S01-B05-SH01 (53 f): "what about the tricks?". `cam: T-CHEST, yaw -40, truck -0.20 -> +0.15, r 1.70, eye 1.35, f 1000, hy 560`,
// linear. She lays the knife on the board (l 0-10), wipes her eyes with the back of her right hand (l 10-22: kit P02 -> P24 blend,
// the hand at the eyes), then P02 thinking (l 24: hand under the chin, eyes up-left); the chalk "?" draws on l 32-38 and pops l 38.
const b05sh01 = (f: number): Spec => {
  const lay = inOut(prog(f, 0, 10)), up = sliceHold(4, 0.6);
  const hold = mixHold(up, LAY, lay), released = f >= 10;
  const toFace = easeOut(prog(f, 10, 15)), wipe = f >= 13 && f < 22 ? Math.sin((2 * Math.PI * (f - 13)) / 9) : 0, think = inOut(prog(f, 20, 25));
  const shut = f >= 13 && f < 21;
  const cook: CookState = {
    pose: 'P07', face: f < 24 ? 'sad' : 'worried', knife: released ? 'none' : 'raised', hold, holdMix: 1, holdElbow: [-0.1, -0.2],
    ...(released ? {lRest: true, rPose: {a: 'P02', b: 'P24', u: 0.55 * (1 - think), mix: toFace, off: [0.035 * wipe, 0]}} : {}),
    look: f < 24 ? [-0.2, 0.5] : [-0.6, -0.6], faceAdd: {tears: 0.6, ...(shut ? {eyes: 'shut' as const} : {})}, rise: breath(f),
  };
  return {
    ycam: orbit(T.CHEST, -40, 1.7, 1.35, 1000, 560, 0, mix(-0.2, 0.15, f / 52)),
    opts: {pieces: b05Pieces(), cook, ...(released ? {knifeRest: LAY} : {})},
    doodles: doodleAt(f, 32, {kind: 'question', x: 600, y: 290, size: 120}),
  };
};

// ---- S01-B05-SH02 (122 f): bread in the mouth, the only ✗. `cam: T-FACE, yaw -30, r 1.50 -> 1.20 push, eye 1.40, f 1050, hy 620`,
// ease in-out l 0-100, hold l 100-121. She chops at l 10, 28, 46, 64, 82 with the slice clamped in her teeth (it bobs on each chop);
// the gas rises from O2 from l 10, bends through a point 0.05 m in front of the bread (toward the lens) and reaches her eyes at l 52;
// her eyes squeeze shut from l 60; the red ✗ stamps on beside the bread at l 96.
export const B05SH02_CHOPS = [10, 28, 46, 64, 82] as const;
const b05sh02 = (f: number): Spec => {
  const C = B05SH02_CHOPS, done = chopsDone(f, C), lift = chopLift(f, C);
  const since = done ? f - C[done - 1] : 99, bob = since <= 4 ? 0.008 * Math.sin((Math.PI * since) / 4) : 0;
  const cook: CookState = {
    pose: 'P07', face: f < 60 ? 'sad' : 'crying', knife: 'raised', hold: sliceHold(5 + Math.min(done, 4), lift), holdMix: 1, holdElbow: [-0.1, -0.2],
    look: [0, 0.65], faceAdd: {tears: f < 60 ? mix(0.4, 1, prog(f, 0, 60)) : 1}, rise: breath(f) + (since <= 3 ? -0.004 : 0),
    bread: {bob, tilt: 0.05 * Math.sin((2 * Math.PI * f) / 37)},
  };
  const reach = f < 10 ? 0 : Math.min(1, (f - 10) / 42) ** 1.2;
  // Waypoint: 0.10 m in front of the bread (the rig face sits at the cook's depth) and 0.08 m to the camera's right of it, so the
  // wisps pass over the bread's right edge on their way up to the eyes.
  const lens = towardLens(-30), right: [number, number] = [Math.cos(-30 * DEG), Math.sin(-30 * DEG)];
  return {
    ycam: orbit(T.FACE, -30, mix(1.5, 1.2, inOut(prog(f, 0, 100))), 1.4, 1050, 620),
    opts: {
      pieces: b05Pieces(5 + done), cook,
      mist: {from: [O1[0], 1.0, O1[2]], to: EYES, via: [lens[0] * 0.1 + right[0] * 0.08, 1.2, -0.55 + lens[1] * 0.1 + right[1] * 0.08], reach, t: f / FPS, alpha: 1.2 * (1 - 0.55 * prog(f, 80, 100))},
    },
    // Boss W5.2 value change (AI13, Film owner): sheet (720, 700) put the ✗ on her cheek and hair at the push end; (860, 790) is
    // beside the bread, off the face and above the caption band.
    doodles: doodleAt(f, 96, {kind: 'cross', x: 860, y: 790, size: 130}),
  };
};

// ---- S01-B05-SH03 (104 f): the candle, results conflict. `cam: T-MID, yaw -50 -> -35 arc, r 1.20 (SS-R3), eye 1.25, f 1000, hy 560`,
// ease in-out l 0-103. Boss W5.2 interpretation (for Film; the sheet names no hand): the match is in her LEFT hand (screen right, the
// candle's side; the right hand crossing her body read as a stiff bar), struck along the box's striker l 0-8 (flare l 8), to the wick
// l 10-18 (flame on l 22), shaken out l 24-30 and dropped in the saucer, the hand back on the island by l 36. The right fist rests
// on the island's far edge until l 30, takes the knife off the board l 30-36, lifts it l 36-40 and chops at l 40, 58, 76. The gas
// rises from l 40, half bending to the flame and half reaching her eyes at l 70; P06 shrug l 86-92 (knife point-down); "?" at l 89.
export const B05SH03_CHOPS = [40, 58, 76] as const;
/** Left wrist and fingers relative to the match head (m): the hand right of and behind the head, the stick pointing down-left. */
const MATCH_WRIST: V3 = [0.075, 0.0, -0.05], MATCH_FINGERS: V3 = [0.03, 0.005, -0.02];
const b05sh03 = (f: number): Spec => {
  const box = CANDLE.box, wick: V3 = [CANDLE.at[0], CANDLE.wick, CANDLE.at[2]];
  const strike0: V3 = [box[0] - 0.035, 0.912, box[2] + 0.03], strike1: V3 = [box[0] + 0.03, 0.914, box[2] + 0.03];
  const lift: V3 = [box[0] + 0.02, 0.99, box[2] + 0.03], atWick: V3 = [wick[0] + 0.012, wick[1] + 0.006, wick[2] + 0.012];
  const shake = f >= 24 && f < 30 ? 0.03 * Math.sin((2 * Math.PI * (f - 24)) / 3) : 0;
  const head: V3 = f < 8 ? mixV(strike0, strike1, easeIn(f / 8)) : f < 10 ? mixV(strike1, lift, prog(f, 8, 10)) : f < 18 ? mixV(lift, atWick, inOut(prog(f, 10, 18))) : add(mixV(atWick, [atWick[0] + 0.03, atWick[1] + 0.06, atWick[2] + 0.02], inOut(prog(f, 22, 26))), [shake, 0, 0]);
  const flame = f < 6 ? 0 : f < 8 ? 1.9 * prog(f, 6, 8) : f < 12 ? mix(1.9, 1, prog(f, 8, 12)) : f < 24 ? 1 : 1 - prog(f, 24, 27);
  // Left hand: from the island rest to the match l 0 (already holding it at the box), back to the rest l 30-36 after the drop.
  // W6 (user: "two palms at the candle"): the return starts where the shake-out left the hand (`lifted`, the head's l 26-29 point
  // without the shake), not 0.12 m lower in front of the candle, which popped the hand onto the candle for one frame at l 30; it
  // draws back first and drops late (height on back^2), so it clears the flame instead of passing over it.
  const back = inOut(prog(f, 30, 36)), wrist = add(head, MATCH_WRIST), lifted: V3 = [atWick[0] + 0.03, atWick[1] + 0.06, atWick[2] + 0.02];
  const HAND: V3 = [0.15, 0.9, -0.27], from = add(lifted, MATCH_WRIST);
  const lHand: V3 = f < 30 ? wrist : [mix(from[0], HAND[0], back), mix(from[1], HAND[1], back * back), mix(from[2], HAND[2], back)];
  // Right fist: resting over the island's far edge (as B02-SH01, no knife) to the knife's grip on the board, then into the chops.
  const C = B05SH03_CHOPS, done = chopsDone(f, C), toKnife = inOut(prog(f, 30, 36)), raised = inOut(prog(f, 36, 40));
  const chopHold = sliceHold(Math.min(done, 2), chopLift(f, C));
  const hold: KnifeHold = f < 36 ? {grip: mixV(REST.grip, LAY.grip, toKnife), tip: mixV(REST.tip, LAY.tip, toKnife)} : mixHold(LAY, chopHold, raised);
  const holding = f >= 36, sh = inOut(prog(f, 86, 92));
  const cook: CookState = {
    pose: 'P07', face: 'sad', knife: holding ? 'raised' : 'none', hold, holdMix: 1, holdElbow: [-0.12, -0.22],
    lHand, lFlat: f < 30 ? 0 : back, lRest: true, lBend: 1 - back, lAirHand: true,
    look: f < 30 ? [0.35, 0.55] : f < 86 ? [-0.1, 0.55] : [0, 0], faceAdd: {tears: f >= 70 ? 0.4 * prog(f, 70, 76) : 0, squint: f >= 70 ? 0.5 * prog(f, 70, 76) : 0}, rise: breath(f), ...shrug(sh),
  };
  const reach = (k: number) => (f < 40 ? 0 : Math.min(1, (f - 40) / k) ** 1.2);
  const fade = 1 - 0.4 * prog(f, 92, 103);
  return {
    // SS-R3 (Film): r 1.45 -> 1.20 so the candle reads (arc, eye, target, f, hy unchanged).
    ycam: orbit(T.MID, mix(-50, -35, inOut(f / 103)), 1.2, 1.25, 1000, 560),
    opts: {
      pieces: b05Pieces(5 + done), cook, ...(holding ? {} : {knifeRest: LAY}),
      candle: {lit: prog(f, 20, 23), t: f / FPS, burnt: f >= 30, ...(f < 30 ? {match: {from: add(head, MATCH_FINGERS), to: head, flame}} : {})},
      mist: [
        {from: [O1[0], 1.0, O1[2]], to: [wick[0], wick[1] + 0.05, wick[2]], reach: reach(24), t: f / FPS, alpha: 0.9 * fade},
        {from: [O1[0] + 0.02, 1.0, O1[2]], to: EYES, reach: reach(30), t: f / FPS + 0.7, alpha: 0.9 * fade},
      ],
    },
    // SS-R3 (Film): the shrug "?" above her head (head top about (419, 276) at l 89), as B05-SH05.
    doodles: doodleAt(f, 89, {kind: 'question', x: 480, y: 205, size: 100}),
  };
};

// ---- S01-B05-SH04 (32 f): POV from inside the fridge. `cam: fridge interior, position (1.80, 1.15, -1.45), yaw 180 (toward +z),
// dolly z -1.45 -> -1.40, f 900, hy 760`, linear. The door swings open to screen left l 0-8 (the light comes on l 1-4); she stands at
// (1.80, 0, -0.45) in the cold light, reaches in with her right hand l 10-14 and lifts the frosty O3 off the shelf front l 14-28.
export const B05SH04_O3: V3 = [1.88, 1.02, -1.0];
/**
 * W5.3 fix round 2: the right wrist relative to O3 (m; +x is picture left from this camera, +z away from the lens), and the elbow's
 * quadratic path over the lift (reach l 14, out to her side mid-lift, at her side in the carry l 28), so in the picture it stays at
 * least 1.1 onion radii from the onion's middle (the rig's hand tucked behind the onion, the forearm into its lower-left).
 */
const B05SH04_WRIST: V3 = [0.04, -0.035, 0.02], B05SH04_ELBOW: [V3, V3, V3] = [[1.98, 1.06, -0.68], [2.14, 0.98, -0.6], [2.0, 0.99, -0.5]];
const b05sh04Elbow = (t: number): V3 => mixV(mixV(B05SH04_ELBOW[0], B05SH04_ELBOW[1], t), mixV(B05SH04_ELBOW[1], B05SH04_ELBOW[2], t), t);
const b05sh04 = (f: number): Spec => {
  const light = prog(f, 1, 4), lift = inOut(prog(f, 14, 28));
  const o3 = mixV(B05SH04_O3, [1.87, 1.1, -0.72], lift);
  const reach = f < 10 ? 0 : f < 14 ? easeOut(prog(f, 10, 14)) : 1;
  const cook: CookState = {
    pose: 'P01', face: 'sad', at: [1.8, 0, -0.45], look: [-0.35, 0.6], faceAdd: {tears: 0.6}, rise: breath(f), cold: light, coldKey: light,
    rReach: {to: add(o3, B05SH04_WRIST), mix: reach, elbow: b05sh04Elbow(lift), hide: o3},
  };
  // W5.3 fix round 1 (viewer check r1): her hand on O3 from the reach (l 10-14) on (`carryR.hand`), white rime on the onion's own
  // colour (props.ts `paintFrost`), and the cool key on her face and apron from l 2 (`coldKey`). Fix round 2 (user note: "an arm laid
  // over the onion"): the wrist goes just inside the onion's lower-left behind it (`B05SH04_WRIST`) and the elbow drops to her side as
  // she lifts (`B05SH04_ELBOW`, reach -> carry), so the forearm rises to the onion from below-left and never crosses its front.
  return {
    ycam: {x: 1.8, y: 1.15, z: mix(-1.45, -1.4, f / 31), yaw: Math.PI, f: 900, hy: 760, near: BOARD_NEAR},
    opts: {pieces: [], cook, fridgePov: {door: easeOut(prog(f, 0, 8)), light}, carryR: {at: o3, frost: 1, hand: true}},
  };
};

// ---- S01-B05-SH05 (48 f): chilled onion, same tears. `cam: T-CHEST, yaw -45 -> -30 arc, r 1.70 -> 1.50, eye 1.35, f 1000, hy 560`,
// ease in-out l 0-47. O3 (frosty) halved at T-ONION by the chop at l 0, a frosty slice from the chop at l 14; the gas from O3 l 4-30
// at B05-SH03's eye-bound density, at her eyes by l 24; P06 shrug l 32-38 with the knife point-down; the "?" above her head at l 34.
export const B05SH05_CHOPS = [0, 14] as const;
export const B05SH05_R1 = 1.55;
const b05sh05 = (f: number): Spec => {
  const C = B05SH05_CHOPS, done = chopsDone(f, C), sh = inOut(prog(f, 32, 38)), e = inOut(f / 47);
  const cook: CookState = {
    pose: 'P07', face: 'sad', knife: 'raised', hold: sliceHold(done >= 2 ? 1 : 0, chopLift(f, C, 14)), holdMix: 1, holdElbow: [-0.1, -0.2],
    look: f < 32 ? [-0.1, 0.55] : [0, 0], faceAdd: {tears: 0.4, squint: 0.4 * prog(f, 24, 30)}, rise: breath(f), ...shrug(sh),
  };
  const sep = 0.03 * easeOut(prog(f, 0, 4));
  return {
    // Boss W5.2 value change (AI13, Film owner): dolly end r 1.50 -> 1.55. At 1.50 the head at l 42 (c 1228) is 296 px against
    // B05-SH03's 263 at c 1145 (+12.5 %, outside the sheet's +-10 % rhyme); at 1.55 it is within it.
    ycam: orbit(T.CHEST, mix(-45, -30, e), mix(1.7, B05SH05_R1, e), 1.35, 1000, 560),
    opts: {
      pieces: [O1_HALVES, {kind: 'slices', at: B05_SLICES, n: 5}, {kind: 'halves', at: O1, n: B02SH02_N, sep: [0.006 + 0.3 * sep, sep], turn: [-0.8, 0.3], frost: 1, t: f / FPS},
        ...(f >= 14 ? [{kind: 'slices', at: [B05_SLICES[0] + 0.022 * 5, O1[1], B05_SLICES[2]], n: 1, frost: 1} as OnionPiece] : [])],
      cook,
      mist: {from: [O1[0] + 0.02, 1.0, O1[2]], to: EYES, reach: f < 4 ? 0 : Math.min(1, (f - 4) / 20) ** 1.2, t: f / FPS + 0.7, alpha: 0.9 * (1 - 0.4 * prog(f, 30, 40))},
    },
    doodles: doodleAt(f, 34, {kind: 'question', x: 600, y: 280, size: 110}),
  };
};

// ---- Group G-E: B06, the swim goggles (scene sheet s01-b06-b07.md SS-R2). N8 goggles (props.ts `paintGoggles`, on `CookState.goggles`).
/** Right / lens horizontal unit vectors of a sheet yaw (camera right and toward the lens, x-z). */
const rightOf = (yawDeg: number): [number, number] => [Math.cos(-yawDeg * DEG), Math.sin(-yawDeg * DEG)];
/** World point `r` m along the camera's right and `l` m toward the lens from `at` (x-z), at height `y`. */
const beside = (at: V3, yawDeg: number, r: number, l: number, y: number): V3 => {
  const R = rightOf(yawDeg), Lz = towardLens(yawDeg);
  return [at[0] + R[0] * r + Lz[0] * l, y, at[2] + R[1] * r + Lz[1] * l];
};
/** The apron pocket (cast.ts `paintBibApron`: just below the waist tie, her right half): behind the island from every B06 camera. */
const pocketAt = (yawDeg: number): V3 => beside(SET.cook, yawDeg, -0.05, 0.12, 0.63);
/** Both hands' eye wipe (kit P02 -> P24 blend as B05-SH01; the left hand mirrors the right), `wipe` the side-to-side rub. */
const eyeWipe = (mix: number, wipe: number): Pick<CookState, 'rPose' | 'lPose'> =>
  mix > 0 ? {rPose: {a: 'P02', b: 'P24', u: 0.55, mix, off: [-0.05 + 0.03 * wipe, 0.09]}, lPose: {a: 'P02', b: 'P24', u: 0.55, mirror: true, mix, off: [0.05 - 0.03 * wipe, 0.09]}} : {};

// ---- S01-B06-SH01 (68 f): "what seems to work best...". `cam: T-FACE, yaw -35, r 1.60 -> 1.30 push, eye 1.40, f 1000, hy 620`,
// ease in-out l 0-67. She lays the knife on the board (l 0-10, from B05-SH05's point-down shrug), wipes both eyes with the backs of
// her hands (l 10-26, P24), looks to the lens smug at l 30, and slides her right hand into the apron pocket (l 30-44; the pocket is
// behind the island from this camera, so the hand goes down out of sight: no cyan anywhere).
const b06sh01 = (f: number): Spec => {
  const lay = inOut(prog(f, 0, 10)), released = f >= 10;
  const hold = mixHold(sliceHold(1, 0.6), LAY, lay);
  const toFace = easeOut(prog(f, 10, 15)) * (1 - inOut(prog(f, 26, 31))), wipe = f >= 13 && f < 25 ? Math.sin((2 * Math.PI * (f - 13)) / 8) : 0;
  const toPocket = inOut(prog(f, 29, 44)), shut = f >= 13 && f < 25;
  const cook: CookState = {
    pose: 'P07', face: f < 30 ? 'sad' : 'smug', knife: released ? 'none' : 'raised', hold, holdMix: 1, holdElbow: [-0.1, -0.2], lRest: true,
    ...(released ? eyeWipe(toFace, wipe) : shrug(1 - easeOut(prog(f, 0, 5)))),
    ...(toPocket > 0 ? {rReach: {to: pocketAt(-35), mix: toPocket}} : {}),
    look: f < 30 ? [-0.2, 0.5] : [0, 0], headCock: f >= 30 ? 5 * inOut(prog(f, 30, 36)) : 0,
    faceAdd: {tears: mix(0.4, 0.2, prog(f, 10, 26)), ...(shut ? {eyes: 'shut' as const} : {})}, rise: breath(f),
  };
  return {ycam: orbit(T.FACE, -35, mix(1.6, 1.3, inOut(f / 67)), 1.4, 1000, 620), opts: {pieces: b05Pieces(), cook, ...(released ? {knifeRest: LAY} : {})}};
};

// ---- S01-B06-SH02 (53 f): "...swim goggles" (snap). `cam: T-FACE, yaw -30 -> -26, r 1.25 -> 1.15, eye 1.40, f 1050, hy 620`,
// ease-out l 0-30, hold l 30-52. Right hand out of the pocket l 0-12 (goggles in the fist, hidden); l 12 the goggles show in front of
// her forehead, the strap stretched between her hands at the sides of her head (P23); l 12-22 the lenses come down onto the eyes;
// l 20-24 the strap leaves her hands round the curls; l 24 snap (lenses squash, curls bounce l 24-32); hands down l 30-38 (right fist
// on the island's far edge, left hand on the top), deadpan, one blink l 40.
export const B06SH02_SHOW = 12, B06SH02_SNAP = 24;
/** Right fist resting on the island top in front of her after the snap (REST's grip sat out over the board and read as a reach). */
const HANDS_DOWN: KnifeHold = {grip: [-0.2, 0.95, -0.3], tip: [-0.3, 0.925, -0.05]};
const b06sh02 = (f: number): Spec => {
  const e = easeOut(prog(f, 0, 30)), down = inOut(prog(f, 30, 38));
  const rUp = inOut(prog(f, 2, 12)) * (1 - down), lUp = inOut(prog(f, 5, 12)) * (1 - down), out = 1 - easeIn(prog(f, 0, 10));
  const s = f - B06SH02_SNAP;
  const goggles = f < B06SH02_SHOW ? undefined : {
    lift: mix(-0.6, 0, inOut(prog(f, B06SH02_SHOW, 22))), held: 1 - prog(f, 20, B06SH02_SNAP), squash: s >= 0 ? bump(f, 24, 28) : 0,
    bounce: s >= 0 && s <= 8 ? -0.05 * Math.sin((Math.PI * s) / 3) * Math.exp(-s / 4) : 0,
  };
  const cook: CookState = {
    pose: 'P07', face: f < B06SH02_SNAP ? 'smug' : 'neutral', knife: 'none', hold: HANDS_DOWN, holdMix: 1, holdElbow: [-0.12, -0.22], lRest: true,
    ...(rUp > 0 ? {rPose: {a: 'P23', mix: rUp}} : {}), ...(lUp > 0 ? {lPose: {a: 'P23', mix: lUp}} : {}),
    ...(out > 0 ? {rReach: {to: pocketAt(-30), mix: out}} : {}),
    look: [0, 0], faceAdd: {tears: f < B06SH02_SNAP ? 0.1 : 0, ...(f >= 40 && f <= 41 ? {eyes: 'shut' as const} : {})}, rise: breath(f) + (s >= 0 && s <= 4 ? -0.004 * Math.sin((Math.PI * s) / 4) : 0),
    ...(goggles ? {goggles} : {}),
  };
  return {ycam: orbit(T.FACE, mix(-30, -26, e), mix(1.25, 1.15, e), 1.4, 1050, 620), opts: {pieces: b05Pieces(), cook, knifeRest: LAY}};
};

// ---- S01-B06-SH03 (68 f): "but the gas can hardly reach the eyes". `cam: T-FACE, yaw -24 -> -36 arc, r 0.95 -> 0.85, eye 1.40, f 1050,
// hy 600`, ease in-out l 0-67. Goggled, chopping out of frame (shoulder dips l 6, 24, 42, 60), blinks l 45 (W5.3; sheet l 30) and l 58, smug from l 50.
// The board, pieces and knife lie 0.2-0.31 m from the lens: culled under 0.35 m (`cullNear`). The gas rises from below the frame in
// front of her (two mists, one beside each lens) and reaches the lens rims at l 24, then slides up round the outer rims l 24-67;
// one faint single wisp curls at the right lens's rim l 45-55.
export const B06SH03_CHOPS = [6, 24, 42, 60] as const;
export const B06SH03_BLINKS = [45, 58] as const;
const b06sh03 = (f: number): Spec => {
  const e = inOut(f / 67), yaw = mix(-24, -36, e), C = B06SH03_CHOPS, done = chopsDone(f, C);
  const dip = C.reduce((a, c) => a + (f >= c - 1 && f <= c + 3 ? -0.006 * Math.sin((Math.PI * (f - c + 1)) / 4) : 0), 0);
  // W5.3 fix round 1 (viewer check r1; AI13 value change, Film owner): the first blink l 30 -> l 45 (l 30 is the c 1385 acceptance
  // frame: eyes open there); the l 58 blink stays.
  const blink = (f >= B06SH03_BLINKS[0] && f <= B06SH03_BLINKS[0] + 1) || (f >= B06SH03_BLINKS[1] && f <= B06SH03_BLINKS[1] + 1);
  const cook: CookState = {
    pose: 'P07', face: f < 50 ? 'neutral' : 'smug', knife: 'raised', hold: sliceHold(Math.min(done, 3), chopLift(f, C)), holdMix: 1, holdElbow: [-0.1, -0.2],
    look: [0, 0], faceAdd: {tears: 0, ...(blink ? {eyes: 'shut' as const} : {})}, rise: breath(f) + dip, goggles: {lift: 0},
  };
  const reach = Math.min(1, f / 24) ** 1.2, up = inOut(prog(f, 24, 67)), t = f / FPS;
  const rim = (side: number, k: number): KitchenMist => ({
    from: beside(SET.cook, yaw, side * 0.2, 0.17, 1.02), via: beside(SET.cook, yaw, side * 0.28, 0.08, 1.3),
    to: beside(SET.cook, yaw, side * 0.27, 0.06, mix(1.4, 1.52, up)), reach, t: t + k * 0.6, alpha: 0.9, width: 0.75,
  });
  const faint = prog(f, 40, 50);
  return {
    // `near` 0.04: the chop hold's grip and tip (on the board, 0.2-0.3 m from the lens) must project or the arm falls back to P07.
    ycam: orbit(T.FACE, yaw, mix(0.95, 0.85, e), 1.4, 1050, 600, 0, 0, BOARD_NEAR),
    opts: {
      pieces: b05Pieces(5 + done), cook, cullNear: 0.35,
      mist: [rim(-1, 0), rim(1, 1), ...(faint > 0 ? [{from: beside(SET.cook, yaw, 0.08, 0.16, 1.15), to: beside(SET.cook, yaw, 0.15, 0.06, 1.36), reach: faint, t: t + 1.3, n: 1, width: 0.55, alpha: 0.55 * (1 - prog(f, 55, 66))}] : [])],
    },
  };
};

// ---- S01-B06-SH04 (125 f): sharp knife, slow cut. `cam: T-ONION, yaw -80, r 0.55 -> 0.48 slow push (linear), eye 0.98, f 1700, hy 700`
// (start = B02-SH02 start; her face is off frame left, her forearm and fist on the handle as there). O4, a fresh half onion cut face
// down at T-ONION, its stem-root axis 40 deg off the view axis (root end toward the lens and left) so the slice's cut face turns to
// the lens. The blade comes in from the top left (fist top left, tip right), descends l 0-20, touches the dome l 31, one slow stroke l 31-90
// (0.10 m forward, 0.07 m down), the slice falls away l 90-100, the knife lifts l 100-124. Droplets: 3 at l 72, 1 at l 82 (sheet
// 2-4, l 67-90); one thin lilac thread from the cut l 70-124.
// W5.3 fix round 1 (viewer check r1: "a knife with no hand"; AI13 value change, Film owner): the cut turns 80 deg about the vertical
// (axis 130 -> 210 deg, blade 40 -> 120 deg = B02-SH02's blade line) and the spine tilts 0.35 -> 0.80 rad, so the handle runs back
// toward her and up and her forearm and fist on it come into frame from the top left as in B02-SH02 (at 40 deg the handle pointed at
// the lens and the fist projected ~700 px left of frame). The root end now turns 40 deg to the lens's left instead of its right:
// the slice's cut face still meets the lens.
export const B06SH04_DOME = {axis: 210 * DEG, s: 0.035, dirAng: 120 * DEG, tilt: 0.8};
const b06sh04 = (f: number): Spec => {
  const D = B06SH04_DOME, r = SET.onionR, A = r * 1.06, at: V3 = [O1[0], SET.board.y1, O1[2]];
  const e1: [number, number] = [Math.cos(D.axis), Math.sin(D.axis)], cs: V3 = [at[0] + e1[0] * D.s, at[1], at[2] + e1[1] * D.s];
  const top = at[1] + A * Math.sqrt(1 - (D.s / (r * 0.92)) ** 2), stroke = prog(f, 31, 90);
  // Edge contact 0.03 m behind the tip: above the slice line, down onto the dome by l 31, then forward and down to the board.
  const my = f < 20 ? mix(1.2, top + 0.012, easeOut(f / 20)) : f < 31 ? mix(top + 0.012, top, prog(f, 20, 31)) : f < 100 ? top - 0.068 * stroke : mix(top - 0.068, 1.12, easeIn(prog(f, 100, 124)));
  const d3: V3 = [Math.cos(D.dirAng) * Math.cos(D.tilt), -Math.sin(D.tilt), Math.sin(D.dirAng) * Math.cos(D.tilt)], fwd = -0.1 + 0.1 * stroke;
  const mid: V3 = [cs[0] + Math.cos(D.dirAng) * fwd, my, cs[2] + Math.sin(D.dirAng) * fwd];
  const tip = add(mid, d3, 0.03);
  const fall = easeOut(prog(f, 90, 100));
  return {
    ycam: orbit(T.ONION, -80, mix(0.55, 0.48, f / 124), 0.98, 1700, 700, 0, 0, BOARD_NEAR),
    opts: {
      pieces: [O1_HALVES, {kind: 'dome', at, axis: D.axis, cut: {s: D.s, depth: f < 31 ? 0 : stroke, fall}}],
      knife: {tip, dirAng: D.dirAng, tilt: D.tilt, hand: true, inPiece: 1},
      droplets: [{from: [cs[0], top - 0.01, cs[2]], spread: 0.03, l0: 72, f, n: 3, toward: towardLens(-80), life: 10}, {from: [cs[0], top - 0.03, cs[2]], spread: 0.02, l0: 82, f, n: 1, toward: towardLens(-80), life: 10}],
      ...(f >= 70 ? {mist: {from: [cs[0], top - 0.01, cs[2]], to: [cs[0] + 0.01, 1.22, cs[2] - 0.02], reach: easeOut(prog(f, 70, 124)), t: f / FPS, n: 1, width: 0.25, alpha: 1}} : {}),
    },
  };
};

// ---- Group G-F: B07, the alarm (scene sheet s01-b06-b07.md SS-R2). O4 (the B06-SH04 half onion) turned cut face up at T-ONION,
// its stem-root axis along +x (root to screen right and a little away from every B07 camera); the O1 halves stay at the board end.
export const B07_O4 = {at: [O1[0], SET.board.y1, O1[2]] as V3, axis: 0};
const o4 = (trim = 0): OnionPiece => ({kind: 'cup', at: B07_O4.at, axis: B07_O4.axis, ...(trim ? {trim} : {})});
/** The bell's idle swing (SH02 from l 50, SH03 between strokes): +-4 deg at 3 Hz. */
const bellIdle = (f: number) => 4 * DEG * Math.sin((2 * Math.PI * 3 * f) / FPS);
/** B01-SH01's cook (knife low beside the board, out of frame; left hand on the island) with the goggles on (B06-SH02 on). */
const b07Cook = (f: number): CookState => ({
  pose: 'P07', face: 'neutral', knife: 'raised', hold: {grip: [-0.55, 0.97, -0.38], tip: [-0.75, 0.93, -0.16]}, holdMix: 1, holdElbow: [-0.12, -0.24],
  rise: breath(f), faceAdd: {tears: 0}, goggles: {lift: 0},
});

// ---- S01-B07-SH01 (58 f): the onion means no harm. `cam: T-ONION, yaw -45 -> -30 arc (reverse of B01-SH01), r 0.52, eye 1.20,
// pitch -15, f 1700, hy 600`, ease in-out l 0-57. O4 rings up, still; the cook a soft apron behind, goggled face above the frame.
// Boss W5.2 feasibility change (AI13, Film owner; as B01-SH01): hy 600 -> 440 on SH01 and SH02. At 600 her mouth and chin are in
// frame at the top (y ~ 0-121); at 440 the face is out and O4 sits 160 px higher (top 593, still under the SH02 bell's y 520).
export const B07_HY = B01SH01_HY;
const b07sh01 = (f: number): Spec => ({
  ycam: orbit(T.ONION, mix(-45, -30, inOut(f / 57)), 0.52, 1.2, 1700, B07_HY, -15),
  opts: {pieces: [O1_HALVES, o4()], cook: b07Cook(f), cookSoft: 0.5},
});

// ---- S01-B07-SH02 (80 f): "like the onion's burglar alarm". `cam: T-ONION, yaw -30, r 0.52 -> 0.47 push, eye 1.20, pitch -15,
// f 1700, hy 600`, ease in-out l 0-79. The chalk bell (N9) draws on l 32-50 at (540, 420), 200 px tall, then idles +-4 deg at 3 Hz.
export const B07SH02_BELL = {x: 540, y: 420, size: 200, from: 32, to: 50};
const b07sh02 = (f: number): Spec => {
  const B = B07SH02_BELL;
  return {
    ycam: orbit(T.ONION, -30, mix(0.52, 0.47, inOut(f / 79)), 1.2, 1700, B07_HY, -15),
    opts: {pieces: [O1_HALVES, o4()], cook: b07Cook(f), cookSoft: 0.5},
    doodles: f < B.from ? [] : [{kind: 'bell', x: B.x, y: B.y, size: B.size, draw: prog(f, B.from, B.to), ...(f > B.to ? {rot: bellIdle(f - B.to)} : {})}],
  };
};

// ---- S01-B07-SH03 (85 f, end, `A_fade` by the Editor): "...that rings only on a break-in". `cam: T-CHEST, yaw -30 -> -42 arc,
// r 1.20 -> 1.70 dolly back, eye 1.30, f 1000, hy 560`, ease-out to a near-stop by l 40, then a 0.02 m drift to l 84 (no freeze).
// Goggled, dry-eyed, deadpan, gaze on the board; knife strokes (tip on the board) at l 12, 42, 72, each trimming 0.012 m off O4's
// root end and dropping a slice beside it; the bell rides above O4 (size with the camera's unit at O4), +-8 deg for 18 f on each
// stroke, idle swing between.
export const B07SH03_CHOPS = [12, 42, 72] as const;
const B07_TRIM = 0.012;
/** Chop hold at O4's root end after `k` strokes, rocking on the tip (as `sliceHold`): the blade crosses the axis at the cut plane. */
const cupHold = (k: number, lift: number): KnifeHold => {
  const tip: V3 = [B07_O4.at[0] + SET.onionR * 0.92 - B07_TRIM * (k + 1) + 0.004, SET.board.y1 + 0.001 + 0.02 * lift, 0.095], th = (23 + 32 * lift) * DEG, h = [-0.12, -0.99];
  return {tip, grip: [tip[0] + 0.28 * Math.cos(th) * h[0], tip[1] + 0.28 * Math.sin(th), tip[2] + 0.28 * Math.cos(th) * h[1]]};
};
// Boss W5.2 value change (AI13, Film owner): dolly end r 1.70 -> 1.68 (1.66 by l 40, then the 0.02 m drift). At 1.70 the measured
// lead (island far edge - head top) is 476 px, under the sheet's >= 480; at 1.68 it is 482.
export const B07SH03_R = {r0: 1.2, r40: 1.66, r1: 1.68};
/** Camera progress 0..1 (l 0 -> l 84) for the bell's size and offset. */
const b07sh03U = (f: number) => (b07sh03R(f) - B07SH03_R.r0) / (B07SH03_R.r1 - B07SH03_R.r0);
const b07sh03R = (f: number) => mix(B07SH03_R.r0, B07SH03_R.r40, easeOut(prog(f, 0, 40))) + (B07SH03_R.r1 - B07SH03_R.r40) * prog(f, 40, 84);
export const b07sh03Cam = (f: number): YCam => orbit(T.CHEST, mix(-30, -41.6, easeOut(prog(f, 0, 40))) - 0.4 * prog(f, 40, 84), b07sh03R(f), 1.3, 1000, 560);
const b07sh03 = (f: number): Spec => {
  const C = B07SH03_CHOPS, done = chopsDone(f, C), ycam = b07sh03Cam(f);
  const cook: CookState = {
    pose: 'P07', face: 'neutral', knife: 'raised', hold: cupHold(Math.min(done && f - C[done - 1] <= 2 ? done - 1 : done, C.length - 1), chopLift(f, C, 30)), holdMix: 1, holdElbow: [-0.1, -0.2],
    look: [-0.15, 1], faceAdd: {tears: 0}, rise: breath(f), goggles: {lift: 0},
  };
  const slices: OnionPiece[] = done ? [{kind: 'slices', at: [B07_O4.at[0] + SET.onionR * 0.92 + 0.03, O1[1], 0.035], n: done}] : [];
  const bell = b07sh03Bell(f);
  return {
    ycam,
    opts: {pieces: [O1_HALVES, o4(B07_TRIM * done), ...slices], cook},
    doodles: bell ? [{kind: 'bell', ...bell, draw: 1}] : [],
  };
};
/**
 * B07-SH03's bell (px), anchored to O4: x = O4 centre + `dx`, y over its top, sized and lifted with the camera's progress. W5.2: the
 * sheet's (569, 840) 130 px at l 0 and (722, 640) 90 px at l 84 (the sheet's "top - 150" was the whole-onion sphere's top; the cup's
 * projected top is lower, so the lift is 230 -> 200 px over the cup's top).
 * W5.3 fix round 1 (viewer check r1: at l 0-6 the bell sat on the blade and fist, and 90 px at the end read as a speck; AI13 value
 * change, Film owner): the bell starts right of and above the knife (O4 + 230, 60 px higher) and eases to O4 + 140, 20 px higher, over
 * l 12-24 (the blade is down on the first chop), growing to 110 px at the end. Measured on the stills (blade pixels to the bell's
 * box, ring marks included): >= 46 px clear on every even frame l 0-84 (was 0 at l 0-8 and 11 at l 30-36).
 */
export const B07SH03_BELL = {dx0: 230, up0: 60, dx1: 140, up1: 20, from: 12, to: 24, size0: 130, size1: 110, lift0: 230, lift1: 200};
export const b07sh03Bell = (f: number) => {
  const B = B07SH03_BELL, C = B07SH03_CHOPS, done = chopsDone(f, C), ycam = b07sh03Cam(f);
  const ox = cupExtent(ycam, B07_O4.at, B07_O4.axis), u = b07sh03U(f);
  if (!ox) return null;
  const since = done ? f - C[done - 1] : 99;
  const rot = since < 18 ? 8 * DEG * Math.sin((2 * Math.PI * 3 * since) / FPS) * (1 - since / 18) ** 0.5 : bellIdle(f);
  const e = inOut(prog(f, B.from, B.to));
  return {x: ox.cx + mix(B.dx0, B.dx1, e), y: ox.top - mix(B.lift0, B.lift1, u) - mix(B.up0, B.up1, e), size: mix(B.size0, B.size1, u), rot};
};

const SPECS: Record<Edu2ShotId, (f: number) => Spec> = {
  'S01-B01-SH01': b01sh01, 'S01-B01-SH02': b01sh02, 'S01-B01-SH03': b01sh03, 'S01-B02-SH01': b02sh01, 'S01-B02-SH02': b02sh02,
  'S01-B03-SH01': b03sh01, 'S01-B03-SH02': b03sh02, 'S01-B03-SH03': b03sh03,
  'S01-B04-SH01': b04sh01, 'S01-B04-SH02': b04sh02, 'S01-B04-SH03': b04sh03,
  'S01-B05-SH01': b05sh01, 'S01-B05-SH02': b05sh02, 'S01-B05-SH03': b05sh03, 'S01-B05-SH04': b05sh04, 'S01-B05-SH05': b05sh05,
  'S01-B06-SH01': b06sh01, 'S01-B06-SH02': b06sh02, 'S01-B06-SH03': b06sh03, 'S01-B06-SH04': b06sh04,
  'S01-B07-SH01': b07sh01, 'S01-B07-SH02': b07sh02, 'S01-B07-SH03': b07sh03,
};

const KITCHEN_GRADE = 'radial-gradient(ellipse 95% 75% at 45% 40%, rgba(255,236,190,0) 55%, rgba(90,54,40,0.22) 100%)';
/** CELL paper and grade (as the LF02 look frame). */
export const EDU2_CELL_PAPER = '#f3dfa6';
const CELL_GRADE = 'radial-gradient(ellipse 90% 70% at 50% 32%, rgba(255,244,210,0.10) 0%, rgba(160,110,40,0) 55%, rgba(150,96,40,0.22) 100%)';
/** EYE paper (skin) and grade (as the LF03 look frame). */
export const EDU2_EYE_PAPER = '#8a5a3b';
const EYE_GRADE = 'radial-gradient(ellipse 95% 70% at 50% 45%, rgba(255,240,220,0) 50%, rgba(50,28,18,0.25) 100%)';

/**
 * The plate of one shot at shot-local frame `f`: world camera and painter (the 2D plate camera is still). `f` is held in the
 * shot's own range, so the outgoing plate of an in-canvas dissolve (painted past its end) stays frozen on its last frame
 * (B02-SH02 at l 39 under the B03-SH01 dissolve, SS-R2).
 */
export const plateOf = (id: Edu2ShotId, f: number): Edu2Plate => {
  const s = SPECS[id](Math.max(0, Math.min(EDU2_FRAMES[id] - 1, f)));
  if (s.eye) {
    const eye = s.eye;
    return {cam: STILL_CAMERA, ycam: s.ycam, paper: EDU2_EYE_PAPER, grade: EYE_GRADE, paint: (p) => paintEyeMacro(p, s.ycam, {t: p.t, u: eye.u})};
  }
  if (s.cell) {
    const cell = s.cell;
    return {cam: STILL_CAMERA, ycam: s.ycam, paper: EDU2_CELL_PAPER, grade: CELL_GRADE, paint: (p) => paintCellMacro(p, s.ycam, {t: p.t, ...cell})};
  }
  const opts = s.opts, dd = s.doodles ?? [];
  return {cam: STILL_CAMERA, ycam: s.ycam, paper: EDU2_PAPER, grade: KITCHEN_GRADE, paint: (p) => {
    paintKitchen(p, s.ycam, {t: p.t, ...opts});
    dd.forEach((d, i) => paintDoodle(p, 47000 + i * 40, d));
  }};
};

/** Measured projection of a CELL shot frame (px): hero wall box, contents box (the B03 essentials) and the lilac puffs. */
export const cellMetricsOf = (id: Edu2ShotId, f: number) => {
  const s = SPECS[id](f);
  return s.cell ? heroExtent(s.ycam, {t: f / FPS, ...s.cell}) : null;
};

/** Measured projection of the frame (px, sheet numbers): hero onion tip / centre / base / width and the cook's head top, eyes, chin. */
export const metricsOf = (id: Edu2ShotId, f: number) => {
  const sp = SPECS[id](f), c = sp.ycam, o = id === 'S01-B02-SH01' && f < 10 ? undefined : O1, cookAt = sp.opts?.cook?.at ?? SET.cook;
  const r = SET.onionR, py = (v: V3) => camPoint(c, v)?.[1] ?? NaN, px = (v: V3) => camPoint(c, v)?.[0] ?? NaN;
  const onion = o && (() => {
    const R = r * camUnit(c, o), y = py(o);
    // paintOnion's picture build: tip strand top y - 1.52 R, body bottom y + 0.92 R, root tuft to ~y + 1.0 R; width 2.12 R.
    return {cx: Math.round(px(o)), cy: Math.round(y), tip: Math.round(y - 1.52 * R), bodyTop: Math.round(y - 1.14 * R), base: Math.round(y + 1.0 * R), width: Math.round(2.12 * R)};
  })();
  const ck = (yy: number): V3 => [cookAt[0], yy, cookAt[2]];
  const o4x = id.startsWith('S01-B07') ? cupExtent(c, B07_O4.at, B07_O4.axis) : undefined;
  return {onion, ...(o4x ? {o4: o4x} : {}), cook: {headTop: Math.round(py(ck(1.66))), eyes: Math.round(py(ck(1.4))), eyesX: Math.round(px(ck(1.4))), chin: Math.round(py(ck(1.215))), islandFar: Math.round(py([0, 0.9, -0.3]))}};
};

/** Standalone plate (stills and QA; the timeline uses a registry adapter over `plateOf` on PaintedStage's one canvas). */
export const ShotPlate = ({id}: {id: Edu2ShotId}) => {
  const {paper, grade} = plateOf(id, 0);
  const fn = useCallback(({brush, frame: fr}: PaintContext) => plateOf(id, fr).paint(makePainter(flatFillBrush(brush), {t: fr / FPS, frame: fr, fade: paper})), [id, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <AbsoluteFill style={{pointerEvents: 'none', background: grade}} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

/** In-canvas dissolves of this episode (SS-R2): outgoing shot, incoming shot, dissolve frames (`painted.shots[].dissolveSec` x fps). */
export const EDU2_DISSOLVES = [['S01-B02-SH02', 'S01-B03-SH01', 15]] as const satisfies readonly (readonly [Edu2ShotId, Edu2ShotId, number])[];
/**
 * QA stand-in for the timeline dissolve (src/scenes/painted.ts `platesAt` + PaintedStage): frame l of the incoming shot, with the
 * outgoing plate painted first at its l n+l (held on its last frame by `plateOf`) and the incoming one over it at alpha (l+1)/(d+1),
 * its paper laid first, ink fading toward the outgoing paper. Past l d-1 it is the incoming plate alone.
 */
export const DissolvePlate = ({from, to, frames: d}: {from: Edu2ShotId; to: Edu2ShotId; frames: number}) => {
  const frame = useCurrentFrame();
  const a = plateOf(from, 0), b = plateOf(to, 0), mixA = frame < d ? (frame + 1) / (d + 1) : 1;
  const fn = useCallback(
    ({brush, frame: fr}: PaintContext) => {
      if (fr < d) {
        const f0 = EDU2_FRAMES[from] + fr;
        plateOf(from, f0).paint(makePainter(flatFillBrush(brush), {t: f0 / FPS, frame: f0, fade: a.paper}));
      }
      const alpha = fr < d ? (fr + 1) / (d + 1) : 1;
      const p = makePainter(flatFillBrush(brush), {t: fr / FPS, frame: fr, alpha, fade: fr < d ? a.paper : b.paper});
      if (fr < d) p.flat(b.paper, span(1080, -200, 2120));
      plateOf(to, fr).paint(p);
    },
    [from, to, d, a.paper, b.paper],
  );
  return (
    <AbsoluteFill style={{background: a.paper}}>
      <BrushCanvas paint={fn} paper={a.paper} />
      <AbsoluteFill style={{pointerEvents: 'none', background: a.grade, opacity: 1 - mixA}} />
      <AbsoluteFill style={{pointerEvents: 'none', background: b.grade, opacity: mixA}} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

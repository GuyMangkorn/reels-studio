import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {STILL_CAMERA, type Camera} from '../kit/camera';
import {makePainter, ramp, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {camPoint, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {paintKitchen, SET, T, type CookState, type KitchenOpts, type OnionPiece} from './kitchen';

// EDU-EP02-SHORT shot plates (Boss W5.2; scene sheets SS-R2 under brief EDU-BRIEF-R1.5, scripts/edu-series/ep02/scenes/).
// One entry per timeline scene: its length, world camera (kit yaw camera inside SET-KITCHEN) and painter as pure functions of
// the shot-local frame `f` (30 fps), so the Editor mounts `plateOf(id, f)` in a registry adapter and every frame is seekable.
// The 2D plate camera is `STILL_CAMERA`: every move is the world camera's (painted 3D camera, no picture push). Nothing here
// draws text; captions, narration, sound and the channel mark belong to the scene sheets and the Editor.
// Group G-A (S01-B01-SH01..SH03, S01-B02-SH01..SH02): N3 chop, N4 halves, N7 droplets (kitchen.ts). Other groups append here.

export const EDU2_SHOTS = [
  ['S01-B01-SH01', 57],
  ['S01-B01-SH02', 59],
  ['S01-B01-SH03', 44],
  ['S01-B02-SH01', 124],
  ['S01-B02-SH02', 40],
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

export type Edu2Plate = {cam: Camera; ycam: YCam; paint: (p: Painter) => void};
type Spec = {ycam: YCam; opts: Omit<KitchenOpts, 't'>};

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

const SPECS: Record<Edu2ShotId, (f: number) => Spec> = {
  'S01-B01-SH01': b01sh01, 'S01-B01-SH02': b01sh02, 'S01-B01-SH03': b01sh03, 'S01-B02-SH01': b02sh01, 'S01-B02-SH02': b02sh02,
};

/** The plate of one shot at shot-local frame `f`: world camera and painter (the 2D plate camera is still). */
export const plateOf = (id: Edu2ShotId, f: number): Edu2Plate => {
  const s = SPECS[id](f);
  return {cam: STILL_CAMERA, ycam: s.ycam, paint: (p) => void paintKitchen(p, s.ycam, {t: p.t, ...s.opts})};
};

/** Measured projection of the frame (px, sheet numbers): hero onion tip / centre / base / width and the cook's head top, eyes, chin. */
export const metricsOf = (id: Edu2ShotId, f: number) => {
  const c = SPECS[id](f).ycam, o = id === 'S01-B02-SH01' && f < 10 ? undefined : O1;
  const r = SET.onionR, py = (v: V3) => camPoint(c, v)?.[1] ?? NaN, px = (v: V3) => camPoint(c, v)?.[0] ?? NaN;
  const onion = o && (() => {
    const R = r * camUnit(c, o), y = py(o);
    // paintOnion's picture build: tip strand top y - 1.52 R, body bottom y + 0.92 R, root tuft to ~y + 1.0 R; width 2.12 R.
    return {cx: Math.round(px(o)), cy: Math.round(y), tip: Math.round(y - 1.52 * R), bodyTop: Math.round(y - 1.14 * R), base: Math.round(y + 1.0 * R), width: Math.round(2.12 * R)};
  })();
  const ck = (yy: number): V3 => [SET.cook[0], yy, SET.cook[2]];
  return {onion, cook: {headTop: Math.round(py(ck(1.66))), eyes: Math.round(py(ck(1.4))), eyesX: Math.round(px(ck(1.4))), chin: Math.round(py(ck(1.215))), islandFar: Math.round(py([0, 0.9, -0.3]))}};
};

/** Standalone plate (stills and QA; the timeline uses a registry adapter over `plateOf` on PaintedStage's one canvas). */
export const ShotPlate = ({id}: {id: Edu2ShotId}) => {
  const fn = useCallback(({brush, frame: fr}: PaintContext) => plateOf(id, fr).paint(makePainter(brush, {t: fr / FPS, frame: fr, fade: EDU2_PAPER})), [id]);
  return (
    <AbsoluteFill style={{background: EDU2_PAPER}}>
      <BrushCanvas paint={fn} paper={EDU2_PAPER} />
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 95% 75% at 45% 40%, rgba(255,236,190,0) 55%, rgba(90,54,40,0.22) 100%)'}} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

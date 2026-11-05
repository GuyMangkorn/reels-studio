import {useCallback, useLayoutEffect, useRef, type ReactNode} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {PaintedLabel} from '../Label';
import {ell, inkLine, solid, washAt} from '../kit/draw';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {orbitYCam, type YCam} from '../kit/ycam';
import {PARK_LIGHT_B04} from './cast';
import {DogView} from './dog-view-pass';
import {dogMatrixValues} from './dogview';
import {B04_OWNER_AT, B04_DOG_AT, camLF01, LF01_DOG_AT, VBALL_CAM} from './look';
import {BALL_R, paintPark, POS, T, type BallColor, type BallState, type DogState, type OwnerState, type ParkState} from './park';

// EDU-EP03-SHORT shot plates (Boss W5.2; scene sheets SS-R3 under brief EDU-BRIEF-R2.1, scripts/edu-series/ep03/scenes/).
// One entry per timeline scene: its length, world camera (kit yaw camera inside SET-PARK) and painter as pure functions of the
// shot-local frame `l` (30 fps), so the Editor mounts `plateOf(id, l)` in a registry adapter and every frame is seekable.
// Dog view (VD05) is the ONE colour function `dogview.ts` applied to the whole painted picture (SVG feColorMatrix on the canvas);
// the sweeps, the flip backs and the VD09a split are masks over the same strokes (the canvas is copied once and shown with and
// without the filter), so inside and outside a wet edge only the colour differs. Captions, narration, sound and chrome are not here;
// the tag `ภาพจำลอง (โดยประมาณ)` is a screen sibling above the picture.
// Groups: G-A B01-B02 · G-B B03-B04 · G-C B05-B07.

export const EDU3_SHOTS = [
  ['S01-B01-SH01', 60],
  ['S01-B01-SH02', 90],
  ['S01-B02-SH01', 68],
  ['S01-B02-SH02', 94],
  ['S01-B02-SH03', 64],
  ['S01-B02-SH04', 90],
  ['S01-B03-SH01', 87],
  ['S01-B03-SH02', 75],
  ['S01-B03-SH03', 101],
  ['S01-B04-SH01', 145],
  ['S01-B04-SH02', 187],
  ['S01-B05-SH01', 143],
  ['S01-B06-SH01', 56],
  ['S01-B06-SH02', 116],
  ['S01-B07-SH01', 195],
] as const satisfies readonly (readonly [string, number])[];
export type Edu3ShotId = (typeof EDU3_SHOTS)[number][0];
export const EDU3_FRAMES: Record<Edu3ShotId, number> = Object.fromEntries(EDU3_SHOTS) as Record<Edu3ShotId, number>;
/** Composition start frame of each shot (SS-R3 shot map), and the range the tag is on. */
export const EDU3_START: Record<Edu3ShotId, number> = {
  'S01-B01-SH01': 0, 'S01-B01-SH02': 60, 'S01-B02-SH01': 150, 'S01-B02-SH02': 218, 'S01-B02-SH03': 312, 'S01-B02-SH04': 376, 'S01-B03-SH01': 466,
  'S01-B03-SH02': 553, 'S01-B03-SH03': 628, 'S01-B04-SH01': 729, 'S01-B04-SH02': 874, 'S01-B05-SH01': 1061, 'S01-B06-SH01': 1204, 'S01-B06-SH02': 1260, 'S01-B07-SH01': 1376,
};

const FPS = 30;
const DEG = Math.PI / 180;
export const EDU3_PAPER = '#f3e6c4';
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(u));
const lin = (a: number, b: number, u: number) => a + (b - a) * u;
const seg = (l: number, a: number, b: number) => clamp((l - a) / (b - a));
const eseg = (l: number, a: number, b: number) => ease(seg(l, a, b));
const lerp3 = (a: V3, b: V3, u: number): V3 => [lin(a[0], b[0], u), lin(a[1], b[1], u), lin(a[2], b[2], u)];

const RED: BallColor = 'red', BLUE: BallColor = 'blue';
const B1: V3 = [-0.25, 0, -0.08], W: V3 = [-0.25, 0, -0.95], L1 = POS.L1, R0 = POS.R0, LANE_Z = -0.9;
const ballAt = (v: V3, color: BallColor): BallState => ({at: [v[0], Math.max(BALL_R, v[1]), v[2]], color});

/** `V-BALL` on its truck: camera-right metres `cr` from the LF02 position (index baseline). */
const vball = (cr: number, push = 0): YCam => ({...VBALL_CAM, x: VBALL_CAM.x + 0.719 * cr + 0.695 * push, z: VBALL_CAM.z + 0.695 * cr - 0.719 * push});

/** The thrown ball's last 26 frames before it settles (B02-SH02 / B06-SH02, shared): off-frame `L1` hit l 4, `B1` touch l 12, rest at `R0` l 26. */
const ballLane = (l: number): V3 => {
  if (l <= 4) return lerp3([L1[0] - 0.3, 1.1, L1[2] + 0.15], [L1[0], BALL_R, L1[2]], l / 4);
  if (l <= 12) { const t = (l - 4) / 8, g = lerp3([L1[0], 0, L1[2]], B1, t); return [g[0], BALL_R + 0.25 * 4 * t * (1 - t), g[2]]; }
  if (l <= 26) { const t = 1 - Math.pow(1 - (l - 12) / 14, 2), g = lerp3(B1, R0, t); return [g[0], BALL_R, g[2]]; }
  return [R0[0], BALL_R, R0[2]];
};

type Over = {to: 'dog' | 'normal'; mask: string};
type Spec = {
  cam: YCam; st: ParkState;
  /** Dog view on the whole picture (base). */
  dog?: boolean;
  /** Second layer: the same strokes in the other colour state, shown through a mask (sweep, flip back, split). */
  over?: Over;
  tag?: boolean;
  /** Picture-space marks (chalk bubbles: inside the colour map). */
  extra?: (p: Painter, cam: YCam) => void;
  /** Screen layers above the picture (unmapped): labels, card, strike. */
  screen?: ReactNode;
};
const radial = (cx: number, cy: number, r: number, edge = 80): string | null => r <= 0 ? null : `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, r - edge)}px, rgba(0,0,0,0) ${r}px)`;
/** Radial dog-view sweep out of (cx, cy): `k` 0..1 of the way to the far corner. */
const sweepIn = (cx: number, cy: number, k: number, far: number): {dog: boolean; over?: Over} => {
  if (k >= 1) return {dog: true};
  const m = radial(cx, cy, k * (far + 80));
  return m ? {dog: false, over: {to: 'dog', mask: m}} : {dog: false};
};
/** Flip back to normal colour, radial out of (cx, cy). */
const sweepOut = (cx: number, cy: number, k: number, far: number): {dog: boolean; over?: Over} => {
  if (k >= 1) return {dog: false};
  const m = radial(cx, cy, k * (far + 80));
  return m ? {dog: true, over: {to: 'normal', mask: m}} : {dog: true};
};
const farCorner = (cx: number, cy: number) => Math.max(...[[0, 0], [1080, 0], [0, 1920], [1080, 1920]].map(([x, y]) => Math.hypot(x - cx, y - cy)));

// ------------------------------------------------------------------------------------------------------------ chalk (N7)
const CHALK = '#f2efe6', CHALK_BG = '#34373e';
/** Chalk magnifier bubble: dark round board, chalk rim, tail to the eye, `cones` neutral chalk cones (identical), opening over 8 f. */
const chalkBubble = (p: Painter, seed: number, eye: Pt, c: Pt, d: number, cones: number, open: number, popped: number[]) => {
  if (open <= 0) return;
  const r = (d / 2) * open;
  const tail: Pt[] = [[lin(c[0], eye[0], open), lin(c[1] + r, eye[1], open)], [c[0] - r * 0.42, c[1] + r * 0.9], [c[0] + r * 0.02, c[1] + r * 0.99]];
  solid(p, seed, CHALK_BG, tail, 4, 0.03, 0.08);
  solid(p, seed + 1, CHALK_BG, ell(c[0], c[1], r, r, 28), 4, 0.03, 0.08);
  inkLine(p, seed + 2, ell(c[0], c[1], r, r, 28), {weight: 1.1, color: CHALK});
  inkLine(p, seed + 3, tail, {closed: false, weight: 0.9, color: CHALK});
  const w = d * 0.075, h = d * 0.19, gap = d * 0.24, x0 = c[0] - ((cones - 1) * gap) / 2;
  for (let i = 0; i < cones; i++) {
    const k = clamp(popped[i] ?? 0);
    if (k <= 0) continue;
    const cx = x0 + i * gap, cy = c[1], s = 0.4 + 0.6 * ease(k);
    const cone: Pt[] = [[cx - w * s, cy - h * s * 0.55], [cx + w * s, cy - h * s * 0.55], [cx + w * 0.25 * s, cy + h * s * 0.7], [cx - w * 0.25 * s, cy + h * s * 0.7]];
    solid(p, seed + 10 + i, '#d9d7cf', cone, 4, 0.03, 0.08);
    inkLine(p, seed + 20 + i, cone, {weight: 0.8, color: CHALK});
    solid(p, seed + 30 + i, '#bfbdb4', ell(cx, cy - h * s * 0.72, w * s * 1.0, w * s * 0.55, 10), 3, 0.03, 0.08);
  }
};
/** Grey thought bubble from the dog's head with a tiny grey park (B04-SH02, mapped like the picture; already neutral). */
const thoughtBubble = (p: Painter, seed: number, from: Pt, c: Pt, d: number, open: number) => {
  if (open <= 0) return;
  const r = (d / 2) * open;
  [[0.18, 7], [0.4, 12], [0.64, 18]].forEach(([k, rr], i) => { const q: Pt = [lin(from[0], c[0], k), lin(from[1], c[1], k) + (r > 0 ? r * 0.55 * k : 0)]; solid(p, seed + i, '#e4e4e4', ell(q[0], q[1], rr * open, rr * open, 10), 3, 0.03, 0.08); inkLine(p, seed + 5 + i, ell(q[0], q[1], rr * open, rr * open, 10), {weight: 0.7, color: '#8a8a8a'}); });
  const cloud: Pt[] = Array.from({length: 40}, (_, i): Pt => { const a = (i / 40) * 6.283, j = 1 + 0.07 * Math.sin(a * 6); return [c[0] + r * 1.12 * j * Math.cos(a), c[1] + r * 0.9 * j * Math.sin(a)]; });
  solid(p, seed + 10, '#ececec', cloud, 5, 0.03, 0.08);
  inkLine(p, seed + 11, cloud, {weight: 1.0, color: '#8a8a8a'});
  // tiny grey park: sky, lawn, two trees, a bench line, the ball
  const s = r / 150, px = (u: number, v: number): Pt => [c[0] + u * s, c[1] + v * s];
  solid(p, seed + 12, '#cfcfcf', [px(-110, -60), px(110, -60), px(110, 30), px(-110, 30)], 3, 0.03, 0.08);
  solid(p, seed + 13, '#8c8c8c', [px(-110, 30), px(110, 30), px(110, 70), px(-110, 70)], 3, 0.03, 0.08);
  solid(p, seed + 14, '#6f6f6f', ell(...px(-55, -15), 36 * s, 30 * s, 12), 3, 0.03, 0.08);
  solid(p, seed + 15, '#7a7a7a', ell(...px(50, -10), 40 * s, 24 * s, 12), 3, 0.03, 0.08);
  solid(p, seed + 16, '#5f5f5f', [px(-60, 6), px(-52, 6), px(-52, 40), px(-60, 40)], 3, 0.03, 0.08);
  solid(p, seed + 17, '#767676', ell(...px(10, 52), 8 * s, 8 * s, 10), 3, 0.03, 0.08);
};

const THAI = {fontFamily: 'Noto Sans Thai', fontWeight: 700, color: '#fff', WebkitTextStroke: '6px #1d2129', paintOrder: 'stroke fill', textShadow: '0 3px 0 #1d2129'} as const;
const popLabel = (text: string, x: number, y: number, k: number): ReactNode => k <= 0 ? null : (
  <div key={text} lang="th" style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * ease(k)})`, opacity: clamp(k * 2), ...THAI, fontSize: 52, lineHeight: 1, whiteSpace: 'nowrap'}}>{text}</div>
);
/** Card `ขาวดำ` with its red strike (screen layers, never mapped). */
const strikeCard = (cx: number, cy: number, w: number, h: number, show: number, strike: number): ReactNode => show <= 0 ? null : (
  <div key="card" style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `scale(${0.8 + 0.2 * ease(show)})`, opacity: clamp(show * 3)}}>
    <div style={{position: 'absolute', inset: 0, background: '#f7f4ec', border: '4px solid #1d2129', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span lang="th" style={{fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 56, color: '#1d2129', lineHeight: 1}}>ขาวดำ</span>
    </div>
    <svg width={w + 80} height={h + 80} style={{position: 'absolute', left: -40, top: -40}}>
      {strike > 0 && <line x1={30} y1={h + 56} x2={30 + (w + 20) * strike} y2={h + 56 - (h + 32) * strike} stroke="#e61b1b" strokeWidth={12} strokeLinecap="round" />}
    </svg>
  </div>
);

// ------------------------------------------------------------------------------------------------------------ owner / dog helpers
const STAND_REL = (x: number, y: number): [number, number] => [x, y];
/** Arm reaching a point in metres from the shoulder (screen right +x, up +y), elbow `via` below/outside. */
const armM = (to: [number, number], via: [number, number]) => ({to: STAND_REL(...to), via: STAND_REL(...via)});
const dogRun = (view: 'left' | 'right' | 'front', l: number, wag = 0.6): DogState['pose'] => ({view, state: 'stand', gait: 'run', walk: l * 0.55, stride: 1, wag, mouth: 'open'});

// ------------------------------------------------------------------------------------------------------------ specs
const SPECS: Record<Edu3ShotId, (l: number) => Spec> = {
  // B01-SH01 = LF01 v2 camera arc; owner pushes the ball toward the lens (holdK), squeeze l 30-36.
  'S01-B01-SH01': (l) => ({
    cam: camLF01(l),
    st: {t: l / FPS, owner: {held: RED, pose: 'P11', face: 'happy', holdK: lin(0.2, 0.34, eseg(l, 0, 20)), squash: 1 - 0.08 * Math.sin(Math.PI * seg(l, 30, 36))},
      dog: {at: LF01_DOG_AT, pose: {view: 'front', state: 'stand', wag: 0.8, mouth: 'open'}}, balls: []},
  }),
  'S01-B01-SH02': (l) => {
    const up = eseg(l, 0, 12), sh = Math.sin(Math.PI * 2 * seg(l, 50, 58)) * 0.03;
    const cam: YCam = {x: lin(-3.55, -3.4, l / 89), y: 0.45, z: 0.15, yaw: -25 * DEG, pitch: 12 * DEG, f: 1150, hy: 1040};
    return {cam, st: {t: l / FPS,
      owner: {held: RED, pose: 'P01', face: 'happy', holdK: 0.1, rArm: armM([lin(-0.05, -0.1 + sh, up), lin(-0.52, 0.49, up)], [lin(-0.02, -0.26, up), lin(-0.26, 0.22, up)])},
      dog: {at: [POS.D0[0] + 0.3, 0, POS.D0[2]], pose: {view: 'left', state: 'stand', wag: 0.5, mouth: 'open'}}, balls: []}};
  },
  // B02-SH01: wind-up l 0-10, release l 12 at (-4.30, 1.90, -1.40), follow-through l 12-24; dog crouches, barks l 6, launches l 15 on z -0.90.
  'S01-B02-SH01': (l) => {
    const cam = orbitYCam(T.TWO, 2.6, lin(-50, -40, l / 67) * DEG, 1.2, 1000, 700);
    const wind = eseg(l, 0, 10), rel = eseg(l, 10, 14), out = eseg(l, 14, 22), follow = eseg(l, 24, 34), swing = armM([0.36, -0.05], [0.14, -0.2]);
    const back = armM([-0.2, 0.42], [-0.34, 0.2]), fwd = armM([0.12, 0.5], [-0.12, 0.34]), down = armM([0.2, -0.32], [0.1, -0.1]), hang = armM([-0.05, -0.52], [-0.02, -0.26]);
    const mix = (a: {to: [number, number]; via: [number, number]}, b: typeof a, u: number) => armM([lin(a.to[0], b.to[0], u), lin(a.to[1], b.to[1], u)], [lin(a.via[0], b.via[0], u), lin(a.via[1], b.via[1], u)]);
    const rArm = l < 12 ? mix(hang, back, wind) : l < 14 ? mix(back, fwd, rel) : l < 24 ? mix(fwd, swing, out) : mix(swing, down, follow);
    const releaseAt: V3 = [-4.3, 1.9, -1.4], t = (l - 12) / 30;
    const flight: V3 = [lin(releaseAt[0], L1[0], t), releaseAt[1] * (1 - t) + 4 * 2.6 * t * (1 - t), lin(releaseAt[2], L1[2], t)];
    const dx = l < 15 ? POS.D0[0] : POS.D0[0] + (l - 15) * 0.13, dz = l < 15 ? POS.D0[2] : lin(POS.D0[2], LANE_Z, seg(l, 15, 22));
    const dogPose = l < 15 ? ({view: 'right', state: 'stand', wag: 0.9, mouth: l >= 6 && l < 14 ? 'open' : 'closed'} as const) : dogRun('right', l - 15, 0.9);
    return {cam, st: {t: l / FPS,
      owner: {held: l < 12 ? RED : undefined, pose: 'P01', face: 'happy', holdK: 0.1, view: 'front', rArm},
      dog: {at: [dx, 0, dz], pose: {...dogPose, ...(l < 6 ? {state: 'stand'} : {})}},
      balls: l >= 12 ? [ballAt(flight, RED)] : []}};
  },
  // B02-SH02 `V-BALL` 1/4: ball lane, then the dog runs past on z -0.90, skids to S1, sniffs both ways, puzzled.
  'S01-B02-SH02': (l) => {
    const cam = vball(lin(-0.25, 0, l / 93));
    let dog: DogState | undefined;
    if (l >= 28) {
      if (l < 40) dog = {at: [(l - 28) * 0.167, 0, LANE_Z], pose: dogRun('right', l)};
      else if (l < 52) dog = {at: [lin(2.0, POS.S1[0], eseg(l, 40, 50)), 0, lin(LANE_Z, POS.S1[2], eseg(l, 40, 50))], pose: l < 50 ? {view: 'right', state: 'stand', stride: 0.2, walk: l * 0.1, wag: 0.1} : {view: 'right', state: 'stand', sniff: 0.5}};
      else if (l < 64) dog = {at: POS.S1, pose: {view: 'left', state: 'stand', sniff: 0.9, wag: 0}};
      else if (l < 76) dog = {at: POS.S1, pose: {view: 'right', state: 'stand', sniff: 0.9, wag: 0}};
      else dog = {at: POS.S1, pose: {view: 'left', state: 'stand', sniff: 0.25, wag: 0}};
    }
    return {cam, st: {t: l / FPS, dog, balls: [ballAt(ballLane(l), RED)]}};
  },
  // B02-SH03: owner alone, points ahead (P05 point-and-say), surprised -> worried; the dog is off-screen.
  'S01-B02-SH03': (l) => {
    const az = lin(25, 30, ease(l / 63)), r = lin(2.2, 2.0, ease(l / 63));
    const cam = orbitYCam(T.OWNER, r, az * DEG, 1.35, 1050, 620);
    const pump = Math.max(Math.sin(Math.PI * seg(l, 8, 14)), Math.sin(Math.PI * seg(l, 16, 22)), Math.sin(Math.PI * seg(l, 40, 46)), Math.sin(Math.PI * seg(l, 50, 56))) * 0.04;
    const up = eseg(l, 0, 8);
    return {cam, st: {t: l / FPS, owner: {pose: 'P01', face: l < 18 ? 'surprised' : 'worried', view: 'front',
      lArm: armM([lin(0.045, 0.52 + pump, up), lin(-0.52, 0.0 + pump * 0.5, up)], [lin(0.02, 0.26, up), lin(-0.26, 0.0, up)])}}};
  },
  // B02-SH04: the dog at its own height, front; head low (sniff) then lifts to the lens; slow push.
  'S01-B02-SH04': (l) => {
    const cam = orbitYCam([2.6, 0.65, -0.72], lin(1.2, 0.6, ease(l / 89)), 0, 0.5, 1000, 940);
    const lift = eseg(l, 40, 52);
    return {cam, st: {t: l / FPS, dog: {at: POS.S1, pose: {view: 'front', state: 'stand', sniff: lin(0.95, 0, lift), wag: 0, headLow: true}}}};
  },
  // B03-SH01 (LF02): the sweep out of the dog's head (u 0->1 over l 0-18), tag on from l 0; small push l 30-86.
  'S01-B03-SH01': (l) => {
    const cam = vball(0, 0.15 * eseg(l, 30, 86));
    const sw = sweepIn(805, 790, eseg(l, 0, 18), farCorner(805, 790));
    return {cam, ...sw, tag: true, st: {t: l / FPS, dog: {at: POS.S1, pose: {view: 'left', state: 'stand', sniff: 0.9, wag: 0}}, balls: [ballAt(R0, RED)]}};
  },
  'S01-B03-SH02': (l) => {
    const e = ease(l / 74);
    const cam: YCam = {x: lin(0.3, 0.5, e), y: lin(0.3, 2.4, e), z: lin(5.8, 7.0, e), yaw: -6 * DEG, f: 860, hy: 760};
    const lowering = eseg(l, 0, 20), hips = eseg(l, 20, 40);
    return {cam, dog: true, tag: true, st: {t: l / FPS,
      owner: {at: POS.O, pose: 'P01', face: 'worried', view: 'front',
        lArm: armM([lin(0.52, lin(0.15, 0.17, hips), lowering), lin(0.0, lin(-0.2, -0.02, hips), lowering)], [lin(0.26, lin(0.1, 0.2, hips), lowering), lin(0.0, lin(-0.1, -0.12, hips), lowering)])},
      dog: {at: POS.S1, pose: {view: 'left', state: 'stand', sniff: 0.7 + 0.2 * Math.sin(l * 0.15), wag: 0}}, balls: [ballAt(R0, RED)]}};
  },
  // B03-SH03: close on the ball; VD09a split divide x 700 -> 540 (l 24) hold -> -80 (l 90), then full dog view.
  'S01-B03-SH03': (l) => {
    const e = ease(l / 100);
    const cam = orbitYCam(T.BALL, lin(0.7, 0.6, e), lin(20, 12, e) * DEG, 0.25, 1100, 640);
    const x = l < 24 ? lin(700, 540, eseg(l, 0, 24)) : l < 64 ? 540 : lin(540, -80, eseg(l, 64, 90));
    const edge = 60, done = l >= 90 + 10;
    return {cam, tag: true, dog: false, over: done ? undefined : {to: 'dog', mask: `linear-gradient(to right, rgba(0,0,0,0) ${x - edge / 2}px, #000 ${x + edge / 2}px)`},
      st: {t: l / FPS, balls: [ballAt(R0, RED)]}, ...(l >= 100 ? {dog: true, over: undefined} : {})};
  },
  // B04-SH01: kneel, sit; chalk bubble 1 (three cones), label 1, bubble 2 (two cones), label 2. Dog view, tag on.
  'S01-B04-SH01': (l) => {
    const e = ease(l / 144);
    const cam = orbitYCam(T.TWO, lin(2.0, 1.8, e), lin(-15, -5, e) * DEG, 0.9, 1000, 700);
    const owner: OwnerState = {at: B04_OWNER_AT, pose: 'P34', face: l < 80 ? 'happy' : 'happy', kneelK: lin(0.7, 1, eseg(l, 0, 12)), light: PARK_LIGHT_B04, warm: 0, faceKey: true};
    const dogSit = eseg(l, 0, 14);
    const dog: DogState = {at: B04_DOG_AT, pose: {view: 'front', state: 'sit', from: 'stand', blend: dogSit, wag: 0.5, mouth: 'open'}};
    const b1 = eseg(l, 33, 41), b2 = eseg(l, 106, 114);
    return {cam, dog: true, tag: true, st: {t: l / FPS, owner, dog, balls: []},
      extra: (p) => {
        chalkBubble(p, 70000, [343, 576], [530, 390], 240, 3, b1, [seg(l, 50, 54), seg(l, 60, 64), seg(l, 70, 74)]);
        chalkBubble(p, 70200, [813, 765], [830, 470], 240, 2, b2, [seg(l, 112, 116), seg(l, 120, 124)]);
      },
      screen: <>{popLabel('คน: 3 แบบ', 560, 540, seg(l, 78, 84))}{popLabel('หมา: 2 แบบ', 830, 310, seg(l, 123, 129))}</>};
  },
  // B04-SH02 (LF03): thought bubble, card, strike, pop, wag + ruffle, flip back l 172-186 (radial from the dog's head).
  'S01-B04-SH02': (l) => {
    const e = ease(l / 186);
    const cam = orbitYCam(T.TWO, lin(1.8, 1.4, e), lin(-5, 5, e) * DEG, 0.9, 1000, 700);
    const ruffleIn = eseg(l, 118, 130) * (1 - eseg(l, 150, 160)), stroke = ruffleIn * Math.sin(((l - 130) / 10) * Math.PI) * 0.05 * (l > 130 && l < 150 ? 1 : 0);
    const owner: OwnerState = {at: B04_OWNER_AT, pose: 'P34', face: 'happy', light: PARK_LIGHT_B04, warm: 0, faceKey: true};
    if (ruffleIn > 0) { owner.lArm = {reach: [B04_DOG_AT[0] - 0.02 + stroke, 0.84, B04_DOG_AT[2] + 0.05], out: 1}; owner.lean = 0.3 * ruffleIn; }
    const dog: DogState = {at: B04_DOG_AT, pose: {view: 'front', state: 'sit', wag: l >= 114 ? 1 : 0.5, mouth: 'open'}};
    const bubble = l < 104 ? eseg(l, 10, 20) : 0, fadeOld = 1 - seg(l, 0, 8);
    const card = l < 104 ? seg(l, 40, 46) : 0, strike = seg(l, 84, 94);
    const sw = sweepOut(870, 760, eseg(l, 172, 186), farCorner(870, 760));
    return {cam, ...sw, tag: true, st: {t: l / FPS, owner, dog, balls: []},
      extra: (p) => {
        if (fadeOld > 0) chalkBubble(p, 70000, [343, 576], [530, 390], 240, 3, fadeOld, [1, 1, 1]);
        thoughtBubble(p, 71000, [870, 650], [600, 400], 300, bubble);
      },
      screen: <>{l < 104 ? strikeCard(600, 420, 220, 90, card, strike) : null}</>};
  },
  // B05-SH01 `V-BALL` 3/4, normal colour: nose-trail to R0, pick-up, sit, thump.
  'S01-B05-SH01': (l) => {
    const cam = vball(lin(0, -0.2, l / 142));
    const trail = seg(l, 0, 56), wob = Math.sin(l * 0.52) * 0.04;
    const at: V3 = l < 56 ? [lin(2.4, 0.4, trail), 0, lin(-0.8, -0.05, trail) + wob] : [0.4, 0, -0.05];
    const sit = eseg(l, 80, 96);
    const hasBall = l >= 64;
    const lift = eseg(l, 66, 74);
    const pose: DogState['pose'] = l < 56 ? {view: 'left', state: 'stand', sniff: 0.95, walk: l * 0.18, stride: 0.5, gait: 'walk', wag: 0}
      : l < 80 ? {view: 'left', state: 'stand', sniff: lin(0.95, 0.1, lift), wag: 0.2, mouth: l >= 62 ? 'closed' : 'open'}
      : {view: 'left', state: 'sit', from: 'stand', blend: sit, wag: l >= 96 ? 0.6 + 0.4 * (Math.sin(l * 0.8) > 0 ? 1 : 0) : 0.2, mouth: 'open'};
    const mouthOff: V3 = l < 80 ? [lin(-0.34, -0.62, lift), lin(0.1, 0.52, lift), 0] : [-0.52, 0.62, 0];
    return {cam, st: {t: l / FPS, dog: {at, pose, ...(hasBall ? {mouth: {color: RED, off: mouthOff}} : {})}, balls: hasBall ? [] : [ballAt(R0, RED)]}};
  },
  // B06-SH01: bag flap, blue ball out, overhand throw; red ball stays in the left hand.
  'S01-B06-SH01': (l) => {
    const e = ease(l / 55);
    const cam = orbitYCam(T.OWNER, lin(2.4, 2.2, e), lin(30, 24, e) * DEG, 1.1, 1000, 560);
    const bagOpen = l < 28 ? eseg(l, 2, 8) : 1 - eseg(l, 28, 34);
    const hang = armM([-0.05, -0.52], [-0.02, -0.26]), bag = armM([0.15, -0.55], [-0.2, -0.35]), chest = armM([-0.1, -0.2], [-0.12, -0.3]), back = armM([-0.2, 0.42], [-0.34, 0.2]), fwd = armM([0.12, 0.5], [-0.12, 0.34]);
    const mix = (a: typeof hang, b: typeof hang, u: number) => armM([lin(a.to[0], b.to[0], u), lin(a.to[1], b.to[1], u)], [lin(a.via[0], b.via[0], u), lin(a.via[1], b.via[1], u)]);
    const rArm = l < 6 ? hang : l < 18 ? mix(hang, bag, eseg(l, 6, 12)) : l < 22 ? mix(bag, chest, eseg(l, 18, 22)) : l < 34 ? chest : l < 44 ? mix(chest, back, eseg(l, 34, 44)) : l < 48 ? mix(back, fwd, eseg(l, 44, 48)) : fwd;
    const blueHeld = l >= 22 && l < 46;
    const t = (l - 46) / 30, rel: V3 = [-4.3, 1.5, -1.4];
    const flight: V3 = [lin(rel[0], L1[0], t), rel[1] * (1 - t) + 4 * 2.6 * t * (1 - t), lin(rel[2], L1[2], t)];
    const dogView = 'front' as const;
    return {cam, st: {t: l / FPS,
      owner: {pose: 'P01', face: l < 26 ? 'smug' : 'happy', view: 'front', heldL: RED, held: blueHeld ? BLUE : undefined, bagOpen, holdK: 0.1, rArm,
        lArm: armM([0.06, -0.3], [0.1, -0.28])},
      dog: {at: POS.D0, pose: {view: dogView, state: 'stand', wag: 1, mouth: 'open'}},
      balls: l >= 46 ? [ballAt(flight, BLUE)] : []}};
  },
  // B06-SH02 `V-BALL` 4/4: sweep to dog view l 0-10 (tag on), blue ball lane, dog on the miss lane, turn at W, straight to the ball, pick-up, bark, flip back l 106-115.
  'S01-B06-SH02': (l) => {
    const cam = vball(lin(-0.25, 0, l / 115));
    const sweep = l < 11 ? sweepIn(0, 760, eseg(l, 0, 10), farCorner(0, 760)) : l >= 106 ? sweepOut(300, 700, eseg(l, 106, 115), farCorner(300, 700)) : {dog: true};
    const P: V3 = [0.04, 0, -0.42];
    let dog: DogState | undefined;
    if (l >= 34) {
      // lane run to W (reached l 42, 5 m/s), then the straight leg W -> P, decelerating, stopped l 60
      if (l < 42) dog = {at: [W[0] - (42 - l) * 0.167, 0, LANE_Z - 0.0], pose: dogRun('right', l)};
      else if (l < 60) { const k = 1 - Math.pow(1 - (l - 42) / 18, 2); dog = {at: lerp3(W, P, k), pose: dogRun('front', l, 0.6)}; }
      else if (l < 64) dog = {at: P, pose: {view: 'front', state: 'stand', sniff: 0.5, wag: 0.3, mouth: 'open'}};
      else if (l < 76) dog = {at: P, pose: {view: 'front', state: 'stand', sniff: lin(0.5, 0, eseg(l, 64, 76)), wag: 0.3, mouth: 'closed'}};
      else dog = {at: P, pose: {view: 'front', state: 'stand', wag: l >= 92 ? 1 : 0.3, mouth: l >= 92 && l < 98 ? 'open' : 'closed'}};
      if (dog && l >= 70) dog = {...dog, mouth: {color: BLUE, off: [-0.05, lin(0.2, 0.52, eseg(l, 70, 80)), 0.22]}};
    }
    const blue = l >= 70 ? [] : [ballAt(ballLane(Math.min(l, 26)), BLUE)];
    return {cam, ...sweep, tag: true, st: {t: l / FPS, dog, balls: blue}};
  },
  // B07-SH01: the hook's camera in reverse, ease-out to B01-SH01 c 0 (yaw -24, r 1.90, hy 660), then a live hold. Normal colour, no tag.
  'S01-B07-SH01': (l) => {
    const e = ease(seg(l, 0, 105));
    const cam = orbitYCam(T.TWO, lin(1.7, 1.9, e), lin(-32, -24, e) * DEG, 1.2, 1100, lin(640, 660, e));
    return {cam, st: {t: l / FPS,
      owner: {held: RED, pose: 'P11', face: l >= 84 ? 'happy' : 'neutral', holdK: lin(0.34, 0.2, e), headCock: lin(0, 8, eseg(l, 10, 40)) * (1 - eseg(l, 110, 150))},
      dog: {at: POS.D0, pose: {view: 'front', state: 'sit', wag: 0.7, mouth: 'closed'}, mouth: {color: BLUE, off: [-0.2, 0.72, 0.26]}}, balls: []}};
  },
};

export type Edu3Plate = {cam: YCam; spec: Spec; paint: (p: Painter) => void};
/** The plate of one shot at shot-local frame `l` (held in the shot's own range). */
export const plateOf = (id: Edu3ShotId, l: number): Edu3Plate => {
  const spec = SPECS[id](clamp(l, 0, EDU3_FRAMES[id] - 1));
  return {cam: spec.cam, spec, paint: (p) => { paintPark(p, spec.cam, spec.st); spec.extra?.(p, spec.cam); }};
};

const VIGNETTE = 'radial-gradient(ellipse 95% 75% at 48% 42%, rgba(255,240,200,0) 58%, rgba(60,70,40,0.18) 100%)';
/** Standalone plate (stills and QA; the timeline uses a registry adapter over `plateOf` on PaintedStage's one canvas). */
export const ShotPlate = ({id}: {id: Edu3ShotId}) => {
  const frame = useCurrentFrame();
  // QA only: `--props='{"normal":true}'` renders the same strokes in normal colour (no dog view) for the measures that compare the two states.
  const normal = (getInputProps() as {normal?: boolean}).normal === true;
  const spec0 = SPECS[id](clamp(frame, 0, EDU3_FRAMES[id] - 1)), spec: Spec = normal ? {...spec0, dog: false, over: undefined} : spec0;
  const host = useRef<HTMLDivElement>(null), copy = useRef<HTMLCanvasElement>(null);
  const fn = useCallback(({brush, frame: fr}: PaintContext) => plateOf(id, fr).paint(makePainter(brush, {t: fr / FPS, frame: fr, fade: EDU3_PAPER})), [id]);
  // The masked layer is a copy of the one painted canvas (same strokes), shown with or without the dog-view filter.
  useLayoutEffect(() => {
    const src = host.current?.querySelector('canvas'), dst = copy.current;
    if (!spec.over || !src || !dst) return;
    dst.width = src.width; dst.height = src.height;
    dst.getContext('2d')?.drawImage(src, 0, 0);
  });
  const mask = spec.over?.mask;
  return (
    <AbsoluteFill style={{background: EDU3_PAPER}}>
      <div ref={host} style={{position: 'absolute', inset: 0}}>
        <DogView u={spec.dog ? 1 : 0}><BrushCanvas paint={fn} paper={EDU3_PAPER} /></DogView>
      </div>
      {spec.over && (
        <>
          {spec.over.to === 'dog' && (
            <svg width={0} height={0} style={{position: 'absolute'}}>
              <filter id="dogview-over" colorInterpolationFilters="linearRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values={dogMatrixValues(1)} /></filter>
            </svg>
          )}
          <canvas ref={copy} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: spec.over.to === 'dog' ? 'url(#dogview-over)' : undefined, WebkitMaskImage: mask, maskImage: mask}} />
        </>
      )}
      <AbsoluteFill style={{pointerEvents: 'none', background: VIGNETTE}} />
      <Grain opacity={0.08} />
      {spec.screen}
      {spec.tag && <PaintedLabel text="ภาพจำลอง (โดยประมาณ)" top={200} />}
    </AbsoluteFill>
  );
};

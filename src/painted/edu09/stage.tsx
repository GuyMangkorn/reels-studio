import type {ReactNode} from 'react';
import {STILL_CAMERA} from '../kit/camera';
import {camMove, camMoveK, camOf, type CamMove} from '../kit/cam-moves';
import {blendHand, HAND_POSES, type HandMacro, type HandPoseId} from '../kit/hands';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {LAMP, paintDining, TABLE_Y, type Sitter} from './dining';
import {LampPool, RoomLight, TopLight} from './look';
import {FPS, lenOf, startOf, type ShotId} from './clock';
export {lenOf};

// EDU-EP09-SHORT shot adapter (W5.3 Editor): registry ID `EDU9-<shot id>`, shot-local frame L = round(tl * 30), composition frame G = start + L. Shot files in shots/ build
// their camera, staging and overlay from the scene sheet; nothing imports a shot file except the inventory src/painted/shots/edu09.tsx.
export const edu9PlateId = (id: string) => `EDU9-${id}`;
const deg = (a: number) => (a * 180) / Math.PI;
const pair = <T,>(x: T | [T, T]): [T, T] => (Array.isArray(x) ? (x as [T, T]) : [x as T, x as T]);

/** A sheet `cam:` line in the `look()` convention (pitch aims at the target from `eye`), with a moving target, yaw, r and eye; `f`/`hy` may also move (see `camAt`). */
export const lookMove = (at: V3 | [V3, V3], yaw: number | [number, number], r: number | [number, number], eye: number | [number, number], o: {f: number | [number, number]; hy: number | [number, number]; ease?: [number, number]; cx?: number}): CamMove => {
  const a = Array.isArray(at[0]) ? (at as [V3, V3]) : ([at, at] as [V3, V3]), rr = pair(r), ee = pair(eye);
  const pitch: [number, number] = [-deg(Math.atan2(ee[0] - a[0][1], rr[0])), -deg(Math.atan2(ee[1] - a[1][1], rr[1]))];
  return camMove(a, pair(yaw), rr, ee, {pitch, f: pair(o.f)[0], hy: pair(o.hy)[0], ease: o.ease, cx: o.cx});
};
/** Camera of shot-local frame L of N (a move runs to the last frame). `hy` / `f` ends override the move's constant (SD01-SD03: hy drifts; B03-SH03: lens 2350 -> 2000). */
export const camAt = (m: CamMove, L: number, N: number, o: {hy?: [number, number]; f?: [number, number]} = {}): YCam => {
  const u = N > 1 ? Math.min(1, L / (N - 1)) : 0, k = camMoveK(m, u), c = camOf(m, u);
  return {...c, ...(o.hy ? {hy: o.hy[0] + (o.hy[1] - o.hy[0]) * k} : {}), ...(o.f ? {f: o.f[0] + (o.f[1] - o.f[0]) * k} : {})};
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ramp = (f: number, a: number, b: number) => { const k = clamp01((f - a) / (b - a)); return k * k * (3 - 2 * k); };
/** Blend a macro hand from another named pose (same wrist, options and tremble) toward its own pose by `u` (0 = `from`, 1 = as built). */
export const fromPose = (h: HandMacro, from: HandPoseId, u: number): HandMacro => {
  if (u >= 1) return h;
  const q = HAND_POSES[from];
  return blendHand({...h, fingers: q.fingers, thumb: q.thumb, pitch: q.pitch, roll: q.roll}, h, u);
};

/** BOY's and ELDER's resting sitters at the table (LF02 points); shots override pieces. */
const y = TABLE_Y;
export const BOY_REST = {lHand: [-0.2, y, -0.09] as V3, lElbow: [-0.13, y + 0.026, -0.32] as V3, rHand: [-0.33, y, -0.12] as V3, rElbow: [-0.405, y + 0.026, -0.33] as V3};
export const ELDER_REST = {lHand: [0.4, y, -0.16] as V3, lElbow: [0.47, y + 0.026, -0.38] as V3, rHand: [0.15, y, -0.15] as V3, rElbow: [0.16, y + 0.026, -0.37] as V3};

/** ELDER's right hand, test pose, in B02-SH02 / B03-SH09 (middle MCP, metres). */
export const ELDER_HAND: V3 = [0.16, y, -0.3];

/** Screen-space lights of SET-DINING (lamp pool and room bloom) for the camera of the frame. */
export const RoomOverlay = ({cam, lampY = LAMP[1]}: {cam: YCam; lampY?: number}) => (
  <>
    <LampPool cam={cam} at={[0, TABLE_Y, -0.15]} r={700} squash={0.4} level={0.9} />
    <RoomLight cam={cam} lamp={[LAMP[0], lampY, LAMP[2]]} />
  </>
);
export const CloseOverlay = ({cam, level = 1}: {cam: YCam; level?: number}) => <LampPool cam={cam} at={[-14, 0, -11]} level={level} />;
export {TopLight};
export const diningPaint = (p: Painter, cam: YCam, t: number, boy?: Sitter, elder?: Sitter, lampY?: number) => paintDining(p, cam, {t, boy, elder, lampY});

/** The "ภาพประกอบ" pill: top-right x 816-1020, y 148-204 (brief frame zones; clear of the channel mark). */
const Pill = () => (
  <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.85)', color: '#2b211c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 30}}>ภาพประกอบ</div>
);

export type ShotFns = {
  paper: string;
  paint: (p: Painter, L: number, G: number, N: number) => void;
  /** Screen-space lights (a function of the shot-local frame). */
  overlay?: (L: number, N: number) => ReactNode;
  /** Shot-local frame ranges [from, to) with the label pill on; `true` = the whole shot. */
  label?: true | [number, number][];
};
export const makeShot = (id: ShotId, f: ShotFns): PaintedShot => {
  const g0 = startOf(id), n = lenOf(id), frameOf = (tl: number) => Math.min(n - 1, Math.round(tl * FPS));
  const labelOn = (L: number) => f.label === true || (f.label ?? []).some(([a, b]) => L >= a && L < b);
  return {
    id: edu9PlateId(id), serves: [id], paper: f.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => f.paint(p, frameOf(ctx.tl), g0 + frameOf(ctx.tl), n),
    Overlay: ({tl, opacity}) => {
      const L = frameOf(tl);
      return <div style={{position: 'absolute', inset: 0, opacity}}>{f.overlay?.(L, n)}{labelOn(L) && <Pill />}</div>;
    },
  };
};

import {glaze} from '../kit/draw';
import type {Painter} from '../kit/painter';
import {sphereAt} from '../kit/world';
import type {YCam} from '../kit/ycam';
import {GROUP_IDS, paintBidder, paintGroupMember, paintHost, type HostMeasure, type Lead} from './cast';
import {gradePainter, PAL, type Light} from './palette';
import {paintBoard, paintPlant, paintRoomShell, paintSun, paintTable} from './room';
import type {BoardState} from './board-text';

// EDU-EP24-SHORT W3 look frames LF01-LF04 (EDU-EP24-BRIEF-R2 #look-frames; Film, 2026-11-17). React-free so the headless measure
// (scripts/edu-series/ep24/short/measure-looks.ts) runs them with a no-op brush. Cameras are space M (room.ts), yaw 0 = behind the chairs
// looking -z; every number is a look-frame estimate for the scene-sheet pass to confirm with scripts/shot-projection.py.

export type LookDef = {
  shot: string; cam: YCam; light: Light; t: number; paper: string;
  board?: BoardState; card?: {flapDown: boolean}; sepia?: boolean; b04?: boolean;
  /** Audience Thai caption drawn in the band (script line chunk, unchanged). */
  caption: string;
  paint: (p: Painter) => void;
};
export type LookMeasure = {you?: Lead; rival?: Lead; host?: HostMeasure; group?: Record<string, {crown: number; x0: number; x1: number} | undefined>};
export const MEASURE: Record<string, LookMeasure> = {};

const DEG = Math.PI / 180;
/** Family 1, the wide from behind the seated group (B01 L04 end; also the B05 hold framing, LF04). Revised for the seated group (user,
 *  2026-11-17): the camera stands at the back of the room (z 4.40; the room runs to z 4.80), f 1600 keeps the board as legible as before,
 *  and the eye 2.30 m (brief est 1.6) puts the bidders' heads below the side-table top on screen (tray and card read) and the group's heads
 *  below the bidders' shoulders. */
export const CAM_WIDE: YCam = {x: 0, y: 2.3, z: 4.4, yaw: 0, f: 1600, hy: 300};
/** Family 2, the reverse from the board side (yaw 180), at seated eye height. */
export const CAM_REVERSE: YCam = {x: 0, y: 1.22, z: -1.0, yaw: 180 * DEG, f: 1150, hy: 640};
/** B04 mid-dolly: family 1 pushed about 7 % toward the board (6.78 -> 6.31 m; the 10-15 % push ends later), over the frozen group. */
export const CAM_B04: YCam = {x: -0.05, y: 2.3, z: 3.93, yaw: 0, f: 1600, hy: 300};
/** B05 L18 hold: family 1 at the end of the pull-back. */
export const CAM_HOLD: YCam = {x: 0.03, y: 2.3, z: 4.5, yaw: 0, f: 1600, hy: 300};

const group = (p: Parameters<LookDef['paint']>[0], c: YCam, view: 'front' | 'back', light: Light) => Object.fromEntries(GROUP_IDS.map((id) => [id, paintGroupMember(p, c, id, view, light)]));

const lf01 = (): LookDef => {
  const c = CAM_WIDE, light: Light = 'warm';
  return {shot: 'B01 L04 end · BS03', cam: c, light, t: 12.9, paper: PAL.wall, board: {you: 20, rival: 10, sum: 30}, card: {flapDown: false},
    caption: 'ของถูกชัด ๆ', paint: (p) => {
      paintRoomShell(p, c, light);
      paintBoard(p, c, light);
      paintPlant(p, c, light);
      paintSun(p, c);
      const host = paintHost(p, c, {light, face: 'smug'});
      paintTable(p, c, light, {flapDown: false});
      const rival = paintBidder(p, c, 'rival', {view: 'back', light, warm: 0.1});
      const you = paintBidder(p, c, 'you', {view: 'back', light, warm: 0.14});
      MEASURE.LF01x = {you, rival, host, group: group(p, c, 'back', light)};
    }};
};

const lf02 = (): LookDef => {
  const c = CAM_REVERSE, light: Light = 'cool';
  return {shot: 'B02 riffle end · BS11 (before L06)', cam: c, light, t: 18.4, paper: PAL.wall, caption: 'คุณเก้าสิบ เขาเก้าสิบห้า…', paint: (p) => {
    paintRoomShell(p, c, light);
    const g = group(p, c, 'front', light);
    const you = paintBidder(p, c, 'you', {view: 'front', light, face: 'worried', faceState: {look: [-0.1, -0.35]}});
    const rival = paintBidder(p, c, 'rival', {view: 'front', light, face: 'neutral', faceState: {look: [0.1, -0.3]}});
    MEASURE.LF02 = {you, rival, group: g};
  }};
};

const lf03 = (): LookDef => {
  const c = CAM_B04, light: Light = 'cool';
  return {shot: 'B04 L15 on "ทะลุ" · paused BS14', cam: c, light, t: 45.4, paper: PAL.wall, board: {you: 110, rival: 105, sum: 215}, card: {flapDown: true}, sepia: true, b04: true,
    caption: 'เวลาเล่นจริง\nราคามักทะลุค่าแบงก์', paint: (p0) => {
      const p = gradePainter(p0);
      paintRoomShell(p, c, light);
      paintBoard(p, c, light);
      paintPlant(p, c, light);
      const host = paintHost(p, c, {light, face: 'smug'});
      paintTable(p, c, light, {flapDown: true});
      const rival = paintBidder(p, c, 'rival', {view: 'back', light});
      const you = paintBidder(p, c, 'you', {view: 'back', light});
      MEASURE.LF03 = {you, rival, host, group: group(p, c, 'back', light)};
    }};
};

const lf04 = (): LookDef => {
  const c = CAM_HOLD, light: Light = 'payoff';
  return {shot: 'B05 L18 on "เก็บไปสองร้อยสิบห้า" · BS14-lit', cam: c, light, t: 53.6, paper: PAL.wall, board: {you: 110, rival: 105, sum: 215, lit: true}, card: {flapDown: true},
    caption: 'ที่ไม่ได้เสนอสักบาท\nเก็บไปสองร้อยสิบห้า', paint: (p) => {
      paintRoomShell(p, c, light);
      paintBoard(p, c, light, {lit: true});
      paintPlant(p, c, light);
      // the low warm patch on the host and the side table only (sun back through the window's upper corner): painted behind and over them
      const s = sphereAt(c, [1.05, 1.2, -1.6], 0.7);
      const patch = (seed: number, op: number, k: number, dy: number) => s && glaze(p, seed, PAL.sun, op, Array.from({length: 28}, (_, i) => [s.x + s.r * k * 1.0 * Math.cos((i / 28) * 6.283) - 0.25 * s.r * k * Math.sin((i / 28) * 6.283), s.y + dy * s.r + s.r * k * 1.15 * Math.sin((i / 28) * 6.283)] as [number, number]), {bleed: 0.5, border: 0.4});
      patch(24900, 48, 1.15, 0); patch(24902, 55, 0.85, 0.1);
      const host = paintHost(p, c, {light: 'patch', face: 'smug', faceState: {mouth: 'smile'}, noteLift: true});
      paintTable(p, c, light, {flapDown: true, paid: true});
      patch(24904, 40, 0.6, 0.35);
      const rival = paintBidder(p, c, 'rival', {view: 'back', light, fig: {nod: [0.03, -0.3], rise: -0.06}});
      const you = paintBidder(p, c, 'you', {view: 'back', light, fig: {headTilt: 0.22, headYaw: 0.35}});
      MEASURE.LF04x = {you, rival, host, group: group(p, c, 'back', light)};
    }};
};

/** The chosen look (user, 2026-11-17: LF01-LF04 approved, with the seated group): LF01x and LF04x keep the `x` of the with-extras pick;
 *  the three-person variants are dropped. LF02 / LF03 carry the same group. */
export const LOOK_DEFS: Record<string, () => LookDef> = {LF01x: lf01, LF02: lf02, LF03: lf03, LF04x: lf04};

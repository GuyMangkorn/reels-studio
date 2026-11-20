import type {YCam} from '../kit/ycam';
import type {Painter} from '../kit/painter';
import {paintPaddockScene, type PadSceneOpts} from './paddock';
import {fenceBirds} from './flock';
import {camLine} from './shot';

// T30 (Boss, 2026-11-20): the retreat vantage. One camera line, one paddock-from-inside set and one fence-bird layout shared by B05-SH03, B06-SH03 and B06-SH04 so the
// three plates match exactly ("this exact camera returns", b05 B05-SH03 Camera). All pitch 0, f 900, hy 820, ease-in-out over the shot.
export type VantageShot = 'B05-SH03' | 'B06-SH03' | 'B06-SH04';
type Line = {n: number; a: {eye: [number, number, number]; yaw: number}; b: {eye: [number, number, number]; yaw: number}};
const LINES: Record<VantageShot, Line> = {
  'B05-SH03': {n: 94, a: {eye: [-1.0, 1.55, 2.4], yaw: 160}, b: {eye: [-0.95, 1.55, 2.55], yaw: 166}},
  'B06-SH03': {n: 99, a: {eye: [-1.0, 1.55, 2.4], yaw: 162}, b: {eye: [-0.97, 1.55, 2.5], yaw: 164}},
  'B06-SH04': {n: 58, a: {eye: [-0.97, 1.55, 2.5], yaw: 164}, b: {eye: [-0.95, 1.55, 2.6], yaw: 164}},
};
const ease = (u: number) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
/** The shared retreat camera at shot-local frame L (ease-in-out over the shot). */
export const VANTAGE_CAM = (shot: VantageShot, L: number): YCam => {
  const {n, a, b} = LINES[shot], u = ease(L / (n - 1)), m = (x: number, y: number) => x + (y - x) * u;
  return camLine({eye: [m(a.eye[0], b.eye[0]), m(a.eye[1], b.eye[1]), m(a.eye[2], b.eye[2])], yaw: m(a.yaw, b.yaw), pitch: 0, f: 900, hy: 820});
};
/** The paddock from inside, looking toward the fence, the track and the camp side (the camera is south of the wire, c.z < 6): the locked T09 stack, `cast` paints between the ground and the fence. */
export const paintVantageSet = (p: Painter, c: YCam, o: {light: number; eaten: number; stubble: number} & Pick<PadSceneOpts, 'wire'>, cast: () => void = () => {}) =>
  paintPaddockScene(p, c, {light: o.light, eaten: o.eaten, stubble: o.stubble, wire: o.wire}, cast);
/** The fence birds of the retreat vantage: `count` of the T08 fence layout (five at B05-SH03). */
export const fenceLine = (count: number, o: Parameters<typeof fenceBirds>[0] = {}) => fenceBirds({...o, n: count});

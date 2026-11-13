import type {YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {lerp, sm} from './clock';

// EDU-EP18-SHORT cameras: the storyboard's `pos -> pos, look-at -> look-at, f` lines as pure functions of the shot-local frame. A camera is a
// look-at pair converted to the kit's yaw camera (`ycam`: yaw, pitch, f, hy 960, optional near). Eased moves use smoothstep over the stated window.
export const lookCam = (pos: V3, at: V3, f: number, near?: number): YCam => {
  const dx = at[0] - pos[0], dy = at[1] - pos[1], dz = at[2] - pos[2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f, hy: 960, near};
};
export const mix3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
/** A move between two look-at cameras over frames [a, b] (smoothstep), held outside. */
export const moveCam = (L: number, a: number, b: number, p0: V3, p1: V3, l0: V3, l1: V3, f0 = 1000, f1 = f0, near?: number): YCam => {
  const u = sm(a, b, L);
  return lookCam(mix3(p0, p1, u), mix3(l0, l1, u), lerp(f0, f1, u), near);
};

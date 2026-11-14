import type {V3} from './space';
import {orbitYCam, type YCam} from './ycam';

// Camera moves as data for the yaw camera (`ycam.ts`): an orbit about a target that can itself move (a truck), with yaw, radius,
// eye height and pitch interpolated over the shot, optionally only between two fractions of it (smoothstep). A scene sheet's
// `cam:` line maps to one `camMove(...)`; scenes and QA measures read the shot's camera with `camOf(move, u)`. Copied from
// EDU-EP05 `edu05/cams.ts` (7 Nov 2026); the episode keeps its own copy and its shot table.

export type CamMove = {
  /** Orbit target at the start and end (metres). */
  at: [V3, V3];
  /** Azimuth in degrees (0 = camera on +z of the target), start and end. */
  yaw: [number, number];
  /** Orbit radius (m), start and end. */
  r: [number, number];
  /** Camera height (m), start and end. */
  eye: [number, number];
  /** Pitch in degrees (positive looks up), start and end; default level. */
  pitch?: [number, number];
  /** Lens (px) and horizon line (px). */
  f: number; hy: number;
  /** Picture shift in px (positive moves the subject right). */
  cx?: number;
  /** Near plane (m) for close-ups under 0.5 m (a table-top lens): carried into every camera `camOf` returns; absent = `YCAM_NEAR` (0.3). */
  near?: number;
  /** The move happens only between these fractions of the shot (smoothstep); static before and after. */
  ease?: [number, number];
};

/** Build a `CamMove`; a single target, radius or eye stands for a static value. */
export const camMove = (at: V3 | [V3, V3], yaw: [number, number], r: [number, number] | number, eye: [number, number] | number, o: {pitch?: [number, number]; f: number; hy: number; cx?: number; near?: number; ease?: [number, number]}): CamMove => ({
  at: Array.isArray(at[0]) ? (at as [V3, V3]) : [at as V3, at as V3], yaw, r: typeof r === 'number' ? [r, r] : r, eye: typeof eye === 'number' ? [eye, eye] : eye, ...o,
});

const DEG = Math.PI / 180;
/** The move's progress at shot fraction `u` (0..1): `u` itself, or the smoothstep inside `ease`. */
export const camMoveK = (m: Pick<CamMove, 'ease'>, u: number): number => {
  if (!m.ease) return u;
  const k = Math.min(1, Math.max(0, (u - m.ease[0]) / (m.ease[1] - m.ease[0])));
  return k * k * (3 - 2 * k);
};
/** The shot's camera at fraction `u` in 0..1 (linear between the ends, or smoothstep inside `ease`). */
export const camOf = (m: CamMove, u0: number): YCam => {
  const u = camMoveK(m, u0);
  const l = (a: number, b: number) => a + (b - a) * u;
  const at: V3 = [l(m.at[0][0], m.at[1][0]), l(m.at[0][1], m.at[1][1]), l(m.at[0][2], m.at[1][2])];
  return {...orbitYCam(at, l(m.r[0], m.r[1]), l(m.yaw[0], m.yaw[1]) * DEG, l(m.eye[0], m.eye[1]), m.f, m.hy), pitch: (m.pitch ? l(m.pitch[0], m.pitch[1]) : 0) * DEG, cx: m.cx ?? 0, ...(m.near !== undefined ? {near: m.near} : {})};
};

import type {V3} from '../kit/space';
import {orbitYCam, type YCam} from '../kit/ycam';

// Camera moves of the EDU-EP05 macro shots (scene sheets SHEETS-R1, `cam:` lines), as data: each is an orbit about a target that can
// itself move (a truck), with yaw, radius, eye, pitch interpolated. Used by the parallax measure (tests/edu05-macro.test.ts) and by
// any scene that wants the sheet's camera. Shot IDs are the sheets' `S01-Bnn-SHnn`. Look-frame code (W5.2); Editor owns the timeline.

export type CamMove = {
  at: [V3, V3]; yaw: [number, number]; r: [number, number]; eye: [number, number]; pitch?: [number, number];
  f: number; hy: number; cx?: number;
  /** The move happens only between these fractions of the shot (smoothstep); static before and after. */
  ease?: [number, number];
};
const c = (at: V3 | [V3, V3], yaw: [number, number], r: [number, number] | number, eye: [number, number] | number, o: {pitch?: [number, number]; f: number; hy: number; cx?: number; ease?: [number, number]}): CamMove => ({
  at: Array.isArray(at[0]) ? (at as [V3, V3]) : [at as V3, at as V3], yaw, r: typeof r === 'number' ? [r, r] : r, eye: typeof eye === 'number' ? [eye, eye] : eye, ...o,
});

export const MACRO_CAMS: Record<string, CamMove> = {
  // R1.4 FR16: exterior look-down on the facade (pos (-1.73, 2.00, -6.28)), a slow 3 deg tilt down, ease in-out L 0-96
  'S01-B01-SH02': c([-0.05, 0, 0], [195, 195], 6.5, 2.0, {pitch: [-50, -53], f: 950, hy: 600, ease: [0, 1]}),
  // SD01: LF01 v3 set-up, a slow push-in over the 41 f shot
  'S01-B01-SH01': c([-0.4, 1.4, 0.2], [-24, -18], [2.0, 1.85], 1.45, {f: 1050, hy: 600}),
  // SD03: target (0.05, 1.25, 0.05), `cx -60` lands the pop point on SH04's puff centre
  'S01-B01-SH03': c([0.05, 1.25, 0.05], [4, 10], [1.8, 1.65], 1.35, {f: 1100, hy: 700, cx: -60}),
  // SD04: crane, ease L 6-31 (the sheet's "ease-in L 6-32"; the move is a smoothstep from L 6)
  'S01-B01-SH04': c([0, 1.0, 0], [0, 2], 2.6, [0.6, 1.05], {pitch: [0, 8.75], f: 1000, hy: 820, ease: [6 / 31, 1]}),
  // SD05 (SHEETS-R1): lift-off over the balcony lip, she stays in frame from the lip to clear air (the camera does not follow her up fully)
  'S01-B02-SH01': c([-0.6, 1.5, -7.0], [-35, -25], [3.8, 3.4], 0.8, {pitch: [10, 12], f: 1000, hy: 760}),
  'S01-B02-SH04': c([0, 0.7, 0], [15, 5], [2.2, 1.9], 0.7, {f: 1050, hy: 820}),
  'S01-B03-SH01': c([1.55, 1.0, -0.8], [-12, -6], [3.3, 3.1], 1.0, {f: 1050, hy: 760}),
  'S01-B03-SH02': c([1.5, 1.0, -0.85], [18, 12], [2.3, 2.4], 1.0, {f: 1100, hy: 720}),
  'S01-B03-SH03': c([1.55, 1.3, -0.95], [16, 10], [1.6, 1.45], 1.35, {f: 1150, hy: 700}),
  'S01-B03-SH04': c([[1.3, 0.9, -0.8], [-0.4, 0.9, -0.5]], [18, 12], [2.7, 2.6], 0.8, {f: 1050, hy: 780, ease: [104 / 132, 1]}),
  'S01-B04-SH01': c([-1.4, 1.4, -0.6], [-10, -4], [2.0, 1.8], 1.0, {f: 1050, hy: 700}),
  'S01-B04-SH02': c([-1.4, 1.4, -0.6], [-25, -15], 1.9, 1.0, {f: 1050, hy: 640}),
  // R1.3 FR12: the truck is keyed to the drag (hold L 0-30, ease L 30-84, hold to the end of the 115 f shot); the whole-shot ease left her head past the right edge at L 78
  'S01-B04-SH03': c([[-3.3, 0.6, -0.75], [-2.0, 0.6, -0.75]], [20, 20], 2.4, 0.8, {f: 1050, hy: 780, ease: [30 / 114, 84 / 114]}),
  'S01-B05-SH01': c([-1.0, 0.8, -1.2], [-15, -5], [3.4, 3.0], 0.6, {f: 1000, hy: 800}),
  'S01-B05-SH02': c([1.2, 0.6, -2.0], [10, 16], [2.6, 2.4], 0.6, {f: 1050, hy: 800, cx: 150}),
  'S01-B05-SH03': c([-1.75, 1.2, -0.6], [-20, -12], [2.2, 2.0], 0.7, {pitch: [8, 8], f: 1050, hy: 860}),
  'S01-B05-SH04': c([-0.3, 1.0, -1.3], [-6, -3], [4.4, 4.1], 0.9, {f: 1000, hy: 760, cx: 40}),
};

const DEG = Math.PI / 180;
/** The shot's camera at u in 0..1 (linear; the sheets' eases are the Editor's). */
export const camOf = (m: CamMove, u0: number): YCam => {
  const u = m.ease ? (() => { const k = Math.min(1, Math.max(0, (u0 - m.ease[0]) / (m.ease[1] - m.ease[0]))); return k * k * (3 - 2 * k); })() : u0;
  const l = (a: number, b: number) => a + (b - a) * u;
  const at: V3 = [l(m.at[0][0], m.at[1][0]), l(m.at[0][1], m.at[1][1]), l(m.at[0][2], m.at[1][2])];
  return {...orbitYCam(at, l(m.r[0], m.r[1]), l(m.yaw[0], m.yaw[1]) * DEG, l(m.eye[0], m.eye[1]), m.f, m.hy), pitch: (m.pitch ? l(m.pitch[0], m.pitch[1]) : 0) * DEG, cx: m.cx ?? 0};
};

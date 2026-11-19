import type {FigAnchors} from '../kit/cast';
import {mixYCam, type YCam} from '../kit/ycam';

// EDU-EP26-SHORT shot staging helpers (Boss W5.2, 2026-11-18) for the shot files src/painted/edu26/shots/<SHOT-ID>.tsx, from the timed sheets
// EDU-EP26-SHEET-R1. The painted 3D camera is animated per frame inside each plate's `paint` (shot-local frame L), so every frame is a pure
// function of L (direct seek). Camera lines read `eye (x,y,z) m, yaw deg (0 looks -z, + toward +x), pitch deg (+ up), f px`; a line with no
// horizon takes hy 960 (the frame centre, as scripts/shot-projection.py). No Remotion import.

export const DEG = Math.PI / 180;
/** A sheet camera line as a `YCam`. */
export const yc = (x: number, y: number, z: number, yawDeg: number, pitchDeg: number, f: number, hy = 960, cx = 0): YCam =>
  ({x, y, z, yaw: yawDeg * DEG, pitch: pitchDeg * DEG, f, hy, ...(cx ? {cx} : {})});
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 0 before frame `a`, 1 after `b`, smoothstep between. */
export const ease = (L: number, a: number, b: number) => { const k = clamp01((L - a) / Math.max(1e-6, b - a)); return k * k * (3 - 2 * k); };
/** Ease-in only (the coin push). */
export const easeIn = (L: number, a: number, b: number) => { const k = clamp01((L - a) / Math.max(1e-6, b - a)); return k * k * k; };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: [number, number, number], b: [number, number, number], k: number): [number, number, number] => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
/** Piecewise camera through `[L, cam]` keys, eased in and out between neighbours, held before the first and after the last. */
export const camKeys = (keys: [number, YCam][], L: number): YCam => {
  if (L <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (L <= keys[i][0]) return mixYCam(keys[i - 1][1], keys[i][1], ease(L, keys[i - 1][0], keys[i][0]));
  return keys[keys.length - 1][1];
};
/** Retention drift (sheet: "retention drift, ±0.03 m, eased"): a slow figure-of-eight of the eye, period about 4 s, zero at L0. */
export const drift = (c: YCam, L: number, amp = 0.03): YCam => {
  const w = (2 * Math.PI * L) / 120;
  return {...c, x: c.x + amp * Math.sin(w), y: c.y + amp * 0.4 * Math.sin(2 * w)};
};
/** A slow push of `m` metres along the view over the shot (yaw only; positive = forward). */
export const push = (c: YCam, m: number): YCam => ({...c, x: c.x + Math.sin(c.yaw) * m, z: c.z - Math.cos(c.yaw) * m});
/** Tread cycle: one step per `period` frames from `from`; returns the phase 0..1 inside the current step and the step index. */
export const tread = (L: number, from: number, period: number) => {
  const s = Math.max(0, L - from) / period;
  return {k: s - Math.floor(s), n: Math.floor(s), on: L >= from};
};

/** Lead anchors collected for the headless measure (scripts/edu-series/ep26/short/measure-shots.ts): `<key>Px`, `<key>HeadY`, ... */
export type Probe26 = Record<string, number>;
export const rec = (pr: Probe26 | undefined, key: string, a: FigAnchors | null) => {
  if (!pr || !a) return;
  const top = Math.max(0, a.top), bottom = Math.min(1920, a.bottom);
  pr[`${key}Px`] = Math.round(bottom - top);
  pr[`${key}Top`] = Math.round(a.top);
  pr[`${key}HeadX`] = Math.round(a.head[0]);
  pr[`${key}HeadY`] = Math.round(a.head[1]);
  pr[`${key}Chin`] = Math.round(a.chin);
  pr[`${key}RHand`] = Math.round(a.rHand[0]) * 10000 + Math.round(a.rHand[1]);
  pr[`${key}LHand`] = Math.round(a.lHand[0]) * 10000 + Math.round(a.lHand[1]);
};

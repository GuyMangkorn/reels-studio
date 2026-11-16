import {cabinDriveAt, type DriveKey, type PassengerAct} from '../kit/car-cabin';
import type {YCam} from '../kit/ycam';
import {LOOKS} from './cabin-look-data';

// EDU-EP20-SHORT episode clock (Editor W5.3, 2026-11-16; scene sheet EDU-EP20-SS-R3, SS-R5 END20). Staging and timing only: every movement comes from
// Boss's kit (`cabinDriveAt` for lean/balloon ramps, `roadStripAt` for the window strip, both in src/painted/kit/car-cabin.ts); this file
// selects the sheet's event frames (composition-global G) and its camera lines. Pure functions of G / shot-local L (seek parity).

/** The sheet splits each drive event into the passenger's lean and the balloon's swing on separate frames (the balloon result is
 * concealed in the close shots and paid on its own gate), so each runs on its own `cabinDriveAt` key list; ramps are the sheet's. */
const ACCEL_LEAN: DriveKey[] = [{at: 187, phase: 'accelerate'}];    // B01-SH03 local 0-18: shoulder -0.07 by G205
const ACCEL_U: DriveKey[] = [{at: 355, phase: 'accelerate'}];       // B02-SH01 local 3-21: u 0 -> +0.20 by G373 (L04 onset)
const BRAKE_LEAN: DriveKey[] = [{at: 1209, phase: 'brake'}];        // B05-SH01 local 115-149: shoulder +0.07 by G1243
const BRAKE_U: DriveKey[] = [{at: 1274, phase: 'brake'}];           // B05-SH02 local 1-19: u 0 -> -0.20 by G1292 (L12 onset)
export const accelLean = (G: number) => cabinDriveAt(G, ACCEL_LEAN, {leanRamp: 18}).lean;
export const accelU = (G: number) => cabinDriveAt(G, ACCEL_U, {ramp: 18}).u;
export const brakeLean = (G: number) => cabinDriveAt(G, BRAKE_LEAN, {leanRamp: 34}).lean;
export const brakeU = (G: number) => cabinDriveAt(G, BRAKE_U, {ramp: 18}).u;

/** SS-R5 END20 (B05-SH03 G1465-1619; SS-R4 frames +29, scene sheet #ss-r5-end20): the car has stopped slowing (ROAD_KEYS last key G1443),
 * so the balloon swings back upright with the kit's cruise release from G1465 (coordinator's SS-R4 decision on Boss's finding: zero start
 * velocity, peak forward +0.0446 m at G1501; the same keys/opts as Boss's `END20_KIT_KEYS` / `END20_KIT_OPTS` in motion-check.tsx), times
 * the sheet's taper 1 - ss(1561,1585) (|u| <= 0.003 m there, so u is exactly 0 from G1585), and the passenger sits back by ss(1465,1495).
 * Before G1465 both equal brakeU / brakeLean (held u -0.20, lean +0.07). */
export const END20_START = 1465;
const END20_U: DriveKey[] = [...BRAKE_U, {at: END20_START, phase: 'cruise'}];
export const END20_U_OPTS = {ramp: 18, swingPeriod: 72, overshoot: Math.exp(-1.5)};
export const endU = (G: number) => cabinDriveAt(G, END20_U, END20_U_OPTS).u * (1 - ss((G - 1561) / 24));
export const endLean = (G: number) => brakeLean(G) * (1 - ss((G - END20_START) / 30));

/** B04-SH01 local 0-69: the sheet's small diminishing illustrative swing u +0.20 -> +0.14 (not a measured transient, never rearward). */
export const residualSwing = (L: number) => 0.14 + 0.06 * Math.exp(-L / 25) * (0.5 + 0.5 * Math.cos((2 * Math.PI * L) / 40));

export type CabinState = PassengerAct & {lean: number; u: number};

const ss = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x * x * (3 - 2 * x); };
/** 0..1 smoothstep of L across [a, b]. */
export const ease = (L: number, a: number, b: number) => ss((L - a) / Math.max(1, b - a));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** Gaze vector blend (profile eye `look`). */
export const lookMix = (a: [number, number], b: [number, number], k: number): [number, number] => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
export const LOOK_FRONT: [number, number] = [0, 0];
export const LOOK_BALLOON: [number, number] = [0.45, -0.2];
export const LOOK_WINDOW: [number, number] = [-0.4, 0.05];

/** Sheet cameras (YCam x/y/z/yaw/f/hy, pitch 0 / cx 0). A = LF20-CABIN-B camera; D-R = SS-R2 FD20-W53-01 truck. */
export const CAM: Record<'A' | 'D' | 'DR' | 'CLOSE0' | 'CLOSE1' | 'LOW0' | 'LOW1', YCam> = {
  A: LOOKS.B.camera,
  D: {x: 0.46, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305},
  DR: {x: 0.36, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305},
  CLOSE0: {x: -0.24, y: 1.04, z: 1.95, yaw: 0, f: 1500, hy: 300},
  CLOSE1: {x: -0.23, y: 1.035, z: 1.94, yaw: -0.008, f: 1500, hy: 310},
  LOW0: {x: 0.65, y: 0.98, z: 1.65, yaw: 0, f: 1000, hy: 320},
  LOW1: {x: 0.65, y: 1.03, z: 1.57, yaw: 0.03, f: 1000, hy: 320},
};
/** Sheet camera line: interpolate start -> end with smoothstep 3v^2 - 2v^3 over local [from, to], hold outside. */
export const camMove = (a: YCam, b: YCam, L: number, from: number, to: number): YCam => {
  const k = ease(L, from, to);
  return {x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), z: mix(a.z, b.z, k), yaw: mix(a.yaw, b.yaw, k), f: mix(a.f, b.f, k), hy: mix(a.hy, b.hy, k)};
};

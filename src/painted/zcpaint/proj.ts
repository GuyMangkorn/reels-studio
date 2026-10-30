import type {Pt} from '../painter';
import {foldTone, prt, strokes, tub, unitHU, type HU, type Part} from './body6';
import {hull} from './light';

// ZCPAINT projection PJ-ZCP-07 (Boss pass 14; Film SPK-ZCP-07 variant B, spike `src/painted/spike/ZcSpk07.ts`). A bust is a flat card on the
// body plane z = 0 in head units (x his right, y up from the floor). A part that reaches INTO depth (the arm to the fridge box) is modelled
// in 3D with the same units and projected by one pinhole camera: s = D / (D + z), x' = ax + (x − ax)·s, y' = ay + (y − ay)·s. At z = 0 the
// projection is the identity, so the card and the projected parts agree on the body plane. z grows away from the camera.
// Only `bust.ts` (`ArmPose` kind `reach3`, `BustOpts.proj`) and B06-SH02 use this module; default arms do not touch it.
// Cross-contour rings (Loomis 1943; Hampton 2009) are drawn on sleeves that go into depth: an arc bowed toward the near end.

export type V3 = [number, number, number];
/** The pinhole: `D` the camera distance from the body plane (head units, z = 0), `ax`/`ay` the axis (the vanishing point) in head units. */
export type Cam3 = {D: number; ax: number; ay: number};
/** A 3D reach in the bust's body space: shoulder `S`, wrist `W`, the hand frame (`F` toward the fingers, `N` the palm normal) and the
 *  elbow `pole` (the side the elbow bends toward, out-and-down for a forward reach). */
export type Reach3 = {S: V3; W: V3; F: V3; N: V3; pole: V3};

/** Arm segment lengths in head units (the bust's upper arm and forearm, `bust.ts` two-bone solve). */
export const ARM_UPPER = 0.9, ARM_FORE = 0.88;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const nrm3 = (a: V3): V3 => mul3(a, 1 / (len3(a) || 1));
export const lerp3 = (a: V3, b: V3, t: number): V3 => add3(a, mul3(sub3(b, a), t));
/** Minimum-jerk profile (Flash & Hogan 1985): the bell-shaped speed of a natural reach. */
export const minJerk = (t: number) => {
  const u = clamp01(t);
  return u * u * u * (10 - 15 * u + 6 * u * u);
};
/** Shot clock `pf` mapped to 0..1 over [a, b]. */
export const segment = (pf: number, a: number, b: number) => clamp01((pf - a) / (b - a));

/** Foreshortening of a depth `z` under the camera (1 on the body plane, smaller further away). */
export const scaleAt = (c: Cam3, z: number) => c.D / (c.D + Math.max(z, 0.35 - c.D));
/** Project a 3D point to the bust's head-unit plane. */
export const proj3 = (c: Cam3, p: V3): HU => {
  const s = scaleAt(c, p[2]);
  return [c.ax + (p[0] - c.ax) * s, c.ay + (p[1] - c.ay) * s];
};

/** Two-bone IK in 3D with a pole: the elbow lies on the side of `pole` (down, out and back for a forward reach). A target beyond the arm
 *  length is clamped to full extension (the caller must keep the reach inside `ARM_UPPER + ARM_FORE`). */
export const ik3 = (S: V3, T: V3, l1: number, l2: number, pole: V3): V3 => {
  const d0 = sub3(T, S), dl = len3(d0);
  const d = Math.min(dl, l1 + l2 - 1e-4);
  const u = mul3(d0, 1 / (dl || 1));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const pv = nrm3(sub3(pole, mul3(u, dot3(pole, u))));
  return add3(add3(S, mul3(u, a)), mul3(pv, h));
};

/** A cross-contour ring at `m` on a tube that runs along `toFar`: an arc of radius `r`, its depth `b` from the foreshortening `fr`. */
const ring = (m: HU, toFar: HU, r: number, fr: number): HU[] => {
  const b = r * Math.sqrt(Math.max(0, 1 - Math.min(1, fr) ** 2)), qx = -toFar[1], qy = toFar[0];
  return Array.from({length: 9}, (_, i): HU => {
    const th = (i / 8) * Math.PI;
    return [m[0] + qx * r * Math.cos(th) - toFar[0] * b * Math.sin(th), m[1] + qy * r * Math.cos(th) - toFar[1] * b * Math.sin(th)];
  });
};

/** The mitten in 3D (BODY-ZCP-6H: 0.40 long, 0.25 across, about 0.12 thick, one hull with the thumb lobe), projected and hulled. */
export const mittenPJ = (c: Cam3, W: V3, F: V3, N: V3, skin: string): Part => {
  const T = nrm3(cross3(N, F)); // thumb axis (his right hand, palm along N)
  const pts: HU[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 2 * Math.PI;
    for (const w of [-0.06, 0, 0.06]) {
      pts.push(proj3(c, add3(add3(add3(W, mul3(F, 0.2 + 0.2 * Math.cos(a))), mul3(T, 0.125 * Math.sin(a))), mul3(N, w))));
    }
    pts.push(proj3(c, add3(add3(add3(W, mul3(F, 0.12 + 0.07 * Math.cos(a))), mul3(T, -0.13 + 0.06 * Math.sin(a))), mul3(N, 0.03))));
  }
  const s = scaleAt(c, W[2] + 0.2 * F[2]);
  return prt(skin, hull(pts.map(([x, y]): Pt => [x, y])) as HU[], 0.09 * s, {up: true});
};

/**
 * His reaching arm (the arm on his right, screen right in the back view): mitten, forearm sleeve with its cuff, upper-arm sleeve, back to
 * front. The sleeve is cloth (`TX-ZCP-CLOTH`); the forearm stops one cuff radius short of the wrist, so a hand that turns into depth shows
 * past the cuff instead of hiding behind a round cap.
 */
export const reachArm = (c: Cam3, q: Reach3, over: string, skin: string): Part[] => {
  const E = ik3(q.S, q.W, ARM_UPPER, ARM_FORE, q.pole);
  const sS = scaleAt(c, q.S[2]), sE = scaleAt(c, E[2]), sW = scaleAt(c, q.W[2]);
  const s2 = proj3(c, q.S), e2 = proj3(c, E), w2 = proj3(c, q.W);
  const midFE = proj3(c, lerp3(E, q.W, 0.5)), midSE = proj3(c, lerp3(q.S, E, 0.5));
  const sFE = scaleAt(c, (E[2] + q.W[2]) / 2), sSE = scaleAt(c, (q.S[2] + E[2]) / 2);
  const dW = unitHU([w2[0] - e2[0], w2[1] - e2[1]]);
  const wc: HU = [w2[0] - dW[0] * 0.15 * sW, w2[1] - dW[1] * 0.15 * sW];
  const fold = foldTone(over);
  const frF = Math.hypot(w2[0] - e2[0], w2[1] - e2[1]) / (ARM_FORE * sFE);
  const frU = Math.hypot(e2[0] - s2[0], e2[1] - s2[1]) / (ARM_UPPER * sSE);
  const dU = unitHU([e2[0] - s2[0], e2[1] - s2[1]]);
  const at = (p0: HU, p1: HU, t: number): HU => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
  return [
    mittenPJ(c, q.W, q.F, q.N, skin),
    tub(over, [e2, midFE, wc], [0.19 * sE, 0.18 * sFE, 0.17 * sW], 0.13 * sFE, {up: true, cloth: true}),
    strokes([ring(wc, dW, 0.165 * sW, frF), ring(at(e2, wc, 0.5), dW, 0.175 * sFE, frF)], fold, 0.9),
    tub(over, [s2, midSE, e2], [0.215 * sS, 0.205 * sSE, 0.195 * sE], 0.13 * sSE, {up: true, cloth: true}),
    strokes([ring(at(s2, e2, 0.7), dU, 0.2 * sSE, frU)], fold, 0.9),
  ];
};

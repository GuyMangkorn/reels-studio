import {lerp, type Pt} from './painter';

// Episode-neutral math and projection types shared by the painted episodes: easing, V3 helpers, Hermite/PCHIP
// curves and the `Proj` projector contract. Episode camera setups and clocks stay in the episode's own space module.

/** Metres in the episode's world frame (WORLD FOG: origin on the floor under the glass front, +x right seen from inside, +y up, +z out). */
export type V3 = [number, number, number];

export const DEG = Math.PI / 180;
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const ease = (u: number) => u * u * (3 - 2 * u);
/** Linear 0..1 progress of f over [a, b], clamped. */
export const seg = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
/** Cubic smoothstep of x over [a, b]. */
export const smoothstep = (a: number, b: number, x: number) => ease(seg(x, a, b));
/** sin(pi u) over [a, b], exactly 0 outside (held frames stay bit-identical). */
export const bump = (f: number, a: number, b: number) => {
  const u = seg(f, a, b);
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u);
};
export const mix3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
export const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale3 = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
export const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const mix2 = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/**
 * Cubic Hermite through timed keys with Catmull-Rom tangents inside and zero velocity at both ends: eased in and out,
 * no stop at the through-points.
 */
export const hermite = (keys: [number, V3][], f: number): V3 => {
  const n = keys.length;
  let i = 0;
  while (i < n - 2 && f > keys[i + 1][0]) i++;
  const [f0, p0] = keys[i], [f1, p1] = keys[i + 1];
  const tan = (k: number): V3 => (k === 0 || k === n - 1 ? [0, 0, 0] : sub3(keys[k + 1][1], keys[k - 1][1]).map((d) => (d / (keys[k + 1][0] - keys[k - 1][0])) * (f1 - f0)) as V3);
  const m0 = tan(i), m1 = tan(i + 1), u = clamp01((f - f0) / (f1 - f0));
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  return [0, 1, 2].map((j) => h00 * p0[j] + h10 * m0[j] + h01 * p1[j] + h11 * m1[j]) as V3;
};


/** Near clip depth (m) for set polygons that reach behind the camera. */
export const NEAR = 0.12;

/**
 * One projection owner per plate: WORLD-SHOP metres to PLATE px at camera scale 1 (index ST-02 formulas: x = 540 +
 * f·lateral/d, y = y_h + f·(h_eye − y)/d, with lateral = x − cx looking +z, −(x − cx) looking −z, z − cz looking −x).
 */
export type Proj<S = unknown> = {
  P: (v: V3) => Pt;
  /** Depth along the view axis (m), clamped to NEAR. */
  depth: (v: V3) => number;
  /** Raw (unclamped) depth, for clipping. */
  rawDepth: (v: V3) => number;
  /** px per metre at the depth of v. */
  k: (v: V3) => number;
  /** World direction drawn toward screen right. */
  right: V3;
  /** Camera position (back-face tests). */
  eye: V3;
  /** The episode setup this projector was built from (typed by the episode). */
  setup?: S;
};

/**
 * A fixed-plane card (S01-SH01 car plate): every point at one depth, `k` px per metre, world x `x0` and the floor at the
 * screen point `g`. z is ignored (front view).
 */
export const cardProjector = (g: Pt, k: number, x0: number): Proj<never> => ({
  P: ([x, y]) => [g[0] + (x - x0) * k, g[1] - y * k],
  depth: () => 1,
  rawDepth: () => 1,
  k: () => k,
  right: [1, 0, 0],
  eye: [x0, 0, -1e3],
});

/**
 * Monotone cubic (PCHIP, Fritsch–Carlson interior slopes) through sorted [x, y] keys, zero slope at both ends: the value is
 * flat before the first key and after the last, and does not overshoot between keys.
 */
export const pchip = (keys: [number, number][], x: number): number => {
  const n = keys.length;
  if (x <= keys[0][0]) return keys[0][1];
  if (x >= keys[n - 1][0]) return keys[n - 1][1];
  const h = keys.slice(1).map((k, i) => k[0] - keys[i][0]);
  const d = keys.slice(1).map((k, i) => (k[1] - keys[i][1]) / h[i]);
  const m = keys.map(() => 0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  let k = 0;
  while (k < n - 2 && x > keys[k + 1][0]) k++;
  const t = (x - keys[k][0]) / h[k], t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * keys[k][1] + (t3 - 2 * t2 + t) * h[k] * m[k] + (-2 * t3 + 3 * t2) * keys[k + 1][1] + (t3 - t2) * h[k] * m[k + 1];
};

/** Pixel-space helpers shared by plates. */
export const ptLerp = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

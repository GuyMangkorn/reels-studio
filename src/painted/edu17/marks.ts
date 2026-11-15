import {ell, hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP17 finished-grade surface marks (Film W3 look frames, 2026-11-15). Every render paints flat fills (painted-2d skill), so surface texture
// is carried by small world-space marks at the value of the surface they sit on (UT12 lived-in texture under UT12a: never brighter or more
// saturated than the subject). All marks are deterministic (hash) and still (no boil).

type Plane = (u: number, v: number) => V3;

/** Short brush dashes scattered over a world plane `at(u, v)` (u, v in 0..1): sand grain, ripple shade, floor wear. `len` and `w` in metres. */
export const planeDashes = (p: Painter, c: YCam, seed: number, at: Plane, o: {n: number; col: string | ((i: number) => string); len: number; w?: number; dir?: [number, number]; jitter?: number}) => {
  for (let i = 0; i < o.n; i++) {
    const u = hash(seed + i * 1.37), v = hash(seed + i * 2.71 + 0.5), a = at(u, v);
    const d = o.dir ?? [1, 0], j = (hash(seed + i * 3.3) - 0.5) * (o.jitter ?? 0.4), l = o.len * (0.6 + hash(seed + i * 4.1) * 0.8);
    const b = at(Math.min(1, u + d[0] * l * (1 + j)), Math.min(1, v + d[1] * l + j * l * 0.3));
    const q0 = camPoint(c, a), q1 = camPoint(c, b);
    if (!q0 || !q1) continue;
    const k = camUnit(c, a), w = Math.max(0.5, (o.w ?? 0.012) * k);
    if (Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) < 1.2) continue;
    inkLine(p, seed + i, [q0, q1], {closed: false, color: typeof o.col === 'function' ? o.col(i) : o.col, weight: Math.min(w, 6), still: true, curve: 0.3});
  }
};

/** Soft blots on a world plane (stains, damp patches, pebbles): ellipses sized `r` metres, flattened by `flat`. */
export const planeBlots = (p: Painter, c: YCam, seed: number, at: Plane, o: {n: number; col: string | ((i: number) => string); r: number; flat?: number; vert?: boolean}) => {
  for (let i = 0; i < o.n; i++) {
    const a = at(hash(seed + i * 1.91), hash(seed + i * 2.37 + 0.2)), q = camPoint(c, a);
    if (!q) continue;
    const k = camUnit(c, a), r = o.r * (0.5 + hash(seed + i * 5.1)) * k;
    if (r < 0.8) continue;
    hardFill(p, seed + i, typeof o.col === 'function' ? o.col(i) : o.col, o.vert ? ell(q[0], q[1] + r * 0.8, r * 0.45, r * 1.4, 10) : ell(q[0], q[1], r, r * (o.flat ?? 0.45), 10, (hash(seed + i) - 0.5) * 0.4));
  }
};

/** Parallel grain lines along a world quad edge direction (plank wood grain, sheath highlight): `rows` lines from corner a->b, offset toward d. */
export const grainLines = (p: Painter, c: YCam, seed: number, a: V3, b: V3, d: V3, o: {rows: number; col: string; w?: number; wobble?: number}) => {
  for (let r = 0; r < o.rows; r++) {
    const f = (r + 0.5) / o.rows + (hash(seed + r) - 0.5) * 0.12, pts: Pt[] = [];
    const s0 = hash(seed + r * 7) * 0.25, s1 = 0.75 + hash(seed + r * 9) * 0.25;
    for (let i = 0; i <= 8; i++) {
      const u = s0 + ((s1 - s0) * i) / 8, wob = Math.sin(u * 9 + r) * (o.wobble ?? 0.06);
      const v: V3 = [a[0] + (b[0] - a[0]) * u + d[0] * (f + wob), a[1] + (b[1] - a[1]) * u + d[1] * (f + wob), a[2] + (b[2] - a[2]) * u + d[2] * (f + wob)];
      const q = camPoint(c, v);
      if (q) pts.push(q);
    }
    if (pts.length > 2) inkLine(p, seed + r, pts, {closed: false, color: o.col, weight: o.w ?? 0.6, still: true, curve: 0.4});
  }
};

/** A soft contact shadow: a dark flattened ellipse on the ground under a prop at `at`, radius `r` metres. */
export const contact = (p: Painter, c: YCam, seed: number, at: V3, r: number, col: string, flat = 0.32) => {
  const q = camPoint(c, at);
  if (!q) return;
  const k = camUnit(c, at);
  hardFill(p, seed, col, ell(q[0] + r * k * 0.15, q[1], r * k, r * k * flat, 16));
};

export const tone = (col: string, dark: number) => (dark >= 0 ? mixColor(col, '#3a2418', dark) : mixColor(col, '#fff6e2', -dark));

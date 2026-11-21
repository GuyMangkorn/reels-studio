import {animalWalkSpeed, type AnimalDef} from '../kit/animals';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP32-SHORT G4 (B03-SH03, B04-SH01; Boss W5.2, 2026-11-21): helpers for the real cat moving on Space F ground. React-free.

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
export const smooth = (x: number) => { const c = clamp01(x); return c * c * (3 - 2 * c); };
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const lerpV = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];

/**
 * Kit gait clock (`AnimalPose.walk`, seconds) for a profile walk along world path `path(L)` (shot frames) seen through `camAt(L)`: the cat's own
 * picture-x travel over the ground (both points through the same camera, so a camera move does not count) divided by its lens scale and the kit
 * walk speed, integrated in quarter frames from `L0`. A path that runs toward the lens shows less picture travel, so the drawn paws step slower
 * and stay planted instead of sliding (planted-foot slide = 0 by construction).
 */
export const pictureGaitClock = (def: AnimalDef, path: (L: number) => V3, camAt: (L: number) => YCam, L0: number, L: number): number => {
  const v = animalWalkSpeed(def);
  let s = 0;
  for (let x = L0; x < L - 1e-9; x += 0.25) {
    const x1 = Math.min(L, x + 0.25), c = camAt((x + x1) / 2), a = path(x), b = path(x1), pa = camPoint(c, a), pb = camPoint(c, b);
    if (pa && pb) s += Math.abs(pb[0] - pa[0]) / camUnit(c, lerpV(a, b, 0.5));
  }
  return s / v;
};

/** Distance fraction 0..1 of a walk of `n` frames that starts at cruising speed and eases to a stop over its last `stop` frames (kit `arrive`). */
export const arriveFrac = (i: number, n: number, stop: number): {f: number; stride: number} => {
  const t = Math.max(0, Math.min(n, i)), total = n - stop / 2;
  if (t <= n - stop) return {f: t / total, stride: 1};
  const u = (t - (n - stop)) / stop;
  return {f: (n - stop + stop * (u - (u * u) / 2)) / total, stride: 1 - u};
};
/** Distance fraction of a walk that starts from rest and speeds up over its first `go` frames, then cruises (kit `depart`), normalised so the
 *  fraction is 1 at frame `n`. */
export const departFrac = (i: number, n: number, go: number): {f: number; stride: number} => {
  const t = Math.max(0, i), total = n - go / 2;
  if (t <= go) { const u = t / go; return {f: ((go * u * u) / 2) / total, stride: u}; }
  return {f: (go / 2 + (t - go)) / total, stride: 1};
};

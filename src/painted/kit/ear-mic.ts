import {capsule, hardFill, inkLine} from './draw';
import type {Painter, Pt} from './painter';

const COPPER = '#d9813a';

/** `new: ear-mic` (R2, user LF04 2026-11-21: the old dark disc with a glint read as an open eye on the sleeping cat): a small steel capsule from `a`
 *  (top) to `b` (bottom) sitting in the ear hollow, width `w` px. Mid steel body, a darker underside, one thin lit line along its length (no round
 *  catchlight, no dark centre) and a copper collar at `b` where the antenna thread leaves it, so it reads as a device, never as a pupil. */
export const paintEarMic = (p: Painter, seed: number, a: Pt, b: Pt, w: number) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, s = nx < 0 ? -1 : 1;
  const off = (q: Pt, k: number): Pt => [q[0] + s * nx * k * w, q[1] + s * ny * k * w], along = (k: number): Pt => [a[0] + dx * k, a[1] + dy * k];
  hardFill(p, seed, '#454c55', capsule(a, b, w, w, 5));
  hardFill(p, seed + 1, '#a3acb5', capsule(off(a, -0.12), off(along(0.86), -0.12), w * 0.66, w * 0.66, 5));
  inkLine(p, seed + 2, [off(along(0.15), -0.22), off(along(0.7), -0.22)], {color: '#dde3e8', weight: Math.max(0.6, w * 0.16), closed: false, still: true, curve: 0});
  hardFill(p, seed + 3, COPPER, capsule(along(0.84), b, w * 1.04, w * 1.04, 4));
};

import {washAt} from '../kit/draw';
import type {Painter} from '../kit/painter';
import {wp} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {flankPart, LabelChip, type GlowPlate} from './glow';
import {vergePuddlePolys} from './road';

// EDU-EP21-SHORT explanatory state, shared by the BG3 plates B02-SH06, B04-SH10 and B05-SH13 (Boss W5.2, 2026-11-16; EDU-EP21-SHEETS-R1).
// The route glow itself (N6) and the chip (N7) live in glow.tsx; this module holds the plate-stage choices the three shots share.

/** Smoothstep of `L` from `a` to `b` (0 before, 1 after). */
export const sm = (L: number, a: number, b: number) => { const k = Math.min(1, Math.max(0, (L - a) / (b - a))); return k * k * (3 - 2 * k); };

/** BG3 plate design of the glow (`GlowPlate`) for camera `c`: red-orange flank (LF03 defect 3), the pool tight under the car and its ends,
 *  and the wet road's reflection falling off toward the lens (fresnel) from just under the near contact line +28 px to none at +173 px, so
 *  the caption band 1176-1344 passes. The contact line's picture y is taken at the car's middle (0, 0, 0.85) (SH06, tuned there: contact y
 *  1088-1097, fresnel 1125-1270) or, with `high` 0..1, blended toward its highest point over x -2.1..2.1 (SH10's push, where the contact
 *  line slants steeply and the rear end's pool reached the band). */
export const plateGlow = (c: YCam, high = 0): GlowPlate => {
  const ys = [-2.1, 0, 2.1].map((x) => camPoint(c, [x, 0, 0.85])?.[1] ?? 1097), y = ys[1] + (Math.min(...ys) - ys[1]) * high;
  return {redOrange: true, tight: true, fresnel: [y + 28, y + 173]};
};

/** The LF03 verge tufts for the SH06/SH10 lens (between the puddles). */
export const EXPLAIN_TUFTS: {x: [number, number]; z: [number, number]; n: number}[] = [
  {x: [-4.5, -2.4], z: [2.45, 3.4], n: 26}, {x: [1.1, 2.0], z: [3.05, 3.45], n: 12}, {x: [2.5, 3.3], z: [2.5, 3.3], n: 10}, {x: [2.4, 4.5], z: [3.3, 3.75], n: 14}];

/** Picture polygons of the water the glow's mirror may show in: the wet asphalt and the verge puddles. */
export const wetPolys = (c: YCam) => [wp(c, [[-900, 0, -8.6], [900, 0, -8.6], [900, 0, 2.4], [-900, 0, 2.4]]), ...vergePuddlePolys(c)];

/** The near ground in shade (the shoulder and verge nearest the lens, world z bands toward +z), stepped washes for a soft falloff: the
 *  caption band sits over this ground in the low SH06/SH10 lens, and its base luma (puddles mirroring the sky, the wet sheen) left no room
 *  for the pool (live 0.266, explanatory 0.244 with no pool). `k` 0..1 strength. */
export const paintNearShade = (p: Painter, c: YCam, k: number, z0 = 1.6, steps = 5, dz = 0.45) => {
  if (k <= 0) return;
  for (let i = 0; i < steps; i++) {
    const za = z0 + i * dz, q = wp(c, [[-30, 0.01, za], [30, 0.01, za], [30, 0.01, 12], [-30, 0.01, 12]]);
    if (q.length >= 3) washAt(p, 35400 + i, '#12161c', 90 * k, q, 0.15, 0.25);
  }
};

/** The near lower door and wheel in shade under world height `h` (three stepped washes, softer at the top), strength `k` 0..1: B04-SH10's
 *  push brings the lower door into the caption band (as B01-SH02's lower door in shade, BG1). Pair with `GlowPlate.flankFloor` = `h`. */
export const paintFlankShade = (p: Painter, c: YCam, k: number, h: number) => {
  if (k <= 0) return;
  [h, h - 0.1, h - 0.2].forEach((y, i) => {
    const q = wp(c, flankPart(c, y, false));
    if (q.length >= 3) washAt(p, 35420 + i, '#12161c', 90 * k, q, 0.12, 0.25);
  });
};

/** The lowest world height (m) on the near flank that still projects above picture y `yMax` at every x of the body (bisection per x,
 *  the highest wins): the flank floor that keeps the coat out of the caption band for camera `c`. 0 when the whole flank is above it. */
export const flankFloorFor = (c: YCam, yMax = 1150) => {
  const s = c.z > 0 ? 0.851 : -0.851;
  return Math.max(0, ...[-2.2, -1.5, -0.75, 0, 0.75, 1.5, 2.2].map((x) => {
    const y = (h: number) => camPoint(c, [x, h, s])?.[1] ?? 0;
    if (y(0.28) <= yMax) return 0;
    if (y(0.96) > yMax) return 0.96;
    let a = 0.28, b = 0.96;
    for (let i = 0; i < 20; i++) { const m = (a + b) / 2; if (y(m) > yMax) a = m; else b = m; }
    return b;
  }));
};

/** N7 chip at opacity `o`. The text "ภาพอธิบายแบบง่าย" is final (N7; the user chose it 2026-11-17, Q1 closed). */
export const Chip = ({o}: {o: number}) => (o <= 0 ? null : <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, o)}}><LabelChip /></div>);

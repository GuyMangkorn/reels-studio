import {washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camDepth, camPoint, type YCam} from '../kit/ycam';
import type {Item} from '../kit/world';
import type {V3} from '../kit/space';
import {SNIFF_AT} from './beast-trex';

// N16-22 R3 T. rex sniff vapour (Boss, 14 Nov 2026): a small humid-air puff leaving the nostril at each sniff (16C +28, +40). Four soft billows drift forward and up, grow and fade over `FRAMES` frames.
export const VAPOUR_FRAMES = 12;
/** 0..1 age of the puff for a sniff clip of `len` frames at clip fraction `t`, or -1 when no puff is alive: puffs start at each `SNIFF_AT` moment. */
export const vapourAge = (t: number, len: number): number => {
  for (const s of SNIFF_AT) { const a = (t - s) * len; if (a >= 0 && a < VAPOUR_FRAMES) return a / VAPOUR_FRAMES; }
  return -1;
};
/** Paint the puff at world nostril point `at`, heading (fx, fz) unit; `u` 0..1 from `vapourAge`; `scale` = metres: wisps drift about `scale` forward and are up to 1.35 x `scale` long. Drawn as an Item so it sorts with the head.
 * B-R15B-04 (14 Nov 2026): five soft elongated wisps (a long thin drop, 4 to 6 times longer than wide, tapering at both ends, slightly curled) leave the nostril line one after another, drift forward and up and stretch while they fade;
 * each is one wash layer of strength up to 235 at its peak of a single wisp but only one layer each and tinted toward the sky (the old four round billows overlapped into a white ball; p5.brush washes under about 150 vanish into the paper). No wisp is ever round, and they stay in a thin band along the nostril line. */
export const vapourItem = (at: V3, fwd: [number, number], u: number, o: {scale?: number; seed?: number; bias?: number} = {}): Item => ({at, bias: o.bias ?? -0.5, draw: (p: Painter, c: YCam) => {
  if (u < 0) return;
  const R = o.scale ?? 0.5, seed = o.seed ?? 47000, a = camPoint(c, at), b = camPoint(c, [at[0] + fwd[0] * R, at[1] + R * 0.45, at[2] + fwd[1] * R]);
  if (!a || !b) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux, ppm = c.f / Math.max(0.5, camDepth(c, at));   // screen px per metre at the nostril
  for (let i = 0; i < 5; i++) {
    const m = Math.min(1, Math.max(0, u * 1.2 - i * 0.07));
    if (m <= 0) continue;
    const spread = (hash(seed + i * 7) - 0.5) * 0.3, along = (0.05 + 0.5 * m) * (0.75 + 0.25 * hash(seed + i * 11)), lift = 0.12 * R * m * ppm;
    const cx = a[0] + dx * along + nx * spread * len * 0.28, cy = a[1] + dy * along + ny * spread * len * 0.28 - lift;
    const L = (0.35 + 1.0 * m) * R * ppm * (0.7 + 0.3 * hash(seed + i * 13)), W = L * (0.26 + 0.06 * hash(seed + i * 17)), curl = (hash(seed + i * 19) - 0.5) * 0.6, op = 235 * Math.sin(Math.min(1, m * 2) * Math.PI * 0.5) * (1 - u * u) * (1 - i * 0.08);
    const N = 16, ring: Pt[] = [];
    for (let j = 0; j < N; j++) {   // a drop outline: t round the ring, x along the wisp (-1 tail .. 1 head), width swells in the middle and tapers to both points, the spine bends by `curl`
      const t = (j / N) * 6.2832, x = Math.cos(t), w = Math.sin(t) * (1 - x * x) ** 0.7 * (0.8 + 0.2 * Math.sin(t * 2 + i)), bend = curl * L * (1 - x * x) * 0.5;
      ring.push([cx + ux * x * L * 0.5 + nx * (w * W * 0.5 + bend), cy + uy * x * L * 0.5 + ny * (w * W * 0.5 + bend)]);
    }
    // a cool grey underlay a little lower (the wisp's shaded side, so it reads on a pale sky) and the white body over it
    washAt(p, seed + 20 + i * 3, '#b4c4c4', op * 0.7, ring.map(([x, y]): Pt => [x + nx * 0, y + W * 0.18]), 0.25, 0.3);
    washAt(p, seed + 21 + i * 3, '#f2f7f2', op * 0.85, ring, 0.25, 0.3);
  }
}});

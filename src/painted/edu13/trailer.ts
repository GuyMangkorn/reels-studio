import {hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import {tintPainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import {camPoint, type YCam} from '../kit/ycam';
import {qy, qz, wFill} from '../edu02/world';
import {SOI} from './soi';

// EDU-EP13-SHORT trailer look (TR01; brief EDU-EP13-BRIEF-R1.4 VD26, N15, N16): the dusk grade for the three trailer plates SH04-SH04C and the
// skyline plate for SH04C. Reuses kit `paintSkyBands`/`paintSkyDisc` (sky.ts) and the `glarePainter` method (glare.ts: tint + multiply through
// `tintPainter`, driven by a 0..1 grade). Grain and the soft vignette are screen layers (look.tsx), on the trailer plates only.

/** Palette and grade of TR01 (VD26). */
export const TRAILER_GRADE = {
  sky: {top: '#3b4a6b', mid: '#c98a7a', horizon: '#f2a65a'}, sun: '#ffb45e', sunGlow: '#ffc27a', haze: '#6f8f9a', rim: '#ffc27a',
  tint: '#26495a', amount: 0.5, mul: [0.72, 0.78, 0.92] as [number, number, number], drainTo: '#7d7f84', drain: 30,
} as const;

/** The painter at the trailer grade (cool teal shadows through the glare method); `drain` 0..1 fades it to flat grey (the tape-stop, VD29). */
export const trailerPainter = (p: Painter, drain = 0): Painter => {
  const q = tintPainter(p, TRAILER_GRADE.tint, TRAILER_GRADE.amount, {mul: TRAILER_GRADE.mul, brush: true});
  return drain > 0 ? tintPainter(q, TRAILER_GRADE.drainTo, Math.min(1, drain), {brush: true}) : q;
};
const sm = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
/** Drain amount at `frame`: 0 until `at`, then an eased rise to 1 over `TRAILER_GRADE.drain` frames. */
export const trailerDrain = (frame: number, at: number): number => sm((frame - at) / TRAILER_GRADE.drain);

/** Row of the horizon (pitch lifts it below `hy`). */
export const horizonRow = (c: YCam) => c.hy + c.f * Math.tan(c.pitch ?? 0);

/** SH04 / SH04B sky: bands and a low sun behind the tower (no skyline; the houses and tower fill the horizon). */
export const duskSky = (sun: Pt, r: number) => (p: Painter, c: YCam) => {
  paintSkyBands(p, {from: TRAILER_GRADE.sky.top, via: TRAILER_GRADE.sky.mid, viaAt: 0.55, to: TRAILER_GRADE.sky.horizon, horizon: horizonRow(c) + 60, width: 1080, bands: 14, style: 'flat'});
  paintSkyDisc(p, {x: sun[0], y: sun[1], r, color: TRAILER_GRADE.sun, glowColor: TRAILER_GRADE.sunGlow, glow: 0.7, seed: 7200});
};

/** `new: skyline` plate (N16): far textless towers 30-90 m on a ring 300-3000 m behind the tower, flat cards square to the camera, haze
 * fading with distance, a flat haze plane for the far ground. Painted far to near. */
export const paintSkyline = (p: Painter, c: YCam) => {
  const hy = horizonRow(c), w = 1080;
  hardFill(p, 7500, mixColor(TRAILER_GRADE.sky.horizon, TRAILER_GRADE.haze, 0.55), [[-200, hy - 2], [w + 200, hy - 2], [w + 200, 2200], [-200, 2200]]); // far ground
  const base = SOI.tower.z, n = 54;
  const ring = Array.from({length: n}, (_, i) => {
    const d = 420 + 2580 * Math.pow(hash(i * 3.7), 1.6), zc = base - d; // depth behind the tower, 300-3000 m
    const reach = (c.z - zc) * 0.17; // half the visible width at that depth (m)
    const xc = c.x + (c.z - zc) * Math.tan(c.yaw) + (hash(i * 9.1) - 0.5) * 2 * reach * 1.15;
    return {d, zc, xc, w: 14 + 24 * hash(i * 1.3), h: 30 + 60 * hash(i * 5.9) * (0.7 + 0.3 * hash(i * 2.9)), t: hash(i * 2.2)};
  }).sort((a, b) => b.d - a.d);
  ring.forEach((q, i) => {
    const u = Math.min(0.88, 0.35 + q.d / 4200), col = mixColor(mixColor('#5d7585', '#7f95a2', q.t), TRAILER_GRADE.haze, u);
    wFill(p, c, 7510 + i * 3, mixColor(col, TRAILER_GRADE.sky.horizon, 0.18), qz(q.zc, q.xc - q.w / 2, q.xc + q.w / 2, 0, q.h));
    if (q.h > 55) wFill(p, c, 7511 + i * 3, mixColor(col, TRAILER_GRADE.sky.mid, 0.25), qz(q.zc + 0.01, q.xc - q.w / 2, q.xc - q.w / 2 + q.w * 0.18, 0, q.h)); // lit edge
  });
  wFill(p, c, 7700, mixColor(TRAILER_GRADE.haze, TRAILER_GRADE.sky.horizon, 0.35), qy(0, -4000, 4000, base - 300, base - 4000)); // haze bank at the foot of the skyline
};

/** Warm rim along the tower's roof edge and its sun side (the sun is behind it), drawn after the plate so the houses stay in front. */
export const towerRim = (p: Painter, c: YCam) => {
  const {x, z, w, floors} = SOI.tower, x0 = x - w / 2, x1 = x + w / 2, zf = z + w / 2, H = floors * SOI.storey;
  wFill(p, c, 7800, TRAILER_GRADE.rim, qz(zf + 0.05, x0 - 0.4, x1 + 0.4, H + 1.2, H + 1.7));
  wFill(p, c, 7801, TRAILER_GRADE.rim, qz(zf + 0.05, x0 - 0.4, x0 + 0.5, 15, H + 1.2));
  wFill(p, c, 7802, mixColor(TRAILER_GRADE.rim, TRAILER_GRADE.sky.mid, 0.4), qz(zf + 0.05, x1 - 0.5, x1 + 0.4, 15, H + 1.2));
};

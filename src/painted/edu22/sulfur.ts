import {hardFill} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {gripOf, paintMitten, stripAt, YOLK_L, type StripPose} from './demo';

// EDU-EP22-SHORT sulfur motes and their tarnish blots on strip A (scene sheet EDU-EP22-SCENES-R2 B04-SH15 / B04-SH16, fix list items 4 and 5;
// Boss W6.2, 2026-11-17). Imported only by B04-SH15 and B04-SH16 (demo.ts unchanged, so SH13/SH14 stay bit-identical). 12 deterministic motes
// rise from the left yolk l 14-40, each flies a 12 f arc (peak +0.012 m) and lands l 40-73 (one every 3 f) on strip A's still-bright part
// (u 0.64-0.87 from the tip, s -0.6..0.6 across), sits 3 f, fades into its spot over 3 f while a #1c1a19 blot (soft 4 px edge) grows over 6 f.
// Mote: body #f0b400, a 2 px #5a3c00 outline, a #fff4c0 highlight up-left. The last blot is whole by l 82 (nothing new from l 83). Sizes are world
// radii calibrated to the sheet's px at the SH15 hold (mote Ø 30 px, blot Ø 40 px at r 0.125); the outline and soft edge are px.

export const MOTE_R = 0.002;
export const BLOT_R = 0.00265;
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
/** Landing grid on the bright part (4 rows along u x 3 across s), visited in a scattered order so the first motes land mid-strip. */
const CELLS = [5, 10, 1, 7, 3, 11, 0, 8, 4, 9, 2, 6];
export const MOTES = CELLS.map((cell, i) => ({
  emerge: 14 + Math.round((26 * i) / 11),
  land: 40 + 3 * i,
  from: [YOLK_L[0] + (rnd(i, 1) - 0.5) * 0.02, YOLK_L[1] + 0.002, YOLK_L[2] + (rnd(i, 2) - 0.5) * 0.016] as V3,
  u: [0.64, 0.72, 0.8, 0.87][Math.floor(cell / 3)] + (rnd(i, 3) - 0.5) * 0.02,
  s: [-0.6, 0, 0.6][cell % 3] + (rnd(i, 4) - 0.5) * 0.12,
}));

const len = (v: V3) => Math.hypot(v[0], v[1], v[2]) || 1;
/** World point on strip A at (u along, s across -1..1), lifted `h` off its face. */
const onStrip = (q: StripPose, u: number, s: number, h = 0.0004): V3 => {
  const w = stripAt(q, u);
  return [w[0] + q.side[0] * 0.0075 * s * 0.7, w[1] + h, w[2] + q.side[2] * 0.0075 * s * 0.7];
};
/** A world disc of radius `r` (+ `px` picture px) on the strip's plane at `at`, as a picture polygon. */
const discOnStrip = (c: YCam, q: StripPose, at: V3, r: number, px = 0): Pt[] => {
  const ax: V3 = [q.top[0] - q.tip[0], q.top[1] - q.tip[1], q.top[2] - q.tip[2]], la = len(ax), sd = len(q.side);
  const rr = r + px / Math.max(1, camUnit(c, at));
  const out: Pt[] = [];
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * 2 * Math.PI, ca = Math.cos(a) * rr / la, sa = Math.sin(a) * rr / sd;
    const pt = camPoint(c, [at[0] + ax[0] * ca + q.side[0] * sa, at[1] + ax[1] * ca + q.side[1] * sa, at[2] + ax[2] * ca + q.side[2] * sa]);
    if (pt) out.push(pt);
  }
  return out;
};
const disc = (x: number, y: number, r: number, n = 14): Pt[] => Array.from({length: n}, (_, k) => [x + r * Math.cos((k / n) * 2 * Math.PI), y + r * Math.sin((k / n) * 2 * Math.PI)] as Pt);
const smooth = (x: number) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };

/** One mote at world point `w`, opacity `a`. */
const paintMote = (p: Painter, c: YCam, i: number, w: V3, a: number) => {
  const q = camPoint(c, w);
  if (!q || a <= 0.01) return;
  const r = MOTE_R * camUnit(c, w), lp = a < 1 ? p.layer(a, 29900 + i * 9) : p;
  hardFill(lp, 29901 + i * 9, '#5a3c00', disc(q[0], q[1], r + 2));
  hardFill(lp, 29902 + i * 9, '#f0b400', disc(q[0], q[1], r));
  hardFill(lp, 29903 + i * 9, '#fff4c0', disc(q[0] - r * 0.35, q[1] - r * 0.35, Math.max(1.5, r / 3), 10));
};
/** One blot grown to `k` 0..1 on strip pose `q`. */
const paintBlot = (p: Painter, c: YCam, q: StripPose, i: number, k: number) => {
  if (k <= 0) return;
  const m = MOTES[i], at = onStrip(q, m.u, m.s), r = BLOT_R * smooth(k);
  const soft = discOnStrip(c, q, at, r, 4), core = discOnStrip(c, q, at, r);
  if (soft.length >= 3) hardFill(p.layer(0.45, 29960 + i * 3), 29960 + i, '#1c1a19', soft);
  if (core.length >= 3) hardFill(p.layer(0.95, 29961 * 3 + i * 3), 29961 + i * 4, '#1c1a19', core);
};

/** Every blot whole (SH15's exit state; SH16's strip A). */
export const paintBlots = (p: Painter, c: YCam, q: StripPose) => MOTES.forEach((_, i) => paintBlot(p, c, q, i, 1));

/** SH15 frame L: blots first, then the motes on the yolk, in flight and sitting on the strip `q` (the strip pose of that frame). */
export const paintSulfur = (p: Painter, c: YCam, q: StripPose, L: number) => {
  MOTES.forEach((m, i) => { if (L >= m.land + 3) paintBlot(p, c, q, i, (L - m.land - 3) / 6); });
  MOTES.forEach((m, i) => {
    if (L < m.emerge || L >= m.land + 6) return;
    const launch = m.land - 12, rise = Math.min(1, (L - m.emerge) / 10) * 0.004, start: V3 = [m.from[0], m.from[1] + rise, m.from[2]];
    const end = onStrip(q, m.u, m.s, 0.0012);
    if (L < launch) return paintMote(p, c, i, start, 1);
    if (L < m.land) {
      const k = (L - launch) / 12;
      return paintMote(p, c, i, [start[0] + (end[0] - start[0]) * k, start[1] + (end[1] - start[1]) * k + Math.sin(Math.PI * k) * 0.012, start[2] + (end[2] - start[2]) * k], 1);
    }
    paintMote(p, c, i, end, L < m.land + 3 ? 1 : 1 - (L - m.land - 3) / 3);
  });
};

/** Repaint the mitten pinching strip `q` (as paintDemo draws it) so marks painted after paintDemo never sit over the hand. */
export const repaintMitten = (p: Painter, c: YCam, q: StripPose, dir?: number, gripU?: number) => {
  const g = gripU === undefined ? gripOf(q) : stripAt(q, gripU), pinch = camPoint(c, g), t0 = camPoint(c, q.tip), t1 = camPoint(c, gripOf(q));
  if (!pinch) return;
  paintMitten(p, pinch, camUnit(c, g), dir ?? (t0 && t1 ? Math.atan2(t1[1] - t0[1], t1[0] - t0[0]) : 0.6));
};
/** SH15: the mitten pinches the strip's very end (fingertips at u 1.08, the mitten's front edge near u 0.95), so the bright upper part where the
 *  motes land stays in view under the push-in (at the kit grip u 0.97 the fingertips covered u > 0.83 at the hold). */
export const SH15_GRIP_U = 1.08;

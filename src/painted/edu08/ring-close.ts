import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDepth, camPoint, camPoly, type YCam} from '../kit/ycam';
import {camMove, camOf} from '../kit/cam-moves';
import {paintEarth} from '../kit/earth';
import {EVA} from '../kit/wardrobe';
import {shadeFace} from './orbit';

// EDU-EP08-SHORT N5, RING-CLOSE close plate (brief EDU-EP08-BRIEF-R1.1 close plate; shot S01-B01-SH04). Set-cm: 1 world unit = 1 cm
// (the EP02/EP06 close-plate convention). A generic modern suit neck ring seen close in three quarters from above: white bearing ring
// (outer R 15 cm, opening r 13.4), blue lock collar (3 cm wide) below it, a latch lever 6 cm long and a yellow indicator stripe that
// aligns with the ring's yellow mark when the latch is home. No text, no red/green labels, no logos. Painted back to front in ring-local
// coordinates (y up, latch at azimuth 0 = +z), then the whole ring is tilted `TILT` deg toward the lens about the latch point so a level
// camera sees it from above and a sliver of Earth stays low in the frame.

export const RC = {R: 15, r: 13.4, ringH: 2.4, collarR: 15.5, collarH: 3, lever: 6, leverW: 2.4, lockDeg: 35, stage1Deg: 20, tilt: 30};
export const RCC = {ring: '#e8ecf0', ringSh: '#7f8a99', collar: EVA.collar, collarSh: '#27427a', fabric: '#d9dee5', inside: '#0e121b', lever: '#59627a', leverLit: '#cfd6df', stripe: '#f0b43a'};

/** Lever rotation over the insert: 0 at 0.25 s open, `stage1Deg` first click, `lockDeg` locked (second click). Seconds are shot-local. */
export const RING_CLOSE_KEYS = {t0: 0.25, t1: 0.25, tLock: 0.55};
/** Latch rotation (deg) at shot-local seconds `t`: still open before 0.25 s, 0 -> 20 deg by 0.25 s is the brief's first stage, 20 -> 35 deg at 0.55 s. Two-stage with a short hold between. */
export const latchDeg = (t: number): number => {
  const k = RING_CLOSE_KEYS, ease = (x: number) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };
  // stage 1 completes AT 0.25 s (click 1), stage 2 AT 0.55 s (click 2); each stage runs the 0.1 s before its click
  const s1 = ease((t - (k.t1 - 0.1)) / 0.1), s2 = ease((t - (k.tLock - 0.1)) / 0.1);
  return RC.stage1Deg * s1 + (RC.lockDeg - RC.stage1Deg) * s2;
};

/** Camera `cam: RING-CLOSE latch, yaw 15->9, r 22->19 set-cm, f 1000, hy 900` at fraction u of the shot (target = the latch, origin).
 * hy 900 (ROWS-R1.3, was 820): at 820 the white ring rim ran at y 389-410 behind the timer-ring label (ring zone to y ~430). */
export const camRingClose = (u: number): YCam => camOf(camMove([0, 0, 0], [15, 9], [22, 19], 0, {pitch: [0, 0], f: 1000, hy: 900}), u);

const D2R = Math.PI / 180;
/** Azimuth (deg, ring-local) of the ring's fixed yellow mark; the latch sits at 0 and the collar stripe arrives at the mark from the left. */
export const MARK_AZ = -20;
/** Ring-local point (azimuth deg about +y, 0 = +z) -> set-cm world point, tilted about the latch. */
const LATCH_Y = -1.4;
const tiltPt = (v: V3): V3 => {
  const L: V3 = [0, LATCH_Y, RC.R], x = v[0] - L[0], y = v[1] - L[1], z = v[2] - L[2], a = RC.tilt * D2R;
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
};
const polar = (r: number, azDeg: number, y: number): V3 => [r * Math.sin(azDeg * D2R), y, r * Math.cos(azDeg * D2R)];
const tiltN = (n: V3): V3 => { const a = RC.tilt * D2R; return [n[0], n[1] * Math.cos(a) - n[2] * Math.sin(a), n[1] * Math.sin(a) + n[2] * Math.cos(a)]; };
const SUN: V3 = (() => { const v: V3 = [-0.65, 0.6, 0.45], n = Math.hypot(...v); return [v[0] / n, v[1] / n, v[2] / n]; })();
const shade = (n: V3, lit: string, dark: string) => shadeFace(tiltN(n), lit, dark, SUN);

export type RingCloseOpts = {
  /** Latch rotation, degrees 0..35 (35 = locked, the indicator stripe aligned). */
  latch: number;
  /** Paint the Earth limb sliver and stars first (default true); pass false when the caller has painted the backdrop. */
  earth?: boolean; seed?: number;
};

/** Painted pieces of the plate: returns the picture point of the latch pivot and of the two stripes (for tests and sound cues). */
export const paintRingClose = (p: Painter, c: YCam, o: RingCloseOpts) => {
  const id = 9900, N = 48, lam = Math.max(0, Math.min(RC.lockDeg, o.latch));
  if (o.earth !== false) paintEarth(p, {...c, pitch: 0.2, hy: 260}, {seed: 8830, clouds: 380}); // hy 260 (ROWS-R1.3, was 800): the limb sliver shows over the left shoulder
  const W = (pts: V3[]) => camPoly(c, pts.map(tiltPt));
  const fill = (seed: number, col: string, pts: V3[]) => { const q = W(pts); if (q.length >= 3) hardFill(p, seed, col, q); return q; };
  const az = (i: number) => (i / N) * 360;
  // the camera in ring-local coordinates (undo the tilt and the latch shift), for far-to-near order and the visible half of each rim
  const ta = RC.tilt * D2R, cl: V3 = [c.x, c.y * Math.cos(ta) + c.z * Math.sin(ta) + LATCH_Y, -c.y * Math.sin(ta) + c.z * Math.cos(ta) + RC.R];
  const camAz = Math.atan2(cl[0], cl[2]) / D2R;
  // far to near by angular distance from the camera's side
  const order = Array.from({length: N}, (_, i) => i).sort((a, b) => Math.abs(angDiff(az(b) + 180 / N, camAz)) - Math.abs(angDiff(az(a) + 180 / N, camAz)));
  const faces = (i: number) => { const a0 = az(i), a1 = az(i + 1), am = (a0 + a1) / 2; return {a0, a1, am, n: [Math.sin(am * D2R), 0, Math.cos(am * D2R)] as V3}; };
  // 1: the dark inside of the opening (far inner wall, then the void)
  fill(id, RCC.inside, Array.from({length: N}, (_, i) => polar(RC.r, az(i), -2)));
  for (const i of order) {
    const f = faces(i), sh = shade([-f.n[0], 0, -f.n[2]], mixColor(RCC.ring, RCC.ringSh, 0.35), '#272d3b');
    fill(id + 10 + i, sh, [polar(RC.r, f.a0, RC.ringH), polar(RC.r, f.a1, RC.ringH), polar(RC.r, f.a1, -2), polar(RC.r, f.a0, -2)]);
  }
  // 2: outer walls and the top annulus, far to near
  for (const i of order) {
    const f = faces(i), P = (r: number, a: number, y: number) => polar(r, a, y);
    // outer walls only where they face the lens (the far ones are hidden by the opening anyway)
    const front = f.n[0] * (cl[0] - RC.R * f.n[0]) + f.n[2] * (cl[2] - RC.R * f.n[2]) > 0;
    // suit fabric below the collar (a neck of the suit going away downward)
    if (front) fill(id + 100 + i, shade(f.n, RCC.fabric, mixColor(RCC.fabric, '#4a5568', 0.7)), [P(14.2, f.a0, -RC.collarH), P(14.2, f.a1, -RC.collarH), P(19, f.a1, -9), P(19, f.a0, -9)]);
    // shoulders (ROWS-R1.3): the suit flares on out of frame so the ring sits on a body, not a floating cone
    if (front) fill(id + 600 + i, shade([f.n[0] * 0.8, 0.6, f.n[2] * 0.8], RCC.fabric, mixColor(RCC.fabric, '#4a5568', 0.7)), [P(19, f.a0, -9), P(19, f.a1, -9), P(34, f.a1, -17), P(34, f.a0, -17)]);
    // blue lock collar
    if (front) fill(id + 150 + i, shade(f.n, RCC.collar, RCC.collarSh), [P(RC.collarR, f.a0, 0), P(RC.collarR, f.a1, 0), P(RC.collarR, f.a1, -RC.collarH), P(RC.collarR, f.a0, -RC.collarH)]);
    // collar upper lip (a thin top face where it overhangs the ring)
    if (front) fill(id + 200 + i, shade([0, 1, 0], mixColor(RCC.collar, '#ffffff', 0.25), RCC.collarSh), [P(RC.collarR, f.a0, 0), P(RC.collarR, f.a1, 0), P(RC.R, f.a1, 0), P(RC.R, f.a0, 0)]);
    // bearing ring wall and top
    if (front) fill(id + 250 + i, shade(f.n, RCC.ring, RCC.ringSh), [P(RC.R, f.a0, RC.ringH), P(RC.R, f.a1, RC.ringH), P(RC.R, f.a1, 0), P(RC.R, f.a0, 0)]);
    fill(id + 300 + i, shade([0, 1, 0], '#ffffff', RCC.ring), [P(RC.R, f.a0, RC.ringH), P(RC.R, f.a1, RC.ringH), P(RC.r, f.a1, RC.ringH), P(RC.r, f.a0, RC.ringH)]);
  }
  // seam lines and silhouette edges
  const edge = (seed: number, pts: V3[], w = 0.9, col = '#2b3446') => {
    const q = pts.map(tiltPt).filter((v) => camDepth(c, v) > 0.5).map((v) => camPoint(c, v)).filter((v): v is Pt => !!v);
    if (q.length >= 2) inkLine(p, seed, q, {closed: false, weight: w, color: col, still: true, curve: 0});
  };
  const arcPts = (r: number, y: number, a0: number, a1: number): V3[] => Array.from({length: 25}, (_, i) => polar(r, a0 + ((a1 - a0) * i) / 24, y));
  // only the camera-facing half of each rim (|az - camAz| < 100 deg): the far half is hidden by the near wall
  const a0 = camAz - 100, a1 = camAz + 100;
  edge(id + 400, arcPts(RC.R, RC.ringH, a0, a1), 1);
  edge(id + 401, arcPts(RC.R, 0, a0, a1), 0.7);
  edge(id + 402, arcPts(RC.collarR, -RC.collarH, a0, a1), 1);
  edge(id + 403, arcPts(RC.r, RC.ringH, camAz + 80, camAz + 280), 0.9);
  // indicator: yellow mark on the ring wall (fixed, azimuth 0) and a yellow stripe on the collar, offset 35 - latch deg around the collar
  const mk = (seed: number, azc: number, y0: number, y1: number, r: number, wDeg: number) => fill(seed, RCC.stripe, [polar(r, azc - wDeg, y0), polar(r, azc + wDeg, y0), polar(r, azc + wDeg, y1), polar(r, azc - wDeg, y1)]);
  const stripeAz = -(RC.lockDeg - lam) * 0.9;
  mk(id + 410, MARK_AZ, 0.15, RC.ringH - 0.15, RC.R + 0.02, 2.2);
  mk(id + 411, MARK_AZ + stripeAz, -RC.collarH + 0.2, -0.15, RC.collarR + 0.02, 2.2);
  // collar rivets
  for (let k = 0; k < 12; k++) { const a = -150 + k * 28, q = camPoint(c, tiltPt(polar(RC.collarR + 0.05, a, -RC.collarH / 2))); if (q && Math.abs(angDiff(a, camAz)) < 80) hardFill(p, id + 420 + k, mixColor(RCC.collar, '#ffffff', 0.45), [[q[0] - 2.2, q[1]], [q[0], q[1] - 2.2], [q[0] + 2.2, q[1]], [q[0], q[1] + 2.2]]); }
  // latch: bracket on the collar at azimuth 0 (hinge on a tangent axis at y -2.8), the lever folds out by (35 - latch) deg from flush
  const out = (RC.lockDeg - lam) * D2R, hw = RC.leverW / 2, rb = RC.collarR + 0.35;
  fill(id + 500, '#2c3342', [[-hw - 0.5, -2.8, rb - 0.3], [hw + 0.5, -2.8, rb - 0.3], [hw + 0.5, -3.2, rb + 0.5], [-hw - 0.5, -3.2, rb + 0.5]]);
  const tip = (dx: number): V3 => [dx, -2.8 + RC.lever * Math.cos(out), rb + RC.lever * Math.sin(out)];
  // underside (a little thickness) then top face
  fill(id + 501, '#222836', [[-hw, -2.8, rb], [hw, -2.8, rb], [hw, -2.8 + RC.lever * Math.cos(out) - 0.1, rb + RC.lever * Math.sin(out) - 0.5], [-hw, -2.8 + RC.lever * Math.cos(out) - 0.1, rb + RC.lever * Math.sin(out) - 0.5]]);
  fill(id + 502, shade([0, Math.sin(out), Math.cos(out)], RCC.leverLit, RCC.lever), [[-hw, -2.8, rb + 0.2], [hw, -2.8, rb + 0.2], tip(hw), tip(-hw)]);
  edge(id + 503, [[-hw, -2.8, rb + 0.2], tip(-hw), tip(hw), [hw, -2.8, rb + 0.2]], 1, '#1c2230');
  // thumb grip: three short ribs near the tip
  for (let k = 0; k < 3; k++) { const u = 0.62 + 0.11 * k; edge(id + 510 + k, [[-hw * 0.7, -2.8 + RC.lever * u * Math.cos(out), rb + 0.25 + RC.lever * u * Math.sin(out)], [hw * 0.7, -2.8 + RC.lever * u * Math.cos(out), rb + 0.25 + RC.lever * u * Math.sin(out)]], 0.8, '#3a4256'); }
  return {pivot: camPoint(c, tiltPt(polar(rb, 0, -2.8))), tip: camPoint(c, tiltPt(tip(0))), stripe: camPoint(c, tiltPt(polar(RC.collarR, MARK_AZ + stripeAz, -1.5))), mark: camPoint(c, tiltPt(polar(RC.R, MARK_AZ, 1.2)))};
};
const angDiff = (a: number, b: number) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };

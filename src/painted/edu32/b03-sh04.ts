import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, mixYCam, type YCam} from '../kit/ycam';
import {SHADE, SUN_WARM} from './field';
import {easeInOut, smooth} from './field-cat';

// EDU-EP32-SHORT B03-SH04 "the plan on the clipboard" (timed sheet EDU-EP32-SHEET-R1, G [786, 880), 94 f; VD32-21; Boss G4, 2026-11-21). One plate
// EDU32-B03-SH04: overhead on `new: clipboard-plan` lying on the grass at the field corner (+3.3, 0, +2.9), in canopy shade with sun dapple. A
// hand-drawn pencil plan (bench box with two dots, the left dot circled in red, a bird mark at the bench's right end, a sun circle in front, the
// cat's start dot on the bench). A red pencil paw-print path draws on: wanders from the cat dot to the bird, round the sun, out to two edges
// (L4-L32), pauses (L32-L34), heads for the red circle (L34-L62) and swerves away without touching it (L62-L76), then holds. No words or
// numbers. Shot-local frame L = round(tl * 30). Sheet-local coordinates (u across 0..1 left to right, v down 0..1 from the clip) are laid on the
// board in world metres; the camera looks straight down (pitch -88), so screen up = world -z.

export const SH04_N = 94;
const DEG = Math.PI / 180;
export const SH04 = {wander: [4, 32], toward: [34, 62], swerve: [62, 76]} as const;
export const SH04_CAM0: YCam = {x: 3.3, y: 0.55, z: 2.95, yaw: 0, pitch: -88 * DEG, f: 1000, hy: 600};
export const SH04_CAM1: YCam = {x: 3.3, y: 0.48, z: 2.93, yaw: 6 * DEG, pitch: -88 * DEG, f: 1000, hy: 600};
export const sh04Cam = (L: number): YCam => mixYCam(SH04_CAM0, SH04_CAM1, easeInOut(L / (SH04_N - 1)));
/** Board (masonite) and sheet sizes, m, and the board centre on the grass. */
export const BOARD = {at: [3.3, 0, 2.9] as V3, w: 0.23, h: 0.32, sheetW: 0.205, sheetH: 0.27, top: 0.035} as const;
/** Sheet-local plan marks. */
export const PLAN = {bench: [0.22, 0.24, 0.78, 0.33] as [number, number, number, number], dotL: [0.36, 0.285] as Pt, dotR: [0.64, 0.285] as Pt,
  cat: [0.5, 0.285] as Pt, bird: [0.84, 0.25] as Pt, sun: [0.56, 0.6] as Pt, sunR: 0.075, circleR: 0.06};
/** Paw-path waypoints (sheet-local): wander (cat dot -> bird -> round the sun -> right edge -> bottom-left edge), toward the red circle, swerve. */
export const PATH = {
  wander: [[0.5, 0.29], [0.62, 0.36], [0.78, 0.33], [0.86, 0.28], [0.9, 0.38], [0.76, 0.5], [0.66, 0.58], [0.6, 0.71], [0.47, 0.7], [0.44, 0.58], [0.55, 0.49], [0.72, 0.64], [0.94, 0.72], [0.8, 0.84], [0.55, 0.88], [0.3, 0.84], [0.08, 0.9]] as Pt[],
  toward: [[0.08, 0.9], [0.14, 0.76], [0.18, 0.62], [0.22, 0.5], [0.27, 0.42], [0.31, 0.38]] as Pt[],
  swerve: [[0.31, 0.38], [0.36, 0.4], [0.44, 0.42], [0.5, 0.48], [0.47, 0.55]] as Pt[],
};

const sheetW = (q: Pt): V3 => {
  const [bx, , bz] = BOARD.at, x0 = bx - BOARD.sheetW / 2, z0 = bz - BOARD.h / 2 + BOARD.top;
  return [x0 + q[0] * BOARD.sheetW, 0.0125, z0 + q[1] * BOARD.sheetH];
};
const pl = (c: YCam, pts: Pt[]) => pts.map((q) => camPoint(c, sheetW(q))).filter((q): q is Pt => q !== null);

/** Resample a polyline every `step` (sheet units), with a soft Chaikin pass first so the hand path curves. */
const resample = (pts: Pt[], step: number): Pt[] => {
  let q = pts;
  for (let r = 0; r < 2; r++) q = [q[0], ...q.slice(0, -1).flatMap((a, i) => { const b = q[i + 1]; return [[0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]] as Pt[]; }), q[q.length - 1]];
  const out: Pt[] = [q[0]];
  let acc = 0;
  for (let i = 1; i < q.length; i++) {
    const d = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
    acc += d;
    while (acc >= step) { acc -= step; const u = 1 - acc / d; out.push([q[i - 1][0] + (q[i][0] - q[i - 1][0]) * u, q[i - 1][1] + (q[i][1] - q[i - 1][1]) * u]); }
  }
  return out;
};
const FULL = [...PATH.wander, ...PATH.toward.slice(1), ...PATH.swerve.slice(1)];
export const PAW_STEP = 0.034;
export const PAWS = resample(FULL, PAW_STEP);
/** Cumulative arc fraction of each phase end along FULL (for the draw-on clock). */
const arc = (pts: Pt[]) => pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
const A1 = arc(PATH.wander), A2 = A1 + arc(PATH.toward), A3 = A2 + arc(PATH.swerve);
/** Fraction 0..1 of the whole path drawn at shot frame L. */
export const pathDrawn = (L: number): number => {
  const ph = (r: readonly [number, number], a: number, b: number, e = false) => (L <= r[0] ? a : L >= r[1] ? b : a + (b - a) * (e ? smooth((L - r[0]) / (r[1] - r[0])) : (L - r[0]) / (r[1] - r[0])));
  if (L < SH04.toward[0]) return ph(SH04.wander, 0, A1) / A3;
  if (L < SH04.swerve[0]) return ph(SH04.toward, A1, A2) / A3;
  return ph(SH04.swerve, A2, A3, true) / A3;
};

const PENCIL = '#4a4640', RED = '#c23a2e';
/** One paw print (sheet-local): a pad and three toes, alternating left/right of the line, pointing along the path. */
const paw = (p: Painter, c: YCam, seed: number, at: Pt, dir: Pt, side: number, op: number) => {
  const n: Pt = [-dir[1], dir[0]], o: Pt = [at[0] + n[0] * side * 0.011, at[1] + n[1] * side * 0.011], s = 0.0075;
  const blob = (q: Pt, r: number, k: number) => {
    const pts = Array.from({length: 9}, (_, i): Pt => { const a = (i / 9) * 6.283; return [q[0] + Math.cos(a) * r, q[1] + Math.sin(a) * r * 0.85]; });
    const pp = pl(c, pts);
    if (pp.length >= 3) washAt(p, seed + k, RED, op, pp, 0.05, 0.4);
  };
  blob(o, s, 0);
  for (let k = -1; k <= 1; k++) blob([o[0] + dir[0] * s * 1.6 + n[0] * k * s * 0.85, o[1] + dir[1] * s * 1.6 + n[1] * k * s * 0.85], s * 0.42, k + 2);
};

/** The overhead lawn (canopy shade) with a little texture; the caption band end of the frame is darker (nearer the trunk's shadow). */
const paintLawnTop = (p: Painter, c: YCam) => {
  const [bx, , bz] = BOARD.at, R = 0.6, sq = (x0: number, z0: number, x1: number, z1: number): V3[] => [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]];
  p.flat('#3e5a36', [[-200, -200], [1280, -200], [1280, 2200], [-200, 2200]]);
  for (let i = 0; i < 60; i++) {
    const x = bx - R + hash(i * 1.37 + 2) * 2 * R, z = bz - R + hash(i * 2.11 + 5) * 2 * R, r = 0.02 + 0.03 * hash(i * 3.3);
    const q = camPoly(c, Array.from({length: 10}, (_, k): V3 => [x + r * Math.cos(k * 0.628), 0, z + r * 0.7 * Math.sin(k * 0.628)]));
    if (q.length >= 3) washAt(p, 38000 + i, i % 2 ? '#4f6d3c' : '#2f4a2c', 70, q, 0.1, 0.3);
  }
  // blades: short strokes, seeded, held still
  for (let i = 0; i < 420; i++) {
    const x = bx - R + hash(i * 1.91 + 7) * 2 * R, z = bz - R + hash(i * 2.73 + 1) * 2 * R, a = hash(i * 5.1) * 6.283, l = 0.012 + 0.012 * hash(i * 4.4);
    const q0 = camPoint(c, [x, 0.004, z]), q1 = camPoint(c, [x + Math.cos(a) * l, 0.006, z + Math.sin(a) * l]);
    if (q0 && q1) inkLine(p, 38100 + i, [q0, q1], {closed: false, weight: 1.1, color: hash(i * 7.7) > 0.5 ? '#2a4024' : '#5d7f43', still: true, curve: 0});
  }
  // caption band (frame bottom = world +z beyond the board): the trunk's shade deepens toward the camera's feet
  [[bz + 0.2, 60], [bz + 0.25, 80], [bz + 0.3, 95]].forEach(([z, op], i) => {
    const q = camPoly(c, sq(bx - 1.5, z, bx + 1.5, z + 1));
    if (q.length >= 3) washAt(p, 38600 + i, '#16211a', op, q, 0.15, 0.2);
  });
};

/** Sun dapple: soft warm leaf-gap spots laid over sheet and grass (light, not paint), still. */
const paintDapple = (p: Painter, c: YCam) => {
  const spots: [number, number, number][] = [[-0.07, -0.09, 0.03], [0.06, -0.12, 0.022], [0.09, 0.05, 0.035], [-0.1, 0.08, 0.026], [0.02, 0.0, 0.018], [-0.03, 0.13, 0.02], [0.16, -0.02, 0.024], [-0.18, -0.03, 0.02]];
  spots.forEach(([dx, dz, r], i) => {
    const q = camPoly(c, Array.from({length: 14}, (_, k): V3 => [BOARD.at[0] + dx + r * Math.cos(k * 0.449) * (1 + 0.15 * Math.sin(k * 1.7)), 0.013, BOARD.at[2] + dz + r * 0.75 * Math.sin(k * 0.449)]));
    if (q.length >= 3) washAt(p, 38700 + i, mixColor(SUN_WARM, '#fff4d8', 0.4), 60, q, 0.35, 0.2);
  });
};

/** The B03-SH04 plate at shot frame L. */
export const paintB03SH04 = (p: Painter, L: number) => {
  const c = sh04Cam(L), [bx, , bz] = BOARD.at;
  paintLawnTop(p, c);
  // board shadow, board, clip
  const box = (x0: number, z0: number, x1: number, z1: number, y: number): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
  const sh = camPoly(c, box(bx - BOARD.w / 2 + 0.008, bz - BOARD.h / 2 + 0.01, bx + BOARD.w / 2 + 0.012, bz + BOARD.h / 2 + 0.014, 0.001));
  if (sh.length >= 3) washAt(p, 38800, '#121a12', 110, sh, 0.15, 0.2);
  const board = camPoly(c, box(bx - BOARD.w / 2, bz - BOARD.h / 2, bx + BOARD.w / 2, bz + BOARD.h / 2, 0.008));
  hardFill(p, 38801, mixColor('#8a6a48', SHADE, 0.25), board);
  inkLine(p, 38802, board, {closed: true, weight: 1.2, color: '#3a2a1c', still: true, curve: 0});
  const sheet = camPoly(c, box(bx - BOARD.sheetW / 2, bz - BOARD.h / 2 + BOARD.top, bx + BOARD.sheetW / 2, bz - BOARD.h / 2 + BOARD.top + BOARD.sheetH, 0.012));
  hardFill(p, 38803, mixColor('#efe6cf', SHADE, 0.28), sheet);
  inkLine(p, 38804, sheet, {closed: true, weight: 0.8, color: mixColor('#efe6cf', '#3a3228', 0.5), still: true, curve: 0});
  const clip = camPoly(c, box(bx - 0.05, bz - BOARD.h / 2 + 0.006, bx + 0.05, bz - BOARD.h / 2 + 0.05, 0.02));
  hardFill(p, 38805, '#8d939a', clip);
  inkLine(p, 38806, clip, {closed: true, weight: 1, color: '#3d4247', still: true, curve: 0});
  const hinge = camPoly(c, box(bx - 0.035, bz - BOARD.h / 2 + 0.012, bx + 0.035, bz - BOARD.h / 2 + 0.024, 0.022));
  hardFill(p, 38807, '#c3c8cd', hinge);
  // pencil plan (graphite, a little shaky)
  const [b0, v0, b1, v1] = PLAN.bench;
  inkLine(p, 38810, pl(c, [[b0, v0], [b1, v0], [b1, v1], [b0, v1]]), {closed: true, weight: 1.6, color: PENCIL, curve: 0.05});
  const dot = (q: Pt, seed: number, r = 0.012) => { const pp = pl(c, Array.from({length: 10}, (_, k): Pt => [q[0] + r * Math.cos(k * 0.628), q[1] + r * 0.9 * Math.sin(k * 0.628)])); if (pp.length >= 3) hardFill(p, seed, PENCIL, pp); };
  dot(PLAN.dotL, 38811);
  dot(PLAN.dotR, 38812);
  dot(PLAN.cat, 38813, 0.009);
  inkLine(p, 38814, pl(c, Array.from({length: 24}, (_, k): Pt => { const a = k * 0.28 - 0.3; return [PLAN.dotL[0] + PLAN.circleR * Math.cos(a) * (1 + 0.06 * Math.sin(k)), PLAN.dotL[1] + PLAN.circleR * Math.sin(a)]; })), {closed: false, weight: 2.0, color: RED, curve: 0.4});
  const [bdx, bdv] = PLAN.bird; // bird mark: a small pencil "m"-wing bird
  inkLine(p, 38815, pl(c, [[bdx - 0.03, bdv], [bdx - 0.015, bdv - 0.014], [bdx, bdv], [bdx + 0.015, bdv - 0.014], [bdx + 0.03, bdv]]), {closed: false, weight: 1.4, color: PENCIL, curve: 0.5});
  const [sx, sv] = PLAN.sun, sr = PLAN.sunR;
  inkLine(p, 38816, pl(c, Array.from({length: 20}, (_, k): Pt => [sx + sr * 0.6 * Math.cos(k * 0.33), sv + sr * 0.6 * Math.sin(k * 0.33)])), {closed: false, weight: 1.4, color: PENCIL, curve: 0.4});
  for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; inkLine(p, 38820 + k, pl(c, [[sx + Math.cos(a) * sr * 0.78, sv + Math.sin(a) * sr * 0.78], [sx + Math.cos(a) * sr, sv + Math.sin(a) * sr]]), {closed: false, weight: 1.2, color: PENCIL, curve: 0}); }
  // the red paw-print path, drawn on
  const k = pathDrawn(L), shown = Math.floor(k * (PAWS.length - 1) + 1e-6);
  for (let i = 1; i <= shown; i++) {
    const a = PAWS[i - 1], b = PAWS[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    paw(p, c, 39000 + i * 4, b, [(b[0] - a[0]) / d, (b[1] - a[1]) / d], i % 2 ? 1 : -1, 200);
  }
  paintDapple(p, c);
};

/** QA: the closest approach of any drawn paw print (centre +- its 0.011 side offset and 0.013 toe reach, sheet units) to the red circle, as the
 *  ring's own sheet-unit radius multiple (> 1 = never touches the ring). */
export const pathCircleClearance = () => Math.min(...PAWS.map((q) => (Math.hypot(q[0] - PLAN.dotL[0], q[1] - PLAN.dotL[1]) - 0.024) / PLAN.circleR));

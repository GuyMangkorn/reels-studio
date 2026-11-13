// EDU-EP17 N9 `instrument KB` (Boss, group 4): the steel cabinet with its glass lid, the paper drum recorder, the brass pen arm and the trace (on its own noise clock), on a night street across from the
// stadium wall, for SH21 (S01-B04-SH06, 83 f). Hardened from LF06 pick B (reverse angle, approved 2026-11-12, `look-b-stadium.ts`), with the ROWS-R2.2 camera: the start looks -z across the box at the
// glowing wall and the pull-back is a straight dolly back (no turn-around). Space `T`: metres, the box centred (0, 0, 146): 0.6 x 0.9 x 0.5 m, glass lid y 0.905, drum centre (0, 0.735, 146), r 0.125, half-length 0.175 m, axis x.
// No grid numbers, no label, no logo. Kit intake (W8.4): `new: instrument KB` (proposal in build-notes.md).
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {clip} from '../kit/world';
import {bottomShade} from './shade';
import {lerpV, lookCam, pushU} from './street';

export const KB = {box: {x0: -0.3, x1: 0.3, y0: 0, y1: 0.9, z0: 145.75, z1: 146.25}, lidY: 0.905, drum: {c: [0, 0.735, 146.0] as V3, R: 0.125, L: 0.175}, wallZ: 114.9, penX: 0.02, penA: 0.28, lamp: [1.1, 140] as [number, number]};
export const KB_COL = {steel: '#6f777d', steelSh: '#4f565c', well: '#23272c', paper: '#f2ead8', paperSh: '#8a7f6a', grid: '#d8cdb6', ink: '#2b211c', trace: '#5a4a3a', brass: '#c9a24a', brassSh: '#8a6a2a', cap: '#9a8a60', capHub: '#6a5a3a', lid: '#2b3550', lidFrame: '#a7b0b6', lamp: '#f2c46a', night: '#1a2236', wall: '#3b3f52', concourse: '#f2c46a', pavFar: '#2c2c30', pavNear: '#34343a', pavGround: '#26262c'};

/** SH21 camera (R2.2): `pos (-0.30, 1.10, 146.45) -> (-1.20, 1.50, 148.80), look-at (0, 0.80, 146.00) -> (4.0, -3.0, 118), f 1000` (R2.4 B3: the lens rises and stays over the lid, so the pen shows through the glass to the end); hold +0-+22, dolly back and look down the street +22-+52 (6 f ease each end), hold +52-+82. */
export const sh21Cam = (f: number): YCam => {
  const e = pushU(f - 22, 30);
  return lookCam(lerpV([-0.30, 1.10, 146.45], [-1.20, 1.50, 148.80], e), lerpV([0, 0.80, 146.0], [4.0, -3.0, 118], e));
};
export const SH21_LEN = 83;

/** The trace's own clock (O3, not crowd-driven): jitter amplitude in drum-axis metres for sample `i` of trace line `k` at shot frame `f`. Burst envelope for the live line: a cubed rectified sine that restarts nowhere. */
export const traceBurst = (i: number, f: number) => Math.max(0, Math.sin(i * 0.37 + f * 0.2)) ** 3;
export const traceJitter = (i: number, k: number, f: number): number => {
  const burst = k === 0 ? traceBurst(i, f) : k < 4 ? 0.35 * Math.max(0, Math.sin(i * 0.21 + k * 2)) ** 2 : 0.06;
  return (hash(i * 7.3 + k * 91 + (k === 0 ? Math.floor(f / 2) : 0)) - 0.5) * (0.0012 + 0.012 * burst);
};

const W = (p: Painter, c: YCam, seed: number, color: string, pts: V3[], op = 255) => {
  const q = clip(camPoly(c, pts));
  if (q.length < 3) return;
  if (op >= 255) hardFill(p, seed, color, q); else washAt(p, seed, color, op, q, 0, 0);
};

/** The street across from the stadium wall, night: sky and haze, the wall with its lit concourse band and vents, light over the rim, the pavement (dark; darker under the box for the caption band), a lamp. */
const paintStreet = (p: Painter, c: YCam, f: number) => {
  const box: Pt[] = [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]], K = KB_COL;
  hardFill(p, 1, K.night, box);
  washAt(p, 2, '#3a2f4a', 255, [[-40, -40], [1120, -40], [1120, 700], [-40, 700]], 0, 0);
  const z = KB.wallZ;
  W(p, c, 3, K.wall, [[-200, 0, z + 0.1], [200, 0, z + 0.1], [200, 40, z + 0.1], [-200, 40, z + 0.1]]);
  W(p, c, 4, '#6a5a52', [[-200, 2, z], [200, 2, z], [200, 5, z], [-200, 5, z]]);
  W(p, c, 5, K.concourse, [[-200, 2.6, z - 0.1], [200, 2.6, z - 0.1], [200, 4.4, z - 0.1], [-200, 4.4, z - 0.1]], 150);
  for (let i = 0; i < 90; i++) for (const y of [12, 22, 32]) {
    if (hash(i * 3.7 + y) < 0.45) continue;
    const x = -90 + i * 2 + (hash(i + y) - 0.5) * 0.8;
    W(p, c, 6 + i * 3 + y, (i + y) % 5 ? '#e9c79a' : '#9ad8e6', [[x, y, z], [x + 0.5, y, z], [x + 0.5, y + 4, z], [x, y + 4, z]], 170);
  }
  for (let i = 0; i < 6; i++) {
    const b0 = camPoint(c, [-30 + i * 12, 44, 100]), b1 = camPoint(c, [-60 + i * 30, 140, 60]), b2 = camPoint(c, [-48 + i * 30, 140, 60]);
    if (b0 && b1 && b2) washAt(p, 60 + i, i % 2 ? '#ffb4e0' : '#7fe0e6', 50, [b0, b1, b2], 0, 0);
  }
  const g = camPoint(c, [0, 45, z]);
  if (g) { washAt(p, 50, '#ffb4e0', 70, ell(g[0], g[1], 900, 260, 30), 0, 0); washAt(p, 51, '#fff1d6', 80, ell(g[0], g[1] + 40, 600, 160, 30), 0, 0); }
  // pavement: dark, the street between the wall and the box (darker ground under the box: the caption band)
  W(p, c, 52, K.pavFar, [[-200, 0, z], [200, 0, z], [200, 0, 140], [-200, 0, 140]]);
  W(p, c, 53, K.pavGround, [[-200, 0, 125], [200, 0, 125], [200, 0, 156], [-200, 0, 156]]);
  W(p, c, 54, K.pavNear, [[-2.2, 0, 143.2], [2.2, 0, 143.2], [2.2, 0, 149], [-2.2, 0, 149]]);
  // the street lamp beside the box: pole, arm and head, with a warm pool on the pavement
  const [lx, lz] = KB.lamp;
  W(p, c, 70, '#23262f', [[lx - 0.06, 0, lz], [lx + 0.06, 0, lz], [lx + 0.05, 4.4, lz], [lx - 0.05, 4.4, lz]]);
  W(p, c, 71, '#23262f', [[lx - 0.05, 4.3, lz], [lx - 0.05, 4.4, lz], [lx - 1.2, 4.55, lz], [lx - 1.2, 4.45, lz]]);
  W(p, c, 72, K.lamp, [[lx - 1.5, 4.42, lz - 0.2], [lx - 0.9, 4.42, lz - 0.2], [lx - 0.9, 4.42, lz + 0.2], [lx - 1.5, 4.42, lz + 0.2]]);
  const pool = camPoly(c, Array.from({length: 20}, (_, i): V3 => [lx - 1.2 + 2.6 * Math.cos((i / 20) * Math.PI * 2), 0.01, lz + 1.5 * Math.sin((i / 20) * Math.PI * 2)]));
  if (pool.length > 2) washAt(p, 73, K.lamp, 26, clip(pool), 0, 0);
  void f;
};

/** The instrument: well, drum, grid, trace, end cap and pen arm inside; then the opaque steel faces (they hide the interior when the lens drops below the lid, at the end of the dolly); then the glass lid. */
const paintBox = (p: Painter, c: YCam, f: number): Pt | null => {
  const B = KB.box, K = KB_COL, {c: dc, R, L} = KB.drum;
  const surf = (x: number, a: number): V3 => [x, dc[1] + R * Math.cos(a), dc[2] + R * Math.sin(a)];
  const vis = (a: number) => { const n: V3 = [0, Math.cos(a), Math.sin(a)], toC: V3 = [0, c.y - (dc[1] + R * n[1]), c.z - (dc[2] + R * n[2])]; return n[1] * toC[1] + n[2] * toC[2] > 0; };
  const A0 = -1.25, A1 = 1.25, NA = 28;
  W(p, c, 102, K.well, [[B.x0 + 0.03, 0.9, B.z0 + 0.03], [B.x1 - 0.03, 0.9, B.z0 + 0.03], [B.x1 - 0.03, 0.9, B.z1 - 0.03], [B.x0 + 0.03, 0.9, B.z1 - 0.03]]);
  for (let i = 0; i < NA; i++) {
    const a0 = A0 + ((A1 - A0) * i) / NA, a1 = A0 + ((A1 - A0) * (i + 1)) / NA;
    if (!vis((a0 + a1) / 2)) continue;
    W(p, c, 110 + i, mixColor(K.paper, K.paperSh, 0.25 * Math.abs(Math.sin((a0 + a1) / 2))), [surf(-L, a0), surf(L, a0), surf(L, a1), surf(-L, a1)]);
  }
  for (let k = 0; k < 10; k++) { // faint grid, no numbers
    const x = -L + 0.02 + k * 0.034, pts = Array.from({length: 24}, (_, i) => camPoint(c, surf(x, A0 + ((A1 - A0) * i) / 23))).filter(Boolean) as Pt[];
    if (pts.length > 1) inkLine(p, 200 + k, pts, {color: K.grid, weight: 0.4, closed: false, still: true});
  }
  const penA = KB.penA, penX = KB.penX;
  for (let k = 0; k < 18; k++) { // 18 lines 11 mm apart (one per turn), the live line jittering in bursts
    const x0 = penX - k * 0.011, pts: Pt[] = [];
    for (let i = 0; i <= 90; i++) {
      const a = A0 + ((A1 - A0) * i) / 90; if (!vis(a)) continue;
      if (k === 0 && a > penA) continue;
      const q = camPoint(c, surf(x0 + traceJitter(i, k, f), a)); if (q) pts.push(q);
    }
    if (pts.length > 1) inkLine(p, 300 + k, pts, {color: k === 0 ? K.ink : K.trace, weight: k === 0 ? 1.2 : 0.55, curve: 0, closed: false, still: k > 0});
  }
  { const x = c.x > 0 ? L : -L, pts = Array.from({length: 21}, (_, i) => camPoint(c, surf(x, A0 + ((A1 - A0) * i) / 20))).filter(Boolean) as Pt[], hub = camPoint(c, [x, dc[1], dc[2]]);
    if (hub && pts.length > 2) { hardFill(p, 400, K.cap, [...pts, hub]); hardFill(p, 401, K.capHub, ell(hub[0], hub[1], 10, 10, 10)); } }
  const tip = surf(penX, penA), piv: V3 = [penX + 0.13, 0.875, 145.84], pt = camPoint(c, tip), pp = camPoint(c, piv);
  if (pt && pp) {
    const w = camUnit(c, tip) * 0.006, dx = pp[0] - pt[0], dy = pp[1] - pt[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * w, ny = (dx / l) * w;
    hardFill(p, 450, K.brassSh, [[pt[0] + nx, pt[1] + ny - w], [pp[0] + nx * 1.6, pp[1] + ny * 1.6], [pp[0] - nx * 1.6, pp[1] - ny * 1.6], [pt[0] - nx, pt[1] - ny - w]]);
    hardFill(p, 451, K.brass, [[pt[0] + nx * 0.5, pt[1] + ny * 0.5 - w], [pp[0] + nx, pp[1] + ny], [pp[0], pp[1]], [pt[0], pt[1] - w]]);
    hardFill(p, 452, K.ink, ell(pt[0], pt[1], w * 0.9, w * 0.9, 8));
    hardFill(p, 453, K.brass, ell(pp[0], pp[1], w * 2.6, w * 2.6, 12));
  }
  // opaque steel: the front face (toward the street side lens) and the left side face
  W(p, c, 100, K.steelSh, [[B.x0, B.y0, B.z1], [B.x1, B.y0, B.z1], [B.x1, B.y1, B.z1], [B.x0, B.y1, B.z1]]);
  W(p, c, 101, K.steel, [[B.x0, B.y0, B.z0], [B.x0, B.y0, B.z1], [B.x0, B.y1, B.z1], [B.x0, B.y1, B.z0]]);
  // the glass lid (dark blue sheen) and its frame; the lamp's highlight on it
  const lid: V3[] = [[B.x0, KB.lidY, B.z0], [B.x1, KB.lidY, B.z0], [B.x1, KB.lidY, B.z1], [B.x0, KB.lidY, B.z1]];
  W(p, c, 500, K.lid, lid, 60);
  const fr = lid.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  if (fr.length > 2) inkLine(p, 501, fr, {color: K.lidFrame, weight: 1.6, still: true});
  const s0 = camPoint(c, [B.x0 + 0.05, 0.906, B.z0 + 0.1]), s1 = camPoint(c, [B.x1 - 0.15, 0.906, B.z1 - 0.05]);
  if (s0 && s1) washAt(p, 502, K.lamp, 45, [[s0[0], s0[1]], [s0[0] + 70, s0[1] - 10], [s1[0] + 70, s1[1] - 10], [s1[0], s1[1]]], 0, 0);
  return pt;
};

/** One frame of SH21 (`f` shot-local). Returns the camera and the pen tip in picture pixels. */
export const paintSh21 = (p: Painter, f: number) => {
  const c = sh21Cam(f);
  paintStreet(p, c, f);
  const pen = paintBox(p, c, f);
  if (KB_SHADE.amount > 0) bottomShade(p, 1000, KB_SHADE.amount, 99000, '#0a0e18', 12, 20);
  return {c, pen};
};
/** Lens falloff over the caption band (0 = none: the darker pavement alone). */
export const KB_SHADE = {amount: 0.5};

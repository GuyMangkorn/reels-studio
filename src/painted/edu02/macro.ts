import {blob, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {clip, wFill, wp, wWash} from './world';

// EDU-EP02-SHORT macro sets (brief EDU-BRIEF-R1 VD05, VD06; look frames LF02, LF03, workflow W3.1). Look-defining assets
// written by Film; Boss hardens them at W5.2. Both are labelled illustrations (`ภาพจำลอง`, VD08), not to scale, but built in
// set metres and seen through the kit yaw camera so the camera moves inside them.
//   CELL: 1 set-m ~ 0.1 mm (no size claim); brick-bond layer of cells 0.60 x 0.25 x 0.25, hero cell centred at the origin,
//         +x right, +y up, +z toward the camera. Simplified classic model (F004): no organelle names, no labels.
//   EYE:  see ./eye.ts (asset N6).

const mix = mixColor;
const W = 1080, HGT = 1920;
const full: Pt[] = [[-200, -200], [W + 200, -200], [W + 200, HGT + 200], [-200, HGT + 200]];

// ================================================================== CELL (LF02, S01-B03-SH01)

export const CELLC = {
  back: '#c8913c', wall: '#d9b870', wallHi: '#f6e7b8', fluid: '#f7f0d8', fluidDeep: '#efdcaa', glow: '#fff3cf',
  bead: '#e8c43a', beadHi: '#fff6c4', sacMem: '#cfe9e2', sacInk: '#2f8a80', enzyme: '#3fa59a', orange: '#e8894a', violet: '#7d5bc4', lilac: '#b9a2e0',
  steel: '#9aa4ab', steelHi: '#e4ecf0',
} as const;
export type CellState = {t: number; beadGlint: number; sacPulse: number; burst?: number};

const CW = 0.6, CH = 0.25, GAP = 0.024, ZF = 0.06; // ZF: front veil / back of the chamber at +-0.06 (the 0.25 cell depth reads as a box seam at this camera distance)
/** Rounded rectangle in the plane z (world), corner radius rc. */
const rrect = (cx: number, cy: number, w: number, h: number, z: number, rc: number, wob = 0, seed = 0): V3[] => {
  const pts: V3[] = [];
  const corners: [number, number, number][] = [[cx + w / 2 - rc, cy + h / 2 - rc, 0], [cx - w / 2 + rc, cy + h / 2 - rc, 1], [cx - w / 2 + rc, cy - h / 2 + rc, 2], [cx + w / 2 - rc, cy - h / 2 + rc, 3]];
  corners.forEach(([x, y, q]) => {
    for (let k = 0; k <= 4; k++) {
      const a = (q * Math.PI) / 2 + (k / 4) * (Math.PI / 2), wv = wob * (hash(seed + q * 7 + k) - 0.5);
      pts.push([x + (rc + wv) * Math.cos(a), y + (rc + wv) * Math.sin(a), z]);
    }
  });
  return pts;
};
/** Cells of a brick-bond layer: row j at y = j*CH, odd rows offset half a cell. */
const cellsOf = (rows: number, cols: number) => {
  const out: {i: number; j: number; x: number; y: number}[] = [];
  for (let j = -rows; j <= rows; j++) for (let i = -cols; i <= cols; i++) out.push({i, j, x: i * CW + (Math.abs(j) % 2 ? CW / 2 : 0), y: j * CH});
  return out;
};
const sph = (c: YCam, v: V3, r: number) => {
  const q = camPoint(c, v);
  return q ? {x: q[0], y: q[1], r: r * camUnit(c, v)} : null;
};
/** Bead and sac layout of a cell (the hero is cell 0,0). Beads left, sac right; neighbours vary by hash. */
const contents = (i: number, j: number) => {
  const h = (k: number) => hash(i * 31.7 + j * 17.3 + k);
  const beads: V3[] = Array.from({length: 10}, (_, k): V3 => [-0.19 + 0.17 * h(k) + (k % 3) * 0.035, -0.07 + 0.14 * h(k + 20), -0.02 + 0.04 * h(k + 40)]);
  const sac: V3 = [0.14 + 0.03 * (h(60) - 0.5), 0.0 + 0.03 * (h(61) - 0.5), 0];
  return {beads, sac};
};
const pac = (x: number, y: number, r: number, a: number, n = 12): Pt[] => {
  const pts: Pt[] = [[x, y]];
  for (let k = 0; k <= n; k++) {
    const u = a + 0.55 + (k / n) * (Math.PI * 2 - 1.1);
    pts.push([x + r * Math.cos(u), y + r * Math.sin(u)]);
  }
  return pts;
};
const fourLobe = (x: number, y: number, r: number, a: number): Pt[] =>
  Array.from({length: 24}, (_, k) => {
    const u = (k / 24) * Math.PI * 2;
    const rr = r * (0.62 + 0.38 * Math.abs(Math.cos(2 * u)));
    return [x + rr * Math.cos(u + a), y + rr * Math.sin(u + a)];
  });

const paintCell = (p: Painter, c: YCam, s: CellState, cell: {i: number; j: number; x: number; y: number}, hero: boolean, seed: number) => {
  const {x, y} = cell, w = CW - GAP, h = CH - GAP;
  // Back of the chamber (deeper, warmer), then the contents, then the front membrane as a pale veil and a wall ring.
  const backF = wFill(p, c, seed, CELLC.fluidDeep, rrect(x, y, w, h, -ZF, 0.07, 0.01, seed));
  if (backF.length < 3) return;
  wWash(p, c, seed + 1, CELLC.fluid, 150, rrect(x - 0.02, y + 0.015, w * 0.82, h * 0.72, -ZF + 0.01, 0.05), 0.45, 0.35);
  const {beads, sac} = contents(cell.i, cell.j);
  const dim = hero ? 1 : 0.24;
  const burst = hero ? (s.burst ?? 0) : 0;
  // Sac: pale teal membrane holding 4-5 notched teal enzymes (kept apart from the beads until the cut).
  const sacC = sph(c, [x + sac[0], y + sac[1], sac[2]], 1);
  if (sacC) {
    const k = sacC.r, pulse = hero ? s.sacPulse : 0, rx = 0.085 * k * (1 + 0.06 * pulse), ry = 0.062 * k * (1 + 0.06 * pulse);
    if (!burst) {
      washAt(p, seed + 10, CELLC.sacMem, 150 * dim, ell(sacC.x, sacC.y, rx, ry, 22), 0.15, 0.3);
      for (let e = 0; e < 5; e++) {
        const ex = sacC.x + (-0.045 + 0.022 * e) * k, ey = sacC.y + (e % 2 ? 0.02 : -0.018) * k;
        hardFill(p, seed + 11 + e, mix(CELLC.enzyme, CELLC.fluid, 1 - dim), pac(ex, ey, 0.016 * k, e * 1.3));
      }
      inkLine(p, seed + 20, ell(sacC.x, sacC.y, rx, ry, 22), {weight: hero ? 2.1 + 1.2 * pulse : 0.7, color: mix(CELLC.sacInk, CELLC.fluid, 1 - dim)});
      if (hero && pulse > 0) washAt(p, seed + 21, '#8fe0d4', 90 * pulse, ell(sacC.x, sacC.y, rx * 1.25, ry * 1.3, 22), 0.5, 0.3);
    } else {
      // SH02 key state: the membrane torn open on the bead side; enzymes spill out and meet the beads.
      washAt(p, seed + 10, CELLC.sacMem, 90, ell(sacC.x + 0.01 * k, sacC.y, rx * 0.9, ry, 22), 0.25, 0.4);
      const arc = Array.from({length: 16}, (_, q): Pt => {
        const u = 0.9 + (q / 15) * 4.5;
        return [sacC.x + rx * Math.cos(u), sacC.y + ry * Math.sin(u)];
      });
      inkLine(p, seed + 20, arc, {closed: false, weight: 1.4, color: CELLC.sacInk});
      for (let e = 0; e < 5; e++) {
        const ex = sacC.x + (-0.08 - 0.03 * e) * k, ey = sacC.y + (-0.03 + 0.016 * e) * k;
        hardFill(p, seed + 11 + e, CELLC.enzyme, pac(ex, ey, 0.016 * k, e * 1.3 + 2));
      }
    }
  }
  // Sulfur-compound beads: yellow spheres with a highlight; glint on their word (hero only).
  beads.forEach((b, k) => {
    const q = sph(c, [x + b[0], y + b[1], b[2]], 0.014 + 0.003 * hash(k + cell.i));
    if (!q) return;
    const g = hero ? s.beadGlint : 0;
    const meet = burst && k < 5;
    const col = meet ? CELLC.orange : mix(CELLC.bead, CELLC.fluid, 1 - dim);
    if (g > 0) washAt(p, seed + 40 + k, CELLC.beadHi, 120 * g, ell(q.x, q.y, q.r * 2.1, q.r * 2.1, 14), 0.5, 0.2);
    hardFill(p, seed + 60 + k, col, ell(q.x, q.y, q.r, q.r, 14));
    washAt(p, seed + 80 + k, mix(col, '#7a4a10', 0.35), 120 * dim, ell(q.x + q.r * 0.3, q.y + q.r * 0.3, q.r * 0.6, q.r * 0.55, 10), 0.1, 0.2);
    hardFill(p, seed + 100 + k, mix(CELLC.beadHi, '#ffffff', g), ell(q.x - q.r * 0.35, q.y - q.r * 0.35, q.r * (0.28 + 0.15 * g), q.r * (0.24 + 0.12 * g), 8));
    if (hero) inkLine(p, seed + 120 + k, ell(q.x, q.y, q.r, q.r, 14), {weight: 0.6, color: meet ? '#a8501e' : '#a88a1a'});
  });
  if (burst) {
    // Orange meeting product, violet second enzymes and the lilac mist leaving the cell upward.
    const o = sph(c, [x - 0.08, y + 0.01, 0.01], 1);
    if (o) {
      for (let v = 0; v < 4; v++) hardFill(p, seed + 140 + v, CELLC.violet, fourLobe(o.x + (-0.06 + 0.04 * v) * o.r, o.y + (0.05 - 0.02 * (v % 2)) * o.r, 0.012 * o.r, v));
      for (let m = 0; m < 6; m++) {
        washAt(p, seed + 150 + m, '#a88ad8', 170 - m * 12, blob(seed + 150 + m, o.x + (-0.04 + 0.03 * Math.sin(m * 1.7)) * o.r, o.y - (0.08 + 0.07 * m) * o.r, (0.03 + 0.012 * m) * o.r, (0.024 + 0.01 * m) * o.r, s.t), 0.6, 0.4);
      }
    }
  }
  // Front membrane: a pale translucent veil, a light crescent along the top-left and the ink of the wall.
  const front = rrect(x, y, w, h, ZF, 0.07, 0.01, seed + 3);
  wWash(p, c, seed + 200, CELLC.glow, hero ? 34 : 50, front, 0.3, 0.3);
  const fq = wp(c, front);
  if (fq.length >= 3) {
    inkLine(p, seed + 201, fq, {weight: hero ? 1.6 : 1.0, color: mix('#a8782a', CELLC.wall, hero ? 0 : 0.4), curve: 0.25});
    const hi = wp(c, rrect(x - 0.01, y + 0.008, w * 0.92, h * 0.86, ZF + 0.002, 0.06)).slice(4, 13);
    if (hi.length >= 2) inkLine(p, seed + 202, hi, {closed: false, weight: hero ? 1.4 : 0.9, color: CELLC.wallHi, curve: 0.3});
  }
};

/** Paint the CELL set from `c`: backlight, far layer, wall plane, main layer of cells around the hero (0,0). */
export const paintCellMacro = (p: Painter, c: YCam, s: CellState) => {
  hardFill(p, 50000, CELLC.back, full);
  // Backlight: warm cream-gold glow behind the layer, brightest top-centre (the window light, magnified).
  for (let k = 0; k < 4; k++) washAt(p, 50001 + k, mix(CELLC.glow, CELLC.back, k * 0.25), 120 - k * 20, ell(560, 520 - k * 30, 520 + k * 260, 640 + k * 300, 24), 0.55, 0.35);
  // Far layer (z -0.55): soft cells, half a cell offset, for parallax against the main layer.
  cellsOf(9, 5).forEach((cl, n) => {
    const f = rrect(cl.x + 0.3, cl.y + 0.12, CW - GAP * 1.6, CH - GAP * 1.6, -0.55, 0.07);
    const q = wp(c, f);
    if (q.length >= 3) {
      washAt(p, 50100 + n, mix(CELLC.fluid, CELLC.back, 0.35), 120, q, 0.35, 0.4);
      inkLine(p, 50300 + n, q, {weight: 0.6, color: mix('#a8782a', CELLC.back, 0.5), curve: 0.25, still: true});
    }
  });
  // Wall plane between the main-layer cells (the double cell walls), a little behind the front.
  wWash(p, c, 50500, CELLC.wall, 160, [[-4, -3, -ZF - 0.005], [4, -3, -ZF - 0.005], [4, 3, -ZF - 0.005], [-4, 3, -ZF - 0.005]], 0.3, 0.5);
  // Main layer: cells sorted far to near from the camera (outer first, hero last).
  const cells = cellsOf(7, 3).filter((cl) => {
    const q = camPoint(c, [cl.x, cl.y, ZF]);
    return q && q[0] > -900 && q[0] < W + 900 && q[1] > -900 && q[1] < HGT + 900;
  });
  cells.sort((a, b) => Math.hypot(b.x - c.x, b.y - c.y) - Math.hypot(a.x - c.x, a.y - c.y));
  cells.forEach((cl) => paintCell(p, c, s, cl, cl.i === 0 && cl.j === 0, 51000 + (cl.i + 10) * 400 + (cl.j + 10) * 21 * 400));
  if (s.burst) {
    // The blade edge: a huge cool steel plane entering from the top left, its edge just through the hero cell's wall.
    const b: V3[] = [[-0.9, 0.9, 0.2], [-0.12, 0.9, 0.2], [-0.12, 0.13, 0.05], [-0.9, 0.0, 0.05]];
    const q = clip(wp(c, b));
    if (q.length >= 3) {
      hardFill(p, 59000, CELLC.steel, q);
      washAt(p, 59001, CELLC.steelHi, 120, [q[1], q[2], [q[2][0] - 40, q[2][1]], [q[1][0] - 40, q[1][1]]], 0.1, 0.3);
      inkLine(p, 59002, q, {weight: 1.2, color: '#5d666c'});
    }
  }
};

// EYE (LF03, S01-B04-SH02): moved to ./eye.ts (asset N6, Boss W5.2 v5).

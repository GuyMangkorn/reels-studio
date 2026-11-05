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
/**
 * Cell state. `beadGlint`, `sacPulse` and the spike key state `burst` are the LF02 / SPK_CELL inputs (absent fields keep those
 * frames exactly). The optional N5 timed fields (Boss W5.2 G-B, S01-B03-SH01..SH03) are 0..1 progress values the shot computes
 * from its own clock; per-item arrays are indexed by meeting `k` 0..4 (`MEET_BEADS`) and product item 0..9 (`ITEM`).
 */
export type CellState = {
  t: number; beadGlint: number; sacPulse: number; burst?: number;
  /** Hero wall breathing (fraction of the wall size, +-0.01 on the ambient clock). */
  breathe?: number;
  /** Sac membrane brightening (SH01 l 93-110). */
  sacGlow?: number;
  /** Blade edge: sweep in from the lower left (0 off frame, 1 edge through the hero's lower-left wall), then withdraw (W5.3; W5.2 upper left). */
  blade?: number; bladeOut?: number;
  /** Hero wall tear at its lower left (0 intact, 1 open, wet edge; W5.3, W5.2 upper left). */
  tear?: number;
  /** Sac pop (0 intact, 1 membrane burst into fragments) and the fragments' fade (1 gone). */
  pop?: number; sacGone?: number;
  /** Per teal enzyme k: 0 in the sac, 1 touching its bead `MEET_BEADS[k]`. */
  drift?: readonly number[];
  /** Per product item (0..4 the touched beads, 5..9 the small drops by them): 0 yellow / absent, 1 orange. */
  orange?: readonly number[];
  /** Violet second enzymes: presence 0..1, a glow pulse 0..1, per enzyme k the move onto its orange bead 0..1. */
  violet?: number; violetPulse?: number; touch?: readonly number[];
  /** Per product item: orange -> lilac 0..1, then the lilac puff's rise 0..1 (out of the cell and up the frame). */
  lilac?: readonly number[]; rise?: readonly number[];
};

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

// ---- N5 timed burst geometry (hero cell local metres; Boss W5.2 G-B).
/** Beads the five teal enzymes meet (the five nearest the sac, nearest first). */
export const MEET_BEADS = [2, 7, 8, 6, 4] as const;
/**
 * Where the blade edge goes through the hero's wall, the edge direction and its back normal (the side the steel lies on).
 * W5.3 fix round 1 (viewer check r1: the tear sat on the channel mark and the ภาพจำลอง tag, y < 360; the hero's top wall projects
 * at y 156-241 in SH02/SH03): the cut moves to the hero's lower-left wall (bottom wall, x -0.17; y ~700 in SH02) and the blade comes
 * in from the lower left, its edge 50 deg down to the right (the W5.2 geometry mirrored about the cell's mid line), and withdraws
 * along its back normal instead of sliding up-left along the edge, so no event art enters y < 360.
 */
const TEAR: V3 = [-0.17, -0.113, ZF];
const BL_DIR: [number, number] = [Math.cos(-50 * (Math.PI / 180)), Math.sin(-50 * (Math.PI / 180))];
const BL_UP: [number, number] = [BL_DIR[1], -BL_DIR[0]];
const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
/** Product item k (0..9): the touched bead (k < 5) or a small drop beside it (k >= 5), cell-local, with its radius. */
const itemOf = (k: number): {at: V3; r: number} => {
  const {beads} = contents(0, 0), m = k % 5, b = beads[MEET_BEADS[m]];
  if (k < 5) return {at: b, r: 0.014 + 0.003 * hash(MEET_BEADS[m])};
  const a = 1.9 + 1.25 * m;
  return {at: [b[0] + 0.03 * Math.cos(a), b[1] + 0.03 * Math.sin(a), b[2] + 0.004], r: 0.0085};
};
const v01 = (a: readonly number[] | undefined, k: number) => (a ? Math.max(0, Math.min(1, a[k] ?? 0)) : 0);

/** Hero contents in the timed states: sac (intact, pulsing or burst), teal enzymes on their way, beads, orange/lilac products, violet enzymes. */
const paintHeroTimed = (p: Painter, c: YCam, s: CellState, x: number, y: number, seed: number) => {
  const {beads, sac} = contents(0, 0);
  const at = (v: V3): V3 => [x + v[0], y + v[1], v[2]];
  const sacC = sph(c, at(sac), 1);
  const pop = s.pop ?? 0, gone = s.sacGone ?? 0;
  if (sacC) {
    const k = sacC.r, pulse = s.sacPulse, glow = s.sacGlow ?? 0;
    const rx = 0.085 * k * (1 + 0.06 * pulse + 0.2 * pop), ry = 0.062 * k * (1 + 0.06 * pulse + 0.2 * pop);
    if (pop <= 0) {
      washAt(p, seed + 10, mix(CELLC.sacMem, '#effff9', glow), 150, ell(sacC.x, sacC.y, rx, ry, 22), 0.15, 0.3);
      inkLine(p, seed + 20, ell(sacC.x, sacC.y, rx, ry, 22), {weight: 2.1 + 1.2 * pulse + 1.0 * glow, color: mix(CELLC.sacInk, '#5fd0c2', glow)});
      if (pulse > 0) washAt(p, seed + 21, '#8fe0d4', 90 * pulse, ell(sacC.x, sacC.y, rx * 1.25, ry * 1.3, 22), 0.5, 0.3);
      if (glow > 0) washAt(p, seed + 22, '#f4fffb', 110 * glow, ell(sacC.x, sacC.y, rx * 1.12, ry * 1.16, 22), 0.4, 0.25);
    } else if (gone < 1) {
      // Burst: the membrane splits into five arcs that fly a little outward and fade; the inside wash thins out.
      washAt(p, seed + 10, CELLC.sacMem, 150 * (1 - pop) + 60 * (1 - gone), ell(sacC.x, sacC.y, rx * 0.95, ry * 0.95, 22), 0.35, 0.4);
      for (let a = 0; a < 5; a++) {
        const u0 = (a / 5) * Math.PI * 2 + 0.25, u1 = u0 + 0.85, mid = (u0 + u1) / 2, out = 0.35 * pop * k * 0.06;
        const arc = Array.from({length: 7}, (_, q): Pt => {
          const u = u0 + (q / 6) * (u1 - u0);
          return [sacC.x + rx * Math.cos(u) + out * Math.cos(mid), sacC.y + ry * Math.sin(u) + out * Math.sin(mid)];
        });
        inkLine(p, seed + 23 + a, arc, {closed: false, weight: 1.8 * (1 - gone) + 0.3, color: mix(CELLC.sacInk, CELLC.fluid, gone)});
      }
    }
  }
  // Teal enzymes: from their sac places to the right side of their bead (k 0 is the one nearest the beads).
  for (let e = 0; e < 5; e++) {
    const from: V3 = [sac[0] - 0.045 + 0.022 * e, sac[1] + (e % 2 ? 0.02 : -0.018), 0];
    const b = beads[MEET_BEADS[e]], to: V3 = [b[0] + 0.027, b[1] + (e % 2 ? 0.007 : -0.007), b[2] + 0.002];
    const u = v01(s.drift, e), q = sph(c, at(lerp3(from, to, u)), 0.016);
    if (q) hardFill(p, seed + 11 + e, CELLC.enzyme, pac(q.x, q.y, q.r, e * 1.3 + 2.2 * u));
  }
  // Beads: the five met beads turn orange (then lilac and leave as gas); the rest stay yellow.
  const glint = s.beadGlint;
  beads.forEach((bv, k) => {
    const m = MEET_BEADS.indexOf(k as (typeof MEET_BEADS)[number]);
    const or = m >= 0 ? v01(s.orange, m) : 0, li = m >= 0 ? v01(s.lilac, m) : 0;
    const shrink = 1 - 0.75 * li;
    const q = sph(c, at(bv), (0.014 + 0.003 * hash(k)) * shrink);
    if (!q || li >= 1) return;
    const col = mix(mix(CELLC.bead, CELLC.orange, or), CELLC.lilac, li);
    if (glint > 0) washAt(p, seed + 40 + k, CELLC.beadHi, 120 * glint, ell(q.x, q.y, q.r * 2.1, q.r * 2.1, 14), 0.5, 0.2);
    if (or > 0 && li <= 0) washAt(p, seed + 30 + k, '#f6b27a', 70 * or, ell(q.x, q.y, q.r * 1.7, q.r * 1.7, 14), 0.5, 0.2);
    hardFill(p, seed + 60 + k, col, ell(q.x, q.y, q.r, q.r, 14));
    washAt(p, seed + 80 + k, mix(col, '#7a4a10', 0.35 * (1 - li)), 120, ell(q.x + q.r * 0.3, q.y + q.r * 0.3, q.r * 0.6, q.r * 0.55, 10), 0.1, 0.2);
    hardFill(p, seed + 100 + k, mix(CELLC.beadHi, '#ffffff', glint), ell(q.x - q.r * 0.35, q.y - q.r * 0.35, q.r * (0.28 + 0.15 * glint), q.r * (0.24 + 0.12 * glint), 8));
    inkLine(p, seed + 120 + k, ell(q.x, q.y, q.r, q.r, 14), {weight: 0.6, color: mix(mix('#a88a1a', '#a8501e', or), '#6e58a0', li)});
  });
  // Small orange drops made where teal met yellow (items 5..9).
  for (let k = 5; k < 10; k++) {
    const or = v01(s.orange, k), li = v01(s.lilac, k);
    if (or <= 0 || li >= 1) continue;
    const it = itemOf(k), q = sph(c, at(it.at), it.r * (0.4 + 0.6 * or) * (1 - 0.7 * li));
    if (!q) continue;
    const col = mix(CELLC.orange, CELLC.lilac, li);
    hardFill(p, seed + 160 + k, col, ell(q.x, q.y, q.r, q.r, 12));
    hardFill(p, seed + 175 + k, mix(col, '#ffffff', 0.55), ell(q.x - q.r * 0.35, q.y - q.r * 0.35, q.r * 0.3, q.r * 0.26, 8));
    inkLine(p, seed + 190 + k, ell(q.x, q.y, q.r, q.r, 12), {weight: 0.5, color: mix('#a8501e', '#6e58a0', li)});
  }
  // Violet second enzymes (four-lobed): appear up-left of their orange bead, pulse, then move on to touch it.
  const vio = s.violet ?? 0;
  if (vio > 0) {
    for (let e = 0; e < 5; e++) {
      const b = beads[MEET_BEADS[e]], a = 2.3 + 0.5 * e;
      const from: V3 = [b[0] + 0.055 * Math.cos(a), b[1] + 0.055 * Math.sin(a), b[2] + 0.006], to: V3 = [b[0] - 0.024, b[1] + 0.014, b[2] + 0.006];
      const u = v01(s.touch, e), pulse = s.violetPulse ?? 0;
      const q = sph(c, at(lerp3(from, to, u)), 0.014 * (0.5 + 0.5 * vio) * (1 + 0.15 * pulse));
      if (!q) continue;
      if (pulse > 0) washAt(p, seed + 210 + e, '#c9b4f2', 110 * pulse, ell(q.x, q.y, q.r * 2.0, q.r * 2.0, 14), 0.5, 0.2);
      hardFill(p, seed + 220 + e, mix(CELLC.fluid, CELLC.violet, vio), fourLobe(q.x, q.y, q.r, e + 0.6 * u));
      inkLine(p, seed + 230 + e, fourLobe(q.x, q.y, q.r, e + 0.6 * u), {weight: 0.6, color: mix(CELLC.fluid, '#4a3080', vio)});
    }
  }
};

/**
 * The torn lower-left wall of the hero cell (W5.3 fix round 1; viewer check r1: the W5.2 flat dark zigzag read as a sticker): an
 * opening in the hero's own outline. The amber wall plane shows through a ragged gap, the inner lip (cell membrane, cream) bulges
 * into the cell and the outer lip (wall, amber) sags out, both edged in the hero ring's own ink with a light keyline on the wet
 * edge, a wet sheen on the inner lip and a few beads of cell fluid seeping out below. `tear` 0..1 opens it from the cut point.
 */
const paintTear = (p: Painter, c: YCam, s: CellState, x: number, y: number, seed: number) => {
  const t = s.tear ?? 0;
  if (t <= 0) return;
  const [tx, ty, tz] = TEAR, o = (dx: number, dy: number): V3 => [x + tx + dx, y + ty + dy, tz + 0.001];
  // Ragged rip along the wall line (0.12 set-m long when open); lips meet the ring at both ends.
  // Torn, not cut: 15 points with jittered spacing and alternating teeth on both lips (0 at the ends, where they meet the ring).
  const n = 15, X = Array.from({length: n}, (_, i) => -0.06 + (0.12 * (i + (i > 0 && i < n - 1 ? 0.35 * (hash(i + 21) - 0.5) : 0))) / (n - 1));
  const mid = (i: number) => Math.sin((Math.PI * i) / (n - 1)), tooth = (i: number, k: number) => (i % 2 ? 1 : -0.6) * 0.0035 * (0.5 + hash(i + k));
  const inner = X.map((dx, i): V3 => o(dx * t, (0.012 * mid(i) * (0.55 + 0.45 * hash(i + 3)) + tooth(i, 5) * mid(i)) * t));
  const outer = X.map((dx, i): V3 => o(dx * t, -(0.011 * mid(i) * (0.55 + 0.45 * hash(i + 9)) + tooth(i + 1, 11) * mid(i)) * t));
  const qi = wp(c, inner), qo = wp(c, outer);
  if (qi.length < n || qo.length < n) return;
  const u = camUnit(c, o(0, 0)), lip = 0.008 * u * t;
  // The opening: the wall plane behind (amber, a little deeper at the centre), covering the ring's ink across the gap.
  const gap = [...qi, ...[...qo].reverse()];
  hardFill(p, seed + 300, mix(CELLC.wall, CELLC.back, 0.45), gap);
  washAt(p, seed + 304, mix(CELLC.back, '#9a6418', 0.3), 90, gap.map(([a, b]): Pt => [a + (gap.reduce((m, q) => m + q[0], 0) / gap.length - a) * 0.4, b + (gap.reduce((m, q) => m + q[1], 0) / gap.length - b) * 0.45]), 0.3, 0.3);
  // Lips: a band beyond each edge (inner up into the cell in cream, outer down in the wall colour), ends tapering into the ring.
  const band = (q: Pt[], dir: number): Pt[] => [...q, ...q.map(([a, b], i): Pt => [a, b + dir * lip * (0.3 + mid(i))]).reverse()];
  hardFill(p, seed + 305, CELLC.fluid, band(qi, -1));
  hardFill(p, seed + 306, mix(CELLC.wall, CELLC.fluid, 0.25), band(qo, 1));
  // Ink of the hero ring along both torn edges, a light keyline just inside each lip, a wet sheen on the inner lip.
  inkLine(p, seed + 301, qi, {closed: false, weight: 1.6, color: '#a8782a', curve: 0.2});
  inkLine(p, seed + 302, qo, {closed: false, weight: 1.6, color: '#a8782a', curve: 0.2});
  inkLine(p, seed + 303, qi.slice(1, -1).map(([a, b], i): Pt => [a, b - lip * (0.25 + 0.5 * mid(i + 1))]), {closed: false, weight: 1.3, color: CELLC.wallHi, curve: 0.3});
  inkLine(p, seed + 307, qo.slice(2, -2).map(([a, b]): Pt => [a, b + lip * 0.5]), {closed: false, weight: 1.0, color: CELLC.wallHi, curve: 0.3});
  washAt(p, seed + 308, '#ffffff', 90 * t, ell((qi[5][0] + qi[8][0]) / 2, (qi[5][1] + qi[8][1]) / 2 - lip * 0.6, lip * 2.2, lip * 0.45, 10), 0.3, 0.2);
  // Cell fluid seeping out of the opening: three cream beads below the outer lip.
  for (let d = 0; d < 3; d++) {
    const dq = sph(c, o(-0.02 + 0.018 * d, -(0.02 + 0.01 * d) * t), 0.004 + 0.0015 * d);
    if (dq) {
      washAt(p, seed + 310 + d, CELLC.glow, 160 * t, ell(dq.x, dq.y, dq.r, dq.r * 1.15, 10), 0.2, 0.2);
      inkLine(p, seed + 313 + d, ell(dq.x, dq.y, dq.r, dq.r * 1.15, 10), {weight: 0.6, color: mix('#a8782a', CELLC.fluid, 0.4)});
    }
  }
};

/** Puff of product item k (cell-local, no sway): it spreads across the hero cell as it climbs (x -0.30..+0.30) and rises
 *  0.38..0.78 set-m, swelling from the drop to ~0.18, so at the SH03 end camera they fill the upper half (y ~0-1000). */
const puffOf = (k: number, li: number, ri: number): {at: V3; r: number} => {
  const it = itemOf(k), lift = (0.38 + 0.4 * ((k * 0.61 + hash(k + 70) * 0.3) % 1)) * ri, side = (-0.3 + 0.6 * ((k * 0.37 + hash(k + 90) * 0.4) % 1)) * ri;
  return {at: [it.at[0] * (1 - ri) + side, it.at[1] + lift, 0.03 + 0.06 * ri], r: 0.012 + 0.03 * li + 0.14 * ri};
};

/** Lilac gas puffs (gas colour, alpha ~0.4-0.55, soft edges, never a hard shape): one per product item, rising out of the cell. */
const paintPuffs = (p: Painter, c: YCam, s: CellState, x: number, y: number, seed: number) => {
  if (!s.lilac) return;
  for (let k = 0; k < 10; k++) {
    const li = v01(s.lilac, k), ri = v01(s.rise, k);
    if (li <= 0) continue;
    const pf = puffOf(k, li, ri), sway = 0.035 * Math.sin(s.t * 1.3 + k * 1.7) * ri;
    const q = sph(c, [x + pf.at[0] + sway, y + pf.at[1], pf.at[2]], pf.r);
    if (!q) continue;
    const op = Math.min(140, 60 + 80 * li) * (1 - 0.15 * ri);
    washAt(p, seed + 400 + k, CELLC.lilac, op, blob(seed + 400 + k, q.x, q.y, q.r, q.r * 0.85, s.t), 0.65, 0.4);
    washAt(p, seed + 420 + k, mix(CELLC.lilac, '#ffffff', 0.35), op * 0.55, blob(seed + 420 + k, q.x - q.r * 0.15, q.y - q.r * 0.2, q.r * 0.6, q.r * 0.5, s.t), 0.7, 0.4);
  }
};

const paintCell = (p: Painter, c: YCam, s: CellState, cell: {i: number; j: number; x: number; y: number}, hero: boolean, seed: number) => {
  const {x, y} = cell, br = hero ? 1 + (s.breathe ?? 0) : 1, w = (CW - GAP) * br, h = (CH - GAP) * br;
  const timed = hero && (s.drift !== undefined || s.sacGlow !== undefined || s.breathe !== undefined);
  // Back of the chamber (deeper, warmer), then the contents, then the front membrane as a pale veil and a wall ring.
  const backF = wFill(p, c, seed, CELLC.fluidDeep, rrect(x, y, w, h, -ZF, 0.07, 0.01, seed));
  if (backF.length < 3) return;
  wWash(p, c, seed + 1, CELLC.fluid, 150, rrect(x - 0.02, y + 0.015, w * 0.82, h * 0.72, -ZF + 0.01, 0.05), 0.45, 0.35);
  if (timed) {
    paintHeroTimed(p, c, s, x, y, seed);
    paintFront(p, c, x, y, w, h, true, seed);
    paintTear(p, c, s, x, y, seed);
    paintPuffs(p, c, s, x, y, seed);
    return;
  }
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
  paintFront(p, c, x, y, w, h, hero, seed);
};

/** Front membrane: a pale translucent veil, a light crescent along the top-left and the ink of the wall. */
const paintFront = (p: Painter, c: YCam, x: number, y: number, w: number, h: number, hero: boolean, seed: number) => {
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
  const bl = s.blade ?? 0, out = s.bladeOut ?? 0;
  if (bl > 0 && out < 1) {
    // N5 blade (SH02): a huge cool steel plane pushed in along its back normal until the edge runs through the hero's wall at TEAR,
    // then withdrawn the same way (W5.3: lower-left entry; W5.2 came from the upper left and slid out along the edge).
    const push = 0.45 * (1 - bl) + 0.6 * out;
    const e = (s0: number, n0: number): V3 => [TEAR[0] + BL_DIR[0] * s0 + BL_UP[0] * (n0 + push), TEAR[1] + BL_DIR[1] * s0 + BL_UP[1] * (n0 + push), 0.075];
    const q = clip(wp(c, [e(-1.4, 0), e(0.07, 0), e(-0.22, 0.9), e(-1.4, 0.9)]));
    if (q.length >= 3) {
      hardFill(p, 59000, CELLC.steel, q);
      const bevel = clip(wp(c, [e(-1.4, 0), e(0.07, 0), e(0.0, 0.035), e(-1.4, 0.035)]));
      if (bevel.length >= 3) washAt(p, 59001, CELLC.steelHi, 150, bevel, 0.1, 0.3);
      washAt(p, 59003, '#7e888f', 60, clip(wp(c, [e(-1.4, 0.35), e(-0.1, 0.35), e(-0.22, 0.9), e(-1.4, 0.9)])), 0.4, 0.4);
      inkLine(p, 59002, q, {weight: 1.2, color: '#5d666c'});
    }
  }
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

/**
 * Measured projection of the hero cell at a state (px, QA numbers for the sheets): its wall box, the box of its contents (sac,
 * beads, enzymes, products; the essentials of B03) and of the lilac puffs. `y0` top, `y1` bottom; null when nothing projects.
 */
export const heroExtent = (c: YCam, s: CellState) => {
  type Box = {x0: number; x1: number; y0: number; y1: number} | null;
  const grow = (b: Box, v: V3, r: number): Box => {
    const q = sph(c, v, r);
    if (!q) return b;
    const n = {x0: q.x - q.r, x1: q.x + q.r, y0: q.y - q.r, y1: q.y + q.r};
    return b ? {x0: Math.min(b.x0, n.x0), x1: Math.max(b.x1, n.x1), y0: Math.min(b.y0, n.y0), y1: Math.max(b.y1, n.y1)} : n;
  };
  const w = CW - GAP, h = CH - GAP, {beads, sac} = contents(0, 0);
  let wall: Box = null, stuff: Box = null, puffs: Box = null;
  for (const v of rrect(0, 0, w, h, ZF, 0.07)) wall = grow(wall, v, 0);
  if ((s.pop ?? 0) < 1) stuff = grow(stuff, sac, 0.085);
  beads.forEach((b, k) => {
    const m = MEET_BEADS.indexOf(k as (typeof MEET_BEADS)[number]);
    if (m < 0 || v01(s.lilac, m) < 1) stuff = grow(stuff, b, 0.017);
  });
  for (let k = 5; k < 10; k++) if (v01(s.orange, k) > 0 && v01(s.lilac, k) < 1) stuff = grow(stuff, itemOf(k).at, 0.009);
  for (let k = 0; k < 10; k++) {
    const li = v01(s.lilac, k), ri = v01(s.rise, k);
    if (li <= 0) continue;
    const pf = puffOf(k, li, ri);
    puffs = grow(puffs, pf.at, pf.r);
  }
  const r = (b: Box) => b && {x0: Math.round(b.x0), x1: Math.round(b.x1), y0: Math.round(b.y0), y1: Math.round(b.y1)};
  return {wall: r(wall), contents: r(stuff), puffs: r(puffs)};
};

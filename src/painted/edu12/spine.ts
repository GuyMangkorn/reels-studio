// DIAG-SPINE (brief EDU-EP12-BRIEF-R1.1 VD05/VD12, truth limits 1-2; LOOK-FRAME CODE, W3 R1.2). A see-through teaching diagram drawn over a
// figure card, projected from the figure's anchors each frame (the figure owns the transform; the overlay has no camera of its own).
// `bottom` = pelvis top (fixed), `top` = neck base, both picture px; `back` = unit picture vector from the spine toward the figure's back.
// Earth: 7 ivory blocks + 6 water-blue pads, pads full 0.55x / thin 0.30x block height, the column top follows the pads; drops and the
// glowing lowest pad are Earth only. Space: ONE plain smooth ivory column, no rings, bands, gaps, blue, glow, water or pads (FC-03,
// Boat N1); it straightens at constant arc length, and the bracket beside it grows only with that straightening (no ticks, no numbers).
import {ell, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {C} from './palette';

type V = Pt;
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const len = (a: V) => Math.hypot(a[0], a[1]);
const unit = (a: V): V => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const perp = (a: V): V => [-a[1], a[0]];

/** Charcoal veil over the torso (35 %, soft: three nested ovals), centred on the spine, along it. */
export const paintVeil = (p: Painter, seed: number, a: V, b: V, width: number, alpha = 0.35) => {
  const mid: V = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = sub(a, b), ang = Math.atan2(d[1], d[0]), L = len(d);
  [[1.0, 0.4], [0.86, 0.35], [0.72, 0.4]].forEach(([k, al], i) =>
    hardFill(p.layer(alpha * al * 1.15, seed * 3 + i), seed + i, C.veil, ell(mid[0], mid[1], (L * 0.5 + width * 0.55) * k, width * 0.62 * k, 30, ang)));
};

const quad = (c: V, ax: V, half: number, w: number): Pt[] => {
  const n = perp(ax);
  return [add(add(c, ax, -half), n, -w / 2), add(add(c, ax, -half), n, w / 2), add(add(c, ax, half), n, w / 2), add(add(c, ax, half), n, -w / 2)];
};
/** Rounded box along `ax` (centre c, half length `half`, width w). */
const rbox = (c: V, ax: V, half: number, w: number, r = 0.35): Pt[] => {
  const n = perp(ax), out: Pt[] = [], rr = Math.min(half, w / 2) * r;
  const corners: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  corners.forEach(([sa, sn], i) => {
    const base = add(add(c, ax, sa * (half - rr)), n, sn * (w / 2 - rr));
    for (let k = 0; k <= 4; k++) { const t = (i + k / 4) * (Math.PI / 2); out.push(add(add(base, ax, rr * Math.cos(t)), n, rr * Math.sin(t))); }
  });
  return out;
};

export type EarthSpineState = {
  /** Pad fullness 0 (thin, 0.30x) .. 1 (full, 0.55x). */
  pad: number;
  /** Drops: >0 squeezing out (move away from the pads), <0 soaking in (move toward them); |value| 0..1 = phase. */
  drops?: number;
  /** Glow on the lowest pad 0..1 (L05). */
  glow?: number;
  /** Veil and diagram opacity 0..1 (fade in). */
  fade?: number;
  /** Picture px per metre at the figure (for widths). */
  u: number;
};

/** Earth spine over a figure: returns the pad centres (lowest first), for a label leader. */
export const paintSpineEarth = (p: Painter, seed: number, bottom: V, top: V, back: V, s: EarthSpineState): Pt[] => {
  const fade = s.fade ?? 1, q = fade < 1 ? p.layer(fade, seed * 5) : p;
  const axis0 = unit(sub(top, bottom)), span = len(sub(top, bottom));
  const k = 0.3 + 0.25 * Math.max(0, Math.min(1, s.pad));
  const h = span / (7 + 6 * 0.55); // block height from the full column (the top follows the pads: thin pads = a shorter column)
  const total = 7 * h + 6 * k * h, w = Math.max(12, 0.055 * s.u);
  paintVeil(q, seed, add(bottom, axis0, total), bottom, Math.max(w * 3.2, 0.2 * s.u));
  // gentle natural S along the back (lateral offset toward `back` is 0 at the ends)
  const at = (d: number): {c: V; ax: V} => {
    const f = d / total, lat = 0.035 * total * Math.sin(f * Math.PI * 2);
    const c = add(add(bottom, axis0, d), back, lat);
    const lat2 = 0.035 * total * Math.cos(f * Math.PI * 2) * (Math.PI * 2 / total);
    return {c, ax: unit(add(axis0, back, lat2))};
  };
  const pads: Pt[] = [];
  let d = 0;
  for (let i = 0; i < 7; i++) {
    const {c, ax} = at(d + h / 2), bw = w * (1.25 - i * 0.04);
    const box = rbox(c, ax, h / 2, bw);
    hardFill(q, seed + 10 + i * 4, C.bone, box);
    hardFill(q, seed + 11 + i * 4, mixColor(C.bone, '#b9a98a', 0.55), quad(add(c, perp(ax), -bw * 0.32), ax, h * 0.42, bw * 0.28));
    inkLine(q, seed + 12 + i * 4, box, {color: C.boneInk, weight: 1.1, still: true});
    // spinous process toward the back (only when the blocks are large enough to read; small diagrams stay a plain stack)
    if (h >= 20) {
    const sp = add(c, back, bw * 0.5), tip = add(add(c, back, bw * 0.95), ax, -h * 0.25);
    hardFill(q, seed + 13 + i * 4, C.bone, [add(sp, ax, h * 0.3), tip, add(sp, ax, -h * 0.3)]);
    inkLine(q, seed + 40 + i, [add(sp, ax, h * 0.3), tip, add(sp, ax, -h * 0.3)], {color: C.boneInk, weight: 0.9, closed: false, still: true});
    }
    d += h;
    if (i < 6) {
      const pc = at(d + (k * h) / 2), pw = bw * 0.96, ph = Math.max(2, k * h);
      const padPts = ell(pc.c[0], pc.c[1], pw / 2, ph / 2 + 0.6, 22, Math.atan2(pc.ax[1], pc.ax[0]) + Math.PI / 2);
      if (i === 0 && (s.glow ?? 0) > 0) {
        const g = s.glow ?? 0;
        hardFill(q.layer(0.35 * g, seed * 9), seed + 70, C.glow, ell(pc.c[0], pc.c[1], pw * 0.95, ph * 2.2 + 8, 22, Math.atan2(pc.ax[1], pc.ax[0]) + Math.PI / 2));
        hardFill(q.layer(0.5 * g, seed * 9 + 1), seed + 71, C.glow, ell(pc.c[0], pc.c[1], pw * 0.7, ph * 1.4 + 4, 22, Math.atan2(pc.ax[1], pc.ax[0]) + Math.PI / 2));
      }
      hardFill(q, seed + 50 + i, i === 0 && (s.glow ?? 0) > 0.5 ? mixColor(C.pad, C.glow, 0.6) : C.pad, padPts);
      inkLine(q, seed + 60 + i, padPts, {color: '#2f6d8c', weight: 0.8, still: true});
      pads.push(pc.c);
      // drops beside the pad, front side (away from the back)
      const dr = s.drops ?? 0;
      if (dr !== 0) {
        const ph0 = Math.abs(dr), out = dr > 0 ? ph0 : 1 - ph0;
        for (let j = 0; j < 2; j++) {
          const side = j ? 1 : -1, dist = pw * (0.6 + 0.9 * out), dc = add(add(pc.c, perp(pc.ax), side * dist * (j ? 1 : 0.6)), back, j ? 0 : -dist * 0.4);
          const r = Math.max(3, 0.009 * s.u);
          const tail = add(dc, unit(sub(dc, pc.c)), dr > 0 ? -r * 1.8 : r * 1.8);
          const drop: Pt[] = [...ell(dc[0], dc[1], r, r, 10).slice(0, 10), tail];
          hardFill(q, seed + 80 + i * 2 + j, C.drop, drop);
          inkLine(q, seed + 100 + i * 2 + j, drop, {color: '#2f6d8c', weight: 0.6, still: true});
        }
      }
      d += k * h;
    }
  }
  return pads;
};

/** End-to-end length factor of a sine S of amplitude `amp` (fraction of the arc) with arc length 1. */
const chordOf = (amp: number) => {
  let L = 0, prev: V = [0, 0];
  const N = 60;
  for (let i = 1; i <= N; i++) { const s = i / N, q: V = [amp * Math.sin(s * Math.PI * 2), s]; L += len(sub(q, prev)); prev = q; }
  return 1 / L;
};

export type SpaceSpineState = {
  /** Straightening 0 (S-curve, amplitude 0.10 x span) .. 1 (0.02 x span). Arc length constant. */
  straight: number;
  fade?: number;
  u: number;
  /** Show the length bracket beside the column (default true). */
  bracket?: boolean;
};

/** Space spine: one smooth ivory column, constant arc length `arc` px. Returns the column top (px). */
export const paintSpineSpace = (p: Painter, seed: number, bottom: V, axis: V, back: V, arc: number, s: SpaceSpineState): Pt => {
  const fade = s.fade ?? 1, q = fade < 1 ? p.layer(fade, seed * 5) : p;
  const amp = 0.1 + (0.02 - 0.1) * Math.max(0, Math.min(1, s.straight));
  const chord = arc * chordOf(amp), ax = unit(axis), w = Math.max(10, 0.045 * s.u);
  const top = add(bottom, ax, chord);
  // No veil in space (viewer check R1.2: the soft charcoal oval read as a glow/halo; FC-03 forbids glow on the space spine). The column sits
  // straight on the figure card with its own ink line.
  const N = 40, cl: V[] = [];
  for (let i = 0; i <= N; i++) { const f = i / N; cl.push(add(add(bottom, ax, chord * f), back, amp * arc * Math.sin(f * Math.PI * 2))); }
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = unit(sub(cl[Math.min(N, i + 1)], cl[Math.max(0, i - 1)])), n = perp(t), ww = w * (1.15 - 0.3 * (i / N));
    left.push(add(cl[i], n, ww / 2)); right.push(add(cl[i], n, -ww / 2));
  }
  const tube = [...left, ...right.reverse()];
  hardFill(q, seed + 1, C.bone, tube);
  // one soft shade strip along the column (no rings or bands)
  const shade: Pt[] = [...left.map((pt, i) => add(pt, sub(cl[i], pt), 0.0)), ...cl.slice().reverse().map((pt, i) => add(pt, sub(left[N - i], pt), 0.45))];
  hardFill(q.layer(0.5, seed * 7), seed + 2, mixColor(C.bone, '#b9a98a', 0.6), shade);
  inkLine(q, seed + 3, tube, {color: C.boneInk, weight: 1.2, curve: 0.05, still: true});
  if (s.bracket !== false) {
    // bracket on the BACK side, just outside the column's widest bend (R1.4: the viewer read the far wall tape as the measure; the bracket now
    // sits next to the column, off the torso), from the pelvis line to the column top: grows only with the straightening
    const off = add([0, 0], back, w * 1.6 + amp * arc);
    const b0 = add(bottom, off), b1 = add(top, off), cap = add([0, 0], back, -w * 0.7);
    inkLine(q, seed + 4, [add(b0, cap), b0, b1, add(b1, cap)], {color: '#f6f1e6', weight: 4.2, closed: false, curve: 0, still: true});
    inkLine(q, seed + 5, [add(b0, cap), b0, b1, add(b1, cap)], {color: C.boneInk, weight: 1.6, closed: false, curve: 0, still: true});
  }
  return top;
};

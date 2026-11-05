import {ell, hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';

// EDU-EP02-SHORT screen-space doodles (Boss W5.2 group G-D, N9; scene sheets s01-b05.md / s01-b06-b07.md SS-R2): a chalk "?" and
// a red stamped "✗" painted over the plate in picture px, drawn on stroke by stroke (`draw` 0..1 over the sheet's 6 f) and popping
// once complete (`pop` 0..1 bump). Each stroke carries a dark keyline under the colour so chalk-white reads on the cream kitchen
// wall (the sheet's `#fbf6ea` alone is ~1.1:1 against it). G-F (B07, N9) adds the chalk alarm bell: an arch, its lip, a clapper and
// a knob that swing together about the knob (`rot`), and two pairs of ring marks either side that stay put.

export type DoodleKind = 'question' | 'cross' | 'bell';
/**
 * `x`, `y` centre and `size` height (px); `draw` 0..1 stroke progress; `pop` 0..1 scale bump; `color` overrides the kind's colour;
 * `rot` (radians, G-F) swings the kind's swinging strokes (the bell's body) about its pivot. Absent `rot` paints as before.
 */
export type Doodle = {kind: DoodleKind; x: number; y: number; size: number; draw: number; pop?: number; color?: string; rot?: number};

const CHALK = '#fbf6ea', RED = '#d2463a', KEY = '#3a2418';
/** Strokes in units of the doodle height, centre (0, 0), y down. The "?" is a hook and a dot; the "✗" two crossing bars. */
const STROKES: Record<DoodleKind, Pt[][]> = {
  question: [
    [[-0.26, -0.2], [-0.22, -0.36], [-0.06, -0.47], [0.14, -0.45], [0.27, -0.32], [0.26, -0.15], [0.12, -0.03], [0.02, 0.06], [0.0, 0.2]],
    [[0.0, 0.38], [0.005, 0.4]],
  ],
  cross: [
    [[-0.42, -0.4], [-0.1, -0.08], [0.42, 0.42]],
    [[0.4, -0.42], [0.06, -0.06], [-0.4, 0.4]],
  ],
  // Bell (B07): arch from the left lip over the crown to the right lip, the lip (a slight downward bow), the clapper under it and
  // the knob on the crown; then the ring marks, inner and outer arcs on each side ("(( bell ))"), x out to +-0.8 of the height.
  bell: [
    [[-0.44, 0.3], [-0.36, 0.2], [-0.3, 0.02], [-0.28, -0.18], [-0.2, -0.36], [0, -0.43], [0.2, -0.36], [0.28, -0.18], [0.3, 0.02], [0.36, 0.2], [0.44, 0.3]],
    [[-0.46, 0.31], [-0.2, 0.36], [0.2, 0.36], [0.46, 0.31]],
    [[0, 0.47], [0.004, 0.48]],
    [[0, -0.5], [0.004, -0.51]],
    [[-0.56, -0.2], [-0.62, 0], [-0.56, 0.2]],
    [[-0.7, -0.3], [-0.79, 0], [-0.7, 0.3]],
    [[0.56, -0.2], [0.62, 0], [0.56, 0.2]],
    [[0.7, -0.3], [0.79, 0], [0.7, 0.3]],
  ],
};
/** Strokes that swing with `rot` and their pivot (units of the height). */
const SWING: Partial<Record<DoodleKind, {n: number; pivot: Pt}>> = {bell: {n: 4, pivot: [0, -0.5]}};

const lengthOf = (s: Pt[]) => s.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - s[i][0], q[1] - s[i][1]), 0);
/** The first `u` (0..1) of a polyline by length. */
const head = (s: Pt[], u: number): Pt[] => {
  const L = lengthOf(s) * u, out: Pt[] = [s[0]];
  let acc = 0;
  for (let i = 1; i < s.length; i++) {
    const d = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
    if (acc + d >= L) {
      const k = d ? (L - acc) / d : 0;
      out.push([s[i - 1][0] + (s[i][0] - s[i - 1][0]) * k, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * k]);
      return out;
    }
    acc += d;
    out.push(s[i]);
  }
  return out;
};

/** A stroke as a filled ribbon `w` px wide with round caps (an opaque mark: brush lines are translucent and let the keyline through). */
const ribbon = (pts: Pt[], w: number): Pt[] => {
  const n = pts.length - 1, L: Pt[] = [], R: Pt[] = [], h = w / 2;
  const nrm = pts.map((_, k): Pt => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n, k + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / d, (b[0] - a[0]) / d];
  });
  pts.forEach((q, k) => { L.push([q[0] + nrm[k][0] * h, q[1] + nrm[k][1] * h]); R.push([q[0] - nrm[k][0] * h, q[1] - nrm[k][1] * h]); });
  const cap = (q: Pt, nv: Pt, sgn: number): Pt[] => Array.from({length: 7}, (_, i) => {
    const a = Math.atan2(nv[1], nv[0]) + sgn * (Math.PI * (i + 1)) / 8;
    return [q[0] + Math.cos(a) * h, q[1] + Math.sin(a) * h];
  });
  return [...L, ...cap(pts[n], nrm[n], -1), ...R.reverse(), ...cap(pts[0], [-nrm[0][0], -nrm[0][1]], -1)];
};

/** Paint one doodle (after the plate). The strokes share the progress in order of their length; a dot stroke paints as a disc. */
export const paintDoodle = (p: Painter, seed: number, d: Doodle) => {
  if (d.draw <= 0) return;
  const S = d.size * (1 + 0.18 * Math.sin(Math.PI * Math.max(0, Math.min(1, d.pop ?? 0))));
  const strokes = STROKES[d.kind], lens = strokes.map(lengthOf), total = lens.reduce((a, b) => a + b, 0);
  const color = d.color ?? (d.kind === 'cross' ? RED : CHALK), w = S * (d.kind === 'cross' ? 0.13 : d.kind === 'bell' ? 0.075 : 0.1);
  // Hand wobble that redraws every 3 frames (the wiggle): each point nudged by a seeded 1.2 % of the size.
  const step = Math.floor(p.frame / 3);
  const P = ([x, y]: Pt, k: number): Pt => [d.x + (x + 0.012 * (hash(seed + k * 1.7 + step * 3.1) - 0.5)) * S, d.y + (y + 0.012 * (hash(seed + k * 2.3 + step * 5.3) - 0.5)) * S];
  const sw = SWING[d.kind], ca = Math.cos(d.rot ?? 0), sa = Math.sin(d.rot ?? 0);
  const swing = (q: Pt, i: number): Pt => {
    if (!sw || i >= sw.n || !d.rot) return q;
    const [px, py] = sw.pivot, dx = q[0] - px, dy = q[1] - py;
    return [px + dx * ca - dy * sa, py + dx * sa + dy * ca];
  };
  let done = 0;
  strokes.forEach((s, i) => {
    const u = Math.max(0, Math.min(1, (d.draw * total - done) / lens[i]));
    done += lens[i];
    if (u <= 0) return;
    const pts = head(s, u).map((q, k) => P(swing(q, i), i * 20 + k));
    if (lens[i] < 0.05) {
      const [x, y] = pts[0];
      hardFill(p, seed + i * 4, KEY, ell(x, y, w * 0.95, w * 0.95, 14));
      hardFill(p, seed + i * 4 + 1, color, ell(x, y, w * 0.68, w * 0.68, 14));
      return;
    }
    if (pts.length < 2) return;
    // Dense resample so the ribbon bends smoothly.
    const fine: Pt[] = [];
    pts.slice(1).forEach((q, k) => { for (let j = 0; j < 6; j++) fine.push([pts[k][0] + ((q[0] - pts[k][0]) * j) / 6, pts[k][1] + ((q[1] - pts[k][1]) * j) / 6]); });
    fine.push(pts[pts.length - 1]);
    const sm = fine.map((q, k) => (k === 0 || k === fine.length - 1 ? q : ([(fine[k - 1][0] + 2 * q[0] + fine[k + 1][0]) / 4, (fine[k - 1][1] + 2 * q[1] + fine[k + 1][1]) / 4] as Pt)));
    hardFill(p, seed + i * 4 + 2, KEY, ribbon(sm, w * 1.55));
    hardFill(p, seed + i * 4 + 3, color, ribbon(sm, w));
  });
};

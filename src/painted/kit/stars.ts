import {ell, hardFill, washAt} from './draw';
import {hash} from './hash';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, type YCam} from './ycam';

// ENV-STARS (kit promotion on its second use, EDU-EP16 brief N8; Boss W5.2, 2026-11-15): a verbatim copy of src/painted/edu07/stars.ts (EDU-EP07 W3 first
// use; EP07 keeps its own copy so its pinned scenes do not repaint). Same seeds and output, so an episode that switches its import paints the same pixels.
// ENV-STARS candidate (brief N3, EDU-EP07 W3 first use): star dots at infinity on a nebula wash, deterministic from a seed. Directions are
// fixed on the sphere, so a yaw/pitch move slides the whole field (no parallax), twinkle is a slow per-star level. `alpha` fades the field in
// (night street) and `above` keeps stars over the horizon only. Colours are arguments; the episode owns the palette.

const dirOf = (i: number, seed: number, upper: boolean): V3 => {
  const az = hash(i * 3.1 + seed) * Math.PI * 2, s = hash(i * 7.7 + seed + 1) * 2 - 1;
  const y = upper ? Math.abs(s) * 0.98 + 0.02 : s, r = Math.sqrt(1 - y * y);
  return [r * Math.sin(az), y, -r * Math.cos(az)];
};

export type StarOpts = {seed?: number; count?: number; alpha?: number; t?: number; upper?: boolean; color?: string; rect?: [number, number, number, number]; big?: number; /** Cool and warm star tints and a few more glints (W5.3 G4); off by default so earlier shots keep their stars. */ varied?: boolean};

/** Star dots: `alpha` 0..1 scales brightness by mixing toward `bg`; `rect` keeps stars inside a panel. */
export const paintStars = (p: Painter, c: YCam, bg: string, o: StarOpts = {}) => {
  const seed = o.seed ?? 11, n = o.count ?? 220, a = o.alpha ?? 1, col = o.color ?? '#fff6e0', R = 1000;
  const [x0, y0, x1, y1] = o.rect ?? [0, 0, 1080, 1920];
  for (let i = 0; i < n; i++) {
    const d = dirOf(i, seed, !!o.upper), v: V3 = [c.x + d[0] * R, c.y + d[1] * R, c.z + d[2] * R];
    const q = camPoint(c, v);
    if (!q || q[0] < x0 + 4 || q[0] > x1 - 4 || q[1] < y0 + 4 || q[1] > y1 - 4) continue;
    const big = hash(i * 1.9 + seed) < (o.big ?? 0.08), tw = 0.75 + 0.25 * Math.sin((o.t ?? 0) * (1.1 + hash(i) * 1.8) + i * 2.1);
    const lvl = a * (big ? 1 : 0.55 + 0.45 * hash(i * 5.3 + seed)) * tw, r = big ? 3.4 : 1.4 + hash(i * 2.3) * 1.2;
    const tint = o.varied ? ['#cfe0ff', '#fff6e0', '#ffd9b0', '#e6d8ff'][Math.floor(hash(i * 9.1 + seed) * 4)] : col, sc = mixColor(bg, tint, Math.min(1, lvl));
    hardFill(p, 9000 + i, sc, ell(q[0], q[1], r, r, 8));
    if (o.varied && !big && hash(i * 4.4 + seed) < 0.12 && lvl > 0.4) hardFill(p, 9200 + i, mixColor(bg, tint, lvl * 0.3), ell(q[0], q[1], r * 2.4, r * 2.4, 8)); // soft halo
    if (big && lvl > 0.5) { // four-point glint
      hardFill(p, 9400 + i, mixColor(bg, tint, lvl * 0.7), [[q[0] - 9, q[1]], [q[0], q[1] - 1.1], [q[0] + 9, q[1]], [q[0], q[1] + 1.1]]);
      hardFill(p, 9600 + i, mixColor(bg, tint, lvl * 0.7), [[q[0] - 1.1, q[1]], [q[0], q[1] - 9], [q[0] + 1.1, q[1]], [q[0], q[1] + 9]]);
    }
  }
};

/** A faint nebula / Milky Way wash: soft blobs along a band (screen space), kept inside `rect`. */
export const paintNebula = (p: Painter, rect: [number, number, number, number], cols: [string, string], level = 1) => {
  const [x0, y0, x1, y1] = rect, w = x1 - x0, h = y1 - y0;
  const blobs: [number, number, number, number, number][] = [[0.28, 0.32, 0.42, 0.22, 0], [0.74, 0.62, 0.38, 0.2, 1], [0.5, 0.82, 0.5, 0.16, 0], [0.18, 0.78, 0.3, 0.14, 1], [0.84, 0.2, 0.3, 0.14, 0]];
  blobs.forEach(([bx, by, rx, ry, k], i) => {
    const pts: Pt[] = Array.from({length: 18}, (_, j) => { const a = (j / 18) * Math.PI * 2, wob = 1 + 0.18 * Math.sin(a * 3 + i * 1.7); return [x0 + w * bx + Math.cos(a) * rx * w * wob, y0 + h * by + Math.sin(a) * ry * h * wob]; });
    washAt(p, 8800 + i, cols[k], 70 * level, pts, 0.5, 0.35);
  });
};

import {ell, hardFill, inkLine, washAt} from './draw';
import {hash} from './hash';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

// N7 anchors, chains, furrows, sand plumes and a bottom trawl (EDU-EP17 brief N7, Boss W5, 2026-11-15). World metres on the kit yaw camera (`ycam`):
// each draw takes world points and projects them, so the camera's parallax and the scale with the set hold. Reusable (kit): an episode passes
// colours and positions; nothing here knows a shot. Readability target: an anchor reads as an anchor at 120 px (ring, stock, shank, curved arms
// with flukes: the shape everyone knows), a furrow is one continuous trench.

export type AnchorStyle = {steel?: string; hi?: string; rust?: string};
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const unit = (v: V3): V3 => { const n = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / n, v[1] / n, v[2] / n]; };

/**
 * A boat anchor (admiralty shape) `size` m long: crown at `crown`, shank along `shank` (toward the ring), arms and flukes spread along `side`
 * (perpendicular to the shank). Returns the ring point (chain attach) in world metres and its picture point.
 */
export const paintAnchor = (p: Painter, c: YCam, seed: number, crown: V3, shank: V3, side: V3, size = 0.6, o: AnchorStyle & {ship?: boolean} = {}) => {
  const s = unit(shank), d = unit(side), L = size, steel = o.steel ?? '#4a4e52', hi = o.hi ?? '#8a9094', rust = o.rust ?? '#7a4a32';
  const W = (u: number, v: number): V3 => add(add(crown, s, u * L), d, v * L);
  const P = (u: number, v: number) => camPoint(c, W(u, v));
  const k = camUnit(c, crown), lw = Math.max(1.6, (o.ship ? 0.09 : 0.05) * L * k);
  const ring = W(1.0, 0), rq = P(1.0, 0);
  const sh = [P(0, 0), P(0.92, 0)], arm: Pt[] = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12), q = P(0.42 - 0.42 * Math.sin(a) * 0.95 + 0.02, -Math.cos(a) * 0.48); if (q) arm.push(q); }
  if (!sh[0] || !sh[1] || !rq || arm.length < 4) return {ring, ringPt: rq};
  // arms (a U from fluke to fluke through the crown), shank, stock bar near the ring (not on a stockless ship anchor), ring
  inkLine(p, seed, arm, {closed: false, color: steel, weight: lw * 1.15, still: true, curve: 0.5});
  inkLine(p, seed + 1, [sh[0], sh[1]], {closed: false, color: steel, weight: lw * 1.3, still: true, curve: 0});
  if (!o.ship) { const a = P(0.82, -0.3), b = P(0.82, 0.3); if (a && b) inkLine(p, seed + 2, [a, b], {closed: false, color: steel, weight: lw * 0.9, still: true, curve: 0}); }
  inkLine(p, seed + 3, ell(rq[0], rq[1], Math.max(2, 0.07 * L * k), Math.max(2, 0.07 * L * k), 12), {closed: true, color: steel, weight: lw * 0.6, still: true});
  // flukes: broad spade tips at both arm ends, pointing back up toward the shank
  [-1, 1].forEach((sg, i) => {
    const tip = P(0.42 + 0.02, sg * 0.48), b0 = P(0.22, sg * 0.36), b1 = P(0.30, sg * 0.56), up = P(0.58, sg * 0.5);
    if (tip && b0 && b1 && up) hardFill(p, seed + 4 + i, steel, [b0, b1, up, tip]);
  });
  // a lit edge and rust at the crown
  inkLine(p, seed + 7, [P(0.05, 0) ?? sh[0], P(0.85, 0) ?? sh[1]], {closed: false, color: hi, weight: Math.max(0.6, lw * 0.3), still: true, curve: 0});
  const cq = P(0.03, 0);
  if (cq) hardFill(p, seed + 8, mixColor(steel, rust, 0.6), ell(cq[0], cq[1], lw * 0.9, lw * 0.7, 8));
  return {ring, ringPt: rq};
};

/** Chain from `a` to `b` (world), sagging `sag` m at mid-span (0 = taut), links `link` m long, alternating face-on and edge-on. */
export const paintChain = (p: Painter, c: YCam, seed: number, a: V3, b: V3, o: {sag?: number; link?: number; color?: string; hi?: string} = {}) => {
  const link = o.link ?? 0.06, len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(2, Math.min(220, Math.round(len / link))), sag = o.sag ?? 0;
  const col = o.color ?? '#55595c', hi = o.hi ?? '#8a8f92';
  const at = (u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - sag * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u];
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const q = camPoint(c, at(i / n)); if (q) pts.push(q); }
  if (pts.length < 2) return;
  const k = camUnit(c, at(0.5)), px = link * k;
  if (px < 5) { inkLine(p, seed, pts, {closed: false, color: col, weight: Math.max(1, link * 0.35 * k), still: true, curve: 0.3}); return; }
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], mx = (x0 + x1) / 2, my = (y0 + y1) / 2, ang = Math.atan2(y1 - y0, x1 - x0), l = Math.hypot(x1 - x0, y1 - y0) * 0.62;
    const w = i % 2 ? l * 0.22 : l * 0.55;
    inkLine(p, seed + 1 + (i % 400), ell(mx, my, l, w, 10, ang), {closed: true, color: i % 2 ? hi : col, weight: Math.max(1, l * 0.28), still: true});
  }
};

/** Furrow ploughed along `path` (world points on the bed, in drag order) up to fraction `u`: a dark trench with pale raised lips, `w` m wide. */
export const paintFurrow = (p: Painter, c: YCam, seed: number, path: V3[], u: number, o: {w?: number; floor?: string; lip?: string} = {}) => {
  if (u <= 0 || path.length < 2) return;
  const w = o.w ?? 0.25, floor = o.floor ?? '#6a665a', lip = o.lip ?? '#b8ab88';
  const n = path.length - 1, m = Math.max(2, Math.ceil(n * u * 6));
  const at = (t: number): V3 => { const x = Math.min(n - 1e-6, t * n), i = Math.floor(x), f = x - i; return [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f, path[i][2] + (path[i + 1][2] - path[i][2]) * f]; };
  const side = (t: number, s: number, h: number): Pt | null => {
    const a = at(Math.max(0, t - 0.01)), b = at(Math.min(1, t + 0.01)), dx = b[0] - a[0], dz = b[2] - a[2], nn = Math.hypot(dx, dz) || 1, v = at(t);
    return camPoint(c, [v[0] - (dz / nn) * s * w, v[1] + h, v[2] + (dx / nn) * s * w]);
  };
  const band = (s0: number, s1: number, h0: number, h1: number, col: string, sd: number) => {
    const L: Pt[] = [], R: Pt[] = [];
    for (let i = 0; i <= m; i++) { const t = (u * i) / m, a = side(t, s0, h0), b = side(t, s1, h1); if (a && b) { L.push(a); R.push(b); } }
    if (L.length > 1) hardFill(p, sd, col, [...L, ...R.reverse()]);
  };
  band(-1.6, -0.55, 0.01, 0.05, lip, seed);
  band(1.6, 0.55, 0.01, 0.05, lip, seed + 1);
  band(-0.6, 0.6, 0.004, 0.004, floor, seed + 2);
  band(-0.2, 0.25, 0.006, 0.006, mixColor(floor, '#000000', 0.18), seed + 3);
};

/** A sand plume / puff at `at` (world), `u` 0..1 over its life: soft clouds rising and spreading, fading out. */
export const paintPlume = (p: Painter, c: YCam, seed: number, at: V3, u: number, o: {size?: number; col?: string} = {}) => {
  if (u <= 0 || u >= 1) return;
  const sz = o.size ?? 0.5, col = o.col ?? '#c8b98e', k = camUnit(c, at);
  for (let i = 0; i < 7; i++) {
    const v: V3 = [at[0] + (hash(seed + i) - 0.5) * sz * (0.4 + u), at[1] + sz * (0.15 + 0.6 * u * hash(seed + 10 + i)), at[2] + (hash(seed + 20 + i) - 0.5) * sz * 0.5], q = camPoint(c, v);
    if (!q) continue;
    const r = sz * (0.2 + 0.5 * u) * (0.6 + 0.6 * hash(seed + 30 + i)) * k;
    washAt(p, seed + 40 + i, col, 150 * (1 - u) ** 1.2, ell(q[0], q[1], r, r * 0.7, 14), 0.25, 0);
  }
};

/**
 * A bottom trawl seen passing: an otter board (a tilted door, steel-shod) at `board` and the net bag dragging behind it along -`dir`, its mouth
 * held open on the bed; `wood`/`net` colours. Lengths in metres; the board is about 1.6 x 0.8 m.
 */
export const paintTrawl = (p: Painter, c: YCam, seed: number, board: V3, dir: V3, o: {wood?: string; steel?: string; net?: string; bag?: number} = {}) => {
  const f = unit([dir[0], 0, dir[2]]), sd: V3 = [-f[2], 0, f[0]], wood = o.wood ?? '#6a4a30', steel = o.steel ?? '#4a4e52', net = o.net ?? '#c9b98a', bagL = o.bag ?? 5;
  const B = (u: number, h: number): V3 => [board[0] + f[0] * u * 0.8, board[1] + h, board[2] + f[2] * u * 0.8];
  const q = [B(-1, 0), B(1, 0), B(0.8, 0.85), B(-1.1, 0.8)].map((v) => camPoint(c, v));
  if (q.every(Boolean)) {
    hardFill(p, seed, wood, q as Pt[]);
    inkLine(p, seed + 1, [q[0]!, q[1]!], {closed: false, color: steel, weight: Math.max(1.4, 0.08 * camUnit(c, board)), still: true, curve: 0});
    [0.3, 0.55].forEach((h, i) => { const a = camPoint(c, B(-1, h)), b = camPoint(c, B(0.95, h)); if (a && b) inkLine(p, seed + 2 + i, [a, b], {closed: false, color: mixColor(wood, '#000000', 0.25), weight: 1, still: true, curve: 0}); });
  }
  // warp up off frame and the bridle to the net mouth; the net bag tapering behind on the bed
  const mouth = add(board, f, -1.2), top = add(mouth, sd, 0.0);
  const ring: V3[] = Array.from({length: 13}, (_, i) => { const a = (i / 12) * Math.PI; return [top[0] + sd[0] * Math.cos(a) * 1.4, top[1] + Math.sin(a) * 0.8, top[2] + sd[2] * Math.cos(a) * 1.4]; });
  const tail = add(mouth, f, -bagL);
  const rq = ring.map((v) => camPoint(c, v)).filter(Boolean) as Pt[], tq = camPoint(c, [tail[0], tail[1] + 0.25, tail[2]]), bq = camPoint(c, add(board, [0, 0.4, 0]));
  if (rq.length > 3 && tq) {
    hardFill(p, seed + 5, mixColor(net, '#3a4a50', 0.35), [...rq, tq]);
    for (let i = 0; i < rq.length; i += 2) inkLine(p, seed + 6 + i, [rq[i], tq], {closed: false, color: net, weight: 0.8, still: false, curve: 0.2});
    for (let j = 1; j < 4; j++) { const s = j / 4; inkLine(p, seed + 30 + j, rq.map(([x, y]) => [x + (tq[0] - x) * s, y + (tq[1] - y) * s] as Pt), {closed: false, color: net, weight: 0.7, still: true, curve: 0.4}); }
    if (bq) inkLine(p, seed + 40, [bq, rq[0]], {closed: false, color: steel, weight: 1, still: true, curve: 0});
  }
};

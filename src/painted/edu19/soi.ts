import type {Brush} from '../BrushCanvas';
import {ell, INK, inkLine, solid, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, qy, qz, wFill, wp, type Box} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {YOU} from './cast';

// EDU-EP19 L03b soi inset (brief N8, VD07; B01-SH05): a soi at dusk in its own space `S` (metres, origin at the walker's start, +x toward the
// stall, +z screen right when looking +x), drawn inside the vignette circle `V` (centre (540, 760), 820 px across). Cooler evening palette with
// one warm stall bulb. `clipPainter` is the in-canvas mask (one canvas per page): every polygon is clipped to the circle and every ink line
// keeps only its inside runs, so the same mask serves the iris-in / iris-out (sheet B01-SH04 -> SH05 -> SH06) by growing `r`.

export const VIG = {cx: 540, cy: 760, r: 410, ring: 10, dim: 0.45} as const;
export const SOI = {stall: [6.0, 0, 1.55] as V3, wok: [5.75, 0.98, 1.3] as V3, bulb: [6.0, 2.15, 1.55] as V3, facadeZ: 3.2, road: 2.5} as const;

/** Sutherland-Hodgman clip of a polygon to a convex polygon (counter-clockwise or clockwise; `cw` sign handles both). */
const clipConvex = (pts: Pt[], clip: Pt[]): Pt[] => {
  let out = pts;
  const n = clip.length, sgn = Math.sign((clip[1][0] - clip[0][0]) * (clip[2][1] - clip[0][1]) - (clip[1][1] - clip[0][1]) * (clip[2][0] - clip[0][0])) || 1;
  for (let i = 0; i < n && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % n], inside = (q: Pt) => sgn * ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) >= 0;
    const src = out; out = [];
    for (let k = 0; k < src.length; k++) {
      const p = src[k], q = src[(k + 1) % src.length], ip = inside(p), iq = inside(q);
      if (ip) out.push(p);
      if (ip !== iq) {
        const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]), d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]), k2 = d1 / (d1 - d2);
        out.push([p[0] + (q[0] - p[0]) * k2, p[1] + (q[1] - p[1]) * k2]);
      }
    }
  }
  return out;
};
/** A painter whose marks stay inside the circle (cx, cy, r): polygons clipped, ink splines cut to their inside runs. */
export const clipPainter = (p: Painter, cx: number, cy: number, r: number): Painter => {
  const circle: Pt[] = Array.from({length: 72}, (_, i) => [cx + r * Math.cos((i / 72) * 6.283), cy + r * Math.sin((i / 72) * 6.283)]);
  const raw = p.brush as unknown as Record<string | symbol, unknown>;
  const brush = new Proxy(raw, {get: (t, k) => {
    const v = Reflect.get(t, k, t);
    if (typeof v !== 'function') return v;
    if (k === 'polygon') return (pts: Pt[]) => { const q = clipConvex(pts, circle); if (q.length >= 3) v.call(t, q); };
    if (k === 'spline') return (pts: Pt[], curv?: number) => {
      let run: Pt[] = [];
      const flush = () => { if (run.length >= 2) v.call(t, run, curv); run = []; };
      for (const q of pts) { if (Math.hypot(q[0] - cx, q[1] - cy) <= r) run.push(q); else flush(); }
      flush();
    };
    return v.bind(t);
  }}) as unknown as Brush;
  // Painter.wash / flat draw through makePainter's own brush, so they are clipped here too.
  const q: Painter = {...p, brush, layer: (a, base) => clipPainter(p.layer(a, base), cx, cy, r),
    wash: (col, op, pts, bleed, tex) => { const k = clipConvex(pts, circle); if (k.length >= 3) p.wash(col, op, k, bleed, tex); },
    flat: (col, pts) => { const k = clipConvex(pts, circle); if (k.length >= 3) p.flat(col, k); }};
  return q;
};

// ------------------------------------------------------------------------------------------------ the soi (space S)
const K = {skyTop: '#2f3f66', skyVia: '#6a5f86', skyLow: '#d99a7a', road: '#3e4250', kerb: '#6a6e78', walk: '#585b66', wall: ['#8c8fa3', '#9a8c96', '#7f8a96', '#a09486'], shutter: '#6e7280', glow: '#f2b45a', ink: '#23202a'};
const bay = (p: Painter, c: YCam, seed: number, x0: number, side: number) => {
  const z = side * SOI.facadeZ, w = 4, col = K.wall[Math.floor(hash(seed) * 4)], x1 = x0 + w, H = 9 + Math.round(hash(seed + 1) * 2) * 1.2;
  wFill(p, c, seed, col, qz(z, x0, x1, 0, H));
  const lit = hash(seed + 2) > 0.45;
  // Ground floor: shutter or an open warm shopfront; a blank sign panel over it (no text); upper floors: two windows, a balcony rail, an AC box.
  wFill(p, c, seed + 1, lit ? mixColor(K.glow, '#a0603a', 0.35) : K.shutter, qz(z - side * 0.01, x0 + 0.3, x1 - 0.3, 0, 2.6));
  if (!lit) for (let y = 0.3; y < 2.6; y += 0.25) { const a = camPoint(c, [x0 + 0.3, y, z - side * 0.02]), b = camPoint(c, [x1 - 0.3, y, z - side * 0.02]); if (a && b) inkLine(p, seed + 10 + y * 10, [a, b], {closed: false, weight: 0.35, color: mixColor(K.shutter, K.ink, 0.4), still: true}); }
  wFill(p, c, seed + 2, ['#b5523e', '#3e6f8a', '#d0a640', '#5a7a4e'][Math.floor(hash(seed + 3) * 4)], qz(z - side * 0.02, x0 + 0.4, x1 - 0.4, 2.8, 3.4));
  for (const fl of [4.2, 7.2]) if (fl + 1.6 < H) {
    for (const wx of [0.6, 2.3]) wFill(p, c, seed + 3 + fl + wx, hash(seed + fl * 3 + wx) > 0.6 ? mixColor(K.glow, '#7a6a5a', 0.4) : '#3c4256', qz(z - side * 0.01, x0 + wx, x0 + wx + 1.1, fl, fl + 1.5));
    const rail = wp(c, qz(z - side * 0.6, x0 + 0.2, x1 - 0.2, fl - 0.2, fl + 0.25));
    if (rail.length >= 3) washAt(p, seed + 6 + fl, '#4a4d5c', 150, rail, 0.05, 0.2);
    if (hash(seed + fl) > 0.4) paintBox(p, c, seed + 8 + fl, {x0: x0 + 2.5, x1: x0 + 3.2, y0: fl + 1.65, y1: fl + 2.05, z0: Math.min(z, z - side * 0.35), z1: Math.max(z, z - side * 0.35)}, '#c9c9c4', {}, {});
  }
  const edge = wp(c, qz(z - side * 0.01, x1 - 0.12, x1, 0, H));
  if (edge.length >= 3) solid(p, seed + 9, mixColor(col, K.ink, 0.25), edge, 2, 0.03, 0.05);
};
/** Stall: a stainless cart with a glass case, a red tarp roof on poles, a bulb, a wok on a burner, two plastic stools. */
const paintStall = (p: Painter, c: YCam) => {
  const [x, , z] = SOI.stall, cart: Box = {x0: x - 0.7, x1: x + 0.7, y0: 0.15, y1: 0.95, z0: z - 0.35, z1: z + 0.35};
  paintBox(p, c, 6400, {x0: x - 1.2, x1: x + 1.2, y0: 2.3, y1: 2.38, z0: z - 1.0, z1: z + 1.0}, '#b8483a', {bottom: 0.35}, {});
  for (const dx of [-1.1, 1.1]) for (const dz of [-0.9, 0.9]) paintBox(p, c, 6410 + dx * 10 + dz * 3, {x0: x + dx - 0.02, x1: x + dx + 0.02, y0: 0, y1: 2.3, z0: z + dz - 0.02, z1: z + dz + 0.02}, '#9a9ca2', {}, {});
  paintBox(p, c, 6430, cart, '#b9bcc2', {front: 0.05, left: 0.12}, {ink: true});
  paintBox(p, c, 6440, {x0: x - 0.6, x1: x + 0.2, y0: 0.95, y1: 1.35, z0: z - 0.3, z1: z + 0.3}, '#d6e2e4', {left: 0.05}, {ink: true});
  const wok = camPoint(c, SOI.wok), u = camUnit(c, SOI.wok);
  if (wok) {
    solid(p, 6450, '#e07a2a', ell(wok[0], wok[1] + 0.05 * u, 0.12 * u, 0.04 * u, 12), 2, 0.03, 0.05);
    solid(p, 6451, '#262428', [[wok[0] - 0.2 * u, wok[1]], [wok[0] + 0.2 * u, wok[1]], [wok[0] + 0.12 * u, wok[1] + 0.08 * u], [wok[0] - 0.12 * u, wok[1] + 0.08 * u]], 3, 0.03, 0.05);
    inkLine(p, 6452, [[wok[0] + 0.2 * u, wok[1]], [wok[0] + 0.38 * u, wok[1] - 0.04 * u]], {closed: false, weight: 0.9, color: '#262428'});
  }
  for (const [sx, sz, col] of [[x - 1.4, z - 0.5, '#d8473a'], [x - 1.5, z + 0.4, '#3a74b8']] as const) paintBox(p, c, 6460 + sx * 3, {x0: sx - 0.15, x1: sx + 0.15, y0: 0, y1: 0.42, z0: sz - 0.15, z1: sz + 0.15}, col, {}, {});
  const b = camPoint(c, SOI.bulb);
  if (b) solid(p, 6470, '#fff0c0', ell(b[0], b[1], Math.max(2, 0.06 * camUnit(c, SOI.bulb)), Math.max(2, 0.07 * camUnit(c, SOI.bulb)), 10), 3, 0.02, 0.05);
};
/** The soi at dusk seen through camera `c` (space S); `walk` the walker's x (m) and gait clock. */
export const paintSoi = (p: Painter, c: YCam, o: {t: number; walkX: number; sniff?: number}) => {
  paintSkyBands(p, {from: K.skyTop, to: K.skyLow, via: K.skyVia, viaAt: 0.5, horizon: c.hy + 4, width: 1080, bands: 8, top: 300});
  p.flat(K.road, [[100, c.hy], [980, c.hy], [980, 1200], [100, 1200]]);
  wFill(p, c, 6000, K.road, qy(0, -4, 60, -SOI.road, SOI.road));
  for (const s of [-1, 1]) {
    wFill(p, c, 6002 + s, K.walk, qy(0.12, -4, 60, s < 0 ? -SOI.facadeZ : SOI.road, s < 0 ? -SOI.road : SOI.facadeZ));
    wFill(p, c, 6004 + s, K.kerb, qz(s * SOI.road, -4, 60, 0, 0.12));
  }
  // Warm pool of the stall bulb on the road (the one warm light, UT04).
  const pool = wp(c, Array.from({length: 20}, (_, i): V3 => [SOI.stall[0] + 2.2 * Math.cos((i / 20) * 6.283), 0.005, SOI.stall[2] + 1.6 * Math.sin((i / 20) * 6.283)]));
  if (pool.length >= 3) washAt(p, 6010, K.glow, 90, pool, 0.2, 0.3);
  for (const side of [-1, 1]) for (let i = 9; i >= 0; i--) bay(p, c, 6100 + (side + 1) * 100 + i * 9, -4 + i * 4, side);
  // Overhead wires sagging across the soi.
  for (let i = 0; i < 5; i++) {
    const x = 3 + i * 6 + hash(i) * 2, pts: Pt[] = [];
    for (let k = 0; k <= 8; k++) { const z = -SOI.facadeZ + (k / 8) * 2 * SOI.facadeZ, q = camPoint(c, [x + (k / 8) * 1.5, 6.2 - 0.6 * Math.sin((k / 8) * Math.PI), z]); if (q) pts.push(q); }
    if (pts.length >= 2) inkLine(p, 6300 + i, pts, {closed: false, weight: 0.5, color: K.ink, curve: 0.3, still: true});
  }
  // Two parked motorbikes on the left walkway (dark silhouettes) and the stall.
  for (const mx of [9, 15]) { const q = wp(c, [[mx - 0.9, 0.12, -2.8], [mx + 0.9, 0.12, -2.8], [mx + 0.7, 1.0, -2.8], [mx - 0.3, 1.05, -2.8], [mx - 0.8, 0.7, -2.8]]); if (q.length >= 3) solid(p, 6350 + mx, '#2a2c36', q, 3, 0.03, 0.08); }
  paintStall(p, c);
  // YOU from behind, walking toward the stall (back view, walk on the gait clock), head lifting at the sniff.
  paintFigureAt(p, c, YOU, {at: [o.walkX, 0, 0], view: 'back', t: o.t, fig: {walk: o.t * 1.6, ...(o.sniff ? {nod: [0, 0.12 * o.sniff]} : {})}, shadow: {color: '#1e2028', op: 90}});
};

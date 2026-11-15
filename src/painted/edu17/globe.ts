import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import land from './land.json';
import {C} from './palette';

// N8 data globe (space G, unit sphere; brief "Set plans — globe"). W3 THUMBNAIL grade (Film, 2026-11-15): orthographic sphere in picture space
// (centre, radius px, facing lon/lat), Natural Earth 1:110m land (land.json, baked by scripts/edu-series/ep17/bake-land.py; public domain),
// 16 illustrative cable lines through sea waypoints (NOT real routes; nothing labelled), pulses, the warm dot at his yard.

/** `lat` is the NEGATED facing latitude: the globe turns so (lon, -lat) faces the viewer (`vec` rotates by -lat about x; Boss W5 finding). The W3
 *  look frame LF03 {lon 112, lat 10} therefore faces 10S, and the shots keep its numbers literally; a shot that must centre a point uses `facing`. */
export type GlobeView = {cx: number; cy: number; r: number; lon: number; lat: number};
/** View whose centre faces the point (lon, lat). */
export const facing = (cx: number, cy: number, r: number, lon: number, lat: number): GlobeView => ({cx, cy, r, lon, lat: -lat});
const D = Math.PI / 180;
/** Unit vector of lon/lat rotated so (view.lon, view.lat) faces the viewer: x right, y up, z toward the viewer. */
const vec = (v: GlobeView, lon: number, lat: number): [number, number, number] => {
  const l = (lon - v.lon) * D, p = lat * D, x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l);
  const c0 = Math.cos(-v.lat * D), s0 = Math.sin(-v.lat * D);
  return [x, y * c0 - z * s0, y * s0 + z * c0];
};
const pic = (v: GlobeView, q: [number, number, number]): Pt => [v.cx + v.r * q[0], v.cy - v.r * q[1]];

/** Front-side picture polygon of a lon/lat ring: far runs become limb arcs (shorter way) between the crossing points. */
const frontRing = (v: GlobeView, r: number[]): Pt[] => {
  const n = r.length / 2, q = Array.from({length: n}, (_, k) => vec(v, r[2 * k], r[2 * k + 1]));
  const s0 = q.findIndex((a) => a[2] > 0);
  if (s0 < 0) return [];
  const out: Pt[] = [];
  let exitAng: number | null = null;
  const cross = (a: number[], b: number[]) => { const t = a[2] / (a[2] - b[2]); const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; return Math.atan2(y, x); };
  const limb = (ang: number): Pt => [v.cx + v.r * Math.cos(ang), v.cy - v.r * Math.sin(ang)];
  for (let j = 0; j <= n; j++) {
    const a = q[(s0 + j - 1 + n) % n], b = q[(s0 + j) % n];
    if (j > 0 && a[2] > 0 && b[2] <= 0) { exitAng = cross(a, b); out.push(limb(exitAng)); }
    if (j > 0 && a[2] <= 0 && b[2] > 0 && exitAng !== null) {
      const ent = cross(a, b);
      let d = ent - exitAng; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI;
      const steps = Math.max(1, Math.ceil(Math.abs(d) / 0.08));
      for (let k = 1; k <= steps; k++) out.push(limb(exitAng + (d * k) / steps));
      exitAng = null;
    }
    if (b[2] > 0 && j < n) out.push(pic(v, b));
  }
  return out;
};

/** Sea waypoints of the illustrative lines (lon, lat). L1 leaves his yard. */
const LINES: [number, number][][] = [
  [[100.9, 12.6], [101.5, 9], [103.5, 5], [104.2, 1.2]], // L1 yard -> south
  [[104.2, 1.2], [99, 4.5], [94, 6], [86, 6], [80.5, 5.6], [73, 9], [62, 13], [51, 12.5], [43.5, 12.3], [38.5, 19], [33.5, 28], [32.4, 31.5], [25, 34], [15, 37], [5.4, 42.8]], // L2 Asia-Europe
  [[104.2, 1.2], [107, -2], [110, -6], [114, -9], [116, -20], [114.5, -30], [115.6, -32.2]], // L3 to Perth
  [[104.2, 1.2], [108, 6], [112, 12], [114.2, 21.5]], // L4 to Hong Kong
  [[114.2, 21.5], [120, 24], [126, 29], [134, 32.5], [139.8, 34.8]], // L5 to Japan
  [[139.8, 34.8], [150, 34], [165, 32], [180, 30], [-165, 26], [-158, 21.3]], // L6 Pacific west
  [[-158, 21.3], [-145, 28], [-132, 34], [-122.6, 37.6]], // L7 Pacific east
  [[114.2, 21.5], [118, 18], [120.6, 14.5]], // L8 to Manila
  [[120.6, 14.5], [130, 14], [140, 14], [144.7, 13.4]], // L9 to Guam
  [[144.7, 13.4], [152, 0], [156, -15], [153, -27], [151.3, -33.8]], // L10 Guam -> Sydney
  [[104.2, 1.2], [106.8, -5.9]], // L11 Jakarta
  [[80.5, 5.6], [80.3, 13.1]], // L12 India east coast
  [[73, 9], [72.8, 18.9]], // L13 Mumbai
  [[51, 12.5], [56, 22], [56.5, 25.5]], // L14 Gulf
  [[43.5, 12.3], [48, 5], [42, -5], [39.6, -4.1]], // L15 East Africa
  [[100.9, 12.6], [104.5, 10.2], [107, 11], [109, 13], [112, 18], [114.2, 21.5]], // L16 yard -> north
];
export const YARD_LONLAT: [number, number] = [100.9, 12.6];

/** Great-circle samples between two lon/lat points (slerp). */
const arc = (a: [number, number], b: [number, number], n = 8): [number, number][] => {
  const toV = ([lo, la]: [number, number]) => [Math.cos(la * D) * Math.cos(lo * D), Math.cos(la * D) * Math.sin(lo * D), Math.sin(la * D)];
  const A = toV(a), B = toV(b), dot = Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])), w = Math.acos(dot) || 1e-6;
  return Array.from({length: n + 1}, (_, i) => {
    const t = i / n, k0 = Math.sin((1 - t) * w) / Math.sin(w), k1 = Math.sin(t * w) / Math.sin(w);
    const x = A[0] * k0 + B[0] * k1, y = A[1] * k0 + B[1] * k1, z = A[2] * k0 + B[2] * k1;
    return [Math.atan2(y, x) / D, Math.asin(z / Math.hypot(x, y, z)) / D];
  });
};
const linePath = (wp: [number, number][]) => wp.slice(1).flatMap((b, i) => arc(wp[i], b).slice(i ? 1 : 0));

/** Picture point of a lon/lat on the globe, or null on the far side. */
export const globeXY = (v: GlobeView, lon: number, lat: number): Pt | null => { const q = vec(v, lon, lat); return q[2] > 0.02 ? pic(v, q) : null; };
/** Great-circle samples of code line `i` (0-based: L16 = 15) as lon/lat. */
export const lineLonLat = (i: number) => linePath(LINES[i]);
/** Great-circle angle (deg) between two lon/lat points. */
export const angDeg = (a: [number, number], b: [number, number]) => {
  const A = [Math.cos(a[1] * D) * Math.cos(a[0] * D), Math.cos(a[1] * D) * Math.sin(a[0] * D), Math.sin(a[1] * D)], B = [Math.cos(b[1] * D) * Math.cos(b[0] * D), Math.cos(b[1] * D) * Math.sin(b[0] * D), Math.sin(b[1] * D)];
  return Math.acos(Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]))) / D;
};

/** Globe motion (Boss W5, all optional; with none set the picture is the W3 look frame LF03 unchanged). */
export type GlobeOpts = {lit?: number; t?: number; stars?: boolean; lines?: boolean;
  /** B01-SH04 ripple: only line points within `reveal` deg (great circle) of the yard dot are lit. */
  reveal?: number;
  /** 0..1 size of the travelling pulses (B01-SH04 pulses grow in). */
  pulse?: number;
  /** Lines (0-based) drawn without the travelling pulses. */
  noPulse?: number[];
  /** Grey out line `line` from sample `from` toward its end, fraction `u` 0..1 of that stretch (B06-SH02 L16). */
  dim?: {line: number; from: number; u: number};
  /** Red sparks: lon/lat and 0..1 strength. */
  sparks?: {at: [number, number]; a: number}[];
  /** One extra bright pulse (the B06-SH02 reroute rider) at lon/lat. */
  rider?: [number, number];
  /** 0..1 white flash on the yard dot (B01-SH04 arrival of the B01-SH03 pulse). */
  dotFlash?: number;
};
export const paintGlobe = (p: Painter, v: GlobeView, o: GlobeOpts = {}) => {
  // background: radial bands, sparse faint stars
  for (let i = 0; i < 9; i++) {
    const rr = 1500 - i * 150;
    hardFill(p, 6000 + i, mixColor(C.space0, C.space1, i / 8), ell(v.cx, v.cy, rr, rr, 40));
  }
  if (o.stars !== false) for (let i = 0; i < 70; i++) {
    const x = ((i * 0.618) % 1) * 1080, y = ((i * 0.377) % 1) * 1920;
    if (Math.hypot(x - v.cx, y - v.cy) < v.r * 1.08) continue;
    hardFill(p, 6020 + i, mixColor('#cfe0ff', C.space1, 0.3 + ((i * 0.53) % 1) * 0.5), ell(x, y, 1.6, 1.6, 6));
  }
  // halo and ocean disc with a lighter limb
  [1.12, 1.07, 1.035].forEach((k, i) => washAt(p, 6100 + i, C.halo, 40 + i * 20, ell(v.cx, v.cy, v.r * k, v.r * k, 60), 0.1, 0));
  hardFill(p, 6110, C.globeLimb, ell(v.cx, v.cy, v.r, v.r, 72));
  [0.97, 0.9, 0.8].forEach((k, i) => hardFill(p, 6111 + i, mixColor(C.globeLimb, C.globeSea, 0.4 + i * 0.3), ell(v.cx - v.r * 0.03 * i, v.cy - v.r * 0.03 * i, v.r * k, v.r * k, 72)));
  // land: each ring's far-side runs are replaced by an arc along the limb between the exit and entry points (no chords: DF map-land-clip-closure)
  (land.rings as number[][]).forEach((r, i) => {
    const pts = frontRing(v, r);
    if (pts.length >= 3) hardFill(p, 6200 + i, C.land, pts);
  });
  (land.rings as number[][]).forEach((r, i) => {
    const run: Pt[] = [];
    const flush = (j: number) => { if (run.length >= 2) inkLine(p, 6400 + ((i * 7 + j) % 400), run.splice(0), {closed: false, color: C.coast, weight: 0.6, still: true, curve: 0}); else run.length = 0; };
    for (let k = 0; k <= r.length; k += 2) {
      const kk = k % r.length, q = vec(v, r[kk], r[kk + 1]);
      if (q[2] <= 0.02) { flush(k); continue; }
      const pt = pic(v, q), last = run[run.length - 1];
      if (last && Math.hypot(pt[0] - last[0], pt[1] - last[1]) > v.r * 0.2) flush(k + 1); // a jump is a ring seam, not a coast (DF map-land-clip-closure)
      run.push(pt);
    }
    flush(9999);
  });
  // cable lines: glow halo + bright core on the front side, pulses; Boss W5 motion: ripple reveal, grey dimmed stretch, sparks, rider
  const lit = o.lit ?? 1, t = o.t ?? 0.4, pk = o.pulse ?? 1;
  if (o.lines !== false) LINES.forEach((wp, li) => {
    const path = linePath(wp), front = path.map(([lo, la]) => vec(v, lo, la));
    const shown = (j: number) => front[j][2] > 0.03 && (o.reveal === undefined || angDeg(YARD_LONLAT, path[j]) <= o.reveal);
    const dimAt = (j: number) => !!o.dim && o.dim.line === li && j >= o.dim.from && j <= o.dim.from + o.dim.u * (path.length - 1 - o.dim.from);
    let run: Pt[] = [], runDim = false;
    // seeds keyed by the sample index that ends the run (99 for the last run), as in the W3 look frame
    const draw = (j: number) => {
      if (run.length >= 2) {
        const k = j % 8;
        if (runDim) inkLine(p, 6800 + li * 8 + k, run, {closed: false, color: '#8a949c', weight: 1.7, still: true, curve: 0.3});
        else {
          inkLine(p, 6800 + li * 8 + k, run, {closed: false, color: mixColor(C.glow, C.globeSea, 0.55), weight: 2.4 * lit, still: true, curve: 0.3});
          inkLine(p, 6900 + li * 8 + k, run, {closed: false, color: mixColor(C.glow, C.core, 0.35), weight: 0.9 * lit, still: true, curve: 0.3});
        }
      }
      run = [];
    };
    front.forEach((q, j) => {
      if (!shown(j)) { draw(j); return; }
      const d = dimAt(j);
      if (run.length && d !== runDim) { const last = run[run.length - 1]; draw(j + 50); run.push(last); }
      runDim = d; run.push(pic(v, q));
    });
    draw(99);
    if (pk <= 0 || o.noPulse?.includes(li)) return;
    for (let k = 0; k < 3; k++) {
      const u = ((k / 3 + t * 0.25 + li * 0.13) % 1) * (path.length - 1), j = Math.floor(u), q = front[j];
      if (!q || q[2] < 0.05 || !shown(j) || dimAt(j)) continue;
      const [x, y] = pic(v, q);
      washAt(p, 7100 + li * 4 + k, C.glow, 150 * lit, ell(x, y, 9 * pk, 9 * pk, 10), 0.1, 0);
      hardFill(p, 7200 + li * 4 + k, C.core, ell(x, y, 3.5 * pk, 3.5 * pk, 8));
    }
  });
  (o.sparks ?? []).forEach((s, i) => {
    const q = s.a > 0 ? globeXY(v, s.at[0], s.at[1]) : null;
    if (!q) return;
    const [x, y] = q, r = 8 + 18 * s.a;
    washAt(p, 7400 + i * 12, '#ff3b2a', 90 * s.a, ell(x, y, r * 0.9, r * 0.9, 14), 0.1, 0);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + i * 0.7, r0 = r * 0.25, r1 = r * (k % 2 ? 0.75 : 1.25); inkLine(p, 7401 + i * 12 + (k % 7), [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], {closed: false, color: k % 2 ? '#ffb070' : '#ff4a32', weight: 1.8, still: false, curve: 0}); }
    hardFill(p, 7408 + i * 12, '#fff0d8', ell(x, y, 2 + 3 * s.a, 2 + 3 * s.a, 8));
  });
  if (o.rider) {
    const q = globeXY(v, o.rider[0], o.rider[1]);
    if (q) { washAt(p, 7480, C.glow, 200, ell(q[0], q[1], 22, 22, 14), 0.1, 0); washAt(p, 7481, C.core, 150, ell(q[0], q[1], 11, 11, 12), 0.1, 0); hardFill(p, 7482, C.core, ell(q[0], q[1], 5.5, 5.5, 10)); }
  }
  // his yard: the warm dot
  const yd = vec(v, YARD_LONLAT[0], YARD_LONLAT[1]);
  if (yd[2] > 0) {
    const [x, y] = pic(v, yd);
    washAt(p, 7300, C.yardDot, 160, ell(x, y, 16, 16, 12), 0.1, 0); hardFill(p, 7301, C.yardDot, ell(x, y, 6, 6, 10));
    const fl = o.dotFlash ?? 0;
    if (fl > 0) { washAt(p, 7302, C.glow, 220 * fl, ell(x, y, 34 * fl + 10, 34 * fl + 10, 14), 0.1, 0); hardFill(p, 7303, C.core, ell(x, y, 4 + 6 * fl, 4 + 6 * fl, 10)); }
  }
};

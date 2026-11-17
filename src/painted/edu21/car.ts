import type {Brush} from '../BrushCanvas';
import {clipConvex} from '../kit/clip-circle';
import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {mix3, sub3, type V3} from '../kit/space';
import {hull, wp} from '../kit/world';
import {camPoint, type YBody, type YCam} from '../kit/ycam';
import {TONE_LIVE, type Tone} from './road';

// CAR21 (EDU-EP21-BRIEF-R1 VD03, brief N1 `new: compact hard-top sedan (generic, metallic red)`), Film W3.1 look-frame build 2026-11-16:
// rough prototype in the production owner module for the look lock; Boss hardens it (docs/film-visual-brief-workflow.md#look-assets).
// World-metre build in space R through the shot's YCam: a convex lower body (side profile extruded across z) and a convex greenhouse
// (beltline ring to the roof ring, tumblehome inward), so back-face culling alone orders each part. No badge, brand or plate text.
// Every window is closed (truth limit 1). Sizes (estimates, revised from the brief for the four-head card): L 4.48, W 1.70, roof y 1.50,
// beltline y 0.92-0.96, wheels at x +-1.30, r 0.31, outer face z +-0.86.

export const CAR = {
  red: '#b8322c', shade: '#6e1f1c', wet: '#e8907a', spec: '#f2f4f6', trim: '#c9d0d6',
  glass: '#2a3440', tyre: '#1d1d1f', wall: '#2b2b2e', rim: '#8a9098',
  lining: '#3a3e46', seat: '#2f3238', dash: '#24272c', dashGlow: '#7fd6e8', inside: '#1c2128',
  zb: 0.85, wheelX: 1.3, wheelR: 0.31,
};

/** Lower-body side profile (x, y), counter-clockwise seen from +z; extruded across z +-0.85. */
export const PROF: [number, number][] = [[-2.12, 0.28], [2.1, 0.28], [2.22, 0.36], [2.27, 0.5], [2.26, 0.64], [2.18, 0.76], [1.98, 0.84], [1.05, 0.92], [-1.55, 0.96], [-2.08, 0.94], [-2.2, 0.86], [-2.25, 0.7], [-2.24, 0.42]];
/** Greenhouse corners: beltline front F / rear R (z +-0.80), roof front TF / rear TR (z +-0.64). */
const GH = {F: [1.05, 0.92] as const, R: [-1.55, 0.96] as const, TF: [0.4, 1.49] as const, TR: [-0.98, 1.49] as const, zb: 0.8, zt: 0.64};
const g3 = (k: 'F' | 'R' | 'TF' | 'TR', s: 1 | -1): V3 => [GH[k][0], GH[k][1], s * (k.startsWith('T') ? GH.zt : GH.zb)];

type Face = {pts: V3[]; n: V3; kind: string};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const centroid = (pts: V3[]): V3 => pts.reduce<V3>((s, v) => [s[0] + v[0] / pts.length, s[1] + v[1] / pts.length, s[2] + v[2] / pts.length], [0, 0, 0]);
const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const outward = (pts: V3[], center: V3): V3 => {
  const n = norm(cross(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])));
  return dot(n, sub3(centroid(pts), center)) >= 0 ? n : [-n[0], -n[1], -n[2]];
};
export const facing = (c: YCam, f: Face) => dot(f.n, sub3([c.x, c.y, c.z], centroid(f.pts))) > 0;

const BODY_C: V3 = [0, 0.6, 0];
/** The lower body's top face over the cabin (profile segment (1.05, 0.92) -> (-1.55, 0.96)): open, not metal. */
export const isBeltTop = (f: {pts: V3[]; kind: string}) => f.kind === 'top' && f.pts.some((v) => v[0] === 1.05) && f.pts.some((v) => v[0] === -1.55);
export const bodyFaces = (): Face[] => {
  const zb = CAR.zb, out: Face[] = [];
  out.push({pts: PROF.map(([x, y]) => [x, y, zb] as V3), n: [0, 0, 1], kind: 'side'});
  out.push({pts: PROF.map(([x, y]) => [x, y, -zb] as V3).reverse(), n: [0, 0, -1], kind: 'side'});
  PROF.forEach((a, i) => {
    const b = PROF[(i + 1) % PROF.length];
    const pts: V3[] = [[a[0], a[1], -zb], [b[0], b[1], -zb], [b[0], b[1], zb], [a[0], a[1], zb]];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    out.push({pts, n: [dy / l, -dx / l, 0], kind: dy / l < -0.5 ? 'bottom' : -dx / l > 0.6 ? 'top' : 'end'});
  });
  return out;
};
const GH_C: V3 = [-0.3, 1.2, 0];
export const greenhouseFaces = (): Face[] => {
  const f = (pts: V3[], kind: string): Face => ({pts, n: outward(pts, GH_C), kind});
  return [
    f([g3('F', -1), g3('F', 1), g3('TF', 1), g3('TF', -1)], 'windscreen'),
    f([g3('TF', -1), g3('TF', 1), g3('TR', 1), g3('TR', -1)], 'roof'),
    f([g3('TR', -1), g3('TR', 1), g3('R', 1), g3('R', -1)], 'rear'),
    f([g3('F', 1), g3('R', 1), g3('TR', 1), g3('TF', 1)], 'glassR'),
    f([g3('F', -1), g3('R', -1), g3('TR', -1), g3('TF', -1)], 'glassL'),
  ];
};

/** Point on a greenhouse face by face-local (s, v): side faces run s front->rear, v beltline->roof; front/rear faces s across z. */
export const ghPt = (kind: string, s: number, v: number): V3 => {
  if (kind === 'glassR' || kind === 'glassL') {
    const k = kind === 'glassR' ? 1 : -1;
    return mix3(mix3(g3('F', k), g3('R', k), s), mix3(g3('TF', k), g3('TR', k), s), v);
  }
  if (kind === 'windscreen') return mix3(mix3(g3('F', -1), g3('F', 1), s), mix3(g3('TF', -1), g3('TF', 1), s), v);
  return mix3(mix3(g3('R', -1), g3('R', 1), s), mix3(g3('TR', -1), g3('TR', 1), s), v);
};
export const ghQuad = (kind: string, s0: number, s1: number, v0: number, v1: number, n = 4): V3[] => {
  const pts: V3[] = [];
  for (let i = 0; i <= n; i++) pts.push(ghPt(kind, s0 + ((s1 - s0) * i) / n, v0));
  for (let i = 0; i <= n; i++) pts.push(ghPt(kind, s1 - ((s1 - s0) * i) / n, v1));
  return pts;
};
/** Window openings per greenhouse face (s and v ranges); everything else on the face is body-colour frame. */
export const WINDOWS: Record<string, [number, number, number, number][]> = {
  glassR: [[0.06, 0.53, 0.07, 0.93], [0.58, 0.86, 0.07, 0.93]],
  glassL: [[0.06, 0.53, 0.07, 0.93], [0.58, 0.86, 0.07, 0.93]],
  windscreen: [[0.05, 0.95, 0.05, 0.95]],
  rear: [[0.07, 0.93, 0.08, 0.92]],
  roof: [],
};
export const windowPolys = (kind: string): V3[][] => (WINDOWS[kind] ?? []).map(([s0, s1, v0, v1]) => ghQuad(kind, s0, s1, v0, v1));

const circle = (cx: number, cy: number, z: number, r: number, a0 = 0, a1 = Math.PI * 2, n = 28): V3[] =>
  Array.from({length: n + 1}, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3; });

/** True when picture point `q` lies inside convex polygon `poly`, at least `m` px from its edges (either winding). */
const inConvex = (q: Pt, poly: Pt[], m = 0) => {
  if (poly.length < 3) return false;
  let sgn = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1;
    const d = (ex * (q[1] - a[1]) - ey * (q[0] - a[0])) / l;
    if (Math.abs(d) < m) return false;
    const s = Math.sign(d);
    if (sgn === 0) sgn = s; else if (s !== sgn) return false;
  }
  return true;
};

/** A painter whose marks stay inside the convex picture polygon `poly` (the driver seen through the greenhouse). */
export const clipPolyPainter = (p: Painter, poly: Pt[]): Painter => {
  const inside = (q: Pt) => clipConvex([q, [q[0] + 0.01, q[1]], [q[0], q[1] + 0.01]], poly).length >= 3;
  const raw = p.brush as unknown as Record<string | symbol, unknown>;
  const brush = new Proxy(raw, {get: (t, k) => {
    const v = Reflect.get(t, k, t);
    if (typeof v !== 'function') return v;
    if (k === 'polygon') return (pts: Pt[]) => { const q = clipConvex(pts, poly); if (q.length >= 3) v.call(t, q); };
    if (k === 'spline') return (pts: Pt[], curv?: number) => {
      let run: Pt[] = [];
      const flush = () => { if (run.length >= 2) v.call(t, run, curv); run = []; };
      for (const q of pts) { if (inside(q)) run.push(q); else flush(); }
      flush();
    };
    if (k === 'line') return (x1: number, y1: number, x2: number, y2: number) => { if (inside([x1, y1]) && inside([x2, y2])) v.call(t, x1, y1, x2, y2); };
    return v.bind(t);
  }}) as unknown as Brush;
  return {...p, brush, layer: (a, base) => clipPolyPainter(p.layer(a, base), poly),
    wash: (col, op, pts, bleed, tex) => { const k = clipConvex(pts, poly); if (k.length >= 3) p.wash(col, op, k, bleed, tex); },
    flat: (col, pts) => { const k = clipConvex(pts, poly); if (k.length >= 3) p.flat(col, k); }};
};

export type CarOpts = {
  tone?: Tone;
  /** The driver (and anything else inside the cabin), painted after the dark interior and before the lower body and the glass. */
  inside?: (p: Painter, c: YCam) => void;
  /** Cyan instrument glow inside the cabin (pre-strike only, CL21-03). */
  dashGlow?: boolean;
  /** Glass wash opacity 0..255 (DF-20261030-painted-glass-sheen-veil: sheen <= 25 %). */
  glassOp?: number;
  /** Boss W5.2 BG4 (B03-SH07 on, SD12): the front-right tyre's damage (scorch, split, flattening). Absent = an intact FR (every earlier
   *  shot: the damage is there but unreadable, so it is not drawn). Replaces the W3 prototype `damagedFR`, which no shot used. */
  frDamage?: FrDamage;
  /** Boss W5.2 BG4: body sag at the FR corner in metres (0..0.06, `sagCam`). The body, greenhouse, glass and everything `inside` are painted
   *  through the sagged camera, so they stay rigid together; the tyres and the contact shadow stay on the road. Absent or 0 = unchanged. */
  sag?: number;
  /** Boss W5.2 BG4 (B03-SH07/SH08/B05-SH11): the car's outline ink is broken where it crosses the visible-side tyres (the hull's lower edge
   *  at y 0.28 ran as a straight dark-red line across the FR tyre in the close lenses). Absent = the outline as before. */
  inkBreakWheels?: boolean;
  seed?: number;
  /** Boss W5.2 BG2 (B02-SH05): a lens over the bonnet, inside the car's length, looking back through the windscreen. Skips the wheels and
   *  arches (beside or behind the lens, they near-clip into large dark shapes) and the lower-body faces behind the greenhouse (the rear deck
   *  ran as a red line across her chin through the glass), and inks only the greenhouse (the body hull loses the points behind the lens).
   *  Absent = every other lens exactly as before. */
  bonnetLens?: boolean;
  /** Boss W5.2 BG3 (B04-SH10 end, B05-SH13 start): a lens beside the cabin, above the beltline. The end tops (bonnet x >= 1.05 and rear
   *  deck x <= -1.55) are painted before what is inside, not after: no line of sight to the open tub crosses them, and the rear deck painted
   *  after her ran as a pink line across her face through the glass (as `bonnetLens` found in BG2). Absent = every other lens exactly as before (B01-SH02 shows the same thin line; BG1's call). */
  bonnetBehind?: boolean;
};

const ok = (q: Pt[]) => q.length >= 3;

/** Picture silhouette of the whole car (hull of every body and greenhouse corner). */
export const carSilhouette = (c: YCam): Pt[] => {
  const pts: Pt[] = [];
  for (const s of [1, -1] as const) {
    PROF.forEach(([x, y]) => { const q = camPoint(c, [x, y, s * CAR.zb]); if (q) pts.push(q); });
    (['F', 'R', 'TF', 'TR'] as const).forEach((k) => { const q = camPoint(c, g3(k, s)); if (q) pts.push(q); });
  }
  return hull(pts);
};
/** Picture hull of the greenhouse (the cabin outline). */
export const cabinSilhouette = (c: YCam): Pt[] => hull((['F', 'R', 'TF', 'TR'] as const).flatMap((k) => [1, -1].map((s) => camPoint(c, g3(k, s as 1 | -1)))).filter((q): q is Pt => !!q));

/** A lens above the beltline (y 0.94) sees into the open cabin tub: the lower body's top face over the cabin is not metal there, only the two
 *  door lips (z 0.80..0.85) are. Lenses at or below 0.94 keep the single belt-top face (LF01-LF03 and BG1 exterior lenses unchanged). */
export const HIGH_LENS_Y = 0.94;
/** World quad of the door lip on side `s` (the strip of the belt top between the greenhouse base and the body side). */
export const beltLipPts = (s: 1 | -1): V3[] => [[1.05, 0.92, s * 0.8], [-1.55, 0.96, s * 0.8], [-1.55, 0.96, s * CAR.zb], [1.05, 0.92, s * CAR.zb]];

/** Picture polygons of the visible outer metal skin: lower-body faces and the greenhouse frame (pillars, rails, roof), no glass.
 *  Boss W5.2 BG3: for a lens above `HIGH_LENS_Y` the belt top is the two door lips, as `paintCarExterior` draws it (was the whole face). */
export const shellPolys = (c: YCam): Pt[][] => {
  const high = c.y > HIGH_LENS_Y;
  const out: Pt[][] = bodyFaces().filter((f) => facing(c, f) && f.kind !== 'bottom' && !(high && isBeltTop(f))).map((f) => wp(c, f.pts));
  if (high) ([1, -1] as const).forEach((s) => out.push(wp(c, beltLipPts(s))));  // both lips are metal skin (a mask user decides occlusion)
  greenhouseFaces().filter((f) => facing(c, f)).forEach((f) => {
    const wins = WINDOWS[f.kind] ?? [];
    if (!wins.length) { out.push(wp(c, f.pts)); return; }
    const cuts = [0, ...wins.flatMap(([a, b]) => [a, b]), 1];
    for (let k = 0; k < cuts.length; k += 2) if (cuts[k + 1] - cuts[k] > 0.001) out.push(wp(c, ghQuad(f.kind, cuts[k], cuts[k + 1], 0, 1)));
    wins.forEach(([s0, s1, v0, v1]) => { out.push(wp(c, ghQuad(f.kind, s0, s1, v1, 1))); out.push(wp(c, ghQuad(f.kind, s0, s1, 0, v0))); });
  });
  return out.filter(ok);
};

/** Exterior CAR21 at the origin of space R, nose to +x. Returns the picture hull. */
export const paintCarExterior = (p: Painter, cw: YCam, o: CarOpts = {}) => {
  const T = o.tone ?? TONE_LIVE, S = (o.seed ?? 0) + 30000;
  // Boss W5.2 BG4: `c` sees the (sagged) body; `cw` the road, the contact shadow and the tyres (identical without `sag`)
  const c = o.sag ? sagCam(cw, o.sag) : cw;
  // contact shadow under the car, then the far-side wheels (seen under the sill from a low lens)
  const sh = wp(cw, [[-2.4, 0.002, -1.0], [2.4, 0.002, -1.0], [2.4, 0.002, 1.0], [-2.4, 0.002, 1.0]]);
  if (ok(sh)) washAt(p, S + 1, T('#121519'), 230, sh, 0.15, 0.2);
  const core = wp(cw, [[-2.0, 0.003, -0.8], [2.0, 0.003, -0.8], [2.0, 0.003, 0.8], [-2.0, 0.003, 0.8]]);
  if (ok(core)) hardFill(p, S + 2, T('#0d0f12'), core);
  if (!o.bonnetLens) for (const x of [CAR.wheelX, -CAR.wheelX]) paintWheel(p, cw, x, -1, T, S + 10 + (x > 0 ? 0 : 5));
  // greenhouse interior seen through the glass (dark cabin, lighter toward the far-side windows), then what is inside
  const gfaces = greenhouseFaces().filter((f) => facing(c, f));
  gfaces.forEach((f, i) => {
    const q = wp(c, f.pts);
    if (!ok(q)) return;
    hardFill(p, S + 40 + i, T(CAR.inside), q);
    (WINDOWS[f.kind] ?? []).forEach(([s0, s1, v0, v1], j) => {
      const wq = wp(c, ghQuad(f.kind, s0, s1, (v0 + v1) * 0.5, v1));
      if (ok(wq)) washAt(p, S + 50 + i * 4 + j, T('#465363'), 120, wq, 0.2, 0.3);
    });
  });
  if (o.dashGlow) {
    const g = wp(c, [[0.55, 1.0, 0.1], [0.8, 0.95, 0.1], [0.8, 0.95, 0.66], [0.55, 1.0, 0.66]]);
    if (ok(g)) washAt(p, S + 60, CAR.dashGlow, 70, g, 0.5, 0.2);
  }
  // the cabin floor and seats seen from above the beltline (Boss W5.2: a lens above y 0.94 looks down through the side glass; the open tub
  // is dark, drawn before what is inside)
  if (c.y > 0.94) {
    const tub = wp(c, [[1.05, 0.92, -0.8], [-1.55, 0.96, -0.8], [-1.55, 0.96, 0.8], [1.05, 0.92, 0.8]]);
    if (ok(tub)) hardFill(p, S + 45, T('#15191f'), tub);
  }
  // door tops on the beltline (z 0.80..0.85): the far one behind what is inside, the near one after it (below)
  const beltLip = (s: 1 | -1) => {
    const lip = wp(c, [[1.05, 0.92, s * 0.8], [-1.55, 0.96, s * 0.8], [-1.55, 0.96, s * CAR.zb], [1.05, 0.92, s * CAR.zb]]);
    if (c.y > 0.94 && ok(lip)) hardFill(p, S + 46 + (s > 0 ? 0 : 1), T(mixColor(CAR.red, '#7d8a9c', 0.32)), lip);
  };
  const near: 1 | -1 = c.z > 0 ? 1 : -1;
  beltLip(-near as 1 | -1);
  // Boss W5.2 BG3 `bonnetBehind`: the end tops (bonnet x >= 1.05, rear deck x <= -1.55) before what is inside, so their edges seen through
  // the cabin from a lens beside it stay behind her
  const isBonnet = (f: Face) => f.kind !== 'side' && (Math.min(...f.pts.map((v) => v[0])) >= 1.05 || Math.max(...f.pts.map((v) => v[0])) <= -1.55);
  const lowerCol = (f: Face) => (f.kind === 'top' ? mixColor(CAR.red, '#7d8a9c', 0.32) : f.kind === 'bottom' ? '#3e1412' : mixColor(CAR.red, CAR.shade, 0.55));
  if (o.bonnetBehind) bodyFaces().forEach((f, i) => {
    if (!facing(c, f) || isBeltTop(f) || !isBonnet(f)) return;
    const q = wp(c, f.pts);
    if (ok(q)) hardFill(p, S + 70 + i, T(lowerCol(f)), q);
  });
  if (o.inside) o.inside(clipPolyPainter(p, cabinSilhouette(c)), c);
  // lower body. The top face on the beltline segment (x 1.05..-1.55) is the open cabin, not metal: only the door tops (z 0.80..0.85 each
  // side) are drawn there (Boss W5.2; the solid top hid DRIVER below the chin from any lens above the beltline: B01-SH02, SH03 end).
  const faces = bodyFaces().filter((f) => facing(c, f) && !isBeltTop(f) && !(o.bonnetLens && Math.max(...f.pts.map((v) => v[0])) <= -1.55));
  beltLip(near);
  faces.forEach((f, i) => {
    if (o.bonnetBehind && isBonnet(f)) return;
    const q = wp(c, f.pts);
    if (!ok(q)) return;
    const col = f.kind === 'top' ? mixColor(CAR.red, '#7d8a9c', 0.32) : f.kind === 'side' ? '#a72d28' : f.kind === 'bottom' ? '#3e1412' : mixColor(CAR.red, CAR.shade, 0.55);
    hardFill(p, S + 70 + i, T(col), q);
    if (f.kind === 'side') {
      const s = f.n[2];
      // sky catch on the upper flank and the darker rocker; the shoulder crease highlight
      const band = (y0: number, y1: number, x0 = -2.15, x1 = 2.15): V3[] => [[x0, y0, s * CAR.zb], [x1, y0, s * CAR.zb], [x1, y1, s * CAR.zb], [x0, y1, s * CAR.zb]];
      washAt(p, S + 80, T(mixColor(CAR.red, '#8a96ab', 0.3)), 150, wp(c, band(0.66, 0.84, -2.1, 1.95)), 0.3, 0.3);
      washAt(p, S + 81, T(CAR.shade), 190, wp(c, band(0.3, 0.45)), 0.2, 0.3);
      hardFill(p, S + 82, T(CAR.wet), wp(c, band(0.795, 0.81, -1.95, 1.85)));
    }
  });
  // wheel arches, tyres and rims on the visible side
  const side = c.z > 0 ? 1 : -1;
  if (!o.bonnetLens) for (const x of [CAR.wheelX, -CAR.wheelX]) {
    const arch = wp(c, circle(x, 0.31, side * (CAR.zb + 0.001), 0.37, -0.12, Math.PI + 0.12, 20));
    if (ok(arch)) hardFill(p, S + 90 + (x > 0 ? 0 : 1), T('#111316'), arch);
    paintWheel(p, cw, x, side, T, S + 100 + (x > 0 ? 0 : 20), x > 0 && side > 0 && o.frDamage ? {...o.frDamage, sag: o.sag ?? 0} : undefined);
  }
  // front / rear details on the visible ends
  const front = faces.find((f) => f.kind === 'end' && f.n[0] > 0.9);
  if (front) {
    hardFill(p, S + 130, T('#1a1c20'), wp(c, [[2.275, 0.42, -0.55], [2.275, 0.42, 0.55], [2.275, 0.56, 0.55], [2.275, 0.56, -0.55]]));
    hardFill(p, S + 135, T('#2a1614'), wp(c, [[2.235, 0.3, -0.8], [2.235, 0.3, 0.8], [2.27, 0.38, 0.8], [2.27, 0.38, -0.8]]));
    for (const s of [1, -1]) {
      const lamp = wp(c, [[2.262, 0.6, s * 0.42], [2.262, 0.6, s * 0.78], [2.21, 0.72, s * 0.76], [2.21, 0.72, s * 0.42]]);
      if (ok(lamp)) { hardFill(p, S + 131 + (s > 0 ? 0 : 1), T('#c9d2da'), lamp); inkLine(p, S + 133 + (s > 0 ? 0 : 1), lamp, {weight: 0.8, color: T('#3a2220')}); }
    }
  }
  // glass: tint plus a diagonal sheen streak (<= 25 %), rain beads
  gfaces.forEach((f, i) => {
    windowPolys(f.kind).forEach((w, j) => {
      const wq = wp(c, w);
      if (!ok(wq)) return;
      washAt(p, S + 150 + i * 4 + j, T(CAR.glass), o.glassOp ?? 70, wq, 0.05, 0.2);
      const [s0, s1, v0, v1] = WINDOWS[f.kind][j];
      const sm = s0 + (s1 - s0) * 0.62;
      const streak = wp(c, [ghPt(f.kind, sm, v0), ghPt(f.kind, sm + (s1 - s0) * 0.16, v0), ghPt(f.kind, sm - (s1 - s0) * 0.05, v1), ghPt(f.kind, sm - (s1 - s0) * 0.2, v1)]);
      if (ok(streak)) washAt(p, S + 170 + i * 4 + j, T('#b3c1d0'), 56, clipConvex(streak, wq), 0.2, 0.3);
      for (let k = 0; k < 22; k++) {
        const a = ghPt(f.kind, s0 + (s1 - s0) * hash(S + 200 + k * 3 + i * 97 + j * 31), v0 + (v1 - v0) * hash(S + 201 + k * 3 + i * 97 + j * 31));
        const b = [a[0], a[1] - 0.03 - 0.05 * hash(S + 202 + k), a[2]] as V3;
        const qa = camPoint(c, a), qb = camPoint(c, b);
        if (qa && qb) inkLine(p, S + 400 + i * 60 + j * 30 + k, [qa, qb], {closed: false, color: T('#9fb0c0'), weight: 0.9, still: true});
      }
    });
  });
  // greenhouse frame: pillars, rails, the roof panel, beltline trim
  gfaces.forEach((f, i) => {
    const wins = WINDOWS[f.kind] ?? [];
    const frameCol = T(f.kind === 'roof' ? mixColor(CAR.red, '#7d8a9c', 0.3) : mixColor(CAR.red, CAR.shade, 0.25));
    if (f.kind === 'roof') { hardFill(p, S + 600, frameCol, wp(c, f.pts)); return; }
    // strips between and around the windows (s cuts) and above/below them (v cuts)
    const cuts = [0, ...wins.flatMap(([a, b]) => [a, b]), 1];
    for (let k = 0; k < cuts.length; k += 2) if (cuts[k + 1] - cuts[k] > 0.001) hardFill(p, S + 610 + i * 10 + k, frameCol, wp(c, ghQuad(f.kind, cuts[k], cuts[k + 1], 0, 1)));
    wins.forEach(([s0, s1, v0, v1], j) => {
      hardFill(p, S + 650 + i * 10 + j, frameCol, wp(c, ghQuad(f.kind, s0, s1, v1, 1)));
      hardFill(p, S + 670 + i * 10 + j, frameCol, wp(c, ghQuad(f.kind, s0, s1, 0, v0)));
    });
    if (f.kind.startsWith('glass')) {
      hardFill(p, S + 690 + i, T(CAR.trim), wp(c, ghQuad(f.kind, 0.04, 0.88, 0.0, 0.03)));
      hardFill(p, S + 695 + i, T(CAR.spec), wp(c, ghQuad(f.kind, 0.1, 0.8, 0.975, 1.0)));
    }
    if (f.kind === 'windscreen') hardFill(p, S + 699, T(mixColor(CAR.spec, CAR.red, 0.4)), wp(c, ghQuad(f.kind, 0.1, 0.9, 0.965, 1.0)));
  });
  // door seams, handles, mirror on the visible side
  if (Math.abs(c.z) > CAR.zb) {
    const z = side * (CAR.zb + 0.002);
    [[0.98, 0.3, 0.92], [-0.42, 0.3, 0.955], [-1.3, 0.62, 0.96]].forEach(([x, y0, y1], k) => {
      const a = camPoint(c, [x, y0, z]), b = camPoint(c, [x - 0.03, y1, z]);
      if (a && b) inkLine(p, S + 700 + k, [a, b], {closed: false, color: T('#4a1513'), weight: 1.1});
    });
    [[0.2], [-0.62]].forEach(([x], k) => hardFill(p, S + 710 + k, T(CAR.trim), wp(c, [[x, 0.79, z], [x - 0.16, 0.79, z], [x - 0.16, 0.815, z], [x, 0.815, z]])));
    const m = wp(c, [[0.98, 0.95, side * 0.82], [0.8, 0.95, side * 0.82], [0.8, 0.95, side * 1.04], [0.82, 1.06, side * 1.04], [0.98, 1.06, side * 0.84]]);
    if (ok(m)) { hardFill(p, S + 720, T(mixColor(CAR.red, CAR.shade, 0.35)), m); inkLine(p, S + 721, m, {weight: 0.9, color: T('#3a1210')}); }
  }
  // outline of the lower body silhouette and greenhouse (one thin ink line, characters-and-key-props rule)
  // From above the beltline the whole-car hull bridges the sky gaps over the rear screen and the bonnet (straight ink lines from the roof
  // corners to the ends, Boss W5.2 SH03); there the lower body and the greenhouse are outlined as their own convex parts. A lens below
  // the beltline (LF01, LF03) keeps the single hull, unchanged.
  const sil = carSilhouette(c);
  if (o.bonnetLens) { const gh = cabinSilhouette(c); if (ok(gh)) inkLine(p, S + 741, gh, {weight: 1.0, color: T('#2a1210')}); }
  else if (c.y <= 0.92) {
    if (!o.inkBreakWheels) { if (ok(sil)) inkLine(p, S + 740, sil, {weight: 1.1, color: T('#2a1210')}); }
    else outsideRuns(sil, tyreHulls(cw, side)).forEach((r, i) => inkLine(p, S + 760 + i, r, {closed: false, weight: 1.1, color: T('#2a1210')}));
  }
  else {
    // the body outline is broken where it runs behind the open cabin (the far door top seen through the glass)
    const gh = cabinSilhouette(c);
    const corners = ([1, -1] as const).flatMap((s) => PROF.map(([x, y]) => camPoint(c, [x, y, s * CAR.zb])));
    // `bonnetBehind` (BG3): a lens so close that body corners fall behind it would hull the rest into a false straight line across the door
    const body = o.bonnetBehind && corners.some((q) => !q) ? [] : hull(corners.filter((q): q is Pt => !!q));
    const runs: Pt[][] = [];
    let run: Pt[] = [];
    body.forEach((a, i) => {
      const b = body[(i + 1) % body.length];
      for (let k = 0; k <= 12; k++) {
        const q: Pt = [a[0] + ((b[0] - a[0]) * k) / 12, a[1] + ((b[1] - a[1]) * k) / 12];
        if (!inConvex(q, gh, 2)) run.push(q); else { if (run.length > 1) runs.push(run); run = []; }
      }
    });
    if (run.length > 1) runs.push(run);
    (o.inkBreakWheels ? runs.flatMap((r) => outsideRuns(r, tyreHulls(cw, side), false)) : runs).forEach((r, i) => inkLine(p, S + 742 + i, r, {closed: false, weight: 1.1, color: T('#2a1210')}));
    if (ok(gh)) inkLine(p, S + 741, gh, {weight: 1.0, color: T('#2a1210')});
  }
  return sil;
};

// ------------------------------------------------------------------------------------------------ BG4 sag and FR damage (SD12)
// Boss W5.2 BG4, 2026-11-16, from EDU-EP21-SHEETS-R1 "Car states by shot": the FR corner goes down as one rigid body about the rear-left
// contact (-1.30, 0, -0.75), rolling toward +z and pitching nose down. The sheet's angles (roll 1.6 deg, pitch 0.8 deg) are "est at 0.06 m";
// they drop the FR corner 0.078 m, so the sheet's measured quantity (0.06 m at the FR corner) wins and the angles keep the sheet's 2:1 ratio:
// roll = 2 pitch, 1.50 roll + 2.60 pitch = s, i.e. 1.23 deg roll and 0.61 deg pitch at s 0.06 (recorded deviation).
export const SAG_PIVOT: V3 = [-1.3, 0, -0.75];
/** Body sag of the sheet: 0.06 m at the FR corner from SH08's end on. */
export const SAG_FULL = 0.06;
/** The rigid body transform of a sag `s` (m at the FR corner): R = Rz(-pitch) Rx(roll). */
export const sagBody = (s: number): YBody => {
  const ph = s / 5.6, th = 2 * ph, cp = Math.cos(ph), sp = Math.sin(ph), ct = Math.cos(th), st = Math.sin(th);
  // Rx(th): y' = y ct - z st, z' = y st + z ct (+z side down); Rz(-ph): x' = x cp + y sp, y' = -x sp + y cp (+x end down)
  return {o: SAG_PIVOT, m: [cp, sp * ct, -sp * st, -sp, cp * ct, -cp * st, 0, st, ct]};
};
/** Camera `c` seeing the sagged body (`YCam.body`); `s` 0 returns `c`. */
export const sagCam = (c: YCam, s: number): YCam => (s > 0 ? {...c, body: sagBody(s)} : c);

/** FR tyre damage. `scorch` 0..1 how much of the matte scorch reads (0 = the contact shade covers it); `split` the split's opening (m, 0..0.01);
 *  `sag` the flattening (m; the hub drops with the body's FR corner, the tread spreads on the road). */
export type FrDamage = {scorch: number; split?: number; sag?: number;
  /** Boss W5.2f FX2 (SHEETS-R2 SD17, B05-SH11 only): the hub drop (m) when it differs from `sag`. A lens-only cheat: the body sags `sag`
   *  and the tread spreads for `sag` (uncapped above `SAG_FULL`), but the hub drops only `hub`, so the arch comes down onto the tyre
   *  (the arch-to-tyre gap shrinks by `sag - hub`) and the flat reads from a high lens. Absent = `sag` (the physical case). */
  hub?: number};
/** The FR damage from B03-SH08's end on (SH10, SH11, SH13): scorch readable, the split open 1 cm. */
export const FR_DONE: FrDamage = {scorch: 1, split: 0.01};
/** Scorch centre on the outer sidewall: the lower-rear quadrant near the contact (angle from +x, radians) and its radius on the sidewall. */
export const SCORCH = {a: (232 * Math.PI) / 180, span: (24 * Math.PI) / 180, r0: 0.2, r1: 0.3, color: '#3a2a22'};
/** A point of the (flattened) tyre at angle `a` and radius `rad` around the hub (x, cy): below the hub it spreads fore and aft as the tread
 *  flattens (up to 26 % at the road at 6 cm), and nothing goes below the road. */
const tyrePt = (x: number, cy: number, a: number, rad: number, z: number, sag: number): V3 => {
  let dx = rad * Math.cos(a);
  const dy = rad * Math.sin(a);
  if (sag > 0 && dy < 0) dx *= 1 + 0.26 * (sag / SAG_FULL) * Math.min(1, -dy / cy);
  return [x + dx, Math.max(0, cy + dy), z];
};
const ring3 = (x: number, cy: number, z: number, rad: number, sag: number, a0 = 0, a1 = Math.PI * 2, n = 28): V3[] =>
  Array.from({length: n + 1}, (_, i) => tyrePt(x, cy, a0 + ((a1 - a0) * i) / n, rad, z, sag));

/** Picture hulls of the two visible-side tyres (road camera), for `outsideRuns`. */
const tyreHulls = (c: YCam, s: 1 | -1): Pt[][] => [CAR.wheelX, -CAR.wheelX].map((x) =>
  hull([...circle(x, CAR.wheelR, s * 0.86, CAR.wheelR), ...circle(x, CAR.wheelR, s * 0.66, CAR.wheelR)].map(([a, b, z]) => camPoint(c, [a, Math.max(0, b), z])).filter((q): q is Pt => !!q))).filter(ok);
/** The parts of polyline `poly` (closed by default) outside every convex hole, sampled 12 steps per edge. */
const outsideRuns = (poly: Pt[], holes: Pt[][], closed = true): Pt[][] => {
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  const n = closed ? poly.length : poly.length - 1;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    for (let k = 0; k <= 12; k++) {
      const q: Pt = [a[0] + ((b[0] - a[0]) * k) / 12, a[1] + ((b[1] - a[1]) * k) / 12];
      if (!holes.some((h) => inConvex(q, h))) run.push(q); else { if (run.length > 1) runs.push(run); run = []; }
    }
  }
  if (run.length > 1) runs.push(run);
  return runs;
};

/** One wheel at x on side s (+1 driver side): tyre cylinder, sidewall, rim with five spokes. `dmg` the FR damage (B03 on; BG4). */
export const paintWheel = (p: Painter, c: YCam, x: number, s: 1 | -1, T: Tone, seed: number, dmg?: FrDamage) => {
  const r = CAR.wheelR, sag = dmg?.sag ?? 0, cy = r - (dmg?.hub ?? sag);
  const outer = ring3(x, cy, s * 0.86, r, sag), inner = ring3(x, cy, s * 0.66, r, sag);
  const cyl = hull([...outer, ...inner].map((v) => camPoint(c, v)).filter((q): q is Pt => !!q));
  if (ok(cyl)) hardFill(p, seed, T(CAR.tyre), cyl);
  const qo = wp(c, outer);
  if (!ok(qo) || c.z * s < 0.86) return;
  hardFill(p, seed + 1, T(CAR.wall), qo);
  if (dmg && sag > 0) {
    // the bulge of the flattened sidewall over the road: the storm sky catching its rounded lower shoulder (a pale crescent), and the wet
    // contact line where the spread tread meets the road
    const k = Math.min(1, sag / SAG_FULL);
    const bul = wp(c, [...ring3(x, cy, s * 0.861, r * 0.97, sag, Math.PI * 1.1, Math.PI * 1.9, 16), ...ring3(x, cy, s * 0.861, r * 0.84, sag, Math.PI * 1.9, Math.PI * 1.1, 16)]);
    if (ok(bul)) washAt(p, seed + 5, T('#58626e'), 110 * k, bul, 0.3, 0.3);
    const flat = Math.sqrt(Math.max(0, r * r - cy * cy)) * (1 + 0.26 * (sag / SAG_FULL));
    const a = camPoint(c, [x - flat, 0.004, s * 0.865]), b = camPoint(c, [x + flat, 0.004, s * 0.865]);
    if (a && b) inkLine(p.layer(0.8 * k, seed + 30), seed + 31, [a, b], {closed: false, color: T('#8a96a4'), weight: 1.6, still: true});
  }
  if (dmg && dmg.scorch > 0) {
    // matte scorch (no glow) on the lower-rear sidewall: a ragged ashy halo, a darker char core, then the split blister across it, a
    // tapered crack opening with `split` under a thin raised lip. Ragged edges are seeded per vertex (no sticker-like sector).
    const {a, span, r0, r1} = SCORCH, z = s * 0.8615, rm = (r0 + r1) / 2, k = Math.min(1, dmg.scorch);
    const jag = (ri: number, ro: number, a0: number, a1: number, n: number, js: number, amp: number, taper = 0): V3[] => {
      const out: V3[] = [], inn: V3[] = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n, ang = a0 + (a1 - a0) * u, tp = taper > 0 ? Math.sin(Math.PI * u) ** taper : 1;
        out.push(tyrePt(x, cy, ang, rm + (ro - rm) * tp + amp * (hash(js + i) - 0.5), z, sag));
        inn.push(tyrePt(x, cy, ang, rm - (rm - ri) * tp + amp * (hash(js + 50 + i) - 0.5), z, sag));
      }
      return [...out, ...inn.reverse()];
    };
    const halo = wp(c, jag(r0 - 0.01, r1 + 0.008, a - span, a + span, 14, seed + 400, 0.03, 0.6));
    if (ok(halo)) washAt(p, seed + 6, T(SCORCH.color), 180 * k, halo, 0.3, 0.55);
    const core = wp(c, jag(r0 + 0.012, r1 - 0.01, a - span * 0.6, a + span * 0.55, 10, seed + 500, 0.02, 0.8));
    if (ok(core)) washAt(p, seed + 7, T('#1c1410'), 190 * k, core, 0.3, 0.6);
    const w = Math.max(0.002, (dmg.split ?? 0) / 2);
    const lip = wp(c, jag(rm + w * 0.6, rm + w + 0.009, a - span * 0.5, a + span * 0.42, 10, seed + 600, 0.004, 1));
    if (ok(lip)) washAt(p, seed + 8, T('#4c403a'), 120 * k, lip, 0.2, 0.3);
    const split = wp(c, jag(rm - w, rm + w, a - span * 0.5, a + span * 0.42, 12, seed + 700, 0.003, 1));
    if (ok(split)) hardFill(p.layer(k, seed + 9), seed + 9, T('#060606'), split);
  }
  const rim = wp(c, circle(x, cy, s * 0.862, 0.19));
  if (ok(rim)) hardFill(p, seed + 2, T(CAR.rim), rim);
  const hub = wp(c, circle(x, cy, s * 0.864, 0.06, 0, Math.PI * 2, 12));
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + 0.3, w = 0.16;
    const hole = wp(c, [[x + 0.07 * Math.cos(a - w * 1.6), cy + 0.07 * Math.sin(a - w * 1.6), s * 0.863], [x + 0.17 * Math.cos(a - w), cy + 0.17 * Math.sin(a - w), s * 0.863], [x + 0.17 * Math.cos(a + w), cy + 0.17 * Math.sin(a + w), s * 0.863], [x + 0.07 * Math.cos(a + w * 1.6), cy + 0.07 * Math.sin(a + w * 1.6), s * 0.863]]);
    if (ok(hole)) hardFill(p, seed + 10 + k, T('#3a3d42'), hole);
  }
  if (ok(hub)) hardFill(p, seed + 3, T('#b4bac2'), hub);
  inkLine(p, seed + 4, qo, {weight: 1.0, color: '#0a0a0b'});
};

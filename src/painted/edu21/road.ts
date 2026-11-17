import {blob, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {hull, wp} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {clipPolyPainter as clipPoly} from './car';

// SET-ROAD21 (EDU-EP21-BRIEF-R1 "Set plan", brief N2 `new: rural storm road at dusk`; Film W3.1 look-frame build, 2026-11-16, rough prototype
// for the look lock, Boss hardens). Space R: metres, origin on the road under the car centre, +x along the road (the car's nose), +y up,
// +z toward the verge and the main camera side. two-lane asphalt z -8.6..+2.4 (shoulder z -1.4..+2.4: W3 estimate, widened from the brief's +1.3 so the wet
// shoulder fills the low exterior foreground), verge z 2.4..4.0, ditch 4.0..5.2,
// paddy beyond on both sides, sugar palms far off. No poles, wires, signs or towers (truth limit 7). Every element projects through the
// shot's one YCam. Colours: brief colour and value key; `tone` maps every set colour (identity, or the explanatory desaturate-and-cool, VD06).

export type Tone = (c: string) => string;
export const TONE_LIVE: Tone = (c) => c;
/** VD06 explanatory state: the world desaturated 50 %, cooled and dimmed (rows: "ภาพรอบ ๆ หม่นลง"), so the warm route glow and the warm blouse are the only warm things. */
export const TONE_EXPLAIN: Tone = (c) => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);
  if (!m) return c;
  const [r, g, b] = [1, 2, 3].map((i) => parseInt(m[i], 16));
  const y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b), grey = `#${[y, y, y].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  return mixColor(mixColor(mixColor(c, grey, 0.5), '#4e5d72', 0.18), '#161b22', 0.22);
};
/** Boss W5.2 BG3: the explanatory tone at strength `k` 0..1 (SH06 ramp L0-6, SH13 echo at 40 %); 0 and 1 return the two tones themselves. */
export const toneMix = (k: number): Tone => (k <= 0 ? TONE_LIVE : k >= 1 ? TONE_EXPLAIN : (c) => mixColor(c, TONE_EXPLAIN(c), k));

export const ROAD = {
  sky: ['#262e38', '#3c4855', '#5f6e80'] as const,
  flicker: '#8a96ab', dusk: '#9a8f84', duskWarm: '#b8a48a',
  asphalt: '#2e3238', sheen: '#6f7c8a', line: '#d9dcd6', verge: '#4a5c3e', paddy: '#3f5a3c', glint: '#7f8c96', palm: '#1f2a26',
  ditch: '#39444c', splash: '#8a96a4',
};

/** Picture y of the horizon for this camera (a level far point at eye height). */
export const horizonY = (c: YCam) => c.hy + c.f * Math.tan(c.pitch ?? 0);

export type RoadOpts = {t: number; tone?: Tone; /** 0..1 dusk warmth on the horizon band (payoff lift, VD09). */ warm?: number; /** Far fork on the horizon (VD04 / N5 far); a number = its picture x. */ fork?: boolean | number; /** Picture y span [top, bottom] of the far fork (default: cloud top to the horizon). */ forkSpan?: [number, number]};

const ok = (q: Pt[]) => q.length >= 3;
const ww = (p: Painter, c: YCam, seed: number, color: string, op: number, pts: V3[], bleed = 0.08, tex = 0.3) => {
  const q = wp(c, pts);
  if (ok(q)) washAt(p, seed, color, op, q, bleed, tex);
  return q;
};
const wf = (p: Painter, c: YCam, seed: number, color: string, pts: V3[]) => {
  const q = wp(c, pts);
  if (ok(q)) hardFill(p, seed, color, q);
  return q;
};
const quadY = (x0: number, x1: number, z0: number, z1: number, y = 0): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];

/** Storm sky down to the horizon: graded bands, heavy cloud masses, the lit underside near the far fork and a dusk residue low on -x. */
export const paintStormSky = (p: Painter, c: YCam, o: RoadOpts) => {
  const T = o.tone ?? TONE_LIVE, hz = horizonY(c);
  paintSkyBands(p, {from: T(ROAD.sky[0]), via: T(ROAD.sky[1]), to: T(ROAD.sky[2]), viaAt: 0.55, horizon: hz + 4, width: 1080, bands: 9});
  // dusk residue: a warm-grey band low on the horizon toward -x (screen side follows the camera yaw)
  const duskX = camPoint(c, [-400, c.y, 0]);
  const dx = duskX ? duskX[0] : -200;
  if (duskX) washAt(p, 21010, T(mixColor(ROAD.dusk, ROAD.duskWarm, o.warm ?? 0)), 150 + 60 * (o.warm ?? 0), [[dx - 900, hz - 90 - 40 * (o.warm ?? 0)], [dx + 700, hz - 60], [dx + 900, hz + 6], [dx - 900, hz + 6]], 0.25, 0.4);
  // cloud masses: dark blobs, then the cool underside light
  for (let i = 0; i < 9; i++) {
    const cx = -150 + hash(21100 + i) * 1380, cy = hz - 120 - hash(21120 + i) * (hz - 60);
    washAt(p, 21140 + i, T(mixColor('#1a2028', '#2c3540', hash(21160 + i))), 170, blob(21180 + i, cx, cy, 260 + 220 * hash(21200 + i), 70 + 60 * hash(21220 + i), 0, 20), 0.18, 0.5);
  }
  for (let i = 0; i < 5; i++) {
    const cx = -100 + hash(21300 + i) * 1280, cy = hz - 70 - hash(21320 + i) * 260;
    washAt(p, 21340 + i, T('#4c5868'), 120, blob(21360 + i, cx, cy, 300, 26 + 20 * hash(21380 + i), 0, 18), 0.2, 0.5);
  }
  if (o.fork !== undefined && o.fork !== false) paintFarFork(p, c, T, typeof o.fork === 'number' ? o.fork : undefined, o.forkSpan);
};

/** The far fork on the horizon (N5 far): a thin jagged white channel with two branches, a faint cool halo and the cloud base lit above it.
 *  `x` picture column of the fork (default: where world (-300, 0, -900) projects; the brief puts it left of the car). */
export const paintFarFork = (p: Painter, c: YCam, T: Tone = TONE_LIVE, x?: number, span?: [number, number]) => {
  const base = camPoint(c, [-300, 0, -900]);
  const bx = x ?? (base ? base[0] : 200);
  const hz = horizonY(c), top = span ? span[0] : Math.max(-40, hz - 560), bot = span ? span[1] : hz - 4;
  washAt(p, 21400, T(ROAD.flicker), 60, blob(21402, bx + 40, top + 30, 280, 70, 0, 18), 0.4, 0.5);
  washAt(p, 21401, T('#6f7c94'), 70, blob(21403, bx + 10, top + 70, 160, 50, 0, 16), 0.4, 0.5);
  const pts: Pt[] = [];
  const n = 14, far = span ? 0.6 : 1;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([bx + 50 * far * (1 - u) * (1 - u) + (hash(21410 + i) - 0.5) * 38 * far * (i > 0 && i < n ? 1 : 0), top + (bot - top) * u]);
  }
  p.inkStill(21420, 'pen', '#cfd9ff', 2.6 * far);
  p.brush.spline(pts, 0);
  p.inkStill(21421, 'pen', '#ffffff', 1.2 * far);
  p.brush.spline(pts, 0);
  [[4, 1, 1], [8, -1, 0.7]].forEach(([k, s, L], j) => {
    const a = pts[k], l = L * far, b: Pt = [a[0] + s * 34 * l, a[1] + 40 * l], d: Pt = [b[0] - s * 8 * l, b[1] + 36 * l], e: Pt = [d[0] + s * 26 * l, d[1] + 30 * l];
    p.inkStill(21430 + j, 'pen', '#e8eeff', 1.1 * far);
    p.brush.spline([a, b, d, e], 0);
  });
  // a far fork (span given) ends in the distant rain curtain, well clear of anything near: a grey haze swallows its lower end
  if (span) washAt(p, 21440, T('#4a5666'), 150, [[bx - 140, bot - 70], [bx + 140, bot - 70], [bx + 170, bot + 60], [bx - 170, bot + 60]], 0.5, 0.4);
};

/** Land and road: far paddy with water glints and sugar palms, the two-lane road and shoulder, verge, ditch and near paddy. */
export const paintRoadSet = (p: Painter, c: YCam, o: RoadOpts) => {
  const T = o.tone ?? TONE_LIVE;
  // far paddy (both sides of the road), out to the horizon
  ww(p, c, 21500, T(ROAD.paddy), 240, quadY(-900, 900, -9.5, -1400), 0.04, 0.25);
  ww(p, c, 21501, T('#344b33'), 200, quadY(-900, 900, -60, -1400), 0.05, 0.3);
  for (let i = 0; i < 14; i++) {
    const z = -12 - 9 * i - hash(21510 + i) * 6, x0 = -300 + hash(21530 + i) * 200, len = 120 + hash(21550 + i) * 260;
    ww(p, c, 21570 + i, T(ROAD.glint), 130, quadY(x0, x0 + len, z, z - 0.6 - 0.04 * i), 0.1, 0.2);
  }
  // paddy bunds: thin dark lines across the far field
  for (let i = 0; i < 6; i++) {
    const z = -14 - 14 * i;
    ww(p, c, 21600 + i, T('#2d3f2c'), 160, quadY(-600, 600, z, z - 0.35), 0.05, 0.2);
  }
  // sugar palm clumps (14-18 m). P1 (first two) at (-60, -200), SD10 (EDU-EP21-SHEETS-R1; was (-40, -60)): from (-40, -60) its crown sat
  // over the roof and read as spiky hair on her head at yaw 26-36 (LF03 known defect 4).
  const palms: [number, number, number][] = [[-60, -200, 15], [-66, -203, 17], [25, -90, 16], [70, -150, 18], [76, -146, 14], [-120, -200, 16]];
  palms.forEach(([x, z, h], i) => {
    const b = camPoint(c, [x, 0, z]), tp = camPoint(c, [x, h, z]);
    if (!b || !tp) return;
    const w = Math.max(2, (tp[1] - b[1]) * -0.03);
    hardFill(p, 21650 + i, T(ROAD.palm), [[b[0] - w, b[1]], [b[0] + w, b[1]], [tp[0] + w * 0.6, tp[1]], [tp[0] - w * 0.6, tp[1]]]);
    const r = Math.abs(tp[1] - b[1]) * 0.3;
    washAt(p, 21660 + i, T(ROAD.palm), 235, ell(tp[0], tp[1] + r * 0.05, r * 0.62, r * 0.5, 16), 0.1, 0.2);
    for (let k = 0; k < 11; k++) {
      const a = -Math.PI * (-0.12 + 1.24 * (k / 10)), e: Pt = [tp[0] + Math.cos(a) * r * 1.1, tp[1] + Math.sin(a) * r * 0.85];
      const sx = -Math.sin(a) * r * 0.16, sy = Math.cos(a) * r * 0.16;
      hardFill(p, 21670 + i * 12 + k, T(ROAD.palm), [[tp[0] + sx, tp[1] + sy], [e[0], e[1]], [tp[0] - sx, tp[1] - sy]]);
    }
  });
  // far road edge grass strip, the asphalt, the shoulder
  ww(p, c, 21700, T(ROAD.verge), 230, quadY(-900, 900, -8.6, -9.5), 0.05, 0.3);
  wf(p, c, 21701, T(ROAD.asphalt), quadY(-900, 900, 2.4, -8.6));
  // wet sheen: long pale bands along the road that pick up the sky
  for (let i = 0; i < 7; i++) {
    const z = -0.5 - i * 1.2 - hash(21710 + i) * 0.6;
    ww(p, c, 21720 + i, T(ROAD.sheen), 70 + 40 * hash(21740 + i), quadY(-60, 60, z, z - 0.25 - 0.2 * hash(21760 + i)), 0.25, 0.35);
  }
  // lane lines: edge (z -1.40), dashed centre (z -4.9), far edge (z -8.4); worn
  wf(p, c, 21800, T(mixColor(ROAD.line, ROAD.asphalt, 0.25)), quadY(-900, 900, -1.36, -1.46));
  wf(p, c, 21801, T(mixColor(ROAD.line, ROAD.asphalt, 0.35)), quadY(-900, 900, -8.35, -8.45));
  for (let i = -30; i < 30; i++) wf(p, c, 21810 + i + 30, T(mixColor(ROAD.line, ROAD.asphalt, 0.3)), quadY(i * 6, i * 6 + 3, -4.85, -4.95));
  // shoulder sheet puddle (z +0.9..+2.3): the wet shoulder that mirrors the car
  ww(p, c, 21880, T('#3c4652'), 170, quadY(-4, 5, 0.9, 2.3), 0.3, 0.3);
  // verge, ditch, near paddy (behind the main cameras; seen from inside the car and in low exterior frames)
  ww(p, c, 21900, T(ROAD.verge), 245, quadY(-900, 900, 2.4, 4.0), 0.05, 0.3);
  ww(p, c, 21901, T(ROAD.ditch), 240, quadY(-900, 900, 4.0, 5.2), 0.05, 0.2);
  ww(p, c, 21902, T(ROAD.paddy), 245, quadY(-900, 900, 5.2, 400), 0.05, 0.25);
  // splash rings on the asphalt and puddle (seeded; they flicker on the composition clock in motion)
  for (let i = 0; i < 46; i++) {
    const k = Math.floor(o.t * 6 + hash(22000 + i) * 6);
    const x = -6 + hash(22100 + i * 13 + k) * 12, z = -6 + hash(22200 + i * 17 + k) * 8.3;
    const q = camPoint(c, [x, 0, z]);
    if (!q) continue;
    const u = c.f / Math.max(0.5, Math.hypot(x - c.x, z - c.z));
    if (u < 25) continue;
    inkLine(p, 22300 + i, ell(q[0], q[1], 0.06 * u, 0.018 * u, 10), {color: T(ROAD.splash), weight: 0.7, still: true});
  }
};

/** Verge grass tufts in the near foreground (darker and lower in contrast than the midground, UT12a), from world x0..x1 along z. */
export const paintVergeTufts = (p: Painter, c: YCam, o: RoadOpts & {z: [number, number]; x: [number, number]; n?: number}) => {
  const T = o.tone ?? TONE_LIVE;
  for (let i = 0; i < (o.n ?? 30); i++) {
    const x = o.x[0] + hash(22500 + i) * (o.x[1] - o.x[0]), z = o.z[0] + hash(22600 + i) * (o.z[1] - o.z[0]);
    const g = camPoint(c, [x, 0, z]);
    if (!g) continue;
    const u = c.f / Math.max(0.4, Math.hypot(x - c.x, z - c.z)), h = (0.14 + 0.12 * hash(22700 + i)) * u;
    const col = T(mixColor('#26321f', '#34432c', hash(22900 + i)));
    // a clump of 5 thin leaning blades
    for (let k = 0; k < 5; k++) {
      const lean = (hash(23000 + i * 7 + k) - 0.6) * 0.5 * h, bx = g[0] + (k - 2) * 0.012 * u, w = Math.max(1.2, 0.006 * u), hh = h * (0.6 + 0.4 * hash(23100 + i * 7 + k));
      hardFill(p, 22800 + i * 8 + k, col, [[bx - w, g[1]], [bx + lean, g[1] - hh], [bx + w, g[1]]]);
    }
  }
};

/** The mirror camera of `c` in the wet road (y = 0): eye below the road and the pitch negated; its picture flipped about `hy`
 *  (y -> 2 hy - y) is the reflection, exact for any pitch (Boss W5.2: was pitch 0, exact only for a level lens; SH03 pitches to -20). */
export const mirrorCam = (c: YCam): YCam => ({...c, y: -c.y, pitch: -(c.pitch ?? 0)});
/** Reflection of whatever `draw` paints, mirrored in the wet road (y = 0) at `alpha`, then darker ripple bands that break it up. */
export const paintWetReflection = (p: Painter, c: YCam, draw: (q: Painter, m: YCam) => void, o: {alpha: number; tone?: Tone; z?: [number, number]; ripples?: boolean | number}) => {
  const T = o.tone ?? TONE_LIVE;
  p.brush.push(); p.brush.translate(0, 2 * c.hy); p.brush.scale(1, -1);
  draw(p.layer(o.alpha, 61000), mirrorCam(c));
  p.brush.pop();
  if (o.ripples === false) return;
  const [z0, z1] = o.z ?? [-1.4, 2.3];
  const nr = typeof o.ripples === 'number' ? o.ripples : 16;
  for (let i = 0; i < nr; i++) {
    const z = z0 + ((z1 - z0) * (i + hash(23300 + i))) / nr, x0 = -5 + hash(23320 + i) * 3, x1 = x0 + 4 + hash(23340 + i) * 6;
    ww(p, c, 23360 + i, T(i % 3 ? ROAD.asphalt : ROAD.sheen), i % 3 ? 120 : 60, quadY(x0, x1, z, z + 0.04 + 0.05 * hash(23380 + i)), 0.2, 0.3);
  }
};

/** Rain-flooded verge water (SET-ROAD21, Boss W5.2 for LF03 known defect 2): four shallow puddles laid inside the SH06/SH10 lens's ground
 *  footprint (x 0.4-3.0, z 2.4-3.1, Film's prepared fix in BRIEF-R4), the nearest touching the asphalt edge so the shoulder runs into
 *  water instead of a straight seam. World [x, z, rx, rz]; convex rings, so each picture hull can clip a mirror. One set: every exterior
 *  lens that sees this ground shows the same water. */
export const VERGE_PUDDLES: V3[][] = [[0.95, 2.6, 0.55, 0.2], [2.15, 2.74, 0.78, 0.3], [1.45, 2.99, 0.4, 0.1], [2.88, 2.52, 0.24, 0.13]].map(([x, z, rx, rz]) =>
  Array.from({length: 24}, (_, i) => [x + rx * Math.cos((i / 24) * 6.283) * (1 + 0.06 * Math.sin(i * 2.1)), 0, z + rz * Math.sin((i / 24) * 6.283) * (1 + 0.08 * Math.cos(i * 1.3))] as V3));
/** Picture polygons of the verge puddles for this camera (convex hulls, empty ones dropped). */
export const vergePuddlePolys = (c: YCam): Pt[][] => VERGE_PUDDLES.map((w) => hull(camPolyPts(c, w))).filter((k) => k.length >= 3);
const camPolyPts = (c: YCam, w: V3[]) => w.map((v) => camPoint(c, v)).filter((q): q is Pt => !!q);
/** The verge puddles: sky-grey water, the storm sky mirrored in each, then whatever `mirror` paints (the car, its glow) mirrored in it,
 *  and seeded rain rings on the composition clock. Paint after `paintRoadSet` and before the car. Returns the picture polygons. */
export const paintVergePuddles = (p: Painter, c: YCam, o: RoadOpts & {mirror?: (q: Painter, m: YCam) => void; skyAlpha?: number; mirrorAlpha?: number}) => {
  const T = o.tone ?? TONE_LIVE, water = vergePuddlePolys(c);
  water.forEach((q, i) => washAt(p, 23500 + i, T('#55657a'), 225, q, 0.06, 0.3));
  water.forEach((w) => {
    const k = w.map(([x, y]) => [x, 2 * c.hy - y] as Pt);
    paintWetReflection(p, c, (q, m) => paintStormSky(clipPoly(q, k), m, {...o, fork: false}), {alpha: o.skyAlpha ?? 0.45, tone: T, ripples: false});
    if (o.mirror) paintWetReflection(p, c, (q, m) => o.mirror!(clipPoly(q, k), m), {alpha: o.mirrorAlpha ?? 0.34, tone: T, ripples: false});
  });
  for (let i = 0; i < 16; i++) {
    const w = VERGE_PUDDLES[i % VERGE_PUDDLES.length], k = Math.floor(o.t * 5 + hash(23520 + i) * 5), j = Math.floor(hash(23540 + i * 7 + k) * w.length);
    const [cx, , cz] = w.reduce<V3>((s, v) => [s[0] + v[0] / w.length, 0, s[2] + v[2] / w.length], [0, 0, 0]);
    const v: V3 = [cx + (w[j][0] - cx) * 0.7 * hash(23560 + i + k), 0, cz + (w[j][2] - cz) * 0.7 * hash(23580 + i + k)];
    const g = camPoint(c, v);
    if (!g) continue;
    const u = c.f / Math.max(0.4, Math.hypot(v[0] - c.x, v[2] - c.z));
    inkLine(p, 23600 + i, ell(g[0], g[1], 0.07 * u, 0.02 * u, 12), {color: T('#8a96a4'), weight: 0.8, still: true});
  }
  return water;
};

/** A soft wet lip along the asphalt/verge seam (z 2.4): a feathered verge-edge wash over the hard clip of the road mirror, so the
 *  reflection fades into the grass instead of ending on a ruled line (LF03 known defect 1, canvas side; the glow smear's own mask is
 *  feathered in glow.tsx). Paint after the road reflection. */
export const paintAsphaltLip = (p: Painter, c: YCam, o: RoadOpts & {x?: [number, number]}) => {
  const T = o.tone ?? TONE_LIVE, [x0, x1] = o.x ?? [-12, 12];
  ww(p, c, 23700, T(mixColor(ROAD.asphalt, ROAD.verge, 0.45)), 150, quadY(x0, x1, 2.28, 2.5), 0.45, 0.4);
  ww(p, c, 23701, T(mixColor(ROAD.asphalt, ROAD.verge, 0.75)), 120, quadY(x0, x1, 2.42, 2.62), 0.45, 0.45);
};

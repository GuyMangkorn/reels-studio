import {ell, hardFill, INK, VD18, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {flatCircle, hull, paintBox, qy, qz, sphereAt, wFill, wInk, wp, wWash, type Box} from '../kit/world';
import {camDist, camPoint, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import type {MotionId} from '../kit/motions';
import {CUS, paintPerson, VEN} from './cast';
import {paintStars} from './stars';

// SET-SOI (brief EDU-EP07-BRIEF-R1 VD04, set plan): a Bangkok soi at 15:00, metres. Origin on the paving at the centre of the cart's
// front (customer-side) edge; +x right along the footpath, +y up, +z toward the road; the boundary wall stands at z -2.0. One yaw camera
// per shot; VEN and CUS are flat cards squared to the lens. `night` 0..1 is the day-night grade (brief N8): day sky and warm key at 0,
// starry sky and cool Moon rim at 1. W3 look frames: LF01 (day, pose A), LF03 (night), the street panel of LF02.

const DEG = Math.PI / 180;
export const orbit = (at: V3, azDeg: number, r: number, eye: number, pitchDeg: number, f: number, hy: number): YCam =>
  ({...orbitYCam(at, r, azDeg * DEG, eye, f, hy), pitch: pitchDeg * DEG});

/** SD07: the +1 h stool 2 beside CUS, and Jupiter's fixed sky direction (az -2.0, el 25.2: centred above the pair at the end of B04-SH05). */
export const STOOL2_DAY: V3 = [-0.75, 0, 0.55];
export const STOOL2_NIGHT: V3 = [0.6, 0, 0.45];
export const JUP_DIR: V3 = [0.032, 0.425, -0.905];
export const T_STALL: V3 = [0.45, 1.05, -0.35];
export const T_PAIR: V3 = [0.9, 1.05, -0.4];
export const VEN_AT: V3 = [0.2, 0, -0.86];
export const CUS_AT: V3 = [1.42, 0, 0.3];
const MORTAR: V3 = [0.66, 0.89, -0.42];
/** restHand: her right hand lies flat on the stall top beside the mortar, low and out to the left, so the arm stays below her chin (close camera B05-SH02). */
const REST_HAND: V3 = [MORTAR[0] - 0.34, MORTAR[1] + 0.02, MORTAR[2] - 0.02];
const UMB_POLE: V3 = [-0.45, 0, -0.9];
const PESTLE_LEN = 0.5;
const GRIP_MAX_Y = 1.45;
/** Where the fist holds the pestle, as a fraction of its length from the hitting end: fixed for the whole stroke (W5.3 round 2: the hand keeps its point, the pestle follows the hand). */
const GRIP_S = 0.5;
/** The pestle's stroke height scale: the arm reaches `GRIP_MAX_Y` at the fist, so a stroke of 1 would lift the grip past the reach; the stroke is scaled so the fist and the arm's hand travel together. */
const STROKE_K = Math.min(1, (GRIP_MAX_Y - GRIP_S * PESTLE_LEN - 0.98) / 0.34);
/** Pestle tip, top and fist (world metres) at a stroke value 0..1. */
export const pestleGeom = (stroke: number): {tip: V3; top: V3; grip: V3} => {
  const tip: V3 = [MORTAR[0], 0.98 + 0.34 * STROKE_K * stroke, MORTAR[2] + 0.02], top: V3 = [MORTAR[0] + 0.01, tip[1] + PESTLE_LEN, MORTAR[2] + 0.04];
  const grip: V3 = [tip[0] + (top[0] - tip[0]) * GRIP_S, tip[1] + (top[1] - tip[1]) * GRIP_S, tip[2] + (top[2] - tip[2]) * GRIP_S + 0.03];
  return {tip, top, grip};
};
const UMB_R = 1.3, UMB_Y = 2.25, UMB_TOP = 2.62;
const WALL_Z = -2.0, WALL_H = 1.9;

/** Pose A, the loop frame (L01 / L14): brief `T-STALL, yaw +24, r 2.80, eye 1.35, pitch +6, f 1050`; W3 values are tuned here. */
export const POSE_A: YCam = orbit([0.5, 1.05, -0.4], 23, 3.7, 1.3, 5, 1480, 770);

// ---- Moon: a sky direction fixed from pose A (screen (760, 445) there), reused by every camera (brief set plan).
const rayDir = (c: YCam, x: number, y: number): V3 => {
  const r = (x - 540) / c.f, u = (c.hy - y) / c.f, d = 1, p = c.pitch ?? 0;
  const u0 = u * Math.cos(p) + d * Math.sin(p), d0 = d * Math.cos(p) - u * Math.sin(p);
  const dx = r * Math.cos(c.yaw) + d0 * Math.sin(c.yaw), dz = r * Math.sin(c.yaw) - d0 * Math.cos(c.yaw);
  const n = Math.hypot(dx, u0, dz);
  return [dx / n, u0 / n, dz / n];
};
export const MOON_DIR: V3 = rayDir(POSE_A, 790, 400);
const atInfinity = (c: YCam, d: V3): Pt | null => camPoint(c, [c.x + d[0] * 2000, c.y + d[1] * 2000, c.z + d[2] * 2000]);

/** Jupiter as seen from the street: the brightest steady cream dot (core 10 px, glow 40 px, no twinkle), `a` 0..1. */
export const paintJupiterDot = (p: Painter, x: number, y: number, a: number, sky: string) => {
  washAt(p, 7451, mixColor(sky, '#fff1cc', 0.22 * a), 90, ell(x, y, 20, 20, 20), 0.2, 0.2);
  washAt(p, 7452, mixColor(sky, '#fff1cc', 0.45 * a), 110, ell(x, y, 12, 12, 16), 0.2, 0.2);
  hardFill(p, 7453, mixColor(sky, '#fff6e0', a), ell(x, y, 5, 5, 14));
};

/** moon-phase (brief N7): a first-quarter Moon, lit half toward `litDeg` (0 = up, + = tipped right); the dark half shows as earthshine when `night`.
 *  W5.3 F2 polish: a soft glow, a thin limb line, an uneven terminator, maria and craters on the lit half, faint maria on the earthshine half. */
export const paintMoon = (p: Painter, x: number, y: number, r: number, o: {litDeg?: number; night?: number; fade?: number; sky?: string} = {}) => {
  const fade = o.fade ?? 1, n = o.night ?? 0, tilt = (o.litDeg ?? 12) * DEG;
  if (fade <= 0) return;
  const sky = o.sky ?? '#9fc6e2';
  const L: Pt = [Math.sin(tilt), -Math.cos(tilt)], P: Pt = [Math.cos(tilt), Math.sin(tilt)];
  const at = (s: number, t: number): Pt => [x + r * (s * L[0] + t * P[0]), y + r * (s * L[1] + t * P[1])];
  const col = (c: string, k = 1) => mixColor(sky, c, fade * k);
  const rot = (a: number): Pt => [x + r * Math.sin(tilt + a), y - r * Math.cos(tilt + a)];
  const dark = mixColor(sky, '#3a4466', 0.2 + 0.6 * n), det = n > 0.5; // the polish is for night shots; the small day Moon keeps its approved plain disc
  if (!det) { hardFill(p, 7301, mixColor(sky, dark, fade), ell(x, y, r, r, 28)); hardFill(p, 7302, col('#f2ecd8'), Array.from({length: 15}, (_, i) => rot(-Math.PI / 2 + (i / 14) * Math.PI))); return; }
  washAt(p, 7311, col('#f2ecd8', 0.25), 22 * n + 8, ell(x, y, r * 1.7, r * 1.7, 28), 0.9, 0.5); washAt(p, 7313, col('#f2ecd8', 0.35), 28 * n + 10, ell(x, y, r * 1.3, r * 1.3, 28), 0.9, 0.5); // glow
  hardFill(p, 7301, mixColor(sky, dark, fade), ell(x, y, r, r, 28));
  for (const [i, s, t, k] of [[0, -0.45, -0.25, 0.5], [1, -0.55, 0.3, 0.4], [2, -0.2, 0.0, 0.3]] as [number, number, number, number][]) // faint maria in the earthshine
    hardFill(p, 7320 + i, col(mixColor(dark, '#1a2244', 0.35), 1), ell(...at(s, t), r * 0.2 * (1 + k * 0.4), r * 0.15, 10, 0.3 * i));
  const limb = Array.from({length: 15}, (_, i) => rot(-Math.PI / 2 + (i / 14) * Math.PI));
  const term = Array.from({length: 6}, (_, i) => at(0.05 * Math.sin(i * 2.3 + 0.7) + 0.02, 1 - 2 * ((i + 1) / 7))); // irregular terminator, from the limb end back to its start
  hardFill(p, 7302, col('#f2ecd8'), [...limb, ...term]);
  // maria: grey-beige patches on the lit half; craters: a darker pit with a lighter lip
  for (const [i, s, t, rx, ry, a] of [[0, 0.42, -0.4, 0.2, 0.12, 0.5], [1, 0.66, 0.12, 0.13, 0.2, -0.4], [2, 0.3, 0.42, 0.12, 0.08, 0.2]] as number[][])
    hardFill(p, 7330 + i, col('#cbc3aa'), ell(...at(s, t), r * rx, r * ry, 12, a));
  for (const [i, s, t, k] of [[0, 0.7, -0.45, 0.09], [1, 0.25, -0.1, 0.07], [2, 0.5, 0.6, 0.08], [3, 0.82, 0.3, 0.05], [4, 0.14, 0.55, 0.06]] as number[][]) {
    hardFill(p, 7340 + i * 2, col('#fff9e8'), ell(...at(s - 0.015, t - 0.015), r * k * 1.18, r * k * 1.18, 10));
    hardFill(p, 7341 + i * 2, col('#a79f88'), ell(...at(s, t), r * k, r * k, 10));
  }
  p.ink(7360, 'rotring', mixColor(sky, '#c9c8c0', 0.35 * fade), 0.35); p.brush.spline([...limb, limb[0]], 0.05); // thin limb on the lit side
};

// ---- palette
const C = {
  skyTop: '#86bfe6', skyHaze: '#e3ecee', paving: '#c9c0b0', pavingShade: '#9b8f98', road: '#6d6a6e', wall: '#e9dcae', wallShade: '#b9a983', stain: '#c8b98f',
  bougain: '#c2367a', leaf: '#4f7a3a', cart: '#8fb8c0', rust: '#a5603c', glint: '#f4f8f6', papaya: '#9cc76a', tomato: '#d8483a', lime: '#7fb03a',
  clay: '#a8623c', wood: '#8a6340', umbA: '#e8893a', umbB: '#f3e6c8', stool: '#d0402f', shadow: '#6b5a7a', tower: '#c9d6df', pole: '#8f8b86',
};

export type SoiOpts = {
  night?: number; t: number;
  /** Pestle stroke 0 (tip down in the mortar) .. 1 (raised). */
  stroke?: number;
  /** Scales the stroke height (default 1): a close camera at a steep azimuth shortens the arm's screen reach (B05-SH02), so its stroke is lowered until the arm's hand and the fist travel together (W5.3 round 2). */
  strokeK?: number;
  ven?: false | {face?: Parameters<typeof paintPerson>[3]['face']; faceState?: Parameters<typeof paintPerson>[3]['faceState']; view?: 'front' | 'back'; at?: V3; pose?: Parameters<typeof paintPerson>[3]['pose'];
    /** Default true: pounding at the mortar (hands on the pestle and the rim). False: free arms (seated, pointing, standing back view). */
    pounding?: boolean; hands?: Parameters<typeof paintPerson>[3]['hands']; fig?: Parameters<typeof paintPerson>[3]['fig']; motion?: Parameters<typeof paintPerson>[3]['motion'];
    /** Redraw the pounding forearm over the head and pestle, by true depth (B05-SH02 close low camera: the fist is nearer the lens than her head). */
    armFront?: boolean;
    /** Steadying hand (her right) resting flat on the mortar rim, back of the hand up, fingers pointing along the rim, thumb on the near side, instead of the hooked ball (B05-SH02/SH03 close camera, where the ball read as a fist on her chin). */
    restHand?: boolean;
    /** Paint her after the cart and the mortar (she stands in front of the stall). */
    front?: boolean;
    /** Index finger out of the raised right hand (W5.3 F4): the pointing finger along the arm, the other fingers curled in the fist. */
    finger?: boolean};
  cus?: false | {face?: Parameters<typeof paintPerson>[3]['face']; faceState?: Parameters<typeof paintPerson>[3]['faceState']; view?: 'front' | 'back'; at?: V3; pose?: Parameters<typeof paintPerson>[3]['pose']; fig?: Parameters<typeof paintPerson>[3]['fig'];
    hands?: Parameters<typeof paintPerson>[3]['hands']; motion?: {id: MotionId; t: number};
    /** Folded paper menu in his hand: the flap angle (rad), drawn at the hand target `hands.r.to`. */
    fan?: number};
  /** Stool 2 position (SD07: moved beside CUS for the +1 h state). */
  stool2?: V3;
  /** Moon fade 0..1 (1 = lit). */
  moon?: number;
  /** Moon rim on the heads 0..1 (night only). */
  rim?: number;
  /** Star brightness override 0..1 (default from the night grade). */
  stars?: number;
  /** Faint Milky Way wash 0..1. */
  milky?: number;
  /** Jupiter's steady dot 0..1 (R07: absent before its cue). */
  jupiter?: number;
  /** Ground shadows: 'flat' = v1 washes; 'brush' = POC, p5.brush wash + charcoal hatch + pencil edge (user, 8 Nov 2026). */
  shadow?: 'flat' | 'brush' | 'watercolour';
  /** Painter over the textured (unwrapped) brush, for `shadow: 'watercolour'`. */
  wc?: Painter;
  /** Clip the painted sky/ground bases to y >= this (split frame street panel). */
  panelTop?: number;
};

const ringPts = (c: YCam, ctr: V3, r: number, n = 24): {w: V3; q: Pt | null}[] =>
  Array.from({length: n}, (_, i) => { const a = (i / n) * Math.PI * 2, w: V3 = [ctr[0] + r * Math.cos(a), ctr[1], ctr[2] + r * Math.sin(a)]; return {w, q: camPoint(c, w)}; });

/** Tapered cylinder (mortar, stool): hull of the bottom and top rings, plus the visible top disc. */
const taper = (p: Painter, c: YCam, seed: number, ctr: V3, rBot: number, rTop: number, h: number, col: string, o: {ink?: boolean; topCol?: string; inner?: string} = {}) => {
  const bot = ringPts(c, ctr, rBot).map((o2) => o2.q).filter(Boolean) as Pt[];
  const top = ringPts(c, [ctr[0], ctr[1] + h, ctr[2]], rTop).map((o2) => o2.q).filter(Boolean) as Pt[];
  const body = hull([...bot, ...top]);
  if (body.length < 3) return;
  hardFill(p, seed, col, body);
  if (top.length > 3) {
    hardFill(p, seed + 1, o.topCol ?? mixColor(col, '#fff4dc', 0.25), top);
    if (o.inner) hardFill(p, seed + 2, o.inner, ringPts(c, [ctr[0], ctr[1] + h, ctr[2]], rTop * 0.78).map((o2) => o2.q).filter(Boolean) as Pt[]);
  }
  if (o.ink) { p.ink(seed + 3, 'rotring', mixColor(col, INK, 0.6), 0.8); p.brush.spline([...body, body[0]], 0.1); }
};


// ---- POC ground shadows painted with the brush (user, 8 Nov 2026). Light from the upper right: a point at height h throws its shadow LX*h in x and LZ*h in z (to the left and back, as the v1 stool shadow).
const LX = -0.6, LZ = -0.24;
const cast = (v: V3): V3 => [v[0] + LX * v[1], 0.004, v[2] + LZ * v[1]];
const hullGround = (c: YCam, pts: V3[]): Pt[] => hull(pts.map(cast).map((v) => camPoint(c, v)).filter(Boolean) as Pt[]);
const circ3 = (ctr: V3, r: number, y: number, rz = r, n = 14): V3[] => Array.from({length: n}, (_, i) => [ctr[0] + r * Math.cos((i / n) * 6.283), y, ctr[2] + rz * Math.sin((i / n) * 6.283)]);
const boxPts = (b: Box): V3[] => [b.x0, b.x1].flatMap((x) => [b.y0, b.y1].flatMap((y) => [b.z0, b.z1].map((z): V3 => [x, y, z])));
/** Cyrus-Beck: the part of segment a-b inside a convex polygon, or null. */
const clipSeg = (poly: Pt[], a: Pt, b: Pt): [Pt, Pt] | null => {
  let t0 = 0, t1 = 1;
  const area = poly.reduce((acc, q, i) => { const r2 = poly[(i + 1) % poly.length]; return acc + q[0] * r2[1] - r2[0] * q[1]; }, 0), sg = area >= 0 ? 1 : -1;
  for (let i = 0; i < poly.length; i++) {
    const q = poly[i], r2 = poly[(i + 1) % poly.length], ex = r2[0] - q[0], ey = r2[1] - q[1];
    const nx = -ey * sg, ny = ex * sg, num = nx * (a[0] - q[0]) + ny * (a[1] - q[1]), den = nx * (b[0] - a[0]) + ny * (b[1] - a[1]);
    if (Math.abs(den) < 1e-9) { if (num > 0) return null; continue; }
    const t = -num / den;
    if (den > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 > t1) return null;
  }
  return [[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]];
};
/** Watercolour shadow (POC round 2): p5.brush's own fill (bleed + texture) on the unwrapped brush, three layers: a soft wide wash, a smaller darker wet-in-wet pool offset toward the object, a thin pigment-pooled rim. No hatching, no ink. */
const wcShadow = (q: Painter, id: number, col: string, poly: Pt[]) => {
  if (poly.length < 3 || !poly.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))) return;
  const cx = poly.reduce((a, b) => a + b[0], 0) / poly.length, cy = poly.reduce((a, b) => a + b[1], 0) / poly.length;
  const soft = (pts: Pt[]): Pt[] => pts.flatMap((a, i) => { const b = pts[(i + 1) % pts.length]; return [[a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]] as Pt[]; });
  const shrink = (pts: Pt[], k: number): Pt[] => pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
  const layer = (n: number, color: string, op: number, pts: Pt[], bleed: number, tex: number, border: number) => {
    const b = q.brush;
    b.seed(id * 31 + n); b.noiseSeed(id * 31 + n);
    b.noStroke(); b.fill(color, op); b.fillBleed(bleed); b.fillTexture(tex, border); b.polygon(pts); b.noFill();
  };
  const base = soft(soft(poly));
  layer(1, col, 70, base, 0.55, 0.6, 0.7);
  layer(2, mixColor(col, '#4a3a66', 0.4), 55, shrink(base, 0.78), 0.7, 0.8, 0.5);
  layer(3, mixColor(col, '#4a3a66', 0.25), 30, shrink(base, 0.97), 0.3, 0.4, 1.0);
};

/** One shadow shape in brush: a translucent wash for the body, charcoal hatching across it, a wobbly pencil edge. */
const brushShadow = (p: Painter, id: number, col: string, poly: Pt[], gap = 22) => {
  if (poly.length < 3 || !poly.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))) return;
  washAt(p, id, col, 120, poly, 0.1, 0.2);
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const dark = mixColor(col, '#4a3a66', 0.35);
  p.ink(id + 1, 'charcoal', dark, 0.5);
  const slope = 0.55; // stroke direction: up and to the right, across the shadow
  for (let k = 0, y = y0 - (x1 - x0) * slope; y < y1; k++, y += gap) {
    const j = hash(id * 13 + k), seg = clipSeg(poly, [x0 - 10, y + (hash(id + k * 3) - 0.5) * 5], [x1 + 10, y - (x1 - x0 + 20) * slope + (j - 0.5) * 8]);
    if (seg && Math.hypot(seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]) > 12) p.brush.line(seg[0][0], seg[0][1], seg[1][0], seg[1][1]);
  }
  p.ink(id + 2, 'cpencil', dark, 0.9);
  p.brush.spline([...poly, poly[0], poly[1]], 0.5);
};

/** Cool Moon rim on the Moon side of a head (night): a thin crescent hugging the hair outline toward the Moon's screen position `toward`, from the figure's head anchors.
 *  W5.3 F3: it was a long band fixed to the right of every head (outside the hair on CUS, the wrong side for a Moon up-left). */
const moonRim = (p: Painter, a: {head: Pt; headTop: number; chin: number} | null, seed: number, toward: Pt, k = 1) => {
  if (!a) return;
  const gap = a.head[1] - a.headTop, R = 0.86 * gap, cx = a.head[0], cy = a.headTop - 0.24 * gap + R;
  const ang = Math.atan2(toward[1] - cy, toward[0] - cx), hw = 0.75;
  const arc = (rr: number, w: number): Pt[] => Array.from({length: 13}, (_, i) => { const t = -1 + (2 * i) / 12, aa = ang + t * hw * w; return [cx + rr * Math.cos(aa), cy + rr * Math.sin(aa)] as Pt; });
  const outer = arc(R * 0.99, 1), inner = Array.from({length: 13}, (_, i) => { const t = -1 + (2 * i) / 12, aa = ang + t * hw, th = (1 - t * t) * 0.07 * R + 0.5; return [cx + (R * 0.99 - th) * Math.cos(aa), cy + (R * 0.99 - th) * Math.sin(aa)] as Pt; }).reverse();
  washAt(p, seed, '#b9c6e8', 105 * k, [...outer, ...inner], 0.1, 0.2);
};

/** A folded paper menu in CUS's hand (fan-self): a cream fan of three folds at the hand target, tilted by the flap angle `a` (rad). */
const paintFan = (p: Painter, c: YCam, at: V3, a: number) => {
  const q = camPoint(c, at), u = camUnit(c, at);
  if (!q) return;
  const s = 0.2 * u, ang = -1.1 + a, w = 0.16;
  const dir = (k: number): Pt => [Math.cos(ang + k) * s, Math.sin(ang + k) * s];
  const pts: Pt[] = [[q[0], q[1]], [q[0] + dir(-w)[0], q[1] + dir(-w)[1]], [q[0] + dir(0)[0] * 1.06, q[1] + dir(0)[1] * 1.06], [q[0] + dir(w)[0], q[1] + dir(w)[1]]];
  hardFill(p, 590, '#f1e6c8', pts);
  for (let i = 0; i < 3; i++) {
    const k = -w + (w * i) / 1.0, d = dir(k);
    p.ink(591 + i, 'rotring', mixColor('#c8b98f', INK, 0.5), 0.5); p.brush.spline([[q[0], q[1]], [q[0] + d[0] * 0.5, q[1] + d[1] * 0.5], [q[0] + d[0], q[1] + d[1]]], 0.1);
  }
  p.ink(595, 'rotring', mixColor('#c8b98f', INK, 0.6), 0.7); p.brush.spline([...pts, pts[0]], 0.1);
};

/** The index finger of a raised hand (back view, W5.3 G5): the kit hand's own shade (`skinShade` of back.ts) and ink outline, rooted at the thumb side (left on her right hand from behind) and angled about 22 deg left of the arm so it cannot read as the middle finger; two small knuckles on the right show the curled fingers. */
const paintIndexFinger = (p: Painter, f: NonNullable<ReturnType<typeof paintPerson>>, c: YCam, u: number) => {
  const h = f.rHand, sh = f.rShoulder;
  const dx = h[0] - sh[0], dy = h[1] - sh[1], dl = Math.hypot(dx, dy) || 1, phi = -22 * DEG;
  const bx = dx / dl, by = dy / dl, ax = bx * Math.cos(phi) - by * Math.sin(phi), ay = bx * Math.sin(phi) + by * Math.cos(phi), nx = -ay, ny = ax;
  const skinShade = mixColor(VEN.head.skin, VD18.shadow, 0.2), len = 0.092 * u, w = 0.0145 * u;
  const o0: Pt = [h[0] - 0.02 * u, h[1] - 0.03 * u]; // root inside the hand, on its left
  const pt = (s2: number, ww: number): Pt => [o0[0] + ax * len * s2 + nx * ww, o0[1] + ay * len * s2 + ny * ww];
  const prof: [number, number][] = [[0, 1], [0.45, 0.92], [0.8, 0.8], [0.96, 0.62], [1, 0.3]];
  const edge: Pt[] = [...prof.map(([s2, k]) => pt(s2, w * k)), ...prof.slice().reverse().map(([s2, k]) => pt(s2, -w * k))];
  for (const [kx, ky] of [[0.008, -0.04], [0.026, -0.036]]) { // curled fingers: two knuckle bumps on the right of the hand top
    const kn = ell(h[0] + kx * u, h[1] + ky * u, 0.015 * u, 0.012 * u, 10);
    hardFill(p, 572 + (kx > 0.01 ? 1 : 0), skinShade, kn); p.ink(574 + (kx > 0.01 ? 1 : 0), 'rotring', INK, 0.8); p.brush.spline([...kn, kn[0]], 0.1);
  }
  hardFill(p, 570, skinShade, edge);
  p.ink(571, 'rotring', INK, 0.9); p.brush.spline([...edge, edge[0]], 0.1);
  void c;
};

export const paintSoi = (p0: Painter, c: YCam, o: SoiOpts): {ven: ReturnType<typeof paintPerson>; cus: ReturnType<typeof paintPerson>} => {
  const n = o.night ?? 0;
  // the figures, props and set go through the night grade; the sky, stars and Moon are painted at their own night values
  const p = n > 0 ? tintPainter(p0, '#0e1a40', 0.55 * n, {mul: [1 - 0.55 * n, 1 - 0.45 * n, 1 - 0.14 * n], brush: true}) : tintPainter(p0, '#ffc878', 0.09, {mul: [1.04, 1.0, 0.93], brush: true});
  const pf = n > 0 ? tintPainter(p0, '#12214a', 0.4 * n, {mul: [1 - 0.28 * n, 1 - 0.2 * n, 1 - 0.02 * n], brush: true}) : p;
  const yH = c.hy + c.f * Math.tan(c.pitch ?? 0);
  const top = o.panelTop ?? -160;

  // 1 sky + stars + Moon + far towers
  const dayTop = C.skyTop, nightTop = '#0b1230';
  const skyTop = mixColor(dayTop, nightTop, n), skyLow = mixColor(C.skyHaze, '#1c2a50', n);
  hardFill(p0, 1, mixColor(C.paving, '#2a2f4a', n), [[-160, yH - 40], [1240, yH - 40], [1240, 2100], [-160, 2100]]);
  paintSkyBands(p0, {from: skyTop, to: skyLow, via: mixColor('#b4d6ea', '#131c3e', n), viaAt: 0.55, horizon: yH + 6, width: 1080, top, bands: 9});
  if (n > 0.02 || (o.stars ?? 0) > 0.02) {
    paintStars(p0, c, mixColor(skyTop, skyLow, 0.4), {seed: 5, count: 190, alpha: o.stars ?? Math.max(0, (n - 0.35) / 0.65), t: o.t, upper: true, rect: [0, Math.max(0, top), 1080, yH]});
    p0.wash('#2b3566', 45 * n, [[-120, yH - 700], [1200, yH - 980], [1200, yH - 760], [-120, yH - 440]], 0.5, 0.3);
  }
  const moon = atInfinity(c, MOON_DIR);
  if (moon && o.moon !== 0 && moon[1] > top + 20) paintMoon(p0, moon[0], moon[1], 31, {night: n, fade: o.moon ?? 1, sky: mixColor('#a9cde6', '#101c44', n)});
  if ((o.milky ?? 0) > 0.02) { // a faint Milky Way: a soft diagonal band of pale washes over the stars
    const mk = o.milky!, a = atInfinity(c, [0.55, 0.62, -0.56]), b = atInfinity(c, [-0.45, 0.9, -0.05]);
    if (a && b) for (let i = 0; i < 7; i++) {
      const u = i / 6, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u, r = 300 - 40 * Math.abs(u - 0.5) * 2;
      washAt(p0, 7400 + i, mixColor(skyTop, '#8c9ad0', 0.5), 36 * mk, ell(x, y, r, r * 0.28, 22, Math.atan2(b[1] - a[1], b[0] - a[0])), 0.5, 0.3);
    }
  }
  if ((o.jupiter ?? 0) > 0.01) {
    const j = atInfinity(c, JUP_DIR);
    if (j && j[1] > top + 4) paintJupiterDot(p0, j[0], j[1], o.jupiter!, mixColor(skyTop, skyLow, 0.4));
  }
  // far towers (sky cards at z -80, hazy)
  for (const [x0, x1, hgt, k] of [[-95, -70, 85, 0], [-60, -48, 55, 1], [-4, 14, 95, 0], [18, 36, 60, 1]] as [number, number, number, number][]) {
    wFill(p, c, 20 + k, mixColor(C.tower, '#26335a', n * 0.8), qz(-250, x0, x1, 0, hgt));
    wWash(p, c, 24 + k, mixColor('#b9c8d4', '#1c2850', n * 0.8), 70, qz(-250, x0 + 1, x1 - 1, hgt * 0.4, hgt * 0.95), 0.1);
  }
  // rain tree canopy beyond the wall (upper left): soft green blobs
  for (let i = 0; i < 16; i++) {
    const b = sphereAt(c, [-7.2 + (hash(i) - 0.5) * 6.5, 5.6 + (hash(i + 30) - 0.5) * 3.0, -6.5 + hash(i + 60) * 0.8], 1.5 + hash(i + 90) * 0.8);
    if (b) {
      washAt(p, 40 + i, mixColor(i % 3 ? '#4f7a3a' : '#6d9448', '#2b3a2e', n * 0.4), 150, ell(b.x, b.y, b.r, b.r * 0.8, 26, hash(i) * 6), 0.5, 0.4);
      for (let k = 0; k < 5; k++) { // leaf clumps, lit on the upper right
        const lx = b.x + (hash(i * 7 + k) - 0.4) * b.r * 1.3, ly = b.y + (hash(i * 11 + k) - 0.6) * b.r * 1.0;
        washAt(p, 600 + i * 6 + k, mixColor(k % 2 ? '#86a85a' : '#3f6a34', '#14203a', n * 0.5), 170, ell(lx, ly, b.r * 0.3, b.r * 0.22, 14, hash(k + i) * 6), 0.4, 0.5);
      }
    }
  }
  wFill(p, c, 60, mixColor('#5b4a3a', '#1a1620', n), [[-4.7, 0, -6], [-4.3, 0, -6], [-4.1, 5, -6.5], [-4.9, 5, -6.5]]);

  // 2 ground: paving, kerb, road, cracks, umbrella shadow
  wFill(p, c, 70, mixColor(C.paving, '#e0d8c4', 0), qy(0, -8, 12, WALL_Z, 0.9));
  wWash(p, c, 71, '#d9d0bc', 120, qy(0, -2.5, 3.5, -1.0, 0.7), 0.3, 0.55);
  wFill(p, c, 72, '#ada596', qy(0, -8, 12, 0.78, 0.9));
  wFill(p, c, 73, mixColor(C.road, '#e0d8c4', 0), [[-8, -0.12, 0.9], [12, -0.12, 0.9], [12, -0.12, 7], [-8, -0.12, 7]]);
  wFill(p, c, 74, '#d8d4c8', [[-8, -0.12, 1.35], [12, -0.12, 1.35], [12, -0.12, 1.43], [-8, -0.12, 1.43]]);
  for (let x = -3; x <= 4; x += 1.0) wInk(p, c, 76 + Math.round(x + 3), [[x, 0.002, WALL_Z], [x + 0.02, 0.002, -0.6], [x - 0.02, 0.002, 0.78]], {closed: false, weight: 0.45, color: mixColor('#a89e8c', INK, 0.12)});
  for (let i = 0; i < 9; i++) { // cracks and wear
    const x0 = -2.4 + hash(i * 3) * 6.2, z0 = -1.6 + hash(i * 5 + 1) * 2.2;
    wInk(p, c, 80 + i, [[x0, 0, z0], [x0 + 0.22, 0, z0 + 0.1 + hash(i) * 0.2], [x0 + 0.5, 0, z0 + 0.05], [x0 + 0.8, 0, z0 + 0.3]], {closed: false, weight: 0.5, color: mixColor('#8c8374', INK, 0.2)});
  }
  const sh = mixColor(C.shadow, '#0b1230', n * 0.4);
  const umbC: V3 = [UMB_POLE[0] - 0.3, 0.004, UMB_POLE[2] - 0.45];
  if (o.shadow === 'brush' || o.shadow === 'watercolour') {
    const shc = mixColor(sh, '#8a7aa6', 0.1), hs = (id: number, pts: V3[], gap?: number) => (o.shadow === 'watercolour' && o.wc ? wcShadow(o.wc, id, shc, hullGround(c, pts)) : brushShadow(p, id, shc, hullGround(c, pts), gap));
    hs(1200, circ3(UMB_POLE, UMB_R * 1.02, UMB_Y, UMB_R * 0.92, 28), 22);
    hs(1210, [...boxPts({x0: -0.8, x1: 0.8, y0: 0, y1: 0.89, z0: -0.7, z1: 0}), ...boxPts({x0: -0.78, x1: 0.0, y0: 0.89, y1: 1.36, z0: -0.68, z1: -0.36})], 16);
    hs(1220, [...circ3(o.stool2 ?? STOOL2_DAY, 0.19, 0, 0.19, 10), ...circ3(o.stool2 ?? STOOL2_DAY, 0.18, 0.45, 0.18, 10)], 10);
    if (o.cus !== false) { const at = o.cus?.at ?? CUS_AT; hs(1230, [...circ3(at, 0.22, 0, 0.22, 10), ...circ3(at, 0.2, 0.47, 0.2, 10), ...circ3(at, 0.17, 1.32, 0.15, 10)], 14); }
    if (o.ven !== false) { const at = o.ven?.at ?? VEN_AT; hs(1250, [...circ3(at, 0.2, 0, 0.2, 10), ...circ3(at, 0.17, 1.4, 0.15, 10)], 12); }
    hs(1260, boxPts({x0: -1.55, x1: -1.05, y0: 0, y1: 0.3, z0: -0.5, z1: -0.15}), 10);
  } else {
  washAt(p, 90, sh, 130, flatCircle(c, umbC, UMB_R * 1.05, 28), 0.15, 0.4);
    washAt(p, 91, sh, 70, flatCircle(c, [umbC[0] + 0.1, 0.004, umbC[2] + 0.05], UMB_R * 0.85, 24), 0.2, 0.4);
  }

  // 3 boundary wall + coping + stains + bougainvillea
  const wallCol = mixColor(C.wall, '#9a8c68', 0);
  wFill(p, c, 100, wallCol, qz(WALL_Z, -8, 3.2, 0, WALL_H));
  wFill(p, c, 101, mixColor(C.wallShade, C.wall, 0.4), qz(WALL_Z, -8, 3.2, 0, 0.16));
  wFill(p, c, 102, '#d8caa0', qz(WALL_Z, -8.05, 3.25, WALL_H, WALL_H + 0.1));
  wFill(p, c, 103, C.wallShade, [[-8.05, WALL_H, WALL_Z], [3.25, WALL_H, WALL_Z], [3.25, WALL_H, WALL_Z - 0.2], [-8.05, WALL_H, WALL_Z - 0.2]]);
  for (let i = 0; i < 12; i++) { // rain stains and panel joints
    const x = -3 + hash(i * 2) * 6, w = 0.12 + hash(i * 3 + 1) * 0.3;
    wWash(p, c, 110 + i, C.stain, 70, qz(WALL_Z + 0.001, x, x + w, 0.3 + hash(i) * 0.6, WALL_H - 0.05), 0.35, 0.6);
  }
  for (let x = -3; x <= 3; x += 1.6) wInk(p, c, 130 + Math.round(x * 2), [[x, 0.05, WALL_Z + 0.002], [x, 0.9, WALL_Z + 0.002], [x, 1.85, WALL_Z + 0.002]], {closed: false, weight: 0.5, color: mixColor(C.wallShade, INK, 0.25)});
  for (let i = 0; i < 46; i++) { // bougainvillea spill over the coping
    const pt: V3 = [-2.5 + hash(i * 1.3) * 2.2, 1.45 + hash(i * 2.7 + 5) * 1.25, WALL_Z + 0.04 + hash(i) * 0.12];
    const b = sphereAt(c, pt, 0.11 + hash(i * 4.1) * 0.12);
    if (!b) continue;
    const pink = hash(i * 9) > 0.32;
    washAt(p, 150 + i, mixColor(pink ? C.bougain : C.leaf, '#1a1620', n * 0.3), 220, ell(b.x, b.y, b.r, b.r * 0.8, 9), 0.2, 0.4);
    if (pink && i % 4 === 0) hardFill(p, 250 + i, mixColor('#e25a9a', '#1a1620', n * 0.3), ell(b.x - b.r * 0.2, b.y - b.r * 0.2, b.r * 0.45, b.r * 0.35, 8));
  }

  // 4 utility pole and the cable drops (the pole runs out of frame; the coil and long spans are above the picture)
  const POLE: V3 = [-2.0, 0, -1.25];
  wFill(p, c, 300, mixColor(C.pole, '#2a2f4a', n * 0.7), [[POLE[0] - 0.14, 0, POLE[2]], [POLE[0] + 0.14, 0, POLE[2]], [POLE[0] + 0.12, 9, POLE[2]], [POLE[0] - 0.12, 9, POLE[2]]]);
  wFill(p, c, 301, mixColor('#6f6b66', '#1a1f38', n * 0.7), [[POLE[0] + 0.1, 0, POLE[2]], [POLE[0] + 0.14, 0, POLE[2]], [POLE[0] + 0.12, 9, POLE[2]], [POLE[0] + 0.09, 9, POLE[2]]]);
  for (let k = 0; k < 4; k++) { // service drops: pole -> bracket on the wall, with sag
    const y0 = 4.6 - k * 0.32, wx = POLE[0] + 3.2 + k * 0.5;
    wInk(p, c, 310 + k, [[POLE[0], y0, POLE[2]], [POLE[0] + 1.1, y0 - 0.5 - k * 0.04, POLE[2] - 0.3], [POLE[0] + 2.2, y0 - 0.62, POLE[2] - 0.55], [wx, y0 - 0.15, WALL_Z + 0.2]], {closed: false, weight: 0.7, color: mixColor('#2b2a2e', '#0b1230', n * 0.5)});
  }

  // 5 umbrella (underside seen from below), stripes, rim, ink ribs
  const apex: V3 = [UMB_POLE[0], UMB_TOP, UMB_POLE[2]], cn = 12;
  const rim = (i: number): V3 => { const a = (i / cn) * Math.PI * 2; return [UMB_POLE[0] + UMB_R * Math.cos(a), UMB_Y, UMB_POLE[2] + UMB_R * Math.sin(a) * 0.9]; };
  const order = Array.from({length: cn}, (_, i) => i).sort((a, b) => camDist(c, rim(b)) - camDist(c, rim(a)));
  wFill(p, c, 320, mixColor('#7e6a6e', '#1a1620', n * 0.3), [[UMB_POLE[0] - 0.03, 0, UMB_POLE[2]], [UMB_POLE[0] + 0.03, 0, UMB_POLE[2]], [UMB_POLE[0] + 0.03, UMB_TOP, UMB_POLE[2]], [UMB_POLE[0] - 0.03, UMB_TOP, UMB_POLE[2]]]);
  order.forEach((i) => {
    const col = mixColor(i % 2 ? C.umbA : C.umbB, '#6b4a3a', 0.12);
    wFill(p, c, 330 + i, col, [rim(i), rim(i + 1), apex]);
  });
  wInk(p, c, 369, Array.from({length: cn}, (_, i) => rim(i)), {weight: 0.8, color: mixColor('#6b4a3a', INK, 0.4)});
  for (let i = 0; i < cn; i++) wInk(p, c, 370 + i, [apex, [(rim(i)[0] + apex[0]) / 2, (UMB_TOP + UMB_Y) / 2, (rim(i)[2] + apex[2]) / 2], rim(i)], {closed: false, weight: 0.5, color: mixColor('#6b4a3a', INK, 0.4)});

  // 6 crate + papayas (set dressing), then VEN and the cart
  paintBox(p, c, 400, {x0: -1.55, x1: -1.05, y0: 0, y1: 0.3, z0: -0.5, z1: -0.15}, '#a8895a', {}, {ink: true, grain: 60});
  for (let i = 0; i < 4; i++) { const b = sphereAt(c, [-1.45 + i * 0.12, 0.38, -0.33 + (i % 2) * 0.08], 0.08); if (b) hardFill(p, 410 + i, C.papaya, ell(b.x, b.y, b.r * 1.2, b.r, 10)); }
  // stool 2 (empty)
  const st2 = o.stool2 ?? STOOL2_DAY;
  taper(p, c, 430, st2, 0.19, 0.18, 0.45, mixColor(C.stool, '#1a1620', n * 0.3), {ink: true, topCol: mixColor(C.stool, '#ffd2bd', 0.2)});

  const out = {ven: null as ReturnType<typeof paintPerson>, cus: null as ReturnType<typeof paintPerson>};
  const {tip, top: top2, grip: gripW} = pestleGeom((o.stroke ?? 0.6) * (o.strokeK ?? 1));
  const shadeVen: [string, number, [number, number, number]] = ['#7e6a6e', n > 0 ? 0 : 0.2, [0.93, 0.92, 0.97]];
  const pounding = o.ven !== false && (o.ven?.pounding ?? true) && (o.ven?.view ?? 'front') === 'front';
  const placeVen = () => {
    if (o.ven === false) return;
    const v = o.ven ?? {};
    const handL: V3 = gripW, handR: V3 = v.restHand ? REST_HAND : [MORTAR[0] - 0.14, MORTAR[1] + 0.3, MORTAR[2] + 0.1];
    out.ven = paintPerson(pf, c, VEN, {at: v.at ?? VEN_AT, view: v.view ?? 'front', pose: v.pose ?? 'P01', face: v.face ?? 'happy', faceState: v.faceState, t: o.t, grade: shadeVen, fig: v.fig, motion: v.motion,
      hands: v.hands ?? (pounding ? {r: {to: handR, out: -1}, l: {to: handL, out: 1}} : undefined)});
    if (v.finger && out.ven) paintIndexFinger(tintPainter(pf, shadeVen[0], shadeVen[1], {brush: true, mul: shadeVen[2]}), out.ven, c, camUnit(c, v.at ?? VEN_AT));
  };
  if (!o.ven || !o.ven.front) placeVen();
  // cart: body, wheels, counter, cabinet
  const body: Box = {x0: -0.8, x1: 0.8, y0: 0.12, y1: 0.85, z0: -0.7, z1: 0};
  const cartCol = mixColor(C.cart, '#1a2a50', n * 0.2);
  paintBox(p, c, 440, body, cartCol, {front: 0.02, right: 0.22}, {ink: true, grain: 55});
  // body panel details: a rust band and a lower rail
  wFill(p, c, 450, mixColor(C.rust, '#1a1620', n * 0.3), qz(0.002, -0.8, 0.8, 0.62, 0.7));
  wFill(p, c, 451, mixColor(C.rust, '#3a2418', 0.3), qz(0.002, -0.8, 0.8, 0.12, 0.2));
  for (const wx of [-0.62, 0.62]) { const b = sphereAt(c, [wx, 0.11, -0.02], 0.12); if (b) { hardFill(p, 455 + (wx > 0 ? 1 : 0), '#2b2a2e', ell(b.x, b.y, b.r, b.r, 14)); hardFill(p, 457 + (wx > 0 ? 1 : 0), '#8c8a86', ell(b.x, b.y, b.r * 0.45, b.r * 0.45, 10)); } }
  paintBox(p, c, 460, {x0: -0.84, x1: 0.84, y0: 0.85, y1: 0.89, z0: -0.74, z1: 0.04}, mixColor('#b87a4c', '#1a1620', n * 0.3), {top: -0.1}, {ink: true});
  // glass cabinet (left half of the counter, back): frame, glass, produce
  const cab: Box = {x0: -0.78, x1: 0.0, y0: 0.89, y1: 1.36, z0: -0.68, z1: -0.36};
  paintBox(p, c, 470, cab, mixColor('#d8d2c2', '#1a2a50', n * 0.2), {front: 0.1, right: 0.18, top: -0.05}, {ink: true});
  wFill(p, c, 480, mixColor('#9fc9cf', '#1a2a50', n * 0.3), qz(-0.355, -0.74, -0.04, 0.95, 1.31));
  const prod: [number, number, string][] = [[-0.6, 1.0, C.tomato], [-0.46, 1.02, C.lime], [-0.3, 1.0, C.papaya], [-0.16, 1.03, C.tomato], [-0.52, 1.18, C.papaya], [-0.34, 1.2, C.lime], [-0.2, 1.17, C.tomato], [-0.64, 1.22, C.lime]];
  prod.forEach(([x, y, col], i) => { const b = sphereAt(c, [x, y, -0.36], 0.07); if (b) hardFill(p, 490 + i, col, ell(b.x, b.y, b.r * 1.15, b.r, 10)); });
  wFill(p, c, 500, mixColor(C.glint, '#9fb4d8', n * 0.5), [[-0.7, 1.31, -0.352], [-0.52, 1.31, -0.352], [-0.64, 0.95, -0.352], [-0.72, 0.95, -0.352]]);
  wInk(p, c, 505, [[-0.74, 0.95, -0.352], [-0.74, 1.31, -0.352], [-0.04, 1.31, -0.352], [-0.04, 0.95, -0.352]], {weight: 0.6, color: mixColor('#6a5a4a', INK, 0.3)});
  // chilli bowls on the counter (front, left) and the lime bowl
  for (let i = 0; i < 3; i++) { const b = sphereAt(c, [-0.5 + i * 0.18, 0.93, -0.12], 0.07); if (b) { hardFill(p, 510 + i, '#e8e0cc', ell(b.x, b.y, b.r * 1.2, b.r * 0.55, 10)); hardFill(p, 513 + i, i === 1 ? '#c8382a' : C.lime, ell(b.x, b.y - b.r * 0.15, b.r * 0.9, b.r * 0.4, 8)); } }
  // mortar, pestle
  const mq = (r: number, y: number) => ringPts(c, [MORTAR[0], y, MORTAR[2]], r, 24);
  const camPos: V3 = [c.x, 0, c.z];
  // The ring starts at angle 0, so its front half can wrap the array end: rotate it to start at the first front point, or the wall polygon (front rim + reversed front base) twists and leaves the pestle uncovered (W5.3 F5/F6)
  const frontHalf = (arr: {w: V3; q: Pt | null}[], ctr: V3) => {
    const fr = arr.map((a) => (a.w[0] - ctr[0]) * (camPos[0] - ctr[0]) + (a.w[2] - ctr[2]) * (camPos[2] - ctr[2]) >= 0), n2 = arr.length;
    const i0 = Math.max(0, fr.findIndex((f, i) => f && !fr[(i + n2 - 1) % n2]));
    return Array.from({length: n2}, (_, k) => (i0 + k) % n2).filter((i) => fr[i]).map((i) => arr[i].q).filter(Boolean) as Pt[];
  };
  taper(p, c, 520, MORTAR, 0.1, 0.15, 0.28, mixColor(C.clay, '#1a1620', n * 0.3), {ink: false, topCol: mixColor(C.clay, '#fff4dc', 0.2), inner: mixColor('#3a2418', '#0b1230', n * 0.3)});
  // pestle (krok): a tapered wooden handle with a bulged, rounded head at the hitting end (the bottom)
  const pq = [camPoint(c, tip), camPoint(c, top2)];
  if (pq[0] && pq[1]) {
    const u = camUnit(c, tip), dx = pq[1][0] - pq[0][0], dy = pq[1][1] - pq[0][1], dl = Math.hypot(dx, dy) || 1, ax = dx / dl, ay = dy / dl, nx = -ay, ny = ax;
    const prof: [number, number][] = [[0, 0.014], [0.02, 0.030], [0.06, 0.042], [0.12, 0.048], [0.2, 0.044], [0.28, 0.034], [0.38, 0.027], [0.7, 0.024], [0.97, 0.022], [1, 0.013]];
    const at = (s2: number, w: number, side: number): Pt => [pq[0]![0] + ax * dl * s2 + nx * w * u * side, pq[0]![1] + ay * dl * s2 + ny * w * u * side];
    const edge = [...prof.map(([s2, w]) => at(s2, w, 1)), ...prof.slice().reverse().map(([s2, w]) => at(s2, w, -1))];
    const woodCol = mixColor(C.wood, '#1a1620', n * 0.3);
    hardFill(p, 530, woodCol, edge);
    hardFill(p, 531, mixColor(C.wood, '#e8c89a', 0.28), prof.map(([s2, w]) => at(s2, w * 0.3, -0.45)).concat(prof.slice().reverse().map(([s2, w]) => at(s2, w * 0.85, -0.2)))); // lit stripe on the light (right) side
    p.ink(532, 'rotring', mixColor(C.wood, INK, 0.65), 0.6); p.brush.spline([...edge, edge[0]], 0.12);
  }
  // front wall of the mortar over the pestle's lower end
  const rimF = frontHalf(mq(0.15, MORTAR[1] + 0.28), [MORTAR[0], 0, MORTAR[2]]), baseF = frontHalf(mq(0.1, MORTAR[1]), [MORTAR[0], 0, MORTAR[2]]);
  if (rimF.length > 2 && baseF.length > 2) hardFill(p, 540, mixColor(C.clay, '#1a1620', n * 0.3), [...rimF, ...baseF.slice().reverse()]);
  // armFront: the forearm next to the fist is nearer the lens than her head and the pestle; redraw it from a screen-space elbow (right of, below the fist) to the fist, under the mortar wall
  if (out.ven && pounding && o.ven?.armFront) {
    const fpA = camPoint(c, gripW);
    if (fpA) {
      const E: Pt = [fpA[0] + Math.sin(1.0) * 190, fpA[1] + Math.cos(1.0) * 190]; // drawn elbow in screen space, right of and a little below the fist: her left arm arrives from the screen-right (about 57 deg from vertical)
      const uA = camUnit(c, VEN_AT), skinA = VEN.head.skin, colA = mixColor(skinA, '#7e6a6e', n > 0 ? 0 : 0.2);
      const dx = fpA[0] - E[0], dy = fpA[1] - E[1], dl = Math.hypot(dx, dy) || 1, nx = -dy / dl, ny = dx / dl, w0 = 0.04 * uA / 2, w1 = 0.034 * uA / 2;
      const quad: Pt[] = [[E[0] + nx * w0, E[1] + ny * w0], [fpA[0] + nx * w1, fpA[1] + ny * w1], [fpA[0] - nx * w1, fpA[1] - ny * w1], [E[0] - nx * w0, E[1] - ny * w0]];
      hardFill(p, 533, colA, quad);
      p.ink(534, 'rotring', mixColor(skinA, INK, 0.6), 0.6); p.brush.spline([...quad, quad[0]], 0.1);
    }
  }
  // VEN's hands over the pestle (grip), drawn again on top of the cart
  if (out.ven && pounding) {
    const skin = VEN.head.skin, handCol = mixColor(skin, '#7e6a6e', n > 0 ? 0 : 0.2);
    const u = camUnit(c, VEN_AT), edgeC = mixColor(skin, INK, 0.6), fingerC = mixColor(skin, INK, 0.45);
    // pounding hand (her LEFT: she faces the lens, so it is on screen-right; W5.3 r8 anatomy). Power grip on the vertical handle seen from the front: the palm faces the handle (screen-left), the four fingers wrap round the BACK
    // of the handle (drawn under the pestle: only the proximal bands on the right and the four tips past the left edge show), the back of the hand and knuckle row face the camera and the right, the forearm joins the
    // back of the hand from the elbow side, the thumb opposes by crossing the FRONT of the handle toward screen-left.
    const fp = camPoint(c, gripW), pa = camPoint(c, tip), pb = camPoint(c, top2);
    if (fp && pa && pb) {
      const tilt = Math.atan2(pb[0] - pa[0], pa[1] - pb[1]), ct = Math.cos(tilt), st = Math.sin(tilt);
      const L = (x: number, y: number): Pt => [fp[0] + (x * ct - y * st) * u, fp[1] + (x * st + y * ct) * u];
      const cap = (a: Pt, b: Pt, r0: number, r1: number): Pt[] => {
        const th = Math.atan2(b[1] - a[1], b[0] - a[0]), q: Pt[] = [];
        for (let i = 0; i <= 8; i++) { const g = th - Math.PI / 2 + (i / 8) * Math.PI; q.push([b[0] + Math.cos(g) * r1 * u, b[1] + Math.sin(g) * r1 * u]); }
        for (let i = 0; i <= 8; i++) { const g = th + Math.PI / 2 + (i / 8) * Math.PI; q.push([a[0] + Math.cos(g) * r0 * u, a[1] + Math.sin(g) * r0 * u]); }
        return q;
      };
      const behindC = mixColor(handCol, '#7e6a6e', 0.16), rows = [-0.039, -0.013, 0.013, 0.039];
      // fingers round the back of the handle: under the pestle (layers 528/529), knuckles at x +0.046, tips at x -0.036 (past the handle's left edge, radius 0.024)
      rows.forEach((y, i) => {
        const f = cap(L(-0.036 + (i === 3 ? 0.004 : 0), y), L(0.046, y), 0.0125, 0.0135);
        hardFill(p, 528, behindC, f);
        p.ink(529, 'rotring', fingerC, 0.5); p.brush.spline([...f, f[0]], 0.08);
      });
      // no drawn wrist: the rig forearm (kit arm, under this hand) arrives from the elbow side, which differs per camera (lower-left at G355/G1720, lower-right at G300), and a fixed stub read as a lump
      // back of the hand: a rounded block right of the handle axis, four knuckle bumps on its right edge
      const back: Pt[] = [L(0.006, -0.056), L(0.03, -0.058), L(0.052, -0.052)];
      rows.forEach((y) => { back.push(L(0.062, y - 0.009), L(0.064, y), L(0.062, y + 0.009)); });
      back.push(L(0.052, 0.052), L(0.03, 0.058), L(0.006, 0.056), L(-0.002, 0.0));
      hardFill(p, 550, handCol, back);
      p.ink(551, 'rotring', edgeC, 0.7); p.brush.spline([...back, back[0]], 0.1);
      for (const y of [-0.026, 0, 0.026]) { p.ink(560, 'rotring', fingerC, 0.5); p.brush.spline([L(0.064, y), L(0.045, y + 0.002), L(0.028, y + 0.001)], 0.1); }
      // thumb: root at the upper (index) side of the palm, crossing the front of the handle toward screen-left, tip up-left, nail toward the lens
      const tr = L(0.03, -0.022), tt = L(-0.03, -0.044), th = cap(tr, tt, 0.0145, 0.0115);
      hardFill(p, 553, handCol, th);
      p.ink(554, 'rotring', edgeC, 0.6); p.brush.spline([...th, th[0]], 0.1);
      hardFill(p, 555, mixColor(handCol, '#ffffff', 0.35), ell(...L(-0.023, -0.0425), 0.0065 * u, 0.0052 * u, 8, tilt - 0.25));
    }
    // steadying hand (her right): restHand draws it flat on the rim; otherwise the kit mitten is the hand
    const rp = camPoint(c, o.ven?.restHand ? REST_HAND : [MORTAR[0] - 0.13, MORTAR[1] + 0.3, MORTAR[2] + 0.1]);
    if (rp && o.ven?.restHand) {
      const tilt = 0.18, ct = Math.cos(tilt), st = Math.sin(tilt), at2 = (x: number, y: number): Pt => [rp[0] + (x * ct - y * st) * u, rp[1] + (x * st + y * ct) * u];
      const back = ell(rp[0], rp[1], 0.046 * u, 0.03 * u, 14, tilt);
      hardFill(p, 556, handCol, back);
      p.ink(557, 'rotring', edgeC, 0.7); p.brush.spline([...back, back[0]], 0.1);
      // four fingers laid along the rim to the right (toward the mortar centre), each a short capsule
      for (let i = 0; i < 4; i++) {
        const y0 = -0.024 + i * 0.016, len = 0.05 - (i === 3 ? 0.012 : 0) - (i === 0 ? 0.004 : 0);
        const f = ell(...at2(0.046 + len / 2 - 0.01, y0), len / 2 * u, 0.009 * u, 8, tilt);
        hardFill(p, 558 + (i % 2), handCol, f);
        p.ink(565 + i, 'rotring', fingerC, 0.5); p.brush.spline([...f, f[0]], 0.08);
      }
      // thumb: on the near (lower) side, short, angled toward the rim front
      const tm = ell(...at2(0.01, 0.04), 0.022 * u, 0.011 * u, 8, tilt + 0.5);
      hardFill(p, 559, handCol, tm);
      p.ink(569, 'rotring', edgeC, 0.55); p.brush.spline([...tm, tm[0]], 0.08);
    }
    // default (hooked) hand: the kit handR mitten alone; a second drawn palm here read as two stacked hand blobs (draft v9 note)
  }
  // stool 1 + CUS (nearest)
  if (o.ven && o.ven.front) placeVen();
  if (o.cus !== false) {
    const cu = o.cus ?? {}, at = cu.at ?? CUS_AT;
    taper(p, c, 560, at, 0.2, 0.19, 0.45, mixColor(C.stool, '#1a1620', n * 0.3), {ink: true, topCol: mixColor(C.stool, '#ffd2bd', 0.2)});
    if (o.shadow !== 'brush' && o.shadow !== 'watercolour') {
      const sd = Array.from({length: 18}, (_, i) => { const a = (i / 18) * Math.PI * 2, along = 0.55 * Math.cos(a) + 0.5, across = 0.22 * Math.sin(a); return [at[0] + along * -0.8 + across * 0.6 - 0.0, 0.003, at[2] + along * -0.6 - across * 0.8] as V3; });
      const sdq = sd.map((v) => camPoint(c, v)).filter((q): q is Pt => !!q);
      if (sdq.length === sd.length) washAt(p, 565, sh, 160, sdq, 0.1, 0.3); // a close camera can put part of the shadow behind the near plane: skip it then
    }
    out.cus = paintPerson(pf, c, CUS, {at, view: cu.view ?? 'front', pose: cu.pose ?? 'P31', face: cu.face ?? 'tired', faceState: cu.faceState, fig: cu.fig, hands: cu.hands, motion: cu.motion, t: o.t + 1.3});
    if (cu.fan !== undefined && cu.hands?.r) paintFan(pf, c, cu.hands.r.to, cu.fan); // t offset: the frame-0 blink of man-crop lands on t 0, so the look frame is taken between blinks
  }
  if (n > 0.3 && (o.rim ?? 1) > 0.02) { const mpx: Pt = moon ?? [-300, -600]; moonRim(p0, out.ven, 900, mpx, o.rim ?? 1); moonRim(p0, out.cus, 901, mpx, o.rim ?? 1); }
  void wp;
  return out;
};

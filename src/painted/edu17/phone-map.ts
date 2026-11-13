// EDU-EP17 N13 phone map screen (K01, Boss W5.2 group 5): the map on MAN's phone in SH02 with the blue "you are here" dot and its pulse ring. Textless (no street names).
// `paintPhone` draws the body and the screen from a centre, a screen width and a tilt; the map is laid out in screen uv (0-1 across, 0-1 down) and mapped onto the screen quad, so it
// stays legible from 35 px (SH02 over the shoulder) up to a close-up. The dot is the globe dot of SH22 (`LOOK_COL.dot`, white rim, 2.5 s pulse) so the pay-off matches (brief K01).
import {ell, hardFill} from '../kit/draw';
import type {FigAnchors} from '../kit/cast';
import type {Painter, Pt} from '../kit/painter';
import {LOOK_COL} from './look-a-map';
import {clipPoly} from './space';

export const PHONE = {aspect: 2, dot: [0.5, 0.56] as Pt, pulse: 2.5, bezel: 0.09};
export type Quad = [Pt, Pt, Pt, Pt]; // TL, TR, BR, BL

/** Bilinear uv -> picture point on a quad. */
export const quadAt = (q: Quad, u: number, v: number): Pt => {
  const top: Pt = [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u], bot: Pt = [q[3][0] + (q[2][0] - q[3][0]) * u, q[3][1] + (q[2][1] - q[3][1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
};
/** The screen quad of a phone of screen width `w` centred at `c`, rolled by `tilt` degrees, with the top edge `taper` (0-1) narrower (the screen leans toward the lens). */
export const screenQuad = (c: Pt, w: number, tilt = 0, taper = 0): Quad => {
  const a = (tilt * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a), h = w * PHONE.aspect, tw = (w / 2) * (1 - taper);
  const R = ([x, y]: Pt): Pt => [c[0] + x * ca - y * sa, c[1] + x * sa + y * ca];
  return [R([-tw, -h / 2]), R([tw, -h / 2]), R([w / 2, h / 2]), R([-w / 2, h / 2])];
};

type Line = {pts: Pt[]; w: number};
// the map in uv: a river across the lower third, two parks, a main road each way and a grid of side streets; the dot sits at a junction
const ROADS_MAIN: Line[] = [{pts: [[-0.1, 0.34], [0.5, 0.56], [1.1, 0.7]], w: 0.085}, {pts: [[0.5, -0.1], [0.5, 0.56], [0.62, 1.1]], w: 0.085}];
const ROADS_MINOR: Line[] = [
  {pts: [[-0.1, 0.2], [0.5, 0.31], [1.1, 0.4]], w: 0.045}, {pts: [[-0.1, 0.62], [0.3, 0.74], [0.5, 0.78]], w: 0.045}, {pts: [[0.2, -0.1], [0.24, 0.5], [0.3, 1.1]], w: 0.045},
  {pts: [[0.8, -0.1], [0.78, 0.5], [0.86, 1.1]], w: 0.045}, {pts: [[0.5, 0.56], [0.72, 0.48], [1.1, 0.5]], w: 0.04}, {pts: [[-0.1, 0.47], [0.24, 0.5], [0.5, 0.56]], w: 0.04},
];
const PARKS: Pt[][] = [[[0.55, 0.06], [0.74, 0.08], [0.76, 0.26], [0.56, 0.24]], [[0.04, 0.76], [0.22, 0.8], [0.2, 0.95], [0.03, 0.93]]];
const BLOCKS: Pt[][] = [[[0.28, 0.1], [0.46, 0.12], [0.46, 0.27], [0.28, 0.25]], [[0.06, 0.28], [0.2, 0.3], [0.2, 0.43], [0.06, 0.41]], [[0.58, 0.62], [0.74, 0.66], [0.76, 0.78], [0.6, 0.76]], [[0.8, 0.56], [0.97, 0.6], [0.97, 0.75], [0.82, 0.72]]];
const RIVER: Pt[] = [[-0.1, 0.92], [0.3, 0.86], [0.6, 0.95], [1.1, 0.88]];

const UNIT: Pt[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
/** A road ribbon in uv, clipped to the screen square, mapped onto the quad. */
const ribbonUv = (q: Quad, pts: Pt[], w: number): Pt[] => {
  const L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    L.push([pts[i][0] + (nx * w) / 2, pts[i][1] + (ny * w) / 2]); R.push([pts[i][0] - (nx * w) / 2, pts[i][1] - (ny * w) / 2]);
  }
  return clipPoly([...L, ...R.reverse()], UNIT).map(([u, v]) => quadAt(q, u, v));
};
const clip01 = (pts: Pt[]): Pt[] => pts.map(([u, v]) => [Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v))] as Pt);

export const MAP_COL = {paper: '#ece8dc', block: '#ddd7c6', park: '#b9d4a0', water: '#a9cbe5', casing: '#c4bda9', road: '#ffffff', main: '#fbf3d8', bar: '#f6f4ee', status: '#2b3036'};

/** The pulse ring of the dot: `t` seconds, 2.5 s period; radius from the dot rim outward (in screen widths), fading. */
export const pulseAt = (t: number) => { const u = (t % PHONE.pulse) / PHONE.pulse; return {u, r: 0.075 + 0.2 * u, a: 0.7 * (1 - u)}; };

/** The dot alone (pulse ring, shadow, white rim, blue, highlight) on the screen quad. A shot whose falloff dims the lower frame (SH02: `bottomShade` after the staged items) draws this
 * again after the shot so the K01 dot keeps its colour (brief: the dot is the payoff of the globe dot). */
export const paintScreenDot = (p: Painter, q: Quad, t: number, seed = 8000) => {
  const sw = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
  const [dx, dy] = quadAt(q, PHONE.dot[0], PHONE.dot[1]), d = Math.max(5, 0.17 * sw), pu = pulseAt(t), rr = pu.r * sw + d / 2;
  hardFill(p.layer(pu.a, seed + 70), seed + 70, '#bfe0ff', [...ell(dx, dy, rr, rr, 36), ...ell(dx, dy, Math.max(0, rr - Math.max(1, 0.025 * sw)), Math.max(0, rr - Math.max(1, 0.025 * sw)), 36).reverse()]);
  hardFill(p.layer(0.45, seed + 71), seed + 71, '#0b1430', ell(dx + 0.5, dy + 0.5, d / 2 + 1.4, d / 2 + 1.4, 20));
  hardFill(p, seed + 72, '#ffffff', ell(dx, dy, d / 2 + 1.2, d / 2 + 1.2, 20));
  hardFill(p, seed + 73, LOOK_COL.dot, ell(dx, dy, d / 2, d / 2, 20));
  return {dot: [dx, dy] as Pt, d};
};

/** Paint the map into the screen quad `q`. Seeds start at `seed`. Roads that leave the screen are clipped by clamping their uv to the screen edge. */
export const paintPhoneScreen = (p: Painter, q: Quad, t: number, seed = 8000) => {
  const sw = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), fillUv = (s: number, col: string, uv: Pt[]) => hardFill(p, seed + s, col, uv.map(([u, v]) => quadAt(q, u, v)));
  fillUv(0, MAP_COL.paper, [[0, 0], [1, 0], [1, 1], [0, 1]]);
  BLOCKS.forEach((b, i) => fillUv(1 + i, MAP_COL.block, b));
  PARKS.forEach((b, i) => fillUv(10 + i, MAP_COL.park, b));
  fillUv(20, MAP_COL.water, clip01([...RIVER.map(([u, v]) => [u, v - 0.04] as Pt), ...RIVER.map(([u, v]) => [u, v + 0.05] as Pt).reverse()]));
  const road = (s: number, l: Line, casing: string, fill: string) => {
    hardFill(p, seed + 30 + s * 2, casing, ribbonUv(q, l.pts, l.w * 1.35));
    hardFill(p, seed + 31 + s * 2, fill, ribbonUv(q, l.pts, l.w));
  };
  ROADS_MINOR.forEach((l, i) => road(i, l, MAP_COL.casing, MAP_COL.road));
  ROADS_MAIN.forEach((l, i) => road(10 + i, l, MAP_COL.casing, MAP_COL.main));
  // top: status strip and a search field (no text)
  fillUv(60, MAP_COL.status, [[0, 0], [1, 0], [1, 0.04], [0, 0.04]]);
  fillUv(61, MAP_COL.bar, [[0.06, 0.06], [0.94, 0.06], [0.94, 0.13], [0.06, 0.13]]);
  fillUv(62, '#c9c6bc', [[0.12, 0.085], [0.5, 0.085], [0.5, 0.105], [0.12, 0.105]]);
  return paintScreenDot(p, q, t, seed);
};

/** Phone body (dark glass, bezel, a rim light on the left edge) around the screen, then the map. Returns the screen quad and the dot. */
export const paintPhone = (p: Painter, c: Pt, w: number, t: number, o: {tilt?: number; taper?: number; seed?: number} = {}) => {
  const seed = o.seed ?? 8000, q = screenQuad(c, w, o.tilt ?? 0, o.taper ?? 0), bz = PHONE.bezel, out: Quad = [quadAt(q, -bz, -bz * 0.7), quadAt(q, 1 + bz, -bz * 0.7), quadAt(q, 1 + bz, 1 + bz * 0.7), quadAt(q, -bz, 1 + bz * 0.7)];
  hardFill(p, seed - 2, '#14171a', out);
  hardFill(p.layer(0.6, seed - 1), seed - 1, '#4b545c', [out[0], quadAt(q, -bz * 0.4, -bz * 0.3), quadAt(q, -bz * 0.4, 1 + bz * 0.3), out[3]]);
  return {quad: q, ...paintPhoneScreen(p, q, t, seed)};
};

/** SH02 held prop for `paintFigureAt({held})`: MAN's back, right hand up at the chest, the screen leaning toward the lens past his right shoulder (K01, about 35 x 70 px at the SH02 camera;
 * 0.07 m wide screen). The forearm comes up from the elbow; the fingers wrap the lower edge and the thumb the left edge. `skin` and `sleeve` are his colours. */
export const heldPhone = (p: Painter, a: FigAnchors, u: number, t: number, sleeve: string, skin = '#d9a77e') => {
  const hand: Pt = [a.rShoulder[0] + 0.07 * u, a.rShoulder[1] - 0.2 * u], w = 0.07 * u, elbow: Pt = [a.rShoulder[0] + 0.1 * u, a.rShoulder[1] + 0.26 * u];
  const dx = hand[0] - elbow[0], dy = hand[1] - elbow[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, w0 = 0.062 * u, w1 = 0.05 * u;
  hardFill(p, 7900, sleeve, [[elbow[0] + nx * w0, elbow[1] + ny * w0], [hand[0] + nx * w1, hand[1] + ny * w1 + 0.05 * u], [hand[0] - nx * w1, hand[1] - ny * w1 + 0.05 * u], [elbow[0] - nx * w0, elbow[1] - ny * w0]]);
  const ph = paintPhone(p, [hand[0], hand[1] - 0.02 * u], w, t, {tilt: -10, taper: 0.08, seed: 8000});
  hardFill(p, 7910, skin, ell(hand[0] + 0.012 * u, hand[1] + 0.07 * u, 0.047 * u, 0.04 * u, 14, -0.2));
  hardFill(p, 7911, skin, ell(hand[0] - 0.045 * u, hand[1] + 0.02 * u, 0.014 * u, 0.034 * u, 10, -0.3));
  return ph;
};

// SET-CABIN (brief EDU-EP12-BRIEF-R1.1 set plan, metres; LOOK-FRAME CODE, W3 R1.2). A generic station work module (stylised; no real module
// layout, no name, flag or agency mark). Origin on the deck centre line below the tape strip; +x along the module axis (screen right in the
// main view), +y toward the ceiling panel, +z from the far wall toward the camera. Far wall z -1.00, deck y 0, ceiling y 2.10, end wall
// x -3.00 with the round hatch; the near wall z +1.00 is never drawn. Light: day LED (cool, even) or crew night (`dim` 0..1 toward #3a4f7a).
// No digits, calendar or tally anywhere (A2): the tape has ticks only.
import {paintEarth} from '../kit/earth';
import {ell, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, wFill, wInk} from '../kit/world';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {wp} from '../kit/world';
import {ellZ} from './home';
import {C} from './palette';

export const WIN = {c: [-1.1, 1.3, -1.0] as V3, r: 0.25};
export const TAPE = {x0: 0.6, x1: 0.64, y0: 1.4, y1: 1.9, z: -0.99};
/** Tape marks (m): first already there, then three uneven steps (1.2 / 0.8 / 0.5 cm, Boat N2), 2.5 cm total, no numbers. */
export const TAPE_MARKS = [1.6, 1.612, 1.62, 1.625] as const;
const ZF = -1.0, ZN = 1.0, YC = 2.1, XL = -3.0, XR = 3.0;

export type CabinOpts = {dim?: number; marks?: number; earthPitch?: number};

const glz = (p: Painter, c: YCam, seed: number, color: string, a: number, pts: V3[]) => wFill(p.layer(a, seed * 7), c, seed, color, pts);

/** Round window frame on top of the keyholed far wall: shutter ring, bolts and a low sheen. ENV-EARTH is painted first, behind the shell. */
const paintWindow = (p: Painter, c: YCam, o: CabinOpts) => {
  const [wx, wy, wz] = WIN.c, R = WIN.r;
  // shutter ring and frame
  const outer = camPoly(c, ellZ(wz + 0.01, wx, wy, R + 0.06, R + 0.06, 40)), inner = camPoly(c, ellZ(wz + 0.012, wx, wy, R + 0.005, R + 0.005, 40));
  const ringPts: Pt[] = [...outer, outer[0], inner[0], ...inner.slice().reverse()];
  hardFill(p, 1901, cabinTone('#b8c2cd', o), ringPts);
  inkLine(p, 1902, outer, {color: '#5c6672', weight: 1.1, still: true});
  inkLine(p, 1903, inner, {color: '#5c6672', weight: 1.0, still: true});
  for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283, b = camPoint(c, [wx + (R + 0.035) * Math.cos(a), wy + (R + 0.035) * Math.sin(a), wz + 0.013]); if (b) hardFill(p, 1904 + k, '#6c7682', ell(b[0], b[1], 2.4, 2.4, 8)); }
  // low sheen (DF-20261030-painted-glass-sheen-veil): one pale diagonal at 15 %
  hardFill(p.layer(0.15, 1915), 1915, '#ffffff', camPoly(c, [[wx - 0.16, wy + 0.05, wz + 0.007], [wx - 0.05, wy + 0.19, wz + 0.007], [wx + 0.0, wy + 0.16, wz + 0.007], [wx - 0.12, wy + 0.0, wz + 0.007]]));
};

const area = (q: Pt[]) => q.reduce((s, v, i) => { const w = q[(i + 1) % q.length]; return s + v[0] * w[1] - w[0] * v[1]; }, 0) / 2;
/** A polygon with one hole as a simple polygon: outer ring, a zero-width slit to the hole, the hole the other way round, back out. */
const keyhole = (outer: Pt[], hole: Pt[]): Pt[] => {
  if (hole.length < 3) return outer;
  const h = Math.sign(area(outer)) === Math.sign(area(hole)) ? hole.slice().reverse() : hole;
  const j = h.reduce((b, v, i) => (Math.hypot(v[0] - outer[0][0], v[1] - outer[0][1]) < Math.hypot(h[b][0] - outer[0][0], h[b][1] - outer[0][1]) ? i : b), 0);
  return [outer[0], ...h.slice(j), ...h.slice(0, j + 1), outer[0], ...outer.slice(1)];
};
const cabinTone = (col: string, o: CabinOpts) => mixColor(col, '#3a4f7a', 0.65 * (o.dim ?? 0));

/** The module behind the cast: deck, ceiling, far wall with racks, window + Earth, handrails, tape, bags, cables, laptop, foot loops. */
export const paintCabin = (p: Painter, c: YCam, o: CabinOpts = {}) => {
  const T = (col: string) => cabinTone(col, o);
  // ENV-EARTH behind everything (direction only; the lens pitched down so the limb crosses the window), then the shell over it
  const wc = camPoint(c, WIN.c);
  paintEarth(p, {...c, pitch: (c.pitch ?? 0) + (o.earthPitch ?? -0.3), hy: (wc ? wc[1] : 600) - 40}, {seed: 8800, stars: 0});
  // shell: ceiling, deck, end wall, far wall (with the window as a keyhole cut)
  wFill(p, c, 1800, T(C.panelMid), qy(YC, XL, XR, ZF, ZN));
  wFill(p, c, 1801, T('#c4ccd5'), qy(0, XL, XR, ZF, ZN));
  wFill(p, c, 1802, T(C.panelShade), qx(XL, 0, YC, ZF, ZN));
  const W = wp(c, qz(ZF, XL, XR, 0, YC)), hole = camPoly(c, ellZ(ZF, WIN.c[0], WIN.c[1], WIN.r + 0.01, WIN.r + 0.01, 48));
  if (W.length >= 3) hardFill(p, 1803, T(C.panel), keyhole(W, hole));
  // corner bevels (the module's rounded corners read as four sloped strips)
  wFill(p, c, 1804, T('#d5dbe2'), [[XL, YC - 0.25, ZF], [XR, YC - 0.25, ZF], [XR, YC, ZF + 0.25], [XL, YC, ZF + 0.25]]);
  wFill(p, c, 1805, T('#b3bdc8'), [[XL, 0.25, ZF], [XR, 0.25, ZF], [XR, 0, ZF + 0.25], [XL, 0, ZF + 0.25]]);
  // rack panels on the far wall: seams every 0.5 m, a horizontal seam pair, slightly different panel tones
  for (let i = 0; i < 12; i++) {
    const x0 = XL + i * 0.5;
    const overWin = x0 < WIN.c[0] + WIN.r + 0.08 && x0 + 0.5 > WIN.c[0] - WIN.r - 0.08;
    if (i % 3 === 1 && !overWin) glz(p, c, 1810 + i, T('#dfe4ea'), 0.8, qz(ZF + 0.001, x0 + 0.01, x0 + 0.49, 0.26, YC - 0.26));
    if (Math.abs(x0 - WIN.c[0]) < WIN.r + 0.07) { wInk(p, c, 1830 + i, [[x0, 0.25, ZF + 0.002], [x0, WIN.c[1] - WIN.r - 0.07, ZF + 0.002]], {color: T('#a7b1bd'), weight: 0.7, closed: false}); wInk(p, c, 1990 + i, [[x0, WIN.c[1] + WIN.r + 0.07, ZF + 0.002], [x0, YC - 0.25, ZF + 0.002]], {color: T('#a7b1bd'), weight: 0.7, closed: false}); }
    else wInk(p, c, 1830 + i, [[x0, 0.25, ZF + 0.002], [x0, YC - 0.25, ZF + 0.002]], {color: T('#a7b1bd'), weight: 0.7, closed: false});
  }
  wInk(p, c, 1845, [[XL, 1.62, ZF + 0.002], [XR, 1.62, ZF + 0.002]], {color: T('#a7b1bd'), weight: 0.7, closed: false});
  wInk(p, c, 1846, [[XL, 0.62, ZF + 0.002], [XR, 0.62, ZF + 0.002]], {color: T('#a7b1bd'), weight: 0.7, closed: false});
  wInk(p, c, 1847, [[XL, YC - 0.25, ZF], [XR, YC - 0.25, ZF]], {color: T('#97a2ae'), weight: 0.8, closed: false});
  wInk(p, c, 1848, [[XL, 0.25, ZF], [XR, 0.25, ZF]], {color: T('#97a2ae'), weight: 0.8, closed: false});
  // deck and ceiling panel seams along z
  for (let i = 0; i < 12; i++) { const x = XL + i * 0.5; wInk(p, c, 1850 + i, [[x, 0.001, ZF + 0.25], [x, 0.001, ZN]], {color: T('#9aa5b1'), weight: 0.6, closed: false}); wInk(p, c, 1865 + i, [[x, YC - 0.001, ZF + 0.25], [x, YC - 0.001, ZN]], {color: T('#a9b3be'), weight: 0.6, closed: false}); }
  // LED strips in the corners
  wFill(p, c, 1880, o.dim ? mixColor(C.led, '#3a4f7a', 0.7 * o.dim) : C.led, [[XL, YC - 0.05, ZF + 0.18], [XR, YC - 0.05, ZF + 0.18], [XR, YC - 0.02, ZF + 0.23], [XL, YC - 0.02, ZF + 0.23]]);
  glz(p, c, 1881, '#ffffff', 0.35 * (1 - (o.dim ?? 0)), [[XL, YC - 0.25, ZF], [XR, YC - 0.25, ZF], [XR, YC - 0.55, ZF], [XL, YC - 0.55, ZF]]);
  // vent grille and a cargo net with small items (left, low)
  wFill(p, c, 1882, T('#cfd6de'), qz(ZF + 0.003, -0.75, -0.35, 0.42, 0.58));
  for (let k = 0; k < 6; k++) wInk(p, c, 1883 + k, [[-0.73, 0.45 + k * 0.022, ZF + 0.004], [-0.37, 0.45 + k * 0.022, ZF + 0.004]], {color: T('#7d8894'), weight: 0.6, closed: false});
  paintBox(p, c, 1890, {x0: -1.75, x1: -1.45, y0: 0.4, y1: 0.62, z0: ZF, z1: ZF + 0.12}, T('#e0b25a'), {}, {ink: true});
  paintBox(p, c, 1896, {x0: -1.42, x1: -1.22, y0: 0.4, y1: 0.7, z0: ZF, z1: ZF + 0.1}, T('#8fb3d9'), {}, {ink: true});
  for (let k = 0; k < 5; k++) wInk(p, c, 1920 + k, [[-1.8 + k * 0.15, 0.36, ZF + 0.14], [-1.75 + k * 0.15, 0.78, ZF + 0.14]], {color: T('#3c4048'), weight: 0.8, closed: false});
  for (let k = 0; k < 3; k++) wInk(p, c, 1926 + k, [[-1.82, 0.42 + k * 0.17, ZF + 0.14], [-1.18, 0.42 + k * 0.17, ZF + 0.14]], {color: T('#3c4048'), weight: 0.8, closed: false});
  paintWindow(p, c, o);
  // handrails (far wall, y 1.85 and 0.35) on standoffs
  for (const [id, y] of [[1940, 1.85], [1950, 0.35]] as const) {
    for (const x of [-2.6, -1.5, -0.4, 0.7, 1.8, 2.7]) wInk(p, c, id + Math.round(x * 2 + 6), [[x, y, ZF + 0.002], [x, y, ZF + 0.08]], {color: T('#4d6f95'), weight: 2.2, closed: false});
    wInk(p, c, id + 9, [[-2.8, y, ZF + 0.08], [2.8, y, ZF + 0.08]], {color: T(C.rail), weight: Math.max(2.5, 0.03 * camUnit(c, [0, y, ZF + 0.08])), closed: false});
  }
  // tape strip with ticks every 1 cm (longer every 5), no digits; marks
  const tp = TAPE;
  wFill(p, c, 1960, T('#efe6cf'), qz(tp.z, tp.x0, tp.x1, tp.y0, tp.y1));
  for (let i = 0; i <= 50; i++) { const y = tp.y0 + i * 0.01, L = i % 5 === 0 ? 0.022 : 0.012; wInk(p, c, 2000 + i, [[tp.x0, y, tp.z + 0.001], [tp.x0 + L, y, tp.z + 0.001]], {color: '#2a2a2e', weight: 0.6, closed: false}); }
  for (let m = 0; m < Math.min(4, o.marks ?? 1); m++) wInk(p, c, 2060 + m, [[tp.x0 - 0.005, TAPE_MARKS[m], tp.z + 0.002], [tp.x1 + 0.005, TAPE_MARKS[m], tp.z + 0.002]], {color: '#1d1f24', weight: Math.max(1.2, 0.004 * camUnit(c, [0.62, 1.6, tp.z])), closed: false});
  wInk(p, c, 2070, qz(tp.z + 0.001, tp.x0, tp.x1, tp.y0, tp.y1), {color: T('#9a9078'), weight: 0.6});
  // drink pouch velcroed to the wall, a velcro row and a checklist card (blank lines, nothing legible)
  wFill(p, c, 2080, T('#c9d8e6'), [[0.15, 1.0, ZF + 0.02], [0.27, 1.0, ZF + 0.02], [0.28, 1.2, ZF + 0.02], [0.14, 1.2, ZF + 0.02]]);
  wFill(p, c, 2081, T('#e4573f'), qz(ZF + 0.021, 0.19, 0.23, 1.2, 1.25));
  wInk(p, c, 2082, [[0.15, 1.0, ZF + 0.022], [0.27, 1.0, ZF + 0.022], [0.28, 1.2, ZF + 0.022], [0.14, 1.2, ZF + 0.022]], {color: '#5c6672', weight: 0.8});
  for (let k = 0; k < 4; k++) wFill(p, c, 2083 + k, T(C.velcro), qz(ZF + 0.003, -0.2 + k * 0.28, -0.16 + k * 0.28, 1.36, 1.4));
  wFill(p, c, 2090, T('#fbfaf5'), qz(ZF + 0.004, 1.0, 1.24, 1.15, 1.47));
  for (let k = 0; k < 6; k++) wInk(p, c, 2091 + k, [[1.03, 1.42 - k * 0.045, ZF + 0.005], [1.2 - (k % 2) * 0.05, 1.42 - k * 0.045, ZF + 0.005]], {color: '#9aa6b4', weight: 0.6, closed: false});
  wInk(p, c, 2097, qz(ZF + 0.005, 1.0, 1.24, 1.15, 1.47), {color: '#8a96a4', weight: 0.7});
  // stowage bags: far wall right (x 1.4..2.8, low) and on the ceiling (x -2.4..-1.4)
  const bag = (id: number, b: {x0: number; x1: number; y0: number; y1: number; z0: number; z1: number}) => {
    paintBox(p, c, id, b, T(C.bag), {}, {ink: true});
    const strapX = (b.x0 + b.x1) / 2, zf = b.z1 + 0.002;
    wFill(p, c, id + 20, T(C.strap), qz(zf, strapX - 0.025, strapX + 0.025, b.y0, b.y1));
    wFill(p, c, id + 21, T(C.velcro), qz(zf + 0.001, strapX - 0.04, strapX + 0.04, (b.y0 + b.y1) / 2 - 0.025, (b.y0 + b.y1) / 2 + 0.025));
  };
  bag(2100, {x0: 1.35, x1: 1.85, y0: 0.22, y1: 0.7, z0: ZF, z1: ZF + 0.3});
  bag(2130, {x0: 1.9, x1: 2.5, y0: 0.22, y1: 0.85, z0: ZF, z1: ZF + 0.32});
  bag(2160, {x0: -2.4, x1: -1.9, y0: YC - 0.32, y1: YC, z0: ZF + 0.3, z1: ZF + 0.85});
  bag(2190, {x0: -1.85, x1: -1.4, y0: YC - 0.28, y1: YC, z0: ZF + 0.35, z1: ZF + 0.8});
  // cable bundle along the ceiling corner held by velcro straps
  const cab: V3[] = Array.from({length: 13}, (_, i) => [XL + 0.2 + i * 0.47, 1.98 - 0.04 * Math.sin(i * 1.7), ZF + 0.12]);
  wInk(p, c, 2220, cab, {color: T('#3c4048'), weight: Math.max(2, 0.035 * camUnit(c, [0, 2.0, ZF + 0.12])), closed: false});
  wInk(p, c, 2221, cab.map(([x, y, z]) => [x + 0.05, y - 0.03, z + 0.01] as V3), {color: T('#5d6b7a'), weight: 1.4, closed: false});
  for (let i = 1; i < 12; i += 2) wInk(p, c, 2222 + i, [[cab[i][0], 1.92, ZF + 0.1], [cab[i][0], 2.04, ZF + 0.13]], {color: T('#8c8577'), weight: 2.4, closed: false});
  // laptop on its arm (screen dim blue-grey, nothing legible)
  wInk(p, c, 2240, [[1.85, 1.62, ZF + 0.002], [1.75, 1.45, -0.85], [1.62, 1.35, -0.8]], {color: T('#6c7682'), weight: 2.6, closed: false});
  wFill(p, c, 2241, T(C.laptop), [[1.44, 1.24, -0.78], [1.76, 1.24, -0.82], [1.76, 1.46, -0.84], [1.44, 1.46, -0.8]]);
  wFill(p, c, 2242, o.dim ? '#2a3b5c' : '#5d7390', [[1.46, 1.26, -0.779], [1.74, 1.26, -0.819], [1.74, 1.44, -0.839], [1.46, 1.44, -0.799]]);
  // foot loops on the deck at x 0.52 and 0.72, z -0.85
  for (const [i, x] of [[0, 0.52], [1, 0.72]] as const) {
    const lp: V3[] = Array.from({length: 9}, (_, k) => { const a = (k / 8) * Math.PI; return [x + 0.06 * Math.cos(a), 0.0 + 0.07 * Math.sin(a), -0.85]; });
    wInk(p, c, 2250 + i, lp, {color: T('#6f665a'), weight: Math.max(2, 0.02 * camUnit(c, [x, 0.05, -0.85])), closed: false});
  }
  // rack equipment: three dark front panels with knobs and green/amber lamps (no text), and two hanging cable loops
  for (const [i, x0, x1, y0, y1] of [[0, -2.55, -1.75, 0.95, 1.5], [1, 0.05, 0.5, 0.65, 0.95], [2, 0.95, 1.35, 0.6, 1.05]] as const) {
    paintBox(p, c, 2400 + i * 10, {x0, x1, y0, y1, z0: ZF, z1: ZF + 0.06}, T('#5b636d'), {}, {ink: true});
    for (let k = 0; k < 3; k++) { const q = camPoint(c, [x0 + 0.07 + k * 0.08, y1 - 0.07, ZF + 0.062]); if (q) hardFill(p, 2406 + i * 10 + k, k === 1 ? '#f2b84a' : '#7fe08a', ell(q[0], q[1], 2.6, 2.6, 8)); }
    wFill(p, c, 2409 + i * 10, T('#3c4048'), qz(ZF + 0.063, x0 + 0.06, x1 - 0.06, y0 + 0.06, y0 + 0.16));
  }
  wInk(p, c, 2440, [[-2.3, 1.5, ZF + 0.06], [-2.15, 1.25, ZF + 0.1], [-1.95, 1.5, ZF + 0.06]], {color: T('#2f3238'), weight: 2.2, closed: false});
  wInk(p, c, 2441, [[0.3, 0.95, ZF + 0.06], [0.42, 0.75, ZF + 0.12], [0.5, 0.95, ZF + 0.06]], {color: T('#c0563f'), weight: 2.0, closed: false});
  // deck: a grille panel, a white cargo bag strapped down, a deck handrail on standoffs, coloured blank tags on the racks (nothing legible)
  wFill(p, c, 2270, T('#aeb8c3'), qy(0.002, -0.1, 0.5, -0.3, 0.35));
  for (let k = 0; k < 9; k++) wInk(p, c, 2271 + k, [[-0.08 + k * 0.07, 0.003, -0.28], [-0.08 + k * 0.07, 0.003, 0.33]], {color: T('#7e8995'), weight: 0.7, closed: false});
  wInk(p, c, 2280, qy(0.003, -0.1, 0.5, -0.3, 0.35), {color: T('#7e8995'), weight: 0.8});
  paintBox(p, c, 2281, {x0: -1.45, x1: -0.95, y0: 0, y1: 0.32, z0: -0.7, z1: -0.32}, T('#f1efe8'), {}, {ink: true});
  wFill(p, c, 2290, T(C.strap), [[-1.22, 0.321, -0.7], [-1.16, 0.321, -0.7], [-1.16, 0.321, -0.32], [-1.22, 0.321, -0.32]]);
  wFill(p, c, 2291, T(C.strap), qz(-0.319, -1.22, -1.16, 0, 0.32));
  wFill(p, c, 2292, T('#d8b24a'), qz(-0.318, -1.4, -1.28, 0.2, 0.27));
  for (const x of [-2.2, -0.6, 1.0, 2.4]) wInk(p, c, 2293 + Math.round(x * 2 + 6), [[x, 0, 0.25], [x, 0.09, 0.25]], {color: T('#4d6f95'), weight: 2.2, closed: false});
  wInk(p, c, 2310, [[-2.6, 0.09, 0.25], [2.6, 0.09, 0.25]], {color: T(C.rail), weight: Math.max(2.5, 0.03 * camUnit(c, [0, 0.09, 0.25])), closed: false});
  for (const [i, x, y, col] of [[0, -2.2, 1.0, '#e8c34a'], [1, -0.15, 0.8, '#7fb0dd'], [2, 0.95, 0.95, '#e8c34a'], [3, 2.15, 1.25, '#e47a5a'], [4, -2.6, 1.4, '#7fb0dd']] as const)
    wFill(p, c, 2320 + i, T(col), qz(ZF + 0.004, x, x + 0.07, y, y + 0.045));
  // soft window light: a cool blue wash on the far wall round the window
  [0.75, 0.55, 0.4].forEach((k, i) => { const ring = ellZ(ZF + 0.0009 + i * 0.0001, WIN.c[0], WIN.c[1], k, k * 0.8); hardFill(p.layer(0.07, 2261 + i), 2260 + i, '#9cc2ea', keyhole(camPoly(c, ring), camPoly(c, ellZ(ZF + 0.001, WIN.c[0], WIN.c[1], WIN.r + 0.06, WIN.r + 0.06, 40)))); });
};

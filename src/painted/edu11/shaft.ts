import {camMove, camOf} from '../kit/cam-moves';
import type {FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {C, paintFloat, woman} from './car';

// SET-SHAFT section (N2) for spike SP2: one world with SET-CAR. Section plane z = 0 (the rails, the cut faces of the car shell and of the shaft
// walls all lie in it, so the car is 305 px/m at r 8.5, f 2600: 765 px tall). Shaft space: +x right, +y up, +z toward the section camera.

export {FPS, fallY as yCarAt} from './clock';
export {trackCam} from './cams';

const Q = (cam: YCam, pts: V3[]): Pt[] => camPoly(cam, pts);
let n = 0;
const fill = (p: Painter, cam: YCam, color: string, pts: V3[]) => { const q = Q(cam, pts); if (q.length >= 3) hardFill(p, 12000 + n++, color, q); };
const box = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];

/** Landing-door variants (brief set plan, SP2 finding 4): `LV[(n*7+3) mod 3]` with every 4th floor forced to B. */
export const landingVariant = (n: number): 'A' | 'B' | 'C' => (n % 4 === 0 ? 'B' : (['A', 'B', 'C'] as const)[((n * 7 + 3) % 3 + 3) % 3]);

export type ShaftOpts = {
  /** Speed streaks strength 0..1 (VD17 full). */
  streak?: number;
  /** WOMAN inside: crouched on the car floor, or floating and rolled. */
  inside?: 'crouch' | 'float';
  roll?: number;
  t?: number;
  /** Crouched WOMAN: face, hair rise, right hand on this world point. */
  face?: 'worried' | 'angry'; rise?: number; grip?: V3; feetX?: number;
  /** Production: draw the WOMAN yourself (story painter) after the car interior and before the shell cut edges. Replaces `inside`. */
  figure?: (p: Painter, cam: YCam, yCar: number) => FigAnchors | null | void;
  /** Interior glow 0..1 (car light; G888 flicker). */
  light?: number;
  /** Visible shaft span (m) above and below the car (default 7). */
  span?: [number, number];
  /** B05-SH02: machine room, sheave and the six cables; `lit` 0..1 per cable (lit in turn), `parted` 0..1 the whip after "ขาดหมด". */
  top?: {lit: number[]; parted: number};
};
/** Car shell corners (section plane), for the +-2 px hold measure. */
export const carCorners = (cam: YCam, yCar: number): Pt[] => [[-0.75, yCar - 0.1, 0], [0.75, yCar - 0.1, 0], [0.75, yCar + 2.4, 0], [-0.75, yCar + 2.4, 0]].map((v) => camPoint(cam, v as V3) as Pt);

export const paintShaft = (p: Painter, cam: YCam, yCar: number, o: ShaftOpts = {}): {a?: FigAnchors | null} => {
  n = 0;
  const y0 = yCar - (o.span?.[0] ?? 7), y1 = yCar + (o.span?.[1] ?? 7), dim = (c: string, k: number) => mixColor(c, '#101214', k);
  const k0 = Math.floor(y0 / 3), k1 = Math.ceil(y1 / 3);
  // concrete mass round the shaft (section-cut faces, z = 0), slabs every 3 m
  for (const s of [-1, 1]) {
    const xa = s * 1.05, xb = s * 3.2;
    fill(p, cam, dim('#8e8b86', 0.5), box(Math.min(xa, xb), Math.max(xa, xb), y0, y1, 0));
    for (let k = k0; k <= k1; k++) {
      fill(p, cam, dim('#5f5d59', 0.35), box(Math.min(xa, xb), Math.max(xa, xb), 3 * k - 0.3, 3 * k, 0));
      const q = Q(cam, box(Math.min(xa, xb), Math.max(xa, xb), 3 * k - 0.3, 3 * k, 0));
      if (q.length >= 3) inkLine(p, 12100 + k * 2 + (s > 0 ? 1 : 0), q, {weight: 1.2, color: '#2a2c30', still: true});
    }
    // diagonal cut hatch (world-anchored, so it streams with the shaft)
    for (let k = Math.floor(y0 / 0.45); k <= Math.ceil(y1 / 0.45); k++) {
      const a = camPoint(cam, [xa, 0.45 * k, 0]), b = camPoint(cam, [s * 2.9, 0.45 * k + 0.9, 0]);
      if (a && b) inkLine(p, 12300 + (k & 63) * 2 + (s > 0 ? 1 : 0), [a, b], {weight: 0.7, color: '#4a4b4d', closed: false, still: true});
    }
  }
  // back wall (z -0.80) and landing recesses (dark, 1.0 x 2.1, steel frame, no numbers)
  fill(p, cam, dim('#8e8b86', 0.62), box(-1.05, 1.05, y0, y1, -0.8));
  for (let k = k0; k <= k1; k++) {
    const lv = landingVariant(k + 1);
    fill(p, cam, '#6a7077', box(-0.56, 0.56, 3 * k - 0.05, 3 * k + 2.16, -0.79));
    fill(p, cam, '#16181b', box(-0.5, 0.5, 3 * k, 3 * k + 2.1, -0.78));
    if (lv === 'B') { // half open: a 0.35 m gap with the warm lobby strip behind, door leaves either side
      fill(p, cam, '#ffe2a8', box(-0.175, 0.175, 3 * k, 3 * k + 2.1, -0.775));
      fill(p, cam, '#d9a861', box(-0.175, 0.175, 3 * k, 3 * k + 0.12, -0.772));
      fill(p, cam, '#3a3f45', box(-0.5, -0.175, 3 * k, 3 * k + 2.1, -0.77));
      fill(p, cam, '#3a3f45', box(0.175, 0.5, 3 * k, 3 * k + 2.1, -0.77));
    } else {
      fill(p, cam, '#2a2d31', box(0.0, 0.01, 3 * k, 3 * k + 2.1, -0.77));
      if (lv === 'C') { // closed, lit call-button dot beside the door and a light line under it
        fill(p, cam, '#ffe2a8', box(-0.5, 0.5, 3 * k - 0.005, 3 * k + 0.025, -0.775));
        const c = camPoint(cam, [0.68, 3 * k + 1.1, -0.78]), u = camUnit(cam, [0.68, 0, -0.78]);
        if (c) { washAt(p, 12650 + (k & 63), '#ffd08a', 45, ell(c[0], c[1], 0.1 * u, 0.1 * u, 12), 0.3, 0.1); hardFill(p, 12660 + (k & 63), '#ffd08a', ell(c[0], c[1], 0.022 * u, 0.022 * u, 8)); }
      }
    }
  }
  // the car's own light on the back wall
  const gc = camPoint(cam, [0, yCar + 1.2, -0.8]), gu = camUnit(cam, [0, yCar + 1.2, -0.8]);
  if (gc) for (const [r, op] of [[1.9, 8], [1.3, 12], [0.9, 16]] as const) washAt(p, 12500 + r * 10, C.led, op, ell(gc[0], gc[1], 0.9 * r * gu, r * gu, 20), 0.3, 0.1);
  // work lights every 3 m: small warm dots with a halo
  for (let k = k0; k <= k1; k++) {
    const c = camPoint(cam, [-1.0, 3 * k - 1.0, -0.75]), u = camUnit(cam, [-1.0, 0, -0.75]);
    if (c) { washAt(p, 12600 + (k & 63), '#ffe9b0', 28, ell(c[0], c[1], 0.12 * u, 0.12 * u, 12), 0.3, 0.1); hardFill(p, 12700 + (k & 63), '#ffe9b0', ell(c[0], c[1], 0.035 * u, 0.035 * u, 8)); }
  }
  // guide rails (CL01) full height, brackets every 3 m
  for (const s of [-1, 1]) {
    fill(p, cam, '#5d6873', box(s * 0.85 - 0.05, s * 0.85 + 0.05, y0, y1, 0.0));
    fill(p, cam, '#a9b4bf', box(s * 0.85 - 0.012, s * 0.85 + 0.012, y0, y1, 0.01));
    for (let k = k0; k <= k1; k++) fill(p, cam, '#4b545d', box(Math.min(s * 0.85, s * 1.05), Math.max(s * 0.85, s * 1.05), 3 * k + 1.4, 3 * k + 1.6, 0.0));
  }
  // speed streaks (world-anchored, thin white, back and rail columns)
  const st = o.streak ?? 0;
  if (st > 0) for (let i = Math.floor(y0 / 0.9); i <= Math.ceil(y1 / 0.9); i++) {
    const x = (hash(i * 7 + 1) * 2 - 1) * 1.0, len = (0.5 + hash(i * 3 + 2) * 1.2) * (0.5 + st), yb = 0.9 * i + hash(i) * 0.5;
    const a = camPoint(cam, [x, yb, -0.7]), b = camPoint(cam, [x, yb + len, -0.7]);
    if (a && b) inkLine(p, 12800 + (i & 127), [a, b], {weight: 0.9, color: mixColor('#8e8b86', '#ffffff', 0.7), closed: false, still: true});
  }
  // cables (CL02): six ropes from the crosshead up past the frame top (or to the sheave in B05-SH02)
  if (o.top) paintMachineTop(p, cam, yCar, o.top.lit, o.top.parted);
  else for (let i = 0; i < 6; i++) { const x = -0.3 + 0.12 * i; fill(p, cam, '#2b2f36', box(x - 0.012, x + 0.012, yCar + 2.55, y1 + 4, 0.0)); }
  // car shell (cut at z = 0): outer steel, glowing interior, roof crosshead, guide shoes on the rails
  fill(p, cam, '#c0c8cf', box(-0.75, 0.75, yCar - 0.1, yCar + 2.4, 0));
  fill(p, cam, '#2f353b', box(-0.35, 0.35, yCar + 2.4, yCar + 2.58, 0.0));
  fill(p, cam, mixColor('#dfe9f2', '#1b2127', 0.38 * (1 - (o.light ?? 1))), box(-0.7, 0.7, yCar, yCar + 2.3, 0));
  fill(p, cam, '#a7b0b8', box(-0.7, 0.7, yCar, yCar + 2.3, -0.1));
  fill(p, cam, '#8d98a2', box(-0.7, -0.5, yCar, yCar + 2.3, 0.0));
  fill(p, cam, C.led, box(-0.45, 0.45, yCar + 2.22, yCar + 2.3, 0.01));
  fill(p, cam, '#3b4047', box(-0.7, 0.7, yCar, yCar + 0.05, 0.01));
  fill(p, cam, C.chrome, box(-0.7, -0.64, yCar + 0.88, yCar + 0.92, 0.02)); // handrail seen edge-on
  for (const s of [-1, 1]) for (const dy of [0.05, 2.1]) fill(p, cam, '#2f353b', box(Math.min(s * 0.75, s * 0.82), Math.max(s * 0.75, s * 0.82), yCar + dy, yCar + dy + 0.2, 0.0));
  // WOMAN inside the car (same figure as the interior shots), then the shell cut edges over her
  let a: FigAnchors | null | undefined;
  const at: V3 = [o.feetX ?? -0.2, yCar, -0.3];
  if (o.figure) a = o.figure(p, cam, yCar) ?? undefined;
  else if (o.inside === 'crouch') { const gp = o.grip ? camPoint(cam, o.grip) : null; a = paintFigureAt(p, cam, woman(o.rise ?? 0.3), {at, pose: 'P35', face: o.face ?? 'worried', t: o.t ?? 0, shadow: false, fig: gp ? {rArm: {to: gp as Pt, out: -1}} : undefined}); }
  else if (o.inside === 'float') a = paintFloat(p, cam, {at: [-0.1, yCar, -0.3], t: o.t ?? 0, lift: 0.4, rise: 1, face: 'scared', roll: o.roll ?? 160});
  const edge = Q(cam, box(-0.75, 0.75, yCar - 0.1, yCar + 2.4, 0));
  if (edge.length >= 3) inkLine(p, 12900, edge, {weight: 1.6, color: '#2a2c30', still: true});
  const inner = Q(cam, box(-0.7, 0.7, yCar, yCar + 2.3, 0));
  if (inner.length >= 3) inkLine(p, 12901, inner, {weight: 1.0, color: '#6f7a84', still: true});
  return {a};
};

/** Machine room above the shaft (B05-SH02): slab y 60.5, back wall, sheave (0, 63.6) O 0.60 with six grooved cables from the crosshead; `lit` 0..1 per cable glows amber, `parted` 0..1 breaks them above the crosshead with an upward whip. */
export const paintMachineTop = (p: Painter, cam: YCam, yCar: number, lit: number[], parted: number) => {
  const top = 63.6, cross = yCar + 2.58;
  fill(p, cam, '#2a2d31', box(-3.2, 3.2, 60.5, 66, -0.82)); // machine-room back wall
  for (const s of [-1, 1]) fill(p, cam, '#8e8b86', box(Math.min(s * 1.05, s * 3.2), Math.max(s * 1.05, s * 3.2), 60.5, 61.0, 0));
  fill(p, cam, '#6a7077', box(-1.2, 1.2, 62.6, 62.75, 0)); // sheave beam
  for (const s of [-1, 1]) fill(p, cam, '#4b545d', box(s * 0.45 - 0.05, s * 0.45 + 0.05, 62.6, 63.6, 0));
  const c = camPoint(cam, [0, top, 0.02]), u = camUnit(cam, [0, top, 0]);
  if (c) {
    hardFill(p, 12950, '#3a4048', ell(c[0], c[1], 0.3 * u, 0.3 * u, 28));
    hardFill(p, 12951, '#7d8791', ell(c[0], c[1], 0.27 * u, 0.27 * u, 28));
    hardFill(p, 12952, '#2f353b', ell(c[0], c[1], 0.12 * u, 0.12 * u, 18));
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; inkLine(p, 12953 + i, [[c[0] + Math.cos(a) * 0.13 * u, c[1] + Math.sin(a) * 0.13 * u], [c[0] + Math.cos(a) * 0.26 * u, c[1] + Math.sin(a) * 0.26 * u]], {weight: 1.2, color: '#2a2c30', closed: false, still: true}); }
    inkLine(p, 12970, ell(c[0], c[1], 0.3 * u, 0.3 * u, 28), {weight: 1.6, color: '#2a2c30', still: true});
  }
  const cut = yCar + 6.5; // the cables part above the crosshead, a few metres up
  for (let i = 0; i < 6; i++) {
    const x = -0.3 + 0.12 * i, k = lit[i] ?? 0, col = mixColor('#2b2f36', '#ffcf6b', k);
    const pts = (ya: number, yb: number, whip = 0): Pt[] => Array.from({length: 9}, (_, j) => camPoint(cam, [x + whip * Math.sin((j / 8) * Math.PI * 2 + i) * 0.12 * (j / 8), ya + (yb - ya) * (j / 8), 0.02]) as Pt);
    if (parted <= 0) { fill(p, cam, col, box(x - 0.014, x + 0.014, cross, top - 0.3, 0.02)); if (k > 0.05) { const g = camPoint(cam, [x, (cross + top) / 2, 0.02]), gu = camUnit(cam, [x, 0, 0]); if (g) washAt(p, 12980 + i, '#ffcf6b', 38 * k, ell(g[0], g[1], 0.07 * gu, ((top - cross) / 2) * gu, 12), 0.1, 0.1); } }
    else {
      const e = parted;
      inkLine(p, 12990 + i, pts(cross, cut - 0.2 - 0.6 * e, 0.4 * e), {weight: 3.2, color: col, closed: false, still: true});
      inkLine(p, 12996 + i, pts(cut + 0.5 * e + 0.2, top - 0.3, -0.5 * e), {weight: 3.2, color: col, closed: false, still: true});
    }
  }
};

/** Tower section (B02-SH03, seen at r 120 only): flat diagram fill. Slabs every 3 m x -8..+8, outer walls, roof y 63.5, window strips, the shaft column x +-1.05 with the lit car, ground at y 0 (the pit never shows). */
export const paintTower = (p: Painter, cam: YCam, yCar: number) => {
  n = 400;
  fill(p, cam, '#d6d2c8', box(-8, 8, 0, 63.5, -1)); // tower mass (paper-warm, low detail)
  for (let k = 1; k <= 20; k++) { // window strips between slabs, left and right of the shaft
    for (const [x0, x1] of [[-7.2, -1.6], [1.6, 7.2]] as const) fill(p, cam, '#9fb0bf', box(x0, x1, 3 * (k - 1) + 1.0, 3 * (k - 1) + 2.2, -0.9));
    fill(p, cam, '#5f5d59', box(-8, 8, 3 * (k - 1) - 0.25, 3 * (k - 1) + 0.0, -0.8)); // slab
  }
  fill(p, cam, '#4a4b4d', box(-8.3, 8.3, 63.2, 63.8, -0.8)); // roof slab
  fill(p, cam, '#1b1d20', box(-1.05, 1.05, 0, 63.2, -0.7)); // shaft column
  for (const s of [-1, 1]) fill(p, cam, '#8a949d', box(s * 0.85 - 0.04, s * 0.85 + 0.04, 0, 63.2, -0.6));
  fill(p, cam, '#4b545d', box(-0.35, 0.35, yCar + 2.4, 63.2, -0.6)); // cables, drawn as one dark bar at this scale
  fill(p, cam, '#dfe9f2', box(-0.75, 0.75, yCar - 0.1, yCar + 2.4, -0.5)); // the lit car
  fill(p, cam, '#2a2c30', box(-8, 8, -0.4, 0.05, -0.8)); // ground
  const q = camPoly(cam, box(-8, 8, 0, 63.5, -1));
  if (q.length >= 3) inkLine(p, 13000, q, {weight: 2.4, color: '#2a2c30', still: true});
};

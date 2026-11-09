import {drawFigure, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {hardFill, inkLine, ell, INK, washAt} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {layerMotion} from '../kit/motions';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {dress} from '../kit/wardrobe';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {hipAnchor, rollAnchors, withRoll} from '../kit/figure-at';

// EDU-EP11-SHORT spike code (Boss, 2026-11-09; brief EDU-EP11-BRIEF-R1.1, spikes SP1-SP4). SPIKE CODE, not episode shots: SET-CAR (N1) as far as
// SP1/SP3 need it, WOMAN (`woman-long + office`, tie off, N5 hair-float via `HeadStyle.hairRise`), the weightless figure and the free-floating phone (N7).
// Metres, CAR space: origin on the car floor centre, +x right, +y up, +z toward the lens (brief "Set plan").

export const C = {
  steelMid: '#a7b0b8', steelShadow: '#6f7a84', steelHi: '#dfe6ec', floor: '#3b4047', speckle: '#5c636b', chrome: '#d7dde2', panel: '#c3cad0', ring: '#e9edf0',
  amber: '#ffb347', glow: '#ffd27a', led: '#eef6ff', spill: '#dfe9f2', glass: '#14181c', digit: '#ff5a36',
} as const;

/** WOMAN: `woman-long + office`, tie removed (VD02); `rise` 0..1 is the N5 hair float. */
export const woman = (rise = 0, calm = false): CastDef => {
  const d = dress(PEOPLE['woman-long'], 'office');
  const gear = {...d.outfit.gear};
  delete gear.tie;
  return {...d, outfit: {...d.outfit, gear}, head: {...d.head, hairRise: rise, ...(calm ? {hairCalm: true} : {})}};
};

const P = (cam: YCam, pts: V3[]): Pt[] => camPoly(cam, pts);
let seq = 0;
const wall = (p: Painter, cam: YCam, color: string, pts: V3[]) => { const q = P(cam, pts); if (q.length >= 3) hardFill(p, 9100 + seq++, color, q); };

/** A rectangle on a plane: `o` the origin, `a` and `b` its edges (m). */
const rect = (o: V3, a: V3, b: V3, s0 = 0, s1 = 1, t0 = 0, t1 = 1): V3[] => {
  const pt = (s: number, t: number): V3 => [o[0] + a[0] * s + b[0] * t, o[1] + a[1] * s + b[1] * t, o[2] + a[2] * s + b[2] * t];
  return [pt(s0, t0), pt(s1, t0), pt(s1, t1), pt(s0, t1)];
};

const SEG: Record<string, string> = {'0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg'};
/** Seven-segment text on the left wall plane (x = -0.70): digits `h` m tall, reading away from the lens (-z). */
const sevenSeg = (p: Painter, cam: YCam, text: string, z0: number, yTop: number, h: number, color: string) => {
  const w = h * 0.55, t = h * 0.14;
  [...text].forEach((ch, i) => {
    const zc = z0 - i * (w + h * 0.2), seg = SEG[ch] ?? '';
    const bar = (id: string, zs: number, ze: number, ys: number, ye: number) => { if (seg.includes(id)) { const q = P(cam, [[-0.7, ys, zs], [-0.7, ys, ze], [-0.7, ye, ze], [-0.7, ye, zs]]); if (q.length >= 3) hardFill(p, 9300 + i * 10 + id.charCodeAt(0), color, q); } };
    const y = (k: number) => yTop - k * h / 2;
    bar('a', zc, zc - w, y(0), y(0) - t); bar('g', zc, zc - w, y(1) + t / 2, y(1) - t / 2); bar('d', zc, zc - w, y(2) + t, y(2));
    bar('f', zc, zc - t, y(0), y(1)); bar('b', zc - w + t, zc - w, y(0), y(1)); bar('e', zc, zc - t, y(1), y(2)); bar('c', zc - w + t, zc - w, y(1), y(2));
  });
};

export type CarOpts = {
  /** Ceiling LED level 0..1 (flicker, 85 % after the snap). */
  light?: number;
  /** Floor display text, red-orange 7-seg. */
  display?: string;
  /** Bell button glow 0..1 (0.3 at rest). */
  bell?: number;
  /** Draw the front wall (closed doors; only the POV shot S01-B03-SH01). */
  front?: boolean;
  /** Back wall drawn (default true); the POV shot culls it. */
  back?: boolean;
  /** Floor indicator above the doors (SD06, in-world 7-seg on the door transom, centre (0, 2.18, 0.649)): the digits; only with `front`. */
  indicator?: string;
};

/** SET-CAR painted from the car's open front (the front wall culled), cooler and dimmer by `light`. Order: back wall, side walls, floor, ceiling, panel, rail. */
export const paintCar = (p: Painter, cam: YCam, o: CarOpts = {}) => {
  seq = 0;
  const lv = o.light ?? 1, W = 0.7, D = 0.65, Hc = 2.3;
  const dim = (c: string) => mixColor(c, '#1b2127', 0.38 * (1 - lv));
  // steel values (VD32): above the handrail mid #a7b0b8 / shadow #6f7a84 / highlight #dfe6ec; below mid #7b858e / shadow #59636c / highlight #b4bdc5
  const Z = 1.4, HR = 0.9; // side walls, floor and ceiling run on to z +1.4 (SP1 dark-strip fix; the front wall is culled)
  const lo = {mid: '#7b858e', sh: '#59636c', hi: '#b4bdc5'}, up = {mid: C.steelMid, sh: C.steelShadow, hi: C.steelHi};
  if (o.back !== false) {
    // back wall + soft reflection band, two zones split at the handrail
    wall(p, cam, dim(up.mid), [[-W, HR, -D], [W, HR, -D], [W, Hc, -D], [-W, Hc, -D]]);
    wall(p, cam, dim(lo.mid), [[-W, 0, -D], [W, 0, -D], [W, HR, -D], [-W, HR, -D]]);
    for (let i = 0; i < 9; i++) { wall(p, cam, dim(i % 2 ? up.hi : '#b5bec6'), rect([-W, HR, -D], [0.16, 0, 0], [0, Hc - HR, 0], i * 1.6 + 0.2, i * 1.6 + 0.5)); wall(p, cam, dim(i % 2 ? lo.hi : '#8d98a2'), rect([-W, 0, -D], [0.16, 0, 0], [0, HR, 0], i * 1.6 + 0.2, i * 1.6 + 0.5)); }
    wall(p, cam, dim('#c4ccd3'), rect([-W, HR, -D], [2 * W, 0, 0], [0, Hc - HR, 0], 0.55, 0.7, 0, 1));
    wall(p, cam, dim('#97a1aa'), rect([-W, 0, -D], [2 * W, 0, 0], [0, HR, 0], 0.55, 0.7, 0, 1));
  }
  // side walls (brushed steel, vertical highlights): left in shadow, right mid-to-shadow
  wall(p, cam, dim(up.sh), [[-W, HR, -D], [-W, HR, Z], [-W, Hc, Z], [-W, Hc, -D]]);
  wall(p, cam, dim(lo.sh), [[-W, 0, -D], [-W, 0, Z], [-W, HR, Z], [-W, HR, -D]]);
  wall(p, cam, dim(mixColor(up.mid, up.sh, 0.45)), [[W, HR, -D], [W, HR, Z], [W, Hc, Z], [W, Hc, -D]]);
  wall(p, cam, dim(mixColor(lo.mid, lo.sh, 0.45)), [[W, 0, -D], [W, 0, Z], [W, HR, Z], [W, HR, -D]]);
  for (let i = 0; i < 9; i++) {
    const s0 = i / 9 * (D + Z) / (2 * D) * 0 + i * 0.16 + 0.04;
    wall(p, cam, dim('#7e8993'), rect([-W, HR, -D], [0, 0, 1], [0, Hc - HR, 0], s0, s0 + 0.04));
    wall(p, cam, dim('#9ba5ae'), rect([W, HR, -D], [0, 0, 1], [0, Hc - HR, 0], s0 + 0.02, s0 + 0.06));
    wall(p, cam, dim('#6a747d'), rect([-W, 0, -D], [0, 0, 1], [0, HR, 0], s0, s0 + 0.04));
    wall(p, cam, dim('#8a949d'), rect([W, 0, -D], [0, 0, 1], [0, HR, 0], s0 + 0.02, s0 + 0.06));
  }
  // right-wall inspection plaque, no readable text (small dark screws only)
  wall(p, cam, dim('#c3cad0'), [[0.699, 1.30, -0.05], [0.699, 1.30, 0.19], [0.699, 1.42, 0.19], [0.699, 1.42, -0.05]]);
  for (const [zz, yy] of [[-0.03, 1.32], [0.17, 1.32], [-0.03, 1.40], [0.17, 1.40]] as const) wall(p, cam, '#59636c', [[0.698, yy, zz], [0.698, yy + 0.012, zz], [0.698, yy + 0.012, zz + 0.012], [0.698, yy, zz + 0.012]]);
  // floor bounce: the lower wall falls into shadow (three stacked washes), so the caption band over the wall base reads darker (spike SP1 caption-zone finding)
  for (const [h, op] of [[1.4, 70], [1.0, 80], [0.6, 90]] as const) for (const pts of [[[-W, 0, -D], [W, 0, -D], [W, h, -D], [-W, h, -D]], [[-W, 0, -D], [-W, 0, Z], [-W, h, Z], [-W, h, -D]], [[W, 0, -D], [W, 0, Z], [W, h, Z], [W, h, -D]]] as V3[][]) { const q = P(cam, pts); if (q.length >= 3) washAt(p, 9300 + Math.round(h * 100) + pts[0][0] * 7, '#10151a', op * (0.6 + 0.4 * lv), q, 0.05, 0.05); }
  // floor (speckled charcoal vinyl) and ceiling
  wall(p, cam, C.floor, [[-W, 0, -D], [W, 0, -D], [W, 0, Z], [-W, 0, Z]]);
  for (let i = 0; i < 70; i++) { const x = -W + 1.4 * ((i * 0.6180339) % 1), z = -D + 1.3 * ((i * 0.7548776) % 1), q = P(cam, rect([x, 0.001, z], [0.03, 0, 0], [0, 0, 0.02])); if (q.length >= 3) hardFill(p, 9200 + i, C.speckle, q); }
  wall(p, cam, '#5d6770', [[-W, Hc, -D], [W, Hc, -D], [W, Hc, Z], [-W, Hc, Z]]);
  wall(p, cam, mixColor(C.led, '#10161c', 0.6 * (1 - lv)), [[-0.45, Hc - 0.004, -0.4], [0.45, Hc - 0.004, -0.4], [0.45, Hc - 0.004, 0.4], [-0.45, Hc - 0.004, 0.4]]);
  // LED spill on the walls
  const spill = (pts: V3[], k: number) => { const q = P(cam, pts); if (q.length >= 3) washAt(p, 9400 + k, C.spill, 30 * lv, q, 0.3, 0.2); };
  spill([[-W, 1.55, -D], [W, 1.55, -D], [W, Hc, -D], [-W, Hc, -D]], 1);
  spill([[-W, 1.5, -D], [-W, 1.5, Z], [-W, Hc, Z], [-W, Hc, -D]], 2);
  // button panel on the left wall: stainless plate, display, two columns of buttons, bell
  const pz0 = -0.08, pz1 = -0.32;
  wall(p, cam, C.panel, [[-0.699, 0.85, pz0], [-0.699, 0.85, pz1], [-0.699, 1.55, pz1], [-0.699, 1.55, pz0]]);
  wall(p, cam, C.glass, [[-0.698, 1.40, pz0 - 0.02], [-0.698, 1.40, pz1 + 0.02], [-0.698, 1.50, pz1 + 0.02], [-0.698, 1.50, pz0 - 0.02]]);
  if (o.display) sevenSeg(p, cam, o.display, pz0 - 0.045, 1.485, 0.075, C.digit);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) {
    const zc = pz0 - 0.07 - c * 0.1, yc = 1.30 - r * 0.075;
    const q = P(cam, Array.from({length: 10}, (_, k): V3 => [-0.697, yc + 0.026 * Math.sin((k / 10) * 6.283), zc + 0.026 * Math.cos((k / 10) * 6.283)]));
    if (q.length >= 3) hardFill(p, 9500 + r * 2 + c, C.ring, q);
  }
  // bell button (CL03): amber, with a glow at `bell` (0.3 at rest)
  const bellC: V3 = [-0.697, 0.95, -0.20], bq = P(cam, Array.from({length: 12}, (_, k): V3 => [-0.696, 0.95 + 0.026 * Math.sin((k / 12) * 6.283), -0.2 + 0.026 * Math.cos((k / 12) * 6.283)]));
  const bc = camPoint(cam, bellC), u = camUnit(cam, bellC);
  if (bc) for (const [k, op] of [[0.2, 0.3], [0.12, 0.45], [0.07, 0.6]] as const) washAt(p, 9600 + k * 100, C.glow, 100 * (o.bell ?? 0.3) * op, ell(bc[0], bc[1], k * u, k * u, 18), 0.3, 0.1);
  if (bq.length >= 3) hardFill(p, 9620, C.amber, bq);
  // handrail Ø 0.04 at y 0.90 on the left wall, z -0.55..0.40
  wall(p, cam, C.chrome, [[-0.66, 0.92, -0.55], [-0.66, 0.92, 0.40], [-0.66, 0.88, 0.40], [-0.66, 0.88, -0.55]]);
  for (const z of [-0.5, 0.35]) wall(p, cam, C.steelMid, [[-0.7, 0.93, z], [-0.66, 0.93, z], [-0.66, 0.87, z], [-0.7, 0.87, z]]);
  if (o.front) paintFrontWall(p, cam, dim, o.indicator);
};

/** Front wall (closed centre-opening doors, seam at x 0, door leaves x +-0.45 y 0..2.10) and the transom above them with the floor indicator (SD06): a dark glass 0.40 x 0.16 m, 7-seg digits 0.12 m tall in red-orange. */
const paintFrontWall = (p: Painter, cam: YCam, dim: (c: string) => string, text?: string) => {
  const W = 0.7, D = 0.65, Hc = 2.3, z = D - 0.001;
  wall(p, cam, dim('#9aa4ad'), [[-W, 0, D], [W, 0, D], [W, Hc, D], [-W, Hc, D]]); // jambs and transom
  for (const [x0, x1] of [[-0.45, -0.005], [0.005, 0.45]] as const) {
    wall(p, cam, dim('#aab3bb'), [[x0, 0, z], [x1, 0, z], [x1, 2.1, z], [x0, 2.1, z]]);
    wall(p, cam, dim('#c9d1d8'), [[x0 + 0.03, 0, z - 0.001], [x0 + 0.05, 0, z - 0.001], [x0 + 0.05, 2.1, z - 0.001], [x0 + 0.03, 2.1, z - 0.001]]);
  }
  wall(p, cam, dim('#59636c'), [[-0.006, 0, z - 0.002], [0.006, 0, z - 0.002], [0.006, 2.1, z - 0.002], [-0.006, 2.1, z - 0.002]]); // seam
  wall(p, cam, dim('#6f7a84'), [[-0.46, 2.1, z], [0.46, 2.1, z], [0.46, 2.12, z], [-0.46, 2.12, z]]); // door header line
  wall(p, cam, C.glass, [[-0.2, 2.10, D - 0.002], [0.2, 2.10, D - 0.002], [0.2, 2.26, D - 0.002], [-0.2, 2.26, D - 0.002]]);
  if (text) sevenSegFront(p, cam, text, 2.26 - 0.02, 0.12, C.digit);
};
/** Seven-segment text on the front wall plane (z = 0.648), centred on x 0, top row `yTop`, digits `h` m tall, reading toward -x (the wall is seen from the +z side, camera yaw 180, so screen-right is world -x). */
const sevenSegFront = (p: Painter, cam: YCam, text: string, yTop: number, h: number, color: string) => {
  const w = h * 0.55, t = h * 0.14, gap = h * 0.2, total = text.length * w + (text.length - 1) * gap;
  [...text].forEach((ch, i) => {
    const x0 = -total / 2 + i * (w + gap), seg = SEG[ch] ?? '', zz = 0.648;
    const y = (k: number) => yTop - (k * h) / 2;
    const bar = (id: string, xa: number, xb: number, ya: number, yb: number) => { if (seg.includes(id)) { const q = P(cam, [[-xa, ya, zz], [-xb, ya, zz], [-xb, yb, zz], [-xa, yb, zz]]); if (q.length >= 3) hardFill(p, 9350 + i * 10 + id.charCodeAt(0) % 10, color, q); } };
    bar('a', x0, x0 + w, y(0), y(0) - t); bar('g', x0, x0 + w, y(1) + t / 2, y(1) - t / 2); bar('d', x0, x0 + w, y(2) + t, y(2));
    bar('f', x0, x0 + t, y(0), y(1)); bar('b', x0 + w - t, x0 + w, y(0), y(1)); bar('e', x0, x0 + t, y(1), y(2)); bar('c', x0 + w - t, x0 + w, y(1), y(2));
  });
};

/** The weightless WOMAN of the brief (VD07): P46 + `zero-g-drift`, feet `lift` m off the floor (drawn as `drawFigure` `lift`), whole-card roll, no ground shadow. */
export type FloatOpts = {
  at: V3; t: number; lift: number; rise: number; face?: ExpressionId; faceState?: Partial<FaceState>; roll?: number; pose?: 'P46'; motion?: boolean;
  calm?: boolean; fig?: Partial<FigPose>; /** Right hand on a fixed world point (rail grip, VD07): the arm targets it and the whole-card roll pivots on it. */ grip?: V3; held?: (p: Painter, a: FigAnchors, u: number) => void;
};
export const paintFloat = (p: Painter, cam: YCam, o: FloatOpts): FigAnchors | null => {
  const def = woman(o.rise, o.calm), g0 = camPoint(cam, o.at);
  if (!g0) return null;
  const u = camUnit(cam, o.at), view = 'front' as const;
  const face = {...EXPRESSIONS[o.face ?? 'scared'], ...(o.faceState ?? {})} as FaceState;
  const L = layerMotion({person: def, motion: 'zero-g-drift', t: o.t, g: g0 as Pt, unit: u, view, pose: 'P46', expression: o.face ?? 'scared'});
  const fl = camPoint(cam, o.at) as Pt;
  washAt(p, 9800, '#14181c', 55 * Math.max(0.4, 1 - o.lift * 2), ell(fl[0], fl[1], 0.3 * u, 0.055 * u, 16), 0.15, 0.2); // soft floor shadow: the gap under the feet is what reads weightless
  const g: Pt = [L.g[0], L.g[1] - o.lift * u], roll = (o.roll ?? 0) + L.roll; // the whole card rises: feet leave the floor (drawFigure's `lift` keeps the feet planted)
  const {face: _f, ...body} = L.pose as FigPose;
  const fp = {...body, view, face, noShadow: true, ...o.fig} as FigPose;
  const gp = o.grip ? (camPoint(cam, o.grip) as Pt) : null;
  if (gp) fp.rArm = {to: gp, out: -1};
  const pivot = gp ?? (roll ? hipAnchor(def, g, u, fp) : g);
  let a!: FigAnchors;
  withRoll(p, pivot, roll, () => { a = drawFigure(p, def, g, u, fp, o.t, def.seed); o.held?.(p, a, u); });
  return rollAnchors(a, pivot, roll);
};

/** A held-in-hand or free phone: 0.07 x 0.15 m card at a world point, spun `deg` about the picture axis. */
export const paintPhone = (p: Painter, cam: YCam, at: V3, deg: number) => {
  const c = camPoint(cam, at);
  if (!c) return;
  const u = camUnit(cam, at), a = (deg * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  const R = ([x, y]: Pt): Pt => [c[0] + (x * co - y * si) * u, c[1] + (x * si + y * co) * u];
  hardFill(p, 9700, '#1f2326', [[-0.04, -0.078], [0.04, -0.078], [0.04, 0.078], [-0.04, 0.078]].map((q) => R(q as Pt)));
  hardFill(p, 9701, '#79b6ff', [[-0.033, -0.066], [0.033, -0.066], [0.033, 0.062], [-0.033, 0.062]].map((q) => R(q as Pt)));
  inkLine(p, 9702, [[-0.04, -0.078], [0.04, -0.078], [0.04, 0.078], [-0.04, 0.078]].map((q) => R(q as Pt)), {weight: 0.9, color: INK});
};

/** A pen drifting: 0.14 m barrel, dark blue with a pale clip end, spun `deg`. */
export const paintPen = (p: Painter, cam: YCam, at: V3, deg: number) => {
  const c = camPoint(cam, at);
  if (!c) return;
  const u = camUnit(cam, at), a = (deg * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  const R = ([x, y]: Pt): Pt => [c[0] + (x * co - y * si) * u, c[1] + (x * si + y * co) * u];
  const body = [[-0.07, -0.009], [0.05, -0.009], [0.07, 0], [0.05, 0.009], [-0.07, 0.009]].map((q) => R(q as Pt));
  hardFill(p, 9710, '#2d4f8a', body);
  hardFill(p, 9711, '#e9edf0', [[-0.07, -0.009], [-0.045, -0.009], [-0.045, 0.009], [-0.07, 0.009]].map((q) => R(q as Pt)));
  inkLine(p, 9712, body, {weight: 0.8, color: INK});
};
/** A drifting paper tissue: a loose white quad, corners lifted, spun `deg`. */
export const paintTissue = (p: Painter, cam: YCam, at: V3, deg: number) => {
  const c = camPoint(cam, at);
  if (!c) return;
  const u = camUnit(cam, at), a = (deg * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  const R = ([x, y]: Pt): Pt => [c[0] + (x * co - y * si) * u, c[1] + (x * si + y * co) * u];
  const q = [[-0.05, -0.035], [0.0, -0.05], [0.055, -0.03], [0.045, 0.02], [0.0, 0.045], [-0.055, 0.03]].map((v) => R(v as Pt));
  hardFill(p, 9720, '#f4f1ea', q);
  hardFill(p, 9721, '#d9d6ce', [[0.0, -0.05], [0.055, -0.03], [0.045, 0.02], [0.0, 0.0]].map((v) => R(v as Pt)));
  inkLine(p, 9722, q, {weight: 0.7, color: '#8d9298'});
};

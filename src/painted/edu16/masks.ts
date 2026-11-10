import type {FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {headOutline} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {View4} from '../kit/views';
import {C} from './palette';

// `new: rubber-mask-A` (K02) and `new: paper-mask-B` (brief VD05, N2; Film writes the look at W3, Boss hardens). Head overlays drawn over a kit
// figure from its anchors, in head units (the kit head: x -1..1 at the eyes, top -1.05, chin +1.22; K px per unit = (chin - head.y) / 1.22).
// MASK-A options for the user's pick (Q-F5): A1 the brief's recommendation (pale latex, bushy unibrow, red bulb nose, gap-tooth grin, stick-out
// ears, bald dome), A2 goblin (green-grey latex, pointed ears, hooked nose), A3 pig (pink latex, snout, small ears). Every option is a pull-over
// whose hem rises at the back: in profile and back views the wearer's nape hair and neck stay visible (R1.1, so WALKER reads as not-MAN).
// None is a real person's likeness or the study's mask.

export type MaskId = 'A1' | 'A2' | 'A3' | 'B';
export const MASK_A_OPTIONS: MaskId[] = ['A1', 'A2', 'A3'];
type Look = {base: string; hi: string; shade: string};
const LOOK: Record<'A1' | 'A2' | 'A3', Look> = {
  A1: {base: C.latex, hi: C.latexHi, shade: C.latexShade},
  A2: {base: C.goblin, hi: C.goblinHi, shade: C.goblinShade},
  A3: {base: C.pig, hi: C.pigHi, shade: C.pigShade},
};

export type MaskOpts = {id: MaskId; view: View4; seed: number; /** Wearer's hair colour (nape patch under the hem). */ hair: string; /** Wearer's skin (neck under the hem). */ skin: string;
  /** Sun side in the picture: -1 screen left (default), +1 screen right. */ sun?: -1 | 1;
  /** Peel / pull clock (N2, W5.2): 0 worn, 1 lifted clear above the head (about 1.75 head units up; the mask-off and mask-on poses drive it). */
  lift?: number;
  /** Paint the mask centred on this picture point instead of the head (held in a hand, hanging by the hem): `lift` is ignored. */
  at?: Pt;
  /** Rotation in degrees about the mask centre (a hanging mask swings; positive = clockwise on screen). */
  tilt?: number};

/** Head-unit frame of a figure: centre and px per head unit. */
export const headFrame = (a: FigAnchors) => ({hc: a.head, K: (a.chin - a.head[1]) / 1.22});

/** Hem of the pull-over in profile (local u toward the face): low under the chin at the front, rising to the nape at the back. */
const hemV = (u: number) => (u > 0.55 ? 1.32 : u < -0.95 ? 0.5 : 0.5 + ((u + 0.95) / 1.5) * 0.82);

/** Paint the mask over the figure's head. Returns the mask's picture box (top, bottom) for the readability measure. */
export const paintMask = (p: Painter, a: FigAnchors, o: MaskOpts): {top: number; bottom: number; px: number} => {
  const {hc: head, K} = headFrame(a);
  const hc: Pt = o.at ?? [head[0], head[1] - (o.lift ?? 0) * 1.75 * K];
  const dir = o.view === 'left' ? -1 : 1;
  let n = 0;
  const tr = ((o.tilt ?? 0) * Math.PI) / 180, ct = Math.cos(tr), st = Math.sin(tr);
  const Q = (pts: Pt[]): Pt[] => pts.map(([u, v]) => {
    const x = dir * u * K, y = v * K;
    return [hc[0] + x * ct - y * st, hc[1] + x * st + y * ct] as Pt;
  });
  const fill = (color: string, pts: Pt[]) => hardFill(p, o.seed * 100 + ++n, color, Q(pts));
  const wash = (color: string, op: number, pts: Pt[]) => washAt(p, o.seed * 100 + ++n, color, op, Q(pts), 0.15, 0.2);
  const line = (pts: Pt[], w = 1.0, color: string = C.ink, closed = false, curve = 0.3) => inkLine(p, o.seed * 100 + ++n, Q(pts), {weight: w, color, closed, still: true, curve});
  const E = (cx: number, cy: number, rx: number, ry: number, k = 16, ang = 0) => ell(cx, cy, rx, ry, k, ang);
  const side = o.view === 'left' || o.view === 'right';
  const sun = (o.sun ?? -1) * dir; // sun side in head units (local u)

  if (o.id === 'B') { paintMaskB(o, side, fill, wash, line, E); return {top: hc[1] - 0.9 * K, bottom: hc[1] + 1.1 * K, px: Math.round(2 * K)}; }

  const L = LOOK[o.id];
  // nape patch (profile and back): the wearer's own hair at the nape and the neck below the rising hem
  const off = !!o.at || (o.lift ?? 0) > 0.05; // lifted or held: the wearer's own head shows, no nape patch with the mask
  if (off) { /* none */ } else if (side) {
    fill(o.hair, [[-1.02, 0.35], [-0.6, 0.42], [-0.5, 0.75], [-0.72, 1.02], [-0.98, 0.95]]);
    fill(o.skin, [[-0.72, 0.98], [-0.48, 0.72], [-0.2, 0.95], [-0.3, 1.45], [-0.8, 1.45]]);
  } else if (o.view === 'back') {
    fill(o.hair, [[-0.86, 0.38], [0.86, 0.38], [0.7, 0.9], [0.3, 1.05], [-0.3, 1.05], [-0.7, 0.9]]);
  }
  // ears (behind the dome in front and back; one big ear in profile)
  const earL = (s: number) => {
    if (o.id === 'A2') return [[s * 0.82, -0.25], [s * 1.55, -0.75], [s * 1.25, 0.1], [s * 0.85, 0.35]] as Pt[];
    if (o.id === 'A3') return [[s * 0.45, -0.85], [s * 0.95, -1.25], [s * 0.9, -0.55]] as Pt[];
    return E(s * 1.08, 0.12, 0.3, 0.42, 16);
  };
  if (!side) for (const s of [-1, 1]) { fill(L.base, earL(s)); fill(L.shade, o.id === 'A1' ? E(s * 1.1, 0.14, 0.15, 0.25, 12) : earL(s).map(([u, v]) => [u * 0.94, v * 0.9 + 0.05] as Pt)); line(earL(s), 0.9, L.shade, true); }
  // dome: the kit head outline, 8 % larger, clamped at the hem
  const domeClamped: boolean[] = [];
  const dome: Pt[] = headOutline(48).map(([u, v]) => {
    const U = u * 1.08, V = v < 0 ? v * 1.14 : v * 1.06;
    const hem = side ? hemV(U) : o.view === 'back' ? 0.46 : 1.3;
    domeClamped.push(V >= hem - 0.02);
    return [U, Math.min(V, hem)] as Pt;
  });
  // R3 (H3): the outline is a soft latex-brown rim over the dome only; the hem edge (the clamped run along the face and chin) gets no ink line, so no black cut line crosses the face
  const rim = mixColor(L.shade, C.ink, 0.4);
  const domeRim = () => {
    const n = dome.length, start = domeClamped.findIndex((c) => c);
    if (start < 0) { line(dome, 1.0, rim, true, 0.2); return; }
    let run: Pt[] = [];
    for (let k = 1; k <= n; k++) {
      const i = (start + k) % n;
      if (domeClamped[i]) { if (run.length > 1) line(run, 1.0, rim, false, 0.2); run = []; } else run.push(dome[i]);
    }
    if (run.length > 1) line(run, 1.0, rim, false, 0.2);
  };
  // profile: the face front bulges (brow, nose, chin) beyond the dome
  fill(L.base, dome);
  wash(L.shade, 150, side ? [[-1.05, 0.0], [-0.3, 0.4], [-0.3, 1.0], [-0.95, 0.6]] : o.view === 'back' ? E(0, 0.15, 0.95, 0.4) : E(-sun * 0.55, 0.45, 0.4, 0.6));
  wash(L.hi, 170, E(sun * 0.3, -0.62, 0.38, 0.22, 14, -0.3 * sun));
  // dome wrinkles (A1 bald dome; all options get the latex creases at the hem)
  if (o.id === 'A1') for (let i = 0; i < 3; i++) line(side ? [[-0.3 + 0.1 * i, -0.75 + 0.12 * i], [0.15 + 0.1 * i, -0.8 + 0.12 * i], [0.5, -0.72 + 0.12 * i]] : [[-0.4, -0.66 + 0.11 * i], [0, -0.72 + 0.11 * i], [0.4, -0.66 + 0.11 * i]], 0.8, L.shade);
  if (side) { line([[-0.95, 0.52], [-0.2, 0.93], [0.55, 1.31]], 1.0, L.shade); line([[-0.6, 0.6], [-0.45, 0.78]], 0.7, L.shade); }
  else if (o.view === 'front') line([[-0.7, 1.22], [-0.2, 1.3], [0.3, 1.29], [0.7, 1.2]], 1.0, L.shade);
  else line([[-0.9, 0.44], [0, 0.5], [0.9, 0.44]], 1.0, L.shade);

  if (o.view === 'back') {
    for (let i = 0; i < 2; i++) line([[-0.5, -0.4 + 0.3 * i], [0, -0.35 + 0.3 * i], [0.5, -0.4 + 0.3 * i]], 0.7, L.shade);
    domeRim();
    return {top: hc[1] - 1.2 * K, bottom: hc[1] + 0.5 * K, px: Math.round(2.4 * K)};
  }

  if (side) {
    // profile ear (one, mid-head), eye hole, brow, nose, grin
    if (o.id === 'A1') { fill(L.base, E(-0.12, 0.12, 0.3, 0.4)); fill(L.shade, E(-0.1, 0.14, 0.16, 0.26, 12)); line(E(-0.12, 0.12, 0.3, 0.4), 0.9, L.shade, true); }
    if (o.id === 'A2') { fill(L.base, [[-0.2, -0.1], [-1.05, -0.85], [-0.55, 0.25], [-0.15, 0.4]]); line([[-0.2, -0.1], [-1.05, -0.85], [-0.55, 0.25], [-0.15, 0.4]], 0.9, L.shade, true); }
    if (o.id === 'A3') { fill(L.base, [[-0.15, -0.85], [-0.45, -1.35], [0.15, -0.95]]); line([[-0.15, -0.85], [-0.45, -1.35], [0.15, -0.95]], 0.9, L.shade, true); }
    fill('#1b1612', E(0.62, -0.06, 0.13, 0.08, 12));
    if (o.id === 'A1') {
      fill(C.unibrow, [[0.25, -0.38], [0.6, -0.48], [1.0, -0.4], [1.02, -0.25], [0.6, -0.28], [0.25, -0.24]]);
      fill(L.base, [[0.82, 0.55], [1.12, 0.62], [1.1, 0.92], [0.85, 1.25], [0.55, 1.32]]); // chin
      fill(C.lips, [[0.7, 0.62], [1.12, 0.6], [1.08, 0.78], [0.75, 0.8]]);
      fill(C.teeth, [[0.85, 0.64], [1.09, 0.63], [1.07, 0.73], [0.86, 0.73]]);
      line([[0.97, 0.63], [0.97, 0.73]], 1.2, C.lips);
      fill(C.nose, E(1.12, 0.22, 0.27, 0.24));
      wash('#ffffff', 170, E(1.08, 0.12, 0.08, 0.06, 10));
    } else if (o.id === 'A2') {
      fill(L.shade, [[0.3, -0.42], [1.02, -0.38], [1.0, -0.2], [0.35, -0.22]]); // brow ridge
      fill(L.base, [[0.9, -0.15], [1.55, 0.25], [1.42, 0.42], [1.0, 0.35]]); // hooked nose
      fill(L.base, [[0.82, 0.55], [1.12, 0.6], [1.1, 0.95], [0.85, 1.25], [0.55, 1.32]]);
      fill('#3a2420', [[0.66, 0.6], [1.12, 0.56], [1.08, 0.8], [0.72, 0.82]]);
      for (let i = 0; i < 3; i++) fill(C.teeth, [[0.78 + 0.1 * i, 0.58], [0.86 + 0.1 * i, 0.58], [0.83 + 0.1 * i, 0.7]]);
      fill(L.shade, E(0.75, 0.1, 0.06, 0.05, 8));
    } else {
      fill(L.base, [[0.82, 0.55], [1.08, 0.6], [1.06, 0.9], [0.85, 1.22], [0.55, 1.32]]);
      fill(L.base, [[0.85, -0.05], [1.5, 0.0], [1.5, 0.48], [0.85, 0.5]]); // snout
      fill(L.shade, E(1.5, 0.24, 0.08, 0.25, 12));
      fill('#7a3a3a', E(1.5, 0.3, 0.035, 0.07, 8));
      line([[0.75, 0.72], [0.95, 0.78], [1.05, 0.72]], 1.0, '#7a3a3a');
    }
    domeRim();
    return {top: hc[1] - 1.2 * K, bottom: hc[1] + 1.32 * K, px: Math.round(2.5 * K)};
  }

  // front
  fill('#1b1612', E(-0.36, -0.06, 0.16, 0.1, 12));
  fill('#1b1612', E(0.36, -0.06, 0.16, 0.1, 12));
  if (o.id === 'A1') {
    fill(C.unibrow, [[-0.72, -0.3], [-0.4, -0.44], [0, -0.36], [0.4, -0.44], [0.72, -0.3], [0.7, -0.18], [0.35, -0.26], [0, -0.2], [-0.35, -0.26], [-0.7, -0.18]]);
    for (let i = 0; i < 7; i++) line([[-0.66 + 0.22 * i, -0.4], [-0.62 + 0.22 * i, -0.47]], 0.9, C.unibrow);
    fill(C.lips, [[-0.62, 0.6], [0, 0.56], [0.62, 0.6], [0.5, 0.86], [0, 0.92], [-0.5, 0.86]]);
    fill(C.teeth, [[-0.5, 0.64], [0.5, 0.64], [0.44, 0.78], [-0.44, 0.78]]);
    fill('#3a2420', [[-0.05, 0.64], [0.07, 0.64], [0.07, 0.78], [-0.05, 0.78]]); // the gap
    for (const x of [-0.3, -0.16, 0.2, 0.34]) line([[x, 0.64], [x, 0.78]], 0.6, C.latexShade);
    fill(C.nose, E(0, 0.2, 0.3, 0.27));
    wash('#ffffff', 170, E(-0.08 * -sun, 0.1, 0.09, 0.07, 10));
    wash(C.nose, 70, E(-0.5, 0.45, 0.18, 0.12));
    wash(C.nose, 70, E(0.5, 0.45, 0.18, 0.12));
  } else if (o.id === 'A2') {
    fill(L.shade, [[-0.75, -0.32], [0, -0.22], [0.75, -0.32], [0.7, -0.18], [0, -0.1], [-0.7, -0.18]]);
    fill(L.shade, [[-0.12, -0.1], [0.12, -0.1], [0.2, 0.42], [0, 0.55], [-0.2, 0.42]]);
    fill(L.base, [[-0.1, -0.12], [0.1, -0.12], [0.14, 0.38], [0, 0.48], [-0.14, 0.38]]);
    fill('#3a2420', [[-0.6, 0.62], [0.6, 0.62], [0.4, 0.88], [-0.4, 0.88]]);
    for (const x of [-0.42, -0.14, 0.14, 0.42]) fill(C.teeth, [[x - 0.07, 0.62], [x + 0.07, 0.62], [x, 0.76]]);
    for (const [x, y] of [[0.5, -0.6], [-0.55, 0.2], [0.42, 0.35]] as Pt[]) fill(L.shade, E(x, y, 0.05, 0.045, 8));
  } else {
    fill(L.base, E(0, 0.3, 0.38, 0.3));
    fill(L.shade, E(0, 0.3, 0.3, 0.22));
    for (const s of [-1, 1]) fill('#7a3a3a', E(s * 0.12, 0.3, 0.06, 0.1, 10));
    line([[-0.4, 0.78], [0, 0.88], [0.4, 0.78]], 1.1, '#7a3a3a');
    wash('#e07a80', 90, E(-0.6, 0.5, 0.18, 0.12));
    wash('#e07a80', 90, E(0.6, 0.5, 0.18, 0.12));
  }
  domeRim();
  return {top: hc[1] - 1.2 * K, bottom: hc[1] + 1.3 * K, px: Math.round(2.5 * K)};
};

/** MASK-B: a white paper-plate face on an elastic string (front and profile; back shows the string only). */
const paintMaskB = (o: MaskOpts, side: boolean, fill: (c: string, pts: Pt[]) => void, wash: (c: string, op: number, pts: Pt[]) => void,
  line: (pts: Pt[], w?: number, color?: string, closed?: boolean, curve?: number) => void, E: (cx: number, cy: number, rx: number, ry: number, k?: number, ang?: number) => Pt[]) => {
  if (o.view === 'back') { line([[-1.0, -0.1], [0, -0.05], [1.0, -0.1]], 1.6, C.elastic); return; }
  if (side) {
    line([[1.0, -0.15], [0.2, -0.25], [-1.0, -0.1]], 1.6, C.elastic);
    fill(C.paperShade, [[1.02, -0.9], [1.16, -0.88], [1.22, 0.1], [1.16, 1.05], [1.02, 1.08], [1.1, 0.1]]);
    fill(C.paper, [[1.08, -0.9], [1.2, -0.85], [1.26, 0.1], [1.2, 1.03], [1.1, 1.08], [1.16, 0.1]]);
    return;
  }
  line([[-1.0, -0.15], [-0.92, -0.1]], 1.6, C.elastic);
  line([[0.92, -0.1], [1.0, -0.15]], 1.6, C.elastic);
  fill(C.paperShade, E(0, 0.1, 0.98, 1.02, 28));
  fill(C.paper, E(0, 0.08, 0.86, 0.9, 28));
  fill('#1b1612', E(-0.32, -0.12, 0.11, 0.08, 10));
  fill('#1b1612', E(0.32, -0.12, 0.11, 0.08, 10));
  wash(C.cheek, 170, E(-0.5, 0.3, 0.16, 0.11, 12));
  wash(C.cheek, 170, E(0.5, 0.3, 0.16, 0.11, 12));
  line([[-0.45, 0.42], [-0.2, 0.62], [0.2, 0.62], [0.45, 0.42]], 1.4, C.smile);
};

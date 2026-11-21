import type {Brush} from '../BrushCanvas';
import {inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {ANIMALS} from '../kit/animals';
import {mixYCam, type YCam} from '../kit/ycam';
import {easeInOut} from './field-cat';
import {lead} from './looks';
import {CAT_SLEEP, paintOfficeSet} from './office';
import {b06Clock, B06SH02_N, paintSleepingCat, paintWarmPool} from './b06-sh02';

// EDU-EP32-SHORT B06-SH03 "stamp insert, the last shot" (timed sheet EDU-EP32-SHEET-R1, G [1651, 1689), 38 f; VD32-27; Boss G7, 2026-11-21).
// One plate EDU32-B06-SH03 on the LF04 set with B06-SH02's warm pool and lamp-lit cat: a close top-down three-quarter on the memo, the red
// mock stamp "WOULD NOT BE / PRACTICAL" (camera-mapped DOM `MemoText`, office-text.tsx) in the middle of the frame, the sleeping cat's grey
// flank as a fur wall along the top edge (DOM cut-out `catHole`), breathing only. Camera: eye (+0.42, 1.22, +0.89) yaw 0 -> (+0.42, 1.13,
// +0.84) yaw +2, pitch -62, f 900, hy 760, L0 -> L37 eased (~8 % push). No caption. The last frame of the clip is L37 (G1688), a clean hold.
// Shot-local L = round(tl * 30); the cat clock continues B06-SH02's.

export const B06SH03_N = 38;
const DEG = Math.PI / 180;
export const CAM_B06_SH03_0: YCam = {x: 0.42, y: 1.22, z: 0.89, yaw: 0, pitch: -62 * DEG, f: 900, hy: 760};
export const CAM_B06_SH03_1: YCam = {x: 0.42, y: 1.13, z: 0.84, yaw: 2 * DEG, pitch: -62 * DEG, f: 900, hy: 760};
export const b06sh03Cam = (L: number): YCam => mixYCam(CAM_B06_SH03_0, CAM_B06_SH03_1, easeInOut(L / (B06SH03_N - 1)));

/** Lowest y of polygon `poly` on the vertical x (the cat's belly edge in picture), or null off its span. */
export const bottomAt = (poly: Pt[], x: number): number | null => {
  let y: number | null = null;
  for (let i = 0; i < poly.length; i++) {
    const [a, b] = [poly[i], poly[(i + 1) % poly.length]];
    if ((a[0] - x) * (b[0] - x) > 0 || a[0] === b[0]) continue;
    const yy = a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
    y = y === null ? yy : Math.max(y, yy);
  }
  return y;
};

/** The opaque fills (kit `hardFill` and the kit animal's full-alpha `fill` polygons) a paint call makes, recorded instead of drawn: the cat's true outline at
 *  this magnification (the coarse DOM `catHole` contour is off by up to ~0.03 cat heights, ~90 px here). */
export const recordFills = (paint: (p: Painter) => void): Pt[][] => {
  const out: Pt[][] = [];
  let wash = false, fill = false;
  const brush = new Proxy({}, {get: (_, k) => k === 'wash' ? (_c: string, a: number) => { wash = a >= 250; } : k === 'noWash' ? () => { wash = false; }
    : k === 'fill' ? (_c: string, a: number) => { fill = a >= 250; } : k === 'noFill' ? () => { fill = false; }
    : k === 'polygon' ? (pts: Pt[]) => { if (wash || fill) out.push(pts.map(([x, y]): Pt => [x, y])); } : () => undefined}) as Brush;
  paint(makePainter(brush, {t: 0, frame: 0}));
  return out;
};
/** Point inside any of the polygons (even-odd per polygon). */
export const insideAny = (polys: Pt[][], [x, y]: Pt) => polys.some((q) => {
  let c = false;
  for (let i = 0, j = q.length - 1; i < q.length; j = i++) {
    const [xi, yi] = q[i], [xj, yj] = q[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
});
/** Lowest y over a set of polygons on the vertical x (the cat's belly edge), or null where none spans x. */
export const bottomOf = (polys: Pt[][], x: number): number | null => {
  let y: number | null = null;
  for (const q of polys) { const b = bottomAt(q, x); if (b !== null) y = y === null ? b : Math.max(y, b); }
  return y;
};

/** Close fur on the flank (the kit drawing is flat at this magnification): long-hair strands over the visible mass and a soft fringe along the
 *  belly edge, laid lengthwise along the body (screen-right, a little down), from the DOM cut-out outline `catHole`. World-fixed per seed. */
export const paintFlankFur = (p: Painter, polys: Pt[][], seed: number) => {
  const A = ANIMALS['cat-gray-tabby'], dark = A.dark ?? '#4e4a48', light = A.light ?? '#d8d4cc', cols = [dark, mixColor(A.coat, dark, 0.35), mixColor(A.coat, light, 0.5), light];
  const xs = polys.flat().map((v) => v[0]), x0 = Math.max(-40, Math.min(...xs)), x1 = Math.min(1120, Math.max(...xs));
  // strands inside: rows from the frame top to the belly edge
  for (let i = 0; i < 260; i++) {
    const x = x0 + (x1 - x0) * hash(seed + i * 5), yb = bottomOf(polys, x);
    if (yb === null || yb < 0) continue;
    const y = yb - 14 - (yb + 20) * hash(seed + i * 5 + 1), l = 26 + 46 * hash(seed + i * 5 + 2), a = 0.12 + 0.18 * hash(seed + i * 5 + 3);
    const col = cols[Math.floor(hash(seed + i * 5 + 4) * 4)];
    if (!insideAny(polys, [x, y]) || !insideAny(polys, [x + l * Math.cos(a), y + l * Math.sin(a)])) continue;
    inkLine(p, seed + 1000 + i, [[x, y], [x + l * 0.5 * Math.cos(a), y + l * 0.5 * Math.sin(a) - 3], [x + l * Math.cos(a), y + l * Math.sin(a)]], {color: col, weight: 0.5 + 0.6 * hash(seed + i * 7), closed: false, curve: 0.3});
  }
  // fringe: short tufts crossing the belly edge, light tips catching the lamp pool on the page
  for (let x = x0, k = 0; x < x1; x += 9 + 6 * hash(seed + 3000 + k), k++) {
    const yb = bottomOf(polys, x);
    if (yb === null || yb < 0) continue;
    const l = 14 + 18 * hash(seed + 3100 + k), dx = 6 + 10 * hash(seed + 3200 + k);
    inkLine(p, seed + 4000 + k, [[x - dx, yb - l], [x, yb - 0.3 * l], [x + 0.4 * dx, yb + 3 + 4 * hash(seed + 3300 + k)]], {color: k % 3 ? cols[1] : cols[2], weight: 0.7, closed: false, curve: 0.4});
  }
};

/** Contact shade on the page under the flank: a soft wash hugging the cat's belly edge, deepest at the edge (it lies on the sheet). */
export const paintFlankShadow = (p: Painter, polys: Pt[][], seed: number) => {
  const xs = polys.flat().map((v) => v[0]), x0 = Math.max(-40, Math.min(...xs)), x1 = Math.min(1120, Math.max(...xs));
  const top: Pt[] = [];
  for (let x = x0; x <= x1; x += 16) { const y = bottomOf(polys, x); if (y !== null) top.push([x, y - 10]); }
  if (top.length < 3) return;
  for (const [k, d, op] of [[0, 40, 40], [1, 18, 60]] as const)
    washAt(p, seed + k, '#1e140c', op, [...top, ...top.slice().reverse().map(([x, y]): Pt => [x + 0.4 * d, y + 10 + d])], 0.5, 0.1);
};

/** The B06-SH03 plate at shot frame L. */
export const paintB06SH03 = (p: Painter, L: number, id = 'B06-SH03') => {
  const c = b06sh03Cam(L);
  paintOfficeSet(p, c, paintWarmPool);
  const t = b06Clock(B06SH02_N + L), edge = recordFills((q) => paintSleepingCat(q, c, t, CAT_SLEEP, false));
  paintFlankShadow(p, edge, 38050);
  const r = paintSleepingCat(p, c, t, CAT_SLEEP, false);
  paintFlankFur(p, edge, 38100);
  if (r) lead(id, 'CAT real x16 (flank)', r);
  return r;
};

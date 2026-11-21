import type {Pt} from '../kit/painter';
import type {V3} from '../kit/space';

// EDU-EP31-SHORT Space P plate helpers (Boss W5.2 batch 2, 2026-11-21): the `new: photo-print-8x10` (CCTV-STILL-01) on the interview table that
// B06-SH01 slides and B06-SH02 keeps in the soft foreground, and the picture cut-outs that let a painted arm show through the DOM print. React-free.

/** 8 x 10 in print (m). */
export const PRINT_W = 0.203, PRINT_H = 0.254;
/** World corners (top-left, top-right, bottom-right, bottom-left as read by the viewer: top toward -z) of the print lying on the table, centre
 *  `c`, rotated `rot` degrees counter-clockwise seen from above. */
export const printQuad = (c: V3, rot = 0): [V3, V3, V3, V3] => {
  const a = (rot * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  const k = (dx: number, dz: number): V3 => [c[0] + dx * co + dz * si, c[1], c[2] - dx * si + dz * co];
  return [k(-PRINT_W / 2, -PRINT_H / 2), k(PRINT_W / 2, -PRINT_H / 2), k(PRINT_W / 2, PRINT_H / 2), k(-PRINT_W / 2, PRINT_H / 2)];
};
/** Picture polygons around a painted two-bone arm (shoulder -> elbow -> hand, px) and its mitten, `u` px per metre: cut out of a DOM layer lying
 *  over the canvas so the arm reads in front of it. The cut-out is an evenodd clip, so overlapping holes would cancel: the forearm and mitten
 *  are one convex hull, the upper arm a second hull clipped short of the elbow. */
export const armHoles = (sh: Pt, el: Pt, hand: Pt, u: number): Pt[][] => {
  const cap = (a: Pt, b: Pt, r: number): Pt[] => {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out: Pt[] = [];
    for (let i = 0; i <= 8; i++) { const t = ang - Math.PI / 2 + (i / 8) * Math.PI; out.push([b[0] + Math.cos(t) * r, b[1] + Math.sin(t) * r]); }
    for (let i = 0; i <= 8; i++) { const t = ang + Math.PI / 2 + (i / 8) * Math.PI; out.push([a[0] + Math.cos(t) * r, a[1] + Math.sin(t) * r]); }
    return out;
  };
  const k = 0.5, el2: Pt = [sh[0] + (el[0] - sh[0]) * k, sh[1] + (el[1] - sh[1]) * k];
  return [hull([...cap(sh, el2, 0.06 * u)]), hull([...cap(el, hand, 0.06 * u), ...cap(hand, hand, 0.08 * u)])];
};

/** Convex hull (monotone chain) of picture points. */
export const hull = (pts: Pt[]): Pt[] => {
  const q = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const v of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], v) <= 0) lo.pop(); lo.push(v); }
  for (const v of q.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], v) <= 0) up.pop(); up.push(v); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

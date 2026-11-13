import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {clamp01, ease} from '../kit/space';

// N9 `new: balance` (brief N9 + "balance D (px)"): a small brass apothecary balance on the fixed 1080 x 1920 diagram plane: pivot (540, 640) on a slim column down
// to a base at y 1500; beam 600 px (F-B06); pans 240 px wide hanging 300 px below each end (left pan centre (240, 940), right (840, 940)). The beam wobbles +-4 deg
// at 1.4 Hz with decaying amplitude and settles level by +45 (SH06). The pans stay horizontal (they hang from the beam ends). Straight bars sit on a flat
// underlayer (DF-20261030-painted-straight-bars). EP17 N11 is the same design but has no code in this checkout (`src/painted/edu17` absent), so this is the first.
export const BAL = {pivot: [540, 640] as Pt, beam: 600, base: 1500, drop: 300, panW: 240, hz: 1.4, amp: 4, settle: 45, drops: {left: 4, right: 8}, brass: '#c8a24a', brassDk: '#8a6a24', brassHi: '#f0d98a'};
/** Beam angle in degrees at SH06 event frame `L` (positive = right end down): empty = level; an impulse at each landing (+4 left, +8 right), decaying, 0 from +45. */
export const balanceAngle = (L: number): number => {
  const imp = (t0: number, sign: number) => (L <= t0 ? 0 : sign * Math.exp(-(L - t0) / 9) * Math.sin(2 * Math.PI * BAL.hz * (L - t0) / 30));
  const a = (BAL.amp * (imp(BAL.drops.left, -1) + 0.8 * imp(BAL.drops.right, 1))) * (1 - ease(clamp01((L - 38) / (BAL.settle - 38))));
  return L >= BAL.settle ? 0 : a;
};
/** Geometry at an angle: beam ends, pan centres, chain tops. */
export const balanceGeom = (deg: number) => {
  const a = (deg * Math.PI) / 180, [px, py] = BAL.pivot, h = BAL.beam / 2;
  const L: Pt = [px - h * Math.cos(a), py - h * Math.sin(a)], R: Pt = [px + h * Math.cos(a), py + h * Math.sin(a)];
  return {L, R, panL: [L[0], L[1] + BAL.drop] as Pt, panR: [R[0], R[1] + BAL.drop] as Pt};
};
const bar = (p: Painter, seed: number, a: Pt, b: Pt, w: number, color: string) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, nx = (-dy / n) * w / 2, ny = (dx / n) * w / 2;
  hardFill(p, seed, mixColor(color, '#2b211c', 0.35), [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]);
  hardFill(p, seed + 1, color, [[a[0] + nx * 0.85, a[1] + ny * 0.85 - 1], [b[0] + nx * 0.85, b[1] + ny * 0.85 - 1], [b[0] - nx * 0.5, b[1] - ny * 0.5 - 1], [a[0] - nx * 0.5, a[1] - ny * 0.5 - 1]]);
};
/** Pan: a shallow brass dish (a half ellipse under the chains) with a bright rim. Returns the dish's top surface centre (where a figure stands). */
export const paintPan = (p: Painter, seed: number, c: Pt, top: Pt) => {
  const w = BAL.panW, dish: Pt[] = [[c[0] - w / 2, c[1]], ...Array.from({length: 13}, (_, i): Pt => { const t = (i / 12) * Math.PI; return [c[0] - Math.cos(t) * w / 2, c[1] + Math.sin(t) * 34]; }), [c[0] + w / 2, c[1]]];
  hardFill(p, seed, BAL.brassDk, dish);
  hardFill(p, seed + 1, BAL.brass, dish.map(([x, y]) => [x, y - 4] as Pt));
  washAt(p, seed + 2, BAL.brassHi, 200, ell(c[0] - w * 0.18, c[1] + 6, w * 0.16, 5, 12), 0, 0);
  inkLine(p, seed + 3, [[c[0] - w / 2, c[1]], [c[0] + w / 2, c[1]]], {weight: 2.2, color: BAL.brassHi, closed: false, curve: 0});
  [-1, 1].forEach((s, i) => inkLine(p, seed + 4 + i, [top, [c[0] + s * w / 2, c[1]]], {weight: 1.4, color: BAL.brassDk, closed: false, curve: 0}));
  return [c[0], c[1] - 2] as Pt;
};
/** Paints the balance at SH06 event frame `L` over whatever is behind it; returns the two figure standing points (pan surfaces). */
export const paintBalance = (p: Painter, L: number): {left: Pt; right: Pt; angle: number} => {
  const ang = balanceAngle(L), g = balanceGeom(ang), [px, py] = BAL.pivot;
  // column, base foot
  bar(p, 54000, [px, py], [px, BAL.base], 26, BAL.brass);
  hardFill(p, 54003, BAL.brassDk, ell(px, BAL.base + 6, 150, 26, 24));
  hardFill(p, 54004, BAL.brass, ell(px, BAL.base, 150, 24, 24));
  washAt(p, 54005, BAL.brassHi, 180, ell(px - 40, BAL.base - 6, 60, 6, 12), 0, 0);
  // beam, pivot cap, end knobs
  bar(p, 54010, g.L, g.R, 20, BAL.brass);
  hardFill(p, 54013, BAL.brassDk, ell(px, py, 20, 20, 20));
  hardFill(p, 54014, BAL.brassHi, ell(px - 4, py - 4, 8, 8, 12));
  [g.L, g.R].forEach((e, i) => hardFill(p, 54015 + i, BAL.brassDk, ell(e[0], e[1], 12, 12, 14)));
  const left = paintPan(p, 54020, g.panL, g.L), right = paintPan(p, 54030, g.panR, g.R);
  return {left, right, angle: ang};
};

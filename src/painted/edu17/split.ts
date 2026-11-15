import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {C} from './palette';

// N15 over-under split (brief N15, scene sheet B03-SH02; Boss W5): one canvas, the lower picture (W deep) painted first, then the upper picture's
// sunlit backdrop as a polygon above a wavy waterline seam, then the upper subject (the hose close-up) on top. The seam is a screen mask, not a world
// surface; its wave travels with the frame so it reads as water. No clipping API: the upper subject must stay above the seam (it does: hose y 620-660).

/** Wavy seam points across the frame at mean height `y` (px), phase from shot time `t` (s). */
export const seamLine = (y: number, t: number, amp = 9): Pt[] =>
  Array.from({length: 25}, (_, i) => { const x = -40 + i * 48; return [x, y + amp * Math.sin(x / 95 + t * 2.4) + amp * 0.45 * Math.sin(x / 41 - t * 3.1)] as Pt; });

/** The upper half's out-of-focus sunlit yard behind the hose (sky, bay, the sea wall and a pot, sand), clipped to the seam. */
export const paintUpperBackdrop = (p: Painter, seamY: number, t: number) => {
  const s = seamLine(seamY, t), under = (y: number) => Math.min(y, seamY - 20);
  const band = (seed: number, col: string, y0: number, y1: number) => {
    if (y0 >= seamY) return;
    const bottom = y1 >= seamY ? s.map(([x, y]) => [x, y] as Pt).reverse() : [[1120, y1], [-40, y1]] as Pt[];
    hardFill(p, seed, col, [[-40, y0], [1120, y0], ...bottom]);
  };
  band(8800, mixColor(C.skyMid, C.haze, 0.35), -40, 300);
  band(8801, mixColor(C.bayNear, C.skyMid, 0.35), 300, 470);
  band(8802, mixColor(C.wall, C.sand, 0.25), 470, 900);
  band(8803, mixColor(C.sand, C.wall, 0.2), 900, 2000);
  // soft out-of-focus shapes: the plank line, a clay pot with chilli leaves (left), bougainvillea pink (right), sun bloom
  washAt(p, 8810, mixColor(C.plank, C.wall, 0.45), 150, [[-40, 455], [1120, 440], [1120, 492], [-40, 505]], 0.2, 0);
  washAt(p, 8811, mixColor(C.clay, C.wall, 0.35), 160, ell(170, under(560), 120, 90, 18), 0.2, 0);
  washAt(p, 8812, mixColor(C.leaf, C.skyMid, 0.3), 150, ell(150, 400, 150, 110, 18), 0.25, 0);
  washAt(p, 8813, mixColor(C.boug, C.wall, 0.35), 140, ell(960, 360, 170, 120, 18), 0.25, 0);
  washAt(p, 8814, '#fff6dc', 110, ell(760, 200, 260, 140, 18), 0.25, 0);
};

/** The waterline itself: a light foam edge and a darker meniscus under it (drawn after both halves). */
export const paintSeamEdge = (p: Painter, seamY: number, t: number) => {
  const s = seamLine(seamY, t);
  inkLine(p, 8820, s.map(([x, y]) => [x, y + 5] as Pt), {closed: false, color: mixColor(C.slope1, C.deep1, 0.4), weight: 2.2, still: true, curve: 0.5});
  inkLine(p, 8821, s, {closed: false, color: '#f4fbff', weight: 2.6, still: false, curve: 0.5});
};

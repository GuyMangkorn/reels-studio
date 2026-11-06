import {ell, hardFill, inkLine, INK, solid} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

// Shop-counter props (kit intake KIT-P01 from EDU-EP04-SHORT, copied; the episode keeps its own `edu04/props.tsx` and
// `edu04/checkout.ts`). Painter-space helpers: the hand-held ones take the grip point in px and `u` px per metre; the counter
// ones take a `YCam` and a world point. Palette defaults are the episode's; every colour can be overridden.

/** A pineapple: `at` = centre of the body (px), `u` px per metre; body 0.2 m wide, 0.26 m tall, crown 0.14 m. */
export const paintPineapple = (p: Painter, at: Pt, u: number, seed = 8300) => {
  const [x, y] = at, rx = 0.1 * u, ry = 0.13 * u;
  const crown = ['#3f7a3a', '#4f9a4c', '#3f7a3a'];
  [-1, 0, 1].forEach((k, i) => solid(p, seed + i, crown[i], [[x + k * 0.025 * u, y - ry * 0.85], [x + k * 0.08 * u - 0.025 * u, y - ry - 0.13 * u], [x + k * 0.1 * u, y - ry - 0.05 * u], [x + k * 0.04 * u + 0.03 * u, y - ry * 0.85]], 2, 0.05, 0.1));
  solid(p, seed + 4, '#e3a52a', ell(x, y, rx, ry, 18), 3, 0.06, 0.1);
  inkLine(p, seed + 5, ell(x, y, rx, ry, 18), {weight: 1.2, color: mixColor('#e3a52a', INK, 0.65)});
  for (let i = -2; i <= 2; i++) {
    inkLine(p, seed + 6 + i + 2, [[x + i * 0.04 * u - 0.05 * u, y - ry * 0.75], [x + i * 0.04 * u + 0.05 * u, y + ry * 0.75]], {closed: false, weight: 0.6, color: '#a66f1c'});
    inkLine(p, seed + 12 + i + 2, [[x + i * 0.04 * u + 0.05 * u, y - ry * 0.75], [x + i * 0.04 * u - 0.05 * u, y + ry * 0.75]], {closed: false, weight: 0.6, color: '#a66f1c'});
  }
};

/** A drawstring coin purse in the hand (`hand` = grip px). */
export const paintCoinPurse = (p: Painter, hand: Pt, u: number, seed = 8350) => {
  const [x, y] = hand, w = 0.09 * u, h = 0.1 * u;
  solid(p, seed, '#7a4b2f', [[x - w, y - h * 0.4], [x + w, y - h * 0.4], [x + w * 1.15, y + h * 0.4], [x, y + h * 0.7], [x - w * 1.15, y + h * 0.4]], 3, 0.06, 0.1);
  inkLine(p, seed + 1, [[x - w, y - h * 0.4], [x + w, y - h * 0.4], [x + w * 1.15, y + h * 0.4], [x, y + h * 0.7], [x - w * 1.15, y + h * 0.4]], {weight: 1.1, color: INK});
  inkLine(p, seed + 2, [[x - w * 0.9, y - h * 0.4], [x - w * 0.3, y - h * 0.62], [x + w * 0.3, y - h * 0.62], [x + w * 0.9, y - h * 0.4]], {closed: false, weight: 1.1, color: '#4b2d1c', curve: 0.3});
};

/** A stack of `n` coins (diameter `d` m, 0.012 m thick, exaggerated for a 270 px read) at the world point `base` on a counter. */
export const paintCoins = (p: Painter, c: YCam, base: V3, n: number, d = 0.07, seed = 8400) => {
  const u = camUnit(c, base), th = 0.012;
  for (let i = 0; i < n; i++) {
    const g = camPoint(c, [base[0], base[1] + i * th, base[2]]);
    if (!g) continue;
    const rx = (d / 2) * u, ry = rx * 0.4, off = (i % 2 ? 0.012 : -0.012) * u, tone = i % 2 ? '#e8c04a' : '#d9ab33';
    hardFill(p, seed + i * 4, mixColor(tone, INK, 0.35), ell(g[0] + off, g[1] + th * u * 0.5, rx, ry, 14));
    hardFill(p, seed + i * 4 + 1, tone, ell(g[0] + off, g[1], rx, ry, 14));
    inkLine(p, seed + i * 4 + 2, ell(g[0] + off, g[1], rx, ry, 14), {weight: 0.9, color: INK});
    inkLine(p, seed + i * 4 + 3, ell(g[0] + off, g[1], rx * 0.62, ry * 0.62, 12), {weight: 0.5, color: '#a47a1c'});
  }
};

/** A hand basket with noodles, an egg carton and bananas: `hand` = grip px, `u` px per metre, `color` the basket (default signal red). */
export const paintBasket = (p: Painter, hand: Pt, u: number, seed: number, color = '#d6402f') => {
  const [x, y] = hand, w = 0.42 * u, bw = 0.34 * u, rim = y + 0.1 * u, h = 0.22 * u;
  solid(p, seed + 1, '#e48a3a', [[x - w * 0.46, rim + h * 0.05], [x - w * 0.12, rim + h * 0.05], [x - w * 0.12, rim - h * 0.5], [x - w * 0.46, rim - h * 0.5]], 2);
  solid(p, seed + 2, '#f4f0e6', [[x - w * 0.08, rim + h * 0.05], [x + w * 0.3, rim + h * 0.05], [x + w * 0.3, rim - h * 0.36], [x - w * 0.08, rim - h * 0.36]], 2);
  inkLine(p, seed + 3, [[x + w * 0.1, rim - h * 0.2], [x + w * 0.34, rim - h * 0.55], [x + w * 0.5, rim - h * 0.5]], {closed: false, weight: 1.6, color: '#d9a62a'});
  const body: Pt[] = [[x - w / 2, rim], [x + w / 2, rim], [x + bw / 2, rim + h], [x - bw / 2, rim + h]];
  solid(p, seed + 4, color, body, 3, 0.05, 0.1);
  inkLine(p, seed + 5, body, {weight: 0.9, color: mixColor(color, INK, 0.6)});
  for (let i = 1; i < 5; i++) inkLine(p, seed + 6 + i, [[x - w / 2 + (w * i) / 5, rim + 2], [x - bw / 2 + (bw * i) / 5, rim + h - 2]], {closed: false, weight: 0.5, color: mixColor(color, INK, 0.45)});
  inkLine(p, seed + 12, [[x - w * 0.5, rim], [x - w * 0.34, y + 0.01 * u], [x, y], [x + w * 0.34, y + 0.01 * u], [x + w * 0.5, rim]], {closed: false, weight: 1.2, color: INK, curve: 0.3});
};

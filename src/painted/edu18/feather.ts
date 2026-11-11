import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {clamp01, ease} from '../kit/space';

// N10 `new: feather + ball` insert (`I`, metres; brief "Set plan - feather insert I"; SH10 +0..+45). A downy white feather 6 cm long hangs turning slowly; a red rubber
// ball 6.5 cm across enters from the left at x(n) = -0.24 + 0.0104 n m (slow motion x20, 0.30 m/s on screen), meets the feather at +23 ("โดน"); the feather folds
// onto the ball's front and travels WITH it at the ball's speed (no deflection, no bounce: D06). Contact x: the ball's front edge reaches the feather's vane at +23
// (x(23) = -0.0008 m, front +0.0317 m), so the feather hangs at x = 0.0317 m (brief says (0, 0, 0): a 3 cm difference at 133 px/6 cm, recorded).
export const FB = {r: 0.0325, len: 0.06, x0: -0.24, v: 0.0104, hit: 23, ball: '#c9362f', ballDk: '#7e1f1c', feather: '#f6f4ee'};
export const ballX = (L: number) => FB.x0 + FB.v * L;
export const FEATHER_X = ballX(FB.hit) + FB.r;
/** Feather fold 0..1 (0 free, 1 pressed onto the ball's front) over 8 f after the hit. */
export const featherFold = (L: number) => ease(clamp01((L - FB.hit) / 8));
/** Feather centre x (m): hangs at FEATHER_X until the hit, then rides the ball's front (the ball's speed). */
export const featherX = (L: number) => (L <= FB.hit ? FEATHER_X : ballX(L) + FB.r - 0.004 * featherFold(L));
export const paintFeatherBall = (p: Painter, c: YCam, L: number, tAmb: number) => {
  const at = (x: number, y = 0): Pt | null => camPoint(c, [x, y, 0]);
  const u = camUnit(c, [0, 0, 0]);
  // ball
  const bg = at(ballX(L));
  if (bg) {
    const r = FB.r * u;
    solid(p, 55000, FB.ball, ell(bg[0], bg[1], r, r, 28), 4);
    washAt(p, 55001, FB.ballDk, 150, ell(bg[0] + r * 0.18, bg[1] + r * 0.22, r * 0.78, r * 0.7, 24), 0.1, 0);
    washAt(p, 55002, '#ffd9cf', 190, ell(bg[0] - r * 0.36, bg[1] - r * 0.4, r * 0.2, r * 0.13, 12, -0.7), 0, 0);
    inkLine(p, 55003, ell(bg[0], bg[1], r, r, 28), {weight: 1.1, color: '#4a1613', curve: 0.1});
  }
  // feather: shaft (slightly curved), vane as two lobes with barb strokes; turns slowly on the ambient clock (vane width cos of the turn)
  const fx = featherX(L), fold = featherFold(L), turn = Math.cos(tAmb * 1.1), sway = 0.06 * Math.sin(tAmb * 1.7) * (1 - fold);
  const top = at(fx - 0.003, FB.len / 2), bot = at(fx + 0.004 * (1 - fold), -FB.len / 2 * (1 - 0.35 * fold));
  if (top && bot) {
    const mid: Pt = [(top[0] + bot[0]) / 2 + sway * u * 0.01 + fold * 0.012 * u, (top[1] + bot[1]) / 2], len = Math.hypot(bot[0] - top[0], bot[1] - top[1]);
    const wv = Math.max(0.25, Math.abs(turn)) * 0.012 * u * (1 - 0.2 * fold), shaft: Pt[] = [top, mid, bot];
    const lobe = (side: 1 | -1): Pt[] => [top, ...[0.25, 0.5, 0.75].map((k, i): Pt => [top[0] + (bot[0] - top[0]) * k + side * wv * Math.sin(Math.PI * (0.15 + 0.7 * k)) * (i === 1 ? 1.15 : 1) + (mid[0] - (top[0] + bot[0]) / 2) * Math.sin(Math.PI * k), top[1] + (bot[1] - top[1]) * k]), bot];
    [1, -1].forEach((s, i) => { const P = lobe(s as 1 | -1); solid(p, 55100 + i * 5, mixColor(FB.feather, '#c9d2d8', i * 0.25), P, 3); inkLine(p, 55101 + i * 5, P, {weight: 0.7, color: '#9aa5ad', curve: 0.3}); });
    inkLine(p, 55120, shaft, {weight: 1.2, color: '#cfd6da', closed: false, curve: 0.4});
    for (let k = 1; k < 8; k++) { const q: Pt = [top[0] + (bot[0] - top[0]) * (k / 8), top[1] + (bot[1] - top[1]) * (k / 8)]; [1, -1].forEach((s, i) => inkLine(p, 55130 + k * 2 + i, [q, [q[0] + s * wv * 0.9, q[1] + len * 0.07]], {weight: 0.5, color: '#aeb8bf', closed: false, curve: 0.2})); }
  }
};

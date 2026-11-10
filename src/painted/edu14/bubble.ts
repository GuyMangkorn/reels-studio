// N11 `new: thought bubble` (B04-SH01/SH02): a painted bubble, three dotted circles rising from her head to a soft outline, with the ball-sized drop wobbling inside.
// The wobble is three damped wobbles (a squash and a bob) from +72 to +107 of the shot; the drop is `drop.ts` (a sphere squashing toward the bun).
import {ell, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {paintDrop14, REFRACT_REAL} from './drop';
import {lin} from './clock';

export const WOBBLE = {from: 72, to: 107, count: 3};
/** Squash 0..1 and bob (px) of the wobbling drop at shot frame L (0 before the start): three damped wobbles. */
export const wobble = (L: number) => {
  const k = lin(WOBBLE.from, WOBBLE.to, L), damp = Math.exp(-3 * k);
  return {squash: L < WOBBLE.from ? 0 : 0.5 + 0.5 * Math.sin(k * WOBBLE.count * 2 * Math.PI) * damp, bob: L < WOBBLE.from ? 0 : -10 * Math.cos(k * WOBBLE.count * 2 * Math.PI) * damp};
};

/** The bubble: `from` = the top of her head (px), `at` = the bubble centre, `r` its radius; `pop` 0..1 grows the dots then the outline. */
export const paintBubble = (p: Painter, o: {from: Pt; at: Pt; r: number; pop: number; L: number; dropPx: number}) => {
  const {from, at, r, pop} = o;
  if (pop <= 0) return;
  const dots: [number, number][] = [[0.12, 0.2], [0.3, 0.34], [0.55, 0.52]];
  dots.forEach(([k, rr], i) => {
    const a = Math.max(0, Math.min(1, pop * 3 - i)), x = from[0] + (at[0] - from[0]) * k, y = from[1] + (at[1] + r * 0.9 - from[1]) * k, rad = 8 + 13 * rr * 2;
    if (a <= 0) return;
    washAt(p, 37000 + i * 4, '#f6f8f8', 215 * a, ell(x, y, rad, rad, 14), 0, 0);
    inkLine(p, 37001 + i * 4, ell(x, y, rad, rad, 14), {weight: 1.3, color: '#2b211c', curve: 0.1, still: true});
  });
  const ob = Math.max(0, Math.min(1, pop * 2.2 - 1));
  if (ob <= 0) return;
  // soft cloud outline: scalloped ellipse
  const pts: Pt[] = Array.from({length: 40}, (_, i): Pt => { const a = (i / 40) * Math.PI * 2, sc = 1 + 0.07 * Math.sin(a * 7); return [at[0] + r * 1.15 * sc * Math.cos(a), at[1] + r * sc * Math.sin(a)]; });
  washAt(p, 37020, '#f6f8f8', 120 * ob, pts, 0.2, 0.2);
  inkLine(p, 37021, pts, {weight: 1.8, color: '#2b211c', curve: 0.2, still: true});
  const w = wobble(o.L), u = o.dropPx / 5;
  paintDrop14(p, [at[0], at[1] + w.bob], u, w.squash > 0.02 ? {kind: 'bun', size: 5, flat: 0.18 * w.squash} : {kind: 'sphere', size: 5}, {refract: REFRACT_REAL, seed: 37100});
};

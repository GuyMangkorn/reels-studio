import {hardFill, washAt, ell} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {BUN_SM} from './macro';
import {SH14, sh14TickAtFace} from './clock';

// N11 `new: ruler` (brief N11 + "Ruler (B04-SH01)"): a slim cream bar `#f4ecd8` (flat underlayer first: DF-20261030-painted-straight-bars) fixed in `M` at x +2.0,
// z 0, from y 0 down to -32.4 sm with 20 tick marks every 1.62 sm (one body length) and a tiny her-silhouette icon at the first unit; the 20th tick brighter
// `#ffd34a`; the bar ENDS at tick 20 (nothing below it). In `Dl` of D1 (SH14) the drop falls past it: tick n is at the drop's bottom face at SH14-local
// event frame +round(5.4 (n - 8)) (0.30 sm per frame / 1.62 sm per tick). OT03 is anchored to the 20th mark (labels.tsx) with a 1 px leader.
export const RULER = {x: 2.0, z: 0, unit: 1.62, ticks: 20, bar: '#f4ecd8', tick: '#6b5d45', hot: '#ffd34a', halfW: 0.09, tickLen: 0.34, tickH: 0.07};
/** Dl y of tick `n` at SH14 event frame `ev` (the face is at the bun's bottom): ticks stream UP past the face (n < the one at the face are above it). */
export const tickY = (n: number, ev: number, faceY = BUN_SM.bottom) => faceY + RULER.unit * (sh14TickAtFace(ev) - n);

/** Paints the ruler through the camera in `Dl` coordinates (origin at D1's centre) at SH14 event frame `ev`; `glow` 0..1 pulses tick 20 (overlay clock). Returns tick 20's pixel point. */
export const paintRuler = (p: Painter, c: YCam, o: {ev: number; glow?: number; faceY?: number; z?: number}): {tick20: Pt | null; tick20Right: Pt | null} => {
  const z = o.z ?? RULER.z, X = RULER.x, hw = RULER.halfW, ev = o.ev, last = tickY(RULER.ticks, ev, o.faceY), first = tickY(0, ev, o.faceY);
  const q = (x: number, y: number): Pt | null => camPoint(c, [x, y, z], 0.3);
  const poly = (pts: [number, number][]): Pt[] | null => { const r = camPoly(c, pts.map(([x, y]) => [x, y, z] as V3), 0.3); return r.length >= 3 ? r : null; }; // clipped at the near plane: the bar is continuous through every tick in frame (F-B14)
  const bar = poly([[X - hw, first], [X + hw, first], [X + hw, last], [X - hw, last]]);
  if (bar) { hardFill(p, 53000, '#e6dcc2', bar); hardFill(p, 53001, RULER.bar, bar.map(([x, y], i) => [x + (i === 0 || i === 3 ? 1.5 : -1.5), y] as Pt)); }
  for (let n = 0; n <= RULER.ticks; n++) {
    const y = tickY(n, ev, o.faceY), hot = n === RULER.ticks, len = hot ? RULER.tickLen * 1.1 : n % 5 === 0 ? RULER.tickLen * 1.2 : RULER.tickLen;
    const t = poly([[X - hw - len * 0.2, y + RULER.tickH / 2], [X + hw + len * 0.8, y + RULER.tickH / 2], [X + hw + len * 0.8, y - RULER.tickH / 2], [X - hw - len * 0.2, y - RULER.tickH / 2]]);
    if (t) hardFill(p, 53100 + n, hot ? RULER.hot : RULER.tick, t);
  }
  // her silhouette at the first unit (a tiny standing figure beside tick 1)
  const ic = q(X - hw - 0.18, tickY(1, ev, o.faceY) + 0.2), u = ic ? camUnit(c, [X, tickY(1, ev, o.faceY), z]) : 0;
  if (ic && u > 0) {
    const h = RULER.unit * u * 0.9;
    washAt(p, 53200, '#4a3a52', 235, [[ic[0] - 0.05 * h, ic[1] + h * 0.1], [ic[0] + 0.05 * h, ic[1] + h * 0.1], [ic[0] + 0.07 * h, ic[1] + h * 0.55], [ic[0] - 0.07 * h, ic[1] + h * 0.55]], 0, 0);
    washAt(p, 53201, '#1f1816', 240, ell(ic[0], ic[1], 0.07 * h, 0.07 * h, 12), 0, 0);
  }
  const t20 = q(X, last), t20r = q(X + hw + RULER.tickLen * 0.8 * 1.5, last);
  if (t20 && (o.glow ?? 0) > 0) washAt(p, 53300, RULER.hot, 190 * (o.glow ?? 0) * 0.6, ell(t20[0] + 18, t20[1], 70 * (0.7 + 0.3 * (o.glow ?? 0)), 26, 20), 0.35, 0.1);
  return {tick20: t20, tick20Right: t20r};
};
export const RULER_STOPS_AT = SH14.lastTick;
void mixColor;
export type {V3};

import {inkLine, washAt} from '../kit/draw';
import {mixColor} from '../kit/painter';
import {paintHalo} from '../kit/fog';
import type {Painter, Pt} from './core';

// ENV-SKY ripple (N16-08, S-WORM, VD-S01): the night sky wobbles like water above the empty paddy, then blooms to white. Screen-space layer in picture px;
// `t` seconds, `speed` the ring speed (look stills 1.6), `glow` 0..1 the bloom (0 = quiet rings, 1 = white). Shot 1 of each episode drives `speed` and `glow`.

/** S-WORM sky ripple (N16-08, proposed ENV-SKY extension): concentric rings like water, centred at (cx, cy) px; `speed` and `glow` rise toward the bloom. */
export const paintSkyRipple = (p: Painter, o: {cx: number; cy: number; t: number; speed: number; glow: number; seed?: number}) => {
  const id = o.seed ?? 9100, N = 7, gap = 95, phase = (o.t * o.speed * 60) % gap;
  for (let i = N - 1; i >= 0; i--) {
    const r = i * gap + phase, k = 1 - r / (N * gap);
    if (r < 8) continue;
    const ring = (rr: number) => Array.from({length: 48}, (_, j): Pt => {
      const a = (j / 48) * Math.PI * 2, wob = 1 + 0.025 * Math.sin(a * 5 + o.t * 2 + i);
      return [o.cx + rr * wob * Math.cos(a), o.cy + rr * 0.62 * wob * Math.sin(a)];
    });
    const w = 10 + 10 * k;
    const outer = ring(r + w), inner = ring(r - w).reverse();
    washAt(p, id + i * 3, mixColor('#7fa2ff', '#e6dcff', o.glow * k), (50 + 90 * o.glow) * k, [...outer, outer[0], inner[inner.length - 1], ...inner], 0.15, 0.2);
    inkLine(p, id + i * 3 + 1, ring(r + w * 0.4), {weight: 0.6 + 0.6 * k, color: mixColor('#a9c0ff', '#ffffff', o.glow * k), still: true, curve: 0.3});
  }
  paintHalo(p, {x: o.cx, y: o.cy, r: 120 + 120 * o.glow, color: mixColor('#9fb6ff', '#ffffff', o.glow), level: 0.5 + 0.5 * o.glow, squash: 0.62, seed: id + 60});
};

import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {camPoint, camUnit} from '../kit/ycam';
import {cell, type Painter, type Pt, type V3, type YCam} from './core';

// N17-07 roof run-off stream (EP17 sh13): the rain water running off the zinc roof edge in a rope of water to the ground (or into a bucket). Boss, 14 Nov 2026.
// The kit ENV-FALL `rain` stays the rain over the yard; this is the one thing it does not draw. Painted like the fire: stepped 15 fps flicker (the bright
// bands slide down the rope), a crown splash and ring ripples where it lands, a wet dark patch on the ground, drips along the eave. Pure function of `t`.
// Default fall: from the south eave of the house at x -6 (VIL eave y 4.45, z -0.3). Storyboard mark for the bucket is (-6.0, 0, -2.2), which is UNDER the
// house floor, not under the eave: the stream and a bucket placed at `landAt` agree, so move the bucket to the eave line (z about -0.45) or the stream to z -2.2 (open question).

export type Runoff = {
  /** Where the water leaves the roof and where it lands (world metres); `landAt[1]` 0 = ground, a bucket rim y when it fills a bucket. */
  from?: V3; landAt?: V3;
  /** Seconds, and 0..1 how strongly it runs (start-up and tail). */ t: number; flow?: number;
  /** Eave dripping at the sides (default true). */ drips?: boolean; seed?: number;
};
export const RUNOFF = {from: [-6, 4.45, -0.3] as V3, land: [-6, 0, -0.45] as V3};

export const paintRoofRunoff = (p: Painter, c: YCam, o: Runoff) => {
  const from = o.from ?? RUNOFF.from, land = o.landAt ?? [from[0], 0, from[2] - 0.15] as V3, flow = o.flow ?? 1, seed = o.seed ?? 62000;
  if (flow <= 0) return;
  const a = camPoint(c, from), b = camPoint(c, land), step = Math.floor(o.t * 15);
  if (!a || !b) return;
  const u = camUnit(c, from), w0 = (0.045 + 0.03 * flow) * u, N = 14;
  // rope outline: widens a little as it falls and wavers
  const spine: Pt[] = Array.from({length: N + 1}, (_, i) => {
    const s = i / N, sway = 0.012 * u * Math.sin(o.t * 9 + s * 7) * s;
    return [a[0] + (b[0] - a[0]) * s + sway, a[1] + (b[1] - a[1]) * Math.pow(s, 1.0)] as Pt;
  });
  const left: Pt[] = spine.map(([x, y], i) => [x - w0 * (1 + 0.3 * (i / N)), y]), right: Pt[] = spine.map(([x, y], i) => [x + w0 * (1 + 0.3 * (i / N)), y]);
  washAt(p, seed, '#7a9aa8', 120 * flow, [...left, ...right.slice().reverse()], 0.2, 0.1);
  hardFill(p, seed + 1, mixColor('#b8d0d8', '#e8f2f4', 0.4), [...left.map(([x, y]): Pt => [x + w0 * 0.25, y]), ...right.map(([x, y]): Pt => [x - w0 * 0.25, y]).reverse()]);
  // bright bands sliding down the rope
  for (let i = 0; i < 6; i++) {
    const s0 = ((hash(seed + 10 + i) + step * 0.09 * (0.8 + 0.4 * hash(seed + 20 + i))) % 1), s1 = Math.min(1, s0 + 0.07 + 0.05 * hash(seed + 30 + i));
    const i0 = Math.round(s0 * N), i1 = Math.round(s1 * N);
    if (i1 > i0) hardFill(p, seed + 40 + i, '#f8fcfc', [...spine.slice(i0, i1 + 1).map(([x, y]): Pt => [x - w0 * 0.35, y]), ...spine.slice(i0, i1 + 1).map(([x, y]): Pt => [x + w0 * 0.3, y]).reverse()]);
  }
  inkLine(p, seed + 50, left, {closed: false, weight: 0.35, color: '#6a8a98', still: true});
  inkLine(p, seed + 51, right, {closed: false, weight: 0.35, color: '#6a8a98', still: true});
  // landing: wet patch (ground only), ring ripples and a crown of droplets
  const g = b, onGround = land[1] < 0.05, ru = camUnit(c, land);
  if (onGround) washAt(p, seed + 60, '#4a3a2c', 90 * flow, cell({g, u: 1, s: 1}, 0, 2, 0.45 * ru, 0.1 * ru, 14), 0.5, 0.2);
  for (let i = 0; i < 2; i++) {
    const ph = (o.t * 2.2 + i * 0.5) % 1, r = (0.08 + 0.3 * ph) * ru;
    inkLine(p, seed + 61 + i, cell({g, u: 1, s: 1}, 0, 0, r, r * 0.3, 16), {weight: 0.5, color: mixColor('#d8e8ec', '#8ab0bc', ph), still: true, curve: 0.3});
  }
  for (let i = 0; i < 9; i++) {
    const ang = -0.3 - 2.5 * hash(seed + 70 + i + step * 0.03 * 0), sp = 0.1 + 0.14 * hash(seed + 80 + i + step), life = (hash(seed + 90 + i) + step * 0.2) % 1;
    const x = Math.cos(ang) * sp * life * ru * 2.2, y = -Math.sin(ang) * 0 + (Math.sin(Math.PI * life) * 0.2 * sp * 4) * -ru;
    hardFill(p, seed + 100 + i, '#e8f4f6', cell({g: [g[0] + x, g[1] + y], u: 1, s: 1}, 0, 0, 0.012 * ru + 1, 0.012 * ru + 1, 6));
  }
  if (o.drips !== false) {
    for (let i = 0; i < 5; i++) {
      const dx = -1.4 + i * 0.7, s = (hash(seed + 120 + i) + o.t * (0.9 + 0.5 * hash(seed + 130 + i))) % 1, top = camPoint(c, [from[0] + dx, from[1], from[2]]), bot = camPoint(c, [from[0] + dx, 0.25, from[2] - 0.05]);
      if (!top || !bot || i === 2) continue;
      const y = top[1] + (bot[1] - top[1]) * s * s;
      inkLine(p, seed + 140 + i, [[top[0], y], [top[0], y + 14]], {closed: false, weight: 0.9, color: '#cfe0e6', still: true});
    }
  }
};

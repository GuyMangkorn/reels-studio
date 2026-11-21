import {ell, hardFill, inkLine} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

// KIT-P01, EDU-EP32 VD32-19. Male house sparrow, about 0.15 m beak to tail.
// The caller supplies the perch point or flight path and the instantaneous flap and tail pose.
export type SparrowMotion = {fly?: boolean; flap?: number; tail?: number};
/** Paint a perched or flying house sparrow. The beak faces left for dir = 1 and right for dir = -1. */
export const paintSparrow = (p: Painter, c: YCam, at: V3, seed: number, dir: -1 | 1 = -1, shade = 0, m: SparrowMotion = {}) => {
  const g = camPoint(c, at);
  if (!g) return null;
  const u = camUnit(c, at), L = 0.15 * u, P = (x: number, y: number): Pt => [g[0] + dir * x * L, g[1] - y * L];
  const tint = (col: string) => mixColor(col, '#3f5a52', shade);
  // one wing from the shoulder (sparrow-local x back, y up): raised `a` radians above the back line, a rounded brown blade with dark primaries
  const wing = (s: number, k: number, dark: boolean) => {
    const a = (-0.7 + 1.9 * (m.flap ?? 0)) * k, sh: [number, number] = [0.02, 0.42], ca = Math.cos(a), sa = Math.sin(a);
    const W = (x: number, y: number) => P(sh[0] + x * ca - y * sa, sh[1] + x * sa + y * ca);
    hardFill(p, s, tint(dark ? '#5e4430' : '#8a6440'), [W(0, 0.05), W(0.22, 0.09), W(0.46, 0.05), W(0.52, -0.02), W(0.4, -0.07), W(0.12, -0.06), W(0, -0.04)]);
    inkLine(p, s + 1, [W(0.24, 0.02), W(0.5, -0.01)], {color: tint('#2e2218'), weight: 0.7, closed: false, still: true, curve: 0.2});
  };
  if (m.fly) wing(seed + 20, 1.12, true); // far wing, behind the body
  if (!m.fly) {
    inkLine(p, seed, [P(-0.02, 0), P(0.02, 0.12)], {color: '#6a4a36', weight: 0.8, closed: false, still: true, curve: 0});
    inkLine(p, seed + 1, [P(0.1, 0), P(0.08, 0.12)], {color: '#6a4a36', weight: 0.8, closed: false, still: true, curve: 0});
  }
  const tk = 0.16 * (m.tail ?? 0);
  hardFill(p, seed + 2, tint('#5a4632'), [P(0.22, 0.24), P(0.62 - tk * 0.4, 0.42 + tk), P(0.64 - tk * 0.3, 0.36 + tk), P(0.26, 0.17)]); // tail, cocked up
  hardFill(p, seed + 3, tint('#d9d2c2'), ell(...P(0.03, 0.3), 0.3 * L, 0.19 * L, 18, dir * 0.25)); // belly
  hardFill(p, seed + 4, tint('#8a6440'), [P(-0.12, 0.42), P(0.12, 0.47), P(0.34, 0.33), P(0.18, 0.24), P(-0.06, 0.3)]); // back and wing
  for (let k = 0; k < 3; k++) inkLine(p, seed + 5 + k, [P(-0.02 + k * 0.08, 0.42 - k * 0.03), P(0.08 + k * 0.08, 0.33 - k * 0.02)], {color: tint('#2e2218'), weight: 0.7, closed: false, still: true, curve: 0.2});
  hardFill(p, seed + 9, tint('#a87a4c'), [P(0.0, 0.38), P(0.2, 0.36), P(0.16, 0.3), P(0.02, 0.32)]); // wing bar
  const hc = P(-0.2, 0.47);
  hardFill(p, seed + 10, tint('#8a5a3a'), ell(hc[0], hc[1], 0.12 * L, 0.11 * L, 16)); // chestnut nape
  hardFill(p, seed + 11, tint('#7d7f80'), ell(hc[0] - dir * 0.015 * L, hc[1] - 0.04 * L, 0.1 * L, 0.06 * L, 14)); // grey crown
  hardFill(p, seed + 12, tint('#ebe6da'), ell(hc[0] - dir * 0.03 * L, hc[1] + 0.025 * L, 0.07 * L, 0.045 * L, 12)); // white cheek
  hardFill(p, seed + 13, '#1c1a18', [P(-0.24, 0.42), P(-0.12, 0.4), P(-0.14, 0.3), P(-0.22, 0.33)]); // black bib
  hardFill(p, seed + 14, '#2a2622', [P(-0.3, 0.49), P(-0.4, 0.465), P(-0.3, 0.44)]); // beak
  hardFill(p, seed + 15, '#0e0d0c', ell(hc[0] + dir * 0.055 * L, hc[1] - 0.005 * L, 0.018 * L, 0.018 * L, 8)); // eye
  inkLine(p, seed + 16, [P(-0.12, 0.47), P(0.22, 0.44), P(0.33, 0.33), P(0.28, 0.2), P(0.02, 0.15), P(-0.2, 0.25)], {color: '#2a2018', weight: 0.6, closed: false, still: true, curve: 0.4});
  if (m.fly) wing(seed + 22, 1, false); // near wing, over the body
  return {top: g[1] - 0.6 * L, bottom: g[1]};
};

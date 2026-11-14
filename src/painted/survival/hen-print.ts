import {mixColor} from '../kit/painter';
import {wFill, wInk, wp, type Item} from '../kit/world';
import {washAt} from '../kit/draw';
import {ell} from '../kit/draw';
import {camPoint} from '../kit/ycam';
import {lit, type Light, type Painter, type V3, type YCam} from './core';

// N16-03 R3 hen three-toed footprint decal (EDU-EP16 SH22: the foot lands with the river's footfall and the print stays in the dirt; Boss, 14 Nov 2026). A flat decal on the ground plane: three forward toes
// (centre 0.058 m, sides 0.046 m at +-34 deg), a short back toe, claw nicks at the tips, pressed-in dirt (a dark floor, a pale lip on the lit side, crumbs thrown out). `press` 0..1 sinks it in over the landing
// (0 draws nothing but the dust-free ground), `scale` blows it up (1 = a real 0.075 m hen print; 1 is right for the "low lens at hen height" shot, where it measures `henPrintPx` >= 80 px).
export const HEN_PRINT_W = 0.075;
const TOES: {a: number; len: number; w: number}[] = [{a: 0, len: 0.058, w: 0.0075}, {a: 0.6, len: 0.046, w: 0.0065}, {a: -0.6, len: 0.046, w: 0.0065}, {a: Math.PI, len: 0.026, w: 0.006}];
/** A toe as a ground polygon from the ankle point: tapered strip with a claw tip, in world metres. `heading` turns the print about the vertical (0 = toes toward +z, the camera side). */
export const toePoly = (at: V3, heading: number, t: {a: number; len: number; w: number}, k = 1, grow = 1): V3[] => {
  const dir = (a: number): [number, number] => [Math.sin(heading + a), Math.cos(heading + a)], d = dir(t.a), n: [number, number] = [-d[1], d[0]], L = t.len * k * grow, w = t.w * k * grow, y = at[1] + 0.004;
  const P = (s: number, side: number): V3 => [at[0] + d[0] * L * s + n[0] * w * side, y, at[2] + d[1] * L * s + n[1] * w * side];
  return [P(0, 1), P(0.45, 1.05), P(0.9, 0.7), P(1.08, 0), P(0.9, -0.7), P(0.45, -1.05), P(0, -1)];
};
/** Width of the print on screen (px) for the camera `c`: the span of its toe polygons. */
export const henPrintPx = (c: YCam, at: V3, o: {heading?: number; scale?: number} = {}): number => {
  const xs = TOES.flatMap((t) => wp(c, toePoly(at, o.heading ?? 0, t, o.scale ?? 1)).map((q) => q[0]));
  return xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
};
/** Scale that makes the print `minPx` wide on screen in `c` (1 when it is already wide enough): the shot asks for >= 80 px so the three toes read in the low lens (Film R1.5). */
export const henPrintScaleFor = (c: YCam, at: V3, minPx = 80, heading = 0): number => { const w = henPrintPx(c, at, {heading, scale: 1}); return w > 0 ? Math.max(1, minPx / w) : 1; };
export const henPrintItem = (at: V3, press: number, L: Light, o: {heading?: number; scale?: number; /** grow the print so it measures at least this many px in the lens (default none) */ minPx?: number; seed?: number; bias?: number} = {}): Item => ({at, bias: o.bias ?? 3, draw: (p: Painter, c: YCam) => {
  if (press <= 0) return;
  const h = o.heading ?? 0, k = Math.max(o.scale ?? 1, o.minPx ? henPrintScaleFor(c, at, o.minPx, h) : 1), seed = o.seed ?? 48000, s = Math.min(1, press), floor = mixColor(lit(L, '#6a5438'), '#3b2c1c', 0.25 * s), lip = lit(L, '#c8b488');
  const pad = camPoint(c, at);
  if (pad) washAt(p, seed, '#2a1e12', 60 * s, ell(pad[0], pad[1] + 2, 0.05 * k * c.f / Math.max(0.3, Math.hypot(c.x - at[0], c.z - at[2])), 0.02 * k * c.f / Math.max(0.3, Math.hypot(c.x - at[0], c.z - at[2])), 14), 0.3, 0.3);
  TOES.forEach((t, i) => {
    const poly = toePoly(at, h, t, k, 0.85 + 0.15 * s), lipPoly = toePoly([at[0] - 0.003 * k, at[1], at[2] + 0.004 * k], h, t, k, 0.9 + 0.15 * s);
    wFill(p, c, seed + 10 + i * 3, lip, lipPoly);
    wFill(p, c, seed + 11 + i * 3, floor, poly);
    // claw nick: a darker point at the tip
    const tip = poly[3]; wInk(p, c, seed + 12 + i * 3, [poly[2], tip, poly[4]], {closed: false, weight: 0.6, color: '#2a1e12'});
  });
  // ankle heel pad and thrown crumbs
  wFill(p, c, seed + 40, floor, Array.from({length: 10}, (_, j): V3 => [at[0] + 0.011 * k * Math.cos((j / 10) * 6.2832), at[1] + 0.004, at[2] + 0.009 * k * Math.sin((j / 10) * 6.2832) - 0.004 * k]));
  for (let j = 0; j < 7; j++) { const a = j * 0.9 + 0.4, r = (0.045 + 0.02 * ((j * 37) % 5) / 5) * k * s; wFill(p, c, seed + 50 + j, lip, Array.from({length: 5}, (_, m): V3 => [at[0] + Math.cos(a) * r + 0.004 * k * Math.cos(m * 1.256), at[1] + 0.005, at[2] + Math.sin(a) * r + 0.003 * k * Math.sin(m * 1.256)])); }
}});

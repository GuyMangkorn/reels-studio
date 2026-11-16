import {inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {wp} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP19 trail model (brief N2, set plan "Trail line"): pressed grass prints 0.20 x 0.08 m, 0.6 m apart along z 0, alternating z +-0.07,
// toes toward +x (the tree). Started at the W2.4 comp card (15 Nov 2026): sizes, levels and the print painter; per-round lists and the
// world-space layer are W3/W5.

export const PRINT = {len: 0.2, wid: 0.08, pitch: 0.6, zAlt: 0.07} as const;
/** Round-1 glow levels, swing -> tree (VD04): rising, the arrow the dog reads. Round 2 uses the same order capped at 0.20. */
export const ROUND1_LEVELS = [0.08, 0.12, 0.17, 0.23, 0.3];
export const ROUND2_MAX = 0.2;
export const GRASS = {lit: '#86a24c', shade: '#4f6b46'} as const;

/** One pressed print seen from a low camera: `c` the print centre (px), `unit` px/m, `k` vertical squash 0..1. A flattened, slightly darker
 * and yellower oval with bent blades pointing toward the toe (+x screen). Ordinary grass: no glow here (glow.tsx adds it). */
export const paintPrint = (p: Painter, seed: number, c: Pt, unit: number, o: {k?: number; grass?: string} = {}) => {
  const k = o.k ?? 0.35, base = o.grass ?? GRASS.lit, rx = (PRINT.len / 2) * unit, ry = (PRINT.wid / 2) * unit * Math.max(0.25, k);
  const oval = (sx: number, sy: number, ox = 0): Pt[] => Array.from({length: 16}, (_, i): Pt => [c[0] + ox + rx * sx * Math.cos((i / 16) * Math.PI * 2), c[1] + ry * sy * Math.sin((i / 16) * Math.PI * 2)]);
  washAt(p, seed, mixColor(mixColor(base, '#c9b24a', 0.25), '#2b2a1c', 0.22), 150, oval(1, 1), 0.12, 0.3);
  washAt(p, seed + 1, mixColor(base, '#2b2a1c', 0.3), 120, oval(0.42, 0.8, -rx * 0.55), 0.1, 0.2);
  for (let i = 0; i < 5; i++) {
    const y = c[1] - ry * 0.7 + (i / 4) * ry * 1.4, x = c[0] - rx * 0.6 + (i % 2) * rx * 0.2;
    inkLine(p, seed + 10 + i, [[x, y], [x + rx * 0.5, y - ry * 0.1], [x + rx * 0.9, y + ry * 0.05]], {closed: false, weight: 0.5, color: mixColor(base, '#f2e6a8', 0.35), curve: 0.4});
  }
};

// ------------------------------------------------------------------------------------------------ world-space trail (W3, LF02)
/** One print on the field (space F): centre on the ground, `i` index from the swing end (x -5.4) to the tree end (x +5.4). */
export type Print = {i: number; at: V3};
/** The trail line of one round: prints every 0.6 m on z 0 from x -5.4 to +5.4, alternating z +-0.07, toes toward +x (19 prints). */
export const trailPrints = (): Print[] => Array.from({length: 19}, (_, i) => ({i, at: [-5.4 + i * PRINT.pitch, 0, (i % 2 ? -1 : 1) * PRINT.zAlt] as V3}));
/** z of the trail print at `x` (the alternating +-0.07 of `trailPrints`), so a glow sits on its print. */
export const printZ = (x: number) => (Math.round((x + 5.4) / PRINT.pitch) % 2 ? -1 : 1) * PRINT.zAlt;
/** The five prints around M0 the dog reads in round 1 (x -1.2 .. +1.2), with their VD04 levels swing -> tree. */
export const ROUND1_FIVE = [-1.2, -0.6, 0, 0.6, 1.2].map((x, k) => ({x, level: ROUND1_LEVELS[k]}));

/** Glow level of a print at time `t` (s) given when the nose first passed over it (`tOn`, s) and its peak: 6 f ramp in (VD04). */
export const glowRamp = (t: number, tOn: number, peak: number, fps = 30) => (t < tOn ? 0 : peak * Math.min(1, (t - tOn) * fps / 6));

/** Paint the trail prints on the ground (world ellipses 0.20 x 0.08 m, darker yellower pressed grass plus bent blade strokes). */
export const paintTrailW = (p: Painter, c: YCam, prints: Print[], o: {grass?: string; seed?: number} = {}) => {
  const base = o.grass ?? GRASS.lit, s0 = o.seed ?? 9100;
  for (const pr of prints) {
    const [x, , z] = pr.at, sd = s0 + pr.i * 6;
    const oval = wp(c, Array.from({length: 16}, (_, k): V3 => [x + (PRINT.len / 2) * Math.cos((k / 16) * 6.283), 0.004, z + (PRINT.wid / 2) * Math.sin((k / 16) * 6.283)]));
    if (oval.length >= 3) washAt(p, sd, mixColor(mixColor(base, '#c9b24a', 0.25), '#2b2a1c', 0.25), 170, oval, 0.12, 0.3);
    const heel = wp(c, Array.from({length: 12}, (_, k): V3 => [x - 0.055 + 0.035 * Math.cos((k / 12) * 6.283), 0.0045, z + 0.03 * Math.sin((k / 12) * 6.283)]));
    if (heel.length >= 3) washAt(p, sd + 1, mixColor(base, '#2b2a1c', 0.32), 140, heel, 0.1, 0.2);
    const u = camUnit(c, pr.at);
    if (u > 120) for (let k = 0; k < 3; k++) {
      const a = camPoint(c, [x - 0.06 + k * 0.03, 0.005, z - 0.02 + k * 0.02]), b = camPoint(c, [x + 0.04 + k * 0.03, 0.012, z - 0.02 + k * 0.02]);
      if (a && b) inkLine(p, sd + 2 + k, [a, b], {closed: false, weight: 0.5, color: mixColor(base, '#f2e6a8', 0.35), curve: 0.3, still: true});
    }
  }
};

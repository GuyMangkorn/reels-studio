import {blob} from './draw';
import {mixColor, type Painter, type Pt} from './painter';

// ENV-FOG and ENV-GLOW (painted): fog banks, a light cone through fog, and a lamp halo, all as soft watercolour washes on
// the plate. For overlay light above the canvas use kit/glow.tsx (Spot, Shafts); these are for light that must sit
// behind actors painted later on the same plate (worldfog/outside.ts paintBeamFog and paintLampGlowCanvas, generalised).

export type FogBank = {
  /** Centre line y in plate px. */
  y: number;
  /** Bank thickness in px. */
  height: number;
  width: number;
  color: string;
  /** 0..1 opacity scale (default 1). */
  density?: number;
  /** Horizontal px/s the puffs travel (default 12). */
  drift?: number;
  /** Seconds. */
  t: number;
  /** Puffs across the width (default 6). */
  puffs?: number;
  /** Seed id (default 7300). */
  seed?: number;
};

/** Puff centres for time `t`, wrapped across the width: pure, for tests. */
export const fogPuffs = (o: Pick<FogBank, 'y' | 'height' | 'width' | 'drift' | 't' | 'puffs' | 'seed'>): Pt[] => {
  const n = o.puffs ?? 6, gap = (o.width + 600) / n, id = o.seed ?? 7300;
  return Array.from({length: n}, (_, i): Pt => {
    const x = ((i * gap + o.t * (o.drift ?? 12)) % (o.width + 600) + (o.width + 600)) % (o.width + 600) - 300;
    return [x, o.y + o.height * 0.18 * Math.sin(i * 2.1 + id)];
  });
};

/** A low bank of fog: one even veil plus drifting puffs, so it reads as moving air, not a stripe. */
export const paintFogBank = (p: Painter, o: FogBank) => {
  const d = o.density ?? 1, id = o.seed ?? 7300, h = o.height;
  p.wash(o.color, 60 * d, [[-200, o.y - h * 0.35], [o.width + 200, o.y - h * 0.35], [o.width + 200, o.y + h * 0.45], [-200, o.y + h * 0.45]], 0.5, 0.4);
  fogPuffs(o).forEach(([x, y], i) => p.wash(o.color, 70 * d, blob(id + i, x, y, h * 0.9, h * 0.42, o.t), 0.6, 0.4));
};

export type FogCone = {
  /** Light source in plate px. */
  x: number;
  y: number;
  /** Direction in radians (0 = right, PI/2 = down). */
  angle: number;
  length: number;
  /** Half-angle of the cone in radians. */
  spread: number;
  color: string;
  /** 0..1 (a switching torch, a flicker). */
  level: number;
};

const cone = (o: FogCone, k: number): Pt[] => {
  const a0 = o.angle - o.spread * k, a1 = o.angle + o.spread * k, L = o.length * (0.75 + 0.25 * k);
  const arc = Array.from({length: 7}, (_, i): Pt => {
    const a = a0 + ((a1 - a0) * i) / 6;
    return [o.x + L * Math.cos(a), o.y + L * Math.sin(a)];
  });
  return [[o.x, o.y], ...arc];
};

/** A beam through fog: three nested cones, widest and faintest outside, brightest along the axis. */
export const paintFogCone = (p: Painter, o: FogCone) => {
  if (o.level <= 0) return;
  [1, 0.65, 0.35].forEach((k, i) => p.wash(mixColor(o.color, '#ffffff', 0.15 * i), (45 + 20 * i) * o.level, cone(o, k), 0.2, 0.4));
};

export type Halo = {x: number; y: number;
  /** Outer radius in px. */
  r: number;
  color: string;
  /** 0..1 (default 1). */
  level?: number;
  /** Height over width (default 0.75: lamps read wider than tall). */
  squash?: number;
  /** Seconds, for the slow breathing (default 0). */
  t?: number;
  /** Seed id (default 7400). */
  seed?: number;
};

/** A lamp halo painted into the plate: outer veil, inner glow, warm core. */
export const paintHalo = (p: Painter, o: Halo) => {
  const lv = o.level ?? 1, sq = o.squash ?? 0.75, id = o.seed ?? 7400, t = o.t ?? 0;
  if (lv <= 0) return;
  p.wash(o.color, 55 * lv, blob(id, o.x, o.y, o.r, o.r * sq, t), 0.7, 0.4);
  p.wash(o.color, 75 * lv, blob(id + 1, o.x, o.y, o.r * 0.55, o.r * 0.55 * sq, t), 0.5, 0.4);
  p.wash(mixColor(o.color, '#fff6e0', 0.5), 110 * lv, blob(id + 2, o.x, o.y, o.r * 0.22, o.r * 0.22 * sq, t), 0.3, 0.35);
};

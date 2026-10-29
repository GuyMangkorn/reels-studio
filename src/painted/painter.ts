import type {Brush} from './BrushCanvas';

/** A point in composition pixels (top-left origin, 1080x1920 for a Short). */
export type Pt = [number, number];

/** Rotate + scale local points about (cx, cy); `a` in radians. */
export const rot = (cx: number, cy: number, s: number, a: number) => ([x, y]: Pt): Pt => [
  cx + s * (x * Math.cos(a) - y * Math.sin(a)),
  cy + s * (x * Math.sin(a) + y * Math.cos(a)),
];
/** n + 1 samples of f over u in [0, 1]. */
export const range = (n: number, f: (u: number, i: number) => Pt): Pt[] => Array.from({length: n + 1}, (_, i) => f(i / n, i));
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 0 before a, 1 after b, smoothstep between. */
export const ramp = (t: number, a: number, b: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** A closed polygon approximating a circle (small p5.brush circles render as squares). */
export const ring = (cx: number, cy: number, rx: number, ry = rx, n = 14): Pt[] => range(n, (u) => [cx + rx * Math.cos(u * 6.283), cy + ry * Math.sin(u * 6.283)]);

/**
 * Drawing helpers for one painted plate. Every mark is a pure function of the plate's own clock:
 * washes are seeded per call (`still`), ink groups per boil step of the plate frame, so a plate paints the same pixels
 * whether it is shown alone, as the outgoing plate of a dissolve, or as the incoming one at a lower `alpha`.
 */
export type Painter = {
  brush: Brush;
  /** Plate-local seconds (after the shot's clock mapping, e.g. a freeze). */
  t: number;
  /** Plate-local frame that sets the boil step. */
  frame: number;
  /** Opacity multiplier for every wash and ink mark of this plate (in-canvas dissolves, drains). */
  alpha: number;
  /** Watercolour fill (bleed + texture). Seeded by its order inside the current group, so it never boils. */
  wash: (color: string, opacity: number, pts: Pt[], bleed?: number, texture?: number) => void;
  /** Flat underlayer (brush.wash): no bleed or texture, so watercolour gaps above it show colour, not paper. */
  flat: (color: string, pts: Pt[]) => void;
  /** Select an ink brush. The marks that follow redraw every `boilEvery` plate frames (the boil). */
  ink: (id: number, name: string, color: string, weight: number) => void;
  /** Like `ink`, but the marks hold still (a frozen silhouette, a held match frame). */
  inkStill: (id: number, name: string, color: string, weight: number) => void;
  /**
   * Restart wash seeding at `base`. Call before any block whose number of washes can change over time (a bolt, a
   * fish that leaves frame) so the washes after it keep their seeds and do not flicker.
   */
  group: (base: number) => void;
  /**
   * A painter for a sub-layer of this plate at `alpha` x the plate alpha, with its own seed space (an in-shot dissolve
   * between two sets under a fixed lead).
   */
  layer: (alpha: number, seedBase: number) => Painter;
};

const BOIL_PRIME = 7919;
const rgb = (color: string) => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
};
/** Mix two #rrggbb colours (u = 0 gives a). p5.brush ignores the alpha of an rgba() stroke colour, so ink fades by mixing. */
export const mixColor = (a: string, b: string, u: number) => {
  const x = rgb(a), y = rgb(b);
  if (!x || !y) return a;
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * u).toString(16).padStart(2, '0')).join('')}`;
};

/**
 * Build the painter for one plate. `frame` is the plate-local frame used for the boil step; `seedBase` separates
 * plates painted into the same canvas (it must not depend on whether the plate is incoming or outgoing).
 */
export const makePainter = (brush: Brush, {t, frame, alpha = 1, boilEvery = 2, seedBase = 0, fade = '#808080'}: {
  t: number; frame: number; alpha?: number; boilEvery?: number; seedBase?: number;
  /** Colour ink fades toward when `alpha` < 1 (the paper under the plate). */
  fade?: string;
}): Painter => {
  const reseed = (n: number) => {
    brush.seed(n);
    brush.noiseSeed(n);
  };
  const step = Math.floor(frame / boilEvery);
  let washId = 0;
  const setInk = (name: string, color: string, weight: number) => brush.set(name, alpha < 1 ? mixColor(color, fade, 1 - alpha) : color, weight);
  return {
    brush,
    t,
    frame,
    alpha,
    wash: (color, opacity, pts, bleed = 0.25, texture = 0.5) => {
      reseed(seedBase + 1 + ++washId);
      brush.noStroke();
      brush.fill(color, opacity * alpha);
      brush.fillBleed(bleed);
      brush.fillTexture(texture, 0.4);
      brush.polygon(pts);
      brush.noFill();
    },
    flat: (color, pts) => {
      brush.noStroke();
      brush.noFill();
      brush.wash(color, 255 * alpha);
      brush.polygon(pts);
      brush.noWash();
    },
    ink: (id, name, color, weight) => {
      reseed(seedBase + id * BOIL_PRIME + step + 1);
      setInk(name, color, weight);
    },
    inkStill: (id, name, color, weight) => {
      reseed(seedBase + id * BOIL_PRIME + 1);
      setInk(name, color, weight);
    },
    group: (base) => {
      washId = base;
    },
    layer: (a, base) => makePainter(brush, {t, frame, alpha: alpha * a, boilEvery, seedBase: base, fade}),
  };
};

import {blob, ell, hardFill} from './draw';
import {mixColor, type Painter, type Pt} from './painter';

// ENV-SKY: a sky as graded horizontal bands, plus a sun or moon disc. Large areas stay horizontal bands over a flat
// underlayer (bleed grows with polygon size; scripts/oldest-shipwreck/p5-feasibility.md). Colours are arguments: the
// episode owns its palette. Replaces the copies in alvarenga/set.ts (paintSky) and zcpaint/balcony.ts (paintSky).

const PAD = 160;

export type SkyBands = {
  /** Colour at the top of the frame. */
  from: string;
  /** Colour at the horizon. */
  to: string;
  /** Optional middle colour, reached at `viaAt` (0..1 from top to horizon). */
  via?: string;
  viaAt?: number;
  /** Horizon y in plate px; the sky ends here. */
  horizon: number;
  /** Plate width in px. */
  width: number;
  /** Top y (default -PAD, above the frame so a camera push never shows paper). */
  top?: number;
  /** Number of bands (default 8). */
  bands?: number;
  /** 'wash': watercolour bands with soft edges (default). 'flat': hard steps, the poster look of alvarenga and zcpaint. */
  style?: 'wash' | 'flat';
  /** Seed base for 'flat' fills (default 7100). */
  seed?: number;
};

/** The band colours, top first: a pure function, so a test can check the gradient without a canvas. */
export const skyBandColors = (o: Pick<SkyBands, 'from' | 'to' | 'via' | 'viaAt' | 'bands'>): string[] => {
  const n = Math.max(2, o.bands ?? 8), at = o.viaAt ?? 0.55;
  return Array.from({length: n}, (_, i) => {
    const u = i / (n - 1);
    if (!o.via) return mixColor(o.from, o.to, u);
    return u < at ? mixColor(o.from, o.via, u / at) : mixColor(o.via, o.to, (u - at) / (1 - at));
  });
};

const span = (w: number, y0: number, y1: number): Pt[] => [[-PAD, y0], [w + PAD, y0], [w + PAD, y1], [-PAD, y1]];

export const paintSkyBands = (p: Painter, o: SkyBands) => {
  const colors = skyBandColors(o), top = o.top ?? -PAD, step = (o.horizon - top) / colors.length;
  if (o.style === 'flat') {
    colors.forEach((c, i) => hardFill(p, (o.seed ?? 7100) + i, c, span(o.width, top + i * step - 4, o.horizon)));
    return;
  }
  p.flat(colors[Math.floor(colors.length / 2)], span(o.width, top, o.horizon));
  colors.forEach((c, i) => p.wash(c, 220, span(o.width, top + i * step - step * 0.3, Math.min(o.horizon, top + (i + 1) * step + step * 0.3)), 0.04, 0.45));
};

export type SkyDisc = {x: number; y: number; r: number; color: string;
  /** Halo strength 0..1 around the disc (default 0.5; 0 = none). */
  glow?: number;
  /** Halo colour (default: the disc colour). */
  glowColor?: string;
  /** Seconds, for the halo's slow breathing (default 0). */
  t?: number;
  /** Seed id for the halo blobs (default 7200). */
  seed?: number;
};

/** A sun or moon: soft halo washes, then a paper-flat disc. Paint it after the sky, before anything on the horizon. */
export const paintSkyDisc = (p: Painter, o: SkyDisc) => {
  const glow = o.glow ?? 0.5, gc = o.glowColor ?? o.color, id = o.seed ?? 7200;
  if (glow > 0) {
    p.wash(gc, 50 * glow, blob(id, o.x, o.y, o.r * 2.6, o.r * 2.6, o.t ?? 0), 0.6, 0.35);
    p.wash(gc, 90 * glow, blob(id + 1, o.x, o.y, o.r * 1.6, o.r * 1.6, o.t ?? 0), 0.4, 0.35);
  }
  p.flat(o.color, ell(o.x, o.y, o.r, o.r, 28));
};

import type {Brush, PaintContext} from '../BrushCanvas';
import type {Painter, Pt} from '../kit/painter';

// ZCPAINT plate helpers (S-P05): the plate context and figure placement shared by the set, figure and plate modules.
// No import of the spike sheets here, so the production registry does not pull the WORLD FOG sheet code into plates.

/** Ink colour of the decal outlines (same value as the WORLD FOG FaceSheet INK). */
export const INK = '#2b211c';

/** Polygon approximating an ellipse, in whatever space the centre is given. */
export const ell = (cx: number, cy: number, rx: number, ry = rx, n = 16): Pt[] =>
  Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.283), cy + ry * Math.sin((i / n) * 6.283)]);

/**
 * The PaintContext of a plate's Painter. A plate is painted by `drawPlate` (src/painted/plate.ts), which applies the
 * plate camera itself, so this context has no transform. Seeds follow BrushCanvas (`still` per id, `boil` per two-frame
 * step of the plate frame). Plate alpha is not applied: ZC plates are hard cuts, not dissolves.
 */
export const ctxOf = (p: Painter, width = 1080, height = 1920): PaintContext => {
  const {brush} = p;
  const reseed = (n: number) => {
    brush.seed(n);
    brush.noiseSeed(n);
  };
  return {
    brush, t: p.t, frame: p.frame, width, height,
    still: (id) => reseed(id + 1),
    boil: (id) => reseed(id * 7919 + Math.floor(p.frame / 2) + 1),
  };
};

const scaleXY = (brush: Brush, x: number, y: number) => (brush.scale as unknown as (a: number, b: number) => void)(x, y);

/** Draw in a local frame: origin at the ground point (gx, gy), scale `k` (figure px = 447 px per m), mirrored for dir -1. */
export const placeAt = (brush: Brush, gx: number, gy: number, k: number, dir: 1 | -1, draw: () => void) => {
  brush.push();
  brush.translate(gx, gy);
  scaleXY(brush, dir * k, k);
  draw();
  brush.pop();
};

/** Draw one parallax layer about (fx, fy): scale `s` and drop `dy` px (the brief's multiplane push). */
export const layerAt = (brush: Brush, fx: number, fy: number, s: number, dy: number, draw: () => void) => {
  brush.push();
  brush.translate(fx, fy + dy);
  brush.scale(s);
  brush.translate(-fx, -fy);
  draw();
  brush.pop();
};

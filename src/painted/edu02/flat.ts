import type {Brush} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';

// EDU-EP02-SHORT W6 (user, 5 Nov 2026: "the Final flickers; keep the Draft look"): every EDU2 plate paints with the Draft's fills
// at every grade. A textured p5.brush `fill` (bleed + texture, node_modules/p5.brush/src/fill/fill.js `grow`/`layer`) draws its
// marks from the seeded random stream walked along the polygon's projected vertices, so under a moving yaw camera the same seed
// gives a different bleed and texture each frame and the wash boils at 30 fps (W6 diag, out/edu02/w6/diag: whole-frame sign
// alternation about 1.5-2.7 x the Draft's in moving shots, equal in held crops). The Draft's flat `wash` follows the polygon exactly.
// Episode-local copy of BrushCanvas `drafted` (input prop `paintDraft`), so no other episode's picture or scene-cache key changes.

/** The Draft brush: a textured `fill` becomes a flat `wash` of the same colour and opacity; bleed, texture and hatching are dropped. */
export const flatFillBrush = (base: Brush): Brush => {
  // A wash this wrapper turned on (from `fill`) is turned off by `noFill`; a wash the plate asked for is left alone.
  let ownWash = false;
  const stack: boolean[] = [];
  const flat: Record<string, (...a: never[]) => unknown> = {
    fill: (...a) => { ownWash = true; return (base.wash as (...x: unknown[]) => void)(...a); },
    noFill: () => { if (ownWash) base.noWash(); ownWash = false; return base.noFill(); },
    wash: (...a) => { ownWash = false; return (base.wash as (...x: unknown[]) => void)(...a); },
    noWash: () => { ownWash = false; return base.noWash(); },
    fillBleed: () => undefined,
    fillTexture: () => undefined,
    hatch: () => base.noHatch(),
    push: () => { stack.push(ownWash); return base.push(); },
    pop: () => { ownWash = stack.pop() ?? false; return base.pop(); },
  };
  return {...base, ...flat} as Brush;
};

/** The same plate painter (clock, boil step, alpha, ink fade colour) over the Draft brush. */
export const flatPainter = (p: Painter, fade: string): Painter =>
  makePainter(flatFillBrush(p.brush), {t: p.t, frame: p.frame, alpha: p.alpha, fade});

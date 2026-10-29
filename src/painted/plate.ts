import type {Brush} from './BrushCanvas';
import {applyCamera} from './camera';
import {makePainter} from './painter';
import {span} from './sea';
import type {PaintedShot} from './shot';

/**
 * Paint one plate into the current BrushCanvas frame: shot clock remap, plate alpha (dissolve x drain), camera push,
 * world marks, then screen-space marks. `paper` lays the plate's own paper first, at its opacity (a plate over another);
 * faded ink mixes toward `fade` (default: the plate's paper).
 */
export const drawPlate = (brush: Brush, shot: PaintedShot, o: {tl: number; fps: number; width: number; height: number; alpha?: number; paper?: boolean; fade?: string}) => {
  const tl = shot.clock ? shot.clock(o.tl) : o.tl;
  const alpha = (o.alpha ?? 1) * (shot.alpha ? shot.alpha(o.tl) : 1);
  if (alpha <= 0) return;
  const p = makePainter(brush, {t: tl, frame: Math.round(tl * o.fps), alpha, fade: o.fade ?? shot.paper});
  if (o.paper) p.flat(shot.paper, span(o.width, -200, o.height + 200));
  const ctx = {tl, width: o.width, height: o.height};
  brush.push();
  applyCamera(brush, shot.camera(tl));
  shot.paint(p, ctx);
  brush.pop();
  shot.screen?.(p, ctx);
};

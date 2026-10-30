import * as brush from 'p5.brush/standalone';
import {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export type Brush = typeof brush;

/** Everything a painted frame may depend on. Drawing must be a pure function of these values. */
export type PaintContext = {
  brush: Brush;
  /** Seconds since the start of the composition. */
  t: number;
  frame: number;
  width: number;
  height: number;
  /** Seed the next marks so they hold still across frames (washes, paper, sets). `id` keeps elements distinct. */
  still: (id: number) => void;
  /** Seed the next marks so they redraw every `boilEvery` frames: the hand-drawn "boiling" ink line. */
  boil: (id: number) => void;
};

// p5.brush keeps one global WebGL runtime, so one canvas is shared by every mount on the page.
let canvas: HTMLCanvasElement | null = null;

/**
 * Renders a p5.brush (standalone build) painting for the current Remotion frame.
 * The canvas is cleared, reseeded and repainted synchronously on every frame, so any frame renders in isolation.
 */
export const BrushCanvas = ({paint, paper = '#efe6d2', boilEvery = 2, brushScale = 5}: {
  paint: (ctx: PaintContext) => void;
  paper?: string;
  boilEvery?: number;
  brushScale?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const host = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!host.current) return;
    if (!canvas) {
      canvas = brush.createCanvas(width, height, {parent: host.current});
      brush.scaleBrushes(brushScale);
    } else if (canvas.parentElement !== host.current) {
      host.current.appendChild(canvas);
    }
  }, [width, height, brushScale]);

  useLayoutEffect(() => {
    const step = Math.floor(frame / boilEvery);
    const reseed = (n: number) => {
      brush.seed(n);
      brush.noiseSeed(n);
    };
    brush.clear(paper);
    brush.push();
    // The standalone runtime puts the origin at the canvas centre; scenes draw in top-left pixel coordinates.
    brush.translate(-width / 2, -height / 2);
    reseed(1);
    paint({brush, t: frame / fps, frame, width, height, still: (id) => reseed(id + 1), boil: (id) => reseed(id * 7919 + step + 1)});
    brush.pop();
    brush.render();
  }, [frame, fps, width, height, paint, paper, boilEvery]);

  return <AbsoluteFill ref={host} />;
};

export {hash} from './kit/hash';

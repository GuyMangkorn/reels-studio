import * as brush from 'p5.brush/standalone';
import {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame, useVideoConfig} from 'remotion';

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

type RenderProps = {paintScale?: number; soundOnly?: boolean; paintProfile?: boolean; paintSeedEager?: boolean};
/** Canvas resolution factor, from the `paintScale` input prop (render.mjs --preview). 1 for every delivery render. */
const paintScale = () => {
  const value = Number((getInputProps() as RenderProps).paintScale ?? 1);
  return value > 0 && value <= 1 ? value : 1;
};
/** The sound-only pass of a scene-cached render (scripts/segments.mjs) needs no picture. */
const soundOnly = () => (getInputProps() as RenderProps).soundOnly === true;

/**
 * The brush handed to `paint`, with deferred seeding. `seed()` refills p5.brush's gaussian pools and `noiseSeed()` rebuilds
 * two simplex tables (about 0.1 ms per pair, 300 ms of a 540 ms ZCPAINT B08 frame), yet a wash-only polygon (`flatKit`,
 * `hardFill`) reads neither. So both are recorded and applied just before the next call that may read the random, noise or
 * seed-hash state; a later seed replaces an unapplied one. Same picture: A/B differences stay within render noise (DF-20261031-paint-seed-defer).
 * `on` mirrors which polygon modes are active (null: unknown) so a polygon counts as wash-only only when that is certain.
 */
const STATE_ONLY = new Set(['noStroke', 'noFill', 'noHatch', 'noMass', 'noWash', 'wash', 'fill', 'fillBleed', 'fillTexture', 'push', 'pop', 'translate', 'scale', 'rotate']);
const MODE_ON: Record<string, string> = {fill: 'fill', set: 'stroke', hatch: 'hatch', mass: 'mass'};
const MODE_OFF: Record<string, string> = {noFill: 'fill', noStroke: 'stroke', noHatch: 'hatch', noMass: 'mass'};
type Modes = Record<string, boolean | null>;
const unknownModes = (): Modes => ({fill: null, stroke: null, hatch: null, mass: null});
const deferredSeeding = () => {
  let seed: number | null = null, noise: number | null = null, on = unknownModes();
  const stack: Modes[] = [];
  const apply = () => {
    if (seed !== null) brush.seed(seed);
    if (noise !== null) brush.noiseSeed(noise);
    seed = noise = null;
  };
  const wrap = {} as Record<string, unknown>;
  for (const [name, fn] of Object.entries(brush)) {
    if (typeof fn !== 'function') { wrap[name] = fn; continue; }
    const call = fn as (...a: unknown[]) => unknown;
    wrap[name] =
      name === 'seed' ? (n: number) => { seed = n; } :
      name === 'noiseSeed' ? (n: number) => { noise = n; } :
      (...args: unknown[]) => {
        const washOnly = name === 'polygon' && Object.values(on).every((v) => v === false);
        if (!STATE_ONLY.has(name) && !washOnly) apply();
        if (name === 'push') stack.push({...on});
        else if (name === 'pop') on = stack.pop() ?? unknownModes();
        else if (MODE_ON[name]) on[MODE_ON[name]] = true;
        else if (MODE_OFF[name]) on[MODE_OFF[name]] = false;
        else if (!STATE_ONLY.has(name) && !['polygon', 'line', 'spline', 'rect', 'hatchStyle', 'render', 'clear'].includes(name)) on = unknownModes();
        return call(...args);
      };
  }
  return {
    brush: wrap as Brush,
    /** Frame start: polygon modes off (as every flatKit fill sets them), mirror known, nothing pending. */
    begin: () => { stack.length = 0; seed = noise = null; for (const k of ['noFill', 'noStroke', 'noHatch', 'noMass'] as const) (wrap[k] as () => void)(); },
    end: apply,
    /** Active polygon modes, for the profiler's polygon split ('?' when unknown). */
    modes: () => Object.entries(on).filter(([, v]) => v !== false).map(([k, v]) => (v ? k : `${k}?`)).join('+') || 'wash',
  };
};
let deferred: ReturnType<typeof deferredSeeding> | null = null;

/**
 * Stage timing for scripts/paint-bench.mjs (input prop `paintProfile`). Wraps every brush call to split scene JS (geometry,
 * colours) from time inside p5.brush, splits the frame at top-level push/pop (a plate's layers), and forces GPU completion
 * with a 1-pixel readPixels, so queued GL work is not reported as free. Off for every normal render.
 */
const profiled = (base: Brush, modes?: () => string): {brush: Brush; begin: () => void; end: () => Record<string, unknown>} => {
  const now = () => performance.now();
  let inside = 0, depth = 0, calls = 0;
  const open: [number, number][] = [[0, 0], [0, 0]];
  const byCall: Record<string, number> = {}, counts: Record<string, number> = {}, layers: [number, number][][] = [[], []];
  const wrap = {} as Record<string, unknown>;
  for (const [name, fn] of Object.entries(base)) {
    if (typeof fn !== 'function') { wrap[name] = fn; continue; }
    wrap[name] = (...args: unknown[]) => {
      if (name === 'push' && depth < 2) { open[depth] = [now(), inside]; } if (name === 'push') depth++;
      const mode = name === 'polygon' && modes ? modes() : '';
      const t0 = now();
      try { return (fn as (...a: unknown[]) => unknown)(...args); } finally {
        const dt = now() - t0;
        inside += dt; calls++;
        const key = name === 'polygon' && modes ? `polygon:${mode}` : name;
        byCall[key] = (byCall[key] ?? 0) + dt;
        counts[key] = (counts[key] ?? 0) + 1;
        if (name === 'pop' && --depth < 2) {
          const [t, b] = open[depth], total = now() - t, inBrush = inside - b;
          layers[depth].push([+(total - inBrush).toFixed(1), +inBrush.toFixed(1)]);
        }
      }
    };
  }
  let start = 0;
  const syncGpu = () => {
    const gl = (canvas as HTMLCanvasElement).getContext('webgl2') as WebGL2RenderingContext;
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  };
  return {
    brush: wrap as Brush,
    begin: () => { syncGpu(); inside = 0; depth = 0; calls = 0; layers[0] = []; layers[1] = []; for (const k in byCall) { delete byCall[k]; delete counts[k]; } start = now(); },
    end: () => {
      const paint = now() - start, brushTime = inside;
      const t1 = now();
      brush.render();
      const render = now() - t1;
      const t2 = now();
      syncGpu();
      const gpuWait = now() - t2;
      const top = Object.entries(byCall).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => [k, +v.toFixed(2), counts[k]]);
      return {paint: +paint.toFixed(2), sceneJs: +(paint - brushTime).toFixed(2), brushCalls: +brushTime.toFixed(2), calls, render: +render.toFixed(2), gpuWait: +gpuWait.toFixed(2),
        layers, top};
    },
  };
};
let profiler: ReturnType<typeof profiled> | null = null;

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
  const scale = paintScale();

  useLayoutEffect(() => {
    if (!host.current) return;
    if (!canvas) {
      canvas = brush.createCanvas(Math.round(width * scale), Math.round(height * scale), {parent: host.current});
      brush.scaleBrushes(brushScale);
      // A preview paints a smaller canvas; the browser stretches it back to the composition size.
      Object.assign(canvas.style, {width: '100%', height: '100%'});
    } else if (canvas.parentElement !== host.current) {
      host.current.appendChild(canvas);
    }
  }, [width, height, brushScale, scale]);

  useLayoutEffect(() => {
    if (soundOnly()) return;
    const step = Math.floor(frame / boilEvery);
    // `paintSeedEager` (paint-bench A/B only) hands `paint` the plain brush with eager seeding.
    const props = getInputProps() as RenderProps;
    if (!props.paintSeedEager) deferred ??= deferredSeeding();
    if (props.paintProfile) profiler ??= profiled(deferred?.brush ?? brush, deferred?.modes);
    const b = profiler?.brush ?? deferred?.brush ?? brush;
    const reseed = (n: number) => {
      b.seed(n);
      b.noiseSeed(n);
    };
    brush.clear(paper);
    brush.push();
    // The standalone runtime puts the origin at the canvas centre; scenes draw in top-left pixel coordinates.
    brush.translate(-width * scale / 2, -height * scale / 2);
    if (scale !== 1) brush.scale(scale);
    deferred?.begin();
    profiler?.begin();
    reseed(1);
    paint({brush: b, t: frame / fps, frame, width, height, still: (id) => reseed(id + 1), boil: (id) => reseed(id * 7919 + step + 1)});
    deferred?.end();
    brush.pop();
    if (profiler) console.log(`paint-profile ${JSON.stringify({frame, ...profiler.end()})}`);
    else brush.render();
  }, [frame, fps, width, height, paint, paper, boilEvery, scale]);

  return <AbsoluteFill ref={host} />;
};

export {hash} from './kit/hash';

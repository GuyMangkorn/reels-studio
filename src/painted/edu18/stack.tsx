import {loadFont} from '@remotion/fonts';
import * as brush from 'p5.brush/standalone';
import {useLayoutEffect, useRef, type ReactNode} from 'react';
import {AbsoluteFill, getInputProps, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Brush} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';

// EDU-EP18 painted stack (Film W3 look frames, 16 Nov 2026): the painted picture in two passes with a screen layer between them, so a WebGL
// layer (the three.js hippo, hippo3d.tsx) can sit BEHIND painted foreground (the canoe, the girl). p5.brush keeps one global WebGL runtime
// (BrushCanvas.tsx), so the passes paint on one hidden brush canvas and are copied into 2D canvases: `back` alone, then `back` + `front`
// cut out where it differs from `back` alone (p5.brush's pigment compositor mixes with the backdrop, so a pass cleared transparent paints
// glazes and shadows wrong: measured light fringes, 16 Nov 2026). The fill handling copies BrushCanvas's `drafted` wrapper (fill -> flat wash, no bleed/texture, no hatch),
// so a pass paints exactly as a BrushCanvas plate does. Do not mount BrushCanvas on the same page (one createCanvas per page).
// Status: episode code for stills (looks-index.ts) and, since W5 (Boss, 16 Nov 2026, sheet item B1), the shot adapter: `clock` (the ambient
// clock runs on the composition frame G through holds, sheet "Clocks"), `guides` as a prop (shots pass false), the draft `paintScale` input prop
// (render.mjs --draft paints the passes at half size and the browser stretches them, as BrushCanvas does) and the `soundOnly` pass (no paint).
// Not a shared renderer change.

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

let canvas: HTMLCanvasElement | null = null;
const drafted = (base: Brush, inkName: string | null): Brush => {
  let ownWash = false;
  const stack: boolean[] = [];
  const draft: Record<string, (...a: never[]) => unknown> = {
    fill: (...a) => { ownWash = true; return (base.wash as (...x: unknown[]) => void)(...a); },
    noFill: () => { if (ownWash) base.noWash(); ownWash = false; return base.noFill(); },
    wash: (...a) => { ownWash = false; return (base.wash as (...x: unknown[]) => void)(...a); },
    noWash: () => { ownWash = false; return base.noWash(); },
    fillBleed: () => undefined,
    fillTexture: () => undefined,
    hatch: () => base.noHatch(),
    push: () => { stack.push(ownWash); return base.push(); },
    pop: () => { ownWash = stack.pop() ?? false; return base.pop(); },
    // EDU18-INK-SINGLE: the kit's ink brush (inkLine, hands: 'rotring') paints with the episode ink brush.
    ...(inkName ? {set: (name: string, color: string, weight?: number) => base.set(name === 'rotring' ? inkName : name, color, weight ?? 1)} : {}),
  };
  return {...base, ...draft} as Brush;
};

export type Pass = (p: Painter) => void;
type Props = {back: Pass; front?: Pass; paper: string; mid?: ReactNode; overlay?: ReactNode; grain?: number;
  /** Painter clock in frames (default: this sequence's frame). Shots pass the composition frame G so ambient motion runs through holds and cuts. */
  clock?: number;
  /** Caption-band guides (default: the `guides` input prop, on unless false). Shots pass false. */
  guides?: boolean};
type RenderProps = {guides?: boolean; paintScale?: number; soundOnly?: boolean; edu18Ink?: 'single' | 'hair' | 'double'};
/** Draft paint factor from the `paintScale` input prop (render.mjs --draft: 0.5); 1 for every final and delivery render. */
export const stackScale = () => { const v = Number((getInputProps() as RenderProps).paintScale ?? 1); return v > 0 && v <= 1 ? v : 1; };
/** BrushCanvas's default `brushScale` (PaintedStage mounts it with the default). */
const BRUSHCANVAS_SCALE = 5;
/**
 * EDU18-INK-SINGLE (Boss, 16 Nov 2026, user note "lines look thick, as if drawn several times"): `scaleBrushes` multiplies p5.brush's ONE
 * global brush table. In the timeline PaintedStage mounts a BrushCanvas first (scaleBrushes(5) at its createCanvas), then this stack's
 * createCanvas scaled by 5 again: every brush ran at 25x (rotring weight 0.15 -> 3.75 px dots, scatter 0.05 -> 1.25 px, spacing 0.1 ->
 * 2.5 px), the look of a line traced over several times. Film's look frames (looks-index, no BrushCanvas) ran at 5x. The stack now scales
 * only by what is missing to reach 5k. Input prop `edu18Ink: 'double'` restores the old 25x for A/B stills.
 */
export const inkScaleFactor = (k: number, brushCanvasFirst: boolean) =>
  inkMode() === 'double' || !brushCanvasFirst ? 5 * k : (5 * k) / BRUSHCANVAS_SCALE;
/** `edu18Ink` input prop: 'single' (default) the EP18 ink brush; 'hair' the plain 5x rotring (Film's look frames); 'double' the old 25x. */
const inkMode = () => { const v = (getInputProps() as RenderProps).edu18Ink; return v === 'double' || v === 'hair' ? v : 'single'; };
/**
 * EP18 ink brush (EDU18-INK-SINGLE), registered after the scale so no scaleBrushes touches it; logical px at stroke weight 1, NOT x k in a
 * draft (the draft's brush.scale(k) already shrinks the dots: measured, a x k copy drew half-thickness draft lines, 16 Nov 2026). One continuous line: no grain dropouts (grain 1), dense dots (spacing 0.35 px, ~6 dots per dot width), a small perpendicular
 * scatter (0.3 px) and a pressure swell (0.85-1.3) for the hand wobble, instead of the 25x rotring's 3.75 px dots with 1.25 px
 * scatter at 2.5 px spacing (a beaded double edge).
 */
export const EDU18_INK = {name: 'edu18-ink', weight: 1.9, scatter: 0.3, sharpness: 0.9, grain: 1, opacity: 235, spacing: 0.35, pressure: {curve: [0.35, 0.2], min_max: [1.3, 0.85]}} as const;

/** One picture: back pass, optional screen layer, optional front pass (cut out over the layer), grain, overlay, caption-band guides (off with guides:false). */
export const PaintedStack = ({back, front, paper, mid, overlay, grain = 0.05, clock, guides: guidesProp}: Props) => {
  const seqFrame = useCurrentFrame(), frame = clock ?? seqFrame;
  const {fps, width, height} = useVideoConfig();
  const k = stackScale(), W = Math.round(width * k), H = Math.round(height * k), mute = (getInputProps() as RenderProps).soundOnly === true;
  const host = useRef<HTMLDivElement>(null), a = useRef<HTMLCanvasElement>(null), b = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    if (!host.current || mute) return;
    if (!canvas) {
      const f = inkScaleFactor(k, document.querySelector('canvas#brush-canvas') !== null);
      canvas = brush.createCanvas(W, H, {parent: host.current});
      if (f !== 1) brush.scaleBrushes(f);
      const {name, pressure, ...params} = EDU18_INK;
      (brush as unknown as {add: (n: string, params: object) => void}).add(name, {...params, pressure: {curve: [...pressure.curve], min_max: [...pressure.min_max]}});
    } else if (canvas.parentElement !== host.current) host.current.appendChild(canvas);
    const paintOn = (passes: Pass[], target: HTMLCanvasElement | null) => {
      if (!target || !canvas) return null;
      brush.clear(paper);
      brush.push();
      brush.translate(-W / 2, -H / 2);
      if (k !== 1) brush.scale(k);
      const d = drafted(brush, inkMode() === 'single' ? EDU18_INK.name : null);
      d.seed(1); d.noiseSeed(1);
      const p = makePainter(d, {t: frame / fps, frame, fade: paper});
      passes.forEach((paint) => paint(p));
      brush.pop();
      brush.render();
      const ctx = target.getContext('2d', {willReadFrequently: true});
      if (!ctx) return null;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(canvas, 0, 0, W, H);
      return ctx;
    };
    const ca = paintOn([back], a.current);
    if (!front || !ca) return;
    // The front pass is painted over the back pass (so its glazes and edges mix with real colours, as on one plate), then cut out: a pixel
    // keeps the front only where it differs from the back alone (the back pass is identical in both runs: same calls, same seeds).
    const cb = paintOn([back, front], b.current);
    if (!cb) return;
    const A = ca.getImageData(0, 0, W, H), B = cb.getImageData(0, 0, W, H), da = A.data, db = B.data;
    for (let i = 0; i < db.length; i += 4) {
      const diff = Math.abs(db[i] - da[i]) + Math.abs(db[i + 1] - da[i + 1]) + Math.abs(db[i + 2] - da[i + 2]);
      db[i + 3] = diff >= 9 ? 255 : Math.round((diff / 9) * 255);
    }
    cb.putImageData(B, 0, 0);
  }, [frame, fps, W, H, k, mute, back, front, paper]);
  const guides = guidesProp ?? (getInputProps() as RenderProps).guides !== false;
  const full = {position: 'absolute' as const, left: 0, top: 0, width, height};
  return (
    <AbsoluteFill style={{background: paper}}>
      <div ref={host} style={{...full, visibility: 'hidden'}} />
      <canvas ref={a} width={W} height={H} style={full} />
      {mid}
      <canvas ref={b} width={W} height={H} style={full} />
      <Grain opacity={grain} />
      {overlay}
      {guides && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

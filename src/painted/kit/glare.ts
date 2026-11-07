import {tintPainter, type Painter} from './painter';

// `new: glare-repaint` (EDU-EP06 N4; Boss W5.2, 2026-11-07): the grade state of the stern, pressing stare. The same plate, the same shape, only
// light and value change: a cool key (a hue-preserving tint toward `GLARE.tint`, so skin stays brown and is NOT a colour filter), edges falling
// to cool dark (`GlareVeil` in glow.tsx), and, on the eye plate, a hard-edged brow shadow and one sharp catchlight (`glare` and `catch` options of
// `paintEyeMacro`, kit/eye.ts). Everything is one 0..1 grade `g` that the scene drives on its shot clock, so the plate can start warm, cross
// to the glare and drain back inside one shot (DF-20261029-painted-timeline-dissolve: in-canvas, not a post filter).
//   const g = glareGrade(frame, {start: 12, drainAt: 140});          // starts on or after the cue frame; never before it
//   paintEyeMacro(glarePainter(warm(p), g), cam, {t, u: 0, mist: false, catch: 'warm', lid: 1.3, glare: g});
//   ... <GlareVeil g={g} />
// The same two calls work on any plate (her face close included): `glarePainter` wraps a Painter, so a figure through `paintOwn` takes it too.
export const GLARE = {tint: '#1f2a3f', amount: 0.3, mul: [0.8, 0.82, 0.92] as [number, number, number], rise: 24, drain: 30} as const;

/** The painter at grade `g`: g 0 returns `p` itself, g 1 is the LF04 recipe, in between scales tint strength and darkening together. */
export const glarePainter = (p: Painter, g: number): Painter => {
  const k = Math.max(0, Math.min(1, g));
  if (k <= 0) return p;
  return tintPainter(p, GLARE.tint, GLARE.amount * k, {mul: [1 - (1 - GLARE.mul[0]) * k, 1 - (1 - GLARE.mul[1]) * k, 1 - (1 - GLARE.mul[2]) * k], brush: true});
};

const sm = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
/**
 * The grade at `frame`: 0 up to and including `start`, then an eased rise over `rise` frames (default 24); with `drainAt` it eases back to 0 over
 * `drain` frames (default 30) from that frame. Pure; `start` is the first frame of the cue word (the cross-grade begins on or after it).
 */
export const glareGrade = (frame: number, o: {start: number; rise?: number; drainAt?: number; drain?: number}): number => {
  const up = sm((frame - o.start) / (o.rise ?? GLARE.rise));
  if (o.drainAt === undefined) return up;
  return Math.min(up, 1 - sm((frame - o.drainAt) / (o.drain ?? GLARE.drain)));
};

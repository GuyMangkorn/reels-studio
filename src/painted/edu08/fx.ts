import {ell, hardFill, inkLine} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintGlitterFx} from '../kit/glitter';
import {RING, RING_UNDER, ringGeom} from '../kit/timer-ring';
import {FXC} from './fx-colors';
import {SUIT} from './suit';

// EDU-EP08-SHORT effects and cards (brief N3/N6-N9, VD07/VD08/VD12/VD13/VD18). LOOK-FRAME CODE: glitter at the lips and the exhale
// stream (`new: vac-glitter`), the detached helmet prop (B3), the timer ring (`new: timer-ring`, painted part; its Thai label is a
// Remotion layer), the film-strip card and the flask card. Safety: glitter starts 3 cm in front of the lips, never inside the mouth.

export {FXC};

/**
 * Glitter from an emitter at picture point `o` (already 3 cm in front of the lips), drifting along `dir` (picture, unit) with spread
 * `spread` radians, `n` particles, travel up to `len` px, size `size` px. Look-frame signature kept; the emitter is the kit's
 * `kit/glitter.ts` (snapshot mode here; pass `life` for a flowing emitter).
 */
export const paintGlitter = (p: Painter, seedBase: number, o: Pt, dir: Pt, n: number, len: number, spread: number, size: number, t: number, life?: number) =>
  paintGlitterFx(p, {o, dir, n, len, spread, size, t, life, seed: seedBase});

/** The detached helmet: clear bubble, neck ring, retracted gold visor band, spinning about its own axis (spin deg). */
export const paintHelmetProp = (p: Painter, c: YCam, at: V3, spin: number, seed = 8700) => {
  const q = camPoint(c, at);
  if (!q) return null;
  const R = 0.29 * camUnit(c, at), a = (spin * Math.PI) / 180;
  const circ = ell(q[0], q[1], R, R, 32);
  p.wash('#cfe4ff', 30, circ, 0, 0);
  // neck ring seen as an ellipse at the bottom of the bubble, tipped by the spin
  const rc: Pt = [q[0] + Math.sin(a) * R * 0.75, q[1] + Math.cos(a) * R * 0.75];
  const ring = ell(rc[0], rc[1], R * 0.62, R * 0.2, 24, a * 0.6);
  hardFill(p, seed, SUIT.collar, ell(rc[0], rc[1] + R * 0.04, R * 0.6, R * 0.2, 24, a * 0.6));
  hardFill(p, seed + 1, SUIT.ring, ring);
  hardFill(p, seed + 2, '#1a2233', ell(rc[0], rc[1] - R * 0.02, R * 0.48, R * 0.12, 24, a * 0.6));
  const vb: Pt[] = Array.from({length: 13}, (_, i): Pt => { const an = Math.PI + a + (i / 12) * Math.PI; return [q[0] + Math.cos(an) * R * 0.97, q[1] + Math.sin(an) * R * 0.97]; });
  const vb2: Pt[] = Array.from({length: 13}, (_, i): Pt => { const an = Math.PI + a + ((12 - i) / 12) * Math.PI; return [q[0] + Math.cos(an) * R * 0.8 - Math.sin(a) * R * 0.15, q[1] + Math.sin(an) * R * 0.62 + Math.cos(a) * -R * 0.12]; });
  hardFill(p, seed + 3, SUIT.visor, [...vb, ...vb2]);
  inkLine(p, seed + 4, circ, {weight: 1.1, color: '#5d6b80'});
  const arc = Array.from({length: 9}, (_, i): Pt => { const an = Math.PI * (1.1 + (0.3 * i) / 8); return [q[0] + Math.cos(an) * R * 0.88, q[1] + Math.sin(an) * R * 0.88]; });
  inkLine(p, seed + 5, arc, {weight: 2.2, color: '#ffffff', closed: false, curve: 0.4});
  hardFill(p, seed + 6, '#ffffff', ell(q[0] - R * 0.42, q[1] - R * 0.5, R * 0.08, R * 0.06, 10));
  return {c: q, r: R};
};

/**
 * Timer ring painter for the look frames and any painted plate: draws the kit geometry (`kit/timer-ring.ts`) as flat fills, identical to the
 * approved v3 ring. The screen layer for the timeline is `TimerRing` in `kit/screen.tsx`. No digits.
 */
export {RING};
export const paintTimerRing = (p: Painter, story: number, o: {paused?: boolean; level?: number} = {}) => {
  const id = 8900, g = ringGeom(story, {paused: o.paused});
  for (const q of g.polys.filter((r) => r.id <= RING_UNDER)) hardFill(p, id + q.id, q.fill, q.pts);
  for (const t of g.ticks) inkLine(p, id + t.id, [t.a, t.b], {closed: false, weight: 0.8, color: t.color, still: true});
  for (const q of g.polys.filter((r) => r.id > RING_UNDER)) hardFill(p, id + q.id, q.fill, q.pts);
};

export {paintFilmStrip, paintFlaskCard, paintDropDiagram, paintChestOutline} from './cards';

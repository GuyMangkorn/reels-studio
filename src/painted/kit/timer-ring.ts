import {mixColor, type Pt} from './painter';

// `timer-ring` (screen layer, geometry and clock; kit effects, from EDU-EP08-SHORT N7, Boss pass B). A "how long" ring with no digits:
// progress runs clockwise from 12 o'clock, the full ring is `full` story seconds, an end band (default 10-15 s) is hatched red, the
// ring pauses (greyed, two bars) and stops at a story value before the band, then fades. Pure functions of the story clock, so a cut,
// a seek or a second worker draws the same ring. The painted look (flat polygons over a dark disc) is the approved look-frame ring; the
// React layer `TimerRing` (`screen.tsx`) and the painter `paintTimerRing` (episode) both draw these polygons.

export const RING = {cx: 905, cy: 300, r: 92, w: 16, full: 15, bandFrom: 10, stopAt: 9};
export const RING_COL = {bg: '#0b1020', prog: '#ffd166', band: '#e85d4a', dot: '#fff6e0', pause: '#c9ced6'};

/** Polygons with an id up to this one (disc, track, band) sit under the hatch ticks; the rest (progress, dot, pause bars) over them. */
export const RING_UNDER = 2;
export type RingPoly = {id: number; kind: 'disc' | 'track' | 'band' | 'prog' | 'dot' | 'pause'; fill: string; pts: Pt[]};
export type RingTick = {id: number; a: Pt; b: Pt; color: string};
export type RingGeom = {polys: RingPoly[]; ticks: RingTick[]; deg: number; tip: Pt};

type RingOpts = {paused?: boolean; cx?: number; cy?: number; r?: number; w?: number; full?: number; bandFrom?: number};

/** Annular sector from angle a0 to a1 (deg, 0 = 12 o'clock, clockwise), radii r0..r1, as a polygon. */
export const ringArc = (cx: number, cy: number, a0: number, a1: number, r0: number, r1: number): Pt[] => {
  const n = Math.max(4, Math.ceil(Math.abs(a1 - a0) / 6)), out: Pt[] = [];
  const at = (a: number, r: number): Pt => { const q = ((a - 90) * Math.PI) / 180; return [cx + Math.cos(q) * r, cy + Math.sin(q) * r]; };
  for (let i = 0; i <= n; i++) out.push(at(a0 + ((a1 - a0) * i) / n, r1));
  for (let i = n; i >= 0; i--) out.push(at(a0 + ((a1 - a0) * i) / n, r0));
  return out;
};
const disc = (cx: number, cy: number, r: number, n: number): Pt[] => Array.from({length: n}, (_, i): Pt => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r]);

/** Ring polygons at story value `story` seconds (clamped to 0..full). Paused: every colour at half strength and two bars in the middle. */
export const ringGeom = (story: number, o: RingOpts = {}): RingGeom => {
  const {cx, cy, r, w} = {...RING, ...o}, full = o.full ?? RING.full, bandFrom = o.bandFrom ?? RING.bandFrom, k = o.paused ? 0.5 : 1;
  const bg = RING_COL.bg, a0 = (bandFrom / full) * 360;
  const deg = Math.max(0, Math.min(360, (story / full) * 360));
  const polys: RingPoly[] = [
    {id: 0, kind: 'disc', fill: mixColor(bg, '#000000', 0.2), pts: disc(cx, cy, r + 6, 40)},
    {id: 1, kind: 'track', fill: mixColor(bg, '#ffffff', 0.3 * k), pts: ringArc(cx, cy, 0, 360, r - w, r)},
    {id: 2, kind: 'band', fill: mixColor(bg, RING_COL.band, 0.7 * k), pts: ringArc(cx, cy, a0, 360, r - w, r)},
  ];
  const ticks: RingTick[] = [];
  for (let d = a0 + 4; d < 360; d += 8) {
    const a = ((d - 90) * Math.PI) / 180, b = ((d + 5 - 90) * Math.PI) / 180;
    ticks.push({id: 10 + d, a: [cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w)], b: [cx + Math.cos(b) * r, cy + Math.sin(b) * r], color: mixColor(RING_COL.band, '#5a1a14', 0.5)});
  }
  if (deg > 0.5) polys.push({id: 3, kind: 'prog', fill: mixColor(bg, RING_COL.prog, k), pts: ringArc(cx, cy, 0, deg, r - w - 1, r + 1)});
  const ta = ((deg - 90) * Math.PI) / 180, tip: Pt = [cx + Math.cos(ta) * (r - w / 2), cy + Math.sin(ta) * (r - w / 2)];
  polys.push({id: 4, kind: 'dot', fill: mixColor(bg, RING_COL.dot, k), pts: disc(tip[0], tip[1], w * 0.62, 14)});
  if (o.paused) {
    polys.push({id: 5, kind: 'pause', fill: RING_COL.pause, pts: [[cx - 18, cy - 24], [cx - 6, cy - 24], [cx - 6, cy + 24], [cx - 18, cy + 24]]});
    polys.push({id: 6, kind: 'pause', fill: RING_COL.pause, pts: [[cx + 6, cy - 24], [cx + 18, cy - 24], [cx + 18, cy + 24], [cx + 6, cy + 24]]});
  }
  return {polys, ticks, deg, tip};
};

/** A story-clock segment: shot-local seconds `tl` map linearly from `from` at 0 to `to` at `dur`; before 0 it holds `from`, after `dur` it holds `to`. */
export type RingSeg = {from: number; to: number; dur: number};
export const ringStory = (tl: number, s: RingSeg): number => s.from + (s.to - s.from) * Math.max(0, Math.min(1, tl / s.dur));

/** Layer opacity: fade in over `inFrames` from frame `inAt`, hold, then (if `stopAt` is given) fade out over `outFrames` from frame `stopAt`. */
export const ringOpacity = (frame: number, o: {inAt?: number; inFrames?: number; stopAt?: number; outFrames?: number} = {}): number => {
  const inAt = o.inAt ?? 0, inF = o.inFrames ?? 8, outF = o.outFrames ?? 12;
  const up = Math.max(0, Math.min(1, (frame - inAt) / Math.max(1, inF)));
  const down = o.stopAt === undefined ? 1 : Math.max(0, Math.min(1, 1 - (frame - o.stopAt) / Math.max(1, outF)));
  const e = (x: number) => x * x * (3 - 2 * x);
  return e(up) * e(down);
};

/** One soft tick per whole story second crossed between two story values (for the Editor's tick sound cues). */
export const ringTicks = (from: number, to: number): number[] => {
  const out: number[] = [];
  for (let s = Math.floor(Math.min(from, to)) + 1; s <= Math.max(from, to); s++) out.push(s);
  return out;
};

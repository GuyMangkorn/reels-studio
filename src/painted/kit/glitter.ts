import {ell, hardFill} from './draw';
import {hash} from './hash';
import type {Painter, Pt} from './painter';

// ENV-GLITTER (`vac-glitter`): a point emitter of small four-point sparkles and specks (kit effects layer, from EDU-EP08-SHORT N6, Boss
// pass B). Every mark is a pure function of the emitter and `t`, so it seeks and renders the same in every worker (like `fall.ts`).
// Two modes: a steady-state *snapshot* (`life` omitted: the distribution the look frames approved, particles hold still but twinkle) and
// a *flow* (`life` seconds: each of the `n` slots cycles birth -> end of its travel -> rebirth with a fresh angle, size and tint, fading
// in and out so a respawn never pops). A `stream` is the same emitter with a long `len`, a narrow `spread` and many slots.
// Safety rule of the host episode: the emitter sits 3 cm in front of the lips, never inside the mouth (`glitterAtLips`).

export const GLITTER_COL = {glit: '#e8f4ff', warm: '#fff3c4'};

export type GlitterOpts = {
  /** Emitter point (picture px), already clear of the source (see `glitterAtLips`). */
  o: Pt;
  /** Drift direction (picture, unit). */
  dir: Pt;
  /** Slots: with `life`, the live particle count is n (rate = n / life per second). */
  n: number;
  /** Travel of the oldest particle, px. */
  len: number;
  /** Cone width, radians (tighter at the start of the travel). */
  spread: number;
  /** Largest particle size, px (a speck radius; sparkles draw 1.9x). */
  size: number;
  /** Seconds. */
  t: number;
  /** Seconds a particle lives. Omit for the still snapshot. */
  life?: number;
  /** Seed base. */
  seed?: number;
  /** Twinkle rate in rad/s (default 9). */
  twinkle?: number;
  /** Flow only: emit only between these shot seconds (a breath that starts and stops). A particle is shown if it was born inside the window;
   * `[from, Infinity]` starts a stream, `[-Infinity, to]` stops one. Absent = a stream running all the time. */
  emit?: [number, number];
};

export type GlitterMark = {slot: number; x: number; y: number; r: number; star: boolean; warm: boolean; phase: number};

const smooth = (x: number) => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };

/** The marks at `t`, back to front by slot. Marks whose twinkled size falls under 0.8 px are dropped (as the look frames did). */
export const glitterMarks = (g: GlitterOpts): GlitterMark[] => {
  const seed = g.seed ?? 8600, a0 = Math.atan2(g.dir[1], g.dir[0]), tw = g.twinkle ?? 9;
  const out: GlitterMark[] = [];
  for (let i = 0; i < g.n; i++) {
    // phase: the share of the travel done. Snapshot: fixed per slot. Flow: advances with t, wraps, and re-rolls the angle/size per cycle.
    const base = hash(seed + i * 1.37);
    const raw = g.life ? base + g.t / g.life : base;
    const cycle = g.life ? Math.floor(raw) : 0, h1 = raw - cycle;
    const k = seed + cycle * 17.31;
    if (g.life && g.emit) { const born = g.t - h1 * g.life; if (born < g.emit[0] || born > g.emit[1]) continue; }
    const h2 = hash(k + i * 2.71), h3 = hash(k + i * 4.13);
    const d = Math.pow(h1, 0.8) * g.len, a = a0 + (h2 - 0.5) * g.spread * (0.4 + 0.6 * h1);
    const x = g.o[0] + Math.cos(a) * d + Math.sin(i + g.t * 3) * 2, y = g.o[1] + Math.sin(a) * d;
    const wink = 0.55 + 0.45 * Math.sin(g.t * tw + i * 2.3);
    // flow only: ease the size in over the first 8 % of the travel and out over the last 18 %
    const env = g.life ? smooth(h1 / 0.08) * smooth((1 - h1) / 0.18) : 1;
    const r = g.size * (0.5 + 0.8 * h3) * (1 - 0.55 * h1) * wink * env;
    if (r < 0.8) continue;
    out.push({slot: i, x, y, r, star: h3 > 0.72, warm: i % 8 === 0, phase: h1});
  }
  return out;
};

/** A four-point sparkle (diamond with a cross), radius r px. */
const sparkle = (p: Painter, seed: number, x: number, y: number, r: number, col: string) => {
  hardFill(p, seed, col, [[x, y - r], [x + r * 0.32, y], [x, y + r], [x - r * 0.32, y]]);
  hardFill(p, seed + 1, col, [[x - r, y], [x, y - r * 0.32], [x + r, y], [x, y + r * 0.32]]);
};

/** Paint the emitter (call after the figure, before screen overlays). */
export const paintGlitterFx = (p: Painter, g: GlitterOpts) => {
  const seed = g.seed ?? 8600;
  // seeded by slot, not list position: a slot that drops out for a frame does not reseed the others
  glitterMarks(g).forEach((m) => {
    const j = m.slot;
    const col = m.warm ? GLITTER_COL.warm : GLITTER_COL.glit;
    if (m.star) sparkle(p, seed + 100 + j * 3, m.x, m.y, m.r * 1.9, col);
    else hardFill(p, seed + 100 + j * 3, col, ell(m.x, m.y, m.r * 0.6, m.r * 0.6, 6));
  });
};

/** The emitter point for a mouth: 3 cm of body-scale (`u` px per m) in front of the lips along `dir`'s horizontal side. */
export const glitterAtLips = (lips: Pt, u: number, side: 1 | -1 = 1, clearM = 0.03): Pt => [lips[0] + side * clearM * u, lips[1]];

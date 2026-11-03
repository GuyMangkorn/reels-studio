import {hash} from './hash';
import {ring, type Painter} from './painter';

// ENV-FALL: one layer for everything that drifts through the air or water (snow, rain, dust, ash, bubbles). Each mark is
// a short streak along its own velocity, placed by hash and wrapped around the frame, so the layer is a pure function of
// `t` and never runs dry. Marks inside the caption band are thinned to `captionKeep` so captions stay readable
// (docs/production-requirements.md#vertical-caption-safe-zone). Replaces bloop/sets.ts paintSnow and sea.ts
// paintRain / paintParticles for new episodes.

export type FallKind = 'snow' | 'rain' | 'dust' | 'ash' | 'bubbles';

export type FallStyle = {
  count: number;
  color: string;
  /** Pen weight. */
  weight: number;
  /** Vertical speed range in px/s (negative rises). */
  fall: [number, number];
  /** Horizontal speed range in px/s, before `wind`. */
  drift: [number, number];
  /** Side-to-side sway amplitude in px and its rate in rad/s. */
  sway: [number, number];
  /** Streak length range in px (a ring's diameter). */
  len: [number, number];
  /** 'streak' along the velocity (default) or a small 'ring' (bubbles). */
  shape?: 'streak' | 'ring';
};

export const FALL: Record<FallKind, FallStyle> = {
  snow: {count: 120, color: '#e4ebf0', weight: 2, fall: [70, 150], drift: [-10, 10], sway: [18, 1.1], len: [6, 11]},
  rain: {count: 170, color: '#b4c2cc', weight: 1, fall: [1900, 2600], drift: [-480, -380], sway: [0, 0], len: [70, 95]},
  dust: {count: 80, color: '#d8c9a8', weight: 1.4, fall: [-6, 10], drift: [-8, 12], sway: [10, 0.4], len: [4, 7]},
  ash: {count: 90, color: '#c8c0b6', weight: 1.6, fall: [25, 60], drift: [-15, 15], sway: [26, 0.7], len: [6, 11]},
  bubbles: {count: 45, color: '#d8ece6', weight: 1.4, fall: [-150, -70], drift: [-4, 4], sway: [8, 2.2], len: [8, 18], shape: 'ring'},
};

export type FallOptions = {
  width: number;
  height: number;
  /** Seconds. */
  t: number;
  /** Overrides the kind's defaults (count, colour, speeds). */
  style?: Partial<FallStyle>;
  /** Extra horizontal px/s added to every mark (a gust, a moving camera). */
  wind?: number;
  /** Seed base so two layers of the same kind do not match (default 0). */
  seed?: number;
  /** Caption band rows [y0, y1] (default [860, 1248]); null turns thinning off. */
  captionBand?: [number, number] | null;
  /** Share of marks kept inside the caption band (default 1/3). */
  captionKeep?: number;
};

export type FallMark = {x: number; y: number; x2: number; y2: number};

const MARGIN = 120;
const pick = ([a, b]: [number, number], u: number) => a + (b - a) * u;

/** Streak end points for frame time `t`: pure, so tests can check wrapping, looping and caption thinning. */
export const fallMarks = (kind: FallKind, o: FallOptions): FallMark[] => {
  const s = {...FALL[kind], ...o.style}, base = 9000 + (o.seed ?? 0) * 100 + Object.keys(FALL).indexOf(kind) * 10;
  const band = o.captionBand === undefined ? [860, 1248] : o.captionBand, keep = o.captionKeep ?? 1 / 3;
  const w = o.width + 2 * MARGIN, h = o.height + 2 * MARGIN, marks: FallMark[] = [];
  for (let i = 0; i < s.count; i++) {
    const r = (k: number) => hash(base + i * 7.13 + k);
    const vy = pick(s.fall, r(1)), vx = pick(s.drift, r(2)) + (o.wind ?? 0);
    const sway = s.sway[0] * Math.sin(o.t * s.sway[1] + r(3) * 6.283);
    const y = (((r(4) * h + o.t * vy) % h) + h) % h - MARGIN;
    const x = (((r(5) * w + o.t * vx) % w) + w) % w - MARGIN + sway;
    if (band && y > band[0] && y < band[1] && r(6) >= keep) continue;
    const speed = Math.hypot(vx, vy) || 1, l = pick(s.len, r(7));
    // Slow marks (dust, snow) read as specks with a random tilt; fast ones point along their velocity.
    const [dx, dy] = speed < 40 ? [Math.cos(r(8) * 6.283), Math.sin(r(8) * 6.283)] : [vx / speed, vy / speed];
    marks.push({x, y, x2: x + dx * l, y2: y + dy * l});
  }
  return marks;
};

/** Paint the layer as still ink (marks move, they do not boil). Call it after the set, before screen overlays. */
export const paintFall = (p: Painter, kind: FallKind, o: FallOptions) => {
  const s = {...FALL[kind], ...o.style};
  p.inkStill(9000 + (o.seed ?? 0), 'pen', s.color, s.weight);
  fallMarks(kind, o).forEach((m) => {
    if (s.shape !== 'ring') return p.brush.line(m.x, m.y, m.x2, m.y2);
    p.brush.spline(ring(m.x, m.y, Math.hypot(m.x2 - m.x, m.y2 - m.y) / 2, undefined, 8), 0.5);
  });
};

import {ell, hardFill, inkLine, INK} from '../kit/draw';
import type {FigAnchors} from '../kit/cast';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {SAND, SAND_SHADE, PALM, PALM_DARK, TRUNK, edge, type Tint} from './palette';

// ALV-EP01-SHORT episode set (look-defining assets written by Film, brief VD01-VD03, VD06, VD13; Boss hardens).
// Cut-out look = flat hard-edged cards (`hardFill`, brush.wash underlayer) with a faint offset paper-edge shadow card beneath.
// World px, 1080x1920, side-on plane; `s` is px per metre of the tier (brief: wide 150, medium 300).

export const W = 1080;
const PADX = 160;
const SEED = 9000;

/** A paper card: an offset shadow card, then the card. */
export const card = (p: Painter, t: Tint, seed: number, color: string, pts: Pt[], off: Pt = [5, 7]) => {
  hardFill(p, SEED + seed * 2, edge(t, color), pts.map(([x, y]): Pt => [x + off[0], y + off[1]]));
  hardFill(p, SEED + seed * 2 + 1, color, pts);
};

const mix = (a: string, b: string, u: number) => mixColor(a, b, u);
const strip = (y0: number, y1: number, amp = 0, ph = 0, n = 24): Pt[] => {
  const top: Pt[] = Array.from({length: n + 1}, (_, i): Pt => [-PADX + ((W + 2 * PADX) * i) / n, y0 + amp * Math.sin(i * 1.7 + ph)]);
  return [...top, [W + PADX, y1], [-PADX, y1]];
};

/** Sky: five flat strips stepping from the top colour to the horizon colour. */
export const paintSky = (p: Painter, t: Tint, horizon: number) => {
  const n = 6;
  for (let i = 0; i < n; i++) hardFill(p, SEED + 10 + i, mix(t.sky[0], t.sky[1], i / (n - 1)), [[-PADX, i * horizon / n - 4], [W + PADX, i * horizon / n - 4], [W + PADX, horizon], [-PADX, horizon]]);
};

/** A low sun disc (paper circle) behind the horizon. */
export const paintSun = (p: Painter, t: Tint, cx: number, cy: number, r: number) => {
  card(p, t, 20, t.sun, ell(cx, cy, r, r, 28), [3, 4]);
};

/** Sea bands from the horizon down to `bottom`; tiny-amplitude edges (no swell, brief VD03). */
export const paintSea = (p: Painter, t: Tint, horizon: number, bottom: number) => {
  hardFill(p, SEED + 30, t.farSea, [[-PADX, horizon], [W + PADX, horizon], [W + PADX, horizon + 40], [-PADX, horizon + 40]]);
  const bands = t.sea.length;
  const span = bottom - horizon - 20;
  t.sea.forEach((c, i) => card(p, t, 31 + i, c, strip(horizon + 20 + (span * i) / bands, bottom, 2.2, i * 2.1), [0, -3]));
};

/** Thin pale tick marks on the sea (cut paper glints), still. */
export const paintTicks = (p: Painter, t: Tint, y0: number, y1: number, count: number, color: string) => {
  for (let i = 0; i < count; i++) {
    const h1 = ((i * 7919) % 1000) / 1000, h2 = ((i * 104729) % 1000) / 1000;
    const x = h1 * W, y = y0 + (y1 - y0) * h2, w = 26 + 40 * ((i * 31) % 10) / 10;
    hardFill(p, SEED + 60 + i, color, [[x, y], [x + w, y], [x + w - 4, y + 4], [x + 4, y + 4]]);
  }
};

// ------------------------------------------------------------------ boat

/** Hull sheer height at x metres from centre (bow at -3, stern at +3). */
const sheer = (x: number) => 0.34 + 0.07 * (x / 3) ** 2 * (x < 0 ? 1.6 : 0.9) + 0.025 * x / 3;

export type BoatBox = {cx: number; wl: number; s: number};
const X = (b: BoatBox, m: number) => b.cx + m * b.s;
const Y = (b: BoatBox, m: number) => b.wl - m * b.s;
const hullTop = (b: BoatBox, lift = 0): Pt[] => Array.from({length: 17}, (_, i): Pt => { const m = -3 + (6 * i) / 16; return [X(b, m), Y(b, sheer(m) + lift)]; });

/** The part of the boat behind the crew: far rim, thwart planks and the outboard. */
export const paintBoatBack = (p: Painter, t: Tint, b: BoatBox, thwarts: number[]) => {
  const rim = hullTop(b, 0.075);
  card(p, t, 100, t.hullIn, [...rim, [X(b, 3.0), Y(b, -0.1)], [X(b, -3.0), Y(b, -0.1)]], [2, 3]);
  // outboard on the transom (stern, right): cowling, shaft into the water
  card(p, t, 101, '#9aa4b0', [[X(b, 3.0), Y(b, 0.82)], [X(b, 3.34), Y(b, 0.80)], [X(b, 3.5), Y(b, 0.56)], [X(b, 3.44), Y(b, 0.34)], [X(b, 3.12), Y(b, 0.34)], [X(b, 3.0), Y(b, 0.5)]], [3, 4]);
  card(p, t, 102, '#7f8a98', [[X(b, 3.18), Y(b, 0.36)], [X(b, 3.36), Y(b, 0.36)], [X(b, 3.34), Y(b, -0.42)], [X(b, 3.2), Y(b, -0.42)]], [3, 3]);
  card(p, t, 103, '#7f8a98', [[X(b, 3.02), Y(b, 0.5)], [X(b, 3.12), Y(b, 0.5)], [X(b, 3.12), Y(b, 0.34)], [X(b, 3.02), Y(b, 0.34)]], [0, 0]);
  for (const [i, m] of thwarts.entries()) card(p, t, 104 + i, mix(t.hullIn, '#8c7a5a', 0.35), [[X(b, m - 0.34), Y(b, 0.2)], [X(b, m + 0.34), Y(b, 0.2)], [X(b, m + 0.34), Y(b, 0.15)], [X(b, m - 0.34), Y(b, 0.15)]], [2, 3]);
};

/** The near hull side, in front of the crew's legs: cream card with the sage stripe. */
export const paintBoatFront = (p: Painter, t: Tint, b: BoatBox) => {
  const top = hullTop(b);
  const bottom: Pt[] = [[X(b, 2.9), Y(b, -0.22)], [X(b, 2.1), Y(b, -0.34)], [X(b, 0), Y(b, -0.4)], [X(b, -2.0), Y(b, -0.34)], [X(b, -2.8), Y(b, -0.1)]];
  card(p, t, 110, t.hull, [...top, [X(b, 3.02), Y(b, 0.05)], ...bottom]);
  // stripe: follows the sheer, 0.1 m below it
  const lo = (m: number) => sheer(m) - 0.2;
  const s1: Pt[] = Array.from({length: 13}, (_, i): Pt => { const m = -2.7 + (5.6 * i) / 12; return [X(b, m), Y(b, lo(m) + 0.09)]; });
  const s2: Pt[] = Array.from({length: 13}, (_, i): Pt => { const m = 2.9 - (5.6 * i) / 12; return [X(b, m), Y(b, lo(m))]; });
  hardFill(p, SEED + 120, t.stripe, [...s1, ...s2]);
  inkLine(p, 121, [...top.slice(0, 17), [X(b, 3.02), Y(b, 0.05)]], {closed: false, weight: 0.55, still: true, color: mix(INK, t.hull, 0.35)});
};

/** Foreground water over the hull's lower edge: a thin sea card with its own paper shadow. */
export const paintWaterFront = (p: Painter, t: Tint, y: number, bottom: number) => {
  card(p, t, 130, mix(t.sea[0], t.sea[1], 0.4), strip(y, bottom, 2.4, 0.7), [0, -4]);
};

// ------------------------------------------------------------------ hat

export type HatState = 'worn' | 'seat' | 'float';
/** Sun hat (brief VD06): a dome and a brim, one saturated colour. `s`: px per metre. Anchored on a head point for `worn`. */
export const paintHat = (p: Painter, t: Tint, at: Pt, s: number, tilt = 0, seed = 140) => {
  const k = s / 150;
  const [x, y] = at;
  const rot = ([dx, dy]: Pt): Pt => [x + (dx * Math.cos(tilt) - dy * Math.sin(tilt)) * k, y + (dx * Math.sin(tilt) + dy * Math.cos(tilt)) * k];
  const dome = Array.from({length: 17}, (_, i): Pt => { const a = Math.PI + (Math.PI * i) / 16; return rot([27 * Math.cos(a), 24 * Math.sin(a)]); });
  const brim = Array.from({length: 24}, (_, i): Pt => { const a = (Math.PI * 2 * i) / 24; return rot([47 * Math.cos(a), 7 * Math.sin(a)]); });
  card(p, t, seed, mix(t.hat, '#ffffff', 0.12), brim, [3, 4]);
  card(p, t, seed + 1, t.hat, dome, [2, 3]);
  hardFill(p, SEED + seed * 3, mix(t.hat, '#8a5a1a', 0.35), [rot([-27, -2]), rot([27, -2]), rot([26, -9]), rot([-26, -9])]);
};

/** The hat sits on a figure's head. */
export const hatOnHead = (p: Painter, t: Tint, a: FigAnchors, s: number, seed = 140) => paintHat(p, t, [a.head[0], a.headTop + 22 * (s / 150)], s, 0, seed);

// ------------------------------------------------------------------ islet and reef (L3, brief VD13)

export const paintPalm = (p: Painter, t: Tint, x: number, base: number, h: number, lean: number, seed: number) => {
  const top: Pt = [x + lean, base - h];
  hardFill(p, SEED + seed, TRUNK, [[x - 5, base], [x + 5, base], [top[0] + 3, top[1]], [top[0] - 3, top[1]]]);
  const fronds = [-1.35, -0.7, -0.1, 0.5, 1.2];
  fronds.forEach((a, i) => {
    const len = h * 0.62, tip: Pt = [top[0] + Math.sin(a) * len, top[1] - Math.cos(a) * len * 0.25 + len * 0.42 * Math.abs(Math.sin(a))];
    const mid: Pt = [top[0] + Math.sin(a) * len * 0.5, top[1] - len * 0.22];
    card(p, t, seed + 1 + i, i % 2 ? PALM : PALM_DARK, [top, [mid[0] - 3, mid[1] - 9], tip, [mid[0] + 3, mid[1] + 5]], [2, 3]);
  });
};

/** Low sand islet on the horizon with palms; `x` centre, `w` width, base y at the horizon. */
export const paintIslet = (p: Painter, t: Tint, x: number, w: number, horizon: number) => {
  card(p, t, 200, SAND, [[x - w / 2, horizon + 6], [x - w * 0.36, horizon - 7], [x - w * 0.1, horizon - 11], [x + w * 0.2, horizon - 9], [x + w / 2, horizon + 6]], [2, 3]);
  card(p, t, 201, SAND_SHADE, [[x - w * 0.5, horizon + 6], [x + w * 0.5, horizon + 6], [x + w * 0.46, horizon + 12], [x - w * 0.46, horizon + 12]], [0, 2]);
  paintPalm(p, t, x - w * 0.18, horizon - 6, 74, -8, 210);
  paintPalm(p, t, x + w * 0.05, horizon - 9, 96, 10, 220);
  paintPalm(p, t, x + w * 0.27, horizon - 8, 62, 12, 230);
};

/** Pale reef shallows: cream-aqua patches with a hard edge on the sea. */
export const paintReef = (p: Painter, t: Tint, patches: {x: number; y: number; w: number; h: number}[]) => {
  patches.forEach((r, i) => card(p, t, 240 + i, '#CFEBDD', ell(r.x, r.y, r.w, r.h, 22), [0, 3]));
  patches.forEach((r, i) => hardFill(p, SEED + 270 + i, '#E8F0D8', ell(r.x - r.w * 0.1, r.y - r.h * 0.12, r.w * 0.66, r.h * 0.6, 22)));
};

/** A faint far coast strip (S02: left horizon). */
export const paintCoast = (p: Painter, t: Tint, x0: number, x1: number, horizon: number) => {
  hardFill(p, SEED + 290, mix(t.farSea, t.sky[0], 0.35), [[x0, horizon + 2], [x0 + 60, horizon - 12], [x0 + 200, horizon - 18], [(x0 + x1) / 2, horizon - 10], [x1, horizon + 2]]);
};

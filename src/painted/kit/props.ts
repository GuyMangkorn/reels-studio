import {bodyFrame, type CastDef, type FigPose} from './cast';
import {INK, inkLine, solid} from './draw';
import {mixColor, type Painter, type Pt} from './painter';

// Furniture the body poses need: a chair for `sit` (poses P31, P32). Sized from the sitter, so a child's chair fits a child:
// the seat surface is 0.05 m under the hip joint `bodyFrame` puts a `sit: 1` figure at. Drawn BEFORE the figure (the figure's
// thighs and torso paint over it). Added 1 Nov 2026 (pose library pass 2).

export type ChairSpec = {
  /** Seat surface height, m above the ground point. */
  seatV: number;
  /** Seat extent along u (profile: toward the facing side; front: screen right), m from the ground point. */
  u0: number;
  u1: number;
};

/** Where the seat of a chair under a seated figure is, for the pose's view (a profile chair is deeper than the front one is wide). */
export const chairSpec = (def: CastDef, view: FigPose['view']): ChairSpec => {
  const f = bodyFrame(def, {view, sit: 1});
  const k = f.hipV / 0.374; // the 1.7 m adult's seated hip height is 0.374 m
  return view === 'front' ? {seatV: f.hipV - 0.05, u0: -0.22 * k, u1: 0.22 * k} : {seatV: f.hipV - 0.05, u0: f.hipU - 0.2 * k, u1: f.hipU + 0.33 * k};
};

/**
 * A plain wooden chair under a seated figure: `g` and `unit` as drawFigure takes them, `view` the sitter's view (profile chairs
 * face the way the sitter faces). `back` (default true) draws the backrest.
 */
export const drawChair = (p: Painter, seed: number, g: Pt, unit: number, def: CastDef, view: FigPose['view'], o: {color?: string; back?: boolean} = {}) => {
  const wood = o.color ?? '#9a7a56', dark = mixColor(wood, '#000000', 0.22);
  const {seatV, u0, u1} = chairSpec(def, view);
  const dir = view === 'left' ? -1 : 1;
  const X = (u: number) => g[0] + (view === 'front' ? u : dir * u) * unit, Y = (v: number) => g[1] - v * unit;
  const P = (u: number, v: number): Pt => [X(u), Y(v)];
  let n = 0;
  const part = (color: string, pts: Pt[]) => {
    solid(p, seed * 1000 + ++n, color, pts, 4, 0.07, 0.2);
    inkLine(p, seed * 1000 + 500 + n, pts, {weight: 1.0, color: mixColor(color, INK, 0.55)});
  };
  const th = 0.04, w = 0.03, back = o.back ?? true;
  const bh = 0.5 * (seatV / 0.324); // backrest height above the seat
  if (view === 'front') {
    // Far legs and the backrest first, then the seat plank and the near legs.
    for (const s of [-1, 1]) {
      if (back) part(dark, [P(s * (u1 - 0.02) - w / 2, seatV), P(s * (u1 - 0.02) + w / 2, seatV), P(s * (u1 - 0.02) + w / 2, seatV + bh), P(s * (u1 - 0.02) - w / 2, seatV + bh)]);
    }
    if (back) part(wood, [P(u0 + 0.03, seatV + bh), P(u1 - 0.03, seatV + bh), P(u1 - 0.03, seatV + bh - 0.08), P(u0 + 0.03, seatV + bh - 0.08)]);
    for (const s of [-1, 1]) part(wood, [P(s * (u1 - 0.025) - w / 2, 0), P(s * (u1 - 0.025) + w / 2, 0), P(s * (u1 - 0.025) + w / 2, seatV), P(s * (u1 - 0.025) - w / 2, seatV)]);
    part(wood, [P(u0, seatV), P(u1, seatV), P(u1, seatV - th), P(u0, seatV - th)]);
    return;
  }
  // Profile: far legs, backrest, seat, near legs.
  const uB = u0 + 0.03, uF = u1 - 0.04;
  for (const u of [uB + 0.03, uF + 0.03]) part(dark, [P(u - w / 2, 0), P(u + w / 2, 0), P(u + w / 2, seatV), P(u - w / 2, seatV)]);
  if (back) part(wood, [P(u0, seatV), P(u0 + w, seatV), P(u0 - 0.04 + w, seatV + bh), P(u0 - 0.04, seatV + bh)]);
  part(wood, [P(u0, seatV), P(u1, seatV), P(u1, seatV - th), P(u0, seatV - th)]);
  for (const u of [uB, uF]) part(wood, [P(u - w / 2, 0), P(u + w / 2, 0), P(u + w / 2, seatV - th), P(u - w / 2, seatV - th)]);
};

// ---------------------------------------------------------------------------------------------------------------------------------
// Dog-training props (EDU-EP19-SHORT comp card W2.4, 15 Nov 2026; brief EDU-EP19-BRIEF-R1 N4, N6; proposed for kit intake at W8.4).
// Plate px in, painted in the kit washes and ink. The stopwatch digits are an SVG overlay in the scene (`stopwatchText`), so they
// stay legible: p5 text is not used for numbers.

/** Orange-red long line (tracking lead), 8 mm thick in life. */
export const LONG_LINE = '#d9532b';

/** A rope or lead from `a` to `b` (px) sagging `sag` px at its middle (a quadratic arc), `width` px thick. Drawn as a filled strip
 * with a darker edge, so it reads at any thickness. `coil` > 0 adds that many loose loops hanging at `a` (a line coiled in the hand). */
export const paintLongLine = (p: Painter, seed: number, a: Pt, b: Pt, o: {sag?: number; width?: number; color?: string; coil?: number} = {}) => {
  const sag = o.sag ?? 40, w = Math.max(1.2, o.width ?? 3), color = o.color ?? LONG_LINE, n = 24;
  const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2 * sag];
  const pts: Pt[] = Array.from({length: n + 1}, (_, i): Pt => {
    const u = i / n, k = 1 - u;
    return [k * k * a[0] + 2 * k * u * m[0] + u * u * b[0], k * k * a[1] + 2 * k * u * m[1] + u * u * b[1]];
  });
  const strip = (line: Pt[], half: number): Pt[] => {
    const L: Pt[] = [], R: Pt[] = [];
    line.forEach((q, i) => {
      const pa = line[Math.max(0, i - 1)], pb = line[Math.min(line.length - 1, i + 1)], dx = pb[0] - pa[0], dy = pb[1] - pa[1], ln = Math.hypot(dx, dy) || 1;
      L.push([q[0] - (dy / ln) * half, q[1] + (dx / ln) * half]); R.push([q[0] + (dy / ln) * half, q[1] - (dx / ln) * half]);
    });
    return [...L, ...R.reverse()];
  };
  solid(p, seed, mixColor(color, INK, 0.45), strip(pts, w / 2 + 0.8), 2, 0.02, 0.05);
  solid(p, seed + 1, color, strip(pts, w / 2), 3, 0.02, 0.05);
  for (let k = 0; k < (o.coil ?? 0); k++) {
    const r = 10 + 4 * k, loop: Pt[] = Array.from({length: 19}, (_, i): Pt => {
      const t = (i / 18) * Math.PI * 2;
      return [a[0] + (k - 0.5) * 3 + r * 0.55 * Math.sin(t), a[1] + r * (1 - Math.cos(t))];
    });
    inkLine(p, seed + 10 + k, loop, {color: mixColor(color, INK, 0.2), weight: Math.max(0.8, w / 3), closed: false, curve: 0.4});
  }
};

/** Stopwatch digits for the SVG overlay: 1205 s -> "20:05". */
export const stopwatchText = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** A sports stopwatch on a wrist strap: `c` the face centre (px), `r` the face radius (px; 0.025 m in life), `angle` the forearm direction
 * (radians, elbow -> hand). The strap wraps round the wrist, so it crosses the forearm (perpendicular to `angle`) and spans the wrist's width
 * `wrist` (px, default 2.8 r); the start button sits at the hand side of the case (draft fix round 1, user 2026-11-16: "is the watch strapped
 * the wrong way?" - the strap ran along the arm). Returns the digit box (centre, width, height px) for the overlay text, read along the forearm. */
export const paintStopwatch = (p: Painter, seed: number, c: Pt, r: number, o: {angle?: number; wrist?: number; strap?: string; body?: string; face?: string} = {}) => {
  const ang = o.angle ?? 0, ca = Math.cos(ang), sa = Math.sin(ang), half = (o.wrist ?? r * 2.8) / 2;
  const R = (u: number, v: number): Pt => [c[0] + u * ca - v * sa, c[1] + u * sa + v * ca];
  const rect = (u0: number, v0: number, u1: number, v1: number): Pt[] => [R(u0, v0), R(u1, v0), R(u1, v1), R(u0, v1)];
  const disc = (rr: number, n = 20): Pt[] => Array.from({length: n}, (_, i) => R(rr * Math.cos((i / n) * Math.PI * 2), rr * Math.sin((i / n) * Math.PI * 2)));
  const strap = o.strap ?? '#2f3236', body = o.body ?? '#26282b', face = o.face ?? '#dfe6da';
  // Strap across the wrist (v), a band about 0.9 r wide along the arm (u), ends tucked round the arm's edges.
  solid(p, seed, strap, rect(-r * 0.46, -half, r * 0.46, half), 3, 0.04, 0.1);
  solid(p, seed + 1, mixColor(body, '#8a8f96', 0.25), rect(r * 1.05, -r * 0.2, r * 1.3, r * 0.2), 3, 0.02, 0.05); // start button, hand side
  solid(p, seed + 2, body, disc(r * 1.12), 4, 0.03, 0.08);
  solid(p, seed + 3, face, disc(r * 0.84), 4, 0.02, 0.05);
  inkLine(p, seed + 4, disc(r * 1.12), {weight: Math.min(1.2, Math.max(0.5, r / 14)), curve: 0.3});
  return {c, w: r * 1.5, h: r * 0.7};
};

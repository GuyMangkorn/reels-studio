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

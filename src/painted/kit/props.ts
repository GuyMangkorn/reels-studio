import {bodyFrame, type CastDef, type FigPose} from './cast';
import {INK, ell, hardFill, inkLine, solid, washAt} from './draw';
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

// ---------------------------------------------------------------------------------------------------------------------------------
// Heist props (EDU-EP31-SHORT, Film W3 look asset, BRIEF-R5 VD31-10 / VD31-15, 2026-11-21; proposed for kit intake at W8.4; Boss
// hardens). Plate px in, kit washes and ink. Both read at 270 px wide on a figure about 860 px tall.

export const TOY_PISTOL = {body: '#f2782a', dark: '#c4531a', grip: '#3d8fd6', stripe: '#ffd23f', cork: '#d9b07a', corkDark: '#a8814f'} as const;

/** `new: toy-pistol-cartoon`: an obvious toy (user, 2026-11-21: "a cartoon-style gun is fine"; VD31-10: never realistic), drawn as a
 * clear side-on pistol silhouette (R5 repaint, viewer check: the R5 tube read as a squirt bottle): a chunky orange slide with a hammer
 * bump and a front-sight nub, a raked blue grip longer than a fist (the butt shows past the fingers), an open trigger guard loop in
 * front of the grip, a yellow stripe and an oversized cork in the muzzle. `grip` is the held point (px, the grip centre where a fist
 * closes), `u` px per metre, `ang` the barrel direction (radians on screen, 0 = screen right), `flip` mirrors the gun about the barrel
 * (the grip hangs on the other side), `scale` enlarges it (cartoon oversize). Life size about 0.25 m long at scale 1. Draw the fist over
 * the grip afterwards (`Arm.flatFist` + `onFlatFist`). Local frame: a along the barrel, b from the slide toward the butt; the grip
 * centre is the origin. Returns the muzzle centre (px). */
export const paintToyPistol = (p: Painter, seed: number, grip: Pt, u0: number, ang: number, o: {flip?: boolean; scale?: number} = {}) => {
  const u = u0 * (o.scale ?? 1);
  const c = Math.cos(ang), s = Math.sin(ang), f = o.flip ? -1 : 1;
  // the held point is the grip's middle (a -0.03, b 0): shift so it lands on `grip`
  const P = (a0: number, b: number): Pt => { const a = a0 + 0.03; return [grip[0] + (a * c - b * f * s) * u, grip[1] + (a * s + b * f * c) * u]; };
  const poly = (pts: [number, number][]) => pts.map(([a, b]) => P(a, b));
  const round = (a0: number, a1: number, b0: number, b1: number, r: number): Pt[] => {
    const out: Pt[] = [];
    const corner = (ca: number, cb: number, t0: number) => { for (let i = 0; i <= 4; i++) { const t = t0 + (i / 4) * (Math.PI / 2); out.push(P(ca + r * Math.cos(t), cb + r * Math.sin(t))); } };
    corner(a1 - r, b1 - r, 0); corner(a0 + r, b1 - r, Math.PI / 2); corner(a0 + r, b0 + r, Math.PI); corner(a1 - r, b0 + r, Math.PI * 1.5);
    return out;
  };
  const ink = (n: number, color: string, pts: Pt[], closed = true) =>
    inkLine(p, seed + 50 + n, pts, {weight: Math.max(0.9, u / 480), color: mixColor(color, INK, 0.6), closed, curve: 0.2});
  const part = (n: number, color: string, pts: Pt[]) => { solid(p, seed + n, color, pts, 4, 0.03, 0.08); ink(n, color, pts); };
  // slide spans b -0.10..-0.045 and a -0.065..0.15; the grip hangs from its rear third, raked back, to the butt at b +0.06
  const B0 = -0.1, B1 = -0.045;
  part(1, TOY_PISTOL.grip, poly([[-0.05, B1 - 0.01], [0.012, B1 - 0.01], [-0.004, 0.05], [-0.018, 0.062], [-0.056, 0.062], [-0.068, 0.05]]));
  // trigger guard: an open loop (outer arc minus inner arc) under the slide in front of the grip, and the trigger nub inside it
  const arc = (r1: number, r2: number, n = 10): Pt[] => Array.from({length: n + 1}, (_, i) => { const t = Math.PI * (i / n); return P(0.04 + r1 * Math.cos(t), B1 + r2 * Math.sin(t)); });
  const guard = [...arc(0.038, 0.042), ...arc(0.026, 0.03).reverse()];
  part(2, TOY_PISTOL.body, guard);
  solid(p, seed + 3, TOY_PISTOL.dark, poly([[0.026, B1], [0.036, B1], [0.03, B1 + 0.024], [0.022, B1 + 0.022]]), 3, 0.02, 0.05);
  part(4, TOY_PISTOL.body, round(-0.065, 0.15, B0, B1, 0.016));
  part(5, TOY_PISTOL.body, round(-0.068, -0.04, B0 - 0.016, B0 + 0.006, 0.008)); // hammer bump
  part(6, TOY_PISTOL.body, round(0.115, 0.135, B0 - 0.012, B0 + 0.004, 0.005)); // front sight
  solid(p, seed + 7, TOY_PISTOL.stripe, poly([[-0.05, -0.078], [0.13, -0.078], [0.13, -0.066], [-0.05, -0.066]]), 3, 0.02, 0.05);
  part(8, TOY_PISTOL.dark, round(0.14, 0.17, B0 - 0.006, B1 + 0.006, 0.01)); // muzzle collar
  const cy = (B0 + B1) / 2;
  const cork: Pt[] = Array.from({length: 16}, (_, i) => { const t = (i / 16) * Math.PI * 2; return P(0.188 + 0.02 * Math.cos(t), cy + 0.03 * Math.sin(t)); });
  part(9, TOY_PISTOL.cork, cork);
  hardFill(p, seed + 10, TOY_PISTOL.corkDark, Array.from({length: 12}, (_, i) => { const t = (i / 12) * Math.PI * 2; return P(0.195 + 0.007 * Math.cos(t), cy + 0.014 * Math.sin(t)); }));
  hardFill(p, seed + 11, '#fff3d6', Array.from({length: 10}, (_, i) => { const t = (i / 10) * Math.PI * 2; return P(0.04 + 0.05 * Math.cos(t), B0 + 0.012 + 0.005 * Math.sin(t)); }));
  return P(0.208, cy);
};

export const MONEY_BAG = {canvas: '#c9b48a', canvasDark: '#9c8660', strap: '#6b5233', bill: '#9fcf8a', billDark: '#4f8a46'} as const;

/** `new: canvas-money-bag` as a shoulder bag: a plain canvas bag (no symbol, VD31-15) on a strap from `strapTop` (px, on the shoulder)
 * to the bag; the bag's top centre at `bag`, `w`/`h` its size (px), green banknotes peeking from the open top (`bills`, default 4), or
 * with `corner` a single note whose one corner peeks out at the top (EDU-EP31 RC5-02: no stack of cash on the walk in; the shape and one
 * corner say "money bag"; never a figure, bank name or legible denomination). Paint after the figure's torso; the strap is a flat band
 * `strapW` px wide. */
export const paintShoulderBag = (p: Painter, seed: number, strapTop: Pt, bag: Pt, w: number, h: number, o: {bills?: number; strapW?: number; corner?: boolean} = {}) => {
  const sw = o.strapW ?? w * 0.09;
  const band = (a: Pt, b: Pt, half: number): Pt[] => {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * half, ny = dx / l * half;
    return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
  };
  const attach: Pt = [bag[0] - w * 0.42 * Math.sign(bag[0] - strapTop[0] || 1), bag[1] + h * 0.05];
  solid(p, seed, MONEY_BAG.strap, band(strapTop, attach, sw / 2), 3, 0.03, 0.06);
  inkLine(p, seed + 1, band(strapTop, attach, sw / 2), {weight: 0.8, color: mixColor(MONEY_BAG.strap, INK, 0.6), closed: true, curve: 0});
  // banknotes behind the bag's front panel, fanned
  if (o.corner) {
    // one plain note, tilted, sunk in the bag so only a corner shows above the hem (no oval or numerals at this size)
    const a = -0.6, cx = bag[0] + w * 0.2, cy = bag[1] + h * 0.34, bw = w * 0.34, bh = h * 0.42, ca = Math.cos(a), sa = Math.sin(a);
    const R = (x: number, y: number): Pt => [cx + x * ca - y * sa, cy + x * sa + y * ca];
    const note = [R(-bw / 2, -bh), R(bw / 2, -bh), R(bw / 2, 0.2 * bh), R(-bw / 2, 0.2 * bh)];
    solid(p, seed + 10, MONEY_BAG.bill, note, 3, 0.02, 0.05);
    inkLine(p, seed + 20, note, {weight: 0.8, color: MONEY_BAG.billDark, closed: true, curve: 0});
  }
  const n = o.corner ? 0 : o.bills ?? 4;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5, a = t * 0.9, cx = bag[0] + t * w * 0.55, cy = bag[1] - h * 0.12;
    const bw = w * 0.34, bh = h * 0.42, ca = Math.cos(a), sa = Math.sin(a);
    const R = (x: number, y: number): Pt => [cx + x * ca - y * sa, cy + x * sa + y * ca];
    const note = [R(-bw / 2, -bh), R(bw / 2, -bh), R(bw / 2, 0.2 * bh), R(-bw / 2, 0.2 * bh)];
    solid(p, seed + 10 + i, MONEY_BAG.bill, note, 3, 0.02, 0.05);
    inkLine(p, seed + 20 + i, note, {weight: 0.8, color: MONEY_BAG.billDark, closed: true, curve: 0});
    inkLine(p, seed + 30 + i, ell(...R(0, -bh * 0.5), bw * 0.16, bh * 0.2, 12, a), {weight: 0.8, color: MONEY_BAG.billDark, closed: true, curve: 0.3});
  }
  // the bag: soft trapezoid with a rolled top hem and a bottom shade
  const body: Pt[] = [[bag[0] - w * 0.46, bag[1]], [bag[0] + w * 0.46, bag[1]], [bag[0] + w * 0.52, bag[1] + h * 0.82], [bag[0] + w * 0.4, bag[1] + h], [bag[0] - w * 0.4, bag[1] + h], [bag[0] - w * 0.52, bag[1] + h * 0.82]];
  solid(p, seed + 40, MONEY_BAG.canvas, body, 4, 0.06, 0.1);
  washAt(p, seed + 41, MONEY_BAG.canvasDark, 120, [[bag[0] - w * 0.5, bag[1] + h * 0.7], [bag[0] + w * 0.5, bag[1] + h * 0.7], [bag[0] + w * 0.4, bag[1] + h], [bag[0] - w * 0.4, bag[1] + h]], 0.2, 0.3);
  solid(p, seed + 42, MONEY_BAG.canvasDark, [[bag[0] - w * 0.48, bag[1] - h * 0.04], [bag[0] + w * 0.48, bag[1] - h * 0.04], [bag[0] + w * 0.47, bag[1] + h * 0.1], [bag[0] - w * 0.47, bag[1] + h * 0.1]], 3, 0.03, 0.06);
  inkLine(p, seed + 43, body, {weight: 1.0, color: mixColor(MONEY_BAG.canvas, INK, 0.6), closed: true, curve: 0.25});
};

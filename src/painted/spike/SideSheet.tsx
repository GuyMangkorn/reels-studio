import {AbsoluteFill} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';
import {CAST, type Cast} from './CastSheet';
import {BROW_Y, CHIN, FACES, HEAD_SPAN, INK, type Face, type HeadStyle} from './FaceSheet';
import {ellipse, limb, skeleton} from './ProportionSheet';

type Pt = [number, number];

// WORLD FOG side views (proposal): the cast of CastSheet in profile, facing right, at 4 heads; the delivery worker
// pushes the platform cart with the carton stack, helmet on top and umbrella hooked on the handle, then the same
// assembly from the front as a fog silhouette (the script's principal feasibility test: one continuous
// worker/cart/cargo/helmet). In pure profile the worker stands clear of the stack, so the illusion needs the front view.
// Real-world sizes assume the 4-head cast is 1.7 m tall. 1080x1920 frame.

const N = 4, UNIT = 190;
const M = (N * UNIT) / 1.7; // px per metre
const ROW1 = 900, ROW2 = 1810;
const FOG_PANEL = '#c3cbc9', SIL = '#3a4246';

export type Paint = {
  /** Fill polygon (opaque decal block); `passes` > 4 for light over dark. */
  part: (color: string, pts: Pt[], outline?: boolean, passes?: number) => void;
  /** Ink line or open curve (INK unless `color` is given). */
  ink: (pts: Pt[], weight?: number, curve?: number, color?: string) => void;
  /** Silhouette mode: everything one colour, no features or ink. */
  sil: boolean;
  /** Composition time (s) and the seed base: drive the profile blink. */
  t: number;
  id: number;
  /** A painter with its own seed counters, so marks drawn through it never shift this painter's later seeds. */
  fork: (offset: number) => Paint;
};

/** Wrap a `Paint` so every point is rotated by `angle` about `about` (a pitched head, a stooped torso); forks stay wrapped. */
export const rotated = (p: Paint, about: Pt, angle: number): Paint => {
  const c = Math.cos(angle), s = Math.sin(angle);
  const R = ([x, y]: Pt): Pt => [about[0] + (x - about[0]) * c - (y - about[1]) * s, about[1] + (x - about[0]) * s + (y - about[1]) * c];
  return {
    ...p,
    part: (color, pts, outline, passes) => p.part(color, pts.map(R), outline, passes),
    ink: (pts, weight, curve, color) => p.ink(pts.map(R), weight, curve, color),
    fork: (offset) => rotated(p.fork(offset), about, angle),
  };
};

export const makePaint = (ctx: PaintContext, base: number, sil?: string): Paint => {
  const {brush, still, boil} = ctx;
  let seed = base, line = base + 900;
  const ink = (pts: Pt[], weight = 1.0, curve = 0.15, color = INK) => {
    if (sil) return;
    boil(++line);
    brush.set('rotring', color, weight);
    brush.spline(pts, curve);
  };
  return {
    sil: !!sil,
    t: ctx.t,
    id: base,
    fork: (offset) => makePaint(ctx, base + offset, sil),
    ink,
    part: (color, pts, outline = true, passes = 4) => {
      // A silhouette is one merged mass, as fog makes it: no texture, so no inner edges show.
      const n = sil ? Math.max(passes, 6) : passes;
      for (let p = 0; p < n; p++) {
        still(++seed);
        brush.noStroke();
        brush.fill(sil ?? color, 255);
        brush.fillBleed(0);
        brush.fillTexture(sil ? 0 : 0.08, 0.2);
        brush.polygon(pts);
        brush.noFill();
      }
      if (outline) ink([...pts, pts[0]]);
    },
  };
};

// --- Profile decal head (HEAD-SIDE-R2, user side-view reference 29 Oct 2026) ---------------------------------------
// Head units as the front decal (FaceSheet paintHead): K = half the face width, centre (0, 0), y down, facing +x.
// Shared lines with the front: crown -1.05, brow BROW_Y (-0.24 flat), eye 0.05, mouth 0.6, chin CHIN 1.22.
// Profile-only: nose tip 0.33 protruding to x 1.13; face line ~0.95; back of skull -1.07; ear centred x -0.12.

/** Closed Catmull-Rom loop through control points `c`, `n` samples per span (soft decal curves). */
const smooth = (c: Pt[], n = 5): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < c.length; i++) {
    const [p0, p1, p2, p3] = [c[(i - 1 + c.length) % c.length], c[i], c[(i + 1) % c.length], c[(i + 2) % c.length]];
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      const f = (k: 0 | 1) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      out.push([f(0), f(1)]);
    }
  }
  return out;
};

/** Profile skull + face line: upright face, nose bump below the eye, receding to the mouth, rounded chin, full back. */
const SIDE_SKULL: Pt[] = [
  [-0.05, -1.05], [0.45, -0.96], [0.8, -0.68], [0.95, -0.3], [0.97, 0.02], [0.96, 0.17], // crown, forehead, eye
  [1.05, 0.24], [1.13, 0.33], [1.1, 0.41], [1.0, 0.45], [0.93, 0.47], // nose
  [0.9, 0.55], [0.89, 0.66], [0.88, 0.8], [0.84, 0.98], [0.68, 1.15], [0.45, 1.22], // mouth, jaw, chin
  [0.2, 1.17], [-0.02, 1.05], [-0.3, 0.98], [-0.62, 0.86], [-0.92, 0.55], [-1.07, 0.1], [-1.04, -0.38], [-0.82, -0.8], [-0.47, -1.0],
];
/** Hair caps per cut (closed loops, clockwise from the fringe tip over the crown, back up the inner edge). */
const SIDE_HAIR: Record<'short' | 'tied' | 'bob', Pt[]> = {
  // Men's short cut: two crown tufts; cap down the whole back to the nape; edge in front of the ear (sideburn).
  short: [
    [0.93, -0.46], [1.0, -0.63], [0.88, -0.87], [0.6, -1.08], [0.26, -1.17], [0.15, -1.31], [0.04, -1.18],
    [-0.1, -1.3], [-0.2, -1.17], [-0.55, -1.1], [-0.92, -0.85], [-1.13, -0.38], [-1.14, 0.12], [-1.02, 0.56],
    [-0.78, 0.85], [-0.5, 0.98], [-0.38, 0.86], [-0.3, 0.6], [-0.14, 0.45], [0.03, 0.33], [0.08, 0.08], [0.15, -0.18],
    [0.32, -0.38], [0.56, -0.48], [0.8, -0.49],
  ],
  // Swept back to a bun; edge behind the ear.
  tied: [
    [0.9, -0.5], [0.99, -0.66], [0.86, -0.9], [0.5, -1.1], [0.0, -1.16], [-0.5, -1.1], [-0.9, -0.82], [-1.12, -0.35],
    [-1.12, 0.15], [-1.0, 0.55], [-0.78, 0.83], [-0.5, 0.96], [-0.4, 0.84], [-0.34, 0.55], [-0.3, 0.2], [-0.2, -0.12],
    [0.02, -0.32], [0.3, -0.46], [0.6, -0.56],
  ],
  // Jaw-length bob over the ear, straight bangs.
  bob: [
    [0.9, -0.42], [0.99, -0.62], [0.87, -0.9], [0.5, -1.13], [0.0, -1.19], [-0.55, -1.13], [-0.95, -0.86],
    [-1.16, -0.35], [-1.19, 0.2], [-1.15, 0.62], [-1.03, 0.83], [-0.4, 0.85], [0.12, 0.83], [0.2, 0.5], [0.24, 0.0],
    [0.3, -0.3], [0.5, -0.42],
  ],
};
const SIDE_HOOD: Pt[] = [
  [0.78, -0.95], [0.4, -1.28], [-0.2, -1.38], [-0.75, -1.22], [-1.15, -0.8], [-1.3, -0.15], [-1.25, 0.55], [-1.0, 1.05],
  [-0.5, 1.3], [0.1, 1.32], [0.42, 1.08], [0.5, 0.6], [0.5, 0.0], [0.58, -0.6],
];
/** Ear (centre x -0.12, between eye line and nose): skin oval, the C rim round the back (open toward the face), inner line. */
const arcPts = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 14): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
const SIDE_EAR = arcPts(-0.12, 0.18, 0.15, 0.24, 0, 2 * Math.PI, 20);
const EAR_RIM = arcPts(-0.12, 0.18, 0.15, 0.24, 1.15, 2 * Math.PI - 1.15);
const EAR_IN = arcPts(-0.1, 0.2, 0.07, 0.13, 1.5, 2 * Math.PI - 1.3, 10);

/** Profile eye: centre x and line (the front eye line). */
const SE: Pt = [0.72, 0.05];
const MOUTH_Y = 0.6;

/**
 * Profile decal head facing +x, centred on (cx, cy), `K` px per head unit: the front decal's egg, eye line, brow,
 * mouth and chin in profile (HEAD-SIDE-R2). Face controls: `eyes` dot/wide/half/shut, `look` [forward, down]
 * (forward = toward the nose; for a mirrored figure it stays toward the nose), `brow`, `mouth`, and an automatic blink
 * from `p.id` and `p.t` only when `blink` is set (default off; a shot switches it on: user, 29 Oct 2026). Features are
 * drawn through a forked painter, eyes last, so a blink moves no other seed.
 */
export const paintHeadSide = (p: Paint, cx: number, cy: number, K: number, face: Face, style: HeadStyle, {blink = false, blinkAt: at}: {blink?: boolean; blinkAt?: number} = {}) => {
  const P = (pts: Pt[]): Pt[] => pts.map(([u, v]) => [cx + u * K, cy + v * K]);
  const {cut} = style;
  if (cut === 'tied') p.part(style.hair, P(smooth(ellipse(-0.6, -1.02, 0.3, 0.24, 8), 3)), true, 6); // bun at the back
  const skull = smooth(SIDE_SKULL);
  p.part(style.skin, P(skull), false, cut === 'tied' ? 8 : 4);
  // Outline only the face side (forehead to nape, 5 samples per control point); hair or hood owns the back's edge,
  // so no skull line shows through the cap.
  p.ink(P(skull.slice(2 * 5, (cut === 'hood' ? 17 : 19) * 5 + 1)));
  if (cut === 'hood') {
    p.part(style.hood ?? style.hair, P(smooth(SIDE_HOOD)), true, 6);
    p.part(style.hair, P(smooth([[0.6, -0.84], [0.92, -0.62], [0.84, -0.46], [0.64, -0.5]], 3)), true, 6); // fringe under the hood
  } else {
    p.part(style.hair, P(smooth(SIDE_HAIR[cut])), true, 6);
    if (cut !== 'bob') {
      // Ear over the hair edge (sideburn in front of it for the short cut).
      p.part(style.skin, P(SIDE_EAR), false, 8);
      p.ink(P(EAR_RIM), 1.0, 0.5);
      p.ink(P(EAR_IN), 0.9, 0.5);
    }
  }
  if (p.sil) return;

  const q = p.fork(700);
  const [ex, ey] = SE;
  // Brow: one short thick bar; front end at BROW_Y inner, back end at outer, slanted slightly down to the back.
  let [inner, outer] = BROW_Y[face.brow];
  if (face.brow === 'quirk') [inner, outer] = [-0.34, -0.36];
  outer += 0.03;
  q.part(style.hair, P([[0.56, outer - 0.04], [0.87, inner - 0.04], [0.88, inner + 0.035], [0.56, outer + 0.035]]), false, 6);
  // Mouth just behind the face line.
  const my = MOUTH_Y, MOUTH = '#3b2a24';
  if (face.mouth === 'flat') q.ink(P([[0.7, my], [0.86, my]]), 1.3, 0);
  else if (face.mouth === 'tilt') q.ink(P([[0.7, my + 0.03], [0.86, my - 0.03]]), 1.3, 0);
  else if (face.mouth === 'frown') q.ink(P([[0.68, my + 0.05], [0.77, my - 0.01], [0.86, my + 0.01]]), 1.4, 0.6);
  else if (face.mouth === 'wavy') q.ink(P([[0.68, my], [0.72, my - 0.03], [0.76, my + 0.01], [0.8, my - 0.03], [0.84, my + 0.01], [0.87, my - 0.01]]), 1.2, 0.5);
  else if (face.mouth === 'smile') q.part(MOUTH, P(smooth([[0.66, my - 0.05], [0.87, my - 0.06], [0.85, my + 0.04], [0.76, my + 0.1], [0.69, my + 0.03]], 3)), true, 4);
  else q.part(MOUTH, P(face.mouth === 'o' ? ellipse(0.8, my + 0.02, 0.06, 0.1, 14) : ellipse(0.79, my + 0.02, 0.08, 0.06, 14)), true, 4);
  // Age lines in warm brown, as the front: crow's feet, under-eye, nasolabial fold, mouth corner.
  if (style.lines) {
    const age = (pts: Pt[], curve = 0.5) => q.ink(P(pts), 0.8, curve, '#8a5a43');
    for (const dy of [-0.06, 0.02, 0.1]) age([[0.58, ey + dy * 0.6], [0.48, ey + dy]], 0);
    age([[0.62, 0.2], [0.72, 0.23], [0.82, 0.2]]);
    age([[0.9, 0.44], [0.8, 0.52], [0.76, 0.66]]);
    age([[0.67, 0.66], [0.66, 0.74]], 0);
  }
  // Eye last: white oval + pupil near the front edge. Blink as the front head: once in 0.4-2.6 s, 4 frames shut.
  const blinkAt = at ?? 0.4 + hash(p.id + 7) * 2.2;
  const eyes = blink && p.t > blinkAt && p.t < blinkAt + 0.13 ? 'shut' : face.eyes;
  if (eyes === 'shut') {
    q.ink(P([[ex - 0.11, ey], [ex, ey + 0.05], [ex + 0.1, ey]]), 1.5, 0.5);
    return;
  }
  const ry = eyes === 'wide' ? 0.15 : 0.12, rx = eyes === 'wide' ? 0.11 : 0.1;
  const white = eyes === 'half'
    ? Array.from({length: 13}, (_, i): Pt => [ex + rx * Math.cos((i / 12) * Math.PI), ey + ry * Math.sin((i / 12) * Math.PI)])
    : ellipse(ex, ey, rx, ry, 16);
  const [lx, ly] = face.look;
  q.part('#fbf7ee', P(white), true, 3);
  const pr = eyes === 'wide' ? 0.05 : 0.058;
  q.part(INK, P(ellipse(ex + 0.045 + 0.025 * lx, ey + 0.05 * ly + (eyes === 'half' ? 0.05 : 0), pr, pr * 1.1, 12)), false, 6);
};

/** Two-bone reach from shoulder S to target T (each bone `len`), elbow bending down and back. */
export const reach = (S: Pt, T: Pt, len: number): Pt => {
  const dx = T[0] - S[0], dy = T[1] - S[1];
  const d = Math.min(Math.hypot(dx, dy), 2 * len - 1);
  const a = Math.atan2(dy, dx) + Math.acos(d / (2 * len));
  return [S[0] + len * Math.cos(a), S[1] + len * Math.sin(a)];
};

/**
 * One cast member in profile, ground point (cx, ground), facing +x. `grip` puts the near hand on a cart handle.
 * `opts.blink` switches the profile blink on (default off). Returns the head anchor (centre, px per head unit).
 */
export const paintBodySide = (p: Paint, c: Cast, cx: number, ground: number, grip?: Pt, opts: {blink?: boolean; blinkAt?: number; stoop?: number} = {}) => {
  const h = UNIT, o = c.outfit;
  const k = skeleton(cx, N, ground, h, o.shoulder);
  const {shoulderY: sY, hipY, crotchY} = k;
  const kneeY = k.legs[0].knee[1], ankleY = k.legs[0].ankle[1];
  const X = (u: number) => cx + u * h;

  // Far leg and shoe (behind), near leg and shoe.
  for (const [dx, shade] of [[-0.05, 0.86], [0.02, 1]] as const) {
    const legColor = shade < 1 && !p.sil ? mix(o.pants, 0.86) : o.pants;
    p.part(legColor, limb([X(dx), hipY - 0.04 * h], [X(dx - 0.01), ankleY], 0.26 * h, 0.19 * h));
    if (o.boots) p.part(o.shoes, [[X(dx - 0.11), ankleY - 0.32 * h], [X(dx + 0.11), ankleY - 0.32 * h], [X(dx + 0.12), ankleY - 0.04 * h], [X(dx + 0.3), ground - 0.04 * h], [X(dx + 0.3), ground], [X(dx - 0.13), ground]]);
    else p.part(o.shoes, ellipse(X(dx + 0.08), ground - 0.05 * h, 0.2 * h, 0.07 * h));
  }
  if (!o.skirt && !o.coat) p.part(o.pants, [[X(-0.21), hipY - 0.06 * h], [X(0.18), hipY - 0.06 * h], [X(0.17), crotchY], [X(-0.24), crotchY - 0.02 * h]], false);
  if (o.skirt) p.part(o.skirt, [[X(-0.24), hipY - 0.08 * h], [X(0.2), hipY - 0.08 * h], [X(0.3), kneeY + 0.45 * h], [X(-0.32), kneeY + 0.45 * h]], true, 8);

  // Stoop (ZCPAINT infected): everything above the hips leans forward `opts.stoop` radians about the hip point.
  const q = opts.stoop ? rotated(p, [X(0), hipY], opts.stoop) : p;
  // Torso and outer layers, front to the right.
  if (o.coat) {
    q.part(o.coat, [[X(-0.19), sY], [X(0.14), sY], [X(0.24), sY + 0.22 * h], [X(0.3), kneeY + 0.12 * h], [X(-0.32), kneeY + 0.12 * h], [X(-0.24), sY + 0.15 * h]]);
  } else {
    q.part(o.shirt, [[X(-0.18), sY], [X(0.14), sY], [X(0.22), sY + 0.2 * h], [X(0.18), hipY], [X(-0.2), hipY], [X(-0.21), sY + 0.15 * h]]);
    if (o.jacket) q.part(o.jacket, [[X(-0.19), sY], [X(0.12), sY], [X(0.16), sY + 0.2 * h], [X(0.12), hipY + 0.06 * h], [X(-0.23), hipY + 0.06 * h], [X(-0.23), sY + 0.15 * h]]);
    if (o.apron) {
      q.part(o.apron, [[X(0.18), sY + 0.22 * h], [X(0.24), sY + 0.2 * h], [X(0.26), hipY + 0.32 * h], [X(0.18), hipY + 0.32 * h]], true, 8);
      q.ink([[X(0.2), sY + 0.22 * h], [X(-0.05), sY - 0.02 * h]], 1.0, 0); // neck strap
      q.part(o.apron, ellipse(X(-0.24), hipY - 0.1 * h, 0.06 * h, 0.04 * h, 12), true, 8); // tie at the back
    }
  }
  // Neck under the back half of the profile head (HEAD-SIDE-R2): neck centre X(-0.04), head centre X(0.03).
  const nw = o.coat ? 0.16 : 0.08, nx = -0.04;
  q.part(o.coat ?? c.head.skin, [[X(nx - nw), k.chin - 0.12 * h], [X(nx + nw), k.chin - 0.12 * h], [X(nx + nw + 0.01), sY + 0.03 * h], [X(nx - nw - 0.01), sY + 0.03 * h]], false);
  const K = h / HEAD_SPAN;
  const head = {x: X(0.03), y: k.chin - CHIN * K, K};
  paintHeadSide(q, head.x, head.y, K, FACES[c.face], c.head, opts);

  // Near arm: hanging, or reaching to the cart grip.
  const shoulder: Pt = [X(-0.01), sY + 0.07 * h];
  const armLen = k.arms[0].wrist[1] - k.arms[0].shoulder[1];
  const wrist: Pt = grip ?? [X(0.02), shoulder[1] + armLen];
  const elbow: Pt = grip ? reach(shoulder, grip, armLen / 2) : [X(-0.04), shoulder[1] + armLen / 2];
  q.part(o.sleeve, limb(shoulder, elbow, 0.19 * h, 0.16 * h));
  q.part(o.longSleeves ? o.sleeve : c.head.skin, limb(elbow, wrist, 0.15 * h, 0.13 * h));
  q.part(c.head.skin, ellipse(wrist[0] + (grip ? 0.03 * h : 0), wrist[1] + (grip ? 0 : 0.07 * h), 0.1 * h, 0.12 * h));
  if (opts.stoop) {
    const c = Math.cos(opts.stoop), sn = Math.sin(opts.stoop), dx = head.x - X(0), dy = head.y - hipY;
    return {head: {...head, x: X(0) + dx * c - dy * sn, y: hipY + dx * sn + dy * c}, tilt: opts.stoop};
  }
  return {head, tilt: 0};
};

// Darken a #rrggbb colour by factor f (far-side limbs).
const mix = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * f).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

/**
 * Platform cart, five cartons, helmet on top and a closed umbrella hooked on the handle; handle at x0, deck running
 * +x. Returns the grip point for the worker's hand.
 */
const paintCart = (p: Paint, x0: number, ground: number): Pt => {
  const deckTop = ground - 0.17 * M, deckLen = 0.75 * M;
  const grip: Pt = [x0 - 0.05 * M, ground - 0.97 * M];
  // Handle: upright tube with a bend back to the grip.
  p.part('#5b6066', [[x0, deckTop], [x0 + 0.035 * M, deckTop], [x0 + 0.035 * M, ground - 0.95 * M], [x0 - 0.06 * M, ground - 0.99 * M], [x0 - 0.06 * M, ground - 0.955 * M], [x0, ground - 0.93 * M]]);
  // Closed umbrella hooked over the handle, canopy rolled down to the deck.
  p.part('#30353b', [[x0 + 0.05 * M, ground - 0.86 * M], [x0 + 0.09 * M, ground - 0.86 * M], [x0 + 0.13 * M, deckTop - 0.02 * M], [x0 + 0.09 * M, deckTop - 0.02 * M]]);
  p.ink([[x0 + 0.07 * M, ground - 0.86 * M], [x0 + 0.07 * M, ground - 0.97 * M], [x0 + 0.01 * M, ground - 1.0 * M], [x0 - 0.02 * M, ground - 0.95 * M]], 2.4, 0.6);
  // Deck and wheels; the front wheel is the one that jams and scrapes.
  p.part('#6a7076', [[x0, deckTop], [x0 + deckLen, deckTop], [x0 + deckLen, deckTop + 0.05 * M], [x0, deckTop + 0.05 * M]]);
  for (const wx of [0.09, 0.66]) p.part('#24272a', ellipse(x0 + wx * M, ground - 0.06 * M, 0.06 * M, 0.06 * M, 14));
  // Cartons, each shifted a little: the stack is unstable.
  let y = deckTop;
  const boxH = 0.32 * M;
  for (let i = 0; i < 5; i++) {
    const w = (0.4 + 0.12 * hash(i + 300)) * M;
    const mid = x0 + deckLen * 0.55 + (hash(i + 310) - 0.5) * 0.08 * M + i * 0.012 * M;
    p.part('#c49a63', [[mid - w / 2, y], [mid + w / 2, y], [mid + w / 2, y - boxH], [mid - w / 2, y - boxH]]);
    if (!p.sil) p.part('#a87e4a', [[mid - w / 2, y - boxH * 0.55], [mid + w / 2, y - boxH * 0.55], [mid + w / 2, y - boxH * 0.45], [mid - w / 2, y - boxH * 0.45]], false, 2); // tape
    y -= boxH;
  }
  // Helmet on the top carton, tilted: the apparent head.
  const hx = x0 + deckLen * 0.55 + 0.08 * M, hy = y;
  const dome: Pt[] = Array.from({length: 15}, (_, j): Pt => {
    const a = Math.PI + (j / 14) * Math.PI, u = 0.15 * M * Math.cos(a), v = 0.14 * M * Math.sin(a), r = -0.15;
    return [hx + u * Math.cos(r) - v * Math.sin(r), hy + u * Math.sin(r) + v * Math.cos(r)];
  });
  p.part('#b8392c', dome);
  if (!p.sil) p.part('#3a4148', [[hx + 0.02 * M, hy - 0.11 * M], [hx + 0.15 * M, hy - 0.08 * M], [hx + 0.13 * M, hy - 0.01 * M], [hx + 0.03 * M, hy - 0.03 * M]], true, 4);
  return grip;
};

/**
 * The same worker/cart/cargo/helmet seen from the shop (front), as one silhouette: the worker stands behind and to
 * one side of the stack, one arm bracing it, so body and cartons merge into a tall figure with the helmet as its head.
 */
const paintAssemblyFront = (p: Paint, cx: number, ground: number) => {
  const h = UNIT, o = CAST[1].outfit;
  const wx = cx + 0.2 * M; // worker, behind the cart
  const k = skeleton(wx, N, ground - 0.04 * M, h, o.shoulder);
  const kneeY = k.legs[0].knee[1], hw = 0.3 * h;
  for (const {hip, ankle} of k.legs) p.part(o.pants, limb([hip[0], hip[1] - 0.04 * h], ankle, 0.26 * h, 0.19 * h));
  p.part(o.coat ?? o.shirt, [[wx - k.sw, k.shoulderY], [wx + k.sw, k.shoulderY], [wx + hw + 0.2 * h, kneeY + 0.12 * h], [wx - hw - 0.2 * h, kneeY + 0.12 * h]]);
  const K = h / HEAD_SPAN;
  p.part(o.coat ?? o.shirt, ellipse(wx, k.chin - CHIN * K, 1.3 * K, 1.42 * K, 24)); // hood
  // Cart from the front: deck edge and two wheels; the handle hides behind the stack.
  const deckTop = ground - 0.17 * M;
  p.part('#6a7076', [[cx - 0.26 * M, deckTop], [cx + 0.26 * M, deckTop], [cx + 0.26 * M, deckTop + 0.05 * M], [cx - 0.26 * M, deckTop + 0.05 * M]]);
  for (const s of [-1, 1]) p.part('#24272a', ellipse(cx + s * 0.2 * M, ground - 0.06 * M, 0.035 * M, 0.06 * M, 12));
  let y = deckTop;
  for (let i = 0; i < 5; i++) {
    const w = (0.4 + 0.12 * hash(i + 300)) * M;
    const mid = cx + (hash(i + 310) - 0.5) * 0.08 * M - i * 0.015 * M;
    p.part('#c49a63', [[mid - w / 2, y], [mid + w / 2, y], [mid + w / 2, y - 0.32 * M], [mid - w / 2, y - 0.32 * M]]);
    y -= 0.32 * M;
  }
  p.part('#b8392c', Array.from({length: 15}, (_, j): Pt => [cx - 0.03 * M + 0.15 * M * Math.cos(Math.PI + (j / 14) * Math.PI), y + 0.14 * M * Math.sin(Math.PI + (j / 14) * Math.PI)]));
  // Near arm braces the stack's side.
  const sh: Pt = [wx - k.sw + 0.06 * h, k.shoulderY + 0.06 * h];
  const hand: Pt = [cx + 0.2 * M, k.shoulderY + 0.1 * h];
  p.part(o.sleeve, limb(sh, hand, 0.19 * h, 0.15 * h));
};

const paint = (ctx: PaintContext) => {
  const {brush, still} = ctx;
  // Head-unit guides on both rows.
  [ROW1, ROW2].forEach((g, row) => {
    for (let i = 0; i <= N; i++) {
      still(19000 + row * 10 + i);
      brush.set('HB', i === 0 ? INK : '#b3c3cf', i === 0 ? 1.4 : 0.8);
      brush.line(30, g - i * UNIT, 1050, g - i * UNIT);
    }
  });
  // Row 1: narrator, shop worker, occupant.
  [0, 2, 3].forEach((ci, col) => paintBodySide(makePaint(ctx, 20000 + ci * 3000), CAST[ci], col * 360 + 170, ROW1));
  // Row 2: the worker and cart, lit; then the same assembly as a fog silhouette on a fog panel.
  const worker = CAST[1];
  const lit = makePaint(ctx, 40000);
  const grip = paintCart(lit, 200, ROW2);
  paintBodySide(lit, worker, 115, ROW2, grip);
  const panel = makePaint(ctx, 50000);
  panel.part(FOG_PANEL, [[560, ROW2 - 4.6 * UNIT], [1060, ROW2 - 4.6 * UNIT], [1060, ROW2 + 10], [560, ROW2 + 10]], false, 4);
  paintAssemblyFront(makePaint(ctx, 60000, SIL), 790, ROW2);
};

const Labels = () => {
  const label = (x: number, y: number, w: number, name: string, role: string) => (
    <div key={name} style={{position: 'absolute', left: x - w / 2, width: w, top: y + 12, textAlign: 'center', fontSize: 28, lineHeight: 1.15}}>
      <b>{name}</b> <span style={{fontSize: 20, color: '#5d6b78'}}>{role}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INK}}>
      <div style={{position: 'absolute', left: 40, top: 30, fontSize: 36}}>WORLD FOG cast · side · 4 heads</div>
      {[0, 2, 3].map((ci, col) => label(col * 360 + 180, ROW1, 360, CAST[ci].name, CAST[ci].role))}
      {label(270, ROW2, 540, CAST[1].name, 'with cart · lit')}
      {label(810, ROW2, 540, 'ในหมอก', 'same assembly · front silhouette')}
    </AbsoluteFill>
  );
};

export const SideSheet = () => (
  <AbsoluteFill style={{backgroundColor: '#f3ecdc'}}>
    <BrushCanvas paint={paint} paper="#f3ecdc" />
    <Labels />
  </AbsoluteFill>
);

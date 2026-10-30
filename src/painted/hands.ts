import type {Painter, Pt} from './painter';

/** Ink colour of the outlines (same value as WORLD FOG FaceSheet INK; kept local so plates do not import the sheets). */
const INK = '#2b211c';

// Shared painted hand module (S-P07), promoted from the WORLD FOG phone insert (src/painted/spike/WfogPhone.tsx,
// WFOG-PREVIEW-S02-SH02): solid seeded fills (no watercolour border), rotring ink, capsule fingers, two-bone thumb,
// short natural nails, one cel shade. WORLD FOG keeps its phone hand through the primitives and the thumb geometry
// here (decoded-pixel identical, checked in scripts/zombie-condo-paint/build-notes.md); ZCPAINT adds `paintPovHand`,
// a parametric back-of-hand view (left or right, flat to fist) for first-person shots.
// The module draws with a `Painter` (src/painted/painter.ts) in plate pixels; no state between frames.

export type {Pt};

/** Skin and sleeve colours of one hand. */
export type HandTone = {skin: string; shade: string; deep: string; nail: string; crease: string; sleeve: string; sleeveShade: string};
/** WORLD FOG phone hand (slim, neutral skin, knit cuff). */
export const WFOG_HAND: HandTone = {skin: '#e9c2a2', shade: '#d0a283', deep: '#d0a283', nail: '#f4dccd', crease: '#9c6f52', sleeve: '#56625e', sleeveShade: '#47514e'};
/** ZCPAINT `zc-you`: Thai man, skin `#e2b084`, teal tee sleeve (`VD-ZC-CH`). */
export const ZC_HAND: HandTone = {skin: '#e2b084', shade: '#c99468', deep: '#b98257', nail: '#f1d6c2', crease: '#9c6f52', sleeve: '#2f5a5c', sleeveShade: '#24484a'};

/** A closed polygon approximating an ellipse (small p5.brush circles render as squares). */
export const ring = (cx: number, cy: number, rx: number, ry = rx, n = 18): Pt[] => Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.283), cy + ry * Math.sin((i / n) * 6.283)]);

/** A rounded segment a-b, width w0 at a and w1 at b. */
export const capsule = (a: Pt, b: Pt, w0: number, w1: number): Pt[] => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const arc = (c: Pt, r: number, from: number): Pt[] =>
    Array.from({length: 9}, (_, i): Pt => [c[0] + r * Math.cos(from + (Math.PI * i) / 8), c[1] + r * Math.sin(from + (Math.PI * i) / 8)]);
  return [...arc(b, w1 / 2, ang - Math.PI / 2), ...arc(a, w0 / 2, ang + Math.PI / 2)];
};

/** Solid seeded fill (no watercolour border), `n` passes. Seeds are `seed * 16 + pass`, so give each part its own `seed`. */
export const solid = (p: Painter, seed: number, color: string, pts: Pt[], n = 6, texture = 0.06) => {
  const {brush} = p;
  for (let k = 0; k < n; k++) {
    brush.seed(seed * 16 + k);
    brush.noiseSeed(seed * 16 + k);
    brush.noStroke();
    brush.fill(color, 255);
    brush.fillBleed(0);
    brush.fillTexture(texture, 0.15);
    brush.polygon(pts);
    brush.noFill();
  }
};

/** Boiling ink spline through `pts` (closed by default). */
export const inkLine = (p: Painter, id: number, pts: Pt[], w = 1.1, curve = 0.2, closed = true, color = INK) => {
  p.ink(id, 'rotring', color, w);
  p.brush.spline(closed ? [...pts, pts[0]] : pts, curve);
};

/**
 * Two-bone chain from base `B` to tip `T` with bone lengths `bones`; the middle joint bulges to the left of B->T
 * (`bend` +1; the WORLD FOG thumb knuckle bulges right and down), clamped when the tip is out of reach.
 */
export const twoBone = (B: Pt, T: Pt, bones: readonly [number, number], bend: 1 | -1 = 1) => {
  const dx = T[0] - B[0], dy = T[1] - B[1], d = Math.min(Math.hypot(dx, dy), bones[0] + bones[1] - 1);
  const a = Math.atan2(dy, dx) + bend * Math.acos((bones[0] ** 2 + d * d - bones[1] ** 2) / (2 * bones[0] * d));
  const K: Pt = [B[0] + bones[0] * Math.cos(a), B[1] + bones[0] * Math.sin(a)];
  return {B, K, T};
};

/** The thumb outline (proximal + distal segments with a round tip), shared by the paint and any screen mask. */
export const thumbShape = (B: Pt, T: Pt, bones: readonly [number, number], widths: readonly [number, number, number, number], tipR: number) => {
  const {K} = twoBone(B, T, bones);
  return {prox: capsule(B, K, widths[0], widths[1]), dist: capsule(K, T, widths[2], widths[3]), tip: ring(T[0], T[1], tipR), K, T};
};

// ------------------------------------------------------------------ POV hand

/**
 * A back-of-hand view for first-person shots. Local frame: `u` along the fingers, `v` across the hand, +v toward the
 * thumb. `side` +1 is the right hand (thumb to the screen-left when the fingers point up), -1 the left.
 */
export type PovHand = {
  side: -1 | 1;
  /** Seed/ink id base; give each hand its own range of about 60 (`solid` multiplies by 16). */
  base: number;
  /** Wrist centre in plate px. */
  wrist: Pt;
  /** Direction the fingers point, radians (screen: 0 = right, -PI/2 = up). */
  dir: number;
  /** Hand size, 1 = the ZC man's hand (palm 190 px wide, middle finger 150 px). */
  size?: number;
  /** 0 flat open ... 1 fist. */
  curl?: number;
  /** 0 fingers together ... 1 spread. */
  spread?: number;
  /** Thumb tip in local (u, v) units of `size`; default relaxed beside the palm. */
  thumb?: [number, number];
  /** 0..1: palm squeezed flat on impact (fatter by a few percent). */
  press?: number;
  /** Pinch point in local (u, v): the index fingertip lands there (thumb-turn); the thumb tip sits `pinchGap` further along v, so a knob fits between them. */
  pinch?: [number, number];
  /** Visible gap between the index and thumb tips at a pinch, in local v units (the knob sits in it). */
  pinchGap?: number;
  /** Per-finger curl multipliers [index, middle, ring, pinky] (thumb-turn pinch: index and middle stay long). */
  fingerCurl?: [number, number, number, number];
  /** Elbow (plate px); draws the forearm wrist -> elbow, and the sleeve behind it when `sleeveFrom` is set. */
  elbow?: Pt;
  /** Sleeve start (plate px, past the elbow, usually off-frame): teal tee sleeve capsule elbow side. */
  sleeveFrom?: Pt;
  tone?: HandTone;
};

const FINGER_LEN = [135, 150, 140, 112] as const;
const FINGER_W = [44, 46, 45, 40] as const;
const FINGER_V = [0.74, 0.25, -0.25, -0.74] as const;

/** Local (u, v) -> plate px for a hand at `wrist` pointing `dir`. */
const frame = (wrist: Pt, dir: number, side: -1 | 1, s: number) => {
  const fx = Math.cos(dir), fy = Math.sin(dir);
  return (u: number, v: number): Pt => [wrist[0] + (fx * u + side * fy * v) * s, wrist[1] + (fy * u - side * fx * v) * s];
};

/** Paint one hand (and forearm, sleeve) with the WfogPhone construction. Returns anchor points for props. */
export const paintPovHand = (p: Painter, h: PovHand) => {
  const s = h.size ?? 1, curl = h.curl ?? 0, spread = h.spread ?? 0.2, press = h.press ?? 0, tone = h.tone ?? ZC_HAND;
  const {side, base, wrist, dir} = h;
  const P = frame(wrist, dir, side, s);
  const Lp = 150, Wp = 190 * (1 + 0.03 * press);

  // Sleeve, forearm.
  if (h.elbow) {
    if (h.sleeveFrom) {
      const mid: Pt = [h.elbow[0] * 0.5 + h.sleeveFrom[0] * 0.5, h.elbow[1] * 0.5 + h.sleeveFrom[1] * 0.5];
      solid(p, base + 1, tone.sleeve, capsule(h.sleeveFrom, mid, 330 * s, 300 * s));
      const a = Math.atan2(h.sleeveFrom[1] - h.elbow[1], h.sleeveFrom[0] - h.elbow[0]);
      const nx = -Math.sin(a), ny = Math.cos(a);
      solid(p, base + 2, tone.sleeveShade, [[mid[0] + nx * 40, mid[1] + ny * 40], [h.sleeveFrom[0] + nx * 150 * s, h.sleeveFrom[1] + ny * 150 * s], [h.sleeveFrom[0] + nx * 180 * s, h.sleeveFrom[1] + ny * 180 * s], [mid[0] + nx * 150 * s, mid[1] + ny * 150 * s]], 4);
    }
    const arm = capsule(h.elbow, wrist, 150 * s, 128 * s);
    solid(p, base + 3, tone.skin, arm);
    inkLine(p, base + 1, arm, 1.1, 0.2);
  }

  // Back of the hand: tapered palm, one cel shade along the pinky side.
  const palm: Pt[] = [P(0, -Wp * 0.34), P(0, Wp * 0.34), P(Lp * 0.35, Wp * 0.5), P(Lp, Wp * 0.5), P(Lp, -Wp * 0.5), P(Lp * 0.35, -Wp * 0.5)];
  solid(p, base + 5, tone.skin, palm);
  solid(p, base + 6, tone.shade, [P(0, -Wp * 0.34), P(Lp * 0.35, -Wp * 0.5), P(Lp, -Wp * 0.5), P(Lp, -Wp * 0.3), P(Lp * 0.4, -Wp * 0.3), P(0, -Wp * 0.1)], 4);
  inkLine(p, base + 2, palm, 1.1, 0.3);

  // Fingers, pinky first so the index overlaps: projected length shrinks with curl (foreshortening); a fist shows
  // knuckle bumps and no nails.
  const per = h.fingerCurl ?? [1, 1, 1, 1];
  for (let i = 3; i >= 0; i--) {
    const c = Math.min(1, curl * per[i]);
    const total = FINGER_LEN[i], l1 = total * 0.55, l2 = total * 0.45;
    const a1 = c * 1.3, a2 = c * 1.75;
    const reach = Math.max(0.2 * total, l1 * Math.cos(a1) + l2 * Math.cos(a1 + a2));
    const w = FINGER_W[i] * (1 + 0.1 * c);
    const ang = (i - 1.5) * 0.14 * spread * side * -1; // fan out from the middle
    const k0 = P(Lp, Wp * 0.5 * FINGER_V[i] * (0.9 + 0.1 * spread));
    const a = dir + ang;
    const tip: Pt = [k0[0] + Math.cos(a) * reach * s, k0[1] + Math.sin(a) * reach * s];
    if (i === 0 && h.pinch) {
      // Index bent toward the thumb: knuckle -> forward mid joint -> pinch point.
      const target = P(h.pinch[0], h.pinch[1]);
      const mid: Pt = [k0[0] + Math.cos(dir) * total * 0.5 * s + (target[0] - k0[0]) * 0.25, k0[1] + Math.sin(dir) * total * 0.5 * s + (target[1] - k0[1]) * 0.25];
      const a1s = capsule(k0, mid, w * s, w * 0.92 * s), a2s = capsule(mid, target, w * 0.92 * s, w * 0.8 * s);
      solid(p, base + 10, tone.skin, a1s);
      solid(p, base + 11, tone.skin, a2s);
      solid(p, base + 14, tone.shade, ring(mid[0], mid[1], w * 0.3 * s, w * 0.3 * s, 10), 3);
      inkLine(p, base + 10, a1s, 1.0, 0.3);
      inkLine(p, base + 11, a2s, 1.0, 0.3);
      inkLine(p, base + 20, [[mid[0] - w * 0.2 * s, mid[1]], [mid[0] + w * 0.2 * s, mid[1]]], 0.8, 0.4, false, tone.crease);
      continue;
    }
    const shape = capsule(k0, tip, w * s, w * 0.9 * s);
    solid(p, base + 10 + i, tone.skin, shape);
    if (c > 0.5) {
      // Curled over an edge or into the palm: the last part turns away, so it takes the cel shade and loses the nail.
      const t0: Pt = [k0[0] + (tip[0] - k0[0]) * 0.5, k0[1] + (tip[1] - k0[1]) * 0.5];
      solid(p, base + 40 + i, tone.shade, capsule(t0, tip, w * 0.86 * s, w * 0.8 * s), 4);
    }
    if (c > 0.35) {
      const kn = ring(k0[0], k0[1], w * 0.52 * s, w * 0.46 * s, 12);
      solid(p, base + 14 + i, tone.skin, kn, 3);
      inkLine(p, base + 14 + i, kn, 0.9, 0.4);
    }
    if (c < 0.6) solid(p, base + 20 + i, tone.nail, ring(tip[0] - Math.cos(a) * w * 0.22 * s, tip[1] - Math.sin(a) * w * 0.22 * s, w * 0.3 * s, w * 0.36 * s, 12), 4, 0.02);
    inkLine(p, base + 10 + i, shape, 1.0, 0.3);
    if (c <= 0.5) inkLine(p, base + 20 + i, [P(Lp - 24, Wp * 0.5 * FINGER_V[i] - w * 0.24), P(Lp - 24, Wp * 0.5 * FINGER_V[i] + w * 0.24)], 0.8, 0.4, false, tone.crease);
  }

  // Thumb: two bones from the heel of the thumb; the joint bulges outward.
  const tu: [number, number] = h.pinch ? [h.pinch[0], h.pinch[1] + (h.pinchGap ?? 0)] : h.thumb ?? [Lp * 0.62, Wp * 0.86];
  const B = P(Lp * 0.18, Wp * 0.42), T = P(tu[0], tu[1]);
  const {K} = twoBone(B, T, [64 * s, 58 * s], side === 1 ? -1 : 1);
  const thumb = [capsule(B, K, 62 * s, 52 * s), capsule(K, T, 52 * s, 46 * s)];
  thumb.forEach((sh, i) => solid(p, base + 30 + i, tone.skin, sh));
  solid(p, base + 32, tone.deep, [[K[0], K[1] + 18 * s], [T[0], T[1] + 16 * s], [T[0], T[1] + 6 * s], [K[0], K[1] + 8 * s]], 3);
  solid(p, base + 33, tone.nail, ring(T[0] + side * 4, T[1] - 4 * s, 15 * s, 12 * s, 12), 4, 0.02);
  thumb.forEach((sh, i) => inkLine(p, base + 34 + i, sh, 1.0, 0.3));

  const mid = P(Lp, 0);
  return {wrist, knuckles: mid, thumbTip: T, palmCentre: P(Lp * 0.5, 0), indexTip: h.pinch ? P(h.pinch[0], h.pinch[1]) : undefined};
};

/** A hand hooked over a cabinet's front lip: knuckles on the top face, the fingers turn over the lip and their tips hang
 * down the front face (drawn after the cabinet, so the tips are in front of it). Left or right by `side`. */
export type EdgeGrip = {
  base: number;
  tone: HandTone;
  /** Forearm: elbow and wrist in plate px; the sleeve is drawn from `sleeveFrom` (off-frame) to the elbow. */
  elbow?: Pt;
  sleeveFrom?: Pt;
  wrist: Pt;
  /** Four knuckle points on the top face, behind the lip (index first). */
  knuckles: Pt[];
  /** Four points on the lip where each finger turns over. */
  lip: Pt[];
  /** Four fingertip points down the front face. */
  tips: Pt[];
  /** Thumb base and tip on the end of the cabinet. */
  thumb: {base: Pt; tip: Pt};
  /** Finger width in px. */
  width?: number;
  /** Size factor for the palm, thumb, forearm and sleeve widths and the finger width (1 = the grip sheet). */
  scale?: number;
};
export const paintEdgeGrip = (p: Painter, h: EdgeGrip) => {
  const {base, tone} = h, k = h.scale ?? 1, w = (h.width ?? 42) * k;
  if (h.elbow) {
    const sleeve = capsule(h.sleeveFrom ?? [h.elbow[0], h.elbow[1] - 200], h.elbow, 300 * k, 280 * k);
    solid(p, base, tone.sleeve, sleeve);
    const arm = capsule(h.elbow, h.wrist, 110 * k, 96 * k);
    solid(p, base + 1, tone.skin, arm);
    inkLine(p, base + 1, arm, 1.1, 0.2);
  }
  // Back of the hand, from the wrist to the knuckles.
  const palm: Pt[] = [[h.wrist[0] - 62 * k, h.wrist[1]], [h.wrist[0] + 62 * k, h.wrist[1]], h.knuckles[3], h.knuckles[0]];
  solid(p, base + 2, tone.skin, palm);
  solid(p, base + 3, tone.shade, [[h.wrist[0] + 30 * k, h.wrist[1]], [h.wrist[0] + 62 * k, h.wrist[1]], h.knuckles[3], h.knuckles[2]], 3);
  inkLine(p, base + 2, palm, 1.1, 0.3);
  for (let i = 0; i < 4; i++) {
    const K = h.knuckles[i], L = h.lip[i], T = h.tips[i];
    // Upper segment: knuckle to the lip, on the top face.
    const up = capsule(K, L, w, w * 0.92);
    solid(p, base + 10 + i, tone.skin, up);
    inkLine(p, base + 10 + i, up, 1.0, 0.3);
    // Lower segment: over the lip and down the front face, in front of it; the cel shade on the turned part.
    const down = capsule(L, T, w * 0.9, w * 0.8);
    solid(p, base + 20 + i, tone.skin, down);
    solid(p, base + 30 + i, tone.shade, capsule([(L[0] + T[0]) / 2, (L[1] + T[1]) / 2], T, w * 0.86, w * 0.8), 4);
    inkLine(p, base + 20 + i, down, 1.0, 0.3);
    solid(p, base + 40 + i, tone.nail, ring(T[0], T[1] + 6, w * 0.22, w * 0.26, 10), 4, 0.02);
  }
  // Thumb on the end of the cabinet: two bones from the base to the tip, one shade.
  const {B, T} = {B: h.thumb.base, T: h.thumb.tip};
  const th = capsule(B, T, 56 * k, 44 * k);
  solid(p, base + 50, tone.skin, th);
  inkLine(p, base + 50, th, 1.0, 0.3);
};

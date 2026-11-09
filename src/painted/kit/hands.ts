import {mixColor, type Painter, type Pt} from './painter';
import {hardFill, solid as drawSolid} from './draw';
import {add3, scale3, sub3, type V3} from './space';
import {camPoint, camSpace, type YCam} from './ycam';
import {hash} from './hash';

/** Ink colour of the outlines (same value as WORLD FOG FaceSheet INK; kept local so plates do not import the sheets). */
const INK = '#2b211c';

// Shared painted hand module (S-P07), promoted from the WORLD FOG phone insert (src/painted/spike/WfogPhone.tsx,
// WFOG-PREVIEW-S02-SH02): solid seeded fills (no watercolour border), rotring ink, capsule fingers, two-bone thumb,
// short natural nails, one cel shade. WORLD FOG keeps its phone hand through the primitives and the thumb geometry
// here (decoded-pixel identical, checked in scripts/zombie-condo-paint/build-notes.md); ZCPAINT adds `paintPovHand`,
// a parametric back-of-hand view (left or right, flat to fist) for first-person shots.
// The module draws with a `Painter` (src/painted/painter.ts) in plate pixels; no state between frames.

export type {Pt};

/** Skin and sleeve colours of one hand. Episodes keep their own tones (WFOG_HAND in worldfog/hand.ts, ZC_HAND in zcpaint/hand.ts) and pass them in. */
export type HandTone = {skin: string; shade: string; deep: string; nail: string; crease: string; sleeve: string; sleeveShade: string};
/** Fallback tone when a hand gets none: medium skin, teal sleeve (the values ZCPAINT used as its default, so pixels are unchanged). */
export const DEFAULT_HAND_TONE: HandTone = {skin: '#e2b084', shade: '#c99468', deep: '#b98257', nail: '#f1d6c2', crease: '#9c6f52', sleeve: '#2f5a5c', sleeveShade: '#24484a'};

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
  /** Opt in to perspective: scale the near elbow width, retaining the existing wrist width. */
  forearmElbowScale?: number;
  /** Fraction from wrist to elbow at which the long-sleeve cuff begins; default .32. */
  sleeveCuffFraction?: number;
  /** Use crisp opaque foreground fills for this hand only. */
  crispFill?: boolean;
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

/** Wrist solving the same knuckle-centre anchor returned by paintPovHand. */
export const wristAtKnuckles = (knuckles: Pt, dir: number, size: number): Pt =>
  [knuckles[0] - Math.cos(dir) * 150 * size, knuckles[1] - Math.sin(dir) * 150 * size];

/** Paint one hand (and forearm, sleeve) with the WfogPhone construction. Returns anchor points for props. */
export const paintPovHand = (p: Painter, h: PovHand) => {
  const s = h.size ?? 1, curl = h.curl ?? 0, spread = h.spread ?? 0.2, press = h.press ?? 0, tone = h.tone ?? DEFAULT_HAND_TONE;
  const {side, base, wrist, dir} = h;
  const fillHand: typeof solid = h.crispFill ? (painter, seed, color, points) => hardFill(painter, seed, color, points) : solid;
  const P = frame(wrist, dir, side, s);
  const Lp = 150, Wp = 190 * (1 + 0.03 * press);

  // Sleeve, forearm.
  if (h.elbow) {
    if (h.sleeveFrom && h.forearmElbowScale === undefined) {
      const mid: Pt = [h.elbow[0] * 0.5 + h.sleeveFrom[0] * 0.5, h.elbow[1] * 0.5 + h.sleeveFrom[1] * 0.5];
      fillHand(p, base + 1, tone.sleeve, capsule(h.sleeveFrom, mid, 330 * s, 300 * s));
      const a = Math.atan2(h.sleeveFrom[1] - h.elbow[1], h.sleeveFrom[0] - h.elbow[0]);
      const nx = -Math.sin(a), ny = Math.cos(a);
      fillHand(p, base + 2, tone.sleeveShade, [[mid[0] + nx * 40, mid[1] + ny * 40], [h.sleeveFrom[0] + nx * 150 * s, h.sleeveFrom[1] + ny * 150 * s], [h.sleeveFrom[0] + nx * 180 * s, h.sleeveFrom[1] + ny * 180 * s], [mid[0] + nx * 150 * s, mid[1] + ny * 150 * s]], 4);
    }
    const cuffFraction = h.sleeveCuffFraction ?? .32;
    const armEnd: Pt = h.forearmElbowScale === undefined ? h.elbow : [wrist[0] + (h.elbow[0] - wrist[0]) * cuffFraction, wrist[1] + (h.elbow[1] - wrist[1]) * cuffFraction];
    const armWidth = h.forearmElbowScale === undefined ? 150 * s : (128 + (150 * h.forearmElbowScale - 128) * cuffFraction) * s;
    const arm = capsule(armEnd, wrist, armWidth, 128 * s);
    fillHand(p, base + 3, tone.skin, arm);
    inkLine(p, base + 1, arm, 1.1, 0.2);
    if (h.sleeveFrom && h.forearmElbowScale !== undefined) {
      // Long sleeve overlaps the arm: the cuff is nearer the wrist than the elbow.
      const t = cuffFraction, scale = h.forearmElbowScale;
      const cuff: Pt = [wrist[0] + (h.elbow[0] - wrist[0]) * t, wrist[1] + (h.elbow[1] - wrist[1]) * t];
      const cuffWidth = (128 + (150 * scale - 128) * t) * s * 1.12;
      fillHand(p, base + 1, tone.sleeve, capsule(h.sleeveFrom, cuff, 180 * s * scale, cuffWidth));
      const a = Math.atan2(h.sleeveFrom[1] - cuff[1], h.sleeveFrom[0] - cuff[0]);
      const nx = -Math.sin(a), ny = Math.cos(a);
      inkLine(p, base + 3, [[cuff[0] - nx * cuffWidth / 2, cuff[1] - ny * cuffWidth / 2], [cuff[0] + nx * cuffWidth / 2, cuff[1] + ny * cuffWidth / 2]], 1.1, .2, false, tone.sleeveShade);
    }
  }

  // Back of the hand: tapered palm, one cel shade along the pinky side.
  const palm: Pt[] = [P(0, -Wp * 0.34), P(0, Wp * 0.34), P(Lp * 0.35, Wp * 0.5), P(Lp, Wp * 0.5), P(Lp, -Wp * 0.5), P(Lp * 0.35, -Wp * 0.5)];
  fillHand(p, base + 5, tone.skin, palm);
  fillHand(p, base + 6, tone.shade, [P(0, -Wp * 0.34), P(Lp * 0.35, -Wp * 0.5), P(Lp, -Wp * 0.5), P(Lp, -Wp * 0.3), P(Lp * 0.4, -Wp * 0.3), P(0, -Wp * 0.1)], 4);
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
      fillHand(p, base + 10, tone.skin, a1s);
      fillHand(p, base + 11, tone.skin, a2s);
      fillHand(p, base + 14, tone.shade, ring(mid[0], mid[1], w * 0.3 * s, w * 0.3 * s, 10), 3);
      inkLine(p, base + 10, a1s, 1.0, 0.3);
      inkLine(p, base + 11, a2s, 1.0, 0.3);
      inkLine(p, base + 20, [[mid[0] - w * 0.2 * s, mid[1]], [mid[0] + w * 0.2 * s, mid[1]]], 0.8, 0.4, false, tone.crease);
      continue;
    }
    const shape = capsule(k0, tip, w * s, w * 0.9 * s);
    fillHand(p, base + 10 + i, tone.skin, shape);
    if (c > 0.5) {
      // Curled over an edge or into the palm: the last part turns away, so it takes the cel shade and loses the nail.
      const t0: Pt = [k0[0] + (tip[0] - k0[0]) * 0.5, k0[1] + (tip[1] - k0[1]) * 0.5];
      fillHand(p, base + 40 + i, tone.shade, capsule(t0, tip, w * 0.86 * s, w * 0.8 * s), 4);
    }
    if (c > 0.35) {
      const kn = ring(k0[0], k0[1], w * 0.52 * s, w * 0.46 * s, 12);
      fillHand(p, base + 14 + i, tone.skin, kn, 3);
      inkLine(p, base + 14 + i, kn, 0.9, 0.4);
    }
    if (c < 0.6) fillHand(p, base + 20 + i, tone.nail, ring(tip[0] - Math.cos(a) * w * 0.22 * s, tip[1] - Math.sin(a) * w * 0.22 * s, w * 0.3 * s, w * 0.36 * s, 12), 4, 0.02);
    inkLine(p, base + 10 + i, shape, 1.0, 0.3);
    if (c <= 0.5) inkLine(p, base + 20 + i, [P(Lp - 24, Wp * 0.5 * FINGER_V[i] - w * 0.24), P(Lp - 24, Wp * 0.5 * FINGER_V[i] + w * 0.24)], 0.8, 0.4, false, tone.crease);
  }

  // Thumb: two bones from the heel of the thumb; the joint bulges outward.
  const tu: [number, number] = h.pinch ? [h.pinch[0], h.pinch[1] + (h.pinchGap ?? 0)] : h.thumb ?? [Lp * 0.62, Wp * 0.86];
  const B = P(Lp * 0.18, Wp * 0.42), T = P(tu[0], tu[1]);
  const {K} = twoBone(B, T, [64 * s, 58 * s], side === 1 ? -1 : 1);
  const thumb = [capsule(B, K, 62 * s, 52 * s), capsule(K, T, 52 * s, 46 * s)];
  thumb.forEach((sh, i) => fillHand(p, base + 30 + i, tone.skin, sh));
  fillHand(p, base + 32, tone.deep, [[K[0], K[1] + 18 * s], [T[0], T[1] + 16 * s], [T[0], T[1] + 6 * s], [K[0], K[1] + 8 * s]], 3);
  fillHand(p, base + 33, tone.nail, ring(T[0] + side * 4, T[1] - 4 * s, 15 * s, 12 * s, 12), 4, 0.02);
  thumb.forEach((sh, i) => inkLine(p, base + 34 + i, sh, 1.0, 0.3));

  const mid = P(Lp, 0);
  return {wrist, knuckles: mid, thumbTip: T, palmCentre: P(Lp * 0.5, 0), indexTip: h.pinch ? P(h.pinch[0], h.pinch[1]) : undefined};
};

// ---------------------------------------------------------------------------------------------------------------- visitor hand
// `new: visitor-hand` (EDU-EP06 N6; Boss W5.2, 2026-11-07): a stranger's forearm and open hand for a cutaway ("not hers" in one second): a
// denim cuff, a wristwatch on the wrist and a skin tone that is a parameter (default lighter than the EP06 owner's deep brown). It is
// `paintPovHand` with the long-sleeve forearm (cuff nearer the wrist) plus the watch; no face, no text. Hold it still: the pose is a pure
// function of its arguments, so a still hand has no drift.
export type VisitorSkin = 'light' | 'medium' | 'deep';
const VISITOR_SKIN: Record<VisitorSkin, Pick<HandTone, 'skin' | 'shade' | 'deep' | 'nail' | 'crease'>> = {
  light: {skin: '#f0cdb0', shade: '#d9ad8c', deep: '#c9987a', nail: '#f6e0d2', crease: '#b08868'},
  medium: {skin: '#e2b084', shade: '#c99468', deep: '#b98257', nail: '#f1d6c2', crease: '#9c6f52'},
  deep: {skin: '#a8714a', shade: '#8a5a3a', deep: '#744a2e', nail: '#d8b8a0', crease: '#5a3822'},
};
export const visitorTone = (skin: VisitorSkin | HandTone = 'light'): HandTone =>
  typeof skin === 'string' ? {...VISITOR_SKIN[skin], sleeve: '#46648a', sleeveShade: '#34506f'} : skin;

export type VisitorHand = {
  /** Seed/ink id base (about 80 ids are used). */
  base: number;
  /** Wrist centre in plate px and the direction the fingers point (radians; screen: 0 right, -PI/2 up). */
  wrist: Pt; dir: number;
  side?: -1 | 1; size?: number; curl?: number; spread?: number;
  /** Skin: a named tone or a full `HandTone` (its sleeve colours are then the cuff). Default 'light'. */
  skin?: VisitorSkin | HandTone;
  /** Wristwatch (default true). */
  watch?: boolean;
};

export const paintVisitorHand = (p: Painter, h: VisitorHand) => {
  const s = h.size ?? 1, tone = visitorTone(h.skin), fx = Math.cos(h.dir), fy = Math.sin(h.dir), nx = -fy, ny = fx;
  const back = (d: number): Pt => [h.wrist[0] - fx * d * s, h.wrist[1] - fy * d * s];
  const anchors = paintPovHand(p, {
    base: h.base, side: h.side ?? 1, wrist: h.wrist, dir: h.dir, size: s, curl: h.curl ?? 0.12, spread: h.spread ?? 0.22, tone, crispFill: true,
    elbow: back(520), sleeveFrom: back(1100), forearmElbowScale: 1.3, sleeveCuffFraction: 0.3,
  });
  // cuff band: a lighter, slightly wider band at the sleeve edge, with a stitch line
  const cuffAt = back(520 * 0.3), cw = (128 + (150 * 1.3 - 128) * 0.3) * s * 1.12;
  const band = capsule(cuffAt, back(520 * 0.3 + 46), cw * 0.98, cw);
  hardFill(p, h.base + 60, '#5876a0', band);
  inkLine(p, h.base + 61, band, 1.0, 0.2, true, tone.sleeveShade);
  const wc = back(78);
  if (h.watch !== false) {
    // strap across the wrist, case and dial on the back of it
    const sw = 138 * s, st = 30 * s, a: Pt = [wc[0] + nx * sw / 2, wc[1] + ny * sw / 2], b: Pt = [wc[0] - nx * sw / 2, wc[1] - ny * sw / 2];
    const strap: Pt[] = [a, b, [b[0] - fx * st, b[1] - fy * st], [a[0] - fx * st, a[1] - fy * st]].map(([x, y]): Pt => [x + fx * st * 0.5, y + fy * st * 0.5]);
    hardFill(p, h.base + 62, '#2a2d33', strap);
    inkLine(p, h.base + 62, strap, 0.9, 0.1, true, '#15171b');
    const cr = 38 * s;
    hardFill(p, h.base + 63, '#b7bdc6', ring(wc[0], wc[1], cr, cr, 20));
    inkLine(p, h.base + 63, ring(wc[0], wc[1], cr, cr, 20), 1.0, 0.1, true, '#4a4f58');
    hardFill(p, h.base + 64, '#20242b', ring(wc[0], wc[1], cr * 0.78, cr * 0.78, 20));
    inkLine(p, h.base + 65, [wc, [wc[0] + cr * 0.5 * Math.cos(-1.9), wc[1] + cr * 0.5 * Math.sin(-1.9)]], 1.4, 0, false, '#e8e4dc');
    inkLine(p, h.base + 66, [wc, [wc[0] + cr * 0.62 * Math.cos(0.2), wc[1] + cr * 0.62 * Math.sin(0.2)]], 1.0, 0, false, '#e8e4dc');
  }
  return {...anchors, watch: wc, cuff: cuffAt};
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

// ---------------------------------------------------------------------------------------------------------------- hand macro
// `new: hand-macro` (EDU-EP09 N1, VD05; Boss W3, 2026-11-08). UT14 exception at macro scale only (user Q-F1): a true 3D skeletal hand
// with five separate fingers, for shots whose action is the fingers; body-scale rig hands stay mittens. The skeleton is posed by
// joint angles in the shot's own units (set-cm for HAND-CLOSE, metres for a dining shot through `unit`), projected joint by joint
// through the shot's `YCam` and painted with the kit's crisp fills: one capsule per phalanx, one ink line round each finger, one cel
// shade, short nails, two crease strokes per knuckle. Fingers are depth-sorted as groups (a finger folded under the palm is drawn
// before the palm), `order` overrides the sort (crossed fingers), fingertip and palm shadows fall on a named plane, a deterministic
// tremble moves one finger, `skinAlpha` makes the skin see-through. Pure function of its arguments and the painter clock.
//
// Hand frame (fingers along -z, up +y at yaw/pitch/roll 0), all lengths in cm x `size` x `unit`: the left hand has its thumb toward +x, the
// right hand toward -x (`side` -1 / +1 as `PovHand`). `yaw` turns the fingers toward +x, `pitch` raises them (negative lowers), `roll`
// raises the +x side. Joint angles are RELATIVE per joint, degrees, + flexes toward the palm (down for a palm-down hand), - extends (lift).

export type FingerId = 'thumb' | 'index' | 'middle' | 'ring' | 'little';
export type LongFingerId = Exclude<FingerId, 'thumb'>;
export const FINGER_IDS: readonly FingerId[] = ['thumb', 'index', 'middle', 'ring', 'little'];
/** mcp/pip/dip flexion in degrees; `abd` adds to the finger's natural splay (+ spreads away from the middle finger). */
export type FingerPose = {mcp: number; pip: number; dip: number; abd?: number};
/** cmc flexes the metacarpal down, cmcAbd swings it away from the palm (in the palm plane), mcp and ip flex the two phalanges. */
export type ThumbPose = {cmc: number; cmcAbd: number; mcp: number; ip: number};
export type MacroTone = HandTone & {spots?: string};
/** Hand tones from the EP09 brief colour table (the pianist uses `DEFAULT_HAND_TONE`). */
export const MACRO_TONES: Record<'boy' | 'elder' | 'generic', MacroTone> = {
  boy: {skin: '#f0c29a', shade: '#d9a073', deep: '#c48c62', nail: '#f6dcc8', crease: '#a8724f', sleeve: '#f4f4f0', sleeveShade: '#d8d8d2'},
  elder: {skin: '#d9a77c', shade: '#b98257', deep: '#a67048', nail: '#ead2bd', crease: '#8f5f40', sleeve: '#7a5638', sleeveShade: '#5f432b', spots: '#b07a55'},
  generic: {...DEFAULT_HAND_TONE, sleeve: '#2f3542', sleeveShade: '#242a35'},
};

export type HandMacro = {
  side: 1 | -1;
  /** Seed/ink id base; the hand uses ids base .. base + 230 (give each hand its own range of 240). */
  base: number;
  /** Hand scale: 1 = BOY (middle finger 7.2 cm), 1.25 = ELDER, 1.2 = pianist. */
  size?: number;
  /** World units per cm (default 1: set-cm; use 0.01 for a metre set). Wrist, `plane`, `elbow` and lifts are in world units. */
  unit?: number;
  tone?: MacroTone;
  /** Skin opacity 0..1 (0.28 = see-through for the diagram). Outline and nails keep the same opacity multiplier x 1 (ink fades by mixing). */
  skinAlpha?: number;
  /** Crisp opaque fills (default true); false = the kit's seeded textured fill. */
  crisp?: boolean;
  /** R3e: 'classic' (default, the bfa78a5 macro palm/forearm/phalanges) or 'pianist' (R3 domed hand, banded forearm, fuller phalanges; the dining set's hands). */
  look?: 'classic' | 'pianist';
  /** Wrist centre, degrees of orientation (see above). */
  wrist: V3; yaw: number; pitch: number; roll: number;
  fingers: Record<LongFingerId, FingerPose>; thumb: ThumbPose;
  /** Explicit back-to-front order of the finger groups (C25 crossing); fingers not listed keep their depth order, in front of the listed ones. */
  order?: FingerId[];
  /** Contact plane height (world y) and the light's travel direction, for the fingertip and palm shadows (omit `plane` = no shadows). */
  plane?: number; shadowDir?: V3; shadowColor?: string; shadowAlpha?: number;
  /** One finger trembles: `amp` is the tip lift amplitude (world units), `hz` the rate; hash-seeded on the painter clock, so a seek repeats it. */
  tremble?: {finger: LongFingerId; amp: number; hz: number};
  /** 0..1 per finger: skin tightening over the knuckles (the two crease strokes straighten). */
  strain?: Partial<Record<FingerId, number>>;
  /** Forearm end (world units): draws a forearm from the wrist; `sleeve` covers it from the cuff (fraction of wrist -> elbow, default 0.5) out to `to`. */
  elbow?: V3;
  sleeve?: {to: V3; color: string; shade?: string; cuff?: number};
};

const D2R = Math.PI / 180;
const LONG: readonly LongFingerId[] = ['index', 'middle', 'ring', 'little'];
// cm at size 1: MCP lateral `v` (toward the thumb) and forward `f` from the wrist centre, length MCP -> tip, width, natural splay (deg), splay side.
const FSPEC: Record<LongFingerId, {v: number; f: number; len: number; w: number; abd: number; sgn: 1 | -1}> = {
  index: {v: 1.45, f: 6.4, len: 6.48, w: 1.55, abd: 4, sgn: 1},
  middle: {v: -0.3, f: 6.5, len: 7.2, w: 1.7, abd: 0, sgn: 1},
  ring: {v: -2.0, f: 6.25, len: 6.72, w: 1.6, abd: 4, sgn: -1},
  little: {v: -3.6, f: 5.7, len: 4.7, w: 1.4, abd: 9, sgn: -1},
};
// Proportions (plan-view pass, 8 Nov 2026): wrist -> middle MCP 6.5 cm for a 6.0 cm middle finger (0.92), palm about 6.5 cm wide, wrist 4.5 cm, finger widths 1.4-1.7 cm with a slight splay so gaps show, little tip near the ring's DIP crease, ring >= index.
// Phalanx share of the finger length per finger (proximal/middle/distal). User pick L3 then L4 (+20 %), 9 Nov 2026 ("longer still, every redraw looks the same length"): index, middle and ring 0.28/0.45/0.27 on a length +20 % (5.4/6.0/5.6 -> 6.48/7.2/6.72 cm, palm unchanged) so the middle phalanx reads long; the little finger keeps the measured 0.32/0.35/0.34 on 4.7 cm.
const SPLIT: Record<LongFingerId, readonly [number, number, number]> = {
  index: [0.28, 0.45, 0.27], middle: [0.28, 0.45, 0.27], ring: [0.28, 0.45, 0.27], little: [0.32, 0.35, 0.34],
};
const TAPER = [1, 0.97, 0.94, 0.9] as const;
const THUMB_SPEC = {cmc: [1.2, 1.4, -0.16] as const, len: [2.6, 2.0, 1.8] as const, w: [2.4, 2.0, 1.8, 1.65] as const, twist: 50, nailW: 0.9, nailL: 0.8};
// Thumb pass (8 Nov 2026, Boat thumb-compare): base width 1.85 -> 2.4 (thenar), MCP 2.0, IP 1.8, tip 1.65 (old 1.65/1.5/1.4 was 0.76 of the index); nail 0.9 x 0.8 cm turned 50 deg out of the fingers' nail plane.
// Back of the hand outline (v toward the thumb, f forward; cm at size 1), wrist edge first.
const PALM: readonly (readonly [number, number])[] = [[2.2, 0], [2.95, 1.5], [3.45, 3.0], [3.1, 4.2], [2.55, 5.0], [2.2, 5.6], [2.1, 6.1], [1.45, 6.4], [-0.3, 6.5], [-2.0, 6.25], [-3.6, 5.7], [-4.2, 5.0], [-4.1, 2.6], [-2.6, 0]];

const PALM_FRONT = PALM.findIndex(([v, f]) => v === 1.45 && f === 6.4); // the index-knuckle vertex: the thumb-side edge (thenar and web) runs before it

const rotateHand = ([x0, y0, z0]: V3, yaw: number, pitch: number, roll: number): V3 => {
  const cr = Math.cos(roll), sr = Math.sin(roll), cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x1 = x0 * cr - y0 * sr, y1 = x0 * sr + y0 * cr;
  const y2 = y1 * cp - z0 * sp, z2 = y1 * sp + z0 * cp;
  return [x1 * cy - z2 * sy, y2, x1 * sy + z2 * cy];
};
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export type Anchor = {w: V3; p: Pt | null};
/** One finger chain: `mcp`, `pip`, `dip`, `tip` joint centres (the thumb: cmc, mcp, ip, tip), the pad (the underside of the tip), the dorsal (nail-side) direction at the tip, tip radius and the gap between the tip's lowest point and `plane`. */
export type FingerAnchors = {mcp: Anchor; pip: Anchor; dip: Anchor; tip: Anchor; pad: Anchor; dorsal: V3; tipRadius: number; gap: number | null};
export type HandAnchors = {
  wrist: Anchor;
  /** Back of the hand: centre and the unit normal (out of the back of the hand). */
  palm: Anchor & {normal: V3};
  fingers: Record<FingerId, FingerAnchors>;
  elbow: Anchor | null;
  /** Forward and lateral (toward the thumb) unit vectors of the hand frame, world. */
  forward: V3; toThumb: V3;
};

/** The posed skeleton, world units: joints [base, 1, 2, tip] per finger, their radii, dorsal normals per segment, palm outline and axes. No painter, no camera. */
export const macroSkeleton = (h: HandMacro, t = 0) => {
  const S = (h.size ?? 1) * (h.unit ?? 1), tdir = -h.side;
  const yaw = h.yaw * D2R, pitch = h.pitch * D2R, roll = h.roll * D2R;
  const R = (v: V3): V3 => rotateHand(v, yaw, pitch, roll);
  const at = (v: number, y: number, f: number): V3 => add3(h.wrist, scale3(R([tdir * v, y, -f]), S));
  const forward = R([0, 0, -1]), up = R([0, 1, 0]), toThumb = R([tdir, 0, 0]);
  const chain = (origin: V3, heading: V3, lens: readonly number[], rads: readonly number[], flex: number[], twist = 0) => {
    const joints: V3[] = [origin], dorsal: V3[] = [];
    let cum = 0;
    for (let k = 0; k < 3; k++) {
      cum += flex[k] * D2R;
      const dl: V3 = [heading[0] * Math.cos(cum), -Math.sin(cum) + heading[1] * Math.cos(cum), heading[2] * Math.cos(cum)];
      let nl: V3 = [heading[0] * Math.sin(cum), Math.cos(cum) + heading[1] * Math.sin(cum), heading[2] * Math.sin(cum)];
      if (twist) nl = norm3([nl[0] * Math.cos(twist) + tdir * Math.sin(twist), nl[1] * Math.cos(twist), nl[2] * Math.cos(twist)]);
      joints.push(add3(joints[k], scale3(R(dl), lens[k] * S)));
      dorsal.push(R(nl));
    }
    return {joints, dorsal, radii: rads.map((r) => r * S)};
  };
  const out = {} as Record<FingerId, {joints: V3[]; dorsal: V3[]; radii: number[]}>;
  for (const id of LONG) {
    const sp = FSPEC[id], fp = h.fingers[id];
    let mcp = fp.mcp;
    if (h.tremble?.finger === id) {
      const ph = t * h.tremble.hz, i = Math.floor(ph), fr = ph - i, e = fr * fr * (3 - 2 * fr);
      const n = 2 * ((1 - e) * hash(i * 7 + 3) + e * hash((i + 1) * 7 + 3)) - 1;
      mcp -= ((h.tremble.amp * n) / (sp.len * S)) / D2R;
    }
    const abd = (sp.abd + (fp.abd ?? 0)) * D2R;
    const heading: V3 = [tdir * sp.sgn * Math.sin(abd), 0, -Math.cos(abd)];
    out[id] = chain(at(sp.v, 0, sp.f), heading, SPLIT[id].map((s) => s * sp.len), TAPER.map((k) => (k * sp.w) / 2), [mcp, fp.pip, fp.dip]);
  }
  const tp = h.thumb, ab = tp.cmcAbd * D2R;
  out.thumb = chain(at(THUMB_SPEC.cmc[0], THUMB_SPEC.cmc[2], THUMB_SPEC.cmc[1]), [tdir * Math.sin(ab), 0, -Math.cos(ab)], THUMB_SPEC.len, THUMB_SPEC.w.map((w) => w / 2), [tp.cmc, tp.mcp, tp.ip], THUMB_SPEC.twist * D2R);
  const palm = PALM.map(([v, f]) => at(v, 0, f));
  const wrist = h.wrist;
  const palmCentre = at(-0.8, 0, 3.3);
  return {fingers: out, palm, palmCentre, wrist, normal: up, forward, toThumb, S, tdir, at, R};
};

type Sk = ReturnType<typeof macroSkeleton>;

const anchorOf = (cam: YCam, w: V3): Anchor => ({w, p: camPoint(cam, w)});

/** Anchors of a posed hand through a camera (no painting): the same numbers `paintHandMacro` returns. */
export const macroAnchors = (cam: YCam, h: HandMacro, t = 0, sk: Sk = macroSkeleton(h, t)): HandAnchors => {
  const fingers = {} as Record<FingerId, FingerAnchors>;
  for (const id of FINGER_IDS) {
    const c = sk.fingers[id], tip = c.joints[3], r = c.radii[3];
    const dorsal = c.dorsal[2];
    fingers[id] = {
      mcp: anchorOf(cam, c.joints[0]), pip: anchorOf(cam, c.joints[1]), dip: anchorOf(cam, c.joints[2]), tip: anchorOf(cam, tip),
      pad: anchorOf(cam, sub3(tip, scale3(dorsal, r))), dorsal, tipRadius: r,
      gap: h.plane === undefined ? null : Math.min(tip[1] - r, c.joints[2][1] - c.radii[2]) - h.plane,
    };
  }
  return {wrist: anchorOf(cam, h.wrist), palm: {...anchorOf(cam, sk.palmCentre), normal: sk.normal}, fingers, elbow: h.elbow ? anchorOf(cam, h.elbow) : null, forward: sk.forward, toThumb: sk.toThumb};
};

/** Raise (`rise` > 0) or lower one finger's tip by `rise` world units by solving its first joint (the thumb: cmc); the other joints keep their angles. Returns a new hand. */
export const liftFinger = (h: HandMacro, finger: FingerId, rise: number): HandMacro => {
  if (!rise) return h;
  const tipY = (hh: HandMacro) => macroSkeleton(hh).fingers[finger].joints[3][1];
  const set = (a: number): HandMacro => finger === 'thumb' ? {...h, thumb: {...h.thumb, cmc: a}} : {...h, fingers: {...h.fingers, [finger]: {...h.fingers[finger as LongFingerId], mcp: a}}};
  const a0 = finger === 'thumb' ? h.thumb.cmc : h.fingers[finger as LongFingerId].mcp, y0 = tipY(h);
  // The tip height falls with flexion over the usable range: bisect on [a0 - 90, a0 + 45].
  let lo = a0 - 90, hi = a0 + 45;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (tipY(set(mid)) > y0 + rise) lo = mid; else hi = mid;
  }
  return set((lo + hi) / 2);
};

/** Blend two hands' joint angles, wrist and orientation (numeric, eased by the caller: a track, never a string switch mid-rise). */
export const blendHand = (a: HandMacro, b: HandMacro, u: number): HandMacro => {
  const m = (x: number, y: number) => x + (y - x) * u;
  const fingers = {} as Record<LongFingerId, FingerPose>;
  for (const id of LONG) fingers[id] = {mcp: m(a.fingers[id].mcp, b.fingers[id].mcp), pip: m(a.fingers[id].pip, b.fingers[id].pip), dip: m(a.fingers[id].dip, b.fingers[id].dip), abd: m(a.fingers[id].abd ?? 0, b.fingers[id].abd ?? 0)};
  return {
    ...a, fingers, thumb: {cmc: m(a.thumb.cmc, b.thumb.cmc), cmcAbd: m(a.thumb.cmcAbd, b.thumb.cmcAbd), mcp: m(a.thumb.mcp, b.thumb.mcp), ip: m(a.thumb.ip, b.thumb.ip)},
    wrist: [m(a.wrist[0], b.wrist[0]), m(a.wrist[1], b.wrist[1]), m(a.wrist[2], b.wrist[2])], yaw: m(a.yaw, b.yaw), pitch: m(a.pitch, b.pitch), roll: m(a.roll, b.roll),
  };
};

// ---- screen-space outline of a tube (finger, forearm, sleeve)
type Dir2 = [number, number];
const unit2 = (a: Pt, b: Pt): Dir2 => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
const arcPts = (c: Pt, r: number, a0: number, a1: number, n: number): Pt[] => Array.from({length: n + 1}, (_, i): Pt => { const a = a0 + ((a1 - a0) * i) / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; });
const wrapPi = (a: number) => a - Math.round(a / (2 * Math.PI)) * 2 * Math.PI;
/** Closed outline of a polyline tube with per-point radii (px): miter on the inner side of a bend, round on the outer side, round cap at the end (optional); the start is flat. */
const tubeOutline = (P: Pt[], R: number[], cap: boolean): Pt[] => {
  const n = P.length, d: Dir2[] = [], nm: Dir2[] = [];
  for (let i = 0; i < n - 1; i++) { d.push(unit2(P[i], P[i + 1])); nm.push([-d[i][1], d[i][0]]); }
  const side = (s: number): Pt[] => {
    const out: Pt[] = [[P[0][0] + s * nm[0][0] * R[0], P[0][1] + s * nm[0][1] * R[0]]];
    for (let j = 1; j < n - 1; j++) {
      const na = nm[j - 1], nb = nm[j], inner = s * (na[0] * d[j][0] + na[1] * d[j][1]) > 0;
      if (inner) {
        const mx = s * (na[0] + nb[0]), my = s * (na[1] + nb[1]), ml = Math.hypot(mx, my) || 1, cos = Math.max(0.4, (mx / ml) * s * na[0] + (my / ml) * s * na[1]);
        // A foreshortened segment shorter than the miter's reach would spike (a V at the joint): leave the point out and let the line run on.
        const reach = R[j] * Math.sqrt(1 - cos * cos) / cos, la = Math.hypot(P[j][0] - P[j - 1][0], P[j][1] - P[j - 1][1]), lb = Math.hypot(P[j + 1][0] - P[j][0], P[j + 1][1] - P[j][1]);
        if (reach < 0.9 * Math.min(la, lb)) out.push([P[j][0] + (mx / ml) * (R[j] / cos), P[j][1] + (my / ml) * (R[j] / cos)]);
      } else {
        const a0 = Math.atan2(s * na[1], s * na[0]), a1 = a0 + wrapPi(Math.atan2(s * nb[1], s * nb[0]) - a0);
        out.push(...arcPts(P[j], R[j], a0, a1, 4));
      }
    }
    out.push([P[n - 1][0] + s * nm[n - 2][0] * R[n - 1], P[n - 1][1] + s * nm[n - 2][1] * R[n - 1]]);
    return out;
  };
  const L = side(1), Rr = side(-1);
  const end = cap ? (() => { const a0 = Math.atan2(nm[n - 2][1], nm[n - 2][0]); return arcPts(P[n - 1], R[n - 1], a0, a0 - Math.PI, 12).slice(1, -1); })() : [];
  return [...L, ...end, ...Rr.reverse()];
};
/** Keep the part of a convex polygon with (p - o) . n >= 0. */
const clipHalf = (poly: Pt[], o: Pt, n: Dir2): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = (a[0] - o[0]) * n[0] + (a[1] - o[1]) * n[1], db = (b[0] - o[0]) * n[0] + (b[1] - o[1]) * n[1];
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) { const k = da / (da - db); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
  }
  return out;
};
const inPoly = (x: number, y: number, poly: readonly (readonly [number, number])[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};


/** R3 pianist-hand outline in hand-local (v, f) cm: PALM with the thumb-web bow (0.35 cm at f 3.8-6.2), the little-finger edge roll (0.25 cm), knuckle undulation on the front edge and a rounded heel behind the wrist (f < 0). Index ranges say which vertices carry ink. */
const KNUCKLES: readonly (readonly [number, number])[] = [[1.45, 5.95], [-0.3, 6.05], [-2.0, 5.8], [-3.6, 5.3]];
const outlineLocal = () => {
  const pts: [number, number][] = [], seg = (a: readonly [number, number], b: readonly [number, number], n: number, fn: (v: number, f: number) => [number, number]) => {
    for (let i = 0; i < n; i++) { const t = i / n; pts.push(fn(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)); }
  };
  const web = (f: number) => (f > 3.8 && f < 6.2 ? 0.6 * Math.sin((Math.PI * (f - 3.8)) / 2.4) : 0), roll = (f: number) => 0.42 * Math.sin((Math.PI * Math.max(0, Math.min(f, 5.2))) / 5.2);
  const neck = (f: number) => (f > 0 && f < 1.8 ? 0.2 * Math.sin((Math.PI * f) / 1.8) : 0); // R3d: the outline tapers in just above the wrist
  const thumbStart = 0;
  for (let i = 0; i < PALM_FRONT; i++) seg(PALM[i], PALM[i + 1], 4, (v, f) => [v + web(f) - neck(f), f]);
  const thumbEnd = pts.length;
  seg(PALM[PALM_FRONT], PALM[10], 12, (v, f) => [v, f + 0.1 * Math.cos(((v - 1.45) / 1.7) * Math.PI * 2) - 0.1]);
  const littleStart = pts.length;
  for (let i = 10; i < PALM.length - 1; i++) seg(PALM[i], PALM[i + 1], 4, (v, f) => [v - roll(f) + neck(f), f]);
  pts.push([-2.6 - roll(0), 0]);
  const littleEnd = pts.length - 1;
  for (const [v, f] of [[-2.2, -0.12], [-1.2, -0.2], [0, -0.22], [1.2, -0.2], [2.0, -0.1]] as const) pts.push([v, f]); // R3d: rounded heel behind the wrist (fill only, no ink)
  return {pts, thumbEnd: [thumbStart, thumbEnd] as [number, number], littleStart, littleEnd, knuckles: KNUCKLES};
};

// ids: fills base + 0 .. 119, shadows base + 120 .. 159, inks base + 160 .. 229
const FILL = 0, SHADOW = 120, INK_ID = 160;
const HIGHLIGHT = (skin: string, k = 0.2) => mixColor(skin, '#fff3e2', k);
/** R3 tone ramp of the pianist hand, rim light -> core shadow -> shade -> mid -> skin -> lit -> peach crown, interpolated over the 11 band fractions `TONE_KS` (1 = the whole width, 0.24 = the crown). Shared by the hand and the forearm so they match at the wrist. */
const TONE_KS0 = [1, 0.97, 0.94, 0.9, 0.86, 0.81, 0.76, 0.71, 0.65, 0.59, 0.53, 0.47, 0.41, 0.35, 0.29, 0.23];
const TONE_KS: number[] = Array.from({length: 40}, (_, i) => { const x = (i / 39) * 15, j = Math.min(14, Math.floor(x)); return TONE_KS0[j] + (TONE_KS0[j + 1] - TONE_KS0[j]) * (x - j); }); // R3d: 40 bands of small tone steps (was 16) so the dome reads as a gradient
const TONE_RAMP = (t: {skin: string; shade: string; deep: string}) => [mixColor(t.shade, t.skin, 0.45), mixColor(t.shade, t.deep, 0.65), t.shade, mixColor(t.skin, t.shade, 0.45), t.skin, HIGHLIGHT(t.skin, 0.1), HIGHLIGHT(t.skin, 0.24)];
const toneAt = (t: {skin: string; shade: string; deep: string}, i: number) => {
  const r = TONE_RAMP(t), x = (i / (TONE_KS.length - 1)) * (r.length - 1), j = Math.min(r.length - 2, Math.floor(x));
  return mixColor(r[j], r[j + 1], x - j);
};

/**
 * Paint the macro hand through camera `cam` and return its anchors. Draw order: shadows on `plane`, forearm and sleeve, fingers folded
 * under the palm, the back of the hand, then the other fingers far to near (or `order`). Fingers behind the lens are skipped.
 */
export const paintHandMacro = (p: Painter, cam: YCam, h: HandMacro): HandAnchors => {
  const sk = macroSkeleton(h, p.t), anchors = macroAnchors(cam, h, p.t, sk);
  const tone = h.tone ?? MACRO_TONES.generic, alpha = h.skinAlpha ?? 1, S = sk.S;
  const q = alpha < 1 ? p.layer(alpha, h.base * 16) : p;
  const crisp = h.crisp ?? true;
  const fill = (pp: Painter, id: number, color: string, pts: Pt[]) => {
    if (pts.length < 3) return;
    if (crisp) hardFill(pp, h.base + id, color, pts); else drawSolid(pp, h.base + id, color, pts, 4);
  };
  const toPx = (v: V3): {pt: Pt; r: number; d: number} | null => {
    const c = camSpace(cam, v);
    if (c.d < (cam.near ?? 0.3)) return null;
    return {pt: [540 + (cam.cx ?? 0) + (cam.f * c.r) / c.d, cam.hy - (cam.f * c.u) / c.d], r: cam.f / c.d, d: c.d};
  };
  const midMcp = toPx(sk.fingers.middle.joints[0]);
  const inkW = Math.max(1.1, Math.min(3, 0.06 * (midMcp ? midMcp.r * sk.fingers.middle.radii[0] : 20)));
  const ink = (pp: Painter, id: number, pts: Pt[], w = inkW, color = INK, closed = false) => { if (pts.length >= 2) inkLine(pp, h.base + INK_ID + id, pts, w, 0.25, closed, color); };
  const inkOf = (c: string) => (alpha < 1 ? mixColor(c, '#ffffff', 1 - Math.max(alpha, 0.55)) : c);
  const camPos: V3 = [cam.x, cam.y, cam.z];
  // Screen direction of the light, for the cel shade side.
  const L3 = norm3(h.shadowDir ?? [0.14, -0.9, 0.11]);
  const c0 = camSpace(cam, sk.palmCentre), c1 = camSpace(cam, add3(sk.palmCentre, L3));
  const ls = unit2([0, 0], [c1.r - c0.r, -(c1.u - c0.u)]); // light travel direction on screen

  // Shadows on the contact plane: a ground capsule per phalanx, the palm outline.
  if (h.plane !== undefined) {
    const sp = p.layer(Math.min(1, (h.shadowAlpha ?? 0.3) * (0.4 + 0.6 * alpha)), h.base * 16 + 7);
    const col = h.shadowColor ?? '#2a1c14';
    const drop = (v: V3): V3 => { const hgt = Math.max(0, v[1] - h.plane!); const k = hgt / Math.max(0.2, -L3[1]); return [v[0] + L3[0] * k, h.plane!, v[2] + L3[2] * k]; };
    let sid = 0;
    for (const id of FINGER_IDS) {
      const c = sk.fingers[id];
      for (let k = 0; k < 3; k++) {
        const a = drop(c.joints[k]), b = drop(c.joints[k + 1]), ra = c.radii[k], rb = c.radii[k + 1];
        const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz);
        if (l < 1e-6 || c.joints[k][1] < h.plane! || c.joints[k + 1][1] < h.plane!) { sid++; continue; } // FX07b: nothing below the table casts a shadow on it
        const ang = Math.atan2(dz, dx), pts: V3[] = [];
        for (let i = 0; i <= 6; i++) { const t = ang - Math.PI / 2 + (Math.PI * i) / 6; pts.push([b[0] + rb * Math.cos(t), h.plane, b[2] + rb * Math.sin(t)]); }
        for (let i = 0; i <= 6; i++) { const t = ang + Math.PI / 2 + (Math.PI * i) / 6; pts.push([a[0] + ra * Math.cos(t), h.plane, a[2] + ra * Math.sin(t)]); }
        const poly = pts.map((v) => toPx(v)?.pt).filter((v): v is Pt => !!v);
        if (poly.length === pts.length) hardFill(sp, h.base + SHADOW + sid, col, poly);
        sid++;
      }
    }
    const pal = sk.palm.map((v) => toPx(drop(sub3(v, scale3(sk.normal, S * 0.6)))));
    if (pal.every(Boolean)) hardFill(sp, h.base + SHADOW + 40, col, pal.map((v) => v!.pt));
  }

  // R3 pianist-hand geometry (the back-of-hand outline in the picture, the lit anchor of its tone bands), shared by the hand and the forearm so both carry the same gradient across the wrist.
  const palmLo = outlineLocal(), at2 = (v: number, f: number) => toPx(sk.at(v, f < 0.05 ? 0 : 0.05, f))?.pt;
  const palmPts = (() => { const r = palmLo.pts.map(([v, f]) => at2(v, f)); return r.some((v) => !v) ? null : (r as Pt[]); })();
  const palmCtr: [number, number] = [palmLo.pts.reduce((s, v) => s + v[0], 0) / palmLo.pts.length, palmLo.pts.reduce((s, v) => s + v[1], 0) / palmLo.pts.length];
  let litIdx = 0;
  if (palmPts) palmPts.forEach((v, i) => { if (-(v[0] * ls[0] + v[1] * ls[1]) > -(palmPts[litIdx][0] * ls[0] + palmPts[litIdx][1] * ls[1])) litIdx = i; });
  const palmAnchor: [number, number] = [(palmLo.pts[litIdx][0] + palmCtr[0]) / 2, (palmLo.pts[litIdx][1] + palmCtr[1]) / 2];
  const V_WRIST: [number, number] = [palmLo.pts[0][0], palmLo.pts[palmLo.littleEnd][0]]; // wrist edge, local v: thumb side, little side
  const pianist = h.look === 'pianist';
  // Forearm and sleeve.
  let armCut: {bandPoly: (poly: Pt[], k: number) => Pt[]; wrist: Pt} | null = null; // the forearm's shade cut line, so the hand can blend into it
  if (h.elbow) {
    const w = toPx(h.wrist), e = toPx(h.elbow);
    if (w && e) {
      const fr = 2.4 * S, er = 2.8 * S;
      if (!pianist) {
        const P0: Pt[] = [w.pt, e.pt], R0 = [fr * w.r, er * e.r], arm0 = tubeOutline(P0, R0, true);
        fill(q, FILL + 0, tone.skin, arm0);
        const sideN: Dir2 = (() => { const d = unit2(P0[0], P0[1]); return [-d[1], d[0]]; })();
        const sgn = sideN[0] * ls[0] + sideN[1] * ls[1] >= 0 ? 1 : -1;
        fill(q, FILL + 1, tone.shade, clipHalf(arm0, [(P0[0][0] + P0[1][0]) / 2 + sgn * sideN[0] * Math.min(R0[0], R0[1]) * 0.35, (P0[0][1] + P0[1][1]) / 2 + sgn * sideN[1] * Math.min(R0[0], R0[1]) * 0.35], [sgn * sideN[0], sgn * sideN[1]]));
        ink(q, 0, arm0, inkW, inkOf(INK));
      } else {
      // R3: the forearm starts 1 cm under the palm (the back of the hand covers it), so no flat end shows at the wrist; its shading is the hand's own tone ramp laid across the tube, lit edge to shadow edge
      const along0 = unit2(w.pt, e.pt), P: Pt[] = [[w.pt[0] - along0[0] * S * w.r, w.pt[1] - along0[1] * S * w.r], e.pt], Rr = [fr * w.r, er * e.r];
      const arm = tubeOutline(P, Rr, true);
      fill(q, FILL + 0, TONE_RAMP(tone)[0], arm);
      // band i = the strip of the tube between two lines parallel to the arm, the wrist outline's v-extent scaled by k about the lit anchor (what the palm bands do at the wrist, so the tones meet)
      const perp: Dir2 = [-along0[1], along0[0]], pa = at2(0, 0), pb = at2(1, 0), vAx = pa && pb ? unit2(pa, pb) : perp, nrm: Dir2 = perp[0] * vAx[0] + perp[1] * vAx[1] >= 0 ? perp : [-perp[0], -perp[1]];
      const vCut = (v: number): Pt => { const c = at2(v, 0) ?? w.pt; return c; };
      const band = (k: number): [Pt, Pt] => [vCut(palmAnchor[0] + (V_WRIST[1] - palmAnchor[0]) * k), vCut(palmAnchor[0] + (V_WRIST[0] - palmAnchor[0]) * k)];
      const bandPoly = (poly: Pt[], k: number) => { const [lo, hi] = band(k); return clipHalf(clipHalf(poly, lo, nrm), hi, [-nrm[0], -nrm[1]]); };
      TONE_KS.forEach((k, i) => fill(q, 500 + i, toneAt(tone, i), bandPoly(arm, k)));
      armCut = {bandPoly, wrist: w.pt};
      ink(q, 0, arm, inkW, inkOf(INK));
      }
      if (h.sleeve) {
        const cu = h.sleeve.cuff ?? 0.5, cuffW = add3(h.wrist, scale3(sub3(h.elbow, h.wrist), cu)), rc = (2.4 + 0.4 * cu) * S * 1.18;
        const cp = toPx(cuffW), tp = toPx(h.sleeve.to);
        if (cp && tp) {
          const sl = tubeOutline([cp.pt, tp.pt], [rc * cp.r, rc * 1.15 * tp.r], false);
          fill(q, FILL + 2, h.sleeve.color, sl);
          const d = unit2(cp.pt, tp.pt), n: Dir2 = [-d[1], d[0]], sg = n[0] * ls[0] + n[1] * ls[1] >= 0 ? 1 : -1, rr = rc * cp.r * 0.4;
          fill(q, FILL + 3, h.sleeve.shade ?? mixColor(h.sleeve.color, '#000000', 0.16), clipHalf(sl, [(cp.pt[0] + tp.pt[0]) / 2 + sg * n[0] * rr, (cp.pt[1] + tp.pt[1]) / 2 + sg * n[1] * rr], [sg * n[0], sg * n[1]]));
          ink(q, 1, sl, inkW, inkOf(tone.sleeveShade), true);
          const half = rc * cp.r;
          ink(q, 2, [[cp.pt[0] + n[0] * half, cp.pt[1] + n[1] * half], [cp.pt[0] - n[0] * half, cp.pt[1] - n[1] * half]], inkW, inkOf(tone.sleeveShade));
        }
      }
    }
  }

  // Finger groups.
  const camSide = dot3(sub3(camPos, sk.palmCentre), sk.normal) >= 0 ? 1 : -1;
  type Group = {id: FingerId; fi: number; under: boolean; depth: number; draw: () => void};
  const groups: Group[] = [];
  FINGER_IDS.forEach((id, fi) => {
    const c = sk.fingers[id], pts = c.joints.map(toPx);
    if (pts.some((v) => !v)) return;
    let P = pts.map((v) => v!.pt), Rpx = c.radii.map((r, i) => r * pts[i]!.r), nk = 3;
    let nUnder = 0, deepUnder = false;
    const dBelow = c.joints.map((v, j) => -dot3(sub3(v, sk.palmCentre), sk.normal) * camSide / c.radii[j]);
    for (let j = 1; j < 4; j++) {
      const rel = sub3(c.joints[j], sk.wrist), lat = dot3(rel, sk.toThumb) / S, fwd = dot3(rel, sk.forward) / S;
      const depthBelow = -dot3(sub3(c.joints[j], sk.palmCentre), sk.normal) * camSide / c.radii[j];
      if (depthBelow > 0.5 && inPoly(lat, fwd, PALM)) { nUnder++; if (j >= 2) deepUnder = true; }
      else if (j >= 2 && depthBelow > 3) deepUnder = true; // far below the palm plane (a fold passing through the table): never drawn over the palm
    }
    // FX07b: a finger folding down past the contact plane goes through the table; what is below it is hidden, not drawn (the folded tip used to show as an arc past the wrist edge of the palm, and its shadow as a ghost disc beyond the finger). The phalanx that crosses the plane is cut where its axis reaches it, the cut end left open.
    const yRel = c.joints.map((v, j) => (h.plane === undefined ? Infinity : (v[1] - h.plane) / c.radii[j]));
    const j0 = yRel.findIndex((d, i) => i >= 2 && d < 0);
    if (j0 > 0) {
      const t = Math.max(0, Math.min(1, yRel[j0 - 1] / (yRel[j0 - 1] - yRel[j0])));
      if (t > 0.2) { nk = j0; P = P.slice(0, j0 + 1); Rpx = Rpx.slice(0, j0 + 1); P[j0] = [P[j0 - 1][0] + (pts[j0]!.pt[0] - P[j0 - 1][0]) * t, P[j0 - 1][1] + (pts[j0]!.pt[1] - P[j0 - 1][1]) * t]; }
      else { nk = j0 - 1; P = P.slice(0, j0); Rpx = Rpx.slice(0, j0); }
    }
    const depth = c.joints.reduce((s, v) => s + camSpace(cam, v).d, 0) / 4;
    const strain = h.strain?.[id] ?? 0;
    const draw = () => {
      const f0 = FILL + 10 + fi * 10, i0 = fi * 12;
      // R3: each phalanx is a little fuller at mid-length than at its joints (+9 %, 12 % on the proximal), the joints keep their radii
      const bulge = (k: number) => (pianist ? 1 + (k === 0 ? 0.12 : 0.09) : 1), rm = (k: number) => ((Rpx[k] + Rpx[k + 1]) / 2) * bulge(k);
      const Pm: Pt[] = [], Rm: number[] = [];
      for (let k = 0; k < nk; k++) { Pm.push(P[k], [(P[k][0] + P[k + 1][0]) / 2, (P[k][1] + P[k + 1][1]) / 2]); Rm.push(Rpx[k], rm(k)); }
      Pm.push(P[nk]); Rm.push(Rpx[nk]);
      for (let k = 0; k < nk; k++) fill(q, f0 + k, tone.skin, pianist ? tubeOutline([P[k], [(P[k][0] + P[k + 1][0]) / 2, (P[k][1] + P[k + 1][1]) / 2], P[k + 1]], [Rpx[k], rm(k), Rpx[k + 1]], true) : capsule(P[k], P[k + 1], 2 * Rpx[k], 2 * Rpx[k + 1]));
      if (alpha >= 1) for (let k = 1; k < nk; k++) fill(q, f0 + 3 + k, tone.skin, ring(P[k][0], P[k][1], Rpx[k], Rpx[k], 12));
      // cel shade on the side away from the light, clipped inside each phalanx
      for (let k = 0; k < nk; k++) {
        const d = unit2(P[k], P[k + 1]), n: Dir2 = [-d[1], d[0]], sg = n[0] * ls[0] + n[1] * ls[1] >= 0 ? 1 : -1, rr = Math.min(Rpx[k], Rpx[k + 1]) * 0.3;
        const seg = pianist ? tubeOutline([P[k], Pm[2 * k + 1], P[k + 1]], [Rpx[k], rm(k), Rpx[k + 1]], true) : capsule(P[k], P[k + 1], 2 * Rpx[k], 2 * Rpx[k + 1]);
        fill(q, f0 + 6 + (k % 3), tone.shade, clipHalf(seg, [P[k][0] + sg * n[0] * rr, P[k][1] + sg * n[1] * rr], [sg * n[0], sg * n[1]]));
        // volume (FX05): a lit stripe down the rounded phalanx (light skin, on the side away from the shade) so the finger reads as a tube, not a flat strip
        const off = -sg * Math.min(Rpx[k], Rpx[k + 1]) * 0.3, hl = HIGHLIGHT(tone.skin);
        if (pianist || id !== 'thumb' || k > 0) fill(q, FILL + 70 + fi * 4 + k, hl, capsule([P[k][0] + n[0] * off, P[k][1] + n[1] * off], [P[k + 1][0] + n[0] * off, P[k + 1][1] + n[1] * off], 0.7 * Rpx[k], 0.7 * Rpx[k + 1]));
      }
      if (id === 'thumb') {
        // The metacarpal lies in the palm: ink only the free part (MCP -> tip) and the outer edge of the metacarpal.
        ink(q, i0, pianist ? tubeOutline(Pm.slice(2), Rm.slice(2), true) : tubeOutline(P.slice(1), Rpx.slice(1), true), inkW, inkOf(INK));
        // the outer edge of the metacarpal is the palm outline's thenar edge (PALM), not a second line
      } else ink(q, i0, pianist ? tubeOutline(Pm, Rm, true) : tubeOutline(P, Rpx, true), inkW, inkOf(INK));
      // knuckle creases (two strokes at pip and dip) where the back of the finger faces the camera
      for (let j = 1; j <= Math.min(2, nk - 1); j++) {
        const dor = c.dorsal[j - 1], seg = sub3(c.joints[j + 1], c.joints[j - 1]), faces = dot3(dor, norm3(sub3(camPos, c.joints[j])));
        if (faces < 0.18) continue;
        const dirW = norm3(seg), side = norm3([dor[1] * dirW[2] - dor[2] * dirW[1], dor[2] * dirW[0] - dor[0] * dirW[2], dor[0] * dirW[1] - dor[1] * dirW[0]]);
        const r = c.radii[j], bow = 0.35 * (1 - strain);
        for (let s = -1; s <= 1; s += 2) {
          const ctr = add3(add3(c.joints[j], scale3(dirW, s * 0.17 * r * 1.4)), scale3(dor, r * 0.78));
          const pa = toPx(add3(ctr, scale3(side, r * 0.5))), pm = toPx(add3(add3(ctr, scale3(dirW, s * bow * r * 0.55)), scale3(dor, 0.0))), pb = toPx(sub3(ctr, scale3(side, r * 0.5)));
          if (pa && pm && pb) ink(q, i0 + 1 + (j - 1) * 2 + (s > 0 ? 1 : 0), [pa.pt, pm.pt, pb.pt], inkW * 0.7, inkOf(tone.crease));
        }
      }
      // nail on the distal phalanx (short natural nail), only when the back of the finger faces the camera
      const dorD = c.dorsal[2], seeNail = dot3(dorD, norm3(sub3(camPos, c.joints[3])));
      if (seeNail > 0.2 && nk === 3) {
        const rd = c.radii[3], th = id === 'thumb', f0n = th ? 0.5 : 0.5, f1n = th ? 0.92 : 0.95;
        const a = add3(add3(c.joints[2], scale3(sub3(c.joints[3], c.joints[2]), f0n)), scale3(dorD, rd * 0.55)), b = add3(add3(c.joints[2], scale3(sub3(c.joints[3], c.joints[2]), f1n)), scale3(dorD, rd * 0.55));
        const pa = toPx(a), pb = toPx(b);
        if (pa && pb) {
          // thumb: nail 0.9 cm wide (capsule width, ends included in the length 0.8 cm), seen at three quarters because the dorsal is turned out
          const nail = th ? capsule(pa.pt, pb.pt, THUMB_SPEC.nailW * S * pa.r * 0.8, THUMB_SPEC.nailW * S * pb.r * 0.72) : capsule(pa.pt, pb.pt, rd * pa.r * 1.1, rd * pb.r * 1.0);
          fill(q, f0 + 9, tone.nail, nail);
          ink(q, i0 + 5, nail, inkW * 0.5, inkOf(tone.crease), true);
        }
      }
    };
    // FX07: a finger folding under the palm has its middle or tip joint beneath it from the first frame it goes under to the last; counting joints 1-3 alone let one frame (DIP under, tip not yet 0.5 r) draw the whole finger over the palm.
    groups.push({id, fi, under: nUnder >= 2 || deepUnder, depth, draw});
  });

  // Back of the hand (R3 pianist hand, FX11/FX12): a domed form, not a flat polygon. The outline is the PALM outline with a thumb-web bow, a rolled little-finger edge, undulating knuckles and a rounded heel behind the wrist; the shading is a stack of copies of that outline scaled toward the lit edge (so every tone band follows the outline: lit crown, mid, shade, core shadow, reflected rim), then four knuckle bumps with dimples (back) or the thenar and hypothenar pads with three creases (palm side).
  const drawPalmClassic = () => {
    const pp = sk.palm.map(toPx);
    if (pp.some((v) => !v)) return;
    const pts = pp.map((v) => v!.pt);
    fill(q, FILL + 60, tone.skin, pts);
    const cx = pts.reduce((s, v) => s + v[0], 0) / pts.length, cy = pts.reduce((s, v) => s + v[1], 0) / pts.length;
    const ext = Math.max(...pts.map((v) => Math.hypot(v[0] - cx, v[1] - cy)));
    fill(q, FILL + 61, tone.shade, clipHalf(pts, [cx + ls[0] * ext * 0.35, cy + ls[1] * ext * 0.35], ls));
    fill(q, FILL + 95, HIGHLIGHT(tone.skin, 0.12), ring(cx - ls[0] * ext * 0.16, cy - ls[1] * ext * 0.16, ext * 0.34, ext * 0.24, 18)); // the bulge of the back of the hand (FX05)
    // FX09 palm volume, the language of the finger stripes: a deeper band on the shaded edge, a soft rim light on the lit edge, and the two pads (thenar by the thumb, hypothenar by the little finger) each a soft lit crown
    fill(q, FILL + 63, mixColor(tone.shade, tone.deep, 0.6), clipHalf(pts, [cx + ls[0] * ext * 0.5, cy + ls[1] * ext * 0.5], ls));
    fill(q, FILL + 64, HIGHLIGHT(tone.skin, 0.2), clipHalf(pts, [cx - ls[0] * ext * 0.68, cy - ls[1] * ext * 0.68], [-ls[0], -ls[1]]));
    ([[1.5, 2.0, 1.0, 1.5], [-2.2, 2.8, 0.85, 1.3]] as const).forEach(([v, f, rv, rf], i) => {
      const a = toPx(sk.at(v, 0.05, f));
      if (!a) return;
      const rx = rv * S * a.r, ry = rf * S * a.r;
      fill(q, FILL + 65 + i, HIGHLIGHT(tone.skin, 0.2), ring(a.pt[0] - ls[0] * rx * 0.1, a.pt[1] - ls[1] * rx * 0.1, rx * 0.85, ry * 0.85, 16)); // lit crown
    });
    if (tone.spots) {
      const spots: [number, number, number][] = [[0.6, 2.8, 0.42], [-1.4, 4.4, 0.36], [1.1, 5.2, 0.3]];
      const sp = p.layer(0.4 * alpha, h.base * 16 + 9);
      spots.forEach(([v, f, r], i) => { const s = toPx(sk.at(v, 0.05, f)); if (s) hardFill(sp, h.base + FILL + 62 + i, tone.spots!, ring(s.pt[0], s.pt[1], r * S * s.r, r * S * s.r * 0.8, 10)); });
    }
    ink(q, 100, pts.slice(0, PALM_FRONT + 1), inkW, inkOf(INK));
    ink(q, 101, pts.slice(PALM_FRONT + 2), inkW, inkOf(INK));
  };
  const drawPalm = () => {
    if (!pianist) return drawPalmClassic();
    if (sk.palm.some((v) => !toPx(v))) return;
    const lo = palmLo;
    if (!palmPts) return;
    const pts = palmPts;
    const cx = pts.reduce((s, v) => s + v[0], 0) / pts.length, cy = pts.reduce((s, v) => s + v[1], 0) / pts.length;
    const ext = Math.max(...pts.map((v) => Math.hypot(v[0] - cx, v[1] - cy)));
    const small = ext * 2 < 60, crown = HIGHLIGHT(tone.skin, 0.22);
    // every tone band is the outline scaled about a point near the lit edge, so the bands hug the lit edge and open out toward the shadow side; the wrist vertices keep their f so no band closes across the wrist
    const aL = palmAnchor;
    const shrink = (k: number): Pt[] => lo.pts.map(([v, f]) => at2(aL[0] + (v - aL[0]) * k, f < 0.05 ? f : aL[1] + (f - aL[1]) * k) ?? [cx, cy]);
    TONE_KS.forEach((k, i) => fill(q, i === 0 ? FILL + 60 : FILL + 300 + i, toneAt(tone, i), shrink(k)));
    // (the forearm carries the same bands, built on the same wrist extent, so the join needs no blend strip)
    const padBase = toneAt(tone, 12); // the pad tones are pre-mixed with the mid tone under them (no extra translucent layers: an opaque hand adds none)
    const pad = (id: number, v: number, f: number, rv: number, rf: number, col: string, a: number) => {
      const c = toPx(sk.at(v, 0.05, f));
      if (!c) return;
      const rx = rv * S * c.r, ry = rf * S * c.r;
      // R3d: a soft pad is three nested ellipses (1, 0.7, 0.4 of the radius) of a third of the strength each, so no single hard disc edge shows
      [1, 0.7, 0.4].forEach((k, j) => fill(q, FILL + 89 + id + j * 30, mixColor(padBase, col, a * (0.45 + 0.3 * j)), ring(c.pt[0] - ls[0] * rx * 0.12, c.pt[1] - ls[1] * rx * 0.12, rx * k, ry * k, 16)));
    };
    if (camSide >= 0) {
      // thumb web: lit dome of the first dorsal interosseous with a soft shadow just below it
      pad(0, 2.0, 5.0, 0.9, 1.05, mixColor(tone.deep, tone.shade, 0.4), 0.14);
      pad(1, 1.9, 4.8, 0.78, 0.9, crown, 0.2);
      if (!small) {
        // four knuckle bumps with dimples between them
        lo.knuckles.forEach(([v, f], i) => {
          pad(10 + i, v - 0.0, f - 0.65, 0.7, 0.35, mixColor(tone.deep, tone.shade, 0.5), 0.05); // tiny shadow downstream
          pad(14 + i, v, f - 0.5, 0.85, 0.42, crown, 0.09);
          if (i < 3) pad(18 + i, (v + lo.knuckles[i + 1][0]) / 2, f - 0.9, 0.5, 0.4, mixColor(tone.shade, tone.deep, 0.5), 0.05);
        });
      }
    } else {
      // palm side: thenar pad (by the thumb, the largest), hypothenar pad, soft hollow between them
      pad(0, -0.9, 2.9, 1.7, 1.6, mixColor(tone.shade, tone.deep, 0.5), 0.3);
      pad(1, 1.9, 2.6, 1.55, 2.0, crown, 0.7);
      pad(2, -2.8, 3.0, 1.0, 1.9, crown, 0.55);
      pad(3, -0.4, 5.3, 2.6, 0.7, crown, 0.4);
      if (!small) {
        const crease = (id: number, local: [number, number][]) => {
          const cp = local.map(([v, f]) => toPx(sk.at(v, 0.05, f))?.pt);
          if (cp.every(Boolean)) ink(q, 110 + id, cp as Pt[], inkW * 0.55, inkOf(tone.crease));
        };
        crease(0, [[2.2, 4.4], [1.2, 3.6], [0.4, 2.7], [0.0, 1.4]]); // thenar crease around the thumb pad
        crease(1, [[-3.4, 4.6], [-2.0, 4.3], [-0.6, 4.3]]); // heart line
        crease(2, [[-3.0, 3.8], [-1.6, 3.7], [0.2, 3.9]]); // head line
      }
    }
    if (tone.spots) {
      const spots: [number, number, number][] = [[0.6, 2.8, 0.42], [-1.4, 4.4, 0.36], [1.1, 5.2, 0.3]];
      const sp = p.layer(0.4 * alpha, h.base * 16 + 9);
      spots.forEach(([v, f, r], i) => { const s = toPx(sk.at(v, 0.05, f)); if (s) hardFill(sp, h.base + FILL + 67 + i, tone.spots!, ring(s.pt[0], s.pt[1], r * S * s.r, r * S * s.r * 0.8, 10)); });
    }
    // outline: thumb edge down to the wrist and the little-finger edge (the wrist side stays open into the forearm, the front edge under the fingers)
    ink(q, 100, pts.slice(lo.thumbEnd[0], lo.thumbEnd[1] + 1), inkW, inkOf(INK));
    ink(q, 101, pts.slice(lo.littleStart, lo.littleEnd + 1), inkW, inkOf(INK));
  };

  const fingerOrder = (a: Group, b: Group) => {
    const o = h.order, ia = o ? o.indexOf(a.id) : -1, ib = o ? o.indexOf(b.id) : -1;
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    return b.depth - a.depth;
  };
  // Seen from the palm's front or underside (camSide < 0) the back of the hand faces away: it is drawn first and every finger group over it.
  const first = groups.filter((g) => camSide >= 0 && g.under).sort(fingerOrder), after = groups.filter((g) => camSide < 0 || !g.under).sort(fingerOrder);
  first.forEach((g) => g.draw());
  drawPalm();
  after.forEach((g) => g.draw());
  return anchors;
};

// ---- poses
export type HandPose = Pick<HandMacro, 'fingers' | 'thumb' | 'pitch' | 'roll'> & {
  /** Wrist centre height above the plane in cm at size 1 (multiply by size x unit). */
  wristRise: number;
  /** Per-finger strain 0..1 this pose implies. */
  strain?: Partial<Record<FingerId, number>>;
  /** What the pose is, and the brief it comes from. */
  note: string;
};
const straight = (mcp = 0, pip = 0, dip = 0, abd = 0): FingerPose => ({mcp, pip, dip, abd});
const FLAT_FINGERS: Record<LongFingerId, FingerPose> = {index: straight(1.47), middle: straight(0.61), ring: straight(1.2), little: straight(3.6)}; // MCP re-solved for the L4 lengths so every flat tip rests on the plane
const FLAT: HandPose = {
  pitch: -1.5, roll: 0, wristRise: 1.2, fingers: FLAT_FINGERS, thumb: {cmc: 0, cmcAbd: 32, mcp: 0, ip: 0},
  note: 'flat on the table, fingers together (HAND-CLOSE flat)',
};
// FX01-03/06 (user, 9 Nov 2026): the old arch (pitch 16.5, PIP 28) stood the middle phalanx at 68 deg, so POV foreshortened it to 0.26 of the proximal one.
// Now (user pick N, 9 Nov 2026): pitch 4, PIP/DIP 8/6 on index, ring and little, MCP solved per finger (5.06/4.48/8.28 at the L4 lengths) so each tip rests on the plane (the TP test holds every tip within 0.5 mm).
// The folded middle (MCP 95, PIP 110, DIP 20) drops steeply at its knuckle and doubles back under the palm: only its knuckle shows at the palm's front edge, the rest is drawn before the palm; its tip sits on the table (gap 0).
const TP_FINGERS: Record<LongFingerId, FingerPose> = {
  index: straight(5.06, 8, 6), middle: straight(95, 110, 20), ring: straight(4.48, 8, 6), little: straight(8.28, 8, 6),
};
const TP: HandPose = {
  pitch: 4, roll: 0, wristRise: 1.2, fingers: TP_FINGERS, thumb: {cmc: 3.34, cmcAbd: 30, mcp: 4, ip: 2}, // cmc 7.7 -> 3.34: the flatter pitch 4 would sink the thumb tip 4.8 mm
  note: 'test pose TP: middle folded under, index, ring and little arched on their tips, thumb along the table',
};
// N11 `hand-lifted-dangle` (EDU-EP09 SH07, Boss W5.2): palm down, level, raised off the table (the caller sets the wrist height), fingers hanging relaxed.
const DANGLE: HandPose = {
  pitch: 0, roll: 0, wristRise: 1.2, fingers: {index: straight(15, 25, 10), middle: straight(15, 25, 10), ring: straight(15, 25, 10), little: straight(15, 25, 10)},
  thumb: {cmc: 6, cmcAbd: 30, mcp: 10, ip: 8},
  note: 'hand-lifted-dangle: palm down, fingers hanging (MCP 15, PIP 25, DIP 10), no tip touches the table; raise the wrist above `plane`',
};
export type HandPoseId = 'flat' | 'test-fold-middle' | 'ring-strain' | 'hand-lifted-dangle';
export const HAND_POSES: Record<HandPoseId, HandPose> = {
  flat: FLAT,
  'test-fold-middle': TP,
  'hand-lifted-dangle': DANGLE,
  'ring-strain': {...TP, strain: {ring: 1}, note: 'TP with the ring pressed down: knuckle skin tight; add `tremble` {finger: ring} from the shot'},
};
/** Tip rise (cm at size 1, above the pose's resting tip) of the lifts from TP the brief lists; the ring hair-lift is 0.4, the diagram lift 0.3. */
export const TP_LIFTS = {thumb: 2.5, index: 4.0, little: 3.0, 'ring-hair': 0.4, 'ring-diagram': 0.3} as const;

/** A full `HandMacro` from a named pose: `at` is the wrist on the plane [x, z]; lifts raise tips from the pose (cm x size x unit, so a 4 cm index lift stays 4 cm on a bigger hand's ground). */
export const macroHand = (id: HandPoseId, o: Omit<HandMacro, 'wrist' | 'yaw' | 'pitch' | 'roll' | 'fingers' | 'thumb'> & {at: [number, number]; plane?: number; yaw?: number; lift?: Partial<Record<FingerId, number>>}): HandMacro => {
  const pose = HAND_POSES[id], size = o.size ?? 1, unit = o.unit ?? 1, plane = o.plane ?? 0;
  const {at, lift, yaw, ...rest} = o;
  let hand: HandMacro = {...rest, plane: o.plane, yaw: yaw ?? 0, pitch: pose.pitch, roll: pose.roll, wrist: [at[0], plane + pose.wristRise * size * unit, at[1]], fingers: pose.fingers, thumb: pose.thumb, strain: {...pose.strain, ...o.strain}};
  for (const [f, r] of Object.entries(lift ?? {}) as [FingerId, number][]) hand = liftFinger(hand, f, r * unit);
  return hand;
};

/** Picture point for a rig hand target (`Arm.to`) so the rig's mitten sits under the macro hand: the palm centre. Null when behind the lens. */
export const macroHandTarget = (cam: YCam, h: HandMacro): Pt | null => camPoint(cam, macroSkeleton(h).palmCentre);

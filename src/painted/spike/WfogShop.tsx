import {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, pushCamera, toScreen, type Camera} from '../camera';
import {GLOW_PEAK} from '../glow';
import {hash} from '../hash';
import {lerp, mixColor, type Painter, type Pt} from '../painter';
import type {PaintedShot} from '../shot';
import {BROW_Y, INK, headOutline} from './FaceSheet';

// SP01 preview for WFOG-EP01-SHORT (brief VB-WFOG-EP01-SHORT-R1, scene sheets SS-R1): the window plate on
// CAM-GLASS-OUT with WFOG-ASSEMBLY (worker + cart + cartons + helmet + umbrella) at the stop, FOG-STATE FS2.
// S02-SH09 (helmet slide, catch, return; match frame f179) and the match frame of S03-SH03 with `light` 0 -> 1.
// Spike code (spike entry only, not in src/painted/registry.ts); written as PaintedShot objects so the plate,
// projection and assembly can move into an episode module once the full build is authorised.

// ------------------------------------------------------------------ projection (index ST-02, CAM-GLASS-OUT)

type V3 = [number, number, number];
const F = 1341, YH = 700, EYE = 1.45, CAMZ = -3;
/** WORLD-SHOP metres (+x right seen from inside, +y up, +z out) to PLATE px at camera scale 1. */
const P = ([x, y, z]: V3): Pt => {
  const d = z - CAMZ;
  return [540 + (F * x) / d, YH + (F * (EYE - y)) / d];
};
const kAt = (z: number) => F / (z - CAMZ);

const STOP = {xs: -0.1, zs: 0.62};
const WORKER = {x: STOP.xs + 0.3, z: STOP.zs + 0.45};
/** Worker upper-body lean toward the stack (-x) about the hip height, in radians. Proposed refinement of ST-03. */
const LEAN = 9 * (Math.PI / 180), HIP = 0.71;

// ------------------------------------------------------------------ palette (VD16)

const SIL = '#21272a';
const LIT = {
  coat: '#2f4a5e', coatShade: '#233848', boot: '#1c1e20', glove: '#26292c', skin: '#c48c5c', skinShade: '#a8724a', hair: '#1f1d1b',
  kraft: '#b98d58', kraftShade: '#93693c', tape: '#cfae7a', label: '#e4ddcd', helmet: '#b8392c', helmetShade: '#8e2a21',
  visor: '#2b3238', cart: '#6a7076', cartDark: '#3a3f44', wheel: '#24272a', umbrella: '#30353b', white: '#f4efe4', mouth: '#3b2a24',
};
const FOG = {top: '#77736a', mid: '#6b706c', low: '#58625f', ground: '#3d4646', veil: '#72776f', bankA: '#878b83', bankB: '#68726f'};

// ------------------------------------------------------------------ shot clocks and poses (sc02-b04, sc03, ST-03)

type ShotKey = 'S02-SH09' | 'S03-SH03';
const SHOT_G0: Record<ShotKey, number> = {'S02-SH09': 1230, 'S03-SH03': 1800};

type Pose = {helmet: {c: V3; a: number}; rHand: V3; dip: number; light: number; beam: number; lean: number};

const ease = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
const seg = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const mix3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const deg = Math.PI / 180;

const SEAT: V3 = [STOP.xs, 1.725, STOP.zs];
const MATCH_HELMET = {c: [STOP.xs + 0.01, 1.725, STOP.zs] as V3, a: 12 * deg};
const MATCH_HAND: V3 = [0.1, 1.55, 0.72];
const BRACE: V3 = [0.15, 1.3, 0.85];
const CATCH_HAND: V3 = [0.2, 1.28, 0.75];
const PALM_HELMET: V3 = [0.22, 1.38, 0.72];

/** S02-SH09 pose at shot-local frame f (sheet table: slide f24-36, fall f36-45, catch f45, hold, lift f84-117, MATCH). */
const poseSH09 = (f: number): Pose => {
  let c: V3 = SEAT, a = 0;
  // Catch impact: the hand gives 3 cm and springs back.
  const give = f >= 45 ? -0.03 * Math.sin(Math.PI * seg(f, 45, 58)) : 0;
  if (f >= 24 && f < 36) {
    const u = seg(f, 24, 36) ** 1.6;
    c = [lerp(SEAT[0], 0.1, u), lerp(SEAT[1], 1.66, u), SEAT[2]];
    a = 35 * deg * u;
  } else if (f >= 36 && f < 45) {
    const u = seg(f, 36, 45) ** 2;
    c = [lerp(0.1, PALM_HELMET[0], Math.sqrt(u)), lerp(1.66, PALM_HELMET[1], u), lerp(SEAT[2], PALM_HELMET[2], u)];
    a = lerp(35, 22, u) * deg;
  } else if (f >= 45 && f < 84) {
    c = add3(PALM_HELMET, [0, give, 0]);
    a = lerp(22, 16, seg(f, 45, 70)) * deg;
  } else if (f >= 84 && f < 117) {
    const u = ease(seg(f, 84, 117));
    // Arc up and over the top carton (quadratic Bezier through a raised control point).
    const ctrl: V3 = [0.14, 1.86, 0.68];
    const p0 = mix3(PALM_HELMET, ctrl, u), p1 = mix3(ctrl, MATCH_HELMET.c, u);
    c = mix3(p0, p1, u);
    a = lerp(16, 12, u) * deg;
  } else if (f >= 117) {
    const settle = f < 121 ? 0.006 * Math.sin(Math.PI * seg(f, 117, 121)) : 0;
    c = add3(MATCH_HELMET.c, [0, settle, 0]);
    a = MATCH_HELMET.a;
  }
  // Right hand: brace -> catch point -> under the helmet -> along the lift -> on the rim.
  let rHand: V3 = BRACE;
  if (f >= 30 && f < 45) rHand = mix3(BRACE, CATCH_HAND, ease(seg(f, 30, 44)));
  else if (f >= 45 && f < 84) rHand = add3(CATCH_HAND, [0, give, 0]);
  else if (f >= 84 && f < 117) {
    const u = ease(seg(f, 84, 117));
    const off = mix3([CATCH_HAND[0] - PALM_HELMET[0], CATCH_HAND[1] - PALM_HELMET[1], CATCH_HAND[2] - PALM_HELMET[2]], [MATCH_HAND[0] - MATCH_HELMET.c[0], MATCH_HAND[1] - MATCH_HELMET.c[1], MATCH_HAND[2] - MATCH_HELMET.c[2]], u);
    rHand = add3(c, off);
  } else if (f >= 117) rHand = MATCH_HAND;
  // Hood dips 3 cm with the effort of the catch, breath rise at f150.
  const dip = -0.03 * Math.sin(Math.PI * seg(f, 45, 60)) + 0.015 * Math.sin(Math.PI * seg(f, 140, 165));
  return {helmet: {c, a}, rHand, dip, light: 0, beam: 0, lean: LEAN};
};

/**
 * S03-SH03: MATCH pose held f0-f35 (no pose change before the light is full), light 0 -> 1 over f6-f30. Preview
 * only beyond f35: the worker straightens out of the lean f36-f54 so the face reads (the sheet's later helmet press,
 * brace and umbrella lowering are not built here).
 */
const poseSH03 = (f: number): Pose => ({helmet: MATCH_HELMET, rHand: MATCH_HAND, dip: 0, light: ease(seg(f, 6, 30)), beam: ease(seg(f, 0, 30)), lean: LEAN * (1 - ease(seg(f, 36, 54)))});

const poseAt = (shot: ShotKey, f: number) => (shot === 'S02-SH09' ? poseSH09(f) : poseSH03(f));

/** Picture push (sheets): SH09 s 1.22 -> 1.30 about (560, 650) eased over [0, 179]; SH03 1.30 -> 1.34 over [0, 119]. */
const cameraFor = (shot: ShotKey) => (tl: number): Camera =>
  shot === 'S02-SH09' ? pushCamera(tl, 179 / 30, {s0: 1.22, s1: 1.3, fx: 560, fy: 650}) : pushCamera(tl, 119 / 30, {s0: 1.3, s1: 1.34, fx: 560, fy: 650});

// ------------------------------------------------------------------ WFOG-ASSEMBLY geometry (front view, ST-03)

/** Worker-local point (x from his centre, y up) in WORLD-SHOP, with the upper-body lean applied above the hips. */
const workerPt = (x: number, y: number, lean = LEAN): V3 => {
  if (y <= HIP) return [WORKER.x + x, y, WORKER.z];
  const r = y - HIP;
  return [WORKER.x + x * Math.cos(lean) - r * Math.sin(lean), HIP + x * Math.sin(lean) + r * Math.cos(lean), WORKER.z];
};

/** One fill of the assembly: `lit` colour at light 1, SIL at 0. `inner` parts sit inside the outline (shades, details). */
type Part = {pts: Pt[]; lit: string; inner?: boolean; ink?: boolean; passes?: number};

const ellipse3 = (c: V3, rx: number, ry: number, n = 18, a = 0): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const t = (i / n) * Math.PI * 2, u = rx * Math.cos(t), v = ry * Math.sin(t);
    return P([c[0] + u * Math.cos(a) - v * Math.sin(a), c[1] + u * Math.sin(a) + v * Math.cos(a), c[2]]);
  });
/** A quad around the segment a-b (each end projected at its own depth), widths in metres. */
const limb3 = (a: V3, b: V3, w0: number, w1: number): Pt[] => {
  const [ax, ay] = P(a), [bx, by] = P(b);
  const len = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / len, ny = (bx - ax) / len;
  const h0 = (w0 * kAt(a[2])) / 2, h1 = (w1 * kAt(b[2])) / 2;
  return [[ax + nx * h0, ay + ny * h0], [bx + nx * h1, by + ny * h1], [bx - nx * h1, by - ny * h1], [ax - nx * h0, ay - ny * h0]];
};
/** Elbow of a two-bone arm from shoulder S to hand H (metres), bending toward `side` (-1 screen-left, +1 right) and down. */
const elbow3 = (S: V3, H: V3, bone: number, side: number): V3 => {
  const m = mix3(S, H, 0.5);
  const d = Math.hypot(H[0] - S[0], H[1] - S[1], H[2] - S[2]);
  const bend = Math.sqrt(Math.max(0, bone * bone - (d / 2) ** 2));
  return [m[0] + side * bend * 0.55, m[1] - bend * 0.8, m[2] + bend * 0.2];
};

/** A tapered body along a-b (furled umbrella), width w(u) in metres at each sample's own depth. */
const spindle = (a: V3, b: V3, w: (u: number) => number, n = 10): Pt[] => {
  const [ax, ay] = P(a), [bx, by] = P(b);
  const len = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / len, ny = (bx - ax) / len;
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const c = mix3(a, b, i / n), [x, y] = P(c), h = (w(i / n) * kAt(c[2])) / 2;
    left.push([x + nx * h, y + ny * h]);
    right.unshift([x - nx * h, y - ny * h]);
  }
  return [...left, ...right];
};

/** Helmet shell (front), local metres about its centre, rotated by `a` (top toward +x when a > 0). */
const helmetPts = (c: V3, a: number, shape: Pt[]) =>
  shape.map(([u, v]): Pt => P([c[0] + u * Math.cos(a) + v * Math.sin(a), c[1] - u * Math.sin(a) + v * Math.cos(a), c[2]]));
const HELMET_SHELL: Pt[] = [
  ...Array.from({length: 15}, (_, i): Pt => {
    const t = Math.PI * (i / 14);
    return [0.225 * Math.cos(t), 0.02 + 0.205 * Math.sin(t)];
  }),
  [-0.22, -0.08], [-0.19, -0.19], [-0.08, -0.225], [0.08, -0.225], [0.19, -0.19], [0.22, -0.08],
];
const HELMET_VISOR: Pt[] = [[-0.17, 0.05], [-0.1, 0.085], [0.1, 0.085], [0.17, 0.05], [0.165, -0.07], [0.08, -0.095], [-0.08, -0.095], [-0.165, -0.07]];
const HELMET_SHADE: Pt[] = [[0.12, 0.17], [0.2, 0.09], [0.215, -0.08], [0.18, -0.18], [0.12, -0.2]];
const HELMET_GLINT: Pt[] = [[-0.12, 0.06], [-0.04, 0.075], [-0.1, -0.02], [-0.14, -0.01]];

/** Carton k of the stack: [width, x offset, tilt]. Four cartons from the deck top 0.17 to the stack top 1.50. */
const CARTONS: [number, number, number][] = [[0.5, 0, -0.8], [0.46, 0.015, 1.2], [0.48, -0.012, -1.5], [0.43, 0.018, 1.0]];
const DECK_TOP = 0.17, BOX_H = (1.5 - DECK_TOP) / 4;

const boxPts = (cx: number, y0: number, w: number, h: number, tiltDeg: number, z: number, inset = 0): Pt[] => {
  const a = tiltDeg * deg, x0 = -w / 2 + inset, x1 = w / 2 - inset, b = inset, t = h - inset;
  return ([[x0, b], [x1, b], [x1, t], [x0, t]] as Pt[]).map(([u, v]): Pt => P([cx + u * Math.cos(a) - v * Math.sin(a), y0 + u * Math.sin(a) + v * Math.cos(a), z]));
};

/**
 * WFOG-ASSEMBLY at the stop, back to front. Silhouette parts (no `inner`) define the outline and are identical at
 * every `light`; inner parts are drawn at light > 0 only and stay inside the outline (SP01 b).
 */
const assemblyParts = (pose: Pose): Part[] => {
  const {xs, zs} = STOP;
  const dy = pose.dip;
  // Upper body leans into the stack it braces (LEAN about the hips), so the hood sits behind the stack edge as a
  // shoulder hump under the helmet "head" (VD05) instead of reading as a second head.
  const W = (x: number, y: number) => workerPt(x, y, pose.lean);
  const parts: Part[] = [];
  const add = (pts: Pt[], lit: string, o: Partial<Part> = {}) => parts.push({pts, lit, ink: true, ...o});

  // Worker: boots, raincoat to below the knee, hood with the face inside.
  for (const s of [-1, 1]) {
    add([P(W(s * 0.075 - 0.065, 0.3)), P(W(s * 0.075 + 0.065, 0.3)), P(W(s * 0.075 + 0.07, 0.02)), P(W(s * 0.075 + s * 0.04 + 0.07, 0)), P(W(s * 0.075 + s * 0.04 - 0.07, 0)), P(W(s * 0.075 - 0.07, 0.02))], LIT.boot);
  }
  const coat: Pt[] = [P(W(-0.2, 1.17 + dy)), P(W(-0.14, 1.215 + dy)), P(W(0.14, 1.215 + dy)), P(W(0.2, 1.17 + dy)), P(W(0.25, 0.34)), P(W(0.12, 0.31)), P(W(-0.12, 0.31)), P(W(-0.25, 0.34))];
  add(coat, LIT.coat);
  add([P(W(0.06, 1.15 + dy)), P(W(0.2, 1.17 + dy)), P(W(0.25, 0.34)), P(W(0.12, 0.31)), P(W(0.1, 0.6))], LIT.coatShade, {inner: true, ink: false});
  add([P(W(-0.004, 1.12 + dy)), P(W(0.004, 1.12 + dy)), P(W(0.004, 0.32)), P(W(-0.004, 0.32))], LIT.coatShade, {inner: true, ink: false}); // placket
  // Hood flaring into the shoulders (no neck notch): arc over the top, then down to the coat's shoulder line.
  const hood: Pt[] = [
    ...Array.from({length: 21}, (_, i): Pt => {
      const a = (-25 + (230 * i) / 20) * deg;
      return P(W(0.235 * Math.cos(a), 1.49 + dy + 0.215 * Math.sin(a)));
    }),
    P(W(-0.215, 1.17 + dy)), P(W(0.215, 1.17 + dy)),
  ];
  add(hood, LIT.coat);
  // Face in the hood opening (decal head, exhausted: half-lidded eyes, worry brows, open mouth).
  const Kh = 0.165, fc: Pt = [0, 1.47 + dy];
  const FP = ([u, v]: Pt): Pt => P(W(u * Kh, fc[1] - v * Kh));
  add(headOutline(28).map(([u, v]) => FP([u * 0.92, v * 0.86])), LIT.skin, {inner: true, passes: 8});
  add([[-0.9, -0.62], [-0.6, -0.86], [0, -0.92], [0.6, -0.86], [0.9, -0.62], [0.86, -0.42], [0.3, -0.52], [-0.3, -0.5], [-0.86, -0.42]].map((q) => FP(q as Pt)), LIT.hair, {inner: true, passes: 6});
  add([[0.55, -0.2], [0.82, -0.3], [0.86, 0.5], [0.6, 0.8], [0.35, 0.86]].map((q) => FP(q as Pt)), LIT.skinShade, {inner: true, ink: false});
  for (const s of [-1, 1]) {
    const ex = s * 0.38, ey = 0.08;
    add(Array.from({length: 9}, (_, i): Pt => FP([ex + 0.19 * Math.cos(Math.PI * (i / 8)), ey + 0.1 * Math.sin(Math.PI * (i / 8))])), LIT.white, {inner: true, passes: 4});
    add(Array.from({length: 10}, (_, i): Pt => FP([ex - 0.02 + 0.06 * Math.cos((i / 10) * 6.283), ey + 0.06 + 0.055 * Math.sin((i / 10) * 6.283)])), INK, {inner: true, ink: false, passes: 6});
    const [inner, outer] = BROW_Y.worry;
    add([FP([s * 0.2, inner - 0.03]), FP([s * 0.58, outer - 0.03]), FP([s * 0.58, outer + 0.03]), FP([s * 0.2, inner + 0.03])], LIT.hair, {inner: true, ink: false, passes: 6});
  }
  add(Array.from({length: 12}, (_, i): Pt => FP([0.1 * Math.cos((i / 12) * 6.283), 0.6 + 0.06 * Math.sin((i / 12) * 6.283)])), LIT.mouth, {inner: true, passes: 4});

  // Arms: the right arm (screen-left) reaches from the shoulder to the brace / catch / rim; drawn before the stack.
  const rS = W(-0.15, 1.18 + dy), lS = W(0.15, 1.18 + dy);
  const rE = elbow3(rS, pose.rHand, 0.27, -1);
  add(limb3(rS, rE, 0.12, 0.105), LIT.coat);
  add(limb3(rE, pose.rHand, 0.105, 0.095), LIT.coat);
  const L_HAND: V3 = [xs + 0.55, 1.33, zs + 0.23];
  const lE = elbow3(lS, L_HAND, 0.27, 1);
  add(limb3(lS, lE, 0.12, 0.105), LIT.coat);
  add(limb3(lE, L_HAND, 0.105, 0.095), LIT.coat);

  // Cart: handle (behind the stack), deck edge, casters; the front-right caster is the jammed one.
  for (const x of [xs - 0.23, xs + 0.23]) add(limb3([x, DECK_TOP, zs + 0.38], [x, 0.97, zs + 0.38], 0.03, 0.03), LIT.cart);
  add(limb3([xs - 0.25, 0.97, zs + 0.38], [xs + 0.25, 0.97, zs + 0.38], 0.035, 0.035), LIT.cart);
  // The cart is drawn on the stack's depth plane, like the stack (the sheets project the stack at its centre, z = zs);
  // a deck edge at its true z (zs - 0.37) floats below the stack as a separate bar. Rear casters sit a little behind.
  for (const [x, z] of [[xs - 0.2, zs + 0.12], [xs + 0.2, zs + 0.12], [xs - 0.2, zs], [xs + 0.2, zs]] as const) {
    add(limb3([x, 0.1, z], [x, 0.055, z], 0.05, 0.04), LIT.cartDark);
    add(ellipse3([x, 0.05, z], 0.02, 0.05, 12), LIT.wheel);
  }
  add([P([xs - 0.25, DECK_TOP + 0.01, zs]), P([xs + 0.25, DECK_TOP + 0.01, zs]), P([xs + 0.25, 0.1, zs]), P([xs - 0.25, 0.1, zs])], LIT.cart);

  // Cartons: kraft fronts, each a little off-square (unstable load); inner shade, tape and a blank shipping label.
  CARTONS.forEach(([w, ox, tilt], i) => {
    const y0 = DECK_TOP + i * BOX_H, cx = xs + ox;
    add(boxPts(cx, y0 - (i ? 0.015 : 0), w, BOX_H + (i ? 0.015 : 0), tilt, zs), LIT.kraft); // overlaps the carton below: no seam in the mass
    add(boxPts(cx - w * 0.36, y0, w * 0.28, BOX_H, tilt, zs, 0.012), LIT.kraftShade, {inner: true, ink: false});
    add(boxPts(cx + 0.02 * (hash(i + 40) - 0.5), y0 + BOX_H * 0.62, 0.05, BOX_H * 0.36, tilt, zs, 0.004), LIT.tape, {inner: true, ink: false});
    if (i === 1 || i === 3) add(boxPts(cx + w * 0.18, y0 + BOX_H * 0.22, 0.13, 0.09, tilt + 2, zs, 0), LIT.label, {inner: true});
  });

  // Helmet, then the right glove over or under it (palm under the shell while caught, on the rim at MATCH).
  const {c, a} = pose.helmet;
  const glove = ellipse3(pose.rHand, 0.065, 0.06, 14);
  const onRim = pose.rHand === MATCH_HAND || Math.abs(pose.rHand[1] - 1.55) < 0.02;
  if (!onRim) add(glove, LIT.glove);
  add(helmetPts(c, a, HELMET_SHELL), LIT.helmet);
  add(helmetPts(c, a, HELMET_SHADE), LIT.helmetShade, {inner: true, ink: false});
  add(helmetPts(c, a, HELMET_VISOR), LIT.visor, {inner: true, passes: 6});
  add(helmetPts(c, a, HELMET_GLINT), '#6d7a84', {inner: true, ink: false});
  if (onRim) add(glove, LIT.glove);

  // Closed umbrella in the left hand, raised: tip toward the glass at (0.36, 1.60, 0.05); handle hook below the hand.
  const tip: V3 = [xs + 0.46, 1.6, 0.05];
  const along = (u: number): V3 => mix3(L_HAND, tip, u);
  add(limb3(add3(L_HAND, [0.01, -0.08, 0.01]), tip, 0.014, 0.01), LIT.umbrella);
  add(spindle(along(0.12), along(0.9), (u) => 0.022 + 0.022 * Math.sin(Math.PI * u ** 0.7)), LIT.umbrella); // furled canopy, slim
  add(ellipse3(add3(L_HAND, [0.01, -0.1, 0.01]), 0.03, 0.035, 10), LIT.umbrella); // hook
  add(ellipse3(L_HAND, 0.065, 0.06, 14), LIT.glove);
  return parts;
};

// ------------------------------------------------------------------ fog plate (VD06, FS2), ground, beam

const rectPts = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
/** Soft breathing blob, phases from `id`, so neighbouring banks do not move in step. */
const blob = (id: number, cx: number, cy: number, rx: number, ry: number, t: number): Pt[] =>
  Array.from({length: 18}, (_, i): Pt => {
    const a = (i / 18) * Math.PI * 2;
    const r = 1 + 0.13 * Math.sin(3 * a + hash(id + 11) * 6.28 + t * 0.35) + 0.07 * Math.sin(5 * a + hash(id + 23) * 6.28 - t * 0.27);
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
  });
/** A wash band between two y lines with a wavy top edge (static per id). */
const band = (id: number, y0: number, y1: number, amp: number): Pt[] => [
  ...Array.from({length: 13}, (_, i): Pt => [-200 + i * 125, y0 + (hash(id + i) - 0.5) * amp]),
  [1300, y1], [-200, y1],
];

const LAMPS: V3[] = [[-2.4, 4.8, 7], [2.4, 4.8, 7], [-2.4, 4.8, 11], [2.4, 4.8, 11]];

/** Beam reach on the painted plate: warm lit fog in about 1.5 m in front of the assembly (VD06), behind it. */
const paintBeamFog = (p: Painter, beam: number) => {
  const [ax, ay] = P([STOP.xs + 0.1, 1.2, STOP.zs + 0.5]);
  p.wash('#8e8270', 70 * beam, blob(910, ax - 60, ay + 20, 380, 470, 0), 0.7, 0.45);
  p.wash('#a8977a', 70 * beam, blob(911, ax - 30, ay - 10, 270, 340, 0), 0.6, 0.45);
  p.wash('#bfa983', 60 * beam, blob(912, ax, ay - 40, 170, 220, 0), 0.5, 0.4);
};

/** The window plate: fog sky, canopy ghost, lamps, far ghosts, banks, wet ground, shadow, reflection, assembly. */
const paintWindow = (p: Painter, G: number, pose: Pose, bare: boolean) => {
  const t = G / 30;
  const parts = assemblyParts(pose);
  if (!bare) {
    p.group(100);
    // Fog sky: lamp-lit warm grey at the top, darkening and cooling toward the ground (night, sodium canopy).
    const ramp8 = [FOG.top, mixColor(FOG.top, FOG.mid, 0.5), FOG.mid, mixColor(FOG.mid, FOG.low, 0.5), FOG.low, mixColor(FOG.low, '#4f5958', 0.5), '#4f5958', '#4a5453'];
    ramp8.forEach((c, i) => p.wash(c, 240, rectPts(-200, i ? 120 + i * 160 : -300, 1300, 120 + (i + 1) * 160 + 120), 0.45, 0.5));
    // Canopy underside, beyond 2 m: a darker ghost mass at the top, no readable edge.
    p.wash('#5d5f58', 110, band(40, -300, 250, 0).map(([x, y]) => [x, y < 0 ? y : y + 40 * Math.sin(x / 140)] as Pt), 0.5, 0.5);
    // Lamp cores (warm), softened by the veil painted over them.
    LAMPS.forEach((l, i) => {
      const [x, y] = P(l), r = 0.32 * kAt(l[2]);
      p.wash('#ffd58a', 230, blob(200 + i, x, y, r, r * 0.42, 0), 0.25, 0.3);
    });
    // Far ghosts (FS2: nothing beyond about 2 m has a readable shape): pump islands and the parked sedan as smudges.
    for (const x of [-3.5, 3.5]) {
      const [px0, py0] = P([x - 0.4, 1.8, 9.5]), [px1, py1] = P([x + 0.4, 0, 9.5]);
      p.wash('#5e6461', 34, rectPts(px0, py0, px1, py1), 0.5, 0.5);
    }
    const [cx0, cy0] = P([-3.6, 1.45, 4.2]), [cx1, cy1] = P([0.9, 0, 4.2]);
    p.wash('#535b5a', 42, blob(230, (cx0 + cx1) / 2, (cy0 + cy1) / 2 + 20, (cx1 - cx0) / 2, (cy1 - cy0) / 2, 0), 0.6, 0.5);
    // FS2 veil over everything beyond the first 2 m.
    p.wash(FOG.veil, 150, rectPts(-200, -300, 1300, 1150), 0.4, 0.5);
    p.wash(FOG.top, 70, band(50, -300, 560, 80), 0.5, 0.5);
    // Lamp haze over the veil: the four canopy lamps read as warm halos scattered in the fog (visibility gauge).
    LAMPS.forEach((l, i) => {
      const [x, y] = P(l), k = kAt(l[2]);
      p.wash('#8f826a', 120, blob(240 + i, x, y, 1.5 * k, 1.0 * k, t), 0.6, 0.4);
      p.wash('#b49e78', 120, blob(250 + i, x, y, 0.8 * k, 0.5 * k, t), 0.5, 0.35);
      p.wash('#e8cf9c', 170, blob(260 + i, x, y, 0.32 * k, 0.17 * k, 0), 0.35, 0.3);
    });

    // High banks behind the assembly, drifting left to right on the story clock (far slow, near fast).
    const bank = (id: number, op: number, x0: number, y0: number, rx: number, ry: number, drift: number, color: string) => {
      const span = 1700, x = ((x0 + t * drift + 400) % span + span) % span - 400;
      p.wash(color, op, blob(id, x, y0, rx, ry, t), 0.6, 0.45);
    };
    p.group(300);
    bank(1, 60, 100, 330, 700, 120, 9, FOG.bankA);
    bank(2, 55, 900, 540, 760, 110, 12, FOG.bankA);
    bank(3, 55, 300, 780, 780, 120, 16, FOG.bankB);
    bank(4, 45, 1100, 980, 720, 90, 20, FOG.bankA);
    bank(5, 40, -100, 1080, 640, 80, 24, FOG.bankB);

    // Wet ground: walkway z 0-2 darker near the glass, merging into fog; puddles reflect the bright fog.
    p.group(400);
    const gy = (z: number) => P([0, 0, z])[1];
    // No visible far edge: the ground darkens in overlapping steps from the fog line toward the glass.
    [[3.2, 60], [2.4, 90], [1.7, 130], [1.1, 170], [0.6, 200], [0.25, 210]].forEach(([z, o]) => {
      p.wash(mixColor(FOG.low, FOG.ground, o / 210), o, rectPts(-200, gy(z), 1300, gy(-0.2)), 0.55, 0.45);
    });
    // Puddles (ground-plane ellipses) reflecting the bright fog.
    [[-0.75, 0.55, 0.35, 0.16], [0.75, 0.4, 0.4, 0.14], [-0.2, 1.6, 0.6, 0.3], [0.6, 1.25, 0.3, 0.16]].forEach(([x, z, rx, rz], i) => {
      const pts = Array.from({length: 16}, (_, j): Pt => {
        const a = (j / 16) * Math.PI * 2, r = 1 + 0.18 * Math.sin(3 * a + hash(i + 430) * 6);
        return P([x + rx * r * Math.cos(a), 0, z + rz * r * Math.sin(a)]);
      });
      p.wash('#6f7873', 110, pts, 0.35, 0.4);
    });
    // Far lamp reflections on the wet ground: warm vertical smears.
    LAMPS.slice(2).forEach((l, i) => {
      const [x] = P(l), y = P([l[0], -l[1], l[2]])[1];
      p.wash('#c9a46a', 80, blob(440 + i, x, y - 70, 26, 90, 0), 0.4, 0.35);
    });
    // Drag mark of the jammed front-right caster on the wet concrete (from where it came).
    p.wash('#323938', 90, [P([0.085, 0, STOP.zs]), P([0.115, 0, STOP.zs]), P([0.2, 0, 2.2]), P([0.12, 0, 2.2])], 0.2, 0.5);
    // Backlit shadow: canopy lamps behind and above throw a soft pool toward the glass; contact darks under wheels/boots.
    const shadow: Pt[] = Array.from({length: 18}, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      return P([STOP.xs + 0.15 + 0.42 * Math.cos(a), 0, STOP.zs + 0.05 + 0.55 * Math.sin(a)]);
    });
    p.wash('#262c2c', 150, shadow, 0.4, 0.4);
    // Reflection of the assembly in the wet ground: the silhouette mirrored about y = 0, in ripple strips.
    p.group(500);
    const mirror = (pt: Pt, z: number): Pt => {
      const g = YH + F * EYE / (z - CAMZ);
      return [pt[0], 2 * g - pt[1]];
    };
    const zMid = STOP.zs + 0.2;
    parts.filter((x) => !x.inner).forEach((x) => {
      const pts = x.pts.map((q) => mirror(q, zMid)).map(([u, v], j) => [u + 4 * Math.sin(v / 9 + j), v] as Pt);
      p.wash('#2b3232', 70, pts, 0.15, 0.4);
    });
    if (pose.beam > 0) paintBeamFog(p, pose.beam);
  }

  // The assembly: one merged mass at light 0 (texture-free opaque fills), per-part colour lerp to lit (VD04).
  p.group(2000);
  const light = pose.light;
  // Own seeded fills with no watercolour border (fillTexture border 0): a border darkens every part edge and shows
  // the parts inside the merged silhouette.
  const {brush} = p;
  parts.forEach((x, i) => {
    if (x.inner && light <= 0) return;
    const color = mixColor(SIL, x.lit, light);
    const n = x.passes ?? (x.inner ? 6 : 9);
    for (let k = 0; k < n; k++) {
      brush.seed(20000 + i * 16 + k);
      brush.noiseSeed(20000 + i * 16 + k);
      brush.noStroke();
      brush.fill(color, 255 * p.alpha);
      brush.fillBleed(0);
      brush.fillTexture(x.inner ? 0.12 * light : 0, x.inner ? 0.15 * light : 0);
      brush.polygon(x.pts);
      brush.noFill();
    }
    // Ink right after its own fill, so nearer parts cover the lines of the parts behind them.
    if (light > 0.3 && x.ink) {
      p.ink(700 + i, 'rotring', mixColor(SIL, INK, light), 0.9);
      brush.spline([...x.pts, x.pts[0]], 0.15);
    }
  });
  if (bare) return;
  // Ground fog in front of the lower assembly only (low bank): never over the helmet or hood (spike finding).
  p.group(3000);
  p.wash(FOG.low, 70, band(70, P([0, 0.32, 0.8])[1], P([0, -0.1, 0.8])[1], 30), 0.25, 0.3);
  p.wash(FOG.bankB, 55, blob(71, ((200 + t * 30) % 1500) - 200, P([0, 0.05, 0.4])[1], 520, 40, t), 0.3, 0.35);
};

// ------------------------------------------------------------------ Remotion layers: halos, rim, beam, glass, frame

const Halos = ({G}: {G: number}) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={GLOW_PEAK} />
          <stop offset="0.25" stopColor="#ffc98a" stopOpacity={GLOW_PEAK * 0.45} />
          <stop offset="1" stopColor="#ffb870" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}s`}>
          <stop offset="0" stopColor="#f0d9b0" stopOpacity={0.12} />
          <stop offset="1" stopColor="#f0d9b0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}r`}>
          <stop offset="0" stopColor="#ffcf90" stopOpacity={0.14} />
          <stop offset="1" stopColor="#ffcf90" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={540} cy={260} rx={760} ry={420} fill={`url(#${id}s)`} />
      {LAMPS.map((l, i) => {
        const [x, y] = P(l), r = (i < 2 ? 2.4 : 2.0) * kAt(l[2]) * (1 + 0.04 * Math.sin(G / 30 * 0.6 + i));
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.78} fill={`url(#${id}h)`} />;
      })}
      {LAMPS.slice(2).map((l, i) => {
        const [x] = P(l), y = P([l[0], -l[1], l[2]])[1];
        return <ellipse key={`r${i}`} cx={x} cy={y - 60} rx={34} ry={110} fill={`url(#${id}r)`} />;
      })}
    </>
  );
};

/** Thin warm outer rim from the canopy lamps behind (VD03/VD05): the outline band of the merged mass, top-weighted. */
const Rim = ({parts}: {parts: Part[]}) => {
  const id = useId();
  const outline = parts.filter((x) => !x.inner);
  const top = Math.min(...outline.flatMap((x) => x.pts.map((q) => q[1]))), bottom = Math.max(...outline.flatMap((x) => x.pts.map((q) => q[1])));
  return (
    <>
      <defs>
        <filter id={`${id}f`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius={2.4} result="er" />
          <feComposite in="SourceAlpha" in2="er" operator="out" result="band" />
          <feGaussianBlur in="band" stdDeviation={0.8} result="soft" />
          <feFlood floodColor="#ffe0a8" result="c" />
          <feComposite in="c" in2="soft" operator="in" />
        </filter>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="0" y1={top} x2="0" y2={bottom}>
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.45} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.1} />
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-200} y={-300} width={1500} height={2600}>
          <rect x={-200} y={-300} width={1500} height={2600} fill={`url(#${id}g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}m)`}>
        <g filter={`url(#${id}f)`}>
          {outline.map((x, i) => <polygon key={i} points={x.pts.map((q) => q.join(',')).join(' ')} fill="#000" stroke="#000" strokeWidth={3} strokeLinejoin="round" />)}
        </g>
      </g>
    </>
  );
};

/** Torch beam (S03-SH03): from the narrator's torch off-frame low-left to the assembly; warm, <= GLOW_PEAK. */
const Beam = ({beam, camera}: {beam: number; camera: Camera}) => {
  const id = useId();
  if (beam <= 0) return null;
  // Sheet: glow centre from plate (300, 1150) to (590, 700) over f0-f30; plate points mapped back into the world.
  const inv = ([x, y]: Pt): Pt => [(x - camera.fx - camera.dx) / camera.s + camera.fx, (y - camera.fy - camera.dy) / camera.s + camera.fy];
  const [cx, cy] = inv([lerp(300, 590, beam), lerp(1150, 700, beam)]);
  const [sx, sy] = inv([-160, 1180]);
  const ang = Math.atan2(cy - sy, cx - sx), len = Math.hypot(cx - sx, cy - sy) * 1.25, w0 = 40, w1 = 330;
  const n = [-Math.sin(ang), Math.cos(ang)], e = [sx + Math.cos(ang) * len, sy + Math.sin(ang) * len];
  const cone = [[sx + n[0] * w0, sy + n[1] * w0], [e[0] + n[0] * w1, e[1] + n[1] * w1], [e[0] - n[0] * w1, e[1] - n[1] * w1], [sx - n[0] * w0, sy - n[1] * w0]];
  return (
    <>
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1={sx} y1={sy} x2={e[0]} y2={e[1]}>
          <stop offset="0" stopColor="#ffe2b0" stopOpacity={0.26 * beam} />
          <stop offset="0.7" stopColor="#ffd296" stopOpacity={0.14 * beam} />
          <stop offset="1" stopColor="#ffd296" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}s`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={300}>
          <stop offset="0" stopColor="#ffe6bc" stopOpacity={GLOW_PEAK * beam} />
          <stop offset="1" stopColor="#ffe6bc" stopOpacity={0} />
        </radialGradient>
      </defs>
      <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={28} />
      </filter>
      <polygon points={cone.map((q) => q.join(',')).join(' ')} fill={`url(#${id}c)`} filter={`url(#${id}b)`} />
      <circle cx={cx} cy={cy} r={300} fill={`url(#${id}s)`} />
    </>
  );
};

/** Outside condensation beads and a faint interior reflection on the glass (normal blend, low opacity). */
const Glass = () => {
  const id = useId();
  const gb = P([0, 0.05, 0])[1];
  return (
    <>
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1="0" y1={gb} x2="0" y2={gb - 320}>
          <stop offset="0" stopColor="#cfd8d6" stopOpacity={0.2} />
          <stop offset="1" stopColor="#cfd8d6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-200} y={gb - 320} width={1500} height={320} fill={`url(#${id}c)`} />
      {Array.from({length: 45}, (_, i) => {
        const x = -60 + hash(i * 3 + 1) * 1200, y = 160 + hash(i * 3 + 2) ** 0.5 * (gb - 170), r = 1.4 + hash(i * 3 + 3) * 2.6;
        return (
          <g key={i} opacity={0.5}>
            <circle cx={x} cy={y} r={r} fill="#dfe7e5" opacity={0.35} />
            <path d={`M${x - r * 0.8} ${y + r * 0.3} A ${r} ${r} 0 0 0 ${x + r * 0.8} ${y + r * 0.3}`} stroke="#2a3132" strokeWidth={0.9} fill="none" opacity={0.45} />
          </g>
        );
      })}
      {[0, 1].map((i) => {
        const x = 160 + hash(i + 91) * 760, y0 = 700 + hash(i + 93) * 300, y1 = y0 + 90 + hash(i + 95) * 120;
        return <path key={`d${i}`} d={`M${x} ${y0} q 5 ${(y1 - y0) / 3} -2 ${(y1 - y0) / 2} t 2 ${(y1 - y0) / 2}`} stroke="#d5dddb" strokeWidth={1.2} opacity={0.12} fill="none" />;
      })}
      <rect x={-200} y={P([0, 2.38, 0])[1]} width={1500} height={5} fill="#e8f0ef" opacity={0.05} />
      <rect x={-200} y={P([0, 2.3, 0])[1]} width={1500} height={3} fill="#e8f0ef" opacity={0.04} />
    </>
  );
};

/**
 * Foreground architecture (VD07): wall, head rail, door jambs, transom, sliding leaf with pull handle, sill, floor and
 * the window-shelf end, solid SVG through CameraLayer; a turbulence displacement gives hand-cut edges.
 */
const Architecture = () => {
  const id = useId();
  const FRAME = '#1d2223', EDGE = '#0c0f10', LEAF = '#262c2d';
  const poly = (pts: V3[]) => pts.map((v) => P(v).join(',')).join(' ');
  const quad = (x0: number, y0: number, x1: number, y1: number, z = 0): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
  const tileX = [-1.5, -1.1, -0.7, -0.3, 0.1, 0.5, 0.9, 1.3];
  const tileZ = [-0.35, -0.75, -1.15];
  return (
    <>
      <defs>
        <filter id={`${id}e`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}b`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1="0" y1={P([0, -0.05, 0])[1]} x2="0" y2={P([0, -0.9, 0])[1]}>
          <stop offset="0" stopColor="#a9b2ad" stopOpacity={1} />
          <stop offset="1" stopColor="#a9b2ad" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1="0" y1={P([0, 0, 0])[1]} x2="0" y2={P([0, 0, -1.6])[1]}>
          <stop offset="0" stopColor="#3b4544" />
          <stop offset="0.25" stopColor="#252c2d" />
          <stop offset="1" stopColor="#141819" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}e)`}>
        {/* Floor inside, polished: the bright glass reflected near its base, darker toward the camera. */}
        <polygon points={poly([[-4, 0, 0], [4, 0, 0], [4, 0, -1.7], [-4, 0, -1.7]])} fill={`url(#${id}f)`} />
        {/* The bright panes mirrored in the polished floor, blurred; jambs leave dark gaps. */}
        <g filter={`url(#${id}b)`} opacity={0.22}>
          {[[-1.2, -0.54], [-0.46, 0.46], [0.54, 1.2]].map(([x0, x1]) => <polygon key={x0} points={poly([[x0, -0.05, 0], [x1, -0.05, 0], [x1, -0.9, 0], [x0, -0.9, 0]])} fill={`url(#${id}r)`} />)}
        </g>
        {tileX.map((x) => <line key={`tx${x}`} x1={P([x, 0, 0])[0]} y1={P([x, 0, 0])[1]} x2={P([x, 0, -1.7])[0]} y2={P([x, 0, -1.7])[1]} stroke={EDGE} strokeWidth={2} opacity={0.22} />)}
        {tileZ.map((z) => <line key={`tz${z}`} x1={-200} y1={P([0, 0, z])[1]} x2={1300} y2={P([0, 0, z])[1]} stroke={EDGE} strokeWidth={2} opacity={0.22} />)}
        <polygon points={poly([[-0.6, 0, -0.04], [0.6, 0, -0.04], [0.6, 0, -0.07], [-0.6, 0, -0.07]])} fill="#3e4646" />
        {/* Wall above the glass, head rail, transom bar across the front, bottom rail. */}
        <polygon points={poly([[-4, 2.5, 0], [4, 2.5, 0], [4, 4, 0], [-4, 4, 0]])} fill={FRAME} />
        <polygon points={poly(quad(-4, 2.44, 4, 2.5))} fill="#2a3031" stroke={EDGE} strokeWidth={4} />
        <polygon points={poly(quad(-4, 2.08, 4, 2.16))} fill={FRAME} stroke={EDGE} strokeWidth={4} />
        <polygon points={poly(quad(-4, 0, 4, 0.05))} fill={FRAME} stroke={EDGE} strokeWidth={3} />
        {/* Mullions / door jambs at x +-0.5, with a cool edge where the bright fog wraps the inner face. */}
        {[-0.5, 0.5].map((x) => (
          <g key={x}>
            <polygon points={poly(quad(x - 0.04, 0, x + 0.04, 2.5))} fill={FRAME} stroke={EDGE} strokeWidth={4} />
            <polygon points={poly(quad(x + (x < 0 ? 0.034 : -0.04), 0.05, x + (x < 0 ? 0.04 : -0.034), 2.44))} fill="#56605f" opacity={0.7} />
          </g>
        ))}
        {/* Sliding leaf (closed) on the inside track z -0.05: stiles, rails and the pull handle on its -x edge. */}
        <polygon points={poly(quad(-0.52, 0.05, -0.47, 2.06, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(0.47, 0.05, 0.52, 2.06, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.52, 2.0, 0.52, 2.06, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.52, 0.05, 0.52, 0.17, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.52, 0.165, 0.52, 0.17, -0.05))} fill="#4c5655" opacity={0.6} />
        <polygon points={poly(quad(-0.455, 0.8, -0.43, 1.22, -0.1))} fill="#323a3b" stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.452, 0.82, -0.447, 1.2, -0.1))} fill="#6a7675" opacity={0.8} />
        {[0.85, 1.17].map((y) => <polygon key={y} points={poly([[-0.445, y, -0.1], [-0.44, y, -0.05], [-0.44, y + 0.02, -0.05], [-0.445, y + 0.02, -0.1]])} fill={EDGE} />)}
        {/* Window snack shelf end (x -0.7, z -0.9..-0.5, top 1.1) at the left edge, with packs silhouetted on top. */}
        <polygon points={poly([[-0.7, 0, -0.5], [-0.7, 1.1, -0.5], [-0.7, 1.1, -0.9], [-0.7, 0, -0.9]])} fill="#202627" stroke={EDGE} strokeWidth={3} />
        <polygon points={poly([[-2.6, 1.1, -0.9], [-0.7, 1.1, -0.9], [-0.7, 1.1, -0.5], [-2.6, 1.1, -0.5]])} fill="#2b3233" />
        {[[-0.78, 0.16, 0.2], [-0.98, 0.2, 0.26], [-1.2, 0.18, 0.22]].map(([x, w, h], i) => (
          <polygon key={i} points={poly([[x - w, 1.1, -0.7], [x, 1.1, -0.7], [x - 0.01, 1.1 + h, -0.7], [x - w + 0.015, 1.1 + h * 0.96, -0.7]])} fill="#181c1d" />
        ))}
      </g>
    </>
  );
};

/** Screen-space grade: cool, darker corners (vignette) so the eye stays on the door. */
export const Grade = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 60% at 52% 40%, rgba(8,12,14,0) 55%, rgba(8,12,14,0.38) 100%)'}} />
);

/** Paper grain over the whole picture so painted and SVG layers share one surface. */
export const Grain = ({opacity = 0.09}: {opacity?: number}) => {
  const id = useId();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ plates

export type WindowOpts = {shot: ShotKey; bare?: boolean};

/** SP01 window plate for one shot. `bare` paints only the assembly on white paper (SP01 b mask comparison). */
export const windowShot = ({shot, bare = false}: WindowOpts): PaintedShot => {
  const camera = cameraFor(shot);
  const frameOf = (tl: number) => Math.round(tl * 30);
  return {
    id: `WFOG-SP01-${shot}${bare ? '-bare' : ''}`,
    serves: [shot],
    paper: bare ? '#ffffff' : '#7c8380',
    camera,
    paint: (p, {tl}) => paintWindow(p, SHOT_G0[shot] + frameOf(tl), poseAt(shot, frameOf(tl)), bare),
    Overlay: ({tl, width, height, camera: cam}) => {
      if (bare) return null;
      const f = frameOf(tl), pose = poseAt(shot, f);
      return (
        <>
          <CameraLayer camera={cam} width={width} height={height}>
            <Halos G={SHOT_G0[shot] + f} />
          </CameraLayer>
          <CameraLayer camera={cam} width={width} height={height} opacity={GLOW_PEAK}>
            <Rim parts={assemblyParts(pose)} />
          </CameraLayer>
          <CameraLayer camera={cam} width={width} height={height}>
            <Beam beam={pose.beam} camera={cam} />
          </CameraLayer>
          <CameraLayer camera={cam} width={width} height={height} blend="normal">
            <Glass />
          </CameraLayer>
          <CameraLayer camera={cam} width={width} height={height} blend="normal">
            <Architecture />
          </CameraLayer>
        </>
      );
    },
  };
};

/** Measured anchors for QA (plate px after the camera): helmet top, stack ground, hood/face, umbrella tip. */
export const sp01Anchors = (shot: ShotKey, f: number) => {
  const cam = cameraFor(shot)(f / 30), pose = poseAt(shot, f);
  const parts = assemblyParts(pose).filter((x) => !x.inner);
  const ys = parts.flatMap((x) => x.pts.map((q) => toScreen(cam, q)[1]));
  return {
    top: Math.min(...ys), bottom: Math.max(...ys),
    helmet: toScreen(cam, P(pose.helmet.c)), hand: toScreen(cam, P(pose.rHand)), face: toScreen(cam, P(workerPt(0, 1.47, pose.lean))),
    tip: toScreen(cam, P([STOP.xs + 0.46, 1.6, 0.05])), camera: cam,
  };
};

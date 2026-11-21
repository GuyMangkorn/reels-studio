import {clipPainter} from '../kit/clip-circle';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {frameOf, paintBox as paintOBox, paintFrustum, paintQuad, type Frame3} from '../kit/hand-props';
import {add3, scale3, type V3} from '../kit/space';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camDepth, camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle} from '../kit/world';

// EDU-EP31-SHORT new props and effects (Boss W5.2 batch 1, 2026-11-21). Each piece is a pure function of its arguments (world metres, the yaw
// camera, a seed), drawn through the Painter, so kit intake (W8.4) can lift it as is. Seeds 37000-38999 (set31 uses 31000-36999).
//   new: instant-camera-1995 (intact) and -broken  paintInstantCam   any orientation (Frame3), crack, flash bar on two wires (swing), print eject, spark, puff
//   new: instant-print                            paintInstantPrint  develop 0..1 (dark olive-brown -> pale grey-beige wash, no figure: VD31-13)
//   new: candle (stub, lit)                       paintCandle        flame flicker on the ambient clock
//   new: ink-paper                                paintInkPaper      A5 sheet, brown scorch smiley fading in
//   new: lime-half, new: krok-somtam, lime basket paintLimeHalf, paintKrok, paintLimeBasket
//   new: canvas-money-bag (top view, zip)          paintBagTop
//   lemon half held (side view)                   lemonHalfSide
//   effects                                       starGlint, sparkBurst, puff, floorFlash, droplets, whipSmear
//   thought bubble mini lobby (VD31-16)           paintBubble

const DEG = Math.PI / 180;
const P = (f: Frame3, a: number, b: number, c: number): V3 => add3(add3(add3(f.o, scale3(f.x, a)), scale3(f.y, b)), scale3(f.z, c));
const projAll = (c: YCam, pts: V3[]): Pt[] | null => { const q = pts.map((v) => camPoint(c, v, 0.02)); return q.every(Boolean) ? (q as Pt[]) : null; };
/** A circle in the frame's x/y plane at local (a, b, z), radius r. */
const circXY = (f: Frame3, a: number, b: number, z: number, r: number, n = 22): V3[] => Array.from({length: n}, (_, i) => P(f, a + Math.cos((i / n) * 2 * Math.PI) * r, b + Math.sin((i / n) * 2 * Math.PI) * r, z));
const facesCam = (c: YCam, at: V3, n: V3) => (c.x - at[0]) * n[0] + (c.y - at[1]) * n[1] + (c.z - at[2]) * n[2] > 0;
/** A frame standing on a surface: origin `o`, up +y, front (lens) toward the horizontal direction `yaw` (deg; 0 = +z, 90 = +x). */
export const standFrame = (o: V3, yaw: number, tilt = 0): Frame3 => {
  const fz: V3 = [Math.sin(yaw * DEG) * Math.cos(tilt * DEG), Math.sin(tilt * DEG), Math.cos(yaw * DEG) * Math.cos(tilt * DEG)];
  return frameOf(o, [-Math.sin(yaw * DEG) * Math.sin(tilt * DEG), Math.cos(tilt * DEG), -Math.cos(yaw * DEG) * Math.sin(tilt * DEG)], fz);
};

// ------------------------------------------------------------------ new: instant-camera-1995 / -broken
/** Body size (m): width (x), height (y), depth (z, lens axis). Same as set31 `BROKEN_CAM`. */
export const INSTANT_CAM = {w: 0.13, h: 0.1, d: 0.07};
export type InstantCamOpts = {
  /** false = the intact camera (flash bar seated on top). */
  broken?: boolean;
  /** Star crack on the lens 0..1 (broken only; 1 = full). */
  crack?: number;
  /** Hanging flash bar swing about the hinge, radians in the camera's x/y plane (0 = hanging straight down). */
  swing?: number;
  /** Wire length from the hinge to the bar top (m), default 0.04. */
  drop?: number;
  /** Print out of the front slot 0..1 (0.09 m at 1). */
  eject?: number;
  /** Spark at the flash hinge 0..1 and grey puff 0..1. */
  spark?: number; puff?: number;
  /** Flash tube lit 0..1 (the bar's face glows). */
  fire?: number;
  /** Cartoon oversize (default 1): every length scales (a prop held by the four-head rig reads at 1.3, like the toy pistol's 1.25). */
  scale?: number;
};
export type InstantCamAnchors = {lens: V3; hinge: V3; bar: V3; barFace: V3; slot: V3; top: V3; side: V3};
/** `new: instant-camera-1995` (generic boxy integral-film camera, no brand) in any orientation: `f.o` the bottom centre, `f.y` up, `f.z` the
 *  lens direction, `f.x` the camera's right. Broken (R6, B03-SH01 on): star-cracked lens, grey tape on top, the flash bar off the top-right
 *  corner hanging on a red and a yellow wire. Returns world anchors (lens centre, hinge, bar centre, its face, slot, top, right side centre). */
export const paintInstantCam = (p: Painter, c: YCam, seed: number, f0: Frame3, o: InstantCamOpts = {}): InstantCamAnchors => {
  const S = o.scale ?? 1, f: Frame3 = S === 1 ? f0 : {o: f0.o, x: scale3(f0.x, S), y: scale3(f0.y, S), z: scale3(f0.z, S)};
  const {w, h, d} = INSTANT_CAM, body = '#3b3835', tape = '#a9a59b', fz = d / 2;
  const centre = P(f, 0, h / 2, 0);
  const swing = o.swing ?? 0, drop = o.drop ?? 0.04;
  const hinge = P(f, w / 2 - 0.006, h, fz - 0.012);
  // bar centre: below the hinge on the swing, 0.029 m below the wire end
  const down: V3 = add3(scale3(f.y, -Math.cos(swing)), scale3(f.x, Math.sin(swing)));
  const wireEnd = add3(hinge, add3(scale3(down, drop), scale3(f.x, 0.014)));
  const bar = add3(wireEnd, scale3(down, 0.029));
  const barF: Frame3 = {o: bar, x: add3(scale3(f.x, Math.cos(swing)), scale3(f.y, Math.sin(swing))), y: scale3(down, -1), z: f.z};
  const uS = S; void uS;
  const drawBar = () => {
    if (!o.broken) return;
    paintOBox(p, c, seed + 200, barF, [0.011, 0.029, 0.011], '#2c2a28');
    const faceN = barF.z, fc = P(barF, 0, 0, 0.0115);
    if (facesCam(c, fc, faceN)) {
      const q = projAll(c, [P(barF, -0.007, -0.022, 0.0116), P(barF, 0.007, -0.022, 0.0116), P(barF, 0.007, 0.018, 0.0116), P(barF, -0.007, 0.018, 0.0116)]);
      if (q) hardFill(p, seed + 210, mixColor('#f2efdf', '#fffbe8', o.fire ?? 0), q);
    }
    // two wires: hinge -> a slack bend -> the bar top
    const mid = (k: number): V3 => add3(add3(hinge, scale3(add3(wireEnd, scale3(hinge, -1)), 0.55)), add3(scale3(f.x, 0.012 + k * 0.006), scale3(f.y, 0.004)));
    for (const [k, col] of [[0, '#d8452f'], [1, '#ecc63c']] as const) {
      const pts = projAll(c, [add3(hinge, scale3(f.z, -0.006 * k)), add3(mid(k), scale3(f.z, -0.006 * k)), add3(wireEnd, scale3(f.z, -0.006 * k))]);
      if (pts) inkLine(p, seed + 220 + k, pts, {weight: Math.max(0.9, 0.0011 * camUnit(c, hinge) / 3), color: col});
    }
  };
  const barNear = camDepth(c, bar) < camDepth(c, centre) - 0.01;
  if (!barNear) drawBar();
  // body
  paintOBox(p, c, seed, {o: centre, x: f.x, y: f.y, z: f.z}, [w / 2, h / 2, d / 2], body);
  const front = P(f, 0, h / 2, fz);
  const lensC = P(f, -w * 0.16, h * 0.58, fz + 0.004);
  if (facesCam(c, front, f.z)) {
    const quad = (a0: number, a1: number, b0: number, b1: number, z: number) => projAll(c, [P(f, a0, b0, z), P(f, a1, b0, z), P(f, a1, b1, z), P(f, a0, b1, z)]);
    const stripe = quad(-w / 2, w / 2, h * 0.5, h * 0.62, fz + 0.001); if (stripe) hardFill(p, seed + 30, '#d84a3a', stripe);
    const slot = quad(-w * 0.34, w * 0.34, h * 0.12, h * 0.18, fz + 0.0012); if (slot) hardFill(p, seed + 31, '#141312', slot);
    if (o.broken) { const tp = quad(w * 0.06, w * 0.22, h * 0.72, h + 0.002, fz + 0.0014); if (tp) hardFill(p, seed + 32, tape, tp); }
    const rim = projAll(c, circXY(f, -w * 0.16, h * 0.58, fz + 0.002, 0.031)); if (rim) hardFill(p, seed + 33, '#8d8983', rim);
    const ln = projAll(c, circXY(f, -w * 0.16, h * 0.58, fz + 0.004, 0.024));
    if (ln) {
      hardFill(p, seed + 34, '#121314', ln);
      const hl = projAll(c, circXY(f, -w * 0.16 - 0.008, h * 0.58 + 0.008, fz + 0.005, 0.006, 10)); if (hl) hardFill(p, seed + 35, '#56687a', hl);
      const k = o.broken ? (o.crack ?? 1) : 0;
      if (k > 0) {
        const lc = camPoint(c, lensC, 0.02), r = 0.024 * S * camUnit(c, lensC, 0.02) * 0.95;
        if (lc) {
          const rays = [[-2.5, 0.95], [-1.4, 0.8], [-0.3, 1.0], [0.7, 0.7], [1.6, 0.9], [2.6, 0.75]];
          rays.forEach(([a, kk], i) => inkLine(p, seed + 40 + i, [[lc[0], lc[1]], [lc[0] + Math.cos(a) * r * kk * 0.5 * k + r * 0.06, lc[1] + Math.sin(a) * r * kk * 0.5 * k], [lc[0] + Math.cos(a) * r * kk * k, lc[1] + Math.sin(a) * r * kk * k]], {weight: 0.6, color: '#e9eef3'}));
          if (k > 0.6) inkLine(p, seed + 48, [[lc[0] + r * 0.42, lc[1] - r * 0.18], [lc[0] + r * 0.2, lc[1] - r * 0.44], [lc[0] - r * 0.18, lc[1] - r * 0.42], [lc[0] - r * 0.44, lc[1] - r * 0.12]], {weight: 0.5, color: '#d6dde4'});
        }
      }
    }
  }
  // top: tape (broken) or the seated flash bar (intact)
  const topC = P(f, 0, h, 0);
  if (facesCam(c, topC, f.y)) {
    if (o.broken) { const tp = projAll(c, [P(f, w * 0.06, h + 0.002, -d / 2 - 0.002), P(f, w * 0.22, h + 0.002, -d / 2 - 0.002), P(f, w * 0.22, h + 0.002, fz + 0.002), P(f, w * 0.06, h + 0.002, fz + 0.002)]); if (tp) hardFill(p, seed + 50, tape, tp); }
  }
  if (!o.broken) {
    paintOBox(p, c, seed + 60, {o: P(f, w * 0.22, h + 0.012, fz - 0.016), x: f.x, y: f.y, z: f.z}, [0.029, 0.012, 0.011], '#2c2a28');
    const fq = projAll(c, [P(f, w * 0.22 - 0.022, h + 0.004, fz - 0.004), P(f, w * 0.22 + 0.022, h + 0.004, fz - 0.004), P(f, w * 0.22 + 0.022, h + 0.02, fz - 0.004), P(f, w * 0.22 - 0.022, h + 0.02, fz - 0.004)]);
    if (fq && facesCam(c, front, f.z)) hardFill(p, seed + 70, mixColor('#f2efdf', '#fffbe8', o.fire ?? 0), fq);
  }
  // the print sliding out of the slot (forward, drooping)
  const slotC = P(f, 0, h * 0.15, fz + 0.002);
  if ((o.eject ?? 0) > 0) {
    const L = 0.09 * (o.eject ?? 0), sag = 0.25 * (o.eject ?? 0);
    const tip = add3(slotC, add3(scale3(f.z, L * Math.cos(sag)), scale3(f.y, -L * Math.sin(sag))));
    const q = projAll(c, [add3(slotC, scale3(f.x, -0.044)), add3(slotC, scale3(f.x, 0.044)), add3(tip, scale3(f.x, 0.044)), add3(tip, scale3(f.x, -0.044))]);
    if (q) { hardFill(p, seed + 80, '#f1ede2', q); inkLine(p, seed + 81, q, {closed: true, weight: 0.5, color: '#8a8478'}); }
  }
  if (barNear) drawBar();
  const hp = camPoint(c, hinge, 0.02), u = camUnit(c, hinge, 0.02);
  if (hp && (o.puff ?? 0) > 0) puff(p, seed + 90, hp[0] + 0.01 * u * S, hp[1] - 0.03 * u * S * (0.5 + o.puff!), 0.03 * u * S, o.puff!);
  if (hp && (o.spark ?? 0) > 0) sparkBurst(p, seed + 100, hp[0], hp[1], 0.03 * u * S * (0.6 + 0.4 * o.spark!), o.spark!);
  return {lens: lensC, hinge, bar, barFace: P(barF, 0, 0, 0.012), slot: slotC, top: topC, side: P(f, w / 2, h / 2, 0)};
};

// ------------------------------------------------------------------ effects (picture px)
/** Spark: a yellow-orange star with a pale core and a few streaks (k 0..1 fades it). */
export const sparkBurst = (p: Painter, seed: number, x: number, y: number, r: number, k = 1) => {
  if (k <= 0) return;
  const star: Pt[] = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - 0.2 + seed * 0.37, kk = i % 2 ? 0.32 : (i % 4 ? 0.8 : 1.0); star.push([x + Math.cos(a) * r * kk * k, y + Math.sin(a) * r * kk * k]); }
  hardFill(p, seed, '#ffb22e', star);
  hardFill(p, seed + 1, '#fff6b8', star.map(([sx, sy]) => [x + (sx - x) * 0.55, y + (sy - y) * 0.55] as Pt));
  inkLine(p, seed + 2, star, {closed: true, weight: 0.5, color: '#c9661a'});
  for (let i = 0; i < 4; i++) { const a = seed * 1.3 + i * 1.7; inkLine(p, seed + 3 + i, [[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r * (1.5 + 0.6 * k), y + Math.sin(a) * r * (1.5 + 0.6 * k)]], {weight: 0.9, color: '#ff9a1e'}); }
};
/** Grey puff of smoke rising (k 0..1: growth; fades past 0.7). */
export const puff = (p: Painter, seed: number, x: number, y: number, r: number, k: number) => {
  if (k <= 0) return;
  const op = 110 * Math.min(1, k * 3) * (k > 0.7 ? (1 - k) / 0.3 : 1), s = 0.6 + 0.8 * k;
  washAt(p, seed, '#a39d92', op, ell(x, y, r * 1.3 * s, r * 0.9 * s, 16), 0.35, 0.3);
  washAt(p, seed + 1, '#bdb7ac', op * 0.8, ell(x + r * 0.8 * s, y - r * 1.0 * s, r * 0.9 * s, r * 0.6 * s, 14), 0.35, 0.3);
  washAt(p, seed + 2, '#cfc9bf', op * 0.6, ell(x - r * 0.5 * s, y - r * 1.6 * s, r * 0.7 * s, r * 0.5 * s, 12), 0.35, 0.3);
};
/** 4-point star glint (the heist "ting"), size px, k 0..1 (grow then fade). */
export const starGlint = (p: Painter, seed: number, x: number, y: number, size: number, k: number) => {
  if (k <= 0) return;
  const s = size * k / 2, w = s * 0.18;
  const pts: Pt[] = [[x, y - s], [x + w, y - w], [x + s, y], [x + w, y + w], [x, y + s], [x - w, y + w], [x - s, y], [x - w, y - w]];
  hardFill(p, seed, '#fffbe8', pts);
  hardFill(p, seed + 1, '#ffffff', ell(x, y, w * 1.4, w * 1.4, 10));
};
/** Flash light pooled on a floor around world point `at` (radius m), op 0..255. */
export const floorFlash = (p: Painter, c: YCam, seed: number, at: V3, r: number, op: number) => {
  if (op <= 0) return;
  for (let i = 0; i < 4; i++) { const pts = flatCircle(c, [at[0], at[1] + 0.002, at[2]], r * (1 - i * 0.22), 28); if (pts.length > 2) washAt(p, seed + i, i < 2 ? '#fff4d8' : '#ffffff', op * (0.35 + i * 0.2), pts, 0.3, 0.1); }
};
/** Juice droplets: n drops along an arc from `a` to `b` (px), progress k 0..1, radius r px. */
export const droplets = (p: Painter, seed: number, a: Pt, b: Pt, k: number, r: number, n = 6) => {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < n; i++) {
    const u = Math.max(0, Math.min(1, k * 1.3 - i * 0.06)), x = a[0] + (b[0] - a[0]) * u + Math.sin(i * 2.3) * r * 2, y = a[1] + (b[1] - a[1]) * u - Math.sin(Math.PI * u) * r * 4 + Math.cos(i * 1.7) * r;
    hardFill(p, seed + i, '#f3f7d8', ell(x, y, r * (0.8 + 0.2 * (i % 2)), r * 1.15, 8));
    inkLine(p, seed + 20 + i, ell(x, y, r, r * 1.2, 8), {closed: true, weight: 0.35, color: '#9bb04a'});
  }
};
/** Whip-pan smear: horizontal streaks across the frame in the set colours, strength k 0..1 (screen space). */
export const whipSmear = (p: Painter, seed: number, colors: string[], k: number) => {
  if (k <= 0) return;
  for (let i = 0; i < 26; i++) {
    const y = ((i * 0.61803) % 1) * 1920, h = 30 + ((i * 37) % 7) * 22, col = colors[i % colors.length];
    washAt(p, seed + i, col, 120 * k, [[-60, y], [1140, y + 8], [1140, y + h], [-60, y + h - 6]], 0.1, 0.25);
  }
};

// ------------------------------------------------------------------ new: instant-print
/** Integral print 0.088 x 0.107 (image 0.079 square, wide bottom border). `f.o` centre, `f.x` across, `f.y` toward the top edge, `f.z` the face
 *  normal. `develop` 0..1: dark olive-brown -> an indistinct pale grey-beige wash, flat (VD31-13: no figure, no room). */
export const PRINT = {w: 0.088, h: 0.107, img: 0.079};
export const paintInstantPrint = (p: Painter, c: YCam, seed: number, f: Frame3, develop: number) => {
  const {w, h, img} = PRINT;
  paintQuad(p, c, seed, f, w / 2, h / 2, '#f3efe4');
  const top = h / 2 - 0.0045, cy = top - img / 2;
  const k = Math.max(0, Math.min(1, develop));
  const col = k < 0.5 ? mixColor('#2f2b19', '#7d7556', k / 0.5) : mixColor('#7d7556', '#cfc6b0', (k - 0.5) / 0.5);
  const im: Frame3 = {o: P(f, 0, cy, 0.0004), x: f.x, y: f.y, z: f.z};
  paintQuad(p, c, seed + 3, im, img / 2, img / 2, col, false);
  // a faint, shapeless mottle that flattens out as it develops (never a figure)
  const m = 1 - k;
  if (m > 0.05) for (let i = 0; i < 3; i++) {
    const q = projAll(c, circXY(im, (i - 1) * 0.018, Math.sin(i * 2.1) * 0.012, 0.0002, 0.016 + 0.004 * i, 14));
    if (q) washAt(p, seed + 6 + i, mixColor(col, '#1e1b10', 0.4), 70 * m, q, 0.4, 0.2);
  }
  const fr = projAll(c, [P(f, -img / 2, top, 0.0005), P(f, img / 2, top, 0.0005), P(f, img / 2, top - img, 0.0005), P(f, -img / 2, top - img, 0.0005)]);
  if (fr) inkLine(p, seed + 12, fr, {closed: true, weight: 0.4, color: '#b4ad9c'});
};

/** The print held in a mitten, in picture px: centre (x, y), `u` px per metre, `ang` roll (rad), develop as above (face toward the lens). */
export const printPx = (p: Painter, seed: number, x: number, y: number, u: number, ang: number, develop: number) => {
  const {w, h, img} = PRINT, ca = Math.cos(ang), sa = Math.sin(ang);
  const at = (a: number, b: number): Pt => [x + (a * ca - b * sa) * u, y + (a * sa + b * ca) * u];
  const card = [at(-w / 2, -h / 2), at(w / 2, -h / 2), at(w / 2, h / 2), at(-w / 2, h / 2)];
  hardFill(p, seed, '#f3efe4', card);
  inkLine(p, seed + 1, card, {closed: true, weight: 0.6, color: '#8a8478'});
  const k = Math.max(0, Math.min(1, develop)), col = k < 0.5 ? mixColor('#2f2b19', '#7d7556', k / 0.5) : mixColor('#7d7556', '#cfc6b0', (k - 0.5) / 0.5);
  const t0 = -h / 2 + 0.0045;
  hardFill(p, seed + 2, col, [at(-img / 2, t0), at(img / 2, t0), at(img / 2, t0 + img), at(-img / 2, t0 + img)]);
};

// ------------------------------------------------------------------ new: candle (stub in a saucer, lit)
/** Stub candle: saucer at `at` (table top), wax 0.03 m, flame tip `at.y + 0.055`. `t` the ambient clock (flicker); `lit` 0..1. */
export const paintCandle = (p: Painter, c: YCam, seed: number, at: V3, t: number, lit = 1) => {
  const sa = flatCircle(c, [at[0], at[1] + 0.003, at[2]], 0.06, 20); if (sa.length > 2) { hardFill(p, seed, '#e8e2d2', sa); inkLine(p, seed + 1, sa, {closed: true, weight: 0.5, color: '#9d9482'}); }
  paintFrustum(p, c, seed + 2, frameOf([at[0], at[1] + 0.004, at[2]], [0, 1, 0], [0, 0, 1]), 0, 0.03, 0.022, 0.021, '#f3ead2', '#f7f0dc', 16);
  const wick = camPoint(c, [at[0], at[1] + 0.034, at[2]], 0.02), wt = camPoint(c, [at[0], at[1] + 0.04, at[2]], 0.02);
  if (wick && wt) inkLine(p, seed + 50, [wick, wt], {weight: 0.8, color: '#2a2018'});
  if (lit <= 0) return;
  const u = camUnit(c, [at[0], at[1] + 0.04, at[2]], 0.02), fl = 1 + 0.08 * Math.sin(t * 23) + 0.05 * Math.sin(t * 37 + 1);
  const b = camPoint(c, [at[0], at[1] + 0.038, at[2]], 0.02);
  if (!b) return;
  const hgt = 0.02 * u * fl * lit, wd = 0.006 * u * lit, sway = Math.sin(t * 9) * wd * 0.25;
  washAt(p, seed + 60, '#ffcf7a', 70 * lit, ell(b[0], b[1] - hgt * 0.5, hgt * 1.6, hgt * 1.6, 18), 0.3, 0.1);
  const flame: Pt[] = [[b[0] - wd, b[1]], [b[0] - wd * 0.8, b[1] - hgt * 0.45], [b[0] + sway, b[1] - hgt], [b[0] + wd * 0.8, b[1] - hgt * 0.45], [b[0] + wd, b[1]], [b[0], b[1] + wd * 0.5]];
  hardFill(p, seed + 61, '#ffb648', flame);
  hardFill(p, seed + 62, '#fff4c2', flame.map(([x, y]) => [b[0] + (x - b[0]) * 0.5, b[1] + (y - b[1]) * 0.6 - hgt * 0.05] as Pt));
};

// ------------------------------------------------------------------ new: ink-paper (A5, lemon-juice doodle)
/** A5 sheet 0.15 x 0.21; `f.o` centre, `f.y` the long axis, `f.z` the face toward the viewer. `doodle` 0..1 fades in a brown scorch smiley. */
export const INK_PAPER = {w: 0.15, h: 0.21};
export const paintInkPaper = (p: Painter, c: YCam, seed: number, f: Frame3, doodle: number) => {
  paintQuad(p, c, seed, f, INK_PAPER.w / 2, INK_PAPER.h / 2, '#f4efe2');
  const k = Math.max(0, Math.min(1, doodle));
  if (k <= 0.01) return;
  const col = mixColor('#f4efe2', '#8a5320', k), wgt = 1.4 + 0.6 * k;
  const pt = (a: number, b: number) => camPoint(c, P(f, a, b, 0.0006), 0.02);
  const face = Array.from({length: 26}, (_, i) => pt(Math.cos((i / 26) * 2 * Math.PI) * 0.05, 0.01 + Math.sin((i / 26) * 2 * Math.PI) * 0.05));
  if (face.every(Boolean)) inkLine(p, seed + 5, face as Pt[], {closed: true, weight: wgt, color: col});
  for (const s of [-1, 1]) { const e = pt(s * 0.018, 0.025); if (e) hardFill(p, seed + 7 + (s > 0 ? 1 : 0), col, ell(e[0], e[1], 0.005 * camUnit(c, f.o, 0.02), 0.007 * camUnit(c, f.o, 0.02), 8)); }
  const grin = Array.from({length: 9}, (_, i) => pt(-0.03 + i * 0.0075, -0.005 - Math.sin((i / 8) * Math.PI) * 0.02));
  if (grin.every(Boolean)) inkLine(p, seed + 10, grin as Pt[], {weight: wgt, color: col});
};

// ------------------------------------------------------------------ lemon half seen from the side (held, B01-SH03 / B03-SH02)
/** A lemon half in picture px: rind dome on the side away from `ang` and the pale cut face toward it (ang = direction the cut face points, rad). */
export const lemonHalfSide = (p: Painter, seed: number, x: number, y: number, r: number, ang: number, squash = 0) => {
  const ca = Math.cos(ang), sa = Math.sin(ang), rr = r * (1 - 0.15 * squash);
  const at = (a: number, b: number): Pt => [x + a * ca - b * sa, y + a * sa + b * ca];
  const dome: Pt[] = [];
  for (let i = 0; i <= 14; i++) { const t = Math.PI / 2 + (i / 14) * Math.PI; dome.push(at(Math.cos(t) * rr * 0.75, Math.sin(t) * r * 1.15)); }
  hardFill(p, seed, '#f1c816', dome);
  hardFill(p, seed + 1, '#f8e04a', dome.map(([px, py]) => [x + (px - x) * 0.7 - ca * r * 0.12, y + (py - y) * 0.7 - sa * r * 0.12] as Pt));
  const cut: Pt[] = Array.from({length: 16}, (_, i) => { const t = (i / 16) * 2 * Math.PI; return at(Math.cos(t) * r * 0.16, Math.sin(t) * r * 1.15); });
  hardFill(p, seed + 2, '#fbf2c4', cut);
  hardFill(p, seed + 3, '#f5df5a', cut.map(([px, py]) => [x + (px - x) * 0.82, y + (py - y) * 0.86] as Pt));
  inkLine(p, seed + 4, [...dome, dome[0]], {weight: 0.7, color: '#8a6a10'});
};

// ------------------------------------------------------------------ Space T props: krok som tam, lime half, lime basket
/** Lime half cut side up (or toward `f.z`), radius r (m). */
export const paintLimeHalf = (p: Painter, c: YCam, seed: number, f: Frame3, r: number, squeeze = 0) => {
  const rr = r * (1 - 0.18 * squeeze);
  // cut face turned away from the lens (squeezing cut side down): only the rind dome shows, with its noon highlight
  if ((c.x - f.o[0]) * f.z[0] + (c.y - f.o[1]) * f.z[1] + (c.z - f.o[2]) * f.z[2] < 0) {
    const rim = projAll(c, circXY(f, 0, 0, 0, rr, 26)), dome = projAll(c, circXY(f, 0, 0, -r * 0.5 * (1 - 0.3 * squeeze), rr * 0.7, 22));
    if (rim) hardFill(p, seed, '#3f8a2a', rim);
    if (dome) hardFill(p, seed + 1, '#5aa832', dome);
    const hi = projAll(c, circXY(f, -rr * 0.25, rr * 0.2, -r * 0.62 * (1 - 0.3 * squeeze), rr * 0.22, 12)); if (hi) hardFill(p, seed + 2, '#a8d873', hi);
    if (rim) inkLine(p, seed + 20, rim, {closed: true, weight: 0.6, color: '#2f5a1c'});
    return;
  }
  const side = projAll(c, circXY(f, 0, 0, -r * 0.45 * (1 - 0.3 * squeeze), rr, 24)); if (side) hardFill(p, seed, '#3f8a2a', side);
  const rind = projAll(c, circXY(f, 0, 0, 0, rr, 26)); if (rind) hardFill(p, seed + 1, '#5aa832', rind);
  const pith = projAll(c, circXY(f, 0, 0, 0.0005, rr * 0.9, 26)); if (pith) hardFill(p, seed + 2, '#e8f2c6', pith);
  const flesh = projAll(c, circXY(f, 0, 0, 0.001, rr * 0.8, 26)); if (flesh) hardFill(p, seed + 3, '#b9d86a', flesh);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * 2 * Math.PI, q = projAll(c, [P(f, Math.cos(a) * rr * 0.1, Math.sin(a) * rr * 0.1, 0.0012), P(f, Math.cos(a) * rr * 0.78, Math.sin(a) * rr * 0.78, 0.0012)]); if (q) inkLine(p, seed + 10 + i, q, {weight: 0.45, color: '#e6f0c0'}); }
  if (rind) inkLine(p, seed + 20, rind, {closed: true, weight: 0.6, color: '#2f5a1c'});
};
/** Clay krok on the counter: base centre `at`, rim radius 0.11, height 0.18, filled with som tam (shredded papaya, tomato, long beans, peanuts). */
export const paintKrok = (p: Painter, c: YCam, seed: number, at: V3, t = 0) => {
  void t;
  const sh = flatCircle(c, [at[0] + 0.02, at[1] + 0.001, at[2] + 0.02], 0.12, 24); if (sh.length > 2) washAt(p, seed, '#3a2a1a', 90, sh, 0.25, 0.1);
  paintFrustum(p, c, seed + 1, frameOf(at, [0, 1, 0], [0, 0, 1]), 0, 0.18, 0.075, 0.11, '#8a4b2c', undefined, 26);
  const rim = flatCircle(c, [at[0], at[1] + 0.18, at[2]], 0.11, 30); if (rim.length > 2) hardFill(p, seed + 50, '#9c5834', rim);
  const inner = flatCircle(c, [at[0], at[1] + 0.181, at[2]], 0.095, 30); if (inner.length > 2) hardFill(p, seed + 51, '#5d2f19', inner);
  const salad = flatCircle(c, [at[0], at[1] + 0.17, at[2]], 0.088, 30); if (salad.length > 2) hardFill(p, seed + 52, '#c9d98e', salad);
  const y = at[1] + 0.172;
  for (let i = 0; i < 34; i++) { // papaya shreds
    const a = i * 2.39996, rr = 0.075 * Math.sqrt(((i * 0.618) % 1)), x0 = at[0] + Math.cos(a) * rr, z0 = at[2] + Math.sin(a) * rr, d = 0.022, b = a * 1.7;
    const q = projAll(c, [[x0, y, z0], [x0 + Math.cos(b) * d, y + 0.002, z0 + Math.sin(b) * d]]); if (q) inkLine(p, seed + 60 + i, q, {weight: 1.2, color: i % 3 ? '#e9f2bf' : '#b8cf70'});
  }
  const bits: [number, number, string, number][] = [[-0.04, -0.02, '#d9412e', 0.016], [0.03, 0.035, '#e0533a', 0.014], [0.045, -0.03, '#d9412e', 0.013], [-0.01, 0.045, '#6f9a3a', 0.009], [0.0, -0.05, '#6f9a3a', 0.009]];
  bits.forEach(([dx, dz, col, r], i) => { const q = flatCircle(c, [at[0] + dx, y + 0.004, at[2] + dz], r, 12); if (q.length > 2) { hardFill(p, seed + 100 + i, col, q); inkLine(p, seed + 110 + i, q, {closed: true, weight: 0.4, color: mixColor(col, '#2b1a10', 0.5)}); } });
  for (let i = 0; i < 9; i++) { const q = flatCircle(c, [at[0] + Math.cos(i * 1.9) * 0.05, y + 0.005, at[2] + Math.sin(i * 1.9) * 0.05], 0.005, 8); if (q.length > 2) hardFill(p, seed + 120 + i, '#c89a5c', q); }
  if (rim.length > 2) inkLine(p, seed + 140, rim, {closed: true, weight: 0.8, color: '#4a2412'});
};
/** A shallow woven basket of limes (rim radius 0.12) at `at` on the counter. */
export const paintLimeBasket = (p: Painter, c: YCam, seed: number, at: V3) => {
  paintFrustum(p, c, seed, frameOf(at, [0, 1, 0], [0, 0, 1]), 0, 0.05, 0.1, 0.13, '#b88a4a', '#7a5a2e', 24);
  for (let i = 0; i < 9; i++) {
    const a = i * 2.3, r = i ? 0.075 : 0, q = camPoint(c, [at[0] + Math.cos(a) * r, at[1] + 0.07, at[2] + Math.sin(a) * r], 0.02);
    if (!q) continue;
    const R = 0.026 * camUnit(c, [at[0], at[1] + 0.07, at[2]], 0.02);
    hardFill(p, seed + 40 + i, '#4f9a2e', ell(q[0], q[1], R, R * 0.9, 14));
    hardFill(p, seed + 60 + i, '#7cc04a', ell(q[0] - R * 0.3, q[1] - R * 0.3, R * 0.35, R * 0.25, 8));
    inkLine(p, seed + 80 + i, ell(q[0], q[1], R, R * 0.9, 14), {closed: true, weight: 0.5, color: '#2a5a18'});
  }
};

// ------------------------------------------------------------------ new: canvas-money-bag, top view with a zip (B03-SH05)
/** Canvas bag lying on the table, seen from above: centre `at` (top surface), 0.34 x 0.2 m, `zip` 0..1 closed from right to left; returns the
 *  zip-pull world point (for the mitten). No symbol or figure (VD31-15). */
export const paintBagTop = (p: Painter, c: YCam, seed: number, at: V3, zip: number): V3 => {
  const [x, y, z] = at, w = 0.17, d = 0.1;
  const sh = flatCircle(c, [x + 0.015, 0.682, z + 0.02], 0.2, 24).map(([px, py]) => [px, py] as Pt); if (sh.length > 2) washAt(p, seed, '#1a120a', 90, sh, 0.25, 0.1);
  const body: V3[] = [[x - w, y - 0.03, z - d], [x + w, y - 0.03, z - d - 0.01], [x + w + 0.01, y - 0.03, z + d], [x - w - 0.01, y - 0.03, z + d + 0.01]];
  const b = projAll(c, body); if (b) { hardFill(p, seed + 1, '#c8b88e', b); inkLine(p, seed + 2, b, {closed: true, weight: 0.8, color: '#5e5034'}); }
  const top: V3[] = [[x - w + 0.01, y, z - d * 0.7], [x + w - 0.01, y, z - d * 0.7], [x + w - 0.01, y, z + d * 0.7], [x - w + 0.01, y, z + d * 0.7]];
  const tq = projAll(c, top); if (tq) hardFill(p, seed + 3, '#d6c79f', tq);
  // the open gap (dark, a note corner inside) shrinking from right to left as the zip runs
  const k = Math.max(0, Math.min(1, zip)), xz = x + w - 0.02 - k * (2 * w - 0.04);
  const gap = projAll(c, [[x - w + 0.02, y + 0.001, z - 0.018], [xz, y + 0.001, z - 0.004], [xz, y + 0.001, z + 0.004], [x - w + 0.02, y + 0.001, z + 0.018]]);
  if (gap && xz > x - w + 0.03) { hardFill(p, seed + 4, '#2a2218', gap); const n = projAll(c, [[x - 0.08, y + 0.002, z - 0.012], [x - 0.02, y + 0.002, z - 0.01], [x - 0.03, y + 0.002, z + 0.004]]); if (n && xz > x - 0.02) hardFill(p, seed + 5, '#7fae78', n); }
  const zl = projAll(c, [[x - w + 0.02, y + 0.0015, z], [x + w - 0.02, y + 0.0015, z]]); if (zl) inkLine(p, seed + 6, zl, {weight: 1.6, color: '#6a6352'});
  const closed = projAll(c, [[xz, y + 0.002, z], [x + w - 0.02, y + 0.002, z]]); if (closed) inkLine(p, seed + 7, closed, {weight: 2.4, color: '#4a4436'});
  const pull: V3 = [xz, y + 0.004, z];
  const pq = projAll(c, [[xz - 0.012, y + 0.004, z - 0.007], [xz + 0.004, y + 0.004, z - 0.007], [xz + 0.004, y + 0.004, z + 0.007], [xz - 0.012, y + 0.004, z + 0.007]]);
  if (pq) { hardFill(p, seed + 8, '#b9b4a6', pq); inkLine(p, seed + 9, pq, {closed: true, weight: 0.6, color: '#3a3528'}); }
  // straps folded over the top
  for (const s of [-1, 1]) { const q = projAll(c, [[x + s * 0.07 - 0.012, y + 0.003, z - d], [x + s * 0.07 + 0.012, y + 0.003, z - d], [x + s * 0.06 + 0.012, y + 0.003, z - d - 0.12], [x + s * 0.06 - 0.012, y + 0.003, z - d - 0.12]]); if (q) { hardFill(p, seed + 10 + (s > 0 ? 1 : 0), '#a8966a', q); inkLine(p, seed + 12 + (s > 0 ? 1 : 0), q, {closed: true, weight: 0.5, color: '#5e5034'}); } }
  return pull;
};

// ------------------------------------------------------------------ VD31-16 thought bubble with the mini lobby (B02-SH02)
export type BubbleState = {cx: number; cy: number; r: number; grow: number; trail: number[]; trailPts: [number, number, number][];
  /** walker progress 0..1 across the bubble (dotted empty outline), -1 = absent */ walk: number;
  /** little CCTV camera: pan angle (deg, + toward screen right) and tilt (deg, puzzled roll) */ camPan: number; camTilt: number};
/** Round thought bubble (screen px) with trailing circles; inside, clipped to the circle: a mini bank lobby, the CCTV box camera on its bracket
 *  turning, and the dotted empty outline of him walking by (his belief: the camera sees no one). */
export const paintBubble = (p: Painter, seed: number, b: BubbleState) => {
  b.trailPts.forEach(([x, y, r], i) => { const k = b.trail[i] ?? 0; if (k <= 0) return; hardFill(p, seed + i, '#fbf6ea', ell(x, y, r * k, r * k, 14)); inkLine(p, seed + 10 + i, ell(x, y, r * k, r * k, 14), {closed: true, weight: 0.9, color: '#5a4a3a'}); });
  if (b.grow <= 0.01) return;
  const r = b.r * b.grow, cx = b.cx, cy = b.cy;
  hardFill(p, seed + 20, '#fbf6ea', ell(cx, cy, r, r, 48));
  const q = clipPainter(p, cx, cy, r * 0.94);
  const s = r / 220; // mini-lobby scale
  // mini lobby: cream upper wall, teal panel, terrazzo floor, a teller window, the doorway glow
  q.flat('#e9dfc8', [[cx - r, cy - r], [cx + r, cy - r], [cx + r, cy + 40 * s], [cx - r, cy + 40 * s]]);
  q.flat('#2f6a63', [[cx - r, cy + 0 * s], [cx + r, cy + 0 * s], [cx + r, cy + 40 * s], [cx - r, cy + 40 * s]]);
  q.flat('#b9b3a6', [[cx - r, cy + 40 * s], [cx + r, cy + 40 * s], [cx + r, cy + r], [cx - r, cy + r]]);
  hardFill(q, seed + 30, '#fff4d6', [[cx + 60 * s, cy - 90 * s], [cx + 150 * s, cy - 90 * s], [cx + 150 * s, cy + 40 * s], [cx + 60 * s, cy + 40 * s]]);
  hardFill(q, seed + 31, '#9a6b3e', [[cx - 200 * s, cy - 10 * s], [cx + 20 * s, cy - 10 * s], [cx + 20 * s, cy + 40 * s], [cx - 200 * s, cy + 40 * s]]);
  // the walker: a dotted empty outline (head circle + body), walking left -> right
  if (b.walk >= 0 && b.walk <= 1) {
    const wx = cx - 150 * s + 300 * s * b.walk, wy = cy + 120 * s, bob = Math.abs(Math.sin(b.walk * Math.PI * 6)) * 4 * s;
    const dots: Pt[] = [];
    for (let i = 0; i < 14; i++) { const a = (i / 14) * 2 * Math.PI; dots.push([wx + Math.cos(a) * 16 * s, wy - 120 * s - bob + Math.sin(a) * 18 * s]); }
    const bodyPts: Pt[] = [[wx - 24 * s, wy - 98 * s], [wx + 24 * s, wy - 98 * s], [wx + 20 * s, wy - 40 * s], [wx + 14 * s, wy], [wx + 4 * s, wy], [wx, wy - 36 * s], [wx - 4 * s, wy], [wx - 14 * s, wy], [wx - 20 * s, wy - 40 * s]];
    for (let i = 0; i < bodyPts.length; i++) { const a = bodyPts[i], c2 = bodyPts[(i + 1) % bodyPts.length]; for (let k = 0; k < 4; k++) { const u = k / 4; dots.push([a[0] + (c2[0] - a[0]) * u, a[1] + (c2[1] - a[1]) * u - bob]); } }
    dots.forEach(([x, y], i) => hardFill(q, seed + 40 + i, '#4a3a2c', ell(x, y, 2.6 * s, 2.6 * s, 6)));
  }
  // the CCTV box camera on a bracket, upper left, panning and tilting
  const bx = cx - 120 * s, by = cy - 110 * s, pan = b.camPan * DEG, tilt = b.camTilt * DEG;
  hardFill(q, seed + 100, '#8a8f93', [[bx - 50 * s, by - 26 * s], [bx - 40 * s, by - 26 * s], [bx - 40 * s, by + 4 * s], [bx - 50 * s, by + 4 * s]]);
  const L = 70 * s * (0.75 + 0.25 * Math.cos(pan)), H = 30 * s, ca = Math.cos(tilt + 0.25), sa = Math.sin(tilt + 0.25);
  const R = (x: number, y: number): Pt => [bx + x * ca - y * sa, by + x * sa + y * ca];
  const dir = Math.sin(pan) >= -0.2 ? 1 : -1;
  const box = [R(-10 * s, -H / 2), R(L, -H / 2), R(L, H / 2), R(-10 * s, H / 2)].map(([x, y]) => [bx + (x - bx) * dir, y] as Pt);
  hardFill(q, seed + 101, '#d8d6cf', box);
  inkLine(q, seed + 102, box, {closed: true, weight: 0.9, color: '#3a3a3a'});
  const lens = R(L + 2 * s, 0), lx = bx + (lens[0] - bx) * dir;
  hardFill(q, seed + 103, '#2a2a2e', ell(lx, lens[1], 9 * s * (0.6 + 0.4 * Math.cos(pan)), 11 * s, 12));
  const led = R(L * 0.2, -H / 2 + 6 * s); hardFill(q, seed + 104, '#ff2a1e', ell(bx + (led[0] - bx) * dir, led[1], 3.5 * s, 3.5 * s, 8));
  inkLine(p, seed + 120, ell(cx, cy, r, r, 48), {closed: true, weight: 1.4, color: '#5a4a3a'});
};

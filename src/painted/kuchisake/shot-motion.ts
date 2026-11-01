import amplitude from '../../../scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json';
import {drawFigure, H, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {capsule, ell, inkLine, lineOf, solid, toneOf, type InteriorLight} from '../kit/draw';
import {CHIN, HEAD_SPAN, paintHeadFront} from '../kit/head';
import {clamp01, mixColor, type Painter, type Pt} from '../kit/painter';
import {shoulderAnchors} from '../kit/poses';
import type {HandTone} from '../kit/hands';

// KSO-EP01-SHORT shot motion helpers (Draft-tab fixes, 1 Nov 2026): the lip-sync envelope, rig arm targets from pose offsets,
// the two-mass hand, and a head that tilts about the neck while the shoulders stay still. Pure functions of the shot clock.

/**
 * Narration amplitude per timeline frame (30 fps, 0..1; `KSO-EP01-SHORT.amplitude.json`). Editor may replace `amp` (a re-timed
 * mix); an empty array falls back to the default envelope. Plates read it through `talkOpen(globalFrame)`.
 */
export const KSO_AMP: {amp: readonly number[]} = {amp: amplitude};

/** Default envelope when no amplitude is loaded: syllable-like pulses (about 4 per second), pure in the frame. */
export const defaultOpen = (g: number): number => Math.max(0, Math.sin(g * 0.8) * 0.5 + Math.sin(g * 0.33 + 1) * 0.3) * 0.4;

/**
 * Mouth opening 0..`max` at global (timeline) frame `g`: the amplitude smoothed over 5 frames, a noise floor of 0.05 cut, scaled
 * so the loud syllables reach `max`. The kit `talk` mouth is a closed line below 0.08 and an ellipse above it.
 */
export const talkOpen = (g: number, max = 0.45): number => {
  const a = KSO_AMP.amp;
  if (a.length === 0) return Math.min(max, defaultOpen(g));
  let s = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const i = Math.round(g) + k;
    if (i >= 0 && i < a.length) {
      s += a[i];
      n++;
    }
  }
  const v = n ? s / n : 0;
  return clamp01((v - 0.05) * 1.6) * max;
};

/** Smoothstep on [0, 1]. */
export const sm = (u: number) => {
  const x = clamp01(u);
  return x * x * (3 - 2 * x);
};

/** Arm target in plate px from a front-view shoulder anchor plus an offset in metres (u screen-right, v up), as poses.ts does. */
export const armTarget = (def: CastDef, g: Pt, unit: number, side: 'r' | 'l', off: Pt): Pt => {
  const S = shoulderAnchors(def)[side];
  return [g[0] + (S[0] + off[0]) * unit, g[1] - (S[1] + off[1]) * unit];
};
/** Shoulder anchor in plate px (front view, standing). */
export const shoulderPx = (def: CastDef, g: Pt, unit: number, side: 'r' | 'l'): Pt => armTarget(def, g, unit, side, [0, 0]);

/**
 * The hand as two painted masses (user note, 1 Nov 2026): a four-finger mass (slightly elongated blob, wrist to fingertips) and
 * a thumb mass. `wrist` and `tip` (fingertips) set the size and direction; `thumb` is the thumb tip. `side` is the side the
 * thumb sits on (+1 left of the wrist-to-tip direction on screen, -1 right). Three short strokes at the tip divide the fingers.
 */
export const paintMassHand = (p: Painter, base: number, tone: HandTone, wrist: Pt, tip: Pt, thumb: Pt, side: 1 | -1) => {
  const dx = tip[0] - wrist[0], dy = tip[1] - wrist[1], L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side; // n: the thumb side
  const along = (d: number, o: number): Pt => [wrist[0] + ux * L * d + nx * L * o, wrist[1] + uy * L * d + ny * L * o];
  // Thumb mass first (it leaves the palm edge and sits behind the fingers at the base): from the palm to the thumb tip.
  const tb = along(0.12, 0.2);
  const thumbPts = capsule(tb, thumb, L * 0.24, L * 0.19, 8);
  solid(p, base + 1, tone.shade, thumbPts, 4, 0.04);
  solid(p, base + 4, tone.skin, capsule(tb, thumb, L * 0.18, L * 0.13, 8), 4, 0.04);
  inkLine(p, base + 11, thumbPts, {weight: 1.2, curve: 0.3, color: tone.crease});
  // Four-finger mass: a shade blob, a lighter blob toward the side opposite the thumb, the outline, three gaps and four nails at the tip.
  const fingers = capsule(wrist, tip, L * 0.46, L * 0.58, 8);
  solid(p, base + 2, tone.shade, fingers, 4, 0.04);
  solid(p, base + 3, tone.skin, capsule(along(0.02, -0.03), along(0.98, -0.03), L * 0.36, L * 0.5, 8), 4, 0.04);
  inkLine(p, base + 12, fingers, {weight: 1.3, curve: 0.3, color: tone.crease});
  for (let i = 0; i < 3; i++) {
    const o = (i - 1) * L * 0.145;
    inkLine(p, base + 13 + i, [along(1.0, o), along(0.62, o)], {weight: 1.3, curve: 0.1, closed: false, color: tone.crease});
  }
  for (let i = 0; i < 4; i++) {
    const o = (i - 1.5) * L * 0.145;
    const c = along(0.93, o);
    solid(p, base + 20 + i, tone.nail, ell(c[0], c[1], L * 0.045, L * 0.06, 10, Math.atan2(uy, ux)), 3, 0.02);
  }
  inkLine(p, base + 17, thumbPts, {weight: 1.0, curve: 0.3, color: tone.crease});
};

/** A sleeve forearm capsule from `from` (off-frame) to the wrist, drawn under the hand. */
export const paintSleeve = (p: Painter, base: number, tone: HandTone, from: Pt, wrist: Pt, w0: number, w1: number) => {
  const dx = wrist[0] - from[0], dy = wrist[1] - from[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const pts: Pt[] = [[from[0] + nx * w0 / 2, from[1] + ny * w0 / 2], [wrist[0] + nx * w1 / 2, wrist[1] + ny * w1 / 2], [wrist[0] - nx * w1 / 2, wrist[1] - ny * w1 / 2], [from[0] - nx * w0 / 2, from[1] - ny * w0 / 2]];
  solid(p, base + 5, tone.sleeve, pts, 4, 0.04);
  inkLine(p, base + 17, pts, {weight: 1.2, curve: 0.1, color: tone.sleeveShade});
};

/**
 * The front-view figure with its head tilted about the neck while the shoulders and body stay still. `drawFigure` paints the
 * body with the head 30 head units above the frame (the `nod` field), so no head is drawn at the neck; the head is then
 * painted on its own by `paintHeadFront`, rotated by `angle` (rad, positive clockwise on screen) about the neck base (about
 * 1.9 head units below the head centre). `extra` paints over the head in the same rotation (the mask and mouth).
 */
export const drawFigureNeckTilt = (p: Painter, def: CastDef, g: Pt, unit: number, pose: Omit<FigPose, 'nod'>, t: number, angle: number, extra?: (head: Pt, K: number) => void): FigAnchors => {
  const OFF = 30;
  const a = drawFigure(p, def, g, unit, {...pose, nod: [0, -OFF]}, t);
  const K = (H / HEAD_SPAN) * unit;
  const head: Pt = [a.head[0], a.head[1] + OFF * K];
  const pivot: Pt = [head[0], head[1] + (CHIN + 0.7) * K];
  const b = p.brush;
  b.push();
  b.translate(pivot[0], pivot[1]);
  b.rotate(angle);
  b.translate(-pivot[0], -pivot[1]);
  paintHeadFront(p, def.seed + 1, head[0], head[1], K, pose.face, def.head, t, pose.warm ?? 0, pose.light as InteriorLight | undefined);
  extra?.(head, K);
  b.pop();
  // Long hair hangs: its lower ends would swing with the rotation and slant across the shoulders, which reads as the whole body
  // tilting (user, S02-B03-SH05 round 3). A hair-coloured hem, unrotated at the bottom, keeps the ends level: at v 1.3 (just under
  // the chin) it matches the rotated hair exactly and blends to a level edge at the hair's ends, lowered by the rotated corner's dip.
  if (def.head.cut === 'long' && angle !== 0) {
    const L = pose.light as InteriorLight | undefined;
    const c = Math.cos(angle), sn = Math.sin(angle), drop = 1.12 * Math.abs(sn);
    const hem: Pt[] = [[-1.26, 1.3], [1.26, 1.3], [1.21, 1.5], [1.12, 1.72], [0.72, 1.62], [0, 1.62], [-0.72, 1.62], [-1.12, 1.72], [-1.21, 1.5]];
    const pts = hem.map(([u, v]): Pt => {
      const x = head[0] + u * K - pivot[0], y = head[1] + v * K - pivot[1];
      const rx = pivot[0] + x * c - y * sn, ry = pivot[1] + x * sn + y * c;
      const w = clamp01((v - 1.3) / 0.42);
      return [rx, ry + (head[1] + (v + drop) * K - ry) * w];
    });
    const col = toneOf(def.head.hair, L);
    solid(p, def.seed * 100 + 97, col, pts, 6, 0.02);
    inkLine(p, def.seed * 100 + 98, pts.slice(1).concat([pts[0]]), {weight: 1.0, curve: 0.3, closed: false, color: lineOf(col, L)});
  }
  return {...a, head, top: head[1] - 1.17 * K};
};

/** The skin tone of a hand in a dark scene: the woman's tone toward the cold shadow. */
export const darkTone = (tone: HandTone, u: number): HandTone => ({
  ...tone,
  skin: mixColor(tone.skin, '#1a2236', u),
  shade: mixColor(tone.shade, '#101624', u),
  deep: mixColor(tone.deep, '#101624', u),
  crease: mixColor(tone.crease, '#0a0e18', u),
  sleeve: mixColor(tone.sleeve, '#1a2236', u),
  sleeveShade: mixColor(tone.sleeveShade, '#101624', u),
});

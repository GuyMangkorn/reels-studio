import type {Pt} from '../painter';
import {CHIN, HEAD_SPAN} from '../spike/FaceSheet';
import {skeleton} from '../spike/ProportionSheet';
import type {Paint} from '../spike/SideSheet';
import {ell, INK} from './ctx';
import type {Flat} from './sets';

// ZCPAINT character detail (Boss pass 5, detail (c)): ZC-only overlays drawn after the shared WORLD FOG figure code, so
// the WORLD FOG figure marks stay byte-identical. Ink marks (collar, shirt folds, hair strands, toe lines) and one flat
// contact shadow under the feet. Anchors are local figure px (ground origin at the feet, 190 px per head, scale 1), taken
// from the same skeleton the figure is painted with, so an overlay follows its figure under `placeAt`.

const HAIR = '#14110f';

/** Point on the torso axis: `t` 0 at the shoulder to 1 at the hip, `u` across the torso (+1 toward the front). */
const onTorso = (shoulder: Pt, hip: Pt, t: number, u: number, w: number): Pt => {
  const x = shoulder[0] + (hip[0] - shoulder[0]) * t, y = shoulder[1] + (hip[1] - shoulder[1]) * t;
  const len = Math.hypot(hip[0] - shoulder[0], hip[1] - shoulder[1]) || 1;
  const nx = -(hip[1] - shoulder[1]) / len, ny = (hip[0] - shoulder[0]) / len; // unit normal, front side
  return [x + nx * u * w, y + ny * u * w];
};

export type BodyAnchors = {
  /** Shoulder and hip points of the torso axis (local px). */
  shoulder: Pt;
  hip: Pt;
  /** Head centre and px per head unit (K = H / HEAD_SPAN). */
  head: {x: number; y: number; K: number};
  /** Torso width in px (for the fold spacing). */
  w: number;
};

/** Anchors of the standing profile figure (`paintBodySide`) at its local origin (ground at 0, 190 px per head). */
export const standingSideAnchors = (shoulder = 0.4): BodyAnchors => {
  const H = 190, k = skeleton(0, 4, 0, H, shoulder), K = H / HEAD_SPAN;
  return {shoulder: [0, k.shoulderY], hip: [0, k.hipY], head: {x: 0.03 * H, y: k.chin - CHIN * K, K}, w: 0.4 * H};
};

/**
 * Collar and shirt folds on one torso, and three hair strands on the back of the head. `shirt` is the fold tone (darker
 * than the shirt). Ink only, so the fills stay flat.
 */
export const bodyDetail = (p: Paint, a: BodyAnchors, shirt: string, opts: {folds?: boolean; hair?: boolean; collar?: boolean} = {}) => {
  const {shoulder, hip, head: {x: hx, y: hy, K}, w} = a;
  if (opts.collar !== false) {
    // Crew neck: a curved band at the neck base, the inner edge lighter.
    const c = onTorso(shoulder, hip, 0, 0, 0);
    p.ink([[c[0] - 0.12 * w, c[1] + 0.02 * w], [c[0], c[1] + 0.12 * w], [c[0] + 0.12 * w, c[1] + 0.0 * w]], 0.9, 0.5);
    p.ink([[c[0] - 0.1 * w, c[1] - 0.04 * w], [c[0], c[1] + 0.02 * w], [c[0] + 0.1 * w, c[1] - 0.03 * w]], 0.5, 0.5, shirt);
  }
  if (opts.folds !== false) {
    for (const [t0, u0, t1, u1, t2, u2] of [[0.22, -0.5, 0.36, -0.7, 0.5, -0.5], [0.3, 0.2, 0.44, 0.45, 0.58, 0.3], [0.5, -0.8, 0.6, -0.55, 0.7, -0.7]] as const) {
      p.ink([onTorso(shoulder, hip, t0, u0, w), onTorso(shoulder, hip, t1, u1, w), onTorso(shoulder, hip, t2, u2, w)], 0.8, 0.5, shirt);
    }
  }
  if (opts.hair !== false) {
    // Three strands on the upper back of the skull (the hair mass is the head's own shape; these are its strands).
    for (const [a0, r0] of [[-2.05, 0.95], [-2.3, 0.97], [-2.55, 0.9]] as const) {
      const pts: Pt[] = [0, 0.13, 0.26].map((d, i) => {
        const r = r0 * K * (1 - 0.18 * i);
        return [hx + r * Math.cos(a0 + d), hy + r * Math.sin(a0 + d)];
      });
      p.ink(pts, 0.8, 0.5, HAIR);
    }
  }
};

/** Toe lines on a bare foot pointing +x (profile), from the foot's front edge back to the ankle. `x` is the ankle x. */
export const toeLines = (p: Paint, x: number, ground: number, h: number) => {
  for (const u of [0.25, 0.28]) p.ink([[x + u * h, ground - 0.085 * h], [x + (u - 0.012) * h, ground - 0.03 * h]], 0.6, 0.3, INK);
};

/** Flat contact shadow under the feet (local px), drawn before the figure so the figure overlaps it. */
export const contactShadow = (f: Flat, cx: number, ground: number, rx: number, ry: number, colour: string) => {
  f.fill(colour, ell(cx, ground - ry * 0.4, rx, ry, 22));
};

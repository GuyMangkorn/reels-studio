import {drawFigure, H, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, glaze, INK, inkLine, solid, type InteriorLight} from '../kit/draw';
import {hash} from '../kit/hash';
import {HEAD_SPAN, type FaceState} from '../kit/head';
import {clamp01, lerp, mixColor, type Painter, type Pt} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {CALM_FACE, KSO_WOMAN, WOMAN_LIGHT} from './cast';
import {maskOutline} from './face';
import {drawFigureNeckTilt} from './shot-motion';

// Shot-level woman (S02-B03-SH02..SH05, S02-B01-SH04, S02-B02-SH01, S03-B01-SH01). The mask and the open slit grin of
// `face.ts` (frozen with LF01-LF05) are repainted here with one extra control: `tear` splits the mouth over time.
// `corner` 0..1 widens the closed lip line to the full ear-to-ear span; `open` 0..1 opens the jaw and the interior. At
// corner 1 and open 1 the mouth is the LF03 grin (the same geometry and the same seed order), so the approved still is
// the end state of the animation. Mouth shapes are painted only once the mask has left the mouth (m >= 0.15), as in face.ts.

/**
 * `rest` 0..1 (optional, default 0; round 5, S03-B01-SH01 only): the closed lip line slides down and narrows onto the kit's
 * plain `flat` mouth (head.ts: v 0.6, u -0.2..0.2, weight 1.3, INK), so a grin that closes again ends exactly on the normal
 * mouth. At rest 1 and corner 0 the overlay mouth is not painted at all and only the kit mouth (drawn under it) remains.
 */
export type Tear = {corner: number; open: number; rest?: number};

/** Full grin (LF03) and the closed lip line before the tear. Shot-local frame `lf`: corners split over f0-6, jaw and interior open over f4-12, ease-out. */
export const tearAt = (lf: number): Tear => {
  const ease = (u: number) => 1 - (1 - clamp01(u)) * (1 - clamp01(u));
  return {corner: ease(lf / 6), open: ease((lf - 4) / 8)};
};

const LOOP = '#26282d';
const LIP = '#1a1214';
const INTERIOR = '#0b0506';
const GUM = '#4b3336';
const TONGUE = '#4a3a40';
const TONGUE_RIDGE = '#17111a';
const TEETH = '#dcd3b8';
const TEETH_LO = '#cfc6ab';
const TEETH_BAD = '#8c8270';
const SMILE_SHADOW = '#2a1f2b';
const MASK_FOLD = '#b6b3ac';
const MASK = '#ecebe6';
/** The mask drop of face.ts (head units); the folds travel with the mask. */
const DROP = 5.4;
const EAR_L: Pt = [-1.13, -0.02], EAR_R: Pt = [1.13, -0.02];

const OPEN_TOP_BASE: Pt[] = [[-1.04, 0.3], [-0.8, 0.4], [-0.45, 0.46], [-0.15, 0.48], [0, 0.49], [0.15, 0.48], [0.45, 0.46], [0.8, 0.4], [1.04, 0.3]];
const OPEN_BOTTOM_BASE: Pt[] = [[-1.04, 0.3], [-0.86, 0.52], [-0.55, 0.72], [-0.25, 0.84], [0, 0.9], [0.25, 0.84], [0.55, 0.72], [0.86, 0.52], [1.04, 0.3]];
const UPPER_U = [-0.9, -0.74, -0.58, -0.42, -0.26, -0.1, 0.06, 0.22, 0.38, 0.54, 0.7, 0.86];
const LOWER_U = [-0.6, -0.42, -0.24, -0.06, 0.12, 0.3, 0.48];
/** The corners of the full grin after the face.ts warp (left corner runs further into the cheek; the right corner sits 0.052 lower). */
const CORNER_L: Pt = [-1.1232, 0.248], CORNER_R: Pt = [1.04, 0.352];
/** Rips out of each corner (face.ts), as points: corner, then two points. */
const RIPS: Pt[][] = [
  [CORNER_L, [-1.24, 0.16], [-1.36, 0.1]],
  [CORNER_L, [-1.3, 0.3], [-1.38, 0.34]],
  [CORNER_L, [-1.2, 0.4], [-1.26, 0.48]],
  [CORNER_R, [1.14, 0.24], [1.22, 0.18]],
  [CORNER_R, [1.16, 0.44], [1.2, 0.5]],
];

/** The face.ts lip warp: the left corner rises and runs further into the cheek. */
const warp = ([u, v]: Pt): Pt => [u < 0 ? u * 1.08 : u, v + 0.05 * u];
/** The kit's plain `flat` mouth (head.ts): height and half-width in head units; CLOSED_HALF is the closed line's half-width (warped 1.04 x 1.08 x S(0)). */
const KIT_MOUTH_V = 0.6, KIT_HALF = 0.2, CLOSED_HALF = 1.04 * 1.08 * 0.4;
/** Horizontal scale of the mouth: a closed mouth is narrower than the grin. */
const S = (c: number) => lerp(0.4, 1, c);
/** A lip edge at tear `t`: the closed line (v = 0.33 + 0.05 u) opens to the grin's edge. */
const edge = (base: Pt[], t: Tear): Pt[] =>
  base.map((b) => {
    const [wu, wv] = warp(b);
    const r = t.rest ?? 0;
    const u = wu * S(t.corner) * lerp(1, KIT_HALF / CLOSED_HALF, r);
    const closed = lerp(0.33 + 0.05 * u, KIT_MOUTH_V, r);
    return [u, closed + (wv - closed) * t.open];
  });

/** Height of a sorted lip edge at u (linear between its keys; the end value outside the range). */
const edgeAt = (pts: Pt[], u: number): number => {
  for (let i = 1; i < pts.length; i++) {
    const [u0, v0] = pts[i - 1], [u1, v1] = pts[i];
    if (u <= u1) return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0);
  }
  return pts[pts.length - 1][1];
};
const tooth = (pts: Pt[], sign: 1 | -1, u: number, w: number, depth: number, jit: number): Pt[] => {
  const tip = edgeAt(pts, u) + sign * depth;
  return [[u - w / 2, edgeAt(pts, u - w / 2)], [u + w / 2, edgeAt(pts, u + w / 2)], [u + w * 0.22 + jit, tip], [u - w * 0.22 + jit, tip]];
};
const strip = (pts: Pt[], sign: 1 | -1, depth: number): Pt[] => [...pts, ...pts.slice().reverse().map(([u, v]): Pt => [u, v + sign * depth])];
/** The inner shadow under the upper lip, tapered to nothing at the corners so it stays inside the mouth (no smudge past the corners). */
const stripTaper = (pts: Pt[], depth: number): Pt[] => {
  const uMax = Math.max(...pts.map(([u]) => Math.abs(u)));
  return [...pts, ...pts.slice().reverse().map(([u, v]): Pt => [u, v + depth * clamp01((uMax - Math.abs(u)) / 0.4)])];
};

/**
 * The mask, ear loops and mouth of the woman's face at tear `t`, painted over the decal head centred at (cx, cy), K px per
 * unit, mask state `m` (0 worn ... 1 dropped out of frame). Same draw order and seed ids as face.ts `paintMaskFace`; ids are
 * consumed even when a part is skipped, so the seeds do not shift as the tear moves.
 */
export const paintMaskFaceTear = (p: Painter, seed: number, cx: number, cy: number, K: number, m: number, t: Tear = {corner: 1, open: 1}, clean = false) => {
  const Q = (pts: Pt[]): Pt[] => pts.map(([u, v]): Pt => [cx + u * K, cy + v * K]);
  const outline = maskOutline(m);
  let line = 0;
  // `clean` (the reveal, user notes 1 Nov 2026): no stray strokes at the mouth ends, so the ear loops end with the mask and the rips are not drawn.
  const loops = !clean || m < 0.6;
  line += 2;
  if (loops) {
    inkLine(p, seed + line - 1, Q([EAR_L, [-1.1, 0.2], outline[0]]), {color: LOOP, weight: 1.6, curve: 0.4, closed: false});
    inkLine(p, seed + line, Q([EAR_R, [1.1, 0.2], outline[6]]), {color: LOOP, weight: 1.6, curve: 0.4, closed: false});
  }
  if (m >= 0.15) {
    const rest = t.rest ?? 0;
    // With `rest` the tongue, its ridge and the teeth follow the lip edges down and in (round 5: the ridge stayed at the nose height).
    const s = S(t.corner) * lerp(1, KIT_HALF / CLOSED_HALF, rest), o = t.open, v0 = lerp(0.33, KIT_MOUTH_V, rest);
    const top = edge(OPEN_TOP_BASE, t), bot = edge(OPEN_BOTTOM_BASE, t);
    const open = o >= 0.02;
    // `clean` also drops the two corner shadows (they run past the cheek onto the hair) and the jag ticks along the lips (round 3).
    if (!clean) {
      glaze(p, seed + 11, SMILE_SHADOW, 110, Q([[-1.08 * s, 0.2], [-0.84 * s, 0.3], [-0.84 * s, 0.5], [-1.12 * s, 0.52]]), {texture: 0.3, border: 0.3, bleed: 0.05});
      glaze(p, seed + 12, SMILE_SHADOW, 110, Q([[1.08 * s, 0.2], [0.84 * s, 0.3], [0.84 * s, 0.5], [1.12 * s, 0.52]]), {texture: 0.3, border: 0.3, bleed: 0.05});
    }
    if (open) {
      solid(p, seed + 13, INTERIOR, Q([...top, ...bot.slice().reverse()]), 4, 0.02, 0.1);
      glaze(p, seed + 14, '#000000', 150, Q(clean ? stripTaper(top, 0.24 * o) : strip(top, 1, 0.24 * o)), {texture: 0.4, border: 0.4, bleed: 0.08});
      const cv = lerp(v0, 0.8, o);
      solid(p, seed + 15, TONGUE, Q(ell(0.02 * s, cv, 0.34 * s, 0.1 * o, 16)), 3, 0.02, 0.05);
    }
    // At rest 1 the kit mouth alone remains; ids are still consumed below so the seeds do not shift.
    const mouth = rest < 1 || t.corner > 0;
    line++;
    if (!(rest > 0 && !open)) inkLine(p, seed + line, Q([[-0.26 * s, lerp(v0, 0.8, o) - 0.04 * o], [0, lerp(v0, 0.8, o) - 0.09 * o], [0.26 * s, lerp(v0, 0.8, o) - 0.04 * o]]), {color: TONGUE_RIDGE, weight: 1.2, curve: 0.3, closed: false});
    if (open) {
      solid(p, seed + 16, GUM, Q(strip(top, 1, 0.06 * o)), 3, 0.02, 0.05);
      solid(p, seed + 17, GUM, Q(strip(bot, -1, 0.05 * o)), 3, 0.02, 0.05);
      UPPER_U.forEach((u, i) => {
        if (hash(seed + 400 + i) > 0.84) return;
        const fang = i === 2 || i === 9 ? 0.07 : 0;
        const depth = (0.07 + 0.09 * hash(seed + 500 + i) + fang) * o;
        const color = hash(seed + 420 + i) < 0.1 ? TEETH_BAD : TEETH;
        solid(p, seed + 600 + i, color, Q(tooth(top, 1, u * s, 0.13 * s, depth, (hash(seed + 700 + i) - 0.5) * 0.03)), 2, 0.02, 0.05);
      });
      LOWER_U.forEach((u, i) => {
        if (hash(seed + 800 + i) > 0.8) return;
        const depth = (0.06 + 0.07 * hash(seed + 900 + i)) * o;
        solid(p, seed + 920 + i, TEETH_LO, Q(tooth(bot, -1, u * s, 0.12 * s, depth, (hash(seed + 940 + i) - 0.5) * 0.03)), 2, 0.02, 0.05);
      });
    }
    // Lip edges and the torn jags (ids consumed in face.ts order, lengths scaled by the jaw opening).
    const lip = {color: mixColor(LIP, INK, rest), weight: lerp(2.4, 1.3, rest), curve: 0.3, closed: false};
    line++;
    if (mouth) inkLine(p, seed + line, Q(top), lip);
    line++;
    // A closed mouth (open 0) has top = bottom: with `rest` one stroke is enough (two overlaid strokes read heavier than the kit line).
    if (mouth && !(rest > 0 && !open)) inkLine(p, seed + line, Q(bot), lip);
    for (let i = 1; i < top.length - 1; i += 2) {
      const [u, v] = top[i];
      line++;
      if (!clean) inkLine(p, seed + line, Q([[u, v], [u + (hash(seed + 950 + i) - 0.5) * 0.04, v - (0.05 + 0.05 * hash(seed + 960 + i)) * o]]), {color: LIP, weight: 1.3, curve: 0, closed: false});
    }
    for (let i = 1; i < bot.length - 1; i += 2) {
      const [u, v] = bot[i];
      line++;
      if (!clean) inkLine(p, seed + line, Q([[u, v], [u + (hash(seed + 970 + i) - 0.5) * 0.04, v + (0.05 + 0.05 * hash(seed + 980 + i)) * o]]), {color: LIP, weight: 1.3, curve: 0, closed: false});
    }
    // Rips: each corner tears further into the cheek; the offsets from the base corner scale with the mouth.
    const cornerNow = [top[0], top[top.length - 1]];
    RIPS.forEach((r) => {
      const side = r[0] === CORNER_L ? 0 : 1;
      const c0 = cornerNow[side];
      const base = r[0];
      const pts = r.map((q, k): Pt => (k === 0 ? c0 : [c0[0] + (q[0] - base[0]) * s, c0[1] + (q[1] - base[1])]));
      line++;
      if (!clean) inkLine(p, seed + line, Q(pts), {color: LIP, weight: 2.0, curve: 0.3, closed: false});
    });
  }
  // A fully dropped mask (m 1) is out of the close-up frames; in a full-length frame it would hang at the waist, so `clean` leaves it out (S03-B01-SH01).
  if (clean && m >= 1) return;
  solid(p, seed + 20, MASK, Q(outline), 4, 0.02, 0.1);
  // Pleats across the worn mask; they travel with the mask as it drops.
  const drop = m * DROP;
  const folds: Pt[][] = [[[-0.7, 0.52], [0, 0.58], [0.7, 0.52]], [[-0.66, 0.74], [0, 0.8], [0.66, 0.74]]];
  for (const f of folds) inkLine(p, seed + 30 + ++line, Q(f.map(([u, v]): Pt => [u, v + drop])), {color: MASK_FOLD, weight: 1.2, curve: 0.3, closed: false});
};

/**
 * The woman at ground point `g` (plate px), `unit` px per metre, with mask state `m` and mouth tear `t`. The same rig call as
 * cast.ts `drawWoman` (front view, long hair, beige coat), with the shot-level face above. `arms` replaces the standing P01 arms
 * (rig targets in plate px, from `armTarget`); `clean` leaves out the strokes at the mouth ends (see `paintMaskFaceTear`).
 */
export const drawWomanTear = (p: Painter, g: Pt, unit: number, t: number, m: number, light: InteriorLight | undefined = WOMAN_LIGHT, face: FaceState = CALM_FACE, tear: Tear = {corner: 1, open: 1}, arms?: Pick<FigPose, 'rArm' | 'lArm'>, clean = false): FigAnchors => {
  const pose: FigPose = {view: 'front', face, ...(arms ?? poseArms('P01', KSO_WOMAN, g, unit)), light};
  const a = drawFigure(p, KSO_WOMAN, g, unit, pose, t);
  paintMaskFaceTear(p, KSO_WOMAN.seed * 1000 + 900, a.head[0], a.head[1], (H / HEAD_SPAN) * unit, m, tear, clean);
  return a;
};

/** The woman with only the head and neck tilted by `angle` (rad) about the neck: shoulders and body still (S02-B03-SH05). */
export const drawWomanNeckTilt = (p: Painter, g: Pt, unit: number, t: number, angle: number, light: InteriorLight | undefined = WOMAN_LIGHT, face: FaceState = CALM_FACE, tear: Tear = {corner: 1, open: 1}): FigAnchors =>
  drawFigureNeckTilt(p, KSO_WOMAN, g, unit, {view: 'front', face, ...poseArms('P01', KSO_WOMAN, g, unit), light}, t, angle, (head, K) => paintMaskFaceTear(p, KSO_WOMAN.seed * 1000 + 900, head[0], head[1], K, 1, tear, true));

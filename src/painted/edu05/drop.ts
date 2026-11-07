import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {DROP_C, DROP_R, dropShape, paintDrop} from './macro';

// `new: dew-drop` D1 contact states (N4, EDU-EP05 W5.2, scene sheets S01-B03-SH02..SH04; spike 3). Units sm about the drop's contact
// point (x right, y up), the same frame as `dropShape`. The states of the brief:
//   (a) rest              - `dropShape` (LF03 v5), nothing below is applied.
//   (b) dimple + wrap     - `push`: a fingertip presses the surface in (dimple), breaks through, the hand goes in; the water wraps the
//                           wrist in a meniscus collar (`collar`).
//   (c) neck              - `neck` 0..0.5 sm: she pulls, the water stays on her wrist and stretches into a waisted neck toward her
//                           while the body shrinks (area kept) and its foot stays on the blade.
//   (d) snap + wobble     - `snapF` frames since the neck broke: the neck springs into the body (2 frames), the body rings three damped
//                           cycles (period 6 f) with the foot still on `B-DEW`, a bead and a wet sheen stay on the wrist.
// The hand is the rig's: `dropHand` gives the wrist and the mitten centre in picture px for the arm target, and the drop is painted in
// two layers (`back` before the figure, `front` after it) so the hand reads inside the water: water body, hand, veil, rim.

export type DropState = {
  /** Fingertip depth past the surface along the arm, sm (-0.3 = 0.3 outside, 0 = touching, `HAND_LEN` = wrist at the surface, `HAND_LEN + DEPTH` = fully in). */
  push: number;
  /** Wrist travel back toward her after the hand is fully in, sm. The visible neck is `neckLength` = wrist offset from the surface, so `DEPTH + 0.5` gives the sheets' 0.5 sm neck (0.3 is the fallback cap). */
  neck: number;
  /** Frames since the neck snapped (undefined = intact). */
  snapF?: number;
  /** Extra collar rise up the wrist, sm (SH03 "collar tightens 0.03 sm"). */
  collar?: number;
};
/** Arm geometry in the drop frame: unit vector from the wrist toward the elbow (pointing out of the drop, down-left) and the entry angle
 * on the outline (from the rest centre; the hand comes in on the lower-left surface, as in SH10 (wrist (1.80, 1.42), drop contact (2.2, 1.12))). */
export const ARM_DIR: Pt = [-0.95, -0.31];
export const ENTRY_ANGLE = (192 * Math.PI) / 180;
export const HAND_LEN = 0.1, WRIST_HW = 0.05;
/** How far past the surface the wrist sits once the hand is fully in (sm): the hand reads inside the water. */
export const DEPTH = 0.13;
export const MAX_NECK = 0.5;
const smooth = (a: number, b: number, v: number) => { const k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };

/** Area of a polygon (shoelace, sm^2). */
export const areaOf = (pts: Pt[]) => Math.abs(pts.reduce((s, q, i) => { const n = pts[(i + 1) % pts.length]; return s + (q[0] * n[1] - n[0] * q[1]); }, 0)) / 2;
export const REST_AREA = areaOf(dropShape(72).slice(0, -1));

/** Wrist offset from the surface along the arm (negative = inside the drop). */
export const wristOffset = (st: DropState, snapped = false) => HAND_LEN - st.push + (snapped ? 0 : st.neck);
/** Visible neck length, sm (the part of the water stretched beyond the rest surface; 0 while the wrist is inside). */
export const neckLength = (st: DropState) => (st.snapF !== undefined ? 0 : Math.max(0, wristOffset(st)));

/** Where the arm line meets the rest outline: the entry point P0 (the wrist's place when the hand is fully in), and the outward normal there. */
const entry = (() => {
  const D = dropShape(180);
  let best = 0, bd = 9;
  D.forEach(([x, y], i) => { const d = Math.abs(Math.atan2(y - DROP_C, x) - (ENTRY_ANGLE - 2 * Math.PI)); const d2 = Math.min(d, Math.abs(d - 2 * Math.PI)); if (d2 < bd) { bd = d2; best = i; } });
  const P: Pt = D[best], n = Math.hypot(P[0], P[1] - DROP_C);
  return {P, out: [P[0] / n, (P[1] - DROP_C) / n] as Pt};
})();

/** Angle of an outline point round the rest centre relative to the entry (-pi..pi). */
const relAngle = (pt: Pt) => { const d = Math.atan2(pt[1] - DROP_C, pt[0]) - Math.atan2(entry.P[1] - DROP_C, entry.P[0]); return Math.atan2(Math.sin(d), Math.cos(d)); };
const NECK_HALF = 0.5;
/**
 * The neck as an explicit run of outline points: from the surface (flare 0.26 sm half width, narrowing as it lengthens) along the arm
 * line to the wrist, a rounded tip, and back. Concave flanks (`(1 - s)^2.4` flare), so it reads as a stretched waist, not a cone.
 * Returns the points in the order of the replaced run (`first` = the run's first outline point decides the flank order).
 */
const neckRun = (first: Pt, last: Pt, len: number): Pt[] => {
  const a = ARM_DIR, nrm: Pt = [-a[1], a[0]], P = entry.P, tipR = WRIST_HW + 0.02, h0 = 0.27 - 0.07 * Math.min(1, len / MAX_NECK);
  const n = 10, hw = (s: number) => tipR + (h0 - tipR) * (1 - s) ** 2.4;
  const plusFirst = Math.hypot(first[0] - (P[0] + nrm[0] * h0), first[1] - (P[1] + nrm[1] * h0)) < Math.hypot(first[0] - (P[0] - nrm[0] * h0), first[1] - (P[1] - nrm[1] * h0));
  // each flank starts ON the body outline (the run's end point) and blends into the waisted neck profile, so no corner pokes outside the drop
  const flank = (sd: number): Pt[] => {
    const R = (sd > 0) === plusFirst ? first : last;
    return Array.from({length: n + 1}, (_, i) => {
      const s = i / n, w = smooth(0, 0.4, s), c: Pt = [P[0] + a[0] * len * s + nrm[0] * sd * hw(s), P[1] + a[1] * len * s + nrm[1] * sd * hw(s)];
      return [R[0] * (1 - w) + c[0] * w, R[1] * (1 - w) + c[1] * w] as Pt;
    });
  };
  const fp = flank(1), fm = flank(-1), tip: Pt = [P[0] + a[0] * len, P[1] + a[1] * len];
  const cap = (sd: number): Pt[] => Array.from({length: 5}, (_, i) => { const th = (i + 1) / 6 * Math.PI, c = Math.cos(th), sn = Math.sin(th); return [tip[0] + (a[0] * sn + nrm[0] * sd * c) * tipR, tip[1] + (a[1] * sn + nrm[1] * sd * c) * tipR] as Pt; });
  return plusFirst ? [...fp, ...cap(1), ...fm.slice().reverse()] : [...fm, ...cap(-1), ...fp.slice().reverse()];
};

export type DropGeometry = {outline: Pt[]; wrist: Pt | null; hand: Pt | null; scale: number};
/**
 * The deformed outline of D1 for a state, closed (first = last) from the contact round the right, top and left like `dropShape`, plus the
 * wrist and mitten centre (sm; null after the hand has left). Area is renormalised to the rest area about the contact point (the foot
 * stays under the drop), so the volume is kept within a few percent in every state.
 */
export const dropGeometry = (st: DropState): DropGeometry => {
  const rest = dropShape(72), a = ARM_DIR;
  const snapped = st.snapF !== undefined;
  // neck length: pulled `neck`; after the snap the stub springs back within 2 frames
  const stub = snapped ? Math.max(0, wristOffset(st, false)) * Math.exp(-(st.snapF ?? 0) / 0.9) : neckLength(st);
  // dimple: the surface is pushed in ahead of the fingertips until they break through (push 0.05), then it heals as the water wraps
  const dimple = 0.07 * smooth(-0.02, 0.05, st.push) * (1 - smooth(0.05, HAND_LEN + 0.02, st.push));
  // wobble after the snap: x stretch with its centre foot fixed; area-preserving
  const ph = snapped ? ((st.snapF ?? 0) / 6) * 2 * Math.PI : 0, amp = snapped ? 0.16 * Math.exp(-(st.snapF ?? 0) / 11) : 0, sx = 1 + amp * Math.cos(ph);
  let pts = rest.map(([x, y]): Pt => {
    let X = x, Y = y;
    if (dimple > 0) {
      const ang = Math.atan2(y - DROP_C, x), a0 = Math.atan2(entry.P[1] - DROP_C, entry.P[0]);
      let d = ang - a0; d = Math.atan2(Math.sin(d), Math.cos(d));
      const g = Math.exp(-((d / 0.32) ** 2)) * dimple;
      X -= entry.out[0] * g; Y -= entry.out[1] * g;
    }
    if (snapped) X = x + (X - x) + x * (sx - 1) * smooth(0.04, 0.45, Y);
    return [X, Y];
  });
  if (stub > 0.02) {
    // swap the run of outline points within the neck's angular half range for the explicit neck polygon
    const idx = pts.map((q, i) => (Math.abs(relAngle(q)) < NECK_HALF && i < pts.length - 1 ? i : -1)).filter((i) => i >= 0);
    if (idx.length) pts = [...pts.slice(0, idx[0]), ...neckRun(pts[idx[0]], pts[idx.at(-1)!], stub), ...pts.slice(idx.at(-1)! + 1)];
  }
  const deformed = dimple > 0 || stub > 0.002 || snapped;
  const A = areaOf(pts.slice(0, -1)), k = deformed ? Math.sqrt(REST_AREA / A) : 1;
  const outline = pts.map(([x, y]): Pt => [x * k, y * k]);
  // the wrist rides the neck tip: P0 + a * (distance beyond the surface); hand centre half a mitten inside
  // after the snap her hand springs free: it carries on away from the drop along the arm line
  const wo = wristOffset(st) + (snapped ? 0.3 * (1 - Math.exp(-(st.snapF ?? 0) / 4)) : 0);
  const wrist: Pt | null = st.push <= -0.3 ? null : [(entry.P[0] + a[0] * wo - a[0] * 0) * k, (entry.P[1] + a[1] * wo) * k];
  const hand: Pt | null = wrist && [wrist[0] - a[0] * HAND_LEN * 0.55, wrist[1] - a[1] * HAND_LEN * 0.55];
  return {outline, wrist, hand, scale: k};
};
export const dropOutline = (st: DropState): Pt[] => dropGeometry(st).outline;

/** The contact patch of an outline: the x range of its points within 0.03 sm of the blade under the body (the foot on `B-DEW`), sm. */
export const footRange = (outline: Pt[]): [number, number] => {
  const xs = outline.filter(([x, y]) => y < 0.03 && Math.abs(x) < 0.45).map(([x]) => x); // the body's foot; the neck tip lies far left
  return [Math.min(...xs), Math.max(...xs)];
};

/** Wrist and mitten centre in picture px (the rig's arm target) for contact point `g` and `u` px per sm. */
export const dropHand = (g: Pt, u: number, st: DropState) => {
  const {wrist, hand} = dropGeometry(st), S = ([x, y]: Pt): Pt => [g[0] + x * u, g[1] - y * u];
  return {wrist: wrist && S(wrist), hand: hand && S(hand), arm: ARM_DIR};
};

const WATER = '#cfe6dc';
/** Meniscus collar on the wrist (b, c) and the wet sheen after the snap (d): the water climbing the arm in two concave fillets. */
const paintCollar = (p: Painter, g: Pt, u: number, st: DropState, geo: DropGeometry) => {
  const S = ([x, y]: Pt): Pt => [g[0] + x * u, g[1] - y * u];
  if (!geo.wrist) return;
  const a = ARM_DIR, nrm: Pt = [-a[1], a[0]], snapped = st.snapF !== undefined;
  // the collar sits where the forearm crosses the water surface: the surface point while the wrist is inside, the neck tip once it is out
  const W: Pt = entry.P.map((v, i) => (v + a[i] * Math.max(0, snapped ? 0 : wristOffset(st))) * geo.scale) as Pt;
  const wrapped = smooth(0.05, HAND_LEN + 0.02, st.push), rise = (0.05 + 0.07 * wrapped + (st.collar ?? 0)) * (snapped ? Math.exp(-(st.snapF ?? 0) / 14) : 1);
  if (rise < 0.01 || st.push < 0.05) return;
  // one flared sleeve of water round the wrist (symmetrical about the arm line), flaring into the surface
  const base = (t: number, off: number): Pt => [W[0] + a[0] * t + nrm[0] * off, W[1] + a[1] * t + nrm[1] * off];
  // R1.11: the sleeve is a tapering fillet (wide at the water, hugging the wrist at its top), not a constant-width strip: the strip read as a rectangle round the wrist
  const prof: [number, number][] = Array.from({length: 9}, (_, i) => { const s = i / 8; return [-0.04 + (rise + 0.04) * s, 0.008 + 0.05 * (1 - s) ** 1.7] as [number, number]; });
  const sleeve = [...prof.map(([t, o]) => base(t, o)), ...prof.slice().reverse().map(([t, o]) => base(t, -o))];
  washAt(p, 8530, WATER, 120, sleeve.map(S), 0.04, 0.05);
  [-1, 1].forEach((sd, i) => inkLine(p, 8532 + i, prof.map(([t, o]) => S(base(t, sd * o))), {weight: Math.max(0.5, u / 560), color: '#7d9c8a', closed: false}));
  if (snapped) {
    // the bead left on the wrist and the wet sheen along the forearm
    const k = Math.exp(-(st.snapF ?? 0) / 20);
    solid(p, 8536, mixColor(WATER, '#ffffff', 0.4), ell(...S([W[0] + a[0] * 0.03, W[1] + a[1] * 0.03 + 0.045]), 0.035 * u, 0.03 * u, 10), 2);
    washAt(p, 8537, '#ffffff', 200 * k, [S([W[0] + a[0] * 0.05 - a[1] * 0.02, W[1] + a[1] * 0.05 + a[0] * 0.02]), S([W[0] + a[0] * 0.2 - a[1] * 0.02, W[1] + a[1] * 0.2 + a[0] * 0.02]), S([W[0] + a[0] * 0.2 - a[1] * 0.045, W[1] + a[1] * 0.2 + a[0] * 0.045]), S([W[0] + a[0] * 0.05 - a[1] * 0.045, W[1] + a[1] * 0.05 + a[0] * 0.045])], 0.05, 0);
  }
};

/** Paints D1 in a state: `layer` `back` (before the figure) or `front` (after it: veil, collar, rim, highlights). */
export const paintDropState = (p: Painter, g: Pt, u: number, st: DropState, o: {layer: 'back' | 'front' | 'all'; t?: number; sunSide?: -1 | 1}) => {
  const geo = dropGeometry(st), withHand = geo.wrist !== null && st.push > -0.02;
  const deformed = geo.scale !== 1 || st.neck > 0 || st.push > -0.3;
  paintDrop(p, g, u, {sunSide: o.sunSide ?? -1, t: o.t, shape: deformed ? geo.outline : undefined, layer: o.layer, veil: withHand ? 0.4 : undefined});
  if (o.layer !== 'back') paintCollar(p, g, u, st, geo);
};
export {DROP_R};

/**
 * D1's state for a shot and shot-local frame (scene sheets): SH02-stuck `S01-B03-SH02` (dimple L 0-4, wrap L 4-10, neck 0 -> 0.5 by L 60,
 * then a slow 0.05 oscillation), wrist close `S01-B03-SH03` (neck held, two 0.06 tugs at L 20 and L 50 that the surface pulls back after
 * 6 f, collar +0.03 at L ~90), heave `S01-B03-SH04` (held, snap at L 108). Undefined for other shots (rest state).
 */
export const dropStateFor = (shot: string, local: number): DropState | undefined => {
  const L = local, IN = HAND_LEN + DEPTH, wo = (vis: number) => DEPTH + vis; // neck field for a wanted wrist offset `vis` (>= -DEPTH)
  if (shot === 'S01-B03-SH02') {
    const push = L < 4 ? -0.3 + (0.35 * L) / 4 : 0.05 + (IN - 0.05) * smooth(4, 10, L);
    const vis = -DEPTH + smooth(16, 60, L) * (MAX_NECK - 0.05 + DEPTH), osc = L > 60 ? 0.05 * Math.sin(((L - 60) / 40) * 2 * Math.PI) * smooth(60, 66, L) : 0;
    return {push, neck: wo(vis) + osc, collar: 0};
  }
  const tug = (c: number) => 0.06 * smooth(c - 2, c + 1, L) * (1 - smooth(c + 3, c + 9, L));
  if (shot === 'S01-B03-SH03') return {push: IN, neck: wo(MAX_NECK - 0.06) + tug(20) + tug(50), collar: 0.03 * smooth(84, 94, L)};
  if (shot === 'S01-B03-SH04') return {push: IN, neck: wo(MAX_NECK - 0.04) - (L < 108 ? 0.04 * Math.sin(L / 6) : 0), snapF: L < 108 ? undefined : L - 108, collar: 0.03};
  return undefined;
};

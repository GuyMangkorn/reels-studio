import {drawFigure, shoulderPoint, type Arm, type CastDef, type FigAnchors, type FigPose} from './cast';
import {hipAnchor, rollAnchors, rollPt, withRoll} from './figure-at';
import {layerMotion, type Layered, type MotionId} from './motions';
import {poseFor, type AnyPoseId} from './poses';
import {ell, hardFill, inkLine, INK} from './draw';
import {EXPRESSIONS, type ExpressionId} from './expressions';
import type {FaceState} from './head';
import {mixColor, tintPainter, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {EVA, dress, evaOutfit} from './wardrobe';
import {figureView4, squareToCam, type View4} from './views';
import {camPoint, camUnit, type YCam} from './ycam';

// EVA suit and helmet painter (kit intake from EDU-EP08-SHORT look lock LF00-LF07, user 8 Nov 2026; Boss B2). The suit itself is the
// wardrobe class `eva-suit` (`dress(def, 'eva-suit')`, `wardrobe.ts`: white long sleeves, boots, backpack, belt, bulk shoulder). What the
// rig has no field for is painted over the returned anchors by `paintEva`: neck ring with blue lock collar, mitten gloves (`near` growth),
// and the helmet `eva-helmet`: `bubble` (clear glass over the face, retracted gold visor band, sheen <= 0.15), `visor` (white shell, gold
// visor down, no face), `round1966` (silver, no face), `off`. Views: front, left, right, back and front three-quarter (`quarter`).
// Arms are authored in metres from the shoulder (`ArmM`), through `shoulderPoint` so the anchor sits on the painted shoulder (BONE 0.26 m).

export {EVA};

/** The suit on a kit person (same head and body, outfit only). `tint` recolours the white (1960s silver `EVA.silver`). */
export const evaSuit = (def: CastDef, o: {tint?: string} = {}): CastDef =>
  o.tint ? {...def, outfit: evaOutfit(def.outfit.shoulder, o.tint)} : dress(def, 'eva-suit');

export type Helmet = 'bubble' | 'off' | 'visor' | 'round1966';
/** An arm as offsets from its shoulder in metres, screen-right / up: hand `to`, elbow `via`. `near` (m, default 0): how far the hand
 * sits toward the camera from the shoulder plane; the glove grows by the perspective ratio, capped at 1.3x (CP-P09). Author projected
 * segments from the kit bone (`BONE` 0.26 m upper arm = forearm): a segment in the picture plane is 0.26 m on screen, a segment that
 * points toward the camera is shorter by the camera model (cos of its angle to the image plane), never longer. */
export type ArmM = {to: Pt; via: Pt; behind?: Arm['behind']; near?: number};
/** Zero-g neutral arm (`new: zero-g-neutral`, brief VD02), front view at pitch -8..-16 deg: upper arm 20 deg forward of hanging (projected
 * ~0.25 m), forearm 65 deg forward toward the camera (projected ~0.17 m = 0.26 x cos 50), hand in front of the hip, 0.32 m nearer. */
export const ZG_NEUTRAL = (side: 'r' | 'l'): ArmM => { const s = side === 'r' ? -1 : 1; return {via: [s * 0.04, -0.25], to: [-s * 0.03, -0.41], near: 0.32}; };

export type EvaOpts = {
  /** Floating foot point (metres): the rig stands its feet here; no ground, no shadow. */
  at: V3; view: View4; face?: ExpressionId; faceState?: Partial<FaceState>;
  quarter?: 'left' | 'right'; quarterDeg?: number;
  helmet: Helmet; t: number;
  r?: ArmM; l?: ArmM;
  /** Leg stripes (CREW). */
  stripes?: boolean;
  fig?: Partial<FigPose>;
  /** Shade the whole figure toward a colour (sepia, Earthshine) [to, u]. */
  tint?: [string, number];
  /** Sun rim on the screen-left (-1) or screen-right (+1) edge of the helmet / suit, 0 = none. */
  rim?: -1 | 0 | 1;
  /** Named pose from the pose sheet (`zero-g-neutral` is P46) instead of the hand-authored `r`/`l` arms; `r`/`l`/`fig` still override. */
  pose?: AnyPoseId;
  /** A motion (`kit/motions.ts`, e.g. `zero-g-drift`, `pat-check`, `rail-tow`) at shot time `t`: its body fields, arms (with glove depth),
   * root offset and roll are applied; `pose` is the pose it layers on (default P46). `r`/`l`/`fig` still override. */
  motion?: {id: MotionId; t: number; pose?: AnyPoseId; distance?: number};
  /** Whole-card roll in degrees about the hips (B1; positive = head toward screen right). Defaults to the motion's roll. */
  roll?: number;
  seed?: number;
};
export type EvaAnchors = FigAnchors & {u: number; lips: Pt; bubble: {c: Pt; r: number}; ring: Pt; roll: number};

const at2 = (sh: Pt, u: number, m: Pt): Pt => [sh[0] + m[0] * u, sh[1] - m[1] * u];

/** One suited figure through the yaw camera. */
export const paintEva = (p0: Painter, c: YCam, def: CastDef, o: EvaOpts): EvaAnchors | null => {
  const g0 = camPoint(c, o.at);
  if (!g0) return null;
  const u = camUnit(c, o.at);
  const view0 = figureView4(c, o.at, squareToCam(c, o.at, o.view));
  // motion or named pose: body fields and arms in px from the shoulders of the posed body (the same arms `paintFigureAt` takes)
  const layered: Layered | undefined = o.motion ? layerMotion({person: def, motion: o.motion.id, t: o.motion.t, g: g0 as Pt, unit: u, view: view0 === 'back' ? 'front' : view0, pose: o.motion.pose ?? o.pose ?? 'P46', expression: o.face, distance: o.motion.distance, seed: o.seed}) : undefined;
  const g = (layered ? layered.g : g0) as Pt;
  const view = layered ? (layered.view as View4) : view0;
  const named: Partial<FigPose> = layered ? (({face, ...rest}) => rest)(layered.pose) : o.pose ? poseFor(o.pose, def, g, u, view === 'back' ? 'front' : view) : {};
  const roll = o.roll ?? layered?.roll ?? 0;
  const p = o.tint ? tintPainter(p0, o.tint[0], o.tint[1], {brush: true}) : p0;
  const seed = o.seed ?? def.seed;
  // the shoulders the arm offsets hang from must come from the same body fields drawFigure gets below (crouch 0.22 + `fig`): with
  // `{view}` alone the anchor sat ~0.13 m above the painted shoulder and every authored arm lost that length (v1 short-arm defect)
  const body = {crouch: 0.22, ...named, view, ...o.fig} as FigPose;
  const arms: Partial<FigPose> = {};
  if (o.r) { const sh = shoulderPoint(def, g, u, body, 'r'); arms.rArm = {to: at2(sh, u, o.r.to), via: at2(sh, u, o.r.via), behind: o.r.behind}; }
  if (o.l) { const sh = shoulderPoint(def, g, u, body, 'l'); arms.lArm = {to: at2(sh, u, o.l.to), via: at2(sh, u, o.l.via), behind: o.l.behind}; }
  const face = {...(layered ? layered.pose.face : EXPRESSIONS[o.face ?? 'neutral']), ...(o.faceState ?? {})} as FaceState;
  const pivot = roll ? hipAnchor(def, g, u, body) : g;
  let result!: EvaAnchors;
  withRoll(p0, pivot, roll, () => { result = paintBody(); });
  return rollEva(result, pivot, roll);
  function paintBody(): EvaAnchors {
  const a = drawFigure(p, def, g, u, {...named, view, face, noShadow: true, crouch: 0.22, ...(o.quarter && view === 'front' ? {quarter: o.quarter, quarterDeg: o.quarterDeg ?? 30} : {}), ...arms, ...o.fig}, o.t, seed);
  const HD = 0.425, headH = a.chin - a.headTop;
  const hc: Pt = [a.head[0], a.headTop + headH * 0.52];
  const R = 0.29 * u * (headH / (HD * u));
  // leg stripes (CREW): a red band on each thigh
  if (o.stripes && view !== 'back') {
    const hipY = g[1] - 0.72 * u, w = 0.16 * u;
    const xs = view === 'front' ? [g[0] - 0.09 * u, g[0] + 0.09 * u] : [g[0] + (view === 'right' ? 0.0 : 0.0)];
    xs.forEach((x, i) => hardFill(p, seed * 100 + 70 + i, EVA.stripe, [[x - w * 0.42, hipY + 0.05 * u], [x + w * 0.42, hipY + 0.05 * u], [x + w * 0.4, hipY + 0.11 * u], [x - w * 0.4, hipY + 0.11 * u]]));
  }
  // neck ring: a metal collar at the chin with the blue lock collar under it
  const ringY = a.chin + 0.008 * u, rw = 0.21 * u, rh = 0.055 * u;
  const ringPts = ell(hc[0] + (view === 'right' ? -0.02 * u : view === 'left' ? 0.02 * u : 0), ringY, view === 'front' || view === 'back' ? rw : rw * 0.8, rh, 20);
  // only the front band of the ring shows (a crescent under the chin); the blue lock collar is a thin band below it
  const lower = (pts: Pt[], dy: number) => pts.filter(([, y]) => y >= ringY - 0.01 * u).map(([x, y]): Pt => [x, y + dy]);
  const band = [...lower(ringPts, 0), ...lower(ringPts, 0.04 * u).reverse()];
  const cband = [...lower(ringPts, 0.04 * u), ...lower(ringPts, 0.058 * u).reverse()];
  if (band.length > 4) { hardFill(p, seed * 100 + 81, EVA.ring, band); hardFill(p, seed * 100 + 80, EVA.collar, cband); inkLine(p, seed * 100 + 82, [...band, ...cband.slice(Math.floor(cband.length / 2))], {weight: 0.9, color: mixColor(EVA.ring, INK, 0.6)}); }
  // gloves: grey mittens over the rig hands (UT14: thumb lobe, two finger strokes), dark palm hint
  const nearScale = (m?: {near?: number}) => { const d = c.f / u; return m?.near ? Math.min(1.3, d / Math.max(0.3, d - m.near)) : 1; };
  const glove = (h: Pt, k: number, sh: Pt, mid: Pt, sc = 1) => {
    const gr = 0.062 * u * sc, el: Pt = [2 * mid[0] - sh[0], 2 * mid[1] - sh[1]], dl = Math.hypot(el[0] - h[0], el[1] - h[1]) || 1;
    const wd: Pt = [(el[0] - h[0]) / dl, (el[1] - h[1]) / dl]; // toward the wrist / elbow
    hardFill(p, seed * 100 + 90 + k, EVA.glove, ell(h[0], h[1], gr, gr * 1.1, 14));
    hardFill(p, seed * 100 + 92 + k, mixColor(EVA.glove, EVA.palm, 0.45), ell(h[0] + gr * 0.15, h[1] + gr * 0.35, gr * 0.6, gr * 0.45, 12));
    inkLine(p, seed * 100 + 94 + k, ell(h[0], h[1], gr, gr * 1.1, 14), {weight: 0.9});
    inkLine(p, seed * 100 + 96 + k, [[h[0] - gr * 0.3, h[1] - gr * 0.55], [h[0] - gr * 0.25, h[1] - gr * 0.1]], {weight: 0.7, closed: false});
    // cuff ring
    hardFill(p, seed * 100 + 98 + k, EVA.collar, ell(h[0] + wd[0] * gr * 1.05, h[1] + wd[1] * gr * 1.05, gr * 0.75, gr * 0.28, 12, Math.atan2(wd[1], wd[0]) + Math.PI / 2));
  };
  // the cuff first (under the glove), so draw the glove after: reorder by drawing twice is not needed, the cuff sits outside the glove
  glove(a.rHand, 0, a.rShoulder, a.rUpper, nearScale(o.r ?? (layered && {near: layered.near.r}))); glove(a.lHand, 10, a.lShoulder, a.lUpper, nearScale(o.l ?? (layered && {near: layered.near.l})));
  // helmet
  const side = view === 'right' ? 1 : view === 'left' ? -1 : 0;
  const quarterDir = o.quarter === 'left' ? -1 : o.quarter === 'right' ? 1 : 0;
  if (o.helmet === 'bubble') {
    const circ = ell(hc[0], hc[1], R, R * 1.02, 32);
    p.wash('#cfe4ff', 22, circ, 0, 0); // faint glass tint (sheen <= 0.15)
    // retracted gold visor band at the crown
    const vb: Pt[] = [...ell(hc[0], hc[1], R * 0.98, R, 32).filter(([, y]) => y < hc[1] - R * 0.62), ...ell(hc[0], hc[1] - R * 0.2, R * 0.8, R * 0.62, 24).filter(([, y]) => y < hc[1] - R * 0.62).reverse()];
    if (vb.length > 3) hardFill(p, seed * 100 + 60, EVA.visor, vb);
    inkLine(p, seed * 100 + 61, circ, {weight: 1.1, color: '#5d6b80'});
    // rim highlight on the sun side and a small specular
    const rs = o.rim ?? -1;
    const arc = Array.from({length: 9}, (_, i): Pt => { const an = Math.PI * (1.1 + 0.3 * i / 8) + (rs > 0 ? Math.PI * 0.6 : 0); return [hc[0] + Math.cos(an) * R * 0.9, hc[1] + Math.sin(an) * R * 0.9]; });
    inkLine(p, seed * 100 + 62, arc, {weight: 2.2, color: '#ffffff', closed: false, curve: 0.4});
    hardFill(p, seed * 100 + 63, '#ffffff', ell(hc[0] + rs * R * 0.45, hc[1] - R * 0.55, R * 0.07, R * 0.05, 10));
  } else if (o.helmet === 'visor') {
    // CREW: white hard shell, gold visor over the whole face side (no face ever), a soft Earth reflection
    const circ = ell(hc[0], hc[1], R, R * 1.02, 32);
    hardFill(p, seed * 100 + 60, EVA.white, circ);
    hardFill(p, seed * 100 + 64, mixColor(EVA.white, EVA.shade, 0.5), ell(hc[0] - side * R * 0.25, hc[1] + R * 0.2, R * 0.8, R * 0.75, 24));
    const vx = hc[0] + side * R * 0.28, vrx = side ? R * 0.62 : R * 0.8, vry = R * 0.62;
    hardFill(p, seed * 100 + 65, EVA.visorDeep, ell(vx, hc[1] + R * 0.05, vrx, vry, 24));
    hardFill(p, seed * 100 + 66, EVA.visor, ell(vx - side * R * 0.04, hc[1], vrx * 0.9, vry * 0.85, 24));
    hardFill(p, seed * 100 + 67, '#5b8fd0', ell(vx + side * vrx * 0.2, hc[1] + vry * 0.4, vrx * 0.55, vry * 0.25, 16)); // Earth in the visor
    hardFill(p, seed * 100 + 68, '#fff3c4', ell(vx - side * vrx * 0.35 - (side ? 0 : vrx * 0.3), hc[1] - vry * 0.45, vrx * 0.18, vry * 0.1, 10));
    inkLine(p, seed * 100 + 69, ell(vx, hc[1] + R * 0.05, vrx, vry, 24), {weight: 0.9});
    inkLine(p, seed * 100 + 61, circ, {weight: 1.1});
  } else if (o.helmet === 'round1966') {
    const circ = ell(hc[0], hc[1], R * 1.03, R * 1.05, 32);
    hardFill(p, seed * 100 + 60, EVA.silver, circ);
    hardFill(p, seed * 100 + 64, mixColor(EVA.silver, '#5a4630', 0.35), ell(hc[0] + R * 0.18, hc[1] + R * 0.22, R * 0.75, R * 0.7, 24));
    hardFill(p, seed * 100 + 65, mixColor(EVA.silver, '#ffffff', 0.5), ell(hc[0] - R * 0.4, hc[1] - R * 0.45, R * 0.22, R * 0.14, 12));
    inkLine(p, seed * 100 + 61, circ, {weight: 1.1});
  }
  // lips point (glitter emitter = lips + 3 cm toward the camera / facing)
  const fx = view === 'front' ? hc[0] + quarterDir * headH * 0.1 : hc[0] + side * headH * 0.3;
  const lips: Pt = [fx, a.chin - headH * 0.16];
  return {...a, u, lips, bubble: {c: hc, r: R}, ring: [hc[0], ringY], roll};
  }
}

/** The anchors of a rolled `paintEva` result: the picture points rotate with the card, the bubble keeps its radius. */
const rollEva = (a: EvaAnchors, pivot: Pt, deg: number): EvaAnchors => {
  if (!deg) return a;
  const r = rollAnchors(a, pivot, deg);
  return {...r, lips: rollPt(a.lips, pivot, deg), bubble: {c: rollPt(a.bubble.c, pivot, deg), r: a.bubble.r}, ring: rollPt(a.ring, pivot, deg)};
};

export type HelmetPropOpts = {
  /** World centre of the bubble (metres). */
  at: V3;
  /** Spin about the vertical axis in degrees (0 = the visor band faces the lens; the band, the latch tab and the sheen slide with it). */
  spin?: number;
  /** Picture-plane tumble in degrees about the centre (positive = top toward screen right). */
  roll?: number;
  /** 'bubble' clear glass with the retracted gold visor band; 'round1966' the silver fishbowl shell. */
  helmet?: 'bubble' | 'round1966';
  /** Sun glint 0..1 (a soft bloom and a four-point star on the lit rim). */
  glint?: number;
  /** Bubble radius in metres (default 0.29, the radius `paintEva` puts over a kit head). */
  r?: number;
  seed?: number;
  /** Shade toward a colour [to, u], as `paintEva`. */
  tint?: [string, number];
};
export type HelmetPropAnchors = {c: Pt; r: number; ring: Pt; tab: Pt | null; u: number};

/** The detached helmet (`new: helmet prop`, EDU-EP08 B3): the bubble and neck ring as a world-space prop, with a position, a spin about the
 * vertical axis (the gold visor band and the lock-collar latch tab slide round it), a picture-plane tumble and an optional sun glint. It
 * is drawn from the same colours and radius as the worn `bubble` of `paintEva`, so the swap on the frame the helmet leaves the head is exact. */
export const paintHelmetProp = (p0: Painter, c: YCam, o: HelmetPropOpts): HelmetPropAnchors | null => {
  const g = camPoint(c, o.at);
  if (!g) return null;
  const u = camUnit(c, o.at), R = (o.r ?? 0.29) * u, seed = o.seed ?? 8800;
  const p = o.tint ? tintPainter(p0, o.tint[0], o.tint[1], {brush: true}) : p0;
  const spin = ((o.spin ?? 0) * Math.PI) / 180, kind = o.helmet ?? 'bubble';
  const pitch = Math.abs(c.pitch ?? 0); // YCam pitch is radians
  const cx = g[0], cy = g[1];
  const ringRx = R * 0.74, ringRy = ringRx * Math.min(0.5, 0.2 + pitch * 0.9), ringY = cy + R * 0.82;
  const tabAz = spin; // the latch sits on the ring at azimuth `spin` from the lens axis
  const tabVisible = Math.cos(tabAz) > 0.05;
  const tab: Pt | null = tabVisible ? [cx + ringRx * Math.sin(tabAz), ringY + ringRy * Math.cos(tabAz)] : null;
  withRoll(p, [cx, cy], o.roll ?? 0, () => {
    const circ = ell(cx, cy, R, R * 1.02, 32);
    // back half of the neck ring (seen through the glass), then the glass
    const backRing = ell(cx, ringY, ringRx, ringRy, 24).filter(([, y]) => y <= ringY);
    if (backRing.length > 3) inkLine(p, seed + 1, backRing, {weight: 1.0, color: '#5d6b80', closed: false});
    if (kind === 'round1966') {
      hardFill(p, seed + 2, EVA.silver, circ);
      hardFill(p, seed + 3, mixColor(EVA.silver, '#5a4630', 0.35), ell(cx + R * 0.18, cy + R * 0.22, R * 0.75, R * 0.7, 24));
      hardFill(p, seed + 4, mixColor(EVA.silver, '#ffffff', 0.5), ell(cx - R * 0.4, cy - R * 0.45, R * 0.22, R * 0.14, 12));
    } else {
      p.wash('#cfe4ff', 28, circ, 0, 0);
      // dark inner back wall opposite the sun: a crescent on the lower right
      p.wash('#8aa0c0', 26, ell(cx + R * 0.22, cy + R * 0.2, R * 0.78, R * 0.74, 24), 0, 0);
      // gold visor band, retracted at the crown; it spans 140 deg of azimuth around `spin` and shows only on the lens side
      const a0 = Math.max(-Math.PI / 2, spin - 1.22), a1 = Math.min(Math.PI / 2, spin + 1.22);
      if (a1 - a0 > 0.12) {
        const arc = (rr: number, from: number, to: number, n = 14) => Array.from({length: n + 1}, (_, i): Pt => { const th = from + ((to - from) * i) / n; return [cx + rr * Math.sin(th), cy - rr * Math.cos(th) * 0.99]; });
        hardFill(p, seed + 5, EVA.visor, [...arc(R * 0.98, a0, a1), ...arc(R * 0.68, a1, a0)]);
        inkLine(p, seed + 6, [...arc(R * 0.68, a0, a1)], {weight: 0.9, color: mixColor(EVA.visorDeep, '#000000', 0.2), closed: false});
      }
      // rim highlight on the lit (screen-left) side, sliding with the spin, and a small specular
      const rimA = Array.from({length: 9}, (_, i): Pt => { const an = Math.PI * (1.1 + 0.3 * i / 8); return [cx + Math.cos(an) * R * 0.9, cy + Math.sin(an) * R * 0.9]; });
      inkLine(p, seed + 7, rimA, {weight: 2.2, color: '#ffffff', closed: false, curve: 0.4});
      hardFill(p, seed + 8, '#ffffff', ell(cx - R * 0.45 + Math.sin(spin) * R * 0.1, cy - R * 0.55, R * 0.07, R * 0.05, 10));
    }
    inkLine(p, seed + 9, circ, {weight: 1.1, color: kind === 'bubble' ? '#5d6b80' : undefined});
    // the neck ring: the front half over the glass with the blue lock collar below it, and the latch tab
    const front = ell(cx, ringY, ringRx, ringRy, 24).filter(([, y]) => y >= ringY - 0.5);
    const band = [...front, ...front.map(([x, y]): Pt => [x, y + 0.05 * u]).reverse()];
    const cband = [...front.map(([x, y]): Pt => [x, y + 0.05 * u]), ...front.map(([x, y]): Pt => [x, y + 0.075 * u]).reverse()];
    if (band.length > 4) {
      hardFill(p, seed + 10, EVA.ring, band); hardFill(p, seed + 11, EVA.collar, cband);
      inkLine(p, seed + 12, [...band, ...cband.slice(Math.floor(cband.length / 2))], {weight: 0.9, color: mixColor(EVA.ring, INK, 0.6)});
    }
    if (tab) hardFill(p, seed + 13, mixColor(EVA.collar, '#101828', 0.5), [[tab[0] - 0.025 * u, tab[1] - 0.012 * u], [tab[0] + 0.025 * u, tab[1] - 0.012 * u], [tab[0] + 0.025 * u, tab[1] + 0.07 * u], [tab[0] - 0.025 * u, tab[1] + 0.07 * u]]);
    const gl = Math.max(0, Math.min(1, o.glint ?? 0));
    if (gl > 0) {
      const sx = cx - R * 0.55, sy = cy - R * 0.5;
      p.wash('#fff6d8', 90 * gl, ell(sx, sy, R * 0.26 * (0.6 + 0.4 * gl), R * 0.26 * (0.6 + 0.4 * gl), 18), 0.2, 0);
      const L = R * 0.5 * gl, w = R * 0.045 * gl;
      hardFill(p, seed + 14, '#ffffff', [[sx, sy - L], [sx + w, sy - w], [sx + L, sy], [sx + w, sy + w], [sx, sy + L], [sx - w, sy + w], [sx - L, sy], [sx - w, sy - w]]);
    }
  });
  return {c: rollPt([cx, cy], [cx, cy], 0), r: R, ring: rollPt([cx, ringY], [cx, cy], o.roll ?? 0), tab: tab && rollPt(tab, [cx, cy], o.roll ?? 0), u};
};

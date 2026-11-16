import {ell, INK, inkLine, solid, washAt} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import {DEG, type V3} from './space';
import {camPoint, camPoly, camSpace, type YCam} from './ycam';

// Dugout canoe and paddle (EDU-EP18-SHORT brief N2, VD04; pre-W3 comp card pass, 15 Nov 2026): a single-log hull in world metres,
// painted through the kit yaw camera and cut at the waterline, so a canoe on painted water shows only what floats above it.
//
// Units and frame. `at` is the hull centre ON the water surface (y = the water level). `heading` in degrees: 0 points the bow toward
// -z (away from a yaw-0 camera), 90 toward +x (screen right for a yaw-0 camera: a profile), 135 toward +x+z (bow toward the camera
// and screen right: a three-quarter). `rock` rolls the hull about its length (degrees, + lifts the left gunwale).
//
// Paint order (the figure sits IN the hull, so it is painted between the two calls):
//   const c = paintCanoeBack(p, cam, o)    // hull above water, interior, floor
//   ... paint the paddler at c.seat (FigPose `seated: true` + `sit: 1`, see `seatGround`) and the far-side paddle ...
//   paintCanoeFront(p, cam, o)             // near hull wall over the paddler's lap, gunwale ink, waterline glint
//   paintPaddle(p, cam, grips, ...)        // a near-side paddle last
// Dimensions are the brief's: 5.5 x 0.65 m, gunwale 0.25 m above the water; paddle 1.4 m.

export const CANOE = {
  length: 5.5, beam: 0.65, gunwale: 0.25, draft: 0.12, sheer: 0.07, floor: -0.06,
  /** Top of the low seat block the paddler sits on (m above the water): hips above the waterline, so nothing of her shows under the cut hull. */
  seat: 0.06,
  wood: '#5a3b26', light: '#8a6040', inside: '#3e2817', waterline: '#e8c08e',
} as const;
export const PADDLE = {length: 1.4, blade: 0.5, bladeW: 0.16, color: '#9a7048'} as const;

export type CanoeOpts = {
  at: V3; heading: number; rock?: number; seed?: number;
  /** Colours (default the brief's dugout wood); `light` is the sun side, `inside` the hull interior. */
  wood?: string; light?: string; inside?: string;
  /** Glint colour of the waterline ring (default the dawn sky glint `#e8c08e`). */
  glint?: string;
};
export type CanoeAnchors = {
  /** World point on the seat block at the paddler's seat (0.55 m aft of centre, `CANOE.seat` above the water). */
  seat: V3;
  bow: V3; stern: V3;
  /** +1 when the hull's right side (starboard) faces the camera, -1 when its left does. */
  near: 1 | -1;
  /** Unit vectors of the hull frame in world space. */
  fwd: V3; right: V3;
};

const N = 28; // stations along the length
const M = 9; // points per half cross-section (gunwale -> keel)

/** Half beam at station s (-1 stern .. 1 bow), m: full through the middle, pointed ends. */
export const halfBeam = (s: number) => (CANOE.beam / 2) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), 2.4)), 0.55);
/** Gunwale height above the water at s, m (the ends rise: sheer). */
export const gunwaleY = (s: number) => CANOE.gunwale + CANOE.sheer * s * s;
/** Keel height at s, m: the draft through the middle, rising to the gunwale at the tips. */
const keelY = (s: number) => -CANOE.draft + (CANOE.draft + gunwaleY(s) - 0.04) * Math.pow(Math.abs(s), 5);

const frame = (o: CanoeOpts) => {
  const h = o.heading * DEG, r = (o.rock ?? 0) * DEG;
  const fwd: V3 = [Math.sin(h), 0, -Math.cos(h)], right: V3 = [Math.cos(h), 0, Math.sin(h)];
  /** Hull-local (u along the length, v up, l toward the right side) to world. */
  const W = (u: number, v: number, l: number): V3 => {
    const v2 = v * Math.cos(r) + l * Math.sin(r), l2 = l * Math.cos(r) - v * Math.sin(r);
    return [o.at[0] + fwd[0] * u + right[0] * l2, o.at[1] + v2, o.at[2] + fwd[2] * u + right[2] * l2];
  };
  return {fwd, right, W};
};

/** Cross-section point k (0 gunwale .. M keel) on side `side` at station s, hull-local [u, v, l]. */
const section = (s: number, side: 1 | -1, k: number): V3 => {
  const a = (k / M) * (Math.PI / 2), w = halfBeam(s), top = gunwaleY(s), bot = keelY(s);
  return [s * (CANOE.length / 2), top - (top - bot) * Math.pow(Math.sin(a), 1.6), side * w * Math.pow(Math.cos(a), 0.45)];
};

/** World points of one side's hull above the water: gunwale (s from stern to bow) and the waterline under it. */
const sideRings = (o: CanoeOpts, side: 1 | -1) => {
  const {W} = frame(o), y0 = o.at[1];
  const gun: V3[] = [], wl: V3[] = [];
  for (let i = 0; i <= N; i++) {
    const s = -1 + (2 * i) / N;
    const pts = Array.from({length: M + 1}, (_, k) => W(...section(s, side, k)));
    gun.push(pts[0]);
    // First section point below the water: interpolate the crossing (a section entirely above water has no waterline point).
    for (let k = 1; k <= M; k++) {
      if (pts[k][1] < y0 && pts[k - 1][1] >= y0) {
        const t = (pts[k - 1][1] - y0) / (pts[k - 1][1] - pts[k][1]);
        wl.push([pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * t, y0, pts[k - 1][2] + (pts[k][2] - pts[k - 1][2]) * t]);
        break;
      }
    }
  }
  return {gun, wl};
};

/** Which side of the hull faces the camera. */
const nearSide = (cam: YCam, o: CanoeOpts): 1 | -1 => {
  const {right} = frame(o);
  return (cam.x - o.at[0]) * right[0] + (cam.z - o.at[2]) * right[2] >= 0 ? 1 : -1;
};

/** Convex hull of picture points (monotone chain). */
const hull2 = (pts: Pt[]): Pt[] => {
  const q = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of q) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...q].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** Sutherland-Hodgman: polygon `pts` clipped by the convex polygon `clip` (either winding). */
const clipConvex = (pts: Pt[], clip: Pt[]): Pt[] => {
  if (clip.length < 3) return [];
  let area = 0;
  for (let i = 0; i < clip.length; i++) { const a = clip[i], b = clip[(i + 1) % clip.length]; area += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area >= 0 ? 1 : -1;
  let out = pts;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], inside = (p: Pt) => sgn * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= 0;
    const src = out; out = [];
    for (let j = 0; j < src.length; j++) {
      const c = src[j], d = src[(j + 1) % src.length], ic = inside(c), id = inside(d);
      if (ic) out.push(c);
      if (ic !== id) {
        const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);
        const t = den === 0 ? 0 : ((b[0] - a[0]) * (a[1] - c[1]) - (b[1] - a[1]) * (a[0] - c[0])) / den;
        out.push([c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t]);
      }
    }
  }
  return out;
};

const proj = (cam: YCam, pts: V3[]) => pts.map((v) => camPoint(cam, v)).filter((v): v is Pt => !!v);

/** The canoe's anchors without painting (seat, tips, near side, frame). */
export const canoeAnchors = (cam: YCam, o: CanoeOpts): CanoeAnchors => {
  const {fwd, right, W} = frame(o);
  return {seat: W(-0.55, CANOE.seat, 0), bow: W(CANOE.length / 2, gunwaleY(1), 0), stern: W(-CANOE.length / 2, gunwaleY(-1), 0), near: nearSide(cam, o), fwd, right};
};

/**
 * Hull above the water (outer wood), the interior seen over the gunwales and the floor, cut at the waterline. Paint the paddler next,
 * then `paintCanoeFront`. Returns the anchors.
 */
export const paintCanoeBack = (p: Painter, cam: YCam, o: CanoeOpts): CanoeAnchors => {
  const seed = o.seed ?? 8700, wood = o.wood ?? CANOE.wood, inside = o.inside ?? CANOE.inside;
  const R = sideRings(o, 1), L = sideRings(o, -1);
  const above = proj(cam, [...R.gun, ...R.wl, ...L.gun, ...L.wl]);
  const shell = hull2(above);
  solid(p, seed, wood, shell, 4);
  // Interior: the rim ring (right gunwale stern->bow, left gunwale bow->stern). Seen from above the gunwale plane it is all interior.
  const rim = camPoly(cam, [...R.gun, ...[...L.gun].reverse()]);
  const camAboveRim = cam.y > o.at[1] + CANOE.gunwale;
  if (camAboveRim) {
    solid(p, seed + 1, inside, rim, 4);
    // Floor: a narrower flat ring at the floor height, lighter where the light falls in.
    const {W} = frame(o), fl: V3[] = [];
    for (let i = 2; i <= N - 2; i++) fl.push(W(-CANOE.length / 2 + (CANOE.length * i) / N, CANOE.floor, 0.62 * halfBeam(-1 + (2 * i) / N)));
    for (let i = N - 2; i >= 2; i--) fl.push(W(-CANOE.length / 2 + (CANOE.length * i) / N, CANOE.floor, -0.62 * halfBeam(-1 + (2 * i) / N)));
    // The floor lies below the near gunwale; only the part inside the rim outline is seen (clip, or it shows under the cut hull).
    washAt(p, seed + 2, mixColor(inside, o.light ?? CANOE.light, 0.35), 150, clipConvex(camPoly(cam, fl), hull2(rim)), 0.1, 0.2);
  }
  return canoeAnchors(cam, o);
};

/**
 * The near hull wall (over the paddler's lap), the gunwale ink, a few adze-grain marks on the near side and the waterline ring (a pale
 * glint line with a darker water band under it). Paint after the paddler.
 */
export const paintCanoeFront = (p: Painter, cam: YCam, o: CanoeOpts) => {
  const seed = (o.seed ?? 8700) + 20, wood = o.wood ?? CANOE.wood, lightC = o.light ?? CANOE.light;
  const near = nearSide(cam, o), Nr = sideRings(o, near), Fr = sideRings(o, near === 1 ? -1 : 1);
  const nearGun = proj(cam, Nr.gun), nearWl = proj(cam, Nr.wl);
  const wall = [...nearGun, ...[...nearWl].reverse()];
  solid(p, seed, wood, wall, 5);
  // Upper band in the light colour (the rounded shoulder under the gunwale catches the sky).
  const {W} = frame(o), band: V3[] = [], bandLo: V3[] = [];
  for (let i = 1; i < N; i++) {
    const s = -1 + (2 * i) / N, u = s * (CANOE.length / 2), w = halfBeam(s) * near;
    band.push(W(u, gunwaleY(s) - 0.005, w * 1.0));
    bandLo.push(W(u, gunwaleY(s) - 0.07, w * 0.99));
  }
  solid(p, seed + 1, mixColor(wood, lightC, 0.55), [...proj(cam, band), ...proj(cam, bandLo).reverse()], 3);
  // Grain: three long adze marks along the near side.
  [0.12, 0.17, 0.205].forEach((dv, j) => {
    const g: V3[] = [];
    for (let i = 4 + j; i <= N - 4 - j; i += 2) { const s = -1 + (2 * i) / N; g.push(W(s * (CANOE.length / 2), gunwaleY(s) - dv - 0.02 * Math.sin(i * 1.7 + j), halfBeam(s) * near * 0.97)); }
    inkLine(p, seed + 3 + j, proj(cam, g), {closed: false, weight: 0.45, curve: 0.3, color: mixColor(wood, INK, 0.45)});
  });
  // Gunwale ink: the near rim, the far rim (behind the interior) and the ends.
  inkLine(p, seed + 8, nearGun, {closed: false, weight: 1.1, curve: 0.2, color: mixColor(wood, INK, 0.7)});
  if (cam.y > o.at[1] + CANOE.gunwale) inkLine(p, seed + 9, proj(cam, Fr.gun), {closed: false, weight: 0.8, curve: 0.2, color: mixColor(wood, INK, 0.6)});
  inkLine(p, seed + 10, wall, {closed: true, weight: 0.9, curve: 0.15, color: mixColor(wood, INK, 0.65)});
  // Waterline: dark water band hugging the hull, then the glint line.
  if (nearWl.length > 2) {
    const band2 = nearWl.map(([x, y]): Pt => [x, y + 4]);
    solid(p, seed + 11, mixColor('#6b6a5e', INK, 0.35), [...nearWl, ...band2.reverse()], 2);
    inkLine(p, seed + 12, nearWl.map(([x, y]): Pt => [x, y + 1]), {closed: false, weight: 0.9, curve: 0.25, color: o.glint ?? CANOE.waterline});
  }
};

/** Paddle grip points (world) for a stroke on side `side` (+1 the hull's right) at phase 0..1 (0 catch forward, 0.5 blade at the hip). */
export const paddleGrips = (o: CanoeOpts, side: 1 | -1, phase: number): {top: V3; lower: V3} => {
  const {W} = frame(o), c = Math.cos(phase * Math.PI * 2), us = -0.55, f = CANOE.seat - 0.12; // grip heights were set on a hip 0.12 m lower
  // Within arm reach (2 bones 0.52 m from the seated shoulder) through the whole stroke: catch forward, exit at the hip.
  return {top: W(us + 0.16 + 0.08 * c, f + 0.56, side * 0.02), lower: W(us + 0.16 + 0.1 * c, f + 0.42, side * 0.3)};
};

/**
 * A 1.4 m paddle from the top T-grip through the lower grip: shaft, T-grip and blade. The part below `waterY` is drawn as a pale
 * glaze (seen through the water) down to `seeDepth` m under the surface (default 0.3: murky river water hides the rest) and a ripple
 * ring marks the entry. `widthDir` sets the blade face (default the hull's right axis).
 */
export const paintPaddle = (p: Painter, cam: YCam, grips: {top: V3; lower: V3}, o: {waterY: number; seed?: number; widthDir?: V3; color?: string; seeDepth?: number}) => {
  const seed = o.seed ?? 8760, color = o.color ?? PADDLE.color;
  const {top, lower} = grips, d0: V3 = [lower[0] - top[0], lower[1] - top[1], lower[2] - top[2]];
  const dl = Math.hypot(...d0), d: V3 = [d0[0] / dl, d0[1] / dl, d0[2] / dl];
  const at = (m: number): V3 => [top[0] + d[0] * m, top[1] + d[1] * m, top[2] + d[2] * m];
  const wd0 = o.widthDir ?? [0, 0, 1], dot = wd0[0] * d[0] + wd0[1] * d[1] + wd0[2] * d[2];
  let wd: V3 = [wd0[0] - dot * d[0], wd0[1] - dot * d[1], wd0[2] - dot * d[2]];
  const wl = Math.hypot(...wd) || 1;
  wd = [wd[0] / wl, wd[1] / wl, wd[2] / wl];
  const off = (v: V3, k: number): V3 => [v[0] + wd[0] * k, v[1] + wd[1] * k, v[2] + wd[2] * k];
  // Waterline crossing along the paddle (metres from the top), if any.
  const wet = d[1] < 0 && top[1] > o.waterY ? (top[1] - o.waterY) / -d[1] : top[1] <= o.waterY ? 0 : Infinity;
  const b0 = PADDLE.length - PADDLE.blade, hw = PADDLE.bladeW / 2;
  const blade = (m0: number, m1: number): V3[] => {
    const prof = (m: number) => hw * Math.min(1, 0.35 + 0.65 * Math.min(1, (m - b0) / 0.12)) * (m > PADDLE.length - 0.08 ? 0.75 + 0.25 * (PADDLE.length - m) / 0.08 : 1);
    const ms = Array.from({length: 7}, (_, i) => m0 + ((m1 - m0) * i) / 6);
    return [...ms.map((m) => off(at(m), prof(m))), ...[...ms].reverse().map((m) => off(at(m), -prof(m)))];
  };
  const shaftW = 0.016;
  const shaft = (m0: number, m1: number): V3[] => [off(at(m0), shaftW), off(at(m1), shaftW), off(at(m1), -shaftW), off(at(m0), -shaftW)];
  const dry = Math.min(wet, PADDLE.length);
  // Submerged part first (a glaze under the dry part).
  const seen = Math.min(PADDLE.length, dry + (o.seeDepth ?? 0.3) / Math.max(0.2, -d[1]));
  if (dry < PADDLE.length) {
    const sub = Math.max(dry, b0);
    if (dry < b0) washAt(p, seed, mixColor(color, '#8a9a94', 0.55), 110, camPoly(cam, shaft(dry, Math.min(b0, seen))), 0.1, 0.2);
    if (seen > sub) washAt(p, seed + 1, mixColor(color, '#8a9a94', 0.55), 110, camPoly(cam, blade(sub, seen)), 0.1, 0.2);
  }
  solid(p, seed + 2, color, camPoly(cam, shaft(0, Math.min(dry, b0))), 4);
  if (dry > b0) {
    const bl = camPoly(cam, blade(b0, dry));
    solid(p, seed + 3, color, bl, 4);
    inkLine(p, seed + 4, bl, {weight: 0.8, curve: 0.1, color: mixColor(color, INK, 0.65)});
  }
  inkLine(p, seed + 5, proj(cam, [off(at(0), shaftW), off(at(Math.min(dry, b0)), shaftW)]), {closed: false, weight: 0.6, curve: 0, color: mixColor(color, INK, 0.6)});
  // T-grip.
  const tg = camPoly(cam, [off(at(-0.02), 0.06), off(at(-0.02), -0.06), off(at(0.03), -0.05), off(at(0.03), 0.05)]);
  solid(p, seed + 6, mixColor(color, INK, 0.15), tg, 3);
  // Ripple ring where the paddle enters the water.
  if (Number.isFinite(wet) && wet > 0 && wet < PADDLE.length) {
    const e = camPoint(cam, at(wet));
    if (e) {
      const q = camSpace(cam, at(wet)), k = cam.f / q.d;
      inkLine(p, seed + 7, ell(e[0], e[1], 0.09 * k, 0.025 * k, 16), {weight: 0.8, curve: 0.2, color: CANOE.waterline});
      inkLine(p, seed + 8, ell(e[0], e[1] + 0.01 * k, 0.16 * k, 0.04 * k, 18), {weight: 0.5, curve: 0.2, color: mixColor(CANOE.waterline, '#6b6a5e', 0.4)});
    }
  }
};

/**
 * Ground point and unit for a seated paddler whose hips rest on the seat block at `seat`: draw with `{seated: true, sit: 1}` (no legs:
 * the hull hides the lap and the legs lie forward along the floor). `hipV` is the rig's sit hip height (`bodyFrame(def, {view, sit: 1}).hipV`).
 */
export const seatGround = (cam: YCam, seat: V3, hipV: number): {g: Pt; unit: number} | null => {
  const ground: V3 = [seat[0], seat[1] - hipV, seat[2]];
  const g = camPoint(cam, ground);
  if (!g) return null;
  return {g, unit: cam.f / camSpace(cam, seat).d};
};

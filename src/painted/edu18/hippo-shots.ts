// EDU-EP18-SHORT hippo per shot (Boss W5, 16 Nov 2026; sheet EDU-EP18-SHEETS-R1.0 item B1). The hippo's movement for every shot it plays in,
// selected by shot ID: `HIPPO_SHOTS['B01-SH03'](L)` gives the hippo3d v8 pose, its body origin on the water and heading for `HippoInSet`, and
// the water effects the set paints (rings, bow wave, spray) at shot-local frame L. Every value is a pure function of L (and of G for the
// ambient swim / lurk cycles, passed as `g`), so any frame seeks alone. Marks, frames and speeds are the sheet's; the reasons are in its
// staging deviations (SD02 charge from x -2, SD17 front-loaded yawn). Movement authored here (Boss owns movement); the Editor selects the
// shot ID, places the shot and sets the camera from the sheet.
//
// Light: `RIVER_HIPPO_KEY` is the world direction of the hippo's toon key light on the river (B01, B02), pass it as `HippoInSet` `light`.
// It is the approved LF01 light (hippo3d's view-space default under cLF01) carried into world space, so LF01 is unchanged and the B01-SH03
// camera (az 82) or the B02 bank cameras light the hippo from the same side of the set as the painted girl and canoe.
import {apply, H3_TIP, HIPPO3D_POSES, HIPPO3D_WATER, rig, type Hippo3DPose, type V3} from './hippo3d-sdf';
import {cLF01, hippoOrigin, LF01_H1, LF01_HIPPO_HEADING} from './looks-cams';
import type {YCam} from '../kit/ycam';
import {hardFill} from '../kit/draw';
import {mixColor, type Painter} from '../kit/painter';
import {paintHippoWaterFront, ringArcs, RIVER} from './river';
import {depth, ellPts, hn, P, poly, wCircle, wStroke} from './scenery';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a: number, b: number, t: number) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
const outCubic = (u: number) => 1 - (1 - clamp(u)) ** 3;
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** hippo3d's view-space default light under camera c, as a world direction (the inverse of hippo-set.tsx `viewLight`, without three.js). */
export const worldFromView = (c: YCam, v: V3): V3 => {
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw), ps = Math.sin(c.pitch ?? 0), pc = Math.cos(c.pitch ?? 0);
  const R = [[co, 0, s], [-s * ps, pc, co * ps], [-(s * pc), -ps, co * pc]];
  const n = Math.hypot(...v), u = v.map((x) => x / n);
  const w: V3 = [0, 1, 2].map((j) => R[0][j] * u[0] + R[1][j] * u[1] + R[2][j] * u[2]) as V3;
  return w;
};
/** World key light of the river set for the hippo (LF01 approved light, fixed in the world). */
export const RIVER_HIPPO_KEY: V3 = worldFromView(cLF01, [-0.55, 0.7, 0.55]);

/** Upper-jaw tip x ahead of the body origin (rig metres) for a pose: the snout mark used by the charge. */
export const snoutAhead = (P: Hippo3DPose) => apply(rig(P).head, H3_TIP)[0];
/** Upper-jaw tip height above the water (m) for a pose. */
export const tipAboveWater = (P: Hippo3DPose) => apply(rig(P).head, H3_TIP)[1] - HIPPO3D_WATER;

export type HippoFx = {
  /** B01-SH01: water bulge ring (radius m, opacity 0..1) at the head mark, with bubbles, before the head breaks */
  bulge?: {r: number; k: number};
  /** expanding rings (radius m) round the head mark, for river.ts `ringArcs` / `paintHippoWaterFront` */
  rings?: number[];
  /** charge: bow-wave height (m) ahead of the chest, and the surge wave front x (world) running on to the canoe after the halt */
  bowWave?: number; surgeX?: number;
  /** spray 0..1 (halt slap, snort blow) at `sprayAt` (world) */
  spray?: number; sprayAt?: V3;
};
export type HippoShotState = {
  pose: Hippo3DPose;
  /** body origin on the water surface (HippoInSet `at`) and sheet heading (0 = -z, 90 = +x) */
  at: V3; heading: number;
  /** head centre mark (world), where the sheet's H1 / H3 / H4 marks sit */
  head: V3;
  /** false: the hippo is fully under water (skip the WebGL layer) */
  visible: boolean;
  fx: HippoFx;
};
const DEG = Math.PI / 180;
const fromHead = (head: V3, heading: number) => hippoOrigin(head, heading);
const state = (pose: Hippo3DPose, head: V3, heading: number, fx: HippoFx = {}, visible = true): HippoShotState => ({pose, at: fromHead(head, heading), heading, head, visible, fx});

// ------------------------------------------------------------------------------------------------ B01-SH01 surface + yawn (SD17)
/**
 * Front-loaded SURFACE + YAWN on shot-local frames: bulge L0 (all under water), the head breaks the surface on L1, jaws open L2-14 to the
 * full 140 deg gape (bellow attack L2, ease-out so the mouth is wide early), hold L14-96 breathing +-3 deg, ease to a lazy half-close L96-118,
 * hold. The peak (L14-96) is the approved LF01 pose (`yawn(0.55)`) to within the breathing.
 */
export const surfaceYawn = (L: number): Hippo3DPose => {
  const peak = HIPPO3D_POSES.yawn(0.55);
  if (L < 1) return HIPPO3D_POSES.surface(0);                                   // L0: under, only the bulge shows
  if (L < 2) return {...HIPPO3D_POSES.lurk(0), lift: -0.25, nostril: 0.6};      // L1: the head breaks (eyes, ears, nostrils out)
  const rise = outCubic((L - 1) / 11);                                          // body up L1-12
  const open = outCubic((L - 2) / 12);                                          // jaws L2-14 (peak on L14)
  const breathe = L > 14 ? 0.0214 * Math.sin(((L - 14) / 40) * 2 * Math.PI) - 0.0214 : 0;   // +-3 deg of 140 about 137 deg
  const close = sm(96, 118, L);                                                 // lazy half-close
  const op = clamp(open * (1 + breathe) * (1 - 0.55 * close)), up = rise * (1 - 0.25 * close);
  const lift0 = -0.25;                                                           // from the L1 head-break pose (lurk carriage)
  return {float: 1, lift: mix(lift0, peak.lift ?? 0, up), pitch: mix(0.12, peak.pitch ?? 0, up), neckUp: 0.16 * (1 - up), headPitch: 0.14 + 1.33 * op, jaw: op, ears: -0.4 * op, nostril: 0.3 * op + 0.5 * (1 - sm(1, 4, L))};
};
const B01_SH01 = (L: number): HippoShotState => {
  const fx: HippoFx = L < 1 ? {bulge: {r: 0.6, k: 1}, rings: []} : {bulge: {r: 0.6 + 0.08 * (L - 1), k: clamp(1 - (L - 1) / 6)}, rings: SH01_RINGS.map((r, k) => Math.min(r, 0.6 + 0.05 * (L - 1 - 3 * k))).filter((r) => r > 0.62)};
  return state(surfaceYawn(L), LF01_H1, LF01_HIPPO_HEADING, fx, L >= 1);
};
/** LF01's ring radii: the rings grow out from the head mark at 1.5 m/s from L1 and settle at the look frame's radii. */
export const SH01_RINGS = [1.1, 1.6, 2.2, 2.9];

// ------------------------------------------------------------------------------------------------ B01-SH02 swim behind the canoe (SD01)
/** Canoe centre x in B01-SH02 (heading 90, 1.0 m/s): 10.2 -> 11.4 over L0-36. */
export const b01sh02CanoeX = (L: number) => 10.2 + (1.2 * L) / 36;
const SWIM_SEC = 1.6;
const B01_SH02 = (L: number, g: number): HippoShotState =>
  state(HIPPO3D_POSES.swim((g / 30 / SWIM_SEC) % 1), [b01sh02CanoeX(L) - 11.6, 0, -0.5], 90, {rings: [0.9 + 0.3 * ((g / 20) % 1)]});

// ------------------------------------------------------------------------------------------------ B01-SH03 charge + 8-frame halt (SD02, SD14)
/** Charge marks: snout x -2.0 at L0 -> 3.75 at the stop (L30), along +x at z -0.5; ease in L0-4, cruise, 8-frame halt L22-30, still L30-32. */
export const CHARGE = {z: -0.5, snout0: -2.0, snout1: 3.75, ramp: 4, cruiseEnd: 22, stop: 30, cycleF: 14} as const;
/** Normalised travel 0..1 of the charge: cubic ease-in to L4, constant speed to L22, linear deceleration to zero speed at L30. */
const travel = (L: number) => {
  const {ramp: a, cruiseEnd: b, stop: c} = CHARGE, total = a / 4 + (b - a) + (c - b) / 2;   // in units of (cruise speed x frames)
  const x = clamp(L, 0, c);
  const d = x <= a ? x ** 4 / (4 * a ** 3) : x <= b ? a / 4 + (x - a) : a / 4 + (b - a) + (x - b) - (x - b) ** 2 / (2 * (c - b));
  return d / total;
};
/** Cruise speed of the charge in m/s (sheet: about 7). */
export const chargeSpeed = () => {
  const {ramp: a, cruiseEnd: b, stop: c} = CHARGE, total = a / 4 + (b - a) + (c - b) / 2;
  return ((CHARGE.snout1 - CHARGE.snout0) / total) * 30;
};
const chargePose = (L: number): Hippo3DPose => (L < CHARGE.cruiseEnd ? HIPPO3D_POSES.charge((L / CHARGE.cycleF) % 1) : HIPPO3D_POSES.halt(clamp((L - CHARGE.cruiseEnd) / (CHARGE.stop - CHARGE.cruiseEnd))));
const B01_SH03 = (L: number): HippoShotState => {
  const P = chargePose(L);
  // the body origin runs so that the snout of the CHARGE pose (start) and of the settled HALT pose (stop) land on the marks; the halt's own
  // forward lurch (fwd) rides on top between them
  const o0 = CHARGE.snout0 - snoutAhead(HIPPO3D_POSES.charge(0)), o1 = CHARGE.snout1 - snoutAhead(HIPPO3D_POSES.halt(1));
  const ox = mix(o0, o1, travel(L)), heading = 90, at: V3 = [ox, 0, CHARGE.z];
  const head: V3 = [ox + 1.2, 0, CHARGE.z];
  const speedK = L < CHARGE.cruiseEnd ? clamp(L / CHARGE.ramp) : 1 - clamp((L - CHARGE.cruiseEnd) / 8);
  const fx: HippoFx = {bowWave: 0.4 * speedK, spray: L >= 22 ? clamp(1 - (L - 22) / 10) : 0, sprayAt: [ox + snoutAhead(P), 0, CHARGE.z],
    surgeX: L >= CHARGE.cruiseEnd ? CHARGE.snout1 + 4.0 * clamp((L - CHARGE.cruiseEnd) / 10) + 2.5 * clamp((L - 32) / 30) : undefined};
  return {pose: P, at, heading, head, visible: true, fx};
};

// ------------------------------------------------------------------------------------------------ B01-SH05 lurk + snort at L30
export const H3_MARK: V3 = [4, 0, -0.8];
const LURK_SEC = 3;
const SNORT_FROM = 22, SNORT_LEN = 24;   // snort(t) blows at t 0.3-0.42: L29-32
const B01_SH05 = (L: number, g: number): HippoShotState => {
  const t = (L - SNORT_FROM) / SNORT_LEN, snorting = t >= 0 && t <= 1;
  const P = snorting ? HIPPO3D_POSES.snort(t) : HIPPO3D_POSES.lurk((g / 30 / LURK_SEC) % 1);
  const blow = snorting ? sm(0.3, 0.42, t) * (1 - sm(0.55, 0.8, t)) : 0;
  return state(P, H3_MARK, 80, {spray: blow, sprayAt: [H3_MARK[0] + 0.55 * Math.sin(80 * DEG), 0.15, H3_MARK[2] - 0.55 * Math.cos(80 * DEG)]});
};

// ------------------------------------------------------------------------------------------------ B02 bank: H4 lurk, small yawn, sink (SD03, SD04)
/** H4 (coordinator request, 16 Nov 2026): from SD03's (56.3, 0, 6.0) to the near shallows just off the sandbank (water edge z ~11, brief) so the
 *  B02-SH01 selfie shows a readable head left of her hair and above the lens arm; B02-SH03 shares the mark. */
export const H4_MARK: V3 = [57.9, 0, 11.4];
const H4_HEADING = 180;   // facing the bank (toward +z, the lens side)
/** B02-SH01: lurk with the head 0.12 m higher than the river lurk, so brow, eyes, ears and the top of the snout show in the selfie. */
const B02_SH01 = (_L: number, g: number): HippoShotState => { const P = HIPPO3D_POSES.lurk((g / 30 / LURK_SEC) % 1); return state({...P, lift: (P.lift ?? 0) + 0.12}, H4_MARK, H4_HEADING); };
/** B02-SH03: lurk; a small yawn on "ความดุ" L42-70 (head up to about 0.6 m, jaws half open), then it sinks L70-90 and stays under. */
export const smallYawn = (L: number, g: number): Hippo3DPose => {
  const base = HIPPO3D_POSES.lurk((g / 30 / LURK_SEC) % 1);
  const up = sm(42, 52, L) * (1 - sm(62, 72, L)), op = sm(45, 54, L) * (1 - sm(60, 68, L)), sink = sm(70, 90, L);
  return {...base, lift: (base.lift ?? 0) + 0.2 * up - 0.5 * sink, pitch: 0.12 + 0.08 * up, headPitch: 0.14 + 0.55 * op, jaw: 0.55 * op, ears: -0.3 * op, nostril: 0.1 + 0.3 * op};
};
const B02_SH03 = (L: number, g: number): HippoShotState => state(smallYawn(L, g), H4_MARK, H4_HEADING, {rings: L >= 42 && L < 100 ? [0.5 + 0.03 * (L - 42), 0.3 + 0.03 * Math.max(0, L - 70)].filter((r) => r > 0.3) : []}, L < 92);

/** Every hippo shot by ID: `(L, g)` with L the shot-local frame and g the composition frame G (ambient cycles). */
export const HIPPO_SHOTS: Record<string, (L: number, g: number) => HippoShotState> = {
  'B01-SH01': (L) => B01_SH01(L),
  'B01-SH02': B01_SH02,
  'B01-SH03': (L) => B01_SH03(L),
  'B01-SH05': B01_SH05,
  'B02-SH01': B02_SH01,
  'B02-SH03': B02_SH03,
};
export const HIPPO_SHOT_IDS = Object.keys(HIPPO_SHOTS);
/** Shot start frames G (sheet shot map), for the shot cards and tests. */
export const HIPPO_SHOT_START: Record<string, number> = {'B01-SH01': 0, 'B01-SH02': 127, 'B01-SH03': 163, 'B01-SH05': 241, 'B02-SH01': 297, 'B02-SH03': 389};
export {HIPPO3D_WATER};

// ------------------------------------------------------------------------------------------------ water effects (painted, river set)
/** Back pass (under the WebGL hippo): far ring arcs and the B01-SH01 bulge (a raised pale dome ring with bubbles at the head mark). */
export const paintHippoFxBack = (p: Painter, c: YCam, s: HippoShotState, seed = 18600) => {
  if (s.fx.rings?.length) ringArcs(p, c, s.head, s.fx.rings, 'back', seed);
  const b = s.fx.bulge;
  if (b && b.k > 0.02) {
    // a low dome of water: a slightly lighter disc, a lighter crown and a pale broken rim where it sheds outward
    const q = poly(c, wCircle([s.head[0], 0.02, s.head[2]], b.r, 30));
    if (q.length > 2) hardFill(p, seed + 50, mixColor(RIVER.waterNear, RIVER.mist, 0.3 * b.k), q);
    const q2 = poly(c, wCircle([s.head[0] + 0.05, 0.06, s.head[2] - 0.05], b.r * 0.55, 24));
    if (q2.length > 2) hardFill(p, seed + 51, mixColor(RIVER.waterNear, RIVER.glint, 0.4 * b.k), q2);
    wStroke(p, c, seed + 52, wCircle([s.head[0], 0.02, s.head[2]], b.r * 1.02, 30, 0.3, 5.6), mixColor(RIVER.waterNear, '#f3e9d8', 0.7 * b.k), 1.4);
    for (let k = 0; k < 7; k++) {   // bubbles
      const a = hn(seed + k) * 6.283, r = b.r * (0.2 + 0.7 * hn(seed + 20 + k)), w = P(c, [s.head[0] + r * Math.cos(a), 0.04, s.head[2] + r * Math.sin(a)]);
      if (!w) continue;
      const u = (c.f * 0.035 * (0.6 + hn(seed + 40 + k))) / Math.max(0.5, depth(c, s.head));
      hardFill(p, seed + 60 + k, k % 2 ? '#f6efe4' : RIVER.glint, ellPts(w[0], w[1], u, u * 0.6, 10));
    }
  }
};
/** Front pass (over the WebGL hippo): near ring arcs + foam collar, the charge bow wave and the surge front, spray. */
export const paintHippoFxFront = (p: Painter, c: YCam, s: HippoShotState, seed = 18900) => {
  if (s.visible && s.fx.rings) paintHippoWaterFront(p, c, s.head, s.fx.rings, seed);
  const bw = s.fx.bowWave ?? 0, sn = s.fx.sprayAt;
  if (bw > 0.02 && sn) {   // bow wave: a pale raised crescent ahead of the chest and two trailing wake lines
    const h = 0.35 * bw, x0 = sn[0] - 0.25, z0 = sn[2];
    const crest = Array.from({length: 13}, (_, k) => { const a = -1 + k / 6; return [x0 + 0.3 * (1 - a * a), h * (1 - a * a), z0 + 0.75 * a] as V3; });
    const base = crest.map(([x, , z]) => [x - 0.25, 0, z] as V3).reverse();
    const q = poly(c, [...crest, ...base]);
    if (q.length > 2) hardFill(p, seed + 120, '#f3e9d8', q);
    for (const sd of [-1, 1]) {
      const wake = poly(c, [[x0, 0.02, z0 + sd * 0.7], [x0 - 2.5, 0.01, z0 + sd * 1.4], [x0 - 2.5, 0.01, z0 + sd * 1.25], [x0, 0.02, z0 + sd * 0.55]]);
      if (wake.length > 2) hardFill(p, seed + 130 + sd, RIVER.mist, wake);
    }
  }
  if (s.fx.surgeX !== undefined) {   // the surge wave front running on toward the canoe after the halt
    const x = s.fx.surgeX, pts: V3[] = Array.from({length: 11}, (_, k) => [x - 0.4 * ((k / 5 - 1) ** 2), 0.03, CHARGE.z - 2.2 + 0.44 * k]);
    const q = poly(c, [...pts, ...[...pts].reverse().map(([a, , b]) => [a - 0.18, 0, b] as V3)]);
    if (q.length > 2) hardFill(p, seed + 140, RIVER.mist, q);
  }
  const sp = s.fx.spray ?? 0;
  if (sp > 0.02 && sn) {   // spray: drops thrown up and forward from the snout
    const u0 = c.f / Math.max(0.5, depth(c, sn));
    for (let k = 0; k < 18; k++) {
      const a = hn(seed + 200 + k), b = hn(seed + 230 + k), w = P(c, [sn[0] + 0.5 * (a - 0.3), 0.15 + 0.7 * b * sp, sn[2] + 0.8 * (hn(seed + 260 + k) - 0.5)]);
      if (!w) continue;
      const r = u0 * (0.02 + 0.03 * hn(seed + 290 + k)) * (0.5 + sp);
      hardFill(p, seed + 300 + k, k % 3 ? '#f6efe4' : RIVER.mist, ellPts(w[0], w[1], r, r * 0.8, 8));
    }
  }
};

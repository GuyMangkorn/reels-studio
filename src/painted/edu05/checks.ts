import {ell, solid, washAt} from '../kit/draw';
import {poseMix} from '../kit/poses';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camOf, MACRO_CAMS} from './cams';
import {edgeShade, paintGarden, paintPlanter, planterBlades, shadeEdgeAt} from './garden';
import {paintMug, paintTiny, tinyItem} from './cast';
import {paintBalcony, steam} from './balcony';
import {poseFor} from '../kit/poses';
import {sweep} from './garden';
import {blendFig, braceClamp, namedPose, NAMED_POSES, paintClamp, VIEW_OF} from './poses';
import {TINY} from './cast';
import {coldTiny, paintPuff, shadeSet} from './scenes';
import {antItem, antWalk, ANT_SPEED} from './ant';
import {paintFarTower} from './effects';
import type {Arm, FigAnchors, FigPose} from '../kit/cast';
import {BONE, legScale} from '../kit/cast';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {B_DEW, D1_CONTACT} from './garden';
import {bladeItem} from './macro';
import {dropHand, dropStateFor, paintDropState} from './drop';
import type {Item} from './world';

// EDU-EP05 W5.2 element check scenes: pure paint functions of the frame (stills only), one per element group, rendered with
//   printf 'EDU5-CHK-EDGE 45 out/edu05/w52/g1/EDGE45.png\n' | node scripts/stills.mjs src/painted/edu05/check-index.ts
// They show an element in its shot's camera and staging, not a finished shot (Editor assembles those).

export const CHECK_FRAMES = {EDGE: 90, DEW1: 77, DROP2: 86, DROP3: 119, DROP4: 132, ANTW: 25, FX: 80, FAC: 97, SPECK: 32, DRIFT: 159, POSES: 210, CRUMB: 115, PUFF: 140, LIFT: 173, LIFTOFF: 89, LANDING: 93, SIP: 41, TOUCH: 71, STAND: 32, COLD: 77, PASS: 89, BARS: 173, END: 196} as const;
const FPS = 30;

/** G1: N2 shade edge sliding -0.5 -> -1.2 (S01-B05-SH01 L 0-89) with the shot camera, TINY cooled by `edgeShade` (K1), a gust (N1). */
export const paintEDGE = (p: Painter, frame: number) => {
  const shot = 'S01-B05-SH01', c = camOf(MACRO_CAMS[shot], frame / 89), edge = shadeEdgeAt(shot, frame), t = frame / FPS;
  const at: V3 = [-1.75, 0, -0.6], u = edgeShade(at[0], edge);
  paintGarden(p, c, {t, mode: 'sun', drop: false, shadeEdge: edge, sun: [900, 330], gust: {dir: [0, -1], amt: 0.2},
    items: [
      antItem([-4.2 + frame * 0.07 * 1.0, 0, -2.0], {view: 'right', walk: frame / 18, t, tint: {to: '#6f8aa0', u: 0.4 * edgeShade(-4.2 + frame * 0.07, edge)}}),
      tinyItem({at, view: 'front', pose: 'P33', face: 'surprised', t, tint: {to: '#4f6fb8', u: 0.27 * u, mul: [0.95, 0.93, 0.97]}}),
    ]});
};

export const MEASURE: Record<string, FigAnchors | null> = {};
// G2 (N4 dew drop shots, `paintDROP2` / `paintDROP3` / `paintDROP4`) and `paintDEW1` moved to the R1.10 block at the end of this file.

/** G3: N6 ant-walk, 24 f at the S01-B05-SH01 speed (0.07 sm/f) on the shot camera: feet planted, leaf upright, gait clock by distance. */
export const paintANTW = (p: Painter, frame: number) => {
  const shot = 'S01-B05-SH01', v = ANT_SPEED[shot], c = camOf({...MACRO_CAMS[shot], yaw: [-10, -10], r: [2.2, 2.2], at: [[0.6, 0.5, -2.0], [0.6, 0.5, -2.0]]}, 0), t = frame / FPS;
  const x0 = -0.2, d = v * frame, w = antWalk(d);
  paintGarden(p, c, {t, mode: 'sun', drop: false, shadeEdge: -3, sun: [900, 330], items: [antItem([x0 + d, 0, -2.0], {view: 'right', walk: w.walk, sway: w.sway, t})]});
};

/** G4-G8: N7 pop ring, N8 puffs, N5 crumb, N9 bars on one frame sheet (frame = shot-local frame of the sheet it belongs to, see fx key). */
import {CRUMB, crumbFollowHand, crumbGrips, warmthPuffsAt, paintCrumb, paintScaleBars, paintShrinkPop, paintWarmthPuffs, barsAt, shrinkScale, type PuffSpec} from './effects';
export const paintFX = (p: Painter, frame: number) => {
  const c = camOf(MACRO_CAMS['S01-B04-SH03'], 0.5), t = frame / FPS;
  paintGarden(p, c, {t, mode: 'sun', drop: false, shadeEdge: -0.5, sun: [900, 330], items: [
    {at: [-2.4, 0, -0.6], draw: (q, cc) => paintCrumb(q, cc, [-2.4, 0, -0.6], {bites: frame > 22 ? 1 : 0})},
  ]});
  const puffs: PuffSpec[] = [{anchor: [760, 1000], r: 90, drift: [-110, -80], period: 0.6, life: 1.8, phase: 0}, {anchor: [860, 1100], r: 70, drift: [-90, -60], period: 0.7, life: 1.6, phase: 0.2, squeeze: true}];
  paintWarmthPuffs(p, puffs, t + 2);
  paintShrinkPop(p, [560, 640], 55 + frame * 0.2);
  paintScaleBars(p, barsAt(frame * 2));
  void shrinkScale;
};

import {paintFacadeDown, paintFacadeUp, paintRing, lookDownCam, speckAt, speckCam} from './facade';
import {paintAirStreaks, paintDriftAir} from './effects';
/** G9: N3 look-down facade (S01-B01-SH02) with the cap. */
export const paintFAC = (p: Painter, frame: number) => { const c = lookDownCam(frame / 96); paintFacadeDown(p, c, frame / FPS); };
/** G9: N3 speck on the facade with the ring marker (S01-B02-SH03). */
export const paintSPECK = (p: Painter, frame: number) => {
  const k = frame / 31, c = speckCam(k); paintFacadeUp(p, c, k);
  const s = camPoint(c, speckAt(k, frame / FPS));
  if (s) { solid(p, 15900, '#3a2f2a', ell(s[0], s[1], 3, 3, 8), 2); paintRing(p, s, (frame - 2) / 6); }
};
/** SET-DRIFT body roll as the kit `lie` field: +-8 deg, sine, period 90 f (R1.3 FR13). */
export const driftRoll = (L: number) => (8 / 90) * Math.sin((2 * Math.PI * L) / 90);
/** G10: N2 drift air + N10 air streaks round TINY (S01-B02-SH02, spread arms). */
export const paintDRIFT = (p: Painter, frame: number) => {
  const c = camOf({at: [[0, 0.8, 0], [0, 0.8, 0]], yaw: [-10, 15], r: [2.4, 2.4], eye: [1.0, 1.0], f: 1050, hy: 780}, frame / 158), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  paintDriftAir(p, t, frame, 438);
  // R1.3 FR13: no contact shadow (she is airborne); body roll +-8 deg (sine, period 90 f) as the sheet's SET-DRIFT staging says (kit `lie`: 1 = 90 deg)
  tinyItem({at: [0, 0, 0], view: 'front', named: {name: 'drift-spread', L: frame}, face: 'surprised', t, shadow: false, fig: {lie: driftRoll(frame)}}, out).draw(p, c);
  const a = out.a;
  if (a) { const cx = a.head[0], cy = (a.headTop + 1218) / 2, ring: Pt[] = Array.from({length: 40}, (_, i) => [cx + Math.cos((i / 40) * 6.283) * 190, cy + Math.sin((i / 40) * 6.283) * 520] as Pt); paintAirStreaks(p, ring, frame); }
};

/** G11: N10 named poses, frame = index x 30 + L (L 0-29), one pose per 30 f, TINY alone on the garden ground at mid-shot scale. */
export const paintPOSES = (p: Painter, frame: number) => {
  const i = Math.min(NAMED_POSES.length - 1, Math.floor(frame / 30)), L = frame % 30, t = frame / FPS, name = NAMED_POSES[i];
  const c = camOf({at: [[0, 0.8, 0], [0, 0.8, 0]], yaw: [0, 0], r: [2.4, 2.4], eye: [1.0, 1.0], f: 1050, hy: 780}, 0);
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -2, items: [tinyItem({at: [0, 0, 0], view: VIEW_OF[name], named: {name, L}, face: 'neutral', t})]});
};

// G12 (`paintCRUMB`, B04-SH03) and G13 (`paintPUFF`, B04-SH02) moved to the R1.10 block at the end of this file.

/**
 * G14: S01-B05-SH03 stand-in (the lift, SHEETS-R1.5 FR17, R1.6 FR18). Story: she finds the loaf bigger than her body goes up easily (strength
 * against body weight is the point; R07: no flex, no strain wobble): grip, one clean drive, a single catch of the weight, then a calm
 * proud hold that breathes, a laugh bob on the laugh beat. Shot-local L (0-172):
 *  - L 0-35 seated (`sit-up-check`); L 35-40 seated -> squat blend (FR18); crouch 0.6 from L 40, hands reach the crumb's near (+x) face L 36-40: one low near the bottom
 *    corner, one high, 0.3 sm apart (they never clump); gather dip L 40-43 (crouch 0.6 -> 0.68).
 *  - drive L 43-54 (key L 54, sting): legs extend first (crouch -> 0 by L 50), the crumb rises beside her then swings over her head
 *    (height leads, x lags), so her face stays clear; each hand is a fixed point on the crumb that slides from the face grips to
 *    under its base (the `lift-overhead` palms), so the crumb never leaves her hands (FR18: the far hand too; FR19: no crumb shadow in the
 *    air; FR20, user: she stays front-facing and the far arm is drawn in front of her head, never behind it: the crumb holds low while
 *    the legs drive, then rises fast L 45-49, so the far arm crosses her chest at L 47 and her face only at L 48-49, then swings over).
 *  - catch L 54-62: one knee give of 0.06 crouch and back (the weight lands); hold from L 62: breath rise 5 mm, period 48 f;
 *    laugh bob L 100-112 (two 8 mm shoulder bounces, face `laugh`). The crumb rides the hands through all of it.
 */
/** R1.10 FR39: the figure and crumb solve of the lift at lift-local frame `Llift` for any camera (`paintLIFT` calls it with the SH03 camera, `paintEND` with SH04's). */
export type LiftState = {at: V3; rest: V3; crumb: V3; fig: Partial<FigPose> | undefined; seated: boolean};
export const liftState = (c: YCam, L: number): LiftState | null => {
  const at: V3 = [-1.75, 0, -0.6], rest: V3 = [-2.4, 0, -0.6];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  const seated = L < 36, ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  // FR18: seated -> squat over L 35-40 (b 0 -> 1): the floor sit opens up (floorSit 1 -> a*, where its hip height meets crouch 0.6)
  // while crouch eases in (torso scale), and both arms travel from their L 35 seated spots; pure crouch from L 40, no pop at L 36
  const b = ramp(35, 40), hip0 = legScale(TINY) * 0.672 + 0.038, aStar = easeInv((0.282 * (TINY.height / 1.7)) / (hip0 - 0.075));
  const s = ramp(43, 54), legs = ramp(43, 50);
  const crouch = L < 43 ? 0.6 + 0.08 * ramp(40, 43) : 0.68 * (1 - legs) + (L >= 54 && L < 62 ? 0.06 * Math.sin((Math.PI * (L - 54)) / 8) : 0);
  const rise = L >= 62 ? 0.005 * Math.sin((2 * Math.PI * (L - 62)) / 48) + (L >= 100 && L < 112 ? 0.008 * Math.abs(Math.sin((Math.PI * (L - 100)) / 6)) : 0) : 0;
  let crumb = rest, fig: Partial<FigPose> | undefined;
  if (!seated) {
    const pz = namedPose('lift-overhead', L - 42, TINY, g, u, 'front', {crouch, rise});
    if (pz.rArm && pz.lArm) {
      const handPx = (pz.rArm.to[1] + pz.lArm.to[1]) / 2;
      let top: V3 = [at[0], 1.9, at[2]];
      for (let i = 0; i < 4; i++) { const gg = crumbGrips(c, top); if (gg) top = [top[0], top[1] + (gg.centre[1] + 0.5 * CRUMB.h * gg.u - handPx) / gg.u, top[2]]; } // base on the palms
      // FR20 (user: stay front-facing, far arm in front of the head): the crumb holds low while the legs drive (ey from s 0.1), then
      // rises fast over s 0.1-0.55 (L 45-49) so the far arm crosses her face in two quick frames; it swings in over s 0.3-1 (no side push)
      const ey = smooth01((s - 0.1) / 0.45), ex = smooth01((s - 0.3) / 0.7);
      crumb = [rest[0] + (top[0] - rest[0]) * ex, rest[1] + (top[1] - rest[1]) * ey, rest[2]];
      const gr = crumbGrips(c, crumb)!, grT = crumbGrips(c, top)!, mix = (a: Pt, b: Pt, w: number): Pt => [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
      // a point on the crumb in its own metres (x from the base centre, y up from the base) -> px, and back (on the top crumb)
      const onC = (q: typeof gr, l: Pt): Pt => [q.centre[0] + l[0] * q.u, q.centre[1] + (0.5 * CRUMB.h - l[1]) * q.u];
      const toC = (q: typeof gr, px: Pt): Pt => [(px[0] - q.centre[0]) / q.u, 0.5 * CRUMB.h - (px[1] - q.centre[1]) / q.u];
      const face = 0.5 * CRUMB.w + 0.015, reach = ramp(36, 40);
      const lowX = pz.rArm.to[0] < pz.lArm.to[0]; // rArm = screen-left hand in `front`
      const [aL, aR] = lowX ? [pz.rArm, pz.lArm] : [pz.lArm, pz.rArm]; // screen-left (crumb side) / screen-right arm
      const knee = (side: -1 | 1): Pt => [g[0] + side * 0.1 * u, g[1] - 0.34 * u]; // hands at the knees as she comes up from the seat
      const shY = g[1] - (0.78 - 0.3 * (L < 43 ? 0.6 : 0.68 * (1 - legs))) * u; // rough shoulder height for the low elbow hints
      const low = (to: Pt, side: -1 | 1): Pt => { const sx = g[0] + side * 0.11 * u; return [(sx + to[0]) / 2 + side * 0.06 * u, (shY + to[1]) / 2 + 0.09 * u]; };
      // crumb-side hand: low on the near face, slides under the base corner as it leaves the ground, then to its palm spot overhead
      const w1 = smooth01(s / 0.3), w2 = smooth01((s - 0.4) / 0.6);
      const lLoc = mix(mix([face, 0.1], [0.3, -0.05], w1), toC(grT, aL.to), w2), lTo = mix(knee(-1), onC(gr, lLoc), reach);
      const left: Arm = {...aL, to: lTo, via: mix(low(lTo, -1), aL.via!, w2)};
      // far hand: high on the near face (crossing her waist in the squat)
      // FR18: the far hand keeps its grip through the swing (fixed points on the crumb, never off it). FR20: it rides 0.3 sm up the near
      // face (the top of the cut face) so it rises ahead of the base, and slides to its palm spot earlier (s 0.35-0.7) so the reach stays
      // within 0.6 sm of her shoulder (the `lift-overhead` stretch)
      const wa = smooth01(s / 0.3), wr = smooth01((s - 0.35) / 0.35);
      const rLoc = mix(mix([face, 0.42], [face, 0.3], wa), toC(grT, aR.to), wr), rTo = mix(knee(1), onC(gr, rLoc), reach);
      // FR20: the far arm is drawn whole in front of her (no `behind` while s 0.12-0.85; FR19's `behind: 'all'` round the back of her head
      // is gone). Elbow by two bones of BONE x u: below the shoulder -> hand line while the hand is below her mouth (L 47: the arm crosses
      // her chest under the chin), raised and out to screen-right once the hand is higher (L 48-49: a quick pass across the face to the
      // crumb above her head)
      const bk = s > 0.12 && s < 0.85;
      let rVia = mix(low(rTo, 1), aR.via!, w2);
      if (s > 0.1) {
        const pa = paintTiny(nullPainter(), c, {at, view: 'front', named: {name: 'lift-overhead', L: L - 42}, fig: {crouch, rise}, t: 0, shadow: false});
        if (pa) {
          const S = pa.lShoulder[0] > pa.rShoulder[0] ? pa.lShoulder : pa.rShoulder, B = BONE * u, dx = rTo[0] - S[0], dy = rTo[1] - S[1];
          const d = Math.min(Math.hypot(dx, dy), 2 * B - 1e-3), h = Math.sqrt(B * B - (d * d) / 4), n = Math.hypot(dx, dy) || 1;
          const down = rTo[1] > pa.chin - 0.35 * (pa.chin - pa.headTop); // hand below her mouth line
          let px = -dy / n, py = dx / n; if (down ? py < 0 : px < 0) { px = -px; py = -py; } // elbow down, or out toward screen-right
          const ik: Pt = [S[0] + (dx / n) * (d / 2) + px * h, S[1] + (dy / n) * (d / 2) + py * h];
          rVia = mix(rVia, mix(ik, aR.via!, w2), smooth01((s - 0.1) / 0.1));
        }
      }
      const right: Arm = {...aR, to: rTo, via: rVia};
      if (bk) delete right.behind;
      const armsL = lowX ? {rArm: left, lArm: right} : {rArm: right, lArm: left};
      if (b < 1) {
        const sp = namedPose('sit-up-check', 35, TINY, g, u, 'front'), blend = (a: Arm, z: Arm | undefined): Arm => z ? {...a, to: mix(z.to, a.to, b), via: mix(z.via ?? z.to, a.via ?? a.to, b)} : a;
        fig = {crouch: 0.6 * b, rise, floorSit: 1 - (1 - aStar) * b, rArm: blend(armsL.rArm, sp.rArm), lArm: blend(armsL.lArm, sp.lArm)};
      } else fig = {crouch, rise, ...armsL};
    }
  }
  return {at, rest, crumb, fig, seated};
};
export const paintLIFT = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B05-SH03'], L / 172), t = L / FPS + 60;
  const st = liftState(c, L);
  if (!st) return;
  const {at, rest, crumb, fig, seated} = st;
  const face = L < 40 ? 'surprised' : L >= 100 && L < 112 ? 'laugh' : 'happy';
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -1.2 - 1.8 * Math.min(1, L / 80), tipsAt: tipCams('S01-B05-SH03'), items: [
    // FR19: the contact shadow fades out over the first 5 cm of rise (it was painted under the base in the air, across her face at L 48)
    // user note (2026-11-07): the loose crumbs travelled with the lifted loaf and hung in the air at its left; they stay where it stood
    ...(crumb[1] > 0.005 ? [{at: rest, draw: (q: Painter, cc: YCam) => paintCrumb(q, cc, rest, {loose: 'only' as const, shadow: 0})}] : []),
    {at: crumb, bias: 0.1, draw: (q, cc) => paintCrumb(q, cc, crumb, {bites: 1, shadow: 1 - smooth01(crumb[1] / 0.05), loose: crumb[1] > 0.005 ? 'off' : 'on'})},
    tinyItem({at, view: 'front', named: seated ? {name: 'sit-up-check', L} : {name: 'lift-overhead', L: L - 42}, fig, face, t}),
  ]});
};
const nullPainter = (): Painter => { const k: unknown = new Proxy(function () {}, {get: (_t, q) => (q === 'alpha' || q === 't' || q === 'frame' ? 0 : k), apply: () => k}); return k as Painter; };
const smooth01 = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
/** Inverse of the smoothstep k*k*(3-2k) on 0..1 (the leg solver's `ease`). */
const easeInv = (y: number) => { const v = Math.min(1, Math.max(0, y)); return 0.5 - Math.sin(Math.asin(1 - 2 * v) / 3); };

// ---- B02 stand-ins for the two shots that had only a spec (SHEETS-R1.8, Boss): S01-B02-SH01 (lift-off) and S01-B02-SH04 (soft landing).
/** A key path through (frame, value) points, linear between keys and smoothed over +-2 frames so no key is a corner (deterministic). */
const keyed = (keys: [number, number][], L: number): number => {
  const at = (l: number) => {
    if (l <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (l <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return va + ((vb - va) * (l - a)) / (b - a); }
    return keys[keys.length - 1][1];
  };
  return (at(L - 2) + at(L - 1) + at(L) + at(L + 1) + at(L + 2)) / 5;
};
/** Soft contact shadow under a figure that is `h` sm off the ground: the kit's two washes, faded out over 0.35 sm (R1.3 FR13: none when she is in the air). */
const groundShadow = (p: Painter, c: YCam, at: V3, h: number, profile: boolean) => {
  const f = 1 - smooth01(h / 0.35), g = camPoint(c, [at[0], 0, at[2]]), u = camUnit(c, [at[0], 0, at[2]]);
  if (f <= 0.01 || !g) return;
  washAt(p, 5101, '#3b3226', 60 * f, ell(g[0], g[1], 0.32 * u, 0.06 * u, 16), 0.15, 0.2);
  washAt(p, 5102, '#1e2324', 70 * f, ell(g[0], g[1] + 0.01 * u, (profile ? 0.32 : 0.26) * u, 0.06 * u, 16), 0.5, 0.3);
};
/** TINY's feet anchor in S01-B02-SH01 at shot-local frame L: still at the lip (-0.4, 0, -6.0) to L 38, rising over the trough lip (wall top y 1.3 at z -6.4: she stays inside it until her feet pass 1.3, L 52), then out and up. */
export const liftoffAt = (L: number): V3 => [
  keyed([[0, -0.4], [38, -0.4], [54, -0.6], [88, -0.8]], L),
  keyed([[0, 0], [38, 0], [42, 0.1], [48, 0.62], [54, 1.5], [88, 3.0]], L),
  keyed([[0, -6.0], [38, -6.0], [50, -6.34], [62, -7.2], [88, -8.5]], L),
];
/**
 * G15: S01-B02-SH01 stand-in (breeze and lift-off, SD05 camera, SET-MACRO-PLANTER). Shot-local L (0-88):
 *  - L 4-30 breeze bends the tufts toward -z (tip deflection 0.22 of height, < 0.25, then holds); she stands at the lip, scared, leaning
 *    into it L 22-38 (P01 -> P39 arms, lean; both soles on the soil L 0-24 (kit `runMix` 0: stance, feet 0.12 sm apart), P39 legs blend in L 24-38 with the grounded foot fixed; R1.9 FR28).
 *  - L 38 lift-off: legs trail into the P39 stride only after the feet are off the ground (run ramps in L 38-46, no slide); she rises
 *    gently (first 4 f 0.1 sm), over the lip by L 54 (feet 1.5), clear by L 62, drifting up and away to (-0.8, 3.0, -8.5).
 *  - L 46-52 the stride closes, the lean goes and both arms come down along the body (profile: no arm points toward or away from the lens);
 *    L 52 one hard swap to the kit's front three-quarter (60 deg, no ghost), the body turns to the lens 60 -> 15 deg over L 52-60 while the arms
 *    open out from the sides to `drift-spread`; L 60 the exact front view, soft roll fades in over L 60-72 and ends where SH02's starts, ~0 deg.
 *  - the ground shadow fades with her height (none from 0.35 sm up).
 */
export const paintLIFTOFF = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B02-SH01'], L / 89), t = L / FPS + 100, at = liftoffAt(L), h = at[1];
  const ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  // profile phase: P01 -> P39 (the kit blend), the lean and arms come in L 22-38, the run (stride) only once she is off the soil
  const w = ramp(22, 38), side = poseMix('P01', 'P39', w, TINY, g, u, 'left');
  // profile: stride closes and both arms come down along the body L 46-52 (no arm points toward or away from the lens in a true profile)
  const close = ramp(46, 52), calmSide = poseMix('P01', 'P01', 0, TINY, g, u, 'left');
  const sideBase: Partial<FigPose> = {...side, run: 0.3 * ramp(38, 46) * (1 - close), runMix: ramp(24, 38), lean: (side.lean ?? 0) * (L < 38 ? w : 1) * (1 - close)};
  const sideFig: Partial<FigPose> = close > 0 ? {...sideBase, ...(() => { const m = blendFig(sideBase, calmSide, close); return {rArm: m.rArm, lArm: m.lArm}; })()} : sideBase;
  // L 52-60 one hard swap to the front three-quarter (60 deg), then the body turns to the camera (60 -> 15 deg) while the arms open out from the sides
  const turn = L >= 52, qDeg = keyed([[52, 60], [54, 50], [56, 40], [58, 28], [60, 15]], L), open = ramp(52, 60);
  const roll = driftRoll(L) * ramp(60, 72), frontNamed = namedPose('drift-spread', L, TINY, g, u, 'front');
  const restFront = frontNamed, calmFront = poseMix('P01', 'P01', 0, TINY, g, u, 'front');
  const armsOpen = blendFig(calmFront, restFront, open);
  const facing = 'scared' as const;
  const lipMat = L < 4 ? 0 : 0.22 * ramp(4, 30);
  const sideOpts = {at, view: 'left' as const, pose: 'P39' as const, face: facing, t, shadow: false, fig: sideFig};
  const frontFig: Partial<FigPose> = {...frontNamed, sideCloth: false, rArm: armsOpen.rArm, lArm: armsOpen.lArm, ...(L < 60 ? {quarter: 'left' as const, quarterDeg: qDeg} : {lie: roll})};
  const frontOpts = {at, view: 'front' as const, named: {name: 'drift-spread' as const, L}, face: facing, t, shadow: false, fig: frontFig};
  const lead: Item = {at, bias: 0, draw: (q, cc) => {
    if (h <= 1e-4) MEASURE.LIFTOFF = paintTiny(q, cc, {...sideOpts, shadow: true});
    else {
      groundShadow(q, cc, at, h, true);
      MEASURE.LIFTOFF = paintTiny(q, cc, turn ? frontOpts : sideOpts);
    }
  }};
  paintPlanter(p, c, {t, items: [lead], blades: planterBlades().filter((b) => b.root[2] < -5.3 || b.root[0] < -3.3 || b.root[0] > 3.4), wallItem: true, calm: [1150, 1370], bits: 110, gust: lipMat > 0 ? {dir: [0, -1], amt: lipMat} : undefined, tipsAt: camOf(MACRO_CAMS['S01-B02-SH01'], 0)});
};

/**
 * G16: S01-B02-SH04 stand-in (soft landing, "huh?", VD08; SET-GARDEN-GRASS sunlit clearing, T-TINY camera). Shot-local L (0-92):
 *  - L 0-6 she settles from y 0.6 in `drift-spread` (arms level, small roll ends at 0), feet touch at L 6 (soft: zero speed); no dust, no shake.
 *  - L 6-8 knees give (crouch 0.06 -> 0.30), L 8-16 one bounce of 0.3 sm (parabola, peak L 12), L 16-22 the knees keep folding to a squat (0.6).
 *  - L 22-30 squat -> floor sit (the FR18 blend run backwards: crouch eases out as `floorSit` grows from the level that matches the squat hip),
 *    arms travel from level to `sit-up-check` over L 16-30; no figure swap, one rig throughout.
 *  - L 34-62 four pats (R on L forearm, L on R thigh, ...: `sit-up-check` 1 pat / 7 f), rest hold after.
 *  - L 64-76 "huh": head tilts 14 deg (L 64-68 in, hold, out L 74-80) and the eyes drop to her hands; L 78 face surprised -> happy;
 *    L 87-91 the giggle: two small shoulder bounces (8 mm), face happy.
 */
export const paintLANDING = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B02-SH04'], L / 93), t = L / FPS + 30;
  const ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  const y = L < 6 ? 0.6 * (1 - smooth01(L / 6)) : L >= 8 && L < 16 ? 1.2 * ((L - 8) / 8) * (1 - (L - 8) / 8) : 0, at: V3 = [0, y, 0];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  // body: crouch (knees), then the squat -> floor sit blend (TINY.height / hip geometry as in paintLIFT)
  const crouch0 = keyed([[0, 0.06], [5, 0.06], [8, 0.3], [10, 0.1], [15, 0.1], [19, 0.45], [22, 0.6]], L);
  const bb = 1 - ramp(22, 30), hip0 = legScale(TINY) * 0.672 + 0.038, aStar = easeInv((0.282 * (TINY.height / 1.7)) / (hip0 - 0.075));
  const seat = L >= 22, crouch = L < 22 ? crouch0 : 0.6 * bb, floorSit = seat ? 1 - (1 - aStar) * bb : undefined;
  const bob = L >= 87 ? 0.008 * Math.abs(Math.sin((Math.PI * (L - 87)) / 3)) : 0, rise = bob;
  const body: Partial<FigPose> = {crouch, rise, ...(floorSit !== undefined ? {floorSit} : {}), lie: driftRoll(L) * (1 - ramp(0, 6)) * 0.6};
  const pats = Math.max(0, Math.min(28, L - 34)), wa = ramp(16, 30);
  const drift = namedPose('drift-spread', L, TINY, g, u, 'front', body), sit = namedPose('sit-up-check', pats, TINY, g, u, 'front', body);
  const arms = blendFig(drift, sit, wa);
  const tilt = 14 * (ramp(64, 68) - ramp(74, 80)), look: [number, number] = [0, 0.45 * (ramp(65, 68) - ramp(76, 80))];
  const face = L < 78 ? 'surprised' : 'happy';
  const lead: Item = {at, bias: 0, draw: (q, cc) => {
    if (y > 1e-4) groundShadow(q, cc, at, y, false);
    MEASURE.LANDING = paintTiny(q, cc, {at, view: 'front', named: {name: L < 22 ? 'drift-spread' : 'sit-up-check', L: L < 22 ? L : pats}, face, faceState: {look}, headCock: tilt, t, shadow: y <= 1e-4, fig: {...body, rArm: arms.rArm, lArm: arms.lArm}});
  }};
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [180, 300], items: [lead], tips: {n: 7, h: [0.08, 0.2]}, tipsAt: camOf(MACRO_CAMS['S01-B02-SH04'], 0)});
};

// ---- B01 stand-ins for the three shots that had only look frames or specs (SHEETS-R1.8, Boss): S01-B01-SH01 (sip), SH03 (touch and pop), SH04 (stand up).
/** Elbow of the mug arm, figure metres from the feet point (shoulder ~(-0.155, 1.05), hand at the lips ~(-0.01, 1.075)): out and ~0.15 below the shoulder, upper arm short in view (it comes toward the lens). */
const MUG_ELBOW: Pt = [-0.2, 0.9], COLLAR_HIDE = 0.85;
/** G17: S01-B01-SH01 stand-in (LF01 v3 set-up, SD01 camera, SET-BALCONY). Shot-local L (0-40): the mug rises L 8-16, at the lips L 16-26, back under the chin L 26-34. */
export const paintSIP = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B01-SH01'], L / 40), t = L / FPS, gp: V3 = [-0.4, 0, 0.2], out: {a?: FigAnchors | null} = {};
  const g = camPoint(c, gp), uu = camUnit(c, gp);
  if (!g) return;
  const at = (x: number, y: number): Pt => [g[0] + x * uu, g[1] - y * uu];
  const up = smooth01(keyed([[0, 0], [8, 0], [16, 1], [26, 1], [34, 0]], L));
  const dy = 0.06 * up;
  const held = (q: Painter, a: FigAnchors, u: number) => { const rim = paintMug(q, a.rHand, u, {handle: 1, from: -1, skin: TINY.head.skin}); steam(q, rim, u, t); };
  paintBalcony(p, c, {t, cast: [tinyItem({at: gp, view: 'front', pose: 'P19', face: 'sleepy', headCock: 4, t, held,
    // elbow winged out and low-forward of the torso (upper arm foreshortened, forearm up to the mug), so the bend reads against the rail; collar blended into the shirt behind the mug (no lone white wedge)
    fig: {rArm: {to: at(-0.01, 1.015 + dy), via: at(MUG_ELBOW[0] - 0.005 * up, MUG_ELBOW[1] + dy * 1.4)}, collarHide: COLLAR_HIDE}}, out)]});
  MEASURE.SIP = out.a ?? null;
};

/** The touch point of S01-B01-SH03 (grass blades on the planter's outer edge) and the mug's resting spot on the rail cap, world metres. */
const TOUCH_W: V3 = [0.15, 1.30, -0.05], MUG_W: V3 = [-0.1, 1.10, 0.0];
/**
 * G18: S01-B01-SH03 stand-in (touch and pop, VD05; SD03 camera). Shot-local L (0-70):
 *  - L 2-7 she carries the mug to the rail cap (elbow low and out, forearm up to the cap) and lets go at L 7 (the mug stays on the cap, bare from L 7); the arm eases away from L 7 and is down by L 16.
 *  - L 4-13 she turns front -> right through the kit's front three-quarter (15 -> 60 deg, one hard swap to the profile at L 13, no dissolve) while
 *    she steps (-0.40 -> -0.20, walk L 4-18); L 18-50 the near arm reaches to the blades (the rig's near arm in the right profile is the character's
 *    right; the sheet says left hand: that arm would be the far one, behind her body), hand on the grass from L 50 to the touch at L 53.
 *  - L 55-63 the shrink (`shrinkScale` about the touch point), L 59-71 puff ring + sparkles peaking on the cut.
 */
export const paintTOUCH = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B01-SH03'], L / 70), t = L / FPS, out: {a?: FigAnchors | null} = {};
  const ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  const step = ramp(2, 12), at: V3 = [-0.4 + 0.2 * step, 0, 0.2 + 0.02 * step];
  const g = camPoint(c, at), u = camUnit(c, at), tp = camPoint(c, TOUCH_W), mp = camPoint(c, MUG_W), mu = camUnit(c, MUG_W);
  if (!g || !tp || !mp) return;
  const sh = (x: number, y: number): Pt => [g[0] + x * u, g[1] - y * u];
  const profile = L >= 13, qDeg = keyed([[4, 15], [8, 38], [12, 60]], L);
  const view = profile ? 'right' : 'front';
  const mw = 0.09 * mu, mh = 0.10 * mu; // mug on the cap: hand point that puts the mug base on the cap
  const capHand: Pt = [mp[0] - 0.24 * mw, mp[1] - 0.36 * mh];
  const hold = L < 7; // the hand sets the mug down at L 7 and is already easing away when the shot shows it bare on the cap (L 8)
  // arms: cradle -> cap (L 2-8), then hang, then reach
  const cradle = { to: sh(-0.01, 1.015), via: sh(MUG_ELBOW[0], MUG_ELBOW[1]) };
  // the cap is AHEAD of her in her final facing (user, 7 Nov 2026): the arm reaches out in the picture plane, roughly horizontal, at full length; the elbow sits below the shoulder-hand line (two bones of BONE_V each) so it reads, never an arm behind the head
  const shoulderS = sh(-0.1, 1.05), BONE_V = 0.17;
  const dx = capHand[0] - shoulderS[0], dy = capHand[1] - shoulderS[1], dl = Math.hypot(dx, dy), drop = Math.sqrt(Math.max(0, (BONE_V * u) ** 2 - (dl / 2) ** 2));
  const heldElbow: Pt = [shoulderS[0] + dx / 2, shoulderS[1] + dy / 2 + drop];
  const carry = ramp(2, 6.5);
  // After the release (L >= 7) the arm is two bones of BONE_H, so its length never dips: the hand swings from the cap down along an arc about the CURRENT shoulder
  // (front-view shoulder until the L13 swap to the profile, the profile shoulder after it, hand kept as an offset from it), the elbow is solved from the hand
  // (chord < 2 bones, bent below / behind the line), then the hand goes on to the touch point the same way (the rig's own reach IK is not used, it changes the bone lengths).
  const BONE_H = 0.2, HANG_LEN = 0.39; // figure metres: two bones of 0.2 m (near the 0.26 rig bone), hand about mid-thigh (0.66 m) at rest
  const shoulderC: Pt = sh(profile ? -0.01 : -0.11, 1.05);
  const ikArm = (hand: Pt, bone: number): Arm => {
    const ex = hand[0] - shoulderC[0], ey = hand[1] - shoulderC[1], d = Math.hypot(ex, ey), h = Math.sqrt(Math.max(0, bone * bone - (Math.min(d, 2 * bone) / 2) ** 2));
    const k = Math.min(1, (2 * bone) / Math.max(d, 1e-6)), to: Pt = [shoulderC[0] + ex * k, shoulderC[1] + ey * k];
    return {to, via: [shoulderC[0] + (to[0] - shoulderC[0]) / 2 - (ey * k / Math.max(d * k, 1e-6)) * h, shoulderC[1] + (to[1] - shoulderC[1]) / 2 + (ex * k / Math.max(d * k, 1e-6)) * h]};
  };
  const capRel: Pt = [capHand[0] - shoulderS[0], capHand[1] - shoulderS[1]], hangRel: Pt = [0.04 * u, HANG_LEN * u];
  const swing = (a: Pt, b: Pt, w: number): Pt => { // polar blend about the origin (shoulder)
    const ra = Math.hypot(a[0], a[1]), rb = Math.hypot(b[0], b[1]), aa = Math.atan2(a[1], a[0]), ab = Math.atan2(b[1], b[0]), r = ra + (rb - ra) * w, ang = aa + (ab - aa) * w;
    return [r * Math.cos(ang), r * Math.sin(ang)];
  };
  const reach = ramp(18, 50);
  let rArm: Arm | undefined;
  if (L < 7) rArm = {...cradle, to: [cradle.to[0] + (capHand[0] - cradle.to[0]) * carry, cradle.to[1] + (capHand[1] - cradle.to[1]) * carry], via: [cradle.via[0] + (heldElbow[0] - cradle.via[0]) * carry, cradle.via[1] + (heldElbow[1] - cradle.via[1]) * carry]};
  else {
    const w = 1 - (1 - Math.min(1, Math.max(0, (L - 7) / 9))) ** 2, r0 = swing(capRel, hangRel, w);
    let hand: Pt = [shoulderC[0] + r0[0], shoulderC[1] + r0[1]];
    hand = [hand[0] + (tp[0] - hand[0]) * reach, hand[1] + (tp[1] - hand[1]) * reach];
    rArm = ikArm(hand, (BONE_V + (BONE_H - BONE_V) * w) * u);
  }
  const walk = L >= 4 && L < 19 ? ((L - 4) / 15) * 0.75 : undefined, stride = walk === undefined ? undefined : 0.7 * (1 - ramp(14, 19));
  const faceId = L < 53 ? 'neutral' : 'surprised';
  const faceState = L < 53 ? {look: [0.7 * ramp(10, 22) + 0.1, -0.2 * ramp(10, 22)] as [number, number]} : {look: [0.6, -0.3] as [number, number]};
  const s = shrinkScale(L);
  // the far (character's left) arm of the turned body: tucked behind the chest during the front -> quarter turn, hand inside the torso silhouette (no hand without its arm)
  const tuck = ramp(3, 9);
  const lArm: Arm | undefined = !profile ? {to: sh(0.13 - 0.06 * tuck, 0.8), via: sh(0.14 - 0.04 * tuck, 0.93)} : undefined;
  const fig: Partial<FigPose> = {rArm, ...(lArm ? {lArm} : {}), collarHide: COLLAR_HIDE * (1 - ramp(8, 14)), ...(walk !== undefined ? {walk, stride} : {}), ...(!profile && L >= 4 ? {quarter: 'right' as const, quarterDeg: qDeg} : {}), ...(profile ? {lean: 0.1 * reach} : {})};
  const lead: Item = {at, draw: (q, cc) => {
    if (s < 0.01) return;
    MEASURE.TOUCH = paintTiny(q, cc, {at, view, pose: 'P01', face: faceId, faceState, t, fig, scale: s < 1 ? {about: tp, s} : undefined, shadowFade: s < 1 ? 1 - ramp(55, 59) : undefined,
      held: hold ? (qq, a, uu) => { paintMug(qq, a.rHand, uu, {handle: 1, from: -1, skin: TINY.head.skin}); } : undefined});
  }};
  const mug: Item = {at: MUG_W, bias: -0.05, draw: (q, cc) => {
    if (hold) return;
    const m = camPoint(cc, MUG_W), k = camUnit(cc, MUG_W);
    if (m) paintMug(q, [m[0] - 0.24 * 0.09 * k, m[1] - 0.36 * 0.10 * k], k, {handle: 1, from: -1, skin: TINY.head.skin, bare: true});
  }};
  paintBalcony(p, c, {t, cast: [lead, mug]});
  paintShrinkPop(p, tp, L, 150);
  MEASURE.TOUCH_POP = {head: tp, headTop: tp[1], chin: tp[1], feet: tp, rHand: tp, lHand: tp, rShoulder: tp, lShoulder: tp, rUpper: tp, lUpper: tp, top: tp[1], bottom: tp[1]};
};

/**
 * G19: S01-B01-SH04 stand-in (macro planter looking up, LF02 / SD04; V01 voiced L 10-23). Shot-local L (0-31): the pop's puff fades round her L 0-10 (world point
 * fixed to the frame-0 camera); she sits (P33) L 0-8, sit -> squat L 8-11, stands L 11-16 (hands P33 -> P12 at the mouth), the head tilts back and the eyes go up
 * L 10-14. Crane eye 0.6 -> 1.05, pitch 0 -> 8.75 (ease L 6-31). Foreground tips are rooted at the frame-0 camera (`tipsAt`).
 */
export const paintSTAND = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B01-SH04'], L / 31), c0 = camOf(MACRO_CAMS['S01-B01-SH04'], 0), t = L / FPS + 40, at: V3 = [0, 0, 0];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  const ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  const hip0 = legScale(TINY) * 0.672 + 0.038, aStar = easeInv((0.282 * (TINY.height / 1.7)) / (hip0 - 0.075));
  const bb = ramp(8, 11), seated = L < 11, crouch = seated ? 0.6 * bb : 0.6 * (1 - ramp(11, 16));
  const body: Partial<FigPose> = {crouch, ...(seated ? {floorSit: 1 - (1 - aStar) * bb} : {})};
  const a = poseFor('P33', TINY, g, u, 'front'), b = poseFor('P12', TINY, g, u, 'front');
  const arms = blendFig(a, b, ramp(8, 16));
  const up = ramp(10, 14), look: [number, number] = [0.15 * up, -0.9 * up];
  const lead: Item = {at, draw: (q, cc) => {
    MEASURE.STAND = paintTiny(q, cc, {at, view: 'front', pose: seated ? 'P33' : 'P12', face: L < 10 ? 'surprised' : 'shock', faceState: {look}, headCock: -3 * up, t, fig: {...body, rArm: arms.rArm, lArm: arms.lArm}});
  }};
  paintPlanter(p, c, {t, items: [lead], fore: [sweep([-1.0, 0, 1.75], [0.5, -1], 4, 26, 9911, 0.8, 22, '#2f4a22'), sweep([1.05, 0, 1.6], [-0.4, -1], 6, 20, 9912, 0.9, 24, '#2f4a22')], tipsAt: c0});
  const g0 = camPoint(c0, at), u0 = camUnit(c0, at);
  if (g0) {
    // the puff centre: the world point that projects to (540, 762) in the frame-0 camera (sheet: SH03 pop (554, 732) -> SH04 L0 (540, 762))
    const wy = (g0[1] - 762) / u0, pc = camPoint(c, [0, wy, 0]), pu = camUnit(c, at);
    if (pc) paintShrinkPop(p, [pc[0] + (540 - g0[0]) * 0 , pc[1]], 71, 150 * (pu / u0), 11000, 1 - ramp(0, 10));
  }
};

// ======================================================================================================================================
// R1.10 (SHEETS-R1.10 FR29-FR39): the plates that were placeholder cards. Each is one pure paint function of the shot-local frame, camera
// `camOf(MACRO_CAMS[id], L / (len - 1))`; arms are two bones of `BONE_H` x u (`twoBoneArm`), never the rig's reach IK; walks run by distance (FR29f).
// ======================================================================================================================================
import {glow} from './macro';
import {ARM_DIR, DEPTH, dropGeometry, HAND_LEN, MAX_NECK, type DropState} from './drop';
import {BONE_H, shoulderOf, twoBoneArm} from './poses';
import {dropShape, DROP_C} from './macro';
import {MOTIONS} from '../kit/motions';
import type {AnyPoseId} from '../kit/poses';
import type {TinyOpts} from './cast';
import {camPoint as camPt} from '../kit/ycam';

/** Sm per walk cycle: the kit's `WALK_STEP` 1.1 m x 1.58 / 1.7 (the walk phase of a distance d is d / WSTEP, negative for a backward step). */
const WSTEP = (1.1 * 1.58) / 1.7;
const REACH = 0.98;
/** Stride envelope of a walk window [a, b]: 0 -> 1 over the first 4 f, 1 -> 0 over the last 6 f (FR29f). */
const stepEnv = (L: number, a: number, b: number) => (L <= a || L >= b ? 0 : smooth01((L - a) / 4) * (1 - smooth01((L - (b - 6)) / 6)));
const bump = (L: number, a: number, pk: number, b: number) => (L <= a || L >= b ? 0 : L < pk ? smooth01((L - a) / (pk - a)) : 1 - smooth01((L - pk) / (b - pk)));

/** Body of a profile figure standing at world (x, 0, z): the fields the shoulder depends on, so a shot places arm targets before drawing. */
type Stance = {x: number; z: number; lean?: number; crouch?: number; walk?: number; stride?: number; rise?: number; floorSit?: number};
const shAt = (c: YCam, base: AnyPoseId, s: Stance, side: 'r' | 'l' = 'r', named?: Partial<FigPose>): {sh: Pt; g: Pt; u: number} | null => {
  const at: V3 = [s.x, 0, s.z], g = camPt(c, at), u = camUnit(c, at);
  if (!g) return null;
  const {x: _x, z: _z, ...fig} = s;
  return {sh: shoulderOf(TINY, g, u, 'right', base, {...(named ?? {}), ...fig}, side), g, u};
};
const dist2 = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
/** Feet x (sm) at which the shoulder is `REACH` x 2 bones from `hand` (px): bisection, the shoulder left of the hand. */
const solveX = (c: YCam, base: AnyPoseId, mk: (x: number) => Stance, hand: Pt, lo = 0.2, hi = 1.9, ratio = REACH): number => {
  const f = (x: number) => { const s = shAt(c, base, mk(x)); return s ? dist2(s.sh, hand) / (2 * BONE_H * s.u) - ratio : 9; };
  let a = lo, b = hi;
  for (let i = 0; i < 28; i++) { const m = (a + b) / 2; if (f(m) > 0) a = m; else b = m; }
  return (a + b) / 2;
};

/** Where the fully-in wrist of D1 sits (sm, drop frame): the entry point P on the surface. */
const P0 = dropGeometry({push: HAND_LEN + DEPTH, neck: DEPTH}).wrist!;
/**
 * The `neck` field that puts D1's hand (the mitten centre, `HAND_LEN` x 0.55 beyond the wrist) exactly `chordPx` from her shoulder `sh` (px): the linear
 * inverse of `wristOffset` along `ARM_DIR` (FR31 cause -> effect), clamped to `MAX_NECK` (visible neck) and 0.
 */
const deriveNeck = (sh: Pt, g: Pt, u: number, chordPx: number, clamp = true): number => {
  const S: Pt = [(sh[0] - g[0]) / u, -(sh[1] - g[1]) / u], D: Pt = [P0[0] - S[0], P0[1] - S[1]], aD = ARM_DIR[0] * D[0] + ARM_DIR[1] * D[1];
  const perp2 = D[0] * D[0] + D[1] * D[1] - aD * aD, ch = chordPx / u, w = -aD - Math.sqrt(Math.max(0, ch * ch - perp2));
  const n = w + HAND_LEN * 0.55 + DEPTH;
  return clamp ? Math.min(MAX_NECK + DEPTH, Math.max(0, n)) : n;
};
const IN = HAND_LEN + DEPTH;
const dropLayers = (g: Pt, u: number, st: DropState, t: number): Item[] => [
  bladeItem(B_DEW, t, undefined, 0.5),
  {at: D1_CONTACT, bias: 0.6, draw: (q) => paintDropState(q, g, u, st, {layer: 'back', t})},
  {at: D1_CONTACT, bias: -0.6, draw: (q) => paintDropState(q, g, u, st, {layer: 'front', t})},
];
/** Polar blend of a point about the origin (shoulder): keeps the arm length while it swings (as `paintTOUCH`). */
const swingTo = (a: Pt, b: Pt, w: number): Pt => {
  const ra = Math.hypot(a[0], a[1]), rb = Math.hypot(b[0], b[1]), aa = Math.atan2(a[1], a[0]), ab = Math.atan2(b[1], b[0]), r = ra + (rb - ra) * w, ang = aa + (ab - aa) * w;
  return [r * Math.cos(ang), r * Math.sin(ang)];
};
const hipA = () => { const hip0 = legScale(TINY) * 0.672 + 0.038; return easeInv((0.282 * (TINY.height / 1.7)) / (hip0 - 0.075)); };

/**
 * FR30 S01-B03-SH01 (77 f), the dew drop (LF03): she walks in from the left (L 4-44, off frame until L ~12), plants, the near arm reaches to 0.3 sm short of the drop
 * (L 50-62, two bones; she leans toward it up to +0.10 rad if the arm does not reach), holds with an idle breath. Glint on the drop's upper-left rim L 34-40.
 */
export const paintDEW1 = (p: Painter, frame: number) => {
  const L = frame, len = 77, c = camOf(MACRO_CAMS['S01-B03-SH01'], L / (len - 1)), t = L / FPS + 70;
  const mv = smooth01((L - 4) / 40), x = 0.95 * mv, z = -0.55 * mv, dist = Math.hypot(0.95, 0.55) * mv;
  const stride = L < 4 || L >= 44 ? 0 : smooth01((L - 4) / 4) * (1 - smooth01((L - 38) / 6)), walk = dist / WSTEP;
  const reach = smooth01((L - 50) / 12), br = L >= 62 ? MOTIONS['idle-breathe']((L - 62) / 30, {view: 'right', k: 1, seed: 1}).body ?? {} : {};
  const base: Stance = {x, z, walk, stride, rise: br.rise ?? 0};
  const g = camPt(c, [x, 0, z]), u = camUnit(c, [x, 0, z]), tp = camPt(c, [1.65, 1.42, -1.0]), ud = camUnit(c, D1_CONTACT), gd = camPt(c, D1_CONTACT);
  if (!g || !tp || !gd) return;
  const target: Pt = [tp[0] - 0.3 * ud, tp[1]];
  let need = 0;
  for (let k = 0; k <= 10; k++) { const s = shAt(c, 'P01', {...base, lean: 0.01 * k}); need = 0.01 * k; if (s && dist2(s.sh, target) <= REACH * 2 * BONE_H * s.u) break; }
  const lean = need * reach + (br.lean ?? 0), stc: Stance = {...base, lean}, sh = shAt(c, 'P01', stc)!;
  const hang: Pt = [0.04 * u, 0.39 * u], tr: Pt = [target[0] - sh.sh[0], target[1] - sh.sh[1]], hr = swingTo(hang, tr, reach);
  const rArm = L >= 44 ? twoBoneArm(sh.sh, [sh.sh[0] + hr[0], sh.sh[1] + hr[1]], BONE_H * u, 'down') : undefined;
  const lead: Item = {at: [x, 0, z], draw: (q, cc) => {
    MEASURE.DEW1 = paintTiny(q, cc, {at: [x, 0, z], view: 'right', pose: 'P01', face: 'surprised', faceState: {mouth: 'smile', look: [0.6, -0.3]}, t,
      fig: {walk: L >= 4 ? walk : undefined, stride, lean, rise: br.rise, nod: br.nod, ...(rArm ? {rArm} : {})}});
  }};
  paintGarden(p, c, {t, mode: 'sun', sun: [150, 300], shadeEdge: -0.5, items: [lead], fore: [sweep([0.2, 0, 1.35], [0.6, -1], 10, 40, 9921, 0.9, 20)]});
  const k = bump(L, 34, 36, 40);
  if (k > 0) {
    // one warm glint on D1's upper-left rim
    const D = dropShape(72), ref = (q: Pt) => (q[0] - 0) * -0.7 + (q[1] - DROP_C) * 0.7;
    const rim = D.reduce((b, q) => (ref(q) > ref(b) ? q : b), D[0]);
    glow(p, gd[0] + rim[0] * ud, gd[1] - rim[1] * ud, 0.08 * ud, '#fff8e0', k, 9930);
  }
};

// ---- B03-SH02 (FR31) ------------------------------------------------------------------------------------------------------------------
const SH02 = 86;
/** Entry reach ratio (hand distance / 2 bones) of SH02 L 0-16: the fully-in wrist is 0.37 sm above her shoulder, so a straight 0.98 arm would stand vertical in front of her face; she stands back so the hand stops on the line 0.06 sm short (35 deg from vertical) and the arm clears the face (R1.10 ruling not met as written, see build notes). */
const RA = 1.25;
const cam02 = (L: number) => camOf(MACRO_CAMS['S01-B03-SH02'], L / (SH02 - 1));
type S2 = {x0: number; xA: number; s: number};
const stance02 = (L: number, S: S2, x?: number): Stance => {
  const a1 = smooth01((L - 18) / 12), a2 = smooth01((L - 40) / 14), xx = x ?? S.xA - S.s * (a1 + a2);
  const osc = L > 60 ? 0.045 * smooth01((L - 60) / 6) * Math.sin((2 * Math.PI * (L - 60)) / 40) : 0;
  const lunge = L < 10 ? 1 - smooth01((L - 5) / 5) : 0;
  return {x: xx, z: -0.75 + (0.01 * (a1 + a2)) / 2, lean: -0.21 * smooth01((L - 16) / 14) + osc, walk: (xx - S.x0) / WSTEP, stride: lunge + stepEnv(L, 18, 30) + stepEnv(L, 40, 54)};
};
const handAt = (c: YCam, st: DropState): Pt => dropHand(camPt(c, D1_CONTACT)!, camUnit(c, D1_CONTACT), {...st, push: Math.max(st.push, -0.29)}).hand!; // push -0.3 has no wrist (hand not yet at the drop): the arm still points at it
let s02: S2 | undefined;
/** Feet derived from the full-length arm (FR31, D6): x0 (L 0, hand 0.3 sm short) and xA (L 10, hand fully in) put the shoulder at 0.98 x 2 bones; `s` is the backward step that lets the neck reach 0.50 sm at L 54. */
const solve02 = (): S2 => {
  if (s02) return s02;
  const mk = (x: number): Stance => ({x, z: -0.75});
  const x0 = solveX(cam02(0), 'P16', mk, handAt(cam02(0), dropStateFor('S01-B03-SH02', 0)!), 0.2, 1.9, RA), xA = solveX(cam02(10), 'P16', mk, handAt(cam02(10), dropStateFor('S01-B03-SH02', 10)!), 0.2, 1.9, RA);
  const vis = (s: number) => {
    const S: S2 = {x0, xA, s}, c = cam02(54), sh = shAt(c, 'P16', stance02(54, S))!;
    return deriveNeck(sh.sh, camPt(c, D1_CONTACT)!, camUnit(c, D1_CONTACT), REACH * 2 * BONE_H * sh.u) - DEPTH;
  };
  let a = 0, b = 0.4;
  for (let i = 0; i < 24; i++) { const m = (a + b) / 2; if (vis(m) < 0.5) a = m; else b = m; }
  return (s02 = {x0, xA, s: (a + b) / 2});
};
/** FR31 S01-B03-SH02 (86 f), stuck: the hand goes in L 0-10 (she lunges in, no foot slide), then she leans away and steps back twice (L 18-30, 40-54) and the drop's neck is whatever her straight arm leaves. */
export const paintDROP2 = (p: Painter, frame: number) => {
  const L = frame, c = cam02(L), t = L / FPS, S = solve02(), gd = camPt(c, D1_CONTACT), ud = camUnit(c, D1_CONTACT);
  if (!gd) return;
  let st = dropStateFor('S01-B03-SH02', L)!;
  const x = L < 10 ? solveX(c, 'P16', (xx) => ({x: xx, z: -0.75}), handAt(c, st), 0.2, 1.9, RA) : undefined, stc = stance02(L, S, x), sh = shAt(c, 'P16', stc)!;
  if (L >= 10) st = {push: IN, neck: deriveNeck(sh.sh, gd, ud, REACH * 2 * BONE_H * sh.u), collar: 0};
  const rArm = twoBoneArm(sh.sh, handAt(c, st), BONE_H * sh.u, 'down'), at: V3 = [stc.x, 0, stc.z];
  const items: Item[] = [...dropLayers(gd, ud, st, t), {at, draw: (q, cc) => { MEASURE.DROP2 = paintTiny(q, cc, {at, view: 'right', pose: 'P16', face: L < 16 ? 'disgusted' : 'angry', t, fig: {lean: stc.lean, walk: stc.walk, stride: stc.stride, rArm}}); }}];
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, items});
};

// ---- B03-SH03 (FR32) ------------------------------------------------------------------------------------------------------------------
const SH03 = 119;
const cam03 = (L: number) => camOf(MACRO_CAMS['S01-B03-SH03'], L / (SH03 - 1));
const tug = (L: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, (L - 18) / 6))) * (L < 30 ? 1 : 0) + Math.sin(Math.PI * Math.min(1, Math.max(0, (L - 48) / 6))) * (L > 40 ? 1 : 0);
const stance03 = (L: number, x: number): Stance => ({x, z: -0.74, lean: -0.21 - 0.05 * tug(L), walk: 0.25, stride: 0.5});
let s03: number | undefined;
const solve03 = (): number => {
  if (s03 !== undefined) return s03;
  const Ls = [0, 20, 23, 40, 53, 56, 70, 90, 118];
  const worst = (x: number) => Math.max(...Ls.map((L) => { const c = cam03(L), s = shAt(c, 'P16', stance03(L, x))!; return dist2(s.sh, handAt(c, dropStateFor('S01-B03-SH03', L)!)) / (2 * BONE_H * s.u); }));
  let a = 0.2, b = 1.9;
  for (let i = 0; i < 26; i++) { const m = (a + b) / 2; if (worst(m) > REACH) a = m; else b = m; }
  return (s03 = (a + b) / 2);
};
/** FR32 S01-B03-SH03 (119 f), the wrist close: she is drawn whole (the camera `cx -160` leaves only the arm in frame), brace stance, the tugs lean her first and the wrist follows. */
export const paintDROP3 = (p: Painter, frame: number) => {
  const L = frame, c = cam03(L), t = L / FPS, gd = camPt(c, D1_CONTACT), ud = camUnit(c, D1_CONTACT);
  if (!gd) return;
  const st = dropStateFor('S01-B03-SH03', L)!, stc = stance03(L, solve03()), sh = shAt(c, 'P16', stc)!, at: V3 = [stc.x, 0, stc.z];
  const rArm = twoBoneArm(sh.sh, handAt(c, st), BONE_H * sh.u, 'down');
  const items: Item[] = [...dropLayers(gd, ud, st, t), {at, draw: (q, cc) => { MEASURE.DROP3 = paintTiny(q, cc, {at, view: 'right', pose: 'P16', face: 'angry', t, fig: {lean: stc.lean, walk: stc.walk, stride: stc.stride, rArm}}); }}];
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, items});
};

// ---- B03-SH04 (FR33) ------------------------------------------------------------------------------------------------------------------
const SH04 = 132;
const cam04 = (L: number) => camOf(MACRO_CAMS['S01-B03-SH04'], L / (SH04 - 1));
/** Heave 0..1: one bump per grunt, L 56-73 (peak 64) and L 83-104 (peak 93); 0 elsewhere (FR33, D7). */
export const heaveAt = (L: number) => Math.max(bump(L, 56, 64, 73), bump(L, 83, 93, 104));
const braceSh = (c: YCam, L: number, x: number, z: number, h: number) => {
  const at: V3 = [x, 0, z], g = camPt(c, at), u = camUnit(c, at);
  if (!g) return null;
  const np = namedPose('brace-heave', L, TINY, g, u, 'right', {}, h);
  return {sh: shoulderOf(TINY, g, u, 'right', 'P16', np), g, u};
};
let x04: number | undefined;
/** Feet x0 of the heave (fixed to L 108): the neck reaches MAX_NECK at the heave peak (L 64), the arm at 0.98 x 2 bones all along. */
const solve04 = (): number => {
  if (x04 !== undefined) return x04;
  const c = cam04(64);
  const vis = (x: number) => { const s = braceSh(c, 64, x, -0.72, heaveAt(64))!; return deriveNeck(s.sh, camPt(c, D1_CONTACT)!, camUnit(c, D1_CONTACT), REACH * 2 * BONE_H * s.u, false) - DEPTH; };
  let a = 0.2, b = 1.9;
  for (let i = 0; i < 26; i++) { const m = (a + b) / 2; if (vis(m) > MAX_NECK) a = m; else b = m; } // vis falls as x grows
  return (x04 = (a + b) / 2);
};
/**
 * FR33 S01-B03-SH04 (132 f), heave, snap, tumble into the shade. L 0-108 `brace-heave` on fixed feet, the neck follows her shoulder (cap `MAX_NECK` at the peaks);
 * snap L 108; backpedal tumble L 108-128 (walk by distance, P39-style flung arms, crouch -> floor sit), seated L 128-131, profile throughout.
 */
export const paintDROP4 = (p: Painter, frame: number) => {
  const L = frame, c = cam04(L), t = L / FPS, gd = camPt(c, D1_CONTACT), ud = camUnit(c, D1_CONTACT), x0 = solve04();
  if (!gd) return;
  const items: Item[] = [];
  let st = dropStateFor('S01-B03-SH04', L)!;
  if (L < 108) {
    const h = heaveAt(L), s = braceSh(c, L, x0, -0.72, h)!;
    st = {push: IN, neck: deriveNeck(s.sh, gd, ud, REACH * 2 * BONE_H * s.u), collar: 0.03};
    const hand = dropHand(gd, ud, st).hand!, bc = braceClamp(L, TINY, s.g, s.u, hand, {heave: h}), at: V3 = [x0, 0, -0.72];
    items.push(...dropLayers(gd, ud, st, t), {at, draw: (q, cc) => {
      MEASURE.DROP4 = paintTiny(q, cc, {at, view: 'right', named: {name: 'brace-heave', L, heave: h}, face: 'angry', t, fig: {rArm: bc.rArm, lArm: bc.lArm}, held: (qq, _a, uu) => paintClamp(qq, bc.clamp, uu, TINY.head.skin)});
    }});
  } else {
    const sPre = braceSh(cam04(107), 107, x0, -0.72, 0)!, c107 = cam04(107);
    st = {...st, neck: deriveNeck(sPre.sh, camPt(c107, D1_CONTACT)!, camUnit(c107, D1_CONTACT), REACH * 2 * BONE_H * sPre.u), push: IN, collar: 0.03};
    const x = keyed([[108, x0], [112, x0 - 0.2], [116, 0.1], [120, -0.5], [124, -0.95], [128, -1.2], [140, -1.2]], L), z = keyed([[108, -0.72], [128, -0.4], [140, -0.4]], L);
    const lean = -0.35 * (1 - smooth01((L - 118) / 6)), bb = 1 - smooth01((L - 122) / 6), aStar = hipA();
    const crouch = L < 118 ? 0.15 * (1 - smooth01((L - 108) / 4)) : L < 122 ? 0.6 * smooth01((L - 118) / 4) : 0.6 * bb;
    const settle = L >= 128 ? -0.02 * Math.sin((Math.PI * Math.min(3, L - 128)) / 3) : 0;
    const stride = L < 112 ? 0.5 + 0.5 * smooth01((L - 108) / 4) : 1 - smooth01((L - 120) / 4);
    const stc: Stance = {x, z, lean, crouch, walk: 0.25 + (x - x0) / WSTEP, stride, rise: settle, ...(L >= 122 ? {floorSit: 1 - (1 - aStar) * bb} : {})};
    const s = shAt(c, 'P16', stc)!, ls = shAt(c, 'P16', stc, 'l')!, B = BONE_H * s.u;
    const fr = smooth01((L - 108) / 6), settleArms = smooth01((L - 118) / 10);
    const handUp = (sd: Pt, ang: number, len: number): Pt => [sd[0] + Math.cos((ang * Math.PI) / 180) * len * B, sd[1] - Math.sin((ang * Math.PI) / 180) * len * B];
    const hold = (sd: Pt, bend: 'down' | 'out', hand: Pt, hang: Pt): Arm => twoBoneArm(sd, [hand[0] + (hang[0] - hand[0]) * settleArms, hand[1] + (hang[1] - hand[1]) * settleArms], B, bend);
    const rHeld = twoBoneArm(s.sh, dropHand(gd, ud, st).hand ?? s.sh, B, 'down').to;
    const rHand0: Pt = [rHeld[0] + (handUp(s.sh, 40, 1.9)[0] - rHeld[0]) * fr, rHeld[1] + (handUp(s.sh, 40, 1.9)[1] - rHeld[1]) * fr];
    const lHand0: Pt = [ls.sh[0] + (handUp(ls.sh, 25, 1.8)[0] - ls.sh[0]) * fr, ls.sh[1] + (handUp(ls.sh, 25, 1.8)[1] - ls.sh[1]) * fr];
    const hangPt = (sd: Pt, dx: number): Pt => [sd[0] + dx * B, sd[1] + 1.8 * B];
    const rArm = hold(s.sh, 'down', rHand0, hangPt(s.sh, 0.3)), lArm = hold(ls.sh, 'down', lHand0, hangPt(ls.sh, 0.2)), at: V3 = [x, 0, z];
    const sh2 = edgeShade(x, -0.5);
    items.push(...dropLayers(gd, ud, st, t), {at, draw: (q, cc) => {
      MEASURE.DROP4 = paintTiny(q, cc, {at, view: 'right', pose: 'P16', face: 'shock', t, tint: sh2 > 0.01 ? {to: '#4f6fb8', u: 0.27 * sh2, mul: [0.95, 0.93, 0.97]} : undefined,
        fig: {wet: true, lean, crouch, walk: stc.walk, stride, rise: settle, ...(stc.floorSit !== undefined ? {floorSit: stc.floorSit} : {}), rArm, lArm}});
    }});
  }
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, items});
};


// ---- B04 (FR34-FR36) ------------------------------------------------------------------------------------------------------------------
/** FR29g: `MOTIONS.shiver` body fields at `t` s, scaled by `k` (0.5 = half amplitude), as a `FigPose` fragment. */
const shiverFig = (t: number, k: number): Partial<FigPose> => {
  const b = MOTIONS.shiver(t, {view: 'front', k: 1, seed: 1}).body ?? {};
  return {crouch: (b.crouch ?? 0) * k, lean: (b.lean ?? 0) * k, rise: (b.rise ?? 0) * k, nod: [(b.nod?.[0] ?? 0) * k, (b.nod?.[1] ?? 0) * k]};
};
/** R1.11: the shot's start, middle and end cameras for `paintGarden`'s `tipsAt`: the foreground tips are rooted in the world (on the soil) and the camera moves past them, instead of being re-rooted in front of every frame's camera (screen-fixed). */
const tipCams = (id: string): YCam[] => [0, 0.5, 1].map((u) => camOf(MACRO_CAMS[id], u));
const COLD_AT: V3 = [-1.4, 0, -0.6];
const foreShade = [sweep([-2.9, 0, 0.45], [0.8, -1], 12, 46, 9931, 0.8, 18, '#26383c')];
/** FR34 S01-B04-SH01 (77 f), cold shade: the LF04 v5 shade build without the ant and puffs, TINY hugging herself (P42), shivering at half amplitude from L 40. */
export const paintCOLD = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B04-SH01'], L / 76), t = L / FPS + 20;
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [900, 330], shadeEdge: -0.5, shadeGround: 'full', tipsAt: tipCams('S01-B04-SH01'), gap: {x: -0.4, w: 1.2}, fore: foreShade,
    after: (q, cc) => {
      shadeSet(q, cc, t, true);
      MEASURE.COLD = coldTiny(q, cc, t, {view: 'front', pose: 'P42', face: L < 40 ? 'worried' : 'sad', headCock: -4, fig: L >= 40 ? shiverFig((L - 40) / 30, 0.5) : undefined});
    }});
};

/** FR35 S01-B04-SH02 (140 f), warmth puffs: the LF04 build, CL02 crossing the gap behind her (L ~40-96), a breeze over the blades L 40-62, `clutch-puff` L 96-116, back to P42 + shiver. */
export const paintPUFF = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B04-SH02'], L / 139), t = L / FPS + 20, at = COLD_AT;
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  const clutch = L >= 96 && L < 116, back = L >= 116, w = smooth01((L - 116) / 6);
  let fig: Partial<FigPose> | undefined;
  if (back) {
    const m = blendFig(namedPose('clutch-puff', 20, TINY, g, u, 'front'), poseFor('P42', TINY, g, u, 'front'), w);
    fig = {rArm: m.rArm, lArm: m.lArm, ...shiverFig((L - 116) / 30, 0.5)};
  }
  const aw = antWalk(0.0429 * L), amt = 0.15 * (smooth01((L - 40) / 6) - smooth01((L - 56) / 6)), out: {a?: FigAnchors | null} = {};
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [900, 330], shadeEdge: -0.5, shadeGround: 'full', tipsAt: tipCams('S01-B04-SH02'), gap: {x: -0.4, w: 1.2}, fore: foreShade, gust: amt > 0.001 ? {dir: [-1, 0], amt} : undefined,
    items: [antItem([2.5 - 0.0429 * L, 0, -13.0], {view: 'left', walk: aw.walk, sway: aw.sway, tint: {to: '#6f8aa0', u: 0.4}, noInk: true, t})],
    after: (q, cc) => {
      shadeSet(q, cc, t, true);
      out.a = MEASURE.PUFF = coldTiny(q, cc, t, {view: 'front', ...(clutch ? {named: {name: 'clutch-puff' as const, L: L - 96}} : {pose: 'P42' as const}), face: L < 116 ? 'worried' : 'sad', headCock: -4, fig});
    }});
  if (out.a) warmthPuffsAt(L, out.a, u).forEach((q) => { if (q.a > 0.02) paintPuff(p, q.x, q.y, q.r, q.seed, t, q.a); });
};

/**
 * FR36 S01-B04-SH03 (115 f), the crumb: nibble L 0-35, bite L 22, drag L 36-80 (`crumbFollowHand`, camera truck L 30-84), then she lets go, stands (L 80-84, hands come down),
 * one hard swap profile -> kit quarter at L 84 (60 deg, turning to the lens by L 92, the LIFTOFF pattern), sits L 92-100 (crouch -> `floorSit`), sigh L 101-111.
 * C1 stays where the drag left it (-2.4, 0, -0.6). Shade tint and wet throughout.
 */
export const paintCRUMB = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B04-SH03'], L / 114), t = L / FPS + 40;
  const ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  const dragAt = (l: number): {tiny: V3; crumb: V3} => {
    const d = Math.min(1, Math.max(0, (l - 36) / 44)), at = (a: V3, b: V3): V3 => [a[0] + (b[0] - a[0]) * d, 0, a[2] + (b[2] - a[2]) * d];
    let crumb = at([-3.6, 0, -1.0], [-2.4, 0, -0.6]);
    const tiny = at([-2.85, 0, -0.95], [-1.7, 0, -0.6]);
    if (l >= 36) { // parented: the crumb's +x grip follows her hands (named pose arm targets) during the drag
      const cl = camOf(MACRO_CAMS['S01-B04-SH03'], l / 114), g = camPoint(cl, tiny), u = camUnit(cl, tiny), pz = g && namedPose('drag-back', l - 36, TINY, g, u, 'left');
      if (pz?.rArm && pz.lArm) crumb = crumbFollowHand(cl, crumb, [(pz.rArm.to[0] + pz.lArm.to[0]) / 2, 0]);
    }
    return {tiny, crumb};
  };
  const {tiny: tinyD, crumb} = dragAt(Math.min(L, 80));
  const feetX = L < 84 ? tinyD[0] : -1.7 - 0.05 * ramp(84, 92), at: V3 = [feetX, 0, tinyD[2]];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  const edge = -0.5, shade = edgeShade(feetX, edge), face = L < 80 ? 'worried' : 'tired';
  let opts: TinyOpts;
  const sh = L < 6 ? shiverFig(0.3 + L / 30, 0.5 * (1 - L / 6)) : {};
  if (L < 84) {
    const w = ramp(80, 84), nm = L < 36 ? namedPose('nibble', L, TINY, g, u, 'left', sh as never) : namedPose('drag-back', L - 36, TINY, g, u, 'left');
    const calm = poseFor('P01', TINY, g, u, 'left'), m = w > 0 ? blendFig(nm, calm, w) : nm;
    opts = {at, view: 'left', named: L < 36 ? {name: 'nibble', L} : w >= 1 ? undefined : {name: 'drag-back', L: L - 36}, pose: w >= 1 ? 'P01' : undefined, face, t, fig: w > 0 ? {squat: m.squat, lean: m.lean, rise: m.rise, rArm: m.rArm, lArm: m.lArm} : (L < 6 ? sh : undefined)};
  } else {
    // front view from L 84: quarter 60 -> 15 deg to L 92, then the exact front; arms down along the body; sit L 92-100; sigh L 101-111
    const seatB = 1 - ramp(95, 100), aStar = hipA(), crouch = L < 95 ? 0.6 * ramp(92, 95) : 0.6 * seatB;
    const sg = bump(L, 101, 106, 111), body: Partial<FigPose> = {crouch, rise: -0.01 * sg, nod: [0, 0.04 * sg], ...(L >= 95 ? {floorSit: 1 - (1 - aStar) * seatB} : {})};
    const calm = poseFor('P01', TINY, g, u, 'front'), sit = namedPose('sit-up-check', 35, TINY, g, u, 'front', body), arms = blendFig(calm, sit, ramp(92, 100));
    const qDeg = keyed([[84, 60], [86, 50], [88, 40], [90, 28], [92, 15]], L);
    opts = {at, view: 'front', pose: 'P01', face, t, fig: {...body, rArm: arms.rArm, lArm: arms.lArm, walk: L < 92 ? ramp(84, 92) * 0.05 / WSTEP : 0.05 / WSTEP, stride: L < 92 ? 0.5 * (1 - ramp(88, 92)) : 0, ...(L < 92 ? {quarter: 'left' as const, quarterDeg: qDeg} : {})}};
  }
  const lead: Item = {at, draw: (q, cc) => {
    MEASURE.CRUMB = paintTiny(q, cc, {...opts, fig: {wet: true, ...(opts.fig ?? {})}, tint: {to: '#4f6fb8', u: 0.27 * shade, mul: [0.95, 0.93, 0.97]}});
  }};
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, shadeGround: 'clip', tipsAt: tipCams('S01-B04-SH03'), items: [
    {at: crumb, bias: 0.1, draw: (q, cc) => paintCrumb(q, cc, crumb, {bites: L >= 22 ? 1 : 0})}, lead]});
};

// ---- B05 (FR37-FR39) ------------------------------------------------------------------------------------------------------------------
const CRUMB_REST: V3 = [-2.4, 0, -0.6];
/** The ant of S01-B05-SH01 / SH02: x(L) = -4.2 + 0.07 L to L 71, a quadratic ease-out to the stop at x 1.20 at L 83 (SH02 cuts in on the same spot). */
const passAntX = (L: number) => (L <= 71 ? -4.2 + 0.07 * L : L < 83 ? (-4.2 + 0.07 * 71) + (1.2 - (-4.2 + 0.07 * 71)) * (1 - (1 - (L - 71) / 12) ** 2) : 1.2);
/** FR37 S01-B05-SH01 (89 f), silence, the ant passes: she sits in the shade, tired, then startled; the ant walks in behind her, her eyes lead and the head swaps to the right profile at L 42. */
export const paintPASS = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B05-SH01'], L / 88), edge = shadeEdgeAt('S01-B05-SH01', L), t = L / FPS + 50, at: V3 = [-1.75, 0, -0.6];
  const ax = passAntX(L), moving = L < 83, aw = antWalk(ax - (-4.2)), th = L >= 25 ? MOTIONS['turn-head-right']((L - 25) / 30, {view: 'front', k: 1, seed: 1}) : null;
  const antSh = edgeShade(ax, edge);
  const lead: Item = {at, draw: (q, cc) => {
    MEASURE.PASS = paintTiny(q, cc, {at, view: 'front', pose: 'P33', named: {name: 'sit-up-check', L: 35}, face: L < 30 ? 'tired' : 'surprised', t,
      faceState: th?.look ? {look: th.look as Pt} : undefined,
      fig: {wet: true, ...(th?.body?.head ? {head: th.body.head} : {}), ...(th?.body?.nod ? {nod: th.body.nod} : {})},
      tint: {to: '#4f6fb8', u: 0.27 * edgeShade(at[0], edge), mul: [0.95, 0.93, 0.97]}});
  }};
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [900, 330], shadeEdge: edge, tipsAt: tipCams('S01-B05-SH01'), items: [
    antItem([ax, 0, -2.0], {view: 'right', walk: moving ? aw.walk : undefined, sway: moving ? aw.sway : 1.5 * Math.sin(1.3 * t), tint: {to: '#6f8aa0', u: 0.4 * antSh}, t}),
    {at: CRUMB_REST, bias: 0.1, draw: (q, cc) => paintCrumb(q, cc, CRUMB_REST, {bites: 1})}, lead]});
};

/** FR38 S01-B05-SH02 (173 f), two bars: the stopped ant (1.2, 0, -2.0), a 15% dim as the card wipes in, then the scale-bars card (labels are timeline items). */
export const paintBARS = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B05-SH02'], L / 172), t = L / FPS + 80, s = barsAt(L);
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [900, 330], shadeEdge: -1.2, tipsAt: tipCams('S01-B05-SH02'), items: [antItem([1.2, 0, -2.0], {view: 'right', sway: 1.5 * Math.sin(1.3 * t), t})]});
  if (s.wipe > 0) washAt(p, 15800, '#000000', 0.15 * 255 * s.wipe, [[-60, -60], [1140, -60], [1140, 1980], [-60, 1980]], 0, 0);
  paintScaleBars(p, s);
};

/** FR39 S01-B05-SH04 (196 f), the end frame: the SH03 hold continued (`liftState` at Llift = 173 + L, SH04 camera), the ant glances at her L 125-131, a far-tower haze in the sky. */
export const paintEND = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B05-SH04'], L / 195), t = L / FPS + 90, st = liftState(c, 173 + L);
  if (!st) return;
  const {rest, crumb, fig} = st, Ll = 173 + L, gl = smooth01((L - 125) / 6);
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [900, 330], shadeEdge: -3.0, tipsAt: tipCams('S01-B05-SH04'), back: (q) => paintFarTower(q), items: [
    antItem([1.2, 0, -2.0], {view: 'right', sway: 1.5 * Math.sin(1.3 * t), ...(gl > 0 ? {glance: gl, lookSide: -1 as const} : {}), t}),
    {at: rest, draw: (q: Painter, cc: YCam) => paintCrumb(q, cc, rest, {loose: 'only' as const, shadow: 0})},
    {at: crumb, bias: 0.1, draw: (q, cc) => paintCrumb(q, cc, crumb, {bites: 1, shadow: 1 - smooth01(crumb[1] / 0.05), loose: crumb[1] > 0.005 ? 'off' : 'on'})},
    {at: st.at, draw: (q, cc) => { MEASURE.END = paintTiny(q, cc, {at: st.at, view: 'front', named: {name: 'lift-overhead', L: Ll - 42}, fig, face: 'happy', t}); }}]});
};

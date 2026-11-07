import {ell, solid, washAt} from '../kit/draw';
import {poseMix} from '../kit/poses';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camOf, MACRO_CAMS} from './cams';
import {edgeShade, paintGarden, paintPlanter, planterBlades, shadeEdgeAt} from './garden';
import {paintTiny, tinyItem} from './cast';
import {blendFig, braceClamp, namedPose, NAMED_POSES, paintClamp, VIEW_OF} from './poses';
import {TINY} from './cast';
import {paintPuff} from './scenes';
import {antItem, antWalk, ANT_SPEED} from './ant';
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

export const CHECK_FRAMES = {EDGE: 90, DROP2: 87, DROP3: 119, DROP4: 133, ANTW: 25, FX: 80, FAC: 97, SPECK: 32, DRIFT: 133, POSES: 210, CRUMB: 90, PUFF: 150, LIFT: 173, LIFTOFF: 89, LANDING: 93} as const;
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
/** G2: N4 dew drop states with the hand inside, layered back / figure / front (scene sheets S01-B03-SH02..SH04). */
const dropShot = (shot: 'S01-B03-SH02' | 'S01-B03-SH03' | 'S01-B03-SH04', len: number, tiny: V3, lean: number) => (p: Painter, frame: number) => {
  const m = MACRO_CAMS[shot], cam = camOf(m, frame / len), t = frame / FPS, st = dropStateFor(shot, frame)!;
  const g = camPoint(cam, D1_CONTACT), u = camUnit(cam, D1_CONTACT);
  if (!g) return;
  const hand = dropHand(g, u, st);
  const items: Item[] = [
    bladeItem(B_DEW, t, undefined, 0.5),
    {at: D1_CONTACT, bias: 0.6, draw: (q) => paintDropState(q, g, u, st, {layer: 'back', t})},
    {at: D1_CONTACT, bias: -0.6, draw: (q) => paintDropState(q, g, u, st, {layer: 'front', t})},
  ];
  // staging check: her shoulder must stay within arm reach (0.55) of the wrist, so she stands back as the neck stretches
  const wx = hand.wrist ? D1_CONTACT[0] + (hand.wrist[0] - g[0]) / u : tiny[0] + 0.5, tx = Math.min(tiny[0], wx - (shot === 'S01-B03-SH04' ? 0.36 : 0.55)); // SH04: lean away + feet apart pull the shoulder back, so she stands nearer to keep the wrist in reach
  if (shot !== 'S01-B03-SH03') {
    const face = shot === 'S01-B03-SH04' && st.snapF !== undefined ? 'shock' : 'angry', at: V3 = [tx, 0, tiny[2]];
    if (shot === 'S01-B03-SH04' && hand.wrist) {
      // FR09: brace-heave body (feet apart, lean away = negative in view right), right arm on the drop wrist, left hand clamped on the forearm
      const gt = camPoint(cam, at), ut = camUnit(cam, at);
      if (gt) {
        const bc = braceClamp(frame, TINY, gt, ut, hand.hand ?? hand.wrist);
        items.push(tinyItem({at, view: 'right', named: {name: 'brace-heave', L: frame}, face, t, fig: {rArm: bc.rArm, lArm: bc.lArm}, held: (q, _a, uu) => paintClamp(q, bc.clamp, uu, TINY.head.skin)}));
      }
    } else items.push(tinyItem({at, view: 'right', pose: 'P16', face, t, fig: {rArm: hand.wrist ? {to: hand.hand ?? hand.wrist, out: -1} : undefined, lean}}));
  }
  paintGarden(p, cam, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, items});
};
export const paintDROP2 = dropShot('S01-B03-SH02', 86, [1.3, 0, -0.75], -0.3);
export const paintDROP3 = dropShot('S01-B03-SH03', 118, [1.3, 0, -0.75], 0.2);
export const paintDROP4 = dropShot('S01-B03-SH04', 132, [0.76, 0, -0.72], -0.3);

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
  const c = camOf({at: [[0, 0.8, 0], [0, 0.8, 0]], yaw: [-10, 15], r: [2.4, 2.4], eye: [1.0, 1.0], f: 1050, hy: 780}, frame / 132), t = frame / FPS, out: {a?: FigAnchors | null} = {};
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

/** G12: B04-SH03 stand-in: crumb C1 + TINY nibble (L 0-35) then drag (L 36-80, truck camera), on the shot camera. */
export const paintCRUMB = (p: Painter, frame: number) => {
  const L = frame, k = L / 114, c = camOf(MACRO_CAMS['S01-B04-SH03'], k), t = frame / FPS + 40;
  const d = Math.min(1, Math.max(0, (L - 36) / 44)), at = (a: V3, b: V3): V3 => [a[0] + (b[0] - a[0]) * d, 0, a[2] + (b[2] - a[2]) * d];
  let crumb = at([-3.6, 0, -1.0], [-2.4, 0, -0.6]);
  const tiny = at([-2.85, 0, -0.95], [-1.7, 0, -0.6]);
  if (L >= 36) { // parented: the crumb's +x grip follows her hands (named pose arm targets) during the drag
    const g = camPoint(c, tiny), u = camUnit(c, tiny), pz = g && namedPose('drag-back', L - 36, TINY, g, u, 'left');
    if (pz?.rArm && pz.lArm) crumb = crumbFollowHand(c, crumb, [(pz.rArm.to[0] + pz.lArm.to[0]) / 2, 0]);
  }
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, items: [
    {at: crumb, bias: 0.1, draw: (q, cc) => paintCrumb(q, cc, crumb, {bites: L >= 22 ? 1 : 0})},
    tinyItem({at: tiny, view: 'left', named: {name: L < 36 ? 'nibble' : 'drag-back', L: L < 36 ? L : L - 36}, face: 'worried', t}),
  ]});
};

/** G13: N8 puffs fed from TINY's anchors on S01-B04-SH02 (L 72-116, clutch-puff from L 96). */
export const paintPUFF = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B04-SH02'], L / 140), t = L / FPS + 20, at: V3 = [-1.4, 0, -0.6], out: {a?: FigAnchors | null} = {};
  const clutch = L >= 96;
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -2, items: [tinyItem({at, view: 'front', named: clutch ? {name: 'clutch-puff', L: L - 96} : undefined, pose: clutch ? undefined : 'P42', face: 'worried', t}, out)]});
  if (out.a) warmthPuffsAt(L, out.a, camUnit(c, at)).forEach((q) => { if (q.a > 0.02) paintPuff(p, q.x, q.y, q.r, q.seed, t, q.a); });
};

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
export const paintLIFT = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B05-SH03'], L / 172), t = L / FPS + 60, at: V3 = [-1.75, 0, -0.6], rest: V3 = [-2.4, 0, -0.6];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
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
        const pa = paintTiny(nullPainter(), c, {at, view: 'front', named: {name: 'lift-overhead', L: L - 42}, fig: {crouch, rise}, t, shadow: false});
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
  const face = L < 40 ? 'surprised' : L >= 100 && L < 112 ? 'laugh' : 'happy';
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -1.2 - 1.8 * Math.min(1, L / 80), items: [
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
 *    into it L 22-38 (P01 -> P39 arms, lean; legs stay straight and planted until her feet leave the soil).
 *  - L 38 lift-off: legs trail into the P39 stride only after the feet are off the ground (run ramps in L 38-46, no slide); she rises
 *    gently (first 4 f 0.1 sm), over the lip by L 54 (feet 1.5), clear by L 62, drifting up and away to (-0.8, 3.0, -8.5).
 *  - L 46-59 the profile settles toward the front pose (stride closes L 46-55, lean goes, arms ease to the profile `drift-spread` arms L 50-59),
 *    then a 1 f hard swap at L 59 to the front `drift-spread` (no cross-dissolve, so no ghost double; soft roll fades in over L 60-72 and ends where
 *    SH02's starts, ~0 deg).
 *  - the ground shadow fades with her height (none from 0.35 sm up).
 */
export const paintLIFTOFF = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B02-SH01'], L / 89), t = L / FPS + 100, at = liftoffAt(L), h = at[1];
  const ramp = (a: number, b: number) => smooth01((L - a) / (b - a));
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  // profile phase: P01 -> P39 (the kit blend), the lean and arms come in L 22-38, the run (stride) only once she is off the soil
  const w = ramp(22, 38), side = poseMix('P01', 'P39', w, TINY, g, u, 'left');
  // L 50-59 the profile settles toward the front pose (stride closes, lean goes, arms ease to the profile drift-spread arms), so the one-frame swap at L 59 has close silhouettes
  const settle = ramp(50, 59), driftSide = namedPose('drift-spread', L, TINY, g, u, 'left');
  const sideBase: Partial<FigPose> = {...side, run: 0.3 * ramp(38, 46) * (1 - ramp(46, 55)), lean: (side.lean ?? 0) * (L < 38 ? w : 1) * (1 - settle)};
  const sideFig: Partial<FigPose> = settle > 0 ? {...sideBase, rArm: blendFig(sideBase, driftSide, settle).rArm, lArm: blendFig(sideBase, driftSide, settle).lArm} : sideBase;
  // front phase: drift-spread arms with the SET-DRIFT roll
  const roll = driftRoll(L) * ramp(60, 72), frontNamed = namedPose('drift-spread', L, TINY, g, u, 'front');
  const fade = L >= 59 ? 1 : 0, facing = 'scared' as const;
  const lipMat = L < 4 ? 0 : 0.22 * ramp(4, 30);
  const sideOpts = {at, view: 'left' as const, pose: 'P39' as const, face: facing, t, shadow: false, fig: sideFig};
  const frontOpts = {at, view: 'front' as const, named: {name: 'drift-spread' as const, L}, face: facing, t, shadow: false, fig: {...frontNamed, lie: roll}};
  const lead: Item = {at, bias: 0, draw: (q, cc) => {
    if (h <= 1e-4) MEASURE.LIFTOFF = paintTiny(q, cc, {...sideOpts, shadow: true});
    else {
      groundShadow(q, cc, at, h, true);
      if (fade < 1) MEASURE.LIFTOFF = paintTiny(fade > 0 ? q.layer(1 - fade, 20000) : q, cc, sideOpts);
      if (fade > 0) MEASURE.LIFTOFF = paintTiny(fade < 1 ? q.layer(fade, 21000) : q, cc, frontOpts);
    }
  }};
  paintPlanter(p, c, {t, items: [lead], blades: planterBlades().filter((b) => b.root[2] < -5.3 || b.root[0] < -3.3 || b.root[0] > 3.4), wallItem: true, calm: [1150, 1370], bits: 110, gust: lipMat > 0 ? {dir: [0, -1], amt: lipMat} : undefined});
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
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [180, 300], items: [lead], tips: {n: 7, h: [0.08, 0.2]}});
};

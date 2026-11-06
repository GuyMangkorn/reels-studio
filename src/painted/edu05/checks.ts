import {ell, solid} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camOf, MACRO_CAMS} from './cams';
import {edgeShade, paintGarden, shadeEdgeAt} from './garden';
import {tinyItem} from './cast';
import {braceClamp, namedPose, NAMED_POSES, paintClamp, VIEW_OF} from './poses';
import {TINY} from './cast';
import {paintPuff} from './scenes';
import {antItem, antWalk, ANT_SPEED} from './ant';
import type {Arm, FigAnchors, FigPose} from '../kit/cast';
import {camPoint, camUnit} from '../kit/ycam';
import {B_DEW, D1_CONTACT} from './garden';
import {bladeItem} from './macro';
import {dropHand, dropStateFor, paintDropState} from './drop';
import type {Item} from './world';

// EDU-EP05 W5.2 element check scenes: pure paint functions of the frame (stills only), one per element group, rendered with
//   printf 'EDU5-CHK-EDGE 45 out/edu05/w52/g1/EDGE45.png\n' | node scripts/stills.mjs src/painted/edu05/check-index.ts
// They show an element in its shot's camera and staging, not a finished shot (Editor assembles those).

export const CHECK_FRAMES = {EDGE: 90, DROP2: 87, DROP3: 119, DROP4: 133, ANTW: 25, FX: 80, FAC: 97, SPECK: 32, DRIFT: 133, POSES: 210, CRUMB: 90, PUFF: 150, LIFT: 173} as const;
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

import {paintCap, paintFacadeDown, paintFacadeUp, paintRing, lookDownCam, speckAt, speckCam} from './facade';
import {paintAirStreaks, paintDriftAir} from './effects';
/** G9: N3 look-down facade (S01-B01-SH02) with the cap. */
export const paintFAC = (p: Painter, frame: number) => { const c = lookDownCam(frame / 96); paintFacadeDown(p, c, frame / FPS); paintCap(p, c); };
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
 * G14: S01-B05-SH03 stand-in (the lift, R1.3 FR08): TINY seated beside C1 (L 0-35), stands L 36, hands reach the crumb's two grips and
 * lift it overhead L 42-54 (`lift-overhead`, arms blended grip -> overhead), holds. C1 is parented to the mean of her two hands with
 * `crumbFollowHand` (x) and a lift solved the same way (y), so it never leaves her grip. Frame = shot-local L (0-172).
 */
export const paintLIFT = (p: Painter, frame: number) => {
  const L = frame, c = camOf(MACRO_CAMS['S01-B05-SH03'], L / 172), t = L / FPS + 60, at: V3 = [-1.75, 0, -0.6], rest: V3 = [-2.4, 0, -0.6];
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  const seated = L < 36, k = smooth01((L - 42) / 12);
  let crumb = rest, fig: Partial<FigPose> | undefined;
  if (!seated) {
    const pz = namedPose('lift-overhead', L - 42, TINY, g, u, 'front'), gr0 = crumbGrips(c, rest);
    if (pz.rArm && pz.lArm && gr0) {
      // v4 (user: "looks odder"; overhead-press reference: arms near vertical, forearms vertical from the front, load centred over the head on the palms):
      // the crumb rides on the pose's own hands (0.26 sm apart, arms straight up), its bottom edge on the palms; on the way up the hands stay on its +x face, then slide under it.
      const handPx = (pz.rArm.to[1] + pz.lArm.to[1]) / 2;
      let top: V3 = [at[0], 1.9, at[2]];
      for (let i = 0; i < 4; i++) { const gg = crumbGrips(c, top); if (gg) top = [top[0], top[1] + (gg.centre[1] + 0.5 * CRUMB.h * gg.u - handPx) / gg.u, top[2]]; } // bottom edge on the palms
      crumb = [rest[0] + (top[0] - rest[0]) * k, rest[1] + (top[1] - rest[1]) * k, rest[2]];
      const gr = crumbGrips(c, crumb)!, mix = (a: Pt, b: Pt, w: number): Pt => [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
      const k2 = smooth01((k - 0.4) / 0.6), fx = gr.centre[0] + 0.5 * CRUMB.w * gr.u + 0.02 * u;
      const faceHi: Pt = [fx, gr.centre[1] - 0.06 * u], faceLo: Pt = [fx, gr.centre[1] + 0.1 * u];
      const hand = (a: Arm, fc: Pt): Arm => ({...a, to: mix(fc, a.to, k2), via: mix([(fc[0] + g[0]) / 2, fc[1] + 0.1 * u], a.via!, k2)});
      const lowX = pz.rArm.to[0] < pz.lArm.to[0]; // rArm = screen-left hand in `front`
      fig = {crouch: 0.6 * (1 - k), ...(lowX ? {rArm: hand(pz.rArm, faceLo), lArm: hand(pz.lArm, faceHi)} : {rArm: hand(pz.rArm, faceHi), lArm: hand(pz.lArm, faceLo)})};
    }
  }
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -1.2 - 1.8 * Math.min(1, L / 80), items: [
    {at: crumb, bias: 0.1, draw: (q, cc) => paintCrumb(q, cc, crumb, {bites: 1})},
    tinyItem({at, view: 'front', named: seated ? {name: 'sit-up-check', L} : {name: 'lift-overhead', L: L - 42}, fig, face: L < 40 ? 'surprised' : 'happy', t}),
  ]});
};
const smooth01 = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };

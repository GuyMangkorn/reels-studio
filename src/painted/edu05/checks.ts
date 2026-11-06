import {ell, solid} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camOf, MACRO_CAMS} from './cams';
import {edgeShade, paintGarden, shadeEdgeAt} from './garden';
import {tinyItem} from './cast';
import {NAMED_POSES, VIEW_OF} from './poses';
import {antItem, antWalk, ANT_SPEED} from './ant';
import type {FigAnchors} from '../kit/cast';
import {camPoint, camUnit} from '../kit/ycam';
import {B_DEW, D1_CONTACT} from './garden';
import {bladeItem} from './macro';
import {dropHand, dropStateFor, paintDropState} from './drop';
import type {Item} from './world';

// EDU-EP05 W5.2 element check scenes: pure paint functions of the frame (stills only), one per element group, rendered with
//   printf 'EDU5-CHK-EDGE 45 out/edu05/w52/g1/EDGE45.png\n' | node scripts/stills.mjs src/painted/edu05/check-index.ts
// They show an element in its shot's camera and staging, not a finished shot (Editor assembles those).

export const CHECK_FRAMES = {EDGE: 90, DROP2: 87, DROP3: 119, DROP4: 133, ANTW: 25, FX: 80, FAC: 97, SPECK: 32, DRIFT: 133, POSES: 210} as const;
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
  const wx = hand.wrist ? D1_CONTACT[0] + (hand.wrist[0] - g[0]) / u : tiny[0] + 0.5, tx = Math.min(tiny[0], wx - 0.55);
  if (shot !== 'S01-B03-SH03') items.push(tinyItem({at: [tx, 0, tiny[2]], view: 'right', pose: 'P16', face: shot === 'S01-B03-SH04' && st.snapF !== undefined ? 'shock' : 'angry', t,
    fig: {rArm: hand.wrist ? {to: hand.hand ?? hand.wrist, out: -1} : undefined, lean}}));
  paintGarden(p, cam, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -0.5, items});
};
export const paintDROP2 = dropShot('S01-B03-SH02', 86, [1.3, 0, -0.75], 0.2);
export const paintDROP3 = dropShot('S01-B03-SH03', 118, [1.3, 0, -0.75], 0.2);
export const paintDROP4 = dropShot('S01-B03-SH04', 132, [0.76, 0, -0.72], 0.2);

/** G3: N6 ant-walk, 24 f at the S01-B05-SH01 speed (0.07 sm/f) on the shot camera: feet planted, leaf upright, gait clock by distance. */
export const paintANTW = (p: Painter, frame: number) => {
  const shot = 'S01-B05-SH01', v = ANT_SPEED[shot], c = camOf({...MACRO_CAMS[shot], yaw: [-10, -10], r: [2.2, 2.2], at: [[0.6, 0.5, -2.0], [0.6, 0.5, -2.0]]}, 0), t = frame / FPS;
  const x0 = -0.2, d = v * frame, w = antWalk(d);
  paintGarden(p, c, {t, mode: 'sun', drop: false, shadeEdge: -3, sun: [900, 330], items: [antItem([x0 + d, 0, -2.0], {view: 'right', walk: w.walk, sway: w.sway, t})]});
};

/** G4-G8: N7 pop ring, N8 puffs, N5 crumb, N9 bars on one frame sheet (frame = shot-local frame of the sheet it belongs to, see fx key). */
import {paintCrumb, paintScaleBars, paintShrinkPop, paintWarmthPuffs, barsAt, shrinkScale, type PuffSpec} from './effects';
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
/** G10: N2 drift air + N10 air streaks round TINY (S01-B02-SH02, spread arms). */
export const paintDRIFT = (p: Painter, frame: number) => {
  const c = camOf({at: [[0, 0.8, 0], [0, 0.8, 0]], yaw: [-10, 15], r: [2.4, 2.4], eye: [1.0, 1.0], f: 1050, hy: 780}, frame / 132), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  paintDriftAir(p, t, frame, 438);
  tinyItem({at: [0, 0, 0], view: 'front', pose: 'P01', face: 'surprised', t, fig: {lArm: {to: [200, 700], out: -1}, rArm: {to: [880, 700], out: 1}}}, out).draw(p, c);
  const a = out.a;
  if (a) { const cx = a.head[0], cy = (a.headTop + 1218) / 2, ring: Pt[] = Array.from({length: 40}, (_, i) => [cx + Math.cos((i / 40) * 6.283) * 190, cy + Math.sin((i / 40) * 6.283) * 520] as Pt); paintAirStreaks(p, ring, frame); }
};

/** G11: N10 named poses, frame = index x 30 + L (L 0-29), one pose per 30 f, TINY alone on the garden ground at mid-shot scale. */
export const paintPOSES = (p: Painter, frame: number) => {
  const i = Math.min(NAMED_POSES.length - 1, Math.floor(frame / 30)), L = frame % 30, t = frame / FPS, name = NAMED_POSES[i];
  const c = camOf({at: [[0, 0.8, 0], [0, 0.8, 0]], yaw: [0, 0], r: [2.4, 2.4], eye: [1.0, 1.0], f: 1050, hy: 780}, 0);
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [150, 300], shadeEdge: -2, items: [tinyItem({at: [0, 0, 0], view: VIEW_OF[name], named: {name, L}, face: 'neutral', t})]});
};

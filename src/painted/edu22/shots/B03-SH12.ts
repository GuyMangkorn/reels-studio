import {LIGHT_ORDER, T_SH12, tasterStand} from '../crew';
import {G_COVER, G_SPOON, G_TAG, glintPop} from '../glints';
import {gs2Overlay, type GS2} from '../glints-gs2';
import {paintHall} from '../hall';
import {makeShot, type Shot22} from '../shot';
import {lifterItems, sheetMove, shotCam} from '../stage';

// B03-SH12 · G 846-886 (40 f) · three checkpoints (EDU-EP22-SCENES-R2, brief VD08). R2: the three checkpoints are the subject, a three-quarter
// view down the open LT (all 28 covers off on the runner beside their bowls): the tag in A01 at centre, the spoon on SAU lower left, A05's
// removed cover upper right; T a step back at T_SH12 in left profile, hands folded, only a sleeve edge at the right; lifters E1-E3 front, P01.
// Glints in GS2 (glints-gs2.tsx, world-locked through the shot camera): G-TAG l 6, G-SPOON l 16, G-COVER l 26, each a 6 f pop with one ring,
// then live. R1 camera: SH12_MOVE in crew.ts (at (-3.4, 0.9, 1.2), yaw 40 -> 36, r 2.6 -> 2.4, eye 1.5, f 1000, hy 660), no longer used here.
const N = 40;
const M = sheetMove([-3.3, 0.88, 1.5], [24, 20], [1.5, 1.4], 1.3, {f: 950, hy: 720, pitch: [-15, -15]});
// R2 deviation (Boss): T 0.2 m further +x than T_SH12 in this shot only. At T_SH12 the 4-head cast's head and face entered the frame's top
// right (x 930-1080 at l 39; the sheet's projection assumed T's head above frame), over the 5 % limit; SH17 keeps T_SH12 (out of frame).
const T_AT: [number, number, number] = [T_SH12[0] + 0.2, T_SH12[1], T_SH12[2]];
const POPS: [GS2['id'], GS2['at'], number][] = [['G-TAG', G_TAG, 6], ['G-SPOON', G_SPOON, 16], ['G-COVER', G_COVER, 26]];
export const def: Shot22 = {
  id: 'B03-SH12', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = L / 30;
    paintHall(p, c, {light: LIGHT_ORDER, longTable: {covers: 'off', spoonOnSaucer: true}, items: [...lifterItems(t), tasterStand(t, T_AT, {view: 'left'})]});
  },
  // anchors for the headless measure (measure-shots.ts reads centres only); the picture is the GS2 overlay below
  glints: (L) => POPS.map(([id, at, t0]) => ({id: id as 'G-TAG', at, k: glintPop(L, t0)})),
};
export const gs2 = (L: number): GS2[] => POPS.map(([id, at, t0], i) => ({id, at, k: glintPop(L, t0), ringAge: L >= t0 ? L - t0 : null, phase: i, live: L >= t0 + 6}));
export const shot = gs2Overlay(makeShot(def), def, gs2);

import {LIGHT_ORDER, T_SH12, tasterStand} from '../crew';
import type {V3} from '../../kit/space';
import {G_COVER, G_SPOON} from '../glints';
import {gs2Overlay, type GS2} from '../glints-gs2';
import {LT, LT_BOWLS, paintHall} from '../hall';
import {makeShot, type Shot22} from '../shot';
import {BOWL_A01, lifterItems, sheetMove, shotCam} from '../stage';

// B04-SH17 · G 1220-1292 (72 f) · this checkpoint looks safer than it is (EDU-EP22-SCENES-R2). R2: closer than SH12 on the same three checkpoints
// (R1 reused SH12's end frame), a slow 8 % push toward the tag; covers off, T's spoon on SAU, T at T_SH12 out of frame right; lifters E2 and E3
// only (E1's head would sit under the mark box). GS2 glints at scale 1.25 (core r 20, arms 104 px tip to tip), all on from l 0 with the live
// twinkle, no pop or ring. G-TAG DIM2 l 12-24 (G 1232-1244, on "นี้"): one sputter, then a grey #8f8a80 dot, r x 0.6, arms 1.2 r, no hot centre,
// no halo, no twinkle, outline kept. G-SPOON and G-COVER stay warm. (Superseded for G-TAG's place, grey and timing by R2b below.)
const N = 72;
const M = sheetMove([-3.33, 0.88, 1.62], [22, 19], [1.05, 0.97], 1.2, {f: 1000, hy: 630, pitch: [-18, -18]});
// R2b (W6.2 viewer check R-C, "the strip glint is not identifiable, no frame shows the dim"): G-TAG sits on A01's tag itself, 0.01 m above
// its top end (tableware.ts `paintTag` corner b), so it reads as the strip's own light rather than a lid's (G_TAG, the bowl centre at 0.9 m, put
// it over the food beside the neighbouring cover). Same GS2 size and gold as the other two; the live twinkle phases are 0 / 10 / 20 f so all
// three are exactly the same size at l 0. DIM (replaces DIM2's sputter here): on "ด่านนี้" l 12-18 (G 1232-1238, 6 f) a smoothstep to a grey
// #8a8f96 dot (core r x 0.6, arms 1.2 r, no hot centre, halo or twinkle; about 31 % of a gold sparkle's tip-to-tip size), held to the end.
// G-SPOON and G-COVER keep pulsing warm gold.
const bw = LT_BOWLS[BOWL_A01].at;
const G_TAG_STRIP: V3 = [bw[0] + 0.01, LT.y + 0.003 + 0.054 + 0.055 + 0.01, bw[2] - 0.004];
const ON: [GS2['id'], GS2['at']][] = [['G-TAG', G_TAG_STRIP], ['G-SPOON', G_SPOON], ['G-COVER', G_COVER]];
const PHASE = [0, 10 / 7, 20 / 7];
const DIM_T0 = 12, DIM_LEN = 6;
const tagDim = (L: number): {bright: number; dim: number; grey: string} => {
  const u = Math.max(0, Math.min(1, (L - DIM_T0) / DIM_LEN)), d = u * u * (3 - 2 * u);
  return {bright: 1 - d, dim: d, grey: '#8a8f96'};
};
export const def: Shot22 = {
  id: 'B04-SH17', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = (40 + L) / 30;
    paintHall(p, c, {light: LIGHT_ORDER, longTable: {covers: 'off', spoonOnSaucer: true}, items: [...lifterItems(t).slice(1), tasterStand(t, T_SH12, {view: 'left'})]});
  },
  // anchors for the headless measure (measure-shots.ts reads centres only); the picture is the GS2 overlay below
  glints: () => ON.map(([id, at]) => ({id: id as 'G-TAG', at, k: 1})),
};
export const gs2 = (L: number): GS2[] => ON.map(([id, at], i) => ({id, at, k: 1, ringAge: null, phase: PHASE[i], live: true, ...(id === 'G-TAG' ? tagDim(L) : {})}));
export const shot = gs2Overlay(makeShot(def), def, gs2, 1.25);

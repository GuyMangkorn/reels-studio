import type {V3} from '../kit/space';
import type {Item} from '../kit/world';
import {CARRIERS} from './cast';
import {CT} from './hall';
import {add3, lerp3, paintPerson, ramp, toward, walkPath, walkPhase, type PersonOpts, type WalkPath} from './motion22';
import {paintTrayLoad} from './stage';
import {TRAY_AT} from './tableware';

// EDU-EP22-SHORT carrier procession (Boss W5.1, 2026-11-16; scene sheet B02-SH05 R1 carrier plan, B02-SH06 exit). Carriers K1-K4 walk their
// polylines at about 1.1 m/s (walk phase from the distance), turn to the table at their mark, lower the tray onto CT over 12 f (released on
// contact at the set frame), then step back 0.3 m over 10 f. SH06 walks them out to screen right from where SH05 left them. The tray rides
// 0.38 m ahead of the carrier at 1.0 m while carried, both mittens on its sides (P26 tray grip; the tray stays square to CT, long side on x).

/** Per carrier (K1..K4 = index 0..3): the walk, the tray it sets (TRAY_AT index) and the set frame (shot-local SH05). */
export type CarrierPlan = {path: WalkPath; tray: number; set: number};
export const SH05_PLAN: CarrierPlan[] = [
  {path: {pts: [[-0.7, 0, 0.85], [-0.95, 0, -0.25]], t0: 0, t1: 45}, tray: 0, set: 64},
  {path: {pts: [[1.5, 0, -1.0], [0.8, 0, -0.5]], t0: 0, t1: 26}, tray: 1, set: 78},
  {path: {pts: [[2.4, 0, -1.0], [1.3, 0, -0.6], [0.6, 0, 0.95], [-0.3, 0, 0.95]], t0: 0, t1: 100}, tray: 2, set: 106},
  {path: {pts: [[3.3, 0, -1.0], [1.25, 0, -0.6], [0.95, 0, 0.45]], t0: 0, t1: 85}, tray: 3, set: 92},
];
const CARRY = 0.38, CARRY_Y = 1.0, LOWER = 12, BACK = 0.3, BACK_F = 10;

export type CarrierState = {at: V3; facing: [number, number]; walk: number; tray?: V3; hands: number};
/** Carrier k in SH05 at frame L. */
export const carrierSH05 = (k: number, L: number): CarrierState => {
  const pl = SH05_PLAN[k], w = walkPath(pl.path, L), mark = pl.path.pts[pl.path.pts.length - 1];
  const tray = TRAY_AT[pl.tray], tf = toward(mark, tray);
  const turn = ramp(L, pl.path.t1 - 4, pl.path.t1 + 4);
  const f0 = w.facing, fx = f0[0] + (tf[0] - f0[0]) * turn, fz = f0[1] + (tf[1] - f0[1]) * turn, fl = Math.hypot(fx, fz) || 1;
  const facing: [number, number] = [fx / fl, fz / fl];
  const back = ramp(L, pl.set, pl.set + BACK_F), at = add3(w.at, [-tf[0], 0, -tf[1]], BACK * back);
  const carry: V3 = [at[0] + facing[0] * CARRY, CARRY_Y, at[2] + facing[1] * CARRY];
  const onTable: V3 = [tray[0], CT.y + 0.001, tray[2]];
  const trayAt = L >= pl.set ? undefined : L <= pl.set - LOWER ? carry : lerp3([mark[0] + tf[0] * CARRY, CARRY_Y, mark[2] + tf[1] * CARRY], onTable, ramp(L, pl.set - LOWER, pl.set));
  return {at, facing, walk: walkPhase(CARRIERS[k], w.dist + BACK * back), tray: trayAt, hands: 1 - ramp(L, pl.set, pl.set + BACK_F)};
};
/** Trays already on CT at SH05 frame L (TRAY_AT indices). */
export const traysSetSH05 = (L: number) => SH05_PLAN.filter((pl) => L >= pl.set).map((pl) => pl.tray);

/** SH06: carriers walk out to screen right from their SH05 end positions (+x, rounding the front of CT for K1 and K3), out of frame by l 40. */
export const carrierSH06 = (k: number, L: number): CarrierState => {
  const end = carrierSH05(k, 125), start = end.at;
  const pts: V3[] = k === 0 ? [start, [-0.9, 0, 0.75], [1.4, 0, 0.75], [3.2, 0, 0.6]] : k === 2 ? [start, [1.6, 0, 0.9], [3.2, 0, 0.8]] : [start, [start[0] + 2.6, 0, start[2] - 0.2]];
  const w = walkPath({pts, t0: k === 0 ? 2 : 0, t1: 40}, L);
  return {at: w.at, facing: w.facing, walk: walkPhase(CARRIERS[k], end.walk + w.dist), hands: 0};
};

/** A carrier as sorted items: the figure, and the carried tray as its own item (sorted by its own depth). Mittens on the tray's sides. */
export const carrierItems = (k: number, s: CarrierState, t: number): Item[] => {
  const def = CARRIERS[k];
  const opts: PersonOpts = {at: s.at, t, facing: s.facing, seed: def.seed, walk: s.walk, stride: 1, pose: 'P01'};
  const items: Item[] = [];
  const side: [number, number] = [-s.facing[1], s.facing[0]];
  if (s.tray && s.hands > 0) {
    const tr = s.tray;
    opts.hands = {r: [tr[0] + side[0] * 0.2, tr[1] + 0.03, tr[2] + side[1] * 0.2], l: [tr[0] - side[0] * 0.2, tr[1] + 0.03, tr[2] - side[1] * 0.2]};
    opts.walk = undefined;
    opts.fig = {walk: s.walk, stride: 0.6};
    items.push({at: [tr[0], 0, tr[2]], bias: -0.02, draw: (p, c) => paintTrayLoad(p, c, SH05_PLAN[k].tray, tr, 0, false)});
  }
  items.push({at: s.at, bias: 0, draw: (p, c) => { paintPerson(p, c, def, opts); }});
  return items;
};

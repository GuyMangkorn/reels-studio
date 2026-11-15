import type {FaceState} from '../kit/head';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBoat, type BoatKind} from './boats';
import {armsBlend, paintHoseRig, type ArmKey, type HoseRig} from './hose';
import {M0, paintYard, type YardLayer, type YardLight} from './yard';

// EDU-EP17 yard shot helper (Boss W5): the N1 yard with MAN posed by the hose rig (N14 arm keys, N3 hose states) and the bay boats on the shot clock.
// The ten yard shots call this with their own camera and timeline; the look frames keep calling paintYard directly.

export type YardShot = {
  /** Arm keys and the eased blend between them (`[a, b, w]`), or one key. */
  arms: ArmKey | [ArmKey, ArmKey, number];
  hose: HoseRig;
  face?: string; faceState?: Partial<FaceState>;
  view?: 'back' | 'front'; facing?: [number, number]; headYaw?: number;
  /** Shot seconds for the bay (boat drift, bob) and the hose water. */
  t: number;
  /** Trawler drift along +x (m/s; B02-SH01 0.3). */
  drift?: number;
  light?: YardLight;
  layer?: (p: Painter, c: YCam, slot: YardLayer) => void;
  man?: false;
  /** Bob the boats (amplitude m, default 0.04). */
  bob?: number;
  /** The sister waves (P07) on the phone screen for f < 36 (B01-SH01 only); every yard shot gets the live screen at frame round(t * 30). */
  wave?: boolean;
};
const BOATS: [BoatKind, V3, number][] = [['trawler', [40, -1.5, -260], 100], ['longtailY', [-2, -1.5, -85], 75], ['cabin', [6, -1.5, -60], 70], ['longtailR', [-9, -1.5, -42], 110]];
export const bayBoats = (t: number, drift = 0, bob = 0.04) => (p: Painter, c: YCam) => BOATS.forEach(([k, at, hd], i) => {
  const x = at[0] + (k === 'trawler' ? drift * t : 0.05 * Math.sin(t * 0.4 + i));
  paintBoat(p, c, 3000 + i * 60, k, [x, at[1], at[2]], hd, {bob: bob * Math.sin(t * 1.6 + i * 1.3)});
});

/** The last painted MAN anchors and hose end (read by scripts/edu-series/ep17/shot-measure.ts; no effect on the picture). */
export const LAST: {man?: ReturnType<typeof paintYard>; end?: ReturnType<typeof paintHoseRig>} = {};
/** Paints the yard and MAN; returns MAN's anchors (lead measure, hand points) and the hose end. */
export const paintYardShot = (p: Painter, c: YCam, o: YardShot) => {
  const g = camPoint(c, M0), u = camUnit(c, M0);
  const [a, b, w] = Array.isArray(o.arms) ? o.arms : [o.arms, o.arms, 0];
  const fig = g ? {...armsBlend(a, b, w, g, u)} : {};
  let end: ReturnType<typeof paintHoseRig> = null;
  const back = !o.facing && (o.view ?? 'back') === 'back';
  const man = paintYard(p, c, {
    light: o.light, boats: bayBoats(o.t, o.drift, o.bob), layer: o.layer, screen: {f: Math.round(o.t * 30), wave: o.wave},
    man: o.man === false ? false : {face: o.face, faceState: o.faceState, view: o.view, facing: o.facing, headYaw: o.headYaw, fig, t: o.t},
    hoseFn: (an) => { end = paintHoseRig(p, c, an?.rHand ?? null, an?.lHand ?? null, an?.bottom ?? (g ? g[1] : 1900), {...o.hose, t: o.t}, back); },
  });
  LAST.man = man; LAST.end = end;
  return {man, end: end as ReturnType<typeof paintHoseRig>};
};

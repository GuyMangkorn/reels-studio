import type {V3} from '../../kit/space';
import {camPoint, type YCam} from '../../kit/ycam';
import {paddockExtras, paintEmu, paintFlock} from '../flock';
import {paintPaddockScene, sunOf} from '../paddock';
import {paintTruckDust, paintTruckRig, truckDustFor, truckPoint, truckState} from '../props';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B01-SH02 (Boss T19, 2026-11-20): reverse wide from behind the strolling flock; EMU1 and four extras (T08 `paddockExtras`, feet on the ambient gait) cross
// unbothered, EMU1 pecks local 30-40; far beyond the fence the T14 truck drives out screen left with silhouette riders and cased gear. The gun position at
// the origin is the trampled clearing only (the crew is on the truck). Pan only, yaw 200 -> 194 ease-in-out.
const N = 59, SHOT = 'B01-SH02', LIGHT = 0, EATEN = 0.3;
const EASE = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const CAM = (L: number): YCam => camLine({eye: [6.0, 1.5, -30], yaw: 200 + (194 - 200) * EASE(L / 58), pitch: 0, f: 900, hy: 820});
const track = (L: number) => truckState(SHOT, L);

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const st = track(L)!, dust = {truckAt: truckPoint(st.centre, 1, 0, 0, 0) as V3, ...truckDustFor(SHOT)};
    const sun = sunOf(LIGHT);
    paintPaddockScene(p, c, {light: LIGHT, eaten: EATEN, stubble: 0}, () => {
      paintTruckDust(p, c, L, track, {part: 'far', ...dust});
      paintTruckRig(p, c, {centre: st.centre, dir: st.dir, riders: 'silhouettes', gear: 'cases', wheelTurn: st.wheelTurn, t: L / 30, seed: 14100});
      paintTruckDust(p, c, L, track, {part: 'near', ...dust});
      paintFlock(p, c, paddockExtras(L), {sun});
    });
    if (pr) {
      const pts = [-2.6, 2.68].map((a) => camPoint(c, truckPoint(st.centre, 1, a, 2.12, 0))), base = [-2.6, 2.68].map((a) => camPoint(c, truckPoint(st.centre, 1, a, 0, 0)));
      // EMU1: head top to toe line (T03 r3), probed through a dry paint (no painter) of the same member
      const a = paintEmu(null, c, paddockExtras(L)[0], {sun});
      pr.lead('EMU1', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
      if (pts[0] && pts[1] && base[0] && base[1]) pr.lead('TRUCK', {top: Math.min(pts[0][1], pts[1][1]), bottom: Math.max(base[0][1], base[1][1]), left: Math.min(pts[0][0], pts[1][0]), right: Math.max(pts[0][0], pts[1][0]), x: (pts[0][0] + pts[1][0]) / 2});
    }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

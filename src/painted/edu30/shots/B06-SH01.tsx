import {emuBuild, paintFlock, scaled, slowDust, slowLine, SLOW_HERO} from '../flock';
import {paintBeast} from '../../survival/beast';
import {MEREDITH, paintCrewPose} from '../cast';
import {paintCamp, paintFarmhouse, paintFence, paintGum, paintPadGround, paintPadSky, paintScrub, paintWheatRidges, setNoClearing, sunOf} from '../paddock';
import type {Painter} from '../../kit/painter';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';
import type {YCam} from '../../kit/ycam';

// B06-SH01 (Boss T31, 2026-11-20): over MEREDITH's back, the slow line "like tanks". Space P, morning NE sun (light 0), eaten 0.7, no stubble.
// Camera pans yaw -6 -> 0 (ease-in-out, L 0-109), no push (the birds supply it). Birds and dust come from T08 `slowLine` / `slowDust` (84 f cycle, hero contacts
// L 12 / 54 / 96, hero frozen from L 100). MEREDITH is T12 P44-back (still, shoulder and hat at the top left; mouth never visible), painted after the flock.
const N = 110, LIGHT = 0, EATEN = 0.7;
const ease = (u: number) => u * u * (3 - 2 * u);
const CAM0 = camLine({eye: [-1.6, 0.6, -1.0], yaw: -6, pitch: 6, f: 1020, hy: 900});
const CAM = (L: number): YCam => ({...CAM0, yaw: CAM0.yaw + ((6 * Math.PI) / 180) * ease(Math.max(0, Math.min(1, L / 109)))});
/** The B06 paddock without the gun clearing (T31): the sheet stages the line at z -4.6 to -3.8 in the open with feet visible, but `paintPaddockScene` always paints
 *  the clearing's 0.85 m wheat wall (r 3.7 about (-0.3, -0.4)) after the cast, which hides every bird below the chest. Same layers and seeds as `paintPaddockScene`, no clearing. */
export const paintOpenPaddock = (p: Painter, c: YCam, o: {light: number; eaten: number; stubble: number}, cast: () => void) => {
  setNoClearing(true);
  try {
    paintPadSky(p, c, o.light);
    paintScrub(p, c, 30100, 300);
    paintScrub(p, c, 30200, 170, '#7a8264');
    paintPadGround(p, c, 30300, {eaten: o.eaten, light: o.light});
    paintFarmhouse(p, c, 30400, [-90, 0, -160]);
    paintWheatRidges(p, c, 30600, {light: o.light, stubble: o.stubble, eaten: o.eaten});
    paintGum(p, c, 30700, [-22, 0, -38], 14, o.light);
    paintGum(p, c, 30720, [36, 0, -70], 12, o.light);
    paintGum(p, c, 30740, [18, 0, 22], 10, o.light);
    paintCamp(p, c, 30800, o.light);
    cast();
    paintFence(p, c, 31000, -60, 60, o.light);
  } finally { setNoClearing(false); }
};
const MER: [number, number, number] = [-2.4, 0, -2.2];

export const def: Shot30 = {
  id: 'B06-SH01', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = sunOf(LIGHT);
    paintOpenPaddock(p, c, {light: LIGHT, eaten: EATEN, stubble: 0}, () => {
      slowDust(p, c, L);
      paintFlock(p, c, slowLine(L), {sun});
    });
    paintCrewPose(p, c, MEREDITH, MER, {pose: 'p44-back', L: 0, seed: 34600});
    if (pr) {   // probe: EMU-HERO head top to toe line (a no-paint pass through the same camera)
      const m = slowLine(L)[SLOW_HERO];
      const a = paintBeast(null, c, scaled(emuBuild({...m.pose, hero: true}), m.scale), {at: [m.at[0], m.at[2]], heading: m.heading, ground: m.at[1], seed: m.seed});
      pr.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
    }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

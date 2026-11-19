import type {YCam} from '../kit/ycam';
import {MEREDITH, paintCrew} from './cast';
import {EMU_POSES} from './emu';
import {paintEmu} from './flock';
import {paintPadGround, paintPadSky, setNoClearing, SUN} from './paddock';
import {buildLewisGun, placeBuild} from './props';
import type {Probe30, Shot30} from './shot';

// EDU-EP30-SHORT scale calibration sheet `EDU30-CAL` (Boss T03, 2026-11-19; brief technical handoff, Scale baseline). Space P, morning sun,
// newsreel strength 0 (plain colour): MEREDITH `P01` front at (-1.2, 0, 0), EMU-HERO `stand` heading PI at (0, 0, 0) (r2: side view, faces -x toward MEREDITH;
// heading h faces (cos h, sin h) in (x, z)), the Lewis gun side-on (heading 0, muzzle toward +x) at
// (1.2, 0, 0). Camera eye (0, 0.9, 6.0), yaw 0, pitch 0, f 1000, hy 960. At 6 m a 1.70 m figure is 1000 x 1.70 / 6.0 = 283 px.
const CAM: YCam = {x: 0, y: 0.9, z: 6.0, yaw: 0, pitch: 0, f: 1000, hy: 960};

export const CAL: Shot30 = {
  id: 'CAL', N: 1, paper: '#efe6d0',
  cam: () => CAM,
  reel: () => ({strength: 0, tint: 'warm' as const, tintAmount: 1, pop: 0}),
  paint: (p, _L, c, pr?: Probe30) => {
    const sun = SUN.morning;
    setNoClearing(true);
    paintPadSky(p, c, 'morning');
    paintPadGround(p, c, 30300, {eaten: 0, light: 'morning'});
    const m = paintCrew(p, c, MEREDITH, [-1.2, 0, 0], {view: 'front', pose: 'P01', t: 0, seed: 35100, hat: 'slouch'});
    pr?.lead('MEREDITH', m && {top: m.top, bottom: m.bottom, x: m.head[0]});
    const e = paintEmu(p, c, {at: [0, 0, 0], heading: Math.PI, pose: EMU_POSES.stand(), scale: 1, seed: 36000, hero: true}, {sun});
    pr?.lead('EMU-HERO', {top: e.top, bottom: e.bottom, left: e.left, right: e.right, x: (e.left + e.right) / 2});
    const g = placeBuild(p, c, buildLewisGun(), [1.2, 0, 0], 0, {seed: 35300, sun});
    pr?.lead('G1', {top: g.top, bottom: g.bottom, left: g.left, right: g.right, x: (g.left + g.right) / 2});
    setNoClearing(false);
  },
};

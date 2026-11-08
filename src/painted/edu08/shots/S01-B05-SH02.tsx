import {paintEarth} from '../../kit/earth';
import type {YCam} from '../../kit/ycam';
import {camPoint} from '../../kit/ycam';
import {AIRLOCK, hatchAngle, paintAirlock} from '../rooms';
import {AST_DEF, CREW_DEF, paintSuited} from '../suit';
import {dry, reachTo} from '../stage';
import {ringOpacity} from '../shot';
import {makeShot} from '../shot';
import {mix} from '../clock';
import type {V3} from '../../kit/space';

// S01-B05-SH02 (G 1453-1511, SHEETS-R2.4: time shift only, +14; R2.3 1439-1497, R2 1439-1498) hatch shut, ring stops (L12a "ก็อาจรอด", script R1.2; picture unchanged, camera u = L / 58). Hatch angle hatchAngle((L - 1) / 30, 100, 0.6, 1.4): swing L19-43, shut L43 (G1496; R2.3 G1482) = felt thud = tick 9 = ring stop; the ring holds 9.0
// and fades L43-55. cam (SD05): pos (0.30,-0.25,-0.95)->(0.24,-0.22,-0.85), target (-0.05,0.05,1.20), pitch +6, f 900, hy 950, cx -60.
const N = 58;
const cam = (L: number): YCam => {
  const u = L / N, pos: V3 = [mix(0.3, 0.24, u), mix(-0.25, -0.22, u), mix(-0.95, -0.85, u)], T: V3 = [-0.05, 0.05, 1.2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(T[0] - pos[0], -(T[2] - pos[2])), pitch: (6 * Math.PI) / 180, f: 900, hy: 950, cx: -60};
};
export const shot = makeShot('S01-B05-SH02', {
  paper: '#8a97a8',
  ringOpacity: (L) => ringOpacity(L, {inAt: -20, stopAt: 43, outFrames: 12}),
  paint: (p, L, G) => {
    const c = cam(L), t = (L - 1) / 30;
    paintAirlock(p, c, {hatchOpen: hatchAngle(t, 100, 0.6, 1.4), behind: (q) => paintEarth(q, {...c, pitch: (c.pitch ?? 0) - 0.56}, {seed: 8840})});
    paintSuited(p, c, AST_DEF, {at: [-0.15, -0.62, 0.4], view: 'back', helmet: 'off', t: G / 30, seed: 7201});
    const at: V3 = [0.35, -0.79, 0.55], opts = {at, view: 'back' as const, helmet: 'visor' as const, stripes: true, t: G / 30, seed: 7101};
    const probe = paintSuited(dry(p), c, CREW_DEF, opts), handle = camPoint(c, [AIRLOCK.hatchCentre[0] + 0.5, 0, 1.2]);
    if (!probe || !handle) { paintSuited(p, c, CREW_DEF, opts); return; }
    const side = Math.abs(probe.rShoulder[0] - handle[0]) <= Math.abs(probe.lShoulder[0] - handle[0]) ? 'r' : 'l';
    const arm = reachTo(side === 'r' ? probe.rShoulder : probe.lShoulder, probe.u, handle, 0.06);
    paintSuited(p, c, CREW_DEF, {...opts, [side]: arm});
  },
});

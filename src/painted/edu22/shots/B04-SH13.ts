import type {V3} from '../../kit/space';
import {demoCam, gripOf, lerpStrip, paintDemo, STRIP_A_LYING, stripAOver} from '../demo';
import {lerp, lerp3, ramp, track} from '../motion22';
import {DEMO_PAPER, makeShot, type Shot22} from '../shot';
import {sine01} from '../stage';

// B04-SH13 · G 886-972 (86 f) · can silver catch poison? (EDU-EP22-SCENES-R1). The placeless demo top (cool light): white dish, halved boiled egg,
// strip A lying beside it, strip B standing in the cup. The child's mitten (demo.ts `paintMitten`, yellow sleeve) enters from screen right-front
// l 20-34, pinches strip A at (-0.10, 0.002, +0.05) l 50 and lifts it above the left yolk by l 80 (tip (-0.02, 0.04, 0.00)).
const N = 86;
const LIFTED = stripAOver([-0.02, 0.04, 0]);
const OFF: V3 = [0.16, 0.06, 0.2], NEAR: V3 = [-0.02, 0.025, 0.09];
export const def: Shot22 = {
  id: 'B04-SH13', N, paper: DEMO_PAPER,
  cam: (L) => { const u = sine01(L / (N - 1)); return demoCam([0, 0.01, 0], lerp(15, 9, u), lerp(0.38, 0.33, u), -55, 1100, 960, 0.05); },
  paint: (p, L, c) => {
    const grip0 = gripOf(STRIP_A_LYING);
    if (L < 50) {
      const at = L < 20 ? undefined : track(L, [[20, OFF], [34, NEAR], [50, lerp3(grip0, [grip0[0], grip0[1] + 0.004, grip0[2]], 0)]]);
      paintDemo(p, c, {stripA: 'lying', tarnish: 0, hand: at ? {at, dir: 0.55} : undefined});
      return;
    }
    const pose = lerpStrip(STRIP_A_LYING, LIFTED, ramp(L, 52, 80));
    paintDemo(p, c, {stripA: pose, tarnish: 0, hand: {on: 'A'}});
  },
};
export const shot = makeShot(def);

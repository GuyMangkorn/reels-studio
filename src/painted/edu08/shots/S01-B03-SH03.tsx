import {camMove} from '../../kit/cam-moves';
import {camPoint} from '../../kit/ycam';
import type {Pt} from '../../kit/painter';
import {paintDropDiagram} from '../cards';
import {ease, mix, pw, ramp} from '../clock';
import {CHAMBER, paintChamberSepia, paintHose, SEPIA} from '../rooms';
import {TECH_DEF, paintSuited} from '../suit';
import {camAt} from '../stage';
import {makeShot} from '../shot';
import {DROP_KNOTS, dropPush} from './S01-B03-SH02';

// S01-B03-SH03 (G 728-907, R2) LF03 1966 chamber, the hose pops (L07). SD08: the frozen last frame of the drop card is cross-graded in-canvas to the sepia chamber over L0-12.
// Hose pops L128 (on "เสีย"), needle 100 -> 5 % over L128-148. cam: (0.00, 1.10, -0.80), yaw 10->4, r 2.6->2.0, eye 1.30, pitch 0, f 1000, hy 820. Ring paused.
const N = 179, cam = (L: number) => camAt(camMove([0, 1.1, -0.8], [10, 4], [2.6, 2.0], 1.3, {pitch: [0, 0], f: 1000, hy: 820}), L, N);
export const FREE_END: [number, number, number] = [CHAMBER.hose[0] + 0.12, 0.12, CHAMBER.hose[2] + 0.2];
export const shot = makeShot('S01-B03-SH03', {
  paper: SEPIA.paper,
  paint: (p, L, G) => {
    const c = cam(L), k = ease(L, 0, 12), t = G / 30;
    if (L < 12) { // the frozen card (last frame of SH02, push 1.08) under the grade
      const b = p.brush as unknown as {push: () => void; pop: () => void; translate: (x: number, y: number) => void; scale: (s: number) => void};
      b.push(); b.translate(540, 770); b.scale(dropPush(117)); b.translate(-540, -770);
      paintDropDiagram(p.layer(1 - k, 6000), pw(117, DROP_KNOTS));
      b.pop();
    }
    const q = p.layer(k, 100), pop = ramp(L, 128, 148);
    const s = paintChamberSepia(q, c, {lights: 1, needle: 1 - 0.95 * pop});
    const tech = paintSuited(s, c, TECH_DEF, {at: [0, 0, -0.8], view: 'back', helmet: 'round1966', t, seed: 7401});
    if (tech) {
      const port: Pt = [tech.feet[0] - 0.13 * tech.u, tech.feet[1] - 0.86 * tech.u], free = camPoint(c, FREE_END) ?? port, f = ease(L, 128, 138);
      paintHose(s, c, [mix(port[0], free[0], f), mix(port[1], free[1], f)], CHAMBER.hose);
    }
  },
});

import {camMove} from '../../kit/cam-moves';
import {camPoint} from '../../kit/ycam';
import {ease, mix} from '../clock';
import {CHAMBER, paintChamberSepia, paintHose, SEPIA} from '../rooms';
import {TECH_DEF, paintSuited} from '../suit';
import {camAt} from '../stage';
import {makeShot} from '../shot';
import {FREE_END} from './S01-B03-SH03';

// S01-B03-SH04 (G 907-1047, R2) he steps back, lights dim (L08). TECH steps back L9-57 (z -0.80 -> -0.50, back-view slide with a 2-step bob and +-2 deg sway), leaves frame
// left at ~L86-88 with the truck; lamps dim 100 -> 45 % over L91-135 (SD09). cam: (0.00,1.10,-0.80) -> (1.30,1.40,-2.20), yaw 4->-8, r 2.0->2.2, eye 1.30->1.40, pitch 0, f 1000, hy 820.
const N = 140, cam = (L: number) => camAt(camMove([[0, 1.1, -0.8], [1.3, 1.4, -2.2]], [4, -8], [2, 2.2], [1.3, 1.4], {pitch: [0, 0], f: 1000, hy: 820}), L, N);
export const shot = makeShot('S01-B03-SH04', {
  paper: SEPIA.paper,
  paint: (p, L, G) => {
    const c = cam(L), lights = 1 - 0.55 * ease(L, 91, 135), w = ease(L, 9, 57);
    const s = paintChamberSepia(p, c, {lights, needle: 0.05});
    const step = Math.abs(Math.sin(((L - 9) / 48) * Math.PI * 2)) * 0.025 * (L >= 9 && L < 57 ? 1 : 0);
    paintSuited(s, c, TECH_DEF, {at: [0, step, mix(-0.8, -0.5, w)], view: 'back', helmet: 'round1966', t: G / 30, seed: 7401, roll: 2 * Math.sin(L * 0.25) * (L >= 9 && L < 57 ? 1 : 0.3)});
    const free = camPoint(c, FREE_END), wall = camPoint(c, CHAMBER.hose);
    if (free && wall) paintHose(s, c, free, CHAMBER.hose);
  },
});

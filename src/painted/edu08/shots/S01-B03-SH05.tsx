import {camMove} from '../../kit/cam-moves';
import {ease} from '../clock';
import {paintChamberSepia, SEPIA} from '../rooms';
import {camAt} from '../stage';
import {makeShot} from '../shot';

// S01-B03-SH05 (G 1047-1127, R2) needle up, colour back (L09). Lamps 45 -> 100 % over L31-63, needle 5 -> 90 % over L39-65, sepia drains 0.62 -> 0.08 over L47-79.
// cam: (0.62, 1.45, -2.15), yaw 0->6, r 0.62->0.52, eye 1.48, pitch 0, f 1000, hy 820.
const N = 80, cam = (L: number) => camAt(camMove([0.62, 1.45, -2.15], [0, 6], [0.62, 0.52], 1.48, {pitch: [0, 0], f: 1000, hy: 820}), L, N);
export const shot = makeShot('S01-B03-SH05', {
  paper: SEPIA.paper,
  paint: (p, L) => { paintChamberSepia(p, cam(L), {lights: 0.45 + 0.55 * ease(L, 31, 63), needle: 0.05 + 0.85 * ease(L, 39, 65), u: 0.62 - 0.54 * ease(L, 47, 79)}); },
});

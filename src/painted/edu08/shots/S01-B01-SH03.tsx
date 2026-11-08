import {camMove} from '../../kit/cam-moves';
import {paintHelmetProp} from '../../kit/eva';
import {filmStripAt, paintFilmStrip} from '../cards';
import {helmetAt, helmetSpin} from '../clock';
import {FILM_BOX} from '../scenes';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B01-SH03 (G 101-233, R2) LF06 film strip, she floats (L02). Film-strip clock t = (30 + (L - 24) * 33 / 34) / 30 (pop-in L3, balloon pop L24, cross L34, out L52-58).
// cam: (0.00, 1.36, 0.55), yaw 20->12, r 2.30->2.05, eye 2.01, pitch -14, f 1100, hy 640.
const N = 132, cam = (L: number) => camAt(camMove([0, 1.36, 0.55], [20, 12], [2.3, 2.05], 2.01, {pitch: [-14, -14], f: 1100, hy: 640}), L, N);
export const shot = makeShot('S01-B01-SH03', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = G / 30;
    orbitBack(p, c, G);
    ast(p, c, G, {helmet: 'off', face: 'surprised', faceState: {mouth: 'flat'}, motion: {id: 'zero-g-drift', t}});
    paintHelmetProp(p, c, {at: helmetAt(G), spin: helmetSpin(G), glint: 0.4, seed: 8800});
    const s = filmStripAt((30 + ((L - 24) * 33) / 34) / 30);
    if (s.visible) paintFilmStrip(p, FILM_BOX, {tilt: -4, cross: s.cross, panels: s.panels, scale: s.scale, dx: s.dx});
  },
});

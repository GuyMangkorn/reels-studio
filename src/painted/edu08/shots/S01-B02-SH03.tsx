import {camMove} from '../../kit/cam-moves';
import {flaskAt, paintFlaskCard} from '../cards';
import {ease} from '../clock';
import {FLASK_BOX} from '../scenes';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B02-SH03 (G 416-503, R2) LF07 flask card (L05b). Flask clock t = max(0, 0.95 * L - 9) / 30: cutaway opens L19-29, heat bounces L48 and L73.
// cam: (0.00, 1.36, 0.55), yaw 10->16, r 2.8->2.6, eye 1.96, pitch -14, f 1100, hy 700, cx -160 in the sheet; Editor W5.3 -240 so the right arm clears the card edge (x 430).
const N = 87, cam = (L: number) => camAt(camMove([0, 1.36, 0.55], [10, 16], [2.8, 2.6], 1.96, {pitch: [-14, -14], f: 1100, hy: 700, cx: -240}), L, N);
export const shot = makeShot('S01-B02-SH03', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L);
    orbitBack(p, c, G);
    ast(p, c, G, {motion: {id: 'zero-g-drift', t: G / 30}, face: 'happy'});
    paintFlaskCard(p.layer(ease(L, 0, 6), 5000), FLASK_BOX, 9300, flaskAt(Math.max(0, 0.95 * L - 9) / 30));
  },
});

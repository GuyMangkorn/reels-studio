import {camMove} from '../../kit/cam-moves';
import {iceAt, paintIceShell, suitParts} from '../ice';
import {AST_DEF} from '../suit';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B02-SH02 (G 371-416, R2) ice-shell gag (L05a). Ice clock t = 0.95 * L / 30: creep L0-11, hold L11-15 (she looks down), crack L15-22, crumble L22-45; she looks back up (smug) at L26.
// cam: (0.00, 1.36, 0.55), yaw 35->42, r 2.6->2.4, eye 1.96, pitch -14, f 1100, hy 660.
const N = 45, cam = (L: number) => camAt(camMove([0, 1.36, 0.55], [35, 42], [2.6, 2.4], 1.96, {pitch: [-14, -14], f: 1100, hy: 660}), L, N);
export const shot = makeShot('S01-B02-SH02', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = (0.95 * L) / 30;
    orbitBack(p, c, G);
    const a = ast(p, c, G, {motion: {id: 'zero-g-drift', t: G / 30}, face: L < 8 ? 'neutral' : L < 26 ? 'suspicious' : 'smug'});
    if (a && iceAt(t).frost) paintIceShell(p, suitParts(a, AST_DEF), a.u, t);
  },
});

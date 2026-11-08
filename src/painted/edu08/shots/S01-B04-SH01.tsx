import {camMove} from '../../kit/cam-moves';
import {ease} from '../clock';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B04-SH01 (G 1127-1206, R2) held breath (silent beat L0-29, then L10a). P42, lips sealed, shoulders up 0.03 m, tremble +-1 deg at 6 Hz, roll 4, foot (-0.15, 0.40, 0.52); sun behind her, face in Earthshine.
// cam: (0.00, 1.36, 0.55), yaw -20->-12, r 1.65->1.50, eye 1.76, pitch -8, f 1100, hy 760.
const N = 79, cam = (L: number) => camAt(camMove([0, 1.36, 0.55], [-20, -12], [1.65, 1.5], 1.76, {pitch: [-8, -8], f: 1100, hy: 760}), L, N);
export const AST_B04: [number, number, number] = [-0.15, 0.4, 0.52];
export const shot = makeShot('S01-B04-SH01', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = G / 30;
    orbitBack(p, c, G, {at: AST_B04, earth: {warm: 0.3}});
    ast(p, c, G, {at: AST_B04, rim: 1, pose: 'P42', face: 'scared', faceState: {mouth: 'flat'}, tint: ['#7fb2e6', 0.18], roll: 4 + Math.sin(t * Math.PI * 2 * 6), fig: {rise: 0.03 * ease(L, 0, 6)}});
  },
});

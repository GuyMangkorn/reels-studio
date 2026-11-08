import {camMove} from '../../kit/cam-moves';
import {paintGlitterFx, glitterAtLips} from '../../kit/glitter';
import {ZG_NEUTRAL} from '../../kit/eva';
import {ease} from '../clock';
import {armMix, ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B03-SH01 (G 503-610, R2) LF02 glitter at the lips (silent beat L0-29, then L06a). Glove rises L0-15 to 0.12 m short of the mouth, lowers L36-49; glitter starts L12 (3 cm clear
// of the lips, never inside the mouth); silent "หืม?" L21-27. cam: (0.00, 1.51, 0.55), yaw 34->27, r 1.55->1.40, eye 1.71, pitch -5, f 1100, hy 800.
const N = 107, cam = (L: number) => camAt(camMove([0, 1.51, 0.55], [34, 27], [1.55, 1.4], 1.71, {pitch: [-5, -5], f: 1100, hy: 800}), L, N);
const RAISED = {to: [0.09, 0.04] as [number, number], via: [-0.02, -0.16] as [number, number], near: 0.15};
const LRAISED = {...ZG_NEUTRAL('l'), to: [0.07, -0.41] as [number, number]};
export const shot = makeShot('S01-B03-SH01', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = L / 30;
    orbitBack(p, c, G);
    const k = ease(L, 0, 15) * (1 - ease(L, 36, 49)), hmm = L >= 21 && L < 27;
    const a = ast(p, c, G, {view: 'front', quarter: 'right', face: 'worried', faceState: hmm ? {mouth: 'talk', open: 0.25 * Math.sin(((L - 21) / 6) * Math.PI)} : undefined,
      r: armMix(ZG_NEUTRAL('r'), RAISED, k), l: armMix(ZG_NEUTRAL('l'), LRAISED, ease(L, 0, 15))});
    if (a && L >= 12) paintGlitterFx(p, {o: glitterAtLips(a.lips, a.u), dir: [0.8, -0.6], n: 44, len: 0.4 * a.u, spread: 0.8, size: 8, t, life: 1.2, seed: 8610, emit: [12 / 30, Infinity]});
  },
});

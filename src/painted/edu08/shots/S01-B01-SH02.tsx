import {camMove} from '../../kit/cam-moves';
import {paintHelmetProp, type ArmM} from '../../kit/eva';
import {ease, helmetSH02, helmetSpin} from '../clock';
import {ZG_NEUTRAL} from '../suit';
import {armMix, ast, camAt, orbitBack} from '../stage';
import {makeShot, ringOpacity} from '../shot';

// S01-B01-SH02 (G 55-101, R2) the helmet leaves, silence (V01). V01 voiced L4-39 (gasp ~L4-20, word ~L23-39); L40 (G95) = the clear frame = the silence frame; true silence L40-45; ring fades in L38-46.
// cam: (0.00, 1.76, 0.60), yaw 25->30, r 1.9->1.8, eye 1.16, pitch +12->+16, f 1050, hy 1000.
const N = 46, cam = (L: number) => camAt(camMove([0, 1.76, 0.6], [25, 30], [1.9, 1.8], 1.16, {pitch: [12, 16], f: 1050, hy: 1000}), L, N);
const CLASP: ArmM = {to: [0.12, 0.04], via: [-0.01, -0.16], near: 0.15};
export const shot = makeShot('S01-B01-SH02', {
  paper: '#05070d',
  ringOpacity: (L) => ringOpacity(L, {inAt: 38, inFrames: 8}),
  paint: (p, L, G) => {
    const c = cam(L), t = G / 30;
    orbitBack(p, c, G);
    const bob = 0.03 * Math.sin((t * Math.PI * 2) / 6);
    // gasp (shock, chest lifts), then the word (talk), then lips sealed from L40 (scared, flat mouth)
    const face = L < 4 ? 'surprised' : L < 23 ? 'shock' : L < 40 ? 'talk' : 'scared';
    const faceState = L < 4 ? undefined : L < 23 ? {open: 0.4 - 0.2 * ease(L, 13, 22)} : L < 38 ? {open: 0.35 * (0.55 + 0.45 * Math.sin(L * 1.4))} : L < 40 ? {mouth: 'talk' as const, open: 0.08} : {mouth: 'flat' as const};
    ast(p, c, G, {at: [0, 0.42 + bob, 0.55], helmet: 'off', face, faceState, fig: {lean: -0.06 * (1 - ease(L, 0, 21)), rise: 0.03 * ease(L, 4, 15)}, r: armMix(CLASP, ZG_NEUTRAL('r'), ease(L, 0, 21)), l: ZG_NEUTRAL('l')});
    paintHelmetProp(p, c, {at: helmetSH02(L), spin: helmetSpin(G), glint: 0.3, seed: 8800});
  },
});

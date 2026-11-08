import {camMove} from '../../kit/cam-moves';
import {paintEarth} from '../../kit/earth';
import {paintHelmetProp, type ArmM} from '../../kit/eva';
import {ease} from '../clock';
import {paintModule, paintTruss} from '../orbit';
import {AST_AT} from '../scenes';
import {CREW_DEF, ZG_NEUTRAL, paintSuited} from '../suit';
import {ast, armMix, camAt, tetherFrom} from '../stage';
import {HELMET_HEAD} from '../clock';
import {makeShot} from '../shot';

// S01-B01-SH01 (G 0-55, R2) LF01 glove on the clasp (L01). cam: (-0.30, 1.00, 0.20), yaw 55->47, r 3.4->3.1, eye 1.90, pitch -16, f 1100, hy 620 (LF01 as built).
const N = 55, cam = (L: number) => camAt(camMove([-0.3, 1.0, 0.2], [55, 47], [3.4, 3.1], 1.9, {pitch: [-16, -16], f: 1100, hy: 620}), L, N);
const CLASP: ArmM = {to: [0.12, 0.04], via: [-0.01, -0.16], near: 0.15};
export const shot = makeShot('S01-B01-SH01', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = G / 30, bob = 0.03 * Math.sin((t * Math.PI * 2) / 6), at: [number, number, number] = [AST_AT[0], AST_AT[1] + bob, AST_AT[2]];
    paintEarth(p, c);
    paintModule(p, c, {t});
    paintTruss(p, c, {t, tether: {from: tetherFrom(AST_AT)}});
    // CREW: right glove to the handrail from L24 (arm blends over L12-24)
    paintSuited(p, c, CREW_DEF, {at: [-3.9, 0.12, 0.0], view: 'right', helmet: 'visor', stripes: true, t, seed: 7101, r: armMix({to: [0.12, -0.3], via: [0.04, -0.22], near: 0}, {to: [0.38, -0.1], via: [0.16, -0.2], near: 0}, ease(L, 12, 24))});
    const lifted = L > 43;
    ast(p, c, G, {at, helmet: lifted ? 'off' : 'bubble', face: L >= 28 ? 'surprised' : 'neutral', fig: {lean: -0.06}, r: CLASP, l: ZG_NEUTRAL('l')});
    if (lifted) paintHelmetProp(p, c, {at: [HELMET_HEAD[0], HELMET_HEAD[1] + bob + 0.05 * ease(L, 43, 55), HELMET_HEAD[2]], spin: 0, glint: 0.3, seed: 8800});
  },
});

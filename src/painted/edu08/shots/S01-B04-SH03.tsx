import {camMove, camMoveK, camOf} from '../../kit/cam-moves';
import {paintGlitterFx, glitterAtLips} from '../../kit/glitter';
import {ease} from '../clock';
import {ast, orbitBack} from '../stage';
import {makeShot} from '../shot';
import {AST_B04} from './S01-B04-SH01';

// S01-B04-SH03 (G 1340-1412, SHEETS-R2.4; R2-R2.3 1340-1398) LF04 the exhale reveal (signature move 2). Lips part L0-9; glitter stream L9-53 (the breath runs under
// L11 "ปล่อยลมหายใจออกมา…", voiced L24-60, and stops 7 f before its voiced end as in R2.3), drifting and thinning L53-72 (the same 19 f tail). cam: (0.30,1.46,0.90)->(0.45,1.46,1.20),
// yaw -60->-50, r 2.10->2.15, eye 1.81->3.01, pitch -12->-30, f 1100, hy 740->560, cx 150, ease [0.2, 1.0], same path over 72 f (R2.4: was 58 f, 0.81x the speed).
const N = 72, MOVE = camMove([[0.3, 1.46, 0.9], [0.45, 1.46, 1.2]], [-60, -50], [2.1, 2.15], [1.81, 3.01], {pitch: [-12, -30], f: 1100, hy: 740, cx: 150, ease: [0.2, 1.0]});
const cam = (L: number) => { const u = L / N; return {...camOf(MOVE, u), hy: 740 + (560 - 740) * camMoveK(MOVE, u)}; };
export const shot = makeShot('S01-B04-SH03', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = L / 30, parted = ease(L, 0, 9);
    orbitBack(p, c, G, {at: AST_B04, earth: {warm: 0.6, glow: 0.7}});
    const a = ast(p, c, G, {at: AST_B04, view: 'right', rim: 1, face: 'neutral', faceState: parted > 0.5 ? {mouth: 'o', open: 0.2, eyes: 'half'} : {mouth: 'flat'}, tint: ['#7fb2e6', 0.18], roll: 4, fig: {lean: 0.08},
      r: {to: [0.3, -0.33], via: [0.09, -0.24]}});
    if (a) paintGlitterFx(p, {o: glitterAtLips(a.lips, a.u), dir: [0.82, 0.57], n: 560, len: 820, spread: 0.3, size: 11, t, life: 2.0, seed: 8620, emit: [9 / 30, 53 / 30]});
  },
});

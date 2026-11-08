import {camMove} from '../../kit/cam-moves';
import {Stamp} from '../../kit/screen';
import {stampState} from '../../kit/stamp';
import {AST_AT} from '../scenes';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B02-SH01 (G 293-371, R2) pat-check (L04). pat-check clock t = (0.95 * L + 6) / 30: chest pats L7, L19; glove to arm L38, L54; shoulders drop L70; worried -> neutral from L43.
// cam: (0.00, 1.36, 0.55), yaw -15->-6, r 2.1->1.9, eye 1.91, pitch -12, f 1100, hy 680. The "สมมติ" stamp finishes fading in the first 6 f (G293-299).
const N = 78, cam = (L: number) => camAt(camMove([0, 1.36, 0.55], [-15, -6], [2.1, 1.9], 1.91, {pitch: [-12, -12], f: 1100, hy: 680}), L, N);
const AT: [number, number, number] = [AST_AT[0] - 0.04, AST_AT[1], AST_AT[2]];
export const shot = makeShot('S01-B02-SH01', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L);
    orbitBack(p, c, G, {at: AT});
    ast(p, c, G, {at: AT, motion: {id: 'pat-check', t: (0.95 * L + 6) / 30}});
  },
  overlay: (L) => { const s = stampState(L + 21, {land: 7, fadeAt: 21}); return L < 6 && s.visible ? <Stamp scale={s.scale} opacity={s.opacity} /> : null; },
});

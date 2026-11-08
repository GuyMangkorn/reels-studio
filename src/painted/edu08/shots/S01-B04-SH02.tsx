import {camMove} from '../../kit/cam-moves';
import {chestAt, paintChestOutline} from '../cards';
import {pw} from '../clock';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';
import {AST_B04} from './S01-B04-SH01';

// S01-B04-SH02 (G 1206-1340, R2) chest outline (L10b). Chest clock t through (L, t): (0,0) (16,.5) (30,.6) (47,1.5) (79,2.6) (107,3.45) (112,3.6) (129,4.1) (134,4.27); no organs, no lungs; glow <= 0.3 once.
// cam: (0.00, 1.36, 0.55), yaw 4->-4, r 2.10->1.85, eye 1.86, pitch -10, f 1100, hy 700.
const N = 134, cam = (L: number) => camAt(camMove([0, 1.36, 0.55], [4, -4], [2.1, 1.85], 1.86, {pitch: [-10, -10], f: 1100, hy: 700}), L, N);
export const CHEST_KNOTS = [[0, 0], [16, 0.5], [30, 0.6], [47, 1.5], [79, 2.6], [107, 3.45], [112, 3.6], [129, 4.1], [134, 4.27]] as const;
export const shot = makeShot('S01-B04-SH02', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = G / 30;
    orbitBack(p, c, G, {at: AST_B04});
    const a = ast(p, c, G, {at: AST_B04, rim: 1, pose: 'P42', face: 'scared', faceState: {mouth: 'flat'}, tint: ['#7fb2e6', 0.18], roll: 4 + Math.sin(t * Math.PI * 2 * 6) * (L < 60 ? 1 : 0.5)});
    if (a) paintChestOutline(p, [(a.rShoulder[0] + a.lShoulder[0]) / 2, (a.rShoulder[1] + a.lShoulder[1]) / 2 + 0.22 * a.u], a.u, pw(L, CHEST_KNOTS));
    void chestAt;
  },
});

import {ell, hardFill, inkLine, washAt} from '../../kit/draw';
import {lin, mix, sine} from '../clock';
import {C, lookAtCam} from '../palette';
import {makeShot} from '../stage';
import {camPoint, camUnit} from '../../kit/ycam';
import {armsFor, visorHand, visorPoints} from '../hose';
import {M0} from '../yard';
import {paintYardShot} from '../yardshot';

// S01-B02-SH02 (G 353-380, 27 f; R1.2) the sky (W-SKY; sheet EDU-EP17-SHEETS-R1.1, SD12, SD25; W7 P30 visor hand). Cut on action: his left hand rises into P30 visor L0-8; suspicious squint;
// a tiny satellite (<= 14 px) at (860, 260) blinks once L12-15; at L24 a 12 px bubble seed appears at that spot. Low camera in front-left looking up;
// 6 % push (f 900 -> 954) and tilt-up (hy 1240 -> 1270) over L0-27.
const N = 27;
const cam = (L: number) => { const u = sine(L, 0, N); return lookAtCam([-0.80, 0.95, -0.85], [0, 1.55, 0], mix(900, 954, u), mix(1150, 1180, u), 0, 0.05); };
/** The W-SKY satellite: a 14 px body with two panel wings, screen space (it is a speck in the sky, no world size claimed); `blink` 0..1. */
const satellite = (p: Parameters<typeof hardFill>[0], x: number, y: number, blink: number) => {
  hardFill(p, 8900, '#5a6878', [[x - 7, y - 2], [x - 2, y - 2], [x - 2, y + 2], [x - 7, y + 2]]);
  hardFill(p, 8901, '#5a6878', [[x + 2, y - 2], [x + 7, y - 2], [x + 7, y + 2], [x + 2, y + 2]]);
  hardFill(p, 8902, '#d8dde2', ell(x, y, 2.4, 2.4, 8));
  if (blink > 0) { washAt(p, 8903, '#ffffff', 160 * blink, ell(x, y, 14 * blink + 3, 14 * blink + 3, 12), 0.2, 0); hardFill(p, 8904, '#ffffff', ell(x, y, 3 + 2 * blink, 3 + 2 * blink, 8)); }
};
export const shot = makeShot('S01-B02-SH02', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const c = cam(L), w = sine(L, 0, 8);
    paintYardShot(p, c, {t: L / 30, arms: ['P09', 'visor', w], hose: {state: 'flow', amt: 1}, facing: [0, -1], face: 'suspicious', faceState: {look: [0.5, -0.6], squint: 0.5}});
    // P30 visor (R1.1 fix list): flat palm-down mitten over the screen-right eye, painted over the rig once the arm is past halfway up
    const g = camPoint(c, M0), u = camUnit(c, M0);
    if (g && w >= 0.5) {
      const A = armsFor('P09', g, u).lArm, {E, W} = visorPoints(g, u), from = A.via ?? A.to;
      visorHand(p, [mix(from[0], E[0], w), mix(from[1], E[1], w)], [mix(A.to[0], W[0], w), mix(A.to[1], W[1], w)], u, (w - 0.5) / 0.5);
    }
    satellite(p, 860, 260, L >= 12 && L < 16 ? Math.sin(lin(L, 12, 16) * Math.PI) : 0);
    if (L >= 24) { const r = 6 * Math.min(1, lin(L, 24, 26) * 1.2); hardFill(p, 8910, C.bubFill, ell(860, 260, r, r, 12)); inkLine(p, 8911, ell(860, 260, r, r, 12), {color: C.bubEdge, weight: 1, still: true}); }
  },
});

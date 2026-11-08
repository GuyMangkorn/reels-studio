import {ease, lenOf, pestleStroke, ramp} from '../clock';
import {makeShot} from '../shot';
import {orbit, paintSoi} from '../soi';

// S01-B01-SH01 (G0-33): the sunny soi, whip-tilt (L01a). POSE_A at L0 (identical to the loop's last frame G1797), push az 23 -> 22, r 3.70 -> 3.60, then the 8 f
// tilt pitch 5 -> 30 deg over L25-33 (ease-in, SD02): the cut is on the motion into empty bright sky.
const ID = 'S01-B01-SH01', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1), u = ramp(L, 25, 33); return orbit([0.5, 1.05, -0.4], 23 - e, 3.7 - 0.1 * e, 1.3, 5 + 25 * u * u, 1480, 770); };

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => { paintSoi(p, cam(L), {t: G / 30, stroke: pestleStroke(G)}); },
});

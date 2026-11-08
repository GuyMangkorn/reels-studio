import {ease, G_SEAM, lenOf, pestleStroke} from '../clock';
import {Motes} from '../overlay';
import {makeShot} from '../shot';
import {orbit, paintSoi} from '../soi';

// S01-B05-SH02 (G1400-1463): sunlight on the arm (L14a). Day, the real present, no card. Insert of CUS's near forearm resting on his knee, anchor T-ARM (1.27, 0.58, 0.45):
// camera orbit(T-ARM, az 30 -> 32, r 0.62 -> 0.58, eye 0.70, pitch 0, f 1050, hy 800); dust motes in the sun. Ambient clocks run on the seam clock G - 1579.
const ID = 'S01-B05-SH02', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return orbit([1.27, 0.58, 0.45], 30 + 2 * e, 0.62 - 0.04 * e, 0.7, 0, 1050, 800); };

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => { paintSoi(p, cam(L), {t: (G - G_SEAM) / 30, stroke: pestleStroke(G - G_SEAM), strokeK: 0.68}); },
  overlay: (L) => <Motes L={L} />,
});

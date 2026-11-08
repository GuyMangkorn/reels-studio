import {ease, G_SEAM, lenOf, pestleStroke} from '../clock';
import {makeShot} from '../shot';
import {orbit, paintSoi, POSE_A} from '../soi';
import type {YCam} from '../../kit/ycam';

// S01-B05-SH03 (G1463-1580): back to frame 0 (L14b, tail). SD10 camera orbit((0.50, 1.05, -0.40), az 19 -> 23, r 3.50 -> 3.70, eye 1.30, pitch 5, f 1480, hy 770), ease-out over
// L0-87, then exactly POSE_A, still, L87-117. Every ambient clock runs on G - 1579 (R09, B_loop), so the last frame G1579 is the first frame G0.
const ID = 'S01-B05-SH03', N = lenOf(ID);
const cam = (L: number): YCam => {
  if (L >= 87) return POSE_A;
  const e = Math.sin((Math.PI / 2) * (L / 87));
  return orbit([0.5, 1.05, -0.4], 19 + 4 * e, 3.5 + 0.2 * e, 1.3, 5, 1480, 770);
};
void N; void ease;

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => { paintSoi(p, cam(L), {t: (G - G_SEAM) / 30, stroke: pestleStroke(G - G_SEAM)}); },
});

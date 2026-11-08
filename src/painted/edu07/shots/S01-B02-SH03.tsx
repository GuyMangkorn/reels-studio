import {ease, lenOf, pestleStroke} from '../clock';
import {Card} from '../overlay';
import {makeShot} from '../shot';
import {orbit, paintSoi} from '../soi';

// S01-B02-SH03 (G342-395): VEN grins (D02 "พรุ่งนี้ร้อนกว่านี้อีก"). SD04 close orbit((0.20, 1.30, -0.86), az 18 -> 14, r 1.70 -> 1.58, eye 1.35, f 1050, hy 740).
// She pounds on P(G) (contacts G347, 365, 383), eyes and head toward +x (CUS is off screen right), `talk` on L3-48.
const ID = 'S01-B02-SH03', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return orbit([0.2, 1.3, -0.86], 18 - 4 * e, 1.7 - 0.12 * e, 1.35, 0, 1050, 740); };

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    paintSoi(p, cam(L), {t: G / 30, stroke: pestleStroke(G), ven: {face: 'happy', faceState: {look: [0.9, 0], brow: 'up'}, fig: {headCock: 5}, motion: L >= 3 && L < 49 ? {id: 'talk', t: (L - 3) / 30} : undefined}});
  },
  overlay: (_L, G) => <Card G={G} />,
});

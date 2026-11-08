import {ease, lenOf, pestleStroke} from '../clock';
import {nearCam} from '../cast';
import {Card} from '../overlay';
import {makeShot} from '../shot';
import {CUS_AT, orbit, paintSoi} from '../soi';

// S01-B02-SH02 (G272-342): CUS fans himself (D01 "ร้อนจังวันนี้", take kept). SD03 close orbit((1.42, 1.00, 0.30), az 10 -> 14, r 1.60 -> 1.52, eye 1.05, f 1050, hy 800).
// His right hand (screen left) holds a folded paper menu near his face, 3 flaps/s from L6; `talk` from L4. The card is visible (07:49 -> 07:28) in the picture-stage layer.
const ID = 'S01-B02-SH02', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return orbit([1.42, 1.0, 0.3], 10 + 4 * e, 1.6 - 0.08 * e, 1.05, 0, 1050, 800); };

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const c = cam(L), fl = L >= 6 ? Math.sin((2 * Math.PI * 3 * (L - 6)) / 30) : 0;
    const to = nearCam(c, CUS_AT, -0.2, 1.1 + 0.05 * fl, 0.24);
    paintSoi(p, c, {t: G / 30, stroke: pestleStroke(G), cus: {face: 'tired', hands: {r: {to, out: -1}}, fan: 0.5 * fl, motion: L >= 4 ? {id: 'talk', t: (L - 4) / 30} : undefined}});
  },
  overlay: (_L, G) => <Card G={G} />,
});

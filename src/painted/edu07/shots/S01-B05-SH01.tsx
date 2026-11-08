import {ease, lenOf} from '../clock';
import {makeShot} from '../shot';
import {CUS_AT, orbit, paintSoi, STOOL2_NIGHT} from '../soi';

// S01-B05-SH01 (G1518-1618): the sky full of stars (L13). SD09 camera orbit((0.50, 1.05, -0.40), az 23 -> 18, r 3.70, eye 1.30, pitch 0 -> 35, f 1150, hy 900). The +1 h stall
// stays still: the two seated, back to the lens, small at the bottom, then the tilt lifts them out of the frame; dense star field with a faint Milky Way wash, Jupiter among
// them, the Moon's dark disc. No card.
const ID = 'S01-B05-SH01', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return orbit([0.5, 1.05, -0.4], 23 - 5 * e, 3.7, 1.3, 35 * e, 1150, 900); };

export const shot = makeShot(ID, {
  paper: '#101a38',
  paint: (p, L, G) => {
    paintSoi(p, cam(L), {t: G / 30, night: 1, stroke: 0, stool2: STOOL2_NIGHT, moon: 0, rim: 0.15, milky: 1, jupiter: 1,
      ven: {at: STOOL2_NIGHT, view: 'back', pose: 'P31', pounding: false, front: true}, cus: {at: CUS_AT, view: 'back', pose: 'P31'}});
  },
});

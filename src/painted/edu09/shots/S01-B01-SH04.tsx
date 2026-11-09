import {D01_LAMP_Y, SH04_MOVE} from '../scenes';
import {stopSitters} from '../tracks';
import {RoomOverlay, camAt, diningPaint, makeShot} from '../stage';

// S01-B01-SH04 (G 283-351) the stop (L03). cam: T-PAIR-L03 (SH04_MOVE), lampY 1.85 (Boss carry-over). ELDER's head shake L30-40 (`nod` dx, two swings); BOY worried -> neutral at L40.
const N = 68, cam = (L: number) => camAt(SH04_MOVE, L, N);
export const shot = makeShot('S01-B01-SH04', {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const s = stopSitters(L), shake = L >= 30 && L <= 40 ? 0.09 * Math.sin(((L - 30) / 5) * Math.PI * 2) : 0;
    diningPaint(p, cam(L), G / 30, s.boy, {...s.elder, fig: {nod: [shake, 0]}}, D01_LAMP_Y);
  },
  overlay: (L) => <RoomOverlay cam={cam(L)} lampY={D01_LAMP_Y} />,
});

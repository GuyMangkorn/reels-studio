import {Flash} from '../../kit/glow';
import {paintRace, raceFlash} from '../gw';
import {Frame} from '../overlay';
import {makeShot} from '../shot';

// S01-B03-SH03 (G751-903): the race to Earth (L07a). A violet ripple front and a gold flash front travel left to right toward a tiny Earth at x 6.0 gu: ripple on L77 ("มาถึง"),
// flash on L83, in that order; the camera trucks x 0.5 -> 5.6 with the fronts (ease-out, arriving L77) and is static after. Both pass Earth and fade by L120.
export const shot = makeShot('S01-B03-SH03', {
  paper: '#05081a',
  paint: (p, L) => { paintRace(p, L); },
  overlay: (L) => <Frame><Flash level={raceFlash(L)} fadeY={1100} /></Frame>,
});

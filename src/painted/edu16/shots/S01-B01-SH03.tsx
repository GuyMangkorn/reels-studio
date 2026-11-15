import {ease} from '../clock';
import {paintSH03} from '../scenes-roof';
import {makeShot} from '../shot';
import {roofState} from '../stage';

// S01-B01-SH03 L02 [119, 163) (sheet #3). Camera camSH03 (W3 v8, approved), held. HAND_SH03 (pianist hand, curled-finger seam sealed episode-locally):
// the fingertip comes down from 3 cm to 1 cm above the button over +0..+4 and stops dead at +4 (on "อย่า"), still to the end; grade cool 0.25. The
// approved still is the stopped hand (+4 onward); the blip position stays the W3 still's (0.6).
export const shot = makeShot('S01-B01-SH03', {
  paper: '#1c2130',
  paint: (p, L, G) => {
    paintSH03(p, {off: [0, 0.02 * (1 - ease(L, 0, 4)), 0], state: roofState('S01-B01-SH03', G, {blip: 0.6})});
  },
});

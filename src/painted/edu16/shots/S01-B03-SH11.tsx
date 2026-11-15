import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState} from '../stage';
import {SH10_A, SH10_B} from './S01-B03-SH10';

// S01-B03-SH11 W-STOP [675, 731) (sheet #11). SH10's end camera held still (the boundary marks the beat; no visible cut). The trace is flat from +0; the
// next spike would be f693 (+18) and never comes; the flat line's glow dims 30 % over +18..+24 (blip clock `traceLevelAt`); nothing else changes.
export const shot = makeShot('S01-B03-SH11', {
  paper: RF.zen,
  paint: (p, _L, G) => {
    paintRoofWoman(p, orbitMix(SH10_A, SH10_B, 1), roofState('S01-B03-SH11', G), {fall: [1130, 115]});
  },
});

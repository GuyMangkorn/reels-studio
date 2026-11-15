import {RF} from '../roof';
import {camSH01} from '../scenes-roof';
import {makeShot} from '../shot';
import {ease, ramp} from '../clock';
import {paintRoofWoman, roofState} from '../stage';

// S01-B01-SH01 W-PING [0, 30) (sheet EDU-EP16-SHEETS-R2 #1). Camera = LF-ROOF's camSH01 (W3 v9, approved), k 0 -> 0.25 (r 1.20 -> 1.15) eased over
// +0..+29. Staging = LF-ROOF (her side-on at SH01_AT, finger about 5 cm above the lit button, left mitten on her knee); frame +0 is the approved look.
// +0 the spike is up (blip clock n 0); +8 her small gasp: shoulders lift 1 cm and the grin opens (rise and mouth ease in over +6..+10, settle by +20).
export const shot = makeShot('S01-B01-SH01', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const gasp = ramp(L, 6, 10) * (1 - 0.5 * ramp(L, 12, 20));
    paintRoofWoman(p, camSH01(0.25 * ease(L, 0, 29)), roofState('S01-B01-SH01', G), {
      w: {t: 0.4 + G / 30, ...(gasp > 0 ? {fig: {rise: 0.01 * gasp}, faceState: {mouth: 'grin' as const}} : {})},
    });
  },
});

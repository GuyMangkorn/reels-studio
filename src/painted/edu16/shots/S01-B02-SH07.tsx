import {ease, ramp} from '../clock';
import {TH} from '../palette';
import {paintSH07Back, paintSH07Bust, paintSH07Mist} from '../scenes-roof';
import {makeShot} from '../shot';
import {paintFrameRim} from '../thought';

// S01-B02-SH07 L05 IM1 ageing [400, 489) (sheet #7). Camera camSH07 (W3, approved stills) with the slow lateral slide cx 110 -> 90 over +0..+88; void
// thCam(0, 0.25); her light (200, 1075), the star (300, 250). Beads on the thread: warm leaves her light +4 and reaches the star +37 (up), cold comes
// back +37..+73 and touches her light at +73. Ageing on the return bead's clock: a21 to +44, dissolve to a50 over +44..+52 (p.layer), hold, dissolve to
// a81 over +62..+70. The W3 stills (paintSH07Age) are these layers with their own bead positions.
export const shot = makeShot('S01-B02-SH07', {
  paper: TH.void,
  paint: (p, L, G) => {
    const t = 0.4 + G / 30, cx = 110 - 20 * ramp(L, 0, 88);
    const up = L >= 4 && L < 37, down = L >= 37 && L <= 73;
    const bead = up ? {k: ease(L, 4, 37), warm: true} : down ? {k: 1 - ease(L, 37, 73), warm: false} : null;
    paintSH07Back(p, {t, bead, shadowFrom: up ? bead!.k : 1});
    const k50 = ease(L, 44, 52), k81 = ease(L, 62, 70);
    if (k50 < 1) paintSH07Bust(p, 'a21', {t, cx});
    if (k50 > 0 && k81 < 1) paintSH07Bust(k50 < 1 ? p.layer(k50, 7000) : p, 'a50', {t, cx});
    if (k81 > 0) paintSH07Bust(k81 < 1 ? p.layer(k81, 8000) : p, 'a81', {t, cx});
    paintSH07Mist(p);
    paintFrameRim(p, {t}); // the bubble rim of every imagination shot (the approved W3 stills carry it)
  },
});

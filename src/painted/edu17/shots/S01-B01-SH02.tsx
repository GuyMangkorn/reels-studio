import {mixYCam} from '../../kit/ycam';
import {lin, mix, sine} from '../clock';
import {lookAtCam} from '../palette';
import {paintEntrySplash, paintSignal, S_CURL} from '../signal';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B01-SH02 (G 102-132, 30 f; R1.2) the line dives into the sea (L02a; sheet EDU-EP17-SHEETS-R1.0, SD03). The line's head runs from its curl over the wall along
// the beach (about 6 m/s) L7-27 and enters the water at (-0.6, -1.5, -14) with a splash ring L27-33; MAN SPRAY, small bottom-left (404 px exception), out
// of frame left by about L20. Camera cranes forward and down along the line over L0-33. Paints to L33; under the R1.2 start-at-cut dissolve G132-138 it runs L30-32 and holds L32 (stage clamp).
// the two sheet keys blended as cameras (position, yaw, pitch), not by their look-at points
const K0 = lookAtCam([1.4, 3.4, 2.8], [-0.3, 0, -6], 1000, 700, -16), K1 = lookAtCam([1.1, 3.0, 1.2], [-0.6, -1.5, -14], 1000, 700, -12);
const cam = (L: number) => mixYCam(K0, K1, sine(L, 0, 33));
export const shot = makeShot('S01-B01-SH02', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const s = mix(S_CURL, 1, sine(L, 7, 27) * 0.4 + lin(L, 7, 27) * 0.6), c = cam(L);
    paintYardShot(p, c, {t: L / 30, arms: 'hose-water', hose: {state: 'spray', amt: 1, lHold: true}, view: 'back', layer: (q, cc, slot) => paintSignal(q, cc, {s, t: L / 30}, slot)});
    if (L >= 27) paintEntrySplash(p, c, lin(L, 27, 33));
  },
});

import {lin, mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B06-SH03 (G 1579-1618, 39 f) still talking (L19a; sheet EDU-EP17-SHEETS-R1.2). new: hose-water again, SPRAY back on (thumb over) from L0; laugh L0-20
// -> happy and talking to the phone; the sister laughs on screen. Warm light. Camera 4 deg arc (yaw 126 -> 122) over L0-39 (R1.2: optional N 42 -> 39 applied).
const N = 39;
const cam = (L: number) => sheetCam([0, 1.25, 0], mix(126, 122, sine(L, 0, N)), 2.15, 1.45, {f: 1000, hy: 700});
export const shot = makeShot('S01-B06-SH03', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    paintYardShot(p, cam(L), {t: L / 30, light: {warm: 0.35}, arms: ['P09', 'hose-water', sine(L, 0, 6)], hose: {state: 'spray', amt: lin(L, 1, 7), lHold: true},
      facing: [-0.1, -1], face: L < 20 ? 'laugh' : 'talk', faceState: {look: [-0.6, 0.3]}});
  },
});

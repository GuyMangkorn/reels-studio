import {lin, mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B03-SH03 (G 660-702, 42 f; R1.2) "แค่นี้เองเหรอ?" (V02; sheet EDU-EP17-SHEETS-R1.0). new: hose-pinch: both hands lift the end to chest height L0-5, the left thumb
// and forefinger pinch it at L5; the flow sputters out L5-15 (FLOW -> STOP); surprised, eyebrows up. Camera 5 % push (r 1.55 -> 1.47) over L0-42.
const N = 42;
const cam = (L: number) => sheetCam([0.05, 1.30, 0], 123, mix(1.55, 1.47, sine(L, 0, N)), 1.45, {f: 1000, hy: 740});
export const shot = makeShot('S01-B03-SH03', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    paintYardShot(p, cam(L), {t: L / 30, arms: ['hose-flow', 'hose-pinch', sine(L, 0, 5)], hose: L < 5 ? {state: 'flow', amt: 1, lHold: true} : {state: 'pinch', amt: 1 - lin(L, 5, 15)},
      facing: [0, -1], face: 'surprised', faceState: {look: [0.15, 0.45]}});
  },
});

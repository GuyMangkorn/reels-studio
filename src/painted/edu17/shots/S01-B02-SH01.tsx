import {lin, mix3, sine} from '../clock';
import {lookAtCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B02-SH01 (G 288-353, 65 f) why not satellites? (L04; sheet EDU-EP17-SHEETS-R1.2, SD13). P09 hands on hips, the right fist holds the flowing end at
// the hip (FLOW); shake-head L4-22; worried; the trawler drifts +x 0.3 m/s. Camera: high from behind-right, 8 deg arc about M0 + 6 % push over L0-65 (R1.2: N 84 -> 65).
const N = 65;
const cam = (L: number) => lookAtCam(mix3([1.3, 2.6, 2.6], [0.87, 2.6, 2.59], sine(L, 0, N)), [-1.5, 0.5, -6], 1000, 560);
export const shot = makeShot('S01-B02-SH01', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const shake = 0.32 * Math.sin(((L - 4) / 18) * Math.PI * 3) * (L >= 4 && L <= 22 ? Math.sin(lin(L, 4, 22) * Math.PI) : 0);
    paintYardShot(p, cam(L), {t: L / 30, drift: 0.3, arms: 'P09', hose: {state: 'flow', amt: 1}, view: 'back', headYaw: shake, face: 'worried'});
  },
});

import type {V3} from '../../kit/space';
import {mix, sine} from '../clock';
import {lookAtCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B04-SH03 (G 853-881, 28 f; R1.2) "เอ๊ะ?" (V03; sheet EDU-EP17-SHEETS-R1.0). Turn-head-right L0-20: back of head -> profile by L10 (on "เอ๊ะ"), worried as the
// profile comes round; STOP end in the right fist. Camera: 5 deg arc about M0 (yaw +5) over L0-28.
const N = 28;
const rot = (v: V3, a: number): V3 => [v[0] * Math.cos(a) + v[2] * Math.sin(a), v[1], -v[0] * Math.sin(a) + v[2] * Math.cos(a)];
const cam = (L: number) => { const a = (-5 * Math.PI / 180) * sine(L, 0, N); return lookAtCam(rot([0.42, 1.78, 1.25], a), rot([1.5, 0, -60], a), 1000, 700); };
export const shot = makeShot('S01-B04-SH03', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const h = sine(L, 0, 10), b = sine(L, 4, 20);
    paintYardShot(p, cam(L), {t: L / 30, arms: 'P09', hose: {state: 'stop', amt: 0}, facing: [mix(0, 0.75, b), -1], headYaw: 0.6 * h, face: h > 0.5 ? 'worried' : 'neutral', faceState: {look: [0.7, -0.1]}});
  },
});

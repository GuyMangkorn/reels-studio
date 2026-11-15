import {mix, sine} from '../clock';
import {lookAtCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B04-SH01 (G 702-729, 27 f) the dark open sea (L09; sheet EDU-EP17-SHEETS-R1.2). P09, STOP end in the right fist; peering past the boats at the dark
// open-sea band. Over-the-shoulder from behind his right side; 6 % push (f 1000 -> 1060) over L0-27 (R1.2: optional N 28 -> 27 applied).
const N = 27;
const cam = (L: number) => lookAtCam([0.40, 1.78, 1.30], [-30, 0, -600], mix(1000, 1060, sine(L, 0, N)), 600);
export const shot = makeShot('S01-B04-SH01', {
  paper: '#a9cfe6',
  paint: (p, L) => { paintYardShot(p, cam(L), {t: L / 30, arms: 'P09', hose: {state: 'stop', amt: 0}, view: 'back', headYaw: -0.12}); },
});

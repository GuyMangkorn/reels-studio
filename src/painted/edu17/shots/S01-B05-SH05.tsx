import {mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B05-SH05 (G 1364-1388, 24 f; R1.2) "oh, the anchor" (gap after L15; sheet EDU-EP17-SHEETS-R1.0). Surprised, eyebrows up L0-6; glance toward the boats
// (turn-head-right) L6-18, held; P09 + STOP. LBL / grade off from L0 (timeline). Camera 4 deg arc (yaw 123 -> 127) over L0-24.
const N = 24;
const cam = (L: number) => sheetCam([0.05, 1.25, 0], mix(123, 127, sine(L, 0, N)), 1.91, 1.42, {f: 1000, hy: 760});
export const shot = makeShot('S01-B05-SH05', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const g = sine(L, 6, 18);
    paintYardShot(p, cam(L), {t: L / 30, arms: 'P09', hose: {state: 'stop', amt: 0}, facing: [mix(0, 0.45, g), -1], face: 'surprised', faceState: {look: [mix(0, 0.8, g), -0.1]}});
  },
});

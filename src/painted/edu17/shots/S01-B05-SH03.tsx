import {mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B05-SH03 (G 1207-1252, 45 f) sounds deliberate (L15a; sheet EDU-EP17-SHEETS-R1.2, SD09, SD35). Medium-close, suspicious, eyes narrowed at the phone
// (screen-left); P09 with the STOP end in the right fist. Normal colour (LBL from the timeline). Camera 5 % push (r 1.40 -> 1.33) over L0-45 (SD35: holds his look through the 18.6 f pause, N 38 -> 45).
const N = 45;
const cam = (L: number) => sheetCam([0, 1.45, 0], 125, mix(1.40, 1.33, sine(L, 0, N)), 1.30, {f: 1000, hy: 640});
export const shot = makeShot('S01-B05-SH03', {
  paper: '#a9cfe6',
  paint: (p, L) => { paintYardShot(p, cam(L), {t: L / 30, arms: 'P09', hose: {state: 'stop', amt: 0}, facing: [-0.15, -1], face: 'suspicious', faceState: {look: [-0.75, 0.35], squint: 0.6}}); },
});

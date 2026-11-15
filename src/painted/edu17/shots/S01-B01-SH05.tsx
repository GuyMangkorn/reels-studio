import {lin, mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B01-SH05 (G 229-288, 59 f; R1.2) "ห๊ะ? ใต้ทะเล?" (V01; sheet EDU-EP17-SHEETS-R1.0, SD16 = LF01R). L0 thumb off: SPRAY -> FLOW (last dribble L0-6, the end
// drops to the waist); neutral -> surprised on L6; looks down at the phone (screen-left of him) L6-20; turns his head over his left shoulder toward
// the open sea L30-40, held. Camera LF01R -> 6 % push and 4 deg arc over L0-59.
const N = 59;
const cam = (L: number) => { const u = sine(L, 0, N); return sheetCam([0.05, 1.2, 0], mix(124, 120, u), mix(4.2, 3.95, u), 1.85, {f: 2500, hy: 720, pitch: -8}); };
export const shot = makeShot('S01-B01-SH05', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const turn = sine(L, 30, 40), toPhone = sine(L, 6, 14) * (1 - sine(L, 22, 30));
    paintYardShot(p, cam(L), {
      t: L / 30, arms: ['hose-water', 'hose-flow', sine(L, 0, 6)],
      hose: L < 3 ? {state: 'spray', amt: 1 - lin(L, 0, 3), lHold: true} : {state: 'flow', amt: lin(L, 2, 10), lHold: true},
      facing: [mix(0, -0.5, turn), -1], face: L < 6 ? 'neutral' : 'surprised',
      faceState: {look: [mix(-0.55 * toPhone, -0.7, turn), mix(0.35 * toPhone, -0.1, turn)]},
    });
  },
});

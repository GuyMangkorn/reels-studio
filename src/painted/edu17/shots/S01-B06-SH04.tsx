import {mix, outCubic} from '../clock';
import {sheetCam} from '../palette';
import {paintSignal, S_WATER} from '../signal';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B06-SH04 (G 1618-1709, 91 f; R1.2) the line goes around (L19b + W-HOLD; sheet EDU-EP17-SHEETS-R1.0). MAN SPRAY, talking; the faint dashed signal line draws
// from his phone L18-32, dips over the beach into the bay at the entry and bends along a curve toward the headland (bookend of B01-SH01); holds with
// ambient motion (boat bob, spray) to the last frame. Camera cranes up and back L0-44 (easeOutCubic), still L44-91 (0 px).
const cam = (L: number) => {
  const u = outCubic(L, 0, 44), m = (a: number, b: number) => mix(a, b, u);
  return sheetCam([m(-0.3, -0.4), m(1.1, 1.0), m(-0.6, -1.0)], m(3, -8), m(2.2, 4.55), m(1.7, 3.6), {f: 1000, hy: m(640, 440)});
};
export const shot = makeShot('S01-B06-SH04', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const d = outCubic(L, 18, 32), s = S_WATER * Math.min(1, d * 1.6), sea = Math.max(0, d * 1.6 - 0.6) / 1.0;
    paintYardShot(p, cam(L), {t: L / 30, light: {warm: 0.35}, arms: 'hose-water', hose: {state: 'spray', amt: 1, lHold: true}, view: 'back', headYaw: -0.3, face: 'talk',
      layer: d > 0 ? (q, c, slot) => paintSignal(q, c, {s, sea: Math.min(1, sea), dashed: true, alpha: 0.75}, slot) : undefined});
  },
});

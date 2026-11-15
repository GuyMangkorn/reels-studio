import {mixYCam, type YCam} from '../../kit/ycam';
import {lin, mix, outCubic, sine} from '../clock';
import {sheetCam} from '../palette';
import {paintSignal, S_CURL, S_TOP} from '../signal';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B01-SH01 (G 0-102, 102 f) the call by the sea (pre-roll + L01; sheet EDU-EP17-SHEETS-R1.2, SD02 end = LF01, SD28 retime). MAN at M0, back three-quarter,
// new: hose-water, SPRAY on pot P2, head turned 15 deg toward the phone. Camera: phone close (near 0.05) -> beside his left shoulder at L34 -> LF01 at L56
// (one smooth pull-back through the middle key), then a 3 % push-in (r 1.95 -> 1.89) L56-102 (to the cut). N5 (SD28, -12 f): the line springs out of the
// phone top at L84, rises to the top by L94 (easeOutCubic), squashes L94-98, bends down toward the beach by L102 (completes on the cut; B01-SH02 picks the curl up).
const N = 102;
const A = sheetCam([-0.40, 1.10, -0.60], -12, 0.42, 1.14, {f: 1000, hy: 820, near: 0.05});
const E = (r: number) => sheetCam([-0.30, 1.10, -0.55], 3, r, 1.68, {f: 1000, hy: 640});
const M: [number, number, number] = [-0.45, 1.45, 0.25], U34 = sine(34, 0, 56);
const cam = (L: number): YCam => {
  if (L >= 56) return E(mix(1.95, 1.89, sine(L, 56, N)));
  const u = sine(L, 0, 56), e = E(1.95), c = mixYCam(A, e, u), m = mixYCam(A, e, U34), b = (4 * u * (1 - u)) / (4 * U34 * (1 - U34));
  return {...c, x: c.x + (M[0] - m.x) * b, y: c.y + (M[1] - m.y) * b, z: c.z + (M[2] - m.z) * b, near: mix(0.05, 0.3, u)};
};
export const signalS = (L: number) => (L < 84 ? 0 : L < 94 ? S_TOP * outCubic(L, 84, 94) : L < 98 ? S_TOP : mix(S_TOP, S_CURL, outCubic(L, 98, 102)));
export const shot = makeShot('S01-B01-SH01', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const s = signalS(L), sq = L >= 94 && L < 98 ? Math.sin(lin(L, 94, 98) * Math.PI) : 0;
    paintYardShot(p, cam(L), {t: L / 30, arms: 'hose-water', hose: {state: 'spray', amt: 1, lHold: true}, view: 'back', headYaw: -0.26, wave: true,
      layer: s > 0 ? (q, c, slot) => paintSignal(q, c, {s, squash: sq, t: L / 30}, slot) : undefined});
  },
});

import {inkLine} from '../../kit/draw';
import {mixYCam, camPoint, type YCam} from '../../kit/ycam';
import type {Pt} from '../../kit/painter';
import {lin, mix, sine} from '../clock';
import {C, lookAtCam, sheetCam} from '../palette';
import {cableAt, paintSea} from '../sea';
import {makeShot} from '../stage';
import {paintBubbles, paintHullsBelow} from '../under';

// S01-B01-SH03 (G 132-164, 32 f) down to the cable (L02b; sheet EDU-EP17-SHEETS-R1.2, SD04 = LF02 mid key, SD29 retime). Bubbles and hull silhouettes overhead
// L0-14; the signal line threads down into the buried ridge at z -16 and the cable takes the glow; one pulse rides to the centre point by L29 (SD29; was L35)
// and trails on through L29-34 under the start-at-cut dissolve into the globe's yard dot (G164-170; stage.tsx clamps this plate at L34). Camera: three keys
// L0 -> L19 (LF02) -> L31, piecewise easeInOutSine, held after L31.
const K0 = sheetCam([0, -2, -20], 0, 6, -0.8, {f: 1000, hy: 760});
const K1 = lookAtCam([1.6, -6.0, -96], cableAt(-140), 900, 560, -30, 0.2);
const K2 = sheetCam([0.5, -38.8, -190], 4, 7, -37.7, {f: 1000, hy: 820, near: 0.2});
const cam = (L: number): YCam => (L < 19 ? mixYCam(K0, {...K1, near: 0.3}, sine(L, 0, 19)) : mixYCam(K1, K2, sine(L, 19, 31)));
export const shot = makeShot('S01-B01-SH03', {
  paper: '#08192a',
  paint: (p, L) => {
    const c = cam(L), t = L / 30;
    // the pulse runs down the cable and arrives near frame centre at L29 (z -214 is the cable point nearest centre from K2: (467, 875)), then trails on
    const pz = mix(-150, -214, lin(L, 12, 29)) - Math.max(0, L - 29) * 0.4;
    paintSea(p, c, {t, pulses: L >= 12 ? [pz] : [], fish: L < 24 ? [-3, -5.5, -112] : undefined});
    if (L < 16) { paintHullsBelow(p, c, t); paintBubbles(p, c, [-0.3, -2.5, -16], t); }
    // the signal line from the surface into the ridge at z -16 (fading as the cable takes the glow)
    if (L < 20) {
      const pts = ([[-0.6, 0, -1], [-0.4, -1.2, -8], [-0.1, -2.2, -14], cableAt(-16)] as [number, number, number][]).map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
      if (pts.length > 1) { inkLine(p, 5990, pts, {closed: false, color: C.glow, weight: 4 * (1 - lin(L, 10, 20)) + 0.5, still: true, curve: 0.5}); inkLine(p, 5991, pts, {closed: false, color: '#ffffff', weight: 1.5 * (1 - lin(L, 10, 20)) + 0.3, still: false, curve: 0.5}); }
    }
  },
});

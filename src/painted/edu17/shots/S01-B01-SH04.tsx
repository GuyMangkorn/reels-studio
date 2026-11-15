import {lin, mix, outCubic, sine} from '../clock';
import {facing, paintGlobe, type GlobeView} from '../globe';
import {makeShot} from '../stage';

// S01-B01-SH04 (G 164-229, 65 f) the globe (L03; sheet EDU-EP17-SHEETS-R1.2). The B01-SH03 pulse lands on the warm yard dot (flash L0..8 shown, across the
// start-at-cut G164-170 dissolve; L-3..-1 no longer painted); the 16 lines light in a ripple outward from the dot L6-32 (great-circle radius 0 -> 180 deg, easeOutCubic); pulses grow in on
// every line L20-54. Globe view {cx, cy, r 1500, lon 100.9, lat 12.6} -> LF03 {540, 640, 490, lon 112, lat 10} over L0-58, still L58-65. Start centre
// (469, 872) instead of the sheet's (540, 960): the B01-SH03 pulse ends there (its cable never crosses frame centre), so the dot sits under it across
// the dissolve (accept: within 40 px). LF03 keeps its literal GlobeView (lat 10 = facing 10S, see globe.ts); the start faces the yard. No labels.
const A: GlobeView = facing(469, 872, 1500, 100.9, 12.6), B: GlobeView = {cx: 540, cy: 640, r: 490, lon: 112, lat: 10};
export const view = (L: number): GlobeView => {
  const u = sine(L, 0, 58), k = (a: number, b: number) => mix(a, b, u);
  // radius eases in log space so the pull-back reads as an even dolly
  return {cx: k(A.cx, B.cx), cy: k(A.cy, B.cy), r: Math.exp(k(Math.log(A.r), Math.log(B.r))), lon: k(A.lon, B.lon), lat: k(A.lat, B.lat)};
};
export const shot = makeShot('S01-B01-SH04', {
  paper: '#0e1830',
  paint: (p, L) => paintGlobe(p, view(L), {t: L / 30, reveal: L < 6 ? 0 : 180 * outCubic(L, 6, 32), pulse: lin(L, 20, 54), dotFlash: 1 - lin(L, -3, 8)}),
});

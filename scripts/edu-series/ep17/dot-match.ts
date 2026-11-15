// EDU-EP17 SD19/SD29 dot-under-pulse check (Boss R1.2): B01-SH03's pulse (screen px, from the shot's own camera keys and pulse clock) against B01-SH04's
// yard dot across the start-at-cut dissolve G164-170 (SH03 L32-34 then held at L34 by the stage clamp; SH04 L0-5). Accept: within 40 px.
//   npx tsx scripts/edu-series/ep17/dot-match.ts
import {camPoint, mixYCam, type YCam} from '../../../src/painted/kit/ycam';
import {lin, mix, sine, lenOf, startOf} from '../../../src/painted/edu17/clock';
import {lookAtCam, sheetCam} from '../../../src/painted/edu17/palette';
import {cableAt} from '../../../src/painted/edu17/sea';
import {globeXY, YARD_LONLAT} from '../../../src/painted/edu17/globe';
import {view} from '../../../src/painted/edu17/shots/S01-B01-SH04';

// copy of S01-B01-SH03's camera keys and pulse clock (keep in step with the shot file)
const K0 = sheetCam([0, -2, -20], 0, 6, -0.8, {f: 1000, hy: 760});
const K1 = lookAtCam([1.6, -6.0, -96], cableAt(-140), 900, 560, -30, 0.2);
const K2 = sheetCam([0.5, -38.8, -190], 4, 7, -37.7, {f: 1000, hy: 820, near: 0.2});
const cam = (L: number): YCam => (L < 19 ? mixYCam(K0, {...K1, near: 0.3}, sine(L, 0, 19)) : mixYCam(K1, K2, sine(L, 19, 31)));
const pz = (L: number) => mix(-150, -214, lin(L, 12, 29)) - Math.max(0, L - 29) * 0.4;
const n3 = lenOf('S01-B01-SH03'), g3 = startOf('S01-B01-SH03'), g4 = startOf('S01-B01-SH04');
const r = (v: number) => Math.round(v);
let worst = 0;
for (let G = g3 + 29; G < g4 + 6; G++) {
  const L3 = Math.min(n3 + 2, G - g3), q = camPoint(cam(L3), cableAt(pz(L3)));
  const L4 = G - g4, d = L4 >= 0 ? globeXY(view(L4), YARD_LONLAT[0], YARD_LONLAT[1]) : null;
  const dist = q && d ? Math.hypot(q[0] - d[0], q[1] - d[1]) : NaN;
  if (q && d) worst = Math.max(worst, dist);
  console.log(`G${G} SH03 f${L3} pulse ${q ? `(${r(q[0])}, ${r(q[1])})` : '-'}  SH04 ${L4 >= 0 ? `f${L4} dot ${d ? `(${r(d[0])}, ${r(d[1])})` : 'hidden'}` : '-'}${Number.isNaN(dist) ? '' : `  d ${dist.toFixed(1)} px`}`);
}
console.log(`worst distance across the dissolve: ${worst.toFixed(1)} px (accept <= 40)`);

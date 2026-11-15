import {mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {bedY, cableAt, paintSea} from '../sea';
import {makeShot} from '../stage';
import {paintHullChains, paintHullsBelow, paintShallowCable} from '../under';

// S01-B04-SH02 (G 729-853, 124 f) not the deep: the shallows (end of L09 + L10; sheet EDU-EP17-SHEETS-R1.2, SD06, SD27, SD32; W7 hull chains). Empty, still deep with the calm cable
// L0-18 (sink eye -34 -> -41.72); turn yaw 0 -> 180 L18-40 while rising; climb along the cable up the slope L18-97 to the shallows (SD32: lands on "ไม่ใช่กลางทะเลลึก" L97; was L104); from L70 three hulls
// overhead and their anchor chains to the sand; the shallow cable a buried ridge with the bared stretch z -52 -> -58 (K). Drift 2 % L97-124.
const N = 124;
/** W7 chain links per hull (m), sized at the W7 L104 camera (= the end framing, now reached at L97) so each reads >= 5 px (B1 at ~37 m, B2 ~14-20 m, B3 seen L80-95 only). */
const CHAIN_LINK = {B1: 0.2, B2: 0.09, B3: 0.16};
const cam = (L: number) => {
  if (L < 18) { const a = cableAt(-420); return sheetCam(a, 0, 8, mix(-34.0, -41.72, sine(L, 0, 18)), {f: 1000, hy: 760}); }
  const u = sine(L, 18, 97), yaw = mix(0, 180, sine(L, 18, 40)), r = mix(8, 9, u) * (1 - 0.02 * sine(L, 97, N));
  const zt = mix(-420, -58, u), a = cableAt(zt), at: [number, number, number] = [mix(a[0], 0.8, u), mix(a[1], -6.5, u), zt];
  const cz = at[2] + r * Math.cos((-yaw * Math.PI) / 180), h = mix(2.0, 1.09, u), eye = Math.max(bedY(cz) + h, mix(-41.72, -5, u ** 1.4) * 0 + bedY(cz) + h);
  return sheetCam(at, yaw, r, eye, {f: 1000, hy: mix(760, 700, u)});
};
export const shot = makeShot('S01-B04-SH02', {
  paper: '#08192a',
  paint: (p, L) => {
    const c = cam(L), t = L / 30, up = c.y > -20;
    paintSea(p, c, {bed: 'view', t, zFar: -700, zNear: 0, cable: {zFar: -700, zNear: -80, step: 0.5, glow: 1}});
    if (up) paintShallowCable(p, c, -79, -16);
    if (L >= 70) { paintHullsBelow(p, c, t); paintHullChains(p, c, t, undefined, {link: CHAIN_LINK}); }
  },
});

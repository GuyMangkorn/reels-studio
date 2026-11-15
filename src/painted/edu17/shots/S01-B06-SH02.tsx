import {lin, mix, sine} from '../clock';
import {ell, washAt} from '../../kit/draw';
import {facing, globeXY, lineLonLat, paintGlobe} from '../globe';
import {makeShot} from '../stage';

// S01-B06-SH02 (G 1491-1579, 88 f; R1.2) the reroute (L18; sheet EDU-EP17-SHEETS-R1.1, SD14, SD18, SD20; W7 spark mark). Close on the coast between the yard and Hong Kong, 5 % push
// {540, 640, r 1100 -> 1155} facing (112E, 17N) (J at (540, 640)). L13: spark on code line L16 at (110.5E, 15.5N); L16 greys from the spark to Hong Kong over L13-23 and
// stays grey. A rider pulse runs up L16 from the yard side; at L57 it slides sideways onto code line L4 over L57-75 and runs on to Hong Kong.
// Build note: the sheet's J (112E, 17N) lies on L16 past the spark, so a slide there would carry the pulse over the dead stretch; the slide leaves L16
// just short of the spark (S, ~110.2E 15.0N) and lands on L4 at its 17N point (T, ~113.2E 17N), passing through J's neighbourhood (Film to confirm).
const L16 = lineLonLat(15), L4 = lineLonLat(3);
/** Sample index on a path nearest a lon/lat. */
const near = (path: [number, number][], at: [number, number]) => path.reduce((b, q, i) => (Math.hypot(q[0] - at[0], q[1] - at[1]) < Math.hypot(path[b][0] - at[0], path[b][1] - at[1]) ? i : b), 0);
/** Point at fractional sample index `u` of a path. */
const along = (path: [number, number][], u: number): [number, number] => { const i = Math.max(0, Math.min(path.length - 2, Math.floor(u))), f = Math.min(1, u - i); return [mix(path[i][0], path[i + 1][0], f), mix(path[i][1], path[i + 1][1], f)]; };
const SPARK: [number, number] = [110.5, 15.5], iSpark = near(L16, SPARK), iS = near(L16, [110.2, 15.0]) - 0.3, iT = near(L4, [113.16, 17]), iHK = L4.length - 1;
const iStart = near(L16, [104.5, 10.2]);
const rider = (L: number): [number, number] => {
  if (L < 57) return along(L16, mix(iStart, iS, lin(L, 4, 57)));
  if (L < 75) { const a = along(L16, iS), b = along(L4, iT), u = sine(L, 57, 75); return [mix(a[0], b[0], u), mix(a[1], b[1], u) + 0.35 * Math.sin(Math.PI * u)]; }
  return along(L4, mix(iT, iHK, lin(L, 75, 100)));
};
const spark = (L: number) => { const k = L - 13; return k < 0 || k >= 8 ? 0 : [0.6, 1, 0.5, 0.95, 0.7, 0.45, 0.25, 0.1][k]; };
/** W7 (fix list item 6, sheet R1.1 SD20): the dim red mark left at the break, L21 (the spark's last flicker is L20) to the cut. */
export const MARK = {from: 21, r: 7, alpha: 0.6};
export const shot = makeShot('S01-B06-SH02', {
  paper: '#0e1830',
  paint: (p, L) => {
    const v = facing(540, 640, mix(1100, 1155, sine(L, 0, 88)), 112, 17);
    paintGlobe(p, v, {
      t: L / 30, noPulse: [15], dim: L >= 13 ? {line: 15, from: iSpark, u: lin(L, 13, 23)} : undefined, sparks: [{at: SPARK, a: spark(L)}], rider: L >= 4 ? rider(L) : undefined,
    });
    const q = L >= MARK.from ? globeXY(v, SPARK[0], SPARK[1]) : null;
    if (q) washAt(p, 7490, '#d83a2c', 255 * MARK.alpha, ell(q[0], q[1], MARK.r, MARK.r, 14), 0, 0);
  },
});

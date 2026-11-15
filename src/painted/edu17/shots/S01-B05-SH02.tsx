import {lin, mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {paintFlashSeabed} from '../redsea';
import {makeShot} from '../stage';

// S01-B05-SH02 (G 1162-1207, 45 f) three cables go dark (L14b; sheet EDU-EP17-SHEETS-R1.2, LF06, SD11). Plain grey floor, C1-C3 lit; each goes dark over
// 3 f: C1 L11 ("สาย"), C2 L19 ("ขาด"), C3 L26 ("สามเส้น"). Camera LF06 trucks 1.0 m along its right vector, at (0, 0.2, 0) -> (0.906, 0.2, 0.423),
// over L0-45 (R1.2: optional N 47 -> 45 applied). Sand starts 5 m behind the lens (`near`): the LF06 default left the near-right corner unpainted. Grade, LBL, CARD from the timeline.
const N = 45;
const cam = (L: number) => { const u = sine(L, 0, N); return sheetCam([mix(0, 0.906, u), 0.2, mix(0, 0.423, u)], 25, 6, 1.4, {f: 1000, hy: 820}); };
export const shot = makeShot('S01-B05-SH02', {
  paper: '#4a5e6a', recon: true,
  paint: (p, L) => paintFlashSeabed(p, cam(L), {near: 5, dark: lin(L, 11, 14) + lin(L, 19, 22) + lin(L, 26, 29)}),
});

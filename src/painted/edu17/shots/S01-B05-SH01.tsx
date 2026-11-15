import {mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {paintRedSea} from '../redsea';
import {makeShot} from '../stage';

// S01-B05-SH01 (G 1064-1162, 98 f) the Red Sea (L14a; sheet EDU-EP17-SHEETS-R1.2, LF05). The listing damaged ship broadside (list 9 deg away, down by
// the stern, scorch patch), thin smoke drifting -x, grey swell. Camera yaw 16 -> 12, r 260 -> 200 (LF05) over L0-98 (R1.2: N 111 -> 98). Reconstruction grade, LBL and
// CARD are timeline screen layers (Editor, G1064-...); `recon` previews the grade on stills only.
const N = 98;
const cam = (L: number) => { const u = sine(L, 0, N); return sheetCam([-4, 6, 0], mix(16, 12, u), mix(260, 200, u), 3, {f: 1300, hy: 900}); };
export const shot = makeShot('S01-B05-SH01', {
  paper: '#a9adad', recon: true,
  paint: (p, L) => paintRedSea(p, cam(L), {t: 0.4 + L / 30}),
});

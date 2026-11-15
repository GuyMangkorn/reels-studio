import {mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {paintSea} from '../sea';
import {makeShot} from '../stage';
import {K, paintAnchorRun, paintHullChains, paintHullsBelow, paintTrawlPass} from '../under';

// S01-B04-SH04 (G 881-993, 112 f) anchor and net (L12; sheet EDU-EP17-SHEETS-R1.2, SD07: facing the shore; SD33: anchor run and trawl pass evaluated at
// L + 10, speeds unchanged). Hulls overhead; the anchor (0.6 m, N7) on its chain enters screen-left at L34 ploughing a furrow along -x; the fluke reaches K
// at L87 and lifts the cable 0.4 m taut L87-101; it parts at L103 with a sand puff and the shore side goes dark; the anchor drags on to the cut L112.
// Otter board and net bag scrape past behind at z -47.5, L53-85.
const N = 112;
/** SD33: the built anchor / trawl clock runs 10 f ahead of the shot clock (its events were authored for the v1 127 f shot). */
const EV = 10;
const cam = (L: number) => { const u = sine(L, 0, N); return sheetCam([mix(-0.08, -0.88, u), -4.9, K[2]], mix(160, 168, u), 3.2, -4.75, {f: 1000, hy: 760, near: 0.1}); };
export const shot = makeShot('S01-B04-SH04', {
  paper: '#2f7288',
  paint: (p, L) => {
    const c = cam(L), t = L / 30;
    paintSea(p, c, {bed: 'view', t, noProps: true, cable: {zFar: -700, zNear: -80, glow: 1}});
    paintHullsBelow(p, c, t);
    paintHullChains(p, c, t, 'B2');
    paintTrawlPass(p, c, L + EV);
    paintAnchorRun(p, c, L + EV);
  },
});

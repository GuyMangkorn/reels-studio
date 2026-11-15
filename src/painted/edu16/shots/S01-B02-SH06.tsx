import {mixColor, type Pt} from '../../kit/painter';
import {hardFill} from '../../kit/draw';
import {ease} from '../clock';
import {TH} from '../palette';
import {paintFarStar} from '../scenes-roof';
import {thCam} from '../scenes';
import {makeShot} from '../shot';
import {paintFrameRim, paintLight, paintVoid} from '../thought';

// S01-B02-SH06 L04 IM1 [316, 400) (sheet #6). TH star dust camera thCam(0, 0.10 -> 0.71 rad), a 35 deg tilt up over +6..+77 (ease in-out). Picture-px
// staging rides the tilt (one shift `dy` 0 -> 700 px): her amber light (halo r 40) (540, 440) -> (540, 1140); the dark city curve under it sinks to the
// frame bottom; the far star (IM1's cold star, long thin halo) enters from the top near +31 and lands at (600, 300) at +77. Void #04060c, dim dust, the
// bubble rim breathing on the ambient clock. No name, no number. The iris dissolve in [316, 328) is the timeline's (Editor).
export const SH06_LIGHT0: Pt = [540, 440];
export const SH06_STAR1: Pt = [600, 300];
export const shot = makeShot('S01-B02-SH06', {
  paper: TH.void,
  paint: (p, L, G) => {
    const k = ease(L, 6, 77), t = 0.4 + G / 30, dy = 700 * k;
    const hers: Pt = [SH06_LIGHT0[0], SH06_LIGHT0[1] + dy], star: Pt = [SH06_STAR1[0], SH06_STAR1[1] - 700 * (1 - k)];
    paintVoid(p, {cam: thCam(0, 0.1 + 0.61 * k), t, dust: 0.7, diag: [hers, star]});
    if (star[1] > -200) paintFarStar(p, star);
    const y = hers[1];
    const curve: Pt[] = [[-10, y + 150], [300, y + 70], [540, y + 42], [800, y + 66], [1090, y + 140]];
    // the silhouette's top edge caught by the nebula (a 3 px lighter lip), so the curve reads against the lifted void at 270 px
    hardFill(p, 54301, mixColor(TH.void, TH.nebula2, 0.75), [...curve.map(([x, yy]): Pt => [x, yy - 3]), ...curve.slice().reverse()]);
    hardFill(p, 54300, mixColor(TH.void, TH.nebula, 0.35), [...curve, [1090, 2000], [-10, 2000]]);
    paintLight(p, {at: hers, r: 40, kind: 'hers', t});
    paintFrameRim(p, {t});
  },
});

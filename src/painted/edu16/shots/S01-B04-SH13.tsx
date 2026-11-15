import {ease} from '../clock';
import {TH} from '../palette';
import {SH13, thCam} from '../scenes';
import {paintSH13Cards, SH13_PUSH_C, sh13Push} from '../scenes-im';
import {makeShot} from '../shot';
import {withStage} from '../stage';
import {paintFrameRim, paintVoid} from '../thought';

// S01-B04-SH13 L07 IM2 standoff [803, 907) (sheet #13): keys, staging and the Boss push re-key are in scenes-im.ts (paintSH13Cards). The star dust
// thCam(0.02 -> 0.16 rad, 0.20) and the frame rim sit outside the picture stage.
export const shot = makeShot('S01-B04-SH13', {
  paper: TH.void,
  paint: (p, L, G) => {
    const t = 0.4 + G / 30, k = ease(L, 6, 103);
    paintVoid(p, {cam: thCam(0.02 + 0.14 * k, 0.2), t, diag: [SH13.hers, SH13.theirs]});
    withStage(p, SH13_PUSH_C, sh13Push(L), [0, 0], () => paintSH13Cards(p, L, t));
    paintFrameRim(p, {t});
  },
});

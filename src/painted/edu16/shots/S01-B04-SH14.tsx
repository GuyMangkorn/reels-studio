import type {Pt} from '../../kit/painter';
import {beadAt, ease, ramp} from '../clock';
import {TH} from '../palette';
import {SH13, thCam} from '../scenes';
import {paintSH13Cards, SH13_PUSH_C} from '../scenes-im';
import {makeShot} from '../shot';
import {withStage} from '../stage';
import {paintBead, paintFrameRim, paintThread, paintVoid, threadAt} from '../thought';

// S01-B04-SH14 L09 IM3 crawl [907, 959) (sheet #14). Hard boundary from SH13 (no dissolve, R2): +0 repaints SH13's end state (same space, same picture stage: 1.12 about SH13_PUSH_C).
// +0..+10 the monsters sink back into their lights and the bubbles fold (SH13's cards at its end state, fold 0 -> 1); the lights settle to IM2's round
// pair, hers 78 -> 58 px, theirs 64 -> 29 px (half hers, never IM1's long-halo star) over +0..+12; the thread on the SH13 diagonal fades in +4..+12; the
// warm bead leaves her light at +12 and crawls on the shared bead clock (beadAt: 0.11 by f958). Camera: the frame centre trucks 60 px from the gap toward
// her light (+0..+21) and back with the bead (+21..+51); star dust thCam(0.16, 0.20 -> 0.30 rad).
const DIAG: Pt = [-0.597, 0.802]; // unit vector gap -> her light
export const shot = makeShot('S01-B04-SH14', {
  paper: TH.void,
  paint: (p, L, G) => {
    const t = 0.4 + G / 30, S = SH13, fold = ease(L, 0, 10), settle = ease(L, 0, 12);
    const truck = 60 * (ease(L, 0, 21) - ease(L, 21, 51)), d: Pt = [-DIAG[0] * truck, -DIAG[1] * truck];
    paintVoid(p, {cam: thCam(0.16, 0.2 + 0.1 * ease(L, 0, 51)), t, diag: [S.hers, S.theirs]});
    withStage(p, SH13_PUSH_C, 1.12, d, () => {
      const th = ramp(L, 4, 12);
      if (th > 0) paintThread(th < 1 ? p.layer(th, 9100) : p, {a: S.hers, b: S.theirs});
      paintSH13Cards(p, 104, t, {fold, hersR: 78 - 20 * settle, theirsR: 64 - 35 * settle});
      const b = beadAt(G);
      if (L >= 12) paintBead(p, threadAt(S.hers, S.theirs, b), ramp(L, 12, 15));
    });
    paintFrameRim(p, {t});
  },
});

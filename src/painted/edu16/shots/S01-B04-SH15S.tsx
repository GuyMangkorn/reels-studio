import {STK_KEYS} from '../clock';
import {TH} from '../palette';
import {paintSH15S, STK} from '../scenes';
import {makeShot} from '../shot';
import {withStage} from '../stage';
import {paintFrameRim} from '../thought';

// S01-B04-SH15S W-STRIKE [1073, 1097) (sheet #16; cut on action, same axis, 1.4x closer). The W3 strip (paintSH15S, STK-K0..K6: claw tip ease-in
// (236, 430) -> (212, 1282), contact +8 = f1081 with the one amber flash `flashAt`, ring +8..+15, planted +16..+17, black inside the rim +18..+23 with the
// rim at 35 %) under a 4 % picture push about her light +0..+8, then still. Iris-out at SH16 is the timeline's. Acceptance: frame-mean luminance rise at
// +8 and +9 <= 0.08 over the previous frame (measured on the stills).
export const shot = makeShot('S01-B04-SH15S', {
  paper: TH.void,
  paint: (p, L, G) => {
    const f = Math.min(L, STK.len - 1), push = 1 + 0.04 * Math.min(1, f / STK_KEYS.contact);
    withStage(p, STK.hers, f >= STK_KEYS.blackFrom ? 1 : push, [0, 0], () => paintSH15S(p, f));
    paintFrameRim(p, {t: 0.4 + G / 30, level: f >= STK_KEYS.blackFrom ? 0.35 : 1});
  },
});

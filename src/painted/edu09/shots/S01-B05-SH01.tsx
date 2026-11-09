import {blendHand, paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable} from '../handclose';
import {liftFinger} from '../../kit/hands';
import {CloseOverlay, camAt, lookMove, makeShot, ramp} from '../stage';

// S01-B05-SH01 (G 1355-1415; R2.1 SD10: L36-59 carry the dropped S01-B05-SH04's 24 f) the retry. cam: CAM-TRY r 26->25, yaw 168, eye 8, f 2000, hy 760. From flat the middle folds L0-9; the ring trembles up 0.4 cm L14-18 (CL03) and drops by L27; still L28-35; L36-59 the stuck hold (ring micro-tremble +-0.05 cm, camera landed at L35 and held).
const N = 36, move = lookMove([0, 1.5, -1.5], 168, [26, 25], 8, {f: 2000, hy: 760}), cam = (L: number) => camAt(move, Math.min(L, N - 1), N);
export const shot = makeShot('S01-B05-SH01', {
  paper: '#e8dfcc',
  paint: (p, L) => {
    const c = cam(L), up = 0.4 * (ramp(L, 14, 18) - ramp(L, 22, 27));
    let h = blendHand(boyHand('flat'), boyHand('test-fold-middle', up > 0 ? {tremble: {finger: 'ring', amp: 0.04, hz: 10}} : L >= N ? {tremble: {finger: 'ring', amp: 0.05, hz: 10}} : {}), ramp(L, 0, 9));
    if (up > 1e-4) h = liftFinger(h, 'ring', up);
    paintHandTable(p, c); paintHandMacro(p, c, h);
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});

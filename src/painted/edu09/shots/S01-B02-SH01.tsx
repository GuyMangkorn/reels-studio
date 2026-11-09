import {paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable} from '../handclose';
import {liftB02SH01, withLifts} from '../tracks';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B02-SH01 (G 351-440) three taps (L04). cam: CAM-TRY yaw 168->160, r 26, eye 8, f 2000, hy 760. Taps land at L26, L45, L56 (SD06); L58-65 all three lift together and hold; ring flat with a small tremble.
const N = 89, move = lookMove([0, 1.5, -1.5], [168, 160], 26, 8, {f: 2000, hy: 760}), cam = (L: number) => camAt(move, L, N);
export const shot = makeShot('S01-B02-SH01', {
  paper: '#e8dfcc',
  paint: (p, L) => { const c = cam(L); paintHandTable(p, c); paintHandMacro(p, c, withLifts(boyHand('test-fold-middle', {tremble: {finger: 'ring', amp: 0.03, hz: 10}}), liftB02SH01(L))); },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});

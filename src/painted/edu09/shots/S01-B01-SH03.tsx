import {paintHandMacro, type HandMacro} from '../../kit/hands';
import {boyHand, paintHandTable} from '../handclose';
import {liftB01SH03, withLifts} from '../tracks';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B01-SH03 (G 203-283) low macro, the hair-lift (L02). cam: CAM-TRY (0, 1.5, -1.5), yaw 168->164, r 26, eye 8, f 2000, hy 760. Ring tip lifts 0.4 cm L19-26, holds with tremble L27-35, drops L36-41.
const N = 80, move = lookMove([0, 1.5, -1.5], [168, 164], 26, 8, {f: 2000, hy: 760}), cam = (L: number) => camAt(move, L, N);
export const hand = (L: number): HandMacro => withLifts(boyHand('test-fold-middle', L >= 27 && L < 36 ? {tremble: {finger: 'ring', amp: 0.05, hz: 10}} : {}), liftB01SH03(L));
export const shot = makeShot('S01-B01-SH03', {
  paper: '#e8dfcc',
  paint: (p, L) => { const c = cam(L); paintHandTable(p, c); paintHandMacro(p, c, hand(L)); },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});

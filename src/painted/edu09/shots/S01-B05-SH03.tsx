import {paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable, POV} from '../handclose';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B05-SH03 (G 1531-1606) hold and loop seam. cam (SD07): CAM-POV r 26.8->28, eye 39->40, ease [0, 0.6]; still from L45 = B01-SH01's L0 camera. Flat hand, ring tremble +-0.05 cm L0-29, still from L30. Last frame = G0 (SP4).
const N = 75, move = lookMove(POV.at, 0, [26.8, 28], [39, 40], {f: 3500, hy: 750, ease: [0, 0.6]}), cam = (L: number) => camAt(move, L, N);
export const shot = makeShot('S01-B05-SH03', {
  paper: '#e8dfcc',
  paint: (p, L) => { const c = cam(L); paintHandTable(p, c); paintHandMacro(p, c, boyHand('flat', L < 30 ? {tremble: {finger: 'ring', amp: 0.05, hz: 10}} : {})); },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});

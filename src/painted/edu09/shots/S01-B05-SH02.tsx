import {paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable, POV} from '../handclose';
import {paintTendons} from '../tendons';
import {CloseOverlay, camAt, lookMove, makeShot, ramp} from '../stage';

// S01-B05-SH02 (G 1415-1531) not lazy, shared string (L15). cam: CAM-POV r 26->26.8, eye 38->39, f 3500, hy 750. Flat hand; L76-99 a 35 % ghost of the shared cords and both ties across the middle, ring and little, fading L100-106. Label only L76-106 (G1491-1521).
const N = 116, move = lookMove(POV.at, 0, [26, 26.8], [38, 39], {f: 3500, hy: 750}), cam = (L: number) => camAt(move, L, N);
export const shot = makeShot('S01-B05-SH02', {
  paper: '#e8dfcc', label: [[76, 106]],
  paint: (p, L) => {
    const c = cam(L), h = boyHand('flat'), g = ramp(L, 76, 84) * (1 - ramp(L, 100, 106));
    paintHandTable(p, c); paintHandMacro(p, c, h);
    if (g > 0.01) paintTendons(p.layer(0.35 * g, 7000), c, h, {shared: 1, cords: 1, ties: [1, 1]});
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});

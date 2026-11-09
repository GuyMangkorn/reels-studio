import {paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable} from '../handclose';
import {diagramSH03, paintTendons} from '../tendons';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B03-SH03 (G 905-1043) shared set and the ties (L08 from "ชุดเดียวกับ"). cam (SD07): (0.3, 1.5, 12)->(-1.2, 1.8, 3), r 33->16, eye 50->24, f 2350->2000, hy 660->640, ease [0.30, 0.72]. Label on.
const N = 138, move = lookMove([[0.3, 1.5, 12], [-1.2, 1.8, 3]], 0, [33, 16], [50, 24], {f: 2350, hy: 660, ease: [0.3, 0.72]}), cam = (L: number) => camAt(move, L, N, {hy: [660, 640], f: [2350, 2000]});
export const shot = makeShot('S01-B03-SH03', {
  paper: '#e8dfcc', label: true,
  paint: (p, L) => {
    const c = cam(L), d = diagramSH03(L), h = {...boyHand('flat'), skinAlpha: d.skinAlpha, shadowAlpha: 0.14};
    paintHandTable(p, c, {dim: 1}); paintHandMacro(p, c, h); paintTendons(p, c, h, d.state);
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} level={0.5} />,
});

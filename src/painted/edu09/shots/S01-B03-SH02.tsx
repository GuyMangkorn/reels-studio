import {paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable} from '../handclose';
import {diagramSH02, paintTendons} from '../tendons';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B03-SH02 (G 768-859) own extras, not the ring (L07 to "นิ้วนาง"). cam: DIAG-W resumes the push r 37->33, eye 55->50, f 2350, hy 660. Label on.
const N = 91, move = lookMove([0.3, 1.5, 12], 0, [37, 33], [55, 50], {f: 2350, hy: 660}), cam = (L: number) => camAt(move, L, N);
export const shot = makeShot('S01-B03-SH02', {
  paper: '#e8dfcc', label: true,
  paint: (p, L) => {
    const c = cam(L), d = diagramSH02(L), h = {...boyHand('flat'), skinAlpha: d.skinAlpha, shadowAlpha: 0.14};
    paintHandTable(p, c, {dim: 1}); paintHandMacro(p, c, h); paintTendons(p, c, h, d.state);
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} level={0.5} />,
});

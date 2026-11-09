import {paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable} from '../handclose';
import {diagramSH04, paintTendons} from '../tendons';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B03-SH04 (G 1080-1214) pinned (L09 from "พอนิ้วกลางพับลง"). cam (SD07): CAM-TRY yaw 168->172, r 26->24, eye 8, f 2000, hy 760, ease [0, 0.75]. Middle held, tie pulled, ring cord taut (1.5 px shake from L89), ring tip +0.3 cm L92-101, still to the cut. Label on.
const N = 134, move = lookMove([0, 1.5, -1.5], [168, 172], [26, 24], 8, {f: 2000, hy: 760, ease: [0, 0.75]}), cam = (L: number) => camAt(move, L, N);
export const shot = makeShot('S01-B03-SH04', {
  paper: '#e8dfcc', label: true,
  paint: (p, L) => {
    const c = cam(L), d = diagramSH04(L), h = {...boyHand('test-fold-middle', {lift: {ring: d.ringLiftCm}}), skinAlpha: d.skinAlpha, shadowAlpha: 0.14};
    paintHandTable(p, c, {dim: 1}); paintHandMacro(p, c, h); paintTendons(p, c, h, d.state);
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} level={0.5} />,
});

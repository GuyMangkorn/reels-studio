import {paintHandMacro} from '../../kit/hands';
import {boyHand, diagCam, paintHandTable} from '../handclose';
import {diagramSH01, paintTendons} from '../tendons';
import {CloseOverlay, makeShot} from '../stage';

// S01-B03-SH01 (G 622-727) see-through, the forearm muscle (L06 to "เส้นเอ็น"). cam: DIAG-W r 40->37, eye 58->55 (diagCam). Label on from L9 (G631).
const N = 105, cam = (L: number) => diagCam(L / (N - 1));
export const shot = makeShot('S01-B03-SH01', {
  paper: '#e8dfcc', label: [[9, N]],
  paint: (p, L) => {
    const c = cam(L), d = diagramSH01(L), h = {...boyHand('flat'), skinAlpha: d.skinAlpha, shadowAlpha: 0.14};
    paintHandTable(p, c, {dim: 1}); paintHandMacro(p, c, h); paintTendons(p, c, h, d.state);
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} level={0.5} />,
});

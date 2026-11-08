import {blendHand, paintHandMacro} from '../../kit/hands';
import {boyHand, paintHandTable, povCam} from '../handclose';
import {CloseOverlay, makeShot, ramp} from '../stage';

// S01-B01-SH01 (G 0-155) LF01 our own hand, the try (L01). cam: CAM-POV r 28->26, eye 40->38 (povCam). L0-5 flat; L46-60 the middle folds under (TP); from L92 the ring strains and holds, tremble +-0.08 cm.
const N = 155, cam = (L: number) => povCam(L / (N - 1));
export const shot = makeShot('S01-B01-SH01', {
  paper: '#e8dfcc',
  paint: (p, L) => {
    const c = cam(L), s = ramp(L, 92, 98);
    const tp = boyHand('test-fold-middle', s > 0 ? {strain: {ring: s}, tremble: {finger: 'ring', amp: 0.08 * s, hz: 10}} : {});
    paintHandTable(p, c);
    paintHandMacro(p, c, blendHand(boyHand('flat'), tp, ramp(L, 46, 60)));
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});

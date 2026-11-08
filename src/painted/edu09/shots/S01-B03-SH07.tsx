import {SH07_MOVE} from '../scenes';
import {EXPRESSIONS} from '../../kit/expressions';
import {ELDER_REST, RoomOverlay, camAt, diningPaint, makeShot, ramp} from '../stage';
import {TABLE_Y} from '../dining';
import {marionetteBoy} from '../tracks';

// S01-B03-SH07 (G 727-768) marionette hand (L06 "เหมือนสายเชิดหุ่น"). cam: SD02 yaw 6->5, r 1.56->1.52, hy 768->752 (SH07_MOVE). N11 dangle + finger lag (marionetteBoy). BOY surprised L0-14 -> happy; head 10 deg down from L15
// (PoseFigure has no head pitch: `nod` dy lowers the head, see the Editor note). ELDER happy at the right edge. Label on.
const N = 41, cam = (L: number) => camAt(SH07_MOVE, L, N, {hy: [768, 752]});
export const shot = makeShot('S01-B03-SH07', {
  paper: '#e8dfcc', label: true,
  paint: (p, L, G) => {
    const y = TABLE_Y, t = G / 30;
    diningPaint(p, cam(L), t,
      {t, ...marionetteBoy(L), rHand: [-0.33, y, -0.12], rElbow: [-0.405, y + 0.026, -0.33], fig: {nod: [0, -0.09 * ramp(L, 15, 20)]}},
      {t: t + 1, face: {...EXPRESSIONS.happy, look: [-0.7, 0.2]}, ...ELDER_REST});
  },
  overlay: (L) => <RoomOverlay cam={cam(L)} />,
});

import {EXPRESSIONS} from '../../kit/expressions';
import {SH08_MOVE} from '../scenes';
import {BOY_REST, ELDER_REST, RoomOverlay, camAt, diningPaint, makeShot} from '../stage';
import {liftB03SH08, withLifts} from '../tracks';

// S01-B03-SH08 (G 859-905) suspicious ring finger (L07 "ไม่มี", L08 "ต้องใช้"). cam: SD03 yaw 7->6, r 1.60->1.56, hy 780->764 (SH08_MOVE). Flat hand; index and little lift 2 cm L5-10, ring stays down. Label on.
const N = 46, cam = (L: number) => camAt(SH08_MOVE, L, N, {hy: [780, 764]});
export const shot = makeShot('S01-B03-SH08', {
  paper: '#e8dfcc', label: true,
  paint: (p, L, G) => {
    const t = G / 30;
    diningPaint(p, cam(L), t,
      {t, face: {...EXPRESSIONS.suspicious, look: [0.8, 0.3]}, ...BOY_REST, lPose: 'flat', lMod: (h) => withLifts(h, liftB03SH08(L))},
      {t: t + 1, face: EXPRESSIONS.happy, ...ELDER_REST});
  },
  overlay: (L) => <RoomOverlay cam={cam(L)} />,
});

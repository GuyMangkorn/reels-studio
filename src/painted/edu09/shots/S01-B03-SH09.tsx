import {camMove} from '../../kit/cam-moves';
import {EXPRESSIONS} from '../../kit/expressions';
import {BOY_REST, ELDER_HAND, ELDER_REST, RoomOverlay, camAt, diningPaint, makeShot} from '../stage';

// S01-B03-SH09 (G 1043-1080) grandpa knows (L09 "มักอธิบายกันว่า"). cam: (0.12, 0.95, -0.45), yaw -6->-4, r 0.95->0.92, eye 1.02, pitch -6, f 1250, hy 620. B02-SH02's hand held (ring flat, faint tremble); ELDER smug, two slow nods (9 f, about 6 deg) at L6 and L18. Label on.
const N = 37, move = camMove([0.12, 0.95, -0.45], [-6, -4], [0.95, 0.92], 1.02, {pitch: [-6, -6], f: 1250, hy: 620}), cam = (L: number) => camAt(move, L, N);
const nod = (L: number) => { const k = L >= 6 && L < 15 ? (L - 6) / 9 : L >= 18 && L < 27 ? (L - 18) / 9 : -1; return k < 0 ? 0 : -0.07 * Math.sin(Math.PI * k); };
export const shot = makeShot('S01-B03-SH09', {
  paper: '#e8dfcc', label: true,
  paint: (p, L, G) => {
    const t = G / 30;
    diningPaint(p, cam(L), t,
      {t, face: {...EXPRESSIONS.neutral, look: [0.9, -0.1]}, ...BOY_REST, lPose: 'test-fold-middle'},
      {t: t + 1, face: {...EXPRESSIONS.smug, look: [-0.5, 0]}, ...ELDER_REST, rHand: ELDER_HAND, rPose: 'ring-strain', fig: {nod: [0, nod(L)]}});
  },
  overlay: (L) => <RoomOverlay cam={cam(L)} />,
});

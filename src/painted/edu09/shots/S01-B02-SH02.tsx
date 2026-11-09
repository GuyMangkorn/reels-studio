import {camMove} from '../../kit/cam-moves';
import {EXPRESSIONS} from '../../kit/expressions';
import {BOY_REST, ELDER_HAND, ELDER_REST, RoomOverlay, camAt, diningPaint, makeShot} from '../stage';

// S01-B02-SH02 (G 440-511) grandpa fails too (V02, voiced G441-502). cam: (0.12, 0.95, -0.45), yaw -6, r 0.95, eye 1.02, pitch -6, f 1250, hy 620. ELDER laughs from L3 (shoulders bounce L5, L13), then warm talk; his right hand TP, ring strained.
const N = 71, move = camMove([0.12, 0.95, -0.45], [-6, -6], 0.95, 1.02, {pitch: [-6, -6], f: 1250, hy: 620}), cam = (L: number) => camAt(move, L, N);
const bounce = (L: number) => (L >= 5 && L < 9 ? -0.012 * Math.sin(((L - 5) / 4) * Math.PI) : L >= 13 && L < 17 ? -0.012 * Math.sin(((L - 13) / 4) * Math.PI) : 0);
export const shot = makeShot('S01-B02-SH02', {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const t = G / 30, talk = L >= 15 && L < 63;
    const face = L < 3 ? EXPRESSIONS.happy : L < 15 ? EXPRESSIONS.laugh : {...EXPRESSIONS.happy, ...(talk ? {mouth: 'talk' as const, open: 0.25 + 0.5 * Math.abs(Math.sin(L * 1.3))} : {})};
    diningPaint(p, cam(L), t,
      {t: t + 0.4, face: {...EXPRESSIONS.surprised, look: [0.6, 0.5]}, ...BOY_REST, lPose: 'test-fold-middle'},
      {t: t + 1.1, face, ...ELDER_REST, rHand: ELDER_HAND, rPose: 'ring-strain', fig: {rise: bounce(L)}});
  },
  overlay: (L) => <RoomOverlay cam={cam(L)} />,
});

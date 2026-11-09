import {EXPRESSIONS} from '../../kit/expressions';
import {BOY_REST, ELDER_REST, RoomOverlay, camAt, diningPaint, makeShot, ramp} from '../stage';
import {LF02_MOVE, STRAIN} from '../scenes';

// S01-B01-SH02 (G 155-203) LF02 strain face, V01 (G182-196). cam: SD01 hy 780->748 (LF02_MOVE). BOY strain L0-23, head lifts L24-28 and looks at ELDER, `angry` + talk L24-41 (V01), hold angry.
const N = 48, cam = (L: number) => camAt(LF02_MOVE, L, N, {hy: [780, 748]});
export const shot = makeShot('S01-B01-SH02', {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const t = G / 30, speak = L >= 24 && L < 42;
    const face = L < 24 ? STRAIN : {...EXPRESSIONS.angry, look: [0.8, 0] as [number, number], ...(speak ? {mouth: 'talk' as const, open: 0.25 + 0.5 * Math.abs(Math.sin(L * 1.3))} : {})};
    const tremble = L < 24 ? 0.004 * Math.sin(L * 2.4) : 0;
    diningPaint(p, cam(L), t,
      {t: t + 0.4, face, ...BOY_REST, lPose: 'ring-strain', fig: {nod: [0, 0.07 * ramp(L, 24, 28)], rise: tremble}},
      {t: t + 1.1, face: {...EXPRESSIONS.happy, look: [-0.6, 0.2]}, ...ELDER_REST});
  },
  overlay: (L) => <RoomOverlay cam={cam(L)} />,
});

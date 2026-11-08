import {EXPRESSIONS} from '../../kit/expressions';
import {camD01, D01_LAMP_Y, GRIN} from '../scenes';
import {BOY_REST, ELDER_REST, RoomOverlay, diningPaint, makeShot, ramp} from '../stage';

// S01-B05-SH04 (G 1391-1415, D01) grandpa grins at the retry. cam: B01-SH04's end camera drifted (camD01), pendant raised (lampY 1.85). BOY suspicious, eyes on his hand L0-11 then flick up to ELDER L12-15.
// ELDER L0-3 happy, L4-9 the smile opens to the grin and the head tilts 6 deg toward BOY (headCock -6), grin held, one silent shoulder chuckle at L14. No caption, no label, no music.
export const shot = makeShot('S01-B05-SH04', {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const t = G / 30, g = ramp(L, 4, 9), chuckle = L >= 14 && L < 20 ? -0.01 * Math.sin(((L - 14) / 6) * Math.PI) : 0;
    const eld = L < 4 ? {...EXPRESSIONS.happy, look: [-0.7, 0.5] as [number, number]} : {...GRIN, mouth: g > 0.5 ? ('grin' as const) : ('smile' as const)};
    diningPaint(p, camD01, t,
      {t: t + 0.5, face: {...EXPRESSIONS.suspicious, look: L < 12 ? [-0.2, 0.6] as [number, number] : [0.8, -0.1] as [number, number]}, ...BOY_REST, lPose: 'test-fold-middle'},
      {t: t + 0.9, face: eld, ...ELDER_REST, fig: {headCock: -6 * g, rise: chuckle}}, D01_LAMP_Y);
  },
  overlay: () => <RoomOverlay cam={camD01} lampY={D01_LAMP_Y} />,
});

import {camMove, camOf} from '../../kit/cam-moves';
import type {Eyes} from '../../kit/head';
import {paintCabin} from '../cabin';
import {HANDS, paintDriverAt} from '../driver';
import {paintRoadSet, paintStormSky, TONE_LIVE} from '../road';
import {makeShot} from '../shot';

// B05-SH12 · G1011-1105 · no guarantee (L11). EDU-EP21-SHEETS-R1 shot block (SD08); Boss W5.2 BG2, 2026-11-16.
// Camera `cam((-0.15, 1.10, 0.38), 180->175, 0.85->0.78, 1.12, 700, 700)` over L0-94, linear push: the lens in the passenger seat.
// DRIVER view `left` held (squareToCam), sober `neutral`, hands on the thighs (hidden), gaze straight ahead out of the windscreen, slow
// blink L40-46, no smile; profile with the plain mouth (no cupid's-bow lips, kit profile default). The streaming driver window behind her
// (rain runs on G), the cabin dark (tint 0.18), her face against the grey window light, the lap in the shade under the dash. Cabin lens 'side': her seat back behind her, the
// console after her, no passenger seat back (the lens sits there).

const CAM = camMove([-0.15, 1.1, 0.38], [180, 175], [0.85, 0.78], 1.12, {f: 700, hy: 700});
const N = 94;

/** Slow blink L40-46: half, shut L41-45, half. */
const eyesAt = (L: number): Eyes | undefined => (L === 40 || L === 46 ? 'half' : L > 40 && L < 46 ? 'shut' : undefined);

export const shot = makeShot({
  id: 'B05-SH12', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camOf(CAM, L / N), t = G / 30, o = {t, tone: TONE_LIVE}, eyes = eyesAt(L);
    paintStormSky(p, c, o);
    paintRoadSet(p, c, o);
    paintCabin(p, c, {t, dashGlow: false, rainRun: true, lens: 'side', radio: {light: 0, press: 0},
      driver: (q, cc) => paintDriverAt(q, cc, {face: 'neutral', hands: HANDS.thighs, tint: 0.18, faceState: {look: [-1, 0], ...(eyes ? {eyes} : {})}}, {t, view: 'left'})});
  },
  // the lower cabin falls into the dark under the dash, the light comes from the window behind her upper body: her lap and hands go into
  // shade (sheet "hands on the thighs (hidden)"; r4 clean frames had lit hands in the caption band, p95 0.73). Boss W5.2f FX1 (SHEETS-R2
  // D-Q10): one smooth vertical gradient from y 1010 down replaces the six stepped washes (R1), which banded on the blouse; its stops follow
  // the R1 stack's summed cover (0 at 1010, ~0.68 from ~1250) so the caption band stays as dark as R1.
  overlay: () => <LapShade />,
});

const SHADE_STOPS: [number, number][] = [[1010, 0], [1050, 0.11], [1090, 0.23], [1130, 0.35], [1170, 0.46], [1210, 0.56], [1250, 0.64], [1300, 0.7]];
const LapShade = () => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <linearGradient id="ep21-sh12-lap" gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={1010} y2={1300}>
        {SHADE_STOPS.map(([y, a]) => <stop key={y} offset={(y - 1010) / 290} stopColor="#111418" stopOpacity={a} />)}
      </linearGradient>
    </defs>
    <rect x={0} y={1010} width={1080} height={910} fill="url(#ep21-sh12-lap)" />
  </svg>
);

import {camMove, camOf} from '../../kit/cam-moves';
import type {YCam} from '../../kit/ycam';
import {FR_DONE} from '../car';
import {HANDS, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {horizonY} from '../road';
import {makeShot} from '../shot';

// B05-SH11 · G930-1011 · damaged car, person inside (L10). EDU-EP21-SHEETS-R1 shot block (SD07); Boss W5.2 BG4, 2026-11-16.
// Camera `cam((0.2, 0.7, 0.2), 48->54, 4.6->4.5, 2.4, 1200, 720, -16->-18)` on u = L / 80, linear: a high oblique over the nose, arcing toward
// it. CAR21 sagging on the flat FR (0.09 m since SHEETS-R2 SD17, `SAG_SH11`; car.ts `sagCam`: body, glass, cabin and DRIVER rigid together; the tyres stay on the road), the
// FR scorch and the open split as SH08 left them (matte, no glow, no steam: "nothing burns or smokes"); dash dark. DRIVER `facing +x`, a dim
// figure through the glass (tint 0.3), `neutral`, hands on the thighs, still. Live tone, the low sky band 5 % warmer toward #b8a48a
// (road.ts `warm`). Far sky flicker once at L30 (G960): the cloud base lit from behind, no bolt (L30 full, L31 trailing).

export const CAM = camMove([0.2, 0.7, 0.2], [48, 54], [4.6, 4.5], 2.4, {f: 1200, hy: 720, pitch: [-16, -18]});
const N = 81;
export const camAt = (L: number): YCam => camOf(CAM, L / (N - 1));
/** SHEETS-R2 SD17 (D-Q19), this lens only: the body sags 0.09 m at the FR corner and the tread spreads for 0.09 m (car.ts `FrDamage.sag`),
 *  the hub drops `HUB_SH11` so the arch comes down onto the flat tyre (Boss FX2, chosen by fx2-measure.ts). SH10/SH12/SH13 keep 0.06 m. */
export const SAG_SH11 = 0.09;
export const HUB_SH11 = 0.03;
const flick = (L: number) => (L === 30 ? 1 : L === 31 ? 0.35 : 0);

/** Far sky flicker: the cloud base screen-lit from behind, left of the car, above the horizon only. */
const SkyFlicker = ({c, level}: {c: YCam; level: number}) => {
  if (level <= 0) return null;
  const hz = horizonY(c);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: 0.42 * level}}>
      <defs><radialGradient id="ep21-sh11-fl" cx={230} cy={hz - 90} r={620} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#dfe6f2" stopOpacity={1} /><stop offset="0.5" stopColor="#9aa8bc" stopOpacity={0.45} /><stop offset="1" stopColor="#9aa8bc" stopOpacity={0} />
      </radialGradient>
        <linearGradient id="ep21-sh11-hz" x1={0} x2={0} y1={0} y2={hz} gradientUnits="userSpaceOnUse"><stop offset="0.8" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
        <mask id="ep21-sh11-sky" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}><rect width={1080} height={hz} fill="url(#ep21-sh11-hz)" /></mask></defs>
      <rect width={1080} height={hz} fill="url(#ep21-sh11-fl)" mask="url(#ep21-sh11-sky)" />
    </svg>
  );
};

export const shot = makeShot({
  id: 'B05-SH11', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camAt(L), t = G / 30;
    paintExterior(p, c, {t, warm: 0.05, car: {inkBreakWheels: true, sag: SAG_SH11, frDamage: {...FR_DONE, hub: HUB_SH11},
      inside: (q, cc) => paintDriverAt(q, cc, {face: 'neutral', hands: HANDS.thighs, tint: 0.45}, {t})}});
    paintRain(p, t);
  },
  overlay: (L) => <SkyFlicker c={camAt(L)} level={flick(L)} />,
});

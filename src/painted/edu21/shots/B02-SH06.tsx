import {camMove, camOf} from '../../kit/cam-moves';
import {mixColor} from '../../kit/painter';
import type {YCam} from '../../kit/ycam';
import {HANDS, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {Chip, EXPLAIN_TUFTS, paintNearShade, plateGlow, sm, wetPolys} from '../explain';
import {GlowLight, paintRouteGlow, type GlowStage} from '../glow';
import {toneMix} from '../road';
import {makeShot} from '../shot';

// B02-SH06 · G408-548 · the route around her (L05). EDU-EP21-SHEETS-R1 shot block; Boss W5.2 BG3, 2026-11-16.
// Camera `cam((0.4, 0.7, 0), 38->36, 4.3->4.1, 0.65, 880, 940)` (LF03 lens), linear over L0-139 (u = L / 139, so the last frame is exactly
// the camera SH10 starts on, SD02). World tone live -> `TONE_EXPLAIN` L0-6; chip (N7, text final 2026-11-17) fades in L6-12; route glow N6 (LF03
// design): roof and greenhouse frame L11-28, the run along the rails and the near shoulder nose -> tail L28-62, flank and ends L44-74
// (full coat at L74), greenhouse ridges around her window +20 % L81-109 (she stays unlit, in full colour), flank gradient to the sill and
// the road pool 0 -> full with its mirror L115-140. DRIVER `facing +x`, view `right` held as LF03, `neutral`, hands on the thighs.
// Plate design (BG3, LF03 known defects): flank red-orange (defect 3), pool tight under the car and its ends, the wet road's reflection
// falling off toward the lens (fresnel) so the caption band 1176-1344 passes; verge puddles and the LF03 tufts (defects 1, 2, 4 from BG1).
// Rain thins from the live 220 marks to the LF03 explanatory 150 with the tone.

export const CAM = camMove([0.4, 0.7, 0], [38, 36], [4.3, 4.1], 0.65, {f: 880, hy: 940});
const N = 140;
const camAt = (L: number): YCam => camOf(CAM, L / (N - 1));
/** The glow's stage at shot frame L (sheet timings). */
const stageAt = (L: number): GlowStage => ({roof: sm(L, 11, 28), run: sm(L, 28, 62), flank: sm(L, 44, 74), ridge: sm(L, 81, 109), sill: sm(L, 115, 140), pool: sm(L, 115, 140)});

export const shot = makeShot({
  id: 'B02-SH06', N, paper: '#2c333c',
  paint: (p, L, G) => {
    const c = camAt(L), t = G / 30, tk = sm(L, 0, 6), T = toneMix(tk), st = stageAt(L), PLATE = plateGlow(c);
    paintExterior(p, c, {t, tone: T, puddles: true, tufts: EXPLAIN_TUFTS,
      car: {inside: (q, cc) => paintDriverAt(q, cc, {face: 'neutral', hands: HANDS.thighs}, {t, view: 'right'})},
      underCar: (q, cc) => paintRouteGlow(q, cc, {phase: 'road', under: true, stage: st, plate: PLATE}),
      overCar: (q, cc) => paintRouteGlow(q, cc, {phase: 'road', stage: st, plate: PLATE})});
    paintNearShade(p, c, 1);
    paintRain(p, t, {count: Math.round(220 - 70 * tk), color: mixColor('#b4c2cc', '#9aa6b0', tk)});
  },
  overlay: (L) => {
    const c = camAt(L);
    return <>
      <GlowLight c={c} wet={wetPolys(c)} stage={stageAt(L)} plate={plateGlow(c)} />
      <Chip o={sm(L, 6, 12)} />
    </>;
  },
});

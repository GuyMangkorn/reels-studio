import {camMove, camOf} from '../../kit/cam-moves';
import {paintCabin} from '../cabin';
import {HANDS, paintDriverAt} from '../driver';
import {paintRoadSet, paintStormSky, TONE_LIVE} from '../road';
import {makeShot} from '../shot';

// B01-SH04 · G223-315 · the shell around her (L03). EDU-EP21-SHEETS-R1 shot block; Boss W5.2 BG2, 2026-11-16. Start = LF02 (approved r3).
// Camera `cam((0.3, 1.0, 0.3), -104->-106, 1.35->1.42, 1.08, 760, 820)`, near 0.12, over L0-92, linear (pull-back from the rear seat).
// Boss W5.2f FX1 (SHEETS-R2 SD14, D-Q7): end yaw -100 -> -106 so the headrest no longer sits on her head from L60.
// DRIVER `facing +x`, back view behind her seat back, hands on the thighs (hidden), `neutral`, still; cabin tint 0.12. Dash and cluster
// dark, unremarked (CL21-03); the radio unit carries its power button for SH09 continuity. Rain runs down the glass on G. On "รอบคุณ"
// (G290, L67) the roof lining and both A-pillars catch a faint cool sheen (+8 % value) L67-80, no glow.

export const CAM = camMove([0.3, 1.0, 0.3], [-104, -106], [1.35, 1.42], 1.08, {f: 760, hy: 820});
const N = 92;

/** Sheen level: rises L67-70, holds, gone by L80. */
const sheenAt = (L: number) => (L < 67 ? 0 : L < 70 ? (L - 67) / 3 : L < 76 ? 1 : L < 80 ? (80 - L) / 4 : 0);

export const shot = makeShot({
  id: 'B01-SH04', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = {...camOf(CAM, L / N), near: 0.12}, t = G / 30, o = {t, tone: TONE_LIVE};
    paintStormSky(p, c, o);
    paintRoadSet(p, c, o);
    paintCabin(p, c, {t, dashGlow: false, rainRun: true, sheen: sheenAt(L), radio: {light: 0, press: 0},
      driver: (q, cc) => paintDriverAt(q, cc, {face: 'neutral', hands: HANDS.thighs, tint: 0.12}, {t})});
  },
});

import {camOf} from '../../kit/cam-moves';
import {dogClock, ease, frac, NOSE_AHEAD} from '../motion19';
import {makeShot} from '../shot';
import {sheetMove, sine01, type FieldShotDef} from '../stage';
import {printZ, ROUND1_FIVE, trailPrints} from '../trail';

// B01-SH03 · G 162-252 (90 f) · "รู้ได้ไง" (L02; EDU-EP19-SHEETS-R3, camera R2 hy 760). Macro on the nose: the camera arcs and pushes l 0-65
// (easeInOutSine), then a 2 % drift. The dog in right profile (as SH02), nose over print x 0 (lit S3) l 0-30 with sniff dips, then walks the nose
// to print +0.6 (lit S4, already lit in SH02) by l 50 on the distance gait clock. On "รู้ได้ไง" (G 226, l 64) the sniffing stops, the ears lift
// (`earLift` 0.55, ~10 deg) and the head lifts 3 deg, held to l 90. The sheet's "eyes flick up toward the lens" has no kit control in profile (the
// profile dog eye has no look): the ear lift and the stopped nose carry the pause (Film note).
const N = 90;
const M = sheetMove([[0.1, 0.1, -0.05], [0.5, 0.1, -0.05]], [12, 6], [0.95, 0.85], 0.32, {f: 1000, hy: 760});
const noseX = (L: number) => 0.6 * ease(frac(L, 30, 50));

export const B01_SH03: FieldShotDef = {
  id: 'B01-SH03', N,
  cam: (L) => { const c = camOf(M, sine01(L / 65)); return {...c, f: c.f * (1 + 0.02 * frac(L, 65, 90))}; },
  state: (L) => {
    const t = L / 30, s = noseX(L), walking = L > 30 && L < 50, stop = ease(frac(L, 64, 68));
    const dip = L < 64 ? 0.88 + 0.1 * Math.max(0, Math.sin((2 * Math.PI * L) / 12)) : 0.92;
    return {sun: 'B01', t, prints: trailPrints(), stack: false,
      dog: {at: [s - NOSE_AHEAD, 0, 0], pose: {view: 'right', state: 'stand', sniff: dip, ...(walking ? {walk: dogClock(s), stride: Math.sin(Math.PI * frac(L, 30, 50))} : {}), earLift: 0.55 * stop, tilt: -3 * stop}},
      line: [1.6, 1.2, 0.6], nearShade: 1160};
  },
  // All five round-1 prints stay lit from SH02 (continuity across the cut); in this macro only x 0 (S3) and +0.6 (S4) are in frame.
  glow: () => ROUND1_FIVE.map(({x, level}, k) => ({at: [x, 0, printZ(x)], level, k: 1, seed: k})),
};
export const shot = makeShot(B01_SH03);

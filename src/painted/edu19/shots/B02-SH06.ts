import type {V3} from '../../kit/space';
import {dogClock, ease, frac, lerp, watchRead} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {glowRamp, printZ, trailPrints} from '../trail';

// B02-SH06 · G 940-991 (51 f) · it still picks the right way (L05b; EDU-EP19-SHEETS-R3, camera R2). The dog turns (front, looking screen right,
// l 0-6; cut-on-turn to right profile at l 6) and trots off toward +x, (0, 0, -0.45) -> (2.2, 0, 0) by l 51, on the run gait's distance clock;
// the line is unclipped (none drawn). MUM behind at (0.35, 0, -3.0), front, `new: stopwatch-read` l 0-20 (left wrist up to eye level, held),
// lowers l 22-30 and looks after the dog, eyebrows up (amused). Round-2 glow ahead of the nose (S3 at most): each print lights within 0.7 m.
const N = 51;
const M = sheetMove([[0.5, 0.6, -1.2], [1.2, 0.6, -1.0]], [10, 16], [3.0, 2.8], 1.3, {f: 1050, hy: 820, pitch: [-9, -9]});
const D0: V3 = [0, 0, -0.45], D1: V3 = [2.2, 0, 0];
const MUM_AT: V3 = [0.35, 0, -3.0];
const TROT_NOSE = 0.55;
const dogU = (L: number) => frac(L, 6, N) ** 1.15;
const AHEAD = trailPrints().filter((q) => q.at[0] > -0.2 && q.at[0] < 3.2);

export const B02_SH06: FieldShotDef = {
  id: 'B02-SH06', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const c = sheetCam(M, L, N), u = dogU(L), at: V3 = [lerp(D0[0], D1[0], u), 0, lerp(D0[2], D1[2], u)], s = Math.hypot(at[0] - D0[0], at[2] - D0[2]);
    const read = ease(frac(L, 0, 10)) * (1 - ease(frac(L, 22, 30)));
    return {sun: 'B02', t: L / 30, prints: trailPrints(), stack: false,
      dog: {at, pose: L < 6 ? {view: 'front', state: 'stand', look: 0.7 * ease(frac(L, 0, 5)), wag: 0.3} : {view: 'right', state: 'stand', gait: 'run', walk: dogClock(s, 'run'), wag: 0.6}},
      mum: {at: MUM_AT, view: 'front', pose: 'P01', face: L < 24 ? 'neutral' : 'surprised', faceState: L >= 24 ? {mouth: 'smile', look: [0.6, 0.1]} : {look: [-0.3, 0.4]}, fig: watchRead(c, MUM_AT, read)}};
  },
  glow: (L) => {
    return AHEAD.map((q) => {
      // Light when the nose first comes within 0.7 m (frame found by search, 6 f ramp; VD04); round-2 levels S1-S3, rising with x.
      let on = N + 10;
      for (let f = 0; f < N; f++) { const n = lerp(D0[0], D1[0], dogU(f)) + (f < 6 ? 0 : TROT_NOSE); if (Math.abs(n - q.at[0]) < 0.7) { on = f; break; } }
      const level = 0.08 + 0.09 * Math.min(1, Math.max(0, (q.at[0] + 0.2) / 3.4));
      return {at: [q.at[0], 0, printZ(q.at[0])], level, k: glowRamp(L / 30, on / 30, 1), seed: 40 + q.i};
    });
  },
};
export const shot = makeShot(B02_SH06);

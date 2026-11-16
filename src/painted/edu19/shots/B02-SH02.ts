import type {V3} from '../../kit/space';
import {frac, girlRunPhase, watchPress} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B02-SH02 · G 591-676 (85 f) · "แม่ รอยี่สิบนาทีนะ…" (V02; EDU-EP19-SHEETS-R3, camera R2). Truck with GIRL: P38 run in right profile from the swing
// (-5.4, 0, 0) to (-1.2, 0, 0) over l 0-85 (1.5 m/s, a tiptoe skip-run along z 0; R3 85 f, path unchanged), her head facing the run toward MUM
// (fix round 1; was `head: 'left'`) while she calls. The run phase comes from the distance run (`new: girl-run-noslide`, motion19.ts), so the
// stance foot holds. New prints appear under her feet (no glow): the trail exists only behind her. MUM at the gate (0.2, 0, -5.0), front, the line
// in her left hand to the dog sitting at her left (-0.5, 0, -4.9); on "ยี่สิบนาที" (~G 612, l 21) she presses the stopwatch (`new:
// stopwatch-press`: left wrist up, right index on it) l 14-21, holds to l 34, lowers by l 44.
const N = 85;
const M = sheetMove([[-4.9, 0.7, -0.8], [-1.5, 0.7, -0.8]], [8, 0], 3.6, 1.7, {f: 1000, hy: 860, pitch: [-10, -10]});
const X0 = -5.4, X1 = -1.2;
const girlX = (L: number) => X0 + (X1 - X0) * Math.min(1, Math.max(0, L / N));
const MUM_AT: V3 = [0.2, 0, -5.0];

export const B02_SH02: FieldShotDef = {
  id: 'B02-SH02', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const x = girlX(L), c = sheetCam(M, L, N), press = frac(L, 14, 21) * (1 - frac(L, 34, 44));
    return {sun: 'B01', t: L / 30, prints: trailPrints().filter((q) => q.at[0] <= x + 0.05),
      // Fix round 1 (user 2026-11-16): the head faces the run (MUM at the gate is ahead of her, +x), not back over the shoulder; `jaw: 0` keeps
      // the chin line still while she calls (the profile jaw drop read as a swollen cheek, "like mumps").
      girl: {at: [x, 0, 0], view: 'right', pose: 'P38', face: 'talk', faceState: {jaw: 0}, fig: {run: girlRunPhase(x - X0)}},
      mum: {at: MUM_AT, view: 'front', pose: 'P01', face: 'happy', fig: watchPress(c, MUM_AT, press)},
      dog: {at: [-0.5, 0, -4.9], pose: {view: 'front', state: 'sit', wag: 0.3}},
      line: 'mum'};
  },
};
export const shot = makeShot(B02_SH02);

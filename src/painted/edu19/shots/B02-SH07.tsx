import {animalMotion} from '../../kit/animal-motions';
import type {V3} from '../../kit/space';
import {DOG} from '../cast';
import {F} from '../field';
import {ease, frac, lerp3} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B02-SH07 · G 991-1037 (46 f) · "ห๊ะ!? ยังได้อีก" (V04; EDU-EP19-SHEETS-R3, camera R1). GIRL standing at G1, front, P12 surprise_cover_mouth from
// l 4 on "ห๊ะ!?" (shock), held to the cut; the DOG's head pops round the trunk (screen left) at l 10, tongue out (`happy-wag`, front). Light a
// touch cooler (setback): a flat blue-grey multiply over the plate at 8 % (overlay; the sun stays the B02 key).
const N = 46;
const M = sheetMove([6.7, 0.9, -0.4], [-24, -18], [1.4, 1.3], 1.2, {f: 1000, hy: 640});
/** Dog behind the trunk (picture x ~290, trunk -100..350), slides out past its right edge toward GIRL l 10-16 (x ~430): the head pops round the
 *  trunk on the screen-left side of the frame (the sheet's (162, 1012) sits inside the trunk from this camera; Film note). */
const HID: V3 = [5.6, 0, -1.3], OUT: V3 = [5.95, 0, -1.35];

export const B02_SH07: FieldShotDef = {
  id: 'B02-SH07', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const wag = animalMotion('happy-wag', Math.max(0, L - 10) / 30, {animal: DOG, view: 'front'}).pose;
    return {sun: 'B02', t: L / 30, prints: trailPrints(), stack: false,
      girl: {at: F.G1, view: 'front', pose: L >= 4 ? 'P12' : 'P01', face: L >= 4 ? 'shock' : 'smug'},
      dog: {at: lerp3(HID, OUT, ease(frac(L, 10, 16))), pose: {...wag, view: 'front', state: 'stand', mouth: 'open', look: 0.5}, bias: 0.3}};
  },
  overlay: () => <div style={{position: 'absolute', inset: 0, background: '#6f8fb0', mixBlendMode: 'multiply', opacity: 0.08}} />,
};
export const shot = makeShot(B02_SH07);

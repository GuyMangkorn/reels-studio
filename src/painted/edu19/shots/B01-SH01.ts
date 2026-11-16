import type {V3} from '../../kit/space';
import {dogClock, ease, frac, lerp3} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B01-SH01 · G 0-48 (48 f) · the dog comes in (L01 start; EDU-EP19-SHEETS-R3, camera R2). LF01 = l 0 (frame 0 holds the setup: dog + harness + line
// + MUM + GIRL peeking at the tree + the mat stack by the fence; no glow). Camera R2 (FR): from the swing side, eye 1.8, pitch -9, so the trail runs as
// a diagonal from the frame bottom to the tree; 6 deg arc, 11 % push, easeInOutSine. W5: the dog and MUM walk on their gait clocks (front views:
// the dog's paws on the distance clock, MUM's walk phase 1 cycle per 1.3 m), the dog's nose dips from l 36 (kit `headLow`, fix round 1: the head lowers between the forelegs instead of sliding down the chest), GIRL pulls back behind the trunk l 24-34.
const N = 48;
const M = sheetMove([[2.2, 0.5, -2.2], [2.1, 0.5, -1.9]], [56, 50], [5.6, 5.0], 1.8, {f: 950, hy: 720, pitch: [-9, -9]});
const lin = (a: number, b: number, L: number) => a + (b - a) * Math.min(1, Math.max(0, L / N));
/** GIRL ground point for P43 (R2 vantage): behind the trunk on the camera's sight line, shifted to its +z edge so the head comes out at GP
 *  (brief set plan GP (6.45, 1.15, -0.05); sheet: head at the right frame edge, x ~1036-1040). HIDE: pulled back behind the trunk (l 24-34). */
const PEEK: V3 = [6.45, 0, -0.05], HIDE: V3 = [6.75, 0, -0.75];

export const B01_SH01: FieldShotDef = {
  id: 'B01-SH01', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const dz = lin(-3.2, -0.6, L) + 3.2, mz = lin(-4.4, -3.0, L) + 4.4;
    return {
      sun: 'B01', t: L / 30, prints: trailPrints(),
      dog: {at: [0, 0, -3.2 + dz], pose: {view: 'front', state: 'stand', walk: dogClock(dz * 0.5), stride: 1 - 0.4 * frac(L, 36, 48), sniff: L > 36 ? (L - 36) / 12 * 0.4 : 0, headLow: true}},
      mum: {at: [0.75, 0, -4.4 + mz], view: 'front', pose: 'P01', face: 'happy', fig: {walk: mz / 1.3}},
      // P43 turns the head to screen right (away from the dog in this vantage); she watches the dog, so the head faces the lens (W3.3).
      girl: {at: lerp3(PEEK, HIDE, ease(frac(L, 24, 34))), view: 'front', pose: 'P43', face: 'smug', bias: 0.2, fig: {head: 'front'}},
      line: 'mum',
    };
  },
};
export const shot = makeShot(B01_SH01);

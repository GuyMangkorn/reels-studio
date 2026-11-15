import {camUnit} from '../../kit/ycam';
import type {V3} from '../../kit/space';
import {paintMitten} from '../cast';
import {ease, ramp} from '../clock';
import {RF, ROOF} from '../roof';
import {SH01_AT} from '../scenes-roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B01-SH02 L01 [30, 119) (sheet #2). Camera: A = orbit((-0.08, 0.82, 0.04), 0.70, -20, 0.86, 950, 700, 0) -> B = orbit((-0.30, 0.42, 0.30), 0.62,
// -12, 0.62, 1000, 900, -14); hold +0..+10, push and tilt down (eased) +10..+69, hold +69..+88. Staging: her side-on at SH01_AT, happy grin; +8..+23 the
// left hand comes up to the near (left) headphone cup and presses it, held to +63, back to her knee by +84; the right hand keeps its LF-ROOF reach and
// its fingertip comes down from LF-ROOF's hover to about 3 cm over the lit button by +67 (continuity with SH01; the sheet's "reaches in" is the
// camera tilting down onto it). The button clears the caption band from +59.
const A: Orbit = {at: [-0.08, 0.82, 0.04], r: 0.7, az: -20, eye: 0.86, f: 950, hy: 700, pitch: 0};
const B: Orbit = {at: [-0.3, 0.42, 0.3], r: 0.62, az: -12, eye: 0.62, f: 1000, hy: 900, pitch: -14};
const KNEE: V3 = [-0.16, 0.36, 0.08], CUP: V3 = [0.11, 0.86, 0.09];
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const shot = makeShot('S01-B01-SH02', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const c = orbitMix(A, B, ease(L, 10, 69));
    const press = ease(L, 8, 23) * (1 - ease(L, 63, 84));
    const b = ROOF.button, hover = 0.01 + 0.02 * ease(L, 21, 67); // LF-ROOF aims 1 cm over the cap (tip lands about 2 cm above); +2 cm by +67
    const a = paintRoofWoman(p, c, roofState('S01-B01-SH02', G), {
      w: {t: 0.4 + G / 30, faceState: {mouth: 'grin'}, ...(press > 0.02 ? {lReach: lerp3(KNEE, CUP, press), lVia: lerp3([-0.02, 0.45, 0.1], [0.03, 0.6, 0.16], press), mitts: []} : {})},
      point: [b[0], b[1] + hover, b[2]],
      fall: [1150, 60 + 60 * ease(L, 10, 69)], // W5.2: the lit crate top tilts into the caption band; the falloff deepens with the tilt (p95 0.56 -> target 0.40)
    });
    // the wrist target sits about 3 cm under the cup centre so the mitten (wrist -> fingers) lies on it; the pressing hand (painted after the headphones, which the figure pass draws last)
    if (a && press > 0.02) paintMitten(p, a, {hand: 'l', kind: 'rest', side: 1, skin: '#c9ad95', unit: camUnit(c, SH01_AT), seed: 53140});
  },
});

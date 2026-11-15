import {lookUp} from '../../kit/poses-seated-reach';
import {ease} from '../clock';
import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B04-SH12 L18 [731, 803) (sheet #12). Camera: orbit((-0.16, 0.66, 0.08), 1.30, -10, 0.72, 1000, 700, +4) -> orbit((-0.20, 0.70, 0.06), 1.05, -12,
// 0.72, 1000, 540, +5): push +0..+63 (80 % of the move), then the push to her eyes +63..+71. Staging: her side-on at SH01_AT, worried; she stares down-left
// at the flat line to +24, then lifts her eyes to the black sky on "ที่กล้าส่งเสียงออกมา" (+24..+30); coldest roof grade yet (cool 0.5). IM2 is entered
// through her eyes (Editor's iris at SH13), never through a star.
const A: Orbit = {at: [-0.16, 0.66, 0.08], r: 1.3, az: -10, eye: 0.72, f: 1000, hy: 700, pitch: 4};
// Boss re-key (W5.2 r2; Film to confirm): at hy 540 the end frame put the label "ภาพจำลอง" (x 816-1020, y 148-204) on her head (head top y 158, the
// kit woman is taller than the sheet's `est`); hy 540 -> 590 lowers the end framing 50 px (camera position, direction and lens unchanged): her head
// top clears the label (y ~210); the button reaches the band's top edge at the end, so its lit cap is repainted over the falloff.
const B: Orbit = {at: [-0.2, 0.7, 0.06], r: 1.05, az: -12, eye: 0.72, f: 1000, hy: 590, pitch: 5};
export const shot = makeShot('S01-B04-SH12', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const lift = ease(L, 24, 30), up = lookUp('left', lift);
    paintRoofWoman(p, orbitMix(A, B, 0.8 * ease(L, 0, 63) + 0.2 * ease(L, 63, 71)), roofState('S01-B04-SH12', G), {
      w: {face: 'worried', t: 0.4 + G / 30, look: [-0.6 + 0.05 * lift, 0.4 + (up.look[1] - 0.4) * lift], ...(lift > 0 ? {fig: up.fig} : {})},
      fall: [1150, 110], relight: true, // caption zone: crate top and stool in the band
    });
  },
});

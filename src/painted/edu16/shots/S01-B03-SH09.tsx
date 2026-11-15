import {ell, washAt} from '../../kit/draw';
import {lookUp} from '../../kit/poses-seated-reach';
import {ease} from '../clock';
import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B03-SH09 L17 [571, 636) (sheet #9). Camera: orbit((-0.36, 0.50, 0.16), 0.62, -14, 0.48, 1050, 520, +14, near 0.1) -> orbit((-0.35, 0.51, 0.15),
// 0.60, -14, 0.48, 1050, 520, +15), slow push +0..+64: the screen in the lower-left foreground, her face behind it frame-right, the button at the band's
// top edge. Staging: her side-on at SH01_AT, worried; eyes on the screen (down-left) to +36, then up (+36..+42) and frame-left off-frame toward the star on
// "หลายสิบปีก่อน" (+38). Green spill on her face (a small premixed glaze). Rack focus screen -> eyes is `unknown` in the painted kit: both layers are
// painted sharp (sheet fallback; recorded in build notes).
// Boss re-key (W5.2 r2, feasibility; Film to confirm): with the kit woman her head card sits at about (0.13, 1.04, 0.18) m, not the sheet's `est`
// (0.02, 0.92, -0.02), so at f 1050 her face fell outside the frame (projected (1145, 55)). Same camera positions and direction; lens f 1050 -> 715
// with the principal point moved (hy 520 -> 720, cx -84) so the screen sits near the sheet's (278, 1068) and her head clears the label.
const A: Orbit = {at: [-0.36, 0.5, 0.16], r: 0.62, az: -14, eye: 0.48, f: 715, hy: 720, cx: -84, pitch: 14, near: 0.1};
const B: Orbit = {at: [-0.35, 0.51, 0.15], r: 0.6, az: -14, eye: 0.48, f: 715, hy: 720, cx: -84, pitch: 15, near: 0.1};
export const shot = makeShot('S01-B03-SH09', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const lift = ease(L, 36, 42), up = lookUp('left', lift);
    const a = paintRoofWoman(p, orbitMix(A, B, ease(L, 0, 64)), roofState('S01-B03-SH09', G), {
      w: {face: 'worried', t: 0.4 + G / 30, look: lift > 0 ? [-0.55, 0.35 + (up.look[1] - 0.35) * lift] : [-0.6, 0.4], ...(lift > 0 ? {fig: up.fig} : {})},
      fall: [1150, 112], // caption zone: crate top and box front in the band
    });
    // the screen's green on the near side of her face (a low-opacity glaze)
    if (a) { const r = (a.chin - a.headTop) * 0.5; washAt(p, 54100, RF.trace, 16, ell(a.head[0] - r * 0.5, a.head[1] + r * 0.2, r * 0.6, r * 0.7, 18), 0, 0); }
  },
});

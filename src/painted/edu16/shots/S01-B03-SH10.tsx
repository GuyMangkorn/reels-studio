import {ease} from '../clock';
import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B03-SH10 L14 [636, 675) (sheet #10). Camera: orbit((-0.50, 0.37, 0.231), r 0.30 -> 0.26, az 0, eye 0.40 -> 0.39, f 1200, hy 900, pitch -5 -> -4,
// near 0.05), push +0..+36 and stop dead at +36 (ease-in, no ease-out: the move halts on the last spike). ECU trace, green dominant; spikes on the blip
// clock at f651 (+15) and f672 (+36, the last). SH11 holds this end camera. The lit crate top sits in the caption band: low falloff [1130, 115].
export const SH10_A: Orbit = {at: [-0.5, 0.37, 0.231], r: 0.3, az: 0, eye: 0.4, f: 1200, hy: 900, pitch: -5, near: 0.05};
export const SH10_B: Orbit = {...SH10_A, r: 0.26, eye: 0.39, pitch: -4};
const pushTo = (L: number) => { const u = Math.max(0, Math.min(1, L / 36)); return u < 0.4 ? ease(u, 0, 0.8) : 0.5 + (u - 0.4) / 0.6 * 0.5; }; // eased start, linear to the dead stop
export const shot = makeShot('S01-B03-SH10', {
  paper: RF.zen,
  paint: (p, L, G) => {
    paintRoofWoman(p, orbitMix(SH10_A, SH10_B, pushTo(L)), roofState('S01-B03-SH10', G), {fall: [1130, 115]});
  },
});

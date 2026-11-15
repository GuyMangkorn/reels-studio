import {ease, ramp} from '../clock';
import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B05-SH16 L08 a [1097, 1125) (sheet #17). Iris-out from SH15S's black bubble through her eyes [1097, 1109) is the timeline's. Camera:
// orbit((0.02, 0.90, -0.02), r 0.62, az -57, eye 0.92, f 1000, hy 780, pitch 0, near 0.1), held with a 1 % drift (r 0.62 -> 0.614). WOMAN `front`,
// `worried`, seated-reach-hover (the LF-ROOF reach; hand out of frame), alive and lamp-lit (warm under-key 0.5), cold sky behind; receiver, bulb,
// button and rocker behind the lens or off-frame (D2). She swallows +14..+23: the head dips 1 cm and the chin tucks, then settles; mouth flat.
// Boss re-key (W5.2 r3, feasibility; Film to confirm): the kit woman stands taller in picture than the sheet's `est` (as SH05/SH09/SH12): at hy 780
// her eyes sat at y ~540 and the head top at ~120 (sheet: eye 850, head top 457); hy 780 -> 1090 lowers the framing 310 px (camera position, direction
// and lens unchanged) so the eyes land near the sheet's y 850.
const A: Orbit = {at: [0.02, 0.9, -0.02], r: 0.62, az: -57, eye: 0.92, f: 1000, hy: 1090, pitch: 0, near: 0.1};
const B: Orbit = {...A, r: 0.614};
export const shot = makeShot('S01-B05-SH16', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const sw = Math.sin(Math.PI * ramp(L, 14, 23));
    paintRoofWoman(p, orbitMix(A, B, ease(L, 0, 28)), roofState('S01-B05-SH16', G), {
      w: {view: 'front', face: 'worried', t: 0.4 + G / 30, warm: 0.5, look: [-0.15, 0.05], faceState: {mouth: 'flat'}, fig: {headPitch: 0.08 * sw, nod: [0, 0.012 * sw]}},
      point: null, fall: [1180, 90],
    });
  },
});

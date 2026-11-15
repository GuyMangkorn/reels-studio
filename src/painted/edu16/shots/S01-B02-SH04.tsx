import {lookUp} from '../../kit/poses-seated-reach';
import {ease, ramp} from '../clock';
import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B02-SH04 V01 [163, 234) (sheet #4; label off). Camera: orbit((0.02, 0.88, -0.02), r 0.95 -> 0.90, az -55 -> -47, eye 0.62, f 950, hy 900,
// pitch +17), arc eased +0..+70: low, in front of her from the crate side, looking up past her face to the NE sky. WOMAN `front` (her facing 35-43 deg
// off the lens axis: four views squared to the lens), `look-up` (headPitch, eased in by +4), eyes up and frame-left off-frame to the star where the dish
// points (D4); happy half laugh on "ทำไมล่ะ" (+4), brows up on "ถ้าเขาใจดีล่ะ" (+22). The lamp's warm under-key on her near cheek (warm 0.45).
const A: Orbit = {at: [0.02, 0.88, -0.02], r: 0.95, az: -55, eye: 0.62, f: 950, hy: 900, pitch: 17};
const B: Orbit = {...A, r: 0.9, az: -47};
export const shot = makeShot('S01-B02-SH04', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const up = lookUp('front', ease(L, 0, 4), {lookX: -0.55});
    paintRoofWoman(p, orbitMix(A, B, ease(L, 0, 70)), roofState('S01-B02-SH04', G), {
      w: {view: 'front', t: 0.4 + G / 30, warm: 0.45, look: up.look, fig: up.fig, faceState: {mouth: L >= 4 ? 'grin' : 'smile', ...(ramp(L, 22, 26) > 0.5 ? {brow: 'up' as const} : {})}},
      fall: [1130, 85], // caption zone: her white shirt crosses the band (p95 0.58 at LF-ROOF's [1150, 60])
    });
  },
});

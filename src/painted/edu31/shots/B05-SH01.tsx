import {camPoint, mixYCam} from '../../kit/ycam';
import {paintBox} from '../../kit/world';
import {CCTV_STILL} from '../looks';
import {crtOnQuad, type CrtState} from '../screen31';
import {paintTvCorner, TV_SCREEN} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, ein, lin} from '../stage31';

// B05-SH01 · F [1151, 1240) · dark room: the TV clicks on (SCENE-R1 b05, LF05). The camera pushes toward the switched-off 27-inch CRT (ease-in,
// no ease-out: the move runs on into B05-SH02). Screen states on the CRT quad (`TV_SCREEN`, VD31-08 CRT preset in screen31.tsx): L0 dark glass
// with a faint room reflection; L1-7 click-on (a white line opening to the full raster); L7-24 the VD31-09 news bumper (globe, chrome swoosh,
// bevelled gold NEWS; no station, number or logo; 18 f); CCTV-STILL-01 from L25 to the end. The room takes the screen's blue-white spill from L1.
// Couch arm foreground left (-0.65..-0.30, 0..0.58, +0.25..+0.95; est), wiping out of frame left as the camera passes. No clock anywhere (VD31-11).
const N = 89, SHOT = 'B05-SH01';
const A = camOf({eye: [0.15, 0.95, 1.8], yaw: 0, pitch: -2, f: 900, hy: 560, near: 0.05}), B = camOf({eye: [0, 0.9, 0.27], yaw: 0, pitch: 0, f: 900, hy: 560, near: 0.05});
const CAM = (L: number) => mixYCam(A, B, ein(lin(L, 0, 88)));
export const crtAt = (L: number): CrtState => L < 1 ? {mode: 'off'} : L < 7 ? {mode: 'line', k: lin(L, 1, 7)} : L < 25 ? {mode: 'bumper', f: Math.min(17, L - 7)} : {mode: 'image', src: CCTV_STILL, pos: '50% 30%'};

export const def: Shot31 = {
  id: SHOT, N, paper: '#101218', vignette: 0.45,
  cam: CAM,
  fx: (L, c) => crtOnQuad(c, TV_SCREEN, crtAt(L)),
  paint: (p, L, c, pr) => {
    paintTvCorner(p, c, {spill: lin(L, 0.5, 3)});
    paintBox(p, c, 38700, {x0: -0.65, x1: -0.3, y0: 0, y1: 0.58, z0: 0.25, z1: 0.95}, '#2c2228', {top: 0.08}, {ink: true}); // couch arm
    if (pr) {
      const a = camPoint(c, TV_SCREEN[0]), b = camPoint(c, TV_SCREEN[2]);
      if (a && b) pr.lead('SCREEN', {top: a[1], bottom: b[1], left: a[0], right: b[0], x: (a[0] + b[0]) / 2});
    }
  },
};
export const shot = makeShot(def);

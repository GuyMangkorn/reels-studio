import {ease, lenOf} from '../clock';
import {makeShot} from '../shot';
import {MOON_DIR, paintSoi} from '../soi';
import type {YCam} from '../../kit/ycam';

// S01-B04-SH04 (G1027-1113): the Moon goes dark (L10). SD05 camera pos (1.10, 1.55, 2.70) looking at the Moon (az 13.2), pitch 5 -> 8, f 950, hy 880. Both standing, back to the
// lens, heads tilted up: CUS (1.30, 0, 0.55), VEN (0.50, 0, 0.40). The Moon fades to its unlit disc L63-83 and the moon rim on their hair fades with it.
const ID = 'S01-B04-SH04', N = lenOf(ID);
const DEG = Math.PI / 180;
const AZ = Math.atan2(-MOON_DIR[0], -MOON_DIR[2]);
const cam = (L: number): YCam => ({x: 1.1, y: 1.55, z: 2.7, yaw: -AZ, pitch: (5 + 3 * ease(L, 0, N - 1)) * DEG, f: 950, hy: 880});

export const shot = makeShot(ID, {
  paper: '#101a38',
  paint: (p, L, G) => {
    const fade = 1 - ease(L, 63, 83);
    paintSoi(p, cam(L), {t: G / 30, night: 1, stroke: 0, moon: fade, rim: fade,
      ven: {at: [0.5, 0, 0.4], view: 'back', pose: 'P01', pounding: false, front: true, fig: {headTilt: 0.5}},
      cus: {at: [1.3, 0, 0.55], view: 'back', pose: 'P01', fig: {headTilt: 0.5}}});
  },
});

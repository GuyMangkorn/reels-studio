import {mix, ease, lenOf, ramp} from '../clock';
import {Card} from '../overlay';
import {makeShot} from '../shot';
import {CUS_AT, JUP_DIR, MOON_DIR, paintSoi, STOOL2_NIGHT} from '../soi';
import type {V3} from '../../kit/space';
import type {YCam} from '../../kit/ycam';

// S01-B04-SH05 (G1331-1430): "+1 ชม." and Jupiter (L11). SD05/SD06 camera pos (1.10, 1.55, 2.70), pan right of SH04 (look az -0.8), pitch 4, f 950 -> 1007 (push 6 %), hy 820.
// +1 h night: both seated, back to the lens: CUS on stool 1, VEN on stool 2 moved beside him (SD07), her right arm rising to point at Jupiter L36-48. Jupiter fades in L22-30
// (R07: not drawn before). The card reappears at 00:00 on L0 and flips to "+1 ชม." L4-12.
const ID = 'S01-B04-SH05', N = lenOf(ID);
const DEG = Math.PI / 180;
const cam = (L: number): YCam => ({x: 1.1, y: 1.55, z: 2.7, yaw: 0.8 * DEG, pitch: 4 * DEG, f: 950 + 57 * ease(L, 0, N - 1), hy: 820});
const REST: V3 = [0.72, 0.78, 0.32], POINT: V3 = [0.62, 1.28, -0.05];
void MOON_DIR; void JUP_DIR;

export const shot = makeShot(ID, {
  paper: '#101a38',
  paint: (p, L, G) => {
    const u = ease(L, 36, 48), to: V3 = [mix(REST[0], POINT[0], u), mix(REST[1], POINT[1], u), mix(REST[2], POINT[2], u)];
    paintSoi(p, cam(L), {t: G / 30, night: 1, stroke: 0, stool2: STOOL2_NIGHT, moon: 0.0, rim: 0.15, jupiter: ramp(L, 22, 30),
      ven: {at: STOOL2_NIGHT, view: 'back', pose: 'P31', pounding: false, front: true, hands: {r: {to, out: 1}}, finger: u > 0},
      cus: {at: CUS_AT, view: 'back', pose: 'P31'}});
  },
  overlay: (L, G) => { const f = ramp(L, 4, 12); return <Card G={G} text={f >= 0.5 ? '+1 ชม.' : '00:00'} flip={L >= 4 && L < 12 ? f : undefined} />; },
});

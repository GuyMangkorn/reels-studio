// SET-ARM macro (B01-SH08 bullet-time arc; storyboard staging): a soft skin band (her forearm) across the lower frame above the caption band, the hero drop and the BB
// hanging above it, small frozen drops around, and her face far up and soft. Screen space at 48 px/mm; the arc is a parallax of the three depths by the camera yaw.
import {ell, hardFill, rectPts, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {GIRL_SKIN} from './bb';
import {sm} from './clock';
import {paintDrop14, REFRACT_NOAIR} from './drop';

export const AM = {u: 48, drop: [330, 700] as Pt, bbMm: 9, yaw: [50, 15] as const};
export const armYaw = (L: number) => AM.yaw[0] + (AM.yaw[1] - AM.yaw[0]) * sm(0, 78, L);
/** Screen position of the BB's centre (9 mm beside the drop in the arc plane). */
export const bbAt = (L: number): Pt => { const th = ((armYaw(L) - AM.yaw[1]) * Math.PI) / 180; return [AM.drop[0] + AM.bbMm * AM.u * Math.cos(th), AM.drop[1] - 4 * AM.u * 0.08 * Math.sin(th)]; };

export const paintArmMacro = (p: Painter, o: {L: number}) => {
  const th = ((armYaw(o.L) - AM.yaw[1]) * Math.PI) / 180, sin = Math.sin(th);
  // grey void with a faint warm wash (graded), her face far up and soft behind the drop
  hardFill(p, 29100, '#7d8587', rectPts(-20, -20, 1100, 1940));
  washAt(p, 29101, '#8d9598', 255, ell(540 - sin * 30, 420, 560, 520, 28), 0.5, 0.4);
  const fx = 700 - sin * 160;
  washAt(p, 29102, mixColor(GIRL_SKIN, '#8d9598', 0.55), 150, ell(fx, 330, 230, 290, 28), 0.5, 0.4);
  washAt(p, 29103, '#3d3b3a', 150, ell(fx - 20, 120, 270, 160, 24), 0.5, 0.4);
  washAt(p, 29104, '#4b4f52', 100, ell(fx + 40, 340, 40, 14, 12), 0.3, 0.3);
  // frozen small drops (1-2 mm), faint, at depths around
  for (let i = 0; i < 16; i++) {
    const X = (hash(29200 + i) - 0.5) * 30, Z = (hash(29210 + i) - 0.5) * 18, Y = (hash(29220 + i) - 0.3) * 20, d = 1 + hash(29230 + i), x = AM.drop[0] + (X * Math.cos(th) + Z * sin) * AM.u + 120, y = AM.drop[1] - Y * AM.u * 0.9 + 60;
    if (x > -50 && x < 1130 && Math.hypot(x - AM.drop[0], y - AM.drop[1]) > 180) paintDrop14(p.layer(0.5, 29300 + i * 300), [x, y], AM.u, {kind: 'sphere', size: d}, {refract: REFRACT_NOAIR, seed: 29300 + i * 40});
  }
  // forearm: a soft skin band across the lower frame (above the caption band), arcing with the camera
  const top = 1010 + sin * 40, tilt = sin * 70;
  const band = [[-60, top - tilt], [540, top - 30 + tilt * 0.2], [1140, top + tilt * 0.6], [1140, 1160], [-60, 1160]] as Pt[];
  hardFill(p, 29400, mixColor(GIRL_SKIN, '#ffffff', 0.12), band);
  washAt(p, 29401, mixColor(GIRL_SKIN, '#ffffff', 0.35), 140, [[-60, top - tilt + 4], [540, top - 26 + tilt * 0.2], [1140, top + tilt * 0.6 + 4], [1140, top + 60], [-60, top + 60 - tilt]], 0.4, 0.4);
  washAt(p, 29402, mixColor(GIRL_SKIN, '#3d2a20', 0.35), 130, [[-60, 1090], [1140, 1090], [1140, 1160], [-60, 1160]], 0.4, 0.4);
  // hero drop and the BB
  paintDrop14(p, AM.drop, AM.u, {kind: 'sphere', size: 5}, {refract: REFRACT_NOAIR, seed: 29600});
  // the BB is a screen layer (`BBBall`, above the grade)
};

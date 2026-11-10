// SET-CITY-TOPDOWN (N6; brief B01-SH07, ycam straight down, altitude 1,200 m -> 2.4 m). At 30 m (LF04) the camera sees the metre-scale set itself from above, so this
// module paints SET-BUSSTOP from straight above plus the lane and next row of roofs beyond the shophouses; the 1 km / 100 m LOD plates and the in-canvas blend are the SP2 work
// (not built for the look frame). Screen top = -z (behind the shelter), right = +x. LOOK-FRAME CODE.
import {ell, hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter} from '../kit/painter';
import {paintBox, qy, sphereAt, wFill, wInk} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {paintBusStop, SHELTER, type BusOpts} from './busstop';

export const topdownCam = (h: number, x = 0.25, z = 0.2): YCam => ({x, y: h, z, yaw: 0, pitch: (-89 * Math.PI) / 180, f: 1100, hy: 960});

export const paintCityTopdown = (p: Painter, c: YCam, o: BusOpts) => {
  hardFill(p, 30000, '#7d8a8f', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  // the school courtyard behind the wall (pale concrete, a painted court line) and the lane beyond the shophouses
  wFill(p, c, 30010, '#a8a597', qy(0, -16, 16, -26, -3.4));
  wInk(p, c, 30011, [[-6, 0.002, -12], [6, 0.002, -12], [6, 0.002, -7.5], [-6, 0.002, -7.5]], {color: '#e8e6dc', weight: 1.6});
  wFill(p, c, 30020, '#4a5155', qy(0, -20, 28, 23.4, 26));
  paintBusStop(p, c, o);
  // next row of flat roofs beyond the lane, water tanks
  for (let b = 0; b < 9; b++) {
    wFill(p, c, 30100 + b * 6, ['#8a8d8f', '#9a968c', '#7f8689'][b % 3], qy(12, -14 + b * 4, -10.1 + b * 4, 26, 40));
    if (b % 2) paintBox(p, c, 30106 + b * 6, {x0: -13 + b * 4, x1: -11.6 + b * 4, y0: 12, y1: 13.2, z0: 30, z1: 31.4}, '#6f8fa0', {}, {ink: true});
  }
  // the shelter roof's drip line: a pale strip along the lip so the roof reads as the stop
  const a = camPoint(c, [SHELTER.x0, SHELTER.yLip + 0.05, SHELTER.zLip]), b = camPoint(c, [SHELTER.x1, SHELTER.yLip + 0.05, SHELTER.zLip]);
  if (a && b) hardFill(p, 30200, '#e9f1f3', [[a[0], a[1] - 1.5], [b[0], b[1] - 1.5], [b[0], b[1] + 2], [a[0], a[1] + 2]]);
  void ell; void hash; void sphereAt;
};

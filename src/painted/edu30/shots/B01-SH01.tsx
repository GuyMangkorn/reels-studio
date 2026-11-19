import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B01-SH01 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 90;
const CAM = camLine({eye: [-3.2, 0.95, -3.4], yaw: 134.5, pitch: 6, f: 1450, hy: 640});
export const def: Shot30 = {
  id: 'B01-SH01', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

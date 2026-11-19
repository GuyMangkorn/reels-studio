import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B01-SH03 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 51;
const CAM = camLine({eye: [4.1, 1.58, -24.6], yaw: 0, pitch: -2, f: 1000, hy: 640});
export const def: Shot30 = {
  id: 'B01-SH03', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

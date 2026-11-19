import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B02-SH03 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 54;
const CAM = camLine({eye: [-0.2, 0.4, 9.8], yaw: -85, pitch: 8, f: 850, hy: 1000});
export const def: Shot30 = {
  id: 'B02-SH03', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

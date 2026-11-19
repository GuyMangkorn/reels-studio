import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B07-SH02 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 122;
const CAM = camLine({eye: [0.95, 3.9, 2.7], yaw: 4, pitch: 16, f: 1000, hy: 900});
export const def: Shot30 = {
  id: 'B07-SH02', N, paper: '#e8d8b8',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

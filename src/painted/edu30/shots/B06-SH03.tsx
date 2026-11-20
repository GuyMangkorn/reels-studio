import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B06-SH03 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 99;
const CAM = camLine({eye: [-1.0, 1.55, 2.4], yaw: 162, pitch: 0, f: 900, hy: 820});
export const def: Shot30 = {
  id: 'B06-SH03', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

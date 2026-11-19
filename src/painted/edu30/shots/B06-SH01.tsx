import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B06-SH01 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 110;
const CAM = camLine({eye: [-1.6, 0.6, -1.0], yaw: -6, pitch: 6, f: 1020, hy: 900});
export const def: Shot30 = {
  id: 'B06-SH01', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

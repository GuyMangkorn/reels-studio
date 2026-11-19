import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B07-SH01 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 118;
const CAM = camLine({eye: [-0.3, 1.0, 4.5], yaw: 0, pitch: 4, f: 1200, hy: 760});
export const def: Shot30 = {
  id: 'B07-SH01', N, paper: '#e8d8b8',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

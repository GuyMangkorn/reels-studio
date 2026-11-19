import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B05-SH01 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 60;
const CAM = camLine({eye: [-23.0, 2.4, 11.7], yaw: 60, pitch: -6, f: 1100, hy: 860});
export const def: Shot30 = {
  id: 'B05-SH01', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

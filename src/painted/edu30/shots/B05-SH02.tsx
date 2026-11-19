import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B05-SH02 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 84;
const CAM = camLine({eye: [-20.7, 2.0, 11.6], yaw: 0, pitch: 0, f: 950, hy: 860});
export const def: Shot30 = {
  id: 'B05-SH02', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

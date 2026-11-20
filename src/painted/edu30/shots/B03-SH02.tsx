import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B03-SH02 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 51;
const CAM = camLine({eye: [0, 18, 10], yaw: 0, pitch: -48, f: 800, hy: 860});
export const def: Shot30 = {
  id: 'B03-SH02', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

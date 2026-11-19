import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B06-SH02 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 36;
const CAM = camLine({eye: [0.3, 1.5, -3.15], yaw: -12.2, pitch: -2, f: 1000, hy: 760});
export const def: Shot30 = {
  id: 'B06-SH02', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

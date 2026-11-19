import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B02-SH04 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 98;
const CAM = camLine({eye: [-8.5, 1.3, 15.2], yaw: 0, pitch: 0, f: 900, hy: 860});
export const def: Shot30 = {
  id: 'B02-SH04', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

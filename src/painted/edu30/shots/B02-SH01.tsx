import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B02-SH01 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 155;
const CAM = camLine({eye: [0, 22, 12], yaw: 0, pitch: -40, f: 820, hy: 960});
export const def: Shot30 = {
  id: 'B02-SH01', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

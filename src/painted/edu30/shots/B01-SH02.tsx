import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B01-SH02 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 59;
const CAM = camLine({eye: [6.0, 1.5, -30], yaw: 200, pitch: 0, f: 900, hy: 820});
export const def: Shot30 = {
  id: 'B01-SH02', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

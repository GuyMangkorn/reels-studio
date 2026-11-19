import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B02-SH06 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 75;
const CAM = camLine({eye: [2.2, 1.55, -10.6], yaw: 190, pitch: -2, f: 1000, hy: 860});
export const def: Shot30 = {
  id: 'B02-SH06', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

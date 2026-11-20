import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B04-SH05 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 64;
const CAM = camLine({eye: [-1.6, 1.15, -4.75], yaw: 89.3, pitch: -2, f: 950, hy: 860});
export const def: Shot30 = {
  id: 'B04-SH05', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

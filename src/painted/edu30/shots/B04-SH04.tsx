import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B04-SH04 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 22;
const CAM = camLine({eye: [-5.45, 1.0, -4.45], yaw: -5, pitch: -32, f: 1100, hy: 860});
export const def: Shot30 = {
  id: 'B04-SH04', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

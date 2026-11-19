import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B03-SH01 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 72;
const CAM = camLine({eye: [0.4, 1.0, 1.8], yaw: -3, pitch: 0, f: 900, hy: 860});
export const def: Shot30 = {
  id: 'B03-SH01', N, paper: '#efe6d0', overscan: true,
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

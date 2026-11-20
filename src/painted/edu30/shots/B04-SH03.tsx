import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B04-SH03 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 47;
const CAM = camLine({eye: [-6.3, 0.92, -5.75], yaw: 112, pitch: 0, f: 800, hy: 820});
export const def: Shot30 = {
  id: 'B04-SH03', N, paper: '#efe6d0', overscan: true,
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

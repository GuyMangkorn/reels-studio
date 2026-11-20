import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B04-SH06 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 24;
const CAM = camLine({eye: [-4.6, 1.45, -3.9], yaw: -57, pitch: -12, f: 950, hy: 800});
export const def: Shot30 = {
  id: 'B04-SH06', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

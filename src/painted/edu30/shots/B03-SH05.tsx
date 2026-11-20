import {camLine, DEFAULT_REEL, makeShot, stubPaint, type Shot30} from '../shot';

// B03-SH05 stub (Boss T03): the sheet camera line at L0 (projection-shots.json) held still, sky and ground wash. The plate ticket for this shot replaces the body.
const N = 21;
const CAM = camLine({eye: [-2.0, 0.75, -1.2], yaw: 148, pitch: 10, f: 1000, hy: 860});
export const def: Shot30 = {
  id: 'B03-SH05', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, _L, c) => stubPaint(p, c),
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

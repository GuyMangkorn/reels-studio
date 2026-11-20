import {camPoint} from '../../kit/ycam';
import {paintPaddockScene} from '../paddock';
import {paintTruckDust, paintTruckRig, truckDustFor, truckPoint, truckState} from '../props';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B02-SH03 (Boss T21, 2026-11-20): low heroic angle, the army arrives: one small truck (T14 drive, brake, nose dip and rock) comes along the track toward the lens and
// stops close; its dust (T14 `paintTruckDust`) rolls on and overtakes the stopped cab from L 46. Riders are silhouettes (MEREDITH in the cab, two gunners on the tray), gun cases
// on the tray. Space P through T09 `paintPaddockScene` (light m 0, eaten 0.4, track ruts, fence on the right of frame), fixed camera (SD03). Default newsreel grade.
const N = 54, SHOT = 'B02-SH03';
const CAM = camLine({eye: [-0.2, 0.4, 9.8], yaw: -85, pitch: 8, f: 850, hy: 1000});
const track = (l: number) => truckState(SHOT, l);

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, L, c, pr) => {
    const st = truckState(SHOT, L)!, dust = {truckAt: truckPoint(st.centre, 1, 0, 0, 0), ...truckDustFor(SHOT)};
    paintPaddockScene(p, c, {light: 0, eaten: 0.4}, () => {
      paintTruckDust(p, c, L, track, {part: 'far', ...dust});
    });
    const rig = paintTruckRig(p, c, {centre: st.centre, dir: st.dir, pitch: st.pitch, roll: st.roll, riders: 'silhouettes', gear: 'cases', wheelTurn: st.wheelTurn, t: L / 30, seed: 21300});
    paintTruckDust(p, c, L, track, {part: 'near', ...dust});
    // cab probe: roof front edge to the ground under the radiator, on the truck centre line (the sheet's "cab", roof y to front low y)
    const top = camPoint(rig.cam, truckPoint(st.centre, 1, 1.8, 2.12, 0)), bot = camPoint(rig.cam, truckPoint(st.centre, 1, 2.68, 0, 0));
    if (top && bot) pr?.lead('cab', {top: top[1], bottom: bot[1], x: top[0]});
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);

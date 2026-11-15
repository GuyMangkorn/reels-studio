import type {YCam} from '../../kit/ycam';
import {ease, ramp} from '../clock';
import {camSH03, paintSH03} from '../scenes-roof';
import {makeShot} from '../shot';
import {roofState} from '../stage';
import {paintBubble, paintDots} from '../thought';

// S01-B05-SH17 L08 b [1125, 1171) (sheet #18). Camera: SH03's axis, camSH03 moved 6 % toward the button ({x -0.443, y 0.407, z 0.547}, same yaw, pitch,
// f, hy), push +0..+17, still from +17. HAND_SH03 1 cm above the lit button, no movement at all (the SH03 stopped hand). Three dotted circles rise from
// the top edge (toward her head) at +31, +36, +40; the ragged circle opens from the last dot at +44 into SH18 (dissolve tail).
const CAM_END: YCam = {...camSH03, x: -0.443, y: 0.407, z: 0.547};
export const shot = makeShot('S01-B05-SH17', {
  paper: '#1c2130',
  paint: (p, L, G) => {
    const k = ease(L, 0, 17), cam: YCam = {...camSH03, x: camSH03.x + (CAM_END.x - camSH03.x) * k, y: camSH03.y + (CAM_END.y - camSH03.y) * k, z: camSH03.z + (CAM_END.z - camSH03.z) * k};
    paintSH03(p, {cam, state: roofState('S01-B05-SH17', G, {blip: 0.6})});
    // dots rise in the clear dark top-left (beside the hand, never over it) toward the top edge (her head, off-frame up); the bubble opens there
    paintDots(p, {from: [330, 560], to: [250, 150], pop: ramp(L, 29, 42), size: 1.6});
    paintBubble(p, {at: [230, -20], rx: 360, ry: 300, pop: ease(L, 44, 59)});
  },
});

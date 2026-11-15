import type {V3} from '../../kit/space';
import type {YCam} from '../../kit/ycam';
import {ease} from '../clock';
import {camSH03, paintSH03} from '../scenes-roof';
import {makeShot} from '../shot';
import {roofState} from '../stage';

// S01-B05-SH19 L13 [1323, 1450) (sheet #20). Bubble-close dissolve in [1323, 1335) is the timeline's. Camera: SH03's axis, camSH03 moved 30 % toward
// the button ({x -0.414, y 0.393, z 0.494}), slow push +12..+126 (from SH17's 6 % position), closer than any earlier shot. HAND_SH03 1 cm above the lit
// button, the only warm thing left (roof cool 0.6); no movement until "เหมือนคุณเมื่อกี้" (+98): the fingertip trembles once (about 1 px, 3 f).
const from: V3 = [-0.443, 0.407, 0.547], to: V3 = [-0.414, 0.393, 0.494];
const TREMBLE: Record<number, number> = {98: 0.0004, 99: -0.0004, 100: 0.0002};
export const shot = makeShot('S01-B05-SH19', {
  paper: '#1c2130',
  paint: (p, L, G) => {
    const k = ease(L, 12, 126), cam: YCam = {...camSH03, x: from[0] + (to[0] - from[0]) * k, y: from[1] + (to[1] - from[1]) * k, z: from[2] + (to[2] - from[2]) * k};
    paintSH03(p, {cam, off: [TREMBLE[L] ?? 0, 0, 0], state: roofState('S01-B05-SH19', G, {blip: 0.6})});
  },
});

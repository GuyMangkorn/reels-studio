import {paintDropDiagram} from '../cards';
import {ease, pw} from '../clock';
import {makeShot} from '../shot';

// S01-B03-SH02 (G 610-728, R2) water-drop card (L06b). Drop clock dropAt(t), t through (L, t): (0,0) (20,.6) (38,.9) (82,1.9) (101,2.5), held. Screen push 1.00 -> 1.08 about (540, 770) over L0-117.
export const DROP_KNOTS = [[0, 0], [20, 0.6], [38, 0.9], [82, 1.9], [101, 2.5]] as const;
export const dropPush = (L: number) => 1 + 0.08 * ease(L, 0, 117);
export const shot = makeShot('S01-B03-SH02', {
  paper: '#cfe3f6',
  camera: (L) => ({s: dropPush(L), fx: 540, fy: 770, dx: 0, dy: 0}),
  paint: (p, L) => paintDropDiagram(p, pw(L, DROP_KNOTS)),
});

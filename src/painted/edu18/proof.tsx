import {washAt} from '../kit/draw';
import type {Painter} from '../kit/painter';
import {Painted} from './look';
import {lookCam} from './cams';
import {paintWoman} from './woman';

// EDU-EP18 asset proof sheets (W5.2): each cell is one asset state through the yaw camera. Standalone entry `proof-index.ts`
// (printf 'EDU18-PR-WOMAN 0 out/edu18/proof/PR-WOMAN.png\n' | node scripts/stills.mjs src/painted/edu18/proof-index.ts).
const bg = (p: Painter) => washAt(p, 50000, '#8b949b', 255, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);

const camW = lookCam([0, 1.0, 5.2], [0, 0.9, 0], 1000);
export const PRWoman = () => (
  <Painted paint={(p) => {
    bg(p);
    paintWoman(p, camW, {at: [-1.35, 0, 0], view: 'left', named: {name: 'bag-over-head', L: 4}, face: 'worried', t: p.t});
    paintWoman(p, camW, {at: [0, 0, 0], view: 'front', named: {name: 'bag-over-head', L: 0}, face: 'worried', t: p.t});
    paintWoman(p, camW, {at: [1.35, 0, 0], view: 'front', named: {name: 'slap-ankle', L: 18}, face: 'angry', t: p.t});
    paintWoman(p, camW, {at: [-1.0, 0, -2.2], view: 'front', named: {name: 'slap-ankle', L: 32}, face: 'suspicious', t: p.t});
    paintWoman(p, camW, {at: [1.0, 0, -2.2], view: 'front', named: {name: 'pressed-spread', L: 0}, face: 'scared', t: p.t});
  }} />
);

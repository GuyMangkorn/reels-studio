import {box} from './collide';
import {YW_CAM, YW_YOU, dressAs, ywSolids} from './places';
import type {CrowdSet, Mover} from './walk';

// EG-EP02-SHORT animated Yaowarat crowd (Boss B6; the pier crowd lives in places.ts, monument and soi crowds in their sets). Positions are the look-frame
// composition at `ref` (the last frame of the cue); the paths are straight, calm and end well clear of every solid and of `คุณ`.
// `S04-B01-SH04` Yaowarat 87 f (crowd cue f42-86).

const mv = (id: string, who: Mover['who'], view: Mover['view'], x: number, z: number, pace: number, seed: number): Mover => ({id, who, view, seed, at: [x, 0, z], pace});

/** Yaowarat (S04-B01-SH04): 12 walkers on the road and both pavements, vendors, commuters, school children. */
export const YW_CROWD: CrowdSet = {
  id: 'yaowarat',
  cam: YW_CAM,
  solids: ywSolids().filter((s) => !s.id.startsWith('sign')),
  you: YW_YOU,
  bounds: box(-6.9, 5.7, 0, 3, -30, -1.2),
  ref: 86,
  cue: [42, 86],
  movers: [
    mv('w1', dressAs('woman-ponytail', 'vendor'), 'front', -2.4, -9.0, 0.9, 101),
    mv('w2', dressAs('man-buzz', 'office'), 'back', 2.8, -12.5, 1.0, 102),
    mv('w3', dressAs('girl-school'), 'front', -4.0, -7.0, 0.8, 103),
    mv('w4', dressAs('man-elder'), 'front', 3.6, -4.8, 0.7, 104),
    mv('w5', dressAs('woman-long'), 'back', -1.9, -3.4, 0.9, 105),
    mv('w6', dressAs('boy-school'), 'right', -2.4, -6.6, 0.9, 106),
    mv('w7', dressAs('man-crop'), 'left', 4.2, -10.0, 0.8, 107),
    mv('w8', dressAs('woman-pixie', 'office'), 'front', -0.9, -16.0, 0.9, 108),
    mv('w9', dressAs('man-shaved', 'office'), 'back', 1.7, -18.0, 1.0, 109),
    mv('w10', dressAs('woman-ponytail', 'nurse'), 'front', 4.7, -15.0, 0.8, 110),
    mv('w11', dressAs('man-parted'), 'right', -3.5, -13.5, 0.9, 111),
    mv('w12', dressAs('woman-elder'), 'back', 1.6, -8.6, 0.6, 112),
  ],
};

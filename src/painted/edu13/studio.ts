import {hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {wFill, wInk, wWash} from '../edu02/world';

// SET-STUDIO (brief EDU-EP13-BRIEF-R1 "Set plan — SET-STUDIO"): a seamless paper sweep, floor plane y 0 from z -8 to +20, curving up (radius 4)
// to a back wall at z -8 rising to y 30; at macro scale a faint paper fibre texture, no ruler, no props. Units are the camera's (mm for the
// macro flea, metres for the B02 insert), so one function serves both. Soft light from top front (the screen glow is `Glow` in look.tsx).
export const PAPER = {floor: '#efe8d8', floorFar: '#e2d8c2', wall: '#e6dcc6', wallTop: '#d6cab2', fibre: '#b8a98c'} as const;

export const paintStudio = (p: Painter, c: YCam, o: {fibre?: boolean} = {}) => {
  hardFill(p, 6999, PAPER.wall, [[-200, -200], [1300, -200], [1300, 2200], [-200, 2200]]);
  // back wall z -8 (y 4 .. 30), the curve (radius 4 about z -4, y 4), the floor z -4 .. 20
  wFill(p, c, 7000, mixColor(PAPER.wall, PAPER.wallTop, 0.4), [[-60, 4, -8], [60, 4, -8], [60, 30, -8], [-60, 30, -8]]);
  const N = 10;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * (Math.PI / 2), a1 = ((i + 1) / N) * (Math.PI / 2);
    const pt = (a: number, x: number): V3 => [x, 4 - 4 * Math.cos(a), -4 - 4 * Math.sin(a)];
    wFill(p, c, 7010 + i, mixColor(PAPER.floorFar, PAPER.wall, i / N), [pt(a0, -60), pt(a0, 60), pt(a1, 60), pt(a1, -60)]);
  }
  wFill(p, c, 7030, PAPER.floor, [[-60, 0, -4], [60, 0, -4], [60, 0, 20], [-60, 0, 20]]);
  wWash(p, c, 7031, '#fffaf0', 90, [[-6, 0.001, -3], [6, 0.001, -3], [10, 0.001, 8], [-10, 0.001, 8]], 0.4, 0.4); // top-front key pool on the paper
  if (o.fibre) for (let k = 0; k < 90; k++) {
    const x = -8 + 16 * hash(k * 3.7), z = -3 + 9 * hash(k * 5.3), a = hash(k * 9.1) * 6.283, l = 0.12 + 0.2 * hash(k * 2.9);
    wInk(p, c, 7100 + k, [[x, 0.001, z], [x + l * Math.cos(a), 0.001, z + l * Math.sin(a) * 0.5]], {closed: false, weight: 0.5, color: PAPER.fibre});
  }
};

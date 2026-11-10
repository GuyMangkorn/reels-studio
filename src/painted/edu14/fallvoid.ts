// SET-FALL no-air void (N5; B01-SH06): grey void with the cloud base receding above, three still mist shreds at 3 / 12 / 30 m passing up (each faster than the last, the
// speed rising with the fall) and the city far below in haze. Screen space (the camera follows the drop at r 0.04 m, 30 px/mm); `L` is the shot-local frame.
import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter} from '../kit/painter';
import {sm} from './clock';

export const FALL_DROP_AT: [number, number] = [540, 760];
/** Screen y of the cloud base edge (starts at 175, rises off-frame by about +24). */
export const cloudBaseY = (L: number) => 175 - 8.5 * L - 0.1 * L * L;
export const shredY = (i: number, L: number) => [1240, 1500, 1750][i] - [9, 17, 31][i] * (L + 0.03 * L * L);

export const paintFallVoid = (p: Painter, o: {L: number}) => {
  const {L} = o;
  hardFill(p, 27000, '#838b8d', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  hardFill(p, 27001, '#939b9e', [[-20, 380], [1100, 380], [1100, 1100], [-20, 1100]]);
  washAt(p, 27002, '#a3abae', 120, ell(540, 700, 700, 640, 24), 0.5, 0.4);
  // cloud base above, receding
  const yb = cloudBaseY(L);
  if (yb > -80) {
    hardFill(p, 27010, '#4a565c', [[-20, -40], [1100, -40], [1100, yb], [-20, yb]]);
    for (let x = -20; x < 1100; x += 60) washAt(p, 27020 + x, '#657279', 140, ell(x + 30, yb + 4, 46, 12 + 8 * hash(27030 + x), 12), 0.3, 0.3);
    washAt(p, 27011, '#aeb9be', 90, ell(540, yb + 14, 480, 10, 20), 0.2, 0.2);
  }
  // three still mist shreds (no internal motion), wider and brighter the nearer
  [[520, 150, 36, 'near'], [260, 90, 24, 'mid'], [820, 60, 15, 'far']].slice().reverse().forEach(([x, rx, ry], k) => {
    const i = 2 - k, y = shredY(i, L);
    if (y > -200 && y < 2100) { washAt(p, 27100 + i * 20, '#b9c1c4', 150 - i * 20, ell(x as number, y, (rx as number) * 2.2, (ry as number) * 1.5, 22), 0.5, 0.4); washAt(p, 27101 + i * 20, '#cfd5d7', 130, ell((x as number) - 20, y - 6, (rx as number) * 1.4, (ry as number), 18), 0.4, 0.4); }
  });
  // the city far below in haze (grows slowly as the fall goes on)
  const top = 1640 - 70 * sm(0, 65, L);
  hardFill(p, 27200, '#788083', [[-20, top], [1100, top], [1100, 1940], [-20, 1940]]);
  for (let i = 0; i < 18; i++) hardFill(p, 27210 + i, i % 2 ? '#6d7578' : '#7c8487', [[i * 62, top - 14 - hash(27300 + i) * 50 * (1 + L / 120)], [i * 62 + 56, top - 14 - hash(27300 + i) * 50 * (1 + L / 120)], [i * 62 + 56, top + 6], [i * 62, top + 6]]);
};

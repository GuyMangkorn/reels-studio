import {ease, lenOf} from '../clock';
import {Glow} from '../overlay';
import {makeShot} from '../shot';
import {dashRun, earthAt, paintSpace, spaceCam} from '../space';
import type {V3} from '../../kit/space';

// S01-B04-SH03 (G1160-1245): Earth goes straight (L09). Dark Earth (night side, city specks, blue rim) starts at earthAt(-45) on L0 and moves at constant speed along the
// tangent (0.707, 0, -0.707), 0.55 su over L0-85, leaving a faint straight dashed trail; the orbit line curves on, empty. Camera spaceCam((0.95, 0, 0.45), az 10 -> 14, el 28,
// r 1.60 -> 1.75, f 880, hy 1000). The Sun is gone and the ring is beyond the frame.
const ID = 'S01-B04-SH03', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return spaceCam([0.95, 0, 0.45], 10 + 4 * e, 28, 1.6 + 0.15 * e, 880, 1000); };
const A = earthAt(-45), T: V3 = [Math.SQRT1_2, 0, -Math.SQRT1_2];
const travelled = (L: number) => (0.55 * L) / N;

export const shot = makeShot(ID, {
  paper: '#070b1a',
  paint: (p, L, G) => {
    const d = travelled(L), pos: V3 = [A[0] + T[0] * d, 0, A[2] + T[2] * d];
    paintSpace(p, cam(L), {t: G / 30, sun: 0, earthPos: pos, dark: 1, after: (q, c, rect) => { if (d > 0.03) dashRun(q, c, rect, 6800, A, [A[0] + T[0], 0, A[2] + T[2]], 0, d - 0.1, {pitch: 0.1, len: 0.045, lvl: 0.55}); }});
  },
  overlay: (L) => <Glow cam={cam(L)} sun={0} />,
});

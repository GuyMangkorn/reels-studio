import {clamp01, ease, lenOf} from '../clock';
import {Card, Glow} from '../overlay';
import {makeShot} from '../shot';
import {camPoint, camUnit} from '../../kit/ycam';
import type {V3} from '../../kit/space';
import {dashRun, paintJupiter, paintSpace, spaceCam} from '../space';

// S01-B04-SH06 (G1212-1300): the two legs of light (L12), a replay diagram, not the +1 h world. Empty spot at the origin; dark Earth just off its orbit at (0.90, 0, 0.55);
// Jupiter r 0.16 su, banded, lit only on its Sun-facing half at (-2.08, 0, -1.20). Both dash streams move at 0.030 su/f: the incoming tail is 1.77 su from the origin at L0 and
// reaches Jupiter (2.40 su) on L21, Jupiter's lit half goes dark L21-29; the reflected dashes leave Jupiter toward Earth, their tail leaves Jupiter at L29 and is mid-way
// (1.73 of 3.46 su) on L87. Card holds "+1 ชม.". Camera spaceCam((-0.60, 0, 0), az 0, el 40, r 5.40 -> 5.25, f 880, hy 1000).
const ID = 'S01-B04-SH06', N = lenOf(ID);
const cam = (L: number) => spaceCam([-0.6, 0, 0], 0, 40, 5.4 - 0.15 * ease(L, 0, N - 1), 880, 1000);
const JUP: V3 = [-2.08, 0, -1.2], EARTH: V3 = [0.9, 0, 0.55], O: V3 = [0, 0, 0];
const D_IN = Math.hypot(...JUP), D_OUT = Math.hypot(EARTH[0] - JUP[0], EARTH[1] - JUP[1], EARTH[2] - JUP[2]);

export const shot = makeShot(ID, {
  paper: '#070b1a',
  paint: (p, L, G) => {
    const c = cam(L), v = 0.03;
    paintSpace(p, c, {t: G / 30, sun: 0, earthPos: EARTH, dark: 1, after: (q, cc, rect) => {
      dashRun(q, cc, rect, 6900, O, JUP, Math.min(D_IN - 0.17, 1.77 + v * L), D_IN - 0.17, {pitch: 0.12, len: 0.05});
      dashRun(q, cc, rect, 6950, JUP, EARTH, Math.max(0.17, v * (L - 29)), Math.min(D_OUT - 0.14, 0.9 + v * L), {pitch: 0.12, len: 0.05, lvl: 0.85});
      const jq = camPoint(cc, JUP), sq = camPoint(cc, O);
      if (jq && sq) paintJupiter(q, jq[0], jq[1], 0.16 * camUnit(cc, JUP), sq, 1 - clamp01((L - 21) / 8));
    }});
  },
  overlay: (L, G) => <><Glow cam={cam(L)} sun={0} /><Card G={G} text="+1 ชม." /></>,
});

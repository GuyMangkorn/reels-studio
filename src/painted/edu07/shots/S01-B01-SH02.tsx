import {ell, washAt} from '../../kit/draw';
import {mixColor} from '../../kit/painter';
import {camPoint, camUnit} from '../../kit/ycam';
import {ease, lenOf, pestleStroke as _p, ramp, ringR} from '../clock';
import {Glow} from '../overlay';
import {makeShot} from '../shot';
import {paintSpace, spaceCam, SUN_R, T_SPACE} from '../space';

// S01-B01-SH02 (G33-170): the Sun blinks out (L01b, L02). Space camera az 1.5 -> 3, r 2.15 -> 2.10 (LF04 at L0). The Sun is lit L0-13 (bloom L12-13 on "ตอนนี้"),
// the disc is gone from L14 and the halo collapses L14-21. From L14 the dash stream keeps flowing to Earth, its tail and the ring grow 0 -> 0.10 su by L137.
const ID = 'S01-B01-SH02', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return spaceCam(T_SPACE, 1.5 + 1.5 * e, 46, 2.15 - 0.05 * e, 880, 940); };
const halo = (L: number) => (L < 14 ? 1 : 1 - ramp(L, 14, 21));
void _p;

export const shot = makeShot(ID, {
  paper: '#070b1a',
  paint: (p, L, G) => {
    const c = cam(L), R = ringR(G), pre = L < 14;
    paintSpace(p, c, {t: G / 30, sun: pre ? 1 : 0, earthPhi: -60, earthK: 1.4, spray: true, ring: R > 0.004 ? R : undefined, flow: (G * 0.035) % 1,
      ...(pre ? {beamFrom: 0} : {beamTail: R}),
      after: (q) => { // bloom: the Sun swells for two frames before it goes
        const sp = camPoint(c, [0, 0, 0]);
        if (sp && (L === 12 || L === 13)) { const r = SUN_R * camUnit(c, [0, 0, 0]) * 1.7; washAt(q, 6700, mixColor('#070b1a', '#ffe9a8', 0.6), 130, ell(sp[0], sp[1], r, r, 30), 0.3, 0.2); }
      }});
  },
  overlay: (L) => <Glow cam={cam(L)} sun={halo(L)} />,
});

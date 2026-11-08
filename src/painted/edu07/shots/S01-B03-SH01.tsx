import {nearCam} from '../cast';
import {ease, lenOf} from '../clock';
import {Card, Glow} from '../overlay';
import {makeShot} from '../shot';
import {CUS_AT, orbit, T_STALL} from '../soi';
import {paintSplit, SEAM} from '../split';
import {spaceCam} from '../space';

// S01-B03-SH01 (G395-559): Earth keeps curving (L05, R1.2 rates: card 07:11 -> 02:02). CUS fans himself (kit `fan-self` menu, 2 flaps/s). Space az 4 -> 7, street az 28 -> 26. The motorbike pass is sound only: z +3.5 lies behind the street camera (z 2.94).
const ID = 'S01-B03-SH01', N = lenOf(ID);
const cams = (L: number) => {
  const e = ease(L, 0, N - 1);
  return {space: spaceCam([0.2, 0, 0.18], 4 + (7 - 4) * e, 40, 2.15, 740, 430), street: orbit(T_STALL, 28 + (26 - 28) * e, 3.8, 1.3, 4, 900, 960)};
};

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const c = cams(L), fl = Math.sin((2 * Math.PI * 2 * L) / 30);
    paintSplit(p, {G, camSpace: c.space, camStreet: c.street, cus: {shadowFirst: true, face: 'tired', hands: {r: {to: nearCam(c.street, CUS_AT, -0.2, 1.1 + 0.05 * fl, 0.24), out: -1}}, fan: 0.5 * fl}});
  },
  overlay: (L, G) => <><Glow cam={cams(L).space} y1={SEAM} sun={0} /><Card G={G} /></>,
});

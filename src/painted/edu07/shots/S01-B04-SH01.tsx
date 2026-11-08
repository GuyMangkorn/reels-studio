import {ease, G_ZERO, lenOf} from '../clock';
import {Card, Glow} from '../overlay';
import {makeShot} from '../shot';
import {orbit, T_STALL} from '../soi';
import {paintSplit, SEAM} from '../split';
import {spaceCam} from '../space';

// S01-B04-SH01: 00:00 and the sky goes dark (L08). Static cameras (space az 10, street az 26); G784 = L24: card 00:00, ring meets the limb, Earth and street go dark.
const ID = 'S01-B04-SH01', N = lenOf(ID);
const cams = (L: number) => {
  const e = ease(L, 0, N - 1);
  return {space: spaceCam([0.2, 0, 0.18], 10 + (10 - 10) * e, 40, 2.15, 740, 430), street: orbit(T_STALL, 26 + (26 - 26) * e, 3.8, 1.3, 4, 900, 960)};
};

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => { const c = cams(L); paintSplit(p, {G, camSpace: c.space, camStreet: c.street, ven: G >= G_ZERO + 4 ? {pounding: true, face: 'surprised'} : undefined, cus: G >= G_ZERO + 4 ? {shadowFirst: true, face: 'surprised'} : {shadowFirst: true}}); },
  overlay: (L, G) => <><Glow cam={cams(L).space} y1={SEAM} sun={0} /><Card G={G} /></>,
});

import {ease, lenOf} from '../clock';
import {Card, Glow} from '../overlay';
import {makeShot} from '../shot';
import {orbit, T_STALL} from '../soi';
import {paintSplit, SEAM} from '../split';
import {spaceCam} from '../space';

// S01-B02-SH01: split frame, the card at 08:19 (L03). Space az 2 -> 4, street az 30 -> 28 (LF02 cameras); card pops in on L0..6.
const ID = 'S01-B02-SH01', N = lenOf(ID);
const cams = (L: number) => {
  const e = ease(L, 0, N - 1);
  return {space: spaceCam([0.2, 0, 0.18], 2 + (4 - 2) * e, 40, 2.15, 740, 430), street: orbit(T_STALL, 30 + (28 - 30) * e, 3.8, 1.3, 4, 900, 960)};
};

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => { const c = cams(L); paintSplit(p, {G, camSpace: c.space, camStreet: c.street}); },
  overlay: (L, G) => <><Glow cam={cams(L).space} y1={SEAM} sun={0} /><Card G={G} popFrom={170} /></>,
});

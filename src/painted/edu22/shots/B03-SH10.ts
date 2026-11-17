import {CALLER} from '../cast';
import {LIGHT_DAY, tasterStand} from '../crew';
import {paintHall} from '../hall';
import {add3, paintPerson, ramp} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {lifterItems, sheetMove, shotCam, T_MARK, Y_MARK} from '../stage';

// B03-SH10 · G 740-800 (60 f) · the young eunuch's call (EDU-EP22-SCENES-R1). Close on caller Y (teen head, light-blue robe, court cap) on his
// call mark (-2.70, 0, +2.70), front three-quarter turned toward the lifters at screen left (kit `quarter: 'left'`), P01, mouth closed l 0-40,
// chin up l 40-46 (`nod` up), the call: mouth open (`talk`) from l 45 (G 785 "เปิด") to the cut. LT (covers on, A01 covered after SH09) and the
// lifters soft behind; T at his half-step position, hands folded.
const N = 60;
const M = sheetMove([-2.75, 1.42, 2.7], [20, 14], [1.2, 1.05], 1.45, {f: 1100, hy: 760});
export const def: Shot22 = {
  id: 'B03-SH10', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c) => {
    const t = L / 30, up = ramp(L, 40, 46), call = L >= 45;
    paintHall(p, c, {
      light: LIGHT_DAY,
      longTable: {covers: 'on'},
      items: [...lifterItems(t), tasterStand(t, add3(T_MARK, [0, 0, -0.18]), {view: 'left'}),
        {at: Y_MARK, bias: 0, draw: (q, cc) => {
          paintPerson(q, cc, CALLER, {at: Y_MARK, t, view: 'front', seed: CALLER.seed, face: call ? 'talk' : 'neutral',
            faceState: call ? {mouth: 'shout', open: 0.55 + 0.25 * ramp(L, 45, 50)} : {look: [-0.6, 0]},
            fig: {quarter: 'left', nod: [0, -0.09 * up], headCock: -3 * up}});
        }}],
    });
  },
};
export const shot = makeShot(def);

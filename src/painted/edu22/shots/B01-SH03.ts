import type {Pt} from '../../kit/painter';
import {LIGHT_DAY} from '../crew';
import {paintHall} from '../hall';
import {lerp, ramp} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {childItems, lifterItems, paintTrayLoad, sheetMove, shotCam} from '../stage';

// B01-SH03 · G 140-244 (104 f) · the emperor does not touch it (EDU-EP22-SCENES-R1). CHILD front P31 neutral; pupils sweep from LT's far end to
// beyond it l 6-40; `turn-head-right` l 40-46 (eyes lead, the head swaps to the right profile at l 43, landing l 46 = G 186 "ไม่แตะ"); a small
// `surprised` lift l 90-100 as the first tray edge appears; a faint warm spill on his right cheek from l 46 (the hall light's warm grows). The tray
// TR1's leading edge (+0.60 -> +0.21, 1.10, -0.75) l 86-103 on carrier K1's line z -0.75 (body out of frame right).
const N = 104;
const M = sheetMove([-0.25, 0.98, -0.72], [34, 28], [1.4, 1.28], 1.08, {f: 1150, hy: 760});
export const def: Shot22 = {
  id: 'B01-SH03', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, sweep = ramp(L, 6, 40), turn = ramp(L, 40, 43);
    const look: Pt = L < 43 ? [lerp(-1.35, -1.7, sweep) + 2.6 * turn, 0.1] : [0.6, 0.05];
    const face = L >= 90 ? 'surprised' : 'neutral';
    const fig = {head: L >= 43 ? 'right' as const : 'front' as const, nod: [L < 43 ? 0.05 * turn : 0, L >= 90 ? -0.04 * ramp(L, 90, 96) : 0] as Pt};
    // tray leading edge on z -0.75 at y 1.10 (carried at chest height); tray centre 0.29 m behind the edge (+x)
    const edge = lerp(0.6, 0.21, Math.min(1, Math.max(0, (L - 86) / 17))), show = L >= 86;
    paintHall(p, c, {
      light: {...LIGHT_DAY, warm: 0.4 + 0.25 * ramp(L, 46, 103)},
      longTable: {covers: 'on'},
      items: [...childItems({t, face, look, fig}, pr), ...lifterItems(t),
        ...(show ? [{at: [edge + 0.29, 0, -0.75] as [number, number, number], bias: -0.1, draw: (q: Parameters<typeof paintTrayLoad>[0], cc: Parameters<typeof paintTrayLoad>[1]) => paintTrayLoad(q, cc, 0, [edge + 0.29, 1.1, -0.75], 0, false)}] : [])],
    });
  },
};
export const shot = makeShot(def);

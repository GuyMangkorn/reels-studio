import type {Pt} from '../../kit/painter';
import {LIGHT_DAY} from '../crew';
import {paintHall} from '../hall';
import {ramp} from '../motion22';
import {makeShot, type Shot22} from '../shot';
import {childItems, lifterItems, sheetMove, shotCam} from '../stage';

// B02-SH04 · G 244-274 (30 f) · "huh?" (EDU-EP22-SCENES-R1). A 1 s punch-in on the child: P31 leaning toward +x (screen right, 8 deg) with
// `headCock` right l 0-8, `suspicious` l 0-19 -> `surprised` l 19-30 ("อ้าว" G 263), eyes right (match on SH03's turned head), the warm door light
// on that side. W5.1 deviation: the sheet's front three-quarter is drawn as the front card with the head turned right (the kit's quarter body has
// no seated pose: figure-at `quarter` supports standing, walk and lean only).
const N = 30;
const M = sheetMove([0.0, 1.08, -0.72], [22, 18], [0.95, 0.85], 1.1, {f: 1150, hy: 760});
export const def: Shot22 = {
  id: 'B02-SH04', N,
  cam: (L) => shotCam(M, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, k = ramp(L, 0, 8), look: Pt = [0.8, 0.05];
    const face = L < 19 ? 'suspicious' : 'surprised';
    paintHall(p, c, {
      light: {...LIGHT_DAY, warm: 0.65},
      longTable: {covers: 'on'},
      items: [...childItems({t, face, look, fig: {lean: (8 * Math.PI / 180) * k, headCock: 9 * k, head: 'front'}}, pr), ...lifterItems(t)],
    });
  },
};
export const shot = makeShot(def);

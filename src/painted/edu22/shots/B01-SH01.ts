import {makeShot, type Shot22} from '../shot';
import {LIGHT_DAY} from '../crew';
import {paintHall} from '../hall';
import {SH01} from '../looks';
import {childItems, lifterItems, shotCam} from '../stage';

// B01-SH01 · G 0-37 (37 f) · frame 0, the child and the long table (EDU-EP22-SCENES-R1). Camera = LF01's line (binding hy 580), 8 deg arc, 7 % push,
// sine. CHILD P31 front squared to the lens, neutral (bored), pupils toward LT (-1.35, 0.1) as LF01; lifters E1-E3 P01 front; covers all on; CT
// empty. W5.1 deviation: the dangling-feet swing is not drawn (the kit leg swing `legKick` is a standing motion; P31 legs stay still).
const N = 37;
export const def: Shot22 = {
  id: 'B01-SH01', N,
  cam: (L) => shotCam(SH01, N, L),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    paintHall(p, c, {light: LIGHT_DAY, longTable: {covers: 'on'}, items: [...childItems({t, face: 'neutral', look: [-1.35, 0.1]}, pr), ...lifterItems(t, pr)]});
  },
};
export const shot = makeShot(def);

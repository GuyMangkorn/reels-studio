import {CAM, LOOK_BALLOON, camMove, endLean, endU} from '../drive';
import {makeShot, type CabinShotDef} from '../shot';

// B05-SH03 · G1332-1619 (287 f; SS-R5, SS-R4 258, SS-R3 172) · L13 "เพราะคราวนี้ อากาศด้านหน้ากลับดันแรงกว่าด้านหลังนั่นเอง" (narration R2,
// spoken G1333-1438). Camera D held to local 133 (G1465). Held u -0.20, lean +0.07, surprised while the PX20-B inset plays (overlay
// G1340-1461). END20 from G1465 (drive.ts `endU`/`endLean`): balloon settles upright with the kit's cruise release (taper to 0 by G1585),
// lean +0.07 -> 0 by G1495, face surprised -> neutral at G1475, camera D -> A by ss(1465,1585) and held A to the end; A_fade over the
// last 40 f G1579-1619 (index.ts).
const N = 287;
export const B05_SH03: CabinShotDef = {
  id: 'B05-SH03', N,
  cam: (L) => camMove(CAM.D, CAM.A, L, 133, 253),
  state: (_L, G) => ({lean: endLean(G), u: endU(G), face: G < 1475 ? 'surprised' : 'neutral', faceState: {look: LOOK_BALLOON}}),
};
export const shot = makeShot(B05_SH03);
